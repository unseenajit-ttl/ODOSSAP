import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { OrderService } from '../orders.service';
//import { StandardMeshOrderArray } from 'src/app/Model/StandardMeshOrderArray';
import { Result } from 'src/app/Model/Result';
import { DraftBatchChangeOrderArray } from 'src/app/Model/DraftBatchChangeOrderArray';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { DraftedOrderArray } from 'src/app/Model/DraftedOrderArray';
//import { StandardMeshOrderArray } from 'src/app/Model/StandardMeshOrderArray';
import { StdProdDetailsModels } from 'src/app/Model/StdProdDetailsModels';
//import { PDFDocument, rgb } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';
import { StandardMeshOrderArray, StdSheetDetailsModels } from 'src/app/Model/StandardMeshOrderArray';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { saveOrderDetailsModel } from 'src/app/Model/saveOrderDetailsModel';
//import { GcPdfViewer } from '@grapecity/gcpdfviewer';
import { Location } from '@angular/common';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { LoginService } from 'src/app/services/login.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';

@Component({
  selector: 'app-standardmeshorder',
  templateUrl: './standardmeshorder.component.html',
  styleUrls: ['./standardmeshorder.component.css']
})
export class StandardmeshorderComponent {

  CustomerCode: any = this.dropdown.getCustomerCode();
  ProjectCode: any = this.dropdown.getProjectCode()[0];
  OrderStatus: any;
  JobID: any = "";
  ordernumber: any;

  activeorderForm!: FormGroup;
  ReqdateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  PlanDelidateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  POdateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  customerList: any = [];

  istoggel: boolean = false;

  hideTable: boolean = true;
  projectList: any = [];
  loadingData = false;
  StandardMeshOrderArray: StandardMeshOrderArray[] = [];
  StandardMeshOrderTempArray: StandardMeshOrderArray[] = [];
  ProjectCategorey: StandardMeshOrderArray[] = [];
  StandardMeshsOrderArray_backup: StandardMeshOrderArray[] = [];
  DraftedOrderArray_Temp: StandardMeshOrderArray[] = [];
  STDDataArray: StdSheetDetailsModels[] = [];
  DraftBatchChangeOrderArray: any[] = [];
  Result: Result[] = []; //| undefined;
  resbody: any = { Message: '', response: '' };
  ProductTypeList: any[] = [{ ProdTypeCode: '', ProdTypeDesc: '' }];

  isExpand: boolean = false;
  toggleFilters = false;
  ProjectList: any;

  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;

  name: string = '';
  editColumn: boolean = false;

  OrderNumber: any;
  PONumber: any;
  RequiredDate: any;
  WBS1: any;
  WBS2: any;
  WBS3: any;
  ProductType: any;
  StructureElement: any;
  ScheduleProd: any;
  BBSNo: any;
  BBSDesc: any;
  PODate: any;
  Tonnage: any;
  SubmittedBy: any;
  CreatedBy: any;
  ProjectTitle: any;
  // OrderStatus: any;
  Details: any;

  StartReqDate: any = null;
  EndReqDate: any = null;

  StartPlanDate: any = null;
  EndPlanDate: any = null;

  StartPODate: any = null;
  EndPODate: any = null;

  disablewithdraw: boolean = true;
  disablesubmit: boolean = true;

  showSNo: boolean = true;
  showPonumber: boolean = true;
  showReqDate: boolean = true;
  showPlanDeliDate: boolean = true;
  showWBS1: boolean = true;
  showWBS2: boolean = true;
  showWBS3: boolean = true;
  showProductType: boolean = true;
  showStructureElement: boolean = true;
  showBBSNo: boolean = true;
  showBBSDesc: boolean = true;
  showPODate: boolean = false;
  showTonnage: boolean = true;
  showSubmittedBy: boolean = false;
  showCreatedBy: boolean = false;
  showProjectTitle: boolean = false;
  showOrderStatus: boolean = true;
  showDetail: boolean = true;

  totalCount: number = 0;
  CABtotalWeight: string = '0';
  MESHtotalWeight: string = '0';
  COREtotalWeight: string = '0';
  PREtotalWeight: string = '0';

  gBBSChanged: number = 0;
  gJobAdviceChanged: number = 0;

  lReqDate1: any;
  //CustomerCode: string="";
  //ProjectCode: string="";
  //ProjectCode: any=[];

  DraftOrderLoading: boolean = false;

  lOrderNOs: any = [];

  ordernumbers: any;

  showUnshare: boolean = true;
  showShare: boolean = true;
  showDelete: boolean = true;
  showSent: boolean = true;
  showSubmit: boolean = true;

  UserType: any = '';
  Submission: any = '';
  Editable: any = '';
  showbutton1: boolean = true;
  showbutton2: boolean = true;
  showbutton3: boolean = false;
  showbutton4: boolean = false;
  showbutton5: boolean = false;
  sixmbar: boolean = false;
  twelvembar: boolean = false;
  sixteenbar: boolean = false;
  fourteenmbar: boolean = false;
  fivebar: boolean = false;
  fifteenmbar: boolean = false;
  valueOrderQty: any;
  valueunitWt: any;
  totalBundleWt: string | undefined;

  IsDownload: boolean = true;
  getfile: any;

