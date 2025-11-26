import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDrawRepoComponent } from './search-draw-repo.component';

describe('SearchDrawRepoComponent', () => {
  let component: SearchDrawRepoComponent;
  let fixture: ComponentFixture<SearchDrawRepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDrawRepoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDrawRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
