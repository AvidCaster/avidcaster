import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, takeUntil } from 'rxjs';

import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-stats',
  templateUrl: './chat-stats.component.html',
  styleUrls: ['./chat-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cdR.detectChanges();
      },
    });

    console.log('StatsComponent started ... ');
  }

  toggleAutoScroll() {
    this.chatService.setState({ autoScrollEnabled: !this.chatService.state.autoScrollEnabled });
  }

  toggleFullscreen() {
    this.chatService.pauseIframe(true);
    setTimeout(() => {
      this.chatService.layout.toggleFullscreen();
    }, 100);
    setTimeout(() => {
      this.chatService.pauseIframe(false);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
