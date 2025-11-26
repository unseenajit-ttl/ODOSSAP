import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabShapeCodeComponent } from './cab-shape-code.component';

describe('CabShapeCodeComponent', () => {
  let component: CabShapeCodeComponent;
  let fixture: ComponentFixture<CabShapeCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabShapeCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabShapeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
