import { TestBed, waitForAsync } from '@angular/core/testing';

import { YtchatModule } from './chat.module';

describe('YtchatModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [YtchatModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(YtchatModule).toBeDefined();
  });
});
