import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { StdProdDetailsModels } from 'src/app/Model/StdProdDetailsModels';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { LoginService } from 'src/app/services/login.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { PreCastDetails } from 'src/app/Model/StandardbarOrderArray';
import { Result } from 'src/app/Model/Result';
import { Location } from '@angular/common';
import { AddToCart } from 'src/app/Model/addToCart';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'
import saveAs from 'file-saver';
import { PdfGeneratorServiceService } from 'src/app/SharedComponent/pdf-generator-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-precast',
  templateUrl: './precast.component.html',
  styleUrls: ['./precast.component.css']
})
export class PrecastComponent {

  receivedData: any = '';
  fromWbsPosting: any = '';

  // @HostListener('window:message', ['$event'])
  // onMessage(event: MessageEvent) {
  //   console.log('event',event)
  //   if (event.source === window.opener) {
  //     this.receivedData = event.data;
  //   }
  // }

  // CustomerCode: any = this.dropdown.getCustomerCode();
  // ProjectCode: any = this.dropdown.getProjectCode()[0];
  OrderStatus: any;
  JobID: any = '';
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
  fourteenmbar: boolean = false;
  fivebar: boolean = false;
  fifteenmbar: boolean = false;
  valueOrderQty: number = 0;
  valueunitWt: any;
  totalBundleWt: string | undefined;

  IsDownload: boolean = true;
  getfile: any;

  temp: boolean = false;
  filename: string = '';
  a: any;
  pdfSrc: any;

  buttonStyle = {}; // Initial style object
  isSaveBBS: boolean = false;
  isSaveJobAdvice: boolean = false;
  SaveBBSResponse: any;
  SaveJobAdviceResponse: any;

  StandardBarProductOrderLoading: boolean = false;
  showBottomTable: boolean = false;

  ProductDetailsEditable: boolean = true;
  RoutedFromProcess: boolean = false;

  prodTypeBody: any = { ProductType: '', lsubmission: '', leditable: '' };
  showbuttonsavesubmit: boolean = true;
  showaddorderbutton: boolean = true;
  showremovebutton: boolean = true;
  gOrderCreation: any = 'Yes';
  tooltip: any = 'abc';
  atotooltip: any = 'abc';

  // For Column filter search in the Main Table
  searchProductCode: string = '';
  searchProductDesc: string = '';
  searchDiameter: string = '';
  searchGrade: string = '';
  searchUnitWeight: string = '';


  startTime: any;// = '14/03/2022, 17:12:19';
  stopTime: any
  inHhMmSsFormat: any;
  interval: any;
  display: any = "00:00";
  PrecastDataInsert!: FormGroup;

  PrecastArray: PreCastDetails[] = [];

  // PrecastArray:PreCastDetails[];=[
  //   {
  //     "Precast_ID": "PC001",
  //     "CustomerCode": "CUST001",
  //     "ProjectCode": "PROJ001",
  //     "ComponentMarking": "CMK001",
  //     "Block": "A",
  //     "Level": 1,
  //     "Qty": 10,
  //     "Remark": "No issues",
  //     "PageNo": 12,
  //     "StructureElement": "Wall",
  //     "CreateDate": "2024-11-25",
  //     "CreatedBy": "user01",
  //     "ModifiedDate": "2024-11-26",
  //     "ModifiedBy": "user02"
  //   },
  //   {
  //     "Precast_ID": "PC002",
  //     "CustomerCode": "CUST002",
  //     "ProjectCode": "PROJ002",
  //     "ComponentMarking": "CMK002",
  //     "Block": "B",
  //     "Level": 2,
  //     "Qty": 20,
  //     "Remark": "Minor cracks",
  //     "PageNo": 15,
  //     "StructureElement": "Column",
  //     "CreateDate": "2024-11-24",
  //     "CreatedBy": "user03",
  //     "ModifiedDate": "2024-11-25",
  //     "ModifiedBy": "user04"
  //   },
  //   {
  //     "Precast_ID": "PC003",
  //     "CustomerCode": "CUST003",
  //     "ProjectCode": "PROJ003",
  //     "ComponentMarking": "CMK003",
  //     "Block": "C",
  //     "Level": 3,
  //     "Qty": 15,
  //     "Remark": "Approved",
  //     "PageNo": 18,
  //     "StructureElement": "Beam",
  //     "CreateDate": "2024-11-23",
  //     "CreatedBy": "user05",
  //     "ModifiedDate": "2024-11-24",
  //     "ModifiedBy": "user06"
  //   },
  //   {
  //     "Precast_ID": "PC004",
  //     "CustomerCode": "CUST004",
  //     "ProjectCode": "PROJ004",
  //     "ComponentMarking": "CMK004",
  //     "Block": "D",
  //     "Level": 4,
  //     "Qty": 25,
  //     "Remark": "Pending approval",
  //     "PageNo": 20,
  //     "StructureElement": "Slab",
  //     "CreateDate": "2024-11-22",
  //     "CreatedBy": "user07",
  //     "ModifiedDate": "2024-11-23",
  //     "ModifiedBy": "user08"
  //   },
  //   {
  //     "Precast_ID": "PC005",
  //     "CustomerCode": "CUST005",
  //     "ProjectCode": "PROJ005",
  //     "ComponentMarking": "CMK005",
  //     "Block": "E",
  //     "Level": 5,
  //     "Qty": 30,
  //     "Remark": "Needs rework",
  //     "PageNo": 22,
  //     "StructureElement": "Staircase",
  //     "CreateDate": "2024-11-21",
  //     "CreatedBy": "user09",
  //     "ModifiedDate": "2024-11-22",
  //     "ModifiedBy": "user10"
  //   }
  // ]

