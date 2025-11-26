import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyOrderDetailsComponent } from './copy-order-details.component';

describe('CopyOrderDetailsComponent', () => {
  let component: CopyOrderDetailsComponent;
  let fixture: ComponentFixture<CopyOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
