import { TestBed } from '@angular/core/testing';

import { DrainParameterSetService } from './drain-parameter-set.service';

describe('DrainParameterSetService', () => {
  let service: DrainParameterSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrainParameterSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
