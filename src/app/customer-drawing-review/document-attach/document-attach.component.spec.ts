import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAttachComponent } from './document-attach.component';

describe('DocumentAttachComponent', () => {
  let component: DocumentAttachComponent;
  let fixture: ComponentFixture<DocumentAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentAttachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
