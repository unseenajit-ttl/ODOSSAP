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
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { GetSubmittedPOSearchModel } from 'src/app/Model/GetSubmittedPOSearchModel';
import { OrderService } from '../../orders.service';
import { DatePipe } from '@angular/common';
import { NgbDateFRParserFormatter } from 'src/app/SharedComponent/bootsrtap-date-range-picker-for-search/ngb-date-fr-parser-formatter';
import { LoginService } from 'src/app/services/login.service';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';

@Component({
  selector: 'app-processordersearch-po',
  templateUrl: './processordersearch-po.component.html',
  styleUrls: ['./processordersearch-po.component.css'],
  providers: [
    NgbDatepickerConfig,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
  ],
})
export class ProcessordersearchPOComponent implements OnInit {
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  AccountManagerList: any[] = [];
  DetaillingInchargeList: any[] = [];
  ProjectInchargeList: any[] = [];
  //CustomerList: any[] = [];
  ProjectCodeList: any[] = [];
  ProjectCodeAllList: any[] = [];
  AllProjects: boolean = false;
  CustomerList: Array<{ Value: string; Text: string }> = [];
  FilteredCustomerList: Array<{ Value: string; Text: string }> = [];
  SearchData: GetSubmittedPOSearchModel = {
    Category: 'SEARCH',
    OrigReqDateFrom: '',
    OrigReqDateTo: '',
    RequiredDateFrom: '',
    RequiredDateTo: '',
    PONo: [''],
    BBSNo: '',
    CustomerName: '',
    ProjectTitle: [''],
    WBS1: '',
    WBS2: '',
    WBS3: '',
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
    Forecast: false,
    VehicleType: ''
  };
  lHolidays: any;

  filteredSuggestions: any = [];
  filteredSuggestionsWBS1: any = [];
  filteredSuggestionsWBS2: any = [];
  filteredSuggestionsWBS3: any = [];
  filteredSuggestionsLoadNo: any = [];
  filteredSuggestionsInvoiceNo: any = [];
  filteredSuggestionsBBSNo: any = [];
  filteredSuggestionsSAPSalesOrderNO: any = [];
  filteredSuggestionsWeightTicketNo: any = [];
  filteredSuggestionsDONo: any = [];
  filteredSuggestionsSOR: any = [];

