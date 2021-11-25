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
    fullscreen: true,
    headless: true,
  },
  {
    name: _('CHAT.OVERLAY'),
    icon: 'message-text',
    children: [
      {
        name: _('COMMON.OVERVIEW'),
        icon: 'magnify-expand',
        link: '/chat/overview',
      },
      {
        name: _('COMMON.SETUP'),
        icon: 'cog',
        link: '/chat/setup',
      },
      // {
      //   name: _('CHAT.OVERLAY'),
      //   icon: 'youtube',
      //   link: 'chat/youtube/overlay',
      //   fullscreen: true,
      //   headless: true,
      // },
    ],
  },
];
