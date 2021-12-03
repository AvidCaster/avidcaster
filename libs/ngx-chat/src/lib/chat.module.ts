import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@fullerstack/ngx-i18n';

import { ChatComponent } from './chat.component';
import { chatRoutes } from './chat.routes';
import { ChatService } from './chat.service';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(chatRoutes), I18nModule.forChild()],
  declarations: [ChatComponent],
  providers: [ChatService],
})
export class ChatModule {}
