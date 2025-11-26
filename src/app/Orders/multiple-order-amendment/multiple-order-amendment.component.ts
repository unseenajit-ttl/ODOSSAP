import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { DatePipe, Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import { OrderService } from '../orders.service';
import { OrdersForAmendment } from 'src/app/Model/ordersforamendment';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SORWatchlistComponent } from './sor-watchlist/sor-watchlist.component';
import { AmendmentIndicators } from 'src/app/Model/amendmentindicators';
import { AmendmentRequiredDate } from 'src/app/Model/amendmentrequireddate';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatDateFormats,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

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
  selector: 'app-multiple-order-amendment',
  templateUrl: './multiple-order-amendment.component.html',
  styleUrls: ['./multiple-order-amendment.component.css'],
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
export class MultipleOrderAmendmentComponent implements OnInit {
  @ViewChild('scrollViewportAmendment', { static: false })
  public viewPort!: CdkVirtualScrollViewport;

  [x: string]: any;
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  tempGETCustomer: any = '0001101170';
  tempGETProjectCode: any = '0000113012';
  isResizable = false;
  amendmentForm: FormGroup;
  ReqDateForm: FormGroup;
  ChangeIndicatorsForm: FormGroup;

  RDateFrom: any;
  RDateTo: any;
  SORNofrom: any;
  SORNoTo: any;
  WBS1: any;
  WBS2: any;
  WBS3: any;
  SearchOptions: any;
  txtSearch: any;
  SO_SOR_Search_Range: any;
  Req_PO_Date_Search_Range: any;
  Rev_required_Conf_date_from: any;
  Rev_required_Conf_date_to: any;
  Rev_Req_Confirmed_Date_Search_Range: any;
  SearchProducts: any;
  SearchOptionsByDesignation: any;
  lSearchByDesignation: any;
  ranges: any;
  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  searchText: any = '';
  ordersForAmendmentList: any[] = [];
  ordersDesignationDataList: any = [];
  ordersForAmendmentList_backup: any[] = [];
  ordersAmendmentDataList: any[] = [];
  ordersAmendmentProjectList: any[] = [];
  requiredDateCollapse: boolean = true;
  showReqDate: boolean = false;
  FilteredCustomerList:any[]=[];
  ChangeIndicators: boolean = false;
  name: string = '';
  DesignationType: any;
  ProcessOrderLoading: boolean = false;
  columns: any;
  ChangeRequiredDate: boolean = false;

  selectedRow: any[] = [];
  AmendmentLoading: boolean = false;

  TotalTonnage: any = 0;

  isAscending: boolean = true;
  currentSortingColumn = '';
  fixedColumn = 5;
  itemSize = 30;

