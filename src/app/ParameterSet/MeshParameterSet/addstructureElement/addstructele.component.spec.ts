import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddstructeleComponent } from './addstructele.component';

describe('AddstructeleComponent', () => {
  let component: AddstructeleComponent;
  let fixture: ComponentFixture<AddstructeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddstructeleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddstructeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
