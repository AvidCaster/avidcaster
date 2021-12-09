import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject } from 'rxjs';

@Component({
  selector: 'fullerstack-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
})
export class ChatMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  constructor(readonly logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.debug('ChatMenuComponent initialized');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
