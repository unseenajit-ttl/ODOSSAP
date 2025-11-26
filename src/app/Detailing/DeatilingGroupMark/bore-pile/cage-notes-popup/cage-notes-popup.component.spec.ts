import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CageNotesPopupComponent } from './cage-notes-popup.component';

describe('CageNotesPopupComponent', () => {
  let component: CageNotesPopupComponent;
  let fixture: ComponentFixture<CageNotesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CageNotesPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CageNotesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
