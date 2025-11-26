import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineBBSComponent } from './offline-bbs.component';

describe('OfflineBBSComponent', () => {
  let component: OfflineBBSComponent;
  let fixture: ComponentFixture<OfflineBBSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineBBSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineBBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
