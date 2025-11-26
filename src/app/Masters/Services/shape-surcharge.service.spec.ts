import { TestBed } from '@angular/core/testing';

import { ShapeSurchargeService } from './shape-surcharge.service';

describe('ShapeSurchargeService', () => {
  let service: ShapeSurchargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeSurchargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
