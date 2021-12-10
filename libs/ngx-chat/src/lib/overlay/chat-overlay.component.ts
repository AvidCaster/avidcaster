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

import { CHAT_STORAGE_KEY_OVERLAY_REQUEST } from '../chat.default';
import { ChatMessageItem } from '../chat.model';
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
  chat: ChatMessageItem;

  constructor(
    readonly zone: NgZone,
    readonly chR: ChangeDetectorRef,
    readonly elR: ElementRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {
    this.onStorageOb$ = fromEvent(this.chatService.layout.uix.window, 'storage');
  }

  ngOnInit(): void {
    console.log('ChatOverlayComponent.ngOnInit');
    this.storageSubscription();
    this.selectedChatSubscription();
  }

  selectedChatSubscription(): void {
    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chatItem: ChatMessageItem) => {
        this.chat = chatItem;
        this.chR.markForCheck();
      },
    });
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$
        .pipe(
          filter((event: StorageEvent) => event.key === CHAT_STORAGE_KEY_OVERLAY_REQUEST),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: () => {
            this.logger.info('ChatOverlayComponent: Overlay Response Sent; Focusing');
            this.chatService.broadcastNewChatOverlayResponse();
            this.chatService.layout.uix.window.focus();
          },
        });
    });
  }
}
