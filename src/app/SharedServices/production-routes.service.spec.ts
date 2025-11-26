import { TestBed } from '@angular/core/testing';

import { ProductionRoutesService } from './production-routes.service';

describe('ProductionRoutesService', () => {
  let service: ProductionRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
