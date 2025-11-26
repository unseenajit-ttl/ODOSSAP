import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpcordereentryreportComponent } from './bpcordereentryreport.component';

describe('BpcordereentryreportComponent', () => {
  let component: BpcordereentryreportComponent;
  let fixture: ComponentFixture<BpcordereentryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpcordereentryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpcordereentryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
