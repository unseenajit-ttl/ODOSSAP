import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarDetailsInfoComponent } from './bar-details-info.component';

describe('BarDetailsInfoComponent', () => {
  let component: BarDetailsInfoComponent;
  let fixture: ComponentFixture<BarDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarDetailsInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
