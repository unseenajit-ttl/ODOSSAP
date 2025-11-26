import { TestBed } from '@angular/core/testing';

import { CreateordersharedserviceService } from './createordersharedservice.service';

describe('CreateordersharedserviceService', () => {
  let service: CreateordersharedserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateordersharedserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
