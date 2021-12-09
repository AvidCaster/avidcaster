/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, takeUntil } from 'rxjs';

import { FireworksService } from '../fireworks.service';

@Component({
  selector: 'fullerstack-fireworks',
  templateUrl: './fireworks.component.html',
  styleUrls: ['./fireworks.component.scss'],
  providers: [FireworksService],
})
export class FireworksComponent implements OnInit, OnDestroy {
  @ViewChild('fireworksCanvas', { static: true }) canvas: ElementRef | undefined | null;
  @Input() set action(start: boolean) {
    if (start) {
      this.fireworks.start();
    } else {
      this.fireworks.stop();
    }
  }
  private destroy$ = new Subject<boolean>();
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;

  constructor(
    readonly elementRef: ElementRef,
    readonly uix: UixService,
    readonly fireworks: FireworksService
  ) {}

  ngOnInit(): void {
    this.canvasEl = this.canvas?.nativeElement;

    this.ctx = this.canvasEl.getContext('2d');
    this.fireworks.init(this.canvasEl, this.ctx);
    this.resizeCanvas();
  }

  private resizeCanvas() {
    this.uix.reSizeSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const width = this.elementRef.nativeElement.offsetWidth;
        const height = this.elementRef.nativeElement.offsetHeight;
        this.canvasEl.width = width;
        this.canvasEl.height = height;
        this.canvasEl.style.width = `${width}px`;
        this.canvasEl.style.height = `${height}px`;
        this.fireworks.resize(width, height);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
