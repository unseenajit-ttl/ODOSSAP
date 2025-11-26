import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';

@Component({
  selector: 'app-create-shape',
  templateUrl: './create-shape.component.html',
  styleUrls: ['./create-shape.component.css']
})
export class CreateShapeComponent implements OnInit {
  fileSelected: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  Cancel() {
    this.modalService.dismissAll()
  }
}
