import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ToastrService } from 'ngx-toastr';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DocumentsAttachedComponent } from 'src/app/Orders/process-order/documents-attached/documents-attached.component';
import { OrderService } from 'src/app/Orders/orders.service';
import { DatePipe } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { ForecastdataModel } from 'src/app/Model/ForecastdataModel';
import { UpdateProjectManagementComponent } from 'src/app/Orders/process-order/update-project-management/update-project-management.component';
import { UpdateTechnicalRemarksComponent } from 'src/app/Orders/process-order/update-technical-remarks/update-technical-remarks.component';
import { UpdateProjectInchargeComponent } from 'src/app/Orders/process-order/update-project-incharge/update-project-incharge.component';
import { UpdateDetaillingInchargeComponent } from 'src/app/Orders/process-order/update-detailling-incharge/update-detailling-incharge.component';
import { LoginService } from 'src/app/services/login.service';
import { ProcessSelectionModelComponent } from 'src/app/Orders/process-order/selection-model/process-selection-model/process-selection-model.component';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import { CreateordersharedserviceService } from 'src/app/Orders/createorder/createorderSharedservice/createordersharedservice.service';
import { ProcessSharedServiceService } from 'src/app/Orders/process-order/SharedService/process-shared-service.service';
import { SaveJobAdvice_CAB } from 'src/app/Model/SaveJobAdvice_CAB';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { state } from '@angular/animations';

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
  selector: 'app-pendingbpc-detailing',
  templateUrl: './pendingbpc-detailing.component.html',
  styleUrls: ['./pendingbpc-detailing.component.css'],
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
export class PendingbpcDetailingComponent implements OnInit {
  @Output() saveTrigger = new EventEmitter<any>();
  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollViewportBPC', { static: false })
  public viewPortENT: CdkVirtualScrollViewport | undefined;
  public rows: { col1: number; col2: string }[] = [];
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  pendingBpcFixedColumn = 0;
  toggleFilter: boolean = true;
  PendingBpcHeader: any[] = [];
  pendingBpcCols: any[] = [];
  itemSize = 30;
  PendingBpc: any[] = [];
  selectedRow: any[] = [];
  PendingENTBackUp: any[] = [];
  isAscending: boolean = false;
  showOrderNo: boolean = true;
  currentSortingColumn: string = '';
  isMobile = window.innerWidth;
  CurrentTab: string = 'CREATING';
  totalOrderedWeight: string = '';
  searchText: any = '';
  lOrdersCT: any;
  lOrdersWT: any;
  ProcessOrderLoading: boolean = false;
  gFilteredWeight: any = 0;
  gFilteredQty: any = 0;
  cellSelection: boolean = false;
  lastSelctedColumn: any = undefined;
  ForeCast: any = '';
  PendingBpcTableSearch!: FormGroup;
  PendingEntTableColumnToggle!: FormGroup;
  togglePendingENTSettingMenu: boolean = false;
  HoverSetting: boolean = false;
  Collapse: boolean = false;
  showPopup: boolean = false;
  RowsHidden: boolean = false;
  wbs1List: any[] = [];
  wbs2List: any[] = [];
  wbs3List: any[] = [];
  lastSelctedRowDetails: any;
  lastSelectedTable: boolean = false;
  lastSelectedTableData: any[] = [];
  disableSubmit: boolean = true;
  disableWithdraw: boolean = true;
  disableCancel: boolean = true;
  disableUpdate: boolean = true;
  disableAmmend: boolean = true;
  gGreenSteelSelection: boolean = false;
  gEditStructureElement_Flag: boolean = false;
  lastSelctedRow: any = undefined;
  lastButtonPresses: any = '';
  showWBS: boolean = true;

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

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public router: Router,
    private loginService: LoginService,
    private createSharedService: CreateordersharedserviceService,
    private processsharedserviceService: ProcessSharedServiceService,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    debugger;
    this.setColumStrucure();

    this.UpdateProcessForms();

    this.GetProcessOrderForCreate('CREATING', false);