  showMeshList1: boolean = false;
  showMeshList2: boolean = false;
  showMeshList3: boolean = false;
  showMeshList4: boolean = false;
  showMeshList5: boolean = false;
  showMeshList6: boolean = false;
  showMeshList7: boolean = false;
  showMeshList8: boolean = false;
  showMeshList9: boolean = false;
  showMeshList10: boolean = false;
  StandardMeshProductOrderLoading: boolean = false;
  isSaveBBS: boolean = false;
  isSaveJobAdvice: boolean = false;
  SaveBBSResponse: any;
  SaveJobAdviceResponse: any;

  tooltip: any = "abc";
  atotooltip: any = "abc";

  prodTypeBody: any = { ProductType: '', lsubmission: '', leditable: '' };
  showbuttonsavesubmit: boolean = true;
  showaddorderbutton: boolean = true;
  showremovebutton: boolean = true;

  buttonStyle = {}; // Initial style object

  showBottomTable: boolean = false;

  ProductDetailsEditable: boolean = true;
  receivedData: any = "";
  RoutedFromProcess: boolean = false;

  SelectedProductType: any;
  gOrderCreation: any = "Yes";
  gOrderSubmission:any="Yes";
  myDate: any;

  // For Column filter search in the Main Table
  searchProductCode: string = '';
  searchProductDesc: string = '';
  searchDiameter: string = '';
  searchGrade: string = '';
  searchUnitWeight: string = '';
  searchMainLen: string = '';
  searchCrossLen: string = '';
  searchMWDia:string = '';
searchMWSpacing: string = '';
searchSSName: string = '';
searchMW_size: string = '';
searchCWSize: string = '';
searchCWSpacing: string = '';
searchUnitWt: string = '';
searchcw_size: string = '';
searchM01: string = '';
searchCO1:string = '';

