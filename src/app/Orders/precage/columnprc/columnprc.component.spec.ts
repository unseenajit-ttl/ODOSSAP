import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnprcComponent } from './columnprc.component';

describe('ColumnprcComponent', () => {
  let component: ColumnprcComponent;
  let fixture: ComponentFixture<ColumnprcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnprcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnprcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
