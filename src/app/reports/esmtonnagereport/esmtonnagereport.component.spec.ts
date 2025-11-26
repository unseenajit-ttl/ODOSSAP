import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsmtonnagereportComponent } from './esmtonnagereport.component';

describe('EsmtonnagereportComponent', () => {
  let component: EsmtonnagereportComponent;
  let fixture: ComponentFixture<EsmtonnagereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsmtonnagereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsmtonnagereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
