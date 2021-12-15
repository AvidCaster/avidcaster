import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { ChatPrimaryFilterOptions, ChatSecondaryFilterOptions } from '../chat.default';
import {
  ChatMessageItem,
  ChatMessagePrimaryFilterType,
  ChatMessageSecondaryFilterType,
} from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMenuComponent implements OnInit, OnDestroy {
  $player: HTMLAudioElement;
  @ViewChild('audioTag', { static: true }) set playerRef(ref: ElementRef<HTMLAudioElement>) {
    this.$player = ref.nativeElement;
  }
  private destroy$ = new Subject<boolean>();
  private keywordsOb$ = new Subject<string>();
  chat: ChatMessageItem;
  currentFilter = ChatMessageSecondaryFilterType.None;
  currentPrimaryFilter = ChatMessagePrimaryFilterType.None;
  currentKeywords = '';
  audioPlay = false;
  currentMinWords = 0;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();

    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chat) => {
        this.chat = chat;
        this.cdR.markForCheck();
      },
    });

    this.keywordsOb$.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe({
      next: (keywords) => {
        this.currentKeywords = keywords;
        this.chatService.setState({ keywords: keywords.split(' ').filter((word) => !!word) });
      },
    });

    this.logger.debug('ChatMenuComponent initialized');
  }

  subState() {
    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.currentFilter = state.secondaryFilterOption as ChatMessageSecondaryFilterType;
        this.currentPrimaryFilter = state.primaryFilterOption as ChatMessagePrimaryFilterType;
        this.currentKeywords = state.keywords.join(' ');
        this.cdR.markForCheck();
      },
    });
  }

  isHighlight() {
    const isHighlight =
      ChatMessageSecondaryFilterType[this.currentFilter] ===
      ChatMessageSecondaryFilterType.Highlight;
    return isHighlight;
  }

  isFilter() {
    const isFilter =
      ChatMessageSecondaryFilterType[this.currentFilter] !==
        ChatMessageSecondaryFilterType.Highlight &&
      ChatMessageSecondaryFilterType[this.currentFilter] !== ChatMessageSecondaryFilterType.None;
    return isFilter;
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
    this.currentFilter = filter;
    this.chatService.setState({ secondaryFilterOption: filter });
  }

  setKeywords(keywords: string) {
    this.keywordsOb$.next(keywords);
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
    this.currentPrimaryFilter = filter;
    this.chatService.setState({ primaryFilterOption: filter });
  }

  clearMessage() {
    this.chatService.clearMessage();
  }

  toggleDirection() {
    this.chatService.setState({ isLtR: !this.chatService.state.isLtR });
  }

  toggleFireworksFlag() {
    this.chatService.setState({ fireworksEnabled: !this.chatService.state.fireworksEnabled });
  }

  toggleFireworks() {
    this.chatService.setState({ fireworksPlay: !this.chatService.state.fireworksPlay });
  }

  toggleAudioFlag() {
    this.chatService.setState({ audioEnabled: !this.chatService.state.audioEnabled });
  }

  toggleAudioPlay() {
    this.audioPlay = !this.audioPlay;
    if (this.chatService.state.audioEnabled && this.audioPlay) {
      this.$player.currentTime = 0;
      this.$player.play();
    } else {
      this.$player.pause();
    }
  }

  toggleFastForward() {
    this.chatService.setState({ ffEnabled: !this.chatService.state.ffEnabled });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
