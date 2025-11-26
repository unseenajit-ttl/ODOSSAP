import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { CreateordersharedserviceService } from '../../createorder/createorderSharedservice/createordersharedservice.service';
import { LoginService } from 'src/app/services/login.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-clone-order-project',
  templateUrl: './clone-order-project.component.html',
  styleUrls: ['./clone-order-project.component.css'],
})
export class CloneOrderProjectComponent {
  projectList: any[] = [];
  newprojectCode: any;
  numofClones: any;

  @Input() WBS: any;
  @Input() ScheduledProd: any;
  @Input() StructureElement: any;
  @Input() Product: any;
  @Input() OrderNumber: any;

  // StructureElementList: any[] = [];

  StructureElementList: any[] = [
    'BEAM',
    'COLUMN',
    'SLAB',
    'SLAB-B',
    'SLAB-T',
    'DWALL',
    'PLIE',
    'WALL',
  ];

  DATAENTRY = [
    { statusId: 3, status: 'Beam' },
    { statusId: 6, status: 'Column' },
    { statusId: 12, status: 'Slab' },
    { statusId: 13, status: 'Slab-B' },
    { statusId: 14, status: 'Slab-T' },
    { statusId: 15, status: 'Dwall' },
    { statusId: 16, status: 'Pile' },
    { statusId: 17, status: 'Wall' },
  ];

  wbs1list: any[] = [];
  wbs2list: any[] = [];
  wbs3list: any[] = [];

  wbs1: any = '';
  wbs2: any = '';
  wbs2from: any = '';
  wbs3: any[] = [];

  WBS1O: any = '';
  WBS2O: any = '';
  WBS3O: any = '';

  CloneNumber: number = 0;
  CloneLoading: boolean = false;

  SelectAllWbs3: boolean = false;

