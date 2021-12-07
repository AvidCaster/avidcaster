import { Component, ElementRef, NgZone, OnInit } from '@angular/core';

import { CHAT_STORAGE_KEY_OVERLAY_REQUEST } from '../chat.default';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-overlay',
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.scss'],
})
export class ChatOverlayComponent implements OnInit {
  constructor(readonly zone: NgZone, readonly elR: ElementRef, readonly chatService: ChatService) {}

  ngOnInit(): void {
    console.log('ChatOverlayComponent.ngOnInit');
    this.storageSubscription();
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      addEventListener(
        'storage',
        (event) => {
          if (event.key === CHAT_STORAGE_KEY_OVERLAY_REQUEST) {
            this.chatService.broadcastNewChatOverlayResponse();
            this.elR.nativeElement.focus();
          }
        },
        false
      );
    });
  }
}
