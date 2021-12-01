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

import { defaultYTChatConfig, defaultYTChatMessage } from './ytchat.default';
import { YTCHAT_URL_FULLSCREEN, YTChatInfo } from './ytchat.model';
import { ytGetMessageInfo } from './ytchat.util';

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
              this.cleanData(event.data.payload);
              break;
            default:
              break;
          }
        }
      },
      false
    );
  }

  private cleanData(data: any) {
    let info = ytGetMessageInfo(data.chat);

    if (!info?.message && info?.donation) {
      info.message = '🎉😊🎉';
    }

    if (!info?.message && info?.membership) {
      info.message = info.membership;
    }

    if (info?.authorName.length) {
      if (info?.message) {
        this.i18n.translate
          .get(info?.message)
          .pipe(take(1), takeUntil(this.destroy$))
          .subscribe((message: string) => {
            info = {
              ...info,
              message,
              authorImage: info.authorImage || './assets/images/misc/avatar-default.png',
            };
          });
      } else {
        info = {
          ...info,
          authorImage: info.authorImage || './assets/images/misc/avatar-default.png',
        };
      }
    }

    this.chatInfoObs$.next(info);
  }

  testMessage() {
    this.chatInfoObs$.next(defaultYTChatMessage());
  }
}
