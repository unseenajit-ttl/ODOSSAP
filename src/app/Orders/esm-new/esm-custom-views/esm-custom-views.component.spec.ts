import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsmCustomViewsComponent } from './esm-custom-views.component';

describe('EsmCustomViewsComponent', () => {
  let component: EsmCustomViewsComponent;
  let fixture: ComponentFixture<EsmCustomViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsmCustomViewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsmCustomViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
