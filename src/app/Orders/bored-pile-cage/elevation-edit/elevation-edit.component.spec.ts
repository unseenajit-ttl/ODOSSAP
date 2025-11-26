import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevationEditComponent } from './elevation-edit.component';

describe('ElevationEditComponent', () => {
  let component: ElevationEditComponent;
  let fixture: ComponentFixture<ElevationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElevationEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
