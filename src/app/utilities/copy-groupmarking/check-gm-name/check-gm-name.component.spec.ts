import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckGmNameComponent } from './check-gm-name.component';

describe('CheckGmNameComponent', () => {
  let component: CheckGmNameComponent;
  let fixture: ComponentFixture<CheckGmNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckGmNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckGmNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
