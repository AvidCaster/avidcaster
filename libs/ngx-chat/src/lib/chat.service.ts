/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { BehaviorSubject, Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';

import { CHAT_STORAGE_KEY, CHAT_URL_FULLSCREEN, ChatSupportedSites } from './chat.default';
import { ChatMessage, ChatMessageEvent } from './chat.model';
import { parseChat } from './chat.youtube';

@Injectable()
export class ChatService {
  private destroy$ = new Subject<boolean>();
  private onMessageOb$: Observable<Event>;
  private chatOb$ = new BehaviorSubject<ChatMessage>({});
  chat$ = this.chatOb$.asObservable();
  lastUrl: string;

  constructor(
    readonly router: Router,
    readonly logger: LoggerService,
    readonly layout: LayoutService
  ) {
    this.onMessageOb$ = fromEvent(window, 'message');

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
    this.onMessageOb$.pipe(takeUntil(this.destroy$)).subscribe((event: MessageEvent) => {
      const data = event.data as ChatMessageEvent;
      if (data.type === 'avidcaster-chat-south-bound') {
        switch (data.action) {
          case 'chat-new':
            switch (data.host) {
              case 'youtube': {
                const chat = parseChat(data.payload);
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chat));
                console.log(JSON.stringify(chat, null, 4));
                break;
              }
              case 'twitch':
                break;
              default:
                console.log(`Unknown host: ${data.host}`);
                break;
            }
            break;
          default:
            break;
        }
      }
    });
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
