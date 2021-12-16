/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

import { ChatOverviewComponent } from './doc/overview/chat-overview.component';
import { ChatSetupComponent } from './doc/setup/chat-setup.component';
import { ChatIframeComponent } from './iframe/chat-iframe.component';
import { ChatOverlayComponent } from './overlay/chat-overlay.component';

export const chatRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overlay',
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
    path: 'overlay',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'screen',
        component: ChatOverlayComponent,
        data: {
          title: _('CHAT.OVERLAY'),
          description: _('CHAT.OVERLAY_DESC'),
        },
      },
      {
        path: 'overview',
        component: ChatOverviewComponent,
        data: {
          title: _('COMMON.OVERVIEW'),
          description: _('CHAT.OVERVIEW_DESC'),
        },
      },
      {
        path: 'setup',
        component: ChatSetupComponent,
        data: {
          title: _('COMMON.SETUP'),
          description: _('CHAT.SETUP_DESC'),
        },
      },
    ],
  },
];
