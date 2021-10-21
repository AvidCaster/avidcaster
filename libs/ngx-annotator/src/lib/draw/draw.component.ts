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
import Hls from 'hls.js';
import { Subject, fromEvent } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Line, Point } from '../annotator.model';
import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawComponent implements OnInit, OnDestroy {
  @ViewChild('annotationCastable', { static: true }) castable: ElementRef | undefined;
  @ViewChild('annotationVideo', { static: true }) video: ElementRef | undefined;
  @ViewChild('annotationCanvas', { static: true }) canvas: ElementRef | undefined;
  @ViewChild('annotationSvg', { static: true }) svg: ElementRef | undefined;
  private destroy$ = new Subject<boolean>();
  private castableEl: HTMLMediaElement | undefined | null;
  private videoEl: HTMLMediaElement | undefined | null;
  private svgEl: HTMLElement | undefined | null;
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private rect: DOMRect | undefined;
  private trashedLines: Line[] = [];
  private lines: Line[] = [];
  private hls: Hls | undefined;

  constructor(
    readonly hostElement: ElementRef,
    readonly uix: UixService,
    readonly annotation: AnnotatorService
  ) {
    this.uix.addClassToBody('annotation-canvas');
    if (!Hls.isSupported()) {
      throw Error('HLS.js is not supported');
    }
  }

  ngOnInit() {
    this.castableEl = this.castable?.nativeElement;
    this.videoEl = this.video?.nativeElement;
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
    this.establishHlsStream();
  }

  private establishHlsStream(): void {
    let src = '';
    src = 'https://rcavlive.akamaized.net/hls/live/664045/cancbvt/master_1800.m3u8';
    src = 'https://adultswim-vodlive.cdn.turner.com/live/rick-and-morty/stream.m3u8';
    if (this.hls) {
      this.hls.destroy();
    }
    this.hls = new Hls({ startLevel: 2, capLevelToPlayerSize: true });
    this.hls.attachMedia(this.videoEl);
    this.hls.loadSource(src);
    // this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
    //   this.videoEl.volume = 100;
    //   this.videoEl.muted = false;
    //   this.videoEl.play();
    // });
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
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => {
            this.annotation.drawLineOnCanvas(line, this.ctx);
          });
      }
    } else if (this.trashedLines.length) {
      this.lines = this.trashedLines;
      this.trashedLines = [];
      this.annotation.resetCanvas(this.canvasEl, this.ctx);
      this.lines
        .filter((line) => line.visible)
        .forEach((line) => {
          this.annotation.drawLineOnCanvas(line, this.ctx);
        });
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
        this.canvasEl.setAttribute('width', `${size.x}px`);
        this.canvasEl.setAttribute('height', `${size.y}px`);
        this.svgEl.setAttribute('width', `${size.x}px`);
        this.svgEl.setAttribute('height', `${size.y}px`);
        this.videoEl.setAttribute('width', `${size.x}px`);
        this.videoEl.setAttribute('height', `${size.y}px`);
        this.castableEl.setAttribute('width', `${size.x}px`);
        this.castableEl.setAttribute('height', `${size.y}px`);

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
    this.annotation
      .fromEvents(this.svgEl, ['mousedown', 'touchstart'])
      .pipe(
        tap(() => {
          if (this.videoEl.paused) {
            this.videoEl.play();
          }
        }),
        switchMap(() => {
          return this.annotation.fromEvents(this.svgEl, ['mousemove', 'touchmove']).pipe(
            tap(() => {
              if (!line) {
                line = this.annotation.cloneLine();
              }
            }),
            finalize(() => {
              if (line.points.length) {
                // abandon hidden lines "the undo(s)" on any further update
                this.lines = this.lines.filter((lineItem) => lineItem.visible).concat(line);

                // draw the line on the background canvas
                this.annotation.drawLineOnCanvas(line, this.ctx);
                line = undefined;

                // remove the temporary line from the foreground svg
                svgLines.forEach((svgLine) => svgLine.remove());
                svgLines.length = 0;
              }
            }),
            takeUntil(fromEvent(this.svgEl, 'mouseup')),
            takeUntil(fromEvent(this.svgEl, 'mouseleave')),
            takeUntil(fromEvent(this.svgEl, 'touchend'))
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
            const from = line.points.length > 1 ? line.points[line.points.length - 2] : to;

            // draw a temp line live on the foreground svg
            const svgLine = this.annotation.drawLineOnSVG(from, to, this.svgEl, line.attributes);
            svgLines.push(svgLine);
          }
        },
      });
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('annotation-canvas');
  }
}
