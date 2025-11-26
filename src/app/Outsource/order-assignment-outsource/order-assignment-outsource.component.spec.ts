import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAssignmentOutsourceComponent } from './order-assignment-outsource.component';

describe('OrderAssignmentOutsourceComponent', () => {
  let component: OrderAssignmentOutsourceComponent;
  let fixture: ComponentFixture<OrderAssignmentOutsourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAssignmentOutsourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAssignmentOutsourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
