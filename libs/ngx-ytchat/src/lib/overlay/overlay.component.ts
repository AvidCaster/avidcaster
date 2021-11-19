import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FireworkAction } from '@fullerstack/ngx-fireworks';
import { I18nService } from '@fullerstack/ngx-i18n';
import { slideInAnimations } from '@fullerstack/ngx-shared';
import { Subject, debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs';

import { MAX_CHAT_MESSAGES_LENGTH, defaultYtChatMessage } from '../ytchat.default';
import { YtChatMessage } from '../ytchat.model';
import { YtChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  animations: [slideInAnimations.slideIn],
})
export class OverlayComponent implements OnInit {
  private destroy$ = new Subject<boolean>();
  maxLength = MAX_CHAT_MESSAGES_LENGTH;
  data: YtChatMessage = {};
  slideInState = 0;
  currentLanguage;

  fwAction: FireworkAction = 'stop';
  fwEnabled = true;
  cleanEnabled = false;
  isFullscreen = false;
  form: FormGroup;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly ytchatService: YtChatService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'ytchat-data-south') {
          this.setData(event.data as YtChatMessage);
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

  setData(data?: YtChatMessage) {
    if (!data?.message.html && data?.donation) {
      data.message.html = '🎉😊🎉';
    }

    if (data?.authorName.length) {
      this.slideInState++;
      this.i18n.translate
        .get(data?.message?.html)
        .pipe(take(1))
        .subscribe((html: string) => {
          this.data = {
            ...data,
            message: { ...data.message, html },
            authorImage: data.authorImage || './assets/images/misc/avatar-default.png',
          };
        });
      if (this.data.donation) {
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
    this.setData(defaultYtChatMessage());
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
      type: 'ytchat-data-north',
      action: clean ? 'clean-up' : 'show-all',
    };

    window.parent.postMessage(data, '*');
  }

  setHighlightedWords(words: string[]) {
    words = words?.map((word) => word.trim()).filter((word) => word.length > 0);
    if (words?.length) {
      const data = {
        type: 'ytchat-data-north',
        action: 'highlight-words',
        words,
      };

      window.parent.postMessage(data, '*');
    }
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    const data = {
      type: 'ytchat-data-north',
      action: 'fullscreen',
      fullscreen: this.isFullscreen,
    };

    window.parent.postMessage(data, '*');
  }
}
