import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
  ElementRef,
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
import { BehaviorSubject, catchError, concatMap, defer, finalize, from, Observable, of, Subject, Subscription, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { OrderService } from '../orders.service';
// import { ActiveOrderArray } from 'src/app/Model/activeorderarray';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { BatchChangeStatusModel } from 'src/app/Model/BatchChangeStatusModel';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { LoginService } from 'src/app/services/login.service';
import { start } from '@popperjs/core';
import { TrackStatusComponent } from './track-status/track-status.component';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import {
  CdkDragEnd,
  CdkDragStart,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import moment from 'moment';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ActiveOrderDetailsComponent } from './active-oreer-details/active-order-details/active-order-details.component';

// import { MatInput } from '@angular/material';

@Component({
  selector: 'app-activeorder',
  templateUrl: './activeorder.component.html',
  styleUrls: ['./activeorder.component.css'],
})
export class activeorderComponent implements OnInit {
  @ViewChild('scrollViewport', { static: false })
  public viewPort: CdkVirtualScrollViewport | undefined;
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
  CustomerList: any = [];

  istoggel: boolean = false;

  hideTable: boolean = true;
  loadingData = false;
  activeorderarray: any[] = [];
  activeorderarray_backup: any[] = [];
  isExpand: boolean = false;
  toggleFilters = true;
  ProjectList: any[] = [];
  SelectedProjectCodes: any[] = [];

  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;
  Note: string = '';

  tableWidth: number = 1500;

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
  SubmitBy: any;
  PODate: any;
  Tonnage: any;
  SubmittedBy: any;
  CreatedBy: any;
  ProjectTitle: any;
  Address: any;
  Gate: any;
  OrderStatus: any;

  isAscending: boolean = false;
  currentSortingColumn: string = '';

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
  showSubmitBy: boolean = true;
  showPODate: boolean = false;
  showTonnage: boolean = true;
  showSubmittedBy: boolean = false;
  showCreatedBy: boolean = false;
  showProjectTitle: boolean = false;
  showAddress: boolean = false;
  showGate: boolean = false;
  showOrderStatus: boolean = true;

  totalCount: string = '';
  CABtotalWeight: string = '0';
  MESHtotalWeight: string = '0';
  COREtotalWeight: string = '0';
  PREtotalWeight: string = '0';

  fixedColumn: number = 0;
  multiSelect: number = 0;

  ActiveOrderLoading: boolean = false;

  showApproveButton: boolean = false;
  showSubmitButton: boolean = false;
  showRejectButton: boolean = false;
  showNote: boolean = false;
  showWithdrawButton: boolean = false;
  showSendButton: boolean = false;

  FixedCoulmnList: any[] = [];
  activeColumns: HeaderColumn[] = [];

  searchForm: FormGroup;
  top: number = 0;
  right: number = 0;
  dateInputName: string = '';
  isOpen: boolean = false;
  defaultFrom = new Date();
  defaultTo = new Date();
  clearInput: number = 0;
  selectedRowIndex: any;

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
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private createSharedService: CreateordersharedserviceService,
    private processsharedserviceService: ProcessSharedServiceService,
    private loginService: LoginService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService
  ) {
    // this.reloadSubscription = this.reloadService.reloadComponent.subscribe(() => {
    //   this.reload();
    // });

    this.activeorderForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      wbs1: new FormControl('', Validators.required),
      wbs2: new FormControl('', Validators.required),
      wbs3: new FormControl('', Validators.required),
      po: new FormControl('', Validators.required),
      podate: new FormControl('', Validators.required),
      requireddate: new FormControl('', Validators.required),
      isinclude: new FormControl('', Validators.required),
    });
    this.searchForm = this.formBuilder.group({
      OrderNo: [''],
      PONo: [''],
      dateRangeRequired: [''],
      dateRangeDelivery: [''],
      poDateRange: [''],
      submitByDateRange: [''],
      createByDateRange: [''],
      WBS1: [''],
      WBS2: [''],
      WBS3: [''],
      StructureElement: [''],
      ProdType: [''],
      BBSNo: [''],
      BBSDesc: [''],
      OrderWeight: [''],
      OrderStatus: [''],
      projTitle: [''],
      Address: [''],
      Gate: ['']
    });

    this.getOrderGridQueue$.pipe(concatMap(req => this.executeActiveGridList(req.customer, req.projects)))
    .subscribe({
      next: () => console.log('Queued executeActiveGridList completed'),
      error: (err) => console.error('Queued executeActiveGridList error:', err),
    });
  }

  ngOnInit() {
    this.commonService.changeTitle('Active Orders | ODOS');

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
      this.activeorderForm.controls['customer'].patchValue(lCustomerCode);
      this.ProjectList = []; // When the Customer Code changes, auto clear the project list.
      this.SelectedProjectCodes = []; // When the Customer Code changes, auto clear the selected projectcodes.
      this.activeorderForm.controls['project'].patchValue(
        this.SelectedProjectCodes
      ); // SelectedProjectCodes value updated in the form.
      this.activeorderarray = []; // Table data is also cleared on customer change.
      this.Note = ' ';
    });

    this.reloadService.reload$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      // this.CustomerCode = lCustomerCode;
      this.activeorderForm.controls['customer'].patchValue(lCustomerCode);

      let lProjectCodes = this.dropdown.getProjectCode(); // Refresh the selected Project Codes.
      this.SelectedProjectCodes = lProjectCodes;
      this.activeorderForm.controls['project'].patchValue(lProjectCodes);

      // Reset the search forms to the default
      this.searchForm.reset();
      this.searchForm.controls['OrderNo'].patchValue('');
      this.searchForm.controls['PONo'].patchValue('');
      this.searchForm.controls['dateRangeRequired'].patchValue('');
      this.searchForm.controls['dateRangeDelivery'].patchValue('');
      this.searchForm.controls['poDateRange'].patchValue('');
      this.searchForm.controls['submitByDateRange'].patchValue('');
      this.searchForm.controls['createByDateRange'].patchValue('');
      this.searchForm.controls['WBS1'].patchValue('');
      this.searchForm.controls['WBS2'].patchValue('');
      this.searchForm.controls['WBS3'].patchValue('');
      this.searchForm.controls['StructureElement'].patchValue('');
      this.searchForm.controls['ProdType'].patchValue('');
      this.searchForm.controls['BBSNo'].patchValue('');
      this.searchForm.controls['Address'].patchValue('');
      this.searchForm.controls['Gate'].patchValue('');

      if (data === 'Active Orders') {
        this.Loaddata(); // Refresh the Table Data based on the selected Customer & Project Codes.
      }
    });

    this.reloadService.reloadAddressList$.subscribe((data) => {
      if (this.loginService.addressList_Ordering) {
        this.AddressList = this.loginService.addressList_Ordering;
      }
    });

    this.reloadService.reloadAddressCodeMobile$.subscribe((data) => {
      let lAddressCode = this.dropdown.getAddressList(); // Refresh the selected Customer Code.
      this.SelectedAddressCode = lAddressCode;
      this.activeorderForm.controls['address'].patchValue(lAddressCode);
    });



    // LOADING DATA
    if (localStorage.getItem('activeFixedColumns')) {
      this.fixedColumn = JSON.parse(
        localStorage.getItem('activeFixedColumns')!
      );
    }
    if (localStorage.getItem('activeColumns')) {
      this.activeColumns = JSON.parse(localStorage.getItem('activeColumns')!);
      // if(this.activeColumns[0].resizeWidth=='0'){
      for (let i = 0; i < this.activeColumns.length; i++) {
        if (this.activeColumns[i].resizeWidth == '0') {
          this.activeColumns = [
            {
              controlName: 'OrderNo',
              displayName: ' SNo.',
              chineseDisplayName: '序号',
              field: 'SSNO',
              colName: 'OrderNo',
              placeholder: 'Search So',
              isVisible: true,
              width: '150',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'PONo',
              displayName: 'PO NO',
              chineseDisplayName: '订单号码',
              colName: 'PONo',
              field: 'PONo',
              placeholder: 'Search PONumber',
              isVisible: true,
              width: '150',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'dateRangeRequired',
              displayName: 'Required Date',
              chineseDisplayName: '交货日期',
              colName: 'RequiredDate',
              field: 'RequiredDate',
              placeholder: 'Search Required Date',
              isVisible: true,
              width: '150',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'dateRangeDelivery',
              displayName: 'Plan Delivery Date',
              chineseDisplayName: '计划交货日期',
              colName: 'PlanDeliveryDate',
              field: 'PlanDeliveryDate',
              placeholder: 'Search Plan Delivery Date',
              isVisible: true,
              width: '150',
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
              width: '100',
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
              width: '100',
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
              width: '100',
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
              width: '100',
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
              width: '100',
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
              width: '150',
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
              width: '150',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'poDateRange',
              displayName: 'PO Date',
              chineseDisplayName: '订单日期',
              colName: 'PODate',
              field: 'podate',
              placeholder: 'Search PO Date',
              isVisible: true,
              width: '150',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'OrderWeight',
              displayName: 'Tonnage',
              chineseDisplayName: '重量(吨)',
              colName: 'OrderWeight',
              field: 'Tonnage',
              placeholder: 'Search Tonnage',
              isVisible: true,
              width: '100',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'submitByDateRange',
              displayName: 'Submitted By',
              chineseDisplayName: '提交者',
              colName: 'SubmittedBy',
              field: 'SubmitBy',
              placeholder: 'Search Submitted By',
              isVisible: true,
              width: '150',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'createByDateRange',
              displayName: 'Created By',
              chineseDisplayName: '创建者',
              colName: 'DataEnteredBy',
              field: 'createby',
              placeholder: 'Search Created By',
              isVisible: true,
              width: '100',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'OrderStatus',
              displayName: 'Order Status',
              chineseDisplayName: '订单状态',
              colName: 'OrderStatus',
              field: 'OrderStatus',
              placeholder: 'Search OrderStatus',
              isVisible: true,
              width: '100',
              resizeWidth: '100',
              left: '0',
            },
            {
              controlName: 'projTitle',
              displayName: 'Project Title',
              chineseDisplayName: '工程项目',
              colName: 'ProjectTitle',
              field: 'projtitle',
              placeholder: 'Search Project',
              isVisible: true,
              width: '150',
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
              width: '150',
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
              width: '150',
              resizeWidth: '100',
              left: '0',
            },
          ];
        }
      }
    } else {
      this.activeColumns = [
        {
          controlName: 'OrderNo',
          displayName: ' SNo.',
          chineseDisplayName: '序号',
          field: 'SSNO',
          colName: 'OrderNo',
          placeholder: 'Search So',
          isVisible: true,
          width: '150',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'PONo',
          displayName: 'PO NO',
          chineseDisplayName: '订单号码',
          colName: 'PONo',
          field: 'PONo',
          placeholder: 'Search PONumber',
          isVisible: true,
          width: '150',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'dateRangeRequired',
          displayName: 'Required Date',
          chineseDisplayName: '交货日期',
          colName: 'RequiredDate',
          field: 'RequiredDate',
          placeholder: 'Search Required Date',
          isVisible: true,
          width: '150',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'dateRangeDelivery',
          displayName: 'Plan Delivery Date',
          chineseDisplayName: '计划交货日期',
          colName: 'PlanDeliveryDate',
          field: 'PlanDeliveryDate',
          placeholder: 'Search Plan Delivery Date',
          isVisible: true,
          width: '150',
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
          width: '100',
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
          width: '100',
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
          width: '100',
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
          width: '100',
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
          width: '100',
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
          width: '150',
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
          width: '150',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'poDateRange',
          displayName: 'PO Date',
          chineseDisplayName: '订单日期',
          colName: 'PODate',
          field: 'podate',
          placeholder: 'Search PO Date',
          isVisible: true,
          width: '150',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'OrderWeight',
          displayName: 'Tonnage',
          chineseDisplayName: '重量(吨)',
          colName: 'OrderWeight',
          field: 'Tonnage',
          placeholder: 'Search Tonnage',
          isVisible: true,
          width: '100',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'submitByDateRange',
          displayName: 'Submitted By',
          chineseDisplayName: '提交者',
          colName: 'SubmittedBy',
          field: 'SubmitBy',
          placeholder: 'Search Submitted By',
          isVisible: true,
          width: '150',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'createByDateRange',
          displayName: 'Created By',
          chineseDisplayName: '创建者',
          colName: 'DataEnteredBy',
          field: 'createby',
          placeholder: 'Search Created By',
          isVisible: true,
          width: '100',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'OrderStatus',
          displayName: 'Order Status',
          chineseDisplayName: '订单状态',
          colName: 'OrderStatus',
          field: 'OrderStatus',
          placeholder: 'Search OrderStatus',
          isVisible: true,
          width: '100',
          resizeWidth: '100',
          left: '0',
        },
        {
          controlName: 'projTitle',
          displayName: 'Project Title',
          chineseDisplayName: '工程项目',
          colName: 'ProjectTitle',
          field: 'projtitle',
          placeholder: 'Search Project',
          isVisible: true,
          width: '150',
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
          width: '150',
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
          width: '150',
          resizeWidth: '100',
          left: '0',
        },
      ];
    }

    this.searchForm.valueChanges.subscribe((newValue) => {
      if (
        newValue.dateRangeRequired.includes('Invalid') ||
        newValue.dateRangeDelivery.includes('Invalid') ||
        newValue.poDateRange.includes('Invalid')
      ) {
        //this.loading = true;
        //this.filterAllData();
        this.SetDelayForLoader();
        //this.loading = false;
      } else {
        this.filterAllData();
      }
    });
    if (this.loginService.customerList_Ordering) {
      this.CustomerList = this.loginService.customerList_Ordering;
    }
    if (this.loginService.projectList_Ordering) {
      this.ProjectList = this.loginService.projectList_Ordering;
    }
    if (this.loginService.addressList_Ordering) {
      this.AddressList = this.loginService.addressList_Ordering;
    }

    this.activeorderForm.controls['customer'].patchValue(
      this.dropdown.getCustomerCode()
    );
    this.SelectedProjectCodes = this.dropdown.getProjectCode();
    this.activeorderForm.controls['project'].patchValue(
      this.SelectedProjectCodes
    );
    this.SelectedAddressCode = this.dropdown.getAddressList();
    if (this.SelectedAddressCode) {
      this.activeorderForm.controls['address'].patchValue(
        this.SelectedAddressCode
      );
    }

    this.Loaddata();
    // this.GetOrderCustomer();
    // this.GetOrderProjectsList(this.activeorderForm.controls['customer'].value);
    // this.GetOrderGridList(this.activeorderForm.controls['customer'].value, this.SelectedProjectCodes)
    this.UpdateColumnsWithGateAddresss();
  }
  Loaddata() {
    // this.GetOrderCustomer();
    // this.GetOrderProjectsList(this.activeorderForm.controls['customer'].value);
    this.GetOrderGridList(
      this.activeorderForm.controls['customer'].value,
      this.SelectedProjectCodes
    );
  }

  showDetails(item: any) {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {
    //console.log(item.item_text);
    // //console.log(e.target.value);
    // //console.log(this.activeorderForm)

    //  let projecttName =e.target.value
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

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.hideTable = true;
    this.activeorderForm.reset();
  }

  // changestatus(iscreated:any,isdetailing:any,isposted:any,isreleased:any)
  // {
  //   this.Loaddata();
  //  this.iscreated=iscreated;
  //  this.isdetailing=isdetailing;
  //  this.isposted=isposted;
  //  this.isreleased=isreleased;

  // }

  download() {
    // let fileName = 'ActiveOrders';
    // const blob = new Blob(this.activeorderarray, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    // saveAs(blob, fileName + '.xlsx');
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
    // 'ispending':false,'isdeliverytoday':true, 'isnextday':false
    let currentDate = this.getTodayDate();
    let tomorrowDate = this.getTomorrowDate();
    // console.log('date:', tomorrowDate);
    //var color = '';
    var color = '';

    if (item.OrderStatus.indexOf('Pending Approval') >= 0) {
      color = '#fbccfc';
    } else if (item.Confirmed == 2) {
      color = '#c7e1ef';
    } else if (item.Confirmed == 1) {
      color = '#00b050';
    } else {
      color = 'white';
    }
    return color;
  }

  searchData() {
    //debugger;
    this.activeorderarray = JSON.parse(
      JSON.stringify(this.activeorderarray_backup)
    );

    if (this.OrderNumber != undefined && this.OrderNumber != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.OrderNo?.toLowerCase().includes(
        //   this.OrderNumber.trim().toLowerCase()
        //   )
        this.checkFilterData(this.OrderNumber, item.OrderNo)
      );
    }
    if (this.PONumber != undefined && this.PONumber != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
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
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.activeorderarray = this.activeorderarray.filter(
        (item) =>
          item.RequiredDate.replace(/-/g, '') <= this.EndReqDate &&
          item.RequiredDate.replace(/-/g, '') >= this.StartReqDate
      );
    }

    if (
      this.StartPlanDate != '' &&
      this.StartPlanDate != null &&
      this.EndPlanDate != '' &&
      this.EndPlanDate != null
    ) {
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.activeorderarray = this.activeorderarray.filter(
        (item) =>
          item.PlanDeliveryDate.replace(/-/g, '') <= this.EndPlanDate &&
          item.PlanDeliveryDate.replace(/-/g, '') >= this.StartPlanDate
      );
    }
    if (
      this.StartPODate != '' &&
      this.StartPODate != null &&
      this.EndPODate != '' &&
      this.EndPODate != null
    ) {
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.activeorderarray = this.activeorderarray.filter(
        (item) =>
          item.PODate.replace(/-/g, '') <= this.EndPODate &&
          item.PODate.replace(/-/g, '') >= this.StartPODate
      );
    }
    if (this.WBS1 != undefined && this.WBS1 != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.WBS1?.toLowerCase().includes(this.WBS1.trim().toLowerCase())
        this.checkFilterData(this.WBS1, item.WBS1)
      );
    }
    if (this.WBS2 != undefined && this.WBS2 != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.WBS2?.toLowerCase().includes(this.WBS2.trim().toLowerCase())
        this.checkFilterData(this.WBS2, item.WBS2)
      );
    }
    if (this.WBS3 != undefined && this.WBS3 != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.WBS3?.toLowerCase().includes(this.WBS3.trim().toLowerCase())
        this.checkFilterData(this.WBS3, item.WBS3)
      );
    }
    if (this.ProductType != undefined && this.ProductType != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.ProdType?.toLowerCase().includes(
        //   this.ProductType.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProductType, item.ProdType)
      );
    }
    if (this.StructureElement != undefined && this.StructureElement != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.StructureElement?.toLowerCase().includes(
        //   this.StructureElement.trim().toLowerCase()
        // )
        this.checkFilterData(this.StructureElement, item.StructureElement)
      );
    }
    if (this.BBSNo != undefined && this.BBSNo != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.BBSNo?.toLowerCase().includes(this.BBSNo.trim().toLowerCase())
        this.checkFilterData(this.BBSNo, item.BBSNo)
      );
    }
    if (this.BBSDesc != undefined && this.BBSDesc != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.BBSDesc?.toLowerCase().includes(this.BBSDesc.trim().toLowerCase())
        this.checkFilterData(this.BBSDesc, item.BBSDesc)
      );
    }
    if (this.SubmitBy != undefined && this.SubmitBy != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.SubmitBy?.toLowerCase().includes(this.SubmitBy.trim().toLowerCase())
        this.checkFilterData(this.SubmitBy, item.SubmitBy)
      );
    }
    if (this.PODate != undefined && this.PODate != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.PODate?.toLowerCase().includes(this.PODate.trim().toLowerCase())
        this.checkFilterData(this.PODate, item.PODate)
      );
    }
    if (this.Tonnage != undefined && this.Tonnage != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.OrderWeight?.toLowerCase().includes(
        //   this.Tonnage.trim().toLowerCase()
        // )
        this.checkFilterData(this.Tonnage, item.OrderWeight)
      );
    }
    if (this.SubmittedBy != undefined && this.SubmittedBy != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.SubmittedBy?.toLowerCase().includes(
        //   this.SubmittedBy.trim().toLowerCase()
        // )
        this.checkFilterData(this.SubmittedBy, item.SubmittedBy)
      );
    }
    if (this.CreatedBy != undefined && this.CreatedBy != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.DataEnteredBy?.toLowerCase().includes(
        //   this.CreatedBy.trim().toLowerCase()
        // )
        this.checkFilterData(this.CreatedBy, item.DataEnteredBy)
      );
    }
    if (this.ProjectTitle != undefined && this.ProjectTitle != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.ProjectTitle?.toLowerCase().includes(
        //   this.ProjectTitle.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProjectTitle, item.ProjectTitle)
      );
    }
    if (this.Address != undefined && this.Address != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.ProjectTitle?.toLowerCase().includes(
        //   this.ProjectTitle.trim().toLowerCase()
        // )
        this.checkFilterData(this.Address, item.Address)
      );
    }
    if (this.Gate != undefined && this.Gate != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.ProjectTitle?.toLowerCase().includes(
        //   this.ProjectTitle.trim().toLowerCase()
        // )
        this.checkFilterData(this.Gate, item.Gate)
      );
    }
    if (this.OrderStatus != undefined && this.OrderStatus != '') {
      this.activeorderarray = this.activeorderarray.filter((item) =>
        // item.OrderStatus?.toLowerCase().includes(
        //   this.OrderStatus.trim().toLowerCase()
        // )
        this.checkFilterData(this.OrderStatus, item.OrderStatus)
      );
    }
  }
  dateChange(date: any) {
    console.log(date.value);
    if (date.value == '') {
      this.activeorderarray = JSON.parse(
        JSON.stringify(this.activeorderarray_backup)
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

  reqdateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    this.StartReqDate = '';
    this.StartReqDate = '';
    //StartReqDate
    this.StartReqDate = dateRangeStart.value;
    this.StartReqDate = this.getDate(this.StartReqDate);
    //EndReqDate
    this.EndReqDate = dateRangeEnd.value;
    this.EndReqDate = this.getDate(this.EndReqDate);
    this.changeDetectorRef.detectChanges();

    console.log(this.StartReqDate);
    console.log(this.EndReqDate);
    if (this.StartReqDate != '' && this.EndReqDate != '') {
      this.searchData();
    }
    // this.filterData();
  }
  plandeliDateRangeChange(
    dateRangeStart1: HTMLInputElement,
    dateRangeEnd1: HTMLInputElement
  ) {
    this.StartPlanDate = '';
    this.StartPlanDate = '';
    //StartPlanDate
    this.StartPlanDate = dateRangeStart1.value;
    this.StartPlanDate = this.getDate(this.StartPlanDate);
    //EndReqDate
    this.EndPlanDate = dateRangeEnd1.value;
    this.EndPlanDate = this.getDate(this.EndPlanDate);
    this.changeDetectorRef.detectChanges();

    console.log('FirstDate', this.StartPlanDate);
    console.log('SEoncdDate', this.EndPlanDate);
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
    if (this.StartPODate == '') {
      if (this.POdateRange.controls.start.value) {
        this.StartPODate =
          this.POdateRange.controls.start.value.toLocaleDateString();
      }
    }
    this.StartPODate = this.getDate(this.StartPODate);
    //EndReqDate
    this.EndPODate = dateRangeEnd.value;
    if (this.EndPODate == '') {
      if (this.POdateRange.controls.end.value) {
        this.EndPODate =
          this.POdateRange.controls.end.value.toLocaleDateString();
      }
    }
    this.EndPODate = this.getDate(this.EndPODate);
    this.changeDetectorRef.detectChanges();

    console.log(this.StartPODate);
    console.log(this.EndPODate);
    if (this.StartPODate != '' && this.EndPODate != '') {
      this.searchData();
    }
    // this.filterData();
  }

  recordSelected(item: any, index: number) {
    console.log('item', item);
    this.activeorderarray[index].isSelected =
      !this.activeorderarray[index].isSelected;
    let tempList: any[] = [];
    for (let i = 0; i < this.activeorderarray.length; i++) {
      if (this.activeorderarray[i].isSelected) {
        tempList.push(this.activeorderarray[i]);
      }
    }

    this.ButtonDisplay(tempList);
  }

  ButtonDisplay(SelectedRows: any) {
    let lSubmitRight = this.commonService.Submission;
    var lCreated = 0;
    var lSubmitted = 0;
    var lSent = 0;
    var lOthers = 0;
    for (let i = 0; i < SelectedRows.length; i++) {
      if (SelectedRows[i].OrderStatus.indexOf('Pending Approval') >= 0) {
        lSent = lSent + 1;
      } else if (SelectedRows[i].OrderStatus.indexOf('Submitted') >= 0) {
        lSubmitted = lSubmitted + 1;
      } else if (SelectedRows[i].OrderStatus.indexOf('Created*') >= 0) {
        lCreated = lCreated + 1;
      } else {
        lOthers = lOthers + 1;
      }
    }
    if (lOthers > 0) {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = false;
      this.showNote = false;
      this.showSendButton = false;
    } else if (lSent > 0 && lSubmitted > 0) {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = false;
      this.showNote = false;
      this.showSendButton = false;
    } else if (lCreated > 0 && lSubmitted > 0) {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = false;
      this.showNote = false;
      this.showSendButton = false;
    } else if (lCreated > 0 && lSent > 0) {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = false;
      this.showNote = false;
      this.showSendButton = false;
    } else if (lSubmitted > 0 && lSubmitRight != 'Yes') {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = false;
      this.showNote = false;
      this.showSendButton = false;
    } else if (lSent > 0 && lSubmitRight == 'Yes') {
      this.showApproveButton = true;
      this.showSubmitButton = false;
      this.showRejectButton = true;
      this.showNote = true;
      this.showWithdrawButton = false;
      //this.showNote = false;
      this.showSendButton = false;
    } else if (lSent > 0 && lSubmitRight != 'Yes') {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = true;

      this.showSendButton = false;
    } else if (lSubmitted > 0 && lSubmitRight == 'Yes') {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = true;
      this.showNote = false;
      this.showSendButton = false;
    } else if (lCreated > 0 && lSubmitRight != 'Yes') {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = true;
      this.showNote = false;
      this.showSendButton = true;
    } else if (lCreated > 0 && lSubmitRight == 'Yes') {
      this.showApproveButton = false;
      this.showSubmitButton = true;
      this.showRejectButton = false;
      this.showWithdrawButton = true;
      this.showNote = false;
      this.showSendButton = false;
    } else {
      this.showApproveButton = false;
      this.showSubmitButton = false;
      this.showRejectButton = false;
      this.showWithdrawButton = false;
      this.showNote = false;
      this.showSendButton = false;
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

  private executeActiveGridList(customerCode: any, projectCodes: any[]): Observable<void> {
    return defer(() => {
      this.ActiveOrderLoading = true;
      this.hideTable = false;

      // Reset state cleanly
      this.activeorderarray = [];
      this.activeorderarray_backup = [];
      this.Note = ' ';
      this.totalCount = '';
      this.multiSelect = 0;
      this.CABtotalWeight = '0';
      this.MESHtotalWeight = '0';
      this.COREtotalWeight = '0';
      this.PREtotalWeight = '0';

      const allProjects = this.commonService.includeOptionalProjects;

      if (allProjects) {
        // --- All projects in one go ---
        return this.orderService.GetActiveOrderGridList(customerCode, projectCodes[0], true).pipe(
          tap(response => {
            const temp = response.map((r: any) => ({ ...r, rowSelected: false }));
            this.activeorderarray = temp;
            this.SetTotalOrderDis();

            console.log(`Fetched ${temp.length} active orders (AllProjects)`);

            this.activeorderarray_backup = JSON.parse(JSON.stringify(this.activeorderarray));
            this.ReloadLastSearch();
          }),
          finalize(() => {
            this.ActiveOrderLoading = false;
            console.log('Completed fetching Active Orders (AllProjects)');
          }),
          catchError(err => {
            console.error('Error fetching active orders (AllProjects)', err);
            this.ActiveOrderLoading = false;
            return of();
          })
        );
      } else {
        // --- Sequential per project ---
        return from(projectCodes).pipe(
          concatMap(code =>
            this.orderService.GetActiveOrderGridList(customerCode, code, false).pipe(
              tap(response => {
                const temp = response.map((r: any) => ({ ...r, rowSelected: false }));
                this.activeorderarray = [...this.activeorderarray, ...temp];
                this.multiSelect++;

                console.log(`Fetched ${temp.length} active orders for project ${code}`);
                this.SetTotalOrderDis();
              }),
              catchError(err => {
                console.error(`Error fetching active orders for ${code}`, err);
                this.multiSelect++;
                return of(); // continue queue
              })
            )
          ),
          finalize(() => {
            this.ActiveOrderLoading = false;
            this.activeorderarray_backup = JSON.parse(JSON.stringify(this.activeorderarray));
            this.ReloadLastSearch();
            console.log(`Completed queued Active Order run for projects: ${projectCodes.join(', ')}`);
          })
        );
      }
    });
  }


//   GetOrderGridList(customerCode: any, projectCodes: any): void {
//     this.activeorderarray = [];
//     this.Note = ' ';
//     if (customerCode != undefined && projectCodes.length > 0) {
//       this.hideTable = false;
//       this.ActiveOrderLoading = true;
//       this.totalCount = '';
//       this.CABtotalWeight = '0';
//       this.MESHtotalWeight = '0';
//       this.COREtotalWeight = '0';
//       this.PREtotalWeight = '0';
//       this.multiSelect = 0;
//       let AllProjects = this.commonService.includeOptionalProjects;
//       if(!AllProjects){
//       for (let i = 0; i < projectCodes.length; i++) {
//         this.orderService
//           .GetActiveOrderGridList(customerCode, projectCodes[i], false)
//           .subscribe({
//             next: (response) => {
//               let temp = response;
//               console.log('response', response);
//               for (let i = 0; i < response.length; i++) {
//                 temp[i].rowSelected = false;
//               }
//               this.activeorderarray = this.activeorderarray.concat(temp);
//               //this.totalCount = this.activeorderarray.length;
//               this.multiSelect = this.multiSelect + 1;
//               if (this.multiSelect == projectCodes.length) {
//                 this.ActiveOrderLoading = false;
//               }
//               this.SetTotalOrderDis();
//             },
//             error: (e) => {},
//             complete: () => {
//               this.activeorderarray_backup = JSON.parse(
//                 JSON.stringify(this.activeorderarray)
//               );
//               this.ReloadLastSearch();
//             },
//           });
//       }
//     }else{
//       this.orderService
//       .GetActiveOrderGridList(customerCode, projectCodes[0], true)
//       .subscribe({
//         next: (response) => {
//           let temp = response;
//           console.log('response', response);
//           for (let i = 0; i < response.length; i++) {
//             temp[i].rowSelected = false;
//           }
//           this.activeorderarray = this.activeorderarray.concat(temp);
//           this.ActiveOrderLoading = false;
//           this.SetTotalOrderDis();
//         },
//         error: (e) => {
//           this.ActiveOrderLoading = false;
//         },
//         complete: () => {
//           this.ActiveOrderLoading = false;
//           this.activeorderarray_backup = JSON.parse(
//             JSON.stringify(this.activeorderarray)
//           );
//           this.ReloadLastSearch();
//         },
//       });
//     }
//     }
//  }
  
  SetTotalOrderDis() {
    let lPrd: any[] = [];
    let lTon: any[] = [];

    for (let i = 0; i < this.activeorderarray.length; i++) {
      if (i == 41) {
        console.log('here');
      }
      var lProdType = this.activeorderarray[i].ProdType;
      if (lProdType.indexOf('CUT-TO-SIZE-MESH') >= 0) {
        lProdType = 'MESH';
      } else if (lProdType.indexOf('STIRRUP-LINK-MESH') >= 0) {
        lProdType = 'MESH';
      } else if (lProdType.indexOf('COLUMN-LINK-MESH') >= 0) {
        lProdType = 'MESH';
      }
      if (lPrd.length == 0) {
        lPrd.push(lProdType);
        lTon.push(this.activeorderarray[i].OrderWeight);
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
          lTon.push(this.activeorderarray[i].OrderWeight);
        } else {
          lTon[j] = Number(
            Number(lTon[j]) +
              Number(this.activeorderarray[i].OrderWeight.replaceAll(',', ''))
          ).toFixed(3);
          if (lTon[j] == 'NaN') {
            console.log('here');
          }
        }
      }
    }

    console.log('lTon', lTon);
    console.log('lPrd', lPrd);

    var lDisMsg = ' ' + this.activeorderarray.length;

    if (this.activeorderarray.length > 0) {
      for (var i = 0; i < this.activeorderarray.length; i++) {
        if (lTon[i] != null && lTon[i] > 0) {
          lDisMsg = lDisMsg + ' / ' + lPrd[i] + ' - ' + lTon[i];
        }
      }
      lDisMsg = lDisMsg + ' (ton)';
    }

    this.Note = lDisMsg;
  }

  getTotalWeight(producttype: any) {
    let totalweight = 0;
    for (let i = 0; i < this.activeorderarray.length; i++) {
      if (this.activeorderarray[i].ProdType == producttype) {
        totalweight =
          totalweight + Number(this.activeorderarray[i].OrderWeight);
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
    for (let i = 0; i < this.activeorderarray.length; i++) {
      let obj = {
        OrderNumber: this.activeorderarray[i].OrderNo,
        PONumber: this.activeorderarray[i].PONo,
        RequiredDate: this.activeorderarray[i].RequiredDate,
        PlanDeliverdate: '',
        WBS1: this.activeorderarray[i].WBS1,
        WBS2: this.activeorderarray[i].WBS2,
        WBS3: this.activeorderarray[i].WBS3,
        ProductType: this.activeorderarray[i].ProdType,
        StructureElement: this.activeorderarray[i].StructureElement,
        BBSNo: this.activeorderarray[i].BBSNo,
        BBSDesc: this.activeorderarray[i].BBSDesc,
        SubmitBy: this.activeorderarray[i].SubmitBy,
        OrderStatus: this.activeorderarray[i].OrderStatus,
        Address: this.activeorderarray[i].Address,
        Gate: this.activeorderarray[i].Gate,
      };
      listTodownload.push(obj);
    }
    // listTodownload = this.activeorderarray;
    this.name = 'ActiveOrderList';
    if (this.activeorderarray.length != 0) {
      const worksheet: XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(listTodownload);
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
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.name + '.xlsx';
    link.click();
  }

  toggleSortingOrder(columnname: string) {
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    // this.sortItems(columnname);
  }
  toggleNewSortingOrder(columnname: string, actualColName: any) {
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    // this.sortItems(columnname);
    if (this.isAscending) {
      if (columnname == 'SSNO' || columnname == 'Tonnage') {
        this.activeorderarray.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else if (columnname == 'podate') {
        this.activeorderarray.sort(
          (a, b) =>
            new Date(a[actualColName]).getTime() -
            new Date(b[actualColName]).getTime()
        );
      } else {
        this.activeorderarray.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'SSNO' || columnname == 'Tonnage') {
        this.activeorderarray.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else if (columnname == 'podate') {
        this.activeorderarray.sort(
          (a, b) =>
            new Date(b[actualColName]).getTime() -
            new Date(a[actualColName]).getTime()
        );
      } else {
        this.activeorderarray.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }
  }
  convertToAscii(inputString: string) {
    let asciiValues = '';
    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      asciiValues = asciiValues + charCode;
    }
    return Number(asciiValues);
  }

  increaseMaxTableWidth(value: boolean) {
    // if (value) {
    //   this.tableWidth = this.tableWidth + 200;
    // } else {
    //   this.tableWidth = this.tableWidth - 200;
    // }

    this.UpdateFixedColumns();
  }

  TableColumns: { columnName: string; isVisible: boolean; left: string }[] = [
    { columnName: 'sno', isVisible: true, left: 'inherit' },
    { columnName: 'pono', isVisible: this.showPonumber, left: 'inherit' },
    { columnName: 'reqdate', isVisible: this.showReqDate, left: 'inherit' },
    {
      columnName: 'plandeldate',
      isVisible: this.showPlanDeliDate,
      left: 'inherit',
    },
    { columnName: 'wbs1', isVisible: this.showWBS1, left: 'inherit' },
    { columnName: 'wbs2', isVisible: this.showWBS2, left: 'inherit' },
    { columnName: 'wbs3', isVisible: this.showWBS3, left: 'inherit' },
    {
      columnName: 'structelement',
      isVisible: this.showStructureElement,
      left: 'inherit',
    },
    {
      columnName: 'prodtype',
      isVisible: this.showProductType,
      left: 'inherit',
    },
    { columnName: 'bbsno', isVisible: this.showBBSNo, left: 'inherit' },
    { columnName: 'bbsdesc', isVisible: this.showBBSDesc, left: 'inherit' },
    { columnName: 'podate', isVisible: this.showPODate, left: 'inherit' },
    { columnName: 'tonnage', isVisible: this.showTonnage, left: 'inherit' },
    {
      columnName: 'submitby',
      isVisible: this.showSubmittedBy,
      left: 'inherit',
    },
    { columnName: 'createby', isVisible: this.showCreatedBy, left: 'inherit' },
    {
      columnName: 'orderstatus',
      isVisible: this.showOrderStatus,
      left: 'inherit',
    },
    {
      columnName: 'projtitle',
      isVisible: this.showProjectTitle,
      left: 'inherit',
    },
    {
      columnName: 'Address',
      isVisible: this.showAddress,
      left: 'inherit',
    },
    {
      columnName: 'Gate',
      isVisible: this.showGate,
      left: 'inherit',
    },
    { columnName: 'select', isVisible: true, left: 'inherit' },
    { columnName: 'details', isVisible: true, left: 'inherit' },
  ];

  UpdateFixedColumns() {
    this.FixedCoulmnList = [];
    this.TableColumns = [
      { columnName: 'sno', isVisible: true, left: 'inherit' },
      { columnName: 'pono', isVisible: this.showPonumber, left: 'inherit' },
      { columnName: 'reqdate', isVisible: this.showReqDate, left: 'inherit' },
      {
        columnName: 'plandeldate',
        isVisible: this.showPlanDeliDate,
        left: 'inherit',
      },
      { columnName: 'wbs1', isVisible: this.showWBS1, left: 'inherit' },
      { columnName: 'wbs2', isVisible: this.showWBS2, left: 'inherit' },
      { columnName: 'wbs3', isVisible: this.showWBS3, left: 'inherit' },
      {
        columnName: 'structelement',
        isVisible: this.showStructureElement,
        left: 'inherit',
      },
      {
        columnName: 'prodtype',
        isVisible: this.showProductType,
        left: 'inherit',
      },
      { columnName: 'bbsno', isVisible: this.showBBSNo, left: 'inherit' },
      { columnName: 'bbsdesc', isVisible: this.showBBSDesc, left: 'inherit' },
      { columnName: 'podate', isVisible: this.showPODate, left: 'inherit' },
      { columnName: 'tonnage', isVisible: this.showTonnage, left: 'inherit' },
      {
        columnName: 'submitby',
        isVisible: this.showSubmittedBy,
        left: 'inherit',
      },
      {
        columnName: 'createby',
        isVisible: this.showCreatedBy,
        left: 'inherit',
      },
      {
        columnName: 'orderstatus',
        isVisible: this.showOrderStatus,
        left: 'inherit',
      },
      {
        columnName: 'projtitle',
        isVisible: this.showProjectTitle,
        left: 'inherit',
      },
      {
        columnName: 'Address',
        isVisible: this.showAddress,
        left: 'inherit',
      },
      {
        columnName: 'Gate',
        isVisible: this.showGate,
        left: 'inherit',
      },
      { columnName: 'select', isVisible: true, left: 'inherit' },
      { columnName: 'details', isVisible: true, left: 'inherit' },
    ];
    let lCount = 0;
    // for (let i = 0; i < this.TableColumns.length; i++) {
    //   if (lCount > this.fixedColumn - 1) {
    //     break;
    //   }

    //   if (this.TableColumns[i].isVisible) {
    //     // If columns is visible then fix the column -> Add the column name to FixedCoulmnList.
    //     this.FixedCoulmnList.push(this.TableColumns[i].columnName);
    //     lCount += 1;
    //   }
    // }

    let lIndex = 0;
    while (lCount <= this.fixedColumn - 1) {
      if (this.TableColumns[lIndex].isVisible) {
        // If columns is visible then fix the column -> Add the column name to FixedCoulmnList.
        this.FixedCoulmnList.push(this.TableColumns[lIndex].columnName);
        this.TableColumns[lIndex].left = this.getMinWidth(
          this.TableColumns[lIndex].columnName
        );
        lCount += 1;
      }
      lIndex += 1;
    }
  }

  OESCheckmarkFormatter(row: any): boolean {
    var lSubmitRight = this.commonService.Submission;
    if (row.OrderSource != 'DIGIOS') {
      return false;
    }
    if (
      row.OrderStatus.indexOf('Created*') < 0 &&
      row.OrderStatus.indexOf('Submitted') < 0 &&
      row.OrderStatus.indexOf('Pending Approval') < 0
    ) {
      return false;
    }
    if (row.OrderStatus.indexOf('Submitted') > 0 && lSubmitRight != 'Yes') {
      return false;
    }
    return true;
  }

  Update(status: string) {
    let tempList: any[] = [];
    for (let i = 0; i < this.activeorderarray.length; i++) {
      if (this.activeorderarray[i].isSelected == true) {
        tempList.push(this.activeorderarray[i]);
      }
    }

    this.UpdateRecord(tempList, status);
  }

  async UpdateRecord(SelectedRows: any, status: string) {
    var lUserID = this.loginService.GetGroupName(); //'jagdishH_ttl@natsteel.com.sg'; //"@ViewBag.UserName";
    var lSubmitRight = this.commonService.Submission; //'Yes'; //@ViewBag.Submission";

    if (status == 'Submitted' && lSubmitRight != 'Yes') {
      alert('You do not have right to approve the order.');
      return;
    }

    if (status == 'Reject' && lSubmitRight != 'Yes') {
      alert('You do not have right to reject the order.');
      return;
    }

    //Check duplicated BBS Number for CAB product
    if (status == 'Submitted' || status == 'Sent') {
      for (let i = 0; i < SelectedRows.length; i++) {
        if (SelectedRows[i].ProdType == 'CAB' && i < SelectedRows.length - 1) {
          var lCABBBSNoA = SelectedRows[i].BBSNo.split(',');
          if (lCABBBSNoA != null && lCABBBSNoA.length > 0) {
            for (j = 0; j < lCABBBSNoA.length; j++) {
              var lBBSNo1 = lCABBBSNoA[j].trim();
              if (lBBSNo1 != '') {
                for (let k = i + 1; k < SelectedRows.length; k++) {
                  if (SelectedRows[k].ProdType == 'CAB') {
                    if (
                      SelectedRows[k].BBSNo.split(',').includes(lBBSNo1) == true
                    ) {
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

    //Check for Order Submit
    if (status == 'Submitted') {
      for (var i = 0; i < SelectedRows.length; i++) {
        if (
          SelectedRows[i].OrderStatus.toUpperCase().indexOf(
            'PENDING APPROVAL'
          ) < 0 &&
          SelectedRows[i].OrderStatus.toUpperCase().indexOf('CREATED*') < 0
        ) {
          alert(
            'Invalid action for the selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ').'
          );
          return;
        }

        // (parseFloat(SelectedRows[i].OrderWeight) == 0 || SelectedRows[i].OrderWeight.trim() == '')
        if (
          parseFloat(SelectedRows[i].OrderWeight) == 0 &&
          (lUserID == null ||
            lUserID.split('@').length != 2 ||
            lUserID.split('@')[1].toLowerCase() == 'natsteel.com.sg' ||
            SelectedRows[i].ProdType != 'BPC')
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
          SelectedRows[i].PONo.trim().length == 0
        ) {
          alert(
            'The selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ') has no PO Number entered.'
          );
          return;
        }
        var lReqDate1 = SelectedRows[i].RequiredDate;
        if (lReqDate1 != null && lReqDate1 != '' && lReqDate1 != ' ') {
          var lReqDate = new Date(lReqDate1);
          if (
            lReqDate <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ||
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

        if (
          SelectedRows[i].PONo == null ||
          SelectedRows[i].PONo == '' ||
          SelectedRows[i].PONo.trim().length == 0
        ) {
          alert(
            'The selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ') has no PO Number entered.'
          );
          return;
        }
      }
    }

    //Check for order submit for approval
    if (status == 'Reject') {
      for (var i = 0; i < SelectedRows.length; i++) {
        if (
          SelectedRows[i].OrderStatus.toUpperCase().indexOf(
            'PENDING APPROVAL'
          ) < 0
        ) {
          alert(
            'Invalid action for the selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ').'
          );
          return;
        }
      }
    }

    if (status == 'Withdraw' && lSubmitRight == 'Yes') {
      for (var i = 0; i < SelectedRows.length; i++) {
        if (
          SelectedRows[i].OrderStatus.toUpperCase().indexOf('SUBMITTED') < 0 &&
          SelectedRows[i].OrderStatus.toUpperCase().indexOf('CREATED*') < 0
        ) {
          alert(
            'Invalid action for the selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ').'
          );
          return;
        }
      }
    }

    if (status == 'Withdraw' && lSubmitRight != 'Yes') {
      for (var i = 0; i < SelectedRows.length; i++) {
        if (
          SelectedRows[i].OrderStatus.toUpperCase().indexOf(
            'PENDING APPROVAL'
          ) < 0
        ) {
          alert(
            'Invalid action for the selected order (Order Number ' +
              SelectedRows[i].OrderNo +
              ').'
          );
          return;
        }
      }
    }

    var lCustomerCodes = [];
    var lProjectCodes = [];
    var lOrderNOs = [];
    var j = 0;
    var lOrderStatus = '';
    for (var i = 0; i < SelectedRows.length; i++) {
      lOrderNOs[j] = SelectedRows[i].OrderNo;
      lOrderStatus = SelectedRows[i].OrderStatus;
      lCustomerCodes[j] = SelectedRows[i].CustomerCode;
      lProjectCodes[j] = SelectedRows[i].ProjectCode;
      j = j + 1;
    }

    if (j == 0) {
      alert('Please select orders for the action.');
      return;
    }
    if (
      status == 'Submitted' &&
      lOrderStatus.toUpperCase().indexOf('PENDING APPROVAL') >= 0
    ) {
      if (
        confirm(
          'Are you sure you want to Approve the select orders and submit them to NatSteel?'
        ) != true
      ) {
        return;
      }
    }
    if (
      status == 'Submitted' &&
      lOrderStatus.toUpperCase().indexOf('CREATED*') >= 0
    ) {
      if (
        confirm('Are you sure you want to submit the selected order(s)?') !=
        true
      ) {
        return;
      }
    }
    if (status == 'Reject') {
      if (
        confirm('Are you sure you want to Reject the select orders?') != true
      ) {
        return;
      }
    }
    if (status == 'Withdraw') {
      if (
        confirm('Are you sure you want to withdraw the selected orders?') !=
        true
      ) {
        return;
      }
    }

    let obj: BatchChangeStatusModel = {
      pCustomerCode: lCustomerCodes,
      pProjectCode: lProjectCodes,
      pOrderNo: lOrderNOs,
      pOrderStatus: status,
    };

    this.ActiveOrderLoading = true;
    let respChangeStatus = await this.BatchChangeStatus_Data(obj);
    this.ActiveOrderLoading = false;

    console.log('respChangeStatus', respChangeStatus);

    if (respChangeStatus != null) {
      if (respChangeStatus.success == false) {
        alert(respChangeStatus.responseText);
        return;
      }
    }

    let tempOrderDis = lOrderNOs.join(',');
    //alert('Order(s) ' + tempOrderDis + ' ' + status + ' successfully!');
    if (status == 'Withdraw') {
      alert(
        'The selected orders have been taken back successfully. You can find them from Saved Orders category and make amendment.'
      );
      this.GetOrderGridList(
        this.activeorderForm.controls['customer'].value,
        this.SelectedProjectCodes
      );
    } else {
      alert('Order(s) ' + tempOrderDis + ' ' + status + ' successfully!');
      this.GetOrderGridList(
        this.activeorderForm.controls['customer'].value,
        this.SelectedProjectCodes
      );
    }
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
  async ViewOrderDetails(row: any) {
    // CLEAR DATA FROM PROCESS ORDER SAVED IN LOCAL STORAGE
    localStorage.removeItem('ProcessData');
    sessionStorage.removeItem('ProcessData');
    localStorage.removeItem('ProcessOrderSummaryData');
    sessionStorage.removeItem('ProcessOrderSummaryData');
    // localStorage.removeItem('CreateDataProcess');
    // sessionStorage.removeItem('CreateDataProcess');
    console.log('SetOrderSummaryData', undefined);
    this.ordersummarySharedService.SetOrderSummaryData(undefined);
    this.processsharedserviceService.setOrderSummaryData(undefined);
    this.processsharedserviceService.ProductDetailsEditable = false;
    this.createSharedService.showOrderSummary = true;

    console.log('row selected', row);

    localStorage.setItem('lastRow_Active', JSON.stringify(row));
    localStorage.setItem(
      'lastSearch_Active',
      JSON.stringify(this.searchForm.value)
    );
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

    let response: any = await this.GetOrderSet(row.OrderNo, false);

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
        if (row.OrderNo == response[i].OrderNo) {
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
    // localStorage.setItem(
    //   'CreateDataProcess',
    //   JSON.stringify(tempOrderSummaryList)
    // );
    
    this.UpdateAddressCode(row.OrderNo); // Udpates the AddressCode in the Dropdown of the selected Order.

    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    // let projects = this.dropdown.getProjectCode();
    // let UpdatedProjects = this.dropdown.UpdateProjectCodeSequence(row.ProjectCode);
    this.router.navigate(['../order/createorder']);
  }

  UpdateProjectCodeSequence(target: string, projects: any): any {
    const index = projects.indexOf(target);

    if (index > -1) {
      // Remove the item from its current position
      projects.splice(index, 1);
      // Add it to the beginning
      projects.unshift(target);
    }

    return projects;
  }

  downloadExcel() {
    debugger;
    this.ActiveOrderLoading = true;
    let ProjectCodes = this.dropdown.getProjectCode();
    let obj: any = {
      CustomerCode: this.dropdown.getCustomerCode(),
      ProjectCode: this.dropdown.getProjectCode(),
      PONumber: '',
      PODate: '',
      RDate: '',
      WBS1: '',
      WBS2: '',
      WBS3: '',
      AllProjects: false,
      RDateFrom: '',
      RDateTo: '',
    };
    this.orderService.ExcelExportActive(obj).subscribe({
      next: (data) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Active Orders List-' + '.xlsx';
        a.click();
        // a.download = 'example.xlsx';
        // document.body.appendChild(a);
        // a.click();
        //   document.body.removeChild(a);
        //   window.URL.revokeObjectURL(url);
        //   this.OrderdetailsLoading = false;
        // const dummyData: Uint8Array = new Uint8Array([data]);
        //const fileName = 'example.xlsx';
        //  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // FileSaver.saveAs(blob, fileName);
        this.ActiveOrderLoading = false;
      },
      error: (e) => {
        //this.ProcessOrderLoading = false;
        alert(
          'Order printing failed, please check the Internet connection and try again.'
        );
      },
      complete: () => {},
    });
  }

  getMinHeight(id: string) {
    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
      // Get the height of the div using clientHeight property
      // console.log('Heading Height', divElement.clientHeight);
      return divElement.clientHeight.toString() + 'px';
    }
    return '20px';
  }

  getMinWidth(id: string) {
    if (this.FixedCoulmnList.includes(id)) {
      const divstartElement: HTMLElement | null =
        document.getElementById('index');
      let startPoint = divstartElement!.clientWidth;
      for (let i = 0; i < this.FixedCoulmnList.length; i++) {
        let tempId = this.FixedCoulmnList[i];
        if (tempId == id) {
          break;
        }
        const divElement: HTMLElement | null = document.getElementById(tempId);
        startPoint = startPoint + divElement!.clientWidth;
      }

      let lReturn = startPoint.toString() + 'px';
      return lReturn;
    }

    return 'inherit';
  }

  isColumnFixed(id: string) {
    return this.FixedCoulmnList.includes(id);
  }

  getminHeading() {}

  OpenStatusDetails(item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      TrackStatusComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.OrderNumber = item.OrderNo;
    modalRef.componentInstance.PONumber = item.PONo;
    modalRef.componentInstance.RequiredDate = item.RequiredDate;
    modalRef.componentInstance.Status = item.OrderStatus;
  }
  // Drag and drop,column fixed,datepicker code starts here
  getLeftSideWidth(itemIndex: number) {
    let width = 10;
    for (let i = 0; i < itemIndex; i++) {
      if (this.activeColumns[i].isVisible) {
        width += parseInt(this.activeColumns[i].width);
      }
    }
    width = width + 5;
    return width + 'px !important';
    // if(this.fixedColumn !=0){
    // }else{
    //   return '10';
    // }
  }
  drpName(dateName: string, event: MouseEvent) {
    console.log('Event=>', event);
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    // Calculate the top and left positions relative to the element
    this.top = rect.top - 50;
    this.right = rect.left - 15;
    this.dateInputName = dateName;

    if (dateName == 'dateRangeRequired') {
      let setdate1 = this.searchForm.get('dateRangeRequired')?.value
        ? this.searchForm.get('dateRangeRequired')?.value.split('-')
        : null;
      if (setdate1) {
        this.defaultFrom = this.parseDate(setdate1[0]);
        this.defaultTo = this.parseDate(setdate1[1]);
      }
    }

    if (dateName == 'dateRangeDelivery') {
      let setdate1 = this.searchForm.get('dateRangeDelivery')?.value
        ? this.searchForm.get('dateRangeDelivery')?.value.split('-')
        : null;
      if (setdate1) {
        this.defaultFrom = this.parseDate(setdate1[0]);
        this.defaultTo = this.parseDate(setdate1[1]);
      }
    }

    if (dateName == 'poDateRange') {
      let setdate1 = this.searchForm.get('poDateRange')?.value
        ? this.searchForm.get('poDateRange')?.value.split('-')
        : null;
      if (setdate1) {
        this.defaultFrom = this.parseDate(setdate1[0]);
        this.defaultTo = this.parseDate(setdate1[1]);
      }
    }

    this.isOpen = !this.isOpen;
  }
  parseDate(dateString: any) {
    // Split the date string into parts
    const parts = dateString.split('/');
    // Rearrange the parts into a format JavaScript recognizes
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    // Create a new Date object
    return new Date(formattedDate);
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
  dropCol(event: any) {
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex + 1 <= this.fixedColumn &&
        event.currentIndex + 1 > this.fixedColumn
      ) {
        this.toastr.warning("Fixed columns can't be moved to normal columns!");
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 1 > this.fixedColumn &&
        event.currentIndex + 1 <= this.fixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to fixed columns!");
      } else {
        //let index= this.CheckCurrentIndex(event.currentIndex,this.activeColumns)
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.activeColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.activeColumns
        );
        moveItemInArray(this.activeColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      //let index= this.CheckCurrentIndex(event.currentIndex,this.activeColumns)
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.activeColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.activeColumns
      );
      moveItemInArray(this.activeColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('activeColumns', JSON.stringify(this.activeColumns));
  }
  parseDateRange(dateRangeString: string) {
    // console.log("dateRangeString=>",dateRangeString);
    const dates = dateRangeString.trim().split('-');
    const startDate = moment(this.parseDate(dates[0]));
    const endDate = moment(this.parseDate(dates[1]));

    return { startDate, endDate };
  }
  // getDateCompare(dateToCompare: any, actualDate: any) {
  //   if (dateToCompare && dateToCompare != '' && actualDate) {
  //     const { startDate, endDate } = this.parseDateRange(dateToCompare);
  //     const dateObj = moment(new Date(actualDate));
  //     console.log("dateRangeString=>", startDate, endDate, dateObj, dateObj.isBetween(startDate, endDate, null, '[]'));
  //     return dateObj.isBetween(startDate, endDate, null, '[]');
  //   } else {
  //     return true;
  //   }
  // }
  getDateCompare(dateToCompare: any, actualDate: any) {
    // let Return = false;
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
  filterAllData() {
    this.activeorderarray = JSON.parse(
      JSON.stringify(this.activeorderarray_backup)
    );
    console.log(
      'this.searchForm.controls.dateRangeDelivery.value>',
      this.searchForm.controls.dateRangeDelivery.value
    );
    this.activeorderarray = this.activeorderarray.filter(
      (item) =>
        this.checkFilterData(
          this.searchForm.controls.OrderNo.value,
          item.OrderNo
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
        this.checkFilterData(
          this.searchForm.controls.OrderWeight.value,
          item.OrderWeight
        ) &&
        this.checkFilterData(
          this.searchForm.controls.OrderStatus.value,
          item.OrderStatus
        ) &&
        this.checkFilterData(
          this.searchForm.controls.submitByDateRange.value,
          item.SubmittedBy
        ) &&
        this.checkFilterData(
          this.searchForm.controls.createByDateRange.value,
          item.DataEnteredBy
        ) &&
        this.getDateCompare(
          this.searchForm.controls.dateRangeRequired.value,
          item.RequiredDate
        ) &&
        this.getDateCompare(
          this.searchForm.controls.dateRangeDelivery.value,
          item.PlanDeliveryDate
        ) &&
        this.getDateCompare(
          this.searchForm.controls.poDateRange.value,
          item.PODate
        ) &&
        this.checkFilterData(
          this.searchForm.controls.Address.value,
          item.Address
        ) &&
        this.checkFilterData(
          this.searchForm.controls.Gate.value,
          item.Gate
        )
    );

    this.SetTotalOrderDis();
  }
  Reset_Filter() {
    this.searchForm.reset();
    this.defaultFrom = new Date();
    this.defaultTo = new Date();
    this.clearInput++;
    this.searchData();
  }

  onGetDateSelected(range: any) {
    console.log('onGetDateSelected=>', range);
    this.searchForm
      .get(range.controlName)
      ?.setValue(
        moment(range.from).format('DD/MM/yyyy') +
          '-' +
          moment(range.to).format('DD/MM/yyyy')
      );
    console.log(
      'onGetDateSelected=>',
      this.searchForm.get(range.controlName)?.value
    );
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
  }
  onWidthChange(obj: any) {
    this.activeColumns[obj.index].resizeWidth = obj.width;
    console.log('onWidthChange', this.activeColumns[obj.index]);
    this.SaveColumnsSetting();
  }

  getRightWidthTest(element: HTMLElement, j: number) {
    let width = this.getAllPreviousSiblings(element);
    console.log('previousSibling=>', width);

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
    this.activeColumns[index].left = width;
  }
  getLeftOfTable(index: number) {
    console.log('get called?', this.activeColumns[index].left);
    return this.activeColumns[index].left;
  }
  //Drag and drop,column fixed,datepicker code ends here

  CheckCurrentIndex(index: any, dataList: any) {
    if (dataList[index].isVisible) {
      return index;
    } else {
      for (let i = 0; i <= dataList[index].length; i++) {
        if (dataList[i].isVisible) {
          return i;
        }
      }
    }
  }

  CheckHiddenColumn(index: any, dataList: any) {
    let data = dataList.filter((obj: { isVisible: any }) => obj.isVisible);
    data = data[index];
    let indexes = dataList.findIndex(
      (objs: { colName: any }) => objs.colName === data.colName
    );
    return indexes;
  }

  SaveColumnsSetting() {
    localStorage.setItem('activeColumns', JSON.stringify(this.activeColumns));
  }

  UpdateFixedColumns1(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('activeFixedColumns', pVal);
  }

  GetDownloadColumns() {
    let lColumnsID: any[] = [];
    let lColumnName: any[] = [];
    let lColumnSize: any[] = [];
    for (let item of this.activeColumns) {
      if (item.isVisible) {
        /**FOR COLUMN ID */
        if (item.colName == 'OrderNo') {
          lColumnsID.push('OrderNo');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'PONo') {
          lColumnsID.push('PONo');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'dateRangeRequired') {
          lColumnsID.push('RequiredDate');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'dateRangeDelivery') {
          lColumnsID.push('PlanDeliveryDate');
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
        if (item.colName == 'BBSNo') {
          lColumnsID.push('BBSNo');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'BBSDesc') {
          lColumnsID.push('BBSDesc');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'poDateRange') {
          lColumnsID.push('poDateRange');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'OrderWeight') {
          lColumnsID.push('OrderWeight');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'submitByDateRange') {
          lColumnsID.push('submitByDateRange');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'createByDateRange') {
          lColumnsID.push('createByDateRange');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'OrderStatus') {
          lColumnsID.push('OrderStatus');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == 'projTitle') {
          lColumnsID.push('ProjectTitle');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
         if (item.colName == 'Address') {
          lColumnsID.push('Address');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
         if (item.colName == 'Gate') {
          lColumnsID.push('Gate');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
        if (item.colName == ' ') {
          lColumnsID.push(' ');
          lColumnName.push(item.displayName);
          lColumnSize.push(100);
        }
      }
    }

    return {
      pColumnsID: lColumnsID,
      pColumnName: lColumnName,
      pColumnSize: lColumnSize,
      UserName: this.loginService.GetGroupName(),
      CustomerCode: this.dropdown.getCustomerCode(),
      ProjectCode: this.dropdown.getProjectCode(),
    };
  }

  getExportObj() {
    //let Datalist: any[] =[];
    let lReturn = this.GetDownloadColumns();
    // let lReturn = {
    //   //OrderStatus: orderStatus,
    //   pColumnsID: [''],
    //   pColumnName: [''],
    //   pColumnSize: [10],
    //   //Forecast: this.ForeCast,
    //   UserName: this.loginService.GetGroupName(),
    // };

    this.activeColumns = [
      {
        controlName: 'OrderNo',
        displayName: ' SNo.',
        chineseDisplayName: '序号',
        field: 'SSNO',
        colName: 'OrderNo',
        placeholder: 'Search So',
        isVisible: true,
        width: '150',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'PONo',
        displayName: 'PO NO',
        chineseDisplayName: '订单号码',
        colName: 'PONo',
        field: 'PONo',
        placeholder: 'Search PONumber',
        isVisible: true,
        width: '150',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'dateRangeRequired',
        displayName: 'Required Date',
        chineseDisplayName: '交货日期',
        colName: 'RequiredDate',
        field: 'RequiredDate',
        placeholder: 'Search Required Date',
        isVisible: true,
        width: '150',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'dateRangeDelivery',
        displayName: 'Plan Delivery Date',
        chineseDisplayName: '计划交货日期',
        colName: 'PlanDeliveryDate',
        field: 'PlanDeliveryDate',
        placeholder: 'Search Plan Delivery Date',
        isVisible: true,
        width: '150',
        resizeWidth: '50',
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
        width: '100',
        resizeWidth: '50',
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
        width: '100',
        resizeWidth: '50',
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
        width: '100',
        resizeWidth: '50',
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
        width: '100',
        resizeWidth: '50',
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
        width: '100',
        resizeWidth: '50',
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
        width: '150',
        resizeWidth: '50',
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
        width: '150',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'poDateRange',
        displayName: 'PO Date',
        chineseDisplayName: '订单日期',
        colName: 'PODate',
        field: 'podate',
        placeholder: 'Search PO Date',
        isVisible: true,
        width: '150',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'OrderWeight',
        displayName: 'Tonnage',
        chineseDisplayName: '重量(吨)',
        colName: 'OrderWeight',
        field: 'Tonnage',
        placeholder: 'Search Tonnage',
        isVisible: true,
        width: '100',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'submitByDateRange',
        displayName: 'Submitted By',
        chineseDisplayName: '提交者',
        colName: 'SubmittedBy',
        field: 'SubmitBy',
        placeholder: 'Search Submitted By',
        isVisible: true,
        width: '150',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'createByDateRange',
        displayName: 'Created By',
        chineseDisplayName: '创建者',
        colName: 'DataEnteredBy',
        field: 'createby',
        placeholder: 'Search Created By',
        isVisible: true,
        width: '100',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'OrderStatus',
        displayName: 'Order Status',
        chineseDisplayName: '订单状态',
        colName: 'OrderStatus',
        field: 'OrderStatus',
        placeholder: 'Search OrderStatus',
        isVisible: true,
        width: '100',
        resizeWidth: '50',
        left: '0',
      },
      {
        controlName: 'projTitle',
        displayName: 'Project Title',
        chineseDisplayName: '工程项目',
        colName: 'ProjectTitle',
        field: 'projtitle',
        placeholder: 'Search Project',
        isVisible: true,
        width: '150',
        resizeWidth: '50',
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
        width: '150',
        resizeWidth: '50',
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
        width: '150',
        resizeWidth: '50',
        left: '0',
      },
    ];

    return lReturn;
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

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
  //     event.preventDefault();
  //     this.KeySelectOrderDetails(event);
  //   }
  // }

  lastSelctedRowDetails: any;
  lastButtonPresses: any = '';

  KeySelectOrderDetails(event: KeyboardEvent) {
    let ldataList: any[] = [];
    ldataList = this.activeorderarray;
    this.activeorderarray;

    let lIndex = 0;
    if (this.activeorderarray) {
      if (this.selectedRowIndex) {
        lIndex = this.selectedRowIndex;
      }
    }

    if (event.key === 'ArrowDown') {
      // Break if the selected element is the last element of the list
      if (lIndex >= ldataList.length - 1) {
        return;
      }
      // Define row
      let row: any;
      if (this.lastButtonPresses == 'UP') {
        row = ldataList[lIndex];
        this.selectedRowIndex = lIndex;
      } else {
        row = ldataList[lIndex + 1];
        this.selectedRowIndex = lIndex + 1;
      }
      this.lastSelctedRowDetails = row;
      this.lastButtonPresses = 'DOWN';
      // if (event.shiftKey && event.key === 'ArrowDown') {
      //   console.log('Multi Select Started');
      //   if (row.isSelected) {
      //     row.isSelected = false;
      //   } else {
      //     row.isSelected = true;
      //   }
      this.scrollToSelectedRow(ldataList);
      return;
    } else if (event.key === 'ArrowUp') {
      // Break if the selected element is the last element of the list
      if (lIndex <= 0) {
        return;
      }
      let row: any;

      if (this.lastButtonPresses == 'DOWN') {
        row = ldataList[lIndex];
        this.selectedRowIndex = lIndex;
      } else {
        row = ldataList[lIndex - 1];
        this.selectedRowIndex = lIndex - 1;
      }

      this.lastSelctedRowDetails = row;
      this.lastButtonPresses = 'UP';
      // if (event.shiftKey && event.key === 'ArrowUp') {
      //   console.log('Multi Select Started');
      //   if (row.isSelected) {
      //     row.isSelected = false;
      //   } else {
      //     row.isSelected = true;
      //   }
      //   return;
      // }
      this.scrollToSelectedRow(ldataList);
      return;
    }
  }

  @ViewChild('tableContainer') tableContainer!: ElementRef;
  // scrollToSelectedRow(ldataList: any) {
  //   const selectedRowIndex = ldataList.findIndex(
  //     (row: any) => row === this.activeorderarray[this.selectedRowIndex]
  //   );
  //   const rowHeight =
  //     this.tableContainer.nativeElement.querySelector('tr').clientHeight;
  //   const containerHeight = this.tableContainer.nativeElement.clientHeight;
  //   const scrollTo = selectedRowIndex * rowHeight;
  //   const headingHeight = 115;
  //   if (
  //     scrollTo + rowHeight + headingHeight > containerHeight ||
  //     scrollTo < this.tableContainer.nativeElement.scrollTop
  //   ) {
  //     this.tableContainer.nativeElement.scrollTop = scrollTo;
  //   }
  // }

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
          // this.selectedRow.push(dataList[i]);
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
          this.activeorderarray[this.lastSelctedRow].rowSelected =
            !this.activeorderarray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow < this.activeorderarray.length) {
          this.lastSelctedRow += 1;
          this.activeorderarray[this.lastSelctedRow].rowSelected =
            !this.activeorderarray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'down';
      }

      // Shift + ArrowUp
      if (event.key === 'ArrowUp') {
        // Case 1: If shrinking upwards, deselect the last selected row

        // Case 2: If expanding upwards, select rows above firstSelectedRow

        if (this.lastPress == 'down') {
          this.activeorderarray[this.lastSelctedRow].rowSelected =
            !this.activeorderarray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow > 0) {
          this.lastSelctedRow -= 1;
          this.activeorderarray[this.lastSelctedRow].rowSelected =
            !this.activeorderarray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'up';
      }

      this.scrollToSelectedRow(this.activeorderarray);
    }
  }

  findMax(a: number, b: number): number {
    return a > b ? a : b;
  }
  findMin(a: number, b: number): number {
    return a < b ? a : b;
  }
  SelectAllChecked(item: any) {
    this.activeorderarray.forEach((element) => {
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
    // const selectedZeroRowIndex = ldataList.findIndex(
    //   (row: any) => row === this.selectedRow[0]
    // );
    this.scrollToRow(this.viewPort!, selectedRowIndex + 1, ldataList.length);
  }

  SelectColumn(pColumnName: string, pItem: any): void {
    if (pColumnName == 'PlanDeliveryDate') {
      if (pItem.PlanDeliveryDate) {
        this.OpenActiveOrderDetails(pItem);
      }
    } else if (pColumnName == 'OrderStatus') {
      this.OpenStatusDetails(pItem);
    }
  }

  OpenActiveOrderDetails(item: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ActiveOrderDetailsComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.gItem = item;
  }
  SetDelayForLoader() {
    let lClearFlag = this.commonService.clearDateRangeLoader;
    if (lClearFlag == true) {
      this.ActiveOrderLoading = true;
    }
    setTimeout(() => {
      this.filterAllData();
      if (lClearFlag == true) {
        this.commonService.clearDateRangeLoader = false;
        this.ActiveOrderLoading = false;
      }
    }, 1 * 1000);
  }

  requestToOrder(pAction: string) {
    // console.log('',pAction);
  }

  changecustomer(event: any) {
    // this.CustomerCode = event;
    let lCustomerCode = event;
    this.dropdown.setCustomerCode(lCustomerCode);
    // Refresh the Value of CustomerCode in SideMenu;
    this.reloadService.reloadCustomerSideMenu.emit();

    this.SelectedProjectCodes = []; // Auto clear the selected project on customer change.
    this.changeproject(this.SelectedProjectCodes);
  }

  // RefreshProject: any[] = [];
  changeproject(event: any) {
    if (event == undefined || event.length == 0) {
      this.activeorderarray = [];
      this.hideTable = true;
      this.SelectedAddressCode = [];
      this.dropdown.setProjectCode([]);
      this.reloadService.reloadProjectSideMenu.emit();
      return;
    }
    console.log('SelectedProjectCodes', this.SelectedProjectCodes);
    // Refresh the ProjectCode in SideMenu;
    this.hideTable = false;
    this.dropdown.setProjectCode(this.SelectedProjectCodes);
    this.reloadService.reloadProjectSideMenu.emit();
  }

  selectAll() {
    this.SelectedProjectCodes = this.ProjectList.map(
      (option: { ProjectCode: any }) => option.ProjectCode
    );
    this.activeorderForm.controls['project'].patchValue(
      this.SelectedProjectCodes
    );
    this.changeproject(this.SelectedProjectCodes);
  }

  clearAll() {
    this.hideTable = true;
    this.SelectedProjectCodes = [];
    this.activeorderarray = [];
    this.Note = ' ';
    this.changeproject(this.SelectedProjectCodes);
  }

  pSearchRefreshFlag: boolean = false;
  ReloadLastSearch() {
    let lItem: any = localStorage.getItem('lastRow_Active');
    let lData: any = localStorage.getItem('lastSearch_Active');
    if (lItem) {
      lItem = JSON.parse(lItem);
      lData = JSON.parse(lData);

      this.pSearchRefreshFlag = true;
      this.populateFormFromJson(lData);
      this.filterAllData();

      setTimeout(() => {
        this.activeorderarray.forEach((x) => {
          if (x.OrderNo === lItem.OrderNo) {
            x.rowSelected = true;
          }
        });
      }, 1 * 500);
    }

    localStorage.removeItem('lastRow_Active');
    localStorage.removeItem('lastSearch_Active');
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
        OrderWeight: jsonData.OrderWeight !== undefined ? jsonData.OrderWeight : null,
        projTitle: jsonData.projTitle || '',
        OrderStatus: jsonData.OrderStatus || '',
        dateRangeRequired: jsonData.RequiredDate || '',
        dateRangeDelivery: jsonData.DeliveryDate || '',
        poDateRange: jsonData.PODate || '',
        submitByDateRange:jsonData.submitByDateRange || '',
        createByDateRange: jsonData.createByDateRange || '',
    });

      console.log('Form populated with JSON data:', this.searchForm.value);
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }


  UpdateColumnsWithGateAddresss() {
    console.log('activeColumns', this.activeColumns);

    let lAddressIndex = this.activeColumns.findIndex(
      (element) => element.controlName === 'Address'
    );
    let lGateIndex = this.activeColumns.findIndex(
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
      this.activeColumns.push(lObj);
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
      this.activeColumns.push(lObj);
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


  // ------------------ADDRESS CODE----------------------- //
  AddressList: any[] = [];
  SelectedAddressCode: any[] = [];

  changeAddress(event: any) {
    console.log('SelectedAddressCode', this.SelectedAddressCode);
    // Refresh the AddressCode in SideMenu;
    this.dropdown.setAddressList(this.SelectedAddressCode);
    this.reloadService.reloadAddressSideMenuEmitter.emit();
  }

  selectAll_Address() {
    this.SelectedAddressCode = this.ProjectList.map(
      (option: { ProjectCode: any }) => option.ProjectCode
    );
    this.activeorderForm.controls['address'].patchValue(
      this.SelectedAddressCode
    );
    this.changeAddress(this.SelectedAddressCode);
  }

  ClearAll_Address() {
    this.hideTable = true;
    this.SelectedAddressCode = [];
    this.activeorderarray = [];
    this.changeAddress(this.SelectedAddressCode);
  }
}
