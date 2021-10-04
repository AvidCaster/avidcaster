/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { cloneDeep as ldDeepClone } from 'lodash-es';
import { EMPTY, Observable, Subject, fromEvent, merge } from 'rxjs';
import { pairwise, switchMap, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { AnnotatorService } from '../annotator.service';
import { DefaultCanvasButtonAttributes, DefaultLine } from './draw.default';
import { Line, LineAttributes, Point } from './draw.model';

@Component({
  selector: 'fullerstack-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef | undefined;
  @Input() attr = DefaultCanvasButtonAttributes;
  uniqId = uuidV4();
  private destroy$ = new Subject<boolean>();
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private lines: Line[] = [];

  constructor(readonly uix: UixService, readonly annotatorService: AnnotatorService) {
    this.uix.addClassToBody('annotation-canvas');
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas?.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    this.setLineAttributes({
      lineCap: this.annotatorService.state.lineCap,
      lineWidth: this.annotatorService.state.lineWidth,
      strokeStyle: this.annotatorService.state.strokeStyle,
    });
    this.resizeCanvas(this.canvasEl);
    this.captureEvents(this.canvasEl);
    this.trashSub();
    this.undoSub();
  }

  private trashSub() {
    this.annotatorService.trash$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doTrash();
      },
    });
  }

  doTrash() {
    this.lines = [];
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  private undoSub() {
    this.annotatorService.undo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.doUndo();
      },
    });
  }

  doUndo() {
    if (this.lines.length) {
      this.lines.pop();
      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.lines.forEach((line) => this.drawLineOnCanvas(line));
    }
  }

  private cloneLine(initial?: Line) {
    return ldDeepClone({
      ...(initial || DefaultLine),
      attributes: {
        lineCap: this.annotatorService.state.lineCap,
        lineWidth: this.annotatorService.state.lineWidth,
        strokeStyle: this.annotatorService.state.strokeStyle,
      },
    });
  }

  private fromEvents(canvasEl: HTMLCanvasElement, eventNames: string[]): Observable<Event> {
    return eventNames.reduce((prev, name) => merge(prev, fromEvent(canvasEl, name)), EMPTY);
  }

  private resizeCanvas(canvasEl: HTMLCanvasElement) {
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (size) => {
        canvasEl.width = size.x;
        canvasEl.height = size.y;
        this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.lines.forEach((line) => this.drawLineOnCanvas(line));
      },
    });
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    let line: Line = this.cloneLine();

    this.fromEvents(canvasEl, ['mousedown', 'mouseleave', 'touchstart'])
      .pipe(
        tap(() => {
          if (line.points.length) {
            this.lines.push(line);
            line = this.cloneLine();
          }
        }),
        switchMap(() => {
          return this.fromEvents(canvasEl, ['mousemove', 'touchmove']).pipe(
            pairwise(),
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            takeUntil(fromEvent(canvasEl, 'touchend'))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ([prevEvent, currEvent]) => {
          let to: Point;
          let from: Point;
          const rect = canvasEl.getBoundingClientRect();

          if (prevEvent instanceof MouseEvent && currEvent instanceof MouseEvent) {
            to = {
              x: prevEvent.clientX - rect.left,
              y: prevEvent.clientY - rect.top,
            };
            from = {
              x: currEvent.clientX - rect.left,
              y: currEvent.clientY - rect.top,
            };
          } else if (prevEvent instanceof TouchEvent && currEvent instanceof TouchEvent) {
            to = {
              x: currEvent.touches[0].clientX - rect.left,
              y: currEvent.touches[0].clientY - rect.top,
            };
            from = {
              x: currEvent.touches[0].clientX - rect.left,
              y: currEvent.touches[0].clientY - rect.top,
            };
          }

          this.drawFromToOnCanvas(from, to, line.attributes);

          this.lines.push(line);
        },
      });
  }

  private setLineAttributes(attr: LineAttributes) {
    this.ctx.lineCap = attr.lineCap;
    this.ctx.lineWidth = attr.lineWidth;
    this.ctx.strokeStyle = attr.strokeStyle;
  }

  /**
   * Given multiple points, draw a line between them
   * @param line line information including points and attributes of a line
   */
  private drawLineOnCanvas(line: Line) {
    if (line.points.length) {
      for (let i = 0; i < line.points.length - 1; i++) {
        const from = line.points[i];
        const to = line.points[i + 1];
        this.drawFromToOnCanvas(from, to, line.attributes);
      }
    }
  }

  /**
   * Given two points, draws a line between them on the canvas
   * @param to coordinates of the end point
   * @param from coordinates of the start point
   */
  private drawFromToOnCanvas(to: Point, from: Point, attr?: LineAttributes) {
    this.setLineAttributes(attr);
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.uix.removeClassFromBody('annotation-canvas');
  }
}
