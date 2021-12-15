import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { slideInAnimations } from '@fullerstack/ngx-shared';
import { Subject, takeUntil, throttleTime } from 'rxjs';

import {
  CHAT_DEFAULT_AVATAR,
  CHAT_TWITCH_DEFAULT_AVATAR,
  CHAT_YOUTUBE_DEFAULT_AVATAR,
} from '../chat.default';
import { ChatHosts, ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-selected',
  templateUrl: './chat-selected.component.html',
  styleUrls: ['./chat-selected.component.scss'],
  animations: [slideInAnimations.slideIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatSelectedComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  chat: ChatMessageItem;
  slideInState = 0;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService.chatSelected$.pipe(throttleTime(100), takeUntil(this.destroy$)).subscribe({
      next: (chatItem: ChatMessageItem) => {
        this.chat = chatItem;
        if (!this.chatService.state.ffEnabled) {
          this.slideInState++;
        }
        this.cdR.detectChanges();
      },
    });

    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cdR.detectChanges();
      },
    });

    this.logger.debug('ChatSelectedComponent started ... ');
  }

  getHostImage(host: ChatHosts): string {
    switch (host) {
      case 'youtube':
      case 'twitch':
        return `./assets/images/misc/${host}-x128.png`;
      default:
        return '';
    }
  }

  getHoraryImage(chat: ChatMessageItem): string {
    if (chat?.donation) {
      return `./assets/images/misc/spin-orange-2x.png`;
    } else if (chat?.membership) {
      return `./assets/images/misc/spin-green-2x.png`;
    } else if (this.chatService.state.fireworksEnabled && this.chatService.state.fireworksPlay) {
      return `./assets/images/misc/spin-orange-2x.png`;
    }

    return '';
  }

  onImageError(event, host: ChatHosts) {
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
