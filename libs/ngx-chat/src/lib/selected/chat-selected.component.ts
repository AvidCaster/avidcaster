import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { slideInAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

import {
  CHAT_DEFAULT_AVATAR,
  CHAT_TWITCH_DEFAULT_AVATAR,
  CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE,
  CHAT_YOUTUBE_DEFAULT_AVATAR,
} from '../chat.default';
import { ChatHosts, ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-selected',
  templateUrl: './chat-selected.component.html',
  styleUrls: ['./chat-selected.component.scss'],
  animations: [slideInAnimations.slideInFromBottom],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatSelectedComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<boolean>();

  // inputs
  @Input() verticalPosition: number;
  @Input() horizontalPosition: number;
  @Input() chat: ChatMessageItem;

  // animation state
  slideInState = 0;

  // vertical and horizontal position of the chat
  marginTop = '100px';
  paddingRight = '0px';
  paddingLeft = '0px';

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.logger.debug('ChatSelectedComponent started ... ');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // check if vertical position is changed
    if (
      changes.verticalPosition &&
      changes.verticalPosition.currentValue !== changes.verticalPosition.previousValue
    ) {
      this.calculateChatMarginTop(this.verticalPosition);
    }

    // check if horizontal position is changed
    if (
      changes.horizontalPosition &&
      changes.horizontalPosition.currentValue !== changes.horizontalPosition.previousValue
    ) {
      this.calculateChatPadding(this.horizontalPosition);
    }

    // check if chat is changed
    if (changes.chat && changes.chat.currentValue !== changes.chat.previousValue) {
      if (!this.chatService.state.performanceMode) {
        this.slideInState++;
      }
    }
  }

  calculateChatMarginTop(value: number) {
    this.marginTop = `${CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE - value}px`;
  }

  calculateChatPadding(value: number) {
    if (this.chatService.state.isLtR) {
      this.paddingLeft = `${value}px`;
      this.paddingRight = '0px';
    } else {
      this.paddingRight = `${value}px`;
      this.paddingLeft = '0px';
    }
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

  getFireworksImage(chat: ChatMessageItem): string {
    switch (chat?.messageType) {
      case 'donation':
        return './assets/images/misc/spin-orange-2x.png';
      case 'membership':
        return './assets/images/misc/spin-green-2x.png';
    }

    if (this.chatService.isFireworksPlaying) {
      return './assets/images/misc/spin-orange-2x.png';
    }

    return '';
  }

  getFallbackImage(chat: ChatMessageItem): string {
    switch (chat?.host) {
      case 'youtube':
        return CHAT_YOUTUBE_DEFAULT_AVATAR;
      case 'twitch':
        return CHAT_TWITCH_DEFAULT_AVATAR;
      default:
        break;
    }
    return CHAT_DEFAULT_AVATAR;
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
