import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllshapesComponent } from './allshapes.component';

describe('AllshapesComponent', () => {
  let component: AllshapesComponent;
  let fixture: ComponentFixture<AllshapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllshapesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllshapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
