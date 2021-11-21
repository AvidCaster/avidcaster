import { TestBed, waitForAsync } from '@angular/core/testing';

import { YTChatModule } from './ytchat.module';
import { YTChatService } from './ytchat.service';

xdescribe('YTChatModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [YTChatModule],
        providers: [YTChatService],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(YTChatModule).toBeDefined();
  });
});
