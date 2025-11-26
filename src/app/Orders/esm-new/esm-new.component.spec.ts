import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsmNewComponent } from './esm-new.component';

describe('EsmNewComponent', () => {
  let component: EsmNewComponent;
  let fixture: ComponentFixture<EsmNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsmNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsmNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