    this.PendingBpcTableSearch.valueChanges.subscribe((newValue) => {
      this.FilterPendingEntTableData();
    });
  }
  UpdateProcessForms() {
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

    this.PendingBpcTableSearch = this.formBuilder.group({
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
    });
  }

  GetProcessOrderForCreate(item: any, value: boolean): void {
    debugger;
    this.CurrentTab = item;
    // this.resetSettingsMenu();
    // this.setButtonDisplay(item);

    this.ProcessOrderLoading = true;
    let obj: any = {
      OrderStatus: item,
      Forecast: value,
    };
    this.orderService.GetPendingENT(obj).subscribe({
      next: (response) => {
        debugger;
        console.log('PendingBpc response', response);
        response = this.UpdateTotalWeight(response);

        this.setTotalWeight(response);
        this.SetFilteredWeight(response);
        this.PendingBpc = response.map((obj: any) => this.replaceNull(obj));
        this.PendingBpc = this.PendingBpc.filter((x) => x.ProdType == 'BPC');
        this.MapData_UpdateAdditionalRemark(this.PendingBpc);
        this.PendingENTBackUp = JSON.parse(JSON.stringify(this.PendingBpc));
        this.ProcessOrderLoading = false;

        this.PendingBpc = this.UpdateSelectedRecords(this.PendingBpc);
        this.FilterPendingEntTableData();

        // Trigger re-check for ViewChild
        // this.refreshContainers();
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  async UpdateForecastData(dataList: any) {
    console.log('dataList -> ', dataList);

    let obj: ForecastdataModel = {
      pOrderData: dataList,
    };

    let rList = await this.getForecastRec(obj);
    return rList;
  }

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
      let lReturn: any = await this.UpdateForecastData(this.PendingBpc);
      if (lReturn == false) {
        alert(
          'Data extraction error, please check your estimated query data size and the Internet connection and try again.'
        );
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
    debugger;
    // NOTE -> Better to update the table data in UI rather than calling the API.
    if (this.CurrentTab == 'CREATING') {
      this.GetProcessOrderForCreate('CREATING', false);
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

  replaceNull(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value === null ? '' : value,
      ])
    );
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

      modalRef.componentInstance.SelectedRows = this.selectedRow;
      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
        this.UpdateTable();
        this.togglePendingENTSettingMenu = false;
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
      modalRef.componentInstance.SelectedRows = this.selectedRow;
      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
        this.UpdateTable();
        this.togglePendingENTSettingMenu = false;
      });
    } else if (item.toLowerCase() == 'project') {
      debugger;
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
        this.togglePendingENTSettingMenu = false;
      });
    } else if (item.toLowerCase() == 'detailling') {
      debugger;
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
         this.togglePendingENTSettingMenu = false
      });
    }
  }
      ngAfterViewInit() {

    const pendingEntElement = document.getElementById('pending-ent-tab-link');
    pendingEntElement?.addEventListener('click', () =>
      this.GetProcessOrderForCreate('CREATING', false)
    );

    const savedBpcCols = localStorage.getItem('pendingBpcCols');
  if (savedBpcCols) {
    try {
      const parsedCols = JSON.parse(savedBpcCols);
      if (Array.isArray(parsedCols) && parsedCols.length) {
        this.pendingBpcCols = parsedCols;
       
      }
    } catch (error) {
      console.error('Error restoring Pending BPC columns:', error);
    }
  }
    

   
    // console.log("this.tab1.nativeElement=>",this.tab1.nativeElement);
    // this.tab1.nativeElement.addEventListener('click', () => this.openSearch());
  }
    @HostListener('document:click', ['$event'])
  handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      if (this.HoverSetting == false) {
        this.togglePendingENTSettingMenu = false;
        
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
  KeySingleSelectProcess(event: KeyboardEvent) {
    // Define the list based on the current Tab
    let ldataList: any[] = [];
    let lColumnList: any[] = [];

    if (this.CurrentTab == 'CREATING') {
      ldataList = this.PendingBpc;
      lColumnList = this.pendingBpcCols;
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
  scrollToSelectedRowUp(index: number) {
    if (this.CurrentTab == 'CREATING') {
      this.scrollToRowUP(index, this.viewPortENT!);
    }
  }
  scrollToRowUP(index: number, viewport: CdkVirtualScrollViewport): void {
    if (viewport) {
      if (this.ScrolltoOffset_Up(viewport, index)) {
        if (index <= 2) {
          viewport.scrollToOffset(0, 'auto');
        } else {
          viewport.scrollToIndex(index, 'auto');
        }
      }
    }
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
  scrollToSelectedColumn(
    ldataList: any,
    pColumnId: any,
    pRight2left: boolean,
    pSelectMultiple: boolean
  ) {
    // Find the index of the selected row

    if (this.CurrentTab == 'CREATING') {
      this.scrollToColumn(
        this.viewPortENT!,
        this.pendingBpcFixedColumn,
        this.pendingBpcCols,
        pColumnId,
        pSelectMultiple,
        pRight2left
      );
    }
    // this.scrollToColumn(this.viewPortIncoming!);
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
      lColumnList = this.pendingBpcCols;
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

    if (this.CurrentTab == 'CREATING') {
      this.scrollToRow(
        this.viewPortENT!,
        selectedRowIndex + 1,
        ldataList.length
      );
    }
  }
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
  KeySelectProcess(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      // Call your custom function herethis.onShiftDown();
      console.log('button pressed');

      // Define the list based on the current Tab
      let ldataList: any[] = [];

      if (this.CurrentTab == 'CREATING') {
        ldataList = this.PendingBpc;
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
        eventPhase: 2,
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
        ldataList = this.PendingBpc;
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
  UpdateSelectedRecords(list: any) {
    if (this.selectedRow.length > 0) {
      for (let i = 0; i < this.selectedRow.length; i++) {
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
        // this.SetRemarks(
        //   this.selectedRow[0].AdditionalRemark,
        //   this.selectedRow[0].SiteEngr_Name,
        //   this.selectedRow[0].SiteEngr_HP,
        //   this.selectedRow[0].Scheduler_Name,
        //   this.selectedRow[0].Scheduler_HP
        // );
      }
    }

    return list;
  }

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

  resetSelectedRowColor() {
    if (this.CurrentTab == 'CREATING') {
      this.PendingBpc.forEach((element) => {
        element.isSelected = false;
      });
    }
  }
  // selectRow(row: any, dataList: any[], event: MouseEvent) {
  //   debugger
  //   // this.myTable.nativeElement.tabIndex = 0;
  //   console.log('here', row);
  //   this.lastSelectedTable = false;
  //   this.setButtonDisplay(row.OrderStatus);
  //   this.gGreenSteelSelection=false;
  //   this.gEditStructureElement_Flag = false;

  //   // this.Collapse = false;

  //   if (event.ctrlKey && this.cellSelection == false) {
  //     // Handle multiselect with Ctrl key
  //     if (this.selectedRow.length == 0) {
  //       this.lastSelctedRow = row;
  //       // Run as a normal click
  //     } else {
  //       console.log('Multi Select Started');
  //       if (row.isSelected) {
  //         // Remove from this.selectedRow

  //         let tIndex = this.selectedRow.findIndex((x) => x == row);
  //         this.selectedRow.splice(tIndex, 1);
  //         row.isSelected = false;
  //         if (tIndex === 0) {
  //           this.UpdateDisplayFields();
  //         } //temp commented
  //       } else {
  //         row.isSelected = true;
  //         this.selectedRow.push(row);

  //         this.lastSelctedRow = row;
  //       }
  //       this.setButtonDisplay(this.selectedRow[0].OrderStatus);
  //       this.SetFilteredWeight(this.selectedRow);

  //       return;
  //     }
  //   }else if (event.shiftKey) {
  //       // Handle multiselect with Shift key.
  //       if (this.selectedRow.length == 0) {
  //         // Run as a normal click.
  //       } else {

  //         // STEP 1 - Unselect All Rows excepts the last selected row.
  //         // STEP 2 - Select all the rows between the last selected row and the current row.
  //         console.log('Multi Select Started');
  //         let lIndex = 0;

  //         // STEP 1
  //         for (let i = 0; i <dataList.length; i++) {
  //           if(dataList[i].sno != this.lastSelctedRow.sno){
  //             dataList[i].isSelected = false;
  //           }else{
  //             lIndex = i;
  //           }
  //         }

  //         this.selectedRow = [];

  //         // The index of the currently selected row in the list.
  //         let nIndex = dataList.findIndex((x) => x == row);

  //         // STEP 2
  //         if (nIndex > lIndex) {
  //           // Add all the rows between the two indexes.
  //           for (let i = lIndex; i < nIndex + 1; i++) {
  //             dataList[i].isSelected = true;
  //             this.selectedRow.push(dataList[i]);
  //           }
  //         }else{
  //           // Add all the rows between the two indexes.
  //           for (let i = nIndex; i < lIndex + 1; i++) {
  //             dataList[i].isSelected = true;
  //             this.selectedRow.push(dataList[i]);
  //           }
  //         }

  //         this.setButtonDisplay(this.selectedRow[0].OrderStatus);
  //         console.log('selectedRow', this.selectedRow);
  //         this.SetFilteredWeight(this.selectedRow);

  //         return;
  //       }
  //     }
  //     this.lastSelctedRow = row;

  //   if (
  //     this.cellSelection == true &&
  //     row.isSelected == true &&
  //     event.shiftKey
  //   ) {
  //     this.resetSelectedRowColor();
  //     row.isSelected = true;
  //     this.selectedRow = [];
  //     this.selectedRow.push(row);
  //     this.SetFilteredWeight(this.selectedRow);

  //     return;
  //   }
  //   // When 0 row is Selected
  //   // this.ProcessOrderForm.reset();
  //   // this.ProcessorderCheckboxreset();
  //   // this.resetSelectedRowColor();
  //   // this.resetInputDisplay(row);

  //   row.isSelected = true;

  //   //this.showWBS = row.StructureElement == 'NONWBS' ? false : true;
  //   this.selectedRow = [];
  //   this.selectedRow[0] = row;
  //   var lProdType = this.selectedRow[0].ProdType;
  //   var lProdSubType = this.selectedRow[0].ProdTypeDis;
  //   this.disProdType(lProdType, lProdSubType);
  //   // this.DisableFields(this.selectedRow[0].OrderStatus);

  //   this.setButtonDisplay(row.OrderStatus);
  //   this.SetFilteredWeight(this.selectedRow);

  //   // Condition updated to handle Partial Delivered Orders.
  //   if (
  //     row.OrderStatus != 'Cancelled' &&
  //     row.OrderStatus != 'Processed' &&
  //     row.OrderStatus != 'Production' &&
  //     row.OrderStatus != 'Reviewed' &&
  //     row.OrderStatus != 'Delivered' &&
  //     !row.OrderStatus.includes('Delivered')
  //   ) {

  //     // this.SetRemarks(
  //     //   this.selectedRow[0].AdditionalRemark,
  //     //   this.selectedRow[0].SiteEngr_Name,
  //     //   this.selectedRow[0].SiteEngr_HP,
  //     //   this.selectedRow[0].Scheduler_Name,
  //     //   this.selectedRow[0].Scheduler_HP
  //     // );
  //     // this.GetContractList(
  //     //   row.CustomerCode,
  //     //   row.ProjectCode,
  //     //   row.JobID,
  //     //   row.OrderSource,
  //     //   row.StructureElement,
  //     //   row.ProdType,
  //     //   row.ProdTypeDis,
  //     //   row.ScheduledProd
  //     // );
  //     this.GetWBSAll();
  //   } else {

  //     this.orderService
  //       .Get_ProcessRec(
  //         row.CustomerCode,
  //         row.ProjectCode,
  //         row.JobID,
  //         row.StructureElement,
  //         row.ProdType,
  //         row.ScheduledProd,
  //         row.OrderSource,
  //         row.SORNo
  //       )
  //     }

  // }

  selectRow(row: any, dataList: any[], event: MouseEvent) {
    // Check if Ctrl or Shift is pressed
    const isCtrlPressed = event.ctrlKey;
    const isShiftPressed = event.shiftKey;

    // ---- Multi-selection with Ctrl ----
    if (isCtrlPressed) {
      if (row.isSelected) {
        // Deselect if already selected
        row.isSelected = false;
        const index = this.selectedRow.findIndex((x) => x === row);
        if (index > -1) this.selectedRow.splice(index, 1);
      } else {
        row.isSelected = true;
        this.selectedRow.push(row);
      }
      this.lastSelctedRow = row;
      this.setButtonDisplay(this.selectedRow[0]?.OrderStatus);
      this.SetFilteredWeight(this.selectedRow);
      return;
    }

    // ---- Multi-selection with Shift ----
    if (isShiftPressed && this.lastSelctedRow) {
      const startIndex = dataList.findIndex((x) => x === this.lastSelctedRow);
      const endIndex = dataList.findIndex((x) => x === row);
      const [from, to] = [
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex),
      ];

      this.selectedRow = [];
      dataList.forEach((item, index) => {
        item.isSelected = index >= from && index <= to;
        if (item.isSelected) this.selectedRow.push(item);
      });

      this.setButtonDisplay(this.selectedRow[0]?.OrderStatus);
      this.SetFilteredWeight(this.selectedRow);
      return;
    }

    // ---- Single-selection if no modifier key is pressed ----
    dataList.forEach((item) => (item.isSelected = false));
    row.isSelected = true;
    this.selectedRow = [row];
    this.lastSelctedRow = row;

    const lProdType = row.ProdType;
    const lProdSubType = row.ProdTypeDis;
    this.disProdType(lProdType, lProdSubType);
    this.setButtonDisplay(row.OrderStatus);
    this.SetFilteredWeight(this.selectedRow);

    if (
      row.OrderStatus !== 'Cancelled' &&
      row.OrderStatus !== 'Processed' &&
      row.OrderStatus !== 'Production' &&
      row.OrderStatus !== 'Reviewed' &&
      row.OrderStatus !== 'Delivered' &&
      !row.OrderStatus.includes('Delivered')
    ) {
      this.GetWBSAll();
    } else {
      this.orderService.Get_ProcessRec(
        row.CustomerCode,
        row.ProjectCode,
        row.JobID,
        row.StructureElement,
        row.ProdType,
        row.ScheduledProd,
        row.OrderSource,
        row.SORNo
      );
    }
  }

  UpdateDisplayFields() {}

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
    };
    localStorage.setItem('ProcessData', JSON.stringify(data));
    sessionStorage.setItem('ProcessData', JSON.stringify(data));

    // await this.SetCreateDatainLocal(item.JobID);
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
 splitArray(num: number, array: any[]): HeaderColumn[] {
     const midpoint = Math.ceil(array.length / 2);
     if (num == 1) {
       return array.slice(0, midpoint);
     } else {
       return array.slice(midpoint);
     }
     // array.slice(midpoint)];
   }
 
  getProductDetailsRoute(product: any) {
    let route = undefined;
    if (product == 'BPC') {
       route = '#/order/createorder/bpc?autoImport=true';
    }
    return route;
  }

  disProdType(ProdType: any, ProdSubType: any) {
    if (ProdType == 'BPC') {
      if (this.selectedRow[0].ScheduledProd == 'Y') {
        this.showWBS = true;
      } else {
        this.showWBS = false;
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
        this.disableSubmit = true;
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
        // document.getElementById('order_update').disabled = true;
        this.disableUpdate = true;
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
        this.disableWithdraw = true;
        this.disableCancel = true;
        this.disableUpdate = true;
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
        error: (e) => {
          this.ProcessOrderLoading = false;
        },
        complete: () => {
          // this.loading = false;
          this.ProcessOrderLoading = false;
        },
      });
  }
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
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
  reset() {
    this.PendingBpcTableSearch.reset();
  }
  syncScroll(event: any) {}

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

  FilterPendingEntTableData() {
    this.PendingBpc = JSON.parse(JSON.stringify(this.PendingENTBackUp));

    this.PendingBpc = this.PendingBpc.filter(
      (item) =>
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['OrderNo'].value,
          item.JobIDDis
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['CustomerStatus'].value,
          item.OrderStatus
        ) &&
        (this.checkFilterData(
          this.PendingBpcTableSearch.controls['Customer'].value,
          item.CustomerName
        ) ||
          this.checkFilterData(
            this.PendingBpcTableSearch.controls['Customer'].value,
            item.CustomerCode
          )) &&
        (this.checkFilterData(
          this.PendingBpcTableSearch.controls['Project'].value,
          item.ProjectTitle
        ) ||
          this.checkFilterData(
            this.PendingBpcTableSearch.controls['Project'].value,
            item.ProjectCode
          )) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['StructureElement'].value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['ProductType'].value,
          item.ProdTypeDis
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['WBS1'].value,
          item.WBS1
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['WBS2'].value,
          item.WBS2
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['WBS3'].value,
          item.WBS3
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['PONo'].value,
          item.PONumber
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['BBSNo'].value,
          item.BBSNo
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['PODate'].value,
          item.PODate
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['RequiredDate'].value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls[
            'RequiredDate'
          ].value?.replaceAll(),
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['RevisedReqDate'].value,
          item.OrigReqDate
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['ForecastDate'].value,
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
          this.PendingBpcTableSearch.controls['DifferentDays'].value,
          item.DiffDays
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['ConfirmedDelDate'].value,
          item.PlanDelDate
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['TotalWT'].value,
          item.TotalWeight
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['Transport'].value,
          item.TransportMode
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['SORNo'].value,
          item.SORNo
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['SONo'].value,
          item.SAPSONo
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['PMRemarks'].value,
          item.PMDRemarks
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['TechRemarks'].value,
          item.TECHRemarks
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['AttachedNo'].value,
          item.AttachedNo
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['DataEnteredBy'].value,
          item.DataEntryBy
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['SubmittedBy'].value,
          item.UpdateBy
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['ProjectIncharge'].value,
          item.ProjectIncharge
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['DetailingIncharge'].value,
          item.DetailingIncharge
        ) &&
        this.checkFilterData(
          this.PendingBpcTableSearch.controls['ProcessDate'].value,
          item.ProcessDate
        )
    );
    // OrderNo
    // CustomerStatus
    // Customer
    // Project
    this.PendingBpc = this.UpdateSelectedRecords(this.PendingBpc);
    this.SetFilteredWeight(this.PendingBpc);
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
  }

  getLeftOfTable(arrayName: string, index: number) {
    if (arrayName == 'pendingBpc') {
      console.log(
        "this.pendingBpcCols[index]['left']=>",
        this.pendingBpcCols[index]['left'] + 'px'
      );
      return this.pendingBpcCols[index]['left'] + 'px';
    }
    {
      return 'inherit';
    }
  }
  getFormattedDate(date: any) {
    if (date == null) {
      return '';
    }
    return new Date(date).toLocaleString().split(',')[0] == 'Invalid Date'
      ? ''
      : this.datePipe.transform(date, 'yyyy-MM-dd', 'UTC+8');
  }
  public get inverseOfBPC(): string {
    if (!this.viewPortENT || !this.viewPortENT['_renderedContentOffset']) {
      return '-0px';
    }
    let offset = this.viewPortENT['_renderedContentOffset'];
    return `-${offset}px`;
  }
  public get inverseOfBpcSearch(): string {
    if (!this.viewPortENT || !this.viewPortENT['_renderedContentOffset']) {
      return '50px';
    }
    let offset = this.viewPortENT['_renderedContentOffset'] - 50;
    return `-${offset}px`;
  }
  getRightWidthTest(element: HTMLElement, j: number, arrayName: string) {
    let width = this.getAllPreviousSiblings(element);
    // console.log('previousSibling=>', width);
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
  setColumStrucure() {
    if (localStorage.getItem('pendingBpcCols')) {
      this.pendingBpcCols = JSON.parse(localStorage.getItem('pendingBpcCols')!);
    } else {
      this.pendingBpcCols = [
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

  CheckHiddenColumn(index: any, dataList: any) {
    let data = dataList.filter((obj: { isVisible: any }) => obj.isVisible);
    data = data[index];
    let indexes = dataList.findIndex(
      (objs: { colName: any }) => objs.colName === data.colName
    );
    return indexes;
  }

  getMinHeightIncoming(id: string) {
    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
      return divElement.clientHeight;
    }
    return 50;
  }

  dropBPCCol(event: any) {
    if (this.pendingBpcFixedColumn != 0) {
      if (
        event.previousIndex + 2 <= this.pendingBpcFixedColumn &&
        event.currentIndex + 2 > this.pendingBpcFixedColumn
      ) {
        this.toastr.warning(
          "Freezed columns can't be moved to normal columns!"
        );
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex + 2 > this.pendingBpcFixedColumn &&
        event.currentIndex + 2 <= this.pendingBpcFixedColumn
      ) {
        // moveItemInArray(this.activeColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to freezed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.pendingBpcCols
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.pendingBpcCols
        );
        moveItemInArray(this.pendingBpcCols, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.pendingBpcCols
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.pendingBpcCols
      );
      moveItemInArray(this.pendingBpcCols, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('pendingBpcCols', JSON.stringify(this.pendingBpcCols));
  }
  changeNameForAll(arrayOfObjects: any) {
    arrayOfObjects.forEach((obj: any) => {
      obj.isSelected = false;
    });
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
  saveColumnsToLocalStorage(colName: string, array: any) {
    localStorage.setItem(colName, JSON.stringify(array));
    //this.toastr.success('Column Size and visibility updated sucessfully');
  }
  widthChangeCompletedStore() {
   localStorage.setItem('pendingbpcCols', JSON.stringify(this.pendingBpcCols));   
  }
  onWidthChange(obj: any) {
     if (obj.colName == 'PendingBpc') {
      this.pendingBpcCols[obj.index].resizeWidth = obj.width;
      this.pendingBpcCols[obj.index].width = obj.width;
      console.log(
        'onWidthChangependingBPCCols=>',
        obj,
        this.pendingBpcCols[obj.index].resizeWidth
      );
      this.saveColumnsToLocalStorage('pendingBpcCols', this.pendingBpcCols);
    }
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
  toggleSortingOrderForBPC(columnname: string, actualColumn: string) {
    this.changeNameForAll(this.PendingBpc);
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (
        columnname == 'OrderNo' ||
        columnname == 'AttachedNo' ||
        columnname == 'TotalWT' ||
        columnname == 'sno'
      ) {
        this.PendingBpc.sort(
          (a, b) => Number(a[actualColumn]) - Number(b[actualColumn])
        );
      } else {
        // this.PendingENT.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? a[actualColumn].localeCompare(b[actualColumn])
        //     : -1
        // );
        this.PendingBpc.sort((a, b) =>
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
        this.PendingBpc.sort(
          (a, b) => Number(b[actualColumn]) - Number(a[actualColumn])
        );
      } else {
        // this.PendingENT.sort((a, b) =>
        //   a[actualColumn] != null && a[actualColumn] != null
        //     ? b[actualColumn].localeCompare(a[actualColumn])
        //     : 0
        // );
        this.PendingBpc.sort((a, b) =>
          this.compare(a[actualColumn], b[actualColumn], 'desc')
        );
      }
    }
    // this.sortItemsProcessing(columnname);
    this.UpdateSelectedSortedRecords(this.PendingBpc);
    this.PendingBpc = [...this.PendingBpc];
    this.viewPortENT?.scrollToIndex(0);
    // Optionally scroll back to the top
    this.viewPortENT?.checkViewportSize();
    // this.sortItemsPendingENT(columnname);
    //this.UpdateSelectedSortedRecords(this.PendingENT);
  }
  RouteToBPC() {
    this.router.navigate(['order/createorder/bpc']);
  }
  openPopup(name: string) {
    this.showPopup = true;
  }

  closePopup() {

      localStorage.setItem(
        'pendingBpcFixedColumn',
        this.pendingBpcFixedColumn.toString()
      );
      this.showPopup = false;
    }



  // getExportObj(orderStatus: string) {
  //   debugger
  //   let Datalist: any[] = [];

  //   if (orderStatus == 'CREATING') {
  //     Datalist = this.pendingBpcCols;
  //   }

  //   let lReturn = {
  //     OrderStatus: orderStatus,
  //     pColumnsID: [''],
  //     pColumnName: [''],
  //     pColumnSize: [10],
  //     Forecast: this.ForeCast,
  //     UserName: this.loginService.GetGroupName(),
  //   };
  //   lReturn.pColumnsID = [];
  //   lReturn.pColumnName = [];
  //   lReturn.pColumnSize = [];
  //   for (let i = 0; i < Datalist.length; i++) {
  //     if (Datalist[i].isVisible == true) {
  //       lReturn.pColumnsID.push(Datalist[i].colName);
  //       lReturn.pColumnName.push(Datalist[i].displayName);
  //       lReturn.pColumnSize.push(80);
  //     }
  //   }
  //   return lReturn;
  // }
  // ExportToExcel(orderStatus: string) {
  //   debugger;
  //   let obj = this.getExportObj(orderStatus);
  //   // let obj = {
  //   //   OrderStatus: orderStatus,
  //   //   pColumnsID: ['id', 'JobIDDis', 'OrderStatus', 'CustomerName'],
  //   //   pColumnName: ['S/No', 'Order No', 'Customer Status', 'Customer'],
  //   //   pColumnSize: [40, 40, 70, 100],
  //   //   Forecast: false,
  //   //   UserName: 'Ajitk_ttl@natsteel.com.sg',
  //   // };
  //   this.ProcessOrderLoading = true;
  //   this.orderService.ExcelExportIncoming(obj).subscribe({

  //     next: (data) => {
  //       debugger
  //       const blob = new Blob([data], {
  //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       });
  //       const url = window.URL.createObjectURL(blob);

  //       const a = document.createElement('a');
  //       a.href = url;

  //       a.download = 'ODOS_' + this.CurrentTab + '_ORDER_LIST' + '.xlsx';
  //       a.click();
  //       // a.download = 'example.xlsx';
  //       // document.body.appendChild(a);
  //       // a.click();
  //       //   document.body.removeChild(a);
  //       //   window.URL.revokeObjectURL(url);
  //       //   this.OrderdetailsLoading = false;
  //       // const dummyData: Uint8Array = new Uint8Array([data]);
  //       //const fileName = 'example.xlsx';
  //       //  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       // FileSaver.saveAs(blob, fileName);
  //     },
  //     error: (e) => {
  //       this.ProcessOrderLoading = false;
  //       alert(
  //         'Order printing failed, please check the Internet connection and try again.'
  //       );
  //     },
  //     complete: () => {
  //       this.ProcessOrderLoading = false;
  //     },
  //   });
  // }


  getExportObj(orderStatus: string) {
    debugger
    let Datalist: any[] = [];
    let filteredData: any[]=[]
   if (orderStatus == 'CREATING') {
      Datalist = this.pendingBpcCols;
      filteredData = this.PendingBpc;
    }

    let lReturn = {
      OrderStatus: orderStatus,
      pColumnsID: [''],
      pColumnName: [''],
      pColumnSize: [10],
      Forecast: this.ForeCast,
      DataRows: filteredData,
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
  // ExportToExcel(orderStatus: string) {
  //   debugger;
  //   let obj = this.getExportObj(orderStatus);
  //   // let obj = {
  //   //   OrderStatus: orderStatus,
  //   //   pColumnsID: ['id', 'JobIDDis', 'OrderStatus', 'CustomerName'],
  //   //   pColumnName: ['S/No', 'Order No', 'Customer Status', 'Customer'],
  //   //   pColumnSize: [40, 40, 70, 100],
  //   //   Forecast: false,
  //   //   UserName: 'Ajitk_ttl@natsteel.com.sg',
  //   // };
  //   this.ProcessOrderLoading = true;
  //   this.orderService.ExcelExportIncoming(obj).subscribe({
  //     next: (data) => {
  //       const blob = new Blob([data], {
  //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       });
  //       const url = window.URL.createObjectURL(blob);

  //       const a = document.createElement('a');
  //       a.href = url;

  //       a.download = 'ODOS_' + this.CurrentTab + '_ORDER_LIST' + '.xlsx';
  //       a.click();

  //     },
  //     error: (e) => {
  //       this.ProcessOrderLoading = false;
  //       alert(
  //         'Order printing failed, please check the Internet connection and try again.'
  //       );
  //     },
  //     complete: () => {
  //       this.ProcessOrderLoading = false;
  //     },
  //   });
  // }
  exportToExcel(orderStatus: string) {
    const exportObj = this.getExportObj(orderStatus);
    const { pColumnsID, pColumnName, DataRows } = exportObj;

    // Transform filtered data to include only visible columns
    const formattedData = DataRows.map((row: any) => {
      const obj: any = {};
      for (let i = 0; i < pColumnsID.length; i++) {
        const colKey = pColumnsID[i];
        const displayName = pColumnName[i];
        obj[displayName] = row[colKey]; // use displayName as header
      }
      return obj;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    // 🔹 1. Set column widths based on data and headers
    const columnWidths = pColumnName.map((header, colIndex) => {
      const maxDataLength = DataRows.reduce((max, row) => {
        const value = row[pColumnsID[colIndex]];
        return Math.max(max, value ? value.toString().length : 0);
      }, header.length); // Consider header length too
      return { wch: maxDataLength + 2 }; // Add padding
    });
    worksheet['!cols'] = columnWidths;

    // 🔹 2. Style header row
    for (let colIndex = 0; colIndex < pColumnName.length; colIndex++) {
      const cellAddress = { c: colIndex, r: 0 }; // First row
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = worksheet[cellRef];
      if (cell) {
        cell.s = {
          fill: {
            patternType: 'solid',
            fgColor: { rgb: 'D9E1F2' }, // Light blue
          },
          font: {
            bold: true,
            color: { rgb: '000000' },
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
        };
      }
    }

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Orders': worksheet },
      SheetNames: ['Orders'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true, // ⚠️ Optional: depends on library
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(blob, `ODOS_${this.CurrentTab}_ORDER_LIST.xlsx`);
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

    if (tab == 'PendingBpc') {
      this.PendingBpc = JSON.parse(JSON.stringify(dataList));
    }
  }
  UnHideRows() {
    this.RowsHidden = false;

    this.PendingBpc = JSON.parse(JSON.stringify(this.PendingENTBackUp));
  }

  columnHidden(colName: any) {
    if (colName == 'PendingBpc') {
      localStorage.setItem(
        'pendingBpcCols',
        JSON.stringify(this.pendingBpcCols)
      );
    }
  }
}
