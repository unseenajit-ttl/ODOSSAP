import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPdfModalComponent } from './view-pdf-modal.component';

describe('ViewPdfModalComponent', () => {
  let component: ViewPdfModalComponent;
  let fixture: ComponentFixture<ViewPdfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPdfModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPdfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
