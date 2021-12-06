/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { BehaviorSubject, Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { v4 as uuid_v4 } from 'uuid';

import { CHAT_STORAGE_KEY, CHAT_URL_FULLSCREEN, ChatSupportedSites } from './chat.default';
import {
  ChatMessage,
  ChatMessageDirection,
  ChatMessageDownstreamAction,
  ChatMessageEvent,
  ChatMessageHosts,
  ChatMessageUpstreamAction,
} from './chat.model';
import { parseTwitchChat } from './util/chat.util.twitch';
import { parseYouTubeChat } from './util/chat.util.youtube';

@Injectable()
export class ChatService {
  private destroy$ = new Subject<boolean>();
  private onMessageOb$: Observable<Event>;
  private chatOb$ = new BehaviorSubject<ChatMessage>({});
  chat$ = this.chatOb$.asObservable();
  lastUrl: string;
  currentHost: string;

  constructor(
    readonly zone: NgZone,
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
    setTimeout(() => localStorage.removeItem(key), 0);
  }

  private southBoundSubscription() {
    this.zone.runOutsideAngular(() => {
      this.onMessageOb$.pipe(takeUntil(this.destroy$)).subscribe((event: MessageEvent) => {
        const data = event.data as ChatMessageEvent;
        if (data.type === ChatMessageDirection.SouthBound) {
          switch (data.action) {
            case ChatMessageDownstreamAction.pong:
              this.currentHost = data.host;
              this.setNorthBoundIframe(this.currentHost);
              break;
            case ChatMessageDownstreamAction.chat:
              switch (data.host) {
                case ChatMessageHosts.youtube: {
                  const chat = parseYouTubeChat(data.host, data.payload);
                  this.broadcastChatMessage(data.host, chat);
                  // console.log(JSON.stringify(chat, null, 4));
                  break;
                }
                case ChatMessageHosts.twitch: {
                  const chat = parseTwitchChat(data.host, data.payload);
                  this.broadcastChatMessage(data.host, chat);
                  console.log(JSON.stringify(chat, null, 4));
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
    });
  }

  private setNorthBoundReadyPing() {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.ping,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }

  private setNorthBoundSelector(host: string) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.observe,
      payload: ChatSupportedSites[host].observer,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }

  private setNorthBoundIframe(host: string) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.iframe,
      payload: ChatSupportedSites[host].iframe,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
    setTimeout(() => this.setNorthBoundSelector(host), 1000);
  }
}
