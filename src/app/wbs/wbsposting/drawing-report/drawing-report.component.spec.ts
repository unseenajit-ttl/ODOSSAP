import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingReportComponent } from './drawing-report.component';

describe('DrawingReportComponent', () => {
  let component: DrawingReportComponent;
  let fixture: ComponentFixture<DrawingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
