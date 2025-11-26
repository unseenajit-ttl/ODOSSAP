import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessordersearchPOComponent } from './processordersearch-po.component';

describe('ProcessordersearchPOComponent', () => {
  let component: ProcessordersearchPOComponent;
  let fixture: ComponentFixture<ProcessordersearchPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessordersearchPOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessordersearchPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
