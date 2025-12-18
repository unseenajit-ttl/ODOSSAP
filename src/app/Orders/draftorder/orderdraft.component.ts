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
} from '@angular/forms';

import { Router } from '@angular/router';

import { DraftedOrderArray } from 'src/app/Model/DraftedOrderArray';
import { Result } from 'src/app/Model/Result';
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
import moment, { max, min } from 'moment';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { OrderService } from '../orders.service';
import * as XLSX from 'xlsx';
import { Swap } from 'sortablejs';
import { defer, elementAt, Subject } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TransportAlertMessageComponent } from './transport-alert-message/transport-alert-message.component';
import { from } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';


@Component({
  selector: 'app-orderdraft',
  templateUrl: './orderdraft.component.html',
  styleUrls: ['./orderdraft.component.css'],
})
export class orderdraftComponent implements OnInit {
  @Input() highlightToday: any;
  @ViewChild('scrollViewportENT', { static: false })
  public viewPortENT: CdkVirtualScrollViewport | undefined;

  today: Date = new Date();
  draftOrderForm!: FormGroup;
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
  firstSelectedRow: any;
  lastSelctedRow: any;

  lastPress: string = '';
  hideTable: boolean = true;
  loadingData = false;
  DraftedOrderArray: any[] = [];
  DraftedOrderArray_backup: DraftedOrderArray[] = [];
  DraftedOrderArray_Temp: DraftedOrderArray[] = [];
  DraftBatchChangeOrderArray: any[] = [];
  Result: Result[] = []; //| undefined;
  resbody: any = { Message: '', response: '' };

  isAscending: boolean = false;
  currentSortingColumn: string = '';

  isExpand: boolean = false;
  toggleFilters = true;

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
  Address: any;
  Gate: any;
  OrderStatus: any;
  Details: any;
  UpdateDate: any;

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
  showAddress: boolean = false;
  showGate: boolean = false;
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

  DraftOrderLoading: boolean = false;

  lOrderNOs: any = [];

  ordernumbers: any;

  hideUnshare: boolean = true;
  hideShare: boolean = true;
  hideDelete: boolean = true;
  hideSent: boolean = true;
  hideSubmit: boolean = true;

  UserType: any = '';
  Submission: string = '';
  Editable: string = '';
  multiSelect: number = 0;

  SelectAllFlag: boolean = false;
  searchForm: FormGroup;
  columnVisibiltyForm: FormGroup;

  draftColumns: any[] = [];
  clearInput: number = 0;
  selectedRowIndex: any;
  fixedColumn: number = 0;
  startDateFilter!: moment.Moment;
  endDateFilter!: moment.Moment;
  selectedRow: any = [];
  upFlag: boolean = false;
  downFlag: boolean = false;
  itemSize = 30;

  ProjectList: any[] = [];
  CustomerList: any[] = [];
  SelectedProjectCodes: any[] = [];

  AddressList: any[] = [];
  SelectedAddressCode: any[] = [];

  isMobile = window.innerWidth;
  CabJobIDs:any[]=[]

