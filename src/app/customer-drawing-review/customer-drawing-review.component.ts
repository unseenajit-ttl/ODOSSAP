import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { StdProdDetailsModels } from 'src/app/Model/StdProdDetailsModels';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../Orders/order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ProcessSharedServiceService } from '../Orders/process-order/SharedService/process-shared-service.service';
import { LoginService } from 'src/app/services/login.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateordersharedserviceService } from '../Orders/createorder/createorderSharedservice/createordersharedservice.service';
import { Result } from 'src/app/Model/Result';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { number } from 'mathjs';
import { PreCastDetails } from '../Orders/bored-pile-cage/pile-entry/pile-entry.component';
import { WbsService } from '../wbs/wbs.service';
import { EmailNotificationToDetailerComponent } from './email-notification-to-detailer/email-notification-to-detailer.component';
import { FileDownloadDirService } from '../SharedServices/FileDownloadDir/file-download-dir.service';
import { ProductionRoutesService } from '../SharedServices/production-routes.service';
import { PrintpdfpopupComponent } from '../Orders/process-order/printpdfpopup/printpdfpopup.component';
import { SlicePipe } from '@angular/common';
import { NgZone } from '@angular/core';
import { AttachDocumentComponent } from '../wbs/wbsposting/attachdocuments/attachdocuments.component';
import { DocumentAttachForCustomerComponent } from './document-attach/document-attach.component';
import { HeaderColumn } from '../Model/reshuffle_column_table_structure';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import moment from 'moment';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-customer-drawing-review',
  templateUrl: './customer-drawing-review.component.html',
  styleUrls: ['./customer-drawing-review.component.css'],
})
export class CustomerDrawingReviewComponent {
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

  wbsstatusForm!: FormGroup;
  selectedStatusID: any;
  statusList: any;
  searchText: any = '';
  selectAllCheck: boolean = false;
  toggleFilters = true;
  isExpand: boolean = false;
  expandedDetails: any[] = [];
  filteredTableData: any[] = [];
  user_list: any[] = [];
  backup_user_list: any = [];
  editRemark = '';
  SelectedProjectID: any;
  loading: boolean = false;

  producttypeList: any;
  structureList: any;

  searchWbs1: any = '';
  searchWbs2: any = '';
  searchWbs3: any = '';
  searchProductType: any = '';
  searchStructure: any = '';
  searchTonnage: any = '';
  searchStatus: any;
  searchDate: any = '';
  searchRemark: any = '';
  requiredDate: any;
  poNo: any;
  poDate: any;
  drawingColumns: HeaderColumn[] = [];
  fixedColumn: number = 0;
  isAscending: boolean = false;
  currentSortingColumn: string = '';
  activeorderarray: any[] = [];
  editColumn: boolean = false;
  searchFields: any = {};
  clearInput: number = 0;
  searchForm: FormGroup;
  selectedRowIndex: any;
  isMobile = window.innerWidth;
  StartReqDate: any = null;
  EndReqDate: any = null;

  StartPlanDate: any = null;
  EndPlanDate: any = null;

  StartPODate: any = null;
  EndPODate: any = null;

  selectedCustomer: any;
  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;
  searchResult = true;
  ProjectCode: any;
  CustomerCode: any;
  constructor(
    private formBuilder: FormBuilder,
    private wbsService: WbsService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private loginService: LoginService,
    private productionRoutesService: ProductionRoutesService,
    private dropdown: CustomerProjectService,
    private datePipe: DatePipe,
    private reloadService: ReloadService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService:CommonService,
    private router: Router,
  ) {
    this.statusList = [
      { statusId: true, status: 'Approved' },
      { statusId: false, status: 'Rejected' },
      { statusId: 'pending', status: 'Pending' },
    ];

    this.wbsstatusForm = this.formBuilder.group({
      status: new FormControl([]), // Proper Reactive Form usage
      producttype: new FormControl([]),
      structurelement: new FormControl([]),
    });

    this.searchForm = this.formBuilder.group({
      WBS1: [''],
      WBS2: [''],
      WBS3: [''],
      ProductType: [''],
      StructureElement: [''],
      PostedTonnage: [''],
      RequiredDate: [''],
      PONumber: [''],
      PODate: [''],
      Status: [''],
      Date: [''],
      CustomerRemark: [''],
      Action: [''],
    });
  }

