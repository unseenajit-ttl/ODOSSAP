import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOesComponent } from './import-oes.component';

describe('ImportOesComponent', () => {
  let component: ImportOesComponent;
  let fixture: ComponentFixture<ImportOesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportOesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportOesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
