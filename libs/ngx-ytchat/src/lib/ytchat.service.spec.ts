import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@fullerstack/ngx-i18n';

import { YtChatService } from './ytchat.service';

xdescribe('YtChatService', () => {
  let service: YtChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nModule, RouterModule],
      providers: [YtChatService],
    });
    service = TestBed.inject(YtChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
