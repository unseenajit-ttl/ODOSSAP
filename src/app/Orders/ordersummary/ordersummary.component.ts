import { Component, NgModuleRef, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { OrderService } from '../orders.service';
import { OrderSummaryTableData } from 'src/app/Model/OrderSummaryTableData';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { DocsattachedComponent } from '../createorder/docsattached/docsattached.component';
import { AddToCart } from 'src/app/Model/addToCart';
import { OrderdetailsproductComponent } from '../orderdetailsproduct/orderdetailsproduct.component';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { OrderdetailsComponent } from '../createorder/orderdetails/orderdetails.component';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { saveOrderDetailsModel } from 'src/app/Model/saveOrderDetailsModel';
import { ToastrService } from 'ngx-toastr';
import { CloneOrderComponent } from './clone-order/clone-order.component';
import { Router, TitleStrategy } from '@angular/router';
import { PrintOrderComponent } from './print-order/print-order.component';
import { SaveBBSOrderDetails } from 'src/app/Model/SaveBBSOrderDetails';
import { SaveJobAdvice_CAB } from 'src/app/Model/SaveJobAdvice_CAB';
import { CloneOrderProjectComponent } from './clone-order-project/clone-order-project.component';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { LoginOptions } from 'angular-oauth2-oidc';
import { LoginService } from 'src/app/services/login.service';
import { cosDependencies, forEach } from 'mathjs';
import {
  trigger,
  state,
  style,
  AUTO_STYLE,
  transition,
  animate,
} from '@angular/animations';
import { NgbDateFRParserFormatter } from 'src/app/SharedComponent/bootsrtap-date-range-picker-for-search/ngb-date-fr-parser-formatter';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { PreCastDetails } from 'src/app/Model/StandardbarOrderArray';
import { WbsService } from 'src/app/wbs/wbs.service';
//import { MomentDateAdapter } from '@angular/material-moment-adapter';
// import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD', //YYYY-MM-DD
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-ordersummary',
  templateUrl: './ordersummary.component.html',
  styleUrls: ['./ordersummary.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    NgbDatepickerConfig,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
  ],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate('400' + 'ms ease-in')),
      transition('true => false', animate('400' + 'ms ease-out')),
    ]),
  ],
})
export class OrdersummaryComponent implements OnInit {
  CustomerCode: any = this.dropdown.getCustomerCode();
  ProjectCode: any = this.dropdown.getProjectCode()[0];

  OrderSummaryList: any;
  TransportList: any;
  receivedObject: any;

  PONO: string = '';
  PODate: any;
  RequiredDate: any;
  orgReqDate: any;
  Transport: any = 'TR40/24';
  SiteContact: string = '';
  SiteHandphone: string = '';
  SiteEmail: string = '';
  GoodsReceiver: string = '';
  ReceiverHandphone: string = '';
  ReceiverEmail: string = '';
  DeliveryAddress: string = '';
  BBSDescription: string = '';
  Remarks: any;
  AdditionalRemarks: any;
  OrderSummaryTableData: OrderSummaryTableData[] = [];
  NumberofDocuments: any[] = [];
  OrderSummaryLoading: boolean = false;

  listofOrders: AddToCart[] = [];
  currentListOrderIndex = 0;

  startDate = new Date(1990, 0, 1);

  CabOrderDetails: any;
  CabOrderDetails_Coupler: any = '';
  OrderDetails: any;
  showDetails: boolean = false;
  today: Date = new Date();
  maxDate: Date = new Date();
  CouplerList: any;
  PONumberList: any[] = [];
  ProductType: any;
  StructureElement: any;
  ScheduleProd: any;

  saveorderdata: saveOrderDetailsModel[] = [];
  lOrderStatus: any;

  isEditble: boolean = true;
  pOrderUnderApproval: boolean = false;

  currSaveOrderIndex: number = 1;
  currSubmitOrderIndex: number = 1;

  submitOrderstatus: string = '';

  submitOrder: boolean = false;
  borderBottom: string = '0.5px solid #ced4da';

  ViewOrderSummary: boolean = false;
  lDataHaveCT: number = 0;
  lDataNeedCT: number = 0;

  ShowApprove: boolean = false;
  ShowSubmit: boolean = false;
  ShowSendApproval: boolean = false;
  ShowCreate: boolean = false;
  Showithdraw: boolean = false;
  ShowReject: boolean = false;
  PONOisPresent: boolean = false;
  lHolidays: any = [];
  // isPrecastFlag:boolean=false
  PrecastArray: PreCastDetails[] = [];
  CabJobIDs: any[] = [];
  CabOrderNumbers: any[] = [];
  LeadTime: any = [
    { Prod: 'BPC', Days: 5 },
    { Prod: 'CAB', Days: 5 },
    { Prod: 'COLUMN-LINK-MESH', Days: 7 },
    { Prod: 'CORE-CAGE', Days: 7 },
    { Prod: 'CUT-TO-SIZE-MESH', Days: 7 },
    { Prod: 'PRE-CAGE', Days: 7 },
    { Prod: 'STIRRUP-LINK-MESH', Days: 7 },
  ];

  commonDataCollapse: boolean = false;
  OrderSubmitted: boolean = false;
  siteContactList: any[] = [];
  goodsReceiverList: any[] = [];
  OrderUnderApproval: boolean = false;
  isPrecastFlag: boolean = false;

  constructor(
    private location: Location,
    private orderService: OrderService,
    private modalService: NgbModal,
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private createSharedService: CreateordersharedserviceService,
    private toastr: ToastrService,
    private router: Router,
    public datepipe: DatePipe,
    private processsharedserviceService: ProcessSharedServiceService,
    private loginService: LoginService,
    private dateAdapter: DateAdapter<Date>,
    private calendar: NgbCalendar,
    private commonService: CommonService,
    private wbsService: WbsService
  ) {
    this.lHolidays = this.loginService.GetHoliday();
  }
  dateClass = (date: Date) => {
    const day = this.dateAdapter.getDayOfWeek(date);
    // Sunday is 0, Saturday is 6
    if (day === 0) {
      return 'weekend-color weekend';
    }

    let lCurrentDay =
      (this.dateAdapter.getMonth(date) + 1).toString() +
      '/' +
      this.dateAdapter.getDate(date).toString() +
      '/' +
      this.dateAdapter.getYear(date).toString();
    lCurrentDay = new Date(lCurrentDay.toString()).toLocaleDateString();

    console.log('lCurrentDay', lCurrentDay, this.lHolidays);

    if (this.lHolidays.includes(lCurrentDay)) {
      return 'weekend-color';
    }
    return '';
  };
  ngOnInit(): void {
    // debugger;
    this.commonService.changeTitle('Order Summary | ODOS');
    this.OrderSubmitted = false;

    // WHEN RELOADED WHILE STAYING ON THE SAME PAGE
    this.reloadService.reloadOrderSummary$.subscribe((data) => {
      // console.log("yes yes yes ")
      console.log('component reloaded');
      console.log(
        'window.history..tempOrderSummaryList->',
        window.history.state.tempOrderSummaryList
      );
      this.OrderSummaryList = window.history.state.tempOrderSummaryList;
    });

    // WHEN LOADED NORMALLY
    console.log(window.history.state.tempOrderSummaryList);
    this.OrderSummaryList = window.history.state.tempOrderSummaryList;
    console.log('this.OrderSummaryList', this.OrderSummaryList);

    if (this.createSharedService.viewData == true) {
      this.ViewOrderSummary = true;
      this.OrderSummaryList = this.createSharedService.viewOrderSummaryList;
      // this.createSharedService.viewData = false;
    }

    let pData = this.processsharedserviceService.getOrderSummaryData();
    if (pData) {
      console.log('------ORDER FROM PROCESS------');
      console.log('pData', pData);

      // this.OrderSummaryList = pData;
      this.CustomerCode = pData.pCustomerCode;
      this.ProjectCode = pData.pProjectCode;
    }
    this.GetCouplerType();
    this.GetOrderSummary();
    this.GetContactList();
  }
  getMaxDate(): Date {
    this.maxDate = new Date(this.RequiredDate);
    return this.maxDate;
  }
  getMinDate(): Date {
    // console.log('DATE TODAY', this.today)
    return this.today;
  }
  goBack(): void {
    this.location.back();
  }
  getDate(date: any) {
    if (date == '') {
      return '';
    }
    date = date.split('/');
    date.unshift(date.pop());
    for (let i = 0; i < date.length; i++) {
      if (date[i] <= 9) {
        date[i] = '0' + date[i];
      }
    }
    date = date.join('');
    return date;
  }
  gettotalWeight(item: any) {
    let weight = 0;
    item.forEach((x: { OrderTonnage: number }) => {
      weight += x.OrderTonnage;
    });
    return weight;
  }
  gettotalQty(item: any) {
    let qty = 0;
    item.forEach((x: { OrderQty: number }) => {
      qty += x.OrderQty;
    });
    return qty;
  }

  IsPrecast: boolean = false;

