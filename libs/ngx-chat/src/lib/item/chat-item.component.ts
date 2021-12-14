import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { ChatHosts, ChatMessageItem } from '../chat.model';
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

  getHostColor(host: ChatHosts): string {
    switch (host) {
      case 'youtube':
        return 'warn';
      case 'twitch':
        return 'primary';
      default:
        return 'accent';
    }
  }

  getHostImage(host: ChatHosts): string {
    switch (host) {
      case 'youtube':
      case 'twitch':
        return `./assets/images/misc/${host}-x48.png`;
      default:
        return '';
    }
  }

  onClick(): void {
    this.chat.viewed = true;
    this.chatService.chatSelected(this.chat);
    this.cdR.markForCheck();
  }
}
