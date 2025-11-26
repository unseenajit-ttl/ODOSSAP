import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilproductsorderComponent } from './coilproductsorder.component';

describe('CoilproductsorderComponent', () => {
  let component: CoilproductsorderComponent;
  let fixture: ComponentFixture<CoilproductsorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoilproductsorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoilproductsorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
