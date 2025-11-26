import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtsmeshprcComponent } from './ctsmeshprc.component';

describe('CtsmeshprcComponent', () => {
  let component: CtsmeshprcComponent;
  let fixture: ComponentFixture<CtsmeshprcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtsmeshprcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtsmeshprcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
