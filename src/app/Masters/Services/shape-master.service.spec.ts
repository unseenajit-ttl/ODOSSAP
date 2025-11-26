import { TestBed } from '@angular/core/testing';

import { ShapeMasterService } from './shape-master.service';

describe('ShapeMasterService', () => {
  let service: ShapeMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