  backup_PrecastArray: any[] = [];
  columnName: any[] = [
    "Sr.No.",
    "Component Marking*",
    "Qty*",
    "Block",
    "Level",
    "Remark",
    "Page Number",
    "Action",
  ]


  filterPro = {
    marking: '',
    block: '',
    level: '',
    qty: '',
    remark: '',
    pageNo: ''
  }
  // orderService!: OrderService;
  ProjectCode: any;
  CustomerCode: string = "";
  newPrecastData = {
    Precast_ID: '',
    CustomerCode: '',
    ProjectCode: '',
    JobID: 0,
    ComponentMarking: '',
    Block: '',
    Level: 0,
    Qty: '0',
    Remark: '',
    PageNo: '0',
    StructureElement: '',
    CreateDate: '',
    CreatedBy: '',
    ModifiedDate: '',
    ModifiedBy: '',
    OrderNumber: 0
  };



  constructor(private location: Location, private datePipe: DatePipe, private orderService: OrderService, private CustomerPRoj: CustomerProjectService, private createSharedService: CreateordersharedserviceService,
    private dropdown: CustomerProjectService,
    private processsharedserviceService: ProcessSharedServiceService,
    private lloginservice: LoginService,
    private reloadService: ReloadService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService, private changeDetectorRef: ChangeDetectorRef, private toastr: ToastrService, private router: Router, private pdfGenerator: PdfGeneratorServiceService,

    ) {
    this.PrecastDataInsert = new FormGroup({
      marking: new FormControl('', Validators.required),
      block: new FormControl(''),
      level: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      remark: new FormControl('', Validators.required),
      strElement: new FormControl('',),
      pageNo: new FormControl('', Validators.required),

      footermarking: new FormControl('', Validators.required),
      footerblock: new FormControl(''),
      footerlevel: new FormControl('', Validators.required),
      footerqty: new FormControl('', [Validators.required, Validators.min(1)]),
      footerremark: new FormControl(''),
      footerstrElement: new FormControl('',),
      footerpageNo: new FormControl('', Validators.required)
    });
  }

  /**
   *
   */
  Visible: boolean = true;
  PostHID: any;
  CustomerName: any;
  ProjectName: any;
   ngOnInit() {
    this.CustomerCode = this.CustomerPRoj.getCustomerCode();
    this.ProjectCode = this.CustomerPRoj.getProjectCode();
    // this.CustomerName = this.CustomerPRoj.getCustomerName();
    // this.ProjectName = this.CustomerPRoj.getProjectName();

    // this.CustomerCode = '0001101170';
    // this.ProjectCode = '0000113012';
    // this.ordernumber='325077';
    // this.getJobId(this.ordernumber);

    this.commonService.changeTitle('StandardBar | ODOS');
    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log('receivedData', this.receivedData);

    this.fromWbsPosting = localStorage.getItem('wbspostingobject');
    this.fromWbsPosting = JSON.parse(this.fromWbsPosting)
    console.log("this.fromWbsPosting", this.fromWbsPosting);
    // localStorage.removeItem('ProcessData');

    if (this.fromWbsPosting) {
      this.CustomerCode = this.fromWbsPosting.CustomerCode;
      this.ProjectCode = this.fromWbsPosting.ProjectCode;
      this.JobID = this.fromWbsPosting.PostHeaderID;
      // if(this.fromWbsPosting.statusCode == "P"){
      this.Visible = false; //temp commented
      this.columnName.pop();
      // }
      // else
      // {
      //   this.Visible=true;

      // }
      this.getPrecastDetails(this.fromWbsPosting.PostHeaderID);
      // localStorage.removeItem('wbspostingobject');

      this.ValidateName();
      return;
    }

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

    console.log(
      'data from Process Order-> editable',
      this.processsharedserviceService.getProductDetailsEditable()
    );

    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.ordernumber = this.createSharedService.selectedrecord.OrderNumber;
      this.StructureElement = this.createSharedService.selectedrecord.StructureElement;
      this.ScheduleProd = this.createSharedService.selectedrecord.ScheduledProd;
      this.ProductType = this.createSharedService.selectedrecord.Product;
      this.WBS1 = this.createSharedService.selectedrecord.WBS1;
      this.WBS2 = this.createSharedService.selectedrecord.WBS2;
      // this.JobAdviceData = this.createSharedService.JobAdviceCAB;
      // this.lTransportMode = this.createSharedService.selectedrecord.Transport;
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
      this.SetCreateDatainLocal(this.ordernumber);
    }

