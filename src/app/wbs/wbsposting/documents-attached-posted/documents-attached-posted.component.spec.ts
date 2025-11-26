import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WbsDocumentsAttachedComponent } from './documents-attached-posted.component';


describe('WbsDocumentsAttachedComponent', () => {
  let component: WbsDocumentsAttachedComponent;
  let fixture: ComponentFixture<WbsDocumentsAttachedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbsDocumentsAttachedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbsDocumentsAttachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
