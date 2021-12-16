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
  selector: 'fullerstack-chat-overview',
  templateUrl: './chat-overview.component.html',
  styleUrls: ['./chat-overview.component.scss'],
})
export class ChatOverviewComponent {
  constructor(readonly chatService: ChatService) {}
}
