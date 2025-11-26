import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderImageModalComponent } from './order-image-modal.component';

describe('OrderImageModalComponent', () => {
  let component: OrderImageModalComponent;
  let fixture: ComponentFixture<OrderImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderImageModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
