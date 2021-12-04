/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

import { ChatComponent } from './chat.component';

export const chatRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'monitor',
      },
      {
        path: 'monitor',
        component: ChatComponent,
        data: {
          title: _('COMMON.MONITOR'),
          description: _('CHAT.MONITOR_DESC'),
        },
      },
    ],
  },
];