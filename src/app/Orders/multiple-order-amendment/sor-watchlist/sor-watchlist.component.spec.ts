import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SORWatchlistComponent } from './sor-watchlist.component';

describe('SORWatchlistComponent', () => {
  let component: SORWatchlistComponent;
  let fixture: ComponentFixture<SORWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SORWatchlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SORWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
