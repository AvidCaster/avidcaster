import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, debounceTime, filter, takeUntil } from 'rxjs';

import {
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
export class ChatOptionsComponent implements OnInit {
  private destroy$ = new Subject<boolean>();
  chat: ChatMessageItem;
  isDarkTheme = false;
  isAudioEnabled = false;
  isFireworksEnabled = false;
  defaultChatVerticalPosition = CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE;
  defaultChatHorizontalPosition = CHAT_HORIZONTAL_POSITION_SLIDER_MAX_VALUE;
  isDemoMode = false;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly layout: LayoutService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
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
          this.isDemoMode = state.demoEnabled;
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
      fireworksPlay: isFireworksEnabled ? false : this.chatService.state.fireworksPlay,
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
    this.chatService.setState({ demoEnabled: value });
  }

  handleChatHorizontalPositionChange(value: number) {
    const saveToState = true;
    this.chatService.setChatHorizontalPosition(value, saveToState);
  }
}
