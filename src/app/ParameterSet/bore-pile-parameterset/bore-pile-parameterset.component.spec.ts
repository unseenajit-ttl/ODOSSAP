import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorePileParametersetComponent } from './bore-pile-parameterset.component';

describe('BorePileParametersetComponent', () => {
  let component: BorePileParametersetComponent;
  let fixture: ComponentFixture<BorePileParametersetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorePileParametersetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorePileParametersetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