  constructor(
    private orderService: OrderService,
    private processsharedserviceService: ProcessSharedServiceService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
    // Initialize the form group and form controls
    this.amendmentForm = new FormGroup({
      customer: new FormControl(''),
      project: new FormControl(''),
      Req_PO_Date_Search_Range: new FormControl(''),
      required_date: new FormControl(''),
      required_date_from: new FormControl(''),
      required_date_to: new FormControl(''),
      SO_SOR_Search_Range: new FormControl(''),
      SOR_No: new FormControl(''),
      SOR_No_from: new FormControl(''),
      SOR_No_to: new FormControl(''),
      txtWBS1: new FormControl(''),
      txtWBS2: new FormControl(''),
      txtWBS3: new FormControl(''),
      Rev_Req_Confirmed_Date_Search_Range: new FormControl(''),
      Rev_required_Conf_date: new FormControl(''),
      Rev_required_Conf_date_from: new FormControl(''),
      Rev_required_Conf_date_to: new FormControl(''),
      SearchOptions: new FormControl(''),
      txtSearch: new FormControl(''),
      SearchProducts: new FormControl(''),
      SearchOptionsByDesignation: new FormControl(''),
      ddlDesignation: new FormControl(''),
      one: new FormControl('one'),
      two: new FormControl('two'),
    });

    this.amendmentFormTable = new FormGroup({
      customer: new FormControl(''),
      project: new FormControl(''),
      Req_PO_Date_Search_Range: new FormControl(''),
      required_date: new FormControl(''),
      required_date_from: new FormControl(''),
      required_date_to: new FormControl(''),
      SO_SOR_Search_Range: new FormControl(''),
      SOR_No: new FormControl(''),
      SOR_No_from: new FormControl(''),
      SOR_No_to: new FormControl(''),
      txtWBS1: new FormControl(''),
      txtWBS2: new FormControl(''),
      txtWBS3: new FormControl(''),
      Rev_Req_Confirmed_Date_Search_Range: new FormControl(''),
      Rev_required_Conf_date: new FormControl(''),
      Rev_required_Conf_date_from: new FormControl(''),
      Rev_required_Conf_date_to: new FormControl(''),
      SearchOptions: new FormControl(''),
      txtSearch: new FormControl(''),
      SearchProducts: new FormControl(''),
      SearchOptionsByDesignation: new FormControl(''),
      ddlDesignation: new FormControl(''),
      one: new FormControl('one'),
      two: new FormControl('two'),
      DoNotMix: new FormControl(''),
      SpecialPass: new FormControl(''),
      ConquasOrder: new FormControl(''),
      CallBefDelivery: new FormControl(''),
      ZeroTolerance: new FormControl(''),
      PoliceEscort: new FormControl(''),
      BargeBooked: new FormControl(''),
      CraneBooked: new FormControl(''),
      PremiumService: new FormControl(''),
      UrgentOrder: new FormControl(''),
      OnHold: new FormControl(''),
      GroupID: new FormControl(''),
      SOR_STATUS: new FormControl(''),
      USERID: new FormControl(''),
      ProjCoord: new FormControl(''),
      ExtRemark: new FormControl(''),
      Project: new FormControl(''),
      Customer: new FormControl(''),
      ContractNo: new FormControl(''),
      STELEMENTTYPE: new FormControl(''),
      ProductType: new FormControl(''),
      DELIVERY_STATUS: new FormControl(''),
      WT_DATE: new FormControl(''),
      LP_No_of_Pieces: new FormControl(''),
      WBS3: new FormControl(''),
      WBS2: new FormControl(''),
      WBS1: new FormControl(''),
      ConfirmedDate: new FormControl(''),
      ReqDateTo: new FormControl(''),
      ReqDateFr: new FormControl(''),
      PODate: new FormControl(''),
      IntRemark: new FormControl(''),
      Total_Tonnage: new FormControl(''),
      BBSNo: new FormControl(''),
      PONumber: new FormControl(''),
      SONo: new FormControl(''),
      SORNo: new FormControl(''),
      SrNo: new FormControl(''),
      FiftyTonVehicleAllowed: new FormControl(''),
      LowBedVehicleAllowed: new FormControl(''),
      LorryCrane: new FormControl(''),
    });

    this.ReqDateForm = new FormGroup({
      reqDateFrom: new FormControl(''),
      revisedReqdate: new FormControl(''),
      reason: new FormControl(''),
    });

    this.ChangeIndicatorsForm = new FormGroup({
      OrderOnHold: new FormControl(false),
      ChangeIndicatorReason: new FormControl(''),
      LorryCrane: new FormControl(false),
      DoNotMix: new FormControl(false),
      CallBeforeDelivery: new FormControl(false),
      SpecialPass: new FormControl(false),
      BargeBooked: new FormControl(false),
      CraneBookedOnsite: new FormControl(false),
      PoliceEscortService: new FormControl(false),
      PremiumService: new FormControl(false),
      UrgentOrder: new FormControl(false),
      SpeciaConquasOrderlPass: new FormControl(false),
      ZeroTolerance: new FormControl(false),
      LowBedVehicleAllowed: new FormControl(false),
      FiftyTonVehicleAllowed: new FormControl(false),
      UnitMode: new FormControl(false),
    });

    this.ranges = {
      'Current day': [moment(), moment()],
      'Current week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
      'Next 2 days': [moment().add(1, 'days'), moment().add(2, 'days')],
      'Next 3 days': [moment().add(1, 'days'), moment().add(3, 'days')],
      'Next weekend': [this.getNextSaturday(), this.getNextSunday()],
    };

    this.amendmentForm.controls.customer.valueChanges.subscribe((newValue) => {
      this.Get_AmendmentProject();
      this.amendmentForm.controls.project.reset();
    });
    this.amendmentFormTable.valueChanges.subscribe((newValue: any) => {
      this.filterAllData();
    });
  }
  ngOnInit(): void {
    //this.get_DesignationData();
    this.Get_AmendmentCustomer();
    this.Get_AmendmentProject();
    this.commonService.changeTitle('Order Amendment | ODOS');
    if (localStorage.getItem('amendMentColumns')) {
      this.columns =
        JSON.parse(localStorage.getItem('amendMentColumns')!) ?? [];
    } else {
      this.columns = [
        {
          width: '80',

          displayName: 'Sr No',

          colName: 'SrNo',

          field: 'SrNo',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'SrNo',

          displayName: 'SOR No',

          colName: 'SORNo',

          field: 'SORNo',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'SONo',

          displayName: 'SO No',

          colName: 'SONo',

          field: 'SONo',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'PONumber',

          displayName: 'PO#',

          colName: 'PONumber',

          field: 'PONumber',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'BBSNo',

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

          //controlName: 'Total_Tonnage',

          displayName: 'Total Tonnage',

          colName: 'Total_Tonnage',

          field: 'Total_Tonnage',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'IntRemark',

          displayName: 'Internal Remark',

          colName: 'IntRemark',

          field: 'IntRemark',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'PODate',

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

          //controlName: 'ReqDateFr',

          displayName: 'Req Date',

          colName: 'ReqDateFr',

          field: 'ReqDateFr',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ReqDateTo',

          displayName: 'Req Rev Date',

          colName: 'ReqDateTo',

          field: 'ReqDateTo',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ConfirmedDate',

          displayName: 'Confirmed Date',

          colName: 'ConfirmedDate',

          field: 'ConfirmedDate',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'WBS1',

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

          //controlName: 'WBS2',

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

          //controlName: 'WBS2',

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

          //controlName: 'LP_No_of_Pieces',

          displayName: 'LP No of Pieces',

          colName: 'LP_No_of_Pieces',

          field: 'LP_No_of_Pieces',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'WT_DATE',

          displayName: 'WT DATE',

          colName: 'WT_DATE',

          field: 'WT_DATE',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'DELIVERY_STATUS',

          displayName: 'DELIVERY STATUS',

          colName: 'DELIVERY_STATUS',

          field: 'DELIVERY_STATUS',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ProductType',

          displayName: 'Product Type',

          colName: 'ProductType',

          field: 'ProductType',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'STELEMENTTYPE',

          displayName: 'Structure Element',

          colName: 'STELEMENTTYPE',

          field: 'STELEMENTTYPE',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ContractNo',

          displayName: 'Contract No',

          colName: 'ContractNo',

          field: 'ContractNo',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'Customer',

          displayName: 'Customer',

          colName: 'Customer',

          field: 'Customer',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'Project',

          displayName: 'Project',

          colName: 'Project',

          field: 'Project',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ExtRemark',

          displayName: 'External Remark',

          colName: 'ExtRemark',

          field: 'ExtRemark',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ProjCoord',

          displayName: 'Project Coordinator',

          colName: 'ProjCoord',

          field: 'ProjCoord',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },

        {
          width: '80',

          //controlName: 'USERID',

          displayName: 'USER ID',

          colName: 'USERID',

          field: 'USERID',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'SOR_STATUS',

          displayName: 'SOR STATUS',

          colName: 'SOR_STATUS',

          field: 'SOR_STATUS',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'GroupID',

          displayName: 'Group Id',

          colName: 'GroupID',

          field: 'GroupID',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'OnHold',

          displayName: 'On Hold',

          colName: 'OnHold',

          field: 'OnHold',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'UrgentOrder',

          displayName: 'Urgent Order',

          colName: 'UrgentOrder',

          field: 'UrgentOrder',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'PremiumService',

          displayName: 'Premium Service',

          colName: 'PremiumService',

          field: 'PremiumService',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'CraneBooked',

          displayName: 'Crane Booked',

          colName: 'CraneBooked',

          field: 'CraneBooked',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'BargeBooked',

          displayName: 'Barge Booked',

          colName: 'BargeBooked',

          field: 'BargeBooked',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'PoliceEscort',

          displayName: 'Police Escort',

          colName: 'PoliceEscort',

          field: 'PoliceEscort',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ZeroTolerance',

          displayName: 'Zero Tolerance',

          colName: 'ZeroTolerance',

          field: 'ZeroTolerance',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'CallBefDelivery',

          displayName: 'Call Bef Delivery',

          colName: 'CallBefDelivery',

          field: 'CallBefDelivery',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
        {
          width: '80',

          //controlName: 'ConquasOrder',

          displayName: 'Conquas Order',

          colName: 'ConquasOrder',

          field: 'ConquasOrder',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },

        {
          width: '80',

          //controlName: 'SpecialPass',

          displayName: 'Speical Pass',

          colName: 'SpecialPass',

          field: 'SpecialPass',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },

        {
          width: '80',

          //controlName: 'DoNotMix',

          displayName: 'Do Not Mix',

          colName: 'DoNotMix',

          field: 'DoNotMix',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },

        {
          width: '80',

          //controlName: 'LorryCrane',

          displayName: 'Lorry Crane',

          colName: 'LorryCrane',

          field: 'LorryCrane',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },

        {
          width: '80',

          //controlName: 'LowBedVehicleAllowed',

          displayName: 'Low Bed Vehicle Allowed',

          colName: 'LowBedVehicleAllowed',

          field: 'LowBedVehicleAllowed',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },

        {
          width: '80',

          //controlName: 'FiftyTonVehicleAllowed',

          displayName: '50 Ton Vehicle Allowed',

          colName: 'FiftyTonVehicleAllowed',

          field: 'FiftyTonVehicleAllowed',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },

        {
          width: '80',

          //controlName: 'UnitMode',

          displayName: 'Unit Mode',

          colName: 'UnitMode',

          field: 'UnitMode',

          isVisible: true,

          resizeWidth: '0',

          left: '0',

          cellSelected: false,
        },
      ];
    }
  }
  dateChanged(event: any, inputName: any) {
    let startDate = moment(event.startDate.toDate()).format('DD/MM/YYYY');
    let endDate = moment(event.endDate.toDate()).format('DD/MM/YYYY');

    if (inputName == 'Rev_required_Conf_date') {
      this.amendmentForm
        .get('Rev_required_Conf_date_from')
        ?.setValue(startDate);
      this.amendmentForm.get('Rev_required_Conf_date_to')?.setValue(endDate);
    } else if (inputName == 'SOR_No') {
      this.amendmentForm.get('SOR_No_from')?.setValue(startDate);
      this.amendmentForm.get('SOR_No_to')?.setValue(endDate);
    } else {
      this.amendmentForm.get('required_date_from')?.setValue(startDate);
      this.amendmentForm.get('required_date_to')?.setValue(endDate);
    }
  }

  private getNextSaturday() {
    const dayINeed = 6; // for Saturday
    const today = moment().isoWeekday();
    if (today <= dayINeed) {
      return moment().isoWeekday(dayINeed);
    } else {
      return moment().add(1, 'weeks').isoWeekday(dayINeed);
    }
  }

  private getNextSunday() {
    const dayINeed = 7; // for Sunday
    const today = moment().isoWeekday();
    if (today <= dayINeed) {
      return moment().isoWeekday(dayINeed);
    } else {
      return moment().add(1, 'weeks').isoWeekday(dayINeed);
    }
  }

  getPageData() {
    //this.Loaddata();

    this.ordersForAmendmentList = this.ordersForAmendmentList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }
  setDateFormat(date: any): string {
    date = this.datePipe.transform(date, 'YYYY/MM/dd');
    if (date) {
      return date;
    } else {
      return '';
    }
  }

  get_RetriveData() {
    if (this.showError() || this.showErrorSearchby()) {
      return;
    }
    //this.OrderdetailsLoading = true;
    this.AmendmentLoading = true;

    let obj: OrdersForAmendment = {
      CustomerCode: this.amendmentForm.controls.customer.value
        ? this.amendmentForm.controls.customer.value
        : '',
      //CustomerCode:this.processsharedserviceService.ProcessCustomer,
      ProjectCode: this.amendmentForm.controls.project.value
        ? this.amendmentForm.controls.project.value
        : '',
      //ProjectCode:this.processsharedserviceService.ProcessProject,

      RDateFrom: this.setDateFormat(
        this.amendmentForm.controls.required_date_from.value
      ),
      RDateTo: this.setDateFormat(
        this.amendmentForm.controls.required_date_to.value
      ),
      SORNofrom: this.setDateFormat(
        this.amendmentForm.controls.SOR_No_from.value
      ),
      SORNoTo: this.setDateFormat(this.amendmentForm.controls.SOR_No_to.value),
      WBS1: this.amendmentForm.controls.txtWBS1.value,
      WBS2: this.amendmentForm.controls.txtWBS2.value,
      WBS3: this.amendmentForm.controls.txtWBS3.value,
      SearchOptions: this.amendmentForm.controls.SearchOptions.value
        ? this.amendmentForm.controls.SearchOptions.value
        : '0',
      txtSearch: this.amendmentForm.controls.txtSearch.value,
      SO_SOR_Search_Range:
        this.amendmentForm.controls.SO_SOR_Search_Range.value,
      Req_PO_Date_Search_Range:
        this.amendmentForm.controls.Req_PO_Date_Search_Range.value == ''
          ? '0'
          : this.amendmentForm.controls.Req_PO_Date_Search_Range.value,
      Rev_required_Conf_date_from:
        this.amendmentForm.controls.Rev_required_Conf_date_from.value == ''
          ? ''
          : this.setDateFormat(
              this.amendmentForm.controls.Rev_required_Conf_date_from.value
            ),
      Rev_required_Conf_date_to:
        this.amendmentForm.controls.Rev_required_Conf_date_to.value == ''
          ? ''
          : this.setDateFormat(
              this.amendmentForm.controls.Rev_required_Conf_date_to.value
            ),
      Rev_Req_Confirmed_Date_Search_Range:
        this.amendmentForm.controls.Rev_Req_Confirmed_Date_Search_Range.value ==
        ''
          ? '0'
          : this.setDateFormat(
              this.amendmentForm.controls.Rev_Req_Confirmed_Date_Search_Range
                .value
            ),
      SearchProducts:
        this.amendmentForm.controls.SearchProducts.value == ''
          ? '0'
          : this.amendmentForm.controls.SearchProducts.value,
      SearchOptionsByDesignation:
        this.amendmentForm.controls.SearchOptionsByDesignation.value == ''
          ? '0'
          : this.amendmentForm.controls.SearchOptionsByDesignation.value,
      lSearchByDesignation:
        this.amendmentForm.controls.ddlDesignation.value == ''
          ? ''
          : this.amendmentForm.controls.ddlDesignation.value,
    };
    let RDateFrom =
      this.amendmentForm.controls.required_date_from.value == ''
        ? 'null'
        : this.amendmentForm.controls.required_date_from.value;
    let RDateTo =
      this.amendmentForm.controls.required_date_to.value == ''
        ? 'null'
        : this.amendmentForm.controls.required_date_to.value;
    let Rev_required_Conf_date_from =
      this.amendmentForm.controls.Rev_required_Conf_date_from.value == ''
        ? 'null'
        : this.amendmentForm.controls.Rev_required_Conf_date_from.value;
    let Rev_required_Conf_date_to =
      this.amendmentForm.controls.Rev_required_Conf_date_to.value == ''
        ? 'null'
        : this.amendmentForm.controls.Rev_required_Conf_date_to.value;
    let Rev_Req_Confirmed_Date_Search_Range =
      this.amendmentForm.controls.Rev_Req_Confirmed_Date_Search_Range.value ==
      ''
        ? 'null'
        : this.amendmentForm.controls.Rev_Req_Confirmed_Date_Search_Range.value;
    console.log('obj', obj);
    this.orderService
      .RetriveData(
        obj,
        'null',
        'null',
        'null',
        'null',
        Rev_Req_Confirmed_Date_Search_Range
      )
      .subscribe({
        next: (response) => {
          this.ordersForAmendmentList = response;
          if (response.length == 0) {
            alert('No Record Founds');
          }
          console.log('ordersForAmendmentList', response);

          let tot_tonnage = 0;
          for (let i = 0; i < response.length; i++) {
            if (
              response[i].Total_Tonnage != null &&
              response[i].Total_Tonnage != ''
            ) {
              tot_tonnage = tot_tonnage + parseFloat(response[i].Total_Tonnage);
            }
            if (response[i].STATUS == 'X') {
            }
          }

          this.TotalTonnage = tot_tonnage.toFixed(3);
          this.ordersForAmendmentList_backup = JSON.parse(
            JSON.stringify(this.ordersForAmendmentList)
          );
        },
        error: (e) => {},
        complete: () => {
          this.AmendmentLoading = false;

          // this.loading = false;
        },
      });
  }

  get_DesignationData() {
    this.DesignationType = Number(
      this.amendmentForm.controls.SearchOptionsByDesignation.value
    );
    this.ordersDesignationDataList = [];
    this.amendmentForm.controls.ddlDesignation.reset();

    if (this.DesignationType == 0) {
      return;
    }
    this.ProcessOrderLoading = true;
    this.orderService.GetDesignationList(this.DesignationType).subscribe({
      next: (response) => {
        this.ordersDesignationDataList = response;

        console.log('get_DesignationData', response);
        this.ProcessOrderLoading = false;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  Get_AmendmentCustomer() {
    this.ProcessOrderLoading = true;

    this.orderService.GetAmendmentCustandProj().subscribe({
      next: (response) => {
        this.ordersAmendmentDataList = response[0].lCustomerSelection;
        this.FilteredCustomerList = [...response[0].lCustomerSelection];

        //CALL THE GET METHOD FOR PROJECT LIST

        console.log('Get_AmendmentCustomer', response);
        this.ProcessOrderLoading = false;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  Get_AmendmentProject() {
    this.ProcessOrderLoading = true;
    let CustomerCode = this.amendmentForm.controls.customer.value;

    this.orderService.GetAmendmentProjects(CustomerCode).subscribe({
      next: (response) => {
        this.ordersAmendmentProjectList = response;

        console.log(
          'ordersAmendmentProjectList',
          this.ordersAmendmentProjectList
        );
        this.ProcessOrderLoading = false;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  async Final_save() {
    // var lRows = gridPONoList.getSelectedRows();
    if (this.selectedRow.length > 0) {
      //if (this.ChangeRequiredDate == false && document.getElementById("Chk_Change_Conf_Del_Dates").checked == false
      //    && document.getElementById("Chk_Change_Proj_Casting_Dates").checked == false && this.ChangeIndicators == false)

      if (this.ChangeRequiredDate == false && this.ChangeIndicators == false) {
        alert('Please select fields for amendment of selected order(s).');
        return;
      } else {
        var amend_cnt = 0;
        if (this.ChangeRequiredDate) {
          amend_cnt = amend_cnt + 1;
        }
        //if (document.getElementById("Chk_Change_Conf_Del_Dates").checked) {
        //    amend_cnt = amend_cnt + 1;
        //}
        //if (document.getElementById("Chk_Change_Proj_Casting_Dates").checked) {
        //    amend_cnt = amend_cnt + 1;
        //}
        if (this.ChangeIndicators) {
          amend_cnt = amend_cnt + 1;
        }
        if (amend_cnt <= 1) {
          if (this.ChangeRequiredDate) {
            const res = await this.save_Req_Dates(amend_cnt);
            if (res) {
              alert(res.Message);
              this.updateData('ReqDate');
            }
            //CALL POST FUNCTION
          }
          //if (document.getElementById("Chk_Change_Conf_Del_Dates").checked) {
          //    save_Conf_Del_Date(amend_cnt, null);
          //}
          //if (document.getElementById("Chk_Change_Proj_Casting_Dates").checked) {
          //    save_Proj_Casting_Date(amend_cnt, null);
          //}
          if (this.ChangeIndicators) {
            //CALL POST FUNCTION
            const res = await this.save_Indicators(amend_cnt);
            if (res) {
              alert(res.Message);
              this.updateData('Indicators');
            }
          }
          //Final_Cancel();
        } else {
          var val_all = 0;
          val_all = this.validate_all();
          if (val_all == 0) {
            var final_msg = 'Order(s) Amended Successfully.';
            if (val_all == 0) {
              if (this.ChangeRequiredDate) {
                //CALL POST FUNCTION
                var res1 = await this.save_Req_Dates(amend_cnt);
                console.log('res1 =>', res1);
                final_msg.concat(res1);
                this.updateData('ReqDate');
              }
              //if (document.getElementById("Chk_Change_Conf_Del_Dates").checked) {
              //    var res2 = save_Conf_Del_Date(amend_cnt);
              //    final_msg.concat(res2);
              //}
              //if (document.getElementById("Chk_Change_Proj_Casting_Dates").checked) {
              //    var res3 = save_Proj_Casting_Date(amend_cnt);
              //    final_msg.concat(res3);
              //}
              if (this.ChangeIndicators) {
                //CALL POST FUNCTION
                var res4 = await this.save_Indicators(amend_cnt);
                final_msg.concat(res4);
                this.updateData('Indicators');
              }

              //this.OrderStatus();//RELOAD THE TABLE
              alert(final_msg);
            }
            //Final_Cancel();
          } else {
            alert('Fields marked with * are mandatory. ');
          }
        }
      }
    } else {
      alert('No order(s) selected for amendment.');
      return;
    }

    //this.get_RetriveData();
    this.ReqDateForm.reset();
    this.ChangeIndicatorsForm.reset();
    this.amendmentForm.reset();
  }
  updateData(lUpdateValue: string) {
    if (lUpdateValue == 'ReqDate') {
      let required_date_from = this.datePipe.transform(
        this.ReqDateForm.controls.reqDateFrom.value,
        'YYYY/MM/dd'
      );
      let required_date_to = this.datePipe.transform(
        this.ReqDateForm.controls.revisedReqdate.value,
        'YYYY/MM/dd'
      );
      for (let i = 0; i < this.selectedRow.length; i++) {
        this.selectedRow[i].ReqDateFr = required_date_from;
        this.selectedRow[i].ReqDateTo = required_date_to;
      }
    } else if (lUpdateValue == 'Indicators') {
      let obj = {
        Chk_Order_OnHold: this.ChangeIndicatorsForm.controls.OrderOnHold.value,
        txtReason_Change_Order_OnHold:
          this.ChangeIndicatorsForm.controls.ChangeIndicatorReason.value,
        Chk_Lorry_Crane: this.ChangeIndicatorsForm.controls.LorryCrane.value,
        Chk_Do_Not_Mix: this.ChangeIndicatorsForm.controls.DoNotMix.value,
        Chk_Call_Before_Delivery:
          this.ChangeIndicatorsForm.controls.CallBeforeDelivery.value,
        Chk_Special_Pass: this.ChangeIndicatorsForm.controls.SpecialPass.value,
        Chk_Barge_Booked: this.ChangeIndicatorsForm.controls.BargeBooked.value,
        Chk_Crane_Booked_Onsite:
          this.ChangeIndicatorsForm.controls.CraneBookedOnsite.value,
        Chk_Police_Escort_Service:
          this.ChangeIndicatorsForm.controls.PoliceEscortService.value,
        Chk_Premium_Service:
          this.ChangeIndicatorsForm.controls.PremiumService.value,
        Chk_Urgent_Order: this.ChangeIndicatorsForm.controls.UrgentOrder.value,
        Chk_Conquas_Order:
          this.ChangeIndicatorsForm.controls.SpeciaConquasOrderlPass.value,
        Chk_Zero_Tolerance:
          this.ChangeIndicatorsForm.controls.ZeroTolerance.value,
        Chk_Low_Bed_Vehicle_Allowed:
          this.ChangeIndicatorsForm.controls.LowBedVehicleAllowed.value,
        Chk_50_Ton_Vehicle_Allowed:
          this.ChangeIndicatorsForm.controls.FiftyTonVehicleAllowed.value,
        Chk_Unit_Mode: this.ChangeIndicatorsForm.controls.UnitMode.value,
      };
      for (let i = 0; i < this.selectedRow.length; i++) {
        let item = this.selectedRow[i];

        item.OnHold = obj.Chk_Order_OnHold ? 'Y' : 'N';
        item.UrgentOrder = obj.Chk_Urgent_Order ? 'Y' : 'N';
        item.LorryCrane = obj.Chk_Lorry_Crane ? 'Y' : 'N';
        item.DoNotMix = obj.Chk_Do_Not_Mix ? 'Y' : 'N';
        item.CallBefDelivery = obj.Chk_Call_Before_Delivery ? 'Y' : 'N';
        item.SpecialPass = obj.Chk_Special_Pass ? 'Y' : 'N';
        item.BargeBooked = obj.Chk_Barge_Booked ? 'Y' : 'N';
        item.CraneBooked = obj.Chk_Crane_Booked_Onsite ? 'Y' : 'N';
        item.PoliceEscort = obj.Chk_Police_Escort_Service ? 'Y' : 'N';
        item.PremiumService = obj.Chk_Premium_Service ? 'Y' : 'N';
        item.ConquasOrder = obj.Chk_Conquas_Order ? 'Y' : 'N';
        item.ZeroTolerance = obj.Chk_Zero_Tolerance ? 'Y' : 'N';
        item.LowBedVehicleAllowed = obj.Chk_Low_Bed_Vehicle_Allowed ? 'Y' : 'N';
        item.FiftyTonVehicleAllowed = obj.Chk_50_Ton_Vehicle_Allowed
          ? 'Y'
          : 'N';
        item.UnitMode = obj.Chk_Unit_Mode ? 'Y' : 'N';
      }
    }
  }

  validate_all() {
    var res = 0;
    if (this.ChangeRequiredDate) {
      var lrequired_date_from_Change =
        this.ReqDateForm.controls.reqDateFrom.value;
      var lrequired_date_to_Change =
        this.ReqDateForm.controls.revisedReqdate.value;
      var ltxtReason_Change_Req_date = this.ReqDateForm.controls.reason.value;
      if (
        (lrequired_date_from_Change == null ||
          lrequired_date_from_Change == '') &&
        (lrequired_date_to_Change == null || lrequired_date_to_Change == '')
      ) {
        res = res + 1;
      }
      if (
        ltxtReason_Change_Req_date == null ||
        ltxtReason_Change_Req_date == '0' ||
        ltxtReason_Change_Req_date == ''
      ) {
        res = res + 1;
      }
    }
    if (this.ChangeIndicators) {
      var lChk_Order_OnHold =
        this.ChangeIndicatorsForm.controls.OrderOnHold.value;
      var ltxtReason_Change_Order_OnHold =
        this.ChangeIndicatorsForm.controls.ChangeIndicatorReason.value;
      if (lChk_Order_OnHold == true) {
        if (
          ltxtReason_Change_Order_OnHold == null ||
          ltxtReason_Change_Order_OnHold == '' ||
          ltxtReason_Change_Order_OnHold == '0'
        ) {
          res = res + 1;
        }
      }
    }
    return res;
  }
  // obj: AmendmentRequiredDate
  async save_Req_Dates(amend_cnt: any): Promise<any> {
    try {
      let obj: AmendmentRequiredDate = {
        required_date_from: this.datePipe.transform(
          this.ReqDateForm.controls.reqDateFrom.value,
          'YYYY/MM/dd'
        )
          ? this.datePipe.transform(
              this.ReqDateForm.controls.reqDateFrom.value,
              'YYYY/MM/dd'
            )
          : '',
        required_date_to: this.datePipe.transform(
          this.ReqDateForm.controls.revisedReqdate.value,
          'YYYY/MM/dd'
        )
          ? this.datePipe.transform(
              this.ReqDateForm.controls.revisedReqdate.value,
              'YYYY/MM/dd'
            )
          : '',
        Reason_Change_Req_date: this.ReqDateForm.controls.reason.value
          ? this.ReqDateForm.controls.reason.value
          : '',
        SORNumbers_to_amend: this.GetSORNumber(), //TO BE DEFINED
      };

      if (!obj.required_date_from && !obj.required_date_to) {
        alert('Please select either Required Date or Revised Required Date');
        return;
      } else if (
        (!obj.required_date_from || !obj.required_date_to) &&
        !obj.Reason_Change_Req_date
      ) {
        alert('Required Date changed. Please select reason of change!');
        return;
      }
      const data = await this.orderService
        .AmendmentRequiredDates(obj)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  // obj: AmendmentIndicators
  async save_Indicators(amend_cnt: any): Promise<any> {
    try {
      let obj: AmendmentIndicators = {
        Chk_Order_OnHold: this.ChangeIndicatorsForm.controls.OrderOnHold.value,
        txtReason_Change_Order_OnHold:
          this.ChangeIndicatorsForm.controls.ChangeIndicatorReason.value,
        Chk_Lorry_Crane: this.ChangeIndicatorsForm.controls.LorryCrane.value,
        Chk_Do_Not_Mix: this.ChangeIndicatorsForm.controls.DoNotMix.value,
        Chk_Call_Before_Delivery:
          this.ChangeIndicatorsForm.controls.CallBeforeDelivery.value,
        Chk_Special_Pass: this.ChangeIndicatorsForm.controls.SpecialPass.value,
        Chk_Barge_Booked: this.ChangeIndicatorsForm.controls.BargeBooked.value,
        Chk_Crane_Booked_Onsite:
          this.ChangeIndicatorsForm.controls.CraneBookedOnsite.value,
        Chk_Police_Escort_Service:
          this.ChangeIndicatorsForm.controls.PoliceEscortService.value,
        Chk_Premium_Service:
          this.ChangeIndicatorsForm.controls.PremiumService.value,
        Chk_Urgent_Order: this.ChangeIndicatorsForm.controls.UrgentOrder.value,
        Chk_Conquas_Order:
          this.ChangeIndicatorsForm.controls.SpeciaConquasOrderlPass.value,
        Chk_Zero_Tolerance:
          this.ChangeIndicatorsForm.controls.ZeroTolerance.value,
        Chk_Low_Bed_Vehicle_Allowed:
          this.ChangeIndicatorsForm.controls.LowBedVehicleAllowed.value,
        Chk_50_Ton_Vehicle_Allowed:
          this.ChangeIndicatorsForm.controls.FiftyTonVehicleAllowed.value,
        Chk_Unit_Mode: this.ChangeIndicatorsForm.controls.UnitMode.value,
        SORNumbers_to_amend: this.GetSORNumber(), //TO BE DEFINED
      };

      if (obj.Chk_Order_OnHold == true) {
        if (!obj.txtReason_Change_Order_OnHold) {
          alert('* marked feilds are mandatory');
          return;
        }
      }
      const data = await this.orderService.AmendmentIndicators(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  Final_Cancel() {
    this.ChangeRequiredDate = false;
    this.ChangeIndicators = false;

    this.ReqDateForm.reset();
    this.ChangeIndicatorsForm.reset();
  }

  GetSORNumber() {
    let result: any = [];
    this.selectedRow.forEach((element) => {
      result.push(element.SORNo);
    });
    return result.join(',');
  }

  showError() {
    if (
      this.amendmentForm.controls.required_date_from.value ||
      this.amendmentForm.controls.required_date_to.value
    ) {
      if (
        this.amendmentForm.controls.Req_PO_Date_Search_Range.value == '' ||
        this.amendmentForm.controls.Req_PO_Date_Search_Range.value == 0
      ) {
        return true;
      }
    }
    return false;
  }

  showErrorSearchby() {
    if (this.amendmentForm.controls.txtSearch.value) {
      if (
        this.amendmentForm.controls.SearchOptions.value == '' ||
        this.amendmentForm.controls.SearchOptions.value == 0
      ) {
        return true;
      }
    }
    return false;
  }

  getwidth(id: string) {
    if (id == 'SORNo') {
      const divElement: HTMLElement | null = document.getElementById('SrNo');
      // console.log('Heading width', divElement!.clientWidth);
      return divElement!.clientWidth.toString();
    } else if (id == 'SONo') {
      const divElement1: HTMLElement | null = document.getElementById('SrNo');
      const divElement2: HTMLElement | null = document.getElementById('SORNo');

      let totalWidth = divElement1!.clientWidth + divElement2!.clientWidth;
      return totalWidth;
    } else if (id == 'PO') {
      const divElement1: HTMLElement | null = document.getElementById('SrNo');
      const divElement2: HTMLElement | null = document.getElementById('SORNo');
      const divElement3: HTMLElement | null = document.getElementById('SONo');

      let totalWidth =
        divElement1!.clientWidth +
        divElement2!.clientWidth +
        divElement3!.clientWidth;
      return totalWidth;
    } else if (id == 'BBSNo') {
      const divElement1: HTMLElement | null = document.getElementById('SrNo');
      const divElement2: HTMLElement | null = document.getElementById('SORNo');
      const divElement3: HTMLElement | null = document.getElementById('SONo');
      const divElement4: HTMLElement | null = document.getElementById('PO');

      let totalWidth =
        divElement1!.clientWidth +
        divElement2!.clientWidth +
        divElement3!.clientWidth +
        divElement4!.clientWidth;
      return totalWidth;
    }
    return 0;
  }

  downloadFile() {
    let listTodownload = [];
    for (let i = 0; i < this.ordersForAmendmentList.length; i++) {
      let obj = {
        SrNo: this.ordersForAmendmentList[i].SrNo,
        SORNo: this.ordersForAmendmentList[i].SORNo,
        SONo: this.ordersForAmendmentList[i].SONo,
        PONumber: this.ordersForAmendmentList[i].PONumber,
        BBSNo: this.ordersForAmendmentList[i].BBSNo,
        Total_Tonnage: this.ordersForAmendmentList[i].Total_Tonnage,
        IntRemark: this.ordersForAmendmentList[i].IntRemark,
        PODate: this.ordersForAmendmentList[i].PODate,
        ReqDateFr: this.ordersForAmendmentList[i].ReqDateFr,
        ReqDateTo: this.ordersForAmendmentList[i].ReqDateTo,
        ConfirmedDate: this.ordersForAmendmentList[i].ConfirmedDate, //temp. it should be details column
        WBS1: this.ordersForAmendmentList[i].WBS1,
        WBS2: this.ordersForAmendmentList[i].WBS2,
        WBS3: this.ordersForAmendmentList[i].WBS3,
        LP_No_of_Pieces: this.ordersForAmendmentList[i].LP_No_of_Pieces,
        WT_DATE: this.ordersForAmendmentList[i].WT_DATE,
        DELIVERY_STATUS: this.ordersForAmendmentList[i].DELIVERY_STATUS,
        ProductType: this.ordersForAmendmentList[i].ProductType,
        STELEMENTTYPE: this.ordersForAmendmentList[i].STELEMENTTYPE,
        ContractNo: this.ordersForAmendmentList[i].ContractNo,
        Customer: this.ordersForAmendmentList[i].Customer,
        Project: this.ordersForAmendmentList[i].Project,
        ExtRemark: this.ordersForAmendmentList[i].ExtRemark,
        ProjCoord: this.ordersForAmendmentList[i].ProjCoord,
        USERID: this.ordersForAmendmentList[i].USERID,
        SOR_STATUS: this.ordersForAmendmentList[i].SOR_STATUS,
        GroupID: this.ordersForAmendmentList[i].GroupID,
        OnHold: this.ordersForAmendmentList[i].OnHold,
        UrgentOrder: this.ordersForAmendmentList[i].UrgentOrder,
        PremiumService: this.ordersForAmendmentList[i].PremiumService,
        CraneBooked: this.ordersForAmendmentList[i].CraneBooked,
        BargeBooked: this.ordersForAmendmentList[i].BargeBooked,
        PoliceEscort: this.ordersForAmendmentList[i].PoliceEscort,
        ZeroTolerance: this.ordersForAmendmentList[i].ZeroTolerance,
        CallBefDelivery: this.ordersForAmendmentList[i].CallBefDelivery,
        ConquasOrder: this.ordersForAmendmentList[i].ConquasOrder,
        SpecialPass: this.ordersForAmendmentList[i].SpecialPass,
        DoNotMix: this.ordersForAmendmentList[i].DoNotMix,
        LorryCrane: this.ordersForAmendmentList[i].LorryCrane,
        LowBedVehicleAllowed:
          this.ordersForAmendmentList[i].LowBedVehicleAllowed,
        FiftyTonVehicleAllowed:
          this.ordersForAmendmentList[i].FiftyTonVehicleAllowed,
        UnitMode: this.ordersForAmendmentList[i].UnitMode,
      };
      listTodownload.push(obj);
    }
    // listTodownload = this.DraftedOrderArray;
    this.name = 'OrderAmendmentList';
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

  OnDateSearchBy() {
    this.amendmentForm.controls.required_date_from.reset();
    this.amendmentForm.controls.required_date_to.reset();
  }

  OnSORChange() {
    this.amendmentForm.controls.SOR_No_from.reset();
    this.amendmentForm.controls.SOR_No_to.reset();
  }

  RevConfirmedChange() {
    this.amendmentForm.controls.Rev_required_Conf_date_from.reset();
    this.amendmentForm.controls.Rev_required_Conf_date_to.reset();
  }

  PONumberChange() {
    this.amendmentForm.controls.txtSearch.reset();
  }

  selectRow(row: any, event: MouseEvent) {
    console.log('here', row);
    this.lastSelctedRow = row;

    if (event.ctrlKey) {
      // Handle multiselect with Ctrl key
      if (this.selectedRow.length == 0) {
        this.lastSelctedRow = row;
        // Run as a normal click
      } else {
        // console.log('Multi Select Started');
        if (row.isSelected) {
          // Remove from this.selectedRow
          let tIndex = this.selectedRow.findIndex((x) => x == row);
          this.selectedRow.splice(tIndex, 1);
          row.isSelected = false;
        } else {
          row.isSelected = true;
          this.selectedRow.push(row);
          this.lastSelctedRow = row;
        }
        return;
      }
    } else if (event.shiftKey) {
      let dataList = this.ordersForAmendmentList;
      // Handle multiselect with Shift key.
      if (this.selectedRow.length == 0) {
        // Run as a normal click.
      } else {
        // console.log('Multi Select Started');
        let lIndex = 0;

        // Get the index of the last selected row in the list.
        for (let i = 0; i < dataList.length; i++) {
          lIndex = dataList[i].isSelected == true ? i : lIndex;
        }

        // The index of the currently selected row in the list.
        let nIndex = dataList.findIndex((x) => x == row);

        if (nIndex > lIndex) {
          // Add all the rows between the two indexes.
          for (let i = lIndex + 1; i < nIndex + 1; i++) {
            dataList[i].isSelected = true;
            this.selectedRow.push(dataList[i]);
          }
        } else {
          if (row.isSelected) {
            // Remove from this.selectedRow
            let tIndex = this.selectedRow.findIndex((x) => x == row);
            this.selectedRow.splice(tIndex, 1);
            row.isSelected = false;
          } else {
            row.isSelected = true;
            this.selectedRow.push(row);
          }
        }
        console.log('selectedRow', this.selectedRow);
        return;
      }
    } else {
      this.selectedRow = [];
      this.ordersForAmendmentList.forEach((element) => {
        element.isSelected = false;
      });
      row.isSelected = true;
      this.selectedRow[0] = row;
    }
  }

  lastSelctedRow: any = undefined;
  lastButtonPresses: any = '';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check if Shift + Down Arrow is pressed
    if (event.key === 'ArrowDown') {
      // Call your custom function herethis.onShiftDown();
      // console.log('button pressed');
      // Define the list based on the current Tab
      event.preventDefault();
      let ldataList: any[] = this.ordersForAmendmentList;
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
      if (event.shiftKey && event.key === 'ArrowDown') {
        // console.log('Multi Select Started');
        if (row.isSelected) {
          // Remove from this.selectedRow
          let tIndex = this.selectedRow.findIndex((x) => x == row);
          this.selectedRow.splice(tIndex, 1);
          row.isSelected = false;
        } else {
          row.isSelected = true;
          this.selectedRow.push(row);
        }
        this.scrollToSelectedRow(ldataList, this.viewPort);
        return;
      }
      this.selectedRow.forEach((x) => (x.isSelected = false));
      this.selectedRow = [];
      row.isSelected = true;
      this.selectedRow.push(row);
      this.scrollToSelectedRow(ldataList, this.viewPort);
      return;
    } else if (event.key === 'ArrowUp') {
      // console.log('button pressed');
      // Define the list based on the current Tab
      event.preventDefault();
      let ldataList: any[] = this.ordersForAmendmentList;
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
        // this.scrollToSelectedRow(ldataList,this.viewPort);
        this.scrollToSelectedRowUp(lIndex, this.viewPort);
        return;
      }
      this.selectedRow.forEach((x) => (x.isSelected = false));
      this.selectedRow = [];
      row.isSelected = true;
      this.selectedRow.push(row);
      // this.scrollToSelectedRow(ldataList,this.viewPort);
      this.scrollToSelectedRowUp(lIndex, this.viewPort);
      return;
    }
  }
  toggleSortingOrder(columnname: string) {
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    this.ordersForAmendmentList.sort((a, b) => {
      const valueA = a[columnname];
      const valueB = b[columnname];

      // Determine if the values are numbers
      const isNumberA = !isNaN(valueA);
      const isNumberB = !isNaN(valueB);

      let comparisonResult;

      if (isNumberA && isNumberB) {
        // Compare numerically
        comparisonResult = Number(valueA) - Number(valueB);
      } else {
        // Compare as strings
        comparisonResult = valueA.toString().localeCompare(valueB.toString());
      }

      // Apply ascending or descending order
      return this.isAscending ? comparisonResult : -comparisonResult;
    });
    this.ordersForAmendmentList = [...this.ordersForAmendmentList];
    this.viewPort?.scrollToIndex(0);
  }
  ngAfterViewInit() {
    // PENDING-ENT
    console.log('scrollViewportProcessing', this.viewPort);
  }
  getRightWidthTest(element: HTMLElement, j: number, arrayName: string) {
    let width = this.getAllPreviousSiblings(element);
    // console.log('previousSibling=>', j);
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
    this.columns[index]['left'] = width;
  }
  onWidthChange(obj: any) {
    this.columns[obj.index].resizeWidth = obj.width;
    this.columns[obj.index].width = obj.width;
    this.isResizable = true;
  }
  getLeftOfTable(index: number) {
    return this.columns[index]['left'] + 'px';
  }
  checkHiddenColumn(index: any, dataList: any) {
    let data = dataList.filter((obj: { isVisible: any }) => obj.isVisible);
    data = data[index];
    let indexes = dataList.findIndex(
      (objs: { colName: any }) => objs.colName === data.colName
    );
    return indexes;
  }
  dropDetCol(event: any) {
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex < this.fixedColumn &&
        event.currentIndex >= this.fixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex >= this.fixedColumn &&
        event.currentIndex < this.fixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.checkHiddenColumn(
          event.currentIndex,
          this.columns
        );
        let lpreviousIndex = this.checkHiddenColumn(
          event.previousIndex,
          this.columns
        );
        moveItemInArray(this.columns, lpreviousIndex, lcurrentIndex); //need to uncomment
      }
    } else {
      let lcurrentIndex = this.checkHiddenColumn(
        event.currentIndex,
        this.columns
      );
      let lpreviousIndex = this.checkHiddenColumn(
        event.previousIndex,
        this.columns
      );
      moveItemInArray(this.columns, lpreviousIndex, lcurrentIndex); // need to uncomment
    }
    localStorage.setItem('amendMentColumns', JSON.stringify(this.columns));
  }
  stopResize(event: any) {
    this.isResizable = false;
    localStorage.setItem('amendMentColumns', JSON.stringify(this.columns));
  }

  scrollToSelectedRow(ldataList: any, viewPort: CdkVirtualScrollViewport) {
    const selectedRowIndex = ldataList.findIndex(
      (row: any) => row === this.selectedRow[this.selectedRow.length - 1]
    );
    const lCell = document.getElementById('body-cell');
      const lCellHead = document.getElementById('table-head');
      const lCellSearch = document.getElementById('searchBar');
      let lCellHeight = 30;
      if(lCell){
        lCellHeight = lCell.offsetHeight;
      }
      let lHeadingHeight = 0;

      if(lCellHead){
        lHeadingHeight = lHeadingHeight + lCellHead.offsetHeight
      }else{
        lHeadingHeight = lHeadingHeight + 30;
      }

      if(lCellSearch){
        lHeadingHeight = lHeadingHeight + lCellSearch.offsetHeight
      }else{
        lHeadingHeight = lHeadingHeight + 30;
      }
    // const scrollOffset = viewPort.measureScrollOffset();
    let viewportSize = viewPort.getViewportSize()-lHeadingHeight;

    const nextIndex = selectedRowIndex + 1;
    const lOffset = (nextIndex * lCellHeight) - viewportSize;

    if(lOffset>0){
      viewPort.scrollToOffset(lOffset + lCellHeight, 'smooth');
    }

    // if (viewportSize == 0) {
    //   viewportSize = 575;
    // }
    // const endIndex = Math.floor((scrollOffset + viewportSize) / lCellHeight) + 2;
    // if (nextIndex >= endIndex) {
    //   let offset = scrollOffset + lCellHeight;
    //   viewPort.scrollToOffset(offset, 'auto');
    // }
  }
  scrollToSelectedRowUp(index: number, viewPort: CdkVirtualScrollViewport) {
    if (viewPort) {
      const lCell = document.getElementById('body-cell');
      const lCellHead = document.getElementById('table-head');
      const lCellSearch = document.getElementById('searchBar');
      let lCellHeight = 30;
      let lHeadingHeight = 0;

      if(lCellHead){
        lHeadingHeight = lHeadingHeight + lCellHead.offsetHeight
      }else{
        lHeadingHeight = lHeadingHeight + 30;
      }

      if(lCellSearch){
        lHeadingHeight = lHeadingHeight + lCellSearch.offsetHeight
      }else{
        lHeadingHeight = lHeadingHeight + 30;
      }

      if(lCell){
        lCellHeight = lCell.offsetHeight;
      }
      const currentScrollOffset = viewPort.measureScrollOffset() - lHeadingHeight;
      const topVisibleIndex = Math.floor(currentScrollOffset / lCellHeight) + 1;
      if (index <= topVisibleIndex && topVisibleIndex != 0) {
        const newOffset = currentScrollOffset - lCellHeight; // Move down one item size
        viewPort.scrollToOffset(newOffset, 'auto');
      }
    }
  }
  public get inverseOfTranslation(): string {
    if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPort['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfTranslationSearch(): string {
    if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
      return '55px';
    }
    let offset = this.viewPort['_renderedContentOffset'] - 50;
    return `-${offset}px`;
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
    debugger;
    this.ordersForAmendmentList = JSON.parse(
      JSON.stringify(this.ordersForAmendmentList_backup)
    );
    this.ordersForAmendmentList = this.ordersForAmendmentList.filter(
      (item) =>
        this.checkFilterData(
          this.amendmentFormTable.controls.SORNo.value,
          item.SORNo
        ) &&
        // &&
        // (
        //   this.checkFilterData(
        //     this.amendmentFormTable.controls.UnitMode.value,
        //     item.UnitMode
        //   )
        // )

        this.checkFilterData(
          this.amendmentFormTable.controls.FiftyTonVehicleAllowed.value,
          item.FiftyTonVehicleAllowed
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.LowBedVehicleAllowed.value,
          item.LowBedVehicleAllowed
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.LorryCrane.value,
          item.LorryCrane
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.DoNotMix.value, //
          item.DoNotMix
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.SpecialPass.value, //
          item.SpecialPass
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ConquasOrder.value, //
          item.ConquasOrder
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.CallBefDelivery.value, //
          item.CallBefDelivery
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ZeroTolerance.value, //
          item.ZeroTolerance
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.PoliceEscort.value, //
          item.PoliceEscort
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.BargeBooked.value, //
          item.BargeBooked
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.CraneBooked.value, //
          item.CraneBooked
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.PremiumService.value, //
          item.PremiumService
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.UrgentOrder.value, //
          item.UrgentOrder
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.OnHold.value, //
          item.OnHold
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.GroupID.value, //
          item.GroupID
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.SOR_STATUS.value, //
          item.SOR_STATUS
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.USERID.value, //
          item.USERID
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ProjCoord.value, //
          item.ProjCoord
        ) &&
        // &&
        // (
        //   this.checkFilterData(
        //     this.amendmentFormTable.controls.ProjCoord.value,
        //     item.ProjCoord
        //   )
        // )

        this.checkFilterData(
          this.amendmentFormTable.controls.ExtRemark.value, //
          item.ExtRemark
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.Project.value, //
          item.Project
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.Customer.value, //
          item.Customer
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ContractNo.value, //
          item.ContractNo
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.STELEMENTTYPE.value, //
          item.STELEMENTTYPE
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ProductType.value, //
          item.ProductType
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.DELIVERY_STATUS.value, //
          item.DELIVERY_STATUS
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.WT_DATE.value, //
          item.WT_DATE
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.LP_No_of_Pieces.value, //
          item.LP_No_of_Pieces
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.WBS3.value, //
          item.WBS3
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.WBS2.value, //
          item.WBS2
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.WBS1.value, //
          item.WBS1
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ConfirmedDate.value, //
          item.ConfirmedDate
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ReqDateTo.value, //
          item.ReqDateTo
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ReqDateFr.value, //
          item.ReqDateFr
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.required_date.value, //
          item.required_date
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.required_date_from.value, //
          item.required_date_from
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.ReqDateFr.value, //
          item.ReqDateFr
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.required_date_to.value, //
          item.required_date_to
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.PODate.value, //
          item.PODate
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.IntRemark.value, //
          item.IntRemark
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.Total_Tonnage.value, //
          item.Total_Tonnage
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.BBSNo.value, //
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.PONumber.value, //
          item.PONumber
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.SONo.value, //
          item.SONo
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.SORNo.value, //
          item.SORNo
        ) &&
        this.checkFilterData(
          this.amendmentFormTable.controls.SrNo.value, //
          item.SrNo
        )
    );
  }
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
  reset() {
    this.amendmentFormTable.reset();
  }

  // Synchronize the scroll between header and body
  syncScroll(event: any) {
    // console.log('syncScroll=>', event);
    //this.tableContainer.nativeElement.scrollLeft = event.target.scrollLeft;
  }

  filterCustomerList(searchText: any): void {
    console.log('Search text entered:', searchText); // Debug
 
    if (!searchText) {
      this.FilteredCustomerList = [...this.ordersAmendmentDataList]; // Reset if empty
      return;
    }
 
    const lowerCaseSearchText = searchText.target.value.toLowerCase().trim();
 
    this.FilteredCustomerList = this.ordersAmendmentDataList.filter((customer:any) =>
      customer.Text.toLowerCase().trim().startsWith(lowerCaseSearchText)||customer.Value.toLowerCase().trim().includes(lowerCaseSearchText)
    );
 
    console.log('FilteredCustomerList:', this.FilteredCustomerList); // Debug
  }
}
