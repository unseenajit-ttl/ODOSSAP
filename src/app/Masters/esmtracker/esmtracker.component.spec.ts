import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESMTrackerComponent } from './esmtracker.component';

describe('ESMTrackerComponent', () => {
  let component: ESMTrackerComponent;
  let fixture: ComponentFixture<ESMTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESMTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESMTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
