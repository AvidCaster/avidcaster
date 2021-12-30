import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';

import {
  CHAT_BACKGROUND_COLOR_DEFAULT_VALUE,
  CHAT_HORIZONTAL_POSITION_SLIDER_MAX_VALUE,
  CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE,
} from '../chat.default';
import { ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-options',
  templateUrl: './chat-options.component.html',
  styleUrls: ['./chat-options.component.scss'],
})
export class ChatOptionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  private backgroundColorDebounceOb$ = new Subject<string>();
  chat: ChatMessageItem;
  isDarkTheme = false;
  isAudioEnabled = false;
  isFireworksEnabled = false;
  chatVerticalPosition = CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE;
  chatHorizontalPosition = CHAT_HORIZONTAL_POSITION_SLIDER_MAX_VALUE;
  chatBackgroundColor = CHAT_BACKGROUND_COLOR_DEFAULT_VALUE;
  isDemoMode = false;
  isPerformanceMode = true;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly layout: LayoutService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.subBackgroundColorDebounce();
    this.logger.debug('ChatOptionsComponent initialized');
  }

  subState() {
    this.chatService.state$
      .pipe(
        debounceTime(1),
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (state) => {
          this.isDarkTheme = state.isDarkTheme;
          this.isFireworksEnabled = state.fireworksEnabled;
          this.isAudioEnabled = state.audioEnabled;
          this.isDemoMode = state.demoMode;
          this.chatBackgroundColor = state.backgroundColor;
          this.layout.setDarkTheme(this.isDarkTheme);
          this.cdR.markForCheck();
        },
      });
  }

  toggleDirection() {
    this.chatService.setState({ isLtR: !this.chatService.state.isLtR });
  }

  toggleFireworks(isFireworksEnabled: boolean) {
    this.isFireworksEnabled = isFireworksEnabled;
    this.chatService.setState({
      fireworksEnabled: isFireworksEnabled,
    });
  }

  toggleAudio(isAudioEnabled: boolean) {
    this.isAudioEnabled = isAudioEnabled;
    this.chatService.setState({ audioEnabled: isAudioEnabled });
  }

  toggleTheme(isDarkTheme: boolean) {
    this.chatService.setState({ isDarkTheme });
  }

  handleChatVerticalPositionInput(value: number) {
    this.chatService.setChatVerticalPosition(value);
  }

  handleChatVerticalPositionChange(value: number) {
    const saveToState = true;
    this.chatService.setChatVerticalPosition(value, saveToState);
  }

  handleChatHorizontalPositionInput(value: number) {
    this.chatService.setChatHorizontalPosition(value);
  }

  toggleDemoMode(value: boolean) {
    this.chatService.setState({ demoMode: value });
  }

  togglePerformanceMode(value: boolean) {
    this.chatService.setState({ performanceMode: value });
  }

  handleChatHorizontalPositionChange(value: number) {
    const saveToState = true;
    this.chatService.setChatHorizontalPosition(value, saveToState);
  }

  // grab the background color from the input, for the purpose of live change
  handleBackgroundColorChange(value: string) {
    this.chatService.setChatBackgroundColor(value);
    this.backgroundColorDebounceOb$.next(value);
  }

  // grab the background color from the input, for the purpose of saving it to the state
  subBackgroundColorDebounce() {
    this.backgroundColorDebounceOb$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          const saveToState = true;
          this.chatService.setChatBackgroundColor(value, saveToState);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
