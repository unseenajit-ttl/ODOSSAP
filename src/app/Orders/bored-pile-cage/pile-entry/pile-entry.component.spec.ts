import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PileEntryComponent } from './pile-entry.component';

describe('PileEntryComponent', () => {
  let component: PileEntryComponent;
  let fixture: ComponentFixture<PileEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PileEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PileEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
