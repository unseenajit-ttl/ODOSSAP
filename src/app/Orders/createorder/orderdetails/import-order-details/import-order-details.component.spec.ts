import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOrderDetailsComponent } from './import-order-details.component';

describe('ImportOrderDetailsComponent', () => {
  let component: ImportOrderDetailsComponent;
  let fixture: ComponentFixture<ImportOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
