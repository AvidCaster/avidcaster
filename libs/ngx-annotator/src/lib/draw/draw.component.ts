/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, fromEvent } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Line, Point } from '../annotator.model';
import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements OnInit, OnDestroy {
  @ViewChild('annotationCanvas', { static: true }) canvas: ElementRef | undefined;
  @ViewChild('annotationSvg', { static: true }) svg: ElementRef | undefined;
  private destroy$ = new Subject<boolean>();
  private svgEl: HTMLElement | undefined | null;
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private rect: DOMRect | undefined;
  private lines: Line[] = [];
  private screenSize: Point = { x: 0, y: 0 };

  constructor(
    readonly zone: NgZone,
    readonly uix: UixService,
    readonly annotation: AnnotatorService
  ) {
    this.uix.addClassToBody('annotation-canvas');
  }

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
  }

  private trashSub() {
    this.annotation.trash$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doTrash();
      },
    });
  }

  doTrash() {
    this.lines = [];
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
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => {
            this.annotation.drawLineOnCanvas(line, this.ctx);
          });
      }
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
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => this.annotation.drawLineOnCanvas(line, this.ctx));
      }
    }
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
    this.rect = this.canvasEl.getBoundingClientRect();
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        this.screenSize = size;
        this.canvasEl.width = size.x;
        this.canvasEl.height = size.y;
        this.canvasEl.style.width = `${size.x}px`;
        this.canvasEl.style.height = `${size.y}px`;
        this.svgEl.setAttribute('width', `${size.x}px`);
        this.svgEl.setAttribute('height', `${size.y}px`);
        this.annotation.resetCanvas(this.canvasEl, this.ctx);
        this.rect = this.canvasEl.getBoundingClientRect();
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => this.annotation.drawLineOnCanvas(line, this.ctx));
      },
    });
  }

  private captureEvents() {
    const svgLines: SVGLineElement[] = [];
    let line: Line = this.annotation.cloneLine();
    this.zone.runOutsideAngular(() => {
      this.annotation
        .fromEvents(this.canvasEl, ['mousedown', 'touchstart'])
        .pipe(
          switchMap(() => {
            return this.annotation.fromEvents(this.canvasEl, ['mousemove', 'touchmove']).pipe(
              tap(() => {
                if (!line) {
                  line = this.annotation.cloneLine();
                }
              }),
              finalize(() => {
                if (line.points.length) {
                  // abandon hidden lines "the undo(s)" on any further update
                  this.lines = this.lines
                    .filter((lineItem) => lineItem.visible)
                    .concat({ ...line, attributes: this.annotation.getCanvasAttributes() });
                  this.zone.run(() => {
                    // draw the line on the background canvas
                    this.annotation.drawLineOnCanvas(line, this.ctx);
                    line = undefined;

                    // remove the temporary line from the foreground svg
                    svgLines.forEach((svgLine) => svgLine.remove());
                    svgLines.length = 0;
                  });
                }
              }),
              takeUntil(fromEvent(this.canvasEl, 'mouseup')),
              takeUntil(fromEvent(this.canvasEl, 'mouseleave')),
              takeUntil(fromEvent(this.canvasEl, 'touchend'))
            );
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (event: MouseEvent | TouchEvent) => {
            const to: Point = this.annotation.getEventPoint(event, this.rect);

            // add the point to the line for the background canvas
            const pointAdded = this.annotation.addPoint(to, line);

            if (pointAdded) {
              this.zone.run(() => {
                const from = line.points.length > 1 ? line.points[line.points.length - 2] : to;

                // draw a temp line live on the foreground svg
                const svgLine = this.annotation.drawLineOnSVG(
                  from,
                  to,
                  this.svgEl,
                  line.attributes
                );
                svgLines.push(svgLine);
              });
            }
          },
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('annotation-canvas');
  }
}
