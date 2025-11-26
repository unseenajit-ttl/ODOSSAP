import { ThisReceiver } from '@angular/compiler';
import { Component, DebugElement, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, Editors, GridOption } from 'angular-slickgrid';
import * as math from 'mathjs';
import { ToastrService } from 'ngx-toastr';
// import { ToastrService } from 'ngx-toastr';
import { BindingLimitComponent } from 'src/app/Detailing/DeatilingGroupMark/binding-limit/binding-limit.component';
import { DetailingService } from 'src/app/Detailing/DetailingService';
import { ADD_CABModel } from 'src/app/Model/Add_CABModel';
import { BBSOrderdetailsTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
import { bbsOrderShapeImageModel } from 'src/app/Model/bbsOrderShapeImageModel';
import { BBSOrdertableModel } from 'src/app/Model/BBSOrdertableModel';
import { SaveBarDetailsModel } from 'src/app/Model/saveBarDetailsModel';
import { CreateordersharedserviceService } from 'src/app/Orders/createorder/createorderSharedservice/createordersharedservice.service';
import { OrderService } from 'src/app/Orders/orders.service';
import { ProcessSharedServiceService } from 'src/app/Orders/process-order/SharedService/process-shared-service.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { AnyMapping } from 'three';
// import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-bbs-orderdetails',
  templateUrl: './bbs-orderdetails.component.html',
  styleUrls: ['./bbs-orderdetails.component.css'],
})

export class BbsOrderdetailsComponent implements OnInit {
  @ViewChild('myCanvas', { static: true })
  Canvas!: ElementRef<HTMLCanvasElement>;
  CustomerCode: any = '';
  ProjectCode: any = '';
  gridOptions!: GridOption;

  templateGrid!: AngularGridInstance;
  dataViewCAB: any;

  templateColumns: Column[] = [];
  bbsOrderdataset: any;

  gEStdDia = '';
  gENonDia = '';

  gNStdDia = '';
  gNNonDia = '';

  showSideTable: boolean = false;
  totalCABWeight: any = '';
  totalSBWeight: any = '';
  totalCancelledWT: any = '';
  totalTotalWeight: any = '';
  totalNoofitems: any = '';
  totalTotalBarQty: any = '';
  shapeCodeList: { value: any; label: any }[] = [];

  showTable: boolean = false;

  JobID: any;
  // JobID: any = this.createSharedService.JobIds.CABJOBID;

  receivedData: any;

  BBSList: any[] = [];
  CouplerList: any[] = [];
  orderDetailsTable: any[] = [];
  orderDetailsList: any;


  OrderdetailsLoading: boolean = true;
  CABDetails: any;
  TotalCABWeight: number = 0;
  TotalSTDWeight: number = 0;
  TotalWeight: number = 0;
  CouplerType: any = '';
  TransportMode: any = '';
  BBSStandard: any = 'BS-8666';

  BBSId: number = 1;

  gSBBarType: any[] = [];
  gSBBarSize: any[] = [];
  gSBLength: any[] = [];
  gSBPcsFr: any[] = [];
  gSBPcs: any[] = [];
  gAddParType: any[] = [];
  gAddParDia: any[] = [];
  gAddParBendLenMin: any[] = [];
  gAddDia: any[] = [];
  gAddHKHeightMax: any[] = [];
  gAddBendLenMin: any[] = [];
  gAddShape: any[] = [];
  gAddPara: any[] = [];
  gAddHook: any[] = [];
  gAddRepShape: any[] = [];

  gOrderSubmission: any = 'No';
  gOrderCreation: any = 'No';
  gMaxBarLength: any = 12000;
  gCustomerBar: any = '';
  gSkipBendCheck: any = 'N';
  gVarianceBarSplit: any = 'N';
  gBBSStandard: any = 'BS-8666';

  rowIndex: number = 0;
  ChangeInd: number = 0; //BBS List Change indicator
  gJobAdviceChanged: number = 0;

  copyCopied: boolean = false;
  copyGridID: any = 2;
  copyDesSelected = false;

  NON_Editable: boolean = false;

  ShapeCatList: any[] = [];

  showcontextMenuCAB: boolean = false;
  showVariance: boolean = false;

  VarianceData: any;
  JobAdviceData: any;

  ProjectStageList: any[] = [];
  Shape_Category: any;
  CopiedBBSRows: any[] = [];
  RoutedFromProcess: boolean = false;
  lTransportMode: any = '';

  BarSizeList: any[] = [];
  bbsOrderTable: BBSOrdertableModel[] = [];

  // gSBBarType: any[] = [];
  // gSBBarSize: any[] = [];
  // gSBLength: any[] = [];
  // gSBPcsFr: any[] = [];
  // gSBPcs: any[] = [];

  // VARIBLES FROM OLD
  gShapeCode: any;
  gShapeParameters: any;
  gShapeLengthFormula: any;
  gShapeImage: any;
  gShapeParaValid: any;
  gShapeTransValid: any;
  gShapeParaX: any;
  gShapeParaY: any;
  gShapeParType: any;
  gShapeDefaultValue: any;
  gShapeHeightCheck: any;
  gShapeAutoCalcFormula1: any;
  gShapeAutoCalcFormula2: any;
  gShapeAutoCalcFormula3: any;
  ShapeData: any;

  ShapeImageValueList: bbsOrderShapeImageModel[] = [];
  showShapeImage: boolean = false;

  storedObjectData: any;
  ParameterSetData: any = null;
  MeshData: any;
  Size: { X: string[]; H: string[] } = { X: [], H: [] };
  IntGroupMarkId: number | undefined;
  DetailingID: number | undefined;
  StructureElementId: number | undefined;
  ProjectId: number | undefined;
  ParameterSetNo: number | undefined;
  ProductTypeID: number | undefined;
  selectedShapeCode: any;
  selectedShapeObject: any = null;

  // OLD CODE VARIABLES

  gridIndex = 0;
  gPreCellRow = -1;
  gPreCellCol = 0;

  // Shape Code buffer
  bShapeCode: any[] = [];
  bShapeParameters: any[] = [];
  bShapeLengthFormula: any[] = [];
  bShapeImage: any[] = [];
  bShapeParaValid: any[] = [];
  bShapeTransValid: any[] = [];

  bShapeParaX: any[] = [];
  bShapeParaY: any[] = [];

  bShapeParType: any[] = [];
  bShapeDefaultValue: any[] = [];
  bShapeHeightCheck: any[] = [];
  bShapeAutoCalcFormula1: any[] = [];
  bShapeAutoCalcFormula2: any[] = [];
  bShapeAutoCalcFormula3: any[] = [];

  //Shape Code List
  gShapeCodeList = '';
  gShapeCategory = '';

  //Validation
  gLowBed = 2400;
  gLowBedEsc = 3200;
  gDia = ',10,13,16,20,25,28,32,40,50';
  gDiaAll = ',8,10,13,16,20,25,28,32,40,50';
  gPinSizeList = '';

  gHStdDia = ',8,10,13,16,20,25,28,32,40,50';
  gHNonDia = ',8,10,13,16,20,25,28,32,40,50';
  gTStdDia = ',8,10,13,16,20,25,28,32,40,50';
  gTNonDia = ',8,10,13,16,20,25,28,32,40,50';
  gRStdDia = ',8,10,13,16,20,25,28,32,40,50';
  gRNonDia = ',8,10,13,16,20,25,28,32,40,50';
  gXStdDia = ',8,10,13,16,20,25,28,32,40,50';
  gXNonDia = ',8,10,13,16,20,25,28,32,40,50';

  gMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gMinLenStd = '0,60,90,100,120,200,260,260,300,380,450';
  gMinLenHkStd = '0,60,100,110,130,210,280,280,320,390,460';
  gMinHtHkStd = '0,45,65,80,110,200,270,275,310,410,540';
  gStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gNonFormer = ',32,40,50,65,90,120,120,155,200,400';

  gHDia = ',8,10,13,16,20,25,28,32,40,50';
  gHNonMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gHNonMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gHNonMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gHStdMinLen = '0,60,90,100,120,200,260,260,300,380,450';
  gHStdMinLenHk = '0,60,100,110,130,210,280,280,320,390,460';
  gHStdMinHtHk = '0,45,65,80,110,200,270,275,310,410,540';
  gHStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gHNonFormer = ',32,40,50,65,90,120,120,155,200,400';

  gTDia = ',8,10,13,16,20,25,28,32,40,50';
  gTNonMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gTNonMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gTNonMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gTStdMinLen = '0,60,90,100,120,200,260,260,300,380,450';
  gTStdMinLenHk = '0,60,100,110,130,210,280,280,320,390,460';
  gTStdMinHtHk = '0,45,65,80,110,200,270,275,310,410,540';
  gTStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gTNonFormer = ',32,40,50,65,90,120,120,155,200,400';

  gRDia = ',8,10,13,16,20,25,28,32,40,50';
  gRNonMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gRNonMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gRNonMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gRStdMinLen = '0,60,90,100,120,200,260,260,300,380,450';
  gRStdMinLenHk = '0,60,100,110,130,210,280,280,320,390,460';
  gRStdMinHtHk = '0,45,65,80,110,200,270,275,310,410,540';
  gRStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gRNonFormer = ',32,40,50,65,90,120,120,155,200,400';

  gXDia = ',8,10,13,16,20,25,28,32,40,50';
  gXNonMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gXNonMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gXNonMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gXStdMinLen = '0,60,90,100,120,200,260,260,300,380,450';
  gXStdMinLenHk = '0,60,100,110,130,210,280,280,320,390,460';
  gXStdMinHtHk = '0,45,65,80,110,200,270,275,310,410,540';
  gXStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gXNonFormer = ',32,40,50,65,90,120,120,155,200,400';

  gEDia = ',8,10,13,16,20,25,28,32,40,50';
  gENonMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gENonMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gENonMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gEStdMinLen = '0,60,90,100,120,200,260,260,300,380,450';
  gEStdMinLenHk = '0,60,100,110,130,210,280,280,320,390,460';
  gEStdMinHtHk = '0,45,65,80,110,200,270,275,310,410,540';
  gEStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gENonFormer = ',32,40,50,65,90,120,120,155,200,400';

  gNDia = ',8,10,13,16,20,25,28,32,40,50';
  gNNonMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gNNonMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gNNonMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gNStdMinLen = '0,60,90,100,120,200,260,260,300,380,450';
  gNStdMinLenHk = '0,60,100,110,130,210,280,280,320,390,460';
  gNStdMinHtHk = '0,45,65,80,110,200,270,275,310,410,540';
  gNStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gNNonFormer = ',32,40,50,65,90,120,120,155,200,400';

  // END

  gridArray: any;
  dataViewArray: any;

  sortcolArray: any = [];
  sortdirArray: any = [];
  percentCompleteThresholdArray: any = [];
  searchStringArray: any = [];
  h_runfiltersArray: any = [];
  barChangeInd: any = [0];
  barRowIndex: any = [];


  constructor(
    private router: Router,
    private location: Location,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private createSharedService: CreateordersharedserviceService,
    private dropdown: CustomerProjectService,
    private processsharedserviceService: ProcessSharedServiceService
  ) {
    this.gridOptions = {
      editable: true,
      enableAutoResize: true,
      enableCellNavigation: true,
      enableColumnReorder: false,
      enableColumnPicker: false,
      enableSorting: true,
      enableFiltering: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 15,
      explicitInitialization: true,
      enableRowSelection: true,
      enableAutoTooltip: true,
      enableAddRow: true,
      enableContextMenu: false,
    };
    this.templateColumns = [
      {
        id: 'id',
        name: 'ID\n序号',
        field: 'id',
        toolTip: 'Serial Number (序列号)',
        // minWidth: 30,
        // width: 30,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'Cancelled',
        name: 'Cancel\n取消',
        field: 'Cancelled',
        toolTip: 'Cancelled item (取消本行）',
        // minWidth: 50,
        // maxWidth: 50,
        // width: 50,
        editor: { model: Editors.checkbox },
        cssClass: 'center-align grid-text-size',
      },
      {
        id: 'ElementMark',
        name: 'Element Mark/ Page No\n结构名/页',
        field: 'ElementMark',
        toolTip: 'Element marking （结构名称）',
        // minWidth: 50,
        // width: 50,
        editor: { model: Editors.text },
        cssClass: 'left-align grid-text-size',
      },
      {
        id: 'BarMark',
        name: 'Mark\n铁代号',
        field: 'BarMark',
        toolTip: 'Bar Mark (铁代号)',
        // minWidth: 50,
        // width: 50,
        editor: { model: Editors.text },
        cssClass: 'left-align grid-text-size',
      },
      {
        id: 'BarType',
        name: 'Type\n型号',
        field: 'BarType',
        toolTip:
          'Bar Type (H-Euro Standard, X-Grade 600, T-Grade 500 Deformed Bar) (铁型号 H-欧洲标准, X-600号螺纹钢, T-500号螺纹钢)',
        // minWidth: 40,
        // maxWidth: 40,
        // width: 40,
        editor: {
          model: Editors.autocompleter,
          collection: [
            { value: 'H', label: 'H' },
            { value: 'X', label: 'X' },
          ],
          editorOptions: {
            forceUserInput: true,
            minLength: 0,
          },
        },
        // editor: {
        //   model: Editors.autocompleter,
        //   collection: this.shapeCodeList,
        //   editorOptions: {
        //     forceUserInput: true,
        //     minLength: 1,
        //   },
        // },
        cssClass: 'left-align grid-text-size',
      },
      {
        id: 'BarSize',
        name: 'Size\n直径',
        field: 'BarSize',
        toolTip: 'Bar Diameter (直径)',
        // minWidth: 40,
        // maxWidth: 40,
        // width: 40,
        editor: {
          model: Editors.autocompleter,
          collection: this.BarSizeList,
          editorOptions: {
            forceUserInput: true,
            minLength: 0,
          },
        },
        cssClass: 'left-align grid-text-size',
      },
      {
        id: 'BarSTD',
        name: 'SB\n标铁',
        field: 'BarSTD',
        toolTip: 'Standard Store Length Bars (是否是标准直铁).',
        // minWidth: 40,
        // maxWidth: 40,
        // width: 40,
        editor: { model: Editors.checkbox },
        cssClass: 'center-align grid-text-size',
      },
      {
        id: 'BarMemberQty',
        name: 'Member Qty\n构件数',
        field: 'BarMemberQty',
        toolTip: 'Member Qty (构件数量)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.integer },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'BarEachQty',
        name: 'Each Qty\n单件数',
        field: 'BarEachQty',
        toolTip: 'Qty of Each Member (单件数量)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.integer },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'BarTotalQty',
        name: 'Total Qty\n总数',
        field: 'BarTotalQty',
        toolTip: 'Total Bars Qty (总数量)',
        // minWidth: 40,
        // width: 40,
        focusable: false,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'BarShapeCode',
        name: 'Shape Code\n图形码',
        field: 'BarShapeCode',
        toolTip: 'Shape Code (图形代码)',
        // minWidth: 40,
        // width: 40,
        editor: {
          model: Editors.autocompleter,
          collection: this.shapeCodeList,
          editorOptions: {
            forceUserInput: true,
            minLength: 1,
          },
        },
        cssClass: 'center-align grid-text-size',
      },
      {
        id: 'A',
        name: 'A',
        field: 'A',
        toolTip: 'Bending Parameter A (参数 A)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'B',
        name: 'B',
        field: 'B',
        toolTip: 'Bending Parameter B (参数 B)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'C',
        name: 'C',
        field: 'C',
        toolTip: 'Bending Parameter C (参数 C)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'D',
        name: 'D',
        field: 'D',
        toolTip: 'Bending Parameter D (参数 D)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'E',
        name: 'E',
        field: 'E',
        toolTip: 'Bending Parameter E (参数 E)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'F',
        name: 'F',
        field: 'F',
        toolTip: 'Bending Parameter F (参数 F)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'G',
        name: 'G',
        field: 'G',
        toolTip: 'Bending Parameter G (参数 G)',
        // minWidth: 40,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      // {
      //   id: 'H',
      //   name: 'H',
      //   field: 'H',
      //   toolTip: 'Bending Parameter H (参数 H)',
      //   minWidth: 40,
      //   width: 40,
      //   editor: { model: Editors.text },
      //   cssClass: 'right-align grid-text-size',
      // },
      {
        id: 'PinSize',
        name: 'Pin Size\n弯模',
        field: 'PinSize',
        toolTip: 'Pin Size (弯模尺寸)',
        // minWidth: 40,
        // width: 40,
        focusable: false,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'BarLength',
        name: 'Length\n长度',
        field: 'BarLength',
        toolTip: 'Bar Length (铁长度)',
        // minWidth: 40,
        // width: 40,
        focusable: false,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'BarWeight',
        name: 'Weight\n重量(kg)',
        field: 'BarWeight',
        toolTip: 'Total Bars Weight for this line (本行总重量)',
        // minWidth: 60,
        // width: 60,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'Remarks',
        name: 'Remarks\n备注',
        field: 'Remarks',
        toolTip: 'Remarks (备注)',
        // minWidth: 60,
        // width: 60,
        editor: { model: Editors.text },
        cssClass: 'left-align grid-text-size',
      },
    ];
  }

  
  ngOnInit(): void {
    setTimeout(() => {
      this.bbsOrderdataset = this.mockData();
      console.log('this.bbsOrderdataset=>', this.bbsOrderdataset);
    });
  }

  mockData() {
    const mockDataset = [];

    for (let i = 0; i < 1; i++) {
      mockDataset[i] = {
        id: i,
        Cancelled: false,
        ElementMark: '',
        BarMark: '',
        BarType: '',
        BarSize: '',
        BarSTD: false,
        BarMemberQty: 0,
        BarEachQty: 0,
        BarTotalQty: '',
        BarShapeCode: '',
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
        F: '',
        G: '',
        PinSize: '',
        BarLength: '',
        BarWeight: '',
        Remarks: '',
      };
    }
    return mockDataset;
  }
  
  angularGridReady(event: Event) {
    console.log('event', event);
    this.templateGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.dataViewCAB = this.templateGrid.slickGrid.getData();

    this.templateGrid.slickGrid.onValidationError.subscribe((e, args) => {
      alert(args.validationResults.msg);
    });

    this.templateGrid.slickGrid.onActiveCellChanged.subscribe((e, args) => {
      this.grid_onActiveCellChanged(e, args);
    });
    this.templateGrid.slickGrid.onBeforeEditCell.subscribe((e, args) => {
      this.grid_onBeforeEditCell(e, args);
    });
    this.templateGrid.slickGrid.onCellChange.subscribe((e, args) => {
      this.grid_onCellChange(e, args);
    });
    this.templateGrid.slickGrid.onAddNewRow.subscribe((e, args) => {
      this.grid_onAddNewRow(e, args);
    });
    this.templateGrid.slickGrid.onSelectedRowsChanged.subscribe((e, args) => {
      this.grid_onSelectedRowsChanged(e, args);
    });
    this.templateGrid.slickGrid.onClick.subscribe((e, args) => {
      this.grid_onClick(e, args);
    });
    this.templateGrid.slickGrid.onDblClick.subscribe((e, args) => {
      console.log('Open ShapeList Component');
    });

    this.templateGrid.slickGrid.onKeyDown.subscribe((e, args) => {
      this.grid_onKeyDown(e, args);
    });
    this.templateGrid.slickGrid.onContextMenu.subscribe((e, args) => {
      this.grid_onContextMenu(e, args);
    });
    this.templateGrid.slickGrid.onSort.subscribe((e, args) => {
      this.grid_onSort(e, args);
    });
  }

  grid_onActiveCellChanged(e: any, args: any) {
    this.getShapeFinderReset(this.gridIndex);

    if (args.grid.getColumns(args.row)[args.cell] == undefined) {
      console.log('Returned form Active Cell Change Event ');
      return;
    }

    let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
    let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
    if (lItem == undefined) {
      return;
    }

    console.log('ListItem -> ', lItem);

    if (lItem.BarType != undefined) {
      if (lItem.BarType == 'X') {
        // this.BarSizeList = this.convertStrToObj('13,16,20,25,32,40,50');
        this.BarSizeList = [
          { label: '13', value: '13' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '32', value: '32' },
          { label: '40', value: '40' },
          { label: '50', value: '50' }];
        args.grid.getColumns()[5].editor.collection = [
          { label: '13', value: '13' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '32', value: '32' },
          { label: '40', value: '40' },
          { label: '50', value: '50' }];
        this.UpdateBarSize();
        // lItem.BarSize.editor.collection = this.BarSizeList;
      } else if (lItem.BarType == 'H') {
        // this.BarSizeList = this.convertStrToObj('8,10,13,16,20,25,28,32,40,50');
        this.BarSizeList = [
          { label: '8', value: '8' },
          { label: '10', value: '10' },
          { label: '13', value: '13' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '28', value: '28' },
          { label: '32', value: '32' },
          { label: '40', value: '40' },
          { label: '50', value: '50' }];
        args.grid.getColumns()[5].editor.collection = [
          { label: '8', value: '8' },
          { label: '10', value: '10' },
          { label: '13', value: '13' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '28', value: '28' },
          { label: '32', value: '32' },
          { label: '40', value: '40' },
          { label: '50', value: '50' }];

        this.UpdateBarSize();
        // lItem.BarSize.editor.collection = this.BarSizeList;

      }
    }

    let lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];

    if (lColumnName == 'BarMark') {
      let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
      lItem.BarMark = lItem.BarMark ? lItem.BarMark.toUpperCase() : '';
      this.dataViewCAB.updateItem(lItem.id, lItem);
    }

    if (lColumnName == 'ElementMark') {
      let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
      lItem.ElementMark = lItem.ElementMark
        ? lItem.ElementMark.toUpperCase()
        : '';
      this.dataViewCAB.updateItem(lItem.id, lItem);
    }

    let grid = args.grid;
    if (grid.getDataItem(args.row) != null) {
      var lShapeCode = grid.getDataItem(args.row).BarShapeCode;
      if (lShapeCode != null && lShapeCode != '') {
        if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;
        if (lShapeCode != this.gShapeCode) {
          this.loadShapeInfo(lShapeCode, this.gridIndex, args.row);
          this.showShapeImage = true;
        } else {
          this.CheckParameters(this.gShapeParameters, this.gridIndex);
          this.showShapeImage = true;
          $('#rightShapeImage-' + this.gridIndex).show();
          $('#btmShapeImage-' + this.gridIndex).show();
        }
      } else {
        this.showShapeImage = false;
        $('#rightShapeImage-' + this.gridIndex).hide();
        $('#btmShapeImage-' + this.gridIndex).hide();
      }

      let lPara = grid.getDataItem(args.row).shapeParameters;
      let lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];
      if (lColumnName == 'BarSTD') {
        if (args.cell > this.gPreCellCol) {
          this.gPreCellRow = args.row;
          this.gPreCellCol = args.cell;
          grid.navigateRight();
        }
      }
      if (lColumnName.length == 1 && lColumnName >= 'A' && lColumnName <= 'Z') {
        if (this.isInvalidParameterCell(lShapeCode, lColumnName, lPara)) {
          if (args.cell < this.gPreCellCol) {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            grid.navigateLeft();
          } else {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            grid.navigateRight();
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
      this.showShapeImage = false;
      $('#rightShapeImage-' + this.gridIndex).hide();
      $('#btmShapeImage-' + this.gridIndex).hide();
    }

    if (lColumnName == 'BarWeight') {
      if (args.grid.getDataItem(args.row).BarSTD == true) {
      } else {
        grid.navigateRight();
      }
    }



    // Get the active cell
    const activeCell = this.templateGrid.slickGrid.getActiveCell();

    // Check if there is an active cell
    if (activeCell) {
      // Get the row and column index of the active cell
      const rowIndex = activeCell.row;
      const columnIndex = activeCell.cell;

      // Set the class of the active cell (modify as needed)
      this.setCellClass(rowIndex, columnIndex, 'HighLight');
    }


    args.grid.focus();
    if (args.grid.getOptions().editable == true) {
      // if (args.grid.getDataItem(args.row).BarSTD != undefined && args.grid.getDataItem(args.row).BarSTD != false) {
      //   args.grid.editActiveCell();
      // } else {
      //   if (args.grid.getColumns(args.row)[args.cell]["id"]! = 'BarWeight') {
      //     args.grid.editActiveCell();

      //   }
      // }
      args.grid.editActiveCell();
    }

    this.dataViewCAB.getItemMetadata = this.metadata(this.dataViewCAB.getItemMetadata);

    return true;
  }

  grid_onKeyDown(e: any, args: any) {
    // alert('YES')

    this.dataViewCAB = this.templateGrid.slickGrid.getData();
    if (e.which == 9) {

      e.preventDefault();
      //grid.getEditorLock().commitCurrentEdit();
      let lCurrRow = args.grid.getActiveCell().row;
      let lCurrCell = args.grid.getActiveCell().cell;
      let lColumnName = args.grid.getColumns(lCurrRow)[lCurrCell]['id'];
      if (lColumnName == 'BarType') {
        args.grid.getEditorLock().commitCurrentEdit();
        var lEachQty =
          args.grid.getDataItem(lCurrRow).BarType == null
            ? ''
            : args.grid.getDataItem(lCurrRow).BarType;
        if (
          lEachQty == null || lEachQty == undefined ||
          lEachQty == '' ||
          lEachQty == ' ' ||
          lEachQty == 0
        ) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      if (lColumnName == 'BarSize') {
        args.grid.getEditorLock().commitCurrentEdit();
        var lEachQty =
          args.grid.getDataItem(lCurrRow).BarSize == null
            ? ''
            : args.grid.getDataItem(lCurrRow).BarSize;
        if (
          lEachQty == null || lEachQty == undefined ||
          lEachQty == '' ||
          lEachQty == ' ' ||
          lEachQty == 0
        ) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
    }
    if (e.which == 13) {
      e.preventDefault();
      //grid.getEditorLock().commitCurrentEdit();
      var lCurrRow = args.grid.getActiveCell().row;
      var lCurrCell = args.grid.getActiveCell().cell;
      var lColumnName = args.grid.getColumns(lCurrRow)[lCurrCell]['id'];

      if (args.grid.getDataItem(lCurrRow) != null) {
        if (lColumnName == 'BarMemberQty') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lMembQty = args.grid.getDataItem(lCurrRow).BarMemberQty;
          if (
            lMembQty == null || lMembQty == undefined ||
            lMembQty == '' ||
            lMembQty == ' ' ||
            lMembQty == 0
          ) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
        }
        if (lColumnName == 'BarEachQty') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lEachQty = args.grid.getDataItem(lCurrRow).BarEachQty;
          if (
            lEachQty == null || lEachQty == undefined ||
            lEachQty == '' ||
            lEachQty == ' ' ||
            lEachQty == 0
          ) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
        }
        if (lColumnName == 'BarType') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lEachQty =
            args.grid.getDataItem(lCurrRow).BarType == null
              ? ''
              : args.grid.getDataItem(lCurrRow).BarType;
          if (
            lEachQty == null || lEachQty == undefined ||
            lEachQty == '' ||
            lEachQty == ' ' ||
            lEachQty == 0
          ) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
        }
        if (lColumnName == 'BarSize') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lEachQty =
            args.grid.getDataItem(lCurrRow).BarSize == null
              ? ''
              : args.grid.getDataItem(lCurrRow).BarSize;
          if (
            lEachQty == null || lEachQty == undefined ||
            lEachQty == '' ||
            lEachQty == ' ' ||
            lEachQty == 0
          ) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
        }

        if (lColumnName == 'BarShapeCode') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lShapeCode = args.grid.getDataItem(lCurrRow).BarShapeCode;
          if (lShapeCode == null || lShapeCode == '' || lShapeCode == undefined || lShapeCode == ' ') {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
        }
        if (lColumnName.length == 1) {
          args.grid.getEditorLock().commitCurrentEdit();
          var lParam = args.grid.getDataItem(lCurrRow)[lColumnName];
          if (lParam == null || lParam == '' || lParam == undefined || lParam == ' ') {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
        }
        if (lColumnName == 'Remarks') {
          args.grid.getEditorLock().commitCurrentEdit();
          //args.grid.navigateDown();
          args.grid.setActiveCell(lCurrRow + 1, 3);
        } else {
          args.grid.navigateRight();
        }
      } else {
        args.grid.navigateRight();
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    //if ((e.which == 67 || e.which == 99) && e.ctrlKey) {
    //    args.grid.getEditorLock().commitCurrentEdit();
    //    BarsCopy(args.this.gridIndex);
    //}

    //if ((e.which == 86 || e.which == 118) && e.ctrlKey) {
    //    args.grid.getEditorLock().commitCurrentEdit();
    //    BarsPaste(args.this.gridIndex);
    //}

    if (e.which != 65 || !e.ctrlKey) {
      return;
    }

    var rows = [];
    for (let i = 0; i < this.dataViewCAB.getLength(); i++) {
      rows.push(i);
    }

    args.grid.setSelectedRows(rows);
    e.preventDefault();
  }

  convertStrToObj(item: string) {
    let arr: any[] = item.split(',');

    let result: any[] = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]! != '' && arr[i] != undefined) {
        let temp = { value: arr[i], label: arr[i] };
        result.push(temp);
      }
    }

    return result;
  }
  grid_onBeforeEditCell(e: any, args: any) {
    let lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];
    if (lColumnName == 'BarType') {
      lType = '';
      for (var i = 0; i < this.gSBBarType.length; i++) {
        if (
          this.gSBBarType[i] != null &&
          (this.gSBBarType[i] == 'H' || this.gSBBarType[i] == 'X') &&
          lType.indexOf(this.gSBBarType[i]) < 0
        ) {
          lType = lType + ',' + this.gSBBarType[i];
        }
      }
      // if (args.grid.getColumns()[args.cell].editorOptions.options != lType) {
      //   args.grid.getColumns()[args.cell].editorOptions.options = lType;
      // }
      if (
        args.grid.getColumns()[args.cell].editor.collection !=
        this.convertStrToObj(lType)
      ) {
        args.grid.getColumns()[args.cell].editor.collection =
          this.convertStrToObj(lType);
      }

      if (this.gCustomerBar == 'R') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'H', label: 'H' },
          { value: 'R', label: 'R' },
        ];
        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",H,R") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",H,R";
        // }
      }
      if (this.gCustomerBar == 'C') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'C', label: 'C' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",C") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",C";
        // }
      }
      if (this.gCustomerBar == 'E') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'E', label: 'E' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",E") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",E";
        // }
      }
      if (this.gCustomerBar == 'N') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'N', label: 'N' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",N") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",N";
        // }
      }
      if (this.gCustomerBar == 'EN' || this.gCustomerBar == 'NE') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'E', label: 'E' },
          { value: 'N', label: 'N' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",E,N") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",E,N";
        // }
      }
      if (this.gCustomerBar == 'CE' || this.gCustomerBar == 'EC') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'E', label: 'E' },
          { value: 'C', label: 'C' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",C,E") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",C,E";
        // }
      }
      if (this.gCustomerBar == 'CN' || this.gCustomerBar == 'NC') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'C', label: 'C' },
          { value: 'N', label: 'N' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",C,N") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",C,N";
        // }
      }
      if (
        this.gCustomerBar == 'CEN' ||
        this.gCustomerBar == 'CNE' ||
        this.gCustomerBar == 'NCE' ||
        this.gCustomerBar == 'NEC' ||
        this.gCustomerBar == 'ECN' ||
        this.gCustomerBar == 'ENC'
      ) {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'C', label: 'C' },
          { value: 'E', label: 'E' },
          { value: 'N', label: 'N' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",C,E,N") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",C,E,N";
        // }
      }
      if (
        this.gCustomerBar == 'ENR' ||
        this.gCustomerBar == 'RNE' ||
        this.gCustomerBar == 'NRE' ||
        this.gCustomerBar == 'NER' ||
        this.gCustomerBar == 'ERN' ||
        this.gCustomerBar == 'REN'
      ) {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'R', label: 'R' },
          { value: 'E', label: 'E' },
          { value: 'N', label: 'N' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",R,E,N") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",R,E,N";
        // }
      }
    }
    if (lColumnName == 'BarSize' && args.grid.getDataItem(args.row) != null) {
      var lType = args.grid.getDataItem(args.row).BarType;
      var lDia = '';
      if (lType != null) {
        if (lType == 'C') {
          lType = 'H';
        }
        //if (lType == "E") {
        //    lType = "T";
        //}
        //if (lType == "N") {
        //    lType = "T";
        //}
        for (var i = 0; i < this.gSBBarType.length; i++) {
          if (lType == this.gSBBarType[i]) {
            if (lDia.indexOf(this.gSBBarSize[i]) < 0) {
              lDia = lDia + ',' + this.gSBBarSize[i];
            }
          }
        }
        if (lDia != '') {
          // if (args.grid.getColumns()[args.cell].editorOptions.options != lDia) {
          //   args.grid.getColumns()[args.cell].editorOptions.options = lDia;
          // }
          if (
            args.grid.getColumns()[args.cell].editor.collection !=
            this.convertStrToObj(lDia)
          ) {
            args.grid.getColumns()[args.cell].editor.collection =
              this.convertStrToObj(lDia);
          }
        }
      }
    }
    if (lColumnName == 'BarWeight') {
      if (args.grid.getDataItem(args.row) != null) {
        var lType = args.grid.getDataItem(args.row).BarSTD;
        if (lType == null || lType == false || lType == undefined) {
          if (args.cell < this.gPreCellCol) {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            args.grid.navigateLeft();
          } else {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            args.grid.navigateRight();
          }
        }
      }
    }
    if (
      lColumnName == 'BarMemberQty' ||
      lColumnName == 'BarEachQty' ||
      lColumnName == 'BarShapeCode' ||
      (lColumnName.length == 1 && lColumnName >= 'A' && lColumnName <= 'Z')
    ) {
      if (args.grid.getDataItem(args.row) != null) {
        var lType = args.grid.getDataItem(args.row).BarSTD;
        if (
          lType == true &&
          (this.gMaxBarLength <= 12000 || lColumnName != 'A')
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
        }
      }
    }
    if (lColumnName == 'BarShapeCode') {
      // $(function () {
      let gShapeCodeListAR: string[] = this.gShapeCodeList.split(',');
      // $("#ShapeCodeEditor").autocomplete({ source: gShapeCodeListAR });

      // });
    }
  }
  grid_onCellChange(e: any, args: any) {
    let grid = args.grid;

    if (args.item.BarShapeCode) {
      if (args.item.BarShapeCode.value != undefined) {
        args.item.BarShapeCode = args.item.BarShapeCode.value;
      }
    }
    if (args.item.BarType) {
      if (args.item.BarType.value != undefined) {
        args.item.BarType = args.item.BarType.value;
      }
    }
    if (args.item.BarSize) {
      if (args.item.BarSize.value != undefined) {
        args.item.BarSize = args.item.BarSize.value;
      }
    }

    this.BarsClearCopy(this.gridIndex);
    let lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];

    if (lColumnName == 'BarMark') {
      let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
      lItem.BarMark = lItem.BarMark ? lItem.BarMark.toUpperCase() : '';
      this.dataViewCAB.updateItem(lItem.id, lItem);
    }

    if (lColumnName == 'ElementMark') {
      let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
      lItem.ElementMark = lItem.ElementMark
        ? lItem.ElementMark.toUpperCase()
        : '';
      this.dataViewCAB.updateItem(lItem.id, lItem);
    }

    if (lColumnName == 'Cancelled') {
      if (args.item['Cancelled'] == false) args.item['Cancelled'] = null;
      this.refreshInfo(this.gridIndex);
    }

    //clear the highlighted error
    var lClass = grid.getCellCssStyles('error_highlight');
    if (lClass == undefined) {
      lClass = {};
    }
    if (lClass != null) {
      if (lClass[args.row] != null) {
        lClass[args.row][lColumnName] = '';
        grid.setCellCssStyles('error_highlight', lClass);
        if (lColumnName.length == 1) {
          lClass[args.row]['BarLength'] = '';
          grid.setCellCssStyles('error_highlight', lClass);
        }
      }
    }

    if (lColumnName == 'BarShapeCode') {
      var lShapeCode = args.item['BarShapeCode'];

      let res = this.ShapeCodeValidator(lShapeCode);
      if (res.valid == false) {
        alert(res.msg);
        args.item[lColumnName] = '';
        return;
      }

      if (lShapeCode != null && lShapeCode != '') {
        // lShapeCode = lShapeCode.trim();
        if (lShapeCode.value != undefined) {
          lShapeCode = lShapeCode.value.trim();
          args.item.BarShapeCode = args.item.BarShapeCode.value;
        } else {
          lShapeCode = lShapeCode.trim();
        }

        if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;
        if (lShapeCode != this.gShapeCode) {
          this.loadShapeInfo(lShapeCode, this.gridIndex, args.row);
        } else {
          args.item.shapeParameters = this.gShapeParameters;
          args.item.shapeLengthFormula = this.gShapeLengthFormula;
          args.item.shapeParaValidator = this.gShapeParaValid;
          args.item.shapeTransportValidator = this.gShapeTransValid;
          args.item.shapeParaX = this.gShapeParaX;
          args.item.shapeParaY = this.gShapeParaY;
          args.item.shapeParType = this.gShapeParType;
          args.item.shapeDefaultValue = this.gShapeDefaultValue;
          args.item.shapeHeightCheck = this.gShapeHeightCheck;
          args.item.shapeAutoCalcFormula1 = this.gShapeAutoCalcFormula1;
          args.item.shapeAutoCalcFormula2 = this.gShapeAutoCalcFormula2;
          args.item.shapeAutoCalcFormula3 = this.gShapeAutoCalcFormula3;

          this.showShapeImage = true;
          $('#rightShapeImage-' + this.gridIndex).show();
          $('#btmShapeImage-' + this.gridIndex).show();
        }
        var lParameters = args.item.shapeParameters;
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
        var lBarType = 'H';
        if (args.item['BarType'] != null) {
          lBarType = args.item['BarType'];
        }
        if (lShapeCode == '061' || lShapeCode == '079') {
          if (
            args.item['BarSize'] != null &&
            (args.item['C'] == null ||
              args.item['C'] == 0 ||
              args.item['C'] == '')
          ) {
            if (
              lBarType == 'H' ||
              lBarType == 'C' ||
              lBarType == 'E' ||
              lBarType == 'N'
            ) {
              args.item['C'] = 13 * parseInt(args.item['BarSize']);
            } else {
              args.item['C'] = 12 * parseInt(args.item['BarSize']);
            }
          }
          if (
            args.item['BarSize'] != null &&
            (args.item['D'] == null ||
              args.item['D'] == 0 ||
              args.item['D'] == '')
          ) {
            if (
              lBarType == 'H' ||
              lBarType == 'C' ||
              lBarType == 'E' ||
              lBarType == 'N'
            ) {
              args.item['D'] = 13 * parseInt(args.item['BarSize']);
            } else {
              args.item['D'] = 12 * parseInt(args.item['BarSize']);
            }
          }
        }
        if (lShapeCode == '79A' && args.item['BarSize'] != null) {
          let lDia = parseInt(args.item['BarSize']);
          //if (lDia <= 16) {
          if (
            args.item['C'] == null ||
            args.item['C'] == 0 ||
            args.item['C'] == ''
          ) {
            if (
              lBarType == 'H' ||
              lBarType == 'C' ||
              lBarType == 'E' ||
              lBarType == 'N'
            ) {
              args.item['C'] = 13 * lDia;
            } else {
              args.item['C'] = 12 * lDia;
            }
          }
          //} else {
          //    alert("For shape 79A, only allow bar diameter <= 16mm."
          //        + "(对图形79A而言,仅允许钢筋直径小于或等于16mm)");
          //}
        }

        let lDia = parseInt(args.item['BarSize']);

        //Recalculate the total length
        var lTotalLength = args.item['BarLength'];
        if (lTotalLength != null && lTotalLength != '') {
          var lTotalLength = null;
          if (args.item['A'] != null && args.item['A'] > 0) {
            lTotalLength = this.calTotalLen(args.item, 'A', args.item['A']);
          } else if (args.item['B'] != null && args.item['B'] > 0) {
            lTotalLength = this.calTotalLen(args.item, 'B', args.item['B']);
          } else if (args.item['C'] != null && args.item['C'] > 0) {
            lTotalLength = this.calTotalLen(args.item, 'C', args.item['C']);
          } else if (args.item['D'] != null && args.item['D'] > 0) {
            lTotalLength = this.calTotalLen(args.item, 'D', args.item['D']);
          }

          // validate the Total Length
          args.item['BarLength'] = lTotalLength;
          var lMaxLength = this.getVarMaxValue(lTotalLength);
          var lBarSize = args.item['BarSize'];

          var lLenLimit = this.gMaxBarLength;
          if (lDia <= 8) {
            lLenLimit = 6000;
          } else if (lDia <= 16) {
            lLenLimit = 12000;
          }
          if (lMaxLength > lLenLimit) {
            let lTotalDed: any = this.getCreepDedution(lMaxLength, args.item);
            if (lMaxLength - lTotalDed > lLenLimit) {
              alert(
                'Total bar cut length is ' +
                (lMaxLength - lTotalDed) +
                ', which exceeds maximum ' +
                lLenLimit +
                ' limit (钢筋总长度已超过' +
                lLenLimit +
                '米的最大限度).'
              );
            }
          }
        }

        //Check Couple shape whether with <= 13mm bar
        if (
          lShapeCode.substring(0, 1) == 'H' ||
          lShapeCode.substring(0, 1) == 'I' ||
          lShapeCode.substring(0, 1) == 'J' ||
          lShapeCode.substring(0, 1) == 'K' ||
          lShapeCode.substring(0, 1) == 'C' ||
          lShapeCode.substring(0, 1) == 'S' ||
          lShapeCode.substring(0, 1) == 'P' ||
          lShapeCode.substring(0, 1) == 'N'
        ) {
          var lBarSize = args.item['BarSize'];
          if (lBarSize != null && lBarSize < 16) {
            alert(
              'For coupler, the smallest bar size is 16mm. (带续接器钢筋的最小直径为16mm).'
            );
          }
        }

        //Check Couple shape whether with < 40 mm X bar
        if (
          lBarType == 'X' &&
          (lShapeCode.substring(0, 1) == 'C' ||
            lShapeCode.substring(0, 1) == 'S' ||
            lShapeCode.substring(0, 1) == 'P' ||
            lShapeCode.substring(0, 1) == 'N')
        ) {
          var lBarSize = args.item['BarSize'];
          if (lBarSize != null && lBarSize < 40) {
            alert(
              'For E-Splice coupler X rebar, the smallest bar size is 40mm. (X等级E-Splice带续接器钢筋的最小直径为40mm).'
            );
          }
        }
      } else {
        this.showShapeImage = false;

        $('#rightShapeImage-' + this.gridIndex).hide();
        $('#btmShapeImage-' + this.gridIndex).hide();
      }
    }

    if (lColumnName == 'BarSize') {
      var lBarSize = args.item['BarSize'];
      if (lBarSize != null && lBarSize < 16) {
        var lShapeCode = args.item['BarShapeCode'];
        if (lShapeCode != null) {
          if (
            lShapeCode.substring(0, 1) == 'H' ||
            lShapeCode.substring(0, 1) == 'I' ||
            lShapeCode.substring(0, 1) == 'J' ||
            lShapeCode.substring(0, 1) == 'K' ||
            lShapeCode.substring(0, 1) == 'C' ||
            lShapeCode.substring(0, 1) == 'S' ||
            lShapeCode.substring(0, 1) == 'P' ||
            lShapeCode.substring(0, 1) == 'N'
          ) {
            alert(
              'For coupler, the smallest bar size is 16mm. (带续接器钢筋的最小直径为16mm).'
            );
          }
        }
      }
      if (lBarSize != null && lBarSize < 40) {
        var lShapeCode = args.item['BarShapeCode'];
        if (lShapeCode != null) {
          if (
            lShapeCode.substring(0, 1) == 'C' ||
            lShapeCode.substring(0, 1) == 'S' ||
            lShapeCode.substring(0, 1) == 'P' ||
            lShapeCode.substring(0, 1) == 'N'
          ) {
            var lBarType = 'H';
            if (args.item['BarType'] != null) {
              lBarType = args.item['BarType'];
            }
            if (lBarType == 'X') {
              alert(
                'For E-Splice coupler X rebar, the smallest bar size is 40mm. (X等级E-Splice带续接器钢筋的最小直径为40mm).'
              );
            }
          }
        }
      }
    }

    if (lColumnName == 'BarWeight') {
      let res = this.WeightValidator(args, args.item['BarWeight'], lColumnName);
      if (res.valid == false) {
        alert(res.msg);
        args.item[lColumnName] = '';
        return;
      }

      if (args.item['BarSTD'] == true) {
        if (isNaN(args.item['BarWeight']) == false) {
          this.calQty(args.item);
          this.refreshInfo(this.gridIndex);
        }
      }
    }

    //set Pin Size
    if (
      lColumnName == 'BarType' ||
      lColumnName == 'BarSize' ||
      lColumnName == 'BarShapeCode'
    ) {
      var lPar = args.item['shapeParameters'];
      if (lPar != null && lPar != '' && lPar != 'A') {
        args.item['PinSize'] = this.getPinSize(args);
      } else {
        args.item['PinSize'] = null;
      }
    }

    if (lColumnName == 'BarType' || lColumnName == 'BarSize') {
      if (args.item['BarSTD'] == true) {
        var lLength = 12000;
        if (args.item['BarType'] != null && !isNaN(args.item['BarSize'])) {
          for (let i = 0; i < this.gSBBarType.length; i++) {
            if (
              args.item['BarType'] == this.gSBBarType[i] &&
              args.item['BarSize'] == this.gSBBarSize[i]
            ) {
              if (this.gSBLength[i] <= 12000) {
                let lLength: any = this.gSBLength[i];
                break;
              }
            }
          }
        }
        if (args.item['A'] == null || args.item['A'] != lLength)
          args.item['A'] = lLength;
        if (args.item['BarLength'] == null || args.item['BarLength'] != lLength)
          args.item['BarLength'] = lLength;
        args.item['BarMemberQty'] = '';
        args.item['BarEachQty'] = '';
        args.item['BarTotalQty'] = '';
        args.item['BarWeight'] = '';
      }
    }

    if (lColumnName == 'BarSTD') {
      if (args.item['BarSTD'] == true) {
        if (
          args.item['BarShapeCode'] == null ||
          args.item['BarShapeCode'] != '20'
        )
          args.item['BarShapeCode'] = '20';

        var lLength = 12000;
        if (args.item['BarType'] != null && !isNaN(args.item['BarSize'])) {
          for (var i = 0; i < this.gSBBarType.length; i++) {
            if (
              args.item['BarType'] == this.gSBBarType[i] &&
              args.item['BarSize'] == this.gSBBarSize[i]
            ) {
              if (this.gSBLength[i] <= 12000) {
                let lLength: any = this.gSBLength[i];
                break;
              }
            }
          }
        }

        if (args.item['A'] == null || args.item['A'] != lLength)
          args.item['A'] = lLength;
        if (args.item['B'] != null) args.item['B'] = null;
        if (args.item['C'] != null) args.item['C'] = null;
        if (args.item['D'] != null) args.item['D'] = null;
        if (args.item['E'] != null) args.item['E'] = null;
        if (args.item['F'] != null) args.item['F'] = null;
        if (args.item['G'] != null) args.item['G'] = null;
        if (args.item['H'] != null) args.item['H'] = null;
        if (args.item['I'] != null) args.item['I'] = null;
        if (args.item['J'] != null) args.item['J'] = null;
        if (args.item['K'] != null) args.item['K'] = null;
        if (args.item['L'] != null) args.item['L'] = null;
        if (args.item['M'] != null) args.item['M'] = null;
        if (args.item['N'] != null) args.item['N'] = null;
        if (args.item['O'] != null) args.item['O'] = null;
        if (args.item['P'] != null) args.item['P'] = null;
        if (args.item['Q'] != null) args.item['Q'] = null;
        if (args.item['R'] != null) args.item['R'] = null;
        if (args.item['S'] != null) args.item['S'] = null;
        if (args.item['T'] != null) args.item['T'] = null;
        if (args.item['U'] != null) args.item['U'] = null;
        if (args.item['V'] != null) args.item['V'] = null;
        if (args.item['W'] != null) args.item['W'] = null;
        if (args.item['X'] != null) args.item['X'] = null;
        if (args.item['Y'] != null) args.item['Y'] = null;
        if (args.item['Z'] != null) args.item['Z'] = null;
        if (args.item['BarLength'] == null || args.item['BarLength'] != lLength)
          args.item['BarLength'] = lLength;
        args.item['BarMemberQty'] = '';
        args.item['BarEachQty'] = '';
        args.item['BarTotalQty'] = '';
        args.item['BarWeight'] = '';
        args.item['PinSize'] = null;
        this.refreshInfo(this.gridIndex);
      }
      else {
        args.item['BarMemberQty'] = args.item['BarMemberQty'] ? args.item['BarMemberQty'] : '';
        args.item['BarEachQty'] = args.item['BarEachQty'] ? args.item['BarEachQty'] : '';
        args.item['BarTotalQty'] = args.item['BarTotalQty'] ? args.item['BarTotalQty'] : '';
        args.item['BarWeight'] = args.item['BarWeight'] ? args.item['BarWeight'] : '';
      }

      if (args.item['BarSTD'] == false) args.item['BarSTD'] = null;
    }

    if (lColumnName == 'BarMemberQty' || lColumnName == 'BarEachQty') {
      var lMQty = args.item['BarMemberQty'];
      var lEQty = args.item['BarEachQty'];
      if (lColumnName == 'BarMemberQty' && !isNaN(lMQty) && lMQty > 1000) {
        alert('Are you sure Member Qty is ' + lMQty + '?');
      }
      if (lColumnName == 'BarEachQty' && !isNaN(lEQty) && lEQty > 1000) {
        alert('Are you sure Member Qty is ' + lEQty + '?');
      }
      if (!isNaN(lMQty) && !isNaN(lEQty)) {
        args.item['BarTotalQty'] = lMQty * lEQty;
      }
    }

    if (lColumnName == 'BarMemberQty') {
      let lLength: any = args.item['BarLength'];
      if (lLength != null && isNaN(lLength) && lLength.indexOf('-') > 0) {
        var lMQty = args.item['BarMemberQty'];
        var lEQty = args.item['BarEachQty'];
        if (lMQty <= 1) {
          alert(
            'Member Qty should be greater than 1 for varied length bars.' +
            '(对变长钢筋而言,构建数应该大于1)'
          );
        } else if (lEQty != null && lEQty > 0 && lEQty > lMQty) {
          alert(
            'Warning! Please check if Member Qty value is correct. For various bar, normally the Member Qty should greater than Each qty.' +
            '(请注意! 请检查构建数值. 对变长钢筋,一般而言, 构建数应该大于单件数.)'
          );

          var lClass = args.grid.getCellCssStyles('error_highlight');
          if (lClass == undefined) {
            lClass = {};
          }
          lClass[args.row] = {};
          lClass[args.row]['BarMemberQty'] = 'highlightedYellow';
          args.grid.setCellCssStyles('error_highlight', lClass);
        } else {
          var lPar = args.item['shapeParameters'];
          var lDia = args.item['BarSize'];
          var lClass = grid.getCellCssStyles('error_highlight');
          if (lClass == undefined) {
            lClass = {};
          }
          if (lClass != null) {
            if (lPar != null && lPar != '') {
              var lParAR = lPar.split(',');
              if (lParAR.length > 0) {
                for (i = 0; i < lParAR.length; i++) {
                  if (
                    args.item[lParAR[i]] != null &&
                    isNaN(args.item[lParAR[i]]) &&
                    args.item[lParAR[i]].indexOf('-') > 0
                  ) {
                    var msgRef = { msg: '' };
                    if (
                      this.isValidValue(
                        lParAR[i],
                        lPar,
                        lDia,
                        args.item[lParAR[i]],
                        args.item,
                        msgRef,
                        0
                      ) == true
                    ) {
                      if (
                        lClass[args.row] != null &&
                        lClass[args.row][lParAR[i]] != null &&
                        lClass[args.row][lParAR[i]] == 'highlighted'
                      ) {
                        lClass[args.row][lParAR[i]] = '';
                        grid.setCellCssStyles('error_highlight', lClass);
                      }
                    } else {
                      if (
                        lClass[args.row] == null ||
                        lClass[args.row][lParAR[i]] == null ||
                        lClass[args.row][lParAR[i]] != 'highlighted'
                      ) {
                        if (lClass[args.row] == null) {
                          lClass[args.row] = {};
                        }
                        lClass[args.row][lParAR[i]] = 'highlighted';
                        grid.setCellCssStyles('error_highlight', lClass);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (lColumnName.length == 1) {
      // Calculate
      //1.Calculate the dependant parameters
      var lValue = args.item[lColumnName];
      let res: any = this.parameterValidator(args, lValue, lColumnName);
      // { valid: true, msg: null }
      if (res.valid == false) {
        alert(res.msg);
        args.item[lColumnName] = '';
        return;
      }

      if (lValue != '' || lValue != '0') {
        var lPar = args.item['shapeParameters'];
        if (lPar != null && lPar != '' && lPar != 'A') {
          if (
            args.item['PinSize'] == null &&
            args.item['BarShapeCode'] != null
          ) {
            args.item['PinSize'] = this.getPinSize(args);
          }

          this.calDependValue(
            this.gridIndex,
            lColumnName,
            args.item['shapeParameters'],
            args.item['BarSize'],
            args.item[lColumnName],
            args.item
          );
        }
        if (lValue.indexOf('-') > 0) {
          var lMQty = args.item['BarMemberQty'];
          var lEQty = args.item['BarEachQty'];
          if (lMQty == null) {
            lMQty = 0;
          }
          if (lEQty == null) {
            lEQty = 0;
          }
          if (lMQty <= 1) {
            alert(
              'Member Qty should be greater than 1 for varied length bars.' +
              '(对变长钢筋而言,构建数应该大于1)'
            );
            var lClass = args.grid.getCellCssStyles('error_highlight');
            if (lClass == undefined) {
              lClass = {};
            }
            lClass[args.row] = {};
            lClass[args.row]['BarMemberQty'] = 'highlighted';
            args.grid.setCellCssStyles('error_highlight', lClass);
          } else if (lEQty != null && lEQty > 0 && lEQty > lMQty) {
            alert(
              'Warning! Please check if Member Qty value is correct. For various bar, normally the Member Qty should be greater than Each qty.' +
              '(请注意! 请检查构建数值. 对变长钢筋,一般而言, 构建数应该大于单件数.)'
            );

            var lClass = args.grid.getCellCssStyles('error_highlight');
            if (lClass == undefined) {
              lClass = {};
            }
            lClass[args.row] = {};
            lClass[args.row]['BarMemberQty'] = 'highlightedYellow';
            args.grid.setCellCssStyles('error_highlight', lClass);
          }
          if (
            this.gVarianceBarSplit == 'Y' &&
            lEQty * lMQty >= 5 &&
            this.getNoVariousBar(args.grid.getData(), 9999) > 26
          ) {
            alert(
              'Warning! Have reached the maximum number of various bar items limit 26. Please create another order / BBS to split the BBS.' +
              '(请注意! 已达到变长钢筋的最大行数限制26。请创建另一个订单/BBS来拆分此BBS.'
            );

            var lClass = args.grid.getCellCssStyles('error_highlight');
            if (lClass == undefined) {
              lClass = {};
            }
            lClass[args.row] = {};
            lClass[args.row][lPar] = 'highlighted';
            args.grid.setCellCssStyles('error_highlight', lClass);
          }
        }
      }
      //2.Validate transport limit
      var lValidTransport = this.ValidTransport(args);
      // return 0 -- OK, 1 -- Low Bed, 2 -- Low Bed need police escort
      if (lValidTransport == 0) {
        if (
          args.item['Remarks'] == 'Low Bed' ||
          args.item['Remarks'] == 'Escort' ||
          args.item['Remarks'] == '>7m'
        ) {
          args.item['Remarks'] = '';
        }
        //
      }
      if (lValidTransport == 1) {
        args.item['Remarks'] = 'Low Bed';
        alert(
          'The product size exceeds its normal transport maximum width 2400mm. Need low bed transportation.' +
          '(此产品的尺寸已超出一般运输工具的最大宽度2400mm, 需要超大件低盘拖车来运载您的钢筋)'
        );
        //args.grid.focus();
        //args.grid.editActiveCell();
      }
      if (lValidTransport == 2) {
        args.item['Remarks'] = 'Escort';
        alert(
          'The product size exceeds its transport maximum width 3300mm. Low bed transportation need police escort.' +
          '(此产品的尺寸已超出一般运输方式的最大宽度3200mm, 需要交警护送的超大件低盘拖车来运载您的钢筋)'
        );
        //args.grid.focus();
        //args.grid.editActiveCell();
      }
      let lTransportMode = this.lTransportMode; //TEMPORARY
      if (lTransportMode == 'HC') {
        if (lValidTransport == 3) {
          args.item['Remarks'] = '>7m';
          alert(
            'The product size exceeds its Hiap Crane maximum length 7000mm. Please remenber to change transport mode.' +
            '(此钢筋已超出起重货车的限制的最大长度7000mm, 请更正运输方式.)'
          );
          //args.grid.focus();
          //args.grid.editActiveCell();
          lValidTransport = 0;
        }
      }
      args.item['shapeTransport'] = lValidTransport;

      var lTotalLength = this.calTotalLen(
        args.item,
        lColumnName,
        args.item[lColumnName]
      );
      // validate the Total Length
      args.item['BarLength'] = lTotalLength;
      var lMaxLength = this.getVarMaxValue(lTotalLength);
      var lBarSize = args.item['BarSize'];

      var lLenLimit = this.gMaxBarLength;
      if (lDia <= 8) {
        lLenLimit = 6000;
      } else if (lDia <= 16) {
        lLenLimit = 12000;
      }
      if (lMaxLength > lLenLimit) {
        let lTotalDed: any = this.getCreepDedution(lMaxLength, args.item);
        if (lMaxLength - lTotalDed > lLenLimit) {
          alert(
            'Total bar cut length is ' +
            (lMaxLength - lTotalDed) +
            ', which exceeds maximum ' +
            lLenLimit +
            ' limit (钢筋总长度已超过' +
            lLenLimit +
            '米的最大限度).'
          );
        }
      }

      this.displayShapeImage(this.gridIndex, grid.getActiveCell().row);
    }

    if (
      lColumnName == 'BarMemberQty' ||
      lColumnName == 'BarEachQty' ||
      lColumnName.length == 1 ||
      lColumnName == 'BarSize'
    ) {
      args.item['BarWeight'] = this.calWeight(args.item);
      this.refreshInfo(this.gridIndex);
    }

    let dataView = this.dataViewCAB;
    dataView.beginUpdate();

    dataView.updateItem(args.item.id, args.item);
    dataView.endUpdate();
    this.barChangeInd[this.gridIndex] = this.barChangeInd[this.gridIndex] + 1;
    this.barRowIndex[this.gridIndex] = grid.getActiveCell().row;
    args.grid.focus();
  }
  grid_onAddNewRow(e: any, args: any) {
    let lNewBar = 0;

    let grid = this.templateGrid.slickGrid;
    let dataView = this.dataViewCAB;
    //Need more testing as user feedback cannot move down

    //if (grid.getActiveCell().row != null && grid.getActiveCell().row >= 0) {
    //    var lPreIndex = grid.getActiveCell().row - 1;
    //    if (lPreIndex >= 0) {
    //        if (args.grid.getDataItem(lPreIndex).newBarRecord != null) {
    //            lNewBar = args.grid.getDataItem(lPreIndex).newBarRecord;
    //        }
    //    }
    //}
    if (lNewBar == 0) {
      this.getShapeFinderReset(this.gridIndex);
      //if (lRowIndex != grid.getActiveCell().row) {
      //    SaveBarDetails(gridIndex, barRowIndex[gridIndex]); //Tab#, Row#
      //}
      var lRowIndex = 1;
      if (grid.getActiveCell().row != null && grid.getActiveCell().row >= 0) {
        lRowIndex = grid.getActiveCell().row + 1;
      }
      var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
      var lProjectCode = this.ProjectCode; //document.getElementById("ProjectCode").value;
      var lJobID = this.JobID; //document.getElementById("OrderNo").value;

      var lBBS = 1;
      // var lBBS = $("#tabs").tabs('option', 'active');
      var lBarID = this.getBarID(lRowIndex, dataView);
      var item = args.item;
      //item.id = lRowIndex - 1;
      item.CustomerCode = lCustomerCode.toString();
      item.ProjectCode = lProjectCode.toString();
      item.JobID = lJobID;
      item.BBSID = this.BBSId; //this.getBBSID(lBBS - 1);
      item.BarID = lBarID;
      item.BarSort = lRowIndex * 1000;
      item.BBSNo = $($('#tabs li')[lBBS]).text();
      item.id = lRowIndex;
      item.newBarRecord = 1;
      if (item.Cancelled == false) item.Cancelled = null;
      if (item.BarSTD == false) item.BarSTD = null;

      if (
        (item.ElementMark != null && item.ElementMark != '') ||
        (item.BarMark != null && item.BarMark != '')
      ) {
        this.barChangeInd[this.gridIndex] =
          this.barChangeInd[this.gridIndex] + 1;
      }

      if (lRowIndex > 1) {
        var lEleMark = args.grid.getDataItem(lRowIndex - 2).ElementMark;
        if (
          lEleMark != null &&
          lEleMark != '' &&
          (item.ElementMark == null || item.ElementMark == '')
        ) {
          item.ElementMark = lEleMark;
        }

        var lGrade = args.grid.getDataItem(lRowIndex - 2).BarType;
        if (
          lGrade != null &&
          lGrade != '' &&
          (item.BarType == null || item.BarType == '')
        ) {
          item.BarType = lGrade;
        }

        var lBarMark = args.grid.getDataItem(lRowIndex - 2).BarMark;
        if (
          lBarMark != null &&
          lBarMark != '' &&
          (item.BarMark == null || item.BarMark == '')
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
          if (lBarMark1.length > 8) {
            lBarMark1 = lBarMark1.substring(1);
          }
          item.BarMark = lBarMark1;
        }

        var lBarSort = args.grid.getDataItem(lRowIndex - 2).BarSort;
        if (lBarSort != null && lBarSort > 0) {
          item.BarSort = lBarSort + 1000;
        }
      }
      if (item.ElementMark == null) {
        item.ElementMark == '';
      }
      if (item.BarType == null) {
        item.BarType == '';
      }
      if (item.BarMark == null) {
        item.BarMark == '';
      }
      //$.extend(item, args.item);
      dataView.beginUpdate();
      dataView.addItem(item);
      dataView.endUpdate();

      //barChangeInd[gridIndex] = barChangeInd[gridIndex] + 1;
      this.barRowIndex[this.gridIndex] = grid.getActiveCell().row;
      this.gPreCellRow = grid.getActiveCell().row;

      this.BarsClearCopy(this.gridIndex);
    }
    //Testing insert function
    //if (lRowIndex == 2) { InsertColumn("Q") }

    let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
    let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
    lItem.BarMark = lItem.BarMark ? lItem.BarMark.toUpperCase() : '';
    // lItem.BarType =

    if (lItem.BarShapeCode) {
      if (lItem.BarShapeCode.value != undefined) {
        lItem.BarShapeCode = lItem.BarShapeCode.value;
      }
    }
    if (lItem.BarType) {
      if (lItem.BarType.value != undefined) {
        lItem.BarType = lItem.BarType.value;
      }
    }
    if (lItem.BarSize) {
      if (lItem.BarSize.value != undefined) {
        lItem.BarSize = lItem.BarSize.value;
      }
    }

    // this.dataViewCAB.updateItem(lItem.id, lItem);

    // let rowNum = (this.templateGrid.slickGrid.getActiveCell().row);
    // let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
    lItem.ElementMark = lItem.ElementMark
      ? lItem.ElementMark.toUpperCase()
      : '';
    this.dataViewCAB.updateItem(lItem.id, lItem);
  }

  calTotalLen(pItem: any, pColumnName: any, pValue: any) {
    var lItem = JSON.parse(JSON.stringify(pItem));
    var lF = pItem['shapeLengthFormula'];
    var lResult = pItem['BarLength'];
    var lColumnName = pColumnName;
    var lVarMax = 0;
    var lVarMin = 0;
    if (
      (lF == null || lF == '') &&
      (pItem['BarShapeCode'] == '020' || pItem['BarShapeCode'] == '20')
    ) {
      lF = 'A';
      pItem['shapeLengthFormula'] = 'A';
    }
    if (lF != null) {
      if (lF != '') {
        if (
          (lColumnName == 'A' && lF.indexOf('A') >= 0) ||
          (lColumnName == 'B' && lF.indexOf('B') >= 0) ||
          (lColumnName == 'C' && lF.indexOf('C') >= 0) ||
          (lColumnName == 'D' && lF.indexOf('D') >= 0) ||
          (lColumnName == 'E' && lF.indexOf('E') >= 0) ||
          (lColumnName == 'F' && lF.indexOf('F') >= 0) ||
          (lColumnName == 'G' && lF.indexOf('G') >= 0) ||
          (lColumnName == 'H' && lF.indexOf('H') >= 0) ||
          (lColumnName == 'I' && lF.indexOf('I') >= 0) ||
          (lColumnName == 'J' && lF.indexOf('J') >= 0) ||
          (lColumnName == 'K' && lF.indexOf('K') >= 0) ||
          (lColumnName == 'L' && lF.indexOf('L') >= 0) ||
          (lColumnName == 'M' && lF.indexOf('M') >= 0) ||
          (lColumnName == 'N' && lF.indexOf('N') >= 0) ||
          (lColumnName == 'O' && lF.indexOf('O') >= 0) ||
          (lColumnName == 'P' && lF.indexOf('P') >= 0) ||
          (lColumnName == 'Q' && lF.indexOf('Q') >= 0) ||
          (lColumnName == 'R' && lF.indexOf('R') >= 0) ||
          (lColumnName == 'S' && lF.indexOf('S') >= 0) ||
          (lColumnName == 'T' && lF.indexOf('T') >= 0) ||
          (lColumnName == 'U' && lF.indexOf('U') >= 0) ||
          (lColumnName == 'V' && lF.indexOf('V') >= 0) ||
          (lColumnName == 'W' && lF.indexOf('W') >= 0) ||
          (lColumnName == 'X' && lF.indexOf('X') >= 0) ||
          (lColumnName == 'Y' && lF.indexOf('Y') >= 0) ||
          (lColumnName == 'Z' && lF.indexOf('Z') >= 0)
        ) {
          lItem[pColumnName] = pValue;
          if (lF.indexOf('A') >= 0)
            if (isNaN(lItem['A']) || lItem['A'] == null)
              lF = lF.replace(
                new RegExp('A', 'g'),
                this.getVarValue1(lItem['A'])
              );
            else lF = lF.replace(new RegExp('A', 'g'), lItem['A']);
          if (lF.indexOf('B') >= 0)
            if (isNaN(lItem['B']) || lItem['B'] == null)
              lF = lF.replace(
                new RegExp('B', 'g'),
                this.getVarValue1(lItem['B'])
              );
            else lF = lF.replace(new RegExp('B', 'g'), lItem['B']);
          if (lF.indexOf('C') >= 0)
            if (isNaN(lItem['C']) || lItem['C'] == null)
              lF = lF.replace(
                new RegExp('C', 'g'),
                this.getVarValue1(lItem['C'])
              );
            else lF = lF.replace(new RegExp('C', 'g'), lItem['C']);
          if (lF.indexOf('D') >= 0)
            if (isNaN(lItem['D']) || lItem['D'] == null)
              lF = lF.replace(
                new RegExp('D', 'g'),
                this.getVarValue1(lItem['D'])
              );
            else lF = lF.replace(new RegExp('D', 'g'), lItem['D']);
          if (lF.indexOf('E') >= 0)
            if (isNaN(lItem['E']) || lItem['E'] == null)
              lF = lF.replace(
                new RegExp('E', 'g'),
                this.getVarValue1(lItem['E'])
              );
            else lF = lF.replace(new RegExp('E', 'g'), lItem['E']);
          if (lF.indexOf('F') >= 0)
            if (isNaN(lItem['F']) || lItem['F'] == null)
              lF = lF.replace(
                new RegExp('F', 'g'),
                this.getVarValue1(lItem['F'])
              );
            else lF = lF.replace(new RegExp('F', 'g'), lItem['F']);
          if (lF.indexOf('G') >= 0)
            if (isNaN(lItem['G']) || lItem['G'] == null)
              lF = lF.replace(
                new RegExp('G', 'g'),
                this.getVarValue1(lItem['G'])
              );
            else lF = lF.replace(new RegExp('G', 'g'), lItem['G']);
          if (lF.indexOf('H') >= 0)
            if (isNaN(lItem['H']) || lItem['H'] == null)
              lF = lF.replace(
                new RegExp('H', 'g'),
                this.getVarValue1(lItem['H'])
              );
            else lF = lF.replace(new RegExp('H', 'g'), lItem['H']);
          if (lF.indexOf('I') >= 0)
            if (isNaN(lItem['I']) || lItem['I'] == null)
              lF = lF.replace(
                new RegExp('I', 'g'),
                this.getVarValue1(lItem['I'])
              );
            else lF = lF.replace(new RegExp('I', 'g'), lItem['I']);
          if (lF.indexOf('J') >= 0)
            if (isNaN(lItem['J']) || lItem['J'] == null)
              lF = lF.replace(
                new RegExp('J', 'g'),
                this.getVarValue1(lItem['J'])
              );
            else lF = lF.replace(new RegExp('J', 'g'), lItem['J']);
          if (lF.indexOf('K') >= 0)
            if (isNaN(lItem['K']) || lItem['K'] == null)
              lF = lF.replace(
                new RegExp('K', 'g'),
                this.getVarValue1(lItem['K'])
              );
            else lF = lF.replace(new RegExp('K', 'g'), lItem['K']);
          if (lF.indexOf('L') >= 0)
            if (isNaN(lItem['L']) || lItem['L'] == null)
              lF = lF.replace(
                new RegExp('L', 'g'),
                this.getVarValue1(lItem['L'])
              );
            else lF = lF.replace(new RegExp('L', 'g'), lItem['L']);
          if (lF.indexOf('M') >= 0)
            if (isNaN(lItem['M']) || lItem['M'] == null)
              lF = lF.replace(
                new RegExp('M', 'g'),
                this.getVarValue1(lItem['M'])
              );
            else lF = lF.replace(new RegExp('M', 'g'), lItem['M']);
          if (lF.indexOf('N') >= 0)
            if (isNaN(lItem['N']) || lItem['N'] == null)
              lF = lF.replace(
                new RegExp('N', 'g'),
                this.getVarValue1(lItem['N'])
              );
            else lF = lF.replace(new RegExp('N', 'g'), lItem['N']);
          if (lF.indexOf('O') >= 0)
            if (isNaN(lItem['O']) || lItem['O'] == null)
              lF = lF.replace(
                new RegExp('O', 'g'),
                this.getVarValue1(lItem['O'])
              );
            else lF = lF.replace(new RegExp('O', 'g'), lItem['O']);
          if (lF.indexOf('P') >= 0)
            if (isNaN(lItem['P']) || lItem['P'] == null)
              lF = lF.replace(
                new RegExp('P', 'g'),
                this.getVarValue1(lItem['P'])
              );
            else lF = lF.replace(new RegExp('P', 'g'), lItem['P']);
          if (lF.indexOf('Q') >= 0)
            if (isNaN(lItem['Q']) || lItem['Q'] == null)
              lF = lF.replace(
                new RegExp('Q', 'g'),
                this.getVarValue1(lItem['Q'])
              );
            else lF = lF.replace(new RegExp('Q', 'g'), lItem['Q']);
          if (lF.indexOf('R') >= 0)
            if (isNaN(lItem['R']) || lItem['R'] == null)
              lF = lF.replace(
                new RegExp('R', 'g'),
                this.getVarValue1(lItem['R'])
              );
            else lF = lF.replace(new RegExp('R', 'g'), lItem['R']);
          if (lF.indexOf('S') >= 0)
            if (isNaN(lItem['S']) || lItem['S'] == null)
              lF = lF.replace(
                new RegExp('S', 'g'),
                this.getVarValue1(lItem['S'])
              );
            else lF = lF.replace(new RegExp('S', 'g'), lItem['S']);
          if (lF.indexOf('T') >= 0)
            if (isNaN(lItem['T']) || lItem['T'] == null)
              lF = lF.replace(
                new RegExp('T', 'g'),
                this.getVarValue1(lItem['T'])
              );
            else lF = lF.replace(new RegExp('T', 'g'), lItem['T']);
          if (lF.indexOf('U') >= 0)
            if (isNaN(lItem['U']) || lItem['U'] == null)
              lF = lF.replace(
                new RegExp('U', 'g'),
                this.getVarValue1(lItem['U'])
              );
            else lF = lF.replace(new RegExp('U', 'g'), lItem['U']);
          if (lF.indexOf('V') >= 0)
            if (isNaN(lItem['V']) || lItem['V'] == null)
              lF = lF.replace(
                new RegExp('V', 'g'),
                this.getVarValue1(lItem['V'])
              );
            else lF = lF.replace(new RegExp('V', 'g'), lItem['V']);
          if (lF.indexOf('W') >= 0)
            if (isNaN(lItem['W']) || lItem['W'] == null)
              lF = lF.replace(
                new RegExp('W', 'g'),
                this.getVarValue1(lItem['W'])
              );
            else lF = lF.replace(new RegExp('W', 'g'), lItem['W']);
          if (lF.indexOf('X') >= 0)
            if (isNaN(lItem['X']) || lItem['X'] == null)
              lF = lF.replace(
                new RegExp('X', 'g'),
                this.getVarValue1(lItem['X'])
              );
            else lF = lF.replace(new RegExp('X', 'g'), lItem['X']);
          if (lF.indexOf('Y') >= 0)
            if (isNaN(lItem['Y']) || lItem['Y'] == null)
              lF = lF.replace(
                new RegExp('Y', 'g'),
                this.getVarValue1(lItem['Y'])
              );
            else lF = lF.replace(new RegExp('Y', 'g'), lItem['Y']);
          if (lF.indexOf('Z') >= 0)
            if (isNaN(lItem['Z']) || lItem['Z'] == null)
              lF = lF.replace(
                new RegExp('Z', 'g'),
                this.getVarValue1(lItem['Z'])
              );
            else lF = lF.replace(new RegExp('Z', 'g'), lItem['Z']);
          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');
          lVarMax = math.evaluate(lF);
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMax = lVarMax + getVarMaxValue(pValue);
          //}
          //else {
          //    lVarMax = lVarMax - getVarMaxValue(lItem[lColumnName]) + getVarMaxValue(pValue);
          //}

          lF = pItem['shapeLengthFormula'];
          if (lF.indexOf('A') >= 0)
            if (isNaN(lItem['A']) || lItem['A'] == null)
              lF = lF.replace(
                new RegExp('A', 'g'),
                this.getVarValue2(lItem['A'])
              );
            else lF = lF.replace(new RegExp('A', 'g'), lItem['A']);
          if (lF.indexOf('B') >= 0)
            if (isNaN(lItem['B']) || lItem['B'] == null)
              lF = lF.replace(
                new RegExp('B', 'g'),
                this.getVarValue2(lItem['B'])
              );
            else lF = lF.replace(new RegExp('B', 'g'), lItem['B']);
          if (lF.indexOf('C') >= 0)
            if (isNaN(lItem['C']) || lItem['C'] == null)
              lF = lF.replace(
                new RegExp('C', 'g'),
                this.getVarValue2(lItem['C'])
              );
            else lF = lF.replace(new RegExp('C', 'g'), lItem['C']);
          if (lF.indexOf('D') >= 0)
            if (isNaN(lItem['D']) || lItem['D'] == null)
              lF = lF.replace(
                new RegExp('D', 'g'),
                this.getVarValue2(lItem['D'])
              );
            else lF = lF.replace(new RegExp('D', 'g'), lItem['D']);
          if (lF.indexOf('E') >= 0)
            if (isNaN(lItem['E']) || lItem['E'] == null)
              lF = lF.replace(
                new RegExp('E', 'g'),
                this.getVarValue2(lItem['E'])
              );
            else lF = lF.replace(new RegExp('E', 'g'), lItem['E']);
          if (lF.indexOf('F') >= 0)
            if (isNaN(lItem['F']) || lItem['F'] == null)
              lF = lF.replace(
                new RegExp('F', 'g'),
                this.getVarValue2(lItem['F'])
              );
            else lF = lF.replace(new RegExp('F', 'g'), lItem['F']);
          if (lF.indexOf('G') >= 0)
            if (isNaN(lItem['G']) || lItem['G'] == null)
              lF = lF.replace(
                new RegExp('G', 'g'),
                this.getVarValue2(lItem['G'])
              );
            else lF = lF.replace(new RegExp('G', 'g'), lItem['G']);
          if (lF.indexOf('H') >= 0)
            if (isNaN(lItem['H']) || lItem['H'] == null)
              lF = lF.replace(
                new RegExp('H', 'g'),
                this.getVarValue2(lItem['H'])
              );
            else lF = lF.replace(new RegExp('H', 'g'), lItem['H']);
          if (lF.indexOf('I') >= 0)
            if (isNaN(lItem['I']) || lItem['I'] == null)
              lF = lF.replace(
                new RegExp('I', 'g'),
                this.getVarValue2(lItem['I'])
              );
            else lF = lF.replace(new RegExp('I', 'g'), lItem['I']);
          if (lF.indexOf('J') >= 0)
            if (isNaN(lItem['J']) || lItem['J'] == null)
              lF = lF.replace(
                new RegExp('J', 'g'),
                this.getVarValue2(lItem['J'])
              );
            else lF = lF.replace(new RegExp('J', 'g'), lItem['J']);
          if (lF.indexOf('K') >= 0)
            if (isNaN(lItem['K']) || lItem['K'] == null)
              lF = lF.replace(
                new RegExp('K', 'g'),
                this.getVarValue2(lItem['K'])
              );
            else lF = lF.replace(new RegExp('K', 'g'), lItem['K']);
          if (lF.indexOf('L') >= 0)
            if (isNaN(lItem['L']) || lItem['L'] == null)
              lF = lF.replace(
                new RegExp('L', 'g'),
                this.getVarValue2(lItem['L'])
              );
            else lF = lF.replace(new RegExp('L', 'g'), lItem['L']);
          if (lF.indexOf('M') >= 0)
            if (isNaN(lItem['M']) || lItem['M'] == null)
              lF = lF.replace(
                new RegExp('M', 'g'),
                this.getVarValue2(lItem['M'])
              );
            else lF = lF.replace(new RegExp('M', 'g'), lItem['M']);
          if (lF.indexOf('N') >= 0)
            if (isNaN(lItem['N']) || lItem['N'] == null)
              lF = lF.replace(
                new RegExp('N', 'g'),
                this.getVarValue2(lItem['N'])
              );
            else lF = lF.replace(new RegExp('N', 'g'), lItem['N']);
          if (lF.indexOf('O') >= 0)
            if (isNaN(lItem['O']) || lItem['O'] == null)
              lF = lF.replace(
                new RegExp('O', 'g'),
                this.getVarValue2(lItem['O'])
              );
            else lF = lF.replace(new RegExp('O', 'g'), lItem['O']);
          if (lF.indexOf('P') >= 0)
            if (isNaN(lItem['P']) || lItem['P'] == null)
              lF = lF.replace(
                new RegExp('P', 'g'),
                this.getVarValue2(lItem['P'])
              );
            else lF = lF.replace(new RegExp('P', 'g'), lItem['P']);
          if (lF.indexOf('Q') >= 0)
            if (isNaN(lItem['Q']) || lItem['Q'] == null)
              lF = lF.replace(
                new RegExp('Q', 'g'),
                this.getVarValue2(lItem['Q'])
              );
            else lF = lF.replace(new RegExp('Q', 'g'), lItem['Q']);
          if (lF.indexOf('R') >= 0)
            if (isNaN(lItem['R']) || lItem['R'] == null)
              lF = lF.replace(
                new RegExp('R', 'g'),
                this.getVarValue2(lItem['R'])
              );
            else lF = lF.replace(new RegExp('R', 'g'), lItem['R']);
          if (lF.indexOf('S') >= 0)
            if (isNaN(lItem['S']) || lItem['S'] == null)
              lF = lF.replace(
                new RegExp('S', 'g'),
                this.getVarValue2(lItem['S'])
              );
            else lF = lF.replace(new RegExp('S', 'g'), lItem['S']);
          if (lF.indexOf('T') >= 0)
            if (isNaN(lItem['T']) || lItem['T'] == null)
              lF = lF.replace(
                new RegExp('T', 'g'),
                this.getVarValue2(lItem['T'])
              );
            else lF = lF.replace(new RegExp('T', 'g'), lItem['T']);
          if (lF.indexOf('U') >= 0)
            if (isNaN(lItem['U']) || lItem['U'] == null)
              lF = lF.replace(
                new RegExp('U', 'g'),
                this.getVarValue2(lItem['U'])
              );
            else lF = lF.replace(new RegExp('U', 'g'), lItem['U']);
          if (lF.indexOf('V') >= 0)
            if (isNaN(lItem['V']) || lItem['V'] == null)
              lF = lF.replace(
                new RegExp('V', 'g'),
                this.getVarValue2(lItem['V'])
              );
            else lF = lF.replace(new RegExp('V', 'g'), lItem['V']);
          if (lF.indexOf('W') >= 0)
            if (isNaN(lItem['W']) || lItem['W'] == null)
              lF = lF.replace(
                new RegExp('W', 'g'),
                this.getVarValue2(lItem['W'])
              );
            else lF = lF.replace(new RegExp('W', 'g'), lItem['W']);
          if (lF.indexOf('X') >= 0)
            if (isNaN(lItem['X']) || lItem['X'] == null)
              lF = lF.replace(
                new RegExp('X', 'g'),
                this.getVarValue2(lItem['X'])
              );
            else lF = lF.replace(new RegExp('X', 'g'), lItem['X']);
          if (lF.indexOf('Y') >= 0)
            if (isNaN(lItem['Y']) || lItem['Y'] == null)
              lF = lF.replace(
                new RegExp('Y', 'g'),
                this.getVarValue2(lItem['Y'])
              );
            else lF = lF.replace(new RegExp('Y', 'g'), lItem['Y']);
          if (lF.indexOf('Z') >= 0)
            if (isNaN(lItem['Z']) || lItem['Z'] == null)
              lF = lF.replace(
                new RegExp('Z', 'g'),
                this.getVarValue2(lItem['Z'])
              );
            else lF = lF.replace(new RegExp('Z', 'g'), lItem['Z']);
          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');
          lVarMin = math.evaluate(lF);
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMin = lVarMin + getVarMinValue(pValue);
          //}
          //else {
          //    lVarMin = lVarMin - getVarMinValue(lItem[lColumnName]) + getVarMinValue(pValue);
          //}

          lVarMin = Math.round(lVarMin);
          lVarMax = Math.round(lVarMax);

          if (lVarMin == 0 || lVarMin == lVarMax) {
            lResult = lVarMax;
          } else {
            lResult = lVarMax + '-' + lVarMin;
          }
        }
      }
    }
    return lResult;
  }

  getBarID(pRowIndex: any, pDataView: any) {
    let lBarID = pRowIndex;
    for (let i = 0; i < pDataView.getLength(); i++) {
      if (lBarID <= pDataView.getItem(i)['BarID']) {
        lBarID = pDataView.getItem(i)['BarID'] + 1;
      }
    }
    return lBarID;
  }

  getBBSID(pRowNo: any) {
    let lBBSID = 0;
    let grid = this.templateGrid.slickGrid;
    if (grid != null) {
      if (grid.getDataItem(pRowNo) != null) {
        lBBSID = grid.getDataItem(pRowNo).BBSID;
      }
    }
    return lBBSID;
  }

  grid_onSelectedRowsChanged(e: any, args: any) {
    let dataViewArray = this.dataViewCAB;
    let gridArray = this.templateGrid.slickGrid;

    this.getShapeFinderReset(this.gridIndex);
    if (args.rows.length > 0) {
      if (args.rows[0] != this.barRowIndex[this.gridIndex]) {
        this.SaveBarDetails(this.gridIndex, this.barRowIndex[this.gridIndex]); //Tab#, Row#
        this.displayShapeImage(this.gridIndex, args.rows[0]);

        var lData = dataViewArray.getItem(this.barRowIndex[this.gridIndex]);
        if (lData != null) {
          var lShape = lData.BarShapeCode;
          var lDia = lData.BarSize;
          var lLength = lData.BarLength;
          var lMinLength = this.getVarMinValue(lLength);

          if (
            lDia >= 40 &&
            lShape != '20' &&
            lShape != '020' &&
            lMinLength < 800
          ) {
            let lTotalDed: any = this.creepDeduction(lMinLength, lData); //await this.getCreepDedution(lMinLength, lData);
            if (lMinLength - lTotalDed < 500) {
              let lClass: any = {};
              lClass[this.barRowIndex[this.gridIndex]] = {};
              lClass[this.barRowIndex[this.gridIndex]]['BarLength'] =
                'highlighted';
              // gridArray[this.gridIndex].setCellCssStyles("error_highlight", lClass);
              gridArray.setCellCssStyles('error_highlight', lClass);
              alert(
                'Total bar cut length is ' +
                (lMinLength - lTotalDed) +
                ', which is less than minimum value 500mm. \n\n' +
                '钢筋的长度已小于最小值500mm.'
              );
            }
          }
        }
      }

      //goto second column (Element Mark) at last row
      //if (gPreCellRow < args.rows[0] && args.rows.length == 1 && args.rows[0] == args.grid.getDataLength()) {
      //    args.grid.gotoCell(args.rows[0], 2);
      //}

      //display summary at state bar

      //if (args.rows.length <= 1) {
      //    window.status = "Ready.";
      //}
      //else {
      //    var lWT = 0;
      //    var lQty = 0;
      //    for (var i = 0 ; i < args.rows.length ; i++) {
      //        lItem = grid.getDataItem(args.rows[i]);
      //        if (lItem.BarWeight > 0) {
      //            lWT = lWT + lItem.BarWeight;
      //        }
      //        if (lItem.BarTotalQty > 0) {
      //            lQty = lQty + lItem.BarTotalQty;
      //        }
      //    }
      //    window.status = lQty + ",  " + Math.round(lWT * 1000) / 1000;
      //}

      this.barRowIndex[this.gridIndex] = args.rows[0];

      this.gPreCellRow = args.rows[0];

      args.grid.focus();
      if (args.grid.getOptions().editable == true) {
        args.grid.editActiveCell();
      }
    }

    if (this.copyDesSelected != false) {
      this.BarsClearCopy(this.gridIndex);
    }
  }
  grid_onClick(e: any, args: any) {
    if (args.grid.getOptions().editable == true) {
      args.grid.getEditorLock().commitCurrentEdit();
      // grid.getEditorLock().commitCurrentEdit()
      args.grid.focus();
      args.grid.editActiveCell();
      args.grid.getEditorLock().commitCurrentEdit();
      // grid.getEditorLock().commitCurrentEdit()
    }
  }

  async getCreepDedution(pInvLength: any, pItem: any): Promise<any> {
    try {
      const data = await this.orderService
        .get_CreepDeduction(pItem, pInvLength)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getShapeInfo(
    CustomerCode: any,
    ProjectCode: any,
    JobId: any,
    ShapeCode: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .getShapeInfo(CustomerCode, ProjectCode, JobId, ShapeCode)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getShapeImagesByCat_CAB(
    CustomerCode: string,
    ProjectCode: string,
    ShapeCategory: string,
    CouplerType: string
  ): Promise<any> {
    try {
      const data = await this.orderService
        .getShapeImagesByCat_CAB(
          CustomerCode,
          ProjectCode,
          ShapeCategory,
          CouplerType
        )
        .toPromise();
      return data;
    } catch (error) {
      alert(
        'Error on loading shape image. Please check the Internet connection and try again.'
      );
      return false;
    }
  }

  getShapeImageList(pCategory: any) {
    // startLoading();
    setTimeout(this.StartgetShapeImageList, 500, pCategory);
  }

  StartgetShapeImageList(pCategory: any) {
    let CustomerCode = this.CustomerCode;
    let ProjectCode = this.ProjectCode;
    let ShapeCategory = pCategory;
    let CouplerType = this.CouplerType.toString();

    // FOR SIDE MENU
    let response: any = this.getShapeImagesByCat(
      CustomerCode,
      ProjectCode,
      ShapeCategory,
      CouplerType
    );
  }

  async getShapeImagesByCat(
    CustomerCode: any,
    ProjectCode: any,
    ShapeCategory: any,
    CouplerType: any
  ) {
    return await this.getShapeImagesByCat_CAB(
      CustomerCode,
      ProjectCode,
      ShapeCategory,
      CouplerType
    );
  }

  ShapeCodeValidator(value: any) {
    // Validate weight entered by user for SB
    // var gridID = $("#tabs").tabs('option', 'active') + 1;

    let Grid = this.templateGrid.slickGrid;
    let DataView = this.dataViewCAB;

    if (Grid != null) {
      var lCurrRow = Grid.getActiveCell().row;
      var lItem = Grid.getDataItem(lCurrRow);
      var lDia = lItem.BarSize;
      var lValue = value;
      var lShapeCodeAR = this.gShapeCodeList.split(',');
      var lFound = 0;
      if (lShapeCodeAR.length > 0) {
        for (let i = 0; i < lShapeCodeAR.length; i++) {
          if (lShapeCodeAR[i] == lValue) {
            lFound = 1;
            break;
          }
        }
      }
      if (lFound == 0) {
        //alert("Invalid weight. SB product can only order by bundles (2 tons per bundle). Please enter valid weight, such as 2000, 4000, 6000.");
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'Invalid shape code entered.' + '(输入的图形码无效.)',
        };
      }
      if (lValue == 'R7A' && lDia >= 16) {
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid shape code entered. Shape R7A is only available when Bar Diameter Less than 16mm.' +
            '(输入的图形码无效. 图形R7A只适用于直径小于16mm.)',
        };
      }
    }
    return { valid: true, msg: null };
  }

  metadata(old_metadata: any) {
    return (row: any) => {
      let item: any = this.templateGrid.slickGrid.getDataItem(row);
      let meta: any = old_metadata(row) || {};

      if (item) {
        // Make sure the "cssClasses" property exists
        meta.cssClasses = meta.cssClasses || '';

        if (item.shapeCopied) {
          meta.cssClasses += ' item-copied';
        }
        else {
          if (item.Cancelled) {
            meta.cssClasses += ' item-cancelled';
          }
          else {
            if (item.BarSTD && item.BarLength < 14000) {
              meta.cssClasses += ' item-barstd';
            }
            else if (item.BarSTD && item.BarLength >= 14000) {
              meta.cssClasses += ' item-bar14m';
            }
            else {
              if (item.shapeTransport == null) {
                meta.cssClasses += ' transport-normal';
              } // Note the leading ^ space.

              if (item.shapeTransport == 0) {
                meta.cssClasses += ' transport-normal';
              } // Note the leading ^ space.

              if (item.shapeTransport == 1) {
                meta.cssClasses += ' transport-lowbed';
              }

              if (item.shapeTransport == 2) {
                meta.cssClasses += ' transport-escort';
              }
            }
          }
        }
        /* Here is just a random example that will add an HTML class to the row element
           that is the value of your row's "rowClass" property. Be careful with this as
           you may run into issues if the "rowClass" property isn't a string or isn't a
           valid class name. */
        if (item.rowClass) {
          var myClass = ' ' + item.rowClass;
          meta.cssClasses += myClass;
        }
      }

      return meta;
    }
  }
  

  BarsClearCopy(pGridID: any) {
    let dataViewArray = this.dataViewCAB;
    let gridArray = this.templateGrid.slickGrid;

    if (this.copyCopied == true) {
      dataViewArray[this.copyGridID].beginUpdate();
      for (var i = 0; i < dataViewArray[this.copyGridID].getLength(); i++) {
        var lItem = dataViewArray[this.copyGridID].getItem(i);
        if (lItem.shapeCopied == true) {
          lItem.shapeCopied = false;
          dataViewArray[this.copyGridID].updateItem(lItem.id, lItem);
        }
      }
      dataViewArray[this.copyGridID].endUpdate();
      if (pGridID == this.copyGridID) {
        // gridArray[this.copyGridID].invalidate();
        // gridArray[this.copyGridID].render();

        gridArray.invalidate();
        gridArray.render();
      }
      this.copyCopied = false;
      this.copyDesSelected = false;
    }
  }

  getVarMaxValue(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar1 = 0;
          var lVar2 = 0;
          if (isNaN(lVarLen[0]) == false) {
            lVar1 = parseInt(lVarLen[0]);
          }
          if (isNaN(lVarLen[1]) == false) {
            lVar2 = parseInt(lVarLen[1]);
          }
          if (lVar1 > lVar2) {
            rValue = lVar1;
          } else {
            rValue = lVar2;
          }
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }
    return rValue;
  }

  getVarMinValue(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar1 = 0;
          var lVar2 = 0;
          if (isNaN(lVarLen[0]) == false) {
            lVar1 = parseInt(lVarLen[0]);
          }
          if (isNaN(lVarLen[1]) == false) {
            lVar2 = parseInt(lVarLen[1]);
          }
          if (lVar1 > lVar2) {
            rValue = lVar2;
          } else {
            rValue = lVar1;
          }
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }

    return rValue;
  }

  getShapeFinderReset(pGridIndex: any) {
    //document.getElementById("shape_code_" + pGridIndex).value = "";
    //document.getElementById("shape_category_" + pGridIndex).value = "";
    //document.getElementById("bt_shape_code_" + pGridIndex).value = "";
    //document.getElementById("bt_shape_category_" + pGridIndex).value = "";
  }

  calWeight(pItem: any) {
    var lDia = [6, 8, 10, 12, 13, 16, 20, 24, 25, 28, 32, 36, 40, 50];
    var lUnitWT = [
      0.222, 0.395, 0.617, 0.888, 1.042, 1.579, 2.466, 3.699, 3.854, 4.834,
      6.313, 7.769, 9.864, 15.413,
    ];
    var lWeight = 0;
    var lKGM = 0;
    var lBarLength = pItem['BarLength'];

    if (!isNaN(pItem['BarTotalQty']) && !isNaN(pItem['BarSize'])) {
      for (var i = 0; i < lDia.length; i++) {
        if (pItem['BarSize'] == lDia[i]) {
          lKGM = lUnitWT[i];
          break;
        }
      }
      if (lKGM > 0) {
        if (isNaN(lBarLength)) {
          if (lBarLength != null) {
            lWeight =
              Math.round(
                (lKGM *
                  pItem['BarTotalQty'] *
                  (this.getVarMinValue(lBarLength) +
                    this.getVarMaxValue(lBarLength))) /
                2
              ) / 1000;
          }
        } else {
          lWeight = Math.round(lKGM * pItem['BarTotalQty'] * lBarLength) / 1000;
        }
      }
    }

    return lWeight;
  }

  calQty(pItem: any) {
    var lDia = [6, 8, 10, 12, 13, 16, 20, 24, 25, 28, 32, 36, 40, 50];
    var lUnitWT = [
      0.222, 0.395, 0.617, 0.888, 1.042, 1.579, 2.466, 3.699, 3.854, 4.834,
      6.313, 7.769, 9.864, 15.413,
    ];
    var lWeight = 0;
    var lMemberQty = '';
    var lEachQty = '';
    var lTotalQty = '';
    var lBarLength = pItem['BarLength'];
    var lPcsFr = 0;
    var lPCs = 0;

    if (
      !isNaN(pItem['BarWeight']) &&
      pItem['BarType'] != null &&
      !isNaN(pItem['BarSize'])
    ) {
      for (var i = 0; i < this.gSBBarType.length; i++) {
        if (
          pItem['BarType'] == this.gSBBarType[i] &&
          pItem['BarSize'] == this.gSBBarSize[i]
        ) {
          lPcsFr = this.gSBPcsFr[i];
          lPCs = this.gSBPcs[i];
          break;
        }
      }
      if (lPCs > 0) {
        if (lBarLength == 12000 || lBarLength == 14000) {
          if (pItem['BarWeight'] >= 2000) {
            lMemberQty = Math.round(pItem['BarWeight'] / 2000).toString();
          } else {
            lMemberQty = '1';
          }
        } else {
          if (pItem['BarWeight'] >= 1000) {
            lMemberQty = Math.round(pItem['BarWeight'] / 1000).toString();
          } else {
            lMemberQty = '1';
          }
        }
        if (lPcsFr != lPCs) {
          lEachQty = lPcsFr + '-' + lPCs;
          lTotalQty =
            lPcsFr * Number(lMemberQty) + '-' + lPCs * Number(lMemberQty);
        } else {
          lEachQty = lPCs.toString();
          lTotalQty = (lPCs * Number(lMemberQty)).toString();
        }
        pItem['BarMemberQty'] = lMemberQty;
        pItem['BarEachQty'] = lEachQty;
        pItem['BarTotalQty'] = lTotalQty;
      }
    }

    return lMemberQty;
  }

  refreshInfo(pGridIndex: any) {
    let dataViewArray = this.dataViewCAB;
    if (pGridIndex > 1) {
      var lGridIndex = pGridIndex;
      if (dataViewArray.getLength() > 0) {
        var lSubCABWT = 0;
        var lSubSTDWT = 0;
        var lSubCancelledWT = 0;
        var lSubOrderWT = 0;
        var lSubTotalWT = 0;
        var lSubOrderQty = 0;
        var lSubOrderItem = 0;
        for (var i = 0; i < dataViewArray.getLength(); i++) {
          var lItem = dataViewArray.getItem(i);
          if (
            lItem.Cancelled == true ||
            lItem.BarShapeCode == '' ||
            lItem.BarShapeCode == null ||
            lItem.BarTotalQty == null ||
            lItem.BarTotalQty == 0 ||
            lItem.BarTotalQty == '' ||
            lItem.BarWeight == null ||
            lItem.BarWeight == 0 ||
            lItem.BarWeight == ''
          ) {
            if (
              !isNaN(lItem.BarWeight) &&
              lItem.BarWeight != null &&
              lItem.BarWeight != ''
            ) {
              lSubCancelledWT = lSubCancelledWT + parseFloat(lItem.BarWeight);
            }
          } else {
            if (
              !isNaN(lItem.BarWeight) &&
              lItem.BarWeight != null &&
              lItem.BarWeight != ''
            )
              lSubOrderWT = lSubOrderWT + parseFloat(lItem.BarWeight);
            if (
              !isNaN(lItem.BarTotalQty) &&
              lItem.BarTotalQty != null &&
              lItem.BarTotalQty != ''
            )
              lSubOrderQty = lSubOrderQty + parseFloat(lItem.BarTotalQty);
            lSubOrderItem = lSubOrderItem + 1;
            if (lItem.BarSTD == null || lItem.BarSTD == undefined) {
              if (
                !isNaN(lItem.BarWeight) &&
                lItem.BarWeight != null &&
                lItem.BarWeight != ''
              )
                lSubCABWT = lSubCABWT + parseFloat(lItem.BarWeight);
            } else {
              if (
                !isNaN(lItem.BarWeight) &&
                lItem.BarWeight != null &&
                lItem.BarWeight != ''
              )
                lSubSTDWT = lSubSTDWT + parseFloat(lItem.BarWeight);
            }
          }
          if (
            !isNaN(lItem.BarWeight) &&
            lItem.BarWeight != null &&
            lItem.BarWeight != ''
          )
            lSubTotalWT = lSubTotalWT + parseFloat(lItem.BarWeight);
        }
        lSubOrderWT = Math.round(lSubOrderWT * 1000) / 1000;
        lSubCancelledWT = Math.round(lSubCancelledWT * 1000) / 1000;
        lSubTotalWT = Math.round(lSubTotalWT * 1000) / 1000;
        lSubCABWT = Math.round(lSubCABWT * 1000) / 1000;
        lSubSTDWT = Math.round(lSubSTDWT * 1000) / 1000;

        document.getElementById('cab_weight_' + lGridIndex)!.innerText =
          lSubCABWT.toString();
        document.getElementById('sb_weight_' + lGridIndex)!.innerText =
          lSubSTDWT.toString();
        document.getElementById('invalid_weight_' + lGridIndex)!.innerText =
          lSubCancelledWT.toString();
        document.getElementById('total_weight_' + lGridIndex)!.innerText =
          lSubTotalWT.toString();
        document.getElementById('valid_items_' + lGridIndex)!.innerText =
          lSubOrderItem.toString();
        document.getElementById('valid_barqty_' + lGridIndex)!.innerText =
          lSubOrderQty.toString();

        document.getElementById('bt_cab_weight_' + lGridIndex)!.innerText =
          lSubCABWT.toString();
        document.getElementById('bt_sb_weight_' + lGridIndex)!.innerText =
          lSubSTDWT.toString();
        document.getElementById('bt_invalid_weight_' + lGridIndex)!.innerText =
          lSubCancelledWT.toString();
        document.getElementById('bt_total_weight_' + lGridIndex)!.innerText =
          lSubTotalWT.toString();
        document.getElementById('bt_valid_items_' + lGridIndex)!.innerText =
          lSubOrderItem.toString();
        document.getElementById('bt_valid_barqty_' + lGridIndex)!.innerText =
          lSubOrderQty.toString();
        //if (lSubOrderWT > 30000 && lSubCABWT > 0) {
        //    alert("The total BBS weight is " + lSubOrderWT + ", which is exceeded its maximum weight 30000kg. Please add another BBS to split it.");
        //}
        if (lSubOrderWT > 60000 && lSubCABWT == 0) {
          alert(
            'The total BBS weight is ' +
            lSubOrderWT +
            ', which is exceeded its maximum weight 60000kg. Please add another BBS to split it.'
          );
        }
      }
    }
  }
  getVarValue1(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar1 = 0;
          if (isNaN(lVarLen[0]) == false) {
            lVar1 = parseInt(lVarLen[0]);
          }
          rValue = lVar1;
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }
    return rValue;
  }

  getVarValue2(pValue: any) {
    var rValue = 0;
    if (pValue != null) {
      if (isNaN(pValue)) {
        var lVarLen = pValue.split('-');
        if (lVarLen.length == 2) {
          var lVar2 = 0;
          if (isNaN(lVarLen[1]) == false) {
            lVar2 = parseInt(lVarLen[1]);
          }
          rValue = lVar2;
        } else {
          rValue = 0;
        }
      } else {
        rValue = parseInt(pValue);
      }
    }
    return rValue;
  }

  getNoVariousBar(pItems: any, pToLine: any) {
    var lReturn = 0;
    if (pItems != null && pItems.length > 0) {
      if (pToLine == null) {
        pToLine = 0;
      }
      if (pToLine > pItems.length) {
        pToLine = pItems.length;
      }
      for (let q = 0; q < pToLine; q++) {
        if (
          pItems[q].BarTotalQty != null &&
          pItems[q].BarTotalQty >= 5 &&
          pItems[q].BarShapeCode != null &&
          pItems[q].BarShapeCode != '' &&
          pItems[q].Cancelled != true
        ) {
          for (var r = 'A'.charCodeAt(0); r < 'A'.charCodeAt(0) + 26; r++) {
            if (
              pItems[q][String.fromCharCode(r)] != null &&
              pItems[q][String.fromCharCode(r)].toString().indexOf('-') >= 0
            ) {
              lReturn = lReturn + 1;
              break;
            }
          }
        }
      }
    }
    return lReturn;
  }
  
  displayShapeImage(pGridID: any, pRowNo: any) {
    //CALL THE CANVAS FUNCTION HERE

    var lItem = this.dataViewCAB.getItem(pRowNo);
    if (lItem === undefined) {
      return;
    }
    if (lItem.BarShapeCode == undefined) {
      return;
    }
    if (lItem.BarShapeCode.value != undefined) {
      lItem.BarShapeCode = lItem.BarShapeCode.value;
    }
    if (
      lItem != null &&
      lItem.BarShapeCode != null &&
      lItem.BarShapeCode.trim().length > 0 &&
      this.gShapeParameters != null &&
      this.gShapeParameters.length > 0
    ) {
      var lParaA = this.gShapeParameters.split(',');
      var lPosXA = this.gShapeParaX.split(',');
      var lPosYA = this.gShapeParaY.split(',');

      // var canImg: any = document.getElementById("rightShapeImage-" + pGridID);
      var canImg: HTMLCanvasElement = this.Canvas.nativeElement;
      var ctxImg: any = canImg.getContext('2d');
      ctxImg.clearRect(0, 0, canImg.width, canImg.height);

      var imgObj = new Image();
      imgObj.onload = function () {
        ctxImg.drawImage(
          imgObj,
          0,
          0,
          imgObj.width,
          imgObj.height,
          0,
          0,
          canImg.width,
          canImg.height
        );

        var lRatioX = canImg.width / imgObj.width;
        var lRatioY = canImg.height / imgObj.height;

        // if (this.gShapeParameters != null) {
        if (lParaA != null) {
          if (lParaA.length > 0) {
            for (let i = 0; i < lParaA.length; i++) {
              var lText = lParaA[i].trim();
              if (lItem[lText] != null) {
                var lValue = lItem[lText];
                if (lValue != null) {
                  lText = lValue;
                }
              }
              ctxImg.font = 'Bold 12px verdana';
              ctxImg.fillStyle = '#000000';
              ctxImg.strokeStyle = '#000000';
              ctxImg.lineWidth = 1;
              ctxImg.fillText(
                lText,
                lRatioX * (parseInt(lPosXA[i]) + 4),
                lRatioY * (parseInt(lPosYA[i]) + 16)
              );
            }
          }
        }
      };
      imgObj.src = this.gShapeImage;

      // var canImgB: any = document.getElementById("btmShapeImage-" + pGridID);
      // var canImgB: HTMLCanvasElement = this.Canvas.nativeElement;
      // var ctxImgB: any = canImgB.getContext('2d');
      // ctxImgB.clearRect(0, 0, canImgB.width, canImgB.height);

      // var imgObjB = new Image();
      // imgObjB.onload = function () {
      //   ctxImgB.drawImage(imgObjB, 0, 0, imgObjB.width, imgObjB.height, 0, 0, canImgB.width, canImgB.height);
      //   var lRatioX = canImgB.width / imgObjB.width;
      //   var lRatioY = canImgB.height / imgObjB.height;

      //   if (lParaA != null) {

      //     if (lParaA.length > 0) {
      //       for (let i = 0; i < lParaA.length; i++) {
      //         var lText = lParaA[i].trim();
      //         if (lItem[lText] != null) {
      //           var lValue = lItem[lText];
      //           if (lValue != null) {
      //             lText = lValue;
      //           }
      //         }
      //         ctxImgB.font = "Bold 12px verdana";
      //         ctxImgB.fillStyle = "#000000";
      //         ctxImgB.strokeStyle = "#000000";
      //         ctxImgB.lineWidth = 1;
      //         ctxImgB.fillText(lText, lRatioX * (parseInt(lPosXA[i]) + 4), lRatioY * (parseInt(lPosYA[i]) + 16));
      //       }
      //     }
      //   }
      // };
      // imgObjB.src = this.gShapeImage;
    }
  }
  CheckForVariance(e: any, args: any) { }
  grid_onContextMenu(e: any, args: any) {
    e.preventDefault();
    var cell = args.grid.getCellFromEvent(e);

    // let CellName: string = args.grid.getColumns()[args.grid.getCellFromEvent(e).cell].id

    
    this.CheckForVariance(e, args);
    let RowNo = args.grid.getCellFromEvent(e).row;

    if (args.grid.getDataItem(RowNo) != undefined) {
      if (args.grid.getDataItem(RowNo).shapeParameters != undefined) {
        let ShapeParams = args.grid.getDataItem(RowNo).shapeParameters.split(',');

        for (let i = 0; i < ShapeParams.length; i++) {
          let value = args.grid.getDataItem(RowNo)[ShapeParams[i]];
          if (value != undefined) {
            this.showVariance = value.includes('-');
            if (this.showVariance) {
              this.VarianceData = args.grid.getDataItem(RowNo);
              break;
            }
          }
        }
      }
    }

    // this.showVariance = /^[A-Z]+$/.test(CellName)

    $('#contextMenuCAB')
      .data('row', cell.row)
      .css('top', e.clientY - 50)
      .css('left', e.clientX - 50)
      .show();

    this.showcontextMenuCAB = true;

    // $("#contextMenuCAB")
    // .data("row", cell.row)
    // .css("top", e.clientY - 50)
    // .css("left", e.clientX - $("#sidebar").width())
    // .show();

    $('body').one('click', function () {
      $('#contextMenuCAB').hide();
      // this.showcontextMenuCAB = false;
    });
  }

  ValidTransport(pArgs: any) {
    var lReturn = 0;
    // return 0 -- OK, 1 -- Low Bed, 2 -- Low Bed need police escort, 3 -- Exceed 7000mm Hiap Crane
    var lWidth = 0;
    var lLeng = 0;
    var lLowBed = 0;
    var lEscort = 0;
    var lLowBedAnd = 0;
    var lEscortAnd = 0;
    var lItem = pArgs.item;
    var lF = lItem['shapeTransportValidator'];
    var lResult = 0;
    var lColumnName = pArgs.grid.getColumns(pArgs.row)[pArgs.cell]['id'];
    if (lF != null && lF != '') {
      if (
        (lColumnName == 'A' && lF.indexOf('A') >= 0) ||
        (lColumnName == 'B' && lF.indexOf('B') >= 0) ||
        (lColumnName == 'C' && lF.indexOf('C') >= 0) ||
        (lColumnName == 'D' && lF.indexOf('D') >= 0) ||
        (lColumnName == 'E' && lF.indexOf('E') >= 0) ||
        (lColumnName == 'F' && lF.indexOf('F') >= 0) ||
        (lColumnName == 'G' && lF.indexOf('G') >= 0) ||
        (lColumnName == 'H' && lF.indexOf('H') >= 0) ||
        (lColumnName == 'I' && lF.indexOf('I') >= 0) ||
        (lColumnName == 'J' && lF.indexOf('J') >= 0) ||
        (lColumnName == 'K' && lF.indexOf('K') >= 0) ||
        (lColumnName == 'L' && lF.indexOf('L') >= 0) ||
        (lColumnName == 'M' && lF.indexOf('M') >= 0) ||
        (lColumnName == 'N' && lF.indexOf('N') >= 0) ||
        (lColumnName == 'O' && lF.indexOf('O') >= 0) ||
        (lColumnName == 'P' && lF.indexOf('P') >= 0) ||
        (lColumnName == 'Q' && lF.indexOf('Q') >= 0) ||
        (lColumnName == 'R' && lF.indexOf('R') >= 0) ||
        (lColumnName == 'S' && lF.indexOf('S') >= 0) ||
        (lColumnName == 'T' && lF.indexOf('T') >= 0) ||
        (lColumnName == 'U' && lF.indexOf('U') >= 0) ||
        (lColumnName == 'V' && lF.indexOf('V') >= 0) ||
        (lColumnName == 'W' && lF.indexOf('W') >= 0) ||
        (lColumnName == 'X' && lF.indexOf('X') >= 0) ||
        (lColumnName == 'Y' && lF.indexOf('Y') >= 0) ||
        (lColumnName == 'Z' && lF.indexOf('Z') >= 0)
      ) {
        var lOr = lF.split('||');
        for (var i = 0; i < lOr.length; i++) {
          var lAnd = lOr[i].split('&&');
          var lLowBedAnd = 1;
          var lEscortAnd = 1;
          for (var j = 0; j < lAnd.length; j++) {
            for (var k = 'A'.charCodeAt(0); k < 'A'.charCodeAt(0) + 26; k++) {
              if (lItem[String.fromCharCode(k)] == null) {
                lAnd[j] = lAnd[j].split(String.fromCharCode(k)).join('0');
              } else {
                if (isNaN(lItem[String.fromCharCode(k)])) {
                  lAnd[j] = lAnd[j]
                    .split(String.fromCharCode(k))
                    .join(this.getVarMaxValue(lItem[String.fromCharCode(k)]));
                } else {
                  lAnd[j] = lAnd[j]
                    .split(String.fromCharCode(k))
                    .join(lItem[String.fromCharCode(k)]);
                }
              }
            }
            try {
              if (lAnd[j].indexOf('math') >= 0) {
                lAnd[j] = lAnd[j].split('math').join('Math');
              }
              if (lAnd[j].indexOf('pi') >= 0) {
                lAnd[j] = lAnd[j].split('pi').join('PI');
              }
              lResult = eval(lAnd[j]);
              if (isNaN(lResult) == true) {
                lLowBedAnd = 0;
                lEscortAnd = 0;
              } else {
                if (lResult <= this.gLowBed) {
                  lLowBedAnd = 0;
                }
                if (lResult <= this.gLowBedEsc) {
                  lEscortAnd = 0;
                }
                if (j == 0) {
                  lWidth = lResult;
                } else {
                  lLeng = lResult;
                }
              }
            } catch (e) {
              lLowBedAnd = 0;
              lEscortAnd = 0;
            }
          }
          if (lLowBedAnd == 1) {
            lLowBed = 1;
          }
          if (lEscortAnd == 1) {
            lEscort = 1;
          }
        }
      }
    }
    lResult = 0;
    if (lLowBed == 1) lResult = 1;
    if (lEscort == 1) lResult = 2;
    if (lResult == 0) {
      if (lWidth > 7000 || lLeng > 7000) {
        if (lLeng > 7000) {
          if (lItem.BarShapeCode == '037' || lItem.BarShapeCode == '37') {
            if (lWidth > 0 && lWidth < 2400) {
              if (
                Math.sqrt(lLeng * lLeng - (2400 - lWidth) * (2400 - lWidth)) >
                7000
              ) {
                lResult = 3;
              }
            } else {
              lResult = 3;
            }
          } else {
            lResult = 3;
          }
        }
        if (lWidth > 7000) {
          if (lItem.BarShapeCode == '037' || lItem.BarShapeCode == '37') {
            if (lLeng > 0 && lLeng < 2400) {
              if (
                Math.sqrt(lWidth * lWidth - (2400 - lLeng) * (2400 - lLeng)) >
                7000
              ) {
                lResult = 3;
              }
            } else {
              lResult = 3;
            }
          } else {
            lResult = 3;
          }
        }
      } else {
        if (lItem != null && lItem.BarShapeCode != null && lItem.A != null) {
          if (
            (lItem.BarShapeCode == '020' || lItem.BarShapeCode == '20') &&
            lItem.A > 7200
          ) {
            lResult = 3;
          }
        }
      }
    }
    return lResult;
  }

  isValidValue(
    pColumnName: any,
    pParameters: any,
    pDia: any,
    pValue: any,
    pItem: any,
    msgRef: any,
    pDataEntry: any
  ) {
    var lReturn = true;
    var lErrorMsg = '';
    var lGridIndex = $('#tabs .ui-tabs-active').index() + 1;
    var lType = pItem['BarType'];
    var lPinSize = pItem['PinSize'];
    var lParType = pItem.shapeParType;
    var lDefaultValue = pItem.shapeDefaultValue;
    var lHeightCheck = pItem.shapeHeightCheck;

    if (lParType == null) {
      lParType = '';
    }
    if (lDefaultValue == null) {
      lDefaultValue = '';
    }
    if (lHeightCheck == null) {
      lHeightCheck = '';
    }

    if (
      lType != null &&
      lType != '' &&
      pColumnName != null &&
      pColumnName != '' &&
      pParameters != null &&
      pParameters != '' &&
      pDia != null &&
      pDia != '' &&
      pDia != '0' &&
      pDia != 0 &&
      pValue != null &&
      pValue != '' &&
      pValue != '0' &&
      pValue != 0
    ) {
      var lParamType = '';
      var lParamTypes = lParType.split(',');
      var lParas = pParameters.split(',');
      var lDefaultValueAR = lDefaultValue.split(',');
      var lHeightCheckAR = lHeightCheck.split(',');
      var lDiaAR = this.gDiaAll.split(',');
      var lMinLenAR = this.gMinLen.split(',');
      var lMinLenHkAR = this.gMinLenHk.split(',');
      var lMinHtHkAR = this.gMinHtHk.split(',');
      var lNonDiaAR = this.gDiaAll.split(',');
      var lNonMinLenAR = this.gMinLen.split(',');
      var lNonMinLenHkAR = this.gMinLenHk.split(',');
      var lNonMinHtHkAR = this.gMinHtHk.split(',');
      var lStdFormerAR = this.gStdFormer.split(',');
      var lNonFormerAR = this.gNonFormer.split(',');
      if (lType == 'H' || lType == 'C') {
        lDiaAR = this.gHStdDia.split(',');
        lMinLenAR = this.gHStdMinLen.split(',');
        lMinLenHkAR = this.gHStdMinLenHk.split(',');
        lMinHtHkAR = this.gHStdMinHtHk.split(',');
        lNonDiaAR = this.gHNonDia.split(',');
        lNonMinLenAR = this.gHNonMinLen.split(',');
        lNonMinLenHkAR = this.gHNonMinLenHk.split(',');
        lNonMinHtHkAR = this.gHNonMinHtHk.split(',');
        lStdFormerAR = this.gHStdFormer.split(',');
        lNonFormerAR = this.gHNonFormer.split(',');
      } else if (lType == 'R') {
        lDiaAR = this.gRStdDia.split(',');
        lMinLenAR = this.gRStdMinLen.split(',');
        lMinLenHkAR = this.gRStdMinLenHk.split(',');
        lMinHtHkAR = this.gRStdMinHtHk.split(',');
        lNonDiaAR = this.gRNonDia.split(',');
        lNonMinLenAR = this.gRNonMinLen.split(',');
        lNonMinLenHkAR = this.gRNonMinLenHk.split(',');
        lNonMinHtHkAR = this.gRNonMinHtHk.split(',');
        lStdFormerAR = this.gRStdFormer.split(',');
        lNonFormerAR = this.gRNonFormer.split(',');
      } else if (lType == 'T') {
        lDiaAR = this.gTStdDia.split(',');
        lMinLenAR = this.gTStdMinLen.split(',');
        lMinLenHkAR = this.gTStdMinLenHk.split(',');
        lMinHtHkAR = this.gTStdMinHtHk.split(',');
        lNonDiaAR = this.gTNonDia.split(',');
        lNonMinLenAR = this.gTNonMinLen.split(',');
        lNonMinLenHkAR = this.gTNonMinLenHk.split(',');
        lNonMinHtHkAR = this.gTNonMinHtHk.split(',');
        lStdFormerAR = this.gTStdFormer.split(',');
        lNonFormerAR = this.gTNonFormer.split(',');
      } else if (lType == 'E') {
        lDiaAR = this.gEStdDia.split(',');
        lMinLenAR = this.gEStdMinLen.split(',');
        lMinLenHkAR = this.gEStdMinLenHk.split(',');
        lMinHtHkAR = this.gEStdMinHtHk.split(',');
        lNonDiaAR = this.gENonDia.split(',');
        lNonMinLenAR = this.gENonMinLen.split(',');
        lNonMinLenHkAR = this.gENonMinLenHk.split(',');
        lNonMinHtHkAR = this.gENonMinHtHk.split(',');
        lStdFormerAR = this.gEStdFormer.split(',');
        lNonFormerAR = this.gENonFormer.split(',');
      } else if (lType == 'N') {
        lDiaAR = this.gNStdDia.split(',');
        lMinLenAR = this.gNStdMinLen.split(',');
        lMinLenHkAR = this.gNStdMinLenHk.split(',');
        lMinHtHkAR = this.gNStdMinHtHk.split(',');
        lNonDiaAR = this.gNNonDia.split(',');
        lNonMinLenAR = this.gNNonMinLen.split(',');
        lNonMinLenHkAR = this.gNNonMinLenHk.split(',');
        lNonMinHtHkAR = this.gNNonMinHtHk.split(',');
        lStdFormerAR = this.gNStdFormer.split(',');
        lNonFormerAR = this.gNNonFormer.split(',');
      } else if (lType == 'X') {
        lDiaAR = this.gXStdDia.split(',');
        lMinLenAR = this.gXStdMinLen.split(',');
        lMinLenHkAR = this.gXStdMinLenHk.split(',');
        lMinHtHkAR = this.gXStdMinHtHk.split(',');
        lNonDiaAR = this.gXNonDia.split(',');
        lNonMinLenAR = this.gXNonMinLen.split(',');
        lNonMinLenHkAR = this.gXNonMinLenHk.split(',');
        lNonMinHtHkAR = this.gXNonMinHtHk.split(',');
        lStdFormerAR = this.gXStdFormer.split(',');
        lNonFormerAR = this.gXNonFormer.split(',');
      }

      pValue = pValue.toString();

      if (lParamTypes.length >= lParas.length) {
        for (var i = 0; i < lParas.length; i++) {
          if (pColumnName == lParas[i]) {
            lParamType = lParamTypes[i];

            //Additional Bending Checking for dia <= 16mm
            if (pParameters != 'A' && pDia <= 16 && lReturn != false) {
              if (pItem['BarShapeCode'] == null) {
                pItem['BarShapeCode'] = '';
              }
              var lShapeCode = pItem['BarShapeCode'].trim();
              if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;
              for (var j = 0; j < this.gAddShape.length; j++) {
                if (
                  this.gAddShape[j] == lShapeCode &&
                  this.gAddPara[j] == pColumnName
                ) {
                  var lLenLimit = 0;
                  for (var k = 0; k < this.gAddDia.length; k++) {
                    if (this.gAddDia[k] == pDia) {
                      if (this.gAddHook[j] == true) {
                        lLenLimit = this.gAddHKHeightMax[k];
                      } else {
                        lLenLimit = this.gAddBendLenMin[k];
                      }
                      break;
                    }
                  }

                  if (this.gAddHook[j] == true) {
                    var lInputValue = this.getVarMaxValue(pValue);
                    if (lInputValue > lLenLimit) {
                      lErrorMsg =
                        'Invalid data entered for shape ' +
                        lShapeCode +
                        ', parameter ' +
                        pColumnName +
                        '. Its value is greater than the maximum hook height ' +
                        lLenLimit +
                        'mm. You may want to replace the shape by ' +
                        this.gAddRepShape[j] +
                        '.' +
                        '\n(输入图型' +
                        lShapeCode +
                        ', 参数' +
                        pColumnName +
                        '的数值无效. 此参数值已大于它的最大高度 ' +
                        lLenLimit +
                        'mm. 您可以用' +
                        this.gAddRepShape[j].replace('or', '或') +
                        '来替换此图形) ';
                      lReturn = false;
                      break;
                    }
                  } else {
                    var lInputValue = this.getVarMaxValue(pValue);
                    if (lInputValue < lLenLimit) {
                      lErrorMsg =
                        'Invalid data entered for shape ' +
                        lShapeCode +
                        ', parameter ' +
                        pColumnName +
                        '. Its value is less than the minimum bending length of internal segment ' +
                        lLenLimit +
                        'mm. You may want to replace the shape by ' +
                        this.gAddRepShape[j] +
                        '.' +
                        '\n(输入图型' +
                        lShapeCode +
                        ', 参数' +
                        pColumnName +
                        '的数值无效. 此图型参数值已小于它的最小长度 ' +
                        lLenLimit +
                        'mm. 您可以用' +
                        this.gAddRepShape[j].replace('or', '或') +
                        '来替换此图形) ';
                      lReturn = false;
                      break;
                    }
                  }
                }
              }
            }

            // Check whether the max value > 1800 (EVG cannot bend, go to double bender) - 2023-03-08 - zbc
            var lMaxSegLen = 0;
            for (var m = 0; m < lParas.length; m++) {
              if (lParamTypes[m] == 'S') {
                if (this.getVarMaxValue(pItem[lParas[m]]) > lMaxSegLen) {
                  lMaxSegLen = this.getVarMaxValue(pItem[lParas[m]]);
                }
              }
            }

            if (
              lParamType == 'S' &&
              pParameters != 'A' &&
              (pDia > 16 || lMaxSegLen > 1800) &&
              lReturn != false
            ) {
              //inner segments bending check for double bender
              // lDefValue == 1 first seg; 2 inner seg; 3 last seg
              var lDefValue = lDefaultValueAR[i];
              if (
                lDefValue != null &&
                isNaN(lDefValue) == false &&
                lDefValue == 2
              ) {
                var lStdFormer = this.getValueByDia(lDiaAR, pDia, lStdFormerAR);
                var lNonFormer = this.getValueByDia(
                  lNonDiaAR,
                  pDia,
                  lNonFormerAR
                );
                //var lStdMinLen = (parseInt(lStdFormer) + parseInt(pDia)) * 2 + 20;
                //var lNonMinLen = (parseInt(lNonFormer) + parseInt(pDia)) * 2 + 20;
                var lStdMinLen = parseInt(lStdFormer.toString()) * 2 + 20;
                var lNonMinLen = parseInt(lNonFormer.toString()) * 2 + 20;
                var lInputValue = this.getVarMinValue(pValue);
                if (lInputValue < lNonMinLen) {
                  if (pDataEntry == 1) {
                    if (pItem['BarShapeCode'] != null) {
                      var lShapeCode = pItem['BarShapeCode'].trim();
                      if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;

                      if (
                        (lShapeCode == '038' || lShapeCode == '38A') &&
                        pColumnName == 'B'
                      ) {
                        var lRes = confirm(
                          'The length of the internal segment B is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 39? ' +
                          '\n(此图型参数值B已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型39?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '39';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '052' && pColumnName == 'C') {
                        var lRes = confirm(
                          'The length of the internal segment C is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 85? ' +
                          '\n(此图型参数值C已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型85?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '85';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment C is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值C已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (
                        lShapeCode == '055' &&
                        (pColumnName == 'B' || pColumnName == 'D')
                      ) {
                        var lRes = confirm(
                          'The length of the internal segment B or D is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 208? ' +
                          '\n(此图型参数值B或C已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型208?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '208';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B or D is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B,D已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '302' && pColumnName == 'B') {
                        var lRes = confirm(
                          'The length of the internal segment B is less than its minimum value ' +
                          lNonMinLen +
                          'mm. (Please note that the sequence of their parameters are different)' +
                          'Do you want to change to hook shape 212? ' +
                          '\n(此图型参数值B已小于它的最小长度' +
                          lNonMinLen +
                          'mm. (请注意它们参数顺序的不同) 您是否愿意改成图型212?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '212';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '321' && pColumnName == 'B') {
                        var lRes = confirm(
                          'The length of the internal segment B is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 211? ' +
                          '\n(此图型参数值B已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型211?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '211';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '313' && pColumnName == 'C') {
                        var lRes = confirm(
                          'The length of the internal segment C is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 207? ' +
                          '\n(此图型参数值C已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型207?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '207';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment C is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值C已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '401' && pColumnName == 'C') {
                        var lRes = confirm(
                          'The length of the internal segment C is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 311? ' +
                          '\n(此图型参数值C已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型311?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '311';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment C is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值C已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '402' && pColumnName == 'B') {
                        var lRes = confirm(
                          'The length of the internal segment B is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 360? ' +
                          '\n(此图型参数值B已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型360?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '360';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '405' && pColumnName == 'B') {
                        var lRes = confirm(
                          'The length of the internal segment B is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 324? ' +
                          '\n(此图型参数值B已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型324?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '324';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '405' && pColumnName == 'B') {
                        var lRes = confirm(
                          'The length of the internal segment B is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 324? ' +
                          '\n(此图型参数值B已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型324?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '324';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '426' && pColumnName == 'D') {
                        var lRes = confirm(
                          'The length of the internal segment D is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 309? ' +
                          '\n(此图型参数值D已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型309?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '309';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment D is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值D已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (lShapeCode == '426' && pColumnName == 'D') {
                        var lRes = confirm(
                          'The length of the internal segment D is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 309? ' +
                          '\n(此图型参数值D已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型309?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '309';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment D is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值D已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else if (
                        lShapeCode == '459' &&
                        (pColumnName == 'B' || pColumnName == 'D')
                      ) {
                        var lRes = confirm(
                          'The length of the internal segment B or D is less than its minimum value ' +
                          lNonMinLen +
                          'mm.' +
                          'Do you want to change to hook shape 218? ' +
                          '\n(此图型参数值B或D已小于它的最小长度' +
                          lNonMinLen +
                          'mm. 您是否愿意改成图型218?)'
                        );
                        if (lRes == true) {
                          pItem['BarShapeCode'] = '218';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length of internal segment B or D is ' +
                            lNonMinLen +
                            'mm. ' +
                            '\n(输入数据无效, 此图型参数值B或D已小于它的最小长度 ' +
                            lNonMinLen +
                            'mm.) ';
                          lReturn = false;
                          break;
                        }
                      } else {
                        lErrorMsg =
                          'Invalid data entered. The minimum bending length of internal segments is ' +
                          lNonMinLen +
                          'mm. ' +
                          '\n(输入数据无效, 此图型参数值已小于它的最小长度 ' +
                          lNonMinLen +
                          'mm.) ';
                        lReturn = false;
                        break;
                      }
                    }
                  } else {
                    lErrorMsg =
                      'Invalid data entered. The minimum bending length of internal segments is ' +
                      lNonMinLen +
                      'mm. ' +
                      '\n(输入数据无效, 此图型参数值已小于它的最小长度 ' +
                      lNonMinLen +
                      'mm.) ';
                    lReturn = false;
                    break;
                  }
                } else if (
                  lInputValue >= lNonMinLen &&
                  lInputValue < lStdMinLen &&
                  pItem['PinSize'] != lNonFormer
                ) {
                  if (pDataEntry == 1) {
                    var lRes = confirm(
                      'For internal segments, the standard pin(' +
                      lStdFormer +
                      ') minimum bending length is ' +
                      lStdMinLen +
                      'mm.' +
                      'Do you want to change the former to non-standrad ' +
                      lNonFormer +
                      ' former with minimum bending length ' +
                      lNonMinLen +
                      'mm? \n' +
                      '(标准曲模' +
                      lStdFormer +
                      '的最小曲弯长度为 ' +
                      lStdMinLen +
                      'mm. 请确认是否换成非标准曲模' +
                      lNonFormer +
                      ', 其最小弯曲长度为 ' +
                      lNonMinLen +
                      'mm?)'
                    );
                    if (lRes == true) {
                      pItem['PinSize'] = lNonFormer;
                    } else {
                      lErrorMsg =
                        'Invalid data entered. The minimum bending length is ' +
                        lStdMinLen +
                        'mm for standard ' +
                        lStdFormer +
                        ' former. ' +
                        '\n(输入数据无效, 标准曲模' +
                        lStdFormer +
                        '的最小弯曲长度为 ' +
                        lStdMinLen +
                        'mm.) ';
                      lReturn = false;
                      break;
                    }
                  } else {
                    lErrorMsg =
                      'Invalid data entered. The minimum bending length is ' +
                      lStdMinLen +
                      'mm for standard ' +
                      lStdFormer +
                      ' former. ' +
                      '\n(输入数据无效, 标准曲模' +
                      lStdFormer +
                      '的最小弯曲长度为 ' +
                      lStdMinLen +
                      'mm.) ';
                    lReturn = false;
                    break;
                  }
                }
              }
            }

            if (lReturn != false) {
              //Validate hook length
              var lLastInd = 0;
              if (lParamType == 'S' && i > 0 && lParamTypes[i - 1] == 'R') {
                lLastInd = 1;
                if (i + 1 < lParas.Length) {
                  for (j = i + 1; j < lParas.Length; j++) {
                    if (lParamTypes[j] == 'S') {
                      lLastInd = 0;
                      break;
                    }
                  }
                }
              }

              if (
                lParamTypes.indexOf('RL') < 0 &&
                ((lParamType == 'S' &&
                  i == 0 &&
                  lParas.length > 1 &&
                  lParamTypes[i + 1] == 'R') ||
                  (lParamType == 'S' &&
                    i > 0 &&
                    lParamTypes[i - 1] == 'R' &&
                    lLastInd == 1))
              ) {
                //Check hook length >= hook height - 2022-06-07
                var lHookHeight = '';
                if (i == 0 && lParas.length > 1 && lParamTypes[i + 1] == 'R') {
                  lHookHeight = pItem[lParas[i + 1]];
                }
                if (i > 0 && lParamTypes[i - 1] == 'R' && lLastInd == 1) {
                  lHookHeight = pItem[lParas[i - 1]];
                }
                if (
                  (this.getVarValue1(lHookHeight) > 0 &&
                    this.getVarValue1(pValue) > 0 &&
                    this.getVarValue1(pValue) <
                    this.getVarValue1(lHookHeight)) ||
                  (this.getVarValue2(lHookHeight) > 0 &&
                    this.getVarValue2(pValue) > 0 &&
                    this.getVarValue2(pValue) <
                    this.getVarValue2(lHookHeight)) ||
                  (this.getVarValue2(lHookHeight) == 0 &&
                    this.getVarValue2(pValue) > 0 &&
                    this.getVarValue2(pValue) <
                    this.getVarValue1(lHookHeight)) ||
                  (this.getVarValue2(lHookHeight) > 0 &&
                    this.getVarValue2(pValue) == 0 &&
                    this.getVarValue1(pValue) < this.getVarValue2(lHookHeight))
                ) {
                  lErrorMsg =
                    'Invalid data entered. The hook length (' +
                    pValue +
                    ') must be more than or equal to hook height (' +
                    lHookHeight +
                    '). \n输入数据无效, 挂钩钩长 (' +
                    pValue +
                    ') 必须大于或等于挂钩钩高 (' +
                    lHookHeight +
                    ').';
                  lReturn = false;
                  break;
                }

                //Min Len validation
                var lStdMinLen = this.getValueByDia(lDiaAR, pDia, lMinLenHkAR);

                if (lStdMinLen > 0) {
                  if (this.getVarMinValue(pValue) < lStdMinLen) {
                    var lNonMinLen = this.getValueByDia(
                      lNonDiaAR,
                      pDia,
                      lNonMinLenHkAR
                    );
                    var lStdFormer = this.getValueByDia(
                      lDiaAR,
                      pDia,
                      lStdFormerAR
                    );
                    var lNonFormer = this.getValueByDia(
                      lNonDiaAR,
                      pDia,
                      lNonFormerAR
                    );
                    if (this.getVarMinValue(pValue) < lNonMinLen) {
                      if (lStdFormer == lNonFormer) {
                        lErrorMsg =
                          'Invalid data entered. The minimum hook length is ' +
                          lStdMinLen +
                          'mm for ' +
                          lStdFormer +
                          'mm former. \n(输入数据无效, 曲模' +
                          lStdFormer +
                          'mm的最小弯曲长度为 ' +
                          lStdMinLen +
                          'mm.)';
                      } else {
                        lErrorMsg =
                          'Invalid data entered. The minimum hook length is ' +
                          lStdMinLen +
                          'mm for standard ' +
                          lStdFormer +
                          'mm former, ' +
                          lNonMinLen +
                          'mm for non-standard ' +
                          lNonFormer +
                          'mm former. \n(输入数据无效, 标准曲模' +
                          lStdFormer +
                          'mm的最小弯曲长度为 ' +
                          lStdMinLen +
                          'mm. 非标准曲模' +
                          lNonFormer +
                          'mm的最小弯曲长度为 ' +
                          lNonMinLen +
                          'mm.)';
                      }
                      lReturn = false;
                    } else {
                      if (
                        parseInt(lPinSize) != parseInt(lNonFormer.toString())
                      ) {
                        if (pDataEntry == 1) {
                          var lRes = confirm(
                            'The minimum hook length is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former. Do you want to change the former to non-standrad ' +
                            lNonFormer +
                            'mm former with minimum bending length ' +
                            lNonMinLen +
                            'mm? \n' +
                            '标准曲模' +
                            lStdFormer +
                            'mm的最小弯曲长度为 ' +
                            lStdMinLen +
                            'mm. 请确认是否换成非标准曲模' +
                            lNonFormer +
                            'mm, 其最小弯曲长度为 ' +
                            lNonMinLen +
                            'mm?'
                          );
                          if (lRes == true) {
                            pItem['PinSize'] = lNonFormer;
                          } else {
                            lErrorMsg =
                              'Invalid data entered. The minimum bending length is ' +
                              lStdMinLen +
                              'mm for standard ' +
                              lStdFormer +
                              'mm former, ' +
                              lNonMinLen +
                              'mm for non-standard ' +
                              lNonFormer +
                              'mm former. \n(输入数据无效, 标准曲模' +
                              lStdFormer +
                              'mm的最小弯曲长度为 ' +
                              lStdMinLen +
                              'mm. 非标准曲模' +
                              lNonFormer +
                              'mm的最小弯曲长度为 ' +
                              lNonMinLen +
                              'mm.)';
                            lReturn = false;
                          }
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former, ' +
                            lNonMinLen +
                            'mm for non-standard ' +
                            lNonFormer +
                            'mm former. \n(输入数据无效, 标准曲模' +
                            lStdFormer +
                            'mm的最小弯曲长度为 ' +
                            lStdMinLen +
                            'mm. 非标准曲模' +
                            lNonFormer +
                            'mm的最小弯曲长度为 ' +
                            lNonMinLen +
                            'mm.)';
                          lReturn = false;
                        }
                      }
                    }
                  }
                  //break;
                }
              }

              //Check various parameters range
              if (
                (lParamType == 'S' || lParamType == 'HK') &&
                isNaN(pValue) &&
                pValue.indexOf('-') >= 0
              ) {
                var lMax = this.getVarMaxValue(pValue);
                var lMin = this.getVarMinValue(pValue);

                if (lMax <= 0 || lMin <= 0 || lMin == lMax) {
                  lErrorMsg =
                    'Invalid data entered. Please enter valid numeric range.(输入数据无效, 请输入数字范围)';
                  lReturn = false;
                }
                var lMbrQty = pItem['BarMemberQty'];
                if (lMbrQty > 1) {
                  var lHeight = Math.round((lMax - lMin) / (lMbrQty - 1));
                  if (lHeight < 18) {
                    var lCheckLen = true;
                    var llen = this.calTotalLen(pItem, pColumnName, pValue);
                    if (llen != null) {
                      lMax = this.getVarMaxValue(llen);
                      lMin = this.getVarMinValue(llen);
                      if (lMax > 0 || lMin > 0 || lMin < lMax) {
                        lCheckLen = false;
                        lHeight = Math.round((lMax - lMin) / (lMbrQty - 1));
                        if (lHeight < 18) {
                          lCheckLen = true;
                        }
                      }
                    }
                    if (lCheckLen == true) {
                      var lSuMQty = Math.round(lMbrQty / 2);
                      var lSuEqty = pItem['BarEachQty'] * 2;
                      if (
                        lMbrQty == lSuMQty * 2 &&
                        Math.round((lMax - lMin) / (lSuMQty - 1)) >= 18
                      ) {
                        lErrorMsg =
                          'Invalid data entered. Difference of various bars is less than 20mm minimum limit. Please reduce Member Qty and increase Each Qty. For example, member qty is reduced to ' +
                          lSuMQty +
                          ' and each qty is increased to ' +
                          lSuEqty +
                          '. (输入数据无效, 可变钢筋的差值已小于20mm的最小值. 请减少构件数并且增加单件数, 例如构件数减少为' +
                          lSuMQty +
                          ' 单件数增加为' +
                          lSuEqty +
                          ')';
                      } else {
                        lErrorMsg =
                          'Invalid data entered. Difference of various bars is less than 20mm minimum limit. Please reduce Member Qty and increase Each Qty. (输入数据无效, 可变钢筋的差值已小于20mm的最小值. 请减少构件数并且增加单件数)';
                      }
                      lReturn = false;
                    }
                  }
                } else {
                  lErrorMsg =
                    'Invalid data entered on Member Qty field. It should be greater than 1 for varied length bars.(构建数输入数据无效. 对变长钢筋而言,它应该大于1)';
                  lReturn = false;
                }
              }

              if (
                (lParamType == 'S' || lParamType == 'HK') &&
                pParameters != 'A'
              ) {
                //Min Len validation
                var lStdMinLen = this.getValueByDia(lDiaAR, pDia, lMinLenAR);
                if (lStdMinLen > 0) {
                  if (this.getVarMinValue(pValue) < lStdMinLen) {
                    var lNonMinLen = this.getValueByDia(
                      lNonDiaAR,
                      pDia,
                      lNonMinLenAR
                    );
                    var lStdFormer = this.getValueByDia(
                      lDiaAR,
                      pDia,
                      lStdFormerAR
                    );
                    var lNonFormer = this.getValueByDia(
                      lNonDiaAR,
                      pDia,
                      lNonFormerAR
                    );
                    if (this.getVarMinValue(pValue) < lNonMinLen) {
                      if (lStdFormer == lNonFormer) {
                        lErrorMsg =
                          'Invalid data entered. The minimum bending length is ' +
                          lStdMinLen +
                          'mm for ' +
                          lStdFormer +
                          'mm former. \n(输入数据无效, 曲模' +
                          lStdFormer +
                          'mm的最小弯曲长度为 ' +
                          lStdMinLen +
                          'mm.)';
                      } else {
                        lErrorMsg =
                          'Invalid data entered. The minimum bending length is ' +
                          lStdMinLen +
                          'mm for standard ' +
                          lStdFormer +
                          'mm former, ' +
                          lNonMinLen +
                          'mm for non-standard ' +
                          lNonFormer +
                          'mm former. \n(输入数据无效, 标准曲模' +
                          lStdFormer +
                          'mm的最小弯曲长度为 ' +
                          lStdMinLen +
                          'mm. 非标准曲模' +
                          lNonFormer +
                          'mm的最小弯曲长度为 ' +
                          lNonMinLen +
                          'mm.)';
                      }
                      lReturn = false;
                    } else {
                      if (
                        parseInt(lPinSize) != parseInt(lNonFormer.toString())
                      ) {
                        if (pDataEntry == 1) {
                          var lRes = confirm(
                            'The minimum bending length is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former. Do you want to change the former to non-standrad ' +
                            lNonFormer +
                            'mm former with minimum bending length ' +
                            lNonMinLen +
                            'mm? \n' +
                            '标准曲模' +
                            lStdFormer +
                            'mm的最小弯曲长度为 ' +
                            lStdMinLen +
                            'mm. 请确认是否换成非标准曲模' +
                            lNonFormer +
                            'mm, 其最小弯曲长度为 ' +
                            lNonMinLen +
                            'mm?'
                          );
                          if (lRes == true) {
                            pItem['PinSize'] = lNonFormer;
                          } else {
                            lErrorMsg =
                              'Invalid data entered. The minimum bending length is ' +
                              lStdMinLen +
                              'mm for standard ' +
                              lStdFormer +
                              'mm former, ' +
                              lNonMinLen +
                              'mm for non-standard ' +
                              lNonFormer +
                              'mm former. \n(输入数据无效, 标准曲模' +
                              lStdFormer +
                              'mm的最小弯曲长度为 ' +
                              lStdMinLen +
                              'mm. 非标准曲模' +
                              lNonFormer +
                              'mm的最小弯曲长度为 ' +
                              lNonMinLen +
                              'mm.)';
                            lReturn = false;
                          }
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former, ' +
                            lNonMinLen +
                            'mm for non-standard ' +
                            lNonFormer +
                            'mm former. \n(输入数据无效, 标准曲模' +
                            lStdFormer +
                            'mm的最小弯曲长度为 ' +
                            lStdMinLen +
                            'mm. 非标准曲模' +
                            lNonFormer +
                            'mm的最小弯曲长度为 ' +
                            lNonMinLen +
                            'mm.)';
                          lReturn = false;
                        }
                      }
                    }
                  }

                  // check 061/079/79A leg
                  if (pItem['BarShapeCode'] != null) {
                    var lShapeCode = pItem['BarShapeCode'].trim();
                    if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;

                    if (
                      lShapeCode == '079' &&
                      (pColumnName == 'C' || pColumnName == 'D') &&
                      pItem['A'] != null
                    ) {
                      if (parseInt(pValue) > parseInt(pItem['A'])) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 079, its leg length cannot be more then parameter A . (输入数据无效, 对图形079而言, 脚长不可超过其A边的长度)';
                        lReturn = false;
                        break;
                      }
                    }
                    if (
                      lShapeCode == '079' &&
                      pColumnName == 'A' &&
                      pItem['C'] != null &&
                      pItem['D'] != null
                    ) {
                      if (
                        parseInt(pValue) < parseInt(pItem['C']) ||
                        parseInt(pValue) < parseInt(pItem['D'])
                      ) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 079, parameter A cannot be less then its leg length C and D. (输入数据无效, 对图形079而言, A边的长度不可小过其脚长C或D)';
                        lReturn = false;
                        break;
                      }
                    }

                    if (lShapeCode == '061' && pColumnName == 'C') {
                      if (parseInt(pValue) > parseInt(pItem['B'])) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 061, its leg length C cannot be more then parameter B . (输入数据无效, 对图形061而言, 脚长C不可超过其B边的长度)';
                        lReturn = false;
                        break;
                      }
                    }
                    if (lShapeCode == '061' && pColumnName == 'D') {
                      if (parseInt(pValue) > parseInt(pItem['A'])) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 061, its leg length D cannot be more then parameter A . (输入数据无效, 对图形061而言, 脚长D不可超过其A边的长度)';
                        lReturn = false;
                        break;
                      }
                    }
                    if (
                      lShapeCode == '061' &&
                      pColumnName == 'A' &&
                      pItem['D'] != null
                    ) {
                      if (parseInt(pValue) < parseInt(pItem['D'])) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 061, parameter A cannot be less than its leg length D. (输入数据无效, 对图形061而言, 边长A不可小过其脚长D)';
                        lReturn = false;
                        break;
                      }
                    }
                    if (
                      lShapeCode == '061' &&
                      pColumnName == 'B' &&
                      pItem['C'] != null
                    ) {
                      if (parseInt(pValue) < parseInt(pItem['C'])) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 061, parameter B cannot be less than its leg length C. (输入数据无效, 对图形061而言, 边长B不可小过其脚长C)';
                        lReturn = false;
                        break;
                      }
                    }
                    if (
                      lShapeCode == '79A' &&
                      pColumnName == 'C' &&
                      pItem['A'] != null
                    ) {
                      if (parseInt(pValue) > parseInt(pItem['A'])) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 79A, its leg length C cannot be more then parameter A . (输入数据无效, 对图形79A而言, 脚长C不可超过其A边的长度)';
                        lReturn = false;
                        break;
                      }
                    }
                    if (
                      lShapeCode == '79A' &&
                      pColumnName == 'A' &&
                      pItem['C'] != null
                    ) {
                      if (parseInt(pValue) < parseInt(pItem['C'])) {
                        lErrorMsg =
                          'Invalid data entered. For shape code 79A, its parameter A cannot be less than its leg C length. (输入数据无效, 对图形79A而言, A边的长度不可小过其脚长C)';
                        lReturn = false;
                        break;
                      }
                    }
                  }
                  //break;
                }
              }

              //check 8mm maximum segment length
              if (
                (lParamType == 'S' || lParamType == 'HK') &&
                pParameters != 'A' &&
                pDia == 8
              ) {
                if (this.getVarMaxValue(pValue) > 1800) {
                  lErrorMsg =
                    'Invalid data entered. The maximum segment length is 1800mm for 8mm bar. (输入数据无效. 对8mm钢筋, 最大节长为1800mm)';
                  lReturn = false;
                  break;
                }
              }

              var lShapeCode = pItem['BarShapeCode'].trim();
              if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;

              //if (pItem["BarShapeCode"] != null && pItem["BarShapeCode"] == "R7A" && pDia >= 16 && pColumnName == "C") {
              if (
                lShapeCode != null &&
                lShapeCode == 'R7A' &&
                pColumnName == 'C'
              ) {
                if (parseInt(pValue) > 500) {
                  //lErrorMsg = "Invalid data entered. For shape code R7A and Diameter 16mm, its parameter C (Height) cannot be more than 500mm. (输入数据无效, 对图形R7A并且直径16mm的钢, 参数C(高度)不可超过500mm)";
                  lErrorMsg =
                    'Invalid data entered. For shape code R7A, its parameter C (Height) cannot be more than 500mm. (输入数据无效, 对图形R7A, 参数C(高度)不可超过500mm)';
                  lReturn = false;
                  break;
                }
              }
              if (
                lShapeCode != null &&
                lShapeCode == 'R7A' &&
                pColumnName == 'A'
              ) {
                if (parseInt(pValue) > 900) {
                  lErrorMsg =
                    'Invalid data entered. For shape code R7A, its parameter A (Circular Diameter) cannot be more than 900mm. (输入数据无效, 对图形R7A, 参数A不可超过900mm)';
                  lReturn = false;
                  break;
                }
                if (parseInt(pValue) < 200) {
                  lErrorMsg =
                    'Invalid data entered. For shape code R7A, its parameter A (Circular Diameter) cannot be less than 200mm. (输入数据无效, 对图形R7A, 参数A不可小于200mm)';
                  lReturn = false;
                  break;
                }
              }

              if (
                lShapeCode != null &&
                lShapeCode == '039' &&
                pColumnName == 'A'
              ) {
                if (
                  pDia <= 20 &&
                  this.getVarMaxValue(pValue) > 3500 &&
                  this.getVarMaxValue(pItem['C']) > 3500
                ) {
                  lErrorMsg =
                    'Invalid data entered. For shape 39 with diameter <= 20mm, it does not allow both value of parameter A and C greater than 3500mm. (输入数据无效, 对直径 <= 20mm 的图形 39, 不允许参数 A 和 C 的值都大于 3500mm)';
                  lReturn = false;
                  break;
                }
                if (
                  pDia > 20 &&
                  this.getVarMaxValue(pValue) > 2500 &&
                  this.getVarMaxValue(pItem['C']) > 2500
                ) {
                  lErrorMsg =
                    'Invalid data entered. For shape 39 with diameter >= 25mm, it does not allow both value of parameter A and C greater than 2500mm. (输入数据无效, 对直径 >= 25mm 的图形 39, 不允许参数 A 和 C 的值都大于 2500mm)';
                  lReturn = false;
                  break;
                }
              }
              if (
                lShapeCode != null &&
                lShapeCode == '039' &&
                pColumnName == 'C'
              ) {
                if (
                  pDia <= 20 &&
                  this.getVarMaxValue(pValue) > 3500 &&
                  this.getVarMaxValue(pItem['A']) > 3500
                ) {
                  lErrorMsg =
                    'Invalid data entered. For shape 39 with diameter <= 20mm, it does not allow both value of parameter A and C greater than 3500mm. (输入数据无效, 对直径 <= 20mm 的图形 39, 不允许参数 A 和 C 的值都大于 3500mm)';
                  lReturn = false;
                  break;
                }
                if (
                  pDia > 20 &&
                  this.getVarMaxValue(pValue) > 2500 &&
                  this.getVarMaxValue(pItem['A']) > 2500
                ) {
                  lErrorMsg =
                    'Invalid data entered. For shape 39 with diameter >= 25mm, it does not allow both value of parameter A and C greater than 2500mm. (输入数据无效, 对直径 >= 25mm 的图形 39, 不允许参数 A 和 C 的值都大于 2500mm)';
                  lReturn = false;
                  break;
                }
              }

              if (
                lShapeCode != null &&
                lShapeCode == '314' &&
                pColumnName == 'B' &&
                pDia >= 40 &&
                pValue < 400
              ) {
                lErrorMsg =
                  'Invalid data entered. For shape 314 with diameter >= 40mm, minimum value of parameter B is 400mm. (输入数据无效, 对直径40mm的图形 314, 参数B的最小值为 400mm)';
                lReturn = false;
                break;
              }

              if (
                lShapeCode != null &&
                lShapeCode.length >= 3 &&
                this.getVarMinValue(pValue) < 700 &&
                lShapeCode != 'H1I' &&
                lShapeCode != 'K1J' &&
                lShapeCode != 'H1K' &&
                lShapeCode != 'C1N' &&
                lShapeCode != 'P1S'
              ) {
                var lFirst = lShapeCode.substring(0, 2);
                var lLast = lShapeCode.substring(2, 3);
                if (
                  ((lFirst == 'H1' ||
                    lFirst == 'I1' ||
                    lFirst == 'J1' ||
                    lFirst == 'K1') &&
                    (lLast == 'H' ||
                      lLast == 'I' ||
                      lLast == 'J' ||
                      lLast == 'K')) ||
                  ((lFirst == 'C1' ||
                    lFirst == 'S1' ||
                    lFirst == 'P1' ||
                    lFirst == 'N1') &&
                    (lLast == 'C' ||
                      lLast == 'S' ||
                      lLast == 'P' ||
                      lLast == 'N'))
                ) {
                  var lMinValue = this.getVarMinValue(pValue);
                  if (pDia <= 25 && lMinValue < 550) {
                    lErrorMsg =
                      'The minimum length is 550mm for coupler bar with 2 ends. (两头都有续接器的钢筋,其最小长度为550mm)';
                    lReturn = false;
                    break;
                  }
                  if (pDia > 25 && pDia <= 32 && lMinValue < 650) {
                    lErrorMsg =
                      'The minimum length is 650mm for coupler bar with 2 ends, diameter 32mm. (两头都有续接器, 直径为32mm的钢筋,其最小长度为650mm)';
                    lReturn = false;
                    break;
                  }
                  if (pDia > 32 && lMinValue < 700) {
                    lErrorMsg =
                      'The minimum length is 700mm for coupler bar with 2 ends, diameter 40mm and 50mm. (两头都有续接器, 直径为40mm,50mm的钢筋,其最小长度为700mm)';
                    lReturn = false;
                    break;
                  }
                }
              }

              if (
                lShapeCode != null &&
                lShapeCode.length >= 3 &&
                this.getVarMinValue(pValue) < 500
              ) {
                if (
                  lShapeCode == 'H20' ||
                  lShapeCode == 'I20' ||
                  lShapeCode == 'J20' ||
                  lShapeCode == 'K20' ||
                  lShapeCode == 'C20' ||
                  lShapeCode == 'S20' ||
                  lShapeCode == 'P20' ||
                  lShapeCode == 'N20'
                ) {
                  lErrorMsg =
                    'The minimum length is 500mm for coupler bar with 1 end. (有续接器的钢筋,其最小长度为500mm)';
                  lReturn = false;
                  break;
                }
              }

              if (lParamType == 'R') {
                let lShapeCode: any = '';
                if (pItem['BarShapeCode'] != null) {
                  let lShapeCode = pItem['BarShapeCode'].trim();
                }
                if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;

                if (lShapeCode == 'R84') {
                  //Min Len validation
                  var lStdMinLen = this.getValueByDia(lDiaAR, pDia, lMinLenAR);
                  if (lStdMinLen > 0) {
                    if (this.getVarMinValue(pValue) < lStdMinLen) {
                      var lNonMinLen = this.getValueByDia(
                        lNonDiaAR,
                        pDia,
                        lNonMinLenAR
                      );
                      var lStdFormer = this.getValueByDia(
                        lDiaAR,
                        pDia,
                        lStdFormerAR
                      );
                      var lNonFormer = this.getValueByDia(
                        lNonDiaAR,
                        pDia,
                        lNonFormerAR
                      );
                      if (this.getVarMinValue(pValue) < lNonMinLen) {
                        if (lStdFormer == lNonFormer) {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length is ' +
                            lStdMinLen +
                            'mm for ' +
                            lStdFormer +
                            'mm former. \n(输入数据无效, 曲模' +
                            lStdFormer +
                            'mm的最小弯曲长度为 ' +
                            lStdMinLen +
                            'mm.)';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum bending length is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former, ' +
                            lNonMinLen +
                            'mm for non-standard ' +
                            lNonFormer +
                            'mm former. \n(输入数据无效, 标准曲模' +
                            lStdFormer +
                            'mm的最小弯曲长度为 ' +
                            lStdMinLen +
                            'mm. 非标准曲模' +
                            lNonFormer +
                            'mm的最小弯曲长度为 ' +
                            lNonMinLen +
                            'mm.)';
                        }
                        lReturn = false;
                      } else {
                        if (
                          parseInt(lPinSize) > parseInt(lNonFormer.toString())
                        ) {
                          if (pDataEntry == 1) {
                            var lRes = confirm(
                              'The minimum bending length is ' +
                              lStdMinLen +
                              'mm for standard ' +
                              lStdFormer +
                              'mm former. Do you want to change the former to non-standrad ' +
                              lNonFormer +
                              'mm former with minimum bending length ' +
                              lNonMinLen +
                              'mm? \n' +
                              '标准曲模' +
                              lStdFormer +
                              'mm的最小弯曲长度为 ' +
                              lStdMinLen +
                              'mm. 请确认是否换成非标准曲模' +
                              lNonFormer +
                              'mm, 其最小弯曲长度为 ' +
                              lNonMinLen +
                              'mm?'
                            );
                            if (lRes == true) {
                              pItem['PinSize'] = lNonFormer;
                            } else {
                              lErrorMsg =
                                'Invalid data entered. The minimum bending length is ' +
                                lStdMinLen +
                                'mm for standard ' +
                                lStdFormer +
                                'mm former, ' +
                                lNonMinLen +
                                'mm for non-standard ' +
                                lNonFormer +
                                'mm former. \n(输入数据无效, 标准曲模' +
                                lStdFormer +
                                'mm的最小弯曲长度为 ' +
                                lStdMinLen +
                                'mm. 非标准曲模' +
                                lNonFormer +
                                'mm的最小弯曲长度为 ' +
                                lNonMinLen +
                                'mm.)';
                              lReturn = false;
                            }
                          } else {
                            lErrorMsg =
                              'Invalid data entered. The minimum bending length is ' +
                              lStdMinLen +
                              'mm for standard ' +
                              lStdFormer +
                              'mm former, ' +
                              lNonMinLen +
                              'mm for non-standard ' +
                              lNonFormer +
                              'mm former. \n(输入数据无效, 标准曲模' +
                              lStdFormer +
                              'mm的最小弯曲长度为 ' +
                              lStdMinLen +
                              'mm. 非标准曲模' +
                              lNonFormer +
                              'mm的最小弯曲长度为 ' +
                              lNonMinLen +
                              'mm.)';
                            lReturn = false;
                          }
                        }
                      }
                    }
                  }
                } else {
                  //Hook limimum height validation
                  var lStdMinLen = this.getValueByDia(lDiaAR, pDia, lMinHtHkAR);
                  if (lStdMinLen > 0) {
                    if (this.getVarMinValue(pValue) < lStdMinLen) {
                      var lNonMinLen = this.getValueByDia(
                        lNonDiaAR,
                        pDia,
                        lNonMinHtHkAR
                      );
                      var lStdFormer = this.getValueByDia(
                        lDiaAR,
                        pDia,
                        lStdFormerAR
                      );
                      var lNonFormer = this.getValueByDia(
                        lNonDiaAR,
                        pDia,
                        lNonFormerAR
                      );
                      if (this.getVarMinValue(pValue) < lNonMinLen) {
                        if (lStdFormer == lNonFormer) {
                          lErrorMsg =
                            'Invalid data entered. The minimum hook height is ' +
                            lStdMinLen +
                            'mm for ' +
                            lStdFormer +
                            'mm former. \n(输入数据无效, 曲模' +
                            lStdFormer +
                            'mm的最小铁钩高度为 ' +
                            lStdMinLen +
                            'mm.)';
                        } else {
                          lErrorMsg =
                            'Invalid data entered. The minimum hook height is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former, ' +
                            lNonMinLen +
                            'mm for non-standard ' +
                            lNonFormer +
                            'mm former. \n(输入数据无效, 标准曲模' +
                            lStdFormer +
                            'mm的最小铁钩高度为 ' +
                            lStdMinLen +
                            'mm. 非标准曲模' +
                            lNonFormer +
                            'mm的最小铁钩高度为 ' +
                            lNonMinLen +
                            'mm.)';
                        }
                        lReturn = false;
                      } else {
                        if (
                          parseInt(lPinSize) > parseInt(lNonFormer.toString())
                        ) {
                          if (pDataEntry == 1) {
                            var lRes = confirm(
                              'The minimum hook height is ' +
                              lStdMinLen +
                              'mm for standard ' +
                              lStdFormer +
                              'mm former. Do you want to change the former to non-standrad ' +
                              lNonFormer +
                              'mm former with minimum hook height ' +
                              lNonMinLen +
                              'mm? \n' +
                              '标准曲模' +
                              lStdFormer +
                              'mm的最小铁钩高度为 ' +
                              lStdMinLen +
                              'mm. 请确认是否换成非标准曲模' +
                              lNonFormer +
                              'mm, 其最小铁钩高度为 ' +
                              lNonMinLen +
                              'mm?'
                            );
                            if (lRes == true) {
                              pItem['PinSize'] = lNonFormer;
                            } else {
                              lErrorMsg =
                                'Invalid data entered. The minimum hook height is ' +
                                lStdMinLen +
                                'mm for standard ' +
                                lStdFormer +
                                'mm former, ' +
                                lNonMinLen +
                                'mm for non-standard ' +
                                lNonFormer +
                                'mm former. (输入数据无效, 标准曲模' +
                                lStdFormer +
                                'mm的最小铁钩高度为 ' +
                                lStdMinLen +
                                'mm. 非标准曲模' +
                                lNonFormer +
                                'mm的最小铁钩高度为 ' +
                                lNonMinLen +
                                'mm.)';
                              lReturn = false;
                            }
                          } else {
                            lErrorMsg =
                              'Invalid data entered. The minimum hook height is ' +
                              lStdMinLen +
                              'mm for standard ' +
                              lStdFormer +
                              'mm former, ' +
                              lNonMinLen +
                              'mm for non-standard ' +
                              lNonFormer +
                              'mm former. (输入数据无效, 标准曲模' +
                              lStdFormer +
                              'mm的最小铁钩高度为 ' +
                              lStdMinLen +
                              'mm. 非标准曲模' +
                              lNonFormer +
                              'mm的最小铁钩高度为 ' +
                              lNonMinLen +
                              'mm.)';
                            lReturn = false;
                          }
                        }
                      }
                    }
                    break;
                  }
                }
              }

              if (lParamType == 'H' || lParamType == 'O') {
                //Height validation
                if (
                  this.getVarMinValue(pValue) <
                  parseInt(pDia) +
                  parseInt(pDia) -
                  Math.round(parseInt(pDia) / 2)
                ) {
                  // less than dia + 10 (first dia)
                  lErrorMsg =
                    'Invalid data entered. The height is measured with out-out, its minimum height is ' +
                    (parseInt(pDia) +
                      parseInt(pDia) -
                      Math.round(parseInt(pDia) / 2)) +
                    '. (输入数据无效, 高度是从铁的外边度量, 其最小值为' +
                    (parseInt(pDia) +
                      parseInt(pDia) -
                      Math.round(parseInt(pDia) / 2)) +
                    ')';
                  lReturn = false;
                  break;
                }
                var lHypo = pItem[lHeightCheckAR[i]];
                var lHypoMax = this.getVarMaxValue(lHypo);
                var lHypoMin = this.getVarMinValue(lHypo);

                let lShapeCode: any = '';
                if (pItem['BarShapeCode'] != null) {
                  lShapeCode = pItem['BarShapeCode'].trim();
                }
                if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;

                if (
                  lHypoMax > 0 &&
                  lShapeCode.Length > 0 &&
                  lShapeCode.Substring(0, 1) != 'R'
                ) {
                  //Sathiya found the height will greater than hypo when angle greater than 90.
                  //for save, it plus Dia and half of Pin
                  //2018-09-10

                  if (
                    this.getVarMaxValue(pValue) >
                    lHypoMax +
                    parseInt(pDia) +
                    Math.round(
                      (parseInt(lPinSize) * parseInt(lPinSize)) / lHypoMax
                    )
                  ) {
                    // Greater than 90
                    lErrorMsg =
                      'Invalid data entered. Height can not be more than its adjusted hypotenuse length (' +
                      (
                        lHypoMax +
                        parseInt(pDia) +
                        Math.round(
                          (parseInt(lPinSize) * parseInt(lPinSize)) / lHypoMax
                        )
                      ).toString() +
                      '). (输入数据无效, 高度不应该大于其斜边调整后的长度 (' +
                      (
                        lHypoMax +
                        parseInt(pDia) +
                        Math.round(
                          (parseInt(lPinSize) * parseInt(lPinSize)) / lHypoMax
                        )
                      ).toString() +
                      ').';
                    lReturn = false;
                    break;
                  }
                }
                if (
                  lHypoMin > 0 &&
                  lShapeCode.Length > 0 &&
                  lShapeCode.Substring(0, 1) != 'R'
                ) {
                  //Sathiya found the height will greater than hypo when angle greater than 90.
                  //for save, it plus Dia and half of Pin
                  //2018-09-10

                  if (
                    this.getVarMinValue(pValue) >
                    lHypoMin +
                    parseInt(pDia) +
                    Math.round(
                      (parseInt(lPinSize) * parseInt(lPinSize)) / lHypoMin
                    )
                  ) {
                    // Greater than 90
                    lErrorMsg =
                      'Invalid data entered. Height can not be more than its adjusted hypotenuse length (' +
                      (
                        lHypoMin +
                        parseInt(pDia) +
                        Math.round(
                          (parseInt(lPinSize) * parseInt(lPinSize)) / lHypoMin
                        )
                      ).toString() +
                      '). (输入数据无效, 高度不应该大于其斜边调整后的长度 (' +
                      (
                        lHypoMin +
                        parseInt(pDia) +
                        Math.round(
                          (parseInt(lPinSize) * parseInt(lPinSize)) / lHypoMin
                        )
                      ).toString() +
                      ').';
                    lReturn = false;
                    break;
                  }
                }
              }
              if (lParamType == 'V') {
                var lDefValue = lDefaultValueAR[i];
                if (
                  lDefValue != null &&
                  isNaN(lDefValue) == false &&
                  lDefValue >= 80 &&
                  lDefValue < 90
                ) {
                  //Angle validation 1-179
                  if (parseInt(pValue) >= 180 || parseInt(pValue) <= 0) {
                    lErrorMsg =
                      'Invalid data entered. The angle value should be between 1-179. (输入数据无效, 角度的数值应该在 1-179 之间)';
                    lReturn = false;
                    break;
                  }
                }
                if (
                  lDefValue != null &&
                  isNaN(lDefValue) == false &&
                  lDefValue < 80
                ) {
                  //Angle validation 1-89
                  if (parseInt(pValue) >= 90 || parseInt(pValue) <= 0) {
                    lErrorMsg =
                      'Invalid data entered. The angle value should be between 1-89. (输入数据无效, 角度的数值应该在 1-89 之间)';
                    lReturn = false;
                    break;
                  }
                }
                if (
                  lDefValue != null &&
                  isNaN(lDefValue) == false &&
                  lDefValue > 90 &&
                  lDefValue < 100
                ) {
                  //Angle validation 91-179
                  if (parseInt(pValue) >= 180 || parseInt(pValue) <= 0) {
                    lErrorMsg =
                      'Invalid data entered. The angle value should be between 1-179. (输入数据无效, 角度的数值应该在 1-179 之间)';
                    lReturn = false;
                    break;
                  }
                }
                if (
                  lDefValue != null &&
                  isNaN(lDefValue) == false &&
                  lDefValue >= 100
                ) {
                  //Angle validation 91-179
                  if (parseInt(pValue) >= 180 || parseInt(pValue) <= 90) {
                    lErrorMsg =
                      'Invalid data entered. The angle value should be between 91-179. (输入数据无效, 角度的数值应该在 91-179 之间)';
                    lReturn = false;
                    break;
                  }
                }
              }

              //Arc Reduis Validation
              if (lParamType == 'RL') {
                var lStdFormer = this.getValueByDia(lDiaAR, pDia, lStdFormerAR);
                if (this.getVarMinValue(pValue) <= Math.ceil(lStdFormer / 2)) {
                  // Arc Reduis should greater than standard form
                  lErrorMsg =
                    'Invalid data entered. The arc raduis should be greater than the standard pin raduis (' +
                    Math.ceil(lStdFormer / 2) +
                    '). You also can choose another similar shape with standard bending. (输入数据无效, 圆弧半径应大于标准曲模半径 ' +
                    Math.ceil(lStdFormer / 2) +
                    '. 您也可以选择其他类似的标准弯曲图形.)';
                  lReturn = false;
                  break;
                }
              }

              //Min Length Validation
              if (
                pItem['BarShapeCode'] == '20' ||
                pItem['BarShapeCode'] == '020'
              ) {
                if (pDia == 8) {
                  if (
                    this.getVarMaxValue(pValue) > 1800 &&
                    this.getVarMaxValue(pValue) != 6000
                  ) {
                    lErrorMsg =
                      'Invalid data entered. The miaximum length for straight bar is ' +
                      '1800mm for diameter ' +
                      pDia +
                      'mm. \n(输入数据无效, ' +
                      pDia +
                      'mm铁的最大长度为 1800mm.)';
                    lReturn = false;
                  }
                }
                if (pDia < 13) {
                  if (this.getVarMinValue(pValue) < 25) {
                    lErrorMsg =
                      'Invalid data entered. The minimum length for straight bar is ' +
                      '25mm for diameter ' +
                      pDia +
                      'mm. \n(输入数据无效, ' +
                      pDia +
                      'mm铁的最小长度为 25mm.)';
                    lReturn = false;
                  }
                } else if (pDia < 20) {
                  if (this.getVarMinValue(pValue) < 50) {
                    lErrorMsg =
                      'Invalid data entered. The minimum length for straight bar is ' +
                      '50mm for diameter ' +
                      pDia +
                      'mm. \n(输入数据无效, ' +
                      pDia +
                      'mm铁的最小长度为 50mm.)';
                    lReturn = false;
                  }
                } else if (pDia <= 25) {
                  if (this.getVarMinValue(pValue) < 180) {
                    lErrorMsg =
                      'Invalid data entered. The minimum length for straight bar is ' +
                      '180mm for diameter ' +
                      pDia +
                      'mm. \n(输入数据无效, ' +
                      pDia +
                      'mm铁的最小长度为 180mm.)';
                    lReturn = false;
                  }
                } else if (pDia < 40) {
                  if (this.getVarMinValue(pValue) < 180) {
                    lErrorMsg =
                      'Invalid data entered. The minimum length for straight bar is ' +
                      '180mm for diameter ' +
                      pDia +
                      'mm. \n(输入数据无效, ' +
                      pDia +
                      'mm铁的最小长度为 180mm.)';
                    lReturn = false;
                  }
                } else if (pDia < 50) {
                  if (this.getVarMinValue(pValue) < 500) {
                    lErrorMsg =
                      'Invalid data entered. The minimum length for straight bar is ' +
                      '500mm for diameter ' +
                      pDia +
                      'mm. \n(输入数据无效, ' +
                      pDia +
                      'mm铁的最小长度为 500mm.)';
                    lReturn = false;
                  }
                } else {
                  if (this.getVarMinValue(pValue) < 1000) {
                    lErrorMsg =
                      'Invalid data entered. The minimum length for straight bar is ' +
                      '1000mm for diameter ' +
                      pDia +
                      'mm. \n(输入数据无效, ' +
                      pDia +
                      'mm铁的最小长度为 1000mm.)';
                    lReturn = false;
                  }
                }
              }
            }

            if (
              lReturn != false &&
              this.gAddParType != null &&
              this.gAddParType.length > 0
            ) {
              for (m = 0; m < this.gAddParType.length; m++) {
                if (
                  this.gAddParType[m] == lParamType &&
                  this.gAddParDia[m] == pDia
                ) {
                  if (this.getVarMinValue(pValue) < this.gAddParBendLenMin[m]) {
                    lErrorMsg =
                      'Invalid data entered.  For bar diameter ' +
                      pDia +
                      ', ' +
                      'the minimum value of parameter ' +
                      pColumnName +
                      ' is ' +
                      this.gAddParBendLenMin[m] +
                      'mm. \n(输入数据无效, 对直径为' +
                      pDia +
                      'mm的钢筋, 其参数' +
                      pColumnName +
                      '的最小值为 ' +
                      this.gAddParBendLenMin[m] +
                      'mm.)';
                    lReturn = false;
                  }
                  break;
                }
              }
            }
          }
        }
      }
    }
    msgRef.msg = lErrorMsg;
    return lReturn;
  }

  getValueByDia(pDiaAR: any, pDia: any, pLimitAR: any) {
    var lResult = 0;
    for (var i = 0; i < pDiaAR.length; i++) {
      if (pDia == pDiaAR[i]) {
        lResult = pLimitAR[i];
        break;
      }
    }
    return lResult;
  }

  grid_onSort(e: any, args: any) {
    let dataView = this.dataViewCAB;

    this.sortdirArray[this.gridIndex] = args.sortAsc ? 1 : -1;
    this.sortcolArray[this.gridIndex] = args.sortCol.field;

    if (this.isIEPreVer9()) {
      // using temporary Object.prototype.toString override
      // more limited and does lexicographic sort only by default, but can be much faster

      var percentCompleteValueFn = () => {
        const propertyName = 'percentComplete';
        const val = (this as any)[propertyName];
        if (val < 10) {
          return '00' + val;
        } else if (val < 100) {
          return '0' + val;
        } else {
          return val;
        }
      };

      // use numeric sort of % and lexicographic for everything else

      // dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc); //???
    } else {
      // using native sort with comparer
      // preferred method but can be very slow in IE with huge datasets
      // dataView.sort(comparer, args.sortAsc); //???
    }
  }

  isIEPreVer9() {
    let v: any = navigator.appVersion.match(/MSIE ([\d.]+)/i);
    return v ? v[1] < 9 : false;
  }

  getPinSize(pArgs: any) {
    let lStdFormerVal = 0;
    let lNonFormerVal = 0;

    let lStdDia = '';
    let lNonDia = '';
    let lStdFormer = '';
    let lNonFormer = '';
    let lItem = pArgs.item;
    let lShape = lItem['BarShapeCode'];
    let lType = lItem['BarType'];
    let lBarSize = lItem['BarSize'];
    let lPinOrin = lItem['PinSize'];
    if (
      lShape != null &&
      lType != null &&
      lBarSize != null &&
      lShape != '' &&
      lType != '' &&
      lBarSize != '' &&
      lItem['shapeParameters'] != 'A'
    ) {
      if (lType == 'H' || lType == 'C') {
        lStdFormer = this.gHStdFormer;
        lNonFormer = this.gHNonFormer;
        lStdDia = this.gHStdDia;
        lNonDia = this.gHNonDia;
      } else if (lType == 'R') {
        lStdFormer = this.gRStdFormer;
        lNonFormer = this.gRNonFormer;
        lStdDia = this.gRStdDia;
        lNonDia = this.gRNonDia;
      } else if (lType == 'T') {
        lStdFormer = this.gTStdFormer;
        lNonFormer = this.gTNonFormer;
        lStdDia = this.gTStdDia;
        lNonDia = this.gTNonDia;
      } else if (lType == 'E') {
        lStdFormer = this.gEStdFormer;
        lNonFormer = this.gENonFormer;
        lStdDia = this.gEStdDia;
        lNonDia = this.gENonDia;
      } else if (lType == 'N') {
        lStdFormer = this.gNStdFormer;
        lNonFormer = this.gNNonFormer;
        lStdDia = this.gNStdDia;
        lNonDia = this.gNNonDia;
      } else if (lType == 'X') {
        lStdFormer = this.gXStdFormer;
        lNonFormer = this.gXNonFormer;
        lStdDia = this.gXStdDia;
        lNonDia = this.gXNonDia;
      }
      var laStdFormer = lStdFormer.split(',');
      var laNonFormer = lNonFormer.split(',');
      var laStdDia = lStdDia.split(',');
      var laNonDia = lNonDia.split(',');
      if (laStdDia.length > 0) {
        for (let i = 0; i < laStdDia.length; i++) {
          if (laStdDia[i] == lBarSize) {
            lStdFormerVal = Number(laStdFormer[i]);
            break;
          }
        }
      }
      if (laNonDia.length > 0) {
        for (let i = 0; i < laNonDia.length; i++) {
          if (laNonDia[i] == lBarSize) {
            lNonFormerVal = Number(laNonFormer[i]);
            break;
          }
        }
      }
    }

    if (parseInt(lPinOrin) > 0) {
      if (parseInt(lPinOrin) == parseInt(lNonFormerVal.toString())) {
        lStdFormerVal = lStdFormerVal;
      }
    }
    if (lStdFormerVal == 0) {
      lStdFormerVal = 0;
    }
    return lStdFormerVal;
  }

  async creepDeduction(lMinLength: any, lData: any) {
    return await this.getCreepDedution(lMinLength, lData);
  }

  calDependValue(
    pGridID: any,
    pColumnName: any,
    pParameters: any,
    pDia: any,
    pValue: any,
    pItem: any
  ) {
    var lReturn = true;
    var lErrorMsg = '';
    if (
      pColumnName != null &&
      pColumnName != '' &&
      pParameters != null &&
      pParameters != '' &&
      pDia != null &&
      pDia != '' &&
      pDia != '0' &&
      pDia != 0 &&
      pValue != null &&
      pValue != '' &&
      pValue != '0' &&
      pValue != 0
    ) {
      var lPinSize = pItem['PinSize'];

      let lParas: any = '';
      let lFormula1AR: any = '';
      let lFormula2AR: any = '';
      let lFormula3AR: any = '';
      let lParamTypeAR: any = '';
      let lDefaultValueAR: any = '';

      if (pParameters != null) {
        lParas = pParameters.split(',');
      }
      if (pItem.shapeAutoCalcFormula1 != null) {
        lFormula1AR = pItem.shapeAutoCalcFormula1.split(',');
      }
      if (pItem.shapeAutoCalcFormula2 != null) {
        lFormula2AR = pItem.shapeAutoCalcFormula2.split(',');
      }
      if (pItem.shapeAutoCalcFormula3 != null) {
        lFormula3AR = pItem.shapeAutoCalcFormula3.split(',');
      }
      if (pItem.shapeParType != null) {
        lParamTypeAR = pItem.shapeParType.split(',');
      }
      if (pItem.shapeDefaultValue != null) {
        lDefaultValueAR = pItem.shapeDefaultValue.split(',');
      }

      var lFormula1 = '';
      var lFormula2 = '';
      var lFormula3 = '';

      if (lFormula1AR.length == lParas.length) {
        for (var i = 0; i < lFormula1AR.length; i++) {
          lFormula1 = lFormula1AR[i];
          var lParam = lParas[i];
          var lParamType = lParamTypeAR[i];
          var lDefaultValue = lDefaultValueAR[i];
          if (lFormula1.indexOf(pColumnName) >= 0) {
            var lResult = this.calFormula(
              pItem,
              pColumnName,
              pValue,
              lPinSize,
              pDia,
              lParamType,
              lDefaultValue,
              lFormula1
            );
            if (lResult != '') {
              pItem[lParam] = lResult;

              //clear the highlighted error
              var lClass = this.templateGrid.slickGrid.getCellCssStyles('error_highlight');
              if (lClass == undefined) {
                lClass = {};
              }
              if (lClass != null) {
                if (lClass[this.dataViewCAB.getRowById(pItem.id)] != null) {
                  lClass[this.dataViewCAB.getRowById(pItem.id)][lParam] = '';
                  this.templateGrid.slickGrid.setCellCssStyles(
                    'error_highlight',
                    lClass
                  );
                }
              }

              for (var j = 0; j < lFormula1AR.length; j++) {
                lFormula1 = lFormula1AR[j];
                var lParam1 = lParas[j];
                var lParamType = lParamTypeAR[j];
                var lDefaultValue = lDefaultValueAR[j];
                if (lFormula1.indexOf(lParam) >= 0 && lParam1 != pColumnName) {
                  var lResult = this.calFormula(
                    pItem,
                    lParam,
                    lResult,
                    lPinSize,
                    pDia,
                    lParamType,
                    lDefaultValue,
                    lFormula1
                  );
                  if (lResult != '') {
                    pItem[lParam1] = lResult;

                    //clear the highlighted error
                    var lClass = this.templateGrid.slickGrid.getCellCssStyles('error_highlight');
                    if (lClass == undefined) {
                      lClass = {};
                    }
                    if (lClass != null) {
                      if (
                        lClass[this.dataViewCAB.getRowById(pItem.id)] != null
                      ) {
                        lClass[this.dataViewCAB.getRowById(pItem.id)][lParam1] =
                          '';
                        this.templateGrid.slickGrid.setCellCssStyles(
                          'error_highlight',
                          lClass
                        );
                      }
                    }

                    for (var k = 0; k < lFormula1AR.length; k++) {
                      lFormula1 = lFormula1AR[k];
                      var lParam2 = lParas[k];
                      var lParamType = lParamTypeAR[k];
                      var lDefaultValue = lDefaultValueAR[k];
                      if (
                        lFormula1.indexOf(lParam1) >= 0 &&
                        lParam2 != pColumnName
                      ) {
                        var lResult = this.calFormula(
                          pItem,
                          lParam1,
                          lResult,
                          lPinSize,
                          pDia,
                          lParamType,
                          lDefaultValue,
                          lFormula1
                        );
                        if (lResult != '') {
                          pItem[lParam2] = lResult;

                          //clear the highlighted error
                          var lClass = this.templateGrid.slickGrid.getCellCssStyles('error_highlight');
                          if (lClass == undefined) {
                            lClass = {};
                          }
                          if (lClass != null) {
                            if (
                              lClass[this.dataViewCAB.getRowById(pItem.id)] !=
                              null
                            ) {
                              lClass[this.dataViewCAB.getRowById(pItem.id)][
                                lParam2
                              ] = '';
                              this.templateGrid.slickGrid.setCellCssStyles(
                                'error_highlight',
                                lClass
                              );
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

              this.dataViewCAB.updateItem(pItem.id, pItem);
              this.barChangeInd[pGridID] = this.barChangeInd[pGridID] + 1;
            }
          }
        }
      }

      if (lFormula2AR.length == lParas.length) {
        for (var i = 0; i < lFormula2AR.length; i++) {
          lFormula2 = lFormula2AR[i];
          lParam = lParas[i];
          var lParamType = lParamTypeAR[i];
          var lDefaultValue = lDefaultValueAR[i];
          if (lFormula2.indexOf(pColumnName) >= 0) {
            var lResult = this.calFormula(
              pItem,
              pColumnName,
              pValue,
              lPinSize,
              pDia,
              lParamType,
              lDefaultValue,
              lFormula2
            );
            if (lResult != '') {
              pItem[lParam] = lResult;

              for (var j = 0; j < lFormula2AR.length; j++) {
                lFormula2 = lFormula2AR[j];
                var lParam1 = lParas[j];
                var lParamType = lParamTypeAR[j];
                var lDefaultValue = lDefaultValueAR[j];
                if (lFormula1.indexOf(lParam) >= 0 && lParam1 != pColumnName) {
                  var lResult = this.calFormula(
                    pItem,
                    lParam,
                    lResult,
                    lPinSize,
                    pDia,
                    lParamType,
                    lDefaultValue,
                    lFormula2
                  );
                  if (lResult != '') {
                    pItem[lParam1] = lResult;

                    for (var k = 0; k < lFormula2AR.length; k++) {
                      lFormula2 = lFormula2AR[k];
                      var lParam2 = lParas[k];
                      var lParamType = lParamTypeAR[k];
                      var lDefaultValue = lDefaultValueAR[k];
                      if (
                        lFormula1.indexOf(lParam1) >= 0 &&
                        lParam2 != pColumnName
                      ) {
                        var lResult = this.calFormula(
                          pItem,
                          lParam1,
                          lResult,
                          lPinSize,
                          pDia,
                          lParamType,
                          lDefaultValue,
                          lFormula2
                        );
                        if (lResult != '') {
                          pItem[lParam2] = lResult;
                        }
                      }
                    }
                  }
                }
              }

              this.dataViewCAB.updateItem(pItem.id, pItem);
              this.barChangeInd[pGridID] = this.barChangeInd[pGridID] + 1;
            }
          }
        }
      }

      if (lFormula3AR.length == lParas.length) {
        for (var i = 0; i < lFormula3AR.length; i++) {
          lFormula3 = lFormula3AR[i];
          lParam = lParas[i];
          var lParamType = lParamTypeAR[i];
          var lDefaultValue = lDefaultValueAR[i];
          if (lFormula3.indexOf(pColumnName) >= 0) {
            var lResult = this.calFormula(
              pItem,
              pColumnName,
              pValue,
              lPinSize,
              pDia,
              lParamType,
              lDefaultValue,
              lFormula3
            );
            if (lResult != '') {
              pItem[lParam] = lResult;

              for (var j = 0; j < lFormula3AR.length; j++) {
                lFormula3 = lFormula3AR[j];
                var lParam1 = lParas[j];
                var lParamType = lParamTypeAR[j];
                var lDefaultValue = lDefaultValueAR[j];
                if (lFormula1.indexOf(lParam) >= 0 && lParam1 != pColumnName) {
                  var lResult = this.calFormula(
                    pItem,
                    lParam,
                    lResult,
                    lPinSize,
                    pDia,
                    lParamType,
                    lDefaultValue,
                    lFormula3
                  );
                  if (lResult != '') {
                    pItem[lParam1] = lResult;

                    for (var k = 0; k < lFormula3AR.length; k++) {
                      lFormula3 = lFormula3AR[k];
                      var lParam2 = lParas[k];
                      var lParamType = lParamTypeAR[k];
                      var lDefaultValue = lDefaultValueAR[k];
                      if (
                        lFormula1.indexOf(lParam1) >= 0 &&
                        lParam2 != pColumnName
                      ) {
                        var lResult = this.calFormula(
                          pItem,
                          lParam1,
                          lResult,
                          lPinSize,
                          pDia,
                          lParamType,
                          lDefaultValue,
                          lFormula3
                        );
                        if (lResult != '') {
                          pItem[lParam2] = lResult;
                        }
                      }
                    }
                  }
                }
              }

              this.dataViewCAB.updateItem(pItem.id, pItem);
              this.barChangeInd[pGridID] = this.barChangeInd[pGridID] + 1;
            }
          }
        }
      }
    }
    return lReturn;
  }

  calFormula(
    pItem: any,
    pColumnName: any,
    pValue: any,
    lPinSize: any,
    pDia: any,
    pParamType: any,
    pDefaultValue: any,
    pFormula: any
  ) {
    var lItem = pItem;
    var lF = pFormula;
    var lResult = '';
    var lColumnName = pColumnName;
    var lVarMax = 0;
    var lVarMin = 0;
    if (lF != null) {
      if (lF != '') {
        if (
          (lColumnName == 'A' && lF.indexOf('A') >= 0) ||
          (lColumnName == 'B' && lF.indexOf('B') >= 0) ||
          (lColumnName == 'C' && lF.indexOf('C') >= 0) ||
          (lColumnName == 'D' && lF.indexOf('D') >= 0) ||
          (lColumnName == 'E' && lF.indexOf('E') >= 0) ||
          (lColumnName == 'F' && lF.indexOf('F') >= 0) ||
          (lColumnName == 'G' && lF.indexOf('G') >= 0) ||
          (lColumnName == 'H' && lF.indexOf('H') >= 0) ||
          (lColumnName == 'I' && lF.indexOf('I') >= 0) ||
          (lColumnName == 'J' && lF.indexOf('J') >= 0) ||
          (lColumnName == 'K' && lF.indexOf('K') >= 0) ||
          (lColumnName == 'L' && lF.indexOf('L') >= 0) ||
          (lColumnName == 'M' && lF.indexOf('M') >= 0) ||
          (lColumnName == 'N' && lF.indexOf('N') >= 0) ||
          (lColumnName == 'O' && lF.indexOf('O') >= 0) ||
          (lColumnName == 'P' && lF.indexOf('P') >= 0) ||
          (lColumnName == 'Q' && lF.indexOf('Q') >= 0) ||
          (lColumnName == 'R' && lF.indexOf('R') >= 0) ||
          (lColumnName == 'S' && lF.indexOf('S') >= 0) ||
          (lColumnName == 'T' && lF.indexOf('T') >= 0) ||
          (lColumnName == 'U' && lF.indexOf('U') >= 0) ||
          (lColumnName == 'V' && lF.indexOf('V') >= 0) ||
          (lColumnName == 'W' && lF.indexOf('W') >= 0) ||
          (lColumnName == 'X' && lF.indexOf('X') >= 0) ||
          (lColumnName == 'Y' && lF.indexOf('Y') >= 0) ||
          (lColumnName == 'Z' && lF.indexOf('Z') >= 0)
        ) {
          if (
            (lF.indexOf('A') >= 0 && (lItem['A'] == 0 || lItem['A'] == null)) ||
            (lF.indexOf('B') >= 0 && (lItem['B'] == 0 || lItem['B'] == null)) ||
            (lF.indexOf('C') >= 0 && (lItem['C'] == 0 || lItem['C'] == null)) ||
            (lF.indexOf('D') >= 0 && (lItem['D'] == 0 || lItem['D'] == null)) ||
            (lF.indexOf('E') >= 0 && (lItem['E'] == 0 || lItem['E'] == null)) ||
            (lF.indexOf('F') >= 0 && (lItem['F'] == 0 || lItem['F'] == null)) ||
            (lF.indexOf('G') >= 0 && (lItem['G'] == 0 || lItem['G'] == null)) ||
            (lF.indexOf('H') >= 0 && (lItem['H'] == 0 || lItem['H'] == null)) ||
            (lF.indexOf('I') >= 0 && (lItem['I'] == 0 || lItem['I'] == null)) ||
            (lF.indexOf('J') >= 0 && (lItem['J'] == 0 || lItem['J'] == null)) ||
            (lF.indexOf('K') >= 0 && (lItem['K'] == 0 || lItem['K'] == null)) ||
            (lF.indexOf('L') >= 0 && (lItem['L'] == 0 || lItem['L'] == null)) ||
            (lF.indexOf('M') >= 0 && (lItem['M'] == 0 || lItem['M'] == null)) ||
            (lF.indexOf('N') >= 0 && (lItem['N'] == 0 || lItem['N'] == null)) ||
            (lF.indexOf('O') >= 0 && (lItem['O'] == 0 || lItem['O'] == null)) ||
            (lF.indexOf('P') >= 0 && (lItem['P'] == 0 || lItem['P'] == null)) ||
            (lF.indexOf('Q') >= 0 && (lItem['Q'] == 0 || lItem['Q'] == null)) ||
            (lF.indexOf('R') >= 0 && (lItem['R'] == 0 || lItem['R'] == null)) ||
            (lF.indexOf('S') >= 0 && (lItem['S'] == 0 || lItem['S'] == null)) ||
            (lF.indexOf('T') >= 0 && (lItem['T'] == 0 || lItem['T'] == null)) ||
            (lF.indexOf('U') >= 0 && (lItem['U'] == 0 || lItem['U'] == null)) ||
            (lF.indexOf('V') >= 0 && (lItem['V'] == 0 || lItem['V'] == null)) ||
            (lF.indexOf('W') >= 0 && (lItem['W'] == 0 || lItem['W'] == null)) ||
            (lF.indexOf('X') >= 0 && (lItem['X'] == 0 || lItem['X'] == null)) ||
            (lF.indexOf('Y') >= 0 && (lItem['Y'] == 0 || lItem['Y'] == null)) ||
            (lF.indexOf('Z') >= 0 && (lItem['Z'] == 0 || lItem['Z'] == null))
          ) {
            return lResult;
          }

          //Dia
          if (lF.indexOf('$') >= 0)
            lF = lF.replace(new RegExp('\\$', 'g'), pDia);
          //Pin
          if (lF.indexOf('@@') >= 0)
            lF = lF.replace(new RegExp('@@', 'g'), lPinSize / 2);

          if (lF.indexOf('A') >= 0)
            if (isNaN(lItem['A']))
              lF = lF.replace(
                new RegExp('A', 'g'),
                this.getVarValue1(lItem['A'])
              );
            else lF = lF.replace(new RegExp('A', 'g'), lItem['A']);
          if (lF.indexOf('B') >= 0)
            if (isNaN(lItem['B']))
              lF = lF.replace(
                new RegExp('B', 'g'),
                this.getVarValue1(lItem['B'])
              );
            else lF = lF.replace(new RegExp('B', 'g'), lItem['B']);
          if (lF.indexOf('C') >= 0)
            if (isNaN(lItem['C']))
              lF = lF.replace(
                new RegExp('C', 'g'),
                this.getVarValue1(lItem['C'])
              );
            else lF = lF.replace(new RegExp('C', 'g'), lItem['C']);
          if (lF.indexOf('D') >= 0)
            if (isNaN(lItem['D']))
              lF = lF.replace(
                new RegExp('D', 'g'),
                this.getVarValue1(lItem['D'])
              );
            else lF = lF.replace(new RegExp('D', 'g'), lItem['D']);
          if (lF.indexOf('E') >= 0)
            if (isNaN(lItem['E']))
              lF = lF.replace(
                new RegExp('E', 'g'),
                this.getVarValue1(lItem['E'])
              );
            else lF = lF.replace(new RegExp('E', 'g'), lItem['E']);
          if (lF.indexOf('F') >= 0)
            if (isNaN(lItem['F']))
              lF = lF.replace(
                new RegExp('F', 'g'),
                this.getVarValue1(lItem['F'])
              );
            else lF = lF.replace(new RegExp('F', 'g'), lItem['F']);
          if (lF.indexOf('G') >= 0)
            if (isNaN(lItem['G']))
              lF = lF.replace(
                new RegExp('G', 'g'),
                this.getVarValue1(lItem['G'])
              );
            else lF = lF.replace(new RegExp('G', 'g'), lItem['G']);
          if (lF.indexOf('H') >= 0)
            if (isNaN(lItem['H']))
              lF = lF.replace(
                new RegExp('H', 'g'),
                this.getVarValue1(lItem['H'])
              );
            else lF = lF.replace(new RegExp('H', 'g'), lItem['H']);
          if (lF.indexOf('I') >= 0)
            if (isNaN(lItem['I']))
              lF = lF.replace(
                new RegExp('I', 'g'),
                this.getVarValue1(lItem['I'])
              );
            else lF = lF.replace(new RegExp('I', 'g'), lItem['I']);
          if (lF.indexOf('J') >= 0)
            if (isNaN(lItem['J']))
              lF = lF.replace(
                new RegExp('J', 'g'),
                this.getVarValue1(lItem['J'])
              );
            else lF = lF.replace(new RegExp('J', 'g'), lItem['J']);
          if (lF.indexOf('K') >= 0)
            if (isNaN(lItem['K']))
              lF = lF.replace(
                new RegExp('K', 'g'),
                this.getVarValue1(lItem['K'])
              );
            else lF = lF.replace(new RegExp('K', 'g'), lItem['K']);
          if (lF.indexOf('L') >= 0)
            if (isNaN(lItem['L']))
              lF = lF.replace(
                new RegExp('L', 'g'),
                this.getVarValue1(lItem['L'])
              );
            else lF = lF.replace(new RegExp('L', 'g'), lItem['L']);
          if (lF.indexOf('M') >= 0)
            if (isNaN(lItem['M']))
              lF = lF.replace(
                new RegExp('M', 'g'),
                this.getVarValue1(lItem['M'])
              );
            else lF = lF.replace(new RegExp('M', 'g'), lItem['M']);
          if (lF.indexOf('N') >= 0)
            if (isNaN(lItem['N']))
              lF = lF.replace(
                new RegExp('N', 'g'),
                this.getVarValue1(lItem['N'])
              );
            else lF = lF.replace(new RegExp('N', 'g'), lItem['N']);
          if (lF.indexOf('O') >= 0)
            if (isNaN(lItem['O']))
              lF = lF.replace(
                new RegExp('O', 'g'),
                this.getVarValue1(lItem['O'])
              );
            else lF = lF.replace(new RegExp('O', 'g'), lItem['O']);
          if (lF.indexOf('P') >= 0)
            if (isNaN(lItem['P']))
              lF = lF.replace(
                new RegExp('P', 'g'),
                this.getVarValue1(lItem['P'])
              );
            else lF = lF.replace(new RegExp('P', 'g'), lItem['P']);
          if (lF.indexOf('Q') >= 0)
            if (isNaN(lItem['Q']))
              lF = lF.replace(
                new RegExp('Q', 'g'),
                this.getVarValue1(lItem['Q'])
              );
            else lF = lF.replace(new RegExp('Q', 'g'), lItem['Q']);
          if (lF.indexOf('R') >= 0)
            if (isNaN(lItem['R']))
              lF = lF.replace(
                new RegExp('R', 'g'),
                this.getVarValue1(lItem['R'])
              );
            else lF = lF.replace(new RegExp('R', 'g'), lItem['R']);
          if (lF.indexOf('S') >= 0)
            if (isNaN(lItem['S']))
              lF = lF.replace(
                new RegExp('S', 'g'),
                this.getVarValue1(lItem['S'])
              );
            else lF = lF.replace(new RegExp('S', 'g'), lItem['S']);
          if (lF.indexOf('T') >= 0)
            if (isNaN(lItem['T']))
              lF = lF.replace(
                new RegExp('T', 'g'),
                this.getVarValue1(lItem['T'])
              );
            else lF = lF.replace(new RegExp('T', 'g'), lItem['T']);
          if (lF.indexOf('U') >= 0)
            if (isNaN(lItem['U']))
              lF = lF.replace(
                new RegExp('U', 'g'),
                this.getVarValue1(lItem['U'])
              );
            else lF = lF.replace(new RegExp('U', 'g'), lItem['U']);
          if (lF.indexOf('V') >= 0)
            if (isNaN(lItem['V']))
              lF = lF.replace(
                new RegExp('V', 'g'),
                this.getVarValue1(lItem['V'])
              );
            else lF = lF.replace(new RegExp('V', 'g'), lItem['V']);
          if (lF.indexOf('W') >= 0)
            if (isNaN(lItem['W']))
              lF = lF.replace(
                new RegExp('W', 'g'),
                this.getVarValue1(lItem['W'])
              );
            else lF = lF.replace(new RegExp('W', 'g'), lItem['W']);
          if (lF.indexOf('X') >= 0)
            if (isNaN(lItem['X']))
              lF = lF.replace(
                new RegExp('X', 'g'),
                this.getVarValue1(lItem['X'])
              );
            else lF = lF.replace(new RegExp('X', 'g'), lItem['X']);
          if (lF.indexOf('Y') >= 0)
            if (isNaN(lItem['Y']))
              lF = lF.replace(
                new RegExp('Y', 'g'),
                this.getVarValue1(lItem['Y'])
              );
            else lF = lF.replace(new RegExp('Y', 'g'), lItem['Y']);
          if (lF.indexOf('Z') >= 0)
            if (isNaN(lItem['Z']))
              lF = lF.replace(
                new RegExp('Z', 'g'),
                this.getVarValue1(lItem['Z'])
              );
            else lF = lF.replace(new RegExp('Z', 'g'), lItem['Z']);
          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');

          lVarMax = math.evaluate(lF);
          if (pParamType == 'V') {
            if (isNaN(lVarMax)) {
              if (pDefaultValue > 90) {
                lVarMax = 91;
              } else {
                lVarMax = 89;
              }
            } else {
              if (pDefaultValue > 90 && lVarMax < 90) {
                lVarMax = lVarMax + 90;
              }
            }
          }
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMax = lVarMax + getVarMaxValue(pValue);
          //}
          //else {
          //    lVarMax = lVarMax - getVarMaxValue(lItem[lColumnName]) + getVarMaxValue(pValue);
          //}

          lF = pFormula;
          //Dia
          if (lF.indexOf('$') >= 0)
            lF = lF.replace(new RegExp('\\$', 'g'), pDia);
          //Pin
          if (lF.indexOf('@@') >= 0)
            lF = lF.replace(new RegExp('@@', 'g'), lPinSize / 2);

          if (lF.indexOf('A') >= 0)
            if (isNaN(lItem['A']))
              lF = lF.replace(
                new RegExp('A', 'g'),
                this.getVarValue2(lItem['A'])
              );
            else lF = lF.replace(new RegExp('A', 'g'), lItem['A']);
          if (lF.indexOf('B') >= 0)
            if (isNaN(lItem['B']))
              lF = lF.replace(
                new RegExp('B', 'g'),
                this.getVarValue2(lItem['B'])
              );
            else lF = lF.replace(new RegExp('B', 'g'), lItem['B']);
          if (lF.indexOf('C') >= 0)
            if (isNaN(lItem['C']))
              lF = lF.replace(
                new RegExp('C', 'g'),
                this.getVarValue2(lItem['C'])
              );
            else lF = lF.replace(new RegExp('C', 'g'), lItem['C']);
          if (lF.indexOf('D') >= 0)
            if (isNaN(lItem['D']))
              lF = lF.replace(
                new RegExp('D', 'g'),
                this.getVarValue2(lItem['D'])
              );
            else lF = lF.replace(new RegExp('D', 'g'), lItem['D']);
          if (lF.indexOf('E') >= 0)
            if (isNaN(lItem['E']))
              lF = lF.replace(
                new RegExp('E', 'g'),
                this.getVarValue2(lItem['E'])
              );
            else lF = lF.replace(new RegExp('E', 'g'), lItem['E']);
          if (lF.indexOf('F') >= 0)
            if (isNaN(lItem['F']))
              lF = lF.replace(
                new RegExp('F', 'g'),
                this.getVarValue2(lItem['F'])
              );
            else lF = lF.replace(new RegExp('F', 'g'), lItem['F']);
          if (lF.indexOf('G') >= 0)
            if (isNaN(lItem['G']))
              lF = lF.replace(
                new RegExp('G', 'g'),
                this.getVarValue2(lItem['G'])
              );
            else lF = lF.replace(new RegExp('G', 'g'), lItem['G']);
          if (lF.indexOf('H') >= 0)
            if (isNaN(lItem['H']))
              lF = lF.replace(
                new RegExp('H', 'g'),
                this.getVarValue2(lItem['H'])
              );
            else lF = lF.replace(new RegExp('H', 'g'), lItem['H']);
          if (lF.indexOf('I') >= 0)
            if (isNaN(lItem['I']))
              lF = lF.replace(
                new RegExp('I', 'g'),
                this.getVarValue2(lItem['I'])
              );
            else lF = lF.replace(new RegExp('I', 'g'), lItem['I']);
          if (lF.indexOf('J') >= 0)
            if (isNaN(lItem['J']))
              lF = lF.replace(
                new RegExp('J', 'g'),
                this.getVarValue2(lItem['J'])
              );
            else lF = lF.replace(new RegExp('J', 'g'), lItem['J']);
          if (lF.indexOf('K') >= 0)
            if (isNaN(lItem['K']))
              lF = lF.replace(
                new RegExp('K', 'g'),
                this.getVarValue2(lItem['K'])
              );
            else lF = lF.replace(new RegExp('K', 'g'), lItem['K']);
          if (lF.indexOf('L') >= 0)
            if (isNaN(lItem['L']))
              lF = lF.replace(
                new RegExp('L', 'g'),
                this.getVarValue2(lItem['L'])
              );
            else lF = lF.replace(new RegExp('L', 'g'), lItem['L']);
          if (lF.indexOf('M') >= 0)
            if (isNaN(lItem['M']))
              lF = lF.replace(
                new RegExp('M', 'g'),
                this.getVarValue2(lItem['M'])
              );
            else lF = lF.replace(new RegExp('M', 'g'), lItem['M']);
          if (lF.indexOf('N') >= 0)
            if (isNaN(lItem['N']))
              lF = lF.replace(
                new RegExp('N', 'g'),
                this.getVarValue2(lItem['N'])
              );
            else lF = lF.replace(new RegExp('N', 'g'), lItem['N']);
          if (lF.indexOf('O') >= 0)
            if (isNaN(lItem['O']))
              lF = lF.replace(
                new RegExp('O', 'g'),
                this.getVarValue2(lItem['O'])
              );
            else lF = lF.replace(new RegExp('O', 'g'), lItem['O']);
          if (lF.indexOf('P') >= 0)
            if (isNaN(lItem['P']))
              lF = lF.replace(
                new RegExp('P', 'g'),
                this.getVarValue2(lItem['P'])
              );
            else lF = lF.replace(new RegExp('P', 'g'), lItem['P']);
          if (lF.indexOf('Q') >= 0)
            if (isNaN(lItem['Q']))
              lF = lF.replace(
                new RegExp('Q', 'g'),
                this.getVarValue2(lItem['Q'])
              );
            else lF = lF.replace(new RegExp('Q', 'g'), lItem['Q']);
          if (lF.indexOf('R') >= 0)
            if (isNaN(lItem['R']))
              lF = lF.replace(
                new RegExp('R', 'g'),
                this.getVarValue2(lItem['R'])
              );
            else lF = lF.replace(new RegExp('R', 'g'), lItem['R']);
          if (lF.indexOf('S') >= 0)
            if (isNaN(lItem['S']))
              lF = lF.replace(
                new RegExp('S', 'g'),
                this.getVarValue2(lItem['S'])
              );
            else lF = lF.replace(new RegExp('S', 'g'), lItem['S']);
          if (lF.indexOf('T') >= 0)
            if (isNaN(lItem['T']))
              lF = lF.replace(
                new RegExp('T', 'g'),
                this.getVarValue2(lItem['T'])
              );
            else lF = lF.replace(new RegExp('T', 'g'), lItem['T']);
          if (lF.indexOf('U') >= 0)
            if (isNaN(lItem['U']))
              lF = lF.replace(
                new RegExp('U', 'g'),
                this.getVarValue2(lItem['U'])
              );
            else lF = lF.replace(new RegExp('U', 'g'), lItem['U']);
          if (lF.indexOf('V') >= 0)
            if (isNaN(lItem['V']))
              lF = lF.replace(
                new RegExp('V', 'g'),
                this.getVarValue2(lItem['V'])
              );
            else lF = lF.replace(new RegExp('V', 'g'), lItem['V']);
          if (lF.indexOf('W') >= 0)
            if (isNaN(lItem['W']))
              lF = lF.replace(
                new RegExp('W', 'g'),
                this.getVarValue2(lItem['W'])
              );
            else lF = lF.replace(new RegExp('W', 'g'), lItem['W']);
          if (lF.indexOf('X') >= 0)
            if (isNaN(lItem['X']))
              lF = lF.replace(
                new RegExp('X', 'g'),
                this.getVarValue2(lItem['X'])
              );
            else lF = lF.replace(new RegExp('X', 'g'), lItem['X']);
          if (lF.indexOf('Y') >= 0)
            if (isNaN(lItem['Y']))
              lF = lF.replace(
                new RegExp('Y', 'g'),
                this.getVarValue2(lItem['Y'])
              );
            else lF = lF.replace(new RegExp('Y', 'g'), lItem['Y']);
          if (lF.indexOf('Z') >= 0)
            if (isNaN(lItem['Z']))
              lF = lF.replace(
                new RegExp('Z', 'g'),
                this.getVarValue2(lItem['Z'])
              );
            else lF = lF.replace(new RegExp('Z', 'g'), lItem['Z']);
          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');
          lVarMin = math.evaluate(lF);
          if (pParamType == 'V') {
            if (isNaN(lVarMin)) {
              if (pDefaultValue > 90) {
                lVarMin = 91;
              } else {
                lVarMin = 89;
              }
            } else {
              if (pDefaultValue > 90 && lVarMin < 90) {
                lVarMin = lVarMin + 90;
              }
            }
          }
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMin = lVarMin + getVarMinValue(pValue);
          //}
          //else {
          //    lVarMin = lVarMin - getVarMinValue(lItem[lColumnName]) + getVarMinValue(pValue);
          //}

          lVarMin = Math.round(lVarMin);
          lVarMax = Math.round(lVarMax);

          if (lVarMin == 0 || lVarMin == lVarMax) {
            lResult = lVarMax.toString();
          } else {
            lResult = lVarMax + '-' + lVarMin;
          }
        }
      }
    }
    return lResult;
  }

  calFormula_splited(
    pItem: any,
    pColumnName: any,
    pValue: any,
    lPinSize: any,
    pDia: any,
    pParamType: any,
    pDefaultValue: any,
    pFormula: any
  ) {
    var lItem = pItem;
    var lF = pFormula;
    var lResult = '';
    var lColumnName = pColumnName;
    var lVarMax = 0;
    var lVarMin = 0;

    if (lF != null) {
      if (lF != '') {
        lF = lF.trim();
        lF = lF.replace(new RegExp(' \\(', 'g'), '(');
        if (
          (lColumnName == 'A' &&
            ((lF.length == 1 && lF.indexOf('A') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('A+') >= 0 ||
                  lF.indexOf('A-') >= 0 ||
                  lF.indexOf('A*') >= 0 ||
                  lF.indexOf('A/') >= 0 ||
                  lF.indexOf('A)') > 0 ||
                  lF.indexOf('+A ') > 0 ||
                  lF.indexOf('-A ') > 0 ||
                  lF.indexOf('*A ') > 0 ||
                  lF.indexOf('/A ') > 0 ||
                  lF.indexOf('(A ') > 0 ||
                  lF.indexOf(' A ') > 0 ||
                  lF.lastIndexOf('+A') == lF.length - 2 ||
                  lF.lastIndexOf('-A') == lF.length - 2 ||
                  lF.lastIndexOf('*A') == lF.length - 2 ||
                  lF.lastIndexOf('/A') == lF.length - 2 ||
                  lF.lastIndexOf(' A') == lF.length - 2)))) ||
          (lColumnName == 'B' &&
            ((lF.length == 1 && lF.indexOf('B') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('B+') >= 0 ||
                  lF.indexOf('B-') >= 0 ||
                  lF.indexOf('B*') >= 0 ||
                  lF.indexOf('B/') >= 0 ||
                  lF.indexOf('B)') > 0 ||
                  lF.indexOf('+B ') > 0 ||
                  lF.indexOf('-B ') > 0 ||
                  lF.indexOf('*B ') > 0 ||
                  lF.indexOf('/B ') > 0 ||
                  lF.indexOf('(B ') > 0 ||
                  lF.indexOf(' B ') > 0 ||
                  lF.lastIndexOf('+B') == lF.length - 2 ||
                  lF.lastIndexOf('-B') == lF.length - 2 ||
                  lF.lastIndexOf('*B') == lF.length - 2 ||
                  lF.lastIndexOf('/B') == lF.length - 2 ||
                  lF.lastIndexOf(' B') == lF.length - 2)))) ||
          (lColumnName == 'C' &&
            ((lF.length == 1 && lF.indexOf('C') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('C+') >= 0 ||
                  lF.indexOf('C-') >= 0 ||
                  lF.indexOf('C*') >= 0 ||
                  lF.indexOf('C/') >= 0 ||
                  lF.indexOf('C)') > 0 ||
                  lF.indexOf('+C ') > 0 ||
                  lF.indexOf('-C ') > 0 ||
                  lF.indexOf('*C ') > 0 ||
                  lF.indexOf('/C ') > 0 ||
                  lF.indexOf('(C ') > 0 ||
                  lF.indexOf(' C ') > 0 ||
                  lF.lastIndexOf('+C') == lF.length - 2 ||
                  lF.lastIndexOf('-C') == lF.length - 2 ||
                  lF.lastIndexOf('*C') == lF.length - 2 ||
                  lF.lastIndexOf('/C') == lF.length - 2 ||
                  lF.lastIndexOf(' C') == lF.length - 2)))) ||
          (lColumnName == 'D' &&
            ((lF.length == 1 && lF.indexOf('D') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('D+') >= 0 ||
                  lF.indexOf('D-') >= 0 ||
                  lF.indexOf('D*') >= 0 ||
                  lF.indexOf('D/') >= 0 ||
                  lF.indexOf('D)') > 0 ||
                  lF.indexOf('+D ') > 0 ||
                  lF.indexOf('-D ') > 0 ||
                  lF.indexOf('*D ') > 0 ||
                  lF.indexOf('/D ') > 0 ||
                  lF.indexOf('(D ') > 0 ||
                  lF.indexOf(' D ') > 0 ||
                  lF.lastIndexOf('+D') == lF.length - 2 ||
                  lF.lastIndexOf('-D') == lF.length - 2 ||
                  lF.lastIndexOf('*D') == lF.length - 2 ||
                  lF.lastIndexOf('/D') == lF.length - 2 ||
                  lF.lastIndexOf(' D') == lF.length - 2)))) ||
          (lColumnName == 'E' &&
            ((lF.length == 1 && lF.indexOf('E') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('E+') >= 0 ||
                  lF.indexOf('E-') >= 0 ||
                  lF.indexOf('E*') >= 0 ||
                  lF.indexOf('E/') >= 0 ||
                  lF.indexOf('E)') > 0 ||
                  lF.indexOf('+E ') > 0 ||
                  lF.indexOf('-E ') > 0 ||
                  lF.indexOf('*E ') > 0 ||
                  lF.indexOf('/E ') > 0 ||
                  lF.indexOf('(E ') > 0 ||
                  lF.indexOf(' E ') > 0 ||
                  lF.lastIndexOf('+E') == lF.length - 2 ||
                  lF.lastIndexOf('-E') == lF.length - 2 ||
                  lF.lastIndexOf('*E') == lF.length - 2 ||
                  lF.lastIndexOf('/E') == lF.length - 2 ||
                  lF.lastIndexOf(' E') == lF.length - 2)))) ||
          (lColumnName == 'F' &&
            ((lF.length == 1 && lF.indexOf('F') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('F+') >= 0 ||
                  lF.indexOf('F-') >= 0 ||
                  lF.indexOf('F*') >= 0 ||
                  lF.indexOf('F/') >= 0 ||
                  lF.indexOf('F)') > 0 ||
                  lF.indexOf('+F ') > 0 ||
                  lF.indexOf('-F ') > 0 ||
                  lF.indexOf('*F ') > 0 ||
                  lF.indexOf('/F ') > 0 ||
                  lF.indexOf('(F ') > 0 ||
                  lF.indexOf(' F ') > 0 ||
                  lF.lastIndexOf('+F') == lF.length - 2 ||
                  lF.lastIndexOf('-F') == lF.length - 2 ||
                  lF.lastIndexOf('*F') == lF.length - 2 ||
                  lF.lastIndexOf('/F') == lF.length - 2 ||
                  lF.lastIndexOf(' F') == lF.length - 2)))) ||
          (lColumnName == 'G' &&
            ((lF.length == 1 && lF.indexOf('G') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('G+') >= 0 ||
                  lF.indexOf('G-') >= 0 ||
                  lF.indexOf('G*') >= 0 ||
                  lF.indexOf('G/') >= 0 ||
                  lF.indexOf('G)') > 0 ||
                  lF.indexOf('+G ') > 0 ||
                  lF.indexOf('-G ') > 0 ||
                  lF.indexOf('*G ') > 0 ||
                  lF.indexOf('/G ') > 0 ||
                  lF.indexOf('(G ') > 0 ||
                  lF.indexOf(' G ') > 0 ||
                  lF.lastIndexOf('+G') == lF.length - 2 ||
                  lF.lastIndexOf('-G') == lF.length - 2 ||
                  lF.lastIndexOf('*G') == lF.length - 2 ||
                  lF.lastIndexOf('/G') == lF.length - 2 ||
                  lF.lastIndexOf(' G') == lF.length - 2)))) ||
          (lColumnName == 'H' &&
            ((lF.length == 1 && lF.indexOf('H') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('H+') >= 0 ||
                  lF.indexOf('H-') >= 0 ||
                  lF.indexOf('H*') >= 0 ||
                  lF.indexOf('H/') >= 0 ||
                  lF.indexOf('H)') > 0 ||
                  lF.indexOf('+H ') > 0 ||
                  lF.indexOf('-H ') > 0 ||
                  lF.indexOf('*H ') > 0 ||
                  lF.indexOf('/H ') > 0 ||
                  lF.indexOf('(H ') > 0 ||
                  lF.indexOf(' H ') > 0 ||
                  lF.lastIndexOf('+H') == lF.length - 2 ||
                  lF.lastIndexOf('-H') == lF.length - 2 ||
                  lF.lastIndexOf('*H') == lF.length - 2 ||
                  lF.lastIndexOf('/H') == lF.length - 2 ||
                  lF.lastIndexOf(' H') == lF.length - 2)))) ||
          (lColumnName == 'I' &&
            ((lF.length == 1 && lF.indexOf('I') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('I+') >= 0 ||
                  lF.indexOf('I-') >= 0 ||
                  lF.indexOf('I*') >= 0 ||
                  lF.indexOf('I/') >= 0 ||
                  lF.indexOf('I)') > 0 ||
                  lF.indexOf('+I ') > 0 ||
                  lF.indexOf('-I ') > 0 ||
                  lF.indexOf('*I ') > 0 ||
                  lF.indexOf('/I ') > 0 ||
                  lF.indexOf('(I ') > 0 ||
                  lF.indexOf(' I ') > 0 ||
                  lF.lastIndexOf('+I') == lF.length - 2 ||
                  lF.lastIndexOf('-I') == lF.length - 2 ||
                  lF.lastIndexOf('*I') == lF.length - 2 ||
                  lF.lastIndexOf('/I') == lF.length - 2 ||
                  lF.lastIndexOf(' I') == lF.length - 2)))) ||
          (lColumnName == 'J' &&
            ((lF.length == 1 && lF.indexOf('J') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('J+') >= 0 ||
                  lF.indexOf('J-') >= 0 ||
                  lF.indexOf('J*') >= 0 ||
                  lF.indexOf('J/') >= 0 ||
                  lF.indexOf('J)') > 0 ||
                  lF.indexOf('+J ') > 0 ||
                  lF.indexOf('-J ') > 0 ||
                  lF.indexOf('*J ') > 0 ||
                  lF.indexOf('/J ') > 0 ||
                  lF.indexOf('(J ') > 0 ||
                  lF.indexOf(' J ') > 0 ||
                  lF.lastIndexOf('+J') == lF.length - 2 ||
                  lF.lastIndexOf('-J') == lF.length - 2 ||
                  lF.lastIndexOf('*J') == lF.length - 2 ||
                  lF.lastIndexOf('/J') == lF.length - 2 ||
                  lF.lastIndexOf(' J') == lF.length - 2)))) ||
          (lColumnName == 'K' &&
            ((lF.length == 1 && lF.indexOf('K') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('K+') >= 0 ||
                  lF.indexOf('K-') >= 0 ||
                  lF.indexOf('K*') >= 0 ||
                  lF.indexOf('K/') >= 0 ||
                  lF.indexOf('K)') > 0 ||
                  lF.indexOf('+K ') > 0 ||
                  lF.indexOf('-K ') > 0 ||
                  lF.indexOf('*K ') > 0 ||
                  lF.indexOf('/K ') > 0 ||
                  lF.indexOf('(K ') > 0 ||
                  lF.indexOf(' K ') > 0 ||
                  lF.lastIndexOf('+K') == lF.length - 2 ||
                  lF.lastIndexOf('-K') == lF.length - 2 ||
                  lF.lastIndexOf('*K') == lF.length - 2 ||
                  lF.lastIndexOf('/K') == lF.length - 2 ||
                  lF.lastIndexOf(' K') == lF.length - 2)))) ||
          (lColumnName == 'L' &&
            ((lF.length == 1 && lF.indexOf('L') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('L+') >= 0 ||
                  lF.indexOf('L-') >= 0 ||
                  lF.indexOf('L*') >= 0 ||
                  lF.indexOf('L/') >= 0 ||
                  lF.indexOf('L)') > 0 ||
                  lF.indexOf('+L ') > 0 ||
                  lF.indexOf('-L ') > 0 ||
                  lF.indexOf('*L ') > 0 ||
                  lF.indexOf('/L ') > 0 ||
                  lF.indexOf('(L ') > 0 ||
                  lF.indexOf(' L ') > 0 ||
                  lF.lastIndexOf('+L') == lF.length - 2 ||
                  lF.lastIndexOf('-L') == lF.length - 2 ||
                  lF.lastIndexOf('*L') == lF.length - 2 ||
                  lF.lastIndexOf('/L') == lF.length - 2 ||
                  lF.lastIndexOf(' L') == lF.length - 2)))) ||
          (lColumnName == 'M' &&
            ((lF.length == 1 && lF.indexOf('M') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('M+') >= 0 ||
                  lF.indexOf('M-') >= 0 ||
                  lF.indexOf('M*') >= 0 ||
                  lF.indexOf('M/') >= 0 ||
                  lF.indexOf('M)') > 0 ||
                  lF.indexOf('+M ') > 0 ||
                  lF.indexOf('-M ') > 0 ||
                  lF.indexOf('*M ') > 0 ||
                  lF.indexOf('/M ') > 0 ||
                  lF.indexOf('(M ') > 0 ||
                  lF.indexOf(' M ') > 0 ||
                  lF.lastIndexOf('+M') == lF.length - 2 ||
                  lF.lastIndexOf('-M') == lF.length - 2 ||
                  lF.lastIndexOf('*M') == lF.length - 2 ||
                  lF.lastIndexOf('/M') == lF.length - 2 ||
                  lF.lastIndexOf(' M') == lF.length - 2)))) ||
          (lColumnName == 'N' &&
            ((lF.length == 1 && lF.indexOf('N') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('N+') >= 0 ||
                  lF.indexOf('N-') >= 0 ||
                  lF.indexOf('N*') >= 0 ||
                  lF.indexOf('N/') >= 0 ||
                  lF.indexOf('N)') > 0 ||
                  lF.indexOf('+N ') > 0 ||
                  lF.indexOf('-N ') > 0 ||
                  lF.indexOf('*N ') > 0 ||
                  lF.indexOf('/N ') > 0 ||
                  lF.indexOf('(N ') > 0 ||
                  lF.indexOf(' N ') > 0 ||
                  lF.lastIndexOf('+N') == lF.length - 2 ||
                  lF.lastIndexOf('-N') == lF.length - 2 ||
                  lF.lastIndexOf('*N') == lF.length - 2 ||
                  lF.lastIndexOf('/N') == lF.length - 2 ||
                  lF.lastIndexOf(' N') == lF.length - 2)))) ||
          (lColumnName == 'O' &&
            ((lF.length == 1 && lF.indexOf('O') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('O+') >= 0 ||
                  lF.indexOf('O-') >= 0 ||
                  lF.indexOf('O*') >= 0 ||
                  lF.indexOf('O/') >= 0 ||
                  lF.indexOf('O)') > 0 ||
                  lF.indexOf('+O ') > 0 ||
                  lF.indexOf('-O ') > 0 ||
                  lF.indexOf('*O ') > 0 ||
                  lF.indexOf('/O ') > 0 ||
                  lF.indexOf('(O ') > 0 ||
                  lF.indexOf(' O ') > 0 ||
                  lF.lastIndexOf('+O') == lF.length - 2 ||
                  lF.lastIndexOf('-O') == lF.length - 2 ||
                  lF.lastIndexOf('*O') == lF.length - 2 ||
                  lF.lastIndexOf('/O') == lF.length - 2 ||
                  lF.lastIndexOf(' O') == lF.length - 2)))) ||
          (lColumnName == 'P' &&
            ((lF.length == 1 && lF.indexOf('P') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('P+') >= 0 ||
                  lF.indexOf('P-') >= 0 ||
                  lF.indexOf('P*') >= 0 ||
                  lF.indexOf('P/') >= 0 ||
                  lF.indexOf('P)') > 0 ||
                  lF.indexOf('+P ') > 0 ||
                  lF.indexOf('-P ') > 0 ||
                  lF.indexOf('*P ') > 0 ||
                  lF.indexOf('/P ') > 0 ||
                  lF.indexOf('(P ') > 0 ||
                  lF.indexOf(' P ') > 0 ||
                  lF.lastIndexOf('+P') == lF.length - 2 ||
                  lF.lastIndexOf('-P') == lF.length - 2 ||
                  lF.lastIndexOf('*P') == lF.length - 2 ||
                  lF.lastIndexOf('/P') == lF.length - 2 ||
                  lF.lastIndexOf(' P') == lF.length - 2)))) ||
          (lColumnName == 'Q' &&
            ((lF.length == 1 && lF.indexOf('Q') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('Q+') >= 0 ||
                  lF.indexOf('Q-') >= 0 ||
                  lF.indexOf('Q*') >= 0 ||
                  lF.indexOf('Q/') >= 0 ||
                  lF.indexOf('Q)') > 0 ||
                  lF.indexOf('+Q ') > 0 ||
                  lF.indexOf('-Q ') > 0 ||
                  lF.indexOf('*Q ') > 0 ||
                  lF.indexOf('/Q ') > 0 ||
                  lF.indexOf('(Q ') > 0 ||
                  lF.indexOf(' Q ') > 0 ||
                  lF.lastIndexOf('+Q') == lF.length - 2 ||
                  lF.lastIndexOf('-Q') == lF.length - 2 ||
                  lF.lastIndexOf('*Q') == lF.length - 2 ||
                  lF.lastIndexOf('/Q') == lF.length - 2 ||
                  lF.lastIndexOf(' Q') == lF.length - 2)))) ||
          (lColumnName == 'R' &&
            ((lF.length == 1 && lF.indexOf('R') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('R+') >= 0 ||
                  lF.indexOf('R-') >= 0 ||
                  lF.indexOf('R*') >= 0 ||
                  lF.indexOf('R/') >= 0 ||
                  lF.indexOf('R)') > 0 ||
                  lF.indexOf('+R ') > 0 ||
                  lF.indexOf('-R ') > 0 ||
                  lF.indexOf('*R ') > 0 ||
                  lF.indexOf('/R ') > 0 ||
                  lF.indexOf('(R ') > 0 ||
                  lF.indexOf(' R ') > 0 ||
                  lF.lastIndexOf('+R') == lF.length - 2 ||
                  lF.lastIndexOf('-R') == lF.length - 2 ||
                  lF.lastIndexOf('*R') == lF.length - 2 ||
                  lF.lastIndexOf('/R') == lF.length - 2 ||
                  lF.lastIndexOf(' R') == lF.length - 2)))) ||
          (lColumnName == 'S' &&
            ((lF.length == 1 && lF.indexOf('S') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('S+') >= 0 ||
                  lF.indexOf('S-') >= 0 ||
                  lF.indexOf('S*') >= 0 ||
                  lF.indexOf('S/') >= 0 ||
                  lF.indexOf('S)') > 0 ||
                  lF.indexOf('+S ') > 0 ||
                  lF.indexOf('-S ') > 0 ||
                  lF.indexOf('*S ') > 0 ||
                  lF.indexOf('/S ') > 0 ||
                  lF.indexOf('(S ') > 0 ||
                  lF.indexOf(' S ') > 0 ||
                  lF.lastIndexOf('+S') == lF.length - 2 ||
                  lF.lastIndexOf('-S') == lF.length - 2 ||
                  lF.lastIndexOf('*S') == lF.length - 2 ||
                  lF.lastIndexOf('/S') == lF.length - 2 ||
                  lF.lastIndexOf(' S') == lF.length - 2)))) ||
          (lColumnName == 'T' &&
            ((lF.length == 1 && lF.indexOf('T') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('T+') >= 0 ||
                  lF.indexOf('T-') >= 0 ||
                  lF.indexOf('T*') >= 0 ||
                  lF.indexOf('T/') >= 0 ||
                  lF.indexOf('T)') > 0 ||
                  lF.indexOf('+T ') > 0 ||
                  lF.indexOf('-T ') > 0 ||
                  lF.indexOf('*T ') > 0 ||
                  lF.indexOf('/T ') > 0 ||
                  lF.indexOf('(T ') > 0 ||
                  lF.indexOf(' T ') > 0 ||
                  lF.lastIndexOf('+T') == lF.length - 2 ||
                  lF.lastIndexOf('-T') == lF.length - 2 ||
                  lF.lastIndexOf('*T') == lF.length - 2 ||
                  lF.lastIndexOf('/T') == lF.length - 2 ||
                  lF.lastIndexOf(' T') == lF.length - 2)))) ||
          (lColumnName == 'U' &&
            ((lF.length == 1 && lF.indexOf('U') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('U+') >= 0 ||
                  lF.indexOf('U-') >= 0 ||
                  lF.indexOf('U*') >= 0 ||
                  lF.indexOf('U/') >= 0 ||
                  lF.indexOf('U)') > 0 ||
                  lF.indexOf('+U ') > 0 ||
                  lF.indexOf('-U ') > 0 ||
                  lF.indexOf('*U ') > 0 ||
                  lF.indexOf('/U ') > 0 ||
                  lF.indexOf('(U ') > 0 ||
                  lF.indexOf(' U ') > 0 ||
                  lF.lastIndexOf('+U') == lF.length - 2 ||
                  lF.lastIndexOf('-U') == lF.length - 2 ||
                  lF.lastIndexOf('*U') == lF.length - 2 ||
                  lF.lastIndexOf('/U') == lF.length - 2 ||
                  lF.lastIndexOf(' U') == lF.length - 2)))) ||
          (lColumnName == 'V' &&
            ((lF.length == 1 && lF.indexOf('V') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('V+') >= 0 ||
                  lF.indexOf('V-') >= 0 ||
                  lF.indexOf('V*') >= 0 ||
                  lF.indexOf('V/') >= 0 ||
                  lF.indexOf('V)') > 0 ||
                  lF.indexOf('+V ') > 0 ||
                  lF.indexOf('-V ') > 0 ||
                  lF.indexOf('*V ') > 0 ||
                  lF.indexOf('/V ') > 0 ||
                  lF.indexOf('(V ') > 0 ||
                  lF.indexOf(' V ') > 0 ||
                  lF.lastIndexOf('+V') == lF.length - 2 ||
                  lF.lastIndexOf('-V') == lF.length - 2 ||
                  lF.lastIndexOf('*V') == lF.length - 2 ||
                  lF.lastIndexOf('/V') == lF.length - 2 ||
                  lF.lastIndexOf(' V') == lF.length - 2)))) ||
          (lColumnName == 'W' &&
            ((lF.length == 1 && lF.indexOf('W') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('W+') >= 0 ||
                  lF.indexOf('W-') >= 0 ||
                  lF.indexOf('W*') >= 0 ||
                  lF.indexOf('W/') >= 0 ||
                  lF.indexOf('W)') > 0 ||
                  lF.indexOf('+W ') > 0 ||
                  lF.indexOf('-W ') > 0 ||
                  lF.indexOf('*W ') > 0 ||
                  lF.indexOf('/W ') > 0 ||
                  lF.indexOf('(W ') > 0 ||
                  lF.indexOf(' W ') > 0 ||
                  lF.lastIndexOf('+W') == lF.length - 2 ||
                  lF.lastIndexOf('-W') == lF.length - 2 ||
                  lF.lastIndexOf('*W') == lF.length - 2 ||
                  lF.lastIndexOf('/W') == lF.length - 2 ||
                  lF.lastIndexOf(' W') == lF.length - 2)))) ||
          (lColumnName == 'X' &&
            ((lF.length == 1 && lF.indexOf('X') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('X+') >= 0 ||
                  lF.indexOf('X-') >= 0 ||
                  lF.indexOf('X*') >= 0 ||
                  lF.indexOf('X/') >= 0 ||
                  lF.indexOf('X)') > 0 ||
                  lF.indexOf('+X ') > 0 ||
                  lF.indexOf('-X ') > 0 ||
                  lF.indexOf('*X ') > 0 ||
                  lF.indexOf('/X ') > 0 ||
                  lF.indexOf('(X ') > 0 ||
                  lF.indexOf(' X ') > 0 ||
                  lF.lastIndexOf('+X') == lF.length - 2 ||
                  lF.lastIndexOf('-X') == lF.length - 2 ||
                  lF.lastIndexOf('*X') == lF.length - 2 ||
                  lF.lastIndexOf('/X') == lF.length - 2 ||
                  lF.lastIndexOf(' X') == lF.length - 2)))) ||
          (lColumnName == 'Y' &&
            ((lF.length == 1 && lF.indexOf('Y') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('Y+') >= 0 ||
                  lF.indexOf('Y-') >= 0 ||
                  lF.indexOf('Y*') >= 0 ||
                  lF.indexOf('Y/') >= 0 ||
                  lF.indexOf('Y)') > 0 ||
                  lF.indexOf('+Y ') > 0 ||
                  lF.indexOf('-Y ') > 0 ||
                  lF.indexOf('*Y ') > 0 ||
                  lF.indexOf('/Y ') > 0 ||
                  lF.indexOf('(Y ') > 0 ||
                  lF.indexOf(' Y ') > 0 ||
                  lF.lastIndexOf('+Y') == lF.length - 2 ||
                  lF.lastIndexOf('-Y') == lF.length - 2 ||
                  lF.lastIndexOf('*Y') == lF.length - 2 ||
                  lF.lastIndexOf('/Y') == lF.length - 2 ||
                  lF.lastIndexOf(' Y') == lF.length - 2)))) ||
          (lColumnName == 'Z' &&
            ((lF.length == 1 && lF.indexOf('Z') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('Z+') >= 0 ||
                  lF.indexOf('Z-') >= 0 ||
                  lF.indexOf('Z*') >= 0 ||
                  lF.indexOf('Z/') >= 0 ||
                  lF.indexOf('Z)') > 0 ||
                  lF.indexOf('+Z ') > 0 ||
                  lF.indexOf('-Z ') > 0 ||
                  lF.indexOf('*Z ') > 0 ||
                  lF.indexOf('/Z ') > 0 ||
                  lF.indexOf('(Z ') > 0 ||
                  lF.indexOf(' Z ') > 0 ||
                  lF.lastIndexOf('+Z') == lF.length - 2 ||
                  lF.lastIndexOf('-Z') == lF.length - 2 ||
                  lF.lastIndexOf('*Z') == lF.length - 2 ||
                  lF.lastIndexOf('/Z') == lF.length - 2 ||
                  lF.lastIndexOf(' Z') == lF.length - 2))))
        ) {
          if (
            (((lF.length == 1 && lF.indexOf('A') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('A+') >= 0 ||
                  lF.indexOf('A-') >= 0 ||
                  lF.indexOf('A*') >= 0 ||
                  lF.indexOf('A/') >= 0 ||
                  lF.indexOf('A)') > 0 ||
                  lF.indexOf('+A ') > 0 ||
                  lF.indexOf('-A ') > 0 ||
                  lF.indexOf('*A ') > 0 ||
                  lF.indexOf('/A ') > 0 ||
                  lF.indexOf('(A ') > 0 ||
                  lF.indexOf(' A ') > 0 ||
                  lF.lastIndexOf('+A') == lF.length - 2 ||
                  lF.lastIndexOf('-A') == lF.length - 2 ||
                  lF.lastIndexOf('*A') == lF.length - 2 ||
                  lF.lastIndexOf('/A') == lF.length - 2 ||
                  lF.lastIndexOf(' A') == lF.length - 2))) &&
              (lItem['A'] == 0 || lItem['A'] == null)) ||
            (((lF.length == 1 && lF.indexOf('B') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('B+') >= 0 ||
                  lF.indexOf('B-') >= 0 ||
                  lF.indexOf('B*') >= 0 ||
                  lF.indexOf('B/') >= 0 ||
                  lF.indexOf('B)') > 0 ||
                  lF.indexOf('+B ') > 0 ||
                  lF.indexOf('-B ') > 0 ||
                  lF.indexOf('*B ') > 0 ||
                  lF.indexOf('/B ') > 0 ||
                  lF.indexOf('(B ') > 0 ||
                  lF.indexOf(' B ') > 0 ||
                  lF.lastIndexOf('+B') == lF.length - 2 ||
                  lF.lastIndexOf('-B') == lF.length - 2 ||
                  lF.lastIndexOf('*B') == lF.length - 2 ||
                  lF.lastIndexOf('/B') == lF.length - 2 ||
                  lF.lastIndexOf(' B') == lF.length - 2))) &&
              (lItem['B'] == 0 || lItem['B'] == null)) ||
            (((lF.length == 1 && lF.indexOf('C') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('C+') >= 0 ||
                  lF.indexOf('C-') >= 0 ||
                  lF.indexOf('C*') >= 0 ||
                  lF.indexOf('C/') >= 0 ||
                  lF.indexOf('C)') > 0 ||
                  lF.indexOf('+C ') > 0 ||
                  lF.indexOf('-C ') > 0 ||
                  lF.indexOf('*C ') > 0 ||
                  lF.indexOf('/C ') > 0 ||
                  lF.indexOf('(C ') > 0 ||
                  lF.indexOf(' C ') > 0 ||
                  lF.lastIndexOf('+C') == lF.length - 2 ||
                  lF.lastIndexOf('-C') == lF.length - 2 ||
                  lF.lastIndexOf('*C') == lF.length - 2 ||
                  lF.lastIndexOf('/C') == lF.length - 2 ||
                  lF.lastIndexOf(' C') == lF.length - 2))) &&
              (lItem['C'] == 0 || lItem['C'] == null)) ||
            (((lF.length == 1 && lF.indexOf('D') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('D+') >= 0 ||
                  lF.indexOf('D-') >= 0 ||
                  lF.indexOf('D*') >= 0 ||
                  lF.indexOf('D/') >= 0 ||
                  lF.indexOf('D)') > 0 ||
                  lF.indexOf('+D ') > 0 ||
                  lF.indexOf('-D ') > 0 ||
                  lF.indexOf('*D ') > 0 ||
                  lF.indexOf('/D ') > 0 ||
                  lF.indexOf('(D ') > 0 ||
                  lF.indexOf(' D ') > 0 ||
                  lF.lastIndexOf('+D') == lF.length - 2 ||
                  lF.lastIndexOf('-D') == lF.length - 2 ||
                  lF.lastIndexOf('*D') == lF.length - 2 ||
                  lF.lastIndexOf('/D') == lF.length - 2 ||
                  lF.lastIndexOf(' D') == lF.length - 2))) &&
              (lItem['D'] == 0 || lItem['D'] == null)) ||
            (((lF.length == 1 && lF.indexOf('E') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('E+') >= 0 ||
                  lF.indexOf('E-') >= 0 ||
                  lF.indexOf('E*') >= 0 ||
                  lF.indexOf('E/') >= 0 ||
                  lF.indexOf('E)') > 0 ||
                  lF.indexOf('+E ') > 0 ||
                  lF.indexOf('-E ') > 0 ||
                  lF.indexOf('*E ') > 0 ||
                  lF.indexOf('/E ') > 0 ||
                  lF.indexOf('(E ') > 0 ||
                  lF.indexOf(' E ') > 0 ||
                  lF.lastIndexOf('+E') == lF.length - 2 ||
                  lF.lastIndexOf('-E') == lF.length - 2 ||
                  lF.lastIndexOf('*E') == lF.length - 2 ||
                  lF.lastIndexOf('/E') == lF.length - 2 ||
                  lF.lastIndexOf(' E') == lF.length - 2))) &&
              (lItem['E'] == 0 || lItem['E'] == null)) ||
            (((lF.length == 1 && lF.indexOf('F') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('F+') >= 0 ||
                  lF.indexOf('F-') >= 0 ||
                  lF.indexOf('F*') >= 0 ||
                  lF.indexOf('F/') >= 0 ||
                  lF.indexOf('F)') > 0 ||
                  lF.indexOf('+F ') > 0 ||
                  lF.indexOf('-F ') > 0 ||
                  lF.indexOf('*F ') > 0 ||
                  lF.indexOf('/F ') > 0 ||
                  lF.indexOf('(F ') > 0 ||
                  lF.indexOf(' F ') > 0 ||
                  lF.lastIndexOf('+F') == lF.length - 2 ||
                  lF.lastIndexOf('-F') == lF.length - 2 ||
                  lF.lastIndexOf('*F') == lF.length - 2 ||
                  lF.lastIndexOf('/F') == lF.length - 2 ||
                  lF.lastIndexOf(' F') == lF.length - 2))) &&
              (lItem['F'] == 0 || lItem['F'] == null)) ||
            (((lF.length == 1 && lF.indexOf('G') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('G+') >= 0 ||
                  lF.indexOf('G-') >= 0 ||
                  lF.indexOf('G*') >= 0 ||
                  lF.indexOf('G/') >= 0 ||
                  lF.indexOf('G)') > 0 ||
                  lF.indexOf('+G ') > 0 ||
                  lF.indexOf('-G ') > 0 ||
                  lF.indexOf('*G ') > 0 ||
                  lF.indexOf('/G ') > 0 ||
                  lF.indexOf('(G ') > 0 ||
                  lF.indexOf(' G ') > 0 ||
                  lF.lastIndexOf('+G') == lF.length - 2 ||
                  lF.lastIndexOf('-G') == lF.length - 2 ||
                  lF.lastIndexOf('*G') == lF.length - 2 ||
                  lF.lastIndexOf('/G') == lF.length - 2 ||
                  lF.lastIndexOf(' G') == lF.length - 2))) &&
              (lItem['G'] == 0 || lItem['G'] == null)) ||
            (((lF.length == 1 && lF.indexOf('H') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('H+') >= 0 ||
                  lF.indexOf('H-') >= 0 ||
                  lF.indexOf('H*') >= 0 ||
                  lF.indexOf('H/') >= 0 ||
                  lF.indexOf('H)') > 0 ||
                  lF.indexOf('+H ') > 0 ||
                  lF.indexOf('-H ') > 0 ||
                  lF.indexOf('*H ') > 0 ||
                  lF.indexOf('/H ') > 0 ||
                  lF.indexOf('(H ') > 0 ||
                  lF.indexOf(' H ') > 0 ||
                  lF.lastIndexOf('+H') == lF.length - 2 ||
                  lF.lastIndexOf('-H') == lF.length - 2 ||
                  lF.lastIndexOf('*H') == lF.length - 2 ||
                  lF.lastIndexOf('/H') == lF.length - 2 ||
                  lF.lastIndexOf(' H') == lF.length - 2))) &&
              (lItem['H'] == 0 || lItem['H'] == null)) ||
            (((lF.length == 1 && lF.indexOf('I') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('I+') >= 0 ||
                  lF.indexOf('I-') >= 0 ||
                  lF.indexOf('I*') >= 0 ||
                  lF.indexOf('I/') >= 0 ||
                  lF.indexOf('I)') > 0 ||
                  lF.indexOf('+I ') > 0 ||
                  lF.indexOf('-I ') > 0 ||
                  lF.indexOf('*I ') > 0 ||
                  lF.indexOf('/I ') > 0 ||
                  lF.indexOf('(I ') > 0 ||
                  lF.indexOf(' I ') > 0 ||
                  lF.lastIndexOf('+I') == lF.length - 2 ||
                  lF.lastIndexOf('-I') == lF.length - 2 ||
                  lF.lastIndexOf('*I') == lF.length - 2 ||
                  lF.lastIndexOf('/I') == lF.length - 2 ||
                  lF.lastIndexOf(' I') == lF.length - 2))) &&
              (lItem['I'] == 0 || lItem['I'] == null)) ||
            (((lF.length == 1 && lF.indexOf('J') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('J+') >= 0 ||
                  lF.indexOf('J-') >= 0 ||
                  lF.indexOf('J*') >= 0 ||
                  lF.indexOf('J/') >= 0 ||
                  lF.indexOf('J)') > 0 ||
                  lF.indexOf('+J ') > 0 ||
                  lF.indexOf('-J ') > 0 ||
                  lF.indexOf('*J ') > 0 ||
                  lF.indexOf('/J ') > 0 ||
                  lF.indexOf('(J ') > 0 ||
                  lF.indexOf(' J ') > 0 ||
                  lF.lastIndexOf('+J') == lF.length - 2 ||
                  lF.lastIndexOf('-J') == lF.length - 2 ||
                  lF.lastIndexOf('*J') == lF.length - 2 ||
                  lF.lastIndexOf('/J') == lF.length - 2 ||
                  lF.lastIndexOf(' J') == lF.length - 2))) &&
              (lItem['J'] == 0 || lItem['J'] == null)) ||
            (((lF.length == 1 && lF.indexOf('K') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('K+') >= 0 ||
                  lF.indexOf('K-') >= 0 ||
                  lF.indexOf('K*') >= 0 ||
                  lF.indexOf('K/') >= 0 ||
                  lF.indexOf('K)') > 0 ||
                  lF.indexOf('+K ') > 0 ||
                  lF.indexOf('-K ') > 0 ||
                  lF.indexOf('*K ') > 0 ||
                  lF.indexOf('/K ') > 0 ||
                  lF.indexOf('(K ') > 0 ||
                  lF.indexOf(' K ') > 0 ||
                  lF.lastIndexOf('+K') == lF.length - 2 ||
                  lF.lastIndexOf('-K') == lF.length - 2 ||
                  lF.lastIndexOf('*K') == lF.length - 2 ||
                  lF.lastIndexOf('/K') == lF.length - 2 ||
                  lF.lastIndexOf(' K') == lF.length - 2))) &&
              (lItem['K'] == 0 || lItem['K'] == null)) ||
            (((lF.length == 1 && lF.indexOf('L') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('L+') >= 0 ||
                  lF.indexOf('L-') >= 0 ||
                  lF.indexOf('L*') >= 0 ||
                  lF.indexOf('L/') >= 0 ||
                  lF.indexOf('L)') > 0 ||
                  lF.indexOf('+L ') > 0 ||
                  lF.indexOf('-L ') > 0 ||
                  lF.indexOf('*L ') > 0 ||
                  lF.indexOf('/L ') > 0 ||
                  lF.indexOf('(L ') > 0 ||
                  lF.indexOf(' L ') > 0 ||
                  lF.lastIndexOf('+L') == lF.length - 2 ||
                  lF.lastIndexOf('-L') == lF.length - 2 ||
                  lF.lastIndexOf('*L') == lF.length - 2 ||
                  lF.lastIndexOf('/L') == lF.length - 2 ||
                  lF.lastIndexOf(' L') == lF.length - 2))) &&
              (lItem['L'] == 0 || lItem['L'] == null)) ||
            (((lF.length == 1 && lF.indexOf('M') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('M+') >= 0 ||
                  lF.indexOf('M-') >= 0 ||
                  lF.indexOf('M*') >= 0 ||
                  lF.indexOf('M/') >= 0 ||
                  lF.indexOf('M)') > 0 ||
                  lF.indexOf('+M ') > 0 ||
                  lF.indexOf('-M ') > 0 ||
                  lF.indexOf('*M ') > 0 ||
                  lF.indexOf('/M ') > 0 ||
                  lF.indexOf('(M ') > 0 ||
                  lF.indexOf(' M ') > 0 ||
                  lF.lastIndexOf('+M') == lF.length - 2 ||
                  lF.lastIndexOf('-M') == lF.length - 2 ||
                  lF.lastIndexOf('*M') == lF.length - 2 ||
                  lF.lastIndexOf('/M') == lF.length - 2 ||
                  lF.lastIndexOf(' M') == lF.length - 2))) &&
              (lItem['M'] == 0 || lItem['M'] == null)) ||
            (((lF.length == 1 && lF.indexOf('N') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('N+') >= 0 ||
                  lF.indexOf('N-') >= 0 ||
                  lF.indexOf('N*') >= 0 ||
                  lF.indexOf('N/') >= 0 ||
                  lF.indexOf('N)') > 0 ||
                  lF.indexOf('+N ') > 0 ||
                  lF.indexOf('-N ') > 0 ||
                  lF.indexOf('*N ') > 0 ||
                  lF.indexOf('/N ') > 0 ||
                  lF.indexOf('(N ') > 0 ||
                  lF.indexOf(' N ') > 0 ||
                  lF.lastIndexOf('+N') == lF.length - 2 ||
                  lF.lastIndexOf('-N') == lF.length - 2 ||
                  lF.lastIndexOf('*N') == lF.length - 2 ||
                  lF.lastIndexOf('/N') == lF.length - 2 ||
                  lF.lastIndexOf(' N') == lF.length - 2))) &&
              (lItem['N'] == 0 || lItem['N'] == null)) ||
            (((lF.length == 1 && lF.indexOf('O') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('O+') >= 0 ||
                  lF.indexOf('O-') >= 0 ||
                  lF.indexOf('O*') >= 0 ||
                  lF.indexOf('O/') >= 0 ||
                  lF.indexOf('O)') > 0 ||
                  lF.indexOf('+O ') > 0 ||
                  lF.indexOf('-O ') > 0 ||
                  lF.indexOf('*O ') > 0 ||
                  lF.indexOf('/O ') > 0 ||
                  lF.indexOf('(O ') > 0 ||
                  lF.indexOf(' O ') > 0 ||
                  lF.lastIndexOf('+O') == lF.length - 2 ||
                  lF.lastIndexOf('-O') == lF.length - 2 ||
                  lF.lastIndexOf('*O') == lF.length - 2 ||
                  lF.lastIndexOf('/O') == lF.length - 2 ||
                  lF.lastIndexOf(' O') == lF.length - 2))) &&
              (lItem['O'] == 0 || lItem['O'] == null)) ||
            (((lF.length == 1 && lF.indexOf('P') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('P+') >= 0 ||
                  lF.indexOf('P-') >= 0 ||
                  lF.indexOf('P*') >= 0 ||
                  lF.indexOf('P/') >= 0 ||
                  lF.indexOf('P)') > 0 ||
                  lF.indexOf('+P ') > 0 ||
                  lF.indexOf('-P ') > 0 ||
                  lF.indexOf('*P ') > 0 ||
                  lF.indexOf('/P ') > 0 ||
                  lF.indexOf('(P ') > 0 ||
                  lF.indexOf(' P ') > 0 ||
                  lF.lastIndexOf('+P') == lF.length - 2 ||
                  lF.lastIndexOf('-P') == lF.length - 2 ||
                  lF.lastIndexOf('*P') == lF.length - 2 ||
                  lF.lastIndexOf('/P') == lF.length - 2 ||
                  lF.lastIndexOf(' P') == lF.length - 2))) &&
              (lItem['P'] == 0 || lItem['P'] == null)) ||
            (((lF.length == 1 && lF.indexOf('Q') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('Q+') >= 0 ||
                  lF.indexOf('Q-') >= 0 ||
                  lF.indexOf('Q*') >= 0 ||
                  lF.indexOf('Q/') >= 0 ||
                  lF.indexOf('Q)') > 0 ||
                  lF.indexOf('+Q ') > 0 ||
                  lF.indexOf('-Q ') > 0 ||
                  lF.indexOf('*Q ') > 0 ||
                  lF.indexOf('/Q ') > 0 ||
                  lF.indexOf('(Q ') > 0 ||
                  lF.indexOf(' Q ') > 0 ||
                  lF.lastIndexOf('+Q') == lF.length - 2 ||
                  lF.lastIndexOf('-Q') == lF.length - 2 ||
                  lF.lastIndexOf('*Q') == lF.length - 2 ||
                  lF.lastIndexOf('/Q') == lF.length - 2 ||
                  lF.lastIndexOf(' Q') == lF.length - 2))) &&
              (lItem['Q'] == 0 || lItem['Q'] == null)) ||
            (((lF.length == 1 && lF.indexOf('R') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('R+') >= 0 ||
                  lF.indexOf('R-') >= 0 ||
                  lF.indexOf('R*') >= 0 ||
                  lF.indexOf('R/') >= 0 ||
                  lF.indexOf('R)') > 0 ||
                  lF.indexOf('+R ') > 0 ||
                  lF.indexOf('-R ') > 0 ||
                  lF.indexOf('*R ') > 0 ||
                  lF.indexOf('/R ') > 0 ||
                  lF.indexOf('(R ') > 0 ||
                  lF.indexOf(' R ') > 0 ||
                  lF.lastIndexOf('+R') == lF.length - 2 ||
                  lF.lastIndexOf('-R') == lF.length - 2 ||
                  lF.lastIndexOf('*R') == lF.length - 2 ||
                  lF.lastIndexOf('/R') == lF.length - 2 ||
                  lF.lastIndexOf(' R') == lF.length - 2))) &&
              (lItem['R'] == 0 || lItem['R'] == null)) ||
            (((lF.length == 1 && lF.indexOf('S') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('S+') >= 0 ||
                  lF.indexOf('S-') >= 0 ||
                  lF.indexOf('S*') >= 0 ||
                  lF.indexOf('S/') >= 0 ||
                  lF.indexOf('S)') > 0 ||
                  lF.indexOf('+S ') > 0 ||
                  lF.indexOf('-S ') > 0 ||
                  lF.indexOf('*S ') > 0 ||
                  lF.indexOf('/S ') > 0 ||
                  lF.indexOf('(S ') > 0 ||
                  lF.indexOf(' S ') > 0 ||
                  lF.lastIndexOf('+S') == lF.length - 2 ||
                  lF.lastIndexOf('-S') == lF.length - 2 ||
                  lF.lastIndexOf('*S') == lF.length - 2 ||
                  lF.lastIndexOf('/S') == lF.length - 2 ||
                  lF.lastIndexOf(' S') == lF.length - 2))) &&
              (lItem['S'] == 0 || lItem['S'] == null)) ||
            (((lF.length == 1 && lF.indexOf('T') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('T+') >= 0 ||
                  lF.indexOf('T-') >= 0 ||
                  lF.indexOf('T*') >= 0 ||
                  lF.indexOf('T/') >= 0 ||
                  lF.indexOf('T)') > 0 ||
                  lF.indexOf('+T ') > 0 ||
                  lF.indexOf('-T ') > 0 ||
                  lF.indexOf('*T ') > 0 ||
                  lF.indexOf('/T ') > 0 ||
                  lF.indexOf('(T ') > 0 ||
                  lF.indexOf(' T ') > 0 ||
                  lF.lastIndexOf('+T') == lF.length - 2 ||
                  lF.lastIndexOf('-T') == lF.length - 2 ||
                  lF.lastIndexOf('*T') == lF.length - 2 ||
                  lF.lastIndexOf('/T') == lF.length - 2 ||
                  lF.lastIndexOf(' T') == lF.length - 2))) &&
              (lItem['T'] == 0 || lItem['T'] == null)) ||
            (((lF.length == 1 && lF.indexOf('U') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('U+') >= 0 ||
                  lF.indexOf('U-') >= 0 ||
                  lF.indexOf('U*') >= 0 ||
                  lF.indexOf('U/') >= 0 ||
                  lF.indexOf('U)') > 0 ||
                  lF.indexOf('+U ') > 0 ||
                  lF.indexOf('-U ') > 0 ||
                  lF.indexOf('*U ') > 0 ||
                  lF.indexOf('/U ') > 0 ||
                  lF.indexOf('(U ') > 0 ||
                  lF.indexOf(' U ') > 0 ||
                  lF.lastIndexOf('+U') == lF.length - 2 ||
                  lF.lastIndexOf('-U') == lF.length - 2 ||
                  lF.lastIndexOf('*U') == lF.length - 2 ||
                  lF.lastIndexOf('/U') == lF.length - 2 ||
                  lF.lastIndexOf(' U') == lF.length - 2))) &&
              (lItem['U'] == 0 || lItem['U'] == null)) ||
            (((lF.length == 1 && lF.indexOf('V') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('V+') >= 0 ||
                  lF.indexOf('V-') >= 0 ||
                  lF.indexOf('V*') >= 0 ||
                  lF.indexOf('V/') >= 0 ||
                  lF.indexOf('V)') > 0 ||
                  lF.indexOf('+V ') > 0 ||
                  lF.indexOf('-V ') > 0 ||
                  lF.indexOf('*V ') > 0 ||
                  lF.indexOf('/V ') > 0 ||
                  lF.indexOf('(V ') > 0 ||
                  lF.indexOf(' V ') > 0 ||
                  lF.lastIndexOf('+V') == lF.length - 2 ||
                  lF.lastIndexOf('-V') == lF.length - 2 ||
                  lF.lastIndexOf('*V') == lF.length - 2 ||
                  lF.lastIndexOf('/V') == lF.length - 2 ||
                  lF.lastIndexOf(' V') == lF.length - 2))) &&
              (lItem['V'] == 0 || lItem['V'] == null)) ||
            (((lF.length == 1 && lF.indexOf('W') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('W+') >= 0 ||
                  lF.indexOf('W-') >= 0 ||
                  lF.indexOf('W*') >= 0 ||
                  lF.indexOf('W/') >= 0 ||
                  lF.indexOf('W)') > 0 ||
                  lF.indexOf('+W ') > 0 ||
                  lF.indexOf('-W ') > 0 ||
                  lF.indexOf('*W ') > 0 ||
                  lF.indexOf('/W ') > 0 ||
                  lF.indexOf('(W ') > 0 ||
                  lF.indexOf(' W ') > 0 ||
                  lF.lastIndexOf('+W') == lF.length - 2 ||
                  lF.lastIndexOf('-W') == lF.length - 2 ||
                  lF.lastIndexOf('*W') == lF.length - 2 ||
                  lF.lastIndexOf('/W') == lF.length - 2 ||
                  lF.lastIndexOf(' W') == lF.length - 2))) &&
              (lItem['W'] == 0 || lItem['W'] == null)) ||
            (((lF.length == 1 && lF.indexOf('X') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('X+') >= 0 ||
                  lF.indexOf('X-') >= 0 ||
                  lF.indexOf('X*') >= 0 ||
                  lF.indexOf('X/') >= 0 ||
                  lF.indexOf('X)') > 0 ||
                  lF.indexOf('+X ') > 0 ||
                  lF.indexOf('-X ') > 0 ||
                  lF.indexOf('*X ') > 0 ||
                  lF.indexOf('/X ') > 0 ||
                  lF.indexOf('(X ') > 0 ||
                  lF.indexOf(' X ') > 0 ||
                  lF.lastIndexOf('+X') == lF.length - 2 ||
                  lF.lastIndexOf('-X') == lF.length - 2 ||
                  lF.lastIndexOf('*X') == lF.length - 2 ||
                  lF.lastIndexOf('/X') == lF.length - 2 ||
                  lF.lastIndexOf(' X') == lF.length - 2))) &&
              (lItem['X'] == 0 || lItem['X'] == null)) ||
            (((lF.length == 1 && lF.indexOf('Y') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('Y+') >= 0 ||
                  lF.indexOf('Y-') >= 0 ||
                  lF.indexOf('Y*') >= 0 ||
                  lF.indexOf('Y/') >= 0 ||
                  lF.indexOf('Y)') > 0 ||
                  lF.indexOf('+Y ') > 0 ||
                  lF.indexOf('-Y ') > 0 ||
                  lF.indexOf('*Y ') > 0 ||
                  lF.indexOf('/Y ') > 0 ||
                  lF.indexOf('(Y ') > 0 ||
                  lF.indexOf(' Y ') > 0 ||
                  lF.lastIndexOf('+Y') == lF.length - 2 ||
                  lF.lastIndexOf('-Y') == lF.length - 2 ||
                  lF.lastIndexOf('*Y') == lF.length - 2 ||
                  lF.lastIndexOf('/Y') == lF.length - 2 ||
                  lF.lastIndexOf(' Y') == lF.length - 2))) &&
              (lItem['Y'] == 0 || lItem['Y'] == null)) ||
            (((lF.length == 1 && lF.indexOf('Z') >= 0) ||
              (lF.length > 1 &&
                (lF.indexOf('Z+') >= 0 ||
                  lF.indexOf('Z-') >= 0 ||
                  lF.indexOf('Z*') >= 0 ||
                  lF.indexOf('Z/') >= 0 ||
                  lF.indexOf('Z)') > 0 ||
                  lF.indexOf('+Z ') > 0 ||
                  lF.indexOf('-Z ') > 0 ||
                  lF.indexOf('*Z ') > 0 ||
                  lF.indexOf('/Z ') > 0 ||
                  lF.indexOf('(Z ') > 0 ||
                  lF.indexOf(' Z ') > 0 ||
                  lF.lastIndexOf('+Z') == lF.length - 2 ||
                  lF.lastIndexOf('-Z') == lF.length - 2 ||
                  lF.lastIndexOf('*Z') == lF.length - 2 ||
                  lF.lastIndexOf('/Z') == lF.length - 2 ||
                  lF.lastIndexOf(' Z') == lF.length - 2))) &&
              (lItem['Z'] == 0 || lItem['Z'] == null))
          ) {
            return lResult;
          }

          //Dia
          if (lF.indexOf('$') >= 0)
            lF = lF.replace(new RegExp('\\$', 'g'), pDia);
          //Pin
          if (lF.indexOf('@@') >= 0)
            lF = lF.replace(new RegExp('@@', 'g'), lPinSize / 2);

          //Assign Value1
          lF = this.fmAssignValue1(lF, 'A', lItem['A']);
          lF = this.fmAssignValue1(lF, 'B', lItem['B']);
          lF = this.fmAssignValue1(lF, 'C', lItem['C']);
          lF = this.fmAssignValue1(lF, 'D', lItem['D']);
          lF = this.fmAssignValue1(lF, 'E', lItem['E']);
          lF = this.fmAssignValue1(lF, 'F', lItem['F']);
          lF = this.fmAssignValue1(lF, 'G', lItem['G']);
          lF = this.fmAssignValue1(lF, 'H', lItem['H']);
          lF = this.fmAssignValue1(lF, 'I', lItem['I']);
          lF = this.fmAssignValue1(lF, 'J', lItem['J']);
          lF = this.fmAssignValue1(lF, 'K', lItem['K']);
          lF = this.fmAssignValue1(lF, 'L', lItem['L']);
          lF = this.fmAssignValue1(lF, 'M', lItem['M']);
          lF = this.fmAssignValue1(lF, 'N', lItem['N']);
          lF = this.fmAssignValue1(lF, 'O', lItem['O']);
          lF = this.fmAssignValue1(lF, 'P', lItem['P']);
          lF = this.fmAssignValue1(lF, 'Q', lItem['Q']);
          lF = this.fmAssignValue1(lF, 'R', lItem['R']);
          lF = this.fmAssignValue1(lF, 'S', lItem['S']);
          lF = this.fmAssignValue1(lF, 'T', lItem['T']);
          lF = this.fmAssignValue1(lF, 'U', lItem['U']);
          lF = this.fmAssignValue1(lF, 'V', lItem['V']);
          lF = this.fmAssignValue1(lF, 'W', lItem['W']);
          lF = this.fmAssignValue1(lF, 'X', lItem['X']);
          lF = this.fmAssignValue1(lF, 'Y', lItem['Y']);
          lF = this.fmAssignValue1(lF, 'Z', lItem['Z']);

          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');

          lVarMax = math.evaluate(lF);
          //lVarMax = eval(lF);
          if (pParamType == 'V') {
            if (isNaN(lVarMax)) {
              if (pDefaultValue > 90) {
                lVarMax = 91;
              } else {
                lVarMax = 89;
              }
            } else {
              if (pDefaultValue > 90 && lVarMax < 90) {
                lVarMax = lVarMax + 90;
              }
            }
          }
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMax = lVarMax + getVarMaxValue(pValue);
          //}
          //else {
          //    lVarMax = lVarMax - getVarMaxValue(lItem[lColumnName]) + getVarMaxValue(pValue);
          //}

          lF = pFormula;

          lF = lF.trim();
          lF = lF.replace(new RegExp(' \\(', 'g'), '(');

          //Dia
          if (lF.indexOf('$') >= 0)
            lF = lF.replace(new RegExp('\\$', 'g'), pDia);
          //Pin
          if (lF.indexOf('@@') >= 0)
            lF = lF.replace(new RegExp('@@', 'g'), lPinSize / 2);

          //Assign Value1
          lF = this.fmAssignValue2(lF, 'A', lItem['A']);
          lF = this.fmAssignValue2(lF, 'B', lItem['B']);
          lF = this.fmAssignValue2(lF, 'C', lItem['C']);
          lF = this.fmAssignValue2(lF, 'D', lItem['D']);
          lF = this.fmAssignValue2(lF, 'E', lItem['E']);
          lF = this.fmAssignValue2(lF, 'F', lItem['F']);
          lF = this.fmAssignValue2(lF, 'G', lItem['G']);
          lF = this.fmAssignValue2(lF, 'H', lItem['H']);
          lF = this.fmAssignValue2(lF, 'I', lItem['I']);
          lF = this.fmAssignValue2(lF, 'J', lItem['J']);
          lF = this.fmAssignValue2(lF, 'K', lItem['K']);
          lF = this.fmAssignValue2(lF, 'L', lItem['L']);
          lF = this.fmAssignValue2(lF, 'M', lItem['M']);
          lF = this.fmAssignValue2(lF, 'N', lItem['N']);
          lF = this.fmAssignValue2(lF, 'O', lItem['O']);
          lF = this.fmAssignValue2(lF, 'P', lItem['P']);
          lF = this.fmAssignValue2(lF, 'Q', lItem['Q']);
          lF = this.fmAssignValue2(lF, 'R', lItem['R']);
          lF = this.fmAssignValue2(lF, 'S', lItem['S']);
          lF = this.fmAssignValue2(lF, 'T', lItem['T']);
          lF = this.fmAssignValue2(lF, 'U', lItem['U']);
          lF = this.fmAssignValue2(lF, 'V', lItem['V']);
          lF = this.fmAssignValue2(lF, 'W', lItem['W']);
          lF = this.fmAssignValue2(lF, 'X', lItem['X']);
          lF = this.fmAssignValue2(lF, 'Y', lItem['Y']);
          lF = this.fmAssignValue2(lF, 'Z', lItem['Z']);

          //if (lF.indexOf("math") >= 0) {
          //    lF = lF.split("math").join("Math");
          //}
          //if (lF.indexOf("pi") >= 0) {
          //    lF = lF.split("pi").join("PI");
          //}
          if (lF.indexOf('math.') >= 0)
            lF = lF.replace(new RegExp('math.', 'g'), '');

          lVarMin = math.evaluate(lF);
          if (pParamType == 'V') {
            if (isNaN(lVarMin)) {
              if (pDefaultValue > 90) {
                lVarMin = 91;
              } else {
                lVarMin = 89;
              }
            } else {
              if (pDefaultValue > 90 && lVarMin < 90) {
                lVarMin = lVarMin + 90;
              }
            }
          }
          //call it in validation -- before the cell value -- it is ld value.
          //if (lItem[lColumnName] == null) {
          //    lVarMin = lVarMin + getVarMinValue(pValue);
          //}
          //else {
          //    lVarMin = lVarMin - getVarMinValue(lItem[lColumnName]) + getVarMinValue(pValue);
          //}

          lVarMin = Math.round(lVarMin);
          lVarMax = Math.round(lVarMax);

          if (lVarMin == 0 || lVarMin == lVarMax) {
            lResult = lVarMax.toString();
          } else {
            lResult = lVarMax + '-' + lVarMin;
          }
        }
      }
    }
    return lResult;
  }

  fmAssignValue1(pIF: any, pPar: any, pVal: any) {
    //single
    if (pIF.length == 1 && pIF.indexOf(pPar) >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(new RegExp(pPar, 'g'), this.getVarValue1(pVal));
      } else {
        pIF = pIF.replace(new RegExp(pPar, 'g'), pVal);
      }
    }

    //right ops +-*/)
    if (pIF.length > 1 && pIF.indexOf(pPar + '+') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '\\+', 'g'),
          this.getVarValue1(pVal) + '+'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '\\+', 'g'), pVal + '+');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + '-') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '-', 'g'),
          this.getVarValue1(pVal) + '-'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '-', 'g'), pVal + '-');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + '*') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '\\*', 'g'),
          this.getVarValue1(pVal) + '*'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '\\*', 'g'), pVal + '*');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + '/') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '\\/', 'g'),
          this.getVarValue1(pVal) + '/'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '\\/', 'g'), pVal + '/');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + ')') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '\\)', 'g'),
          this.getVarValue1(pVal) + ')'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '\\)', 'g'), pVal + ')');
      }
    }

    //right sace middle +-*/(space
    if (pIF.length > 1 && pIF.indexOf('+' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('\\+' + pPar + ' ', 'g'),
          '+' + this.getVarValue1(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(
          new RegExp('\\+' + pPar + ' ', 'g'),
          '+' + pVal + ' '
        );
      }
    }
    if (pIF.length > 1 && pIF.indexOf('-' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('-' + pPar + ' ', 'g'),
          '-' + this.getVarValue1(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(new RegExp('-' + pPar + ' ', 'g'), '-' + pVal + ' ');
      }
    }
    if (pIF.length > 1 && pIF.indexOf('*' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('\\*' + pPar + ' ', 'g'),
          '*' + this.getVarValue1(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(
          new RegExp('\\*' + pPar + ' ', 'g'),
          '*' + pVal + ' '
        );
      }
    }
    if (pIF.length > 1 && pIF.indexOf('/' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('\\/' + pPar + ' ', 'g'),
          '/' + this.getVarValue1(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(
          new RegExp('\\/' + pPar + ' ', 'g'),
          '/' + pVal + ' '
        );
      }
    }
    if (pIF.length > 1 && pIF.indexOf('(' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('\\(' + pPar + ' ', 'g'),
          '(' + this.getVarValue1(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(
          new RegExp('\\(' + pPar + ' ', 'g'),
          '(' + pVal + ' '
        );
      }
    }
    if (pIF.length > 1 && pIF.indexOf(' ' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(' ' + pPar + ' ', 'g'),
          ' ' + this.getVarValue1(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(new RegExp(' ' + pPar + ' ', 'g'), ' ' + pVal + ' ');
      }
    }

    //Last +-*/space
    if (pIF.length > 1 && pIF.lastIndexOf('+' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '+' + this.getVarValue1(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '+' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf('-' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '-' + this.getVarValue1(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '-' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf('*' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '*' + this.getVarValue1(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '*' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf('/' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '/' + this.getVarValue1(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '/' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf(' ' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + ' ' + this.getVarValue1(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + ' ' + pVal;
      }
    }
    return pIF;
  }

  fmAssignValue2(pIF: any, pPar: any, pVal: any) {
    //single
    if (pIF.length == 1 && pIF.indexOf(pPar) >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(new RegExp(pPar, 'g'), this.getVarValue2(pVal));
      } else {
        pIF = pIF.replace(new RegExp(pPar, 'g'), pVal);
      }
    }

    //right ops +-*/)
    if (pIF.length > 1 && pIF.indexOf(pPar + '+') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '\\+', 'g'),
          this.getVarValue2(pVal) + '+'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '\\+', 'g'), pVal + '+');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + '-') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '-', 'g'),
          this.getVarValue2(pVal) + '-'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '-', 'g'), pVal + '-');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + '*') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '\\*', 'g'),
          this.getVarValue2(pVal) + '*'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '\\*', 'g'), pVal + '*');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + '/') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '/', 'g'),
          this.getVarValue2(pVal) + '/'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '/', 'g'), pVal + '/');
      }
    }
    if (pIF.length > 1 && pIF.indexOf(pPar + ')') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(pPar + '\\)', 'g'),
          this.getVarValue2(pVal) + ')'
        );
      } else {
        pIF = pIF.replace(new RegExp(pPar + '\\)', 'g'), pVal + ')');
      }
    }

    //right sace middle +-*/(space
    if (pIF.length > 1 && pIF.indexOf('+' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('\\+' + pPar + ' ', 'g'),
          '+' + this.getVarValue2(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(
          new RegExp('\\+' + pPar + ' ', 'g'),
          '+' + pVal + ' '
        );
      }
    }
    if (pIF.length > 1 && pIF.indexOf('-' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('-' + pPar + ' ', 'g'),
          '-' + this.getVarValue2(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(new RegExp('-' + pPar + ' ', 'g'), '-' + pVal + ' ');
      }
    }
    if (pIF.length > 1 && pIF.indexOf('*' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('\\*' + pPar + ' ', 'g'),
          '*' + this.getVarValue2(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(
          new RegExp('\\*' + pPar + ' ', 'g'),
          '*' + pVal + ' '
        );
      }
    }
    if (pIF.length > 1 && pIF.indexOf('/' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('/' + pPar + ' ', 'g'),
          '/' + this.getVarValue2(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(new RegExp('/' + pPar + ' ', 'g'), '/' + pVal + ' ');
      }
    }
    if (pIF.length > 1 && pIF.indexOf('(' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp('\\(' + pPar + ' ', 'g'),
          '(' + this.getVarValue2(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(
          new RegExp('\\(' + pPar + ' ', 'g'),
          '(' + pVal + ' '
        );
      }
    }
    if (pIF.length > 1 && pIF.indexOf(' ' + pPar + ' ') >= 0) {
      if (isNaN(pVal)) {
        pIF = pIF.replace(
          new RegExp(' ' + pPar + ' ', 'g'),
          ' ' + this.getVarValue2(pVal) + ' '
        );
      } else {
        pIF = pIF.replace(new RegExp(' ' + pPar + ' ', 'g'), ' ' + pVal + ' ');
      }
    }

    //Last +-*/space
    if (pIF.length > 1 && pIF.lastIndexOf('+' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '+' + this.getVarValue2(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '+' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf('-' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '-' + this.getVarValue2(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '-' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf('*' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '*' + this.getVarValue2(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '*' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf('/' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + '/' + this.getVarValue2(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + '/' + pVal;
      }
    }
    if (pIF.length > 1 && pIF.lastIndexOf(' ' + pPar) == pIF.length - 2) {
      if (isNaN(pVal)) {
        pIF = pIF.substring(0, pIF.length - 2) + ' ' + this.getVarValue2(pVal);
      } else {
        pIF = pIF.substring(0, pIF.length - 2) + ' ' + pVal;
      }
    }
    return pIF;
  }

  parameterValidator(args: any, value: any, columnName: any) {
    // var gridID = $("#tabs").tabs('option', 'active') + 1;
    let Grid = this.templateGrid.slickGrid;
    let DataView = this.dataViewCAB;
    if (Grid == null) {
      return { valid: true, msg: null };
    }
    let lCurrRow = args.row;
    let lCurrCell = Grid.getActiveCell().cell;

    // let lColumnName = args.grid.getColumns(args.row)[args.cell]["id"];
    var lColumnName = Grid.getColumns()[lCurrCell]['id'];

    // var lColumnName = Grid.getColumns(lCurrRow)[lCurrCell]["id"];
    var lItem = Grid.getDataItem(lCurrRow);
    // Validate parameters
    //1.Validate Bending limit and angle
    var lShape = lItem.BarShapeCode;
    var lPara = lItem.shapeParameters;
    var lValid = lItem.shapeParaValidator;
    var lTransportValid = lItem.shapeTransportValidator;
    var lDia = lItem.BarSize;
    var lValue = value;

    if (isNaN(lValue) == true) {
      if (lValue.indexOf('-') <= 0) {
        //alert("Invalid data entered. Please enter numeric.");
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter numeric value.(输入数据无效, 请输入数字)',
        };
      } else {
        var lMax = this.getVarMaxValue(lValue);
        var lMin = this.getVarMinValue(lValue);
        if (lMax <= 0 || lMin <= 0 || lMin == lMax) {
          //alert("Invalid data entered. Please enter valid muneric range.");
          // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'Invalid data entered. Please enter valid numeric range.(输入数据无效, 请输入数字范围)',
          };
        }

        //Check Various Bar
        var lEachQty = lItem.BarEachQty;
        var lMbrQty = lItem.BarMemberQty;

        if (lEachQty == null) {
          lEachQty = 0;
        }
        if (lMbrQty == null) {
          lMbrQty = 0;
        }
        if (
          this.gVarianceBarSplit == 'Y' &&
          lEachQty * lMbrQty >= 5 &&
          this.getNoVariousBar(DataView.getItems(), 9999) > 26
        ) {
          // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg:
              'Have reached the maximum number of various bar items limit 26. Please create another order / BBS to split the BBS.\n\n' +
              '已达到变长钢筋的最大行数限制26。请创建另一个订单/BBS来拆分此BBS.',
          };
          return false;
        }
      }
    }

    if (lValue.indexOf('.') >= 0) {
      // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue <= 0) {
      //alert("Indalid parameter value.");
      // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Indalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }
    var msgRef = { msg: '' };
    if (
      this.isValidValue(lColumnName, lPara, lDia, lValue, lItem, msgRef, 1) ==
      false
    ) {
      if (this.gSkipBendCheck == 'Y') {
        alert(
          msgRef.msg +
          '\nYou can continue to input data, but the order will send to NatSteel Planning Dept for review and approval. /n(你可以继续输入数据, 但是此订单需要大众钢铁的检查和批准.)'
        );
      } else {
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return { valid: false, msg: msgRef.msg };
      }
    }

    //var lTotalLength = calTotalLen(lItem, lColumnName, lValue);
    //// validate the Total Length
    //var lMaxLength = getVarMaxValue(lTotalLength);
    //if (lMaxLength > 12000) {
    //    //alert("Total bar length is " + lTotalLength + ", which exceeds maximum 12000 limit.");
    //    $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
    //    return { valid: false, msg: "Total bar length is " + lTotalLength + ", which exceeds maximum 12000 limit.(钢筋的总长度 " + lTotalLength + ", 已超过其最大极限值12000)" };
    //}
    //Grid.getDataItem(lCurrRow)["BarLength"] = lTotalLength;

    //if (lItem.BarShapeCode == "020" && lValue < 600) {
    //    //alert("Invalid data entered. Please check minimum bending length or height constraint.");
    //    $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
    //    return { valid: false, msg: "Total bar length " + lValue + ", which  is less than minimum value 600.(钢筋总长度为 " + lValue + ", 已小过其最小值600)" };
    //}

    if (this.gMaxBarLength > 12000 && lItem.BarSTD == true) {
      if (lValue != 12000 && lValue != 14000) {
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'The parameter A should be 12000 or 14000 for standard bar.(参数A的值应该是12000或14000)',
        };
      }
    }
    if (
      lDia != null &&
      this.gMaxBarLength == 14000 &&
      lItem.BarSTD == true &&
      !isNaN(lDia)
    ) {
      var lFound = 0;
      var lItemBarType = lItem.BarType;
      for (let i = 0; i < this.gSBBarType.length; i++) {
        if (
          lItemBarType == this.gSBBarType[i] &&
          parseInt(lDia) == this.gSBBarSize[i] &&
          this.gSBLength[i] == 14000
        ) {
          lFound = 1;
          break;
        }
      }
      if (lFound == 0) {
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'The Bar Grade and Size does not support 14m standard bar.(此型号不支持14米标准钢筋)',
        };
      }
    }

    if (
      lShape != null &&
      lShape.length >= 3 &&
      this.getVarMinValue(lValue) < 800 &&
      lShape != 'H1I' &&
      lShape != 'K1J' &&
      lShape != 'H1K' &&
      lShape != 'C1N' &&
      lShape != 'P1S'
    ) {
      var lFirst = lShape.substring(0, 2);
      var lLast = lShape.substring(2, 3);
      if (
        ((lFirst == 'H1' ||
          lFirst == 'I1' ||
          lFirst == 'J1' ||
          lFirst == 'K1') &&
          (lLast == 'H' || lLast == 'I' || lLast == 'J' || lLast == 'K')) ||
        ((lFirst == 'C1' ||
          lFirst == 'S1' ||
          lFirst == 'P1' ||
          lFirst == 'N1') &&
          (lLast == 'C' || lLast == 'S' || lLast == 'P' || lLast == 'N'))
      ) {
        if (
          confirm(
            'This order can only be cut on manual cutter. If you obtained approval from NatSteel, you may continue. Continue?\n\n' +
            '此订单只能在手动切割上操作。如果您已获得大众钢铁批准, 请继续。继续?'
          )
        ) {
        } else {
          // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'The minimum length is 800mm for coupler bar with 2 ends. (两头都有续接器的钢筋,其最小长度为800mm)',
          };
        }
      }
    }

    if (
      lShape != null &&
      lShape.length >= 3 &&
      this.getVarMinValue(lValue) < 600
    ) {
      if (
        lShape == 'H20' ||
        lShape == 'I20' ||
        lShape == 'J20' ||
        lShape == 'K20' ||
        lShape == 'C20' ||
        lShape == 'S20' ||
        lShape == 'P20' ||
        lShape == 'N20'
      ) {
        if (
          confirm(
            'This order can only be cut on manual cutter. If you already obtained approval from NatSteel, you may continue. Continue?\n\n' +
            '此订单只能在手动切割上操作。如果您已获得大众钢铁批准, 请继续。继续?'
          )
        ) {
        } else {
          // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
          return {
            valid: false,
            msg: 'The minimum length is 600mm for coupler bar with 1 end. (有续接器的钢筋,其最小长度为600mm)',
          };
        }
      }
    }

    if (
      lShape != null &&
      ((lDia == 8 &&
        (lShape == '020' || lShape == '20') &&
        this.getVarMaxValue(lValue) != 6000 &&
        this.getVarMaxValue(lValue) > 1800) ||
        (lDia == 8 &&
          lShape != '020' &&
          lShape != '20' &&
          this.getVarMaxValue(lValue) > 6000))
    ) {
      // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'The maximum segment length is 1800mm for 8mm bar.',
      };
    }
    return { valid: true, msg: null };
  }

  WeightValidator(args: any, value: any, columnName: any) {
    // Validate weight entered by user for SB
    // var gridID = $("#tabs").tabs('option', 'active') + 1;
    // var lCurrRow = Grid.getActiveCell().row;
    // var lItem = Grid.getDataItem(lCurrRow);

    var lValue = value;

    let Grid = this.templateGrid.slickGrid;
    let DataView = this.dataViewCAB;
    if (Grid == null) {
      return { valid: true, msg: null };
    }
    let lCurrRow = args.row;
    let lCurrCell = Grid.getActiveCell().cell;

    // var lColumnName = args.grid.getColumns(args.row)[args.cell]["id"];
    var lColumnName = Grid.getColumns()[lCurrCell]['id'];

    // var lColumnName = Grid.getColumns(lCurrRow)[lCurrCell]["id"];
    var lItem = Grid.getDataItem(lCurrRow);
    if (isNaN(lValue) == true) {
      //alert("Invalid data entered. Please enter numeric.");
      // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter numeric value.(输入数据无效, 请输入数字)',
      };
    }
    if (lValue <= 0) {
      //alert("Indalid parameter value.");
      // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Indalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }
    if (lItem.BarLength == 12000 || lItem.BarLength == 14000) {
      var lRem = lValue % 2000;
      if (lRem > 0) {
        //alert("Invalid weight. SB product can only order by bundles (2 tons per bundle). Please enter valid weight, such as 2000, 4000, 6000.");
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid weight value entered. 12m SB product can only order by bundles (2 tons per bundle). Please enter valid weight, such as 2000, 4000, 6000.' +
            '(输入的重量无效. 只能按捆来订购12米标准直铁产品(每捆2吨). 您可输入 2000, 4000, 6000 等等.)',
        };
      }
    } else if (lItem.BarLength == 6000) {
      var lRem = lValue % 1000;
      if (lRem > 0) {
        //alert("Invalid weight. SB product can only order by bundles (2 tons per bundle). Please enter valid weight, such as 2000, 4000, 6000.");
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg:
            'Invalid weight value entered. 6m SB product can only order by bundles (1 tons per bundle). Please enter valid weight, such as 1000, 2000, 3000.' +
            '(输入的重量无效. 只能按捆来订购6米标准直铁产品(每捆1吨). 您可输入 1000, 2000, 3000 等等.)',
        };
      }
    }
    return { valid: true, msg: null };
  }

  UpdateBarSize() {
    let index = this.templateColumns.findIndex(x => x.field == 'BarSize')
    let obj = {
      id: 'BarSize',
      name: 'Size\n直径',
      field: 'BarSize',
      toolTip: 'Bar Diameter (直径)',
      // minWidth: 40,
      // maxWidth: 40,
      // width: 40,
      editor: {
        model: Editors.autocompleter,
        collection: this.BarSizeList,
        editorOptions: {
          forceUserInput: true,
          minLength: 0,
        },
      },
      cssClass: 'left-align grid-text-size',
    }

    this.templateColumns[index] = obj;
  }

  async loadShapeInfo(pShapeCode: any, pGridID: any, pRowNo: any) {
    if (pShapeCode.value != undefined) {
      pShapeCode = pShapeCode.value;
    }
    if (pShapeCode != null && pShapeCode.trim() != '') {
      var lFoundShape = 0;
      if (this.bShapeCode.length > 0) {
        for (var i = 0; i < this.bShapeCode.length; i++) {
          if (pShapeCode == this.bShapeCode[i]) {
            this.gShapeParameters = this.bShapeParameters[i];
            this.gShapeLengthFormula = this.bShapeLengthFormula[i];
            this.gShapeParaValid = this.bShapeParaValid[i];
            this.gShapeTransValid = this.bShapeTransValid[i];
            this.gShapeImage = this.bShapeImage[i];
            this.gShapeParaX = this.bShapeParaX[i];
            this.gShapeParaY = this.bShapeParaY[i];
            this.gShapeParType = this.bShapeParType[i];
            this.gShapeDefaultValue = this.bShapeDefaultValue[i];
            this.gShapeHeightCheck = this.bShapeHeightCheck[i];
            this.gShapeAutoCalcFormula1 = this.bShapeAutoCalcFormula1[i];
            this.gShapeAutoCalcFormula2 = this.bShapeAutoCalcFormula2[i];
            this.gShapeAutoCalcFormula3 = this.bShapeAutoCalcFormula3[i];

            this.displayShapeImage(pGridID, pRowNo);

            //document.getElementById("rightShapeImage-" + pGridID).src = gShapeImage;
            //document.getElementById("btmShapeImage-" + pGridID).src = gShapeImage;
            this.showShapeImage = true;
            $('#rightShapeImage-' + pGridID).show();
            $('#btmShapeImage-' + pGridID).show();
            if (pRowNo >= 0) {
              var lItem = this.dataViewCAB.getItem(pRowNo);
              if (this.gShapeCode != lItem.BarShapeCode) {
                lItem.shapeParameters = this.gShapeParameters;
                lItem.shapeLengthFormula = this.gShapeLengthFormula;
                lItem.shapeParaValidator = this.gShapeParaValid;
                lItem.shapeTransportValidator = this.gShapeTransValid;
                lItem.shapeParaX = this.gShapeParaX;
                lItem.shapeParaY = this.gShapeParaY;
                lItem.shapeParType = this.gShapeParType;
                lItem.shapeDefaultValue = this.gShapeDefaultValue;
                lItem.shapeHeightCheck = this.gShapeHeightCheck;
                lItem.shapeAutoCalcFormula1 = this.gShapeAutoCalcFormula1;
                lItem.shapeAutoCalcFormula2 = this.gShapeAutoCalcFormula2;
                lItem.shapeAutoCalcFormula3 = this.gShapeAutoCalcFormula3;

                this.CheckParameters(this.gShapeParameters, pGridID);
                this.dataViewCAB.beginUpdate();
                this.dataViewCAB.updateItem(lItem.id, lItem);
                this.dataViewCAB.endUpdate();
              }
            }
            this.gShapeCode = this.bShapeCode[i];
            lFoundShape = 1;
            break;
          }
          //else {
          //    CheckParameters(gShapeParameters, pGridID);
          // this.showShapeImage = true
          //    $("#rightShapeImage-" + pGridID).show();
          //    $("#btmShapeImage-" + pGridID).show();
          //}
        }
      }

      if (lFoundShape == 0) {
        var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
        var lProjectCode = this.ProjectCode; //document.getElementById("ProjectCode").value;
        var lJobID = this.JobID; //document.getElementById("OrderNo").value;

        let response = await this.getShapeInfo(
          lCustomerCode,
          lProjectCode,
          lJobID,
          pShapeCode
        ); //FUNCTION CALL
        // error: function (response) {
        //
        // },
        // SUCCESS
        if (response == false) {
          alert('Get Shape information: Retrieve Database Error.');
        } else {
          this.CheckParameters(response.shapeParameters, pGridID);

          this.gShapeParameters = response.shapeParameters;
          this.gShapeLengthFormula = response.shapeLengthFormula;
          this.gShapeParaValid = response.shapeParaValidator;
          this.gShapeTransValid = response.shapeTransportValidator;

          this.gShapeImage = 'data:image/png;base64,' + response.shapeImage;
          // this.gShapeImage = this.convImg(response.shapeImage);

          this.gShapeParaX = response.shapeParaX;
          this.gShapeParaY = response.shapeParaY;
          this.gShapeParType = response.shapeParType;
          this.gShapeDefaultValue = response.shapeDefaultValue;
          this.gShapeHeightCheck = response.shapeHeightCheck;
          this.gShapeAutoCalcFormula1 = response.shapeAutoCalcFormula1;
          this.gShapeAutoCalcFormula2 = response.shapeAutoCalcFormula2;
          this.gShapeAutoCalcFormula3 = response.shapeAutoCalcFormula3;

          this.displayShapeImage(pGridID, pRowNo);
          //document.getElementById("rightShapeImage-" + pGridID).src = gShapeImage;
          //document.getElementById("btmShapeImage-" + pGridID).src = gShapeImage;

          // SHOW IMAGE HERE
          this.showShapeImage = true;
          $('#rightShapeImage-' + pGridID).show();
          $('#btmShapeImage-' + pGridID).show();

          if (pRowNo >= 0) {
            var lItem = this.dataViewCAB.getItem(pRowNo);
            if (this.gShapeCode != lItem.BarShapeCode) {
              lItem.shapeParameters = this.gShapeParameters;
              lItem.shapeLengthFormula = this.gShapeLengthFormula;
              lItem.shapeParaValidator = this.gShapeParaValid;
              lItem.shapeTransportValidator = this.gShapeTransValid;

              lItem.shapeParaX = this.gShapeParaX;
              lItem.shapeParaY = this.gShapeParaY;
              lItem.shapeParType = this.gShapeParType;
              lItem.shapeDefaultValue = this.gShapeDefaultValue;
              lItem.shapeHeightCheck = this.gShapeHeightCheck;
              lItem.shapeAutoCalcFormula1 = this.gShapeAutoCalcFormula1;
              lItem.shapeAutoCalcFormula2 = this.gShapeAutoCalcFormula2;
              lItem.shapeAutoCalcFormula3 = this.gShapeAutoCalcFormula3;

              this.dataViewCAB.beginUpdate();
              this.dataViewCAB.updateItem(lItem.id, lItem);
              this.dataViewCAB.endUpdate();
            }
          }
          this.gShapeCode = response.shapeCode;

          this.bShapeCode.push(this.gShapeCode);
          this.bShapeParameters.push(this.gShapeParameters);
          this.bShapeLengthFormula.push(this.gShapeLengthFormula);
          this.bShapeParaValid.push(this.gShapeParaValid);
          this.bShapeTransValid.push(this.gShapeTransValid);
          this.bShapeImage.push(this.gShapeImage);
          this.bShapeParaX.push(this.gShapeParaX);
          this.bShapeParaY.push(this.gShapeParaY);
          this.bShapeParType.push(this.gShapeParType);
          this.bShapeDefaultValue.push(this.gShapeDefaultValue);
          this.bShapeHeightCheck.push(this.gShapeHeightCheck);
          this.bShapeAutoCalcFormula1.push(this.gShapeAutoCalcFormula1);
          this.bShapeAutoCalcFormula2.push(this.gShapeAutoCalcFormula2);
          this.bShapeAutoCalcFormula3.push(this.gShapeAutoCalcFormula3);
        }
      } else {
        this.showShapeImage = false;
        $('#rightShapeImage-' + pGridID).hide();
        $('#btmShapeImage-' + pGridID).hide();
      }
    }
  }

  setCellClass(row: number, column: number, cssClass: string) {
    const cell = this.templateGrid.slickGrid.getCellNode(row, column);
    if (cell) {
      cell.classList.add(cssClass);
    }
  }

  CheckParameters(pParameters: any, pGridID: any) {
    if (pParameters != null && pParameters != '') {
      var lParaArray = pParameters.split(',');
      if (lParaArray.length > 0) {
        for (let i = 0; i < lParaArray.length; i++) {
          if (lParaArray[i].charCodeAt(0) > 'G'.charCodeAt(0)) {
            this.InsertColumn(lParaArray[i], pGridID);
          }
        }
      }
    }
  }

  InsertColumn(pPara: any, pGridID: any) {
    let Grid = this.templateGrid.slickGrid;
    let dataViewCAB;
    // alert('Column Insert start')
    console.log('Column Insert start');
    var lTab = pGridID;
    var columns = Grid.getColumns();
    // var columns = this.templateColumns;
    console.log('this.templateColumns', this.templateColumns);

    var lStartCol = 10;
    var lEndCol = columns.length - 4;
    var lWidth = columns[lStartCol].width;
    var lMinWidth = columns[lStartCol].minWidth;
    // let columnDefinition = { id: pPara, name: pPara, field: pPara, toolTip: "Bending Parameter " + pPara + " (参数 " + pPara + ")", minWidth: lMinWidth, width: lWidth, editor: { model: Editors.text }, validator: parameterValidator, cssClass: 'right-align grid-text-size' };
    let columnDefinition: Column = {
      id: pPara,
      name: pPara,
      field: pPara,
      toolTip: 'Bending Parameter ' + pPara + ' (参数 ' + pPara + ')',
      minWidth: lMinWidth,
      width: lWidth,
      rerenderOnResize: false,
      defaultSortAsc: true,
      cssClass: 'right-align grid-text-size',
    };

    var lPos = lEndCol;
    var lAcs = pPara.charCodeAt(0);
    if (lStartCol < lEndCol) {
      for (let i = lStartCol; i < lEndCol - 1; i++) {
        if (columns[i].id == pPara || columns[i + 1].id == pPara) {
          return;
        } else {
          if (
            columns[i].id.toString().charCodeAt(0) < lAcs &&
            columns[i + 1].id.toString().charCodeAt(0) > lAcs
          ) {
            lPos = i + 1;
            break;
          }
        }
      }
    }
    // columns.splice(lPos, 0, columnDefinition);
    const allColumns = this.templateGrid.gridService.getAllColumnDefinitions();
    allColumns.map((data) => {
      if (data.id == 'A') {
        columnDefinition.editor = data.editor;
        columnDefinition.internalColumnEditor = data.internalColumnEditor;
      }
    });
    allColumns.splice(lPos, 0, columnDefinition);
    this.templateGrid.gridService.resetGrid(allColumns);
    console.log('allColumns=>', allColumns);
    console.log('COLUMN', this.templateColumns);
  }

  isInvalidParameterCell(pShapeCode: any, pColumnName: any, pParameters: any) {
    var lReturn = false;
    if (pShapeCode != null && pShapeCode != '' && pParameters != null) {
      if (
        (pColumnName == 'A' && pParameters.indexOf('A') < 0) ||
        (pColumnName == 'B' && pParameters.indexOf('B') < 0) ||
        (pColumnName == 'C' && pParameters.indexOf('C') < 0) ||
        (pColumnName == 'D' && pParameters.indexOf('D') < 0) ||
        (pColumnName == 'E' && pParameters.indexOf('E') < 0) ||
        (pColumnName == 'F' && pParameters.indexOf('F') < 0) ||
        (pColumnName == 'G' && pParameters.indexOf('G') < 0) ||
        (pColumnName == 'H' && pParameters.indexOf('H') < 0) ||
        (pColumnName == 'I' && pParameters.indexOf('I') < 0) ||
        (pColumnName == 'J' && pParameters.indexOf('J') < 0) ||
        (pColumnName == 'K' && pParameters.indexOf('K') < 0) ||
        (pColumnName == 'L' && pParameters.indexOf('L') < 0) ||
        (pColumnName == 'M' && pParameters.indexOf('M') < 0) ||
        (pColumnName == 'N' && pParameters.indexOf('N') < 0) ||
        (pColumnName == 'O' && pParameters.indexOf('O') < 0) ||
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
        (pColumnName == 'Z' && pParameters.indexOf('Z') < 0)
      ) {
        lReturn = true;
      }
    }
    return lReturn;
  }

  async SaveBarDetails(pGridID: any, pRowID: any): Promise<any> {
    //I can currently POST a little more than 5000 rows, anything else and I get a 500 error due
    //do the size of my JSON string.

    if (this.NON_Editable) {
      return false;
    }

    let lReturn = true;
    let dataViewArray = this.dataViewCAB;

    if (pGridID != null && pRowID != null) {
      let lItem = this.dataViewCAB.getItem(pRowID);
      if (lItem == null) {
        return false;
      }
      if (lItem.JobID > 0 && lItem.BBSID > 0 && lItem.BarID > 0) {
        if (lItem.BarSTD == true) {
          if (lItem.BarEachQty != null) {
            if (lItem.BarEachQty.toString().indexOf('-') > 0) {
              lItem.BarEachQty = lItem.BarEachQty.toString().substring(
                lItem.BarEachQty.toString().indexOf('-') + 1
              );
            }
          }
          if (lItem.BarTotalQty != null) {
            if (lItem.BarTotalQty.toString().indexOf('-') > 0) {
              lItem.BarTotalQty = lItem.BarTotalQty.toString().substring(
                lItem.BarTotalQty.toString().indexOf('-') + 1
              );
            }
          }
        }
        lItem.newBarRecord = 0;

        // let response: any = this.saveBarDetails(lItem);
        let obj: any = {
          CustomerCode: lItem.CustomerCode
            ? lItem.CustomerCode.toString()
            : '',
          ProjectCode: lItem.ProjectCode ? lItem.ProjectCode.toString() : '',
          JobID: Number(lItem.JobID),
          BBSID: Number(lItem.BBSID),
          BarID: Number(lItem.BarID),
          BarSort: Number(lItem.BarSort),
          Cancelled: lItem.Cancelled ? true : false,
          BarCAB: lItem.BarCAB ? true : false,
          BarSTD: lItem.BarSTD ? true : false,
          ElementMark: lItem.ElementMark ? lItem.ElementMark.toString() : '',
          BarMark: lItem.BarMark ? lItem.BarMark.toString() : '',
          BarType: lItem.BarType ? lItem.BarType.toString() : '',
          BarSize: Number(lItem.BarSize),
          BarMemberQty: Number(lItem.BarMemberQty),
          BarEachQty: Number(lItem.BarEachQty),
          BarTotalQty: Number(lItem.BarTotalQty),
          BarShapeCode: lItem.BarShapeCode
            ? lItem.BarShapeCode.toString()
            : '',
          A: lItem.A ? lItem.A.toString() : '',
          B: lItem.B ? lItem.B.toString() : '',
          C: lItem.C ? lItem.C.toString() : '',
          D: lItem.D ? lItem.D.toString() : '',
          E: lItem.E ? lItem.E.toString() : '',
          F: lItem.F ? lItem.F.toString() : '',
          G: lItem.G ? lItem.G.toString() : '',
          H: lItem.H ? lItem.H.toString() : '',
          I: lItem.I ? lItem.I.toString() : '',
          J: lItem.J ? lItem.J.toString() : '',
          K: lItem.K ? lItem.K.toString() : '',
          L: lItem.L ? lItem.L.toString() : '',
          M: lItem.M ? lItem.M.toString() : '',
          N: lItem.N ? lItem.N.toString() : '',
          O: lItem.O ? lItem.O.toString() : '',
          P: lItem.P ? lItem.P.toString() : '',
          Q: lItem.Q ? lItem.Q.toString() : '',
          R: lItem.R ? lItem.R.toString() : '',
          S: lItem.S ? lItem.S.toString() : '',
          T: lItem.T ? lItem.T.toString() : '',
          U: lItem.U ? lItem.U.toString() : '',
          V: lItem.V ? lItem.V.toString() : '',
          W: lItem.W ? lItem.W.toString() : '',
          X: lItem.X ? lItem.X.toString() : '',
          Y: lItem.Y ? lItem.Y.toString() : '',
          Z: lItem.Z ? lItem.Z.toString() : '',
          BarLength: lItem.BarLength ? lItem.BarLength.toString() : '',
          BarWeight: Number(lItem.BarWeight),
          Remarks: lItem.Remarks ? lItem.Remarks.toString() : '',
          shapeParameters: lItem.shapeParameters
            ? lItem.shapeParameters.toString()
            : '',
          shapeLengthFormula: lItem.shapeLengthFormula
            ? lItem.shapeLengthFormula.toString()
            : '',
          shapeParaValidator: lItem.shapeParaValidator
            ? lItem.shapeParaValidator.toString()
            : '',
          shapeTransportValidator: lItem.shapeTransportValidator
            ? lItem.shapeTransportValidator.toString()
            : '',
          shapeParType: lItem.shapeParType
            ? lItem.shapeParType.toString()
            : '',
          shapeDefaultValue: lItem.shapeDefaultValue
            ? lItem.shapeDefaultValue.toString()
            : '',
          shapeHeightCheck: lItem.shapeHeightCheck
            ? lItem.shapeHeightCheck.toString()
            : '',
          shapeAutoCalcFormula1: lItem.shapeAutoCalcFormula1
            ? lItem.shapeAutoCalcFormula1.toString()
            : '',
          shapeAutoCalcFormula2: lItem.shapeAutoCalcFormula2
            ? lItem.shapeAutoCalcFormula2.toString()
            : '',
          shapeAutoCalcFormula3: lItem.shapeAutoCalcFormula3
            ? lItem.shapeAutoCalcFormula3.toString()
            : '',
          shapeTransport: Number(lItem.shapeTransport),
          PinSize: lItem.PinSize ? Number(lItem.PinSize) : 0,
          TeklaGUID: lItem.TeklaGUID ? lItem.TeklaGUID.toString() : '',
          PartGUID: lItem.PartGUID ? lItem.PartGUID.toString() : '',
          UpdateDate: new Date().toLocaleString().split(',')[0],
          CreateBy:'',
          UpdateBy:''
        };

        let response: any = await this.saveBarDetails_POST(obj);
        this.ReloadSubMenu();
        let gridArray = this.templateGrid.slickGrid;

        if (response == false) {
          alert('Connection error, please check your internet connection.');
        } else {
          if (response.success == true) {
            console.log('SAVE Bar Success')
            if (response.respDoubleCapture != null) {
              gridArray.removeCellCssStyles('double_highlight');
              let lClass: any = {};
              //var lClass = this.templateGrid.slickGrid.getCellCssStyles("double_highlight");
              //if (lClass == null) {
              //    lClass = {};
              //}
              var lCellClass = '';
              lClass[pRowID] = {};
              if (response.respDoubleCapture.BarType == '0') {
                lClass[pRowID]['BarType'] = 'highlighted';
              } else {
                lClass[pRowID]['BarType'] = '';
              }
              if (response.respDoubleCapture.BarSize == 0) {
                lClass[pRowID]['BarSize'] = 'highlighted';
              } else {
                lClass[pRowID]['BarSize'] = '';
              }
              if (response.respDoubleCapture.BarMemberQty == 0) {
                lClass[pRowID]['BarMemberQty'] = 'highlighted';
              } else {
                lClass[pRowID]['BarMemberQty'] = '';
              }
              if (response.respDoubleCapture.BarEachQty == 0) {
                lClass[pRowID]['BarEachQty'] = 'highlighted';
              } else {
                lClass[pRowID]['BarEachQty'] = '';
              }
              if (response.respDoubleCapture.BarShapeCode == '0') {
                lClass[pRowID]['BarShapeCode'] = 'highlighted';
              } else {
                lClass[pRowID]['BarShapeCode'] = '';
              }
              if (response.respDoubleCapture.A == '0') {
                lClass[pRowID]['A'] = 'highlighted';
              } else {
                lClass[pRowID]['A'] = '';
              }
              if (response.respDoubleCapture.B == '0') {
                lClass[pRowID]['B'] = 'highlighted';
              } else {
                lClass[pRowID]['B'] = '';
              }
              if (response.respDoubleCapture.C == '0') {
                lClass[pRowID]['C'] = 'highlighted';
              } else {
                lClass[pRowID]['C'] = '';
              }
              if (response.respDoubleCapture.D == '0') {
                lClass[pRowID]['D'] = 'highlighted';
              } else {
                lClass[pRowID]['D'] = '';
              }
              if (response.respDoubleCapture.E == '0') {
                lClass[pRowID]['E'] = 'highlighted';
              } else {
                lClass[pRowID]['E'] = '';
              }
              if (response.respDoubleCapture.F == '0') {
                lClass[pRowID]['F'] = 'highlighted';
              } else {
                lClass[pRowID]['F'] = '';
              }
              if (response.respDoubleCapture.G == '0') {
                lClass[pRowID]['G'] = 'highlighted';
              } else {
                lClass[pRowID]['G'] = '';
              }
              if (response.respDoubleCapture.H == '0') {
                lClass[pRowID]['H'] = 'highlighted';
              } else {
                lClass[pRowID]['H'] = '';
              }
              if (response.respDoubleCapture.I == '0') {
                lClass[pRowID]['I'] = 'highlighted';
              } else {
                lClass[pRowID]['I'] = '';
              }
              if (response.respDoubleCapture.J == '0') {
                lClass[pRowID]['J'] = 'highlighted';
              } else {
                lClass[pRowID]['J'] = '';
              }
              if (response.respDoubleCapture.K == '0') {
                lClass[pRowID]['K'] = 'highlighted';
              } else {
                lClass[pRowID]['K'] = '';
              }
              if (response.respDoubleCapture.L == '0') {
                lClass[pRowID]['L'] = 'highlighted';
              } else {
                lClass[pRowID]['L'] = '';
              }
              if (response.respDoubleCapture.M == '0') {
                lClass[pRowID]['M'] = 'highlighted';
              } else {
                lClass[pRowID]['M'] = '';
              }
              if (response.respDoubleCapture.N == '0') {
                lClass[pRowID]['N'] = 'highlighted';
              } else {
                lClass[pRowID]['N'] = '';
              }
              if (response.respDoubleCapture.O == '0') {
                lClass[pRowID]['O'] = 'highlighted';
              } else {
                lClass[pRowID]['O'] = '';
              }
              if (response.respDoubleCapture.P == '0') {
                lClass[pRowID]['P'] = 'highlighted';
              } else {
                lClass[pRowID]['P'] = '';
              }
              if (response.respDoubleCapture.Q == '0') {
                lClass[pRowID]['Q'] = 'highlighted';
              } else {
                lClass[pRowID]['Q'] = '';
              }
              if (response.respDoubleCapture.R == '0') {
                lClass[pRowID]['R'] = 'highlighted';
              } else {
                lClass[pRowID]['R'] = '';
              }
              if (response.respDoubleCapture.S == '0') {
                lClass[pRowID]['S'] = 'highlighted';
              } else {
                lClass[pRowID]['S'] = '';
              }
              if (response.respDoubleCapture.T == '0') {
                lClass[pRowID]['T'] = 'highlighted';
              } else {
                lClass[pRowID]['T'] = '';
              }
              if (response.respDoubleCapture.U == '0') {
                lClass[pRowID]['U'] = 'highlighted';
              } else {
                lClass[pRowID]['U'] = '';
              }
              if (response.respDoubleCapture.V == '0') {
                lClass[pRowID]['V'] = 'highlighted';
              } else {
                lClass[pRowID]['V'] = '';
              }
              if (response.respDoubleCapture.W == '0') {
                lClass[pRowID]['W'] = 'highlighted';
              } else {
                lClass[pRowID]['W'] = '';
              }
              if (response.respDoubleCapture.X == '0') {
                lClass[pRowID]['X'] = 'highlighted';
              } else {
                lClass[pRowID]['X'] = '';
              }
              if (response.respDoubleCapture.Y == '0') {
                lClass[pRowID]['Y'] = 'highlighted';
              } else {
                lClass[pRowID]['Y'] = '';
              }
              if (response.respDoubleCapture.Z == '0') {
                lClass[pRowID]['Z'] = 'highlighted';
              } else {
                lClass[pRowID]['Z'] = '';
              }
              console.log('lClass -> ', lClass)
              gridArray.setCellCssStyles('double_highlight', lClass);
            }
            this.barChangeInd[pGridID] = 0;
            //lItem.newBarRecord = 0;
          } else {
            if (response.ErrorMessage != null) {
              var lMsg =
                'Failed to save your updated BBS data. Error Message: ' +
                response.ErrorMessage;
              var lStyle = '<div>';
              lStyle = lStyle + '<div>';
              lStyle = lStyle + lMsg;
              lStyle = lStyle + '</div>';
              lStyle = lStyle + '</div>';

              let lWidth = 600;

              // let lWidth = /* Your initial value for lWidth */;
              const windowWidth =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;

              if (lWidth > windowWidth - 100) {
                lWidth = windowWidth - 100;
              }
              // if (lWidth > ($(window).width() - 100)) {
              //   lWidth = $(window).width() - 100;
              // }
              if (lWidth < 100) {
                lWidth = 100;
              }

              // var $dialog = $(lStyle).dialog({
              //   title: 'Data Auto-Save (数据自动保存)',
              //   modal: true,   //dims screen to bring dialog to the front
              //   resizable: false,
              //   open: function (event: any, ui: any) {
              //     $(".ui-dialog-titlebar-close").hide();
              //     //$(".ui-dialog-titlebar").hide();
              //   },
              //   width: lWidth,
              //   buttons: {
              //     'Close (关闭)': function () {
              //       $(this).dialog("close");
              //       $dialog.remove();
              //     }
              //   }
              // });
              //alert("Failed to save your updated BBS data. Error Message: " + response.ErrorMessage);
            }
            lReturn = false;
          }

          // stopLoading();
        }
        return lReturn;
      }

    }
  }
  async saveBarDetails_POST(item: any): Promise<any> {
    try {
      const data = await this.orderService.SaveBarDetails(item).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  ReloadSubMenu() {
    this.GetTableData(
      this.CustomerCode,
      this.ProjectCode,
      this.JobID,
      this.BBSId
    );

    // setTimeout(() => {
    //   // Code to be executed after the delay
    //   this.UpdateBBS()
    //   console.log('Timeout executed after 2000 milliseconds');
    // }, 2000);
  }

  async GetTableData(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number
  ) {

    let response = await this.GetBarDetails(CustomerCode, ProjectCode, JobID, BBSID);
    if (response === false) {
      alert('Cannot reload bar detail infomation. Please try again later');
    } else {
      console.log('BBSORDERDETAILS', response);
      this.bbsOrderTable = response;
      // OLD CODE START
      let data: any[] = [];

      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          this.CheckParameters(response[i].shapeParameters, 2);
          data[i] = {
            CustomerCode: response[i].CustomerCode,
            ProjectCode: response[i].ProjectCode,
            JobID: response[i].JobID,
            BBSID: response[i].BBSID,
            BarID: response[i].BarID,
            id: i + 1,
            BarSort: response[i].BarSort,
            Cancelled: response[i].Cancelled,
            ElementMark: response[i].ElementMark,
            BarMark: response[i].BarMark,
            BarType: response[i].BarType == null ? '' : response[i].BarType,
            BarSize: response[i].BarSize == null ? '' : response[i].BarSize,
            BarSTD: response[i].BarSTD,
            BarMemberQty: response[i].BarMemberQty,
            BarEachQty: response[i].BarEachQty,
            BarTotalQty: response[i].BarTotalQty,
            BarShapeCode: response[i].BarShapeCode,
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
            BarLength: response[i].BarLength,
            BarWeight: response[i].BarWeight,
            PinSize: response[i].PinSize,
            Remarks: response[i].Remarks,
            shapeParameters: response[i].shapeParameters,
            shapeLengthFormula: response[i].shapeLengthFormula,
            shapeParaValidator: response[i].shapeParaValidator,
            shapeTransportValidator: response[i].shapeTransportValidator,
            shapeTransport: response[i].shapeTransport,
            shapeParType: response[i].shapeParType,
            shapeDefaultValue: response[i].shapeDefaultValue,
            shapeHeightCheck: response[i].shapeHeightCheck,
            shapeAutoCalcFormula1: response[i].shapeAutoCalcFormula1,
            shapeAutoCalcFormula2: response[i].shapeAutoCalcFormula2,
            shapeAutoCalcFormula3: response[i].shapeAutoCalcFormula3,
            shapeCopied: false,
            newBarRecord: 0,
          };
          if (response[i].BarSTD == true) {
            var lPcsFr = 0;
            var lPCs = 0;
            for (var j = 0; j < this.gSBBarType.length; j++) {
              if (
                response[i].BarType == this.gSBBarType[j] &&
                response[i].BarSize == this.gSBBarSize[j] &&
                response[i].BarLength == this.gSBLength[j]
              ) {
                lPcsFr = this.gSBPcsFr[j];
                lPCs = this.gSBPcs[j];
                break;
              }
            }
            if (lPcsFr > 0) {
              if (lPcsFr != lPCs) {
                data[i].BarEachQty = lPcsFr + '-' + lPCs;
                data[i].BarTotalQty =
                  lPcsFr * response[i].BarMemberQty +
                  '-' +
                  lPCs * response[i].BarMemberQty;
              }
            }
          }
        }
        // dataViewArray[pBBSRowNo + 2].beginUpdate();
        // dataViewArray[pBBSRowNo + 2].setItems(data);
        // dataViewArray[pBBSRowNo + 2].endUpdate();
        // gridArray[pBBSRowNo + 2].render();

        this.dataViewCAB.beginUpdate();
        this.dataViewCAB.setItems(data);
        this.dataViewCAB.endUpdate();
        this.templateGrid.slickGrid.invalidateAllRows();
        this.templateGrid.slickGrid.render();
      } else {
        // dataViewArray[pBBSRowNo + 2].beginUpdate();
        // dataViewArray[pBBSRowNo + 2].setItems(data);
        // dataViewArray[pBBSRowNo + 2].endUpdate();
        // gridArray[pBBSRowNo + 2].render();

        var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
        var lProjectCode = this.ProjectCode; //document.getElementById("ProjectCode").value;
        var lJobID = this.JobID;
        data[0] = {
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          JobID: this.JobID,
          BBSID: this.BBSId,
          BarID: 1,
          id: 1,
          BarSort: 1000,
          newBarRecord: 1,
        };

        this.dataViewCAB.beginUpdate();
        this.dataViewCAB.setItems(data);
        this.dataViewCAB.endUpdate();
        this.templateGrid.slickGrid.invalidateAllRows();

        this.templateGrid.slickGrid.render();
      }

      this.dataViewCAB.getItemMetadata = this.metadata(this.dataViewCAB.getItemMetadata);

      //END

      let temp: any[] = [];
      response.forEach((element: { [x: string]: any }) => {
        let templist = [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'W',
          'X',
          'Y',
          'Z',
        ];
        let temp2: any[] = [];
        templist.forEach((x) => {
          let obj = {
            text: x,
            value: element[x],
          };
          temp2.push(obj);
        });
        temp.push(temp2);
      });
      console.log('WORK', this.bbsOrderTable);

     // this.getTotalWeightandQty();

      this.CheckBBSDetails();
    }
  }

  CheckBBSDetails() {
    var lFound = 0;
    var tabCount = $("div#tabs ul li").length;

    console.log("CheckBBSDetails -> START");


    // this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit();
    // SaveBarDetails(i, barRowIndex[i]);
    this.templateGrid.slickGrid.removeCellCssStyles("error_highlight");
    let lClass: any = {};
    var lCellClass = "";
    for (let j = 0; j < this.dataViewCAB.getLength(); j++) {
      lClass[j] = {};
      if (this.dataViewCAB.getItem(j).Cancelled != true) {
        var lShape = this.dataViewCAB.getItem(j).BarShapeCode;
        var lType = this.dataViewCAB.getItem(j).BarType;
        var lDia = this.dataViewCAB.getItem(j).BarSize;
        var lQty = this.dataViewCAB.getItem(j).BarTotalQty;

        if (lQty != null && lQty > 0 && (lShape == null || lShape.trim() == "")) {
          lClass[j]['BarShapeCode'] = "highlighted";
        }

        if (lShape != null && lShape.trim() != "" && (lType == null || lType == "" || lType == " " || (lType.trim() != "H" && lType.trim() != "X" && this.gCustomerBar.indexOf(lType.trim()) < 0))) {
          lClass[j]['BarType'] = "highlighted";
        }
        if (lShape != null && lShape.trim() != "" && (lDia == null || lDia == "" || lDia == " ")) {
          lClass[j]['BarSize'] = "highlighted";
        }

        if (lShape != null && lShape.trim() == "R7A" && lDia != null && lDia >= 16) {
          lClass[j]['BarSize'] = "highlighted";
          lClass[j]['BarShapeCode'] = "highlighted";
        }

        //if (lType == "E" || lType == "N") {
        //    lType = "T";
        //}
        if (lType == "C") {
          lType = "H";
        }
        if (lShape != null && lShape.trim() != "") {
          lFound = 0;
          for (let k = 0; k < this.gSBBarType.length; k++) {
            if (lType == this.gSBBarType[k]) {
              if (lDia == this.gSBBarSize[k]) {
                lFound = 1;
                break;
              }
            }
          }
          if (lFound == 0) {
            lClass[j]['BarSize'] = "highlighted";
          }
        }
        if (lShape != null && lShape.trim() != "" && (this.dataViewCAB.getItem(j).BarMemberQty == null || this.dataViewCAB.getItem(j).BarMemberQty == "" || this.dataViewCAB.getItem(j).BarMemberQty == "0" || this.dataViewCAB.getItem(j).BarMemberQty == " ")) {
          lClass[j]['BarMemberQty'] = "highlighted";
        }
        if (lShape != null && lShape.trim() != "" && (this.dataViewCAB.getItem(j).BarEachQty == null || this.dataViewCAB.getItem(j).BarEachQty == "" || this.dataViewCAB.getItem(j).BarEachQty == "0" || this.dataViewCAB.getItem(j).BarEachQty == " ")) {
          lClass[j]['BarEachQty'] = "highlighted";
        }
        var lLength = this.dataViewCAB.getItem(j).BarLength;
        var lMaxLength = this.getVarMaxValue(lLength);

        var lLenLimit = this.gMaxBarLength;
        if (lDia <= 8) {
          lLenLimit = 6000;
        }
        else if (lDia <= 16) {
          lLenLimit = 12000;
        }
        if (lMaxLength > lLenLimit) {
          let lTotalDed: any = this.getCreepDedution(lMaxLength, this.dataViewCAB.getItem(j));
          if (lMaxLength - lTotalDed > lLenLimit) {
            lClass[j]['BarLength'] = "highlighted";
          }
        }

        var lMinLength = this.getVarMinValue(lLength);
        if (lDia >= 40 && lShape != "20" && lShape != "020" && lMinLength < 800) {
          let lTotalDed: any = this.getCreepDedution(lMinLength, this.dataViewCAB.getItem(j));
          if (lMinLength - lTotalDed < 500) {
            lClass[j]['BarLength'] = "highlighted";
          }
        }

        if (lShape != null && lShape.length >= 3 && this.getVarMinValue(this.dataViewCAB.getItem(j).BarLength) < 800) {
          var lFirst = lShape.substring(0, 1);
          var lLast = lShape.substring(2, 3);
          if (((lFirst == "H" || lFirst == "I" || lFirst == "J" || lFirst == "K")
            && (lLast == "H" || lLast == "I" || lLast == "J" || lLast == "K"))
            || ((lFirst == "C" || lFirst == "S" || lFirst == "P" || lFirst == "N")
              && (lLast == "C" || lLast == "S" || lLast == "P" || lLast == "N"))) {
            lClass[j]['BarLength'] = "highlighted";
          }
        }

        if (lShape != null && lShape.length >= 3 && this.getVarMinValue(this.dataViewCAB.getItem(j).BarLength) < 600) {
          var lFirst = lShape.substring(0, 1);
          if (lFirst == "H" || lFirst == "I" || lFirst == "J" || lFirst == "K" ||
            lFirst == "C" || lFirst == "S" || lFirst == "P" || lFirst == "N") {
            lClass[j]['BarLength'] = "highlighted";
          }
        }

        if (lShape != null && lShape.length >= 3 && lDia < 16) {
          var lFirst = lShape.substring(0, 1);
          if (lFirst == "H" || lFirst == "I" || lFirst == "J" || lFirst == "K" ||
            lFirst == "C" || lFirst == "S" || lFirst == "P" || lFirst == "N") {
            lClass[j]['BarSize'] = "highlighted";
          }
        }

        if (lType == "X" && lShape != null && lShape.length >= 3 && lDia < 40) {
          var lFirst = lShape.substring(0, 1);
          if (lFirst == "C" || lFirst == "S" || lFirst == "P" || lFirst == "N") {
            lClass[j]['BarSize'] = "highlighted";
          }
        }

        var lSB = this.dataViewCAB.getItem(j).BarSTD;
        var lWT = this.dataViewCAB.getItem(j).BarWeight;

        if (lSB == true && lLength != null && lType != null && lType.trim() != "R" && (parseInt(lLength) == 12000) && ((lWT % 2000) > 0 || lWT < 2000)) {
          lClass[j]['BarWeight'] = "highlighted";
        }

        if (lSB == true && lLength != null && lType != null && lType.trim() != "R" && (parseInt(lLength) == 14000) && (lWT < 2000)) {
          lClass[j]['BarWeight'] = "highlighted";
        }

        if (lSB == true && lLength != null && lType != null && (parseInt(lLength) == 6000 || lType.trim() == "R") && ((lWT % 1000) > 0 || lWT < 1000)) {
          lClass[j]['BarWeight'] = "highlighted";
        }

        var lParameters = this.dataViewCAB.getItem(j).shapeParameters;
        var lParaTypes = this.dataViewCAB.getItem(j).shapeParType;
        if (lShape != null && lShape.trim() != "" && lParameters != null && lParameters != "" && lParaTypes != null && lParaTypes != "") {
          var lParaA = lParameters.split(",");
          var lParaTypeA = lParaTypes.split(",");
          for (let k = 0; k < lParaA.length; k++) {
            if (this.dataViewCAB.getItem(j)[lParaA[k]] == null) {
              lClass[j][lParaA[k]] = "highlighted";
            }
            if (this.dataViewCAB.getItem(j)[lParaA[k]] != null && isNaN(this.dataViewCAB.getItem(j)[lParaA[k]]) == true) {
              var lArrayP = (this.dataViewCAB.getItem(j)[lParaA[k]]).split("-")
              if (lArrayP.length != 2) {
                lClass[j][lParaA[k]] = "highlighted";
              }
              if (isNaN(lArrayP[0]) || isNaN(lArrayP[1])) {
                lClass[j][lParaA[k]] = "highlighted";
              }
              if (parseInt(lArrayP[0]) == parseInt(lArrayP[1])) {
                lClass[j][lParaA[k]] = "highlighted";
              }
              if (lArrayP.length == 2) {
                var lMax = this.getVarMaxValue(this.dataViewCAB.getItem(j)[lParaA[k]]);
                var lMin = this.getVarMinValue(this.dataViewCAB.getItem(j)[lParaA[k]]);
                if (lMax <= 0 || lMin <= 0 || lMin == lMax) {
                  lClass[j][lParaA[k]] = "highlighted";
                }
                var lMbrQty = this.dataViewCAB.getItem(j)['BarMemberQty'];
                if (lMbrQty <= 1) {
                  lClass[j]['BarMemberQty'] = "highlighted";
                }
                var lEachQty = this.dataViewCAB.getItem(j)['BarEachQty'];
                if (lEachQty != null && lEachQty > 0 && lMbrQty < lEachQty) {
                  lClass[j]['BarMemberQty'] = "highlightedYellow";
                }

                //Check Various Bar
                if (this.gVarianceBarSplit == "Y" && lEachQty * lMbrQty >= 5 && this.getNoVariousBar(this.dataViewCAB.getItems(), j) > 26) {
                  lClass[j][lParaA[k]] = "highlighted";
                }
              }
            }
            if (this.dataViewCAB.getItem(j)[lParaA[k]] <= 0) {
              lClass[j][lParaA[k]] = "highlighted";
            }

            var msgRef = { msg: "" };
            if (this.isValidValue(lParaA[k], lParameters, lDia, this.dataViewCAB.getItem(j)[lParaA[k]], this.dataViewCAB.getItem(j), msgRef, 0) == false) {
              lClass[j][lParaA[k]] = "highlighted";
            }

            //Check imported value no tallings
            var lItemBK = JSON.parse(JSON.stringify(this.dataViewCAB.getItem(j)));

            var lItemBK: any = {};
            $.extend(true, lItemBK, this.dataViewCAB.getItem(j));

            this.testDependValue(lParaA[k], lParameters, lDia, this.dataViewCAB.getItem(j)[lParaA[k]], lItemBK);

            for (let m = 0; m < lParaA.length; m++) {
              if (lParaTypeA[m] != null) {
                var lMaxOld = this.getVarMaxValue(this.dataViewCAB.getItem(j)[lParaA[m]]);
                var lMinOld = this.getVarMinValue(this.dataViewCAB.getItem(j)[lParaA[m]]);

                var lMaxNew = this.getVarMaxValue(lItemBK[lParaA[m]]);
                var lMinNew = this.getVarMinValue(lItemBK[lParaA[m]]);

                if (lParaTypeA[m] != "V") {
                  var lMaxDiff = 10;
                  if (Math.abs(lMaxOld - lMaxNew) > lMaxDiff || Math.abs(lMinOld - lMinNew) > lMaxDiff) {
                    lClass[j][lParaA[m]] = "highlighted";
                  }
                } else {
                  var lMaxDiff = 5;
                  if (Math.abs(lMaxOld - lMaxNew) > lMaxDiff || Math.abs(lMinOld - lMinNew) > lMaxDiff) {
                    lClass[j][lParaA[m]] = "highlighted";
                  }
                }
              }
            }

          }
        }
      }
    }
    this.templateGrid.slickGrid.setCellCssStyles("error_highlight", lClass);


  }

  testDependValue(pColumnName: any, pParameters: any, pDia: any, pValue: any, pItem: any) {
    var lReturn = true;
    var lErrorMsg = "";
    if (pColumnName != null && pColumnName != "" &&
      pParameters != null && pParameters != "" &&
      pDia != null && pDia != "" && pDia != "0" && pDia != 0 &&
      pValue != null && pValue != "" && pValue != "0" && pValue != 0) {
      var lPinSize = pItem["PinSize"];

      var lParas = "";
      var lFormula1AR = "";
      var lFormula2AR = "";
      var lFormula3AR = "";
      var lParamTypeAR = "";
      var lDefaultValueAR = "";

      if (pParameters != null) {
        lParas = pParameters.split(",");
      }
      if (pItem.shapeAutoCalcFormula1 != null) {
        let lFormula1AR = pItem.shapeAutoCalcFormula1.split(",");
      }
      if (pItem.shapeAutoCalcFormula2 != null) {
        lFormula2AR = pItem.shapeAutoCalcFormula2.split(",");
      }
      if (pItem.shapeAutoCalcFormula3 != null) {
        lFormula3AR = pItem.shapeAutoCalcFormula3.split(",");
      }
      if (pItem.shapeParType != null) {
        lParamTypeAR = pItem.shapeParType.split(",");
      }
      if (pItem.shapeDefaultValue != null) {
        lDefaultValueAR = pItem.shapeDefaultValue.split(",");
      }

      var lFormula1 = "";
      var lFormula2 = "";
      var lFormula3 = "";

      for (var i = 0; i < lFormula1AR.length; i++) {
        var lFvar = lFormula1AR[i];
        if (lFvar != null && lFvar.trim() != "" && lFvar.indexOf("@@") >= 0) {
          return lReturn;
        }
      }

      if (lFormula1AR.length == lParas.length) {
        for (var i = 0; i < lFormula1AR.length; i++) {
          lFormula1 = lFormula1AR[i];

          var lParam = lParas[i];
          var lParamType = lParamTypeAR[i];
          var lDefaultValue = lDefaultValueAR[i];
          if (lFormula1.indexOf(pColumnName) >= 0) {
            var lResult = this.calFormula(pItem, pColumnName, pValue, lPinSize, pDia, lParamType, lDefaultValue, lFormula1);
            if (lResult != "") {
              if (lParamType != "H") {
                pItem[lParam] = lResult;
              }

              for (var j = 0; j < lFormula1AR.length; j++) {
                lFormula1 = lFormula1AR[j];
                var lParam1 = lParas[j];
                var lParamType = lParamTypeAR[j];
                var lDefaultValue = lDefaultValueAR[j];
                if (lFormula1.indexOf(lParam) >= 0 && lParam1 != pColumnName) {
                  var lResult = this.calFormula(pItem, lParam, lResult, lPinSize, pDia, lParamType, lDefaultValue, lFormula1);
                  if (lResult != "") {
                    if (lParamType != "H") {
                      pItem[lParam1] = lResult;
                    }


                    for (var k = 0; k < lFormula1AR.length; k++) {
                      lFormula1 = lFormula1AR[k];
                      var lParam2 = lParas[k];
                      var lParamType = lParamTypeAR[k];
                      var lDefaultValue = lDefaultValueAR[k];
                      if (lFormula1.indexOf(lParam1) >= 0 && lParam2 != pColumnName) {
                        var lResult = this.calFormula(pItem, lParam1, lResult, lPinSize, pDia, lParamType, lDefaultValue, lFormula1);
                        if (lResult != "") {
                          if (lParamType != "H") {
                            pItem[lParam2] = lResult;
                          }
                        }
                      }
                    }

                  }
                }
              }

            }
          }
        }
      }

      if (lFormula2AR.length == lParas.length) {
        for (var i = 0; i < lFormula2AR.length; i++) {
          lFormula2 = lFormula2AR[i];
          lParam = lParas[i];
          var lParamType = lParamTypeAR[i];
          var lDefaultValue = lDefaultValueAR[i];
          if (lFormula2.indexOf(pColumnName) >= 0) {
            var lResult = this.calFormula(pItem, pColumnName, pValue, lPinSize, pDia, lParamType, lDefaultValue, lFormula2);
            if (lResult != "") {
              if (lParamType != "H") {
                pItem[lParam] = lResult;
              }

              for (var j = 0; j < lFormula2AR.length; j++) {
                lFormula2 = lFormula2AR[j];
                var lParam1 = lParas[j];
                var lParamType = lParamTypeAR[j];
                var lDefaultValue = lDefaultValueAR[j];
                if (lFormula1.indexOf(lParam) >= 0 && lParam1 != pColumnName) {
                  var lResult = this.calFormula(pItem, lParam, lResult, lPinSize, pDia, lParamType, lDefaultValue, lFormula2);
                  if (lResult != "") {
                    if (lParamType != "H") {
                      pItem[lParam1] = lResult;
                    }

                    for (var k = 0; k < lFormula2AR.length; k++) {
                      lFormula2 = lFormula2AR[k];
                      var lParam2 = lParas[k];
                      var lParamType = lParamTypeAR[k];
                      var lDefaultValue = lDefaultValueAR[k];
                      if (lFormula1.indexOf(lParam1) >= 0 && lParam2 != pColumnName) {
                        var lResult = this.calFormula(pItem, lParam1, lResult, lPinSize, pDia, lParamType, lDefaultValue, lFormula2);
                        if (lResult != "") {
                          if (lParamType != "H") {
                            pItem[lParam2] = lResult;
                          }
                        }
                      }
                    }

                  }
                }
              }

            }
          }
        }
      }

      if (lFormula3AR.length == lParas.length) {
        for (var i = 0; i < lFormula3AR.length; i++) {
          lFormula3 = lFormula3AR[i];
          lParam = lParas[i];
          var lParamType = lParamTypeAR[i];
          var lDefaultValue = lDefaultValueAR[i];
          if (lFormula3.indexOf(pColumnName) >= 0) {
            var lResult = this.calFormula(pItem, pColumnName, pValue, lPinSize, pDia, lParamType, lDefaultValue, lFormula3);
            if (lResult != "") {
              if (lParamType != "H") {
                pItem[lParam] = lResult;
              }

              for (var j = 0; j < lFormula3AR.length; j++) {
                lFormula3 = lFormula3AR[j];
                var lParam1 = lParas[j];
                var lParamType = lParamTypeAR[j];
                var lDefaultValue = lDefaultValueAR[j];
                if (lFormula1.indexOf(lParam) >= 0 && lParam1 != pColumnName) {
                  var lResult = this.calFormula(pItem, lParam, lResult, lPinSize, pDia, lParamType, lDefaultValue, lFormula3);
                  if (lResult != "") {
                    if (lParamType != "H") {
                      pItem[lParam1] = lResult;
                    }

                    for (var k = 0; k < lFormula3AR.length; k++) {
                      lFormula3 = lFormula3AR[k];
                      var lParam2 = lParas[k];
                      var lParamType = lParamTypeAR[k];
                      var lDefaultValue = lDefaultValueAR[k];
                      if (lFormula1.indexOf(lParam1) >= 0 && lParam2 != pColumnName) {
                        var lResult = this.calFormula(pItem, lParam1, lResult, lPinSize, pDia, lParamType, lDefaultValue, lFormula3);
                        if (lResult != "") {
                          if (lParamType != "H") {
                            pItem[lParam2] = lResult;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return lReturn;
  }

    async GetBarDetails(CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number): Promise<any> {
    try {
      const data = await this.orderService
        .GetBarDetails(CustomerCode, ProjectCode, JobID, BBSID)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
