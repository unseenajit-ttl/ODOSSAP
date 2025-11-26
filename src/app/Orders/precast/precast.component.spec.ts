import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecastComponent } from './precast.component';

describe('PrecastComponent', () => {
  let component: PrecastComponent;
  let fixture: ComponentFixture<PrecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
