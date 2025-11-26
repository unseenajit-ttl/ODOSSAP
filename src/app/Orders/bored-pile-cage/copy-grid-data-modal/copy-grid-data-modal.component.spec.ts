import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyGridDataModalComponent } from './copy-grid-data-modal.component';

describe('CopyGridDataModalComponent', () => {
  let component: CopyGridDataModalComponent;
  let fixture: ComponentFixture<CopyGridDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyGridDataModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyGridDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
