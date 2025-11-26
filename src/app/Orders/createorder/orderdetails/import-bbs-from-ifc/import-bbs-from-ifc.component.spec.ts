import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBbsFromIfcComponent } from './import-bbs-from-ifc.component';

describe('ImportBbsFromIfcComponent', () => {
  let component: ImportBbsFromIfcComponent;
  let fixture: ComponentFixture<ImportBbsFromIfcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBbsFromIfcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportBbsFromIfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
