import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeaderFormatComponent } from './calendar-header-format.component';

describe('CalendarHeaderFormatComponent', () => {
  let component: CalendarHeaderFormatComponent;
  let fixture: ComponentFixture<CalendarHeaderFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarHeaderFormatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarHeaderFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
