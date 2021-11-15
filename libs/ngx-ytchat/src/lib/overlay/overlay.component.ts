import { Component, OnInit } from '@angular/core';

import { YtChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit {
  constructor(readonly ytchatService: YtChatService) {}
  data: any;

  ngOnInit(): void {
    console.log('OverlayComponent.ngOnInit()');
    this.data = {
      donation: '$100.00',
      authorName: 'Val Neekman',
      authorImg:
        'https://yt4.ggpht.com/ytc/AKedOLQ2gO2AW6gYdlKXgOYlyFy3kzWtgTlCddjO8T24Ng=s128-c-k-c0x00ffffff-no-rj',
      message:
        'Hello there, I am wondering if you can show me where to buy stuff, and how it goes if that happens! Hello there, I am wondering if you can show me where to buy stuff, and how it goes if that happens! Hello there, I am wondering if you can show me where to buy stuff, and how it goes if that happens!',
    };

    window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'ytchat-data') {
          this.data = { ...event.data };
          console.log('OverlayComponent.ngOnInit() event', event);
        }
      },
      false
    );
  }
}
