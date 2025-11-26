import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { CreateordersharedserviceService } from '../../createorder/createorderSharedservice/createordersharedservice.service';

@Component({
  selector: 'app-print-bbsorder',
  templateUrl: './print-bbsorder.component.html',
  styleUrls: ['./print-bbsorder.component.css']
})
export class PrintBBSOrderComponent implements OnInit{
   ProcessOrderLoading: boolean = false;
    @Input() OrderNumber:any;
    @Input() CABJobID: any;
    CustomerCode: any = this.dropdown.getCustomerCode();
    ProjectCode: any = this.dropdown.getProjectCode()[0];
    JobID : any;
    orderDetailsTable: any[] = [];
    BBSData_Local: any[] = [];
    OrderdetailsLoading: boolean = true;
    receivedData: any;
    orderDetailsList:any;
    constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private orderService: OrderService,
       private dropdown: CustomerProjectService,
        private createSharedService: CreateordersharedserviceService,
    ) {
  
    }
    async ngOnInit() {
      debugger;
      if (localStorage.getItem('sideMenuVisible')) {
        // this.sideMenuVisible = parseInt(localStorage.getItem('sideMenuVisible')!);
      }
      // this.commonService.changeTitle('Order Details | ODOS');
      
  
      this.receivedData = localStorage.getItem('ProcessData');
      this.receivedData = JSON.parse(this.receivedData);
      console.log('receivedData', this.receivedData);
  
      // Set OderSummaryList Data from local Storage and remove item from local Storage.
      let lData: any = localStorage.getItem('ProcessOrderSummaryData');
      lData = JSON.parse(lData);
      
      if (this.receivedData) {
        this.CustomerCode = this.receivedData.customer;
        this.ProjectCode = this.receivedData.project;
        this.JobID = this.CABJobID;
      } else {
        this.JobID = this.createSharedService.JobIds.CABJOBID;
      }
  
      //assigning values from ""OrderSummary"" page
      if (this.createSharedService.selectedrecord) {
        this.CustomerCode = this.dropdown.getCustomerCode();
        this.ProjectCode = this.dropdown.getProjectCode()[0];
      
        if (this.createSharedService.JobIds) {
          this.JobID = this.createSharedService.JobIds.CABJOBID;
          // this.JobAdviceData.JobID = this.JobID;
        }
      } else {
        this.dropdown.setCustomerCode(this.receivedData.customer);
        let obj: any = [];
        obj.push(this.receivedData.project);
        this.dropdown.setProjectCode(obj);
        // this.reloadService.reloadCreateOrderCustomerProject.emit();
  
        // If Roted from process, then update order summary data
        // await this.SetCreateDatainLocal(this.OrderNumber);
      }
  
      
    }

    GetBBSOrder(CustomerCode: any, ProjectCode: any, JobID: any) {
      debugger;
      this.OrderdetailsLoading = true;
      let obj = {
        CustomerCode: CustomerCode,
        ProjectCode: ProjectCode,
        JobID: JobID,
      };
      this.orderService.getBBSOrder(obj).subscribe({
        next: (response) => {
          this.orderDetailsList = response;
  
          console.log('orderDetailsTable', response);
  
          this.orderDetailsTable = [];
  
          // this.index = response.length;
          // this.currentCharacter = 'A';
          // this.currentCharacterIndex = 0;
  
          for (let i = 0; i < response.length; i++) {
            let obj = {
              SNo: i + 1,
              StructureElement: response[i].BBSStrucElem,
              BBSID: response[i].BBSID,
              BBSNo: response[i].BBSNo,
              BBSDescription: response[i].BBSDesc,
              CABWeight: response[i].BBSOrderCABWT,
              SBWeight: response[i].BBSOrderSTDWT,
              OrderWeight:
                Math.round(
                  (Number(response[i].BBSOrderCABWT) +
                    Number(response[i].BBSOrderSTDWT)) *
                    1000
                ) / 1000,
              CancelledWT: response[i].BBSCancelledWT,
              TotalWeight: response[i].BBSTotalWT,
            };
            this.orderDetailsTable.push(obj);
          }
          if (response.length == 1 && response[0].BBSNo == '0') {
            this.orderDetailsTable[0].BBSNo = 'BBS' + response[0].JobID;
            this.orderDetailsList[0].BBSNo = 'BBS' + response[0].JobID;
            // this.SaveBBS(this.orderDetailsList[0]);
          } else {
            this.checkBBSDuplicate();
          }
          this.OrderdetailsLoading = false;
          // Background call to save table data locally.
          this.SaveTableData_Local();
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
    }

    async checkBBSDuplicate() {
    }
    isEditible() {
    }
    SaveTableData_Local() {
      let CustomerCode = this.CustomerCode;
      let ProjectCode = this.ProjectCode;
      let JobID = this.JobID;
      this.BBSData_Local = [];
  
      for (let i = 0; i < this.orderDetailsTable.length; i++) {
        let BBSID = this.orderDetailsTable[i].BBSID;
        this.orderService
          .GetBarDetails(CustomerCode, ProjectCode, JobID, BBSID)
          .subscribe({
            next: (response) => {
              console.log('GetBarDetails', response);
              if (response) {
                let lObj = {
                  lBBSID: response[0].BBSID,
                  lBBSData: response,
                };
  
                let lIndex = this.BBSData_Local.findIndex(
                  (x) => x.lBBSID === lObj.lBBSID
                );
                if (lIndex != -1) {
                  this.BBSData_Local[lIndex] = lObj;
                } else {
                  this.BBSData_Local.push(lObj);
                }
              }
            },
            error: (e) => {},
            complete: () => {},
          });
      }
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


    PrintBBSDetails(id:number) {

      this.activeModal.close(id);

      // let CustomerCode = this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
      // let ProjectCode = this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
      // let JobID = this.JobID; //735 ;//this.selectedRow[0].JobID;
      
      // debugger
      // this.GetBBSOrder(CustomerCode, ProjectCode,this.JobID)
    
      // this.OrderdetailsLoading = true;
      // this.orderService
      //   .showdirPrintOrder(CustomerCode, ProjectCode, JobID,id)
      //   .subscribe({
      //     next: (data) => {
      //       const blob = new Blob([data], { type: 'application/pdf' });
      //       const url = window.URL.createObjectURL(blob);
      //       const a = document.createElement('a');
      //       a.href = url;
      //       a.download = 'CAB-' + this.orderDetailsTable[0].BBSNo + '.pdf';
      //       a.click();
  
      //       window.open(url, '_blank'); // Opens the PDF in a new tab
  
      //       // this.StandardBarProductOrderLoading = false;
      //       // this.ProcessOrderLoading = false;
      //       this.OrderdetailsLoading = false;
      //     },
      //     error: (e) => {
      //       //this.ProcessOrderLoading = false;
      //       alert(
      //         'Order printing failed, please check the Internet connection and try again.'
      //       );
      //     },
      //     complete: () => {},
      //   });
    }

}
