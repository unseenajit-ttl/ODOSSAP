import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmExcessMailComponent } from './confirm-excess-mail.component';

describe('ConfirmExcessMailComponent', () => {
  let component: ConfirmExcessMailComponent;
  let fixture: ComponentFixture<ConfirmExcessMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmExcessMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmExcessMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
