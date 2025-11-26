import {
  Component,
  Input,
  Renderer2,
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {
  CTSMESHOthersDetailsModels,
} from 'src/app/Model/BBSOrderdetailsTableInput';
import { OrderService } from 'src/app/Orders/orders.service';
import { BindingLimitComponent } from '../createorder/orderdetails/binding-limit/binding-limit.component';
import {
  ctsmesharray,
} from 'src/app/Model/StandardbarOrderArray';
import { ToastrService } from 'ngx-toastr';
import {
  AngularGridInstance,
  Editors,
  Column,
  GridOption,
  SelectEditor,
} from 'angular-slickgrid';
// import { InputHTMLAttributes } from '@grapecity/gcpdfviewer/typings/vendor/react/react';
import * as Slick from 'angular-slickgrid';
import { OrderImageModalComponent } from '../order-image-modal/order-image-modal.component';
import { ColumnLinkMeshProductListModalComponent } from '../column-link-mesh-product-list-modal/column-link-mesh-product-list-modal.component';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { CommonService } from 'src/app/SharedServices/CommonService';

@Component({
  selector: 'app-ctsmesh',
  templateUrl: './ctsmesh.component.html',
  styleUrls: ['./ctsmesh.component.css']
})

export class CtsmeshComponent {
  CustomerCode: any = this.dropdown.getCustomerCode();
  ProjectCode: any = this.dropdown.getProjectCode()[0];
  // OrderStatus: any = this.createSharedService.selectedrecord.OrderStatus;
  JobID: any = 0;
  // ordernumber: any= this.createSharedService.selectedrecord.OrderNumber;
  @Input() ScheduledProd: any;
  @Input() BBSID: any = 1;
  @Input() CouplerType = 'E-Splice(N)';
  ProductType:any;
  StructureElement:any;
ScheduleProd:any;
  // data: never[] | undefined;

  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event): void {
  //   //debugger;
  //   this.onTabClose();
  // }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: Event): void {
  //   //debugger;
  //   // This function will be called when the user clicks the back button
  //   this.onTabClose();
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeUnload(event: Event): void {
  //   //debugger;
  //   const isRefresh = this.isRefreshEvent(event);

  //   if (isRefresh) {
  //     // Save data to localStorage when the page is being refreshed
  //     // localStorage.setItem('myData', this.myData);
  //     this.onTabClose();
  //   }
  // }
  private isRefreshEvent(event: Event): boolean {
    // Check if the event is a refresh by examining the event type
    return event.type === 'beforeunload';
  }

  async onTabClose(): Promise<void> {
    // Your function to be called when the tab is closed
    //console.log('Tab is closing. Do something here.');
    // const confirmationMessage = 'Are you sure you want to leave? Changes you made may not be saved.';

    if (
      this.templateGrid.slickGrid !== null &&
      this.templateGrid.slickGrid.getEditorLock() !== null
    ) {
      this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit();
    }

    if (this.templateGrid.slickGrid.getActiveCell() !== null) {
      const lRow = this.templateGrid.slickGrid.getActiveCell().row;
      await this.SaveCTSDetails(this.templateGrid.slickGrid.getDataItem(lRow));
    }

    this.SaveSummary();
    // const userConfirmed = window.confirm(confirmationMessage);
  }

  showSideTable: boolean = false;
  bbsOrderTable: ctsmesharray[] = [];
  bbsOrderTemp: ctsmesharray[] = [];
  shapeCodeList: any[] = [];
  productCodeList: any[] = [];
  shapeInfo: any;
  productInfo: any;
  sizeList: any[] = [];
  Diameter: any;
  Spacing: any;
  CarrierWireDia: any;
  Mass: any;
  TotalWeight: any;
  gPreCellCol = 0;
  editIndex: any = null;
  addrow: any = 0;

  StaticImagename: any = 'mesh_wire.png';
  showupperimage: boolean = false;

  gAdvancedOrder = 'No';
  gOrderSubmission = 'Yes';
  gOrderCreation = 'Yes';
  bShapeCode: any = [];
  bShapeParameters: any = [];
  bShapeEditParameters: any = [];
  bShapeImage: any = [];
  bShapeMaxValues: any = [];
  bShapeMinValues: any = [];
  bShapeParamTypes: any = [];
  bShapeWireTypes: any = [];
  bMeshCreepMO1: any = [];
  bMeshCreepCO1: any = [];
  gridIndex = 0;
  barRowIndex: any = [];
  barChangeInd: any = [];
  gPreCellRow = -1;

  gShapeParameters: any;
  gShapeEditParameters: any;
  gShapeMaxValues: any;
  gShapeMinValues: any;
  gShapeParamTypes: any;
  gShapeWireTypes: any;
  gMeshCreepMO1: any;
  gMeshCreepCO1: any;
  gShapeImage: any;
  SrNo: any = 0;
  MWDiameter: any;
  CWDiameter: any;
  CWSpacing: any;
  MWSpacing: any;

  copyCopied = false;
  copyGridID = 2;
  copyDesSelected = false;
  //    current shape code
  gShapeCode: any = '';
  gProdCode: any = '';
  gOthersProdWTArea: any;

  gProdMWDia: any;
  gProdMWSpacing: any;
  gProdCWDia: any;
  gProdCWSpacing: any;
  gProdMass: any;
  gProdMinFactor: any;
  gProdTwinInd: any;
  ChangeInd = 0;
  gCurrentRow = 0;

  // Product Code buffer
  bProdCode: any = [];
  bProdMWDia: any = [];
  bProdMWSpacing: any = [];
  bProdCWDia: any = [];
  bProdCWSpacing: any = [];
  bProdMass: any = [];
  bProdMinFactor: any = [];
  bProdTwinInd: any = [];
  // copyCopied = false;
  // copyGridID = 2;
  // copyDesSelected = false;

  columnDefinition: any;

  tableInput = {
    id: 1,
    CustomerCode: '',
    ProjectCode: '',
    JobID: 0,
    BBSID: 0,
    MeshID: 0,
    MeshSort: 0,
    MeshMark: '',
    MeshProduct: '',
    MeshMainLen: 0,
    MeshCrossLen: 0,
    MeshMO1: 0,
    MeshMO2: 0,
    MeshCO1: 0,
    MeshCO2: 0,
    MeshMemberQty: 0,
    MeshShapeCode: '',
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    J: 0,
    K: 0,
    L: 0,
    M: 0,
    N: 0,
    O: 0,
    P: 0,
    Q: 0,
    R: 0,
    S: 0,
    T: 0,
    U: 0,
    V: 0,
    W: 0,
    X: 0,
    Y: 0,
    Z: 0,
    HOOK: 0,
    MeshTotalWT: 0,
    Remarks: '',
    MWBOM: '',
    CWBOM: '',
    UpdateDate: new Date(),
    UpdateBy: 'Vishal',
    ProdMWDia: 0,
    ProdMWSpacing: 0,
    ProdCWDia: 0,
    ProdCWSpacing: 0,
    ProdMass: 0,
    ProdMinFactor: 0,
    ProdMaxFactor: 0,
    ProdTwinInd: '',
    MeshShapeParameters: '',
    MeshEditParameters: '',
    MeshShapeParamTypes: '',
    MeshShapeMinValues: '',
    MeshShapeMaxValues: '',
    MeshShapeWireTypes: '',
  };

  defaultrow = {
    id: null,
    CustomerCode: null,
    ProjectCode: null,
    JobID: null,
    BBSID: null,
    MeshID: null,
    MeshSort: null,
    MeshMark: null,
    MeshProduct: null,
    MeshMainLen: null,
    MeshCrossLen: null,
    MeshMO1: null,
    MeshMO2: null,
    MeshCO1: null,
    MeshCO2: null,
    MeshMemberQty: null,
    MeshShapeCode: null,
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
    F: null,
    G: null,
    H: null,
    I: null,
    J: null,
    K: null,
    L: null,
    M: null,
    N: null,
    O: null,
    P: null,
    Q: null,
    R: null,
    S: null,
    T: null,
    U: null,
    V: null,
    W: null,
    X: null,
    Y: null,
    Z: null,
    HOOK: null,
    MeshTotalWT: null,
    Remarks: null,
    MWBOM: null,
    CWBOM: null,
    UpdateDate: null,
    UpdateBy: null,
    ProdMWDia: null,
    ProdMWSpacing: null,
    ProdCWDia: null,
    ProdCWSpacing: null,
    ProdMass: null,
    ProdMinFactor: null,
    ProdMaxFactor: null,
    ProdTwinInd: null,
    MeshShapeParameters: null,
    MeshEditParameters: null,
    MeshShapeParamTypes: null,
    MeshShapeMinValues: null,
    MeshShapeMaxValues: null,
    MeshShapeWireTypes: null,
  };

  templateGrid!: AngularGridInstance;
  gridOptions!: GridOption;
  dataset: any;
  selectEditor!: SelectEditor;
  // slicks!: Slick.RowSelectionModelOption;
  templateColumns: Column[] = [];
  order_transport: any;
  lMax: any;
  gOthersProdCode: any;
  gShapeCodeList: any;
  gOthersShapeList: any;
  lProductList: any = '';
  lweighareatemp: any = '';
  lMeshShapeCol: any;

  RoutedFromProcess: boolean = false;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private modalService: NgbModal,
    private toastr: ToastrService, // private gridService: GridService
    private createSharedService: CreateordersharedserviceService,
    private dropdown: CustomerProjectService,
    private processsharedserviceService: ProcessSharedServiceService,
    private location: Location,
    private renderer: Renderer2,
    private reloadService: ReloadService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService,
  ) { }

  OrderStatus: any;
  ordernumber: any;
  tempslcikgridrow: any;
  receivedData: any;
  ngOnInit() {
    this.commonService.changeTitle('CTS Mesh | ODOS');
    debugger;
    debugger;
    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log("this.receivedData", this.receivedData);
    // Set OderSummaryList Data from local Storage and remove item from local Storage.
    let lData: any = localStorage.getItem('ProcessOrderSummaryData');
    lData = JSON.parse(lData);
    if (lData) {
      this.RoutedFromProcess = true;
      this.processsharedserviceService.setOrderSummaryData(lData);
    }
    // localStorage.removeItem('ProcessOrderSummaryData');

    if (this.receivedData) {
      this.CustomerCode = this.receivedData.customer;
      this.ProjectCode = this.receivedData.project;
      // this.JobID = this.receivedData.jobIds.CABJOBID;
      // this.NON_Editable = true;
      this.ScheduledProd = this.receivedData.ScheduledProd;//ADDED
      this.OrderStatus = this.receivedData.orderstatus;
      this.ordernumber = this.receivedData.ordernumber;
      // this.lTransportMode = this.receivedData.Transport;
      this.StructureElement=this.receivedData.StructureElement;
      this.ScheduleProd=this.receivedData.ScheduledProd;
      this.ProductType=this.receivedData.ProductType;
    }
    //this.ordernumber = this.createSharedService.selectedrecord.OrderNumber;
    console.log("this.createSharedService.selectedrecord", this.createSharedService.selectedrecord);
    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.ordernumber = this.createSharedService.selectedrecord.OrderNumber;
      this.ScheduledProd = this.createSharedService.selectedrecord.ScheduledProd;
      // this.JobAdviceData = this.createSharedService.JobAdviceCAB;
      // this.lTransportMode = this.createSharedService.selectedrecord.Transport;
      this.StructureElement=this.createSharedService.selectedrecord.StructureElement;
      this.ScheduleProd=this.createSharedService.selectedrecord.ScheduledProd;
      this.ProductType=this.createSharedService.selectedrecord.Product;
    }
    else {
      this.dropdown.setCustomerCode(this.receivedData.customer);
      let obj: any = [];
      obj.push(this.receivedData.project);
      this.dropdown.setProjectCode(obj);

      let lAddressCodes: any = [];
      if (this.receivedData.AddressCode) {
        lAddressCodes.push(this.receivedData.AddressCode);
      }
      this.dropdown.setAddressList(lAddressCodes);
      
      this.reloadService.reloadCreateOrderCustomerProject.emit();
      this.SetCreateDatainLocal(this.ordernumber);
    }

    if (this.OrderStatus == "Created" || this.OrderStatus == "Created*") {
      this.gridOptions = {
        editable: true,
        enableAutoResize: true,
        enableCellNavigation: true,
        enableColumnReorder: false,
        enableSorting: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 15,
        explicitInitialization: true,
        enableAutoTooltip: true,
        enableRowSelection: true,
        enableAddRow: true,
        enableContextMenu: false,
        rowSelectionOptions: {
          selectActiveRow: true, // Set to true if you want the active row to be selected
        },
        enableCellMenu: false
      };
      // this.ProductDetailsEditable=true;
    }
    else {
      this.gridOptions = {
        editable: false,
        enableAutoResize: true,
        enableCellNavigation: true,
        enableColumnReorder: false,
        enableSorting: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 15,
        explicitInitialization: true,
        enableAutoTooltip: true,
        enableRowSelection: true,
        enableAddRow: true,
        enableContextMenu: false,
        rowSelectionOptions: {
          selectActiveRow: true, // Set to true if you want the active row to be selected
        },
        enableCellMenu: false
      };
      // this.ProductDetailsEditable=false;
    }

    this.getJobId(this.ordernumber);
    // this.columnVisibility['A'] = true;
    // this.columnVisibility['B'] = true;
    // this.columnVisibility['C'] = true;
    // //console.log(this.allColumns);
    // this.visibleparameters();
    //this.getShapeCodeList('0001101154', '0000112393', 'N-Splice');
    // this.GetTableData('0001101200', '0000113013', 14, 1);
    this.sizeList = [10, 13, 16, 20, 25, 28, 32, 40, 50];
    this.getBackButtonText();
    this.getOrderHeadingText();

    //debugger;
    this.getShapeCodeList(
      this.CustomerCode,
      this.ProjectCode,
      this.CouplerType
    );

    this.templateColumns = [
      {
        id: 'id',
        name: 'ID\n序号',
        field: 'id',
        toolTip: 'Serial Number (序列号)',
        minWidth: 30,
        width: 30,
        cssClass: 'left-align',
      },
      {
        id: 'MeshMark',
        name: 'Mark\n编码',
        field: 'MeshMark',
        toolTip: 'Mark (编码)',
        minWidth: 50,
        width: 50,
        editor: { model: Editors.text, maxLength: 20 },
        cssClass: 'left-align',
      },
      {
        id: 'MeshProduct',
        name: 'Product\n产品型号',
        field: 'MeshProduct',
        toolTip: 'Product Code (产品型号)',
        minWidth: 60,
        width: 60,
        editor: {
          model: Editors.autocompleter, // Use AutoCompleter editor
          collectionAsync: this.orderService.getOthersProductCode_ctsmesh(), // Async collection for autocomplete
          editorOptions: {
            minLength: 0, // Start suggesting after typing 2 characters
            forceUserInput: true, // Restrict input to items in the collection
            highlightTerm: true, // Highlight matching text in suggestions

          },
        },
        formatter: (row, cell, value, columnDef, dataContext) => {
          console.log("vL=>", row, cell,value);
          return value?.label ? value?.label : value; // Ensure the selected value displays correctly
        },
        // validator: this.ProductCodeValidator,
        params: {
          isDataFetching: this.getProductCode(),
        },
        cssClass: 'left-align',
      },
      {
        id: 'MeshMainLen',
        name: 'Main Length\n主筋长(mm)',
        field: 'MeshMainLen',
        toolTip: 'Main wire length (主筋长)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.integer },
        validator: this.WireLengthValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshCrossLen',
        name: 'Cross Length\n副筋长(mm)',
        field: 'MeshCrossLen',
        toolTip: 'Cross wire length (副筋长)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.integer },
        validator: this.WireLengthValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshMemberQty',
        name: 'MESH Qty\n件数',
        field: 'MeshMemberQty',
        toolTip: 'Pieces (件数)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.integer },
        validator: this.QtyValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshShapeCode',
        name: 'Shape\n图形码',
        field: 'MeshShapeCode',
        toolTip: 'Shape Code (图形代码)',
        minWidth: 60,
        width: 60,
        editor: {
          model: Editors.autocompleter, // Use AutoCompleter editor
          collectionAsync: this.orderService.getOthersShapeCode_ctsmesh(), // Async collection for autocomplete
          editorOptions: {
            minLength: 0, // Start suggesting after typing 2 characters
            forceUserInput: true, // Restrict input to items in the collection
            highlightTerm: true, // Highlight matching text in suggestions

          },
        },
        formatter: (row, cell, value, columnDef, dataContext) => {
          console.log("vL=>", row, cell,value);
          return value?.label ? value?.label : value; // Ensure the selected value displays correctly
        },
        cssClass: 'left-align',
      },
      {
        id: 'A',
        name: 'A',
        field: 'A',
        toolTip: 'Bending Parameter A (参数 A)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.text },
        validator: this.parameterValidator,
        cssClass: 'left-align',
      },
      {
        id: 'B',
        name: 'B',
        field: 'B',
        toolTip: 'Bending Parameter B (参数 B)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.text },
        validator: this.parameterValidator,
        cssClass: 'left-align',
      },
      {
        id: 'C',
        name: 'C',
        field: 'C',
        toolTip: 'Bending Parameter C (参数 C)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.text },
        validator: this.parameterValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshMO1',
        name: 'MO1\n主筋边1(mm)',
        field: 'MeshMO1',
        toolTip: 'Main wire overhang 1 (主筋边1)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.integer },
        validator: this.OverhangValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshMO2',
        name: 'MO2\n主筋边2(mm)',
        field: 'MeshMO2',
        toolTip: 'Main wire overhang 2 (主筋边2)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.integer },
        validator: this.OverhangValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshCO1',
        name: 'CO1\n副筋边1(mm)',
        field: 'MeshCO1',
        toolTip: 'Cross wire overhang 1 (副筋边1)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.integer },
        validator: this.OverhangValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshCO2',
        name: 'CO2\n副筋边2(mm)',
        field: 'MeshCO2',
        toolTip: 'Cross wire overhang 2 (副筋边2)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.integer },
        validator: this.OverhangValidator,
        cssClass: 'left-align',
      },
      {
        id: 'MeshTotalWT',
        name: 'Weight\n重量(kg)',
        field: 'MeshTotalWT',
        toolTip: 'Total Weight (总重量)',
        minWidth: 60,
        width: 60,
        focusable: false,
        cssClass: 'right-align',
      },
      {
        id: 'MWBOM',
        name: 'Main Wire BOM\n主筋子件',
        field: 'MWBOM',
        toolTip:
          'Main Wire BOM string format (Option) (主筋子件串格式): [No of wire]-[spacing]-[No of wire]-[spacing] e.g. 1-200-5-400-1-200 ',
        minWidth: 60,
        width: 60,
        editor: { model: Editors.integer },
        validator: this.BOMValidator,
        cssClass: 'left-align',
      },
      {
        id: 'CWBOM',
        name: 'Cross Wire BOM\n副筋子件',
        field: 'CWBOM',
        toolTip:
          'Cross Wire BOM string format (Option) (副筋子件串格式): [No of wire]-[spacing]-[No of wire]-[spacing] e.g. 1-200-5-400-1-200',
        minWidth: 60,
        width: 60,
        editor: { model: Editors.integer },
        validator: this.BOMValidator,
        cssClass: 'left-align',
      },
      {
        id: 'Remarks',
        name: 'Remarks\n备注',
        field: 'Remarks',
        toolTip: 'Remarks (备注)',
        minWidth: 60,
        width: 60,
        editor: { model: Editors.text },
        cssClass: 'left-align',
      },
    ];
    // this.gridOptions = {
    //   editable: true,
    //   enableAutoResize: true,
    //   enableCellNavigation: true,
    //   enableColumnReorder: false,
    //   enableSorting: true,
    //   createPreHeaderPanel: true,
    //   showPreHeaderPanel: true,
    //   preHeaderPanelHeight: 15,
    //   explicitInitialization: true,
    //   enableAutoTooltip: true,
    //   enableRowSelection: true,
    //   enableAddRow: true,
    //   enableContextMenu: false,
    //   rowSelectionOptions: {
    //     selectActiveRow: true, // Set to true if you want the active row to be selected
    //   },
    //   enableCellMenu: false
    // };

    this.initAll();
  }
  dataViewCTS: any;
  tempcurrrow: any;
  angularGridReady(event: Event) {
    debugger;
    this.templateGrid = (event as CustomEvent).detail as AngularGridInstance;

    //debugger;
    // this.dataViewCTS =  this.gridService.getDataView();
    this.dataViewCTS = this.templateGrid.slickGrid.getData();

    //  this.templateGrid.slickGrid=new Slick.slickgrid("#CTSMesh", dataViewCTS, columns, options);

    this.templateGrid.slickGrid.registerPlugin(
      new Slick.SlickAutoTooltip({ enableForCells: true })
    );
    //  this.templateGrid.slickGrid.setSelectionModel(new Slick.SlickRowSelectionModel())

    //console.log(this.dataViewCTS);
    // this.dataViewCTS = this.templateGrid.slickGri
    this.templateGrid.slickGrid.onCellChange.subscribe((e, args) => {
      debugger;
      this.gridcellchange(e, args);
    });

    this.templateGrid.slickGrid.onAddNewRow.subscribe((e, args) => {
      debugger;
      this.onAddNewRowData(e, args);
    });

    this.templateGrid.slickGrid.onValidationError.subscribe((e, args) => {
      debugger;
      this.onValidationErrordata(e, args);
    });

    this.templateGrid.slickGrid.onSelectedRowsChanged.subscribe((e, args) => {
      debugger;
      var lShapeCode = args.grid.getData().getAllSelectedItems()[0] ? args.grid.getData().getAllSelectedItems()[0]['MeshShapeCode'] : null;
      if (lShapeCode != null && lShapeCode != '') {
        if (lShapeCode != this.gShapeCode) {
          this.loadShapeInfo(lShapeCode, args.rows[0]);
        }
      }
      //debugger;
      this.gridonSelectedRowsChanged(e, args);
    });

    this.templateGrid.slickGrid.onClick.subscribe((e, args) => {

      this.onclickdata(e, args);
    });

    this.templateGrid.slickGrid.onKeyDown.subscribe((e, args) => {
      debugger;
      //debugger;
      // if(this.addrow==0)
      // {
      //   this.onAddNewRowData(e,args);
      //   this.addrow+=1;
      // }
      this.gridonKeyDown(e, args);
    });
    // this.templateGrid = angularGrid;
    //console.log('angularGrid :', event, this.templateGrid);
    this.templateGrid.slickGrid.onActiveCellChanged.subscribe((e, args) => {
      debugger;
      //debugger;
      this.girdActiveCellsChanged(e, args);
    });
    this.templateGrid.slickGrid.onValidationError.subscribe((e, args) => {
      debugger;
      alert(args.validationResults.msg);
    });
    this.templateGrid.slickGrid.onBeforeEditCell.subscribe(
      (e: any, args: any) => {
        debugger;
        //debugger;
        // this.onAddNewRowData(e, args);
        this.onBPSORDERBeforeEditCell(e, args);

        // this.gridBeforeActiveCellsChanged(e,args);
      }
    );

    // this.templateGrid.slickGrid.onContextMenu.subscribe((e, args) => {
    //   this.grid_onContextMenu(e, args);
    // });

    this.templateGrid.slickGrid.onContextMenu.subscribe((e: any, args: any) => {
      this.rightclick(e, args);
    });
    // this.getShapeCodes();
    // this.getProductCode();
  }
  allColumns: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  columnheader: any = 'A,B,C';
  columnvalues: any;

  columnVisibility: { [key: string]: boolean } = {};

  ngOnDestroy(): void {
    //debugger;
    //console.log('ngOnDestroy called');
    window.addEventListener('beforeunload', async () => {
      // Slick.GlobalEditorLock.commitCurrentEdit();
      //debugger;
      const confirmationMessage =
        'Are you sure you want to leave? Changes you made may not be saved.';

      if (
        this.templateGrid.slickGrid !== null &&
        this.templateGrid.slickGrid.getEditorLock() !== null
      ) {
        this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit();
      }

      if (this.templateGrid.slickGrid.getActiveCell() !== null) {
        const lRow = this.templateGrid.slickGrid.getActiveCell().row;
        await this.SaveCTSDetails(this.templateGrid.slickGrid.getDataItem(lRow));
      }

      this.SaveSummary();
      const userConfirmed = window.confirm(confirmationMessage);
    });
  }

  getJobId(orderNumber: string): any {
    let ProdType=this.ProductType;
    let StructurEelement=this.StructureElement;
    let ScheduleProd=this.ScheduleProd;
    this.orderService.getJobId(orderNumber,ProdType,StructurEelement,ScheduleProd).subscribe({
      next: (response: any) => {
        //console.log('jobid', response);
        //debugger;
        // this.createSharedService.selectedJobIds.StdBarsJobID = response

        if (response.MESHJobID != 0) {
          this.JobID = response.MESHJobID
        }
        else {
          this.JobID = response.PostHeaderID;
        }

        //console.log("job id:", this.JobID);
        // this.getBBS(this.JobID);

      },
      error: () => { },
      complete: () => {
        this.reloadMeshOthersDetails();
        //debugger;

      },
    });
  }

  rightclick(e: any, args: any) {
    e.preventDefault();
    var cell = args.grid.getCellFromEvent(e);
    $('#contextMenu')
      .data('row', cell.row)
      .css('top', e.clientY - 50)
      .css('left', e.clientX - 50)
      .show();

    $("body").one("click", function () {
      $("#contextMenu").hide();
    });
  }

  onContextMenuItemClick(event: Event, args: { command: string; row: number }): void {
    switch (args.command) {
      case 'add':
        // Add logic here
        break;
      case 'edit':
        // Edit logic here
        break;
      case 'delete':
        // Delete logic here
        break;
      case 'copy':
        // Copy logic here
        break;
      case 'paste':
        // Paste logic here
        break;
      default:
        break;
    }
  }

  getBBS(id: number) {
    //debugger;
    // this.StandardBarProductOrderLoading = true;
    this.orderService.getBBS_mesh(this.CustomerCode, this.ProjectCode, id).subscribe({
      next: (response) => {

        // this.StandardbarOrderTempArray = response ? response : [];
        // this.calculateTotalBundleWt();
        //allowGrade500M
      },
      error: (e) => { },
      complete: () => {
        // this.StandardBarProductOrderLoading = false;
        // this.loading = false;
      },
    });

  }

  // goBack(): void {
  //   //console.log(this.location);
  //   //debugger;
  //   this.location.historyGo(-1);
  // }



  goBack() {
    debugger;
    if (!this.RoutedFromProcess) {
      // this.location.back();
      this.router.navigate(['../order/createorder']);
    } else {
      this.router.navigate(['../order/createorder']);
      //[routerLink]="['/order/createorder']"
    }
  }
  async initAll() {
    // if (
    //   (((this.OrderStatus == 'New' || this.OrderStatus == 'Created') &&
    //     this.gOrderCreation == 'Yes') ||
    //     (this.OrderStatus == 'Sent' && this.gOrderSubmission == 'Yes')) &&
    //   this.ScheduledProd != 'Y'
    // ) {
    //   this.templateGrid.slickGrid.setOptions({
    //     editable: true,
    //     autoEdit: true,
    //   });
    // } else {
    //   this.templateGrid.slickGrid.setOptions({
    //     editable: false,
    //     autoEdit: false,
    //   });
    // }

    this.showupperimage = false;

    // var lUserNameA = "@ViewBag.UserName".split("@@");
    //     if (lUserNameA.length == 2 && lUserNameA[1] != null && lUserNameA[1].toLowerCase() == "natsteel.com.sg")
    //     {
    //         this.templateGrid.slickGrid.getColumns()[this.lMeshShapeCol].editor = SelectEditor;
    //     }
    //     else
    //     {
    //         gridCTSMesh.getColumns()[lMeshShapeCol].editor = ImageSelectEditor;
    //     }
    //debugger;
    //  await this.reloadMeshOthersDetails();
  }
  lWT: any;
  data: any = [];

  backjaoyar() {
    debugger;
    if (!this.RoutedFromProcess) {
      this.location.back();
    } else {
      this.router.navigate(['../order/createorder']);
    }
  }
  reloadMeshOthersDetails() {
    var lCustomerCode = this.CustomerCode;
    var lProjectCode = this.ProjectCode;
    // var lJobID = this.JobID;
    var lHook = 0;
    // await this.getJobId(this.ordernumber);

    var lStatus = this.OrderStatus;
    var lScheduledProd = this.ScheduledProd;
    var lPostID = 1;

    var lBBSID = 1;

    if (lScheduledProd == "Y") {
      lPostID = this.JobID;
      if (lCustomerCode != "" && lProjectCode != "" && lPostID > 0) {
        var lBBSID = 1;
        this.orderService
          .getOthersDetailsNSH(lCustomerCode, lProjectCode, lPostID)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);

              // this.bbsOrderTable = response;

              this.data = [];
              if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                  this.CheckParameters(response[i].MeshShapeParameters, this.templateGrid.slickGrid);
                  this.lWT = 0;
                  if (response[i].MeshTotalWT == null) {
                    this.lWT = "";
                  } else {
                    this.lWT = response[i].MeshTotalWT.toFixed(3);
                  }
                  this.data[i] = {
                    CustomerCode: response[i].CustomerCode,
                    ProjectCode: response[i].ProjectCode,
                    JobID: response[i].JobID,
                    BBSID: response[i].BBSID,
                    MeshID: response[i].MeshID,
                    id: i + 1,
                    MeshSort: response[i].MeshSort,
                    MeshMark: response[i].MeshMark,
                    MeshProduct: response[i].MeshProduct,
                    MeshMainLen: response[i].MeshMainLen,
                    MeshCrossLen: response[i].MeshCrossLen,
                    MeshMO1: response[i].MeshMO1,
                    MeshMO2: response[i].MeshMO2,
                    MeshCO1: response[i].MeshCO1,
                    MeshCO2: response[i].MeshCO2,
                    MeshMemberQty: response[i].MeshMemberQty,
                    MeshShapeCode: response[i].MeshShapeCode,
                    A: response[i].A,
                    B: response[i].B,
                    C: response[i].C,
                    D: response[i].D,
                    E: response[i].E,
                    F: response[i].F,
                    G: response[i].G,
                    H: response[i].H,
                    I: response[i].I,
                    J: response[i].J,
                    K: response[i].K,
                    L: response[i].L,
                    M: response[i].M,
                    N: response[i].N,
                    O: response[i].O,
                    P: response[i].P,
                    Q: response[i].Q,
                    R: response[i].R,
                    S: response[i].S,
                    T: response[i].T,
                    U: response[i].U,
                    V: response[i].V,
                    W: response[i].W,
                    X: response[i].X,
                    Y: response[i].Y,
                    Z: response[i].Z,
                    HOOK: response[i].HOOK,
                    MeshTotalWT: this.lWT,
                    MWBOM: "",
                    CWBOM: "",
                    Remarks: response[i].Remarks,
                    MeshShapeParameters: response[i].MeshShapeParameters,
                    MeshEditParameters: response[i].MeshEditParameters,
                    MeshShapeParamTypes: response[i].MeshShapeParamTypes,
                    MeshShapeMinValues: response[i].MeshShapeMinValues,
                    MeshShapeMaxValues: response[i].MeshShapeMaxValues,
                    MeshShapeWireTypes: response[i].MeshShapeWireTypes,
                    MeshCreepMO1: response[i].MeshCreepMO1,
                    MeshCreepCO1: response[i].MeshCreepCO1,
                    ProdMWDia: response[i].ProdMWDia,
                    ProdMWSpacing: response[i].ProdMWSpacing,
                    ProdCWDia: response[i].ProdCWDia,
                    ProdCWSpacing: response[i].ProdCWSpacing,
                    ProdMass: response[i].ProdMass,
                    ProdTwinInd: response[i].ProdTwinInd,
                    shapeCopied: false
                  };
                  if (response[i].HOOK != null) {
                    if (response[i].HOOK > 0) {
                      lHook = lHook + 1;
                    }
                  }
                }
                this.dataViewCTS.beginUpdate();
                this.dataViewCTS.setItems(this.data);
                this.dataViewCTS.endUpdate();
                this.templateGrid.slickGrid.render();
              } else {
                this.dataViewCTS.beginUpdate();
                this.dataViewCTS.setItems(this.data);
                this.dataViewCTS.endUpdate();
              }




              //console.log(this.bbsOrderTable);
              // this.TotalWeight = 0;
              // for (let i = 0; i < this.bbsOrderTable.length; i++) {
              //   this.TotalWeight += this.bbsOrderTable[i].MeshTotalWT;
              // }
            },
            error: (e) => {
              this.toastr.error(
                'Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..'
              );
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              // this.loading = false;
            },
          });
      }
      else {
        this.data = [];
        this.dataViewCTS.beginUpdate();
        this.dataViewCTS.setItems(this.data);
        this.dataViewCTS.endUpdate();
      }
    }
    else {
      if (lCustomerCode != "" && lProjectCode != "" && this.JobID > 0) {
        var lBBSID = 1;
        this.orderService
          .getMeshOtherDetails(lCustomerCode, this.ProjectCode, this.JobID, lBBSID)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);
              this.data = [];
              if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                  this.CheckParameters(response[i].MeshShapeParameters, this.templateGrid.slickGrid);
                  var lWT = 0;
                  if (response[i].MeshTotalWT == null) {
                    this.lWT = "";
                  } else {
                    lWT = response[i].MeshTotalWT.toFixed(3);
                  }
                  this.data[i] = {
                    CustomerCode: response[i].CustomerCode,
                    ProjectCode: response[i].ProjectCode,
                    JobID: response[i].JobID,
                    BBSID: response[i].BBSID,
                    MeshID: response[i].MeshID,
                    id: i + 1,
                    MeshSort: response[i].MeshSort,
                    MeshMark: response[i].MeshMark,
                    MeshProduct: response[i].MeshProduct,
                    MeshMainLen: response[i].MeshMainLen,
                    MeshCrossLen: response[i].MeshCrossLen,
                    MeshMO1: response[i].MeshMO1,
                    MeshMO2: response[i].MeshMO2,
                    MeshCO1: response[i].MeshCO1,
                    MeshCO2: response[i].MeshCO2,
                    MeshMemberQty: response[i].MeshMemberQty,
                    MeshShapeCode: response[i].MeshShapeCode,
                    A: response[i].A,
                    B: response[i].B,
                    C: response[i].C,
                    D: response[i].D,
                    E: response[i].E,
                    F: response[i].F,
                    G: response[i].G,
                    H: response[i].H,
                    I: response[i].I,
                    J: response[i].J,
                    K: response[i].K,
                    L: response[i].L,
                    M: response[i].M,
                    N: response[i].N,
                    O: response[i].O,
                    P: response[i].P,
                    Q: response[i].Q,
                    R: response[i].R,
                    S: response[i].S,
                    T: response[i].T,
                    U: response[i].U,
                    V: response[i].V,
                    W: response[i].W,
                    X: response[i].X,
                    Y: response[i].Y,
                    Z: response[i].Z,
                    HOOK: response[i].HOOK,
                    MeshTotalWT: lWT,
                    MWBOM: response[i].MWBOM,
                    CWBOM: response[i].CWBOM,
                    Remarks: response[i].Remarks,
                    MeshShapeParameters: response[i].MeshShapeParameters,
                    MeshEditParameters: response[i].MeshEditParameters,
                    MeshShapeParamTypes: response[i].MeshShapeParamTypes,
                    MeshShapeMinValues: response[i].MeshShapeMinValues,
                    MeshShapeMaxValues: response[i].MeshShapeMaxValues,
                    MeshShapeWireTypes: response[i].MeshShapeWireTypes,
                    MeshCreepMO1: response[i].MeshCreepMO1,
                    MeshCreepCO1: response[i].MeshCreepCO1,
                    ProdMWDia: response[i].ProdMWDia,
                    ProdMWSpacing: response[i].ProdMWSpacing,
                    ProdCWDia: response[i].ProdCWDia,
                    ProdCWSpacing: response[i].ProdCWSpacing,
                    ProdMass: response[i].ProdMass,
                    ProdTwinInd: response[i].ProdTwinInd,
                    shapeCopied: false
                  };
                  this.data[i].shapeCopied = false;
                  //console.log("for iteration:", this.data[i])
                  if (response[i].HOOK != null) {
                    if (response[i].HOOK > 0) {
                      lHook = lHook + 1;
                    }
                  }

                }
                //console.log("Now checking for copy",this.data);
                this.dataViewCTS.beginUpdate();
                this.dataViewCTS.setItems(this.data);
                this.dataViewCTS.endUpdate();
                this.templateGrid.slickGrid.render();
              } else {
                this.dataViewCTS.beginUpdate();
                this.dataViewCTS.setItems(this.data);
                this.dataViewCTS.endUpdate();
              }
              // this.bbsOrderTable = response;
            },
            error: (e) => {
              this.toastr.error(
                'Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..'
              );
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              // this.loading = false;
            },
          });
      }
      else {
        this.data = [];
        this.dataViewCTS.beginUpdate();
        this.dataViewCTS.setItems(this.data);
        this.dataViewCTS.endUpdate();
      }
    }
    // var colDataBBS = this.templateGrid.slickGrid.getColumns();



  }


  visibleparameters() {
    //debugger;
    const columnNames = this.columnheader.split(',');
    columnNames.forEach(
      (column: string) => (this.columnVisibility[column] = true)
    );
  }
  convertedShapeCodeList: any;
  getShapeCodes() {
    this.convertedShapeCodeList = [];
    this.orderService.getOthersShapeCode_ctsmesh().subscribe({
      next: (response) => {
        //console.log('shapeCodeList', response);
        this.shapeCodeList = response;
        this.gOthersShapeList = this.shapeCodeList;
        // this.shapeCodeList.map((key,value) =>{
        //   //console.log('test',key, value);
        //   this.convertedShapeCodeList.push({
        //     value: key,
        //     label: key
        //   });
        // });

        //console.log('CONVERTED', this.shapeCodeList);
      },
      error: (e) => { },
      complete: () => {
        return this.shapeCodeList;
        // this.loading = false;
      },
    });
    return this.convertedShapeCodeList;
  }
  lMeshID: any;
  getMeshID(pRowIndex: any, pDataView: any) {
    this.lMeshID = pRowIndex;
    for (let i = 0; i < pDataView.getLength(); i++) {
      if (this.lMeshID <= pDataView.getItem(i)['MeshID']) {
        this.lMeshID = pDataView.getItem(i)['MeshID'] + 1;
      }
    }
    return this.lMeshID;
  }

  getBackButtonText(): string {
    if (this.ScheduledProd == 'E') {
      return 'Back to Components List(返回构件列表)';
    } else if (this.ScheduledProd == 'S') {
      return 'Close the Tab(关闭本页面)';
    } else {
      return 'Back to order summary(返回订单汇总)';
    }
  }
  componentName: any = '';
  getOrderHeadingText(): string {
    if (this.ScheduledProd == 'E' || this.ScheduledProd == 'S') {
      return `Cut To Size Mesh Component (加工网片构件) (${this.componentName})`;
    } else {
      return 'Cut To Size Mesh (加工网片)';
    }
  }

  async SaveCTSDetails(lItem: any) {
    debugger;
    //I can currently POST a little more than 5000 rows, anything else and I get a 500 error due
    //do the size of my JSON string.
    let store = {};
    store = lItem;

    let obj: any = {
      CustomerCode: this.CustomerCode || null,
      ProjectCode: this.ProjectCode || null,
      JobID: this.JobID || 0,
      BBSID: this.BBSID || 0,
      MeshID: lItem.MeshID || 0,
      MeshSort: lItem.MeshSort || 0,
      MeshMark: lItem.MeshMark || null,
      MeshProduct: lItem.MeshProduct.value?lItem.MeshProduct.value:lItem.MeshProduct,
      MeshMainLen: lItem.MeshMainLen || 0,
      MeshCrossLen: lItem.MeshCrossLen || 0,
      MeshMO1: lItem.MeshMO1 || 0,
      MeshMO2: lItem.MeshMO2 || 0,
      MeshCO1: lItem.MeshCO1 || 0,
      MeshCO2: lItem.MeshCO2 || 0,
      MeshMemberQty: lItem.MeshMemberQty || 0,
      MeshShapeCode: lItem.MeshShapeCode.value?lItem.MeshShapeCode.value:lItem.MeshShapeCode,
      A: lItem.A || 0,
      B: lItem.B || 0,
      C: lItem.C || 0,
      D: lItem.D || 0,
      E: lItem.E || 0,
      F: lItem.F || 0,
      G: lItem.G || 0,
      H: lItem.H || 0,
      I: lItem.I || 0,
      J: lItem.J || 0,
      K: lItem.K || 0,
      L: lItem.L || 0,
      M: lItem.M || 0,
      N: lItem.N || 0,
      O: lItem.O || 0,
      P: lItem.P || 0,
      Q: lItem.Q || 0,
      R: lItem.R || 0,
      S: lItem.S || 0,
      T: lItem.T || 0,
      U: lItem.U || 0,
      V: lItem.V || 0,
      W: lItem.W || 0,
      X: lItem.X || 0,
      Y: lItem.Y || 0,
      Z: lItem.Z || 0,
      HOOK: lItem.HOOK || 0,
      MeshTotalWT: lItem.MeshTotalWT || 0,
      Remarks: lItem.Remarks || null,
      MWBOM: lItem.MWBOM || null,
      CWBOM: lItem.CWBOM || null,
      UpdateDate: new Date(),
      UpdateBy: 'Vishal',
    };
    //console.log('need to check this:', obj);
    // var lStatus = (<HTMLInputElement>document.getElementById('order_status'))
    //   .value;
    // var lScheduledProd = (<HTMLInputElement>(
    //   document.getElementById('ScheduledProd')
    // )).value;

    if (
      (((this.OrderStatus == 'New' || this.OrderStatus == 'Created' || this.OrderStatus == 'Created*') &&
        this.gOrderCreation == 'Yes') ||
        (this.OrderStatus == 'Sent' && this.gOrderSubmission == 'Yes')) &&
      this.ScheduledProd != 'Y' &&
      lItem != null
    ) {
      if (lItem.JobID > 0 && lItem.BBSID > 0 && lItem.MeshID > 0) {
        //  let obj;
        this.orderService.saveMeshOthersDetails_ctsmesh(obj).subscribe({
          next: (response) => {
            //console.log('CTS Link Mesh Details', response);
          },
          error: (e) => {
            this.toastr.error(
              'Saving data error. Please check the Internet connection and try again.'
            );
          },
          complete: () => {
            // this.loading = false;
          },
        });
        // $.ajax({
        //     url: "@Url.Action("saveMeshOthersDetails")",
        //     type: "POST",
        //     headers: {
        //         "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("saveMeshOthersDetails", "CTSMesh"))
        //                 {@Html.AntiForgeryToken()}').val()
        //     },
        //     data: JSON.stringify(lItem),
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     error: function (response) {
        //         alert("Saving data error. Please check the Internet connection and try again.");
        //     },
        //     success: function (response) {
        //         //barChangeInd[pGridID] = 0;
        //         //alert(response);
        //     }
        // });
      }
    } else {
      return false;
    }
    return true;
  }

  item: any = {};
  async gridonKeyDown(e: any, args: any) {
    this.dataViewCTS = this.templateGrid.slickGrid.getData();
    const activeEditor = this.templateGrid.slickGrid.getCellEditor();

    // Check if the Tab key is pressed
    if (e.key === 'Tab' && activeEditor) {
      if (activeEditor instanceof Editors.autocompleter) {
        const autocompleteList = document.querySelector('.slick-autocomplete') as HTMLElement;

        // Ensure the suggestion list is present and contains items
        if (autocompleteList && autocompleteList.children.length > 0) {
          // Select the first item in the suggestion list
          (autocompleteList.children[0] as HTMLElement).click();
          e.preventDefault(); // Prevent the default Tab behavior (move focus)
        }
      }
    }
    if (e.which == 13) {
      e.preventDefault();
      args.grid.getEditorLock().commitCurrentEdit();
      var lCurrRow = args.grid.getActiveCell().row;
      var lCurrCell = args.grid.getActiveCell().cell;
      var lColumnName = args.grid.getColumns(lCurrRow)[lCurrCell]['id'];

      // if(lColumnName=="MeshMark" && this.addrow==0)
      // {
      //   this.onAddNewRowData(e,args);
      //   this.addrow+=1;
      //   return;
      // }
      // if (lColumnName == "Remarks") {

      //   this.onAddNewRowData(e,args);
      //   this.addrow+=1;
      //   return;

      // }

      //console.log(args.grid);
      if (args.grid.getDataItem(lCurrRow) == null) {
        var lRowIndex = 1;
        if (
          args.grid.getActiveCell().row != null &&
          args.grid.getActiveCell().row >= 0
        ) {
          lRowIndex = args.grid.getActiveCell().row + 1;
        }

        var lCustomerCode = this.CustomerCode;
        var lProjectCode = this.ProjectCode;
        var lOrder = '';
        var lJobID = this.JobID;

        var lMeshID = this.getMeshID(lRowIndex, this.dataViewCTS);
        // this.item = {};
        //debugger;
        this.item = args.grid;
        this.item.CustomerCode = lCustomerCode.toString();
        this.item.ProjectCode = lProjectCode.toString();
        this.item.JobID = lJobID;
        this.item.BBSID = 1;
        this.item.MeshID = lMeshID;
        this.item.MeshSort = lRowIndex * 1000;
        this.item.id = lRowIndex;
        this.item.MeshMemberQty = 1;

        if (lRowIndex > 1) {
          var lBarMark = args.grid.getDataItem(lRowIndex - 2).MeshMark;
          if (
            lBarMark != null &&
            lBarMark != '' &&
            (this.item.MeshMark == null || this.item.MeshMark == '')
          ) {
            var lBarMark1 = lBarMark.replace(/\d+$/, function (n: any) {
              return ++n;
            });
            if (lBarMark1 == lBarMark) {
              lBarMark1 = lBarMark.replace(
                /([a-zA-Z])[^a-zA-Z]*$/,
                function (a: any) {
                  var c = a.charCodeAt(0);
                  switch (c) {
                    case 90:
                      return 'A';
                    case 122:
                      return 'a';
                    default:
                      return String.fromCharCode(++c);
                  }
                }
              );
            }
            this.item.MeshMark = lBarMark1;
          }
          var lBarProd = args.grid.getDataItem(lRowIndex - 2).MeshProduct;
          if (
            lBarProd != null &&
            lBarProd != '' &&
            (this.item.MeshProduct == null || this.item.MeshProduct == '')
          ) {
            this.item.MeshProduct = lBarProd;
          }

          //set default value
          if (
            this.item['MeshMainLen'] == null ||
            this.item['MeshMainLen'] == '' ||
            this.item['MeshMainLen'] == 0
          ) {
            this.item['MeshMainLen'] = 6000;
          }
          if (
            this.item['MeshCrossLen'] == null ||
            this.item['MeshCrossLen'] == '' ||
            this.item['MeshCrossLen'] == 0
          ) {
            this.item['MeshCrossLen'] = 2400;
          }
          if (
            this.item['MeshShapeCode'] == null ||
            this.item['MeshShapeCode'] == ''
          ) {
            this.item['MeshShapeCode'] = {label:'F',value:'F'};
            this.item['A'] = 6000;

            var lProdCode = this.item['MeshProduct'].value ? this.item['MeshProduct'].value : this.item['MeshProduct'];
            if (lProdCode != null && lProdCode != '') {
              if (lProdCode != this.gProdCode) {
                await this.loadProductInfo(lProdCode, lRowIndex - 1);
              }

              this.item.ProdMWDia = this.gProdMWDia;
              this.item.ProdMWSpacing = this.gProdMWSpacing;
              this.item.ProdCWDia = this.gProdCWDia;
              this.item.ProdCWSpacing = this.gProdCWSpacing;
              this.item.ProdMass = this.gProdMass;
              this.item.ProdMinFactor = this.gProdMinFactor;
              this.item.ProdTwinInd = this.gProdTwinInd;

              (<HTMLDivElement>document.getElementById('rt_MWDia')).innerHTML =
                this.gProdMWDia;
              (<HTMLDivElement>document.getElementById('bt_MWDia')).innerHTML =
                this.gProdMWDia;

              if (this.gProdTwinInd == 'M') {
                (<HTMLDivElement>(
                  document.getElementById('rt_MWSpacing')
                )).innerHTML = this.gProdMWSpacing + '(Twin)';
                (<HTMLDivElement>(
                  document.getElementById('bt_MWSpacing')
                )).innerHTML = this.gProdMWSpacing + '(Twin)';
              } else {
                (<HTMLDivElement>(
                  document.getElementById('rt_MWSpacing')
                )).innerHTML = this.gProdMWSpacing;
                (<HTMLDivElement>(
                  document.getElementById('bt_MWSpacing')
                )).innerHTML = this.gProdMWSpacing;
              }

              (<HTMLDivElement>document.getElementById('rt_CWDia')).innerHTML =
                this.gProdCWDia;
              (<HTMLDivElement>document.getElementById('bt_CWDia')).innerHTML =
                this.gProdCWDia;

              (<HTMLDivElement>(
                document.getElementById('rt_CWSpacing')
              )).innerHTML = this.gProdCWSpacing;
              (<HTMLDivElement>(
                document.getElementById('bt_CWSpacing')
              )).innerHTML = this.gProdCWSpacing;

              (<HTMLDivElement>document.getElementById('rt_mass')).innerHTML =
                this.gProdMass;
              (<HTMLDivElement>document.getElementById('bt_mass')).innerHTML =
                this.gProdMass;
            } else {
              (<HTMLDivElement>document.getElementById('rt_MWDia')).innerHTML =
                '';
              (<HTMLDivElement>document.getElementById('bt_MWDia')).innerHTML =
                '';

              (<HTMLDivElement>(
                document.getElementById('rt_MWSpacing')
              )).innerHTML = '';
              (<HTMLDivElement>(
                document.getElementById('bt_MWSpacing')
              )).innerHTML = '';

              (<HTMLDivElement>document.getElementById('rt_CWDia')).innerHTML =
                '';
              (<HTMLDivElement>document.getElementById('bt_CWDia')).innerHTML =
                '';

              (<HTMLDivElement>(
                document.getElementById('rt_CWSpacing')
              )).innerHTML = '';
              (<HTMLDivElement>(
                document.getElementById('bt_CWSpacing')
              )).innerHTML = '';

              (<HTMLDivElement>document.getElementById('rt_mass')).innerHTML =
                '';
              (<HTMLDivElement>document.getElementById('bt_mass')).innerHTML =
                '';
            }

            if (this.item['ProdCWSpacing'] > 0) {
              var lMO1 =
                5 *
                Math.round(
                  (this.item['MeshMainLen'] % this.item['ProdCWSpacing']) / 10
                );
              if (lMO1 < this.item['ProdCWSpacing'] / 2) {
                lMO1 = lMO1 + this.item['ProdCWSpacing'] / 2;
              }
              this.item['MeshMO1'] = lMO1;
              var lRemainder = Math.round(
                this.item['MeshMainLen'] -
                lMO1 -
                Math.floor(
                  (this.item['MeshMainLen'] - lMO1) /
                  this.item['ProdCWSpacing']
                ) *
                this.item['ProdCWSpacing']
              );

              if (lRemainder < this.item['ProdCWSpacing'] / 2) {
                this.item['MeshMO2'] = this.item['ProdCWSpacing'] + lRemainder;
              } else {
                this.item['MeshMO2'] = lRemainder;
              }
            }

            if (this.item['ProdMWSpacing'] > 0) {
              var lCO1 =
                5 *
                Math.round(
                  (this.item['MeshCrossLen'] % this.item['ProdMWSpacing']) / 10
                );
              if (lCO1 < this.item['ProdMWSpacing'] / 2) {
                lCO1 = lCO1 + this.item['ProdMWSpacing'] / 2;
              }
              this.item['MeshCO1'] = lCO1;
              var lRemainder = Math.round(
                this.item['MeshCrossLen'] -
                lCO1 -
                Math.floor(
                  (this.item['MeshCrossLen'] - lCO1) /
                  this.item['ProdMWSpacing']
                ) *
                this.item['ProdMWSpacing']
              );

              if (lRemainder < this.item['ProdMWSpacing'] / 2) {
                this.item['MeshCO2'] = this.item['ProdMWSpacing'] + lRemainder;
              } else {
                this.item['MeshCO2'] = lRemainder;
              }
            }
            this.item['MeshTotalWT'] = this.calWeightOthers(this.item).toFixed(
              3
            );
          }

          this.dataViewCTS.beginUpdate();
          this.dataViewCTS.addItem(this.item);
          this.dataViewCTS.endUpdate();
          args.grid.invalidate();
          args.grid.render();

          this.ChangeInd = this.ChangeInd + 1;
          this.barRowIndex[this.gridIndex] = args.grid.getActiveCell().row;
          this.gPreCellRow = args.grid.getActiveCell().row;
          this.gCurrentRow = args.grid.getActiveCell().row;
        }
        args.grid.navigateRight();
      } else {
        if (lColumnName == 'MeshProduct') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lVar = args.grid.getDataItem(lCurrRow).MeshProduct.value ? args.grid.getDataItem(lCurrRow).MeshProduct.value: args.grid.getDataItem(lCurrRow).MeshProduct;
          if (lVar == null || lVar == '' || lVar == ' ' || lVar == 0) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return false;
          }
        }

        if (lColumnName == 'MeshMainLen') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lVar = args.grid.getDataItem(lCurrRow).MeshMainLen;
          if (lVar == null || lVar == '' || lVar == ' ' || lVar == 0) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return false;
          }
        }

        if (lColumnName == 'MeshCrossLen') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lVar = args.grid.getDataItem(lCurrRow).MeshCrossLen;
          if (lVar == null || lVar == '' || lVar == ' ' || lVar == 0) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return false;
          }
        }

        if (lColumnName == 'MeshMemberQty') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lVar = args.grid.getDataItem(lCurrRow).MeshMemberQty;
          if (lVar == null || lVar == '' || lVar == ' ' || lVar == 0) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return false;
          }
        }

        if (lColumnName == 'MeshShapeCode') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lVar = args.grid.getDataItem(lCurrRow).MeshShapeCode.value ? args.grid.getDataItem(lCurrRow).MeshShapeCode.value: args.grid.getDataItem(lCurrRow).MeshShapeCode;
          if (lVar == null || lVar == '' || lVar == ' ' || lVar == 0) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return false;
          }
        }

        if (lColumnName == 'Remarks') {
          args.grid.getEditorLock().commitCurrentEdit();
          //gridCTSMesh.navigateDown();
          // await this.SaveCTSDetails(
          //   this.templateGrid.slickGrid.getDataItem(lCurrRow)
          // );
          args.grid.setActiveCell(lCurrRow + 1, 1);
        } else {
          args.grid.navigateRight();
        }
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    if ((e.which == 67 || e.which == 99) && e.ctrlKey) {
      this.MeshCopy(args.grid);
    }

    if ((e.which == 86 || e.which == 118) && e.ctrlKey) {
      this.MeshPaste();
    }

    if (e.which != 65 || !e.ctrlKey) {
      return false;
    }

    var rows = [];
    for (let i = 0; i < this.templateGrid.slickGrid.getColumns().length; i++) {
      rows.push(i);
    }

    args.grid.setSelectedRows(rows);
    e.preventDefault();
    return;
  }
  loadsampledata(e: any) { }

  // async MeshPaste() {
  //   if (this.copyCopied == false) {
  //     //alert("Please make items copy before activate the paste function.");
  //     return false;
  //   }
  //   if (this.tempslcikgridrow != null) {
  //     // var lRowIndex = this.templateGrid.slickGrid.getActiveCell().row;
  //     var lRowIndex = this.tempcurrrow;
  //     // var lCustomerCode = document.getElementById("CustomerCode").value;
  //     // var lProjectCode = document.getElementById("ProjectCode").value;
  //     // var lOrder = document.getElementById("JobId").value;
  //     // lJobID = parseInt(lOrder);

  //     var lBBSID = 1;

  //     var lData = this.dataViewCTS.getItems();
  //     for (let i = lData.length - 1; i >= 0; i--) {
  //       var lItem = lData[i];
  //       if (lItem.shapeCopied == true) {
  //         lItem.shapeCopied = false;
  //         this.dataViewCTS.updateItem(lItem.id, lItem);

  //         //Save changes if made before insert another item;

  //         await this.SaveCTSDetails(lItem); //Tab#, Row#

  //         var lMeshID = this.getMeshID(lRowIndex + 1, this.dataViewCTS);

  //         // Set new item
  //         var lMeshSortUp = 0;
  //         if (lRowIndex > 0) {
  //           lMeshSortUp = this.dataViewCTS.getItem(lRowIndex - 1).MeshSort;
  //         }
  //         lMeshSortDown == null;
  //         if (this.dataViewCTS.getItem(lRowIndex) != null) {
  //           var lMeshSortDown = this.dataViewCTS.getItem(lRowIndex).MeshSort;
  //         }

  //         if (lMeshSortUp == null || lMeshSortDown == null) {
  //           var lMeshSort = (this.dataViewCTS.getLength() + 1) * 1000;
  //         } else {
  //           var lMeshSort = (lMeshSortUp + lMeshSortDown) / 2;
  //         }
  //         var lItemNew = {};
  //         if (lBBSID == 1) {
  //           lItemNew = {
  //             CustomerCode: this.CustomerCode,
  //             ProjectCode: this.ProjectCode,
  //             JobID: this.JobID,
  //             BBSID: lBBSID,
  //             MeshID: lMeshID,
  //             MeshSort: lMeshSort,
  //             id: lRowIndex + 1,
  //             MeshMark: lItem.MeshMark,
  //             MeshMainLen: lItem.MeshMainLen,
  //             MeshCrossLen: lItem.MeshCrossLen,
  //             MeshWidth: lItem.MeshWidth,
  //             MeshDepth: lItem.MeshDepth,
  //             MeshSlope: lItem.MeshSlope,
  //             MeshProduct: lItem.MeshProduct,
  //             MeshShapeCode: lItem.MeshShapeCode,
  //             MeshTotalLinks: lItem.MeshTotalLinks,
  //             MeshSpan: lItem.MeshSpan,
  //             MeshMemberQty: lItem.MeshMemberQty,
  //             MeshCapping: lItem.MeshCapping,
  //             MeshCPProduct: lItem.MeshCPProduct,
  //             A: lItem.A,
  //             B: lItem.B,
  //             C: lItem.C,
  //             D: lItem.D,
  //             E: lItem.E,
  //             P: lItem.P,
  //             Q: lItem.Q,
  //             HOOK: lItem.HOOK,
  //             LEG: lItem.LEG,
  //             MeshMO1: lItem.MeshMO1,
  //             MeshMO2: lItem.MeshMO2,
  //             MeshCO1: lItem.MeshCO1,
  //             MeshCO2: lItem.MeshCO2,
  //             MeshTotalWT: lItem.MeshTotalWT,
  //             MWBOM: lItem.MWBOM,
  //             CWBOM: lItem.CWBOM,
  //             Remarks: lItem.Remarks,
  //             MeshShapeParameters: lItem.MeshShapeParameters,
  //             MeshEditParameters: lItem.MeshEditParameters,
  //             MeshShapeParamTypes: lItem.MeshShapeParamTypes,
  //             MeshShapeMinValues: lItem.MeshShapeMinValues,
  //             MeshShapeMaxValues: lItem.MeshShapeMaxValues,
  //             MeshShapeWireTypes: lItem.MeshShapeWireTypes,
  //             MeshCreepMO1: lItem.MeshCreepMO1,
  //             MeshCreepCO1: lItem.MeshCreepCO1,
  //             ProdMWDia: lItem.ProdMWDia,
  //             ProdMWSpacing: lItem.ProdMWSpacing,
  //             ProdCWDia: lItem.ProdCWDia,
  //             ProdCWSpacing: lItem.ProdCWSpacing,
  //             ProdMass: lItem.ProdMass,
  //             ProdMinFactor: lItem.ProdMinFactor,
  //             ProdTwinInd: lItem.ProdTwinInd,
  //             shapeCopied: false,
  //           };
  //         }
  //         this.dataViewCTS.insertItem(lRowIndex, lItemNew);

  //         await this.SaveCTSDetails(lItemNew); //Tab#, Row#
  //         if (i > lRowIndex) {
  //           i = i + 1;
  //         }
  //       }
  //     }

  //     lData = this.dataViewCTS.getItems();
  //     for (let i = lRowIndex + 1; i < lData.length; i++) {
  //       lData[i].id = i + 1;
  //     }
  //     this.dataViewCTS.setItems(lData);

  //     this.templateGrid.slickGrid.invalidate();
  //     this.templateGrid.slickGrid.render();
  //     this.templateGrid.slickGrid.setSelectedRows([lRowIndex]);
  //     this.templateGrid.slickGrid.setActiveCell(lRowIndex, 0);

  //     this.gPreCellRow = lRowIndex;
  //     lData = null;
  //   }
  //   this.copyCopied = false;
  //   this.copyDesSelected = false;
  //   return true;
  // }


  MeshPaste() {
    if (this.copyCopied == false) {
      this.toastr.error("Please make items copy before activate the paste function.");
      return false;
    }
    if (this.templateGrid.slickGrid.getActiveCell() != null) {
      var lRowIndex = this.templateGrid.slickGrid.getActiveCell().row;
      var lCustomerCode = this.CustomerCode;
      var lProjectCode = this.ProjectCode;
      var lOrder = this.ordernumber;
      this.JobID = parseInt(lOrder);


      var lBBSID = 1;

      var lData = this.dataViewCTS.getItems();
      for (var i = lData.length - 1; i >= 0; i--) {
        var lItem = lData[i];
        if (lItem.shapeCopied == true) {
          lItem.shapeCopied = false;
          this.dataViewCTS.updateItem(lItem.id, lItem);

          //Save changes if made before insert another item;

          this.SaveCTSDetails(lItem); //Tab#, Row#

          var lMeshID = this.getMeshID((lRowIndex + 1), this.dataViewCTS);

          // Set new item
          var lMeshSortUp = 0;
          if (lRowIndex > 0) {
            lMeshSortUp = this.dataViewCTS.getItem(lRowIndex - 1).MeshSort;
          }
          lMeshSortDown == null;
          if (this.dataViewCTS.getItem(lRowIndex) != null) {
            var lMeshSortDown = this.dataViewCTS.getItem(lRowIndex).MeshSort;
          }

          if (lMeshSortUp == null || lMeshSortDown == null) {
            var lMeshSort = (this.dataViewCTS.getLength() + 1) * 1000;
          }
          else {
            var lMeshSort = (lMeshSortUp + lMeshSortDown) / 2;
          }
          var lItemNew = {};
          if (lBBSID == 1) {
            lItemNew = {
              CustomerCode: lCustomerCode.toString(),
              ProjectCode: lProjectCode.toString(),
              JobID: this.JobID,
              BBSID: lBBSID,
              MeshID: lMeshID,
              MeshSort: lMeshSort,
              id: lRowIndex + 1,
              MeshMark: lItem.MeshMark,
              MeshMainLen: lItem.MeshMainLen,
              MeshCrossLen: lItem.MeshCrossLen,
              MeshWidth: lItem.MeshWidth,
              MeshDepth: lItem.MeshDepth,
              MeshSlope: lItem.MeshSlope,
              MeshProduct: lItem.MeshProduct.value?lItem.MeshProduct.value:lItem.MeshProduct,
              MeshShapeCode: lItem.MeshShapeCode.value?lItem.MeshShapeCode.value:lItem.MeshShapeCode,
              MeshTotalLinks: lItem.MeshTotalLinks,
              MeshSpan: lItem.MeshSpan,
              MeshMemberQty: lItem.MeshMemberQty,
              MeshCapping: lItem.MeshCapping,
              MeshCPProduct: lItem.MeshCPProduct,
              A: lItem.A,
              B: lItem.B,
              C: lItem.C,
              D: lItem.D,
              E: lItem.E,
              P: lItem.P,
              Q: lItem.Q,
              HOOK: lItem.HOOK,
              LEG: lItem.LEG,
              MeshMO1: lItem.MeshMO1,
              MeshMO2: lItem.MeshMO2,
              MeshCO1: lItem.MeshCO1,
              MeshCO2: lItem.MeshCO2,
              MeshTotalWT: lItem.MeshTotalWT,
              MWBOM: lItem.MWBOM,
              CWBOM: lItem.CWBOM,
              Remarks: lItem.Remarks,
              MeshShapeParameters: lItem.MeshShapeParameters,
              MeshEditParameters: lItem.MeshEditParameters,
              MeshShapeParamTypes: lItem.MeshShapeParamTypes,
              MeshShapeMinValues: lItem.MeshShapeMinValues,
              MeshShapeMaxValues: lItem.MeshShapeMaxValues,
              MeshShapeWireTypes: lItem.MeshShapeWireTypes,
              MeshCreepMO1: lItem.MeshCreepMO1,
              MeshCreepCO1: lItem.MeshCreepCO1,
              ProdMWDia: lItem.ProdMWDia,
              ProdMWSpacing: lItem.ProdMWSpacing,
              ProdCWDia: lItem.ProdCWDia,
              ProdCWSpacing: lItem.ProdCWSpacing,
              ProdMass: lItem.ProdMass,
              ProdMinFactor: lItem.ProdMinFactor,
              ProdTwinInd: lItem.ProdTwinInd,
              shapeCopied: false
            };
          }
          this.dataViewCTS.insertItem(lRowIndex, lItemNew);

          this.SaveCTSDetails(lItemNew); //Tab#, Row#
          if (i > lRowIndex) {
            i = i + 1;
          }
        }
      }

      lData = this.dataViewCTS.getItems();
      for (var i = lRowIndex + 1; i < lData.length; i++) {
        lData[i].id = i + 1;
      }
      this.dataViewCTS.setItems(lData);

      this.templateGrid.slickGrid.invalidate();
      this.templateGrid.slickGrid.render();
      this.templateGrid.slickGrid.setSelectedRows([lRowIndex]);
      this.templateGrid.slickGrid.setActiveCell(lRowIndex, 0);

      this.gPreCellRow = lRowIndex;
      lData = null;
    }
    this.copyCopied = false;
    this.copyDesSelected = false;
    return true;
  }


  MeshCopy2() {
    debugger;
    var lRows = this.templateGrid.slickGrid.getSelectedRows();
    if (lRows.length > 0) {
      this.dataViewCTS.beginUpdate();
      for (var i = 0; i < lRows.length; i++) {
        var lItem = this.templateGrid.slickGrid.getDataItem(lRows[i]);
        lItem.shapeCopied = true;
        this.dataViewCTS.updateItem(lItem.id, lItem);
      }
      this.dataViewCTS.endUpdate();

      this.copyCopied = true;
      this.copyDesSelected = false;

    }
    else {
      alert("Please select items for copy.");
      this.copyCopied = false;
      this.copyDesSelected = false;
    }
  }

  MeshCopy(args: any) {
    // var lRows = args.getSelectedRows();
    let lRows = this.tempslcikgridrow;
    if (lRows != null) {
      lRows.length = 1;
    }
    if (lRows.length > 0) {
      this.dataViewCTS.beginUpdate();
      for (let i = 0; i < lRows.length; i++) {
        let lItem = args.getDataItem(this.tempcurrrow);
        lItem.shapeCopied = true;
        this.dataViewCTS.updateItem(lItem.id, lItem);
      }
      this.dataViewCTS.endUpdate();

      this.copyCopied = true;
      this.copyDesSelected = false;
    } else {
      alert('Please select items for copy.');
      this.copyCopied = false;
      this.copyDesSelected = false;
    }
  }

  async gridonSelectedRowsChanged(e: any, args: any) {
    //debugger;
    if (args.rows.length > 0) {
      //console.log('we are here to save the data');
      if (args.rows[0] != this.gCurrentRow) {
        await this.SaveCTSDetails(args.grid.getDataItem(this.gCurrentRow)); //Tab#, Row#
        this.RowValidation(this.gCurrentRow);
      }
      this.gCurrentRow = args.rows[0];
      this.gPreCellRow = args.rows[0];

      args.grid.focus();
      //debugger;

      if (args.grid.getOptions().editable == true) {
        args.grid.editActiveCell();
      }
    }
  }

  SaveSummary() {
    let lCustomerCode = this.CustomerCode;
    let lProjectCode = this.ProjectCode;
    let lJobID = this.JobID;

    let lStatus = this.OrderStatus;
    let lScheduledProd = this.ScheduledProd;

    if (
      (((lStatus == 'New' || lStatus == 'Created' || lStatus == "Created*") &&
        this.gOrderCreation == 'Yes') ||
        (lStatus == 'Sent' && this.gOrderSubmission == 'Yes')) &&
      lScheduledProd != 'Y' &&
      lCustomerCode != null &&
      lProjectCode != null &&
      lJobID != null
    ) {
      this.orderService
        .UpdateSUM_ctsmesh(this.CustomerCode, this.ProjectCode, this.JobID)
        .subscribe({
          next: (response) => {
            //console.log('CTS Link Mesh Details', response);
          },
          error: (e) => {
            this.toastr.error(
              'Save beam data error. Please check the internet connection.'
            );
            // alert("Save beam data error. Please check the internet connection.");
          },
          complete: () => {
            // this.loading = false;
          },
        });
      // $.ajax({
      //     url: "@Url.Action("UpdateSUM")",
      //     type: "POST",
      //     headers: {
      //         "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("UpdateSUM", "CTSMesh"))
      //                     {@Html.AntiForgeryToken()}').val()
      //     },
      //     data: JSON.stringify({
      //         CustomerCode: lCustomerCode,
      //         ProjectCode: lProjectCode,
      //         JobID: lJobID
      //     }),
      //     contentType: "application/json; charset=utf-8",
      //     dataType: "json",
      //     error: function (response) {
      //         alert("Save beam data error. Please check the internet connection.");
      //     },
      //     success: function (response) {
      //     }
      // });
    }
  }

  // SaveCTSDetails(lItem: any) {
  //   //I can currently POST a little more than 5000 rows, anything else and I get a 500 error due
  //   //do the size of my JSON string.

  //   var lStatus = "New";
  //   // (<HTMLInputElement>document.getElementById("order_status")).value;
  //   var lScheduledProd = this.ScheduledProd;
  //   // (<HTMLInputElement>document.getElementById("ScheduledProd")).value;

  //   if ((((lStatus == "New" || lStatus == "Created") && this.gOrderCreation == "Yes") ||
  //   (lStatus == "Sent" && this.gOrderSubmission == "Yes")) && lScheduledProd != "Y" && lItem != null) {

  //       if (lItem.JobID > 0 && lItem.BBSID > 0 && lItem.MeshID > 0) {
  //           // $.ajax({
  //           //     url: "@Url.Action("saveMeshOthersDetails")",
  //           //     type: "POST",
  //           //     headers: {
  //           //         "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("saveMeshOthersDetails", "CTSMesh"))
  //           //                 {@Html.AntiForgeryToken()}').val()
  //           //     },
  //           //     data: JSON.stringify(lItem),
  //           //     contentType: "application/json; charset=utf-8",
  //           //     dataType: "json",
  //           //     error: function (response) {
  //           //         alert("Saving data error. Please check the Internet connection and try again.");
  //           //     },
  //           //     success: function (response) {
  //           //         //barChangeInd[pGridID] = 0;
  //           //         //alert(response);
  //           //     }
  //           // });
  //       }
  //   }
  //   else {
  //       return false;
  //   }
  //   return true;
  // }

  lClass: any;
  RowValidation(pItemNo: any) {
    var lItem = this.templateGrid.slickGrid.getDataItem(pItemNo);
    if (lItem != null) {
      this.lClass = {};
      this.lClass[pItemNo] = {};

      var lProdCode = lItem.MeshProduct.value?lItem.MeshProduct.value:lItem.MeshProduct;
      var lShape = lItem.MeshShapeCode.value?lItem.MeshShapeCode.value:lItem.MeshShapeCode;
      var lQty = lItem.MeshMemberQty;
      if (
        (lShape == null || lShape.trim() == '') &&
        (lProdCode == null || lProdCode == '' || lProdCode == ' ')
      ) {
        return true;
      }

      if (lShape == null || (lShape != null && lShape.trim() == '')) {
        this.lClass[pItemNo]['MeshShapeCode'] = 'highlighted';
        //alert("Invalid product code on MESH products.\n\n"
        //    + "请检查产品型号.");
        //return false;
      }
      //lProdCode=lProdCode.value;
      if (lProdCode == null || (lProdCode != null && lProdCode.trim() == '')) {
        this.lClass[pItemNo]['MeshProduct'] = 'highlighted';
        //alert("Invalid shape code.\n\n"
        //    + "请检查图形码.");
        //return false;
      }
      if (
        lProdCode != null &&
        lProdCode.trim() != '' &&
        (lQty == null || lQty == '' || lQty == 0)
      ) {
        this.lClass[pItemNo]['MeshMemberQty'] = 'highlighted';
        //alert("Invalid MESH Qty.\n\n"
        //    + "请检查件数.");
        //return false;
      }
      if (
        lShape != null &&
        lShape.trim() != '' &&
        (lItem.MeshMainLen == null ||
          lItem.MeshMainLen == '' ||
          lItem.MeshMainLen == 0 ||
          lItem.MeshMainLen > 7000)
      ) {
        this.lClass[pItemNo]['MeshMemberQty'] = 'highlighted';
        //alert("Invalid Main Wire Length value.\n\n"
        //    + "请检铁网的主筋长度.");
        //return false;
      }
      if (
        lShape != null &&
        lShape.trim() != '' &&
        (lItem.MeshCrossLen == null ||
          lItem.MeshCrossLen == '' ||
          lItem.MeshCrossLen == 0 ||
          lItem.MeshCrossLen > 7000)
      ) {
        this.lClass[pItemNo]['MeshMemberQty'] = 'highlighted';
        //alert("Invalid Cross Wire Length value.\n\n"
        //    + "请检铁网的副筋长度.");
        //return false;
      }

      if (
        lShape != null &&
        lShape.trim() != '' &&
        lItem.MeshCrossLen > this.getMeshSLabMaxlength('C', lItem) &&
        lItem.MeshMainLen > this.getMeshSLabMaxlength('M', lItem)
      ) {
        this.lClass[pItemNo]['MeshMemberQty'] = 'highlighted';
        //alert("Invalid Cross Wire Length value. It should be not more than " + getMeshSLabMaxlength("M", lItem) + " x " + getMeshSLabMaxlength("C", lItem) + ".\n\n"
        //    + "请检查铁网的副筋长度.");
        //return false;
      }

      if (
        lShape != null &&
        lShape.trim() != '' &&
        (lItem.MeshMO1 == null || lItem.MeshMO1 == '' || lItem.MeshMO1 == 0)
      ) {
        this.lClass[pItemNo]['MeshMO1'] = 'highlighted';
        //alert("Invalid Main Wire Overhang1 value.\n\n"
        //    + "请检查铁网的主筋边长1.");
        //return false;
      }
      if (
        lShape != null &&
        lShape.trim() != '' &&
        (lItem.MeshMO2 == null || lItem.MeshMO2 == '' || lItem.MeshMO2 == 0)
      ) {
        this.lClass[pItemNo]['MeshMO2'] = 'highlighted';
        //alert("Invalid Main Wire Overhang2 value.\n\n"
        //    + "请检查铁网的主筋边长2.");
        //return false;
      }
      if (
        lShape != null &&
        lShape.trim() != '' &&
        (lItem.MeshCO1 == null || lItem.MeshCO1 == '' || lItem.MeshCO1 == 0)
      ) {
        this.lClass[pItemNo]['MeshCO1'] = 'highlighted';
        //alert("Invalid Cross Wire Overhang1 value.\n\n"
        //    + "请检查铁网的副筋边长1.");
        //return false;
      }
      if (
        lShape != null &&
        lShape.trim() != '' &&
        (lItem.MeshCO2 == null || lItem.MeshCO2 == '' || lItem.MeshCO2 == 0)
      ) {
        this.lClass[pItemNo]['MeshCO2'] = 'highlighted';
        //alert("Invalid Cross Wire Overhang2 value.\n\n"
        //    + "请检查铁网的副筋边长2.");
        //return false;
      }

      //check MO/CO/Single wire
      if (
        lItem['MeshMainLen'] - lItem['MeshMO1'] - lItem['MeshMO2'] <
        lItem['ProdCWSpacing']
      ) {
        this.lClass[pItemNo]['MeshMainLen'] = 'highlighted';
        //alert("Please check main wire length, MO1 or MO2 as only one cross wire left.\n\n"
        //    + "主边太长, 只剩一根副筋.");
        //return false;
      }
      //check MO/CO/Single wire
      if (
        lItem['MeshCrossLen'] - lItem['MeshCO1'] - lItem['MeshCO2'] <
        lItem['ProdMWSpacing']
      ) {
        this.lClass[pItemNo]['MeshCrossLen'] = 'highlighted';
        //alert("Please check corss wire length, MO1 or MO2 as only one main wire left.\n\n"
        //    + "副边太长, 只剩一根主筋.");
        //return false;
      }

      if (lItem['MeshMO1'] > 1200 && lItem['MeshMO2'] > 1200) {
        this.lClass[pItemNo]['MeshMO1'] = 'highlighted';
        this.lClass[pItemNo]['MeshMO2'] = 'highlighted';
        //alert("Both main wire onverhang cannot be greater than 1200.\n\n"
        //    + "(两个主边长不可同时大于1200.");
        //return false;
      }
      if (lItem['MeshMO1'] > 1800) {
        this.lClass[pItemNo]['MeshMO1'] = 'highlighted';
        //alert("Main wire onverhang cannot be greater than 1800.\n\n"
        //    + "(主边长不可大于1800.");
        //return false;
      }
      if (lItem['MeshMO2'] > 1800) {
        this.lClass[pItemNo]['MeshMO2'] = 'highlighted';
        //alert("Main wire onverhang cannot be greater than 1800.\n\n"
        //    + "(主边长不可大于1800.");
        //return false;
      }
      if (lItem['MeshMO1'] < 20) {
        this.lClass[pItemNo]['MeshMO1'] = 'highlighted';
        //alert("Main wire onverhang cannot be less than 20.\n\n"
        //    + "(主边长不可小于50.");
        //return false;
      }
      if (lItem['MeshMO2'] < 20) {
        this.lClass[pItemNo]['MeshMO2'] = 'highlighted';
        //alert("Main wire onverhang cannot be less than 20.\n\n"
        //    + "(主边长不可小于50.");
        //return false;
      }

      if (
        (lItem.MeshMainLen - lItem.MeshMO2 - lItem.MeshMO1) %
        lItem.ProdCWSpacing !=
        0
      ) {
        this.lClass[pItemNo]['MeshMO2'] = 'highlighted';
        //alert("Invalid main wire overhang value\n\n"
        //    + "(输入无效的主筋边.");
        //return false;
      }

      if (lItem['MeshCO1'] > 1000) {
        this.lClass[pItemNo]['MeshCO1'] = 'highlighted';
        //alert("Cross wire onverhang cannot be greater than 1000.\n\n"
        //    + "(副筋边长最长不可大于1000.");
        //return false;
      }
      if (lItem['MeshCO2'] > 1000) {
        this.lClass[pItemNo]['MeshCO2'] = 'highlighted';
        //alert("Cross wire onverhang cannot be greater than 1000.\n\n"
        //    + "(副筋边长最长不可大于1000.");
        //return false;
      }
      if (lItem['MeshCO1'] < 20) {
        this.lClass[pItemNo]['MeshCO1'] = 'highlighted';
        //alert("Cross wire onverhang cannot be less than 50.\n\n"
        //    + "(副筋边长最短不可小于20.");
        //return false;
      }
      if (lItem['MeshCO2'] < 20) {
        this.lClass[pItemNo]['MeshCO2'] = 'highlighted';
        //alert("Cross wire onverhang cannot be less than 50.\n\n"
        //    + "(副筋边长最短不可小于20.");
        //return false;
      }

      if (
        (lItem.MeshCrossLen - lItem.MeshCO2 - lItem.MeshCO1) %
        lItem.ProdMWSpacing !=
        0
      ) {
        this.lClass[pItemNo]['MeshCO2'] = 'highlighted';
        //alert("Invalid cross wire overhang value.\n\n"
        //    + "(输入无效的副筋边.");
        //return false;
      }

      var lParameters = lItem.MeshEditParameters;
      if (
        lShape != null &&
        lShape.trim() != '' &&
        lParameters != null &&
        lParameters != ''
      ) {
        var lParaA = lParameters.split(',');
        for (let m = 0; m < lParaA.length; m++) {
          if (
            lItem[lParaA[m]] == null ||
            lItem[lParaA[m]] == '' ||
            lItem[lParaA[m]] == ' '
          ) {
            this.lClass[pItemNo][lParaA[m]] = 'highlighted';
            //alert("Invalid shape parameter found for shape code " + lShape + " parameter " + lParaA[m] + ".\n\n"
            //    + "请检查图形码" + lShape + ", 参数" + lParaA[k] + "的数值.");
            //return false;
          }
          if (lItem[lParaA[m]] <= 0) {
            this.lClass[pItemNo][lParaA[m]] = 'highlighted';
            //alert("Invalid shape parameter found for shape code " + lShape + " parameter " + lParaA[k] + ".\n\n"
            //    + "请检查图形码" + lShape + ", 参数" + lParaA[k] + "的数值.");
            //return false;
          }
        }
      }
      if (
        lShape != null &&
        lShape.trim() != '' &&
        lParameters != null &&
        lParameters != ''
      ) {
        var lParaA = lParameters.split(',');
        var lParaTypeA = lItem.MeshShapeParamTypes.split(',');
        var lWireTypeA = lItem.MeshShapeWireTypes.split(',');
        var lTotalMainLen = 0;
        var lTotalCrossLen = 0;
        for (let m = 0; m < lParaA.length; m++) {
          if (
            (lParaTypeA[m] == 'S' || lParaTypeA[m] == 'HK') &&
            lWireTypeA[m] == 'M'
          ) {
            if (lItem[lParaA[m]] != null) {
              if (lItem[lParaA[m]] > 0) {
                lTotalMainLen = lTotalMainLen + parseInt(lItem[lParaA[m]]);
              }
            }
          }

          if (
            (lParaTypeA[m] == 'S' || lParaTypeA[m] == 'HK') &&
            lWireTypeA[m] == 'C'
          ) {
            if (lItem[lParaA[m]] != null) {
              if (lItem[lParaA[m]] > 0) {
                lTotalCrossLen = lTotalCrossLen + parseInt(lItem[lParaA[m]]);
              }
            }
          }
        }
        if (lTotalMainLen > 0 && lTotalMainLen != lItem.MeshMainLen) {
          this.lClass[pItemNo]['MeshMainLen'] = 'highlighted';
          //alert("Invalid shape parameter found for shape code " + lShape + ". The total values of main wire bending parameters is not equal to main wire length.\n\n"
          //    + "请检查图形码" + lShape + ", 主筋的参数总值不等于主筋的长度.");
          //return false;
        }
        if (lTotalCrossLen > 0 && lTotalCrossLen != lItem.MeshCrossLen) {
          this.lClass[pItemNo]['MeshCrossLen'] = 'highlighted';
          //alert("Invalid shape parameter found for shape code " + lShape + ". The total values of cross wire bending parameters is not equal to cross wire length.\n\n"
          //    + "请检查图形码" + lShape + ", 副筋的参数总值不等于副筋的长度.");
          //return false;
        }

        //bending check
        //disable the checking on 2018-01-12 - requested AO
        //var lTotalMainLen = 0;
        //var lTotalCrossLen = 0;
        //var lBendLimit = 50;
        //var lCrossSpace = lItem["ProdCWSpacing"];
        //var lMainSpace = lItem["ProdMWSpacing"];
        //if (lItem["MeshCreepMO1"] == null || lItem["MeshCreepMO1"] == false) {
        //    for (m = 0; m < lParaA.length; m++) {
        //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "M") {
        //            if (lItem[lParaA[m]] != null) {
        //                if (lItem[lParaA[m]] > 0) {
        //                    lTotalMainLen = lTotalMainLen + parseInt(lItem[lParaA[m]]);
        //                    if (lTotalMainLen > (lItem["MeshMO1"] - lBendLimit) && lTotalMainLen < (lItem["MeshMainLen"] - lItem["MeshMO2"] + lBendLimit)) {
        //                        if ((lTotalMainLen - lItem["MeshMO1"]) % lCrossSpace < lBendLimit) {
        //                            alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                            return false;
        //                        } else {
        //                            if ((lCrossSpace - (lTotalMainLen - lItem["MeshMO1"]) % lCrossSpace) < lBendLimit) {
        //                                alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                    + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                                return false;
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //} else {
        //    for (m = 0; m < lParaA.length; m++) {
        //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "M") {
        //            if (lItem[lParaA[m]] != null) {
        //                if (lItem[lParaA[m]] > 0) {
        //                    lTotalMainLen = lTotalMainLen + parseInt(lItem[lParaA[m]]);
        //                    if (lTotalMainLen > (lItem["MeshMO2"] - lBendLimit) && lTotalMainLen < (lItem["MeshMainLen"] - lItem["MeshMO1"] + lBendLimit)) {
        //                        if ((lTotalMainLen - lItem["MeshMO2"]) % lCrossSpace < lBendLimit) {
        //                            alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                            return false;
        //                        } else {
        //                            if ((lCrossSpace - (lTotalMainLen - lItem["MeshMO2"]) % lCrossSpace) < lBendLimit) {
        //                                alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                    + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                                return false;
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}
        //if (lItem["MeshCreepCO1"] == null || lItem["MeshCreepCO1"] == false) {
        //    for (m = 0; m < lParaA.length; m++) {
        //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "C") {
        //            if (lItem[lParaA[m]] != null) {
        //                if (lItem[lParaA[m]] > 0) {
        //                    lTotalCrossLen = lTotalCrossLen + parseInt(lItem[lParaA[m]]);
        //                    if (lTotalCrossLen > (lItem["MeshCO1"] - lBendLimit) && lTotalCrossLen < (lItem["MeshCrossLen"] - lItem["MeshCO2"] + lBendLimit)) {
        //                        if ((lTotalCrossLen - lItem["MeshCO1"]) % lMainSpace < lBendLimit) {
        //                            alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                            return false;
        //                        } else {
        //                            if ((lMainSpace - (lTotalCrossLen - lItem["MeshCO1"]) % lMainSpace) < lBendLimit) {
        //                                alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                    + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                                return false;
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //} else {
        //    for (m = 0; m < lParaA.length; m++) {
        //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "C") {
        //            if (lItem[lParaA[m]] != null) {
        //                if (lItem[lParaA[m]] > 0) {
        //                    lTotalCrossLen = lTotalCrossLen + parseInt(lItem[lParaA[m]]);
        //                    if (lTotalCrossLen > (lItem["MeshCO2"] - lBendLimit) && lTotalCrossLen < (lItem["MeshCrossLen"] - lItem["MeshCO1"] + lBendLimit)) {
        //                        if ((lTotalCrossLen - lItem["MeshCO2"]) % lMainSpace < lBendLimit) {
        //                            alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                            return false;
        //                        } else {
        //                            if ((lMainSpace - (lTotalCrossLen - lItem["MeshCO2"]) % lMainSpace) < lBendLimit) {
        //                                alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
        //                                    + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
        //                                return false;
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}
        //end of ending check
      }

      this.templateGrid.slickGrid.setCellCssStyles(
        'error_highlight',
        this.lClass
      );
    }
    return true;
  }

  isInvalidParameterCell(pShapeCode: any, pColumnName: any, pParameters: any) {
    var lReturn = false;
    // added "," to different with LEG and HOOK
    if (pShapeCode != null && pShapeCode != '' && pParameters != null) {
      if (
        (pColumnName == 'A' && pParameters.indexOf('A') < 0) ||
        (pColumnName == 'B' && pParameters.indexOf('B') < 0) ||
        (pColumnName == 'C' && pParameters.indexOf('C') < 0) ||
        (pColumnName == 'D' && pParameters.indexOf('D') < 0) ||
        (pColumnName == 'E' && pParameters.indexOf(',E') < 0) ||
        (pColumnName == 'F' && pParameters.indexOf('F') < 0) ||
        (pColumnName == 'G' && pParameters.indexOf(',G') < 0) ||
        (pColumnName == 'H' && pParameters.indexOf(',H') < 0) ||
        (pColumnName == 'I' && pParameters.indexOf('I') < 0) ||
        (pColumnName == 'J' && pParameters.indexOf('J') < 0) ||
        (pColumnName == 'K' && pParameters.indexOf(',K') < 0) ||
        (pColumnName == 'L' && pParameters.indexOf(',L') < 0) ||
        (pColumnName == 'M' && pParameters.indexOf('M') < 0) ||
        (pColumnName == 'N' && pParameters.indexOf('N') < 0) ||
        (pColumnName == 'O' && pParameters.indexOf(',O') < 0) ||
        (pColumnName == 'P' && pParameters.indexOf('P') < 0) ||
        (pColumnName == 'Q' && pParameters.indexOf('Q') < 0) ||
        (pColumnName == 'R' && pParameters.indexOf('R') < 0) ||
        (pColumnName == 'S' && pParameters.indexOf('S') < 0) ||
        (pColumnName == 'T' && pParameters.indexOf('T') < 0) ||
        (pColumnName == 'U' && pParameters.indexOf('U') < 0) ||
        (pColumnName == 'V' && pParameters.indexOf('V') < 0) ||
        (pColumnName == 'W' && pParameters.indexOf('W') < 0) ||
        (pColumnName == 'X' && pParameters.indexOf('X') < 0) ||
        (pColumnName == 'Y' && pParameters.indexOf('Y') < 0) ||
        (pColumnName == 'LEG' && pParameters.indexOf('LEG') < 0) ||
        (pColumnName == 'HOOK' && pParameters.indexOf('HOOK') < 0) ||
        (pColumnName == 'Z' && pParameters.indexOf('Z') < 0)
      ) {
        lReturn = true;
      }
    }
    return lReturn;
  }

  girdActiveCellsChanged = (e: any, args: any) => {
    if (args.grid.getDataItem(args.row) != null) {
      var lProductCode = args.grid.getDataItem(args.row).MeshProduct;
      if (lProductCode != null && lProductCode != '') {
        (<HTMLDivElement>document.getElementById('rt_MWDia')).innerHTML =
          args.grid.getDataItem(args.row).ProdMWDia;
        (<HTMLDivElement>document.getElementById('bt_MWDia')).innerHTML =
          args.grid.getDataItem(args.row).ProdMWDia;

        if (args.grid.getDataItem(args.row).ProdTwinInd == 'M') {
          (<HTMLDivElement>document.getElementById('rt_MWSpacing')).innerHTML =
            args.grid.getDataItem(args.row).ProdMWSpacing + '(Twin)';
          (<HTMLDivElement>document.getElementById('bt_MWSpacing')).innerHTML =
            args.grid.getDataItem(args.row).ProdMWSpacing + '(Twin)';
        } else {
          (<HTMLDivElement>document.getElementById('rt_MWSpacing')).innerHTML =
            args.grid.getDataItem(args.row).ProdMWSpacing;
          (<HTMLDivElement>document.getElementById('bt_MWSpacing')).innerHTML =
            args.grid.getDataItem(args.row).ProdMWSpacing;
        }

        (<HTMLDivElement>document.getElementById('rt_CWDia')).innerHTML =
          args.grid.getDataItem(args.row).ProdCWDia;
        (<HTMLDivElement>document.getElementById('bt_CWDia')).innerHTML =
          args.grid.getDataItem(args.row).ProdCWDia;

        (<HTMLDivElement>document.getElementById('rt_CWSpacing')).innerHTML =
          args.grid.getDataItem(args.row).ProdCWSpacing;
        (<HTMLDivElement>document.getElementById('bt_CWSpacing')).innerHTML =
          args.grid.getDataItem(args.row).ProdCWSpacing;

        (<HTMLDivElement>document.getElementById('rt_mass')).innerHTML =
          args.grid.getDataItem(args.row).ProdMass;
        (<HTMLDivElement>document.getElementById('bt_mass')).innerHTML =
          args.grid.getDataItem(args.row).ProdMass;

        this.refreshInfo(args);
      } else {
        (<HTMLDivElement>document.getElementById('rt_MWDia')).innerHTML = '';
        (<HTMLDivElement>document.getElementById('bt_MWDia')).innerHTML = '';

        (<HTMLDivElement>document.getElementById('rt_MWSpacing')).innerHTML =
          '';
        (<HTMLDivElement>document.getElementById('bt_MWSpacing')).innerHTML =
          '';

        (<HTMLDivElement>document.getElementById('rt_CWDia')).innerHTML = '';
        (<HTMLDivElement>document.getElementById('bt_CWDia')).innerHTML = '';

        (<HTMLDivElement>document.getElementById('rt_CWSpacing')).innerHTML =
          '';
        (<HTMLDivElement>document.getElementById('bt_CWSpacing')).innerHTML =
          '';

        (<HTMLDivElement>document.getElementById('rt_mass')).innerHTML = '';
        (<HTMLDivElement>document.getElementById('bt_mass')).innerHTML = '';
        (<HTMLDivElement>document.getElementById('total_weight')).innerHTML =
          '';
        (<HTMLDivElement>document.getElementById('bt_total_weight')).innerHTML =
          '';
      }
      var lShapeCode = args.grid.getDataItem(args.row).MeshShapeCode.value ? args.grid.getDataItem(args.row).MeshShapeCode.value : args.grid.getDataItem(args.row).MeshShapeCode;
      if (lShapeCode != null && lShapeCode != '') {
        if (lShapeCode != this.gShapeCode) {
          this.loadShapeInfo(lShapeCode, args.row);
        } else {
          this.CheckParameters(this.gShapeParameters, args.grid);
          // $('#rightShapeImage').show();
          this.showupperimage = true;
          // $('#btmShapeImage').show();
        }
      } else {
        // $('#rightShapeImage').hide();
        // $('#btmShapeImage').hide();
        this.showupperimage = false;
      }

      //Set non-Focusable column
      var lPara = args.grid.getDataItem(args.row).MeshEditParameters;
      var lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];
      if (lColumnName.length == 1 && lColumnName >= 'A' && lColumnName <= 'Z') {
        if (
          lShapeCode == 'F' ||
          this.isInvalidParameterCell(lShapeCode, lColumnName, lPara)
        ) {
          if (args.cell < this.gPreCellCol) {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            args.grid.navigateLeft();
          } else {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            args.grid.navigateRight();
          }
          return true;
        } else {
          this.gPreCellRow = args.row;
          this.gPreCellCol = args.cell;
        }
      } else {
        this.gPreCellRow = args.row;
        this.gPreCellCol = args.cell;
      }
    } else {
      this.gPreCellRow = args.row;
      this.gPreCellCol = args.cell;
      this.showupperimage = false;
      // $('#rightShapeImage').hide();
      // $('#btmShapeImage').hide();

      // (<HTMLDivElement>document.getElementById('rt_MWDia')).innerHTML = '';
      // (<HTMLDivElement>document.getElementById('bt_MWDia')).innerHTML = '';

      // (<HTMLDivElement>document.getElementById('rt_MWSpacing')).innerHTML = '';
      // (<HTMLDivElement>document.getElementById('bt_MWSpacing')).innerHTML = '';

      // (<HTMLDivElement>document.getElementById('rt_CWDia')).innerHTML = '';
      // (<HTMLDivElement>document.getElementById('bt_CWDia')).innerHTML = '';

      // (<HTMLDivElement>document.getElementById('rt_CWSpacing')).innerHTML = '';
      // (<HTMLDivElement>document.getElementById('bt_CWSpacing')).innerHTML = '';

      // (<HTMLDivElement>document.getElementById('rt_mass')).innerHTML = '';
      // (<HTMLDivElement>document.getElementById('bt_mass')).innerHTML = '';
    }

    ////try dropdown picture list
    //if (args.grid.getColumns(args.row)[args.cell] != null) {
    //    var lColumnName = args.grid.getColumns(args.row)[args.cell]["id"];
    //    if (lColumnName == "MeshShapeCode" && args.grid.getDataItem(args.row) != null) {
    //        var lBBSID = args.grid.getDataItem(args.row).BBSID;
    //        if (lBBSID == 1) {
    //            args.grid.getColumns()[args.cell].editor = ImageSelectEditor;
    //        }
    //        else {
    //            args.grid.getColumns()[args.cell].editor = SelectEditor;
    //        }
    //    }
    //}

    args.grid.focus();
    //debugger;
    const gridOptions = args.grid.getOptions();
    //console.log('Gridoptions:', gridOptions);
    //console.log(args.grid.getOptions().editable);
    if (args.grid.getOptions().editable == true) {
      //console.log('inside');
      //console.log(args.grid);
      args.grid.editActiveCell();
      //console.log('outside');
    }
    return true;
  };

  onclickdata = (e: any, args: any) => {
    //debugger;
    const gridOptions = this.templateGrid.slickGrid.getOptions();
    //console.log('check');
    //console.log(gridOptions);
    //console.log(args.grid.getOptions().editable);
    if (args.grid.getOptions().editable == true) {
      args.grid.getEditorLock().commitCurrentEdit();
      args.grid.focus();
      // args.grid.setSelectedRows([args.row])
      args.grid.editActiveCell();
      args.grid.getEditorLock().commitCurrentEdit();
    }
    args.grid.updateRow(args.cell);
    // this.templateGrid.slickGrid.setSelectedRows([args.grid.row]);
    // this.templateGrid.slickGrid.setActiveCell(args.grid.row, 0);
    args.grid.invalidate();
    args.grid.render();
    this.ChangeInd = this.ChangeInd + 1;
    // args.grid.setSelectedRows();
  };

  onValidationErrordata(e: any, args: any) {
    this.toastr.error(args.validationResults.msg);
  }

  async onAddNewRowData(e: any, args: any){
    //debugger;
    var lRowIndex = 1;
    if (
      args.grid.getActiveCell() != null &&
      args.grid.getActiveCell().row != null &&
      args.grid.getActiveCell().row >= 0
    ) {
      lRowIndex = args.grid.getActiveCell().row + 1;
    }
    var lCustomerCode = this.CustomerCode;
    var lProjectCode = this.ProjectCode;
    var lOrder = this.JobID;
    var lJobID = this.JobID;

    let lMeshID = this.getMeshID(lRowIndex, this.dataViewCTS);
    let item = args.grid.getSelectedRows();
    // let item = args.grid;
    // let item = args.grid.map((lRowIndex: any) => args.dataView.getItemByIdx(lRowIndex));
    item.CustomerCode = this.CustomerCode;
    item.ProjectCode = this.ProjectCode;
    item.JobID = this.JobID;
    item.BBSID = 1;
    item.MeshID = lMeshID;
    item.MeshSort = lRowIndex * 1000;
    item.id = lRowIndex;
    item.MeshMemberQty = 1;

    //$.extend(item, args.item);

    if (lRowIndex > 1) {
      var lBarMark = args.grid.getDataItem(lRowIndex - 2).MeshMark;
      if (
        lBarMark != null &&
        lBarMark != '' &&
        (item.MeshMark == null || item.MeshMark == '')
      ) {
        var lBarMark1 = lBarMark.replace(/\d+$/, function (n: any) {
          return ++n;
        });
        if (lBarMark1 == lBarMark) {
          lBarMark1 = lBarMark.replace(
            /([a-zA-Z])[^a-zA-Z]*$/,
            function (a: any) {
              var c = a.charCodeAt(0);
              switch (c) {
                case 90:
                  return 'A';
                case 122:
                  return 'a';
                default:
                  return String.fromCharCode(++c);
              }
            }
          );
        }
        item.MeshMark = lBarMark1;
      }
      var lBarProd = args.grid.getDataItem(lRowIndex - 2).MeshProduct;
      if (
        lBarProd != null &&
        lBarProd != '' &&
        (item.MeshProduct == null || item.MeshProduct == '')
      ) {
        item.MeshProduct = lBarProd;
      }
    } else {
      var lBarMark = item.MeshMark;
      if (lBarMark == null || lBarMark == '') {
        item.MeshMark = '1';
      }
    }
    //set default value
    if(args.column.id == 'MeshProduct'){
      item['MeshProduct'] = args.item['MeshProduct']
    }
    if(item['MeshProduct'] == null || item['MeshProduct'] == ''){
      item['MeshProduct'] = {value: 'WA13', label: 'WA13'};
    }
    if (
      item['MeshMainLen'] == null ||
      item['MeshMainLen'] == '' ||
      item['MeshMainLen'] == 0
    ) {
      item['MeshMainLen'] = 6000;
    }
    if (
      item['MeshCrossLen'] == null ||
      item['MeshCrossLen'] == '' ||
      item['MeshCrossLen'] == 0
    ) {
      item['MeshCrossLen'] = 2400;
    }
    if (item['MeshShapeCode'] == null || item['MeshShapeCode'] == '') {
      item["MeshShapeCode"] = {value:"F",label:"F"};
      // item["MeshShapeCode"]="F";
      item['A'] = item['MeshMainLen'];

      var lProdCode = item['MeshProduct'].value ? item['MeshProduct'].value : item['MeshProduct'];
      if (lProdCode != null && lProdCode != '') {
        if (lProdCode != this.gProdCode) {
          await this.loadProductInfo(lProdCode, args.row);
        }
        item.ProdMWDia = this.gProdMWDia;
        item.ProdMWSpacing = this.gProdMWSpacing;
        item.ProdCWDia = this.gProdCWDia;
        item.ProdCWSpacing = this.gProdCWSpacing;
        item.ProdMass = this.gProdMass;
        item.ProdMinFactor = this.gProdMinFactor;
        item.ProdTwinInd = this.gProdTwinInd;
      }

      if (item['ProdCWSpacing'] > 0) {
        var lMO1 =
          5 * Math.round((item['MeshMainLen'] % item['ProdCWSpacing']) / 10);
        if (lMO1 < item['ProdCWSpacing'] / 2) {
          lMO1 = lMO1 + item['ProdCWSpacing'] / 2;
        }
        item['MeshMO1'] = lMO1;
        var lRemainder = Math.round(
          item['MeshMainLen'] -
          lMO1 -
          Math.floor((item['MeshMainLen'] - lMO1) / item['ProdCWSpacing']) *
          item['ProdCWSpacing']
        );

        if (lRemainder < item['ProdCWSpacing'] / 2) {
          item['MeshMO2'] = item['ProdCWSpacing'] + lRemainder;
        } else {
          item['MeshMO2'] = lRemainder;
        }
      }

      if (item['ProdMWSpacing'] > 0) {
        var lCO1 =
          5 * Math.round((item['MeshCrossLen'] % item['ProdMWSpacing']) / 10);
        if (lCO1 < item['ProdMWSpacing'] / 2) {
          lCO1 = lCO1 + item['ProdMWSpacing'] / 2;
        }
        item['MeshCO1'] = lCO1;
        var lRemainder = Math.round(
          item['MeshCrossLen'] -
          lCO1 -
          Math.floor((item['MeshCrossLen'] - lCO1) / item['ProdMWSpacing']) *
          item['ProdMWSpacing']
        );

        if (lRemainder < item['ProdMWSpacing'] / 2) {
          item['MeshCO2'] = item['ProdMWSpacing'] + lRemainder;
        } else {
          item['MeshCO2'] = lRemainder;
        }
      }
      item['MeshTotalWT'] = this.calWeightOthers(item).toFixed(3);
    }
    this.dataViewCTS.beginUpdate();
    this.dataViewCTS.addItem(item);
    this.dataViewCTS.endUpdate();
    args.grid.invalidate();
    args.grid.render();
    this.ChangeInd = this.ChangeInd + 1;
    this.barChangeInd[this.gridIndex] = this.barChangeInd[this.gridIndex] + 1;
    this.gCurrentRow = args.grid.getActiveCell().row;
    this.gPreCellRow = args.grid.getActiveCell().row;
  };

  // InsertColumn(pPara: any, gridCTSMesh: any) {
  //   var columns = gridCTSMesh.getColumns();
  //   var lStartCol = 10;
  //   var lEndCol = columns.length - 4;
  //   if (pPara == 'HOOK') {
  //     var lPos = columns.length - 3;
  //     if (columns.length > 0) {
  //       for (let i = lStartCol; i < columns.length; i++) {
  //         if (columns[i].id == 'HOOK') {
  //           return;
  //         }
  //         if (columns[i].id == 'LEG' || columns[i].id == 'MeshTotalWT') {
  //           lPos = i;
  //         }
  //       }
  //     }
  //     this.columnDefinition = {
  //       id: pPara,
  //       name: 'Hook\n勾宽',
  //       field: pPara,
  //       toolTip: 'Hook length (勾宽)',
  //       minWidth: 40,
  //       width: 40,
  //       editor: { model: Editors.text },
  //       validator: this.parameterValidator,
  //       cssClass: 'left-align',
  //       editable: true,
  //     };
  //   } else {
  //     if (columns.length > 0) {
  //       for (let i = 0; i < columns.length; i++) {
  //         if (
  //           columns[i].id == 'HOOK' ||
  //           columns[i].id == 'LEG' ||
  //           columns[i].id == 'MeshTotalWT'
  //         ) {
  //           lEndCol = i;
  //           break;
  //         }
  //       }
  //     }
  //     if (columns.length > 0) {
  //       for (let i = 0; i < columns.length; i++) {
  //         if (columns[i].id == 'C') {
  //           lStartCol = i;
  //           break;
  //         }
  //       }
  //     }
  //     //debugger;
  //     var lWidth = columns[lStartCol].width;
  //     var lMinWidth = columns[lStartCol].minWidth;
  //     this.columnDefinition = {
  //       id: pPara,
  //       name: pPara,
  //       field: pPara,
  //       toolTip: 'Bending Parameter ' + pPara + ' (参数 ' + pPara + ')',
  //       minWidth: lMinWidth,
  //       width: lWidth,
  //       editor: { model: Editors.text },
  //       validator: this.parameterValidator,
  //       cssClass: 'left-align',
  //       editable: true,
  //     };
  //     var lPos = lEndCol;
  //     var lAcs = pPara.charCodeAt(0);
  //     if (lStartCol < lEndCol) {
  //       for (let i = lStartCol; i < lEndCol - 1; i++) {
  //         if (columns[i].id == pPara || columns[i + 1].id == pPara) {
  //           return;
  //         } else {
  //           if (
  //             columns[i].id.charCodeAt(0) < lAcs &&
  //             (columns[i + 1].id.charCodeAt(0) > lAcs ||
  //               columns[i + 1].id.length > 1)
  //           ) {
  //             lPos = i + 1;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   debugger;
  //   const allColumns = this.templateGrid.gridService.getAllColumnDefinitions();
  //   allColumns.map((data)=>{
  //     if(data.id == "A"){
  //       this.columnDefinition.editor = data.editor;
  //       this.columnDefinition.internalColumnEditor = data.internalColumnEditor;
  //     }
  //   })
  //   allColumns.splice(lPos, 0, this.columnDefinition);
  //   this.templateGrid.gridService.resetGrid(allColumns);
  //   console.log("allColumns=>",allColumns);
  //   // this.templateColumns = [...allColumns];

  //   // this.templateColumns = columns;
  //   // Grid.setColumns(allColumns);
  //   // Grid.invalidate();
  //   // Grid.render();
  //   console.log('COLUMN', this.templateColumns);
  //   columns.splice(lPos, 0, this.columnDefinition);
  //   //console.log(columns);
  //   // this.templateGrid.slickGrid.setColumns(columns);
  //   // gridCTSMesh.setColumns(allColumns);
  //   gridCTSMesh.autosizeColumns();
  //   // gridCTSMesh.gridService.updateColumnDefinitions(columns);
  // }

  InsertColumn(pPara: any, gridCTSMesh: any) {
    let columnDefinition: any;
    var columns = gridCTSMesh.getColumns();
    var lStartCol = 10;
    var lEndCol = columns.length - 4;
    if (pPara == "HOOK") {
      var lPos = columns.length - 3;
      if (columns.length > 0) {
        for (var i = lStartCol; i < columns.length; i++) {
          if (columns[i].id == "HOOK") {
            return;
          }
          if (columns[i].id == "LEG" || columns[i].id == "MeshTotalWT") {
            lPos = i;
          }
        }
      }
      columnDefinition = { id: pPara, name: "Hook\n勾宽", field: pPara, toolTip: "Hook length (勾宽)", minWidth: 40, width: 40, editor: { model: Editors.text }, validator: this.parameterValidator, cssClass: 'left-align' };

    } else {
      if (columns.length > 0) {
        for (var i = 0; i < columns.length; i++) {
          if (columns[i].id == "HOOK" || columns[i].id == "LEG" || columns[i].id == "MeshTotalWT") {
            lEndCol = i;
            break;
          }
        }
      }
      if (columns.length > 0) {
        for (var i = 0; i < columns.length; i++) {
          if (columns[i].id == "C") {
            lStartCol = i;
            break;
          }
        }
      }
      var lWidth = columns[lStartCol].width;
      var lMinWidth = columns[lStartCol].minWidth;
      columnDefinition = { id: pPara, name: pPara, field: pPara, toolTip: "Bending Parameter " + pPara + " (参数 " + pPara + ")", minWidth: lMinWidth, width: lWidth, editor: { model: Editors.text }, validator: this.parameterValidator, cssClass: 'left-align' };
      var lPos = lEndCol;
      var lAcs = pPara.charCodeAt(0);
      if (lStartCol < lEndCol) {
        for (var i = lStartCol; i < lEndCol - 1; i++) {
          if (columns[i].id == pPara || columns[i + 1].id == pPara) {
            return;
          } else {
            if (columns[i].id.charCodeAt(0) < lAcs && (columns[i + 1].id.charCodeAt(0) > lAcs || (columns[i + 1].id).length > 1)) {
              lPos = i + 1;
              break;
            }
          }
        }
      }
    }
    // columns.splice(lPos, 0, columnDefinition);
    const allColumns = this.templateGrid.gridService.getAllColumnDefinitions();
    allColumns.map((data) => {
      if (data.id == "A") {
        columnDefinition.editor = data.editor;
        columnDefinition.internalColumnEditor = data.internalColumnEditor;
      }
    })
    allColumns.splice(lPos, 0, columnDefinition);
    console.log("allColumns=>", allColumns);
    gridCTSMesh.setColumns(allColumns);
    gridCTSMesh.autosizeColumns();
  }

  // InsertColumn(pPara: any, pGridID: any) {
  //   let Grid = this.templateGrid.slickGrid;
  //   let dataViewCAB;
  //   // alert('Column Insert start')
  //   console.log('Column Insert start');
  //   var lTab = pGridID;
  //   var columns = Grid.getColumns();
  //   // var columns = this.templateColumns;
  //   console.log('this.templateColumns', this.templateColumns);

  //   var lStartCol = 10;
  //   var lEndCol = columns.length - 4;
  //   var lWidth = columns[lStartCol].width;
  //   var lMinWidth = columns[lStartCol].minWidth;
  //   // let columnDefinition = { id: pPara, name: pPara, field: pPara, toolTip: "Bending Parameter " + pPara + " (参数 " + pPara + ")", minWidth: lMinWidth, width: lWidth, editor: { model: Editors.text }, validator: parameterValidator, cssClass: 'right-align grid-text-size' };
  //   let columnDefinition: Column = {
  //     id: pPara,
  //     name: pPara,
  //     field: pPara,
  //     toolTip: 'Bending Parameter ' + pPara + ' (参数 ' + pPara + ')',
  //     minWidth: lMinWidth,
  //     width: lWidth,
  //     rerenderOnResize: false,
  //     defaultSortAsc: true,
  //     cssClass: 'right-align grid-text-size',
  //   };

  //   // let columnDefinition = JSON.parse(JSON.stringify(columns[11]));
  //   // let columnDefinition = JSON.parse(JSON.stringify(columns[11]));
  //   // columnDefinition.field = pPara;
  //   // columnDefinition.id = pPara;
  //   // columnDefinition.name = pPara;
  //   // columnDefinition.toolTip = 'Bending Parameter ' + pPara + ' (参数 ' + pPara + ')';
  //   // columnDefinition.editor = { model: Editors.text };

  //   var lPos = lEndCol;
  //   var lAcs = pPara.charCodeAt(0);
  //   if (lStartCol < lEndCol) {
  //     for (let i = lStartCol; i < lEndCol - 1; i++) {
  //       if (columns[i].id == pPara || columns[i + 1].id == pPara) {
  //         return;
  //       } else {
  //         if (
  //           columns[i].id.toString().charCodeAt(0) < lAcs &&
  //           columns[i + 1].id.toString().charCodeAt(0) > lAcs
  //         ) {
  //           lPos = i + 1;
  //           break;
  //         }

  //       }
  //     }
  //   }
  //   // columns.splice(lPos, 0, columnDefinition);
  //   const allColumns = this.templateGrid.gridService.getAllColumnDefinitions();
  //   allColumns.map((data)=>{
  //     if(data.id == "A"){
  //       columnDefinition.editor = data.editor;
  //       columnDefinition.internalColumnEditor = data.internalColumnEditor;
  //     }
  //   })
  //   allColumns.splice(lPos, 0, columnDefinition);
  //   this.templateGrid.gridService.resetGrid(allColumns);
  //   console.log("allColumns=>",allColumns);
  //   // this.templateColumns = [...allColumns];

  //   // this.templateColumns = columns;
  //   // Grid.setColumns(allColumns);
  //   // Grid.invalidate();
  //   // Grid.render();
  //   console.log('COLUMN', this.templateColumns);
  //   // this.templateColumns = columns

  //   // Grid.autosizeColumns();

  // }
  CheckParameters(pParameters: any, gridCTSMesh: any) {
    if (pParameters != null && pParameters != '') {
      var lParaArray = pParameters.split(',');
      if (lParaArray.length > 0) {
        for (let i = 0; i < lParaArray.length; i++) {
          if (

            lParaArray[i] != 'LEG' &&
            lParaArray[i].charCodeAt(0) > 'C'.charCodeAt(0)
          ) {
            console.log("lParaArray[i]=>", lParaArray[i]);
            this.InsertColumn(lParaArray[i], gridCTSMesh);
          }
        }
      }
    }
  }

  loadShapeInfo(pShapeCode: any, pRowNo: any) {
    if (pShapeCode != null && pShapeCode.toString().trim() != '') {
      var lFoundShape = 0;
      if (this.bShapeCode.length > 0) {
        for (let i = 0; i < this.bShapeCode.length; i++) {
          if (this.bShapeCode[i] != null && pShapeCode == this.bShapeCode[i]) {
            this.gShapeParameters = this.bShapeParameters[i];
            this.gShapeEditParameters = this.bShapeEditParameters[i];
            this.gShapeMaxValues = this.bShapeMaxValues[i];
            this.gShapeMinValues = this.bShapeMinValues[i];
            this.gShapeParamTypes = this.bShapeParamTypes[i];
            this.gShapeWireTypes = this.bShapeWireTypes[i];
            this.gMeshCreepMO1 = this.bMeshCreepMO1[i];
            this.gMeshCreepCO1 = this.bMeshCreepCO1[i];
            this.gShapeImage = this.bShapeImage[i];
            (<HTMLImageElement>document.getElementById('rightShapeImage')).src =
              this.gShapeImage;
            (<HTMLImageElement>document.getElementById('btmShapeImage')).src =
              this.gShapeImage;
            this.showupperimage = true;
            // $('#rightShapeImage').show();
            // $('#btmShapeImage').show();
            if (pRowNo >= 0) {
              var lItem = this.dataViewCTS.getItem(pRowNo);
              if (this.gShapeCode != lItem.BarShapeCode) {
                lItem.MeshShapeParameters = this.gShapeParameters;
                lItem.MeshEditParameters = this.gShapeEditParameters;
                lItem.MeshShapeMaxValues = this.gShapeMaxValues;
                lItem.MeshShapeMinValues = this.gShapeMinValues;
                lItem.MeshShapeParamTypes = this.gShapeParamTypes;
                lItem.MeshShapeWireTypes = this.gShapeWireTypes;
                lItem.MeshCreepMO1 = this.gMeshCreepMO1;
                lItem.MeshCreepCO1 = this.gMeshCreepCO1;
                this.CheckParameters(
                  this.gShapeParameters,
                  this.templateGrid.slickGrid
                );
                this.dataViewCTS.beginUpdate();
                this.dataViewCTS.updateItem(lItem.id, lItem);
                this.dataViewCTS.endUpdate();
              }
              console.log('lItem=>', lItem);
            }
            this.gShapeCode = this.bShapeCode[i];
            lFoundShape = 1;
            break;
          }
        }
      }

      if (lFoundShape == 0) {
        this.orderService
          .getShapeInfo_ctsmesh(
            this.CustomerCode,
            this.ProjectCode,
            this.JobID,
            pShapeCode
          )
          .subscribe({
            next: (response) => {
              //console.log('productCodeInfo', response);
              this.shapeInfo = response;

              this.CheckParameters(
                this.shapeInfo.MeshShapeParameters,
                this.templateGrid.slickGrid
              );
              this.gShapeParameters = this.shapeInfo.MeshShapeParameters;
              this.gShapeEditParameters = this.shapeInfo.MeshEditParameters;
              this.gShapeMaxValues = this.shapeInfo.MeshShapeMaxValues;
              this.gShapeMinValues = this.shapeInfo.MeshShapeMinValues;
              this.gShapeParamTypes = this.shapeInfo.MeshShapeParamTypes;
              this.gShapeWireTypes = this.shapeInfo.MeshShapeWireTypes;
              this.gMeshCreepMO1 = this.shapeInfo.MeshCreepMO1;
              this.gMeshCreepCO1 = this.shapeInfo.MeshCreepCO1;
              this.gShapeImage = this.convImg(this.shapeInfo.MeshShapeImage);
              (<HTMLImageElement>(
                document.getElementById('rightShapeImage')
              )).src = this.gShapeImage;
              (<HTMLImageElement>document.getElementById('btmShapeImage')).src =
                this.gShapeImage;

              this.showupperimage = true;
              // $('#rightShapeImage').show();
              // $('#btmShapeImage').show();

              if (pRowNo >= 0) {
                var lItem = this.dataViewCTS.getItem(pRowNo);
                if (this.gShapeCode != lItem.MeshShapeCode.value?lItem.MeshShapeCode.value:lItem.MeshShapeCode) {
                  lItem.MeshShapeParameters = this.gShapeParameters;
                  lItem.MeshEditParameters = this.gShapeEditParameters;
                  lItem.MeshShapeMaxValues = this.gShapeMaxValues;
                  lItem.MeshShapeMinValues = this.gShapeMinValues;
                  lItem.MeshShapeParamTypes = this.gShapeParamTypes;
                  lItem.MeshShapeWireTypes = this.gShapeWireTypes;
                  lItem.MeshCreepMO1 = this.gMeshCreepMO1;
                  lItem.MeshCreepCO1 = this.gMeshCreepCO1;

                  this.dataViewCTS.beginUpdate();
                  this.dataViewCTS.updateItem(lItem.id, lItem);
                  this.dataViewCTS.endUpdate();
                }
              }
              this.gShapeCode = this.shapeInfo.MeshShapeCode;

              this.bShapeCode.push(this.gShapeCode);
              this.bShapeParameters.push(this.gShapeParameters);
              this.bShapeEditParameters.push(this.gShapeEditParameters);
              this.bShapeMaxValues.push(this.gShapeMaxValues);
              this.bShapeMinValues.push(this.gShapeMinValues);
              this.bShapeParamTypes.push(this.gShapeParamTypes);
              this.bShapeWireTypes.push(this.gShapeWireTypes);
              this.bMeshCreepMO1.push(this.gMeshCreepMO1);
              this.bMeshCreepCO1.push(this.gMeshCreepCO1);
              this.bShapeImage.push(this.gShapeImage);
            },
            error: (e) => { },
            complete: () => {
              // this.loading = false;
            },
          });
        // var lCustomerCode = document.getElementById("CustomerCode").value;
        // var lProjectCode = document.getElementById("ProjectCode").value;
        // var lOrder = document.getElementById("JobId").value;
        // var lJobID = parseInt(lOrder); vw

        // $.ajax({
        //     url: "/CTSMESH/getShapeInfo",
        //     type: "POST",
        //     headers: {
        //         "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("getShapeInfo", "CTSMESH"))
        //     {@Html.AntiForgeryToken()}').val()
        //     },
        //     data: JSON.stringify({
        //         CustomerCode: lCustomerCode,
        //         ProjectCode: lProjectCode,
        //         JobID: lJobID,
        //         ShapeCode: pShapeCode
        //     }),
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     async: false,
        //     error: function (response) {
        //         alert("Get Shape information: Retrieve Database Error.");
        //     },
        //     success: function (response) {
        //         CheckParameters(response.MeshShapeParameters, gridCTSMesh);
        //         gShapeParameters = response.MeshShapeParameters;
        //         gShapeEditParameters = response.MeshEditParameters;
        //         gShapeMaxValues = response.MeshShapeMaxValues;
        //         gShapeMinValues = response.MeshShapeMinValues;
        //         gShapeParamTypes = response.MeshShapeParamTypes;
        //         gShapeWireTypes = response.MeshShapeWireTypes;
        //         gMeshCreepMO1 = response.MeshCreepMO1;
        //         gMeshCreepCO1 = response.MeshCreepCO1;
        //         gShapeImage = convImg(response.MeshShapeImage);
        //         document.getElementById("rightShapeImage").src = gShapeImage;
        //         document.getElementById("btmShapeImage").src = gShapeImage;

        //         $("#rightShapeImage").show();
        //         $("#btmShapeImage").show();

        //         if (pRowNo >= 0) {
        //             var lItem = dataViewCTS.getItem(pRowNo);
        //             if (gShapeCode != lItem.MeshShapeCode) {
        //                 lItem.MeshShapeParameters = gShapeParameters;
        //                 lItem.MeshEditParameters = gShapeEditParameters;
        //                 lItem.MeshShapeMaxValues = gShapeMaxValues;
        //                 lItem.MeshShapeMinValues = gShapeMinValues;
        //                 lItem.MeshShapeParamTypes = gShapeParamTypes;
        //                 lItem.MeshShapeWireTypes = gShapeWireTypes;
        //                 lItem.MeshCreepMO1 = gMeshCreepMO1;
        //                 lItem.MeshCreepCO1 = gMeshCreepCO1;

        //                 dataViewCTS.beginUpdate();
        //                 dataViewCTS.updateItem(lItem.id, lItem);
        //                 dataViewCTS.endUpdate();
        //             }
        //         }
        //         gShapeCode = response.MeshShapeCode;

        //         bShapeCode.push(gShapeCode);
        //         bShapeParameters.push(gShapeParameters);
        //         bShapeEditParameters.push(gShapeEditParameters);
        //         bShapeMaxValues.push(gShapeMaxValues);
        //         bShapeMinValues.push(gShapeMinValues);
        //         bShapeParamTypes.push(gShapeParamTypes);
        //         bShapeWireTypes.push(gShapeWireTypes);
        //         bMeshCreepMO1.push(gMeshCreepMO1);
        //         bMeshCreepCO1.push(gMeshCreepCO1);
        //         bShapeImage.push(gShapeImage);
        //     }
        // });
      }
    } else {
      this.showupperimage = false;
      // $('#rightShapeImage-').hide();
      // $('#btmShapeImage').hide();
    }
  }

  convImg(base64: string) {
    let mime: string | null = null;
    const binaryString = window.atob(base64);
    const nb = binaryString.length;

    if (nb < 4) {
      return null;
    }

    const b0 = binaryString.charCodeAt(0);
    const b1 = binaryString.charCodeAt(1);
    const b2 = binaryString.charCodeAt(2);
    const b3 = binaryString.charCodeAt(3);

    if (b0 == 0x89 && b1 == 0x50 && b2 == 0x4e && b3 == 0x47) {
      mime = 'image/png';
    } else if (b0 == 0xff && b1 == 0xd8) {
      mime = 'image/jpeg';
    } else if (b0 == 0x47 && b1 == 0x49 && b2 == 0x46) {
      mime = 'image/gif';
    } else {
      return null;
    }

    return `data:${mime};base64,${base64}`;
  }

  loadProductInfo(pProductCode: any, pRowNo: any): Promise<void> {
    return new Promise((resolve, reject) => {
      pProductCode = pProductCode ?? null;

      if (pProductCode != null && pProductCode.trim() !== '') {
        let lFoundProduct = false;

        if (this.bProdCode.length > 0) {
          for (let i = 0; i < this.bProdCode.length; i++) {
            if (pProductCode === this.bProdCode[i]) {
              this.gProdMWDia = this.bProdMWDia[i];
              this.gProdMWSpacing = this.bProdMWSpacing[i];
              this.gProdCWDia = this.bProdCWDia[i];
              this.gProdCWSpacing = this.bProdCWSpacing[i];
              this.gProdMass = this.bProdMass[i];
              this.gProdMinFactor = this.bProdMinFactor[i];
              this.gProdTwinInd = this.bProdTwinInd[i];

              if (pRowNo >= 0) {
                const lItem = this.dataViewCTS.getItem(pRowNo);
                if (lItem.MeshProduct == null || pProductCode !== lItem.MeshProduct) {
                  lItem.ProdMWDia = this.gProdMWDia;
                  lItem.ProdMWSpacing = this.gProdMWSpacing;
                  lItem.ProdCWDia = this.gProdCWDia;
                  lItem.ProdCWSpacing = this.gProdCWSpacing;
                  lItem.ProdMass = this.gProdMass;
                  lItem.ProdMinFactor = this.gProdMinFactor;
                  lItem.ProdTwinInd = this.gProdTwinInd;

                  this.dataViewCTS.beginUpdate();
                  this.dataViewCTS.updateItem(lItem.id, lItem);
                  this.dataViewCTS.endUpdate();
                }
              }

              this.gProdCode = this.bProdCode[i];
              lFoundProduct = true;
              resolve(); // Product found locally
              return;
            }
          }
        }

        if (!lFoundProduct) {
          this.orderService.getProductInfo_ctsmesh(pProductCode).subscribe({
            next: (response) => {
              this.productInfo = response;
              this.gProdCode = this.productInfo.ProductCode;
              this.gProdMWDia = this.productInfo.ProdMWDia;
              this.gProdMWSpacing = this.productInfo.ProdMWSpacing;
              this.gProdCWDia = this.productInfo.ProdCWDia;
              this.gProdCWSpacing = this.productInfo.ProdCWSpacing;
              this.gProdMass = this.productInfo.ProdMass;
              this.gProdMinFactor = this.productInfo.ProdMinFactor;
              this.gProdTwinInd = this.productInfo.ProdTwinInd;

              this.bProdCode.push(this.gProdCode);
              this.bProdMWDia.push(this.gProdMWDia);
              this.bProdMWSpacing.push(this.gProdMWSpacing);
              this.bProdCWDia.push(this.gProdCWDia);
              this.bProdCWSpacing.push(this.gProdCWSpacing);
              this.bProdMass.push(this.gProdMass);
              this.bProdMinFactor.push(this.gProdMinFactor);
              this.bProdTwinInd.push(this.gProdTwinInd);

              if (pRowNo >= 0) {
                const lItem = this.dataViewCTS.getItem(pRowNo);
                lItem.ProdMWDia = this.gProdMWDia;
                lItem.ProdMWSpacing = this.gProdMWSpacing;
                lItem.ProdCWDia = this.gProdCWDia;
                lItem.ProdCWSpacing = this.gProdCWSpacing;
                lItem.ProdMass = this.gProdMass;
                lItem.ProdMinFactor = this.gProdMinFactor;
                lItem.ProdTwinInd = this.gProdTwinInd;

                this.dataViewCTS.beginUpdate();
                this.dataViewCTS.updateItem(lItem.id, lItem);
                this.dataViewCTS.endUpdate();
              }

              resolve(); // Product fetched successfully
            },
            error: (e) => {
              reject(e); // Handle errors
            }
          });
        }
      } else {
        resolve(); // No product code provided
      }
    });
  }


  async gridcellchange(e: any, args: any) {
    //debugger;
    // this.onAddNewRowData(e,args);
    this.dataViewCTS = this.templateGrid.slickGrid.getData();
    var lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];
    var lBBSID = args.item['BBSID'];
    var lShapeCode = args.item['MeshShapeCode'].value?args.item['MeshShapeCode'].value:args.item['MeshShapeCode'];

    const nextId = this.dataViewCTS.getLength();
    //console.log('length of grid', nextId);
    //get shape info and Clear the rest of parameters value
    if (lColumnName == 'MeshShapeCode') {
      var lShapeCode = args.item['MeshShapeCode'].value ? args.item['MeshShapeCode'].value : args.item['MeshShapeCode'];
      if (lShapeCode != null && lShapeCode != '') {
        if (lShapeCode != this.gShapeCode) {
          await this.loadShapeInfo(lShapeCode, args.row);
        } else {
          args.item.MeshShapeParameters = this.gShapeParameters;
          args.item.MeshEditParameters = this.gShapeEditParameters;
          args.item.MeshShapeParamTypes = this.gShapeParamTypes;
          args.item.MeshShapeMinValues = this.gShapeMinValues;
          args.item.MeshShapeMaxValues = this.gShapeMaxValues;
          args.item.MeshShapeWireTypes = this.gShapeWireTypes;

          this.showupperimage = true;
          // $('#rightShapeImage').show();
          // $('#btmShapeImage').show();
        }
        var lParameters = args.item.MeshShapeParameters;
        if (lParameters != null && lParameters != '') {
          for (let k = 0; k < 26; k++) {
            if (
              lParameters.indexOf(String.fromCharCode(k + 'A'.charCodeAt(0))) <
              0
            ) {
              if (
                args.item[String.fromCharCode(k + 'A'.charCodeAt(0))] != null
              ) {
                args.item[String.fromCharCode(k + 'A'.charCodeAt(0))] = null;
              }
            }
          }
        }
      } else {
        this.showupperimage = false;
        // $('#rightShapeImage').hide();
        // $('#btmShapeImage').hide();
      }
    }

    if (lColumnName == 'MeshProduct') {
      var lProdCode = args.item['MeshProduct'].value?args.item['MeshProduct'].value:args.item['MeshProduct'];
      if (lProdCode != null && lProdCode != '') {
        if (lProdCode != this.gProdCode) {
          await  this.loadProductInfo(lProdCode, args.row);
        }
        args.item.ProdMWDia = this.gProdMWDia;
        args.item.ProdMWSpacing = this.gProdMWSpacing;
        args.item.ProdCWDia = this.gProdCWDia;
        args.item.ProdCWSpacing = this.gProdCWSpacing;
        args.item.ProdMass = this.gProdMass;
        args.item.ProdMinFactor = this.gProdMinFactor;
        args.item.ProdTwinInd = this.gProdTwinInd;

        (<HTMLDivElement>document.getElementById('rt_MWDia')).innerHTML =
          this.gProdMWDia;
        (<HTMLDivElement>document.getElementById('bt_MWDia')).innerHTML =
          this.gProdMWDia;

        if (this.gProdTwinInd == 'M') {
          (<HTMLDivElement>document.getElementById('rt_MWSpacing')).innerHTML =
            this.gProdMWSpacing + '(Twin)';
          (<HTMLDivElement>document.getElementById('bt_MWSpacing')).innerHTML =
            this.gProdMWSpacing + '(Twin)';
        } else {
          (<HTMLDivElement>document.getElementById('rt_MWSpacing')).innerHTML =
            this.gProdMWSpacing;
          (<HTMLDivElement>document.getElementById('bt_MWSpacing')).innerHTML =
            this.gProdMWSpacing;
        }

        (<HTMLDivElement>document.getElementById('rt_CWDia')).innerHTML =
          this.gProdCWDia;
        (<HTMLDivElement>document.getElementById('bt_CWDia')).innerHTML =
          this.gProdCWDia;

        (<HTMLDivElement>document.getElementById('rt_CWSpacing')).innerHTML =
          this.gProdCWSpacing;
        (<HTMLDivElement>document.getElementById('bt_CWSpacing')).innerHTML =
          this.gProdCWSpacing;

        (<HTMLDivElement>document.getElementById('rt_mass')).innerHTML =
          this.gProdMass;
        (<HTMLDivElement>document.getElementById('bt_mass')).innerHTML =
          this.gProdMass;
      } else {
        (<HTMLDivElement>document.getElementById('rt_MWDia')).innerHTML = '';
        (<HTMLDivElement>document.getElementById('bt_MWDia')).innerHTML = '';

        (<HTMLDivElement>document.getElementById('rt_MWSpacing')).innerHTML =
          '';
        (<HTMLDivElement>document.getElementById('bt_MWSpacing')).innerHTML =
          '';

        (<HTMLDivElement>document.getElementById('rt_CWDia')).innerHTML = '';
        (<HTMLDivElement>document.getElementById('bt_CWDia')).innerHTML = '';

        (<HTMLDivElement>document.getElementById('rt_CWSpacing')).innerHTML =
          '';
        (<HTMLDivElement>document.getElementById('bt_CWSpacing')).innerHTML =
          '';

        (<HTMLDivElement>document.getElementById('rt_mass')).innerHTML = '';
        (<HTMLDivElement>document.getElementById('bt_mass')).innerHTML = '';
      }
    }

    if (lColumnName == 'MeshProduct') {
      if (
        args.item['MeshMainLen'] == null ||
        args.item['MeshMainLen'] == '' ||
        args.item['MeshMainLen'] == 0
      ) {
        args.item['MeshMainLen'] = 6000;
      }
      if (
        args.item['MeshCrossLen'] == null ||
        args.item['MeshCrossLen'] == '' ||
        args.item['MeshCrossLen'] == 0
      ) {
        args.item['MeshCrossLen'] = 2400;
      }
      if (args.item['MeshShapeCode'] == null) {
        args.item['MeshShapeCode'] = {label:'F',value:'F'};
        args.item['A'] = 6000;

        if (args.item['ProdCWSpacing'] > 0) {
          var lMO1 =
            5 *
            Math.round(
              (args.item['MeshMainLen'] % args.item['ProdCWSpacing']) / 10
            );
          if (lMO1 < 100) {
            lMO1 = 100;
          }
          if (lMO1 < args.item['ProdCWSpacing'] / 2) {
            lMO1 = lMO1 + args.item['ProdCWSpacing'] / 2;
          }
          args.item['MeshMO1'] = lMO1;
          var lRemainder = Math.round(
            args.item['MeshMainLen'] -
            lMO1 -
            Math.floor(
              (args.item['MeshMainLen'] - lMO1) / args.item['ProdCWSpacing']
            ) *
            args.item['ProdCWSpacing']
          );

          if (lRemainder < args.item['ProdCWSpacing'] / 2) {
            args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
          } else {
            args.item['MeshMO2'] = lRemainder;
          }
        }

        if (args.item['ProdMWSpacing'] > 0) {
          var lCO1 =
            5 *
            Math.round(
              (args.item['MeshCrossLen'] % args.item['ProdMWSpacing']) / 10
            );
          if (lCO1 < 100) {
            lCO1 = 100;
          }
          if (lCO1 < args.item['ProdMWSpacing'] / 2) {
            lCO1 = lCO1 + args.item['ProdMWSpacing'] / 2;
          }
          args.item['MeshCO1'] = lCO1;
          var lRemainder = Math.round(
            args.item['MeshCrossLen'] -
            lCO1 -
            Math.floor(
              (args.item['MeshCrossLen'] - lCO1) / args.item['ProdMWSpacing']
            ) *
            args.item['ProdMWSpacing']
          );

          if (lRemainder < args.item['ProdMWSpacing'] / 2) {
            args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
          } else {
            args.item['MeshCO2'] = lRemainder;
          }
        }
      }
    }
    if (lColumnName == 'MeshMainLen' || lColumnName == 'MeshProduct') {
      if (args.item['MeshShapeCode'] == null) {
        args.item['MeshShapeCode'] = {label:'F',value:'F'};
      }

      if (lColumnName == 'MeshMainLen' && args.item['MeshShapeCode'] == 'F') {
        args.item['A'] = args.item['MeshMainLen'];
      }

      var lShapeCode = args.item['MeshShapeCode'];
      if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
        if (parseInt(args.item['A']) + 100 < args.item['MeshMainLen']) {
          args.item['MeshMO1'] = parseInt(args.item['A']) + 200;
          var lRemainder = Math.round(
            args.item['MeshMainLen'] -
            args.item['MeshMO1'] -
            Math.floor(
              (args.item['MeshMainLen'] - args.item['MeshMO1']) /
              args.item['ProdCWSpacing']
            ) *
            args.item['ProdCWSpacing']
          );

          if (lRemainder < args.item['ProdCWSpacing'] / 2) {
            args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
          } else {
            args.item['MeshMO2'] = lRemainder;
          }
        }
      } else {
        var lRemainder = Math.round(
          args.item['MeshMainLen'] -
          Math.floor(args.item['MeshMainLen'] / args.item['ProdCWSpacing']) *
          args.item['ProdCWSpacing']
        );
        if (args.item['MeshMainLen'] > args.item['ProdCWSpacing'] + 100) {
          if (args.item['ProdCWSpacing'] > 0) {
            var lMO1 =
              5 *
              Math.round(
                (args.item['ProdCWSpacing'] / 2 +
                  (args.item['MeshMainLen'] % args.item['ProdCWSpacing'])) /
                10
              );
            //if (lMO1 < args.item["ProdCWSpacing"] / 2) {
            //    lMO1 = lMO1 + args.item["ProdCWSpacing"] / 2;
            //}
            if (lMO1 < 100) {
              lMO1 = 100;
            }
            args.item['MeshMO1'] = lMO1;
            var lRemainder = Math.round(
              args.item['MeshMainLen'] -
              lMO1 -
              Math.floor(
                (args.item['MeshMainLen'] - lMO1) / args.item['ProdCWSpacing']
              ) *
              args.item['ProdCWSpacing']
            );

            if (lRemainder < args.item['ProdCWSpacing'] / 2) {
              args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
            } else {
              args.item['MeshMO2'] = lRemainder;
            }
          }
        } else {
          if (lColumnName != 'MeshProduct') {
            alert('Invalid main wire length. ');
          }
        }
      }
    }
    if (lColumnName == 'MeshCrossLen' || lColumnName == 'MeshProduct') {
      if (args.item['MeshShapeCode'] == null) {
        args.item['MeshShapeCode'] = {label:'F',value:'F'};
      }

      var lShapeCode = args.item['MeshShapeCode'];
      if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
        //if ((args.item["MeshCrossLen"] - 400) % args.item["ProdMWSpacing"] == 0) {
        //    args.item["MeshCO1"] = 330;
        //    args.item["MeshCO2"] = 70;
        //} else {
        //    args.item["MeshCO1"] = 430;
        //    args.item["MeshCO2"] = 70 + (args.item["MeshCrossLen"] - 500) % args.item["ProdMWSpacing"];
        //}
        if (parseInt(args.item['A']) + 100 < args.item['MeshCrossLen']) {
          args.item['MeshCO1'] = parseInt(args.item['A']) + 200;
          var lRemainder = Math.round(
            args.item['MeshCrossLen'] -
            args.item['MeshCO1'] -
            Math.floor(
              (args.item['MeshCrossLen'] - args.item['MeshCO1']) /
              args.item['ProdMWSpacing']
            ) *
            args.item['ProdMWSpacing']
          );

          if (lRemainder < args.item['ProdMWSpacing'] / 2) {
            args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
          } else {
            args.item['MeshCO2'] = lRemainder;
          }
        }
      } else if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
        //if ((args.item["MeshCrossLen"] - 800) % args.item["ProdMWSpacing"] == 0) {
        //    args.item["MeshCO1"] = 380;
        //    args.item["MeshCO2"] = 420;
        //} else {
        //    args.item["MeshCO1"] = 430;
        //    args.item["MeshCO2"] = 470 + (args.item["MeshCrossLen"] - 900) % args.item["ProdMWSpacing"];
        //}
        var lRemainder = Math.round(
          args.item['MeshCrossLen'] -
          Math.floor(args.item['MeshCrossLen'] / args.item['ProdMWSpacing']) *
          args.item['ProdMWSpacing']
        );
        if (args.item['MeshCrossLen'] > args.item['ProdMWSpacing'] + 100) {
          if (args.item['ProdMWSpacing'] > 0) {
            var lCO1 =
              5 *
              Math.round(
                (args.item['MeshCrossLen'] % args.item['ProdMWSpacing']) / 10
              );
            //if (lCO1 < args.item["ProdMWSpacing"] / 2) {
            //    lCO1 = lCO1 + args.item["ProdMWSpacing"] / 2;
            //}
            if (lCO1 < 100) {
              lCO1 = 100;
            }
            args.item['MeshCO1'] = lCO1;
            var lRemainder = Math.round(
              args.item['MeshCrossLen'] -
              lCO1 -
              Math.floor(
                (args.item['MeshCrossLen'] - lCO1) /
                args.item['ProdMWSpacing']
              ) *
              args.item['ProdMWSpacing']
            );

            if (lRemainder < args.item['ProdMWSpacing'] / 2) {
              args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
            } else {
              args.item['MeshCO2'] = lRemainder;
            }
          }
        } else {
          alert('Invalid cross wire length. ');
        }
      } else {
        if (args.item['ProdMWSpacing'] > 0) {
          var lCO1 =
            5 *
            Math.round(
              (args.item['MeshCrossLen'] % args.item['ProdMWSpacing']) / 10
            );
          if (lCO1 < args.item['ProdMWSpacing'] / 2) {
            lCO1 = lCO1 + args.item['ProdMWSpacing'] / 2;
          }
          if (lCO1 < 100) {
            lCO1 = 100;
          }
          args.item['MeshCO1'] = lCO1;
          var lRemainder = Math.round(
            args.item['MeshCrossLen'] -
            lCO1 -
            Math.floor(
              (args.item['MeshCrossLen'] - lCO1) / args.item['ProdMWSpacing']
            ) *
            args.item['ProdMWSpacing']
          );

          if (lRemainder < args.item['ProdMWSpacing'] / 2) {
            args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
          } else {
            args.item['MeshCO2'] = lRemainder;
          }
        }
      }
    }
    if (lColumnName == 'MeshMainLen') {
      var lShapeCode = args.item['MeshShapeCode'].value ? args.item['MeshShapeCode'].value : args.item['MeshShapeCode'];
      if (lShapeCode == null) {
        lShapeCode = '';
      }

      var lFound = 0;
      if (lShapeCode != 'F') {
        var lWireType = args.item['MeshShapeWireTypes'];
        var lWireTypeA = lWireType.split(',');
        if (lWireTypeA.length > 0) {
          for (let i = 0; i < lWireTypeA.length; i++) {
            if (lWireTypeA[i] == 'M') {
              lFound = 1;
              break;
            }
          }
        }
      }
      if (lFound == 1 || lShapeCode == 'F') {
        if (args.item['A'] != null) {
          args.item['A'] = null;
        }
        if (args.item['B'] != null) {
          args.item['B'] = null;
        }
        if (args.item['C'] != null) {
          args.item['C'] = null;
        }
        if (args.item['D'] != null) {
          args.item['D'] = null;
        }
        if (args.item['E'] != null) {
          args.item['E'] = null;
        }
        if (args.item['F'] != null) {
          args.item['F'] = null;
        }
        if (args.item['G'] != null) {
          args.item['G'] = null;
        }
        if (args.item['H'] != null) {
          args.item['H'] = null;
        }
        if (args.item['I'] != null) {
          args.item['I'] = null;
        }
        if (args.item['J'] != null) {
          args.item['J'] = null;
        }
        if (args.item['K'] != null) {
          args.item['K'] = null;
        }
        if (args.item['L'] != null) {
          args.item['L'] = null;
        }
        if (args.item['M'] != null) {
          args.item['M'] = null;
        }
        if (args.item['N'] != null) {
          args.item['N'] = null;
        }
        if (args.item['O'] != null) {
          args.item['O'] = null;
        }
        if (args.item['P'] != null) {
          args.item['P'] = null;
        }
        if (args.item['Q'] != null) {
          args.item['Q'] = null;
        }
        if (args.item['R'] != null) {
          args.item['R'] = null;
        }
        if (args.item['S'] != null) {
          args.item['S'] = null;
        }
        if (args.item['T'] != null) {
          args.item['T'] = null;
        }
        if (args.item['U'] != null) {
          args.item['U'] = null;
        }
        if (args.item['V'] != null) {
          args.item['V'] = null;
        }
        if (args.item['W'] != null) {
          args.item['W'] = null;
        }
        if (args.item['X'] != null) {
          args.item['X'] = null;
        }
        if (args.item['Y'] != null) {
          args.item['Y'] = null;
        }
        if (args.item['Z'] != null) {
          args.item['Z'] = null;
        }
      }

      if (
        lShapeCode == '1M1' ||
        lShapeCode == '1MR1' ||
        lShapeCode == '2M1' ||
        lShapeCode == '2MR1' ||
        lShapeCode == 'F'
      ) {
        if (lShapeCode == 'F') {
          args.item['A'] = args.item['MeshMainLen'];
        }

        if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
          args.item['A'] = 200;
          args.item['B'] = args.item['MeshMainLen'] - 200;
        }

        if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
          args.item['A'] = 200;
          args.item['B'] = args.item['MeshMainLen'] - 200;
        }
      }
    }

    if (lColumnName == 'MeshCrossLen') {
      var lShapeCode = args.item['MeshShapeCode'].value ? args.item['MeshShapeCode'].value : args.item['MeshShapeCode'];
      if (lShapeCode == null) {
        lShapeCode = '';
      }

      var lFound = 0;

      if (lShapeCode != 'F') {
        var lWireType = args.item['MeshShapeWireTypes'];
        var lWireTypeA = lWireType.split(',');
        if (lWireTypeA.length > 0) {
          for (let i = 0; i < lWireTypeA.length; i++) {
            if (lWireTypeA[i] == 'C') {
              lFound = 1;
              break;
            }
          }
        }
      }
      if (lFound == 1) {
        if (args.item['A'] != null) {
          args.item['A'] = null;
        }
        if (args.item['B'] != null) {
          args.item['B'] = null;
        }
        if (args.item['C'] != null) {
          args.item['C'] = null;
        }
        if (args.item['D'] != null) {
          args.item['D'] = null;
        }
        if (args.item['E'] != null) {
          args.item['E'] = null;
        }
        if (args.item['F'] != null) {
          args.item['F'] = null;
        }
        if (args.item['G'] != null) {
          args.item['G'] = null;
        }
        if (args.item['H'] != null) {
          args.item['H'] = null;
        }
        if (args.item['I'] != null) {
          args.item['I'] = null;
        }
        if (args.item['J'] != null) {
          args.item['J'] = null;
        }
        if (args.item['K'] != null) {
          args.item['K'] = null;
        }
        if (args.item['L'] != null) {
          args.item['L'] = null;
        }
        if (args.item['M'] != null) {
          args.item['M'] = null;
        }
        if (args.item['N'] != null) {
          args.item['N'] = null;
        }
        if (args.item['O'] != null) {
          args.item['O'] = null;
        }
        if (args.item['P'] != null) {
          args.item['P'] = null;
        }
        if (args.item['Q'] != null) {
          args.item['Q'] = null;
        }
        if (args.item['R'] != null) {
          args.item['R'] = null;
        }
        if (args.item['S'] != null) {
          args.item['S'] = null;
        }
        if (args.item['T'] != null) {
          args.item['T'] = null;
        }
        if (args.item['U'] != null) {
          args.item['U'] = null;
        }
        if (args.item['V'] != null) {
          args.item['V'] = null;
        }
        if (args.item['W'] != null) {
          args.item['W'] = null;
        }
        if (args.item['X'] != null) {
          args.item['X'] = null;
        }
        if (args.item['Y'] != null) {
          args.item['Y'] = null;
        }
        if (args.item['Z'] != null) {
          args.item['Z'] = null;
        }
      }

      if (
        lShapeCode == '1C1' ||
        lShapeCode == '1CR1' ||
        lShapeCode == '2C1' ||
        lShapeCode == '2CR1'
      ) {
        if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
          args.item['A'] = 200;
          args.item['B'] = args.item['MeshCrossLen'] - 200;
        }
      }
    }
    if (lColumnName == 'MeshShapeCode') {
      if (args.item['A'] != null) {
        args.item['A'] = null;
      }
      if (args.item['B'] != null) {
        args.item['B'] = null;
      }
      if (args.item['C'] != null) {
        args.item['C'] = null;
      }
      if (args.item['D'] != null) {
        args.item['D'] = null;
      }
      if (args.item['E'] != null) {
        args.item['E'] = null;
      }
      if (args.item['F'] != null) {
        args.item['F'] = null;
      }
      if (args.item['G'] != null) {
        args.item['G'] = null;
      }
      if (args.item['H'] != null) {
        args.item['H'] = null;
      }
      if (args.item['I'] != null) {
        args.item['I'] = null;
      }
      if (args.item['J'] != null) {
        args.item['J'] = null;
      }
      if (args.item['K'] != null) {
        args.item['K'] = null;
      }
      if (args.item['L'] != null) {
        args.item['L'] = null;
      }
      if (args.item['M'] != null) {
        args.item['M'] = null;
      }
      if (args.item['N'] != null) {
        args.item['N'] = null;
      }
      if (args.item['O'] != null) {
        args.item['O'] = null;
      }
      if (args.item['P'] != null) {
        args.item['P'] = null;
      }
      if (args.item['Q'] != null) {
        args.item['Q'] = null;
      }
      if (args.item['R'] != null) {
        args.item['R'] = null;
      }
      if (args.item['S'] != null) {
        args.item['S'] = null;
      }
      if (args.item['T'] != null) {
        args.item['T'] = null;
      }
      if (args.item['U'] != null) {
        args.item['U'] = null;
      }
      if (args.item['V'] != null) {
        args.item['V'] = null;
      }
      if (args.item['W'] != null) {
        args.item['W'] = null;
      }
      if (args.item['X'] != null) {
        args.item['X'] = null;
      }
      if (args.item['Y'] != null) {
        args.item['Y'] = null;
      }
      if (args.item['Z'] != null) {
        args.item['Z'] = null;
      }
      if (lShapeCode == 'F') {
        args.item['A'] = args.item['MeshMainLen'];
      }

      if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
        args.item['A'] = 200;
        args.item['B'] = args.item['MeshMainLen'] - 200;
      }

      if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
        args.item['A'] = 200;
        args.item['B'] = args.item['MeshMainLen'] - 200;
      }

      // set default value MO1/MO2
      if (args.item['MeshMainLen'] > 0 && args.item['ProdCWSpacing'] > 0) {
        var lShapeCode = args.item['MeshShapeCode'].value ? args.item['MeshShapeCode'].value : args.item['MeshShapeCode'];
        if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
          if (parseInt(args.item['A']) + 100 < args.item['MeshMainLen']) {
            args.item['MeshMO1'] = parseInt(args.item['A']) + 200;
            var lRemainder = Math.round(
              args.item['MeshMainLen'] -
              args.item['MeshMO1'] -
              Math.floor(
                (args.item['MeshMainLen'] - args.item['MeshMO1']) /
                args.item['ProdCWSpacing']
              ) *
              args.item['ProdCWSpacing']
            );

            if (lRemainder < args.item['ProdCWSpacing'] / 2) {
              args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
            } else {
              args.item['MeshMO2'] = lRemainder;
            }
          }
        } else if (lShapeCode == '2M1' || lShapeCode == '2MR1') {
          var lRemainder = Math.round(
            args.item['MeshMainLen'] -
            Math.floor(
              args.item['MeshMainLen'] / args.item['ProdCWSpacing']
            ) *
            args.item['ProdCWSpacing']
          );
          if (args.item['MeshMainLen'] > args.item['ProdCWSpacing'] + 200) {
            if (args.item['ProdCWSpacing'] > 0) {
              var lMO1 =
                5 *
                Math.round(
                  (args.item['ProdCWSpacing'] / 2 +
                    (args.item['MeshMainLen'] % args.item['ProdCWSpacing'])) /
                  10
                );
              args.item['MeshMO1'] = lMO1;
              var lRemainder = Math.round(
                args.item['MeshMainLen'] -
                lMO1 -
                Math.floor(
                  (args.item['MeshMainLen'] - lMO1) /
                  args.item['ProdCWSpacing']
                ) *
                args.item['ProdCWSpacing']
              );

              if (lRemainder < args.item['ProdCWSpacing'] / 2) {
                args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
              } else {
                args.item['MeshMO2'] = lRemainder;
              }
            }
          } else {
            alert('Invalid main wire length. ');
          }
        } else {
          if (args.item['ProdCWSpacing'] > 0) {
            var lMO1 =
              5 *
              Math.round(
                (args.item['ProdCWSpacing'] / 2 +
                  (args.item['MeshMainLen'] % args.item['ProdCWSpacing'])) /
                10
              );
            if (lMO1 < 100) {
              lMO1 = 100;
            }
            args.item['MeshMO1'] = lMO1;
            var lRemainder = Math.round(
              args.item['MeshMainLen'] -
              lMO1 -
              Math.floor(
                (args.item['MeshMainLen'] - lMO1) / args.item['ProdCWSpacing']
              ) *
              args.item['ProdCWSpacing']
            );

            if (lRemainder < args.item['ProdCWSpacing'] / 2) {
              args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
            } else {
              args.item['MeshMO2'] = lRemainder;
            }
          }
        }
      }

      // CO1/CO2
      if (args.item['MeshCrossLen'] > 0 && args.item['ProdMWSpacing'] > 0) {
        var lShapeCode = args.item['MeshShapeCode'].value ? args.item['MeshShapeCode'].value : args.item['MeshShapeCode'];
        if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
          if (parseInt(args.item['A']) + 100 < args.item['MeshCrossLen']) {
            args.item['MeshCO1'] = parseInt(args.item['A']) + 200;
            var lRemainder = Math.round(
              args.item['MeshCrossLen'] -
              args.item['MeshCO1'] -
              Math.floor(
                (args.item['MeshCrossLen'] - args.item['MeshCO1']) /
                args.item['ProdMWSpacing']
              ) *
              args.item['ProdMWSpacing']
            );

            if (lRemainder < args.item['ProdMWSpacing'] / 2) {
              args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
            } else {
              args.item['MeshCO2'] = lRemainder;
            }
          }
        } else if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
          var lRemainder = Math.round(
            args.item['MeshCrossLen'] -
            Math.floor(
              args.item['MeshCrossLen'] / args.item['ProdMWSpacing']
            ) *
            args.item['ProdMWSpacing']
          );
          if (args.item['MeshCrossLen'] > args.item['ProdMWSpacing'] + 100) {
            if (args.item['ProdMWSpacing'] > 0) {
              var lCO1 =
                5 *
                Math.round(
                  (args.item['ProdMWSpacing'] / 2 +
                    (args.item['MeshCrossLen'] % args.item['ProdMWSpacing'])) /
                  5
                );
              args.item['MeshCO1'] = lCO1;
              var lRemainder = Math.round(
                args.item['MeshCrossLen'] -
                lCO1 -
                Math.floor(
                  (args.item['MeshCrossLen'] - lCO1) /
                  args.item['ProdMWSpacing']
                ) *
                args.item['ProdMWSpacing']
              );

              if (lRemainder < args.item['ProdMWSpacing'] / 2) {
                args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
              } else {
                args.item['MeshCO2'] = lRemainder;
              }
            }
          } else {
            alert('Invalid cross wire length. ');
          }
        } else {
          var lRemainder = Math.round(
            args.item['MeshCrossLen'] -
            Math.floor(
              args.item['MeshCrossLen'] / args.item['ProdMWSpacing']
            ) *
            args.item['ProdMWSpacing']
          );
          if (args.item['MeshCrossLen'] > args.item['ProdMWSpacing'] + 100) {
            if (args.item['ProdMWSpacing'] > 0) {
              var lCO1 =
                5 *
                Math.round(
                  (args.item['MeshCrossLen'] % args.item['ProdMWSpacing']) / 10
                );
              if (lCO1 < 100) {
                lCO1 = 100;
              }
              if (lCO1 < args.item['ProdMWSpacing'] / 2) {
                lCO1 = lCO1 + args.item['ProdMWSpacing'] / 2;
              }
              args.item['MeshCO1'] = lCO1;
              var lRemainder = Math.round(
                args.item['MeshCrossLen'] -
                lCO1 -
                Math.floor(
                  (args.item['MeshCrossLen'] - lCO1) /
                  args.item['ProdMWSpacing']
                ) *
                args.item['ProdMWSpacing']
              );

              if (lRemainder < args.item['ProdMWSpacing'] / 2) {
                args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
              } else {
                args.item['MeshCO2'] = lRemainder;
              }
            }
          } else {
            alert('Invalid cross wire length. ');
          }
        }
      }
    }
    if (lColumnName == 'MeshMO1') {
      if (args.item['ProdCWSpacing'] > 0) {
        let lMO1 = args.item['MeshMO1'];
        var lMO2 = args.item['MeshMO2'];
        if (lMO1 != null && lMO2 != null && lMO1 > 0 && lMO2 > 0) {
          var lRemainder =
            (args.item['MeshMainLen'] - lMO1 - lMO2) %
            args.item['ProdCWSpacing'];

          if (lRemainder > 0) {
            if (
              lRemainder > args.item['ProdCWSpacing'] / 2 &&
              lMO2 - (args.item['ProdCWSpacing'] - lRemainder) >= 50
            ) {
              args.item['MeshMO2'] =
                lMO2 - (args.item['ProdCWSpacing'] - lRemainder);
            } else {
              args.item['MeshMO2'] = lMO2 + lRemainder;
            }
          }
        }
      }
    }
    if (lColumnName == 'MeshMO2') {
      if (args.item['ProdCWSpacing'] > 0) {
        let lMO1 = args.item['MeshMO1'];
        let lMO2 = args.item['MeshMO2'];
        if (lMO1 != null && lMO2 != null && lMO1 > 0 && lMO2 > 0) {
          var lRemainder =
            (args.item['MeshMainLen'] - lMO1 - lMO2) %
            args.item['ProdCWSpacing'];

          if (lRemainder > 0) {
            if (
              lRemainder > args.item['ProdCWSpacing'] / 2 &&
              lMO1 - (args.item['ProdCWSpacing'] - lRemainder) >= 50
            ) {
              args.item['MeshMO1'] =
                lMO1 - (args.item['ProdCWSpacing'] - lRemainder);
            } else {
              args.item['MeshMO1'] = lMO1 + lRemainder;
            }
          }
        }
      }
    }
    if (lColumnName == 'MeshCO1') {
      if (args.item['ProdMWSpacing'] > 0) {
        let lCO1 = args.item['MeshCO1'];
        let lCO2 = args.item['MeshCO2'];
        if (lCO1 != null && lCO2 != null && lCO1 > 0 && lCO2 > 0) {
          var lRemainder =
            (args.item['MeshCrossLen'] - lCO1 - lCO2) %
            args.item['ProdMWSpacing'];

          if (lRemainder > 0) {
            if (
              lRemainder > args.item['ProdMWSpacing'] / 2 &&
              lCO2 - (args.item['ProdMWSpacing'] - lRemainder) >= 50
            ) {
              args.item['MeshCO2'] =
                lCO2 - (args.item['ProdMWSpacing'] - lRemainder);
            } else {
              args.item['MeshCO2'] = lCO2 + lRemainder;
            }
          }
        }
      }
    }
    if (lColumnName == 'MeshCO2') {
      if (args.item['ProdMWSpacing'] > 0) {
        let lCO1 = args.item['MeshCO1'];
        var lCO2 = args.item['MeshCO2'];
        if (lCO1 != null && lCO2 != null && lCO1 > 0 && lCO2 > 0) {
          var lRemainder =
            (args.item['MeshCrossLen'] - lCO1 - lCO2) %
            args.item['ProdMWSpacing'];

          if (lRemainder > 0) {
            if (
              lRemainder > args.item['ProdMWSpacing'] / 2 &&
              lCO1 - (args.item['ProdMWSpacing'] - lRemainder) >= 50
            ) {
              args.item['MeshCO1'] =
                lCO1 - (args.item['ProdMWSpacing'] - lRemainder);
            } else {
              args.item['MeshCO1'] = lCO1 + lRemainder;
            }
          }
        }
      }
    }
    //check MO/CO/Single wire
    if (
      lColumnName == 'MeshMainLen' ||
      lColumnName == 'MeshMO1' ||
      lColumnName == 'MeshMO2'
    ) {
      if (lColumnName == 'MeshMainLen') {
        if (args.item['MeshMainLen'] < args.item['ProdCWSpacing'] + 100) {
          alert(
            'Invalid main wire length. It should be greater than and equal to cross wire spacing plus 50 overhangs. (无效的主筋长度)'
          );
        }
        if (args.item['MeshMainLen'] > 0) {
          if (args.item['MeshMainLen'] % 10 != 0) {
            var lRem = args.item['MeshMainLen'] % 10;
            var llength = args.item['MeshMainLen'] - lRem;
            //if (lRem >= 25) {
            llength = args.item['MeshMainLen'] - lRem + 10;
            //}
            args.item['MeshMainLen'] = llength;
            alert(
              'MESH incremental main length is 10mm. Your input value is rounded to ' +
              llength +
              '. '
            );
          }
        }
      }

      if (
        args.item['MeshMainLen'] - args.item['MeshMO1'] - args.item['MeshMO2'] <
        args.item['ProdCWSpacing']
      ) {
        alert(
          'Please check main wire length, MO1 or MO2 as only one cross wire left.(主边太长, 只剩一根副筋)'
        );
      }
    }
    //check MO/CO/Single wire
    if (
      lColumnName == 'MeshCrossLen' ||
      lColumnName == 'MeshCO1' ||
      lColumnName == 'MeshCO2'
    ) {
      if (lColumnName == 'MeshCrossLen') {
        if (args.item['MeshCrossLen'] < args.item['ProdMWSpacing'] + 100) {
          alert(
            'Invalid cross wire length. It should be greater than and equal to main wire spacing plus 50 overhangs. (无效的副筋长度)'
          );
        }
        if (args.item['MeshCrossLen'] > 0) {
          if (args.item['MeshCrossLen'] % 10 != 0) {
            var lRem = args.item['MeshCrossLen'] % 10;
            var llength = args.item['MeshCrossLen'] - lRem;
            //if (lRem >= 25) {
            llength = args.item['MeshCrossLen'] - lRem + 10;
            //}
            args.item['MeshCrossLen'] = llength;
            alert(
              'MESH incremental cross length is 10mm. Your input value is rounded to ' +
              llength +
              '. '
            );
          }
        }
      }
      if (
        args.item['MeshCrossLen'] -
        args.item['MeshCO1'] -
        args.item['MeshCO2'] <
        args.item['ProdMWSpacing']
      ) {
        alert(
          'Please check cross wire length, CO1 or CO2 as only one main wire left. (副边太长, 只剩一根主筋)'
        );
      }
    }
    //check CO
    if (lColumnName == 'MeshCO1' || lColumnName == 'MeshCO2') {
      if (lColumnName == 'MeshCO1' && args.item['MeshCO1'] > 0) {
        if (args.item['MeshCO1'] > 1000) {
          alert(
            'Cross wire onverhang cannot be greater than 1000. (副筋边长最长不可大于1000)'
          );
        }
        if (args.item['MeshCO1'] < 20) {
          alert(
            'Cross wire onverhang cannot be less than 20. (副筋边长最短不可小于20)'
          );
        }

        //CO2
        if (
          args.item['MeshCrossLen'] > 0 &&
          (args.item['MeshCO2'] == null || args.item['MeshCO2'] == 0) &&
          args.item['ProdMWSpacing'] > 0
        ) {
          var lRemainder = Math.round(
            args.item['MeshCrossLen'] -
            args.item['MeshCO1'] -
            Math.floor(
              (args.item['MeshCrossLen'] - args.item['MeshCO1']) /
              args.item['ProdMWSpacing']
            ) *
            args.item['ProdMWSpacing']
          );
          if (lRemainder < args.item['ProdMWSpacing'] / 2) {
            args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
          } else {
            args.item['MeshCO2'] = lRemainder;
          }
        }

        lItem = args.item;
        if (
          lItem.MeshCO2 != null &&
          lItem.MeshCrossLen != null &&
          lItem.ProdMWSpacing != null
        ) {
          if (
            lItem.MeshCO2 > 0 &&
            lItem.MeshCrossLen > 0 &&
            lItem.ProdMWSpacing > 0
          ) {
            if (
              (lItem.MeshCrossLen - lItem.MeshCO2 - lItem.MeshCO1) %
              lItem.ProdMWSpacing !=
              0
            ) {
              alert('Invalid CO1 value.(输入无效的副筋边1)');
            }
          }
        }
      }
      if (lColumnName == 'MeshCO2' && args.item['MeshCO2'] > 0) {
        if (args.item['MeshCO2'] > 1000) {
          alert(
            'Cross wire onverhang cannot be greater than 1000. (副筋边长最长不可大于1000)'
          );
        }
        if (args.item['MeshCO2'] < 20) {
          alert(
            'Cross wire onverhang cannot be less than 20. (副筋边长最短不可小于20)'
          );
        }

        //CO2
        if (
          args.item['MeshCrossLen'] > 0 &&
          (args.item['MeshCO1'] == null || args.item['MeshCO1'] == 0) &&
          args.item['ProdMWSpacing'] > 0
        ) {
          var lRemainder = Math.round(
            args.item['MeshCrossLen'] -
            args.item['MeshCO2'] -
            Math.floor(
              (args.item['MeshCrossLen'] - args.item['MeshCO2']) /
              args.item['ProdMWSpacing']
            ) *
            args.item['ProdMWSpacing']
          );
          if (lRemainder < args.item['ProdMWSpacing'] / 2) {
            args.item['MeshCO1'] = args.item['ProdMWSpacing'] + lRemainder;
          } else {
            args.item['MeshCO1'] = lRemainder;
          }
        }

        lItem = args.item;
        if (
          lItem.MeshCO1 != null &&
          lItem.MeshCrossLen != null &&
          lItem.ProdMWSpacing != null
        ) {
          if (
            lItem.MeshCO1 > 0 &&
            lItem.MeshCrossLen > 0 &&
            lItem.ProdMWSpacing > 0
          ) {
            if (
              (lItem.MeshCrossLen - lItem.MeshCO1 - lItem.MeshCO2) %
              lItem.ProdMWSpacing !=
              0
            ) {
              alert('Invalid CO2 value. (输入无效的副筋边2)');
            }
          }
        }
      }
    }
    //Check MO
    if (lColumnName == 'MeshMO1' || lColumnName == 'MeshMO2') {
      if (lColumnName == 'MeshMO1' && args.item['MeshMO1'] > 0) {
        if (args.item['MeshMO1'] > 1200 && args.item['MeshMO2'] > 1200) {
          alert(
            'Both main wire onverhang cannot be greater than 1200. (两个主边长不可同时大于1200)'
          );
        }
        if (args.item['MeshMO1'] > 1800) {
          alert(
            'Main wire onverhang cannot be greater than 1800. (主边长不可大于1800)'
          );
        }
        if (args.item['MeshMO1'] < 20) {
          alert(
            'Main wire onverhang cannot be less than 20. (主边长不可小于20)'
          );
        }

        //MO2 default value
        if (
          args.item['MeshMainLen'] > 0 &&
          (args.item['MeshMO2'] == null || args.item['MeshMO2'] == 0) &&
          args.item['ProdCWSpacing'] > 0
        ) {
          var lRemainder = Math.round(
            args.item['MeshMainLen'] -
            args.item['MeshMO1'] -
            Math.floor(
              (args.item['MeshMainLen'] - args.item['MeshMO1']) /
              args.item['ProdCWSpacing']
            ) *
            args.item['ProdCWSpacing']
          );
          if (lRemainder < args.item['ProdCWSpacing'] / 2) {
            args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
          } else {
            args.item['MeshMO2'] = lRemainder;
          }
        }

        var lItem = args.item;
        if (
          lItem.MeshMO2 != null &&
          lItem.MeshMainLen != null &&
          lItem.ProdCWSpacing != null
        ) {
          if (
            lItem.MeshMO2 > 0 &&
            lItem.MeshMainLen > 0 &&
            lItem.ProdCWSpacing > 0
          ) {
            if (
              (lItem.MeshMainLen - lItem.MeshMO2 - lItem.MeshMO1) %
              lItem.ProdCWSpacing !=
              0
            ) {
              alert('Invalid MO1 value. (输入无效的主筋边1)');
            }
          }
        }
      }
      if (lColumnName == 'MeshMO2' && args.item['MeshMO2'] > 0) {
        if (args.item['MeshMO1'] > 1200 && args.item['MeshMO2'] > 1200) {
          alert(
            'Both main wire onverhang cannot be greater than 1200. (两个主边长不可同时大于1200)'
          );
        }
        if (args.item['MeshMO2'] > 1800) {
          alert(
            'Main wire onverhang cannot be greater than 1800. (主边长不可大于1800)'
          );
        }
        if (args.item['MeshMO2'] < 20) {
          alert(
            'Main wire onverhang cannot be less than 20. (主边长不可小于20)'
          );
        }

        //MO1 default value
        if (
          args.item['MeshMainLen'] > 0 &&
          (args.item['MeshMO1'] == null || args.item['MeshMO1'] == 0) &&
          args.item['ProdCWSpacing'] > 0
        ) {
          var lRemainder = Math.round(
            args.item['MeshMainLen'] -
            args.item['MeshMO2'] -
            Math.floor(
              (args.item['MeshMainLen'] - args.item['MeshMO2']) /
              args.item['ProdCWSpacing']
            ) *
            args.item['ProdCWSpacing']
          );
          if (lRemainder < args.item['ProdCWSpacing'] / 2) {
            args.item['MeshMO1'] = args.item['ProdCWSpacing'] + lRemainder;
          } else {
            args.item['MeshMO1'] = lRemainder;
          }
        }

        var lItem = args.item;
        if (
          lItem.MeshMO1 != null &&
          lItem.MeshMainLen != null &&
          lItem.ProdCWSpacing != null
        ) {
          if (
            lItem.MeshMO1 > 0 &&
            lItem.MeshMainLen > 0 &&
            lItem.ProdCWSpacing > 0
          ) {
            if (
              (lItem.MeshMainLen - lItem.MeshMO1 - lItem.MeshMO2) %
              lItem.ProdCWSpacing !=
              0
            ) {
              alert('Invalid MO2 value. (输入无效的主筋边2)');
            }
          }
        }
      }
    }
    //Check total length = sum(all parameters)
    if (
      (lColumnName.length == 1 ||
        lColumnName == 'HOOK' ||
        lColumnName == 'LEG') &&
      args.item['MeshMainLen'] != null &&
      args.item['MeshCrossLen'] != null
    ) {
      var lParaType = this.getListValue(
        args.item['MeshEditParameters'],
        args.item['MeshShapeParamTypes'],
        lColumnName
      );
      let lWireType = this.getListValue(
        args.item['MeshEditParameters'],
        args.item['MeshShapeWireTypes'],
        lColumnName
      );
      var lEmptyField = '';
      if ((lParaType == 'S' || lParaType == 'HK') && lWireType == 'M') {
        var lTotalLen = 0;
        if (args.item['MeshEditParameters'] != null) {
          var lParaA = args.item['MeshEditParameters'].split(',');
          var lParaTypeA = args.item['MeshShapeParamTypes'].split(',');
          var lWireTypeA = args.item['MeshShapeWireTypes'].split(',');
          var lFinish = 1;
          if (lParaA.length > 0) {
            for (let i = 0; i < lParaA.length; i++) {
              if (
                (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
                lWireTypeA[i] == 'M'
              ) {
                if (args.item[lParaA[i]] != null) {
                  if (args.item[lParaA[i]] > 0) {
                    lTotalLen = lTotalLen + parseInt(args.item[lParaA[i]]);
                    if (args.item[lParaA[i]] < 100) {
                      alert(
                        'Minimum value of parameters should be greater and equal to 100mm.'
                      );
                    }
                  } else {
                    if (lColumnName != lParaA[i] && lEmptyField == '') {
                      lEmptyField = lParaA[i];
                    }
                    lFinish = 0;
                  }
                } else {
                  if (lColumnName != lParaA[i] && lEmptyField == '') {
                    lEmptyField = lParaA[i];
                  }
                  lFinish = 0;
                }
              }
            }
            if (args.item['MeshMainLen'] > 0 && lFinish == 1) {
              var lFound = 0;
              var lRow = -1;
              for (let i = 0; i < lParaA.length; i++) {
                if (
                  (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
                  lWireTypeA[i] == 'M'
                ) {
                  if (lFound == 1) {
                    lRow = i;
                    break;
                  }
                  if (lParaA[i] == lColumnName) {
                    lFound = 1;
                  }
                }
              }
              if (lRow != -1) {
                args.item[lParaA[lRow]] =
                  parseInt(args.item[lParaA[lRow]]) +
                  args.item['MeshMainLen'] -
                  lTotalLen;
              } else {
                if (args.item['MeshMainLen'] != lTotalLen) {
                  alert(
                    'Invalid parameter value. The total values of main wire bending parameters is not equal to main wire length ' +
                    args.item['MeshMainLen'] +
                    '.(输入数据无效, 主筋的参数总值不等于主筋的长度' +
                    args.item['MeshMainLen'] +
                    ')'
                  );
                }
              }
            }
            if (
              args.item['MeshMainLen'] > 0 &&
              lFinish == 0 &&
              args.item['MeshMainLen'] - lTotalLen > 0
            ) {
              args.item[lEmptyField] = args.item['MeshMainLen'] - lTotalLen;
            }
          }
        }
      }

      //Check total length = sum(all parameters)
      if ((lParaType == 'S' || lParaType == 'HK') && lWireType == 'C') {
        var lTotalLen = 0;
        if (args.item['MeshEditParameters'] != null) {
          var lParaA = args.item['MeshEditParameters'].split(',');
          var lParaTypeA = args.item['MeshShapeParamTypes'].split(',');
          var lWireTypeA = args.item['MeshShapeWireTypes'].split(',');
          var lFinish = 1;
          if (lParaA.length > 0) {
            for (let i = 0; i < lParaA.length; i++) {
              if (
                (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
                lWireTypeA[i] == 'C'
              ) {
                if (args.item[lParaA[i]] != null) {
                  if (args.item[lParaA[i]] > 0) {
                    lTotalLen = lTotalLen + parseInt(args.item[lParaA[i]]);
                    if (args.item[lParaA[i]] < 100) {
                      alert(
                        'Minimum value of parameters should be greater and equal to 100mm.'
                      );
                    }
                  } else {
                    if (lColumnName != lParaA[i] && lEmptyField == '') {
                      lEmptyField = lParaA[i];
                    }
                    lFinish = 0;
                  }
                } else {
                  if (lColumnName != lParaA[i] && lEmptyField == '') {
                    lEmptyField = lParaA[i];
                  }
                  lFinish = 0;
                }
              }
            }
            if (args.item['MeshCrossLen'] > 0 && lFinish == 1) {
              var lFound = 0;
              var lRow = -1;
              for (let i = 0; i < lParaA.length; i++) {
                if (
                  (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
                  lWireTypeA[i] == 'C'
                ) {
                  if (lFound == 1) {
                    lRow = i;
                    break;
                  }
                  if (lParaA[i] == lColumnName) {
                    lFound = 1;
                  }
                }
              }
              if (lRow != -1) {
                args.item[lParaA[lRow]] =
                  parseInt(args.item[lParaA[lRow]]) +
                  args.item['MeshCrossLen'] -
                  lTotalLen;
              } else {
                if (args.item['MeshCrossLen'] != lTotalLen) {
                  alert(
                    'Invalid parameter value. The total values of main wire bending parameters is not equal to cross wire length ' +
                    args.item['MeshMainLen'] +
                    '.(输入数据无效, 主筋的参数总值不等于副筋的长度' +
                    args.item['MeshMainLen'] +
                    ')'
                  );
                }
              }

              //if (args.item["MeshCrossLen"] != lTotalLen) {
              //    alert("Invalid parameter value. The total values of cross wire bending parameters is not equal to cross wire length " + args.item["MeshCrossLen"] +
              //        ".(输入数据无效, 副筋的参数总值不等于副筋的长度" + args.item["MeshCrossLen"] + ")");
              //}
            }
            if (
              args.item['MeshCrossLen'] > 0 &&
              lFinish == 0 &&
              args.item['MeshCrossLen'] - lTotalLen > 0
            ) {
              args.item[lEmptyField] = args.item['MeshCrossLen'] - lTotalLen;
            }
          }
        }
      }
    }

    if (lColumnName == 'A') {
      var lShapeCode = args.item['MeshShapeCode'].value ? args.item['MeshShapeCode'].value : args.item['MeshShapeCode'];
      if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
        if (parseInt(args.item['A']) + 100 < args.item['MeshMainLen']) {
          var lCrossSpacing = args.item['ProdCWSpacing'];
          let lMO1 = args.item['MeshMO1'];

          if (!isNaN(args.item['A']) && lCrossSpacing > 0) {
            if (lMO1 < parseInt(args.item['A'])) {
              if ((parseInt(args.item['A']) - lMO1) % lCrossSpacing < 50) {
                lMO1 =
                  lMO1 +
                  50 -
                  ((parseInt(args.item['A']) - lMO1) % lCrossSpacing);
                if (lMO1 >= lCrossSpacing + 50) {
                  lMO1 = lMO1 - lCrossSpacing;
                }
                args.item['MeshMO1'] = lMO1;

                var lRemainder = Math.round(
                  args.item['MeshMainLen'] -
                  args.item['MeshMO1'] -
                  Math.floor(
                    (args.item['MeshMainLen'] - args.item['MeshMO1']) /
                    args.item['ProdCWSpacing']
                  ) *
                  args.item['ProdCWSpacing']
                );

                if (lRemainder < args.item['ProdCWSpacing'] / 2) {
                  args.item['MeshMO2'] =
                    args.item['ProdCWSpacing'] + lRemainder;
                } else {
                  args.item['MeshMO2'] = lRemainder;
                }
              } else if (
                lCrossSpacing -
                ((parseInt(args.item['A']) - lMO1) % lCrossSpacing) <
                50
              ) {
                lMO1 =
                  lMO1 -
                  (50 -
                    (lCrossSpacing -
                      ((parseInt(args.item['A']) - lMO1) % lCrossSpacing)));
                if (lMO1 >= lCrossSpacing + 50) {
                  lMO1 = lMO1 - lCrossSpacing;
                }
                args.item['MeshMO1'] = lMO1;

                var lRemainder = Math.round(
                  args.item['MeshMainLen'] -
                  args.item['MeshMO1'] -
                  Math.floor(
                    (args.item['MeshMainLen'] - args.item['MeshMO1']) /
                    args.item['ProdCWSpacing']
                  ) *
                  args.item['ProdCWSpacing']
                );

                if (lRemainder < args.item['ProdCWSpacing'] / 2) {
                  args.item['MeshMO2'] =
                    args.item['ProdCWSpacing'] + lRemainder;
                } else {
                  args.item['MeshMO2'] = lRemainder;
                }
              }
            } else {
              lMO1 = parseInt(args.item['A']) + 200;
              args.item['MeshMO1'] = lMO1;

              var lRemainder = Math.round(
                args.item['MeshMainLen'] -
                args.item['MeshMO1'] -
                Math.floor(
                  (args.item['MeshMainLen'] - args.item['MeshMO1']) /
                  args.item['ProdCWSpacing']
                ) *
                args.item['ProdCWSpacing']
              );

              if (lRemainder < args.item['ProdCWSpacing'] / 2) {
                args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
              } else {
                args.item['MeshMO2'] = lRemainder;
              }
            }
          }
        }
      } else if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
        if (parseInt(args.item['A']) + 100 < args.item['MeshCrossLen']) {
          var lCrossSpacing = args.item['ProdMWSpacing'];
          let lCO1 = args.item['MeshCO1'];

          if (!isNaN(args.item['A']) && lCrossSpacing > 0) {
            if (lCO1 < parseInt(args.item['A'])) {
              if ((parseInt(args.item['A']) - lCO1) % lCrossSpacing < 50) {
                lCO1 =
                  lCO1 +
                  50 -
                  ((parseInt(args.item['A']) - lCO1) % lCrossSpacing);
                if (lCO1 >= lCrossSpacing + 50) {
                  lCO1 = lCO1 - lCrossSpacing;
                }
                args.item['MeshCO1'] = lCO1;

                var lRemainder = Math.round(
                  args.item['MeshCrossLen'] -
                  args.item['MeshCO1'] -
                  Math.floor(
                    (args.item['MeshCrossLen'] - args.item['MeshCO1']) /
                    args.item['ProdMWSpacing']
                  ) *
                  args.item['ProdMWSpacing']
                );

                if (lRemainder < args.item['ProdMWSpacing'] / 2) {
                  args.item['MeshCO2'] =
                    args.item['ProdMWSpacing'] + lRemainder;
                } else {
                  args.item['MeshCO2'] = lRemainder;
                }
              } else if (
                lCrossSpacing -
                ((parseInt(args.item['A']) - lCO1) % lCrossSpacing) <
                50
              ) {
                lCO1 =
                  lCO1 -
                  (50 -
                    (lCrossSpacing -
                      ((parseInt(args.item['A']) - lCO1) % lCrossSpacing)));
                if (lCO1 >= lCrossSpacing + 50) {
                  lCO1 = lCO1 - lCrossSpacing;
                }
                args.item['MeshCO1'] = lCO1;

                var lRemainder = Math.round(
                  args.item['MeshCrossLen'] -
                  args.item['MeshCO1'] -
                  Math.floor(
                    (args.item['MeshCrossLen'] - args.item['MeshCO1']) /
                    args.item['ProdCWSpacing']
                  ) *
                  args.item['ProdCWSpacing']
                );

                if (lRemainder < args.item['ProdMWSpacing'] / 2) {
                  args.item['MeshCO2'] =
                    args.item['ProdMWSpacing'] + lRemainder;
                } else {
                  args.item['MeshCO2'] = lRemainder;
                }
              }
            } else {
              lCO1 = parseInt(args.item['A']) + 200;
              args.item['MeshCO1'] = lCO1;

              var lRemainder = Math.round(
                args.item['MeshCrossLen'] -
                args.item['MeshCO1'] -
                Math.floor(
                  (args.item['MeshCrossLen'] - args.item['MeshCO1']) /
                  args.item['ProdMWSpacing']
                ) *
                args.item['ProdMWSpacing']
              );

              if (lRemainder < args.item['ProdMWSpacing'] / 2) {
                args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
              } else {
                args.item['MeshCO2'] = lRemainder;
              }
            }
          }
        }
      } else if (lShapeCode == '2M1' || lShapeCode == '2MR1') {
        var lRemainder = Math.round(
          args.item['MeshMainLen'] -
          Math.floor(args.item['MeshMainLen'] / args.item['ProdCWSpacing']) *
          args.item['ProdCWSpacing']
        );
        if (args.item['MeshMainLen'] > args.item['ProdCWSpacing'] + 100) {
          if (args.item['ProdCWSpacing'] > 0) {
            var lMO1 =
              5 *
              Math.round(
                (args.item['ProdCWSpacing'] / 2 +
                  (parseInt(args.item['A']) % args.item['ProdCWSpacing'])) /
                5
              );
            //if (lMO1 < args.item["ProdCWSpacing"] / 2) {
            //    lMO1 = lMO1 + args.item["ProdCWSpacing"] / 2;
            //}
            args.item['MeshMO1'] = lMO1;
            var lRemainder = Math.round(
              args.item['MeshMainLen'] -
              lMO1 -
              Math.floor(
                (args.item['MeshMainLen'] - lMO1) / args.item['ProdCWSpacing']
              ) *
              args.item['ProdCWSpacing']
            );

            if (lRemainder < args.item['ProdCWSpacing'] / 2) {
              args.item['MeshMO2'] = args.item['ProdCWSpacing'] + lRemainder;
            } else {
              args.item['MeshMO2'] = lRemainder;
            }
          }
        } else {
          alert('Invalid main wire length. ');
        }
      } else if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
        var lRemainder = Math.round(
          args.item['MeshCrossLen'] -
          Math.floor(args.item['MeshCrossLen'] / args.item['ProdMWSpacing']) *
          args.item['ProdMWSpacing']
        );
        if (args.item['MeshCrossLen'] > args.item['ProdMWSpacing'] + 100) {
          if (args.item['ProdMWSpacing'] > 0) {
            var lCO1 =
              5 *
              Math.round(
                (args.item['ProdMWSpacing'] / 2 +
                  (parseInt(args.item['A']) % args.item['ProdMWSpacing'])) /
                5
              );

            //if (lCO1 < args.item["ProdMWSpacing"] / 2) {
            //    lCO1 = lCO1 + args.item["ProdMWSpacing"] / 2;
            //}
            args.item['MeshCO1'] = lCO1;
            var lRemainder = Math.round(
              args.item['MeshCrossLen'] -
              lCO1 -
              Math.floor(
                (args.item['MeshCrossLen'] - lCO1) /
                args.item['ProdMWSpacing']
              ) *
              args.item['ProdMWSpacing']
            );

            if (lRemainder < args.item['ProdMWSpacing'] / 2) {
              args.item['MeshCO2'] = args.item['ProdMWSpacing'] + lRemainder;
            } else {
              args.item['MeshCO2'] = lRemainder;
            }
          }
        } else {
          alert('Invalid cross wire length. ');
        }
      }
    }
    //end of CTS MESH

    //calculate weight
    if (
      lColumnName == 'MeshMainLen' ||
      lColumnName == 'MeshCrossLen' ||
      lColumnName == 'MeshMemberQty' ||
      lColumnName == 'MeshProduct'
    ) {
      args.item['MeshTotalWT'] = this.calWeightOthers(args.item).toFixed(3);
      this.refreshInfo(args);
    }

    this.ChangeInd = this.ChangeInd + 1;
    this.dataViewCTS.beginUpdate();
    this.dataViewCTS.updateItem(args.item.id, args.item);
    this.dataViewCTS.endUpdate();
    this.gCurrentRow = args.grid.getActiveCell().row;

    args.grid.invalidateRow(this.gCurrentRow);
    args.grid.render();
    // args.grid.setSelectedRows([this.gCurrentRow])
    args.grid.focus();
  }

  getProductCode(): void {
    this.lProductList = '';
    this.orderService.getOthersProductCode_ctsmesh().subscribe({
      next: (response) => {
        console.log('getProductCode', response);
        this.productCodeList = response;
        // this.gOthersProdCode=this.productCodeList;
        if (response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            //debugger;
            if (this.lProductList.length != 0) {
              this.lProductList =
                this.lProductList + ',' + this.productCodeList[i].value;
              // gOthersProdWTArea = gOthersProdWTArea + "," + this.productCodeList[i].MeshWeightArea;
            } else {
              this.lProductList = this.productCodeList[i].value;
              // gOthersProdWTArea = gOthersProdWTArea + "," + this.productCodeList[i].MeshWeightArea;
            }
            // gOthersProdWTArea = gOthersProdWTArea + "," + this.productCodeList[i].MeshWeightArea;
          }
          this.gOthersProdCode = this.lProductList;
        }
        //console.log('DONE', this.gOthersProdCode);
      },
      error: (e) => { },
      complete: () => {
        return this.gOthersProdCode;
        // this.loading = false;
      },
    });
    // let lweighareatemp="";
    this.lweighareatemp = '';
    this.orderService.getOthersProductCode_ctsmesh_weight().subscribe({
      next: (response) => {
        //console.log('Weight', response);
        this.productCodeList = response;
        // this.gOthersProdCode=this.productCodeList;
        if (response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            //debugger;
            if (this.lweighareatemp != '') {
              this.lweighareatemp =
                this.lweighareatemp + ',' + this.productCodeList[i].value;
              // gOthersProdWTArea = gOthersProdWTArea + "," + this.productCodeList[i].MeshWeightArea;
            } else {
              this.lweighareatemp = this.productCodeList[i].value;
              // gOthersProdWTArea = gOthersProdWTArea + "," + this.productCodeList[i].MeshWeightArea;
            }
            // gOthersProdWTArea = gOthersProdWTArea + "," + this.productCodeList[i].MeshWeightArea;
          }
          this.gOthersProdWTArea = this.lweighareatemp;
        }
        //console.log('DONE', this.gOthersProdWTArea);
      },
      error: (e) => { },
      complete: () => {
        return this.gOthersProdWTArea;
        // this.loading = false;
      },
    });
    // return this.gOthersProdCode;
  }

  gshapeImage: any = [];
  Gshapecodelist: any = [];
  Gshapecode: any;
  getShapeInfo() {
    this.orderService
      .getShapeInfo_ctsmesh(
        this.CustomerCode,
        this.ProjectCode,
        this.JobID,
        this.tableInput.MeshShapeCode
      )
      .subscribe({
        next: (response) => {
          //console.log('productCodeInfo', response);
          this.shapeInfo = response;
          this.tableInput.MeshShapeCode = this.shapeInfo.MeshShapeCode;
          // this.lShapeparameters=this.shapeInfo.lShapeparameters;
          this.tableInput.MeshShapeMinValues =
            this.shapeInfo.MeshShapeMinValues;
          this.tableInput.MeshShapeMaxValues =
            this.shapeInfo.MeshShapeMaxValues;
          this.tableInput.MeshShapeParameters =
            this.shapeInfo.MeshShapeParameters;
          this.tableInput.MeshEditParameters =
            this.shapeInfo.MeshEditParameters;
          this.tableInput.MeshShapeParamTypes =
            this.shapeInfo.MeshShapeParamTypes;
          this.tableInput.MeshShapeWireTypes =
            this.shapeInfo.MeshShapeWireTypes;
          // this.gshapeImage[this.SrNo].push(this.shapeInfo.MeshShapeImage);
          // this.tableInput.MeshMO1=this.shapeInfo.MeshCreepMO1;
          // this.tableInput.MeshCO1=this.shapeInfo.gMeshCreepCO1;
          this.columnheader = this.shapeInfo.MeshEditParameters;
          // this.SrNo+=1;
          this.Gshapecodelist.push(this.shapeInfo.MeshShapeCode);
          this.visibleparameters();
          //console.log(this.shapeInfo);
          this.gshapecode = this.shapeInfo.MeshShapeCode;
        },
        error: (e) => { },
        complete: () => {
          // this.loading = false;
        },
      });
  }
  // getShapeCodeListData(callback:(options:{value:any;label:string}[])=>void){
  //   setTimeout(()=>{

  //     callback(this.getShapeCodes());
  //   },2000);
  // }
  getProductInfo() {
    let ProductInfo: any;
    this.orderService
      .getProductInfo_ctsmesh(this.tableInput.MeshProduct)
      .subscribe({
        next: (response) => {
          //console.log('productCodeInfo', response);
          ProductInfo = response;
          this.tableInput.MeshProduct = ProductInfo.ProductCode;
          this.tableInput.ProdMWDia = ProductInfo.ProdMWDia;
          this.tableInput.ProdMWSpacing = ProductInfo.ProdMWSpacing;
          this.tableInput.ProdCWDia = ProductInfo.ProdCWDia;
          this.tableInput.ProdCWSpacing = ProductInfo.ProdCWSpacing;
          this.tableInput.ProdMass = ProductInfo.ProdMass;
          this.tableInput.ProdMinFactor = ProductInfo.ProdTwinInd;
          //console.log(this.shapeInfo);
        },
        error: (e) => { },
        complete: () => {
          // this.loading = false;
        },
      });
  }

  srno: any = 0;
  gshapecode = '';
  lShapeparameters: any;

  // loadsampledata(columnname: any) {
  //   //debugger;
  //   this.tableInput.MeshMemberQty = 1;
  //   if (this.bbsOrderTable.length != this.srno) {
  //     this.srno = this.srno + 1;
  //   }
  //   let lcolumnname = columnname;
  //   let bbsid = this.BBSID;
  //   let lshapecode = this.tableInput.MeshShapeCode;

  //   //get shape info and Clear the rest of parameters value
  //   if (lcolumnname == 'MeshShapeCode') {
  //     var lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode != null && lShapeCode != '') {
  //       if (lshapecode != this.Gshapecode) {
  //         this.getShapeInfo();
  //       } else {
  //         // args.item.MeshShapeParameters = gShapeParameters;
  //         // args.item.MeshEditParameters = gShapeEditParameters;
  //         // args.item.MeshShapeParamTypes = gShapeParamTypes;
  //         // args.item.MeshShapeMinValues = gShapeMinValues;
  //         // args.item.MeshShapeMaxValues = gShapeMaxValues;
  //         // args.item.MeshShapeWireTypes = gShapeWireTypes;
  //         // $("#rightShapeImage").show();
  //         // $("#btmShapeImage").show();
  //       }
  //       var lParameters = this.tableInput.MeshShapeParameters;
  //       if (lParameters != null && lParameters != '') {
  //         for (let k = 0; k < 26; k++) {
  //           // if (lParameters.indexOf(String.fromCharCode(k + "A".charCodeAt(0))) < 0) {
  //           //     if (args.item[String.fromCharCode(k + "A".charCodeAt(0))] != null) {
  //           //         args.item[String.fromCharCode(k + "A".charCodeAt(0))] = null;
  //           //     }
  //           // }
  //         }
  //       }
  //     } else {
  //       // $("#rightShapeImage").hide();
  //       // $("#btmShapeImage").hide();
  //     }
  //   }

  //   if (lcolumnname == 'MeshProduct') {
  //     var lProdCode = this.tableInput.MeshProduct;
  //     if (lProdCode != null && lProdCode != '') {
  //       if (true) {
  //         this.getProductInfo();
  //       }
  //       // args.item.ProdMWDia = gProdMWDia;
  //       // args.item.ProdMWSpacing = gProdMWSpacing;
  //       // args.item.ProdCWDia = gProdCWDia;
  //       // args.item.ProdCWSpacing = gProdCWSpacing;
  //       // args.item.ProdMass = gProdMass;
  //       // args.item.ProdMinFactor = gProdMinFactor;
  //       // args.item.ProdTwinInd = gProdTwinInd;
  //       //need to modify below
  //       // (<HTMLDivElement>document.getElementById("rt_MWDia")).innerHTML = gProdMWDia;
  //       // (<HTMLDivElement>document.getElementById("bt_MWDia")).innerHTML = gProdMWDia;

  //       this.MWDiameter = this.tableInput.ProdMWDia;

  //       if (this.tableInput.ProdTwinInd == 'M') {
  //         // (<HTMLDivElement>document.getElementById("rt_MWSpacing")).innerHTML = gProdMWSpacing + "(Twin)";
  //         // (<HTMLDivElement>document.getElementById("bt_MWSpacing")).innerHTML = gProdMWSpacing + "(Twin)";
  //         this.MWSpacing = this.tableInput.ProdMWSpacing + '(Twin)';
  //       } else {
  //         this.MWSpacing = this.tableInput.ProdMWSpacing;
  //         // (<HTMLDivElement>document.getElementById("rt_MWSpacing")).innerHTML = gProdMWSpacing;
  //         // (<HTMLDivElement>document.getElementById("bt_MWSpacing")).innerHTML = gProdMWSpacing;
  //       }

  //       // (<HTMLDivElement>document.getElementById("rt_CWDia")).innerHTML = gProdCWDia;
  //       // (<HTMLDivElement>document.getElementById("bt_CWDia")).innerHTML = gProdCWDia;
  //       this.CWDiameter = this.tableInput.ProdCWDia;

  //       //     (<HTMLDivElement>document.getElementById("rt_CWSpacing")).innerHTML = gProdCWSpacing;
  //       //     (<HTMLDivElement>document.getElementById("bt_CWSpacing")).innerHTML = gProdCWSpacing;
  //       this.CWSpacing = this.tableInput.ProdCWSpacing;

  //       //     (<HTMLDivElement>document.getElementById("rt_mass")).innerHTML = gProdMass;
  //       //     (<HTMLDivElement>document.getElementById("bt_mass")).innerHTML = gProdMass;
  //     } else {
  //       // (<HTMLDivElement>document.getElementById("rt_MWDia")).innerHTML = "";
  //       // (<HTMLDivElement>document.getElementById("bt_MWDia")).innerHTML = "";
  //       this.MWDiameter = '';

  //       // (<HTMLDivElement>document.getElementById("rt_MWSpacing")).innerHTML = "";
  //       // (<HTMLDivElement>document.getElementById("bt_MWSpacing")).innerHTML = "";
  //       this.MWSpacing = '';

  //       // (<HTMLDivElement>document.getElementById("rt_CWDia")).innerHTML = "";
  //       // (<HTMLDivElement>document.getElementById("bt_CWDia")).innerHTML = "";
  //       this.CWDiameter = '';

  //       // (<HTMLDivElement>document.getElementById("rt_CWSpacing")).innerHTML = "";
  //       // (<HTMLDivElement>document.getElementById("bt_CWSpacing")).innerHTML = "";

  //       this.CWSpacing = '';
  //       // (<HTMLDivElement>document.getElementById("rt_mass")).innerHTML = "";
  //       // (<HTMLDivElement>document.getElementById("bt_mass")).innerHTML = "";
  //       this.Mass = '';
  //     }
  //   }

  //   if (lcolumnname == 'MeshProduct' || lcolumnname == 'MeshMark') {
  //     if (
  //       this.tableInput.MeshMainLen == null ||
  //       this.tableInput.MeshMainLen == 0 ||
  //       this.tableInput.MeshMainLen == 0
  //     ) {
  //       this.tableInput.MeshMainLen = 6000;
  //     }
  //     if (
  //       this.tableInput.MeshCrossLen == null ||
  //       this.tableInput.MeshCrossLen == 0 ||
  //       this.tableInput.MeshCrossLen == 0
  //     ) {
  //       this.tableInput.MeshCrossLen = 2400;
  //     }
  //     if (
  //       this.tableInput.MeshShapeCode == null ||
  //       this.tableInput.MeshShapeCode == ''
  //     ) {
  //       this.tableInput.MeshShapeCode = 'F';
  //       this.tableInput.A = 6000;

  //       if (this.tableInput.ProdCWSpacing > 0) {
  //         var lMO1 =
  //           5 *
  //           Math.round(
  //             (this.tableInput.MeshMainLen % this.tableInput.ProdCWSpacing) / 10
  //           );
  //         if (lMO1 < 100) {
  //           lMO1 = 100;
  //         }
  //         if (lMO1 < this.tableInput.ProdCWSpacing / 2) {
  //           lMO1 = lMO1 + this.tableInput.ProdCWSpacing / 2;
  //         }
  //         this.tableInput.MeshMO1 = lMO1;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             lMO1 -
  //             Math.floor(
  //               (this.tableInput.MeshMainLen - lMO1) /
  //                 this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //           this.tableInput.MeshMO2 =
  //             this.tableInput.ProdCWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshMO2 = lRemainder;
  //         }
  //       }

  //       if (this.tableInput.ProdMWSpacing > 0) {
  //         var lCO1 =
  //           5 *
  //           Math.round(
  //             (this.tableInput.MeshCrossLen % this.tableInput.ProdMWSpacing) /
  //               10
  //           );
  //         if (lCO1 < 100) {
  //           lCO1 = 100;
  //         }
  //         if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //           lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //         }
  //         this.tableInput.MeshCO1 = lCO1;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             lCO1 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - lCO1) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO2 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO2 = lRemainder;
  //         }
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshMainLen' || lcolumnname == 'MeshProduct') {
  //     if (this.tableInput.MeshShapeCode == null) {
  //       this.tableInput.MeshShapeCode = 'F';
  //     }

  //     if (
  //       lcolumnname == 'MeshMainLen' &&
  //       this.tableInput.MeshShapeCode == 'F'
  //     ) {
  //       this.tableInput.A = this.tableInput.MeshMainLen;
  //     }

  //     var lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //       if (this.tableInput.A + 100 < this.tableInput.MeshMainLen) {
  //         this.tableInput.MeshMO1 = this.tableInput.A + 200;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             this.tableInput.MeshMO1 -
  //             Math.floor(
  //               (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                 this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //           this.tableInput.MeshMO2 =
  //             this.tableInput.ProdCWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshMO2 = lRemainder;
  //         }
  //       }
  //     } else {
  //       var lRemainder = Math.round(
  //         this.tableInput.MeshMainLen -
  //           Math.floor(
  //             this.tableInput.MeshMainLen / this.tableInput.ProdCWSpacing
  //           ) *
  //             this.tableInput.ProdCWSpacing
  //       );
  //       if (this.tableInput.MeshMainLen > this.tableInput.ProdCWSpacing + 100) {
  //         if (this.tableInput.ProdCWSpacing > 0) {
  //           var lMO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.ProdCWSpacing / 2 +
  //                 (this.tableInput.MeshMainLen %
  //                   this.tableInput.ProdCWSpacing)) /
  //                 10
  //             );
  //           //if (lMO1 < this.tableInput.ProdCWSpacing / 2) {
  //           //    lMO1 = lMO1 + this.tableInput.ProdCWSpacing / 2;
  //           //}
  //           if (lMO1 < 100) {
  //             lMO1 = 100;
  //           }
  //           this.tableInput.MeshMO1 = lMO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshMainLen -
  //               lMO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshMainLen - lMO1) /
  //                   this.tableInput.ProdCWSpacing
  //               ) *
  //                 this.tableInput.ProdCWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //             this.tableInput.MeshMO2 =
  //               this.tableInput.ProdCWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshMO2 = lRemainder;
  //           }
  //         }
  //       } else {
  //         alert('Invalid main wire length. ');
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshCrossLen' || lcolumnname == 'MeshProduct') {
  //     if (this.tableInput.MeshShapeCode == null) {
  //       this.tableInput.MeshShapeCode = 'F';
  //     }

  //     var lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //       //if ((this.tableInput.MeshCrossLen - 400) % this.tableInput.ProdMWSpacing == 0) {
  //       //    this.tableInput.MeshCO1 = 330;
  //       //    this.tableInput.MeshCO2 = 70;
  //       //} else {
  //       //    this.tableInput.MeshCO1 = 430;
  //       //    this.tableInput.MeshCO2 = 70 + (this.tableInput.MeshCrossLen - 500) % this.tableInput.ProdMWSpacing;
  //       //}
  //       if (this.tableInput.A + 100 < this.tableInput.MeshCrossLen) {
  //         this.tableInput.MeshCO1 = this.tableInput.A + 200;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             this.tableInput.MeshCO1 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - this.tableInput.MeshCO1) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO2 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO2 = lRemainder;
  //         }
  //       }
  //     } else if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
  //       //if ((this.tableInput.MeshCrossLen - 800) % this.tableInput.ProdMWSpacing == 0) {
  //       //    this.tableInput.MeshCO1 = 380;
  //       //    this.tableInput.MeshCO2 = 420;
  //       //} else {
  //       //    this.tableInput.MeshCO1 = 430;
  //       //    this.tableInput.MeshCO2 = 470 + (this.tableInput.MeshCrossLen - 900) % this.tableInput.ProdMWSpacing;
  //       //}
  //       var lRemainder = Math.round(
  //         this.tableInput.MeshCrossLen -
  //           Math.floor(
  //             this.tableInput.MeshCrossLen / this.tableInput.ProdMWSpacing
  //           ) *
  //             this.tableInput.ProdMWSpacing
  //       );
  //       if (
  //         this.tableInput.MeshCrossLen >
  //         this.tableInput.ProdMWSpacing + 100
  //       ) {
  //         if (this.tableInput.ProdMWSpacing > 0) {
  //           var lCO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.MeshCrossLen % this.tableInput.ProdMWSpacing) /
  //                 10
  //             );
  //           //if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //           //    lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //           //}
  //           if (lCO1 < 100) {
  //             lCO1 = 100;
  //           }
  //           this.tableInput.MeshCO1 = lCO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshCrossLen -
  //               lCO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshCrossLen - lCO1) /
  //                   this.tableInput.ProdMWSpacing
  //               ) *
  //                 this.tableInput.ProdMWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //             this.tableInput.MeshCO2 =
  //               this.tableInput.ProdMWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshCO2 = lRemainder;
  //           }
  //         }
  //       } else {
  //         alert('Invalid cross wire length. ');
  //       }
  //     } else {
  //       if (this.tableInput.ProdMWSpacing > 0) {
  //         var lCO1 =
  //           5 *
  //           Math.round(
  //             (this.tableInput.MeshCrossLen % this.tableInput.ProdMWSpacing) /
  //               10
  //           );
  //         if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //           lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //         }
  //         if (lCO1 < 100) {
  //           lCO1 = 100;
  //         }
  //         this.tableInput.MeshCO1 = lCO1;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             lCO1 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - lCO1) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO2 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO2 = lRemainder;
  //         }
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshMainLen') {
  //     var lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == null) {
  //       lShapeCode = '';
  //     }

  //     var lFound = 0;
  //     if (lShapeCode != 'F') {
  //       var lWireType = this.tableInput.MeshShapeWireTypes;
  //       var lWireTypeA = lWireType.split(',');
  //       if (lWireTypeA.length > 0) {
  //         for (i = 0; i < lWireTypeA.length; i++) {
  //           if (lWireTypeA[i] == 'M') {
  //             lFound = 1;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //     if (lFound == 1 || lShapeCode == 'F') {
  //       if (this.tableInput.A != 0) {
  //         this.tableInput.A = 0;
  //       }
  //       if (this.tableInput.B != 0) {
  //         this.tableInput.B = 0;
  //       }
  //       if (this.tableInput.C != 0) {
  //         this.tableInput.C = 0;
  //       }
  //       if (this.tableInput.D != 0) {
  //         this.tableInput.D = 0;
  //       }
  //       if (this.tableInput.E != 0) {
  //         this.tableInput.E = 0;
  //       }
  //       if (this.tableInput.F != 0) {
  //         this.tableInput.F = 0;
  //       }
  //       if (this.tableInput.G != 0) {
  //         this.tableInput.G = 0;
  //       }
  //       if (this.tableInput.H != 0) {
  //         this.tableInput.H = 0;
  //       }
  //       if (this.tableInput.I != 0) {
  //         this.tableInput.I = 0;
  //       }
  //       if (this.tableInput.J != 0) {
  //         this.tableInput.J = 0;
  //       }
  //       if (this.tableInput.K != 0) {
  //         this.tableInput.K = 0;
  //       }
  //       if (this.tableInput.L != 0) {
  //         this.tableInput.L = 0;
  //       }
  //       if (this.tableInput.M != 0) {
  //         this.tableInput.M = 0;
  //       }
  //       if (this.tableInput.N != 0) {
  //         this.tableInput.N = 0;
  //       }
  //       if (this.tableInput.O != 0) {
  //         this.tableInput.O = 0;
  //       }
  //       if (this.tableInput.P != 0) {
  //         this.tableInput.P = 0;
  //       }
  //       if (this.tableInput.Q != 0) {
  //         this.tableInput.Q = 0;
  //       }
  //       if (this.tableInput.R != 0) {
  //         this.tableInput.R = 0;
  //       }
  //       if (this.tableInput.S != 0) {
  //         this.tableInput.S = 0;
  //       }
  //       if (this.tableInput.T != 0) {
  //         this.tableInput.T = 0;
  //       }
  //       if (this.tableInput.U != 0) {
  //         this.tableInput.U = 0;
  //       }
  //       if (this.tableInput.V != 0) {
  //         this.tableInput.V = 0;
  //       }
  //       if (this.tableInput.W != 0) {
  //         this.tableInput.W = 0;
  //       }
  //       if (this.tableInput.X != 0) {
  //         this.tableInput.X = 0;
  //       }
  //       if (this.tableInput.Y != 0) {
  //         this.tableInput.Y = 0;
  //       }
  //       if (this.tableInput.Z != 0) {
  //         this.tableInput.Z = 0;
  //       }
  //     }

  //     if (
  //       lShapeCode == '1M1' ||
  //       lShapeCode == '1MR1' ||
  //       lShapeCode == '2M1' ||
  //       lShapeCode == '2MR1' ||
  //       lShapeCode == 'F'
  //     ) {
  //       if (lShapeCode == 'F') {
  //         this.tableInput.A = this.tableInput.MeshMainLen;
  //       }

  //       if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //         this.tableInput.A = 200;
  //         this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //       }

  //       // if (lShapeCode == "1C1" || lShapeCode == "1CR1") {
  //       //     this.tableInput.A = 200;
  //       //     this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //       // }
  //     }
  //   }

  //   if (lcolumnname == 'MeshCrossLen') {
  //     var lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == null) {
  //       lShapeCode = '';
  //     }

  //     var lFound = 0;

  //     if (lShapeCode != 'F') {
  //       var lWireType = this.tableInput.MeshShapeWireTypes;
  //       var lWireTypeA = lWireType.split(',');
  //       if (lWireTypeA.length > 0) {
  //         for (i = 0; i < lWireTypeA.length; i++) {
  //           if (lWireTypeA[i] == 'C') {
  //             lFound = 1;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //     if (lFound == 1) {
  //       if (this.tableInput.A != 0) {
  //         this.tableInput.A = 0;
  //       }
  //       if (this.tableInput.B != 0) {
  //         this.tableInput.B = 0;
  //       }
  //       if (this.tableInput.C != 0) {
  //         this.tableInput.C = 0;
  //       }
  //       if (this.tableInput.D != 0) {
  //         this.tableInput.D = 0;
  //       }
  //       if (this.tableInput.E != 0) {
  //         this.tableInput.E = 0;
  //       }
  //       if (this.tableInput.F != 0) {
  //         this.tableInput.F = 0;
  //       }
  //       if (this.tableInput.G != 0) {
  //         this.tableInput.G = 0;
  //       }
  //       if (this.tableInput.H != 0) {
  //         this.tableInput.H = 0;
  //       }
  //       if (this.tableInput.I != 0) {
  //         this.tableInput.I = 0;
  //       }
  //       if (this.tableInput.J != 0) {
  //         this.tableInput.J = 0;
  //       }
  //       if (this.tableInput.K != 0) {
  //         this.tableInput.K = 0;
  //       }
  //       if (this.tableInput.L != 0) {
  //         this.tableInput.L = 0;
  //       }
  //       if (this.tableInput.M != 0) {
  //         this.tableInput.M = 0;
  //       }
  //       if (this.tableInput.N != 0) {
  //         this.tableInput.N = 0;
  //       }
  //       if (this.tableInput.O != 0) {
  //         this.tableInput.O = 0;
  //       }
  //       if (this.tableInput.P != 0) {
  //         this.tableInput.P = 0;
  //       }
  //       if (this.tableInput.Q != 0) {
  //         this.tableInput.Q = 0;
  //       }
  //       if (this.tableInput.R != 0) {
  //         this.tableInput.R = 0;
  //       }
  //       if (this.tableInput.S != 0) {
  //         this.tableInput.S = 0;
  //       }
  //       if (this.tableInput.T != 0) {
  //         this.tableInput.T = 0;
  //       }
  //       if (this.tableInput.U != 0) {
  //         this.tableInput.U = 0;
  //       }
  //       if (this.tableInput.V != 0) {
  //         this.tableInput.V = 0;
  //       }
  //       if (this.tableInput.W != 0) {
  //         this.tableInput.W = 0;
  //       }
  //       if (this.tableInput.X != 0) {
  //         this.tableInput.X = 0;
  //       }
  //       if (this.tableInput.Y != 0) {
  //         this.tableInput.Y = 0;
  //       }
  //       if (this.tableInput.Z != 0) {
  //         this.tableInput.Z = 0;
  //       }
  //     }

  //     if (
  //       lShapeCode == '1C1' ||
  //       lShapeCode == '1CR1' ||
  //       lShapeCode == '2C1' ||
  //       lShapeCode == '2CR1'
  //     ) {
  //       if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //         this.tableInput.A = 200;
  //         this.tableInput.B = this.tableInput.MeshCrossLen - 200;
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshShapeCode') {
  //     let lShapeCode = this.tableInput.MeshShapeCode;
  //     if (this.tableInput.A != 0) {
  //       this.tableInput.A = 0;
  //     }
  //     if (this.tableInput.B != 0) {
  //       this.tableInput.B = 0;
  //     }
  //     if (this.tableInput.C != 0) {
  //       this.tableInput.C = 0;
  //     }
  //     if (this.tableInput.D != 0) {
  //       this.tableInput.D = 0;
  //     }
  //     if (this.tableInput.E != 0) {
  //       this.tableInput.E = 0;
  //     }
  //     if (this.tableInput.F != 0) {
  //       this.tableInput.F = 0;
  //     }
  //     if (this.tableInput.G != 0) {
  //       this.tableInput.G = 0;
  //     }
  //     if (this.tableInput.H != 0) {
  //       this.tableInput.H = 0;
  //     }
  //     if (this.tableInput.I != 0) {
  //       this.tableInput.I = 0;
  //     }
  //     if (this.tableInput.J != 0) {
  //       this.tableInput.J = 0;
  //     }
  //     if (this.tableInput.K != 0) {
  //       this.tableInput.K = 0;
  //     }
  //     if (this.tableInput.L != 0) {
  //       this.tableInput.L = 0;
  //     }
  //     if (this.tableInput.M != 0) {
  //       this.tableInput.M = 0;
  //     }
  //     if (this.tableInput.N != 0) {
  //       this.tableInput.N = 0;
  //     }
  //     if (this.tableInput.O != 0) {
  //       this.tableInput.O = 0;
  //     }
  //     if (this.tableInput.P != 0) {
  //       this.tableInput.P = 0;
  //     }
  //     if (this.tableInput.Q != 0) {
  //       this.tableInput.Q = 0;
  //     }
  //     if (this.tableInput.R != 0) {
  //       this.tableInput.R = 0;
  //     }
  //     if (this.tableInput.S != 0) {
  //       this.tableInput.S = 0;
  //     }
  //     if (this.tableInput.T != 0) {
  //       this.tableInput.T = 0;
  //     }
  //     if (this.tableInput.U != 0) {
  //       this.tableInput.U = 0;
  //     }
  //     if (this.tableInput.V != 0) {
  //       this.tableInput.V = 0;
  //     }
  //     if (this.tableInput.W != 0) {
  //       this.tableInput.W = 0;
  //     }
  //     if (this.tableInput.X != 0) {
  //       this.tableInput.X = 0;
  //     }
  //     if (this.tableInput.Y != 0) {
  //       this.tableInput.Y = 0;
  //     }
  //     if (this.tableInput.Z != 0) {
  //       this.tableInput.Z = 0;
  //     }
  //     if (lShapeCode == 'F') {
  //       this.tableInput.A = this.tableInput.MeshMainLen;
  //     }

  //     if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //       this.tableInput.A = 200;
  //       this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //     }

  //     if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //       this.tableInput.A = 200;
  //       this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //     }

  //     // set default value MO1/MO2
  //     if (
  //       this.tableInput.MeshMainLen > 0 &&
  //       this.tableInput.ProdCWSpacing > 0
  //     ) {
  //       let lShapeCode = this.tableInput.MeshShapeCode;
  //       if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //         if (this.tableInput.A + 100 < this.tableInput.MeshMainLen) {
  //           this.tableInput.MeshMO1 = this.tableInput.A + 200;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshMainLen -
  //               this.tableInput.MeshMO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                   this.tableInput.ProdCWSpacing
  //               ) *
  //                 this.tableInput.ProdCWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //             this.tableInput.MeshMO2 =
  //               this.tableInput.ProdCWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshMO2 = lRemainder;
  //           }
  //         }
  //       } else if (lShapeCode == '2M1' || lShapeCode == '2MR1') {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             Math.floor(
  //               this.tableInput.MeshMainLen / this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );
  //         if (
  //           this.tableInput.MeshMainLen >
  //           this.tableInput.ProdCWSpacing + 200
  //         ) {
  //           if (this.tableInput.ProdCWSpacing > 0) {
  //             var lMO1 =
  //               5 *
  //               Math.round(
  //                 (this.tableInput.ProdCWSpacing / 2 +
  //                   (this.tableInput.MeshMainLen %
  //                     this.tableInput.ProdCWSpacing)) /
  //                   10
  //               );
  //             this.tableInput.MeshMO1 = lMO1;
  //             var lRemainder = Math.round(
  //               this.tableInput.MeshMainLen -
  //                 lMO1 -
  //                 Math.floor(
  //                   (this.tableInput.MeshMainLen - lMO1) /
  //                     this.tableInput.ProdCWSpacing
  //                 ) *
  //                   this.tableInput.ProdCWSpacing
  //             );

  //             if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //               this.tableInput.MeshMO2 =
  //                 this.tableInput.ProdCWSpacing + lRemainder;
  //             } else {
  //               this.tableInput.MeshMO2 = lRemainder;
  //             }
  //           }
  //         } else {
  //           alert('Invalid main wire length. ');
  //         }
  //       } else {
  //         if (this.tableInput.ProdCWSpacing > 0) {
  //           var lMO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.ProdCWSpacing / 2 +
  //                 (this.tableInput.MeshMainLen %
  //                   this.tableInput.ProdCWSpacing)) /
  //                 10
  //             );
  //           if (lMO1 < 100) {
  //             lMO1 = 100;
  //           }
  //           this.tableInput.MeshMO1 = lMO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshMainLen -
  //               lMO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshMainLen - lMO1) /
  //                   this.tableInput.ProdCWSpacing
  //               ) *
  //                 this.tableInput.ProdCWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //             this.tableInput.MeshMO2 =
  //               this.tableInput.ProdCWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshMO2 = lRemainder;
  //           }
  //         }
  //       }
  //     }

  //     // CO1/CO2
  //     if (
  //       this.tableInput.MeshCrossLen > 0 &&
  //       this.tableInput.ProdMWSpacing > 0
  //     ) {
  //       let lShapeCode = this.tableInput.MeshShapeCode;
  //       if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //         if (this.tableInput.A + 100 < this.tableInput.MeshCrossLen) {
  //           this.tableInput.MeshCO1 = this.tableInput.A + 200;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshCrossLen -
  //               this.tableInput.MeshCO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshCrossLen - this.tableInput.MeshCO1) /
  //                   this.tableInput.ProdMWSpacing
  //               ) *
  //                 this.tableInput.ProdMWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //             this.tableInput.MeshCO2 =
  //               this.tableInput.ProdMWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshCO2 = lRemainder;
  //           }
  //         }
  //       } else if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             Math.floor(
  //               this.tableInput.MeshCrossLen / this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );
  //         if (
  //           this.tableInput.MeshCrossLen >
  //           this.tableInput.ProdMWSpacing + 100
  //         ) {
  //           if (this.tableInput.ProdMWSpacing > 0) {
  //             var lCO1 =
  //               5 *
  //               Math.round(
  //                 (this.tableInput.ProdMWSpacing / 2 +
  //                   (this.tableInput.MeshCrossLen %
  //                     this.tableInput.ProdMWSpacing)) /
  //                   5
  //               );
  //             this.tableInput.MeshCO1 = lCO1;
  //             var lRemainder = Math.round(
  //               this.tableInput.MeshCrossLen -
  //                 lCO1 -
  //                 Math.floor(
  //                   (this.tableInput.MeshCrossLen - lCO1) /
  //                     this.tableInput.ProdMWSpacing
  //                 ) *
  //                   this.tableInput.ProdMWSpacing
  //             );

  //             if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //               this.tableInput.MeshCO2 =
  //                 this.tableInput.ProdMWSpacing + lRemainder;
  //             } else {
  //               this.tableInput.MeshCO2 = lRemainder;
  //             }
  //           }
  //         } else {
  //           alert('Invalid cross wire length. ');
  //         }
  //       } else {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             Math.floor(
  //               this.tableInput.MeshCrossLen / this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );
  //         if (
  //           this.tableInput.MeshCrossLen >
  //           this.tableInput.ProdMWSpacing + 100
  //         ) {
  //           if (this.tableInput.ProdMWSpacing > 0) {
  //             var lCO1 =
  //               5 *
  //               Math.round(
  //                 (this.tableInput.MeshCrossLen %
  //                   this.tableInput.ProdMWSpacing) /
  //                   10
  //               );
  //             if (lCO1 < 100) {
  //               lCO1 = 100;
  //             }
  //             if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //               lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //             }
  //             this.tableInput.MeshCO1 = lCO1;
  //             var lRemainder = Math.round(
  //               this.tableInput.MeshCrossLen -
  //                 lCO1 -
  //                 Math.floor(
  //                   (this.tableInput.MeshCrossLen - lCO1) /
  //                     this.tableInput.ProdMWSpacing
  //                 ) *
  //                   this.tableInput.ProdMWSpacing
  //             );

  //             if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //               this.tableInput.MeshCO2 =
  //                 this.tableInput.ProdMWSpacing + lRemainder;
  //             } else {
  //               this.tableInput.MeshCO2 = lRemainder;
  //             }
  //           }
  //         } else {
  //           alert('Invalid cross wire length. ');
  //         }
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshMO1') {
  //     if (this.tableInput.ProdCWSpacing > 0) {
  //       var lMO1 = this.tableInput.MeshMO1;
  //       var lMO2 = this.tableInput.MeshMO2;
  //       if (lMO1 != null && lMO2 != null && lMO1 > 0 && lMO2 > 0) {
  //         var lRemainder =
  //           (this.tableInput.MeshMainLen - lMO1 - lMO2) %
  //           this.tableInput.ProdCWSpacing;

  //         if (lRemainder > 0) {
  //           if (
  //             lRemainder > this.tableInput.ProdCWSpacing / 2 &&
  //             lMO2 - (this.tableInput.ProdCWSpacing - lRemainder) >= 50
  //           ) {
  //             this.tableInput.MeshMO2 =
  //               lMO2 - (this.tableInput.ProdCWSpacing - lRemainder);
  //           } else {
  //             this.tableInput.MeshMO2 = lMO2 + lRemainder;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshMO2') {
  //     if (this.tableInput.ProdCWSpacing > 0) {
  //       var lMO1 = this.tableInput.MeshMO1;
  //       var lMO2 = this.tableInput.MeshMO2;
  //       if (lMO1 != null && lMO2 != null && lMO1 > 0 && lMO2 > 0) {
  //         var lRemainder =
  //           (this.tableInput.MeshMainLen - lMO1 - lMO2) %
  //           this.tableInput.ProdCWSpacing;

  //         if (lRemainder > 0) {
  //           if (
  //             lRemainder > this.tableInput.ProdCWSpacing / 2 &&
  //             lMO1 - (this.tableInput.ProdCWSpacing - lRemainder) >= 50
  //           ) {
  //             this.tableInput.MeshMO1 =
  //               lMO1 - (this.tableInput.ProdCWSpacing - lRemainder);
  //           } else {
  //             this.tableInput.MeshMO1 = lMO1 + lRemainder;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshCO1') {
  //     if (this.tableInput.ProdMWSpacing > 0) {
  //       var lCO1 = this.tableInput.MeshCO1;
  //       var lCO2 = this.tableInput.MeshCO2;
  //       if (lCO1 != null && lCO2 != null && lCO1 > 0 && lCO2 > 0) {
  //         var lRemainder =
  //           (this.tableInput.MeshCrossLen - lCO1 - lCO2) %
  //           this.tableInput.ProdMWSpacing;

  //         if (lRemainder > 0) {
  //           if (
  //             lRemainder > this.tableInput.ProdMWSpacing / 2 &&
  //             lCO2 - (this.tableInput.ProdMWSpacing - lRemainder) >= 50
  //           ) {
  //             this.tableInput.MeshCO2 =
  //               lCO2 - (this.tableInput.ProdMWSpacing - lRemainder);
  //           } else {
  //             this.tableInput.MeshCO2 = lCO2 + lRemainder;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshCO2') {
  //     if (this.tableInput.ProdMWSpacing > 0) {
  //       var lCO1 = this.tableInput.MeshCO1;
  //       var lCO2 = this.tableInput.MeshCO2;
  //       if (lCO1 != null && lCO2 != null && lCO1 > 0 && lCO2 > 0) {
  //         var lRemainder =
  //           (this.tableInput.MeshCrossLen - lCO1 - lCO2) %
  //           this.tableInput.ProdMWSpacing;

  //         if (lRemainder > 0) {
  //           if (
  //             lRemainder > this.tableInput.ProdMWSpacing / 2 &&
  //             lCO1 - (this.tableInput.ProdMWSpacing - lRemainder) >= 50
  //           ) {
  //             this.tableInput.MeshCO1 =
  //               lCO1 - (this.tableInput.ProdMWSpacing - lRemainder);
  //           } else {
  //             this.tableInput.MeshCO1 = lCO1 + lRemainder;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   //check MO/CO/Single wire
  //   if (
  //     lcolumnname == 'MeshMainLen' ||
  //     lcolumnname == 'MeshMO1' ||
  //     lcolumnname == 'MeshMO2'
  //   ) {
  //     if (lcolumnname == 'MeshMainLen') {
  //       if (this.tableInput.MeshMainLen < this.tableInput.ProdCWSpacing + 100) {
  //         alert(
  //           'Invalid main wire length. It should be greater than and equal to cross wire spacing plus 50 overhangs. (无效的主筋长度)'
  //         );
  //       }
  //       if (this.tableInput.MeshMainLen > 0) {
  //         if (this.tableInput.MeshMainLen % 10 != 0) {
  //           var lRem = this.tableInput.MeshMainLen % 10;
  //           var llength = this.tableInput.MeshMainLen - lRem;
  //           //if (lRem >= 25) {
  //           llength = this.tableInput.MeshMainLen - lRem + 10;
  //           //}
  //           this.tableInput.MeshMainLen = llength;
  //           alert(
  //             'MESH incremental main length is 10mm. Your input value is rounded to ' +
  //               llength +
  //               '. '
  //           );
  //         }
  //       }
  //     }

  //     if (
  //       this.tableInput.MeshMainLen -
  //         this.tableInput.MeshMO1 -
  //         this.tableInput.MeshMO2 <
  //       this.tableInput.ProdCWSpacing
  //     ) {
  //       alert(
  //         'Please check main wire length, MO1 or MO2 as only one cross wire left.(主边太长, 只剩一根副筋)'
  //       );
  //     }
  //   }
  //   //check MO/CO/Single wire
  //   if (
  //     lcolumnname == 'MeshCrossLen' ||
  //     lcolumnname == 'MeshCO1' ||
  //     lcolumnname == 'MeshCO2'
  //   ) {
  //     if (lcolumnname == 'MeshCrossLen') {
  //       if (
  //         this.tableInput.MeshCrossLen <
  //         this.tableInput.ProdMWSpacing + 100
  //       ) {
  //         alert(
  //           'Invalid cross wire length. It should be greater than and equal to main wire spacing plus 50 overhangs. (无效的副筋长度)'
  //         );
  //       }
  //       if (this.tableInput.MeshCrossLen > 0) {
  //         if (this.tableInput.MeshCrossLen % 10 != 0) {
  //           var lRem = this.tableInput.MeshCrossLen % 10;
  //           var llength = this.tableInput.MeshCrossLen - lRem;
  //           //if (lRem >= 25) {
  //           llength = this.tableInput.MeshCrossLen - lRem + 10;
  //           //}
  //           this.tableInput.MeshCrossLen = llength;
  //           alert(
  //             'MESH incremental cross length is 10mm. Your input value is rounded to ' +
  //               llength +
  //               '. '
  //           );
  //         }
  //       }
  //     }
  //     if (
  //       this.tableInput.MeshCrossLen -
  //         this.tableInput.MeshCO1 -
  //         this.tableInput.MeshCO2 <
  //       this.tableInput.ProdMWSpacing
  //     ) {
  //       alert(
  //         'Please check cross wire length, CO1 or CO2 as only one main wire left. (副边太长, 只剩一根主筋)'
  //       );
  //     }
  //   }
  //   //check CO
  //   if (lcolumnname == 'MeshCO1' || lcolumnname == 'MeshCO2') {
  //     if (lcolumnname == 'MeshCO1' && this.tableInput.MeshCO1 > 0) {
  //       if (this.tableInput.MeshCO1 > 1000) {
  //         alert(
  //           'Cross wire onverhang cannot be greater than 1000. (副筋边长最长不可大于1000)'
  //         );
  //       }
  //       if (this.tableInput.MeshCO1 < 20) {
  //         alert(
  //           'Cross wire onverhang cannot be less than 20. (副筋边长最短不可小于20)'
  //         );
  //       }

  //       //CO2
  //       if (
  //         this.tableInput.MeshCrossLen > 0 &&
  //         (this.tableInput.MeshCO2 == null || this.tableInput.MeshCO2 == 0) &&
  //         this.tableInput.ProdMWSpacing > 0
  //       ) {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             this.tableInput.MeshCO1 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - this.tableInput.MeshCO1) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );
  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO2 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO2 = lRemainder;
  //         }
  //       }

  //       let lItem = this.tableInput;
  //       if (
  //         lItem.MeshCO2 != null &&
  //         lItem.MeshCrossLen != null &&
  //         lItem.ProdMWSpacing != null
  //       ) {
  //         if (
  //           lItem.MeshCO2 > 0 &&
  //           lItem.MeshCrossLen > 0 &&
  //           lItem.ProdMWSpacing > 0
  //         ) {
  //           if (
  //             (lItem.MeshCrossLen - lItem.MeshCO2 - lItem.MeshCO1) %
  //               lItem.ProdMWSpacing !=
  //             0
  //           ) {
  //             alert('Invalid CO1 value.(输入无效的副筋边1)');
  //           }
  //         }
  //       }
  //     }
  //     if (lcolumnname == 'MeshCO2' && this.tableInput.MeshCO2 > 0) {
  //       if (this.tableInput.MeshCO2 > 1000) {
  //         alert(
  //           'Cross wire onverhang cannot be greater than 1000. (副筋边长最长不可大于1000)'
  //         );
  //       }
  //       if (this.tableInput.MeshCO2 < 20) {
  //         alert(
  //           'Cross wire onverhang cannot be less than 20. (副筋边长最短不可小于20)'
  //         );
  //       }

  //       //CO2
  //       if (
  //         this.tableInput.MeshCrossLen > 0 &&
  //         (this.tableInput.MeshCO1 == null || this.tableInput.MeshCO1 == 0) &&
  //         this.tableInput.ProdMWSpacing > 0
  //       ) {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             this.tableInput.MeshCO2 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - this.tableInput.MeshCO2) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );
  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO1 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO1 = lRemainder;
  //         }
  //       }

  //       let lItem = this.tableInput;
  //       if (
  //         lItem.MeshCO1 != null &&
  //         lItem.MeshCrossLen != null &&
  //         lItem.ProdMWSpacing != null
  //       ) {
  //         if (
  //           lItem.MeshCO1 > 0 &&
  //           lItem.MeshCrossLen > 0 &&
  //           lItem.ProdMWSpacing > 0
  //         ) {
  //           if (
  //             (lItem.MeshCrossLen - lItem.MeshCO1 - lItem.MeshCO2) %
  //               lItem.ProdMWSpacing !=
  //             0
  //           ) {
  //             alert('Invalid CO2 value. (输入无效的副筋边2)');
  //           }
  //         }
  //       }
  //     }
  //   }
  //   //Check MO
  //   if (lcolumnname == 'MeshMO1' || lcolumnname == 'MeshMO2') {
  //     if (lcolumnname == 'MeshMO1' && this.tableInput.MeshMO1 > 0) {
  //       if (this.tableInput.MeshMO1 > 1200 && this.tableInput.MeshMO2 > 1200) {
  //         alert(
  //           'Both main wire onverhang cannot be greater than 1200. (两个主边长不可同时大于1200)'
  //         );
  //       }
  //       if (this.tableInput.MeshMO1 > 1800) {
  //         alert(
  //           'Main wire onverhang cannot be greater than 1800. (主边长不可大于1800)'
  //         );
  //       }
  //       if (this.tableInput.MeshMO1 < 20) {
  //         alert(
  //           'Main wire onverhang cannot be less than 20. (主边长不可小于20)'
  //         );
  //       }

  //       //MO2 default value
  //       if (
  //         this.tableInput.MeshMainLen > 0 &&
  //         (this.tableInput.MeshMO2 == null || this.tableInput.MeshMO2 == 0) &&
  //         this.tableInput.ProdCWSpacing > 0
  //       ) {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             this.tableInput.MeshMO1 -
  //             Math.floor(
  //               (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                 this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );
  //         if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //           this.tableInput.MeshMO2 =
  //             this.tableInput.ProdCWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshMO2 = lRemainder;
  //         }
  //       }

  //       let lItem = this.tableInput;
  //       if (
  //         lItem.MeshMO2 != null &&
  //         lItem.MeshMainLen != null &&
  //         lItem.ProdCWSpacing != null
  //       ) {
  //         if (
  //           lItem.MeshMO2 > 0 &&
  //           lItem.MeshMainLen > 0 &&
  //           lItem.ProdCWSpacing > 0
  //         ) {
  //           if (
  //             (lItem.MeshMainLen - lItem.MeshMO2 - lItem.MeshMO1) %
  //               lItem.ProdCWSpacing !=
  //             0
  //           ) {
  //             alert('Invalid MO1 value. (输入无效的主筋边1)');
  //           }
  //         }
  //       }
  //     }
  //     if (lcolumnname == 'MeshMO2' && this.tableInput.MeshMO2 > 0) {
  //       if (this.tableInput.MeshMO1 > 1200 && this.tableInput.MeshMO2 > 1200) {
  //         alert(
  //           'Both main wire onverhang cannot be greater than 1200. (两个主边长不可同时大于1200)'
  //         );
  //       }
  //       if (this.tableInput.MeshMO2 > 1800) {
  //         alert(
  //           'Main wire onverhang cannot be greater than 1800. (主边长不可大于1800)'
  //         );
  //       }
  //       if (this.tableInput.MeshMO2 < 20) {
  //         alert(
  //           'Main wire onverhang cannot be less than 20. (主边长不可小于20)'
  //         );
  //       }

  //       //MO1 default value
  //       if (
  //         this.tableInput.MeshMainLen > 0 &&
  //         (this.tableInput.MeshMO1 == null || this.tableInput.MeshMO1 == 0) &&
  //         this.tableInput.ProdCWSpacing > 0
  //       ) {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             this.tableInput.MeshMO2 -
  //             Math.floor(
  //               (this.tableInput.MeshMainLen - this.tableInput.MeshMO2) /
  //                 this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );
  //         if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //           this.tableInput.MeshMO1 =
  //             this.tableInput.ProdCWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshMO1 = lRemainder;
  //         }
  //       }

  //       let lItem = this.tableInput;
  //       if (
  //         lItem.MeshMO1 != null &&
  //         lItem.MeshMainLen != null &&
  //         lItem.ProdCWSpacing != null
  //       ) {
  //         if (
  //           lItem.MeshMO1 > 0 &&
  //           lItem.MeshMainLen > 0 &&
  //           lItem.ProdCWSpacing > 0
  //         ) {
  //           if (
  //             (lItem.MeshMainLen - lItem.MeshMO1 - lItem.MeshMO2) %
  //               lItem.ProdCWSpacing !=
  //             0
  //           ) {
  //             alert('Invalid MO2 value. (输入无效的主筋边2)');
  //           }
  //         }
  //       }
  //     }
  //   }
  //   //Check total length = sum(all parameters)
  //   if (
  //     (lcolumnname.length == 1 ||
  //       lcolumnname == 'HOOK' ||
  //       lcolumnname == 'LEG') &&
  //     this.tableInput.MeshMainLen != null &&
  //     this.tableInput.MeshCrossLen != null
  //   ) {
  //     var lParaType = this.getListValue(
  //       this.tableInput.MeshEditParameters,
  //       this.tableInput.MeshShapeParameters,
  //       lcolumnname
  //     );
  //     var lWireType = this.getListValue(
  //       this.tableInput.MeshEditParameters,
  //       this.tableInput.MeshShapeWireTypes,
  //       lcolumnname
  //     );
  //     var lEmptyField = '';
  //     if ((lParaType == 'S' || lParaType == 'HK') && lWireType == 'M') {
  //       let lTotalLen = 0;
  //       if (this.tableInput.MeshEditParameters != null) {
  //         let lParaA = this.tableInput.MeshEditParameters.split(',');
  //         let lParaTypeA = this.tableInput.MeshShapeParameters.split(',');
  //         let lWireTypeA = this.tableInput.MeshShapeWireTypes.split(',');
  //         let lFinish = 1;
  //         if (lParaA.length > 0) {
  //           for (let i = 0; i < lParaA.length; i++) {
  //             if (
  //               (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
  //               lWireTypeA[i] == 'M'
  //             ) {
  //               if (lParaA != null) {
  //                 if (parseInt(lParaA.toString()) > 0) {
  //                   lTotalLen = lTotalLen + parseInt(lParaA.toString());
  //                   if (parseInt(lParaA.toString()) < 100) {
  //                     alert(
  //                       'Minimum value of parameters should be greater and equal to 100mm.'
  //                     );
  //                   }
  //                 } else {
  //                   if (lcolumnname != lParaA[i] && lEmptyField == '') {
  //                     lEmptyField = lParaA[i];
  //                   }
  //                   lFinish = 0;
  //                 }
  //               } else {
  //                 if (lcolumnname != lParaA[i] && lEmptyField == '') {
  //                   lEmptyField = lParaA[i];
  //                 }
  //                 lFinish = 0;
  //               }
  //             }
  //           }
  //           if (this.tableInput.MeshMainLen > 0 && lFinish == 1) {
  //             var lFound = 0;
  //             var lRow = -1;
  //             for (let i = 0; i < lParaA.length; i++) {
  //               if (
  //                 (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
  //                 lWireTypeA[i] == 'M'
  //               ) {
  //                 if (lFound == 1) {
  //                   lRow = i;
  //                   break;
  //                 }
  //                 if (lParaA[i] == lcolumnname) {
  //                   lFound = 1;
  //                 }
  //               }
  //             }
  //             if (lRow != -1) {
  //               // parseInt = parseInt(args.item[lParaA[lRow]]) + this.tableInput.MeshMainLen - lTotalLen;
  //             } else {
  //               if (this.tableInput.MeshMainLen != lTotalLen) {
  //                 alert(
  //                   'Invalid parameter value. The total values of main wire bending parameters is not equal to main wire length ' +
  //                     this.tableInput.MeshMainLen +
  //                     '.(输入数据无效, 主筋的参数总值不等于主筋的长度' +
  //                     this.tableInput.MeshMainLen +
  //                     ')'
  //                 );
  //               }
  //             }
  //           }
  //           if (
  //             this.tableInput.MeshMainLen > 0 &&
  //             lFinish == 0 &&
  //             this.tableInput.MeshMainLen - lTotalLen > 0
  //           ) {
  //             // args.item[lEmptyField] = this.tableInput.MeshMainLen - lTotalLen;
  //           }
  //         }
  //       }
  //     }

  //     //Check total length = sum(all parameters)
  //     if ((lParaType == 'S' || lParaType == 'HK') && lWireType == 'C') {
  //       var lTotalLen = 0;
  //       if (this.tableInput.MeshEditParameters != null) {
  //         var lParaA = this.tableInput.MeshEditParameters.split(',');
  //         var lParaTypeA = this.tableInput.MeshShapeParameters.split(',');
  //         var lWireTypeA = this.tableInput.MeshShapeWireTypes.split(',');
  //         var lFinish = 1;
  //         if (lParaA.length > 0) {
  //           for (let i = 0; i < lParaA.length; i++) {
  //             if (
  //               (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
  //               lWireTypeA[i] == 'C'
  //             ) {
  //               if (lParaA != null) {
  //                 if (parseInt(lParaA.toString()) > 0) {
  //                   lTotalLen = lTotalLen + parseInt(lParaA.toString());
  //                   if (parseInt(lParaA.toString()) < 100) {
  //                     alert(
  //                       'Minimum value of parameters should be greater and equal to 100mm.'
  //                     );
  //                   }
  //                 } else {
  //                   if (lcolumnname != lParaA[i] && lEmptyField == '') {
  //                     lEmptyField = lParaA[i];
  //                   }
  //                   lFinish = 0;
  //                 }
  //               } else {
  //                 if (lcolumnname != lParaA[i] && lEmptyField == '') {
  //                   lEmptyField = lParaA[i];
  //                 }
  //                 lFinish = 0;
  //               }
  //             }
  //           }
  //           if (this.tableInput.MeshCrossLen > 0 && lFinish == 1) {
  //             var lFound = 0;
  //             var lRow = -1;
  //             for (let i = 0; i < lParaA.length; i++) {
  //               if (
  //                 (lParaTypeA[i] == 'S' || lParaTypeA[i] == 'HK') &&
  //                 lWireTypeA[i] == 'C'
  //               ) {
  //                 if (lFound == 1) {
  //                   lRow = i;
  //                   break;
  //                 }
  //                 if (lParaA[i] == lcolumnname) {
  //                   lFound = 1;
  //                 }
  //               }
  //             }
  //             if (lRow != -1) {
  //               // args.item[lParaA[lRow]] = parseInt(args.item[lParaA[lRow]]) + this.tableInput.MeshCrossLen - lTotalLen;
  //             } else {
  //               if (this.tableInput.MeshCrossLen != lTotalLen) {
  //                 alert(
  //                   'Invalid parameter value. The total values of main wire bending parameters is not equal to cross wire length ' +
  //                     this.tableInput.MeshMainLen +
  //                     '.(输入数据无效, 主筋的参数总值不等于副筋的长度' +
  //                     this.tableInput.MeshMainLen +
  //                     ')'
  //                 );
  //               }
  //             }

  //             //if (this.tableInput.MeshCrossLen != lTotalLen) {
  //             //    alert("Invalid parameter value. The total values of cross wire bending parameters is not equal to cross wire length " + this.tableInput.MeshCrossLen +
  //             //        ".(输入数据无效, 副筋的参数总值不等于副筋的长度" + this.tableInput.MeshCrossLen + ")");
  //             //}
  //           }
  //           if (
  //             this.tableInput.MeshCrossLen > 0 &&
  //             lFinish == 0 &&
  //             this.tableInput.MeshCrossLen - lTotalLen > 0
  //           ) {
  //             // args.item[lEmptyField] = this.tableInput.MeshCrossLen - lTotalLen;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (lcolumnname == 'A') {
  //     var lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //       if (this.tableInput.A + 100 < this.tableInput.MeshMainLen) {
  //         var lCrossSpacing = this.tableInput.ProdCWSpacing;
  //         var lMO1 = this.tableInput.MeshMO1;

  //         if (!isNaN(this.tableInput.A) && lCrossSpacing > 0) {
  //           if (lMO1 < this.tableInput.A) {
  //             if ((this.tableInput.A - lMO1) % lCrossSpacing < 50) {
  //               lMO1 = lMO1 + 50 - ((this.tableInput.A - lMO1) % lCrossSpacing);
  //               if (lMO1 >= lCrossSpacing + 50) {
  //                 lMO1 = lMO1 - lCrossSpacing;
  //               }
  //               this.tableInput.MeshMO1 = lMO1;

  //               var lRemainder = Math.round(
  //                 this.tableInput.MeshMainLen -
  //                   this.tableInput.MeshMO1 -
  //                   Math.floor(
  //                     (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                       this.tableInput.ProdCWSpacing
  //                   ) *
  //                     this.tableInput.ProdCWSpacing
  //               );

  //               if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //                 this.tableInput.MeshMO2 =
  //                   this.tableInput.ProdCWSpacing + lRemainder;
  //               } else {
  //                 this.tableInput.MeshMO2 = lRemainder;
  //               }
  //             } else if (
  //               lCrossSpacing - ((this.tableInput.A - lMO1) % lCrossSpacing) <
  //               50
  //             ) {
  //               lMO1 =
  //                 lMO1 -
  //                 (50 -
  //                   (lCrossSpacing -
  //                     ((this.tableInput.A - lMO1) % lCrossSpacing)));
  //               if (lMO1 >= lCrossSpacing + 50) {
  //                 lMO1 = lMO1 - lCrossSpacing;
  //               }
  //               this.tableInput.MeshMO1 = lMO1;

  //               var lRemainder = Math.round(
  //                 this.tableInput.MeshMainLen -
  //                   this.tableInput.MeshMO1 -
  //                   Math.floor(
  //                     (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                       this.tableInput.ProdCWSpacing
  //                   ) *
  //                     this.tableInput.ProdCWSpacing
  //               );

  //               if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //                 this.tableInput.MeshMO2 =
  //                   this.tableInput.ProdCWSpacing + lRemainder;
  //               } else {
  //                 this.tableInput.MeshMO2 = lRemainder;
  //               }
  //             }
  //           } else {
  //             lMO1 = this.tableInput.A + 200;
  //             this.tableInput.MeshMO1 = lMO1;

  //             var lRemainder = Math.round(
  //               this.tableInput.MeshMainLen -
  //                 this.tableInput.MeshMO1 -
  //                 Math.floor(
  //                   (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                     this.tableInput.ProdCWSpacing
  //                 ) *
  //                   this.tableInput.ProdCWSpacing
  //             );

  //             if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //               this.tableInput.MeshMO2 =
  //                 this.tableInput.ProdCWSpacing + lRemainder;
  //             } else {
  //               this.tableInput.MeshMO2 = lRemainder;
  //             }
  //           }
  //         }
  //       }
  //     } else if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //       if (this.tableInput.A + 100 < this.tableInput.MeshCrossLen) {
  //         var lCrossSpacing = this.tableInput.ProdMWSpacing;
  //         var lCO1 = this.tableInput.MeshCO1;

  //         if (!isNaN(this.tableInput.A) && lCrossSpacing > 0) {
  //           if (lCO1 < this.tableInput.A) {
  //             if ((this.tableInput.A - lCO1) % lCrossSpacing < 50) {
  //               lCO1 = lCO1 + 50 - ((this.tableInput.A - lCO1) % lCrossSpacing);
  //               if (lCO1 >= lCrossSpacing + 50) {
  //                 lCO1 = lCO1 - lCrossSpacing;
  //               }
  //               this.tableInput.MeshCO1 = lCO1;

  //               var lRemainder = Math.round(
  //                 this.tableInput.MeshCrossLen -
  //                   this.tableInput.MeshCO1 -
  //                   Math.floor(
  //                     (this.tableInput.MeshCrossLen - this.tableInput.MeshCO1) /
  //                       this.tableInput.ProdMWSpacing
  //                   ) *
  //                     this.tableInput.ProdMWSpacing
  //               );

  //               if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //                 this.tableInput.MeshCO2 =
  //                   this.tableInput.ProdMWSpacing + lRemainder;
  //               } else {
  //                 this.tableInput.MeshCO2 = lRemainder;
  //               }
  //             } else if (
  //               lCrossSpacing - ((this.tableInput.A - lCO1) % lCrossSpacing) <
  //               50
  //             ) {
  //               lCO1 =
  //                 lCO1 -
  //                 (50 -
  //                   (lCrossSpacing -
  //                     ((this.tableInput.A - lCO1) % lCrossSpacing)));
  //               if (lCO1 >= lCrossSpacing + 50) {
  //                 lCO1 = lCO1 - lCrossSpacing;
  //               }
  //               this.tableInput.MeshCO1 = lCO1;

  //               var lRemainder = Math.round(
  //                 this.tableInput.MeshCrossLen -
  //                   this.tableInput.MeshCO1 -
  //                   Math.floor(
  //                     (this.tableInput.MeshCrossLen - this.tableInput.MeshCO1) /
  //                       this.tableInput.ProdCWSpacing
  //                   ) *
  //                     this.tableInput.ProdCWSpacing
  //               );

  //               if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //                 this.tableInput.MeshCO2 =
  //                   this.tableInput.ProdMWSpacing + lRemainder;
  //               } else {
  //                 this.tableInput.MeshCO2 = lRemainder;
  //               }
  //             }
  //           } else {
  //             lCO1 = this.tableInput.A + 200;
  //             this.tableInput.MeshCO1 = lCO1;

  //             var lRemainder = Math.round(
  //               this.tableInput.MeshCrossLen -
  //                 this.tableInput.MeshCO1 -
  //                 Math.floor(
  //                   (this.tableInput.MeshCrossLen - this.tableInput.MeshCO1) /
  //                     this.tableInput.ProdMWSpacing
  //                 ) *
  //                   this.tableInput.ProdMWSpacing
  //             );

  //             if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //               this.tableInput.MeshCO2 =
  //                 this.tableInput.ProdMWSpacing + lRemainder;
  //             } else {
  //               this.tableInput.MeshCO2 = lRemainder;
  //             }
  //           }
  //         }
  //       }
  //     } else if (lShapeCode == '2M1' || lShapeCode == '2MR1') {
  //       var lRemainder = Math.round(
  //         this.tableInput.MeshMainLen -
  //           Math.floor(
  //             this.tableInput.MeshMainLen / this.tableInput.ProdCWSpacing
  //           ) *
  //             this.tableInput.ProdCWSpacing
  //       );
  //       if (this.tableInput.MeshMainLen > this.tableInput.ProdCWSpacing + 100) {
  //         if (this.tableInput.ProdCWSpacing > 0) {
  //           var lMO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.ProdCWSpacing / 2 +
  //                 (this.tableInput.A % this.tableInput.ProdCWSpacing)) /
  //                 5
  //             );
  //           //if (lMO1 < this.tableInput.ProdCWSpacing / 2) {
  //           //    lMO1 = lMO1 + this.tableInput.ProdCWSpacing / 2;
  //           //}
  //           this.tableInput.MeshMO1 = lMO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshMainLen -
  //               lMO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshMainLen - lMO1) /
  //                   this.tableInput.ProdCWSpacing
  //               ) *
  //                 this.tableInput.ProdCWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //             this.tableInput.MeshMO2 =
  //               this.tableInput.ProdCWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshMO2 = lRemainder;
  //           }
  //         }
  //       } else {
  //         alert('Invalid main wire length. ');
  //       }
  //     } else if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
  //       var lRemainder = Math.round(
  //         this.tableInput.MeshCrossLen -
  //           Math.floor(
  //             this.tableInput.MeshCrossLen / this.tableInput.ProdMWSpacing
  //           ) *
  //             this.tableInput.ProdMWSpacing
  //       );
  //       if (
  //         this.tableInput.MeshCrossLen >
  //         this.tableInput.ProdMWSpacing + 100
  //       ) {
  //         if (this.tableInput.ProdMWSpacing > 0) {
  //           var lCO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.ProdMWSpacing / 2 +
  //                 (this.tableInput.A % this.tableInput.ProdMWSpacing)) /
  //                 5
  //             );

  //           //if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //           //    lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //           //}
  //           this.tableInput.MeshCO1 = lCO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshCrossLen -
  //               lCO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshCrossLen - lCO1) /
  //                   this.tableInput.ProdMWSpacing
  //               ) *
  //                 this.tableInput.ProdMWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //             this.tableInput.MeshCO2 =
  //               this.tableInput.ProdMWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshCO2 = lRemainder;
  //           }
  //         }
  //       } else {
  //         alert('Invalid cross wire length. ');
  //       }
  //     }
  //   }

  //   //end of CTS MESH

  //   //calculate weight
  //   if (
  //     lcolumnname == 'MeshMainLen' ||
  //     lcolumnname == 'MeshCrossLen' ||
  //     lcolumnname == 'MeshMemberQty' ||
  //     lcolumnname == 'MeshProduct'
  //   ) {
  //     // this.tableInput.MeshTotalWT = this.calWeightOthers().toFixed(3);
  //     this.refreshInfo();
  //   }
  // }
  lWeightArea: any;
  lWeight: any;
  // calWeightOthers() {
  //   //debugger;
  //   var lProductCode = this.tableInput.MeshProduct;
  //   this.lWeightArea = 0;

  //   //get Weight/meter sqart
  //   // var lProductList = gOthersProdCode.split(",");
  //   // var lWeightList = gOthersProdWTArea.split(",");
  //   // if (lProductList.length > 0) {
  //   //     for (let i = 0; i < lProductList.length; i++) {
  //   //         if (lProductList[i] == lProductCode) {
  //   //             lWeightArea = lWeightList[i]
  //   //             break;
  //   //         }
  //   //     }
  //   // }
  //   //commented by vw

  //   var lMainWireLen = this.tableInput.MeshMainLen;
  //   var lCrossWireLen = this.tableInput.MeshCrossLen;

  //   var lQty = 1;
  //   if (this.tableInput.MeshMemberQty != 0) {
  //     lQty = this.tableInput.MeshMemberQty;
  //   }

  //   this.lWeight =
  //     (lQty *
  //       Math.round(
  //         (((lMainWireLen / 1000) * lCrossWireLen) / 1000) * this.lWeight * 1000
  //       )) /
  //     1000;
  //   if (isNaN(this.lWeight) == true) {
  //     this.lWeight = 0;
  //   }
  //   return this.lWeight;
  // }

  calWeightOthers(pItem: any) {
    var lProductCode = pItem['MeshProduct'].value ? pItem['MeshProduct'].value : pItem['MeshProduct'];
    var lWeightArea = 0;

    //get Weight/meter sqart
    var lProductList = this.gOthersProdCode.split(',');
    var lWeightList = this.gOthersProdWTArea.split(',');
    if (lProductList.length > 0) {
      for (let i = 0; i < lProductList.length; i++) {
        if (lProductList[i] == lProductCode) {
          lWeightArea = lWeightList[i];
          break;
        }
      }
    }

    var lMainWireLen = parseInt(pItem['MeshMainLen']);
    var lCrossWireLen = parseInt(pItem['MeshCrossLen']);

    var lQty = 1;
    if (pItem['MeshMemberQty'] != null) {
      lQty = parseInt(pItem['MeshMemberQty']);
    }

    var lWeight =
      (lQty *
        Math.round(
          (((lMainWireLen / 1000) * lCrossWireLen) / 1000) * lWeightArea * 1000
        )) /
      1000;
    if (isNaN(lWeight) == true) {
      lWeight = 0;
    }
    return lWeight;
  }

  // lItem: any;
  // refreshInfo() {
  //   if (this.bbsOrderTable.length > 0) {
  //     var lSubTotalWT = 0;
  //     var lSubOrderQty = 0;
  //     var lSubOrderItem = 0;
  //     var lTotWeight = 0;
  //     for (let i = 0; i < this.bbsOrderTable.length; i++) {
  //       this.lItem = this.bbsOrderTable.length;
  //       if (
  //         this.lItem.MeshTotalWT == null ||
  //         this.lItem.MeshTotalWT == '' ||
  //         this.lItem.MeshTotalWT == 0 ||
  //         this.lItem.MeshMemberQty == null ||
  //         this.lItem.MeshMemberQty == 0 ||
  //         this.lItem.MeshMemberQty == ''
  //       ) {
  //       } else {
  //         if (
  //           !isNaN(this.lItem.MeshTotalWT) &&
  //           this.lItem.MeshTotalWT != null &&
  //           this.lItem.MeshTotalWT != ''
  //         ) {
  //           lSubTotalWT = lSubTotalWT + parseFloat(this.lItem.MeshTotalWT);
  //           lTotWeight = lTotWeight + parseFloat(this.lItem.MeshTotalWT);
  //         }
  //         if (
  //           !isNaN(this.lItem.MeshMemberQty) &&
  //           this.lItem.MeshMemberQty != null &&
  //           this.lItem.BarTotalQty != ''
  //         ) {
  //           lSubOrderQty = lSubOrderQty + parseFloat(this.lItem.MeshMemberQty);
  //           lSubOrderItem = lSubOrderItem + 1;
  //         }
  //       }
  //     }

  //     lSubTotalWT = Math.round(lSubTotalWT * 1000) / 1000;
  //     var lScheduledProd = this.ScheduledProd;

  //     if (lSubTotalWT > 30000 && lScheduledProd != 'Y') {
  //       alert(
  //         'The total order weight is ' +
  //           lSubTotalWT +
  //           'kg, which is exceeded its maximum transport weight 30000kg. You may split the order if you deliver it with one lorry.'
  //       );
  //     }
  //     this.TotalWeight = lTotWeight.toFixed(3);
  //     this.TotalWeight = lTotWeight.toFixed(3);
  //   }
  // }

  // getListValue(pParaList: any, pValueList: any, pPara: any)
  // {
  //   var lReturn = "";
  //       if (pParaList != null && pValueList != null && pPara != null) {
  //           var lParaA = pParaList.split(",");
  //           var lValueA = pValueList.split(",");
  //           if (lParaA.length > 0) {
  //               for (let i = 0; i < lParaA.length; i++) {
  //                   if (lParaA[i] == pPara) {
  //                       lReturn = lValueA[i];
  //                       break;
  //                   }
  //               }
  //           }
  //       }
  //       return lReturn;
  // }

  // loaddata(columnname: any) {
  //   this.srno = this.srno + 1;
  //   let lcolumnname = columnname;
  //   let bbsid = this.BBSID;
  //   let lshapecode = this.tableInput.MeshShapeCode;

  //   if (lcolumnname == 'MeshShapeCode') {
  //     if (lshapecode != null && lshapecode != '') {
  //       // if(lshapecode!= this.gshapecode)
  //       // {
  //       this.getShapeInfo();
  //       // }
  //       const lParameters: string | null = this.lShapeparameters;
  //       // if (lParameters !== null && lParameters !== "") {
  //       //   for (let k = 0; k < 26; k++) {
  //       //    if (lParameters.indexOf(String.fromCharCode(k + "A".charCodeAt(0))) < 0) {
  //       //     if (args.item[String.fromCharCode(k + "A".charCodeAt(0))] !== null) {
  //       //       args.item[String.fromCharCode(k + "A".charCodeAt(0))] = null;
  //       //     }
  //       //   }
  //       // }
  //     }
  //   }

  //   if (lcolumnname == 'MeshProduct') {
  //     let lproductcode = this.tableInput.MeshProduct;
  //     if (lproductcode != null && lproductcode != '') {
  //       this.getProductInfo();
  //     }
  //   }

  //   if (lcolumnname == 'MeshProduct') {
  //     if (
  //       this.tableInput.MeshMainLen == null ||
  //       this.tableInput.MeshMainLen == 0
  //     ) {
  //       this.tableInput.MeshMainLen = 6000;
  //     }
  //     if (
  //       this.tableInput.MeshCrossLen == null ||
  //       this.tableInput.MeshCrossLen == 0
  //     ) {
  //       this.tableInput.MeshCrossLen = 2400;
  //     }
  //     if (
  //       this.tableInput.MeshShapeCode == null ||
  //       this.tableInput.MeshShapeCode == ''
  //     ) {
  //       this.tableInput.MeshShapeCode = 'F';
  //       this.tableInput.A = 6000;

  //       if (this.tableInput.ProdCWSpacing > 0) {
  //         let lMO1 =
  //           5 *
  //           Math.round(
  //             (this.tableInput.MeshMainLen % this.tableInput.ProdCWSpacing) / 10
  //           );
  //         if (lMO1 < 100) {
  //           lMO1 = 100;
  //         }
  //         if (lMO1 < this.Spacing / 2) {
  //           lMO1 = lMO1 + this.Spacing / 2;
  //         }
  //         this.tableInput.MeshMO1 = lMO1;
  //         let lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             lMO1 -
  //             Math.floor(
  //               (this.tableInput.MeshMainLen - lMO1) /
  //                 this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );
  //         if (lRemainder < this.Spacing / 2) {
  //           this.tableInput.MeshMO2 =
  //             this.tableInput.ProdCWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshMO2 = lRemainder;
  //         }
  //       }
  //       if (this.tableInput.ProdMWSpacing > 0) {
  //         var lCO1 =
  //           5 *
  //           Math.round(
  //             (this.tableInput.MeshCrossLen % this.tableInput.ProdMWSpacing) /
  //               10
  //           );
  //         if (lCO1 < 100) {
  //           lCO1 = 100;
  //         }
  //         if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //           lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //         }
  //         this.tableInput.MeshCO1 = lCO1;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             lCO1 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - lCO1) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO2 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO1 = lRemainder;
  //         }
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshMainLen' || lcolumnname == 'MeshProduct') {
  //     if (this.tableInput.MeshShapeCode == null) {
  //       this.tableInput.MeshShapeCode = 'F';
  //     }

  //     if (
  //       lcolumnname == 'MeshMainLen' &&
  //       this.tableInput.MeshShapeCode == 'F'
  //     ) {
  //       this.tableInput.A = this.tableInput.MeshMainLen;
  //     }
  //     let lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //       if (this.tableInput.A + 100 < this.tableInput.MeshMainLen) {
  //         this.tableInput.MeshMO1 = this.tableInput.A + 200;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             this.tableInput.MeshMO1 -
  //             Math.floor(
  //               (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                 this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //           this.tableInput.MeshMO2 =
  //             this.tableInput.ProdCWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshMO2 = lRemainder;
  //         }
  //       }
  //     } else {
  //       var lRemainder = Math.round(
  //         this.tableInput.MeshMainLen -
  //           Math.floor(
  //             this.tableInput.MeshMainLen / this.tableInput.ProdCWSpacing
  //           ) *
  //             this.tableInput.ProdCWSpacing
  //       );
  //       if (this.tableInput.MeshMainLen > this.tableInput.ProdCWSpacing + 100) {
  //         if (this.tableInput.ProdCWSpacing > 0) {
  //           var lMO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.ProdCWSpacing / 2 +
  //                 (this.tableInput.MeshMainLen %
  //                   this.tableInput.ProdCWSpacing)) /
  //                 10
  //             );
  //           //if (lMO1 < this.tableInput.ProdCWSpacing / 2) {
  //           //    lMO1 = lMO1 + this.tableInput.ProdCWSpacing / 2;
  //           //}
  //           if (lMO1 < 100) {
  //             lMO1 = 100;
  //           }
  //           this.tableInput.MeshMO1 = lMO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshMainLen -
  //               lMO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshMainLen - lMO1) /
  //                   this.tableInput.ProdCWSpacing
  //               ) *
  //                 this.tableInput.ProdCWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //             this.tableInput.MeshMO2 =
  //               this.tableInput.ProdCWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshMO2 = lRemainder;
  //           }
  //         }
  //       } else {
  //         this.toastr.error('Invalid main wire length. ');
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshCrossLen' || lcolumnname == 'MeshProduct') {
  //     if (this.tableInput.MeshShapeCode == null) {
  //       this.tableInput.MeshShapeCode = 'F';
  //     }
  //     let lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //       if (this.tableInput.A + 100 < this.tableInput.MeshCrossLen) {
  //         this.tableInput.MeshCO1 = this.tableInput.A + 200;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             this.tableInput.MeshCO1 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - this.tableInput.MeshCO1) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO2 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO2 = lRemainder;
  //         }
  //       }
  //     } else if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
  //       //if ((this.tableInput.MeshCrossLen - 800) % this.tableInput.ProdMWSpacing == 0) {
  //       //    this.tableInput.MeshCO1 = 380;
  //       //    this.tableInput.MeshCO2 = 420;
  //       //} else {
  //       //    this.tableInput.MeshCO1 = 430;
  //       //    this.tableInput.MeshCO2 = 470 + (this.tableInput.MeshCrossLen - 900) % this.tableInput.ProdMWSpacing;
  //       //}
  //       var lRemainder = Math.round(
  //         this.tableInput.MeshCrossLen -
  //           Math.floor(
  //             this.tableInput.MeshCrossLen / this.tableInput.ProdMWSpacing
  //           ) *
  //             this.tableInput.ProdMWSpacing
  //       );
  //       if (
  //         this.tableInput.MeshCrossLen >
  //         this.tableInput.ProdMWSpacing + 100
  //       ) {
  //         if (this.tableInput.ProdMWSpacing > 0) {
  //           var lCO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.MeshCrossLen % this.tableInput.ProdMWSpacing) /
  //                 10
  //             );
  //           //if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //           //    lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //           //}
  //           if (lCO1 < 100) {
  //             lCO1 = 100;
  //           }
  //           this.tableInput.MeshCO1 = lCO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshCrossLen -
  //               lCO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshCrossLen - lCO1) /
  //                   this.tableInput.ProdMWSpacing
  //               ) *
  //                 this.tableInput.ProdMWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //             this.tableInput.MeshCO2 =
  //               this.tableInput.ProdMWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshCO2 = lRemainder;
  //           }
  //         }
  //       } else {
  //         alert('Invalid cross wire length. ');
  //       }
  //     } else {
  //       if (this.tableInput.ProdMWSpacing > 0) {
  //         var lCO1 =
  //           5 *
  //           Math.round(
  //             (this.tableInput.MeshCrossLen % this.tableInput.ProdMWSpacing) /
  //               10
  //           );
  //         if (lCO1 < this.tableInput.ProdMWSpacing / 2) {
  //           lCO1 = lCO1 + this.tableInput.ProdMWSpacing / 2;
  //         }
  //         if (lCO1 < 100) {
  //           lCO1 = 100;
  //         }
  //         this.tableInput.MeshCO1 = lCO1;
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshCrossLen -
  //             lCO1 -
  //             Math.floor(
  //               (this.tableInput.MeshCrossLen - lCO1) /
  //                 this.tableInput.ProdMWSpacing
  //             ) *
  //               this.tableInput.ProdMWSpacing
  //         );

  //         if (lRemainder < this.tableInput.ProdMWSpacing / 2) {
  //           this.tableInput.MeshCO2 =
  //             this.tableInput.ProdMWSpacing + lRemainder;
  //         } else {
  //           this.tableInput.MeshCO2 = lRemainder;
  //         }
  //       }
  //     }
  //   }

  //   if (lcolumnname == 'MeshMainLen') {
  //     let lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == null) {
  //       lShapeCode = '';
  //     }

  //     let lFound = 0;
  //     if (lShapeCode != 'F') {
  //       var lWireType = this.tableInput.MeshShapeWireTypes;
  //       var lWireTypeA = lWireType.split(',');
  //       if (lWireTypeA.length > 0) {
  //         for (let i = 0; i < lWireTypeA.length; i++) {
  //           if (lWireTypeA[i] == 'M') {
  //             lFound = 1;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //     if (lFound == 1 || lShapeCode == 'F') {
  //       if (this.tableInput.A != 0) {
  //         this.tableInput.A = 0;
  //       }
  //       if (this.tableInput.B != 0) {
  //         this.tableInput.B = 0;
  //       }
  //       if (this.tableInput.C != 0) {
  //         this.tableInput.C = 0;
  //       }
  //       if (this.tableInput.D != 0) {
  //         this.tableInput.D = 0;
  //       }
  //       if (this.tableInput.E != 0) {
  //         this.tableInput.E = 0;
  //       }
  //       if (this.tableInput.F != 0) {
  //         this.tableInput.F = 0;
  //       }
  //       if (this.tableInput.G != 0) {
  //         this.tableInput.G = 0;
  //       }
  //       if (this.tableInput.H != 0) {
  //         this.tableInput.H = 0;
  //       }
  //       if (this.tableInput.I != 0) {
  //         this.tableInput.I = 0;
  //       }
  //       if (this.tableInput.J != 0) {
  //         this.tableInput.J = 0;
  //       }
  //       if (this.tableInput.K != 0) {
  //         this.tableInput.K = 0;
  //       }
  //       if (this.tableInput.L != 0) {
  //         this.tableInput.L = 0;
  //       }
  //       if (this.tableInput.M != 0) {
  //         this.tableInput.M = 0;
  //       }
  //       if (this.tableInput.N != 0) {
  //         this.tableInput.N = 0;
  //       }
  //       if (this.tableInput.O != 0) {
  //         this.tableInput.O = 0;
  //       }
  //       if (this.tableInput.P != 0) {
  //         this.tableInput.P = 0;
  //       }
  //       if (this.tableInput.Q != 0) {
  //         this.tableInput.Q = 0;
  //       }
  //       if (this.tableInput.R != 0) {
  //         this.tableInput.R = 0;
  //       }
  //       if (this.tableInput.S != 0) {
  //         this.tableInput.S = 0;
  //       }
  //       if (this.tableInput.T != 0) {
  //         this.tableInput.T = 0;
  //       }
  //       if (this.tableInput.U != 0) {
  //         this.tableInput.U = 0;
  //       }
  //       if (this.tableInput.V != 0) {
  //         this.tableInput.V = 0;
  //       }
  //       if (this.tableInput.W != 0) {
  //         this.tableInput.W = 0;
  //       }
  //       if (this.tableInput.X != 0) {
  //         this.tableInput.X = 0;
  //       }
  //       if (this.tableInput.Y != 0) {
  //         this.tableInput.Y = 0;
  //       }
  //       if (this.tableInput.Z != 0) {
  //         this.tableInput.Z = 0;
  //       }
  //     }

  //     if (
  //       lShapeCode == '1M1' ||
  //       lShapeCode == '1MR1' ||
  //       lShapeCode == '2M1' ||
  //       lShapeCode == '2MR1' ||
  //       lShapeCode == 'F'
  //     ) {
  //       if (lShapeCode == 'F') {
  //         this.tableInput.A = this.tableInput.MeshMainLen;
  //       }

  //       if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //         this.tableInput.A = 200;
  //         this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //       }

  //       // if (lShapeCode=="1C1" || lShapeCode == "1CR1") {
  //       //   this.tableInput.A = 200;
  //       //   this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //       // }
  //       //commented by me
  //     }
  //   }

  //   if (lcolumnname == 'MeshCrossLen') {
  //     var lShapeCode = this.tableInput.MeshShapeCode;
  //     if (lShapeCode == null) {
  //       lShapeCode = '';
  //     }

  //     var lFound = 0;

  //     if (lShapeCode != 'F') {
  //       var lWireType = this.tableInput.MeshShapeWireTypes;
  //       var lWireTypeA = lWireType.split(',');
  //       if (lWireTypeA.length > 0) {
  //         for (let i = 0; i < lWireTypeA.length; i++) {
  //           if (lWireTypeA[i] == 'C') {
  //             lFound = 1;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //     if (lFound == 1) {
  //       if (this.tableInput.A != 0) {
  //         this.tableInput.A = 0;
  //       }
  //       if (this.tableInput.B != 0) {
  //         this.tableInput.B = 0;
  //       }
  //       if (this.tableInput.C != 0) {
  //         this.tableInput.C = 0;
  //       }
  //       if (this.tableInput.D != 0) {
  //         this.tableInput.D = 0;
  //       }
  //       if (this.tableInput.E != 0) {
  //         this.tableInput.E = 0;
  //       }
  //       if (this.tableInput.F != 0) {
  //         this.tableInput.F = 0;
  //       }
  //       if (this.tableInput.G != 0) {
  //         this.tableInput.G = 0;
  //       }
  //       if (this.tableInput.H != 0) {
  //         this.tableInput.H = 0;
  //       }
  //       if (this.tableInput.I != 0) {
  //         this.tableInput.I = 0;
  //       }
  //       if (this.tableInput.J != 0) {
  //         this.tableInput.J = 0;
  //       }
  //       if (this.tableInput.K != 0) {
  //         this.tableInput.K = 0;
  //       }
  //       if (this.tableInput.L != 0) {
  //         this.tableInput.L = 0;
  //       }
  //       if (this.tableInput.M != 0) {
  //         this.tableInput.M = 0;
  //       }
  //       if (this.tableInput.N != 0) {
  //         this.tableInput.N = 0;
  //       }
  //       if (this.tableInput.O != 0) {
  //         this.tableInput.O = 0;
  //       }
  //       if (this.tableInput.P != 0) {
  //         this.tableInput.P = 0;
  //       }
  //       if (this.tableInput.Q != 0) {
  //         this.tableInput.Q = 0;
  //       }
  //       if (this.tableInput.R != 0) {
  //         this.tableInput.R = 0;
  //       }
  //       if (this.tableInput.S != 0) {
  //         this.tableInput.S = 0;
  //       }
  //       if (this.tableInput.T != 0) {
  //         this.tableInput.T = 0;
  //       }
  //       if (this.tableInput.U != 0) {
  //         this.tableInput.U = 0;
  //       }
  //       if (this.tableInput.V != 0) {
  //         this.tableInput.V = 0;
  //       }
  //       if (this.tableInput.W != 0) {
  //         this.tableInput.W = 0;
  //       }
  //       if (this.tableInput.X != 0) {
  //         this.tableInput.X = 0;
  //       }
  //       if (this.tableInput.Y != 0) {
  //         this.tableInput.Y = 0;
  //       }
  //       if (this.tableInput.Z != 0) {
  //         this.tableInput.Z = 0;
  //       }
  //     }

  //     if (
  //       lShapeCode == '1C1' ||
  //       lShapeCode == '1CR1' ||
  //       lShapeCode == '2C1' ||
  //       lShapeCode == '2CR1'
  //     ) {
  //       if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //         this.tableInput.A = 200;
  //         this.tableInput.B = this.tableInput.MeshCrossLen - 200;
  //       }
  //     }
  //   }
  //   if (lcolumnname == 'MeshShapeCode') {
  //     lShapeCode = this.tableInput.MeshShapeCode;
  //     if (this.tableInput.A != 0) {
  //       this.tableInput.A = 0;
  //     }
  //     if (this.tableInput.B != 0) {
  //       this.tableInput.B = 0;
  //     }
  //     if (this.tableInput.C != 0) {
  //       this.tableInput.C = 0;
  //     }
  //     if (this.tableInput.D != 0) {
  //       this.tableInput.D = 0;
  //     }
  //     if (this.tableInput.E != 0) {
  //       this.tableInput.E = 0;
  //     }
  //     if (this.tableInput.F != 0) {
  //       this.tableInput.F = 0;
  //     }
  //     if (this.tableInput.G != 0) {
  //       this.tableInput.G = 0;
  //     }
  //     if (this.tableInput.H != 0) {
  //       this.tableInput.H = 0;
  //     }
  //     if (this.tableInput.I != 0) {
  //       this.tableInput.I = 0;
  //     }
  //     if (this.tableInput.J != 0) {
  //       this.tableInput.J = 0;
  //     }
  //     if (this.tableInput.K != 0) {
  //       this.tableInput.K = 0;
  //     }
  //     if (this.tableInput.L != 0) {
  //       this.tableInput.L = 0;
  //     }
  //     if (this.tableInput.M != 0) {
  //       this.tableInput.M = 0;
  //     }
  //     if (this.tableInput.N != 0) {
  //       this.tableInput.N = 0;
  //     }
  //     if (this.tableInput.O != 0) {
  //       this.tableInput.O = 0;
  //     }
  //     if (this.tableInput.P != 0) {
  //       this.tableInput.P = 0;
  //     }
  //     if (this.tableInput.Q != 0) {
  //       this.tableInput.Q = 0;
  //     }
  //     if (this.tableInput.R != 0) {
  //       this.tableInput.R = 0;
  //     }
  //     if (this.tableInput.S != 0) {
  //       this.tableInput.S = 0;
  //     }
  //     if (this.tableInput.T != 0) {
  //       this.tableInput.T = 0;
  //     }
  //     if (this.tableInput.U != 0) {
  //       this.tableInput.U = 0;
  //     }
  //     if (this.tableInput.V != 0) {
  //       this.tableInput.V = 0;
  //     }
  //     if (this.tableInput.W != 0) {
  //       this.tableInput.W = 0;
  //     }
  //     if (this.tableInput.X != 0) {
  //       this.tableInput.X = 0;
  //     }
  //     if (this.tableInput.Y != 0) {
  //       this.tableInput.Y = 0;
  //     }
  //     if (this.tableInput.Z != 0) {
  //       this.tableInput.Z = 0;
  //     }
  //     if (lShapeCode == 'F') {
  //       this.tableInput.A = this.tableInput.MeshMainLen;
  //     }

  //     if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //       this.tableInput.A = 200;
  //       this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //     }

  //     if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
  //       this.tableInput.A = 200;
  //       this.tableInput.B = this.tableInput.MeshMainLen - 200;
  //     }

  //     // set default value MO1/MO2
  //     if (
  //       this.tableInput.MeshMainLen > 0 &&
  //       this.tableInput.ProdCWSpacing > 0
  //     ) {
  //       var lShapeCode = this.tableInput.MeshShapeCode;
  //       if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
  //         if (this.tableInput.A + 100 < this.tableInput.MeshMainLen) {
  //           this.tableInput.MeshMO1 = this.tableInput.A + 200;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshMainLen -
  //               this.tableInput.MeshMO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshMainLen - this.tableInput.MeshMO1) /
  //                   this.tableInput.ProdCWSpacing
  //               ) *
  //                 this.tableInput.ProdCWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //             this.tableInput.MeshMO2 =
  //               this.tableInput.ProdCWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshMO2 = lRemainder;
  //           }
  //         }
  //       } else if (lShapeCode == '2M1' || lShapeCode == '2MR1') {
  //         var lRemainder = Math.round(
  //           this.tableInput.MeshMainLen -
  //             Math.floor(
  //               this.tableInput.MeshMainLen / this.tableInput.ProdCWSpacing
  //             ) *
  //               this.tableInput.ProdCWSpacing
  //         );
  //         if (
  //           this.tableInput.MeshMainLen >
  //           this.tableInput.ProdCWSpacing + 200
  //         ) {
  //           if (this.tableInput.ProdCWSpacing > 0) {
  //             var lMO1 =
  //               5 *
  //               Math.round(
  //                 (this.tableInput.ProdCWSpacing / 2 +
  //                   (this.tableInput.MeshMainLen %
  //                     this.tableInput.ProdCWSpacing)) /
  //                   10
  //               );
  //             this.tableInput.MeshMO1 = lMO1;
  //             var lRemainder = Math.round(
  //               this.tableInput.MeshMainLen -
  //                 lMO1 -
  //                 Math.floor(
  //                   (this.tableInput.MeshMainLen - lMO1) /
  //                     this.tableInput.ProdCWSpacing
  //                 ) *
  //                   this.tableInput.ProdCWSpacing
  //             );

  //             if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //               this.tableInput.MeshMO2 =
  //                 this.tableInput.ProdCWSpacing + lRemainder;
  //             } else {
  //               this.tableInput.MeshMO2 = lRemainder;
  //             }
  //           }
  //         } else {
  //           alert('Invalid main wire length. ');
  //         }
  //       } else {
  //         if (this.tableInput.ProdCWSpacing > 0) {
  //           var lMO1 =
  //             5 *
  //             Math.round(
  //               (this.tableInput.ProdCWSpacing / 2 +
  //                 (this.tableInput.MeshMainLen %
  //                   this.tableInput.ProdCWSpacing)) /
  //                 10
  //             );
  //           if (lMO1 < 100) {
  //             lMO1 = 100;
  //           }
  //           this.tableInput.MeshMO1 = lMO1;
  //           var lRemainder = Math.round(
  //             this.tableInput.MeshMainLen -
  //               lMO1 -
  //               Math.floor(
  //                 (this.tableInput.MeshMainLen - lMO1) /
  //                   this.tableInput.ProdCWSpacing
  //               ) *
  //                 this.tableInput.ProdCWSpacing
  //           );

  //           if (lRemainder < this.tableInput.ProdCWSpacing / 2) {
  //             this.tableInput.MeshMO2 =
  //               this.tableInput.ProdCWSpacing + lRemainder;
  //           } else {
  //             this.tableInput.MeshMO2 = lRemainder;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  openBending() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
    };
    const modalRef = this.modalService.open(
      BindingLimitComponent,
      ngbModalOptions
    );
  }

  title: any;

  // let lCategory = 'BEAM';

  ShowShapeList() {
    const modalRef = this.modalService.open(OrderImageModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.images = this.shapeCodeList;
    modalRef.componentInstance.StructureElement = "CTSMESH";
    modalRef.result.then((result) => {
      if (result) {
        //console.log(result);
      }
    });
  }

  // this.orderService.ShowShapeList().subscribe({
  //   next: (response) => {
  //     const blob = new Blob([response], { type: 'application/pdf' });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     // a.download = 'STDMESH-' + this.ProjectCode + this.JobID + '.pdf';
  //     // a.click();

  //     window.open(url, '_blank');
  //   },
  //   error: (e) => {
  //     alert("Error on extraction data, please check the Internet connection.");
  //   },
  //   complete: () => {
  //     this.title = "List of MESH Shapes (网片图形列表)";
  //     if (lCategory == "BEAM") {
  //       var lTitle = "List of Beam Stirrup Cage Shapes (梁箍铁图形列表)";
  //   }

  //     // this.loading = false;
  //   },
  // });

  DownloadShapeList() {
    let lCategory = 'OTHERS';
    this.orderService.PrintShapes(lCategory).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Shapecodelist.pdf';
      a.click();

      // window.open(url, '_blank'); // Opens the PDF in a new tab

      // this.StandardBarProductOrderLoading = false;
      // this.StandardMeshProductOrderLoading=false;
    });
  }

  tempprodlist: any;
  lColNum: number = 0;
  ShowProductList() {
    let lCategory = 'OTHERS';
    this.orderService.getProductList_beam(lCategory).subscribe({
      next: (response) => {
        let productList;
        //console.log('getProductList_MESH', response);
        this.tempprodlist = response;
        //console.log('final ProductList', productList);
      },
      error: (e) => {
        alert(
          'Error on extraction data, please check the Internet connection.'
        );
      },
      complete: () => {
        const modalRef = this.modalService.open(
          ColumnLinkMeshProductListModalComponent,
          { size: 'lg' }
        );
        modalRef.componentInstance.products = this.tempprodlist;
        modalRef.componentInstance.StructureElement = "CTSMESH";
        // {'sno':1,'pcode':1234,'diameter':6,'spacing':75,'wireDia':7,'kg':3.84},
        //   {'sno':2,'pcode':1234,'diameter':6,'spacing':100,'wireDia':7,'kg':2.84},
        //   {'sno':3,'pcode':1234,'diameter':6,'spacing':75,'wireDia':7,'kg':4.84}
        modalRef.result.then((result) => {
          if (result) {
            //console.log(result);
          }
        });
        // this.loading = false;
      },
    });
  }

  DownloadProductList() {
    let lCategory = 'OTHERS';
    this.orderService.PrintProduct(lCategory).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ProductCodeList.pdf';
      a.click();

      // window.open(url, '_blank'); // Opens the PDF in a new tab

      // this.StandardBarProductOrderLoading = false;
      // this.StandardMeshProductOrderLoading=false;
    });
  }

  refreshInfo(args: any) {
    if (this.dataViewCTS.getLength() > 0) {
      var lSubTotalWT = 0;
      var lSubOrderQty = 0;
      var lSubOrderItem = 0;
      var lTotWeight = 0;
      for (let i = 0; i < this.dataViewCTS.getLength(); i++) {
        var lItem = this.templateGrid.slickGrid.getDataItem(i);
        if (
          lItem.MeshTotalWT == null ||
          lItem.MeshTotalWT == '' ||
          lItem.MeshTotalWT == 0 ||
          lItem.MeshMemberQty == null ||
          lItem.MeshMemberQty == 0 ||
          lItem.MeshMemberQty == ''
        ) {
        } else {
          if (
            !isNaN(lItem.MeshTotalWT) &&
            lItem.MeshTotalWT != null &&
            lItem.MeshTotalWT != ''
          ) {
            lSubTotalWT = lSubTotalWT + parseFloat(lItem.MeshTotalWT);
            lTotWeight = lTotWeight + parseFloat(lItem.MeshTotalWT);
          }
          if (
            !isNaN(lItem.MeshMemberQty) &&
            lItem.MeshMemberQty != null &&
            lItem.BarTotalQty != ''
          ) {
            lSubOrderQty = lSubOrderQty + parseFloat(lItem.MeshMemberQty);
            lSubOrderItem = lSubOrderItem + 1;
          }
        }
      }

      lSubTotalWT = Math.round(lSubTotalWT * 1000) / 1000;
      var lScheduledProd = this.ScheduledProd;
      // (<HTMLInputElement>document.getElementById("ScheduledProd")).value;

      if (lSubTotalWT > 30000 && lScheduledProd != 'Y') {
        alert(
          'The total order weight is ' +
          lSubTotalWT +
          'kg, which is exceeded its maximum transport weight 30000kg. You may split the order if you deliver it with one lorry.'
        );
      }
      (<HTMLDivElement>document.getElementById('total_weight')).innerHTML =
        lTotWeight.toFixed(3);
      (<HTMLDivElement>document.getElementById('bt_total_weight')).innerHTML =
        lTotWeight.toFixed(3);
    }
  }

  onSelectStandardBar() { }

  // onQtyChange() {
  //   this.tableInput.   = (
  //     Number(this.tableInput.Memberqty) * Number(this.tableInput.Eachqty)
  //   ).toString();
  // }

  // onLengthChange() {
  //   this.tableInput.Length = (
  //     Number(this.tableInput.A) +
  //     Number(this.tableInput.B) +
  //     Number(this.tableInput.C) +
  //     Number(this.tableInput.D) +
  //     Number(this.tableInput.E) +
  //     Number(this.tableInput.F) +
  //     Number(this.tableInput.G)
  //   ).toString();
  // }

  updateData() {
    this.editIndex = null;
  }


  // InsertItem() {
  //   debugger;
  //   var lStatus = this.OrderStatus;
  //   var lScheduledProd = this.ScheduledProd;

  //   if ((((lStatus != "New" && lStatus != "Created") || this.gOrderCreation != "Yes") &&
  //     (lStatus != "Sent" || this.gOrderSubmission != "Yes")) || lScheduledProd == "Y") {

  //     alert("Cannot insert new row for submitted or standby order.");

  //   } else {
  //    if (this.templateGrid.slickGrid.getActiveCell() != null) {
  //     // if (this.tempslcikgridrow != null) {
  //       let lRowIndex = this.tempcurrrow;

  //       //   barRowIndex[pGridID] = lRowIndex
  //       this.SaveCTSDetails(this.templateGrid.slickGrid.getDataItem(lRowIndex)); //Tab#, Row#
  //       let lCustomerCode = this.CustomerCode;
  //       let lProjectCode = this.ProjectCode;

  //       let lOrder = this.JobID;
  //       let lJobID = parseInt(lOrder);


  //       let lMeshID = this.getMeshID((lRowIndex + 1), this.dataViewCTS);

  //       let lMeshSortUp = 0;
  //       if (lRowIndex > 0) {
  //         lMeshSortUp = this.templateGrid.slickGrid.getDataItem(lRowIndex - 1).MeshSort;
  //       }
  //       let lMeshSortDown = this.templateGrid.slickGrid.getDataItem(lRowIndex).MeshSort;

  //       let lMeshSort = (lMeshSortUp + lMeshSortDown) / 2;

  //       let lItem = {
  //         CustomerCode: lCustomerCode.toString(),
  //         ProjectCode: lProjectCode.toString(),
  //         JobID: lJobID,
  //         BBSID: 1,
  //         MeshID: lMeshID,
  //         MeshSort: lMeshSort,
  //         id: lRowIndex + 1
  //       };
  //       this.dataViewCTS.beginUpdate();
  //       this.dataViewCTS.insertItem(lRowIndex, lItem);

  //       let lData = this.dataViewCTS.getItems();
  //       for (let i = lRowIndex + 1; i < lData.length; i++) {
  //         lData[i].id = i + 1;
  //       }

  //       this.dataViewCTS.setItems(lData);
  //       this.dataViewCTS.endUpdate();
  //       this.dataViewCTS.refresh();

  //       this.templateGrid.slickGrid.invalidate();
  //       this.templateGrid.slickGrid.render();
  //       this.templateGrid.slickGrid.setSelectedRows([lRowIndex]);
  //       this.templateGrid.slickGrid.setActiveCell(lRowIndex, 0);
  //       //      barChangeInd[pGridID] = barChangeInd[pGridID] + 1;
  //       this.gPreCellRow = lRowIndex;
  //       lData = null;

  //     }
  //   }
  //   return true;
  // }

  InsertItem() {
    debugger;
    var lStatus = this.OrderStatus;
    var lScheduledProd = this.ScheduledProd;

    if ((((lStatus != "New" && lStatus != "Created" && lStatus != "Created*") || this.gOrderCreation != "Yes") &&
      (lStatus != "Sent" || this.gOrderSubmission != "Yes")) || lScheduledProd == "Y") {

      alert("Cannot insert new row for submitted or standby order.");

    } else {
      if (this.templateGrid.slickGrid.getActiveCell() != null) {
        var lRowIndex = this.templateGrid.slickGrid.getActiveCell().row;

        //   barRowIndex[pGridID] = lRowIndex
        this.SaveCTSDetails(this.templateGrid.slickGrid.getDataItem(lRowIndex)); //Tab#, Row#
        var lCustomerCode = this.CustomerCode;
        var lProjectCode = this.ProjectCode;

        var lOrder = this.JobID;
        var lJobID = parseInt(lOrder);


        var lMeshID = this.getMeshID((lRowIndex + 1), this.dataViewCTS);

        var lMeshSortUp = 0;
        if (lRowIndex > 0) {
          lMeshSortUp = this.templateGrid.slickGrid.getDataItem(lRowIndex - 1).MeshSort;
        }
        var lMeshSortDown = this.templateGrid.slickGrid.getDataItem(lRowIndex).MeshSort;

        var lMeshSort = (lMeshSortUp + lMeshSortDown) / 2;

        var lItem = {
          CustomerCode: lCustomerCode.toString(),
          ProjectCode: lProjectCode.toString(),
          JobID: lJobID,
          BBSID: 1,
          MeshID: lMeshID,
          MeshSort: lMeshSort,
          id: lRowIndex + 1
        };
        this.dataViewCTS.beginUpdate();
        this.dataViewCTS.insertItem(lRowIndex, lItem);

        var lData = this.dataViewCTS.getItems();
        for (var i = lRowIndex + 1; i < lData.length; i++) {
          lData[i].id = i + 1;
        }

        this.dataViewCTS.setItems(lData);
        this.dataViewCTS.endUpdate();
        this.dataViewCTS.refresh();

        this.templateGrid.slickGrid.invalidate();
        this.templateGrid.slickGrid.render();
        this.templateGrid.slickGrid.setSelectedRows([lRowIndex]);
        this.templateGrid.slickGrid.setActiveCell(lRowIndex, 0);
        //      barChangeInd[pGridID] = barChangeInd[pGridID] + 1;
        this.gPreCellRow = lRowIndex;
        lData = null;

      }
    }
    return true;
  }


  // DeleteMeshDetails() {
  //   debugger;
  //   //debugger;
  //   var lStatus = this.OrderStatus;
  //   var lScheduledProd = this.ScheduledProd;
  //   //console.log(this.templateGrid.slickGrid);
  //   //console.log(this.templateGrid.slickGrid.getSelectedRows());
  //   if ((((lStatus != "New" && lStatus != "Created") || this.gOrderCreation != "Yes") &&
  //     (lStatus != "Sent" || this.gOrderSubmission != "Yes")) || lScheduledProd == "Y") {

  //     alert("Cannot delete row for submitted or standby order.");

  //   } else {
  //     let lRows = this.tempslcikgridrow;
  //     lRows.length = 1;
  //     if (lRows.length > 0) {
  //       // lRows.sort(function (a: number, b: number) { return a - b });
  //       let lRowsNo = ""
  //       for (let i = 0; i < lRows.length; i++) {
  //         if (lRowsNo.length == 0) {
  //           lRowsNo = (lRows[i] + 1).toString();
  //         }
  //         else {
  //           lRowsNo = lRowsNo + ", " + (lRows[i] + 1).toString();
  //         }
  //       }
  //       if (confirm('It going to delete the selected items: ' + lRowsNo + ". Are you sure?\n\n"
  //         + "将要删除您所选择的行, 行号为: " + lRowsNo + ". 请确认?")) {
  //         var lCustomerCode = this.CustomerCode;
  //         var lProjectCode = this.ProjectCode;
  //         var lOrder = this.JobID;
  //         var lJobID = parseInt(lOrder);
  //         this.dataViewCTS.beginUpdate();

  //         for (let i = lRows.length - 1; i >= 0; i--) {

  //           // let lItem =  this.templateGrid.slickGrid.getDataItem(lRows[i]);
  //           let lItem = this.tempslcikgridrow;
  //           if (lItem != null) {
  //             let lMeshID = lItem.MeshID;
  //             if (lItem.BBSID == 1) {
  //               this.orderService.deleteMeshOthersDetails_ctsmesh(this.CustomerCode, this.ProjectCode, this.JobID, this.BBSID, lMeshID).subscribe({
  //                 next: (response: any) => {
  //                   // this.getBBS(this.JobID);
  //                   this.dataViewCTS.deleteItem(lItem.id);
  //                 },
  //                 error: () => {
  //                   this.toastr.error("Sorry database error. The selected items cannot be deleted.");
  //                 },
  //                 complete: () => {
  //                   this.reloadMeshOthersDetails();
  //                   //debugger;

  //                 },
  //               });
  //               //deleteMeshOthersDetails_ctsmesh
  //               // $.ajax({
  //               //     url: "@Url.Action("deleteMeshOthersDetails")",
  //               //     type: "POST",
  //               //     headers: {
  //               //         "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("deleteMeshOthersDetails", "CTSMESH"))
  //               //         {@Html.AntiForgeryToken()}').val()
  //               //     },
  //               //     data: JSON.stringify({
  //               //         CustomerCode: lCustomerCode,
  //               //         ProjectCode: lProjectCode,
  //               //         JobID: lJobID,
  //               //         BBSID: lItem.BBSID,
  //               //         MeshID: lMeshID
  //               //     }),
  //               //     async: false,
  //               //     contentType: "application/json; charset=utf-8",
  //               //     dataType: "json",
  //               //     error: function (response) {
  //               //         alert("Sorry database error. The selected items cannot be deleted.");
  //               //     },
  //               //     success: function (response) {
  //               //         dataViewCTS.deleteItem(lItem.id);

  //               //     }
  //               // });
  //             }
  //           }
  //         }

  //         var lData = this.dataViewCTS.getItems();
  //         for (let i = lRows[0]; i < lData.length; i++) {
  //           lData[i].id = i + 1;
  //         }
  //         this.dataViewCTS.setItems(lData);
  //         this.dataViewCTS.updateRowCount();
  //         this.dataViewCTS.endUpdate();
  //         // this.templateGrid.slickGrid.updateRowCount();
  //         this.templateGrid.slickGrid.invalidate();
  //         this.templateGrid.slickGrid.render();
  //         this.templateGrid.slickGrid.setSelectedRows([lRows[0]]);
  //         this.templateGrid.slickGrid.setActiveCell(lRows[0], 0);
  //         //debugger;

  //         lData = null;

  //       }
  //     }
  //   }

  //   return true;
  // }

  DeleteMeshDetails() {
    debugger;
    var lStatus = this.OrderStatus;
    var lScheduledProd = this.ScheduledProd;

    if ((((lStatus != "New" && lStatus != "Created" && lStatus != "Created*") || this.gOrderCreation != "Yes") &&
      (lStatus != "Sent" || this.gOrderSubmission != "Yes")) || lScheduledProd == "Y") {

      alert("Cannot delete row for submitted or standby order.");

    } else {
      // this.templateGrid.slickGrid.getActiveCell().row;
      // var lRows = this.templateGrid.slickGrid.getSelectedRows();
      var lRows = this.templateGrid.slickGrid.getSelectedRows();
      if (lRows.length > 0) {
        lRows.sort(function (a, b) { return a - b });
        var lRowsNo = ""
        for (var i = 0; i < lRows.length; i++) {
          if (lRowsNo.length == 0) {
            lRowsNo = (lRows[i] + 1).toString();
          }
          else {
            lRowsNo = lRowsNo + ", " + (lRows[i] + 1).toString();
          }
        }
        if (confirm('It going to delete the selected items: ' + lRowsNo + ". Are you sure?\n\n"
          + "将要删除您所选择的行, 行号为: " + lRowsNo + ". 请确认?")) {
          var lCustomerCode = this.CustomerCode;
          var lProjectCode = this.ProjectCode;
          var lOrder = this.JobID;
          var lJobID = parseInt(lOrder);
          this.dataViewCTS.beginUpdate();


          for (let i = lRows.length - 1; i >= 0; i--) {

            let lItem = this.templateGrid.slickGrid.getDataItem(lRows[i]);
            // let lItem = this.tempslcikgridrow;
            if (lItem != null) {
              let lMeshID = lItem.MeshID;
              if (lItem.BBSID == 1) {
                this.orderService.deleteMeshOthersDetails_ctsmesh(this.CustomerCode, this.ProjectCode, this.JobID, this.BBSID, lMeshID).subscribe({
                  next: (response: any) => {
                    // this.getBBS(this.JobID);
                    this.dataViewCTS.deleteItem(lItem.id);
                  },
                  error: () => {
                    this.toastr.error("Sorry database error. The selected items cannot be deleted.");
                  },
                  complete: () => {
                    this.reloadMeshOthersDetails();
                    //debugger;

                  },
                });
                //deleteMeshOthersDetails_ctsmesh
                // $.ajax({
                //     url: "@Url.Action("deleteMeshOthersDetails")",
                //     type: "POST",
                //     headers: {
                //         "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("deleteMeshOthersDetails", "CTSMESH"))
                //         {@Html.AntiForgeryToken()}').val()
                //     },
                //     data: JSON.stringify({
                //         CustomerCode: lCustomerCode,
                //         ProjectCode: lProjectCode,
                //         JobID: lJobID,
                //         BBSID: lItem.BBSID,
                //         MeshID: lMeshID
                //     }),
                //     async: false,
                //     contentType: "application/json; charset=utf-8",
                //     dataType: "json",
                //     error: function (response) {
                //         alert("Sorry database error. The selected items cannot be deleted.");
                //     },
                //     success: function (response) {
                //         dataViewCTS.deleteItem(lItem.id);

                //     }
                // });
              }
            }
          }

          var lData = this.dataViewCTS.getItems();
          for (let i = lRows[0]; i < lData.length; i++) {
            lData[i].id = i + 1;
          } this.dataViewCTS.setItems(lData);

          this.dataViewCTS.endUpdate();
          this.templateGrid.slickGrid.invalidate();
          this.templateGrid.slickGrid.render();
          this.templateGrid.slickGrid.setSelectedRows([lRows[0]]);
          this.templateGrid.slickGrid.setActiveCell(lRows[0], 0);
          lData = null;
        }
      }
    }

    return true;
  }


  // ClearMeshDetails() {
  //   debugger;
  //   let lStatus = this.OrderStatus;
  //   let lScheduledProd = this.ScheduledProd;

  //   if ((((lStatus != "New" && lStatus != "Created") || this.gOrderCreation != "Yes") &&
  //     (lStatus != "Sent" || this.gOrderSubmission != "Yes")) || lScheduledProd == "Y") {

  //     alert("Cannot clear row content for submitted or standby order.");

  //   } else {

  //     let lRows = this.templateGrid.slickGrid.getSelectedRows();
  //     if (lRows != null) {
  //       lRows.length = 1
  //     }

  //     if (lRows.length > 0) {

  //       // lRows.sort(function (a: number, b: number) { return a - b });
  //       let lRowsNo = ""
  //       for (let i = 0; i < lRows.length; i++) {
  //         if (lRowsNo.length == 0) {
  //           lRowsNo = (lRows[i] + 1).toString();
  //         }
  //         else {
  //           lRowsNo = lRowsNo + ", " + (lRows[i] + 1).toString();
  //         }
  //       }
  //       if (confirm('It going to clear all contents for selected items: ' + lRowsNo + ". Are you sure?\n\n"
  //         + "将要清除所选行的全部内容, 其行号为：" + lRowsNo + ". 请确认?")) {

  //         let lCustomerCode = this.CustomerCode;
  //         let lProjectCode = this.ProjectCode;
  //         let lOrder = this.JobID;
  //         let lJobID = parseInt(lOrder);
  //         this.dataViewCTS.beginUpdate();

  //         for (let i = 0; i < lRows.length; i++) {
  //           let lItem = this.templateGrid.slickGrid.getDataItem(this.tempcurrrow);
  //           if (lItem.BBSID == 1) {
  //             lItem.CustomerCode = "",
  //               lItem.ProjectCode = "",
  //               lItem.JobID = 0,
  //               lItem.BBSID = 0,
  //               lItem.MeshID = 0,
  //               lItem.MeshSort = 0,
  //               lItem.MeshMark = "",
  //               lItem.MeshProduct = "",
  //               lItem.MeshMainLen = 0,
  //               lItem.MeshCrossLen = 0,
  //               lItem.MeshMO1 = 0,
  //               lItem.MeshMO2 = 0,
  //               lItem.MeshCO1 = 0,
  //               lItem.MeshCO2 = 0,
  //               lItem.MeshMemberQty = 0,
  //               lItem.MeshShapeCode = "",
  //               lItem.A = 0,
  //               lItem.B = 0,
  //               lItem.C = 0,
  //               lItem.D = 0,
  //               lItem.E = 0,
  //               lItem.F = 0,
  //               lItem.G = 0,
  //               lItem.H = 0,
  //               lItem.I = 0,
  //               lItem.J = 0,
  //               lItem.K = 0,
  //               lItem.L = 0,
  //               lItem.M = 0,
  //               lItem.N = 0,
  //               lItem.O = 0,
  //               lItem.P = 0,
  //               lItem.Q = 0,
  //               lItem.R = 0,
  //               lItem.S = 0,
  //               lItem.T = 0,
  //               lItem.U = 0,
  //               lItem.V = 0,
  //               lItem.W = 0,
  //               lItem.X = 0,
  //               lItem.Y = 0,
  //               lItem.Z = 0,
  //               lItem.HOOK = 0,
  //               lItem.MeshTotalWT = 0,
  //               lItem.Remarks = "",
  //               lItem.MWBOM = "",
  //               lItem.CWBOM = "",
  //               lItem.UpdateDate = "2023-12-04T09:39:15.624Z",
  //               lItem.UpdateBy = ""
  //             // lItem.MeshMark = null;
  //             // lItem.MeshWidth = null;
  //             // lItem.MeshDepth = null;
  //             // lItem.MeshSlope = null;
  //             // lItem.MeshProduct = null;
  //             // lItem.MeshShapeCode = null;
  //             // lItem.MeshTotalLinks = null;
  //             // lItem.MeshSpan = null;
  //             // lItem.MeshMemberQty = null;
  //             // lItem.MeshCapping = null;
  //             // lItem.MeshCPProduct = null;
  //             // lItem.A = null;
  //             // lItem.B = null;
  //             // lItem.C = null;
  //             // lItem.D = null;
  //             // lItem.E = null;
  //             // lItem.P = null;
  //             // lItem.Q = null;
  //             // lItem.HOOK = null;
  //             // lItem.LEG = null;
  //             // lItem.MeshTotalWT = null;
  //             // lItem.Remarks = null;
  //             // lItem.MeshShapeParameters = "";
  //             // lItem.MeshEditParameters = "";
  //             // lItem.MeshShapeParamTypes = "";
  //             // lItem.MeshShapeMinValues = null;
  //             // lItem.MeshShapeMaxValues = null;
  //             // lItem.MeshShapeWireTypes = null;
  //             // lItem.MeshCreepMO1 = null;
  //             // lItem.MeshCreepCO1 = null;
  //             // lItem.ProdMWDia = null;
  //             // lItem.ProdMWSpacing = null;
  //             // lItem.ProdCWDia = null;
  //             // lItem.ProdCWSpacing = null;
  //             // lItem.ProdMass = null;
  //             // lItem.ProdMinFactor = null;
  //             // lItem.ProdTwinInd = "";

  //             this.orderService.saveMeshOthersDetails_ctsmesh(lItem).subscribe({
  //               next: (response) => {
  //                 //console.log('CTS Link Mesh Details', response);
  //               },
  //               error: (e) => {
  //                 this.toastr.error(
  //                   'Saving data error. Please check the Internet connection and try again.'
  //                 );
  //               },
  //               complete: () => {
  //                 // this.loading = false;
  //               },
  //             });
  //             // $.ajax({
  //             //     url: "@Url.Action("saveMeshOthersDetails")",
  //             //     type: "POST",
  //             //     headers: {
  //             //         "__RequestVerificationToken": $('input[name="__RequestVerificationToken"]', '@using (Html.BeginForm("saveMeshOthersDetails", "CTSMESH"))
  //             //     {@Html.AntiForgeryToken()}').val()
  //             //     },
  //             //     async: false,
  //             //     data: JSON.stringify(lItem),
  //             //     contentType: "application/json; charset=utf-8",
  //             //     dataType: "json",
  //             //     error: function (response) {
  //             //         alert("Sorry database error. unable to clear data.");
  //             //     },
  //             //     success: function (response) {
  //             //         dataViewCTS.updateItem(lItem.id, lItem);
  //             //     }
  //             // });
  //           }
  //         }
  //         this.dataViewCTS.endUpdate();
  //         this.templateGrid.slickGrid.invalidate();
  //         this.templateGrid.slickGrid.render();
  //         this.templateGrid.slickGrid.setSelectedRows([lRows[0]]);
  //         this.templateGrid.slickGrid.setActiveCell(lRows[0], 0);
  //       }
  //     }
  //   }
  //   return true;
  // }
  ClearMeshDetails() {
    var lStatus = this.OrderStatus;
    var lScheduledProd = this.ScheduledProd;

    if ((((lStatus != "New" && lStatus != "Created" && lStatus != "Created*") || this.gOrderCreation != "Yes") &&
      (lStatus != "Sent" || this.gOrderSubmission != "Yes")) || lScheduledProd == "Y") {

      alert("Cannot clear row content for submitted or standby order.");

    } else {

      var lRows = this.templateGrid.slickGrid.getSelectedRows();
      if (lRows.length > 0) {

        lRows.sort(function (a, b) { return a - b });
        var lRowsNo = ""
        for (var i = 0; i < lRows.length; i++) {
          if (lRowsNo.length == 0) {
            lRowsNo = (lRows[i] + 1).toString();
          }
          else {
            lRowsNo = lRowsNo + ", " + (lRows[i] + 1).toString();
          }
        }
        if (confirm('It going to clear all contents for selected items: ' + lRowsNo + ". Are you sure?\n\n"
          + "将要清除所选行的全部内容, 其行号为：" + lRowsNo + ". 请确认?")) {

          var lCustomerCode = this.CustomerCode;
          var lProjectCode = this.ProjectCode;
          var lOrder = this.ordernumber;
          var lJobID = parseInt(lOrder);
          this.dataViewCTS.beginUpdate();

          for (var i = 0; i < lRows.length; i++) {
            var lItem = this.templateGrid.slickGrid.getDataItem(lRows[i]);
            if (lItem.BBSID == 1) {
              lItem.MeshMark = null;
              lItem.MeshWidth = null;
              lItem.MeshDepth = null;
              lItem.MeshSlope = null;
              lItem.MeshProduct = null;
              lItem.MeshShapeCode = null;
              lItem.MeshTotalLinks = null;
              lItem.MeshSpan = null;
              lItem.MeshMemberQty = null;
              lItem.MeshCapping = null;
              lItem.MeshCPProduct = null;
              lItem.A = null;
              lItem.B = null;
              lItem.C = null;
              lItem.D = null;
              lItem.E = null;
              lItem.P = null;
              lItem.Q = null;
              lItem.HOOK = null;
              lItem.LEG = null;
              lItem.MeshTotalWT = null;
              lItem.Remarks = null;
              lItem.MeshShapeParameters = "";
              lItem.MeshEditParameters = "";
              lItem.MeshShapeParamTypes = "";
              lItem.MeshShapeMinValues = null;
              lItem.MeshShapeMaxValues = null;
              lItem.MeshShapeWireTypes = null;
              lItem.MeshCreepMO1 = null;
              lItem.MeshCreepCO1 = null;
              lItem.ProdMWDia = null;
              lItem.ProdMWSpacing = null;
              lItem.ProdCWDia = null;
              lItem.ProdCWSpacing = null;
              lItem.ProdMass = null;
              lItem.ProdMinFactor = null;
              lItem.ProdTwinInd = "";
              this.orderService.saveMeshOthersDetails_ctsmesh(lItem).subscribe({
                next: (response) => {
                  //console.log('CTS Link Mesh Details', response);
                },
                error: (e) => {
                  this.toastr.error(
                    'Saving data error. Please check the Internet connection and try again.'
                  );
                },
                complete: () => {
                  // this.loading = false;
                },
              });
            }
          }
          this.dataViewCTS.endUpdate();
          this.templateGrid.slickGrid.invalidate();
          this.templateGrid.slickGrid.render();
          this.templateGrid.slickGrid.setSelectedRows([lRows[0]]);
          this.templateGrid.slickGrid.setActiveCell(lRows[0], 0);
        }
      }
    }
    return true;
  }



  getSlickGridRowFromEvent(event: MouseEvent) {
    const slickgrid = this.templateGrid?.slickGrid;

    if (slickgrid) {
      const cell = slickgrid.getCellFromEvent(event);
      if (cell) {
        const row = cell.row;
        return slickgrid.getDataItem(row);
      }
    }

    return null;
  }

  //   gridCTSMesh.onContextMenu.subscribe(function (e) {
  //     e.preventDefault();
  //     var cell = gridCTSMesh.getCellFromEvent(e);
  //     $("#contextMenu")
  //         .data("row", cell.row)
  //         .css("top", e.pageY)
  //         .css("left", e.pageX)
  //         .show();

  //     $("body").one("click", function () {
  //         $("#contextMenu").hide();
  //     });
  // });

  //   onRightClick(e: any) {
  // debugger;
  //     // const row = this.getSlickGridRowFromEvent(event);
  //     //debugger;
  //     if ((this.OrderStatus != "New" &&
  //       this.OrderStatus != "Created") ||
  //       this.gOrderCreation != "Yes") {
  //       return;
  //     }

  //     if (!this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit()) {
  //       return;
  //     }

  //     let lFuncs = e;

  //     if (lFuncs == "insert") {
  //       this.InsertItem();
  //     }
  //     else if (lFuncs == "delete") {
  //       this.DeleteMeshDetails();
  //     }
  //     else if (lFuncs == "clear") {
  //       this.ClearMeshDetails()
  //     }
  //     else if (lFuncs == "copy") {
  //       this.MeshCopy(this.templateGrid.slickGrid);
  //     }
  //     else if (lFuncs == "paste") {
  //       this.MeshPaste();
  //     }
  //     else if (lFuncs == "weight") {
  //       // let lRows = this.templateGrid.slickGrid.getSelectedRows();
  //       let lRows = this.tempslcikgridrow;
  //       let lMaxRowNo = 0;
  //       let lWeight = 0;
  //       if (this.tempslcikgridrow != null) {
  //         lRows.length = 1;
  //       }
  //       if (lRows.length > 0) {
  //         for (let i = 0; i < lRows.length; i++) {
  //           if (lMaxRowNo < lRows.length) {
  //             lMaxRowNo = lRows.length;
  //           }
  //           let lItem = this.templateGrid.slickGrid.getDataItem(this.tempcurrrow);
  //           if (lItem.MeshTotalWT != null) {
  //             if (lItem.MeshTotalWT > 0) {
  //               lWeight = lWeight + parseFloat(lItem.MeshTotalWT);
  //             }
  //           }
  //         }
  //         let lItem = this.templateGrid.slickGrid.getDataItem(lMaxRowNo);
  //         lItem.Remarks = (Math.round(lWeight * 1000) / 1000).toFixed(3);
  //         this.dataViewCTS.updateItem(lItem.id, lItem);

  //         this.templateGrid.slickGrid.invalidateRow(lMaxRowNo);
  //         this.templateGrid.slickGrid.render();
  //       }
  //     }
  //     else if (lFuncs == "qty") {
  //       // let lRows = this.templateGrid.slickGrid.getSelectedRows();
  //       let lRows = this.tempslcikgridrow;
  //       let lMaxRowNo = 0;
  //       let lQty = 0;
  //       if (this.tempslcikgridrow != null) {
  //         lRows.length = 1;
  //       }
  //       if (lRows.length > 0) {
  //         for (let i = 0; i < lRows.length; i++) {
  //           if (lMaxRowNo < lRows.length) {
  //             lMaxRowNo = lRows.length;
  //           }
  //           let lItem = this.templateGrid.slickGrid.getDataItem(this.tempcurrrow);
  //           if (lItem.MeshMemberQty != null) {
  //             if (lItem.MeshMemberQty > 0) {
  //               lQty = lQty + lItem.MeshMemberQty;
  //             }
  //           }
  //         }
  //         let lItem = this.templateGrid.slickGrid.getDataItem(lMaxRowNo);
  //         lItem.Remarks = lQty;
  //         this.dataViewCTS.updateItem(lItem.id, lItem);

  //         this.templateGrid.slickGrid.invalidateRow(lMaxRowNo);
  //         this.templateGrid.slickGrid.render();
  //       }
  //     }

  //   }


  onRightClick(e: any) {
    let lFuncs = e;
    if ((this.OrderStatus != "New" &&
      this.OrderStatus != "Created" && this.OrderStatus != "Created*") ||
      this.gOrderCreation != "Yes") {
      return;
    }

    if (!this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit()) {
      return;
    }

    // var lFuncs = $(e.target).attr("data");

    if (lFuncs == "insert") {
      this.InsertItem();
    }
    else if (lFuncs == "delete") {
      this.DeleteMeshDetails();
    }
    else if (lFuncs == "clear") {
      this.ClearMeshDetails()
    }
    else if (lFuncs == "copy") {
      // this.MeshCopy();
    }
    else if (lFuncs == "paste") {
      this.MeshPaste();
    }
    else if (lFuncs == "weight") {
      var lRows = this.templateGrid.slickGrid.getSelectedRows();
      var lMaxRowNo = 0;
      var lWeight = 0;
      if (lRows.length > 0) {
        for (var i = 0; i < lRows.length; i++) {
          if (lMaxRowNo < lRows[i]) {
            lMaxRowNo = lRows[i];
          }
          var lItem = this.templateGrid.slickGrid.getDataItem(lRows[i]);
          if (lItem.MeshTotalWT != null) {
            if (lItem.MeshTotalWT > 0) {
              lWeight = lWeight + parseFloat(lItem.MeshTotalWT);
            }
          }
        }
        var lItem = this.templateGrid.slickGrid.getDataItem(lMaxRowNo);
        lItem.Remarks = (Math.round(lWeight * 1000) / 1000).toFixed(3);
        this.dataViewCTS.updateItem(lItem.id, lItem);

        this.templateGrid.slickGrid.invalidateRow(lMaxRowNo);
        this.templateGrid.slickGrid.render();
      }
    }
    else if (lFuncs == "qty") {
      var lRows = this.templateGrid.slickGrid.getSelectedRows();
      var lMaxRowNo = 0;
      var lQty = 0;
      if (lRows.length > 0) {
        for (var i = 0; i < lRows.length; i++) {
          if (lMaxRowNo < lRows[i]) {
            lMaxRowNo = lRows[i];
          }
          var lItem = this.templateGrid.slickGrid.getDataItem(lRows[i]);
          if (lItem.MeshMemberQty != null) {
            if (lItem.MeshMemberQty > 0) {
              lQty = lQty + lItem.MeshMemberQty;
            }
          }
        }
        var lItem = this.templateGrid.slickGrid.getDataItem(lMaxRowNo);
        lItem.Remarks = lQty;
        this.dataViewCTS.updateItem(lItem.id, lItem);

        this.templateGrid.slickGrid.invalidateRow(lMaxRowNo);
        this.templateGrid.slickGrid.render();
      }
    }
  }
  resetInput() {
    this.tableInput = {
      id: 0,
      CustomerCode: '',
      ProjectCode: '',
      JobID: 0,
      BBSID: 0,
      MeshID: 0,
      MeshSort: 0,
      MeshMark: '',
      MeshProduct: '',
      MeshMainLen: 0,
      MeshCrossLen: 0,
      MeshMO1: 0,
      MeshMO2: 0,
      MeshCO1: 0,
      MeshCO2: 0,
      MeshMemberQty: 0,
      MeshShapeCode: '',
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
      K: 0,
      L: 0,
      M: 0,
      N: 0,
      O: 0,
      P: 0,
      Q: 0,
      R: 0,
      S: 0,
      T: 0,
      U: 0,
      V: 0,
      W: 0,
      X: 0,
      Y: 0,
      Z: 0,
      HOOK: 0,
      MeshTotalWT: 0,
      Remarks: '',
      MWBOM: '',
      CWBOM: '',
      UpdateDate: new Date(),
      UpdateBy: 'Vishal',
      ProdMWDia: 0,
      ProdMWSpacing: 0,
      ProdCWDia: 0,
      ProdCWSpacing: 0,
      ProdMass: 0,
      ProdMinFactor: 0,
      ProdMaxFactor: 0,
      ProdTwinInd: '',
      MeshShapeParameters: '',
      MeshEditParameters: '',
      MeshShapeParamTypes: '',
      MeshShapeMinValues: '',
      MeshShapeMaxValues: '',
      MeshShapeWireTypes: '',
    };
  }

  saveediteddata(item: any) {
    this.editIndex = -1;
    let obj: CTSMESHOthersDetailsModels = {
      CustomerCode: item.CustomerCode,
      ProjectCode: item.ProjectCode,
      JobID: item.JobID,
      BBSID: item.BBSID,
      MeshID: item.MeshID,
      MeshSort: item.MeshSort,
      MeshMark: item.MeshMark,
      MeshProduct: item.MeshProduct,
      MeshMainLen: item.MeshMainLen,
      MeshCrossLen: item.MeshCrossLen,
      MeshMO1: item.MeshMO1,
      MeshMO2: item.MeshMO2,
      MeshCO1: item.MeshCO1,
      MeshCO2: item.MeshCO2,
      MeshMemberQty: item.MeshMemberQty,
      MeshShapeCode: item.MeshShapeCode,
      A: item.A,
      B: item.B,
      C: item.C,
      D: item.D,
      E: item.E,
      F: item.F,
      G: item.G,
      H: item.H,
      I: item.I,
      J: item.J,
      K: item.K,
      L: item.L,
      M: item.M,
      N: item.N,
      O: item.O,
      P: item.P,
      Q: item.Q,
      R: item.R,
      S: item.S,
      T: item.T,
      U: item.U,
      V: item.V,
      W: item.W,
      X: item.X,
      Y: item.Y,
      Z: item.Z,
      HOOK: item.HOOK,
      MeshTotalWT: item.MeshTotalWT,
      Remarks: item.Remarks,
      MWBOM: item.MWBOM,
      CWBOM: item.CWBOM,
      UpdateDate: new Date(),
      UpdateBy: 'Vishal',
    };
    this.orderService.saveMeshOthersDetails_ctsmesh(obj).subscribe({
      next: (response) => {
        //console.log('CTS Link Mesh Details', response);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }
  selectrow(item: any) {
    item.isselected = true;
  }

  saveData() {
    //debugger;
    this.SaveTableData();

    //console.log(this.tableInput);
    let tempobj = {
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,

      JobID: this.JobID,

      BBSID: this.BBSID,

      MeshID: this.tableInput.MeshID,
      MeshSort: this.tableInput.MeshSort,
      MeshMark: this.tableInput.MeshMark,
      MeshProduct: this.tableInput.MeshProduct,
      MeshMainLen: this.tableInput.MeshMainLen,
      MeshCrossLen: this.tableInput.MeshCrossLen,
      MeshMO1: this.tableInput.MeshMO1,
      MeshMO2: this.tableInput.MeshMO2,
      MeshCO1: this.tableInput.MeshCO1,
      MeshCO2: this.tableInput.MeshCO2,
      MeshMemberQty: this.tableInput.MeshMemberQty,
      MeshShapeCode: this.tableInput.MeshShapeCode,
      A: this.tableInput.A,
      B: this.tableInput.B,
      C: this.tableInput.C,
      D: this.tableInput.D,
      E: this.tableInput.E,
      F: this.tableInput.F,
      G: this.tableInput.G,
      H: this.tableInput.H,
      I: this.tableInput.I,
      J: this.tableInput.J,
      K: this.tableInput.K,
      L: this.tableInput.L,
      M: this.tableInput.M,
      N: this.tableInput.N,
      O: this.tableInput.O,
      P: this.tableInput.P,
      Q: this.tableInput.Q,
      R: this.tableInput.R,
      S: this.tableInput.S,
      T: this.tableInput.T,
      U: this.tableInput.U,
      V: this.tableInput.V,
      W: this.tableInput.W,
      X: this.tableInput.X,
      Y: this.tableInput.Y,
      Z: this.tableInput.Z,
      HOOK: this.tableInput.HOOK,
      MeshTotalWT: this.tableInput.MeshTotalWT,
      Remarks: this.tableInput.Remarks,
      MWBOM: this.tableInput.MWBOM,
      CWBOM: this.tableInput.CWBOM,

      MeshShapeParameters: '',
      MeshEditParameters: '',
      MeshShapeParamTypes: '',
      MeshShapeMinValues: '',
      MeshShapeMaxValues: '',
      MeshShapeWireTypes: '',

      MeshCreepMO1: false,
      MeshCreepCO1: false,

      ProdMWDia: 0,
      ProdMWSpacing: 0,
      ProdCWDia: 0,
      ProdCWSpacing: 0,
      ProdMass: 0,
      ProdTwinInd: 'string',
    };
    // let tempobj = {
    //   sno: this.bbsOrderTable.length + 1,
    //   cancel: false,
    //   elementmark: this.tableInput.elementmark,
    //   Mark: this.tableInput.Mark,
    //   Type: this.tableInput.Type,
    //   Size: this.tableInput.Size,
    //   standardbar: this.tableInput.standardbar,
    //   Memberqty: this.tableInput.Memberqty,
    //   Eachqty: this.tableInput.Eachqty,
    //   Totalqty: this.tableInput.Totalqty,
    //   Shapecode: this.tableInput.Shapecode,
    //   A: this.tableInput.A,
    //   B: this.tableInput.B,
    //   C: this.tableInput.C,
    //   D: this.tableInput.D,
    //   E: this.tableInput.E,
    //   F: this.tableInput.F,
    //   G: this.tableInput.G,
    //   PinSize: this.tableInput.PinSize,
    //   Length: this.tableInput.Length,
    //   Weight: this.tableInput.Weight,
    //   Remarks: this.tableInput.Remarks,
    //   BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length
    // }

    this.bbsOrderTable.push(tempobj);

    this.resetInput();
  }

  SaveTableData() {
    let obj: CTSMESHOthersDetailsModels = {
      CustomerCode: this.CustomerCode ?? '',
      ProjectCode: this.ProjectCode ?? '',
      JobID: this.JobID ?? 0,
      BBSID: this.BBSID ?? 0,
      MeshID: this.tableInput.MeshID ?? 0,
      MeshSort: this.tableInput.MeshSort ?? 0,
      MeshMark: this.tableInput.MeshMark ?? '',
      MeshProduct: this.tableInput.MeshProduct ?? '',
      MeshMainLen: this.tableInput.MeshMainLen ?? 0,
      MeshCrossLen: this.tableInput.MeshCrossLen ?? 0,
      MeshMO1: this.tableInput.MeshMO1 ?? 0,
      MeshMO2: this.tableInput.MeshMO2 ?? 0,
      MeshCO1: this.tableInput.MeshCO1 ?? 0,
      MeshCO2: this.tableInput.MeshCO2 ?? 0,
      MeshMemberQty: this.tableInput.MeshMemberQty ?? 0,
      MeshShapeCode: this.tableInput.MeshShapeCode ?? '',
      A: this.tableInput.A ?? 0,
      B: this.tableInput.B ?? 0,
      C: this.tableInput.C ?? 0,
      D: this.tableInput.D ?? 0,
      E: this.tableInput.E ?? 0,
      F: this.tableInput.F ?? 0,
      G: this.tableInput.G ?? 0,
      H: this.tableInput.H ?? 0,
      I: this.tableInput.I ?? 0,
      J: this.tableInput.J ?? 0,
      K: this.tableInput.K ?? 0,
      L: this.tableInput.L ?? 0,
      M: this.tableInput.M ?? 0,
      N: this.tableInput.N ?? 0,
      O: this.tableInput.O ?? 0,
      P: this.tableInput.P ?? 0,
      Q: this.tableInput.Q ?? 0,
      R: this.tableInput.R ?? 0,
      S: this.tableInput.S ?? 0,
      T: this.tableInput.T ?? 0,
      U: this.tableInput.U ?? 0,
      V: this.tableInput.V ?? 0,
      W: this.tableInput.W ?? 0,
      X: this.tableInput.X ?? 0,
      Y: this.tableInput.Y ?? 0,
      Z: this.tableInput.Z ?? 0,
      HOOK: this.tableInput.HOOK ?? 0,
      MeshTotalWT: this.tableInput.MeshTotalWT ?? 0,
      Remarks: this.tableInput.Remarks ?? '',
      MWBOM: this.tableInput.MWBOM ?? '',
      CWBOM: this.tableInput.CWBOM ?? '',
      UpdateDate: new Date(),
      UpdateBy: 'Vishal' ?? '',
    };
    this.orderService.saveMeshOthersDetails_ctsmesh(obj).subscribe({
      next: (response) => {
        //console.log('CTS Link Mesh Details', response);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getShapeCodeList(
    CustomerCode: string,
    ProjectCode: string,
    CouplerType: string
  ) {
    let lcategorey = 'OTHERS';
    this.orderService.getShapeImagesByCat(lcategorey).subscribe({
      next: (response) => {
        let allshapes;
        //console.log('shapeCodeList', response);
        this.shapeCodeList = response;
        // this.shapeCodeList=[];
        // for(let i=0 ; i< allshapes.length; i++){
        //   this.shapeCodeList.push(allshapes[i].shapeCode.toString());
        // if(this.shapeCodeList=="")
        // {
        //   this.shapeCodeList = `"${allshapes[i].shapeCode.toString()}",`;
        // }
        // else
        // {
        //   this.shapeCodeList += `"${allshapes[i].shapeCode.toString()}",`;
        // }
        // }
        // this.shapeCodeList=this.shapeCodeList.slice(0, -1);
        //console.log('final shapecodelist', this.shapeCodeList);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getRowData(item: any = []) {
    // this.Diameter=null
    // this.Spacing=null
    // this.CarrierWireDia=null
    // this.Mass=null
    // this.bbsOrderTemp=item;
    this.Diameter = item.ProdMWDia;
    this.Spacing = item.ProdCWSpacing;
    this.CarrierWireDia = item.ProdCWDia;
    this.Mass = item.ProdMass;
  }
  GetTableData(
    CustomerCode: string,
    ProjectCode: string,
    PostID: number,
    BBSID: number
  ) {
    //debugger;
    if (this.ScheduledProd == 'YES') {
      if (this.CustomerCode != '' && this.ProjectCode != '' && this.JobID > 0) {
        this.orderService
          .getOthersDetailsNSH(CustomerCode, ProjectCode, PostID)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);

              this.bbsOrderTable = response;
              //console.log(this.bbsOrderTable);
              this.TotalWeight = 0;
              for (let i = 0; i < this.bbsOrderTable.length; i++) {
                this.TotalWeight += this.bbsOrderTable[i].MeshTotalWT;
              }
            },
            error: (e) => {
              this.toastr.error(
                'Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..'
              );
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              // this.loading = false;
            },
          });
      }
    } else {
      if (this.CustomerCode != '' && this.ProjectCode != '' && this.JobID > 0) {
        this.orderService
          .getMeshOtherDetails(CustomerCode, ProjectCode, PostID, BBSID)
          .subscribe({
            next: (response) => {
              //console.log('BBSORDERDETAILS', response);

              this.bbsOrderTable = response;
            },
            error: (e) => {
              this.toastr.error(
                'Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..'
              );
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              // this.loading = false;
            },
          });
      }
    }
  }

  //   ProductCodeValidator(value: any, args: any) {
  //     var lCurrRow = args.grid.getActiveCell().row;
  //     var lItem = args.grid.getDataItem(lCurrRow);
  //     var lValue = value;
  //     // this.getProductCode();
  //     //debugger;
  //     var gOthersProdCode=args.grid.isDataFetching;
  // //debugger;

  //     var lProdCodeAR = gOthersProdCode.split(',');
  //     var lFound = 0;
  //     if (lProdCodeAR.length > 0) {
  //       for (let i = 0; i < lProdCodeAR.length; i++) {
  //         if (lProdCodeAR[i] == lValue) {
  //           lFound = 1;
  //           break;
  //         }
  //       }
  //     }
  //     if (lFound == 0) {
  //       //alert("Invalid weight. SB product can only order by bundles (2 tons per bundle). Please enter valid weight, such as 2000, 4000, 6000.");
  //       // this.templateGrid.slickGrid.getActiveCellNode().effect("highlight", { color: "red" }, 300);
  //       return {
  //         valid: false,
  //         msg: 'Invalid product code entered.' + '(输入的产品代码无效.)',
  //       };
  //     }
  //     return { valid: true, msg: null };
  //   }

  color: any = 'red';
  WireLengthValidator = (value: any, args: any) => {
    var lCurrRow: any = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lColumnName = args.grid.getColumns()[lCurrCell]['id'];
    var lItem = args.grid.getDataItem(lCurrRow);
    var lValue = value;

    // verify Main Length
    if (lColumnName == 'MeshMainLen' && lValue > 0) {
      var lCrossWire: any = 0;
      if (lItem != null) {
        lCrossWire = lItem.MeshCrossLen;
      }
      if (lCrossWire == null || lCrossWire == '') {
        lCrossWire = 0;
      }
      // let color="red";
      if (lValue < 400) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        // $(this.templateGrid.slickGrid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'Invalid data entered. The minimum main wire length is 400.(输入数据无效, 主筋的最小值为400)',
        };
      }

      if (lCrossWire > this.getMeshSLabMaxlength('C', lItem)) {
        if (lValue > this.getMeshSLabMaxlength('M', lItem)) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid data entered. The maximum main wire length cannot more than ' +
              this.getMeshSLabMaxlength('M', lItem) +
              '.(输入数据无效, 主筋的长度不能超过' +
              this.getMeshSLabMaxlength('M', lItem) +
              ')',
          };
        }
      } else {
        var lPordCode = '';
        if (lItem != null) {
          lPordCode = lItem.MeshProduct.value?lItem.MeshProduct.value:lItem.MeshProduct;
        }
        if (lPordCode.substring(0, 2) == 'WF') {
          if (lValue > 7000) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg: 'Invalid data entered. The maximum main wire length is 7000.(输入数据无效, 主筋的最大值为7000)',
            };
          }
        } else {
          var lMax = this.getMeshSLabMaxlength('M', lItem);
          if (lValue > lMax) {
            // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid data entered. The maximum main wire length is ' +
                lMax +
                'mm.(输入数据无效, 主筋的最大值为' +
                lMax +
                'mm)',
            };
          }
        }
      }
    }

    // verify Cross Length
    if (lColumnName == 'MeshCrossLen' && lValue > 0) {
      var lPordCode = '';
      var lTwinInd = '';
      var lMainWire = 0;

      if (lItem != null) {
        lPordCode = lItem.MeshProduct.value?lItem.MeshProduct.value:lItem.MeshProduct;
        lTwinInd = lItem.ProdTwinInd;
        lMainWire = lItem.MeshMainLen;
      }
      if (
        lPordCode.substring(0, 2) == 'WF' ||
        lPordCode.substring(0, 2) == 'W2F'
      ) {
        if (lValue < 800) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // $(this.templateGrid.slickGrid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'Invalid data entered. The minimum cross wire length is 800.(输入数据无效, 副筋的最小值为800)',
          };
        }
      } else {
        if (lValue < 800) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'Invalid data entered. The minimum cross wire length is 800.(输入数据无效, 副筋的最小值为800)',
          };
        }
      }
      if (lPordCode.substring(0, 2) == 'WF' || lTwinInd == 'M') {
        if (lValue > 1800) {
          // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'Invalid data entered. The maximum main wire length is 1800.(输入数据无效, 副筋的最大值为1800)',
          };
        }
      } else {
        if (lMainWire > this.getMeshSLabMaxlength('M', lItem)) {
          if (lValue > this.getMeshSLabMaxlength('C', lItem)) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid data entered. The maximum cross wire length is ' +
                this.getMeshSLabMaxlength('C', lItem) +
                '.(输入数据无效, 副筋的最大值为' +
                this.getMeshSLabMaxlength('C', lItem) +
                ')',
            };
          }
        } else {
          var lMax = this.getMeshSLabMaxlength('C', lItem);
          if (lValue > lMax) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid data entered. The maximum cross wire length is ' +
                lMax +
                '.(输入数据无效, 副筋的最大值为' +
                lMax +
                ')',
            };
          }
        }
      }
    }
    return { valid: true, msg: null };
  };

  getMeshSLabMaxlength(pWireType: any, pItem: any) {
    var lMax1 = 2400;

    var lTransport = (<HTMLInputElement>(
      document.getElementById('order_transport')
    )).value;

    if (lTransport == 'LB35' || lTransport == 'LB30') {
      lMax1 = 3000;
    } else if (lTransport == 'LB40') {
      lMax1 = 5000;
    } else if (lTransport == 'LBE') {
      lMax1 = 6000;
    }

    if (pWireType == 'M') {
      var lCrossLen = 0;
      if (pItem != null) {
        lCrossLen = pItem.MeshCrossLen;
      }
      if (lCrossLen == null || lCrossLen <= lMax1) {
        this.lMax = 6000;
        if (
          lTransport == 'LB35' ||
          lTransport == 'LB40' ||
          lTransport == 'TR40/24' ||
          lTransport == 'LB30' ||
          lTransport == 'LBE'
        ) {
          this.lMax = 7000;
        }
      } else {
        this.lMax = lMax1;
      }
    }

    if (pWireType == 'C') {
      var lMainLen = 0;
      if (pItem != null) {
        lMainLen = pItem.MeshMainLen;
      }
      if (lMainLen == null || lMainLen <= lMax1) {
        this.lMax = 6000;
        if (
          lTransport == 'LB35' ||
          lTransport == 'LB40' ||
          lTransport == 'TR40/24' ||
          lTransport == 'LB30' ||
          lTransport == 'LBE'
        ) {
          this.lMax = 7000;
        }
      } else {
        this.lMax = lMax1;
      }
    }

    if (pWireType != null && pItem != null) {
      var lSHapeCode = '';
      if (pItem != null) {
        lSHapeCode = pItem.MeshShapeCode.value?pItem.MeshShapeCode.value:pItem.MeshShapeCode;

        if (lSHapeCode != null && lSHapeCode != '' && lSHapeCode != 'F') {
          if (pWireType == 'C') {
            if (lSHapeCode == '1C1' || lSHapeCode == '1CR1') {
              var lA = parseInt(pItem.A);
              var lB = parseInt(pItem.B);
              if (lA != null && lB != null) {
                if (lA > lB) {
                  lA = lB;
                }
                this.lMax = this.lMax + lA;
              }
            }
            if (lSHapeCode == '2C1' || lSHapeCode == '2CR1') {
              var lA = parseInt(pItem.A);
              var lB = parseInt(pItem.B);
              var lC = parseInt(pItem.C);
              if (lA != null && lB != null && lC != null) {
                if (lB >= lA && lB >= lC) {
                  this.lMax = this.lMax + lA + lC;
                } else {
                  if (lA > lC) {
                    lA = lC;
                  }
                  this.lMax = this.lMax + lB + lC;
                }
              }
            }

            if (this.lMax > 6000) {
              this.lMax = 6000;
            }
          }

          if (pWireType == 'M') {
            if (lSHapeCode == '1M1' || lSHapeCode == '1MR1') {
              var lA = parseInt(pItem.A);
              var lB = parseInt(pItem.B);
              if (lA != null && lB != null) {
                if (lA > lB) {
                  lA = lB;
                }
                this.lMax = this.lMax + lA;
              }
            }
            if (lSHapeCode == '2M1' || lSHapeCode == '2MR1') {
              var lA = parseInt(pItem.A);
              var lB = parseInt(pItem.B);
              var lC = parseInt(pItem.C);
              if (lA != null && lB != null && lC != null) {
                if (lB >= lA && lB >= lC) {
                  this.lMax = this.lMax + lA + lC;
                } else {
                  if (lA > lC) {
                    lA = lC;
                  }
                  this.lMax = this.lMax + lB + lC;
                }
              }
            }

            if (this.lMax > 7000) {
              this.lMax = 7000;
            }
          }
        }
      }
    }
    return this.lMax;
  }

  QtyValidator = (value: any, args: any) => {
    var lValue = value;
    //console.log(value);

    if (isNaN(lValue) == true) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter valid numeric range.(输入数据无效, 请输入数字范围)',
      };
    }

    if (lValue.toString().indexOf('.') >= 0) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue <= 0) {
      //alert("Indalid parameter value.");
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }

    if (lValue > 500) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      // ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid parameter value. The value have to be lesser than or equal to 500.',
      };
    }
    return { valid: true, msg: null };
  };

  getVarMinValue(...values: number[]): number {
    if (values.length === 0) {
      throw new Error('No values provided to find the minimum.');
    }

    return Math.min(...values);
  }

  parameterValidator = (value: any, args: any) => {
    //debugger;
    var lCurrRow = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lColumnName = args.grid.getColumns()[lCurrCell]['id'];
    var lItem = args.grid.getDataItem(lCurrRow);
    var lPara = lItem.MeshEditParameters;
    var lParaType = this.getListValue(
      lPara,
      lItem.MeshShapeParamTypes,
      lColumnName
    );
    var lWireType = this.getListValue(
      lPara,
      lItem.MeshShapeWireTypes,
      lColumnName
    );
    var lMinValue = parseInt(
      this.getListValue(lPara, lItem.MeshShapeMinValues, lColumnName)
    );
    var lMaxValue = parseInt(
      this.getListValue(lPara, lItem.MeshShapeMaxValues, lColumnName)
    );
    var lMWDia = parseInt(lItem.ProdMWDia);
    var lCWDia = parseInt(lItem.ProdCWDia);
    var lBBSID = lItem.BBSID;
    var lShape = lItem.MeshShapeCode.value?lItem.MeshShapeCode.value:lItem.MeshShapeCode;
    var lValue = value;

    if (lValue == null || lValue == '') {
      return { valid: true, msg: null };
    }

    if (isNaN(lValue) == true) {
      if (lValue.toString().indexOf('-') <= 0) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter numeric value.(输入数据无效, 请输入数字)',
        };
      } else {
        var lMax = this.getVarMaxValue(lValue);
        var lMin = this.getVarMinValue(lValue);
        if (lMax <= 0 || lMin <= 0 || lMin == lMax) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'Invalid data entered. Please enter valid numeric range.(输入数据无效, 请输入数字范围)',
          };
        }
      }
    }

    if (lValue.toString().indexOf('.') >= 0) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue <= 0) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }

    if (lValue > 6000) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Parameter value cannot be longer than 6000.(输入数据无效, 参数值不应该大于6000.)',
      };
    }

    //Check main wire min length
    if (lParaType == 'S') {
      var lLimit = 100;
      if (lWireType == 'M') {
        //var lLimit = Math.ceil((lMWDia + 32) / 5) * 5
        if (lValue < lLimit) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid parameter value. The value should be greater than and equal to ' +
              lLimit +
              '. (输入数据无效, 此值应该不小于' +
              lLimit +
              ')',
          };
        }
      } else {
        //var lLimit = Math.ceil((lCWDia + 32) / 5) * 5
        if (lValue < lLimit) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid parameter value. The value should be greater than and equal to ' +
              lLimit +
              '. (输入数据无效, 此值应该不小于' +
              lLimit +
              ')',
          };
        }
      }
    }

    if (lShape == '1M1' && lColumnName == 'A') {
      if (lValue > lItem['MeshMainLen'] + 100) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid parameter value. Parameter A for 1M1 shape. It should be less than main wire length.' +
            '. (输入数据无效, 对图形1M1, 参数A必须小于主筋长.)',
        };
      }
    }

    //Check 2M1 A/V max 1800mm

    if (lShape == '2M1' && (lColumnName == 'A' || lColumnName == 'C')) {
      if (lValue > 1800) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid parameter value. Parameter A or C maximum value is 1800mm for 2M1 shape. ' +
            '. (输入数据无效, 对图形2M1, 参数A或C的最大值为1800mm)',
        };
      }
    }

    if ((lShape == '2M1' || lShape == '2MR1') && lColumnName == 'B') {
      var lA = lItem.A;
      var lML = lItem.MeshMainLen;
      if (lML - lA - lValue > 1800) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid parameter value. Parameter A or C maximum value is 1800mm for 2M1/2MR1 shape. The remain value for C is greater than 1800. ' +
            '. (输入数据无效, 对图形2M1, 2MR1, 参数A或C的最大值为1800mm. 计算后C的值大于1800.)',
        };
      }
    }

    if (lShape == '2MR1' && (lColumnName == 'A' || lColumnName == 'C')) {
      if (lValue > 1800) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid parameter value. Parameter A or C maximum value is 1800mm for 2M1 shape. ' +
            '. (输入数据无效, 对图形2M1, 参数A或C的最大值为1800mm)',
        };
      }
    }

    //Cross bending
    if (lShape == '1C1' && lColumnName == 'A') {
      if (lValue > lItem['MeshCrossLen'] + 100) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid parameter value. Parameter A for 1C1 shape. It should be less than cross wire length.' +
            '. (输入数据无效, 对图形1C1, 参数A必须小于副筋长.)',
        };
      }
    }

    //Check 2C1 A/V max 1800mm

    if (lShape == '2C1' && (lColumnName == 'A' || lColumnName == 'C')) {
      if (lValue > 1800) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid parameter value. Parameter A or C maximum value is 1800mm for 2C1 shape. ' +
            '. (输入数据无效, 对图形2C1, 参数A或C的最大值为1800mm)',
        };
      }
    }

    if (lShape == '2CR1' && (lColumnName == 'A' || lColumnName == 'C')) {
      if (lValue > 1800) {
        const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
        if (activeCellNode) {
          activeCellNode.style.backgroundColor = this.color;
          activeCellNode.classList.add('highlight');

          setTimeout(() => {
            activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
            activeCellNode.classList.remove('highlight');
          }, 2000);
        }
        ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid parameter value. Parameter A or C maximum value is 1800mm for 2C1 shape. ' +
            '. (输入数据无效, 对图形2C1, 参数A或C的最大值为1800mm)',
        };
      }
    }

    //Check main wire hook length
    if (lParaType == 'HK') {
      if (lWireType == 'M') {
        if (lBBSID == 1) {
          if (lMWDia == 8 && lValue != 55 && lValue != 60 && lValue != 65) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid parameter value. Hook length should be 55, 60 or 65 for diameter 8 wire cage. ' +
                '. (输入数据无效, 此值应该是55, 60, 65)',
            };
          } else if (lMWDia > 8 && lValue != 60 && lValue != 65) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid parameter value. Hook length should be 60 or 65. ' +
                '. (输入数据无效, 此值应该是60, 65)',
            };
          }
        } else {
          var lLimit = Math.ceil((2 * lMWDia + 32) / 5) * 5;
          if (lValue < lLimit) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid parameter value. Hook length should be greater than and equal to ' +
                lLimit +
                '. (输入数据无效, 此值应该不小于' +
                lLimit +
                ')',
            };
          }
          if (lShape == 'LM1' || lShape == 'LMR1') {
            var lLimit = Math.ceil((2 * 32 + 2 * lMWDia) / 5) * 5;
            if (lValue > lLimit) {
              const activeCellNode =
                this.templateGrid.slickGrid.getActiveCellNode();
              if (activeCellNode) {
                activeCellNode.style.backgroundColor = this.color;
                activeCellNode.classList.add('highlight');

                setTimeout(() => {
                  activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                  activeCellNode.classList.remove('highlight');
                }, 2000);
              }
              ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
              return {
                valid: false,
                msg:
                  'You can replace the shape with 2M1 if the Hook length is greater then ' +
                  lLimit +
                  '. ' +
                  lLimit +
                  '. (你可用2M1来取代本图形, 如果它的钩宽大于' +
                  lLimit +
                  ')',
              };
            }
          } else {
            var lLimit = Math.ceil((2 * 32 + 2 * lMWDia) / 5) * 5;
            var lLimit = 65 + 2 * lMWDia;
            if (lValue > lLimit) {
              const activeCellNode =
                this.templateGrid.slickGrid.getActiveCellNode();
              if (activeCellNode) {
                activeCellNode.style.backgroundColor = this.color;
                activeCellNode.classList.add('highlight');

                setTimeout(() => {
                  activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                  activeCellNode.classList.remove('highlight');
                }, 2000);
              }
              ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
              return {
                valid: false,
                msg:
                  'Hook length cannot be greater then ' +
                  lLimit +
                  '. ' +
                  lLimit +
                  '. (钩宽不可大于' +
                  lLimit +
                  ')',
              };
            }
          }
        }
      } else {
        var lLimit = Math.ceil((2 * lCWDia + 32) / 5) * 5;
        if (lValue < lLimit) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid parameter value. Hook length should be greater than and equal to ' +
              lLimit +
              '. (输入数据无效, 此值应该不小于' +
              lLimit +
              ')',
          };
        }

        var lLimit = Math.ceil((2 * 32 + 2 * lMWDia) / 5) * 5;
        if (lValue > lLimit) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Hook length cannot be greater then ' +
              lLimit +
              '. ' +
              lLimit +
              '. (钩宽不可大于' +
              lLimit +
              ')',
          };
        }
      }
    }

    // verification of angle value
    if (lParaType == 'V') {
      if (lMinValue > 0) {
        if (lValue < lMinValue) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid parameter value. The value should not be less than ' +
              lMinValue +
              '.(输入数据无效, 此值应该不小于' +
              lMinValue +
              ')',
          };
        }
      }
      if (lMaxValue > 0) {
        if (lValue > lMaxValue) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          ////$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid parameter value. The value should not be greater than ' +
              lMaxValue +
              '.(输入数据无效, 此值应该不大于' +
              lMaxValue +
              ')',
          };
        }
      }
    }

    return { valid: true, msg: null };
  };

  getListValue(pParaList: any, pValueList: any, pPara: any) {
    var lReturn = '';
    if (pParaList != null && pValueList != null && pPara != null) {
      var lParaA = pParaList.split(',');
      var lValueA = pValueList.split(',');
      if (lParaA.length > 0) {
        for (let i = 0; i < lParaA.length; i++) {
          if (lParaA[i] == pPara) {
            lReturn = lValueA[i];
            break;
          }
        }
      }
    }
    return lReturn;
  }

  getVarMaxValue(...values: number[]): number {
    if (values.length === 0) {
      throw new Error('No values provided to find the maximum.');
    }

    return Math.max(...values);
  }

  BOMValidator = (value: any, args: any) => {
    var lCurrRow = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lColumnName = args.grid.getColumns()[lCurrCell]['id'];
    var lItem = args.grid.getDataItem(lCurrRow);
    var lValue = value;

    if (lColumnName == 'MWBOM') {
      var lMWBOM = lValue;
      if (lMWBOM != null && lMWBOM != '') {
        var lCrossLen = lItem['MeshCrossLen'];
        var lMainDia = lItem['ProdMWDia'];
        var lCrossDia = lItem['ProdCWDia'];
        var lShapeCode = lItem['MeshShapeCode'].value ? lItem['MeshShapeCode'].value : lItem['MeshShapeCode'];

        if (
          lCrossLen == null ||
          isNaN(lCrossLen) == true ||
          lCrossLen == 0 ||
          lCrossLen == ''
        ) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Please enter cross wire length before entering the BOM string. ' +
              '. (请先输入付筋长.)',
          };
        }

        // Verify the BOM parameters
        lMWBOM = lMWBOM.trim();
        //console.log(lMWBOM);
        //console.log(lMWBOM.length);
        if (lMWBOM.length < 7) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'invalid Main Wire BOM string. ' + '. (输入的主筋子件无效)',
          };
        }

        var laStrVar = lMWBOM.split('-');

        if (lMWBOM.substring(0, 1) == 'F') {
          if (laStrVar.length < 7) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg: 'invalid Man Wire BOM string. ' + '. (输入的主筋子件无效)',
            };
          }
        } else {
          if (laStrVar.length < 4) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg: 'invalid Main Wire BOM string. ' + '. (输入的主筋子件无效)',
            };
          }
        }

        //Verify Number
        for (let j = 0; j < laStrVar.length; j++) {
          if (laStrVar[j] == '' || isNaN(laStrVar[j]) == true) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg: 'invalid main Wire BOM string. ' + '. (输入的主筋子件无效)',
            };
          }
        }
        //Verify Total length

        var lIntVar1 = 0;
        var lCO1 = 0;
        var lCO2 = 0;
        if (lMWBOM.substring(0, 1) == 'F') {
          lCO1 = parseInt(laStrVar[4]);
          lCO2 = parseInt(laStrVar[laStrVar.length - 1]);
          for (let j = 1; j <= laStrVar.length - 4; j += 4) {
            var lPitchNo = parseInt(laStrVar[j]);
            var lPitchLen = parseInt(laStrVar[j + 3]);
            lIntVar1 = lIntVar1 + lPitchNo * lPitchLen;
          }
        } else {
          lCO1 = parseInt(laStrVar[1]);
          lCO2 = parseInt(laStrVar[laStrVar.length - 1]);
          for (let j = 0; j <= laStrVar.length - 2; j += 2) {
            var lPitchNo = parseInt(laStrVar[j]);
            var lPitchLen = parseInt(laStrVar[j + 1]);
            lIntVar1 = lIntVar1 + lPitchNo * lPitchLen;
          }
        }
        if (lIntVar1 != lCrossLen) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid Main Wire BOM string. It does not match with cross wire length. ' +
              '. (输入的主筋子件无效, 与副筋长度无法匹配.)',
          };
        }
        //Overhang Validation after
        var lDeduction = 0;
        if (lCrossDia == 13) {
          if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
            lDeduction = 20;
          }
          if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
            lDeduction = 40;
          }
        } else {
          if (lShapeCode == '1C1' || lShapeCode == '1CR1') {
            lDeduction = 10;
          }
          if (lShapeCode == '2C1' || lShapeCode == '2CR1') {
            lDeduction = 20;
          }
        }
        if (lDeduction > 0 && lDeduction > lCO2 + 10) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid Main Wire BOM string, Cross Wire Overhand after wire bending deduction is invalid ' +
              '. (输入的主筋子件无效, 副筋边长有问题.)',
          };
        }
      }
    }

    if (lColumnName == 'CWBOM') {
      var lCWBOM = lValue;
      if (lCWBOM != null && lCWBOM != '') {
        var lMainLen = lItem['MeshMainLen'];
        var lMainDia = lItem['ProdMWDia'];
        var lCrossDia = lItem['ProdCWDia'];
        var lShapeCode = lItem['MeshShapeCode'].value ? lItem['MeshShapeCode'].value : lItem['MeshShapeCode'];

        if (
          lMainLen == null ||
          isNaN(lMainLen) == true ||
          lMainLen == 0 ||
          lMainLen == ''
        ) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Please enter main wire length before entering the Cross Wire BOM string. ' +
              '. (请先输入主筋长.)',
          };
        }

        // Verify the BOM parameters
        lCWBOM = lCWBOM.trim();
        if (lCWBOM.length < 7) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'invalid Cross Wire BOM string. ' + '. (输入的副筋子件无效)',
          };
        }

        var laStrVar = lCWBOM.split('-');

        if (lCWBOM.substring(0, 1) == 'F') {
          if (laStrVar.length < 7) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg: 'invalid Cross Wire BOM string. ' + '. (输入的副筋子件无效)',
            };
          }
        } else {
          if (laStrVar.length < 4) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg: 'invalid Cross Wire BOM string. ' + '. (输入的副筋子件无效)',
            };
          }
        }
        //Verify Number
        for (let j = 0; j < laStrVar.length; j++) {
          if (laStrVar[j] == '' || isNaN(laStrVar[j]) == true) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg: 'invalid Cross Wire BOM string. ' + '. (输入的副筋子件无效)',
            };
          }
        }
        //Verify Total length
        var lIntVar1 = 0;
        var lMO1 = 0;
        var lMO2 = 0;
        if (lCWBOM.substring(0, 1) == 'F') {
          lMO1 = parseInt(laStrVar[4]);
          lMO2 = parseInt(laStrVar[laStrVar.length - 1]);
          for (let j = 1; j <= laStrVar.length - 4; j += 4) {
            var lPitchNo = parseInt(laStrVar[j]);
            var lPitchLen = parseInt(laStrVar[j + 3]);
            lIntVar1 = lIntVar1 + lPitchNo * lPitchLen;
          }
        } else {
          lMO1 = parseInt(laStrVar[1]);
          lMO2 = parseInt(laStrVar[laStrVar.length - 1]);
          for (let j = 0; j <= laStrVar.length - 2; j += 2) {
            var lPitchNo = parseInt(laStrVar[j]);
            var lPitchLen = parseInt(laStrVar[j + 1]);
            lIntVar1 = lIntVar1 + lPitchNo * lPitchLen;
          }
        }

        if (lIntVar1 != lMainLen) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid Cross Wire BOM string. It does not match with main wire length. ' +
              '. (输入的副筋子件无效, 与主筋长度无法匹配.)',
          };
        }

        //Overhang Validation after
        var lDeduction = 0;
        if (lCrossDia == 13) {
          if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
            lDeduction = 20;
          }
          if (lShapeCode == '2M1' || lShapeCode == '2MR1') {
            lDeduction = 40;
          }
        } else {
          if (lShapeCode == '1M1' || lShapeCode == '1MR1') {
            lDeduction = 10;
          }
          if (lShapeCode == '2M1' || lShapeCode == '2MR1') {
            lDeduction = 20;
          }
        }
        if (lDeduction > 0 && lDeduction > lMO2 + 10) {
          const activeCellNode =
            this.templateGrid.slickGrid.getActiveCellNode();
          if (activeCellNode) {
            activeCellNode.style.backgroundColor = this.color;
            activeCellNode.classList.add('highlight');

            setTimeout(() => {
              activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
              activeCellNode.classList.remove('highlight');
            }, 2000);
          }
          // //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Invalid Cross Wire BOM string, Main Wire Overhand with wire bending deduction is invalid ' +
              '. (输入的副筋子件无效, 主筋边长有问题.)',
          };
        }
      }
    }

    return { valid: true, msg: null };
  };

  OverhangValidator = (value: any, args: any) => {
    var lCurrRow = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lColumnName = args.grid.getColumns()[lCurrCell]['id'];
    var lItem = args.grid.getDataItem(lCurrRow);
    var lShape = lItem.MeshShapeCode.value?lItem.MeshShapeCode.value:lItem.MeshShapeCode;
    var lValue = value;

    if (isNaN(lValue)) {
      return {
        valid: false,
        msg: 'Invalid value.(输入无效值)',
      };
    }

    if (lValue.toString().indexOf('.') >= 0) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue <= 0) {
      const activeCellNode = this.templateGrid.slickGrid.getActiveCellNode();
      if (activeCellNode) {
        activeCellNode.style.backgroundColor = this.color;
        activeCellNode.classList.add('highlight');

        setTimeout(() => {
          activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
          activeCellNode.classList.remove('highlight');
        }, 2000);
      }
      //alert("Indalid parameter value.");
      //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }

    if (lShape == '1M1' && lColumnName == 'MeshMO1') {
      var lCrossSpacing = lItem['ProdCWSpacing'];
      var lMO1 = lValue;

      if (!isNaN(lItem['A']) && lCrossSpacing > 0) {
        if (lMO1 <= parseInt(lItem['A'])) {
          if (
            (parseInt(lItem['A']) - lMO1) % lCrossSpacing < 50 ||
            lCrossSpacing - ((parseInt(lItem['A']) - lMO1) % lCrossSpacing) < 50
          ) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid MO1 value for 1M1 shape as it will hit cross wire for bending. ' +
                '. (MO1输入数据无效, 对图形1M1, 会撞到副筋.)',
            };
          }
        } else {
          if (lMO1 - lItem['A'] < 50) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid MO1 parameter value for 1M1 shape as it will hit cross wire for bending. ' +
                '. (参数A输入数据无效, 对图形1M1, 会撞到副筋.)',
            };
          }
        }
      }
    }

    if (lShape == '2M1' && lColumnName == 'MeshMO1') {
      var lCrossSpacing = lItem['ProdCWSpacing'];
      var lMO1 = lValue;

      if (!isNaN(lItem['A']) && lCrossSpacing > 0) {
        if (lMO1 < parseInt(lItem['A'])) {
          if (
            (parseInt(lItem['A']) - lMO1) % lCrossSpacing < 50 ||
            lCrossSpacing - ((parseInt(lItem['A']) - lMO1) % lCrossSpacing) < 50
          ) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid MO1 parameter value for 2M1 shape as it will hit cross wire. ' +
                '. (MO1输入数据无效, 对图形2M1, 会撞到副筋.)',
            };
          }
        } else {
          if (lMO1 - parseInt(lItem['A']) < 50) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid MO1 parameter value for 2M1 shape as it will hit cross wire. ' +
                '. (MO1输入数据无效, 对图形2M1, 会撞到副筋.)',
            };
          }
        }
      }
    }
    if (lShape == '2M1' && lColumnName == 'MeshMO2') {
      var lCrossSpacing = lItem['ProdCWSpacing'];
      var lMO2 = lValue;

      if (!isNaN(lItem['C']) && lCrossSpacing > 0) {
        if (lMO2 < parseInt(lItem['C'])) {
          if (
            (parseInt(lItem['C']) - lMO2) % lCrossSpacing < 50 ||
            lCrossSpacing - ((parseInt(lItem['C']) - lMO2) % lCrossSpacing) < 50
          ) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid MO2 parameter value for 2M1 shape as it will hit cross wire. ' +
                '. (MO2输入数据无效, 对图形2M1, 会撞到副筋.)',
            };
          }
        } else {
          if (lMO2 - parseInt(lItem['C']) < 50) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid MO2 parameter value for 2M1 shape as it will hit cross wire. ' +
                '. (Mo2输入数据无效, 对图形2M1, 会撞到副筋.)',
            };
          }
        }
      }
    }

    //Cross bending
    if (lShape == '1C1' && lColumnName == 'MeshCO1') {
      var lMainSpacing = lItem['ProdMWSpacing'];
      var lCO1 = lValue;

      if (!isNaN(lItem['A']) && lMainSpacing > 0) {
        if (lCO1 <= parseInt(lItem['A'])) {
          if (
            (parseInt(lItem['A']) - lCO1) % lMainSpacing < 50 ||
            lMainSpacing - ((parseInt(lItem['A']) - lCO1) % lMainSpacing) < 50
          ) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid CO1 parameter value for 1C1 shape as it will hit main wire for bending. ' +
                '. (CO1输入数据无效, 对图形1C1, 会撞到主筋.)',
            };
          }
        } else {
          if (lCO1 - lItem['A'] < 50) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid CO1 parameter value for 1C1 shape as it will hit main wire for bending. ' +
                '. (CO1输入数据无效, 对图形1C1, 会撞到主筋.)',
            };
          }
        }
      }
    }

    if (lShape == '2C1' && lColumnName == 'MeshCO1') {
      var lMainSpacing = lItem['ProdMWSpacing'];
      var lCO1 = lValue;

      if (!isNaN(lItem['A']) && lMainSpacing > 0) {
        if (lCO1 < parseInt(lItem['A'])) {
          if (
            (parseInt(lItem['A']) - lCO1) % lMainSpacing < 50 ||
            lMainSpacing - ((parseInt(lItem['A']) - lCO1) % lMainSpacing) < 50
          ) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid CO1 parameter value for 2C1 shape as it will hit main wire. ' +
                '. (CO1输入数据无效, 对图形2C1, 会撞到主筋.)',
            };
          }
        } else {
          if (lCO1 - parseInt(lItem['A']) < 50) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid CO1 value for 2C1 shape as it will hit main wire. ' +
                '. (CO1输入数据无效, 对图形2C1, 会撞到主筋.)',
            };
          }
        }
      }
    }
    if (lShape == '2C1' && lColumnName == 'MeshCO2') {
      var lMainSpacing = lItem['ProdMWSpacing'];
      var lCO2 = lValue;

      if (!isNaN(lItem['C']) && lMainSpacing > 0) {
        if (lCO2 < parseInt(lItem['C'])) {
          if (
            (parseInt(lItem['C']) - lCO2) % lMainSpacing < 50 ||
            lMainSpacing - ((parseInt(lItem['C']) - lCO2) % lMainSpacing) < 50
          ) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid CO2 value for 2C1 shape as it will hit main wire. ' +
                '. (CO2输入数据无效, 对图形2C1, 会撞到主筋.)',
            };
          }
        } else {
          if (lCO2 - parseInt(lItem['C']) < 50) {
            const activeCellNode =
              this.templateGrid.slickGrid.getActiveCellNode();
            if (activeCellNode) {
              activeCellNode.style.backgroundColor = this.color;
              activeCellNode.classList.add('highlight');

              setTimeout(() => {
                activeCellNode.style.backgroundColor = ''; // Reset to original color or remove if you want to clear the background
                activeCellNode.classList.remove('highlight');
              }, 2000);
            }
            //$(gridCTSMesh.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
            return {
              valid: false,
              msg:
                'Invalid CO2 value for 2C1 shape as it will hit main wire. ' +
                '. (CO2输入数据无效, 对图形2C1, 会撞到主筋.)',
            };
          }
        }
      }
    }

    return { valid: true, msg: null };
  };
  onBPSORDERBeforeEditCell = (e: any, args: any) => {
    // this.getShapeCodes();

    //console.log('Column list', args.grid.getColumns());
    args.grid.getColumns()[6].editor.collection = this.convertedShapeCodeList;

    var lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];
    // args.grid.cell.editable=true;
    if (
      lColumnName == 'MeshShapeCode' &&
      args.grid.getDataItem(args.row) != null
    ) {
      //Change shape list according to the product code
      var lMeshProduct = args.item['MeshProduct'].value?args.item['MeshProduct'].value:args.item['MeshProduct'];
      if (lMeshProduct != '') {
        if (args.item['BBSID'] == 1) {
          if (
            lMeshProduct.substring(0, 2) == 'WF' ||
            lMeshProduct.substring(0, 3) == 'W2F'
          ) {
            args.grid.getColumns()[args.cell].editorOptions.options = ',F';
          } else {
            // this.getShapeCode();
            // args.grid.getColumns()[args.cell].editorOptions.collection =
            //   this.gOthersShapeList;
            //collectionAsync:  this.orderService.getOthersShapeCode_ctsmesh()
          }
        }
      }
    }
    if (lColumnName == 'MeshProduct') {
      // this.gOthersProdCode=[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }, { value: '3', label: 'Option 3' }];
      // var lProdCodeListAR = this.gOthersProdCode.split(',');
      // this.dataset.MeshProduct=this.gOthersProdCode;
    }
  };


  // backToOrderSummary() {
  //   // this.goBack();
  // }

  backToOrder() {
    this.backToOrderSummary(this.ScheduledProd);
  }

  backToOrderSummary(pModuleCod: any) {
    // this.templateGrid.slickGrid.commitCurrentEdit();

    if (this.templateGrid.slickGrid.getActiveCell() != null) {
      var lRowIndex = this.templateGrid.slickGrid.getActiveCell().row;

      this.SaveCTSDetails(this.templateGrid.slickGrid.getDataItem(lRowIndex));
    }
    this.SaveSummary();

    var lCustomerCode = this.CustomerCode;
    var lProjectCode = this.ProjectCode;
    var lScheduledProd = this.ScheduledProd;

    if (lCustomerCode == null) {
      lCustomerCode = "";
    }
    if (lProjectCode == null) {
      lProjectCode = "";
    }
    if (lScheduledProd == null) {
      lScheduledProd = "N";
    }

    lCustomerCode = lCustomerCode.trim();
    lProjectCode = lProjectCode.trim();
    lScheduledProd = lScheduledProd.trim();

    if (lCustomerCode.length == 0) {
      alert("Invalid customer code. Please start with New Order and choose a customer.");
      return false;
    }

    if (lProjectCode.length == 0) {
      alert("Invalid project code. Please start with New Order and choose a project.");
      return false;
    }

    // document.getElementById("pCustomerCode").value = lCustomerCode;
    // document.getElementById("pProjectCode").value = lProjectCode;

    if (lScheduledProd != "Y") {
      // check cts mesh
      for (var k = 0; k < this.dataViewCTS.getLength(); k++) {
        var lProdCode = this.dataViewCTS.getItem(k).MeshProduct.value?this.dataViewCTS.getItem(k).MeshProduct.value:this.dataViewCTS.getItem(k).MeshProduct;
        var lShape = this.dataViewCTS.getItem(k).MeshShapeCode.value?this.dataViewCTS.getItem(k).MeshShapeCode.value:this.dataViewCTS.getItem(k).MeshShapeCode;
        var lQty = this.dataViewCTS.getItem(k).MeshMemberQty;
        if ((lShape == null || lShape.trim() == "") && (lProdCode == null || lProdCode == "" || lProdCode == " ")) {
          continue;
        }

        if (lShape != null && lShape.trim() != "" && (lProdCode == null || lProdCode == "" || lProdCode == " ")) {
          alert("Invalid product code on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检查产品型号, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (lProdCode != null && lProdCode.trim() != "" && (lShape == null || lShape == "" || lShape == " ")) {
          alert("Invalid shape code for " + lProdCode + " on MESH products, Line " + (k + 1) + "\n\n"
            + "请检查图形码, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (lProdCode != null && lProdCode.trim() != "" && (lQty == null || lQty == "" || lQty == 0)) {
          alert("Invalid MESH Qty on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检查件数, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (lShape != null && lShape.trim() != ""
          && (this.dataViewCTS.getItem(k).MeshMainLen == null
            || this.dataViewCTS.getItem(k).MeshMainLen == ""
            || this.dataViewCTS.getItem(k).MeshMainLen == 0
            || this.dataViewCTS.getItem(k).MeshMainLen > 7000)) {
          alert("Invalid Main Wire Length value on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检铁网的主筋长度, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (lShape != null && lShape.trim() != ""
          && (this.dataViewCTS.getItem(k).MeshCrossLen == null
            || this.dataViewCTS.getItem(k).MeshCrossLen == ""
            || this.dataViewCTS.getItem(k).MeshCrossLen == 0
            || this.dataViewCTS.getItem(k).MeshCrossLen > 7000)) {
          alert("Invalid Cross Wire Length value on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检铁网的副筋长度, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        if (lShape != null && lShape.trim() != ""
          && this.dataViewCTS.getItem(k).MeshCrossLen > this.getMeshSLabMaxlength("C", this.dataViewCTS.getItem(k))
          && this.dataViewCTS.getItem(k).MeshMainLen > this.getMeshSLabMaxlength("M", this.dataViewCTS.getItem(k))) {
          alert("Invalid Cross Wire Length value. It should be not more than " + this.getMeshSLabMaxlength("M", this.dataViewCTS.getItem(k)) + " x " + this.getMeshSLabMaxlength("C", this.dataViewCTS.getItem(k)) + " on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检查铁网的副筋长度, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        if (lShape != null && lShape.trim() != ""
          && (this.dataViewCTS.getItem(k).MeshMO1 == null
            || this.dataViewCTS.getItem(k).MeshMO1 == ""
            || this.dataViewCTS.getItem(k).MeshMO1 == 0)) {
          alert("Invalid Main Wire Overhang1 value on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检查铁网的主筋边长1, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (lShape != null && lShape.trim() != ""
          && (this.dataViewCTS.getItem(k).MeshMO2 == null
            || this.dataViewCTS.getItem(k).MeshMO2 == ""
            || this.dataViewCTS.getItem(k).MeshMO2 == 0)) {
          alert("Invalid Main Wire Overhang2 value on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检查铁网的主筋边长2, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (lShape != null && lShape.trim() != ""
          && (this.dataViewCTS.getItem(k).MeshCO1 == null
            || this.dataViewCTS.getItem(k).MeshCO1 == ""
            || this.dataViewCTS.getItem(k).MeshCO1 == 0)) {
          alert("Invalid Cross Wire Overhang1 value on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检查铁网的副筋边长1, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (lShape != null && lShape.trim() != ""
          && (this.dataViewCTS.getItem(k).MeshCO2 == null
            || this.dataViewCTS.getItem(k).MeshCO2 == ""
            || this.dataViewCTS.getItem(k).MeshCO2 == 0)) {
          alert("Invalid Cross Wire Overhang2 value on MESH products, Line No. " + (k + 1) + "\n\n"
            + "请检查铁网的副筋边长2, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        //check MO/CO/Single wire
        if (this.dataViewCTS.getItem(k)["MeshMainLen"] - this.dataViewCTS.getItem(k)["MeshMO1"] - this.dataViewCTS.getItem(k)["MeshMO2"] < this.dataViewCTS.getItem(k)["ProdCWSpacing"]) {
          alert("Please check main wire length, MO1 or MO2 as only one cross wire left on MESH products, Line No. " + (k + 1) + "\n\n"
            + "主边太长, 只剩一根副筋, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        //check MO/CO/Single wire
        if (this.dataViewCTS.getItem(k)["MeshCrossLen"] - this.dataViewCTS.getItem(k)["MeshCO1"] - this.dataViewCTS.getItem(k)["MeshCO2"] < this.dataViewCTS.getItem(k)["ProdMWSpacing"]) {
          alert("Please check corss wire length, MO1 or MO2 as only one main wire left on MESH products, Line No. " + (k + 1) + "\n\n"
            + "副边太长, 只剩一根主筋, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        if (this.dataViewCTS.getItem(k)["MeshMO1"] > 1200 && this.dataViewCTS.getItem(k)["MeshMO2"] > 1200) {
          alert("Both main wire onverhang cannot be greater than 1200 on MESH products, line No. " + (k + 1) + "\n\n"
            + "(两个主边长不可同时大于1200, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (this.dataViewCTS.getItem(k)["MeshMO1"] > 1800 || this.dataViewCTS.getItem(k)["MeshMO2"] > 1800) {
          alert("Main wire onverhang cannot be greater than 1800 on MESH products, line No. " + (k + 1) + "\n\n"
            + "(主边长不可大于1800, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (this.dataViewCTS.getItem(k)["MeshMO1"] < 20 || this.dataViewCTS.getItem(k)["MeshMO2"] < 20) {
          alert("Main wire onverhang cannot be less than 20 on MESH products, line No. " + (k + 1) + "\n\n"
            + "(主边长不可小于50, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        if ((this.dataViewCTS.getItem(k).MeshMainLen - this.dataViewCTS.getItem(k).MeshMO2 - this.dataViewCTS.getItem(k).MeshMO1) % this.dataViewCTS.getItem(k).ProdCWSpacing != 0) {
          alert("Invalid main wire overhang value on MESH products, line No. " + (k + 1) + "\n\n"
            + "(输入无效的主筋边, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        if (this.dataViewCTS.getItem(k)["MeshCO1"] > 1000 || this.dataViewCTS.getItem(k)["MeshCO2"] > 1000) {
          alert("Cross wire onverhang cannot be greater than 1000 on MESH products, line No. " + (k + 1) + "\n\n"
            + "(副筋边长最长不可大于1000, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }
        if (this.dataViewCTS.getItem(k)["MeshCO1"] < 20 || this.dataViewCTS.getItem(k)["MeshCO2"] < 20) {
          alert("Cross wire onverhang cannot be less than 50 on MESH products, line No. " + (k + 1) + "\n\n"
            + "(副筋边长最短不可小于20, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        if ((this.dataViewCTS.getItem(k).MeshCrossLen - this.dataViewCTS.getItem(k).MeshCO2 - this.dataViewCTS.getItem(k).MeshCO1) % this.dataViewCTS.getItem(k).ProdMWSpacing != 0) {
          alert("Invalid cross wire overhang value on MESH products, line No. " + (k + 1) + "\n\n"
            + "(输入无效的副筋边, 位于铁网的, 行号 " + (k + 1) + ".");
          return false;
        }

        var lParameters = this.dataViewCTS.getItem(k).MeshEditParameters;
        if (lShape != null && lShape.trim() != "" && lParameters != null && lParameters != "") {
          var lParaA = lParameters.split(",");
          for (let m = 0; m < lParaA.length; m++) {
            if (this.dataViewCTS.getItem(k)[lParaA[m]] == null
              || this.dataViewCTS.getItem(k)[lParaA[m]] == ""
              || this.dataViewCTS.getItem(k)[lParaA[m]] == " ") {
              alert("Invalid shape parameter found for shape code " + lShape + " parameter " + lParaA[m] + " on MESH products, line No. " + (k + 1) + "\n\n"
                + "请检查图形码" + lShape + ", 参数" + lParaA[k] + "的数值, 位于铁网的, 行号 " + (k + 1) + ".");
              return false;
            }
            if (this.dataViewCTS.getItem(k)[lParaA[m]] <= 0) {
              alert("Invalid shape parameter found for shape code " + lShape + " parameter " + lParaA[k] + " on MESH products, Line No " + (k + 1) + "\n\n"
                + "请检查图形码" + lShape + ", 参数" + lParaA[k] + "的数值, 位于铁网的, 行号 " + (k + 1) + ".");
              return false;
            }

          }
        }
        if (lShape != null && lShape.trim() != "" && lParameters != null && lParameters != "") {
          var lParaA = lParameters.split(",");
          var lParaTypeA = this.dataViewCTS.getItem(k).MeshShapeParamTypes.split(",");
          var lWireTypeA = this.dataViewCTS.getItem(k).MeshShapeWireTypes.split(",");
          var lTotalMainLen = 0;
          var lTotalCrossLen = 0;
          for (let m = 0; m < lParaA.length; m++) {
            if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "M") {
              if (this.dataViewCTS.getItem(k)[lParaA[m]] != null) {
                if (this.dataViewCTS.getItem(k)[lParaA[m]] > 0) {
                  lTotalMainLen = lTotalMainLen + parseInt(this.dataViewCTS.getItem(k)[lParaA[m]]);
                }
              }
            }

            if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "C") {
              if (this.dataViewCTS.getItem(k)[lParaA[m]] != null) {
                if (this.dataViewCTS.getItem(k)[lParaA[m]] > 0) {
                  lTotalCrossLen = lTotalCrossLen + parseInt(this.dataViewCTS.getItem(k)[lParaA[m]]);
                }
              }
            }
          }
          if (lTotalMainLen > 0 && lTotalMainLen != this.dataViewCTS.getItem(k).MeshMainLen) {
            alert("Invalid shape parameter found for shape code " + lShape + ". The total values of main wire bending parameters is not equal to main wire length on MESH products, line no " + (k + 1) + "\n\n"
              + "请检查图形码" + lShape + ", 主筋的参数总值不等于主筋的长度, 位于铁网的, 行号 " + (k + 1) + ".");
            return false;
          }
          if (lTotalCrossLen > 0 && lTotalCrossLen != this.dataViewCTS.getItem(k).MeshCrossLen) {
            alert("Invalid shape parameter found for shape code " + lShape + ". The total values of cross wire bending parameters is not equal to cross wire length on MESH products, line no " + (k + 1) + "\n\n"
              + "请检查图形码" + lShape + ", 副筋的参数总值不等于副筋的长度, 位于铁网的 , 行号 " + (k + 1) + ".");
            return false;
          }

          //bending check
          //disable the checking on 2018-01-12 - requested AO
          //var lTotalMainLen = 0;
          //var lTotalCrossLen = 0;
          //var lBendLimit = 50;
          //var lCrossSpace = dataViewCTS.getItem(k)["ProdCWSpacing"];
          //var lMainSpace = dataViewCTS.getItem(k)["ProdMWSpacing"];
          //if (dataViewCTS.getItem(k)["MeshCreepMO1"] == null || dataViewCTS.getItem(k)["MeshCreepMO1"] == false) {
          //    for (m = 0; m < lParaA.length; m++) {
          //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "M") {
          //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
          //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
          //                    lTotalMainLen = lTotalMainLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
          //                    if (lTotalMainLen > (dataViewCTS.getItem(k)["MeshMO1"] - lBendLimit) && lTotalMainLen < (dataViewCTS.getItem(k)["MeshMainLen"] - dataViewCTS.getItem(k)["MeshMO2"] + lBendLimit)) {
          //                        if ((lTotalMainLen - dataViewCTS.getItem(k)["MeshMO1"]) % lCrossSpace < lBendLimit) {
          //                            alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                            return false;
          //                        } else {
          //                            if ((lCrossSpace - (lTotalMainLen - dataViewCTS.getItem(k)["MeshMO1"]) % lCrossSpace) < lBendLimit) {
          //                                alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                    + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                                return false;
          //                            }
          //                        }
          //                    }
          //                }
          //            }
          //        }
          //    }
          //} else {
          //    for (m = 0; m < lParaA.length; m++) {
          //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "M") {
          //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
          //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
          //                    lTotalMainLen = lTotalMainLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
          //                    if (lTotalMainLen > (dataViewCTS.getItem(k)["MeshMO2"] - lBendLimit) && lTotalMainLen < (dataViewCTS.getItem(k)["MeshMainLen"] - dataViewCTS.getItem(k)["MeshMO1"] + lBendLimit)) {
          //                        if ((lTotalMainLen - dataViewCTS.getItem(k)["MeshMO2"]) % lCrossSpace < lBendLimit) {
          //                            alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                            return false;
          //                        } else {
          //                            if ((lCrossSpace - (lTotalMainLen - dataViewCTS.getItem(k)["MeshMO2"]) % lCrossSpace) < lBendLimit) {
          //                                alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                    + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                                return false;
          //                            }
          //                        }
          //                    }
          //                }
          //            }
          //        }
          //    }
          //}
          //if (dataViewCTS.getItem(k)["MeshCreepCO1"] == null || dataViewCTS.getItem(k)["MeshCreepCO1"] == false) {
          //    for (m = 0; m < lParaA.length; m++) {
          //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "C") {
          //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
          //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
          //                    lTotalCrossLen = lTotalCrossLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
          //                    if (lTotalCrossLen > (dataViewCTS.getItem(k)["MeshCO1"] - lBendLimit) && lTotalCrossLen < (dataViewCTS.getItem(k)["MeshCrossLen"] - dataViewCTS.getItem(k)["MeshCO2"] + lBendLimit)) {
          //                        if ((lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO1"]) % lMainSpace < lBendLimit) {
          //                            alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                            return false;
          //                        } else {
          //                            if ((lMainSpace - (lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO1"]) % lMainSpace) < lBendLimit) {
          //                                alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                    + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                                return false;
          //                            }
          //                        }
          //                    }
          //                }
          //            }
          //        }
          //    }
          //} else {
          //    for (m = 0; m < lParaA.length; m++) {
          //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "C") {
          //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
          //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
          //                    lTotalCrossLen = lTotalCrossLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
          //                    if (lTotalCrossLen > (dataViewCTS.getItem(k)["MeshCO2"] - lBendLimit) && lTotalCrossLen < (dataViewCTS.getItem(k)["MeshCrossLen"] - dataViewCTS.getItem(k)["MeshCO1"] + lBendLimit)) {
          //                        if ((lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO2"]) % lMainSpace < lBendLimit) {
          //                            alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                            return false;
          //                        } else {
          //                            if ((lMainSpace - (lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO2"]) % lMainSpace) < lBendLimit) {
          //                                alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
          //                                    + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
          //                                return false;
          //                            }
          //                        }
          //                    }
          //                }
          //            }
          //        }
          //    }
          //}
          //end of ending check
        }
      }
    }

    if (pModuleCod == "E") {
      setTimeout(() => {
        this.backToComponentListRun();
      }, 500);
    }
    else if (pModuleCod == "S") {
      window.close();
    }
    else {
      setTimeout(() => {
        this.backToOrderSummaryRun();
      }, 500);
    }
    return;
  }




  // async backToOrderSummary() {
  //   // Slick.GlobalEditorLock.commitCurrentEdit();
  //   let pModuleCode = this.ScheduledProd;
  //   if (this.templateGrid.slickGrid.getActiveCell() != null) {
  //     var lRowIndex = this.templateGrid.slickGrid.getActiveCell().row;

  //     await this.SaveCTSDetails(this.templateGrid.slickGrid.getDataItem(lRowIndex));
  //   }
  //   this.SaveSummary();

  //   var lCustomerCode = this.CustomerCode;
  //   var lProjectCode = this.ProjectCode;
  //   var lScheduledProd = this.ScheduledProd;

  //   if (lCustomerCode == null) {
  //     lCustomerCode = '';
  //   }
  //   if (lProjectCode == null) {
  //     lProjectCode = '';
  //   }
  //   if (lScheduledProd == null) {
  //     lScheduledProd = 'N';
  //   }

  //   lCustomerCode = lCustomerCode.trim();
  //   lProjectCode = lProjectCode.trim();
  //   lScheduledProd = lScheduledProd.trim();

  //   if (lCustomerCode.length == 0) {
  //     alert(
  //       'Invalid customer code. Please start with New Order and choose a customer.'
  //     );
  //     return false;
  //   }

  //   if (lProjectCode.length == 0) {
  //     alert(
  //       'Invalid project code. Please start with New Order and choose a project.'
  //     );
  //     return false;
  //   }

  //   this.CustomerCode = lCustomerCode;
  //   this.ProjectCode = lProjectCode;

  //   if (lScheduledProd != 'Y') {
  //     // check cts mesh
  //     for (let k = 0; k < this.dataViewCTS.getLength(); k++) {
  //       var lProdCode = this.dataViewCTS.getItem(k).MeshProduct;
  //       var lShape = this.dataViewCTS.getItem(k).MeshShapeCode;
  //       var lQty = this.dataViewCTS.getItem(k).MeshMemberQty;
  //       if (
  //         (lShape == null || lShape.trim() == '') &&
  //         (lProdCode == null || lProdCode == '' || lProdCode == ' ')
  //       ) {
  //         continue;
  //       }

  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         (lProdCode == null || lProdCode == '' || lProdCode == ' ')
  //       ) {
  //         alert(
  //           'Invalid product code on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查产品型号, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         lProdCode != null &&
  //         lProdCode.trim() != '' &&
  //         (lShape == null || lShape == '' || lShape == ' ')
  //       ) {
  //         alert(
  //           'Invalid shape code for ' +
  //             lProdCode +
  //             ' on MESH products, Line ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查图形码, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         lProdCode != null &&
  //         lProdCode.trim() != '' &&
  //         (lQty == null || lQty == '' || lQty == 0)
  //       ) {
  //         alert(
  //           'Invalid MESH Qty on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查件数, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         (this.dataViewCTS.getItem(k).MeshMainLen == null ||
  //           this.dataViewCTS.getItem(k).MeshMainLen == '' ||
  //           this.dataViewCTS.getItem(k).MeshMainLen == 0 ||
  //           this.dataViewCTS.getItem(k).MeshMainLen > 7000)
  //       ) {
  //         alert(
  //           'Invalid Main Wire Length value on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检铁网的主筋长度, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         (this.dataViewCTS.getItem(k).MeshCrossLen == null ||
  //           this.dataViewCTS.getItem(k).MeshCrossLen == '' ||
  //           this.dataViewCTS.getItem(k).MeshCrossLen == 0 ||
  //           this.dataViewCTS.getItem(k).MeshCrossLen > 7000)
  //       ) {
  //         alert(
  //           'Invalid Cross Wire Length value on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检铁网的副筋长度, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         this.dataViewCTS.getItem(k).MeshCrossLen >
  //           this.getMeshSLabMaxlength('C', this.dataViewCTS.getItem(k)) &&
  //         this.dataViewCTS.getItem(k).MeshMainLen >
  //           this.getMeshSLabMaxlength('M', this.dataViewCTS.getItem(k))
  //       ) {
  //         alert(
  //           'Invalid Cross Wire Length value. It should be not more than ' +
  //             this.getMeshSLabMaxlength('M', this.dataViewCTS.getItem(k)) +
  //             ' x ' +
  //             this.getMeshSLabMaxlength('C', this.dataViewCTS.getItem(k)) +
  //             ' on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查铁网的副筋长度, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         (this.dataViewCTS.getItem(k).MeshMO1 == null ||
  //           this.dataViewCTS.getItem(k).MeshMO1 == '' ||
  //           this.dataViewCTS.getItem(k).MeshMO1 == 0)
  //       ) {
  //         alert(
  //           'Invalid Main Wire Overhang1 value on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查铁网的主筋边长1, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         (this.dataViewCTS.getItem(k).MeshMO2 == null ||
  //           this.dataViewCTS.getItem(k).MeshMO2 == '' ||
  //           this.dataViewCTS.getItem(k).MeshMO2 == 0)
  //       ) {
  //         alert(
  //           'Invalid Main Wire Overhang2 value on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查铁网的主筋边长2, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         (this.dataViewCTS.getItem(k).MeshCO1 == null ||
  //           this.dataViewCTS.getItem(k).MeshCO1 == '' ||
  //           this.dataViewCTS.getItem(k).MeshCO1 == 0)
  //       ) {
  //         alert(
  //           'Invalid Cross Wire Overhang1 value on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查铁网的副筋边长1, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         (this.dataViewCTS.getItem(k).MeshCO2 == null ||
  //           this.dataViewCTS.getItem(k).MeshCO2 == '' ||
  //           this.dataViewCTS.getItem(k).MeshCO2 == 0)
  //       ) {
  //         alert(
  //           'Invalid Cross Wire Overhang2 value on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '请检查铁网的副筋边长2, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       //check MO/CO/Single wire
  //       if (
  //         this.dataViewCTS.getItem(k)['MeshMainLen'] -
  //           this.dataViewCTS.getItem(k)['MeshMO1'] -
  //           this.dataViewCTS.getItem(k)['MeshMO2'] <
  //         this.dataViewCTS.getItem(k)['ProdCWSpacing']
  //       ) {
  //         alert(
  //           'Please check main wire length, MO1 or MO2 as only one cross wire left on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '主边太长, 只剩一根副筋, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       //check MO/CO/Single wire
  //       if (
  //         this.dataViewCTS.getItem(k)['MeshCrossLen'] -
  //           this.dataViewCTS.getItem(k)['MeshCO1'] -
  //           this.dataViewCTS.getItem(k)['MeshCO2'] <
  //         this.dataViewCTS.getItem(k)['ProdMWSpacing']
  //       ) {
  //         alert(
  //           'Please check corss wire length, MO1 or MO2 as only one main wire left on MESH products, Line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '副边太长, 只剩一根主筋, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       if (
  //         this.dataViewCTS.getItem(k)['MeshMO1'] > 1200 &&
  //         this.dataViewCTS.getItem(k)['MeshMO2'] > 1200
  //       ) {
  //         alert(
  //           'Both main wire onverhang cannot be greater than 1200 on MESH products, line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '(两个主边长不可同时大于1200, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         this.dataViewCTS.getItem(k)['MeshMO1'] > 1800 ||
  //         this.dataViewCTS.getItem(k)['MeshMO2'] > 1800
  //       ) {
  //         alert(
  //           'Main wire onverhang cannot be greater than 1800 on MESH products, line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '(主边长不可大于1800, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         this.dataViewCTS.getItem(k)['MeshMO1'] < 20 ||
  //         this.dataViewCTS.getItem(k)['MeshMO2'] < 20
  //       ) {
  //         alert(
  //           'Main wire onverhang cannot be less than 20 on MESH products, line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '(主边长不可小于50, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       if (
  //         (this.dataViewCTS.getItem(k).MeshMainLen -
  //           this.dataViewCTS.getItem(k).MeshMO2 -
  //           this.dataViewCTS.getItem(k).MeshMO1) %
  //           this.dataViewCTS.getItem(k).ProdCWSpacing !=
  //         0
  //       ) {
  //         alert(
  //           'Invalid main wire overhang value on MESH products, line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '(输入无效的主筋边, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       if (
  //         this.dataViewCTS.getItem(k)['MeshCO1'] > 1000 ||
  //         this.dataViewCTS.getItem(k)['MeshCO2'] > 1000
  //       ) {
  //         alert(
  //           'Cross wire onverhang cannot be greater than 1000 on MESH products, line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '(副筋边长最长不可大于1000, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }
  //       if (
  //         this.dataViewCTS.getItem(k)['MeshCO1'] < 20 ||
  //         this.dataViewCTS.getItem(k)['MeshCO2'] < 20
  //       ) {
  //         alert(
  //           'Cross wire onverhang cannot be less than 50 on MESH products, line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '(副筋边长最短不可小于20, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       if (
  //         (this.dataViewCTS.getItem(k).MeshCrossLen -
  //           this.dataViewCTS.getItem(k).MeshCO2 -
  //           this.dataViewCTS.getItem(k).MeshCO1) %
  //           this.dataViewCTS.getItem(k).ProdMWSpacing !=
  //         0
  //       ) {
  //         alert(
  //           'Invalid cross wire overhang value on MESH products, line No. ' +
  //             (k + 1) +
  //             '\n\n' +
  //             '(输入无效的副筋边, 位于铁网的, 行号 ' +
  //             (k + 1) +
  //             '.'
  //         );
  //         return false;
  //       }

  //       var lParameters = this.dataViewCTS.getItem(k).MeshEditParameters;
  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         lParameters != null &&
  //         lParameters != ''
  //       ) {
  //         var lParaA = lParameters.split(',');
  //         for (let m = 0; m < lParaA.length; m++) {
  //           if (
  //             this.dataViewCTS.getItem(k)[lParaA[m]] == null ||
  //             this.dataViewCTS.getItem(k)[lParaA[m]] == '' ||
  //             this.dataViewCTS.getItem(k)[lParaA[m]] == ' '
  //           ) {
  //             alert(
  //               'Invalid shape parameter found for shape code ' +
  //                 lShape +
  //                 ' parameter ' +
  //                 lParaA[m] +
  //                 ' on MESH products, line No. ' +
  //                 (k + 1) +
  //                 '\n\n' +
  //                 '请检查图形码' +
  //                 lShape +
  //                 ', 参数' +
  //                 lParaA[k] +
  //                 '的数值, 位于铁网的, 行号 ' +
  //                 (k + 1) +
  //                 '.'
  //             );
  //             return false;
  //           }
  //           if (this.dataViewCTS.getItem(k)[lParaA[m]] <= 0) {
  //             alert(
  //               'Invalid shape parameter found for shape code ' +
  //                 lShape +
  //                 ' parameter ' +
  //                 lParaA[k] +
  //                 ' on MESH products, Line No ' +
  //                 (k + 1) +
  //                 '\n\n' +
  //                 '请检查图形码' +
  //                 lShape +
  //                 ', 参数' +
  //                 lParaA[k] +
  //                 '的数值, 位于铁网的, 行号 ' +
  //                 (k + 1) +
  //                 '.'
  //             );
  //             return false;
  //           }
  //         }
  //       }
  //       if (
  //         lShape != null &&
  //         lShape.trim() != '' &&
  //         lParameters != null &&
  //         lParameters != ''
  //       ) {
  //         var lParaA = lParameters.split(',');
  //         var lParaTypeA = this.dataViewCTS
  //           .getItem(k)
  //           .MeshShapeParamTypes.split(',');
  //         var lWireTypeA = this.dataViewCTS
  //           .getItem(k)
  //           .MeshShapeWireTypes.split(',');
  //         var lTotalMainLen = 0;
  //         var lTotalCrossLen = 0;
  //         for (let m = 0; m < lParaA.length; m++) {
  //           if (
  //             (lParaTypeA[m] == 'S' || lParaTypeA[m] == 'HK') &&
  //             lWireTypeA[m] == 'M'
  //           ) {
  //             if (this.dataViewCTS.getItem(k)[lParaA[m]] != null) {
  //               if (this.dataViewCTS.getItem(k)[lParaA[m]] > 0) {
  //                 lTotalMainLen =
  //                   lTotalMainLen +
  //                   parseInt(this.dataViewCTS.getItem(k)[lParaA[m]]);
  //               }
  //             }
  //           }

  //           if (
  //             (lParaTypeA[m] == 'S' || lParaTypeA[m] == 'HK') &&
  //             lWireTypeA[m] == 'C'
  //           ) {
  //             if (this.dataViewCTS.getItem(k)[lParaA[m]] != null) {
  //               if (this.dataViewCTS.getItem(k)[lParaA[m]] > 0) {
  //                 lTotalCrossLen =
  //                   lTotalCrossLen +
  //                   parseInt(this.dataViewCTS.getItem(k)[lParaA[m]]);
  //               }
  //             }
  //           }
  //         }
  //         if (
  //           lTotalMainLen > 0 &&
  //           lTotalMainLen != this.dataViewCTS.getItem(k).MeshMainLen
  //         ) {
  //           alert(
  //             'Invalid shape parameter found for shape code ' +
  //               lShape +
  //               '. The total values of main wire bending parameters is not equal to main wire length on MESH products, line no ' +
  //               (k + 1) +
  //               '\n\n' +
  //               '请检查图形码' +
  //               lShape +
  //               ', 主筋的参数总值不等于主筋的长度, 位于铁网的, 行号 ' +
  //               (k + 1) +
  //               '.'
  //           );
  //           return false;
  //         }
  //         if (
  //           lTotalCrossLen > 0 &&
  //           lTotalCrossLen != this.dataViewCTS.getItem(k).MeshCrossLen
  //         ) {
  //           alert(
  //             'Invalid shape parameter found for shape code ' +
  //               lShape +
  //               '. The total values of cross wire bending parameters is not equal to cross wire length on MESH products, line no ' +
  //               (k + 1) +
  //               '\n\n' +
  //               '请检查图形码' +
  //               lShape +
  //               ', 副筋的参数总值不等于副筋的长度, 位于铁网的 , 行号 ' +
  //               (k + 1) +
  //               '.'
  //           );
  //           return false;
  //         }

  //         //bending check
  //         //disable the checking on 2018-01-12 - requested AO
  //         //var lTotalMainLen = 0;
  //         //var lTotalCrossLen = 0;
  //         //var lBendLimit = 50;
  //         //var lCrossSpace = dataViewCTS.getItem(k)["ProdCWSpacing"];
  //         //var lMainSpace = dataViewCTS.getItem(k)["ProdMWSpacing"];
  //         //if (dataViewCTS.getItem(k)["MeshCreepMO1"] == null || dataViewCTS.getItem(k)["MeshCreepMO1"] == false) {
  //         //    for (m = 0; m < lParaA.length; m++) {
  //         //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "M") {
  //         //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
  //         //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
  //         //                    lTotalMainLen = lTotalMainLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
  //         //                    if (lTotalMainLen > (dataViewCTS.getItem(k)["MeshMO1"] - lBendLimit) && lTotalMainLen < (dataViewCTS.getItem(k)["MeshMainLen"] - dataViewCTS.getItem(k)["MeshMO2"] + lBendLimit)) {
  //         //                        if ((lTotalMainLen - dataViewCTS.getItem(k)["MeshMO1"]) % lCrossSpace < lBendLimit) {
  //         //                            alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                            return false;
  //         //                        } else {
  //         //                            if ((lCrossSpace - (lTotalMainLen - dataViewCTS.getItem(k)["MeshMO1"]) % lCrossSpace) < lBendLimit) {
  //         //                                alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                    + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                                return false;
  //         //                            }
  //         //                        }
  //         //                    }
  //         //                }
  //         //            }
  //         //        }
  //         //    }
  //         //} else {
  //         //    for (m = 0; m < lParaA.length; m++) {
  //         //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "M") {
  //         //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
  //         //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
  //         //                    lTotalMainLen = lTotalMainLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
  //         //                    if (lTotalMainLen > (dataViewCTS.getItem(k)["MeshMO2"] - lBendLimit) && lTotalMainLen < (dataViewCTS.getItem(k)["MeshMainLen"] - dataViewCTS.getItem(k)["MeshMO1"] + lBendLimit)) {
  //         //                        if ((lTotalMainLen - dataViewCTS.getItem(k)["MeshMO2"]) % lCrossSpace < lBendLimit) {
  //         //                            alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                            return false;
  //         //                        } else {
  //         //                            if ((lCrossSpace - (lTotalMainLen - dataViewCTS.getItem(k)["MeshMO2"]) % lCrossSpace) < lBendLimit) {
  //         //                                alert("Bending check fails. Hit cross wire. Please adjust main wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                    + "在主筋的弯曲处将会撞到副筋, 请调整主筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                                return false;
  //         //                            }
  //         //                        }
  //         //                    }
  //         //                }
  //         //            }
  //         //        }
  //         //    }
  //         //}
  //         //if (dataViewCTS.getItem(k)["MeshCreepCO1"] == null || dataViewCTS.getItem(k)["MeshCreepCO1"] == false) {
  //         //    for (m = 0; m < lParaA.length; m++) {
  //         //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "C") {
  //         //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
  //         //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
  //         //                    lTotalCrossLen = lTotalCrossLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
  //         //                    if (lTotalCrossLen > (dataViewCTS.getItem(k)["MeshCO1"] - lBendLimit) && lTotalCrossLen < (dataViewCTS.getItem(k)["MeshCrossLen"] - dataViewCTS.getItem(k)["MeshCO2"] + lBendLimit)) {
  //         //                        if ((lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO1"]) % lMainSpace < lBendLimit) {
  //         //                            alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                            return false;
  //         //                        } else {
  //         //                            if ((lMainSpace - (lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO1"]) % lMainSpace) < lBendLimit) {
  //         //                                alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                    + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                                return false;
  //         //                            }
  //         //                        }
  //         //                    }
  //         //                }
  //         //            }
  //         //        }
  //         //    }
  //         //} else {
  //         //    for (m = 0; m < lParaA.length; m++) {
  //         //        if ((lParaTypeA[m] == "S" || lParaTypeA[m] == "HK") && lWireTypeA[m] == "C") {
  //         //            if (dataViewCTS.getItem(k)[lParaA[m]] != null) {
  //         //                if (dataViewCTS.getItem(k)[lParaA[m]] > 0) {
  //         //                    lTotalCrossLen = lTotalCrossLen + parseInt(dataViewCTS.getItem(k)[lParaA[m]]);
  //         //                    if (lTotalCrossLen > (dataViewCTS.getItem(k)["MeshCO2"] - lBendLimit) && lTotalCrossLen < (dataViewCTS.getItem(k)["MeshCrossLen"] - dataViewCTS.getItem(k)["MeshCO1"] + lBendLimit)) {
  //         //                        if ((lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO2"]) % lMainSpace < lBendLimit) {
  //         //                            alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                            return false;
  //         //                        } else {
  //         //                            if ((lMainSpace - (lTotalCrossLen - dataViewCTS.getItem(k)["MeshCO2"]) % lMainSpace) < lBendLimit) {
  //         //                                alert("Bending check fails. Hit main wire. Please adjust cross wire on MESH products, line no " + (k + 1) + "\n\n"
  //         //                                    + "在副筋的弯曲处将会撞到主筋, 请调整副筋边长, 位于铁网的, 行号 " + (k + 1) + ".");
  //         //                                return false;
  //         //                            }
  //         //                        }
  //         //                    }
  //         //                }
  //         //            }
  //         //        }
  //         //    }
  //         //}
  //         //end of ending check
  //       }
  //     }
  //   }

  //   if (pModuleCode == 'E') {
  //     // setTimeout(backToComponentListRun, 500);
  //   } else if (pModuleCode == 'S') {

  //     window.close();
  //   } else {
  //     // setTimeout(this.backToOrderSummaryRun(), 500);
  //   }
  //   this.goBack();
  //   return;
  // }

  backToOrderSummaryRun() {
    // var lForm = document.getElementById('layout_submit') || null;
    debugger;
    if (this.RoutedFromProcess) {
      this.router.navigate(['/order/createorder'])
      //  this.router.navigate(['/order/OrderDetails'])
    } else {
      this.router.navigate(['/order/createorder'])
    }
    // if (lForm) {
    //   if (!this.RoutedFromProcess) {
    //     const link = this.renderer.createElement('a');
    //     this.renderer.setAttribute(link, 'href', '/order/createorder');
    //     // this.renderer.setAttribute(link, 'target', '');
    //     link.click();
    //     // // this.location.back();
    //     // this.router.navigate(['/order/createorder']);
    //   } else {
    //     const link = this.renderer.createElement('a');
    //     this.renderer.setAttribute(link, 'href', '/order/createorder');
    //     // this.renderer.setAttribute(link, 'target', '');
    //     link.click();
    //     // this.router.navigate(['/order/createorder']);
    //     //[rout
    // }
    // this.goBack();
    // startLoading();
    // lForm.action = "/NewOrder/OrderSummary";
    // lForm.submit();
    // }
  }

  backToComponentListRun() {
    var lCustomerCode = this.CustomerCode;
    var lProjectCode = this.ProjectCode;
    var lStructueEle = '@ViewBag.StructureElement';
    var lProdType = '@ViewBag.ProductType';

    this.CustomerCode = lCustomerCode;
    this.ProjectCode = lProjectCode;
    // document.getElementById("rProductType").value = lProdType;
    // document.getElementById("rStructureElement").value = lStructueEle;

    var lForm = document.getElementById('report_submit') || null;

    if (lForm) {
      if (this.RoutedFromProcess) {
        this.router.navigate(['/order/createorder'])
        //  this.router.navigate(['/order/OrderDetails'])
      } else {
        this.router.navigate(['/order/createorder'])
      }
      // const link = this.renderer.createElement('a');
      // this.renderer.setAttribute(link, 'href', '/order/createorder');
      // // this.renderer.setAttribute(link, 'target', '');
      // link.click();
      // this.router.navigate(['../order/createorder']);
      //   if (!this.RoutedFromProcess) {
      //     this.location.back();
      //   } else {
      //     this.router.navigate(['../order/createorder']);
      //     //[rout
      // }
      // startLoading();
      // lForm.action = "/ComponentList/Index";
      // lForm.submit();
    }
  }
  lTable: any;

  // showProductListAction() {
  //   //   var lBBS = $($("#tabs li")[pGridIndex - 1]).text();
  //   var lNatSteel = 0;
  //   var lCategory = 'OTHERS';
  //   let response: string | any[] = [];
  //   ////if (lBBS.indexOf("NatSteel") >= 0) {
  //   ////    lNatSteel = 1;
  //   ////}
  //   ////if (lBBS.indexOf("Beam") >= 0) {
  //   ////    lCategory = "BEAM";
  //   ////} else if (lBBS.indexOf("Column") >= 0) {
  //   ////    lCategory = "COLUMN";
  //   ////} else {
  //   ////    lCategory = "OTHERS";
  //   ////}
  //   if (lCategory.length > 0) {
  //     if (response.length > 0) {
  //       var lColNum = 8;
  //       var lTitleText = 'Cut-To-Size MESH Products List(铁网产品列表)';

  //       var lStyle = '<div>';
  //       lStyle =
  //         lStyle +
  //         "<table border='1' style='width:100%' id='table_productlist'>";
  //       lStyle = lStyle + '<tr>';
  //       lStyle =
  //         lStyle +
  //         "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>S/N<br>序号</td>";
  //       lStyle =
  //         lStyle +
  //         "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Product Code<br>产品代码</td>";
  //       if (lCategory == 'BEAM' || lCategory == 'COLUMN') {
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Diameter<br>直径</td>";
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Spacing<br>间距</td>";
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Carrier Wire Diameter<br>链接筋直径</td>";
  //       } else {
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Product Type<br>产品类型</td>";
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Main Wire Diameter<br>主筋直径</td>";
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Main Wire Spacing<br>主筋间距</td>";
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Cross Wire Diameter<br>副筋直径</td>";
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>Cross Wire Spacing<br>副筋间距</td>";
  //       }
  //       lStyle =
  //         lStyle +
  //         "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; margin-top: 6px; margin-bottom: 6px'>kg/m<sup>2</sup><br>每平方米公斤</td>";
  //       lStyle = lStyle + '</tr>';
  //       var rows = Math.ceil(response.length);

  //       for (let i = 0; i < rows; i++) {
  //         lStyle = lStyle + "<tr onclick='ProductListClick(this);'>";
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //           (i + 1) +
  //           '</td>';
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //           response[i].ProductCode +
  //           '</td>';
  //         if (lCategory != 'BEAM' && lCategory != 'COLUMN') {
  //           if (response[i].ProductCode.substring(0, 2) == 'WH') {
  //             lStyle =
  //               lStyle +
  //               "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>Class B</td>";
  //           } else {
  //             lStyle =
  //               lStyle +
  //               "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>Class A</td>";
  //           }
  //         }
  //         if (response[i].ProdTwinInd == 'M') {
  //           lStyle =
  //             lStyle +
  //             "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //             response[i].ProdMWDia +
  //             '(Twin)</td>';
  //         } else {
  //           lStyle =
  //             lStyle +
  //             "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //             response[i].ProdMWDia +
  //             '</td>';
  //         }
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //           response[i].ProdMWSpacing +
  //           '</td>';
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //           response[i].ProdCWDia +
  //           '</td>';
  //         if (lCategory != 'BEAM' && lCategory != 'COLUMN') {
  //           lStyle =
  //             lStyle +
  //             "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //             response[i].ProdCWSpacing +
  //             '</td>';
  //         }
  //         lStyle =
  //           lStyle +
  //           "<td align='center' style='font: 12px Helvetica, Arial, sans-serif; cellspacing: 6px; cursor: pointer'>" +
  //           response[i].ProdMass.toFixed(3) +
  //           '</td>';
  //         lStyle = lStyle + '</tr>';
  //       }
  //       lStyle = lStyle + '</table>';
  //       lStyle = lStyle + '</div>';

  //       var $dialog = $(lStyle).dialog({
  //         title: lTitleText,
  //         modal: true, //dims screen to bring dialog to the front
  //         close: function () {
  //           // document.getElementById("table_productlist").parentNode.removeChild(document.getElementById("table_productlist"));
  //           const tableElement = document.getElementById('table_productlist');

  //           if (tableElement) {
  //             const parentElement = tableElement.parentNode;

  //             if (parentElement) {
  //               parentElement.removeChild(tableElement);
  //             }
  //           }
  //         },
  //         width: 652,
  //         height: 630,
  //         buttons: {
  //           'Select (选入)': function () {
  //             var lStatus =(<HTMLInputElement>document.getElementById('order_status')).value;
  //             if (lStatus != null) {
  //               if (lStatus != 'New' && lStatus != 'Created') {
  //                 alert(
  //                   'You cannot change product code as the order is submitted already. (此订单已提交,不能修改产品代码.) '
  //                 );
  //                 return false;
  //               }
  //             }
  //             let gOrderCreation="Yes";  // need to change this
  //             if (gOrderCreation != 'Yes') {
  //               alert('You cannot change product code. (不能修改产品代码.) ');
  //               return false;
  //             }
  //             //if (lNatSteel == 1) {
  //             //    alert("You cannot change product code. (不能修改产品代码.) ");
  //             //    return false;
  //             //}
  //             // var lProductCode = '';
  //             const lTable = document.getElementById('table_productlist');
  //             let lProductCode: string | undefined = undefined;

  //             if (lTable) {
  //                 for (let i = 0; i < lTable.rows.length; i++) {
  //                     const row = lTable.rows[i];

  //                     if (row.style.backgroundColor === 'rgb(0, 255, 0)') {
  //                         lProductCode = row.cells[1].innerText;
  //                         break;
  //                     }
  //                 }
  //             }

  //             if (lProductCode == '') {
  //               alert(
  //                 'Please click a product to select it. (请点击您所选择的产品.)'
  //               );
  //             } else {
  //               if (this.templateGrid.slickGrid.getActiveCell() == null) {
  //                 alert(
  //                   'Please select a row from the order detials before selecting product code. (请从订单明细表中选择一行, 再选产品.)'
  //                 );
  //               } else {
  //                 var lItemNew = dataViewCTS.getItem(
  //                   gridCTSMesh.getActiveCell().row
  //                 );
  //                 if (lItemNew == null) {
  //                   alert(
  //                     'Please enter marking before selecting shape code. (请输入编码, 再选产品.)'
  //                   );
  //                 } else {
  //                   loadProductInfo(
  //                     lProductCode,
  //                     pGridIndex,
  //                     gridCTSMesh.getActiveCell().row
  //                   );

  //                   lItemNew.MeshProduct = lProductCode;

  //                   var lWT = 0;
  //                   if (lCategory == 'BEAM') {
  //                     lWT = calWeightBeam(lItemNew);
  //                   } else if (lCategory == 'COLUMN') {
  //                     lWT = calWeightColumn(lItemNew);
  //                   } else {
  //                     lWT = calWeightOthers(lItemNew);
  //                   }
  //                   lItemNew.MeshTotalWT = lWT;
  //                   //  SaveCTSDetails(lItemNew);
  //                   dataViewCTS.beginUpdate();
  //                   dataViewCTS.updateItem(lItemNew.id, lItemNew);
  //                   dataViewCTS.endUpdate();
  //                   gridCTSMesh.invalidate();
  //                   gridCTSMesh.render();
  //                   document.getElementById('rt_MWDia').innerHTML = gProdMWDia;
  //                   document.getElementById('bt_MWDia').innerHTML = gProdMWDia;

  //                   if (gProdTwinInd == 'M') {
  //                     document.getElementById('rt_MWSpacing').innerHTML =
  //                       gProdMWSpacing + '(Twin)';
  //                     document.getElementById('bt_MWSpacing').innerHTML =
  //                       gProdMWSpacing + '(Twin)';
  //                   } else {
  //                     document.getElementById('rt_MWSpacing').innerHTML =
  //                       gProdMWSpacing;
  //                     document.getElementById('bt_MWSpacing').innerHTML =
  //                       gProdMWSpacing;
  //                   }

  //                   document.getElementById('rt_CWDia').innerHTML = gProdCWDia;
  //                   document.getElementById('bt_CWDia').innerHTML = gProdCWDia;

  //                   document.getElementById('rt_CWSpacing').innerHTML =
  //                     gProdCWSpacing;
  //                   document.getElementById('bt_CWSpacing').innerHTML =
  //                     gProdCWSpacing;

  //                   document.getElementById('rt_mass').innerHTML = gProdMass;
  //                   document.getElementById('bt_mass').innerHTML = gProdMass;

  //                   refreshInfo();

  //                   $(this).dialog('close');
  //                   $dialog.remove();

  //                   gridCTSMesh.focus();
  //                 }
  //               }
  //             }
  //           },
  //           'Close (关闭)': function () {
  //             $(this).dialog('close');
  //             $dialog.remove();
  //           },
  //         },
  //       });
  //     }
  //   }
  // }

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
    if (lStructureElement.includes('NONWBS' || 'nonwbs')) {
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
    // localStorage.setItem(
    //   'CreateDataProcess',
    //   JSON.stringify(tempOrderSummaryList)
    // );
    setTimeout(() => {
    console.log('SetOrderSummaryData', tempOrderSummaryList);
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
      // You can set a specific message to display after the timeout
    }, 1000);
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    // this.router.navigate(['../order/createorder']);
  }
}
function openModalOnDblClk() {
  throw new Error('Function not implemented.');
}
