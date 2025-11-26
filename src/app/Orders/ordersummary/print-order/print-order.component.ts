import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {
  ProcessOrderLoading: boolean = false;
  @Input() OrderNumber:any;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private orderService: OrderService
  ) {

  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  PrintOrderDetails() {
    console.log('print Order details')
  }
  PrintOrderSummary() {
    console.log('print Order summary')
  }

  downloadOrderDetails() {

    for(let i=0;i<this.OrderNumber.length;i++){
     // let pOrderNumber = 296951;
     let pOrderNumber = this.OrderNumber[i];

      //LOADING START
      this.ProcessOrderLoading = true;
  
      // let ProjectCode=this.selectedRow[0].ProjectCode;
      // let JobID=this.selectedRow[0].JobID;
      this.orderService.showdirCreate(pOrderNumber).subscribe({
        next: (data) => {
  
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Report-' +  '.pdf';
          a.click();
  
          window.open(url, '_blank'); // Opens the PDF in a new tab
  
          // this.StandardBarProductOrderLoading = false;
          this.ProcessOrderLoading = false;
        },
        error: (e) => {
          this.ProcessOrderLoading = false;
          alert('Order printing failed, please check the Internet connection and try again.')
        },
        complete: () => {
        },
      });
    }
    
  }

  downloadOrderSummary() {

    for(let i=0;i<this.OrderNumber.length;i++){
      // let pOrderNumber = 296951;
      let pOrderNumber = this.OrderNumber[i];
 

    //LOADING START
    this.ProcessOrderLoading = true;

    // let ProjectCode=this.selectedRow[0].ProjectCode;
    // let JobID=this.selectedRow[0].JobID;
    this.orderService.showdirCreateSummary(pOrderNumber).subscribe({
      next: (data) => {

        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Report-' +  '.pdf';
        a.click();

        window.open(url, '_blank'); // Opens the PDF in a new tab

        // this.StandardBarProductOrderLoading = false;
        this.ProcessOrderLoading = false;
      },
      error: (e) => {
        this.ProcessOrderLoading = false;
        alert('Order printing failed, please check the Internet connection and try again.')
      },
      complete: () => {
      },
    });
    }
  }
  
}
