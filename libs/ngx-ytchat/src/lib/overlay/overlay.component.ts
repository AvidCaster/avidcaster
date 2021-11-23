import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@fullerstack/ngx-auth';
import { FireworkAction } from '@fullerstack/ngx-fireworks';
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
import { YTChatMessageData, YTChatPayload } from '../ytchat.model';
import { YTChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  animations: [slideInAnimations.slideIn],
})
export class OverlayComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  maxLength = MAX_CHAT_MESSAGES_LENGTH;
  data: YTChatPayload = {};
  slideInState = 0;
  currentLanguage;
  ltr = true;
  fwAction: FireworkAction = 'stop';
  fwEnabled = true;
  cleanEnabled = false;
  isFullscreen = false;
  form: FormGroup;
  highlightWords: string[] = [];
  filterWords = false;
  wordsPlaceholder = 'CHAT.HIGHLIGHT_WORDS';

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
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.setHighlightedWords(value?.words.split(' '));
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
        this.fireworksAction('start');
      } else {
        this.fireworksAction('stop');
      }
    } else {
      this.data = {};
      this.fireworksAction('stop');
    }
  }

  clearMessage() {
    this.setData();
  }

  testMessage() {
    this.setData(defaultYTChatMessage());
  }

  fireworksAction(action: FireworkAction) {
    if (this.fwEnabled) {
      this.fwAction = action;
    }
  }

  enableFireworks(enable: boolean) {
    this.fwEnabled = enable;
    if (!this.fwEnabled && this.fwAction === 'start') {
      this.fwAction = 'stop';
    }
  }

  cleanChat(clean: boolean) {
    this.cleanEnabled = clean;
    const data = {
      type: 'avidcaster-overlay-north-bound',
      action: clean ? 'declutter' : 'reclutter',
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  setHighlightedWords(words: string[]) {
    this.highlightWords = words?.map((word) => word.trim()).filter((word) => word.length > 0);
    if (this.highlightWords?.length) {
      const data = {
        type: 'avidcaster-overlay-north-bound',
        action: 'highlight-words',
        payload: {
          words: this.highlightWords,
          filtered: this.filterWords,
        },
      };

      this.uix.window.parent.postMessage(data, '*');
    }
  }

  toggleFilterWords() {
    this.filterWords = !this.filterWords;
    const data = {
      type: 'avidcaster-overlay-north-bound',
      action: 'filter-words',
      payload: {
        words: this.highlightWords,
        filter: this.filterWords,
      },
    };
    if (this.filterWords) {
      this.wordsPlaceholder = 'CHAT.FILTER_WORDS';
    } else {
      this.wordsPlaceholder = 'CHAT.HIGHLIGHT_WORDS';
    }
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
