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

import { chatRoutes } from './chat.routes';
import { ChatService } from './chat.service';
import { ChatIframeComponent } from './iframe/chat-frame.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(chatRoutes), I18nModule.forChild()],
  declarations: [ChatIframeComponent],
  providers: [ChatService],
})
export class ChatModule {}
