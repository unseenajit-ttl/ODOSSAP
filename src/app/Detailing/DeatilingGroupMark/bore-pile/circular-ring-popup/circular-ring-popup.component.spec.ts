import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularRingPopupComponent } from './circular-ring-popup.component';

describe('CircularRingPopupComponent', () => {
  let component: CircularRingPopupComponent;
  let fixture: ComponentFixture<CircularRingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircularRingPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularRingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
