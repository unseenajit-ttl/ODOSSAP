import {
  animate,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProcessordercontractlistComponent } from './processordercontractlist/processordercontractlist.component';
import { ProcessordersearchPOComponent } from './processordersearch-po/processordersearch-po.component';
import { OrderService } from '../orders.service';
import { ProcessOrder } from 'src/app/Model/processorder';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UpdateProjectManagementComponent } from './update-project-management/update-project-management.component';
import { UpdateDetaillingInchargeComponent } from './update-detailling-incharge/update-detailling-incharge.component';
import { UpdateProjectInchargeComponent } from './update-project-incharge/update-project-incharge.component';
import { UpdateTechnicalRemarksComponent } from './update-technical-remarks/update-technical-remarks.component';
import { DocumentsAttachedComponent } from './documents-attached/documents-attached.component';
import { UpdateConfirmationComponent } from './update-confirmation/update-confirmation.component';
import { UpdateProcessSORModel } from 'src/app/Model/UpdateProcessSORModel';
import { DatePipe } from '@angular/common';
import { BbsNumberListComponent } from './bbs-number-list/bbs-number-list.component';
import { SubmitProcessModel } from 'src/app/Model/SubmitProcessModel';
import { HttpClient } from '@angular/common/http';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessSharedServiceService } from './SharedService/process-shared-service.service';
import { CheckOrdersUpdateModel } from 'src/app/Model/CheckOrdersUpdateModel';
import { GetSubmittedPOSearchModel } from 'src/app/Model/GetSubmittedPOSearchModel';
import { CheckOrderCancelModel } from 'src/app/Model/CheckOrderCancelModel';
import { number } from 'mathjs';
import { ForecastdataModel } from 'src/app/Model/ForecastdataModel';
import moment from 'moment';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { LoginService } from 'src/app/services/login.service';
import { SaveBBSOrderDetails } from 'src/app/Model/SaveBBSOrderDetails';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SaveJobAdvice_CAB } from 'src/app/Model/SaveJobAdvice_CAB';
import { SelectEditor } from 'angular-slickgrid';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, elementAt } from 'rxjs';
import { DataUtils } from 'three';
import { CancelCabOrdersComponent } from './cancel-cab-orders/cancel-cab-orders.component';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import { CalendarHeaderFormatComponent } from 'src/app/SharedComponent/calendar-header-format/calendar-header-format.component';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { DeliveredOrderDocumentComponent } from '../deliveredorder/delivered-order-document/delivered-order-document.component';
import { ProcessSelectionModelComponent } from './selection-model/process-selection-model/process-selection-model.component';
import { LoadDetailsComponent } from './load-details/load-details/load-details.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { PrintpdfpopupComponent } from './printpdfpopup/printpdfpopup.component';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ConfirmExcessMailComponent } from './confirm-excess-mail/confirm-excess-mail.component';
import { UpdateStructureElement } from 'src/app/Model/updateStructureElement';
import { EsmPopUpDragDropComponent } from '../esm-new/esm-pop-up-drag-drop/esm-pop-up-drag-drop.component';

// import { smoothscroll } from './node_modules/smoothscroll-polyfill';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD', //YYYY-MM-DD
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-process-order',
  templateUrl: './process-order.component.html',
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  styleUrls: ['./process-order.component.css'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate('500' + 'ms ease-in')),
      transition('true => false', animate('500' + 'ms ease-out')),
    ]),
  ],
})
export class ProcessOrderComponent implements OnInit {
  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('bodyContainer') bodyContainer!: ElementRef<HTMLDivElement>;

  public rows: { col1: number; col2: string }[] = [];
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  // @ViewChild('myTable') myTable!: ElementRef;

  //Process tab
  @ViewChild('scrollViewportProcessing', { static: false })
  public viewPort: CdkVirtualScrollViewport | undefined;

  //Search tab
  @ViewChild('scrollViewportSearch', { static: false })
  public viewPortSearch: CdkVirtualScrollViewport | undefined;

  // Detailling Tab
  @ViewChild('scrollViewportDET', { static: false })
  public viewPortDET: CdkVirtualScrollViewport | undefined;

  // Incoming Tab
  @ViewChild('scrollViewportIncoming', { static: false })
  public viewPortIncoming: CdkVirtualScrollViewport | undefined;

  // PendingEnt Tab
  @ViewChild('scrollViewportENT', { static: false })
  public viewPortENT: CdkVirtualScrollViewport | undefined;

  // Cancelled Tab
  @ViewChild('scrollViewportCancelled', { static: false })
  public viewPortCancelled: CdkVirtualScrollViewport | undefined;

  // All Tab
  @ViewChild('scrollViewportAll', { static: false })
  public viewPortAll: CdkVirtualScrollViewport | undefined;

  @Output() clickOutside = new EventEmitter<void>();
  CustomerCode1: any = '0001101200';
  ProjectCode1: any = '0000113134';
  JobID: any = 294388;
  OrderSource: any = 'UX';
  StructureElement: any = 'NONWBS';
  ProductType: any;
  ScheduleProd: any;
  StructreElement: any = 'NONWBS';
  ProdType: any = 'STANDARD-MESH';
  ScheduledProd: any = 'N';
  incomingCols: any[] = [];
  incomingColsExcel: any[] = [];
  pendingEntColsExcel: any[] = [];
  dettColsExcel: any[] = [];
  pendingEntCols: any[] = [];
  dettCols: any[] = [];
  cancelledCols: any[] = [];
  cancelledColsExcel: any[] = [];
  processingCols: any[] = [];
  processingColsExcel: any[] = [];
  allDataColsExcel: any[] = [];
  searchColsExcel: any[] = [];
  allDataCols: any[] = [];
  searchCols: any[] = [];
  wbs1List: any[] = [];
  wbs2List: any[] = [];
  wbs3List: any[] = [];
  ProcessOrderForm!: FormGroup;
  ProcessorderCheckbox!: FormGroup;
  ProcessorderRemarks!: FormGroup;
  activeTab = 1;
  //TABLE SEARCH FORMGROUPS
  IncomingTableSearch!: FormGroup;
  PendingEntTableSearch!: FormGroup;
  PendingDETTableSearch!: FormGroup;
  CancelledTableSearch!: FormGroup;
  ProcessingTableSearch!: FormGroup;
  SearchResultTableSearch!: FormGroup;
  AllTableSearch!: FormGroup;

  //TABLE COLUMNS TOGGLE FORMGROUPS
  IncomingTableColumnToggle!: FormGroup;
  PendingEntTableColumnToggle!: FormGroup;
  PendingDETTableColumnToggle!: FormGroup;
  CancelledTableColumnToggle!: FormGroup;
  ProcessingTableColumnToggle!: FormGroup;
  AllTableColumnToggle!: FormGroup;
  SearchTableColumnToggle!: FormGroup;
  itemSize = 30;
  Remarks: any = '';

  InternalRemarks: any = '';
  ExternalRemarks: any = '';
  InvoiceRemarks: any = '';

  Collapse: boolean = false;
  PendingENT: any[] = [];
  PendingENTBackUp: any[] = [];
  IncomingData: any[] = [];
  BackupIncomingData: any[] = [];
  PendingDET: any[] = [];
  CancelData: any[] = [];
  ProcessingData: any[] = [];
  PendingDETBackup: any[] = [];
  CancelBackup: any[] = [];
  ProcessBackup: any[] = [];
  SearchResultData: any[] = [];
  SearchResultDataBackup: any[] = [];
  AllData: any[] = [];
  AllDataBackup: any[] = [];

  ContractList: any[] = [];
  ContractListDDL: any[] = [];
  OrderTypeList: any[] = ['CREDIT', 'CASH', 'FOC'];
  VehicleTypeList: any = ([] = []);
  VehicleTypeList2: any[] = [];
  ShipPartyList: any = ([] = []);
  GreenSteelData: any[] = [];
  LOW_CARBON_RATE: any;
  EPD_VALUE: any;
  RECYCLE_CONTENT: any;

  showStdMESH: boolean = false;
  showBBS: boolean = false;
  showBBSBar: boolean = false;
  showStdProd: boolean = false;
  showMESH: boolean = false;
  showBPC: boolean = false;
  showComponent: boolean = false;
  contractcolorred: boolean = false;
  contractcoloryellow: boolean = false;

  OrderDetailsList_StdMESH: any[] = [];
  OrderDetailsList_BBS: any[] = [];
  OrderDetailsList_BBSBar: any[] = [];
  OrderDetailsList_StdProd: any[] = [];
  OrderDetailsList_MESH: any[] = [];
  OrderDetailsList_BPC: any[] = [];
  OrderDetailsList_Component: any[] = [];
  HoverSetting: boolean = false;
  pageSize = 0;
  pageSizeENT = 0;
  pageSizeCancel = 0;
  pageSizeIncoming = 0;
  pageSizeProcessing = 0;
  pageSizeSearch = 0;
  pageSizeAll = 0;

  currentPage = 1;
  currentPageENT = 1;
  currentPageCancel = 1;
  currentPageIncoming = 1;
  currentPageProcessing = 1;
  currentPageSearch = 1;
  currentPageAll = 1;

  itemsPerPage: number = 10;
  itemsPerPageENT: number = 10;
  itemsPerPageCancel: number = 10;
  itemsPerPageIncoming: number = 10;
  itemsPerPageProcessing: number = 10;
  itemsPerPageSearch: number = 10;
  itemsPerPageAll: number = 10;

  maxSizeCancel: number = 10;
  maxSizeProcessing: number = 10;
  maxSizeSearch: number = 10;
  maxSizeAll: number = 10;

  searchText: any = '';
  processorderarray: any[] = [];
  ProcessOrderLoading: boolean = false;

  selectedRow: any[] = [];
  CurrentTab: string = 'CREATING';

  toggleFilter: boolean = true;
  togglePendingENTSettingMenu: boolean = false;
  toggleIncomingSettingMenu: boolean = false;
  togglePendingDETSettingMenu: boolean = false;
  toggleCancelledSettingMenu: boolean = false;
  toggleProcessingSettingMenu: boolean = false;
  toggleSeacrhSettingMenu: boolean = false;
  toggleAllSettingMenu: boolean = false;

  ContractSelectColor: string = 'inherit';
  contractterm: boolean = true;

  showWBS: boolean = true;
  showInvoiceRemarks: boolean = true;
  showOrderDetailsTable: boolean = true;

  projectStageddl: any[] = [];

  currSubmitRow: number = 0;
  SelectedCheckBoxes: any;

  totalOrderedWeight: string = '';
  lOrdersCT: any;
  lOrdersWT: any;

  showTotalWeight: boolean = true;
  showTotalPcs: boolean = true;
  showCabWeight: boolean = false;
  showSbWeight: boolean = false;
  showProjectStage: boolean = false;
  showSONumber: boolean = true;

  disableSubmit: boolean = true;
  disableWithdraw: boolean = true;
  disableCancel: boolean = true;
  disableUpdate: boolean = true;
  disableAmmend: boolean = true;

  RowsHidden: boolean = false;
  isAscending: boolean = false;
  showPonumber: boolean = true;
  currentSortingColumn: string = '';
  showOrderNo: boolean = true;

  ForeCast: any = '';
  isLoading = false;  

  editBBSDesc: boolean = false;
  currEditIndex: any;
  lHolidays: any = [];
  editBBSNo: boolean = false;
  calHeader = CalendarHeaderFormatComponent;
  searchFixedColumn = 0;
  processingFixedColumn = 0;
  cancelledFixedColumn = 0;
  detFixedColumn = 0;
  incomingFixedColumn = 0;
  pendingEntFixedColumn = 0;
  allFixedColumn = 0;

  cellSelection: boolean = false;
  isMobile = window.innerWidth;
  gClick: MouseEvent = {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    button: 0,
    buttons: 0,
    clientX: 0,
    clientY: 0,
    metaKey: false,
    movementX: 0,
    movementY: 0,
    offsetX: 0,
    offsetY: 0,
    pageX: 0,
    pageY: 0,
    relatedTarget: null,
    screenX: 0,
    screenY: 0,
    x: 0,
    y: 0,
    getModifierState: function (keyArg: string): boolean {
      throw new Error('Function not implemented.');
    },
    initMouseEvent: function (
      typeArg: string,
      canBubbleArg: boolean,
      cancelableArg: boolean,
      viewArg: Window,
      detailArg: number,
      screenXArg: number,
      screenYArg: number,
      clientXArg: number,
      clientYArg: number,
      ctrlKeyArg: boolean,
      altKeyArg: boolean,
      shiftKeyArg: boolean,
      metaKeyArg: boolean,
      buttonArg: number,
      relatedTargetArg: EventTarget | null
    ): void {
      throw new Error('Function not implemented.');
    },
    detail: 0,
    view: null,
    which: 0,
    initUIEvent: function (
      typeArg: string,
      bubblesArg?: boolean | undefined,
      cancelableArg?: boolean | undefined,
      viewArg?: Window | null | undefined,
      detailArg?: number | undefined
    ): void {
      throw new Error('Function not implemented.');
    },
    bubbles: false,
    cancelBubble: false,
    cancelable: false,
    composed: false,
    currentTarget: null,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    returnValue: false,
    srcElement: null,
    target: null,
    timeStamp: 0,
    type: '',
    composedPath: function (): EventTarget[] {
      throw new Error('Function not implemented.');
    },
    initEvent: function (
      type: string,
      bubbles?: boolean | undefined,
      cancelable?: boolean | undefined
    ): void {
      throw new Error('Function not implemented.');
    },
    preventDefault: function (): void {
      throw new Error('Function not implemented.');
    },
    stopImmediatePropagation: function (): void {
      throw new Error('Function not implemented.');
    },
    stopPropagation: function (): void {
      throw new Error('Function not implemented.');
    },
    AT_TARGET: 0,
    BUBBLING_PHASE: 0,
    CAPTURING_PHASE: 0,
    NONE: 0,
    // layerX: 0,
    // layerY: 0,
  };
  gSearchTabFlag: boolean = false; //Set it as true when the datalist for Search tab is loaded for the firdt time
  constructor(
    private modalService: NgbModal,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private createSharedService: CreateordersharedserviceService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private processsharedserviceService: ProcessSharedServiceService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private renderer: Renderer2,
    private dateAdapter: DateAdapter<Date>,
    private commonService: CommonService,
    public datepipe: DatePipe,
    private elementRef: ElementRef
  ) {
    this.lHolidays = this.loginService.GetHoliday();
  }
  dateClass = (date: Date) => {
    const day = this.dateAdapter.getDayOfWeek(date);
    // Sunday is 0, Saturday is 6
    if (day === 0) {
      return 'weekend-color weekend';
    }

    let lCurrentDay =
      (this.dateAdapter.getMonth(date) + 1).toString() +
      '/' +
      this.dateAdapter.getDate(date).toString() +
      '/' +
      this.dateAdapter.getYear(date).toString();
    lCurrentDay = new Date(lCurrentDay.toString()).toLocaleDateString();

    // console.log('lCurrentDay', lCurrentDay, this.lHolidays);

    if (this.lHolidays.includes(lCurrentDay)) {
      return 'weekend-color';
    }
    return '';
  };
  ngOnInit(): void {
    debugger
    //Update the table columns
    this.UpdateLocalStorageColumnName();
    this.VehicleTypeList2 = [
      {
        code: 'HC',
        value: 'HC Haip Crane',
      },
      {
        code: 'LB40',
        value: 'LB40 40ft Low Bed',
      },
      {
        code: 'LBE',
        value: 'LBE Low Bed Escoted',
      },
      {
        code: 'SC',
        value: 'SC Self Collection',
      },
      {
        code: 'TR40/24',
        value: 'TR40/24 40ft 24mt Trailer',
      },
    ];
    this.commonService.changeTitle('Process Orders | ODOS');
    let lCellSelection = localStorage.getItem('CellSelectionMode');
    if (lCellSelection) {
      if (lCellSelection == 'true') {
        this.cellSelection = true;
      } else {
        this.cellSelection = false;
      }
    }

    // smoothscroll.polyfill();
    //this.GetProcessOrderForCreate('CREATING', false);

    this.SetStartingTab();
    this.GetProcessVehicleType();
    this.GetProjectStageddl();
    //this.GetWBS1();
    this.setFixedColumns();

    this.UpdateProcessForms();

    this.IncomingTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterIncomingTableData();
    });
    this.PendingEntTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterPendingEntTableData();
    });
    this.PendingDETTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterPendingDetTableData();
    });
    this.CancelledTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterCancelledTableData();
    });
    this.ProcessingTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterProcessingTableData();
    });
    this.SearchResultTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterSearchTableData();
    });
    this.AllTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterAllTableData();
    });

    // this.ProcessOrderForm.get('VehicleType')!.valueChanges.subscribe(newValue => {
    //   this.checkLowBed(this.ProcessOrderForm.controls.VehicleType.value);
    // });

    // On Changing Req/Revised REq Date, Call their corresponding Update function.
    // this.ProcessOrderForm.get('ReqDate')!.valueChanges.subscribe((newValue) => {
    //   this.setReqDateFrom();
    // });
    // this.ProcessOrderForm.get('UpdateReqDate')!.valueChanges.subscribe(
    //   (newValue) => {
    //     this.setReqDateTo();
    //   }
    // );

    this.ProcessOrderForm.get('Contract')!.valueChanges.subscribe(
      (newValue) => {
        let lContract = this.ProcessOrderForm.get('Contract')?.value;
        if (lContract) {
          if (lContract.$ngOptionLabel) {
            lContract = lContract.$ngOptionLabel;
            lContract = lContract.trim();
            this.ProcessOrderForm.get('Contract')?.patchValue(lContract);
          }
          this.ChangeContract(this.ProcessOrderForm.get('Contract')?.value);
        }
      }
    );
    // this.PendingEntTableSearch.valueChanges.subscribe((newValue) => {
    //   this.FilterPendingEntTableData();
    // });
    // this.PendingEntTableSearch.valueChanges.subscribe((newValue) => {
    //   this.FilterPendingEntTableData();
    // });
    this.setColumStrucure();

    /**
     * Custom keydown functions for table
     */
    //  this.renderer.listen(this.tableContainer.nativeElement, 'keydown', (event) => {
    //   console.log("print HERE")
    //   if (event.ctrlKey && event.key === 'c') {
    //     if (document.activeElement === this.myTable.nativeElement) {
    //       console.log("KeyDown -> button pressed");
    //       // this.copySelectedRows();
    //     }
    //   }
    // });

    this.UpdateColList(); // Update col list for all the columns where the width value have 'px' in it.
    this.UpdateProcessTabs();
  }

  UpdateProcessForms() {
    this.IncomingTableColumnToggle = this.formBuilder.group({
      OrderNo: new FormControl(true),
      CustomerStatus: new FormControl(true),
      Customer: new FormControl(true),
      Project: new FormControl(true),
      StructureElement: new FormControl(true),
      ProductType: new FormControl(true),
      WBS1: new FormControl(true),
      WBS2: new FormControl(true),
      WBS3: new FormControl(true),
      PONo: new FormControl(true),
      BBSNo: new FormControl(true),
      PODate: new FormControl(true),
      RequiredDate: new FormControl(true),
      RevisedReqDate: new FormControl(true),
      ForecastDate: new FormControl(true),
      LowerFloorDeliveryDate: new FormControl(true),
      DifferentDays: new FormControl(true),
      ConfirmedDelDate: new FormControl(true),
      TotalWT: new FormControl(true),
      Transport: new FormControl(true),
      SORNo: new FormControl(true),
      SONo: new FormControl(true),
      PMRemarks: new FormControl(true),
      TechRemarks: new FormControl(true),
      AttachedNo: new FormControl(true),
      DataEnteredBy: new FormControl(true),
      SubmittedBy: new FormControl(true),
      ProjectIncharge: new FormControl(true),
      DetailingIncharge: new FormControl(true),
      ProcessDate: new FormControl(true),
      LinkTo: new FormControl(true),
    });
    this.PendingEntTableColumnToggle = this.formBuilder.group({
      OrderNo: new FormControl(true),
      CustomerStatus: new FormControl(true),
      Customer: new FormControl(true),
      Project: new FormControl(true),
      StructureElement: new FormControl(true),
      ProductType: new FormControl(true),
      WBS1: new FormControl(true),
      WBS2: new FormControl(true),
      WBS3: new FormControl(true),
      PONo: new FormControl(true),
      BBSNo: new FormControl(true),
      PODate: new FormControl(true),
      RequiredDate: new FormControl(true),
      RevisedReqDate: new FormControl(true),
      ForecastDate: new FormControl(true),
      LowerFloorDeliveryDate: new FormControl(true),
      DifferentDays: new FormControl(true),
      ConfirmedDelDate: new FormControl(true),
      TotalWT: new FormControl(true),
      Transport: new FormControl(true),
      SORNo: new FormControl(true),
      SONo: new FormControl(true),
      PMRemarks: new FormControl(true),
      TechRemarks: new FormControl(true),
      AttachedNo: new FormControl(true),
      DataEnteredBy: new FormControl(true),
      SubmittedBy: new FormControl(true),
      ProjectIncharge: new FormControl(true),
      DetailingIncharge: new FormControl(true),
      ProcessDate: new FormControl(true),
      LinkTo: new FormControl(true),
    });
    this.PendingDETTableColumnToggle = this.formBuilder.group({
      OrderNo: new FormControl(true),
      CustomerStatus: new FormControl(true),
      Customer: new FormControl(true),
      Project: new FormControl(true),
      StructureElement: new FormControl(true),
      ProductType: new FormControl(true),
      WBS1: new FormControl(true),
      WBS2: new FormControl(true),
      WBS3: new FormControl(true),
      PONo: new FormControl(true),
      BBSNo: new FormControl(true),
      PODate: new FormControl(true),
      RequiredDate: new FormControl(true),
      RevisedReqDate: new FormControl(true),
      ForecastDate: new FormControl(true),
      LowerFloorDeliveryDate: new FormControl(true),
      DifferentDays: new FormControl(true),
      ConfirmedDelDate: new FormControl(true),
      TotalWT: new FormControl(true),
      Transport: new FormControl(true),
      SORNo: new FormControl(true),
      SONo: new FormControl(true),
      PMRemarks: new FormControl(true),
      TechRemarks: new FormControl(true),
      AttachedNo: new FormControl(true),
      DataEnteredBy: new FormControl(true),
      SubmittedBy: new FormControl(true),
      ProjectIncharge: new FormControl(true),
      DetailingIncharge: new FormControl(true),
      ProcessDate: new FormControl(true),
      LinkTo: new FormControl(true),
    });
    this.CancelledTableColumnToggle = this.formBuilder.group({
      OrderNo: new FormControl(true),
      CustomerStatus: new FormControl(true),
      Customer: new FormControl(true),
      Project: new FormControl(true),
      StructureElement: new FormControl(true),
      ProductType: new FormControl(true),
      WBS1: new FormControl(true),
      WBS2: new FormControl(true),
      WBS3: new FormControl(true),
      PONo: new FormControl(true),
      BBSNo: new FormControl(true),
      PODate: new FormControl(true),
      RequiredDate: new FormControl(true),
      RevisedReqDate: new FormControl(true),
      ForecastDate: new FormControl(true),
      LowerFloorDeliveryDate: new FormControl(true),
      DifferentDays: new FormControl(true),
      ConfirmedDelDate: new FormControl(true),
      TotalWT: new FormControl(true),
      Transport: new FormControl(true),
      SORNo: new FormControl(true),
      SONo: new FormControl(true),
      PMRemarks: new FormControl(true),
      TechRemarks: new FormControl(true),
      AttachedNo: new FormControl(true),
      DataEnteredBy: new FormControl(true),
      SubmittedBy: new FormControl(true),
      ProjectIncharge: new FormControl(true),
      DetailingIncharge: new FormControl(true),
      ProcessDate: new FormControl(true),
      LinkTo: new FormControl(true),
    });
    this.SearchTableColumnToggle = this.formBuilder.group({
      SOrderNo: new FormControl(true),
      SORNo: new FormControl(true),
      SONo: new FormControl(true),
      CustomerStatus: new FormControl(true),
      SAPRejectStatus: new FormControl(true),
      StructureElement: new FormControl(true),
      ProductType: new FormControl(true),
      PONo: new FormControl(true),
      BBSNo: new FormControl(true),
      BBSDescription: new FormControl(true),
      PODate: new FormControl(true),
      RequiredDate: new FormControl(true),
      RevisedReqDate: new FormControl(true),
      ForecastDate: new FormControl(true),
      LowerFloorDeliveryDate: new FormControl(true),
      DifferentDays: new FormControl(true),
      ConfirmedDelDate: new FormControl(true),
      TotalWT: new FormControl(true),
      TotalMT: new FormControl(true),
      PMRemarks: new FormControl(true),
      TechRemarks: new FormControl(true),
      ProcessedBy: new FormControl(true),
      Customer: new FormControl(true),
      Project: new FormControl(true),
      WBS1: new FormControl(true),
      WBS2: new FormControl(true),
      WBS3: new FormControl(true),
      SubmittedBy: new FormControl(true),
      ProjectIncharge: new FormControl(true),
      DetailingIncharge: new FormControl(true),
      PPContract: new FormControl(true),
      OrderType: new FormControl(true),
      ContractNumber: new FormControl(true),
      SORStatus: new FormControl(true),
      CreditBlockStatus: new FormControl(true),
      ErrorLog: new FormControl(true),
      InternalRemark: new FormControl(true),
      ExternalRemark: new FormControl(true),
      LoadNumber: new FormControl(true),
      DeliveryStatus: new FormControl(true),
      DONo: new FormControl(true),
      WTNo: new FormControl(true),
      WTDate: new FormControl(true),
      DeliveredPieces: new FormControl(true),
      BalancePieces: new FormControl(true),
      UrgentOrder: new FormControl(true),
      ZeroTolerance: new FormControl(true),
      CallBefDel: new FormControl(true),
      SpecialPass: new FormControl(true),
      LorryCrane: new FormControl(true),
      PremiumService: new FormControl(true),
      CraneBook: new FormControl(true),
      BargeBook: new FormControl(true),
      PoliceEscort: new FormControl(true),
      ONHOLD: new FormControl(true),
      CONQUAS: new FormControl(true),
      LowBedAllowed: new FormControl(true),
      FiftyTonAllowed: new FormControl(true),
      Transport: new FormControl(true),
      SubSegment: new FormControl(true),
      NDSStatus: new FormControl(true),
      ReleasedBy: new FormControl(true),
      ReleasedDate: new FormControl(true),
      RuningNo: new FormControl(true),
      LeadTime: new FormControl(true),
      ProcessDate: new FormControl(true),
      AccountManager: new FormControl(true),
      Documents: new FormControl(true),
    });
    this.ProcessingTableColumnToggle = this.formBuilder.group({
      SOrderNo: new FormControl(true),
      SORNo: new FormControl(true),
      SONo: new FormControl(true),
      CustomerStatus: new FormControl(true),
      SAPRejectStatus: new FormControl(true),
      StructureElement: new FormControl(true),
      ProductType: new FormControl(true),
      PONo: new FormControl(true),
      BBSNo: new FormControl(true),
      BBSDescription: new FormControl(true),
      PODate: new FormControl(true),
      RequiredDate: new FormControl(true),
      RevisedReqDate: new FormControl(true),
      ForecastDate: new FormControl(true),
      LowerFloorDeliveryDate: new FormControl(true),
      DifferentDays: new FormControl(true),
      ConfirmedDelDate: new FormControl(true),
      TotalWT: new FormControl(true),
      TotalMT: new FormControl(true),
      PMRemarks: new FormControl(true),
      TechRemarks: new FormControl(true),
      ProcessedBy: new FormControl(true),
      Customer: new FormControl(true),
      Project: new FormControl(true),
      WBS1: new FormControl(true),
      WBS2: new FormControl(true),
      WBS3: new FormControl(true),
      SubmittedBy: new FormControl(true),
      ProjectIncharge: new FormControl(true),
      DetailingIncharge: new FormControl(true),
      PPContract: new FormControl(true),
      OrderType: new FormControl(true),
      ContractNumber: new FormControl(true),
      SORStatus: new FormControl(true),
      CreditBlockStatus: new FormControl(true),
      ErrorLog: new FormControl(true),
      InternalRemark: new FormControl(true),
      ExternalRemark: new FormControl(true),
      LoadNumber: new FormControl(true),
      DeliveryStatus: new FormControl(true),
      DONo: new FormControl(true),
      WTNo: new FormControl(true),
      WTDate: new FormControl(true),
      DeliveredPieces: new FormControl(true),
      BalancePieces: new FormControl(true),
      UrgentOrder: new FormControl(true),
      ZeroTolerance: new FormControl(true),
      CallBefDel: new FormControl(true),
      SpecialPass: new FormControl(true),
      LorryCrane: new FormControl(true),
      PremiumService: new FormControl(true),
      CraneBook: new FormControl(true),
      BargeBook: new FormControl(true),
      PoliceEscort: new FormControl(true),
      ONHOLD: new FormControl(true),
      CONQUAS: new FormControl(true),
      LowBedAllowed: new FormControl(true),
      FiftyTonAllowed: new FormControl(true),
      Transport: new FormControl(true),
      SubSegment: new FormControl(true),
      NDSStatus: new FormControl(true),
      ReleasedBy: new FormControl(true),
      ReleasedDate: new FormControl(true),
      RuningNo: new FormControl(true),
      LeadTime: new FormControl(true),
      ProcessDate: new FormControl(true),
      AccountManager: new FormControl(true),
      Documents: new FormControl(true),
    });

    this.AllTableColumnToggle = this.formBuilder.group({
      SOrderNo: new FormControl(true),
      SORNo: new FormControl(true),
      SONo: new FormControl(true),
      CustomerStatus: new FormControl(true),
      SAPRejectStatus: new FormControl(true),
      StructureElement: new FormControl(true),
      ProductType: new FormControl(true),
      PONo: new FormControl(true),
      BBSNo: new FormControl(true),
      BBSDescription: new FormControl(true),
      PODate: new FormControl(true),
      RequiredDate: new FormControl(true),
      RevisedReqDate: new FormControl(true),
      ForecastDate: new FormControl(true),
      LowerFloorDeliveryDate: new FormControl(true),
      DifferentDays: new FormControl(true),
      ConfirmedDelDate: new FormControl(true),
      TotalWT: new FormControl(true),
      TotalMT: new FormControl(true),
      PMRemarks: new FormControl(true),
      TechRemarks: new FormControl(true),
      ProcessedBy: new FormControl(true),
      Customer: new FormControl(true),
      Project: new FormControl(true),
      WBS1: new FormControl(true),
      WBS2: new FormControl(true),
      WBS3: new FormControl(true),
      SubmittedBy: new FormControl(true),
      ProjectIncharge: new FormControl(true),
      DetailingIncharge: new FormControl(true),
      PPContract: new FormControl(true),
      OrderType: new FormControl(true),
      ContractNumber: new FormControl(true),
      SORStatus: new FormControl(true),
      CreditBlockStatus: new FormControl(true),
      ErrorLog: new FormControl(true),
      InternalRemark: new FormControl(true),
      ExternalRemark: new FormControl(true),
      LoadNumber: new FormControl(true),
      DeliveryStatus: new FormControl(true),
      DONo: new FormControl(true),
      WTNo: new FormControl(true),
      WTDate: new FormControl(true),
      DeliveredPieces: new FormControl(true),
      BalancePieces: new FormControl(true),
      UrgentOrder: new FormControl(true),
      ZeroTolerance: new FormControl(true),
      CallBefDel: new FormControl(true),
      SpecialPass: new FormControl(true),
      LorryCrane: new FormControl(true),
      PremiumService: new FormControl(true),
      CraneBook: new FormControl(true),
      BargeBook: new FormControl(true),
      PoliceEscort: new FormControl(true),
      ONHOLD: new FormControl(true),
      CONQUAS: new FormControl(true),
      LowBedAllowed: new FormControl(true),
      FiftyTonAllowed: new FormControl(true),
      Transport: new FormControl(true),
      SubSegment: new FormControl(true),
      NDSStatus: new FormControl(true),
      ReleasedBy: new FormControl(true),
      ReleasedDate: new FormControl(true),
      RuningNo: new FormControl(true),
      LeadTime: new FormControl(true),
      ProcessDate: new FormControl(true),
      AccountManager: new FormControl(true),
      Documents: new FormControl(true),
    });

    this.IncomingTableSearch = this.formBuilder.group({
      SNo: new FormControl(''),
      OrderNo: new FormControl(''),
      CustomerStatus: new FormControl(''),
      Customer: new FormControl(''),
      Project: new FormControl(''),
      StructureElement: new FormControl(''),
      ProductType: new FormControl(''),
      WBS1: new FormControl(''),
      WBS2: new FormControl(''),
      WBS3: new FormControl(''),
      PONo: new FormControl(''),
      BBSNo: new FormControl(''),
      PODate: new FormControl(''),
      RequiredDate: new FormControl(''),
      RevisedReqDate: new FormControl(''),
      ForecastDate: new FormControl(''),
      LowerFloorDeliveryDate: new FormControl(''),
      DifferentDays: new FormControl(''),
      ConfirmedDelDate: new FormControl(''),
      TotalWT: new FormControl(''),
      Transport: new FormControl(''),
      SORNo: new FormControl(''),
      SONo: new FormControl(''),
      PMRemarks: new FormControl(''),
      TechRemarks: new FormControl(''),
      AttachedNo: new FormControl(''),
      DataEnteredBy: new FormControl(''),
      SubmittedBy: new FormControl(''),
      ProjectIncharge: new FormControl(''),
      DetailingIncharge: new FormControl(''),
      ProcessDate: new FormControl(''),
      linkTo: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl('')
    });
    this.PendingEntTableSearch = this.formBuilder.group({
      SNo: new FormControl(''),
      OrderNo: new FormControl(''),
      CustomerStatus: new FormControl(''),
      Customer: new FormControl(''),
      Project: new FormControl(''),
      StructureElement: new FormControl(''),
      ProductType: new FormControl(''),
      WBS1: new FormControl(''),
      WBS2: new FormControl(''),
      WBS3: new FormControl(''),
      PONo: new FormControl(''),
      BBSNo: new FormControl(''),
      PODate: new FormControl(''),
      RequiredDate: new FormControl(''),
      RevisedReqDate: new FormControl(''),
      ForecastDate: new FormControl(''),
      LowerFloorDeliveryDate: new FormControl(''),
      DifferentDays: new FormControl(''),
      ConfirmedDelDate: new FormControl(''),
      TotalWT: new FormControl(''),
      Transport: new FormControl(''),
      SORNo: new FormControl(''),
      SONo: new FormControl(''),
      PMRemarks: new FormControl(''),
      TechRemarks: new FormControl(''),
      AttachedNo: new FormControl(''),
      DataEnteredBy: new FormControl(''),
      SubmittedBy: new FormControl(''),
      ProjectIncharge: new FormControl(''),
      DetailingIncharge: new FormControl(''),
      ProcessDate: new FormControl(''),
      linkTo: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl('')
    });
    this.PendingDETTableSearch = this.formBuilder.group({
      SNo: new FormControl(''),
      OrderNo: new FormControl(''),
      CustomerStatus: new FormControl(''),
      Customer: new FormControl(''),
      Project: new FormControl(''),
      StructureElement: new FormControl(''),
      ProductType: new FormControl(''),
      WBS1: new FormControl(''),
      WBS2: new FormControl(''),
      WBS3: new FormControl(''),
      PONo: new FormControl(''),
      BBSNo: new FormControl(''),
      PODate: new FormControl(''),
      RequiredDate: new FormControl(''),
      RevisedReqDate: new FormControl(''),
      ForecastDate: new FormControl(''),
      LowerFloorDeliveryDate: new FormControl(''),
      DifferentDays: new FormControl(''),
      ConfirmedDelDate: new FormControl(''),
      TotalWT: new FormControl(''),
      Transport: new FormControl(''),
      SORNo: new FormControl(''),
      SONo: new FormControl(''),
      PMRemarks: new FormControl(''),
      TechRemarks: new FormControl(''),
      AttachedNo: new FormControl(''),
      DataEnteredBy: new FormControl(''),
      SubmittedBy: new FormControl(''),
      ProjectIncharge: new FormControl(''),
      DetailingIncharge: new FormControl(''),
      ProcessDate: new FormControl(''),
      linkTo: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl('')
    });
    this.CancelledTableSearch = this.formBuilder.group({
      SNo: new FormControl(''),
      OrderNo: new FormControl(''),
      CustomerStatus: new FormControl(''),
      Customer: new FormControl(''),
      Project: new FormControl(''),
      StructureElement: new FormControl(''),
      ProductType: new FormControl(''),
      WBS1: new FormControl(''),
      WBS2: new FormControl(''),
      WBS3: new FormControl(''),
      PONo: new FormControl(''),
      BBSNo: new FormControl(''),
      PODate: new FormControl(''),
      RequiredDate: new FormControl(''),
      RevisedReqDate: new FormControl(''),
      ForecastDate: new FormControl(''),
      LowerFloorDeliveryDate: new FormControl(''),
      DifferentDays: new FormControl(''),
      ConfirmedDelDate: new FormControl(''),
      TotalWT: new FormControl(''),
      Transport: new FormControl(''),
      SORNo: new FormControl(''),
      SONo: new FormControl(''),
      PMRemarks: new FormControl(''),
      TechRemarks: new FormControl(''),
      AttachedNo: new FormControl(''),
      DataEnteredBy: new FormControl(''),
      SubmittedBy: new FormControl(''),
      ProjectIncharge: new FormControl(''),
      DetailingIncharge: new FormControl(''),
      ProcessDate: new FormControl(''),
      linkTo: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl('')
    });

    this.AllTableSearch = this.formBuilder.group({
      SOrderNo: new FormControl(''),
      SORNo: new FormControl(''),
      SONo: new FormControl(''),
      CustomerStatus: new FormControl(''),
      SAPRejectStatus: new FormControl(''),
      StructureElement: new FormControl(''),
      ProductType: new FormControl(''),
      PONo: new FormControl(''),
      BBSNo: new FormControl(''),
      BBSDescription: new FormControl(''),
      PODate: new FormControl(''),
      RequiredDate: new FormControl(''),
      RevisedReqDate: new FormControl(''),
      ForecastDate: new FormControl(''),
      LowerFloorDeliveryDate: new FormControl(''),
      DifferentDays: new FormControl(''),
      ConfirmedDelDate: new FormControl(''),
      TotalWT: new FormControl(''),
      TotalMT: new FormControl(''),
      PMRemarks: new FormControl(''),
      TechRemarks: new FormControl(''),
      ProcessedBy: new FormControl(''),
      Customer: new FormControl(''),
      Project: new FormControl(''),
      WBS1: new FormControl(''),
      WBS2: new FormControl(''),
      WBS3: new FormControl(''),
      SubmittedBy: new FormControl(''),
      ProjectIncharge: new FormControl(''),
      DetailingIncharge: new FormControl(''),
      PPContract: new FormControl(''),
      OrderType: new FormControl(''),
      ContractNumber: new FormControl(''),
      SORStatus: new FormControl(''),
      CreditBlockStatus: new FormControl(''),
      ErrorLog: new FormControl(''),
      InternalRemark: new FormControl(''),
      ExternalRemark: new FormControl(''),
      LoadNumber: new FormControl(''),
      DeliveryStatus: new FormControl(''),
      DONo: new FormControl(''),
      WTNo: new FormControl(''),
      WTDate: new FormControl(''),
      DeliveredPieces: new FormControl(''),
      BalancePieces: new FormControl(''),
      UrgentOrder: new FormControl(''),
      ZeroTolerance: new FormControl(''),
      CallBefDel: new FormControl(''),
      SpecialPass: new FormControl(''),
      LorryCrane: new FormControl(''),
      PremiumService: new FormControl(''),
      CraneBook: new FormControl(''),
      BargeBook: new FormControl(''),
      PoliceEscort: new FormControl(''),
      ONHOLD: new FormControl(''),
      CONQUAS: new FormControl(''),
      LowBedAllowed: new FormControl(''),
      FiftyTonAllowed: new FormControl(''),
      Transport: new FormControl(''),
      SubSegment: new FormControl(''),
      NDSStatus: new FormControl(''),
      ReleasedBy: new FormControl(''),
      ReleasedDate: new FormControl(''),
      RuningNo: new FormControl(''),
      LeadTime: new FormControl(''),
      ProcessDate: new FormControl(''),
      AccountManager: new FormControl(''),
      Documents: new FormControl(''),
      linkTo: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl('')
    });

    this.SearchResultTableSearch = this.formBuilder.group({
      SOrderNo: new FormControl(''),
      SORNo: new FormControl(''),
      SONo: new FormControl(''),
      CustomerStatus: new FormControl(''),
      SAPRejectStatus: new FormControl(''),
      StructureElement: new FormControl(''),
      ProductType: new FormControl(''),
      PONo: new FormControl(''),
      BBSNo: new FormControl(''),
      BBSDescription: new FormControl(''),
      PODate: new FormControl(''),
      RequiredDate: new FormControl(''),
      RevisedReqDate: new FormControl(''),
      ForecastDate: new FormControl(''),
      LowerFloorDeliveryDate: new FormControl(''),
      DifferentDays: new FormControl(''),
      ConfirmedDelDate: new FormControl(''),
      TotalWT: new FormControl(''),
      TotalMT: new FormControl(''),
      PMRemarks: new FormControl(''),
      TechRemarks: new FormControl(''),
      ProcessedBy: new FormControl(''),
      Customer: new FormControl(''),
      Project: new FormControl(''),
      WBS1: new FormControl(''),
      WBS2: new FormControl(''),
      WBS3: new FormControl(''),
      SubmittedBy: new FormControl(''),
      ProjectIncharge: new FormControl(''),
      DetailingIncharge: new FormControl(''),
      PPContract: new FormControl(''),
      OrderType: new FormControl(''),
      ContractNumber: new FormControl(''),
      SORStatus: new FormControl(''),
      CreditBlockStatus: new FormControl(''),
      ErrorLog: new FormControl(''),
      InternalRemark: new FormControl(''),
      ExternalRemark: new FormControl(''),
      LoadNumber: new FormControl(''),
      DeliveryStatus: new FormControl(''),
      DONo: new FormControl(''),
      WTNo: new FormControl(''),
      WTDate: new FormControl(''),
      DeliveredPieces: new FormControl(''),
      BalancePieces: new FormControl(''),
      UrgentOrder: new FormControl(''),
      ZeroTolerance: new FormControl(''),
      CallBefDel: new FormControl(''),
      SpecialPass: new FormControl(''),
      LorryCrane: new FormControl(''),
      PremiumService: new FormControl(''),
      CraneBook: new FormControl(''),
      BargeBook: new FormControl(''),
      PoliceEscort: new FormControl(''),
      ONHOLD: new FormControl(''),
      CONQUAS: new FormControl(''),
      LowBedAllowed: new FormControl(''),
      FiftyTonAllowed: new FormControl(''),
      Transport: new FormControl(''),
      SubSegment: new FormControl(''),
      NDSStatus: new FormControl(''),
      ReleasedBy: new FormControl(''),
      ReleasedDate: new FormControl(''),
      RuningNo: new FormControl(''),
      LeadTime: new FormControl(''),
      ProcessDate: new FormControl(''),
      AccountManager: new FormControl(''),
      Documents: new FormControl(''),
      linkTo: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl('')
    });
    this.ProcessingTableSearch = this.formBuilder.group({
      SOrderNo: new FormControl(''),
      SORNo: new FormControl(''),
      SONo: new FormControl(''),
      CustomerStatus: new FormControl(''),
      SAPRejectStatus: new FormControl(''),
      StructureElement: new FormControl(''),
      ProductType: new FormControl(''),
      PONo: new FormControl(''),
      BBSNo: new FormControl(''),
      BBSDescription: new FormControl(''),
      PODate: new FormControl(''),
      RequiredDate: new FormControl(''),
      RevisedReqDate: new FormControl(''),
      ForecastDate: new FormControl(''),
      LowerFloorDeliveryDate: new FormControl(''),
      DifferentDays: new FormControl(''),
      ConfirmedDelDate: new FormControl(''),
      TotalWT: new FormControl(''),
      TotalMT: new FormControl(''),
      PMRemarks: new FormControl(''),
      TechRemarks: new FormControl(''),
      ProcessedBy: new FormControl(''),
      Customer: new FormControl(''),
      Project: new FormControl(''),
      WBS1: new FormControl(''),
      WBS2: new FormControl(''),
      WBS3: new FormControl(''),
      SubmittedBy: new FormControl(''),
      ProjectIncharge: new FormControl(''),
      DetailingIncharge: new FormControl(''),
      PPContract: new FormControl(''),
      OrderType: new FormControl(''),
      ContractNumber: new FormControl(''),
      SORStatus: new FormControl(''),
      CreditBlockStatus: new FormControl(''),
      ErrorLog: new FormControl(''),
      InternalRemark: new FormControl(''),
      ExternalRemark: new FormControl(''),
      LoadNumber: new FormControl(''),
      DeliveryStatus: new FormControl(''),
      DONo: new FormControl(''),
      WTNo: new FormControl(''),
      WTDate: new FormControl(''),
      DeliveredPieces: new FormControl(''),
      BalancePieces: new FormControl(''),
      UrgentOrder: new FormControl(''),
      ZeroTolerance: new FormControl(''),
      CallBefDel: new FormControl(''),
      SpecialPass: new FormControl(''),
      LorryCrane: new FormControl(''),
      PremiumService: new FormControl(''),
      CraneBook: new FormControl(''),
      BargeBook: new FormControl(''),
      PoliceEscort: new FormControl(''),
      ONHOLD: new FormControl(''),
      CONQUAS: new FormControl(''),
      LowBedAllowed: new FormControl(''),
      FiftyTonAllowed: new FormControl(''),
      Transport: new FormControl(''),
      SubSegment: new FormControl(''),
      NDSStatus: new FormControl(''),
      ReleasedBy: new FormControl(''),
      ReleasedDate: new FormControl(''),
      RuningNo: new FormControl(''),
      LeadTime: new FormControl(''),
      ProcessDate: new FormControl(''),
      AccountManager: new FormControl(''),
      Documents: new FormControl(''),
      linkTo: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl('')
    });
    this.ProcessOrderForm = this.formBuilder.group({
      customer: new FormControl(''),
      project: new FormControl(''),
      ponumber: new FormControl(''),
      Contract: new FormControl(''),
      ShipTo: new FormControl(''),
      ProjectStage: new FormControl(''),
      SONumber: new FormControl(''),
      OrderType: new FormControl('CREDIT'),
      VehicleType: new FormControl('TR40/24-40ft 24mt Trailer'),
      LowCarbon: new FormControl(''),
      EPDValue: new FormControl(''),
      RecycleContent: new FormControl(''),
      ReqDate: new FormControl(''),
      UpdateReqDate: new FormControl(''),
      CABWeight: new FormControl(''),
      SBWeight: new FormControl(''),
      TotalPcs: new FormControl(''),
      TotalWeight: new FormControl(''),
      wbs1: new FormControl(''),
      wbs2: new FormControl(''),
      wbs3: new FormControl(''),
      Address: new FormControl(''),
      Gate: new FormControl(''),
    });
    this.ProcessOrderForm.get('ReqDate')?.disable();

    this.ProcessorderCheckbox = this.formBuilder.group({
      UrgentOrder: new FormControl(false),
      Conquas: new FormControl(false),
      Crane: new FormControl(false),
      PremiumService: new FormControl(false),
      ZeroTol: new FormControl(false),
      CallBDel: new FormControl(true),
      DoNotMix: new FormControl(false),
      SpecialPass: new FormControl(false),
      VehLowBed: new FormControl(true),
      Veh50Ton: new FormControl(true),
      Borge: new FormControl(false),
      PoliceEscort: new FormControl(false),
      FabricateESM: new FormControl(false),
      TimeRange: new FormControl(''),
    });
    this.ProcessorderRemarks = this.formBuilder.group({
      InternalReamrks: new FormControl(''),
      ExternalReamrks: new FormControl(''),
      InvoiceReamrks: new FormControl(''),
    });
  }

  setFixedColumns() {
    this.pendingEntFixedColumn = parseInt(
      localStorage.getItem('pendingEntFixedColumn') ?? '0'
    );
    this.incomingFixedColumn = parseInt(
      localStorage.getItem('incomingFixedColumn') ?? '0'
    );
    this.detFixedColumn = parseInt(
      localStorage.getItem('detFixedColumn') ?? '0'
    );
    this.cancelledFixedColumn = parseInt(
      localStorage.getItem('cancelledFixedColumn') ?? '0'
    );
    this.processingFixedColumn = parseInt(
      localStorage.getItem('processingFixedColumn') ?? '0'
    );
    this.allFixedColumn = parseInt(
      localStorage.getItem('allFixedColumn') ?? '0'
    );
    this.searchFixedColumn = parseInt(
      localStorage.getItem('searchFixedColumn') ?? '0'
    );
  }
  ngOnDestroy(): void {
    this.cleanupListeners();

    localStorage.setItem('incomingCols', JSON.stringify(this.incomingCols));
    localStorage.setItem('pendingEntCols', JSON.stringify(this.pendingEntCols));
    localStorage.setItem('dettCols', JSON.stringify(this.dettCols));
    localStorage.setItem('cancelledCols', JSON.stringify(this.cancelledCols));
    localStorage.setItem('processingCols', JSON.stringify(this.processingCols));
    localStorage.setItem('allDataCols', JSON.stringify(this.allDataCols));
    localStorage.setItem('searchCols', JSON.stringify(this.searchCols));
  }
  dropCol(event: any) {
    if (this.incomingFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.incomingFixedColumn &&
        event.currentIndex + 2 > this.incomingFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.incomingFixedColumn &&
        event.currentIndex + 2 <= this.incomingFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.incomingCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.incomingCols
        );
        moveItemInArray(this.incomingCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.incomingCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.incomingCols
      );
      moveItemInArray(this.incomingCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('incomingCols', JSON.stringify(this.incomingCols));
  }
  dropENtCol(event: any) {
    if (this.pendingEntFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.pendingEntFixedColumn &&
        event.currentIndex + 2 > this.pendingEntFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.pendingEntFixedColumn &&
        event.currentIndex + 2 <= this.pendingEntFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.pendingEntCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.pendingEntCols
        );
        moveItemInArray(this.pendingEntCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.pendingEntCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.pendingEntCols
      );
      moveItemInArray(this.pendingEntCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('pendingEntCols', JSON.stringify(this.pendingEntCols));
  }
  dropDetCol(event: any) {
    if (this.detFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.detFixedColumn &&
        event.currentIndex + 2 > this.detFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.detFixedColumn &&
        event.currentIndex + 2 <= this.detFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.dettCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.dettCols
        );
        moveItemInArray(this.dettCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.dettCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.dettCols
      );
      moveItemInArray(this.dettCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('dettCols', JSON.stringify(this.dettCols));
  }
  dropCancelledCol(event: any) {
    if (this.cancelledFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.cancelledFixedColumn &&
        event.currentIndex + 2 > this.cancelledFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.cancelledFixedColumn &&
        event.currentIndex + 2 <= this.cancelledFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.cancelledCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.cancelledCols
        );
        moveItemInArray(this.cancelledCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.cancelledCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.cancelledCols
      );
      moveItemInArray(this.cancelledCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('cancelledCols', JSON.stringify(this.cancelledCols));
  }
  dropProcessingCol(event: any) {
    if (this.processingFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.processingFixedColumn &&
        event.currentIndex + 2 > this.processingFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.processingFixedColumn &&
        event.currentIndex + 2 <= this.processingFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.processingCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.processingCols
        );
        moveItemInArray(this.processingCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.processingCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.processingCols
      );
      moveItemInArray(this.processingCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('processingCols', JSON.stringify(this.processingCols));
  }
  dropAllDataCol(event: any) {
    if (this.allFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.allFixedColumn &&
        event.currentIndex + 2 > this.allFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.allFixedColumn &&
        event.currentIndex + 2 <= this.allFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.allDataCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.allDataCols
        );
        moveItemInArray(this.allDataCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.allDataCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.allDataCols
      );
      moveItemInArray(this.allDataCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('allDataCols', JSON.stringify(this.allDataCols));
  }
  dropSearchCol(event: any) {
    if (this.searchFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.searchFixedColumn &&
        event.currentIndex + 2 > this.searchFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.searchFixedColumn &&
        event.currentIndex + 2 <= this.searchFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.searchCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.searchCols
        );
        moveItemInArray(this.searchCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let index = this.CheckCurrentIndex(event.currentIndex, this.searchCols);
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.searchCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.searchCols
      );
      moveItemInArray(this.searchCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('searchCols', JSON.stringify(this.searchCols));
  }

  setColVisibility(val: any, field: string, array: any) {
    let index = array.findIndex((x: any) => x.controlName === field);
    array[index].isVisible = val;

    console.log('setColVisibility=>', val, field, array);
  }
  // Method to sync scroll positions
  private SyncScroll(): void {
    if (!this.headerContainer) {
      // this.headerContainer = document.querySelector('.header-container') as HTMLDivElement;
    }
    const header = document.querySelector(
      '.header-container'
    ) as HTMLDivElement;
    const body = document.querySelector('.body-container') as HTMLDivElement;

    body.addEventListener('scroll', () => {
      header.scrollLeft = body.scrollLeft;
    });
  }
  // Refresh ViewChild references after the DOM changes
  refreshContainers(): void {
    // Force Angular to refresh the ViewChild references
    setTimeout(() => {
      this.SyncScroll(); // Reapply scroll synchronization
    });
  }

  ngAfterViewInit() {
    if (this.bodyContainer && this.headerContainer) {
      this.SyncScroll(); // Initial scroll synchronization
    }

    // PENDING-ENT
    console.log('scrollViewportProcessing', this.viewPort);
    const pendingEntElement = document.getElementById('pending-ent-tab-link');
    pendingEntElement?.addEventListener('click', () =>
      this.GetProcessOrderForCreate('CREATING', false)
    );

    // INCOMING
    const incomingElement = document.getElementById('incoming-tab-link');
    incomingElement?.addEventListener('click', () =>
      this.GetProcessOrderForIncoming('INCOMING', false)
    );

    // PENDING-DET
    const pendingDetElement = document.getElementById('pending-det-tab-link');
    pendingDetElement?.addEventListener('click', () =>
      this.GetProcessOrderForPendingDET('DETAILING', false)
    );

    // CANCEL
    const cancelElement = document.getElementById('cancel-tab-link');
    cancelElement?.addEventListener('click', () =>
      this.GetProcessOrderForCancel('CANCELLED', false)
    );

    // PROCESSING
    const processingElement = document.getElementById('processing-tab-link');
    processingElement?.addEventListener('click', () =>
      this.GetProcessOrderForProcessing('PROCESSING')
    );

    // ALL
    const allElement = document.getElementById('all-tab-link');
    allElement?.addEventListener('click', () =>
      this.GetProcessOrderForALL('ALL')
    );

    // SEARCH
    const element = document.getElementById('search-tab-link');
    console.log('this.tab1.nativeElement=>', element);
    element?.addEventListener('click', () => this.openSearch());
    // console.log("this.tab1.nativeElement=>",this.tab1.nativeElement);
    // this.tab1.nativeElement.addEventListener('click', () => this.openSearch());
  }

  lastSelctedRow: any = undefined;
  lastButtonPresses: any = '';

  @HostListener('document:click', ['$event'])
  handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      if (this.HoverSetting == false) {
        this.togglePendingENTSettingMenu = false;
        this.toggleIncomingSettingMenu = false;
        this.togglePendingDETSettingMenu = false;
        this.toggleCancelledSettingMenu = false;
        this.toggleProcessingSettingMenu = false;
        this.toggleSeacrhSettingMenu = false;
      }
      // Left buttonconsole.log('Left mouse button clicked');
      // Handle the left-click event here
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      if (this.cellSelection) {
        event.preventDefault();
      } else {
        return;
      }
    } else if (event.key === 'c') {
      if (event.ctrlKey) {
        console.log('Copy fn triggered');
        if (this.gTableSelected) {
          this.CopyData();
        }
      }
    } else {
      return;
    }
    if (this.lastSelectedTable) {
      this.KeySelectOrderDetails(event);
    } else {
      if (this.cellSelection == false) {
        this.KeySelectProcess(event);
      } else {
        this.KeySingleSelectProcess(event);
      }
    }
  }

  scrollToSelectedRowOD(ldataList: any) {
    const selectedRowIndex = ldataList.findIndex(
      (row: any) => row === this.selectedRow[0]
    );
    const rowHeight =
      this.tableContainer.nativeElement.querySelector('tr').clientHeight;
    const containerHeight = this.tableContainer.nativeElement.clientHeight;
    const scrollTo = selectedRowIndex * rowHeight;
    const headingHeight = 115;
    if (
      scrollTo + rowHeight + headingHeight > containerHeight ||
      scrollTo < this.tableContainer.nativeElement.scrollTop
    ) {
      this.tableContainer.nativeElement.scrollTop = scrollTo;
    }
  }

  scrollToSelectedRow(ldataList: any) {
    const selectedRowIndex = ldataList.findIndex(
      (row: any) => row === this.selectedRow[this.selectedRow.length - 1]
    );
    const selectedZeroRowIndex = ldataList.findIndex(
      (row: any) => row === this.selectedRow[0]
    );
    if (this.CurrentTab == 'PROCESSING') {
      this.scrollToRow(this.viewPort!, selectedRowIndex + 1, ldataList.length);
    } else if (this.CurrentTab == 'SEARCH') {
      this.scrollToRow(
        this.viewPortSearch!,
        selectedRowIndex + 1,
        ldataList.length
      );
    } else if (this.CurrentTab == 'DETAILING') {
      this.scrollToRow(
        this.viewPortDET!,
        selectedRowIndex + 1,
        ldataList.length
      );
    } else if (this.CurrentTab == 'INCOMING') {
      this.scrollToRow(
        this.viewPortIncoming!,
        selectedRowIndex + 1,
        ldataList.length
      );
    } else if (this.CurrentTab == 'CREATING') {
      this.scrollToRow(
        this.viewPortENT!,
        selectedRowIndex + 1,
        ldataList.length
      );
    } else if (this.CurrentTab == 'CANCELLED') {
      this.scrollToRow(
        this.viewPortCancelled!,
        selectedRowIndex + 1,
        ldataList.length
      );
    } else {
      this.scrollToRow(
        this.viewPortAll!,
        selectedRowIndex + 1,
        ldataList.length
      );
    }
  }

  // The index of the last row that is completely visible initially in the table view
  // Can also be referred as the max number of rows visible in the table view
  private lIndex: number = 13;

  scrollToRow(
    viewport: CdkVirtualScrollViewport,
    nextIndex: number,
    itemSize: number
  ): void {
    // if (viewport) {
    //   let viewportSize = viewport.getViewportSize();
    //   if (viewportSize == 0) {
    //     viewportSize = 575;
    //   }
    //   const endIndex = Math.floor(viewportSize / this.itemSize - 3);
    //   if (nextIndex > endIndex) {
    //     let offset = (nextIndex - endIndex) * this.itemSize;
    //     viewport.scrollToOffset(offset, 'auto');
    //   }
    // }

    if (viewport) {
      if (this.ScrolltoOffset_Down(viewport, nextIndex)) {
        const viewportSize = viewport.getViewportSize();
        const lBodyCell = document.getElementById('body-cell');
        let lBodyCellHeight = 30;
        if (lBodyCell) {
          lBodyCellHeight = Math.ceil(lBodyCell.offsetHeight);
        }
        let lCurrentRows = (viewportSize - 99) / lBodyCellHeight;
        let lIndex = nextIndex - (lCurrentRows - 1);
        viewport.scrollToIndex(lIndex, 'auto');
      }
    }
  }
  scrollToRowUP(index: number, viewport: CdkVirtualScrollViewport): void {
    if (viewport) {
      // const currentScrollOffset = viewport.measureScrollOffset();
      // const topVisibleIndex =
      //   Math.floor(currentScrollOffset / this.itemSize) + 1;
      // if (index <= topVisibleIndex && topVisibleIndex != 0) {
      //   const newOffset = currentScrollOffset - 30;
      //   viewport.scrollToOffset(newOffset, 'auto');
      // }
      if (this.ScrolltoOffset_Up(viewport, index)) {
        if (index <= 2) {
          viewport.scrollToOffset(0, 'auto');
        } else {
          // let offset = (index - 2) * this.itemSize;
          // viewport.scrollToOffset(offset, 'auto');
          viewport.scrollToIndex(index, 'auto');
        }
      }
    }
  }

  scrollToColumn(
    viewport: CdkVirtualScrollViewport,
    pFixedCols: any,
    pColumnList: any,
    pColumnId: any,
    pSelectMultiple: boolean,
    pRight2left: boolean
  ): void {
    if (this.cellSelection) {
      if (viewport) {
        pFixedCols = pFixedCols > 0 ? pFixedCols - 1 : 0; // To handle the 1st column (SNo) which is not present in the columnlist.

        if (
          !this.ScrollToOffsetHorizontal(
            viewport,
            pFixedCols,
            pColumnList,
            pColumnId,
            pRight2left
          )
        ) {
          return;
        }

        if (!pSelectMultiple) {
          // Without Shift key pressed.
          // Check if the selected cell is in the fixed columlist.
          for (let i = 0; i < pFixedCols; i++) {
            if (pColumnList[i].cellSelected) {
              // Return form the function.
              return;
            }
          }
          if (pRight2left) {
            // Logic for single cell selection.
            let lHorizontalOffset = 0;
            for (let i = pFixedCols; i < pColumnList.length; i++) {
              let lItem = pColumnList[i];
              if (lItem.cellSelected) break; // End the loop if the we reach the selected column.
              if (lItem.isVisible) {
                // Check if the column is Visible.
                lHorizontalOffset =
                  lHorizontalOffset +
                  (isNaN(Number(lItem.width)) ? 80 : Number(lItem.width));
              }
            }
            viewport.scrollTo({ left: lHorizontalOffset });
          } else {
            // // Logic for single cell selection.
            // let lHorizontalOffset = 0;
            // for (let i = pColumnList.length-1; i >pFixedCols; i--) {
            //   let lItem = pColumnList[i];
            // if (lItem.cellSelected) break; // End the loop if the we reach the selected column.
            // if (lItem.isVisible) {
            //   // Check if the column is Visible.
            //   lHorizontalOffset =
            //     lHorizontalOffset +
            //     (isNaN(Number(lItem.width)) ? 80 : Number(lItem.width));
            //   }
            // }
            // viewport.scrollTo({ right: lHorizontalOffset });

            // Logic for single cell selection.
            let lHorizontalOffset = -30;
            for (let i = pColumnId; i < pColumnList.length; i++) {
              let lItem = pColumnList[i];
              if (lItem.isVisible) {
                // Check if the column is Visible.
                lHorizontalOffset =
                  lHorizontalOffset +
                  (isNaN(Number(lItem.width)) ? 80 : Number(lItem.width));
              }
            }
            viewport.scrollTo({ right: lHorizontalOffset });
          }
        } else {
          // With Shift key pressed.
          //Logic for multiple cell selection while Shift.

          for (let i = 0; i < pFixedCols; i++) {
            if (i == pColumnId) {
              // Return form the function.
              return;
            }
          }

          let lHorizontalOffset = 0;
          for (let i = pFixedCols; i < pColumnId; i++) {
            let lItem = pColumnList[i];
            if (lItem.isVisible) {
              // Check if the column is Visible.
              lHorizontalOffset =
                lHorizontalOffset +
                (isNaN(Number(lItem.width)) ? 80 : Number(lItem.width));
            }
          }
          viewport.scrollTo({ left: lHorizontalOffset });
        }
      }
    }
  }

  scrollToSelectedRowUp(index: number) {
    if (this.CurrentTab == 'PROCESSING') {
      this.scrollToRowUP(index, this.viewPort!);
    } else if (this.CurrentTab == 'SEARCH') {
      this.scrollToRowUP(index, this.viewPortSearch!);
    } else if (this.CurrentTab == 'DETAILING') {
      this.scrollToRowUP(index, this.viewPortDET!);
    } else if (this.CurrentTab == 'INCOMING') {
      this.scrollToRowUP(index, this.viewPortIncoming!);
    } else if (this.CurrentTab == 'CREATING') {
      this.scrollToRowUP(index, this.viewPortENT!);
    } else if (this.CurrentTab == 'CANCELLED') {
      this.scrollToRowUP(index, this.viewPortCancelled!);
    } else {
      this.scrollToRowUP(index, this.viewPortAll!);
    }
  }

  scrollToSelectedColumn(
    ldataList: any,
    pColumnId: any,
    pRight2left: boolean,
    pSelectMultiple: boolean
  ) {
    // Find the index of the selected row
    if (this.CurrentTab == 'PROCESSING') {
      this.scrollToColumn(
        this.viewPort!,
        this.processingFixedColumn,
        this.processingCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    } else if (this.CurrentTab == 'SEARCH') {
      this.scrollToColumn(
        this.viewPortSearch!,
        this.searchFixedColumn,
        this.searchCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    } else if (this.CurrentTab == 'DETAILING') {
      this.scrollToColumn(
        this.viewPortDET!,
        this.detFixedColumn,
        this.dettCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    } else if (this.CurrentTab == 'INCOMING') {
      this.scrollToColumn(
        this.viewPortIncoming!,
        this.incomingFixedColumn,
        this.incomingCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    } else if (this.CurrentTab == 'CREATING') {
      this.scrollToColumn(
        this.viewPortENT!,
        this.pendingEntFixedColumn,
        this.pendingEntCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    } else if (this.CurrentTab == 'CANCELLED') {
      this.scrollToColumn(
        this.viewPortCancelled!,
        this.cancelledFixedColumn,
        this.cancelledCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    } else {
      this.scrollToColumn(
        this.viewPortAll!,
        this.allFixedColumn,
        this.allDataCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    }
    // this.scrollToColumn(this.viewPortIncoming!);
  }

  KeySelectOrderDetails(event: KeyboardEvent) {
    let ldataList: any[] = [];
    ldataList = this.lastSelectedTableData;
    this.lastSelctedRowDetails;

    let lIndex = 0;
    if (this.lastSelctedRowDetails) {
      lIndex = ldataList.findIndex((x) => x == this.lastSelctedRowDetails);
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
      } else {
        row = ldataList[lIndex + 1];
      }
      this.lastSelctedRowDetails = row;
      this.lastButtonPresses = 'DOWN';
      if (event.shiftKey && event.key === 'ArrowDown') {
        console.log('Multi Select Started');
        if (row.isSelected) {
          row.isSelected = false;
        } else {
          row.isSelected = true;
        }
        // this.scrollToSelectedRow(ldataList);
        return;
      }
      ldataList.forEach((x) => (x.isSelected = false));
      row.isSelected = true;
      return;
    } else if (event.key === 'ArrowUp') {
      // Break if the selected element is the last element of the list
      if (lIndex <= 0) {
        return;
      }
      let row: any;

      if (this.lastButtonPresses == 'DOWN') {
        row = ldataList[lIndex];
      } else {
        row = ldataList[lIndex - 1];
      }

      this.lastSelctedRowDetails = row;
      this.lastButtonPresses = 'UP';
      if (event.shiftKey && event.key === 'ArrowUp') {
        console.log('Multi Select Started');
        if (row.isSelected) {
          row.isSelected = false;
        } else {
          row.isSelected = true;
        }
        return;
      }
      ldataList.forEach((x) => (x.isSelected = false));
      row.isSelected = true;
      return;
      // this.scrollToSelectedRow(ldataList);
      // return;
    }
  }

  lastSelctedColumn: any = undefined;
  KeySingleSelectProcess(event: KeyboardEvent) {
    // Define the list based on the current Tab
    let ldataList: any[] = [];
    let lColumnList: any[] = [];

    if (this.CurrentTab == 'CREATING') {
      ldataList = this.PendingENT;
      lColumnList = this.pendingEntCols;
    } else if (this.CurrentTab == 'INCOMING') {
      ldataList = this.IncomingData;
      lColumnList = this.incomingCols;
    } else if (this.CurrentTab == 'DETAILING') {
      ldataList = this.PendingDET;
      lColumnList = this.dettCols;
    } else if (this.CurrentTab == 'CANCELLED') {
      ldataList = this.CancelData;
      lColumnList = this.cancelledCols;
    } else if (this.CurrentTab == 'PROCESSING') {
      ldataList = this.ProcessingData;
      lColumnList = this.processingCols;
    } else if (this.CurrentTab == 'ALL') {
      ldataList = this.AllData;
      lColumnList = this.allDataCols;
    } else if (this.CurrentTab == 'SEARCH') {
      ldataList = this.SearchResultData;
      lColumnList = this.searchCols;
    }

    //Find the index of the last selected element the Table;
    let lIndex = 0;
    if (this.lastSelctedRow == undefined) {
      return;
    } else {
      lIndex = ldataList.findIndex((x) => x == this.lastSelctedRow);
    }

    let lColumnId = 0;
    if (this.lastSelctedColumn == undefined) {
      return;
    } else {
      lColumnId = lColumnList.findIndex((x) => x == this.lastSelctedColumn);
    }

    if (lIndex == -1 || lColumnId == -1) {
      return;
    }
    if (event.shiftKey) {
      if (event.key === 'ArrowUp') {
        lIndex = lIndex - 1;
        if (lIndex < 0) {
          return;
        }
        if (ldataList[lIndex].isSelected === true) {
          let tIndex = this.selectedRow.findIndex(
            (x) => x == ldataList[lIndex + 1]
          );
          this.selectedRow.splice(tIndex, 1);
          ldataList[lIndex + 1].isSelected = false;
        } else {
          ldataList[lIndex].isSelected = true;
          this.selectedRow.push(ldataList[lIndex]);
        }
        this.lastSelctedRow = ldataList[lIndex];

        this.scrollToSelectedRowUp(lIndex);
      } else if (event.key === 'ArrowDown') {
        lIndex = lIndex + 1;
        if (lIndex > ldataList.length - 1) {
          return;
        }
        if (ldataList[lIndex].isSelected === true) {
          let tIndex = this.selectedRow.findIndex(
            (x) => x == ldataList[lIndex - 1]
          );
          this.selectedRow.splice(tIndex, 1);
          ldataList[lIndex - 1].isSelected = false;
        } else {
          ldataList[lIndex].isSelected = true;
          this.selectedRow.push(ldataList[lIndex]);
        }
        this.lastSelctedRow = ldataList[lIndex];
        this.scrollToSelectedRow(ldataList);
      } else if (event.key === 'ArrowLeft') {
        let CurrColumnId = lColumnId; // the current column ID.
        // lColumnId -> ID of column to be selected.
        for (let i = lColumnId; i > 0; i--) {
          if (lColumnList[i - 1].isVisible) {
            lColumnId = i - 1;
            break;
          }
        }
        // lColumnId = lColumnId - 1;
        if (lColumnId < 0) {
          return;
        }
        if (lColumnList[lColumnId].cellSelected === true) {
          lColumnList[CurrColumnId].cellSelected = false;
        } else {
          lColumnList[lColumnId].cellSelected = true;
        }
        this.lastSelctedColumn = lColumnList[lColumnId];

        this.scrollToSelectedColumn(ldataList, lColumnId, true, true);
      } else if (event.key === 'ArrowRight') {
        let CurrColumnId = lColumnId; // the current column ID.
        // lColumnId -> ID of column to be selected.
        for (let i = lColumnId; i < lColumnList.length - 1; i++) {
          if (lColumnList[i + 1].isVisible) {
            lColumnId = i + 1;
            break;
          }
        }
        // lColumnId = lColumnId + 1;
        if (lColumnId > lColumnList.length - 1) {
          return;
        }
        if (lColumnList[lColumnId].cellSelected === true) {
          lColumnList[CurrColumnId].cellSelected = false;
        } else {
          lColumnList[lColumnId].cellSelected = true;
        }
        this.lastSelctedColumn = lColumnList[lColumnId];

        this.scrollToSelectedColumn(ldataList, lColumnId, false, true);
      }

      this.SetFilteredWeight(this.selectedRow);
      return;
    }

    if (event.key === 'ArrowUp') {
      lIndex = lIndex - 1;
      if (lIndex < 0) {
        return;
      }
      this.selectedRow.forEach((x) => (x.isSelected = false));
      this.selectedRow = [];
      ldataList[lIndex].isSelected = true;
      // this.selectedRow.push(row);
      this.selectRow(ldataList[lIndex], ldataList, this.gClick);
      this.scrollToSelectedRowUp(lIndex);
    } else if (event.key === 'ArrowDown') {
      lIndex = lIndex + 1;
      if (lIndex > ldataList.length - 1) {
        return;
      }
      this.selectedRow.forEach((x) => (x.isSelected = false));
      this.selectedRow = [];
      ldataList[lIndex].isSelected = true;
      // this.selectedRow.push(row);
      this.selectRow(ldataList[lIndex], ldataList, this.gClick);
      this.scrollToSelectedRow(ldataList);
    } else if (event.key === 'ArrowLeft') {
      for (let i = lColumnId; i > 0; i--) {
        if (lColumnList[i - 1].isVisible) {
          lColumnId = i - 1;
          break;
        }
      }
      // lColumnId = lColumnId - 1;
      if (lColumnId < 0) {
        return;
      }
      lColumnList.forEach((x) => (x.cellSelected = false));
      lColumnList[lColumnId].cellSelected = true;
      this.lastSelctedColumn = lColumnList[lColumnId];
      this.scrollToSelectedColumn(ldataList, lColumnId, true, false);
    } else if (event.key === 'ArrowRight') {
      for (let i = lColumnId; i < lColumnList.length - 1; i++) {
        if (lColumnList[i + 1].isVisible) {
          lColumnId = i + 1;
          break;
        }
      }
      // lColumnId = lColumnId + 1;
      if (lColumnId > lColumnList.length - 1) {
        return;
      }
      lColumnList.forEach((x) => (x.cellSelected = false));
      lColumnList[lColumnId].cellSelected = true;
      this.lastSelctedColumn = lColumnList[lColumnId];
      this.scrollToSelectedColumn(ldataList, lColumnId, false, false);
    }

    this.SetFilteredWeight(this.selectedRow);
  }

  KeySelectProcess(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      // Call your custom function herethis.onShiftDown();
      console.log('button pressed');

      // Define the list based on the current Tab
      let ldataList: any[] = [];

      if (this.CurrentTab == 'CREATING') {
        ldataList = this.PendingENT;
      } else if (this.CurrentTab == 'INCOMING') {
        ldataList = this.IncomingData;
      } else if (this.CurrentTab == 'DETAILING') {
        ldataList = this.PendingDET;
      } else if (this.CurrentTab == 'CANCELLED') {
        ldataList = this.CancelData;
      } else if (this.CurrentTab == 'PROCESSING') {
        ldataList = this.ProcessingData;
      } else if (this.CurrentTab == 'ALL') {
        ldataList = this.AllData;
      } else if (this.CurrentTab == 'SEARCH') {
        ldataList = this.SearchResultData;
      }

      //Find the index of the last selected element the Table;
      let lIndex = 0;
      if (this.lastSelctedRow == undefined) {
        lIndex = ldataList.findIndex(
          (x) => x == this.selectedRow[this.selectedRow.length - 1]
        );
      } else {
        lIndex = ldataList.findIndex((x) => x == this.lastSelctedRow);
      }

      // Break if the selected element is the last element of the list
      if (lIndex >= ldataList.length - 1) {
        return;
      }

      // Define row
      let row: any;

      if (this.lastButtonPresses == 'UP') {
        row = ldataList[lIndex];
      } else {
        row = ldataList[lIndex + 1];
      }

      this.lastSelctedRow = row;
      this.lastButtonPresses = 'DOWN';

      if (event.shiftKey) {
        console.log('Multi Select Started');
        if (row.isSelected) {
          // Remove from this.selectedRow
          let tIndex = this.selectedRow.findIndex((x) => x == row);
          this.selectedRow.splice(tIndex, 1);
          row.isSelected = false;
        } else {
          row.isSelected = true;
          this.selectedRow.push(row);
        }
        this.setButtonDisplay(this.selectedRow[0].OrderStatus);
        this.scrollToSelectedRow(ldataList);

        this.SetFilteredWeight(this.selectedRow);

        return;
      }
      this.selectedRow.forEach((x) => (x.isSelected = false));
      this.selectedRow = [];
      row.isSelected = true;
      // this.selectedRow.push(row);
      let lClick: MouseEvent = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        button: 0,
        buttons: 0,
        clientX: 0,
        clientY: 0,
        metaKey: false,
        movementX: 0,
        movementY: 0,
        offsetX: 0,
        offsetY: 0,
        pageX: 0,
        pageY: 0,
        relatedTarget: null,
        screenX: 0,
        screenY: 0,
        x: 0,
        y: 0,
        getModifierState: function (keyArg: string): boolean {
          throw new Error('Function not implemented.');
        },
        initMouseEvent: function (
          typeArg: string,
          canBubbleArg: boolean,
          cancelableArg: boolean,
          viewArg: Window,
          detailArg: number,
          screenXArg: number,
          screenYArg: number,
          clientXArg: number,
          clientYArg: number,
          ctrlKeyArg: boolean,
          altKeyArg: boolean,
          shiftKeyArg: boolean,
          metaKeyArg: boolean,
          buttonArg: number,
          relatedTargetArg: EventTarget | null
        ): void {
          throw new Error('Function not implemented.');
        },
        detail: 0,
        view: null,
        which: 0,
        initUIEvent: function (
          typeArg: string,
          bubblesArg?: boolean | undefined,
          cancelableArg?: boolean | undefined,
          viewArg?: Window | null | undefined,
          detailArg?: number | undefined
        ): void {
          throw new Error('Function not implemented.');
        },
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: false,
        currentTarget: null,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        returnValue: false,
        srcElement: null,
        target: null,
        timeStamp: 0,
        type: '',
        composedPath: function (): EventTarget[] {
          throw new Error('Function not implemented.');
        },
        initEvent: function (
          type: string,
          bubbles?: boolean | undefined,
          cancelable?: boolean | undefined
        ): void {
          throw new Error('Function not implemented.');
        },
        preventDefault: function (): void {
          throw new Error('Function not implemented.');
        },
        stopImmediatePropagation: function (): void {
          throw new Error('Function not implemented.');
        },
        stopPropagation: function (): void {
          throw new Error('Function not implemented.');
        },
        AT_TARGET: 0,
        BUBBLING_PHASE: 0,
        CAPTURING_PHASE: 0,
        NONE: 0,
        // layerX: 0,
        // layerY: 0,
      };
      this.selectRow(row, ldataList, lClick);

      this.scrollToSelectedRow(ldataList);
      this.SetFilteredWeight(this.selectedRow);

      return;
    } else if (event.key === 'ArrowUp') {
      console.log('button pressed');

      // Define the list based on the current Tab
      let ldataList: any[] = [];

      if (this.CurrentTab == 'CREATING') {
        ldataList = this.PendingENT;
      } else if (this.CurrentTab == 'INCOMING') {
        ldataList = this.IncomingData;
      } else if (this.CurrentTab == 'DETAILING') {
        ldataList = this.PendingDET;
      } else if (this.CurrentTab == 'CANCELLED') {
        ldataList = this.CancelData;
      } else if (this.CurrentTab == 'PROCESSING') {
        ldataList = this.ProcessingData;
      } else if (this.CurrentTab == 'ALL') {
        ldataList = this.AllData;
      } else if (this.CurrentTab == 'SEARCH') {
        ldataList = this.SearchResultData;
      }

      //Find the index of the last selected element the Table;
      let lIndex = 0;
      if (this.lastSelctedRow == undefined) {
        lIndex = ldataList.findIndex(
          (x) => x == this.selectedRow[this.selectedRow.length - 1]
        );
      } else {
        lIndex = ldataList.findIndex((x) => x == this.lastSelctedRow);
      }
      // Break if the selected element is the last element of the list
      if (lIndex <= 0) {
        return;
      }

      // Define row
      // let row = ldataList[lIndex - 1];

      // Define row
      let row: any;

      if (this.lastButtonPresses == 'DOWN') {
        row = ldataList[lIndex];
      } else {
        row = ldataList[lIndex - 1];
      }
      this.lastSelctedRow = row;
      this.lastButtonPresses = 'UP';
      if (event.shiftKey && event.key === 'ArrowUp') {
        console.log('Multi Select Started');
        if (row.isSelected) {
          // Remove from this.selectedRow
          let tIndex = this.selectedRow.findIndex((x) => x == row);
          this.selectedRow.splice(tIndex, 1);
          row.isSelected = false;
        } else {
          row.isSelected = true;
          this.selectedRow.push(row);
        }
        this.setButtonDisplay(this.selectedRow[0].OrderStatus);
        // this.scrollToSelectedRow(ldataList);
        this.scrollToSelectedRowUp(lIndex);

        this.SetFilteredWeight(this.selectedRow);

        return;
      }
      this.selectedRow.forEach((x) => (x.isSelected = false));
      this.selectedRow = [];
      row.isSelected = true;
      // this.selectedRow.push(row);
      let lClick: MouseEvent = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        button: 0,
        buttons: 0,
        clientX: 0,
        clientY: 0,
        metaKey: false,
        movementX: 0,
        movementY: 0,
        offsetX: 0,
        offsetY: 0,
        pageX: 0,
        pageY: 0,
        relatedTarget: null,
        screenX: 0,
        screenY: 0,
        x: 0,
        y: 0,
        getModifierState: function (keyArg: string): boolean {
          throw new Error('Function not implemented.');
        },
        initMouseEvent: function (
          typeArg: string,
          canBubbleArg: boolean,
          cancelableArg: boolean,
          viewArg: Window,
          detailArg: number,
          screenXArg: number,
          screenYArg: number,
          clientXArg: number,
          clientYArg: number,
          ctrlKeyArg: boolean,
          altKeyArg: boolean,
          shiftKeyArg: boolean,
          metaKeyArg: boolean,
          buttonArg: number,
          relatedTargetArg: EventTarget | null
        ): void {
          throw new Error('Function not implemented.');
        },
        detail: 0,
        view: null,
        which: 0,
        initUIEvent: function (
          typeArg: string,
          bubblesArg?: boolean | undefined,
          cancelableArg?: boolean | undefined,
          viewArg?: Window | null | undefined,
          detailArg?: number | undefined
        ): void {
          throw new Error('Function not implemented.');
        },
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: false,
        currentTarget: null,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        returnValue: false,
        srcElement: null,
        target: null,
        timeStamp: 0,
        type: '',
        composedPath: function (): EventTarget[] {
          throw new Error('Function not implemented.');
        },
        initEvent: function (
          type: string,
          bubbles?: boolean | undefined,
          cancelable?: boolean | undefined
        ): void {
          throw new Error('Function not implemented.');
        },
        preventDefault: function (): void {
          throw new Error('Function not implemented.');
        },
        stopImmediatePropagation: function (): void {
          throw new Error('Function not implemented.');
        },
        stopPropagation: function (): void {
          throw new Error('Function not implemented.');
        },
        AT_TARGET: 0,
        BUBBLING_PHASE: 0,
        CAPTURING_PHASE: 0,
        NONE: 0,
        // layerX: 0,
        // layerY: 0,
      };
      this.selectRow(row, ldataList, lClick);

      //this.scrollToSelectedRow(ldataList);
      this.scrollToSelectedRowUp(lIndex);
      this.SetFilteredWeight(this.selectedRow);

      return;
    }
  }

  open() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ProcessordercontractlistComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.CustomerCode = this.selectedRow[0].CustomerCode;
    modalRef.componentInstance.ProjectCode = this.selectedRow[0].ProjectCode;
    modalRef.componentInstance.ProdType = this.selectedRow[0].ProdType;
  }

  openSearchPopup: boolean = false;
  openSearch() {
    debugger;
    // this.itemSize=30;
    this.activeTab = 6;
    this.CurrentTab = 'SEARCH';
    this.resetSettingsMenu();
    this.openSearchPopup = true;
    this.ResetProcessField();
    // this.setButtonDisplay('SEARCH');
    // this.cdr.detectChanges();
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ProcessordersearchPOComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.saveTrigger.subscribe(
      (x: GetSubmittedPOSearchModel) => {
        console.log('Return value', x);
        this.openSearchPopup = false;
        if (x) {
          localStorage.setItem('OrderSearchModalValue', JSON.stringify(x));
          this.GetSearchResultData(x);
        }
      }
    );
  }

  checkLowBed(pValue: any) {
    if (pValue.substr(0, 2) == 'LB') {
      this.ProcessorderCheckbox.controls.VehLowBed.patchValue(true);
    } else {
      this.ProcessorderCheckbox.controls.VehLowBed.patchValue(false);
    }
  }

  setTotalWeight(response: any) {
    this.lOrdersCT = 0;
    this.lOrdersWT = 0;
    for (var i = 0; i < response.length; i++) {
      // if (response[i].OrderStatus != "Cancelled" && response[i].SORStatus != "X") {
      this.lOrdersCT = this.lOrdersCT + 1;
      if (Number(response[i].TotalWeight) > 0) {
        this.lOrdersWT = this.lOrdersWT + Number(response[i].TotalWeight);
      }
      // }
    }
    this.lOrdersWT = Number(this.lOrdersWT).toFixed(3);
  }

  GetProcessOrderForCreate(item: any, value: boolean): void {
    debugger;
    this.CurrentTab = item;
    this.resetSettingsMenu();
    // this.setButtonDisplay(item);

    this.ProcessOrderLoading = true;
    let obj: any = {
      OrderStatus: item,
      Forecast: value,
    };
    this.orderService.GetPendingENT(obj).subscribe({
      next: (response) => {
        console.log('PendingENT response', response);
        response = this.UpdateTotalWeight(response);

        this.setTotalWeight(response);
        this.SetFilteredWeight(response);
        this.PendingENT = response.map((obj: any) => this.replaceNull(obj));
        this.MapData_UpdateAdditionalRemark(this.PendingENT);
        this.PendingENTBackUp = JSON.parse(JSON.stringify(this.PendingENT));
        this.ProcessOrderLoading = false;

        this.PendingENT = this.UpdateSelectedRecords(this.PendingENT);
        this.FilterPendingEntTableData();

        // Trigger re-check for ViewChild
        this.refreshContainers();
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetProcessOrderForIncoming(item: any, value: boolean): void {
    debugger;
    this.CurrentTab = item;
    this.resetSettingsMenu();
    // this.setButtonDisplay(item);

    this.ProcessOrderLoading = true;
    let obj: any = {
      OrderStatus: item,
      Forecast: value,
    };
    this.orderService.GetIncomingData(obj).subscribe({
      next: (response) => {
        console.log('Incoming response', response);

        // Filter for ESM User in Incoming
        response = this.filterDataforESM(response);

        response = this.UpdateTotalWeight(response);

        this.setTotalWeight(response);
        this.SetFilteredWeight(response);


        this.IncomingData = response.map((obj: any) => this.replaceNull(obj));
        this.MapData_UpdateAdditionalRemark(this.IncomingData);
        this.BackupIncomingData = JSON.parse(JSON.stringify(this.IncomingData));
        this.ProcessOrderLoading = false;

        this.IncomingData = this.UpdateSelectedRecords(this.IncomingData);

        this.FilterIncomingTableData();

        // Trigger re-check for ViewChild
        this.refreshContainers();
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetProcessOrderForPendingDET(item: any, value: boolean): void {
    debugger;
    this.CurrentTab = item;
    this.resetSettingsMenu();
    // this.setButtonDisplay(item);

    this.ProcessOrderLoading = true;
    let obj: any = {
      OrderStatus: item,
      Forecast: value,
    };

    this.orderService.GetIncomingData(obj).subscribe({
      next: (response) => {
        console.log('Detailing response', response);
        response = this.UpdateTotalWeight(response);

        this.setTotalWeight(response);
        this.SetFilteredWeight(response);

        this.PendingDET = response.map((obj: any) => this.replaceNull(obj));
        this.MapData_UpdateAdditionalRemark(this.PendingDET);
        this.PendingDETBackup = JSON.parse(JSON.stringify(this.PendingDET));
        this.ProcessOrderLoading = false;

        this.PendingDET = this.UpdateSelectedRecords(this.PendingDET);

        // Trigger re-check for ViewChild
        this.refreshContainers();
        this.FilterPendingDetTableData();
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetProcessOrderForCancel(item: any, value: boolean): void {
    debugger;
    this.CurrentTab = item;
    this.resetSettingsMenu();
    // this.setButtonDisplay(item);

    this.ProcessOrderLoading = true;
    let obj: any = {
      OrderStatus: item,
      Forecast: value,
    };

    this.orderService.GetIncomingData(obj).subscribe({
      next: (response) => {
        console.log('Cancel response', response);
        response = this.UpdateTotalWeight(response);

        this.setTotalWeight(response);
        this.SetFilteredWeight(response);

        this.CancelData = response.map((obj: any) => this.replaceNull(obj));
        this.MapData_UpdateAdditionalRemark(this.CancelData);
        this.CancelBackup = JSON.parse(JSON.stringify(this.CancelData));

        this.ProcessOrderLoading = false;

        this.CancelData = this.UpdateSelectedRecords(this.CancelData);

        // Trigger re-check for ViewChild
        this.refreshContainers();
        this.FilterCancelledTableData();
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetProcessOrderForProcessing(item: any): void {
    debugger;
    this.CurrentTab = item;
    this.resetSettingsMenu();
    // this.setButtonDisplay(item);

    this.ProcessOrderLoading = true;
    let obj: any = {
      Category: 'PROCESSING',
      OrigReqDateFrom: '',
      OrigReqDateTo: '',
      RequiredDateFrom: '',
      RequiredDateTo: '',
      PONo: '',
      BBSNo: '',
      CustomerName: '',
      ProjectTitle: [],
      WBS1: '',
      WBS2: '',
      WBS3: '',
      ProductType: [],
      ProjectPIC: [],
      DetailingPIC: [],
      SalesPIC: [],
      SONo: '',
      SOR: '',
      PODateFrom: '',
      PODateTo: '',
      WTNo: '',
      LoadNo: '',
      CDelDateFrom: '',
      CDelDateTo: '',
      DONo: '',
      InvNo: '',
      Forecast: false,
      UserName: this.loginService.GetGroupName(),
    };

    this.orderService.GetProcessingData(obj).subscribe({
      next: (response) => {
        console.log('Processing response data', response);
        response = this.UpdateTotalWeight(response);
        // if (response) {
        //   response.forEach((x: { TotalWeight: string; }) => {
        //     if (x.TotalWeight) {
        //       x.TotalWeight = this.ConverWeightFormat(x.TotalWeight)
        //     }
        //   })
        // }
        this.ProcessingData = response.map((obj: any) => this.replaceNull(obj));
        this.setTotalWeight(response);
        this.SetFilteredWeight(response);

        this.MapData_UpdateAdditionalRemark(this.ProcessingData);

        this.ProcessBackup = JSON.parse(JSON.stringify(this.ProcessingData));

        //this.CancelData = this.UpdateSelectedRecords(this.CancelData);
        this.refreshContainers();
        this.FilterProcessingTableData();
      },
      error: (e) => {},
      complete: () => {
        this.ProcessOrderLoading = false;
      },
    });
  }

  GetProcessOrderForALL(item: any): void {
    if (
      !confirm(
        'You selected to retrieve all active orders. It will need 5-10 minutes to complete the data extraction, continue?'
      )
    ) {
      // stopLoading();
      return;
    }
    // debugger;
    this.CurrentTab = 'ALL';
    this.resetSettingsMenu();
    // this.setButtonDisplay(item);

    this.ProcessOrderLoading = true;
    // let obj: any = {
    //   OrderStatus: item,
    // };
    let obj: any = {
      Category: 'ALL',
      OrigReqDateFrom: '',
      OrigReqDateTo: '',
      RequiredDateFrom: '',
      RequiredDateTo: '',
      PONo: '',
      BBSNo: '',
      CustomerName: '',
      ProjectTitle: [],
      WBS1: '',
      WBS2: '',
      WBS3: '',
      ProductType: [],
      ProjectPIC: [],
      DetailingPIC: [],
      SalesPIC: [],
      SONo: '',
      SOR: '',
      PODateFrom: '',
      PODateTo: '',
      WTNo: '',
      LoadNo: '',
      CDelDateFrom: '',
      CDelDateTo: '',
      DONo: '',
      InvNo: '',
      Forecast: false,
      UserName: this.loginService.GetGroupName(),
    };

    this.orderService.GetAllData(obj).subscribe({
      next: (response) => {
        console.log('All response', response);
        response = this.UpdateTotalWeight(response);

        this.AllData = response.map((obj: any) => this.replaceNull(obj));
        this.setTotalWeight(response);
        this.SetFilteredWeight(response);

        this.MapData_UpdateAdditionalRemark(this.AllData);
        this.AllDataBackup = JSON.parse(JSON.stringify(this.AllData));

        this.refreshContainers();
        this.FilterAllTableData();
      },
      error: (e) => {},
      complete: () => {
        this.ProcessOrderLoading = false;
      },
    });
  }

  GetSearchResultData(obj: GetSubmittedPOSearchModel) {
    // obj = {
    //   Category: "SEARCH",
    //   OrigReqDateFrom: "",
    //   OrigReqDateTo: "",
    //   RequiredDateFrom: "",
    //   RequiredDateTo: "",
    //   PONo: "",
    //   BBSNo: "",
    //   CustomerName: "",
    //   ProjectTitle: [""],
    //   WBS1: "",
    //   WBS2: "",
    //   WBS3: "",
    //   ProductType: [""],
    //   ProjectPIC: [""],
    //   DetailingPIC: [""],
    //   SalesPIC: [""],
    //   SONo: "",
    //   SOR: "",
    //   PODateFrom: "",
    //   PODateTo: "",
    //   WTNo: "",
    //   LoadNo: "",
    //   CDelDateFrom: "",
    //   CDelDateTo: "",
    //   DONo: "",
    //   InvNo: "",
    //   Forecast: false,
    // }
    this.ProcessOrderLoading = true;
    this.orderService.getSearchResultData(obj).subscribe({
      next: (response) => {
        this.ProcessOrderLoading = false;
        this.SearchResultData = response.map((obj: any) =>
          this.replaceNull(obj)
        );
        this.setTotalWeight(response);
        this.SetFilteredWeight(response);

        this.MapData_UpdateAdditionalRemark(this.SearchResultData);
        this.SearchResultDataBackup = JSON.parse(
          JSON.stringify(this.SearchResultData)
        );
        console.log('search result', response);
        //this.cdr.detectChanges();
        this.gSearchTabFlag = true;
        // this.FirstRowSelected(this.SearchResultData);

        this.refreshContainers();
        this.FilterSearchTableData();
      },
      error: (e) => {
        this.ProcessOrderLoading = false;
        alert(
          'Error in getting data. Please check the Internet connection and try again.'
        );
      },
      complete: () => {
        this.ProcessOrderLoading = false;
      },
    });
  }

  GetProcessContracts(item: any): void {
    debugger;
    // this.ProcessOrderLoading = true;
    let obj: any = {
      CustomerCode: item,
      ProjectCode: item,
      ProdType: item,
    };

    this.orderService.GetProcessContractList(obj).subscribe({
      next: (response) => {
        console.log('Contractlist response', response);
        this.ContractList = response;
        //this.ProcessOrderLoading = false;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetProcessVehicleType(): void {
    debugger;
    // this.ProcessOrderLoading = true;

    this.orderService.GetVehicleTypeList().subscribe({
      next: (response) => {
        console.log('GetVehicleTypeList response', response);
        // if (!response) {
        //   response = [
        //     "-",
        //     "EXP-Export",
        //     "FR20-20ft Flat Rack",
        //     "FR40-40ft Flat Rack",
        //     "HC-Haip Crane",
        //     "HC1-10 Wheel Hiap Crane",
        //     "HC10-10 Wheel Hiap Crane",
        //     "HC12-12 Wheel Hiap Crane",
        //     "HC6-6 Wheel Hiap Crane",
        //     "LB30-30ft Low Bed",
        //     "LB35-35ft Low Bed",
        //     "LB40-40ft Low Bed",
        //     "LBE-Low Bed Escoted",
        //     "MC-Main-con",
        //     "PM-Prime over",
        //     "RORO-RORO trucks",
        //     "SC-Self Collection",
        //     "SL40-40ft Side Lifter",
        //     "TR20/24-20ft 24mt Trailer",
        //     "TR40/24-40ft 24mt Trailer",
        //     "TR40/34-40ft 34mt Trailer",
        //     "TR40/36-40ft 36mt Trailer",
        //     "TR40/50-40ft 50mt Trailer",
        //     "TR45/24-45ft 24mt Trailer",
        //     "TR45/36-45ft 36mt Trailer",
        //     "TR45/50-45ft 50mt Trailer",
        //     "Z001-Lorry Crane (6mt)",
        //     "Z002-Lorry Crane (8mt)",
        //     "Z003-Prime Movr (CAB/COU)",
        //     "Z004-Prm Mvr(BPC/PC/MESH)",
        //     "Z005-Prime Mover (STD)",
        //     "Z006-Low Bed (30ft)",
        //     "Z007-Low Bed (40ft)",
        //     "Z008-Own Lorry Crane",
        //     "Z009-Own Prime Mover"
        //   ]
        // }
        let tempList: any[] = [];
        response.forEach((x) => {
          let temp = x.split('-');
          let obj = {
            code: temp[0],
            value: temp[1],
          };
          tempList.push(obj);
        });
        this.VehicleTypeList = tempList;
        //this.ProcessOrderLoading = false;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }
  public onPageChangeENT(pageNumENT: number): void {
    this.pageSizeENT = this.itemsPerPageENT * (pageNumENT - 1);
    //this.LoadShapeGroupList();
  }

  public onPageChangeCancel(pageNumCancel: number): void {
    debugger;
    this.pageSizeCancel = this.itemsPerPageCancel * (pageNumCancel - 1);
    //this.LoadShapeGroupList();
  }

  public onPageChangeIncoming(pageNumIncoming: number): void {
    debugger;
    this.pageSizeIncoming = this.itemsPerPageIncoming * (pageNumIncoming - 1);
    //this.LoadShapeGroupList();
  }
  public onPageChangeProcessing(pageNumProcessing: number): void {
    debugger;
    this.pageSizeProcessing =
      this.itemsPerPageProcessing * (pageNumProcessing - 1);
    //this.LoadShapeGroupList();
  }
  public onPageChangeSearch(pageNumSearch: number): void {
    debugger;
    this.pageSizeSearch = this.itemsPerPageSearch * (pageNumSearch - 1);
    //this.LoadShapeGroupList();
  }
  public onPageChangeAll(pageNumAll: number): void {
    debugger;
    this.pageSizeAll = this.itemsPerPageAll * (pageNumAll - 1);
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }
  OnPageSizeChangeENT(pageSize: number) {
    this.pageSizeENT = 0;
    this.currentPageENT = 1;
  }
  OnPageSizeChangeCancel(pageSizeCancel: number) {
    debugger;
    this.pageSizeCancel = 0;
    this.currentPageCancel = 1;
  }

  OnPageSizeChangeIncoming(pageSizeIncoming: number) {
    debugger;
    this.pageSizeIncoming = 0;
    this.currentPageIncoming = 1;
  }
  OnPageSizeChangeProcessing(pageSizeIncoming: number) {
    debugger;
    this.pageSizeProcessing = 0;
    this.currentPageProcessing = 1;
  }
  OnPageSizeChangeSearch(pageSizeIncoming: number) {
    debugger;
    this.pageSizeSearch = 0;
    this.currentPageSearch = 1;
  }
  OnPageSizeChangeAll(pageSizeIncoming: number) {
    debugger;
    this.pageSizeAll = 0;
    this.currentPageAll = 1;
  }

  resetSelectedRowColor() {
    if (this.CurrentTab == 'CREATING') {
      this.PendingENT.forEach((element) => {
        element.isSelected = false;
      });
    } else if (this.CurrentTab == 'INCOMING') {
      this.IncomingData.forEach((element) => {
        element.isSelected = false;
      });
    } else if (this.CurrentTab == 'DETAILING') {
      this.PendingDET.forEach((element) => {
        element.isSelected = false;
      });
    } else if (this.CurrentTab == 'CANCELLED') {
      this.CancelData.forEach((element) => {
        element.isSelected = false;
      });
    } else if (this.CurrentTab == 'PROCESSING') {
      this.ProcessingData.forEach((element) => {
        element.isSelected = false;
      });
    } else if (this.CurrentTab == 'ALL') {
      this.AllData.forEach((element) => {
        element.isSelected = false;
      });
    } else if (this.CurrentTab == 'SEARCH') {
      this.SearchResultData.forEach((element) => {
        element.isSelected = false;
      });
    }
  }

  resetInputDisplay(item: any) {
    let ProdType = item.ProdType;
    let ProdSubType = item.ProdTypeDis;

    if (ProdType == 'Rebar' || ProdType == 'CAB') {
      this.showTotalWeight = false;
      this.showTotalPcs = false;
      this.showCabWeight = true;
      this.showSbWeight = true;

      this.showProjectStage = true;
      this.showSONumber = false;
      if (ProdSubType == 'STANDARD-BAR') {
        // document.getElementById("containerBBS").style.display = "none";
        // document.getElementById("containerBBSBar").style.display = "inline-block";
      } else {
        // document.getElementById("containerBBS").style.display = "inline-block";
        // document.getElementById("containerBBSBar").style.display = "none";
      }
    }
    if (
      ProdType == 'Standard MESH' ||
      ProdType == 'STANDARD-MESH' ||
      ProdType == 'STANDARD-BAR' ||
      ProdType == 'COIL' ||
      ProdType == 'COUPLER'
    ) {
      this.showTotalWeight = true;
      this.showTotalPcs = true;
      this.showCabWeight = false;
      this.showSbWeight = false;

      this.showProjectStage = false;
      this.showSONumber = true;
    }
    if (
      ProdType == 'MESH' ||
      ProdType == 'STIRRUP-LINK-MESH' ||
      ProdType == 'COLUMN-LINK-MESH' ||
      ProdType == 'CUT-TO-SIZE-MESH' ||
      ProdType == 'PRE-CAGE' ||
      ProdType == 'CARPET' ||
      ProdType == 'CORE-CAGE' ||
      ProdType == 'ACS'
    ) {
      this.showTotalWeight = true;
      this.showTotalPcs = true;
      this.showCabWeight = false;
      this.showSbWeight = false;

      this.showProjectStage = true;
      this.showSONumber = false;
    }
    if (ProdType == 'BPC') {
      this.showTotalWeight = true;
      this.showTotalPcs = true;
      this.showCabWeight = false;
      this.showSbWeight = false;

      this.showProjectStage = false;
      this.showSONumber = false;
    }
    if (ProdType == 'COMPONENT') {
      this.showTotalWeight = true;
      this.showTotalPcs = true;
      this.showCabWeight = false;
      this.showSbWeight = false;

      this.showProjectStage = true;
      this.showSONumber = false;
    }
  }

  selectRow(row: any, dataList: any[], event: MouseEvent) {
    // this.myTable.nativeElement.tabIndex = 0;
    console.log('here', row);
    this.lastSelectedTable = false;
    // this.setButtonDisplay(row.OrderStatus);

    //Disable the Submit Button at the start
    this.DisableSubmitButton();

    this.gGreenSteelSelection = false;
    this.gEditStructureElement_Flag = false;

    // this.Collapse = false;

    if (event.ctrlKey && this.cellSelection == false) {
      // Handle multiselect with Ctrl key
      if (this.selectedRow.length == 0) {
        this.lastSelctedRow = row;
        // Run as a normal click
      } else {
        console.log('Multi Select Started');
        if (row.isSelected) {
          // Remove from this.selectedRow

          let tIndex = this.selectedRow.findIndex((x) => x == row);
          this.selectedRow.splice(tIndex, 1);
          row.isSelected = false;
          if (tIndex === 0) {
            this.UpdateDisplayFields();
          } //temp commented
        } else {
          row.isSelected = true;
          this.selectedRow.push(row);

          this.lastSelctedRow = row;
        }
        this.setButtonDisplay(this.selectedRow[0].OrderStatus);
        this.SetFilteredWeight(this.selectedRow);

        return;
      }
    } else if (event.shiftKey) {
      // Handle multiselect with Shift key.
      if (this.selectedRow.length == 0) {
        // Run as a normal click.
      } else {
        // STEP 1 - Unselect All Rows excepts the last selected row.
        // STEP 2 - Select all the rows between the last selected row and the current row.
        console.log('Multi Select Started');
        let lIndex = 0;

        // STEP 1
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].sno != this.lastSelctedRow.sno) {
            dataList[i].isSelected = false;
          } else {
            lIndex = i;
          }
        }

        this.selectedRow = [];

        // The index of the currently selected row in the list.
        let nIndex = dataList.findIndex((x) => x == row);

        // STEP 2
        if (nIndex > lIndex) {
          // Add all the rows between the two indexes.
          for (let i = lIndex; i < nIndex + 1; i++) {
            dataList[i].isSelected = true;
            this.selectedRow.push(dataList[i]);
          }
        } else {
          // Add all the rows between the two indexes.
          for (let i = nIndex; i < lIndex + 1; i++) {
            dataList[i].isSelected = true;
            this.selectedRow.push(dataList[i]);
          }
        }

        this.setButtonDisplay(this.selectedRow[0].OrderStatus);
        console.log('selectedRow', this.selectedRow);
        this.SetFilteredWeight(this.selectedRow);

        return;
      }
    }
    this.lastSelctedRow = row;

    if (
      this.cellSelection == true &&
      row.isSelected == true &&
      event.shiftKey
    ) {
      this.resetSelectedRowColor();
      row.isSelected = true;
      this.selectedRow = [];
      this.selectedRow.push(row);
      this.SetFilteredWeight(this.selectedRow);

      return;
    }
    // When 0 row is Selected
    this.ProcessOrderForm.reset();
    this.ProcessorderCheckboxreset();
    this.resetSelectedRowColor();
    this.resetInputDisplay(row);

    row.isSelected = true;

    //this.showWBS = row.StructureElement == 'NONWBS' ? false : true;
    this.selectedRow = [];
    this.selectedRow[0] = row;
    var lProdType = this.selectedRow[0].ProdType;
    var lProdSubType = this.selectedRow[0].ProdTypeDis;
    this.disProdType(lProdType, lProdSubType);
    this.DisableFields(this.selectedRow[0].OrderStatus);

    // this.setButtonDisplay(row.OrderStatus);
    this.SetFilteredWeight(this.selectedRow);

    this.GetStrctureElementListPOST(this.selectedRow[0]);

    // Condition updated to handle Partial Delivered Orders.
    if (
      row.OrderStatus != 'Cancelled' &&
      row.OrderStatus != 'Processed' &&
      row.OrderStatus != 'Production' &&
      row.OrderStatus != 'Reviewed' &&
      row.OrderStatus != 'Delivered' &&
      !row.OrderStatus.includes('Delivered')
    ) {
      this.ProcessOrderForm.controls['customer'].patchValue(
        this.selectedRow[0].CustomerName +
          ' (' +
          this.selectedRow[0].CustomerCode +
          ')'
      );
      this.ProcessOrderForm.controls['customer'].disable();

      this.ProcessOrderForm.controls['project'].patchValue(
        this.selectedRow[0].ProjectTitle +
          ' (' +
          this.selectedRow[0].ProjectCode +
          ')'
      );
      this.ProcessOrderForm.controls['project'].disable();

      let lOrderTypeList = this.OrderTypeList;
      if (lOrderTypeList.includes(this.selectedRow[0].OrderType)) {
        this.ProcessOrderForm.controls['OrderType'].patchValue(
          this.selectedRow[0].OrderType
            ? this.selectedRow[0].OrderType
            : 'CREDIT'
        );
      } else {
        this.ProcessOrderForm.controls['OrderType'].patchValue('CREDIT');
      }

      this.ProcessOrderForm.controls['ponumber'].patchValue(
        this.selectedRow[0].PONumber
      );

      if (
        this.selectedRow[0].ProjectStage == '' ||
        this.selectedRow[0].ProjectStage == null
      ) {
        this.ProcessOrderForm.controls['ProjectStage'].patchValue(
          'TYP-Typical Floor'
        );
      } else {
        this.ProcessOrderForm.controls['ProjectStage'].patchValue(
          this.selectedRow[0].ProjectStage
        );
      }

      // Address & Gate Number

      this.ProcessOrderForm.controls['Address'].patchValue(
        this.selectedRow[0].Address
      );

      this.ProcessOrderForm.controls['Gate'].patchValue(
        this.selectedRow[0].Gate
      );

      this.ProcessOrderForm.controls['SONumber'].patchValue(
        this.selectedRow[0].SAPSONo
      );

      this.ProcessOrderForm.controls['ReqDate'].patchValue(
        this.selectedRow[0].RequiredDate
      );

      this.ProcessOrderForm.controls['UpdateReqDate'].patchValue(
        this.selectedRow[0].RequiredDate
      );

      this.ProcessOrderForm.controls['CABWeight'].patchValue(
        Number(this.selectedRow[0].TotalCABWeight).toFixed(3)
      );
      this.ProcessOrderForm.controls['CABWeight'].disable();

      this.ProcessOrderForm.controls['SBWeight'].patchValue(
        Number(this.selectedRow[0].TotalSTDWeight).toFixed(3)
      );
      this.ProcessOrderForm.controls['SBWeight'].disable();

      this.ProcessOrderForm.controls['TotalWeight'].patchValue(
        Number(this.selectedRow[0].TotalWeight).toFixed(3)
      );
      this.ProcessOrderForm.controls['TotalWeight'].disable();

      this.ProcessOrderForm.controls['TotalPcs'].patchValue(
        Number(this.selectedRow[0].TotalSTDWeight).toFixed(0)
      );
      this.ProcessOrderForm.controls['TotalPcs'].disable();

      this.ProcessOrderForm.controls['wbs1'].patchValue(
        this.selectedRow[0].WBS1
      );
      this.ProcessOrderForm.controls['wbs1'].enable();

      this.ProcessOrderForm.controls['wbs2'].patchValue(
        this.selectedRow[0].WBS2
      );
      this.ProcessOrderForm.controls['wbs2'].enable();

      this.ProcessOrderForm.controls['wbs3'].patchValue(
        this.selectedRow[0].WBS3
      );
      this.ProcessOrderForm.controls['wbs3'].enable();

      let tempvalue = this.VehicleTypeList.find(
        (x: { code: any }) => x.code === this.selectedRow[0].TransportMode
      );
      if (tempvalue) {
        this.ProcessOrderForm.controls['VehicleType'].patchValue(
          tempvalue.code
        );
      } else {
        tempvalue = this.VehicleTypeList2.find(
          (x: { code: any }) => x.code === this.selectedRow[0].TransportMode
        );
        if (tempvalue) {
          this.ProcessOrderForm.controls['VehicleType'].patchValue(
            tempvalue.code
          );
        }
      }
      this.SetRemarks(
        this.selectedRow[0].AdditionalRemark,
        this.selectedRow[0].SiteEngr_Name,
        this.selectedRow[0].SiteEngr_HP,
        this.selectedRow[0].Scheduler_Name,
        this.selectedRow[0].Scheduler_HP
      );
      this.GetContractList(
        row.CustomerCode,
        row.ProjectCode,
        row.JobID,
        row.OrderSource,
        row.StructureElement,
        row.ProdType,
        row.ProdTypeDis,
        row.ScheduledProd
      );
      this.GetWBSAll();
    } else {
      this.orderService
        .Get_ProcessRec(
          row.CustomerCode,
          row.ProjectCode,
          row.JobID,
          row.StructureElement,
          row.ProdType,
          row.ScheduledProd,
          row.OrderSource,
          row.SORNo
        )
        .subscribe({
          next: (response) => {
            console.log('GetVehicleTypeList response', response);

            response = response?.Value;
            if(!response) {
              return;
            }
            let isGreenSteel = response.isGreenSteel;
            this.gGreenSteelSelection = isGreenSteel;
            this.isReviewedGreenOrder = true;
            response = response.result;

            let tempList: any[] = [];
            this.ProcessOrderForm.controls['customer'].patchValue(
              this.selectedRow[0].CustomerName +
                ' (' +
                this.selectedRow[0].CustomerCode +
                ')'
            );
            this.ProcessOrderForm.controls['customer'].disable();

            this.ProcessOrderForm.controls['project'].patchValue(
              this.selectedRow[0].ProjectTitle +
                ' (' +
                this.selectedRow[0].ProjectCode +
                ')'
            );
            this.ProcessOrderForm.controls['project'].disable();
            this.ProcessOrderForm.controls['OrderType'].patchValue(
              response.OrderType == null ? 'CREDIT' : response.OrderType
            );

            this.ProcessOrderForm.controls['ponumber'].patchValue(
              response.PONumber
            );

            // if (
            //   this.selectedRow[0].ProjectStage == '' ||
            //   this.selectedRow[0].ProjectStage == null
            // ) {
            //   this.ProcessOrderForm.controls['ProjectStage'].patchValue(
            //     'TYP-Typical Floor'
            //   );
            // } else {
            //   this.ProcessOrderForm.controls['ProjectStage'].patchValue(
            //     this.selectedRow[0].ProjectStage
            //   );
            // }
            this.ProcessOrderForm.controls['ProjectStage'].patchValue(
              response.ProjectStage
            );
            this.ProcessOrderForm.controls['Contract'].patchValue(
              response.Contract ? response.Contract : 'SPOT ORDER'
            );

            if (response.Contract) {
              this.ContractListDDL = [];
              this.ContractListDDL[0] = response.Contract;
              this.GetGreenSteelValue(response.Contract);
            } else {
              this.ContractListDDL = [];
              this.ContractListDDL[0] = 'SPOT ORDER';
            }
            this.showInvoiceRemarks =
              this.ContractListDDL[0].substr(0, 10) == 'SPOT ORDER'
                ? true
                : false;

            //Update value of Address & Gate
            // Address & Gate Number
            this.ProcessOrderForm.controls['Address'].patchValue(
              this.selectedRow[0].Address
            );

            this.ProcessOrderForm.controls['Gate'].patchValue(
              this.selectedRow[0].Gate
            );
            
            // this.ProcessOrderForm.controls['ShipTo'].patchValue(
            //   response.ShipToParty
            // );

            // date-10/11/2025
            // reset buttons after the API calls
            this.setButtonDisplay(this.selectedRow[0].OrderStatus);



            this.ProcessOrderForm.controls['SONumber'].patchValue(
              this.selectedRow[0].SAPSONo
            );
            let lProdType = this.selectedRow[0].ProdType;
            if (
              lProdType == 'Standard MESH' ||
              lProdType == 'STANDARD-MESH' ||
              lProdType == 'STANDARD-BAR' ||
              lProdType == 'COIL' ||
              lProdType == 'COUPLER'
            ) {
              this.ProcessOrderForm.controls['SONumber'].patchValue(
                this.selectedRow[0].SORNo
              );
            }

            if (response.IsGreenSteel) {
              if (response.IsGreenSteel == 'Y') {
                this.gGreenSteelSelection = true;
              } else {
                this.gGreenSteelSelection = false;
              }
            }
            var myDate = response.RequiredDateFrom.substr(0, 10);
            // var myDateStr =
            //   myDate.getFullYear().toString() +
            //   '-' +
            //   this.pad((myDate.getMonth() + 1).toString(), 2) +
            //   '-' +
            //   this.pad(myDate.getDate().toString(), 2);
            this.ProcessOrderForm.controls['ReqDate'].patchValue(myDate);

            myDate = response.RequiredDateTo.substr(0, 10);
            // myDate =
            //   myDate.getFullYear().toString() +
            //   '-' +
            //   this.pad((myDate.getMonth() + 1).toString(), 2) +
            //   '-' +
            //   this.pad(myDate.getDate().toString(), 2);
            this.ProcessOrderForm.controls['UpdateReqDate'].patchValue(myDate);

            this.ProcessOrderForm.controls['CABWeight'].patchValue(
              parseFloat(response.TotalCABWeight).toFixed(3)
            );
            this.ProcessOrderForm.controls['CABWeight'].disable();

            this.ProcessOrderForm.controls['SBWeight'].patchValue(
              parseFloat(response.TotalSTDWeight).toFixed(3)
            );
            this.ProcessOrderForm.controls['SBWeight'].disable();

            this.ProcessOrderForm.controls['TotalWeight'].patchValue(
              Number(this.selectedRow[0].TotalWeight).toFixed(3)
            );
            this.ProcessOrderForm.controls['TotalWeight'].disable();

            this.ProcessOrderForm.controls['TotalPcs'].patchValue(
              Number(this.selectedRow[0].TotalSTDWeight).toFixed(0)
            );
            this.ProcessOrderForm.controls['TotalPcs'].disable();

            this.ProcessOrderForm.controls['wbs1'].patchValue(
              this.selectedRow[0].WBS1
            );
            this.ProcessOrderForm.controls['wbs1'].enable();

            this.ProcessOrderForm.controls['wbs2'].patchValue(
              this.selectedRow[0].WBS2
            );
            this.ProcessOrderForm.controls['wbs2'].enable();

            this.ProcessOrderForm.controls['wbs3'].patchValue(
              this.selectedRow[0].WBS3
            );
            this.ProcessOrderForm.controls['wbs3'].enable();

            let tempvalue = this.VehicleTypeList.find(
              (x: { code: any }) => x.code === this.selectedRow[0].TransportMode
            );
            if (tempvalue) {
              this.ProcessOrderForm.controls['VehicleType'].patchValue(
                tempvalue.code
              );
            } else {
              tempvalue = this.VehicleTypeList2.find(
                (x: { code: any }) =>
                  x.code === this.selectedRow[0].TransportMode
              );
              if (tempvalue) {
                this.ProcessOrderForm.controls['VehicleType'].patchValue(
                  tempvalue.code
                );
              }
            }

            // this.SetRemarks(
            //   this.selectedRow[0].AdditionalRemark,
            //   this.selectedRow[0].SiteEngr_Name,
            //   this.selectedRow[0].SiteEngr_HP,
            //   this.selectedRow[0].Scheduler_Name,
            //   this.selectedRow[0].Scheduler_HP
            // );

            this.InternalRemarks = response.IntRemarks;
            this.ExternalRemarks = response.ExtRemarks;
            this.InvoiceRemarks = response.InvRemarks;
            this.ProcessorderCheckbox.controls.UrgentOrder.patchValue(
              response.Urgent
            );
            this.ProcessorderCheckbox.controls.Conquas.patchValue(
              response.Conquas
            );
            this.ProcessorderCheckbox.controls.Crane.patchValue(response.Crane);
            this.ProcessorderCheckbox.controls.PremiumService.patchValue(
              response.Premium
            );
            this.ProcessorderCheckbox.controls.ZeroTol.patchValue(
              response.ZeroTol
            );
            this.ProcessorderCheckbox.controls.CallBDel.patchValue(
              response.CallDel
            );
            this.ProcessorderCheckbox.controls.DoNotMix.patchValue(
              response.DoNotMix
            );
            this.ProcessorderCheckbox.controls.SpecialPass.patchValue(
              response.SpecialPass
            );
            this.ProcessorderCheckbox.controls.VehLowBed.patchValue(
              response.LowBed
            );
            this.ProcessorderCheckbox.controls.Veh50Ton.patchValue(
              response.Veh50Ton
            );
            this.ProcessorderCheckbox.controls.Borge.patchValue(response.Borge);
            this.ProcessorderCheckbox.controls.PoliceEscort.patchValue(
              response.PoliceEscort
            );
            this.ProcessorderCheckbox.controls.FabricateESM.patchValue(
              response.FabricateESM
            );
            this.ProcessorderCheckbox.controls.TimeRange.patchValue(
              response.TimeRange
            );
            let row = this.selectedRow[0];
            this.GetOrderDetailsTable(
              row.CustomerCode,
              row.ProjectCode,
              row.JobID,
              row.OrderSource,
              row.StructureElement,
              row.ProdType,
              row.ProdTypeDis,
              row.ScheduledProd
            );

            this.DisableFields(this.selectedRow[0].OrderStatus);

            // response.forEach((x) => {
            //   let temp = x.split('-');
            //   let obj = {
            //     code: temp[0],
            //     value: temp[1],
            //   };
            //   tempList.push(obj);
            // });
            //this.VehicleTypeList = tempList;
            //this.ProcessOrderLoading = false;
          },
          error: (e) => {},
          complete: () => {},
        });
    }
    // this.GetOrderDetailsTable(
    //   row.CustomerCode,
    //   row.ProjectCode,
    //   row.JobID,
    //   row.OrderSource,
    //   row.StructureElement,
    //   row.ProdType,
    //   row.ProdTypeDis,
    //   row.ScheduledProd
    // );

    // this.GetBBSProcess(row.CustomerCode, row.ProjectCode, row.JobID, row.OrderSource, row.StructureElement, row.ProdType, row.ScheduledProd);
  }
  SetRemarks(
    lDelAddr: any,
    lEngName: any,
    lEngMobile: any,
    lSchName: any,
    lSchMobile: any
  ) {
    console.log('Remarks');
    let lProdType = this.selectedRow[0].ProdType;
    let lProdTypeL2 = this.selectedRow[0].ProdTypeDis;
    // var lDelAddr = pGrid.getDataItem(pRowNo).DeliveryAddress.toUpperCase();
    // var lEngName = pGrid.getDataItem(pRowNo).SiteEngr_Name.toUpperCase();
    // var lEngMobile = pGrid.getDataItem(pRowNo).SiteEngr_HP.toUpperCase();
    // var lSchName = pGrid.getDataItem(pRowNo).Scheduler_Name.toUpperCase();
    // var lSchMobile = pGrid.getDataItem(pRowNo).Scheduler_HP.toUpperCase();

    if (lDelAddr == null) {
      lDelAddr = '';
    }
    lDelAddr = lDelAddr.trim();

    if (lEngName == null) {
      lEngName = '';
    }
    lEngName = lEngName.trim();

    if (lEngMobile == null) {
      lEngMobile = '';
    }
    lEngMobile = lEngMobile.trim();

    if (lSchName == null) {
      lSchName = '';
    }
    lSchName = lSchName.trim();

    if (lSchMobile == null) {
      lSchMobile = '';
    }
    lSchMobile = lSchMobile.trim();

    this.Remarks = '';
    //Special remarks
    if (
      this.selectedRow[0].Remarks != null &&
      this.selectedRow[0].Remarks.trim() != ''
    ) {
      this.Remarks = this.selectedRow[0].Remarks.trim();
    }
    //Good receiver
    if (lEngName != null && lEngName != '') {
      if (this.Remarks == '') {
        this.Remarks = '*' + lEngName;
      } else {
        this.Remarks = this.Remarks + ' /*' + lEngName;
      }
      if (lEngMobile != '') {
        this.Remarks = this.Remarks + ' ' + lEngMobile;
      }
    }
    //Site Contact
    if (lSchName != null && lSchName != '' && lSchName != lEngName) {
      if (lEngName == null || lEngName == '') {
        if (this.Remarks == '') {
          this.Remarks = '*' + lSchName;
        } else {
          this.Remarks = this.Remarks + ' /*' + lSchName;
        }
      } else {
        if (this.Remarks == '') {
          this.Remarks = '*' + lSchName;
        } else {
          this.Remarks = this.Remarks + '/' + lSchName;
        }
      }

      if (lSchMobile != '') {
        this.Remarks = this.Remarks + ' ' + lSchMobile;
      }
      this.Remarks = this.Remarks + '*';
    } else {
      if (lEngName != null && lEngName != '') {
        this.Remarks = this.Remarks + '*';
      }
    }
    // delivery address
    if (lDelAddr != null && lDelAddr != '') {
      if (this.Remarks == '') {
        this.Remarks = this.Remarks + lDelAddr;
      } else {
        if (this.Remarks.substring(this.Remarks.length - 1) == '*') {
          this.Remarks = this.Remarks + '/ ' + lDelAddr;
        } else {
          this.Remarks = this.Remarks + ' / ' + lDelAddr;
        }
      }
    }

    if (this.Remarks.length > 100) {
      this.Remarks = this.Remarks.substring(0, 100);
    }

    var lIntRemarks = this.Remarks.replace(/\*/g, '', '');
    var lExtRemarks = this.Remarks;

    // Add transport mode
    var lTrnMode = this.selectedRow[0].TransportMode;
    if (
      lTrnMode == 'SC' &&
      //lIntRemarks.indexOf('SELF COLLECTION') < 0 &&
      lIntRemarks.indexOf('{SC}') < 0
    ) {
      lIntRemarks = '{SC} ' + lIntRemarks;
      lExtRemarks = '{SC} ' + lExtRemarks;
    } else if (
      lTrnMode.indexOf('HC') >= 0 &&
      lIntRemarks.indexOf('{LCO}') < 0
    ) {
      lIntRemarks = '{LCO} ' + lIntRemarks;
      lExtRemarks = '{LCO} ' + lExtRemarks;
    } else if (
      lTrnMode.indexOf('LB') >= 0 &&
      lTrnMode.indexOf('LBE') < 0 &&
      // lIntRemarks.indexOf('{LOW BED}') < 0 &&
      lIntRemarks.indexOf('{LB}') < 0
    ) {
      lIntRemarks = '{LB} ' + lIntRemarks;
      lExtRemarks = '{LB} ' + lExtRemarks;
    } else if (
      lTrnMode.indexOf('LBE') >= 0 &&
      lIntRemarks.indexOf('{ESCORTED}') < 0
    ) {
      lIntRemarks = '{ESCORTED} ' + lIntRemarks;
      lExtRemarks = '{ESCORTED} ' + lExtRemarks;
    }

    if (lIntRemarks.length > 100) {
      lIntRemarks = lIntRemarks.substring(0, 100);
    }

    if (lExtRemarks.length > 100) {
      lExtRemarks = lExtRemarks.substring(0, 100);
    }

    /**
     * Commented by Kunal
     * NOTE: To show complete remarks before submitting.
     * Date -> 05-06-2024
     */
    // if (lProdTypeL2 == 'COUPLER') {
    //   if (lIntRemarks.length > 87) {
    //     lIntRemarks = lIntRemarks.substring(0, 87);
    //   }
    // }

    if (lIntRemarks != '' || lExtRemarks != '') {
      this.InternalRemarks = lIntRemarks;
      this.ExternalRemarks = lExtRemarks;

      if (lProdType == 'BPC') {
        if (this.OrderDetailsList_BPC.length > 0) {
          for (let i = 0; i < this.OrderDetailsList_BPC.length; i++) {
            this.OrderDetailsList_BPC[i].int_remarks = this.InternalRemarks;
            this.OrderDetailsList_BPC[i].ext_remarks = this.ExternalRemarks;
          }
        }
      }
    } else {
      this.InternalRemarks = '';
      this.ExternalRemarks = '';
    }
    this.InvoiceRemarks = '';
  }
  async GetContractList(
    CustomerCode: string,
    ProjectCode: string,
    OrderNumber: number,
    OrderSource: string,
    StructureElement: string,
    ProdType: string,
    ProdTypeL2: string,
    ScheduledProd: string
  ) {
    // debugger;
    // let CustomerCode = ""
    // let ProjectCode = ""
    // let ProdType = ""
    // let ProdTypeL2 = ""
    // let OrderNumber = 0
    // let StructureElement = ""
    this.orderService
      .getContractList(
        CustomerCode,
        ProjectCode,
        ProdType,
        ProdTypeL2,
        OrderNumber,
        StructureElement
      )
      .subscribe({
        next: async (response) => {
          console.log('contractList response', response);
          if (response.length == 0) {
            response = [''];
          }
          this.ContractListDDL = response;
          this.ProcessOrderForm.controls['Contract'].patchValue(
            this.ContractListDDL[0]
          );
          //SET CONTRACT DROPDOWN COLOR
          let lContract = this.ProcessOrderForm.controls.Contract.value.substr(
            0,
            10
          );
          const responseCheckContract = await this.CheckContractSubmit(
            lContract
          );
          this.GetGreenSteelValue(lContract);
          if (responseCheckContract) {
            if (responseCheckContract.noexpired == true) {
              this.contractterm = true;
            } else {
              this.contractterm = false;
            }
          }
          this.CheckContract(
            this.ProcessOrderForm.controls.Contract.value.substr(0, 10)
          );

          this.showInvoiceRemarks =
            this.ContractListDDL[0].substr(0, 10) == 'SPOT ORDER'
              ? true
              : false;

          // this.GetShipToParty(
          //   this.selectedRow[0].ProjectCode,
          //   this.ProcessOrderForm.controls['Contract'].value
          // );

          // date-10/11/2025
          // reset buttons after the API calls
          this.setButtonDisplay(this.selectedRow[0].OrderStatus);

          this.GetOrderDetailsTable(
            CustomerCode,
            ProjectCode,
            OrderNumber,
            OrderSource,
            StructureElement,
            ProdType,
            ProdTypeL2,
            ScheduledProd
          );
        },
        error: (e) => {},
        complete: () => {},
      });
  }
  // GetAllContractNos(): void {
  //   debugger;
  //   this.orderService.getAllContractNos().subscribe({
  //     next: (response) => {
  //       console.log('contract', response);
  //       this.VehicleTypeList = response;
  //       //this.ProcessOrderLoading = false;
  //     },
  //     error: (e) => { },
  //     complete: () => { },
  //   });
  // }

  // GetShipToParty(ProjectCode: string, ContractNo: string): void {
  //   // debugger;
  //   ContractNo = ContractNo.split(' ')[0];
  //   this.orderService.getShipToParty(ProjectCode, ContractNo).subscribe({
  //     next: (response) => {
  //       console.log('ShipPartyList', response);
  //       this.ShipPartyList = response;
  //       for (let i = 0; i < this.ShipPartyList.length; i++) {
  //         if (
  //           this.ShipPartyList[i].substr(
  //             this.ShipPartyList[i].length - 7,
  //             6
  //           ) == this.selectedRow[0].ProjectCode
  //         ) {
  //           this.ProcessOrderForm.controls['ShipTo'].patchValue(
  //             this.ShipPartyList[i]
  //           );
  //         }
  //       }
  //       this.ProcessOrderForm.controls['ShipTo'].disable();
  //       //this.ProcessOrderLoading = false;
  //     },
  //     error: (e) => {},
  //     complete: () => {},
  //   });
  // }

  getFormattedDate(date: any) {
    if (date == null) {
      return '';
    }
    return new Date(date).toLocaleString().split(',')[0] == 'Invalid Date'
      ? ''
      : this.datePipe.transform(date, 'yyyy-MM-dd', 'UTC+8');
  }

  FilterIncomingTableData() {
    console.log(this.IncomingData);

    this.IncomingData = JSON.parse(JSON.stringify(this.BackupIncomingData));

    this.IncomingData = this.IncomingData.filter(
      (item) =>
        this.checkFilterData(
          this.IncomingTableSearch.controls['OrderNo'].value,
          item.JobIDDis
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['CustomerStatus'].value,
          item.OrderStatus
        ) &&
        (this.checkFilterData(
          this.IncomingTableSearch.controls['Customer'].value,
          item.CustomerName
        ) ||
          this.checkFilterData(
            this.IncomingTableSearch.controls['Customer'].value,
            item.CustomerCode
          )) &&
        (this.checkFilterData(
          this.IncomingTableSearch.controls['Project'].value,
          item.ProjectTitle
        ) ||
          this.checkFilterData(
            this.IncomingTableSearch.controls['Project'].value,
            item.ProjectCode
          )) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['StructureElement'].value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['StructureElement'].value,
          item.StructureElementDis
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['ProductType'].value,
          item.ProdTypeDis
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['TotalWT'].value,
          item.TotalWeight
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['Transport'].value,
          item.TransportMode
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['SORNo'].value,
          item.SORNoDis
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['SORNo'].value,
          item.SORNoDis
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['DetailingIncharge'].value,
          item.DetailingIncharge
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['ProcessDate'].value,
          item.ProcessDate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['WBS1'].value,
          item.WBS1
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['WBS2'].value,
          item.WBS2
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['WBS3'].value,
          item.WBS3
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['PONo'].value,
          item.PONumber
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['BBSNo'].value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['PODate'].value,
          item.PODate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['RequiredDate'].value?.replaceAll(),
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['RequiredDate'].value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['RevisedReqDate'].value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['ForecastDate'].value,
          item.ForecastDate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['LowerFloorDeliveryDate'].value,
          item.LastDeliveryDate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['DifferentDays'].value,
          item.DiffDays
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['ConfirmedDelDate'].value,
          item.ConfirmedDelDate
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['SONo'].value,
          item.SORNoDis
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['PMRemarks'].value,
          item.PMDRemarks
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['TechRemarks'].value,
          item.TECHRemarks
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['AttachedNo'].value,
          item.AttachedNo
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['DataEnteredBy'].value,
          item.DataEntryBy
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['SubmittedBy'].value,
          item.UpdateBy
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['ProjectIncharge'].value,
          item.ProjectIncharge
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['Address'].value,
          item.Address
        ) &&
        this.checkFilterData(
          this.IncomingTableSearch.controls['Gate'].value,
          item.Gate
        )
    );

    // OrderNo
    // CustomerStatus
    // Customer
    // Project
    this.IncomingData = this.UpdateSelectedRecords(this.IncomingData);
    this.SetFilteredWeight(this.IncomingData);
  }
  FilterPendingEntTableData() {
    this.PendingENT = JSON.parse(JSON.stringify(this.PendingENTBackUp));

    this.PendingENT = this.PendingENT.filter(
      (item) =>
        this.checkFilterData(
          this.PendingEntTableSearch.controls['OrderNo'].value,
          item.JobIDDis
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['CustomerStatus'].value,
          item.OrderStatus
        ) &&
        (this.checkFilterData(
          this.PendingEntTableSearch.controls['Customer'].value,
          item.CustomerName
        ) ||
          this.checkFilterData(
            this.PendingEntTableSearch.controls['Customer'].value,
            item.CustomerCode
          )) &&
        (this.checkFilterData(
          this.PendingEntTableSearch.controls['Project'].value,
          item.ProjectTitle
        ) ||
          this.checkFilterData(
            this.PendingEntTableSearch.controls['Project'].value,
            item.ProjectCode
          )) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['StructureElement'].value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['ProductType'].value,
          item.ProdTypeDis
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['WBS1'].value,
          item.WBS1
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['WBS2'].value,
          item.WBS2
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['WBS3'].value,
          item.WBS3
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['PONo'].value,
          item.PONumber
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['BBSNo'].value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['PODate'].value,
          item.PODate
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['RequiredDate'].value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls[
            'RequiredDate'
          ].value?.replaceAll(),
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['RevisedReqDate'].value,
          item.OrigReqDate
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['ForecastDate'].value,
          item.ForecastDate
        ) &&
        // item.LastDeliveryDate!.toString()
        //   .toLowerCase()
        //   .includes(
        //     this.PendingEntTableSearch.controls['LowerFloorDeliveryDate'].value
        //       .toString()
        //       .toLowerCase()
        //       .trim()
        //   ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['DifferentDays'].value,
          item.DiffDays
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['ConfirmedDelDate'].value,
          item.PlanDelDate
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['TotalWT'].value,
          item.TotalWeight
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['Transport'].value,
          item.TransportMode
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['SORNo'].value,
          item.SORNo
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['SONo'].value,
          item.SAPSONo
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['PMRemarks'].value,
          item.PMDRemarks
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['TechRemarks'].value,
          item.TECHRemarks
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['AttachedNo'].value,
          item.AttachedNo
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['DataEnteredBy'].value,
          item.DataEntryBy
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['SubmittedBy'].value,
          item.UpdateBy
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['ProjectIncharge'].value,
          item.ProjectIncharge
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['DetailingIncharge'].value,
          item.DetailingIncharge
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['ProcessDate'].value,
          item.ProcessDate
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['Address'].value,
          item.Address
        ) &&
        this.checkFilterData(
          this.PendingEntTableSearch.controls['Gate'].value,
          item.Gate
        )

      // LINKTO NOT FOUND
      // item.ProcessDate!.toString().toLowerCase().includes(
      //   this.PendingEntTableSearch.controls['LinkTo'].value
      //     .toString().toLowerCase()
      //     .trim()
      // )
    );
    // OrderNo
    // CustomerStatus
    // Customer
    // Project
    this.PendingENT = this.UpdateSelectedRecords(this.PendingENT);
    this.SetFilteredWeight(this.PendingENT);
  }

  FilterAllTableData() {
    this.AllData = JSON.parse(JSON.stringify(this.AllDataBackup));
    this.AllData = this.AllData.filter(
      (item) =>
        this.checkFilterData(
          this.AllTableSearch.controls.SOrderNo.value,
          item.JobID
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.SORNo.value,
          item.SORNo
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.SONo.value,
          item.SAPSONo
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.CustomerStatus.value,
          item.OrderStatus
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.SAPRejectStatus.value,
          item.SO_REJECT_STATUS
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.StructureElement.value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ProductType.value,
          item.ProdTypeDis
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.PONo.value,
          item.PONumber
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.BBSNo.value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.BBSDescription.value,
          item.BBSDesc
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.PODate.value,
          item.PODate
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.RequiredDate.value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.RevisedReqDate.value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.DifferentDays.value,
          item.DiffDays
        ) &&
        //item.ForecastDate!.toString().toLowerCase().includes(this.AllTableSearch.controls.ForecastDate.value.toString().toLowerCase().trim()) &&
        //item.LastDeliveryDate!.toString().toLowerCase().includes(this.AllTableSearch.controls.LowerFloorDeliveryDate.value.toString().toLowerCase().trim()) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ConfirmedDelDate.value,
          item.PlanDelDate
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.TotalWT.value,
          item.TotalWeight
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.TotalMT.value,
          item.Total_MT_SAPY
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.PMRemarks.value,
          item.PMDRemarks
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.TechRemarks.value,
          item.TECHRemarks
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ProcessedBy.value,
          item.UserID
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.Customer.value,
          item.CustomerName
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.Customer.value,
          item.CustomerCode
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.Project.value,
          item.ProjectTitle
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.Project.value,
          item.ProjectCode
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.WBS1.value,
          item.WBS1
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.WBS2.value,
          item.WBS2
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.WBS3.value,
          item.WBS3
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.SubmittedBy.value,
          item.UpdateBy
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ProjectIncharge.value,
          item.ProjectIncharge
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.DetailingIncharge.value,
          item.DetailingIncharge
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.PPContract.value,
          item.PPContract
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.OrderType.value,
          item.OrderType
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ContractNumber.value,
          item.ContractNo
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.SORStatus.value,
          item.SORStatus
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.CreditBlockStatus.value,
          item.CreditStatus
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ErrorLog.value,
          item.ERROR_CD
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.InternalRemark.value,
          item.Int_Remark
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ExternalRemark.value,
          item.Ext_Remark
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.LoadNumber.value,
          item.LoadNo
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.DeliveryStatus.value,
          item.DeliveryStatus
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.DONo.value,
          item.DeliveryNo
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.WTNo.value,
          item.Wt_No
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.WTDate.value,
          item.Wt_Date
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.DeliveredPieces.value,
          item.DeliveredPcs
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.BalancePieces.value,
          item.BalancePCS
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.UrgentOrder.value,
          item.URG_ORD_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ZeroTolerance.value,
          item.ZERO_TOLERANCE_I
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.CallBefDel.value,
          item.CALL_BEF_DEL_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.SpecialPass.value,
          item.SPECIAL_PASS_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.LorryCrane.value,
          item.LORRY_CRANE_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.PremiumService.value,
          item.PRM_SVC_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.CraneBook.value,
          item.CRN_BKD_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.BargeBook.value,
          item.BRG_BKD_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.PoliceEscort.value,
          item.POL_ESC_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ONHOLD.value,
          item.ON_HOLD_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.CONQUAS.value,
          item.CONQUAS_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.LowBedAllowed.value,
          item.LOW_BED_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.FiftyTonAllowed.value,
          item.T50_VEH_IND
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.Transport.value,
          item.TransportLimit
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.SubSegment.value,
          item.SubSegment
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.NDSStatus.value,
          item.NDSStatus
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ReleasedBy.value,
          item.DetailerName
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ReleasedDate.value,
          item.NDSReleaseTime
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.RuningNo.value,
          item.RunNo
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.LeadTime.value,
          item.Cust_Lead_Time
        ) &&
        this.checkFilterData(
          this.AllTableSearch.controls.ProcessDate.value,
          item.ProcessDate
        ) &&
        //item.AccManager!.toString().toLowerCase().includes(this.AllTableSearch.controls.AccountManager.value.toString().toLowerCase().trim()) &&
        this.checkFilterData(
          this.AllTableSearch.controls.Documents.value,
          item.AttachedNo
        )&&
        this.checkFilterData(
          this.AllTableSearch.controls.Address.value,
          item.Address
        )&&
        this.checkFilterData(
          this.AllTableSearch.controls.Gate.value,
          item.Gate
        )
    );
    this.SetFilteredWeight(this.AllData);
  }
  FilterSearchTableData() {
    this.SearchResultData = JSON.parse(
      JSON.stringify(this.SearchResultDataBackup)
    );
    this.SearchResultData = this.SearchResultData.filter(
      (item) =>
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SOrderNo.value,
          item.JobID
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SORNo.value,
          item.SORNo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SONo.value,
          item.SAPSONo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.CustomerStatus.value,
          item.OrderStatus
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SAPRejectStatus.value,
          item.SO_REJECT_STATUS
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.StructureElement.value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.StructureElement.value,
          item.StructureElementDis
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ProductType.value,
          item.ProdTypeDis
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.PONo.value,
          item.PONumber
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.BBSNo.value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.BBSDescription.value,
          item.BBSDesc
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.PODate.value,
          item.PODate
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.RequiredDate.value,
          item.OrigReqDate
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.RevisedReqDate.value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ForecastDate.value,
          item.ForecastDate
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.LowerFloorDeliveryDate.value,
          item.LastDeliveryDate
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.DifferentDays.value,
          item.DiffDays
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ConfirmedDelDate.value,
          item.PlanDelDate
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.TotalWT.value,
          item.TotalWeight
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.TotalMT.value,
          item.Total_MT_SAPY
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.PMRemarks.value,
          item.PMDRemarks
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.TechRemarks.value,
          item.TECHRemarks
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ProcessedBy.value,
          item.UserID
        ) &&
        (this.checkFilterData(
          this.SearchResultTableSearch.controls.Customer.value,
          item.CustomerName
        ) ||
          this.checkFilterData(
            this.SearchResultTableSearch.controls.Customer.value,
            item.CustomerCode
          )) &&
        (this.checkFilterData(
          this.SearchResultTableSearch.controls.Project.value,
          item.ProjectTitle
        ) ||
          this.checkFilterData(
            this.SearchResultTableSearch.controls.Project.value,
            item.ProjectCode
          )) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.WBS1.value,
          item.WBS1
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.WBS2.value,
          item.WBS2
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.WBS3.value,
          item.WBS3
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SubmittedBy.value,
          item.UpdateBy
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ProjectIncharge.value,
          item.ProjectIncharge
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.DetailingIncharge.value,
          item.DetailingIncharge
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.PPContract.value,
          item.PPContract
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.OrderType.value,
          item.OrderType
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ContractNumber.value,
          item.ContractNo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SORStatus.value,
          item.SORStatus
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.CreditBlockStatus.value,
          item.CreditStatus
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ErrorLog.value,
          item.ERROR_CD
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.InternalRemark.value,
          item.Int_Remark
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ExternalRemark.value,
          item.Ext_Remark
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.LoadNumber.value,
          item.LoadNo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.DeliveryStatus.value,
          item.DeliveryStatus
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.DONo.value,
          item.DeliveryNo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.WTNo.value,
          item.Wt_No
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.WTDate.value,
          item.Wt_Date
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.DeliveredPieces.value,
          item.DeliveredPcs
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.BalancePieces.value,
          item.BalancePCS
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.UrgentOrder.value,
          item.URG_ORD_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ZeroTolerance.value,
          item.ZERO_TOLERANCE_I
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.CallBefDel.value,
          item.CALL_BEF_DEL_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SpecialPass.value,
          item.SPECIAL_PASS_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.LorryCrane.value,
          item.LORRY_CRANE_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.PremiumService.value,
          item.PRM_SVC_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.CraneBook.value,
          item.CRN_BKD_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.BargeBook.value,
          item.BRG_BKD_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.PoliceEscort.value,
          item.POL_ESC_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ONHOLD.value,
          item.ON_HOLD_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.CONQUAS.value,
          item.CONQUAS_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.LowBedAllowed.value,
          item.LOW_BED_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.FiftyTonAllowed.value,
          item.T50_VEH_IND
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.Transport.value,
          item.TransportLimit
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.SubSegment.value,
          item.SubSegment
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.NDSStatus.value,
          item.NDSStatus
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ReleasedBy.value,
          item.DetailerName
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ReleasedDate.value,
          item.NDSReleaseTime
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.RuningNo.value,
          item.RunNo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.LeadTime.value,
          item.Cust_Lead_Time
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.ProcessDate.value,
          item.ProcessDate
        ) &&
        //item.AccManager!.toString().toLowerCase().includes(this.SearchResultTableSearch.controls.AccountManager.value.toString().toLowerCase().trim()) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.Documents.value,
          item.AttachedNo
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.AccountManager.value,
          item.AccManager
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.Address.value,
          item.Address
        ) &&
        this.checkFilterData(
          this.SearchResultTableSearch.controls.Gate.value,
          item.Gate
        )
    );

    this.SetFilteredWeight(this.SearchResultData);
  }
  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue && ctlValue.toString().trim() !== '') {
      if (ctlValue.toString().includes(',')) {
        let value = ctlValue.toString().toLowerCase().trim().split(',');
        return value.some(
          (char: string) =>
            char.trim() !== '' && // Ignore blank values within the split array
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
    // return(
    //   ctlValue.toString().includes(',')
    // //   ?
    //     ctlValue
    //     .toString()
    //     .toLowerCase()
    //     .trim()
    //     .includes(
    //       item
    //         .toString()
    //         .toLowerCase()
    //     )
    //   :
    //   item
    //     .toString()
    //     .toLowerCase()
    //     .includes(
    //       ctlValue
    //         .toString()
    //         .toLowerCase()
    //         .trim()
    //     )
    // )
  }
  FilterProcessingTableData() {
    debugger;

    // Reference the immutable backup data directly
    this.ProcessingData = this.ProcessBackup;

    // Extract search control values only once
    const searchControls = this.ProcessingTableSearch.controls;
    const searchValues = {
      SOrderNo: searchControls.SOrderNo.value,
      SORNo: searchControls.SORNo.value,
      SONo: searchControls.SONo.value,
      CustomerStatus: searchControls.CustomerStatus.value,
      SAPRejectStatus: searchControls.SAPRejectStatus.value,
      StructureElement: searchControls.StructureElement.value,
      ProductType: searchControls.ProductType.value,
      PONo: searchControls.PONo.value,
      BBSNo: searchControls.BBSNo.value,
      BBSDescription: searchControls.BBSDescription.value,
      PODate: searchControls.PODate.value,
      RequiredDate: searchControls.RequiredDate.value,
      RevisedReqDate: searchControls.RevisedReqDate.value,
      DifferentDays: searchControls.DifferentDays.value,
      ConfirmedDelDate: searchControls.ConfirmedDelDate.value,
      TotalWT: searchControls.TotalWT.value,
      TotalMT: searchControls.TotalMT.value,
      PMRemarks: searchControls.PMRemarks.value,
      TechRemarks: searchControls.TechRemarks.value,
      ProcessedBy: searchControls.ProcessedBy.value,
      Customer: searchControls.Customer.value,
      Project: searchControls.Project.value,
      WBS1: searchControls.WBS1.value,
      WBS2: searchControls.WBS2.value,
      WBS3: searchControls.WBS3.value,
      SubmittedBy: searchControls.SubmittedBy.value,
      ProjectIncharge: searchControls.ProjectIncharge.value,
      DetailingIncharge: searchControls.DetailingIncharge.value,
      PPContract: searchControls.PPContract.value,
      OrderType: searchControls.OrderType.value,
      ContractNumber: searchControls.ContractNumber.value,
      SORStatus: searchControls.SORStatus.value,
      CreditBlockStatus: searchControls.CreditBlockStatus.value,
      ErrorLog: searchControls.ErrorLog.value,
      InternalRemark: searchControls.InternalRemark.value,
      ExternalRemark: searchControls.ExternalRemark.value,
      LoadNumber: searchControls.LoadNumber.value,
      DeliveryStatus: searchControls.DeliveryStatus.value,
      DONo: searchControls.DONo.value,
      WTNo: searchControls.WTNo.value,
      WTDate: searchControls.WTDate.value,
      DeliveredPieces: searchControls.DeliveredPieces.value,
      BalancePieces: searchControls.BalancePieces.value,
      UrgentOrder: searchControls.UrgentOrder.value,
      ZeroTolerance: searchControls.ZeroTolerance.value,
      CallBefDel: searchControls.CallBefDel.value,
      SpecialPass: searchControls.SpecialPass.value,
      LorryCrane: searchControls.LorryCrane.value,
      PremiumService: searchControls.PremiumService.value,
      CraneBook: searchControls.CraneBook.value,
      BargeBook: searchControls.BargeBook.value,
      PoliceEscort: searchControls.PoliceEscort.value,
      ONHOLD: searchControls.ONHOLD.value,
      CONQUAS: searchControls.CONQUAS.value,
      LowBedAllowed: searchControls.LowBedAllowed.value,
      FiftyTonAllowed: searchControls.FiftyTonAllowed.value,
      Transport: searchControls.Transport.value,
      SubSegment: searchControls.SubSegment.value,
      NDSStatus: searchControls.NDSStatus.value,
      ReleasedBy: searchControls.ReleasedBy.value,
      ReleasedDate: searchControls.ReleasedDate.value,
      RuningNo: searchControls.RuningNo.value,
      LeadTime: searchControls.LeadTime.value,
      ProcessDate: searchControls.ProcessDate.value,
      Documents: searchControls.Documents.value,
      Address: searchControls.Address.value,
      Gate: searchControls.Gate.value,
    };

    // Reference to checkFilterData function
    const check = this.checkFilterData;

    // Filter the data using precomputed search values and short-circuiting
    this.ProcessingData = this.ProcessingData.filter((item) => {
      return (
        check(searchValues.SOrderNo, item.JobID) &&
        check(searchValues.SORNo, item.SORNo) &&
        check(searchValues.SORNo, item.SORNoDis) &&
        check(searchValues.SONo, item.SAPSONo) &&
        check(searchValues.CustomerStatus, item.OrderStatus) &&
        check(searchValues.SAPRejectStatus, item.SO_REJECT_STATUS) &&
        check(searchValues.StructureElement, item.StructureElement) &&
        check(searchValues.StructureElement, item.StructureElementDis) &&
        check(searchValues.ProductType, item.ProdTypeDis) &&
        check(searchValues.PONo, item.PONumber) &&
        check(searchValues.BBSNo, item.BBSNo) &&
        check(searchValues.BBSDescription, item.BBSDesc) &&
        check(searchValues.PODate, item.PODate) &&
        check(searchValues.RequiredDate, item.RequiredDate) &&
        check(searchValues.RevisedReqDate, item.RequiredDate) &&
        check(searchValues.DifferentDays, item.DiffDays) &&
        check(searchValues.ConfirmedDelDate, item.PlanDelDate) &&
        check(searchValues.TotalWT, item.TotalWeight) &&
        check(searchValues.TotalMT, item.Total_MT_SAPY) &&
        check(searchValues.PMRemarks, item.PMDRemarks) &&
        check(searchValues.TechRemarks, item.TECHRemarks) &&
        check(searchValues.ProcessedBy, item.UserID) &&
        (check(searchValues.Customer, item.CustomerName) ||
          check(searchValues.Customer, item.CustomerCode)) &&
        (check(searchValues.Project, item.ProjectTitle) ||
          check(searchValues.Project, item.ProjectCode)) &&
        check(searchValues.WBS1, item.WBS1) &&
        check(searchValues.WBS2, item.WBS2) &&
        check(searchValues.WBS3, item.WBS3) &&
        check(searchValues.SubmittedBy, item.UpdateBy) &&
        check(searchValues.ProjectIncharge, item.ProjectIncharge) &&
        check(searchValues.DetailingIncharge, item.DetailingIncharge) &&
        check(searchValues.PPContract, item.PPContract) &&
        check(searchValues.OrderType, item.OrderType) &&
        check(searchValues.ContractNumber, item.ContractNo) &&
        check(searchValues.SORStatus, item.SORStatus) &&
        check(searchValues.CreditBlockStatus, item.CreditStatus) &&
        check(searchValues.ErrorLog, item.ERROR_CD) &&
        check(searchValues.InternalRemark, item.Int_Remark) &&
        check(searchValues.ExternalRemark, item.Ext_Remark) &&
        check(searchValues.LoadNumber, item.LoadNo) &&
        check(searchValues.DeliveryStatus, item.DeliveryStatus) &&
        check(searchValues.DONo, item.DeliveryNo) &&
        check(searchValues.WTNo, item.Wt_No) &&
        check(searchValues.WTDate, item.Wt_Date) &&
        check(searchValues.DeliveredPieces, item.DeliveredPcs) &&
        check(searchValues.BalancePieces, item.BalancePCS) &&
        check(searchValues.UrgentOrder, item.URG_ORD_IND) &&
        check(searchValues.ZeroTolerance, item.ZERO_TOLERANCE_I) &&
        check(searchValues.CallBefDel, item.CALL_BEF_DEL_IND) &&
        check(searchValues.SpecialPass, item.SPECIAL_PASS_IND) &&
        check(searchValues.LorryCrane, item.LORRY_CRANE_IND) &&
        check(searchValues.PremiumService, item.PRM_SVC_IND) &&
        check(searchValues.CraneBook, item.CRN_BKD_IND) &&
        check(searchValues.BargeBook, item.BRG_BKD_IND) &&
        check(searchValues.PoliceEscort, item.POL_ESC_IND) &&
        check(searchValues.ONHOLD, item.ON_HOLD_IND) &&
        check(searchValues.CONQUAS, item.CONQUAS_IND) &&
        check(searchValues.LowBedAllowed, item.LOW_BED_IND) &&
        check(searchValues.FiftyTonAllowed, item.T50_VEH_IND) &&
        check(searchValues.Transport, item.TransportLimit) &&
        check(searchValues.SubSegment, item.SubSegment) &&
        check(searchValues.NDSStatus, item.NDSStatus) &&
        check(searchValues.ReleasedBy, item.DetailerName) &&
        check(searchValues.ReleasedDate, item.NDSReleaseTime) &&
        check(searchValues.RuningNo, item.RunNo) &&
        check(searchValues.LeadTime, item.Cust_Lead_Time) &&
        check(searchValues.ProcessDate, item.ProcessDate) &&
        check(searchValues.Address, item.Address) &&
        check(searchValues.Gate, item.Gate) &&
        check(searchValues.Documents, item.AttachedNo)
      );
    });

    // Update selected records
    this.ProcessingData = this.UpdateSelectedRecords(this.ProcessingData);
    this.SetFilteredWeight(this.ProcessingData);
  }

  removeEmptyValues(obj: any) {
    for (const key in obj) {
      if (obj[key] === '') {
        delete obj[key];
      }
    }
    return obj;
  }
  // async filterItems(items: any, criteria: any) {
  //   return items.filter((item: any) => {
  //     let returnValue = true;
  //     for (const key in criteria) {
  //       if (criteria[key].toString().includes(',')) {
  //         let value = criteria[key].toString().toLowerCase().trim().split(',');
  //         returnValue =
  //           returnValue &&
  //           value.some((char: string) =>
  //             item[key].toString().toLowerCase().includes(char)
  //           );
  //       } else {
  //         returnValue =
  //           returnValue &&
  //           item[key]
  //             .toString()
  //             .toLowerCase() == criteria[key].toString().toLowerCase().trim();
  //       }
  //     }
  //     return returnValue;
  //     // Object.keys(criteria).every(key => this.checkFilterData(criteria[key],item[key]))
  //   });
  // }
  async filterItems(items: any, criteria: any) {
    const criteriaKeys = Object.keys(criteria);
    const lowercasedCriteria = criteriaKeys.reduce((acc, key) => {
      acc[key] = criteria[key].toString().toLowerCase();
      return acc;
    }, {} as any);

    const chunkSize = 1000;
    let results: any[] = [];

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const filteredChunk = chunk.filter((item: any) => {
        return criteriaKeys.every((key) => {
          const itemValue = item[key].toString().toLowerCase();
          const criteriaValue = lowercasedCriteria[key];

          if (criteriaValue.includes(',')) {
            const values = criteriaValue
              .split(',')
              .map((value: any) => value.trim());
            return values.some((value: any) => itemValue.includes(value));
          } else {
            return itemValue === criteriaValue.trim();
          }
        });
      });
      results = results.concat(filteredChunk);
      await new Promise((resolve) => setTimeout(resolve, 0)); // Yield control back to the main thread
    }

    return results;
  }

  // removeEmptyValues(obj: any) {
  //   for (const key in obj) {
  //     if (obj[key] === '') {
  //       delete obj[key];
  //     }
  //   }
  //   return obj;
  // }
  // async filterItems(items: any, criteria: any) {
  //   return items.filter((item: any) => {
  //     let returnValue = true;
  //     for (const key in criteria) {
  //       if (criteria[key].toString().includes(',')) {
  //         let value = criteria[key].toString().toLowerCase().trim().split(',');
  //         returnValue =
  //           returnValue &&
  //           value.some((char: string) =>
  //             item[key].toString().toLowerCase().includes(char)
  //           );
  //       } else {
  //         returnValue =
  //           returnValue &&
  //           item[key]
  //             .toString()
  //             .toLowerCase() == criteria[key].toString().toLowerCase().trim();
  //       }
  //     }
  //     return returnValue;
  //     // Object.keys(criteria).every(key => this.checkFilterData(criteria[key],item[key]))
  //   });
  // }

  FilterCancelledTableData() {
    // this.PendingENT = JSON.parse(JSON.stringify(this.PendingENTBackUp));
    this.CancelData = JSON.parse(JSON.stringify(this.CancelBackup));

    this.CancelData = this.CancelData.filter(
      (item) =>
        this.checkFilterData(
          this.CancelledTableSearch.controls['OrderNo'].value,
          item.JobIDDis
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['CustomerStatus'].value,
          item.OrderStatus
        ) &&
        (this.checkFilterData(
          this.CancelledTableSearch.controls['Customer'].value,
          item.CustomerName
        ) ||
          this.checkFilterData(
            this.CancelledTableSearch.controls['Customer'].value,
            item.CustomerCode
          )) &&
        (this.checkFilterData(
          this.CancelledTableSearch.controls['Project'].value,
          item.ProjectTitle
        ) ||
          this.checkFilterData(
            this.CancelledTableSearch.controls['Project'].value,
            item.ProjectCode
          )) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['StructureElement'].value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['ProductType'].value,
          item.ProdTypeDis
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['WBS1'].value,
          item.WBS1
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['WBS2'].value,
          item.WBS2
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['WBS3'].value,
          item.WBS3
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['PONo'].value,
          item.PONumber
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['BBSNo'].value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['PODate'].value,
          item.PODate
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['RequiredDate'].value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls[
            'RequiredDate'
          ].value?.replaceAll(),
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['RevisedReqDate'].value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['ForecastDate'].value,
          item.ForecastDate
        ) &&
        // item.LastDeliveryDate!.toString()
        //   .toLowerCase()
        //   .includes(
        //     this.CancelledTableSearch.controls['LowerFloorDeliveryDate'].value
        //       .toString()
        //       .toLowerCase()
        //       .trim()
        //   ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['DifferentDays'].value,
          item.DiffDays
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['ConfirmedDelDate'].value,
          item.PlanDelDate
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['TotalWT'].value,
          item.TotalWeight
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['Transport'].value,
          item.TransportMode
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['SORNo'].value,
          item.SORNo
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['SONo'].value,
          item.SAPSONo
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['PMRemarks'].value,
          item.PMDRemarks
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['TechRemarks'].value,
          item.TECHRemarks
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['AttachedNo'].value,
          item.AttachedNo
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['DataEnteredBy'].value,
          item.DataEntryBy
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['SubmittedBy'].value,
          item.UpdateBy
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['ProjectIncharge'].value,
          item.ProjectIncharge
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['DetailingIncharge'].value,
          item.DetailingIncharge
        ) &&
        this.checkFilterData(
          this.CancelledTableSearch.controls['ProcessDate'].value,
          item.ProcessDate
        )&&
        this.checkFilterData(
          this.CancelledTableSearch.controls['Address'].value,
          item.Address
        )&&
        this.checkFilterData(
          this.CancelledTableSearch.controls['Gate'].value,
          item.Gate
        )
    );
    // OrderNo
    // CustomerStatus
    // Customer
    // Project

    this.CancelData = this.UpdateSelectedRecords(this.CancelData);
    this.SetFilteredWeight(this.CancelData);
  }
  FilterPendingDetTableData() {
    console.log('');
    // If the backup data is immutable, move this outside the function to avoid repeated deep copies
    this.PendingDET = JSON.parse(JSON.stringify(this.PendingDETBackup));

    // Extract form control values to avoid repeated lookups
    const searchControls = this.PendingDETTableSearch.controls;
    const searchValues = {
      OrderNo: searchControls['OrderNo'].value,
      CustomerStatus: searchControls['CustomerStatus'].value,
      Customer: searchControls['Customer'].value,
      Project: searchControls['Project'].value,
      StructureElement: searchControls['StructureElement'].value,
      ProductType: searchControls['ProductType'].value,
      WBS1: searchControls['WBS1'].value,
      WBS2: searchControls['WBS2'].value,
      WBS3: searchControls['WBS3'].value,
      PONo: searchControls['PONo'].value,
      BBSNo: searchControls['BBSNo'].value,
      PODate: searchControls['PODate'].value,
      RequiredDate: searchControls['RequiredDate'].value,
      RevisedReqDate: searchControls['RevisedReqDate'].value,
      ForecastDate: searchControls['ForecastDate'].value,
      DifferentDays: searchControls['DifferentDays'].value,
      ConfirmedDelDate: searchControls['ConfirmedDelDate'].value,
      TotalWT: searchControls['TotalWT'].value,
      Transport: searchControls['Transport'].value,
      SORNo: searchControls['SORNo'].value,
      SONo: searchControls['SONo'].value,
      PMRemarks: searchControls['PMRemarks'].value,
      TechRemarks: searchControls['TechRemarks'].value,
      AttachedNo: searchControls['AttachedNo'].value,
      DataEnteredBy: searchControls['DataEnteredBy'].value,
      SubmittedBy: searchControls['SubmittedBy'].value,
      ProjectIncharge: searchControls['ProjectIncharge'].value,
      DetailingIncharge: searchControls['DetailingIncharge'].value,
      ProcessDate: searchControls['ProcessDate'].value,
      Address: searchControls['Address'].value,
      Gate: searchControls['Gate'].value,
    };

    // Simplified filter logic using short-circuit evaluation
    this.PendingDET = this.PendingDET.filter((item) => {
      return (
        this.checkFilterData(searchValues.OrderNo, item.JobIDDis) &&
        this.checkFilterData(searchValues.CustomerStatus, item.OrderStatus) &&
        (this.checkFilterData(searchValues.Customer, item.CustomerName) ||
          this.checkFilterData(searchValues.Customer, item.CustomerCode)) &&
        (this.checkFilterData(searchValues.Project, item.ProjectTitle) ||
          this.checkFilterData(searchValues.Project, item.ProjectCode)) &&
        this.checkFilterData(
          searchValues.StructureElement,
          item.StructureElement
        ) &&
        this.checkFilterData(searchValues.ProductType, item.ProdTypeDis) &&
        this.checkFilterData(searchValues.WBS1, item.WBS1) &&
        this.checkFilterData(searchValues.WBS2, item.WBS2) &&
        this.checkFilterData(searchValues.WBS3, item.WBS3) &&
        this.checkFilterData(searchValues.PONo, item.PONumber) &&
        this.checkFilterData(searchValues.BBSNo, item.BBSNo) &&
        this.checkFilterData(searchValues.PODate, item.PODate) &&
        this.checkFilterData(searchValues.RequiredDate, item.RequiredDate) &&
        this.checkFilterData(searchValues.RevisedReqDate, item.RequiredDate) &&
        this.checkFilterData(searchValues.ForecastDate, item.ForecastDate) &&
        this.checkFilterData(searchValues.DifferentDays, item.DiffDays) &&
        this.checkFilterData(searchValues.ConfirmedDelDate, item.PlanDelDate) &&
        this.checkFilterData(searchValues.TotalWT, item.TotalWeight) &&
        this.checkFilterData(searchValues.Transport, item.TransportMode) &&
        this.checkFilterData(searchValues.SORNo, item.SORNo) &&
        this.checkFilterData(searchValues.SONo, item.SAPSONo) &&
        this.checkFilterData(searchValues.PMRemarks, item.PMDRemarks) &&
        this.checkFilterData(searchValues.TechRemarks, item.TECHRemarks) &&
        this.checkFilterData(searchValues.AttachedNo, item.AttachedNo) &&
        this.checkFilterData(searchValues.DataEnteredBy, item.DataEntryBy) &&
        this.checkFilterData(searchValues.SubmittedBy, item.UpdateBy) &&
        this.checkFilterData(
          searchValues.ProjectIncharge,
          item.ProjectIncharge
        ) &&
        this.checkFilterData(
          searchValues.DetailingIncharge,
          item.DetailingIncharge
        ) &&
        this.checkFilterData(searchValues.ProcessDate, item.ProcessDate) &&
        this.checkFilterData(
          searchValues.Address,
          item.Address
        ) &&
        this.checkFilterData(
          searchValues.Gate,
          item.Gate
        )
      );
    });

    // Update selected records
    this.PendingDET = this.UpdateSelectedRecords(this.PendingDET);
    this.SetFilteredWeight(this.PendingDET);
  }
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }
  reset() {
    this.IncomingTableSearch.reset();
    this.PendingEntTableSearch.reset();
    this.PendingDETTableSearch.reset();
    this.CancelledTableSearch.reset();
    this.AllTableSearch.reset();
    this.ProcessingTableSearch.reset();
    this.SearchResultTableSearch.reset();
  }
  Update(item: string) {
    if (this.selectedRow.length == 0) {
      alert('Select an Order!');
      this.ProcessOrderLoading = false;
      return;
    }

    if (item.toLowerCase() == 'management') {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(
        UpdateProjectManagementComponent,
        ngbModalOptions
      );
      // modalRef.componentInstance.OrderNumber = this.selectedRow[0].JobID;
      // modalRef.componentInstance.StructureElement =
      //   this.selectedRow[0].StructureElement;
      // modalRef.componentInstance.ProductType = this.selectedRow[0].ProdType;
      // modalRef.componentInstance.ScheduledProd =
      //   this.selectedRow[0].ScheduledProd;
      // modalRef.componentInstance.SORNo = this.selectedRow[0].SORNo;
      modalRef.componentInstance.SelectedRows = this.selectedRow;

      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
        this.UpdateTable();
      });
    } else if (item.toLowerCase() == 'technical') {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(
        UpdateTechnicalRemarksComponent,
        ngbModalOptions
      );
      // modalRef.componentInstance.OrderNumber = this.selectedRow[0].JobID;
      // modalRef.componentInstance.StructureElement =
      //   this.selectedRow[0].StructureElement;
      // modalRef.componentInstance.ProductType = this.selectedRow[0].ProdType;
      // modalRef.componentInstance.ScheduledProd =
      //   this.selectedRow[0].ScheduledProd;
      // modalRef.componentInstance.SORNo = this.selectedRow[0].SORNo;
      modalRef.componentInstance.SelectedRows = this.selectedRow;

      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
        this.UpdateTable();
      });
    } else if (item.toLowerCase() == 'project') {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
      };
      const modalRef = this.modalService.open(
        UpdateProjectInchargeComponent,
        ngbModalOptions
      );
      modalRef.componentInstance.CustomerCode =
        this.selectedRow[0].CustomerCode;
      modalRef.componentInstance.ProjectCode = this.selectedRow[0].ProjectCode;
      modalRef.componentInstance.ProjectIncharge =
        this.selectedRow[0].ProjectIncharge;
      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
        this.UpdateTable();
      });
    } else if (item.toLowerCase() == 'detailling') {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
      };
      const modalRef = this.modalService.open(
        UpdateDetaillingInchargeComponent,
        ngbModalOptions
      );
      modalRef.componentInstance.CustomerCode =
        this.selectedRow[0].CustomerCode;
      modalRef.componentInstance.ProjectCode = this.selectedRow[0].ProjectCode;
      modalRef.componentInstance.DetailingIncharge =
        this.selectedRow[0].DetailingIncharge;

      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
        this.UpdateTable();
      });
    }
  }
  StartUpdate() {
    // let obj: any
    // this.UpdateProcessSOR(obj)
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      UpdateConfirmationComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      console.log(x);
      this.SelectedCheckBoxes = x;

      this.OrderUpdate();
    });
  }

  OpenAttachments(item: any, pEvent: MouseEvent) {
    pEvent.stopImmediatePropagation();
    pEvent.preventDefault();
    this.gTableSelected = false;
    if (item === false) {
      item = this.selectedRow[0];
    }
    // this.Collapse=true;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      DocumentsAttachedComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.selectedRow = item;
  }

  RemoveTransportMode(Remarks: any) {
    if (Remarks.includes('{SC}')) {
      Remarks = Remarks.replace('{SC}', '');
    } else if (Remarks.includes('{LCO}')) {
      Remarks = Remarks.replace('{LCO}', '');
    } else if (Remarks.includes('{LB}')) {
      Remarks = Remarks.replace('{LB}', '');
    } else if (Remarks.includes('{ESCORTED}')) {
      Remarks = Remarks.replace('{ESCORTED}', '');
    }
    return Remarks.trim();
  }

  UpdateProcessRemarks(
    lIntRemarks: any,
    lExtRemarks: any,
    lTrnMode: any,
    lProdTypeL2: any
  ) {
    lIntRemarks = this.RemoveTransportMode(lIntRemarks);
    lExtRemarks = this.RemoveTransportMode(lExtRemarks);

    if (
      lTrnMode == 'SC' &&
      //  lIntRemarks.indexOf('SELF COLLECTION') < 0 &&
      lIntRemarks.indexOf('{SC}') < 0
    ) {
      lIntRemarks = '{SC} ' + lIntRemarks;
      lExtRemarks = '{SC} ' + lExtRemarks;
    } else if (
      lTrnMode.indexOf('HC') >= 0 &&
      lIntRemarks.indexOf('{LCO}') < 0
    ) {
      lIntRemarks = '{LCO} ' + lIntRemarks;
      lExtRemarks = '{LCO} ' + lExtRemarks;
    } else if (
      lTrnMode.indexOf('LB') >= 0 &&
      lTrnMode.indexOf('LBE') < 0 &&
      // lIntRemarks.indexOf('{LOW BED}') < 0 &&
      lIntRemarks.indexOf('{LB}') < 0
    ) {
      lIntRemarks = '{LB} ' + lIntRemarks;
      lExtRemarks = '{LB} ' + lExtRemarks;
    } else if (
      lTrnMode.indexOf('LBE') >= 0 &&
      lIntRemarks.indexOf('{ESCORTED}') < 0
    ) {
      lIntRemarks = '{ESCORTED} ' + lIntRemarks;
      lExtRemarks = '{ESCORTED} ' + lExtRemarks;
    }

    if (lIntRemarks.length > 100) {
      lIntRemarks = lIntRemarks.substring(0, 100);
    }

    if (lProdTypeL2 == 'COUPLER') {
      if (lIntRemarks.length > 87) {
        lIntRemarks = lIntRemarks.substring(0, 87);
      }
    }

    let obj = {
      IntRemarks: lIntRemarks,
      ExtRemarks: lExtRemarks,
    };

    return obj;
  }

  async StartOrderUpdate(selcetedColumn: any) {
    console.log('1.', this.selectedRow);

    // this.ProcessorderCheckbox = this.formBuilder.group({
    //   UrgentOrder: new FormControl(''),
    //   Conquas: new FormControl(''),
    //   Crane: new FormControl(''),
    //   PremiumService: new FormControl(''),
    //   ZeroTol: new FormControl(''),
    //   CallBDel: new FormControl(''),
    //   DoNotMix: new FormControl(''),
    //   SpecialPass: new FormControl(''),
    //   VehLowBed: new FormControl(''),
    //   Veh50Ton: new FormControl(''),
    //   Borge: new FormControl(''),
    //   PoliceEscort: new FormControl(''),
    //   FabricateESM: new FormControl(''),
    // })
    for (let i = 0; i < this.selectedRow.length; i++) {
      let lIntRemarks = this.InternalRemarks;
      let lExtRemarks = this.ExternalRemarks;
      if (selcetedColumn.VehicleType) {
        if (
          this.selectedRow[i].OrderStatus == 'Cancelled' ||
          this.selectedRow[i].OrderStatus == 'Processed' ||
          this.selectedRow[i].OrderStatus == 'Production' ||
          this.selectedRow[i].OrderStatus == 'Reviewed' ||
          this.selectedRow[i].OrderStatus == 'Delivered'
        ) {
          let tObj: any = this.UpdateProcessRemarks(
            lIntRemarks,
            lExtRemarks,
            this.ProcessOrderForm.controls.VehicleType.value,
            this.selectedRow[i].ProdTypeDis
          );
          lIntRemarks = tObj.IntRemarks;
          lExtRemarks = tObj.ExtRemarks;
          selcetedColumn.IntReamrks = true;
          selcetedColumn.ExternalRemarks = true;
        }
      }
      let SelectedValue: UpdateProcessSORModel = {
        CustomerCode: this.selectedRow[i].CustomerCode, // this.ProcessOrderForm.controls.customer.value,
        ProjectCode: this.selectedRow[i].ProjectCode, //this.ProcessOrderForm.controls.project.value,
        ContractNo: this.ProcessOrderForm.controls.Contract.value.split(' ')[0],
        ProdType: this.selectedRow[i].ProdType,
        JobID: this.selectedRow[i].JobID,
        SOR: this.selectedRow[i].SORNo,
        CashPayment: 'N', //Always remains the same
        ProjectStage:
          this.ProcessOrderForm.controls.ProjectStage.value.split('-')[0],
        ReqDateFrom: this.datePipe.transform(
          this.ProcessOrderForm.controls.ReqDate.value,
          'yyyy-MM-dd',
          'UTC+8'
        ), // this.ProcessOrderForm.controls.ReqDate.value.slice(0, 10),
        ReqDateTo: this.datePipe.transform(
          this.ProcessOrderForm.controls.UpdateReqDate.value,
          'yyyy-MM-dd',
          'UTC+8'
        ), //this.ProcessOrderForm.controls.UpdateReqDate.value.slice(0, 10),
        PONumber: this.ProcessOrderForm.controls.ponumber.value,
        PODate: this.datePipe.transform(
          this.selectedRow[i].PODate,
          'YYYY/MM/dd'
        ), //this.selectedRow[i].PODate.slice(0, 10),
        WBS1: this.ProcessOrderForm.controls.wbs1.value,
        WBS2: this.ProcessOrderForm.controls.wbs2.value,
        WBS3: this.ProcessOrderForm.controls.wbs3.value,
        VehicleType: this.ProcessOrderForm.controls.VehicleType.value, // this.selectedRow[i].TransportMode, //this.ProcessOrderForm.controls.VehicleType.value.split('-')[0],
        UrgentOrder: this.ProcessorderCheckbox.controls.UrgentOrder.value,
        Conquas: this.ProcessorderCheckbox.controls.Conquas.value,
        Crane: this.ProcessorderCheckbox.controls.Crane.value,
        PremiumService: this.ProcessorderCheckbox.controls.PremiumService.value,
        ZeroTol: this.ProcessorderCheckbox.controls.ZeroTol.value,
        CallBDel: this.ProcessorderCheckbox.controls.CallBDel.value,
        DoNotMix: this.ProcessorderCheckbox.controls.DoNotMix.value,
        SpecialPass: this.ProcessorderCheckbox.controls.SpecialPass.value,
        VehLowBed: this.ProcessorderCheckbox.controls.VehLowBed.value,
        Veh50Ton: this.ProcessorderCheckbox.controls.Veh50Ton.value,
        Borge: this.ProcessorderCheckbox.controls.Borge.value,
        PoliceEscort: this.ProcessorderCheckbox.controls.PoliceEscort.value,
        TimeRange: this.ProcessorderCheckbox.controls.TimeRange.value,
        IntRemarks: lIntRemarks ? lIntRemarks : '',
        ExtRemarks: lExtRemarks ? lExtRemarks : '', //"71A TUAS NEXUS DRIVE, S 636748 /ZHANG TIAH  ZE 85243292/AUNG 94562691/ 1ST PART 2 BASE SLAB BAR CH",
        InvRemarks: this.InvoiceRemarks ? this.InvoiceRemarks : '',
        OrderSource: this.selectedRow[i].OrderSource,
        StructureElement: this.selectedRow[i].StructureElement,
        ScheduledProd: this.selectedRow[i].ScheduledProd,
        ChReqDate: selcetedColumn.ReqDate ? 1 : 0,
        ChPONumber: selcetedColumn.PONO ? 1 : 0,
        ChVehicleType: selcetedColumn.VehicleType ? 1 : 0,
        ChBookInd: selcetedColumn.BookIndicator ? 1 : 0,
        ChBBSNo: selcetedColumn.BBSNO ? 1 : 0,
        ChBBSDesc: selcetedColumn.BBSDesc ? 1 : 0,
        ChIntRemakrs: selcetedColumn.IntReamrks ? 1 : 0,
        ChExtRemakrs: selcetedColumn.ExternalRemarks ? 1 : 0,
        ChInvRemakrs: selcetedColumn.InvoiceRemarks ? 1 : 0,
        OrderStatus: this.selectedRow[i].OrderStatus,
        FabricateESM: this.ProcessorderCheckbox.controls.FabricateESM.value,
        strMastReqDate: 'string',
        strUrgOrd: 'string',
        strIntRemark: 'string',
        strExtRemark: 'string',
        strPremiumSvc: 'string',
        strCraneBooked: 'string',
        strBargeBooked: 'string',
        strPoliceEscort: 'string',
        strZeroTol: 'string',
        strCallBefDel: 'string',
        strConquas: 'string',
        strSpecialPass: 'string',
        strLorryCrane: 'string',
        strLowBedVeh: 'string',
        strDoNotMix: 'string',
        strOnHold: 'string',
        str50TonVeh: 'string',
        strBBSNo: 'string',
        strItemReqDate: 'string',
        UserName: this.loginService.GetGroupName(),
      };

      this.ProcessOrderLoading = true;

      // this.UpdateProcessSOR(SelectedValue);

      let response = await this.UpdateProcessSOR_new(SelectedValue);

      this.ProcessOrderLoading = false;
      if (response === false) {
        alert(
          'Error on updating data. Please check the Internet connection and try again.'
        );
        return;
      } else {
        console.log(response);
        if (response) {
          if (i == this.selectedRow.length - 1) {
            alert('Updated Successfully');
          }
          if (i == 0) {
            this.InternalRemarks = JSON.parse(JSON.stringify(lIntRemarks));
            this.ExternalRemarks = JSON.parse(JSON.stringify(lExtRemarks));
          }
          //UPDATE VALUES IN TABLE
          this.UpdateTableDisplay(selcetedColumn, this.selectedRow[i]);
          this.UpdateBackupRecords(this.selectedRow[i]);
        } else {
          alert(
            'Error on updating data. Please check the Internet connection and try again.'
          );
          return;
        }
      }
    }
  }

  async UpdateProcessSOR_new(obj: any) {
    try {
      const data = this.orderService.UpdateProcessSOR(obj).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  UpdateTableDisplay(SelectedParam: any, currRow: any) {
    if (
      this.CurrentTab != 'PROCESSING' &&
      this.CurrentTab != 'SEARCH' &&
      this.CurrentTab != 'ALL'
    ) {
      if (SelectedParam.ReqDate) {
        currRow.RequiredDate = this.datePipe.transform(
          this.ProcessOrderForm.controls.UpdateReqDate.value,
          'yyyy-MM-dd',
          'UTC+8'
        );
      }
      if (SelectedParam.PONO) {
        currRow.PONumber = this.ProcessOrderForm.controls.ponumber.value;
      }
      if (SelectedParam.VehicleType) {
        currRow.TransportLimit =
          this.ProcessOrderForm.controls.VehicleType.value;
        currRow.TransportMode =
          this.ProcessOrderForm.controls.VehicleType.value;
        if (
          currRow.OrderStatus != 'Cancelled' &&
          currRow.OrderStatus != 'Processed' &&
          currRow.OrderStatus != 'Production' &&
          currRow.OrderStatus != 'Reviewed' &&
          currRow.OrderStatus != 'Delivered' &&
          currRow.OrderStatus != 'Partial Delivered'
        ) {
          this.SetRemarks(
            this.selectedRow[0].AdditionalRemark,
            this.selectedRow[0].SiteEngr_Name,
            this.selectedRow[0].SiteEngr_HP,
            this.selectedRow[0].Scheduler_Name,
            this.selectedRow[0].Scheduler_HP
          );
        }
      }
    } else {
      if (SelectedParam.ReqDate) {
        currRow.RequiredDate = this.datePipe.transform(
          this.ProcessOrderForm.controls.UpdateReqDate.value,
          'yyyy-MM-dd',
          'UTC+8'
        );
      }
      if (SelectedParam.PONO) {
        currRow.PONumber = this.ProcessOrderForm.controls.ponumber.value;
        currRow.SAPPONo = this.ProcessOrderForm.controls.ponumber.value;
      }
      if (SelectedParam.VehicleType) {
        currRow.TransportLimit =
          this.ProcessOrderForm.controls.VehicleType.value;
        currRow.TransportMode =
          this.ProcessOrderForm.controls.VehicleType.value;
        if (
          currRow.OrderStatus != 'Cancelled' &&
          currRow.OrderStatus != 'Processed' &&
          currRow.OrderStatus != 'Production' &&
          currRow.OrderStatus != 'Reviewed' &&
          currRow.OrderStatus != 'Delivered' &&
          currRow.OrderStatus != 'Partial Delivered'
        ) {
          this.SetRemarks(
            this.selectedRow[0].AdditionalRemark,
            this.selectedRow[0].SiteEngr_Name,
            this.selectedRow[0].SiteEngr_HP,
            this.selectedRow[0].Scheduler_Name,
            this.selectedRow[0].Scheduler_HP
          );
        }
      }

      if (SelectedParam.IntReamrks) {
        if (currRow.Int_Remark) {
          currRow.Int_Remark = this.InternalRemarks;
        }
        // pGrid.getDataItem(lRowNo).Int_Remark = document.getElementById("pr_intRemarks").value;
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("Int_Remark"));
      }
      if (SelectedParam.ExternalReamrks) {
        if (currRow.Ext_Remark) {
          currRow.Ext_Remark = this.ExternalRemarks;
        }
        // pGrid.getDataItem(lRowNo).Ext_Remark = document.getElementById("pr_extRemarks").value;
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("Ext_Remark"));
      }

      if (SelectedParam.BBSDesc) {
      }
      if (SelectedParam.BookIndicator) {
        if (currRow.URG_ORD_IND) {
          currRow.URG_ORD_IND = this.ProcessorderCheckbox.controls.UrgentOrder;
          currRow.CONQUAS_IND = this.ProcessorderCheckbox.controls.Conquas;
          currRow.LORRY_CRANE_IND = this.ProcessorderCheckbox.controls.Crane;
          currRow.PRM_SVC_IND =
            this.ProcessorderCheckbox.controls.PremiumService;
          currRow.ZERO_TOLERA = this.ProcessorderCheckbox.controls.ZeroTol;
          currRow.CALL_BEF_DE = this.ProcessorderCheckbox.controls.CallBDel;
          currRow.SPECIAL_PASS_IND =
            this.ProcessorderCheckbox.controls.SpecialPass;
          currRow.LOW_BED_IND = this.ProcessorderCheckbox.controls.VehLowBed;
          currRow.T50_VEH_IND = this.ProcessorderCheckbox.controls.Veh50Ton;
          currRow.BRG_BKD_IND = this.ProcessorderCheckbox.controls.Borge;
          currRow.POL_ESC_IND = this.ProcessorderCheckbox.controls.PoliceEscort;
        }

        // DoNotMix
        // FabricateESM
        // TimeRange

        // lRowNo.URG_ORD_IND = document.getElementById("pr_urgent").checked == true ? "Y" : "N";
        // lRowNo.CONQUAS_IND = document.getElementById("pr_conquas").checked == true ? "Y" : "N";
        // lRowNo.LORRY_CRANE_IND = document.getElementById("pr_crane").checked == true ? "Y" : "N";
        // lRowNo.PRM_SVC_IND = document.getElementById("pr_premium").checked == true ? "Y" : "N";
        // lRowNo.ZERO_TOLERANCE_I = document.getElementById("pr_zerotol").checked == true ? "Y" : "N";
        // lRowNo.CALL_BEF_DEL_IND = document.getElementById("pr_callbdel").checked == true ? "Y" : "N";
        // // lRowNo.CRN_BKD_IND = document.getElementById("pr_donotmix").checked == true ? "Y" : "N";
        // lRowNo.SPECIAL_PASS_IND = document.getElementById("pr_specialpass").checked == true ? "Y" : "N";
        // lRowNo.LOW_BED_IND = document.getElementById("pr_lowbed").checked == true ? "Y" : "N";
        // lRowNo.T50_VEH_IND = document.getElementById("pr_50tonveh").checked == true ? "Y" : "N";
        // lRowNo.BRG_BKD_IND = document.getElementById("pr_borge").checked == true ? "Y" : "N";
        // lRowNo.POL_ESC_IND = document.getElementById("pr_policeescort").checked == true ? "Y" : "N";

        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("URG_ORD_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("CONQUAS_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("LORRY_CRANE_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("PRM_SVC_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("ZERO_TOLERANCE_I"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("CALL_BEF_DEL_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("SPECIAL_PASS_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("LOW_BED_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("T50_VEH_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("BRG_BKD_IND"));
        // pGrid.updateCell(lRowNo, pGrid.getColumnIndex("POL_ESC_IND"));
      }
    }
  }

  UpdateProcessSOR(obj: any) {
    // obj = {
    //   CustomerCode: "0001101200",
    //   ProjectCode: "0000111613",
    //   ContractNo: "1020018184",
    //   ProdType: "STANDARD-MESH",
    //   JobID: 284610,
    //   SOR: "",
    //   CashPayment: "N",
    //   ProjectStage: "TYP",
    //   ReqDateFrom: "2023-10-19",
    //   ReqDateTo: "2023-08-31",
    //   PONumber: "newnewnew",
    //   PODate: "2023-07-07",
    //   WBS1: "C3A",
    //   WBS2: "1",
    //   WBS3: "",
    //   VehicleType: "TR40/24",
    //   UrgentOrder: false,
    //   Conquas: true,
    //   Crane: true,
    //   PremiumService: true,
    //   ZeroTol: true,
    //   CallBDel: true,
    //   DoNotMix: true,
    //   SpecialPass: true,
    //   VehLowBed: true,
    //   Veh50Ton: true,
    //   Borge: true,
    //   PoliceEscort: true,
    //   TimeRange: "string",
    //   IntRemarks: "71A TUAS NEXUS DRIVE, S 636748 /ZHANG TIAH  ZE 85243292/AUNG 94562691/ 1ST PART 2 BASE SLAB BAR CH",
    //   ExtRemarks: "71A TUAS NEXUS DRIVE, S 636748 /ZHANG TIAH  ZE 85243292/AUNG 94562691/ 1ST PART 2 BASE SLAB BAR CH",
    //   InvRemarks: "string",
    //   OrderSource: "UX",
    //   StructureElement: "NONWBS",
    //   ScheduledProd: "N",
    //   ChReqDate: 0,
    //   ChPONumber: 1,
    //   ChVehicleType: 0,
    //   ChBookInd: 0,
    //   ChBBSNo: 0,
    //   ChBBSDesc: 0,
    //   ChIntRemakrs: 0,
    //   ChExtRemakrs: 0,
    //   ChInvRemakrs: 0,
    //   OrderStatus: "Submitted",
    //   FabricateESM: true,
    //   strMastReqDate: "string",
    //   strUrgOrd: "string",
    //   strIntRemark: "string",
    //   strExtRemark: "string",
    //   strPremiumSvc: "string",
    //   strCraneBooked: "string",
    //   strBargeBooked: "string",
    //   strPoliceEscort: "string",
    //   strZeroTol: "string",
    //   strCallBefDel: "string",
    //   strConquas: "string",
    //   strSpecialPass: "string",
    //   strLorryCrane: "string",
    //   strLowBedVeh: "string",
    //   strDoNotMix: "string",
    //   strOnHold: "string",
    //   str50TonVeh: "string",
    //   strBBSNo: "string",
    //   strItemReqDate: "string"
    // }
    this.ProcessOrderLoading = true;
    this.orderService.UpdateProcessSOR(obj).subscribe({
      next: (response) => {
        console.log(response);
        if (response) {
          alert('Updated Successfully');
        } else {
          alert(
            'Error on updating data. Please check the Internet connection and try again.'
          );
        }
      },
      error: (e) => {},
      complete: () => {
        this.ProcessOrderLoading = false;
        this.UpdateTable();
      },
    });
  }

  UpdateTable() {
    // NOTE -> Better to update the table data in UI rather than calling the API.
    if (this.CurrentTab == 'CREATING') {
      this.GetProcessOrderForCreate('CREATING', false);
    } else if (this.CurrentTab == 'INCOMING') {
      this.GetProcessOrderForIncoming('INCOMING', false);
    } else if (this.CurrentTab == 'DETAILING') {
      this.GetProcessOrderForPendingDET('DETAILING', false);
    } else if (this.CurrentTab == 'CANCELLED') {
      this.GetProcessOrderForCancel('CANCELLED', false);
    } else if (this.CurrentTab == 'PROCESSING') {
      this.GetProcessOrderForProcessing('PROCESSING');
    } else if (this.CurrentTab == 'SEARCH') {
      let x: any = localStorage.getItem('OrderSearchModalValue');
      x = JSON.parse(x);
      this.GetSearchResultData(x);
    }
  }

  GetContractColor() {
    let color = 'inherit';

    // let contractterm = this.CheckContract(contract.substr(0, 10));

    color = this.contractterm ? 'inherit' : 'set-color-red';

    // if (contractterm) {
    //   if (contractterm.noexpired == 'false') {
    //     color = 'red'
    //   }
    // }

    return color;
  }

  ChangeContract(contract: any) {
    if (contract) {
      let lContractNumber = contract.substr(0, 10);
      this.CheckContract(lContractNumber);
    }
    console.log('ChangeContract', contract);
    // if (this.ProcessOrderForm.controls.Contract.value) {
    //   if (this.ProcessOrderForm.controls.Contract.value.$ngOptionLabel) {
    //     if (this.ProcessOrderForm.controls.Contract.value.$ngOptionLabel.substr(0, 10)) {
    //       if (this.ProcessOrderForm.controls.Contract.value.$ngOptionLabel[0] == ' ') {
    //         this.CheckContract(this.ProcessOrderForm.controls.Contract.value.$ngOptionLabel.substr(1, 10));
    //       } else {
    //         this.CheckContract(this.ProcessOrderForm.controls.Contract.value.$ngOptionLabel.substr(0, 10));
    //       }
    //     }
    //   }
    //   else if (this.ProcessOrderForm.controls.Contract.value.substr(0, 10)) {
    //     if (this.ProcessOrderForm.controls.Contract.value[0] == ' ') {
    //       this.CheckContract(this.ProcessOrderForm.controls.Contract.value.substr(1, 10));
    //     } else {
    //       this.CheckContract(this.ProcessOrderForm.controls.Contract.value.substr(0, 10));
    //     }
    //   }
    // }
  }
  CheckContract(contractNo: any) {
    this.contractcolorred = false;
    this.contractcoloryellow = false;
    this.orderService.checkContract(contractNo).subscribe({
      next: (response) => {
        console.log(response);
        this.contractterm = response.noexpired;
        if (this.contractterm == false) {
          if (this.ContractListDDL[0].substr(0, 10) == 'SPOT ORDER') {
          } else {
            this.contractcolorred = true;
          }
        } else if (this.ContractListDDL.length > 1) {
          this.contractcoloryellow = true;
        }
        //condition for yellow yet to know

        if (response) {
          let lReturn = response.noexpired;
          let lPaymentTerm = response.paymentterm;
          let myOrderTypeList: any[] = [];

          if (lPaymentTerm == 'COD0' || lPaymentTerm == 'ADVC') {
            myOrderTypeList = ['CASH', 'FOC'];
            if (this.ProcessOrderForm.controls['OrderType'].value == 'CREDIT') {
              let row = this.selectedRow[0];
              if (
                row.OrderStatus != 'Cancelled' &&
                row.OrderStatus != 'Processed' &&
                row.OrderStatus != 'Production' &&
                row.OrderStatus != 'Reviewed' &&
                row.OrderStatus != 'Delivered' &&
                row.OrderStatus != 'Partial Delivered'
              ) {
                let lOrderType = this.selectedRow[0].OrderType
                  ? this.selectedRow[0].OrderType
                  : 'CASH';
                this.ProcessOrderForm.controls['OrderType'].patchValue(
                  lOrderType
                );
              } else {
                myOrderTypeList = ['CREDIT', 'CASH', 'FOC'];
              }
            }
          } else {
            myOrderTypeList = ['CREDIT', 'CASH', 'FOC'];
          }
          this.OrderTypeList = myOrderTypeList;
        }
      },
      error: (e) => {
        // ERROR HANDLING -> PENDING
      },
      complete: () => {},
    });
  }

  OpenBBSNoListPopup() {
    console.log('open POP UP');
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
    };
    const modalRef = this.modalService.open(
      BbsNumberListComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.CustomerCode = this.selectedRow[0].CustomerCode;
    modalRef.componentInstance.ProjectCode = this.selectedRow[0].ProjectCode;
    modalRef.componentInstance.JobID = this.selectedRow[0].JobID;
  }

  GetProjectStageddl() {
    this.orderService.getProjectStage().subscribe({
      next: (response) => {
        console.log(response);
        this.projectStageddl = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  resetSettingsMenu() {
    // reset Forecast
    this.ForeCast = false;
    this.togglePendingENTSettingMenu = false;
    this.toggleIncomingSettingMenu = false;
    this.togglePendingDETSettingMenu = false;
    this.toggleCancelledSettingMenu = false;
    this.toggleProcessingSettingMenu = false;
    this.toggleSeacrhSettingMenu = false;
  }

  async GetOrderDetailsTable(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ProdTypeDis: any,
    ScheduledProd: any
  ) {
    this.ResetOrderDetailsTable(); // Hide the order details table currently being displayed.
    if (ProductType == 'Rebar' || ProductType == 'CAB') {
      if (ProdTypeDis == 'STANDARD-BAR') {
        // reloadBBSBar(pRowNo, pGrid);
        this.getBBSBar(
          CustomerCode,
          ProjectCode,
          JobID,
          OrderSource,
          StructureElement,
          ProductType,
          ScheduledProd
        );
      } else {
        this.GetBBSProcess(
          CustomerCode,
          ProjectCode,
          JobID,
          OrderSource,
          StructureElement,
          ProductType,
          ScheduledProd
        );

        const response = await this.checkCustomShapeSubmit(
          CustomerCode,
          ProjectCode,
          JobID,
          StructureElement,
          OrderSource
        );
        if (response == true) {
          alert(
            'The order includes customer shape. Please ask Planning to complete the order.'
          );
        }
      }
    }
    if (
      ProductType == 'Standard MESH' ||
      ProductType == 'STANDARD-MESH' ||
      ProductType == 'STANDARD-BAR' ||
      ProductType == 'COIL' ||
      ProductType == 'COUPLER'
    ) {
      this.GetStdSheetProcess(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      );
    } else if (
      ProductType == 'MESH' ||
      ProductType == 'STIRRUP-LINK-MESH' ||
      ProductType == 'COLUMN-LINK-MESH' ||
      ProductType == 'CUT-TO-SIZE-MESH' ||
      ProductType == 'PRE-CAGE' ||
      ProductType == 'CARPET' ||
      ProductType == 'CORE-CAGE' ||
      ProductType == 'ACS'
    ) {
      if (ScheduledProd == 'Y') {
        // var lWBS1 = document.getElementById("pr_wbs1");
        // lWBS1.options.length = 0;
        // var lOption = document.createElement("option");
        // lOption.text = pGrid.getDataItem(pRowNo).WBS1;
        // lOption.selected = true;
        // lWBS1.options.add(lOption);
        // var lWBS2 = document.getElementById("pr_wbs2");
        // lWBS2.options.length = 0;
        // var lOption = document.createElement("option");
        // lOption.text = pGrid.getDataItem(pRowNo).WBS2;
        // lOption.selected = true;
        // lWBS2.options.add(lOption);
        // var lWBS3 = document.getElementById("pr_wbs3");
        // lWBS3.options.length = 0;
        // var lOption = document.createElement("option");
        // lOption.text = pGrid.getDataItem(pRowNo).WBS3;
        // lOption.selected = true;
        // lWBS3.options.add(lOption);
      } else {
        // lJobID = pGrid.getDataItem(pRowNo).JobID;
        var lWBSType = 'MSH';
        if (ProductType == 'PRE-CAGE') {
          var lWBSType = 'PRC';
        }
        if (ProductType == 'CARPET' || ProductType == 'CORE-CAGE') {
          var lWBSType = 'CAR';
        }
        // //getWBS1(lCustomer, lProject, lJobID, lWBSType);
        // //getWBS2(lCustomer, lProject, lJobID, lWBSType);
        // //getWBS3(lCustomer, lProject, lJobID, lWBSType);
        // this.getWBSAll(lCustomer, lProject, lJobID, lWBSType, gWBS1, gWBS2, gWBS3);
      }

      //Call getMeshBBS API method
      this.getMeshBBS(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      );
    } else if (ProductType == 'BPC') {
      if (ScheduledProd == 'Y') {
        this.getMeshBBS(
          CustomerCode,
          ProjectCode,
          JobID,
          OrderSource,
          StructureElement,
          ProductType,
          ScheduledProd
        );
      } else {
        // reloadBPC(pRowNo, pGrid);
        this.getBPCData(
          CustomerCode,
          ProjectCode,
          JobID,
          OrderSource,
          StructureElement,
          ProductType,
          ScheduledProd
        );
      }
    }
  }

  TotalNo: any = 0;
  lVB: any = 0;
  GetBBSProcess(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    this.ResetOrderDetailsTable();
    this.orderService
      .getBBS_Process(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('BBS', response);
          this.showBBS = true;
          this.OrderDetailsList_BBS = response;
          let lIndex = this.selectedRow.findIndex((x) => x.JobID == JobID);
          let lStatus = this.selectedRow[lIndex].OrderStatus;
          let lContractNo =
            this.ProcessOrderForm.controls.Contract.value.substr(0, 10);

          this.TotalNo = 0;
          this.lVB = 0;
          for (let i = 0; i < response.length; i++) {
            if (
              response[i].BBSNo != null &&
              response[i].BBSNo.indexOf('Cancelled') < 0
            ) {
              this.TotalNo = this.TotalNo + 1;
            }
            if (
              response[i].BBSCancelledWT != null &&
              response[i].BBSCancelledWT > 0
            ) {
              this.lVB = response[i].BBSCancelledWT;
            }
          }

          if (lStatus == 'Submitted' && this.lVB > 0 && lContractNo != '') {
            // document.getElementById("loaderNotes").innerText = "Splitting Various Bars. Please Wait.";
            // startLoading();

            this.StartSplitVB(this.selectedRow[lIndex]);
            // setTimeout(StartSplitVB, 300, lCustomerCode, lProjectCode, lJobID, lOrderSource, lStructureEle, lProdType, lScheduledProd, lStatus, pRowNo);
          } else {
            for (let i = 0; i < this.OrderDetailsList_BBS.length; i++) {
              let pStatus = this.selectedRow[0].OrderStatus;
              let lOrderCT = 0;
              if (
                response[i].BBSSOR != null &&
                response[i].BBSSOR != '' &&
                response[i].BBSSOR.indexOf('Cancelled') < 0
              ) {
                lOrderCT = lOrderCT + 1;
              }
              if (
                response[i].BBSSORCoupler != null &&
                response[i].BBSSORCoupler != '' &&
                response[i].BBSSORCoupler.indexOf('Cancelled') < 0
              ) {
                lOrderCT = lOrderCT + 1;
              }
              if (
                response[i].BBSSAPSO != null &&
                response[i].BBSSAPSO != '' &&
                response[i].BBSSAPSO.indexOf('Cancelled') < 0
              ) {
                lOrderCT = lOrderCT + 1;
              }
              // var lLink = "<a href= 'javascript:;' onclick = 'CancelCABBBS(" + pRowNo + "," + response[i].BBSID + ",\"" + response[i].BBSSOR + "\",\"" + response[i].BBSSORCoupler + "\", \"" + response[i].BBSSAPSO + "\"," + TotalNo + ");return false;' >Cancel</a>";
              this.OrderDetailsList_BBS[i].showCancel = true;
              if (
                pStatus == 'Created*' ||
                pStatus == 'Submitted' ||
                (this.TotalNo <= 1 && lOrderCT <= 1)
              ) {
                // lLink = "";
                this.OrderDetailsList_BBS[i].showCancel = false;
              }
              if (
                response[i].BBSNo != null &&
                response[i].BBSNo.indexOf('Cancelled') >= 0
              ) {
                // lLink = "";
                this.OrderDetailsList_BBS[i].showCancel = false;
              }
            }
          }

          if (response.length > 0) {
            if (
              lStatus != 'Cancelled' &&
              lStatus != 'Processed' &&
              lStatus != 'Production' &&
              lStatus != 'Reviewed' &&
              lStatus != 'Delivered' &&
              lStatus != 'Partial Delivered'
            ) {
              console.log('Check For BBS');
              this.checkBBSNo();
            }
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  }
  GetStdSheetProcess(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    this.ResetOrderDetailsTable();
    this.orderService
      .getStdSheet_Process(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('BBS', response);
          let ProdType = this.selectedRow[0].ProdType;
          if (ProdType == 'STANDARD-MESH') {
            this.showStdMESH = true;
            this.OrderDetailsList_StdMESH = response;
          } else if (
            ProdType == 'STANDARD-BAR' ||
            ProdType == 'COUPLER' ||
            ProdType == 'COIL'
          ) {
            this.showStdProd = true;
            if (response) {
              this.OrderDetailsList_StdProd = response;
            }
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  getBPCData(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    this.ResetOrderDetailsTable();
    this.orderService
      .getBPCData_CAB(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('MeshBPC', response);
          this.showBPC = true;
          //this.OrderDetailsList_BPC = response;
          let lBPCData: any[] = [];
          if (response != null && response.length > 0) {
            var TotalNo = 0;
            for (let i = 0; i < response.length; i++) {
              if (
                response[i].item2.sor_no != null &&
                response[i].item2.sor_no.indexOf('Cancelled') < 0
              ) {
                TotalNo = TotalNo + 1;
              }
            }
            for (let i = 0; i < response.length; i++) {
              // var lLink = "<a href= 'javascript:;' onclick = 'CancelBPCItem(" + pRowNo + "," + response[i].item1.cage_id + "," + response[i].item2.load_id + ",\"" + response[i].item2.sor_no + "\");return false;' >Cancel</a>";
              response[i].showCancel = true;
              let lStatus = this.selectedRow[0].OrderStatus;
              if (
                (lStatus != 'Reviewed' &&
                  lStatus != 'Processed' &&
                  lStatus != 'Production') ||
                TotalNo <= 1
              ) {
                response[i].showCancel = false;
              }
              if (
                response[i].item2.sor_no != null &&
                response[i].item2.sor_no.indexOf('Cancelled') >= 0
              ) {
                response[i].showCancel = false;
              }
              //Cage Type
              var lCageType = '';
              var lPileType = response[i].item1.pile_type;
              var lMainBarArrange = response[i].item1.main_bar_arrange;
              var lMainBarType = response[i].item1.main_bar_type;
              if (lPileType == 'Micro-Pile') {
                lCageType = 'Micro Pile';
              } else {
                if (lPileType == 'Single-Layer') {
                  if (lMainBarType == 'Single') {
                    if (lMainBarArrange == 'Single') {
                      lCageType = 'Single Layer, Separated Bars';
                    } else if (lMainBarArrange == 'Side-By-Side') {
                      lCageType = 'Single Layer, Side-By-Side Bundled Bars';
                    } else if (lMainBarArrange == 'In-Out') {
                      lCageType = 'Single Layer, In-Out Bundled Bars';
                    } else {
                      lCageType = 'Single Layer, Complex Bundled Bars';
                    }
                  }
                  if (lMainBarType == 'Mixed') {
                    if (lMainBarArrange == 'Single') {
                      lCageType = 'Single Layer, Mixed Bars';
                    } else if (lMainBarArrange == 'Side-By-Side') {
                      lCageType =
                        'Single Layer, Side By Side Bundled, Mixed Bars';
                    } else if (lMainBarArrange == 'In-Out') {
                      lCageType = 'Single Layer, In-Out Bundled, Mixed Bars';
                    } else {
                      lCageType = 'Single Layer, Complex Bundled, Mixed Bars';
                    }
                  }
                } else {
                  if (lMainBarArrange == 'Single') {
                    lCageType = 'Double Layer, Separated Bars';
                  } else if (lMainBarArrange == 'Side-By-Side') {
                    lCageType = 'Double Layer, Side By Side Bundled Bars';
                  } else {
                    lCageType = 'Double Layer, Complex Bundled Bars';
                  }
                }
              }

              //Main Bar
              let lMainBars = '';
              var lBarCTArr = response[i].item1.main_bar_ct.split(',');
              var lBarDiaArr = response[i].item1.main_bar_dia.split(',');
              var lBarType = response[i].item1.main_bar_grade.trim();
              if (lBarCTArr.length > 0 && lBarDiaArr.length > 0) {
                lMainBars =
                  lBarCTArr[0].trim() + lBarType + lBarDiaArr[0].trim();
              }
              if (lBarCTArr.length > 1 && lBarDiaArr.length > 1) {
                lMainBars =
                  lMainBars +
                  ', ' +
                  lBarCTArr[1].trim() +
                  lBarType +
                  lBarDiaArr[1].trim();
              }

              //Spiral Link
              let lSpiralLink = '';
              var lSLType = '';
              if (response[i].item1.spiral_link_type.length >= 5) {
                if (
                  response[i].item1.spiral_link_type.substring(0, 5) == 'Others'
                ) {
                  lSLType = '';
                } else if (
                  response[i].item1.spiral_link_type.substring(0, 4) == 'Twin'
                ) {
                  lSLType = '2';
                }
              }
              var lSLSpacing = response[i].item1.spiral_link_spacing.split(',');
              var lSLGrade = response[i].item1.spiral_link_grade.trim();
              if (lSLSpacing.length > 0 && lSLSpacing.length > 0) {
                lSpiralLink =
                  lSLType +
                  lSLGrade +
                  response[i].item1.sl1_dia +
                  '-' +
                  lSLSpacing[0] +
                  '-' +
                  response[i].item1.sl1_length;
              }
              if (lSLSpacing.length > 1 && lSLSpacing.length > 1) {
                lSpiralLink =
                  lSpiralLink +
                  ', ' +
                  lSLType +
                  lSLGrade +
                  response[i].item1.sl2_dia +
                  '-' +
                  lSLSpacing[1] +
                  '-' +
                  response[i].item1.sl2_length;
              }
              if (lSLSpacing.length > 2 && lSLSpacing.length > 2) {
                lSpiralLink =
                  lSpiralLink +
                  ', ' +
                  lSLType +
                  lSLGrade +
                  response[i].item1.sl3_dia +
                  '-' +
                  lSLSpacing[2] +
                  '-' +
                  response[i].item1.sl3_length;
              }

              let lReqDate: any = '';
              if (response[i].item2.required_date) {
                lReqDate = response[i].item2.required_date;

                if (lReqDate.includes('T')) {
                  lReqDate = lReqDate.split('T')[0];
                } else {
                  // '2024-12-09T00:00:00' // STEP 1
                  // '09/12/2024' // STEP 2
                  // '09-12-2024' // STEP 3
                  // '12/09/2024' // STEP 4
                  // '2024-12-09' // STEP 5

                  // Ensure that the date string is in a format that the DatePipe can recognize. The default format for DatePipe is MM/dd/yyyy.

                  // STEP 2
                  lReqDate = new Date(
                    response[i].item2.required_date
                  ).toLocaleDateString();

                  // STEP 3
                  lReqDate = lReqDate.replaceAll('/', '-');

                  // STEP 4
                  lReqDate = lReqDate.replace(
                    /(\d{2})-(\d{2})-(\d{4})/,
                    '$2/$1/$3'
                  );

                  // STEP 5
                  lReqDate = this.datePipe.transform(
                    lReqDate,
                    'yyyy-MM-dd',
                    'UTC+8'
                  );
                }
              }

              // var myReqDateStr = myDate.getFullYear().toString() + '-' + pad((myDate.getMonth() + 1).toString(), 2) + '-' + pad(myDate.getDate().toString(), 2);

              if (
                i == 0 ||
                response[i].item1.cage_id != response[i - 1].item1.cage_id
              ) {
                lBPCData[i] = {
                  rec_id: i + 1,
                  cage_id: response[i].item1.cage_id,
                  pile_dia: response[i].item1.pile_dia,
                  pile_type: lCageType,
                  main_bar_ct: lMainBars,
                  main_bar_shape: response[i].item1.main_bar_shape,
                  cage_length: response[i].item1.cage_length,
                  lap_length: response[i].item1.lap_length,
                  spiral_link_spacing: lSpiralLink,
                  end_length: response[i].item1.end_length,
                  cage_qty: response[i].item1.cage_qty,
                  cage_location: response[i].item1.cage_location,
                  cage_weight: (
                    Number(response[i].item1.cage_weight) /
                    Number(response[i].item1.cage_qty)
                  ).toFixed(3),
                  per_set: response[i].item1.per_set,
                  bbs_no: response[i].item1.bbs_no,
                  cage_remarks: response[i].item1.cage_remarks,
                  sor_no: response[i].item2.sor_no,
                  load_id: response[i].item2.load_id,
                  load_qty: response[i].item2.load_qty,
                  required_date: lReqDate,
                  int_remarks: response[i].item2.int_remarks,
                  ext_remarks: response[i].item2.ext_remarks,
                  CustomerCode: response[i].item2.CustomerCode,
                  ProjectCode: response[i].item2.ProjectCode,
                  JobID: response[i].item2.JobID,
                  ShowCancel: response[i].showCancel,
                };
              } else {
                lBPCData[i] = {
                  rec_id: i + 1,
                  cage_id: response[i].item1.cage_id,
                  pile_dia: '',
                  pile_type: '',
                  main_bar_ct: '',
                  main_bar_shape: '',
                  cage_length: '',
                  lap_length: '',
                  spiral_link_spacing: '',
                  end_length: '',
                  cage_qty: '',
                  cage_location: '',
                  cage_weight: '',
                  per_set: response[i].item1.per_set,
                  bbs_no: response[i].item1.bbs_no,
                  cage_remarks: '',
                  load_id: response[i].item2.load_id,
                  load_qty: response[i].item2.load_qty,
                  required_date: lReqDate,
                  int_remarks: response[i].item2.int_remarks,
                  ext_remarks: response[i].item2.ext_remarks,
                  sor_no: response[i].item2.sor_no,
                  CustomerCode: response[i].item2.CustomerCode,
                  ProjectCode: response[i].item2.ProjectCode,
                  JobID: response[i].item2.JobID,
                  ShowCancel: response[i].showCancel,
                };
              }

              // if (
              //   this.selectedRow[0].OrderStatus == 'Created*' ||
              //   this.selectedRow[0].OrderStatus == 'Submitted'
              // ) {
              if (lBPCData[i].int_remarks == '') {
                lBPCData[i].int_remarks = JSON.parse(
                  JSON.stringify(this.InternalRemarks)
                );
              }
              if (lBPCData[i].ext_remarks == '') {
                lBPCData[i].ext_remarks = JSON.parse(
                  JSON.stringify(this.ExternalRemarks)
                );
              }
              // }
            }
            this.OrderDetailsList_BPC = lBPCData;
            // BPCGrid.setData(lBPCData);
            // BPCGrid.invalidate();
            // BPCGrid.render();
          } else {
            this.OrderDetailsList_BPC = lBPCData;
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  getMeshBBS(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    this.ResetOrderDetailsTable();
    this.orderService
      .getMeshBBS(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('MeshBBS', response);
          this.OrderDetailsList_MESH = response;
          this.showMESH = true;
          this.OrderDetailsList_MESH.forEach((element) => {
            element.BBSProdCategory = ProductType;
            element.BBSStrucElem = StructureElement;
          });
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  getBBSBar(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    this.ResetOrderDetailsTable();
    this.orderService
      .getBBSBar(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('BBSBar', response);
          this.OrderDetailsList_BBSBar = response;
          this.showBBSBar = true;
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  SendExceedContractEmail(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    ContractNo: any,
    OrderSource: any,
    ProdType: any,
    ProdTypeL2: any,
    TotalOrderWT: any,
    ContractCap: any
  ) {
    this.orderService
      .SendExceedContractEmail(
        CustomerCode,
        ProjectCode,
        JobID,
        ContractNo,
        OrderSource,
        ProdType,
        ProdTypeL2,
        TotalOrderWT,
        ContractCap
      )
      .subscribe({
        next: (response) => {
          console.log('Mail Sent -> ', response);
          if (response) {
            alert('Mail Sent!!');
          } else {
            alert(
              'Error to send the exceeded contract quota email, please prepare the email manually.'
            );
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  }

  async Cancel() {
    // if (!confirm("You are going to cancel the selected " + this.selectedRow.length + " order(s), including " + lSORsCancel+ ". Continue?")) {
    // }

    // this.CancelWithdrawOrder('Cancel')
    let lCancelledOrders: any[] = [];
    for (let i = 0; i < this.selectedRow.length; i++) {
      let customercode = this.selectedRow[i].CustomerCode;
      let projectcode = this.selectedRow[i].ProjectCode;
      let contract = this.ProcessOrderForm.controls.Contract.value.substr(
        0,
        10
      );
      let jobid = this.selectedRow[i].JobID;
      let structureelement = this.selectedRow[i].StructureElement;
      let producttype = this.selectedRow[i].ProdType;
      let ordersource = this.selectedRow[i].OrderSource;
      let scheduledprod = this.selectedRow[i].ScheduledProd;
      let action = 'Cancel';

      /**
       * Keep a check of Withdrawn order numbers in case the user tries to withdraw/cancel multiple records
       * having same order number.
       * Date: 19-06-2024
       */
      let tempObj = {
        JobID: jobid,
        ProdType: producttype,
        StructureElement: structureelement,
      };
      let tempFlag: boolean = lCancelledOrders.some(
        (item) =>
          item.JobID === tempObj.JobID &&
          item.ProdType === tempObj.ProdType &&
          item.StructureElement === tempObj.StructureElement
      );
      if (tempFlag && producttype == 'CAB') {
        if (i == this.selectedRow.length - 1) {
          alert('Order(s) withdrawn successfully!');
        }
        continue;
      } else {
        lCancelledOrders.push(tempObj);
      }

      let responseCancel = await this.CancelProcess(
        customercode,
        projectcode,
        contract,
        jobid,
        structureelement,
        producttype,
        ordersource,
        scheduledprod,
        action
      );
      if (responseCancel == 'ERROR' || responseCancel == false) {
        alert(
          'Order Cancellation Error: Please check the Internet connection and try again.'
        );
        this.ProcessOrderLoading = false;
        return;
      }
      if (responseCancel) {
        if (responseCancel.Value) {
          responseCancel = responseCancel.Value;
        }
        if (responseCancel.success == true) {
          this.selectedRow[i].OrderStatus = 'Cancelled';

          // CXL code added
          if(this.selectedRow[i].SAPPONo){
            this.selectedRow[i].SAPPONo = this.selectedRow[i].SAPPONo + '-CXL';
          }
          this.UpdatePONumber_CXL(this.selectedRow[i].JobID);

          this.UpdateOrderStatus(this.selectedRow[i].JobID, 'Cancelled');
          if (i == this.selectedRow.length - 1) {
            alert('Order(s) cancelled successfully!');
          }
        } else {
          alert(
            'Order withdrawal/cancellation fails. ' + responseCancel.message
          );
          this.ProcessOrderLoading = false;
          return;
        }
      }

      // if (responseCancel == true) {
      //   alert('Order(s) cancelled successfully!')
      // }else {
      //   alert('JobID - '+ jobid + ' - ' + responseCancel)
      // }
    }

    this.ProcessOrderLoading = false;
    // this.UpdateTable();
  }
  async Withdraw() {
    // if (!confirm("You are going to withdraw the selected " + this.selectedRow.length + " order(s), including " + lSORsCancel + ". After that, customer can withdraw, edit and submit it again. Continue?")) {
    // }
    // this.CancelWithdrawOrder('Withdraw')

    let lWithdrawnOrders: any[] = [];
    for (let i = 0; i < this.selectedRow.length; i++) {
      let customercode = this.selectedRow[i].CustomerCode;
      let projectcode = this.selectedRow[i].ProjectCode;
      let contract = this.ProcessOrderForm.controls.Contract.value.substr(
        0,
        10
      );
      let jobid = this.selectedRow[i].JobID;
      let structureelement = this.selectedRow[i].StructureElement;
      let producttype = this.selectedRow[i].ProdType;
      let ordersource = this.selectedRow[i].OrderSource;
      let scheduledprod = this.selectedRow[i].ScheduledProd;
      let action = 'Withdraw';

      /**
       * Keep a check of Withdrawn order numbers in case the user tries to withdraw/cancel multiple records
       * having same order number.
       * Date: 19-06-2024
       */
      let tempObj = {
        JobID: jobid,
        ProdType: producttype,
        StructureElement: structureelement,
      };
      let tempFlag: boolean = lWithdrawnOrders.some(
        (item) =>
          item.JobID === tempObj.JobID &&
          item.ProdType === tempObj.ProdType &&
          item.StructureElement === tempObj.StructureElement
      );
      if (tempFlag && producttype == 'CAB') {
        if (i == this.selectedRow.length - 1) {
          alert('Order(s) withdrawn successfully!');
        }
        continue;
      } else {
        lWithdrawnOrders.push(tempObj);
      }

      let responseWthdraw = await this.WithdrawProcess(
        customercode,
        projectcode,
        contract,
        jobid,
        structureelement,
        producttype,
        ordersource,
        scheduledprod,
        action
      );
      if (responseWthdraw == 'ERROR' || responseWthdraw == false) {
        alert(
          'Order Cancellation Error: Please check the Internet connection and try again.'
        );
        this.ProcessOrderLoading = false;
        return;
      }
      if (responseWthdraw) {
        if (responseWthdraw.Value) {
          responseWthdraw = responseWthdraw.Value;
        }
        if (responseWthdraw.success == true) {
          this.selectedRow[i].OrderStatus = 'Withdrawn';

          // CXL code added
          if(this.selectedRow[i].SAPPONo){
            this.selectedRow[i].SAPPONo = this.selectedRow[i].SAPPONo + '-CXL';
          }
          this.UpdatePONumber_CXL(this.selectedRow[i].JobID);

          this.UpdateOrderStatus(this.selectedRow[i].JobID, 'Withdrawn');
          if (i == this.selectedRow.length - 1) {
            alert('Order(s) withdrawn successfully!');
          }
        } else {
          alert(
            'Order withdrawal/cancellation fails. ' + responseWthdraw.message
          );
          this.ProcessOrderLoading = false;
          return;
        }
      }
    }

    this.ProcessOrderLoading = false;
    //INSTEAD OF TABLE UPDATE CHANGE STATUS TO WITHDRAWN
    // this.UpdateTable();
  }

  async CancelProcess(
    CustomerCode: string,
    ProjectCode: string,
    ContractNo: string,
    JobID: number,
    StructureElement: string,
    ProdType: string,
    OrderSource: string,
    ScheduledProd: string,
    ActionType: string
  ): Promise<any> {
    try {
      const data = await this.orderService
        .CancelProcess(
          CustomerCode,
          ProjectCode,
          ContractNo,
          JobID,
          StructureElement,
          ProdType,
          OrderSource,
          ScheduledProd,
          ActionType
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'ERROR';
    }
  }

  async WithdrawProcess(
    CustomerCode: string,
    ProjectCode: string,
    ContractNo: string,
    JobID: number,
    StructureElement: string,
    ProdType: string,
    OrderSource: string,
    ScheduledProd: string,
    ActionType: string
  ): Promise<any> {
    try {
      const data = await this.orderService
        .CancelProcess(
          CustomerCode,
          ProjectCode,
          ContractNo,
          JobID,
          StructureElement,
          ProdType,
          OrderSource,
          ScheduledProd,
          ActionType
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'ERROR';
    }
  }

  async RouteToProductDetails(item: any) {
    localStorage.removeItem('ProcessData');
    sessionStorage.removeItem('ProcessData');
    localStorage.removeItem('ProcessOrderSummaryData');
    sessionStorage.removeItem('ProcessOrderSummaryData');
    // localStorage.removeItem('CreateDataProcess');
    // sessionStorage.removeItem('CreateDataProcess');
    // console.log('ProcessData', item);
    this.createSharedService.selectedOrderNumber = item.JobID;

    const response = await this.getJobId(
      this.createSharedService.selectedOrderNumber,
      item.ProdType,
      item.StructureElement,
      item.ScheduledProd
    );
    this.createSharedService.JobIds = response;

    let addresResponse = await this.GetAddCodeforOrder(this.createSharedService.selectedOrderNumber); 
    if(addresResponse) {
      addresResponse = addresResponse.AddressCode ? addresResponse.AddressCode : "";
    }else {
      addresResponse = "";
    }

    this.processsharedserviceService.ProcessAddress = addresResponse
    this.processsharedserviceService.ProcessCustomer = item.CustomerCode;
    this.processsharedserviceService.ProcessProject = item.ProjectCode;
    let obj: SaveJobAdvice_CAB = {
      CustomerCode: item.CustomerCode,
      ProjectCode: item.ProjectCode,
      JobID: item.JobID,
      PONumber: item.PONumber ? item.PONumber : '',
      PODate: item.PODate,
      RequiredDate: item.ReqDate,
      CouplerType: item.CouplerType,
      OrderStatus: item.OrderStatus,
      TotalCABWeight: item.TotalCABWeight,
      TotalSTDWeight: item.TotalSTDWeight,
      TotalWeight: item.TotalWeight,
      TransportLimit: item.TransportLimit,
      SiteEngr_Name: item.SiteEngr_Name,
      SiteEngr_HP: item.SiteEngr_HP,
      SiteEngr_Tel: '',
      Scheduler_Name: item.Scheduler_Name,
      Scheduler_HP: item.Scheduler_HP,
      Scheduler_Tel: '',
      WBS1: item.WBS1,
      WBS2: item.WBS2,
      WBS3: item.WBS3,
      DeliveryAddress: item.DeliveryAddress,
      ProjectStage: item.ProjectStage,
      Remarks: item.Remarks,
      OrderSource: item.OrderSource,
      TransportMode: item.TransportMode,
      BBSStandard: '',
      UpdateDate: item.UpdateDate,
      UpdateBy: item.UpdateBy, //'jagdishH_ttl@natsteel.com.sg',
    };
    let lData = {
      pCustomerCode: item.CustomerCode,
      pOrderNo: item.JobID ? item.JobID.toString() : '',
      pProjectCode: item.ProjectCode,
      pSelectedPostID: item.PostHeaderID ? item.PostHeaderID.toString() : '',
      pSelectedProd: item.ProdType,
      pSelectedQty: '',
      pSelectedSE: item.StructureElement,
      pSelectedScheduled: item.ScheduledProd,
      pSelectedWBS1: item.WBS1,
      pSelectedWBS2: item.WBS2,
      pSelectedWBS3: item.WBS3,
      pSelectedWT: '',
      pWBS1: item.WBS1,
      pWBS2: item.WBS2,
      pWBS3: item.WBS3,
      JobAdviceCAB: obj,
    };

    localStorage.setItem('ProcessOrderSummaryData', JSON.stringify(lData));
    // this.processsharedserviceService.setOrderSummaryData(lData);
    this.processsharedserviceService.setProductDetailsEditable(false);
    let route = this.getProductDetailsRoute(item.ProdType);

    // this.router.navigate([route]);

    // When opening the project in new tab prevent the page for auto routing the page based upon the UserType
    localStorage.setItem('functionHasRouted', JSON.stringify('true'));

    // const timestamp = new Date().getTime();
    // const newWindow: any = window.open(route+'?timestamp=$'+timestamp, 'Product Details');
    const url = route; // Replace with your desired URL
    if (url) {
      const link = this.renderer.createElement('a');
      this.renderer.setAttribute(link, 'href', url);
      this.renderer.setAttribute(link, 'target', '_blank');
      link.click();
      // const newWindow: any = window.open(route, 'Product Details');
      let data = {
        customer: item.CustomerCode,
        project: item.ProjectCode,
        ordernumber: item.JobID,
        orderstatus: item.OrderStatus,
        ProductDetailsEdit: false,
        jobIds: this.createSharedService.JobIds,
        Transport: item.TransportMode,
        ScheduledProd: item.ScheduledProd,
        StructureElement: item.StructureElement,
        ProductType: item.ProdType,
        JobAdviceCAB: obj,
        PONumber: item.PONumber,
        UserName: this.loginService.GetGroupName(),
        UserType: this.loginService.GetUserType(),
        AddressCode: addresResponse
      };
      localStorage.setItem('ProcessData', JSON.stringify(data));
      sessionStorage.setItem('ProcessData', JSON.stringify(data));

      // await this.SetCreateDatainLocal(item.JobID);
    }
    //const newWindow: any = window.open(route, 'Product Details');
    let data = {
      customer: item.CustomerCode,
      project: item.ProjectCode,
      ordernumber: item.JobID,
      orderstatus: item.OrderStatus,
      ProductDetailsEdit: false,
      jobIds: this.createSharedService.JobIds,
      Transport: item.TransportMode,
      ScheduledProd: item.ScheduledProd,
      StructureElement: item.StructureElement,
      ProductType: item.ProdType,
      JobAdviceCAB: obj,
      PONumber: item.PONumber,
      UserName: this.loginService.GetGroupName(),
      UserType: this.loginService.GetUserType(),
      AddressCode: addresResponse
    };
    localStorage.setItem('ProcessData', JSON.stringify(data));
    sessionStorage.setItem('ProcessData', JSON.stringify(data));

    // await this.SetCreateDatainLocal(item.JobID);
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
    if (
      lStructureElement.includes('NONWBS') ||
      lStructureElement.includes('nonwbs')
    ) {
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
    localStorage.setItem(
      'CreateDataProcess',
      JSON.stringify(tempOrderSummaryList)
    );
    // this.router.navigate(['../order/createorder']);
  }

  getProductDetailsRoute(product: any) {
    let route = undefined;
    if (product == 'CAB') {
      route = '#/order/createorder/orderdetails';
    } else if (product == 'STANDARD-BAR') {
      route = '#/order/createorder/standardbarorder';
    } else if (product == 'STANDARD-MESH') {
      route = '#/order/createorder/standardmeshorder';
    } else if (product == 'COIL') {
      route = '#/order/createorder/coilproductsorder';
    } else if (product == 'COUPLER') {
      route = '#/order/createorder/Couplerheadorder';
    } else if (product == 'CORE-CAGE') {
      route = '#/order/createorder/Precage';
    } else if (product == 'PRE-CAGE') {
      route = '#/order/createorder/Precage';
    } else if (product == 'CUT-TO-SIZE-MESH') {
      route = '#/order/createorder/CtsMesh';
    } else if (product == 'BPC') {
      route = '#/order/createorder/bpc';
    } else if (product == 'STIRRUP-LINK-MESH') {
      route = '#/order/createorder/Beamlinkmeshorder';
    } else if (product == 'COLUMN-LINK-MESH') {
      route = '#/order/createorder/Columnlinkmeshorder';
    } else if (product == 'CARPET') {
      route = '#/order/createorder/CarpetOrder';
    }
    return route;
  }

  RouteToAmendment() {
    // this.createSharedService.selectedOrderNumber = item.JobID;
    // this.processsharedserviceService.ProcessCustomer = item.CustomerCode;
    // this.processsharedserviceService.ProcessProject = item.ProjectCode;
    //this.processsharedserviceService.setProductDetailsEditable(false);
    let route = this.getAmendmentRoute();

    // this.router.navigate([route]);

    // const timestamp = new Date().getTime();
    // const newWindow: any = window.open(route+'?timestamp=$'+timestamp, 'Product Details');

    const newWindow: any = window.open(route, 'Amendment Details');
    let data = {
      customer: this.selectedRow[0].CustomerCode,
      project: this.selectedRow[0].ProjectCode,
      // ordernumber: item.JobID,
      // ProductDetailsEdit: false
    };
    localStorage.setItem('AmendmentData', JSON.stringify(data));
  }
  getAmendmentRoute() {
    let route = undefined;
    route = '#/order/processorder/amendment';
    return route;
  }
  // async ValidateOrders() {
  //   if (confirm('Confirm to receive this order?')) {

  //     let sbContractObj = {
  //       CustomerCode: this.selectedRow[0].CustomerCode,
  //       ProjectCode: this.selectedRow[0].ProjectCode,
  //       JobID: this.selectedRow[0].JobID,
  //       ContractNo: this.ProcessOrderForm.controls.Contract.value.substr(0, 10),
  //       lSBWT: this.selectedRow[0].TotalSTDWeight,
  //       ProdType: this.selectedRow[0].ProdType,
  //       ProdTypeL2: this.selectedRow[0].ProdTypeDis
  //     }
  //     let obj = await this.CheckSBContract(sbContractObj);

  //     console.log('async result', obj)
  //     console.log('async result', obj)
  //   }
  // }

  async CheckSBContract(item: any): Promise<any> {
    try {
      const data = await this.orderService
        .CheckSBContract(
          item.CustomerCode,
          item.ProjectCode,
          item.JobID,
          item.ContractNo,
          item.lSBWT,
          item.ProdType,
          item.ProdTypeL2
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async checkDBBBSNo(item: any): Promise<any> {
    try {
      const data = await this.orderService
        .CheckBBSNo(
          item.CustomerCode,
          item.ProjectCode,
          item.JobID,
          item.StructureElement,
          item.ProdType,
          item.ScheduledProd,
          item.OrderSource,
          item.BBSNo
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async CheckContractSubmit(contract: any): Promise<any> {
    try {
      const data = await this.orderService.checkContract(contract).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async checkCustomShapeSubmit(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    StructureElement: any,
    OrderSource: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .CheckCustomShape(
          CustomerCode,
          ProjectCode,
          JobID,
          StructureElement,
          OrderSource
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async SendExceedContractEmailSubmit(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    ContractNo: any,
    OrderSource: any,
    ProdType: any,
    ProdTypeL2: any,
    TotalOrderWT: any,
    ContractCap: any
  ): Promise<any> {
    try {
      // CustomerCode: any, ProjectCode: any, JobID: number, ContractNo: any, OrderSource: any, ProdType: any, ProdTypeL2: any, TotalOrderWT: any, ContractCap: any
      const data = await this.orderService
        .SendExceedContractEmail(
          CustomerCode,
          ProjectCode,
          JobID,
          ContractNo,
          OrderSource,
          ProdType,
          ProdTypeL2,
          TotalOrderWT,
          ContractCap
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      alert(
        'Error to send the exceeded contract quota email, please prepare the email manually.'
      );
      return false;
    }
  }

  submitOrderStart() {
    // if (this.ProcessOrderForm.controls.wbs1.value.trim() == '') {
    //   alert('Invalid WBS1 selected. Please select a Block.');
    //   return;
    // } else if (this.ProcessOrderForm.controls.wbs2.value.trim() == '') {
    //   alert('Invalid WBS2 selected. Please select a Block.');
    //   return;
    // }

    /**
     * When button is pressed disable the submit button,
     * so that an order cannot be submitted again while the old process is still ongoing.
     */
    this.disableSubmit = true;

    if (this.selectedRow.length == 1) {
      this.ValidateOrder();
    } else if (this.selectedRow.length > 1) {
      this.ValidateOrderMulti();
    } else {
      alert('No Record Selected!!');
    }
  }
  async ValidateOrder() {
    // document.getElementById("order_submit").disabled = true;

    // var lRowNo = pGrid.getSelectedRows([0])[0];

    this.ProcessOrderLoading = true;

    var lJobID = this.selectedRow[0].JobID;
    var lOrderSource = this.selectedRow[0].OrderSource;
    var lProdType = this.selectedRow[0].ProdType;
    var lStructureEle = this.selectedRow[0].StructureElement;
    var lScheduledProd = this.selectedRow[0].ScheduledProd;

    var lPODate = this.selectedRow[0].PODate;
    var lProdTypeL2 = this.selectedRow[0].ProdTypeDis;

    var lCustomerGrid = this.selectedRow[0].CustomerCode;
    var lProjectGrid = this.selectedRow[0].ProjectCode;

    var lJobIDForm = this.selectedRow[0].JobID;

    // var lCustomerA = document.getElementById("pr_customer").value.split("(");
    // //var lCustomerA = pGrid.getDataItem(pRowNo).CustomerCode.split("(");
    // var lCustomer = "";
    // if (lCustomerA.length > 0) {
    //   lCustomer = lCustomerA[lCustomerA.length - 1].substr(0, lCustomerA[lCustomerA.length - 1].length - 1);
    // }
    // var lProjectA = document.getElementById("pr_project").value.split("(");
    // //var lProjectA = pGrid.getDataItem(pRowNo).ProjectCode.split("(");
    // var lProject = "";
    // if (lProjectA.length > 0) {
    //   lProject = lProjectA[lProjectA.length - 1].substr(0, lProjectA[lProjectA.length - 1].length - 1);
    // }
    var lCustomer = this.selectedRow[0].CustomerCode;
    var lProject = this.selectedRow[0].ProjectCode;

    if (
      lCustomerGrid != lCustomer ||
      lProjectGrid != lProject ||
      lJobIDForm != lJobID
    ) {
      alert(
        'The selected order does not match with details. Please re-select.'
      );
      // document.getElementById("order_submit").disabled = false;
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }

    if (
      (lProdType == 'Rebar' &&
        lProdTypeL2 != 'Standard Bar' &&
        lProdTypeL2 != 'STANDARD-BAR') ||
      (lProdType == 'CAB' && lProdTypeL2 != 'STANDARD-BAR')
    ) {
      const responseCheckCustomShape = await this.checkCustomShapeSubmit(
        lCustomer,
        lProject,
        lJobID,
        lStructureEle,
        lOrderSource
      );
      if (responseCheckCustomShape == true) {
        alert(
          'The order includes customer shape. Please ask Planning to amend the order.'
        );
        this.ProcessOrderLoading = false;
        // document.getElementById("order_submit").disabled = false;
        this.disableSubmit = false;
        return;
      }
    }

    //confirm the process
    var r = confirm('Confirm to receive this order?');
    this.ProcessOrderLoading = true;
    if (r != true) {
      // document.getElementById("order_submit").disabled = false;
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }

    var lContract = this.ProcessOrderForm.controls.Contract.value.substr(0, 10);
    if (lContract == 'SPOT ORDER') {
      lContract = '';
    } else {
      if (lContract == null || lContract == '') {
        alert('There is no contract available for the project. ');
        // document.getElementById("order_submit").disabled = false;
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }
      const responseCheckContract = await this.CheckContractSubmit(lContract);
      if (responseCheckContract == false) {
        alert(
          'Process failed. Please check your Internet connection, the order process status and process it again. '
        );
      } else {
        if (responseCheckContract.noexpired == false) {
          if (
            !confirm(
              'The contract has been expired. Continue to submit the process?'
            )
          ) {
            // document.getElementById("order_submit").disabled = false;
            this.ProcessOrderLoading = false;
            this.disableSubmit = false;
            return;
          }
        }
      }
    }

    var lCashPayment = 'N';

    //Check contract tonnage for BS

    if (
      (lProdType == 'Rebar' ||
        lProdType == 'CAB' ||
        lProdType == 'Standard MESH' ||
        lProdType == 'STANDARD-BAR' ||
        lProdType == 'STANDARD-MESH' ||
        lProdType == 'COIL') &&
      lCashPayment == 'N' &&
      lContract != '' &&
      lContract != 'SPOT ORDER'
    ) {
      var lSBWT = 0;
      var lProdTypeL2Ctr = lProdTypeL2;
      if (lProdType == 'Rebar' || lProdType == 'CAB') {
        if (isNaN(this.selectedRow[0].TotalSTDWeight) == false) {
          lSBWT = parseFloat(this.selectedRow[0].TotalSTDWeight);
          lProdTypeL2Ctr = 'REBAR';
        }
      } else {
        //lSBWT = parseFloat(this.selectedRow[0].TotalWeight);
        lSBWT = parseFloat(this.selectedRow[0].TotalWeight);
      }
      if (lSBWT > 0) {
        var lReturn = true;

        var lJobID = this.selectedRow[0].JobID;

        // CHECK CheckSBContract
        let sbContractObj = {
          CustomerCode: this.selectedRow[0].CustomerCode,
          ProjectCode: this.selectedRow[0].ProjectCode,
          JobID: this.selectedRow[0].JobID,
          ContractNo: this.ProcessOrderForm.controls.Contract.value.substr(
            0,
            10
          ),
          lSBWT: lSBWT,
          ProdType: this.selectedRow[0].ProdType,
          ProdTypeL2: lProdTypeL2Ctr,
        };

        // API CALL
        // API CALL
        const responsesbContract = await this.CheckSBContract(sbContractObj);
        if (!responsesbContract) {
          // document.getElementById("order_submit").disabled = false;
          alert(responsesbContract.responseText);
          lReturn = false;
        } else {
          if (responsesbContract.success == false) {
            alert(responsesbContract.errorMessage);
            lReturn = false;
          }else{
            if (responsesbContract.excess == true) {
              // document.getElementById("order_submit").disabled = false;
              let lExcess =
                'The MTS total order tonnage ' +
                Number(responsesbContract.totalWeight).toFixed(3) +
                ' (including current order: ' +
                Number(lSBWT).toFixed(3) +
                ') has been exceeded contract tonnage ' +
                Number(responsesbContract.contractCap).toFixed(3) +
                '. Please contact sales person to increase the contract tonnage. Click <OK> button to send information email to Sales Dept automatically.';

              this.confirmExcess(
                lExcess,
                responsesbContract,
                lCustomer,
                lProject,
                lJobID,
                lContract,
                lOrderSource,
                lProdType,
                lProdTypeL2
              );
              
              lReturn = false;
            }
          }
        }
        if (lReturn == false) {
          // document.getElementById("order_submit").disabled = false;
          this.ProcessOrderLoading = false;
          this.disableSubmit = false;
          return;
        }
      }
    }

    if (
      (lProdType == 'Rebar' &&
        lProdTypeL2 != 'Standard Bar' &&
        lProdTypeL2 != 'STANDARD-BAR') ||
      (lProdType == 'CAB' && lProdTypeL2 != 'STANDARD-BAR')
    ) {
      var lDataLen = this.selectedRow.length;
      if (lDataLen > 0) {
        var lBBSNos = ' ';
        for (let i = 0; i < lDataLen; i++) {
          if (this.selectedRow[i].BBSNo.trim() == '') {
            // document.getElementById("order_submit").disabled = false;
            alert('Empty BBSNo detected.');
            this.ProcessOrderLoading = false;
            this.disableSubmit = false;

            return;
          }
          if (lBBSNos == ' ') lBBSNos = this.selectedRow[i].BBSNo;
          else lBBSNos = lBBSNos + ',' + this.selectedRow[i].BBSNo;

          let obj = {
            CustomerCode: this.selectedRow[i].CustomerCode,
            ProjectCode: this.selectedRow[i].ProjectCode,
            JobID: this.selectedRow[i].JobID,
            StructureElement: this.selectedRow[i].StructureElement,
            ProdType: this.selectedRow[i].ProdType,
            ScheduledProd: this.selectedRow[i].ScheduledProd,
            OrderSource: this.selectedRow[i].OrderSource,
            BBSNo: lBBSNos,
          };

          // API CALL
          var lDBBSNos: any = await this.checkDBBBSNo(obj);
          lDBBSNos = lDBBSNos.BBSNo;
          if (lDBBSNos) {
            if (lDBBSNos.length > 0) {
              //if (!confirm("Duplicated BBSNo detected. Continue to submit the process?")) {
              // document.getElementById("order_submit").disabled = false;
              alert('Duplicated BBSNo detected');
              this.ProcessOrderLoading = false;
              this.disableSubmit = false;

              return;
              //}
            }
          }
        }
      }
    }

    //Verify user entry
    var lReqDateFrom = this.ProcessOrderForm.controls.ReqDate.value; //document.getElementById("pr_required_date_from").value;
    var lReqDateTo = this.ProcessOrderForm.controls.UpdateReqDate.value; //document.getElementById("pr_required_date_to").value;
    if (lReqDateFrom != null && lReqDateTo != null) {
      var lReqDateFrom1 = new Date(lReqDateFrom);
      var lReqDateTo1 = new Date(lReqDateTo);
      // if (
      //   lReqDateFrom1 <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      // ) {
      //   // document.getElementById("order_submit").disabled = false;
      //   alert('Invalid Original Required Date');
      //   this.ProcessOrderLoading = false;
      //   this.disableSubmit = false;

      //   return;
      // }
      if (lReqDateTo1 <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000)) {
        // document.getElementById("order_submit").disabled = false;
        alert('Invalid Updated Required Date');
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;

        return;
      }
      // if (lReqDateTo1 < lReqDateFrom1) {
      //   // document.getElementById("order_submit").disabled = false;
      //   alert('Invalid Required Date Range');
      //   this.ProcessOrderLoading = false;
      //   this.disableSubmit = false;
      //   return;
      // }
    } else {
      // document.getElementById("order_submit").disabled = false;
      alert('Invalid Required Date Range.');
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }

    //verify WBS
    if (
      lStructureEle != 'NONWBS' &&
      ((lProdType == 'Rebar' &&
        lProdTypeL2 != 'Standard Bar' &&
        lProdTypeL2 != 'STANDARD-BAR') ||
        (lProdType == 'CAB' && lProdTypeL2 != 'STANDARD-BAR') ||
        lProdType == 'PRE-CAGE' ||
        lProdType == 'CARPET' ||
        lProdType == 'CORE-CAGE' ||
        lProdType == 'CUT-TO-SIZE-MESH' ||
        lProdType == 'STIRRUP-LINK-MESH' ||
        lProdType == 'COLUMN-LINK-MESH' ||
        lProdType == 'ACS')
    ) {
      var lWBS1 = this.ProcessOrderForm.controls.wbs1.value;
      var lWBS2 = this.ProcessOrderForm.controls.wbs2.value; //document.getElementById("pr_wbs2").value;
      var lWBS3 = this.ProcessOrderForm.controls.wbs3.value; //document.getElementById("pr_wbs3").value;
      if (lWBS1 == null) lWBS1 = '';
      if (lWBS2 == null) lWBS2 = '';
      if (lWBS3 == null) lWBS3 = '';
      lWBS1 = lWBS1.trim();
      lWBS2 = lWBS2.trim();
      lWBS3 = lWBS3.trim();

      if (lWBS1.length == 0) {
        // document.getElementById("order_submit").disabled = false;
        alert('Invalid WBS1 selected. Please select a Block.');
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }

      if (lWBS2.length == 0) {
        // document.getElementById("order_submit").disabled = false;
        alert('Invalid WBS2 selected. Please select a Storey.');
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }

      var lSelect = document.getElementById('pr_wbs3');
      // if (lSelect.options.length > 0) {
      //   var lFound = 0;
      //   for (i = 0; i < lSelect.options.length; i++) {
      //     var lText = lSelect.options[i].text;
      //     if (lText == null) lText = "";
      //     lText = lText.trim();

      //     if (lText.length == 0) {
      //       lFound = 1;
      //       break;
      //     }
      //   }
      //   if (lFound != 1 && lWBS3.length == 0) {
      //     document.getElementById("order_submit").disabled = false;
      //     alert("Invalid WBS3 selected. Please select a Part.");
      // this.ProcessOrderLoading = false;
      //     return ;
      //   }
      // }
    }

    if (
      (lProdType == 'Rebar' &&
        lProdTypeL2 != 'Standard Bar' &&
        lProdTypeL2 != 'STANDARD-BAR') ||
      (lProdType == 'CAB' && lProdTypeL2 != 'STANDARD-BAR')
    ) {
      // gridBBS.getEditorLock().commitCurrentEdit();
      for (let i = 0; i < this.OrderDetailsList_BBS.length; i++) {
        this.SaveBBS(this.OrderDetailsList_BBS[i]);
      }
    }

    if (lProdType == 'BPC' && lScheduledProd != 'Y') {
      let BPCData = this.OrderDetailsList_BPC;
      if (BPCData.length > 0) {
        for (let i = 0; i < BPCData.length; i++) {
          var lBPCReqDate = BPCData[i].required_date;
          var lBPCDate = new Date(lBPCReqDate);
          if (lBPCDate) {
            if (
              lBPCDate <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
            ) {
              // document.getElementById("order_submit").disabled = false;
              this.disableSubmit = true;
              alert('Invalid Required Date in BPC Loading details');
              this.ProcessOrderLoading = false;
              return;
            }
          }
        }
      } else {
        // document.getElementById("order_submit").disabled = false;
        this.disableSubmit = true;
        alert('Invalid data in BPC loading details');
        this.ProcessOrderLoading = false;
        return;
      }
      await this.SaveBPCData();
    }

    // Validate GreenSteel Selection
    if (!this.ValidateGreenSteel()) {
      this.ProcessOrderLoading = false;
      return;
    }

    console.log('Submit Order');
    await this.SubmitProcessOrder();
  }

  async ValidateOrderMulti() {
    // document.getElementById("order_submit").disabled = true;

    //Check multiple process condition - same project, same product type, and JobID
    // var this.selectedRow = pGrid.getSelectedRows();

    this.ProcessOrderLoading = true;

    var lFound = 0;
    var lJobFound = 0;

    var lCustomerA = this.ProcessOrderForm.controls.customer.value;
    var lCustomer = '';
    if (lCustomerA.length > 0) {
      lCustomer = lCustomerA[lCustomerA.length - 1].substr(
        0,
        lCustomerA[lCustomerA.length - 1].length - 1
      );
    }
    var lProjectA = this.ProcessOrderForm.controls.project.value;
    var lProject = '';
    if (lProjectA.length > 0) {
      lProject = lProjectA[lProjectA.length - 1].substr(
        0,
        lProjectA[lProjectA.length - 1].length - 1
      );
    }

    lCustomer = this.selectedRow[0].CustomerCode;
    lProject = this.selectedRow[0].ProjectCode;
    var lJobIDForm = this.selectedRow[0].JobID;
    var lProdType = this.selectedRow[0].ProdType;
    var lProdTypeL2 = this.selectedRow[0].ProdTypeDis;
    var lStructureEle = this.selectedRow[0].StructureElement;
    var lScheduledProd = this.selectedRow[0].ScheduledProd;
    var lOrderStatus = this.selectedRow[0].OrderStatus;
    var lScheduledProd = this.selectedRow[0].ScheduledProd;

    if (lProdType == 'BPC' && lScheduledProd != 'Y') {
      alert(
        'Cannot group Non-Scheduled BPC orders togather for batch process. Please process them individually. '
      );
      // document.getElementById("order_submit").disabled = false;
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }
    if (
      lProdType == 'CUT-TO-SIZE-MESH' ||
      lProdType == 'STIRRUP-LINK-MESH' ||
      lProdType == 'COLUMN-LINK-MESH' ||
      lProdType == 'MESH'
    ) {
      lProdType = 'MESH';
    }

    var lWBS1 = this.ProcessOrderForm.controls.wbs1.value; // document.getElementById("pr_wbs1").value;
    var lWBS2 = this.ProcessOrderForm.controls.wbs2.value; //document.getElementById("pr_wbs2").value;
    var lWBS3 = this.ProcessOrderForm.controls.wbs3.value; //document.getElementById("pr_wbs3").value;
    if (lWBS1 == null) lWBS1 = '';
    if (lWBS2 == null) lWBS2 = '';
    if (lWBS3 == null) lWBS3 = '';
    lWBS1 = lWBS1.trim();
    lWBS2 = lWBS2.trim();
    lWBS3 = lWBS3.trim();

    for (let i = 0; i < this.selectedRow.length; i++) {
      if (lCustomer != this.selectedRow[i].CustomerCode) {
        alert(
          'Cannot group different customer orders togather for batch process.'
        );
        lFound = 1;
        break;
      }

      if (lProject != this.selectedRow[i].ProjectCode) {
        alert(
          'Cannot group different project orders togather for batch process.'
        );
        lFound = 1;
        break;
      }

      var lProdType1 = this.selectedRow[i].ProdType;
      if (
        lProdType1 == 'CUT-TO-SIZE-MESH' ||
        lProdType1 == 'STIRRUP-LINK-MESH' ||
        lProdType1 == 'COLUMN-LINK-MESH' ||
        lProdType1 == 'MESH'
      ) {
        lProdType1 = 'MESH';
      }

      if (lProdType != lProdType1) {
        alert(
          'Cannot group different product type orders togather for batch process.'
        );
        lFound = 1;
        break;
      }
      //if (lProdTypeL2 != this.selectedRow[i].ProdTypeL2) {
      //    alert("Cannot group different product type orders togather for batch process.")
      //    lFound = 1;
      //    break;
      //}

      if (lOrderStatus != this.selectedRow[i].OrderStatus) {
        alert(
          'Cannot group different status of orders togather for batch process.'
        );
        lFound = 1;
        break;
      }

      var lScheduledProdA = this.selectedRow[i].ScheduledProd;

      if (lProdType == 'BPC' && lScheduledProdA != 'Y') {
        alert(
          'Cannot group Non-Scheduled BPC orders togather for batch process. Please process them individually. '
        );
        lFound = 1;
        break;
      }

      //var lWBS1a = this.selectedRow[i].WBS1;
      //if (lWBS1a == null) lWBS1a = "";
      //lWBS1a = lWBS1a.trim();
      //if (lWBS1 != lWBS1a) {
      //    alert("Cannot group different WBS1 Orders for batch process. Please process the order individually. " )
      //    lFound = 1;
      //    break;
      //}

      //var lWBS2a = this.selectedRow[i].WBS2;
      //if (lWBS2a == null) lWBS2a = "";
      //lWBS2a = lWBS2a.trim();
      //if (lWBS2 != lWBS2a) {
      //    alert("Cannot group different WBS2 Orders for batch process. Please process the order individually. ")
      //    lFound = 1;
      //    break;
      //}

      //var lWBS3a = this.selectedRow[i].WBS3;
      //if (lWBS3a == null) lWBS3a = "";
      //lWBS3a = lWBS3a.trim();
      //if (lWBS3 != lWBS3a) {
      //    alert("Cannot group different WBS3 Orders for batch process. Please process the order individually. ")
      //    lFound = 1;
      //    break;
      //}

      if (lJobIDForm == this.selectedRow[i].JobID) {
        lJobFound = 1;
      }
    }

    if (lFound == 1) {
      // document.getElementById("order_submit").disabled = false;
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }

    if (lJobFound == 0) {
      alert(
        'The selected orders does not match with details shown on screen. Please re-select.'
      );
      // document.getElementById("order_submit").disabled = false;
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }

    //Check Customer Shape for CAB
    if (
      (lProdType == 'Rebar' &&
        lProdTypeL2 != 'Standard Bar' &&
        lProdTypeL2 != 'STANDARD-BAR') ||
      (lProdType == 'CAB' && lProdTypeL2 != 'STANDARD-BAR')
    ) {
      for (let i = 0; i < this.selectedRow.length; i++) {
        // var lRowNo = this.selectedRow[i];
        var lOrderSource = this.selectedRow[i].OrderSource;
        var lStructureEle = this.selectedRow[i].StructureElement;
        var lJobID = this.selectedRow[i].JobID;

        //API CALL
        const reponseUstomShape = await this.checkCustomShapeSubmit(
          lCustomer,
          lProject,
          lJobID,
          lStructureEle,
          lOrderSource
        );
        if (reponseUstomShape == true) {
          alert(
            'The order includes customer shape. Please ask Planning to amend the order.'
          );
          // document.getElementById("order_submit").disabled = false;
          this.ProcessOrderLoading = false;
          this.disableSubmit = false;
          return;
        }
      }
    }

    var lCashPayment = 'N';

    //Check Contract expiry
    var lContract = this.ProcessOrderForm.controls.Contract.value.substr(0, 10);
    if (lContract == 'SPOT ORDER') {
      lContract = '';
    } else {
      if (lContract == null || lContract == '') {
        alert('There is no contract available for the project. ');
        // document.getElementById("order_submit").disabled = false;
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }

      // API CALL
      const responseCheckContract = await this.CheckContractSubmit(lContract);
      if (responseCheckContract.noexpired == false) {
        if (
          !confirm(
            'The contract has been expired. Continue to submit the process?'
          )
        ) {
          // document.getElementById("order_submit").disabled = false;
          this.ProcessOrderLoading = false;
          this.disableSubmit = false;
          return;
        }
      }
    }

    //Check MTS Order contract quata
    if (
      (lProdType == 'Rebar' ||
        lProdType == 'CAB' ||
        lProdType == 'Standard MESH' ||
        lProdType == 'STANDARD-BAR' ||
        lProdType == 'STANDARD-MESH' ||
        lProdType == 'COIL') &&
      lCashPayment == 'N' &&
      lContract != ''
    ) {
      var lSBWT = 0;
      var lProdTypeL2Ctr = lProdTypeL2;
      for (let i = 0; i < this.selectedRow.length; i++) {
        if (lProdType == 'Rebar' || lProdType == 'CAB') {
          if (isNaN(this.selectedRow[i].TotalSTDWeight) == false) {
            lSBWT = lSBWT + parseFloat(this.selectedRow[i].TotalSTDWeight);
            lProdTypeL2Ctr = 'REBAR';
          }
        } else {
          //lSBWT = parseFloat(this.selectedRow[0].TotalWeight);
          lSBWT = lSBWT + parseFloat(this.selectedRow[i].TotalWeight);
        }
      }
      if (lSBWT > 0) {
        var lReturn = true;
        var lJobID = this.selectedRow[0].JobID;

        // CHECK CheckSBContract
        let sbContractObj = {
          CustomerCode: this.selectedRow[0].CustomerCode,
          ProjectCode: this.selectedRow[0].ProjectCode,
          JobID: this.selectedRow[0].JobID,
          ContractNo: this.ProcessOrderForm.controls.Contract.value.substr(
            0,
            10
          ),
          lSBWT: lSBWT,
          ProdType: this.selectedRow[0].ProdType,
          ProdTypeL2: lProdTypeL2Ctr,
        };

        // API CALL
        const responsesbContract = await this.CheckSBContract(sbContractObj);

        if (!responsesbContract) {
          // document.getElementById("order_submit").disabled = false;
          alert(responsesbContract.responseText);
          lReturn = false;
        } else {
          if (responsesbContract.success == false) {
            alert(responsesbContract.errorMessage);
            lReturn = false;
          } else {
            if (responsesbContract.excess == true) {
              // document.getElementById("order_submit").disabled = false;
              let lExcess =
                'The MTS total order tonnage ' +
                Number(responsesbContract.totalWeight).toFixed(3) +
                ' (including current order: ' +
                Number(lSBWT).toFixed(3) +
                ') has been exceeded contract tonnage ' +
                Number(responsesbContract.contractCap).toFixed(3) +
                '. Please contact sales person to increase the contract tonnage. Click <OK> button to send information email to Sales Dept automatically.';

              this.confirmExcess(
                lExcess,
                responsesbContract,
                lCustomer,
                lProject,
                lJobID,
                lContract,
                lOrderSource,
                lProdType,
                lProdTypeL2
              );
              
              lReturn = false;
            }
          }
        }
        if (lReturn == false) {
          // document.getElementById("order_submit").disabled = false;
          this.ProcessOrderLoading = false;
          this.disableSubmit = false;
          return;
        }
      }
    }

    //Check Duplicated BBS No.
    if (
      (lProdType == 'Rebar' &&
        lProdTypeL2 != 'Standard Bar' &&
        lProdTypeL2 != 'STANDARD-BAR') ||
      (lProdType == 'CAB' && lProdTypeL2 != 'STANDARD-BAR')
    ) {
      for (let i = 0; i < this.selectedRow.length; i++) {
        var lBBSNoA = this.selectedRow[i].BBSNo;
        let obj = {
          CustomerCode: this.selectedRow[i].CustomerCode,
          ProjectCode: this.selectedRow[i].ProjectCode,
          JobID: this.selectedRow[i].JobID,
          StructureElement: this.selectedRow[i].StructureElement,
          ProdType: this.selectedRow[i].ProdType,
          ScheduledProd: this.selectedRow[i].ScheduledProd,
          OrderSource: this.selectedRow[i].OrderSource,
          BBSNo: this.selectedRow[i].BBSNo,
        };

        // API CALL
        var lBBSNoA: any = await this.checkDBBBSNo(obj);
        lBBSNoA = lBBSNoA.BBSNo;
        if (lBBSNoA) {
          if (lBBSNoA.length > 0) {
            //if (!confirm("Duplicated BBSNo detected. Continue to submit the process?")) {
            // document.getElementById("order_submit").disabled = false;
            alert(
              'Duplicated BBSNo detected, ' +
                lBBSNoA +
                '. Please process the order individually. '
            );
            this.ProcessOrderLoading = false;
            this.disableSubmit = false;
            return;
            //}
          }
        }
      }
    }

    //verify WBS
    if (
      lStructureEle != 'NONWBS' &&
      ((lProdType == 'Rebar' &&
        lProdTypeL2 != 'Standard Bar' &&
        lProdTypeL2 != 'STANDARD-BAR') ||
        (lProdType == 'CAB' && lProdTypeL2 != 'STANDARD-BAR') ||
        lProdType == 'PRE-CAGE' ||
        lProdType == 'CARPET' ||
        lProdType == 'CORE-CAGE' ||
        lProdType == 'CUT-TO-SIZE-MESH' ||
        lProdType == 'STIRRUP-LINK-MESH' ||
        lProdType == 'COLUMN-LINK-MESH' ||
        lProdType == 'ACS')
    ) {
      var lWBS1 = this.ProcessOrderForm.controls.wbs1.value;
      var lWBS2 = this.ProcessOrderForm.controls.wbs2.value; //document.getElementById("pr_wbs2").value;
      var lWBS3 = this.ProcessOrderForm.controls.wbs3.value; //document.getElementById("pr_wbs3").value;
      if (lWBS1 == null) lWBS1 = '';
      if (lWBS2 == null) lWBS2 = '';
      if (lWBS3 == null) lWBS3 = '';
      lWBS1 = lWBS1.trim();
      lWBS2 = lWBS2.trim();
      lWBS3 = lWBS3.trim();

      if (lWBS1.length == 0) {
        // document.getElementById("order_submit").disabled = false;
        alert('Invalid WBS1 selected. Please select a Block.');
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }

      if (lWBS2.length == 0) {
        // document.getElementById("order_submit").disabled = false;
        alert('Invalid WBS2 selected. Please select a Storey.');
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }

      // var lSelect = this.ProcessOrderForm.controls.wbs3.value;
      // if (lSelect.options.length > 0) {
      //   var lFound = 0;
      //   for (let i = 0; i < lSelect.options.length; i++) {
      //     var lText = lSelect.options[i].text;
      //     if (lText == null) lText = "";
      //     lText = lText.trim();

      //     if (lText.length == 0) {
      //       lFound = 1;
      //       break;
      //     }
      //   }
      //   if (lFound != 1 && lWBS3.length == 0) {
      //     // document.getElementById("order_submit").disabled = false;
      //     alert("Invalid WBS3 selected. Please select a Part.");
      //     return;
      //   }
      // }
    }

    //Verify user entry
    var lReqDateFrom = this.ProcessOrderForm.controls.ReqDate.value; //document.getElementById("pr_required_date_from").value;
    var lReqDateTo = this.ProcessOrderForm.controls.UpdateReqDate.value; //document.getElementById("pr_required_date_to").value;
    if (lReqDateFrom != null && lReqDateTo != null) {
      var lReqDateFrom1 = new Date(lReqDateFrom);
      var lReqDateTo1 = new Date(lReqDateTo);
      // if (
      //   lReqDateFrom1 <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      // ) {
      //   // document.getElementById("order_submit").disabled = false;
      //   alert('Invalid Original Required Date');
      //   this.ProcessOrderLoading = false;
      //   this.disableSubmit = false;
      //   return;
      // }
      if (lReqDateTo1 <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000)) {
        // document.getElementById("order_submit").disabled = false;
        alert('Invalid Updated Required Date');
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }
      // if (lReqDateTo1 < lReqDateFrom1) {
      //   // document.getElementById("order_submit").disabled = false;
      //   alert('Invalid Required Date Range');
      //   this.ProcessOrderLoading = false;
      //   this.disableSubmit = false;
      //   return;
      //}
    } else {
      // document.getElementById("order_submit").disabled = false;
      alert('Invalid Required Date Range.');
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }

    //confirm the process
    var r = confirm(
      'Batch receiving will not change any original data, such as required date, PO number, or WBS. Confirm to batch receive the selected ' +
        this.selectedRow.length +
        ' orders?'
    );
    if (r != true) {
      // document.getElementById("order_submit").disabled = false;
      this.ProcessOrderLoading = false;
      this.disableSubmit = false;
      return;
    }

    // lMTSOrders = [];
    // lMTSJobIDs = [];
    // startLoading();

    // Validate GreenSteel Selection
    if (!this.ValidateGreenSteel()) {
      return;
    }

    console.log('Submit Order');
    await this.SubmitProcessOrder();
  }

  getIntExtRemarks(pRow: any) {
    //Make int/ext Remarks
    var lRemarks = '';
    var lDelAddr = pRow.DeliveryAddress.toUpperCase();
    var lEngName = pRow.SiteEngr_Name.toUpperCase();
    var lEngMobile = pRow.SiteEngr_HP.toUpperCase();
    var lSchName = pRow.Scheduler_Name.toUpperCase();
    var lSchMobile = pRow.Scheduler_HP.toUpperCase();

    if (lDelAddr == null) {
      lDelAddr = '';
    }
    lDelAddr = lDelAddr.trim();

    if (lEngName == null) {
      lEngName = '';
    }
    lEngName = lEngName.trim();

    if (lEngMobile == null) {
      lEngMobile = '';
    }
    lEngMobile = lEngMobile.trim();

    if (lSchName == null) {
      lSchName = '';
    }
    lSchName = lSchName.trim();

    if (lSchMobile == null) {
      lSchMobile = '';
    }
    lSchMobile = lSchMobile.trim();

    //Special remarks
    if (pRow.Remarks != null && pRow.Remarks.trim() != '') {
      lRemarks = pRow.Remarks.trim();
    }
    //Good receiver
    if (lEngName != null && lEngName != '') {
      if (lRemarks == '') {
        lRemarks = '*' + lEngName;
      } else {
        lRemarks = lRemarks + ' /*' + lEngName;
      }
      if (lEngMobile != '') {
        lRemarks = lRemarks + ' ' + lEngMobile;
      }
    }
    //Site Contact
    if (lSchName != null && lSchName != '' && lSchName != lEngName) {
      if (lEngName == null || lEngName == '') {
        if (lRemarks == '') {
          lRemarks = '*' + lSchName;
        } else {
          lRemarks = lRemarks + ' /*' + lSchName;
        }
      } else {
        if (lRemarks == '') {
          lRemarks = '*' + lSchName;
        } else {
          lRemarks = lRemarks + '/' + lSchName;
        }
      }

      if (lSchMobile != '') {
        lRemarks = lRemarks + ' ' + lSchMobile;
      }
      lRemarks = lRemarks + '*';
    } else {
      if (lEngName != null && lEngName != '') {
        lRemarks = lRemarks + '*';
      }
    }
    // delivery address
    if (lDelAddr != null && lDelAddr != '') {
      if (lRemarks == '') {
        lRemarks = lRemarks + lDelAddr;
      } else {
        if (lRemarks.substring(lRemarks.length - 1) == '*') {
          lRemarks = lRemarks + '/ ' + lDelAddr;
        } else {
          lRemarks = lRemarks + ' / ' + lDelAddr;
        }
      }
    }

    if (lRemarks.length > 100) {
      lRemarks = lRemarks.substring(0, 100);
    }

    // Add transport mode
    var lTrnMode = pRow.TransportMode;
    if (
      lTrnMode == 'SC' &&
      //lRemarks.indexOf('SELF COLLECTION') < 0 &&
      lRemarks.indexOf('{SC}') < 0
    ) {
      lRemarks = '{SC} ' + lRemarks;
    } else if (lTrnMode.indexOf('HC') >= 0 && lRemarks.indexOf('{LCO}') < 0) {
      lRemarks = '{LCO} ' + lRemarks;
    } else if (
      lTrnMode.indexOf('LB') >= 0 &&
      lTrnMode.indexOf('LBE') < 0 &&
      // lRemarks.indexOf('{LOW BED}') < 0 &&
      lRemarks.indexOf('{LB}') < 0
    ) {
      lRemarks = '{LB} ' + lRemarks;
    } else if (
      lTrnMode.indexOf('LBE') >= 0 &&
      lRemarks.indexOf('{ESCORTED}') < 0
    ) {
      lRemarks = '{ESCORTED} ' + lRemarks;
    }

    if (lRemarks.length > 100) {
      lRemarks = lRemarks.substring(0, 100);
    }

    return lRemarks;
  }

  async SubmitProcessOrder() {
    let lMTSJobIDs: any[] = [];
    let lMTSOrders: any[] = [];

    var lCustomerCode = this.selectedRow[0].CustomerCode;
    var lProjectCode = this.selectedRow[0].ProjectCode;
    var lJobIDForm = this.selectedRow[0].JobID;
    var lProdType = this.selectedRow[0].ProdType;
    var lProdTypeL2 = this.selectedRow[0].ProdTypeDis;
    var lStructureEle = this.selectedRow[0].StructureElement;
    var lScheduledProd = this.selectedRow[0].ScheduledProd;
    var lOrderStatus = this.selectedRow[0].OrderStatus;
    var lScheduledProd = this.selectedRow[0].ScheduledProd;
    var lOrderSource = this.selectedRow[0].OrderSource;

    for (let i = 0; i < this.selectedRow.length; i++) {
      // let i = this.currSubmitRow;

      /**
       * For usual submission, pick values from the input fields, instead of table data.
       */
      let lReqDateFrom = this.datePipe.transform(
        this.ProcessOrderForm.controls.ReqDate.value,
        'yyyy-MM-dd',
        'UTC+8'
      );
      let lReqDateTo = this.datePipe.transform(
        this.ProcessOrderForm.controls.UpdateReqDate.value,
        'yyyy-MM-dd',
        'UTC+8'
      );
      let lPONumber = this.ProcessOrderForm.controls.ponumber.value;
      let lWBS1 = this.ProcessOrderForm.controls.wbs1.value;
      let lWBS2 = this.ProcessOrderForm.controls.wbs2.value;
      let lWBS3 = this.ProcessOrderForm.controls.wbs3.value;
      let lIntRemarks = this.InternalRemarks;
      let lExtRemarks = this.ExternalRemarks;

      /**
       * Update the following parameters with table data in case multiple records are selected.
       * Dated: 30-07-2024
       */
      if (this.selectedRow.length > 1) {
        lReqDateFrom = this.datePipe.transform(
          this.selectedRow[i].OrigReqDate,
          'yyyy-MM-dd',
          'UTC+8'
        );
        lReqDateTo = this.datePipe.transform(
          this.selectedRow[i].RequiredDate,
          'yyyy-MM-dd',
          'UTC+8'
        );
        lPONumber = this.selectedRow[i].PONumber;
        lWBS1 = this.selectedRow[i].WBS1;
        lWBS2 = this.selectedRow[i].WBS2;
        lWBS3 = this.selectedRow[i].WBS3;

        let lRemarks: any = this.getIntExtRemarks(this.selectedRow[i]);
        lIntRemarks = lRemarks.replace(/\*/g, '', '');
        lExtRemarks = lRemarks;
      }

      let obj: SubmitProcessModel = {
        CustomerCode: this.selectedRow[0].CustomerCode,
        ProjectCode: this.selectedRow[0].ProjectCode,
        ContractNo: this.ProcessOrderForm.controls.Contract.value.split(' ')[0],
        ProdType: this.selectedRow[i].ProdType,
        JobID: this.selectedRow[i].JobID,
        CashPayment: 'N',
        CABFormer: 'Standard',
        ShipToParty: this.ProcessOrderForm.controls.Address.value,
        ProjectStage:
          this.ProcessOrderForm.controls.ProjectStage.value.split('-')[0],
        ReqDateFrom: lReqDateFrom,
        ReqDateTo: lReqDateTo,
        PONumber: lPONumber,
        PODate: this.datePipe.transform(
          this.selectedRow[i].PODate,
          'yyyy-MM-dd',
          'UTC+8'
        ),
        WBS1: lWBS1, // this.ProcessOrderForm.controls.wbs1.value,
        WBS2: lWBS2, // this.ProcessOrderForm.controls.wbs2.value,
        WBS3: lWBS3, // this.ProcessOrderForm.controls.wbs3.value,
        VehicleType: this.selectedRow[i].TransportMode, //VehicleType.value.split('-')[0],
        UrgentOrder: this.ProcessorderCheckbox.controls.UrgentOrder.value,
        Conquas: this.ProcessorderCheckbox.controls.Conquas.value,
        Crane: this.ProcessorderCheckbox.controls.Crane.value,
        PremiumService: this.ProcessorderCheckbox.controls.PremiumService.value,
        ZeroTol: this.ProcessorderCheckbox.controls.ZeroTol.value,
        CallBDel: this.ProcessorderCheckbox.controls.CallBDel.value,
        DoNotMix: this.ProcessorderCheckbox.controls.DoNotMix.value,
        SpecialPass: this.ProcessorderCheckbox.controls.SpecialPass.value,
        VehLowBed: this.ProcessorderCheckbox.controls.VehLowBed.value,
        Veh50Ton: this.ProcessorderCheckbox.controls.Veh50Ton.value,
        Borge: this.ProcessorderCheckbox.controls.Borge.value,
        PoliceEscort: this.ProcessorderCheckbox.controls.PoliceEscort.value,
        TimeRange: this.ProcessorderCheckbox.controls.TimeRange.value,
        IntRemarks: lIntRemarks,
        ExtRemarks: lExtRemarks,
        OrderSource: this.selectedRow[i].OrderSource,
        StructureElement: this.selectedRow[i].StructureElement,
        ScheduledProd: this.selectedRow[i].ScheduledProd,
        OrderType: this.ProcessOrderForm.controls.OrderType.value,
        InvRemarks: this.InvoiceRemarks ? this.InvoiceRemarks : '',
        FabricateESM: this.ProcessorderCheckbox.controls.FabricateESM.value,
        UserName: this.loginService.GetGroupName(),
        UserType: this.loginService.GetUserType(),
        IsGreensteel: this.gGreenSteelSelection ? 'Y' : 'N',
      };

      if (obj.ContractNo.includes('SPOT')) {
        obj.ContractNo = '';
      }

      /**
       * Update Internal Remarks for Coupler before submitting.
       * Date: 05-06-2024
       */
      if (this.selectedRow[i].ProdTypeDis == 'COUPLER') {
        if (obj.IntRemarks.length > 87) {
          obj.IntRemarks = obj.IntRemarks.substring(0, 87);
        }
      }

      const sor = await this.SubmitOrder(obj);
      console.log('SOR Result', sor);
      if (sor) {
        let lJobID = this.selectedRow[i].JobID;

        if (sor.success == false) {
          alert(sor.message);
          this.ProcessOrderLoading = false;
          if (
            lProdType == 'Rebar' ||
            lProdType == 'CAB' ||
            lProdType == 'STANDARD-BAR'
          ) {
            if (
              lProdTypeL2 == 'Standard Bar' ||
              lProdTypeL2 == 'STANDARD-BAR'
            ) {
              this.getBBSBar(
                lCustomerCode,
                lProjectCode,
                lJobID,
                lOrderSource,
                lStructureEle,
                lProdType,
                lScheduledProd
              );
            } else {
              this.GetBBSProcess(
                lCustomerCode,
                lProjectCode,
                lJobID,
                lOrderSource,
                lStructureEle,
                lProdType,
                lScheduledProd
              );
            }
          }
          return;
        }

        // STEP 1. Update SOR NO in Table
        this.selectedRow[i].SORNo = sor.message;
        this.selectedRow[i].SORNoDis = sor.message;

        // STEP 2. Update OrderStatus in Table
        if (
          this.selectedRow[i].OrderSource == 'UX' ||
          this.selectedRow[i].OrderSource == 'UXE'
        ) {
          this.selectedRow[i].OrderStatus = 'Reviewed';
          this.selectedRow[i].OrderStatusCK = 'Reviewed';
        } else {
          this.selectedRow[i].OrderStatus = 'Processed';
          this.selectedRow[i].OrderStatusCK = 'Processed';
        }

        if(this.selectedRow[i].SAPPONo){
          if (this.selectedRow[i].SAPPONo.includes('-CXL')) {
            this.selectedRow[i].SAPPONo = this.selectedRow[i].SAPPONo.split('-CXL')[0];
          }
        }

        this.UpdatePONumber_RemoveCXL(this.selectedRow[i].JobID)

        // STEP 3. Update Internal and External Remarks
        await this.UpdateRemarksAfterSubmit(this.selectedRow[i]);

        // STEP 4. Update Order Details table
        if (
          lProdType == 'Rebar' ||
          lProdType == 'CAB' ||
          lProdType == 'STANDARD-BAR'
        ) {
          if (lProdTypeL2 == 'Standard Bar' || lProdTypeL2 == 'STANDARD-BAR') {
            this.getBBSBar(
              lCustomerCode,
              lProjectCode,
              lJobID,
              lOrderSource,
              lStructureEle,
              lProdType,
              lScheduledProd
            );
            //check std bar in CAB
            // reloadBBSBar(lRowNoF, pGrid);
            //this.showBBSBar=true;AJ
            //if (gridBBSBar.getDataLength() > 0) {
            let sorno = sor.message.split(',');
            for (let i = 0; i < this.OrderDetailsList_BBSBar.length; i++) {
              this.OrderDetailsList_BBSBar[i].BBSSOR = sorno[i];
              var lOrderNo = this.OrderDetailsList_BBSBar[i].BBSSAPSO;
              if (lOrderNo != null && lOrderNo != '') {
                lMTSOrders.push(lOrderNo);
                lMTSJobIDs.push(lJobID);
              }
            }
            //}
            //Check std bar
            var lSAPSO = sor.message;
            if (lSAPSO != null && lSAPSO != '') {
              if (this.selectedRow[0].SAPSONo != null) {
                // this.selectedRow[0].SAPSONo = lSAPSO;AJ
              }
              //this.selectedRow[0].SAPSONoCK = lSAPSO;AJ
              //pDataView.updateItem(this.selectedRow[0].id, item);
              //pGrid.render();
              //document.getElementById('pr_sapsono').value = lSAPSO;
              lMTSOrders.push(lSAPSO);
              lMTSJobIDs.push(lJobID);
            }
          } else {
            this.GetBBSProcess(
              lCustomerCode,
              lProjectCode,
              lJobID,
              lOrderSource,
              lStructureEle,
              lProdType,
              lScheduledProd
            );
            //reloadBBS(lRowNoF, pGrid);AJ
            //this.showBBS=true;AJ
            // gridBBS.setOptions({
            //   editable: false,
            //   autoEdit: false,
            // });AJ

            //if (gridBBS.getDataLength() > 0) {
            let sorno = sor.message.split(',');
            for (let i = 0; i < this.OrderDetailsList_BBS.length; i++) {
              this.OrderDetailsList_BBS[i].BBSSOR = sorno[i];
              var lOrderNo = this.OrderDetailsList_BBS[i].BBSSAPSO;
              if (lOrderNo != null && lOrderNo != '') {
                lMTSOrders.push(lOrderNo);
                lMTSJobIDs.push(lJobID);
              }
            }
            //}
          }
        }

        if (
          lProdType == 'Standard MESH' ||
          lProdType == 'STANDARD-BAR' ||
          lProdType == 'STANDARD-MESH' ||
          lProdType == 'COIL'
        ) {
          var lSAPSO = sor.message;
          if (lSAPSO != null && lSAPSO != '') {
            // if (item.SAPSONo != null) {
            //   item.SAPSONo = lSAPSO;
            // }
            // item.SAPSONoCK = lSAPSO;
            // pDataView.updateItem(item.id, item);
            // pGrid.render();
            // document.getElementById('pr_sapsono').value = lSAPSO;
            lMTSOrders.push(lSAPSO);
            lMTSJobIDs.push(lJobID);
          }
        }

        // STEP 5. Send an Email if tansport mode is Self Collection
        if (
          this.ProcessOrderForm.controls.VehicleType.value.substring(0, 2) ==
          'SC'
        ) {
          let lCustomer = this.selectedRow[i].CustomerCode;
          let lProject = this.selectedRow[i].ProjectCode;
          let lJobID = this.selectedRow[i].JobID;
          this.SendSelfCollectionEmail(lProdType, lCustomer, lProject, lJobID);
        }

        // STEP 6. Update OrderDetails if ProdType is Mesh
        if (
          lProdType == 'MESH' ||
          lProdType == 'STIRRUP-LINK-MESH' ||
          lProdType == 'COLUMN-LINK-MESH' ||
          lProdType == 'CUT-TO-SIZE-MESH' ||
          lProdType == 'PRE-CAGE' ||
          lProdType == 'CARPET' ||
          lProdType == 'CORE-CAGE' ||
          lProdType == 'ACS' ||
          (lScheduledProd == 'Y' && lProdType == 'BPC')
        ) {
          //reload mesh details table
          if (i == 0) {
            let CustomerCode = this.selectedRow[0].CustomerCode;
            let ProjectCode = this.selectedRow[0].ProjectCode;
            let JobID = this.selectedRow[0].JobID;
            let OrderSource = this.selectedRow[0].OrderSource;
            let StructureElement = this.selectedRow[0].StructureElement;
            let ProductType = this.selectedRow[0].ProdType;
            let ScheduledProd = this.selectedRow[0].ScheduledProd;
            this.getMeshBBS(
              CustomerCode,
              ProjectCode,
              JobID,
              OrderSource,
              StructureElement,
              ProductType,
              ScheduledProd
            );
          }
        }

        // STEP 7. CheckCreditBlock
        // let lTotalNo = this.selectedRow.length; // Set HardCoded in Old System
        // let lRunNo = i + 1; //Set HardCoded in Old System
        // if (lMTSOrders.length > 0) {
        //   if (lRunNo == lTotalNo) {
        //     var start = new Date().getTime();
        //     var end = start;
        //     while (end < start + 3000) {
        //       end = new Date().getTime();
        //     }
        //     await this.CheckCreditBlock(
        //       lMTSOrders,
        //       lProdType,
        //       lCustomerCode,
        //       lProjectCode,
        //       lMTSJobIDs
        //     );
        //   }
        // } else {
        // }
        if (lProdType == 'CUT-TO-SIZE-MESH') {
          let lresponse = await this.getWBS(lJobID);
          if (lresponse) {
            console.log('HERE WBS');
            this.selectedRow[i].WBS1 = lresponse.wbs1;
            this.selectedRow[i].WBS2 = lresponse.wbs2;
            this.selectedRow[i].WBS3 = lresponse.wbs3;
            this.ProcessOrderForm.controls.wbs1.patchValue(lresponse.wbs1);
            this.ProcessOrderForm.controls.wbs2.patchValue(lresponse.wbs2);
            this.ProcessOrderForm.controls.wbs3.patchValue(lresponse.wbs3);
          }
        }
      } else {
        alert(
          'Process failed. Please check your Internet connection, the order process status and process it again. '
        );
        this.ProcessOrderLoading = false;
        this.disableSubmit = false;
        return;
      }
      this.UpdateBackupRecords(this.selectedRow[i]);
    }

    // STEP 8. Alert a meesage for SUccessful Submission
    alert(
      'The order has been processed successfully. You may print process report for detail information.'
    );

    // STEP 9. Update value of SONumber in Input Column
    if (
      lProdType == 'Standard MESH' ||
      lProdType == 'STANDARD-MESH' ||
      lProdType == 'STANDARD-BAR' ||
      lProdType == 'COIL' ||
      lProdType == 'COUPLER'
    ) {
      this.ProcessOrderForm.controls['SONumber'].patchValue(
        this.selectedRow[0].SORNo
      );
    }
    let row = this.selectedRow[0];
    this.GetOrderDetailsTable(
      row.CustomerCode,
      row.ProjectCode,
      row.JobID,
      row.OrderSource,
      row.StructureElement,
      row.ProdType,
      row.ProdTypeDis,
      row.ScheduledProd
    );
    // STEP 10. Update Button Display
    this.disableSubmit = true;
    this.disableWithdraw = false;
    this.disableCancel = false;
    this.disableUpdate = false;

    // STEP 11. Cancel Loading
    this.ProcessOrderLoading = false;
  }

  // async CheckCreditBlock(
  //   pMTSOrders: any,
  //   pProdType: any,
  //   pCustomer: any,
  //   pProject: any,
  //   pJobIDs: any
  // ) {
  //   let lCreditBlock = false;
  //   if (pMTSOrders.length > 0) {
  //     let lStatus: any = await this.getCreditBlock(pMTSOrders);

  //     if (lStatus == true) {
  //       lCreditBlock = true;
  //     }
  //   }

  //   if (lCreditBlock == true) {
  //     let r = confirm(
  //       'Credit Blocked for the MTS order. Please inform authorized persons to release the order. Click <Yes> button to send an email to Sales dept automatically.'
  //     );
  //     if (r == true) {
  //       this.SendCreditBlockEmail(pProdType, pCustomer, pProject, pJobIDs);
  //     }
  //   }
  // }

  // async getCreditBlock(pOrderNo: any) {
  //   let obj = { SONumber: pOrderNo };
  //   try {
  //     const data = await this.orderService.CheckCreditBlock(obj).toPromise();
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //     alert('Database Error. Cannot check credit block.');
  //     return false;
  //   }
  // }

  // SendCreditBlockEmail(
  //   ProdType: any,
  //   CustomerCode: any,
  //   ProjectCode: any,
  //   JobID: any[]
  // ) {
  //   let obj = {
  //     ProdType: ProdType,
  //     CustomerCode: CustomerCode,
  //     ProjectCode: ProjectCode,
  //     pJobID: JobID,
  //   };
  //   this.orderService.sendCreditBlockEmail(obj).subscribe({
  //     next: (response) => {
  //       console.log('Email Sent CreditBlock');
  //     },
  //     error: (err) => {
  //       alert(
  //         'Error to send the credit block email, please prepare credit block email manually.'
  //       );
  //     },
  //     complete: () => {},
  //   });
  // }

  SendSelfCollectionEmail(
    ProdType: any,
    CustomerCode: any,
    ProjectCode: any,
    JobID: any
  ) {
    this.orderService
      .sendSelfCollectionEmail(ProdType, CustomerCode, ProjectCode, JobID)
      .subscribe({
        next: (response) => {
          console.log('Email Sent SelfCollection');
        },
        error: (err) => {
          alert(
            'Error to send the self collection email, please prepare self collection email manually.'
          );
        },
        complete: () => {},
      });
  }

  async UpdateRemarksAfterSubmit(item: any) {
    try {
      const data = await this.orderService
        .Get_ProcessRec(
          item.CustomerCode,
          item.ProjectCode,
          item.JobID,
          item.StructureElement,
          item.ProdType,
          item.ScheduledProd,
          item.OrderSource,
          item.SORNo
        )
        .toPromise();

      console.log('GetVehicleTypeList response', data);

      if (data) {
        this.InternalRemarks = data.IntRemarks;
        this.ExternalRemarks = data.ExtRemarks;
        this.InvoiceRemarks = data.InvRemarks;
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async SubmitOrder(obj: SubmitProcessModel): Promise<any> {
    try {
      const data = await this.orderService.SubmitProcess(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async CheckProcessOrdersUpdate(obj: CheckOrdersUpdateModel): Promise<any> {
    try {
      const data = await this.orderService.CheckOrdersUpdate(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async OrderUpdate() {
    var lStatus = false;
    // document.getElementById("order_update").disabled = true;

    // var this.selectedRow = pGrid.getSelectedRows();

    // var lCustomerA = document.getElementById("pr_customer").value.split("(");
    // if (lCustomerA.length > 0) {
    //   lCustomer = lCustomerA[lCustomerA.length - 1].substr(0, lCustomerA[lCustomerA.length - 1].length - 1);
    // }
    // var lProjectA = document.getElementById("pr_project").value.split("(");
    // if (lProjectA.length > 0) {
    //   lProject = lProjectA[lProjectA.length - 1].substr(0, lProjectA[lProjectA.length - 1].length - 1);
    // }
    var lCustomer = this.selectedRow[0].CustomerCode;
    var lProject = this.selectedRow[0].ProjectCode;
    var lContract = this.ProcessOrderForm.controls.Contract.value.substr(0, 10);

    // SOLUTION TO BE FOUND
    // if (document.getElementById("pr_noncontract").value == "YES") {
    //   lContract = "";
    // }

    var lJobIDForm = this.selectedRow[0].JobID;

    var lProdType = this.selectedRow[0].ProdType;
    var lOrderStatus = this.selectedRow[0].OrderStatus;

    if (
      lOrderStatus != 'Reviewed' &&
      lOrderStatus != 'Created*' &&
      lOrderStatus != 'Submitted*' &&
      lOrderStatus != 'Submitted' &&
      lOrderStatus != 'Processed' &&
      lOrderStatus != 'Production'
    ) {
      alert('Only can make amendment for Reviewed and Production orders.');
      // document.getElementById("order_update").disabled = false;
      return;
    }

    var lPONoF = this.selectedRow[0].PONumber;

    var lScheduledF = this.selectedRow[0].ScheduledProd;

    var lFound = 0;
    var lJobFound = 0;

    var pChPONumber = this.SelectedCheckBoxes.PONO ? 1 : 0;
    var pChBBSNo = this.SelectedCheckBoxes.BBSNO ? 1 : 0;
    var pChBBSDesc = this.SelectedCheckBoxes.BBSDesc ? 1 : 0;
    var pChIntRemakrs = this.SelectedCheckBoxes.IntReamrks ? 1 : 0;
    var pChExtRemakrs = this.SelectedCheckBoxes.ExternalRemarks ? 1 : 0;

    // {
    //   ReqDate: false,
    //     PONO: false,
    //       VehicleType: false,
    //         BookIndicator: false,
    //           BBSNO: false,
    //             BBSDesc: false,
    //               IntReamrks: false,
    //                 ExternalRemarks: false,
    //                   InvoiceRemarks: false
    // }

    for (let i = 0; i < this.selectedRow.length; i++) {
      if (
        pChPONumber == 1 ||
        pChBBSNo == 1 ||
        pChBBSDesc == 1 ||
        pChIntRemakrs == 1 ||
        pChExtRemakrs == 1
      ) {
        if (lCustomer != this.selectedRow[i].CustomerCode) {
          alert(
            'Cannot group different customer orders togather for batch process.'
          );
          lFound = 1;
          break;
        }

        //if (lProject != this.selectedRow[i].ProjectCode) {
        //    alert("Cannot group different project orders togather for batch process.")
        //    lFound = 1;
        //    break;
        //}
      }

      //if this.selectedRow[i].ProdType == "BPC" && i > 0 && this.selectedRow[i].ScheduledProd != "Y") {
      //    alert("Cannot group BPC orders together for batch update. Please process them individually. ");
      //    lFound = 1;
      //    break;
      //}

      //if (this.selectedRow[i].ProdType == "Standard MESH" ||
      //    this.selectedRow[i].ProdType == "STANDARD-MESH" ||
      //    this.selectedRow[i].ProdType == "STANDARD-BAR" ||
      //    this.selectedRow[i].ProdType == "COIL") &&
      //    this.selectedRow[i].SAPSONo == null ||
      //    this.selectedRow[i].SAPSONo == "" ) ) {
      //    alert("Cannot update the MTS product as its records have not downloaded from SAP. Please wait for the records downloaded from SAP.");
      //    lFound = 1;
      //    break;
      //}

      //if (lProdType != this.selectedRow[i].ProdType) {
      //    alert("Cannot group different product type orders togather for batch process.")
      //    lFound = 1;
      //    break;
      //}
      //if (lPONoF != this.selectedRow[i].PONumber) {
      //    alert("Cannot group orders with different PO Number togather for batch process.")
      //    lFound = 1;
      //    break;
      //}
      //if (lOrderStatus != this.selectedRow[i].OrderStatus) {
      //    alert("Cannot group different status of orders togather for batch process.")
      //    lFound = 1;
      //    break;
      //}

      if (
        this.selectedRow[i].OrderStatus != 'Reviewed' &&
        this.selectedRow[i].OrderStatus != 'Created*' &&
        this.selectedRow[i].OrderStatus != 'Submitted' &&
        this.selectedRow[i].OrderStatus != 'Submitted*' &&
        this.selectedRow[i].OrderStatus != 'Processed' &&
        this.selectedRow[i].OrderStatus != 'Production'
      ) {
        alert(
          'Only can make amendment for Pending Entry, Reviewed and Production orders.'
        );
        lFound = 1;
        break;
      }

      if (lJobIDForm == this.selectedRow[i].JobID) {
        lJobFound = 1;
      }
    }

    if (lFound == 1) {
      // document.getElementById("order_update").disabled = false;
      return;
    }

    if (lJobFound == 0) {
      alert(
        'The selected orders does not match with details shown on screen. Please re-select.'
      );
      // document.getElementById("order_update").disabled = false;
      return;
    }

    if (
      !confirm(
        'You are going to update the selected ' +
          this.selectedRow.length +
          ' order(s) with current data setting. Continue?'
      )
    ) {
      // document.getElementById("order_update").disabled = false;
      return;
    }

    var listJobID = [];
    var listProdType = [];
    var listOrderSource = [];
    var listStructureEle = [];
    var listScheduledProd = [];
    var listSORNo = [];

    for (let i = 0; i < this.selectedRow.length; i++) {
      var lRowNo = this.selectedRow[i];

      listJobID.push(lRowNo.JobID.toString());
      listProdType.push(lRowNo.ProdType);
      listOrderSource.push(lRowNo.OrderSource);
      listStructureEle.push(lRowNo.StructureElement);
      listScheduledProd.push(lRowNo.ScheduledProd);
      listSORNo.push(lRowNo.SORNo == '' ? ' ' : lRowNo.SORNo);
    }
    var lRetOK = true;

    let obj = {
      CustomerCode: this.selectedRow[0].CustomerCode,
      ProjectCode: this.selectedRow[0].ProjectCode,
      OrderNumber: listJobID,
      ProdType: listProdType,
      StructureElement: listStructureEle,
      ScheduledProd: listScheduledProd,
      OrderSource: listOrderSource,
      SORNo: listSORNo,
    };

    let responseCheckOrderStatus = await this.CheckProcessOrdersUpdate(obj);
    if (responseCheckOrderStatus != false) {
      if (responseCheckOrderStatus != '' && responseCheckOrderStatus != null) {
        alert(responseCheckOrderStatus);
        // document.getElementById("order_update").disabled = false;
        lRetOK = false;
      }
    } else {
      alert(
        'Error on order checking status. Please check the Internet connection and try again.'
      );
      // document.getElementById("order_update").disabled = false;
      lRetOK = false;
    }

    //CALL CheckOrdersUpdate

    // error: function (response) {
    //   alert("Error on order checking status. Please check the Internet connection and try again.");
    //   document.getElementById("order_update").disabled = false;
    //   lRetOK = false;
    // },
    // success: function (response) {
    //   if (response != "") {
    //     alert(response);
    //     document.getElementById("order_update").disabled = false;
    //     lRetOK = false;
    //   }
    // }
    if (lRetOK == false) {
      return;
    }

    var pChReqDate = this.SelectedCheckBoxes.ReqDate ? 1 : 0;

    var lCashPayment = 'N';
    if (pChReqDate == 1) {
      var lReqDateFrom = this.ProcessOrderForm.controls.ReqDate.value;
      var lReqDateTo = this.ProcessOrderForm.controls.UpdateReqDate.value;
      if (lReqDateTo != null) {
        //var lReqDateFrom1 = new Date(lReqDateFrom);
        var lReqDateTo1 = new Date(lReqDateTo);
        //if (lReqDateFrom1 <= new Date(new Date().getTime() - 480 * 60 * 60 * 1000)) {
        //    document.getElementById("order_update").disabled = false;
        //    alert("Invalid Original Required Date");
        //    return false;
        //}
        if (
          lReqDateTo1 <= new Date(new Date().getTime() - 480 * 60 * 60 * 1000)
        ) {
          // document.getElementById("order_update").disabled = false;
          alert('Invalid Updated Required Date');
          return;
        }
        //if (lReqDateTo1 < lReqDateFrom1) {
        //    document.getElementById("order_update").disabled = false;
        //    alert("Invalid Required Date Range");
        //    return false;
        //}
      } else {
        // document.getElementById("order_update").disabled = false;
        alert('Invalid Required Date.');
        return;
      }
    }

    // startLoading();
    // setTimeout(MidOrderUpdate, 300, lContract, 0, pChReqDate, pChPONumber, pChVehicleType, pChBookInd, pChBBSNo, pChBBSDesc, pChIntRemakrs, pChExtRemakrs, pChInvRemakrs, pGrid);
    this.StartOrderUpdate(this.SelectedCheckBoxes);
  }

  FirstRowSelected(response: any) {
    if (response.length > 0) {
      let lClick: MouseEvent = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        button: 0,
        buttons: 0,
        clientX: 0,
        clientY: 0,
        metaKey: false,
        movementX: 0,
        movementY: 0,
        offsetX: 0,
        offsetY: 0,
        pageX: 0,
        pageY: 0,
        relatedTarget: null,
        screenX: 0,
        screenY: 0,
        x: 0,
        y: 0,
        getModifierState: function (keyArg: string): boolean {
          throw new Error('Function not implemented.');
        },
        initMouseEvent: function (
          typeArg: string,
          canBubbleArg: boolean,
          cancelableArg: boolean,
          viewArg: Window,
          detailArg: number,
          screenXArg: number,
          screenYArg: number,
          clientXArg: number,
          clientYArg: number,
          ctrlKeyArg: boolean,
          altKeyArg: boolean,
          shiftKeyArg: boolean,
          metaKeyArg: boolean,
          buttonArg: number,
          relatedTargetArg: EventTarget | null
        ): void {
          throw new Error('Function not implemented.');
        },
        detail: 0,
        view: null,
        which: 0,
        initUIEvent: function (
          typeArg: string,
          bubblesArg?: boolean | undefined,
          cancelableArg?: boolean | undefined,
          viewArg?: Window | null | undefined,
          detailArg?: number | undefined
        ): void {
          throw new Error('Function not implemented.');
        },
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: false,
        currentTarget: null,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        returnValue: false,
        srcElement: null,
        target: null,
        timeStamp: 0,
        type: '',
        composedPath: function (): EventTarget[] {
          throw new Error('Function not implemented.');
        },
        initEvent: function (
          type: string,
          bubbles?: boolean | undefined,
          cancelable?: boolean | undefined
        ): void {
          throw new Error('Function not implemented.');
        },
        preventDefault: function (): void {
          throw new Error('Function not implemented.');
        },
        stopImmediatePropagation: function (): void {
          throw new Error('Function not implemented.');
        },
        stopPropagation: function (): void {
          throw new Error('Function not implemented.');
        },
        AT_TARGET: 0,
        BUBBLING_PHASE: 0,
        CAPTURING_PHASE: 0,
        NONE: 0,
        // layerX: 0,
        // layerY: 0,
      };
      this.selectRow(this.SearchResultData[0], this.SearchResultData, lClick);
    } else {
      this.ProcessOrderForm.reset();
      this.ResetOrderDetailsTable();
      this.InternalRemarks = '';
      this.ExternalRemarks = '';
    }
  }

  setRowColorDetailing(item: any) {
    let color = 'white';
    const today = new Date();
    const targetDate = new Date(item.RequiredDate); // Replace YYYY-MM-DD with your target date
    const timeDifference = targetDate.getTime() - today.getTime();
    var lNoOfDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // var lNoOfDays = Math.floor((Date.parse(item.RequiredDate) - (new Date())) / (24 * 60 * 60 * 1000));

    if (item.OrderStatus == 'Cancelled') {
      // meta.cssClasses += ' listitem-cancelled';
      color = '#ffcccb';
    } else if (item.OrderStatus == 'Withdrawn') {
      if (item.PMDRemarks.toLowerCase().indexOf('hold') >= 0) {
        // meta.cssClasses += ' listitem-onhold';
        color = '#ccc699';
      } else {
        // meta.cssClasses += ' listitem-withdrawn';
        color = '#ffccff';
      }
    } else {
      lNoOfDays = lNoOfDays + 1;
      if (lNoOfDays <= 5) {
        // meta.cssClasses += ' listitem-det5day';
        color = '#f9e766';
      } else if (lNoOfDays == 6) {
        // meta.cssClasses += ' listitem-det6day';
        color = 'lightskyblue';
      } else if (lNoOfDays >= 7 && lNoOfDays <= 14) {
        // meta.cssClasses += ' listitem-det7day';
        color = 'lightgreen';
      }
    }
    return color;
  }

  setRowColor(item: any) {
    let color = '';
    if (item.OrderStatus == 'Processed' || item.OrderStatus == 'Reviewed') {
      // meta.cssClasses += ' listitem-processed';
      color = 'white';
    } else if (item.OrderStatus == 'Submitted') {
      if (item.PMDRemarks.toLowerCase().indexOf('hold') >= 0) {
        // meta.cssClasses += ' listitem-onhold';
        color = '#ccc699';
      } else {
        // meta.cssClasses += ' listitem-submitted';
        color = '#cecbff';
      }
    } else if (item.OrderStatus == 'Delivered') {
      // meta.cssClasses += ' listitem-delivered';
      color = '#00b050';
    } else if (item.OrderStatus == 'Partial Delivered') {
      // meta.cssClasses += ' listitem-partialdel';
      color = '#83f0b6';
    } else if (item.OrderStatus == 'Cancelled') {
      // meta.cssClasses += ' listitem-cancelled';
      color = '#ffcccb';
    } else if (item.OrderStatus == 'Withdrawn') {
      if (item.PMDRemarks.toLowerCase().indexOf('hold') >= 0) {
        // meta.cssClasses += ' listitem-onhold';
        color = '#ccc699';
      } else {
        // meta.cssClasses += ' listitem-withdrawn';
        color = '#ffccff';
      }
    } else if (item.OrderStatus == 'Production') {
      // meta.cssClasses += ' listitem-production';
      color = '#A6c0ff';
    } else {
      // meta.cssClasses += ' listitem-created';
      color = '#d9d9d9';
    }
    if (
      item.ConfirmedDelDate != null &&
      item.ConfirmedDelDate != '' &&
      item.ConfirmedDelDate != ' ' &&
      item.OrderStatus != 'Delivered' &&
      item.OrderStatus != 'Partial Delivered' &&
      item.OrderStatus != 'Cancelled' &&
      item.OrderStatus != 'Production'
    ) {
      // meta.cssClasses += ' listitem-confirmeddel';
      color = '#00b0f0';
    } else if (
      item.SAPSONo != null &&
      item.SAPSONo != '' &&
      item.SAPSONo != ' ' &&
      item.OrderStatus == 'Reviewed'
    ) {
      // meta.cssClasses += ' listitem-withso ';
      color = '#bdfbee';
    }

    if (
      item.SORStatus != null &&
      item.OrderStatus != 'Cancelled' &&
      item.OrderStatus != 'Withdrawn' &&
      (item.SORStatus == 'F' || item.SORStatus == 'D')
    ) {
      // meta.cssClasses += ' listitem-error ';
      color = 'red';
    } else if (
      item.CreditStatus != null &&
      item.OrderStatus != 'Cancelled' &&
      item.OrderStatus != 'Withdrawn' &&
      (item.CreditStatus == 'Credit Block' ||
        item.CreditStatus == 'Cash Delivery Block' ||
        item.CreditStatus == 'FOC Delivery Block') &&
      item.SORStatus != null &&
      item.SORStatus != 'X'
    ) {
      // meta.cssClasses += ' listitem-creditblock ';
      color = '#ffe699';
    }

    //Orders with incomplete log status
    if (item.ERROR_CD == 'Order created with Incompletion log') {
      color = 'red';
    }

    return color;
  }

  getSelectedTotalWeight(item: any) {
    let weight = 0;
    for (let i = 0; i < this.selectedRow.length; i++) {
      weight += Number(this.selectedRow[i].TotalWeight);
    }
    return Number(weight).toFixed(3);
  }

  async CancelWithdrawOrder(ActionType: any) {
    this.ProcessOrderLoading = true;
    var lStatus = false;

    var lCustomer = this.selectedRow[0].CustomerCode;
    var lProject = this.selectedRow[0].ProjectCode;

    var lContract = this.ProcessOrderForm.controls.Contract.value.substr(0, 10);
    // if (document.getElementById("pr_noncontract").value == "YES") {
    //     lContract = "";
    // }

    var lJobIDForm = this.selectedRow[0].JobID; //document.getElementById("pr_jobid").value;

    var lProdType = this.selectedRow[0].ProdType;
    var lScheduledProd = this.selectedRow[0].ScheduledProd;
    var lOrderStatus = this.selectedRow[0].OrderStatus;

    if (
      lProdType == 'CUT-TO-SIZE-MESH' ||
      lProdType == 'STIRRUP-LINK-MESH' ||
      lProdType == 'COLUMN-LINK-MESH' ||
      lProdType == 'MESH'
    ) {
      lProdType = 'MESH';
    }

    var lFound = 0;
    var lJobFound = 0;

    var lOrders: any[] = [];
    var lSORs: any[] = [];

    let lOrderList: any[] = [];
    for (let i = 0; i < this.selectedRow.length; i++) {
      // let lOrderNumber = this.selectedRow[i].JobID;
      // if (lOrderList.includes(lOrderNumber)) {
      //   break;
      // }
      // lOrderList.push(lOrderNumber);

      if (lCustomer != this.selectedRow[i].CustomerCode) {
        alert(
          'Cannot group different customer orders togather for batch process.'
        );
        lFound = 1;
        break;
      }

      if (lProject != this.selectedRow[i].ProjectCode) {
        alert(
          'Cannot group different project orders togather for batch process.'
        );
        lFound = 1;
        break;
      }

      var lProdType1 = this.selectedRow[i].ProdType;
      if (
        lProdType1 == 'CUT-TO-SIZE-MESH' ||
        lProdType1 == 'STIRRUP-LINK-MESH' ||
        lProdType1 == 'COLUMN-LINK-MESH' ||
        lProdType1 == 'MESH'
      ) {
        lProdType1 = 'MESH';
      }

      if (lProdType != lProdType1) {
        alert(
          'Cannot group different product type orders togather for batch process.'
        );
        lFound = 1;
        break;
      }

      if (lOrderStatus != this.selectedRow[i].OrderStatus) {
        alert(
          'Cannot group different status of orders togather for batch process.'
        );
        lFound = 1;
        break;
      }

      if (lJobIDForm == this.selectedRow[i].JobID) {
        lJobFound = 1;
      }

      if (
        this.selectedRow[i].SAPSONo != null &&
        this.selectedRow[i].SAPSONo != ''
      ) {
        lOrders = lOrders.concat(this.selectedRow[0].SAPSONo.split(','));
        // lOrders = this.AddSAP(this.selectedRow[0].JobID);
      }
      //if (this.selectedRow[0].SORNo != null && this.selectedRow[0].SORNo != "" && this.selectedRow[0].SORNo.substring(0,1) != "1") {
      if (
        this.selectedRow[i].SORNo != null &&
        this.selectedRow[i].SORNo != ''
      ) {
        lSORs = lSORs.concat(this.selectedRow[i].SORNo.split(','));
        // lSORs = this.AddSOR(this.selectedRow[0].JobID);
      }
    }

    if (lFound == 1) {
      // document.getElementById("order_cancel").disabled = false;
      // document.getElementById("order_withdraw").disabled = false;
      this.ProcessOrderLoading = false;

      return;
    }

    if (lJobFound == 0) {
      alert(
        'The selected orders does not match with details shown on screen. Please re-select.'
      );
      // document.getElementById("order_cancel").disabled = false;
      // document.getElementById("order_withdraw").disabled = false;
      this.ProcessOrderLoading = false;
      return;
    }

    var lSORsCancel = '';

    if (lProdType == 'CAB') {
      let gridBBS = this.OrderDetailsList_BBS;
      for (let i = 0; i < gridBBS.length; i++) {
        if (
          gridBBS[i].BBSSOR != null &&
          gridBBS[i].BBSSOR != '' &&
          gridBBS[i].BBSSOR.indexOf('Cancelled') < 0
        ) {
          lOrders.push(gridBBS[i].BBSSOR);
          if (lSORsCancel == '') {
            lSORsCancel = gridBBS[i].BBSSOR;
          } else {
            lSORsCancel = lSORsCancel + ', ' + gridBBS[i].BBSSOR;
          }
        }
        if (
          gridBBS[i].BBSSORCoupler != null &&
          gridBBS[i].BBSSORCoupler != '' &&
          gridBBS[i].BBSSORCoupler.indexOf('Cancelled') < 0
        ) {
          lOrders.push(gridBBS[i].BBSSORCoupler);
          if (lSORsCancel == '') {
            lSORsCancel = gridBBS[i].BBSSORCoupler;
          } else {
            lSORsCancel = lSORsCancel + ', ' + gridBBS[i].BBSSORCoupler;
          }
        }
        if (
          gridBBS[i].BBSSAPSO != null &&
          gridBBS[i].BBSSAPSO != '' &&
          gridBBS[i].BBSSAPSO.indexOf('Cancelled') < 0
        ) {
          lOrders.push(gridBBS[i].BBSSAPSO);
          if (lSORsCancel == '') {
            lSORsCancel = gridBBS[i].BBSSAPSO;
          } else {
            lSORsCancel = lSORsCancel + ', ' + gridBBS[i].BBSSAPSO;
          }
        }
      }
    } else if (lProdType == 'BPC' && lScheduledProd != 'Y') {
      let BPCGrid = this.OrderDetailsList_BPC;
      for (let i = 0; i < BPCGrid.length; i++) {
        if (
          BPCGrid[i].sor_no != null &&
          BPCGrid[i].sor_no != '' &&
          BPCGrid[i].sor_no.indexOf('Cancelled') < 0
        ) {
          lOrders.push(BPCGrid[i].sor_no);

          if (lSORsCancel == '') {
            lSORsCancel = BPCGrid[i].sor_no;
          } else {
            if (lSORsCancel.indexOf(BPCGrid[i].sor_no) < 0) {
              lSORsCancel = lSORsCancel + ', ' + BPCGrid[i].sor_no;
            }
          }
        }
      }
    }

    if (lSORs.length > 0) {
      for (let i = 0; i < lSORs.length; i++) {
        if (lSORsCancel == '') {
          lSORsCancel = lSORs[i];
        } else {
          if (lSORsCancel.indexOf(lSORs[i]) < 0) {
            if (lSORs[i].indexOf('A') > 0 || lSORs[i].indexOf('B') > 0) {
              alert(
                'The selected item ' +
                  lSORs[i] +
                  ' is including multiple orders. To prevent the action from affecting other orders, please select the item first.'
              );
              // document.getElementById("order_cancel").disabled = false;
              // document.getElementById("order_withdraw").disabled = false;
              this.ProcessOrderLoading = false;
              return;
            }
            lSORsCancel = lSORsCancel + ', ' + lSORs[i];
          }
        }
      }
    }

    if (lOrders.length > 0) {
      // var lStatus = checkOrderStatus(lOrders);
      let obj = {
        SONumber: lOrders,
      };
      let lStatus = await this.CheckCancelStatus(obj);
      if (lStatus == true) {
        alert(
          'The order has started loading. It cannot be modified/cancelled.'
        );
        // document.getElementById("order_cancel").disabled = false;
        this.ProcessOrderLoading = false;
        return;
      }
    }
    if (lSORs.length > 0) {
      let obj = {
        pSORNo: lSORs,
      };
      let lStatus = await this.CheckCreationStatus(obj);
      if (lStatus != true) {
        alert(
          'SAP system is generating SAP SO now. Please wait for the sales order number creation before start to cancel the order.'
        );
      }
      if (lStatus == false) {
        this.ProcessOrderLoading = false;
        // document.getElementById("order_cancel").disabled = false;
        return;
      }
    }

    if (ActionType == 'Cancel') {
      if (
        !confirm(
          'You are going to cancel the selected ' +
            this.selectedRow.length +
            ' order(s), including ' +
            lSORsCancel +
            '. Continue?'
        )
      ) {
        // document.getElementById("order_cancel").disabled = false;
        // document.getElementById("order_withdraw").disabled = false;
        this.ProcessOrderLoading = false;
        return;
      }
    } else {
      if (
        !confirm(
          'You are going to withdraw the selected ' +
            this.selectedRow.length +
            ' order(s), including ' +
            lSORsCancel +
            '. After that, customer can withdraw, edit and submit it again. Continue?'
        )
      ) {
        // document.getElementById("order_cancel").disabled = false;
        // document.getElementById("order_withdraw").disabled = false;
        this.ProcessOrderLoading = false;
        return;
      }
    }

    var lJobID = [];
    var lProdType: any = [];
    var lOrderSource = [];
    var lStructureEle = [];
    var lScheduledProd: any = [];
    var lResultLoaded = false;

    for (let i = 0; i < this.selectedRow.length; i++) {
      var lRowNo = this.selectedRow[i];

      lJobID.push(this.selectedRow[i].JobID.toString());
      lProdType.push(this.selectedRow[i].ProdType);
      lOrderSource.push(this.selectedRow[i].OrderSource);
      lStructureEle.push(this.selectedRow[i].StructureElement);
      lScheduledProd.push(this.selectedRow[i].ScheduledProd);
    }

    let obj: CheckOrderCancelModel = {
      CustomerCode: this.selectedRow[0].CustomerCode,
      ProjectCode: this.selectedRow[0].ProjectCode,
      OrderNumber: lJobID,
      ProdType: lProdType,
      StructureElement: lStructureEle,
      ScheduledProd: lScheduledProd,
      OrderSource: lOrderSource,
    };

    let responseCheckOrdersCancel = await this.CheckOrdersCancel(obj);

    if (responseCheckOrdersCancel == false) {
      alert(
        'Error on order checking. Please check the Internet connection and try again.'
      );
      // document.getElementById("order_cancel").disabled = false;
      // document.getElementById("order_withdraw").disabled = false;
      lResultLoaded = true;
    } else {
      if (responseCheckOrdersCancel) {
        if (responseCheckOrdersCancel?.ErrorMsg) {
          alert(responseCheckOrdersCancel.ErrorMsg);
          // document.getElementById("order_cancel").disabled = false;
          // document.getElementById("order_withdraw").disabled = false;
          lResultLoaded = true;
        }
      }
    }
    if (lResultLoaded == false) {
      // startLoading();
      // setTimeout(midOrderCancelMulti, 500, lContract, ActionType, 0, lGrid, lDataView);

      if (ActionType == 'Cancel') {
        this.Cancel();
      } else if (ActionType == 'Withdraw') {
        this.Withdraw();
      }
    } else {
      this.ProcessOrderLoading = false;
    }
  }

  // ChkCreationStatus

  async CheckOrdersCancel(obj: CheckOrderCancelModel): Promise<any> {
    try {
      const data = await this.orderService.CheckOrdersCancel(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async CheckCreationStatus(obj: any): Promise<any> {
    try {
      const data = await this.orderService.ChkCreationStatus(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      alert('Database Error. Cannot check order status.');
      let r = confirm(
        'Database Error, cannot check order status. Press [Cancell] to stop, [OK] to continue.'
      );
      if (r == true) {
        return false;
      } else {
        return true;
      }
    }
  }
  async CheckCancelStatus(obj: any): Promise<any> {
    try {
      const data = await this.orderService.CheckCancelStatus(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      alert('Database Error. Cannot check order status.');
      let r = confirm(
        'Database Error, cannot check order status. Press [Cancell] to stop, [OK] to continue.'
      );
      if (r == true) {
        return false;
      } else {
        return true;
      }
    }
  }
  setButtonDisplay(OrderStatusCK: any) {
    let lUserType = this.loginService.GetUserType();
    if (
      OrderStatusCK != 'Cancelled' &&
      OrderStatusCK != 'Processed' &&
      OrderStatusCK != 'Production' &&
      OrderStatusCK != 'Reviewed' &&
      OrderStatusCK != 'Delivered' &&
      OrderStatusCK != 'Partial Delivered'
    ) {
      if (
        lUserType == 'MJ' ||
        lUserType == 'PL' ||
        lUserType == 'TE' ||
        OrderStatusCK == 'Created*' ||
        OrderStatusCK == 'Submitted*'
      ) {
        // document.getElementById('order_submit').disabled = true;
        if (this.isEsmUserAndOrder()) {
          this.disableSubmit = false;
        } else {
          this.disableSubmit = true;
        }
      } else {
        // document.getElementById('order_submit').disabled = false;
        this.disableSubmit = false;
      }
      // document.getElementById('order_withdraw').disabled = true;
      // document.getElementById('order_cancel').disabled = true;
      this.disableWithdraw = true;
      this.disableCancel = true;

      if (
        lUserType != 'MJ' &&
        lUserType != 'PL' &&
        lUserType != 'TE' &&
        (OrderStatusCK == 'Created*' ||
          OrderStatusCK == 'Submitted*' ||
          OrderStatusCK == 'Submitted')
      ) {
        // document.getElementById('order_update').disabled = false;
        this.disableUpdate = false;
      } else {
        // document.getElementById('order_update').disabled = true;'
        if (this.isEsmUserAndOrder()) {
          this.disableUpdate = false;
        } else {
          this.disableUpdate = true;
        }
      }

      if (lUserType == 'MJ') {
        // document.getElementById('order_amend').disabled = true;
        this.disableAmmend = true;
      } else {
        // document.getElementById('order_amend').disabled = false;
        this.disableAmmend = false;
      }
    } else {
      // document.getElementById('order_submit').disabled = true;
      this.disableSubmit = true;
      if (
        lUserType == 'MJ' ||
        lUserType == 'PL' ||
        lUserType == 'TE' ||
        OrderStatusCK == 'Cancelled' ||
        OrderStatusCK == 'Delivered'
      ) {
        // document.getElementById('order_withdraw').disabled = true;
        // document.getElementById('order_cancel').disabled = true;
        // document.getElementById('order_update').disabled = true;
        if (this.isEsmUserAndOrder()) {
          this.disableWithdraw = false;
          this.disableCancel = false;
          this.disableUpdate = false;
        } else {
          this.disableWithdraw = true;
          this.disableCancel = true;
          this.disableUpdate = true;
        }
      } else {
        // document.getElementById('order_withdraw').disabled = false;
        // document.getElementById('order_cancel').disabled = false;
        // document.getElementById('order_update').disabled = false;
        this.disableWithdraw = false;
        this.disableCancel = false;
        this.disableUpdate = false;
      }
    }
  }

  isEsmUserAndOrder() {
    let isEsmUser = this.commonService.isEsmUser;
    // 1. Check if it is an ESM user.
    if(isEsmUser) {
      // 2. Check if all the selected Orders are ESM orders.
      let lIndex = this.selectedRow.findIndex(item => item.Sales_org != '6801');
      if(lIndex == -1) {
        // 3. If both the coditions satisfy, Return True.
        return true;
      }
    }
    return false;
  }

  downloadOrderDetails() {
    debugger;
    if (this.selectedRow.length == 0) {
      alert('Please select an Order.');
      return;
    }

    let CustomerCode = this.selectedRow[0].CustomerCode;
    let ProjectCode = this.selectedRow[0].ProjectCode;
    let JobID = this.selectedRow[0].JobID;
    let OrderSource = this.selectedRow[0].OrderSource;
    let StructureElement = this.selectedRow[0].StructureElement;
    let ProdType = this.selectedRow[0].ProdType;
    let ScheduledProd = this.selectedRow[0].ScheduledProd;
    let PONumber = this.selectedRow[0].PONumber;
    let ReqDate = this.selectedRow[0].RequiredDate;

    //LOADING START
    this.ProcessOrderLoading = true;

    // let ProjectCode=this.selectedRow[0].ProjectCode;
    // let JobID=this.selectedRow[0].JobID;
    this.orderService
      .showdirProcess(
        CustomerCode,
        ProjectCode,
        JobID,
        OrderSource,
        StructureElement,
        ProdType,
        ScheduledProd
      )
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'OrderDetail-' + PONumber + ReqDate + '.pdf';
          a.click();

          window.open(url, '_blank'); // Opens the PDF in a new tab

          // this.StandardBarProductOrderLoading = false;
          this.ProcessOrderLoading = false;
        },
        error: (e) => {
          this.ProcessOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {},
      });
  }

  downloadOrderForm() {
    if (this.selectedRow.length == 0) {
      alert('Please select an Order.');
      return;
    }

    let lProcess = this.selectedRow[0].OrderStatus;
    if (lProcess != 'Processed' && lProcess != 'Reviewed') {
      alert('You can only print processed orders.');
      return;
    }

    let CustomerCode = this.selectedRow[0].CustomerCode;
    let ProjectCode = this.selectedRow[0].ProjectCode;
    let JobID = this.selectedRow[0].JobID;
    let OrderSource = this.selectedRow[0].OrderSource;
    let StructreElement = this.selectedRow[0].StructureElement;
    let ProdType = this.selectedRow[0].ProdType;
    let ScheduledProd = this.selectedRow[0].ScheduledProd;
    let PONumber = this.selectedRow[0].PONumber;
    let ReqDate = this.selectedRow[0].RequiredDate;

    //LOADING START
    this.ProcessOrderLoading = true;

    this.orderService
      .showdirOrderProcess(
        CustomerCode,
        ProjectCode,
        OrderSource,
        JobID,
        StructreElement,
        ProdType,
        ScheduledProd
      )
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'OrderProcess-' + PONumber + ReqDate + '.pdf';
          a.click();

          window.open(url, '_blank'); // Opens the PDF in a new tab

          this.ProcessOrderLoading = false;
        },
        error: (e) => {
          this.ProcessOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {},
      });
  }

  HideRows(dataList: any, rows: any, tab: any) {
    console.log('dataList', dataList);
    console.log('rows', rows);

    if (rows.length == 0) {
      alert('Please select a record to hide.');
      return;
    }

    this.RowsHidden = true;

    for (let i = 0; i < rows.length; i++) {
      dataList = dataList.filter((item: any) => item !== rows[i]);
    }
    console.log('dataList final', dataList);

    if (tab == 'PendingENT') {
      this.PendingENT = JSON.parse(JSON.stringify(dataList));
    } else if (tab == 'Search') {
      this.SearchResultData = JSON.parse(JSON.stringify(dataList));
    } else if (tab == 'Processing') {
      this.ProcessingData = JSON.parse(JSON.stringify(dataList));
    } else if (tab == 'Cancel') {
      this.CancelData = JSON.parse(JSON.stringify(dataList));
    } else if (tab == 'PendingDET') {
      this.PendingDET = JSON.parse(JSON.stringify(dataList));
    } else if (tab == 'Incoming') {
      this.IncomingData = JSON.parse(JSON.stringify(dataList));
    } else if (tab == 'ALL') {
      this.AllData == JSON.parse(JSON.stringify(dataList));
    }
  }

  UnHideRows() {
    this.RowsHidden = false;

    this.PendingENT = JSON.parse(JSON.stringify(this.PendingENTBackUp));
    this.SearchResultData = JSON.parse(
      JSON.stringify(this.SearchResultDataBackup)
    );
    this.ProcessingData = JSON.parse(JSON.stringify(this.ProcessBackup));
    this.CancelData = JSON.parse(JSON.stringify(this.CancelBackup));
    this.PendingDET = JSON.parse(JSON.stringify(this.PendingDETBackup));
    this.IncomingData = JSON.parse(JSON.stringify(this.BackupIncomingData));
  }

  async getJobId(
    orderNumber: any,
    ProdType: any,
    StructurEelement: any,
    ScheduleProd: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .getJobId(orderNumber, ProdType, StructurEelement, ScheduleProd)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  toggleSortingOrder(columnname: string, actualColumn: string) {
    this.ResetSelectedRow();
    this.changeNameForAll(this.IncomingData);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.IncomingData.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else {
        // this.IncomingData.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? a[actualColumn].localeCompare(b[actualColumn])
        //     : -1
        // );
        this.IncomingData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'asc')
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.IncomingData.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else {
        // this.IncomingData.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? b[actualColumn].localeCompare(a[actualColumn])
        //     : 0
        // );
        this.IncomingData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }

    // this.sortItemsProcessing(columnname);
    this.UpdateSelectedSortedRecords(this.IncomingData);
    this.IncomingData = [...this.IncomingData];
    this.viewPortIncoming?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPortIncoming?.checkViewportSize();
    // Update viewport
  }

  changeNameForAll(arrayOfObjects: any) {
    arrayOfObjects.forEach((obj: any) => {
      obj.isSelected = false;
    });
  }
  toggleSortingOrderForENT(columnname: string, actualColumn: string) {
    this.ResetSelectedRow();
    this.changeNameForAll(this.PendingENT);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.PendingENT.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else {
        // this.PendingENT.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? a[actualColumn].localeCompare(b[actualColumn])
        //     : -1
        // );
        this.PendingENT.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'asc')
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.PendingENT.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else {
        // this.PendingENT.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? b[actualColumn].localeCompare(a[actualColumn])
        //     : 0
        // );
        this.PendingENT.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }
    // this.sortItemsProcessing(columnname);
    this.UpdateSelectedSortedRecords(this.PendingENT);
    this.PendingENT = [...this.PendingENT];
    this.viewPortENT?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPortENT?.checkViewportSize();
    // this.sortItemsPendingENT(columnname);
    //this.UpdateSelectedSortedRecords(this.PendingENT);
  }

  toggleSortingOrderForDET(columnname: string, actualColumn: string) {
    this.ResetSelectedRow();
    this.changeNameForAll(this.PendingDET);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.PendingDET.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else {
        // this.PendingDET.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? a[actualColumn].localeCompare(b[actualColumn])
        //     : -1
        // );
        this.PendingDET.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'asc')
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.PendingDET.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else {
        // this.PendingDET.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? b[actualColumn].localeCompare(a[actualColumn])
        //     : 0
        // );
        this.PendingDET.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }
    // this.sortItemsProcessing(columnname);
    this.UpdateSelectedSortedRecords(this.PendingDET);
    this.PendingDET = [...this.PendingDET];
    this.viewPortDET?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPortDET?.checkViewportSize();
  }

  toggleSortingOrderForCancelled(columnname: string, actualColumn: string) {
    this.ResetSelectedRow();
    this.changeNameForAll(this.CancelData);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.CancelData.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else if (
        columnname == 'PODate' ||
        columnname == 'RequiredDate' ||
        columnname == 'RevisedReqDate' ||
        columnname == 'ProcessDate'
      ) {
        this.CancelData.sort(
          (a, b) =>
            new Date(a[actualColumn]).getTime() -
            new Date(b[actualColumn]).getTime()
        );
      } else {
        // this.CancelData.sort((a, b) =>
        //   a[actualColumn].localeCompare(b[actualColumn])
        // );
        this.CancelData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'asc')
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.CancelData.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else if (
        columnname == 'PODate' ||
        columnname == 'RequiredDate' ||
        columnname == 'RevisedReqDate' ||
        columnname == 'ProcessDate'
      ) {
        this.CancelData.sort(
          (a, b) =>
            new Date(b[actualColumn]).getTime() -
            new Date(a[actualColumn]).getTime()
        );
      } else {
        // this.CancelData.sort((a, b) =>
        //   b[actualColumn].localeCompare(a[actualColumn])
        // );
        this.CancelData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }
    // this.sortItemsCancelled(columnname);
    //this.UpdateSelectedSortedRecords(this.CancelData);
    this.UpdateSelectedSortedRecords(this.CancelData);
    this.CancelData = [...this.CancelData];
    this.viewPortCancelled?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPortCancelled?.checkViewportSize();
  }
  replaceNull(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value === null ? '' : value,
      ])
    );
  }
  toggleSortingOrderForProcessing(columnname: string, actualColumn: string) {
    this.ResetSelectedRow();
    this.changeNameForAll(this.ProcessingData);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'LeadTime' ||
        columnname == 'Documents' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.ProcessingData.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else {
        // this.ProcessingData.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? a[actualColumn].localeCompare(b[actualColumn])
        //     : -1
        // );
        this.ProcessingData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'asc')
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'LeadTime' ||
        columnname == 'Documents' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.ProcessingData.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else {
        // this.ProcessingData.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? b[actualColumn].localeCompare(a[actualColumn])
        //     : 0
        // );
        this.ProcessingData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }
    // this.sortItemsProcessing(columnname);
    this.UpdateSelectedSortedRecords(this.ProcessingData);
    this.ProcessingData = [...this.ProcessingData];
    this.viewPort?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPort?.checkViewportSize();
    // Update viewport
  }

  toggleSortingOrderForAll(columnname: string, actualColumn: string) {
    this.ResetSelectedRow();
    this.changeNameForAll(this.AllData);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'LeadTime' ||
        columnname == 'Documents' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.AllData.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else {
        // this.AllData.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? a[actualColumn].localeCompare(b[actualColumn])
        //     : -1
        // );
        this.AllData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'asc')
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'LeadTime' ||
        columnname == 'Documents' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.AllData.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else {
        // this.AllData.sort((a, b) =>
        //   b[actualColumn].localeCompare(a[actualColumn])
        // );
        this.AllData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }
    // this.sortItemsProcessingAll(columnname);
    this.UpdateSelectedSortedRecords(this.AllData);
  }

  toggleSortingOrderForSearch(columnname: string, actualColumn: string) {
    this.ResetSelectedRow();
    this.changeNameForAll(this.SearchResultData);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    let tempData = [...this.SearchResultData];
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'LeadTime' ||
        columnname == 'Documents' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        tempData.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else if (
        columnname == 'PODate' ||
        columnname == 'RequiredDate' ||
        columnname == 'RevisedReqDate'
      ) {
        tempData.sort(
          (a, b) =>
            new Date(a[actualColumn]).getTime() -
            new Date(b[actualColumn]).getTime()
        );
      } else {
        // tempData.sort((a, b) => a[actualColumn].localeCompare(b[actualColumn]));
        tempData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'asc')
        );
      }
    } else {
      if (
        columnname == 'OrderNo' ||
        columnname == 'LeadTime' ||
        columnname == 'Documents' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        tempData.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else if (
        columnname == 'PODate' ||
        columnname == 'RequiredDate' ||
        columnname == 'RevisedReqDate'
      ) {
        tempData.sort(
          (a, b) =>
            new Date(b[actualColumn]).getTime() -
            new Date(a[actualColumn]).getTime()
        );
      } else {
        // tempData.sort((a, b) => b[actualColumn].localeCompare(a[actualColumn]));
        tempData.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }
    // this.sortItemsProcessingSearch(columnname);
    this.SearchResultData = [...tempData];
    this.viewPortSearch?.checkViewportSize();
    this.cdr.detectChanges();
    this.UpdateSelectedSortedRecords(this.SearchResultData);
    this.SearchResultData = [...this.SearchResultData];
    this.viewPortSearch?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPortSearch?.checkViewportSize();
  }

  compare(
    a: number | string | null,
    b: number | string | null,
    order: 'asc' | 'desc'
  ): number {
    // Move null or empty values to the top
    if (a === null || a === '') {
      return -1 * (order == 'asc' ? 1 : -1);
    }
    if (b === null || b === '') {
      return 1 * (order == 'asc' ? 1 : -1);
    }

    // Check if both values are numbers (using isNaN)
    if (!isNaN(Number(a)) && !isNaN(Number(b))) {
      const numA = Number(a);
      const numB = Number(b);
      return order === 'asc' ? numA - numB : numB - numA;
    }

    // If both values are strings
    if (typeof a === 'string' && typeof b === 'string') {
      const result = a.localeCompare(b);
      return order === 'asc' ? result : -result;
    }

    // If one is a number and the other is a string, handle comparison
    if (!isNaN(Number(a)) && isNaN(Number(b))) {
      return order === 'asc' ? -1 : 1; // Number goes first
    }
    if (isNaN(Number(a)) && !isNaN(Number(b))) {
      return order === 'asc' ? 1 : -1; // String goes first
    }

    return 0; // Default case (should not happen)
  }

  convertToAscii(inputString: string) {
    let asciiValues = '';
    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      asciiValues = asciiValues + charCode;
    }
    return Number(asciiValues);
  }

  GetWBSAll(): void {
    //debugger;
    let CustomerCode = this.selectedRow[0].CustomerCode;
    let ProjectCode = this.selectedRow[0].ProjectCode;
    let JobID = this.selectedRow[0].JobID;
    let ProdType = this.selectedRow[0].ProdType;
    let WBS1 = this.selectedRow[0].WBS1;
    let WBS2 = this.selectedRow[0].WBS2;
    this.orderService
      .Get_WBS1Order(CustomerCode, ProjectCode, JobID, ProdType, WBS1, WBS2)
      .subscribe({
        next: (response) => {
          this.wbs1List = response.WBS1;
          this.wbs2List = response.WBS2;
          this.wbs3List = response.WBS3;
          if (this.wbs1List.includes(this.selectedRow[0].WBS1) == false) {
            this.wbs1List.push(this.selectedRow[0].WBS1);
          } else if (
            this.wbs2List.includes(this.selectedRow[0].WBS2) == false
          ) {
            this.wbs2List.push(this.selectedRow[0].WBS2);
          }
          console.log('wbs1List', response);
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  GetWBS2(): void {
    debugger;
    let CustomerCode = this.selectedRow[0].CustomerCode;
    let ProjectCode = this.selectedRow[0].ProjectCode;
    let JobID = Number(this.selectedRow[0].JobID);
    let ProdType = this.selectedRow[0].ProdType;
    let WBS1 = this.ProcessOrderForm.controls.wbs1.value.trim();
    if (WBS1 == '') {
      return;
    }
    this.wbs2List = [];
    this.wbs3List = [];
    this.ProcessOrderForm.controls.wbs2.patchValue('');
    this.ProcessOrderForm.controls.wbs3.patchValue('');

    this.orderService
      .Get_WBS2Order(CustomerCode, ProjectCode, JobID, ProdType, WBS1)
      .subscribe({
        next: (response) => {
          this.wbs2List = response;
          this.ProcessOrderForm.controls.wbs2.patchValue('');
          //this.wbs3List = response.WBS3;
          if (this.wbs2List.includes(this.selectedRow[0].WBS2) == false) {
            this.wbs2List.push(this.selectedRow[0].WBS2);
          }
          console.log('wbs2List', response);
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  GetWBS3(): void {
    //debugger;
    let CustomerCode = this.selectedRow[0].CustomerCode;
    let ProjectCode = this.selectedRow[0].ProjectCode;
    let JobID = this.selectedRow[0].JobID;
    let ProdType = this.selectedRow[0].ProdType;
    let WBS1 = this.ProcessOrderForm.controls.wbs1.value;
    let WBS2 = this.ProcessOrderForm.controls.wbs2.value;

    this.wbs3List = [];
    this.ProcessOrderForm.controls.wbs3.patchValue('');
    if (WBS2 == '' || WBS2 == null || WBS2 == undefined) {
      return;
    }
    this.orderService
      .Get_WBS3Order(CustomerCode, ProjectCode, JobID, ProdType, WBS1, WBS2)
      .subscribe({
        next: (response) => {
          // this.wbs2List = response.WBS2;
          this.wbs3List = response;
          this.ProcessOrderForm.controls.wbs3.patchValue('');
          if (this.wbs3List == undefined) {
            this.wbs3List = [];
          }
          if (this.wbs3List.includes(this.selectedRow[0].WBS3) == false) {
            this.wbs3List.push(this.selectedRow[0].WBS3);
          }
          console.log('wbs3List', response);
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  // getForecastRec(obj: ForecastdataModel) {
  //   this.orderService.getForecastRec(obj).subscribe({
  //     next: (response) => {
  //       console.log('Forecast', response);
  //     },
  //     error: (e) => { },
  //     complete: () => {
  //       // this.loading = false;
  //     },
  //   });
  // }

  async getForecastRec(obj: ForecastdataModel): Promise<any> {
    try {
      const data = await this.orderService.getForecastRec(obj).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async ChangeForeCast() {
    if (!this.ForeCast) {
      return;
    }
    let currTab = this.CurrentTab;

    this.ProcessOrderLoading = true;

    if (currTab == 'CREATING') {
      let lReturn: any = await this.UpdateForecastData(this.PendingENT);
      if (lReturn == false) {
        alert(
          'Data extraction error, please check your estimated query data size and the Internet connection and try again.'
        );
      } else {
        console.log('CREATING -> lReturn -> ', lReturn);
        this.PendingENT = lReturn;
      }
    } else if (currTab == 'INCOMING') {
      let lReturn: any = await this.UpdateForecastData(this.IncomingData);
      if (lReturn == false) {
        alert(
          'Data extraction error, please check your estimated query data size and the Internet connection and try again.'
        );
      } else {
        console.log('Incoming -> lReturn -> ', lReturn);
        this.IncomingData = lReturn;
      }
    } else if (currTab == 'DETAILING') {
      let lReturn: any = await this.UpdateForecastData(this.PendingDET);
      if (lReturn == false) {
        alert(
          'Data extraction error, please check your estimated query data size and the Internet connection and try again.'
        );
      } else {
        console.log('DETAILING -> lReturn -> ', lReturn);
        this.PendingDET = lReturn;
      }
    } else if (currTab == 'CANCELLED') {
      let lReturn: any = await this.UpdateForecastData(this.CancelData);
      if (lReturn == false) {
        alert(
          'Data extraction error, please check your estimated query data size and the Internet connection and try again.'
        );
      } else {
        console.log('CANCELLED -> lReturn -> ', lReturn);
        this.CancelData = lReturn;
      }
    } else if (currTab == 'PROCESSING') {
      let lReturn: any = await this.UpdateForecastData(this.ProcessingData);
      if (lReturn == false) {
        alert(
          'Data extraction error, please check your estimated query data size and the Internet connection and try again.'
        );
      } else {
        console.log('PROCESSING -> lReturn -> ', lReturn);
        this.ProcessingData = lReturn;
      }
    }

    this.ProcessOrderLoading = false;
  }

  UpdateSelectedRecords(list: any) {
    if (this.selectedRow.length > 0) {
      for (let i = 0; i < this.selectedRow.length; i++) {
        this.UpdateDisplayFields();
        // this.AutoSelectRow(list);
        let jobId = this.selectedRow[i].JobID;

        list.forEach((x: { JobIDDis: any; isSelected: boolean }) => {
          if (x.JobIDDis == jobId) {
            this.selectedRow[i] = x;
            x.isSelected = true;
          }
        });
      }
    }

    if (this.selectedRow[0]) {
      let lremarks = this.selectedRow[0].OrderStatus;
      if (
        lremarks != 'Cancelled' &&
        lremarks != 'Processed' &&
        lremarks != 'Production' &&
        lremarks != 'Reviewed' &&
        lremarks != 'Delivered' &&
        lremarks != 'Partial Delivered'
      ) {
        this.SetRemarks(
          this.selectedRow[0].AdditionalRemark,
          this.selectedRow[0].SiteEngr_Name,
          this.selectedRow[0].SiteEngr_HP,
          this.selectedRow[0].Scheduler_Name,
          this.selectedRow[0].Scheduler_HP
        );
      }
    }

    return list;
  }

  UpdateSelectedRecordsSearch(list: any) {
    /**
     * Not being used Currently!!!
     */
    if (this.selectedRow.length > 0) {
      for (let i = 0; i < this.selectedRow.length; i++) {
        this.AutoSelectRow(list);
        let jobId = this.selectedRow[i].JobID;

        list.forEach((x: { JobIDDis: any; isSelected: boolean }) => {
          if (x.JobIDDis == jobId) {
            this.selectedRow[i] = x;
            x.isSelected = true;
          }
        });
      }
    }

    if (this.selectedRow[0]) {
      let lremarks = this.selectedRow[0].OrderStatus;
      if (
        lremarks != 'Cancelled' &&
        lremarks != 'Processed' &&
        lremarks != 'Production' &&
        lremarks != 'Reviewed' &&
        lremarks != 'Delivered' &&
        lremarks != 'Partial Delivered'
      ) {
        this.SetRemarks(
          this.selectedRow[0].AdditionalRemark,
          this.selectedRow[0].SiteEngr_Name,
          this.selectedRow[0].SiteEngr_HP,
          this.selectedRow[0].Scheduler_Name,
          this.selectedRow[0].Scheduler_HP
        );
      }
    }

    return list;
  }

  onTabDeselected(val: any) {
    console.log('Tab Deselected');
  }

  async UpdateForecastData(dataList: any) {
    console.log('dataList -> ', dataList);

    let obj: ForecastdataModel = {
      pOrderData: dataList,
    };

    let rList = await this.getForecastRec(obj);
    return rList;
  }

  GetAttachmentNumber() {
    let lRow = this.selectedRow[0];
    if (lRow) {
      if (lRow.AttachedNo) {
        return lRow.AttachedNo;
      }
    }
    return '';
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

  async SaveBBS(item: any) {
    let obj: SaveBBSOrderDetails = item;
    obj.BBSCopiedFrom = item.BBSCopiedFrom ? item.BBSCopiedFrom : '';
    obj.BBSNoNDS = item.BBSNoNDS ? item.BBSNoNDS : '';
    obj.BBSSORCoupler = item.BBSSORCoupler ? item.BBSSORCoupler : '';
    obj.UpdateBy = this.loginService.GetGroupName();
    obj.BBSNo = obj.BBSNo ? obj.BBSNo.toUpperCase() : obj.BBSNo; // Convert BBSNo to UpperCase

    //await this.checkBBSNo();
    let respSaveBBS = await this.SaveBBS_Process(obj);
    console.log('respSaveBBS', respSaveBBS);
    console.log('SaveBBS', item);

    if (respSaveBBS) {
      let lBBSNo = '';
      this.OrderDetailsList_BBS.forEach(
        (x) => (lBBSNo = lBBSNo + ',' + x.BBSNo)
      );
      lBBSNo = lBBSNo.slice(1, lBBSNo.length);
      console.log('lBBSNo', lBBSNo);

      this.selectedRow[0].BBSNo = lBBSNo;
      await this.checkBBSNo();
    } else {
      alert(
        'Error on updating data. Please check the Internet connection and try again.'
      );
    }
    // for (let i = 0; i < this.OrderSummaryTableData.length; i++) {
    //   item = this.OrderSummaryTableData[i];

    //   if (item.Product != 'CAB') {
    //     continue;
    //   }

    //   let obj: SaveBBSOrderDetails = item.BBS;
    //   obj.BBSNo = item.BBSNumnber;
    //   obj.BBSDesc = item.BBSDescription ? item.BBSDescription.trim() : '';
    //   obj.UpdateBy = this.loginService.GetGroupName();

    //   let respSaveBBS = await this.SaveBBS_Process(obj);
    //   console.log('respSaveBBS', respSaveBBS);
    // }
  }

  async SaveBBS_Process(obj: SaveBBSOrderDetails): Promise<any> {
    try {
      const data = await this.orderService.SaveBBS_Process(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  UpdateTotalWeight(list: any) {
    if (list) {
      list.forEach((x: { TotalWeight: string }) => {
        if (x.TotalWeight) {
          x.TotalWeight = this.ConverWeightFormat(x.TotalWeight);
        }
      });
    }
    return list;
  }

  ConverWeightFormat(weight: any) {
    return Number(weight).toFixed(3);
  }

  getExportObj(orderStatus: string) {
    let Datalist: any[] = [];
    if (orderStatus == 'INCOMING') {
      Datalist = this.incomingCols;
    } else if (orderStatus == 'CREATING') {
      Datalist = this.pendingEntCols;
    } else if (orderStatus == 'DETAILING') {
      Datalist = this.dettCols;
    } else if (orderStatus == 'CANCELLED') {
      Datalist = this.cancelledCols;
    }

    let lReturn = {
      OrderStatus: orderStatus,
      pColumnsID: [''],
      pColumnName: [''],
      pColumnSize: [10],
      Forecast: this.ForeCast,
      UserName: this.loginService.GetGroupName(),
    };
    lReturn.pColumnsID = [];
    lReturn.pColumnName = [];
    lReturn.pColumnSize = [];
    for (let i = 0; i < Datalist.length; i++) {
      if (Datalist[i].isVisible == true) {
        lReturn.pColumnsID.push(Datalist[i].colName);
        lReturn.pColumnName.push(Datalist[i].displayName);
        lReturn.pColumnSize.push(80);
      }
    }
    return lReturn;
  }
  ExportToExcel(orderStatus: string) {
    debugger;
    let obj = this.getExportObj(orderStatus);
    // let obj = {
    //   OrderStatus: orderStatus,
    //   pColumnsID: ['id', 'JobIDDis', 'OrderStatus', 'CustomerName'],
    //   pColumnName: ['S/No', 'Order No', 'Customer Status', 'Customer'],
    //   pColumnSize: [40, 40, 70, 100],
    //   Forecast: false,
    //   UserName: 'Ajitk_ttl@natsteel.com.sg',
    // };
    this.ProcessOrderLoading = true;
    this.orderService.ExcelExportIncoming(obj).subscribe({
      next: (data) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        a.download = 'ODOS_' + this.CurrentTab + '_ORDER_LIST' + '.xlsx';
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
      },
      error: (e) => {
        this.ProcessOrderLoading = false;
        alert(
          'Order printing failed, please check the Internet connection and try again.'
        );
      },
      complete: () => {
        this.ProcessOrderLoading = false;
      },
    });
  }

  getExportPOSearchObj(orderStatus: string) {
    let Datalist: any[] = [];
    if (orderStatus == 'PROCESSING') {
      Datalist = this.processingCols;
    } else if (orderStatus == 'ALL') {
      Datalist = this.allDataCols;
    } else if (orderStatus == 'SEARCH') {
      Datalist = this.searchCols;
    }
    let tempObjvalue: any = localStorage.getItem('OrderSearchModalValue');
    if (sessionStorage.getItem('OrderSearchModalValue')) {
      tempObjvalue = sessionStorage.getItem('OrderSearchModalValue');
    }
    tempObjvalue = JSON.parse(tempObjvalue);
    console.log('localStorage', localStorage.getItem('OrderSearchModalValue'));
    let lReturn: any;
    if (this.CurrentTab == 'SEARCH') {
      lReturn = {
        Category: orderStatus,
        OrigReqDateFrom: this.updateSearchFormattedDate(
          tempObjvalue.OrigReqDateFrom
        ),
        OrigReqDateTo: this.updateSearchFormattedDate(
          tempObjvalue.OrigReqDateTo
        ),
        RequiredDateFrom: this.updateSearchFormattedDate(
          tempObjvalue.RequiredDateFrom
        ),
        RequiredDateTo: this.updateSearchFormattedDate(
          tempObjvalue.RequiredDateTo
        ),
        PONo: tempObjvalue.PONo,
        BBSNo: tempObjvalue.BBSNo,
        CustomerName: tempObjvalue.CustomerName,
        ProjectTitle: tempObjvalue.ProjectTitle,
        ProductType: tempObjvalue.ProductType,
        ProjectPIC: tempObjvalue.ProjectPIC,
        DetailingPIC: tempObjvalue.DetailingPIC,
        SalesPIC: tempObjvalue.SalesPIC,
        SONo: tempObjvalue.SONo,
        SOR: tempObjvalue.SOR,
        PODateFrom: this.updateSearchFormattedDate(tempObjvalue.PODateFrom),
        PODateTo: this.updateSearchFormattedDate(tempObjvalue.PODateTo),
        WTNo: tempObjvalue.WTNo,
        LoadNo: tempObjvalue.LoadNo,
        CDelDateFrom: this.updateSearchFormattedDate(tempObjvalue.CDelDateFrom),
        CDelDateTo: this.updateSearchFormattedDate(tempObjvalue.CDelDateTo),
        DONo: tempObjvalue.DONo,
        InvNo: tempObjvalue.InvNo,
        OrderStatus: orderStatus,
        pColumnsID: [''],
        pColumnName: [''],
        pColumnSize: [10],
        Forecast: this.ForeCast,
        WBS1: tempObjvalue.WBS1,
        WBS2: tempObjvalue.WBS2,
        WBS3: tempObjvalue.WBS3,
      };
    } else {
      lReturn = {
        Category: orderStatus,
        OrigReqDateFrom: this.updateSearchFormattedDate(
          tempObjvalue.OrigReqDateFrom
        ),
        OrigReqDateTo: this.updateSearchFormattedDate(
          tempObjvalue.OrigReqDateTo
        ),
        RequiredDateFrom: this.updateSearchFormattedDate(
          tempObjvalue.RequiredDateFrom
        ),
        RequiredDateTo: this.updateSearchFormattedDate(
          tempObjvalue.RequiredDateTo
        ),
        PONo: '',
        BBSNo: '',
        CustomerName: '',
        ProjectTitle: [''],
        ProductType: [''],
        ProjectPIC: [''],
        DetailingPIC: [''],
        SalesPIC: [''],
        SONo: '',
        SOR: '',
        PODateFrom: '',
        PODateTo: '',
        WTNo: '',
        LoadNo: '',
        CDelDateFrom: '',
        CDelDateTo: '',
        DONo: '',
        InvNo: '',
        OrderStatus: '',
        pColumnsID: [''],
        pColumnName: [''],
        pColumnSize: [10],
        Forecast: this.ForeCast,
        WBS1: '',
        WBS2: '',
        WBS3: '',
      };
    }
    lReturn.pColumnsID = [];
    lReturn.pColumnName = [];
    lReturn.pColumnSize = [];
    for (let i = 0; i < Datalist.length; i++) {
      if (Datalist[i].isVisible == true) {
        lReturn.pColumnsID.push(Datalist[i].colName);
        lReturn.pColumnName.push(Datalist[i].displayName);
        lReturn.pColumnSize.push(80);
      }
    }
    return lReturn;
  }
  ExportToExcelPOSearch(orderStatus: string) {
    debugger;
    let obj = this.getExportPOSearchObj(orderStatus);
    // let obj = {
    //   OrderStatus: orderStatus,
    //   pColumnsID: ['id', 'JobIDDis', 'OrderStatus', 'CustomerName'],
    //   pColumnName: ['S/No', 'Order No', 'Customer Status', 'Customer'],
    //   pColumnSize: [40, 40, 70, 100],
    //   Forecast: false,
    //   UserName: 'Ajitk_ttl@natsteel.com.sg',
    // };
    this.ProcessOrderLoading = true;
    this.orderService.ExcelExportPO(obj).subscribe({
      next: (data) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        a.download = 'ODOS' + this.CurrentTab + '_ORDER_LIST' + '.xlsx';
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
      },
      error: (e) => {
        this.ProcessOrderLoading = false;
        alert(
          'Order printing failed, please check the Internet connection and try again.'
        );
      },
      complete: () => {
        this.ProcessOrderLoading = false;
      },
    });
  }

  pad(val: any, n: any) {
    var lNum = parseInt(val);
    var val1 = lNum.toString();
    if (val1.length < n) {
      for (var i = val1.length; i < n; i++) val1 = '0' + val1;
    }
    return val1;
  }
  getLeftSideWidth(itemIndex: number, array: any) {
    let width = 20;
    let newWidth = 0;
    for (let i = 0; i < itemIndex; i++) {
      if (array[i].isVisible) {
        newWidth += parseInt(array[i].width);
      }
    }
    width += newWidth;
    return width + 'px !important';
  }
  setColumStrucure() {
    if (localStorage.getItem('incomingCols')) {
      this.incomingCols = JSON.parse(localStorage.getItem('incomingCols')!);
    } else {
      this.incomingCols = [
        {
          width: '80',
          controlName: 'OrderNo',
          displayName: 'Order No',
          colName: 'JobIDDis',
          field: 'OrderNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CustomerStatus',
          displayName: 'Customer Status',
          colName: 'OrderStatus',
          field: 'CustomerStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Customer',
          displayName: 'Customer',
          colName: 'CustomerName',
          field: 'Customer',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Project',
          displayName: 'Project',
          colName: 'ProjectTitle',
          field: 'Project',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          colName: 'StructureElement',
          field: 'StructureElement',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProductType',
          displayName: 'Product Type',
          colName: 'ProdTypeDis',
          field: 'ProductType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS1',
          displayName: 'WBS1',
          colName: 'WBS1',
          field: 'WBS1',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS2',
          displayName: 'WBS2',
          colName: 'WBS2',
          field: 'WBS2',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS3',
          displayName: 'WBS3',
          colName: 'WBS3',
          field: 'WBS3',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PONo',
          displayName: 'PO No',
          colName: 'PONumber',
          field: 'PONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSNo',
          displayName: 'BBS No',
          colName: 'BBSNo',
          field: 'BBSNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PODate',
          displayName: 'PO Date',
          colName: 'PODate',
          field: 'PODate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          colName: 'OrigReqDate',
          field: 'RequiredDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RevisedReqDate',
          displayName: 'Revised Req Date',
          colName: 'RequiredDate',
          field: 'RevisedReqDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ForecastDate',
          displayName: 'Forecast Date',
          colName: 'ForecastDate',
          field: 'ForecastDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowerFloorDeliveryDate',
          displayName: 'Lower Floor Delivery Date',
          colName: 'LastDeliveryDate',
          field: 'LowerFloorDeliveryDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DifferentDays',
          displayName: 'Different Days',
          colName: 'DiffDays',
          field: 'DifferentDays',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ConfirmedDelDate',
          displayName: 'Plan Delivery Date',
          colName: 'PlanDelDate',
          field: 'ConfirmedDelDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalWT',
          displayName: 'Total WT',
          colName: 'TotalWeight',
          field: 'TotalWT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Transport',
          displayName: 'Transport',
          colName: 'TransportMode',
          field: 'Transport',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORNo',
          displayName: 'SOR No',
          colName: 'SORNoDis',
          field: 'SORNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SONo',
          displayName: 'SO No',
          colName: 'SAPSONo',
          field: 'SONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PMRemarks',
          displayName: 'PM Remarks',
          colName: 'PMDRemarks',
          field: 'PMRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TechRemarks',
          displayName: 'Tech Remarks',
          colName: 'TECHRemarks',
          field: 'TechRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'AttachedNo',
          displayName: 'Attached No',
          colName: 'AttachedNo',
          field: 'AttachedNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DataEnteredBy',
          displayName: 'Data Entered By',
          colName: 'DataEntryBy',
          field: 'DataEnteredBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          colName: 'UpdateBy',
          field: 'SubmittedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProjectIncharge',
          displayName: 'Project In-charge',
          colName: 'ProjectIncharge',
          field: 'ProjectIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DetailingIncharge',
          displayName: 'Detailing In-charge',
          colName: 'DetailingIncharge',
          field: 'DetailingIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessDate',
          displayName: 'Process Date',
          colName: 'ProcessDate',
          field: 'ProcessDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '20',
          controlName: 'linkTo',
          displayName: 'Link To',
          colName: 'linkTo',
          field: 'linkTo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
      ];
    }
    if (localStorage.getItem('pendingEntCols')) {
      this.pendingEntCols = JSON.parse(localStorage.getItem('pendingEntCols')!);
    } else {
      this.pendingEntCols = [
        {
          width: '80',
          controlName: 'OrderNo',
          displayName: 'Order No',
          colName: 'JobIDDis',
          field: 'OrderNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CustomerStatus',
          displayName: 'Customer Status',
          colName: 'OrderStatus',
          field: 'CustomerStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Customer',
          displayName: 'Customer',
          colName: 'CustomerName',
          field: 'CustomerName',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Project',
          displayName: 'Project',
          colName: 'ProjectTitle',
          field: 'Project',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          colName: 'StructureElement',
          field: 'StructureElement',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProductType',
          displayName: 'Product Type',
          colName: 'ProdTypeDis',
          field: 'ProductType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS1',
          displayName: 'WBS1',
          colName: 'WBS1',
          field: 'WBS1',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS2',
          displayName: 'WBS2',
          colName: 'WBS2',
          field: 'WBS2',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS3',
          displayName: 'WBS3',
          colName: 'WBS3',
          field: 'WBS3',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PONo',
          displayName: 'PO No',
          colName: 'PONumber',
          field: 'PONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSNo',
          displayName: 'BBS No',
          colName: 'BBSNo',
          field: 'BBSNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PODate',
          displayName: 'PO Date',
          colName: 'PODate',
          field: 'PODate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          colName: 'OrigReqDate',
          field: 'RequiredDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RevisedReqDate',
          displayName: 'Revised Req Date',
          colName: 'RequiredDate',
          field: 'RevisedReqDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ForecastDate',
          displayName: 'Forecast Date',
          colName: 'ForecastDate',
          field: 'ForecastDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowerFloorDeliveryDate',
          displayName: 'Lower Floor Delivery Date',
          colName: 'LastDeliveryDate',
          field: 'LowerFloorDeliveryDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DifferentDays',
          displayName: 'Different Days',
          colName: 'DiffDays',
          field: 'DifferentDays',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ConfirmedDelDate',
          displayName: 'Plan Delivery Date',
          colName: 'PlanDelDate',
          field: 'ConfirmedDelDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalWT',
          displayName: 'Total WT',
          colName: 'TotalWeight',
          field: 'TotalWT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Transport',
          displayName: 'Transport',
          colName: 'TransportMode',
          field: 'Transport',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORNo',
          displayName: 'SOR No',
          colName: 'SORNoDis',
          field: 'SORNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SONo',
          displayName: 'SO No',
          colName: 'SAPSONo',
          field: 'SONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PMRemarks',
          displayName: 'PM Remarks',
          colName: 'PMDRemarks',
          field: 'PMRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TechRemarks',
          displayName: 'Tech Remarks',
          colName: 'TECHRemarks',
          field: 'TechRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'AttachedNo',
          displayName: 'Attached No',
          colName: 'AttachedNo',
          field: 'AttachedNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DataEnteredBy',
          displayName: 'Data Entered By',
          colName: 'DataEntryBy',
          field: 'DataEnteredBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          colName: 'UpdateBy',
          field: 'SubmittedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProjectIncharge',
          displayName: 'Project In-charge',
          colName: 'ProjectIncharge',
          field: 'ProjectIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DetailingIncharge',
          displayName: 'Detailing In-charge',
          colName: 'DetailingIncharge',
          field: 'DetailingIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessDate',
          displayName: 'Process Date',
          colName: 'ProcessDate',
          field: 'ProcessDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '20',
          controlName: 'linkTo',
          displayName: 'Link To',
          colName: 'linkTo',
          field: 'linkTo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
      ];
    }
    if (localStorage.getItem('dettCols')) {
      this.dettCols = JSON.parse(localStorage.getItem('dettCols')!);
    } else {
      this.dettCols = [
        {
          width: '80',
          controlName: 'OrderNo',
          displayName: 'Order No',
          colName: 'JobIDDis',
          field: 'OrderNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CustomerStatus',
          displayName: 'Customer Status',
          colName: 'OrderStatus',
          field: 'CustomerStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Customer',
          displayName: 'Customer',
          colName: 'CustomerName',
          field: 'CustomerName',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Project',
          displayName: 'Project',
          colName: 'ProjectTitle',
          field: 'Project',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          colName: 'StructureElement',
          field: 'StructureElement',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProductType',
          displayName: 'Product Type',
          colName: 'ProdTypeDis',
          field: 'ProductType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS1',
          displayName: 'WBS1',
          colName: 'WBS1',
          field: 'WBS1',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS2',
          displayName: 'WBS2',
          colName: 'WBS2',
          field: 'WBS2',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS3',
          displayName: 'WBS3',
          colName: 'WBS3',
          field: 'WBS3',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PONo',
          displayName: 'PO No',
          colName: 'PONumber',
          field: 'PONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSNo',
          displayName: 'BBS No',
          colName: 'BBSNo',
          field: 'BBSNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PODate',
          displayName: 'PO Date',
          colName: 'PODate',
          field: 'PODate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          colName: 'OrigReqDate',
          field: 'RequiredDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RevisedReqDate',
          displayName: 'Revised Req Date',
          colName: 'RequiredDate',
          field: 'RevisedReqDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ForecastDate',
          displayName: 'Forecast Date',
          colName: 'ForecastDate',
          field: 'ForecastDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowerFloorDeliveryDate',
          displayName: 'Lower Floor Delivery Date',
          colName: 'LastDeliveryDate',
          field: 'LowerFloorDeliveryDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DifferentDays',
          displayName: 'Different Days',
          colName: 'DiffDays',
          field: 'DifferentDays',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ConfirmedDelDate',
          displayName: 'Plan Delivery Date',
          colName: 'PlanDelDate',
          field: 'ConfirmedDelDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalWT',
          displayName: 'Total WT',
          colName: 'TotalWeight',
          field: 'TotalWT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Transport',
          displayName: 'Transport',
          colName: 'TransportMode',
          field: 'Transport',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORNo',
          displayName: 'SOR No',
          colName: 'SORNoDis',
          field: 'SORNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SONo',
          displayName: 'SO No',
          colName: 'SAPSONo',
          field: 'SONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PMRemarks',
          displayName: 'PM Remarks',
          colName: 'PMDRemarks',
          field: 'PMRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TechRemarks',
          displayName: 'Tech Remarks',
          colName: 'TECHRemarks',
          field: 'TechRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'AttachedNo',
          displayName: 'Attached No',
          colName: 'AttachedNo',
          field: 'AttachedNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DataEnteredBy',
          displayName: 'Data Entered By',
          colName: 'DataEntryBy',
          field: 'DataEnteredBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          colName: 'UpdateBy',
          field: 'SubmittedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProjectIncharge',
          displayName: 'Project In-charge',
          colName: 'ProjectIncharge',
          field: 'ProjectIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DetailingIncharge',
          displayName: 'Detailing In-charge',
          colName: 'DetailingIncharge',
          field: 'DetailingIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessDate',
          displayName: 'Process Date',
          colName: 'ProcessDate',
          field: 'ProcessDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '20',
          controlName: 'linkTo',
          displayName: 'Link To',
          colName: 'linkTo',
          field: 'linkTo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
      ];
    }
    if (localStorage.getItem('cancelledCols')) {
      this.cancelledCols = JSON.parse(localStorage.getItem('cancelledCols')!);
    } else {
      this.cancelledCols = [
        {
          width: '80',
          controlName: 'OrderNo',
          displayName: 'Order No',
          colName: 'JobIDDis',
          field: 'OrderNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CustomerStatus',
          displayName: 'Customer Status',
          colName: 'OrderStatus',
          field: 'CustomerStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Customer',
          displayName: 'Customer',
          colName: 'CustomerName',
          field: 'CustomerName',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Project',
          displayName: 'Project',
          colName: 'ProjectTitle',
          field: 'Project',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          colName: 'StructureElement',
          field: 'StructureElement',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProductType',
          displayName: 'Product Type',
          colName: 'ProdTypeDis',
          field: 'ProductType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS1',
          displayName: 'WBS1',
          colName: 'WBS1',
          field: 'WBS1',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS2',
          displayName: 'WBS2',
          colName: 'WBS2',
          field: 'WBS2',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS3',
          displayName: 'WBS3',
          colName: 'WBS3',
          field: 'WBS3',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PONo',
          displayName: 'PO No',
          colName: 'PONumber',
          field: 'PONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSNo',
          displayName: 'BBS No',
          colName: 'BBSNo',
          field: 'BBSNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PODate',
          displayName: 'PO Date',
          colName: 'PODate',
          field: 'PODate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          colName: 'OrigReqDate',
          field: 'RequiredDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RevisedReqDate',
          displayName: 'Revised Req Date',
          colName: 'RequiredDate',
          field: 'RevisedReqDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ForecastDate',
          displayName: 'Forecast Date',
          colName: 'ForecastDate',
          field: 'ForecastDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowerFloorDeliveryDate',
          displayName: 'Lower Floor Delivery Date',
          colName: 'LastDeliveryDate',
          field: 'LowerFloorDeliveryDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DifferentDays',
          displayName: 'Different Days',
          colName: 'DiffDays',
          field: 'DifferentDays',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ConfirmedDelDate',
          displayName: 'Plan Delivery Date',
          colName: 'PlanDelDate',
          field: 'ConfirmedDelDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalWT',
          displayName: 'Total WT',
          colName: 'TotalWeight',
          field: 'TotalWT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Transport',
          displayName: 'Transport',
          colName: 'TransportMode',
          field: 'Transport',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORNo',
          displayName: 'SOR No',
          colName: 'SORNoDis',
          field: 'SORNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SONo',
          displayName: 'SO No',
          colName: 'SAPSONo',
          field: 'SONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PMRemarks',
          displayName: 'PM Remarks',
          colName: 'PMDRemarks',
          field: 'PMRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TechRemarks',
          displayName: 'Tech Remarks',
          colName: 'TECHRemarks',
          field: 'TechRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'AttachedNo',
          displayName: 'Attached No',
          colName: 'AttachedNo',
          field: 'AttachedNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DataEnteredBy',
          displayName: 'Data Entered By',
          colName: 'DataEntryBy',
          field: 'DataEnteredBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          colName: 'UpdateBy',
          field: 'SubmittedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProjectIncharge',
          displayName: 'Project In-charge',
          colName: 'ProjectIncharge',
          field: 'ProjectIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DetailingIncharge',
          displayName: 'Detailing In-charge',
          colName: 'DetailingIncharge',
          field: 'DetailingIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessDate',
          displayName: 'Process Date',
          colName: 'ProcessDate',
          field: 'ProcessDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '20',
          controlName: 'linkTo',
          displayName: 'Link To',
          colName: 'linkTo',
          field: 'linkTo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
      ];
    }
    if (localStorage.getItem('processingCols')) {
      this.processingCols = JSON.parse(localStorage.getItem('processingCols')!);
    } else {
      this.processingCols = [
        {
          width: '80',
          controlName: 'SOrderNo',
          displayName: 'Order No',
          colName: 'JobID',
          field: 'OrderNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORNo',
          displayName: 'SOR No',
          colName: 'SORNoDis',
          field: 'SORNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SONo',
          displayName: 'SO No',
          colName: 'SAPSONo',
          field: 'SONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CustomerStatus',
          displayName: 'Customer Status',
          colName: 'OrderStatus',
          field: 'CustomerStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SAPRejectStatus',
          displayName: 'SAP Reject Status',
          colName: 'SO_REJECT_STATUS',
          field: 'SAPRejectStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          colName: 'StructureElement',
          field: 'StructureElement',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProductType',
          displayName: 'Product Type',
          colName: 'ProdTypeDis',
          field: 'ProductType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PONo',
          displayName: 'PO No',
          colName: 'PONumber',
          field: 'PONumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSNo',
          displayName: 'BBS No',
          colName: 'BBSNo',
          field: 'BBSNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSDescription',
          displayName: 'BBS Description',
          colName: 'BBSDesc',
          field: 'BBSDesc',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PODate',
          displayName: 'PO Date',
          colName: 'PODate',
          field: 'PODate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          colName: 'OrigReqDate',
          field: 'RequiredDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RevisedReqDate',
          displayName: 'Revised Req Date',
          colName: 'RequiredDate',
          field: 'RevisedReqDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ForecastDate',
          displayName: 'Forecast Date',
          colName: 'ForecastDate',
          field: 'ForecastDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowerFloorDeliveryDate',
          displayName: 'Lower Floor Delivery Date',
          colName: 'LastDeliveryDate',
          field: 'LowerFloorDeliveryDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DifferentDays',
          displayName: 'Different Days',
          colName: 'DiffDays',
          field: 'DifferentDays',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ConfirmedDelDate',
          displayName: 'Plan Delivery Date',
          colName: 'PlanDelDate',
          field: 'ConfirmedDelDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalWT',
          displayName: 'Total WT',
          colName: 'TotalWeight',
          field: 'TotalWT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalMT',
          displayName: 'Total MT(HMI)',
          colName: 'Total_MT_SAPY',
          field: 'TotalMT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PMRemarks',
          displayName: 'PM Remarks',
          colName: 'PMDRemarks',
          field: 'PMRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TechRemarks',
          displayName: 'Tech Remarks',
          colName: 'TECHRemarks',
          field: 'TechRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessedBy',
          displayName: 'Processed By',
          colName: 'UserID',
          field: 'ProcessedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Customer',
          displayName: 'Customer',
          colName: 'CustomerName',
          field: 'CustomerName',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Project',
          displayName: 'Project',
          colName: 'ProjectTitle',
          field: 'Project',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS1',
          displayName: 'WBS1',
          colName: 'WBS1',
          field: 'WBS1',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS2',
          displayName: 'WBS2',
          colName: 'WBS2',
          field: 'WBS2',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS3',
          displayName: 'WBS3',
          colName: 'WBS3',
          field: 'WBS3',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          colName: 'UpdateBy',
          field: 'SubmittedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProjectIncharge',
          displayName: 'Project In-charge',
          colName: 'ProjectIncharge',
          field: 'ProjectIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DetailingIncharge',
          displayName: 'Detailing In-charge',
          colName: 'DetailingIncharge',
          field: 'DetailingIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PPContract',
          displayName: 'PP Contract',
          colName: 'PPContract',
          field: 'PPContract',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'OrderType',
          displayName: 'Order Type',
          colName: 'OrderType',
          field: 'OrderType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ContractNumber',
          displayName: 'Contract Number',
          colName: 'ContractNo',
          field: 'ContractNumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORStatus',
          displayName: 'SOR Status',
          colName: 'SORStatus',
          field: 'SORStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CreditBlockStatus',
          displayName: 'Credit / Delivery Block Status',
          colName: 'CreditStatus',
          field: 'CreditBlockStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ErrorLog',
          displayName: 'Error Log',
          colName: 'ERROR_CD',
          field: 'ErrorLog',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'InternalRemark',
          displayName: 'Internal Remarks',
          colName: 'Int_Remark',
          field: 'InternalRemark',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ExternalRemark',
          displayName: 'External Remarks',
          colName: 'Ext_Remark',
          field: 'ExternalRemark',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LoadNumber',
          displayName: 'Load Number',
          colName: 'LoadNo',
          field: 'LoadNumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DeliveryStatus',
          displayName: 'Delivery Status',
          colName: 'DeliveryStatus',
          field: 'DeliveryStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DONo',
          displayName: 'DO No',
          colName: 'DeliveryNo',
          field: 'DONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WTNo',
          displayName: 'WT No',
          colName: 'Wt_No',
          field: 'WTNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WTDate',
          displayName: 'WT Date',
          colName: 'Wt_Date',
          field: 'WTDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DeliveredPieces',
          displayName: 'Delivered Pieces',
          colName: 'DeliveredPcs',
          field: 'DeliveredPieces',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BalancePieces',
          displayName: 'Balance Pieces',
          colName: 'BalancePCS',
          field: 'BalancePieces',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'UrgentOrder',
          displayName: 'Urgent Order',
          colName: 'URG_ORD_IND',
          field: 'UrgentOrder',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ZeroTolerance',
          displayName: 'Zero Tolerance',
          colName: 'ZERO_TOLERANCE_I',
          field: 'ZeroTolerance',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CallBefDel',
          displayName: 'Call Bef Del',
          colName: 'CALL_BEF_DEL_IND',
          field: 'CallBefDel',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SpecialPass',
          displayName: 'Spec Pass',
          colName: 'SPECIAL_PASS_IND',
          field: 'SpecialPass',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LorryCrane',
          displayName: 'Lorry Crane',
          colName: 'LORRY_CRANE_IND',
          field: 'LorryCrane',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PremiumService',
          displayName: 'Premium Service',
          colName: 'PRM_SVC_IND',
          field: 'PremiumService',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CraneBook',
          displayName: 'Crane Book',
          colName: 'CRN_BKD_IND',
          field: 'CraneBook',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BargeBook',
          displayName: 'Barge Book',
          colName: 'BRG_BKD_IND',
          field: 'BargeBook',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PoliceEscort',
          displayName: 'Police Escort',
          colName: 'POL_ESC_IND',
          field: 'PoliceEscort',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ONHOLD',
          displayName: 'ON HOLD',
          colName: 'ON_HOLD_IND',
          field: 'ONHOLD',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CONQUAS',
          displayName: 'CONQUAS',
          colName: 'CONQUAS_IND',
          field: 'CONQUAS',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowBedAllowed',
          displayName: 'Low Bed Allowed',
          colName: 'LOW_BED_IND',
          field: 'LowBedAllowed',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'FiftyTonAllowed',
          displayName: '50 Ton Allowed',
          colName: 'T50_VEH_IND',
          field: 'FiftyTonAllowed',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Transport',
          displayName: 'Transport',
          colName: 'TransportLimit',
          field: 'Transport',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubSegment',
          displayName: 'Sub Segment',
          colName: 'SubSegment',
          field: 'SubSegment',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'NDSStatus',
          displayName: 'NDS Status',
          colName: 'NDSStatus',
          field: 'NDSStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ReleasedBy',
          displayName: 'Released By',
          colName: 'DetailerName',
          field: 'ReleasedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ReleasedDate',
          displayName: 'Released Date',
          colName: 'NDSReleaseTime',
          field: 'ReleasedDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RuningNo',
          displayName: 'Running No.',
          colName: 'RunNo',
          field: 'RuningNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LeadTime',
          displayName: 'Lead Time(Days)',
          colName: 'Cust_Lead_Time',
          field: 'LeadTime',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessDate',
          displayName: 'Process Date',
          colName: 'ProcessDate',
          field: 'ProcessDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'AccountManager',
          displayName: 'Account Manager',
          colName: 'AccManager',
          field: 'AccountManager',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Documents',
          displayName: 'Documents',
          colName: 'AttachedNo',
          field: 'Documents',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '20',
          controlName: 'linkTo',
          displayName: 'Link To',
          colName: 'linkTo',
          field: 'linkTo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
      ];
    }
    if (localStorage.getItem('allDataCols')) {
      this.allDataCols = JSON.parse(localStorage.getItem('allDataCols')!);
    } else {
      this.allDataCols = [
        {
          width: '80',
          controlName: 'SOrderNo',
          displayName: 'Order No',
          colName: 'JobID',
          field: 'OrderNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORNo',
          displayName: 'SOR No',
          colName: 'SORNoDis',
          field: 'SORNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SONo',
          displayName: 'SO No',
          colName: 'SAPSONo',
          field: 'SONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CustomerStatus',
          displayName: 'Customer Status',
          colName: 'OrderStatus',
          field: 'CustomerStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SAPRejectStatus',
          displayName: 'SAP Reject Status',
          colName: 'SO_REJECT_STATUS',
          field: 'SAPRejectStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          colName: 'StructureElement',
          field: 'StructureElement',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProductType',
          displayName: 'Product Type',
          colName: 'ProdTypeDis',
          field: 'ProductType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PONo',
          displayName: 'PO No',
          colName: 'PONumber',
          field: 'PONumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSNo',
          displayName: 'BBS No',
          colName: 'BBSNo',
          field: 'BBSNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSDescription',
          displayName: 'BBS Description',
          colName: 'BBSDesc',
          field: 'BBSDesc',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PODate',
          displayName: 'PO Date',
          colName: 'PODate',
          field: 'PODate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          colName: 'OrigReqDate',
          field: 'RequiredDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RevisedReqDate',
          displayName: 'Revised Req Date',
          colName: 'RequiredDate',
          field: 'RevisedReqDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ForecastDate',
          displayName: 'Forecast Date',
          colName: 'ForecastDate',
          field: 'ForecastDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowerFloorDeliveryDate',
          displayName: 'Lower Floor Delivery Date',
          colName: 'LastDeliveryDate',
          field: 'LowerFloorDeliveryDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DifferentDays',
          displayName: 'Different Days',
          colName: 'DiffDays',
          field: 'DifferentDays',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ConfirmedDelDate',
          displayName: 'Plan Delivery Date',
          colName: 'PlanDelDate',
          field: 'ConfirmedDelDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalWT',
          displayName: 'Total WT',
          colName: 'TotalWeight',
          field: 'TotalWT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalMT',
          displayName: 'Total MT(HMI)',
          colName: 'Total_MT_SAPY',
          field: 'TotalMT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PMRemarks',
          displayName: 'PM Remarks',
          colName: 'PMDRemarks',
          field: 'PMRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TechRemarks',
          displayName: 'Tech Remarks',
          colName: 'TECHRemarks',
          field: 'TechRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessedBy',
          displayName: 'Processed By',
          colName: 'UserID',
          field: 'ProcessedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Customer',
          displayName: 'Customer',
          colName: 'CustomerName',
          field: 'CustomerName',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Project',
          displayName: 'Project',
          colName: 'ProjectTitle',
          field: 'Project',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS1',
          displayName: 'WBS1',
          colName: 'WBS1',
          field: 'WBS1',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS2',
          displayName: 'WBS2',
          colName: 'WBS2',
          field: 'WBS2',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS3',
          displayName: 'WBS3',
          colName: 'WBS3',
          field: 'WBS3',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          colName: 'UpdateBy',
          field: 'SubmittedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProjectIncharge',
          displayName: 'Project In-charge',
          colName: 'ProjectIncharge',
          field: 'ProjectIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DetailingIncharge',
          displayName: 'Detailing In-charge',
          colName: 'DetailingIncharge',
          field: 'DetailingIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PPContract',
          displayName: 'PP Contract',
          colName: 'PPContract',
          field: 'PPContract',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'OrderType',
          displayName: 'Order Type',
          colName: 'OrderType',
          field: 'OrderType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ContractNumber',
          displayName: 'Contract Number',
          colName: 'ContractNo',
          field: 'ContractNumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORStatus',
          displayName: 'SOR Status',
          colName: 'SORStatus',
          field: 'SORStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CreditBlockStatus',
          displayName: 'Credit / Delivery Block Status',
          colName: 'CreditStatus',
          field: 'CreditBlockStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'InternalRemark',
          displayName: 'Internal Remarks',
          colName: 'Int_Remark',
          field: 'InternalRemark',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ExternalRemark',
          displayName: 'External Remarks',
          colName: 'Ext_Remark',
          field: 'ExternalRemark',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LoadNumber',
          displayName: 'Load Number',
          colName: 'LoadNo',
          field: 'LoadNumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DeliveryStatus',
          displayName: 'Delivery Status',
          colName: 'DeliveryStatus',
          field: 'DeliveryStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DONo',
          displayName: 'DO No',
          colName: 'DeliveryNo',
          field: 'DONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WTNo',
          displayName: 'WT No',
          colName: 'Wt_No',
          field: 'WTNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WTDate',
          displayName: 'WT Date',
          colName: 'Wt_Date',
          field: 'WTDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DeliveredPieces',
          displayName: 'Delivered Pieces',
          colName: 'DeliveredPcs',
          field: 'DeliveredPieces',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BalancePieces',
          displayName: 'Balance Pieces',
          colName: 'BalancePCS',
          field: 'BalancePieces',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'UrgentOrder',
          displayName: 'Urgent Order',
          colName: 'URG_ORD_IND',
          field: 'UrgentOrder',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ZeroTolerance',
          displayName: 'Zero Tolerance',
          colName: 'ZERO_TOLERANCE_I',
          field: 'ZeroTolerance',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CallBefDel',
          displayName: 'Call Bef Del',
          colName: 'CALL_BEF_DEL_IND',
          field: 'CallBefDel',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SpecialPass',
          displayName: 'Spec Pass',
          colName: 'SPECIAL_PASS_IND',
          field: 'SpecialPass',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LorryCrane',
          displayName: 'Lorry Crane',
          colName: 'LORRY_CRANE_IND',
          field: 'LorryCrane',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PremiumService',
          displayName: 'Premium Service',
          colName: 'PRM_SVC_IND',
          field: 'PremiumService',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CraneBook',
          displayName: 'Crane Book',
          colName: 'CRN_BKD_IND',
          field: 'CraneBook',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BargeBook',
          displayName: 'Barge Book',
          colName: 'BRG_BKD_IND',
          field: 'BargeBook',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PoliceEscort',
          displayName: 'Police Escort',
          colName: 'POL_ESC_IND',
          field: 'PoliceEscort',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ONHOLD',
          displayName: 'ON HOLD',
          colName: 'ON_HOLD_IND',
          field: 'ONHOLD',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CONQUAS',
          displayName: 'CONQUAS',
          colName: 'CONQUAS_IND',
          field: 'CONQUAS',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowBedAllowed',
          displayName: 'Low Bed Allowed',
          colName: 'LOW_BED_IND',
          field: 'LowBedAllowed',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'FiftyTonAllowed',
          displayName: '50 Ton Allowed',
          colName: 'T50_VEH_IND',
          field: 'FiftyTonAllowed',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Transport',
          displayName: 'Transport',
          colName: 'TransportLimit',
          field: 'Transport',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubSegment',
          displayName: 'Sub Segment',
          colName: 'SubSegment',
          field: 'SubSegment',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'NDSStatus',
          displayName: 'NDS Status',
          colName: 'NDSStatus',
          field: 'NDSStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ReleasedBy',
          displayName: 'Released By',
          colName: 'DetailerName',
          field: 'ReleasedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ReleasedDate',
          displayName: 'Released Date',
          colName: 'NDSReleaseTime',
          field: 'ReleasedDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RuningNo',
          displayName: 'Running No.',
          colName: 'RunNo',
          field: 'RuningNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LeadTime',
          displayName: 'Lead Time(Days)',
          colName: 'Cust_Lead_Time',
          field: 'LeadTime',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessDate',
          displayName: 'Process Date',
          colName: 'ProcessDate',
          field: 'ProcessDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'AccountManager',
          displayName: 'Account Manager',
          colName: 'AccManager',
          field: 'AccountManager',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Documents',
          displayName: 'Attachments',
          colName: 'AttachedNo',
          field: 'Documents',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '20',
          controlName: 'linkTo',
          displayName: 'Link To',
          colName: 'viewlink',
          field: 'linkTo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
      ];
    }
    if (localStorage.getItem('searchCols')) {
      this.searchCols = JSON.parse(localStorage.getItem('searchCols')!);
    } else {
      this.searchCols = [
        {
          width: '80',
          controlName: 'SOrderNo',
          displayName: 'Order No',
          colName: 'JobID',
          field: 'OrderNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORNo',
          displayName: 'SOR No',
          colName: 'SORNoDis',
          field: 'SORNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SONo',
          displayName: 'SO No',
          colName: 'SAPSONo',
          field: 'SONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CustomerStatus',
          displayName: 'Customer Status',
          colName: 'OrderStatus',
          field: 'CustomerStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SAPRejectStatus',
          displayName: 'SAP Reject Status',
          colName: 'SO_REJECT_STATUS',
          field: 'SAPRejectStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          colName: 'StructureElement',
          field: 'StructureElement',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProductType',
          displayName: 'Product Type',
          colName: 'ProdTypeDis',
          field: 'ProductType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PONo',
          displayName: 'PO No',
          colName: 'PONumber',
          field: 'PONumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSNo',
          displayName: 'BBS No',
          colName: 'BBSNo',
          field: 'BBSNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BBSDescription',
          displayName: 'BBS Description',
          colName: 'BBSDesc',
          field: 'BBSDesc',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PODate',
          displayName: 'PO Date',
          colName: 'PODate',
          field: 'PODate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RequiredDate',
          displayName: 'Required Date',
          colName: 'OrigReqDate',
          field: 'RequiredDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RevisedReqDate',
          displayName: 'Revised Req Date',
          colName: 'RequiredDate',
          field: 'RevisedReqDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ForecastDate',
          displayName: 'Forecast Date',
          colName: 'ForecastDate',
          field: 'ForecastDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowerFloorDeliveryDate',
          displayName: 'Lower Floor Delivery Date',
          colName: 'LastDeliveryDate',
          field: 'LowerFloorDeliveryDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DifferentDays',
          displayName: 'Different Days',
          colName: 'DiffDays',
          field: 'DifferentDays',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ConfirmedDelDate',
          displayName: 'Plan Delivery Date',
          colName: 'PlanDelDate',
          field: 'ConfirmedDelDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalWT',
          displayName: 'Total WT',
          colName: 'TotalWeight',
          field: 'TotalWT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TotalMT',
          displayName: 'Total MT(HMI)',
          colName: 'Total_MT_SAPY',
          field: 'TotalMT',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PMRemarks',
          displayName: 'PM Remarks',
          colName: 'PMDRemarks',
          field: 'PMRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'TechRemarks',
          displayName: 'Tech Remarks',
          colName: 'TECHRemarks',
          field: 'TechRemarks',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessedBy',
          displayName: 'Processed By',
          colName: 'UserID',
          field: 'ProcessedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Customer',
          displayName: 'Customer',
          colName: 'CustomerName',
          field: 'CustomerName',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Project',
          displayName: 'Project',
          colName: 'ProjectTitle',
          field: 'Project',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS1',
          displayName: 'WBS1',
          colName: 'WBS1',
          field: 'WBS1',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS2',
          displayName: 'WBS2',
          colName: 'WBS2',
          field: 'WBS2',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WBS3',
          displayName: 'WBS3',
          colName: 'WBS3',
          field: 'WBS3',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubmittedBy',
          displayName: 'Submitted By',
          colName: 'UpdateBy',
          field: 'SubmittedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProjectIncharge',
          displayName: 'Project In-charge',
          colName: 'ProjectIncharge',
          field: 'ProjectIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DetailingIncharge',
          displayName: 'Detailing In-charge',
          colName: 'DetailingIncharge',
          field: 'DetailingIncharge',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PPContract',
          displayName: 'PP Contract',
          colName: 'PPContract',
          field: 'PPContract',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'OrderType',
          displayName: 'Order Type',
          colName: 'OrderType',
          field: 'OrderType',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ContractNumber',
          displayName: 'Contract Number',
          colName: 'ContractNo',
          field: 'ContractNumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SORStatus',
          displayName: 'SOR Status',
          colName: 'SORStatus',
          field: 'SORStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CreditBlockStatus',
          displayName: 'Credit/Delivery',
          colName: 'CreditStatus',
          field: 'CreditBlockStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ErrorLog',
          displayName: 'Error Log',
          colName: 'ERROR_CD',
          field: 'ErrorLog',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'InternalRemark',
          displayName: 'Internal Remarks',
          colName: 'Int_Remark',
          field: 'InternalRemark',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ExternalRemark',
          displayName: 'External Remarks',
          colName: 'Ext_Remark',
          field: 'ExternalRemark',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LoadNumber',
          displayName: 'Load Number',
          colName: 'LoadNo',
          field: 'LoadNumber',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DeliveryStatus',
          displayName: 'Delivery Status',
          colName: 'DeliveryStatus',
          field: 'DeliveryStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DONo',
          displayName: 'DO No',
          colName: 'DeliveryNo',
          field: 'DONo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WTNo',
          displayName: 'WT No',
          colName: 'Wt_No',
          field: 'WTNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'WTDate',
          displayName: 'WT Date',
          colName: 'Wt_Date',
          field: 'WTDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'DeliveredPieces',
          displayName: 'Delivered Pieces',
          colName: 'DeliveredPcs',
          field: 'DeliveredPieces',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BalancePieces',
          displayName: 'Balance Pieces',
          colName: 'BalancePCS',
          field: 'BalancePieces',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'UrgentOrder',
          displayName: 'Urgent Order',
          colName: 'URG_ORD_IND',
          field: 'UrgentOrder',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ZeroTolerance',
          displayName: 'Zero Tolerance',
          colName: 'ZERO_TOLERANCE_I',
          field: 'ZeroTolerance',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CallBefDel',
          displayName: 'Call Bef Del',
          colName: 'CALL_BEF_DEL_IND',
          field: 'CallBefDel',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SpecialPass',
          displayName: 'Spec Pass',
          colName: 'SPECIAL_PASS_IND',
          field: 'SpecialPass',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LorryCrane',
          displayName: 'Lorry Crane',
          colName: 'LORRY_CRANE_IND',
          field: 'LorryCrane',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PremiumService',
          displayName: 'Premium Service',
          colName: 'PRM_SVC_IND',
          field: 'PremiumService',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CraneBook',
          displayName: 'Crane Book',
          colName: 'CRN_BKD_IND',
          field: 'CraneBook',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'BargeBook',
          displayName: 'Barge Book',
          colName: 'BRG_BKD_IND',
          field: 'BargeBook',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'PoliceEscort',
          displayName: 'Police Escort',
          colName: 'POL_ESC_IND',
          field: 'PoliceEscort',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ONHOLD',
          displayName: 'ON HOLD',
          colName: 'ON_HOLD_IND',
          field: 'ONHOLD',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'CONQUAS',
          displayName: 'CONQUAS',
          colName: 'CONQUAS_IND',
          field: 'CONQUAS',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LowBedAllowed',
          displayName: 'Low Bed Allowed',
          colName: 'LOW_BED_IND',
          field: 'LowBedAllowed',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'FiftyTonAllowed',
          displayName: '50 Ton Allowed',
          colName: 'T50_VEH_IND',
          field: 'FiftyTonAllowed',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Transport',
          displayName: 'Transport',
          colName: 'TransportLimit',
          field: 'Transport',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'SubSegment',
          displayName: 'Sub Segment',
          colName: 'SubSegment',
          field: 'SubSegment',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'NDSStatus',
          displayName: 'NDS Status',
          colName: 'NDSStatus',
          field: 'NDSStatus',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ReleasedBy',
          displayName: 'Released By',
          colName: 'DetailerName',
          field: 'ReleasedBy',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ReleasedDate',
          displayName: 'Released Date',
          colName: 'NDSReleaseTime',
          field: 'ReleasedDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'RuningNo',
          displayName: 'Running No.',
          colName: 'RunNo',
          field: 'RuningNo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'LeadTime',
          displayName: 'Lead Time(Days)',
          colName: 'Cust_Lead_Time',
          field: 'LeadTime',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'ProcessDate',
          displayName: 'Process Date',
          colName: 'ProcessDate',
          field: 'ProcessDate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'AccountManager',
          displayName: 'Account Manager',
          colName: 'AccManager',
          field: 'AccountManager',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Documents',
          displayName: 'Documents',
          colName: 'AttachedNo',
          field: 'Documents',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
        {
          width: '20',
          controlName: 'linkTo',
          displayName: 'Link To',
          colName: 'linkTo',
          field: 'linkTo',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        },
      ];
    }
  }

  getRightWidthTest(element: HTMLElement, j: number, arrayName: string) {
    let width = this.getAllPreviousSiblings(element);
    // console.log('previousSibling=>', width);

    this.setLeftOfTabble(arrayName, j, width);
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
  setLeftOfTabble(arrayName: string, index: number, width: any) {
    if (arrayName == 'pendingENT') {
      this.pendingEntCols[index]['left'] = width;
    } else if (arrayName == 'incoming') {
      this.incomingCols[index]['left'] = width;
    } else if (arrayName == 'pendingDET') {
      this.dettCols[index]['left'] = width;
    } else if (arrayName == 'cancelled') {
      this.cancelledCols[index]['left'] = width;
    } else if (arrayName == 'processing') {
      this.processingCols[index]['left'] = width;
    } else if (arrayName == 'all') {
      this.allDataCols[index]['left'] = width;
    } else if (arrayName == 'search') {
      this.searchCols[index]['left'] = width;
    }
  }

  getLeftOfTable(arrayName: string, index: number) {
    if (arrayName == 'pendingENT') {
      console.log(
        "this.pendingEntCols[index]['left']=>",
        this.pendingEntCols[index]['left'] + 'px'
      );
      return this.pendingEntCols[index]['left'] + 'px';
    } else if (arrayName == 'incoming') {
      return this.incomingCols[index]['left'] + 'px';
    } else if (arrayName == 'pendingDET') {
      return this.dettCols[index]['left'] + 'px';
    } else if (arrayName == 'cancelled') {
      return this.cancelledCols[index]['left'] + 'px';
    } else if (arrayName == 'processing') {
      return this.processingCols[index]['left'] + 'px';
    } else if (arrayName == 'all') {
      return this.allDataCols[index]['left'] + 'px';
    } else if (arrayName == 'search') {
      return this.searchCols[index]['left'] + 'px';
    } else {
      return 'inherit';
    }
  }
  UpdateRemarksLength(item: string) {
    if (item.length > 100) {
      item = item.substring(0, 100);
    }
    return item;
  }

  setActiveTab(index: number) {
    this.itemSize = 30;
    this.activeTab = index;
    this.ResetProcessField();
  }
  showPopup: boolean = false;
  openPopup(name: string) {
    this.showPopup = true;
  }
  closePopup() {
    if (this.activeTab === 0) {
      localStorage.setItem(
        'pendingEntFixedColumn',
        this.pendingEntFixedColumn.toString()
      );
    }
    if (this.activeTab === 1) {
      localStorage.setItem(
        'incomingFixedColumn',
        this.incomingFixedColumn.toString()
      );
    }
    if (this.activeTab === 2) {
      localStorage.setItem('detFixedColumn', this.detFixedColumn.toString());
    }
    if (this.activeTab === 3) {
      localStorage.setItem(
        'cancelledFixedColumn',
        this.cancelledFixedColumn.toString()
      );
    }
    if (this.activeTab === 4) {
      localStorage.setItem(
        'processingFixedColumn',
        this.processingFixedColumn.toString()
      );
    }
    if (this.activeTab === 5) {
      localStorage.setItem('allFixedColumn', this.allFixedColumn.toString());
    }
    if (this.activeTab === 6) {
      localStorage.setItem(
        'searchFixedColumn',
        this.searchFixedColumn.toString()
      );
    }
    this.showPopup = false;
  }
  saveColumnsToLocalStorage(colName: string, array: any) {
    localStorage.setItem(colName, JSON.stringify(array));
    //this.toastr.success('Column Size and visibility updated sucessfully');
  }
  widthChangeCompletedStore() {
    localStorage.setItem('incomingCols', JSON.stringify(this.incomingCols));
    localStorage.setItem('pendingEntCols', JSON.stringify(this.pendingEntCols));
    localStorage.setItem('dettCols', JSON.stringify(this.dettCols));
    localStorage.setItem('cancelledCols', JSON.stringify(this.cancelledCols));
    localStorage.setItem('processingCols', JSON.stringify(this.processingCols));
    localStorage.setItem('allDataCols', JSON.stringify(this.allDataCols));
    localStorage.setItem('searchCols', JSON.stringify(this.searchCols));
  }
  onWidthChange(obj: any) {
    if (obj.colName == 'pendingENT') {
      this.pendingEntCols[obj.index].resizeWidth = obj.width;
      this.pendingEntCols[obj.index].width = obj.width;
      console.log(
        'onWidthChangependingEntCols=>',
        obj,
        this.pendingEntCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('pendingEntCols', this.pendingEntCols);
    }
    if (obj.colName == 'incoming') {
      this.incomingCols[obj.index].resizeWidth = obj.width;
      this.incomingCols[obj.index].width = obj.width;
      console.log(
        'onWidthChange=>',
        obj,
        this.incomingCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('incomingCols', this.incomingCols);
    }
    if (obj.colName == 'pendingDET') {
      this.dettCols[obj.index].resizeWidth = obj.width;
      this.dettCols[obj.index].width = obj.width;
      console.log(
        'onWidthChangedettCols=>',
        obj,
        this.dettCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('dettCols', this.dettCols);
    }
    if (obj.colName == 'cancelled') {
      this.cancelledCols[obj.index].resizeWidth = obj.width;
      this.cancelledCols[obj.index].width = obj.width;
      console.log(
        'onWidthChangecancelledCols=>',
        obj,
        this.cancelledCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('cancelledCols', this.cancelledCols);
    }
    if (obj.colName == 'processing') {
      this.processingCols[obj.index].resizeWidth = obj.width;
      this.processingCols[obj.index].width = obj.width;
      console.log(
        'onWidthChangeprocessingCols=>',
        obj,
        this.processingCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('processingCols', this.processingCols);
    }
    if (obj.colName == 'all') {
      this.allDataCols[obj.index].resizeWidth = obj.width;
      this.allDataCols[obj.index].width = obj.width;
      console.log(
        'onWidthChangeallDataCols=>',
        obj,
        this.allDataCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('allDataCols', this.allDataCols);
    }
    if (obj.colName == 'search') {
      this.searchCols[obj.index].resizeWidth = obj.width;
      this.searchCols[obj.index].width = obj.width;
      console.log(
        'onWidthChangesearchCols=>',
        obj,
        this.searchCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('searchCols', this.searchCols);
    }
  }
  ProcessorderCheckboxreset() {
    this.ProcessorderCheckbox.controls.UrgentOrder.patchValue(false);
    this.ProcessorderCheckbox.controls.Conquas.patchValue(false);
    this.ProcessorderCheckbox.controls.Crane.patchValue(false);
    this.ProcessorderCheckbox.controls.PremiumService.patchValue(false);
    this.ProcessorderCheckbox.controls.ZeroTol.patchValue(false);
    this.ProcessorderCheckbox.controls.CallBDel.patchValue(true);
    this.ProcessorderCheckbox.controls.DoNotMix.patchValue(false);
    this.ProcessorderCheckbox.controls.SpecialPass.patchValue(false);
    this.ProcessorderCheckbox.controls.VehLowBed.patchValue(true);
    this.ProcessorderCheckbox.controls.Veh50Ton.patchValue(true);
    this.ProcessorderCheckbox.controls.Borge.patchValue(false);
    this.ProcessorderCheckbox.controls.PoliceEscort.patchValue(false);
    this.ProcessorderCheckbox.controls.FabricateESM.patchValue(false);
    this.ProcessorderCheckbox.controls.TimeRange.patchValue('');
  }

  async checkBBSNo() {
    if (this.OrderDetailsList_BBS) {
      if (this.OrderDetailsList_BBS.length > 0) {
        this.highlightBBS(0, 0);
        var lBBSNos = ' ';
        let lDataLen = this.OrderDetailsList_BBS.length;

        for (let i = 0; i < lDataLen; i++) {
          if (lBBSNos == ' ') lBBSNos = this.OrderDetailsList_BBS[i].BBSNo;
          else lBBSNos = lBBSNos + ',' + this.OrderDetailsList_BBS[i].BBSNo;
        }

        console.log(
          'BBS CHECK',
          lBBSNos,
          this.selectedRow[0].BBSNo,
          this.selectedRow[0].BBSNo == lBBSNos
        );
        let obj = {
          CustomerCode: this.selectedRow[0].CustomerCode,
          ProjectCode: this.selectedRow[0].ProjectCode,
          JobID: this.selectedRow[0].JobID,
          StructureElement: this.selectedRow[0].StructureElement,
          ProdType: this.selectedRow[0].ProdType,
          ScheduledProd: this.selectedRow[0].ScheduledProd,
          OrderSource: this.selectedRow[0].OrderSource,
          BBSNo: this.selectedRow[0].BBSNo,
        };
        // var lGrid = getGrid();
        let lDBBSNos: any = await this.checkDBBBSNo(obj); //KUNAL
        lDBBSNos = lDBBSNos.BBSNo;
        if (lDBBSNos == false) {
          console.log('duplicate BBS');
          return;
        }
        if (lDBBSNos.length > 0) {
          var lRowNos = ' ';
          if (lDBBSNos.indexOf(',') >= 0) {
            let laDBBSNos = lDBBSNos.split(',');
            for (let i = 0; i < lDataLen; i++) {
              for (let j = 0; j < laDBBSNos.length; j++) {
                if (this.OrderDetailsList_BBS[i].BBSNo == laDBBSNos[j]) {
                  if (lRowNos == ' ') lRowNos = i.toString();
                  else lRowNos = lRowNos + ',' + i.toString();
                  break;
                }
              }
            }
          } else {
            for (let i = 0; i < lDataLen; i++) {
              if (lDBBSNos == this.OrderDetailsList_BBS[i].BBSNo) {
                if (lRowNos == ' ') lRowNos = i.toString();
                else lRowNos = lRowNos + ',' + i.toString();
                break;
              }
            }
          }
          this.highlightBBS(1, lRowNos);
        } else {
          var lRowNos = ' ';
          for (let i = 0; i < lDataLen; i++) {
            for (let j = i + 1; j < lDataLen; j++) {
              if (
                this.OrderDetailsList_BBS[j].BBSNo ==
                this.OrderDetailsList_BBS[i].BBSNo
              ) {
                if (lRowNos == ' ') lRowNos = i.toString();
                else lRowNos = lRowNos + ',' + i.toString();
              }
            }
          }
          if (lRowNos != ' ') {
            this.highlightBBS(1, lRowNos);
          }
        }
      }
    }
  }

  highlightBBS(pInd: any, pRowNos: any) {
    console.log('To be highlighted', pRowNos);
    if (pInd == 0) {
      // gridBBS.removeCellCssStyles("bbs_highlight");
      // REMOVE ANY PREVIOUS CSS FROMTHE BBS TABLE
      this.OrderDetailsList_BBS.forEach((x) => (x.highlighted = false));
    } else {
      if (pRowNos.length > 0) {
        var lClass = {};
        var laRows = '';
        if (pRowNos.indexOf(',') > 0) {
          let laRows: any[] = pRowNos.split(',');
          for (var i = 0; i < laRows.length; i++) {
            // lClass[laRows[i]] = { BBSNo: "highlighted" };
            this.OrderDetailsList_BBS[i].highlighted = true;
          }
        } else {
          this.OrderDetailsList_BBS[pRowNos].highlighted = true;
          // lClass[pRowNos] = { BBSNo: "highlighted" };
        }
        // gridBBS.setCellCssStyles("bbs_highlight", lClass);
      }
    }
  }
  CancelCABBBS(item: any) {
    console.log('CancelCABBBS', item);

    let BBSID: any = item.BBSID;
    let BBSSOR: any = item.BBSSOR;
    let CouplerSOR: any = item.BBSSORCoupler;
    let STDBarSO: any = item.BBSSAPSO;
    let TotalBBS: any = this.TotalNo;

    if (BBSSOR == null || BBSSOR == 'null') {
      BBSSOR = '';
    }
    if (CouplerSOR == null || CouplerSOR == 'null') {
      CouplerSOR = '';
    }
    if (STDBarSO == null || STDBarSO == 'null') {
      STDBarSO = '';
    }
    BBSSOR = BBSSOR.trim();
    CouplerSOR = CouplerSOR.trim();
    STDBarSO = STDBarSO.trim();

    if (BBSSOR.indexOf('Cancelled') >= 0) {
      BBSSOR = '';
    }
    if (CouplerSOR.indexOf('Cancelled') >= 0) {
      CouplerSOR = '';
    }
    if (STDBarSO.indexOf('Cancelled') >= 0) {
      STDBarSO = '';
    }
    if (BBSSOR == '' && CouplerSOR == '' && STDBarSO == '') {
      alert(
        'Order serial number or sales order number not found. Order cancellation fails.'
      );
      return;
    }

    if (
      (BBSSOR == '' || BBSSOR.indexOf('Cancelled') >= 0) &&
      (CouplerSOR == '' || CouplerSOR.indexOf('Cancelled') >= 0) &&
      (STDBarSO == '' || STDBarSO.indexOf('Cancelled') >= 0)
    ) {
      alert('The selected item had been cancelled already.');
      return;
    }

    var lOrders = [];
    if (BBSSOR != null && BBSSOR != '' && BBSSOR != 'null') {
      lOrders.push(BBSSOR);
    }
    if (CouplerSOR != null && CouplerSOR != '' && CouplerSOR != 'null') {
      lOrders.push(CouplerSOR);
    }
    if (STDBarSO != null && STDBarSO != '' && STDBarSO != 'null') {
      lOrders.push(STDBarSO);
    }

    if (lOrders.length == 1) {
      if (TotalBBS == 1) {
        alert(
          'Please cancel the whole order using <Cancel> button as it seems you would like to cancel all items in the order.'
        );
        return;
      }
      if (lOrders.length > 0) {
        var lStatus: any = this.checkOrderStatus(lOrders);
        if (lStatus == true) {
          return;
        }
      }

      if (!confirm('You are going to cancel the select BBS order. Continue?')) {
        return;
      }
      // startLoading();

      this.startCancelCABBBS(BBSID, BBSSOR, CouplerSOR, STDBarSO);

      // setTimeout(startCancelCABBBS, 500, OrderItemNo, BBSID, BBSSOR, CouplerSOR, STDBarSO);
    } else {
      this.cancelDataOrder(BBSID, TotalBBS, BBSSOR, CouplerSOR, STDBarSO);
    }
  }

  async startCancelCABBBS(
    BBSID: any,
    pBBSSOR: any,
    pCouplerSOR: any,
    pSTDBarSO: any
  ) {
    //STARTLOADING
    this.ProcessOrderLoading = true;
    let lContract = this.ProcessOrderForm.controls.Contract.value.substr(0, 10);

    let obj = {
      CustomerCode: this.selectedRow[0].CustomerCode,
      ProjectCode: this.selectedRow[0].ProjectCode,
      ContractNo: lContract,
      JobID: Number(this.selectedRow[0].JobID),
      ItemID: Number(BBSID),
      StructureElement: this.selectedRow[0].StructureElement,
      ProdType: this.selectedRow[0].ProdType,
      OrderSource: this.selectedRow[0].OrderSource,
      ScheduledProd: this.selectedRow[0].ScheduledProd,
      BBSSOR: pBBSSOR,
      CouplerSOR: pCouplerSOR,
      STDBarSO: pSTDBarSO,
      UserName: this.loginService.GetGroupName(),
    };
    let response = await this.CABItemCancelProcess(obj);
    //ENDLOADING
    this.ProcessOrderLoading = false;
    if (response == 'GOT AN ERROR') {
      // NEEDS TO BE CHECKED **
      alert(
        'Error on updating data. Please check the Internet connection and try again.'
      );
    } else {
      if (response.success == true) {
        // reloadBBS(pRowNo, lGrid);

        var lCurrOrder = 0;

        var lOrderA = [];
        if (pBBSSOR != '') {
          lOrderA.push(pBBSSOR);
        }
        if (pCouplerSOR != '') {
          lOrderA.push(pCouplerSOR);
        }
        if (pSTDBarSO != '') {
          lOrderA.push(pSTDBarSO);
        }

        // var lRowNoF = pRowNo;
        // lGrid.invalidateRow(lRowNoF);
        // var lDataView = getDataView();
        var item = this.selectedRow[0];

        var lSOR = item.SORNo;
        if (lSOR == pBBSSOR || lSOR == pCouplerSOR || lSOR == pSTDBarSO) {
          // lGrid.invalidateRow(lRowNoF);
          if (item.OrderStatus != null) {
            item.OrderStatus = 'Cancelled';
          }
          item.OrderStatusCK = 'Cancelled';
          if (item.SORStatus != null) {
            item.SORStatus = 'X';
          }

          // CXL code added
          item.SAPPONo = item.PONumber + '-CXL';

          //Update the Backup list
          this.UpdateBackUpData(item);

          // lDataView.updateItem(item.id, item);
          // lGrid.render();
          lCurrOrder = lCurrOrder + 1;
        }
        if (lCurrOrder == 0 || lOrderA.length > 1) {
          // NEEDS TO BE TESTED **
          for (let m = 0; m < this.OrderDetailsList_BBS.length; m++) {
            // item = lDataView.getItem(m);
            var lSOR1 = item.SORNo;
            if (
              lSOR != lSOR1 &&
              (lSOR1 == pBBSSOR || lSOR1 == pCouplerSOR || lSOR1 == pSTDBarSO)
            ) {
              // lGrid.invalidateRow(m);
              if (item.OrderStatus != null) {
                item.OrderStatus = 'Cancelled';
              }
              item.OrderStatusCK = 'Cancelled';
              if (item.SORStatus != null) {
                item.SORStatus = 'X';
              }

              item.SAPPONo = item.PONumber + '-CXL';

              //Update the Backup list
              this.UpdateBackUpData(item);

              // lDataView.updateItem(item.id, item);
              lCurrOrder = lCurrOrder + 1;
              if (lCurrOrder >= lOrderA.length) {
                break;
              }
            }
          }
          // lGrid.render();
        }
        alert('The selected item has been cancelled successfully.');
      } else {
        alert('Order cancellation failed: ' + response.message);
      }
    }
  }

  async startCancelBPCItem(pCageID: any, pLoadID: any, pSOR: any) {
    this.ProcessOrderLoading = true;
    let lContract = this.ProcessOrderForm.controls.Contract.value.substr(0, 10);
    let obj = {
      CustomerCode: this.selectedRow[0].CustomerCode,
      ProjectCode: this.selectedRow[0].ProjectCode,
      ContractNo: lContract,
      JobID: Number(this.selectedRow[0].JobID),
      CageID: Number(pCageID),
      LoadID: Number(pLoadID),
      StructureElement: this.selectedRow[0].StructureElement,
      ProdType: this.selectedRow[0].ProdType,
      OrderSource: this.selectedRow[0].OrderSource,
      ScheduledProd: this.selectedRow[0].ScheduledProd,
      UserName: this.loginService.GetGroupName(),
    };
    let response = await this.BPCItemCancelProcess(obj);
    if (response == 'GOT AN ERROR') {
      // NEEDS TO BE CHECKED **
      alert(response.message);
    } else {
      if (response.success == true) {
        //reloadBPC(pRowNo, lGrid);

        // var lRowNoF = pRowNo;
        // var lDataView = getDataView();
        // var item = lDataView.getItem(lRowNoF);
        var item = this.selectedRow[0];
        var lSOR = item.SORNo;
        this.updateBPCItems(item, pSOR);
        // if (lSOR == pSOR) {
        //   // lGrid.invalidateRow(lRowNoF);
        //   if (item.OrderStatus != null) {
        //     item.OrderStatus = 'Cancelled';
        //   }
        //   item.OrderStatusCK = 'Cancelled';
        //   if (item.SORStatus != null) {
        //     item.SORStatus = 'X';
        //   }
        //   // lDataView.updateItem(item.id, item);
        //   // lGrid.render();
        // } else {
        //   for (let m = 0; m < this.OrderDetailsList_BPC.length; m++) {
        //     //item = lDataView.getItem(m);
        //     var lSOR = item.SORNo;
        //     if (lSOR == pSOR) {
        //       //lGrid.invalidateRow(m);
        //       if (item.OrderStatus != null) {
        //         item.OrderStatus = 'Cancelled';
        //       }
        //       item.OrderStatusCK = 'Cancelled';
        //       if (item.SORStatus != null) {
        //         item.SORStatus = 'X';
        //       }
        //       //lDataView.updateItem(item.id, item);
        //       //lGrid.render();
        //       break;
        //     }
        //   }
        // }
        alert('The selected item has been cancelled successfully.');
        this.ProcessOrderLoading = false;
        return true;
      } else {
        alert('Order cancellation failed: ' + response.message);
        this.ProcessOrderLoading = false;
      }
    }
    this.ProcessOrderLoading = false;
    return false;
  }

  async CABItemCancelProcess(obj: any): Promise<any> {
    try {
      const data = this.orderService.CABItemCancelProcess(obj).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return 'GOT AN ERROR';
    }
  }

  async BPCItemCancelProcess(obj: any): Promise<any> {
    try {
      const data = this.orderService.BPCItemCancelProcess(obj).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return 'GOT AN ERROR';
    }
  }
  cancelDataOrder(
    BBSID: any,
    TotalBBS: any,
    BBSSOR: any,
    CouplerSOR: any,
    STDBarSO: any
  ) {
    const modalRef = this.modalService.open(CancelCabOrdersComponent, {
      size: 'lg', // 'lg' stands for large, adjust as needed
      centered: true, // Optional: Center the modal
    });
    modalRef.componentInstance.TotalBBS = TotalBBS;
    modalRef.componentInstance.BBSSOR = BBSSOR;
    modalRef.componentInstance.CouplerSOR = CouplerSOR;
    modalRef.componentInstance.STDBarSO = STDBarSO;

    modalRef.componentInstance.saveTrigger.subscribe(async (x: any) => {
      console.log('Return value', x);
      let lBBSSOR = x.lBBSSOR;
      let lCouplerSOR = x.lCouplerSOR;
      let lSTDBarSO = x.lSTDBarSO;

      if (
        TotalBBS == 1 &&
        lBBSSOR == BBSSOR &&
        lCouplerSOR == CouplerSOR &&
        lSTDBarSO == STDBarSO
      ) {
        alert(
          'Please cancel the whole order using <Cancel> button as it seems you would like to cancel all items in the order.'
        );
        return;
      }

      var lOrders = [];
      if (lBBSSOR != null && lBBSSOR != '' && lBBSSOR != 'null') {
        lOrders.push(lBBSSOR);
      }
      if (lCouplerSOR != null && lCouplerSOR != '' && lCouplerSOR != 'null') {
        lOrders.push(lCouplerSOR);
      }
      if (lSTDBarSO != null && lSTDBarSO != '' && lSTDBarSO != 'null') {
        lOrders.push(lSTDBarSO);
      }

      if (lOrders.length == 0) {
        alert('Please select one of item to cancel.');
        return;
      }

      if (lOrders.length > 0) {
        var lStatus: any = await this.checkOrderStatus(lOrders);
        if (lStatus == true) {
          return;
        }
      }

      this.startCancelCABBBS(BBSID, lBBSSOR, lCouplerSOR, lSTDBarSO);
    });
    // modalRef.result.then(
    //   (result: any) => {
    //     console.log("libCopy=>", result);
    //   },
    //   (reason) => {
    //     console.log(reason);
    //   }
    // );
  }

  async checkOrderStatus(Orders: any): Promise<boolean> {
    let lStatus = false;
    let obj = { SONumber: Orders };
    try {
      const data = await this.orderService.CheckCancelStatus(obj).toPromise();
      lStatus = data;
      if (lStatus == true) {
        alert(
          'The order has started loading. It cannot be modified/cancelled.'
        );
      }
    } catch (error) {
      // console.error(error);
      // return false;
      alert('Database Error. Cannot check order status.');
      let r = confirm(
        'Database Error, cannot check order status. Press [Cancell] to stop, [OK] to continue.'
      );
      if (r == true) {
        lStatus = false;
      } else {
        lStatus = true;
      }
    }
    return lStatus;
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

  disProdType(ProdType: any, ProdSubType: any) {
    if (ProdType == 'Rebar' || ProdType == 'CAB') {
      // document.getElementById("pr_totalwt").style.display = "none";
      // document.getElementById("pr_totalpcs").style.display = "none";
      // document.getElementById("pr_cabwt").style.display = "inline-block";
      // document.getElementById("pr_sbwt").style.display = "inline-block";

      // document.getElementById("div_stage_lb").textContent = "Project Stage:";
      // document.getElementById("div_stage_lb").style.display = "inline-block";
      // document.getElementById("pr_stage").style.display = "inline-block";
      // document.getElementById("pr_sapsono").style.display = "none";

      this.showWBS = true;
      // document.getElementById("lb_cabwt").textContent = "CAB Weight:";
      // document.getElementById("lb_sbwt").textContent = "SB Weight:";

      if (ProdSubType == 'STANDARD-BAR') {
        // document.getElementById("containerBBS").style.display = "none";
        // document.getElementById("containerBBSBar").style.display = "inline-block";
      } else {
        // document.getElementById("containerBBS").style.display = "inline-block";
        // document.getElementById("containerBBSBar").style.display = "none";
      }
      // document.getElementById("containerStdMESH").style.display = "none";
      // document.getElementById("containerStdProd").style.display = "none";
      // document.getElementById("containerMESH").style.display = "none";
      // document.getElementById("containerBPC").style.display = "none";
      // document.getElementById("containerComponent").style.display = "none";
    }
    if (
      ProdType == 'Standard MESH' ||
      ProdType == 'STANDARD-MESH' ||
      ProdType == 'STANDARD-BAR' ||
      ProdType == 'COIL' ||
      ProdType == 'COUPLER'
    ) {
      // document.getElementById("pr_cabwt").style.display = "none";
      // document.getElementById("pr_sbwt").style.display = "none";
      // document.getElementById("pr_totalwt").style.display = "inline-block";
      // document.getElementById("pr_totalpcs").style.display = "inline-block";

      // document.getElementById("div_stage_lb").textContent = "SO Number:";
      // document.getElementById("div_stage_lb").style.display = "inline-block";
      // document.getElementById("pr_stage").style.display = "none";
      // document.getElementById("pr_sapsono").style.display = "inline-block";

      // document.getElementById("div_wbs").style.display = "none";
      this.showWBS = false;
      // document.getElementById("lb_cabwt").textContent = "Total Pieces:";
      // document.getElementById("lb_sbwt").textContent = "Total Weight:";

      // document.getElementById("containerBBS").style.display = "none";
      // document.getElementById("containerBBSBar").style.display = "none";
      // document.getElementById("containerStdMESH").style.display = "inline-block";
      // document.getElementById("containerStdProd").style.display = "inline-block";
      // document.getElementById("containerMESH").style.display = "none";
      // document.getElementById("containerBPC").style.display = "none";
      // document.getElementById("containerComponent").style.display = "none";
    }
    if (
      ProdType == 'MESH' ||
      ProdType == 'STIRRUP-LINK-MESH' ||
      ProdType == 'COLUMN-LINK-MESH' ||
      ProdType == 'CUT-TO-SIZE-MESH' ||
      ProdType == 'PRE-CAGE' ||
      ProdType == 'CARPET' ||
      ProdType == 'CORE-CAGE' ||
      ProdType == 'ACS'
    ) {
      // document.getElementById("pr_cabwt").style.display = "none";
      // document.getElementById("pr_sbwt").style.display = "none";
      // document.getElementById("pr_totalwt").style.display = "inline-block";
      // document.getElementById("pr_totalpcs").style.display = "inline-block";

      // document.getElementById("div_stage_lb").textContent = "Project Stage:";
      // document.getElementById("div_stage_lb").style.display = "inline-block";
      // document.getElementById("pr_stage").style.display = "inline-block";
      // document.getElementById("pr_sapsono").style.display = "none";

      this.showWBS = true;
      // document.getElementById("lb_cabwt").textContent = "Total Pieces:";
      // document.getElementById("lb_sbwt").textContent = "Total Weight:";

      // document.getElementById("containerBBS").style.display = "none";
      // document.getElementById("containerBBSBar").style.display = "none";
      // document.getElementById("containerStdMESH").style.display = "none";
      // document.getElementById("containerStdProd").style.display = "none";
      // document.getElementById("containerMESH").style.display = "inline-block";
      // document.getElementById("containerBPC").style.display = "none";
      // document.getElementById("containerComponent").style.display = "none";
    }
    if (ProdType == 'BPC') {
      if (this.selectedRow[0].ScheduledProd == 'Y') {
        this.showWBS = true;
      } else {
        this.showWBS = false;
      }
      // document.getElementById("pr_cabwt").style.display = "none";
      // document.getElementById("pr_sbwt").style.display = "none";
      // document.getElementById("pr_totalwt").style.display = "inline-block";
      // document.getElementById("pr_totalpcs").style.display = "inline-block";
      // document.getElementById("div_stage_lb").textContent = "Loose Bar WT: ";
      // document.getElementById("div_stage_lb").style.display = "none";
      // document.getElementById("pr_stage").style.display = "none";
      // document.getElementById("pr_sapsono").style.display = "none";
      // document.getElementById("div_wbs").style.display = "none";
      // document.getElementById("lb_cabwt").textContent = "Total Pieces:";
      // document.getElementById("lb_sbwt").textContent = "Total Weight:";
      // document.getElementById("containerBBS").style.display = "none";
      // document.getElementById("containerBBSBar").style.display = "none";
      // document.getElementById("containerStdMESH").style.display = "none";
      // document.getElementById("containerStdProd").style.display = "none";
      // document.getElementById("containerMESH").style.display = "none";
      // document.getElementById("containerBPC").style.display = "inline-block";
      // document.getElementById("containerComponent").style.display = "none";
    }
  }

  DisableFields(pStatus: any) {
    if (
      pStatus != 'Processed' &&
      pStatus != 'Delivered' &&
      pStatus != 'Partial Delivered' &&
      pStatus != 'Reviewed' &&
      pStatus != 'Production'
    ) {
      this.ProcessOrderForm.controls['Contract'].enable();
      // this.ProcessOrderForm.controls['ShipTo'].disable();
      this.ProcessOrderForm.controls['wbs1'].enable();
      this.ProcessOrderForm.controls['wbs2'].enable();
      this.ProcessOrderForm.controls['wbs3'].enable();
      this.ProcessOrderForm.controls['OrderType'].enable();
    } else {
      this.ProcessOrderForm.controls['Contract'].disable();
      // this.ProcessOrderForm.controls['ShipTo'].disable();
      this.ProcessOrderForm.controls['wbs1'].disable();
      this.ProcessOrderForm.controls['wbs2'].disable();
      this.ProcessOrderForm.controls['wbs3'].disable();
      this.ProcessOrderForm.controls['OrderType'].disable();
    }

    this.ProcessOrderForm.controls['Address'].disable();
    this.ProcessOrderForm.controls['Gate'].disable();

  }

  async CancelBPCItem(pCageID: any, pLoadID: any, pSOR: any, pItem: any) {
    if (pSOR == null) {
      pSOR = '';
    }
    pSOR = pSOR.trim();
    if (pSOR == '') {
      alert('Order serial number not found. Order cancellation fails.');
      return;
    }

    if (pSOR.indexOf('Cancelled') >= 0) {
      alert('The selected item had been cancelled already.');
      return;
    }

    var lOrders = [];
    lOrders.push(pSOR);
    if (lOrders.length > 0) {
      this.ProcessOrderLoading = true;
      var lStatus: any = await this.checkOrderStatus(lOrders);
      this.ProcessOrderLoading = false;
      // let lStatus: any = "";
      if (lStatus == true) {
        return;
      }
    }

    if (
      !confirm(
        'You are going to cancel the select BPC SOR ' +
          pSOR +
          '. Please note that the SOR may include other items for cage combination. Continue?'
      )
    ) {
      return;
    }
    //startLoading();

    let tempFlag = await this.startCancelBPCItem(pCageID, pLoadID, pSOR);
    if (tempFlag) {
      pItem.ShowCancel = false;
    }
  }

  ConvertToUpper(value: any) {
    // let specialCharactersRegex = /[^\w\s]|_/g;

    // if (value) {
    //   value = (this.removeNonLatinCharacters(value));

    //   if (value[value.length - 1] !== ' ') {
    //     value = value.trim();
    //   }
    // }

    return value.toUpperCase();
  }

  async StartSplitVB(row: any) {
    let pCustomerCode = row.CustomerCode;
    let pProjectCode = row.ProjectCode;
    let pJobID = row.JobID;
    let pOrderSource = row.OrderSource;
    let pStructureEle = row.StructureElement;
    let pProdType = row.ProdType;
    let pScheduledProd = row.ScheduledProd;
    let pStatus = row.OrderStatus;
    // let pRowNo = row. ;

    if (pCustomerCode != '' && pProjectCode != '' && pJobID > 0) {
      let responseVB: any = await this.SplitVariousBar(
        pCustomerCode,
        pProjectCode,
        pJobID,
        pOrderSource,
        pStructureEle,
        pProdType,
        pScheduledProd
      );
      if (responseVB === false) {
      } else {
        // document.getElementById("loaderNotes").innerText = "Loading Data.";
        if (responseVB != '' && responseVB != null) {
          alert(responseVB);
          this.disableSubmit = true;
          // document.getElementById("order_submit").disabled = true;
        }
      }

      let repsonseBBS: any = await this.getBBS2(
        pCustomerCode,
        pProjectCode,
        pJobID,
        pOrderSource,
        pStructureEle,
        pProdType,
        pScheduledProd
      );

      if (repsonseBBS === false) {
      } else {
        let BBSdata: any[] = [];
        if (repsonseBBS.length > 0) {
          var TotalNo = 0;
          for (var i = 0; i < repsonseBBS.length; i++) {
            if (
              repsonseBBS[i].BBSNo != null &&
              repsonseBBS[i].BBSNo.indexOf('Cancelled') < 0
            ) {
              TotalNo = TotalNo + 1;
            }
          }

          for (var i = 0; i < repsonseBBS.length; i++) {
            var lOrderCT = 0;
            if (
              repsonseBBS[i].BBSSOR != null &&
              repsonseBBS[i].BBSSOR != '' &&
              repsonseBBS[i].BBSSOR.indexOf('Cancelled') < 0
            ) {
              lOrderCT = lOrderCT + 1;
            }
            if (
              repsonseBBS[i].BBSSORCoupler != null &&
              repsonseBBS[i].BBSSORCoupler != '' &&
              repsonseBBS[i].BBSSORCoupler.indexOf('Cancelled') < 0
            ) {
              lOrderCT = lOrderCT + 1;
            }
            if (
              repsonseBBS[i].BBSSAPSO != null &&
              repsonseBBS[i].BBSSAPSO != '' &&
              repsonseBBS[i].BBSSAPSO.indexOf('Cancelled') < 0
            ) {
              lOrderCT = lOrderCT + 1;
            }
            // var lLink = "<a href= 'javascript:;' onclick = 'CancelCABBBS(" + pRowNo + "," + repsonseBBS[i].BBSID + ",\"" + repsonseBBS[i].BBSSOR + "\",\"" + repsonseBBS[i].BBSSORCoupler + "\", \"" + repsonseBBS[i].BBSSAPSO + "\"," + TotalNo + ");return false;' >Cancel</a>";
            let showCancel = true;
            if (
              pStatus == 'Created*' ||
              pStatus == 'Submitted' ||
              (TotalNo <= 1 && lOrderCT <= 1)
            ) {
              // lLink = "";
              showCancel = false;
            }
            if (
              repsonseBBS[i].BBSNo != null &&
              repsonseBBS[i].BBSNo.indexOf('Cancelled') >= 0
            ) {
              showCancel = false;
              // lLink = "";
            }

            BBSdata[i] = {
              CustomerCode: repsonseBBS[i].CustomerCode,
              ProjectCode: repsonseBBS[i].ProjectCode,
              JobID: repsonseBBS[i].JobID,
              BBSID: repsonseBBS[i].BBSID,
              BBSNo: repsonseBBS[i].BBSNo,
              BBSDesc: repsonseBBS[i].BBSDesc,
              BBSCopiedFrom: repsonseBBS[i].BBSCopiedFrom,
              BBSStrucElem: repsonseBBS[i].BBSStrucElem,
              BBSOrderCABWT: repsonseBBS[i].BBSOrderCABWT,
              BBSOrderSTDWT: repsonseBBS[i].BBSOrderSTDWT,
              BBSTotalWT:
                Math.round(
                  (repsonseBBS[i].BBSOrderCABWT +
                    repsonseBBS[i].BBSOrderSTDWT) *
                    1000
                ) / 1000,
              BBSNoNDSCoupler: repsonseBBS[i].BBSNoNDSCoupler,
              BBSSOR: repsonseBBS[i].BBSSOR,
              BBSSORCoupler: repsonseBBS[i].BBSSORCoupler,
              BBSSAPSO: repsonseBBS[i].BBSSAPSO,
              showCancel: showCancel,
              // Actionlink: lLink
            };
          }
          this.OrderDetailsList_BBS = BBSdata;
          // gridBBS.setData(BBSdata);
          // gridBBS.render();
        } else {
          this.OrderDetailsList_BBS = BBSdata;
          // gridBBS.setData(BBSdata);
          // gridBBS.render();
        }
      }
      this.checkBBSNo();
    }
  }

  async SplitVariousBar(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ): Promise<any> {
    try {
      let obj = {
        CustomerCode: CustomerCode,
        ProjectCode: ProjectCode,
        JobID: JobID,
        OrderSource: OrderSource,
        StructureElement: StructureElement,
        ProductType: ProductType,
        ScheduledProd: ScheduledProd,
        UserName: this.loginService.GetGroupName(),
      };
      const data = this.orderService.SplitVariousBar(obj).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      alert('Cannot split BBS for various bar as server error.');
      return false;
    }
  }

  async getBBS2(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ): Promise<any> {
    try {
      const data = this.orderService
        .getBBS_Process(
          CustomerCode,
          ProjectCode,
          JobID,
          OrderSource,
          StructureElement,
          ProductType,
          ScheduledProd
        )
        .toPromise();
      return data;
    } catch (error) {
      alert('Cannot reload BBS since server error.');
      return false;
    }
  }

  UpdateReqDateBPC(item: any) {
    let date = new Date(item.required_date).toLocaleDateString();
    item.required_date = this.datePipe.transform(date, 'yyyy-MM-dd', 'UTC+8');
    this.OrderDetailsList_BPC.forEach((x) => {
      if (x.isSelected) {
        x.required_date = item.required_date;
      }
    });
    console.log('Updated Date', date);
  }

  EditBPCProcess(item: any, i: any, columnName: any, e: any) {
    e.preventDefault();
    if (
      this.selectedRow[0].OrderStatus == 'Created*' ||
      this.selectedRow[0].OrderStatus == 'Submitted' ||
      this.selectedRow[0].OrderStatus == 'Reviewed' ||
      this.selectedRow[0].OrderStatus == 'Production' ||
      this.selectedRow[0].OrderStatus == 'Withdrawn'
    ) {
      item.editable = columnName;
      this.currEditIndex = i;
    }
  }
  EditBBSProcess(item: any, i: any, Column: any) {
    let lStatus = this.selectedRow[0].OrderStatus;
    if (Column == 'BBSNo') {
      if (
        lStatus == 'Created*' ||
        lStatus == 'Submitted' ||
        lStatus == 'Withdrawn'
      ) {
        this.editBBSNo = true;
        this.editBBSDesc = false;
      }
    } else if (Column == 'BBSDesc') {
      if (
        lStatus == 'Created*' ||
        lStatus == 'Submitted' ||
        lStatus == 'Reviewed'
      )
        this.editBBSNo = false;
      this.editBBSDesc = true;
    }
    this.currEditIndex = i;
  }

  lastSelctedRowDetails: any;
  lastSelectedTable: boolean = false;
  lastSelectedTableData: any[] = [];
  SelectOrderDetailsTable(
    TableData: any,
    item: any,
    index: any,
    event: MouseEvent
  ) {
    this.lastSelectedTable = true;
    this.lastSelectedTableData = TableData;
    console.log('SelectRow');
    // this.OrderDetailTableSelected = true;
    // this.ProcessTableSelected = false;
    this.lastSelctedRowDetails = item;
    if (event.ctrlKey) {
      // Handle multiselect with Ctrl key
      let itemPresent = false;
      for (let i = 0; i < TableData.length; i++) {
        if (TableData[i].isSelected == true) {
          itemPresent = true;
          break;
        }
      }
      if (itemPresent == false) {
        this.lastSelctedRowDetails = item;
        // Run as a normal click
      } else {
        console.log('Multi Select Started');
        if (item.isSelected) {
          // Remove from this.selectedRow
          item.isSelected = false;
        } else {
          item.isSelected = true;
          this.lastSelctedRowDetails = item;
        }
        return;
      }
    } else if (event.shiftKey) {
      // Handle multiselect with Shift key.
      let itemPresent = false;
      for (let i = 0; i < TableData.length; i++) {
        if (TableData[i].isSelected == true) {
          itemPresent = true;
          break;
        }
      }
      if (itemPresent == false) {
        // Run as a normal click.
      } else {
        console.log('Multi Select Started');
        let lIndex = 0;

        // Get the index of the last selected row in the list.
        for (let i = 0; i < TableData.length; i++) {
          lIndex = TableData[i].isSelected == true ? i : lIndex;
        }

        // The index of the currently selected row in the list.
        let nIndex = TableData.findIndex((x: any) => x == item);

        if (nIndex > lIndex) {
          // Add all the rows between the two indexes.
          for (let i = lIndex + 1; i < nIndex + 1; i++) {
            TableData[i].isSelected = true;
          }
        } else {
          if (item.isSelected) {
            // Remove from this.selectedRow
            item.isSelected = false;
          } else {
            item.isSelected = true;
          }
        }
        console.log('selectedRow', this.selectedRow);
        return;
      }
    }

    if (
      item.editable == '' ||
      item.editable == undefined ||
      this.currEditIndex == null
    ) {
      TableData.forEach((element: any) => {
        element.isSelected = false;
      });
    }
    item.isSelected = true;
    //this.showWBS = row.StructureElement == 'NONWBS' ? false : true;
  }
  setReqDateFrom() {
    let DateFrom = this.ProcessOrderForm.controls.ReqDate.value;
    var lRow = this.selectedRow[0];
    if (lRow) {
      var lProdType = lRow.ProdType;
      var lOrderStatus = lRow.OrderStatusCK
        ? lRow.OrderStatusCK
        : lRow.OrderStatus;
      if (lProdType == 'BPC' && lOrderStatus == 'Submitted') {
        if (this.OrderDetailsList_BPC.length > 0) {
          for (let i = 0; i < this.OrderDetailsList_BPC.length; i++) {
            this.OrderDetailsList_BPC[i].required_date =
              this.datePipe.transform(DateFrom, 'yyyy-MM-dd', 'UTC+8');
          }
        }
      }
      if (lOrderStatus == 'Submitted') {
        // document.getElementById("pr_required_date_to").value = DateFrom;
        this.ProcessOrderForm.controls.UpdateReqDate.patchValue(
          this.ProcessOrderForm.controls.ReqDate.value
        );
      }
    }
  }

  setReqDateTo() {
    let DateTo = this.ProcessOrderForm.controls.UpdateReqDate.value;
    var lRow = this.selectedRow[0];
    if (lRow) {
      var lProdType = lRow.ProdType;
      var lOrderStatus = lRow.OrderStatusCK
        ? lRow.OrderStatusCK
        : lRow.OrderStatus;
      if (lProdType == 'BPC' && lOrderStatus == 'Submitted') {
        if (this.OrderDetailsList_BPC.length > 0) {
          for (let i = 0; i < this.OrderDetailsList_BPC.length; i++) {
            this.OrderDetailsList_BPC[i].required_date =
              this.datePipe.transform(DateTo, 'yyyy-MM-dd', 'UTC+8');
          }
        }
      }
    }
  }

  setIntRemarks(intRemarks: any) {
    var lRow = this.selectedRow[0];
    if (lRow) {
      var lProdType = lRow.ProdType;
      var lOrderStatus = lRow.OrderStatus;
      if (lProdType == 'BPC' && lOrderStatus == 'Submitted') {
        if (this.OrderDetailsList_BPC.length > 0) {
          for (let i = 0; i < this.OrderDetailsList_BPC.length; i++) {
            this.OrderDetailsList_BPC[i].int_remarks = intRemarks.toUpperCase();
          }
        }
      }
    }
  }

  setExtRemarks(extRemarks: any) {
    var lRow = this.selectedRow[0];
    if (lRow) {
      var lProdType = lRow.ProdType;
      var lOrderStatus = lRow.OrderStatus;
      if (lProdType == 'BPC' && lOrderStatus == 'Submitted') {
        if (this.OrderDetailsList_BPC.length > 0) {
          for (let i = 0; i < this.OrderDetailsList_BPC.length; i++) {
            this.OrderDetailsList_BPC[i].ext_remarks = extRemarks.toUpperCase();
          }
        }
      }
    }
  }

  // SaveBPC() {
  //   console.log('Save BPC');
  // }

  async SaveBPCData() {
    var lReturn = true;
    var lBPCData = this.OrderDetailsList_BPC;
    if (lBPCData != null && lBPCData.length > 0) {
      var lBPCLoad = [];
      for (let i = 0; i < lBPCData.length; i++) {
        lBPCLoad[i] = {
          CustomerCode: lBPCData[i].CustomerCode,
          ProjectCode: lBPCData[i].ProjectCode,
          JobID: lBPCData[i].JobID,
          cage_id: lBPCData[i].cage_id,
          load_id: lBPCData[i].load_id,
          load_qty: lBPCData[i].load_qty,
          required_date: lBPCData[i].required_date,
          int_remarks: lBPCData[i].int_remarks,
          ext_remarks: lBPCData[i].ext_remarks,
        };
      }
      let response = await this.UpdateBPCData(lBPCLoad);

      if (response) {
        if (response.success == false) {
          alert(
            'Update BPC Data Failed. Detail Message: ' + response.responseText
          );
          lReturn = false;
        }
      }
    }
    return lReturn;
  }

  UpdateBPCData(lBPCLoad: any) {
    try {
      const data = this.orderService.updateBPCData(lBPCLoad).toPromise();
      return data;
    } catch (error) {
      alert('cannot save BBS data since server error. please try later.');
      return false;
    }
  }

  UpdateBPCRemarks(column: any, item: any) {
    if (column == 'IntRemarksBPC') {
      let remark = item.int_remarks;
      this.OrderDetailsList_BPC.forEach((x) => {
        if (x.isSelected) {
          x.int_remarks = remark.toUpperCase();
          x.ext_remarks = remark.toUpperCase();
        }
      });
    } else if (column == 'ExtRemarksBPC') {
      let remark = item.ext_remarks;
      this.OrderDetailsList_BPC.forEach((x) => {
        if (x.isSelected) {
          x.ext_remarks = remark.toUpperCase();
        }
      });
    }
  }
  startIncoming: boolean = false;
  startDetailling: boolean = false;
  SetStartingTab() {
    let lUserType = this.loginService.GetUserType();
    // Incase the user duplicates the Process Order pages, then we need to get the Usertype from LocalStorage.
    if (!lUserType) {
      let localUserType: any = localStorage.getItem('UserType');
      if (localUserType) {
        lUserType = localUserType;
        this.loginService.SetUserType(localUserType);
      } else {
        lUserType = '';
      }
    }
    let lUserName = this.loginService.GetGroupName();
    if (!lUserName) {
      let localUserName: any = localStorage.getItem('ODOSUserName');
      if (localUserName) {
        lUserName = localUserName;
        this.loginService.SetGroupName(localUserName);
      } else {
        lUserName = '';
      }
    }
    console.log('lUserType', lUserType);
    if (
      lUserType == 'PL' ||
      lUserType == 'AD' ||
      lUserType == 'PM' ||
      lUserType == 'PA' ||
      lUserType == 'P1' ||
      lUserType == 'P2' ||
      lUserType == 'P3' ||
      lUserType == 'PU' ||
      lUserType == 'TE' ||
      lUserType == 'MJ'
    ) {
      if (lUserType == 'MJ' || lUserType == 'TE') {
        this.startIncoming = false;
        this.startDetailling = true;
        this.activeTab = 2;
        this.GetProcessOrderForPendingDET('DETAILING', false);
        // @Html.Raw("document.getElementById('order_amend').disabled = true;");
        // @Html.Raw("reloadPO('DETAILING');");
        // @Html.Raw("$(detailing_tab).addClass('active');$(incoming_tab).removeClass('active');");
      } else {
        this.startIncoming = true;
        this.startDetailling = false;
        this.activeTab = 1;
        this.GetProcessOrderForIncoming('INCOMING', false);
        // @Html.Raw("document.getElementById('order_amend').disabled = false;");
        // @Html.Raw("reloadPO('INCOMING');");
      }
    }
  }
  ConvertFormToUpper(FormName: any) {
    let value = this.ProcessOrderForm.controls[FormName].value;
    this.ProcessOrderForm.controls[FormName].patchValue(value.toUpperCase());
    // let specialCharactersRegex = /[^\w\s]|_/g;

    // if (value) {
    //   value = (this.removeNonLatinCharacters(value));

    //   if (value[value.length - 1] !== ' ') {
    //     value = value.trim();
    //   }
    // }

    //return value.toUpperCase();
  }

  UpdatePONumber_RemoveCXL(pOrderNo: any) {
    /**
     * When the Order status of any record is updated (either "Withdrawn" or "Cancelled"),
     * then update the PoNumber of all the subsequent records which share the same order number.
     */
    let ldataList: any[] = [];

    if (this.CurrentTab == 'CREATING') {
      ldataList = this.PendingENT;
    } else if (this.CurrentTab == 'INCOMING') {
      ldataList = this.IncomingData;
    } else if (this.CurrentTab == 'DETAILING') {
      ldataList = this.PendingDET;
    } else if (this.CurrentTab == 'CANCELLED') {
      ldataList = this.CancelData;
    } else if (this.CurrentTab == 'PROCESSING') {
      ldataList = this.ProcessingData;
    } else if (this.CurrentTab == 'ALL') {
      ldataList = this.AllData;
    } else if (this.CurrentTab == 'SEARCH') {
      ldataList = this.SearchResultData;
    }

    for (let i = 0; i < ldataList.length; i++) {
      let item = ldataList[i];

      if(item.JobID == pOrderNo){
        if (item.SAPPONo.includes('-CXL')) {
            item.SAPPONo = item.SAPPONo.split('-CXL')[0];
        }
      }

      this.UpdateBackupRecords(item);
    }
  }

  UpdatePONumber_CXL(pOrderNo: any) {
    /**
     * When the Order status of any record is updated (either "Withdrawn" or "Cancelled"),
     * then update the PoNumber of all the subsequent records which share the same order number.
     */
    let ldataList: any[] = [];

    if (this.CurrentTab == 'CREATING') {
      ldataList = this.PendingENT;
    } else if (this.CurrentTab == 'INCOMING') {
      ldataList = this.IncomingData;
    } else if (this.CurrentTab == 'DETAILING') {
      ldataList = this.PendingDET;
    } else if (this.CurrentTab == 'CANCELLED') {
      ldataList = this.CancelData;
    } else if (this.CurrentTab == 'PROCESSING') {
      ldataList = this.ProcessingData;
    } else if (this.CurrentTab == 'ALL') {
      ldataList = this.AllData;
    } else if (this.CurrentTab == 'SEARCH') {
      ldataList = this.SearchResultData;
    }

    for (let i = 0; i < ldataList.length; i++) {
      let item = ldataList[i];

      if(item.JobID == pOrderNo){
        item.SAPPONo = item.PONumber + '-CXL';
      }

      this.UpdateBackupRecords(item);
    }
  }

  UpdateOrderStatus(pOrderNo: any, pStatus: any) {
    /**
     * When the Order status of any record is updated (either "Withdrawn" or "Cancelled"),
     * then update teh Order Status of all the subsequent records which share the sam eorder number.
     */
    let ldataList: any[] = [];

    if (this.CurrentTab == 'CREATING') {
      ldataList = this.PendingENT;
    } else if (this.CurrentTab == 'INCOMING') {
      ldataList = this.IncomingData;
    } else if (this.CurrentTab == 'DETAILING') {
      ldataList = this.PendingDET;
    } else if (this.CurrentTab == 'CANCELLED') {
      ldataList = this.CancelData;
    } else if (this.CurrentTab == 'PROCESSING') {
      ldataList = this.ProcessingData;
    } else if (this.CurrentTab == 'ALL') {
      ldataList = this.AllData;
    } else if (this.CurrentTab == 'SEARCH') {
      ldataList = this.SearchResultData;
    }

    // ldataList.forEach(
    //   (item) =>
    //     (item.OrderStatus = item.JobID == pOrderNo ? pStatus : item.OrderStatus)
    // );
    for (let i = 0; i < ldataList.length; i++) {
      let item = ldataList[i];
      item.OrderStatus = item.JobID == pOrderNo ? pStatus : item.OrderStatus;
      item.SORStatus =
        item.JobID == pOrderNo &&
        (item.SORStatus != null || item.SORStatus != '')
          ? 'X'
          : item.SORStatus;
      item.SORStatusCK = item.JobID == pOrderNo ? 'X' : item.SORStatusCK;

      this.UpdateBackupRecords(item);
    }
  }
  CheckCurrentIndex(index: any, dataList: any) {
    if (dataList[index].isVisible) {
      return index;
    } else {
      for (let i = index; i < dataList.length; i++) {
        if (dataList[i].isVisible) {
          return i - 1;
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

  getWBS(OrderNumber: any) {
    try {
      const data = this.orderService.GetWBSFor_CTSMesh(OrderNumber).toPromise();
      return data;
    } catch (error) {
      //alert('cannot save BBS data since server error. please try later.');
      return false;
    }
  }

  MapData_UpdateAdditionalRemark(dataList: any) {
    /**
     * Update the vaue of Additional Remarks so that the new functionalities
     * do not conflict with the orders created via DigiOS System.
     */

    /**
     * Update the serial number in ths function instead of creating a separate function.
     * Date: 18-06-2024
     */
    for (let i = 0; i < dataList.length; i++) {
      let x = dataList[i];
      x.sno = i + 1;
      if (!x.AdditionalRemark) {
        x.AdditionalRemark = x.DeliveryAddress;
      }

      if (x.SpecialRemark) {
        x.Remarks = x.SpecialRemark;
      }
      if (x.SiteContact) {
        x.Scheduler_Name = x.SiteContact;
      }
      if (x.Handphone) {
        x.Scheduler_HP = x.Handphone;
      }
      if (x.GoodsReceiver) {
        x.SiteEngr_Name = x.GoodsReceiver;
      }
      if (x.GoodsReceiverHandphone) {
        x.SiteEngr_HP = x.GoodsReceiverHandphone;
      }
    }
  }

  GetTableData() {
    let ldataList: any[] = [];
    if (this.CurrentTab == 'CREATING') {
      ldataList = this.PendingENT;
    } else if (this.CurrentTab == 'INCOMING') {
      ldataList = this.IncomingData;
    } else if (this.CurrentTab == 'DETAILING') {
      ldataList = this.PendingDET;
    } else if (this.CurrentTab == 'CANCELLED') {
      ldataList = this.CancelData;
    } else if (this.CurrentTab == 'PROCESSING') {
      ldataList = this.ProcessingData;
    } else if (this.CurrentTab == 'ALL') {
      ldataList = this.AllData;
    } else if (this.CurrentTab == 'SEARCH') {
      ldataList = this.SearchResultData;
    }
    return ldataList;
  }

  GetBackupTableData() {
    let ldataList: any[] = [];
    if (this.CurrentTab == 'CREATING') {
      ldataList = this.PendingENTBackUp;
    } else if (this.CurrentTab == 'INCOMING') {
      ldataList = this.BackupIncomingData;
    } else if (this.CurrentTab == 'DETAILING') {
      ldataList = this.PendingDETBackup;
    } else if (this.CurrentTab == 'CANCELLED') {
      ldataList = this.CancelBackup;
    } else if (this.CurrentTab == 'PROCESSING') {
      ldataList = this.ProcessBackup;
    } else if (this.CurrentTab == 'ALL') {
      ldataList = this.AllDataBackup;
    } else if (this.CurrentTab == 'SEARCH') {
      ldataList = this.SearchResultData;
    }
    return ldataList;
  }

  AutoSelectRow(dataList: any) {
    let lClick: MouseEvent = {
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      button: 0,
      buttons: 0,
      clientX: 0,
      clientY: 0,
      metaKey: false,
      movementX: 0,
      movementY: 0,
      offsetX: 0,
      offsetY: 0,
      pageX: 0,
      pageY: 0,
      relatedTarget: null,
      screenX: 0,
      screenY: 0,
      x: 0,
      y: 0,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initMouseEvent: function (
        typeArg: string,
        canBubbleArg: boolean,
        cancelableArg: boolean,
        viewArg: Window,
        detailArg: number,
        screenXArg: number,
        screenYArg: number,
        clientXArg: number,
        clientYArg: number,
        ctrlKeyArg: boolean,
        altKeyArg: boolean,
        shiftKeyArg: boolean,
        metaKeyArg: boolean,
        buttonArg: number,
        relatedTargetArg: EventTarget | null
      ): void {
        throw new Error('Function not implemented.');
      },
      detail: 0,
      view: null,
      which: 0,
      initUIEvent: function (
        typeArg: string,
        bubblesArg?: boolean | undefined,
        cancelableArg?: boolean | undefined,
        viewArg?: Window | null | undefined,
        detailArg?: number | undefined
      ): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: null,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: null,
      target: null,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (
        type: string,
        bubbles?: boolean | undefined,
        cancelable?: boolean | undefined
      ): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      AT_TARGET: 0,
      BUBBLING_PHASE: 0,
      CAPTURING_PHASE: 0,
      NONE: 0,
      // layerX: 0,
      // layerY: 0,
    };
    this.selectRow(dataList[0], dataList, lClick);
  }

  openDeliveryDoc(item: any, columnName: any, pEvent: MouseEvent) {
    if (columnName == 'DeliveryNo') {
      if (item.DeliveryNo) {
        pEvent.stopPropagation();
        pEvent.preventDefault();
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
        modalRef.componentInstance.DONo = item.DeliveryNo;
        modalRef.componentInstance.DODate = item.PlanDelDate;
      }
    } else if (columnName == 'LoadNo') {
      pEvent.preventDefault();
      pEvent.stopPropagation();
      this.OpenLoadDetails(item);
    }

    this.gTableSelected = false;
  }


  isReviewedGreenOrder: boolean = false;
  UpdateDisplayFields() {
    this.ProcessOrderForm.reset();
    this.ProcessorderCheckboxreset();
    // this.resetSelectedRowColor();

    if (this.selectedRow[0]) {
      let row = this.selectedRow[0];

      this.ProcessOrderForm.reset();
      this.ProcessorderCheckboxreset();
      // this.resetSelectedRowColor();
      this.resetInputDisplay(row);

      if (
        row.OrderStatus != 'Cancelled' &&
        row.OrderStatus != 'Processed' &&
        row.OrderStatus != 'Production' &&
        row.OrderStatus != 'Reviewed' &&
        row.OrderStatus != 'Delivered' &&
        row.OrderStatus != 'Partial Delivered'
      ) {
        this.ProcessOrderForm.controls['customer'].patchValue(
          this.selectedRow[0].CustomerName +
            ' (' +
            this.selectedRow[0].CustomerCode +
            ')'
        );
        this.ProcessOrderForm.controls['customer'].disable();

        this.ProcessOrderForm.controls['project'].patchValue(
          this.selectedRow[0].ProjectTitle +
            ' (' +
            this.selectedRow[0].ProjectCode +
            ')'
        );
        this.ProcessOrderForm.controls['project'].disable();

        let lOrderTypeList = this.OrderTypeList;
        if (lOrderTypeList.includes(this.selectedRow[0].OrderType)) {
          this.ProcessOrderForm.controls['OrderType'].patchValue(
            this.selectedRow[0].OrderType
              ? this.selectedRow[0].OrderType
              : 'CREDIT'
          );
        } else {
          this.ProcessOrderForm.controls['OrderType'].patchValue('CREDIT');
        }

        this.ProcessOrderForm.controls['ponumber'].patchValue(
          this.selectedRow[0].PONumber
        );

        if (
          this.selectedRow[0].ProjectStage == '' ||
          this.selectedRow[0].ProjectStage == null
        ) {
          this.ProcessOrderForm.controls['ProjectStage'].patchValue(
            'TYP-Typical Floor'
          );
        } else {
          this.ProcessOrderForm.controls['ProjectStage'].patchValue(
            this.selectedRow[0].ProjectStage
          );
        }

        this.ProcessOrderForm.controls['SONumber'].patchValue(
          this.selectedRow[0].SAPSONo
        );

        this.ProcessOrderForm.controls['ReqDate'].patchValue(
          this.selectedRow[0].RequiredDate
        );

        this.ProcessOrderForm.controls['UpdateReqDate'].patchValue(
          this.selectedRow[0].RequiredDate
        );

        this.ProcessOrderForm.controls['CABWeight'].patchValue(
          Number(this.selectedRow[0].TotalCABWeight).toFixed(3)
        );
        this.ProcessOrderForm.controls['CABWeight'].disable();

        this.ProcessOrderForm.controls['SBWeight'].patchValue(
          Number(this.selectedRow[0].TotalSTDWeight).toFixed(3)
        );
        this.ProcessOrderForm.controls['SBWeight'].disable();

        this.ProcessOrderForm.controls['TotalWeight'].patchValue(
          Number(this.selectedRow[0].TotalWeight).toFixed(3)
        );
        this.ProcessOrderForm.controls['TotalWeight'].disable();

        this.ProcessOrderForm.controls['TotalPcs'].patchValue(
          Number(this.selectedRow[0].TotalSTDWeight).toFixed(0)
        );
        this.ProcessOrderForm.controls['TotalPcs'].disable();

        this.ProcessOrderForm.controls['wbs1'].patchValue(
          this.selectedRow[0].WBS1
        );
        this.ProcessOrderForm.controls['wbs1'].enable();

        this.ProcessOrderForm.controls['wbs2'].patchValue(
          this.selectedRow[0].WBS2
        );
        this.ProcessOrderForm.controls['wbs2'].enable();

        this.ProcessOrderForm.controls['wbs3'].patchValue(
          this.selectedRow[0].WBS3
        );
        this.ProcessOrderForm.controls['wbs3'].enable();

        let tempvalue = this.VehicleTypeList.find(
          (x: { code: any }) => x.code === this.selectedRow[0].TransportMode
        );
        if (tempvalue) {
          this.ProcessOrderForm.controls['VehicleType'].patchValue(
            tempvalue.code
          );
        } else {
          tempvalue = this.VehicleTypeList2.find(
            (x: { code: any }) => x.code === this.selectedRow[0].TransportMode
          );
          if (tempvalue) {
            this.ProcessOrderForm.controls['VehicleType'].patchValue(
              tempvalue.code
            );
          }
        }

        this.SetRemarks(
          this.selectedRow[0].AdditionalRemark,
          this.selectedRow[0].SiteEngr_Name,
          this.selectedRow[0].SiteEngr_HP,
          this.selectedRow[0].Scheduler_Name,
          this.selectedRow[0].Scheduler_HP
        );
        this.GetContractList(
          row.CustomerCode,
          row.ProjectCode,
          row.JobID,
          row.OrderSource,
          row.StructureElement,
          row.ProdType,
          row.ProdTypeDis,
          row.ScheduledProd
        );
        this.GetWBSAll();
      } else {
        this.orderService
          .Get_ProcessRec(
            row.CustomerCode,
            row.ProjectCode,
            row.JobID,
            row.StructureElement,
            row.ProdType,
            row.ScheduledProd,
            row.OrderSource,
            row.SORNo
          )
          .subscribe({
            next: (response) => {
              console.log('GetVehicleTypeList response', response);

              response = response?.Value;
              if(!response) {
                return;
              }
              let isGreenSteel = response.isGreenSteel;
              this.gGreenSteelSelection = isGreenSteel;
              this.isReviewedGreenOrder = true;
              response = response.result;

              let tempList: any[] = [];
              this.ProcessOrderForm.controls['customer'].patchValue(
                this.selectedRow[0].CustomerName +
                  ' (' +
                  this.selectedRow[0].CustomerCode +
                  ')'
              );
              this.ProcessOrderForm.controls['customer'].disable();

              this.ProcessOrderForm.controls['project'].patchValue(
                this.selectedRow[0].ProjectTitle +
                  ' (' +
                  this.selectedRow[0].ProjectCode +
                  ')'
              );
              this.ProcessOrderForm.controls['project'].disable();
              this.ProcessOrderForm.controls['OrderType'].patchValue(
                response.OrderType == null ? 'CREDIT' : response.OrderType
              );

              this.ProcessOrderForm.controls['ponumber'].patchValue(
                response.PONumber
              );

              // if (
              //   this.selectedRow[0].ProjectStage == '' ||
              //   this.selectedRow[0].ProjectStage == null
              // ) {
              //   this.ProcessOrderForm.controls['ProjectStage'].patchValue(
              //     'TYP-Typical Floor'
              //   );
              // } else {
              //   this.ProcessOrderForm.controls['ProjectStage'].patchValue(
              //     this.selectedRow[0].ProjectStage
              //   );
              // }
              this.ProcessOrderForm.controls['ProjectStage'].patchValue(
                response.ProjectStage
              );
              this.ProcessOrderForm.controls['Contract'].patchValue(
                response.Contract ? response.Contract : 'SPOT ORDER'
              );

              if (response.Contract) {
                this.ContractListDDL = [];
                this.ContractListDDL[0] = response.Contract;
              } else {
                this.ContractListDDL = [];
                this.ContractListDDL[0] = 'SPOT ORDER';
              }
              this.showInvoiceRemarks =
                this.ContractListDDL[0].substr(0, 10) == 'SPOT ORDER'
                  ? true
                  : false;

              // this.ProcessOrderForm.controls['ShipTo'].patchValue(
              //   response.ShipToParty
              // );

              this.ProcessOrderForm.controls['SONumber'].patchValue(
                this.selectedRow[0].SAPSONo
              );
              let lProdType = this.selectedRow[0].ProdType;
              if (
                lProdType == 'Standard MESH' ||
                lProdType == 'STANDARD-MESH' ||
                lProdType == 'STANDARD-BAR' ||
                lProdType == 'COIL' ||
                lProdType == 'COUPLER'
              ) {
                this.ProcessOrderForm.controls['SONumber'].patchValue(
                  this.selectedRow[0].SORNo
                );
              }

              var myDate = response.RequiredDateFrom.substr(0, 10);
              // var myDateStr =
              //   myDate.getFullYear().toString() +
              //   '-' +
              //   this.pad((myDate.getMonth() + 1).toString(), 2) +
              //   '-' +
              //   this.pad(myDate.getDate().toString(), 2);
              this.ProcessOrderForm.controls['ReqDate'].patchValue(myDate);

              myDate = response.RequiredDateTo.substr(0, 10);
              // myDate =
              //   myDate.getFullYear().toString() +
              //   '-' +
              //   this.pad((myDate.getMonth() + 1).toString(), 2) +
              //   '-' +
              //   this.pad(myDate.getDate().toString(), 2);
              this.ProcessOrderForm.controls['UpdateReqDate'].patchValue(
                myDate
              );

              this.ProcessOrderForm.controls['CABWeight'].patchValue(
                parseFloat(response.TotalCABWeight).toFixed(3)
              );
              this.ProcessOrderForm.controls['CABWeight'].disable();

              this.ProcessOrderForm.controls['SBWeight'].patchValue(
                parseFloat(response.TotalSTDWeight).toFixed(3)
              );
              this.ProcessOrderForm.controls['SBWeight'].disable();

              this.ProcessOrderForm.controls['TotalWeight'].patchValue(
                Number(this.selectedRow[0].TotalWeight).toFixed(3)
              );
              this.ProcessOrderForm.controls['TotalWeight'].disable();

              this.ProcessOrderForm.controls['TotalPcs'].patchValue(
                Number(this.selectedRow[0].TotalSTDWeight).toFixed(0)
              );
              this.ProcessOrderForm.controls['TotalPcs'].disable();

              this.ProcessOrderForm.controls['wbs1'].patchValue(
                this.selectedRow[0].WBS1
              );
              this.ProcessOrderForm.controls['wbs1'].enable();

              this.ProcessOrderForm.controls['wbs2'].patchValue(
                this.selectedRow[0].WBS2
              );
              this.ProcessOrderForm.controls['wbs2'].enable();

              this.ProcessOrderForm.controls['wbs3'].patchValue(
                this.selectedRow[0].WBS3
              );
              this.ProcessOrderForm.controls['wbs3'].enable();

              let tempvalue = this.VehicleTypeList.find(
                (x: { code: any }) =>
                  x.code === this.selectedRow[0].TransportMode
              );
              if (tempvalue) {
                this.ProcessOrderForm.controls['VehicleType'].patchValue(
                  tempvalue.code
                );
              } else {
                tempvalue = this.VehicleTypeList2.find(
                  (x: { code: any }) =>
                    x.code === this.selectedRow[0].TransportMode
                );
                if (tempvalue) {
                  this.ProcessOrderForm.controls['VehicleType'].patchValue(
                    tempvalue.code
                  );
                }
              }

              // this.SetRemarks(
              //   this.selectedRow[0].AdditionalRemark,
              //   this.selectedRow[0].SiteEngr_Name,
              //   this.selectedRow[0].SiteEngr_HP,
              //   this.selectedRow[0].Scheduler_Name,
              //   this.selectedRow[0].Scheduler_HP
              // );

              this.InternalRemarks = response.IntRemarks;
              this.ExternalRemarks = response.ExtRemarks;
              this.InvoiceRemarks = response.InvRemarks;
              this.ProcessorderCheckbox.controls.UrgentOrder.patchValue(
                response.Urgent
              );
              this.ProcessorderCheckbox.controls.Conquas.patchValue(
                response.Conquas
              );
              this.ProcessorderCheckbox.controls.Crane.patchValue(
                response.Crane
              );
              this.ProcessorderCheckbox.controls.PremiumService.patchValue(
                response.Premium
              );
              this.ProcessorderCheckbox.controls.ZeroTol.patchValue(
                response.ZeroTol
              );
              this.ProcessorderCheckbox.controls.CallBDel.patchValue(
                response.CallDel
              );
              this.ProcessorderCheckbox.controls.DoNotMix.patchValue(
                response.DoNotMix
              );
              this.ProcessorderCheckbox.controls.SpecialPass.patchValue(
                response.SpecialPass
              );
              this.ProcessorderCheckbox.controls.VehLowBed.patchValue(
                response.LowBed
              );
              this.ProcessorderCheckbox.controls.Veh50Ton.patchValue(
                response.Veh50Ton
              );
              this.ProcessorderCheckbox.controls.Borge.patchValue(
                response.Borge
              );
              this.ProcessorderCheckbox.controls.PoliceEscort.patchValue(
                response.PoliceEscort
              );
              this.ProcessorderCheckbox.controls.FabricateESM.patchValue(
                response.FabricateESM
              );
              this.ProcessorderCheckbox.controls.TimeRange.patchValue(
                response.TimeRange
              );
              let row = this.selectedRow[0];
              this.GetOrderDetailsTable(
                row.CustomerCode,
                row.ProjectCode,
                row.JobID,
                row.OrderSource,
                row.StructureElement,
                row.ProdType,
                row.ProdTypeDis,
                row.ScheduledProd
              );

              this.DisableFields(this.selectedRow[0].OrderStatus);

              // response.forEach((x) => {
              //   let temp = x.split('-');
              //   let obj = {
              //     code: temp[0],
              //     value: temp[1],
              //   };
              //   tempList.push(obj);
              // });
              //this.VehicleTypeList = tempList;
              //this.ProcessOrderLoading = false;
            },
            error: (e) => {},
            complete: () => {},
          });
      }
    }
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

  UpdateBackupRecords(pRow: any) {
    let lBkdataList: any[] = [];

    if (this.CurrentTab == 'CREATING') {
      lBkdataList = this.PendingENTBackUp;
    } else if (this.CurrentTab == 'INCOMING') {
      lBkdataList = this.BackupIncomingData;
    } else if (this.CurrentTab == 'DETAILING') {
      lBkdataList = this.PendingDETBackup;
    } else if (this.CurrentTab == 'CANCELLED') {
      lBkdataList = this.CancelBackup;
    } else if (this.CurrentTab == 'PROCESSING') {
      lBkdataList = this.ProcessBackup;
    } else if (this.CurrentTab == 'ALL') {
      lBkdataList = this.AllDataBackup;
    } else if (this.CurrentTab == 'SEARCH') {
      lBkdataList = this.SearchResultDataBackup;
    }
    for (let j = 0; j < lBkdataList.length; j++) {
      let lCurrBackupRow = lBkdataList[j];
      // if (
      //   pRow.JobID == lCurrBackupRow.JobID &&
      //   pRow.ProdType == lCurrBackupRow.ProdType &&
      //   pRow.StructureElement == lCurrBackupRow.StructureElement &&
      //   pRow.ScheduledProd == lCurrBackupRow.ScheduledProd &&
      //   pRow.SAPSONo == lCurrBackupRow.SAPSONo &&
      //   pRow.SORNo == lCurrBackupRow.SORNo &&
      //   pRow.sno == lCurrBackupRow.sno
      // ) {
      //   // lCurrBackupRow = JSON.parse(JSON.stringify(pRow));
      //   lBkdataList[j] = pRow;
      //   break;
      // }

      /** For Issue -> Shows double records after update. */
      if (pRow.sno == lCurrBackupRow.sno) {
        // lCurrBackupRow = JSON.parse(JSON.stringify(pRow));
        lBkdataList[j] = pRow;
        break;
      }
    }
  }

  ChangeSelectionModel() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'md',
    };
    const modalRef = this.modalService.open(
      ProcessSelectionModelComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.currentSelection = this.cellSelection;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      if (x) {
        this.cellSelection = true;
      } else {
        this.cellSelection = false;
      }
    });
  }

  selectCell(
    cell: any,
    columnsList: any,
    row: any,
    dataList: any[],
    event: MouseEvent
  ) {
    if (this.cellSelection) {
      if (event.shiftKey) {
        if (this.lastSelctedColumn) {
          let lcellIndex = undefined; //columnsList.findIndex(x==cell)
          let lcellIndexOld = undefined;
          for (let i = 0; i < columnsList.length; i++) {
            let lColumn = columnsList[i];
            if (lColumn == cell) {
              lcellIndex = i;
            }
            if (lColumn == this.lastSelctedColumn) {
              lcellIndexOld = i;
            }
          }
          if (lcellIndexOld != undefined && lcellIndex != undefined) {
            if (lcellIndexOld < lcellIndex) {
              for (let i = lcellIndexOld; i <= lcellIndex; i++) {
                let lColumn = columnsList[i];
                lColumn.cellSelected = true;
                this.lastSelctedColumn = lColumn;
              }
              return;
            }
          }
        }
      }
      for (let i = 0; i < columnsList.length; i++) {
        let lColumn = columnsList[i];
        lColumn.cellSelected = false;
      }
      cell.cellSelected = !cell.cellSelected;
      this.lastSelctedColumn = cell;
    }
  }

  CheckCellSelection_id(item: any): boolean {
    if (item.isSelected) {
      if (this.cellSelection) {
        return false;
      }
      return true;
    }
    return false;
  }

  CheckCellSelection(item: any, column: any): boolean {
    if (item.isSelected) {
      if (this.cellSelection) {
        if (column.cellSelected) {
          return true;
        }
        return false;
      }
      return true;
    }
    return false;
  }
  // updateSearchFormattedDate(value: any) {
  //   if (value) {
  //     let lDate: any = value.year + '/' + value.month + '/' + value.day;
  //     let lReturn: any = new Date(lDate).toLocaleDateString();
  //     lReturn = this.datepipe.transform(lReturn, 'yyyy-MM-dd', 'UTC+8');
  //     return lReturn;
  //   }
  //   return '';
  // }
  updateSearchFormattedDate(value: any) {
    if (value) {
      let lDate: any = value.month + '/' + value.day + '/' + value.year;
      lDate = this.datepipe.transform(lDate, 'yyyy-MM-dd', 'UTC+8');
      return lDate;
    }
    return '';
  }

  CopyData() {
    if (this.selectedRow.length == 0) {
      this.toastr.error('Data Not Selected!');
      return;
    }
    console.log('Copy Data');
    // let tableHTML: string = 'my name is Kunal\nhello';
    let tableHTML: string = '';
    let lColumnList: any[] = [];

    if (this.CurrentTab == 'CREATING') {
      lColumnList = this.pendingEntCols;
    } else if (this.CurrentTab == 'INCOMING') {
      lColumnList = this.incomingCols;
    } else if (this.CurrentTab == 'DETAILING') {
      lColumnList = this.dettCols;
    } else if (this.CurrentTab == 'CANCELLED') {
      lColumnList = this.cancelledCols;
    } else if (this.CurrentTab == 'PROCESSING') {
      lColumnList = this.processingCols;
    } else if (this.CurrentTab == 'ALL') {
      lColumnList = this.allDataCols;
    } else if (this.CurrentTab == 'SEARCH') {
      lColumnList = this.searchCols;
    }

    for (let k = 0; k < this.selectedRow.length; k++) {
      let lRowData = '';
      let spaces = '\t';
      let lRow = this.selectedRow[k];

      for (let i = 0; i < lColumnList.length; i++) {
        let lColumn = lColumnList[i];
        if (lColumn.colName === 'linkTo') {
          continue;
        }
        if (this.cellSelection) {
          if (lColumn.cellSelected) {
            let lValue = lRow[lColumn.colName];
            lRowData = lRowData + spaces + lValue;
          }
        } else {
          let lValue = lRow[lColumn.colName];
          lRowData = lRowData + spaces + lValue;
        }
      }
      lRowData = lRowData.trim();
      if (k == 0) {
        tableHTML = lRowData;
      } else {
        tableHTML = tableHTML + '\n' + lRowData;
      }
    }

    tableHTML.trim();
    this.copyToClipboard(tableHTML);
  }

  copyToClipboard(html: string) {
    // const listener = (e: ClipboardEvent) => {
    //   e.clipboardData!.setData('text/html', html);
    //   e.clipboardData!.setData('text/plain', html);
    //   e.preventDefault();
    // };

    // document.addEventListener('copy', listener);
    // document.execCommand('copy');
    // document.removeEventListener('copy', listener);

    const textArea = document.createElement('textarea');
    textArea.value = html;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    this.toastr.success('Data Copied Scuccessfully!');
  }

  OpenLoadDetails(item: any) {
    if (item.LoadNo) {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        // centered: true,
        size: 'xl',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(
        LoadDetailsComponent,
        ngbModalOptions
      );
      modalRef.componentInstance.customerCode = item.CustomerCode;
      modalRef.componentInstance.projectCode = item.ProjectCode;
      modalRef.componentInstance.loadNumber = item.LoadNo;
    }
  }
  ResetSelectedRow() {
    this.resetSelectedRowColor();
    this.selectedRow = [];
  }

  async GetGreenSteelToggleValue(SAPSOR: any) {
    try {
      const data = await this.orderService
        .GetGreenSteelToggleValue(SAPSOR)
        .toPromise();
      if (data) {
        this.gGreenSteelSelection = data;
      }
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  ResetProcessField() {
    //alert('REset alert');
    this.selectedRow = [];
    this.resetSelectedRowColor();
    this.ResetOrderDetailsTable();
    this.ProcessOrderForm.controls.customer.reset();
    this.ProcessOrderForm.controls.project.reset();
    this.ProcessOrderForm.controls.ponumber.reset();
    this.ProcessOrderForm.controls.Contract.reset();
    this.ProcessOrderForm.controls.ReqDate.reset();
    this.ProcessOrderForm.controls.UpdateReqDate.reset();
    this.ProcessOrderForm.controls.Address.reset();
    this.ProcessOrderForm.controls.Gate.reset();
    // this.ProcessOrderForm.controls.ShipTo.reset();

    // this.ProcessOrderForm = this.formBuilder.group({
    //   customer: new FormControl(''),
    //   project: new FormControl(''),
    //   ponumber: new FormControl(''),
    //   Contract: new FormControl(''),
    //   ShipTo: new FormControl(''),
    //   ProjectStage: new FormControl(''),
    //   SONumber: new FormControl(''),
    //   OrderType: new FormControl('CREDIT'),
    //   VehicleType: new FormControl('TR40/24-40ft 24mt Trailer'),
    //   ReqDate: new FormControl(''),
    //   UpdateReqDate: new FormControl(''),
    //   CABWeight: new FormControl(''),
    //   SBWeight: new FormControl(''),
    //   TotalPcs: new FormControl(''),
    //   TotalWeight: new FormControl(''),
    //   wbs1: new FormControl(''),
    //   wbs2: new FormControl(''),
    //   wbs3: new FormControl(''),
    // });
  }
  updateBPCItems(pselectedRows: any, pSOR: any) {
    let ldataList = this.GetTableData();
    for (let i = 0; i < ldataList.length; i++) {
      let item = ldataList[i];
      if (item.JobID == pselectedRows.JobID) {
        let lSOR = ldataList[i].SORNo;
        if (lSOR == pSOR) {
          // lGrid.invalidateRow(lRowNoF);
          if (item.OrderStatus != null) {
            item.OrderStatus = 'Cancelled';
          }
          item.OrderStatusCK = 'Cancelled';
          if (item.SORStatus != null) {
            item.SORStatus = 'X';
          }

          item.SAPPONo = item.PONumber + '-CXL';

          // Update the Backup Data
          this.UpdateBackUpData(item);

          // lDataView.updateItem(item.id, item);
          // lGrid.render();
        } else {
          for (let m = 0; m < this.OrderDetailsList_BPC.length; m++) {
            //item = lDataView.getItem(m);
            let lSOR = item.SORNo;
            if (lSOR == pSOR) {
              //lGrid.invalidateRow(m);
              if (item.OrderStatus != null) {
                item.OrderStatus = 'Cancelled';
              }
              item.OrderStatusCK = 'Cancelled';
              if (item.SORStatus != null) {
                item.SORStatus = 'X';
              }

              item.SAPPONo = item.PONumber + '-CXL';
              // Update the Backup Data
              this.UpdateBackUpData(item);

              //lDataView.updateItem(item.id, item);
              //lGrid.render();
              break;
            }
          }
        }
      }
    }
  }

  UpdateBackUpData(pItem: any): void {
    // Get the list of backup for the current Tab.
    let lDataList = this.GetBackupTableData();
    if (lDataList) {
      for (let i = 0; i < lDataList.length; i++) {
        let lItem = lDataList[i];
        // If the current record of the backup list matches the Parameter(pItem), Update the Backup item wiht the parameter.
        if (
          lItem.sno == pItem.sno &&
          lItem.sno != 0 &&
          lItem.sno != undefined &&
          lItem.sno != null
        ) {
          lItem = pItem;
        }
      }
    }
  }

  gTableSelected: boolean = false;
  setCopyFlag(pFlag: boolean, pEvent: MouseEvent) {
    console.log('pFlag', pFlag);
    console.log('pEvent', pEvent);
    this.gTableSelected = false;

    if (pFlag) {
      pEvent.stopPropagation();
      this.gTableSelected = true;
    }
  }

  gFilteredWeight: any = 0;
  gFilteredQty: any = 0;

  SetFilteredWeight(response: any) {
    console.log('Filter weight notes');
    this.gFilteredQty = 0;
    this.gFilteredWeight = 0;
    for (var i = 0; i < response.length; i++) {
      // if (response[i].OrderStatus != "Cancelled" && response[i].SORStatus != "X") {
      this.gFilteredQty = this.gFilteredQty + 1;
      if (Number(response[i].TotalWeight) > 0) {
        this.gFilteredWeight =
          this.gFilteredWeight + Number(response[i].TotalWeight);
      }
      // }
    }
    this.gFilteredWeight = Number(this.gFilteredWeight).toFixed(3);
  }
  public get inverseOfTranslation(): string {
    if (
      !this.viewPortSearch ||
      !this.viewPortSearch['_renderedContentOffset']
    ) {
      return '-0px';
    }
    let offset = this.viewPortSearch['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfTranslationSearch(): string {
    if (
      !this.viewPortSearch ||
      !this.viewPortSearch['_renderedContentOffset']
    ) {
      return '50px';
    }
    let offset = this.viewPortSearch['_renderedContentOffset'] - 50;
    return `-${offset}px`;
  }

  public get inverseOfTranslationProcess(): string {
    if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPort['_renderedContentOffset'];
    return `-${offset}px`;
  }

  public get inverseOfTranslationProcessSearch(): string {
    if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
      return '50px';
    }
    let offset = this.viewPort['_renderedContentOffset'] - 50;
    return `-${offset}px`;
  }

  public get inverseOfDET(): string {
    if (!this.viewPortDET || !this.viewPortDET['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPortDET['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfDETSearch(): string {
    if (!this.viewPortDET || !this.viewPortDET['_renderedContentOffset']) {
      return '50px';
    }
    let offset = this.viewPortDET['_renderedContentOffset'] - 50;
    return `-${offset}px`;
  }

  public get inverseOfIncoming(): string {
    if (
      !this.viewPortIncoming ||
      !this.viewPortIncoming['_renderedContentOffset']
    ) {
      return '-0px';
    }
    let offset = this.viewPortIncoming['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfIncomingSearch(): string {
    if (
      !this.viewPortIncoming ||
      !this.viewPortIncoming['_renderedContentOffset']
    ) {
      return '50px';
    }
    let offset = this.viewPortIncoming['_renderedContentOffset'] - 50;
    return `-${offset}px`;
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
      return '50px';
    }
    let offset = this.viewPortENT['_renderedContentOffset'] - 50;
    return `-${offset}px`;
  }
  public get inverseOfCancellation(): string {
    if (
      !this.viewPortCancelled ||
      !this.viewPortCancelled['_renderedContentOffset']
    ) {
      return '-0px';
    }
    let offset = this.viewPortCancelled['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfCancellationSearch(): string {
    if (
      !this.viewPortCancelled ||
      !this.viewPortCancelled['_renderedContentOffset']
    ) {
      return '50px';
    }
    let offset = this.viewPortCancelled['_renderedContentOffset'] - 50;
    return `-${offset}px`;
  }
  public get inverseOfAll(): string {
    if (!this.viewPortAll || !this.viewPortAll['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPortAll['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfAllSearch(): string {
    if (!this.viewPortAll || !this.viewPortAll['_renderedContentOffset']) {
      return '50px';
    }
    let offset = this.viewPortAll['_renderedContentOffset'] - 50;
    return `-${offset}px`;
  }

  // Synchronize the scroll between header and body
  syncScroll(event: any) {
    // console.log('syncScroll=>', event);
    //this.tableContainer.nativeElement.scrollLeft = event.target.scrollLeft;
    // const header = document.querySelector('.header-container') as HTMLDivElement;
    // const body = document.querySelector('.body-container') as HTMLDivElement;
    // body.addEventListener('scroll', () => {
    //   header.scrollLeft = body.scrollLeft;
    // });
  }

  checkForLink(pColName: any) {
    if (pColName == 'LoadNo' || pColName == 'DeliveryNo') {
      return true;
    }
    return false;
  }

  columnHidden(colName: any) {
    if (colName == 'PendingENT') {
      localStorage.setItem(
        'pendingEntCols',
        JSON.stringify(this.pendingEntCols)
      );
    } else if (colName == 'Incoming') {
      localStorage.setItem('incomingCols', JSON.stringify(this.incomingCols));
    } else if (colName == 'PendingDET') {
      localStorage.setItem('dettCols', JSON.stringify(this.dettCols));
    } else if (colName == 'Cancelled') {
      localStorage.setItem('cancelledCols', JSON.stringify(this.cancelledCols));
    } else if (colName == 'Processing') {
      localStorage.setItem(
        'processingCols',
        JSON.stringify(this.processingCols)
      );
    } else if (colName == 'All') {
      localStorage.setItem('allDataCols', JSON.stringify(this.allDataCols));
    } else if (colName == 'Search') {
      localStorage.setItem('searchCols', JSON.stringify(this.searchCols));
    }
  }

  showOrderDetailsLoader() {
    if (this.selectedRow.length != 0) {
      if (
        this.showBBSBar == false &&
        this.showBBS == false &&
        this.showMESH == false &&
        this.showStdMESH == false &&
        this.showStdProd == false &&
        this.showBPC == false
      ) {
        return true;
      }
    }
    return false;
  }

  getCellOffsetValue(): number {
    let lOffset = 0;
    // Get the element by its ID
    let cell: any = document.getElementById('bodycell');
    if (cell) {
      // Get the computed styles for the element
      let styles = window.getComputedStyle(cell);

      // Access the border size
      lOffset = parseFloat(styles.borderLeftWidth);
    }

    return lOffset;
  }

  GetLocalObjName(pTabName: string): string {
    if (pTabName == 'CREATING') {
      return 'pendingEntCols';
    } else if (pTabName == 'INCOMING') {
      return 'incomingCols';
    } else if (pTabName == 'DETAILING') {
      return 'dettCols';
    } else if (pTabName == 'CANCELLED') {
      return 'cancelledCols';
    } else if (pTabName == 'PROCESSING') {
      return 'processingCols';
    } else if (pTabName == 'ALL') {
      return 'allDataCols';
    } else if (pTabName == 'SEARCH') {
      return 'searchCols';
    }
    return '';
  }

  UpdateLocalStorageColumnName() {
    let lTabs = [
      'CREATING',
      'INCOMING',
      'DETAILING',
      'CANCELLED',
      'PROCESSING',
      'ALL',
      'SEARCH',
    ];
    lTabs.forEach((x: any) => {
      this.UpdateLocalStorage(x);
    });
  }

  UpdateLocalStorage(pTabName: string) {
    // let lTab = 'SEARCH'; // Tab name
    let lTab = pTabName; // Tab name
    let lObjName = this.GetLocalObjName(lTab); // Name of the local object where the Column lsit is stored.
    if (lObjName) {
      let lColumnslist: any = localStorage.getItem(lObjName); // Get the Column list from local strorage.
      lColumnslist = lColumnslist ? JSON.parse(lColumnslist) : null;
      if (lColumnslist) {
        // Update the column display name to 'Plan Delivery Date' for 'ConfirmedDelDate' column.
        lColumnslist.forEach((x: any) => {
          x.displayName =
            x.controlName == 'ConfirmedDelDate'
              ? 'Plan Delivery Date'
              : x.displayName;
        });
        localStorage.setItem(lObjName, JSON.stringify(lColumnslist)); // Update the column in localStorage.
      }
    }
  }

  // #region DateChanged event handlers
  // Updated logic for Req Date Change
  // To handle the case where the user opens the calendar and re-selects the already selected date.

  private dateSelected = false; // Tracks whether a date was selected
  private clickListener: (() => void) | null = null; // To remove listener later
  private activeDatepicker: MatDatepicker<any> | null = null;

  onDatepickerOpened(datepicker: MatDatepicker<any>) {
    this.activeDatepicker = datepicker;
    // Attach click listener to the datepicker popup for the opened datepicker
    const datepickerPopup = document.querySelector('.mat-datepicker-content');
    if (datepickerPopup) {
      this.clickListener = this.renderer.listen(
        datepickerPopup,
        'click',
        () => {
          this.dateSelected = true; // Mark that a date was explicitly selected
        }
      );
    }
  }

  onDatepickerClosed(datepicker: MatDatepicker<any>, dateId: string) {
    if (this.activeDatepicker === datepicker) {
      // Handle date selection only for the currently active datepicker
      if (this.dateSelected) {
        this.dateSelected = false; // Reset the flag
        if (dateId == 'pickerReqDate') {
          this.setReqDateFrom(); // Call the function when Req Date is selected.
        } else if (dateId == 'pickerUpdateReqDate') {
          this.setReqDateTo(); // Call the function when Updated Req Date is selected.
        }
      }
      this.cleanupListeners();
      this.activeDatepicker = null; // Reset active datepicker
    }
  }

  private cleanupListeners() {
    if (this.clickListener) {
      this.clickListener(); // Remove the click listener
      this.clickListener = null;
    }
  }
  // #endregion

  private ResetOrderDetailsTable(): void {
    this.showStdMESH = false;
    this.showBBS = false;
    this.showBBSBar = false;
    this.showStdProd = false;
    this.showMESH = false;
    this.showBPC = false;
    this.showComponent = false;
  }

  ScrolltoOffset_Down(
    pViewPort: CdkVirtualScrollViewport,
    pNextRowIndex: any
  ): boolean {
    // Viewportsize to be handled by substracting the height from heading.
    const lViewPortSize = pViewPort.getViewportSize();
    const lCurrentOffset = pViewPort.measureScrollOffset();

    let lBodyCell = document.getElementById('body-cell');
    let lCellHeight = 30;
    if (lBodyCell) {
      lCellHeight = lBodyCell.offsetHeight;
    }

    if (lCellHeight) {
      const lOffsetIndex = lCurrentOffset / 30; // Always put hardcoded value for calculating Offset.
      const lViewPortTableSize = Math.floor(
        (lViewPortSize - this.GetHeadingHeight()) / lCellHeight
      );

      if (pNextRowIndex > lOffsetIndex + lViewPortTableSize) {
        return true;
      }
    }
    return false;
  }

  ScrolltoOffset_Up(
    pViewPort: CdkVirtualScrollViewport,
    pNextRowIndex: any
  ): boolean {
    const lViewPortSize = pViewPort.getViewportSize();
    const lCurrentOffset = pViewPort.measureScrollOffset();

    let lBodyCell = document.getElementById('body-cell');
    let lCellHeight = 30;
    if (lBodyCell) {
      lCellHeight = lBodyCell.offsetHeight;
    }

    if (lCellHeight) {
      const lOffsetIndex = lCurrentOffset / 30; // Always put hardcoded value for calculating Offset.
      const lViewPortTableSize = Math.floor(
        (lViewPortSize - this.GetHeadingHeight()) / lCellHeight
      );

      if (pNextRowIndex < lOffsetIndex) {
        return true;
      }
    }
    return false;
  }

  GetHeadingHeight(): number {
    let lHeadingCell = document.getElementById('heading-cell');
    let lSearchCell = document.getElementById('search-cell');

    let lHeadHeight = 62;
    let lSearchHeight = 38;

    if (lHeadingCell) {
      lHeadHeight = Math.ceil(lHeadingCell.offsetHeight);
    }
    if (lSearchCell) {
      lSearchHeight = Math.ceil(lSearchCell.offsetHeight);
    }

    return lHeadHeight + lSearchHeight;
  }

  ScrollToOffsetHorizontal(
    viewport: CdkVirtualScrollViewport,
    pFixedCols: any,
    pColumnList: any,
    pColumnId: any,
    pRight2left: boolean
  ): boolean {
    let lViewPort = document.getElementById('view-port');
    let lViewPortWidth = 30;
    if (lViewPort) {
      lViewPortWidth = lViewPort.offsetWidth; // default viewport width
    }
    if (lViewPortWidth) {
      if (pColumnId < pFixedCols) {
        return false; // if the column is fixed, do not scroll
      }
      let lFixedColWidth = 0;
      for (let i = 0; i < pFixedCols; i++) {
        // calculate the total width of the fixed columns
        if (pColumnList[i].isVisible) {
          lFixedColWidth += Number(pColumnList[i].width);
        }
      }

      lViewPortWidth -= lFixedColWidth; // Subtract fixed column width from viewport width

      const lLeftOffset = viewport.measureScrollOffset('left'); // Measure scroll offset

      let lCurrentColumnWidth = 0;
      for (let i = pFixedCols; i <= pColumnId; i++) {
        if (pColumnList[i].isVisible) {
          lCurrentColumnWidth += Number(pColumnList[i].width);
        }
      }

      if (!pRight2left) {
        // When going left to right
        if (lViewPortWidth < lCurrentColumnWidth - lLeftOffset) {
          return true;
        } else if (lViewPortWidth - (lCurrentColumnWidth - lLeftOffset) < 100) {
          return true;
        }
      } else {
        // When going right to left
        if (lCurrentColumnWidth <= lLeftOffset) {
          return true;
        }
      }
    }
    return false;
  }

  UpdateColList() {
    this.pendingEntCols = this.UpdateColumns(
      this.pendingEntCols,
      'pendingEntCols'
    );
    this.incomingCols = this.UpdateColumns(this.incomingCols, 'incomingCols');
    this.dettCols = this.UpdateColumns(this.dettCols, 'dettCols');
    this.cancelledCols = this.UpdateColumns(
      this.cancelledCols,
      'cancelledCols'
    );
    this.processingCols = this.UpdateColumns(
      this.processingCols,
      'processingCols'
    );
    this.allDataCols = this.UpdateColumns(this.allDataCols, 'allDataCols');
    this.searchCols = this.UpdateColumns(this.searchCols, 'searchCols');
  }

  UpdateColumns(pColList: any, pObjName: any): any {
    for (let i = 0; i < pColList.length; i++) {
      if (typeof pColList[i].width == 'string') {
        if (pColList[i].width.includes('px')) {
          pColList[i].width = pColList[i].width.replace('px', '');
        }
      }
    }
    localStorage.setItem(pObjName, JSON.stringify(pColList));
    return pColList;
  }

  showCarbonRate: boolean = false;
  showEpdValue: boolean = false;
  showRecycleContent: boolean = false;
  isGreenSteelDisabled: boolean = false;

  GetGreenSteelValue(ContractNo: string): void {
    this.showCarbonRate = false;
    this.showEpdValue = false;
    this.showRecycleContent = false;
    this.gGreenSteelSelection = false;

    this.orderService.getGreenSteelDetails(ContractNo).subscribe({
      next: (response: any) => {
        console.log('getGreenSteelDetails', response);
        this.GreenSteelData = response;
        this.LOW_CARBON_RATE = response.LowCarbonRate.trim() || '';
        this.EPD_VALUE = response.EpdValue.trim() || '';
        this.RECYCLE_CONTENT = response.RecycleContent.trim() || '';

        if (this.LOW_CARBON_RATE) {
          let lowCarbonRate = Number(this.LOW_CARBON_RATE);
          if (lowCarbonRate > 0) {
            this.showCarbonRate = true;
            this.showEpdValue = true;
            this.showRecycleContent = true;

            // Condition to disable Green-Steel selection
            let row = this.selectedRow[0];
            if (
              row.OrderStatus != 'Cancelled' &&
              row.OrderStatus != 'Processed' &&
              row.OrderStatus != 'Production' &&
              row.OrderStatus != 'Reviewed' &&
              row.OrderStatus != 'Delivered' &&
              !row.OrderStatus.includes('Delivered')
            ) {
              this.isGreenSteelDisabled = false;
              this.gGreenSteelSelection = true; // Set Green-Steel selection as TRUE, By Default.
            } else {
              this.isGreenSteelDisabled = true;
              this.GetGreenSteelToggleValue(row.SORNo);
            }
          }

          this.LOW_CARBON_RATE = this.LOW_CARBON_RATE
            ? this.LOW_CARBON_RATE + '%'
            : '';
          this.ProcessOrderForm.controls['LowCarbon'].patchValue(
            this.LOW_CARBON_RATE
          );
          this.ProcessOrderForm.get('LowCarbon')?.disable();
        }

        if (this.EPD_VALUE) {
          this.ProcessOrderForm.controls['EPDValue'].patchValue(this.EPD_VALUE);
          this.ProcessOrderForm.get('EPDValue')?.disable();
        }

        if (this.RECYCLE_CONTENT) {
          this.ProcessOrderForm.controls['RecycleContent'].patchValue(
            this.RECYCLE_CONTENT
          );
          this.ProcessOrderForm.get('RecycleContent')?.disable();
        }

        this.GetGreenSteelFlag();
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  gGreenSteelSelection: boolean = false;
  UpdateGreenSteel() {
    console.log(this.gGreenSteelSelection);
  }

  confirmExcess(
    pExecess: string,
    responsesbContract: any,
    lCustomer: any,
    lProject: any,
    lJobID: any,
    lContract: any,
    lOrderSource: any,
    lProdType: any,
    lProdTypeL2: any
  ) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ConfirmExcessMailComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.pExecess = pExecess;

    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      if (x === true) {
        this.SendExceedContractEmailSubmit(
          lCustomer,
          lProject,
          lJobID,
          lContract,
          lOrderSource,
          lProdType,
          lProdTypeL2,
          Number(responsesbContract.totalWeight).toFixed(3),
          Number(responsesbContract.contractCap).toFixed(3)
        );
      }
      return;
    });
    return;
  }
  /**
   * ODOS CR : Allow user to update structure elements in Incoming Order for Scheduled orders and CAB.
   * Dated : 25/02/2025
   */
  gEditStructureElement_Flag: boolean = false;
  gUpdatedStructureElement: string = '';
  EditStructureElement(pItemDetails: any) {
    if (
      this.selectedRow[0].OrderStatus == 'Created*' ||
      this.selectedRow[0].OrderStatus == 'Submitted'
    ) {
      this.gEditStructureElement_Flag = true;
      this.gUpdatedStructureElement = pItemDetails.BBSStrucElem;
    }
  }

  async UpdateStrutureElement(pItemDetails: any) {
    if (!this.gUpdatedStructureElement) {
      this.gEditStructureElement_Flag = false;
      return;
    }
    console.log('pItem', pItemDetails);
    console.log('selectedRow', this.selectedRow[0]);
    this.gEditStructureElement_Flag = false;
    let lItem = this.selectedRow[0];
    let lUserName = this.loginService.GetGroupName();

    let lObj: UpdateStructureElement = {
      OrderNumber: lItem.JobID,
      CustomerCode: lItem.CustomerCode,
      ProjectCode: lItem.ProjectCode,
      OriginalSE: pItemDetails.BBSStrucElem,
      UpdatedSE: this.gUpdatedStructureElement,
      intUpdatedPostHeaderId: 0,
      intOrginalPostHeaderId: 0,
      ProdType: '',
      ScheduledProd: '',
      UserName: lUserName,
    };

    if (lItem.ProdType == 'CAB') {
      // For updating CAB orders
      lObj.ProdType = 'CAB';
      lObj.ScheduledProd = 'N';
    } else {
      // For updating Scheduled orders

      // "pItemDetails.BBSID" is original postheaderID;
      let lItem = this.ProductListdata?.find(
        (p) =>
          p.StructEle?.toUpperCase() ===
          this.gUpdatedStructureElement?.toUpperCase()
      );
      if (lItem) {
        lObj.intUpdatedPostHeaderId = lItem.PostHeaderID;
      } else {
        // Return error;
        alert(
          'Error in updating struture element. Please try again after re-selecting the order.'
        );
        return;
      }
      lObj.intOrginalPostHeaderId = pItemDetails.BBSID;
      lObj.ProdType = pItemDetails.BBSProdCategory;
      lObj.ScheduledProd = 'Y';
    }
    // Call API to update structure element.
    this.ProcessOrderLoading = true; // Loading START
    let lResponse = await this.UpdateStructElementPOST(lObj);
    if (lResponse == 'error') {
      //Show error popup;
      alert('error');
    } else {
      if (lResponse) {
        // Update the new strcture element at both the tables.
        pItemDetails.BBSStrucElem = this.gUpdatedStructureElement;
        this.selectedRow[0].StructureElement = this.gUpdatedStructureElement;
        this.selectedRow[0].StructureElementDis = this.gUpdatedStructureElement;
        this.UpdateBackupRecords(this.selectedRow[0]);

        // After success, Update the StrctureElementList list
        this.GetStrctureElementListPOST(this.selectedRow[0]);
      } else {
        //Show error popup;
        alert('error');
      }
    }
    this.ProcessOrderLoading = false; // Loading END
  }

  async UpdateStructElementPOST(pObj: UpdateStructureElement): Promise<any> {
    try {
      const data = this.orderService
        .UpdateStructureElementIncoming(pObj)
        .toPromise();
      return data;
      // return true;
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

  ProductListdata: any[] = [];
  StructureElementList: any[] = [
    'BEAM',
    'COLUMN',
    'SLAB',
    'SLAB-B',
    'SLAB-T',
    'DWALL',
    'PILE',
    'WALL',
  ];
  GetStrctureElementListPOST(pObj: any) {
    if (pObj.ScheduledProd == 'Y') {
      // Call API to get mesh PRC data.
      let lItem = {
        ProjectCode: pObj.ProjectCode,
        WBS1: [pObj.WBS1],
        WBS2: [pObj.WBS2],
        WBS3: [pObj.WBS3],
        CustomerCode: pObj.CustomerCode,
      };
      this.ProductListdata = [];
      this.orderService.GetMeshPRCData(lItem).subscribe({
        next: (data) => {
          console.log('MeshPRCData', data);
          if (data) {
            this.ProductListdata = data;
            let lStructList = [];
            let lStructureElementList = [];
            for (let i = 0; i < data.length; i++) {
              if (data[i].ProductType === pObj.ProdType) {
                lStructList.push(data[i]);
                lStructureElementList.push(data[i].StructEle);
              }
            }

            this.ProductListdata = lStructList;
            // Update StructureElementList based on the available Structure Elements.
            this.StructureElementList = lStructureElementList;
          }
        },
        error: (e) => {},
        complete: () => {},
      });
    } else {
      if (pObj.ProdType === 'CAB') {
        let lCustomerCode = pObj.CustomerCode;
        let lProjectCode = pObj.ProjectCode;
        this.ProductListdata = [];
        let UserName = this.loginService.GetGroupName();

        if (lCustomerCode && lProjectCode) {
          this.orderService
            .ProductSelect(lCustomerCode, lProjectCode, UserName)
            .subscribe({
              next: (response) => {
                this.ProductListdata = response;
                let lStructureElementList = [];
                for (let i = 0; i < response.length; i++) {
                  if (response[i].ProdCode?.includes('cab')) {
                    lStructureElementList.push(response[i].SECode);
                  }
                }

                // Update StructureElementList based on the available Structure Elements.
                this.StructureElementList = lStructureElementList;
              },
              error: (e) => {},
              complete: () => {},
            });
        }
      }
    }
  }

  GetGreenSteelFlag() {
    let lOrderNumber = this.selectedRow[0].JobID;
    let lObj = [lOrderNumber];
    this.orderService.GetGreenSteelFlag(lObj).subscribe({
      next: (response) => {
        if (response) {
          if (response.GreenSteel) {
            console.log('GreenSteel enabled for the order.');

            if (!this.isReviewedGreenOrder) {
              this.gGreenSteelSelection = true;
            }
            this.showCarbonRate = true;
            this.showEpdValue = true;
            this.showRecycleContent = true;
          } else {
            if (!this.isReviewedGreenOrder) {
              this.gGreenSteelSelection = false;
            }
          }
        }
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  // Validate GreenSteel Selection
  ValidateGreenSteel(): boolean {
    let lCarbonRate = this.LOW_CARBON_RATE.split('%')
      ? this.LOW_CARBON_RATE.split('%')[0]
      : 0;
    let lContract = this.ProcessOrderForm.controls.Contract.value.split(' ')[0];

    if (this.gGreenSteelSelection == true && Number(lCarbonRate) == 0) {
      alert(
        'Order cannot be placed with GreenSteel under the contract: ' +
          lContract
      );
      return false;
    } else if (
      this.gGreenSteelSelection == false &&
      Number(lCarbonRate) == 100
    ) {
      alert(
        'Order cannot be placed with Non GreenSteel under the contract: ' +
          lContract
      );
      return false;
    }
    return true;
  }

  OpenESM() {
    console.log('selectedRow:', this.selectedRow);
    console.log('SO No:', this.selectedRow?.[0]?.SAPSONo);
    if (this.selectedRow && this.selectedRow[0]?.SAPSONo) {
      this.isLoading = true;
      this.router.navigate(['/order/esm-new'], {
        queryParams: { soNo: this.selectedRow[0].SAPSONo ,
        sorNo: this.selectedRow[0].SORNoDis
        },
      })
    } else {
      alert('SO No. not available for the selected row.');
    }
  }


  DisableSubmitButton() {
    this.disableSubmit = true;
  }
  
  UpdateProcessTabs() {
    this.incomingCols = this.UpdateColumnsWithGateAddresss(this.incomingCols);
    this.incomingColsExcel = this.UpdateColumnsWithGateAddresss(this.incomingColsExcel);
    this.pendingEntColsExcel = this.UpdateColumnsWithGateAddresss(this.pendingEntColsExcel);
    this.dettColsExcel = this.UpdateColumnsWithGateAddresss(this.dettColsExcel);
    this.pendingEntCols = this.UpdateColumnsWithGateAddresss(this.pendingEntCols);
    this.dettCols = this.UpdateColumnsWithGateAddresss(this.dettCols);
    this.cancelledCols = this.UpdateColumnsWithGateAddresss(this.cancelledCols);
    this.cancelledColsExcel = this.UpdateColumnsWithGateAddresss(this.cancelledColsExcel);
    this.processingCols = this.UpdateColumnsWithGateAddresss(this.processingCols);
    this.processingColsExcel = this.UpdateColumnsWithGateAddresss(this.processingColsExcel);
    this.allDataColsExcel = this.UpdateColumnsWithGateAddresss(this.allDataColsExcel);
    this.searchColsExcel = this.UpdateColumnsWithGateAddresss(this.searchColsExcel);
    this.allDataCols = this.UpdateColumnsWithGateAddresss(this.allDataCols);
    this.searchCols = this.UpdateColumnsWithGateAddresss(this.searchCols);
  }

  UpdateColumnsWithGateAddresss(pColumnList: any) {
    console.log('pColumnList', pColumnList);

    let lAddressIndex = pColumnList.findIndex(
      (element: any) => element.controlName === 'Address'
    );
    let lGateIndex = pColumnList.findIndex(
      (element: any) => element.controlName === 'Gate'
    );

    if (lAddressIndex == -1) {
      let lObj = {
          width: '80',
          controlName: 'Address',
          displayName: 'Address',
          colName: 'Address',
          field: 'Address',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        };
      pColumnList.push(lObj);
    }

    if (lGateIndex == -1) {
      let lObj = {
          width: '80',
          controlName: 'Gate',
          displayName: 'Gate',
          colName: 'Gate',
          field: 'Gate',
          isVisible: true,
          resizeWidth: '0',
          left: '0',
          cellSelected: false,
        };
      pColumnList.push(lObj);
    }
    return pColumnList;
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

  filterDataforESM(pDataList: any) {
    let isEsmUser = this.commonService.isEsmUser;
    if(isEsmUser) {
      pDataList = pDataList.filter((item: any) => item.Sales_org == '6801')
    }

    return pDataList;
  }
}
