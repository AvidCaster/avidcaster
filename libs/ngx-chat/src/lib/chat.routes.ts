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
import { ChatManagerAdminComponent } from './manager/chat-manager.component';

export const chatRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'manager',
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
    path: 'manager',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'admin',
        component: ChatManagerAdminComponent,
        data: {
          title: _('CHAT.MANAGER_ADMIN'),
          description: _('CHAT.MANAGER_ADMIN_DESC'),
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
