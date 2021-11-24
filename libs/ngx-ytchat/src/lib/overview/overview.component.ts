import { Component, OnInit } from '@angular/core';

import { YTChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  constructor(readonly ytchatService: YTChatService) {}

  ngOnInit(): void {
    console.log('overview');
  }
}
