import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNotificationToDetailerComponent } from './email-notification-to-detailer.component';

describe('EmailNotificationToDetailerComponent', () => {
  let component: EmailNotificationToDetailerComponent;
  let fixture: ComponentFixture<EmailNotificationToDetailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailNotificationToDetailerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailNotificationToDetailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
