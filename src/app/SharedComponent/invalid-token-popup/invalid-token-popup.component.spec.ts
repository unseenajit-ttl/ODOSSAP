import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidTokenPopupComponent } from './invalid-token-popup.component';

describe('InvalidTokenPopupComponent', () => {
  let component: InvalidTokenPopupComponent;
  let fixture: ComponentFixture<InvalidTokenPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidTokenPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidTokenPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
