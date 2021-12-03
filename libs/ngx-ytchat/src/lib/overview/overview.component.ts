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
  selector: 'fullerstack-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  constructor(readonly ytchatService: YTChatService) {}
}