    if (this.OrderStatus == 'Submitted') {
      this.tooltip =
        'Cannot delete product from submitted order (不可从已提交的订单删除产品)';
      this.atotooltip =
        'Cannot add product to submitted order (不可再加产品到已提交的订单)';
    } else {
      this.tooltip = 'Remove';
      this.atotooltip = 'Add To Order';
    }

    if (this.OrderStatus == 'Created' || this.OrderStatus == 'Created*') {
      this.ProductDetailsEditable = true;
    } else {
      this.ProductDetailsEditable = false;
    }

    console.log(
      'this.createSharedServicenow',
      this.createSharedService.selectedrecord
    );
    // Set OderSummaryList Data from local Storage and remove item from local Storage.
    let lData: any = localStorage.getItem('ProcessOrderSummaryData');
    lData = JSON.parse(lData);
    if (lData) {
      this.RoutedFromProcess = true;
    }

    console.log("lData", lData);

    this.processsharedserviceService.setOrderSummaryData(lData);
    // localStorage.removeItem('ProcessOrderSummaryData');

    //WHEN ROUTED FROM PROCSS ORDER
    // if (this.processsharedserviceService.getProductDetailsEditable() == false) {
    //   // set customer and project from process order
    //   this.CustomerCode = this.processsharedserviceService.ProcessCustomer
    //   this.ProjectCode = this.processsharedserviceService.ProcessProject
    //   this.ProductDetailsEditable = this.processsharedserviceService.getProductDetailsEditable()
    // }

    this.getJobId(this.ordernumber);
    debugger;

    // this.submit(12, 'BAR12');

    console.log('selectedOrder', this.createSharedService.selectedOrderNumber);
    console.log(
      'saveorederdata',
      this.createSharedService.saveOrderDetailsData
    );

    this.ValidateName();
    this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    // this.getProjCategorey();
    this.getfile = 'https://localhost:5009/ShowDir';



