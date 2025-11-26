import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShapesComponent } from './all-shapes.component';

describe('AllShapesComponent', () => {
  let component: AllShapesComponent;
  let fixture: ComponentFixture<AllShapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllShapesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
