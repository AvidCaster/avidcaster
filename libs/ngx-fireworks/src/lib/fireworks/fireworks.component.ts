import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, takeUntil } from 'rxjs';

import { FireworkAction } from '../fireworks.model';
import { FireworksService } from '../fireworks.service';

@Component({
  selector: 'fullerstack-fireworks',
  templateUrl: './fireworks.component.html',
  styleUrls: ['./fireworks.component.scss'],
  providers: [FireworksService],
})
export class FireworksComponent implements OnInit, OnDestroy {
  @ViewChild('fireworksCanvas', { static: true }) canvas: ElementRef | undefined | null;

  @Input() set action(value: FireworkAction) {
    if (value === 'start') {
      this.fireworks.start();
    } else if (value === 'stop') {
      this.fireworks.stop();
    }
  }

  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private destroy$ = new Subject<boolean>();

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
    console.log('fireworks destroy');
  }
}
