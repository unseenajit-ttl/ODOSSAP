import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouplerheadorderComponent } from './couplerheadorder.component';

describe('CouplerheadorderComponent', () => {
  let component: CouplerheadorderComponent;
  let fixture: ComponentFixture<CouplerheadorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouplerheadorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouplerheadorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
