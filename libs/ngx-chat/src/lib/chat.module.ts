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
import { NgLetModule } from 'ng-let';
import { MarkdownModule } from 'ngx-markdown';

import { chatRoutes } from './chat.routes';
import { ChatService } from './chat.service';
import { ChatOverviewComponent } from './doc/overview/chat-overview.component';
import { ChatSetupComponent } from './doc/setup/chat-setup.component';
import { ChatFilterComponent } from './filter/chat-filter.component';
import { ChatIframeComponent } from './iframe/chat-iframe.component';
import { ChatItemComponent } from './item/chat-item.component';
import { ChatListComponent } from './list/chat-list.component';
import { ChatManagerAdminComponent } from './manager/chat-manager.component';
import { ChatMenuComponent } from './menu/chat-menu.component';
import { ChatOptionsComponent } from './options/chat-options.component';
import { ChatSelectedComponent } from './selected/chat-selected.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(chatRoutes),
    MarkdownModule.forChild(),
    I18nModule.forChild(),
    FireworksModule,
    NgLetModule,
  ],
  declarations: [
    ChatIframeComponent,
    ChatSetupComponent,
    ChatOverviewComponent,
    ChatItemComponent,
    ChatListComponent,
    ChatManagerAdminComponent,
    ChatSelectedComponent,
    ChatMenuComponent,
    ChatFilterComponent,
    ChatOptionsComponent,
  ],
  providers: [ChatService],
})
export class ChatModule {}
