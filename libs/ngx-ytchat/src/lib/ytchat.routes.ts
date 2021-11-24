/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

import { OverlayComponent } from './overlay/overlay.component';
import { OverviewComponent } from './overview/overview.component';
import { SetupComponent } from './setup/setup.component';

export const ytChatRoutes: Routes = [
  {
    path: 'chat',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overlay',
      },
      {
        path: 'overview',
        component: OverviewComponent,
        data: {
          title: _('COMMON.OVERVIEW'),
          description: _('CHAT.OVERVIEW_DESC'),
        },
      },
      {
        path: 'setup',
        component: SetupComponent,
        data: {
          title: _('COMMON.SETUP'),
          description: _('CHAT.SETUP_DESC'),
        },
      },
      {
        path: 'youtube/overlay',
        component: OverlayComponent,
        data: {
          title: _('CHAT.OVERLAY'),
          description: _('CHAT.OVERLAY_DESC'),
        },
      },
    ],
  },
];
