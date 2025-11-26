import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeamlinkmeshorderComponent } from './beamlinkmeshorder.component';

describe('BeamlinkmeshorderComponent', () => {
  let component: BeamlinkmeshorderComponent;
  let fixture: ComponentFixture<BeamlinkmeshorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeamlinkmeshorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeamlinkmeshorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
