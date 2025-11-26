import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessSelectionModelComponent } from './process-selection-model.component';

describe('ProcessSelectionModelComponent', () => {
  let component: ProcessSelectionModelComponent;
  let fixture: ComponentFixture<ProcessSelectionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessSelectionModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessSelectionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
