import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingbpcDetailingComponent } from './pendingbpc-detailing.component';

describe('PendingbpcDetailingComponent', () => {
  let component: PendingbpcDetailingComponent;
  let fixture: ComponentFixture<PendingbpcDetailingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingbpcDetailingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingbpcDetailingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
