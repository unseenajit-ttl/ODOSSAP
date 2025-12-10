import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, NgZone } from '@angular/core';
import { OrderService } from 'src/app/Orders/orders.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderColumn } from 'src/app/Model/reshuffle_column_table_structure';
import { boolean, row } from 'mathjs';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { OrderAssignmentArray } from 'src/app/Model/OrderAssignmentArray';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { AnyMapping } from 'three';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BatchgenerationfullComponent } from '../../Outsource/batchgenerationfull/batchgenerationfull.component'
import { BatchgenerationpartialComponent } from 'src/app/Outsource/batchgenerationpartial/batchgenerationpartial.component';

@Component({
  selector: 'app-order-assignment-outsource',
  templateUrl: './order-assignment-outsource.component.html',
  styleUrls: ['./order-assignment-outsource.component.css']
})
export class OrderAssignmentOutsourceComponent implements OnInit {
  headerColumn: any[] = [];
  showColumnEditor = false;
  schnellOrders: any[] = [];
  schnellOrderItems: any[] = [];
  editColumn: boolean = false;
  selectproductType: any[] = [];
  showitem: boolean = false;
  loading = true;
  maxSize = 5;
  currentPageCAB = 1;
  itemsPerPageCAB = 10;
  pageSizeCAB: number = 0;
  TotalNumberofRecordCAB: any;
  selectedOrderNo: string | null = null;

  currentPageCAR = 1;
  itemsPerPageCAR = 10;
  pageSizeCAR: number = 0;

  currentPageMESH = 1;
  itemsPerPageMESH = 10;
  pageSizeMESH: number = 0;

  currentPage = 1;
  pageSize = 0;
  itemsPerPage = 10;

  OrdAssgnColumns: any[] = [];

  pageSizeROW: number = 0;
  itemsPerPageROW = 10;
  currentPageROW = 1;

  currentPageCommon: number = 1;
  itemsPerPageCommon: number = 10;
  pageSizeCommon: number = 0;

  fixedColumn: number = 0;
  orderColumns: HeaderColumn[] = [];
  columnSettings: { field: string, isVisible: boolean }[] = [];

  searchText: any = '';
  activeorderForm!: FormGroup;
  submitted = false;
  searchResult = true;
  searchForm: FormGroup;
  @ViewChild('scrollViewportENT', { static: false })
  public viewPortENT: CdkVirtualScrollViewport | undefined;
  currentSortingColumn: string = '';
  isAscending: boolean = false;
  OrderAssignmentArray: any[] = [];
  toggleFilters = true;
  clearInput: number = 0;
  selectedRowIndex: any;
  CategoryList: string[] = [
    'Full Outsourcing',
    'Full Insourcing',
    'Partial Outsourcing',
    'Partial Insourcing'
  ];
  SelectedCategory: any
  FromReqDate: string | null = null;
  ToReqDate: string | null = null;
  //customerList: any[] = [];
  projectList: any[] = [];
  ProducttypeList = [
    //{ id: 1, name: 'All' },
    { id: 2, name: 'CAB' },
    { id: 3, name: 'MSH' },
    { id: 4, name: 'BPC' },
    { id: 5, name: 'PRC' }
  
  ];
  statusList = [
  { id: 1, name: 'Assigned' },
  { id: 2, name: 'Not Assigned' },
 { id: 3, name: 'Assignment Failed' },
 { id: 4, name: 'In Error' },
 { id: 5, name: 'Cancelled' }
  ]
  selectedProductType: any=null;
  selectedstatus: any=null;
  selectedcustomer: any=null;
  selectedproject: any=null;
  focusedRowIndex: number = 0;
  Customerlist:any=[];
  Projectlist:any=[];
  LoadingCustomerName: boolean = true;
  allSelected: boolean = false;

