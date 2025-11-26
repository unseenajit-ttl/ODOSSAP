import { TestBed } from '@angular/core/testing';

import { ProductcodeGuard } from './productcode.guard';

describe('ProductcodeGuard', () => {
  let guard: ProductcodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProductcodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
