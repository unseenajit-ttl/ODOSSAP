import { TestBed } from '@angular/core/testing';

import { ParametersetService } from './parameterset.service';

describe('ParametersetService', () => {
  let service: ParametersetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametersetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
