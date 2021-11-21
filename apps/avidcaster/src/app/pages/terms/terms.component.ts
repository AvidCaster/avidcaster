/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'fullerstack-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {
  termsList = [
    {
      title: _('TERMS.DISCLAIMER.TITLE'),
      description: _('TERMS.DISCLAIMER.DESCRIPTION'),
    },
    {
      title: _('TERMS.PRIVACY.TITLE'),
      description: _('TERMS.PRIVACY.DESCRIPTION'),
    },
    {
      title: _('TERMS.TERMS.TITLE'),
      description: _('TERMS.TERMS.DESCRIPTION'),
    },
  ];

  constructor(readonly i18n: I18nService, readonly auth: AuthService) {}
}
