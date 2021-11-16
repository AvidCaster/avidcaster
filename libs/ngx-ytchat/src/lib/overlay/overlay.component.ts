import { Component, OnInit } from '@angular/core';
import { I18nService } from '@fullerstack/ngx-i18n';

import { MAX_CHAT_MESSAGES_LENGTH, defaultYtChatMessage } from '../ytchat.default';
import { YtChatMessage } from '../ytchat.model';
import { YtChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit {
  maxLength = MAX_CHAT_MESSAGES_LENGTH;
  data = defaultYtChatMessage();

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
      this.data = {
        ...data,
        message: data.message,
        authorImg: data.authorImg || './assets/images/misc/avatar-default.png',
      };
    }
  }

  clearMessage() {
    this.data = {};
  }
}
