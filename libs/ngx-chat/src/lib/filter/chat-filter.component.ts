import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { ConfirmationDialogService } from '@fullerstack/ngx-shared';
import { Subject, debounceTime, first, takeUntil } from 'rxjs';

import {
  ChatListFilterOptions,
  ChatPrimaryFilterOptions,
  ChatSecondaryFilterOptions,
} from '../chat.default';
import {
  ChatMessageListFilterType,
  ChatMessagePrimaryFilterType,
  ChatMessageSecondaryFilterType,
} from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-filter',
  templateUrl: './chat-filter.component.html',
  styleUrls: ['./chat-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationDialogService],
})
export class ChatFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  private keywordsOb$ = new Subject<string>();
  primaryFilter = ChatMessagePrimaryFilterType.None;
  secondaryFilter = ChatMessageSecondaryFilterType.None;
  listFilter = ChatMessageListFilterType.Common;
  keywords = '';
  minWords = 0;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly confirm: ConfirmationDialogService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.subKeywords();

    console.log('ChatFilterComponent started ... ');
  }

  subKeywords() {
    this.keywordsOb$.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe({
      next: (keywords) => {
        this.keywords = keywords;
        this.chatService.setState({ keywords: keywords.split(' ').filter((word) => !!word) });
      },
    });
  }

  subState() {
    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.listFilter = state.chatListOption as ChatMessageListFilterType;
        this.secondaryFilter = state.secondaryFilterOption as ChatMessageSecondaryFilterType;
        this.primaryFilter = state.primaryFilterOption as ChatMessagePrimaryFilterType;
        this.keywords = state.keywords.join(' ');
        this.cdR.markForCheck();
      },
    });
  }

  setKeywords(keywords: string) {
    this.keywordsOb$.next(keywords);
  }

  isHighlight() {
    const isHighlight =
      ChatMessageSecondaryFilterType[this.secondaryFilter] ===
      ChatMessageSecondaryFilterType.Highlight;
    return isHighlight;
  }

  isFilter() {
    const isFilter =
      ChatMessageSecondaryFilterType[this.secondaryFilter] !==
        ChatMessageSecondaryFilterType.Highlight &&
      ChatMessageSecondaryFilterType[this.secondaryFilter] !== ChatMessageSecondaryFilterType.None;
    return isFilter;
  }

  getListFilterOptions(): string[] {
    return Object.keys(ChatMessageListFilterType);
  }

  getListFilterName(filter: string): string {
    let name = ChatMessageListFilterType[filter];
    name = ChatListFilterOptions[name];
    return name;
  }

  setListFilterOption(filter: ChatMessageListFilterType) {
    this.listFilter = filter;
    this.chatService.setState({ chatListOption: filter });
  }

  getPrimaryFilterOptions(): string[] {
    return Object.keys(ChatMessagePrimaryFilterType);
  }

  getPrimaryFilterName(filter: string): string {
    let name = ChatMessagePrimaryFilterType[filter];
    name = ChatPrimaryFilterOptions[name];
    return name;
  }

  setPrimaryFilterOption(filter: ChatMessagePrimaryFilterType) {
    this.primaryFilter = filter;
    this.chatService.setState({ primaryFilterOption: filter });
  }

  getSecondaryFilterOptions(): string[] {
    return Object.keys(ChatMessageSecondaryFilterType);
  }

  getSecondaryFilterName(filter: string): string {
    let name = ChatMessageSecondaryFilterType[filter];
    name = ChatSecondaryFilterOptions[name];
    return name;
  }

  setSecondaryFilterOption(filter: ChatMessageSecondaryFilterType) {
    this.secondaryFilter = filter;
    this.chatService.setState({ secondaryFilterOption: filter });
  }

  toggleAutoScroll() {
    this.chatService.setState({ autoScrollEnabled: !this.chatService.state.autoScrollEnabled });
  }

  sessionReset() {
    const title = _('CHAT.RESET_CHAT_SESSION');
    const info = _('WARN.CHAT.SESSION_RESET');
    this.confirm
      .confirmation(title, info)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: (accepted: boolean) => {
          if (accepted) {
            this.chatService.database.resetDatabase();
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
