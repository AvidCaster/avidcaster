import { Component, OnInit } from '@angular/core';

import { defaultYtChatMessage } from '../ytchat.default';
import { YtChatMessage } from '../ytchat.model';
import { YtChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit {
  data = defaultYtChatMessage();

  constructor(readonly ytchatService: YtChatService) {}

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
    this.data = { ...data, message: data.message.replace(/\s\s+/g, ' ') };
  }

  clearMessage() {
    this.data = {};
  }
}
