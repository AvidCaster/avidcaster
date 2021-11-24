import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@fullerstack/ngx-auth';
import { I18nService } from '@fullerstack/ngx-i18n';
import { slideInAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject, debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs';

import {
  MAX_CHAT_MESSAGES_LENGTH,
  YTCHAT_CSS_FILE_NAME,
  YTCHAT_CSS_MIN_FILE_NAME,
  YTCHAT_JS_FILE_NAME,
  YTCHAT_JS_MIN_FILE_NAME,
  defaultYTChatMessage,
} from '../ytchat.default';
import { YTChatMessageData, YTChatPayload, YTChatWordAction } from '../ytchat.model';
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
  data: YTChatPayload = {};
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
  wordsPlaceholder = 'CHAT.HIGHLIGHT_WORDS';
  audioStarted = false;
  audioEnable = false;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly auth: AuthService,
    readonly uix: UixService,
    readonly ytchatService: YTChatService
  ) {}

  ngOnInit(): void {
    this.appendScript();
    this.appendStyle();

    this.buildForm();

    this.uix.window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'avidcaster-overlay-south-bound') {
          switch (event.data.action) {
            case 'yt-chat':
              this.setData(event.data?.payload as YTChatMessageData);
              break;
            default:
              break;
          }
        }
      },
      false
    );

    this.form.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.wordsList = value?.words
          .split(' ')
          ?.map((words) => words.trim())
          .filter((words) => words.length > 0);

        this.processWords();
      });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      words: [''],
    });
  }

  private appendScript() {
    const baseUrl = this.uix.window?.location?.origin;
    const scriptFile = this.ytchatService.options.production
      ? YTCHAT_JS_MIN_FILE_NAME
      : YTCHAT_JS_FILE_NAME;
    const data = {
      type: 'avidcaster-overlay-north-bound',
      action: 'append-script',
      payload: {
        url: `${baseUrl}/assets/code/${scriptFile}`,
      },
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  private appendStyle() {
    const baseUrl = this.uix.window?.location?.origin;
    const styleFile = this.ytchatService.options.production
      ? YTCHAT_CSS_MIN_FILE_NAME
      : YTCHAT_CSS_FILE_NAME;
    const data = {
      type: 'avidcaster-overlay-north-bound',
      action: 'append-style',
      payload: {
        url: `${baseUrl}/assets/code/${styleFile}`,
      },
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  setData(data?: YTChatPayload) {
    if (!data?.message && data?.donation) {
      data.message = '🎉😊🎉';
    }

    if (!data?.message && data?.membership) {
      data.message = data.membership;
    }

    if (data?.authorName.length) {
      this.slideInState++;
      if (data?.message) {
        this.i18n.translate
          .get(data?.message)
          .pipe(take(1), takeUntil(this.destroy$))
          .subscribe((message: string) => {
            this.data = {
              ...data,
              message,
              authorImage: data.authorImage || './assets/images/misc/avatar-default.png',
            };
          });
      } else {
        this.data = {
          ...data,
          authorImage: data.authorImage || './assets/images/misc/avatar-default.png',
        };
      }

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
  }

  clearMessage() {
    this.setData();
  }

  testMessage() {
    this.setData(defaultYTChatMessage());
  }

  setAudio(start: boolean) {
    this.audioStarted = this.audioEnable && start;
    if (this.audioStarted) {
      this.$player.currentTime = 0;
      this.$player.play();
    } else {
      this.$player.pause();
    }
  }

  toggleAudio() {
    if (this.audioEnable) {
      this.audioStarted = !this.audioStarted;
    }
    if (this.audioStarted) {
      this.$player.currentTime = 0;
      this.$player.play();
    } else {
      this.$player.pause();
    }
  }

  enableDisableAudio() {
    this.audioEnable = !this.audioEnable;
    if (!this.audioEnable && this.audioStarted) {
      this.audioStarted = false;
    }
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
      type: 'avidcaster-overlay-north-bound',
      action: this.cleanEnabled ? 'declutter' : 'reclutter',
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  processWords(isToggle = false) {
    if (isToggle) {
      if (this.wordsAction === 'highlight') {
        this.wordsPlaceholder = 'CHAT.FILTER_WORDS';
        this.wordsAction = 'filter';
      } else if (this.wordsAction === 'filter') {
        this.wordsPlaceholder = 'CHAT.HIGHLIGHT_WORDS';
        this.wordsAction = 'highlight';
      }
    }

    const data = {
      type: 'avidcaster-overlay-north-bound',
      action: 'process-words',
      payload: {
        words: this.wordsList,
        action: this.wordsAction,
      },
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  toggleFullscreen() {
    if (this.uix.inIframe) {
      this.isFullscreen = !this.isFullscreen;
      const data = {
        type: 'avidcaster-overlay-north-bound',
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
        type: 'avidcaster-overlay-north-bound',
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
