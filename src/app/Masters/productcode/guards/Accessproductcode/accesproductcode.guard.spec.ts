import { TestBed } from '@angular/core/testing';

import { AccesproductcodeGuard } from './accesproductcode.guard';

describe('AccesproductcodeGuard', () => {
  let guard: AccesproductcodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccesproductcodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
