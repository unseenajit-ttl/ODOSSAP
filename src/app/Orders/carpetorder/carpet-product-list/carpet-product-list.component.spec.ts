import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpetProductListComponent } from './carpet-product-list.component';

describe('CarpetProductListComponent', () => {
  let component: CarpetProductListComponent;
  let fixture: ComponentFixture<CarpetProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarpetProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpetProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
