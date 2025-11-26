import { TestBed } from '@angular/core/testing';

import { RawmaterialproductcodeGuard } from './rawmaterialproductcode.guard';

describe('RawmaterialproductcodeGuard', () => {
  let guard: RawmaterialproductcodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RawmaterialproductcodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
