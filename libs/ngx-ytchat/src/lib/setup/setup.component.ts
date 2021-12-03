/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component } from '@angular/core';

import { YTChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent {
  constructor(readonly ytchatService: YTChatService) {}
}
