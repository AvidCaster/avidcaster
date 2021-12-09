import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, takeUntil } from 'rxjs';

import { ChatFilterOptions } from '../chat.default';
import { ChatMessageFilterType, ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
})
export class ChatMenuComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  chat: ChatMessageItem;
  currentFilter = ChatMessageFilterType.None;
  currentKeywords = '';

  constructor(
    readonly formBuilder: FormBuilder,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chat) => {
        this.chat = chat;
      },
    });
    this.logger.debug('ChatMenuComponent initialized');
  }

  subState() {
    this.chatService.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.currentFilter = state.filterOption as ChatMessageFilterType;
        this.currentKeywords = state.keywords.join(' ');
      },
    });
  }

  isHighlight() {
    const isHighlight =
      ChatMessageFilterType[this.currentFilter] === ChatMessageFilterType.Highlight;
    return isHighlight;
  }

  getFilterOptions(): string[] {
    return Object.keys(ChatMessageFilterType);
  }

  getFilterName(filter: string): string {
    let name = ChatMessageFilterType[filter];
    name = ChatFilterOptions[name];
    return name;
  }

  setFilterOption(filter: ChatMessageFilterType) {
    this.currentFilter = filter;
    this.chatService.setState({ filterOption: filter });
  }

  setKeywords(keywords: string) {
    this.currentKeywords = keywords;
    this.chatService.setState({ keywords: keywords.split(' ').filter((word) => !!word) });
  }

  toggleDirection() {
    this.chatService.setState({ isLtR: !this.chatService.state.isLtR });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
