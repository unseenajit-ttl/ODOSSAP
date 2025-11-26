import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShapesurchargeComponent } from './create-shapesurcharge.component';

describe('CreateShapesurchargeComponent', () => {
  let component: CreateShapesurchargeComponent;
  let fixture: ComponentFixture<CreateShapesurchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateShapesurchargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShapesurchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
