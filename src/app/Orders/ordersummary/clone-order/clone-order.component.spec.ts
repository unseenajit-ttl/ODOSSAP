import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneOrderComponent } from './clone-order.component';

describe('CloneOrderComponent', () => {
  let component: CloneOrderComponent;
  let fixture: ComponentFixture<CloneOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
