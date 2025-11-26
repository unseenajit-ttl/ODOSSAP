import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelCabOrdersComponent } from './cancel-cab-orders.component';

describe('CancelCabOrdersComponent', () => {
  let component: CancelCabOrdersComponent;
  let fixture: ComponentFixture<CancelCabOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelCabOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelCabOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
