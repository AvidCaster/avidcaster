import { TestBed, waitForAsync } from '@angular/core/testing';

import { YtChatModule } from './ytchat.module';
import { YtChatService } from './ytchat.service';

xdescribe('YtChatModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [YtChatModule],
        providers: [YtChatService],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(YtChatModule).toBeDefined();
  });
});
