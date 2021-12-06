/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';

import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-iframe',
  templateUrl: './chat-iframe.component.html',
  styleUrls: ['./chat-iframe.component.scss'],
})
export class ChatIframeComponent implements OnInit {
  constructor(
    readonly cdRef: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.logger.info('Chat monitoring started!');
  }

  homeUrl(url: string) {
    const baseUrl = this.chatService.layout.uix.window?.location?.origin;
    return `${baseUrl}${url}`;
  }

  openOverlay() {
    this.chatService.layout.uix.window.open(
      '/chat/overlay/screen',
      '_blank',
      'width=1200,height=720,left=100,top=100'
    );
  }

  showStreamId() {
    this.cdRef.detectChanges();
  }
}
