import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineBBSOrderComponent } from './offline-bbsorder.component';

describe('OfflineBBSOrderComponent', () => {
  let component: OfflineBBSOrderComponent;
  let fixture: ComponentFixture<OfflineBBSOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineBBSOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineBBSOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
