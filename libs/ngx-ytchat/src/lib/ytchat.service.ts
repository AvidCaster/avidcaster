import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '@fullerstack/ngx-config';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { StoreService } from '@fullerstack/ngx-store';
import { SystemService } from '@fullerstack/ngx-system';
import { Subject, filter, takeUntil } from 'rxjs';

import { YTCHAT_URL } from './ytchat.model';

@Injectable({
  providedIn: 'root',
})
export class YtchatService {
  private destroy$ = new Subject<boolean>();
  private lastUrl: string;

  constructor(
    readonly router: Router,
    readonly system: SystemService,
    readonly layout: LayoutService,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly i18n: I18nService
  ) {
    this.subRouteChange();
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
