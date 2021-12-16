import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';

import { ChatHosts, ChatMessageItem, ChatMessageListFilterType, ChatState } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent implements OnInit, OnDestroy {
  @Input() set viewed(value: boolean) {
    this.chat.viewed = value;
  }
  @Input() chat: ChatMessageItem;
  private destroy$ = new Subject<boolean>();
  isMembershipList = false;
  isDonationList = false;
  isCommonList = true;

  constructor(readonly cdR: ChangeDetectorRef, readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.state$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe((state: ChatState) => {
        this.isMembershipList = state.chatListOption === ChatMessageListFilterType.Membership;
        this.isDonationList = state.chatListOption === ChatMessageListFilterType.Donation;
        this.isCommonList = state.chatListOption === ChatMessageListFilterType.Common;
      });
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
