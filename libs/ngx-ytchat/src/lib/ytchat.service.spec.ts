import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@fullerstack/ngx-i18n';

import { YTChatService } from './ytchat.service';

xdescribe('YTChatService', () => {
  let service: YTChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nModule, RouterModule],
      providers: [YTChatService],
    });
    service = TestBed.inject(YTChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
