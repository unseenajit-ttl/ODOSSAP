import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabprcComponent } from './cabprc.component';

describe('CabprcComponent', () => {
  let component: CabprcComponent;
  let fixture: ComponentFixture<CabprcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabprcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabprcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
