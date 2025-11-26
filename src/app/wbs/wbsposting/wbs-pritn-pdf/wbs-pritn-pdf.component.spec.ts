import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintWBSpdfpopupComponent } from './wbs-pritn-pdf.component';


describe('PrintWBSpdfpopupComponent', () => {
  let component: PrintWBSpdfpopupComponent;
  let fixture: ComponentFixture<PrintWBSpdfpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintWBSpdfpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintWBSpdfpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
