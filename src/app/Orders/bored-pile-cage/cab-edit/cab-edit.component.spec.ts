import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPCCabEditComponent } from './cab-edit.component';

describe('BPCCabEditComponent', () => {
  let component: BPCCabEditComponent;
  let fixture: ComponentFixture<BPCCabEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPCCabEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPCCabEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
