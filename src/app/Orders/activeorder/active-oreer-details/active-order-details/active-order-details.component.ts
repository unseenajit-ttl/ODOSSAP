import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-active-order-details',
  templateUrl: './active-order-details.component.html',
  styleUrls: ['./active-order-details.component.css'],
})
export class ActiveOrderDetailsComponent implements OnInit {
  @Input() gItem: any;

  OrderDetailsArray: any[] = [];
  loading: boolean = false;
  constructor(public activeModal: NgbActiveModal, private dropdown: CustomerProjectService, private orderService: OrderService, private toastr: ToastrService,) { }

  heading: string = '';
  PoNumber: any;
  productType: string = ''
  ngOnInit(): void {
    debugger
    this.heading = this.gItem?.PONo ? this.gItem?.PONo : '';
    this.PoNumber = this.gItem.PONo;
    this.productType = this.gItem.ProdType
    console.log('Component initialized with item:', this.gItem);
    this.GetOrderDetails()


  }

  GetOrderDetails() {
    this.loading = true;

    this.orderService.GetActiveOrderDetails(this.PoNumber)
      .subscribe({
        next: (response: any) => {
          this.loading = false;

          if (response.status === "NoSORsFound") {
            this.toastr.warning(response.message || "No SORs found for selected PO.");
          }
          else if (response.status === "No Data") {
            this.toastr.warning(response.message || "SORs retrieved, but no details available.");
          }
          else if (response.status === "Success") {
            this.OrderDetailsArray = response.data;
          }
          else {
            this.toastr.warning("Unexpected response received from server.");
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error("Server error occurred. Please try again later.");
          console.error("API error:", error);
        }
      });
  }

}
