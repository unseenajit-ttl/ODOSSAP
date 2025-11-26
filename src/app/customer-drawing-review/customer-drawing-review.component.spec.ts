import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDrawingReviewComponent } from './customer-drawing-review.component';

describe('CustomerDrawingReviewComponent', () => {
  let component: CustomerDrawingReviewComponent;
  let fixture: ComponentFixture<CustomerDrawingReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDrawingReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDrawingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
