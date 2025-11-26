import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTechnicalRemarksComponent } from './update-technical-remarks.component';

describe('UpdateTechnicalRemarksComponent', () => {
  let component: UpdateTechnicalRemarksComponent;
  let fixture: ComponentFixture<UpdateTechnicalRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTechnicalRemarksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTechnicalRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
