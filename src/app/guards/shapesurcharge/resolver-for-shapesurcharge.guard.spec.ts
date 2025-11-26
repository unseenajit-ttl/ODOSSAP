import { TestBed } from '@angular/core/testing';

import { ResolverForShapesurchargeGuard } from './resolver-for-shapesurcharge.guard';

describe('ResolverForShapesurchargeGuard', () => {
  let guard: ResolverForShapesurchargeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResolverForShapesurchargeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
