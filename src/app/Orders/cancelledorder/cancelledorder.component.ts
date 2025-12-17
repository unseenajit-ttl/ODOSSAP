import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  ViewChild,
  Pipe,
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
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, catchError, concatMap, defer, finalize, from, of, Subject, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { OrderService } from '../orders.service';
import { CanceledOrderArray } from 'src/app/Model/CanceledOrderArray';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { LoginService } from 'src/app/services/login.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import moment from 'moment';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-cancelledorder',
  templateUrl: './cancelledorder.component.html',
  styleUrls: ['./cancelledorder.component.css'],
})
export class CancelledorderComponent implements OnInit {
  canceledorderForm!: FormGroup;
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

  @ViewChild('scrollViewport', { static: false })
  public viewPort: CdkVirtualScrollViewport | undefined;

  hideTable: boolean = true;
  ProjectList: any = [];
  loadingData = false;
  canceledorderarray: any[] = [];
  canceledorderarray_backup: CanceledOrderArray[] = [];
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
  showtonnage: boolean = true;
  showSelect: boolean = true;

  multiSelect: number = 0;

  totalCount: number = 0;
  CABtotalWeight: string = '0';
  MESHtotalWeight: string = '0';
  COREtotalWeight: string = '0';
  PREtotalWeight: string = '0';
  isAscending: boolean = false;

  CancelOrderLoading: boolean = false;

