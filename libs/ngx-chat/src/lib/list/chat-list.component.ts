import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

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

  constructor(
    readonly cdR: ChangeDetectorRef,
    private elR: ElementRef,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.subChatList();
  }

  trackById(index: number, chat: ChatMessageItem) {
    return chat?.id;
  }

  subState() {
    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cdR.detectChanges();
      },
    });
  }

  subChatList(): void {
    this.chatService.chatTable$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chats) => {
        if (this.chatService.state.autoScrollEnabled) {
          this.chatList = chats;
          this.cdR.detectChanges();
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.chatList = [];
  }
}
