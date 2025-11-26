import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyWBSComponent } from './copy-wbs.component';

describe('CopyWBSComponent', () => {
  let component: CopyWBSComponent;
  let fixture: ComponentFixture<CopyWBSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyWBSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyWBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
