import { TestBed } from '@angular/core/testing';

import { DrainServiceService } from './drain-service.service';

describe('DrainServiceService', () => {
  let service: DrainServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrainServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
