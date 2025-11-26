import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
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

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { Router } from '@angular/router';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { OrderService } from '../orders.service';
import * as XLSX from 'xlsx';
import { DeliveredOrderArray } from 'src/app/Model/DeliveredOrderArray';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { DeliveredOrderDocumentComponent } from './delivered-order-document/delivered-order-document.component';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { LoginService } from 'src/app/services/login.service';
import moment from 'moment';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatDateFormats,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subject, from, concatMap, tap, finalize, Observable, catchError, defer, of } from 'rxjs';
// Import jQuery if not already done in your project
//  import * as $ from 'jquery';
interface HeaderColumn {
  isVisible: boolean;
  controlName: string;
  displayName: string;
  chineseDisplayName: string;
  field: string;
  colName: string;
  placeholder: string;
  width: string;
  resizeWidth: string;
  left: string;
}
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY', //YYYY-MM-DD
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-deliveredorder',
  templateUrl: './deliveredorder.component.html',
  styleUrls: ['./deliveredorder.component.css'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DeliveredorderComponent implements OnInit {
  @ViewChild('scrollViewport', { static: false })
  public viewPort: CdkVirtualScrollViewport | undefined;

  deliveredorderForm!: FormGroup;
  dateRange!: FormGroup;
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  CustomerList: any = [];
  deliveredorderarray: any[] = [];
  deliveredorderarray_backup: DeliveredOrderArray[] = [];
  //deliveredorderarray_backup:any=[];
  isDelivery = true;
  name: string = '';
  fixedColumn: number = 1;
  isMobile = window.innerWidth;
  StartReqDate: any = null;
  EndReqDate: any = null;

  DeliveredOrderLoading: boolean = false;
  istoggel: boolean = false;

  loadingData = false;
  //deliveredorderarray: any = [];
  isExpand: boolean = false;
  toggleFilters = true;
  selectedRow: any[] = [];
  hideTable: boolean = true;
  itemsPerPage: number = 10;
  currentPage = 1;
  page = 1;
  pageSize = 0;
  ProjectList: any[] = [];
  SelectedProjectCodes: any[] = [];
  IsAllProject: boolean = false;
  editColumn: boolean = false;

  isAscending: boolean = false;
  currentSortingColumn: string = '';

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
  showOrderStatus: boolean = true;
  showDeliveryDate: boolean = true;
  showVehicleOutTime: boolean = true;
  showDeliveryQty: boolean = true;
  showDeliveryWeight: boolean = true;
  showVehicleNo: boolean = true;
  showDONo: boolean = true;
  show_Details: boolean = true;
  showSubmittedBy: boolean = true;
  OrderNumber: any;
  PONumber: any;
  SSNO: any;
  RequiredDate: any;
  WBS1: any;
  WBS2: any;
  WBS3: any;
  ProductType: any;
  StructureElement: any;
  BBSNo: any;
  OutTime: any;
  BBSDesc: any;
  LoadQty: any;
  LoadWT: any;
  VehicleNo: any;
  DONo: any;
  Details: any;
  Vehicle_out_time: any;
  DeliveryDate: any;

  totalCount: string = '';
  CABtotalWeight: string = '0';
  MESHtotalWeight: string = '0';
  COREtotalWeight: string = '0';
  PREtotalWeight: string = '0';
  SubmittedBy: any;
  deliveredColumns: HeaderColumn[] = [];
  searchForm: FormGroup;
  loading: boolean = false;
  clearInput: number = 0;
  selectedRowIndex: any;
  isValueChanged: boolean = false;
  VehicleOutTime: any;
  DeliveryQty: any;
  DeliveryWeight: any;
  PODate: any;
  TransportMode: any;
  ProjectTitle: any;
  Address: any;
  Gate: any;
  lastSelctedRow: any;
  firstSelectedRow: any;
  lastPress: string = '';

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
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private createSharedService: CreateordersharedserviceService,
    private processsharedserviceService: ProcessSharedServiceService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService
  ) {
    this.CustomerList = [
      { item_id: 1, item_text: 'ASIAGLOBE TRADE CONSORTIUM PTE LTD' },
      { item_id: 2, item_text: 'ASL SHIPYARD PTE LTD' },
      { item_id: 3, item_text: 'ASSET RECOVERY PTE LTD' },
    ];
    this.deliveredorderForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      wbs1: new FormControl('', Validators.required),
      wbs2: new FormControl('', Validators.required),
      wbs3: new FormControl('', Validators.required),
      po: new FormControl('', Validators.required),
      podate: new FormControl('', Validators.required),
      deliverydate: new FormControl('', Validators.required),
      requireddate: new FormControl('', Validators.required),
      isinclude: new FormControl('', Validators.required),
    });
    this.StartReqDate = moment().subtract(10, 'd').toDate();
    this.EndReqDate = moment().toDate();
    this.searchForm = this.formBuilder.group({
      OrderNo: [''],
      PONo: [''],
      WBS1: [''],
      WBS2: [''],
      WBS3: [''],
      ProdType: [''],
      StructureElement: [''],
      BBSNo: [''],
      BBSDesc: [''],
      DeliveryDate: [''],
      OutTime: [''],
      LoadQty: [''],
      LoadWT: [''],
      VehicleNo: [''],
      DONo: [''],
      SubmittedBy: [''],
      TransportMode: [''],
      ProjectTitle: [''],
      Address: [''],
      Gate: [''],
      PODate: [''],
    });

  this.getOrderGridQueue$
    .pipe(concatMap(req => this.executeDeliveredGridList(req.customer, req.projects)))
    .subscribe({
      next: () => console.log('Queued executeDeliveredGridList completed'),
      error: (err) => console.error('Queued executeDeliveredGridList error:', err),
    });
  }

  ngOnInit() {
    this.commonService.changeTitle('Delivered Orders | ODOS');

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
      this.deliveredorderForm.controls['customer'].patchValue(lCustomerCode );
      this.ProjectList = []; // When the Customer Code changes, auto clear the project list.
      this.SelectedProjectCodes = []; // When the Customer Code changes, auto clear the selected projectcodes.
      this.deliveredorderForm.controls['project'].patchValue(this.SelectedProjectCodes); // SelectedProjectCodes value updated in the form.
      this.deliveredorderarray = []; // Table data is also cleared on customer change.
    });

    this.reloadService.reload$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      // this.CustomerCode = lCustomerCode;
      this.deliveredorderForm.controls['customer'].patchValue(lCustomerCode );

      let lProjectCodes = this.dropdown.getProjectCode();  // Refresh the selected Project Codes.
      this.SelectedProjectCodes = lProjectCodes;
      this.deliveredorderForm.controls['project'].patchValue(lProjectCodes);

      if (data === 'Delivered Orders') {
        this.Loaddata(); // Refresh the Table Data based on the selected Customer & Project Codes.
      }
    });

    if (localStorage.getItem('deliveredFixedColumns')) {
      this.fixedColumn = JSON.parse(
        localStorage.getItem('deliveredFixedColumns')!
      );
    }
    if (localStorage.getItem('deliveredColumns')!) {
      let getValues = JSON.parse(localStorage.getItem('deliveredColumns')!);

      this.deliveredColumns = getValues;
      for (let i = 0; i < this.deliveredColumns.length; i++) {
        if (this.deliveredColumns[i].resizeWidth == '0') {
          this.deliveredColumns = [
            // {
            //   controlName: 'OrderNo',
            //   displayName: ' SNo.',
            //   chineseDisplayName: '序号',
            //   field: 'SSNO',
            //   colName: 'DigiOSID',
            //   placeholder: 'Search So',
            //   isVisible: true,
            //   width: '5%',
            // },
            {
              controlName: 'PONo',
              displayName: 'PO NO',
              chineseDisplayName: '订单号码',
              colName: 'PONo',
              field: 'PONo',
              placeholder: 'Search PONumber',
              isVisible: true,
              width: '7%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'DeliveryDate',
              displayName: 'Delivery Date',
              chineseDisplayName: '到场日期',
              colName: 'DeliveryDate',
              field: 'DeliveryDate',
              placeholder: 'Search here',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'OutTime',
              displayName: 'Vehicle Out Time',
              chineseDisplayName: '离厂时间',
              colName: 'OutTime',
              field: 'OutTime',
              placeholder: 'Search VehicleOutTime',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'LoadQty',
              displayName: 'Delivery Qty',
              chineseDisplayName: '送货数量',
              colName: 'LoadQty',
              field: 'LoadQty',
              placeholder: 'Search DeliveryQty',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'LoadWT',
              displayName: 'Delivery Weight',
              chineseDisplayName: '送货重量(MT)',
              colName: 'LoadWT',
              field: 'LoadWT',
              placeholder: 'Search DeliveryWeight',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },

            {
              controlName: 'VehicleNo',
              displayName: 'Vehicle No.',
              chineseDisplayName: '货车号码',
              colName: 'VehicleNo',
              field: 'VehicleNo',
              placeholder: 'Search VehicleNo',
              isVisible: true,
              width: '6%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'DONo',
              displayName: 'DO No.',
              chineseDisplayName: '交货编号',
              colName: 'DONo',
              field: 'DONo',
              placeholder: 'Search DONo',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'StructureElement',
              displayName: 'Structure Element',
              chineseDisplayName: '建筑构件',
              colName: 'StructureElement',
              field: 'StructureElement',
              placeholder: 'Search StructureElement',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'ProdType',
              displayName: 'Product Type',
              chineseDisplayName: '产品类型',
              colName: 'ProdType',
              field: 'ProdType',
              placeholder: 'Search ProductType',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'ProjectTitle',
              displayName: 'Project Title',
              chineseDisplayName: '工程项目',
              colName: 'ProjectTitle',
              field: 'ProjectTitle',
              placeholder: 'Search ProjectTitle',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'TransportMode',
              displayName: 'Transport Mode',
              chineseDisplayName: '运输类型',
              colName: 'TransportMode',
              field: 'TransportMode',
              placeholder: 'Search TransportMode',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'PODate',
              displayName: 'PO Date',
              chineseDisplayName: '订货日期',
              colName: 'PODate',
              field: 'PODate',
              placeholder: 'Search PODate',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'WBS1',
              displayName: 'WBS 1',
              chineseDisplayName: '楼座',
              colName: 'WBS1',
              field: 'WBS1',
              placeholder: 'Search WBS1',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'WBS2',
              displayName: 'WBS 2',
              chineseDisplayName: '楼层',
              colName: 'WBS2',
              field: 'WBS2',
              placeholder: 'Search WBS2',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'WBS3',
              displayName: 'WBS 3',
              chineseDisplayName: '分部',
              colName: 'WBS3',
              field: 'WBS3',
              placeholder: 'Search WBS3',
              isVisible: true,
              width: '5%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'BBSNo',
              displayName: 'BBS No',
              chineseDisplayName: '加工表号',
              colName: 'BBSNo',
              field: 'BBSNo',
              placeholder: 'Search BBSNo',
              isVisible: true,
              width: '7%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'BBSDesc',
              displayName: 'BBS Desc',
              chineseDisplayName: '加工表备注',
              colName: 'BBSDesc',
              field: 'BBSDesc',
              placeholder: 'Search BBSDesc',
              isVisible: true,
              width: '10%',
              resizeWidth: '100',
              left: '0',
            },

            {
              controlName: 'SubmittedBy',
              displayName: 'Submitted By',
              chineseDisplayName: '提交者',
              colName: 'SubmittedBy',
              field: 'SubmittedBy',
              placeholder: 'Search Submitted By',
              isVisible: true,
              width: '10%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'Address',
              displayName: 'Address',
              chineseDisplayName: '地址',
              colName: 'Address',
              field: 'Address',
              placeholder: 'Search Address',
              isVisible: true,
              width: '10%',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'Gate',
              displayName: 'Gate',
              chineseDisplayName: '门',
              colName: 'Gate',
              field: 'Gate',
              placeholder: 'Search Gate',
              isVisible: true,
              width: '10%',
              resizeWidth: '100',
              left: '0',
            },
          ];
        }
      }
    } else {
      this.deliveredColumns = [
        // {
        //   controlName: 'OrderNo',
        //   displayName: ' SNo.',
        //   chineseDisplayName: '序号',
        //   field: 'SSNO',
        //   colName: 'DigiOSID',
        //   placeholder: 'Search So',
        //   isVisible: true,
        //   width: '5%',
        // },
        {
          controlName: 'PONo',
          displayName: 'PO NO',
          chineseDisplayName: '订单号码',
          colName: 'PONo',
          field: 'PONo',
          placeholder: 'Search PONumber',
          isVisible: true,
          width: '7%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'DeliveryDate',
          displayName: 'Delivery Date',
          chineseDisplayName: '到场日期',
          colName: 'DeliveryDate',
          field: 'DeliveryDate',
          placeholder: 'Search here',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'OutTime',
          displayName: 'Vehicle Out Time',
          chineseDisplayName: '离厂时间',
          colName: 'OutTime',
          field: 'OutTime',
          placeholder: 'Search VehicleOutTime',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'LoadQty',
          displayName: 'Delivery Qty',
          chineseDisplayName: '送货数量',
          colName: 'LoadQty',
          field: 'LoadQty',
          placeholder: 'Search DeliveryQty',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'LoadWT',
          displayName: 'Delivery Weight',
          chineseDisplayName: '送货重量(MT)',
          colName: 'LoadWT',
          field: 'LoadWT',
          placeholder: 'Search DeliveryWeight',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },

        {
          controlName: 'VehicleNo',
          displayName: 'Vehicle No.',
          chineseDisplayName: '货车号码',
          colName: 'VehicleNo',
          field: 'VehicleNo',
          placeholder: 'Search VehicleNo',
          isVisible: true,
          width: '6%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'DONo',
          displayName: 'DO No.',
          chineseDisplayName: '交货编号',
          colName: 'DONo',
          field: 'DONo',
          placeholder: 'Search DONo',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          chineseDisplayName: '建筑构件',
          colName: 'StructureElement',
          field: 'StructureElement',
          placeholder: 'Search StructureElement',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'ProdType',
          displayName: 'Product Type',
          chineseDisplayName: '产品类型',
          colName: 'ProdType',
          field: 'ProdType',
          placeholder: 'Search ProductType',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'ProjectTitle',
          displayName: 'Project Title',
          chineseDisplayName: '工程项目',
          colName: 'ProjectTitle',
          field: 'ProjectTitle',
          placeholder: 'Search ProjectTitle',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'TransportMode',
          displayName: 'Transport Mode',
          chineseDisplayName: '运输类型',
          colName: 'TransportMode',
          field: 'TransportMode',
          placeholder: 'Search TransportMode',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'PODate',
          displayName: 'PO Date',
          chineseDisplayName: '订货日期',
          colName: 'PODate',
          field: 'PODate',
          placeholder: 'Search PODate',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'WBS1',
          displayName: 'WBS 1',
          chineseDisplayName: '楼座',
          colName: 'WBS1',
          field: 'WBS1',
          placeholder: 'Search WBS1',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'WBS2',
          displayName: 'WBS 2',
          chineseDisplayName: '楼层',
          colName: 'WBS2',
          field: 'WBS2',
          placeholder: 'Search WBS2',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'WBS3',
          displayName: 'WBS 3',
          chineseDisplayName: '分部',
          colName: 'WBS3',
          field: 'WBS3',
          placeholder: 'Search WBS3',
          isVisible: true,
          width: '5%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'BBSNo',
          displayName: 'BBS No',
          chineseDisplayName: '加工表号',
          colName: 'BBSNo',
          field: 'BBSNo',
          placeholder: 'Search BBSNo',
          isVisible: true,
          width: '7%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'BBSDesc',
          displayName: 'BBS Desc',
          chineseDisplayName: '加工表备注',
          colName: 'BBSDesc',
          field: 'BBSDesc',
          placeholder: 'Search BBSDesc',
          isVisible: true,
          width: '10%',
          resizeWidth: '100',
          left: '0',
        },

        {
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          chineseDisplayName: '提交者',
          colName: 'SubmittedBy',
          field: 'SubmittedBy',
          placeholder: 'Search Submitted By',
          isVisible: true,
          width: '10%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'Address',
          displayName: 'Address',
          chineseDisplayName: '地址',
          colName: 'Address',
          field: 'Address',
          placeholder: 'Search Address',
          isVisible: true,
          width: '10%',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'Gate',
          displayName: 'Gate',
          chineseDisplayName: '门',
          colName: 'Gate',
          field: 'Gate',
          placeholder: 'Search Gate',
          isVisible: true,
          width: '10%',
          resizeWidth: '100',
          left: '0',
        },
      ];
    }
    // this.searchForm.valueChanges.subscribe((newValue) => {
    //   this.filterAllData();
    // });
    this.searchForm.valueChanges.subscribe(async (newValue) => {
      if (
        newValue.DeliveryDate.includes('Invalid') ||
        newValue.PODate.includes('Invalid')
      ) {
        //this.loading = true;
        //this.filterAllData();
        this.SetDelayForLoader();
        //this.loading = false;
      } else {
        this.filterAllData();
      }
    });
    this.changeDetectorRef.detectChanges();
    this.loadingData = true;

    if (this.loginService.customerList_Ordering) {
      this.CustomerList = this.loginService.customerList_Ordering;
    }
    if (this.loginService.projectList_Ordering) {
      this.ProjectList = this.loginService.projectList_Ordering;
    }

    // LOADING VALUES
    this.deliveredorderForm.controls['customer'].patchValue(
      this.dropdown.getCustomerCode()
    );
    this.SelectedProjectCodes = this.dropdown.getProjectCode();
    this.deliveredorderForm.controls['project'].patchValue(this.SelectedProjectCodes);

    // SET DEFAULT DATE RANGE
    // this.SetDefaultDateRange();

    // TO GET LIST AND TABLE DATA
    this.Loaddata();

    this.UpdateColumnsWithGateAddresss();
  }
  Loaddata() {
    // this.GetOrderCustomer();
    // this.GetOrderProjectsList(
    //   this.deliveredorderForm.controls['customer'].value
    // );
    this.GetOrderGridList(
      this.deliveredorderForm.controls['customer'].value,
      this.SelectedProjectCodes
    );
  }
  showDetails(item: any) {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {
    console.log(item.item_text);
    // console.log(e.target.value);
    // console.log(this.deliveredorderForm)

    //  let projecttName =e.target.value
    this.deliveredorderForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.deliveredorderForm.controls;
  }

  onSubmit() {
    // console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.deliveredorderForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));
  }

  // recordSelected() {
  //   //debugger;
  //   for (let i = 0; i < this.deliveredorderarray.length; i++) {
  //     if (this.deliveredorderarray[i].isSelected) {
  //       // this.disablewithdraw = false
  //       // this.disablesubmit = false
  //       return;
  //     }
  //   }
  //   // this.disablewithdraw = true
  //   // this.disablesubmit = true
  // }

  Reset_Filter() {
    this.searchForm.reset();
    this.clearInput++;
    this.filterAllData();
  }

  dateChange(date: any) {
    //debugger;
    console.log('date value=>', date.value);
    if (date.value) {
      this.isValueChanged = true;
      this.filterAllData();
    }
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

  onReset() {
    this.submitted = false;
    this.deliveredorderForm.reset();
  }

  open(prodttype: any, structure: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
    };
    //const modalRef = this.modalService.open(AddGroupMarkComponent, ngbModalOptions);
    //modalRef.componentInstance.prodttype = prodttype;
    //modalRef.componentInstance.structure = structure;
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }

  downloadFile() {
    let listTodownload = [];
    for (let i = 0; i < this.deliveredorderarray.length; i++) {
      let obj = {
        //OrderNumber: this.deliveredorderarray[i].OrderNo,
        PONumber: this.deliveredorderarray[i].PONo,
        DeliveryDate: this.deliveredorderarray[i].DeliveryDate,
        OutTime: this.deliveredorderarray[i].OutTime,
        LoadWT: this.deliveredorderarray[i].LoadWT,
        VehicleNo: this.deliveredorderarray[i].VehicleNo,
        LoadQty: this.deliveredorderarray[i].LoadQty,
        DONo: this.deliveredorderarray[i].DONo,
        WBS1: this.deliveredorderarray[i].WBS1,
        WBS2: this.deliveredorderarray[i].WBS2,
        WBS3: this.deliveredorderarray[i].WBS3,
        ProductType: this.deliveredorderarray[i].ProdType,
        StructureElement: this.deliveredorderarray[i].StructureElement,
        BBSNo: this.deliveredorderarray[i].BBSNo,
        BBSDesc: this.deliveredorderarray[i].BBSDesc,
        SubmittedBy: this.deliveredorderarray[i].SubmittedBy,
        VehicleOutTime: this.deliveredorderarray[i].OutTime,
        DeliveryQty: this.deliveredorderarray[i].LoadQty,
        DeliveryWeight: this.deliveredorderarray[i].LoadWT,
        PODate: this.deliveredorderarray[i].PODate,
        TransportMode: this.deliveredorderarray[i].TransportMode,
        ProjectTitle: this.deliveredorderarray[i].ProjectTitle,
        Address: this.deliveredorderarray[i].Address,
        Gate: this.deliveredorderarray[i].Gate,
        //OrderStatus: this.deliveredorderarray[i].OrderStatus
      };
      listTodownload.push(obj);
    }
    // listTodownload = this.deliveredorderarray;
    this.name = 'DeliveredOrderList';
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

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }

  // getPageData() {
  //   //this.Loaddata();

  //   this.deliveredorderarray = this.deliveredorderarray
  //     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  // }


  getTodayDate(): string {
    let currentDate: Date;
    currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = this.padNumber(currentDate.getMonth() + 1);
    const day = this.padNumber(currentDate.getDate());
    return `${year}${month}${day}`;
  }
  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  giveRowcolor(item: any) {
    //debugger
    let currentDate = this.getTodayDate();

    var color = 'inhert';

    if (item.rowSelected) {
      color = 'beige';
    } else {
      color = 'white';
    }
    if (item.DeliveryDate.replace(/-/g, '') == currentDate) {
      color = '#00b050';
    } else if (item.PartialDelivery) {
      color = '#83f0b6 ';
    }

    return color;
  }

  Copy(item: any) {
    item = JSON.stringify(item, null, 2);
    console.log(item);
    this.clipboard.copy(item);
    this.toastr.success('Copied');
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
    this.deliveredorderarray = JSON.parse(
      JSON.stringify(this.deliveredorderarray_backup)
    );

    if (this.SSNO != undefined && this.SSNO != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { DigiOSID: number }) =>
          // item.DigiOSID.toString().includes(this.SSNO.trim()
          // )
          this.checkFilterData(this.SSNO, item.DigiOSID)
      );
    }
    if (this.PONumber != undefined && this.PONumber != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { PONo: string }) =>
          // item.PONo?.includes(this.PONumber.trim())
          this.checkFilterData(this.PONumber, item.PONo)
      );
    }
    if (
      this.StartReqDate != '' &&
      this.StartReqDate != null &&
      this.EndReqDate != '' &&
      this.EndReqDate != null
    ) {
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item) =>
          new Date(item.DeliveryDate) <= this.EndReqDate &&
          new Date(item.DeliveryDate) >= this.StartReqDate
      );
    }
    if (this.WBS1 != undefined && this.WBS1 != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        // (item: { WBS1: string }) => item.WBS1?.includes(this.WBS1.trim())
        (item: { WBS1: string }) => this.checkFilterData(this.WBS1, item.WBS1)
      );
    }
    if (this.WBS2 != undefined && this.WBS2 != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        // (item: { WBS2: string }) => item.WBS2?.includes(this.WBS2.trim())
        (item: { WBS2: string }) => this.checkFilterData(this.WBS2, item.WBS2)
      );
    }
    if (this.WBS3 != undefined && this.WBS3 != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        // (item: { WBS3: string }) => item.WBS3?.includes(this.WBS3.trim())
        (item: { WBS3: string }) => this.checkFilterData(this.WBS3, item.WBS3)
      );
    }
    if (this.ProductType != undefined && this.ProductType != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { ProdType: string }) =>
          // item.ProdType?.toLowerCase().includes(
          //   this.ProductType.trim().toLowerCase()
          // )
          this.checkFilterData(this.ProductType, item.ProdType)
      );
    }
    if (this.StructureElement != undefined && this.StructureElement != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { StructureElement: string }) =>
          // item.StructureElement?.toLowerCase().includes(
          //   this.StructureElement.trim().toLowerCase()
          // )
          this.checkFilterData(this.StructureElement, item.StructureElement)
      );
    }
    if (this.BBSDesc != undefined && this.BBSDesc != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { BBSDesc: string }) =>
          // item.BBSDesc?.toLowerCase().includes(
          //   this.BBSDesc.trim().toLowerCase()
          // )
          this.checkFilterData(this.BBSDesc, item.BBSDesc)
      );
    }

    if (this.BBSNo != undefined && this.BBSNo != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { BBSNo: string }) =>
          // item.BBSNo?.includes(this.BBSNo.trim())
          this.checkFilterData(this.BBSNo, item.BBSNo)
      );
    }

    if (this.DONo != undefined && this.DONo != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { DONo: string }) =>
          // item.DONo?.includes(this.DONo.trim())
          this.checkFilterData(this.DONo, item.DONo)
      );
    }

    // if (this.DeliveryQty != undefined && this.DeliveryQty != "") {
    //   this.deliveredorderarray = this.deliveredorderarray.filter((item: { DeliveryQty: string; }) =>
    //     item.DeliveryQty?.toLowerCase().includes(this.DeliveryQty.trim().toLowerCase())
    //   );
    // };
    if (this.LoadWT != undefined && this.LoadWT != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { LoadWT: string }) => item.LoadWT?.includes(this.LoadWT.trim())
      );
    }

    if (this.VehicleNo != undefined && this.VehicleNo != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { VehicleNo: string }) =>
          item.VehicleNo?.includes(this.VehicleNo.trim())
      );
    }

    if (this.LoadQty != undefined && this.LoadQty != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { LoadQty: string }) =>
          item.LoadQty?.includes(this.LoadQty.trim())
      );
    }

    // if (this.LoadQty != undefined && this.LoadQty != "") {
    //   this.deliveredorderarray = this.deliveredorderarray.filter((item: { LoadQty: string; }) =>
    //     item.LoadQty?.includes(this.LoadQty)
    //   );
    // };
    if (this.OutTime != undefined && this.OutTime != '') {
      this.deliveredorderarray = this.deliveredorderarray.filter(
        (item: { OutTime: string }) => item.OutTime?.includes(this.OutTime)
      );
    }

    //OutTime
  }
  filterAllData() {
    this.deliveredorderarray = JSON.parse(
      JSON.stringify(this.deliveredorderarray_backup)
    );
    console.log('in data filtering');

    this.deliveredorderarray = this.deliveredorderarray.filter(
      (item) =>
        this.getDateCompare(
          this.searchForm.controls.DeliveryDate.value,
          item.DeliveryDate
        ) &&
        this.checkFilterData(this.searchForm.controls.PONo.value, item.PONo) &&
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
          this.searchForm.controls.BBSNo.value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.searchForm.controls.BBSDesc.value,
          item.BBSDesc
        ) &&
        this.checkFilterData(this.searchForm.controls.DONo.value, item.DONo) &&
        this.checkFilterData(this.searchForm.controls.DONo.value, item.DONo) &&
        this.checkFilterData(
          this.searchForm.controls.LoadWT.value,
          item.LoadWT
        ) &&
        this.checkFilterData(
          this.searchForm.controls.VehicleNo.value,
          item.VehicleNo
        ) &&
        this.checkFilterData(
          this.searchForm.controls.LoadQty.value,
          item.LoadQty
        ) &&
        this.checkFilterData(
          this.searchForm.controls.OutTime.value,
          item.OutTime
        ) &&
        this.checkFilterData(
          this.searchForm.controls.ProjectTitle.value,
          item.ProjectTitle
        ) &&
        this.checkFilterData(
          this.searchForm.controls.TransportMode.value,
          item.TransportMode
        ) &&
        this.getDateCompare(this.searchForm.controls.PODate.value, item.PODate)&&
        this.checkFilterData(
          this.searchForm.controls.Address.value,
          item.Address
        )&&
        this.checkFilterData(
          this.searchForm.controls.Gate.value,
          item.Gate
        )
    );
    // this.DeliveredOrderLoading = false;
    // if(this.searchForm.get('DeliveryDate')?.value){
    //   this.calculateWeight(this.deliveredorderarray);
    // }else{
    //   this.calculateWeight(JSON.parse(
    //     JSON.stringify(this.deliveredorderarray_backup)
    //   ))
    // }
    this.calculateWeight(this.deliveredorderarray);
  }
  setColVisibility(val: any, field: string) {
    let index = this.deliveredColumns.findIndex(
      (x: any) => x.controlName === field
    );
    this.deliveredColumns[index].isVisible = val;

    // let values = this.columnVisibiltyForm.value;
    // localStorage.setItem('draftVisibleColumns',JSON.stringify(values));
  }
  dropCol(event: any) {
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex + 1 <= this.fixedColumn &&
        event.currentIndex + 1 > this.fixedColumn
      ) {
        this.toastr.warning("Fixed columns can't be moved to normal columns!");
        // moveItemInArray(this.deliveredColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 1 > this.fixedColumn &&
        event.currentIndex + 1 <= this.fixedColumn
      ) {
        // moveItemInArray(this.deliveredColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to fixed columns!");
      } else {
        //let index= this.CheckCurrentIndex(event.currentIndex,this.deliveredColumns)

        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.deliveredColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.deliveredColumns
        );
        moveItemInArray(this.deliveredColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.deliveredColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.deliveredColumns
      );
      moveItemInArray(this.deliveredColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem(
      'deliveredColumns',
      JSON.stringify(this.deliveredColumns)
    );
  }
  getSeachDateForm(): FormGroup {
    const requiredDateControl = this.searchForm?.get('DeliveryDate')!;
    return requiredDateControl as FormGroup;
  }
  parseDate(dateString: any) {
    // Split the date string into parts
    console.log('dateString', dateString);
    const parts = dateString.trim().split('/');
    // Rearrange the parts into a format JavaScript recognizes
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    // Create a new Date object
    console.log('formattedDate', formattedDate);
    return new Date(formattedDate.trim());
  }
  parseDateRange(dateRangeString: string) {
    const dates = dateRangeString.trim().split('-');
    const startDate = moment(this.parseDate(dates[0]));
    const endDate = moment(this.parseDate(dates[1]));
    console.log('dateRangeString=>', startDate, endDate);
    return { startDate, endDate };
  }
  getDateCompare(dateToCompare: any, actualDate: any) {
    // let lReturn = false;
    console.log('getDateCompare=>', dateToCompare, actualDate);
    if (
      dateToCompare &&
      dateToCompare != '' &&
      !dateToCompare.includes('Invalid')
    ) {
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


  GetOrderCustomer(): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.CustomerList = response;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }
  GetOrderProjectsList(customerCode: any): void {
    //debugger;
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
  setDefalutDeliveryDateValue() {
    this.totalCount = '';
    let inputString = document
      .getElementById('DeliveryDateRange')
      ?.querySelector('input') as HTMLInputElement;
    if (inputString.value) {
      console.log('setDefalutDeliveryDateValue=>', inputString.value);
      const { startDate, endDate } = this.parseDateRange(inputString.value);
      this.searchForm
        .get('DeliveryDate')
        ?.setValue(
          moment(startDate).format('DD/MM/YYYY') +
            '-' +
            moment(endDate).format('DD/MM/YYYY')
        );
    } else {
      console.log('setDefalutDeliveryDateValue=>', inputString.placeholder);
      const { startDate, endDate } = this.parseDateRange(
        inputString.placeholder
      );
      this.searchForm
        .get('DeliveryDate')
        ?.setValue(
          moment(startDate).format('DD/MM/YYYY') +
            '-' +
            moment(endDate).format('DD/MM/YYYY')
        );
    }
  }

  private getOrderGridQueue$ = new Subject<{ customer: any; projects: any[] }>();
  
  GetOrderGridList(customerCode: any, projectCodes: any): void {
    // Add this function call to the queue
    this.getOrderGridQueue$.next({ customer: customerCode, projects: projectCodes });
  }

  private executeDeliveredGridList(customerCode: any, projectCodes: any[]): Observable<void> {
    return defer(() => {
      this.DeliveredOrderLoading = true;
      this.hideTable = false;

      // Reset states safely for each queued execution
      this.deliveredorderarray = [];
      this.deliveredorderarray_backup = [];
      this.multiSelect = 0;
      this.totalCount = '';
      this.CABtotalWeight = '0';
      this.MESHtotalWeight = '0';
      this.COREtotalWeight = '0';
      this.PREtotalWeight = '0';

      const allProjects = this.commonService.includeOptionalProjects;

      if (allProjects) {
        // Case: All projects in one API call
        return this.orderService.GetDeliveredGridList(customerCode, projectCodes[0], true).pipe(
          tap(response => {
            const temp = response;
            this.deliveredorderarray = temp;
            this.deliveredorderarray_backup = JSON.parse(JSON.stringify(temp));

            this.setDefalutDeliveryDateValue();
            this.ReloadLastSearch();

            console.log('Fetched delivered data (AllProjects):', temp);
          }),
          finalize(() => {
            this.DeliveredOrderLoading = false;
          }),
          catchError(err => {
            console.error('Error fetching delivered list (AllProjects)', err);
            this.DeliveredOrderLoading = false;
            return of();
          })
        );
      } else {
        // Case: Sequential fetch per project (queued safely)
        return from(projectCodes).pipe(
          concatMap(code =>
            this.orderService.GetDeliveredGridList(customerCode, code, false).pipe(
              tap(response => {
                const temp = response;
                this.deliveredorderarray = [...this.deliveredorderarray, ...temp];
                this.deliveredorderarray_backup = JSON.parse(
                  JSON.stringify(this.deliveredorderarray)
                );

                this.multiSelect++;
                console.log(`Fetched delivered orders for project ${code}`, temp);

                this.setDefalutDeliveryDateValue();
                this.ReloadLastSearch();
              }),
              catchError(err => {
                console.error(`Error fetching project ${code}`, err);
                this.multiSelect++;
                return of(); // continue queue
              })
            )
          ),
          finalize(() => {
            this.DeliveredOrderLoading = false;
            console.log(`Completed queued delivered list for: ${projectCodes.join(', ')}`);
          })
        );
      }
    });
  }

  
  multiSelect: number = 0;
  // GetOrderGridList(customerCode: any, projectCodes: any): void {
  //   debugger;
  //   console.log(
  //     'get data',
  //     document.getElementById('DeliveryDateRange')?.querySelector('input')
  //   );

  //   this.deliveredorderarray = [];

  //   this.deliveredorderarray_backup=[];

  //   this.totalCount = '';
  //   this.multiSelect = 0;
  //   if (customerCode != undefined && projectCodes.length > 0) {
  //     this.hideTable = false;
  //     this.DeliveredOrderLoading = true;

  //     this.totalCount = '';
  //     this.CABtotalWeight = '0';
  //     this.MESHtotalWeight = '0';
  //     this.COREtotalWeight = '0';
  //     this.PREtotalWeight = '0';

  //     let AllProjects = this.commonService.includeOptionalProjects;

  //     if (AllProjects) {
  //       this.orderService
  //         .GetDeliveredGridList(customerCode, projectCodes[0], true)
  //         .subscribe({
  //           next: (response) => {
  //             let temp = response;
  //             this.deliveredorderarray = temp;
  //             console.log('temp', temp);
  //             this.deliveredorderarray_backup = JSON.parse(
  //               JSON.stringify(this.deliveredorderarray)
  //             );
  //             // this.filterAllData();

  //             this.setDefalutDeliveryDateValue();
  //             // this.totalCount = this.deliveredorderarray.length;
  //             this.ReloadLastSearch();
  //           },
  //           error: (e) => {
  //             this.DeliveredOrderLoading = false;
  //           },
  //           complete: () => {
  //             // this.deliveredorderarray_backup = JSON.parse(
  //             //   JSON.stringify(this.deliveredorderarray)
  //             // );
  //             // if (this.isValueChanged) {
  //             // this.filterAllData();
  //             // }
  //             this.DeliveredOrderLoading = false;
  //           },
  //         });
  //     } else {
  //       for (let i = 0; i < projectCodes.length; i++) {
  //         this.orderService
  //           .GetDeliveredGridList(customerCode, projectCodes[i], false)
  //           .subscribe({
  //             next: (response) => {
  //               let temp = response;
  //               // temp = temp(
  //               //   (x: { rowSelected: boolean }) => (x.rowSelected = false)
  //               // );
  //               // for (let i = 0; i < response.length; i++) {
  //               //   temp[i].rowSelected = false;
  //               // }
  //               this.deliveredorderarray = [...this.deliveredorderarray, ...temp];
  //               console.log('temp', temp);
  //               this.deliveredorderarray_backup = JSON.parse(
  //                 JSON.stringify(this.deliveredorderarray)
  //               );
  //               // this.filterAllData();

  //               this.multiSelect = this.multiSelect + 1;

  //               if (this.multiSelect == projectCodes.length) {
  //                 this.DeliveredOrderLoading = false;
  //               }
  //               this.setDefalutDeliveryDateValue();
  //               // this.totalCount = this.deliveredorderarray.length;
  //               this.ReloadLastSearch();

  //             },
  //             error: (e) => {
  //               this.multiSelect = this.multiSelect + 1;

  //               if (this.multiSelect == projectCodes.length) {
  //                 this.DeliveredOrderLoading = false;
  //               }
  //             },
  //             complete: () => {},
  //           });
  //       }
  //     }
  //   } else {
  //     this.deliveredorderarray = [];
  //     this.deliveredorderarray_backup = [];
  //   }
  // }
  getTotalWeight(producttype: any) {
    let totalweight = 0;
    for (let i = 0; i < this.deliveredorderarray.length; i++) {
      if (this.deliveredorderarray[i].ProdType == producttype) {
        totalweight =
          totalweight + Number(this.deliveredorderarray[i].OrderWeight);
      }
    }
    return totalweight;
  }

  toggleSortingOrder(columnname: string, actualColName: any) {
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (columnname == 'LoadQty' || columnname == 'LoadWT') {
        this.deliveredorderarray.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else if (columnname == 'DeliveryDate') {
        this.deliveredorderarray.sort(
          (a, b) =>
            new Date(a[actualColName]).getTime() -
            new Date(b[actualColName]).getTime()
        );
      } else {
        this.deliveredorderarray.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'LoadQty' || columnname == 'LoadWT') {
        this.deliveredorderarray.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else if (columnname == 'DeliveryDate') {
        this.deliveredorderarray.sort(
          (a, b) =>
            new Date(b[actualColName]).getTime() -
            new Date(a[actualColName]).getTime()
        );
      } else {
        this.deliveredorderarray.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }

    // this.sortItems(columnname);
  }
  convertToAscii(inputString: string) {
    let asciiValues = '';
    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      asciiValues = asciiValues + charCode;
    }
    return Number(asciiValues);
  }

  open_doc(item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      DeliveredOrderDocumentComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.CustomerCode = item.CustomerCode;
    modalRef.componentInstance.ProjectCode = item.ProjectCode;
    modalRef.componentInstance.DONo = item.DONo;
    modalRef.componentInstance.DODate = item.DeliveryDate;
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

    localStorage.setItem('lastRow_Delivered', JSON.stringify(row));
    localStorage.setItem(
      'lastSearch_Delivered',
      JSON.stringify(this.searchForm.value)
    );
    console.log('row selected', row);

    // let obj = {
    //   pCustomerCode: row.CustomerCode,
    //   pProjectCode: row.ProjectCode,
    //   pSelectedCount: 0,
    //   pSelectedSE: '',
    //   pSelectedProd: '',
    //   pSelectedWT: '',
    //   pSelectedQty: '',
    //   pSelectedPostID: '',
    //   pSelectedScheduled: '',
    //   pSelectedWBS1: '',
    //   pSelectedWBS2: '',
    //   pSelectedWBS3: '',
    //   pWBS1: '',
    //   pWBS2: '',
    //   pWBS3: '',
    //   pOrderNo: row.OrderNo.toString(),
    // };

    // this.createSharedService.viewOrderSummaryList = obj;
    // this.createSharedService.viewData = true;

    let response: any = await this.GetOrderSet(row.DigiOSID, false);

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
        if (row.DigiOSID == response[i].OrderNo) {
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
    // localStorage.setItem(
    //   'CreateDataProcess',
    //   JSON.stringify(tempOrderSummaryList)
    // );
    this.UpdateAddressCode(row.OrderNo); // Udpates the AddressCode in the Dropdown of the selected Order.

    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    let UpdatedProjects = this.dropdown.UpdateProjectCodeSequence(row.ProjectCode);
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
  getMinHeightIncoming(id: string) {
    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
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

  SetDefaultDateRange() {
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - 8);

    let rangeStart: any = tempDate.toLocaleDateString();
    let rangeEnd: any = new Date().toLocaleDateString();

    rangeEnd = this.datePipe.transform(rangeEnd, 'dd/MM/yyyy');
    rangeStart = this.datePipe.transform(rangeStart, 'dd/MM/yyyy');

    console.log('rangeEnd', rangeEnd, rangeStart);
    this.searchForm.get('DeliveryDate')?.setValue(rangeStart + '-' + rangeEnd);

    let obj = document.getElementById('DeliveryDateRange');
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
  }
  onWidthChange(obj: any) {
    this.deliveredColumns[obj.index].resizeWidth = obj.width;
    this.SaveColumnsSetting();
  }
  getRightWidthTest(element: HTMLElement, j: number) {
    let width = this.getAllPreviousSiblings(element);
    // console.log('previousSibling=>', width);

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
    this.deliveredColumns[index].left = width;
  }
  getLeftOfTable(index: number) {
    console.log('get called?', this.deliveredColumns[index].left);
    return this.deliveredColumns[index].left;
  }
  calculateWeight(response: any) {
    let temp = response;
    this.CABtotalWeight = this.getTotalWeight('CAB').toFixed(3);
    this.MESHtotalWeight = this.getTotalWeight('MESH').toFixed(3);
    this.COREtotalWeight = this.getTotalWeight('CORE CAGE').toFixed(3);
    this.PREtotalWeight = this.getTotalWeight('PRE CAGE').toFixed(3);
    // this.wbspostingarray = this.wbspostingarray.concat(response);
    let lPrd: any[] = [];
    let lTon: any[] = [];
    let lDisMsg = '';
    if (response.length > 0) {
      lDisMsg += response.length;
      for (var i = 0; i < response.length; i++) {
        temp[i].rowSelected = false;
        if (
          response[i].ProdType != null &&
          response[i].ProdType.length > 0 &&
          response[i].LoadWT != null &&
          response[i].LoadWT > 0
        ) {
          var lProdType = response[i].ProdType;
          if (lProdType.indexOf('CUT-TO-SIZE-MESH') >= 0) {
            lProdType = 'MESH';
          } else if (lProdType.indexOf('STIRRUP-LINK-MESH') >= 0) {
            lProdType = 'MESH';
          } else if (lProdType.indexOf('COLUMN-LINK-MESH') >= 0) {
            lProdType = 'MESH';
          }
          if (lPrd.length == 0) {
            lPrd.push(lProdType);
            lTon.push(response[i].LoadWT);
          } else {
            var lFound = -1;
            for (var j = 0; j < lPrd.length; j++) {
              if (lPrd[j] == lProdType) {
                lFound = j;
                break;
              }
            }
            if (lFound == -1) {
              lPrd.push(lProdType);
              lTon.push(response[i].LoadWT);
            } else {
              lTon[j] = (
                parseFloat(lTon[j]) + parseFloat(response[i].LoadWT)
              ).toFixed(3);
            }
          }
        }
      }
      if (lPrd.length > 0) {
        for (var k = 0; k < lPrd.length; k++) {
          if (lTon[k] != null && lTon[k] > 0) {
            lDisMsg = lDisMsg + ' / ' + lPrd[k] + ': ' + lTon[k];
          }
        }
        lDisMsg = lDisMsg + ' (MT)';
        lDisMsg.substring(1, lDisMsg.length);
      }
      this.totalCount = lDisMsg;
    } else {
      //this.totalCount = 'Total Delivered Orders: 0';
    }
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

  SaveColumnsSetting() {
    localStorage.setItem(
      'deliveredColumns',
      JSON.stringify(this.deliveredColumns)
    );
  }

  UpdateFixedColumns(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('deliveredFixedColumns', pVal);
  }

  UpdateDateFormat(pDate: any) {
    /**Format of pDate -> DD/MM/YYYY */
    if (pDate) {
      let lDay = pDate.split('/')[0];
      let lMonth = pDate.split('/')[1];
      let lYear = pDate.split('/')[2];

      return lYear + '-' + lMonth + '-' + lDay;
    }
    return '';
  }

  GetExportDeliDate() {
    let lDate: any = this.searchForm.controls.DeliveryDate.value;
    if (lDate) {
      lDate = lDate.split('-');
      let lStart = lDate[0];
      let lEnd = lDate[1];

      lStart = this.UpdateDateFormat(lStart);
      lEnd = this.UpdateDateFormat(lEnd);

      let lReturn = lStart + ' to ' + lEnd;
      return lReturn;
    }
    return '';
  }
  private toastrRef: any; // Reference to the persistent Toastr notification
  ExportDeliveredOrdersToExcel() {
    let customerCode = this.dropdown.getCustomerCode();
    let projectCodes: any = this.dropdown.getProjectCode();
    let RDate = this.GetExportDeliDate();
    //":"2024-09-11 to 2024-09-18"

    // this.GetExportDeliDate();
    this.DeliveredOrderLoading= true;
    projectCodes = projectCodes.join(',');
    this.toastrRef = this.toastr.info('Downlaod Started! Please Wait.', '', {
      timeOut: 0,
      extendedTimeOut: 0,
      tapToDismiss: false,
      disableTimeOut: true,
    });
    this.orderService
      .ExportDeliveredOrdersToExcel(customerCode, projectCodes, RDate)
      .subscribe({
        next: (response) => {
          console.log('Success');

          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'Delivered Orders List-' + '.xlsx';
          a.click();
          this.DeliveredOrderLoading = false;
          this.toastr.clear(this.toastrRef.toastId);
        this.toastr.success('Downlaod Completed!!');
        },
        error: () => {
          this.DeliveredOrderLoading = false;
          this.toastr.clear(this.toastrRef.toastId);
          this.toastr.error('Downlaod Failed!!');
        },
        complete: () => {
          this.DeliveredOrderLoading = false;
        },
      });
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

  selectRow(row: any, dataList: any[], event: MouseEvent) {
    // this.myTable.nativeElement.tabIndex = 0;
    debugger;
    console.log('here', row);
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
      let nIndex = dataList.findIndex((x) => x == row);

      if (nIndex > lIndex) {
        // Add all the rows between the two indexes.
        for (let i = lIndex; i < nIndex + 1; i++) {
          dataList[i].rowSelected = true;
          this.selectedRow.push(dataList[i]);
        }
        this.lastSelctedRow = nIndex;
      }
    } else {
      let lIndex = dataList.findIndex((x) => x == row);
      // The index of the currently selected row in the
      this.lastSelctedRow = lIndex;
      this.firstSelectedRow = lIndex;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey) {
      // Shift + ArrowDown
      if (event.key === 'ArrowDown') {
        if (this.lastPress == 'up') {
          this.deliveredorderarray[this.lastSelctedRow].rowSelected =
            !this.deliveredorderarray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow < this.deliveredorderarray.length) {
          this.lastSelctedRow += 1;
          this.deliveredorderarray[this.lastSelctedRow].rowSelected =
            !this.deliveredorderarray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'down';
      }

      // Shift + ArrowUp
      if (event.key === 'ArrowUp') {
        // Case 1: If shrinking upwards, deselect the last selected row

        // Case 2: If expanding upwards, select rows above firstSelectedRow

        if (this.lastPress == 'down') {
          this.deliveredorderarray[this.lastSelctedRow].rowSelected =
            !this.deliveredorderarray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow > 0) {
          this.lastSelctedRow -= 1;
          this.deliveredorderarray[this.lastSelctedRow].rowSelected =
            !this.deliveredorderarray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'up';
      }

      this.scrollToSelectedRow(this.deliveredorderarray);
    }
  }

  findMax(a: number, b: number): number {
    return a > b ? a : b;
  }
  findMin(a: number, b: number): number {
    return a < b ? a : b;
  }
  SelectAllChecked(item: any) {
    this.deliveredorderarray.forEach((element) => {
      if (element.rowSelected && item !== element) {
        element.isSelected = true;
      }
    });
  }
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
    this.scrollToRow(this.viewPort!, selectedRowIndex + 1, ldataList.length);
  }

  showViewDetails(pItem: any): boolean {
    if (
      pItem.DigiOSID == null ||
      pItem.DigiOSID == 0 ||
      pItem.DigiOSID == '' ||
      pItem.DigiOSID == '0'
    ) {
      return false;
    }
    return true;
  }

  SetDelayForLoader() {
    if(!this.pSearchRefreshFlag){
      let lClearFlag = this.commonService.clearDateRangeLoader;
      if (lClearFlag == true) {
        this.DeliveredOrderLoading = true;
      }
      setTimeout(() => {
        this.filterAllData();
        if (lClearFlag == true) {
          this.commonService.clearDateRangeLoader = false;
          this.DeliveredOrderLoading = false;
        }
      }, 1 * 1000);
    }
    this.pSearchRefreshFlag = false;
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
      this.deliveredorderarray = [];
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
    this.deliveredorderForm.controls['project'].patchValue(this.SelectedProjectCodes);
    this.changeproject(this.SelectedProjectCodes);
  }

  clearAllProject() {
    this.hideTable = true;
    this.SelectedProjectCodes = [];
    this.deliveredorderarray = [];
    this.changeproject(this.SelectedProjectCodes);
  }


  pSearchRefreshFlag: boolean = false;
  ReloadLastSearch() {
    let lItem: any = localStorage.getItem('lastRow_Delivered');
    let lData: any = localStorage.getItem('lastSearch_Delivered');
    if (lItem) {
      lItem = JSON.parse(lItem);
      lData = JSON.parse(lData);

      this.pSearchRefreshFlag = true;
      this.populateFormFromJson(lData);
      this.filterAllData();

      setTimeout(() => {
        this.deliveredorderarray.forEach((x) => {
          if (x.DigiOSID === lItem.DigiOSID) {
            x.rowSelected = true;
          }
        });
      }, 1 * 500);
    }

    localStorage.removeItem('lastRow_Delivered');
    localStorage.removeItem('lastSearch_Delivered');
  }

  // New function to populate form from JSON
  populateFormFromJson(jsonData: any): void {
    try {
      // Ensure jsonData is an object
      if (!jsonData || typeof jsonData !== 'object') {
        console.error('Invalid JSON data provided');
        return;
      }

      // Use patchValue to update form controls (partial updates are allowed)
      this.searchForm.patchValue({
        OrderNo: jsonData.OrderNo || '',
        PONo: jsonData.PONo || '',
        WBS1: jsonData.WBS1 || '',
        WBS2: jsonData.WBS2 || '',
        WBS3: jsonData.WBS3 || '',
        ProdType: jsonData.ProdType || '',
        StructureElement: jsonData.StructureElement || '',
        BBSNo: jsonData.BBSNo || '',
        BBSDesc: jsonData.BBSDesc || '',
        DeliveryDate: jsonData.DeliveryDate || '',
        OutTime: jsonData.OutTime || '',
        LoadQty: jsonData.LoadQty || '',
        LoadWT: jsonData.LoadWT || '',
        VehicleNo: jsonData.VehicleNo || '',
        DONo: jsonData.DONo || '',
        SubmittedBy: jsonData.SubmittedBy || '',
        TransportMode: jsonData.TransportMode || '',
        ProjectTitle: jsonData.ProjectTitle || '',
        PODate: jsonData.PODate || '',
        Address: jsonData.Address || '',
        Gate: jsonData.Gate || ''
      });

      console.log('Form populated with JSON data:', this.searchForm.value);
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }

  UpdateColumnsWithGateAddresss() {
    console.log('activeColumns', this.deliveredColumns);

    let lAddressIndex = this.deliveredColumns.findIndex(
      (element) => element.controlName === 'Address'
    );
    let lGateIndex = this.deliveredColumns.findIndex(
      (element) => element.controlName === 'Gate'
    );

    if (lAddressIndex == -1) {
      let lObj = {
        controlName: 'Address',
        displayName: 'Address',
        chineseDisplayName: '地址',
        colName: 'Address',
        field: 'Address',
        placeholder: 'Search Address',
        isVisible: true,
        width: '150',
        resizeWidth: '100',
        left: '0',
      };
      this.deliveredColumns.push(lObj);
    }

    if (lGateIndex == -1) {
      let lObj = {
        controlName: 'Gate',
        displayName: 'Gate',
        chineseDisplayName: '门',
        colName: 'Gate',
        field: 'Gate',
        placeholder: 'Search Gate',
        isVisible: true,
        width: '150',
        resizeWidth: '100',
        left: '0',
      };
      this.deliveredColumns.push(lObj);
    }
    this.SaveColumnsSetting();
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
