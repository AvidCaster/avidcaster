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
import {
  BehaviorSubject,
  Observable,
  Subject,
  buffer,
  filter,
  fromEvent,
  takeUntil,
  throttleTime,
} from 'rxjs';
import { v4 as uuid_v4 } from 'uuid';

import { CHAT_STORAGE_KEY, CHAT_URL_FULLSCREEN, ChatSupportedSites } from './chat.default';
import { ChatMessage, ChatMessageEvent } from './chat.model';
import { parseTwitchChat } from './chat.util.twitch';
import { parseYouTubeChat } from './chat.util.youtube';

@Injectable()
export class ChatService {
  private destroy$ = new Subject<boolean>();
  private onMessageOb$: Observable<Event>;
  private chatOb$ = new BehaviorSubject<ChatMessage>({});
  chat$ = this.chatOb$.asObservable();
  lastUrl: string;
  currentHost: string;

  constructor(
    readonly router: Router,
    readonly logger: LoggerService,
    readonly layout: LayoutService
  ) {
    this.onMessageOb$ = fromEvent(window, 'message');
    this.changeRouteSubscription();
    this.southBoundSubscription();
    this.setNorthBoundReadyPing();
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

  private broadcastChatMessage(host: string, chat: ChatMessage) {
    const key = `${CHAT_STORAGE_KEY}-${host}-${uuid_v4()}`;
    localStorage.setItem(key, JSON.stringify(chat));
  }

  private southBoundSubscription() {
    this.onMessageOb$
      .pipe(buffer(this.onMessageOb$.pipe(throttleTime(100))), takeUntil(this.destroy$))
      .subscribe((event: Event[]) => {
        const data = (event[0] as MessageEvent).data as ChatMessageEvent;
        if (data.type === 'avidcaster-chat-south-bound') {
          switch (data.action) {
            case 'pong':
              this.currentHost = data.host;
              this.setNorthBoundSelector(this.currentHost);
              this.setNorthBoundIframe(this.currentHost);
              break;
            case 'chat':
              switch (data.host) {
                case 'youtube': {
                  const chat = parseYouTubeChat(data.payload);
                  this.broadcastChatMessage(data.host, chat);
                  // console.log(JSON.stringify(chat, null, 4));
                  break;
                }
                case 'twitch': {
                  const chat = parseTwitchChat(data.payload);
                  this.broadcastChatMessage(data.host, chat);
                  // console.log(JSON.stringify(chat, null, 4));
                  break;
                }
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

  private setNorthBoundReadyPing() {
    const data = {
      type: 'avidcaster-chat-north-bound',
      action: 'ping',
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }

  private setNorthBoundSelector(host: string) {
    const data = {
      type: 'avidcaster-chat-north-bound',
      action: 'observe',
      payload: ChatSupportedSites[host].observer,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }

  private setNorthBoundIframe(host: string) {
    const data = {
      type: 'avidcaster-chat-north-bound',
      action: 'iframe',
      payload: ChatSupportedSites[host].iframe,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }
}