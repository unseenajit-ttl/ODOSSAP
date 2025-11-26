import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectInchargeComponent } from './update-project-incharge.component';

describe('UpdateProjectInchargeComponent', () => {
  let component: UpdateProjectInchargeComponent;
  let fixture: ComponentFixture<UpdateProjectInchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProjectInchargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProjectInchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
