import { TestBed } from '@angular/core/testing';

import { CabShapeServiceService } from './cab-shape-service.service';

describe('CabShapeServiceService', () => {
  let service: CabShapeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CabShapeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
