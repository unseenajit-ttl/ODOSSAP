import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpiralDialogComponent } from './spiral-dialog.component';

describe('SpiralDialogComponent', () => {
  let component: SpiralDialogComponent;
  let fixture: ComponentFixture<SpiralDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpiralDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpiralDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
