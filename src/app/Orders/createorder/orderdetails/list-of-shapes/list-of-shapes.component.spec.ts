import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfShapesComponent } from './list-of-shapes.component';

describe('ListOfShapesComponent', () => {
  let component: ListOfShapesComponent;
  let fixture: ComponentFixture<ListOfShapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfShapesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
