/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FireworksComponent } from './fireworks/fireworks.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FireworksComponent],
  exports: [FireworksComponent],
})
export class FireworksModule {}
