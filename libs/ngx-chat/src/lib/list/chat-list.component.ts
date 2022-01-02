import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, distinctUntilChanged, filter, takeUntil } from 'rxjs';

import { ChatMessageItem, ChatState } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  state: ChatState;
  chatList: ChatMessageItem[];

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly elR: ElementRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.subChatList();
    this.logger.debug(`ChatListComponent.ngOnInit()`);
  }

  trackById(index: number, chat: ChatMessageItem) {
    return chat?.id;
  }

  subState() {
    this.chatService.state$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (state) => {
          if (!this.state?.autoScrollMode && state.autoScrollMode) {
            this.scrollToTop();
          }

          this.state = state;
        },
      });
  }

  subChatList() {
    this.chatService.chatList$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe({
      next: (chatList: ChatMessageItem[]) => {
        this.chatList = chatList;
        if (this.chatService.state.performanceMode) {
          this.cdR.detectChanges();
        } else {
          this.cdR.markForCheck();
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
  }
}
