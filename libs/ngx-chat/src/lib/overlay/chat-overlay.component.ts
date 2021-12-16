import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';

import { CHAT_STORAGE_OVERLAY_REQUEST_KEY } from '../chat.default';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-overlay',
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatOverlayComponent implements OnInit {
  private onStorageOb$: Observable<Event>;
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly zone: NgZone,
    readonly cdR: ChangeDetectorRef,
    readonly elR: ElementRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {
    this.onStorageOb$ = fromEvent(this.chatService.layout.uix.window, 'storage').pipe(
      filter((event: StorageEvent) => !!event.newValue)
    );
  }

  ngOnInit(): void {
    console.log('ChatOverlayComponent.ngOnInit');
    this.storageSubscription();
    this.selectedChatSubscription();
  }

  selectedChatSubscription(): void {
    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cdR.markForCheck();
      },
    });
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          if (event.key === CHAT_STORAGE_OVERLAY_REQUEST_KEY) {
            this.chatService.broadcastNewChatOverlayResponse();
            this.chatService.layout.uix.window.focus();
            this.logger.info('ChatOverlayComponent: Overlay Response Sent; Grabbing Focus!');
          }
        },
      });
    });
  }
}
