import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecageComponent } from './precage.component';

describe('PrecageComponent', () => {
  let component: PrecageComponent;
  let fixture: ComponentFixture<PrecageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
