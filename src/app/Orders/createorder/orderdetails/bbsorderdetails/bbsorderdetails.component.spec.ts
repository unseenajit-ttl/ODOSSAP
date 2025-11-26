import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsorderdetailsComponent } from './bbsorderdetails.component';

describe('BbsorderdetailsComponent', () => {
  let component: BbsorderdetailsComponent;
  let fixture: ComponentFixture<BbsorderdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsorderdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbsorderdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
