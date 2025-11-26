import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnLinkMeshProductListModalComponent } from './column-link-mesh-product-list-modal.component';

describe('ColumnLinkMeshProductListModalComponent', () => {
  let component: ColumnLinkMeshProductListModalComponent;
  let fixture: ComponentFixture<ColumnLinkMeshProductListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnLinkMeshProductListModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnLinkMeshProductListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
