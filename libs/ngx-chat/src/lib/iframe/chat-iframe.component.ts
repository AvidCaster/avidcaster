/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Subject, takeUntil } from 'rxjs';

import { ChatService } from '../chat.service';
import { ChatIframeService } from './chat-iframe.service';

@Component({
  selector: 'fullerstack-chat-iframe',
  templateUrl: './chat-iframe.component.html',
  styleUrls: ['./chat-iframe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChatIframeService],
})
export class ChatIframeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  overlayOpenRequestInProgress = false;

  constructor(
    readonly cdRef: ChangeDetectorRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService,
    readonly chatIframeService: ChatIframeService
  ) {}

  ngOnInit(): void {
    this.hostReadySubscription();
    this.overlayReadySubscription();
    this.logger.info('Chat monitoring started!');
  }

  hostReadySubscription() {
    this.chatIframeService.hostReady$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.logger.info('Host ready!');
        this.cdRef.detectChanges();
      },
    });
  }

  overlayReadySubscription() {
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
    this.chatIframeService.broadcastNewChatOverlayRequest();
  }

  homeUrl(url: string) {
    const baseUrl = this.chatService.layout.uix.window?.location?.origin;
    return `${baseUrl}${url}`;
  }

  showStreamId() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
