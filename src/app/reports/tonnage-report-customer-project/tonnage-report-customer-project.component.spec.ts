import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonnageReportCustomerProjectComponent } from './tonnage-report-customer-project.component';

describe('TonnageReportCustomerProjectComponent', () => {
  let component: TonnageReportCustomerProjectComponent;
  let fixture: ComponentFixture<TonnageReportCustomerProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TonnageReportCustomerProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TonnageReportCustomerProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
