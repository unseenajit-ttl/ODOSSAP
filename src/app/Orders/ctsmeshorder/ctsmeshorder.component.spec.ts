import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtsmeshorderComponent } from './ctsmeshorder.component';

describe('CtsmeshorderComponent', () => {
  let component: CtsmeshorderComponent;
  let fixture: ComponentFixture<CtsmeshorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtsmeshorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtsmeshorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
