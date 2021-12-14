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
import { UixService } from '@fullerstack/ngx-uix';
import Localbase from 'localbase';
import { BehaviorSubject, Subject, filter, takeUntil, throttleTime } from 'rxjs';
import { v4 as uuid_v4 } from 'uuid';

import {
  CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE,
  CHAT_MESSAGE_LIST_BUFFER_SIZE,
  CHAT_STORAGE_OVERLAY_REQUEST_KEY,
  CHAT_STORAGE_OVERLAY_RESPONSE_KEY,
  ChatSupportedSites,
} from '../chat.default';
import {
  ChatDbCollectionType,
  ChatMessageDirection,
  ChatMessageDownstreamAction,
  ChatMessageEvent,
  ChatMessageHostReady,
  ChatMessageHosts,
  ChatMessageItem,
  ChatMessageUpstreamAction,
  ChatState,
} from '../chat.model';
import { openOverlayWindowScreen, storageBroadcast } from '../util/chat.util';
import { parseTwitchChat } from '../util/chat.util.twitch';
import { parseYouTubeChat } from '../util/chat.util.youtube';

@Injectable()
export class ChatIframeService implements OnDestroy {
  private nameSpace = 'CHAT';
  private destroy$ = new Subject<boolean>();
  private state: ChatState;
  private hostReadyOb$ = new BehaviorSubject<ChatMessageHostReady>({ ready: false });
  hostReady$ = this.hostReadyOb$.asObservable();
  private overlayReadyOb$ = new Subject<boolean>();
  overlayReady$ = this.overlayReadyOb$.asObservable();
  awaitOverlayResponseTimeoutHandler = undefined;
  dispatchedChatMessageIds: string[] = [];
  chatDb: Localbase;
  currentHost: ChatMessageHosts;
  streamId: string;
  prefix: string;

  constructor(
    readonly zone: NgZone,
    readonly router: Router,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly uix: UixService,
    readonly layout: LayoutService
  ) {
    this.initIndexedDB();

    this.subOnMessage();
    this.subOnStorage();
    this.subChatState();

    this.pingNorthBoundHost();

    this.logger.info(`[${this.nameSpace}] ChatIframeService ready ...`);
  }

