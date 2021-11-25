import { Component } from '@angular/core';

import { YTChatService } from '../ytchat.service';

@Component({
  selector: 'fullerstack-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  constructor(readonly ytchatService: YTChatService) {}
}
