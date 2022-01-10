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

import {
  CHAT_BACKGROUND_COLOR_DEFAULT_VALUE,
  CHAT_STORAGE_MANAGER_IFRAME_REQUEST_KEY,
} from '../chat.default';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-manager',
  templateUrl: './chat-manager.component.html',
  styleUrls: ['./chat-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatManagerAdminComponent implements OnInit, OnDestroy {
  @ViewChild('scrollableList', { static: true }) scrollableList: ElementRef;
  private onStorageOb$: Observable<Event>;
  private destroy$ = new Subject<boolean>();
  leftPosition = '0';
  rightPosition = 'unset';
  backgroundColor = CHAT_BACKGROUND_COLOR_DEFAULT_VALUE;

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
    this.subStorage();
    this.subState();
    this.subBackgroundColor();
    this.subScrollEvent();
    this.addAttrStyles();
    this.chatService.broadcastNewChatManagerResponse();
    this.logger.info('ChatManagerAdminComponent: Initialized');
  }

  private subStorage() {
    this.zone.runOutsideAngular(() => {
      this.onStorageOb$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: StorageEvent) => {
          if (event.key === CHAT_STORAGE_MANAGER_IFRAME_REQUEST_KEY) {
            // we have received a request to open the chat manager
            // we may not be in focus, so let's close this window
            // a new one will be spawned (workaround for .focus() not working)
            this.chatService.layout.uix.closeWindow();
          }
        },
      });
    });
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

          this.backgroundColor = state.backgroundColor;
          this.cdR.markForCheck();
        },
      });
  }

  // live background color change
  private subBackgroundColor(): void {
    this.chatService.chatBackgroundColor$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        this.backgroundColor = value;
        this.cdR.markForCheck();
      },
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
          if (isScrolling && this.chatService.state.autoScrollMode) {
            this.chatService.setState({ autoScrollMode: false });
          } else if (!isScrolling && !this.chatService.state.autoScrollMode) {
            this.chatService.setState({ autoScrollMode: true });
          }
        },
      });
  }

  addAttrStyles(): void {
    this.chatService.uix.addClassToBody('chat-manager');
    const drawerEl = this.chatService.uix.window.document.querySelector('.mat-drawer-content');
    // set hidden overflow on drawer
    this.chatService.uix.addClass(drawerEl as HTMLElement, 'no-scroll');
  }

  removeAttrStyles(): void {
    this.chatService.uix.removeClassFromBody('chat-manager');
    const drawerEl = this.chatService.uix.window.document.querySelector('.mat-drawer-content');
    // unset hidden overflow on drawer
    this.chatService.uix.removeClass(drawerEl as HTMLElement, 'no-scroll');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.removeAttrStyles();
  }
}