  constructor(private orderService: OrderService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone,
    private formsmodule: FormsModule,
    public commonService: CommonService,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog
  ) {
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
      UpdateDate: [''],
    });
  }

  ngOnInit(): void {
    this.GetCustomer();
    this.getOutsourceOrderAssignment();
    //this.SelectedCategory= ['SCHNELL']; // preselected value
    this.headerColumn = [
      { "displayName": "Sr No", "value": "srNo" },
      { "displayName": "Order Request No", "value": "orderRequestNo" },
      { "displayName": "Order No", "value": "orderNo" },
      //{ "displayName": "Item No", "value": "itemNo" },
      { "displayName": "Customer Name", "value": "customerName" },
      { "displayName": "Project Name", "value": "projectName" },
      { "displayName": "Project Sub Segment", "value": "proj_sub_segment" },
      { "displayName": "Score", "value": "Score" },
      //{ "displayName": "Suggestion", "value": "Suggestion" },
      { "displayName": "Planner Confirmation", "value": "select" }
      //{ "displayName": "Action", "value": "action" }
    ]

    if (localStorage.getItem('OrdAssgnFixedColumns')) {
      this.fixedColumn = JSON.parse(
        localStorage.getItem('OrdAssgnFixedColumns')!
      );
    }

    if (localStorage.getItem('OrdAssgnColumns')) {
      this.OrdAssgnColumns = JSON.parse(localStorage.getItem('OrdAssgnColumns')!);
     
    } else {
      this.OrdAssgnColumns = [
        {
          controlName: 'OrderRequestNo',
          displayName: 'Order Request No.',
          chineseDisplayName: '',
          field: 'OrderRequestNo',
          colName: 'OrderRequestNo',
          placeholder: 'Search OrderRequestNo',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '130',
        },
        {
          controlName: 'OrderNo',
          displayName: 'Order No.',
          chineseDisplayName: '',
          field: 'OrderNo',
          colName: 'OrderNo',
          placeholder: 'Search OrderNumber',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'CustCode',
          displayName: 'Customer Code',
          chineseDisplayName: '',
          colName: 'CustCode',
          field: 'CustCode',
          placeholder: 'Search CustCode',
          isVisible: false,
          width: '5%',
          left: '0',
          resizeWidth: '200',
        },
        {
          controlName: 'CustName',
          displayName: 'Customer Name',
          chineseDisplayName: '',
          colName: 'CustName',
          field: 'CustName',
          placeholder: 'Search CustName',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '240',
        },
        {
          controlName: 'ProjNo',
          displayName: 'Project No.',
          chineseDisplayName: '',
          colName: 'ProjNo',
          field: 'ProjNo',
          placeholder: 'Search ProjNo',
          isVisible: false,
          width: '10%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'ProjName',
          displayName: 'Project Name.',
          chineseDisplayName: '',
          colName: 'ProjName',
          field: 'ProjName',
          placeholder: 'Search ProjName',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '250',
        },
        {
          controlName: 'CustPoNo',
          displayName: 'Customer PO No.',
          chineseDisplayName: '',
          colName: 'CustPoNo',
          field: 'CustPoNo',
          placeholder: 'Search CustPoNo',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '180',
        },
        {
          controlName: 'ProductType',
          displayName: 'Product Type',
          chineseDisplayName: '',
          colName: 'ProductType',
          field: 'ProductType',
          placeholder: 'Search ProductType',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'AssignedTo', 
          displayName: 'Assigned To',
          chineseDisplayName: '',
          colName: 'AssignedTo',
          field: 'AssignedTo',
          placeholder: 'Search AssignedTo',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'TypeofOutsourcing', 
          displayName: 'Typeo of Outsourcing',
          chineseDisplayName: '',
          colName: 'TypeofOutsourcing',
          field: 'TypeofOutsourcing',
          placeholder: 'Search TypeofOutsourcing',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '160',
        },
        {
          controlName: 'AssignmentStatus',
          displayName: 'Assignment Status',
          chineseDisplayName: '',
          colName: 'AssignmentStatus',
          field: 'AssignmentStatus',
          placeholder: 'Search AssignmentStatus',
          isVisible: true,
          width: '10%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'PRStatus',
          displayName: 'PR Status',
          chineseDisplayName: '',
          colName: 'PRStatus',
          field: 'PRStatus',
          placeholder: 'Search AssignedTo',
          isVisible: true,
          width: '20%',
          left: '0',
          resizeWidth: '100',
        },
          {
          controlName: 'SOWt',
          displayName: 'SO Weight',
          chineseDisplayName: '',
          colName: 'SOWt',
          field: 'SOWt',
          placeholder: 'Search SOWt',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'NoofCuts',
          displayName: 'No. Of Cuts',
          chineseDisplayName: '',
          colName: 'NoofCuts',
          field: 'NoofCuts',
          placeholder: 'Search NoofCuts',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'NoofPieces',
          displayName: 'No. Of Pieces',
          chineseDisplayName: '',
          colName: 'NoofPieces',
          field: 'NoofPieces',
          placeholder: 'Search NoofPieces',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'SLBendings',
          displayName: 'S/L Bendings',
          chineseDisplayName: '',
          colName: 'SLBendings',
          field: 'SLBendings',
          placeholder: 'Search SLBendings',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '110',
        },
        {
          controlName: 'SLPieces',
          displayName: 'S/L Pieces',
          chineseDisplayName: '',
          colName: 'SLPieces',
          field: 'SLPieces',
          placeholder: 'Search SLPieces',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'SCBMRun',
          displayName: 'SCB M-run',
          chineseDisplayName: '',
          colName: 'SCBMRun',
          field: 'SCBMRun',
          placeholder: 'Search SCBMRun',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'SCBPieces',
          displayName: 'SCB Pieces',
          chineseDisplayName: '',
          colName: 'SCBPieces',
          field: 'SCBPieces',
          placeholder: 'Search SCBPieces',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '110',
        },
        {
          controlName: 'SBCPieces',
          displayName: 'SBC Pieces',
          chineseDisplayName: '',
          colName: 'SBCPieces',
          field: 'SBCPieces',
          placeholder: 'Search SBCPieces',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '110',
        },
        {
          controlName: 'CouplrBrPeices',
          displayName: 'Coupler Bar Pieces',
          chineseDisplayName: '',
          colName: 'CouplrBrPeices',
          field: 'CouplrBrPeices',
          placeholder: 'Search CouplrBrPeices',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '110',
        },
        {
          controlName: 'CouplrEnds',
          displayName: 'Coupler Ends',
          chineseDisplayName: '',
          colName: 'CouplrEnds',
          field: 'CouplrEnds',
          placeholder: 'Search CouplrEnds',
          isVisible: true,
          width: '5%',
          left: '0',
          resizeWidth: '110',
        },
        {
          controlName: 'ContractNo',
          displayName: 'Contract No.',
          chineseDisplayName: '',
          colName: 'ContractNo',
          field: 'ContractNo',
          placeholder: 'Search ContractNo',
          isVisible: false,
          width: '5%',
          left: '0',
          resizeWidth: '110',
        },
        {
          controlName: 'CustOrdDate',
          displayName: 'Customer Order Date',
          chineseDisplayName: '',
          colName: 'CustOrdDate',
          field: 'CustOrdDate',
          placeholder: 'Search CustOrdDate',
          isVisible: false,
          width: '10%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'ReqDelDatefr',
          displayName: 'Required Delivery Date From',
          chineseDisplayName: '',
          colName: 'ReqDelDatefr',
          field: 'ReqDelDatefr',
          placeholder: 'Search ReqDelDatefr',
          isVisible: true,
          width: '12%',
          left: '0',
          resizeWidth: '150',
        },
        {
          controlName: 'ReqDelDateto',
          displayName: 'Required Delivery Date To',
          chineseDisplayName: '',
          colName: 'ReqDelDateto',
          field: 'ReqDelDateto',
          placeholder: 'Search ReqDelDateto',
          isVisible: true,
          width: '12%',
          left: '0',
          resizeWidth: '120',
        },
        {
          controlName: 'ProjSeg',
          displayName: 'Project Segment',
          chineseDisplayName: '',
          colName: 'ProjSeg',
          field: 'ProjSeg',
          placeholder: 'Search ProjSeg',
          isVisible: false,
          width: '12%',
          left: '0',
          resizeWidth: '130',
        },
        {
          controlName: 'ProjSubSeg',
          displayName: 'Project SubSegment',
          chineseDisplayName: '',
          colName: 'ProjSubSeg',
          field: 'ProjSubSeg',
          placeholder: 'Search ProjSubSeg',
          isVisible: false,
          width: '5%',
          left: '0',
          resizeWidth: '100',
        },

        {
          controlName: 'CreateBy',
          displayName: 'Created By',
          chineseDisplayName: '',
          colName: 'CreateBy',
          field: 'CreateBy',
          placeholder: 'Search here',
          isVisible: false,
          width: '20%',
          left: '0',
          resizeWidth: '100',
        },
        {
          controlName: 'CreateDate',
          displayName: 'Created Date',
          chineseDisplayName: '',
          colName: 'CreateDate',
          field: 'CreateDate',
          placeholder: 'Search here',
          isVisible: false,
          width: '20%',
          left: '0',
          resizeWidth: '200',
        },
        // {
        //   controlName: 'Score',
        //   displayName: 'Score (%)',
        //   chineseDisplayName: '',
        //   colName: 'Score',
        //   field: 'Score',
        //   placeholder: 'Search here',
        //   isVisible: false,
        //   width: '5%',
        //   left: '0',
        //   resizeWidth: '90',
        // },
        // {
        //   controlName: 'ExtraLength',
        //   displayName: 'Extra Length',
        //   chineseDisplayName: '建筑构件',
        //   colName: 'ExtraLength',
        //   field: 'ExtraLength',
        //   placeholder: 'Search ExtraLength',
        //   isVisible: false,
        //   width: '10%',
        //   left: '0',
        //   resizeWidth: '120',
        // },
        // {
        //   controlName: 'suggestions',
        //   displayName: 'Suggestions',
        //   chineseDisplayName: '',
        //   colName: 'suggestions',
        //   field: 'suggestions',
        //   placeholder: 'Search here',
        //   isVisible: true,
        //   width: '5%',
        //   left: '0',
        //   resizeWidth: '90',
        // },
        // {
        //   controlName: 'planner',
        //   displayName: 'Planner Confirmation',
        //   chineseDisplayName: '',
        //   colName: 'planner',
        //   field: 'planner',
        //   placeholder: 'Search here',
        //   isVisible: true,
        //   width: '5%',
        //   left: '0',
        //   resizeWidth: '90',
        // },
        // {
        //   controlName: 'withdrawal',
        //   displayName: 'Withdrawal Confirmation',
        //   chineseDisplayName: '',
        //   colName: 'withdrawal',
        //   field: 'withdrawal',
        //   placeholder: 'Search here',
        //   isVisible: true,
        //   width: '5%',
        //   left: '0',
        //   resizeWidth: '90',
        // },
      ];
    }
    this.changeDetectorRef.detectChanges();

  }

  Validation():boolean{

    if (this.FromReqDate===null && this.ToReqDate!=null)
    {
      alert("Please select From required delivery date");
      this.ToReqDate=null;
      return false;
    } 
    else
    {
      return true;
    }

  }


  getOutsourceOrderAssignment() {
    let validationresult;
    validationresult=this.Validation();
    if (validationresult===true)
    {
    this.loading = false;
    debugger
    console.log('this.FromReqDate',this.FromReqDate)
    this.orderService.GetOutsourceOrderAssign(this.FromReqDate, this.ToReqDate, this.selectedcustomer, this.selectedproject, 
      this.selectedProductType,
      this.selectedstatus,null).subscribe({
      next: (data: any[]) => {
        // this.schnellOrders = data.map(item => ({
        //   ...item,
        //   Extralength: 0,
        //   isSelected: false,
        //   isEditing: false,
        //   isWithdrawal: false
        // }));
        this.schnellOrders = data.map(item => ({
          ...item,
          isSelected: false
        }));
        this.loading = true;
        this.changeDetectorRef.detectChanges();
        console.log(this.schnellOrders)
        this.showitem=false;
        this.schnellOrderItems=[];
      },
      error: (err: any) => {
        console.error('Failed to fetch Schnell orders', err);
        this.loading = true;
      }
    });
  }
  }
  public onPageChangeCommon(pageNum: number): void {
    this.pageSizeCommon = this.itemsPerPageCommon * (pageNum - 1);
  }

  onOrderClick(rowData: any) {
    console.log('Row clicked:', rowData);
    this.selectedOrderNo = rowData.OrderNo
    debugger
    this.getSchnellOrderItem(rowData.OrderRequestNo);
    
    // Perform your action here, like navigation or displaying details
  }

  getSchnellOrderItem(OrderRequestNo: string) {
    this.showitem = false;
    this.orderService.GetSchnellOrderItem(OrderRequestNo).subscribe({
      next: (data: any[]) => {
        this.schnellOrderItems = data;
        console.log('Schnell Order Items:', this.schnellOrderItems);
        this.showitem = true;

      },
      error: (err: any) => {
        console.error('Failed to fetch Schnell order Items', err);
        this.showitem = true;
      }
    });
  }

  onRowKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowDown' && index < this.schnellOrders.length - 1) {
      this.selectedRowIndex = index + 1;
      this.scrollToRow(this.selectedRowIndex);
      event.preventDefault();
    } else if (event.key === 'ArrowUp' && index > 0) {
      this.selectedRowIndex = index - 1;
      this.scrollToRow(this.selectedRowIndex);
      event.preventDefault();
    } else if (event.key === 'Enter' && event.shiftKey && this.schnellOrders[index]) {
      debugger
      if (this.schnellOrders[index].AssignmentStatus ==='ASSIGNED')
      {
        alert("Order Request No '"+this.schnellOrders[index].OrderRequestNo+"' has already been assigned")
      }
      else
      {
        this.schnellOrders[index].isSelected = !this.schnellOrders[index].isSelected;
        event.preventDefault();
      }
    }
  }

  scrollToRow(index: number) {
    const rows = document.querySelectorAll('.draft-table');
    const row = rows[index] as HTMLElement;
    row?.focus();
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
    localStorage.setItem('OrdAssgnFixedColumns', pVal);
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

  SaveColumnsSetting() {
    localStorage.setItem('OrdAssgnColumns', JSON.stringify(this.OrdAssgnColumns));
    console.log('SaveColumnsSetting',localStorage.getItem('OrdAssgnColumns'))
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

  dropCol(event: any) {
    debugger
    //let colnameo=this.OrdAssgnColumns[event.previousIndex].columnname
    
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
          this.OrdAssgnColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.OrdAssgnColumns
        );
        moveItemInArray(this.OrdAssgnColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.OrdAssgnColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.OrdAssgnColumns
      );
      moveItemInArray(this.OrdAssgnColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('OrdAssgnColumns', JSON.stringify(this.OrdAssgnColumns));
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
  toggleSortingOrder(columnname: string, actualColName: any) {
    //  this.currentSortingColumn = columnname;
    // this.isAscending = !this.isAscending;
    debugger
    // this.sortItems(columnname);
    // if (this.isAscending) {
    //   if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
    //     this.OrderAssignmentArray.sort(
    //       (a, b) => Number(a[actualColName]) - Number(b[actualColName])
    //     );
    //   } else {
    //     this.OrderAssignmentArray.sort((a, b) =>
    //       a[actualColName].localeCompare(b[actualColName])
    //     );
    //   }
    // } else {
    //   if (columnname == 'OrderNo' || columnname == 'OrderWeight') {
    //     this.OrderAssignmentArray.sort(
    //       (a, b) => Number(b[actualColName]) - Number(a[actualColName])
    //     );
    //   } else {
    //     this.OrderAssignmentArray.sort((a, b) =>
    //       b[actualColName].localeCompare(a[actualColName])
    //     );
    //   }
    // }
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    // this.sortItems(columnname);
    if (this.isAscending) {
      if (columnname == 'OrderNo' || columnname == 'CustCode'|| columnname == 'ProjNo'|| columnname == 'NoofPieces'
      || columnname == 'SLBendings'|| columnname == 'SLPieces'|| columnname == 'SCBMRun'|| columnname == 'SCBPieces'
      || columnname == 'SBCPieces' || columnname =='CouplrBrPeices' || columnname =='CouplrEnds'  || columnname =='Score'
      ) {
        this.schnellOrders.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else {
        this.schnellOrders.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'OrderNo' || columnname == 'CustCode'|| columnname == 'ProjNo'|| columnname == 'NoofPieces'
      || columnname == 'SLBendings'|| columnname == 'SLPieces'|| columnname == 'SCBMRun'|| columnname == 'SCBPieces'
      || columnname == 'SBCPieces' || columnname =='CouplrBrPeices' || columnname =='CouplrEnds'  || columnname =='Score') {
        this.schnellOrders.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else {
        this.schnellOrders.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }
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
    this.OrdAssgnColumns[index].left = width;
  }

  getMinHeightIncoming(id: string) {
    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
      // Get the height of the div using clientHeight property
      console.log('Heading Height', divElement.clientHeight);
      return divElement.clientHeight;
    }
    return 50;
  }

  onWidthChange(obj: any) {
    this.OrdAssgnColumns[obj.index].resizeWidth = obj.width;
    console.log('onWidthChange', this.OrdAssgnColumns[obj.index]);
    this.SaveColumnsSetting();
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


  Reset_Filter() {
    this.searchForm.reset();
    this.clearInput++;
    //this.searchData();
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
  }

  trackByColumn(index: number, column: any): any {
    return column.colName || column.field || index;
  }

  Export() {
    const selectedcount = this.schnellOrders.filter(item => item.isSelected).length;
    const selectedProdType = this.schnellOrders
      .filter(order => order.isSelected)
      .map(order => ( order.ProductType
      )); 
      const checkProdType = selectedProdType.every(x => x === selectedProdType[0]);
    let validate = false;
    if (selectedcount <= 0) {
      alert("No Order has been selected to assign")
      validate = false;
    }
    else if (this.SelectedCategory == '' || this.SelectedCategory == undefined) {
      alert("Please select AssignTo")
      validate = false;
    }
    else if(!checkProdType)
    {
    //  else if (this.selectedProductType == '' || this.selectedProductType == undefined) {
      alert("Please select same Product type")
      validate = false;
    }
    else {
      validate = true;
    }
    debugger
    if (validate == true) {
      let selectedOrders = this.schnellOrders
      .filter(order => order.isSelected)
      .map(order => ( order.OrderRequestNo
      )); 
      if(this.SelectedCategory=='Full Outsourcing'){
      localStorage.setItem('fulloutsourceorders', JSON.stringify(selectedOrders));
      localStorage.setItem('OutSourceType',"FullOutsource");
      localStorage.setItem('SelectedProductType',this.selectedProductType);
      console.log(JSON.parse(localStorage.getItem('fulloutsourceorders')|| '[]'))
      this.openfulloutsourcePopup();
      }
      else {
      localStorage.setItem('outsourceorders', JSON.stringify(selectedOrders));
      localStorage.setItem('OutsourceType',this.SelectedCategory);
      localStorage.setItem('SelectedProductType',this.selectedProductType);
      this.openOutsourcePopup();
      }
      
    }
  }

  Withdraw() {
    debugger;
    const selectedcount = this.schnellOrders.filter(item => item.isWithdrawal).length;
    let validate = false;
    if (selectedcount <= 0) {
      alert("No Order has been selected to withdraw")
      validate = false;
    }
    else {
      validate = true;
    }
    if (validate == true) {
      const selectedOrders = this.schnellOrders
      .filter(order => order.isWithdrawal)
      .map(order => order.OrderNo);;
      this.orderService.DeleteOutsourceData(selectedOrders).subscribe({
        next: (response1) => {
          console.log(response1);
          if (response1.issuccess==true)
          {
            alert("Orders Withdrawed Successfully")
          }
          else
          {
            alert(response1.message);
          }
          this.ResetData();
        },
        error: (e) => {
          console.log(e);
          //this.OrderSummaryLoading = false;
        },
        complete: () => {
          //this.OrderSummaryLoading = false;
        },
      });
      
      // this.orderService.SaveOrderWithdraw(selectedOrders).subscribe({
      //   next: (response) => {
      //     console.log(response);
      //     if (response==true)
      //     {
      //       alert("Orders Withdrawed Successfully")
      //       debugger
      //       this.orderService.Delete_OrderAssignmentData(selectedOrders).subscribe({
      //         next: (response1) => {
      //           console.log(response1);
      //         },
      //         error: (e) => {
      //           console.log(e);
      //           //this.OrderSummaryLoading = false;
      //         },
      //         complete: () => {
      //           //this.OrderSummaryLoading = false;
      //         },
      //       });
      //       this.ResetData();
      //     }
         
      //   },
      //   error: (e) => {
      //     //this.OrderSummaryLoading = false;
      //   },
      //   complete: () => {
      //     //this.OrderSummaryLoading = false;
      //   },
      // });
    }
  }

  ResetData() {
    this.getOutsourceOrderAssignment();
    //this.SelectedCategory= ['SCHNELL']; // preselected value
    this.allSelected=false;
    // this.showitem=false;
    // this.schnellOrderItems=[];
  }

  GetCustomer(): void {
    debugger
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType()
    // let pGroupName = "PLiiq";
    // let pUserType = "PL"
    
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.Customerlist = response.map((i: any) => { i.CustomerName = i.CustomerName + ' (' + i.CustomerCode + ')',i.CustomerCode; return i; });
        console.log('customer=>', this.Customerlist);
        this.LoadingCustomerName = true;
      },
      error: (e) => {
        this.LoadingCustomerName = false;
       },
      complete: () => {
        this.LoadingCustomerName = false;
        // this.loading = false;
      },
    });
    // debugger;
    // this.commonService.GetCutomerDetails().subscribe({
    //   next: (response) => {
    //     debugger;
    //     this.Customerlist = response;

    //     console.log("Customerlist", this.Customerlist);
    //   },
    //   error: (e) => {
    //     this.LoadingCustomerName = false;
    //   },
    //   complete: () => {
    //     debugger;
    //     this.LoadingCustomerName = false;
    //     // if(this.transferObject["CustomerId"]!=undefined)
    //     // {

    //     //   this.customerName = this.transferObject['CustomerId'];
    //     // }
    //   },
    // });
  }

  OnCustomerChange()
  {
    //this.getSchnellOrderAssignment();
    this.GetProject(this.selectedcustomer);
  }



  GetProject(customercode: any): void {

    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();

    this.orderService
      .GetProjects(customercode, pUserType, pGroupName)
      .subscribe({
        next: (response) => {
          this.projectList = response;
          console.log('projectList=>', this.projectList);
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
    // this.commonService.GetProjectDetails(customercode).subscribe({
    //   next: (response) => {
    //     this.projectList = response;
    //   },

    //   error: (e) => {
    //   },
    //   complete: () => {
       
    //   },

    // });


  }

  ExportToExcel() {

    // let customerCode = this.dropdown.getCustomerCode();
    // let projectCodes: any = this.dropdown.getProjectCode();
    //":"2024-09-11 to 2024-09-18"

    // this.GetExportDeliDate();

    //projectCodes = projectCodes.join(',');
    this.orderService
      .ExportOrderAssignmentToExcel(this.FromReqDate,this.ToReqDate,this.selectedcustomer,this.selectedproject,
        this.selectedProductType, this.selectedstatus)
      .subscribe({
        next: (response) => {
          console.log('Success');

          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;

          a.download = 'Order Assignment List-' + '.xlsx';
          a.click();
        },
        error: () => {},
        complete: () => {},
      }); 
  }


  OnSelection(event: Event,item:any)
  {
    if (item.AssignmentStatus ==='ASSIGNED')
      {
        alert("Order Request No '"+item.OrderRequestNo+"' has already been assigned")
        event.preventDefault(); // ❌ prevent checkbox from changing
         return;
      }
      
  }

//   onEdit( Index: number) {
//     if (this.schnellOrders[Index].CouplrBrPeices >0)
//     {
//       this.schnellOrders[Index].isEditing = true;
//     }
//     else
//     {
//       alert("Order Request No '"+this.schnellOrders[Index].OrderRequestNo+"' does not contain coupler Item");
//     }
// }

// blockInvalid(event: KeyboardEvent) {
//   // prevent -, +, e, E, ., etc.
//   if (event.key === '-' || event.key === '+' || event.key === 'e' || event.key === 'E' || event.key === '.') {
//     event.preventDefault();
//   }
// }

toggleCheckbox(order: any) {
  if (order.AssignmentStatus === 'ASSIGNED' || order.AssignmentStatus === 'CANCEL') {
    return;
  }
  order.isSelected = !order.isSelected;
  console.log("Toggled:", order.orderRequestNo, "=>", order.isSelected);
}


toggleCheckboxwithdrawal(order: any) {
  if (order.AssignmentStatus === 'NOT ASSIGNED' || order.AssignmentStatus === 'CANCEL') {
    return;
  }
  order.isWithdrawal = !order.isWithdrawal;
  console.log("Toggled:", order.orderRequestNo, "=>", order.isWithdrawal);
}

SelectAllExport()
{
  this.schnellOrders.forEach(item => {
    if (item.AssignmentStatus === 'NOT ASSIGNED') {
      item.isSelected = this.allSelected;   // ✅ only select if condition passes
    }
  });
}

onSearchClick()
{
    
    this.loading = false;
    debugger
    console.log('this.FromReqDate',this.FromReqDate)
    this.orderService.GetOutsourceOrderAssign(null, null, null, null, null,null,this.searchText).subscribe({
      next: (data: any[]) => {
        // this.schnellOrders = data.map(item => ({
        //   ...item,
        //   Extralength: 0,
        //   isSelected: false,
        //   isEditing: false,
        //   isWithdrawal: false
        // }));
        this.schnellOrders = data.map(item => ({
          ...item,
          isSelected: false
        }));
        this.loading = true;
        this.changeDetectorRef.detectChanges();
        console.log(this.schnellOrders)
        this.showitem=false;
        this.schnellOrderItems=[];
      },
      error: (err: any) => {
        console.error('Failed to fetch Schnell orders', err);
        this.loading = true;
      }
    });
}

onSearchChange() {
 
  if(this.searchText=="")
  {
  this.getOutsourceOrderAssignment();
  }
}

openfulloutsourcePopup() {
    const dialogRef =this.dialog.open(BatchgenerationfullComponent, {
    width: '1500px',
    data: { message: 'Hello from popup!' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if ( result.success) {
      console.log('Batch generated successfully');
      this.getOutsourceOrderAssignment();
    
    } else {
      console.log('Dialog closed without generation');
    }
  });
}

openOutsourcePopup() {
 const dialogRef2 = this.dialog.open(BatchgenerationpartialComponent, {
    width: '1500px',
    data: { message: 'Hello from popup!' }
  });
   dialogRef2.afterClosed().subscribe(result => {
    if ( result.success) {
      console.log('Order assigned successfully');
      this.getOutsourceOrderAssignment();
    
    } else {
      console.log('Dialog closed without assignment');
    }
  });
}


}






