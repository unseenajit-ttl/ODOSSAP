import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchprintingComponent } from './batchprinting.component';

describe('BatchprintingComponent', () => {
  let component: BatchprintingComponent;
  let fixture: ComponentFixture<BatchprintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchprintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchprintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
