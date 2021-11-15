import { TestBed } from '@angular/core/testing';

import { YtchatService } from './chat.service';

describe('YtchatService', () => {
  let service: YtchatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YtchatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
