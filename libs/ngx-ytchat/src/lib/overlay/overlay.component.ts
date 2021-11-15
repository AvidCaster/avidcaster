import { Component, OnInit } from '@angular/core';

import { YtChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit {
  constructor(readonly ytchatService: YtChatService) {}

  ngOnInit(): void {
    console.log('OverlayComponent.ngOnInit()');
  }
}
