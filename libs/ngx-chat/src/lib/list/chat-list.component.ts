import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { welcomeChat } from '../chat.default';
import { ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  chatList: ChatMessageItem[] = [];
  welcomeChat = welcomeChat();

  constructor(
    readonly cdR: ChangeDetectorRef,
    private elR: ElementRef,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cdR.detectChanges();
      },
    });

    this.updateChatList();
  }

  trackById(index: number, chat: ChatMessageItem) {
    return `${index}-${chat?.id}`;
  }

  updateChatList(): void {
    this.chatService.chatTable$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chats) => {
        if (this.chatService.state.autoScrollEnabled) {
          this.chatList = chats;
          this.cdR.detectChanges();
          setTimeout(() => this.scrollToBottom(), 10);
        }
      },
    });
  }

  scrollToBottom(): void {
    this.elR.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }

  scrollToTop(): void {
    this.elR.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  toggleAutoScroll() {
    this.chatService.setState({ autoScrollEnabled: !this.chatService.state.autoScrollEnabled });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
