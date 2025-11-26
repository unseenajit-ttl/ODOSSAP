import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESMCabComponent } from './esmcab.component';

describe('ESMCabComponent', () => {
  let component: ESMCabComponent;
  let fixture: ComponentFixture<ESMCabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESMCabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESMCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
