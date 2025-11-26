import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpetorderComponent } from './carpetorder.component';

describe('CarpetorderComponent', () => {
  let component: CarpetorderComponent;
  let fixture: ComponentFixture<CarpetorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarpetorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpetorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
