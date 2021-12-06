import { Component, OnInit } from '@angular/core';

import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  constructor(readonly chatService: ChatService) {}

  ngOnInit(): void {
    console.log('ChatListComponent.ngOnInit()');
  }
}
