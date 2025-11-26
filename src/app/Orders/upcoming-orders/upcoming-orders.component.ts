import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';

import { OrderService } from '../orders.service';
// import { upcomingArray } from 'src/app/Model/upcomingArray';
import { Result } from 'src/app/Model/Result';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { BatchChangeStatusModel } from 'src/app/Model/BatchChangeStatusModel';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { LoginService } from 'src/app/services/login.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import moment from 'moment';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { EmailNotificationComponent } from './email-notification/email-notification.component';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { NotificationInfoComponent } from './notification-info/notification-info/notification-info.component';
import { boolean, forEach } from 'mathjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ExportUpcomingModel } from 'src/app/Model/exportUpcomingModel';
import { Subject, from, concatMap, tap, finalize, Observable, catchError, defer, mapTo, of } from 'rxjs';

const UpdatedUpcomingColumns = [
  {
    controlName: 'SSNNo',
    displayName: 'S/No',
    chineseDisplayName: '序号',
    field: 'SSNNo',
    colName: 'SSNNo',
    placeholder: 'Search SNo',
    isVisible: true,
    width: '5%',
    left: '0',
    resizeWidth: '50',
  },
  {
    controlName: 'OrderNo',
    displayName: 'ORDER NO',
    chineseDisplayName: '订单号码',
    field: 'OrderNo',
    colName: 'OrderNo',
    placeholder: 'Search OrderNo',
    isVisible: true,
    width: '5%',
    left: '0',
    resizeWidth: '50',
  },
  {
    controlName: 'WBS1',
    displayName: 'WBS1',
    chineseDisplayName: '大牌',
    colName: 'WBS1',
    field: 'WBS1',
    placeholder: 'Search WBS1',
    isVisible: true,
    width: '7%',
    left: '0',
    resizeWidth: '50',
  },
  {
    controlName: 'WBS2',
    displayName: 'WBS2',
    chineseDisplayName: '楼层',
    colName: 'WBS2',
    field: 'WBS2',
    placeholder: 'Search WBS2',
    isVisible: true,
    width: '5%',
    left: '0',
    resizeWidth: '50',
  },
  {
    controlName: 'WBS3',
    displayName: 'WBS3',
    chineseDisplayName: '分部',
    colName: 'WBS3',
    field: 'WBS3',
    placeholder: 'Search WBS3',
    isVisible: true,
    width: '5%',
    left: '0',
    resizeWidth: '50',
  },
  {
    controlName: 'StructureElement',
    displayName: 'STRUCTURE ELEMENT',
    chineseDisplayName: '建筑构件',
    colName: 'StructureElement',
    field: 'StructureElement',
    placeholder: 'Search StructureElement',
    isVisible: true,
    width: '5%',
    left: '0',
    resizeWidth: '150',
  },
  {
    controlName: 'ProdType',
    displayName: 'PRODUCT TYPE',
    chineseDisplayName: '产品类 型',
    colName: 'ProdType',
    field: 'ProdType',
    placeholder: 'Search ProductType',
    isVisible: true,
    width: '10%',
    left: '0',
    resizeWidth: '100',
  },
  {
    controlName: 'EstForecastDate',
    displayName: 'EST.request DATE',
    chineseDisplayName: '预估日期',
    colName: 'EstForecastDate',
    field: 'EstForecastDate',
    placeholder: 'Search EstRequiredDate',
    isVisible: true,
    width: '10%',
    left: '0',
    resizeWidth: '150',
  },
  // {
  //   controlName: 'LowerFloorDeliveryDate',
  //   displayName: 'Lower Floor DeliveryDate',
  //   chineseDisplayName: '下层交货日期',
  //   colName: 'LowerFloorDeliveryDate',
  //   field: 'LowerFloorDeliveryDate',
  //   placeholder: 'Search LowerFloorDeliveryDate',
  //   isVisible: true,
  //   width: '12%',
  //   left: '0',
  //   resizeWidth: '200',
  // },
  {
    controlName: 'LowerFloorPONo',
    displayName: 'LOWER FLOOR PO NO',
    chineseDisplayName: '下层订单号码',
    colName: 'LowerFloorPONo',
    field: 'LowerFloorPONo',
    placeholder: 'Search LowerFloorPONo',
    isVisible: true,
    width: '12%',
    left: '0',
    resizeWidth: '200',
  },
  {
    controlName: 'LowerFloorBBSNo',
    displayName: 'LOWER FLOOR BBS No',
    chineseDisplayName: '下层加工号码',
    colName: 'LowerFloorBBSNo',
    field: 'LowerFloorBBSNo',
    placeholder: 'Search LowerFloorBBSNo',
    isVisible: true,
    width: '12%',
    left: '0',
    resizeWidth: '150',
  },
  {
    controlName: 'LowerFloorBBSDesc',
    displayName: 'LOWER FLOOR BBS DESC',
    chineseDisplayName: '下层加工表 备注',
    colName: 'LowerFloorBBSDesc',
    field: 'LowerFloorBBSDesc',
    placeholder: 'Search LowerFloorBBSDesc',
    isVisible: true,
    width: '5%',
    left: '0',
    resizeWidth: '150',
  },
  {
    controlName: 'LowerFloorTonnage',
    displayName: 'LOWER FLOOR TONNAGE',
    chineseDisplayName: '下层吨数',
    colName: 'LowerFloorTonnage',
    field: 'LowerFloorTonnage',
    placeholder: 'Search LowerFloorTonnage',
    isVisible: true,
    width: '20%',
    left: '0',
    resizeWidth: '150',
  },

  {
    controlName: 'ConvertOrderDate',
    displayName: 'CONVERT ORDER DATE',
    chineseDisplayName: '转换订单日 期',
    colName: 'ConvertOrderDate',
    field: 'ConvertOrderDate',
    placeholder: 'Search ConvertOrderDate',
    isVisible: true,
    width: '20%',
    left: '0',
    resizeWidth: '150',
  },
  {
    controlName: 'ConvertOrderBy',
    displayName: 'CONVERT ORDER BY',
    chineseDisplayName: '订单转换者',
    colName: 'ConvertOrderBy',
    field: 'ConvertOrderBy',
    placeholder: 'Search ConvertOrderBy',
    isVisible: true,
    width: '20%',
    left: '0',
    resizeWidth: '150',
  },
  {
    controlName: 'ESTTonnage',
    displayName: 'EST TONNAGE',
    chineseDisplayName: '预估吨数',
    colName: 'ESTTonnage',
    field: 'ESTTonnage',
    placeholder: 'Search ESTTonnage',
    isVisible: true,
    width: '20%',
    left: '0',
    resizeWidth: '150',
  },
  {
    controlName: 'PlannedDelDate',
    displayName: 'LOWER FLOOR PLAN DELIVER DATE',
    chineseDisplayName: '下层计划交货日期',
    colName: 'PlannedDelDate',
    field: 'PlannedDelDate',
    placeholder: 'Search PlannedDelDate',
    isVisible: true,
    width: '20%',
    left: '0',
    resizeWidth: '150',
  },
];

@Component({
  selector: 'app-upcoming-orders',
  templateUrl: './upcoming-orders.component.html',
  styleUrls: ['./upcoming-orders.component.css'],
})
export class UpcomingOrdersComponent implements OnInit {
  upcomingForm!: FormGroup;
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

  @ViewChild('scrollViewportENT', { static: false })
  public viewPortENT: CdkVirtualScrollViewport | undefined;

  initialSelect: boolean = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  CustomerList: any = [];
  upcomingCols: any[] = [];
  istoggel: boolean = false;

  hideTable: boolean = true;
  ProjectList: any = [];
  loadingData = false;
  upcomingArray: any[] = [];
  upcomingArray_backup: any[] = [];
  upcomingArray_Temp: any[] = [];
  UpcomingBatchChangeOrderArray: any[] = [];
  Result: Result[] = []; //| undefined;
  resbody: any = { Message: '', response: '' };

  isAscending: boolean = false;
  currentSortingColumn: string = '';

  isExpand: boolean = false;
  toggleFilters = true;
  SelectedProjectCodes: any;

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
  BBSNo: any;
  BBSDesc: any;
  PODate: any;
  Tonnage: any;
  SubmittedBy: any;
  CreatedBy: any;
  ProjectTitle: any;
  OrderStatus: any;
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

  lReqDate1: any;
  CustomerCode: string = '';
  //ProjectCode: string="";
  ProjectCode: any = [];

  UpcomingOrderLoading: boolean = false;

  lOrderNOs: any = [];

  ordernumbers: any;
  selectedRow: any[] = [];

  hideUnshare: boolean = true;
  hideShare: boolean = true;
  hideDelete: boolean = true;
  hideSent: boolean = true;
  hideSubmit: boolean = true;

  UserType: any = '';
  Submission: any = '';
  Editable: any = '';
  multiSelect: number = 0;

  SelectAllFlag: boolean = false;
  searchForm: FormGroup;
  columnVisibiltyForm: FormGroup;

  upcomingColumns: any[] = [];
  clearInput: number = 0;
  selectedRowIndex: any;
  fixedColumn: number = 0;
  gHiddenCols: number = 0;
  startDateFilter!: moment.Moment;
  endDateFilter!: moment.Moment;

  distinctNamesWBS1: any[] = [];
  distinctNamesWBS2: any[] = [];
  distinctNamesWBS3: any[] = [];
  lastPress: any;
  firstSelectedRow: number = 0;
  lastSelctedRow: number = 0;
  // selectedRow: any[] = [];

