import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpetShapeListComponent } from './carpet-shape-list.component';

describe('CarpetShapeListComponent', () => {
  let component: CarpetShapeListComponent;
  let fixture: ComponentFixture<CarpetShapeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarpetShapeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpetShapeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
