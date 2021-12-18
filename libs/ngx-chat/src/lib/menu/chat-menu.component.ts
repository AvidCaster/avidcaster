import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, debounceTime, filter, takeUntil } from 'rxjs';

import { ChatMessageItem } from '../chat.model';
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
  chat: ChatMessageItem;
  isDarkTheme = false;
  audioPlay = false;
  isAudioEnabled = false;
  fireworksPlay = false;
  isFireworksEnabled = false;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly layout: LayoutService,
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

    this.logger.debug('ChatMenuComponent initialized');
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
          this.fireworksPlay = state.fireworksPlay;
          this.isAudioEnabled = state.audioEnabled;
          this.layout.setDarkTheme(this.isDarkTheme);
          this.cdR.markForCheck();
        },
      });
  }

  clearMessage() {
    this.chatService.clearMessage();
  }

  toggleDirection() {
    this.chatService.setState({ isLtR: !this.chatService.state.isLtR });
  }

  toggleFireworks(isFireworksEnabled: boolean) {
    this.isFireworksEnabled = !isFireworksEnabled;
    this.chatService.setState({
      fireworksEnabled: !isFireworksEnabled,
      fireworksPlay: isFireworksEnabled ? false : this.chatService.state.fireworksPlay,
    });
  }

  toggleFireworksPlay() {
    this.fireworksPlay = !this.fireworksPlay;
    this.chatService.setState({ fireworksPlay: !this.chatService.state.fireworksPlay });
  }

  toggleAudio(isAudioEnabled: boolean) {
    this.isAudioEnabled = isAudioEnabled;
    this.chatService.setState({ audioEnabled: isAudioEnabled });
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

  toggleFullscreen() {
    this.chatService.pauseIframe(true);
    setTimeout(() => {
      this.chatService.layout.toggleFullscreen();
    }, 100);
    setTimeout(() => {
      this.chatService.pauseIframe(false);
    }, 1000);
  }

  toggleTheme(isDarkTheme: boolean) {
    this.chatService.setState({ isDarkTheme });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
