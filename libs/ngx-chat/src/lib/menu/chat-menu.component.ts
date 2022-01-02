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
import { shakeAnimations } from '@fullerstack/ngx-shared';
import { Subject, filter, fromEvent, takeUntil } from 'rxjs';

import { ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
  animations: [shakeAnimations.wiggleIt],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMenuComponent implements OnInit, OnDestroy {
  $player: HTMLAudioElement;
  @ViewChild('audioTag', { static: true }) set playerRef(ref: ElementRef<HTMLAudioElement>) {
    this.$player = ref.nativeElement;
  }
  private destroy$ = new Subject<boolean>();
  chat: ChatMessageItem;

  // animation state for icons that need wiggle animation
  trashIconState = 1;
  fireworksIconState = 1;
  audioIconState = 1;
  snailIconState = 1;
  rabbitIconState = 1;

  constructor(
    readonly cdR: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly layout: LayoutService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subState();
    this.subAudio();
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

  subAudio() {
    fromEvent(this.$player, 'ended')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.chatService.setAudioPlayStatus(false);
          this.cdR.markForCheck();
        },
      });

    this.audioIconState++;
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

  clearMessage() {
    this.trashIconState++;
    this.chatService.clearMessage();
  }

  toggleFireworksPlay() {
    this.fireworksIconState++;
    this.chatService.setFireworksPlayStatus();
  }

  toggleAudioPlay() {
    this.audioIconState++;
    this.chatService.setAudioPlayStatus();
  }

  enableFastForward() {
    this.rabbitIconState++;
    this.chatService.setState({ fastForwardMode: true, autoScrollMode: false });
  }

  enableAutoScroll() {
    this.snailIconState++;
    this.chatService.setState({ fastForwardMode: false, autoScrollMode: true });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
