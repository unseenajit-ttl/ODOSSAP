import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceOptionDialogComponent } from './advance-option-dialog.component';

describe('AdvanceOptionDialogComponent', () => {
  let component: AdvanceOptionDialogComponent;
  let fixture: ComponentFixture<AdvanceOptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceOptionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
