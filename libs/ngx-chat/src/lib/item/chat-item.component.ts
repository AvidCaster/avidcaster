import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { ChatMessageHosts, ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent {
  @Input() set viewed(value: boolean) {
    this.chat.viewed = value;
  }
  @Input() chat: ChatMessageItem;
  private destroyed$ = new Subject<boolean>();

  constructor(readonly cdR: ChangeDetectorRef, readonly chatService: ChatService) {}

  getHostColor(host: ChatMessageHosts): string {
    switch (host) {
      case 'youtube':
        return 'warn';
      case 'twitch':
        return 'primary';
      default:
        return 'accent';
    }
  }

  onClick(): void {
    this.chat.viewed = true;
    this.chatService.chatSelected(this.chat);
    this.cdR.detectChanges();
  }
}
