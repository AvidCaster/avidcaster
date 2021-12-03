import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { BehaviorSubject, Subject, filter, takeUntil } from 'rxjs';

import { CHAT_STORAGE_KEY, CHAT_URL_FULLSCREEN, ChatSupportedSites } from './chat.default';
import { ChatMessage } from './chat.model';

@Injectable()
export class ChatService {
  private destroy$ = new Subject<boolean>();
  private chatObs$ = new BehaviorSubject<ChatMessage>({});
  chat$ = this.chatObs$.asObservable();
  lastUrl: string;

  constructor(
    readonly router: Router,
    readonly logger: LoggerService,
    readonly layout: LayoutService
  ) {
    this.changeRouteSubscription();
    this.southBoundSubscription();
    this.setNewChatSelector();
  }

  private changeRouteSubscription() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          if (this.router.url?.startsWith(CHAT_URL_FULLSCREEN)) {
            this.layout.setHeadless(true);
          } else if (this.lastUrl?.startsWith(CHAT_URL_FULLSCREEN)) {
            this.layout.setHeadless(false);
          }
          this.lastUrl = this.router.url;
        },
      });
  }

  private southBoundSubscription() {
    this.layout.uix.window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'avidcaster-chat-south-bound') {
          switch (event.data.action) {
            case 'new-chat':
              // console.log(event.data);
              localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(event.data.payload));
              // this.cleanData(event.data.payload as YTChatPayloadSouthBound);
              break;
            default:
              break;
          }
        }
      },
      false
    );
  }

  private setNewChatSelector() {
    const data = {
      type: 'avidcaster-chat-north-bound',
      action: 'observe-chat',
      payload: ChatSupportedSites.youtube.observer,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }
}
