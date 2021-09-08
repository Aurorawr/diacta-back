import { TestBed } from '@angular/core/testing';

import { MinuteCollabService } from './minute-collab.service';

describe('MinuteCollabService', () => {
  let service: MinuteCollabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinuteCollabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
