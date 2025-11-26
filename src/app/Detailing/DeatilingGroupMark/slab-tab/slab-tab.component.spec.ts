import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabTabComponent } from './slab-tab.component';

describe('SlabTabComponent', () => {
  let component: SlabTabComponent;
  let fixture: ComponentFixture<SlabTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlabTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
