/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, interval } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import {
  ANNOTATOR_FADER_FREQUENCY_IN_MILLISECONDS,
  ANNOTATOR_FADER_KEEP_IN_SECONDS,
} from '../annotator.default';
import { Line, Point } from '../annotator.model';
import { AnnotatorService } from '../annotator.service';
import { downloadPng } from '../annotator.util';

@Component({
  selector: 'fullerstack-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawComponent implements OnInit, OnDestroy {
  @ViewChild('annotationCanvas', { static: true }) canvas: ElementRef | undefined;
  @ViewChild('annotationSvg', { static: true }) svg: ElementRef | undefined;
  private destroy$ = new Subject<boolean>();
  private svgEl: HTMLElement | undefined | null;
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private trashedLines: Line[] = [];
  private lines: Line[] = [];
  private canFade = false;

  constructor(readonly uix: UixService, readonly annotation: AnnotatorService) {}

  ngOnInit() {
    this.svgEl = this.svg?.nativeElement;
    this.canvasEl = this.canvas?.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    setTimeout(() => {
      this.annotation.setCanvasAttributes(this.ctx, this.annotation.state);
    }, 100);
    this.resizeCanvas();
    this.captureEvents();
    this.trashSub();
    this.undoSub();
    this.redoSub();
    this.stateSub();
    this.saveSub();
    this.faderSub();
    this.addAttrStyles();
  }

  private faderSub() {
    interval(ANNOTATOR_FADER_FREQUENCY_IN_MILLISECONDS)
      .pipe(
        filter(() => this.annotation.state.fader && this.canFade),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.annotation.reduceCanvasAlpha(this.canvasEl, this.ctx);
        },
      });
  }

  private trashSub() {
    this.annotation.trash$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doTrash();
      },
    });
  }

  doTrash() {
    if (this.lines.length) {
      this.trashedLines = this.lines;
      this.lines = [];
    }
    this.annotation.resetCanvas(this.canvasEl, this.ctx);
  }

  private undoSub() {
    this.annotation.undo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doUndo();
      },
    });
  }

  doUndo() {
    if (this.lines.length) {
      const atLeastOneVisibleLineToUndo = this.lines[0]?.visible;
      if (atLeastOneVisibleLineToUndo) {
        this.annotation.undoLastLine(this.lines);
        this.annotation.resetCanvas(this.canvasEl, this.ctx);
        this.redrawLines();
      }
    } else if (this.trashedLines.length) {
      this.lines = this.trashedLines;
      this.trashedLines = [];
      this.annotation.resetCanvas(this.canvasEl, this.ctx);
      this.redrawLines();
    }
  }

  private redoSub() {
    this.annotation.redo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doRedo();
      },
    });
  }

  doRedo() {
    if (this.lines.length) {
      const atLeastOneInvisibleLineToRedo = !this.lines[this.lines.length - 1].visible;
      if (atLeastOneInvisibleLineToRedo) {
        this.annotation.redoLastLine(this.lines);
        this.annotation.resetCanvas(this.canvasEl, this.ctx);
        this.redrawLines();
      }
    }
  }

  private saveSub() {
    this.annotation.save$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        downloadPng(this.uix.window, this.canvasEl, this.ctx);
      },
    });
  }

  private stateSub() {
    this.annotation.stateSub$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (state) => {
          this.annotation.setCanvasAttributes(this.ctx, state);
        },
      });
  }

  private resizeCanvas() {
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        this.canvasEl.width = size.x;
        this.canvasEl.height = size.y;
        this.canvasEl.style.width = `${size.x}px`;
        this.canvasEl.style.height = `${size.y}px`;
        this.svgEl.setAttribute('width', `${size.x}px`);
        this.svgEl.setAttribute('height', `${size.y}px`);
        this.annotation.resetCanvas(this.canvasEl, this.ctx);
        this.redrawLines();
      },
    });
  }

  private captureEvents() {
    let line: Line = this.annotation.cloneLine();
    this.annotation
      .fromEvents(this.canvasEl, ['mousedown', 'touchstart'])
      .pipe(
        switchMap(() => {
          return this.annotation.fromEvents(this.canvasEl, ['mousemove', 'touchmove']).pipe(
            tap(() => {
              if (!line) {
                line = this.annotation.cloneLine();
              }

              // fader should be disabled when drawing
              this.canFade = false;
            }),
            finalize(() => {
              if (line.points.length) {
                // abandon hidden lines "the undo(s)" on any further update
                this.lines = this.lines.filter((lineItem) => lineItem.visible).concat(line);

                // if fader is on, remove the lines that have faded out already
                if (this.annotation.state.fader) {
                  const dateTime = new Date().getTime();
                  this.lines = this.lines.filter((lineItem) => {
                    // when in fader mode, only keep the lines that are under 10 seconds old
                    return dateTime - lineItem.timestamp < ANNOTATOR_FADER_KEEP_IN_SECONDS;
                  });
                }

                // draw the line on the background canvas
                this.annotation.drawLineOnCanvas(line, this.ctx);

                // remove the temporary line from the foreground svg
                this.svgEl.innerHTML = '';
                line = undefined;

                // fader can be enabled again now that the drawing is done
                this.canFade = true;
              }
            }),
            takeUntil(
              this.annotation.fromEvents(this.canvasEl, ['mouseup', 'mouseleave', 'touchend'])
            )
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (event: MouseEvent | TouchEvent) => {
          const to: Point = this.annotation.getEventPoint(event);

          // add the point to the line for the background canvas
          const pointAdded = this.annotation.addPoint(to, line);

          if (pointAdded) {
            const from = line.points.length > 1 ? line.points[line.points.length - 2] : to;

            // draw a temp line, 'live', on the foreground svg
            this.annotation.drawLineOnSVG(from, to, this.svgEl, line.attributes);
          }
        },
      });
  }

  // redraw the lines on the background canvas
  private redrawLines() {
    this.lines
      .filter((line) => line.visible)
      .forEach((line) => this.annotation.drawLineOnCanvas(line, this.ctx));
  }

  get eraserCursorClass(): string {
    if (this.annotation.state.eraser) {
      if (this.annotation.isBackgroundWhite()) {
        return 'cursor-eraser-black';
      } else {
        return 'cursor-eraser-white';
      }
    }
    return '';
  }

  addAttrStyles(): void {
    this.uix.addClassToBody('annotation-draw');
  }

  removeAttrStyles(): void {
    this.uix.removeClassFromBody('annotation-draw');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.removeAttrStyles();
  }
}
