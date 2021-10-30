/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApplicationConfig } from '@fullerstack/ngx-config';

import { environment as prodEnv } from './environment.prod';

export const environment: Readonly<ApplicationConfig> = {
  ...prodEnv,
  platform: 'electron',
  appName: 'AvidCaster',
};
