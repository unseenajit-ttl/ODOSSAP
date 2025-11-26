import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_FAB_DEFAULT_OPTIONS } from '@angular/material/button';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BBSOrderdetailsTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
import { BBSOrdertableModel } from 'src/app/Model/BBSOrdertableModel';
import { SaveBarDetailsModel } from 'src/app/Model/saveBarDetailsModel';
import { OrderService } from 'src/app/Orders/orders.service';
import { BindingLimitComponent } from '../createorder/orderdetails/binding-limit/binding-limit.component';
import { BeamMeshArray, precageArray } from 'src/app/Model/StandardbarOrderArray';
import { BeamlinkmeshOrderTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
import { DateTimeProvider } from 'angular-oauth2-oidc';
import { Toast, ToastrService } from 'ngx-toastr';

import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { PrcsharedserviceService } from './PrecageService/prcsharedservice.service';
import { Location } from '@angular/common';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { Router } from '@angular/router';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { CommonService } from 'src/app/SharedServices/CommonService';


@Component({
  selector: 'app-precage',
  templateUrl: './precage.component.html',
  styleUrls: ['./precage.component.css']
})
export class PrecageComponent {

  CustomerCode: any = this.dropdown.getCustomerCode();
  ProjectCode: any = this.dropdown.getProjectCode()[0];
  OrderStatus: any;
  JobID: any = 14;
  MemberQty: any;

  ScheduledProd: any;
  BBSID: any = 1;
  // StructureElement: any=this.createSharedService.selectedrecord.StructureElement;
  // ordernumber: any= this.createSharedService.selectedrecord.OrderNumber;; 
  // PostID: any=this.createSharedService.selectedrecord.PostID;
  RoutedFromProcess: boolean = false;
  StructureElement: any;
  ProductType: any;
ScheduleProd: any;
  ordernumber: any;
  PostID: any;
    gOrderSubmission:any="Yes";
     gOrderCreation: any = "Yes";
  showSideTable: boolean = false;
  bbsOrderTable: precageArray[] = [];
  bbsOrderTemp: precageArray[] = [];
  shapeCodeList: any[] = [];
  sizeList: any[] = [];
  Diameter: any;
  Spacing: any;
  CarrierWireDia: any;
  Mass: any;
  TotalWeight: any;
  LoadCABContent: boolean = false;
  LoadBEAMContent: boolean = false;
  LoadColumnContent: boolean = false;
  LoadCTSMeshContent: boolean = false;
  LoadDrawingContent: boolean = false;
  // StructureElement: any;
  selectedRowIndex: number | null = null;
  editIndex: any = null;

  tableInput: BeamlinkmeshOrderTableInput = {
    MeshMark: '',
    MeshProduct: '',
    MeshWidth: 0,
    MeshDepth: 0,
    MeshSlope: 0,
    MeshTotalLinks: 0,
    MeshSpan: 0,
    MeshMemberQty: 0,
    MeshCapping: false,
    MeshCPProduct: '',
    MeshShapeCode: '',
    A: 0,
    B: 0,
    C: 0,
    HOOK: 0,
    LEG: 0,
    MeshTotalWT: 0,
    MWLength: 0,
    MWBOM: '',
    CWBOM: '',
    Remarks: '',
    MeshID: 0,
    MeshSort: 0,
    CustomerCode: '',
    ProjectCode: '',
    JobID: 0,
    BBSID: 0,
    D: 0,
    E: 0,
    P: 0,
    Q: 0,
    I: 0,
    J: 0,
    SplitNotes: '',
    UpdateDate: new Date(),
    UpdateBy: '',
    ProdMWDia: 0,
    ProdMWSpacing: 0,
    ProdCWDia: 0,
    ProdCWSpacing: 0,
    ProdMass: 0,
    ProdMinFactor: 0,
    ProdMaxFactor: 0,
    ProdTwinInd: ''

  };

  receivedData: any;

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private prcSharedS: PrcsharedserviceService,
    private dropdown: CustomerProjectService,
    private createSharedService: CreateordersharedserviceService,
    private location: Location,
    private reloadService: ReloadService,
    private router: Router,
    private processsharedserviceService: ProcessSharedServiceService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService,
  ) { }

 async ngOnInit(){
  this.commonService.changeTitle('Prefabricated cages | ODOS');
    // this.LoadCABContent=true;
    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log('receivedData', this.receivedData)


    if (this.receivedData) {
      this.OrderStatus = this.receivedData.orderstatus;
      this.ScheduledProd = this.receivedData.ScheduledProd;
      this.StructureElement = this.receivedData.StructureElement;
      this.ordernumber = this.receivedData.ordernumber;
      this.PostID = this.receivedData.jobIds.PostHeaderID;
      this.MemberQty = "";
      this.BBSID = "";
      this.RoutedFromProcess = true;
      this.StructureElement=this.receivedData.StructureElement;
      this.ScheduleProd=this.receivedData.ScheduledProd;
      this.ProductType=this.receivedData.ProductType;
    }

    // this.StructureElement="COLUMN";
    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.ScheduledProd = this.createSharedService.selectedrecord.ScheduledProd;
      this.StructureElement = this.createSharedService.selectedrecord.StructureElement;
      this.ordernumber = this.createSharedService.selectedrecord.OrderNumber;
      this.PostID = this.createSharedService.selectedrecord.PostID;
      this.MemberQty = this.createSharedService.selectedrecord.OrderQty;
      this.BBSID = this.createSharedService.selectedrecord.BBSID
      this.StructureElement=this.createSharedService.selectedrecord.StructureElement;
      this.ScheduleProd=this.createSharedService.selectedrecord.ScheduledProd;
      this.ProductType=this.createSharedService.selectedrecord.Product;
    } else {
      this.dropdown.setCustomerCode(this.receivedData.customer);
      let obj: any = [];
      obj.push(this.receivedData.project);
      this.dropdown.setProjectCode(obj);

      let lAddressCodes: any = [];
      if (this.receivedData.AddressCode) {
        lAddressCodes.push(this.receivedData.AddressCode);
      }
      this.dropdown.setAddressList(lAddressCodes);
      
      this.reloadService.reloadCreateOrderCustomerProject.emit();
      await this.SetCreateDatainLocal(this.ordernumber);
    }


    //console.log('createSharedService.selectedrecord',this.createSharedService.selectedrecord);
    this.prcSharedS.lBBSID = this.BBSID;
    this.prcSharedS.lPostID = this.PostID;
    this.prcSharedS.lStructureElement = this.StructureElement;
    this.prcSharedS.MemberQty = this.MemberQty;
    this.prcSharedS.lordernumber = this.ordernumber;
    //console.log("prc shared service",this.prcSharedS);

    // this.GetTableData('0001101481', '0000113319', 1037031,1);
    //this.getShapeCodeList('0001101154', '0000112393', 'N-Splice');

    let lData: any = localStorage.getItem('ProcessOrderSummaryData');
    lData = JSON.parse(lData);
    if (lData) {
      this.RoutedFromProcess = true;
    }
    this.processsharedserviceService.setOrderSummaryData(lData);

    this.reloadCouplerType();
    this.getJobId(this.ordernumber);
    this.sizeList = [10, 13, 16, 20, 25, 28, 32, 40, 50];
    this.prcSharedS.lCustomerCode = this.CustomerCode;

    // this.prcSharedS.lJobID=this.JobID;
    // this.prcSharedS.lPostID= this.PostID;
    this.prcSharedS.lProjectCode = this.ProjectCode;
    this.prcSharedS.lStatus = this.OrderStatus;
    this.prcSharedS.lScheduledProd = this.ScheduledProd;
this.reloadProjectDetails(this.CustomerCode,this.ProjectCode);
  }
  couplertype: any;

  @ViewChild('tab1') tab1: ElementRef | undefined;
  @ViewChild('tab2') tab2: ElementRef | undefined;
  @ViewChild('tab3') tab3: ElementRef | undefined;
  @ViewChild('tab4') tab4: ElementRef | undefined;
  @ViewChild('tab5') tab5: ElementRef | undefined;


  selectedRow: any;

  reloadAllItems(item: any = []) {
    debugger;
    this.prcSharedS.lBBSID = item.BBSID;
    this.prcSharedS.lPostID = item.BBSNDSPostID;
    this.prcSharedS.lStructureElement = item.BBSStrucElem;
    this.prcSharedS.MemberQty = item.BBSQty;
    this.prcSharedS.lordernumber = this.ordernumber;
    // if (this.LoadCABContent) {
    //   if (this.tab1 != undefined || this.tab1 != null) {
    //     this.tab1.nativeElement.click();
    //   }
    // } else if (this.LoadBEAMContent) {
    //   if (this.tab2 != undefined || this.tab2 != null) {
    //     this.tab2.nativeElement.click();
    //   }
    // } else if (this.LoadColumnContent) {
    //   if (this.tab3 != undefined || this.tab3 != null) {
    //     this.tab3.nativeElement.click();
    //   }
    // }
    // else if (this.LoadCTSMeshContent) {
    //   if (this.tab4 != undefined || this.tab4 != null) {
    //     this.tab4.nativeElement.click();
    //   }
    // }
    // else if (this.LoadDrawingContent) {

    //   if (this.tab5 != undefined || this.tab5 != null) {
    //     this.tab5.nativeElement.click();
    //   }
    // }
  }
  reloadCouplerType() {
    this.orderService
      .getCouplerType_prc(this.CustomerCode, this.ProjectCode)
      .subscribe({
        next: (response) => {
          //console.log('BBSORDERDETAILS', response);
          this.couplertype = response;

        },
        error: (e) => {
          this.toastr.error("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..");
          // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
        },
        complete: () => {

          // this.loading = false;
        },
      });
  }
  getJobId(orderNumber: string): any {
    let ProdType=this.ProductType;
    let StructurEelement=this.StructureElement;
    let ScheduleProd=this.ScheduleProd;
    this.orderService.getJobId(orderNumber,ProdType,StructurEelement,ScheduleProd).subscribe({
      next: (response: any) => {
        //console.log('jobid', response);
        //debugger;
        // this.createSharedService.selectedJobIds.StdBarsJobID = response

        this.JobID = response.CageJobID;
        this.PostID = response.PostHeaderID;

        //console.log("job id:", this.JobID);
        this.prcSharedS.lJobID = this.JobID;
        // this.getBBS(this.JobID);

      },
      error: () => { },
      complete: () => {
        this.reloadbbs(this.CustomerCode, this.ProjectCode, this.PostID, this.StructureElement);
        //debugger;

      },
    });
  }

  getTab(tab: any) {
    this.LoadBEAMContent = false;
    this.LoadColumnContent = false;
    this.LoadCTSMeshContent = false;
    this.LoadDrawingContent = false;
    this.LoadCABContent = false;
    if (tab == "CAB") {
      this.LoadCABContent = true;
    }
    else if (tab == "BEAM") {
      this.LoadBEAMContent = true;
    }
    else if (tab == "COLUMN") {
      this.LoadColumnContent = true;
    }
    else if (tab == "CTSMESH") {
      this.LoadCTSMeshContent = true;
    }
    else {
      this.LoadDrawingContent = true;
    }

    this.reloadAllItems(this.temprow);

  }
  openBending() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
    };
    const modalRef = this.modalService.open(
      BindingLimitComponent,
      ngbModalOptions
    );
  }

  title: any;

  ShowShapeList() {
    let lCategory = "BEAM";

    this.orderService.ShowShapeList().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // a.download = 'STDMESH-' + this.ProjectCode + this.JobID + '.pdf';
        // a.click();

        window.open(url, '_blank');
      },
      error: (e) => {
        alert("Error on extraction data, please check the Internet connection.");
      },
      complete: () => {
        this.title = "List of MESH Shapes (网片图形列表)";
        if (lCategory == "BEAM") {
          var lTitle = "List of Beam Stirrup Cage Shapes (梁箍铁图形列表)";
        }

        // this.loading = false;
      },
    });
  }

  DownloadShapeList() {
    let lCategory = "BEAM";
    this.orderService.ShowShapeList().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ShapeList.pdf';
        a.click();

        // window.open(url, '_blank');
      },
      error: (e) => {
        alert("Error on extraction data, please check the Internet connection.");
      },
      complete: () => {
        this.title = "List of MESH Shapes (网片图形列表)";
        if (lCategory == "BEAM") {
          var lTitle = "List of Beam Stirrup Cage Shapes (梁箍铁图形列表)";
        }

        // this.loading = false;
      },
    });
  }

  lColNum: number = 0;
  ShowProductList() {
    let lCategory = "BEAM";
    this.orderService.getProductList_beam(lCategory).subscribe({
      next: (response) => {
        //console.log('getProductList_beam', response);
      },
      error: (e) => {
        alert("Error on extraction data, please check the Internet connection.");
      },
      complete: () => {
        this.title = "List of MESH Shapes (网片图形列表)";
        this.lColNum = 8;
        if (lCategory == "BEAM") {
          this.title = "Beam Stirrup Cage Products List(梁箍筋产品列表)";
          this.lColNum = 6;
        }
        // this.loading = false;
      },
    });
  }

  DownloadProductList() {
    let lCategory = "BEAM";
    this.orderService.printProduct_beam(lCategory).subscribe({
      next: (response) => {
        //console.log('printProduct_beam', response);
      },
      error: (e) => {
        alert("Error on extraction data, please check the Internet connection.");
      },
      complete: () => {
        const pdfUrl = "../../../../assets/Products_List.pdf";
        window.open(pdfUrl, '_blank');
        // this.loading = false;
      },
    });
  }

  onSelectStandardBar() { }

  // onQtyChange() {
  //   this.tableInput.   = (
  //     Number(this.tableInput.Memberqty) * Number(this.tableInput.Eachqty)
  //   ).toString();
  // }

  // onLengthChange() {
  //   this.tableInput.Length = (
  //     Number(this.tableInput.A) +
  //     Number(this.tableInput.B) +
  //     Number(this.tableInput.C) +
  //     Number(this.tableInput.D) +
  //     Number(this.tableInput.E) +
  //     Number(this.tableInput.F) +
  //     Number(this.tableInput.G)
  //   ).toString();
  // }

  updateData() {
    this.editIndex = null;
  }

  resetInput() {
    this.tableInput = {
      MeshMark: '',
      MeshProduct: '',
      MeshWidth: 0,
      MeshDepth: 0,
      MeshSlope: 0,
      MeshTotalLinks: 0,
      MeshSpan: 0,
      MeshMemberQty: 0,
      MeshCapping: false,
      MeshCPProduct: '',
      MeshShapeCode: '',
      A: 0,
      B: 0,
      C: 0,
      HOOK: 0,
      LEG: 0,
      MeshTotalWT: 0,
      MWLength: 0,
      MWBOM: '',
      CWBOM: '',
      Remarks: '',
      MeshID: 0,
      MeshSort: 0,
      CustomerCode: '',
      ProjectCode: '',
      JobID: 0,
      BBSID: 0,
      D: 0,
      E: 0,
      P: 0,
      Q: 0,
      I: 0,
      J: 0,
      SplitNotes: '',
      UpdateDate: new Date(),
      UpdateBy: '',
      ProdMWDia: 0,
      ProdMWSpacing: 0,
      ProdCWDia: 0,
      ProdCWSpacing: 0,
      ProdMass: 0,
      ProdMinFactor: 0,
      ProdMaxFactor: 0,
      ProdTwinInd: ''
    };
  }

  // saveData() {
  //   this.SaveTableData();

  //   //console.log(this.tableInput);
  //   let tempobj: BeamlinkmeshOrderTableInput = {
  //     CustomerCode: this.CustomerCode,
  //     ProjectCode: this.ProjectCode,
  //     JobID: this.JobID,
  //     BBSID: 0,

  //     // BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length,
  //     MeshID: 0,
  //     MeshSort: this.tableInput.MeshSort,
  //     MeshMark: this.tableInput.MeshMark,
  //     MeshWidth: this.tableInput.MeshWidth,
  //     MeshDepth: this.tableInput.MeshDepth,
  //     MeshSlope: this.tableInput.MeshSlope,
  //     MeshProduct: this.tableInput.MeshProduct,
  //     MeshShapeCode: this.tableInput.MeshShapeCode,
  //     MeshTotalLinks: this.tableInput.MeshTotalLinks,
  //     MeshSpan: this.tableInput.MeshSpan,
  //     MeshMemberQty: this.tableInput.MeshMemberQty,
  //     MeshCapping: this.tableInput.MeshCapping,
  //     MeshCPProduct: this.tableInput.MeshCPProduct,
  //     A: this.tableInput.A,
  //     B: this.tableInput.B,
  //     C: this.tableInput.C,
  //     D: 0,
  //     E: 0,
  //     P: 0,
  //     Q: 0,
  //     I: 0,
  //     J: 0,
  //     HOOK: this.tableInput.HOOK,
  //     LEG: this.tableInput.LEG,
  //     MeshTotalWT: this.tableInput.MeshTotalWT,
  //     Remarks: this.tableInput.Remarks,
  //     MWLength: this.tableInput.MWLength,
  //     MWBOM: this.tableInput.MWBOM,
  //     CWBOM: this.tableInput.CWBOM,
  //     SplitNotes: '',
  //     UpdateDate: new Date(),
  //     UpdateBy: 'Vishal',
  //     ProdMWDia:0,
  //   ProdMWSpacing:0,
  //   ProdCWDia:0,
  //   ProdCWSpacing:0,
  //   ProdMass:0,
  //   ProdMinFactor:0,
  //   ProdMaxFactor:0,
  //   ProdTwinInd:''

  //   };
  //   // let tempobj = {
  //   //   sno: this.bbsOrderTable.length + 1,
  //   //   cancel: false,
  //   //   elementmark: this.tableInput.elementmark,
  //   //   Mark: this.tableInput.Mark,
  //   //   Type: this.tableInput.Type,
  //   //   Size: this.tableInput.Size,
  //   //   standardbar: this.tableInput.standardbar,
  //   //   Memberqty: this.tableInput.Memberqty,
  //   //   Eachqty: this.tableInput.Eachqty,
  //   //   Totalqty: this.tableInput.Totalqty,
  //   //   Shapecode: this.tableInput.Shapecode,
  //   //   A: this.tableInput.A,
  //   //   B: this.tableInput.B,
  //   //   C: this.tableInput.C,
  //   //   D: this.tableInput.D,
  //   //   E: this.tableInput.E,
  //   //   F: this.tableInput.F,
  //   //   G: this.tableInput.G,
  //   //   PinSize: this.tableInput.PinSize,
  //   //   Length: this.tableInput.Length,
  //   //   Weight: this.tableInput.Weight,
  //   //   Remarks: this.tableInput.Remarks,
  //   //   BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length
  //   // }

  //   this.bbsOrderTable.push(tempobj);

  //   this.resetInput();
  // }

  SaveTableData() {
    let obj: BeamlinkmeshOrderTableInput = {
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,
      JobID: this.JobID,
      BBSID: 0,

      // BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length,
      MeshID: 0,
      MeshSort: this.tableInput.MeshSort,
      MeshMark: this.tableInput.MeshMark,
      MeshWidth: this.tableInput.MeshWidth,
      MeshDepth: this.tableInput.MeshDepth,
      MeshSlope: this.tableInput.MeshSlope,
      MeshProduct: this.tableInput.MeshProduct,
      MeshShapeCode: this.tableInput.MeshShapeCode,
      MeshTotalLinks: this.tableInput.MeshTotalLinks,
      MeshSpan: this.tableInput.MeshSpan,
      MeshMemberQty: this.tableInput.MeshMemberQty,
      MeshCapping: this.tableInput.MeshCapping,
      MeshCPProduct: this.tableInput.MeshCPProduct,
      A: this.tableInput.A,
      B: this.tableInput.B,
      C: this.tableInput.C,
      D: 0,
      E: 0,
      P: 0,
      Q: 0,
      I: 0,
      J: 0,
      HOOK: this.tableInput.HOOK,
      LEG: this.tableInput.LEG,
      MeshTotalWT: this.tableInput.MeshTotalWT,
      Remarks: this.tableInput.Remarks,
      MWLength: this.tableInput.MWLength,
      MWBOM: this.tableInput.MWBOM,
      CWBOM: this.tableInput.CWBOM,
      SplitNotes: '',
      UpdateDate: new Date(),
      UpdateBy: 'Vishal',
      ProdMWDia: 0,
      ProdMWSpacing: 0,
      ProdCWDia: 0,
      ProdCWSpacing: 0,
      ProdMass: 0,
      ProdMinFactor: 0,
      ProdMaxFactor: 0,
      ProdTwinInd: ''

    };
    this.orderService.saveMeshBeamDetails_beam(obj).subscribe({
      next: (response) => {
        //console.log('Beam Link Mesh Details', response);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getShapeCodeList(
    CustomerCode: string,
    ProjectCode: string,
    CouplerType: string
  ) {
    this.orderService
      .getShapeCodeList(CustomerCode, ProjectCode, CouplerType)
      .subscribe({
        next: (response) => {
          //console.log('shapeCodeList', response);
          this.shapeCodeList = response;
        },
        error: (e) => { },
        complete: () => {
          // this.loading = false;
        },
      });
  }

  reloadbbs(
    CustomerCode: string,
    ProjectCode: string,
    PostID: any,
    StructureElement: any
  ) {
    if (this.ScheduledProd == "Y") {
      if (this.CustomerCode != "" && this.ProjectCode != "") //&& this.JobID==0
      {

        debugger;
        this.orderService
          .getBBSOrderNSH(CustomerCode, ProjectCode, PostID, StructureElement)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);

              this.bbsOrderTable = response;
              this.bbsOrderTable = this.bbsOrderTable.filter(item => item.BBSAssembly === true);
              //console.log(this.bbsOrderTable);
              this.TotalWeight = 0;
              for (let i = 0; i < this.bbsOrderTable.length; i++) {
                // this.TotalWeight+= this.bbsOrderTable[i].MeshTotalWT;
              }

            },
            error: (e) => {
              this.toastr.error("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..");
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              if (this.bbsOrderTable.length > 0) {
                this.getRowData(this.bbsOrderTable[0], 0);
                this.LoadCABContent = true;
              }

              // this.loading = false;
            },
          });
      }
    }
    else {
      if (this.CustomerCode != "" && this.ProjectCode != "") { //&& this.JobID==0
        this.orderService
          .getBBSOrder_prc(CustomerCode, ProjectCode, PostID, this.StructureElement)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);

              this.bbsOrderTable = response;
              this.bbsOrderTable = this.bbsOrderTable.filter(item => item.BBSAssembly === true);
            },
            error: (_e) => {
              this.toastr.error("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..");
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              this.getRowData(this.bbsOrderTable[0], 0);
              this.LoadCABContent = true;
              // this.loading = false;
            },
          });
      }
    }

  }

  temprow: any;

  getRowData(item: any = [], index: any) {
    this.selectedRow = item.BBSID;
    this.prcSharedS.lBBSID = item.BBSID;
    this.selectedRowIndex = index;
    this.temprow = item;
    this.reloadAllItems(item);
  }

  GetTableData(
    CustomerCode: string,
    ProjectCode: string,
    PostID: number,
    BBSID: number
  ) {

    if (this.ScheduledProd == "YES") {
      if (this.CustomerCode != "" && this.ProjectCode != "" && this.JobID > 0) {
        this.orderService
          .getBBSOrderNSH(CustomerCode, ProjectCode, PostID, this.StructureElement)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);

              this.bbsOrderTable = response;
              this.bbsOrderTable = this.bbsOrderTable.filter(item => item.BBSAssembly === true);
              //console.log(this.bbsOrderTable);
              this.TotalWeight = 0;
              for (let i = 0; i < this.bbsOrderTable.length; i++) {
                // this.TotalWeight+= this.bbsOrderTable[i].MeshTotalWT;
              }
            },
            error: (e) => {
              this.toastr.error("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..");
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {

              // this.loading = false;
            },
          });
      }
    }
    else {
      if (this.CustomerCode != "" && this.ProjectCode != "" && this.JobID > 0) {
        this.orderService
          .getBBSOrder_prc(CustomerCode, ProjectCode, PostID, this.StructureElement)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);

              this.bbsOrderTable = response;
              this.bbsOrderTable = this.bbsOrderTable.filter(item => item.BBSAssembly === true);
            },
            error: (_e) => {
              this.toastr.error("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..");
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              // this.loading = false;
            },
          });
      }
    }

  }

  goBack(): void {
    if (!this.RoutedFromProcess) {
      this.location.back();
    } else {
      this.router.navigate(['../order/createorder']);
    }
  }

    reloadProjectDetails(CustomerCode: any, ProjectCode: any) {
    this.orderService
      .reload_ProjectDetails_PRC(CustomerCode, ProjectCode)
      .subscribe({
        next: (response) => {
          console.log('reload_ProjectDetails', response);
          this.gOrderSubmission = response.OrderSubmission;
          this.gOrderCreation = response.OrderCreation;
        
        },
        error: (e) => {
          this.gOrderSubmission = this.commonService.Submission;
          this.gOrderCreation = this.commonService.Editable;
        },
        complete: () => {
          // this.loading = false;
        },
      });
  }

  async GetOrderSet(OrderNumber: any, RouteFlag: boolean) {
    // CALL API TO RETURN ALL ORDERS WITH SIMILAR REF NUMBER TO GIVEN ORDER NUMBER
    try {
      const data = await this.orderService
        .GetOrderSet(OrderNumber, RouteFlag)
        .toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }
  async SetCreateDatainLocal(OrderNumber: any) {
    // NOTE: GET ALL ORDERS WITH SIMILAR REF NUMBER
    let response: any = await this.GetOrderSet(OrderNumber, false);

    let lStructureElement: any[] = [];
    let lProductType: any[] = [];
    let lTotalWeight: any[] = [];
    let lTotalQty: any[] = [];
    let lSelectedPostId: any[] = [];
    let lScheduledProd: any[] = [];
    let lWBS1: any[] = [];
    let lWBS2: any[] = [];
    let lWBS3: any[] = [];
    let lOrderNo: any[] = [];
    let lStrutureProd: any[] = [];

    if (response == false) {
      alert('Connection error, please check your internet connection.');
      return;
    } else {
      for (let i = 0; i < response.length; i++) {
        lStructureElement.push(response[i].StructureElement);
        lProductType.push(response[i].ProductType);
        lTotalWeight.push(1);
        lTotalQty.push(response[i].TotalPCs);
        lSelectedPostId.push(response[i].PostHeaderId);
        lScheduledProd.push(response[i].ScheduledProd);
        lWBS1.push(response[i].WBS1);
        lWBS2.push(response[i].WBS2);
        lWBS3.push(response[i].WBS3);
        lOrderNo.push(response[i].OrderNo);

        let lStructPrd =
          response[i].StructureElement + '/' + response[i].ProductType;
        if (response[i].PostHeaderId) {
          lStructPrd = lStructPrd + response[i].PostHeaderId;
        }
        lStrutureProd.push(lStructPrd);
      }
    }

    this.createSharedService.selectedTab = true;
    if (lStructureElement.includes('NONWBS' || 'nonwbs')) {
      this.createSharedService.selectedTab = false;
    }
    let tempOrderSummaryList: TempOrderSummaryData = {
      pCustomerCode: '',
      pProjectCode: '',
      pSelectedCount: 0,
      pSelectedSE: lStructureElement,
      pSelectedProd: lProductType,
      pSelectedWT: lTotalWeight,
      pSelectedQty: lTotalQty,
      pSelectedPostID: lSelectedPostId,
      pSelectedScheduled: lScheduledProd,
      pSelectedWBS1: lWBS1,
      pSelectedWBS2: lWBS2,
      pSelectedWBS3: lWBS3,
      pWBS1: '',
      pWBS2: '',
      pWBS3: '',
      pOrderNo: lOrderNo,
      StructProd: lStrutureProd,
    };

    this.createSharedService.tempOrderSummaryList = undefined;
    this.createSharedService.tempProjectOrderSummaryList = undefined;
    // localStorage.setItem(
    //   'CreateDataProcess',
    //   JSON.stringify(tempOrderSummaryList)
    // );
    setTimeout(() => {
      console.log('SetOrderSummaryData', tempOrderSummaryList);
      this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
        // You can set a specific message to display after the timeout
      }, 1000);
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    // this.router.navigate(['../order/createorder']);
  }
}
