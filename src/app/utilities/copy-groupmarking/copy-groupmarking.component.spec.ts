import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyGroupmarkingComponent } from './copy-groupmarking.component';

describe('CopyGroupmarkingComponent', () => {
  let component: CopyGroupmarkingComponent;
  let fixture: ComponentFixture<CopyGroupmarkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyGroupmarkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyGroupmarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
