import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsNumberListComponent } from './bbs-number-list.component';

describe('BbsNumberListComponent', () => {
  let component: BbsNumberListComponent;
  let fixture: ComponentFixture<BbsNumberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsNumberListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbsNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
