import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';

@Component({
  selector: 'app-import-bbs-from-ifc',
  templateUrl: './import-bbs-from-ifc.component.html',
  styleUrls: ['./import-bbs-from-ifc.component.css']
})
export class ImportBbsFromIfcComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {

  }
  Import() {

  }
  Cancel() {
    this.modalService.dismissAll()
  }
}
