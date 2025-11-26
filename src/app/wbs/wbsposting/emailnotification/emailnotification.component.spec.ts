import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailnotificationComponent } from './emailnotification.component';

describe('EmailnotificationComponent', () => {
  let component: EmailnotificationComponent;
  let fixture: ComponentFixture<EmailnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailnotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
