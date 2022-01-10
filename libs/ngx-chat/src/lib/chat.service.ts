/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { tryGet } from '@fullerstack/agx-util';
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
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith, pick as ldPick } from 'lodash-es';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import {
  CHAT_BACKGROUND_COLOR_DEFAULT_VALUE,
  CHAT_DASHBOARD_DEFAULT_HEIGHT,
  CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET,
  CHAT_DASHBOARD_DEFAULT_WIDTH,
  CHAT_HORIZONTAL_POSITION_MID_LEVEL_DEFAULT_VALUE,
  CHAT_IFRAME_URL,
  CHAT_STORAGE_BROADCAST_KEY_PREFIX,
  CHAT_STORAGE_MANAGER_ADMIN_RESPONSE_KEY,
  CHAT_STORAGE_STATE_KEY,
  CHAT_URL_FULLSCREEN_LIST,
  CHAT_VERTICAL_POSITION_MID_LEVEL_DEFAULT_VALUE,
  defaultChatConfig,
  defaultChatState,
  defaultHostColor,
} from './chat.default';
import { ChatMessageItem, ChatState } from './chat.model';
import { chatDatabaseInstance } from './util/chat.db';
import { searchByKeywords, searchByPrimaryFilter, storageBroadcast } from './util/chat.util';

@Injectable()
export class ChatService implements OnDestroy {
  private nameSpace = 'CHAT';
  private claimId: string;
  private destroy$ = new Subject<boolean>();

  // host color
  hostColor = defaultHostColor();

  // environment, options
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  // database object
  database = chatDatabaseInstance;
  chatList$: Observable<ChatMessageItem[]>;

  // chat state
  state: DeepReadonly<ChatState> = defaultChatState();
  state$: Observable<ChatState>;

  // selected chat
  private chatSelectedOb$ = new Subject<ChatMessageItem>();
  chatSelected$ = this.chatSelectedOb$.asObservable();

  // fireworks play
  isFireworksPlaying = false;
  private fireworksPlayingOb$ = new Subject<boolean>();
  fireworksPlaying$ = this.fireworksPlayingOb$.asObservable();

  // audio play
  isAudioPlaying = false;
  private audioPlayingOb$ = new Subject<boolean>();
  audioPlaying$ = this.audioPlayingOb$.asObservable();

  // chat vertical position
  chatVerticalPosition = CHAT_VERTICAL_POSITION_MID_LEVEL_DEFAULT_VALUE;
  private chatVerticalPositionOb$ = new BehaviorSubject<number>(
    CHAT_VERTICAL_POSITION_MID_LEVEL_DEFAULT_VALUE
  );
  chatVerticalPosition$ = this.chatVerticalPositionOb$.asObservable();

  // chat horizontal position
  chatHorizontalPosition = CHAT_HORIZONTAL_POSITION_MID_LEVEL_DEFAULT_VALUE;
  private chatHorizontalPositionOb$ = new BehaviorSubject<number>(
    CHAT_HORIZONTAL_POSITION_MID_LEVEL_DEFAULT_VALUE
  );
  chatHorizontalPosition$ = this.chatHorizontalPositionOb$.asObservable();

  // chat background color
  chatBackgroundColor = CHAT_BACKGROUND_COLOR_DEFAULT_VALUE;
  private chatBackgroundColorOb$ = new BehaviorSubject<string>(CHAT_BACKGROUND_COLOR_DEFAULT_VALUE);
  chatBackgroundColor$ = this.chatBackgroundColorOb$.asObservable();

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

    this.subToTables();
    this.centerNewChatDashboard();

