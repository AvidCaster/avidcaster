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
import { FireworksModule } from '@fullerstack/ngx-fireworks';
import { I18nModule } from '@fullerstack/ngx-i18n';
import { MaterialModule } from '@fullerstack/ngx-material';
import { MarkdownModule } from 'ngx-markdown';

import { OverlayComponent } from './overlay/overlay.component';
import { ytChatRoutes } from './ytchat.routes';
import { YTChatService } from './ytchat.service';
import { OverviewComponent } from './overview/overview.component';
import { SetupComponent } from './setup/setup.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MarkdownModule.forChild(),
    RouterModule.forChild(ytChatRoutes),
    I18nModule.forChild(),
    FireworksModule,
  ],
  exports: [OverlayComponent],
  declarations: [OverlayComponent, OverviewComponent, SetupComponent],
  providers: [YTChatService],
})
export class YTChatModule {}
