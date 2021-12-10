/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { MenuItem } from '@fullerstack/ngx-menu';

export const layoutMenuTree: MenuItem[] = [
  {
    name: _('COMMON.ANNOTATE'),
    icon: 'draw',
    link: '/annotate/draw',
  },
  {
    name: _('CHAT.OVERLAY'),
    icon: 'message-text',
    children: [
      {
        name: _('COMMON.OVERVIEW'),
        icon: 'magnify-expand',
        link: '/chat/overlay/overview',
      },
      {
        name: _('COMMON.SETUP'),
        icon: 'cog',
        link: '/chat/overlay/setup',
      },
      {
        name: _('COMMON.SCREEN'),
        icon: 'fit-to-screen',
        link: '/chat/overlay/screen',
      },
    ],
  },
];
