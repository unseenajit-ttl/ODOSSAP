import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardmeshorderComponent } from './standardmeshorder.component';

describe('StandardmeshorderComponent', () => {
  let component: StandardmeshorderComponent;
  let fixture: ComponentFixture<StandardmeshorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardmeshorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardmeshorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
