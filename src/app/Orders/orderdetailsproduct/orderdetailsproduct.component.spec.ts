import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdetailsproductComponent } from './orderdetailsproduct.component';

describe('OrderdetailsproductComponent', () => {
  let component: OrderdetailsproductComponent;
  let fixture: ComponentFixture<OrderdetailsproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdetailsproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderdetailsproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