    this.logger.info(`[${this.nameSpace}] ChatService ready ...`);
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
    return signObject(sanitized);
  }

  /**
   * Initialize Layout state, flatten state, remove any array and object values
   */
  private initState() {
    const storageState = this.uix.localStorage.getItem(CHAT_STORAGE_STATE_KEY);
    const state = { ...this.state, ...this.sanitizeState(storageState) };
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

          // set chat positions
          this.setChatVerticalPosition(this.state.chatVerticalPosition);
          this.setChatHorizontalPosition(this.state.chatHorizontalPosition);
          this.setChatBackgroundColor(this.state.backgroundColor);

          // set audio/fireworks playing status
          if (!this.state.audioEnabled) {
            this.setAudioPlayStatus(false);
          }
          if (!this.state.fireworksEnabled) {
            this.setFireworksPlayStatus(false);
          }

          // store state in local storage
          if (!this.isRunningInIframeContext) {
            const localStorageStateSnapshot = this.uix.localStorage.getItem(CHAT_STORAGE_STATE_KEY);
            if (!localStorageStateSnapshot) {
              const stringifiedState = JSON.stringify(this.state as ChatState);
              this.uix.localStorage.setItem(CHAT_STORAGE_STATE_KEY, stringifiedState);
            } else {
              const localStorageState = this.sanitizeState(localStorageStateSnapshot);
              if (localStorageState.signature !== this.state.signature) {
                const stringifiedState = JSON.stringify(this.state as ChatState);
                this.uix.localStorage.setItem(CHAT_STORAGE_STATE_KEY, stringifiedState);
              }
            }
          }
        },
      });
  }

  setState(newState: Partial<ChatState>) {
    this.store.setState(
      this.claimId,
      signObject({
        ...this.state,
        ...newState,
        iframePaused: false,
      })
    );
  }

  private subToTables() {
    this.chatList$ = this.state$.pipe(
      filter((state) => !!state.signature),
      switchMap((state) => {
        if (state.autoScrollMode || state.fastForwardMode) {
          return this.database.chatLiveQuery(state.listFilter);
        }
        return EMPTY;
      }),
      map((chats: ChatMessageItem[]) =>
        chats?.map((chat) => tryGet(() => searchByPrimaryFilter(chat, this.state)))
      ),
      map((chats: ChatMessageItem[]) =>
        chats?.map((chat) => tryGet(() => searchByKeywords(chat, this.state)))
      ),
      map((chats: ChatMessageItem[]) => chats?.filter((chat) => chat?.id)),
      tap((chats: ChatMessageItem[]) => {
        if (chats?.length) {
          this.chatSelected(chats[0]);
        }
      })
    );
  }

  chatSelected(chat: ChatMessageItem, clicked = false) {
    if (chat?.id) {
      if (clicked || this.state.fastForwardMode) {
        this.chatSelectedOb$.next(chat);
      }
    }
  }

  clearMessage() {
    this.chatSelectedOb$.next(undefined);
  }

  broadcastNewChatManagerResponse() {
    const key = CHAT_STORAGE_MANAGER_ADMIN_RESPONSE_KEY;
    storageBroadcast(this.uix.localStorage, key, JSON.stringify({ from: 'chatManager' }));
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
    if (!!state.signature || state.signature !== this.state.signature) {
      this.setState({ ...defaultChatState(), ...state });
    }
  }

  pauseIframe(iframePaused: boolean) {
    // spacial case for iframe pause, we talk to store directly
    // everything else must go through this.setState()
    // to ensure we never fall into a paused state, unless in fullscreen transition
    this.store.setState(
      this.claimId,
      signObject({
        ...this.state,
        iframePaused,
      })
    );
  }

  private centerNewChatDashboard() {
    if (!this.isRunningInIframeContext) {
      // only center if not in iframe

      // coordinates of the chat dashboard
      const cords = this.screenResizeCords();

      console.log(cords);

      this.uix.window.resizeTo(cords.width, cords.height);

      setTimeout(() => {
        this.uix.window.moveTo(cords.left, cords.top);
      }, 500);
    }
  }

  cleanupBroadcastMessage() {
    // remove local storage message items
    Object.entries(this.uix.localStorage).forEach(([key]) => {
      if (key.startsWith(CHAT_STORAGE_BROADCAST_KEY_PREFIX)) {
        this.uix.localStorage.removeItem(key);
      }
    });
  }

  setChatVerticalPosition(value: number, saveToState = false) {
    this.chatVerticalPosition = value;
    if (saveToState) {
      this.setState({ chatVerticalPosition: value });
    }
    this.chatVerticalPositionOb$.next(value);
  }

  setChatHorizontalPosition(value: number, saveToState = false) {
    this.chatHorizontalPosition = value;
    if (saveToState) {
      this.setState({ chatHorizontalPosition: value });
    }
    this.chatHorizontalPositionOb$.next(value);
  }

  setChatBackgroundColor(value: string, saveToState = false) {
    this.chatBackgroundColor = value;
    if (saveToState) {
      this.setState({ backgroundColor: value });
    }
    this.chatBackgroundColorOb$.next(value);
  }

  setFireworksPlayStatus(play?: boolean) {
    if (play === undefined) {
      this.isFireworksPlaying = !this.isFireworksPlaying;
    } else {
      this.isFireworksPlaying = play;
    }
    this.fireworksPlayingOb$.next(this.isFireworksPlaying);
  }

  setAudioPlayStatus(play?: boolean) {
    if (play === undefined) {
      this.isAudioPlaying = !this.isAudioPlaying;
    } else {
      this.isAudioPlaying = play;
    }
    this.audioPlayingOb$.next(this.isAudioPlaying);
  }

  // this returns the proper cords for the dashboard, we running in its context
  // used to resize and move the dashboard
  screenResizeCords() {
    // coordinates of the chat dashboard
    let top = 0;
    let left = 0;

    // we take all the width up to the default chat width
    let width = CHAT_DASHBOARD_DEFAULT_WIDTH;
    if (this.uix.window.screen.availWidth <= CHAT_DASHBOARD_DEFAULT_WIDTH) {
      width = this.uix.window.screen.availWidth;
    } else {
      left = this.uix.window.screen.availWidth / 2 - this.uix.window.top.outerWidth / 2;
    }

    // we take all the height up to the default chat height minus the header (offset)
    let height = CHAT_DASHBOARD_DEFAULT_HEIGHT;
    if (this.uix.window.screen.availHeight <= CHAT_DASHBOARD_DEFAULT_HEIGHT) {
      height = this.uix.window.screen.availHeight - CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET;
      top = CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET * 2;
    } else {
      top =
        this.uix.window.top.screen.availHeight / 2 -
        this.uix.window.top.outerHeight / 2 +
        CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET;
    }

    return {
      width,
      height,
      top,
      left,
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.cleanupBroadcastMessage();
  }
}
