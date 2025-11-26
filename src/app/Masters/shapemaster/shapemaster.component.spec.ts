import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapemasterComponent } from './shapemaster.component';

describe('ShapemasterComponent', () => {
  let component: ShapemasterComponent;
  let fixture: ComponentFixture<ShapemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapemasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
