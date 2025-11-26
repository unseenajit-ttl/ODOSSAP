import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateshapemasterComponent } from './createshapemaster.component';

describe('CreateshapemasterComponent', () => {
  let component: CreateshapemasterComponent;
  let fixture: ComponentFixture<CreateshapemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateshapemasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateshapemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