  constructor(
    private location: Location,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private createSharedService: CreateordersharedserviceService,
    private dropdown: CustomerProjectService,
    private processsharedserviceService: ProcessSharedServiceService,
    private lloginservice: LoginService,
    private reloadService: ReloadService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService,
  ) {
    this.activeorderForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      wbs1: new FormControl('', Validators.required),
      wbs2: new FormControl('', Validators.required),
      wbs3: new FormControl('', Validators.required),
      po: new FormControl('', Validators.required),
      podate: new FormControl('', Validators.required),
      requireddate: new FormControl('', Validators.required),
      isinclude: new FormControl('', Validators.required),
    });
  }

  async ngOnInit() {
    this.commonService.changeTitle('Std Mesh | ODOS');
    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log('receivedData', this.receivedData)

    // localStorage.removeItem('ProcessData');


    if (this.receivedData) {
      this.CustomerCode = this.receivedData.customer;
      this.ProjectCode = this.receivedData.project;
      this.ProductDetailsEditable = this.receivedData.ProductDetailsEdit;
      this.ordernumber = this.receivedData.ordernumber;
      this.RoutedFromProcess = true;
      this.OrderStatus = this.receivedData.orderstatus;
      this.StructureElement = this.receivedData.StructureElement;
      this.ScheduleProd = this.receivedData.ScheduledProd;
      this.ProductType = this.receivedData.ProductType;
      // this.tooltip="can't perform";

    }


    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];

      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.ordernumber = this.createSharedService.selectedrecord.OrderNumber;
      // this.JobAdviceData = this.createSharedService.JobAdviceCAB;
      // this.lTransportMode = this.createSharedService.selectedrecord.Transport;
      this.StructureElement = this.createSharedService.selectedrecord.StructureElement;
      this.ScheduleProd = this.createSharedService.selectedrecord.ScheduledProd;
      this.ProductType = this.createSharedService.selectedrecord.Product;
    }
    else {
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

    if (this.OrderStatus == "Submitted") {
      this.tooltip = "Cannot delete product from submitted order (不可从已提交的订单删除产品)";
      this.atotooltip = "Cannot add product to submitted order (不可再加产品到已提交的订单)";

    }
    else {
      this.tooltip = "Remove";
      this.atotooltip = "Add To Order";

    }

    if (this.OrderStatus == "Created" || this.OrderStatus == "Created*") {
      this.ProductDetailsEditable = true;
    }
    else {
      this.ProductDetailsEditable = false;
    }

    // Set OderSummaryList Data from local Storage and remove item from local Storage.
    let lData: any = localStorage.getItem('ProcessOrderSummaryData');
    lData = JSON.parse(lData);
    if (lData) {
      this.RoutedFromProcess = true;
    }
    this.processsharedserviceService.setOrderSummaryData(lData);
    // localStorage.removeItem('ProcessOrderSummaryData');

    //WHEN ROUTED FROM PROCSS ORDER
    // if (this.processsharedserviceService.getProductDetailsEditable() == false) {
    //   // set customer and project from process order
    //   this.CustomerCode = this.processsharedserviceService.ProcessCustomer
    //   this.ProjectCode = this.processsharedserviceService.ProcessProject
    //   this.ProductDetailsEditable = this.processsharedserviceService.getProductDetailsEditable()
    // }

    this.getJobId(this.ordernumber)
    await this.GetProductGreenSteelValue();
    // this.submit(6, 'A2');
    //this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    this.getProductTypeList();
    //this.getProjCategorey();
    this.submit(6, 'A2');
    this.getfile = "https://localhost:5009/ShowDir";
    this.reloadProjectDetails(this.CustomerCode,this.ProjectCode);

  }
  Loaddata() { }


  download() {
    this.orderService.showdir(this.ProjectCode, this.JobID).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'STDMESH-' + this.ProjectCode + this.JobID + '.pdf';
      a.click();

      window.open(url, '_blank'); // Opens the PDF in a new tab

      this.StandardMeshProductOrderLoading = false;
    });
  }


  temp: boolean = false;

  filename: string = "";
  a: any;

  pdfSrc: any;
  lProdTypeDet: any;

  ProductTypeChanged(event: any) {
    this.showBottomTable = false

    this.sixmbar = false;
    this.twelvembar = false;
    this.fourteenmbar = false;
    this.fivebar = false;
    this.fifteenmbar = false;
    this.showMeshList1 = false;
    this.showMeshList2 = false;
    this.showMeshList3 = false;
    this.showMeshList4 = false;
    this.showMeshList5 = false;
    this.showMeshList6 = false;
    this.showMeshList7 = false;
    this.showMeshList8 = false;
    this.showMeshList9 = false;
    this.showMeshList10 = false;
    // console.log(event.value);
    // console.log(event);

    this.lProdTypeDet = event.substring(4);
    console.log("this.lProdTypeDet -> ", this.lProdTypeDet);
    if (this.lProdTypeDet == '1') {
      this.showMeshList1 = true;
      this.reloadStdSheetMaster('A');
    }
    else if (this.lProdTypeDet == '2') {
      this.showMeshList2 = true;
      this.reloadStdSheetMaster('A2');
    }
    else if (this.lProdTypeDet == '3') {
      this.showMeshList3 = true;
      this.reloadStdSheetMaster('A3');
    }
    else if (this.lProdTypeDet == '4') {
      this.showMeshList4 = true;
      this.reloadStdSheetMaster('A4');
    }
    else if (this.lProdTypeDet == '5') {
      this.showMeshList5 = true;
      this.reloadStdSheetMaster('A5');
    }
    else if (this.lProdTypeDet == '6') {
      this.showMeshList6 = true;
      this.reloadStdSheetMaster('A6');
    }
    else if (this.lProdTypeDet == '7') {
      this.showMeshList7 = true;
      this.reloadStdSheetMaster('A7');
    }
    else if (this.lProdTypeDet == '8') {
      this.showMeshList8 = true;
      this.reloadStdSheetMaster('A8');
    }
    else if (this.lProdTypeDet == '9') {
      this.showMeshList9 = true;
      this.reloadStdSheetMaster('F9');
    }
    else if (this.lProdTypeDet == 'A') {
      this.showMeshList10 = true;
      this.reloadStdSheetMaster('AA');
    }
  }

  reloadStdSheetMaster(SeriesCode: any) {
    console.log("SeriesCode -> ", SeriesCode)
    this.orderService.reloadStdSheetMaster(SeriesCode).subscribe({
      next: async (response) => {
        console.log(response);
        debugger;
      //  response=this.FilterResponseForGreenSteel(response);
        this.StandardMeshOrderArray = response;
        this.StandardMeshsOrderArray_backup = JSON.parse(
          JSON.stringify(this.StandardMeshOrderArray)
           //JSON.parse(JSON.stringify(this.StandardMeshsOrderArray_backup))
         )
      },
      error: (e) => { },
      complete: () => {
        //this.IsDownload=false;
        // this.loading = false;
      },
    });
  }
  getProductTypeList() {
    this.StandardMeshProductOrderLoading = true;
    debugger;
    this.orderService.getProductTypeList().subscribe({
      next: async (response) => {
        console.log("ProductTypeList ->", response);
        debugger;
        this.ProductTypeList = response;


        // CODE ADDED BY KUNAL
        if (response) {
          if (response.length > 0) {
            this.SelectedProductType = response[0].ProdTypeCode;
            this.ProductTypeChanged(this.SelectedProductType);
          }
        }

      },
      error: (e) => {
        this.StandardMeshProductOrderLoading = false;
      },
      complete: () => {
        this.StandardMeshProductOrderLoading = false;
        //this.IsDownload=false;
        // this.loading = false;
      },
    });
  }
  orderPrint() {
    if (!this.validateOrderQty()) {
      return false;
    }
    this.StandardMeshProductOrderLoading = true;
    debugger;
    if (this.OrderStatus == 'New' &&
      this.OrderStatus == 'Reserved' &&
      this.OrderStatus == 'Sent' &&
      this.OrderStatus == 'Created*' &&
      this.OrderStatus == 'Created'
  ) {
    if (this.SaveBBSData(this.temp)) {
      alert(
        'Cannot print the order as failed to save order detail data (因无法存储订单明细,打印订单失败).'
      );
      this.StandardMeshProductOrderLoading = false;
      return false;
    }
    if (this.SaveJobAdvice(this.temp)) {
      alert(
        'Cannot print the order as failed to save order data  (因无法存储订单数据,打印订单失败)..'
      );
      this.StandardMeshProductOrderLoading = false;
      return false;
    }
  }

    if (this.JobID == 0) {
      alert("Invalid order number. Order print fails.");
      return false;
    }
    debugger;

    this.orderService.printOrderDetail(this.CustomerCode, this.ProjectCode, this.JobID).subscribe((data) => {

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'OrderDetail-' + this.ProjectCode + this.JobID + '.pdf';
      a.click();

      window.open(url, '_blank'); // Opens the PDF in a new tab

      // this.StandardBarProductOrderLoading = false;
      this.StandardMeshProductOrderLoading = false;
    });

    return;
  }
  //need to pass order creation variable. gOrderSubmission & gOrderCreation
  //take above variables from api

  SaveBBSData(SubmitInd: boolean) {
    if (!this.validateOrderQty()) {
      return false;
    }
    this.StandardMeshProductOrderLoading = true;
    this.myDate = new Date()
    this.STDDataArray = [];
    debugger;
    let currentDate = new Date();
    if (this.OrderStatus != "New" && this.OrderStatus != "Reserved" && this.OrderStatus != "Sent" &&
      this.OrderStatus != "Created*" && this.OrderStatus != "Created" || this.gOrderCreation != "Yes") {
      return true;
    }
    if (this.gBBSChanged > 0) {

      for (let i = 0; i < this.StandardMeshOrderTempArray.length; i++) {


        let obj2 = {
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          JobID: this.JobID,
          SheetID: this.StandardMeshOrderTempArray[i].std_sheet_id,
          SheetSort: 0,
          std_type: this.StandardMeshOrderTempArray[i].std_type,
          mesh_series: this.StandardMeshOrderTempArray[i].mesh_series,
          sheet_name: this.StandardMeshOrderTempArray[i].ss561_name,
          mw_length: this.StandardMeshOrderTempArray[i].mw_length,
          mw_size: this.StandardMeshOrderTempArray[i].mw_size,
          mw_spacing: this.StandardMeshOrderTempArray[i].mw_spacing,
          mo1: this.StandardMeshOrderTempArray[i].mo1,
          mo2: this.StandardMeshOrderTempArray[i].mo2,
          cw_length: this.StandardMeshOrderTempArray[i].cw_length,
          cw_size: this.StandardMeshOrderTempArray[i].cw_size,
          cw_spacing: this.StandardMeshOrderTempArray[i].cw_spacing,
          co1: this.StandardMeshOrderTempArray[i].co1,
          co2: this.StandardMeshOrderTempArray[i].co2,
          unit_weight: this.StandardMeshOrderTempArray[i].unit_weight,
          order_pcs: this.StandardMeshOrderTempArray[i].order_pcs,
          order_wt: this.StandardMeshOrderTempArray[i].order_wt,
          sap_mcode: this.StandardMeshOrderTempArray[i].sap_mcode,
          UpdateBy: "ckg",
          UpdateDate: this.myDate
        }

        this.STDDataArray.push(obj2);


      }

      let obj = {
        customerCode: this.CustomerCode,
        projectCode: this.ProjectCode,
        jobID: this.JobID,
        StdProdDetails: this.STDDataArray
      }

      console.log('working');
      console.log(obj.StdProdDetails);
      debugger;
      this.isSaveBBS = false;
      this.orderService.saveBBS_mesh(obj).subscribe({
        next: (response) => {
          this.resbody = response;
          debugger;
          if (this.resbody.response == "success") {
            this.SaveBBSResponse = this.resbody.Message;
            this.isSaveBBS = true;
            this.gBBSChanged = 0;

            return true;
          }
          else {
            this.toastr.error(this.resbody.Message);
            return false;
          }


          //allowGrade500M
        },
        error: (e) => {
          this.StandardMeshProductOrderLoading = false;
        },
        complete: () => {
          this.StandardMeshProductOrderLoading = false;
          if (this.isSaveJobAdvice && this.isSaveBBS) {
            this.toastr.success(this.resbody.Message);
            this.isSaveJobAdvice = false;
            this.isSaveBBS = false;

          }
          // this.loading = false;
        },
      });


    }
    return;
  }

  reloadProjectDetails(CustomerCode: any, ProjectCode: any) {
    this.orderService
      .reload_ProjectDetails_Mesh(CustomerCode, ProjectCode)
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

  SaveJobAdvice(SubmitInd: boolean) {
    if (!this.validateOrderQty()) {
      return false;
    }
    debugger;
    this.isSaveJobAdvice = false;
    if (this.gJobAdviceChanged > 0) {
      this.StandardMeshProductOrderLoading = true;

      if (this.CustomerCode == "") {
        alert("Please assign customer to the user before order creation.");
        return false;
      }

      if (this.ProjectCode == "") {
        alert("Please assign Project to the user before order creation.")
        return false;
      }

      if (this.OrderStatus != "New" && this.OrderStatus != "Reserved" && this.OrderStatus != "Sent" &&
        this.OrderStatus != "Created*" && this.OrderStatus != "Created" || this.gOrderCreation != "Yes") {
        return true;
      }
      this.orderService.SaveJobAdvice_mesh(this.CustomerCode, this.ProjectCode, this.JobID, this.OrderStatus, this.valueOrderQty, this.totalwt).subscribe({
        next: (response) => {
          this.resbody = response;
          if (this.resbody.response == "success") {
            this.isSaveJobAdvice = true;
            this.gJobAdviceChanged = 0;
            return true;
          }
          else {
            this.toastr.error(this.resbody.Message);
            return false;
          }


          //allowGrade500M
        },
        error: (e) => {
          this.StandardMeshProductOrderLoading = false;
        },
        complete: () => {
          this.StandardMeshProductOrderLoading = false;
          if (this.isSaveJobAdvice && this.isSaveBBS) {
            this.toastr.success(this.resbody.Message);
            this.isSaveJobAdvice = false;
            this.isSaveBBS = false;

          }
          // this.loading = false;
        },
      });
    }
    return;
  }


  BBSChanged() {
    this.gBBSChanged = this.gBBSChanged + 1;
  }

  JobAdviceChanged() {
    this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
  }

  calculateTotalBundleWtSum(): any {

    for (let j = 0; j < this.StandardMeshOrderTempArray.length; j++) {
      this.valueOrderQty += this.StandardMeshOrderTempArray[j].order_pcs;
    }
    for (let j = 0; j < this.StandardMeshOrderTempArray.length; j++) {
      this.valueunitWt += this.StandardMeshOrderTempArray[j].unit_weight;
    }

    //this.totalBundleWt= this.valueOrderQty.toString()  this.valueunitWt.toString();

    this.BBSChanged();
    this.JobAdviceChanged();

    return this.valueOrderQty / this.valueunitWt; //2/5


  }


  totalwt: any;
  calculateTotalBundleWt() {
    this.valueOrderQty = 0;
    this.valueunitWt = 0;
    for (let j = 0; j < this.StandardMeshOrderTempArray.length; j++) {
      if (this.StandardMeshOrderTempArray[j].order_pcs != null || this.StandardMeshOrderTempArray[j].order_pcs != undefined) {
        this.valueOrderQty = this.valueOrderQty + this.StandardMeshOrderTempArray[j].order_pcs;
      }
    }
    for (let j = 0; j < this.StandardMeshOrderTempArray.length; j++) {
      if (this.StandardMeshOrderTempArray[j].order_wt != null || this.StandardMeshOrderTempArray[j].order_wt != undefined) {
        this.valueunitWt = this.valueunitWt + this.StandardMeshOrderTempArray[j].order_wt;
      }
    }
    this.valueunitWt = `${this.valueunitWt.toFixed(3)}`;
    console.log("decimal : " + this.valueunitWt);

    this.totalBundleWt = this.valueOrderQty.toString() + "/" + this.valueunitWt.toString();
    this.totalwt = this.valueunitWt;
    this.BBSChanged();
    this.JobAdviceChanged();
  }

  getBBS(id: number) {
    debugger;
    this.StandardMeshProductOrderLoading = true;
    this.orderService.getBBS_mesh(this.CustomerCode, this.ProjectCode, id).subscribe({
      next: (response) => {

        this.StandardMeshOrderTempArray = response ? response : [];

        for (let i = 0; i < this.StandardMeshOrderTempArray.length; i++) {
          this.StandardMeshOrderTempArray[i].ss561_name = response[i].sheet_name
        }

        this.calculateTotalBundleWt();
        //allowGrade500M
      },
      error: (e) => { },
      complete: () => {
        this.StandardMeshProductOrderLoading = false;
        // this.loading = false;
      },
    });

  }

  calculateResult(index: number) {
    const item = this.StandardMeshOrderTempArray[index];
    if(item.order_pcs < 0){
      item.order_pcs = item.order_pcs * -1;
    }
    item.order_wt = item.unit_weight * item.order_pcs;

    debugger;
    this.calculateTotalBundleWt();
  }

  // getProjCategorey() {
  //   this.showbutton3 = false;
  //   this.showbutton4 = false;
  //   this.showbutton5 = false;
  //   this.CustomerCode = '0001102303';
  //   this.ProjectCode = '0000113361';
  //   //alert('ok');
  //   this.orderService.getProjCategorey(this.CustomerCode, this.ProjectCode).subscribe({
  //       next: (response) => {
  //         this.ProjectCategorey = response;
  //         if (this.ProjectCategorey[0].maxBarLength >= 14000) {
  //           this.showbutton3 = true;
  //         }
  //         if (this.ProjectCategorey[0].maxBarLength >= 15000) {
  //           this.showbutton4 = true;
  //         }
  //         if (this.ProjectCategorey[0].allowGrade500M == true) {
  //           this.showbutton5 = true;
  //         }
  //         //allowGrade500M
  //       },
  //       error: (e) => {},
  //       complete: () => {
  //         // this.loading = false;
  //       },
  //     });
  // }


  transferItem(item: any = [], index: any) {
    let i = this.StandardMeshOrderTempArray.findIndex(x => x === item)
    if (i == -1) {
      const isDuplicate = this.StandardMeshOrderTempArray.some(existingItem => {
        // Replace 'anotherCondition' with the actual condition you want to check
        return existingItem.ss561_name === item.ss561_name;
      });
      if (isDuplicate == false) {
        this.StandardMeshOrderTempArray.push(item);
        this.calculateTotalBundleWt();
        return;
      }
    }

    this.toastr.warning("Productcode already added.");


  }

  validateOrderQty() {
    for (let i = 0; i < this.StandardMeshOrderTempArray.length; i++) {
      if (this.StandardMeshOrderTempArray[i].order_pcs == null || this.StandardMeshOrderTempArray[i].order_pcs == undefined || this.StandardMeshOrderTempArray[i].order_pcs == 0) {
        // this.toastr.error("Please enter Order Quantity");
        return false;
      }
    }
    return true;
  }

  validateOrderQtyEnd() {
    for (let i = 0; i < this.StandardMeshOrderTempArray.length; i++) {
      if (this.StandardMeshOrderTempArray[i].order_pcs == null || this.StandardMeshOrderTempArray[i].order_pcs == undefined || this.StandardMeshOrderTempArray[i].order_pcs == 0) {
        this.toastr.error("Please enter Order Quantity");
        return false;
      }
    }
    return true;
  }


  removeItem(item: any = [], i: any) {
    const index = this.StandardMeshOrderTempArray.indexOf(item);
    if (index !== -1) {
      this.StandardMeshOrderTempArray.splice(index, 1);
    }
    this.calculateTotalBundleWt();

  }


  submit(value: any, prodtype: any) {
    debugger;
    this.sixmbar = false;
    this.twelvembar = false;
    this.fourteenmbar = false;
    this.fivebar = false;
    this.fifteenmbar = false;
    console.log(value);

    this.showBottomTable = true
    if (value == '6') {
      this.sixmbar = true;
    } else if (value == '12') {
      this.twelvembar = true;
    } else if (value == '14') {
      this.fourteenmbar = true;
    } else if (value == '15') {
      this.fifteenmbar = true;
    } else {
      this.fivebar = true;
    }
    this.reloadStdSheetMaster(prodtype);


  }


  showDetails(item: string) {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {

    this.activeorderForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.activeorderForm.controls;
  }

  onSubmit() {
    // //console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.activeorderForm.invalid) {
      return;
    }


  }

  onReset() {
    this.submitted = false;
    this.hideTable = true;
    this.activeorderForm.reset();
  }

  searchData() {
    debugger;
    this.StandardMeshOrderArray = JSON.parse(
      JSON.stringify(this.StandardMeshsOrderArray_backup)
    );
  }
  dateChange(date: any) {
    console.log(date.value);
    if (date.value == '') {
      this.StandardMeshOrderArray = JSON.parse(
        JSON.stringify(this.StandardMeshsOrderArray_backup)
      );
    }
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



  clearAll() {
    this.hideTable = true;
    this.ProjectList = [];
    this.StandardMeshOrderArray = [];
  }



  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }
  goBack(): void {
    if (!this.RoutedFromProcess) {
      this.location.back();
    } else {
      this.router.navigate(['../order/createorder']);
    }
  }
  SaveOrderDetails(item: saveOrderDetailsModel) {
    debugger;
    this.orderService.SaveOrderDetails(item).subscribe({
      next: (response) => {
        console.log(response);
        // alert("Order Saved Successfully")
        this.toastr.success('Order Saved Succesfully');
        this.goBack()
      },
      error: (e) => { },
      complete: () => {
      },
    });
  }


  success: boolean = false;
  SaveOrder() {
    this.success = this.validateOrderQtyEnd();
    if (this.success == true) {
      this.SaveBBSData(false);
      this.SaveJobAdvice(false);
      this.goBack();
    }
    else {
      //  this.toastr.error("please enter order quantity");
    }
  }

  getJobId(orderNumber: string): any {
    let ProdType = this.ProductType;
    let StructurEelement = this.StructureElement;
    let ScheduleProd = this.ScheduleProd;
    this.orderService.getJobId(orderNumber, ProdType, StructurEelement, ScheduleProd).subscribe({
      next: (response: any) => {
        console.log('jobid', response);
        this.JobID = response.StdMESHJobID
        this.getBBS(this.JobID);
        this.GetProductType();
      },
      error: () => { },
      complete: () => {
        // this.submit(6, 'A2');
      },
    });
  }
  focusNextRowInput(index: number, inputField: HTMLInputElement): void {
    const nextRowIndex = index + 1;
    const nextInputField = document.querySelector(`input[tabindex="${nextRowIndex + 1}"]`) as HTMLInputElement;
    if (nextInputField) {
      nextInputField.focus();
    }
  }

  GetProductType() {
    debugger;

    this.StandardMeshProductOrderLoading = true;
    let username = this.lloginservice.GetGroupName();
    console.log("to get product type");
    this.orderService.GetProductType(this.CustomerCode, this.ProjectCode, username, this.JobID.toString()).subscribe({
      next: async (response) => {
        this.prodTypeBody = response;

        console.log(response);
      },
      error: (e) => {
        console.error('not working');
      },
      complete: () => {
        //debugger;
        this.showbuttonsavesubmit = true;
        this.showaddorderbutton = true;
        this.showremovebutton = true;

        this.Editable ='No';
        if (this.prodTypeBody[0].leditable == "Yes") {
          this.showaddorderbutton = false;
          this.showremovebutton = false;
          this.Editable ='Yes';
        }
        this.Submission='No';
        if (this.prodTypeBody[0].lsubmission == "Yes") {
          this.showbuttonsavesubmit = false;
          this.Submission='Yes';
        }

        this.gOrderCreation = this.prodTypeBody[0].leditable;

        this.StandardMeshProductOrderLoading = false;
        // this.loading = false;
        if (this.OrderStatus == 'Created' || this.OrderStatus == 'Created*'|| (this.OrderStatus == 'Sent' && this.Submission =='Yes')) {
          this.ProductDetailsEditable = true;
        } else {
          this.ProductDetailsEditable = false;
        }
      },
    });


  }

  SaveJobAdviceforSaveButton(SubmitInd: boolean) {
    if (!this.validateOrderQty()) {
      return false;
    }
    debugger;
    this.isSaveJobAdvice = false;
    if (this.gJobAdviceChanged > 0) {
      this.StandardMeshProductOrderLoading = true;

      if (this.CustomerCode == "") {
        alert("Please assign customer to the user before order creation.");
        return false;
      }

      if (this.ProjectCode == "") {
        alert("Please assign Project to the user before order creation.")
        return false;
      }

      if (this.OrderStatus != "New" && this.OrderStatus != "Reserved" && this.OrderStatus != "Sent" &&
        this.OrderStatus != "Created*" && this.OrderStatus != "Created" || this.gOrderCreation != "Yes") {
        return true;
      }
      this.orderService.SaveJobAdvice_mesh(this.CustomerCode, this.ProjectCode, this.JobID, this.OrderStatus, this.valueOrderQty, this.totalwt).subscribe({
        next: (response) => {
          this.resbody = response;
          if (this.resbody.response == "success") {
            this.isSaveJobAdvice = true;
            this.gJobAdviceChanged = 0;
            return true;
          }
          else {
            this.toastr.error(this.resbody.Message);
            return false;
          }


          //allowGrade500M
        },
        error: (e) => {
          this.StandardMeshProductOrderLoading = false;
        },
        complete: () => {
          this.StandardMeshProductOrderLoading = false;
          if (this.isSaveJobAdvice && this.isSaveBBS) {
            this.toastr.success(this.resbody.Message);
            this.isSaveJobAdvice = false;
            this.isSaveBBS = false;

          }
          // this.loading = false;
        },
      });
    }
    return;
  }


  SaveBBSDataforSaveButton(SubmitInd: boolean) {
    if (!this.validateOrderQtyForSaveButton()) {
      return false;
    }
    this.myDate = new Date()
    this.STDDataArray = [];
    debugger;
    let currentDate = new Date();
    if (this.OrderStatus != "New" && this.OrderStatus != "Reserved" && this.OrderStatus != "Sent" &&
      this.OrderStatus != "Created*" && this.OrderStatus != "Created" || this.gOrderCreation != "Yes") {
      return true;
    }
    if (this.gBBSChanged > 0) {

      for (let i = 0; i < this.StandardMeshOrderTempArray.length; i++) {


        let obj2 = {
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          JobID: this.JobID,
          SheetID: this.StandardMeshOrderTempArray[i].std_sheet_id,
          SheetSort: 0,
          std_type: this.StandardMeshOrderTempArray[i].std_type,
          mesh_series: this.StandardMeshOrderTempArray[i].mesh_series,
          sheet_name: this.StandardMeshOrderTempArray[i].ss561_name,
          mw_length: this.StandardMeshOrderTempArray[i].mw_length,
          mw_size: this.StandardMeshOrderTempArray[i].mw_size,
          mw_spacing: this.StandardMeshOrderTempArray[i].mw_spacing,
          mo1: this.StandardMeshOrderTempArray[i].mo1,
          mo2: this.StandardMeshOrderTempArray[i].mo2,
          cw_length: this.StandardMeshOrderTempArray[i].cw_length,
          cw_size: this.StandardMeshOrderTempArray[i].cw_size,
          cw_spacing: this.StandardMeshOrderTempArray[i].cw_spacing,
          co1: this.StandardMeshOrderTempArray[i].co1,
          co2: this.StandardMeshOrderTempArray[i].co2,
          unit_weight: this.StandardMeshOrderTempArray[i].unit_weight,
          order_pcs: this.StandardMeshOrderTempArray[i].order_pcs,
          order_wt: this.StandardMeshOrderTempArray[i].order_wt,
          sap_mcode: this.StandardMeshOrderTempArray[i].sap_mcode,
          UpdateBy: "ckg",
          UpdateDate: this.myDate
        }

        this.STDDataArray.push(obj2);


      }

      let obj = {
        customerCode: this.CustomerCode,
        projectCode: this.ProjectCode,
        jobID: this.JobID,
        StdProdDetails: this.STDDataArray
      }

      console.log('working');
      console.log(obj.StdProdDetails);
      debugger;
      this.isSaveBBS = false;
      this.StandardMeshProductOrderLoading = true;
      this.orderService.saveBBS_mesh(obj).subscribe({
        next: (response) => {
          this.resbody = response;
          debugger;
          if (this.resbody.response == "success") {
            this.SaveBBSResponse = this.resbody.Message;
            this.isSaveBBS = true;
            this.gBBSChanged = 0;

            return true;
          }
          else {
            this.toastr.error(this.resbody.Message);
            return false;
          }


          //allowGrade500M
        },
        error: (e) => {
          this.StandardMeshProductOrderLoading = false;
        },
        complete: () => {
          this.StandardMeshProductOrderLoading = false;
          if (this.isSaveJobAdvice && this.isSaveBBS) {
            this.toastr.success(this.resbody.Message);
            this.isSaveJobAdvice = false;
            this.isSaveBBS = false;

          }
          // this.loading = false;
        },
      });


    }
    return;
  }

  validateOrderQtyForSaveButton() {
    for (let i = 0; i < this.StandardMeshOrderTempArray.length; i++) {
      if (this.StandardMeshOrderTempArray[i].order_pcs == null || this.StandardMeshOrderTempArray[i].order_pcs == undefined || this.StandardMeshOrderTempArray[i].order_pcs == 0) {
        this.toastr.error("Please enter Order Quantity");
        return false;
      }
    }
    return true;
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
    if (lStructureElement.includes('NONWBS') || lStructureElement.includes('nonwbs')) {
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
    console.log('SetOrderSummaryData', tempOrderSummaryList);
    setTimeout(() => {
    console.log('SetOrderSummaryData', tempOrderSummaryList);
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
      // You can set a specific message to display after the timeout
    }, 1000);
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    // this.router.navigate(['../order/createorder']);
  }

    // Main table column Filter Search
    filterStandardMeshOrderArray() {
      this.StandardMeshOrderArray = JSON.parse(
       JSON.stringify(this.StandardMeshsOrderArray_backup)
        //JSON.parse(JSON.stringify(this.StandardMeshsOrderArray_backup))
      )
      if (this.searchSSName) {
        this.UpdateDataList(this.searchSSName, 'ss561_name');
      }
     if (this.searchMainLen) {
        this.UpdateDataList(this.searchMainLen, 'mw_length');
      }
      if (this.searchCrossLen) {
        this.UpdateDataList(this.searchCrossLen, 'cw_length');
      }
      if (this.searchMWDia) {
        this.UpdateDataList(this.searchMWDia, 'searchCWSize');
      }
      if (this.searchMWSpacing) {
        this.UpdateDataList(this.searchMWSpacing, 'mw_spacing');
      }
      if (this.searchM01) {
        this.UpdateDataList(this.searchM01, 'mo1');
      }
      if (this.searchMW_size) {
        this.UpdateDataList(this.searchMW_size, 'mw_size');
      }
      if (this.searchcw_size) {
        this.UpdateDataList(this.searchcw_size, 'cw_size');
      }

      if (this.searchCWSpacing) {
        this.UpdateDataList(this.searchCWSpacing, 'cw_spacing');
      }
      if (this.searchCO1) {
        this.UpdateDataList(this.searchCO1, 'co1');
      }

       if (this.searchUnitWt) {
        this.UpdateDataList(this.searchUnitWt, 'unit_weight');
      }
    }

    UpdateDataList(pValue: string, pColumnName: string) {
      if (
        pColumnName=='ss561_name'||
        pColumnName == 'mw_length' ||
        pColumnName == 'cw_length' ||
        pColumnName == 'mw_spacing'||
        pColumnName == 'mo1'||
        pColumnName == 'mw_size'||
        pColumnName == 'cw_size'||
        pColumnName == 'cw_spacing'||
        pColumnName == 'co1'||
        pColumnName == 'unit_weight'
      ) {
        this.StandardMeshOrderArray = this.StandardMeshOrderArray.filter((item) =>
          item[pColumnName].toString()?.toLowerCase().includes(pValue?.toLowerCase())
        );
      }
    }

  // CarbonRate: any = '';
  // async GetGreenType() {
  //   try {
  //     const data = await this.orderService
  //       .GetGreenType(this.CustomerCode, this.ProjectCode)
  //       .toPromise();
  //       this.CarbonRate = data;
  //     return data;
  //   } catch (error) {
  //     console.error(error);
  //     return 'error';
  //   }
  // }

  GreenSteelCarbonValue: any = 0;
  async GetProductGreenSteelValue() {
    let lObj = {
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,
      Product: 'MSH',
    };
    const data = await this.orderService
      .GetProductGreenSteelValue(lObj)
      .toPromise();
    if (data) {
      if (data?.LowCarbonRate) {
        this.GreenSteelCarbonValue = data.LowCarbonRate;

        // Update Default selection of Green type
        // if (Number(data.LowCarbonRate) == 0) {
        //   this.gGreenSteelSelection = false;
        // }
        // if (Number(data.LowCarbonRate) == 100) {
        //   this.gGreenSteelSelection = true;
        // }
      }
    }
  }

  FilterResponseForGreenSteel(pDataList: any) {
    if (pDataList) {
      let lCarbonRate = this.GreenSteelCarbonValue;
        if (Number(lCarbonRate) == 0) {
          // Only show NON Green Products
          pDataList = pDataList.filter(
            (x: any) => x.GreenType == 'N' || x.GreenType == null
          );
        }
        if (Number(lCarbonRate) == 100) {
          // Only show NON Green Products
          pDataList = pDataList.filter((x: any) => x.GreenType == 'Y');
        }
    }
    return pDataList;
  }


}
