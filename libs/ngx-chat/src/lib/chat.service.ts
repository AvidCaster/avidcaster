/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, NgZone } from '@angular/core';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { BehaviorSubject, Observable, Subject, fromEvent, takeUntil } from 'rxjs';
import { v4 as uuid_v4 } from 'uuid';

import {
  CHAT_STORAGE_KEY,
  CHAT_STORAGE_KEY_OVERLAY_REQUEST,
  CHAT_STORAGE_KEY_OVERLAY_RESPONSE,
  CHAT_URL_FULLSCREEN_LIST,
  ChatSupportedSites,
} from './chat.default';
import {
  ChatMessage,
  ChatMessageDirection,
  ChatMessageDownstreamAction,
  ChatMessageEvent,
  ChatMessageHostReady,
  ChatMessageHosts,
  ChatMessageItem,
  ChatMessageUpstreamAction,
} from './chat.model';
import { parseTwitchChat } from './util/chat.util.twitch';
import { parseYouTubeChat } from './util/chat.util.youtube';

@Injectable()
export class ChatService {
  private destroy$ = new Subject<boolean>();
  private onMessageOb$: Observable<Event>;
  private chatListOb$ = new BehaviorSubject<ChatMessageItem[]>([]);
  chatList$ = this.chatListOb$.asObservable();
  private hostReadyOb$ = new BehaviorSubject<ChatMessageHostReady>({ ready: false });
  hostReady$ = this.hostReadyOb$.asObservable();
  private chatSelectedOb$ = new Subject<ChatMessageItem>();
  chatSelected$ = this.chatSelectedOb$.asObservable();
  currentHost: ChatMessageHosts;
  streamId: string;
  prefix: string;
  buffer = 200;
  bufferOffset = 50;
  awaitOverlayResponse = undefined;

  constructor(
    readonly zone: NgZone,
    readonly logger: LoggerService,
    readonly layout: LayoutService
  ) {
    this.onMessageOb$ = fromEvent(window, 'message');
    this.southBoundSubscription();
    this.setNorthBoundReadyPing();
    this.storageSubscription();
    this.layout.registerHeadlessPath(CHAT_URL_FULLSCREEN_LIST);
  }

  chatSelected(chat: ChatMessageItem) {
    this.chatSelectedOb$.next(chat);
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
              this.setNorthBoundObserverReady();
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

  private setNorthBoundObserverReady() {
    this.hostReadyOb$.next({ host: this.currentHost, ready: true });
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

  private handleMessageBuffer() {
    const chatList = this.chatListOb$.value;
    if (chatList.length > this.buffer + this.bufferOffset) {
      this.chatListOb$.next(chatList.slice(0, this.buffer));
    }
  }

  broadcastNewChatOverlayRequest() {
    const key = CHAT_STORAGE_KEY_OVERLAY_REQUEST;
    localStorage.setItem(key, JSON.stringify({ from: 'iframe' }));
    setTimeout(() => localStorage.removeItem(key), 0);
    this.awaitOverlayResponse = setTimeout(() => {
      this.openOverlayScreen();
      this.awaitOverlayResponse = undefined;
    }, 4000);
  }

  broadcastNewChatOverlayResponse() {
    const key = CHAT_STORAGE_KEY_OVERLAY_RESPONSE;
    localStorage.setItem(key, JSON.stringify({ from: 'overlay' }));
    setTimeout(() => localStorage.removeItem(key), 0);
  }

  openOverlayScreen() {
    this.layout.uix.window.open(
      '/chat/overlay/screen',
      '_blank',
      'width=1200,height=720,left=100,top=100'
    );
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      addEventListener(
        'storage',
        (event) => {
          if (event.key.startsWith(CHAT_STORAGE_KEY) && event?.newValue) {
            const chat = JSON.parse(event.newValue);
            setTimeout(() => localStorage.removeItem(event.key), 0);
            this.handleMessageBuffer();
            this.chatListOb$.next([...this.chatListOb$.value, chat]);
            // this.chatListOb$.value.length > 30
            //   ? console.log(JSON.stringify(this.chatListOb$.value, null, 4))
            //   : null;
          } else if (event.key === CHAT_STORAGE_KEY_OVERLAY_RESPONSE) {
            // no one is listening, we can safely open the overlay screen
            this.logger.info('Overlay response received');
            clearTimeout(this.awaitOverlayResponse);
            this.awaitOverlayResponse = undefined;
          }
        },
        false
      );
    });
  }
}
