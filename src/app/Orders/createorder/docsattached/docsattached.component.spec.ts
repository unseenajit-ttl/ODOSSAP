import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsattachedComponent } from './docsattached.component';

describe('DocsattachedComponent', () => {
  let component: DocsattachedComponent;
  let fixture: ComponentFixture<DocsattachedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocsattachedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsattachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
