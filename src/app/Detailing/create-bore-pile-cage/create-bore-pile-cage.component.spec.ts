import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBorePileCageComponent } from './create-bore-pile-cage.component';

describe('CreateBorePileCageComponent', () => {
  let component: CreateBorePileCageComponent;
  let fixture: ComponentFixture<CreateBorePileCageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBorePileCageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBorePileCageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
