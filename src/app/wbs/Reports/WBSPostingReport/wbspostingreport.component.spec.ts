import { ComponentFixture, TestBed } from '@angular/core/testing';

import { wbspostingreportComponent } from './wbspostingreport.component';

describe('wbspostingreportComponent', () => {
  let component: wbspostingreportComponent;
  let fixture: ComponentFixture<wbspostingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ wbspostingreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(wbspostingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
