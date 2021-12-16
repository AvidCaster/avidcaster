import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { ChatHosts, ChatMessageItem, ChatMessageListFilterType } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent implements OnDestroy {
  @Input() last = false;
  @Input() set viewed(value: boolean) {
    this.chat.viewed = value;
  }
  @Input() chat: ChatMessageItem;
  private destroy$ = new Subject<boolean>();

  constructor(readonly cdR: ChangeDetectorRef, readonly chatService: ChatService) {}

  get isMembershipList(): boolean {
    return this.chatService.state.chatListOption === ChatMessageListFilterType.Membership;
  }

  get isDonationList(): boolean {
    return this.chatService.state.chatListOption === ChatMessageListFilterType.Donation;
  }

  get isCommonList(): boolean {
    return this.chatService.state.chatListOption === ChatMessageListFilterType.Common;
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
    this.cdR.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
