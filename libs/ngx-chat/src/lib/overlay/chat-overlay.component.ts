import { Component, OnInit } from '@angular/core';

import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-overlay',
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.scss'],
})
export class ChatOverlayComponent implements OnInit {
  constructor(readonly chatService: ChatService) {}

  ngOnInit(): void {
    console.log('ChatOverlayComponent.ngOnInit');
  }
}
