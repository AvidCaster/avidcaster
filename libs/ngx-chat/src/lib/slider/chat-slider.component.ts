import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CHAT_DEFAULT_AVATAR,
  CHAT_TWITCH_DEFAULT_AVATAR,
  CHAT_YOUTUBE_DEFAULT_AVATAR,
  ChatMessageItem,
  ChatService,
} from '@fullerstack/ngx-chat';
import { LoggerService } from '@fullerstack/ngx-logger';
import { slideInAnimations } from '@fullerstack/ngx-shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-chat-slider',
  templateUrl: './chat-slider.component.html',
  styleUrls: ['./chat-slider.component.scss'],
  animations: [slideInAnimations.slideIn],
})
export class ChatSliderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  chat: ChatMessageItem;
  slideInState = 0;

  constructor(readonly logger: LoggerService, readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.logger.debug('Chat');
    this.chatService.chatItem$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chatItem: ChatMessageItem) => {
        this.chat = chatItem;
        this.slideInState = 1;
      },
    });
  }

  onImageError(event, host: string) {
    switch (host) {
      case 'youtube':
        event.target.src = CHAT_YOUTUBE_DEFAULT_AVATAR;
        break;
      case 'twitch':
        event.target.src = CHAT_TWITCH_DEFAULT_AVATAR;
        break;
      default:
        event.target.src = CHAT_DEFAULT_AVATAR;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
