import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '@fullerstack/ngx-auth';
import { I18nService } from '@fullerstack/ngx-i18n';
import { slideInAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';

import {
  MAX_CHAT_MESSAGES_LENGTH,
  YTChatIframeContainer,
  YTChatObserverDefault,
} from '../ytchat.default';
import { YTChatInfo, YTChatMessageData, YTChatWordAction } from '../ytchat.model';
import { YTChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  animations: [slideInAnimations.slideIn],
})
export class OverlayComponent implements OnInit, OnDestroy {
  $player: HTMLAudioElement;
  @ViewChild('audioTag') set playerRef(ref: ElementRef<HTMLAudioElement>) {
    this.$player = ref.nativeElement;
  }
  private destroy$ = new Subject<boolean>();
  maxLength = MAX_CHAT_MESSAGES_LENGTH;
  data: YTChatInfo = {};
  slideInState = 0;
  currentLanguage;
  ltr = true;
  fwStarted = false;
  fwEnabled = true;
  cleanEnabled = false;
  isFullscreen = false;
  form: FormGroup;
  wordsList: string[] = [];
  wordsAction: YTChatWordAction = 'highlight';
  audioStarted = false;
  audioEnable = false;

  constructor(
    readonly sanitizer: DomSanitizer,
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly auth: AuthService,
    readonly uix: UixService,
    readonly chatService: YTChatService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.setIframeContainer();
    this.setDataInfoSubscription();
    this.keywordFilterSubscription();
    this.setNewChatSelector();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      words: [''],
    });
  }

  private setIframeContainer() {
    const data = {
      type: 'avidcaster-chat-north-bound',
      action: 'insert-iframe',
      payload: YTChatIframeContainer,
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  private keywordFilterSubscription() {
    this.form.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.wordsList = value?.words
          .split(' ')
          .map((word: string) => word.trim().toLowerCase())
          .filter((words) => words.length > 0);
      });
  }

  private setNewChatSelector() {
    const data = {
      type: 'avidcaster-chat-north-bound',
      action: 'observe-chat',
      payload: YTChatObserverDefault,
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  private setDataInfoSubscription() {
    this.chatService.chatInfo$
      .pipe(
        filter((data) => !!data?.authorName?.length),
        filter((data) => {
          if (this.wordsList.length < 1) {
            return true;
          }

          const chatWords = data?.message
            .replace(/<[^>]*>/g, '')
            .toLowerCase()
            .replace(/\s\s+/g, ' ')
            .trim()
            .split(' ');
          const matched = chatWords.filter((value) => this.wordsList.includes(value)).length > 0;

          switch (this.wordsAction) {
            case 'highlight':
              if (matched) {
                data.action = this.wordsAction;
              }
              return true;
            case 'filter':
              if (matched) {
                data.action = this.wordsAction;
              }
              return matched;
            default:
              return false;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.data = data;
        if (data?.authorName?.length) {
          if (this.data.donation || this.data.membership) {
            this.setFireworks(true);
            this.setAudio(true);
          } else {
            this.setFireworks(false);
            this.setAudio(false);
          }
        } else {
          this.data = {};
          this.setFireworks(false);
          this.setAudio(false);
        }
      });
  }

  clearMessage() {
    this.data = {};
  }

  setAudio(start: boolean) {
    this.audioStarted = this.audioEnable && start;
    this.audioPlayPause();
  }

  toggleAudio() {
    if (this.audioEnable) {
      this.audioStarted = !this.audioStarted;
    }
    this.audioPlayPause();
  }

  enableDisableAudio() {
    this.audioEnable = !this.audioEnable;
    if (!this.audioEnable && this.audioStarted) {
      this.audioStarted = false;
    }
    this.audioPlayPause();
  }

  audioPlayPause() {
    if (this.audioStarted) {
      this.$player.currentTime = 0;
      this.$player.play();
    } else {
      this.$player.pause();
    }
  }

  setFireworks(start: boolean) {
    this.fwStarted = this.fwEnabled && start;
  }

  toggleFireworks() {
    if (this.fwEnabled) {
      this.fwStarted = !this.fwStarted;
    }
  }

  enableDisableFireworks() {
    this.fwEnabled = !this.fwEnabled;
    if (!this.fwEnabled && this.fwStarted) {
      this.fwStarted = false;
    }
  }

  toggleCleanChat() {
    this.cleanEnabled = !this.cleanEnabled;
    const data = {
      type: 'avidcaster-chat-north-bound',
      action: this.cleanEnabled ? 'declutter' : 'reclutter',
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  processWords(isToggle = false) {
    if (isToggle) {
      if (this.wordsAction === 'highlight') {
        this.wordsAction = 'filter';
      } else if (this.wordsAction === 'filter') {
        this.wordsAction = 'highlight';
      }
    }
  }

  toggleFullscreen() {
    if (this.uix.inIframe) {
      this.isFullscreen = !this.isFullscreen;
      const data = {
        type: 'avidcaster-chat-north-bound',
        action: 'fullscreen',
        payload: {
          fullscreen: this.isFullscreen,
        },
      };

      window.parent.postMessage(data, '*');
    } else {
      this.uix.toggleFullscreen();
      setTimeout(() => {
        this.isFullscreen = this.uix.isFullscreen();
      }, 0);
    }
  }

  navigate(url: string) {
    if (this.uix.inIframe) {
      const baseUrl = this.uix.window?.location?.origin;
      const data: YTChatMessageData = {
        type: 'avidcaster-chat-north-bound',
        action: 'navigate',
        payload: {
          url: `${baseUrl}${url}`,
        },
      };

      this.uix.window.parent.postMessage(data, '*');
    } else {
      this.auth.goTo(url);
    }
  }

  toggleDirection() {
    this.ltr = !this.ltr;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
