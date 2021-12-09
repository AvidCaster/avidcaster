import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoggerService } from '@fullerstack/ngx-logger';
import { getControl } from '@fullerstack/ngx-shared';
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
  filterOptions = ChatFilterOptions;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chat) => {
        this.chat = chat;
      },
    });
    this.logger.debug('ChatMenuComponent initialized');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      filterText: [''],
      filterSelect: [''],
    });
  }

  isHighlight() {
    return (
      getControl('filterSelect')?.value === ChatMessageFilterType[ChatMessageFilterType.Highlight]
    );
  }

  getFilterOptions(): string[] {
    return Object.keys(ChatMessageFilterType).filter((key) => {
      return typeof ChatMessageFilterType[key] === 'string';
    });
  }

  getFilterName(filter: string): string {
    let name = ChatMessageFilterType[filter];
    name = this.filterOptions[name];
    return name;
  }

  setFilter(filter: ChatMessageFilterType) {
    this.currentFilter = filter;
    // this.chatService.state.filter = filter;
  }

  toggleDirection() {
    this.chatService.setState({ isLtR: !this.chatService.state.isLtR });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
