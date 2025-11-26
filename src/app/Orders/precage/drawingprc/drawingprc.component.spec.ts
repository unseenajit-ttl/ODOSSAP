import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingprcComponent } from './drawingprc.component';

describe('DrawingprcComponent', () => {
  let component: DrawingprcComponent;
  let fixture: ComponentFixture<DrawingprcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingprcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingprcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
