import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, takeUntil } from 'rxjs';

import { ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
})
export class ChatMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  chat: ChatMessageItem;

  constructor(readonly logger: LoggerService, readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.logger.debug('ChatMenuComponent initialized');
    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chat) => {
        this.chat = chat;
      },
    });
  }

  toggleDirection() {
    this.chatService.setState({ isLtR: !this.chatService.state.isLtR });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