  /**
   * Listen for messages from the chat state observable
   */
  private subChatState(): void {
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

  /**
   * Listen to messages on the local storage
   */
  private subOnStorage() {
    this.zone.runOutsideAngular(() => {
      this.uix.onStorage$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          if (event.key === CHAT_STORAGE_OVERLAY_RESPONSE_KEY) {
            return this.handleNewOverlayResponseEvent();
          }
        },
      });
    });
  }

  /**
   * Create an IndexedDB
   */
  private initIndexedDB() {
    this.chatDb = new Localbase(this.nameSpace);
    this.chatDb.config.debug = false;
  }

  // prune the db to keep it from growing too large
  // iframe process is responsible and since we may have multiple chats
  // we randomize the pruning to avoid all iframe processes from pruning at once
  private async pruneDb(collection: ChatDbCollectionType) {
    const doRemove = Math.random() <= 0.2;
    if (doRemove) {
      const chatIds = (await this.chatDb.collection(collection).get())
        .map((chat: ChatMessageItem) => chat.id)
        .filter((id: string) => !!id)
        .reverse();

      if (chatIds.length >= CHAT_MESSAGE_LIST_BUFFER_SIZE + CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE) {
        chatIds.slice(CHAT_MESSAGE_LIST_BUFFER_SIZE).map(async ({ id }) => {
          try {
            await this.chatDb.collection(ChatDbCollectionType.Regular).doc({ id }).delete();
          } catch (e) {
            this.logger.error(`Error pruning ${collection}`, e);
          }
        });
        this.logger.debug(
          `[${this.nameSpace}] pruneDb: ${CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE} from ${chatIds.length}`
        );
      }
    }
  }

  /**
   * Store the message in indexed db for the overlay process to retrieve
   * @param host the host of the message, e.g. twitch, youtube
   * @param chat the chat message
   */
  private async addNewChatMessageToDb(host: ChatMessageHosts, chat: ChatMessageItem) {
    chat.id = uuid_v4();
    chat.streamId = this.streamId;
    chat.timestamp = new Date().getTime();
    chat.prefix = this.prefix || this.streamId;

    let collectionKey = ChatDbCollectionType.Regular;
    if (chat.donation) {
      collectionKey = ChatDbCollectionType.Donation;
    } else if (chat.membership) {
      collectionKey = ChatDbCollectionType.Membership;
    }

    this.pruneDb(collectionKey);

    await this.chatDb.collection(collectionKey).add(chat);
    this.logger.debug(`[${this.nameSpace}] add chat: ${chat.id}`);
  }

  /**
   * Subscribes to the message event from the host, e.g. twitch, youtube
   * We receive the message out of the zone context to avoid over-rendering
   */
  private subOnMessage() {
    this.zone.runOutsideAngular(() => {
      this.uix.onMessage$
        .pipe(throttleTime(10), takeUntil(this.destroy$))
        .subscribe((event: MessageEvent) => {
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
                    if (!this.state.iframePaused) {
                      const chat = parseYouTubeChat(data);
                      this.addNewChatMessageToDb(data.host, chat);
                      // console.log(JSON.stringify(chat, null, 4));
                    }
                    break;
                  }
                  case 'twitch': {
                    if (!this.state.iframePaused) {
                      const chat = parseTwitchChat(data);
                      this.addNewChatMessageToDb(data.host, chat);
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

  /**
   * We have heard from overlay process, we get ready to process messages
   * @param host the host of the message, e.g. twitch, youtube
   */
  private setNorthBoundObserverReady(host: ChatMessageHosts) {
    this.hostReadyOb$.next({ host, ready: true });
    this.logger.info(`Observer is ready for ${this.currentHost}`);
  }

  /**
   * Ping the host to see if it is alive
   */
  private pingNorthBoundHost() {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.ping,
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  /**
   * Let the host know what to latch onto and send down to us
   * @param host the host of the message, e.g. twitch, youtube
   */
  private setNorthBoundSelector(host: ChatMessageHosts) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.observe,
      payload: ChatSupportedSites[host].observer,
    };

    this.uix.window.parent.postMessage(data, '*');
  }

  /**
   * We are running in a default iframe, appended to the "body" of the host's DOM
   * Let the host know where to attached the new copy of the iframe to, and remove the old one
   * @param host the host of the message, e.g. twitch, youtube
   */
  private setNorthBoundIframe(host: ChatMessageHosts) {
    const data = {
      type: ChatMessageDirection.NorthBound,
      action: ChatMessageUpstreamAction.iframe,
      payload: ChatSupportedSites[host].iframe,
    };

    this.uix.window.parent.postMessage(data, '*');
    setTimeout(() => {
      this.setNorthBoundSelector(host);
    }, 1000);
  }

  /**
   * Ping the overlay process to see if it is alive and ready to receive messages
   * We wait for the response to arrive within a specified amount of time
   * If we don't receive a response within that time, we assume the overlay process not there
   * If so we spawn a new overlay process (window)
   */
  broadcastOverlayRequest() {
    const key = CHAT_STORAGE_OVERLAY_REQUEST_KEY;
    storageBroadcast(this.uix.localStorage, key, JSON.stringify({ from: 'iframe' }));
    this.awaitOverlayResponseTimeoutHandler = setTimeout(() => {
      openOverlayWindowScreen(this.uix.window);
      this.awaitOverlayResponseTimeoutHandler = undefined;
      this.overlayReadyOb$.next(true);
    }, 1000);
  }

  /**
   * We have heard from the overlay process, we get ready to process messages
   */
  private handleNewOverlayResponseEvent() {
    // no one is listening, we can safely open a new overlay screen
    clearTimeout(this.awaitOverlayResponseTimeoutHandler);
    this.awaitOverlayResponseTimeoutHandler = undefined;
    this.overlayReadyOb$.next(true);
    this.logger.info('Overlay response received');
  }

  /**
   * Trigger a clean up, as we are doing our of context and we are no longer needed
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
