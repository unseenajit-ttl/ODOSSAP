import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessordercontractlistComponent } from './processordercontractlist.component';

describe('ProcessordercontractlistComponent', () => {
  let component: ProcessordercontractlistComponent;
  let fixture: ComponentFixture<ProcessordercontractlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessordercontractlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessordercontractlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
