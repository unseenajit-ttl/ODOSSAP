import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectManagementComponent } from './update-project-management.component';

describe('UpdateProjectManagementComponent', () => {
  let component: UpdateProjectManagementComponent;
  let fixture: ComponentFixture<UpdateProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProjectManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
