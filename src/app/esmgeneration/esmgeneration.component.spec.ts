import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsmgenerationComponent } from './esmgeneration.component';

describe('EsmgenerationComponent', () => {
  let component: EsmgenerationComponent;
  let fixture: ComponentFixture<EsmgenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsmgenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsmgenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