  async getTableData(item: any) {
    // debugger;
    console.log('this.OrderSummaryList', this.OrderSummaryList);
    console.log('item', item);
    this.OrderSummaryTableData = [];

    // this.OrderSummaryList.pSelectedProd =
    //   this.OrderSummaryList.pSelectedProd.split(',');
    // this.OrderSummaryList.pSelectedSE =
    //   this.OrderSummaryList.pSelectedSE.split(',');
    // this.OrderSummaryList.pSelectedPostID =
    //   this.OrderSummaryList.pSelectedPostID.split(',');
    // this.OrderSummaryList.pSelectedScheduled =
    //   this.OrderSummaryList.pSelectedScheduled.split(',');
    // this.OrderSummaryList.pOrderNo =
    //   this.OrderSummaryList.pOrderNo.split(',');

    // let orderstatuses = item.lPEStatus.split(',');

    // this.OrderSummaryList.pSelectedWBS1 =
    //   this.OrderSummaryList.pSelectedWBS1 == ''
    //     ? []
    //     : this.OrderSummaryList.pSelectedWBS1.split(',');
    // this.OrderSummaryList.pSelectedWBS2 =
    //   this.OrderSummaryList.pSelectedWBS2 == ''
    //     ? []
    //     : this.OrderSummaryList.pSelectedWBS2.split(',');
    // this.OrderSummaryList.pSelectedWBS3 =
    //   this.OrderSummaryList.pSelectedWBS3 == ''
    //     ? []
    //     : this.OrderSummaryList.pSelectedWBS3.split(',');

    //------------------------------------------------------------------------------

    let lLength = item.pOrderNo.split(',').length;
    let SelectedSE = item.pSelectedSE.split(',');
    let SelectedProd = item.pSelectedProd.split(',');
    let SelectedWBS1 = item.pSelectedWBS1.split(',');
    let SelectedWBS2 = item.pSelectedWBS2.split(',');
    let SelectedWBS3 = item.pSelectedWBS3.split(',');
    let Weight = item.lWT;
    let Quantity = item.lQty;
    let PONo = item.lPONos;
    let ReqDate = item.lRDs;
    let Transport = item.lTransports;

    let Ordernumber = item.pOrderNo.split(',');
    let SelectedPostID = item.pSelectedPostID.split(',');
    let SelectedScheduled = item.pSelectedScheduled.split(',');

    let SelectedStatus = item.lPEStatus.split(',');

    for (let i = 0; i < lLength; i++) {
      if (SelectedSE[i] != 'NONWBS') {
        let obj: OrderSummaryTableData = {
          SNo: this.OrderSummaryTableData.length + 1,
          SeperateDelivery: false,
          WBS: (
            (SelectedWBS1[i] == undefined ? '' : SelectedWBS1[i]) +
            ' / ' +
            (SelectedWBS2[i] == undefined ? '' : SelectedWBS2[i]) +
            ' / ' +
            (SelectedWBS3[i] == undefined ? '' : SelectedWBS3[i])
          ).toUpperCase(),
          WBS1: SelectedWBS1[i] == undefined ? '' : SelectedWBS1[i],
          WBS2: SelectedWBS2[i] == undefined ? '' : SelectedWBS2[i],
          WBS3: SelectedWBS3[i] == undefined ? '' : SelectedWBS3[i],
          StructureElement: SelectedSE[i].toUpperCase(),
          Product: SelectedProd[i].toUpperCase(),
          OrderTonnage: Weight[i],
          OrderQty: Quantity[i],
          showDetails: false,
          PONumber: PONo[i],
          RequiredDate: ReqDate[i],
          Transport: Transport[i],
          BBSNumnber: '',
          BBSDescription: '',
          CouplerType: '',
          SpecialRemarks: item.lRemark[i],
          SiteContact: item.lSiteContacts[i],
          Handphone: item.lHandphones[i],
          GoodsReceiver: item.lGoodsReceivers[i],
          GoodsReceiverHandphone: item.lGoodsReceiverHandphones[i],
          OrderNumber: Ordernumber[i],
          OrderStatus: SelectedStatus[i],
          ScheduledProd: SelectedScheduled[i],
          PostId: Number(SelectedPostID[i]),
          BBS: undefined,
          AdditionalRemark: item.AdditionalRemark[i],
          IsPrecast: this.isPrecastFlag,
          precastQty: 0,
          pageNo: 0,
        };

        if (obj.Product == 'CUT-TO-SIZE-MESH') {
          console.log('objtest2', obj);
          console.log('obj.precastQty-', obj.precastQty);
          let id = obj.PostId;
          // let postID= await this.getJobId(obj.OrderNumber, obj.Product, obj.StructureElement, obj.ScheduledProd);
          // if(postID.PostHeaderID==0){
          //   id= postID.PrecastJobID;
          // }
          // else
          // {
          //   id= postID.PostHeaderID;
          // }
          console.log('postID-', id);
          let totalqty = await this.GetPrecastDetails(
            this.CustomerCode,
            this.ProjectCode,
            id,
            obj
          );
          // this.getIsPrecast(id);
          this.getIsPrecast(this.CustomerCode, this.ProjectCode);

          console.log('totalqty-', totalqty);
          // obj.precastQty=totalqty;
          // await this.orderService
          // .getPrecastDetails(this.CustomerCode, this.ProjectCode, obj.PostId)
          // .subscribe({
          //   next: (response) => {
          //     this.PrecastArray = response ? response : [];
          //     console.log("this.PrecastArray[0].PageNo", this.PrecastArray[0].PageNo);
          //     obj.pageNo = this.PrecastArray[0].PageNo;
          //     // return this.PrecastArray[0].PageNo;
          //   },
          //   error: (e) => { },
          //   complete: () => {

          //     this.OrderSummaryTableData.push(obj);
          //   },
          // });
          this.OrderSummaryTableData.push(obj);
          console.log('obj.precastQty-', obj.precastQty);
        } else {
          this.OrderSummaryTableData.push(obj);
        }
      } else {
        let obj: OrderSummaryTableData = {
          SNo: this.OrderSummaryTableData.length + 1,
          SeperateDelivery: false,
          WBS: (
            (SelectedWBS1[i] == undefined ? '' : SelectedWBS1[i]) +
            '/' +
            (SelectedWBS2[i] == undefined ? '' : SelectedWBS2[i]) +
            '/' +
            (SelectedWBS3[i] == undefined ? '' : SelectedWBS3[i])
          ).toUpperCase(),

          WBS1: SelectedWBS1[i] == undefined ? '' : SelectedWBS1[i],
          WBS2: SelectedWBS2[i] == undefined ? '' : SelectedWBS2[i],
          WBS3: SelectedWBS3[i] == undefined ? '' : SelectedWBS3[i],
          StructureElement: SelectedSE[i].toUpperCase(),
          Product: SelectedProd[i].toUpperCase(),
          OrderTonnage: Weight[i],
          OrderQty: Quantity[i],
          showDetails: false,
          PONumber: PONo[i],
          RequiredDate: ReqDate[i],
          Transport: Transport[i],
          BBSNumnber: '',
          BBSDescription: '',
          CouplerType: '',
          SpecialRemarks: item.lRemark[i],
          SiteContact: item.lSiteContacts[i],
          Handphone: item.lHandphones[i],
          GoodsReceiver: item.lGoodsReceivers[i],
          GoodsReceiverHandphone: item.lGoodsReceiverHandphones[i],
          OrderNumber: Ordernumber[i],
          OrderStatus: SelectedStatus[i],
          ScheduledProd: SelectedScheduled[i],
          PostId: Number(SelectedPostID[i]),
          BBS: undefined,
          AdditionalRemark: item.AdditionalRemark[i],
          IsPrecast: this.isPrecastFlag,
          precastQty: 0,
          pageNo: 0,
        };
        if (obj.WBS == '//') {
          obj.WBS = '';
        }
        this.OrderSummaryTableData.push(obj);
      }
    }

    this.lDataHaveCT = 0;
    this.lDataNeedCT = 0;
    let UserName = this.loginService.GetGroupName();
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      if (
        this.OrderSummaryTableData[i].ScheduledProd.trim() != 'Y' &&
        (this.OrderSummaryTableData[i].Product != 'BPC' ||
          UserName == null ||
          UserName.split('@').length != 2 ||
          UserName.split('@')[1].toLowerCase() == 'natsteel.com.sg')
      ) {
        this.lDataNeedCT = this.lDataNeedCT + 1;

        if (
          (Number(this.OrderSummaryTableData[i].OrderTonnage) > 0 &&
            this.OrderSummaryTableData[i].Product != 'COUPLER') ||
          (Number(this.OrderSummaryTableData[i].OrderQty) > 0 &&
            this.OrderSummaryTableData[i].Product == 'COUPLER')
        ) {
          this.lDataHaveCT = this.lDataHaveCT + 1;
        }
      }
    }
    this.UpdateTempOrderList();
    await this.addPageNumber();
  }
  openDocument(item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    item.CustomerCode = this.CustomerCode;
    item.ProjectCode = this.ProjectCode;
    const modalRef = this.modalService.open(
      DocsattachedComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.SelectedRecord = item;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      console.log('No of Doc', x);
      item.NoofAttachedDoc = x;
    });
    console.log('OrderSummaryTableData', this.OrderSummaryTableData);
  }
  openOrderDetailsProduct(item: any) {
    this.OrderSummaryTableData.forEach((x) => (x.showDetails = false));
    item.showDetails = !item.showDetails;

    // if (item.Product == 'CAB') {
    //   //debugger;
    //   console.log('item', item);
    //   const ngbModalOptions: NgbModalOptions = {
    //     backdrop: 'static',
    //     keyboard: false,
    //     // centered: true,
    //     size: 'xl',
    //   };
    //   const modalRef = this.modalService.open(
    //     OrderdetailsproductComponent,
    //     ngbModalOptions
    //   );
    //   modalRef.componentInstance.customerCode = '0001101688'; //this.CustomerCode
    //   modalRef.componentInstance.projectCode = '0000112837'; //this.ProjectCode
    //   modalRef.componentInstance.JobID = '209';
    //   modalRef.componentInstance.OrderSource = '';
    //   modalRef.componentInstance.structureElement = item.StructureElement;
    //   modalRef.componentInstance.productType = item.Product;
    //   modalRef.componentInstance.ScheduledProd = 'N';
    // }
    // let temp = {
    //   customerCode: this.CustomerCode,
    //   projectCode: this.ProjectCode,
    //   JobID: '51', // SEND HARDCODED VALUE TEMPORARILY
    //   OrderSource: '',
    //   structureElement: item.StructureElement,
    //   productType: item.Product,
    //   ScheduledProd: 'N',
    // };
    if (item.showDetails && item.Product == 'CAB') {
      // item.showDetails = !item.showDetails;
      item.SeperateDelivery = false;
      this.orderService
        .getJobId(
          item.OrderNumber,
          item.Product,
          item.StructureElement,
          item.ScheduledProd
        )
        .subscribe({
          next: (response: any) => {
            console.log('jobid', response);
            let JobID = response.CABJOBID;

            this.GetOrderProductForCABPOPUP(
              this.CustomerCode,
              this.ProjectCode,
              JobID
            );
            this.GetCouplerForCABPOPUP(
              this.CustomerCode,
              this.ProjectCode,
              JobID
            );
          },
          error: () => {},
          complete: () => {},
        });
    }

    if (
      item.showDetails &&
      (item.Product == 'COIL' ||
        item.Product == 'COUPLER' ||
        item.Product == 'STANDARD-BAR')
    ) {
      let CustomerCode: any = this.CustomerCode;
      let ProjectCode: any = this.ProjectCode;
      let OrderSource: any = 'UX';
      let StructureElement: any = item.StructureElement;
      let ProductType: any = item.Product;
      let ScheduledProd: any = item.ScheduledProd;

      let JobID = item.OrderNumber;

      this.GetStdSheet(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      );
      // item.showDetails = !item.showDetails;
      // item.SeperateDelivery = false;
      // this.orderService.getJobId(item.OrderNumber).subscribe({
      //   next: (response: any) => {
      //     console.log('jobid', response);

      //     let CustomerCode: any = this.CustomerCode;
      //     let ProjectCode: any = this.ProjectCode;
      //     let OrderSource: any = 'UX';
      //     let OrderNumber = item.OrderNumber;
      //     let StructureElement: any = item.StructureElement;
      //     let ProductType: any = item.Product;
      //     let ScheduledProd: any = item.ScheduledProd;

      //     let JobID = item.OrderNumber;
      //     if (ProductType == 'STANDARD-BAR') {
      //       JobID = response.StdBarsJobID;
      //     } else if (ProductType == 'COIL') {
      //       JobID = response.CoilProdJobID;
      //     } else if (ProductType == 'COUPLER') {
      //       JobID = response.CoilProdJobID;
      //     }

      //     this.GetStdSheet(
      //       CustomerCode,
      //       ProjectCode,
      //       JobID,
      //       OrderSource,
      //       StructureElement,
      //       ProductType,
      //       ScheduledProd
      //     );
      //   },
      //   error: () => { },
      //   complete: () => { },
      // });
    }
    if (item.showDetails && item.Product == 'STANDARD-MESH') {
      let JobID = item.OrderNumber;

      let CustomerCode: any = this.CustomerCode;
      let ProjectCode: any = this.ProjectCode;
      let OrderSource: any = 'UX';
      let StructureElement: any = item.StructureElement;
      let ProductType: any = item.Product;
      let ScheduledProd: any = item.ScheduledProd;

      this.GetStdSheet(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      );
      // item.showDetails = !item.showDetails;
      // item.SeperateDelivery = false;
      // this.orderService.getJobId(item.OrderNumber).subscribe({
      //   next: (response: any) => {
      //     console.log('jobid', response);

      //   },
      //   error: () => { },
      //   complete: () => { },
      // });
    }

    if (item.showDetails && item.Product == 'PRECAST') {
      // item.showDetails = !item.showDetails;
      // item.SeperateDelivery = false;
      this.orderService
        .getJobId(
          item.OrderNumber,
          item.Product,
          item.StructureElement,
          item.ScheduledProd
        )
        .subscribe({
          next: (response: any) => {
            console.log('jobid', response);
            let JobID = response.PostHeaderID;
            // this.getIsPrecast(JobID);
            this.getIsPrecast(this.CustomerCode, this.ProjectCode);

            this.GetPrecastDetails2(this.CustomerCode, this.ProjectCode, JobID);
            // this.GetCouplerForCABPOPUP(  this.CustomerCode,
            //   this.ProjectCode,
            //   JobID);
          },
          error: () => {},
          complete: () => {},
        });
    }
  }

  async GetPrecastDetails2(customer: any, project: any, jobId: any) {
    this.orderService
      .getPrecastDetails(this.CustomerCode, this.ProjectCode, jobId)
      .subscribe({
        next: (response) => {
          this.PrecastArray = response ? response : [];

          console.log('this.PrecastArray', this.PrecastArray);
          // this.calculateTotalBundleWt();
          //allowGrade500M
        },
        error: (e) => {},
        complete: () => {
          // this.StandardBarProductOrderLoading = false;
          // this.loading = false;
        },
      });
  }
  updateItemPO() {
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      debugger;
      let temppo = localStorage.getItem('originalPO');
      console.log('checking now for po:', temppo);
      if (
        temppo != undefined &&
        temppo != '' &&
        temppo != null &&
        temppo != 'null'
      ) {
        if (this.OrderSummaryTableData[i].PONumber.toString().length > 0) {
          this.OrderSummaryTableData[i].PONumber = temppo;
          // this.PONO = this.originalPO;
        }
        this.PONO = temppo;
      }
    }
    localStorage.removeItem('originalPO');
  }

  async addPageNumber() {
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      await this.orderService
        .getPrecastDetails(
          this.CustomerCode,
          this.ProjectCode,
          this.OrderSummaryTableData[i].PostId
        )
        .subscribe({
          next: (response) => {
            this.PrecastArray = response ? response : [];
            console.log(
              'this.PrecastArray[0].PageNo',
              this.PrecastArray[0].PageNo
            );
            this.OrderSummaryTableData[i].pageNo =
              this.PrecastArray[0].PageNo ?? 0;
            // return this.PrecastArray[0].PageNo;
          },
          error: (e) => {},
          complete: () => {
            console.log(
              'this.ordersummarytabledata',
              this.OrderSummaryTableData
            );
          },
        });
    }
  }

  async getPageNumber(Postheaderid: any) {
    await this.orderService
      .getPrecastDetails(this.CustomerCode, this.ProjectCode, Postheaderid)
      .subscribe({
        next: (response) => {
          this.PrecastArray = response ? response : [];
          console.log(
            'this.PrecastArray[0].PageNo',
            this.PrecastArray[0].PageNo
          );
          return this.PrecastArray[0].PageNo;
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  async GetPrecastDetails(customer: any, project: any, jobId: any, obj: any) {
    console.log('objtest', obj);
    await this.orderService
      .getPrecastDetails(this.CustomerCode, this.ProjectCode, jobId)
      .subscribe({
        next: (response) => {
          this.PrecastArray = response ? response : [];
          let qty = 0;
          for (let i = 0; i < this.PrecastArray.length; i++) {
            qty += parseInt(this.PrecastArray[i].Qty);
          }
          console.log('this.PrecastArray', this.PrecastArray);
          // this.calculateTotalBundleWt();
          //allowGrade500M
          obj.precastQty = qty;
          // this.OrderSummaryTableData.push(obj);
          return qty;
        },
        error: (e) => {},
        complete: () => {
          // this.StandardBarProductOrderLoading = false;
          // this.loading = false;
          // this.showPrecastQty= true;
        },
      });
  }

  GetStdSheet(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    this.orderService
      .getStdSheet_Process(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('OrderDetails', response);
          this.OrderDetails = response;
          // this.OrderDetails.forEach(element => element.unit_weight = element.unit_weight ? element.unit_weight.toFixed = )

          for (let i = 0; i < this.OrderDetails.length; i++) {
            if (this.OrderDetails[i].unit_weight) {
              this.OrderDetails[i].unit_weight =
                this.OrderDetails[i].unit_weight.toFixed(3);
              this.OrderDetails[i].order_wt =
                this.OrderDetails[i].order_wt.toFixed(3);
            }
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  }
  getDeliveryAddress() {
    let CustomerCode = this.CustomerCode;
    let ProjectCode = this.ProjectCode;
    let WBS1 =
      this.OrderSummaryList.pSelectedWBS1 == ''
        ? 'null'
        : this.OrderSummaryList.pSelectedWBS1;

    this.orderService
      .getDeliveryAddress(CustomerCode, ProjectCode, WBS1)
      .subscribe({
        next: (response) => {
          console.log('delivery', response);
          // this.PONumberList = response;

          // {
          //   "SiteEngr_Name": "RAJ",
          //   "SiteEngr_HP": "97405305",
          //   "SiteEngr_Email": "r.vetrivel@hpconstn.com.sg",
          //   "Scheduler_Name": "ARUN",
          //   "Scheduler_HP": "83703070",
          //   "Scheduler_Email": "arun@hpconstn.com.sg",
          //   "DeliveryAddress": "PC2A(C4),PC2B(C6), PC3C(C15) & PC2C*(SW)",
          //   "Remarks": "CHIN CHENG AVENUE"
          // }

          let lFlag = sessionStorage.getItem('SetDeliveryAddress_Flag');
          if (lFlag) {
            this.SiteContact =
              this.SiteContact == '' || this.SiteContact == null
                ? response.Scheduler_Name
                : this.SiteContact;
            this.SiteHandphone =
              this.SiteHandphone == '' || this.SiteHandphone == null
                ? response.Scheduler_HP
                : this.SiteHandphone;
            this.SiteEmail =
              this.SiteEmail == '' || this.SiteEmail == null
                ? response.Scheduler_Email
                : this.SiteEmail;
            this.GoodsReceiver =
              this.GoodsReceiver == '' || this.GoodsReceiver == null
                ? response.SiteEngr_Name
                : this.GoodsReceiver;
            this.ReceiverHandphone =
              this.ReceiverHandphone == '' || this.ReceiverHandphone == null
                ? response.SiteEngr_HP
                : this.ReceiverHandphone;
            this.ReceiverEmail =
              this.ReceiverEmail == '' || this.ReceiverEmail == null
                ? response.SiteEngr_Email
                : this.ReceiverEmail;
            this.DeliveryAddress =
              this.DeliveryAddress == '' || this.DeliveryAddress == null
                ? response.Remarks
                : this.DeliveryAddress;
            sessionStorage.removeItem('SetDeliveryAddress_Flag');
          }
          this.setRemarks();
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }
  getPOList() {
    let CustomerCode = this.CustomerCode;
    let ProjectCode = this.ProjectCode;

    let templist: any[] = [];
    this.OrderSummaryTableData.forEach((x) => {
      templist.push(x.Product);
      // ProdTypes = ProdTypes + ',' +  x.Product
    });
    let ProdTypes = templist.join(',');

    this.orderService
      .getPOHistory(CustomerCode, ProjectCode, ProdTypes)
      .subscribe({
        next: (response) => {
          console.log('PONumberList', response);
          this.PONumberList = response;
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }
  getTransportList() {
    if (this.Transport == 'TR40/24' || this.Transport == 'HC') {
      this.TransportList = [
        { code: 'TR40/24', name: 'Trailer (重型拖车)' },
        {
          code: 'HC',
          name: 'Hiap Crane (May incur additional charge) (起重货车 - 可能有额外费用)',
        },
        {
          code: 'LB30',
          name: 'Low Bed (May incur additional charge) (宽体拖车 - 可能有额外费用)',
        },
        { code: 'SC', name: 'Self-Collection (客户自取)' },
      ];
    } else if (this.Transport == 'LB30') {
      this.TransportList = [
        {
          code: 'LB30',
          name: 'Low Bed (May incur additional charge) (宽体拖车 - 可能有额外费用)',
        },
        { code: 'SC', name: 'Self-Collection (客户自取)' },
      ];
    } else if (this.Transport == 'LBE') {
      this.TransportList = [
        {
          code: 'LBE',
          name: 'Police Escoted (May incur additional charge) (警察护送 - 可能有额外费用)',
        },
        { code: 'SC', name: 'Self-Collection (客户自取)' },
      ];
    } else {
      this.TransportList = [
        { code: 'TR40/24', name: 'Trailer (重型拖车)' },
        {
          code: 'HC',
          name: 'Hiap Crane (May incur additional charge) (起重货车 - 可能有额外费用)',
        },
        {
          code: 'LB30',
          name: 'Low Bed (May incur additional charge) (宽体拖车 - 可能有额外费用)',
        },
        { code: 'SC', name: 'Self-Collection (客户自取)' },
      ];
    }
  }

  // openProductDetails() {
  //   const ngbModalOptions: NgbModalOptions = {
  //     backdrop: 'static',
  //     keyboard: false,
  //     // centered: true,
  //     size: 'xl',
  //   };
  //   const modalRef = this.modalService.open(
  //     OrderdetailsComponent,
  //     ngbModalOptions
  //   );
  //   modalRef.componentInstance.name = 'World';
  // }

  precast: boolean = false;

  getProductDetailsRoute(
    StructureElement: any,
    product: any,
    IsPrecast: boolean,
    IsPRecastRoute: boolean
  ) {
    let route = undefined;
    let isPrecast = IsPrecast;
    // while(this.createSharedService.selectedJobIds == undefined){
    //   console.log('yes')
    // }
    // this.setSelectedOrederNumber(item.OrderNumber)

    if (product == 'CAB') {
      route = '../order/createorder/orderdetails';
    } else if (product == 'STANDARD-BAR') {
      route = '../order/createorder/standardbarorder';
    } else if (product == 'STANDARD-MESH') {
      route = '../order/createorder/standardmeshorder';
    } else if (product == 'COIL') {
      route = '../order/createorder/coilproductsorder';
    } else if (product == 'COUPLER') {
      route = '../order/createorder/Couplerheadorder';
    } else if (
      product == 'PRC' ||
      product == 'PRE-CAGE' ||
      product == 'CORE-CAGE'
    ) {
      route = '../order/createorder/Precage';
    } else if (product == 'CUT-TO-SIZE-MESH') {
      if (StructureElement == 'NONWBS') {
        route = '../order/createorder/CtsMesh';
      } else {
        if (isPrecast == true && IsPRecastRoute == true) {
          route = '../order/createorder/Precast';
          localStorage.setItem('originalPO', this.originalPO);
        } else {
          route = '../order/createorder/Ctsmeshorder';
        }
      }
    } else if (product == 'COLUMN-LINK-MESH') {
      route = '../order/createorder/Columnlinkmeshorder';
    } else if (product == 'STIRRUP-LINK-MESH') {
      route = '../order/createorder/Beamlinkmeshorder';
    } else if (product == 'BPC') {
      route = '../order/createorder/bpc';
    } else if (product == 'CARPET') {
      route = '../order/createorder/CarpetOrder';
    }
    return route;
  }

  async setSelectedOrederNumber(
    OrderNumber: any,
    item: any,
    IsPRecastRoute: boolean
  ) {
    this.submitOrderstatus = '';
    if (this.isEditble == true) {
      this.SaveOrder();
      if (item.Product == 'CAB') {
        if (item.BBS == undefined) {
          let lIndex = this.OrderSummaryTableData.findIndex(
            (x) => x.OrderNumber == OrderNumber
          );
          await this.SaveOrderCAB(lIndex);
          await this.SetBBS(
            lIndex,
            this.OrderSummaryTableData[lIndex].OrderNumber
          );
        }

        await this.SaveBBS(item);
      }
    }

    const response = await this.getJobId(
      OrderNumber,
      item.Product,
      item.StructureElement,
      item.ScheduledProd
    );

    this.createSharedService.JobIds = response;
    this.createSharedService.selectedOrderNumber = OrderNumber;
    item.Transport = item.Transport ? item.Transport : this.Transport;

    this.createSharedService.selectedrecord = item;

    if (item.Product == 'CAB') {
      let obj: SaveJobAdvice_CAB = {
        CustomerCode: item.BBS.CustomerCode,
        ProjectCode: item.BBS.ProjectCode,
        JobID: item.BBS.JobID,
        PONumber: item.PONumber ? item.PONumber : this.PONO,
        PODate: new Date(),
        RequiredDate: new Date(),
        CouplerType: item.CouplerType,
        OrderStatus: item.OrderStatus,
        TotalCABWeight: item.BBS.BBSOrderCABWT,
        TotalSTDWeight: item.BBS.BBSOrderSTDWT,
        TotalWeight: item.BBS.BBSTotalWT,
        TransportLimit: '',
        SiteEngr_Name: item.GoodsReceiver
          ? item.GoodsReceiver
          : this.GoodsReceiver,
        SiteEngr_HP: item.GoodsReceiverHandphone
          ? item.GoodsReceiverHandphone
          : this.ReceiverHandphone,
        SiteEngr_Tel: '',
        Scheduler_Name: item.SiteContact ? item.SiteContact : this.SiteContact,
        Scheduler_HP: item.Handphone ? item.Handphone : this.SiteHandphone,
        Scheduler_Tel: '',
        WBS1: item.WBS.split('/')[0],
        WBS2: item.WBS.split('/')[1],
        WBS3: item.WBS.split('/')[2],
        DeliveryAddress: item.SpecialRemarks
          ? item.SpecialRemarks
          : this.DeliveryAddress,
        ProjectStage: '',
        Remarks: item.SpecialRemarks
          ? item.SpecialRemarks
          : this.DeliveryAddress,
        OrderSource: 'UX',
        TransportMode: item.Transport ? item.Transport : this.Transport,
        BBSStandard: '',
        UpdateDate: new Date(),
        UpdateBy: 'jagdishH_ttl@natsteel.com.sg',
      };
      this.createSharedService.JobAdviceCAB = obj;
    }
    let route = this.getProductDetailsRoute(
      item.StructureElement,
      item.Product,
      this.isPrecastFlag,
      IsPRecastRoute
    );

    this.router.navigate([route]);

    // setTimeout(() => {
    //   // You can set a specific message to display after the timeout
    // }, 1000);
  }

  setRemarks() {
    this.Remarks = '';
    if (this.DeliveryAddress) {
      this.Remarks = this.DeliveryAddress.trim();
    }
    if (this.GoodsReceiver) {
      if (this.Remarks != '') {
        this.Remarks = this.Remarks + ' / ';
      }
      this.Remarks =
        this.Remarks +
        this.GoodsReceiver.trim() +
        ' ' +
        this.ReceiverHandphone.trim();
    }

    if (this.SiteContact.trim() != this.GoodsReceiver.trim()) {
      if (this.SiteHandphone.trim() || this.SiteContact.trim()) {
        if (this.Remarks != '') {
          this.Remarks = this.Remarks + ' / ';
        }
        this.Remarks =
          this.Remarks +
          this.SiteContact.trim() +
          ' ' +
          this.SiteHandphone.trim();
      }
    }
    if (this.BBSDescription.trim() != '') {
      this.Remarks = this.Remarks + ' / ' + this.BBSDescription.trim();
    }

    if (this.AdditionalRemarks) {
      this.Remarks =
        this.Remarks + ' / ' + this.AdditionalRemarks.toUpperCase().trim();
    }
    if (this.Remarks.length > 100) {
      this.Remarks = this.Remarks.slice(0, 100);
    }
    this.Remarks = this.Remarks.toUpperCase();
  }

  // createOrder() {
  //   console.log('create order', this.OrderSummaryTableData);

  //   this.listofOrders = [];

  //   for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
  //     let WBS = this.OrderSummaryTableData[i].WBS.split('/');
  //     let ordertype: string = '';
  //     if (WBS[0] != '') {
  //       ordertype = 'WBS';
  //     } else {
  //       ordertype = 'NONWBS';
  //     }

  //     let obj: AddToCart = {
  //       pCustomerCode: this.CustomerCode,
  //       pProjectCode: this.ProjectCode,
  //       pOrderType: ordertype,
  //       pOrderNo: 0,
  //       pStructureElement: this.OrderSummaryTableData[i].StructureElement,
  //       pProductType: this.OrderSummaryTableData[i].Product,
  //       pWBS1: WBS[0],
  //       pWBS2: WBS[1],
  //       pWBS3: WBS[2],
  //       pPONo: this.PONO,
  //       pScheduledProd: 'N',
  //       pPostID: 0,
  //     };

  //     if (obj.pOrderType == 'NONWBS') {
  //       // obj.pStructureElement = ""
  //       obj.pWBS1 = ""
  //       obj.pWBS2 = ""
  //       obj.pWBS3 = ""
  //     }
  //     console.log(obj);
  //     this.listofOrders.push(obj);
  //     console.log(this.listofOrders);
  //   }

  //   // this.AddToCart(this.listofOrders[this.currentListOrderIndex]);
  //   // alert('Order Created Succesfully');
  //   this.toastr.success('Order Created Succesfully');

  // }

  async GetOrderSummary() {
    console.log('this.OrderSummaryList22', this.OrderSummaryList);
    if (
      this.OrderSummaryList.pSelectedProd == 'CUT-TO-SIZE-MESH' &&
      this.OrderSummaryList.pSelectedSE != 'NONWBS'
    ) {
      debugger;
      this.IsPrecast = true;
    }

    if (this.OrderSubmitted == true) {
      return;
    }
    this.OrderSummaryLoading = true;
    let lSelectedCount: number = this.OrderSummaryList.pOrderNo
      ? this.OrderSummaryList.pOrderNo.split(',').length
      : 0;
    if (lSelectedCount) {
      this.OrderSummaryList.pSelectedCount = lSelectedCount;
    }
    // this.OrderSummaryList.pSelectedCount =  this.OrderSummaryList.pSelectedSE.split(',').length;
    this.orderService.GetOrderSummary(this.OrderSummaryList).subscribe({
      next: async (response: any) => {
        console.log('response', response);
        await this.getTableData(response);

        let currStatus: any = response.lPEStatus.split(',');
        this.lOrderStatus = currStatus[0]; // response.lPEStatus;// response.lOrderStatusT; //response.lPEStatus
        this.lOrderStatus = response.lOrderStatusT;
        // console.log('orderstatus', this.lOrderStatus);

        if (this.OrderSubmitted == false) {
          this.reloadService.reloadProjectInputs.emit(this.lOrderStatus);
        }
        // let temp = response
        /** Old condition for Field disable in OrderSummary */
        // if (this.lOrderStatus) {
        //   if (this.lOrderStatus.toLowerCase().includes('created')) {
        //     this.isEditble = true;
        //   } else {
        //     this.isEditble = false;
        //   }
        // }

        // console.log('this.isEditble', this.isEditble);
        debugger;
        this.PONO = response.lPONumber;
        this.PODate = response.lPODate;
        // this.PODate = this.getDate(this.PODate)
        this.RequiredDate = response.lRequiredDate;
        this.orgReqDate = response.lRequiredDate;
        // this.RequiredDate = this.getDate(this.RequiredDate)
        this.Transport =
          response.lTransport == '' || response.lTransport == null
            ? 'TR40/24'
            : response.lTransport;
        this.SiteContact = response.Scheduler_Name;
        this.SiteHandphone = response.Scheduler_HP;
        this.SiteEmail = response.Scheduler_Email;
        this.GoodsReceiver = response.SiteEngr_Name;
        this.ReceiverHandphone = response.SiteEngr_HP;
        this.ReceiverEmail = response.SiteEngr_Email;
        this.DeliveryAddress = response.Remarks;
        this.AdditionalRemarks = response.DeliveryAddress;
        this.BBSDescription = '';
        this.Remarks =
          this.DeliveryAddress +
          ' / ' +
          this.GoodsReceiver +
          ' ' +
          this.ReceiverHandphone;
        if (this.SiteContact != this.GoodsReceiver) {
          this.Remarks =
            this.Remarks + ' / ' + this.SiteContact + ' ' + this.SiteHandphone;
        }
        if (this.BBSDescription != '') {
          this.Remarks = this.Remarks + ' / ' + this.BBSDescription.trim();
        }

        this.PMAddress = response.Address;
        this.PMGate = response.Gate;
        this.setPMAdress(this.PMAddress);

        // FOR COULUMS UNDER SEPARATE DELIVERY
        this.setPONO(this.PONO);
        this.setReqDate(this.RequiredDate);
        this.setTransport(this.Transport);
        this.setSpecialRemarks(this.DeliveryAddress);
        this.setAdditionalRemarks(this.AdditionalRemarks);
        this.setSiteContact(this.SiteContact);
        this.setHandphone(this.SiteHandphone);
        this.setGoodsReceiver(this.GoodsReceiver);
        this.setGoodsReceiverHandphone(this.ReceiverHandphone);

        for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
          // For Common Details

          if (this.lOrderStatus != 'Created') {
            if (this.OrderSummaryTableData.length == 1) {
              // Update Common Data when not routed form DraftOrder
              console.log('Update Common Data when not routed form DraftOrder');
              this.PONO = response.lPONos[i] ? response.lPONos[i] : this.PONO;
              this.RequiredDate = response.lRDs[i]
                ? response.lRDs[i]
                : this.RequiredDate;
              this.Transport = response.lTransports[i]
                ? response.lTransports[i]
                : this.Transport;
              // this.SiteContact = response.lSiteContacts[i]
              this.SiteContact = response.lSiteContacts[i]
                ? response.lSiteContacts[i]
                : this.SiteContact;
              this.SiteHandphone = response.lHandphones[i]
                ? response.lHandphones[i]
                : this.SiteHandphone;
              this.GoodsReceiver = response.lGoodsReceivers[i]
                ? response.lGoodsReceivers[i]
                : this.GoodsReceiver;
              this.ReceiverHandphone = response.lGoodsReceiverHandphones[i]
                ? response.lGoodsReceiverHandphones[i]
                : this.ReceiverHandphone;
              this.DeliveryAddress = response.lRemark[i]
                ? response.lRemark[i]
                : this.DeliveryAddress;
              this.AdditionalRemarks = response.AdditionalRemark[i]
                ? response.AdditionalRemark[i]
                : this.AdditionalRemarks;
            }
          }
          if (this.OrderSummaryTableData[i].Product == 'CAB') {
            await this.SetBBS(i, this.OrderSummaryTableData[i].OrderNumber);
          }
          // this.OrderSummaryTableData[i].RequiredDate = this.getDate(response.lRDs[i])
          this.OrderSummaryTableData[i].RequiredDate = response.lRDs[i];
          this.OrderSummaryTableData[i].PONumber = response.lPONos[i];
          this.OrderSummaryTableData[i].SpecialRemarks =
            response.lRemark[i] == null || response.lRemark[i] == ''
              ? this.OrderSummaryTableData[i].SpecialRemarks
              : response.lRemark[i];
          this.OrderSummaryTableData[i].SiteContact =
            response.lSiteContacts[i] == null || response.lSiteContacts[i] == ''
              ? this.OrderSummaryTableData[i].SiteContact
              : response.lSiteContacts[i];
          this.OrderSummaryTableData[i].Handphone =
            response.lHandphones[i] == null || response.lHandphones[i] == ''
              ? this.OrderSummaryTableData[i].Handphone
              : response.lHandphones[i];
          this.OrderSummaryTableData[i].GoodsReceiver =
            response.lGoodsReceivers[i] == null ||
            response.lGoodsReceivers[i] == ''
              ? this.OrderSummaryTableData[i].GoodsReceiver
              : response.lGoodsReceivers[i];
          this.OrderSummaryTableData[i].GoodsReceiverHandphone =
            response.lGoodsReceiverHandphones[i] == null ||
            response.lGoodsReceiverHandphones[i] == ''
              ? this.OrderSummaryTableData[i].GoodsReceiverHandphone
              : response.lGoodsReceiverHandphones[i];
          this.OrderSummaryTableData[i].Transport =
            response.lTransports[i] == ''
              ? this.OrderSummaryTableData[i].Transport
              : response.lTransports[i];
          this.OrderSummaryTableData[i].OrderQty = response.lQty[i]
            ? response.lQty[i]
            : 0;
          this.OrderSummaryTableData[i].OrderTonnage = response.lWT[i]
            ? response.lWT[i]
            : 0;

          let lDocuments = await this.getAttachedTableListAsync(
            this.OrderSummaryTableData[i].OrderNumber,
            this.OrderSummaryTableData[i].StructureElement,
            this.OrderSummaryTableData[i].Product,
            this.OrderSummaryTableData[i].ScheduledProd
          );
          if (lDocuments) {
            this.OrderSummaryTableData[i].NoofAttachedDoc = lDocuments.length;
            this.NumberofDocuments.push(lDocuments.length);
          }
        }

        console.log('Number Od Docs -> ', this.NumberofDocuments);
        this.getTransportList();
        this.getPOList();
        this.getDeliveryAddress();

        let Submission = response.lSubmission;
        this.gSubmission = response.lSubmission;
        let Editable = response.lEditable;
        this.gEditable = response.lEditable;
        let PlanEntCompl = response.lPlanEntCompl;
        this.showSubmitButton(Submission, Editable, PlanEntCompl);
        /** Updated condition for Field disable in OrderSummary */
        let lUserID = this.loginService.GetGroupName();
        let lSubmitRight = response.lSubmission; // this.commonService.Submission;
        if (
          this.lOrderStatus == null ||
          this.lOrderStatus == '' ||
          this.lOrderStatus == 'New' ||
          this.lOrderStatus == 'Created' ||
          (this.lOrderStatus == 'Created*' &&
            lUserID.toLowerCase().indexOf('natsteel.com.sg') > 0) ||
          this.lOrderStatus == 'Reserved' ||
          (this.lOrderStatus == 'Sent' && lSubmitRight == 'Yes')
        ) {
          this.isEditble = true;
        } else {
          this.isEditble = false;
        }

        if (this.lOrderStatus == 'Sent' && lSubmitRight == 'Yes') {
          this.pOrderUnderApproval = true;
        }

        if (this.PONO != undefined || this.PONO != '') {
          this.validatePoNumberNoMessage(this.PONO);
        }

        /**
         * Check if the order is converted from Upcoming Orders
         */
        this.CheckForUpcomingOrder();

        /**
         * Vishal API Call
         */
        this.GetPMMProjectDetails(this.ProjectCode);
        this.GetPMMProjectDetailsAddandGate(this.ProjectCode,this.CustomerCode);

        this.OrderSummaryLoading = false;
      },
      error: () => {
        this.OrderSummaryLoading = false;
      },
      complete: () => {
        this.OrderSummaryLoading = false;
      },
    });
  }

  async getAttachedTableListAsync(
    OrderNumber: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ): Promise<any> {
    try {
      const data = this.orderService
        .check_OrderDocs(
          OrderNumber,
          StructureElement,
          ProductType,
          ScheduledProd
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  // getAttachedTableList() {
  //   let OrderNumber = this.OrderNumber; // 311629; //this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
  //   let StructureElement = this.StructureElement; // 'BEAM'; //this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
  //   let ProductType = this.ProductType; // 'CAB'; //this.JobID; //735 ;//this.selectedRow[0].JobID;
  //   let ScheduledProd = this.ScheduledProd; // 'N'; //true;

  //   this.orderService
  //     .check_OrderDocs(
  //       OrderNumber,
  //       StructureElement,
  //       ProductType,
  //       ScheduledProd
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         console.log('ListofDocuments', response);
  //       },
  //       error: (e) => { },
  //       complete: () => {

  //       },
  //     });
  // }

  setSeparateDeliveryData(showDetails: boolean) {
    if (showDetails) {
      this.commonDataCollapse = true;
    }
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      this.OrderSummaryTableData[i].RequiredDate = this.OrderSummaryTableData[i]
        .RequiredDate
        ? this.OrderSummaryTableData[i].RequiredDate
        : this.RequiredDate;
      this.OrderSummaryTableData[i].PONumber = this.OrderSummaryTableData[i]
        .PONumber
        ? this.OrderSummaryTableData[i].PONumber.trim()
        : this.PONO;
      this.OrderSummaryTableData[i].SpecialRemarks = this.OrderSummaryTableData[
        i
      ].SpecialRemarks
        ? this.OrderSummaryTableData[i].SpecialRemarks.trim()
        : this.DeliveryAddress;
      this.OrderSummaryTableData[i].SiteContact = this.OrderSummaryTableData[i]
        .SiteContact
        ? this.OrderSummaryTableData[i].SiteContact.trim()
        : this.SiteContact;
      this.OrderSummaryTableData[i].Handphone = this.OrderSummaryTableData[i]
        .Handphone
        ? this.OrderSummaryTableData[i].Handphone.trim()
        : this.SiteHandphone;
      this.OrderSummaryTableData[i].GoodsReceiver = this.OrderSummaryTableData[
        i
      ].GoodsReceiver
        ? this.OrderSummaryTableData[i].GoodsReceiver.trim()
        : this.GoodsReceiver;
      this.OrderSummaryTableData[i].GoodsReceiverHandphone = this
        .OrderSummaryTableData[i].GoodsReceiverHandphone
        ? this.OrderSummaryTableData[i].GoodsReceiverHandphone.trim()
        : this.ReceiverHandphone;
      this.OrderSummaryTableData[i].Transport = this.OrderSummaryTableData[i]
        .Transport
        ? this.OrderSummaryTableData[i].Transport.trim()
        : this.Transport;
    }
  }

  async getBBS(obj: any): Promise<any> {
    try {
      const data = await this.orderService.getBBSOrder(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getJOBId(index: any, ordernumber: any): Promise<any> {
    let ProdType = this.OrderSummaryTableData[index].Product;
    let StructurEelement = this.OrderSummaryTableData[index].StructureElement;
    let ScheduleProd = this.OrderSummaryTableData[index].ScheduledProd;
    try {
      const data = await this.orderService
        .getJobId(ordernumber, ProdType, StructurEelement, ScheduleProd)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async SetBBS(index: any, OrderNumber: any) {
    let respJobId = await this.getJOBId(index, OrderNumber);
    console.log('respJobId', respJobId);
    if (respJobId == false) {
      // alert('*Error in getting BBS Number & Description');
      return;
    }
    let obj = {
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,
      JobID: respJobId.CABJOBID,
    };

    let reponseBBS = await this.getBBS(obj);
    console.log('reponseBBS', reponseBBS);
    if (reponseBBS === false) {
      alert('Error in getting BBS Number & Description');
      return;
    }
    if (reponseBBS.length > 0) {
      this.OrderSummaryTableData[index].BBSNumnber = reponseBBS[0].BBSNo;
      this.OrderSummaryTableData[index].BBSDescription = reponseBBS[0].BBSDesc;
      this.OrderSummaryTableData[index].BBS = reponseBBS[0];
    }
  }

  // AddToCart(obj: AddToCart) {
  //   this.orderService.AddToCart(obj).subscribe({
  //     next: (response: any) => {
  //       console.log('ORDER NUMBER', response);
  //       this.currentListOrderIndex = this.currentListOrderIndex + 1;

  //       if (this.currentListOrderIndex < this.listofOrders.length) {
  //         this.AddToCart(this.listofOrders[this.currentListOrderIndex]);
  //       } else {
  //         this.currentListOrderIndex = 0;
  //       }
  //     },
  //     error: () => { },
  //     complete: () => { },
  //   });
  // }

  GetCouplerForCABPOPUP(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number
  ): void {
    this.orderService
      .getOrderDetailsCAB(CustomerCode, ProjectCode, JobID)
      .subscribe({
        next: (response) => {
          console.log('response', response);
          if (response.CouplerType) {
            this.CabOrderDetails_Coupler = response.CouplerType;
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  GetOrderProductForCABPOPUP(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number
  ): void {
    //debugger;
    let obj: any = {
      CustomerCode: CustomerCode,
      ProjectCode: ProjectCode,
      JobID: JobID,
    };
    this.orderService.OrderDetailsForCABPOPUP(obj).subscribe({
      next: (response) => {
        console.log('response', response);
        this.CabOrderDetails = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }
  GetCouplerType() {
    let CustomerCode = this.CustomerCode;
    let ProjectCode = this.ProjectCode;
    this.orderService.getCouplerType(CustomerCode, ProjectCode).subscribe({
      next: (response) => {
        console.log(response);
        this.CouplerList = response;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  setPONO(pono: any) {
    debugger;
    if (pono) {
      pono = pono.toUpperCase();
    }
    this.OrderSummaryTableData.forEach((element) => {
      element.PONumber = pono;
      this.CheckPOforCAB(element, pono);
    });
  }
  setReqDate(RequiredDate: any) {
    this.OrderSummaryTableData.forEach((element) => {
      element.RequiredDate = RequiredDate;
    });
  }
  setTransport(transport: any) {
    this.OrderSummaryTableData.forEach((element) => {
      element.Transport = transport;
    });
  }
  setSpecialRemarks(SpecialRemarks: any) {
    if (SpecialRemarks) {
      SpecialRemarks = SpecialRemarks.toUpperCase();
      this.OrderSummaryTableData.forEach((element) => {
        if (
          element.SpecialRemarks == '' ||
          element.SpecialRemarks == undefined
        ) {
          element.SpecialRemarks = SpecialRemarks;
        }
      });
    }
  }
  setAdditionalRemarks(AdditionalRemarks: any) {
    if (AdditionalRemarks) {
      AdditionalRemarks = AdditionalRemarks.toUpperCase();
      this.OrderSummaryTableData.forEach((element) => {
        if (
          element.AdditionalRemark == '' ||
          element.AdditionalRemark == undefined
        ) {
          element.AdditionalRemark = AdditionalRemarks;
        }
      });
    }
  }
  setSiteContact(SiteContact: any) {
    if (SiteContact) {
      SiteContact = SiteContact.toUpperCase();
      this.OrderSummaryTableData.forEach((element) => {
        if (element.SiteContact == '' || element.SiteContact == undefined) {
          element.SiteContact = SiteContact;
        }
      });
    }
  }
  setHandphone(Handphone: any) {
    if (Handphone) {
      Handphone = Handphone.toUpperCase();
      this.OrderSummaryTableData.forEach((element) => {
        if (element.Handphone == '' || element.Handphone == undefined) {
          element.Handphone = Handphone;
        }
      });
    }
  }
  setGoodsReceiver(GoodsReceiver: any) {
    if (GoodsReceiver) {
      GoodsReceiver = GoodsReceiver.toUpperCase();
      this.OrderSummaryTableData.forEach((element) => {
        if (element.GoodsReceiver == '' || element.GoodsReceiver == undefined) {
          element.GoodsReceiver = GoodsReceiver;
        }
      });
    }
  }
  setGoodsReceiverHandphone(GoodsReceiverHandphone: any) {
    if (GoodsReceiverHandphone) {
      GoodsReceiverHandphone = GoodsReceiverHandphone.toUpperCase();
      this.OrderSummaryTableData.forEach((element) => {
        if (
          element.GoodsReceiverHandphone == '' ||
          element.GoodsReceiverHandphone == undefined
        ) {
          element.GoodsReceiverHandphone = GoodsReceiverHandphone;
        }
      });
    }
  }

  setSpecialRemarksM(SpecialRemarks: any) {
    SpecialRemarks = SpecialRemarks.toUpperCase();
    this.OrderSummaryTableData.forEach((element) => {
      element.SpecialRemarks = SpecialRemarks;
    });
  }
  setAdditionalRemarksM(AdditionalRemarks: any) {
    AdditionalRemarks = AdditionalRemarks.toUpperCase();
    this.OrderSummaryTableData.forEach((element) => {
      element.AdditionalRemark = AdditionalRemarks;
    });
  }
  setSiteContactM(SiteContact: any) {
    SiteContact = SiteContact.toUpperCase();
    this.OrderSummaryTableData.forEach((element) => {
      element.SiteContact = SiteContact;
    });
    // Function called when the value of the field is changed.
    this.updateSiteContact(SiteContact);
  }
  setHandphoneM(Handphone: any) {
    Handphone = Handphone.toUpperCase();
    this.OrderSummaryTableData.forEach((element) => {
      element.Handphone = Handphone;
    });
  }
  setGoodsReceiverM(GoodsReceiver: any) {
    GoodsReceiver = GoodsReceiver.toUpperCase();
    this.OrderSummaryTableData.forEach((element) => {
      element.GoodsReceiver = GoodsReceiver;
    });
    // Function called when the value of the field is changed.
    this.updateGoodsReceiver(GoodsReceiver); // ODOS CR
  }
  setGoodsReceiverHandphoneM(GoodsReceiverHandphone: any) {
    GoodsReceiverHandphone = GoodsReceiverHandphone.toUpperCase();
    this.OrderSummaryTableData.forEach((element) => {
      element.GoodsReceiverHandphone = GoodsReceiverHandphone;
    });
  }

  showError(item: any): boolean {
    if (item == '' || item == undefined) {
      this.setBorderBottom(true);
      return true;
    }
    this.setBorderBottom(false);
    return false;
  }
  setBorderBottom(isTrue: boolean) {
    if (isTrue) {
      this.borderBottom = '3px solid red';
    } else {
      this.borderBottom = '0.5 px solid #ced4da;';
    }
    // '3px solid red':'0.5 px solid #ced4da;'
  }

  showSubmitButton(Submission: any, Editable: any, PlanEntCompl: any) {
    // let Submission = 'Yes';
    // let Editable = 'Yes';
    let UserName = this.loginService.GetGroupName(); //TEMPORARY

    this.ShowApprove = false;
    this.ShowSubmit = false;
    this.ShowSendApproval = false;
    this.ShowCreate = false;
    this.Showithdraw = false;
    this.ShowReject = false;

    // debugger;
    // if (this.lDataHaveCT == this.lDataNeedCT && EntryCompl == "Yes") {
    if (this.lDataHaveCT == this.lDataNeedCT && PlanEntCompl == 'Yes') {
      if (
        this.lOrderStatus == null ||
        this.lOrderStatus == 'New' ||
        this.lOrderStatus == 'Created' ||
        this.lOrderStatus == 'Created*' ||
        this.lOrderStatus == 'Submitted*' ||
        this.lOrderStatus == 'Sent'
      ) {
        if (Submission == 'Yes') {
          if (this.lOrderStatus == 'Sent') {
            // <button  > Approve Order < /button>
            this.ShowApprove = true;
          } else {
            // <button  > Submit Order < /button>
            this.ShowSubmit = true;
          }
        } else {
          if (
            this.lOrderStatus != null &&
            (this.lOrderStatus == 'New' ||
              this.lOrderStatus == 'Created' ||
              this.lOrderStatus == 'Created*')
          ) {
            // <button  > Send for Approval < /button>
            this.ShowSendApproval = true;
          }
        }
      }
    }
    // debugger;
    if (
      UserName != null &&
      UserName.split('@').length == 2 &&
      UserName.split('@')[1].toLowerCase() == 'natsteel.com.sg'
    ) {
      if (
        this.lOrderStatus != null &&
        (this.lOrderStatus == 'New' || this.lOrderStatus == 'Created')
      ) {
        var lFound = 0;
        for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
          if (this.OrderSummaryTableData[i].ScheduledProd.trim() == 'Y') {
            lFound = 1;
            break;
          }
        }
        // debugger;
        // if (lFound == 0 && (this.lDataHaveCT == 0 || EntryCompl != "Yes")) {
        if ((lFound == 0 && this.lDataHaveCT == 0) || PlanEntCompl != 'Yes') {
          // <button > Create Order * </button>
          this.ShowCreate = true;
        }
      }
    }

    if (
      this.lOrderStatus != null &&
      (this.lOrderStatus == 'Submitted' || this.lOrderStatus == 'Submitted*')
    ) {
      if (Submission == 'Yes') {
        // <button  > Withdraw < /button>
        this.Showithdraw = true;
      }
    }
    if (
      this.lOrderStatus != null &&
      this.lOrderStatus == 'Created*' &&
      UserName != null &&
      UserName.split('@').length == 2 &&
      UserName.split('@')[1].toLowerCase() == 'natsteel.com.sg'
    ) {
      if (Editable == 'Yes') {
        // <button  > Withdraw < /button>
        this.Showithdraw = true;
      }
    }
    // if (this.lOrderStatus != null && this.lOrderStatus == "Created") {
    //   if (Submission != "Yes") {
    //     // <button  > Withdraw < /button>
    //     this.Showithdraw = true;

    //   }
    // }
    if (this.lOrderStatus != null && this.lOrderStatus == 'Sent') {
      if (Submission != 'Yes') {
        // <button  > Withdraw < /button>
        this.Showithdraw = true;
      }
    }
    if (
      this.lOrderStatus != null &&
      this.lOrderStatus == 'Sent' &&
      Submission == 'Yes'
    ) {
      // <button  > Reject < /button>
      this.ShowReject = true;
    }

    // FOR NON-WBS BPC ORDERS
    // if (this.lOrderStatus == 'Created' || this.lOrderStatus == 'Created*') {
    //   if (this.OrderSummaryTableData.length == 1) {
    //     if (this.OrderSummaryTableData[0].StructureElement == 'NONWBS') {
    //       if (
    //         this.OrderSummaryTableData[0].Product == 'BPC' &&
    //         Number(this.OrderSummaryTableData[0].OrderQty) == 0
    //       ) {
    //         this.ShowSubmit = false;
    //       } else {
    //         this.ShowCreate = false;
    //       }
    //     }
    //   }
    // }
    this.updateItemPO();
  }

  temp() {
    let temp = this.datepipe.transform(this.RequiredDate, 'yyyy-MM-dd');
    console.log(temp);
  }

  pageno: any;

  flagPO: boolean = false;
  originalPO: any = '';

  async getQty(obj: any) {
    console.log('obj.precastQty-', obj.precastQty);
    let id = 0;
    let postID = await this.getJobId(
      obj.OrderNumber,
      obj.Product,
      obj.StructureElement,
      obj.ScheduledProd
    );
    if (postID.PostHeaderID == 0) {
      id = postID.PrecastJobID;
    } else {
      id = postID.PostHeaderID;
    }
    console.log('postID-', id);
    let totalqty = await this.GetPrecastDetails(
      this.CustomerCode,
      this.ProjectCode,
      id,
      obj
    );
    console.log('totalqty-', totalqty);
    // obj.precastQty=totalqty;
    // await this.orderService
    // .getPrecastDetails(this.CustomerCode, this.ProjectCode, obj.PostId)
    // .subscribe({
    //   next: (response) => {
    //     this.PrecastArray = response ? response : [];
    //     console.log("this.PrecastArray[0].PageNo", this.PrecastArray[0].PageNo);
    //     obj.pageNo = this.PrecastArray[0].PageNo;
    //     // return this.PrecastArray[0].PageNo;
    //   },
    //   error: (e) => { },
    //   complete: () => {

    //     this.OrderSummaryTableData.push(obj);
    //   },
    // });
    // this.OrderSummaryTableData.push(obj);
    console.log('obj.precastQty-', obj.precastQty);
  }

  async changePO(item: any) {
    debugger;
    if (!this.flagPO) {
      this.originalPO = this.PONO;
    }
    console.log('changepoitem', item);
    if (this.OrderSummaryTableData.length > 1) {
      if (this.isPrecastFlag) {
        let pageno = '-' + item.pageNo.toString();
        if (item.pageNo != undefined && item.pageNo != 0) {
          if (!item.PONumber.includes(pageno)) {
            if (item.PONumber != null && item.PONumber != '') {
              item.PONumber = item.PONumber + '-' + item.pageNo.toString();
            }
          }
        }
      } else {
        item.PONumber = this.PONO;
      }
    } else {
      // if(!this.flagPO){
      //   this.originalPO= this.PONO;
      // }
      if (this.isPrecastFlag) {
        let pageno = '-' + item.pageNo.toString();
        if (item.pageNo != undefined && item.pageNo != 0) {
          if (this.PONO != null && this.PONO != '') {
            if (!this.PONO.includes(pageno)) {
              this.PONO = this.PONO + pageno;
              this.flagPO = true;
            }
          }
        }
      } else {
        this.PONO = this.originalPO;
      }
    }
    // await this.getQty(item);
  }

  SaveDetails() {
    // Button call from UI.
    this.submitOrderstatus = '';
    this.SaveOrder();
  }

  async SaveOrder() {
    let UpdateBy = this.loginService.GetGroupName();
    // Transport Mode Validation
    if (!(await this.CheckCABTransportMode())) {
      return;
    }
    debugger;
    this.saveorderdata = [];
    // if(this.precast){
    //   if(localStorage.getItem("PageNumber")){
    //     this.PONO = this.PONO + "-" + localStorage.getItem("PageNumber") ?? "" ;
    //     localStorage.removeItem("PageNumber")
    //   }
    // }
    //ASSIGN VALUE TO SAVEORDERDATA

    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      console.log('OrderSummaryTableData22', this.OrderSummaryTableData);
      if (this.OrderSummaryTableData[i].StructureElement != 'NONWBS') {
        if (this.OrderSummaryTableData.length > 1) {
          if (this.OrderSummaryTableData[i].IsPrecast) {
            if (
              this.OrderSummaryTableData[i].pageNo != undefined &&
              this.OrderSummaryTableData[i].pageNo != 0 &&
              this.OrderSummaryTableData[i].PONumber != null
            ) {
              let pageno_temp =
                '-' + this.OrderSummaryTableData[i].pageNo.toString();
              if (
                this.OrderSummaryTableData[i].PONumber != '' &&
                this.OrderSummaryTableData[i].PONumber != undefined &&
                this.OrderSummaryTableData[i].PONumber != null
              ) {
                if (
                  !this.OrderSummaryTableData[i].PONumber.toString().includes(
                    pageno_temp
                  )
                ) {
                  this.OrderSummaryTableData[i].PONumber =
                    this.OrderSummaryTableData[i].PONumber + pageno_temp;
                }
              }
            }
          }
        } else {
          debugger;
          if (this.isPrecastFlag) {
            let pageno_temp =
              '-' + this.OrderSummaryTableData[i].pageNo.toString();
            console.log('call check for po:', this.PONO);
            if (
              this.PONO != undefined &&
              this.PONO != null &&
              this.PONO != ''
            ) {
              if (!this.PONO.includes(pageno_temp)) {
                this.PONO = this.PONO + pageno_temp;
              }
            }
          }
        }
      }

      let item: saveOrderDetailsModel = {
        pOrderHeader: {
          OrderNumber: Number(this.OrderSummaryTableData[i].OrderNumber),
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          OrderJobID: 0,
          OrderType: this.OrderSummaryTableData[0].WBS ? 'WBS' : 'NONWBS',
          WBS1: this.OrderSummaryTableData[i].WBS1
            ? this.OrderSummaryTableData[i].WBS1
            : '',
          WBS2: this.OrderSummaryTableData[i].WBS2
            ? this.OrderSummaryTableData[i].WBS2
            : '',
          WBS3: this.OrderSummaryTableData[i].WBS3
            ? this.OrderSummaryTableData[i].WBS3
            : '',
          Remarks: this.DeliveryAddress ? this.DeliveryAddress : '',
          DeliveryAddress: this.AdditionalRemarks ? this.AdditionalRemarks : '',
          SiteEngr_Name: this.GoodsReceiver ? this.GoodsReceiver : '',
          SiteEngr_HP: this.ReceiverHandphone ? this.ReceiverHandphone : '',
          SiteEngr_Email: this.ReceiverEmail ? this.ReceiverEmail : '',
          Scheduler_Name: this.SiteContact ? this.SiteContact : '',
          Scheduler_HP: this.SiteHandphone ? this.SiteHandphone : '',
          Scheduler_Email: this.SiteEmail ? this.SiteEmail : '',
          TotalWeight: Number(this.OrderSummaryTableData[i].OrderTonnage), // this.gettotalWeight(this.OrderSummaryTableData),
          OrderStatus: this.lOrderStatus,
          OrderSource: 'UX',
          PONumber: this.PONO ? this.PONO : '',
          PODate: new Date(this.PODate == '' ? this.today : this.PODate),
          RequiredDate: this.RequiredDate
            ? new Date(this.RequiredDate)
            : new Date(),
          OrigReqDate: this.orgReqDate ? new Date(this.orgReqDate) : new Date(),
          TransportMode: this.Transport ? this.Transport : '',
          UpdateDate: new Date(this.today),
          UpdateBy: UpdateBy,
          SubmitDate: new Date(this.today),
          SubmitBy: UpdateBy,
          OrderShared: true,
          Address: this.PMAddress ? this.PMAddress : null,
          Gate: this.PMGate ? this.PMGate : null,
        },
        pOrderCart: [
          {
            OrderNumber: Number(this.OrderSummaryTableData[i].OrderNumber),
            StructureElement: this.OrderSummaryTableData[i].StructureElement,
            ProductType: this.OrderSummaryTableData[i].Product,
            ScheduledProd: this.OrderSummaryTableData[i].ScheduledProd,
            PONumber: this.OrderSummaryTableData[i].PONumber
              ? this.OrderSummaryTableData[i].PONumber
              : '',
            PODate: new Date(this.PODate == '' ? this.today : this.PODate),
            RequiredDate: this.OrderSummaryTableData[i].RequiredDate
              ? new Date(this.OrderSummaryTableData[i].RequiredDate)
              : new Date(),
            OrigReqDate: this.orgReqDate
              ? new Date(this.orgReqDate)
              : new Date(),
            TransportMode: this.OrderSummaryTableData[i].Transport
              ? this.OrderSummaryTableData[i].Transport
              : this.Transport,
            CABJobID: 0,
            MESHJobID: 0,
            BPCJobID: 0,
            CageJobID: 0,
            CarpetJobID: 0,
            StdBarsJobID: 0,
            StdMESHJobID: 0,
            CoilProdJobID: 0,
            PostHeaderID: Number(this.OrderSummaryTableData[i].PostId),
            OrderStatus: this.lOrderStatus ? this.lOrderStatus : 'Created',
            TotalWeight: Number(this.OrderSummaryTableData[i].OrderTonnage),
            TotalPCs: Number(this.OrderSummaryTableData[i].OrderQty),
            SAPSOR: '',
            UpdateBy: UpdateBy,
            UpdateDate: new Date(this.today),
            ProcessBy: UpdateBy,
            ProcessDate: new Date(this.today),
            SpecialRemark: this.OrderSummaryTableData[i].SpecialRemarks
              ? this.OrderSummaryTableData[i].SpecialRemarks
              : '',
            SiteContact: this.OrderSummaryTableData[i].SiteContact
              ? this.OrderSummaryTableData[i].SiteContact
              : '',
            Handphone: this.OrderSummaryTableData[i].Handphone
              ? this.OrderSummaryTableData[i].Handphone
              : '',
            GoodsReceiver: this.OrderSummaryTableData[i].GoodsReceiver
              ? this.OrderSummaryTableData[i].GoodsReceiver
              : '',
            GoodsReceiverHandphone: this.OrderSummaryTableData[i]
              .GoodsReceiverHandphone
              ? this.OrderSummaryTableData[i].GoodsReceiverHandphone
              : '',
            AdditionalRemark: this.OrderSummaryTableData[i].AdditionalRemark
              ? this.OrderSummaryTableData[i].AdditionalRemark
              : '',
          },
        ],
      };

      item.pOrderHeader.PODate = new Date(
        new Date(item.pOrderHeader.PODate).getTime() -
          new Date(item.pOrderHeader.PODate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.RequiredDate = new Date(
        new Date(item.pOrderHeader.RequiredDate).getTime() -
          new Date(item.pOrderHeader.RequiredDate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.OrigReqDate = new Date(
        new Date(item.pOrderHeader.OrigReqDate).getTime() -
          new Date(item.pOrderHeader.OrigReqDate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.UpdateDate = new Date(
        new Date(item.pOrderHeader.UpdateDate).getTime() -
          new Date(item.pOrderHeader.UpdateDate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.SubmitDate = new Date(
        new Date(item.pOrderHeader.SubmitDate).getTime() -
          new Date(item.pOrderHeader.SubmitDate).getTimezoneOffset() * 60000
      );

      item.pOrderCart[0].PODate = new Date(
        new Date(item.pOrderCart[0].PODate).getTime() -
          new Date(item.pOrderCart[0].PODate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].RequiredDate = new Date(
        new Date(item.pOrderCart[0].RequiredDate).getTime() -
          new Date(item.pOrderCart[0].RequiredDate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].OrigReqDate = new Date(
        new Date(item.pOrderCart[0].OrigReqDate).getTime() -
          new Date(item.pOrderCart[0].OrigReqDate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].UpdateDate = new Date(
        new Date(item.pOrderCart[0].UpdateDate).getTime() -
          new Date(item.pOrderCart[0].UpdateDate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].ProcessDate = new Date(
        new Date(item.pOrderCart[0].ProcessDate).getTime() -
          new Date(item.pOrderCart[0].ProcessDate).getTimezoneOffset() * 60000
      );
      this.saveorderdata.push(item);

      // this.SaveOrderDetails(item)
    }
    //SAVE VALUE OF SAVEORDERDATA TO A SERVICE
    this.createSharedService.saveOrderDetailsData = this.saveorderdata;

    //CALL THE SAVEORDERDETAILS FUNCTION
    this.currSaveOrderIndex = 1;
    for (let i = 0; i < this.saveorderdata.length; i++) {
      this.SaveOrderDetails(this.saveorderdata[i]);
    }
  }

  SaveOrderDetails(item: saveOrderDetailsModel) {
    this.OrderSummaryLoading = true;

    this.orderService.SaveOrderDetails(item).subscribe({
      next: (response) => {
        console.log(response);
        // alert("Order Saved Successfully")
        if (this.currSaveOrderIndex < this.saveorderdata.length) {
          this.currSaveOrderIndex += 1;
        } else {
          // UPDATE THE TEMPORDERLIST FOR CREATEORDER
          this.UpdateTempOrderList();
          this.SaveContactList(); // Save the contact list in local storage

          this.currSaveOrderIndex = 1;
          this.toastr.success('Order Saved Succesfully');
          if (this.submitOrderstatus == 'Submit') {
            this.SubmitOrders();
          }
          if (this.submitOrderstatus == 'Create*') {
            this.CreateOrder();
          }
          if (this.submitOrderstatus == 'Send') {
            this.SendForApprovalOrders();
          }
          if (this.submitOrderstatus == 'Approval') {
            this.OrderApproval_POST();
          }
        }

        this.OrderSummaryLoading = false;
      },
      error: (e) => {
        this.OrderSummaryLoading = false;
      },
      complete: () => {
        this.OrderSummaryLoading = false;
      },
    });
  }

  UpdateProductValues(ordernum: any, structElement: any, product: any) {
    let obj = this.createSharedService.ProductValues;

    if (structElement.toUpperCase() == 'SLAB') {
      // obj.beamData
      let index = obj.slabData.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.slabData.isSelected[index]) {
        obj.slabData.isSelected[index] = false;
      }
    } else if (structElement.toUpperCase() == 'BEAM') {
      // obj.beamData
      let index = obj.beamData.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.beamData.isSelected[index]) {
        obj.beamData.isSelected[index] = false;
      }
    } else if (structElement.toUpperCase() == 'COLUMN') {
      // obj.beamData
      let index = obj.columnData.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.columnData.isSelected[index]) {
        obj.columnData.isSelected[index] = false;
      }
    } else if (structElement.toUpperCase() == 'SLAB-B') {
      // obj.beamData
      let index = obj.slabbData.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.slabbData.isSelected[index]) {
        obj.slabbData.isSelected[index] = false;
      }
    } else if (structElement.toUpperCase() == 'SLAB-T') {
      // obj.beamData
      let index = obj.slabtData.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.slabtData.isSelected[index]) {
        obj.slabtData.isSelected[index] = false;
      }
    } else if (structElement.toUpperCase() == 'WALL') {
      // obj.beamData
      let index = obj.walldata.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.walldata.isSelected[index]) {
        obj.walldata.isSelected[index] = false;
      }
    } else if (structElement.toUpperCase() == 'D-WALL') {
      // obj.beamData
      let index = obj.DwallData.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.DwallData.isSelected[index]) {
        obj.DwallData.isSelected[index] = false;
      }
    } else if (structElement.toUpperCase() == 'PILE') {
      // obj.beamData
      let index = obj.pileData.ProdCode.findIndex(
        (x: string) => x.toUpperCase() === product
      );
      console.log('index', index);
      if (obj.pileData.isSelected[index]) {
        obj.pileData.isSelected[index] = false;
      }
    }
  }

  deleteOrder(ordernum: any, structElement: any, product: any) {
    console.log(ordernum);
    console.log(this.createSharedService.tempOrderSummaryList);
    console.log(this.OrderSummaryList);
    console.log(window.history.state.tempOrderSummaryList);

    // loading start
    this.OrderSummaryLoading = true;

    // let index = this.createSharedService.tempOrderSummaryList.pOrderNo.findIndex((x: any) => x === Number(ordernum))
    if (!this.createSharedService.selectedTab) {
      let index: any = -1;
      //TRIALS
      for (
        let i = 0;
        i < this.createSharedService.tempOrderSummaryList.pSelectedProd.length;
        i++
      ) {
        if (
          this.createSharedService.tempOrderSummaryList.pOrderNo[i] ==
            ordernum &&
          this.createSharedService.tempOrderSummaryList.pSelectedProd[
            i
          ].toUpperCase() == product &&
          this.createSharedService.tempOrderSummaryList.pSelectedSE[i] ==
            structElement
        ) {
          index = i;
        }
      }

      if (index != -1) {
        // this.createSharedService.selectedOrderNumber.splice(index, 1)
        this.createSharedService.tempOrderSummaryList.pSelectedPostID.splice(
          index,
          1
        );
        this.createSharedService.tempOrderSummaryList.pSelectedProd.splice(
          index,
          1
        );
        this.createSharedService.tempOrderSummaryList.pSelectedSE.splice(
          index,
          1
        );
        this.createSharedService.tempOrderSummaryList.pSelectedScheduled.splice(
          index,
          1
        );
        this.createSharedService.tempOrderSummaryList.pOrderNo.splice(index, 1);
        this.createSharedService.tempOrderSummaryList.pSelectedWBS1.splice(
          index,
          1
        );
        this.createSharedService.tempOrderSummaryList.pSelectedWBS2.splice(
          index,
          1
        );
        this.createSharedService.tempOrderSummaryList.pSelectedWBS3.splice(
          index,
          1
        );

        // window.history.state.tempOrderSummaryList
        if (
          typeof window.history.state.tempOrderSummaryList.pSelectedProd ==
          'string'
        ) {
          // If value is string , then split it to convert into array
          window.history.state.tempOrderSummaryList.pSelectedPostID =
            window.history.state.tempOrderSummaryList.pSelectedPostID.split(
              ','
            );
          window.history.state.tempOrderSummaryList.pSelectedProd =
            window.history.state.tempOrderSummaryList.pSelectedProd.split(',');
          window.history.state.tempOrderSummaryList.pSelectedSE =
            window.history.state.tempOrderSummaryList.pSelectedSE.split(',');
          window.history.state.tempOrderSummaryList.pSelectedScheduled =
            window.history.state.tempOrderSummaryList.pSelectedScheduled.split(
              ','
            );
          window.history.state.tempOrderSummaryList.pOrderNo =
            window.history.state.tempOrderSummaryList.pOrderNo.split(',');
          window.history.state.tempOrderSummaryList.pSelectedWBS1 =
            window.history.state.tempOrderSummaryList.pSelectedWBS1.split(',');
          window.history.state.tempOrderSummaryList.pSelectedWBS2 =
            window.history.state.tempOrderSummaryList.pSelectedWBS2.split(',');
          window.history.state.tempOrderSummaryList.pSelectedWBS3 =
            window.history.state.tempOrderSummaryList.pSelectedWBS3.split(',');
        }
        window.history.state.tempOrderSummaryList.pSelectedPostID.splice(
          index,
          1
        );
        window.history.state.tempOrderSummaryList.pSelectedProd.splice(
          index,
          1
        );
        window.history.state.tempOrderSummaryList.pSelectedSE.splice(index, 1);
        window.history.state.tempOrderSummaryList.pSelectedScheduled.splice(
          index,
          1
        );
        window.history.state.tempOrderSummaryList.pOrderNo.splice(index, 1);
        window.history.state.tempOrderSummaryList.pSelectedWBS1.splice(
          index,
          1
        );
        window.history.state.tempOrderSummaryList.pSelectedWBS2.splice(
          index,
          1
        );
        window.history.state.tempOrderSummaryList.pSelectedWBS3.splice(
          index,
          1
        );

        window.history.state.tempOrderSummaryList.pSelectedPostID =
          window.history.state.tempOrderSummaryList.pSelectedPostID.join(',');
        window.history.state.tempOrderSummaryList.pSelectedProd =
          window.history.state.tempOrderSummaryList.pSelectedProd.join(',');
        window.history.state.tempOrderSummaryList.pSelectedSE =
          window.history.state.tempOrderSummaryList.pSelectedSE.join(',');
        window.history.state.tempOrderSummaryList.pSelectedScheduled =
          window.history.state.tempOrderSummaryList.pSelectedScheduled.join(
            ','
          );
        window.history.state.tempOrderSummaryList.pOrderNo =
          window.history.state.tempOrderSummaryList.pOrderNo.join(',');
        window.history.state.tempOrderSummaryList.pSelectedWBS1 =
          window.history.state.tempOrderSummaryList.pSelectedWBS1.join(',');
        window.history.state.tempOrderSummaryList.pSelectedWBS2 =
          window.history.state.tempOrderSummaryList.pSelectedWBS2.join(',');
        window.history.state.tempOrderSummaryList.pSelectedWBS3 =
          window.history.state.tempOrderSummaryList.pSelectedWBS3.join(',');

        this.OrderSummaryList = window.history.state.tempOrderSummaryList;
        // this.OrderSummaryList.pOrderNo = this.OrderSummaryList.pOrderNo.join(",")

        //DELETING RECORD FROM DB
        let customer = this.CustomerCode;
        let project = this.ProjectCode;
        let order = ordernum;
        let UpdateBy = this.loginService.GetGroupName();
        this.orderService
          .ChangeStatus(customer, project, order, 'Delete', UpdateBy)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.toastr.error('Order Deleted Succesfully');
            },
            error: (e) => {
              alert(
                'Error on saving data. Please check the Internet connection and try again.'
              );
              this.OrderSummaryLoading = false;
            },
            complete: () => {
              this.OrderSummaryLoading = false;
            },
          });
        this.GetOrderSummary();
      }
    } else {
      //this.UpdateProductValues(ordernum, structElement, product);
      let index: any = -1;
      for (
        let i = 0;
        i <
        this.createSharedService.tempProjectOrderSummaryList.pOrderNo.length;
        i++
      ) {
        if (
          this.createSharedService.tempProjectOrderSummaryList.pOrderNo[i] ==
            ordernum &&
          this.createSharedService.tempProjectOrderSummaryList.pSelectedProd[
            i
          ].toUpperCase() == product &&
          this.createSharedService.tempProjectOrderSummaryList.pSelectedSE[i] ==
            structElement
        ) {
          index = i;
        }
      }

      if (index != -1) {
        // this.createSharedService.selectedOrderNumber.splice(index, 1)
        this.createSharedService.tempProjectOrderSummaryList.StructProd.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pSelectedPostID.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pSelectedProd.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pSelectedSE.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pSelectedScheduled.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pOrderNo.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pSelectedWBS1.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pSelectedWBS2.splice(
          index,
          1
        );
        this.createSharedService.tempProjectOrderSummaryList.pSelectedWBS3.splice(
          index,
          1
        );

        // window.history.state.tempOrderSummaryList

        window.history.state.tempOrderSummaryList.pSelectedPostID =
          this.deleteValue(
            window.history.state.tempOrderSummaryList.pSelectedPostID,
            index
          ); //.splice(index, 1)
        window.history.state.tempOrderSummaryList.pSelectedProd =
          this.deleteValue(
            window.history.state.tempOrderSummaryList.pSelectedProd,
            index
          ); //.splice(index, 1)
        window.history.state.tempOrderSummaryList.pSelectedSE =
          this.deleteValue(
            window.history.state.tempOrderSummaryList.pSelectedSE,
            index
          ); //.splice(index, 1)
        window.history.state.tempOrderSummaryList.pSelectedScheduled =
          this.deleteValue(
            window.history.state.tempOrderSummaryList.pSelectedScheduled,
            index
          ); //.splice(index, 1)
        window.history.state.tempOrderSummaryList.pOrderNo = this.deleteValue(
          window.history.state.tempOrderSummaryList.pOrderNo,
          index
        ); //.splice(index, 1)
        window.history.state.tempOrderSummaryList.pSelectedWBS1 =
          this.deleteValue(
            window.history.state.tempOrderSummaryList.pSelectedWBS1,
            index
          ); //.splice(index, 1)
        window.history.state.tempOrderSummaryList.pSelectedWBS2 =
          this.deleteValue(
            window.history.state.tempOrderSummaryList.pSelectedWBS2,
            index
          ); //.splice(index, 1)
        window.history.state.tempOrderSummaryList.pSelectedWBS3 =
          this.deleteValue(
            window.history.state.tempOrderSummaryList.pSelectedWBS3,
            index
          ); //.splice(index, 1)

        // window.history.state.tempOrderSummaryList.pSelectedPostID = window.history.state.tempOrderSummaryList.pSelectedPostID.join(',')
        // window.history.state.tempOrderSummaryList.pSelectedProd = window.history.state.tempOrderSummaryList.pSelectedProd.join(',')
        // window.history.state.tempOrderSummaryList.pSelectedSE = window.history.state.tempOrderSummaryList.pSelectedSE.join(',')
        // window.history.state.tempOrderSummaryList.pSelectedScheduled = window.history.state.tempOrderSummaryList.pSelectedScheduled.join(',')
        // window.history.state.tempOrderSummaryList.pOrderNo = window.history.state.tempOrderSummaryList.pOrderNo.join(',')

        // window.history.state.tempOrderSummaryList.pSelectedWBS1 = window.history.state.tempOrderSummaryList.pSelectedWBS1.join(',')
        // window.history.state.tempOrderSummaryList.pSelectedWBS2 = window.history.state.tempOrderSummaryList.pSelectedWBS2.join(',')
        // window.history.state.tempOrderSummaryList.pSelectedWBS3 = window.history.state.tempOrderSummaryList.pSelectedWBS3.join(',')

        this.OrderSummaryList = window.history.state.tempOrderSummaryList;
        // this.OrderSummaryList.pOrderNo = this.OrderSummaryList.pOrderNo.join(",")

        //DELETING RECORD FROM DB
        let customer = this.CustomerCode;
        let project = this.ProjectCode;
        let order = ordernum;
        let UpdateBy = this.loginService.GetGroupName();
        this.orderService
          .ChangeStatus(customer, project, order, 'Delete', UpdateBy)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.toastr.error('Order Deleted Succesfully');
            },
            error: (e) => {
              alert(
                'Error on saving data. Please check the Internet connection and try again.'
              );
              this.OrderSummaryLoading = false;
            },
            complete: () => {
              this.OrderSummaryLoading = false;
            },
          });
        this.GetOrderSummary();
      }
    }
  }

  deleteValue(value: any, index: any): string {
    value = value.split(',');
    value.splice(index, 1);
    value = value.join(',');
    return value;
  }

  checkBBSDescbeforeSubmit() {
    if (this.OrderSummaryTableData.length > 0) {
      let temp: any[] = [];
      for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
        if (this.OrderSummaryTableData[i].Product == 'CAB') {
          if (
            this.OrderSummaryTableData[i].BBSDescription == undefined ||
            this.OrderSummaryTableData[i].BBSDescription == ''
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  checkBBSbeforeSubmit() {
    if (this.OrderSummaryTableData.length > 1) {
      let temp: any[] = [];
      for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
        if (
          this.OrderSummaryTableData[i].Product == 'CAB' &&
          this.OrderSummaryTableData[i].BBSNumnber != undefined
        ) {
          if (temp.includes(this.OrderSummaryTableData[i].BBSNumnber)) {
            return false;
          }
          temp.push(this.OrderSummaryTableData[i].BBSNumnber);
        }
      }
    }
    return true;
  }
  Submit() {
    //Valiadtion for Site contact
    if (!this.CheckSingaporeMobile(this.SiteHandphone)) {
      this.toastr.error('Invalid Site Handphone Number');
      return;
    }
    if (!this.CheckSingaporeMobile(this.ReceiverHandphone)) {
      this.toastr.error('Invalid Handphone Number');
      return;
    }
    if (!this.checkBBSbeforeSubmit()) {
      this.toastr.error('Duplicate BBS Detected');
      return;
    }

    if (!this.checkBBSDescbeforeSubmit()) {
      this.toastr.error('Empty BBS Descrition Detected');
      return;
    }
    if (!this.checkBBSbeforeSubmit2()) {
      this.toastr.error('Invalid BBS Number Detected');
      return;
    }
    if (!this.checkBBSDescbeforeSubmit2()) {
      this.toastr.error('Invalid BBS Description Detected');
      return;
    }
    if (!this.CheckPONumber()) {
      this.toastr.error('Invalid PO number for.');
      return;
    }
    if (this.PONO == '' || this.PONO == null) {
      this.toastr.error('Invalid PO number for.');
      return;
    }
    if (this.PONumberList.findIndex((x) => x === this.PONO) != -1) {
      // console.log('Present')
      // alert('Warning! The PO number ' + this.PONO + ' is used in another order already.');
      // return
    }

    // this.RequiredDate == "Invalid Date" ||
    // this.RequiredDate <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
    // this.RequiredDate >= new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
    if (this.RequiredDate == '' || this.RequiredDate == null) {
      this.toastr.error('Invalid RequiredDate');
      return;
    } else if (
      new Date(this.RequiredDate) <=
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
      new Date(this.RequiredDate) >=
        new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
    ) {
      this.toastr.error('Invalid RequiredDate');
      return;
    }

    if (this.Transport == '' || this.Transport == null) {
      this.toastr.error('Invalid Transport.');
      return;
    }
    // Validation for email
    if (!this.CheckEmail(this.SiteEmail)) {
      this.toastr.error('Invalid Site Contact Email');
      return;
    }
    if (!this.CheckEmail(this.ReceiverEmail)) {
      this.toastr.error('Invalid Goods Receiver Email');
      return;
    }

    if (confirm('Are you sure you want to submit the orders?') == true) {
      this.submitOrderstatus = 'Submit';
      // this.SaveOrder();
      this.getJoBIDCab();
      // this.GetConversionSummary()
    }
  }
  SubmitOrders() {
    let customer = this.CustomerCode;
    let project = this.ProjectCode;

    if (!this.CheckReqDateSubmit()) {
      return;
    }

    this.currSubmitOrderIndex = 1;
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let order = Number(this.OrderSummaryTableData[i].OrderNumber);
      // this.changeStatus(customer, project, order, 'Delete')

      this.OrderSummaryLoading = true;
      let UpdateBy = this.loginService.GetGroupName();
      this.orderService
        .ChangeStatus(customer, project, order, 'Submitted', UpdateBy)
        .subscribe({
          next: (response) => {
            console.log('Submitted => ', response);
            this.submitOrderstatus = '';
            this.OrderSummaryLoading = false;

            if (response.success == false) {
              alert(response.message);
            } else {
              /**Function Call to update Upcoming Order */
              let lIndex = this.currSubmitOrderIndex - 1;
              let lOrderNo = Number(
                this.OrderSummaryTableData[lIndex].OrderNumber
              );
              //if(this.OrderSummaryTableData[lIndex].ScheduledProd=='Y'){
              this.DeleteUpcomingOrder(lOrderNo);
              //this.DeleteAfterSubmissionUpcomingOrder(this.OrderSummaryTableData[lIndex]);
              //}
              if (
                this.currSubmitOrderIndex < this.OrderSummaryTableData.length
              ) {
                this.currSubmitOrderIndex += 1;
              } else {
                this.currSubmitOrderIndex = 1;
                this.toastr.success(
                  'The order has been successfully submitted to NatSteel for process.'
                );
                this.OrderSubmitted = true;
                this.createSharedService.tempOrderSummaryList = undefined;
                this.createSharedService.tempProjectOrderSummaryList =
                  undefined;
                window.history.state.tempOrderSummaryList = undefined;
                this.createSharedService.showOrderSummary = false;

                if (this.ViewOrderSummary == true) {
                  this.router.navigate(['../order/createorder']);
                } else {
                  this.reloadService.reloadComponent.emit('Submitted');
                  this.GetOrderSummary();
                }
              }
            }
          },
          error: (e) => {
            alert(
              'Error on saving data. Please check the Internet connection and try again.'
            );
            this.OrderSummaryLoading = false;
          },
          complete: () => {
            this.OrderSummaryLoading = false;
          },
        });
    }
  }

  Delete() {}

  deleteOrders() {
    let customer = this.CustomerCode;
    let project = this.ProjectCode;

    if (confirm('Are you sure you want to delete the orders?') == true) {
      for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
        let order = Number(this.OrderSummaryTableData[i].OrderNumber);
        // this.changeStatus(customer, project, order, 'Delete')
        let UpdateBy = this.loginService.GetGroupName();
        this.orderService
          .ChangeStatus(customer, project, order, 'Delete', UpdateBy)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.submitOrderstatus = '';

              this.toastr.error('Order Deleted Succesfully');
              this.createSharedService.tempOrderSummaryList = undefined;
              this.createSharedService.tempProjectOrderSummaryList = undefined;
              window.history.state.tempOrderSummaryList = undefined;

              this.createSharedService.selectedStructElements = [];
              this.createSharedService.selectedWBS = undefined;

              this.router.navigate(['../order/draftorder']);
            },
            error: (e) => {
              alert(
                'Error on saving data. Please check the Internet connection and try again.'
              );
              this.OrderSummaryLoading = false;
            },
            complete: () => {
              this.OrderSummaryLoading = false;
            },
          });
      }
    }
  }

  Create() {
    if (!this.checkBBSbeforeSubmit()) {
      this.toastr.error('Duplicate BBS Detected');
      return;
    }

    if (!this.checkBBSDescbeforeSubmit()) {
      this.toastr.error('Empty BBS Descrition Detected');
      return;
    }
    if (!this.checkBBSDescbeforeSubmit2()) {
      this.toastr.error('Invalid BBS Description Detected');
      return;
    }
    if (this.PONO == '' || this.PONO == null) {
      this.toastr.error('Invalid PO number for.');
      return;
    }
    if (!this.CheckPONumber()) {
      this.toastr.error('Invalid PO number for.');
      return;
    }
    if (this.PONumberList.findIndex((x) => x === this.PONO) != -1) {
      // console.log('Present')
      // alert('Warning! The PO number ' + this.PONO + ' is used in another order already.');
      // return
    }
    if (this.RequiredDate == '' || this.RequiredDate == null) {
      this.toastr.error('Invalid RequiredDate');
      return;
    }

    if (this.Transport == '' || this.Transport == null) {
      this.toastr.error('Invalid Transport.');
      return;
    }
    // Validation for email
    if (!this.CheckEmail(this.SiteEmail)) {
      this.toastr.error('Invalid Site Contact Email');
      return;
    }
    if (!this.CheckEmail(this.ReceiverEmail)) {
      this.toastr.error('Invalid Goods Receiver Email');
      return;
    }
    if (
      confirm(
        'Are you sure you want to create the order without confirmation of details?'
      ) == true
    ) {
      this.submitOrderstatus = 'Create*';
      // this.SaveOrder();
      // this.GetConversionSummary();
      this.getJoBIDCab();
    }
  }
  CreateOrder() {
    let status = 'Created*';
    let customer = this.CustomerCode;
    let project = this.ProjectCode;

    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let order = Number(this.OrderSummaryTableData[i].OrderNumber);
      let UpdateBy = this.loginService.GetGroupName();
      this.orderService
        .ChangeStatus(customer, project, order, 'Created*', UpdateBy)
        .subscribe({
          // next: (response) => {
          //   console.log(response);
          //   this.toastr.success('Order Created Succesfully');
          //   this.createSharedService.tempProjectOrderSummaryList = undefined
          //   this.createSharedService.tempOrderSummaryList = undefined
          //   window.history.state.tempOrderSummaryList = undefined
          //   this.router.navigate(['../order/createorder']);
          // },
          next: (response) => {
            console.log(response);
            this.submitOrderstatus = '';

            if (response) {
              if (response.success == false) {
                console.error(response.message);
                return;
              }
            }
            // if(this.OrderSummaryTableData[i].ScheduledProd=='Y'){
            this.DeleteUpcomingOrder(order);
            //this.DeleteAfterSubmissionUpcomingOrder(this.OrderSummaryTableData[i]);
            // }
            if (this.currSubmitOrderIndex < this.OrderSummaryTableData.length) {
              this.currSubmitOrderIndex += 1;
            } else {
              this.currSubmitOrderIndex = 1;
              this.toastr.success('Order Created Succesfully');
              this.createSharedService.tempOrderSummaryList = undefined;
              this.createSharedService.tempProjectOrderSummaryList = undefined;
              window.history.state.tempOrderSummaryList = undefined;

              this.reloadService.reloadComponent.emit('Submitted');
            }
          },
          error: (e) => {
            alert(
              'Error on saving data. Please check the Internet connection and try again.'
            );
            this.OrderSummaryLoading = false;
          },
          complete: () => {
            this.OrderSummaryLoading = false;
          },
        });
    }
  }

  PrintOrder() {
    // this.createSharedService.selectedOrderNumber = this.OrderSummaryTableData[0].OrderNumber
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    };
    let result: any = [];
    this.OrderSummaryTableData.forEach((element) => {
      result.push(element.OrderNumber);
    });
    const modalRef = this.modalService.open(
      PrintOrderComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.OrderNumber = result;
  }

  CloneOrder() {
    if (this.lOrderStatus.includes('Created')) {
      this.SaveOrder();
    }
    let lWBS: any[] = [];
    let lScheduledProd: any[] = [];
    let lStructureElement: any[] = [];
    let lProduct: any[] = [];
    let lOrderNumber: any[] = [];

    if (this.OrderSummaryTableData.length > 1) {
      // Check in case of multiple WBS Orders, if all the orders have the same Product.
      let multipleProd = false;
      let lProd = this.OrderSummaryTableData[0].Product;
      this.OrderSummaryTableData.forEach((x) => {
        lWBS.push(x.WBS);
        lScheduledProd.push(x.ScheduledProd);
        lStructureElement.push(x.StructureElement);
        lProduct.push(x.Product);
        lOrderNumber.push(x.OrderNumber);

        if (x.Product != lProd) {
          multipleProd = true;
        }
      });

      // Return an alert if multiple Orders consists of different Products.
      if (multipleProd) {
        alert('Cannot copy multiple WBS Orders (多重订单不可拷贝.)');
        return;
      }
    } else {
      let x = this.OrderSummaryTableData[0];
      lWBS.push(x.WBS);
      lScheduledProd.push(x.ScheduledProd);
      lStructureElement.push(x.StructureElement);
      lProduct.push(x.Product);
      lOrderNumber.push(x.OrderNumber);
    }

    // if (this.OrderSummaryTableData[0].WBS == '') {
    if (this.OrderSummaryTableData[0].StructureElement == 'NONWBS') {
      this.createSharedService.selectedOrderNumber =
        this.OrderSummaryTableData[0].OrderNumber;
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        //centered: true,
        size: 'lg',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(
        CloneOrderComponent,
        ngbModalOptions
      );
    } else {
      this.createSharedService.selectedOrderNumber =
        this.OrderSummaryTableData[0].OrderNumber;
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        //centered: true,
        size: 'lg',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(
        CloneOrderProjectComponent,
        ngbModalOptions
      );

      console.log('Clone Order -> ', lWBS, lStructureElement, lOrderNumber);
      modalRef.componentInstance.WBS = lWBS;
      modalRef.componentInstance.ScheduledProd = lScheduledProd;
      modalRef.componentInstance.StructureElement = lStructureElement;
      modalRef.componentInstance.Product = lProduct;
      modalRef.componentInstance.OrderNumber = lOrderNumber;
    }
  }

  changeStatus(
    pCustomerCode: string,
    pProjectCode: string,
    pOrderNo: number,
    pOrderStatus: string
  ) {
    let UpdateBy = this.loginService.GetGroupName();
    this.orderService
      .ChangeStatus(
        pCustomerCode,
        pProjectCode,
        pOrderNo,
        pOrderStatus,
        UpdateBy
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Order Saved Succesfully');
          this.submitOrderstatus = '';
        },
        error: (e) => {
          alert(
            'Error on saving data. Please check the Internet connection and try again.'
          );
          this.OrderSummaryLoading = false;
        },
        complete: () => {
          this.OrderSummaryLoading = false;
        },
      });
  }
  async validatePoNumberNoMessage(po_no: any) {
    // if (this.PONumberList.findIndex(x => x.toUpperCase() === pono.toUpperCase()) != -1) {
    //   console.log('Present')
    //   this.PONOisPresent = true
    //   // alert('Warning! The PO number ' + this.PONO + ' is used in another order already.')
    //   this.toastr.error('Warning! The PO number ' + pono + ' is used in another order already.')
    //   return true;
    // }
    // else {
    //   console.log('Absent')
    //   this.PONOisPresent = false
    //   return false;
    // }

    if (po_no == '' || po_no == undefined) {
      return;
    }
    let customer = this.dropdown.getCustomerCode();
    let project = this.dropdown.getProjectCode()[0];
    let po = po_no;

    let response = await this.ValidatePO_CAB(customer, project, po);
    console.log('po response -> ', response);

    if (response.responseText != null && response.responseText != '') {
      // this.toastr.error(
      //   'Warning! The PO number you entered is used in order: ' +
      //   response.responseText +
      //   ' already.'
      // );

      if (this.checkPOProcess(po)) {
        if (this.lOrderStatus == 'Created' || this.lOrderStatus == 'Created*') {
          this.PONOisPresent = true;
          return false;
        }
      } else {
        this.PONOisPresent = false;
        return true;
      }
    }
    this.PONOisPresent = false;
    return true;
  }
  checkPOProcess(ponumber: any) {
    let receivedData: any = localStorage.getItem('ProcessData');
    receivedData = JSON.parse(receivedData);
    if (receivedData) {
      if (receivedData.PONumber === ponumber) {
        return false;
      }
    }
    return true;
  }
  async validatePoNumber(pono: any) {
    // if (this.PONumberList.findIndex(x => x.toUpperCase() === pono.toUpperCase()) != -1) {
    //   console.log('Present')
    //   this.PONOisPresent = true
    //   // alert('Warning! The PO number ' + this.PONO + ' is used in another order already.')
    //   this.toastr.error('Warning! The PO number ' + pono + ' is used in another order already.')
    //   return true;
    // }
    // else {
    //   console.log('Absent')
    //   this.PONOisPresent = false
    //   return false;
    // }

    if (pono == '' || pono == undefined) {
      return;
    }
    let customer = this.dropdown.getCustomerCode();
    let project = this.dropdown.getProjectCode()[0];
    let po = pono;

    let response = await this.ValidatePO_CAB(customer, project, po);
    console.log('po response -> ', response);

    if (response.responseText != null && response.responseText != '') {
      this.toastr.error(
        'Warning! The PO number you entered is used in order: ' +
          response.responseText +
          ' already.'
      );
      if (this.checkPOProcess(po)) {
        if (this.lOrderStatus == 'Created' || this.lOrderStatus == 'Created*') {
          this.PONOisPresent = true;
          return false;
        }
      } else {
        this.PONOisPresent = false;
        return true;
      }
    }
    this.PONOisPresent = false;
    return true;
  }

  async ValidatePO_CAB(
    CustomerCode: string,
    ProjectCode: string,
    POnumber: number
  ): Promise<any> {
    try {
      const data = await this.orderService
        .ValidatePO_CAB(CustomerCode, ProjectCode, POnumber)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  getOrderNumber(): string {
    let result: any = [];
    this.OrderSummaryTableData.forEach((element) => {
      result.push(element.OrderNumber);
    });

    return result.join(',');
  }
  getOrderStatus(): string {
    return this.lOrderStatus;
  }

  async SaveBBS(item: any) {
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      item = this.OrderSummaryTableData[i];

      if (item.Product != 'CAB') {
        continue;
      }

      let obj: SaveBBSOrderDetails = item.BBS;
      if (obj) {
        if (item.BBSNumnber.length > 14) {
          item.BBSNumnber = item.BBSNumnber.slice(item.BBSNumnber.length - 14);
        }
        obj.BBSNo = item.BBSNumnber;
        obj.BBSDesc = item.BBSDescription ? item.BBSDescription.trim() : '';
        obj.UpdateBy = this.loginService.GetGroupName();
        // ADD BBS Validations
        if (!this.BBsValidator(obj.BBSNo)) {
          // Unfocus the input element
          this.unfocusInput('bbsInput');
          alert(
            'Invalid data entered. BBS No cannot include special characters, such as -#$%. (输入数据无效, 加工表号不可包含特出字母, 例如-#$%等等.)'
          );
          return;
        }

        if (!this.BBsValidator(obj.BBSDesc)) {
          // Unfocus the input element
          this.unfocusInput('bbsDescInput');
          alert(
            'Invalid data entered. BBS Description cannot include special characters, such as ~!@@#$%^+`=\\|;:\'"<>?. (输入数据无效, 加工表详细说明不可包含特出字母, 例如~!@@#$%^+`=\\|;:\'"<>?等.)'
          );
          return;
        }
        let respSaveBBS = await this.SaveBBS_OrderDetails(obj);
        console.log('respSaveBBS', respSaveBBS);
      }
    }
  }

  async SaveBBS_OrderDetails(obj: SaveBBSOrderDetails): Promise<any> {
    try {
      const data = await this.orderService
        .SaveBBS_OrderDetails(obj)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getJobId(
    orderNumber: any,
    ProdType: any,
    StructurEelement: any,
    ScheduleProd: any
  ): Promise<any> {
    // let ProdType = this.ProductType;
    // let StructurEelement = this.StructureElement;
    // let ScheduleProd = this.ScheduleProd;
    try {
      const data = await this.orderService
        .getJobId(orderNumber, ProdType, StructurEelement, ScheduleProd)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  gSubmission: any;
  gEditable: any;
  showProdDeatsils(Order: any): boolean {
    // if ((Order.OrderStatus == "New" || Order.OrderStatus == "Created" || Order.OrderStatus == "Created*" || Order.OrderStatus == "Submitted*" ||
    //   (Order.OrderStatus == "Sent")) && Order.SelectedScheduled.Trim() != "Y") {

    // } else {
    //   return false;
    // }
    let lUserName = this.loginService.GetGroupName();
    // console.log("Order123",Order);
    let lOrderStatus = this.lOrderStatus;
    let lPEOrderStatus = Order.OrderStatus;
    let lSelectedScheduled = Order.ScheduledProd;
    let lSelectWT = Order.OrderTonnage;
    let lSubmission = this.gSubmission;

    if (
      Order.Product == 'CUT-TO-SIZE-MESH' &&
      Order.StructureElement != 'NONWBS'
    ) {
      this.IsPrecast = true;
    }
    if (
      (lSelectedScheduled.trim() == 'Y' && lSelectWT == 0) ||
      ((lUserName == null ||
        lUserName.split('@').length != 2 ||
        lUserName.split('@')[1].toLowerCase() != 'natsteel.com.sg') &&
        lOrderStatus == 'Created*')
    ) {
      return false;
    } else if (
      (lPEOrderStatus == 'New' ||
        lPEOrderStatus == 'Created' ||
        lPEOrderStatus == 'Created*' ||
        lPEOrderStatus == 'Submitted*' ||
        (lPEOrderStatus == 'Sent' && lSubmission == 'Yes')) &&
      lSelectedScheduled.trim() != 'Y'
    ) {
      // Show product edit button
      return true;
    } else {
      // show view product button
      if (
        Order.ScheduledProd == 'Y' &&
        (Order.Product.toLowerCase().includes('mesh') ||
          Order.Product.toLowerCase().includes('bpc')) &&
        (Order.OrderQty == 0 || Order.OrderTonnage == 0)
      ) {
        if (Order.Product.toLowerCase().includes('standard') == false) {
          return false;
        }
      }
      if (Order.Product.toLowerCase().includes('precast')) {
        return true;
      }
      return false;
      // @Html.Raw("<img sytle=\"display:inline-block;\" src=\"" + @Url.Content("~/Content/images/product_view.png") + "\" />")
    }
    // console.log("Order123",Order);

    // return true;
  }
  showProdDetailsEdit(Order: any): boolean {
    let lUserName = this.loginService.GetGroupName();
    let lOrderStatus = this.lOrderStatus;
    let lPEOrderStatus = Order.OrderStatus;
    let lSelectedScheduled = Order.ScheduledProd;
    let lSelectWT = Order.OrderTonnage;
    let lSubmission = this.gSubmission;

    if (
      (lSelectedScheduled.trim() == 'Y' && lSelectWT == 0) ||
      ((lUserName == null ||
        lUserName.split('@').length != 2 ||
        lUserName.split('@')[1].toLowerCase() != 'natsteel.com.sg') &&
        lOrderStatus == 'Created*')
    ) {
      return false;
    } else if (
      (lPEOrderStatus == 'New' ||
        lPEOrderStatus == 'Created' ||
        lPEOrderStatus == 'Created*' ||
        lPEOrderStatus == 'Submitted*' ||
        (lPEOrderStatus == 'Sent' && lSubmission == 'Yes')) &&
      lSelectedScheduled.trim() != 'Y'
    ) {
      // Show product edit button
      return true;
    } else {
      // show view product button
      return false;
    }
  }

  showProdDetailsView(Order: any): boolean {
    let lUserName = this.loginService.GetGroupName();
    let lOrderStatus = this.lOrderStatus;
    let lPEOrderStatus = Order.OrderStatus;
    let lSelectedScheduled = Order.ScheduledProd;
    let lSelectWT = Order.OrderTonnage;
    let lSubmission = this.gSubmission;

    if (
      (lSelectedScheduled.trim() == 'Y' && lSelectWT == 0) ||
      ((lUserName == null ||
        lUserName.split('@').length != 2 ||
        lUserName.split('@')[1].toLowerCase() != 'natsteel.com.sg') &&
        lOrderStatus == 'Created*')
    ) {
      return false;
    } else if (
      (lPEOrderStatus == 'New' ||
        lPEOrderStatus == 'Created' ||
        lPEOrderStatus == 'Created*' ||
        lPEOrderStatus == 'Submitted*' ||
        (lPEOrderStatus == 'Sent' && lSubmission == 'Yes')) &&
      lSelectedScheduled.trim() != 'Y'
    ) {
      // Show product edit button
      return false;
    } else {
      // show view product button
      return true;
    }
  }
  CheckPOforCAB(item: any, PONo: any) {
    // 1. Check if product is CAB.
    // 2. If product is CAB then Update the BBS NUmber to be the same as the PO number.

    console.log('CHECK FOR CAB -> ', item);

    if (item.Product == 'CAB' && item.PONumber != undefined) {
      item.BBSNumnber = item.PONumber.replace(/[^a-zA-Z0-9]/g, '');
    }
    if (item.BBSNumnber.length > 14) {
      item.BBSNumnber = item.BBSNumnber.slice(item.BBSNumnber.length - 14);
    }
  }

  checkTableItems(): boolean {
    if (this.OrderSummaryTableData.length > 1) {
      if (this.isEditble) {
        return true;
      }
    }
    return false;
  }

  CheckMeshItem(): boolean {
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let lprod = this.OrderSummaryTableData[i].Product;
      if (
        lprod.includes('Mesh') ||
        lprod.includes('MESH') ||
        lprod.includes('mesh')
      ) {
        return true;
      }
    }
    return false;
  }

  ConvertToUpper(value: any) {
    // let specialCharactersRegex = /[^\w\s]|_/g;

    // if (value) {
    //   value = (this.removeNonLatinCharacters(value));

    //   if (value[value.length - 1] !== ' ') {
    //     value = value.trim();
    //   }
    // }

    return value.toUpperCase();
  }

  FilterInputText(text: string): string {
    return text ? text.trim() : text;
  }

  removeNonLatinCharacters(inputString: string): string {
    // Regular expression to match Latin characters and common symbols, excluding characters from languages like Chinese
    const chineseCharactersRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/g;
    // Filter out characters that don't match the Latin characters and symbols regex
    return inputString.replace(chineseCharactersRegex, '');
  }

  checkReqDate(Product: any, RequiredDate: any) {
    let lLeadTime = this.LeadTime.find(
      (element: { Prod: string }) =>
        element.Prod.toUpperCase() == Product.toUpperCase()
    ).Days;

    let ReqDate = new Date(RequiredDate);
    let todayDate = new Date();

    let lActDays = this.getWorkingDays(todayDate, ReqDate);
    console.log('WorkingDays->', lActDays);
    if (lLeadTime > lActDays) {
      alert(
        'Thank you for placing the order with NatSteel. ' +
          'Please note that the order to be submitted has a short lead-time. ' +
          'We will try our best to process the order within the requested time. ' +
          'For actual delivery date, please contact the respective PM in-charge. \n\n' +
          '谢谢您的订单. \n' +
          '您要提交的订单交货期较短. 我们将尽力在要求的时间内处理订单. 实际交货日期, 请联系相应的项目负责人.'
      );
    }
  }

  CheckReqDateSubmit() {
    for (let lItem of this.OrderSummaryTableData) {
      let Product = lItem.Product;

      let lLeadTime = this.LeadTime.find(
        (element: { Prod: string }) =>
          element.Prod.toUpperCase() == Product.toUpperCase()
      );

      if (lLeadTime) {
        lLeadTime = lLeadTime.Days;
        let ReqDate = new Date(lItem.RequiredDate);
        let todayDate = new Date();

        let lActDays = this.getWorkingDays(todayDate, ReqDate);
        console.log('WorkingDays->', lActDays);
        if (lLeadTime > lActDays) {
          if (
            confirm(
              'Thank you for placing the order with NatSteel. ' +
                'Please note that the order to be submitted has a short lead-time. ' +
                'We will try our best to process the order within the requested time. ' +
                'For actual delivery date, please contact the respective PM in-charge. \n\n' +
                '谢谢您的订单. \n' +
                '您要提交的订单交货期较短. 我们将尽力在要求的时间内处理订单. 实际交货日期, 请联系相应的项目负责人.'
            )
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
    return true;
  }

  checkReqDates() {
    for (let lItem of this.OrderSummaryTableData) {
      let Product = lItem.Product;

      let lLeadTime = this.LeadTime.find(
        (element: { Prod: string }) =>
          element.Prod.toUpperCase() == Product.toUpperCase()
      ).Days;

      let ReqDate = new Date(lItem.RequiredDate);
      let todayDate = new Date();

      let lActDays = this.getWorkingDays(todayDate, ReqDate);
      console.log('WorkingDays->', lActDays);
      if (lLeadTime > lActDays) {
        alert(
          'Thank you for placing the order with NatSteel. ' +
            'Please note that the order to be submitted has a short lead-time. ' +
            'We will try our best to process the order within the requested time. ' +
            'For actual delivery date, please contact the respective PM in-charge. \n\n' +
            '谢谢您的订单. \n' +
            '您要提交的订单交货期较短. 我们将尽力在要求的时间内处理订单. 实际交货日期, 请联系相应的项目负责人.'
        );
        return;
      }
    }
  }

  getWorkingDays(date1: Date, date2: Date): number {
    let workingDays = 0;
    let currentDate = new Date(date1);

    while (currentDate <= date2) {
      const dayOfWeek = currentDate.getDay();

      // Check if the current day is a weekday (Monday to Friday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return workingDays;
  }

  getDifferenceInDays(date1: Date, date2: Date): number {
    const timeDifference = date2.getTime() - date1.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  }

  checkDuplicateBBSNumber(item: any) {
    let index = this.OrderSummaryTableData.findIndex((x) => x == item);

    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      if (
        i != index &&
        this.OrderSummaryTableData[i].BBSNumnber == item.BBSNumnber
      ) {
        return true;
      }
    }
    return false;
  }

  Withdraw() {
    console.log('Withdraw Order');
    if (this.CustomerCode == undefined) {
      // stopLoading();
      alert(
        'Invalid customer code. Please start with New Order and choose a customer.'
      );
      return;
    }

    if (this.ProjectCode == undefined) {
      // stopLoading();
      alert(
        'Invalid project code. Please start with New Order and choose a project.'
      );
      return;
    }

    let lOrderNo = '';
    let temp: any[] = [];
    this.OrderSummaryTableData.forEach((x) => {
      temp.push(x.OrderNumber);
    });
    lOrderNo = temp.join(',');

    let lOrderNoA = lOrderNo.split(',');
    if (
      lOrderNoA == null ||
      lOrderNoA.length == 0 ||
      (lOrderNoA.length > 0 && lOrderNoA[0] == '0')
    ) {
      // stopLoading();
      alert('Invalid order number to withdraw the item');
      return;
    }
    if (confirm('Are you sure you want to withdraw the order item ?') == true) {
      this.OrderSummaryTableData.forEach((item) => {
        console.log(item);
        let pCustomerCode = this.CustomerCode;
        let pProjectCode = this.ProjectCode;
        let pOrderNo = Number(item.OrderNumber);
        let UpdateBy = this.loginService.GetGroupName();

        this.OrderSummaryLoading = true;
        this.orderService
          .ChangeStatus(
            pCustomerCode,
            pProjectCode,
            pOrderNo,
            'Withdraw',
            UpdateBy
          )
          .subscribe({
            next: (response) => {
              console.log(response);
              if (response) {
                if (response.success == true) {
                  alert('Order witthdrawn Successfully.');
                  this.OrderSummaryLoading = true;
                  this.GetOrderSummary();
                }
              }
              // this.submitOrderstatus = "";
            },
            error: (e) => {
              alert(
                'Error on saving data. Please check the Internet connection and try again.'
              );
              this.OrderSummaryLoading = false;
            },
            complete: () => {
              this.OrderSummaryLoading = false;
            },
          });
      });
    }
  }

  // WithdrawOrderPE(obj: any) {
  //   if (confirm("Are you sure you want to withdraw the order item ?") == true) {
  //     this.orderService.WithdrawOrderPE(obj).subscribe({
  //       next: (response: any) => {
  //         console.log('WithdrawOrderPE', response);

  //         if (response.success == false) {
  //           // lReturn = -1;
  //           alert("Error during withdrawal processing : " + response.message);
  //         }
  //         else if (response.success == true) {
  //           alert('Order Withdrawn successfully.')
  //         }
  //       },
  //       error: () => {
  //         alert("Error on saving data. Please check the Internet connection and try again.");
  //       },
  //       complete: () => {
  //         this.GetOrderSummary();
  //       },
  //     })
  //   }
  // }

  PODuplicateList(item: any) {
    let index = this.OrderSummaryTableData.findIndex((x) => x == item);

    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      if (
        i != index &&
        this.OrderSummaryTableData[i].PONumber == item.PONumber &&
        (item.PONumber != undefined || item.PONumber != '')
      ) {
        return true;
      }
    }
    return false;
  }

  showCommonBBS() {
    if (this.OrderSummaryTableData.length == 1) {
      if (this.OrderSummaryTableData[0].Product == 'CAB') {
        return true;
      }
    }
    return false;
  }

  getFutureDate(): NgbDate {
    const today = new Date();
    const futureTime = today.getTime() + 90 * 24 * 60 * 60 * 1000;
    // 90 days in milliseconds
    let futureDate = new Date(futureTime);
    return this.calendar.getNext(this.calendar.getToday(), 'd', 90);
  }

  onKeyPress(event: KeyboardEvent) {
    // Regular expression to allow only alphanumeric characters
    const regex = /[a-zA-Z0-9]/;

    // Get the pressed key
    const key = event.key;

    // Check if the pressed key matches the regular expression
    if (!regex.test(key)) {
      // Prevent the default action if the key is not alphanumeric
      event.preventDefault();
    }
  }

  async ngOnDestroy() {
    let lCurrentPath = this.location.path();
    console.log('lCurrentPath', lCurrentPath);

    //Save the values for GreenSteel Selection lock;
    this.CheckforGreenSelectionLock();
    // if (lCurrentPath != '/order/createorder') {
    await this.AutoSaveOrders();
    // }
  }

  async AutoSaveOrders() {
    let UpdateBy = this.loginService.GetGroupName();

    this.saveorderdata = [];
    //ASSIGN VALUE TO SAVEORDERDATA
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let item: saveOrderDetailsModel = {
        pOrderHeader: {
          OrderNumber: Number(this.OrderSummaryTableData[i].OrderNumber),
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          OrderJobID: 0,
          OrderType: this.OrderSummaryTableData[0].WBS ? 'WBS' : 'NONWBS',
          WBS1: this.OrderSummaryTableData[i].WBS1
            ? this.OrderSummaryTableData[i].WBS1
            : '',
          WBS2: this.OrderSummaryTableData[i].WBS2
            ? this.OrderSummaryTableData[i].WBS2
            : '',
          WBS3: this.OrderSummaryTableData[i].WBS3
            ? this.OrderSummaryTableData[i].WBS3
            : '',
          Remarks: this.DeliveryAddress ? this.DeliveryAddress : '',
          DeliveryAddress: this.AdditionalRemarks ? this.AdditionalRemarks : '',
          SiteEngr_Name: this.GoodsReceiver ? this.GoodsReceiver : '',
          SiteEngr_HP: this.ReceiverHandphone ? this.ReceiverHandphone : '',
          SiteEngr_Email: this.ReceiverEmail ? this.ReceiverEmail : '',
          Scheduler_Name: this.SiteContact ? this.SiteContact : '',
          Scheduler_HP: this.SiteHandphone ? this.SiteHandphone : '',
          Scheduler_Email: this.SiteEmail ? this.SiteEmail : '',
          TotalWeight: Number(this.OrderSummaryTableData[i].OrderTonnage), // this.gettotalWeight(this.OrderSummaryTableData),
          OrderStatus: this.lOrderStatus,
          OrderSource: 'UX',
          PONumber: this.PONO ? this.PONO : '',
          PODate: new Date(this.PODate == '' ? this.today : this.PODate),
          RequiredDate: this.RequiredDate
            ? new Date(this.RequiredDate)
            : new Date(),
          OrigReqDate: this.orgReqDate ? new Date(this.orgReqDate) : new Date(),
          TransportMode: this.Transport ? this.Transport : '',
          UpdateDate: new Date(this.today),
          UpdateBy: UpdateBy,
          SubmitDate: new Date(this.today),
          SubmitBy: UpdateBy,
          OrderShared: true,
          Address: this.PMAddress ? this.PMAddress : null,
          Gate: this.PMGate ? this.PMGate : null,
        },
        pOrderCart: [
          {
            OrderNumber: Number(this.OrderSummaryTableData[i].OrderNumber),
            StructureElement: this.OrderSummaryTableData[i].StructureElement,
            ProductType: this.OrderSummaryTableData[i].Product,
            ScheduledProd: this.OrderSummaryTableData[i].ScheduledProd,
            PONumber: this.OrderSummaryTableData[i].PONumber
              ? this.OrderSummaryTableData[i].PONumber
              : '',
            PODate: new Date(this.PODate == '' ? this.today : this.PODate),
            RequiredDate: this.OrderSummaryTableData[i].RequiredDate
              ? new Date(this.OrderSummaryTableData[i].RequiredDate)
              : new Date(),
            OrigReqDate: this.orgReqDate
              ? new Date(this.orgReqDate)
              : new Date(),
            TransportMode: this.OrderSummaryTableData[i].Transport
              ? this.OrderSummaryTableData[i].Transport
              : this.Transport,
            CABJobID: 0,
            MESHJobID: 0,
            BPCJobID: 0,
            CageJobID: 0,
            CarpetJobID: 0,
            StdBarsJobID: 0,
            StdMESHJobID: 0,
            CoilProdJobID: 0,
            PostHeaderID: Number(this.OrderSummaryTableData[i].PostId),
            OrderStatus: this.lOrderStatus ? this.lOrderStatus : 'Created',
            TotalWeight: Number(this.OrderSummaryTableData[i].OrderTonnage),
            TotalPCs: Number(this.OrderSummaryTableData[i].OrderQty),
            SAPSOR: '',
            UpdateBy: UpdateBy,
            UpdateDate: new Date(this.today),
            ProcessBy: UpdateBy,
            ProcessDate: new Date(this.today),
            SpecialRemark: this.OrderSummaryTableData[i].SpecialRemarks
              ? this.OrderSummaryTableData[i].SpecialRemarks
              : '',
            SiteContact: this.OrderSummaryTableData[i].SiteContact
              ? this.OrderSummaryTableData[i].SiteContact
              : '',
            Handphone: this.OrderSummaryTableData[i].Handphone
              ? this.OrderSummaryTableData[i].Handphone
              : '',
            GoodsReceiver: this.OrderSummaryTableData[i].GoodsReceiver
              ? this.OrderSummaryTableData[i].GoodsReceiver
              : '',
            GoodsReceiverHandphone: this.OrderSummaryTableData[i]
              .GoodsReceiverHandphone
              ? this.OrderSummaryTableData[i].GoodsReceiverHandphone
              : '',
            AdditionalRemark: this.OrderSummaryTableData[i].AdditionalRemark
              ? this.OrderSummaryTableData[i].AdditionalRemark
              : '',
          },
        ],
      };

      item.pOrderHeader.PODate = new Date(
        new Date(item.pOrderHeader.PODate).getTime() -
          new Date(item.pOrderHeader.PODate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.RequiredDate = new Date(
        new Date(item.pOrderHeader.RequiredDate).getTime() -
          new Date(item.pOrderHeader.RequiredDate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.OrigReqDate = new Date(
        new Date(item.pOrderHeader.OrigReqDate).getTime() -
          new Date(item.pOrderHeader.OrigReqDate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.UpdateDate = new Date(
        new Date(item.pOrderHeader.UpdateDate).getTime() -
          new Date(item.pOrderHeader.UpdateDate).getTimezoneOffset() * 60000
      );
      item.pOrderHeader.SubmitDate = new Date(
        new Date(item.pOrderHeader.SubmitDate).getTime() -
          new Date(item.pOrderHeader.SubmitDate).getTimezoneOffset() * 60000
      );

      item.pOrderCart[0].PODate = new Date(
        new Date(item.pOrderCart[0].PODate).getTime() -
          new Date(item.pOrderCart[0].PODate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].RequiredDate = new Date(
        new Date(item.pOrderCart[0].RequiredDate).getTime() -
          new Date(item.pOrderCart[0].RequiredDate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].OrigReqDate = new Date(
        new Date(item.pOrderCart[0].OrigReqDate).getTime() -
          new Date(item.pOrderCart[0].OrigReqDate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].UpdateDate = new Date(
        new Date(item.pOrderCart[0].UpdateDate).getTime() -
          new Date(item.pOrderCart[0].UpdateDate).getTimezoneOffset() * 60000
      );
      item.pOrderCart[0].ProcessDate = new Date(
        new Date(item.pOrderCart[0].ProcessDate).getTime() -
          new Date(item.pOrderCart[0].ProcessDate).getTimezoneOffset() * 60000
      );
      this.saveorderdata.push(item);

      // this.SaveOrderDetails(item)
    }
    //SAVE VALUE OF SAVEORDERDATA TO A SERVICE
    this.createSharedService.saveOrderDetailsData = this.saveorderdata;

    //CALL THE SAVEORDERDETAILS FUNCTION
    this.currSaveOrderIndex = 1;
    for (let i = 0; i < this.saveorderdata.length; i++) {
      let lItem = this.saveorderdata[i];
      this.AutoSaveOrderDetails(lItem);
      // let lResponse = await this.AutoSaveOrderDetails_async(lItem);
      // if (this.currSaveOrderIndex < this.saveorderdata.length) {
      //   this.currSaveOrderIndex += 1;
      // } else {
      //   this.currSaveOrderIndex = 1;
      // }
    }
  }
  // async AutoSaveOrderDetails_async(item: saveOrderDetailsModel): Promise<any> {
  //   try {
  //     const data = await this.orderService.SaveOrderDetails(item).toPromise();
  //     return data;
  //   } catch (error) {
  //     console.error('Error in AutoSaveOrderDetails_async:', error);
  //     return 'error'; //
  //   }
  // }
  AutoSaveOrderDetails(item: saveOrderDetailsModel) {
    this.orderService.SaveOrderDetails(item).subscribe({
      next: (response) => {
        if (this.currSaveOrderIndex < this.saveorderdata.length) {
          this.currSaveOrderIndex += 1;
        } else {
          this.currSaveOrderIndex = 1;
          // this.toastr.success('Order Saved Succesfully');
          // if (this.submitOrderstatus == 'Submit') {
          //   this.SubmitOrders();
          // }
          // if (this.submitOrderstatus == 'Create*') {
          //   this.CreateOrder();
          // }
        }
      },
      error: (e) => {},
      complete: () => {},
    });
  }
  UpdateTempOrderList() {
    // this.OrderSummaryTableData

    let tempOrderSummaryList: TempOrderSummaryData = {
      pCustomerCode: '',
      pProjectCode: '',
      pSelectedCount: 0,
      pSelectedSE: [],
      pSelectedProd: [],
      pSelectedWT: [],
      pSelectedQty: [],
      pSelectedPostID: [],
      pSelectedScheduled: [],
      pSelectedWBS1: [],
      pSelectedWBS2: [],
      pSelectedWBS3: [],
      pWBS1: '',
      pWBS2: '',
      pWBS3: '',
      pOrderNo: [],
      StructProd: [],
    };

    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let item = this.OrderSummaryTableData[i];

      tempOrderSummaryList.pSelectedSE.push(item.StructureElement);
      tempOrderSummaryList.pSelectedProd.push(item.Product);
      tempOrderSummaryList.pSelectedPostID.push(item.PostId);
      tempOrderSummaryList.pSelectedWBS1.push(item.WBS1);
      tempOrderSummaryList.pSelectedWBS2.push(item.WBS2);
      tempOrderSummaryList.pSelectedWBS3.push(item.WBS3);
      tempOrderSummaryList.pOrderNo.push(Number(item.OrderNumber));
      tempOrderSummaryList.pSelectedScheduled.push(item.ScheduledProd);

      let lStructProd =
        item.StructureElement + '/' + item.Product.toLowerCase();
      if (item.PostId) {
        lStructProd = lStructProd + '/' + item.PostId;
      }
      tempOrderSummaryList.StructProd.push(lStructProd);

      tempOrderSummaryList.pSelectedWT.push(item.OrderTonnage);
      tempOrderSummaryList.pSelectedQty.push(item.OrderQty);
    }

    if (tempOrderSummaryList.pSelectedSE.includes('NONWBS')) {
      this.createSharedService.tempOrderSummaryList = JSON.parse(
        JSON.stringify(tempOrderSummaryList)
      );
    } else {
      this.createSharedService.tempProjectOrderSummaryList = JSON.parse(
        JSON.stringify(tempOrderSummaryList)
      );
    }
  }

  async SaveOrderCAB(i: any) {
    this.OrderSummaryLoading = true;
    let UpdateBy = this.loginService.GetGroupName();
    // this.saveorderdata = [];
    //ASSIGN VALUE TO SAVEORDERDATA

    let item: saveOrderDetailsModel = {
      pOrderHeader: {
        OrderNumber: Number(this.OrderSummaryTableData[i].OrderNumber),
        CustomerCode: this.CustomerCode,
        ProjectCode: this.ProjectCode,
        OrderJobID: 0,
        OrderType: this.OrderSummaryTableData[0].WBS ? 'WBS' : 'NONWBS',
        WBS1: this.OrderSummaryTableData[i].WBS1
          ? this.OrderSummaryTableData[i].WBS1
          : '',
        WBS2: this.OrderSummaryTableData[i].WBS2
          ? this.OrderSummaryTableData[i].WBS2
          : '',
        WBS3: this.OrderSummaryTableData[i].WBS3
          ? this.OrderSummaryTableData[i].WBS3
          : '',
        Remarks: this.DeliveryAddress ? this.DeliveryAddress : '',
        DeliveryAddress: this.AdditionalRemarks ? this.AdditionalRemarks : '',
        SiteEngr_Name: this.GoodsReceiver ? this.GoodsReceiver : '',
        SiteEngr_HP: this.ReceiverHandphone ? this.ReceiverHandphone : '',
        SiteEngr_Email: this.ReceiverEmail ? this.ReceiverEmail : '',
        Scheduler_Name: this.SiteContact ? this.SiteContact : '',
        Scheduler_HP: this.SiteHandphone ? this.SiteHandphone : '',
        Scheduler_Email: this.SiteEmail ? this.SiteEmail : '',
        TotalWeight: Number(this.OrderSummaryTableData[i].OrderTonnage), // this.gettotalWeight(this.OrderSummaryTableData),
        OrderStatus: this.lOrderStatus,
        OrderSource: 'UX',
        PONumber: this.PONO ? this.PONO : '',
        PODate: new Date(this.PODate == '' ? this.today : this.PODate),
        RequiredDate: this.RequiredDate
          ? new Date(this.RequiredDate)
          : new Date(),
        OrigReqDate: this.orgReqDate ? new Date(this.orgReqDate) : new Date(),
        TransportMode: this.Transport ? this.Transport : '',
        UpdateDate: new Date(this.today),
        UpdateBy: UpdateBy,
        SubmitDate: new Date(this.today),
        SubmitBy: UpdateBy,
        OrderShared: true,
        Address: this.PMAddress ? this.PMAddress : null,
        Gate: this.PMGate ? this.PMGate : null,
      },
      pOrderCart: [
        {
          OrderNumber: Number(this.OrderSummaryTableData[i].OrderNumber),
          StructureElement: this.OrderSummaryTableData[i].StructureElement,
          ProductType: this.OrderSummaryTableData[i].Product,
          ScheduledProd: this.OrderSummaryTableData[i].ScheduledProd,
          PONumber: this.OrderSummaryTableData[i].PONumber
            ? this.OrderSummaryTableData[i].PONumber
            : '',
          PODate: new Date(this.PODate == '' ? this.today : this.PODate),
          RequiredDate: this.OrderSummaryTableData[i].RequiredDate
            ? new Date(this.OrderSummaryTableData[i].RequiredDate)
            : new Date(),
          OrigReqDate: this.orgReqDate ? new Date(this.orgReqDate) : new Date(),
          TransportMode: this.OrderSummaryTableData[i].Transport
            ? this.OrderSummaryTableData[i].Transport
            : this.Transport,
          CABJobID: 0,
          MESHJobID: 0,
          BPCJobID: 0,
          CageJobID: 0,
          CarpetJobID: 0,
          StdBarsJobID: 0,
          StdMESHJobID: 0,
          CoilProdJobID: 0,
          PostHeaderID: Number(this.OrderSummaryTableData[i].PostId),
          OrderStatus: this.lOrderStatus ? this.lOrderStatus : 'Created',
          TotalWeight: Number(this.OrderSummaryTableData[i].OrderTonnage),
          TotalPCs: Number(this.OrderSummaryTableData[i].OrderQty),
          SAPSOR: '',
          UpdateBy: UpdateBy,
          UpdateDate: new Date(this.today),
          ProcessBy: UpdateBy,
          ProcessDate: new Date(this.today),
          SpecialRemark: this.OrderSummaryTableData[i].SpecialRemarks
            ? this.OrderSummaryTableData[i].SpecialRemarks
            : '',
          SiteContact: this.OrderSummaryTableData[i].SiteContact
            ? this.OrderSummaryTableData[i].SiteContact
            : '',
          Handphone: this.OrderSummaryTableData[i].Handphone
            ? this.OrderSummaryTableData[i].Handphone
            : '',
          GoodsReceiver: this.OrderSummaryTableData[i].GoodsReceiver
            ? this.OrderSummaryTableData[i].GoodsReceiver
            : '',
          GoodsReceiverHandphone: this.OrderSummaryTableData[i]
            .GoodsReceiverHandphone
            ? this.OrderSummaryTableData[i].GoodsReceiverHandphone
            : '',
          AdditionalRemark: this.OrderSummaryTableData[i].AdditionalRemark
            ? this.OrderSummaryTableData[i].AdditionalRemark
            : '',
        },
      ],
    };

    item.pOrderHeader.PODate = new Date(
      new Date(item.pOrderHeader.PODate).getTime() -
        new Date(item.pOrderHeader.PODate).getTimezoneOffset() * 60000
    );
    item.pOrderHeader.RequiredDate = new Date(
      new Date(item.pOrderHeader.RequiredDate).getTime() -
        new Date(item.pOrderHeader.RequiredDate).getTimezoneOffset() * 60000
    );
    item.pOrderHeader.OrigReqDate = new Date(
      new Date(item.pOrderHeader.OrigReqDate).getTime() -
        new Date(item.pOrderHeader.OrigReqDate).getTimezoneOffset() * 60000
    );
    item.pOrderHeader.UpdateDate = new Date(
      new Date(item.pOrderHeader.UpdateDate).getTime() -
        new Date(item.pOrderHeader.UpdateDate).getTimezoneOffset() * 60000
    );
    item.pOrderHeader.SubmitDate = new Date(
      new Date(item.pOrderHeader.SubmitDate).getTime() -
        new Date(item.pOrderHeader.SubmitDate).getTimezoneOffset() * 60000
    );

    item.pOrderCart[0].PODate = new Date(
      new Date(item.pOrderCart[0].PODate).getTime() -
        new Date(item.pOrderCart[0].PODate).getTimezoneOffset() * 60000
    );
    item.pOrderCart[0].RequiredDate = new Date(
      new Date(item.pOrderCart[0].RequiredDate).getTime() -
        new Date(item.pOrderCart[0].RequiredDate).getTimezoneOffset() * 60000
    );
    item.pOrderCart[0].OrigReqDate = new Date(
      new Date(item.pOrderCart[0].OrigReqDate).getTime() -
        new Date(item.pOrderCart[0].OrigReqDate).getTimezoneOffset() * 60000
    );
    item.pOrderCart[0].UpdateDate = new Date(
      new Date(item.pOrderCart[0].UpdateDate).getTime() -
        new Date(item.pOrderCart[0].UpdateDate).getTimezoneOffset() * 60000
    );
    item.pOrderCart[0].ProcessDate = new Date(
      new Date(item.pOrderCart[0].ProcessDate).getTime() -
        new Date(item.pOrderCart[0].ProcessDate).getTimezoneOffset() * 60000
    );
    // this.saveorderdata.push(item);

    let response = await this.SaveOrderDetailsCAB(item);

    this.OrderSummaryLoading = true;

    // // this.SaveOrderDetails(item)

    // //SAVE VALUE OF SAVEORDERDATA TO A SERVICE
    // this.createSharedService.saveOrderDetailsData = this.saveorderdata;

    // //CALL THE SAVEORDERDETAILS FUNCTION
    // this.currSaveOrderIndex = 1;
    // for (let i = 0; i < this.saveorderdata.length; i++) {
    //   this.SaveOrderDetailsCAB(this.saveorderdata[i]);
    // }
  }

  async SaveOrderDetailsCAB(item: saveOrderDetailsModel) {
    try {
      const data = await this.orderService.SaveOrderDetails(item).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
    // this.orderService.SaveOrderDetails(item).subscribe({
    //   next: (response) => {
    //     if (this.currSaveOrderIndex < this.saveorderdata.length) {
    //       this.currSaveOrderIndex += 1;
    //     } else {
    //       this.currSaveOrderIndex = 1;
    //     }
    //   },
    //   error: (e) => { },
    //   complete: () => { },
    // });
  }

  // Get all input elements with a specific class
  inputs = document.querySelectorAll('.uppercase-input');

  ngAfterViewInit() {
    // Loop through each input element
    this.inputs.forEach(function (input: any) {
      input.addEventListener('keyup', function (event: any) {
        // Save cursor position
        var cursorPosition = input.selectionStart;

        // Convert input value to uppercase
        input.value = input.value.toUpperCase();

        // Restore cursor position
        input.setSelectionRange(cursorPosition, cursorPosition);
      });
    });
  }

  CheckForUpcomingOrder() {
    if (this.createSharedService.upcomingOrderFlag == true) {
      console.log('Converted from Upcoming Order!!');
      console.log('this ->', this.OrderSummaryTableData);
      console.log('that >', this.createSharedService.upcomingData);

      for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
        let lItem = this.OrderSummaryTableData[i];
        let lUpcomingItem = this.createSharedService.upcomingData;

        if (lUpcomingItem) {
          if (lUpcomingItem.pUpcomingOrderNo) {
            if (
              lUpcomingItem.pSelectedProd[i] == lItem.Product &&
              lUpcomingItem.pSelectedSE[i].toUpperCase() ==
                lItem.StructureElement.toUpperCase() &&
              lUpcomingItem.pSelectedScheduled[i] == lItem.ScheduledProd &&
              lUpcomingItem.pSelectedWBS1[i] == lItem.WBS1 &&
              lUpcomingItem.pSelectedWBS2[i] == lItem.WBS2 &&
              lUpcomingItem.pSelectedWBS3[i] == lItem.WBS3
            ) {
              /**
               * Assign Required Date
               */
              lItem.RequiredDate =
                this.createSharedService.upcomingForecastDate;
              console.log(
                'lUpcomingItem Order Converted from -> ',
                lUpcomingItem.pUpcomingOrderNo[i]
              );
              console.log(
                'lUpcomingItem Order Converted to -> ',
                lItem.OrderNumber
              );
              /**
               * Run an API call to bind the newly generated OrderNumber to the exsisting order in Upcoming table
               */
              let pOrderNo = lUpcomingItem.pUpcomingOrderNo[i];
              let nOrderNO = lItem.OrderNumber;
              let nWBS1 = lItem.WBS1;
              let nWBS2 = lItem.WBS2;
              let nWBS3 = lItem.WBS3;
              let nStructureElement = lItem.StructureElement;
              let nProductType = this.getProductTypeUpcoming(lItem.Product);
              let CustomerCode = this.dropdown.getCustomerCode();
              let ProjectCode = this.dropdown.getProjectCode()[0];
              this.UpdateConvertedOrder(
                nOrderNO,
                nWBS1,
                nWBS2,
                nWBS3,
                nStructureElement,
                nProductType,
                CustomerCode,
                ProjectCode
              );
            }
          }
        }
      }

      this.RequiredDate = this.createSharedService.upcomingForecastDate;

      this.createSharedService.upcomingOrderFlag = false;
      this.createSharedService.upcomingData = undefined;
    }
  }

  UpdateConvertedOrder(
    pOrderNo: any,
    nWBS1: any,
    nWBS2: any,
    nWBS3: any,
    nStructureElement: any,
    nProductType: any,
    CustomerCode: any,
    ProjectCode: any
  ) {
    this.orderService
      .UpdateConvertedOrder(
        pOrderNo,
        nWBS1,
        nWBS2,
        nWBS3,
        nStructureElement,
        nProductType,
        CustomerCode,
        ProjectCode
      )
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {},
      });
  }

  getProductTypeUpcoming(pProduct: any) {
    if (pProduct.toLowerCase().includes('mesh')) {
      return 'MSH';
    } else if (pProduct.toLowerCase().includes('core')) {
      return 'CORE';
    } else if (pProduct.toLowerCase().includes('pre-cage')) {
      return 'PRC';
    }
    return '';
  }

  DeleteUpcomingOrder(pOrderNo: any) {
    //Update records for upcoming order which are converted from upcoming order page
    this.orderService.DeleteSubmittedUpcomingOrders(pOrderNo).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }

  DeleteAfterSubmissionUpcomingOrder(pRow: any) {
    //Update records for upcoming order which are Createed from create order page
    let wbs1 = '';
    let wbs2 = '';
    let wbs3 = '';
    if (pRow.WBS && pRow.WBS != 'NONWBS') {
      wbs1 = pRow.WBS.split('/')[0] ? pRow.WBS.split('/')[0] : '';
      wbs2 = pRow.WBS.split('/')[1] ? pRow.WBS.split('/')[1] : '';
      wbs3 = pRow.WBS.split('/')[2] ? pRow.WBS.split('/')[2] : '';
    }
    let lobj = {
      CustomerCode: this.dropdown.getCustomerCode(),
      ProjectCode: this.dropdown.getProjectCode(),
      WBS1: wbs1,
      WBS2: wbs2,
      WBS3: wbs3,
      StructureElement: pRow.StructureElement,
      ProductType: pRow.Product,
    };
    this.orderService.DeleteAfterSubmission(lobj).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }

  // shouldHighlightDate(date: NgbDate): boolean {
  //   const dateToCheck = new Date(date.year, date.month - 1, date.day);
  //   return this.lHolidays.some((highlightedDate: any) =>
  //     new Date(highlightedDate).getTime() === dateToCheck.getTime()
  //   );
  // }
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) > 6;

  // #region Handphone Validation
  // CheckHandphone(lHandphone: string) {
  //   // Phone Validation
  //   const phonePattern = /^\d{10}$/;
  //   if (!lHandphone) {
  //     this.errors.phone = 'Phone number is required.';
  //   } else if (!phonePattern.test(lHandphone)) {
  //     this.errors.phone = 'Enter a valid 10-digit phone number.';
  //   }
  // }
  // #endregion

  // #startregion Email Validation
  UpdateEmail(lEmail: any) {
    if (lEmail) {
      lEmail = lEmail.replaceAll(',', ';');
      lEmail = lEmail.replaceAll('/', ';');
      lEmail = lEmail.replaceAll(' ', ';');
      lEmail = lEmail.replaceAll('#', ';');
    }
    return lEmail;
  }
  CheckEmail(lEmail: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let lEmailList: any[] = [];
    if (lEmail) {
      lEmailList = lEmail.split(';');
      for (let i = 0; i < lEmailList.length; i++) {
        let x = lEmailList[i].trim();
        if (!emailPattern.test(x)) {
          return false;
        }
      }
    }
    return true;
  }
  // #endregion

  //Contact number validation
  CheckSingaporeMobile(lMobile: string): boolean {
    const mobilePattern =
      /^(?:\+65\s?)?\d{4}(\s?)\d{4}$|^(?:\+?6?01)?[02-46-9]-?\d{7}$|^(?:\+?6?01)?1-?\d{8}$/; ///^(?:\+65\s?)?[689]\d{7}$/
    let lMobileList: string[] = [];
    if (lMobile) {
      // Remove spaces and split by semicolon
      lMobileList = lMobile.split(';');
      for (let i = 0; i < lMobileList.length; i++) {
        let x = lMobileList[i].trim();
        if (!mobilePattern.test(x)) {
          return false;
        }
      }
    }
    return true;
  }

  //End
  // ODOS Enhancements:
  // 1. Change SuteContact & GoodReceiver fields from simple Inputs to Inputs wiht datalists,
  // 2. On selecting the value from the datalist , update their corresponding Handphone & Email fields.

  updateSiteContact(pSiteContact: string) {
    if (pSiteContact) {
      const contact = this.siteContactList.find(
        (x) => x.name?.toUpperCase() === pSiteContact?.toUpperCase()
      );
      if (contact) {
        this.SiteHandphone = contact.handphone;
        this.SiteEmail = contact.email;
        if (this.SiteHandphone) {
          this.setHandphoneM(this.SiteHandphone);
          this.setRemarks();
        }
      }
    }
  }

  updateGoodsReceiver(pGoodsReceiver: string) {
    if (pGoodsReceiver) {
      const contact = this.goodsReceiverList.find(
        (x) => x.name?.toUpperCase() === pGoodsReceiver?.toUpperCase()
      );
      if (contact) {
        this.ReceiverHandphone = contact.handphone;
        this.ReceiverEmail = contact.email;
        if (this.ReceiverHandphone) {
          this.setGoodsReceiverHandphoneM(this.ReceiverHandphone);
          this.setRemarks();
        }
      }
    }
  }

  GetContactList(): void {
    // For Site Contacts
    let lSiteContacts = localStorage.getItem('site-contact-list');
    if (lSiteContacts) {
      this.siteContactList = JSON.parse(lSiteContacts);
    }

    // For Goods Receiver
    let lGoodsReceiver = localStorage.getItem('goods-receiver-list');
    if (lGoodsReceiver) {
      this.goodsReceiverList = JSON.parse(lGoodsReceiver);
    }
  }

  SaveContactList(): void {
    // For Site Contacts
    let lObj = {
      name: this.SiteContact,
      handphone: this.SiteHandphone,
      email: this.SiteEmail,
    };
    let lIndex = this.siteContactList.findIndex((x) => x.name === lObj.name);
    if (lIndex > -1) {
      this.siteContactList[lIndex] = lObj;
    } else {
      this.siteContactList.push(lObj);
    }
    localStorage.setItem(
      'site-contact-list',
      JSON.stringify(this.siteContactList)
    );

    // For Goods Receiver
    lObj = {
      name: this.GoodsReceiver,
      handphone: this.ReceiverHandphone,
      email: this.ReceiverEmail,
    };
    lIndex = this.goodsReceiverList.findIndex((x) => x.name === lObj.name);
    if (lIndex > -1) {
      this.goodsReceiverList[lIndex] = lObj;
    } else {
      this.goodsReceiverList.push(lObj);
    }
    localStorage.setItem(
      'goods-receiver-list',
      JSON.stringify(this.goodsReceiverList)
    );
  }
  /** FOR External USERS */

  SendForApproval() {
    if (!this.checkBBSbeforeSubmit()) {
      this.toastr.error('Duplicate BBS Detected');
      return;
    }
    if (!this.checkBBSbeforeSubmit2()) {
      this.toastr.error('Invalid BBS Number Detected');
      return;
    }
    if (!this.checkBBSDescbeforeSubmit()) {
      this.toastr.error('Empty BBS Description Detected');
      return;
    }
    if (!this.checkBBSDescbeforeSubmit2()) {
      this.toastr.error('Invalid BBS Description Detected');
      return;
    }
    if (!this.CheckPONumber()) {
      this.toastr.error('Invalid PO number for.');
      return;
    }
    if (this.PONumberList.findIndex((x) => x === this.PONO) != -1) {
      // console.log('Present')
      // alert('Warning! The PO number ' + this.PONO + ' is used in another order already.');
      // return
    }

    // this.RequiredDate == "Invalid Date" ||
    // this.RequiredDate <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
    // this.RequiredDate >= new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
    if (this.RequiredDate == '' || this.RequiredDate == null) {
      this.toastr.error('Invalid RequiredDate');
      return;
    } else if (
      new Date(this.RequiredDate) <=
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
      new Date(this.RequiredDate) >=
        new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
    ) {
      this.toastr.error('Invalid RequiredDate');
      return;
    }

    if (this.Transport == '' || this.Transport == null) {
      this.toastr.error('Invalid Transport.');
      return;
    }

    // Validation for email
    if (!this.CheckEmail(this.SiteEmail)) {
      this.toastr.error('Invalid Site Contact Email');
      return;
    }
    if (!this.CheckEmail(this.ReceiverEmail)) {
      this.toastr.error('Invalid Goods Receiver Email');
      return;
    }
    //Valiadtion for Site contact

    if (!this.CheckSingaporeMobile(this.SiteHandphone)) {
      this.toastr.error('Invalid Site Handphone Number');
      return;
    }
    if (!this.CheckSingaporeMobile(this.ReceiverHandphone)) {
      this.toastr.error('Invalid Handphone Number');
      return;
    }

    if (
      confirm('Are you sure you want to Send the order for approval?') == true
    ) {
      this.submitOrderstatus = 'Send';
      // this.SaveOrder();
      this.getJoBIDCab();
      // this.SendForApprovalOrders();
    }
  }

  SendForApprovalOrders() {
    let customer = this.CustomerCode;
    let project = this.ProjectCode;

    if (!this.CheckReqDateSubmit()) {
      return;
    }

    this.currSubmitOrderIndex = 1;
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let order = Number(this.OrderSummaryTableData[i].OrderNumber);
      // this.changeStatus(customer, project, order, 'Delete')

      this.OrderSummaryLoading = true;
      let UpdateBy = this.loginService.GetGroupName();
      this.orderService
        .ChangeStatus(customer, project, order, 'Sent', UpdateBy)
        .subscribe({
          next: (response) => {
            console.log('Sent => ', response);
            this.submitOrderstatus = '';
            this.OrderSummaryLoading = false;

            if (response.success == false) {
              alert(response.message);
            } else {
              /**Function Call to update Upcoming Order */
              let lIndex = this.currSubmitOrderIndex - 1;
              let lOrderNo = Number(
                this.OrderSummaryTableData[lIndex].OrderNumber
              );
              //if(this.OrderSummaryTableData[lIndex].ScheduledProd=='Y'){
              this.DeleteUpcomingOrder(lOrderNo);
              //this.DeleteAfterSubmissionUpcomingOrder(this.OrderSummaryTableData[lIndex]);
              //}
              if (
                this.currSubmitOrderIndex < this.OrderSummaryTableData.length
              ) {
                this.currSubmitOrderIndex += 1;
              } else {
                this.currSubmitOrderIndex = 1;
                this.toastr.success(
                  'The order has been sent for approval successfully.'
                );
                this.OrderSubmitted = true;
                this.createSharedService.tempOrderSummaryList = undefined;
                this.createSharedService.tempProjectOrderSummaryList =
                  undefined;
                window.history.state.tempOrderSummaryList = undefined;
                this.createSharedService.showOrderSummary = false;

                if (this.ViewOrderSummary == true) {
                  this.router.navigate(['../order/createorder']);
                } else {
                  this.reloadService.reloadComponent.emit('Submitted');
                  this.GetOrderSummary();
                }
              }
            }
          },
          error: (e) => {
            alert(
              'Error on saving data. Please check the Internet connection and try again.'
            );
            this.OrderSummaryLoading = false;
          },
          complete: () => {
            this.OrderSummaryLoading = false;
          },
        });
    }
  }

  OrderApproval(pAction: string) {
    if (pAction === 'Approval') {
      if (!this.checkBBSbeforeSubmit()) {
        this.toastr.error('Duplicate BBS Detected');
        return;
      }
      if (!this.checkBBSbeforeSubmit2()) {
        this.toastr.error('Invalid BBS Number Detected');
        return;
      }

      if (!this.checkBBSDescbeforeSubmit()) {
        this.toastr.error('Empty BBS Description Detected');
        return;
      }

      if (!this.checkBBSDescbeforeSubmit2()) {
        this.toastr.error('Invalid BBS Description Detected');
        return;
      }

      if (!this.CheckPONumber()) {
        this.toastr.error('Invalid PO number for.');
        return;
      }
      if (this.PONumberList.findIndex((x) => x === this.PONO) != -1) {
        // console.log('Present')
        // alert('Warning! The PO number ' + this.PONO + ' is used in another order already.');
        // return
      }

      // this.RequiredDate == "Invalid Date" ||
      // this.RequiredDate <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
      // this.RequiredDate >= new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
      if (this.RequiredDate == '' || this.RequiredDate == null) {
        this.toastr.error('Invalid RequiredDate');
        return;
      } else if (
        new Date(this.RequiredDate) <=
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
        new Date(this.RequiredDate) >=
          new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
      ) {
        this.toastr.error('Invalid RequiredDate');
        return;
      }

      if (this.Transport == '' || this.Transport == null) {
        this.toastr.error('Invalid Transport.');
        return;
      }

      // Validation for email
      if (!this.CheckEmail(this.SiteEmail)) {
        this.toastr.error('Invalid Site Contact Email');
        return;
      }
      if (!this.CheckEmail(this.ReceiverEmail)) {
        this.toastr.error('Invalid Goods Receiver Email');
        return;
      }
      //Valiadtion for Site contact

      if (!this.CheckSingaporeMobile(this.SiteHandphone)) {
        this.toastr.error('Invalid Site Handphone Number');
        return;
      }
      if (!this.CheckSingaporeMobile(this.ReceiverHandphone)) {
        this.toastr.error('Invalid Handphone Number');
        return;
      }
      if (confirm('Are you sure you want to Approve the order?') == true) {
        this.submitOrderstatus = 'Approval';
        this.SaveOrder();
        // this.OrderApproval_POST();
      }
    } else if (pAction === 'Reject') {
      if (confirm('Are you sure you want to Reject the order?') == true) {
        this.submitOrderstatus = 'Reject';
        // this.SaveOrder();
        this.OrderApproval_POST();
      }
    }
  }

  OrderApproval_POST() {
    let customer = this.CustomerCode;
    let project = this.ProjectCode;

    if (!this.CheckReqDateSubmit()) {
      return;
    }

    let lStatus = '';
    if (this.submitOrderstatus === 'Approval') {
      lStatus = 'Submitted';
    } else if (this.submitOrderstatus === 'Reject') {
      lStatus = 'Reject';
    }
    this.currSubmitOrderIndex = 1;
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let order = Number(this.OrderSummaryTableData[i].OrderNumber);
      // this.changeStatus(customer, project, order, 'Delete')

      this.OrderSummaryLoading = true;
      let UpdateBy = this.loginService.GetGroupName();
      this.orderService
        .ChangeStatus(customer, project, order, lStatus, UpdateBy)
        .subscribe({
          next: (response) => {
            console.log('Sent => ', response);
            this.OrderSummaryLoading = false;

            if (response.success == false) {
              alert(response.message);
            } else {
              /**Function Call to update Upcoming Order */
              let lIndex = this.currSubmitOrderIndex - 1;
              let lOrderNo = Number(
                this.OrderSummaryTableData[lIndex].OrderNumber
              );
              //if(this.OrderSummaryTableData[lIndex].ScheduledProd=='Y'){
              this.DeleteUpcomingOrder(lOrderNo);
              //this.DeleteAfterSubmissionUpcomingOrder(this.OrderSummaryTableData[lIndex]);
              //}
              if (
                this.currSubmitOrderIndex < this.OrderSummaryTableData.length
              ) {
                this.currSubmitOrderIndex += 1;
              } else {
                this.currSubmitOrderIndex = 1;

                if (this.submitOrderstatus === 'Approval') {
                  alert(
                    'The order has been approved and successfully submitted to NatSteel for process.'
                  );
                } else if (this.submitOrderstatus === 'Reject') {
                  alert('The order has been rejected successfully');
                }

                this.OrderSubmitted = true;
                this.createSharedService.tempOrderSummaryList = undefined;
                this.createSharedService.tempProjectOrderSummaryList =
                  undefined;
                window.history.state.tempOrderSummaryList = undefined;
                this.createSharedService.showOrderSummary = false;

                // if (this.ViewOrderSummary == true) {
                if (this.submitOrderstatus === 'Approval') {
                  this.router.navigate(['../order/activeorder']);
                } else if (this.submitOrderstatus === 'Reject') {
                  this.router.navigate(['../order/activeorder']);
                }
                // this.router.navigate(['../order/createorder']);
                // } else {
                //   this.reloadService.reloadComponent.emit('Submitted');
                //   this.GetOrderSummary();
                // }
              }
            }
            this.submitOrderstatus = '';
          },
          error: (e) => {
            alert(
              'Error on saving data. Please check the Internet connection and try again.'
            );
            this.OrderSummaryLoading = false;
          },
          complete: () => {
            this.OrderSummaryLoading = false;
          },
        });
    }
  }

  CheckPONumber(): boolean {
    if (this.PONO) {
      if (this.PONO.trim()) {
        return true;
      }
    }
    return false;
  }

  checkBBSbeforeSubmit2() {
    if (this.OrderSummaryTableData.length > 1) {
      for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
        if (this.OrderSummaryTableData[i].Product == 'CAB') {
          if (!this.BBsValidator(this.OrderSummaryTableData[i].BBSNumnber)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  checkBBSDescbeforeSubmit2() {
    if (this.OrderSummaryTableData.length > 0) {
      for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
        if (this.OrderSummaryTableData[i].Product == 'CAB') {
          if (
            !this.BBsValidator(this.OrderSummaryTableData[i].BBSDescription)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  BBsValidator(value: any) {
    var lValue = value;

    if (
      lValue.indexOf('~') >= 0 ||
      lValue.indexOf('!') >= 0 ||
      lValue.indexOf('@@') >= 0 ||
      lValue.indexOf('@') >= 0 ||
      lValue.indexOf('#') >= 0 ||
      lValue.indexOf('$') >= 0 ||
      lValue.indexOf('%') >= 0 ||
      lValue.indexOf('^') >= 0 ||
      lValue.indexOf('+') >= 0 ||
      lValue.indexOf('`') >= 0 ||
      lValue.indexOf('=') >= 0 ||
      lValue.indexOf('\\') >= 0 ||
      lValue.indexOf('|') >= 0 ||
      lValue.indexOf(';') >= 0 ||
      lValue.indexOf("'") >= 0 ||
      lValue.indexOf(':') >= 0 ||
      lValue.indexOf('"') >= 0 ||
      lValue.indexOf('<') >= 0 ||
      lValue.indexOf('>') >= 0 ||
      lValue.indexOf('?') >= 0
    ) {
      return false;
    }
    return true;
  }

  // Unfocus the input element
  private unfocusInput(cell: string) {
    if (cell === 'bbsInput') {
      let lBBSElement = document.getElementById('bbsInput');
      if (lBBSElement) {
        lBBSElement.blur(); // Unfocus the input element
      }
    }
    if (cell === 'bbsDescInput') {
      let lBBSDescInput = document.getElementById('bbsDescInput');
      if (lBBSDescInput) {
        lBBSDescInput.blur(); // Unfocus the input element
      }
    }
  }

  /**
   * ODOS Enhancement: Check Transport mode for CAB orders before Order Submit.
   * Dated: 09/07/2025
   */
  async CheckCABTransportMode() {
    if (this.submitOrderstatus != '') {
      for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
        if (this.OrderSummaryTableData[i].Product == 'CAB') {
          // Enhancement - New validation for Transport Mode Mis-match
          let lTransportResp = await this.CheckTransportModeCABOrderSummary(
            this.OrderSummaryTableData[i].OrderNumber
          );
          if (lTransportResp == 'error') {
            // Error during the API call.
            alert(
              'Error on verifying CAB Transport Data. Please check the Internet connection and try again.'
            );
            return false;
          } else {
            if (lTransportResp.result == false) {
              // Shape Transport mis-match found
              if (lTransportResp?.transport == 'error') {
                alert(
                  'Error on verifying CAB Transport Data. Please check the Internet connection and try again.'
                );
                return false;
              }

              var lTransprt = lTransportResp?.transport;
              let lReturn = false;
              if (lTransprt == 'LBE') {
                var r = confirm(
                  'Need Low Bed with Police Escort for the material transportation, ' +
                    'you have to pay addtional transportation charges. Confirm?\n\n' +
                    '需要交警护送的超大件低盘拖车来运载您的钢筋, 您需要负责额外的运输费用. 请确认?'
                );
                if (r == true) {
                  lReturn = true;
                }
              } else if (lTransprt == 'LB30') {
                var r = confirm(
                  'Need Low Bed for the material transportation, ' +
                    'you have to pay addtional transportation charges. Confirm?\n\n' +
                    '需要超大件低盘拖车来运载您的钢筋, 您需要负责额外的运输费用. 请确认?'
                );
                if (r == true) {
                  lReturn = true;
                }
              } else if (lTransprt == 'TR40/24') {
                // No Validation popup required in case of Normal Transport.
                return true;
              }
              // else{
              //   var r = confirm(
              //     'Needs Normal Trailer for the material transportation. Confirm?\n\n'
              //   );
              //   if (r == true) {
              //     lReturn = true;
              //   }
              // }
              if (lReturn === true) {
                // If click "OK", Update the Transport mode for the order.
                this.Transport = lTransportResp?.transport;
                this.OrderSummaryTableData[i].Transport =
                  lTransportResp?.transport;
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  async CheckTransportModeCABOrderSummary(
    pOrderNumber: string | number
  ): Promise<any> {
    try {
      const data = await this.orderService
        .CheckTransportModeCABOrderSummary(pOrderNumber)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

  // getIsPrecast(intWBSID:number)
  // {
  //   debugger;
  //   this.wbsService
  //   .GetPrecastFlag(intWBSID)
  //   .subscribe({
  //     next: (response: any) => {
  //       this.isPrecastFlag=response;

  //     },
  //     error: () => {

  //     },
  //     complete: () => {},
  //   });
  // }
  getIsPrecast(customerCode: any, projectCode: any) {
    debugger;
    this.orderService.GetPrecastFlag(customerCode, projectCode).subscribe({
      next: (response: any) => {
        this.isPrecastFlag = response === true;
        this.IsPrecast = response === true;
      },

      error: (e) => {
        debugger;
        console.log(e, 'isPrecastFlag error');
      },
      complete: () => {},
    });
  }

  // GetConversionSummary()
  // {
  //   // let result = this.getJoBIDCab();
  //   let result_end:any[]=[];
  //   let OrderNumber:any="";
  //   if(this.CabJobIDs.length>0)
  //   {
  //   this.CabJobIDs.forEach((element:any,index:number)=> {
  //     this.orderService
  //     .GetSb_Conversion_Status(this.CustomerCode,this.ProjectCode,element)
  //     .subscribe({
  //       next: (response: any) => {
  //         if(response.status!="SBConverted" && response.status!="" )
  //         {
  //           result_end.push(response.status);
  //           // OrderNumber+=element.
  //         }

  //       },
  //       error: (err) => {
  //         console.log(err.message);

  //       },
  //       complete: () => {
  //         if ((this.CabJobIDs.length == index + 1) && result_end.length) {
  //           let message = "";

  //           result_end.forEach((element, index) => {
  //             message += `${index + 1})\n`;
  //             const msg = element.split(";");

  //             msg.forEach((text: any) => {
  //               message += `   - ${text.trim()}\n`;  // Indented bullet points
  //             });

  //             message += `\n`; // Extra line between items
  //           });
  //         // let message_New = this.getOrderNumberCab();

  //           alert(
  //             `CAB to Standard Bar conversion not done :\n` +
  //             // `${message}` +

  //             `Please revisit the BBS entry and click on "Order Summary" for SB conversion.`
  //           );
  //         }
  //         else if((this.CabJobIDs.length == index + 1) && result_end.length==0) {
  //           this.SaveOrder();
  //         }

  //       },
  //     });
  //   });
  // }
  // else{
  //   this.SaveOrder();
  // }

  // }

  // getJoBIDCab(){
  //   debugger;
  //   let result_end: any = [];
  //   this.getOrderNumberCab();
  //   this.OrderSummaryTableData.forEach((element,index) => {

  //     this.orderService
  //       .getJobId(element.OrderNumber,element.Product,element.StructureElement,element.ScheduledProd)
  //       .subscribe({
  //         next: (response: any) => {
  //           let JobID = response.CABJOBID;
  //           if(JobID)
  //           {
  //             result_end.push(JobID);
  //           }

  //         },
  //         error: (err) => {
  //           console.log(err.message);

  //         },
  //         complete: () => {
  //           if(index+1==this.OrderSummaryTableData.length)
  //           {
  //             this.CabJobIDs =  result_end;
  //             this.GetConevrsionSummary2();
  //           }

  //         },
  //       });

  //   });

  // }
  async GetConversionSummary() {
    // let result = this.getJoBIDCab();
    let flag = false;
    let result_end: any[] = [];
    let OrderNumber: any = '';
    let ordernumberString = '';
    // this.CabJobIDs.forEach(async (element:any,index:number)=> {
    for (let i = 0; i < this.CabJobIDs.length; i++) {
      // this.CabJobIDs.forEach(async (element:any,index:number)=> {
      let status = await this.GetSb_Conversion_Status(
        this.CabJobIDs[i].customercode,
        this.CabJobIDs[i].projectcode,
        this.CabJobIDs[i].jobid
      );
      if (status.status != 'SBConverted' && status.status != '') {
        // let obj ={
        //   "status":status,
        //   "ordernumber":this.CabJobIDs[i].ordernumber
        // }
        result_end.push(status);
        ordernumberString += this.CabJobIDs[i].ordernumber + '\t';
        // OrderNumber+=element.
      }
      // this.orderService
      // .GetSb_Conversion_Status(element.customercode,element.projectcode,element.jobid)
      // .subscribe({
      //   next: (response: any) => {
      //     if(response.status!="SBConverted" && response.status!="" )
      //     {
      //       result_end.push(response.status);
      //       // OrderNumber+=element.
      //     }

      //   },
      //   error: (err) => {
      //     console.log(err.message);

      //   },
      //   complete: () => {
      //     if ((this.CabJobIDs.length == index + 1) && result_end.length) {
      //       let message = "";
      //       flag=true;

      //       result_end.forEach((element1, index) => {
      //         message += `${index + 1})\n`;
      //         const msg = element1.split(";");

      //         msg.forEach((text: any) => {
      //           message += `   - ${text.trim()}\n`;  // Indented bullet points
      //         });

      //         message += `\n`; // Extra line between items
      //       });
      //     // let message_New = this.getOrderNumberCab();

      //       alert(
      //         `CAB to Standard Bar conversion not done :\n` +
      //         // `${message}` +

      //         `Please revisit the BBS entry and click on "Order Summary" for SB conversion.`
      //       );
      //     }
      //     else{
      //       // this.SaveOrder()
      //     }

      //   },
      // });
    }
    if (result_end.length) {
      let message = '';
      flag = true;

      // result_end.forEach((element1, index) => {
      //   message += `${index + 1})\n`;
      //   const msg = element1.split(";");

      //   msg.forEach((text: any) => {
      //     message += `   - ${text.trim()}\n`;  // Indented bullet points
      //   });

      //   message += `\n`; // Extra line between items
      // });
      // let message_New = this.getOrderNumberCab();

      alert(
        `CAB to Standard Bar conversion not done  for order number :\n` +
          `${ordernumberString}` +
          `Please revisit the BBS entry and click on "Order Summary" for SB conversion.`
      );
    } else {
      this.SaveOrder();
    }

    return flag;
  }
  async getJoBIDCab() {
    debugger;
    let flag: any = false;
    let result_end: any = [];
    // this.getOrderNumberCab();
    // SelectedRows.forEach(async (element:any,index:number) => {
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let response = await this.getJobId_Async(
        this.OrderSummaryTableData[i].OrderNumber,
        this.OrderSummaryTableData[i].Product,
        this.OrderSummaryTableData[i].StructureElement
      );
      let JobID = response?.CABJOBID;
      if (JobID) {
        let obj = {
          jobid: JobID,
          customercode: this.dropdown.getCustomerCode(),
          projectcode: this.dropdown.getProjectCode()[0],
          ordernumber: this.OrderSummaryTableData[i].OrderNumber,
        };
        result_end.push(obj);
      }
    }

    this.CabJobIDs = result_end;
    flag = this.GetConevrsionSummary2();
    // return flag;
  }

  getOrderNumberCab() {
    let result: any = [];
    this.OrderSummaryTableData.forEach((element) => {
      if (element.Product == 'CAB') result.push(element.OrderNumber);
    });

    this.CabOrderNumbers = result;
  }
  GetConevrsionSummary2() {
    if (this.CabJobIDs.length == 0) {
      //No Cab Orders are present
      this.SaveOrder();
    } else {
      this.GetConversionSummary();
    }
  }
  async getJobId_Async(
    ordernumber: any,
    producttype: any,
    structureelement: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .getJobId(ordernumber, producttype, structureelement, 'N')
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async GetSb_Conversion_Status(
    customercode: any,
    projectcode: any,
    jobid: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .GetSb_Conversion_Status(customercode, projectcode, jobid)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  GateData: any[] = [];
  PMAddress: string = '';
  PMGate: string = '';
  GetPMMProjectDetails(ProjectCode: any) {
    //NOTE : API call changed from GetPMMProjectDetails -> GetHmiAddress
    this.orderService.GetAddress(ProjectCode).subscribe({
      next: (response: any) => {
        // this.GateData = this.mapGateData(response);
        this.GateData = response;
        if (this.GateData?.length > 0) {
          let lAddress = this.dropdown.getAddressList()[0];
          for (let i = 0; i < this.GateData.length; i++) {
            if (this.GateData[i].id == lAddress) {
              this.PMAddress = this.GateData[i]?.projectAddress;
            }
          }
         
          // if(!this.PMAddress){
          //   this.PMAddress = this.GateData[0].projectAddress ? this.GateData[0].projectAddress : '';
          // }
          // if(!this.PMGate){
          //   this.PMGate = this.GateData[0].gate ? this.GateData[0].gate[0] : '';
          // }
          // this.GateNumberList = this.GateData[0].gate ? this.GateData[0].gate : [];
        }

        // console.log('this.GateData', this.GateData);
        // console.log('this.PMAddress', this.PMAddress);
        // console.log('this.PMGate', this.PMGate);
      },
      error: (err) => {
        console.log(err.message);
      },
      complete: () => {},
    });
  }

GetPMMProjectDetailsAddandGate(ProjectCode: any, CustomerCode: any) {

  this.orderService.GetPMMProjectDetails(ProjectCode, CustomerCode).subscribe({
    next: (response) => {
      // Extract only gate values
      let lAddress = this.dropdown.getAddressList()[0];
      console.log('lAddress', lAddress);
       // Filter the objects by projectAddressCode
      const filteredData = response.filter((x: any) => x.projectAddressCode === lAddress);

      // Now extract ONLY gate values
      this.GateNumberList = filteredData.map((x: any) => x.gate);

      if(this.GateNumberList.length > 0 && (this.PMGate == '' || this.PMGate == undefined)){
        this.PMGate = this.GateNumberList[0] ? this.GateNumberList[0].toString() : '';
      }

      console.log('GateNumberList', this.GateNumberList);
    },
    error: (e) => {
      console.log(e);
    }
  });

}



  // mapGateData(data: any[]): any[] {
  //   const grouped: { [key: string]: string[] } = {};

  //   data.forEach(item => {
  //     if (!grouped[item.address]) {
  //       grouped[item.address] = [];
  //     }
  //     grouped[item.address].push(item.gate);
  //   });

  //   return Object.keys(grouped).map(address => ({
  //     address,
  //     gate: grouped[address]
  //   }));
  // }

  GateNumberList: any[] = [];
  setPMAdress(PMAddress: string) {
    this.GateData?.forEach((item) => {
      if (item.projectAddress == PMAddress) {
        this.GateNumberList = item.gate ? item.gate : [];
        if (this.PMGate) {
          this.PMGate = item.gate ? item.gate[0] : '';
        }
      }
    });
  }

  CheckforGreenSelectionLock() {
    
    let lResult = false;
    
    for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
      let lItem = this.OrderSummaryTableData[i];
      let lQty = lItem.OrderQty ? Number(lItem.OrderQty) : 0;
      let lWt = lItem.OrderTonnage ? Number(lItem.OrderTonnage) : 0;
      if ((lQty > 0 || lWt > 0) && lItem.ScheduledProd == 'N') {
        lResult = true;
        break;
      }
    }

    this.createSharedService.greenSteelSelection_lock = lResult;
  }
}
