import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { BehaviorSubject, Subject, debounceTime, filter, takeUntil } from 'rxjs';

import { ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-options',
  templateUrl: './chat-options.component.html',
  styleUrls: ['./chat-options.component.scss'],
})
export class ChatOptionsComponent implements OnInit {
  private destroy$ = new Subject<boolean>();
  private chatVerticalPosition$ = new BehaviorSubject<number>(0);
  chat: ChatMessageItem;
  isDarkTheme = false;
  isAudioEnabled = false;
  isFireworksEnabled = false;
  chatVerticalPositionValue = 0;

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

  formatChatVerticalLabel(value: number) {
    console.log(value);
    if (value >= 1000) {
      value = Math.round(value / 1000);
    }
    this.chatVerticalPositionValue = value;
    this.chatVerticalPosition$ ? this.chatVerticalPosition$.next(value) : null;
    return value;
  }
}
