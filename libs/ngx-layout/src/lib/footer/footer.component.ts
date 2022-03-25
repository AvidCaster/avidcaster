/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

import { FooterItem } from './footer.model';

@Component({
  selector: 'fullerstack-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() appName = 'Fullerstack';

  today = new Date();
  footers: FooterItem[] = [
    {
      type: _('COMMON.RESOURCES'),
      links: [
        {
          name: _('COMMON.CONTACT_US'),
          link: '/contact/us',
          icon: 'at',
        },
        {
          name: _('COMMON.GITHUB'),
          link: 'https://github.com/AvidCaster',
          icon: 'github',
          external: true,
        },
      ],
    },
    {
      type: _('COMMON.SOCIAL'),
      links: [
        {
          name: _('COMMON.YOUTUBE'),
          link: 'https://www.youtube.com/channel/UCzUBef-uvcsqLH0fZMQKhRg',
          icon: 'youtube',
          external: true,
        },
        {
          name: _('SOCIAL.TWITTER'),
          link: 'https://twitter.com/vneekman',
          external: true,
          icon: 'twitter',
        },
      ],
    },
    {
      type: _('COMMON.COMPANY'),
      links: [
        {
          name: _('COMMON.TERMS_CONDITIONS'),
          link: '/terms',
          icon: 'script-text-outline',
        },
        {
          name: _('COMMON.TERMS_CONDITIONS'),
          link: 'info@avidcaster.net',
          icon: 'email',
          email: true,
        },
      ],
    },
  ];
}
