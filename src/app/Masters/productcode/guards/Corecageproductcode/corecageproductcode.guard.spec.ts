import { TestBed } from '@angular/core/testing';

import { CorecageproductcodeGuard } from './corecageproductcode.guard';

describe('CorecageproductcodeGuard', () => {
  let guard: CorecageproductcodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CorecageproductcodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
