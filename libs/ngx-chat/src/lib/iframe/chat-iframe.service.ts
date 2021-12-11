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
import { BehaviorSubject, Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { v4 as uuid_v4 } from 'uuid';

import {
  CHAT_STORAGE_MESSAGE_KEY,
  CHAT_STORAGE_OVERLAY_REQUEST_KEY,
  CHAT_STORAGE_OVERLAY_RESPONSE_KEY,
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
  ChatState,
} from '../chat.model';
import { openOverlayWindowScreen, primaryFilterChatMessageItem } from '../util/chat.util';
import { parseTwitchChat } from '../util/chat.util.twitch';
import { parseYouTubeChat } from '../util/chat.util.youtube';

@Injectable()
export class ChatIframeService implements OnDestroy {
  private nameSpace = 'CHAT';
  private destroy$ = new Subject<boolean>();
  private state: ChatState;
  private onMessageOb$: Observable<Event>;
  private onStorageOb$: Observable<Event>;
  private hostReadyOb$ = new BehaviorSubject<ChatMessageHostReady>({ ready: false });
  hostReady$ = this.hostReadyOb$.asObservable();
  currentHost: ChatMessageHosts;
  streamId: string;
  prefix: string;
  windowObj: Window;
  awaitOverlayResponse = undefined;

  constructor(
    readonly zone: NgZone,
    readonly router: Router,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly layout: LayoutService
  ) {
    this.windowObj = this.layout.uix.window;
    this.onMessageOb$ = fromEvent(this.windowObj, 'message');
    this.onStorageOb$ = fromEvent(this.windowObj, 'storage');

    this.southBoundSubscription();
    this.setNorthBoundReadyPing();
    this.storageSubscription();
    this.chatStateSubscription();

    this.logger.info(`[${this.nameSpace}] ChatIframeService ready ...`);
  }

  private broadcastMessage(key: string, value: string) {
    this.windowObj.localStorage.setItem(key, value);
    this.windowObj.localStorage.removeItem(key);
  }

  private broadcastNewChatMessage(host: ChatMessageHosts, chat: ChatMessage) {
    const key = `${CHAT_STORAGE_MESSAGE_KEY}-${host}-${uuid_v4()}`;
    this.broadcastMessage(key, JSON.stringify(chat));
  }

  private chatStateSubscription(): void {
    const stateSub$ = this.store.select$<ChatState>(this.nameSpace);
    stateSub$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (state: ChatState) => {
          this.state = state;
        },
      });
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
                  if (primaryFilterChatMessageItem(chat, this.state as ChatState)) {
                    chat.streamId = this.streamId;
                    chat.timestamp = new Date().getTime();
                    chat.prefix = this.prefix || this.streamId;
                    this.broadcastNewChatMessage(data.host, chat);
                    // console.log(JSON.stringify(chat, null, 4));
                  }
                  break;
                }
                case 'twitch': {
                  const chat = parseTwitchChat(data);
                  if (primaryFilterChatMessageItem(chat, this.state as ChatState)) {
                    chat.streamId = this.streamId;
                    chat.timestamp = new Date().getTime();
                    chat.prefix = this.prefix || this.streamId;
                    this.broadcastNewChatMessage(data.host, chat);
                    // console.log(JSON.stringify(chat, null, 4));
                  }
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

    this.windowObj.parent.postMessage(data, '*');
  }

  private setNorthBoundSelector(host: ChatMessageHosts) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.observe,
      payload: ChatSupportedSites[host].observer,
    };

    this.windowObj.parent.postMessage(data, '*');
  }

  private setNorthBoundIframe(host: ChatMessageHosts) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.iframe,
      payload: ChatSupportedSites[host].iframe,
    };

    this.windowObj.parent.postMessage(data, '*');
    setTimeout(() => {
      this.setNorthBoundSelector(host);
    }, 1000);
  }

  broadcastNewChatOverlayRequest() {
    const key = CHAT_STORAGE_OVERLAY_REQUEST_KEY;
    this.broadcastMessage(key, JSON.stringify({ from: 'iframe' }));
    this.awaitOverlayResponse = setTimeout(() => {
      openOverlayWindowScreen(this.windowObj);
      this.awaitOverlayResponse = undefined;
    }, 1000);
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          if (event.key === CHAT_STORAGE_OVERLAY_RESPONSE_KEY) {
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
