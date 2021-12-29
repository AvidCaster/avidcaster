import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { fadeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';

import { ChatHosts, ChatMessageItem, ChatMessageListFilterType } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
  animations: [fadeAnimations.fadeInSlow],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatItemComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<boolean>();

  @Input() chat = {} as ChatMessageItem;
  @Input() last = false;
  @Input() listFilter: ChatMessageListFilterType = 'common';

  // animation state
  slideInState = 0;

  constructor(readonly logger: LoggerService, readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.logger.debug('ChatItemComponent.ngOnInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // check if this is last message in the list
    if (changes.last?.currentValue !== changes.last?.previousValue) {
      if (!this.chatService.state.performanceMode) {
        this.slideInState++;
      }
    }
  }

  get isCommonList(): boolean {
    return this.listFilter === 'common';
  }

  get isMembershipList(): boolean {
    return this.listFilter === 'membership';
  }

  get isDonationList(): boolean {
    return this.listFilter === 'donation';
  }

  getHostColor(host: ChatHosts): string {
    switch (host) {
      case 'youtube':
        return 'warn';
      case 'twitch':
        return 'info';
      default:
        return 'accent';
    }
  }

  getHostImage(host: ChatHosts): string {
    switch (host) {
      case 'youtube':
      case 'twitch':
        return `./assets/images/misc/${host}-x48.png`;
      default:
        return '';
    }
  }

  onClick(): void {
    if (!this.chat.viewed) {
      this.chat.viewed = true;
      this.chatService.database.updateMessage(this.chat);
    }
    const wasClicked = true;
    this.chatService.chatSelected(this.chat, wasClicked);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
