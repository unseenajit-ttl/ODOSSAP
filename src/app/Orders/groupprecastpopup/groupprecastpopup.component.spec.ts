import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupprecastpopupComponent } from './groupprecastpopup.component';

describe('GroupprecastpopupComponent', () => {
  let component: GroupprecastpopupComponent;
  let fixture: ComponentFixture<GroupprecastpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupprecastpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupprecastpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
