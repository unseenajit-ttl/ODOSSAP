import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMarkComponent } from './addgroupmark.component';

describe('GroupMarkComponent', () => {
  let component: GroupMarkComponent;
  let fixture: ComponentFixture<GroupMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
