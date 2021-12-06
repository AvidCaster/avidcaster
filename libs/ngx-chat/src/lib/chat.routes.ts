/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

import { ChatIframeComponent } from './iframe/chat-frame.component';
import { ChatOverviewComponent } from './overview/chat-overview.component';
import { ChatSetupComponent } from './setup/chat-setup.component';

export const chatRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'iframe',
      },
      {
        path: 'iframe',
        component: ChatIframeComponent,
        data: {
          title: _('COMMON.MONITOR'),
          description: _('CHAT.MONITOR_DESC'),
        },
      },
      {
        path: 'overlay/overview',
        component: ChatOverviewComponent,
        data: {
          title: _('COMMON.OVERVIEW'),
          description: _('CHAT.OVERVIEW_DESC'),
        },
      },
      {
        path: 'overlay/setup',
        component: ChatSetupComponent,
        data: {
          title: _('COMMON.SETUP'),
          description: _('CHAT.SETUP_DESC'),
        },
      },
    ],
  },
];