  currentSortingColumn: string = '';
  columnVisibiltyForm: FormGroup;
  searchForm: FormGroup;
  cancelledColumns: any[] = [];
  clearInput: number = 0;
  selectedRowIndex: any;
  fixedColumn: number = 0;
  cancelledOrderString = "Total Cancelled Order"
  lastSelctedRow:any
  firstSelectedRow:any
    lastPress: string="";
    isMobile = window.innerWidth;
  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private createSharedService: CreateordersharedserviceService,
    private processsharedserviceService: ProcessSharedServiceService,
    private loginService: LoginService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService,
  ) {
    this.canceledorderForm = this.formBuilder.group({
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

    this.columnVisibiltyForm = this.formBuilder.group({
      showSNo: [true],
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
      showOrderStatus: [true]
    });
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
      RequiredDate: [''],
      OrderWeight: [],
      OrderStatus: [],
      SubmittedBy: [],
      ProjectTitle: []
    });


    this.cancelRequestQueue$
    .pipe(concatMap(req => this.executeCancelledOrderGrid(req.customer, req.projects)))
    .subscribe();
  }
  array(array: any, order: (array: any, order: any) => any): any {
    throw new Error('Method not implemented.');
  }
  order(array: any, order: any): any {
    throw new Error('Method not implemented.');
  }

  LoadTableColumns() {

    let obj: any = localStorage.getItem('CancelledOrderTableColumns');
    let hiddenColumns = JSON.parse(obj);

    if (hiddenColumns) {
      this.showSNo = hiddenColumns.showSNo;
      this.showPonumber = hiddenColumns.showPonumber;
      this.showReqDate = hiddenColumns.showReqDate;
      this.showPlanDeliDate = hiddenColumns.showPlanDeliDate;
      this.showWBS1 = hiddenColumns.showWBS1;
      this.showWBS2 = hiddenColumns.showWBS2;
      this.showWBS3 = hiddenColumns.showWBS3;
      this.showProductType = hiddenColumns.showProductType;
      this.showStructureElement = hiddenColumns.showStructureElement;
      this.showBBSNo = hiddenColumns.showBBSNo;
      this.showBBSDesc = hiddenColumns.showBBSDesc;
      this.showPODate = hiddenColumns.showPODate;
      this.showTonnage = hiddenColumns.showTonnage;
      this.showSubmittedBy = hiddenColumns.showSubmittedBy;
      this.showCreatedBy = hiddenColumns.showCreatedBy;
      this.showProjectTitle = hiddenColumns.showProjectTitle;
      this.showOrderStatus = hiddenColumns.showOrderStatus;
    }
  }

  SetTableColumns() {

    this.changeDetectorRef.detectChanges();

    console.log("Column Saved here")
    let obj = {
      showSNo: this.showSNo,
      showPonumber: this.showPonumber,
      showReqDate: this.showReqDate,
      showPlanDeliDate: this.showPlanDeliDate,
      showWBS1: this.showWBS1,
      showWBS2: this.showWBS2,
      showWBS3: this.showWBS3,
      showProductType: this.showProductType,
      showStructureElement: this.showStructureElement,
      showBBSNo: this.showBBSNo,
      showBBSDesc: this.showBBSDesc,
      showPODate: this.showPODate,
      showTonnage: this.showTonnage,
      showSubmittedBy: this.showSubmittedBy,
      showCreatedBy: this.showCreatedBy,
      showProjectTitle: this.showProjectTitle,
      showOrderStatus: this.showOrderStatus,
    }

    let tempObj = JSON.stringify(obj);
    localStorage.setItem('CancelledOrderTableColumns', tempObj);
  }

  ngOnInit() {
    this.commonService.changeTitle('Cancel Orders | ODOS');
    this.LoadTableColumns();

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
      this.canceledorderForm.controls['customer'].patchValue(lCustomerCode );
      this.ProjectList = []; // When the Customer Code changes, auto clear the project list.
      this.SelectedProjectCodes = []; // When the Customer Code changes, auto clear the selected projectcodes.
      this.canceledorderForm.controls['project'].patchValue(this.SelectedProjectCodes); // SelectedProjectCodes value updated in the form.
      this.canceledorderarray = []; // Table data is also cleared on customer change.
    });

    this.reloadService.reload$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      // this.CustomerCode = lCustomerCode;
      this.canceledorderForm.controls['customer'].patchValue(lCustomerCode );

      let lProjectCodes = this.dropdown.getProjectCode();  // Refresh the selected Project Codes.
      this.SelectedProjectCodes = lProjectCodes;
      this.canceledorderForm.controls['project'].patchValue(lProjectCodes);

      if (data === 'Cancelled Orders') {
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
      this.canceledorderForm.controls['address'].patchValue(lAddressCode);
    });

    if(localStorage.getItem('cancelFixedColumns')){
      this.fixedColumn=JSON.parse(localStorage.getItem('cancelFixedColumns')!)
    }
    if (localStorage.getItem('cancelledColumns')) {
      this.cancelledColumns = JSON.parse(localStorage.getItem('cancelledColumns')!)
      for(let i=0;i<this.cancelledColumns.length;i++){
        if(this.cancelledColumns[i].resizeWidth=='0'){
          this.cancelledColumns = [
            {
              controlName: 'OrderNo',
              displayName: ' SNo.',
              chineseDisplayName: '序号',
              field: 'SSNO',
              colName: 'OrderNo',
              placeholder: "Search OrderNumber",
              isVisible: true,
              width: '5%',
              resizeWidth: '50',
               left: '0'
            },
            {
              controlName: 'PONo',
              displayName: 'PO NO',
              chineseDisplayName: '订单号码',
              colName: 'PONo',
              field: 'PONo',
              placeholder: "Search PONumber",
              isVisible: true,
              width: '7%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'RequiredDate',
              displayName: 'Required Date',
              chineseDisplayName: '交货日期',
              colName: 'RequiredDate',
              field: 'RequiredDate',
              placeholder: "Search here",
              isVisible: true,
              width: '5%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'WBS1',
              displayName: 'WBS 1',
              chineseDisplayName: '楼座',
              colName: 'WBS1',
              field: 'WBS1',
              placeholder: "Search WBS1",
              isVisible: true,
              width: '5%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'WBS2',
              displayName: 'WBS 2',
              chineseDisplayName: '楼层',
              colName: 'WBS2',
              field: 'WBS2',
              placeholder: "Search WBS2",
              isVisible: true,
              width: '5%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'WBS3',
              displayName: 'WBS 3',
              chineseDisplayName: '分部',
              colName: 'WBS3',
              field: 'WBS3',
              placeholder: "Search WBS3",
              isVisible: true,
              width: '5%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'StructureElement',
              displayName: 'Structure Element',
              chineseDisplayName: '建筑构件',
              colName: 'StructureElement',
              field: 'StructureElement',
              placeholder: "Search StructureElement",
              isVisible: true,
              width: '10%',
              resizeWidth: '130', left: '0'
            },
            {
              controlName: 'ProdType',
              displayName: 'Product Type',
              chineseDisplayName: '产品类型',
              colName: 'ProdType',
              field: 'ProdType',
              placeholder: "Search ProductType",
              isVisible: true,
              width: '10%',
              resizeWidth: '130', left: '0'
            },
            {
              controlName: 'BBSNo',
              displayName: 'BBS No',
              chineseDisplayName: '加工表号',
              colName: 'BBSNo',
              field: 'BBSNo',
              placeholder: "Search BBSNo",
              isVisible: true,
              width: '12%',
              resizeWidth: '130', left: '0'
            },
            {
              controlName: 'BBSDesc',
              displayName: 'BBS Desc',
              chineseDisplayName: '加工表备注',
              colName: 'BBSDesc',
              field: 'BBSDesc',
              placeholder: "Search BBSDesc",
              isVisible: true,
              width: '12%',
              resizeWidth: '130', left: '0'
            },
            {
              controlName: 'OrderWeight',
              displayName: 'Tonnage',
              chineseDisplayName: '重量(吨)',
              colName: 'OrderWeight',
              field: 'Tonnage',
              placeholder: "Search Tonnage",
              isVisible: true,
              width: '12%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'SubmittedBy',
              displayName: 'Submitted By',
              chineseDisplayName: '提交者',
              colName: 'SubmittedBy',
              field: 'SubmittedBy',
              placeholder: "Search Submitted By",
              isVisible: true,
              width: '12%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'ProjectTitle',
              displayName: 'Project Title',
              chineseDisplayName: '工程项目',
              colName: 'ProjectTitle',
              field: 'ProjectTitle',
              placeholder: "Search ProjectTitle",
              isVisible: true,
              width: '12%',
              resizeWidth: '50', left: '0'
            },
            {
              controlName: 'OrderStatus',
              displayName: 'Order Status',
              chineseDisplayName: '订单状态',
              colName: 'OrderStatus',
              field: 'OrderStatus',
              placeholder: "Search OrderStatus",
              isVisible: true,
              width: '12%',
              resizeWidth: '50', left: '0'
            }
          ]
        }
      }
    } else {
      this.cancelledColumns = [
        {
          controlName: 'OrderNo',
          displayName: ' SNo.',
          chineseDisplayName: '序号',
          field: 'SSNO',
          colName: 'OrderNo',
          placeholder: "Search OrderNumber",
          isVisible: true,
          width: '5%',
          resizeWidth: '50',
           left: '0'
        },
        {
          controlName: 'PONo',
          displayName: 'PO NO',
          chineseDisplayName: '订单号码',
          colName: 'PONo',
          field: 'PONo',
          placeholder: "Search PONumber",
          isVisible: true,
          width: '7%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          chineseDisplayName: '交货日期',
          colName: 'RequiredDate',
          field: 'RequiredDate',
          placeholder: "Search here",
          isVisible: true,
          width: '5%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'WBS1',
          displayName: 'WBS 1',
          chineseDisplayName: '楼座',
          colName: 'WBS1',
          field: 'WBS1',
          placeholder: "Search WBS1",
          isVisible: true,
          width: '5%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'WBS2',
          displayName: 'WBS 2',
          chineseDisplayName: '楼层',
          colName: 'WBS2',
          field: 'WBS2',
          placeholder: "Search WBS2",
          isVisible: true,
          width: '5%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'WBS3',
          displayName: 'WBS 3',
          chineseDisplayName: '分部',
          colName: 'WBS3',
          field: 'WBS3',
          placeholder: "Search WBS3",
          isVisible: true,
          width: '5%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          chineseDisplayName: '建筑构件',
          colName: 'StructureElement',
          field: 'StructureElement',
          placeholder: "Search StructureElement",
          isVisible: true,
          width: '10%',
          resizeWidth: '130', left: '0'
        },
        {
          controlName: 'ProdType',
          displayName: 'Product Type',
          chineseDisplayName: '产品类型',
          colName: 'ProdType',
          field: 'ProdType',
          placeholder: "Search ProductType",
          isVisible: true,
          width: '10%',
          resizeWidth: '130', left: '0'
        },
        {
          controlName: 'BBSNo',
          displayName: 'BBS No',
          chineseDisplayName: '加工表号',
          colName: 'BBSNo',
          field: 'BBSNo',
          placeholder: "Search BBSNo",
          isVisible: true,
          width: '12%',
          resizeWidth: '130', left: '0'
        },
        {
          controlName: 'BBSDesc',
          displayName: 'BBS Desc',
          chineseDisplayName: '加工表备注',
          colName: 'BBSDesc',
          field: 'BBSDesc',
          placeholder: "Search BBSDesc",
          isVisible: true,
          width: '12%',
          resizeWidth: '130', left: '0'
        },
        {
          controlName: 'OrderWeight',
          displayName: 'Tonnage',
          chineseDisplayName: '重量(吨)',
          colName: 'OrderWeight',
          field: 'Tonnage',
          placeholder: "Search Tonnage",
          isVisible: true,
          width: '12%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          chineseDisplayName: '提交者',
          colName: 'SubmittedBy',
          field: 'SubmittedBy',
          placeholder: "Search Submitted By",
          isVisible: true,
          width: '12%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'ProjectTitle',
          displayName: 'Project Title',
          chineseDisplayName: '工程项目',
          colName: 'ProjectTitle',
          field: 'ProjectTitle',
          placeholder: "Search ProjectTitle",
          isVisible: true,
          width: '12%',
          resizeWidth: '50', left: '0'
        },
        {
          controlName: 'OrderStatus',
          displayName: 'Order Status',
          chineseDisplayName: '订单状态',
          colName: 'OrderStatus',
          field: 'OrderStatus',
          placeholder: "Search OrderStatus",
          isVisible: true,
          width: '12%',
          resizeWidth: '50', left: '0'
        }
      ]
    }
    if (localStorage.getItem('draftVisibleColumns')) {
      let valuesVisibility = JSON.parse(localStorage.getItem('draftVisibleColumns')!);
      this.columnVisibiltyForm.patchValue(valuesVisibility);
    }

    this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    //console.log(this.loadingData)
    // this.GetOrderCustomer();
    if (this.loginService.customerList_Ordering) {
      this.CustomerList = this.loginService.customerList_Ordering;
    }
    if (this.loginService.projectList_Ordering) {
      this.ProjectList = this.loginService.projectList_Ordering;
    }

    this.canceledorderForm.controls['customer'].patchValue(
      this.dropdown.getCustomerCode()
    );
    this.SelectedProjectCodes = this.dropdown.getProjectCode();
    this.canceledorderForm.controls['project'].patchValue(this.SelectedProjectCodes);

    this.Loaddata();
    this.searchForm.valueChanges.subscribe((newValue) => {
      if (
        newValue.RequiredDate.includes('Invalid') 
      ) {
        //this.loading = true;
        //this.filterAllData();
        this.SetDelayForLoader();
        //this.loading = false;
      } else {
        this.filterAllData();
      }
    });
  }
  Loaddata() {
    // this.GetOrderCustomer();
    // this.GetOrderProjectsList(
    //   this.canceledorderForm.controls['customer'].value
    // );
    this.GetOrderGridList(
      this.canceledorderForm.controls['customer'].value,
      this.SelectedProjectCodes
    );
  }

  showDetails(item: any) {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {
    //console.log(item.item_text);
    // //console.log(e.target.value);
    // //console.log(this.canceledorderForm)

    //  let projecttName =e.target.value
    this.canceledorderForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.canceledorderForm.controls;
  }

  onSubmit() {
    // //console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.canceledorderForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.hideTable = true;
    this.canceledorderForm.reset();
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
    //debugger;
    let currentDate = this.getTodayDate();
    let tomorrowDate = this.getTomorrowDate();
    // console.log('date:', tomorrowDate);
    var color = 'inherit';
    if (item.rowSelected) {
      color = 'inherit';
    } else {
      color = 'white';
    }

    // if (item.ispending) {
    //   color = '#fbbb6f';
    // } else if (
    //   item.OrderStatus == 'Production' &&
    //   item.PlanDeliveryDate.replace(/-/g, '') == currentDate
    // ) {
    //   color = '#5de9d1a8';
    // } else if (
    //   item.OrderStatus == 'Production' &&
    //   item.PlanDeliveryDate.replace(/-/g, '') == tomorrowDate
    // ) {
    //   color = '#E5F5FF ';
    // }

    return color;
  }
  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue && ctlValue != '') {
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
    } else {
      return true;
    }
  }
  searchData() {
    //debugger;
    this.canceledorderarray = JSON.parse(
      JSON.stringify(this.canceledorderarray_backup)
    );

    if (this.OrderNumber != undefined && this.OrderNumber != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.SSNNo.toString().includes(this.OrderNumber.trim())
        this.checkFilterData(this.OrderNumber, item.SSNNo)
      );
    }
    if (this.PONumber != undefined && this.PONumber != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
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
      // console.log(this.canceledorderarray[0].RequiredDate.replace(/-/g, ''))
      this.canceledorderarray = this.canceledorderarray.filter(
        (item) =>
          item.RequiredDate.replace(/-/g, '') <= this.EndReqDate &&
          item.RequiredDate.replace(/-/g, '') >= this.StartReqDate
      );
    }

    // if (this.StartPlanDate != "" && this.StartPlanDate != null && this.EndPlanDate != "" && this.EndPlanDate != null) {
    //   // console.log(this.canceledorderarray[0].RequiredDate.replace(/-/g, ''))
    //   this.canceledorderarray = this.canceledorderarray.filter(item =>
    //     item.PlanDeliveryDate.replace(/-/g, '') <= this.EndPlanDate && item.PlanDeliveryDate.replace(/-/g, '') >= this.StartPlanDate
    //   );
    // };
    if (
      this.StartPODate != '' &&
      this.StartPODate != null &&
      this.EndPODate != '' &&
      this.EndPODate != null
    ) {
      // console.log(this.canceledorderarray[0].RequiredDate.replace(/-/g, ''))
      this.canceledorderarray = this.canceledorderarray.filter(
        (item) =>
          item.PODate.replace(/-/g, '') <= this.EndPODate &&
          item.PODate.replace(/-/g, '') >= this.StartPODate
      );
    }
    if (this.WBS1 != undefined && this.WBS1 != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.WBS1?.toLowerCase().includes(this.WBS1.trim().toLowerCase())
        this.checkFilterData(this.WBS1, item.WBS1)
      );
    }
    if (this.WBS2 != undefined && this.WBS2 != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.WBS2?.toLowerCase().includes(this.WBS2.trim().toLowerCase())
        this.checkFilterData(this.WBS2, item.WBS2)
      );
    }
    if (this.WBS3 != undefined && this.WBS3 != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.WBS3?.toLowerCase().includes(this.WBS3.trim().toLowerCase())
        this.checkFilterData(this.WBS3, item.WBS3)
      );
    }
    if (this.ProductType != undefined && this.ProductType != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.ProdType?.toLowerCase().includes(
        //   this.ProductType.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProductType, item.ProdType)
      );
    }
    if (this.StructureElement != undefined && this.StructureElement != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.StructureElement?.toLowerCase().includes(
        //   this.StructureElement.trim().toLowerCase()
        // )
        this.checkFilterData(this.StructureElement, item.StructureElement)
      );
    }
    if (this.BBSNo != undefined && this.BBSNo != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.BBSNo?.toLowerCase().includes(this.BBSNo.trim().toLowerCase())
        this.checkFilterData(this.BBSNo, item.BBSNo)
      );
    }
    if (this.BBSDesc != undefined && this.BBSDesc != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.BBSDesc?.toLowerCase().includes(this.BBSDesc.trim().toLowerCase())
        this.checkFilterData(this.BBSDesc, item.BBSDesc)
      );
    }
    if (this.PODate != undefined && this.PODate != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.PODate?.toLowerCase().includes(this.PODate.trim().toLowerCase())
        this.checkFilterData(this.PODate, item.PODate)
      );
    }
    if (this.Tonnage != undefined && this.Tonnage != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.OrderWeight?.toLowerCase().includes(
        //   this.Tonnage.trim().toLowerCase()
        // )
        this.checkFilterData(this.Tonnage, item.OrderWeight)
      );
    }
    // if (this.SubmittedBy != undefined && this.SubmittedBy != "") {
    //   this.canceledorderarray = this.canceledorderarray.filter(item =>
    //     item.SubmittedBy?.toLowerCase().includes(this.SubmittedBy.trim().toLowerCase())
    //   );
    // };
    // if (this.CreatedBy != undefined && this.CreatedBy != "") {
    //   this.canceledorderarray = this.canceledorderarray.filter(item =>
    //     item.DataEnteredBy?.toLowerCase().includes(this.CreatedBy.trim().toLowerCase())
    //   );
    // };
    // if (this.ProjectTitle != undefined && this.ProjectTitle != "") {
    //   this.canceledorderarray = this.canceledorderarray.filter(item =>
    //     item.ProjectTitle?.toLowerCase().includes(this.ProjectTitle.trim().toLowerCase())
    //   );
    // };
    if (this.OrderStatus != undefined && this.OrderStatus != '') {
      this.canceledorderarray = this.canceledorderarray.filter((item) =>
        // item.OrderStatus?.toLowerCase().includes(
        //   this.OrderStatus.trim().toLowerCase()
        // )
        this.checkFilterData(this.OrderStatus, item.OrderStatus)
      );
    }
  }
  setColVisibility(val: any, field: string) {
    let index = this.cancelledColumns.findIndex((x: any) => x.controlName === field);
    this.cancelledColumns[index].isVisible = val;

    let values = this.columnVisibiltyForm.value;
    localStorage.setItem('draftVisibleColumns', JSON.stringify(values));
  }
  getSeachDateForm(): FormGroup {
    const requiredDateControl = this.searchForm?.get('RequiredDate')!;
    return requiredDateControl as FormGroup;
  }
  dropCol(event: any) {
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex + 1 <= this.fixedColumn &&
        event.currentIndex + 1 > this.fixedColumn
      ) {
        this.toastr.warning("Fixed columns can't be moved to normal columns!");
        // moveItemInArray(this.cancelledColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 1 > this.fixedColumn &&
        event.currentIndex + 1 <= this.fixedColumn
      ) {
        // moveItemInArray(this.cancelledColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to fixed columns!");
      } else {
       // let index= this.CheckCurrentIndex(event.currentIndex,this.cancelledColumns)
       let lcurrentIndex=this.CheckHiddenColumn(event.currentIndex,this.cancelledColumns)
       let lpreviousIndex=this.CheckHiddenColumn(event.previousIndex,this.cancelledColumns)
        moveItemInArray(
          this.cancelledColumns,
          lpreviousIndex,
          lcurrentIndex
        );
      
      }
    } else {
      let lcurrentIndex=this.CheckHiddenColumn(event.currentIndex,this.cancelledColumns)
       let lpreviousIndex=this.CheckHiddenColumn(event.previousIndex,this.cancelledColumns)
        moveItemInArray(
          this.cancelledColumns,
          lpreviousIndex,
          lcurrentIndex
        );
    
    }
    localStorage.setItem('cancelledColumns', JSON.stringify(this.cancelledColumns));
  }
  filterAllData() {
    this.canceledorderarray = JSON.parse(
      JSON.stringify(this.canceledorderarray_backup)
    );
    this.canceledorderarray = this.canceledorderarray.filter(
      (item) =>
        this.checkFilterData(
          this.searchForm.controls.OrderNo.value,
          item.OrderNo
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.PONo.value,
          item.PONo
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.WBS1.value,
          item.WBS1
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.WBS2.value,
          item.WBS2
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.WBS3.value,
          item.WBS3
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.ProdType.value,
          item.ProdType
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.StructureElement.value,
          item.StructureElement
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.BBSNo.value,
          item.BBSNo
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.BBSDesc.value,
          item.BBSDesc
        )
        &&
        this.checkFilterData(
          this.searchForm.controls.OrderWeight.value,
          item.OrderWeight
        )
        &&
        (
          this.getDateCompare(
            this.searchForm.controls.RequiredDate.value,
            item.RequiredDate
          )
        )
        &&
        (
          this.checkFilterData(this.searchForm.controls.SubmittedBy.value, item.SubmittedBy)
        ) &&
        (
          this.checkFilterData(this.searchForm.controls.ProjectTitle.value, item.ProjectTitle)
        )
    );
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
  parseDate(dateString: any) {
    // Split the date string into parts
    const parts = dateString.split('/');
    // Rearrange the parts into a format JavaScript recognizes
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    // Create a new Date object
    return new Date(formattedDate);
  }
  parseDateRange(dateRangeString: string) {
    console.log("dateRangeString=>", dateRangeString);
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
    console.log("getDateCompare=>", dateToCompare, actualDate);
    if (dateToCompare && dateToCompare != '' &&
      !dateToCompare.includes('Invalid')) {
      if (actualDate) {
        let actualDateList = actualDate.split(',');
        for (let i = 0; i < actualDateList.length; i++) {
          const { startDate, endDate } = this.parseDateRange(dateToCompare);
          const dateObj = moment(new Date(actualDateList[i]));
          console.log("dateRangeString=>", startDate, endDate, dateObj, dateObj.isBetween(startDate, endDate, null, '[]'));
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
  dateChange(date: any) {
    console.log(date.value);
    if (date.value == '') {
      this.canceledorderarray = JSON.parse(
        JSON.stringify(this.canceledorderarray_backup)
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

  recordSelected() {
    //debugger;
    for (let i = 0; i < this.canceledorderarray.length; i++) {
      if (this.canceledorderarray[i].isSelected) {
        this.disablesubmit = false;
        return;
      }
    }
    this.disablesubmit = true;
  }

  Reset_Filter() {
    this.searchForm.reset();
    this.clearInput++;
    this.searchData();
  }

  Copy(item: any) {
    item = JSON.stringify(item, null, 2);
    console.log(item);
    this.clipboard.copy(item);
    this.toastr.success('Copied');
  }

  Submit() { }

  Withdraw() { }

  private cancelRequestQueue$ = new Subject<{ customer: any; projects: any[] }>();
  GetOrderGridList(customerCode: any, projectCodes: any[]): void {
    if (!customerCode || !projectCodes || projectCodes.length === 0) {
      return;
    }

    // Push new request to the queue (to be handled sequentially)
    this.cancelRequestQueue$.next({ customer: customerCode, projects: projectCodes });
  }

  
  /**
   * Internal handler for queued cancelled-order execution
   */
  private executeCancelledOrderGrid(customerCode: any, projectCodes: any[]) {
    return defer(() => {
      this.CancelOrderLoading = true;
      this.hideTable = false;

      // Reset local state for a fresh run
      this.canceledorderarray = [];
      this.totalCount = 0;
      this.multiSelect = 0;
      this.CABtotalWeight = '0';
      this.MESHtotalWeight = '0';
      this.COREtotalWeight = '0';
      this.PREtotalWeight = '0';

      const allProjects = this.commonService.includeOptionalProjects;

      if (!allProjects) {
        // --- MULTIPLE PROJECTS: Execute sequentially ---
        return from(projectCodes).pipe(
          concatMap((code) =>
            this.orderService.GetCancelledGridList(customerCode, code, false).pipe(
              tap((response) => {
                const formatted = response.map((r: any) => ({
                  ...r,
                  rowSelected: false,
                }));

                this.canceledorderarray = this.canceledorderarray.concat(formatted);
                this.multiSelect++;
                this.totalCount = this.canceledorderarray.length;

                // You can later compute weight totals here if needed
                console.log(`Fetched ${formatted.length} cancelled orders for project ${code}`);
              }),
              catchError((err) => {
                console.error(`Error fetching cancelled orders for project ${code}`, err);
                return of([]); // continue queue even on error
              })
            )
          ),
          finalize(() => {
            this.CancelOrderLoading = false;
            this.canceledorderarray_backup = JSON.parse(
              JSON.stringify(this.canceledorderarray)
            );
            this.ReloadLastSearch();
            console.log(
              `Completed queued cancelled order run for projects: ${projectCodes.join(', ')}`
            );
          })
        );
      } else {
        // --- SINGLE "All Projects" CALL ---
        return this.orderService
          .GetCancelledGridList(customerCode, projectCodes[0], true)
          .pipe(
            tap((response) => {
              const formatted = response.map((r: any) => ({
                ...r,
                rowSelected: false,
              }));

              this.canceledorderarray = formatted;
              this.totalCount = formatted.length;

              console.log(`Fetched ${formatted.length} cancelled orders (AllProjects)`);
            }),
            catchError((err) => {
              console.error('Error fetching cancelled orders (AllProjects):', err);
              return of([]);
            }),
            finalize(() => {
              this.CancelOrderLoading = false;
              this.canceledorderarray_backup = JSON.parse(
                JSON.stringify(this.canceledorderarray)
              );
              this.ReloadLastSearch();
            })
          );
      }
    })
  }



  // GetOrderGridList(customerCode: any, projectCodes: any): void {
  //   this.canceledorderarray = [];
  //   if (customerCode != undefined && projectCodes.length > 0) {
  //     this.hideTable = false;
  //     this.CancelOrderLoading = true;

  //     this.totalCount = 0;
  //     this.CABtotalWeight = '0';
  //     this.MESHtotalWeight = '0';
  //     this.COREtotalWeight = '0';
  //     this.PREtotalWeight = '0';

  //     this.multiSelect = 0;

  //     let AllProjects = this.commonService.includeOptionalProjects;
  //     if (!AllProjects) {
  //       for (let i = 0; i < projectCodes.length; i++) {
  //         this.orderService
  //           .GetCancelledGridList(customerCode, projectCodes[i], false)
  //           .subscribe({
  //             next: (response) => {
  //               let temp = response;

  //               for (let i = 0; i < response.length; i++) {
  //                 temp[i].rowSelected = false;
  //               }
  //               this.canceledorderarray = this.canceledorderarray.concat(temp);
  //               this.multiSelect = this.multiSelect + 1;

  //               if (this.multiSelect == projectCodes.length) {
  //                 this.CancelOrderLoading = false;
  //               }
  //               this.totalCount = this.canceledorderarray.length;
  //               // if(this.canceledorderarray.length > 1){
  //               //   this.cancelledOrderString = "Total Cancelled Orders"
  //               // }else{
  //               //   this.cancelledOrderString = "Total Cancelled Order";
  //               // }
  //               // this.CABtotalWeight = (this.getTotalWeight('CAB')).toFixed(3);
  //               // this.MESHtotalWeight = (this.getTotalWeight('MESH')).toFixed(3);
  //               // this.COREtotalWeight = (this.getTotalWeight('CORE CAGE')).toFixed(3);
  //               // this.PREtotalWeight = (this.getTotalWeight('PRE CAGE')).toFixed(3);
  //             },
  //             error: (e) => {
  //               this.CancelOrderLoading = false;
  //             },
  //             complete: () => {
  //               this.canceledorderarray_backup = JSON.parse(
  //                 JSON.stringify(this.canceledorderarray)
  //               );
  //               this.ReloadLastSearch();
  //             },
  //           });
  //       }
  //     } else {
  //       this.orderService
  //         .GetCancelledGridList(customerCode, projectCodes[0], true)
  //         .subscribe({
  //           next: (response) => {
  //             let temp = response;

  //             for (let i = 0; i < response.length; i++) {
  //               temp[i].rowSelected = false;
  //             }
  //             this.canceledorderarray = this.canceledorderarray.concat(temp);

  //             this.CancelOrderLoading = false;
  //             this.totalCount = this.canceledorderarray.length;
  //           },
  //           error: (e) => {
  //             this.CancelOrderLoading = false;
  //           },
  //           complete: () => {
  //             this.canceledorderarray_backup = JSON.parse(
  //               JSON.stringify(this.canceledorderarray)
  //             );
  //               this.ReloadLastSearch();
  //           },
  //         });
  //     }
  //   }
  // }
  getTotalWeight(producttype: any) {
    let totalweight = 0;
    for (let i = 0; i < this.canceledorderarray.length; i++) {
      if (this.canceledorderarray[i].ProdType == producttype) {
        totalweight =
          totalweight + Number(this.canceledorderarray[i].OrderWeight);
      }
    }
    return totalweight;
  }
  GetOrderCustomer(): void {
    //debugger;
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType()
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.CustomerList = response;
        console.log('customer', response);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }
  GetOrderProjectsList(customerCode: any): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType()

    this.orderService.GetProjects(customerCode, pUserType, pGroupName).subscribe({
      next: (response) => {
        this.ProjectList = response;
      },
      error: (e) => { },
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
    for (let i = 0; i < this.canceledorderarray.length; i++) {
      let obj = {
        OrderNumber: this.canceledorderarray[i].OrderNo,
        PONumber: this.canceledorderarray[i].PONo,
        RequiredDate: this.canceledorderarray[i].RequiredDate,
        //PlanDeliverdate: "",
        WBS1: this.canceledorderarray[i].WBS1,
        WBS2: this.canceledorderarray[i].WBS2,
        WBS3: this.canceledorderarray[i].WBS3,
        ProductType: this.canceledorderarray[i].ProdType,
        StructureElement: this.canceledorderarray[i].StructureElement,
        BBSNo: this.canceledorderarray[i].BBSNo,
        BBSDesc: this.canceledorderarray[i].BBSDesc,
        OrderStatus: this.canceledorderarray[i].OrderStatus,
        SubmittedBy:this.canceledorderarray[i].SubmittedBy,
        ProjectTitle:this.canceledorderarray[i].ProjectTitle,
      };
      listTodownload.push(obj);
    }
    // listTodownload = this.canceledorderarray;
    this.name = 'CancelledOrderList';
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
    debugger;
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (columnname == 'SSNO' || columnname == 'Tonnage') {
        this.canceledorderarray.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else if (columnname == 'RequiredDate') {
        this.canceledorderarray.sort(
          (a, b) =>
            new Date(a[actualColName]).getTime() -
            new Date(b[actualColName]).getTime()
        );
      } else {
        this.canceledorderarray.sort(
          (a, b) => a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'SSNO' || columnname == 'Tonnage') {
        this.canceledorderarray.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else if (columnname == 'RequiredDate') {
        this.canceledorderarray.sort(
          (a, b) =>
            new Date(b[actualColName]).getTime() -
            new Date(a[actualColName]).getTime()
        );
      } else {
        this.canceledorderarray.sort(
          (a, b) => b[actualColName].localeCompare(a[actualColName])
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

    localStorage.setItem('lastRow_Canceled', JSON.stringify(row));
    localStorage.setItem(
      'lastSearch_Canceled',
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
          lTotalQty.push(response[i].TotalPCs)
          lSelectedPostId.push(response[i].PostHeaderId)
          lScheduledProd.push(response[i].ScheduledProd);
          lWBS1.push(response[i].WBS1);
          lWBS2.push(response[i].WBS2);
          lWBS3.push(response[i].WBS3);
          lOrderNo.push(response[i].OrderNo);

          let lStructPrd = response[i].StructureElement + '/' + response[i].ProductType
          if (response[i].PostHeaderId) {
            lStructPrd = lStructPrd + response[i].PostHeaderId;
          }
          lStrutureProd.push(lStructPrd);;
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
    let UpdatedProjects = this.dropdown.UpdateProjectCodeSequence(row.ProjectCode);
    this.router.navigate(['../order/createorder']);
  }

  async GetOrderSet(OrderNumber: any, routeFlag: boolean) {
    // CALL API TO RETURN ALL ORDERS WITH SIMILAR REF NUMBER TO GIVEN ORDER NUMBER
    try {
      const data = await this.orderService.GetOrderSet(OrderNumber, routeFlag).toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }
  getMinHeightIncoming(id: string) {

    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
      // Get the height of the div using clientHeight property
      console.log("Heading Height", divElement.clientHeight);
      return divElement.clientHeight;

    }
    return 50;
  }
  onGetDateSelected(range: any) {
    this.searchForm.get(range.controlName)?.setValue(moment(range.from).format('DD/MM/yyyy') + '-' + moment(range.to).format('DD/MM/yyyy'));
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
  }
  onWidthChange(obj: any) {
    this.cancelledColumns[obj.index].resizeWidth = obj.width;
    console.log("onWidthChange", this.cancelledColumns[obj.index]);
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
    this.cancelledColumns[index].left = width;
  }
  getLeftOfTable(index: number) {
    console.log("get called?", this.cancelledColumns[index].left);
    return this.cancelledColumns[index].left;
  }
  isNumeric(str: string): boolean {
    return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
  }

  CheckCurrentIndex(index: any, dataList: any) {
    if (dataList[index].isVisible) {
      return index;
    } else {
    for(let i=index;i<dataList.Length;i++){
      if (dataList[i].isVisible) {
        return i-1;
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
 
    return (index + lInVisibleColumns);
  }

  SaveColumnsSetting(){
    localStorage.setItem('cancelledColumns', JSON.stringify(this.cancelledColumns));
  }

  UpdateFixedColumns(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('cancelFixedColumns', pVal);
  }

  ExportCancelledOrdersToExcel(){
    let customerCode = this.dropdown.getCustomerCode();
    let projectCodes: any = this.dropdown.getProjectCode();

    projectCodes = projectCodes.join(',');
    this.orderService
      .ExportCancelledOrdersToExcel(customerCode, projectCodes)
      .subscribe({
        next: (response) => {
          console.log('Success');

          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'Cancelled Orders List-' + '.xlsx';
          a.click();
        },
        error: () => {},
        complete: () => {},
      });
  }

  HoverSetting: boolean= false;
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
    dataList.forEach(element => {
      element.rowSelected = false;
      
    });
    row.rowSelected = true ;

    // this.Collapse = false;
 if (event.shiftKey) {
      // Handle multiselect with Shift key.
      if(this.lastPress.length)
      {
        let max = this.findMax(this.lastSelctedRow,this.firstSelectedRow);
        let min = this.findMin(this.lastSelctedRow,this.firstSelectedRow);

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
          }
          this.lastSelctedRow = nIndex;
        }

        } 


        
  else{
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

                if(this.lastPress=="up")
                {
                  this.canceledorderarray[this.lastSelctedRow].rowSelected =!this.canceledorderarray[this.lastSelctedRow].rowSelected ;
                }
                else if(this.lastSelctedRow<this.canceledorderarray.length)
                {
                  this.lastSelctedRow += 1;
                  this.canceledorderarray[this.lastSelctedRow].rowSelected =!this.canceledorderarray[this.lastSelctedRow].rowSelected ;
                }
                this.lastPress="down"

              }
      
              // Shift + ArrowUp
              if (event.key === 'ArrowUp') {
                  // Case 1: If shrinking upwards, deselect the last selected row
               
                  // Case 2: If expanding upwards, select rows above firstSelectedRow

                  if(this.lastPress=="down")
                    {
                      this.canceledorderarray[this.lastSelctedRow].rowSelected =!this.canceledorderarray[this.lastSelctedRow].rowSelected ;
                    }
                 else if (this.lastSelctedRow > 0) {
                      this.lastSelctedRow -= 1;
                      this.canceledorderarray[this.lastSelctedRow].rowSelected = !this.canceledorderarray[this.lastSelctedRow].rowSelected;
                  }
                  this.lastPress="up"
              }

              this.scrollToSelectedRow(this.canceledorderarray);
          }
      }


       findMax(a: number, b: number): number {
        return a > b ? a : b;
    }
     findMin(a: number, b: number): number {
      return a < b ? a : b;
  }
  SelectAllChecked(item:any)
  {
    this.canceledorderarray.forEach(element=>{
      if(element.rowSelected && item!==element)
      {
        element.isSelected = true;
      }

    })
  }
  itemSize = 30;
  scrollToRow(viewport:CdkVirtualScrollViewport,nextIndex: number,itemSize:number): void {
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
      const endIndex = Math.floor(((scrollOffset + viewportSize) / this.itemSize)-3);
      if(nextIndex >= endIndex){
        let offset = (scrollOffset) + 30;
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
    this.scrollToRow(this.viewPort!,selectedRowIndex+1 , ldataList.length);


  }
  SetDelayForLoader() {
    let lClearFlag = this.commonService.clearDateRangeLoader;
    if (lClearFlag == true) {
      this.CancelOrderLoading = true;
    }
    setTimeout(() => {
      this.filterAllData();
      if (lClearFlag == true) {
        this.commonService.clearDateRangeLoader = false;
        this.CancelOrderLoading = false;
      }
    }, 1 * 1000);
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
      this.canceledorderarray = [];
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
    this.canceledorderForm.controls['project'].patchValue(this.SelectedProjectCodes);
    this.changeproject(this.SelectedProjectCodes);
  }
  
  clearAllProject() {
    this.hideTable = true;
    this.SelectedProjectCodes = [];
    this.canceledorderarray = [];
    this.changeproject(this.SelectedProjectCodes);
  }

    pSearchRefreshFlag: boolean = false;
  ReloadLastSearch() {
    let lItem: any = localStorage.getItem('lastRow_Canceled');
    let lData: any = localStorage.getItem('lastSearch_Canceled');
    if (lItem) {
      lItem = JSON.parse(lItem);
      lData = JSON.parse(lData);

      this.pSearchRefreshFlag = true;
      this.populateFormFromJson(lData);
      this.filterAllData();

      setTimeout(() => {
        this.canceledorderarray.forEach((x) => {
          if (x.OrderNo === lItem.OrderNo) {
            x.rowSelected = true;
          }
        });
      }, 1 * 500);
    }

    localStorage.removeItem('lastRow_Canceled');
    localStorage.removeItem('lastSearch_Canceled');
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
        RequiredDate: jsonData.RequiredDate || '',
        OrderWeight:
          jsonData.OrderWeight !== undefined ? jsonData.OrderWeight : null,
        OrderStatus: jsonData.OrderStatus || '',
        SubmittedBy: jsonData.SubmittedBy || '',
        ProjectTitle: jsonData.ProjectTitle || '',
      });

      console.log('Form populated with JSON data:', this.searchForm.value);
    } catch (error) {
      console.error('Error populating form:', error);
    }
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
    this.canceledorderForm.controls['address'].patchValue(
      this.SelectedAddressCode
    );
    this.changeAddress(this.SelectedAddressCode);
  }

  ClearAll_Address() {
    this.hideTable = true;
    this.SelectedAddressCode = [];
    this.canceledorderarray = [];
    this.changeAddress(this.SelectedAddressCode);
  }
}