    // this.Get_Precast_data();

  }



  newJobID: number = 0;


  ValidateName() {
    console.log("this.CustomerName-now", this.CustomerName);
    if (this.CustomerName == undefined || this.CustomerName == "") {
      this.GetCustomerName();
    }
    if (this.ProjectName == undefined || this.ProjectName == "") {
      this.GetProjectName();
    }
  }

  async GetCustomerName() {
    console.log("now-CustomerName:", this.CustomerCode)
    this.commonService.GetCustomerName(this.CustomerCode).subscribe({
      next: (response: any) => {
        console.log('CustomerName', response);
        this.CustomerName = response.vchCustomername;
      },
      error: () => { },
      complete: () => {

      },
    })
  }

  async GetProjectName() {
    console.log("now-this.ProjectCode", this.ProjectCode);
    this.commonService.GetProjectName(this.ProjectCode).subscribe({
      next: (response: any) => {
        console.log('ProjectName', response);
        this.ProjectName = response.proj_desc1;
      },
      error: () => { },
      complete: () => {

      },
    })
  }



  async getNewJobID(orderNumber: string) {
    let ProdType = this.ProductType;
    let StructurEelement = this.StructureElement;
    let ScheduleProd = this.ScheduleProd;
    // let ProdType = 'PRECAST';
    // let StructurEelement = 'NONWBS';
    // let ScheduleProd = 'N';
    this.orderService
      .getJobId(orderNumber, ProdType, StructurEelement, ScheduleProd)
      .subscribe({
        next: (response: any) => {
          console.log('jobid', response);
          debugger;
          // this.createSharedService.selectedJobIds.StdBarsJobID = response
          this.JobID = response.PrecastJobID;;
          if (this.JobID == null) {
            this.JobID = 0;
          }
          // this.getPrecastDetails(this.JobID);
          // this.GetProductType();
          // return this.JobID;

        },
        error: () => { },
        complete: () => {
          debugger;
          this.newJobID = parseInt(this.JobID);
        },
      });
  }


  async AddToCart_async(item: AddToCart) {
    try {
      const data = await this.orderService.AddToCart(item).toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }

  insertPREcast_old() //by vishal
  {
    debugger;

      const projectDetails: any = {
        Precast_ID: this.PrecastDataInsert.value.Precast_ID ?? 0,
        CustomerCode: this.CustomerCode,
        ProjectCode: this.ProjectCode,
        ComponentMarking: this.PrecastDataInsert.value.marking,
        Block: this.PrecastDataInsert.value.block,
        Level: this.PrecastDataInsert.value.level,
        Qty: parseInt(this.PrecastDataInsert.value.qty),
        Remark: this.PrecastDataInsert.value.remark,
        PageNo: parseInt(this.PrecastDataInsert.value.pageNo),
        StructureElement: '',
        CreateDate: new Date(),  // current date
        CreatedBy: "",
        ModifiedDate: new Date(),
        ModifiedBy: '',
        JobID: parseInt(this.JobID),
        OrderNumber: 0
      };

      this.PrecastArray.push(projectDetails);

      // this.gotoOrderSummary();
      this.SavePrecasInfo(true); //commented temp
      this.AddReset();
      // this.orderService.Insert_PRecastData(projectDetails).subscribe({
      //   next:(response)=>{
      //    if(response)
      //    {

      //    }
      //   },
      //   error:(error)=>{

      //   },
      //   complete:()=>{

      //   }
      //  }

      //  )



  }

  // filterData()
  // {
  //   this.PrecastArray = JSON.parse(JSON.stringify(this.backup_PrecastArray));
  //   if (this.filterPro.marking != undefined) {
  //     this.PrecastArray = this.PrecastArray.filter(item =>
  //       this.checkFilterData(this.filterPro.marking, item.VCHGROUPMARKINGNAME)
  //     );
  //   }
  //   if (this.filterPro.block != undefined) {
  //     this.PrecastArray = this.PrecastArray.filter(item =>
  //       this.checkFilterData(this.filterPro.block, item.VCHGROUPMARKINGNAME)
  //     );
  //   }if (this.filterPro.level != undefined) {
  //     this.PrecastArray = this.PrecastArray.filter(item =>
  //       this.checkFilterData(this.filterPro.level, item.VCHGROUPMARKINGNAME)
  //     );
  //   }
  //   if (this.filterPro.remark != undefined) {
  //     this.PrecastArray = this.PrecastArray.filter(item =>
  //       this.checkFilterData(this.filterPro.remark, item.VCHGROUPMARKINGNAME)
  //     );
  //   }
  // }
  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue.toString().includes(',')) {
      let value = ctlValue.toString().toLowerCase().trim().split(',');
      return value.some((char: string) => item.toString().toLowerCase().includes(char))
    } else {
      return item
        .toString()
        .toLowerCase()
        .includes(
          ctlValue
            .toString()
            .toLowerCase()
            .trim()
        )
    }
  }
  Get_Precast_data() {
    this.orderService.Get_PrecastData(this.CustomerCode, this.ProjectCode).subscribe({
      next: (response) => {
        this.PrecastArray = response;
      },
      error: (error) => {

      },
      complete: () => {

      }
    }

    )
  }
  async Delete_Precast(id: any) {
    await this.delete(id);
    // this.getPrecastDetails(this.JobID);
  }

  delete(id: any) {

    this.orderService.Delete_Precast(id).subscribe({
      next: (response) => {

        this.toastr.success("Deleted Successfully...");
        this.getPrecastDetails(this.JobID);
      },
      error: (error: any) => {
        console.log("error", error);
        alert(error.message);
      },
      complete: () => {
        this.updateflag();        //  this.getPrecastDetails(this.JobID);
      }
    }

    )
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
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    // this.router.navigate(['../order/createorder']);
  }

  getJobId(orderNumber: string): any {
    let ProdType = this.ProductType;
    let StructurEelement = this.StructureElement;
    let ScheduleProd = this.ScheduleProd;
    // let ProdType = 'PRECAST';
    // let StructurEelement = 'NONWBS';
    // let ScheduleProd = 'N';
    this.orderService
      .getJobId(orderNumber, ProdType, StructurEelement, ScheduleProd)
      .subscribe({
        next: (response: any) => {
          console.log('jobid', response);
          debugger;
          // this.createSharedService.selectedJobIds.StdBarsJobID = response
          this.JobID = response.PostHeaderID;;
          if (this.JobID == null) {
            this.JobID = 0;
          }
          this.getPrecastDetails(this.JobID);
          // this.GetProductType();
        },
        error: () => { },
        complete: () => {
          debugger;
        },
      });
  }

  async calculateTotalQty() {
    for (let i = 0; i < this.PrecastArray.length; i++) {
      this.valueOrderQty += parseInt(this.PrecastArray[i].Qty);
    }
    this.JobAdviceChanged();
    console.log("valueOrderQty", this.valueOrderQty);
  }
  JobAdviceChanged() {
    this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
  }

  enableEditIndex: any;

  //START-Added by vidhya
  STDDataArray: StdProdDetailsModels[] = [];
  //  enableEditIndex: any;

  insertPREcast() {
    debugger;

    if (this.CustomerCode == '' || this.ProjectCode == '') {
      this.toastr.warning("Please select Customer and Project!");
      return;
    }

    const precastData = this.newPrecastData;  // Use the correct entry from the array
    console.log("New precast object", precastData)
    if (
      !precastData.ComponentMarking ||
      // !precastData.Block ||
      // !precastData.Level ||
      !precastData.Qty
      // !precastData.PageNo
    ) {
      this.toastr.error("Fill All the Required Fields!");
      return;
    } else if (precastData.Qty <= '0') {
      this.toastr.error("Qty must be greater than 0!");
      return;
    }
    else {

      const projectDetails: any = {
        Precast_ID: this.PrecastDataInsert.value.Precast_ID ?? 0,
        CustomerCode: this.CustomerCode,
        ProjectCode: this.ProjectCode,
        ComponentMarking: precastData.ComponentMarking,
        Block: precastData.Block.toString(),
        Level: precastData.Level.toString(),
        Qty: parseInt(precastData.Qty),
        Remark: precastData.Remark,
        PageNo: parseInt(precastData.PageNo),
        StructureElement: '',
        CreateDate: new Date(),
        CreatedBy: "",
        ModifiedDate: new Date(),
        ModifiedBy: '',
        JobID: parseInt(this.JobID),
        OrderNumber: 0,
      };

      // this.PrecastArray.push(projectDetails);
      this.SavePrecasInfo(projectDetails);  // Temporary commented code
      this.AddReset();  // Reset form data

    }


  }


  EditData(item: any, index: any) {
    debugger;
    this.enableEditIndex = index;

  }
  EditCancle() {
    debugger;
    this.enableEditIndex = -1;
    //this.PrecastArray = JSON.parse(JSON.stringify(this.backup_PrecastArray));
  }

  AddReset() {

    this.newPrecastData = {
      Precast_ID: '',
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,
      JobID: this.JobID,
      ComponentMarking: '',
      Block: '',
      Level: 0,
      Qty: '0',
      Remark: '',
      PageNo: '0',
      StructureElement: '',
      CreateDate: '',
      CreatedBy: '',
      ModifiedDate: '',
      ModifiedBy: '',
      OrderNumber: 0
    };


  }

  UpdatePREcast(item: any) {
    debugger;
    if (this.CustomerCode && this.ProjectCode) {

      if (
        !item.ComponentMarking ||
        !item.Qty
      ) {
        this.toastr.error("Fill All the Required Fields!");
        return;
      } else if (item.Qty <= '0') {
        this.toastr.error("Qty must be greater than 0!");
        return;
      }
      else {
        const projectDetails: any = {
          Precast_ID: item.Precast_ID ?? 0,
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          ComponentMarking: item.ComponentMarking,
          Block: item.Block.toString(),
          Level: item.Level.toString(),
          Qty: parseInt(item.Qty),
          Remark: item.Remark,
          PageNo: parseInt(item.PageNo),
          StructureElement: '',
          CreateDate: new Date(),  // current date
          CreatedBy: "",
          ModifiedDate: new Date(),
          ModifiedBy: '',
          JobID: parseInt(this.JobID),
          OrderNumber: 0
        };

        this.SavePrecasInfo(projectDetails); //commented temp
        this.enableEditIndex = -1;

      }
    }
    else {
      this.toastr.warning("Please select Customer and Project!");
      return;

    }

  }

  selectedFileName: string | null = null;
  isFileSelectorOpen = true;
  downloadExcelTemplate() {
    // Define the header row
    const headerRow = [

      'Component Marking',
      'Block',
      'Level',
      'Qty',
      'Remark',
      'Page Number',
    ];
    // Create an empty template row with placeholders
    const templateRow = headerRow.map(() => "");

    // Combine the header and template row
    const data = [headerRow, templateRow];

    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Precast Data Template");

    // Generate and save the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "PrecastTemplate.xlsx");
  }


  data: any = [];
  columns: { [key: string]: any[] } = {};  // To store columns as arrays

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isFileSelectorOpen = true;
    // Ensure the user uploaded a file
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const input = evt.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      const reader: FileReader = new FileReader();

      // Read the file as binary string
      reader.onload = (e: any) => {
        const binaryString: string = e.target.result;

        // Parse the workbook
        const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

        // Get the first sheet
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON format with the first row as headers
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("Raw JSON Data:", jsonData);

        // Transform rows into columns, using the first row as headers

        this.columns = this.transformToColumns(jsonData);

        console.log("Columns for excel===>", this.columns);  // Now the columns object has column headers as keys and data as arrays

      };

      reader.readAsBinaryString(target.files[0]);
    } else {
      this.selectedFileName = null; // No file selected
    }
  }

  transformToColumns(rows: any[][]): { [key: string]: any[] } {
    const columns: { [key: string]: any[] } = {};

    // Ensure there are rows and the first row has headers
    if (rows.length === 0) return columns;

    const headers = rows[0]; // First row as column headers

    // Initialize columns based on headers, replacing spaces with underscores
    headers.forEach((header: string, index: number) => {
      const sanitizedHeader = header.replace(/\s+/g, '_');  // Replace spaces with underscores
      columns[sanitizedHeader] = [];
    });

    // Fill the columns with data (starting from the second row)
    for (let i = 1; i < rows.length; i++) {
      headers.forEach((header: string, index: number) => {
        const sanitizedHeader = header.replace(/\s+/g, '_');
        columns[sanitizedHeader].push(rows[i][index]);
      });
    }

    return columns;
  }

  openFileSelector() {
    this.isFileSelectorOpen = false;
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.click();
  }

  clearFile(): void {
    this.selectedFileName = null;
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.value = ''; // Reset the file input value
  }


  submitThroughExcel() {
    debugger
    if (this.CustomerCode != '' && this.ProjectCode != '') {

      let ComponentMarkingArray = this.columns.Component_Marking;
      console.log('Array==>', ComponentMarkingArray)
      let BlockArray = this.columns.Block;
      let LevelArray = this.columns.Level;
      let QtyArray = this.columns.Qty;
      let RemarksArray = this.columns.Remark;
      let PageNoArray = this.columns.Page_Number;

      for (let i = 0; i < ComponentMarkingArray.length; i++) {
        if (QtyArray[i] <= 0 || QtyArray[i] == null || isNaN(QtyArray[i])) {
          this.toastr.warning(`Quantity at row ${i + 1} should be greater than 0`);
          return;
        }

        const obj: any = {
          Precast_ID: 0,
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          ComponentMarking: ComponentMarkingArray[i],
          Block: BlockArray[i].toString(),
          Level: LevelArray[i].toString(),
          Qty: QtyArray[i],
          Remark: RemarksArray[i],
          PageNo: PageNoArray[i],
          StructureElement: '',
          CreateDate: new Date(),  // current date
          CreatedBy: "",
          ModifiedDate: new Date(),
          ModifiedBy: '',
          JobID: parseInt(this.JobID),
          OrderNumber: 0
        };
        console.log("Object", obj)

        this.PrecastArray.push(obj);
        //this.SavePrecasInfo(true)
        this.isSaveBBS = false;

        this.STDDataArray = [];
        debugger;
        let currentDate = new Date();
        let Saveobj = {
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          JobID: parseInt(this.JobID),
          StdPrecastDetail: this.PrecastArray,
        };

        console.log("obj", obj);
        this.orderService.savePrecastDetails(Saveobj).subscribe({
          next: (response) => {
            this.resbody = response;
            console.log(this.resbody);
            if (this.resbody.response == 'success') {
              this.SaveBBSResponse = this.resbody.Message;
              this.isSaveBBS = true;
              this.gBBSChanged = 0;
              this.toastr.success(`Data Saved Successfully for record ${i + 1}!`)
              return true;
            } else {
              this.toastr.error(this.resbody.Message);
              return false;
            }

            //allowGrade500M
          },
          error: (e) => { },
          complete: () => {
            this.clearFile();
            if (this.isSaveJobAdvice && this.isSaveBBS) {
              this.toastr.success(this.resbody.Message);
              this.isSaveJobAdvice = false;
              this.isSaveBBS = false;


            }
            if(i==0)
            {
              this.updateflag()
            }
            // this.loading = false;

          },
        });


      }
    }
    else {
      this.toastr.warning(`Please select Customer and Project`)
    }

  }

  generatePDF() {
    const doc = new jsPDF('landscape'); // Set landscape orientation

    // Add a title to the PDF
    doc.setFontSize(16);
    doc.text('Precast Data Entry Report', 14, 15);

    const headers = [
      'S/N',
      'Component Marking',
      'Block',
      'Level',
      'Qty',
      'Remark',
      'Page Number',
    ];

    // Define the rows dynamically from PileDataArray
    const rows = this.PrecastArray.map((item: any, index: number) => [
      index + 1, // Serial Number
      item.ComponentMarking || '', // Pile dia (mm)
      item.Block || '', // No of Main Bar
      item.Level || '', // Cage Length (m)
      item.Qty || '', // L1 (min.100)
      item.Remark || '', // Links
      item.PageNo || '',

    ]);

    // Define column widths to ensure headers fit in one line
    const columnStyles = {
      0: { cellWidth: 20, halign: 'center' }, // Serial Number
      1: { cellWidth: 30, halign: 'center' }, // Pile Dia
      2: { cellWidth: 35, halign: 'center' }, // No of Main Bar
      3: { cellWidth: 40, halign: 'center' }, // Cage Length
      4: { cellWidth: 30, halign: 'center' }, // L1
      5: { cellWidth: 30, halign: 'center' }, // Links
      6: { cellWidth: 30, halign: 'center' }, // Dia

    };

    // Add the table to the PDF
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 25, // Start position below the title
      theme: 'grid',
      headStyles: {
        //fillColor: [221, 221, 221], // Light gray background for headers
        fontSize: 10, // Font size for headers
        halign: 'center', // Center align header text
      },
      bodyStyles: {
        fontSize: 9, // Font size for body cells
      },
      columnStyles: {

        styles: {
          overflow: 'linebreak', // Allow content to break into new lines if necessary
          cellPadding: 3, // Add padding inside cells
        },
      } // Apply column styles

    });

    // Save the PDF
    doc.save('PrecastDataReport.pdf');
  }
  //END -Added by Vidhya


  async getPrecastDetails(id: number) {
    debugger;

    await this.orderService
      .getPrecastDetails(this.CustomerCode, this.ProjectCode, id)
      .subscribe({
        next: (response) => {
          this.PrecastArray = response ? response : [];
          // this.calculateTotalBundleWt();
          //allowGrade500M
        },
        error: (e) => { },
        complete: () => {
          this.StandardBarProductOrderLoading = false;
          this.newPrecastData.Block = this.WBS1;
          this.newPrecastData.Level= this.WBS2;
          var length = this.PrecastArray.length;
          if(length>0)
          {
            this.newPrecastData.Qty = this.PrecastArray[length - 1].Qty;
            this.newPrecastData.Block = this.PrecastArray[length - 1].Block;
            this.newPrecastData.Level = this.PrecastArray[length - 1].Level;
            // this.newPrecastData.Remark = this.PrecastArray[length - 1].Remark;
            // this.newPrecastData.ComponentMarking = this.PrecastArray[length - 1].ComponentMarking;
            // this.newPrecastData.PageNo = (this.PrecastArray[length - 1].PageNo + 1).toString();
          }
          // this.loading = false;
        },
      });
  }


  // STDDataArray: StdProdDetailsModels[] = [];

  // SaveBBSDataforSaveButton(SubmitInd: boolean) {
  //   // if (!this.validateOrderQtyforsavebutton()) {
  //   //   return false;
  //   // }

  //   this.isSaveBBS = false;

  //   this.STDDataArray = [];
  //   debugger;
  //   let currentDate = new Date();
  //   if (
  //     (this.OrderStatus != 'New' &&
  //       this.OrderStatus != 'Reserved' &&
  //       this.OrderStatus != 'Sent' &&
  //       this.OrderStatus != 'Created*' &&
  //       this.OrderStatus != 'Created') ||
  //     this.gOrderCreation != 'Yes'
  //   ) {
  //     return true;
  //   }
  //   if (this.gBBSChanged > 0) {
  //     for (let i = 0; i < this.PrecastArray.length; i++) {
  //       let obj2 = {
  //         customerCode: this.CustomerCode,
  //         projectCode: this.ProjectCode,
  //         jobID: this.JobID,
  //         prodCode: '',
  //         ssid: 0,
  //         prodType: '',
  //         prodDesc: '',
  //         diameter: 0,
  //         grade: '',
  //         unitWT: this.StandardbarOrderTempArray[i].UnitWT,
  //         order_pcs: this.StandardbarOrderTempArray[i].order_pcs,
  //         order_wt: this.StandardbarOrderTempArray[i].order_wt,
  //         updateBy: '',
  //         updateDate: currentDate,
  //       };

  //       this.STDDataArray.push(obj2);
  //     }

  //     let obj = {
  //       customerCode: this.CustomerCode,
  //       projectCode: this.ProjectCode,
  //       jobID: this.JobID,
  //       StdProdDetails: this.StandardbarOrderTempArray,
  //     };

  //     console.log(obj.StdProdDetails);

  //     this.orderService.SaveBBS(obj).subscribe({
  //       next: (response) => {
  //         this.resbody = response;

  //         if (this.resbody.response == 'success') {
  //           this.SaveBBSResponse = this.resbody.Message;
  //           this.isSaveBBS = true;
  //           this.gBBSChanged = 0;

  //           return true;
  //         } else {
  //           this.toastr.error(this.resbody.Message);
  //           return false;
  //         }

  //         //allowGrade500M
  //       },
  //       error: (e) => {},
  //       complete: () => {
  //         if (this.isSaveJobAdvice && this.isSaveBBS) {
  //           this.toastr.success(this.resbody.Message);
  //           this.isSaveJobAdvice = false;
  //           this.isSaveBBS = false;
  //         }
  //         // this.loading = false;
  //       },
  //     });
  //   }
  //   return;
  // }

  totalwt: any;
  async SaveJobAdvice(SubmitInd: boolean) {

    this.isSaveJobAdvice = true;// ADDED TEMP
    // debugger;
    // // if (!this.validateOrderQty()) {
    // //   return false;
    // // }
    // // console.log("we are in savejobadvice");
    // // await this.calculateTotalQty();
    // // if (this.gJobAdviceChanged > 0) {
    // //   if (this.CustomerCode == '') {
    // //     alert('Please assign customer to the user before order creation.');
    // //     return false;
    // //   }

    // //   if (this.ProjectCode == '') {
    // //     alert('Please assign Project to the user before order creation.');
    // //     return false;
    // //   }

    // //   // if (
    // //   //   (this.OrderStatus != 'New' &&
    // //   //     this.OrderStatus != 'Reserved' &&
    // //   //     this.OrderStatus != 'Sent' &&
    // //   //     this.OrderStatus != 'Created*' &&
    // //   //     this.OrderStatus != 'Created') ||
    // //   //   this.gOrderCreation != 'Yes'
    // //   // ) {
    // //   //   return true;
    // //   // }

    // //   debugger;

    // //   this.isSaveJobAdvice = false;


    // //   console.log("before api to savejobadive");
    // //   console.log("this.CustomerCode",this.CustomerCode);
    // //   console.log("this.ProjectCode",this.ProjectCode);
    // //   console.log("this.JobID",this.JobID);
    // //   console.log("this.OrderStatus",this.OrderStatus);
    // //   console.log("this.valueOrderQty",this.valueOrderQty);
    // //   console.log("this.totalwt",this.totalwt);

    // //   this.orderService.SavePrecastJobAdvice(
    // //       this.CustomerCode,
    // //       this.ProjectCode,
    // //       this.JobID,
    // //       this.OrderStatus,
    // //       this.valueOrderQty,
    // //       this.totalwt
    // //     )
    // //     .subscribe({
    // //       next: (response) => {
    // //         this.resbody = response;
    // //         console.log("we are successfull");
    // //         if (this.resbody.response == 'success') {
    // //           this.SaveBBSResponse = this.resbody.Message;
    // //           this.isSaveJobAdvice = true;
    // //           this.gJobAdviceChanged = 0;

    // //           return true;
    // //         } else {
    // //           console.log("failed damn");
    // //           this.toastr.error(this.resbody.Message);
    // //           return false;
    // //         }

    // //         //allowGrade500M
    // //       },
    // //       error: (e) => {
    // //         console.log("failed ");
    // //       },
    // //       complete: () => {
    // //         if (this.isSaveJobAdvice && this.isSaveBBS) {
    // //           this.toastr.success(this.resbody.Message);
    // //           this.isSaveJobAdvice = false;
    // //           this.isSaveBBS = false;
    // //         }
    // //         // this.loading = false;
    // //       },
    // //     });
    // // }
    return;
  }

  SavePrecasInfo(item: any) {
    // if (!this.validateOrderQty()) {
    //   return false;
    // }

    console.log("this.PrecastDataInsert",this.PrecastDataInsert);
      this.isSaveBBS = false;

      this.STDDataArray = [];
      debugger;
      let currentDate = new Date();
      // if (
      //   (this.OrderStatus != 'New' &&
      //     this.OrderStatus != 'Reserved' &&
      //     this.OrderStatus != 'Sent' &&
      //     this.OrderStatus != 'Created*' &&
      //     this.OrderStatus != 'Created') ||
      //   this.gOrderCreation != 'Yes'
      // ) {
      //   return true;
      // }
      // if (this.gBBSChanged > 0) {

        // for (let i = 0; i < this.StandardbarOrderTempArray.length; i++) {
        //   let obj2 = {
        //     customerCode: this.CustomerCode,
        //     projectCode: this.ProjectCode,
        //     jobID: this.JobID,
        //     prodCode: '',
        //     ssid: 0,
        //     prodType: '',
        //     prodDesc: '',
        //     diameter: 0,
        //     grade: '',
        //     unitWT: this.StandardbarOrderTempArray[i].UnitWT,
        //     order_pcs: this.StandardbarOrderTempArray[i].order_pcs,
        //     order_wt: this.StandardbarOrderTempArray[i].order_wt,
        //     updateBy: '',
        //     updateDate: currentDate,
        //   };

        //   this.STDDataArray.push(obj2);
        // }
        debugger;
        let jobid = 0;
        if (this.Visible) {
          jobid = this.PostHID;
        }
        let obj = {
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          JobID: parseInt(this.JobID),
          StdPrecastDetail: item,
        };

        console.log("obj", obj);
        // console.log("stdPrecastData",stdPrecastData);
        this.updateflag();
        this.orderService.savePrecastDetails(obj).subscribe({
          next: (response) => {
            this.resbody = response;
            console.log(this.resbody);
            if (this.resbody.response == 'success') {
              this.toastr.success("Successfully saved..");
              this.SaveBBSResponse = this.resbody.Message;
              this.isSaveBBS = true;
              this.gBBSChanged = 0;
              this.getPrecastDetails(this.JobID);
              // this.orderService.UpdatePrecastFlag(this.JobID, 1);
              return true;
            } else {
              this.toastr.error(this.resbody.Message);
              if (this.PrecastArray.length == 0) {
                // this.orderService.UpdatePrecastFlag(this.JobID, 0);
              }
              return false;
            }

            //allowGrade500M
          },
          error: (e) => { },
          complete: () => {
            if (this.isSaveJobAdvice && this.isSaveBBS) {
              this.toastr.success(this.resbody.Message);
              this.isSaveJobAdvice = false;
              this.isSaveBBS = false;
            }
            this.getPrecastDetails(this.fromWbsPosting.PostHeaderID);
            // if(this.PrecastArray.length>0){
            //   this.orderService.UpdatePrecastFlag(this.JobID, 1);
            // }
            // else
            // {
            //   this.orderService.UpdatePrecastFlag(this.JobID, 0);
            // }
            // this.loading = false;

          },
        });

    return;

  }

  updateflag(){
    if(this.PrecastArray.length>0){
      this.orderService.UpdatePrecastFlag(this.JobID, 1)
      .subscribe({
        next: (response: any) => {

        },
        error: () => { },
        complete: () => {
          debugger;
        },
      });
    }
    else
    {
      this.orderService.UpdatePrecastFlag(this.JobID, 0)
      .subscribe({
        next: (response: any) => {

        },
        error: () => { },
        complete: () => {
          debugger;
        },
      });
    }


  }

  SaveOrder() {
    // this.success = this.validateOrderQtyEnd();
    // if (this.success == true) {
    this.SavePrecasInfo(false);
    this.SaveJobAdvice(false);
    this.goBack();
    // } else {
    //  this.toastr.error("please enter order quantity");
  }


  goBack(): void {
    if(this.PrecastArray.length)
    {
      localStorage.setItem("PageNumber", this.PrecastArray[0].PageNo.toString());
    }
    if (!this.RoutedFromProcess) {
      this.location.back();
    } else {
      this.router.navigate(['../order/createorder']);
    }

  }

  downloadReport() {
    const customerName = `${this.CustomerName} (${this.CustomerCode})`;
    const projectName = `${this.ProjectName} ( ${this.ProjectCode} )`;
    // const tableData = [
    //   { col1: 'Data 1', col2: 'Data 2', col3: 'Data 3' },
    //   { col1: 'Data A', col2: 'Data B', col3: 'Data C' },
    // ];

    this.pdfGenerator.generateReport(customerName, projectName, this.PrecastArray);
  }

  //  dismissModal(){
  //   this.modal.dismiss("User closed modal!");
  // }


}
