import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';

@Component({
  selector: 'app-bar-details-info',
  templateUrl: './bar-details-info.component.html',
  styleUrls: ['./bar-details-info.component.css']
})
export class BarDetailsInfoComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {

  }
  Cancel() {
    this.modalService.dismissAll()
  }
}