  tableData = [
    {
      wbs1: '100',
      wbs2: '1',
      wbs3: 'PREA1',
      Postage_tonage_wt: '10.2',
      status: 'Approved',
      Date_Submission: '',
      approval: '',
      isExpand: false,
      expandedDetails: [
        {
          sr: 1,
          docNo: 'D-001',
          revision: 'R1',
          remark: 'Good',
          fileName: 'file1.pdf',
          uploadedDate: '2024-03-01',
          uploadedBy: 'User1',
          detailerRemark: 'Checked',
          customerRemark: 'OK',
          action: 'View',
        },
        {
          sr: 2,
          docNo: 'D-002',
          revision: 'R2',
          remark: 'Pending',
          fileName: 'file2.pdf',
          uploadedDate: '2024-03-02',
          uploadedBy: 'User2',
          detailerRemark: 'Review',
          customerRemark: 'Check Again',
          action: 'Edit',
        },
      ],
    },
    {
      wbs1: 'Precage',
      wbs2: '2',
      wbs3: 'PREA2',
      Postage_tonage_wt: '8.2',
      status: 'Rejected',
      Date_Submission: '',
      approval: '',
      isExpand: false,
      expandedDetails: [
        {
          sr: 1,
          docNo: 'D-001',
          revision: 'R1',
          remark: 'Good',
          fileName: 'file1.pdf',
          uploadedDate: '2024-03-01',
          uploadedBy: 'User1',
          detailerRemark: 'Checked',
          customerRemark: 'OK',
          action: 'View',
        },
        {
          sr: 2,
          docNo: 'D-002',
          revision: 'R2',
          remark: 'Pending',
          fileName: 'file2.pdf',
          uploadedDate: '2024-03-02',
          uploadedBy: 'User2',
          detailerRemark: 'Review',
          customerRemark: 'Check Again',
          action: 'Edit',
        },
      ],
    },
    {
      wbs1: 'Procast',
      wbs2: '3',
      wbs3: 'PREA3',
      Postage_tonage_wt: '9.2',
      status: 'Approved',
      Date_Submission: '',
      approval: '',
      isExpand: false,
      expandedDetails: [
        {
          sr: 1,
          docNo: 'D-001',
          revision: 'R1',
          remark: 'Good',
          fileName: 'file1.pdf',
          uploadedDate: '2024-03-01',
          uploadedBy: 'User1',
          detailerRemark: 'Checked',
          customerRemark: 'OK',
          action: 'View',
        },
        {
          sr: 2,
          docNo: 'D-002',
          revision: 'R2',
          remark: 'Pending',
          fileName: 'file2.pdf',
          uploadedDate: '2024-03-02',
          uploadedBy: 'User2',
          detailerRemark: 'Review',
          customerRemark: 'Check Again',
          action: 'Edit',
        },
      ],
    },
    {
      wbs1: 'AjTest',
      wbs2: '4',
      wbs3: 'PREA4',
      Postage_tonage_wt: '12.2',
      status: 'Approved',
      Date_Submission: '',
      approval: '',
      isExpand: false,
      expandedDetails: [
        {
          sr: 1,
          docNo: 'D-001',
          revision: 'R1',
          remark: 'Good',
          fileName: 'file1.pdf',
          uploadedDate: '2024-03-01',
          uploadedBy: 'User1',
          detailerRemark: 'Checked',
          customerRemark: 'OK',
          action: 'View',
        },
        {
          sr: 2,
          docNo: 'D-002',
          revision: 'R2',
          remark: 'Pending',
          fileName: 'file2.pdf',
          uploadedDate: '2024-03-02',
          uploadedBy: 'User2',
          detailerRemark: 'Review',
          customerRemark: 'Check Again',
          action: 'Edit',
        },
      ],
    },
  ];

