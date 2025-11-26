import { TestBed } from '@angular/core/testing';

import { BorePileService } from './bore-pile.service';

describe('BorePileService', () => {
  let service: BorePileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BorePileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