  currentInput: any = '';
  previousInputs: any[] = [];
  previousSuggestionsWBS1: any = [];
  previousSuggestionsWBS2: any = [];
  previousSuggestionsWBS3: any = [];
  previousSuggestionsLoadNo: any = [];
  previousSuggestionsInvoiceNo: any = [];
  previousSuggestionsBBSNo: any = [];
  previousSuggestionsSAPSalesOrderNO: any = [];
  previousSuggestionsWeightTicketNo: any = [];
  previousSuggestionsDONo: any = [];
  previousSOR: any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    public datepipe: DatePipe,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private dateFormatter: NgbDateFRParserFormatter,
    private calendar: NgbCalendar,
    private loginService: LoginService
  ) {
    this.lHolidays = this.loginService.GetHoliday();
  }

  ngOnInit(): void {
    this.GetAccountManager();
    this.GetDetailingIncharge();
    this.GetProjectIncharge();
    this.GetCustomerSelectList();
    this.setLocalData();
    if (localStorage.getItem('OrderSearchModalValue')) {
      let data: any = localStorage.getItem('OrderSearchModalValue');
      if (sessionStorage.getItem('OrderSearchModalValue')) {
        data = sessionStorage.getItem('OrderSearchModalValue');
      }
      this.SearchData = JSON.parse(data);
      this.SearchData.OrigReqDateFrom = this.ForamtDateValidator(
        this.SearchData.OrigReqDateFrom
      );
      this.SearchData.OrigReqDateTo = this.ForamtDateValidator(
        this.SearchData.OrigReqDateTo
      );
      this.SearchData.RequiredDateFrom = this.ForamtDateValidator(
        this.SearchData.RequiredDateFrom
      );
      this.SearchData.RequiredDateTo = this.ForamtDateValidator(
        this.SearchData.RequiredDateTo
      );
      this.SearchData.CDelDateFrom = this.ForamtDateValidator(
        this.SearchData.CDelDateFrom
      );
      this.SearchData.CDelDateTo = this.ForamtDateValidator(
        this.SearchData.CDelDateTo
      );
      this.SearchData.PODateFrom = this.ForamtDateValidator(
        this.SearchData.PODateFrom
      );
      this.SearchData.PODateTo = this.ForamtDateValidator(
        this.SearchData.PODateTo
      );
      if (JSON.parse(data).CustomerName) {
        this.setProjectSelectList();
      }
    }
  }
  setLocalData() {
    this.previousInputs =
      JSON.parse(localStorage.getItem('previousPOInputItems')!) ?? [];
    this.previousSuggestionsWBS1 =
      JSON.parse(localStorage.getItem('previousSuggestionsWBS1')!) ?? [];
    this.previousSuggestionsWBS2 =
      JSON.parse(localStorage.getItem('previousSuggestionsWBS2')!) ?? [];
    this.previousSuggestionsWBS3 =
      JSON.parse(localStorage.getItem('previousSuggestionsWBS3')!) ?? [];
    this.previousSuggestionsLoadNo =
      JSON.parse(localStorage.getItem('previousSuggestionsLoadNo')!) ?? [];
    this.previousSuggestionsInvoiceNo =
      JSON.parse(localStorage.getItem('previousSuggestionsInvoiceNo')!) ?? [];
    this.previousSOR = JSON.parse(localStorage.getItem('previousSOR')!) ?? [];
    this.previousSuggestionsBBSNo =
      JSON.parse(localStorage.getItem('previousSuggestionsBBSNo')!) ?? [];
    this.previousSuggestionsSAPSalesOrderNO =
      JSON.parse(localStorage.getItem('previousSuggestionsSAPSalesOrderNO')!) ??
      [];
    this.previousSuggestionsWeightTicketNo =
      JSON.parse(localStorage.getItem('previousSuggestionsWeightTicketNo')!) ??
      [];
    this.previousSuggestionsDONo =
      JSON.parse(localStorage.getItem('previousSuggestionsDONo')!) ?? [];
  }
  ForamtDateValidator(pDate: any) {
    return typeof pDate == 'string' ? this.dateFormatter.parse(pDate) : pDate;
  }

  ValidaDateValue(dateVal: any) {
    return dateVal ? this.dateFormatter.format(dateVal) : '';
  }
  Search() {
    localStorage.setItem(
      'OrderSearchModalValue',
      JSON.stringify(this.SearchData)
    );
    sessionStorage.setItem(
      'OrderSearchModalValue',
      JSON.stringify(this.SearchData)
    );
    this.SearchData.OrigReqDateFrom = this.ValidaDateValue(
      this.SearchData.OrigReqDateFrom
    );
    // this.SearchData.OrigReqDateFrom = this.datepipe.transform(
    //   this.SearchData.OrigReqDateFrom.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
    this.SearchData.OrigReqDateTo = this.ValidaDateValue(
      this.SearchData.OrigReqDateTo
    );
    // this.SearchData.OrigReqDateTo = this.datepipe.transform(
    //   this.SearchData.OrigReqDateTo.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
    this.SearchData.RequiredDateFrom = this.ValidaDateValue(
      this.SearchData.RequiredDateFrom
    );
    // this.SearchData.RequiredDateFrom = this.datepipe.transform(
    //   this.SearchData.RequiredDateFrom.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
    this.SearchData.RequiredDateTo = this.ValidaDateValue(
      this.SearchData.RequiredDateTo
    );
    // this.SearchData.RequiredDateTo = this.datepipe.transform(
    //   this.SearchData.RequiredDateTo.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
    this.SearchData.CDelDateFrom = this.ValidaDateValue(
      this.SearchData.CDelDateFrom
    );
    // this.SearchData.CDelDateFrom = this.datepipe.transform(
    //   this.SearchData.CDelDateFrom.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
    this.SearchData.CDelDateTo = this.ValidaDateValue(
      this.SearchData.CDelDateTo
    );
    // this.SearchData.CDelDateTo = this.datepipe.transform(
    //   this.SearchData.CDelDateTo.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
    this.SearchData.PODateFrom = this.ValidaDateValue(
      this.SearchData.PODateFrom
    );
    // this.SearchData.PODateFrom = this.datepipe.transform(
    //   this.SearchData.PODateFrom.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
    this.SearchData.PODateTo = this.ValidaDateValue(this.SearchData.PODateTo);
    // this.SearchData.PODateTo = this.datepipe.transform(
    //   this.SearchData.PODateTo.toLocaleString().split(',')[0],
    //   'yyyy-MM-dd'
    // );
//uncomment below code when cr deploy
    if (!this.checkVehicleType()) {
      alert(
        'System will not allow to fetch the data only for Vehicle Type field/filter, because this will increate the load on system to use this single field to extract the data. So, recommanded to use Vehicle Type filter with other data fields such as customer, project, date range, etc.'
      );
      return;
    }
    this.saveTrigger.emit(this.SearchData);
    this.modalService.dismissAll();
  }

  GetCustomerSelectList() {
    // var pUserType = 'AD';
    // var pGroupName = 'jagdishh_ttl@natsteel.com.sg';
    this.orderService.getCustomerSelectList().subscribe({
      next: (response) => {
        console.log('CustomerList', response);
        this.CustomerList = response;
        this.FilteredCustomerList = [...response];
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  filterCustomerList(searchText: any): void {
    console.log('Search text entered:', searchText); // Debug

    if (!searchText) {
      this.FilteredCustomerList = [...this.CustomerList]; // Reset if empty
      return;
    }

    const lowerCaseSearchText = searchText.target.value.toLowerCase().trim();

    this.FilteredCustomerList = this.CustomerList.filter(customer =>
      customer.Text.toLowerCase().trim().startsWith(lowerCaseSearchText)||customer.Value.toLowerCase().trim().includes(lowerCaseSearchText)
    );

    console.log('FilteredCustomerList:', this.FilteredCustomerList); // Debug
  }

  GetProjectSelectList() {
    console.log(this.SearchData.CustomerName);
    var CustomerCode = this.SearchData.CustomerName;
    // var pUserType = "AD";
    // var pGroupName = "jagdishh_ttl@natsteel.com.sg";
    this.orderService.getProjectSelectList(CustomerCode).subscribe({
      next: (response) => {
        console.log('ProjectCodeList', response);
        this.ProjectCodeList = response;
        this.SearchData.ProjectTitle = [];
      },
      error: (e) => {},
      complete: () => {},
    });
  }
  setProjectSelectList() {
    console.log(this.SearchData.CustomerName);
    var CustomerCode = this.SearchData.CustomerName;
    this.orderService.getProjectSelectList(CustomerCode).subscribe({
      next: (response) => {
        this.ProjectCodeList = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetAccountManager() {
    this.orderService.getAccountManager().subscribe({
      next: (response) => {
        console.log(response);
        this.AccountManagerList = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetDetailingIncharge() {
    this.orderService.getDetailingIncharge().subscribe({
      next: (response) => {
        console.log(response);
        this.DetaillingInchargeList = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetProjectIncharge() {
    this.orderService.getProjectIncharge().subscribe({
      next: (response) => {
        console.log(response);
        this.ProjectInchargeList = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetAllProject() {
    if (this.AllProjects == false) {
      return;
    }
    var CustomerCode = this.SearchData.CustomerName;
    // var pUserType = "AD";
    // var pGroupName = "jagdi  shh_ttl@natsteel.com.sg";
    this.orderService.getProjectAllList(CustomerCode).subscribe({
      next: (response) => {
        console.log('ProjectCodeListAll', response);
        this.ProjectCodeList = response;
        this.SearchData.ProjectTitle = [];
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  Clear() {
    this.SearchData = {
      Category: 'SEARCH',
      OrigReqDateFrom: '',
      OrigReqDateTo: '',
      RequiredDateFrom: '',
      RequiredDateTo: '',
      PONo: '',
      BBSNo: '',
      CustomerName: '',
      ProjectTitle: [''],
      WBS1: '',
      WBS2: '',
      WBS3: '',
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
      Forecast: false,
      VehicleType: ''
    };

    this.clearSuggestions();
  }
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) > 6;

  testChange(event: any) {
    console.log('testChange=>', event);
  }
  shouldHighlightDate(date: NgbDate): boolean {
    const dateToCheck = new Date(date.year, date.month - 1, date.day);
    let isHoliday = this.lHolidays.some((highlightedDate: any) => {
      return new Date(highlightedDate).getTime() === dateToCheck.getTime();
    });
    console.log('dateToCheck=>', isHoliday);
    return isHoliday || this.calendar.getWeekday(date) > 6;
  }
  onInputChange() {
    if (this.SearchData.PONo) {
      this.filteredSuggestions = this.previousInputs.filter((input) =>
        input.toLowerCase().includes(this.SearchData.PONo.toLowerCase())
      );
    } else {
      this.filteredSuggestions = [];
    }
  }

  selectSuggestion(name: string, suggestion: any) {
    if (name == 'PONo') {
      this.SearchData.PONo = suggestion;
      this.filteredSuggestions = [];
    } else if (name == 'BBSNo') {
      this.SearchData.BBSNo = suggestion;
      this.filteredSuggestionsBBSNo = [];
    } else if (name == 'WBS1') {
      this.SearchData.WBS1 = suggestion;
      this.filteredSuggestionsWBS1 = [];
    } else if (name == 'WBS2') {
      this.SearchData.WBS2 = suggestion;
      this.filteredSuggestionsWBS2 = [];
    } else if (name == 'WBS3') {
      this.SearchData.WBS3 = suggestion;
      this.filteredSuggestionsWBS3 = [];
    } else if (name == 'SONo') {
      this.SearchData.SONo = suggestion;
      this.filteredSuggestionsSAPSalesOrderNO = [];
    } else if (name == 'WTNo') {
      this.SearchData.WTNo = suggestion;
      this.filteredSuggestionsWeightTicketNo = [];
    } else if (name == 'LoadNo') {
      this.SearchData.LoadNo = suggestion;
      this.filteredSuggestionsLoadNo = [];
    } else if (name == 'DONo') {
      this.SearchData.DONo = suggestion;
      this.filteredSuggestionsDONo = [];
    } else if (name == 'InvNo') {
      this.SearchData.InvNo = suggestion;
      this.filteredSuggestionsInvoiceNo = [];
    } else if (name == 'SOR') {
      this.SearchData.SOR = suggestion;
      this.filteredSuggestionsSOR = [];
    }
  }

  saveInput() {
    if (
      this.SearchData.PONo &&
      !this.previousInputs.includes(this.SearchData.PONo)
    ) {
      this.previousInputs.push(this.SearchData.PONo);
      this.SearchData.PONo = '';
      this.filteredSuggestions = [];
      localStorage.setItem(
        'previousPOInputItems',
        JSON.stringify(this.previousInputs)
      );
    }

    if (
      this.SearchData.WBS1 &&
      !this.previousSuggestionsWBS1.includes(this.SearchData.WBS1)
    ) {
      this.previousSuggestionsWBS1.push(this.SearchData.WBS1);
      this.filteredSuggestionsWBS1 = [];
      localStorage.setItem(
        'previousSuggestionsWBS1',
        JSON.stringify(this.previousSuggestionsWBS1)
      );
    }
    if (
      this.SearchData.WBS2 &&
      !this.previousSuggestionsWBS2.includes(this.SearchData.WBS2)
    ) {
      this.previousSuggestionsWBS2.push(this.SearchData.WBS2);
      this.filteredSuggestionsWBS2 = [];
      localStorage.setItem(
        'previousSuggestionsWBS2',
        JSON.stringify(this.previousSuggestionsWBS2)
      );
    }
    if (
      this.SearchData.WBS3 &&
      !this.previousSuggestionsWBS3.includes(this.SearchData.WBS3)
    ) {
      this.previousSuggestionsWBS3.push(this.SearchData.WBS3);
      this.filteredSuggestionsWBS3 = [];
      localStorage.setItem(
        'previousSuggestionsWBS3',
        JSON.stringify(this.previousSuggestionsWBS3)
      );
    }
    if (
      this.SearchData.LoadNo &&
      !this.previousSuggestionsLoadNo.includes(this.SearchData.LoadNo)
    ) {
      this.previousSuggestionsLoadNo.push(this.SearchData.LoadNo);
      this.filteredSuggestionsLoadNo = [];
      localStorage.setItem(
        'previousSuggestionsLoadNo',
        JSON.stringify(this.previousSuggestionsLoadNo)
      );
    }
    if (
      this.SearchData.InvNo &&
      !this.previousSuggestionsInvoiceNo.includes(this.SearchData.InvNo)
    ) {
      this.previousSuggestionsInvoiceNo.push(this.SearchData.InvNo);
      this.filteredSuggestionsInvoiceNo = [];
      localStorage.setItem(
        'previousSuggestionsInvoiceNo',
        JSON.stringify(this.previousSuggestionsInvoiceNo)
      );
    }
    if (
      this.SearchData.BBSNo &&
      !this.previousSuggestionsBBSNo.includes(this.SearchData.BBSNo)
    ) {
      this.previousSuggestionsBBSNo.push(this.SearchData.BBSNo);
      this.filteredSuggestionsBBSNo = [];
      localStorage.setItem(
        'previousSuggestionsBBSNo',
        JSON.stringify(this.previousSuggestionsBBSNo)
      );
    }
    if (
      this.SearchData.SONo &&
      !this.previousSuggestionsSAPSalesOrderNO.includes(this.SearchData.SONo)
    ) {
      this.previousSuggestionsSAPSalesOrderNO.push(this.SearchData.SONo);
      this.filteredSuggestionsSAPSalesOrderNO = [];
      localStorage.setItem(
        'previousSuggestionsSAPSalesOrderNO',
        JSON.stringify(this.previousSuggestionsSAPSalesOrderNO)
      );
    }
    if (
      this.SearchData.WTNo &&
      !this.previousSuggestionsWeightTicketNo.includes(this.SearchData.WTNo)
    ) {
      this.previousSuggestionsWeightTicketNo.push(this.SearchData.WTNo);
      this.filteredSuggestionsWeightTicketNo = [];
      localStorage.setItem(
        'previousSuggestionsWeightTicketNo',
        JSON.stringify(this.previousSuggestionsWeightTicketNo)
      );
    }
    if (
      this.SearchData.DONo &&
      !this.previousSuggestionsDONo.includes(this.SearchData.DONo)
    ) {
      this.previousSuggestionsDONo.push(this.SearchData.DONo);
      this.filteredSuggestionsDONo = [];
      localStorage.setItem(
        'previousSuggestionsDONo',
        JSON.stringify(this.previousSuggestionsDONo)
      );
    }
    if (
      this.SearchData.SOR &&
      !this.previousSOR.includes(this.SearchData.SOR)
    ) {
      this.previousSOR.push(this.SearchData.SOR);
      this.filteredSuggestionsSOR = [];
      localStorage.setItem('previousSOR', JSON.stringify(this.previousSOR));
    }
  }
  onWBS1change() {
    this.filteredSuggestionsWBS1 = this.previousSuggestionsWBS1.filter(
      (input: any) =>
        input.toLowerCase().includes(this.SearchData.WBS1.toLowerCase())
    );
    if (this.SearchData.WBS1.length == 0) {
      this.filteredSuggestionsWBS1 = [];
    }
  }
  onWBS2change() {
    this.filteredSuggestionsWBS2 = this.previousSuggestionsWBS2.filter(
      (input: any) =>
        input.toLowerCase().includes(this.SearchData.WBS2.toLowerCase())
    );
    if (this.SearchData.WBS2.length == 0) {
      this.filteredSuggestionsWBS2 = [];
    }
  }
  onWBS3change() {
    this.filteredSuggestionsWBS3 = this.previousSuggestionsWBS3.filter(
      (input: any) =>
        input.toLowerCase().includes(this.SearchData.WBS3.toLowerCase())
    );
    if (this.SearchData.WBS3.length == 0) {
      this.filteredSuggestionsWBS3 = [];
    }
  }
  onLoadNoChange() {
    this.filteredSuggestionsLoadNo = this.previousSuggestionsLoadNo.filter(
      (input: any) =>
        input.toLowerCase().includes(this.SearchData.LoadNo.toLowerCase())
    );
    if (this.SearchData.LoadNo.length == 0) {
      this.filteredSuggestionsLoadNo = [];
    }
  }
  onInvNoChange() {
    this.filteredSuggestionsInvoiceNo =
      this.previousSuggestionsInvoiceNo.filter((input: any) =>
        input.toLowerCase().includes(this.SearchData.InvNo.toLowerCase())
      );
    if (this.SearchData.InvNo.length == 0) {
      this.filteredSuggestionsInvoiceNo = [];
    }
  }
  onSORChange() {
    this.filteredSuggestionsSOR = this.previousSOR.filter((input: any) =>
      input.toLowerCase().includes(this.SearchData.SOR.toLowerCase())
    );
    if (this.SearchData.SOR.length == 0) {
      this.filteredSuggestionsSOR = [];
    }
  }
  onBBSNoChange() {
    this.filteredSuggestionsBBSNo = this.previousSuggestionsBBSNo.filter(
      (input: any) =>
        input.toLowerCase().includes(this.SearchData.BBSNo.toLowerCase())
    );

    if (this.SearchData.BBSNo.length == 0) {
      this.filteredSuggestionsBBSNo = [];
    }
  }
  onSONoChange() {
    this.filteredSuggestionsSAPSalesOrderNO =
      this.previousSuggestionsSAPSalesOrderNO.filter((input: any) =>
        input.toLowerCase().includes(this.SearchData.SONo.toLowerCase())
      );
    if (this.SearchData.SONo.length == 0) {
      this.filteredSuggestionsSAPSalesOrderNO = [];
    }
  }
  onWTNoChange() {
    this.filteredSuggestionsWeightTicketNo =
      this.previousSuggestionsWeightTicketNo.filter((input: any) =>
        input.toLowerCase().includes(this.SearchData.WTNo.toLowerCase())
      );
    if (this.SearchData.WTNo.length == 0) {
      this.filteredSuggestionsWeightTicketNo = [];
    }
  }
  onDONoChange() {
    this.filteredSuggestionsDONo = this.previousSuggestionsDONo.filter(
      (input: any) =>
        input.toLowerCase().includes(this.SearchData.DONo.toLowerCase())
    );
    if (this.SearchData.DONo.length == 0) {
      this.filteredSuggestionsDONo = [];
    }
  }

  clearSuggestions() {
    if (this.SearchData.WBS1.length == 0) {
      this.filteredSuggestionsWBS1 = [];
    }
    if (this.SearchData.WBS2.length == 0) {
      this.filteredSuggestionsWBS2 = [];
    }
    if (this.SearchData.WBS3.length == 0) {
      this.filteredSuggestionsWBS3 = [];
    }
    if (this.SearchData.LoadNo.length == 0) {
      this.filteredSuggestionsLoadNo = [];
    }
    if (this.SearchData.InvNo.length == 0) {
      this.filteredSuggestionsInvoiceNo = [];
    }
    if (this.SearchData.SOR.length == 0) {
      this.filteredSuggestionsSOR = [];
    }
    if (this.SearchData.BBSNo.length == 0) {
      this.filteredSuggestionsBBSNo = [];
    }
    if (this.SearchData.SONo.length == 0) {
      this.filteredSuggestionsSAPSalesOrderNO = [];
    }
    if (this.SearchData.WTNo.length == 0) {
      this.filteredSuggestionsWeightTicketNo = [];
    }
    if (this.SearchData.DONo.length == 0) {
      this.filteredSuggestionsDONo = [];
    }
  }
//uncomment below code when cr deploy
  checkVehicleType(): boolean {
    const lItem:any = this.SearchData;

    if (!lItem.VehicleType) return true;

    const scalarProps = [
      'PONo', 'BBSNo', 'RequiredDateTo', 'RequiredDateFrom',
      'OrigReqDateTo', 'OrigReqDateFrom', 'CDelDateFrom', 'CDelDateTo',
      'PODateFrom', 'PODateTo', 'CustomerName', 'WBS1', 'WBS2', 'WBS3',
      'LoadNo', 'DONo', 'InvNo'
    ];

    const allScalarsEmpty = scalarProps.every(prop => !lItem[prop]);

    const arrayFields = ['ProductType', 'ProjectPIC', 'DetailingPIC', 'ProjectTitle'];

    // Clean arrays: remove empty strings
    const cleanedArrays = arrayFields.reduce((acc, field) => {
      acc[field] = (lItem[field] || []).filter((item: string) => item.trim() !== '');
      return acc;
    }, {} as Record<string, string[]>);

    if (allScalarsEmpty) {
      const allArraysEmpty = arrayFields.every(field => cleanedArrays[field].length === 0);
      if (allArraysEmpty) return false;

      const anyArrayMultiple = arrayFields.some(field => cleanedArrays[field].length > 1);
      if (anyArrayMultiple) return true;

      const anySingleNonEmpty = arrayFields.some(field => cleanedArrays[field].length === 1);
      return anySingleNonEmpty;
    }

    return true;
  }

  // checkVehicleType() {
  //   let lItem = this.SearchData;
  //   if (lItem.VehicleType) {
  //     if (
  //       !lItem.PONo &&
  //       !lItem.BBSNo &&
  //       !lItem.RequiredDateTo &&
  //       !lItem.RequiredDateFrom &&
  //       !lItem.OrigReqDateTo &&
  //       !lItem.OrigReqDateFrom &&
  //       !lItem.CDelDateFrom &&
  //       !lItem.CDelDateTo &&
  //       !lItem.PODateFrom &&
  //       !lItem.PODateTo &&
  //       !lItem.CustomerName &&
  //       !lItem.WBS1 &&
  //       !lItem.WBS2 &&
  //       !lItem.WBS3 &&
  //       !lItem.LoadNo &&
  //       !lItem.DONo &&
  //       !lItem.InvNo
  //     ) {
  //       if (
  //         lItem.ProductType.length == 0 &&
  //         lItem.ProjectPIC.length == 0 &&
  //         lItem.DetailingPIC.length == 0 &&
  //         lItem.ProjectTitle.length == 0
  //       ) {
  //         return false;
  //       }
  //       if (
  //         lItem.ProductType.length > 1 ||
  //         lItem.ProjectPIC.length > 1 ||
  //         lItem.DetailingPIC.length > 1 ||
  //         lItem.ProjectTitle.length > 1
  //       ) {
  //         return true;
  //       }
  //       var lReturn = false;
  //       if (lItem.ProductType.length == 1 && lItem.ProductType[0] != '') {
  //         lReturn = true;
  //       }
  //       if (lItem.ProjectPIC.length == 1 && lItem.ProjectPIC[0] != '') {
  //         lReturn = true;
  //       }
  //       if (lItem.DetailingPIC.length == 1 && lItem.DetailingPIC[0] != '') {
  //         lReturn = true;
  //       }
  //       if (lItem.ProjectTitle.length == 1 && lItem.ProjectTitle[0] != '') {
  //         lReturn = true;
  //       }
  //       return lReturn;
  //     }
  //   }
  //   return true;
  // }

  onBlur() {
    setTimeout(() => {
        this.clearSuggestionList();
    }, 200);
  }

  clearSuggestionList(): void {
    this.filteredSuggestions = [];
    this.filteredSuggestionsBBSNo = [];
    this.filteredSuggestionsWBS1 = [];
    this.filteredSuggestionsWBS2 = [];
    this.filteredSuggestionsWBS3 = [];
    this.filteredSuggestionsSAPSalesOrderNO = [];
    this.filteredSuggestionsWeightTicketNo = [];
    this.filteredSuggestionsLoadNo = [];
    this.filteredSuggestionsDONo = [];
    this.filteredSuggestionsInvoiceNo = [];
    this.filteredSuggestionsSOR = [];
  }

  close(){
    // activeModal.dismiss('Cross click')
    this.saveTrigger.emit(undefined);
    this.modalService.dismissAll();
  }
}


//&& !lItem.ProductType && !lItem.ProjectPIC && !lItem.DetailingPIC && !lItem.ProjectTitle
