import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWbsBbsComponent } from './addwbsbbs.component';

describe('AddWbsBbsComponent', () => {
  let component: AddWbsBbsComponent;
  let fixture: ComponentFixture<AddWbsBbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWbsBbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWbsBbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
