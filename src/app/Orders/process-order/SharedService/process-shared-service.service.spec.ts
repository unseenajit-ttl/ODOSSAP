import { TestBed } from '@angular/core/testing';

import { ProcessSharedServiceService } from './process-shared-service.service';

describe('ProcessSharedServiceService', () => {
  let service: ProcessSharedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessSharedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
