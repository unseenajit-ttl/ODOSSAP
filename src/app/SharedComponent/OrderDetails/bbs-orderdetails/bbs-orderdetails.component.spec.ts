import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsOrderdetailsComponent } from './bbs-orderdetails.component';

describe('BbsOrderdetailsComponent', () => {
  let component: BbsOrderdetailsComponent;
  let fixture: ComponentFixture<BbsOrderdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsOrderdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbsOrderdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
