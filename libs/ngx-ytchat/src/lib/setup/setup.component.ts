import { Component, OnInit } from '@angular/core';

import { YTChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
  constructor(readonly ytchatService: YTChatService) {}

  ngOnInit(): void {
    console.log('set');
  }
}
