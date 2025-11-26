import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfShapesESpliceComponent } from './list-of-shapes-esplice.component';

describe('ListOfShapesESpliceComponent', () => {
  let component: ListOfShapesESpliceComponent;
  let fixture: ComponentFixture<ListOfShapesESpliceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfShapesESpliceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfShapesESpliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
