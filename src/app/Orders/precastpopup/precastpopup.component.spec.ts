import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecastpopupComponent } from './precastpopup.component';

describe('PrecastpopupComponent', () => {
  let component: PrecastpopupComponent;
  let fixture: ComponentFixture<PrecastpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecastpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecastpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
