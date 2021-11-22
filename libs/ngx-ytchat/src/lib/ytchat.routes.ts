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

export const ytChatRoutes: Routes = [
  {
    path: 'chat/youtube',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overlay',
      },
      {
        path: 'overlay',
        component: OverlayComponent,
        data: {
          title: _('CHAT.OVERLAY'),
          description: _('CHAT.OVERLAY_DESC'),
        },
      },
    ],
  },
];
