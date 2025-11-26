import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabShapeMasterComponent } from './cab-shape-master.component';

describe('CabShapeMasterComponent', () => {
  let component: CabShapeMasterComponent;
  let fixture: ComponentFixture<CabShapeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabShapeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabShapeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
