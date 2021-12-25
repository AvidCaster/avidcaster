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
import { Subject, filter, takeUntil } from 'rxjs';

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

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly layout: LayoutService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.subToggleAudioPlay();
    this.subSelectedChat();

    this.logger.debug('ChatMenuComponent initialized');
  }

  subState() {
    this.chatService.state$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.cdR.markForCheck();
        },
      });
  }

  subSelectedChat() {
    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chat) => {
        this.chat = chat;
        this.cdR.markForCheck();
      },
    });
  }

  clearMessage() {
    this.chatService.clearMessage();
  }

  subToggleAudioPlay() {
    this.chatService.audioPlaying$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (play) => {
        if (play) {
          this.$player.currentTime = 0;
          this.$player.play();
        } else {
          this.$player.pause();
        }
      },
    });
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
