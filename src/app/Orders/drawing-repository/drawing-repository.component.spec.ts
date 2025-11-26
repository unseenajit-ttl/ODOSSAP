import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingRepositoryComponent } from './drawing-repository.component';

describe('DrawingRepositoryComponent', () => {
  let component: DrawingRepositoryComponent;
  let fixture: ComponentFixture<DrawingRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
