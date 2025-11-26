import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addFormulaComponent } from './addFormula.component';

describe('addFormulaComponent', () => {
  let component: addFormulaComponent;
  let fixture: ComponentFixture<addFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ addFormulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(addFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
