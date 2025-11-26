import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBBSComponent } from './copy-bbs.component';

describe('CopyBBSComponent', () => {
  let component: CopyBBSComponent;
  let fixture: ComponentFixture<CopyBBSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyBBSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyBBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
