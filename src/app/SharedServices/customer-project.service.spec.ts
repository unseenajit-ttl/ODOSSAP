import { TestBed } from '@angular/core/testing';

import { CustomerProjectService } from './customer-project.service';

describe('CustomerProjectService', () => {
  let service: CustomerProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
