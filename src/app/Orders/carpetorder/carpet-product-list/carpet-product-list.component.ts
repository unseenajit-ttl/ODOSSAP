import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-carpet-product-list',
  templateUrl: './carpet-product-list.component.html',
  styleUrls: ['./carpet-product-list.component.css'],
})
export class CarpetProductListComponent implements OnInit {
  ProductListCarpet: any[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.LoadData();
  }

  LoadData() {
    this.orderService.GetProductListCarpet().subscribe({
      next: (response: any) => {
        this.ProductListCarpet = response;
      },
      error: () => {},
      complete: () => {},
    });
  }

  Cancel() {
    this.modalService.dismissAll();
  }
  ProductListClick(pItem: any) {
    for (var i = 0; i < this.ProductListCarpet.length; i++) {
      let lItem = this.ProductListCarpet[i];
      if (lItem.backgroundColor != false) {
        lItem.backgroundColor = false;
      }
    }
    pItem.backgroundColor = true;
    // e.style.backgroundColor = 'rgb(0, 255, 0)';
  }
}
