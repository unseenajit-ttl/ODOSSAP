import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneOrderProjectComponent } from './clone-order-project.component';

describe('CloneOrderProjectComponent', () => {
  let component: CloneOrderProjectComponent;
  let fixture: ComponentFixture<CloneOrderProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneOrderProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneOrderProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
