import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusMonitoringComponent } from './order-status-monitoring.component';

describe('OrderStatusMonitoringComponent', () => {
  let component: OrderStatusMonitoringComponent;
  let fixture: ComponentFixture<OrderStatusMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStatusMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
