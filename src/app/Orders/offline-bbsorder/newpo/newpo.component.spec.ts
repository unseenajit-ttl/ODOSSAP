import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpoComponent } from './newpo.component';

describe('NewpoComponent', () => {
  let component: NewpoComponent;
  let fixture: ComponentFixture<NewpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
