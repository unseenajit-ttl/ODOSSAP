import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapDateRangePickerForDeliveredComponent } from './bootstrap-date-range-picker-for-delivered.component';

describe('BootstrapDateRangePickerForDeliveredComponent', () => {
  let component: BootstrapDateRangePickerForDeliveredComponent;
  let fixture: ComponentFixture<BootstrapDateRangePickerForDeliveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BootstrapDateRangePickerForDeliveredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapDateRangePickerForDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
