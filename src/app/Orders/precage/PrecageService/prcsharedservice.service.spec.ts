import { TestBed } from '@angular/core/testing';

import { PrcsharedserviceService } from './prcsharedservice.service';

describe('PrcsharedserviceService', () => {
  let service: PrcsharedserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrcsharedserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
