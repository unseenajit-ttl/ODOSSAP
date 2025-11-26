import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWbsComponent } from './create-wbs.component';

describe('CreateWbsComponent', () => {
  let component: CreateWbsComponent;
  let fixture: ComponentFixture<CreateWbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
