import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAlertMessageComponent } from './transport-alert-message.component';

describe('TransportAlertMessageComponent', () => {
  let component: TransportAlertMessageComponent;
  let fixture: ComponentFixture<TransportAlertMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportAlertMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportAlertMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
