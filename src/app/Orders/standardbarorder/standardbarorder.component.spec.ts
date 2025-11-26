import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardbarorderComponent } from './standardbarorder.component';

describe('StandardbarorderComponent', () => {
  let component: StandardbarorderComponent;
  let fixture: ComponentFixture<StandardbarorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardbarorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardbarorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
