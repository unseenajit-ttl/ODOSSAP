import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensioningRuleComponent } from './dimensioning-rule.component';

describe('DimensioningRuleComponent', () => {
  let component: DimensioningRuleComponent;
  let fixture: ComponentFixture<DimensioningRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimensioningRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimensioningRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
