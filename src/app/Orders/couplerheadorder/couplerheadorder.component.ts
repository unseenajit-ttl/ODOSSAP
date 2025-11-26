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
//import { StandardbarOrderArray } from 'src/app/Model/StandardbarOrderArray';
import { Result } from 'src/app/Model/Result';
import { DraftBatchChangeOrderArray } from 'src/app/Model/DraftBatchChangeOrderArray';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { DraftedOrderArray } from 'src/app/Model/DraftedOrderArray';
import { StandardbarOrderArray } from 'src/app/Model/StandardbarOrderArray';
import { StdProdDetailsModels } from 'src/app/Model/StdProdDetailsModels';
//import { PDFDocument, rgb } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
//import { GcPdfViewer } from '@grapecity/gcpdfviewer';
import { Location } from '@angular/common';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { LoginService } from 'src/app/services/login.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';


@Component({
  selector: 'app-couplerheadorder',
  templateUrl: './couplerheadorder.component.html',
  styleUrls: ['./couplerheadorder.component.css']
})
export class CouplerheadorderComponent {
  CustomerCode: any = this.dropdown.getCustomerCode();
  ProjectCode: any = this.dropdown.getProjectCode()[0];
  OrderStatus: any ;
  JobID: any = "";
  ordernumber: any ;

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
    gOrderCreation: any = "Yes";
  gOrderSubmission: any = "Yes";

  hideTable: boolean = true;
  projectList: any = [];
  loadingData = false;
  StandardbarOrderArray: StandardbarOrderArray[] = [];
  StandardbarOrderTempArray: StandardbarOrderArray[] = [];
  ProjectCategorey: StandardbarOrderArray[] = [];
  StandardbarOrderArray_backup: StandardbarOrderArray[] = [];
  DraftedOrderArray_Temp: StandardbarOrderArray[] = [];
  STDDataArray: StdProdDetailsModels[] = [];
  DraftBatchChangeOrderArray: any[] = [];
  Result: Result[] = []; //| undefined;
  resbody: any = { Message: '', response: '' };

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
  ScheduleProd:any;
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

  showMeshList1: boolean = true;

  gBBSChanged: number = 0;
  gJobAdviceChanged: number = 0;

  lReqDate1: any;
  //CustomerCode: string="";
  //ProjectCode: string="";
  //ProjectCode: any=[];
  prodTypeBody: any = { ProductType: '', lsubmission: '', leditable: '' };
  showbuttonsavesubmit: boolean = true;
  showaddorderbutton: boolean = true;
  showremovebutton: boolean = true;


  CouplerHeadOrderLoading: boolean = false;

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
  fourteenmbar: boolean = false;
  fivebar: boolean = false;
  fifteenmbar: boolean = false;
  valueOrderQty: any;
  valueunitWt: any;
  totalBundleWt: string | undefined;

  isSaveBBS: boolean = false;
  isSaveJobAdvice: boolean = false;
  SaveBBSResponse: any;
  SaveJobAdviceResponse: any;

  IsDownload: boolean = true;
  getfile: any;

  buttonStyle = {}; // Initial style object
  ProductDetailsEditable: boolean = true;

  tooltip:any="abc";
  atotooltip: any="abc";

  receivedData: any = ''
  RoutedFromProcess: boolean = false;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private location: Location,
    private createSharedService: CreateordersharedserviceService,
    private dropdown: CustomerProjectService,
    private processsharedserviceService: ProcessSharedServiceService,
    private lloginservice : LoginService,
    private reloadService:ReloadService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
        private commonService: CommonService
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

    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);

    // localStorage.removeItem('ProcessData');
    console.log('receivedData', this.receivedData)

    if (this.receivedData) {
      this.CustomerCode = this.receivedData.customer;
      this.ProjectCode = this.receivedData.project;
      this.ProductDetailsEditable = this.receivedData.ProductDetailsEdit;
      this.ordernumber = this.receivedData.ordernumber;
      this.RoutedFromProcess = true;
      this.OrderStatus=this.receivedData.orderstatus;
      this.StructureElement=this.receivedData.StructureElement;
      this.ScheduleProd=this.receivedData.ScheduledProd;
      this.ProductType=this.receivedData.ProductType;
      // this.tooltip="can't perform";

    }


