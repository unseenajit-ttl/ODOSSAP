import { TestBed } from '@angular/core/testing';

import { MeshproductcodeGuard } from './meshproductcode.guard';

describe('MeshproductcodeGuard', () => {
  let guard: MeshproductcodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MeshproductcodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
