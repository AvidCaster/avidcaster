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

import { CHAT_STORAGE_KEY, CHAT_URL_FULLSCREEN_LIST, ChatSupportedSites } from './chat.default';
import {
  ChatMessage,
  ChatMessageDirection,
  ChatMessageDownstreamAction,
  ChatMessageEvent,
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
  currentHost: string;
  streamId: string;
  prefix: string;
  buffer = 200;
  bufferOffset = 50;

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
              this.streamId = data.streamId;
              this.setNorthBoundIframe(this.currentHost);
              break;
            case ChatMessageDownstreamAction.chat:
              switch (data.host) {
                case 'youtube': {
                  const chat = parseYouTubeChat(data);
                  chat.streamId = this.streamId;
                  chat.timestamp = new Date().getTime();
                  chat.prefix = this.prefix || this.streamId;
                  this.broadcastChatMessage(data.host, chat);
                  // console.log(JSON.stringify(chat, null, 4));
                  break;
                }
                case 'twitch': {
                  const chat = parseTwitchChat(data);
                  chat.streamId = this.streamId;
                  chat.timestamp = new Date().getTime();
                  chat.prefix = this.prefix || this.streamId;
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

  private handleMessageBuffer() {
    const chatList = this.chatListOb$.value;
    if (chatList.length > this.buffer + this.bufferOffset) {
      this.chatListOb$.next(chatList.slice(0, this.buffer));
    }
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
            this.chatListOb$.value.length > 30
              ? console.log(JSON.stringify(this.chatListOb$.value, null, 4))
              : null;
          }
        },
        false
      );
    });
  }
}
