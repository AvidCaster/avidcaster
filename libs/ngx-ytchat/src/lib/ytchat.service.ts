import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { StoreService } from '@fullerstack/ngx-store';
import { SystemService } from '@fullerstack/ngx-system';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';
import { BehaviorSubject, Subject, filter, take, takeUntil } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import { CHAT_STORAGE_KEY, defaultYTChatConfig, defaultYTChatMessage } from './ytchat.default';
import { YTCHAT_URL_FULLSCREEN, YTChatInfo, YTChatPayloadSouthBound } from './ytchat.model';
import { parseChat } from './ytchat.util.parse';

@Injectable()
export class YTChatService {
  private nameSpace = 'CHAT';
  private claimId: string;
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private chatInfoObs$ = new BehaviorSubject<YTChatInfo>({});
  chatInfo$ = this.chatInfoObs$.asObservable();
  private destroy$ = new Subject<boolean>();
  private lastUrl: string;

  constructor(
    readonly router: Router,
    readonly system: SystemService,
    readonly config: ConfigService,
    readonly store: StoreService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly layout: LayoutService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ layout: defaultYTChatConfig() }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.subRouteChange();
    this.southBoundMessageSubscription();
    this.storageSubscription();
    this.logger.info(`[${this.nameSpace}] ChatOverlay ready ...`);
  }

  private subRouteChange() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          if (this.router.url?.startsWith(YTCHAT_URL_FULLSCREEN)) {
            this.layout.setHeadless(true);
          } else if (this.lastUrl?.startsWith(YTCHAT_URL_FULLSCREEN)) {
            this.layout.setHeadless(false);
          }
          this.lastUrl = this.router.url;
        },
      });
  }

  private southBoundMessageSubscription() {
    this.layout.uix.window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'avidcaster-chat-south-bound') {
          switch (event.data.action) {
            case 'new-chat':
              this.cleanData(event.data.payload as YTChatPayloadSouthBound);
              break;
            default:
              break;
          }
        }
      },
      false
    );
  }

  private async cleanData(data: YTChatPayloadSouthBound) {
    const chatEl = this.layout.uix.window.document.createElement('div');
    chatEl.innerHTML = data.html;
    let info = parseChat(chatEl, data.tagName);

    if (!info?.message && info?.purchaseAmount) {
      info.message = '🎉😊🎉';
    }

    if (!info?.message && info?.messageType) {
      info.message = info.messageType;
    }

    if (info?.author.length) {
      if (info?.message) {
        this.i18n.translate
          .get(info?.message)
          .pipe(take(1), takeUntil(this.destroy$))
          .subscribe((message: string) => {
            info = {
              ...info,
              message,
              avatarUrl: info.avatarUrl || './assets/images/misc/avatar-default.png',
            };
          });
      } else {
        info = {
          ...info,
          avatarUrl: info.avatarUrl || './assets/images/misc/avatar-default.png',
        };
      }
    }
    console.log(JSON.stringify(info, null, 4));
    this.chatInfoObs$.next(info);
  }

  testMessage() {
    this.chatInfoObs$.next(defaultYTChatMessage());
  }

  private storageSubscription() {
    addEventListener(
      'storage',
      (event) => {
        if (event.key === CHAT_STORAGE_KEY) {
          const chat = JSON.parse(event.newValue);
          console.log(chat);
        }
      },
      false
    );
  }
}
