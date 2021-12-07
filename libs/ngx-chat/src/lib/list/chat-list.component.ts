import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<boolean>();
  autoScrollEnabled = true;

  constructor(
    readonly chRef: ChangeDetectorRef,
    private elRef: ElementRef,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    console.log('ChatListComponent.ngOnInit()');
    this.updateChatList();
  }

  updateChatList(): void {
    this.chatService.chatList$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: () => {
        this.scrollToBottom();
        this.chRef.detectChanges();
      },
    });
  }

  itemClicked($event): void {
    console.log('ChatListComponent.itemClicked()', $event.target.addClass('chat-viewed'));
  }

  scrollToBottom(auto = true): void {
    if (auto) {
      this.disableAutoScroll();
    }
    this.elRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });

    if (auto) {
      this.enableAutoScroll();
    }
  }

  manualScroll(event): void {
    this.autoScrollEnabled =
      event.target.scrollTop + event.target.clientHeight < event.target.scrollHeight - 30;
    console.log(
      'ChatListComponent.handleScroll()',
      event.target.scrollTop,
      event.target.clientHeight,
      event.target.scrollHeight
    );
  }

  enableAutoScroll(): void {
    this.autoScrollEnabled = true;
  }

  disableAutoScroll(): void {
    this.autoScrollEnabled = false;
  }

  toggleAutoScroll(): void {
    this.autoScrollEnabled = !this.autoScrollEnabled;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get getSomeList() {
    return [
      {
        author: 'Zangari RC',
        message: 'Christian Taliban',
        html: 'Christian Taliban',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRQXuuJJ6pe_8bAmNn6mUPWiwpo5-uDD43KKj4_YQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295544,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Hasselnøtt Per',
        message: 'BASED',
        html: 'BASED☦✝',
        avatarUrl:
          'https://yt4.ggpht.com/VYYZkwCB7UIjpMovwsSuOIHoChpisfbsuBQObl4JneftSr4vojzgJAo6IEtGNxxPuJMAxaVs=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295546,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Tarik',
        message: 'GYAD',
        html: 'GYAD',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLSlmb2CM5SNYvN3sXsOX5dOyiZzUisZBYtN_Q=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295547,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Frankie',
        message: 'BASED',
        html: 'BASED',
        avatarUrl:
          'https://yt4.ggpht.com/2YdXyoCr1xtaPzBeE0iWKdJZwmZlI30JMKwzT1joSCTDV_TBxnSnvMiFX2HvkUZmno3Ze2MoVw=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295548,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'maplebob23',
        message: 'Amen!',
        html: 'Amen!',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLS39Hu-RJHbsWdYQnpclyd6dtnufCFu55X8MAHF=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295549,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'rejat singh',
        message: 'groyper',
        html: 'groyper',
        avatarUrl:
          'https://yt4.ggpht.com/45QHqZq0pyBVR46a0b6YR550mM5GlpyTYTWCCdCARKA2Hswv-ZFI02BeDkWZHdM5HN-iqy02IO8=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295550,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'lifetodamax',
        message: 'eat. laugh. pray',
        html: 'eat. laugh. pray',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLQQN0qDopJPT1G8QVcaufLrsRTdeq7fFXGawg=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295550,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Mark E.',
        message: 'amen, good kid',
        html: 'amen, good kid',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRPIgUzKhd3xHRdiScpyuDcZjc-eyQZKxvHBw=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295550,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Broken Prophet',
        message: 'Kyle Getsomehouse',
        html: 'Kyle Getsomehouse',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLTW7UsxSvXW4vqWnzzQCJvXjfi13nCChEQULD5R-A=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295551,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Semper Fidelis',
        message: 'Amen',
        html: 'Amen',
        avatarUrl:
          'https://yt4.ggpht.com/rdtyX1a1stsIoeDerqFwvu4oa652eShfSb00wdXiosOf_vWlh080qxvmvXQXWoqvRA6aPE4hUQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295552,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'jose murillo',
        message: 'We love you Kyle! God bless you!',
        html: 'We love you Kyle! God bless you!',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLSd9z2XFOmnTuxXFHGvjlZXf-CTQfxDhlTDn_Ot=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295552,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Mythra',
        message:
          'Thank you Elijah for having Nick Fuentes on your show! America First is inevitable! 🇺🇸',
        html: 'Thank you Elijah for having Nick Fuentes on your show! America First is inevitable! 🇺🇸☝🐸🐸🐸',
        avatarUrl:
          'https://yt4.ggpht.com/3pZm-AUfqb7G9SNXyohPjnKMN25WVtW0Ub2O5_CQ4u9mPTR_vutoP_NBut5p2TJVVzB8jYhnow=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295553,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'mmm.NowHere. calm',
        message: 'Eat Pray Love? Dork',
        html: 'Eat Pray Love? Dork',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLTrHTTtItNdRs2tP1Apd9H1bXbZoSX4ND8tAZxHoQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295553,
        prefix: '-R9woSO6y_o',
      },
      {
        author: '797ation',
        message: 'BASED',
        html: 'BASED',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLQwVwoyIoiqUkwQZqhOkXn_KYQUJU58MG2K3ZsRJA=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295554,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Bigfoottehchipmunk',
        message: "Elijah's going to corrupt this kid.",
        html: "Elijah's going to corrupt this kid.",
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLSGrQGxWq0Rx98W2GZjsUHaX2OM2LhspxxhB9hz=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295555,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'SereneRepose',
        message: '',
        html: '🙏',
        avatarUrl:
          'https://yt4.ggpht.com/uv9WDFvToVVsbBYBUn5-lQhJVX3e3eRMwqcZwEUABv6ijPKJAGl3PQ04Z0_c7dRW4Fp16Pq51Q=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295555,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Andy Nelms',
        message: 'N I C K F U E N T E S. AMERICA FIRST. G R O Y P E R S UNITE',
        html: 'N I C K F U E N T E S. AMERICA FIRST. G R O Y P E R S 🐸UNITE 🐸',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLThxN7SoQqH5LQBVbUtmm-JZJn4ZYYGhnk_frUQvWVlYI15x3Gu_ZTjQ3GS2uVT=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295557,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Miss Quinn',
        message: 'It’s not YOUR decision to try nd change Peoples perceptions of him….STAY AWAY',
        html: 'It’s not YOUR decision to try nd change Peoples perceptions of him….STAY AWAY',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLSsbVgc_AU22uECLRP3LzBzix5JXlfvlYMR2g83=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295557,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'icedragonIsLit',
        message: 'bruh',
        html: 'bruh',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLTHyDebZHazRB7EsVWxaw2Tia012smx7PlgJXOf=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295558,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Tony Nagy',
        message: '',
        html: '🙏🤣',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRlERVdmJab9MYZmcXng2SMz4QikBn8Ztz8yRYiuw=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295558,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'smallrabidmonkey',
        message: 'God has a sadistic sense of humor indeed',
        html: 'God has a sadistic sense of humor indeed',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLScYFlTbGlV5JBTwXS9ZGlw0VB-7__E-J1BOn2jqQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295558,
        prefix: '-R9woSO6y_o',
      },
    ];
  }
}
