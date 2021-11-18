import { Component, OnInit } from '@angular/core';
import { FireworkAction } from '@fullerstack/ngx-fireworks';
import { I18nService } from '@fullerstack/ngx-i18n';
import { slideInAnimations } from '@fullerstack/ngx-shared';
import { take } from 'rxjs';

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
  maxLength = MAX_CHAT_MESSAGES_LENGTH;
  data: YtChatMessage = {};
  slideInState = 0;
  currentLanguage;
  action: FireworkAction = 'stop';

  constructor(readonly i18n: I18nService, readonly ytchatService: YtChatService) {}

  ngOnInit(): void {
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'ytchat-data') {
          this.setData(event.data as YtChatMessage);
        }
      },
      false
    );
  }

  setData(data: YtChatMessage) {
    if (data?.authorName.length && data?.message?.length) {
      this.slideInState++;
      this.i18n.translate
        .get(data?.message.html)
        .pipe(take(1))
        .subscribe((html: string) => {
          this.data = {
            ...data,
            message: { ...data.message, html },
            authorImg: data.authorImg || './assets/images/misc/avatar-default.png',
          };
        });
    }
  }

  clearMessage() {
    this.data = {};
  }

  testMessage() {
    this.setData(defaultYtChatMessage());
  }

  fireworksAction(action: FireworkAction) {
    this.action = action;
  }
}
