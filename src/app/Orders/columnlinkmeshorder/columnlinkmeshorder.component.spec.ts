import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnlinkmeshorderComponent } from './columnlinkmeshorder.component';

describe('ColumnlinkmeshorderComponent', () => {
  let component: ColumnlinkmeshorderComponent;
  let fixture: ComponentFixture<ColumnlinkmeshorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnlinkmeshorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnlinkmeshorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