  WBSDisplay!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private dropdown: CustomerProjectService,
    private createSharedService: CreateordersharedserviceService,
    private loginService: LoginService
  ) {
    this.WBSDisplay = this.formBuilder.group({
      wbs3: new FormControl([]),
    });
  }
  ngOnInit(): void {
    //this.dragElement(document.getElementById('mydiv'));
    console.log('WBS -> ', this.WBS);
    console.log('ScheduledProd -> ', this.ScheduledProd);

    this.wbs1 = this.WBS[0].split('/')[0];
    this.wbs1 = this.wbs1 ? this.wbs1.trim() : this.wbs1;
    this.wbs2 = this.WBS[0].split('/')[1];
    this.wbs2 = this.wbs2 ? this.wbs2.trim() : this.wbs2;
    this.wbs2from = this.WBS[0].split('/')[1];
    this.wbs2from = this.wbs2from ? this.wbs2from.trim() : this.wbs2from;
    this.wbs3.push(this.WBS[0].split('/')[2]);

    this.WBS1O = this.WBS[0].split('/')[0];
    this.WBS1O = this.WBS1O ? this.WBS1O.trim() : this.WBS1O;
    this.WBS2O = this.WBS[0].split('/')[1];
    this.WBS2O = this.WBS2O ? this.WBS2O.trim() : this.WBS2O;
    this.WBS3O = this.WBS[0].split('/')[2];
    this.WBS3O = this.WBS3O ? this.WBS3O.trim() : this.WBS3O;

    this.newprojectCode = this.dropdown.getProjectCode()[0];

    this.GetOrderProjectsList(this.dropdown.getCustomerCode());
    this.GetWBS1Start();
    this.GetProductListData();
  }

  GetOrderProjectsList(customerCode: any): void {
    this.CloneLoading = true;
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();

    this.orderService
      .GetProjects(customerCode, pUserType, pGroupName)
      .subscribe({
        next: (response) => {
          this.projectList = response;
        },
        error: (e) => {},
        complete: () => {
          this.CloneLoading = false;
          // this.loading = false;
        },
      });
  }

  async GetOrderClone() {
    debugger;
    for (let x = 0; x < this.OrderNumber.length; x++) {
      if (this.numOfClonesValidation(this.numofClones)) {
        let CustomerCode = this.dropdown.getCustomerCode();
        let sProjectCode = this.dropdown.getProjectCode()[0];
        let dProjectCode = this.newprojectCode;
        let OrderNo = this.OrderNumber[x];
        let CloneNo = Number(this.numofClones);

        this.orderService
          .OrderClone(
            CustomerCode,
            sProjectCode,
            dProjectCode,
            OrderNo,
            CloneNo
          )
          .subscribe({
            next: (response) => {
              console.log('response', response);
              alert(
                this.numofClones +
                  ' orders have been cloned successfully. \n(' +
                  this.numofClones +
                  '个订单已成功克隆)'
              );
            },
            error: (e) => {},
            complete: () => {
              this.modalService.dismissAll();
            },
          });
      }
    }
  }

  GetWBS1Start() {
    debugger;
    let ProjectCode = this.newprojectCode;
    let WBS1 = 'null'; //this.dropdown.getProjectCode()[0]
    let WBS2 = 'null'; //this.newprojectCode
    this.CloneLoading = true;
    this.orderService.GetWBS1ForProject(ProjectCode, WBS1, WBS2).subscribe({
      next: (response) => {
        console.log('wbs1list', response);
        this.wbs1list = response.WBS1;
        this.wbs1 = this.WBS1O;
        this.wbs2 = '';
        this.wbs2from = '';
        this.wbs3 = [];
        // alert(this.numofClones + " orders have been cloned successfully. \n(" + this.numofClones + "个订单已成功克隆)");
      },
      error: (e) => {},
      complete: () => {
        this.CloneLoading = false;
        // this.modalService.dismissAll()

        if (this.wbs1) {
          this.GetWBS2Start();
        }
      },
    });
  }

  GetWBS2Start(): void {
    debugger;

    let ProjectCode = this.newprojectCode; //this.dropdown.getCustomerCode()
    let WBS1 = this.wbs1; //this.dropdown.getProjectCode()[0]
    let WBS2 = 'null'; //this.newprojectCode
    this.wbs2 = '';
    this.wbs2from = '';
    this.CloneLoading = true;
    this.orderService.GetWBS2ForProject(ProjectCode, WBS1, WBS2).subscribe({
      next: (response) => {
        console.log('wbs2list', response);
        this.wbs2list = response.WBS2;
        // this.wbs3list = response.WBS3;
        this.wbs2 = this.WBS2O;
        this.wbs2from = this.WBS2O;
        this.wbs3 = [];
        // alert(this.numofClones + " orders have been cloned successfully. \n(" + this.numofClones + "个订单已成功克隆)");
      },
      error: (e) => {},
      complete: () => {
        this.CloneLoading = false;
        if (this.wbs2) {
          this.GetWBS3Start();
        }
      },
    });
  }

  GetWBS3Start() {
    debugger;

    let WBS1O = this.WBS1O ? this.WBS1O.trim() : this.WBS1O;
    let WBS2O = this.WBS2O ? this.WBS2O.trim() : this.WBS2O;
    let WBS3O = this.WBS3O ? this.WBS3O.trim() : this.WBS3O;

    let ProjectCode = this.newprojectCode;
    let WBS1 = this.wbs1 ? this.wbs1.trim() : this.wbs1;
    let WBS2TO = this.wbs2 ? this.wbs2.trim() : this.wbs2;
    let WBS2FR = this.wbs2from ? this.wbs2from.trim() : this.wbs2from;

    let ScheduledProd = this.ScheduledProd;
    let obj: any = {
      StructureEle: this.StructureElement,
      ProductType: this.Product,
      ProjectCode: ProjectCode,
      WBS1O: WBS1O,
      WBS2O: WBS2O,
      WBS3O: WBS3O,
      WBS1: WBS1,
      WBS2FR: WBS2FR,
      WBS2TO: WBS2TO,
      ScheduledProd: ScheduledProd[0],
    };

    this.orderService
      .GetWBS3ForProject(
        obj,
        ProjectCode,
        WBS1O,
        WBS2O,
        WBS3O,
        WBS1,
        WBS2FR,
        WBS2TO,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('wbs3list', response);
          this.wbs3list = response;
          if (this.wbs3list.length == 1) {
            if (this.wbs3list[0] == '') {
              this.wbs3[0] = '';
              this.WBSDisplay.controls.wbs3.patchValue(response);
            }
          }
          // alert(this.numofClones + " orders have been cloned successfully. \n(" + this.numofClones + "个订单已成功克隆)");
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  GetWBS1() {
    debugger;
    let ProjectCode = this.newprojectCode;
    let WBS1 = 'null'; //this.dropdown.getProjectCode()[0]
    let WBS2 = 'null'; //this.newprojectCode
    this.CloneLoading = true;
    this.orderService.GetWBS1ForProject(ProjectCode, WBS1, WBS2).subscribe({
      next: (response) => {
        console.log('wbs1list', response);
        this.wbs1list = response.WBS1;
        this.wbs1 = '';
        this.wbs2 = '';
        this.wbs2from = '';
        this.wbs3 = [];
        // alert(this.numofClones + " orders have been cloned successfully. \n(" + this.numofClones + "个订单已成功克隆)");
      },
      error: (e) => {},
      complete: () => {
        this.CloneLoading = false;
        // this.modalService.dismissAll()

        if (this.wbs1) {
          this.GetWBS2();
        }
      },
    });
  }

  GetWBS2(): void {
    debugger;

    let ProjectCode = this.newprojectCode; //this.dropdown.getCustomerCode()
    let WBS1 = this.wbs1?.trim(); //this.dropdown.getProjectCode()[0]
    let WBS2 = 'null'; //this.newprojectCode
    this.wbs2 = '';
    this.wbs2from = '';
    this.CloneLoading = true;
    this.orderService.GetWBS2ForProject(ProjectCode, WBS1, WBS2).subscribe({
      next: (response) => {
        console.log('wbs2list', response);
        this.wbs2list = response.WBS2;
        // this.wbs3list = response.WBS3;
        // this.wbs2 = this.WBS2O;
        // this.wbs2from = this.WBS2O;
        this.wbs3 = [];
        // alert(this.numofClones + " orders have been cloned successfully. \n(" + this.numofClones + "个订单已成功克隆)");
      },
      error: (e) => {},
      complete: () => {
        this.CloneLoading = false;
        if (this.wbs2) {
          this.GetWBS3();
        }
      },
    });
  }

  GetWBS3() {
    debugger;

    let WBS1O = this.WBS1O?.trim();
    let WBS2O = this.WBS2O?.trim();
    let WBS3O = this.WBS3O?.trim();

    let ProjectCode = this.newprojectCode;
    let WBS1 = this.wbs1?.trim();
    let WBS2TO = this.wbs2?.trim();
    let WBS2FR = this.wbs2from?.trim();

    let ScheduledProd = this.ScheduledProd;
    let obj: any = {
      StructureEle: this.StructureElement,
      ProductType: this.Product,
      ProjectCode: ProjectCode,
      WBS1O: WBS1O,
      WBS2O: WBS2O,
      WBS3O: WBS3O,
      WBS1: WBS1,
      WBS2FR: WBS2FR,
      WBS2TO: WBS2TO,
      ScheduledProd: ScheduledProd[0],
    };

    this.wbs3 = [];
    this.WBSDisplay.controls.wbs3.patchValue(this.wbs3);

    this.orderService
      .GetWBS3ForProject(
        obj,
        ProjectCode,
        WBS1O,
        WBS2O,
        WBS3O,
        WBS1,
        WBS2FR,
        WBS2TO,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('wbs3list', response);
          this.wbs3list = response;

          if (this.wbs3list.length == 1) {
            if (this.wbs3list[0] == ' ' || this.wbs3list[0] == '') {
              this.wbs3[0] = '';
              this.WBSDisplay.controls.wbs3.patchValue(response);
            }
          }
          // alert(this.numofClones + " orders have been cloned successfully. \n(" + this.numofClones + "个订单已成功克隆)");
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  async SubmitCloneForPRoject() {
    debugger;

    let CloneSuccess = false;

    let clonedOrders: any[] = []; // Temp object to maintain previously cloned Order(Structure/Product) combination.
    let skipCurrOrder: boolean = false; // Flag to skip a particular order.

    for (let i = 0; i < this.OrderNumber.length; i++) {
      skipCurrOrder = false; //Initialize the flag as False.

      // Add the first Order to the Temp Object.
      if (clonedOrders.length === 0) {
        let obj = {
          Structure: this.StructureElement[i],
          Product: this.Product[i],
        };
        clonedOrders.push(obj);
      } else {
        // Check if the current combination(Structure/Product) hasalready been cloned.
        clonedOrders.forEach((item) => {
          // If cloned, set the flag as True.
          if (
            item.Structure == this.StructureElement[i] &&
            item.Product == this.Product[i]
          ) {
            skipCurrOrder = true;
          } else {
            // Else add the current combination to the Temp Obj.
            let obj = {
              Structure: this.StructureElement[i],
              Product: this.Product[i],
            };
            clonedOrders.push(obj);
          }
        });
      }
      // Check the Flag
      if (skipCurrOrder) {
        continue;
      }

      console.log('Structure', this.StructureElement[i]);
      console.log('Product', this.Product[i]);

      let CustomerCode = this.dropdown.getCustomerCode();
      let sProjectCode = this.dropdown.getProjectCode()[0];
      let dProjectCode = this.newprojectCode;
      let OrderNo = Number(this.OrderNumber[i]);
      let WBS1 = this.wbs1;
      let WBS2From = this.wbs2from;
      let WBS2To = this.wbs2;
      let wbs3 = {
        WBS3: this.wbs3,
      };
      let lStructureElement = this.StructureElement[0];

      this.CloneNumber = 1;

      if (!isNaN(WBS2From)) {
        this.CloneNumber = parseInt(WBS2To) - parseInt(WBS2From) + 1;
      }

      if (
        this.CloneValidation(this.wbs1, this.wbs2from, this.wbs2, this.wbs3) ==
        false
      ) {
        return;
      }
      this.CloneLoading = true;

      let response = await this.CloneOrderAsync(
        wbs3,
        CustomerCode,
        sProjectCode,
        dProjectCode,
        OrderNo,
        WBS1,
        WBS2From,
        WBS2To,
        this.CloneNumber,
        lStructureElement
      );
      if (response == false) {
        CloneSuccess = false;
      } else {
        console.log('submit', response);

        if (response.success == true) {
          CloneSuccess = true;
        } else {
          CloneSuccess = false;
          alert('Copy fails, Process error:' + response.responseText);
          this.CloneLoading = false;
          return;
        }
      }
    }

    if (CloneSuccess) {
      alert('Orders have been copied successfully. \n(个订单已成功拷贝)');
      this.modalService.dismissAll();
    }

    this.CloneLoading = false;
    // this.orderService
    //   .SUbmitCloneForProject(
    //     wbs3,
    //     CustomerCode,
    //     sProjectCode,
    //     dProjectCode,
    //     OrderNo,
    //     WBS1,
    //     WBS2From,
    //     WBS2To,
    //     this.CloneNumber
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       console.log('submit', response);

    //       if (response.success == true) {
    //         alert(this.CloneNumber + " orders have been copied successfully. \n(" + this.CloneNumber + "个订单已成功拷贝)");
    //       } else {
    //         alert("Copy fails, Process error:" + response.responseText);
    //         return;
    //       }
    //     },
    //     error: (e) => { },
    //     complete: () => {
    //       this.CloneLoading = false;
    //       this.modalService.dismissAll();
    //     },

    //   });
  }

  async CloneOrderAsync(
    wbs3: any,
    CustomerCode: any,
    sProjectCode: any,
    dProjectCode: any,
    OrderNo: any,
    WBS1: any,
    WBS2From: any,
    WBS2To: any,
    CloneNumber: any,
    StructureElement: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .SUbmitCloneForProject(
          wbs3,
          CustomerCode,
          sProjectCode,
          dProjectCode,
          OrderNo,
          WBS1,
          WBS2From,
          WBS2To,
          CloneNumber,
          StructureElement
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
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

  CloneValidation(
    lWBS1: any,
    lWBS2From: any,
    lWBS2To: any,
    lWBS3: any
  ): boolean {
    if (lWBS1 == undefined) {
      alert('Invalid WSB1 selected. (选择无效的大牌)');
      return false;
    }
    if (lWBS2From == undefined) {
      alert('Invalid WSB2 From selected. (选择无效的楼层)');
      return false;
    }
    if (lWBS2To == undefined) {
      alert('Invalid WSB2 To selected. (选择无效的楼层)');
      return false;
    }

    if (lWBS3.length == 0) {
      alert('Invalid WSB3 selected. (选择无效的分部)');
      return false;
    }

    if ((isNaN(lWBS2From) || isNaN(lWBS2To)) && lWBS2From != lWBS2To) {
      alert(
        'Invalid range of WBS2. If it is not a numeric WBS2, only can copy one WBS2 (无效的楼层范围. 如果选择了非数字的楼层, 仅能拷贝1层.)'
      );
      return false;
    }

    if (!isNaN(lWBS2From) && !isNaN(lWBS2To)) {
      if (
        parseInt(lWBS2From) > parseInt(lWBS2To) ||
        parseInt(lWBS2From) <= 0 ||
        parseInt(lWBS2To) <= 0
      ) {
        alert('Invalid range of WBS2. (无效的楼层范围)');
        return false;
      }
    }

    if(this.ScheduledProd[0] != 'Y'){
      // Validation for structure element of NON Scheduled Products.
      if(!this.ValidateStructureElement()){
        alert('Invalid Structure Element selected. (选择了无效的结构元素)');
        return false;
      }
    }else{
      // Validation for structure element of Scheduled Products.
    }

    return true;
  }

  cancel() {
    this.activeModal.close({ event: 'close', isConfirm: false });
    this.modalService.dismissAll();
  }

  SelectAll() {
    if (this.SelectAllWbs3) {
      this.wbs3 = JSON.parse(JSON.stringify(this.wbs3list));
    } else {
      this.wbs3 = [];
    }
  }


  // ODOS CR 
  // 1. Add structure element dropdown in clone order pop up  to change Structure element before clone.
  ProductListData: any[] = [];
  GetProductListData() {
    let lCustomerCode = this.dropdown.getCustomerCode();
    let lProjectCode = this.dropdown.getProjectCode()[0]
    this.ProductListData = [];
    let UserName = this.loginService.GetGroupName();

    if(lCustomerCode && lProjectCode){
      this.orderService
      .ProductSelect(lCustomerCode, lProjectCode, UserName)
      .subscribe({
        next: (response) => {
          this.ProductListData = response;
          console.log('ProductListData', response);
        },
        error: (e) => {},
        complete: () => {},
      });
    }
  }

  ValidateStructureElement(): boolean{
    let lStructureElement = this.StructureElement[0];
    let lProduct = this.Product[0];
    if(lStructureElement){
      let lObj = this.ProductListData.find(p => p.SECode?.toUpperCase() === lStructureElement?.toUpperCase());
      if(lObj){
        let lIndex = lObj.ProdCode.findIndex((x: any) => x.toUpperCase() === lProduct?.toUpperCase());
        if(lIndex>-1){
          return true;
        }
      }
    }
    return false;
  }
}
