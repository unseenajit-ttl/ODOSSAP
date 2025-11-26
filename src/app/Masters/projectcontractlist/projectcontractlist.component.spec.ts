import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectcontractlistComponent } from './projectcontractlist.component';

describe('ProjectcontractlistComponent', () => {
  let component: ProjectcontractlistComponent;
  let fixture: ComponentFixture<ProjectcontractlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectcontractlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectcontractlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
