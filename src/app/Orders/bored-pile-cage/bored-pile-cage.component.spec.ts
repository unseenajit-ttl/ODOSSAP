import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoredPileCageComponent } from './bored-pile-cage.component';

describe('BoredPileCageComponent', () => {
  let component: BoredPileCageComponent;
  let fixture: ComponentFixture<BoredPileCageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoredPileCageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoredPileCageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
