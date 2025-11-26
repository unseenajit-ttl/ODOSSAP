import { TestBed } from '@angular/core/testing';

import { OrderSummarySharedServiceService } from './order-summary-shared-service.service';

describe('OrderSummarySharedServiceService', () => {
  let service: OrderSummarySharedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderSummarySharedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
