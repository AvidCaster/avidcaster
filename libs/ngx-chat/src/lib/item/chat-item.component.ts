import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent implements OnInit {
  @Input() chat: ChatMessageItem;
  private destroyed$ = new Subject<boolean>();

  constructor(readonly chatService: ChatService) {}

  ngOnInit(): void {
    console.log('ChatItemComponent.ngOnInit()');
  }

  getHostColor(host): string {
    switch (host) {
      case 'youtube':
        return 'warn';
      case 'twitch':
        return 'primary';
      default:
        return 'accent';
    }
  }
}
