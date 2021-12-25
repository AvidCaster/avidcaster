import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Observable, Subject, distinctUntilChanged, filter, fromEvent, map, takeUntil } from 'rxjs';

import { CHAT_STORAGE_OVERLAY_REQUEST_KEY } from '../chat.default';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-overlay',
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatOverlayComponent implements OnInit, OnDestroy {
  @ViewChild('scrollableList', { static: true }) scrollableList: ElementRef;
  private onStorageOb$: Observable<Event>;
  private destroy$ = new Subject<boolean>();
  leftPosition = '0';
  rightPosition = 'unset';

  constructor(
    readonly zone: NgZone,
    readonly cdR: ChangeDetectorRef,
    readonly elR: ElementRef,
    readonly logger: LoggerService,
    readonly chatService: ChatService
  ) {
    this.onStorageOb$ = fromEvent(this.chatService.layout.uix.window, 'storage').pipe(
      filter((event: StorageEvent) => !!event.newValue)
    );
  }

  ngOnInit(): void {
    console.log('ChatOverlayComponent.ngOnInit');
    this.subStorage();
    this.subSelectedChat();
    this.subState();
    this.subScrollEvent();
    this.addAttrStyles();
  }

  private subState(): void {
    this.chatService.state$
      .pipe(
        filter((state) => !!state),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (state) => {
          if (state.isLtR) {
            this.leftPosition = '0';
            this.rightPosition = 'unset';
          } else {
            this.leftPosition = 'unset';
            this.rightPosition = '0';
          }

          this.cdR.markForCheck();
        },
      });
  }

  private subSelectedChat(): void {
    this.chatService.chatSelected$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cdR.markForCheck();
      },
    });
  }

  private subStorage() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          if (event.key === CHAT_STORAGE_OVERLAY_REQUEST_KEY) {
            this.chatService.broadcastNewChatOverlayResponse();
            this.chatService.layout.uix.window.focus();
            this.logger.info('ChatOverlayComponent: Overlay Response Sent; Grabbing Focus!');
          }
        },
      });
    });
  }

  private subScrollEvent(): void {
    fromEvent(this.scrollableList.nativeElement, 'scroll')
      .pipe(
        map(() => this.scrollableList.nativeElement.scrollTop > 0),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          const isScrolling = this.scrollableList.nativeElement.scrollTop > 0;
          if (isScrolling && this.chatService.state.autoScrollEnabled) {
            this.chatService.setState({ autoScrollEnabled: false });
          } else if (!isScrolling && !this.chatService.state.autoScrollEnabled) {
            this.chatService.setState({ autoScrollEnabled: true });
          }
        },
      });
  }

  addAttrStyles(): void {
    this.chatService.uix.addClassToBody('chat-overlay');
  }

  removeAttrStyles(): void {
    this.chatService.uix.removeClassFromBody('chat-overlay');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.removeAttrStyles();
  }
}
