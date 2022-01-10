/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { SystemService } from '@fullerstack/ngx-system';
import { Subject, takeUntil } from 'rxjs';

import { CHAT_MANAGER_ADMIN_URL } from '../chat.default';
import { ChatService } from '../chat.service';
import { ChatIframeService } from './chat-iframe.service';

@Component({
  selector: 'fullerstack-chat-iframe',
  templateUrl: './chat-iframe.component.html',
  styleUrls: ['./chat-iframe.component.scss'],
  providers: [ChatIframeService],
})
export class ChatIframeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  overlayOpenRequestInProgress = false;
  overlayPath = CHAT_MANAGER_ADMIN_URL;

  constructor(
    readonly cdRef: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly system: SystemService,
    readonly chatService: ChatService,
    readonly chatIframeService: ChatIframeService
  ) {}

  ngOnInit(): void {
    this.subHostReady();
    this.subOverlayReady();
    this.logger.debug('Chat monitoring started!');
  }

  subHostReady() {
    this.chatIframeService.hostReady$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.logger.info('Host ready!');
        this.cdRef.detectChanges();
      },
    });
  }

  subOverlayReady() {
    this.chatIframeService.overlayReady$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.overlayOpenRequestInProgress = false;
        this.logger.info('Overlay ready!');
        this.cdRef.detectChanges();
      },
    });
  }

  openOverlay() {
    this.overlayOpenRequestInProgress = true;
    this.chatIframeService.broadcastOverlayRequest();
  }

  homeUrl(url: string) {
    const baseUrl = this.chatService.layout.uix.window?.location?.origin;
    return `${baseUrl}${url}`;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
