import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootsrtapDateRangePickerForSearchComponent } from './bootsrtap-date-range-picker-for-search.component';

describe('BootsrtapDateRangePickerForSearchComponent', () => {
  let component: BootsrtapDateRangePickerForSearchComponent;
  let fixture: ComponentFixture<BootsrtapDateRangePickerForSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BootsrtapDateRangePickerForSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootsrtapDateRangePickerForSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
