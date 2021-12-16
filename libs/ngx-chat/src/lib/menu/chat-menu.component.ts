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
  chat: ChatMessageItem;
  audioPlay = false;

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

    this.logger.debug('ChatMenuComponent initialized');
  }

  subState() {
    this.chatService.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
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
