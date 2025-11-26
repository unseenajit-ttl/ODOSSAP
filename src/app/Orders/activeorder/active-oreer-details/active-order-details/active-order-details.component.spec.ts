import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOrderDetailsComponent } from './active-order-details.component';

describe('ActiveOrderDetailsComponent', () => {
  let component: ActiveOrderDetailsComponent;
  let fixture: ComponentFixture<ActiveOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
