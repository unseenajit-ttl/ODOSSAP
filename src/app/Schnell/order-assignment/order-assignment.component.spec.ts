import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAssignmentComponent } from './order-assignment.component';

describe('OrderAssignmentComponent', () => {
  let component: OrderAssignmentComponent;
  let fixture: ComponentFixture<OrderAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
