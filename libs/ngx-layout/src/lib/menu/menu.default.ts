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
    name: _('CHAT.MANAGER_ADMIN'),
    icon: 'message-text',
    children: [
      {
        name: _('COMMON.OVERVIEW'),
        icon: 'magnify-expand',
        link: '/chat/manager/overview',
      },
      {
        name: _('COMMON.SETUP'),
        icon: 'cog',
        link: '/chat/manager/setup',
      },
      // { // available via chat overview
      //   name: _('COMMON.MANAGER_ADMIN'),
      //   icon: 'fit-to-screen',
      //   link: '/chat/manager/admin',
      // },
    ],
  },
];
