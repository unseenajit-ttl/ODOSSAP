import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsmPopUpDragDropComponent } from './esm-pop-up-drag-drop.component';

describe('EsmPopUpDragDropComponent', () => {
  let component: EsmPopUpDragDropComponent;
  let fixture: ComponentFixture<EsmPopUpDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsmPopUpDragDropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsmPopUpDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
