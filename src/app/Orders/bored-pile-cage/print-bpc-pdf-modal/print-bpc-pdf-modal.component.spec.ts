import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintBPCPdfModalComponent } from './print-bpc-pdf-modal.component';

describe('PrintBPCPdfModalComponent', () => {
  let component: PrintBPCPdfModalComponent;
  let fixture: ComponentFixture<PrintBPCPdfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBPCPdfModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintBPCPdfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
