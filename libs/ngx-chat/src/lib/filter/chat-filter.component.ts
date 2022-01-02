import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { ConfirmationDialogService, shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject, debounceTime, filter, first, interval, takeUntil } from 'rxjs';

import {
  ChatKeywordsFilterOptions,
  ChatListFilterOptions,
  ChatPrimaryFilterOptions,
  welcomeChat,
} from '../chat.default';
import {
  ChatMessageKeywordsFilterType,
  ChatMessageListFilterType,
  ChatMessagePrimaryFilterType,
} from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-filter',
  templateUrl: './chat-filter.component.html',
  styleUrls: ['./chat-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationDialogService],
  animations: [shakeAnimations.wiggleIt],
})
export class ChatFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  private keywordsOb$ = new Subject<string>();
  primaryFilter: ChatMessagePrimaryFilterType = 'none';
  keywordsFilter: ChatMessageKeywordsFilterType = 'none';
  listFilter: ChatMessageListFilterType = 'common';
  keywords = '';
  minWords = 0;
  resumeIconState = 0;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly confirm: ConfirmationDialogService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.subKeywords();
    this.subWigglePause();

    this.logger.debug('ChatFilterComponent initialized');
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
        this.listFilter = state.listFilter;
        this.primaryFilter = state.primaryFilter;
        this.keywordsFilter = state.keywordsFilter;
        this.keywords = state.keywords.join(' ');
        this.cdR.markForCheck();
      },
    });
  }

  subWigglePause() {
    interval(2000)
      .pipe(
        filter(() => !this.chatService.state.autoScrollMode),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.resumeIconState++;
          this.cdR.markForCheck();
        },
      });
  }

  setKeywords(keywords: string) {
    this.keywordsOb$.next(keywords);
  }

  isHighlight() {
    return this.keywordsFilter === 'highlight';
  }

  isKeywordsFilter() {
    return this.keywordsFilter !== 'none' && this.keywordsFilter !== 'highlight';
  }

  //  list filters
  getListFilter(): string[] {
    return Object.keys(ChatListFilterOptions);
  }

  getListFilterName(filter: string): string {
    return ChatListFilterOptions[filter];
  }

  setListFilter(filter: ChatMessageListFilterType) {
    this.listFilter = filter;
    this.chatService.setState({ listFilter: filter, autoScrollMode: true });
  }

  // primary options
  getKeywordsFilter(): string[] {
    return Object.keys(ChatKeywordsFilterOptions);
  }

  getKeywordsFilterName(filter: string): string {
    return ChatKeywordsFilterOptions[filter];
  }

  setKeywordsFilter(filter: ChatMessageKeywordsFilterType) {
    this.keywordsFilter = filter;
    this.chatService.setState({ keywordsFilter: filter });
  }

  // secondary options
  getPrimaryFilter(): string[] {
    return Object.keys(ChatPrimaryFilterOptions);
  }

  getPrimaryFilterName(filter: string): string {
    return ChatPrimaryFilterOptions[filter];
  }

  setPrimaryFilter(filter: ChatMessagePrimaryFilterType) {
    this.primaryFilter = filter;
    this.chatService.setState({ primaryFilter: filter });
  }

  toggleAutoScroll() {
    this.chatService.setState({ autoScrollMode: !this.chatService.state.autoScrollMode });
  }

  sessionReset() {
    const title = _('CHAT.RESET_CHAT_SESSION');
    const info = _('WARN.CHAT.SESSION_RESET');
    this.confirm
      .confirmation(title, info)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: async (accepted: boolean) => {
          if (accepted) {
            await this.chatService.database.resetDatabase(welcomeChat());
          }
        },
      });
  }

  toggleFullscreen() {
    this.chatService.pauseIframe(true);
    setTimeout(() => {
      this.chatService.layout.toggleFullscreen();
    }, 100);
    setTimeout(() => {
      this.chatService.pauseIframe(false);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
