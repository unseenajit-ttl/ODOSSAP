import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainParameterSetComponent } from './drain-parameter-set.component';

describe('DrainParameterSetComponent', () => {
  let component: DrainParameterSetComponent;
  let fixture: ComponentFixture<DrainParameterSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrainParameterSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrainParameterSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
