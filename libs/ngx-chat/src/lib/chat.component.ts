import { Component, OnInit } from '@angular/core';

import { ChatService } from './chat.service';

@Component({
  selector: 'fullerstack-chat',
  template: '<p>Chat monitor started!</p>',
})
export class ChatComponent implements OnInit {
  constructor(readonly chatService: ChatService) {}

  ngOnInit(): void {
    console.log('Chat monitoring started!');
  }
}
