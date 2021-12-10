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
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatListComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<boolean>();
  autoScrollEnabled = true;
  welcomeChat = welcomeChat();

  constructor(
    readonly cdR: ChangeDetectorRef,
    private elR: ElementRef,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.updateChatList();
  }

  updateChatList(): void {
    this.chatService.chatList$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: () => {
        if (this.autoScrollEnabled) {
          setTimeout(() => this.cdR.detectChanges(), 0);
          setTimeout(() => this.scrollToBottom(), 100);
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

  toggleAutoScroll(): void {
    this.autoScrollEnabled = !this.autoScrollEnabled;
    if (!this.autoScrollEnabled) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
