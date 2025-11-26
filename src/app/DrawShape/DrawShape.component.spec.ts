import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawShapeComponent } from './DrawShape.component';

describe('DrawShapeComponent', () => {
  let component: DrawShapeComponent;
  let fixture: ComponentFixture<DrawShapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawShapeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
