import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShapeComponent } from './create-shape.component';

describe('CreateShapeComponent', () => {
  let component: CreateShapeComponent;
  let fixture: ComponentFixture<CreateShapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateShapeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
