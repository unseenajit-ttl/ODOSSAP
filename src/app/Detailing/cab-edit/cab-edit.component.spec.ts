import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabEditComponent } from './cab-edit.component';

describe('CabEditComponent', () => {
  let component: CabEditComponent;
  let fixture: ComponentFixture<CabEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
