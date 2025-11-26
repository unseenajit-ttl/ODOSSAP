import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { LoginService } from 'src/app/services/login.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { CreateordersharedserviceService } from '../../createorder/createorderSharedservice/createordersharedservice.service';

@Component({
  selector: 'app-clone-order',
  templateUrl: './clone-order.component.html',
  styleUrls: ['./clone-order.component.css'],
})
export class CloneOrderComponent implements OnInit {
  projectList: any;
  newprojectCode: any;
  numofClones: any;

  CloneLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private createSharedService: CreateordersharedserviceService,
    private loginService: LoginService
  ) {}
  ngOnInit(): void {
    //this.dragElement(document.getElementById('mydiv'));
    this.GetOrderProjectsList(this.dropdown.getCustomerCode());
  }

  GetOrderProjectsList(customerCode: any): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();

    this.orderService
      .GetProjects(customerCode, pUserType, pGroupName)
      .subscribe({
        next: (response) => {
          this.projectList = response;
          /**
           * Select a default value for the dropdowns.
           */
          if (response) {
            if (this.dropdown.getProjectCode()[0]) {
              this.newprojectCode = this.dropdown.getProjectCode()[0];
            }
            this.numofClones = 1;
          }
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  GetOrderClone(): void {
    debugger;
    if (this.numOfClonesValidation(this.numofClones)) {
      let CustomerCode = this.dropdown.getCustomerCode();
      let sProjectCode = this.dropdown.getProjectCode()[0];
      let dProjectCode = this.newprojectCode;
      let OrderNo = this.createSharedService.selectedOrderNumber;
      let CloneNo = Number(this.numofClones);
      this.CloneLoading = true;
      this.orderService
        .OrderClone(CustomerCode, sProjectCode, dProjectCode, OrderNo, CloneNo)
        .subscribe({
          next: (response) => {
            console.log('response', response);
            alert(
              this.numofClones +
                ' orders have been cloned successfully. \n(' +
                this.numofClones +
                '个订单已成功克隆)'
            );
            this.CloneLoading = false;
          },
          error: (e) => {
            this.CloneLoading = false;
          },
          complete: () => {
            this.CloneLoading = false;
            this.modalService.dismissAll();
          },
        });
    }
  }
  numOfClonesValidation(num: number): boolean {
    if (num == null || isNaN(num)) {
      alert('Invalid number of orders to be copied. (无效的订单克隆数目)');
      return false;
    }
    if (num > 100) {
      alert('The maximum munber of copy is 100. (最大的订单克隆数目为100)');
      return false;
    }
    if (num == 0) {
      alert('Invalid number of orders to be copied. (无效的订单克隆数目)');
      return false;
    }
    if (this.newprojectCode == '' || this.newprojectCode == undefined) {
      alert('Invalid project selected. (选择了无效的工程项目)');
      return false;
    }
    return true;
  }

  cancel() {
    this.activeModal.close({ event: 'close', isConfirm: false });
    this.modalService.dismissAll();
  }
}
