import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatingBbsComponent } from './updating-bbs.component';

describe('UpdatingBbsComponent', () => {
  let component: UpdatingBbsComponent;
  let fixture: ComponentFixture<UpdatingBbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatingBbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatingBbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
