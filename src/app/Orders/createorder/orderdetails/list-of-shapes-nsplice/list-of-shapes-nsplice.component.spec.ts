import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfShapesNSpliceComponent } from './list-of-shapes-nsplice.component';

describe('ListOfShapesNSpliceComponent', () => {
  let component: ListOfShapesNSpliceComponent;
  let fixture: ComponentFixture<ListOfShapesNSpliceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfShapesNSpliceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfShapesNSpliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
