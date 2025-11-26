import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtsmeshComponent } from './ctsmesh.component';

describe('CtsmeshComponent', () => {
  let component: CtsmeshComponent;
  let fixture: ComponentFixture<CtsmeshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtsmeshComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtsmeshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
