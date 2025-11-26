import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDetaillingInchargeComponent } from './update-detailling-incharge.component';

describe('UpdateDetaillingInchargeComponent', () => {
  let component: UpdateDetaillingInchargeComponent;
  let fixture: ComponentFixture<UpdateDetaillingInchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDetaillingInchargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDetaillingInchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
