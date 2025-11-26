import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapegroupMasterComponent } from './shapegroup-master.component';

describe('ShapegroupMasterComponent', () => {
  let component: ShapegroupMasterComponent;
  let fixture: ComponentFixture<ShapegroupMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapegroupMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapegroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
