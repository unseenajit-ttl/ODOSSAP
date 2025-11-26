import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopybbsofflineComponent } from './copybbsoffline.component';

describe('CopybbsofflineComponent', () => {
  let component: CopybbsofflineComponent;
  let fixture: ComponentFixture<CopybbsofflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopybbsofflineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopybbsofflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
