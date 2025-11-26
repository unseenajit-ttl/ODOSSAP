import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapPostingComponent } from './capposting.component';

describe('CapPostingComponent', () => {
  let component: CapPostingComponent;
  let fixture: ComponentFixture<CapPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapPostingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
