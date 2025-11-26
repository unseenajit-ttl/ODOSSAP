import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addProductcodeComponent } from './create-productcode.component';

describe('addProductcodeComponent', () => {
  let component: addProductcodeComponent;
  let fixture: ComponentFixture<addProductcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ addProductcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(addProductcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