  private requestQueue$ = new Subject<{ customer: any; projects: any[] }>();

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
    private modalService: NgbModal
  ) {
    this.draftOrderForm = this.formBuilder.group({
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
      Address: [''],
      Gate: [''],
      UpdateDate: [''],
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

    this.requestQueue$
    .pipe(concatMap(req => this.executeOrderGrid(req.customer, req.projects)))
    .subscribe();
  }

  ngOnInit() {
    // Set Submission & Editable Flags.
    this.Submission = this.commonService.Submission;
    this.Editable = this.commonService.Editable;

    if (this.highlightToday) {
      this.highlightCurrentDate();
    }
    this.commonService.changeTitle('Draft Orders | ODOS');
    //Reload Access Right
    this.reloadService.reloadAccessRight$.subscribe((data) => {
      this.Submission = this.commonService.Submission;
      this.Editable = this.commonService.Editable;
    });

    this.reloadService.reloadCustomerList$.subscribe((data) => {
      if (this.loginService.customerList_Ordering) {
        this.CustomerList = this.loginService.customerList_Ordering;
      }
    });

    this.reloadService.reloadProjectList$.subscribe((data) => {
      if (this.loginService.projectList_Ordering) {
        this.ProjectList = this.loginService.projectList_Ordering;
      }
    });

    this.reloadService.reloadAddressList$.subscribe((data) => {
      if (this.loginService.addressList_Ordering) {
        this.AddressList = this.loginService.addressList_Ordering;
      }
    });

    // For refreshing the value of Customer Code.
    this.reloadService.reloadCustomer$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.

      this.CustomerCode = lCustomerCode;
      this.draftOrderForm.controls['customer'].patchValue(lCustomerCode);
      this.ProjectList = []; // When the Customer Code changes, auto clear the project list.
      this.SelectedProjectCodes = []; // When the Customer Code changes, auto clear the selected projectcodes.
      this.draftOrderForm.controls['project'].patchValue(
        this.SelectedProjectCodes
      ); // SelectedProjectCodes value updated in the form.
      this.DraftedOrderArray = []; // Table data is also cleared on customer change.
    });

    this.reloadService.reload$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      this.CustomerCode = lCustomerCode;
      this.draftOrderForm.controls['customer'].patchValue(lCustomerCode);

      let lProjectCodes = this.dropdown.getProjectCode(); // Refresh the selected Project Codes.
      this.SelectedProjectCodes = lProjectCodes;
      this.draftOrderForm.controls['project'].patchValue(lProjectCodes);

      if (data === 'Draft Orders') {
        this.Loaddata(); // Refresh the Table Data based on the selected Customer & Project Codes.
      }
    });

    this.reloadService.reloadAddressCodeMobile$.subscribe((data) => {
      let lAddressCode = this.dropdown.getAddressList(); // Refresh the selected Customer Code.
      this.SelectedAddressCode = lAddressCode;
      this.draftOrderForm.controls['address'].patchValue(lAddressCode);
    });

    

    if (localStorage.getItem('draftColumns')) {
      this.draftColumns = JSON.parse(localStorage.getItem('draftColumns')!);
      for (let i = 0; i < this.draftColumns.length; i++) {
        if (this.draftColumns[i].resizeWidth == '0') {
          this.draftColumns[i].resizeWidth = '100';
        }
      }
    } else {
      this.draftColumns = [
        {
          controlName: 'OrderNo',
          displayName: ' SNo.',
          chineseDisplayName: '序号',
          field: 'OrderNo',
          colName: 'OrderNo',
          placeholder: 'Search OrderNumber',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'PONo',
          displayName: 'PO NO',
          chineseDisplayName: '订单号码',
          colName: 'PONo',
          field: 'PONo',
          placeholder: 'Search PONumber',
          isVisible: true,
          width: '7%',
          left: '0',
          resizeWidth: '100',
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
          left: '0',
          resizeWidth: '100',
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
          left: '0',
          resizeWidth: '100',
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
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'ProdType',
          displayName: 'Product Type',
          chineseDisplayName: '产品类型',
          colName: 'ProdType',
          field: 'ProdType',
          placeholder: 'Search ProductType',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          chineseDisplayName: '建筑构件',
          colName: 'StructureElement',
          field: 'StructureElement',
          placeholder: 'Search StructureElement',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'BBSNo',
          displayName: 'BBS No',
          chineseDisplayName: '加工表号',
          colName: 'BBSNo',
          field: 'BBSNo',
          placeholder: 'Search BBSNo',
          isVisible: true,
          width: '12%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'BBSDesc',
          displayName: 'BBS Desc',
          chineseDisplayName: '加工表备注',
          colName: 'BBSDesc',
          field: 'BBSDesc',
          placeholder: 'Search BBSDesc',
          isVisible: true,
          width: '12%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          chineseDisplayName: '交货日期',
          colName: 'RequiredDate',
          field: 'RequiredDate',
          placeholder: 'Search here',
          isVisible: true,
          width: '12%',
          left: '0',
          resizeWidth: '200',
        },
        {
          controlName: 'OrderWeight',
          displayName: 'Tonnage',
          chineseDisplayName: '重量(吨)',
          colName: 'OrderWeight',
          field: 'OrderWeight',
          placeholder: 'Search Tonnage',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'ProjectTitle',
          displayName: 'Project Title',
          chineseDisplayName: '工程项目',
          colName: 'ProjectTitle',
          field: 'ProjectTitle',
          placeholder: 'Search here',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'UpdateBy',
          displayName: 'Updated By',
          chineseDisplayName: '(修改者)',
          colName: 'UpdateBy',
          field: 'UpdateBy',
          placeholder: 'Search here',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'UpdateDate',
          displayName: 'Updated Date',
          chineseDisplayName: '(修改日期)',
          colName: 'UpdateDate',
          field: 'Update Date',
          placeholder: 'Search here',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '200',
        },
        {
          controlName: 'Address',
          displayName: 'Address',
          chineseDisplayName: '(地址)',
          colName: 'Address',
          field: 'Address',
          placeholder: 'Search here',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '200',
        },
        {
          controlName: 'Gate',
          displayName: 'Gate',
          chineseDisplayName: '(门)',
          colName: 'Gate',
          field: 'Gate',
          placeholder: 'Search here',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '200',
        },
      ];
    }
    if (localStorage.getItem('draftVisibleColumns')) {
      this.columnVisibiltyForm.patchValue(
        JSON.parse(localStorage.getItem('draftVisibleColumns')!)
      );
    }

    if (localStorage.getItem('draftFixedColumns')) {
      let lVal = JSON.parse(localStorage.getItem('draftFixedColumns')!);
      if (lVal) {
        this.fixedColumn = lVal;
      }
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

    this.draftOrderForm.controls['customer'].patchValue(
      this.dropdown.getCustomerCode()
    );
    this.SelectedProjectCodes = this.dropdown.getProjectCode();
    this.draftOrderForm.controls['project'].patchValue(
      this.SelectedProjectCodes
    );

    this.Loaddata();
    this.searchForm.valueChanges.subscribe((newValue) => {
      this.SetDelayForLoader();
      //this.filterAllData();
    });


    this.UpdateColumnsWithGateAddresss();
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

  UpdateFixedColumns(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('draftFixedColumns', pVal);
  }

  Loaddata() {
    this.GetOrderGridList(
      this.draftOrderForm.controls['customer'].value,
      this.SelectedProjectCodes
    );
  }

  showDetails(item: any) {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {
    //console.log(item.item_text);
    // //console.log(e.target.value);
    // //console.log(this.draftOrderForm)

    //  let projecttName =e.target.value
    this.draftOrderForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.draftOrderForm.controls;
  }

  onReset() {
    this.submitted = false;
    this.hideTable = true;
    this.clearInput++;
    this.draftOrderForm.reset();
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
      if (item.OrderShared) {
        color = '#dffac7';
      } else {
        color = 'inherit';
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
    this.DraftedOrderArray = JSON.parse(
      JSON.stringify(this.DraftedOrderArray_backup)
    );
    if (this.OrderNumber != undefined && this.OrderNumber != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        this.checkFilterData(this.OrderNumber, item.OrderNo)
      );
    }
    if (this.PONumber != undefined && this.PONumber != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
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
      // console.log(this.DraftedOrderArray[0].RequiredDate.replace(/-/g, ''))
      this.DraftedOrderArray = this.DraftedOrderArray.filter(
        (item) =>
          item.RequiredDate.replace(/-/g, '') <= this.EndReqDate &&
          item.RequiredDate.replace(/-/g, '') >= this.StartReqDate
      );
    }

    // if (this.StartPlanDate != "" && this.StartPlanDate != null && this.EndPlanDate != "" && this.EndPlanDate != null) {
    //   // console.log(this.DraftedOrderArray[0].RequiredDate.replace(/-/g, ''))
    //   this.DraftedOrderArray = this.DraftedOrderArray.filter(item =>
    //     item.PlanDeliveryDate.replace(/-/g, '') <= this.EndPlanDate && item.PlanDeliveryDate.replace(/-/g, '') >= this.StartPlanDate
    //   );
    // };
    // if (this.StartPODate != "" && this.StartPODate != null && this.EndPODate != "" && this.EndPODate != null) {
    //   // console.log(this.DraftedOrderArray[0].RequiredDate.replace(/-/g, ''))
    //   this.DraftedOrderArray = this.DraftedOrderArray.filter(item =>
    //     item.PODate.replace(/-/g, '') <= this.EndPODate && item.PODate.replace(/-/g, '') >= this.StartPODate
    //   );
    // };
    if (this.WBS1 != undefined && this.WBS1 != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.WBS1?.toLowerCase().includes(this.WBS1.trim().toLowerCase())
        this.checkFilterData(this.WBS1, item.WBS1)
      );
    }
    if (this.WBS2 != undefined && this.WBS2 != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.WBS2?.toLowerCase().includes(this.WBS2.trim().toLowerCase())
        this.checkFilterData(this.WBS2, item.WBS2)
      );
    }
    if (this.WBS3 != undefined && this.WBS3 != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.WBS3?.toLowerCase().includes(this.WBS3.trim().toLowerCase())
        this.checkFilterData(this.WBS3, item.WBS3)
      );
    }
    if (this.ProductType != undefined && this.ProductType != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.ProdType?.toLowerCase().includes(
        //   this.ProductType.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProductType, item.ProdType)
      );
    }
    if (this.StructureElement != undefined && this.StructureElement != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.StructureElement?.toLowerCase().includes(
        //   this.StructureElement.trim().toLowerCase()
        // )
        this.checkFilterData(this.StructureElement, item.StructureElement)
      );
    }
    if (this.BBSNo != undefined && this.BBSNo != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.BBSNo?.toLowerCase().includes(this.BBSNo.trim().toLowerCase())
        this.checkFilterData(this.BBSNo, item.BBSNo)
      );
    }
    if (this.BBSDesc != undefined && this.BBSDesc != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.BBSDesc?.toLowerCase().includes(this.BBSDesc.trim().toLowerCase())
        this.checkFilterData(this.BBSDesc, item.BBSDesc)
      );
    }
    // if (this.PODate != undefined && this.PODate != "") {
    //   this.DraftedOrderArray = this.DraftedOrderArray.filter(item =>
    //     item.PODate?.toLowerCase().includes(this.PODate.trim().toLowerCase())
    //   );
    // };
    if (this.Tonnage != undefined && this.Tonnage != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.OrderWeight?.toLowerCase().includes(
        //   this.Tonnage.trim().toLowerCase()
        // )
        this.checkFilterData(this.Tonnage, item.OrderWeight)
      );
    }
    // if (this.SubmittedBy != undefined && this.SubmittedBy != "") {
    //   this.DraftedOrderArray = this.DraftedOrderArray.filter(item =>
    //     item.SubmittedBy?.toLowerCase().includes(this.SubmittedBy.trim().toLowerCase())
    //   );
    // };
    // if (this.CreatedBy != undefined && this.CreatedBy != "") {
    //   this.DraftedOrderArray = this.DraftedOrderArray.filter(item =>
    //     item.DataEnteredBy?.toLowerCase().includes(this.CreatedBy.trim().toLowerCase())
    //   );
    // };
    if (this.ProjectTitle != undefined && this.ProjectTitle != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.ProjectTitle?.toLowerCase().includes(
        //   this.ProjectTitle.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProjectTitle, item.ProjectTitle)
      );
    }
     if (this.Address != undefined && this.Address != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.ProjectTitle?.toLowerCase().includes(
        //   this.ProjectTitle.trim().toLowerCase()
        // )
        this.checkFilterData(this.Address, item.Address)
      );
    }
     if (this.Gate != undefined && this.Gate != '') {
      this.DraftedOrderArray = this.DraftedOrderArray.filter((item) =>
        // item.ProjectTitle?.toLowerCase().includes(
        //   this.ProjectTitle.trim().toLowerCase()
        // )
        this.checkFilterData(this.Gate, item.Gate)
      );
    }
    // if (this.OrderStatus != undefined && this.OrderStatus != "") {
    //   this.DraftedOrderArray = this.DraftedOrderArray.filter(item =>
    //     item.OrderShared?.toLowerCase().includes(this.OrderStatus.trim().toLowerCase())
    //   );
    // };
  }
  getSeachDateForm(): FormGroup {
    const requiredDateControl = this.searchForm?.get('RequiredDate')!;
    return requiredDateControl as FormGroup;
  }
  filterAllData() {
    this.DraftedOrderArray = JSON.parse(
      JSON.stringify(this.DraftedOrderArray_backup)
    );
    this.DraftedOrderArray = this.DraftedOrderArray.filter(
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
        this.getDateCompare(
          this.searchForm.controls.RequiredDate.value,
          item.RequiredDate
        ) &&
        this.getDateCompare(
          this.searchForm.controls.UpdateDate.value,
          item.UpdateDate
        )&&
        this.checkFilterData(
          this.searchForm.controls.Address.value,
          item.Address
        )&&
        this.checkFilterData(
          this.searchForm.controls.Gate.value,
          item.Gate
        )
    );
  }
  setColVisibility(val: any, field: string) {
    let index = this.draftColumns.findIndex(
      (x: any) => x.controlName === field
    );
    this.draftColumns[index].isVisible = val;

    let values = this.columnVisibiltyForm.value;
    localStorage.setItem('draftVisibleColumns', JSON.stringify(values));
  }
  dropCol(event: any) {
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex < this.fixedColumn &&
        event.currentIndex > this.fixedColumn
      ) {
        this.toastr.warning("Fixed columns can't be moved to normal columns!");
        // moveItemInArray(this.draftColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex > this.fixedColumn &&
        event.currentIndex < this.fixedColumn
      ) {
        // moveItemInArray(this.draftColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to fixed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.draftColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.draftColumns
        );
        moveItemInArray(this.draftColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.draftColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.draftColumns
      );
      moveItemInArray(this.draftColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('draftColumns', JSON.stringify(this.draftColumns));
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
      this.DraftedOrderArray = JSON.parse(
        JSON.stringify(this.DraftedOrderArray_backup)
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

  selectAllProject() {
    this.SelectedProjectCodes = this.ProjectList.map(
      (option: { ProjectCode: any }) => option.ProjectCode
    );
    this.draftOrderForm.controls['project'].patchValue(
      this.SelectedProjectCodes
    );
    this.changeproject(this.SelectedProjectCodes);
  }

  clearAllProject() {
    this.hideTable = true;
    this.SelectedProjectCodes = [];
    this.DraftedOrderArray = [];
    this.changeproject(this.SelectedProjectCodes);
  }

  selectAll_Address() {
    this.SelectedAddressCode = this.ProjectList.map(
      (option: { ProjectCode: any }) => option.ProjectCode
    );
    this.draftOrderForm.controls['address'].patchValue(
      this.SelectedAddressCode
    );
    this.changeAddress(this.SelectedAddressCode);
  }

  ClearAll_Address() {
    this.hideTable = true;
    this.SelectedAddressCode = [];
    this.DraftedOrderArray = [];
    this.changeAddress(this.SelectedAddressCode);
  }

  recordSelected(item: any, i: number) {
    console.log('recordSelected', item);
    this.SelectAllFlag = false;
    this.hideShare = true;
    this.hideUnshare = true;
    this.hideDelete = true;
    this.hideSent = true;
    this.hideSubmit = true;
    this.DraftedOrderArray[i].isSelected =
      !this.DraftedOrderArray[i].isSelected;
    for (let i = 0; i < this.DraftedOrderArray.length; i++) {
      if (this.DraftedOrderArray[i].isSelected) {
        this.hideShare = false;
        this.hideUnshare = false;
        this.hideDelete = false;
        if (this.DraftedOrderArray[i].lSubmission == 'Yes') {
          this.hideSubmit = false;
        } else {
          this.hideSent = false;
        }
        return;
      }
    }
  }

  iselected() {
    this.DraftedOrderArray_Temp = [];
    for (let i = 0; i < this.DraftedOrderArray.length; i++) {
      if (this.DraftedOrderArray[i].isSelected) {
        let obj = {
          SSNNo: this.DraftedOrderArray[i].SSNNo,
          OrderNo: this.DraftedOrderArray[i].OrderNo,
          PONo: this.DraftedOrderArray[i].PONo,

          //PlanDeliverdate: "",
          WBS1: this.DraftedOrderArray[i].WBS1,
          WBS2: this.DraftedOrderArray[i].WBS2,
          WBS3: this.DraftedOrderArray[i].WBS3,
          ProdType: this.DraftedOrderArray[i].ProdType,

          UpdateDate: this.DraftedOrderArray[i].UpdateDate,
          StructureElement: this.DraftedOrderArray[i].StructureElement,
          BBSNo: this.DraftedOrderArray[i].BBSNo,
          BBSDesc: this.DraftedOrderArray[i].BBSDesc,
          RequiredDate: this.DraftedOrderArray[i].RequiredDate,
          OrderStatus: this.DraftedOrderArray[i].OrderNo, //temp. it should be details column
          UpdateBy: this.DraftedOrderArray[i].UpdateBy,
          OrderWeight: this.DraftedOrderArray[i].OrderWeight,
          OrderShared: this.DraftedOrderArray[i].OrderShared,
          ScheduledProd: this.DraftedOrderArray[i].ScheduledProd,
          CustomerCode: this.DraftedOrderArray[i].CustomerCode,
          ProjectCode: this.DraftedOrderArray[i].ProjectCode,
          ProjectTitle: this.DraftedOrderArray[i].ProjectTitle,
          Address: this.DraftedOrderArray[i].Address,
          Gate: this.DraftedOrderArray[i].Gate,
          isSelected: this.DraftedOrderArray[i].isSelected,
          lUserType: this.DraftedOrderArray[i].lUserType,
          lSubmission: this.DraftedOrderArray[i].lSubmission,
          lEditable: this.DraftedOrderArray[i].lEditable,
          rowSelected: false,
        };

        this.DraftedOrderArray_Temp.push(obj);

        this.UserType = this.DraftedOrderArray[i].lUserType;
        // this.Submission = this.DraftedOrderArray[i].lSubmission;
        // this.Editable = this.DraftedOrderArray[i].lEditable;
      }
    }
  }

  Copy(item: any) {
    item = JSON.stringify(item, null, 2);
    console.log(item);
    this.clipboard.copy(item);
    this.toastr.success('Copied');
  }

  // GetOrderGridList(customerCode: any, projectCodes: any): void {
  //   this.DraftedOrderArray = [];
  //   if (customerCode != undefined && projectCodes.length > 0) {
  //     this.hideTable = false;
  //     this.DraftOrderLoading = true;

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
  //           .GetDraftedGridList(customerCode, projectCodes[i], false)
  //           .subscribe({
  //             next: (response) => {
  //               let temp = response;

  //               for (let i = 0; i < response.length; i++) {
  //                 temp[i].rowSelected = false;
  //               }
  //               this.DraftedOrderArray = this.DraftedOrderArray.concat(temp);

  //               this.multiSelect = this.multiSelect + 1;

  //               if (this.multiSelect == projectCodes.length) {
  //                 this.DraftOrderLoading = false;
  //               }
  //               this.totalCount = this.DraftedOrderArray.length;
  //               this.hideShare = true;
  //               this.hideUnshare = true;
  //               this.hideDelete = true;
  //               this.hideSent = true;
  //               this.hideSubmit = true;
  //               // this.CABtotalWeight = (this.getTotalWeight('CAB')).toFixed(3);
  //               // this.MESHtotalWeight = (this.getTotalWeight('MESH')).toFixed(3);
  //               // this.COREtotalWeight = (this.getTotalWeight('CORE CAGE')).toFixed(3);
  //               // this.PREtotalWeight = (this.getTotalWeight('PRE CAGE')).toFixed(3);
  //             },
  //             error: (e) => {},
  //             complete: () => {
  //               //debugger;
  //               this.DraftedOrderArray_backup = JSON.parse(
  //                 JSON.stringify(this.DraftedOrderArray)
  //               );
  //               this.ReloadLastSearch();
  //             },
  //           });
  //       }
  //     } else {
  //       this.orderService
  //         .GetDraftedGridList(customerCode, projectCodes[0], true)
  //         .subscribe({
  //           next: (response) => {
  //             let temp = response;

  //             for (let i = 0; i < response.length; i++) {
  //               temp[i].rowSelected = false;
  //             }
  //             this.DraftedOrderArray = this.DraftedOrderArray.concat(temp);

  //             this.DraftOrderLoading = false;
  //             this.totalCount = this.DraftedOrderArray.length;
  //             this.hideShare = true;
  //             this.hideUnshare = true;
  //             this.hideDelete = true;
  //             this.hideSent = true;
  //             this.hideSubmit = true;
  //           },
  //           error: (e) => {},
  //           complete: () => {
  //             //debugger;
  //             this.DraftedOrderArray_backup = JSON.parse(
  //               JSON.stringify(this.DraftedOrderArray)
  //             );
  //             this.ReloadLastSearch();
  //           },
  //         });
  //     }
  //   }
  // }

  GetOrderGridList(customerCode: any, projectCodes: any[]): void {
    if (!customerCode || !projectCodes || projectCodes.length === 0) {
      return;
    }
    this.requestQueue$.next({ customer: customerCode, projects: projectCodes });
  }


  /**
   * Internal handler for queued execution
   */
  private executeOrderGrid(customerCode: any, projectCodes: any[]) {
  return defer(() => {
    this.DraftOrderLoading = true;
    this.hideTable = false;
    this.DraftedOrderArray = [];
    this.totalCount = 0;
    this.multiSelect = 0;

    const allProjects = this.commonService.includeOptionalProjects;

    if (!allProjects) {
      return from(projectCodes).pipe(
        concatMap(code => this.orderService.GetDraftedGridList(customerCode, code, false).pipe(
          tap(response => {
            const formatted = response.map((r: any) => ({ ...r, rowSelected: false }));
            this.DraftedOrderArray = [...this.DraftedOrderArray, ...formatted];
            this.multiSelect++;
            this.totalCount = this.DraftedOrderArray.length;
            this.updateButtonVisibility();
          })
        )),
        finalize(() => {
          this.DraftOrderLoading = false;
          this.backupAndReload();
        })
      );
    } else {
      return this.orderService.GetDraftedGridList(customerCode, projectCodes[0], true).pipe(
        tap(response => {
          const formatted = response.map((r: any) => ({ ...r, rowSelected: false }));
          this.DraftedOrderArray = formatted;
          this.totalCount = formatted.length;
          this.updateButtonVisibility();
        }),
        finalize(() => {
          this.DraftOrderLoading = false;
          this.backupAndReload();
        })
      );
    }
  });
}


  /**
   * Common UI flag updates
   */
  private updateButtonVisibility() {
    this.hideShare = true;
    this.hideUnshare = true;
    this.hideDelete = true;
    this.hideSent = true;
    this.hideSubmit = true;
  }

  /**
   * Backup and reload logic after all data fetched
   */
  private backupAndReload() {
    this.DraftedOrderArray_backup = JSON.parse(
      JSON.stringify(this.DraftedOrderArray)
    );
    this.ReloadLastSearch();
  }

  getTotalWeight(producttype: any) {
    let totalweight = 0;
    for (let i = 0; i < this.DraftedOrderArray.length; i++) {
      if (this.DraftedOrderArray[i].ProdType == producttype) {
        totalweight =
          totalweight + Number(this.DraftedOrderArray[i].OrderWeight);
      }
    }
    return totalweight;
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
    for (let i = 0; i < this.DraftedOrderArray.length; i++) {
      let obj = {
        OrderNumber: this.DraftedOrderArray[i].OrderNo,
        PONumber: this.DraftedOrderArray[i].PONo,

        //PlanDeliverdate: "",
        WBS1: this.DraftedOrderArray[i].WBS1,
        WBS2: this.DraftedOrderArray[i].WBS2,
        WBS3: this.DraftedOrderArray[i].WBS3,
        ProductType: this.DraftedOrderArray[i].ProdType,
        StructureElement: this.DraftedOrderArray[i].StructureElement,
        BBSNo: this.DraftedOrderArray[i].BBSNo,
        BBSDesc: this.DraftedOrderArray[i].BBSDesc,
        RequiredDate: this.DraftedOrderArray[i].RequiredDate,
        OrderStatus: this.DraftedOrderArray[i].OrderNo, //temp. it should be details column
        Tonnage: this.DraftedOrderArray[i].RequiredDate,
        ProjectTitle: this.DraftedOrderArray[i].ProjectTitle,
         Address: this.DraftedOrderArray[i].Address,
          Gate: this.DraftedOrderArray[i].Gate,
        SubmittedBy: this.DraftedOrderArray[i].UpdateBy,
        UpdateDate: this.DraftedOrderArray[i].UpdateDate,
      };
      listTodownload.push(obj);
    }
    // listTodownload = this.DraftedOrderArray;
    this.name = 'DraftedOrderList';
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
      if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
        this.DraftedOrderArray.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else {
        this.DraftedOrderArray.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
        this.DraftedOrderArray.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else {
        this.DraftedOrderArray.sort((a, b) =>
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
  // sortItems(columnname: string) {
  //   //debugger;
  //   this.DraftedOrderArray = this.DraftedOrderArray_backup;
  //   if (this.isAscending) {
  //     if (columnname == 'OrderNo') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) => Number(a.OrderNo) - Number(b.OrderNo)
  //       );
  //     } else if (columnname == 'PONo') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>  a.PONo.localeCompare(b.PONo)
  //       );
  //     } else if (columnname == 'WBS1') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         // this.convertToAscii(a.WBS1) - this.convertToAscii(b.WBS1)
  //         a.WBS1.localeCompare(b.WBS1)
  //       );
  //     } else if (columnname == 'WBS2') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         //  this.convertToAscii(a.WBS2) - this.convertToAscii(b.WBS2)
  //          a.WBS2.localeCompare(b.WBS2)

  //       );
  //     } else if (columnname == 'WBS3') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         // this.convertToAscii(a.WBS3) - this.convertToAscii(b.WBS3)
  //         a.WBS3.localeCompare(b.WBS3)

  //       );
  //     } else if (columnname == 'ProdType') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           // this.convertToAscii(a.ProdType) - this.convertToAscii(b.ProdType)
  //           a.ProdType.localeCompare(b.ProdType)

  //       );
  //     } else if (columnname == 'StructureElement') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           a.StructureElement.localeCompare(b.StructureElement)

  //       );
  //     } else if (columnname == 'BBSNo') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         // this.convertToAscii(a.BBSNo) - this.convertToAscii(b.BBSNo)
  //         a.BBSNo.localeCompare(b.BBSNo)

  //       );
  //     } else if (columnname == 'BBSDesc') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           // this.convertToAscii(a.BBSDesc) - this.convertToAscii(b.BBSDesc)
  //           a.BBSDesc.localeCompare(b.BBSDesc)

  //       );
  //     } else if (columnname == 'RequiredDate') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>{
  //           // console.log("date",new Date(a.RequiredDate).getTime(),new Date(.RequiredDate).getTime());
  //           return new Date(a.RequiredDate).getTime() - new Date(b.RequiredDate).getTime()
  //         }

  //       );
  //     } else if (columnname == 'OrderWeight') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           // this.convertToAscii(a.OrderWeight) -
  //           // this.convertToAscii(b.OrderWeight)
  //                       a.OrderWeight.localeCompare(b.OrderWeight)

  //       );
  //     } else if (columnname == 'UpdateBy') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //                       a.UpdateBy.localeCompare(b.UpdateBy)

  //       );
  //     }
  //   } else if (!this.isAscending) {
  //     if (columnname == 'OrderNo') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           Number(b.OrderNo) - Number(a.OrderNo)
  //       );
  //     } else if (columnname == 'PONo') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         //  this.convertToAscii(b.PONo) - this.convertToAscii(a.PONo)
  //                     b.PONo.localeCompare(a.PONo)

  //       );
  //     } else if (columnname == 'WBS1') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         //  this.convertToAscii(b.WBS1) - this.convertToAscii(a.WBS1)
  //                    b.WBS1.localeCompare(a.WBS1)

  //       );
  //     }
  //     else if (columnname == 'WBS2') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         // this.convertToAscii(b.WBS2) - this.convertToAscii(a.WBS2)
  //                    b.WBS2.localeCompare(a.WBS2)

  //       );
  //     } else if (columnname == 'WBS3') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         //  this.convertToAscii(b.WBS3) - this.convertToAscii(a.WBS3)
  //                    b.WBS3.localeCompare(a.WBS3)

  //       );
  //     } else if (columnname == 'ProdType') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           // this.convertToAscii(b.ProdType) - this.convertToAscii(a.ProdType)
  //                      b.ProdType.localeCompare(a.ProdType)

  //       );
  //     } else if (columnname == 'StructureElement') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         b.StructureElement.localeCompare(a.StructureElement)

  //       );
  //     } else if (columnname == 'BBSNo') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //         //  this.convertToAscii(b.BBSNo) - this.convertToAscii(a.BBSNo)
  //                    b.BBSNo.localeCompare(a.BBSNo)

  //       );
  //     } else if (columnname == 'BBSDesc') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           // this.convertToAscii(b.BBSDesc) - this.convertToAscii(a.BBSDesc)
  //                      b.BBSDesc.localeCompare(a.BBSDesc)

  //       );
  //     } else if (columnname == 'RequiredDate') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           new Date(b.RequiredDate).getTime() - new Date(a.RequiredDate).getTime()

  //       );
  //     } else if (columnname == 'OrderWeight') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //           // this.convertToAscii(b.OrderWeight) -
  //           // this.convertToAscii(a.OrderWeight)
  //                      b.OrderWeight.localeCompare(a.OrderWeight)

  //       );
  //     }else if (columnname == 'UpdateBy') {
  //       this.DraftedOrderArray.sort(
  //         (a, b) =>
  //                       b.UpdateBy.localeCompare(a.UpdateBy)

  //       );
  //     }
  //   }
  // }

  Share() {
    let temp: any[] = [];
    for (let i = 0; i < this.DraftedOrderArray.length; i++) {
      if (this.DraftedOrderArray[i].isSelected == true) {
        temp.push(this.DraftedOrderArray[i]);
      }
    }
    this.UpdateRecord(temp, 'Shared');
  }

  Update(status: string) {
    let temp: any[] = [];
    for (let i = 0; i < this.DraftedOrderArray.length; i++) {
      if (this.DraftedOrderArray[i].isSelected == true) {
        temp.push(this.DraftedOrderArray[i]);
      }
    }
    this.UpdateRecord(temp, status);
  }

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
        if (SelectedRows[i].ProdType == 'CAB') {
          var lCABBBSDesc = SelectedRows[i].BBSDesc.split(',');
          if (lCABBBSDesc != null && lCABBBSDesc.length > 0) {
            for (let j = 0; j < lCABBBSDesc.length; j++) {
              var lBBSDesc = lCABBBSDesc[j].trim();
              if (lBBSDesc == '') {
                alert('Empty BBS Found. Please check');
                return;
              }
            }
          }

          // Enhancement - New validation for Transport Mode Mis-match
          let lTransportResp = await this.CheckTransportModeCABOrderSummary(SelectedRows[i].OrderNo);
          if (lTransportResp == 'error') {
            // Error during the API call.
            return;
          } else {
              if (lTransportResp.result == false) {
                if (lTransportResp?.transport == 'error') {
                  return;
                }
                
                // Shape Transport mis-match found
                var lTransprt = lTransportResp?.transport;
                if (lTransprt == 'LBE' || lTransprt == 'LB30') {
                  // LBE/LB30 transport mode found
                  this.OpenTransportAlertPopUp(SelectedRows[i].OrderNo);
                  return;
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

    this.DraftOrderLoading = true;
    let flag_save:any=false
    if(status=="Submitted" || status=="Sent")
    {
      flag_save = await this.getJoBIDCab(SelectedRows);

    }
  

    if(!flag_save)
    {
    let respChangeStatus = await this.BatchChangeStatus_Data(obj);
    this.DraftOrderLoading = false;

    console.log('respChangeStatus', respChangeStatus);
    if (respChangeStatus != null) {
      if (respChangeStatus.success == false) {
        alert(respChangeStatus.responseText);
        return;
      }
    }

    let tempOrderDis = orders.join(',');

    if (orders.length > 1) {
      if (status == 'Delete') {
        alert('The selected orders have been deleted successfully.');
      }
      if (status == 'Sent') {
        alert(
          'The selected orders have been submitted for approval successfully.'
        );
      }
      if (status == 'Submitted') {
        alert(
          'The selected orders have been submitted to NatSteel successfully.'
        );
      }
      if (status == 'Shared') {
        alert(
          'The selected orders have been shared to other users in the project.'
        );
      }
      if (status == 'Exclusive') {
        alert('The selected orders have been hold by you exclusively.');
      }
    } else {
      alert('Order(s) ' + tempOrderDis + ' ' + status + ' successfully!');
    }
    this.Loaddata();

  }
  this.DraftOrderLoading = false;
    // this.GetOrderGridList(this.draftOrderForm.controls['customer'].value,this.RefreshProject);
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
    localStorage.setItem('lastRow_Draft', JSON.stringify(row));
    localStorage.setItem(
      'lastSearch_Draft',
      JSON.stringify(this.searchForm.value)
    );

    // NOTE: GET ALL ORDERS WITH SIMILAR REF NUMBER
    let response: any = await this.GetOrderSet(row.OrderNo, true);

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
    let UpdatedProjects = this.dropdown.UpdateProjectCodeSequence(
      row.ProjectCode
    );
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

  ShowSelectUnselect() {
    return this.DraftedOrderArray.length > 0 ? false : true;
  }

  SelectAll(value: boolean) {
    this.hideShare = true;
    this.hideUnshare = true;
    this.hideDelete = true;
    this.hideSent = true;
    this.hideSubmit = true;

    this.SelectAllFlag = false;

    if (value === true) {
      this.hideDelete = false;
      this.hideSent = false;
      this.hideSubmit = false;
      this.SelectAllFlag = true;
    }
    this.DraftedOrderArray.forEach((element) => (element.isSelected = value));
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
    // console.log('getDateCompare=>', dateToCompare, actualDate);
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
  Reset_Filter() {
    this.searchForm.reset();
    this.clearInput++;
    this.searchData();
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
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
    this.draftColumns[index].left = width;
  }
  getLeftOfTable(index: number) {
    console.log('get called?', this.draftColumns[index].left);
    return this.draftColumns[index].left;
  }
  onWidthChange(obj: any) {
    this.draftColumns[obj.index].resizeWidth = obj.width;
    console.log('onWidthChange', this.draftColumns[obj.index]);
    this.SaveColumnsSetting();
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
    localStorage.setItem('draftColumns', JSON.stringify(this.draftColumns));
  }

  ExportDraftOrdersToExcel() {
    let customerCode = this.dropdown.getCustomerCode();
    let projectCodes: any = this.dropdown.getProjectCode();
    //":"2024-09-11 to 2024-09-18"

    // this.GetExportDeliDate();

    projectCodes = projectCodes.join(',');
    this.orderService
      .ExportDraftOrdersToExcel(customerCode, projectCodes)
      .subscribe({
        next: (response) => {
          console.log('Success');

          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'Draft Orders List-' + '.xlsx';
          a.click();
        },
        error: () => {},
        complete: () => {},
      });
  }

  highlightCurrentDate() {
    // Logic to find today's date in the calendar and add a 'highlight' class
  }
  syncScroll(event: any) {
    //this.tableContainer.nativeElement.scrollLeft = event.target.scrollLeft;
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
  // selectRow(row: any, dataList: any[], event: MouseEvent) {
  //   // this.myTable.nativeElement.tabIndex = 0;
  //   debugger;
  //   console.log('here', row);
  //   // this.setButtonDisplay(row.OrderStatus);
  //   dataList.forEach((element) => {
  //     element.rowSelected = false;
  //   });
  //   row.rowSelected = true;

  //   // this.Collapse = false;
  //   if (event.shiftKey) {
  //     // Handle multiselect with Shift key.
  //     if (this.lastPress.length) {
  //       let max = this.findMax(this.lastSelctedRow, this.firstSelectedRow);
  //       let min = this.findMin(this.lastSelctedRow, this.firstSelectedRow);

  //       this.lastSelctedRow = max;
  //       this.firstSelectedRow = min;
  //     }

  //     console.log('Multi Select Started');
  //     let lIndex = 0;

  //     // Get the index of the last selected row in the list.
  //     // for (let i = 0; i < dataList.length; i++) {
  //     //   lIndex = this.lastSelctedRow.rowSelected == true ? i : lIndex;
  //     // }
  //     lIndex = this.firstSelectedRow;
  //     // The index of the currently selected row in the list.
  //     let nIndex = dataList.findIndex((x) => x == row);

  //     if (nIndex > lIndex) {
  //       // Add all the rows between the two indexes.
  //       for (let i = lIndex; i < nIndex + 1; i++) {
  //         dataList[i].rowSelected = true;
  //         this.selectedRow.push(dataList[i]);
  //       }
  //       this.lastSelctedRow = nIndex;
  //     }
  //   } else {
  //     let lIndex = dataList.findIndex((x) => x == row);
  //     // The index of the currently selected row in the
  //     this.lastSelctedRow = lIndex;
  //     this.firstSelectedRow = lIndex;
  //   }

  //   console.log(this.DraftedOrderArray);
  // }

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
      this.DraftedOrderArray = dataList;

      // The index of the currently selected row is updated to be the value of variable => lastSelctedRow
      this.lastSelctedRow = lIndex;
    } else {
      let lIndex = dataList.findIndex((x) => x.SSNNo == row.SSNNo);
      // The index of the currently selected row in the
      this.lastSelctedRow = lIndex;
      this.firstSelectedRow = lIndex;
    }

    console.log(this.DraftedOrderArray);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey) {
      // Shift + ArrowDown
      if (event.key === 'ArrowDown') {
        if (this.lastPress == 'up') {
          this.DraftedOrderArray[this.lastSelctedRow].rowSelected =
            !this.DraftedOrderArray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow < this.DraftedOrderArray.length) {
          this.lastSelctedRow += 1;
          this.DraftedOrderArray[this.lastSelctedRow].rowSelected =
            !this.DraftedOrderArray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'down';
      }

      // Shift + ArrowUp
      if (event.key === 'ArrowUp') {
        // Case 1: If shrinking upwards, deselect the last selected row

        // Case 2: If expanding upwards, select rows above firstSelectedRow

        if (this.lastPress == 'down') {
          this.DraftedOrderArray[this.lastSelctedRow].rowSelected =
            !this.DraftedOrderArray[this.lastSelctedRow].rowSelected;
        } else if (this.lastSelctedRow > 0) {
          this.lastSelctedRow -= 1;
          this.DraftedOrderArray[this.lastSelctedRow].rowSelected =
            !this.DraftedOrderArray[this.lastSelctedRow].rowSelected;
        }
        this.lastPress = 'up';
      }

      this.scrollToSelectedRow(this.DraftedOrderArray);
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
  //   this.DraftedOrderArray.forEach(element=>{
  //     if(element.rowSelected && item!==element)
  //     {
  //       element.isSelected = true;
  //     }

  //   })
  // }

  SelectAllChecked(item: any) {
    // Select all the highlighted items
    let tempArray: any = JSON.parse(JSON.stringify(this.DraftedOrderArray));
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
      this.DraftedOrderArray = tempArray;
    } else {
      // In case a single item is selected, remove highlighting from others
      this.DraftedOrderArray.forEach(
        (element) => (element.rowSelected = false)
      );
    }

    // Revert it back to original state as it will be updated again in the functions => recordSelected
    item.isSelected = !item.isSelected;

    // Highlight the clicked row in all cases;
    item.rowSelected = true;
  }

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

  SetDelayForLoader() {
    if (!this.pSearchRefreshFlag) {
      let lClearFlag = this.commonService.clearDateRangeLoader;
      if (lClearFlag == true) {
        this.DraftOrderLoading = true;
      }
      setTimeout(() => {
        this.filterAllData();
        if (lClearFlag == true) {
          this.commonService.clearDateRangeLoader = false;
          this.DraftOrderLoading = false;
        }
      }, 1 * 1000);
    }
    this.pSearchRefreshFlag = false;
  }

  changecustomer(event: any) {
    this.CustomerCode = event;
    this.dropdown.setCustomerCode(this.CustomerCode);
    // Refresh the Value of CustomerCode in SideMenu;
    this.reloadService.reloadCustomerSideMenu.emit();

    this.SelectedProjectCodes = []; // Auto clear the selected project on customer change.
    this.changeproject(this.SelectedProjectCodes);
  }

  // RefreshProject: any[] = [];
  changeproject(event: any) {
    console.log('SelectedProjectCodes', this.SelectedProjectCodes);
    // Refresh the ProjectCode in SideMenu;
    this.dropdown.setProjectCode(this.SelectedProjectCodes);
    this.reloadService.reloadProjectSideMenu.emit();
  }

  changeAddress(event: any) {
    console.log('SelectedAddressCode', this.SelectedAddressCode);
    // Refresh the AddressCode in SideMenu;
    this.dropdown.setAddressList(this.SelectedAddressCode);
    this.reloadService.reloadAddressSideMenuEmitter.emit();
  }

  pSearchRefreshFlag: boolean = false;
  ReloadLastSearch() {
    let lItem: any = localStorage.getItem('lastRow_Draft');
    let lData: any = localStorage.getItem('lastSearch_Draft');
    if (lItem) {
      lItem = JSON.parse(lItem);
      lData = JSON.parse(lData);

      this.pSearchRefreshFlag = true;
      this.populateFormFromJson(lData);
      this.filterAllData();

      setTimeout(() => {
        this.DraftedOrderArray.forEach((x) => {
          if (x.OrderNo === lItem.OrderNo) {
            x.rowSelected = true;
          }
        });
      }, 1 * 500);
    }

    localStorage.removeItem('lastRow_Draft');
    localStorage.removeItem('lastSearch_Draft');
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
        UpdateBy: jsonData.UpdateBy || '',
        ProjectTitle: jsonData.ProjectTitle || '',
        Address: jsonData.Address || '',
        Gate: jsonData.Gate || '',
        UpdateDate: jsonData.UpdateDate || '',
      });

      console.log('Form populated with JSON data:', this.searchForm.value);
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }
  async CheckTransportModeCABOrderSummary(pOrderNumber: string | number): Promise<any> {
    try {
      const data = await this.orderService
        .CheckTransportModeCABOrderSummary(pOrderNumber)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      alert('Connection error, process failed.');
      return 'error';
    }
  }

  OpenTransportAlertPopUp(Order: any): void {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      TransportAlertMessageComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.pOrder = Order;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      return;
    });
  }
 async GetConversionSummary()
  {
    // let result = this.getJoBIDCab();
    let flag=false;
    let result_end:any[]=[];
    let OrderNumber:any="";
    let ordernumberString=""
    // this.CabJobIDs.forEach(async (element:any,index:number)=> {
    for(let i=0;i<this.CabJobIDs.length;i++){

    
      // this.CabJobIDs.forEach(async (element:any,index:number)=> {
      let status = await this.GetSb_Conversion_Status(this.CabJobIDs[i].customercode,this.CabJobIDs[i].projectcode,this.CabJobIDs[i].jobid)
      if(status.status!="SBConverted" && status.status!="" )
        {
          // let obj ={
          //   "status":status,
          //   "ordernumber":this.CabJobIDs[i].ordernumber
          // } 
          result_end.push(status);
          ordernumberString+=this.CabJobIDs[i].ordernumber + "\t"
          // OrderNumber+=element.
        }
    };
    if (result_end.length) {
      let message = "";
      flag=true;
      alert(
        `CAB to Standard Bar conversion not done  for order number :\n` +
        `${ordernumberString}` +

        `Please revisit the BBS entry and click on "Order Summary" for SB conversion.`
      );
    }

    return flag;

  }

  async getJoBIDCab(SelectedRows:any){
    debugger;
    let flag:any=false;
    let result_end: any = [];
    // this.getOrderNumberCab();
    // SelectedRows.forEach(async (element:any,index:number) => {
      for(let i=0;i<SelectedRows.length;i++)
        {

  
      let response = await this.getJobId(SelectedRows[i].OrderNo,SelectedRows[i].ProdType,SelectedRows[i].StructureElement);
      let JobID = response.CABJOBID;
          if(JobID)
          {
            let obj={
              "jobid":JobID,
              "customercode":SelectedRows[i].CustomerCode,
              "projectcode":SelectedRows[i].ProjectCode,
              "ordernumber":SelectedRows[i].OrderNo
            }
            result_end.push(obj);
          }
    }

    this.CabJobIDs =  result_end;
    flag = await this.GetConversionSummary();
    return flag;
  }
    // return flag;

  async getJobId(ordernumber:any,producttype:any,structureelement:any): Promise<any> {
    try {
      const data = await this.orderService
        .getJobId(ordernumber,producttype,structureelement,"N")
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async GetSb_Conversion_Status(customercode:any,projectcode:any,jobid:any): Promise<any> {
    try {
      const data = await this.orderService
        .GetSb_Conversion_Status(customercode,projectcode,jobid)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  UpdateColumnsWithGateAddresss() {
    console.log('draftColumns', this.draftColumns);

    let lAddressIndex = this.draftColumns.findIndex(
      (element) => element.controlName === 'Address'
    );
    let lGateIndex = this.draftColumns.findIndex(
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
      this.draftColumns.push(lObj);
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
      this.draftColumns.push(lObj);
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

