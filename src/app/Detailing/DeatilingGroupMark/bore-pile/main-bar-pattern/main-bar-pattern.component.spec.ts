import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBarPatternComponent } from './main-bar-pattern.component';

describe('MainBarPatternComponent', () => {
  let component: MainBarPatternComponent;
  let fixture: ComponentFixture<MainBarPatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainBarPatternComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainBarPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
