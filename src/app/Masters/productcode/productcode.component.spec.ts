import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcodeComponent } from './productcode.component';

describe('ProductcodeComponent', () => {
  let component: ProductcodeComponent;
  let fixture: ComponentFixture<ProductcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
