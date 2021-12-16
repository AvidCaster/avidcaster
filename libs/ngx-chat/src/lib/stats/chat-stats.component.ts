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
import { Subject, first, takeUntil } from 'rxjs';

import { ChatListFilterOptions } from '../chat.default';
import { ChatMessageListFilterType } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-stats',
  templateUrl: './chat-stats.component.html',
  styleUrls: ['./chat-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationDialogService],
})
export class StatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  currentListFilter = ChatMessageListFilterType.Common;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly confirm: ConfirmationDialogService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();

    console.log('StatsComponent started ... ');
  }

  subState() {
    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.currentListFilter = state.chatListOption as ChatMessageListFilterType;
        this.cdR.markForCheck();
      },
    });
  }

  getMessageListFilterOptions(): string[] {
    return Object.keys(ChatMessageListFilterType);
  }

  getMessageListFilterName(filter: string): string {
    let name = ChatMessageListFilterType[filter];
    name = ChatListFilterOptions[name];
    return name;
  }

  setMessageListFilterOption(filter: ChatMessageListFilterType) {
    this.currentListFilter = filter;
    this.chatService.setState({ chatListOption: filter });
  }

  toggleAutoScroll() {
    this.chatService.setState({ autoScrollEnabled: !this.chatService.state.autoScrollEnabled });
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
