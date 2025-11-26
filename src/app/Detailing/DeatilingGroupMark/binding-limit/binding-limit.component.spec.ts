import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BindingLimitComponent } from './binding-limit.component';

describe('BindingLimitComponent', () => {
  let component: BindingLimitComponent;
  let fixture: ComponentFixture<BindingLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BindingLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BindingLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
