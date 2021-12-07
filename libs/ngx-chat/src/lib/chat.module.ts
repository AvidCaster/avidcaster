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
import { MarkdownModule } from 'ngx-markdown';

import { chatRoutes } from './chat.routes';
import { ChatService } from './chat.service';
import { ChatIframeComponent } from './iframe/chat-iframe.component';
import { ChatItemComponent } from './item/chat-item.component';
import { ChatListComponent } from './list/chat-list.component';
import { ChatOverlayComponent } from './overlay/chat-overlay.component';
import { ChatOverviewComponent } from './overview/chat-overview.component';
import { ChatSetupComponent } from './setup/chat-setup.component';
import { ChatSliderComponent } from './slider/chat-slider.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(chatRoutes),
    MarkdownModule.forChild(),
    I18nModule.forChild(),
  ],
  declarations: [
    ChatIframeComponent,
    ChatSetupComponent,
    ChatOverviewComponent,
    ChatItemComponent,
    ChatListComponent,
    ChatOverlayComponent,
    ChatSliderComponent,
  ],
  providers: [ChatService],
})
export class ChatModule {}
