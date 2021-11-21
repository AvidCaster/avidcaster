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
import { Subject, filter, takeUntil } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import { defaultYTChatConfig } from './ytchat.default';
import { YTCHAT_URL } from './ytchat.model';

@Injectable()
export class YTChatService {
  private nameSpace = 'CHAT';
  private claimId: string;
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private destroy$ = new Subject<boolean>();
  private lastUrl: string;

  constructor(
    readonly router: Router,
    readonly system: SystemService,
    readonly config: ConfigService,
    readonly layout: LayoutService,
    readonly store: StoreService,
    readonly logger: LoggerService,
    readonly i18n: I18nService
  ) {
    this.options = ldMergeWith(
      ldDeepClone({ layout: defaultYTChatConfig() }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.subRouteChange();
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
          if (this.router.url?.startsWith(YTCHAT_URL)) {
            this.layout.setHeadless(true);
          } else if (this.lastUrl?.startsWith(YTCHAT_URL)) {
            this.layout.setHeadless(false);
          }
          this.lastUrl = this.router.url;
        },
      });
  }
}
