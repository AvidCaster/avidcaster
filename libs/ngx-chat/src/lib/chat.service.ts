/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { sanitizeJsonStringOrObject, signObject } from '@fullerstack/ngx-shared';
import { StoreService } from '@fullerstack/ngx-store';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith, pick as ldPick } from 'lodash-es';
import { BehaviorSubject, Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import {
  CHAT_IFRAME_URL,
  CHAT_MESSAGE_BUFFER_SIZE,
  CHAT_STATE_STORAGE_KEY,
  CHAT_STORAGE_KEY,
  CHAT_STORAGE_KEY_OVERLAY_RESPONSE,
  CHAT_URL_FULLSCREEN_LIST,
  defaultChatConfig,
  defaultChatState,
  defaultChatTest,
} from './chat.default';
import { ChatMessageHostReady, ChatMessageItem, ChatState } from './chat.model';
import { filterChatMessageItem } from './util/chat.util';

@Injectable()
export class ChatService implements OnDestroy {
  private nameSpace = 'CHAT';
  private claimId: string;
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<ChatState> = defaultChatState();
  stateSub$: Observable<ChatState>;
  private destroy$ = new Subject<boolean>();
  private onStorageOb$: Observable<Event>;
  private chatBufferList: ChatMessageItem[] = [];
  private chatListOb$ = new BehaviorSubject<ChatMessageItem[]>([]);
  chatList$ = this.chatListOb$.asObservable();
  private hostReadyOb$ = new BehaviorSubject<ChatMessageHostReady>({ ready: false });
  hostReady$ = this.hostReadyOb$.asObservable();
  private chatSelectedOb$ = new Subject<ChatMessageItem>();
  chatSelected$ = this.chatSelectedOb$.asObservable();
  prefix: string;
  awaitOverlayResponse = undefined;

  constructor(
    readonly zone: NgZone,
    readonly router: Router,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly layout: LayoutService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ chat: defaultChatConfig() }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.claimSlice();
    this.subState();
    this.initState();

    this.onStorageOb$ = fromEvent(this.layout.uix.window, 'storage');

    this.storageSubscription();

    this.layout.registerHeadlessPath(CHAT_URL_FULLSCREEN_LIST);
    this.logger.info(`[${this.nameSpace}] ChatService ready ...`);
  }

  /**
   * Claim Auth state:slice
   */
  private claimSlice() {
    if (!this.options?.layout?.logState) {
      this.claimId = this.store.claimSlice(this.nameSpace);
    } else {
      this.claimId = this.store.claimSlice(this.nameSpace, this.logger.debug.bind(this.logger));
    }
  }

  /**
   * Sanitize state
   * @param state state object or stringify json
   * @returns state object
   */
  private sanitizeState(state: ChatState | string): ChatState {
    let sanitized = sanitizeJsonStringOrObject<ChatState>(state);
    if (sanitized) {
      const validKeys = Object.keys(defaultChatState());
      sanitized = ldPick(sanitized, validKeys) as ChatState;
    }
    sanitized = ldMergeWith(defaultChatState(), sanitized, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );
    return sanitized;
  }

  /**
   * Initialize Layout state, flatten state, remove any array and object values
   */
  private initState() {
    const storageState = localStorage.getItem(CHAT_STATE_STORAGE_KEY);
    const state = this.sanitizeState(storageState);
    this.store.setState(this.claimId, {
      ...state,
      appName: this.options.appName,
      eraser: false,
    });
  }

  /**
   * Subscribe to Layout state changes
   */
  private subState() {
    this.stateSub$ = this.store.select$<ChatState>(this.nameSpace);

    this.stateSub$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (newState) => {
          this.state = { ...defaultChatState(), ...newState };
          this.chatListOb$.next(this.filterChatList());
          if (!this.router.url.includes(CHAT_IFRAME_URL)) {
            localStorage.setItem(CHAT_STATE_STORAGE_KEY, JSON.stringify(signObject(this.state)));
          }
        },
      });
  }

  setState(newState: Partial<ChatState>) {
    this.store.setState(this.claimId, {
      ...this.state,
      ...newState,
    });
  }

  chatSelected(chat: ChatMessageItem) {
    this.chatSelectedOb$.next(chat);
  }

  loadTestChat() {
    this.chatSelectedOb$.next(defaultChatTest());
  }

  clearMessage() {
    this.chatSelectedOb$.next(undefined);
  }

  broadcastNewChatOverlayResponse() {
    const key = CHAT_STORAGE_KEY_OVERLAY_RESPONSE;
    localStorage.setItem(key, JSON.stringify({ from: 'overlay' }));
    setTimeout(() => localStorage.removeItem(key), 0);
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          if (event.key === CHAT_STATE_STORAGE_KEY) {
            this.handleNewStateEvent(event);
          } else if (event.key.startsWith(CHAT_STORAGE_KEY) && event?.newValue) {
            this.handleNewMessageFromIframe(event);
          }
        },
      });
    });
  }

  // keep the last x messages as per buffer size
  private handleMessageBuffer(chat: ChatMessageItem) {
    this.chatBufferList.unshift(chat);
    if (this.chatBufferList.length > CHAT_MESSAGE_BUFFER_SIZE) {
      this.chatBufferList.length = CHAT_MESSAGE_BUFFER_SIZE;
    }
  }

  private handleNewStateEvent(event: StorageEvent) {
    const storageState = sanitizeJsonStringOrObject<ChatState>(event?.newValue);
    const state = this.sanitizeState(storageState);
    if (state.signature !== this.state.signature) {
      this.setState({ ...defaultChatState(), ...state });
    }
  }

  private handleNewMessageFromIframe(event: StorageEvent) {
    const chat = JSON.parse(event?.newValue);
    this.handleMessageBuffer(chat);

    let filteredList = this.chatListOb$.getValue();
    const filteredChat = filterChatMessageItem(chat, this.state as ChatState);
    if (filteredChat) {
      filteredList = [...filteredList, filteredChat];
    }

    this.zone.run(() => {
      if (filteredList?.length && this.state.autoScrollEnabled) {
        this.chatListOb$.next(filteredList);
        if (this.state.ffEnabled) {
          this.chatSelected(filteredList[filteredList.length - 1]);
        }
      }
    });
  }

  private filterChatList(): ChatMessageItem[] {
    const chatList = this.chatBufferList
      ?.map((chat) => filterChatMessageItem(chat, this.state as ChatState))
      .filter((chat) => !!chat);

    return chatList;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    // remove local storage message items
    Object.entries(localStorage).map(([key]) => {
      if (key.startsWith(CHAT_STORAGE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  }
}
