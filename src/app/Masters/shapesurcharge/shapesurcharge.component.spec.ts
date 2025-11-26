import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesurchargeComponent } from './shapesurcharge.component';

describe('ShapesurchargeComponent', () => {
  let component: ShapesurchargeComponent;
  let fixture: ComponentFixture<ShapesurchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapesurchargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapesurchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
