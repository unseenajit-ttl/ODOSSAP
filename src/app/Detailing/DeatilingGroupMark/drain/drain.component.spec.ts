import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainComponent } from './drain.component';

describe('DrainComponent', () => {
  let component: DrainComponent;
  let fixture: ComponentFixture<DrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
