import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBBSOrderComponent } from './print-bbsorder.component';

describe('PrintBBSOrderComponent', () => {
  let component: PrintBBSOrderComponent;
  let fixture: ComponentFixture<PrintBBSOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBBSOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintBBSOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
