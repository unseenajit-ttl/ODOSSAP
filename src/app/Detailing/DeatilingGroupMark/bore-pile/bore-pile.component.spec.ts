import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorePileComponent } from './bore-pile.component';

describe('BorePileComponent', () => {
  let component: BorePileComponent;
  let fixture: ComponentFixture<BorePileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorePileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorePileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
