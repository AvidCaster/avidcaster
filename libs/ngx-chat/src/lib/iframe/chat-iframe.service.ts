/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@fullerstack/ngx-config';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { StoreService } from '@fullerstack/ngx-store';
import { BehaviorSubject, Observable, Subject, fromEvent, takeUntil } from 'rxjs';
import { v4 as uuid_v4 } from 'uuid';

import {
  CHAT_STORAGE_KEY,
  CHAT_STORAGE_KEY_OVERLAY_REQUEST,
  CHAT_STORAGE_KEY_OVERLAY_RESPONSE,
  ChatSupportedSites,
} from '../chat.default';
import {
  ChatMessage,
  ChatMessageDirection,
  ChatMessageDownstreamAction,
  ChatMessageEvent,
  ChatMessageHostReady,
  ChatMessageHosts,
  ChatMessageUpstreamAction,
} from '../chat.model';
import { ChatService } from '../chat.service';
import { openOverlayWindowScreen } from '../util/chat.util';
import { parseTwitchChat } from '../util/chat.util.twitch';
import { parseYouTubeChat } from '../util/chat.util.youtube';

@Injectable()
export class ChatIframeService implements OnDestroy {
  private nameSpace = 'CHAT';
  private destroy$ = new Subject<boolean>();
  private onMessageOb$: Observable<Event>;
  private onStorageOb$: Observable<Event>;
  private hostReadyOb$ = new BehaviorSubject<ChatMessageHostReady>({ ready: false });
  hostReady$ = this.hostReadyOb$.asObservable();
  currentHost: ChatMessageHosts;
  streamId: string;
  prefix: string;

  awaitOverlayResponse = undefined;

  constructor(
    readonly zone: NgZone,
    readonly router: Router,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly layout: LayoutService,
    readonly chatService: ChatService
  ) {
    this.onMessageOb$ = fromEvent(this.layout.uix.window, 'message');
    this.onStorageOb$ = fromEvent(this.layout.uix.window, 'storage');

    this.southBoundSubscription();
    this.setNorthBoundReadyPing();
    this.storageSubscription();

    this.logger.info(`[${this.nameSpace}] ChatIframeService ready ...`);
  }

  private broadcastNewChatMessage(host: ChatMessageHosts, chat: ChatMessage) {
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
              this.streamId = data.streamId;
              this.setNorthBoundIframe(this.currentHost);
              break;
            case ChatMessageDownstreamAction.ready:
              this.setNorthBoundObserverReady(this.currentHost);
              break;
            case ChatMessageDownstreamAction.chat:
              switch (data.host) {
                case 'youtube': {
                  const chat = parseYouTubeChat(data);
                  chat.streamId = this.streamId;
                  chat.timestamp = new Date().getTime();
                  chat.prefix = this.prefix || this.streamId;
                  this.broadcastNewChatMessage(data.host, chat);
                  // console.log(JSON.stringify(chat, null, 4));
                  break;
                }
                case 'twitch': {
                  const chat = parseTwitchChat(data);
                  chat.streamId = this.streamId;
                  chat.timestamp = new Date().getTime();
                  chat.prefix = this.prefix || this.streamId;
                  this.broadcastNewChatMessage(data.host, chat);
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
    });
  }

  private setNorthBoundObserverReady(host: ChatMessageHosts) {
    this.hostReadyOb$.next({ host, ready: true });
    this.logger.info(`Observer is ready for ${this.currentHost}`);
  }

  private setNorthBoundReadyPing() {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.ping,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }

  private setNorthBoundSelector(host: ChatMessageHosts) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.observe,
      payload: ChatSupportedSites[host].observer,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
  }

  private setNorthBoundIframe(host: ChatMessageHosts) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.iframe,
      payload: ChatSupportedSites[host].iframe,
    };

    this.layout.uix.window.parent.postMessage(data, '*');
    setTimeout(() => {
      this.setNorthBoundSelector(host);
    }, 1000);
  }

  broadcastNewChatOverlayRequest() {
    const key = CHAT_STORAGE_KEY_OVERLAY_REQUEST;
    localStorage.setItem(key, JSON.stringify({ from: 'iframe' }));
    setTimeout(() => localStorage.removeItem(key), 0);
    this.awaitOverlayResponse = setTimeout(() => {
      openOverlayWindowScreen(this.layout.uix.window);
      this.awaitOverlayResponse = undefined;
    }, 1000);
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          if (event.key === CHAT_STORAGE_KEY_OVERLAY_RESPONSE) {
            this.handleNewOverlayResponseEvent();
          }
        },
      });
    });
  }

  private handleNewOverlayResponseEvent() {
    // no one is listening, we can safely open a new overlay screen
    clearTimeout(this.awaitOverlayResponse);
    this.awaitOverlayResponse = undefined;
    this.logger.info('Overlay response received');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
