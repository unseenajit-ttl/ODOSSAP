import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredOrderDocumentComponent } from './delivered-order-document.component';

describe('DeliveredOrderDocumentComponent', () => {
  let component: DeliveredOrderDocumentComponent;
  let fixture: ComponentFixture<DeliveredOrderDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveredOrderDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveredOrderDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
