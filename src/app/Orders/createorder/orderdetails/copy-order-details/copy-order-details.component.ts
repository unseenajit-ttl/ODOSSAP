import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CopyBBSModel } from 'src/app/Model/CopyBBSModel';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-copy-order-details',
  templateUrl: './copy-order-details.component.html',
  styleUrls: ['./copy-order-details.component.css'],
})
export class CopyOrderDetailsComponent implements OnInit{
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();


  ProjectList: any[] = [];
  OrderList: any[] = [];
  orderBBSList: any[] = [];
  CustomerCode: string = '';
  ProjectCode: string = '';
  Orders: string = '';
  CustomerList: any[] = [];
  JobId: any = '';
  Ordersddl: any;
  BBSddl: any;
  SourceOrderNo: any;
  DesJobId: any;
  DesBBSId: any;
  DesOrderNumber: any;

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal,
    private loginService: LoginService
  ) { }
  ngOnInit(): void {
    let receivedData: any = localStorage.getItem('CopyOrderDetails');
    
    receivedData = JSON.parse(receivedData);
    if (receivedData) {
      this.JobId = receivedData.Jobids;
      this.DesJobId = receivedData.Jobids;
      this.DesBBSId = receivedData.BBSId;
      this.DesOrderNumber = receivedData.OrderNumber;
    }
    localStorage.removeItem('CopyOrderDetails');

    this.GetProjects();
    this.get_CopyBBSOrderListOrder();
    this.GetBBSOrder();
    this.GetCustomer();
    this.dragElement(document.getElementById("mydiv1"));
  }

  onProjectChange() {
    this.get_CopyBBSOrderListOrder();
  }
  OnOrderChange() {
    console.log('Selected Order', this.Ordersddl);
    this.JobId = this.Ordersddl.JobID;
    this.SourceOrderNo = this.Ordersddl.OrderNumber
    this.GetBBSOrder();
  }

  GetCustomer() {
    debugger;
    // CustomerCode: this.dropdown.getCustomerCode();
    let CustomerCode = this.dropdown.getCustomerCode();
    let UserName=this.loginService.GetGroupName();
    this.orderService.getCustomerOrder(CustomerCode,UserName).subscribe({
      next: (response) => {
        console.log('CustomerList', response);
        this.CustomerList = response;
        if (response) {
          this.CustomerCode = response[0].Value;
        }
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  GetProjects() {
    let CustomerCode = this.dropdown.getCustomerCode();
    this.orderService.getProjectsOrder(CustomerCode).subscribe({
      next: (response) => {
        console.log('ProjectList', response);
        this.ProjectList = response;
        if (response) {
          let index = response.findIndex(
            (x: { ProjectCode: any }) =>
              x.ProjectCode == this.dropdown.getProjectCode()[0]
          );

          if (index != -1) {
            this.ProjectCode = response[index].ProjectCode;
          } else {
            this.ProjectCode = response[0].ProjectCode;
          }
        }
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  get_CopyBBSOrderListOrder() {
    let CustomerCode = this.CustomerCode
      ? this.CustomerCode
      : this.dropdown.getCustomerCode();
    let ProjectCode = this.ProjectCode
      ? this.ProjectCode
      : this.dropdown.getProjectCode()[0];
    this.orderService
      .getCopyBBSOrderListOrder(CustomerCode, ProjectCode)
      .subscribe({
        next: (response) => {
          debugger;
          console.log('getCopyBBSOrderListOrder', response);
          this.OrderList = response;
          if (response) {
            this.Orders = response[0].OrderNumber;
            this.Ordersddl=response[0];
            this.OnOrderChange();
          }
        },
        error: (e) => { },
        complete: () => {
          // this.loading = false;
        },
      });
  }

  GetBBSOrder() {
    //this.OrderdetailsLoading = true;
    let obj = {
      CustomerCode: this.CustomerCode
        ? this.CustomerCode
        : this.dropdown.getCustomerCode(),
      ProjectCode: this.ProjectCode
        ? this.ProjectCode
        : this.dropdown.getProjectCode()[0],
      JobID: this.JobId,
    };

    this.orderService.getBBSOrder(obj).subscribe({
      next: (response) => {
        this.orderBBSList = response;
        if(response){
          if(this.Ordersddl){
            this.BBSddl=response[0];
          }
        }
        console.log('BBS', response);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  CopyOrder() {
    //this.OrderdetailsLoading = true;
    let obj: CopyBBSModel = {
      SourceCustomerCode: this.CustomerCode,
      SourceProjectCode: this.ProjectCode,
      SourceOrderNo: Number(this.JobId),
      SourceBBSID: Number(this.BBSddl.BBSID),
      DesCustomerCode: this.dropdown.getCustomerCode(),
      DesProjectCode: this.dropdown.getProjectCode()[0],
      DesOrderNo: Number(this.DesJobId),
      DesBBSID: Number(this.DesBBSId),
      DesBarCount: 0,
      UpdateBy:this.loginService.GetGroupName()
    };
    this.orderService.CopyOrders(obj).subscribe({
      next: (response) => {
        console.log('Copy BBS ->', response);
        if (response) {
          alert('Copy BBS is completed sucessfully. (钢筋加工表已成功复制完毕.)');
          this.saveTrigger.emit()
          this.modalService.dismissAll()
        }
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  Cancel() {
    this.modalService.dismissAll()
  }

  // DeleteOrder(
  //   CustomerCode: any,
  //   ProjectCode: any,
  //   JobID: any,
  //   BBSID: any,
  //   BarsCount: any
  // ) {
  //   //this.OrderdetailsLoading = true;
  //   let obj = {
  //     SourceCustomerCode: '0001101688',
  //     SourceProjectCode: '0000112837',
  //     SourceOrderNo: 209,
  //     SourceBBSID: '',
  //     DesCustomerCode: '',
  //     DesProjectCode: '',
  //     DesOrderNo: '',
  //     DesBBSID: '',
  //     DesBarCount: '',
  //   };
  //   this.orderService.CopyOrders(obj).subscribe({
  //     next: (response) => {
  //       this.orderBBSList = response;
  //       console.log(response);
  //     },
  //     error: (e) => { },
  //     complete: () => {
  //       // this.loading = false;
  //     },
  //   });
  // }

  dragElement(elmnt: any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header")!.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
