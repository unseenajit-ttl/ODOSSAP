import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBarNumberComponent } from './main-bar-number.component';

describe('MainBarNumberComponent', () => {
  let component: MainBarNumberComponent;
  let fixture: ComponentFixture<MainBarNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainBarNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainBarNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
