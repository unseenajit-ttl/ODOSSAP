import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleOrderAmendmentComponent } from './multiple-order-amendment.component';

describe('MultipleOrderAmendmentComponent', () => {
  let component: MultipleOrderAmendmentComponent;
  let fixture: ComponentFixture<MultipleOrderAmendmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleOrderAmendmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleOrderAmendmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
