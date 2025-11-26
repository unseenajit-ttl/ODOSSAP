import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignWBSComponent } from './assign-wbs.component';

describe('AssignWBSComponent', () => {
  let component: AssignWBSComponent;
  let fixture: ComponentFixture<AssignWBSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignWBSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignWBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
