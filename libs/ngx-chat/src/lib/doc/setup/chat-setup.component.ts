/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component } from '@angular/core';

import { ChatService } from '../../chat.service';

@Component({
  selector: 'fullerstack-chat-setup',
  templateUrl: './chat-setup.component.html',
  styleUrls: ['./chat-setup.component.scss'],
})
export class ChatSetupComponent {
  constructor(readonly chatService: ChatService) {}
}
