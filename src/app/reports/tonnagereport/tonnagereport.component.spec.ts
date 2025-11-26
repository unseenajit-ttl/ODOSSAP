import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonnagereportComponent } from './tonnagereport.component';

describe('TonnagereportComponent', () => {
  let component: TonnagereportComponent;
  let fixture: ComponentFixture<TonnagereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TonnagereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TonnagereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
