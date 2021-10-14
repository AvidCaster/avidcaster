/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import createWorker from 'offscreen-canvas/create-worker';
import { Subject, fromEvent } from 'rxjs';
import { filter, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { Line } from '../annotator.model';
import { AnnotatorService } from '../annotator.service';

@Component({
  selector: 'fullerstack-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef | undefined;
  uniqId = uuidV4();
  private destroy$ = new Subject<boolean>();
  private canvasWorker: HTMLCanvasElement | undefined | null;
  private lines: Line[] = [];

  private worker;

  constructor(
    readonly zone: NgZone,
    readonly uix: UixService,
    readonly annotation: AnnotatorService
  ) {
    this.uix.addClassToBody('annotation-canvas');
  }

  ngOnInit() {
    this.worker = createWorker(
      this.canvas?.nativeElement,
      'assets/scripts/draw.worker.js',
      (data) => {
        console.log('worker data', data);
      }
    );

    setTimeout(() => {
      this.worker.post({ type: 'canvas', canvas: this.canvasWorker });
      this.worker.post({
        type: 'attributes',
        attributes: this.annotation.getCanvasAttributes(),
      });
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
    this.resetCanvas();
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
        this.resetCanvas();
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => {
            this.worker.post({ type: 'draw', line });
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
        this.resetCanvas();
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => this.worker.post({ type: 'draw', line }));
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
          this.worker.post({
            type: 'attributes',
            attributes: {
              lineCap: state.lineCap,
              lineJoin: state.lineJoin,
              lineWidth: state.lineWidth,
              strokeStyle: state.strokeStyle,
            },
          });
        },
      });
  }

  private resizeCanvas() {
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        this.worker.post({ type: 'resize', size });
        this.worker.post({ type: 'reset' });
        this.worker.post({
          type: 'attributes',
          attributes: this.annotation.getCanvasAttributes(),
        });
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => this.worker.post({ type: 'draw', line }));
      },
    });
  }

  private captureEvents() {
    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
    let line: Line = this.annotation.cloneLine();
    this.zone.runOutsideAngular(() => {
      this.annotation
        .fromEvents(canvasEl, ['mousedown', 'touchstart'])
        .pipe(
          switchMap(() => {
            return this.annotation.fromEvents(canvasEl, ['mousemove', 'touchmove']).pipe(
              finalize(() => {
                if (line.points.length) {
                  // abandon hidden lines "the undo(s)" on any further update
                  this.lines = this.lines
                    .filter((lineItem) => lineItem.visible)
                    .concat({ ...line, attributes: this.annotation.getCanvasAttributes() });
                  this.zone.run(() => {
                    this.worker.post({ type: 'dot', line });
                  });
                  line = this.annotation.cloneLine();
                }
              }),
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              takeUntil(fromEvent(canvasEl, 'touchend'))
            );
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (event: MouseEvent | TouchEvent) => {
            const rect = canvasEl.getBoundingClientRect();

            if (event instanceof MouseEvent) {
              line.points.push({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            } else if (event instanceof TouchEvent) {
              line.points.push({
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top,
              });
            }

            if (line.points.length > 1) {
              this.zone.run(() => {
                this.worker.post({ type: 'points', line });
              });
            }
          },
        });
    });
  }

  /**
   * Resets the canvas
   * @param canvasEl canvas element
   * @param ctx canvas context
   */
  resetCanvas() {
    this.worker.post({ type: 'reset' });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('annotation-canvas');
  }
}
