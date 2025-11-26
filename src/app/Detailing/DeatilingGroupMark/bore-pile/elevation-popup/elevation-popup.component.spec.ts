import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevationPopupComponent } from './elevation-popup.component';

describe('ElevationPopupComponent', () => {
  let component: ElevationPopupComponent;
  let fixture: ComponentFixture<ElevationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElevationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
