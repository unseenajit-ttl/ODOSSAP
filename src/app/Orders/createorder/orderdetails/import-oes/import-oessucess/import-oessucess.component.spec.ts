import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOESSucessComponent } from './import-oessucess.component';

describe('ImportOESSucessComponent', () => {
  let component: ImportOESSucessComponent;
  let fixture: ComponentFixture<ImportOESSucessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportOESSucessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportOESSucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
