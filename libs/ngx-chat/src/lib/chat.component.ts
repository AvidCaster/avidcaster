/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnInit } from '@angular/core';

import { ChatService } from './chat.service';

@Component({
  selector: 'fullerstack-chat',
  template: '<p>Chat monitor started!</p>',
})
export class ChatComponent implements OnInit {
  constructor(readonly chatService: ChatService) {}

  ngOnInit(): void {
    console.log('Chat monitoring started!');
  }
}
