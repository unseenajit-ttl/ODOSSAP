import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonProjectComponent } from './non-project.component';

describe('NonProjectComponent', () => {
  let component: NonProjectComponent;
  let fixture: ComponentFixture<NonProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
