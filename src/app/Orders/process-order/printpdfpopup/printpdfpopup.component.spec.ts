import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintpdfpopupComponent } from './printpdfpopup.component';

describe('PrintpdfpopupComponent', () => {
  let component: PrintpdfpopupComponent;
  let fixture: ComponentFixture<PrintpdfpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintpdfpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintpdfpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
