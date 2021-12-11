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
import {
  cloneDeep as ldDeepClone,
  isEqual as ldIsEqual,
  mergeWith as ldMergeWith,
  pick as ldPick,
} from 'lodash-es';
import { BehaviorSubject, Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import {
  CHAT_IFRAME_URL,
  CHAT_MESSAGE_BUFFER_SIZE,
  CHAT_STORAGE_BROADCAST_KEY_PREFIX,
  CHAT_STORAGE_MESSAGE_KEY,
  CHAT_STORAGE_OVERLAY_RESPONSE_KEY,
  CHAT_STORAGE_STATE_KEY,
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
  private chatSelectedOb$ = new Subject<ChatMessageItem>();
  chatSelected$ = this.chatSelectedOb$.asObservable();
  prefix: string;
  windowObj: Window;

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

    this.windowObj = this.layout.uix.window;

    this.claimSlice();
    this.subState();
    this.initState();

    this.cleanupBroadcastMessage();

    this.onStorageOb$ = fromEvent(this.layout.uix.window, 'storage').pipe(
      filter((event: StorageEvent) => !!event?.newValue)
    );

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
    const storageState = this.windowObj.localStorage.getItem(CHAT_STORAGE_STATE_KEY);
    const state = this.sanitizeState(storageState);
    this.store.setState(this.claimId, state);
  }

  get isRunningInIframeContext(): boolean {
    return this.router.url.includes(CHAT_IFRAME_URL);
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

          if (!this.isRunningInIframeContext) {
            const currentStateInStorage = this.sanitizeState(
              this.windowObj.localStorage.getItem(CHAT_STORAGE_STATE_KEY)
            );

            const hasStateChanged = !ldIsEqual(currentStateInStorage, newState);
            if (hasStateChanged) {
              this.windowObj.localStorage.setItem(
                CHAT_STORAGE_STATE_KEY,
                JSON.stringify(signObject(this.state))
              );
            }
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

  broadcastMessage(key: string, value: string) {
    this.windowObj.localStorage.setItem(key, value);
    this.windowObj.localStorage.removeItem(key);
  }

  broadcastNewChatOverlayResponse() {
    const key = CHAT_STORAGE_OVERLAY_RESPONSE_KEY;
    this.broadcastMessage(key, JSON.stringify({ from: 'overlay' }));
  }

  private storageSubscription() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          const isChatState = event.key === CHAT_STORAGE_STATE_KEY;
          if (isChatState) {
            return this.handleNewStateEvent(event);
          }

          const isMessageBroadcast = event.key.startsWith(CHAT_STORAGE_MESSAGE_KEY);
          if (isMessageBroadcast) {
            return this.handleNewMessageFromIframe(event);
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

    let currentChatList = this.chatListOb$.getValue();
    const filteredChat = filterChatMessageItem(chat, this.state as ChatState);
    if (filteredChat) {
      currentChatList = [...currentChatList, filteredChat];
    }

    const shouldEmitListUpdateEvent = currentChatList?.length && this.state.autoScrollEnabled;
    if (shouldEmitListUpdateEvent) {
      this.zone.run(() => this.chatListOb$.next(currentChatList));

      const shouldEmitSelectedChatEvent = this.state.ffEnabled;
      if (shouldEmitSelectedChatEvent) {
        this.chatSelected(currentChatList[currentChatList.length - 1]);
      }
    }
  }

  private filterChatList(): ChatMessageItem[] {
    const chatList = this.chatBufferList
      ?.map((chat) => filterChatMessageItem(chat, this.state as ChatState))
      .filter((chat) => !!chat);

    return chatList;
  }

  cleanupBroadcastMessage() {
    // remove local storage message items
    Object.entries(this.windowObj.localStorage).map(([key]) => {
      if (key.startsWith(CHAT_STORAGE_BROADCAST_KEY_PREFIX)) {
        this.windowObj.localStorage.removeItem(key);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.cleanupBroadcastMessage();
  }
}
