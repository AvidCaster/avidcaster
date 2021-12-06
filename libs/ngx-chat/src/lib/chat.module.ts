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
import { MarkdownModule } from 'ngx-markdown';

import { chatRoutes } from './chat.routes';
import { ChatService } from './chat.service';
import { ChatIframeComponent } from './iframe/chat-iframe.component';
import { ChatListComponent } from './list/chat-list.component';
import { ChatOverlayComponent } from './overlay/chat-overlay.component';
import { ChatOverviewComponent } from './overview/chat-overview.component';
import { ChatSetupComponent } from './setup/chat-setup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(chatRoutes),
    MarkdownModule.forChild(),
    I18nModule.forChild(),
  ],
  declarations: [
    ChatIframeComponent,
    ChatSetupComponent,
    ChatOverviewComponent,
    ChatListComponent,
    ChatOverlayComponent,
  ],
  providers: [ChatService],
})
export class ChatModule {}
