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
import { filter, finalize, switchMap, takeUntil } from 'rxjs/operators';

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
      this.annotation.setCanvasAttributes(this.ctx);
    }, 100);
    this.resizeCanvas(this.canvasEl);
    this.captureEvents(this.canvasEl);
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
          this.annotation.setCanvasAttributes(this.ctx, {
            lineCap: state.lineCap,
            lineJoin: state.lineJoin,
            lineWidth: state.lineWidth,
            strokeStyle: state.strokeStyle,
          });
        },
      });
  }

  private resizeCanvas(canvasEl: HTMLCanvasElement) {
    this.rect = canvasEl.getBoundingClientRect();
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        this.screenSize = size;
        canvasEl.width = size.x;
        canvasEl.height = size.y;
        canvasEl.style.width = `${size.x}px`;
        canvasEl.style.height = `${size.y}px`;
        this.svgEl.setAttribute('width', `${size.x}px`);
        this.svgEl.setAttribute('height', `${size.y}px`);
        this.annotation.resetCanvas(this.canvasEl, this.ctx);
        this.rect = canvasEl.getBoundingClientRect();
        this.annotation.setCanvasAttributes(this.ctx);
        this.lines
          .filter((line) => line.visible)
          .forEach((line) => this.annotation.drawLineOnCanvas(line, this.ctx));
      },
    });
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
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
                    this.annotation.drawDotOnCanvas(line.points[0], this.ctx);
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
            let pointAdded = false;
            if (event instanceof MouseEvent) {
              pointAdded = this.addPoint(
                {
                  x: event.clientX - this.rect.left,
                  y: event.clientY - this.rect.top,
                },
                line
              );
            } else if (event instanceof TouchEvent) {
              pointAdded = this.addPoint(
                {
                  x: event.touches[0].clientX - this.rect.left,
                  y: event.touches[0].clientY - this.rect.top,
                },
                line
              );
            }

            if (pointAdded && line.points.length > 1) {
              this.zone.run(() => {
                this.annotation.drawFromToOnCanvas(
                  line.points[line.points.length - 2],
                  line.points[line.points.length - 1],
                  this.ctx
                );
              });
            }
          },
        });
    });
  }

  /**
   * @param point - {x, y}
   * @returns true if the point was indeed added
   */
  addPoint(point: Point, line: Line): boolean {
    const next = this.roundPoint(point);

    if (line.points.length > 0) {
      const prev = line.points[line.points.length - 1];
      if (this.skipPoint(prev, next)) {
        // add point only if point is not to close to previous point
        return false;
      }
    }

    line.points.push(next);

    return !this.skipPoint(line.points[0], next);
  }

  skipPoint(prev: Point, next: Point): boolean {
    return Math.abs(next.x - prev.x) < 1 && Math.abs(next.y - prev.y) < 1;
  }

  roundPoint(point: Point): Point {
    return {
      x: Math.round(10 * point.x) / 10,
      y: Math.round(10 * point.y) / 10,
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('annotation-canvas');
  }
}
