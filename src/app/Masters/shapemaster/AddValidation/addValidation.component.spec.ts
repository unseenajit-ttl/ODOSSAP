import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addValidationComponent } from './addValidation.component';

describe('addValidationComponent', () => {
  let component: addValidationComponent;
  let fixture: ComponentFixture<addValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ addValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(addValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
