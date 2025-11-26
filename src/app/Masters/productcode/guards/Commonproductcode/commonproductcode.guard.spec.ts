import { TestBed } from '@angular/core/testing';

import { CommonproductcodeGuard } from './commonproductcode.guard';

describe('CommonproductcodeGuard', () => {
  let guard: CommonproductcodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CommonproductcodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
