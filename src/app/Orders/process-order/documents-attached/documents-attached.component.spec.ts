import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAttachedComponent } from './documents-attached.component';

describe('DocumentsAttachedComponent', () => {
  let component: DocumentsAttachedComponent;
  let fixture: ComponentFixture<DocumentsAttachedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsAttachedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsAttachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
