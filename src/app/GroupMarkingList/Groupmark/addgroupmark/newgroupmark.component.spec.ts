import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGroupMarkComponent } from './newgroupmark.component';

describe('NewGroupMarkComponent', () => {
  let component: NewGroupMarkComponent;
  let fixture: ComponentFixture<NewGroupMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGroupMarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewGroupMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
