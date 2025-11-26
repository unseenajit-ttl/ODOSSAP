import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeamprcComponent } from './beamprc.component';

describe('BeamprcComponent', () => {
  let component: BeamprcComponent;
  let fixture: ComponentFixture<BeamprcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeamprcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeamprcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
