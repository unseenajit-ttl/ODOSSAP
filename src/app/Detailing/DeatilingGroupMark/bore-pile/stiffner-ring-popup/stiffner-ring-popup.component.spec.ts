import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StiffnerRingPopupComponent } from './stiffner-ring-popup.component';

describe('StiffnerRingPopupComponent', () => {
  let component: StiffnerRingPopupComponent;
  let fixture: ComponentFixture<StiffnerRingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StiffnerRingPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StiffnerRingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
