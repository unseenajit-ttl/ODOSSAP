import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidTokenComponent } from './invalid-token.component';

describe('InvalidTokenComponent', () => {
  let component: InvalidTokenComponent;
  let fixture: ComponentFixture<InvalidTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
