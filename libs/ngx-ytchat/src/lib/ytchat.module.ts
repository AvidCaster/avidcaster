/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';
import { SharedModule } from '@fullerstack/ngx-shared';

import { OverlayComponent } from './overlay/overlay.component';
import { ytChatRoutes } from './ytchat.routes';
import { YtChatService } from './ytchat.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(ytChatRoutes),
    SharedModule,
    I18nModule.forChild(),
  ],
  exports: [OverlayComponent],
  declarations: [OverlayComponent],
  providers: [YtChatService],
})
export class YtChatModule {}
