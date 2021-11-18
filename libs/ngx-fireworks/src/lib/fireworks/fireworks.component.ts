import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-fireworks',
  templateUrl: './fireworks.component.html',
  styleUrls: ['./fireworks.component.scss'],
})
export class FireworksComponent implements OnInit, OnDestroy {
  @ViewChild('fireworksCanvas', { static: true }) canvas: ElementRef | undefined | null;
  private canvasEl: HTMLCanvasElement | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private destroy$ = new Subject<boolean>();

  constructor(readonly elementRef: ElementRef, readonly uix: UixService) {}

  ngOnInit(): void {
    this.canvasEl = this.canvas?.nativeElement;
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
      },
    });
  }

  ngOnDestroy(): void {
    console.log('fireworks destroy');
  }
}
