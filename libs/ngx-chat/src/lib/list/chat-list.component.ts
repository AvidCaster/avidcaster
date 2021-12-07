import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { ChatMessageItem } from '../chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'fullerstack-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroyed$ = new Subject<boolean>();
  private scrollOb$ = new BehaviorSubject<boolean>(false);
  scroll$ = this.scrollOb$.asObservable();

  constructor(
    readonly chRef: ChangeDetectorRef,
    private elRef: ElementRef,
    readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    console.log('ChatListComponent.ngOnInit()');
    this.updateChatList();
    // this.scrollToBottom();
  }

  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  updateChatList(): void {
    this.chatService.chatList$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: () => {
        this.elRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        console.log(this.elRef.nativeElement.scrollTop);
        this.chRef.detectChanges();
      },
    });
  }

  itemClicked($event): void {
    console.log('ChatListComponent.itemClicked()', $event.target.addClass('chat-viewed'));
  }

  scrollToBottom(): void {
    this.elRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  handleScroll(event): void {
    this.scrollOb$.next(
      event.target.scrollTop === event.target.scrollHeight - event.target.clientHeight
    );
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
      {
        author: 'Not A Cat',
        message: 'Good on ya Kyle. God is good! He guided your trigger finger that night.',
        html: 'Good on ya Kyle. God is good! He guided your trigger finger that night.',
        avatarUrl:
          'https://yt4.ggpht.com/6qVRvn8Xn5hdxZIXLrWlemrlJpkemNew17yrZ6FYZ26mh7beEoDNEX2LejkhI70JLW6MZvOUIA=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295559,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'T',
        message: 'Preach Kyle',
        html: 'Preach Kyle',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLTfspoBsTXelEVb_8yfAIeNvIgUr7Juvs3aKuGI4g=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295559,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Charles.god',
        message: 'amazin',
        html: 'amazin',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLS2XH9vBT9hHxLP5HJRKP4BFNVFD7yUtrl7NidoWg=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295560,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Rambo Baggins',
        message: 'N I C K',
        html: '🐸 N I C K 🐸',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLSfsIFRZfWr3Fyn2J-uHZdP9y1smkF57B181g=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295560,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Militant Roots',
        message: 'Sydney would get it',
        html: 'Sydney would get it',
        avatarUrl:
          'https://yt4.ggpht.com/lA7J3UHpMGRqm3-l3HXO8A8XDTWguSFOpez_sEEf_XemtUqsFBVBoCYaMIP_Crjth3gbGB_A=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295561,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'wymeranth',
        message: 'PRAY == LAUGH at MEMES',
        html: '🚨PRAY == LAUGH at MEMES',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLQ-_ZFFkjjdngu_jtcIdw5aZ2XS6VaaBG1lyK5h=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295561,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Adrian E',
        message: 'Def Midwest accent came out with his God',
        html: 'Def Midwest accent came out with his God',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLSGtrMRiKCULI5CASmzmXVJq9SD62meZPCt6A=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295562,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Noizemaze4',
        message:
          'ASK HIM if he knows the MEME where the JUDGE throws him the gun as he leaves the courthouse or the one where the JUDGE tells his to grab his AR-15 and go outside to defend the courthouse',
        html: 'ASK HIM if he knows the MEME where the JUDGE throws him the gun as he leaves the courthouse 😛 or the one where the JUDGE tells his to grab his AR-15 and go outside to defend the courthouse',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLTvevvW4xtCQwMvqfCnPSRuuF-SjYANrhJSWtdOPA=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295562,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Return Home',
        message: 'based',
        html: 'based',
        avatarUrl:
          'https://yt4.ggpht.com/ck2l3uagK_RKGgLRH5P0xWJrzD_W6Lxpo7XgXbtrtgnHPNiviOHIdfM7fl0p7kvobBoc_AFcfQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295562,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Scott H',
        message: 'ALL HAIL KYLE',
        html: 'ALL HAIL KYLE',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLSCxjzx0CjkIHObMayqb8kc6zoSsedfJGh9gZf5=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295563,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'ben dover',
        message: 'congrats you win over time tonight, Kyle your an awesome person',
        html: 'congrats you win over time tonight, Kyle your an awesome person',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRbmCBXxESDZe9EwqCCHGSVKj0JhsHqa_kA3Q=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295563,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Bryan McNair',
        message:
          'kyle supports the movement so to me that means more than just the sayn....they backed away from asking him',
        html: 'kyle supports the movement so to me that means more than just the sayn....they backed away from asking him',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLS8jpDb00yyBlOF3Cz8SY0TjlM2e8uVhRwY3MpmBQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295564,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Chase',
        message: 'I want a Sara G real doll',
        html: 'I want a Sara G real doll',
        avatarUrl:
          'https://yt4.ggpht.com/zj3s1hzZE21cus8JHmMDl4VyYhm90Pt3ZVzRNZOfHpd3SQhHs91YtIXh8WZRShHGR6WBbjAG7a8=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295564,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Joe Anon',
        message: 'eat, pray, laugh?',
        html: 'eat, pray, laugh?',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLQXcfHBS1CATBj8L7F7CaliZGso9rQCE3Zj8c8G=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295564,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Gayvin McGinnes',
        message: 'based milo!',
        html: 'based milo!',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRakXY_3oSrNem00zNHxTrRL5s4bSnlJAiEeQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295565,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Endr Elad',
        message: 'god is overrated',
        html: 'god is overrated',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLQ5VmsZ-wL_Pj8TwcpT7Ylwi83PJgbf1o1r5g=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295565,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'BarelyUnofficial',
        message: 'lmao',
        html: 'lmao',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLQZT81E34pRzVEMyCt2hIPIgU-RvWlpfNZina_KPw=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295565,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'jsleight55',
        message: 'All the best Kyle',
        html: 'All the best Kyle',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRR0vHSBM6GwXXFSWWLDF-6uoKFaVnnoqhp4WTd=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295565,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Al Tucker',
        message: 'Amen Gods Army',
        html: 'Amen Gods Army',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRkv9NzVYOHbl-SCIt_XoWkT_IzCibMGTPqwA=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295566,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Lucifer The Doberman',
        message: 'BASED',
        html: 'BASED',
        avatarUrl:
          'https://yt4.ggpht.com/K4wDTWV4qgtmYTTSeinzkiFp8CZJ0RYTblnRoC86cCHGbLCbKMmHGDNEhjKeDRarOd53YTeGpQ=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295566,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Heavy Abyssal',
        message: 'Pray to the magical Jew',
        html: 'Pray to the magical Jew',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLTX2vWhnQNXZhrxVvRk2VdIRKrVmV09uVQRPVvF8w=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295566,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Larry Romano',
        message: 'Amen',
        html: 'Amen',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLQA05r5uFZpwY7rwsqRyVSNHAjEiOB8vgIv9JALTw=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295567,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Vaticider69',
        message: 'Glad to see him here....',
        html: 'Glad to see him here....',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRwkHVwJ8WluM5qZcKd2-3od1G2BTKdwwxGLydgvw=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295567,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'S. Parrish',
        message: 'Nick Fuentes is KING',
        html: 'Nick Fuentes is 🐸🐸🐸 KING Nick Fuentes 🐸🐸🐸 is KING Nick Fuentes is KING Nick Fuentes is KING Nick Fuentes is 🐸🐸🐸 KING Nick Fuentes 🐸🐸🐸 is KING Nick Fuentes is KING Nick Fuentes is KING Nick Fuentes is KING',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLRNXeTSgq6m7mCFK2AUJjGwQGL6y3bWH0QODIUUuw=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295568,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'Dim',
        message: '',
        html: '🐸🐸🐸',
        avatarUrl:
          'https://yt4.ggpht.com/D3_AnNtHtXclUIq45FDDsIU0lkvnRf6DXsgnltJlTs7N1fd2K8xI2-Ne-Qv3Xrw60x0PEwHr0w=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295568,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'B L',
        message: 'This is so wholesome',
        html: 'This is so wholesome',
        avatarUrl:
          'https://yt4.ggpht.com/ytc/AKedOLT7E_H8rmMMs3PzgYNsuBuYoqkt1Fvuz__Nfy8d=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295569,
        prefix: '-R9woSO6y_o',
      },
      {
        author: 'aprincipledgroyper',
        message: 'CHRIST IS KING',
        html: 'CHRIST IS KING',
        avatarUrl:
          'https://yt4.ggpht.com/AQGwPDVaVDAwONBS4Zhn100H0rOUjH0zzJ5Gzma1HM4pbXFPDlC3X-thoqUnKYE8RzAMj5S2=s256-c-k-c0x00ffffff-no-rj',
        badgeUrl: '',
        donation: '',
        messageType: 'text-message',
        host: 'youtube',
        streamId: '-R9woSO6y_o',
        timestamp: 1638839295569,
        prefix: '-R9woSO6y_o',
      },
    ];
  }
}
