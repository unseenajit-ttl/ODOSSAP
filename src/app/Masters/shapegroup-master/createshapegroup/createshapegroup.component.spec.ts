import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateshapegroupComponent } from './createshapegroup.component';

describe('CreateshapegroupComponent', () => {
  let component: CreateshapegroupComponent;
  let fixture: ComponentFixture<CreateshapegroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateshapegroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateshapegroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
