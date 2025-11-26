import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSpiralPopupComponent } from './additional-spiral-popup.component';

describe('AdditionalSpiralPopupComponent', () => {
  let component: AdditionalSpiralPopupComponent;
  let fixture: ComponentFixture<AdditionalSpiralPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalSpiralPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalSpiralPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
