import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpetComponent } from './carpet.component';

describe('CarpetComponent', () => {
  let component: CarpetComponent;
  let fixture: ComponentFixture<CarpetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarpetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
