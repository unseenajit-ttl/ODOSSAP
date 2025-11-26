import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttachDocumentComponent } from './attachdocuments.component';


describe('AttachDocumentComponent', () => {
  let component: AttachDocumentComponent;
  let fixture: ComponentFixture<AttachDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
