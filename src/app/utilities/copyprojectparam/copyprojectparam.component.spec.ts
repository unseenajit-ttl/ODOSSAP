import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyprojectparamComponent } from './copyprojectparam.component';

describe('CopyprojectparamComponent', () => {
  let component: CopyprojectparamComponent;
  let fixture: ComponentFixture<CopyprojectparamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyprojectparamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyprojectparamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