if (this.createSharedService.selectedrecord) {
  this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.ordernumber = this.createSharedService.selectedrecord.OrderNumber;
      this.StructureElement=this.createSharedService.selectedrecord.StructureElement;
      this.ScheduleProd=this.createSharedService.selectedrecord.ScheduledProd;
      this.ProductType=this.createSharedService.selectedrecord.Product;
      // this.JobAdviceData = this.createSharedService.JobAdviceCAB;
      // this.lTransportMode = this.createSharedService.selectedrecord.Transport;
    }
    else{
      this.dropdown.setCustomerCode(this.receivedData.customer);
      let obj:any=[];
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

    if(this.OrderStatus=="Submitted"){
      this.tooltip="Cannot delete product from submitted order (不可从已提交的订单删除产品)";
      this.atotooltip="Cannot add product to submitted order (不可再加产品到已提交的订单)";

    }
    else
    {
      this.tooltip="Remove";
      this.atotooltip="Add To Order";

    }

    if(this.OrderStatus=="Created" || this.OrderStatus=="Created*" )
    {
      this.ProductDetailsEditable=true;
    }
    else
    {
      this.ProductDetailsEditable=false;
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

    this.submit(6, 'N-SPLICE-HEAD');
    this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    //this.getProjCategorey();
    this.getfile = "https://localhost:5009/ShowDir";
    this.reloadProjectDetails(this.CustomerCode, this.ProjectCode);
  }
  Loaddata() { }


  temp: boolean = false;

  filename: string = "";
  a: any;

  pdfSrc: any;

  validateOrderQty() {
    for (let i = 0; i < this.StandardbarOrderTempArray.length; i++) {
      if (this.StandardbarOrderTempArray[i].order_pcs == null || this.StandardbarOrderTempArray[i].order_pcs == undefined || this.StandardbarOrderTempArray[i].order_pcs == 0) {
        // this.toastr.error("Please enter Order Quantity");
        return false;
      }
    }
    return true;
  }

  validateOrderQtyEnd() {
    for (let i = 0; i < this.StandardbarOrderTempArray.length; i++) {
      if (this.StandardbarOrderTempArray[i].order_pcs == null || this.StandardbarOrderTempArray[i].order_pcs == undefined || this.StandardbarOrderTempArray[i].order_pcs == 0) {
        this.toastr.error("Please enter Order Quantity");
        return false;
      }
    }
    return true;
  }



  orderPrint() {
    if (!this.validateOrderQty()) {
      return false;
    }
    this.CouplerHeadOrderLoading = true;
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
      this.CouplerHeadOrderLoading = false;
      return false;
    }
    if (this.SaveJobAdvice(this.temp)) {
      alert(
        'Cannot print the order as failed to save order data  (因无法存储订单数据,打印订单失败)..'
      );
      this.CouplerHeadOrderLoading = false;
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
      this.CouplerHeadOrderLoading = false;
    });


    return;
  }
  //need to pass order creation variable. gOrderSubmission & gOrderCreation
  //take above variables from api

  SaveBBSData(SubmitInd: boolean) {
    if (!this.validateOrderQty()) {
      return false;
    }
    this.CouplerHeadOrderLoading = true;
    this.STDDataArray = [];
    debugger;
    let currentDate = new Date();
    if (this.OrderStatus != "New" && this.OrderStatus != "Reserved" && this.OrderStatus != "Sent" &&
      this.OrderStatus != "Created*" && this.OrderStatus != "Created" || this.gOrderCreation != "Yes") {
      return true;
    }
    if (this.gBBSChanged > 0) {

      for (let i = 0; i < this.StandardbarOrderTempArray.length; i++) {


        let obj2 = {
          customerCode: this.CustomerCode,
          projectCode: this.ProjectCode,
          jobID: this.JobID,
          prodCode: "",
          ssid: 0,
          prodType: "",
          prodDesc: "",
          diameter: 0,
          grade: "",
          unitWT: 0,
          order_pcs: 0,
          order_wt: 0,
          updateBy: "",
          updateDate: currentDate

        }

        this.STDDataArray.push(obj2);


      }

      let obj = {
        customerCode: this.CustomerCode,
        projectCode: this.ProjectCode,
        jobID: this.JobID,
        StdProdDetails: this.StandardbarOrderTempArray
      }

      console.log(obj.StdProdDetails);
      this.isSaveBBS = false;
      this.orderService.saveBBS_coupler(obj).subscribe({
        next: (response) => {
          this.resbody = response;

          if (this.resbody.response == "success") {
            this.isSaveBBS = true;
            this.SaveBBSResponse = this.resbody.Message;
            // this.toastr.success(this.resbody.Message);
            this.gBBSChanged = 0;

            return true;
          }
          else {
            this.toastr.error(this.resbody.Message);
            return false;
          }


          //allowGrade500M
        },
        error: (e) => { },
        complete: () => {
          this.CouplerHeadOrderLoading = false;
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

  SaveJobAdvice(SubmitInd: boolean) {
    if (!this.validateOrderQty()) {
      return false;
    }
    debugger;
    if (this.gJobAdviceChanged > 0) {

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
      this.isSaveJobAdvice = false;
      this.orderService.SaveJobAdvice_coupler(this.CustomerCode, this.ProjectCode, this.JobID, this.OrderStatus, this.valueOrderQty, this.totalwt).subscribe({
        next: (response) => {
          this.resbody = response;
          if (this.resbody.response == "success") {
            this.isSaveJobAdvice = true;
            // this.toastr.success(this.resbody.Message);
            this.gJobAdviceChanged = 0;
            return true;
          }
          else {
            this.toastr.error(this.resbody.Message);
            return false;
          }


          //allowGrade500M
        },
        error: (e) => { },
        complete: () => {
          this.CouplerHeadOrderLoading;
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


  download() {
    this.orderService.showdir(this.ProjectCode, this.JobID).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'STDMESH-' + this.ProjectCode + this.JobID + '.pdf';
      a.click();

      window.open(url, '_blank'); // Opens the PDF in a new tab

      this.CouplerHeadOrderLoading = false;
    });
  }


  JobAdviceChanged() {
    this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
  }

  calculateTotalBundleWtSum(): any {

    for (let j = 0; j < this.StandardbarOrderTempArray.length; j++) {
      this.valueOrderQty += this.StandardbarOrderTempArray[j].order_pcs;
    }
    for (let j = 0; j < this.StandardbarOrderTempArray.length; j++) {
      this.valueunitWt += this.StandardbarOrderTempArray[j].UnitWT;
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



    for (let j = 0; j < this.StandardbarOrderTempArray.length; j++) {

      if (this.StandardbarOrderTempArray[j].order_pcs != null || this.StandardbarOrderTempArray[j].order_pcs != undefined) {

        this.valueOrderQty = this.valueOrderQty + this.StandardbarOrderTempArray[j].order_pcs;

      }



    }

    // for (let j = 0; j < this.StandardbarOrderTempArray.length; j++) {

    //   if (this.StandardbarOrderTempArray[j].order_wt != null || this.StandardbarOrderTempArray[j].order_wt != undefined) {

    //     this.valueunitWt = this.valueunitWt + this.StandardbarOrderTempArray[j].order_wt;

    //   }

    // }

    this.valueunitWt = `${this.valueunitWt.toFixed(3)}`;
    console.log("decimal : " + this.valueunitWt);

    this.totalBundleWt = this.valueOrderQty;

    this.totalwt = this.valueunitWt;

    this.BBSChanged();

    this.JobAdviceChanged();



  }
  calculateResult(index: number) {
    const item = this.StandardbarOrderTempArray[index];
    if(item.order_pcs < 0){
      item.order_pcs = item.order_pcs * -1;
    }
    item.order_wt = item.UnitWT * item.order_pcs;

    debugger;
    this.calculateTotalBundleWt();
  }

  getBBS(id: number) {
    debugger;
    this.CouplerHeadOrderLoading = true;
    this.orderService.getBBS(this.CustomerCode, this.ProjectCode, id).subscribe({
      next: (response) => {

        this.StandardbarOrderTempArray = response;
        this.calculateTotalBundleWt();
        //allowGrade500M
      },
      error: (e) => { },
      complete: () => {
        this.CouplerHeadOrderLoading = false;
        // this.loading = false;
      },
    });

  }



  getProjCategorey() {
    this.showbutton3 = false;
    this.showbutton4 = false;
    this.showbutton5 = false;
    this.CustomerCode = '0001102303';
    this.ProjectCode = '0000113361';
    //alert('ok');
    this.orderService.getProjCategorey(this.CustomerCode, this.ProjectCode).subscribe({
      next: (response) => {
        this.ProjectCategorey = response;
        if (this.ProjectCategorey[0].MaxBarLength >= 14000) {
          this.showbutton3 = true;
        }
        if (this.ProjectCategorey[0].MaxBarLength >= 15000) {
          this.showbutton4 = true;
        }
        if (this.ProjectCategorey[0].allowGrade500M == true) {
          this.showbutton5 = true;
        }
        //allowGrade500M
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }


  transferItem(item: any = [], index: any) {
    let i = this.StandardbarOrderTempArray.findIndex(x => x === item)
    if (i == -1) {
      const isDuplicate = this.StandardbarOrderTempArray.some(existingItem => {
        // Replace 'anotherCondition' with the actual condition you want to check
        return existingItem.ProdCode === item.ProdCode;
      });
      if (isDuplicate == false) {
        this.StandardbarOrderTempArray.push(item);
        this.calculateTotalBundleWt();
        return;
      }
    }

    this.toastr.warning("Productcode already added.");



  }

  removeItem(item: any = [], i: any) {
    const index = this.StandardbarOrderTempArray.indexOf(item);
    if (index !== -1) {
      this.StandardbarOrderTempArray.splice(index, 1);
    }
    this.calculateTotalBundleWt();

  }


  submit(value: any, prodtype: any) {
    this.CouplerHeadOrderLoading = true;
    this.sixmbar = false;
    this.twelvembar = false;
    this.fourteenmbar = false;
    this.fivebar = false;
    this.fifteenmbar = false;
    console.log(value);
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

    this.orderService.getStandardProducts_coupler(prodtype).subscribe({
      next: (response) => {
        response = this.FilterResponseForGreenSteel(response);

        this.StandardbarOrderArray = response;
        console.log(this.StandardbarOrderArray);
        console.log(response);
        //allowGrade500M
      },
      error: (e) => { },
      complete: () => {
        this.CouplerHeadOrderLoading = false;
        // this.loading = false;
      },
    });

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
    this.StandardbarOrderArray = JSON.parse(
      JSON.stringify(this.StandardbarOrderArray_backup)
    );
  }
  dateChange(date: any) {
    console.log(date.value);
    if (date.value == '') {
      this.StandardbarOrderArray = JSON.parse(
        JSON.stringify(this.StandardbarOrderArray_backup)
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
    this.StandardbarOrderArray = [];
  }



  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }
  getJobId(orderNumber: string): any {
    let ProdType=this.ProductType;
    let StructurEelement=this.StructureElement;
    let ScheduleProd=this.ScheduleProd;
    this.orderService.getJobId(orderNumber,ProdType,StructurEelement,ScheduleProd).subscribe({
      next: (response: any) => {
        console.log('jobid', response);
        this.JobID = response.CoilProdJobID
        this.getBBS(this.JobID);
        this.GetProductType();
      },
      error: () => { },
      complete: () => { },
    });
  }
  success:boolean=false;
  SaveOrder() {
    this.success=this.validateOrderQtyEnd();
    if(this.success==true)
    {
    this.SaveBBSData(false);
    this.SaveJobAdvice(false);
    this.goBack();
    }
    else
    {
    //  this.toastr.error("please enter order quantity");
    }
  }

  goBack(): void {
    if (!this.RoutedFromProcess) {
      this.location.back();
    } else {
      this.router.navigate(['../order/createorder']);
    }
  }
  focusNextRowInput(index: number, inputField: HTMLInputElement): void {
    const nextRowIndex = index + 1;
    const nextInputField = document.querySelector(`input[tabindex="${nextRowIndex + 1}"]`) as HTMLInputElement;
    if (nextInputField) {
      nextInputField.focus();
    }
  }

    reloadProjectDetails(CustomerCode: any, ProjectCode: any) {
    this.orderService
      .reload_ProjectDetails_coupler(CustomerCode, ProjectCode)
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

  GetProductType() {
    //debugger;

    this.CouplerHeadOrderLoading = true;
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

        this.gOrderCreation=this.prodTypeBody[0].leditable;

        this.CouplerHeadOrderLoading = false;
        // this.loading = false;
        if (this.OrderStatus == 'Created' || this.OrderStatus == 'Created*'|| (this.OrderStatus == 'Sent' && this.Submission =='Yes')) {
          this.ProductDetailsEditable = true;
        } else {
          this.ProductDetailsEditable = false;
        }
      },
    });


  }


  SaveBBSDataforsavebutton(SubmitInd: boolean) {
    if (!this.validateOrderQtyforsavebutton()) {
      return false;
    }
    this.CouplerHeadOrderLoading = true;
    this.STDDataArray = [];
    debugger;
    let currentDate = new Date();
    if (this.OrderStatus != "New" && this.OrderStatus != "Reserved" && this.OrderStatus != "Sent" &&
      this.OrderStatus != "Created*" && this.OrderStatus != "Created" || this.gOrderCreation != "Yes") {
      return true;
    }
    if (this.gBBSChanged > 0) {

      for (let i = 0; i < this.StandardbarOrderTempArray.length; i++) {


        let obj2 = {
          customerCode: this.CustomerCode,
          projectCode: this.ProjectCode,
          jobID: this.JobID,
          prodCode: "",
          ssid: 0,
          prodType: "",
          prodDesc: "",
          diameter: 0,
          grade: "",
          unitWT: 0,
          order_pcs: 0,
          order_wt: 0,
          updateBy: "",
          updateDate: currentDate

        }

        this.STDDataArray.push(obj2);


      }

      let obj = {
        customerCode: this.CustomerCode,
        projectCode: this.ProjectCode,
        jobID: this.JobID,
        StdProdDetails: this.StandardbarOrderTempArray
      }

      console.log(obj.StdProdDetails);
      this.isSaveBBS = false;
      this.orderService.saveBBS_coupler(obj).subscribe({
        next: (response) => {
          this.resbody = response;

          if (this.resbody.response == "success") {
            this.isSaveBBS = true;
            this.SaveBBSResponse = this.resbody.Message;
            // this.toastr.success(this.resbody.Message);
            this.gBBSChanged = 0;

            return true;
          }
          else {
            this.toastr.error(this.resbody.Message);
            return false;
          }


          //allowGrade500M
        },
        error: (e) => { },
        complete: () => {
          this.CouplerHeadOrderLoading = false;
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


  validateOrderQtyforsavebutton() {
    for (let i = 0; i < this.StandardbarOrderTempArray.length; i++) {
      if (this.StandardbarOrderTempArray[i].order_pcs == null || this.StandardbarOrderTempArray[i].order_pcs == undefined || this.StandardbarOrderTempArray[i].order_pcs == 0) {
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
    setTimeout(() => {
      console.log('SetOrderSummaryData', tempOrderSummaryList);
      this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
        // You can set a specific message to display after the timeout
      }, 1000);
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    // this.router.navigate(['../order/createorder']);
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
      Product: 'COU',
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