  ngOnInit(): void {
    if (this.highlightToday) {
      this.highlightCurrentDate();
    }

    this.initializeColumns();
    this.initializeForm();

    //   const savedColumns = localStorage.getItem('drawingColumns');
    // if (savedColumns) {
    //   try {
    //     this.drawingColumns = JSON.parse(savedColumns);
    //   } catch (err) {
    //     console.error('Failed to parse saved columns:', err);
    //     localStorage.removeItem('drawingColumns'); // reset if corrupted
    //   }
    // } else {
    //   // fallback: set default order from your original config
    //   this.drawingColumns;
    // }
    if (localStorage.getItem('drawingFixedColumns')) {
      let lVal = JSON.parse(localStorage.getItem('drawingFixedColumns')!);
      if (lVal) {
        this.fixedColumn = lVal;
      }
    }

    // debugger;
    // this.filteredTableData = [...this.tableData];
    // this.reloadService.reloadCustomer$.subscribe((data) => {
    //   // console.log("yes yes yes ")
    //   this.CustomerCode = this.dropdown.getCustomerCode()
    // });
    // this.reloadService.reload$.subscribe((data) => {
    //   if (true) {
    //     debugger;
    //     this.ProjectCode = localStorage.getItem("DetailingProjectCode");
    //     this.get_user_DrawingList(this.ProjectCode);
    //   }
    // });
    // this.ProjectCode = '' //this.dropdown.getProjectCode_Detailing();
    // this.CustomerCode = ''  //this.dropdown.getCustomerCode();
    // this.get_user_DrawingList(this.ProjectCode);
    // this.GetProductType();

    debugger;
    this.filteredTableData = [...this.tableData];
    this.reloadService.reloadCustomer$.subscribe((data) => {
      // console.log("yes yes yes ")
      this.CustomerCode = this.dropdown.getCustomerCode();
    });

    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        debugger;
        // this.ProjectCode = localStorage.getItem("DetailingProjectCode");
        this.ProjectCode = this.dropdown.getProjectCode()[0];
        this.get_user_DrawingList(this.ProjectCode);
        this.GetProductType();
      }
    });
    this.ProjectCode = this.dropdown.getProjectCode()[0];
    this.CustomerCode = this.dropdown.getCustomerCode();
    if (this.CustomerCode && this.ProjectCode) {
      this.get_user_DrawingList(this.ProjectCode);
      this.GetProductType();
    }


  }
  initializeColumns() {
    if (localStorage.getItem('drawingColumns')) {
      this.drawingColumns = JSON.parse(localStorage.getItem('drawingColumns')!);
      for (let i = 0; i < this.drawingColumns.length; i++) {
        if (this.drawingColumns[i].resizeWidth == '0') {
          this.drawingColumns[i].resizeWidth = '100';
        }
      }
    } else {
      this.drawingColumns = [
        {
          controlName: 'WBS1',
          displayName: 'WBS 1',
          chineseDisplayName: '楼座',
          field: 'WBS1',
          colName: 'WBS1',
          placeholder: 'Search WBS1',
          isVisible: true,
          width: '250',
          resizeWidth: '120',
          left: '0',
        },
        {
          controlName: 'WBS2',
          displayName: 'WBS 2',
          chineseDisplayName: '楼层',
          field: 'WBS2',
          colName: 'WBS2',
          placeholder: 'Search WBS2',
          isVisible: true,
          width: '250',
          resizeWidth: '120',
          left: '0',
        },
        {
          controlName: 'WBS3',
          displayName: 'WBS 3',
          chineseDisplayName: '分部',
          field: 'WBS3',
          colName: 'WBS3',
          placeholder: 'Search WBS3',
          isVisible: true,
          width: '250',
          resizeWidth: '120',
          left: '0',
        },
        {
          controlName: 'ProductType',
          displayName: 'Product Type',
          chineseDisplayName: '产品类型',
          field: 'ProductType',
          colName: 'ProductType',
          placeholder: 'Search Product Type',
          isVisible: true,
          width: '250',
          resizeWidth: '150',
          left: '0',
        },
        {
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          chineseDisplayName: '建筑构件',
          field: 'StructureElement',
          colName: 'StructureElement',
          placeholder: 'Search Structure Element',
          isVisible: true,
          width: '150',
          resizeWidth: '150',
          left: '0',
        },
        {
          controlName: 'PostedTonage',
          displayName: 'Posted Tonage',
          chineseDisplayName: '重量(吨)',
          field: 'PostedTonage',
          colName: 'PostedTonage',
          placeholder: 'Search Posted Tonage',
          isVisible: true,
          width: '150',
          resizeWidth: '150',
          left: '0',
        },
        {
          controlName: 'Required_Date',
          displayName: 'Required Date',
          chineseDisplayName: '交货日期',
          field: 'Required_Date',
          colName: 'Required_Date',
          placeholder: 'Search Required Date',
          isVisible: true,
          width: '350',
          resizeWidth: '200',
          left: '0',
        },
        {
          controlName: 'PO_Number',
          displayName: 'PO Number',
          chineseDisplayName: '订单号码',
          field: 'PO_Number',
          colName: 'PO_Number',
          placeholder: 'Search PO Number',
          isVisible: true,
          width: '350',
          resizeWidth: '150',
          left: '0',
        },
        {
          controlName: 'PO_Date',
          displayName: 'PO Date',
          chineseDisplayName: '订单日期',
          field: 'PO_Date',
          colName: 'PO_Date',
          placeholder: 'Search PO Date',
          isVisible: true,
          width: '350',
          resizeWidth: '200',
          left: '0',
        },
        {
          controlName: 'tntStatusId',
          displayName: 'Status',
          chineseDisplayName: '发表于',
          field: 'tntStatusId',
          colName: 'tntStatusId',
          placeholder: 'Search Status',
          isVisible: true,
          width: '150',
          resizeWidth: '150',
          left: '0',
        },
        {
          controlName: 'vchSubmitDate',
          displayName: 'Date',
          chineseDisplayName: '日期',
          field: 'vchSubmitDate',
          colName: 'vchSubmitDate',
          placeholder: 'Search Date',
          isVisible: true,
          width: '150',
          resizeWidth: '200',
          left: '0',
        },
        {
          controlName: 'vchCustomer_Remark',
          displayName: 'Customer Remark',
          chineseDisplayName: '',
          field: 'vchCustomer_Remark',
          colName: 'vchCustomer_Remark',
          placeholder: 'Search Remark',
          isVisible: true,
          width: '150',
          resizeWidth: '150',
          left: '0',
        },
        {
          controlName: 'action',
          displayName: 'Action',
          chineseDisplayName: '行动',
          field: 'action',
          colName: 'action',
          placeholder: '',
          isVisible: true,
          width: '150',
          resizeWidth: '150',
          left: '0',
        },
      ];
    }
  }

  initializeForm() {
    const controls: any = {};
    this.drawingColumns.forEach((col) => {
      controls[col.controlName] = [''];
    });
    this.searchForm = this.formBuilder.group(controls);

    // Listen for form changes (with small delay to avoid excessive filtering)
    // this.searchForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
    //   this.applyFilters();
    // });
    this.searchForm.valueChanges.pipe(debounceTime(300)).subscribe((formValues) => {
      // Find which control changed by comparing with the previous value
      console.log('Form values:', formValues);
      if (
        formValues.Required_Date.includes('Invalid') ||
        formValues.PO_Date.includes('Invalid')
      ) {
        console.log('Invalid date range input detected, skipping filter.');
        //this.loading = true;
        //this.filterAllData();
        this.SetDelayForLoader();
        //this.loading = false;
      } else {
        this.applyFilters();
      }
      console.log('Form values changed:', formValues);
      // for (const key in formValues) {
      //   if (formValues.hasOwnProperty(key)) {
      //     if (key === 'Required_Date' || key === 'PO_Date') {
      //       const currentValue = formValues[key];
      //       // You can check if the value actually changed if needed
      //       if (currentValue) {
      //         console.log(`Changed key: ${key}, New value:`, currentValue);
      //       }
      //     }
      //   }
      // }

      // this.applyFilters();
    });

  }
  SetDelayForLoader() {
    let lClearFlag = this.commonService.clearDateRangeLoader;
    // if (lClearFlag == true) {
    //   this.ActiveOrderLoading = true;
    // }
    setTimeout(() => {
      this.applyFilters();
      // if (lClearFlag == true) {
      //   this.commonService.clearDateRangeLoader = false;
      //   this.ActiveOrderLoading = false;
      // }
    }, 1 * 1000);
  }
  applyFilters() {
    const searchValues = this.searchForm.value;

    // Take only the keys which have a non-empty value
    const activeKeys = Object.keys(searchValues).filter(
      (key) => searchValues[key] !== null && searchValues[key] !== ''
    );

    this.user_list = this.backup_user_list.filter((item: any) => {
      if (activeKeys.length === 0) return true;

      return activeKeys.every((key) => {
        const filterVal = searchValues[key];

        // Handle date range fields
        if (key === 'Required_Date' || key === 'PO_Date') {
          const [startStr, endStr] = filterVal.trim().split('-').map((s:any) => s.trim());
          if (!startStr || !endStr) return true; // if range is incomplete, skip
          if( startStr.includes('Invalid') || endStr.includes('Invalid')) return true; // if invalid date, skip
          const start = moment(startStr, 'DD/MM/YYYY', true);
          const end = moment(endStr, 'DD/MM/YYYY', true);
          const cellDate = moment(item[key], 'YYYY-MM-DD', true);

          // Compare only valid dates
          if (!cellDate.isValid()) return false;

          return cellDate.isSameOrAfter(start) && cellDate.isSameOrBefore(end);
        }
        if( key === 'tntStatusId') {
          if(item.IsApproved === true){
            item.status = 'Approved';
          }else if(item.IsApproved === false){
            item.status = 'Rejected';
          }else if(item.IsApproved === null && item.intWBSElementID > 0){
            item.status = 'Pending';
          }else{
            item.status = 'Not Submitted';
          }
          key = 'status';
        }

        // Default text or value filter (case-insensitive)
        const cellValue = item[key]?.toString().toLowerCase() || '';
        return cellValue.includes(filterVal.toString().toLowerCase().trim());
      });
    });
  }

  highlightCurrentDate() {
    // Logic to find today's date in the calendar and add a 'highlight' class
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
  ToggleSelectAll(pEvent: any) {
    if (pEvent) {
      if (pEvent.target.checked) {
        // this.SelectAll_Selected();
      } else {
        // this.UnselectAll_Selected();
      }
    }
  }

  searchTable_global() {
    if (!this.searchText) {
      // If search is empty, reset list to original
      this.user_list = [...this.backup_user_list];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();

    this.user_list = this.backup_user_list.filter(
      (item: { [s: string]: unknown } | ArrayLike<unknown>) =>
        Object.values(item).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm)
        )
    );
  }
  formatAPIDates() {
    this.user_list = this.user_list.map((item) => {
      const newItem = { ...item };
      if (newItem.Required_Date) {
        const d = newItem.Required_Date.toString().trim();
        newItem.Required_Date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(
          6,
          8
        )}`;
      }
      if (newItem.PO_Date) {
        const d = newItem.PO_Date.toString().trim();
        newItem.PO_Date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      }

      return newItem;
    });
    this.backup_user_list = JSON.parse(JSON.stringify(this.user_list));
  }

  get_user_DrawingList(projectcode: string) {
    debugger;
    this.loading = true;
    this.wbsService.Drawing_User_data_new(projectcode).subscribe({
      next: (response) => {
        debugger;
        if (response) {
          this.user_list = response;
          this.user_list.forEach((element: any) => {
            element.isExpand = false;
            // element.vchSubmitDate = this.formatDate(element.vchSubmitDate.toString());
          });
          this.formatAPIDates();
        }
      },
      error: (error) => {},
      complete: () => {
        this.loading = false;
      },
    });
  }

  status(status: boolean, item: any) {
    console.log('item.INTWBSELEMENTID;', item.INTWBSELEMENTID);
    console.log('item.status;', status);
    this.wbsService.Drawing_Approval(item.intWBSElementID, status).subscribe({
      next: (Response) => {
        this.toastr.success('Status changed Successfully');
      },
      error: (err) => {
        this.toastr.error(err.error);
      },
      complete: () => {
        this.get_user_DrawingList(this.ProjectCode);
      },
    });
  }

  changeStatus() {
    this.user_list = JSON.parse(JSON.stringify(this.backup_user_list));

    this.user_list = this.user_list.filter((item: any) => {
      debugger;
      return item.IsApproved == this.wbsstatusForm.value.status;
    });
  }

  user_review(UserReview: string, DrawingId: number) {
    this.wbsService.Edit_user_review(UserReview, DrawingId).subscribe({
      next: (response) => {},
      error: (error) => {
        this.toastr.error('Customer Review failed to Update ');
        this.editRemark = '';
      },
      complete: () => {
        this.editRemark = '';
        this.toastr.success('Customer Review Updated sucessfully ');
      },
    });
  }

  GetProductType(): void {
    this.wbsService.GetProductType().subscribe({
      next: (response) => {
        this.producttypeList = response;
      },
      error: (e) => {},
      complete: () => {
        this.GetStructElement();
      },
    });
  }
  changeProductType() {
    debugger;

    const selectedProductType = this.wbsstatusForm.value.producttype;
    console.log('Selected Product Type:', selectedProductType);

    if (!this.backup_user_list || !Array.isArray(this.backup_user_list)) {
      console.error('Backup user list is empty or invalid.');
      return;
    }

    this.user_list = [...this.backup_user_list];

    if (selectedProductType) {
      this.user_list = this.user_list.filter((item: any) => {
        return (
          item.ProductType?.toLowerCase() === selectedProductType.toLowerCase()
        );
      });

      console.log('Filtered List:', this.user_list);
    }
  }
  ChangeStructureElement() {
    debugger;

    const SelectedStructureEle = this.wbsstatusForm.value.structurelement;
    console.log('Selected Product Type:', SelectedStructureEle);

    if (!this.backup_user_list || !Array.isArray(this.backup_user_list)) {
      console.error('Backup user list is empty or invalid.');
      return;
    }

    this.user_list = [...this.backup_user_list];

    if (SelectedStructureEle) {
      this.user_list = this.user_list.filter((item: any) => {
        return (
          item.StructureElement?.toLowerCase() ===
          SelectedStructureEle.toLowerCase()
        );
      });

      console.log('Filtered List:', this.user_list);
    }
  }

  GetStructElement(): void {
    this.wbsService.GetStructElement().subscribe({
      next: (response) => {
        this.structureList = response;
      },
      error: (e) => {
        //console.log(e.error);
      },
      complete: () => {
        this.changeProductType();
      },
    });
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    // this.enableEditIndex = null;
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    // this.enableEditIndex = null;
  }

  openPopup(status: any, item: any) {
    debugger;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    item.CustomerCode = this.selectedCustomer;
    item.ProjectCode = localStorage.getItem('DetailingProjectCode');
    const modalRef = this.modalService.open(
      EmailNotificationToDetailerComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.gOrderList = item;
    modalRef.componentInstance.gStatus = status;
    modalRef.result
      .then((modalResult) => {
        if (modalResult == true) {
          //added for disable button
          //item.IsApproved = status;
          this.get_user_DrawingList(this.ProjectCode);
          console.log('Modal Ref=>', modalResult);

          //this.onReset();
        }
      })
      .catch((err) => {
        console.log('Modal dismissed:', err);
      });
  }

  ConvertToDate(dateString: string) {
    const date = new Date(dateString);

    // Convert the date to ISO format
    return this.formatDate(date.toISOString());
  }
  formatDate(isoDate: string): string | null {
    return this.datePipe.transform(isoDate, 'yyyy-MM-dd hh:mm a');
  }
  ViewDocument(data: any, index: number): any {
    debugger;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 15 * 1000); // 15 sec

    // Get the specific item using the index
    const item = data.Drawing_List[index];
    console.log('Selected Item:', item);

    if (item) {
      this.loading = true;

      let ddCustomerCode = this.CustomerCode;
      let ddProjectCode = this.ProjectCode;
      let ddFileName = item.FileName;
      let ddRevision = item.Revision;
      let UserType = this.loginService.GetUserType();

      //const apiUrl = 'http://localhost:55592/api/SharePointAPI/ShowDirView/' + ddCustomerCode + '/' + ddProjectCode + '/' + ddFileName + '/' + ddRevision;
      const apiUrl = `${this.productionRoutesService.SharepointService}/ShowDirView`;
      let obj = {
        ddCustomerCode,
        ddProjectCode,
        ddFileName,
        ddRevision,
        UserType,
      };

      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
        windowClass: 'your-custom-dialog-class',
      };

      const modalRef = this.modalService.open(
        PrintpdfpopupComponent,
        ngbModalOptions
      );
      modalRef.componentInstance.anchorLink = apiUrl;
      modalRef.componentInstance.FileName = ddFileName;
      modalRef.componentInstance.Params = obj;
      this.loading = false;
    }
  }

  Download_Selected(data: any, index: number): any {
    debugger;

    // Validate data and index
    if (
      !data ||
      !data.Drawing_List ||
      index < 0 ||
      index >= data.Drawing_List.length
    ) {
      console.error('Invalid data or index out of range.');
      return;
    }

    // Get the specific item using the index
    const item = data.Drawing_List[index];
    console.log('Selected Item for Download:', item);

    if (!item) {
      console.error('Invalid item.');
      return;
    }

    this.loading = true; // Start loader

    let ddCustomerCode = this.CustomerCode;
    let ddProjectCode = this.ProjectCode;
    let ddFileName = item.FileName;
    let ddRevision = item.Revision;
    let UserType = this.loginService.GetUserType();

    const apiUrl = `${this.productionRoutesService.SharepointService}/ShowDirDownload`;
    const obj = {
      ddCustomerCode,
      ddProjectCode,
      ddFileName,
      ddRevision,
      UserType,
    };

    // Call the download service and ensure loader stops on completion or error
    this.downloadFile(apiUrl, obj, ddFileName)
      .then(() => {
        console.log('Download completed successfully.');
        this.loading = false; // Stop loader
      })
      .catch((error: any) => {
        console.error('Download failed:', error);
        this.loading = false; // Stop loader on error
      });
  }

  downloadFile(apiUrl: string, obj: any, fileName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Perform the actual download (example using fetch or HttpClient)
      fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          resolve();
        })
        .catch((error) => reject(error));
    });
  }

  searchTableData() {
    debugger;
    this.user_list = JSON.parse(JSON.stringify(this.backup_user_list));

    if (this.searchWbs1 != undefined) {
      this.user_list = this.user_list.filter((item) =>
        item.WBS1.toLowerCase().includes(this.searchWbs1.trim().toLowerCase())
      );
    }
    if (this.searchWbs2 != undefined) {
      this.user_list = this.user_list.filter((item) =>
        item.WBS2.toLowerCase().includes(this.searchWbs2.trim().toLowerCase())
      );
    }
    if (this.searchWbs3 != undefined) {
      this.user_list = this.user_list.filter((item) =>
        item.WBS3.toLowerCase().includes(this.searchWbs3.trim().toLowerCase())
      );
    }

    if (this.searchProductType != undefined) {
      this.user_list = this.user_list.filter((item) => {
        item.ProductType = item.ProductType == null ? '' : item.ProductType;
        return item.ProductType.toLowerCase().includes(
          this.searchProductType.trim().toLowerCase()
        );
      });
    }
    if (this.searchStructure != undefined) {
      this.user_list = this.user_list.filter((item) => {
        item.StructureElement =
          item.StructureElement == null ? '' : item.StructureElement;

        return item.StructureElement.toString()
          .toLowerCase()
          .includes(this.searchStructure.trim().toLowerCase());
      });
    }
    if (this.searchTonnage != undefined) {
      this.user_list = this.user_list.filter((item) =>
        item.PostedTonage.toString()
          .toLowerCase()
          .includes(this.searchTonnage.toString().toLowerCase())
      );
    }
    if (this.requiredDate) {
      const requiredDate = new Date(this.requiredDate);

      this.user_list = this.user_list.filter((item) => {
        if (!item.Required_Date) return false;

        const itemDate = new Date(item.Required_Date);
        return itemDate.toDateString() === requiredDate.toDateString(); // compare only date part
      });
    }
    if (this.poDate) {
      const poDate = new Date(this.poDate);

      this.user_list = this.user_list.filter((item) => {
        if (!item.PO_Date) return false;

        const itemDate = new Date(item.PO_Date);
        return itemDate >= poDate; // keep items on or after poDate
      });
    }

    if (this.poNo != undefined) {
      this.user_list = this.user_list.filter(
        (item) =>
          item.PO_Number != null &&
          item.PO_Number.toString()
            .toLowerCase()
            .includes(this.poNo.toString().toLowerCase())
      );
    }
    if (this.searchStatus != null) {
      if (this.searchStatus == 'pending') {
        this.user_list = this.user_list.filter((item: any) => {
          debugger;
          return item.IsApproved == null;
        });
      } else {
        this.user_list = this.user_list.filter((item: any) => {
          debugger;
          return item.IsApproved == this.searchStatus;
        });
      }
    }
    if (this.searchDate != undefined) {
      this.user_list = this.user_list.filter((item) =>
        item.vchSubmitDate
          .toString()
          .toLowerCase()
          .includes(this.searchDate.toString().toLowerCase())
      );
    }
    if (this.searchRemark != undefined) {
      this.user_list = this.user_list.filter((item) =>
        item.vchCustomer_Remark
          .toString()
          .toLowerCase()
          .includes(this.searchRemark.toString().toLowerCase())
      );
    }
  }
  getSeachDateForm(): FormGroup {
    const requiredDateControl = this.searchForm?.get('RequiredDate')!;
    return requiredDateControl as FormGroup;
  }
  onReset() {
    this.wbsstatusForm.reset();
    this.get_user_DrawingList(this.ProjectCode);
    console.log('status', this.user_list[0].tntStatusId);
  }

  onClear() {
    this.searchStatus = undefined;
    this.searchTableData();
  }

  sortColumn: string = '';
  sortDirection: string = 'asc';

  sortTable(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.user_list.sort((a: any, b: any) => {
      let valA = a[column];
      let valB = b[column];

      if (column === 'vchSubmitDate') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }

  changeHeader() {
    this.user_list = JSON.parse(JSON.stringify(this.backup_user_list));

    const selectedProductType = this.wbsstatusForm.value.producttype;

    if (selectedProductType) {
      this.user_list = this.user_list.filter((item: any) => {
        return (
          item.ProductType?.toLowerCase() === selectedProductType.toLowerCase()
        );
      });

      console.log('Filtered List:', this.user_list);
    }
    // this.changeProductType();
    const SelectedStructureEle = this.wbsstatusForm.value.structurelement;
    if (SelectedStructureEle) {
      this.user_list = this.user_list.filter((item: any) => {
        return (
          item.StructureElement?.toLowerCase() ===
          SelectedStructureEle.toLowerCase()
        );
      });

      console.log('Filtered List:', this.user_list);
    }

    let status = this.wbsstatusForm.value.status;

    if (status == 'pending') {
      this.user_list = this.user_list.filter((item: any) => {
        debugger;
        return item.IsApproved == null;
      });
    } else if (status === true || status === false) {
      this.user_list = this.user_list.filter((item: any) => {
        debugger;
        return item.IsApproved == status;
      });
    }
  }

  openDocument(item: any) {
    debugger;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    item.CustomerCode = this.CustomerCode;
    item.ProjectCode = localStorage.getItem('DetailingProjectCode');
    const modalRef = this.modalService.open(
      DocumentAttachForCustomerComponent,
      ngbModalOptions
    );
    const obj = {
      INTWBSELEMENTID: item.intWBSElementID,
      StructureElement: item.StructureElement,
      ProductType: item.ProductType,
      VCHWBS1: item.WBS1,
      VCHWBS3: item.WBS2,
      VCHWBS2: item.WBS3,
      TNTSTATUSID: item.tntStatusId,
    };
    modalRef.componentInstance.SelectedRecord = obj;

    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      console.log('No of Doc', x);
      item.NoofAttachedDoc = x;
    });
    // console.log('OrderSummaryTableData', this.OrderSummaryTableData);
  }
  UpdateDrawingStatus(WBSID: number, DrawingStatus: string): void {
    if (DrawingStatus !== 'Submitted') return;

    this.wbsService.modifyDrawing_Status(WBSID).subscribe({
      next: (response) => {
        this.producttypeList = response;
      },
      error: (e) => {},
      complete: () => {
        this.toastr.success('Status change Successfully');
        this.get_user_DrawingList(this.ProjectCode);
      },
    });
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
    // persist visibility/order in local storage or backend
    localStorage.setItem('drawingColumns', JSON.stringify(this.drawingColumns));
  }

  dropCol(event: any) {
    debugger;
    if (true) {
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
          this.drawingColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.drawingColumns
        );
        moveItemInArray(this.drawingColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      //let index= this.CheckCurrentIndex(event.currentIndex,this.activeColumns)
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.drawingColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.drawingColumns
      );
      moveItemInArray(this.drawingColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('drawingColumns', JSON.stringify(this.drawingColumns));
  }

  //  dropCol(event: CdkDragDrop<any[]>) {
  //   moveItemInArray(this.drawingColumns, event.previousIndex, event.currentIndex);
  // }
  onWidthChange(obj: any) {
    this.drawingColumns[obj.index].resizeWidth = obj.width;
    console.log('onWidthChange', this.drawingColumns[obj.index]);
    this.SaveColumnsSetting();
  }
  //  getRightWidthTest(element: HTMLElement, j: number) {
  //   let width = this.getAllPreviousSiblings(element);
  //   console.log('previousSibling=>', width);

  //   this.setLeftOfTabble(j, width);
  //   // this.changeDetectorRef.detectChanges();
  //   return width + 'px';
  // }
  // getRightWidthTest(
  //   thNomVar: HTMLElement | null,
  //   index: number
  // ): number | null {
  //   if (!thNomVar) return 0; // or handle gracefully
  //   const rect = thNomVar.getBoundingClientRect();
  //   return rect.left;
  // }
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
    this.drawingColumns[index].left = width;
  }
  getLeftOfTable(index: number) {
    console.log('get called?', this.drawingColumns[index].left);
    return this.drawingColumns[index].left;
  }
  //  onWidthChange(obj: any) {
  //     this.drawingColumns[obj.index].resizeWidth = obj.width;
  //     console.log('onWidthChange', this.drawingColumns[obj.index]);
  //     this.SaveColumnsSetting();
  //   }
  //    SaveColumnsSetting() {
  //     localStorage.setItem('drawingColumns', JSON.stringify(this.drawingColumns));
  //   }
  HoverSetting: boolean = false;
  @HostListener('document:click', ['$event'])
  handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      if (this.HoverSetting == false) {
        this.editColumn = false;
      }
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

  UpdateFixedColumns1(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('drawingFixedColumns', pVal);
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
  Reset_Filter() {
    this.searchTableData();
  }
  // getMinWidth(id: string) {
  //   if (this.FixedCoulmnList.includes(id)) {
  //     const divstartElement: HTMLElement | null =
  //       document.getElementById('index');
  //     let startPoint = divstartElement!.clientWidth;
  //     for (let i = 0; i < this.FixedCoulmnList.length; i++) {
  //       let tempId = this.FixedCoulmnList[i];
  //       if (tempId == id) {
  //         break;
  //       }
  //       const divElement: HTMLElement | null = document.getElementById(tempId);
  //       startPoint = startPoint + divElement!.clientWidth;
  //     }

  //     let lReturn = startPoint.toString() + 'px';
  //     return lReturn;
  //   }

  //   return 'inherit';
  // }

  // isColumnFixed(id: string) {
  //   return this.FixedCoulmnList.includes(id);
  // }

  //   onGetDateSelected(range: any) {
  //   console.log('onGetDateSelected =>', range);

  //   if (range.from && range.to) {
  //     this.searchForm
  //       .get(range.controlName)
  //       ?.setValue(
  //         moment(range.from).format('DD/MM/yyyy') +
  //           ' - ' +
  //           moment(range.to).format('DD/MM/yyyy')
  //       );
  //   }

  //   console.log(
  //     'Updated form value:',
  //     this.searchForm.get(range.controlName)?.value
  //   );
  // }
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
  getMinHeightIncoming(id: string) {
    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
      return divElement.clientHeight;
    }
    return 50;
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

  toggleSortingOrder(columnname: string, actualColName: any) {
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    // this.sortItems(columnname);
    if (this.isAscending) {
      if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
        this.user_list.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else {
        this.user_list.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
        this.user_list.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else {
        this.user_list.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
  }
  //   selectRow(row: any, dataList: any[], event: MouseEvent) {
  //   // this.myTable.nativeElement.tabIndex = 0;
  //   debugger;
  //   console.log('here', row);

  //   let tempDataList = JSON.parse(JSON.stringify(dataList)); // create a temp data list in case ctrl key is pressed;

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
  //     let nIndex = dataList.findIndex((x) => x.SSNNo == row.SSNNo);

  //     if (nIndex > lIndex) {
  //       // Add all the rows between the two indexes.
  //       for (let i = lIndex; i < nIndex + 1; i++) {
  //         dataList[i].rowSelected = true;
  //         this.selectedRow.push(dataList[i]);
  //       }
  //       this.lastSelctedRow = nIndex;
  //     }
  //   } else if (event.ctrlKey) {
  //     // If Ctrl key is pressed restore the list to original state and highlight the currently selected row
  //     dataList = JSON.parse(JSON.stringify(tempDataList));
  //     let lIndex = dataList.findIndex((x) => x.SSNNo == row.SSNNo);
  //     if (lIndex != -1) {
  //       dataList[lIndex].rowSelected = true;
  //     }

  //     // For this scenario, the list needs to be reupdated into the original array as we created a shallow copy of the list
  //     this.DraftedOrderArray = dataList;

  //     // The index of the currently selected row is updated to be the value of variable => lastSelctedRow
  //     this.lastSelctedRow = lIndex;
  //   } else {
  //     let lIndex = dataList.findIndex((x) => x.SSNNo == row.SSNNo);
  //     // The index of the currently selected row in the
  //     this.lastSelctedRow = lIndex;
  //     this.firstSelectedRow = lIndex;
  //   }

  //   console.log(this.DraftedOrderArray);
  // }

  dateChange(date: any) {
    console.log(date.value);
    if (date.value == '') {
      this.user_list = JSON.parse(JSON.stringify(this.backup_user_list));
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
      this.searchTableData();
    }
    // this.filterData();
  }

  onRequiredDateSelected(event: any) {
    // You can adapt this to your date picker output
    this.requiredDate = event.from;
    this.searchTableData();
  }

  onPoDateSelected(event: any) {
    this.poDate = event.from;
    this.searchTableData();
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
  drawingReport()
  {
    if(this.CustomerCode && this.ProjectCode){
      this.router.navigate(['/wbs/wbsposting/drawingreport'],{
        queryParams: { module: 'drawingApproval',CustomerCode: this.CustomerCode,ProjectCode:this.ProjectCode},
      });
    }else{
      alert('Please select Customer and Project')
    }
  }
}