  gSpecialNote: string = '';

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private loginService: LoginService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private createSharedService: CreateordersharedserviceService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private processsharedserviceService: ProcessSharedServiceService
  ) {
    this.upcomingForm = this.formBuilder.group({
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
    this.searchForm = this.formBuilder.group({
      SNo: [''],
      OrderNo: [''],
      PONo: [''],
      WBS1: [''],
      WBS2: [''],
      WBS3: [''],
      ProdType: [''],
      StructureElement: [''],
      BBSNo: [''],
      BBSDesc: [''],
      RequiredDate: [''],
      OrderWeight: [],
      UpdateBy: [''],
      ProjectTitle: [''],
      EstForecastDate: [''],
      // LowerFloorDeliveryDate: [''],
      LowerFloorPONo: [''],
      LowerFloorBBSNo: [''],
      LowerFloorBBSDesc: [''],
      LowerFloorTonnage: [''],
      ConvertOrderDate: [''],
      ConvertOrderBy: [''],
      ESTTonnage: [''],
      PlannedDelDate: [''],
    });

    this.columnVisibiltyForm = this.formBuilder.group({
      showPonumber: [true],
      showWBS1: [true],
      showWBS2: [true],
      showWBS3: [true],
      showProductType: [true],
      showStructureElement: [true],
      showBBSNo: [true],
      showBBSDesc: [true],
      showReqDate: [true],
      showTonnage: [true],
    });

    this.getOrderGridQueue$
    .pipe(concatMap(req => this.executeGetOrderGridList(req.customer, req.projects)))
    .subscribe({
      next: () => console.log('Queued GetOrderGridList completed'),
      error: (err) => console.error('Queued GetOrderGridList error:', err),
    });
	
  }

  ngOnInit() {
    this.gSpecialNote =
      'Some of the records with empty Planned Delivery Date are either already delivered or yet to be planned.';
    this.commonService.changeTitle('Upcoming Orders | ODOS');

    this.reloadService.reloadCustomerList$.subscribe((data) => {
      // let lTitle = this.commonService.GetTitle();
        if (this.loginService.customerList_Ordering) {
          this.CustomerList = this.loginService.customerList_Ordering;
        }
    });

    this.reloadService.reloadProjectList$.subscribe((data) => {
      // let lTitle = this.commonService.GetTitle();
        if (this.loginService.projectList_Ordering) {
          this.ProjectList = this.loginService.projectList_Ordering;
        }
    });


    // For refreshing the value of Customer Code.
    this.reloadService.reloadCustomer$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      
      // this.CustomerCode = lCustomerCode;
      this.upcomingForm.controls['customer'].patchValue(lCustomerCode );
      this.ProjectList = []; // When the Customer Code changes, auto clear the project list.
      this.SelectedProjectCodes = []; // When the Customer Code changes, auto clear the selected projectcodes.
      this.upcomingForm.controls['project'].patchValue(this.SelectedProjectCodes); // SelectedProjectCodes value updated in the form.
      this.upcomingArray = []; // Table data is also cleared on customer change.
    });

    this.reloadService.reload$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      // this.CustomerCode = lCustomerCode;
      this.upcomingForm.controls['customer'].patchValue(lCustomerCode );

      let lProjectCodes = this.dropdown.getProjectCode();  // Refresh the selected Project Codes.
      this.SelectedProjectCodes = lProjectCodes;
      this.upcomingForm.controls['project'].patchValue(lProjectCodes);

      if (data === 'Upcoming Orders') {
        this.Loaddata(); // Refresh the Table Data based on the selected Customer & Project Codes.
      }
    });

    if (localStorage.getItem('upcomingFixedColumns')) {
      this.fixedColumn = JSON.parse(
        localStorage.getItem('upcomingFixedColumns')!
      );
    }
    if (localStorage.getItem('upcomingColumns')) {
      this.upcomingColumns = JSON.parse(
        localStorage.getItem('upcomingColumns')!
      );
    } else {
      this.upcomingColumns = [
        {
          controlName: 'SSNNo',
          displayName: 'S/No',
          chineseDisplayName: '序号',
          field: 'SSNNo',
          colName: 'SSNNo',
          placeholder: 'Search SNo',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '50',
        },
        {
          controlName: 'OrderNo',
          displayName: 'ORDER NO',
          chineseDisplayName: '订单号码',
          field: 'OrderNo',
          colName: 'OrderNo',
          placeholder: 'Search OrderNo',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '50',
        },
        {
          controlName: 'WBS1',
          displayName: 'WBS1',
          chineseDisplayName: '大牌',
          colName: 'WBS1',
          field: 'WBS1',
          placeholder: 'Search WBS1',
          isVisible: true,
          width: '7%',
          left: '0',
          resizeWidth: '50',
        },
        {
          controlName: 'WBS2',
          displayName: 'WBS2',
          chineseDisplayName: '楼层',
          colName: 'WBS2',
          field: 'WBS2',
          placeholder: 'Search WBS2',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '50',
        },
        {
          controlName: 'WBS3',
          displayName: 'WBS3',
          chineseDisplayName: '分部',
          colName: 'WBS3',
          field: 'WBS3',
          placeholder: 'Search WBS3',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '50',
        },
        {
          controlName: 'StructureElement',
          displayName: 'STRUCTURE ELEMENT',
          chineseDisplayName: '建筑构件',
          colName: 'StructureElement',
          field: 'StructureElement',
          placeholder: 'Search StructureElement',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'ProdType',
          displayName: 'PRODUCT TYPE',
          chineseDisplayName: '产品类 型',
          colName: 'ProdType',
          field: 'ProdType',
          placeholder: 'Search ProductType',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'EstForecastDate',
          displayName: 'EST.request DATE',
          chineseDisplayName: '预估日期',
          colName: 'EstForecastDate',
          field: 'EstForecastDate',
          placeholder: 'Search EstRequiredDate',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '150',
        },
        // {
        //   controlName: 'LowerFloorDeliveryDate',
        //   displayName: 'Lower Floor DeliveryDate',
        //   chineseDisplayName: '下层交货日期',
        //   colName: 'LowerFloorDeliveryDate',
        //   field: 'LowerFloorDeliveryDate',
        //   placeholder: 'Search LowerFloorDeliveryDate',
        //   isVisible: true,
        //   width: '12%',
        //   left: '0',
        //   resizeWidth: '200',
        // },
        {
          controlName: 'LowerFloorPONo',
          displayName: 'LOWER FLOOR PO NO',
          chineseDisplayName: '下层订单号码',
          colName: 'LowerFloorPONo',
          field: 'LowerFloorPONo',
          placeholder: 'Search LowerFloorPONo',
          isVisible: true,
          width: '12%',
          left: '0',
          resizeWidth: '200',
        },
        {
          controlName: 'LowerFloorBBSNo',
          displayName: 'LOWER FLOOR BBS No',
          chineseDisplayName: '下层加工号码',
          colName: 'LowerFloorBBSNo',
          field: 'LowerFloorBBSNo',
          placeholder: 'Search LowerFloorBBSNo',
          isVisible: true,
          width: '12%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'LowerFloorBBSDesc',
          displayName: 'LOWER FLOOR BBS DESC',
          chineseDisplayName: '下层加工表 备注',
          colName: 'LowerFloorBBSDesc',
          field: 'LowerFloorBBSDesc',
          placeholder: 'Search LowerFloorBBSDesc',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'LowerFloorTonnage',
          displayName: 'LOWER FLOOR TONNAGE',
          chineseDisplayName: '下层吨数',
          colName: 'LowerFloorTonnage',
          field: 'LowerFloorTonnage',
          placeholder: 'Search LowerFloorTonnage',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '150',
        },

        {
          controlName: 'ConvertOrderDate',
          displayName: 'CONVERT ORDER DATE',
          chineseDisplayName: '转换订单日 期',
          colName: 'ConvertOrderDate',
          field: 'ConvertOrderDate',
          placeholder: 'Search ConvertOrderDate',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'ConvertOrderBy',
          displayName: 'CONVERT ORDER BY',
          chineseDisplayName: '订单转换者',
          colName: 'ConvertOrderBy',
          field: 'ConvertOrderBy',
          placeholder: 'Search ConvertOrderBy',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'ESTTonnage',
          displayName: 'EST TONNAGE',
          chineseDisplayName: '预估吨数',
          colName: 'ESTTonnage',
          field: 'ESTTonnage',
          placeholder: 'Search ESTTonnage',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'PlannedDelDate',
          displayName: 'LOWER FLOOR PLAN DELIVER DATE',
          chineseDisplayName: '下层计划交货日期',
          colName: 'PlannedDelDate',
          field: 'PlannedDelDate',
          placeholder: 'Search PlannedDelDate',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '150',
        },
      ];
    }

    // Check for Planned Del Date column in the column list
    this.UpdateColumnList();

    /**Updated Fixed Columns */
    let lCount = 0;
    for (let i = 0; i < this.upcomingColumns.length; i++) {
      let lItem = this.upcomingColumns[i];
      if (lItem.isVisible == false) {
        if (i < this.fixedColumn) {
          lCount++;
        }
      }
    }
    this.gHiddenCols = lCount;

    if (localStorage.getItem('UpcomingVisibleColumns')) {
      this.columnVisibiltyForm.patchValue(
        JSON.parse(localStorage.getItem('UpcomingVisibleColumns')!)
      );
    }
    this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    //console.log(this.loadingData)
    this.GetOrderCustomer();
    if (this.loginService.customerList_Ordering) {
      this.CustomerList = this.loginService.customerList_Ordering;
    }
    if (this.loginService.projectList_Ordering) {
      this.ProjectList = this.loginService.projectList_Ordering;
    }

    this.upcomingForm.controls['customer'].patchValue(
      this.dropdown.getCustomerCode()
    );
    this.SelectedProjectCodes = this.dropdown.getProjectCode();
    // this.SelectedProjectCodes = ['0000113012'];
    this.upcomingForm.controls['project'].patchValue(this.SelectedProjectCodes);

    this.Loaddata();

    this.searchForm.valueChanges.subscribe((newValue) => {
      this.filterAllData();
    });
  }
  Loaddata() {
    // this.GetOrderCustomer();
    // this.GetOrderProjectsList(this.upcomingForm.controls['customer'].value);
    this.GetOrderGridList(
      this.upcomingForm.controls['customer'].value,
      this.SelectedProjectCodes
    );
  }

  showDetails(item: any) {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {
    //console.log(item.item_text);
    // //console.log(e.target.value);
    // //console.log(this.upcomingForm)

    //  let projecttName =e.target.value
    this.upcomingForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.upcomingForm.controls;
  }

  onSubmit() {
    // //console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.upcomingForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.hideTable = true;
    this.clearInput++;
    this.upcomingForm.reset();
  }

  getTodayDate(): string {
    let currentDate: Date;
    currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = this.padNumber(currentDate.getMonth() + 1);
    const day = this.padNumber(currentDate.getDate());
    return `${year}${month}${day}`;
  }
  getTomorrowDate(): string {
    let currentDate: Date;
    currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = this.padNumber(tomorrow.getMonth() + 1);
    const day = this.padNumber(tomorrow.getDate());

    return `${year}${month}${day}`;
  }
  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  giveRowcolor(item: any) {
    var color = 'inherit';
    if (item.rowSelected) {
      color = '#ffae00';
    } else {
      if (item.ConvertedOrderNo) {
        color = '#b5f77b';
      } else if (item.NotifiedEmailId) {
        color = '#ffe47c';
      }
    }
    return color;
  }
  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue && ctlValue != '') {
      if (ctlValue.toString().includes(',')) {
        let value = ctlValue.toString().toLowerCase().trim().split(',');
        return value.some((char: string) =>
          item.toString().toLowerCase().includes(char)
        );
      } else {
        return item
          .toString()
          .toLowerCase()
          .includes(ctlValue.toString().toLowerCase().trim());
      }
    } else {
      return true;
    }
  }
  searchData() {
    //debugger;
    this.upcomingArray = JSON.parse(JSON.stringify(this.upcomingArray_backup));
    if (this.OrderNumber != undefined && this.OrderNumber != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        this.checkFilterData(this.OrderNumber, item.OrderNo)
      );
    }
    if (this.PONumber != undefined && this.PONumber != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.PONo?.toLowerCase().includes(this.PONumber.trim().toLowerCase())
        this.checkFilterData(this.PONumber, item.PONo)
      );
    }
    if (
      this.StartReqDate != '' &&
      this.StartReqDate != null &&
      this.EndReqDate != '' &&
      this.EndReqDate != null
    ) {
      // console.log(this.upcomingArray[0].RequiredDate.replace(/-/g, ''))
      this.upcomingArray = this.upcomingArray.filter(
        (item) =>
          item.RequiredDate.replace(/-/g, '') <= this.EndReqDate &&
          item.RequiredDate.replace(/-/g, '') >= this.StartReqDate
      );
    }

    // if (this.StartPlanDate != "" && this.StartPlanDate != null && this.EndPlanDate != "" && this.EndPlanDate != null) {
    //   // console.log(this.upcomingArray[0].RequiredDate.replace(/-/g, ''))
    //   this.upcomingArray = this.upcomingArray.filter(item =>
    //     item.PlanDeliveryDate.replace(/-/g, '') <= this.EndPlanDate && item.PlanDeliveryDate.replace(/-/g, '') >= this.StartPlanDate
    //   );
    // };
    // if (this.StartPODate != "" && this.StartPODate != null && this.EndPODate != "" && this.EndPODate != null) {
    //   // console.log(this.upcomingArray[0].RequiredDate.replace(/-/g, ''))
    //   this.upcomingArray = this.upcomingArray.filter(item =>
    //     item.PODate.replace(/-/g, '') <= this.EndPODate && item.PODate.replace(/-/g, '') >= this.StartPODate
    //   );
    // };
    if (this.WBS1 != undefined && this.WBS1 != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.WBS1?.toLowerCase().includes(this.WBS1.trim().toLowerCase())
        this.checkFilterData(this.WBS1, item.WBS1)
      );
    }
    if (this.WBS2 != undefined && this.WBS2 != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.WBS2?.toLowerCase().includes(this.WBS2.trim().toLowerCase())
        this.checkFilterData(this.WBS2, item.WBS2)
      );
    }
    if (this.WBS3 != undefined && this.WBS3 != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.WBS3?.toLowerCase().includes(this.WBS3.trim().toLowerCase())
        this.checkFilterData(this.WBS3, item.WBS3)
      );
    }
    if (this.ProductType != undefined && this.ProductType != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.ProdType?.toLowerCase().includes(
        //   this.ProductType.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProductType, item.ProdType)
      );
    }
    if (this.StructureElement != undefined && this.StructureElement != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.StructureElement?.toLowerCase().includes(
        //   this.StructureElement.trim().toLowerCase()
        // )
        this.checkFilterData(this.StructureElement, item.StructureElement)
      );
    }
    if (this.BBSNo != undefined && this.BBSNo != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.BBSNo?.toLowerCase().includes(this.BBSNo.trim().toLowerCase())
        this.checkFilterData(this.BBSNo, item.BBSNo)
      );
    }
    if (this.BBSDesc != undefined && this.BBSDesc != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.BBSDesc?.toLowerCase().includes(this.BBSDesc.trim().toLowerCase())
        this.checkFilterData(this.BBSDesc, item.BBSDesc)
      );
    }
    // if (this.PODate != undefined && this.PODate != "") {
    //   this.upcomingArray = this.upcomingArray.filter(item =>
    //     item.PODate?.toLowerCase().includes(this.PODate.trim().toLowerCase())
    //   );
    // };
    if (this.Tonnage != undefined && this.Tonnage != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.OrderWeight?.toLowerCase().includes(
        //   this.Tonnage.trim().toLowerCase()
        // )
        this.checkFilterData(this.Tonnage, item.OrderWeight)
      );
    }
    // if (this.SubmittedBy != undefined && this.SubmittedBy != "") {
    //   this.upcomingArray = this.upcomingArray.filter(item =>
    //     item.SubmittedBy?.toLowerCase().includes(this.SubmittedBy.trim().toLowerCase())
    //   );
    // };
    // if (this.CreatedBy != undefined && this.CreatedBy != "") {
    //   this.upcomingArray = this.upcomingArray.filter(item =>
    //     item.DataEnteredBy?.toLowerCase().includes(this.CreatedBy.trim().toLowerCase())
    //   );
    // };
    if (this.ProjectTitle != undefined && this.ProjectTitle != '') {
      this.upcomingArray = this.upcomingArray.filter((item) =>
        // item.ProjectTitle?.toLowerCase().includes(
        //   this.ProjectTitle.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProjectTitle, item.ProjectTitle)
      );
    }
    // if (this.OrderStatus != undefined && this.OrderStatus != "") {
    //   this.upcomingArray = this.upcomingArray.filter(item =>
    //     item.OrderShared?.toLowerCase().includes(this.OrderStatus.trim().toLowerCase())
    //   );
    // };
  }
  getSeachDateForm(): FormGroup {
    const requiredDateControl = this.searchForm?.get('RequiredDate')!;
    return requiredDateControl as FormGroup;
  }
  filterAllData() {
    this.upcomingArray = JSON.parse(JSON.stringify(this.upcomingArray_backup));
    this.upcomingArray = this.upcomingArray.filter(
      (item) =>
        this.checkFilterData(
          this.searchForm.controls.OrderNo.value,
          item.OrderNo
        ) &&
        this.checkFilterData(
          this.searchForm.controls.LowerFloorPONo.value,
          item.LowerFloorPONo
        ) &&
        this.checkFilterData(this.searchForm.controls.WBS1.value, item.WBS1) &&
        this.checkFilterData(this.searchForm.controls.WBS2.value, item.WBS2) &&
        this.checkFilterData(this.searchForm.controls.WBS3.value, item.WBS3) &&
        this.checkFilterData(
          this.searchForm.controls.ProdType.value,
          item.ProdType
        ) &&
        this.checkFilterData(
          this.searchForm.controls.StructureElement.value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.searchForm.controls.LowerFloorBBSNo.value,
          item.LowerFloorBBSNo
        ) &&
        this.checkFilterData(
          this.searchForm.controls.LowerFloorBBSDesc.value,
          item.LowerFloorBBSDesc
        ) &&
        this.checkFilterData(
          this.searchForm.controls.LowerFloorTonnage.value,
          item.LowerFloorTonnage
        ) &&
        this.checkFilterData(this.searchForm.controls.PONo.value, item.PONo) &&
        this.checkFilterData(
          this.searchForm.controls.OrderWeight.value,
          item.OrderWeight
        ) &&
        this.checkFilterData(
          this.searchForm.controls.BBSDesc.value,
          item.BBSDesc
        ) &&
        this.checkFilterData(
          this.searchForm.controls.BBSNo.value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.searchForm.controls.EstForecastDate.value,
          item.EstForecastDate
        ) &&
        // this.checkFilterData(
        //   this.searchForm.controls.LowerFloorDeliveryDate.value,
        //   item.LowerFloorDeliveryDate
        // ) &&
        this.checkFilterData(
          this.searchForm.controls.ConvertOrderBy.value,
          item.ConvertOrderBy
        ) &&
        this.checkFilterData(
          this.searchForm.controls.ConvertOrderDate.value,
          item.ConvertOrderDate
        ) &&
        this.getDateCompare(
          this.searchForm.controls.RequiredDate.value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.searchForm.controls.ESTTonnage.value,
          item.ESTTonnage
        ) &&
        this.checkFilterData(
          this.searchForm.controls.PlannedDelDate.value,
          item.PlannedDelDate
        )
    );

    // this.selectedRow.forEach(element => {
    //   let index = this.upcomingArray.findIndex(element1=>element1.UpcomingId==element);
    //   this.recordSelected(this.upcomingArray[index],index);
    // });

    // SNo: [''],
    // OrderNo: [''],
    // PONo: [''],
    // WBS1: [''],
    // WBS2: [''],
    // WBS3: [''],
    // ProdType: [''],
    // StructureElement: [''],
    // BBSNo: [''],
    // BBSDesc: [''],
    // RequiredDate: [''],
    // OrderWeight: [],
    // UpdateBy: [''],
    // ProjectTitle: [''],
    // EstForecastDate: [''],
    // LowerFloorDeliveryDate: [''],
    // LowerFloorPONo: [''],
    // LowerFloorBBSNo: [''],
    // LowerFloorBBSDesc: [''],
    // LowerFloorTonnage: [''],
  }
  setColVisibility(val: any, field: string) {
    let index = this.upcomingColumns.findIndex(
      (x: any) => x.controlName === field
    );
    this.upcomingColumns[index].isVisible = val;

    let values = this.columnVisibiltyForm.value;
    localStorage.setItem('UpcomingVisibleColumns', JSON.stringify(values));
  }
  dropCol(event: any) {
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex <= this.fixedColumn &&
        event.currentIndex >= this.fixedColumn
      ) {
        this.toastr.warning("Fixed columns can't be moved to normal columns!");
        // moveItemInArray(this.upcomingColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex >= this.fixedColumn &&
        event.currentIndex <= this.fixedColumn
      ) {
        // moveItemInArray(this.upcomingColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to fixed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.upcomingColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.upcomingColumns
        );
        moveItemInArray(this.upcomingColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.upcomingColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.upcomingColumns
      );
      moveItemInArray(this.upcomingColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem(
      'upcomingColumns',
      JSON.stringify(this.upcomingColumns)
    );
  }
  UpdateFixedColumns() {
    localStorage.setItem(
      'upcomingColumns',
      JSON.stringify(this.upcomingColumns)
    );
    localStorage.setItem(
      'upcomingFixedColumns',
      JSON.stringify(this.fixedColumn)
    );
  }
  UpdateVisibleColumns() {
    localStorage.setItem(
      'upcomingColumns',
      JSON.stringify(this.upcomingColumns)
    );
    let values = this.columnVisibiltyForm.value;
    localStorage.setItem('UpcomingVisibleColumns', JSON.stringify(values));

    /**Updated Fixed Columns */
    let lCount = 0;
    for (let i = 0; i < this.upcomingColumns.length; i++) {
      let lItem = this.upcomingColumns[i];
      if (lItem.isVisible == false) {
        if (i < this.fixedColumn) {
          lCount++;
        }
      }
    }
    this.gHiddenCols = lCount;
  }
  splitArray(num: number, array: any[]): HeaderColumn[] {
    const midpoint = Math.ceil(array.length / 2);
    if (num == 1) {
      return array.slice(0, midpoint);
    } else {
      return array.slice(midpoint);
    }

    // array.slice(midpoint)];
  }
  dateChange(date: any) {
    console.log(date.value);
    if (date.value == '') {
      this.upcomingArray = JSON.parse(
        JSON.stringify(this.upcomingArray_backup)
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

  plandeliDateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    this.StartPlanDate = '';
    this.StartPlanDate = '';
    //StartPlanDate
    this.StartPlanDate = dateRangeStart.value;
    this.StartPlanDate = this.getDate(this.StartPlanDate);
    //EndReqDate
    this.EndPlanDate = dateRangeEnd.value;
    this.EndPlanDate = this.getDate(this.EndPlanDate);
    this.changeDetectorRef.detectChanges();

    console.log(this.StartPlanDate);
    console.log(this.EndPlanDate);
    if (this.StartPlanDate != '' && this.EndPlanDate != '') {
      this.searchData();
    }
    // this.filterData();
  }
  POdateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    this.StartPODate = '';
    this.StartPODate = '';
    //StartPODate
    this.StartPODate = dateRangeStart.value;
    this.StartPODate = this.getDate(this.StartPODate);
    //EndReqDate
    this.EndPODate = dateRangeEnd.value;
    this.EndPODate = this.getDate(this.EndPODate);
    this.changeDetectorRef.detectChanges();

    console.log(this.StartPODate);
    console.log(this.EndPODate);
    if (this.StartPODate != '' && this.EndPODate != '') {
      this.searchData();
    }
    // this.filterData();
  }

  recordSelected(item: any, i: number) {
    debugger;
    console.log('recordSelected', item);
    //debugger;
    //let counter=0;
    this.SelectAllFlag = false;
    this.hideShare = true;
    this.hideUnshare = true;
    this.hideDelete = true;
    this.hideSent = true;
    this.hideSubmit = true;
    this.upcomingArray[i].isSelected = !this.upcomingArray[i].isSelected;
    let index = this.upcomingArray_backup.findIndex(
      (element) => element.UpcomingId === this.upcomingArray[i].UpcomingId
    );
    this.upcomingArray_backup[index].isSelected =
      !this.upcomingArray_backup[i].isSelected;

    //  this.SaveSelectedRow(i);

    for (let i = 0; i < this.upcomingArray.length; i++) {
      // let obj = {
      //   SSNNo: this.upcomingArray[i].SSNNo,
      //   OrderNo: this.upcomingArray[i].OrderNo,
      //   PONo: this.upcomingArray[i].PONo,

      //   //PlanDeliverdate: "",
      //   WBS1: this.upcomingArray[i].WBS1,
      //   WBS2: this.upcomingArray[i].WBS2,
      //   WBS3: this.upcomingArray[i].WBS3,
      //   ProdType: this.upcomingArray[i].ProdType,

      //   UpdateDate: this.upcomingArray[i].UpdateDate,
      //   StructureElement: this.upcomingArray[i].StructureElement,
      //   BBSNo: this.upcomingArray[i].BBSNo,
      //   BBSDesc: this.upcomingArray[i].BBSDesc,
      //   RequiredDate: this.upcomingArray[i].RequiredDate,
      //   OrderStatus: this.upcomingArray[i].OrderNo, //temp. it should be details column
      //   UpdateBy: this.upcomingArray[i].UpdateBy,
      //   OrderWeight: this.upcomingArray[i].OrderWeight,
      //   OrderShared: this.upcomingArray[i].OrderShared,
      //   ScheduledProd: this.upcomingArray[i].ScheduledProd,
      //   CustomerCode: this.upcomingArray[i].CustomerCode,
      //   ProjectCode: this.upcomingArray[i].ProjectCode,
      //   ProjectTitle: this.upcomingArray[i].ProjectTitle,
      //   isSelected: this.upcomingArray[i].isSelected
      // }
      if (this.upcomingArray[i].isSelected) {
        if (this.upcomingArray[i].lEditable == 'Yes') {
          this.hideShare = false;
          this.hideUnshare = false;
          this.hideDelete = false;
          if (this.upcomingArray[i].lSubmission == 'Yes') {
            this.hideSent = false;
          }
          this.hideSubmit = false;
        }
        return;
        // this.upcomingArray_Temp.push(obj);
        //counter+=1;
      }
      // else
      // {
      //   this.upcomingArray_Temp.splice(i,1);

      // }
    }
    // if(counter==0)
    // {

    //}
  }

  iselected() {
    this.upcomingArray_Temp = [];
    for (let i = 0; i < this.upcomingArray.length; i++) {
      if (this.upcomingArray[i].isSelected) {
        let obj = {
          SSNNo: this.upcomingArray[i].SSNNo,
          OrderNo: this.upcomingArray[i].OrderNo,
          PONo: this.upcomingArray[i].PONo,

          //PlanDeliverdate: "",
          WBS1: this.upcomingArray[i].WBS1,
          WBS2: this.upcomingArray[i].WBS2,
          WBS3: this.upcomingArray[i].WBS3,
          ProdType: this.upcomingArray[i].ProdType,

          UpdateDate: this.upcomingArray[i].UpdateDate,
          StructureElement: this.upcomingArray[i].StructureElement,
          BBSNo: this.upcomingArray[i].BBSNo,
          BBSDesc: this.upcomingArray[i].BBSDesc,
          RequiredDate: this.upcomingArray[i].RequiredDate,
          OrderStatus: this.upcomingArray[i].OrderNo, //temp. it should be details column
          UpdateBy: this.upcomingArray[i].UpdateBy,
          OrderWeight: this.upcomingArray[i].OrderWeight,
          OrderShared: this.upcomingArray[i].OrderShared,
          ScheduledProd: this.upcomingArray[i].ScheduledProd,
          CustomerCode: this.upcomingArray[i].CustomerCode,
          ProjectCode: this.upcomingArray[i].ProjectCode,
          ProjectTitle: this.upcomingArray[i].ProjectTitle,
          isSelected: this.upcomingArray[i].isSelected,
          lUserType: this.upcomingArray[i].lUserType,
          lSubmission: this.upcomingArray[i].lSubmission,
          lEditable: this.upcomingArray[i].lEditable,
          rowSelected: false,
        };

        this.upcomingArray_Temp.push(obj);

        this.UserType = this.upcomingArray[i].lUserType;
        this.Submission = this.upcomingArray[i].lSubmission;
        this.Editable = this.upcomingArray[i].lEditable;
      }
    }
  }

  Copy(item: any) {
    item = JSON.stringify(item, null, 2);
    console.log(item);
    this.clipboard.copy(item);
    this.toastr.success('Copied');
  }

  private getOrderGridQueue$ = new Subject<{ customer: any; projects: any[] }>();

  GetOrderGridList(customerCode: any, projectCodes: any): void {
    // Add this function call to the queue
    this.getOrderGridQueue$.next({ customer: customerCode, projects: projectCodes });
  }
  private executeGetOrderGridList(customerCode: any, projectCodes: any): Observable<void> {
  return defer(() => {
    this.upcomingArray = [];
    this.hideTable = false;
    this.UpcomingOrderLoading = true;

    this.totalCount = 0;
    this.CABtotalWeight = '0';
    this.MESHtotalWeight = '0';
    this.COREtotalWeight = '0';
    this.PREtotalWeight = '0';
    this.multiSelect = 0;

    customerCode = this.dropdown.getCustomerCode();
    projectCodes = this.dropdown.getProjectCode();

    if (!customerCode || !projectCodes?.length) {
      console.warn('Invalid parameters for GetOrderGridList');
      this.UpcomingOrderLoading = false;
      return of(void 0);
    }

    return from(projectCodes).pipe(
      concatMap((projectCode, index) =>
        this.orderService.upcomingOrderList(customerCode, projectCode).pipe(
          tap((response) => {
            const mapped = this.mapUpcomingData(response);
            this.upcomingArray = this.upcomingArray.concat(mapped);

            if (index === projectCodes.length - 1) {
              setTimeout(() => this.filterAllData(), 200);
            }
          }),
          catchError((err) => {
            console.error(`Error fetching upcoming orders for ${projectCode}`, err);
            return of([]); // continue queue on error
          })
        )
      ),
      finalize(() => {
        this.UpcomingOrderLoading = false;
        this.upcomingArray_backup = JSON.parse(JSON.stringify(this.upcomingArray));

        this.upcomingArray_backup.forEach((item) => (item.isSelected = false));

        this.distinctNamesWBS1 = Array.from(
          new Set(this.upcomingArray.map((item) => item.WBS1))
        ).sort();

        this.distinctNamesWBS2 = Array.from(
          new Set(this.upcomingArray.map((item) => Number(item.WBS2)))
        ).sort((a, b) => a - b);

        this.distinctNamesWBS3 = Array.from(
          new Set(this.upcomingArray.map((item) => item.WBS3))
        ).sort();

        console.log('Distinct WBS1:', this.distinctNamesWBS1);
        console.log('Distinct WBS2:', this.distinctNamesWBS2);
        console.log('Distinct WBS3:', this.distinctNamesWBS3);
      }),
      mapTo(void 0)
    );
  });
}


  // GetOrderGridList(customerCode: any, projectCodes: any): void {
  //   this.upcomingArray = [];
  //   // if (customerCode == undefined || projectCodes.length == 0) {
  //   //   customerCode = this.dropdown.getCustomerCode();
  //   //   projectCodes = this.dropdown.getProjectCode();
  //   // }
  //   customerCode = this.dropdown.getCustomerCode();
  //   projectCodes = this.dropdown.getProjectCode();

  //   if (customerCode != undefined && projectCodes.length > 0) {
  //     this.hideTable = false;
  //     this.UpcomingOrderLoading = true;

  //     this.totalCount = 0;
  //     this.CABtotalWeight = '0';
  //     this.MESHtotalWeight = '0';
  //     this.COREtotalWeight = '0';
  //     this.PREtotalWeight = '0';
  //     this.multiSelect = 0;
  //     for (let i = 0; i < projectCodes.length; i++) {
  //       this.orderService
  //         .upcomingOrderList(customerCode, projectCodes[i])
  //         .subscribe({
  //           next: (response) => {
  //             let temp = response;
  //             console.log('response', response);
  //             temp = this.mapUpcomingData(response);
  //             this.upcomingArray = this.upcomingArray.concat(temp);
  //             if (i == projectCodes.length - 1) {
  //               console.log('last element');
  //               //set time out for 0.2 seconds.
  //               setTimeout(() => {
  //                 this.filterAllData();
  //               }, 0.2 * 1000);
  //             }
  //           },
  //           error: (e) => {
  //             this.UpcomingOrderLoading = false;
  //           },
  //           complete: () => {
  //             //debugger;
  //             this.UpcomingOrderLoading = false;
  //             this.upcomingArray_backup = JSON.parse(
  //               JSON.stringify(this.upcomingArray)
  //             );

  //             this.upcomingArray_backup.forEach((item) => {
  //               item.isSelected = false;
  //             });
  //             let wbs1: any = {};
  //             let wbs2: any = {};
  //             let wbs3: any = {};

  //             this.distinctNamesWBS1 = Array.from(
  //               new Set(this.upcomingArray.map((item) => item.WBS1))
  //             ).sort();
  //             //this.distinctNamesWBS2 = Array.from(new Set(this.upcomingArray.map(item => Number(item.WBS2)))).sort();
  //             this.distinctNamesWBS2 = Array.from(
  //               new Set(this.upcomingArray.map((item) => Number(item.WBS2)))
  //             ).sort((a, b) => a - b);

  //             this.distinctNamesWBS3 = Array.from(
  //               new Set(this.upcomingArray.map((item) => item.WBS3))
  //             ).sort();

  //             // this.upcomingArray.forEach(item=>{
  //             //   if()
  //             // })
  //             console.log('this.distinctNamesWBS1', this.distinctNamesWBS1);
  //             console.log('this.distinctNamesWBS2', this.distinctNamesWBS2);
  //             console.log('this.distinctNamesWBS3', this.distinctNamesWBS3);
  //           },
  //         });
  //     }
  //   } else {
  //     // alert("Error on loading data. Please check the Internet connection and try again.");
  //   }
  // }
  getTotalWeight(producttype: any) {
    let totalweight = 0;
    for (let i = 0; i < this.upcomingArray.length; i++) {
      if (this.upcomingArray[i].ProdType == producttype) {
        totalweight = totalweight + Number(this.upcomingArray[i].OrderWeight);
      }
    }
    return totalweight;
  }

  GetOrderCustomer(): void {
    //debugger;
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.CustomerList = response;
        console.log('customer', response);
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }
  GetOrderProjectsList(customerCode: any): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();

    this.orderService
      .GetProjects(customerCode, pUserType, pGroupName)
      .subscribe({
        next: (response) => {
          this.ProjectList = response;
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }
  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }

  downloadFile() {
    let listTodownload = [];
    for (let i = 0; i < this.upcomingArray.length; i++) {
      let obj = {
        SNo: i + 1,
        OrderNumber: this.upcomingArray[i].OrderNo,
        //PONumber: this.upcomingArray[i].PONo,
        //PlanDeliverdate: "",
        WBS1: this.upcomingArray[i].WBS1,
        WBS2: this.upcomingArray[i].WBS2,
        WBS3: this.upcomingArray[i].WBS3,
        ProductType: this.upcomingArray[i].ProdType,
        StructureElement: this.upcomingArray[i].StructureElement,
        ForecastDate: this.upcomingArray[i].EstForecastDate,
        //DeliveryDate: this.upcomingArray[i].LowerFloorDeliveryDate,
        LowerFloorPONo: this.upcomingArray[i].LowerFloorPONo,
        LowerFloorBBSNo: this.upcomingArray[i].LowerFloorBBSNo,
        LowerFloorBBSDesc: this.upcomingArray[i].LowerFloorBBSDesc,
        LowerFloorTonnage: this.upcomingArray[i].LowerFloorTonnage,
        ConvertOrderDate: this.upcomingArray[i].ConvertOrderDate,
        ConvertOrderBy: this.upcomingArray[i].ConvertOrderBy,
        ESTTonnage: this.upcomingArray[i].ESTTonnage,
        PlannedDelDate: this.upcomingArray[i].PlannedDelDate,
      };
      listTodownload.push(obj);
    }
    // listTodownload = this.upcomingArray;
    this.name = 'upcomingList';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listTodownload);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'export');
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.name + '.xlsx';
    link.click();
  }

  toggleSortingOrder(columnname: string, actualColName: any) {
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    // this.sortItems(columnname);
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'OrderWeight' ||
        columnname == 'SSNNo' ||
        columnname == 'LowerFloorTonnage' ||
        columnname == 'ESTTonnage' ||
        columnname == 'WBS2'
      ) {
        this.upcomingArray.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else {
        this.upcomingArray.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'OrderWeight' ||
        columnname == 'SSNNo' ||
        columnname == 'LowerFloorTonnage' ||
        columnname == 'ESTTonnage' ||
        columnname == 'WBS2'
      ) {
        this.upcomingArray.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else {
        this.upcomingArray.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }
    // this.sortItemsProcessing(columnname);
    this.UpdateSelectedSortedRecords(this.upcomingArray);
    this.upcomingArray = [...this.upcomingArray];
    this.viewPortENT?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPortENT?.checkViewportSize();
    // this.sortItemsPendingENT(columnname);
    //this.UpdateSelectedSortedRecords(this.PendingENT);
  }
  convertToAscii(inputString: string) {
    let asciiValues = '';
    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      asciiValues = asciiValues + charCode;
    }
    return Number(asciiValues);
  }

  Share() {
    let temp: any[] = [];
    for (let i = 0; i < this.upcomingArray.length; i++) {
      if (this.upcomingArray[i].isSelected == true) {
        temp.push(this.upcomingArray[i]);
      }
    }
    this.UpdateRecord(temp, 'Shared');
  }

  Update(status: string) {}

  async UpdateRecord(SelectedRows: any, status: string) {
    // VALIDATIONS
    if (status == 'Submitted' || status == 'Sent') {
      for (var i = 0; i < SelectedRows.length; i++) {
        if (SelectedRows[i].ProdType == 'CAB' && i < SelectedRows.length - 1) {
          var lCABBBSNoA = SelectedRows[i].BBSNo.split(',');
          if (lCABBBSNoA != null && lCABBBSNoA.length > 0) {
            for (let j = 0; j < lCABBBSNoA.length; j++) {
              var lBBSNo1 = lCABBBSNoA[j].trim();
              if (lBBSNo1 != '') {
                for (let k = i + 1; k < SelectedRows.length; k++) {
                  if (SelectedRows[k].ProdType == 'CAB') {
                    if (SelectedRows[k].BBSNo.indexOf(lBBSNo1) >= 0) {
                      alert(
                        'There is duplicated BBS Number in selected orders. Please check.(所选订单中存在重复的 BBS 号码。 请检查.)'
                      );
                      return;
                    }
                  }
                }
                //check itself
                for (let k = j + 1; k < lCABBBSNoA.length; k++) {
                  if (lCABBBSNoA[k].trim() == lBBSNo1) {
                    alert(
                      'Found duplicated BBS Number ' +
                        lBBSNo1 +
                        '. Please check.(发现重复的 BBS 号码。 请检查.)'
                    );
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }

    if (status == 'Submitted') {
      for (let i = 0; i < SelectedRows.length; i++) {
        if (
          Number(SelectedRows[i].OrderWeight) == 0 &&
          SelectedRows[i].ScheduledProd == 'N'
        ) {
          alert(
            'The selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ') has no order detail data entered.'
          );
          return;
        }
        if (
          SelectedRows[i].PONo == null ||
          SelectedRows[i].PONo == '' ||
          SelectedRows[i].PONo.length == 0
        ) {
          alert(
            'The selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ') has no PO Number entered.'
          );
          return;
        }
        this.lReqDate1 = SelectedRows[i].RequiredDate;
        if (
          this.lReqDate1 != null &&
          this.lReqDate1 != '' &&
          this.lReqDate1 != ' '
        ) {
          if (
            this.lReqDate1 <=
              new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
            this.lReqDate1 >=
              new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
          ) {
            alert(
              'Invalid Required Date for Order Number ' +
                SelectedRows[i].OrderNo +
                '.'
            );
            return;
          }
        } else {
          alert(
            'Invalid Required Date for Order Number ' +
              SelectedRows[i].OrderNo +
              '.'
          );
          return;
        }
      }
    }
    if (status == 'Sent') {
      for (var i = 0; i < SelectedRows.length; i++) {
        if (SelectedRows[i].isSelected == true) {
          if (
            SelectedRows[i].OrderWeight == '0' &&
            SelectedRows[i].ScheduledProd == 'N'
          ) {
            alert(
              'The selected order (Order Number ' +
                SelectedRows[i].OrderNo +
                ') has no order datail data entered.'
            );
            return;
          }
          this.lReqDate1 = SelectedRows[i].RequiredDate;
          if (
            this.lReqDate1 != null &&
            this.lReqDate1 != '' &&
            this.lReqDate1 != ' '
          ) {
            var lReqDate = new Date(this.lReqDate1);
            if (
              lReqDate <=
                new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
              lReqDate >=
                new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
            ) {
              alert(
                'Invalid Required Date for Order Number ' +
                  SelectedRows[i].OrderNo +
                  '.'
              );
              return;
            }
          } else {
            alert(
              'Invalid Required Date for Order Number ' +
                SelectedRows[i].OrderNo +
                '.'
            );
            return;
          }
        }
      }
    }

    // CONFIRMATION
    if (status == 'Delete') {
      if (
        confirm('Are you sure you want to delete the select orders?') != true
      ) {
        return;
      }
    }
    if (status == 'Sent') {
      if (
        confirm(
          'Are you sure you want to send the select orders for approval?'
        ) != true
      ) {
        return;
      }
    }
    if (status == 'Submitted') {
      if (
        confirm(
          'Are you sure you want to submit the select orders to NatSteel?'
        ) != true
      ) {
        return;
      }
    }
    if (status == 'Shared') {
      if (
        confirm(
          'Are you sure you want to share the select orders to other users in the project?'
        ) != true
      ) {
        return;
      }
    }
    if (status == 'Exclusive') {
      if (
        confirm(
          'Are you sure you want to hold the select orders exclusively?'
        ) != true
      ) {
        return;
      }
    }

    let customers: any[] = [];
    let projects: any[] = [];
    let orders: any[] = [];

    for (let i = 0; i < SelectedRows.length; i++) {
      customers.push(SelectedRows[i].CustomerCode);
      projects.push(SelectedRows[i].ProjectCode);
      orders.push(Number(SelectedRows[i].OrderNo));
    }

    let obj: BatchChangeStatusModel = {
      pCustomerCode: customers,
      pProjectCode: projects,
      pOrderNo: orders,
      pOrderStatus: status,
    };

    console.log('Final Object -> ', obj);

    this.UpcomingOrderLoading = true;
    let respChangeStatus = await this.BatchChangeStatus_Data(obj);
    this.UpcomingOrderLoading = false;

    console.log('respChangeStatus', respChangeStatus);
    if (respChangeStatus != null) {
      if (respChangeStatus.success == false) {
        alert(respChangeStatus.responseText);
        return;
      }
    }

    let tempOrderDis = orders.join(',');

    alert('Order(s) ' + tempOrderDis + ' ' + status + ' successfully!');
    this.Loaddata();
    // this.GetOrderGridList(this.upcomingForm.controls['customer'].value,this.RefreshProject);
  }

  async BatchChangeStatus_Data(obj: BatchChangeStatusModel): Promise<any> {
    try {
      const data = await this.orderService
        .BatchChangeStatus_Data(obj)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async ViewOrderDetails(row: any) {
    // CLEAR DATA FROM PROCESS ORDER SAVED IN LOCAL STORAGE
    localStorage.removeItem('ProcessData');
    sessionStorage.removeItem('ProcessData');
    localStorage.removeItem('ProcessOrderSummaryData');
    sessionStorage.removeItem('ProcessOrderSummaryData');
    // localStorage.removeItem('CreateDataProcess');
    // sessionStorage.removeItem('CreateDataProcess');
    this.ordersummarySharedService.SetOrderSummaryData(undefined);
    this.processsharedserviceService.setOrderSummaryData(undefined);
    this.processsharedserviceService.ProductDetailsEditable = false;
    this.createSharedService.showOrderSummary = true;

    console.log('row selected', row);

    // NOTE: GET ALL ORDERS WITH SIMILAR REF NUMBER
    let response: any = await this.GetOrderSet(row.ConvertedOrderNo, false);

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
        // lOrderNo.push(response[i].ConvertedOrderNo);
        // ConvertedOrderNo

        let lStructPrd =
          response[i].StructureElement + '/' + response[i].ProductType;
        if (response[i].PostHeaderId) {
          lStructPrd = lStructPrd + response[i].PostHeaderId;
        }
        lStrutureProd.push(lStructPrd);
      }
    }

    this.createSharedService.selectedTab = true;
    if (lStructureElement.includes('NONWBS') || lStructureElement.includes('nonwbs'))  {
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

    this.UpdateAddressCode(row.OrderNo); // Udpates the AddressCode in the Dropdown of the selected Order.

    this.createSharedService.tempOrderSummaryList = undefined;
    this.createSharedService.tempProjectOrderSummaryList = undefined;
    // localStorage.setItem('CreateDataProcess', JSON.stringify(tempOrderSummaryList));
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    let UpdatedProjects = this.dropdown.UpdateProjectCodeSequence(row.ProjectCode);
    this.router.navigate(['../order/createorder']);
  }

  SelectRow(item: any) {
    item.isSelected = !item.isSelected;
  }
  ResetOrderSummary() {
    // CLEAR DATA FROM PROCESS ORDER SAVED IN LOCAL STORAGE
    localStorage.removeItem('ProcessData');
    sessionStorage.removeItem('ProcessData');
    localStorage.removeItem('ProcessOrderSummaryData');
    sessionStorage.removeItem('ProcessOrderSummaryData');
    // localStorage.removeItem('CreateDataProcess');
    // sessionStorage.removeItem('CreateDataProcess');
    this.ordersummarySharedService.SetOrderSummaryData(undefined);
    this.processsharedserviceService.setOrderSummaryData(undefined);
    this.processsharedserviceService.ProductDetailsEditable = false;
    this.createSharedService.showOrderSummary = true;
  }

  async ConvertToOrder() {
    /** Check count of selected data; */
    let lCount = 0;
    this.ResetOrderSummary();
    let bStructureElement: any[] = [];
    let bProductType: any[] = [];
    let bTotalWeight: any[] = [];
    let bTotalQty: any[] = [];
    let bSelectedPostId: any[] = [];
    let bScheduledProd: any[] = [];
    let bWBS1: any[] = [];
    let bWBS2: any[] = [];
    let bWBS3: any[] = [];
    let bOrderNo: any[] = [];
    let bUpcomingOrderNo: any[] = [];
    let bStrutureProd: any[] = [];

    for (let i = 0; i < this.upcomingArray.length; i++) {
      let row: any = '';
      if (this.upcomingArray[i].isSelected === true) {
        row = this.upcomingArray[i];
        lCount += 1;
        /** Check if order is already converted */
        if (row.ConvertedOrderNo) {
          alert(
            'Order is already converted. Click the View Details icon in Actions for the selected order to view Order Details.'
          );
          return;
        }
        //this.ResetOrderSummary();
        console.log('row selected', row);
        //uppdateforecastdate
        //this.createSharedService.upcomingForecastDate = row.EstForecastDate;
        // NOTE: GET ALL ORDERS WITH SIMILAR REF NUMBER

        let lSelectedProd: any = row.ProdType;
        let lSelectedPostID: any;
        let lSelectedQty: any;
        let lSelectedWT: any = row.LowerFloorTonnage;
        let lSelectedScheduled: any = row.OrderStatus;
        let lSelectedWBS1: any = row.WBS1;
        let lSelectedWBS2: any = row.WBS2;
        let lSelectedWBS3: any = row.WBS3;
        let lSelectedSE = row.StructureElement;
        let lSelectedOrderNo = row.OrderNo;
        //let lSelectedEST: any = row.ESTTonnage;

        this.createSharedService.selectedTab = true;
        if (lSelectedSE.includes('NONWBS') || lSelectedSE.includes('nonwbs'))  {
          this.createSharedService.selectedTab = false;
        }
        if (
          row.ProdType.includes('BPC') ||
          row.ProdType.includes('MSH') ||
          row.ProdType.includes('PRC') ||
          row.ProdType.includes('CORE')
        ) {
          let lObj = {
            CustomerCode: row.CustomerCode,
            ProjectCode: row.ProjectCode,
            WBS1: [row.WBS1],
            WBS2: [row.WBS2.toString()],
            WBS3: [row.WBS3],
          };
          let response: any = await this.GetScheduledData(lObj);
          if (response == undefined) {
            alert('Error on loading data.');
            return;
          }

          for (let i = 0; i < response.length; i++) {
            let lItem = response[i];
            let lStruct = row.StructureElement; //tempOrderSummaryList.pSelectedSE[0];
            let lProd = row.ProdType;

            if (lStruct.toUpperCase() == lItem.StructEle.toUpperCase()) {
              if (lProd.includes('MSH') && lItem.ProductType.includes('MESH')) {
                lSelectedProd = lItem.ProductType;
                lSelectedPostID = lItem.PostHeaderID;
                lSelectedQty = lItem.TotalPCs ? lItem.TotalPCs : 0;
                lSelectedWT = lItem.TotalWeight ? lItem.TotalWeight : 0;
                lSelectedScheduled = 'Y'; // lItem.TotalWeight
                lSelectedWBS1 = lItem.WBS1;
                lSelectedWBS2 = lItem.WBS2;
                lSelectedWBS3 = lItem.WBS3;
              } else if (
                lProd.includes('CORE') &&
                lItem.ProductType.includes('CORE')
              ) {
                lSelectedProd = lItem.ProductType;
                lSelectedPostID = lItem.PostHeaderID;
                lSelectedQty = lItem.TotalPCs ? lItem.TotalPCs : 0;
                lSelectedWT = lItem.TotalWeight ? lItem.TotalWeight : 0;
                lSelectedScheduled = 'Y'; // lItem.TotalWeight
                lSelectedWBS1 = lItem.WBS1;
                lSelectedWBS2 = lItem.WBS2;
                lSelectedWBS3 = lItem.WBS3;
              } else if (
                lProd.includes('PRC') &&
                lItem.ProductType.includes('PRE-CAGE')
              ) {
                lSelectedProd = lItem.ProductType;
                lSelectedPostID = lItem.PostHeaderID;
                lSelectedQty = lItem.TotalPCs ? lItem.TotalPCs : 0;
                lSelectedWT = lItem.TotalWeight ? lItem.TotalWeight : 0;
                lSelectedScheduled = 'Y'; // lItem.TotalWeight
                lSelectedWBS1 = lItem.WBS1;
                lSelectedWBS2 = lItem.WBS2;
                lSelectedWBS3 = lItem.WBS3;
              } else if (
                lProd.includes('BPC') &&
                lItem.ProductType.includes('BPC')
              ) {
                lSelectedProd = lItem.ProductType;
                lSelectedPostID = lItem.PostHeaderID;
                lSelectedQty = lItem.TotalPCs ? lItem.TotalPCs : 0;
                lSelectedWT = lItem.TotalWeight ? lItem.TotalWeight : 0;
                lSelectedScheduled = 'Y'; // lItem.TotalWeight
                lSelectedWBS1 = lItem.WBS1;
                lSelectedWBS2 = lItem.WBS2;
                lSelectedWBS3 = lItem.WBS3;
              }
            }
          }
          lSelectedSE = lSelectedSE.toUpperCase();
          let lStructPrd = lSelectedSE + '/' + lSelectedProd;
          if (lSelectedPostID) {
            lStructPrd = lStructPrd + lSelectedPostID;
          }

          console.log('Response Scheduled Data GET - ', response);
          bStructureElement.push(lSelectedSE);
          bProductType.push(lSelectedProd);
          bTotalWeight.push(lSelectedWT);
          bTotalQty.push(lSelectedQty);
          bSelectedPostId.push(lSelectedPostID);
          bScheduledProd.push(lSelectedScheduled);
          bWBS1.push(lSelectedWBS1);
          bWBS2.push(lSelectedWBS2);
          bWBS3.push(lSelectedWBS3);
          bOrderNo.push(0);
          bUpcomingOrderNo.push(lSelectedOrderNo);
          bStrutureProd.push(lStructPrd);
        }
        if (row.ProdType.includes('CAB')) {
          // For Specific Product Type - CAB, under Scheduled Product Type = 'N'.

          bStructureElement.push(lSelectedSE);
          bProductType.push('CAB');
          bTotalWeight.push(0);
          bTotalQty.push(0);
          bSelectedPostId.push(0);
          bScheduledProd.push('N');
          bWBS1.push(lSelectedWBS1);
          bWBS2.push(lSelectedWBS2);
          bWBS3.push(lSelectedWBS3);
          bOrderNo.push(0);
          bUpcomingOrderNo.push(lSelectedOrderNo);

          let lStructPrd = lSelectedSE + '/' + lSelectedProd;
          bStrutureProd.push(lStructPrd);
        }
      }
    }

    // return;

    if (lCount == 0) {
      alert('Select an order to be coverted.p选择要隐藏的订单');
      return;
    }

    if (this.checkforSelectedWBS1(bWBS1)) {
      alert('Cannot convert orders with different WBS1');
      return;
    }

    let tempOrderSummaryList: any = {
      pCustomerCode: '',
      pProjectCode: '',
      pSelectedCount: bStructureElement.length,
      pSelectedSE: bStructureElement,
      pSelectedProd: bProductType,
      pSelectedWT: bTotalWeight,
      pSelectedQty: bTotalQty,
      pSelectedPostID: bSelectedPostId,
      pSelectedScheduled: bScheduledProd,
      pSelectedWBS1: bWBS1,
      pSelectedWBS2: bWBS2,
      pSelectedWBS3: bWBS3,
      pWBS1: '',
      pWBS2: '',
      pWBS3: '',
      pOrderNo: bOrderNo,
      pUpcomingOrderNo: bUpcomingOrderNo,
      StructProd: bStrutureProd,
    };

    console.log('twmp1234', tempOrderSummaryList);
    this.createSharedService.tempOrderSummaryList = undefined;
    this.createSharedService.tempProjectOrderSummaryList = undefined;
    // localStorage.setItem('CreateDataProcess', JSON.stringify(tempOrderSummaryList));

    //Commented temporarly
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    this.createSharedService.upcomingData = tempOrderSummaryList;
    this.createSharedService.upcomingOrderFlag = true;
    //let UpdatedProjects = this.dropdown.UpdateProjectCodeSequence(row.ProjectCode);
    this.router.navigate(['../order/createorder']);
  }
  async GetOrderSet(OrderNumber: any, routeFlag: boolean) {
    // CALL API TO RETURN ALL ORDERS WITH SIMILAR REF NUMBER TO GIVEN ORDER NUMBER
    try {
      const data = await this.orderService
        .GetOrderSet(OrderNumber, routeFlag)
        .toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }

  checkforSelectedWBS1(pWBS1: any) {
    let lWBS1 = pWBS1[0];
    for (let i = 0; i < pWBS1.length; i++) {
      if (lWBS1 != pWBS1[i]) {
        return true;
      }
    }
    return false;
  }

  ShowSelectUnselect() {
    return this.upcomingArray.length > 0 ? false : true;
  }

  SelectAll(value: boolean) {
    this.SelectAllFlag = false;

    if (value === true) {
      this.SelectAllFlag = true;
    }
    this.selectedRow = [];
    this.upcomingArray.forEach((item) => (item.isSelected = value));
    console.log('Tanmay Testing ', this.upcomingArray);
    this.upcomingArray_backup.forEach((item) => {
      item.isSelected = false;
    });
    this.upcomingArray.forEach((element) => {
      if (element.isSelected) {
        this.upcomingArray_backup.forEach((element1) => {
          if (element.UpcomingId == element1.UpcomingId) {
            element1.isSelected = true;
          }
        });
      }
    });

    //     this.upcomingArray.forEach((element) => {
    //       element.isSelected = value;
    //       if(value)
    //       {
    //         this.selectedRow.push(element.UpcomingId);

    //       }
    //   }
    // );
  }

  getMinHeightIncoming(id: string) {
    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
      // Get the height of the div using clientHeight property
      // console.log('Heading Height', divElement.clientHeight);
      return divElement.clientHeight;
    }
    return 50;
  }
  onGetDateSelected(range: any) {
    this.searchForm
      .get(range.controlName)
      ?.setValue(
        moment(range.from).format('DD/MM/yyyy') +
          '-' +
          moment(range.to).format('DD/MM/yyyy')
      );
  }
  parseDate(dateString: any) {
    // Split the date string into parts
    const parts = dateString.split('/');
    // Rearrange the parts into a format JavaScript recognizes
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    // Create a new Date object
    return new Date(formattedDate);
  }
  parseDateRange(dateRangeString: string) {
    console.log('dateRangeString=>', dateRangeString);
    const dates = dateRangeString.trim().split('-');
    const startDate = moment(this.parseDate(dates[0]));
    const endDate = moment(this.parseDate(dates[1]));
    return { startDate, endDate };
  }
  // getDateCompare(dateToCompare: any, actualDate: any) {
  //   if (dateToCompare && dateToCompare != '' && actualDate) {
  //     const { startDate, endDate } = this.parseDateRange(dateToCompare);
  //     const dateObj = moment(new Date(actualDate));
  //     console.log("dateRangeString=>",startDate, endDate,dateObj,dateObj.isBetween(startDate, endDate, null, '[]'));
  //     return dateObj.isBetween(startDate, endDate, null, '[]');
  //   }else{
  //     return true;
  //   }
  // }
  getDateCompare(dateToCompare: any, actualDate: any) {
    // let lReturn = false;
    console.log('getDateCompare=>', dateToCompare, actualDate);
    if (dateToCompare && dateToCompare != '') {
      if (actualDate) {
        let actualDateList = actualDate.split(',');
        for (let i = 0; i < actualDateList.length; i++) {
          const { startDate, endDate } = this.parseDateRange(dateToCompare);
          const dateObj = moment(new Date(actualDateList[i]));
          console.log(
            'dateRangeString=>',
            startDate,
            endDate,
            dateObj,
            dateObj.isBetween(startDate, endDate, null, '[]')
          );
          if (dateObj.isBetween(startDate, endDate, null, '[]')) {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    } else {
      return true;
    }
  }
  Reset_Filter() {
    this.searchForm.reset();
    this.clearInput++;
    this.searchData();
    // this.selectedRow.forEach(element => {
    //     let index = this.upcomingArray.findIndex(element1=>element1.UpcomingId==element);
    //     this.recordSelected(this.upcomingArray[index],index);
    //   });
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
  }
  getRightWidthTest(element: HTMLElement, j: number) {
    let width = this.getAllPreviousSiblings(element);
    //console.log('previousSibling=>', width);

    this.setLeftOfTabble(j, width);
    // this.changeDetectorRef.detectChanges();
    return width + 'px';
  }
  getAllPreviousSiblings(element: HTMLElement) {
    let currentSibling = element.previousElementSibling;
    let totalWidth = 0;

    while (currentSibling) {
      const width = window.getComputedStyle(currentSibling).width;
      totalWidth += parseFloat(width);
      currentSibling = currentSibling.previousElementSibling;
    }

    return totalWidth;
  }
  setLeftOfTabble(index: number, width: any) {
    this.upcomingColumns[index].left = width;
  }
  getLeftOfTable(index: number) {
    console.log('get called?', this.upcomingColumns[index].left);
    return this.upcomingColumns[index].left;
  }
  onWidthChange(obj: any) {
    localStorage.setItem(
      'upcomingColumns',
      JSON.stringify(this.upcomingColumns)
    );
    this.upcomingColumns[obj.index].resizeWidth = obj.width;
    console.log('onWidthChange', this.upcomingColumns[obj.index]);
  }
  CheckCurrentIndex(index: any, dataList: any) {
    if (dataList[index].isVisible) {
      return index;
    } else {
      for (let i = index; i < dataList.Length; i++) {
        if (dataList[i].isVisible) {
          return i - 1;
        }
      }
    }
  }
  CheckHiddenColumn(index: any, dataList: any) {
    let lInVisibleColumns = 0;
    for (let i = 0; i <= index; i++) {
      if (dataList[i].isVisible != true) {
        lInVisibleColumns = lInVisibleColumns + 1;
      }
    }

    return index + lInVisibleColumns;
  }

  openNotification() {
    let lSelectedOrder: any[] = [];
    let lSuggestionMail: any[] = [];
    let lWBS1: any[] = [];
    for (let i = 0; i < this.upcomingArray.length; i++) {
      let lItem = this.upcomingArray[i];
      if (lItem.isSelected) {
        lSelectedOrder.push(lItem);
        // FOR LIST OF SELECTED WBS1
        lWBS1.push(lItem.WBS1);
        lWBS1 = [...new Set(lWBS1)];
      }
      let lMail = lItem.NotifiedEmailId
        ? lItem.NotifiedEmailId.split(';')
        : undefined;
      if (lMail) {
        if (lSuggestionMail.length == 0) {
          lSuggestionMail = lMail;
        } else {
          lSuggestionMail = [...lSuggestionMail, ...lMail];
        }
      }
    }
    lSuggestionMail = [...new Set(lSuggestionMail)];

    if (lSelectedOrder.length != 0) {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        // centered: true,
        size: 'xl',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(
        EmailNotificationComponent,
        ngbModalOptions
      );
      modalRef.componentInstance.gOrderList = lSelectedOrder;
      modalRef.componentInstance.gSuggestionMail = lSuggestionMail;
      modalRef.componentInstance.gWBS1 = lWBS1;
      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
        console.log('Notification sent to', lSelectedOrder);

        let lEmailSentTo = x;
        for (let i = 0; i < lSelectedOrder.length; i++) {
          let lIndex = this.upcomingArray.findIndex(
            (x) => x.OrderNo == lSelectedOrder[i].OrderNo
          );

          if (lIndex != -1) {
            this.upcomingArray[lIndex].NotifiedEmailId = lEmailSentTo;
            this.upcomingArray[lIndex].NotifiedEmailDate =
              new Date().toLocaleDateString();
            this.upcomingArray[lIndex].NotifiedByEmail =
              this.loginService.GetGroupName();
          }
        }
      });
      // modalRef.componentInstance.ProjectCode = this.selectedRow[0].ProjectCode;
      // modalRef.componentInstance.ProdType = this.selectedRow[0].ProdType;
    } else {
      alert('Please select an order.');
    }
  }

  Delete() {
    alert('Order Deleted successfully');
  }

  mapUpcomingData(pResposne: any) {
    let lReturn = [];
    if (pResposne) {
      for (let i = 0; i < pResposne.length; i++) {
        let litem = pResposne[i];
        console.log('litem', litem);
        let lObj = {
          SSNNo: i + 1,
          UpcomingId: litem.UpcomingId,
          OrderNo: litem.OrderNumber,
          WBS1: litem.WBS1,
          WBS2: litem.WBS2,
          WBS3: litem.WBS3,
          StructureElement: litem.StructureElement,
          ProdType: litem.ProdType,
          EstForecastDate: litem.ForecastDate,
          // LowerFloorDeliveryDate: litem.DeliveryDate,
          LowerFloorPONo: litem.PONo,
          LowerFloorBBSNo: litem.BBSNo,
          LowerFloorBBSDesc: litem.BBSDesc,
          LowerFloorTonnage: litem.FloorTonnage,
          ConvertedOrderNo: litem.ConvertedOrderNo,
          OrderStatus: litem.OrderStatus,
          NotifiedEmailId: litem.NotifiedEmailId,
          NotifiedEmailDate: litem.NotifiedEmailDate,
          NotifiedByEmail: litem.NotifiedByEmail,
          CustomerCode: litem.CustomerCode,
          ProjectCode: litem.ProjectCode,
          ConvertOrderDate: litem.ConvertOrderDate,
          ConvertOrderBy: litem.ConvertOrderBy,
          IsSelected: false,
          ESTTonnage: litem.ESTTonnage,
          PlannedDelDate: litem.PlannedDelDate,
          // UpcomingId:litem.UpcomingId
        };
        if (lObj.WBS1 != '' && lObj.WBS1 != undefined) {
          lReturn.push(lObj);
        }
      }
    }
    console.log('Upcoming Array', lReturn);
    return lReturn;
  }

  async DeleteOrders() {
    if (!confirm('Are you sure you want to delete the selected orders?')) {
      return;
    }
    this.UpcomingOrderLoading = true;
    let lErrorOrders: any[] = [];
    let lDeletedOrder: any[] = [];
    for (let i = 0; i < this.upcomingArray.length; i++) {
      let lItem = this.upcomingArray[i];
      if (lItem.isSelected) {
        let obj = {
          nWBS1: lItem.WBS1,
          nWBS2: lItem.WBS2,
          nWBS3: lItem.WBS3,
          nStructureElement: lItem.StructureElement,
          nProductType: lItem.ProdType,
          CustomerCode: lItem.CustomerCode,
          ProjectCode: lItem.ProjectCode,
        };

        let lResp = await this.DeleteUpcomingOrder(obj);
        if (lResp) {
          if (lResp === 'error') {
            lErrorOrders.push(lItem.OrderNo);
          } else {
            if (lResp.result == true) {
              lDeletedOrder.push(lItem.OrderNo);
            } else {
              lErrorOrders.push(lItem.OrderNo);
            }
          }
        }
      }
    }
    this.UpcomingOrderLoading = false;
    if (lErrorOrders.length > 0) {
      let lOrders = lErrorOrders.join(',');
      alert(
        'Unable to delete orders ' +
          lOrders +
          'due to an error in the process. Please try to delete the order individually.'
      );
      this.GetOrderGridList(this.CustomerCode, this.SelectedProjectCodes);
    } else {
      if (lDeletedOrder.length > 0) {
        let lOrders = lDeletedOrder.join(',');
        alert('Orders ' + lOrders + ' Deleted successfully.');
        this.GetOrderGridList(this.CustomerCode, this.SelectedProjectCodes);
      } else {
        this.toastr.error('Error! Select an order to be deleted.');
      }
    }
  }
  async DeleteUpcomingOrder(pObj: any): Promise<any> {
    try {
      const data = this.orderService
        .DeleteUpcoming(
          pObj.nWBS1,
          pObj.nWBS2,
          pObj.nWBS3,
          pObj.nStructureElement,
          pObj.nProductType,
          pObj.CustomerCode,
          pObj.ProjectCode
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error('DeleteUpcomingOrder', error);
      return 'error';
    }
  }

  OpenNotificationInfo(pItem: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      NotificationInfoComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.OrderInfo = pItem;
  }

  checkConverted(pItem: any) {
    return pItem.ConvertedOrderNo != 0 && pItem.ConvertedOrderNo != undefined;
  }

  checkNotified(pItem: any) {
    if (pItem.ConvertedOrderNo != 0 && pItem.ConvertedOrderNo != undefined) {
      return false;
    }
    return pItem.NotifiedEmailId != '' && pItem.NotifiedEmailId != undefined;
  }

  checkCancelled(pItem: any) {
    return pItem.OrderStatus == 'N';
  }
  getFixedCols(): Number {
    if (this.fixedColumn > 0) {
      return Number(this.fixedColumn) + Number(this.gHiddenCols);
    }
    return 0;
  }
  async GetScheduledData(pObj: any) {
    // CALL API TO RETURN ALL ORDERS WITH SIMILAR REF NUMBER TO GIVEN ORDER NUMBER
    try {
      const response: any = await this.orderService
        .GetMeshPRCData(pObj)
        .toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  ExportToExcel() {
    let obj = this.GetDownloadColumns();
    console.log(obj);
    //this.ProcessOrderLoading = true;
    this.orderService.ExcelExportUpcoming(obj).subscribe({
      next: (data) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        a.download = 'ODOS_' + 'UPCOMING' + '_ORDER_LIST' + '.xlsx';
        a.click();
      },
      error: (e) => {
        //this.ProcessOrderLoading = false;
        alert(
          'Order printing failed, please check the Internet connection and try again.'
        );
      },
      complete: () => {
        //this.ProcessOrderLoading = false;
      },
    });
  }

  GetDownloadColumns() {
    let lColumnsID: any[] = [];
    let lColumnName: any[] = [];
    let lColumnSize: any[] = [];
    for (let item of this.upcomingColumns) {
      if (item.isVisible) {
        /**FOR COLUMN ID */
        if (item.colName == 'OrderNo') {
          lColumnsID.push('OrderNumber');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'WBS1') {
          lColumnsID.push('WBS1');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'WBS2') {
          lColumnsID.push('WBS2');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'WBS3') {
          lColumnsID.push('WBS3');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'StructureElement') {
          lColumnsID.push('StructureElement');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'ProdType') {
          lColumnsID.push('ProdType');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'EstForecastDate') {
          lColumnsID.push('ForecastDate');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        // if (item.colName == 'LowerFloorDeliveryDate') {
        //   lColumnsID.push('DeliveryDate');
        //   lColumnName.push(item.displayName);
        //   lColumnSize.push(100);
        // }
        if (item.colName == 'LowerFloorPONo') {
          lColumnsID.push('PONo');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'LowerFloorTonnage') {
          lColumnsID.push('FloorTonnage');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'LowerFloorBBSNo') {
          lColumnsID.push('BBSNo');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'LowerFloorBBSDesc') {
          lColumnsID.push('BBSDesc');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'ConvertedOrderNo') {
          lColumnsID.push('ConvertedOrderNo');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'ConvertOrderDate') {
          lColumnsID.push('ConvertOrderDate');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'ConvertOrderBy') {
          lColumnsID.push('ConvertedOrderBy');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == ' ') {
          lColumnsID.push(' ');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'ESTTonnage') {
          lColumnsID.push('ESTTonnage');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'PlannedDelDate') {
          lColumnsID.push('PlannedDelDate');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
      }
    }

    let lReturn: ExportUpcomingModel = {
      pColumnsID: lColumnsID,
      pColumnName: lColumnName,
      pColumnSize: lColumnSize,
      UserName: this.loginService.GetGroupName(),
      CustomerCode: this.dropdown.getCustomerCode(),
      ProjectCode: this.dropdown.getProjectCode(),
      OrderNumber: this.searchForm.controls.OrderNo.value,
      StrucutrueElement: this.searchForm.controls.StructureElement.value,
      WBS1: this.searchForm.controls.WBS1.value,
      WBS2: this.searchForm.controls.WBS2.value,
      WBS3: this.searchForm.controls.WBS3.value,
      ProductType: this.searchForm.controls.ProdType.value,
      ForeCastDate: this.ValidateFilterDate(
        this.searchForm.controls.EstForecastDate.value
      ), // null,
      LowerPONumber: this.searchForm.controls.LowerFloorPONo.value,
      LowerFloorBBSNo: this.searchForm.controls.LowerFloorBBSNo.value,
      LowerFloorBBSDesc: this.searchForm.controls.LowerFloorBBSDesc.value,
      FloorTonnage: Number(this.searchForm.controls.LowerFloorTonnage.value),
      ConvertOrderDate: this.ValidateFilterDate(
        this.searchForm.controls.ConvertOrderDate.value
      ), // null
      ConvertedOrderBy: this.searchForm.controls.ConvertOrderBy.value,
      ESTTonnage: Number(this.searchForm.controls.ESTTonnage.value),
      PlannedDelDate: this.ValidateFilterDate(
        this.searchForm.controls.PlannedDelDate.value
      ), // null
    };
    return lReturn;

    // return {
    //   pColumnsID: lColumnsID,
    //   pColumnName: lColumnName,
    //   pColumnSize: lColumnSize,
    //   UserName: this.loginService.GetGroupName(),
    //   CustomerCode: this.dropdown.getCustomerCode(),
    //   ProjectCode: this.dropdown.getProjectCode(),
    // };
  }

  ValidateFilterDate(lDate: string): Date | null {
    // Check for valid date format (YYYY-MM-DD)
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateFormatRegex.test(lDate)) {
      console.warn('The string does not match the YYYY-MM-DD format.');
      return null;
    }
    return new Date(lDate); //Date format is valid.
  }

  HoverSetting: boolean = false;
  @HostListener('document:click', ['$event'])
  handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      if (this.HoverSetting == false) {
        this.editColumn = false;
      }
    }
  }
  public get inverseOfENT(): string {
    if (!this.viewPortENT || !this.viewPortENT['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPortENT['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfENTSearch(): string {
    if (!this.viewPortENT || !this.viewPortENT['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPortENT['_renderedContentOffset'] - 30;
    return `-${offset}px`;
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  syncScroll(event: any) {
    //this.tableContainer.nativeElement.scrollLeft = event.target.scrollLeft;
  }

  UpdateSelectedSortedRecords(pDataList: any) {
    if (this.selectedRow.length > 0) {
      for (let i = 0; i < this.selectedRow.length; i++) {
        let jobId = this.selectedRow[i].JobID;

        for (let j = 0; j < pDataList.length; j++) {
          let x = pDataList[j];
          if (x.JobIDDis == jobId) {
            x = this.selectedRow[i];
            x.isSelected = true;
          }
        }
        // pDataList.forEach((x: { JobIDDis: any; isSelected: boolean }) => {
        // });
      }
    }
  }

  selectRow(row: any, dataList: any[], event: MouseEvent) {
    // this.myTable.nativeElement.tabIndex = 0;
    debugger;
    console.log('here', row);

    let tempDataList = JSON.parse(JSON.stringify(dataList)); // create a temp data list in case ctrl key is pressed;

    // this.setButtonDisplay(row.OrderStatus);
    dataList.forEach((element) => {
      element.rowSelected = false;
    });
    row.rowSelected = true;

    // this.Collapse = false;
    if (event.shiftKey) {
      // Handle multiselect with Shift key.
      if (this.lastPress.length) {
        let max = this.findMax(this.lastSelctedRow, this.firstSelectedRow);
        let min = this.findMin(this.lastSelctedRow, this.firstSelectedRow);

        this.lastSelctedRow = max;
        this.firstSelectedRow = min;
      }

      console.log('Multi Select Started');
      let lIndex = 0;

      // Get the index of the last selected row in the list.
      // for (let i = 0; i < dataList.length; i++) {
      //   lIndex = this.lastSelctedRow.rowSelected == true ? i : lIndex;
      // }
      lIndex = this.firstSelectedRow;
      // The index of the currently selected row in the list.
      let nIndex = dataList.findIndex((x) => x.SSNNo == row.SSNNo);

      if (nIndex > lIndex) {
        // Add all the rows between the two indexes.
        for (let i = lIndex; i < nIndex + 1; i++) {
          dataList[i].rowSelected = true;
          this.selectedRow.push(dataList[i]);
        }
        this.lastSelctedRow = nIndex;
      }
    } else if (event.ctrlKey) {
      // If Ctrl key is pressed restore the list to original state and highlight the currently selected row
      dataList = JSON.parse(JSON.stringify(tempDataList));
      let lIndex = dataList.findIndex((x) => x.SSNNo == row.SSNNo);
      if (lIndex != -1) {
        dataList[lIndex].rowSelected = true;
      }

      // For this scenario, the list needs to be reupdated into the original array as we created a shallow copy of the list
      this.upcomingArray = dataList;

      // The index of the currently selected row is updated to be the value of variable => lastSelctedRow
      this.lastSelctedRow = lIndex;
    } else {
      let lIndex = dataList.findIndex((x) => x.SSNNo == row.SSNNo);
      // The index of the currently selected row in the
      this.lastSelctedRow = lIndex;
      this.firstSelectedRow = lIndex;
    }

    console.log(this.upcomingArray);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey) {
      // Shift + ArrowDown
      if (event.key === 'ArrowDown') {
        if (this.lastPress == 'up') {
          this.upcomingArray[this.lastSelctedRow].rowSelected =
            !this.upcomingArray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow < this.upcomingArray.length) {
          this.lastSelctedRow += 1;
          this.upcomingArray[this.lastSelctedRow].rowSelected =
            !this.upcomingArray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'down';
      }

      // Shift + ArrowUp
      if (event.key === 'ArrowUp') {
        // Case 1: If shrinking upwards, deselect the last selected row

        // Case 2: If expanding upwards, select rows above firstSelectedRow

        if (this.lastPress == 'down') {
          this.upcomingArray[this.lastSelctedRow].rowSelected =
            !this.upcomingArray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow > 0) {
          this.lastSelctedRow -= 1;
          this.upcomingArray[this.lastSelctedRow].rowSelected =
            !this.upcomingArray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'up';
      }

      this.scrollToSelectedRow(this.upcomingArray);
    }
  }

  findMax(a: number, b: number): number {
    return a > b ? a : b;
  }
  findMin(a: number, b: number): number {
    return a < b ? a : b;
  }
  // SelectAllChecked(item:any)
  // {
  //   this.upcomingArray.forEach(element=>{
  //     if(element.rowSelected && item!==element)
  //     {
  //       element.isSelected = true;
  //     }

  //   })
  // }
  itemSize = 30;
  scrollToRow(
    viewport: CdkVirtualScrollViewport,
    nextIndex: number,
    itemSize: number
  ): void {
    if (viewport) {
      // const currentScrollOffset = viewport.measureScrollOffset();
      // if(currentScrollOffset > 250){
      //   const newOffset = currentScrollOffset + 29.2; // Move down one item size
      //   viewport.scrollToOffset(newOffset, 'smooth');
      // }
      // const range = viewport.getRenderedRange();
      // const startIndex = (range.end - range.start) /2;
      // if(startIndex > 14){
      //   // viewport.scrollToIndex(nextIndex, 'smooth');
      //   const currentScrollOffset = viewport.measureScrollOffset();
      // // if(currentScrollOffset > 250){
      //   const newOffset = currentScrollOffset + 29; // Move down one item size
      //   viewport.scrollToOffset(newOffset, 'smooth');
      // }
      const scrollOffset = viewport.measureScrollOffset();
      const viewportSize = viewport.getViewportSize();

      // Calculate the index at the viewport's end
      const endIndex = Math.floor(
        (scrollOffset + viewportSize) / this.itemSize - 3
      );
      if (nextIndex >= endIndex) {
        let offset = scrollOffset + 30;
        viewport.scrollToOffset(offset, 'smooth');
      }

      // console.log('Item index at viewport end:', endIndex);

      // Scroll to the offset of the item at the end index
    }
  }
  scrollToSelectedRow(ldataList: any) {
    const selectedRowIndex = this.lastSelctedRow;
    const selectedZeroRowIndex = ldataList.findIndex(
      (row: any) => row === this.selectedRow[0]
    );
    this.scrollToRow(this.viewPortENT!, selectedRowIndex + 1, ldataList.length);
  }
  SelectAllChecked(item: any) {
    // Select all the highlighted items
    let tempArray: any = JSON.parse(JSON.stringify(this.upcomingArray));
    let lCount = 0;

    item.isSelected = !item.isSelected;
    tempArray.forEach((element: any) => {
      if (element.rowSelected) {
        element.isSelected = true;
        if (JSON.stringify(item) !== JSON.stringify(element)) {
          element.rowSelected = false;
        }
        lCount++;
      }
    });

    if (lCount > 1) {
      // Function is not required if only a single item is getting selected
      this.upcomingArray = tempArray;
    } else {
      // In case a single item is selected, remove highlighting from others
      this.upcomingArray.forEach((element) => (element.rowSelected = false));
    }

    // Revert it back to original state as it will be updated again in the functions => recordSelected
    item.isSelected = !item.isSelected;

    // Highlight the clicked row in all cases;
    item.rowSelected = true;
  }

  DeleteWBS1(keyevent: KeyboardEvent, controlName: any) {
    console.log('hiiii');
    console.log(keyevent.key);
    if (keyevent.key == 'Delete') {
      this.searchForm.controls[controlName].setValue(null);
    }
  }
  DeleteWBS2(keyevent: KeyboardEvent, controlName: any) {
    console.log('hiiii');
    console.log(keyevent.key);
    if (keyevent.key == 'Delete') {
      this.searchForm.controls[controlName].setValue(null);
    }
  }
  DeleteWBS3(keyevent: KeyboardEvent, controlName: any) {
    console.log('hiiii');
    console.log(keyevent.key);
    if (keyevent.key == 'Delete') {
      this.searchForm.controls[controlName].setValue(null);
    }
  }

  showDeletedUpcomingOrders: boolean = false;
  ShowDeletedOrders(): void {
    console.log('ShowDeletedOrders!!');
    this.showDeletedUpcomingOrders = true;
    this.UpcomingOrderLoading = true;

    this.getDeletedUpcomingOrders();
    this.upcomingForm.reset();
  }

  BackToUpcomingOrders(): void {
    this.showDeletedUpcomingOrders = false;
    this.Loaddata();
    this.upcomingForm.reset();
  }

  Recover(): void {
    if (this.upcomingArray.length > 0) {
      // Filter the selected orders from the list of all orders
      let lSelectedOrders: any[] = this.upcomingArray.filter(
        (row) => row.isSelected === true
      );

      if (lSelectedOrders.length == 0) {
        alert('No selected orders to recover.');
        return;
      } else {
        if (!confirm('Are you sure you want to recover the selected orders?')) {
          return;
        }
        // Recover the deleted orders
        // Simulate the recovery process
        this.RecoverUpcomingOrders(lSelectedOrders);
        this.upcomingForm.reset();
      }
    }
  }

  getDeletedUpcomingOrders(): void {
    this.UpcomingOrderLoading = true;

    this.upcomingArray = [];
    let customerCode = this.dropdown.getCustomerCode();
    let projectCodes = this.dropdown.getProjectCode();

    for (let i = 0; i < projectCodes.length; i++) {
      this.orderService
        .DeletedupcomingOrderList(customerCode, projectCodes[i])
        .subscribe({
          next: (response) => {
            console.log('Deleted Upcoming Orders', response);
            if (response?.length > 0) {
              let temp = this.mapUpcomingData(response);
              this.upcomingArray = this.upcomingArray.concat(temp);
            }
          },
          error: (e) => {
            console.error(e);
            alert('Connection error, please check your internet connection.');
            this.UpcomingOrderLoading = false;
            this.BackToUpcomingOrders();
            return;
          },
          complete: () => {
            this.UpcomingOrderLoading = false;
            this.upcomingArray_backup = JSON.parse(
              JSON.stringify(this.upcomingArray)
            );

            this.upcomingArray_backup.forEach((item) => {
              item.isSelected = false;
            });
          },
        });
    }
  }

  async RecoverUpcomingOrders(pSelectedOrders: any[]) {
    // Start Loading.
    this.UpcomingOrderLoading = true;

    let lErrorOrders: any[] = [];
    let lRecoveredOrder: any[] = [];

    // Call the recovery function for all the selected orders.
    for (let i = 0; i < pSelectedOrders.length; i++) {
      let lItem = pSelectedOrders[i];
      if (lItem.isSelected) {
        let lObj = {
          nWBS1: lItem.WBS1,
          nWBS2: lItem.WBS2,
          nWBS3: lItem.WBS3,
          nStructureElement: lItem.StructureElement,
          nProductType: lItem.ProdType,
          nCustomerCode: lItem.CustomerCode,
          nProjectCode: lItem.ProjectCode,
        };

        let lResp = await this.RecoverUpcomingOrders_Get(lObj);
        if (lResp) {
          if (lResp === 'error') {
            lErrorOrders.push(lItem.OrderNo);
          } else {
            if (lResp.result == true) {
              lRecoveredOrder.push(lItem);
            } else {
              lErrorOrders.push(lItem.OrderNo);
            }
          }
        }
      }
    }
    this.UpcomingOrderLoading = false;

    // Show alert if there are any errors of any record recovery.
    if (lErrorOrders.length > 0) {
      let lOrders = lErrorOrders.join(',');
      alert(
        'Unable to delete orders ' +
          lOrders +
          'due to an error in the process. Please try to delete the order individually.'
      );
    }

    // Change row color of recovered orders.
    lRecoveredOrder.forEach((row) => {
      row.OrderStatus = 'Y';
    });
  }

  async RecoverUpcomingOrders_Get(pObj: any): Promise<any> {
    try {
      const data = this.orderService
        .RecoverUpcoming(
          pObj.nWBS1,
          pObj.nWBS2,
          pObj.nWBS3,
          pObj.nStructureElement,
          pObj.nProductType,
          pObj.nCustomerCode,
          pObj.nProjectCode
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

  UpdateColumnList() {
    // Check if Planned del date is present in the Column List
    let lIndex = this.upcomingColumns.findIndex(
      (x) => x.controlName == 'PlannedDelDate'
    );
    if (lIndex == -1) {
      // If not present in the column list.
      let lObj = {
        controlName: 'PlannedDelDate',
        displayName: 'LOWER FLOOR PLAN DELIVER DATE',
        chineseDisplayName: '下层计划交货日期',
        colName: 'PlannedDelDate',
        field: 'PlannedDelDate',
        placeholder: 'Search PlannedDelDate',
        isVisible: true,
        width: '20%',
        left: '0',
        resizeWidth: '150',
      };

      // Add the Planned Del Date column in the Column list and update the LocalStorage.
      this.upcomingColumns.push(lObj);
      localStorage.setItem(
        'upcomingColumns',
        JSON.stringify(this.upcomingColumns)
      );
    }

    // Update the current DisplayNames with Updated English & Chinese display names.
    let lUpdatedColumns = UpdatedUpcomingColumns;

    for (let i = 0; i < lUpdatedColumns.length; i++) {
      let lObj = lUpdatedColumns[i];
      let lIndex = this.upcomingColumns.findIndex(
        (x) => x.controlName === lObj.controlName
      );
      if (lIndex !== -1) {
        this.upcomingColumns[lIndex].displayName = lObj.displayName;
        this.upcomingColumns[lIndex].chineseDisplayName =
          lObj.chineseDisplayName;
      }
    }
    localStorage.setItem(
      'upcomingColumns',
      JSON.stringify(this.upcomingColumns)
    ); // Update the data in LocalStorage.
  }

  isExternalUser(): boolean {
    let lUser = this.loginService.GetGroupName();
    if (lUser) {
      if (lUser.includes('natsteel.com.sg')) return true; // Only true for Natsteel internal users.
    }
    return false; // Default to false for Extenal users.
  }

  changecustomer(event: any) {
    let lCustomerCode = event;
    this.dropdown.setCustomerCode(lCustomerCode);
    // Refresh the Value of CustomerCode in SideMenu;
    this.reloadService.reloadCustomerSideMenu.emit();
  
    this.SelectedProjectCodes = []; // Auto clear the selected project on customer change.
    this.changeproject(this.SelectedProjectCodes);
  }
  
  // RefreshProject: any[] = [];
  changeproject(event: any) {
    this.SelectedProjectCodes = event;
    console.log('SelectedProjectCodes', this.SelectedProjectCodes);
    // Refresh the ProjectCode in SideMenu;
    this.dropdown.setProjectCode(this.SelectedProjectCodes);
  
    if (this.SelectedProjectCodes.length == 0) {
      this.upcomingArray = [];
      this.hideTable = true;
    }else{
      this.hideTable = false;
    }
    this.reloadService.reloadProjectSideMenu.emit();
  }
  
  selectAllProject() {
    this.SelectedProjectCodes = this.ProjectList.map(
      (option: { ProjectCode: any }) => option.ProjectCode
    );
    this.upcomingForm.controls['project'].patchValue(this.SelectedProjectCodes);
    this.changeproject(this.SelectedProjectCodes);
  }
  
  clearAllProject() {
    this.hideTable = true;
    this.SelectedProjectCodes = [];
    this.upcomingArray = [];
    this.changeproject(this.SelectedProjectCodes);
  }

  async UpdateAddressCode(pOrderNumber: any) {
    // Get the selected AddressCode
    const addresResponse = await this.GetAddCodeforOrder(pOrderNumber);

    // Update the AddressCode
    if (addresResponse) {
      let lAddressCodes: any = [];
      if (addresResponse.AddressCode) {
        lAddressCodes.push(addresResponse.AddressCode);
        this.dropdown.setAddressList(lAddressCodes);
        this.reloadService.reloadAddress.emit();
      }
    }
  }
  async GetAddCodeforOrder(lOrderNumber: any): Promise<any> {
    try {
      const data = await this.orderService
        .GetAddCodeforOrder(lOrderNumber)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
