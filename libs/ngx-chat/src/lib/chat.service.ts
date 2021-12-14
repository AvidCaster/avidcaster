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
import { UixService } from '@fullerstack/ngx-uix';
import Localbase from 'localbase';
import {
  cloneDeep as ldDeepClone,
  isEqual as ldIsEqual,
  mergeWith as ldMergeWith,
  pick as ldPick,
} from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  Subject,
  filter,
  interval,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import {
  CHAT_IFRAME_URL,
  CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE,
  CHAT_MESSAGE_LIST_BUFFER_SIZE,
  CHAT_STORAGE_BROADCAST_KEY_PREFIX,
  CHAT_STORAGE_OVERLAY_RESPONSE_KEY,
  CHAT_STORAGE_STATE_KEY,
  CHAT_URL_FULLSCREEN_LIST,
  defaultChatConfig,
  defaultChatState,
  defaultChatTest,
} from './chat.default';
import { ChatDbCollectionType, ChatMessageItem, ChatState } from './chat.model';
import {
  filterChatMessageItem,
  getIndexedDbDocKey,
  primaryFilterChatMessageItem,
  storageBroadcast,
} from './util/chat.util';

@Injectable()
export class ChatService implements OnDestroy {
  private nameSpace = 'CHAT';
  private claimId: string;
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<ChatState> = defaultChatState();
  state$: Observable<ChatState>;
  private destroy$ = new Subject<boolean>();
  private chatBufferList: ChatMessageItem[] = [];
  private chatListOb$ = new BehaviorSubject<ChatMessageItem[]>([]);
  chatList$ = this.chatListOb$.asObservable();
  private chatSelectedOb$ = new Subject<ChatMessageItem>();
  chatSelected$ = this.chatSelectedOb$.asObservable();
  chatDb: Localbase;
  chatDbLastSize = 0;
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
    this.options = ldMergeWith(
      ldDeepClone({ chat: defaultChatConfig() }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.claimSlice();
    this.subState();
    this.initState();

    this.cleanupBroadcastMessage();

    this.storageSubscription();

    this.layout.registerHeadlessPath(CHAT_URL_FULLSCREEN_LIST);

    this.uix.onClose$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cleanupBroadcastMessage();
    });

    this.subIndexedDb();

    this.logger.info(`[${this.nameSpace}] ChatService ready ...`);
  }

  /**
   * Create an IndexedDB
   */
  private subIndexedDb() {
    this.chatDb = new Localbase(this.nameSpace);
    this.chatDb.config.debug = false;

    if (!this.isRunningInIframeContext) {
      interval(100)
        .pipe(
          switchMap(() => {
            const dbDocKey = getIndexedDbDocKey(this.state as ChatState);
            return this.chatDb.collection(dbDocKey).get();
          }),
          filter(
            (chats: ChatMessageItem[]) => chats?.length && chats?.length !== this.chatDbLastSize
          ),
          map((chats: ChatMessageItem[]) => this.pruneDb(chats)),
          map((chats: ChatMessageItem[]) => {
            return chats.map((chat) => primaryFilterChatMessageItem(chat, this.state as ChatState));
          }),
          map((chats: ChatMessageItem[]) => {
            return chats.map((chat) => filterChatMessageItem(chat, this.state as ChatState));
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (chats: ChatMessageItem[]) => {
            this.chatListOb$.next(chats);
            const shouldEmitSelectedChatEvent = this.state.ffEnabled;
            if (shouldEmitSelectedChatEvent) {
              this.chatSelected(chats[chats.length - 1]);
            }
          },
        });
    }
  }

  private pruneDb(chats: ChatMessageItem[]): ChatMessageItem[] {
    if (chats.length >= CHAT_MESSAGE_LIST_BUFFER_SIZE + CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE) {
      chats.slice(0, CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE).map(({ id }) => {
        this.chatDb.collection(ChatDbCollectionType.Regular).doc({ id }).delete();
      });
    }
    return chats.slice(-1 * CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE);
  }

  async getChatFromDb(id: string): Promise<ChatMessageItem> {
    const dbDocKey = getIndexedDbDocKey(this.state as ChatState);
    return await this.chatDb.collection(dbDocKey).doc({ id }).get();
  }

  updateChatInDb(id: string, chat: ChatMessageItem): void {
    const dbDocKey = getIndexedDbDocKey(this.state as ChatState);
    this.chatDb.collection(dbDocKey).doc({ id }).set(chat);
  }

  /**
   * Claim Auth state:slice
   */
  private claimSlice() {
    if (!this.options?.chat?.logState) {
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
    const storageState = this.uix.localStorage.getItem(CHAT_STORAGE_STATE_KEY);
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
    this.state$ = this.store.select$<ChatState>(this.nameSpace);
    this.state$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (newState) => {
          this.state = { ...defaultChatState(), ...newState };

          if (!this.isRunningInIframeContext) {
            const currentStateInStorage = this.sanitizeState(
              this.uix.localStorage.getItem(CHAT_STORAGE_STATE_KEY)
            );

            const hasStateChanged = !ldIsEqual(currentStateInStorage, newState);
            if (hasStateChanged) {
              this.uix.localStorage.setItem(
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
      iframePaused: false,
    });
  }

  chatSelected(chat: ChatMessageItem) {
    if (this.getChatFromDb(chat.id)) {
      chat.viewed = true;
      this.updateChatInDb(chat.id, chat);
    }
    this.chatSelectedOb$.next(chat);
  }

  loadTestChat() {
    this.chatSelectedOb$.next(defaultChatTest());
  }

  clearMessage() {
    this.chatSelectedOb$.next(undefined);
  }

  broadcastNewChatOverlayResponse() {
    const key = CHAT_STORAGE_OVERLAY_RESPONSE_KEY;
    storageBroadcast(this.uix.localStorage, key, JSON.stringify({ from: 'overlay' }));
  }

  private storageSubscription() {
    this.uix.onStorage$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (event: StorageEvent) => {
        const isChatState = event.key === CHAT_STORAGE_STATE_KEY;
        if (isChatState) {
          return this.handleNewStateEvent(event);
        }
      },
    });
  }

  private handleNewStateEvent(event: StorageEvent) {
    const storageState = sanitizeJsonStringOrObject<ChatState>(event?.newValue);
    const state = this.sanitizeState(storageState);
    if (state.signature !== this.state.signature) {
      this.setState({ ...defaultChatState(), ...state });
    }
  }

  pauseIframe(iframePaused: boolean) {
    // spacial case for iframe pause, we talk to store directly
    // everything else must go through this.setState()
    // to ensure we never fall into a paused state, unless in fullscreen transition
    this.store.setState(this.claimId, {
      ...this.state,
      iframePaused,
    });
  }

  cleanupBroadcastMessage() {
    // remove local storage message items
    Object.entries(this.uix.localStorage).forEach(([key]) => {
      if (key.startsWith(CHAT_STORAGE_BROADCAST_KEY_PREFIX)) {
        this.uix.localStorage.removeItem(key);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.cleanupBroadcastMessage();
  }
}
