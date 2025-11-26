import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../orders.service';
import { OrderDetailsForCab } from 'src/app/Model/orderdetailsforcab';

@Component({
  selector: 'app-orderdetailsproduct',
  templateUrl: './orderdetailsproduct.component.html',
  styleUrls: ['./orderdetailsproduct.component.css']
})
export class OrderdetailsproductComponent {
  @Input() customerCode: any;
  @Input() projectCode: any;
  @Input() JobID: any;
  @Input() OrderSource:any
  @Input() structureElement:any
  @Input() productType:any
  @Input() ScheduledProd:any
  CabOrderDetails:any;
  constructor(public activeModal: NgbActiveModal,
    private orderService: OrderService,private modalService: NgbModal) {
      
     }

  ngOnInit(): void {
    debugger

    this.GetOrderProductForCABPOPUP()

  }

  GetOrderProductForCABPOPUP(): void {
    debugger;
    let obj: OrderDetailsForCab = {
      CustomerCode: this.customerCode,
      ProjectCode: this.projectCode,
      JobID: 209,
      OrderSource: '',
      StructureElement:this.structureElement,
      ProductType: this.productType,
      ScheduledProd: 'N'
    }
    this.orderService.OrderDetailsForCABPOPUP(obj).subscribe({
      next: (response) => {
        console.log("response", response);
        this.CabOrderDetails=response;
      },
      error: (e) => {
      },
      complete: () => {

      },
    });

  }
}

