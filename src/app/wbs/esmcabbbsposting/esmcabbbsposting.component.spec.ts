import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESMCABBBSPostingComponent } from './esmcabbbsposting.component';

describe('ESMCABBBSPostingComponent', () => {
  let component: ESMCABBBSPostingComponent;
  let fixture: ComponentFixture<ESMCABBBSPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESMCABBBSPostingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESMCABBBSPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
