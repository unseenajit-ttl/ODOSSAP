import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  Renderer2
} from '@angular/core';
import { Location } from '@angular/common';
import { OrderService } from '../../orders.service';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  AngularGridInstance,
  AutocompleterOption,
  Column,
  Editors,
  FieldType,
  Formatters,
  GridOption,
  OnBeforeAppendCellEventArgs,
  OnEventArgs,
  SlickEventHandler,
} from 'angular-slickgrid';
import { BBSOrdertableModel } from 'src/app/Model/BBSOrdertableModel';
import { AnyPixelFormat } from 'three';
import { bbsOrderShapeImageModel } from 'src/app/Model/bbsOrderShapeImageModel';
import { JobAdviceModels } from 'src/app/Model/jobadvicemodels';
import * as math from 'mathjs';
import { SaveBarDetailsModel } from 'src/app/Model/saveBarDetailsModel';
import { CreateordersharedserviceService } from '../createorderSharedservice/createordersharedservice.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { SaveBBSOrderDetails } from 'src/app/Model/SaveBBSOrderDetails';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BindingLimitComponent } from './binding-limit/binding-limit.component';
import { CopyOrderDetailsComponent } from './copy-order-details/copy-order-details.component';
import { ImportOrderDetailsComponent } from './import-order-details/import-order-details.component';
import { BarDetailsInfoComponent } from './bar-details-info/bar-details-info.component';
import { BarDetailsComponent } from './bar-details/bar-details.component';
import { SaveJobAdvice_CAB } from 'src/app/Model/SaveJobAdvice_CAB';
import { buffer } from 'rxjs';
import FileSaver from 'file-saver';
import { CreateShapeComponent } from './create-shape/create-shape.component';
import { ListOfShapesComponent } from './list-of-shapes/list-of-shapes.component';
import { Router } from '@angular/router';
import { ProcessSharedServiceService } from '../../process-order/SharedService/process-shared-service.service';
import { ImportOesComponent } from './import-oes/import-oes.component';
import { ImportBbsFromIfcComponent } from './import-bbs-from-ifc/import-bbs-from-ifc.component';
import { LoginService } from 'src/app/services/login.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { UpdatingBbsComponent } from './updating-bbs-remark/updating-bbs/updating-bbs.component';
import { AlertBoxComponent } from './alert-box/alert-box.component';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { DimensioningRuleComponent } from './dimensioning-rule/dimensioning-rule.component';
import { ListOfShapesESpliceComponent } from './list-of-shapes-esplice/list-of-shapes-esplice.component';
import { ListOfShapesNSpliceComponent } from './list-of-shapes-nsplice/list-of-shapes-nsplice.component';
import { OrderSummaryTableData } from 'src/app/Model/OrderSummaryTableData';
import { PrintBBSOrderComponent } from '../../ordersummary/print-bbsorder/print-bbsorder.component';

// import { BarDetailsComponent } from './bar-details/bar-details.component';
// import math;

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css'],
})
export class OrderdetailsComponent {
  @ViewChild('myCanvas', { static: true })
  Canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myCanvas1', { static: true })
  myCanvas1!: ElementRef<HTMLCanvasElement>;
  isSaveFlag = false;

  sideMenuVisible: number = 1; // Alignment of sidemenu on load -> 1|2

  CustomerCode: any = this.dropdown.getCustomerCode();
  ProjectCode: any = this.dropdown.getProjectCode()[0];
  // CustomerCode: any = '0001101688';
  // ProjectCode: any = '0000112837';
  OrderStatus: any;
  OrderNumber: any;

  JobID: any;
  // JobID: any = this.createSharedService.JobIds.CABJOBID;

  receivedData: any;
  gBBSTableData: any[] = [];
  BBSList: any[] = [];
  CouplerList: any[] = [];
  orderDetailsTable: any[] = [];
  orderDetailsList: any;
  shapeCodeList_backup: { value: any; label: any }[] = [];
  BarSizeList_backup: { value: any; label: any }[] = [];

  OrderdetailsLoading: boolean = true;
  CABDetails: any;
  TotalCABWeight: number = 0;
  TotalSTDWeight: number = 0;
  TotalWeight: number = 0;
  CouplerType: any = '';
  TransportMode: any = '';
  BBSStandard: any = 'BS-8666';
  OrderSummaryTableData: OrderSummaryTableData[] = [];

  BBSId: number = 0;
  EnableEditIndex: any = undefined;
  selectedRow: any[] = [];
  // gMaxBarLength: any;
  // gCustomerBar: any;
  // gSkipBendCheck: any;
  // gVarianceBarSplit: any;
  // gBBSStandard: any;
  // gOrderSubmission: any;
  // gOrderCreation: any;

  // gAddDia: any[] = [];
  // gAddHKHeightMax: any[] = [];
  // gAddBendLenMin: any[] = [];
  // gAddShape: any[] = [];
  // gAddPara: any[] = [];
  // gAddHook: any[] = [];
  // gAddRepShape: any[] = [];
  // gAddParType: any[] = [];
  // gAddParDia: any[] = [];
  // gAddParBendLenMin: any[] = [];
  currEditIndex: any;
  currentCharacter: any;
  index: number = 1;
  currentCharacterIndex: any;
  gridOptions!: GridOption;

  templateGrid!: AngularGridInstance;
  dataViewCAB: any;

  templateColumns: Column[] = [];
  bbsOrderdataset: any;
  editTable: boolean = false;

  showSideTable: boolean = false;
  totalCABWeight: any = '';
  totalSBWeight: any = '';
  totalCancelledWT: any = '';
  totalTotalWeight: any = '';
  totalNoofitems: any = '';
  totalTotalBarQty: any = '';
  totalTotalCouplerBarQty: any = '';
  shapeCodeList: { value: any; label: any }[] = [];

  showTable: boolean = false;

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

  gDDia = ',8,10,13,16,20,25,28,32,40,50';
  gDNonMinLen = '0,60,90,100,120,150,200,200,220,280,450';
  gDNonMinLenHk = '0,60,90,110,130,150,200,200,220,280,460';
  gDNonMinHtHk = '0,45,65,80,110,135,180,180,220,280,540';
  gDStdMinLen = '0,60,90,100,120,200,260,260,300,380,450';
  gDStdMinLenHk = '0,60,100,110,130,210,280,280,320,390,460';
  gDStdMinHtHk = '0,45,65,80,110,200,270,275,310,410,540';
  gDStdFormer = ',32,40,50,65,150,200,200,225,300,400';
  gDNonFormer = ',32,40,50,65,90,120,120,155,200,400';
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

  // ON SUCCESS

  // START

  gEStdDia = '';
  gENonDia = '';

  gDStdDia = '';
  gDNonDia = '';

  gNStdDia = '';
  gNNonDia = '';
  // END
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
  BarTypeList: any[] = [];
  BarTypeList_backup: any[] = [];

  // autocompleteCollection: Editors.AutoCompleteOption[] = [];

  tempActiveFlag: boolean = true;
  // isValidCellValue: boolean = true;
  updateSingleRecord: boolean = false;
  gCurrentBBSID: any = 0;

  disableDoubleCapture: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private createSharedService: CreateordersharedserviceService,
    private dropdown: CustomerProjectService,
    private processsharedserviceService: ProcessSharedServiceService,
    private loginService: LoginService,
    private reloadService: ReloadService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService
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
        type: FieldType.boolean,
        editor: { model: Editors.checkbox },
        formatter: Formatters.checkmark,
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
          // collection: [
          //   { value: 'H', label: 'H' },
          //   { value: 'X', label: 'X' },
          //   // , { value: 'H', label: 'h' }, { value: 'X', label: 'x' },
          // ],
          editorOptions: {
            minLength: 0,
            forceUserInput: true,
            autoSelect: false,
            fetch: (searchText: any, updateCallback: any) => {
              this.BarTypeList = this.BarTypeList_backup;
              this.BarTypeList = this.BarTypeList.filter((barsize: any) =>
                barsize.label.startsWith(searchText.toUpperCase())
              );
              updateCallback(this.BarTypeList); // add here the array
            },
            selectOnFocus: false, // Prevent the first item from being selected when focused
            closeOnSelect: false, // Keep the dropdown open after an item is selected
            keyup: (event: any) => {
              console.log('Key Pressed on dropdown', event.event.key);
              if (event.event.key === 'ArrowDown') {
                event.event.preventDefault(); // Prevent default behavior
                // Get the current row and column
                const { row, cell } =
                  this.templateGrid.slickGrid.getActiveCell();
                if (this.BarTypeList.length == 0) {
                  alert('Invalid bar size entered.');
                } else {
                  let lType = this.BarTypeList[0].value
                    ? this.BarTypeList[0].value
                    : '';
                  let lItem = this.templateGrid.slickGrid.getDataItem(row);
                  lItem.BarType = lType;
                  this.dataViewCAB.updateItem(lItem.id, lItem);
                  // Move focus to the next row in the same column
                  this.templateGrid.slickGrid.gotoCell(row + 1, cell, true);
                  event.event.preventDefault(); // Prevent default behavior
                  event.event.stopPropagation();
                  event.event.stopImmediatePropagation();
                }
              } else if (event.event.key === 'ArrowUp') {
                event.event.preventDefault(); // Prevent default behavior
                // Get the current row and column
                const { row, cell } =
                  this.templateGrid.slickGrid.getActiveCell();
                if (this.BarTypeList.length == 0) {
                  alert('Invalid bar size entered.');
                } else {
                  let lType = this.BarTypeList[0].value
                    ? this.BarTypeList[0].value
                    : '';
                  let lItem = this.templateGrid.slickGrid.getDataItem(row);
                  lItem.BarType = lType;
                  this.dataViewCAB.updateItem(lItem.id, lItem);
                  // Move focus to the next row in the same column
                  this.templateGrid.slickGrid.gotoCell(row - 1, cell, true);
                  event.event.preventDefault(); // Prevent default behavior
                  event.event.stopPropagation();
                  event.event.stopImmediatePropagation();
                }
              }
            },
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
          editorOptions: {
            minLength: 0,
            forceUserInput: true,
            fetch: (searchText: any, updateCallback: any) => {
              this.BarSizeList = this.BarSizeList_backup;
              this.BarSizeList = this.BarSizeList.filter((barsize: any) =>
                barsize.label.startsWith(searchText)
              );
              updateCallback(this.BarSizeList); // add here the array
            },
            keyup: (event: any) => {
              console.log('Key Pressed on dropdown', event.event.key);
              if (event.event.key === 'ArrowDown') {
                event.event.preventDefault(); // Prevent default behavior
                // Get the current row and column
                const { row, cell } =
                  this.templateGrid.slickGrid.getActiveCell();

                if (this.BarSizeList.length == 0) {
                  alert('Invalid bar size entered.');
                } else {
                  let lEditor: any =
                    this.templateGrid.slickGrid.getCellEditor();
                  let lValue = '';
                  if (lEditor) {
                    lValue = lEditor.getValue();
                    console.log('Here lactiveCell', lValue);
                  }

                  // let lSize = this.BarSizeList[0].value
                  //   ? this.BarSizeList[0].value
                  //   : '';

                  let lSize = lValue;
                  if (lSize) {
                    let lItem = this.templateGrid.slickGrid.getDataItem(row);
                    lItem.BarSize = lSize;
                    this.dataViewCAB.updateItem(lItem.id, lItem);
                  }
                  // Move focus to the next row in the same column
                  this.templateGrid.slickGrid.gotoCell(row + 1, cell, true);
                  event.event.preventDefault(); // Prevent default behavior
                  event.event.stopPropagation();
                  event.event.stopImmediatePropagation();
                }
              } else if (event.event.key === 'ArrowUp') {
                event.event.preventDefault(); // Prevent default behavior
                // Get the current row and column
                const { row, cell } =
                  this.templateGrid.slickGrid.getActiveCell();

                if (this.BarSizeList.length == 0) {
                  alert('Invalid bar size entered.');
                } else {
                  let lEditor: any =
                    this.templateGrid.slickGrid.getCellEditor();
                  let lValue = '';
                  if (lEditor) {
                    lValue = lEditor.getValue();
                    console.log('Here lactiveCell', lValue);
                  }

                  // let lSize = this.BarSizeList[0].value
                  //   ? this.BarSizeList[0].value
                  //   : '';

                  let lSize = lValue;
                  if (lSize) {
                    let lItem = this.templateGrid.slickGrid.getDataItem(row);
                    lItem.BarSize = lSize;
                    this.dataViewCAB.updateItem(lItem.id, lItem);
                  }
                  // Move focus to the next row in the same column
                  this.templateGrid.slickGrid.gotoCell(row - 1, cell, true);
                  event.event.preventDefault(); // Prevent default behavior
                  event.event.stopPropagation();
                  event.event.stopImmediatePropagation();
                }
              }
            },
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
        type: FieldType.boolean,
        editor: { model: Editors.checkbox },
        formatter: Formatters.checkmark,
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
          editorOptions: {
            forceUserInput: true,
            minLength: 1,
            fetch: (searchText: any, updateCallback: any) => {
              this.shapeCodeList = this.shapeCodeList_backup;
              this.shapeCodeList = this.shapeCodeList.filter((barsize: any) =>
                barsize.label.startsWith(searchText.toUpperCase())
              );

              this.shapeCodeUpdated = true;
              updateCallback(this.shapeCodeList); // add here the array
            },
            keyup: (event: any) => {
              let lEditor: any = this.templateGrid.slickGrid.getCellEditor();
              let lValue = '';
              if (lEditor) {
                lValue = lEditor.getValue();
                console.log('lEditor lActiveCell', lValue);
                let lObj = {
                  value: lValue.toString().toUpperCase(),
                  label: lValue.toString().toUpperCase(),
                };

                this.gEnteredShapeCode = lObj;
              }

              console.log('Key Pressed on dropdown', event.event.key);
              if (event.event.key === 'ArrowDown') {
                event.event.preventDefault(); // Prevent default behavior
                let { row, cell } = this.templateGrid.slickGrid.getActiveCell(); // Get the current row and column
                // console.log("Current Dropdown list ->", this.shapeCodeList);
                if (this.shapeCodeList.length == 0) {
                  alert('Invalid shape code entered.(输入的图形码无效.)');
                } else {
                  let lShapeCode = this.shapeCodeList[0].value
                    ? this.shapeCodeList[0].value
                    : '';
                  let lItem = this.templateGrid.slickGrid.getDataItem(row);
                  lItem.BarShapeCode = lShapeCode;
                  this.dataViewCAB.updateItem(lItem.id, lItem);
                  // console.log("Updated SC->", lShapeCode, this.templateGrid.slickGrid.getDataItem(row));
                  /**
                   * Update the shape parameters when changing the shapecode;
                   * Date: 11-06-2024
                   */
                  let args = {
                    cell: cell,
                    column: this.templateGrid.slickGrid.getColumns(),
                    grid: this.templateGrid.slickGrid,
                    item: lItem,
                    row: row,
                    target: 'grid',
                  };
                  let e = '';
                  if (this.shapeCodeUpdated) {
                    this.grid_onCellChange(e, args);
                  }
                  this.templateGrid.slickGrid.gotoCell(row + 1, cell, true);
                  event.event.preventDefault(); // Prevent default behavior
                  event.event.stopPropagation();
                  event.event.stopImmediatePropagation();
                }
              } else if (event.event.key === 'ArrowUp') {
                event.event.preventDefault(); // Prevent default behavior
                let { row, cell } = this.templateGrid.slickGrid.getActiveCell(); // Get the current row and column

                if (this.shapeCodeList.length == 0) {
                  alert('Invalid shape code entered.(输入的图形码无效.)');
                } else {
                  // Get the current row and column
                  let lShapeCode = this.shapeCodeList[0].value
                    ? this.shapeCodeList[0].value
                    : '';
                  let lItem = this.templateGrid.slickGrid.getDataItem(row);
                  lItem.BarShapeCode = lShapeCode;
                  this.dataViewCAB.updateItem(lItem.id, lItem);
                  // Move focus to the next row in the same column
                  /**
                   * Update the shape parameters when changing the shapecode;
                   * Date: 11-06-2024
                   */
                  let args = {
                    cell: cell,
                    column: this.templateGrid.slickGrid.getColumns(),
                    grid: this.templateGrid.slickGrid,
                    item: lItem,
                    row: row,
                    target: 'grid',
                  };
                  let e = '';
                  if (this.shapeCodeUpdated) {
                    this.grid_onCellChange(e, args);
                  }
                  this.templateGrid.slickGrid.gotoCell(row - 1, cell, true);
                  event.event.preventDefault(); // Prevent default behavior
                  event.event.stopPropagation();
                  event.event.stopImmediatePropagation();
                }
              }
            },
          },
        },
        cssClass: 'center-align grid-text-size yellow-background',
      },
      {
        id: 'A',
        name: 'A',
        field: 'A',
        toolTip: 'Bending Parameter A (参数 A)',
        // minWidth: 20,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'B',
        name: 'B',
        field: 'B',
        toolTip: 'Bending Parameter B (参数 B)',
        // minWidth: 20,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'C',
        name: 'C',
        field: 'C',
        toolTip: 'Bending Parameter C (参数 C)',
        // minWidth: 20,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'D',
        name: 'D',
        field: 'D',
        toolTip: 'Bending Parameter D (参数 D)',
        // minWidth: 20,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'E',
        name: 'E',
        field: 'E',
        toolTip: 'Bending Parameter E (参数 E)',
        // minWidth: 20,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'F',
        name: 'F',
        field: 'F',
        toolTip: 'Bending Parameter F (参数 F)',
        // minWidth: 20,
        // width: 40,
        editor: { model: Editors.text },
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'G',
        name: 'G',
        field: 'G',
        toolTip: 'Bending Parameter G (参数 G)',
        // minWidth: 20,
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

  closeOrderDetailsFlag: boolean = false;
  ngOnDestroy() {
    this.closeOrderDetailsFlag = true;
    localStorage.setItem('sideMenuVisible', this.sideMenuVisible.toString());
    if (this.showTable) {
      // If Data Entry Tab is selected, manually call the functions called when selecting "OrderSummary" Tab.
      this.SelectOrderSummary();
      this.saveSelectedRow(this.lastSelectedOrder);
    }
  }

  async ngOnInit() {
    if (localStorage.getItem('sideMenuVisible')) {
      // this.sideMenuVisible = parseInt(localStorage.getItem('sideMenuVisible')!);
    }
    this.commonService.changeTitle('Order Details | ODOS');
    console.log(
      'this.createSharedService.selectedrecord => ',
      this.createSharedService.selectedrecord
    );

    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log('receivedData', this.receivedData);

    // Set OderSummaryList Data from local Storage and remove item from local Storage.
    let lData: any = localStorage.getItem('ProcessOrderSummaryData');
    lData = JSON.parse(lData);
    if (lData) {
      // USING THIS FLAG WHEN GOING BACK FROM ORDER DETAILS PAGE
      this.RoutedFromProcess = true;
    }
    this.processsharedserviceService.setOrderSummaryData(lData);

    // localStorage.removeItem('ProcessData');
    // localStorage.removeItem('ProcessOrderSummaryData');

    //ASSIGNING VALUE TO JOBID
    //receivedData contains values obtained from records in ""ProcessOrder"" page
    this.NON_Editable = false;
    if (this.receivedData) {
      this.CustomerCode = this.receivedData.customer;
      this.ProjectCode = this.receivedData.project;
      this.JobID = this.receivedData.jobIds.CABJOBID;
      // this.NON_Editable = true;
      this.OrderStatus = this.receivedData.orderstatus;
      this.OrderNumber = this.receivedData.ordernumber;
      this.lTransportMode = this.receivedData.Transport;
      this.JobAdviceData = this.receivedData.JobAdviceCAB;
      this.JobAdviceData.JobID = this.JobID;

      // this.NON_Editable = !this.CheckEditable();
      await this.ReloadSubMenu();
    } else {
      this.JobID = this.createSharedService.JobIds.CABJOBID;
    }

    //assigning values from ""OrderSummary"" page
    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.OrderNumber = this.createSharedService.selectedrecord.OrderNumber;
      this.JobAdviceData = this.createSharedService.JobAdviceCAB;
      this.lTransportMode = this.createSharedService.selectedrecord.Transport;
      if (this.createSharedService.JobIds) {
        this.JobID = this.createSharedService.JobIds.CABJOBID;
        this.JobAdviceData.JobID = this.JobID;
      }
    } else {
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

      // If Roted from process, then update order summary data
      await this.SetCreateDatainLocal(this.OrderNumber);
    }

    // this.NON_Editable = !this.CheckEditable();

    // if (this.NON_Editable) {
    //   if (this.templateGrid) {
    //     this.templateGrid.slickGrid.getOptions().editable = false;
    //     this.templateGrid.slickGrid.invalidateAllRows();
    //     this.templateGrid.slickGrid.render();
    //   }
    // }

    setTimeout(() => {
      this.bbsOrderdataset = this.mockData();
      console.log('this.bbsOrderdataset=>', this.bbsOrderdataset);
    });

    // this.GETJobId(this.OrderNumber);

    // this.getJobId(this.OrderNumber);

    this.reloadProjectDetails(this.CustomerCode, this.ProjectCode); //added by ajit

    // this.GetBBSOrder(this.CustomerCode, this.ProjectCode, this.JobID);
    this.getOrderDetailsCAB(this.CustomerCode, this.ProjectCode, this.JobID);

    this.GetCouplerType();
    this.reload_AddnParLimit();

    this.getProjectStage();
    this.get_AddlLimmitShape();
    this.getAddlLimmit();
    this.reloadSBDetails();

    this.BBSList = ['BS-8666', 'RMS-B80', 'AS3600'];

    // this.orderDetailsTable = [
    //   {
    //     SNo: 1,
    //     StructureElement: 'BEAM',
    //     BBSNo: 'BBS696',
    //     BBSDescription: '',
    //     CABWeight: 0,
    //     SBWeight: 0,
    //     OrderWeight: 0,
    //     CancelledWT: 0,
    //     TotalWeight: 0,
    //   },
    // ];

    this.checkDoubleCapture();
    this.GetMinimumBundlePcs();
  }

  onDoubleClick(index: number, item: any) {
    console.log('onDoubleClick=>', index, item);
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ListOfShapesComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.CustomerCode = this.CustomerCode;
    modalRef.componentInstance.ProjectCode = this.ProjectCode;
    modalRef.componentInstance.CouplerType = this.CouplerType;
    modalRef.componentInstance.ShapeCategory = 'Most Common Shapes';

    modalRef.componentInstance.saveTrigger.subscribe((shapeCode: any) => {
      console.log('Selected ShapeCode -> ', shapeCode);
      let lRows = this.templateGrid.slickGrid.getSelectedRows();
      if (lRows.length < 1) {
        alert(
          'Please select a row of Bar Details before selecting shape code. (请钢筋加工表中选择一行, 再选图形.)'
        );
      }

      let maxRowNo = 0;
      let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      if (rowNum != undefined || rowNum != null) {
        let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
        lItem.BarShapeCode = shapeCode;

        let id = this.templateGrid.slickGrid.getDataItem(rowNum).id;

        this.dataViewCAB.beginUpdate();
        this.dataViewCAB.updateItem(id, lItem);
        this.dataViewCAB.endUpdate();
        this.dataViewCAB.refresh();
        /** For Refreshing the COlumns and the values of the selected row */
        let lActiveCell = this.templateGrid.slickGrid.getActiveCell();
        if (lActiveCell) {
          let args = {
            cell: lActiveCell.cell,
            column: this.templateGrid.slickGrid.getColumns(),
            grid: this.templateGrid.slickGrid,
            item: lItem,
            row: lActiveCell.row,
            target: 'grid',
          };
          let e = '';
          this.grid_onCellChange(e, args);
        }
      }
    });
  }
  angularGridReady(event: Event) {
    console.log('event', event);
    this.templateGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.dataViewCAB = this.templateGrid.slickGrid.getData();

    this.templateGrid.slickGrid.onValidationError.subscribe((e, args) => {
      alert(args.validationResults.msg);
    });

    this.templateGrid.slickGrid.onActiveCellChanged.subscribe(
      async (e, args) => {
        await this.grid_onActiveCellChanged(e, args);
      }
    );
    this.templateGrid.slickGrid.onBeforeEditCell.subscribe(async (e, args) => {
      await this.grid_onBeforeEditCell(e, args);
    });
    this.templateGrid.slickGrid.onCellChange.subscribe((e, args) => {
      this.grid_onCellChange(e, args);
    });
    this.templateGrid.slickGrid.onAddNewRow.subscribe((e, args) => {
      this.grid_onAddNewRow(e, args);
    });
    this.templateGrid.slickGrid.onSelectedRowsChanged.subscribe(
      async (e, args) => {
        await this.grid_onSelectedRowsChanged(e, args);
      }
    );
    this.templateGrid.slickGrid.onClick.subscribe((e, args) => {
      this.grid_onClick(e, args);
    });
    this.templateGrid.slickGrid.onDblClick.subscribe((e, args) => {
      console.log('Open ShapeList Component');
    });
    this.templateGrid.slickGrid.onKeyDown.subscribe(async (e, args) => {
      await this.grid_onKeyDown(e, args);
    });
    this.templateGrid.slickGrid.onContextMenu.subscribe((e, args) => {
      this.grid_onContextMenu(e, args);
    });
    this.templateGrid.slickGrid.onSort.subscribe((e, args) => {
      this.grid_onSort(e, args);
    });

    this.dataViewCAB.getItemMetadata = this.metadata(
      this.dataViewCAB.getItemMetadata
    );
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
  Copy(item: any) {
    debugger;
    console.log('to be Copied', item);
    let index = this.orderDetailsList.findIndex(
      (x: { BBSNo: any }) => x.BBSNo == item.BBSNo
    );
    let lbbsID = this.orderDetailsList[index].BBSID;
    let lorderNumber = this.OrderNumber;
    // if (
    //   confirm(
    //     'The BBS copy function will clear current BBS data and copy from source. Are you sure?\n\n' +
    //     '用此功能将清除您所选择的钢筋加工表的原始数据并且复制数据从别的钢筋加工表. 请确认?'
    //   ) == false
    // ) {
    //   return;
    // }
    let data = {
      Jobids: this.JobID,
      BBSId: lbbsID,
      OrderNumber: lorderNumber,
    };
    this.ConfirmCopy(data);
  }

  Import(item: any) {
    debugger;

    let index = this.orderDetailsList.findIndex(
      (x: { BBSNo: any }) => x.BBSNo == item.BBSNo
    );
    let lbbsID = this.orderDetailsList[index].BBSID;
    let lorderNumber = this.OrderNumber;

    let data = {
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,
      BBSId: lbbsID,
      Jobids: this.JobID,
    };
    localStorage.setItem('ImportOrderDetails', JSON.stringify(data));
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ImportOrderDetailsComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.CustomerCode = this.CustomerCode;
    modalRef.componentInstance.ProjectCode = this.ProjectCode;
    modalRef.componentInstance.JobID = this.JobID;
    modalRef.componentInstance.BBSID = lbbsID;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      this.ReloadOrderDetails();
    });
  }
  async goBack() {
    let lreturn = true;
    for (let item of this.orderDetailsTable) {
      if (item.DuplicateBBS == true || item.DuplicateBBS_DB == true) {
        lreturn = false;
      }
    }
    if (!lreturn) {
      alert('Duplicate BBS Detected!');
      return;
    }
    if (await this.backToOrderSummary()) {
      if (!this.RoutedFromProcess) {
        this.location.back();
      } else {
        this.router.navigate(['../order/createorder']);
      }
    }
  }
  GetCouplerType() {
    let CustomerCode = this.CustomerCode;
    let ProjectCode = this.ProjectCode;
    this.orderService.getCouplerType(CustomerCode, ProjectCode).subscribe({
      next: (response) => {
        console.log(response);
        this.CouplerList = response;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getOrderDetailsCAB(CustomerCode: any, ProjectCode: any, JobID: any) {
    CustomerCode = CustomerCode;
    ProjectCode = ProjectCode;
    JobID = JobID;
    this.orderService
      .getOrderDetailsCAB(CustomerCode, ProjectCode, JobID)
      .subscribe({
        next: (response) => {
          console.log('CABDetails', response);
          this.CABDetails = response;
          this.TotalCABWeight = this.CABDetails.TotalCABWeight;
          this.TotalSTDWeight = this.CABDetails.TotalSTDWeight;
          this.TotalWeight = this.CABDetails.TotalWeight;
          this.CouplerType = this.CABDetails.CouplerType
            ? this.CABDetails.CouplerType
            : 'No Coupler';
          this.TransportMode = this.CABDetails.TransportLimit;
          this.BBSStandard =
            this.CABDetails.BBSStandard != null &&
            this.CABDetails.BBSStandard != ''
              ? this.CABDetails.BBSStandard
              : this.BBSStandard;

          this.UpdatePin();

          this.getShapeCodeList(
            this.CustomerCode,
            this.ProjectCode,
            this.CouplerType.toString()
          );

          if (response.Remarks != '') {
            this.OpenUpdatingRemaksPopUp(response.Remarks);
          }
        },

        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  OpenUpdatingRemaksPopUp(remarks: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      UpdatingBbsComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.ResponseMessage = remarks;
  }

  GetBBSOrderA(CustomerCode: any, ProjectCode: any, JobID: any) {
    try {
      let obj = {
        CustomerCode: CustomerCode,
        ProjectCode: ProjectCode,
        JobID: JobID,
      };
      const data = this.orderService.getBBSOrder(obj).toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }

  GetBBSOrder(CustomerCode: any, ProjectCode: any, JobID: any) {
    this.OrderdetailsLoading = true;
    let obj = {
      CustomerCode: CustomerCode,
      ProjectCode: ProjectCode,
      JobID: JobID,
    };
    this.orderService.getBBSOrder(obj).subscribe({
      next: (response) => {
        this.orderDetailsList = response;

        console.log('orderDetailsTable', response);

        this.orderDetailsTable = [];

        // this.index = response.length;
        // this.currentCharacter = 'A';
        // this.currentCharacterIndex = 0;

        for (let i = 0; i < response.length; i++) {
          let obj = {
            SNo: i + 1,
            StructureElement: response[i].BBSStrucElem,
            BBSID: response[i].BBSID,
            BBSNo: response[i].BBSNo,
            BBSDescription: response[i].BBSDesc,
            CABWeight: response[i].BBSOrderCABWT,
            SBWeight: response[i].BBSOrderSTDWT,
            OrderWeight:
              Math.round(
                (Number(response[i].BBSOrderCABWT) +
                  Number(response[i].BBSOrderSTDWT)) *
                  1000
              ) / 1000,
            CancelledWT: response[i].BBSCancelledWT,
            TotalWeight: response[i].BBSTotalWT,
          };
          this.orderDetailsTable.push(obj);
        }
        if (response.length == 1 && response[0].BBSNo == '0') {
          this.orderDetailsTable[0].BBSNo = 'BBS' + response[0].JobID;
          this.orderDetailsList[0].BBSNo = 'BBS' + response[0].JobID;
          this.SaveBBS(this.orderDetailsList[0]);
        } else {
          this.checkBBSDuplicate();
        }
        this.OrderdetailsLoading = false;
        // Background call to save table data locally.
        this.SaveTableData_Local();
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  async checkBBSDuplicate() {
    if (this.isEditible()) {
      let bbsList: any[] = [];
      for (let item of this.orderDetailsTable) {
        if (this.updateSingleRecord) {
          if (this.gCurrentBBSID !== item.BBSID) {
            // Skip this Iteration.
            continue;
          }
        }

        const response = await this.checkDBBBSNo(item.BBSNo);
        item.DuplicateBBS_DB = false; // Initialize as false;
        if (response == false) {
          console.error('Error Durring API Call');
        } else {
          if (response.value.toUpperCase() == item.BBSNo.toUpperCase()) {
            item.DuplicateBBS_DB = true;
          }
        }

        this.checkDuplicate_inList();
      }
      // Reset the flag for single update.
      this.updateSingleRecord = false;
      this.gCurrentBBSID = 0;
    }
  }

  reloadProjectDetails(CustomerCode: any, ProjectCode: any) {
    this.OrderdetailsLoading = true;
    this.orderService
      .reload_ProjectDetails(CustomerCode, ProjectCode)
      .subscribe({
        next: (response) => {
          console.log('reload_ProjectDetails', response);
          this.gOrderSubmission = response.OrderSubmission;
          this.gOrderCreation = response.OrderCreation;
          this.CheckEditable(this.gOrderSubmission, this.gOrderCreation); // Check & update if the grid is editable.

          if (response.MaxBarLength != null && response.MaxBarLength >= 5000) {
            this.gMaxBarLength = response.MaxBarLength;
            this.gCustomerBar = response.CustomerBar;
            this.gSkipBendCheck = response.SkipBendCheck;
            this.gVarianceBarSplit = response.VarianceBarSplit;
          }

          if (
            response.BBSStandard == null ||
            response.BBSStandard.trim() == ''
          ) {
            this.gBBSStandard = 'BS-8666';
            this.BBSStandard = 'BS-8666';
          } else {
            this.gBBSStandard = response.BBSStandard;
            this.BBSStandard = response.BBSStandard;
          }
          this.OrderdetailsLoading = false;
        },
        error: (e) => {
          this.gOrderSubmission = this.commonService.Submission;
          this.gOrderCreation = this.commonService.Editable;
          this.CheckEditable(this.gOrderSubmission, this.gOrderCreation); // Check & update if the grid is editable.
        },
        complete: () => {
          // this.loading = false;
          this.GetBBSOrder(this.CustomerCode, this.ProjectCode, this.JobID);
        },
      });
  }

  getAddlLimmit() {
    this.OrderdetailsLoading = true;

    this.orderService.get_AddlLimmit().subscribe({
      next: (response) => {
        console.log('getAddlLimmit', response);
        if (response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            this.gAddDia.push(response[i].dia);
            this.gAddHKHeightMax.push(response[i].hook_height_max);
            this.gAddBendLenMin.push(response[i].bend_len_min);
          }
        }
        this.OrderdetailsLoading = false;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  get_AddlLimmitShape() {
    this.OrderdetailsLoading = true;

    this.orderService.get_AddlLimmitShape().subscribe({
      next: (response) => {
        console.log('get_AddlLimmitShape', response);
        if (response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            this.gAddShape.push(response[i].shape_code);
            this.gAddPara.push(response[i].shape_paras);
            this.gAddHook.push(response[i].hook_shape);
            this.gAddRepShape.push(response[i].replace_shape);
          }
        }
        this.OrderdetailsLoading = false;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  reload_AddnParLimit() {
    this.OrderdetailsLoading = true;

    this.orderService.reload_AddnParLimit().subscribe({
      next: (response) => {
        console.log('reload_AddnParLimit', response);
        if (response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            this.gAddParType.push(response[i].par_type);
            this.gAddParDia.push(response[i].dia);
            this.gAddParBendLenMin.push(response[i].bend_len_min);
          }
        }
        this.OrderdetailsLoading = false;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getNextBBSID() {
    let lBBSID = 0;
    this.orderDetailsTable.forEach(
      (element) => (lBBSID = element.BBSID > lBBSID ? element.BBSID : lBBSID)
    );
    return lBBSID + 1;
  }

  async addNewRecord() {
    console.log(this.orderDetailsTable.length);
    let obj = {
      ...this.orderDetailsTable[this.orderDetailsTable.length - 1],
    };
    // const startCode = 'A'.charCodeAt(0);
    // const endCode = 'Z'.charCodeAt(0);
    // if (this.index == 1) {
    //   this.currentCharacter = 'A';
    //   this.currentCharacterIndex = 0;
    // } else {
    //   // Calculate the next character index and ensure it stays within the range
    //   this.currentCharacterIndex =
    //     (this.currentCharacterIndex + 1) % (endCode - startCode + 1);

    //   // Convert the ASCII code to a character
    //   this.currentCharacter = String.fromCharCode(
    //     startCode + this.currentCharacterIndex
    //   );
    // }
    obj.BBSNo = this.GetNewBBSNum();
    obj.BBSID = this.getNextBBSID();
    obj.CABWeight = 0;
    obj.CancelledWT = 0;
    obj.OrderWeight = 0;
    obj.SBWeight = 0;
    obj.TotalWeight = 0;

    this.orderDetailsTable.push(obj);
    this.index++;

    await this.SaveBBS_CAB(obj, 'newRecord');
    this.ReloadOrderDetails();
    console.log('object =>', obj, this.currentCharacter);
  }

  async GetBarDetails(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number
  ): Promise<any> {
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

  // async GetTableData_new(
  //   CustomerCode: string,
  //   ProjectCode: string,
  //   JobID: number,
  //   BBSID: number
  // ) {
  //   let response = await this.GetBarDetails(
  //     CustomerCode,
  //     ProjectCode,
  //     JobID,
  //     BBSID
  //   );
  //   if (response === false) {
  //     alert('Cannot reload bar detail infomation. Please try again later');
  //   } else {
  //     console.log('BBSORDERDETAILS', response);
  //     this.bbsOrderTable = response;
  //     console.log('WORK', this.bbsOrderTable);

  //     this.getTotalWeightandQty();
  //     this.refreshInfo(this.gridIndex);
  //     await this.CheckBBSDetails();
  //     // this.templateGrid.slickGrid.autosizeColumns();
  //   }
  // }
  async GetTableData(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number
  ) {
    // START LOADING SCREEN
    this.OrderdetailsLoading = true;

    let response = await this.GetBarDetails(
      CustomerCode,
      ProjectCode,
      JobID,
      BBSID
    );
    if (response === false) {
      alert('Cannot reload bar detail infomation. Please try again later');
    } else {
      console.log('BBSORDERDETAILS', response);
      this.bbsOrderTable = response;
      let tObj = {
        BBSID: BBSID,
        TableData: response,
      };
      let lBBSPresent = true;
      if (this.gBBSTableData.length == 0) {
        this.gBBSTableData.push(tObj);
      }
      for (let i = 0; i < this.gBBSTableData.length; i++) {
        lBBSPresent = false;
        if (this.gBBSTableData[i].BBSID == BBSID) {
          lBBSPresent = true;
          this.gBBSTableData[i].TableData = response;
          break;
        }
      }
      if (lBBSPresent == false) {
        this.gBBSTableData.push(tObj);
      }
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
            CreateBy: response[i].CreateBy,
            UpdateBy: response[i].UpdateBy,
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

        /**
         * Refresh the side menu after Grid Update
         */
        this.refreshInfo(this.gridIndex);

        this.templateGrid.slickGrid.invalidateAllRows();
        this.templateGrid.slickGrid.render();
        this.templateGrid.resizerService.resizeGrid();
      } else {
        // dataViewArray[pBBSRowNo + 2].beginUpdate();
        // dataViewArray[pBBSRowNo + 2].setItems(data);
        // dataViewArray[pBBSRowNo + 2].endUpdate();
        // gridArray[pBBSRowNo + 2].render();

        var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
        var lProjectCode = this.ProjectCode; //document.getElementById("ProjectCode").value;
        var lJobID = this.JobID;
        let CreateBy = this.loginService.GetGroupName();

        data[0] = {
          CustomerCode: this.CustomerCode,
          ProjectCode: this.ProjectCode,
          JobID: this.JobID,
          BBSID: this.BBSId,
          BarID: 1,
          id: 1,
          BarSort: 1000,
          newBarRecord: 1,
          CreateBy: CreateBy,
        };

        this.dataViewCAB.beginUpdate();
        this.dataViewCAB.setItems(data);
        this.dataViewCAB.endUpdate();

        /**
         * Refresh the side menu after Grid Update
         */
        this.refreshInfo(this.gridIndex);

        this.templateGrid.slickGrid.invalidateAllRows();
        this.templateGrid.slickGrid.render();
        this.templateGrid.resizerService.resizeGrid();
      }

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

      this.getTotalWeightandQty(BBSID);
      this.refreshInfo(this.gridIndex);
      await this.CheckBBSDetails();
    }
    /**
     * To prevent entry on submitted records.
     */
    let lOrderStatus = '';
    if (this.receivedData) {
      lOrderStatus = this.receivedData.orderstatus;
    }
    if (this.createSharedService.selectedrecord) {
      lOrderStatus = this.createSharedService.selectedrecord.OrderStatus;
    }
    // if (lOrrdeStatus == 'Created' || lOrderStatus == 'Created*') {
    //   this.NON_Editable = false;
    // } else {
    //   this.NON_Editable = true;
    // }
    // if (this.NON_Editable) {
    //   if (this.templateGrid) {
    //     this.templateGrid.slickGrid.getOptions().editable = false;
    //     this.templateGrid.slickGrid.invalidateAllRows();
    //     this.templateGrid.slickGrid.render();
    //     this.templateGrid.resizerService.resizeGrid();
    //   }
    // }
    if (this.orderDetailsList) {
      let lBBSNo = this.orderDetailsList.find(
        (x: { BBSID: number }) => x.BBSID == this.BBSId
      ).BBSNo;
      if (lBBSNo) {
        if (lBBSNo == this.lastSelectedOrder.BBSNo) {
          this.updateSelectedRows(this.lastSelectedOrder);
        }
      }
    }

    // END LOADING SCREEN
    this.OrderdetailsLoading = false;
  }

  async getTotalWeightandQty(lBBSID: any) {
    let totalweight = 0;
    let cabweight = 0;
    let stdweight = 0;
    let cancelledweight = 0;
    let barqty = 0;
    let ltotalCount = 0;

    for (let i = 0; i < this.bbsOrderTable.length; i++) {
      if (this.bbsOrderTable[i].Cancelled) {
        cancelledweight += this.bbsOrderTable[i].BarWeight;
      } else {
        if (this.bbsOrderTable[i].BarSTD == true) {
          stdweight += this.bbsOrderTable[i].BarWeight;
        } else {
          cabweight += this.bbsOrderTable[i].BarWeight;
        }
        ltotalCount = ltotalCount + 1;
        barqty += this.bbsOrderTable[i].BarTotalQty;
        totalweight += this.bbsOrderTable[i].BarWeight;
      }
    }

    this.totalTotalWeight = totalweight.toFixed(3);
    this.totalCancelledWT = cancelledweight.toFixed(3);
    this.totalSBWeight = stdweight.toFixed(3);
    this.totalCABWeight = cabweight.toFixed(3);
    this.totalTotalBarQty = barqty;
    //this.totalNoofitems = ltotalCount;

    await this.UpdateBBS(lBBSID);
  }

  getData(data: any) {
    this.templateGrid.slickGrid.invalidateAllRows();
    this.templateGrid.slickGrid.render();

    this.BBSId = this.orderDetailsList.find(
      (x: { BBSNo: any }) => x.BBSNo == data.BBSNo
    ).BBSID;

    this.GetTableData(
      this.CustomerCode,
      this.ProjectCode,
      this.JobID,
      this.BBSId
    );
    // this.GetTableData('0001101481', '0000113319', 999, 1);

    this.templateGrid.slickGrid.invalidateAllRows();
    this.templateGrid.slickGrid.render();
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
    let tempShape = this.templateGrid.slickGrid.getActiveCell();
    if (tempShape) {
      this.templateGrid.slickGrid.focus();
      this.templateGrid.slickGrid.setActiveCell(tempShape.row, tempShape.cell);
    }
    console.log('allColumns=>', allColumns);
    console.log('COLUMN', this.templateColumns);
  }

  reloadSBDetails() {
    // '0001101688', '0000112837'
    var lCustomerCode = this.CustomerCode;
    var lProjectCode = this.ProjectCode;

    this.orderService.getSBDetails(lCustomerCode, lProjectCode).subscribe({
      next: (response) => {
        console.log(response);

        if (response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            this.gSBBarType.push(response[i].BarType);
            this.gSBBarSize.push(response[i].BarSize);
            this.gSBLength.push(response[i].BarLength);
            this.gSBPcsFr.push(response[i].BundlePcs_fr);
            this.gSBPcs.push(response[i].BundlePcs);
          }
        }
      },
      error: (e) => {
        alert(
          'Error on getting SB details. Please check the Internet connection and try again.'
        );
      },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  async grid_onKeyDown(e: any, args: any): Promise<any> {
    // alert('YES')

    let Row = args.grid.getActiveCell()?.row;
    let Cell = args.grid.getActiveCell()?.cell;
    let Name = args.grid.getColumns(Row)[Cell]['id'];

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (Name == 'BarType' || Name == 'BarShapeCode' || Name == 'BarSize') {
        /**
         * Update the Dropdown lists of the following Columns (BarType, BarShapeCode, BarSize),
         * so that it does not change its value based upon the previously filtered values.
         *
         * This condition will only run when 'ArrowDown/ArrowUp' keys are pressed on columns with
         * autocompleter editor and the original values of the columns are not changed.
         * In such case where column values are not changed the Dropdownlist is not updated and will
         * contain the list which was filtered previously.
         */
        let lShapeCode = args.grid.getDataItem(Row).BarShapeCode;
        this.shapeCodeList = [{ label: lShapeCode, value: lShapeCode }];

        let lSize = args.grid.getDataItem(Row).BarSize;
        this.BarSizeList = [{ label: lSize, value: lSize }];

        let lType = args.grid.getDataItem(Row).BarType;
        this.BarTypeList = [{ label: lType, value: lType }];

        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    // Setting limit to few Column of the Table (BarMark, ElementMark, Remarks).
    const allowedKeys = [
      'Backspace',
      'Enter',
      'Tab',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
    ];
    if (Name == 'BarMark') {
      let lCellEditor = args.grid.getCellEditor();
      // Allow essential keys like Backspace, Enter, Delete, and Arrow keys
      if (lCellEditor) {
        let lValue = lCellEditor.getValue();
        if (lValue?.length >= 8 && !allowedKeys.includes(e.key)) {
          console.log('Barmark value limit exceeded');
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }
    }
    if (Name == 'ElementMark') {
      let lCellEditor = args.grid.getCellEditor();
      // Allow essential keys like Backspace, Enter, Delete, and Arrow keys
      if (lCellEditor) {
        let lValue = lCellEditor.getValue();
        if (lValue?.length >= 20 && !allowedKeys.includes(e.key)) {
          console.log('ElementMark value limit exceeded');
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }
    }
    if (Name == 'Remarks') {
      let lCellEditor = args.grid.getCellEditor();
      // Allow essential keys like Backspace, Enter, Delete, and Arrow keys
      if (lCellEditor) {
        let lValue = lCellEditor.getValue();
        if (lValue?.length >= 100 && !allowedKeys.includes(e.key)) {
          console.log('Remarks value limit exceeded');
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }
    }
    if (Name == 'BarType') {
      if (e.which == 9 || e.which == 13) {
        if (args.grid.getDataItem(args.row) === undefined && args.row != 0) {
          this.grid_onAddNewRow(e, args);
          if (e.shiftKey) {
            args.grid.navigateLeft();
          } else {
            args.grid.navigateRight();
          }
          args.grid.focus();
          args.grid.editActiveCell();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }
    }

    if (Name == 'BarSize') {
      if (e.which == 9 || e.which == 13) {
        if (e.shiftKey) {
          args.grid.navigateLeft();
          args.grid.focus();
          args.grid.editActiveCell();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }
    }

    if (Name == 'BarShapeCode') {
      if (e.which == 9 || e.which == 13) {
        if (e.shiftKey) {
          args.grid.getEditorLock().commitCurrentEdit();

          let lCurrRow = args.grid.getActiveCell().row;
          let lShapeCode = args.grid.getDataItem(lCurrRow).BarShapeCode;
          if (
            lShapeCode == null ||
            lShapeCode == '' ||
            lShapeCode == undefined ||
            lShapeCode == ' '
          ) {
            // this.toastr.error('Invalid Shape Code');
            alert('Invalid shape code entered.(输入的图形码无效.)');
            // Remove the invalid entry from the table
            let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
            lItem.BarShapeCode = '';
            this.dataViewCAB.updateItem(lItem.id, lItem);
            // Stop the focus from moving right and stay at the current editor
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }

          let res = this.ShapeCodeValidator(lShapeCode);
          if (res.valid == false) {
            alert(res.msg);
            // Remove the invalid entry from the table
            let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
            lItem.BarShapeCode = '';
            this.dataViewCAB.updateItem(lItem.id, lItem);

            // Stop the focus from moving right and stay at the current editor
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
          args.grid.navigateLeft();
          args.grid.focus();
          args.grid.editActiveCell();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }
    }
    if (Name == 'Remarks') {
      if (e.which == 9) {
        if (e.shiftKey) {
          let lRow = args.row;
          let lParams: any = args.grid.getDataItem([lRow]).shapeParameters;
          lParams = lParams.split(',');
          let lLastParam = lParams[lParams.length - 1];
          let lColumn = args.grid
            .getColumns()
            .findIndex((x: any) => x.name === lLastParam);

          args.grid.gotoCell(lRow, lColumn, true);
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }
    }

    if (Name == 'BarType') {
      if (args.grid.getCellEditor()) {
        let tValue = args.grid.getCellEditor().getValue();
        args.grid.getCellEditor().setValue(tValue.toUpperCase());
      }
    }

    if (Name == 'BarShapeCode') {
      if (args.grid.getCellEditor()) {
        let tValue = args.grid.getCellEditor().getValue();
        console.log('BarShapeCode Value', tValue.toUpperCase());
        args.grid.getCellEditor().setValue(tValue.toUpperCase());
      }
    }

    this.dataViewCAB = this.templateGrid.slickGrid.getData();
    if (e.which == 9) {
      e.preventDefault();
      //grid.getEditorLock().commitCurrentEdit();
      let lCurrRow = args.grid.getActiveCell().row;
      let lCurrCell = args.grid.getActiveCell().cell;
      let lColumnName = args.grid.getColumns(lCurrRow)[lCurrCell]['id'];

      if (lColumnName == 'BarMemberQty') {
          args.grid.getEditorLock().commitCurrentEdit();
          var lMembQty = args.grid.getDataItem(lCurrRow).BarMemberQty;
          if (
            lMembQty == null ||
            lMembQty == undefined ||
            lMembQty == '' ||
            lMembQty == ' ' ||
            lMembQty <= 0 
          ) {
            this.toastr.error('Invalid Member Quantity');

            let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
            lItem.BarMemberQty = '';
            this.dataViewCAB.updateItem(lItem.id, lItem);

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
          lEachQty == null ||
          lEachQty == undefined ||
          lEachQty == '' ||
          lEachQty == ' ' ||
          lEachQty <= 0
        ) {
          this.toastr.error('Invalid Each Quantity');
          let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
            lItem.BarEachQty = '';
            this.dataViewCAB.updateItem(lItem.id, lItem);
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
          lEachQty == null ||
          lEachQty == undefined ||
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

        //NEWLY ADDED
        let isTrue = false;
        let lArray = args.grid.getColumns()[4].editor.collection;

        lArray.forEach((x: { value: string }) => {
          if (x.value.toLowerCase() == lEachQty.toLowerCase()) {
            isTrue = true;
          }
        });

        if (!isTrue) {
          this.toastr.error('BarType Invalid');
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
          lEachQty == null ||
          lEachQty == undefined ||
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
        //NEWLY ADDED
        let isTrue = false;
        let lArray = args.grid.getColumns()[5].editor.collection;

        lArray.forEach((x: { value: string }) => {
          if (x.value.toLowerCase() == lEachQty.toLowerCase()) {
            isTrue = true;
          }
        });

        if (!isTrue) {
          this.toastr.error('BarSize Invalid');
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }

      if (lColumnName == 'BarShapeCode') {
        args.grid.getEditorLock().commitCurrentEdit();
        // var lShapeCode =
        //   args.grid.getDataItem(lCurrRow).BarShapeCode == null
        //     ? ''
        //     : args.grid.getDataItem(lCurrRow).BarShapeCode;
        // console.log("lShapeCode", lShapeCode)
        // if (lShapeCode == '')

        // var lShapeCode = args.grid.getDataItem(lCurrRow).BarShapeCode;
        // if (
        //   lShapeCode == null ||
        //   lShapeCode == '' ||
        //   lShapeCode == undefined ||
        //   lShapeCode == ' '
        // ) {
        //   // this.toastr.error('Invalid Shape Code');
        //   alert('Invalid shape code entered.(输入的图形码无效.)');
        //   // Remove the invalid entry from the table
        //   let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
        //   lItem.BarShapeCode = '';
        //   this.dataViewCAB.updateItem(lItem.id, lItem);
        //   // Stop the focus from moving right and stay at the current editor
        //   e.stopPropagation();
        //   e.stopImmediatePropagation();
        //   args.grid.focus();
        //   args.grid.editActiveCell();
        //   return;
        // }

        // let res = this.ShapeCodeValidator(lShapeCode);
        // if (res.valid == false) {
        //   alert(res.msg);

        //   // Remove the invalid entry from the table
        //   let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
        //   lItem.BarShapeCode = '';
        //   this.dataViewCAB.updateItem(lItem.id, lItem);

        //   // Stop the focus from moving right and stay at the current editor
        //   e.stopPropagation();
        //   e.stopImmediatePropagation();
        //   args.grid.focus();
        //   args.grid.editActiveCell();
        //   return;
        // }

        // console.log(
        //   'BarShapeCode',
        //   args.grid.getDataItem(lCurrRow).BarShapeCode
        // );
      }

      /**Set the Parameter Validator */
      // this.isValidCellValue = true;
      // Show Validation on Error Cell Selection
      if (lColumnName.length == 1) {
        if (args.grid.getCellEditor()) {
          // Calculate
          //1.Calculate the dependant parameters
          var lValue = args.grid.getCellEditor().getValue();

          /**
           * Set up a flog to handle both TAB conditions
           * 1. Only TAB is pressed => Trigger Validator
           * 2. Shift + TAB is pressed but cell is empty => Don't Trigger Validator
           * 3. Shift + TAB is pressed but cell is not empty => Trigger Validator
           */

          let lTrigger: boolean = true; //Set Initial State as TRUE
          if (
            e.shiftKey == true &&
            (lValue == undefined || lValue == null || lValue == '')
          ) {
            lTrigger = false;
          }

          if (lTrigger) {
            let res: any = this.parameterValidator(args, lValue, lColumnName);
            // { valid: true, msg: null }
            if (res.valid == false) {
              alert(res.msg);
              // this.isValidCellValue = false;

              // If invalid update the cell with an empty string;
              let lItem = this.templateGrid.slickGrid.getDataItem(args.row);
              lItem[lColumnName] = '';
              this.dataViewCAB.updateItem(lItem.id, lItem);

              // Prevent the focus from moving right and stay at the current editor
              args.grid.focus();
              args.grid.editActiveCell();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return;
            } else {
              // Update the cell style/color
              this.UpdateCellStyle(args);
            }
          }
        }
      }

      // if (lColumnName == 'BarShapeCode') {
      //   var lShapeCode = args.grid.getDataItem(lCurrRow).BarShapeCode == null
      //     ? '' : args.grid.getDataItem(lCurrRow).BarShapeCode;
      //   //  args.item['BarShapeCode'];

      //   if (lShapeCode === "") {
      //     lShapeCode = "INVALID";
      //   }
      //   let res = this.ShapeCodeValidator(lShapeCode);
      //   if (res.valid == false) {
      //     alert(res.msg);
      //     args.item[lColumnName] = '';
      //     e.stopPropagation();
      //     e.stopImmediatePropagation();
      //     args.grid.focus();
      //     args.grid.editActiveCell();
      //     return;
      //   }
      // }
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
            lMembQty == null ||
            lMembQty == undefined ||
            lMembQty == '' ||
            lMembQty == ' ' ||
            lMembQty <= 0 
          ) {
            this.toastr.error('Invalid Member Quantity');
            let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
            lItem.BarMemberQty = '';
            this.dataViewCAB.updateItem(lItem.id, lItem);
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
            lEachQty == null ||
            lEachQty == undefined ||
            lEachQty == '' ||
            lEachQty == ' ' ||
            lEachQty <= 0
          ) {
            this.toastr.error('Invalid Each Quantity');
            let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
            lItem.BarEachQty = '';
            this.dataViewCAB.updateItem(lItem.id, lItem);
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
            lEachQty == null ||
            lEachQty == undefined ||
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
          //NEWLY ADDED
          let isTrue = false;
          let lArray = args.grid.getColumns()[4].editor.collection;

          lArray.forEach((x: { value: string }) => {
            if (x.value.toLowerCase() == lEachQty.toLowerCase()) {
              isTrue = true;
            }
          });

          if (!isTrue) {
            this.toastr.error('BarType Invalid');
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
            lEachQty == null ||
            lEachQty == undefined ||
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
          //NEWLY ADDED
          let isTrue = false;
          let lArray = args.grid.getColumns()[5].editor.collection;

          lArray.forEach((x: { value: string }) => {
            if (x.value.toLowerCase() == lEachQty.toLowerCase()) {
              isTrue = true;
            }
          });

          if (!isTrue) {
            this.toastr.error('BarSize Invalid');
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }
        }
        if (lColumnName == 'BarShapeCode') {
          args.grid.getEditorLock().commitCurrentEdit();
          // var lShapeCode = args.grid.getDataItem(lCurrRow).BarShapeCode;
          // if (
          //   lShapeCode == null ||
          //   lShapeCode == '' ||
          //   lShapeCode == undefined ||
          //   lShapeCode == ' '
          // ) {
          //   alert('Invalid shape code entered.(输入的图形码无效.)');
          //   // Remove the invalid entry from the table
          //   let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
          //   lItem.BarShapeCode = '';
          //   this.dataViewCAB.updateItem(lItem.id, lItem);
          //   // Stop the focus from moving right and stay at the current editor
          //   e.stopPropagation();
          //   e.stopImmediatePropagation();
          //   args.grid.focus();
          //   args.grid.editActiveCell();
          //   return;
          // }

          // let res = this.ShapeCodeValidator(lShapeCode);
          // if (res.valid == false) {
          //   alert(res.msg);
          //   // Remove the invalid entry from the table
          //   let lItem = this.templateGrid.slickGrid.getDataItem(lCurrRow);
          //   lItem.BarShapeCode = '';
          //   this.dataViewCAB.updateItem(lItem.id, lItem);

          //   // Stop the focus from moving right and stay at the current editor
          //   e.stopPropagation();
          //   e.stopImmediatePropagation();
          //   args.grid.focus();
          //   args.grid.editActiveCell();
          //   return;
          // }
        }
        if (lColumnName.length == 1) {
          args.grid.getEditorLock().commitCurrentEdit();
          var lParam = args.grid.getDataItem(lCurrRow)[lColumnName];
          if (
            lParam == null ||
            lParam == '' ||
            lParam == undefined ||
            lParam == ' '
          ) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            args.grid.focus();
            args.grid.editActiveCell();
            return;
          }

          /**Set the Parameter Validator */
          // this.isValidCellValue = true;
          // Show Validation on Error Cell Selection

          if (lParam) {
            // Calculate
            //1.Calculate the dependant parameters
            var lValue = lParam;
            if (lValue != undefined) {
              let res: any = this.parameterValidator(args, lValue, lColumnName);
              // { valid: true, msg: null }
              if (res.valid == false) {
                alert(res.msg);
                // this.isValidCellValue = false;

                // If invalid update the cell with an empty string;
                let lItem = this.templateGrid.slickGrid.getDataItem(args.row);
                lItem[lColumnName] = '';
                this.dataViewCAB.updateItem(lItem.id, lItem);

                // Prevent the focus from moving right and stay at the current editor
                args.grid.focus();
                args.grid.editActiveCell();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return;
              } else {
                // Update the cell style/color
                this.UpdateCellStyle(args);
              }
            }
          }
        }
        if (lColumnName == 'Remarks') {
          args.grid.getEditorLock().commitCurrentEdit();
          //args.grid.navigateDown();
          // args.grid.setActiveCell(lCurrRow + 1, 4); // Move to the next row, BarType
          args.grid.setActiveCell(lCurrRow + 1, 2); // Move to the next row, Element Mark
          args.grid.focus();
          if (args.grid.getOptions().editable == true) {
            args.grid.focus();
            args.grid.editActiveCell();
          }
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

    // if ((e.which == 67 || e.which == 99) && e.ctrlKey) {
    //   args.grid.getEditorLock().commitCurrentEdit();
    //   // BarsCopy(args.this.gridIndex);
    //   this.CopyRows();
    // }

    // if ((e.which == 86 || e.which == 118) && e.ctrlKey) {
    //   args.grid.getEditorLock().commitCurrentEdit();
    //   // BarsPaste(args.this.gridIndex);
    //   this.PasteRows();
    // }

    /**Set the Parameter Validator */
    // this.isValidCellValue = true;
    // Show Validation on Error Cell Selection
    if (Name.length == 1) {
      if (
        (e.key == 'ArrowDown' || e.key == 'ArrowUp') &&
        args.grid.getCellEditor()
      ) {
        // Calculate
        //1.Calculate the dependant parameters
        var lValue = args.grid.getCellEditor().getValue();
        if (lValue != undefined) {
          let res: any = this.parameterValidator(args, lValue, Name);
          // { valid: true, msg: null }
          if (res.valid == false) {
            alert(res.msg);
            // this.isValidCellValue = false;

            // If invalid update the cell with an empty string;
            let lItem = this.templateGrid.slickGrid.getDataItem(args.row);
            lItem[Name] = '';
            this.dataViewCAB.updateItem(lItem.id, lItem);

            // Prevent the focus from moving right and stay at the current editor
            args.grid.focus();
            args.grid.editActiveCell();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
          } else {
            // Update the cell style/color
            this.UpdateCellStyle(args);
          }
        }
      }
    }

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

  async grid_onActiveCellChanged(e: any, args: any) {
    this.tempActiveFlag = false;
    // if (!this.isValidCellValue) {
    //   return;
    // }
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
          { label: '50', value: '50' },
        ];
        this.BarSizeList_backup = [
          { label: '13', value: '13' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '32', value: '32' },
          { label: '40', value: '40' },
          { label: '50', value: '50' },
        ];

        // lItem.BarSize.editor.collection = this.BarSizeList;
      } else if (lItem.BarType == 'H' || lItem.BarType == 'C') {
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
          { label: '50', value: '50' },
        ];
        this.BarSizeList_backup = [
          { label: '8', value: '8' },
          { label: '10', value: '10' },
          { label: '13', value: '13' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '28', value: '28' },
          { label: '32', value: '32' },
          { label: '40', value: '40' },
          { label: '50', value: '50' },
        ];

        // lItem.BarSize.editor.collection = this.BarSizeList;
      } else if (lItem.BarType == 'E') {
        // this.BarSizeList = this.convertStrToObj('13,16,20,25,32,40,50');
        this.BarSizeList = [
          { label: '10', value: '10' },
          { label: '12', value: '12' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '32', value: '32' },
        ];
        this.BarSizeList_backup = [
          { label: '10', value: '10' },
          { label: '12', value: '12' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '25', value: '25' },
          { label: '32', value: '32' },
        ];

        // lItem.BarSize.editor.collection = this.BarSizeList;
      } else if (lItem.BarType == 'N') {
        // this.BarSizeList = this.convertStrToObj('13,16,20,25,32,40,50');
        this.BarSizeList = [
          { label: '12', value: '12' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '24', value: '24' },
          { label: '28', value: '28' },
          { label: '32', value: '32' },
        ];
        this.BarSizeList_backup = [
          { label: '12', value: '12' },
          { label: '16', value: '16' },
          { label: '20', value: '20' },
          { label: '24', value: '24' },
          { label: '28', value: '28' },
          { label: '32', value: '32' },
        ];

        // lItem.BarSize.editor.collection = this.BarSizeList;
      } else if (lItem.BarType == 'R') {
        // this.BarSizeList = this.convertStrToObj('13,16,20,25,32,40,50');
        this.BarSizeList = [
          { label: '8', value: '8' },
          { label: '10', value: '10' },
          { label: '13', value: '13' },
          { label: '16', value: '16' },
        ];
        this.BarSizeList_backup = [
          { label: '8', value: '8' },
          { label: '10', value: '10' },
          { label: '13', value: '13' },
          { label: '16', value: '16' },
        ];

        // lItem.BarSize.editor.collection = this.BarSizeList;
      } else if (lItem.BarType == 'D') {
        // this.BarSizeList = this.convertStrToObj('13,16,20,25,32,40,50');
        this.BarSizeList = [
          { label: '12', value: '12' },
          { label: '16', value: '16' },
        ];
        this.BarSizeList_backup = [
          { label: '12', value: '12' },
          { label: '16', value: '16' },
        ];

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

    // if (lColumnName == 'ElementMark') {
    //   let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
    //   let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
    //   lItem.ElementMark = lItem.ElementMark
    //     ? lItem.ElementMark.toUpperCase()
    //     : '';
    //   this.dataViewCAB.updateItem(lItem.id, lItem);
    // }

    let grid = args.grid;
    if (grid.getDataItem(args.row) != null) {
      var lShapeCode = grid.getDataItem(args.row).BarShapeCode;
      if (lShapeCode != null && lShapeCode != '') {
        if (lShapeCode.length < 3) lShapeCode = '0' + lShapeCode;
        if (lShapeCode != this.gShapeCode) {
          await this.loadShapeInfo(lShapeCode, this.gridIndex, args.row);
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
          this.gInvalidRowSelected = true;
          if (this.gSelectedRows.length == 0) {
            this.gSelectedRows = args.grid.getSelectedRows();
          }

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
        args.grid.focus();
        args.grid.editActiveCell();
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

    /**
     * During multiple row selection , previous rows are getting unselceted when an invalid cell is Seleted with a shapecode
     * which is not the same as the previous selected row shapecode.
     * DATED - 18/10/2024
     */
    if (this.gInvalidRowSelected) {
      let lRows = this.gSelectedRows;
      if (lRows) {
        args.grid.invalidate();
        args.grid.render();
        args.grid.setSelectedRows(lRows);
      }
      this.gInvalidRowSelected = false;
      this.gSelectedRows = [];
    }

    /**Set the Parameter Validator */
    // this.isValidCellValue = true;
    // Show Validation on Error Cell Selection
    if (lColumnName.length == 1) {
      // Calculate
      //1.Calculate the dependant parameters
      let lActiveCell = args.grid.getActiveCell();
      var lValue = args.grid.getDataItem(lActiveCell.row)[lColumnName];

      setTimeout(() => {
        // Line commented as it is causing cell to lose focsus after entering shapecode.
        // this.templateGrid.resizerService.resizeGrid();

        // Validate the cell value
        if (lValue != undefined && lValue != '') {
          let res: any = this.parameterValidator(args, lValue, lColumnName);
          // { valid: true, msg: null }
          if (res.valid == false) {
            alert(res.msg);
            // this.isValidCellValue = false;

            // // If invalid update the cell with an empty string;
            // let lItem = this.templateGrid.slickGrid.getDataItem(args.row);
            // lItem[lColumnName] = '';
            // this.dataViewCAB.updateItem(lItem.id, lItem);

            // Prevent the focus from moving right and stay at the current editor
            args.grid.focus();
            args.grid.editActiveCell();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
          } else {
            // Update the cell style/color
            this.UpdateCellStyle(args);
          }
          // If invalid update the cell with an empty string;
          // PinSize not getting updated to the front
          let lItem = this.templateGrid.slickGrid.getDataItem(args.row);
          this.dataViewCAB.updateItem(lItem.id, lItem);
          // Prevent the focus from moving right and stay at the current editor
          // args.grid.focus();
          // args.grid.editActiveCell();
        }
      }, 10);
    }

    args.grid.focus();
    if (args.grid.getOptions().editable == true) {
      if (
        args.grid.getDataItem(args.row).BarSTD == undefined ||
        args.grid.getDataItem(args.row).BarSTD == null ||
        args.grid.getDataItem(args.row).BarSTD == false
      ) {
        /**
         * BarSize column cell value disappearing whne selecting the cell.
         * Date: 21-06-2024
         */
        if (lColumnName == 'BarSize') {
          if (args.grid.getDataItem(args.row).BarSize) {
            args.grid.getDataItem(args.row).BarSize = args.grid
              .getDataItem(args.row)
              .BarSize.toString();
          }
          // if (args.grid.getCellEditor().getValue() == "" || args.grid.getCellEditor().getValue() == null) {
          //   let lEditorValue = args.grid.getDataItem(args.row).BarSize;
          //   args.grid.getCellEditor().setValue(lEditorValue);
          // }
        }
        args.grid.editActiveCell();
      } else {
        if (
          lColumnName == 'BarMemberQty' ||
          lColumnName == 'BarEachQty' ||
          lColumnName == 'BarShapeCode' ||
          (lColumnName.length == 1 && lColumnName >= 'A' && lColumnName <= 'Z')
        ) {
          args.grid.navigateRight();
          args.grid.focus();
          args.grid.editActiveCell();
        } else {
          args.grid.editActiveCell();
        }
      }
    }

    // this.dataViewCAB.getItemMetadata = this.metadata(
    //   this.dataViewCAB.getItemMetadata
    // );

    if (lColumnName == 'Cancelled' || lColumnName == 'BarSTD') {
      if (args.grid.getCellEditor()) {
        args.grid.invalidate();
        args.grid.render();
        args.grid.editActiveCell();
      } else {
        args.grid.invalidate();
        args.grid.render();
      }
    }
    // this.dataViewCAB.beginUpdate();
    // let tItem = args.grid.getDataItem(args.row);
    // this.dataViewCAB.updateItem(tItem.id, tItem);
    // this.dataViewCAB.endUpdate();

    this.focusOnCellEditor(args);
    this.gEnteredShapeCode = undefined;
    return true;
  }
  dblClickHandler!: (event: Event) => void;
  clickHandler!: (event: Event) => void;

  focusOnCellEditor(args: any) {
    const editor = args.grid.getCellEditor(); // Get the cell editor
    if (editor) {
      const editorInput = editor._input || editor.input || editor.$input; // Get the input element (depends on the editor)
      if (editorInput && editorInput.focus) {
        editorInput.focus(); // Set focus to the editor's input
      }
    }
    let lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];
    if (lColumnName == 'BarShapeCode') {
      const elements = document.getElementsByClassName('autocomplete');
      const rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      const lItem = this.templateGrid.slickGrid.getDataItem(rowNum);

      // If there's no handler yet, define and store it
      if (!this.dblClickHandler) {
        this.dblClickHandler = () => {
          this.onDoubleClick(rowNum, lItem); // Call your handler
        };
      }
      const element = elements[0];

      // Remove any existing 'dblclick' and 'click' event listeners
      element.removeEventListener('dblclick', this.dblClickHandler);

      // Add the new 'dblclick' and 'click' event listeners
      element.addEventListener('dblclick', this.dblClickHandler);
    }
    if (lColumnName == 'BarSize' || lColumnName == 'BarType') {
      const elements = document.getElementsByClassName('autocomplete');
      const rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      const lItem = this.templateGrid.slickGrid.getDataItem(rowNum);

      // If there's no single-click handler yet, define and store it
      if (!this.clickHandler) {
        this.clickHandler = () => {
          this.onSingleClick(args, rowNum, lItem); // Call your single-click handler
        };
      }

      const element = elements[0];
      // Remove any existing 'dblclick' and 'click' event listeners
      element.removeEventListener('click', this.clickHandler);

      // Add the new 'dblclick' and 'click' event listeners
      element.addEventListener('click', this.clickHandler);
    }
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
  async grid_onBeforeEditCell(e: any, args: any) {
    // if(args.grid.getCellEditor()){
    //   args.grid.getEditorLock().commitCurrentEdit();
    // }
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
      if (this.gCustomerBar == 'D') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'D', label: 'D' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",E") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",E";
        // }
      }

      if (this.gCustomerBar == 'DE' || this.gCustomerBar == 'ED') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'E', label: 'E' },
          { value: 'D', label: 'D' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",C,E") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",C,E";
        // }
      }
      if (this.gCustomerBar == 'DN' || this.gCustomerBar == 'ND') {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'D', label: 'D' },
          { value: 'N', label: 'N' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",C,N") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",C,N";
        // }
      }
      if (
        this.gCustomerBar == 'DEN' ||
        this.gCustomerBar == 'DNE' ||
        this.gCustomerBar == 'NDE' ||
        this.gCustomerBar == 'NED' ||
        this.gCustomerBar == 'EDN' ||
        this.gCustomerBar == 'END'
      ) {
        args.grid.getColumns()[args.cell].editor.collection = [
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' },
          { value: 'N', label: 'N' },
        ];

        // if (args.grid.getColumns()[args.cell].editorOptions.options != ",C,E,N") {
        //   args.grid.getColumns()[args.cell].editorOptions.options = ",C,E,N";
        // }
      }

      this.BarTypeList = args.grid.getColumns()[args.cell].editor.collection;
      this.BarTypeList_backup =
        args.grid.getColumns()[args.cell].editor.collection;
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

    setTimeout(() => {
      this.focusOnCellEditor(args);
    }, 1000);
  }

  shapeCodeUpdated: boolean = false;
  gEnteredShapeCode: any;

  // Flag to control whether onActiveCellChanged should execute
  async grid_onCellChange(e: any, args: any) {
    this.shapeCodeUpdated = false;

    // if (!this.isValidCellValue) {
    //   return;
    // }
    // this.tempActiveFlag = true;
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

    /**
     * Update the cell color of Cancelled or SB rows after selecting the checkbox and clicking at any other cell.
     */
    if (lColumnName == 'Cancelled' || lColumnName == 'BarSTD') {
      if (
        args.grid.getDataItem(args.row).Cancelled ||
        args.grid.getDataItem(args.row).BarSTD
      ) {
        // this.dataViewCAB.getItemMetadata = this.metadata(
        //   this.dataViewCAB.getItemMetadata
        // );
        args.grid.invalidate();
        args.grid.render();
      }
    }

    if (lColumnName == 'BarMark') {
      let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
      let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
      lItem.BarMark = lItem.BarMark ? lItem.BarMark.toUpperCase() : '';
      this.dataViewCAB.updateItem(lItem.id, lItem);
    }

    // if (lColumnName == 'ElementMark') {
    //   let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
    //   let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
    //   lItem.ElementMark = lItem.ElementMark
    //     ? lItem.ElementMark.toUpperCase()
    //     : '';
    //   this.dataViewCAB.updateItem(lItem.id, lItem);
    // }

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

    /**
     * Manually updating the shapecode value by storing the entered shapecode in a local variable and re-assigning it.
     */
    if (this.gEnteredShapeCode) {
      let lFlag: boolean = this.shapeCodeList_backup.some(
        (item) =>
          item.value === this.gEnteredShapeCode.value &&
          item.label === this.gEnteredShapeCode.label
      );
      if (lFlag) {
        let tempShapeCode = args.item['BarShapeCode'];
        if (tempShapeCode != this.gEnteredShapeCode) {
          args.item['BarShapeCode'] = this.gEnteredShapeCode;
          this.gEnteredShapeCode = undefined;
        }
      }
    }

    if (lColumnName == 'BarShapeCode') {
      var lShapeCode = args.item['BarShapeCode'];
      console.log('lShapeCode', lShapeCode);
      // if (lShapeCode === '') {
      //   lShapeCode = 'INVALID';
      // } else {
      //   // lShapeCode = lShapeCode.value;
      // }  
      if (lShapeCode?.value){
        lShapeCode = lShapeCode.value;
      }
      if (
        lShapeCode == null ||
        lShapeCode == '' ||
        lShapeCode == undefined ||
        lShapeCode == ' '
      ) {
        alert('Invalid shape code entered.(输入的图形码无效.)');
        // Remove the invalid entry from the table
        let lItem = args.item;
        lItem.BarShapeCode = '';
        this.dataViewCAB.updateItem(lItem.id, lItem);
        // Stop the focus from moving right and stay at the current editor
        e.stopPropagation();
        e.stopImmediatePropagation();
        args.grid.focus();
        args.grid.editActiveCell();
        return;
      }
      let res = this.ShapeCodeValidator(lShapeCode);
      if (res.valid == false) {
        alert(res.msg);
        args.item[lColumnName] = '';
        e.stopPropagation();
        e.stopImmediatePropagation();
        args.grid.focus();
        args.grid.editActiveCell();
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

        console.log('gShapeCode =>', this.gShapeCode);
        if (lShapeCode != this.gShapeCode) {
          this.tempActiveFlag = true;
          await this.loadShapeInfo(lShapeCode, this.gridIndex, args.row);
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
            let lTotalDed: any = await this.creepDeduction(
              lMaxLength,
              args.item
            );
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
        } else if (
          lTotalLength == null &&
          args.item['A'] != null &&
          args.item['A'] > 0
        ) {
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
            let lTotalDed: any = await this.creepDeduction(
              lMaxLength,
              args.item
            );
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
      } else {
        args.item['BarMemberQty'] = args.item['BarMemberQty']
          ? args.item['BarMemberQty']
          : '';
        args.item['BarEachQty'] = args.item['BarEachQty']
          ? args.item['BarEachQty']
          : '';
        args.item['BarTotalQty'] = args.item['BarTotalQty']
          ? args.item['BarTotalQty']
          : '';
        args.item['BarWeight'] = args.item['BarWeight']
          ? args.item['BarWeight']
          : '';
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

      if (lColumnName == 'BarMemberQty' && lMQty < 0 ) {
        this.toastr.error("Quantity cannot be less than 0.");
        args.item[lColumnName] = '';
        e.stopPropagation();
        e.stopImmediatePropagation();
        args.grid.focus();
        args.grid.editActiveCell();
        return;
      }
      if (lColumnName == 'BarEachQty' && lEQty < 0 ) {
        this.toastr.error("Quantity cannot be less than 0.");
        args.item[lColumnName] = '';
        e.stopPropagation();
        e.stopImmediatePropagation();
        args.grid.focus();
        args.grid.editActiveCell();
        return;
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

    // this.isValidCellValue = true;
    if (lColumnName.length == 1) {
      // Calculate
      //1.Calculate the dependant parameters
      var lValue = args.item[lColumnName];

      if (lValue < 0) {
        this.toastr.error("Parameter cannot be less than 0.");
        args.item[lColumnName] = '';
        e.stopPropagation();
        e.stopImmediatePropagation();
        args.grid.focus();
        args.grid.editActiveCell();
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
        if (lValue?.toString().indexOf('-') > 0) {
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

      if (lValidTransport != 9) {
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
      }

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
        let lTotalDed: any = await this.creepDeduction(lMaxLength, args.item);
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
    if (lColumnName == 'BarShapeCode' && args.item['BarSize'] != null) {
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
    if (args.grid.getOptions().editable == true) {
      if (lColumnName == 'BarShapeCode') {
        if (this.tempActiveFlag == false) {
          if (
            this.gLastSelectedShapeCode !=
            args.grid.getDataItem(args.row).BarShapeCode
          ) {
            if (this.gLastSelectedShapeCode != 'INITIAL') {
              args.grid.focus();
              args.grid.editActiveCell();
            }
          }
        }
      }
    }
    if (args.grid.getDataItem(args.row).BarShapeCode) {
      this.gLastSelectedShapeCode = args.grid.getDataItem(
        args.row
      ).BarShapeCode;
    }
  }

  gLastSelectedShapeCode: any = 'INITIAL';

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
      if (args.item == undefined) {
        args.item = {
          Cancelled: false,
        };
      }
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
      item.CreateBy = this.loginService.GetGroupName();
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
          // var lBarMark1 = lBarMark.replace(/\d+$/, function (n: any) {
          //   return ++n;
          // });
          // var lBarMark1 = this.incrementId(lBarMark);
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
    // lItem.ElementMark = lItem.ElementMark
    //   ? lItem.ElementMark.toUpperCase()
    //   : '';
    this.dataViewCAB.updateItem(lItem.id, lItem);
  }

  async grid_onSelectedRowsChanged(e: any, args: any) {
    let dataViewArray = this.dataViewCAB;
    let gridArray = this.templateGrid.slickGrid;

    this.getShapeFinderReset(this.gridIndex);
    if (args.rows.length > 0) {
      if (args.rows[0] != this.barRowIndex[this.gridIndex]) {
        await this.SaveBarDetails(
          this.gridIndex,
          this.barRowIndex[this.gridIndex]
        ); //Tab#, Row#


        // Update teh BBSData_Local list
        let lObj = {
          lBBSID: this.BBSId,
          lBBSData: this.dataViewCAB.getItems(),
        };

        let lIndex = this.BBSData_Local.findIndex(
          (x) => x.lBBSID === lObj.lBBSID
        );
        if (lIndex != -1) {
          this.BBSData_Local[lIndex] = lObj;
        } else {
          this.BBSData_Local.push(lObj);
        }

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

      let lEditor = args.grid.getCellEditor();
      if (!lEditor) {
        args.grid.focus();
        if (args.grid.getOptions().editable == true) {
          args.grid.editActiveCell();
        }
        // Commented by Kunal
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

  CheckForVariance(e: any, args: any) {}
  grid_onContextMenu(e: any, args: any) {
    e.preventDefault();
    var cell = args.grid.getCellFromEvent(e);

    // let CellName: string = args.grid.getColumns()[args.grid.getCellFromEvent(e).cell].id

    this.CheckForVariance(e, args);
    let RowNo = args.grid.getCellFromEvent(e).row;

    if (args.grid.getDataItem(RowNo) != undefined) {
      if (args.grid.getDataItem(RowNo).shapeParameters != undefined) {
        let ShapeParams = args.grid
          .getDataItem(RowNo)
          .shapeParameters.split(',');

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

    let x = this.sideMenuVisible == 2 ? 386 : 146;
    $('#contextMenuCAB')
      .data('row', cell.row)
      .css('top', e.clientY - x)
      .css('left', e.clientX - 50)
      .show();

    // $('#contextMenuCAB')
    //   .data('row', cell.row)
    //   .css('top', e.clientY - 50)
    //   .css('left', e.clientX - 50)
    //   .show();

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

  async creepDeduction(lMinLength: any, lData: any) {
    return await this.getCreepDedution(lMinLength, lData);
  }

  getShapeFinderReset(pGridIndex: any) {
    //document.getElementById("shape_code_" + pGridIndex).value = "";
    //document.getElementById("shape_category_" + pGridIndex).value = "";
    //document.getElementById("bt_shape_code_" + pGridIndex).value = "";
    //document.getElementById("bt_shape_category_" + pGridIndex).value = "";
  }

  async loadShapeInfo(pShapeCode: any, pGridID: any, pRowNo: any) {
    let tGrid = this.templateGrid.slickGrid;

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

        let tempShape = this.templateGrid.slickGrid.getActiveCell();
        // // Commented by Kunal
        // if (tempShape) {
        //   this.templateGrid.slickGrid.focus();
        //   this.templateGrid.slickGrid.setActiveCell(
        //     tempShape.row,
        //     tempShape.cell
        //   );
        // }
      } else {
        this.showShapeImage = false;
        $('#rightShapeImage-' + pGridID).hide();
        $('#btmShapeImage-' + pGridID).hide();

        // let tempShape = this.templateGrid.slickGrid.getActiveCell();
        // Commented by Kunal
        // if (tempShape) {
        //   this.templateGrid.slickGrid.focus();
        //   this.templateGrid.slickGrid.setActiveCell(
        //     tempShape.row,
        //     // tempShape.cell
        //     tempShape.cell + 1 // commented by Kunal
        //   );
        // }
      }
    }
  }
  convImg(buffer: any) {
    if (buffer != null) {
      var mime;
      var a = new Uint8Array(buffer);
      var nb = a.length;
      if (nb < 4) return null;
      var b0 = a[0];
      var b1 = a[1];
      var b2 = a[2];
      var b3 = a[3];
      if (b0 == 0x89 && b1 == 0x50 && b2 == 0x4e && b3 == 0x47)
        mime = 'image/png';
      else if (b0 == 0xff && b1 == 0xd8) mime = 'image/jpeg';
      else if (b0 == 0x47 && b1 == 0x49 && b2 == 0x46) mime = 'image/gif';
      else return null;
      var binary = '';
      for (var i = 0; i < nb; i++) binary += String.fromCharCode(a[i]);
      var base64 = window.btoa(binary);
      return 'data:' + mime + ';base64,' + base64;
    } else {
      return 'data:image/png;base64,';
    }
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

      let canImg: HTMLCanvasElement = this.myCanvas1.nativeElement;
      this.drawShape(canImg, lItem, lParaA, lPosXA, lPosYA);
      let canImg1: HTMLCanvasElement = this.Canvas.nativeElement;
      this.drawShape(canImg1, lItem, lParaA, lPosXA, lPosYA);
      // var canImg: any = document.getElementById("rightShapeImage-" + pGridID);
      // var canImg: HTMLCanvasElement = this.myCanvas1.nativeElement;

      // if (this.sideMenuVisible == 2) {
      //   canImg = this.Canvas.nativeElement;
      // }

      // var ctxImg: any = canImg.getContext('2d');
      // ctxImg.clearRect(0, 0, canImg.width, canImg.height);

      // var imgObj = new Image();
      // imgObj.onload = function () {
      //   ctxImg.drawImage(
      //     imgObj,
      //     0,
      //     0,
      //     imgObj.width,
      //     imgObj.height,
      //     0,
      //     0,
      //     canImg.width,
      //     canImg.height
      //   );

      //   var lRatioX = canImg.width / imgObj.width;
      //   var lRatioY = canImg.height / imgObj.height;

      //   // if (this.gShapeParameters != null) {
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
      //         ctxImg.font = 'Bold 12px verdana';
      //         ctxImg.fillStyle = '#000000';
      //         ctxImg.strokeStyle = '#000000';
      //         ctxImg.lineWidth = 1;
      //         ctxImg.fillText(
      //           lText,
      //           lRatioX * (parseInt(lPosXA[i]) + 4),
      //           lRatioY * (parseInt(lPosYA[i]) + 16)
      //         );
      //       }
      //     }
      //   }
      // };
      // imgObj.src = this.gShapeImage;

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

  drawShape(
    canImg: HTMLCanvasElement,
    lItem: any,
    lParaA: any,
    lPosXA: any,
    lPosYA: any
  ) {
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
    setTimeout(() => {
      // Line commented as it is causing cell to lose focsus after entering shapecode.
      // this.templateGrid.resizerService.resizeGrid();
    }, 300);
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

  async checkBBSNo() {
    var lDataLen = this.templateGrid.slickGrid.getDataLength();
    if (lDataLen > 0) {
      this.highlightBBS(0, 0);

      // TEMPORARY
      var lStatus = this.OrderStatus; // 'Created'; //document.getElementById("order_status").value;

      if (
        lStatus != 'New' &&
        lStatus != 'Reserved' &&
        lStatus != 'Created*' &&
        lStatus != 'Created' &&
        (lStatus != 'Sent' || this.gOrderSubmission != 'Yes')
      ) {
        return;
      }

      var lBBSNos = ' ';
      for (var i = 0; i < lDataLen; i++) {
        if (lBBSNos == ' ')
          lBBSNos = this.templateGrid.slickGrid.getDataItem(i).BBSNo;
        else
          lBBSNos =
            lBBSNos + ',' + this.templateGrid.slickGrid.getDataItem(i).BBSNo;
      }
      let lDBBSNos: any = await this.checkDBBBSNo(lBBSNos);
      if (lDBBSNos.length > 0) {
        var lRowNos = ' ';
        if (lDBBSNos.indexOf(',') >= 0) {
          let laDBBSNos = lDBBSNos.split(',');
          for (var i = 0; i < lDataLen; i++) {
            for (var j = 0; j < laDBBSNos.length; j++) {
              if (
                this.templateGrid.slickGrid.getDataItem(i).BBSNo == laDBBSNos[j]
              ) {
                if (lRowNos == ' ') lRowNos = i.toString();
                else lRowNos = lRowNos + ',' + i.toString();
                break;
              }
            }
          }
        } else {
          for (var i = 0; i < lDataLen; i++) {
            if (lDBBSNos == this.templateGrid.slickGrid.getDataItem(i).BBSNo) {
              if (lRowNos == ' ') lRowNos = i.toString();
              else lRowNos = lRowNos + ',' + i.toString();
              break;
            }
          }
        }
        this.highlightBBS(1, lRowNos);
      } else {
        var lRowNos = ' ';
        for (var i = 0; i < lDataLen; i++) {
          for (var j = i + 1; j < lDataLen; j++) {
            if (
              this.templateGrid.slickGrid.getDataItem(j).BBSNo ==
              this.templateGrid.slickGrid.getDataItem(i).BBSNo
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

  highlightBBS(pInd: any, pRowNos: any) {
    if (pInd == 0) {
      this.templateGrid.slickGrid.removeCellCssStyles('bbs_highlight');
    } else {
      if (pRowNos.length > 0) {
        let lClass: any = {};
        let laRows = '';
        if (pRowNos.indexOf(',') > 0) {
          let laRows = pRowNos.split(',');
          for (var i = 0; i < laRows.length; i++) {
            lClass[laRows[i]] = { BBSNo: 'highlighted' };
          }
        } else {
          lClass[pRowNos] = { BBSNo: 'highlighted' };
        }
        this.templateGrid.slickGrid.setCellCssStyles('bbs_highlight', lClass);
      }
    }
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

  async ReloadOrderDetails() {
    this.GetBBSOrder(this.CustomerCode, this.ProjectCode, this.JobID);
    this.getOrderDetailsCAB(this.CustomerCode, this.ProjectCode, this.JobID);
  }

  async ReloadSubMenu() {
    if (this.BBSId) {
      // Only run the following function if BBSId has some value.
      await this.GetTableData(
        this.CustomerCode,
        this.ProjectCode,
        this.JobID,
        this.BBSId
      );
    }

    // setTimeout(() => {
    //   // Code to be executed after the delay
    //   this.UpdateBBS()
    //   console.log('Timeout executed after 2000 milliseconds');
    // }, 2000);
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
        let obj: SaveBarDetailsModel = {
          CustomerCode: lItem.CustomerCode ? lItem.CustomerCode.toString() : '',
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
          BarShapeCode: lItem.BarShapeCode ? lItem.BarShapeCode.toString() : '',
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
          shapeParType: lItem.shapeParType ? lItem.shapeParType.toString() : '',
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
          CreateBy: lItem.CreateBy ? lItem.CreateBy : '',
          UpdateBy: this.loginService.GetGroupName(),
        };

        let response: any = await this.saveBarDetails_POST(obj);
        // await this.ReloadSubMenu();
        // await this.RelaodSubMenu_new();
        let gridArray = this.templateGrid.slickGrid;

        if (response == false) {
          alert('Connection error, please check your internet connection.');
        } else {
          if (response.success == true) {
            console.log('SAVE Bar Success');
            if (response.respDoubleCapture != null) {
              // let lClass: any = {};
              /**
               * ODOS Enhancement: Highlight all different values in the grid for Double Capture.
               */
              var lClass = gridArray.getCellCssStyles('double_highlight');
              gridArray.removeCellCssStyles('double_highlight');
              if (lClass == null) {
                lClass = {};
              }
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
              console.log('lClass -> ', lClass);
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

  isIEPreVer9() {
    let v: any = navigator.appVersion.match(/MSIE ([\d.]+)/i);
    return v ? v[1] < 9 : false;
  }

  async SaveJobAdvice() {
    var lStatus = this.OrderStatus; // 'Created';// document.getElementById("order_status").value;
    // if (this.gJobAdviceChanged > 0 && (lStatus == null || lStatus == "" || lStatus == "New" || lStatus == "Reserved" || lStatus == "Created" || lStatus == "Created*")) {
    if (
      lStatus == null ||
      lStatus == '' ||
      lStatus == 'New' ||
      lStatus == 'Reserved' ||
      lStatus == 'Created' ||
      lStatus == 'Created*'
    ) {
      var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
      var lProjectCode = this.ProjectCode; // document.getElementById("ProjectCode").value;
      //var lRequiredDate = document.getElementById("required_date").value;
      //var lOrder =  //  document.getElementById("OrderNo");
      let lJobID = this.JobID; // parseInt(lOrder.value);

      if (lCustomerCode == '') {
        alert('Please assign customer to the user before order creation.');
        return;
      }
      if (lProjectCode == '') {
        alert('Please assign Project to the user before order creation.');
        return;
      }

      let obj: SaveJobAdvice_CAB = this.JobAdviceData;
      obj.ProjectStage = 'TYP';
      obj.BBSStandard = this.BBSStandard;
      obj.CouplerType = this.CouplerType;
      obj.TransportLimit = this.TransportMode;
      obj.PONumber = obj.PONumber ? obj.PONumber : '';

      let lResponse = await this.GetBBSOrderA(
        this.CustomerCode,
        this.ProjectCode,
        this.JobID
      );
      if (!lResponse) {
        alert('Connection error, please check your internet connection.');
        return;
      }
      let lCABWeight: any = 0;
      let lSTDWeight: any = 0;
      let lWeight: any = 0;
      for (let i = 0; i < lResponse.length; i++) {
        lCABWeight = lCABWeight + lResponse[i].BBSOrderCABWT;
        lSTDWeight = lSTDWeight + lResponse[i].BBSOrderSTDWT;
        lWeight = lWeight + lResponse[i].BBSTotalWT;
        // lWeight = lWeight + lResponse[i].BBSOrderWT;
      }

      // lWeight = (this.totalTotalWeight - this.totalCancelledWT).toFixed(3);
      obj.TotalCABWeight = Number(lCABWeight);
      obj.TotalSTDWeight = Number(lSTDWeight);
      obj.TotalWeight = Number(lWeight);

      let response: any = await this.SaveJobAdvice_POST(obj);

      if (response == false) {
        alert('Connection error, please check your internet connection.');
      } else {
        if (response == 0) {
          alert('Saving job advice error. Please try later.');
        } else {
          this.TotalCABWeight = Number(Number(lCABWeight).toFixed(3));
          this.TotalSTDWeight = Number(Number(lSTDWeight).toFixed(3));
          this.TotalWeight = Number(Number(lWeight).toFixed(3));
          //
          //var lJobID1 = parseInt(lOrder.value);
          //if (lJobID1 == 0) {
          //    lJobID1 = response;
          //    lOrder.getElementsByTagName('option')[0].value = lJobID1;
          //    lOrder.getElementsByTagName('option')[0].text = lJobID1 + " PO:" + document.getElementById("po_number").value + " RD:" + document.getElementById("required_date").value + " Status:" + document.getElementById("order_status").value;
          //}
          this.gJobAdviceChanged = 0;
        }
      }
    }
  }
  async SaveJobAdvice_POST(obj: SaveJobAdvice_CAB) {
    if (this.NON_Editable) {
      return;
    }
    return await this.SaveJobAdvice_CAB_POST(obj);
  }

  // async saveBarDetails(item: any) {
  //   return await this.saveBarDetails_POST(item)
  // }

  async saveBarDetails_POST(item: any): Promise<any> {
    try {
      const data = await this.orderService.SaveBarDetails(item).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async checkDBBBSNo(BBSNo: string): Promise<any> {
    try {
      const data = await this.orderService
        .check_BBSNo(this.CustomerCode, this.ProjectCode, this.JobID, BBSNo)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
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

  CusShapeEditor(args: any) {
    let $input: any;
    let defaultValue: any;
    let scope = this;
    let lMax = 3;

    // this.init = function () {
    if (args.column.maxlength) {
      lMax = args.column.maxlength;
    } else {
      lMax = 8;
    }

    $input = $(
      "<INPUT id='ShapeCodeEditor' type=text class='editor-text' maxlength='" +
        lMax +
        "' />"
    )
      .appendTo(args.container)
      //COMMENTED FOR NOW
      // .bind("keydown.nav", function (e: any) {
      //   if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
      //     e.stopImmediatePropagation();
      //   }
      // })
      .dblclick(() => {
        this.getShapeImageList('Most Common Shapes');
        // getShapeImageList(this.GetGridIndex(args), "Most Common Shapes");
      })
      .keypress(function (e: any) {
        var charInput = e.keyCode;
        if (charInput >= 97 && charInput <= 122) {
          // lowercase
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            // no modifier key
            var newChar = charInput - 32;
            var start = e.target.selectionStart;
            var end = e.target.selectionEnd;
            e.target.value =
              e.target.value.substring(0, start) +
              String.fromCharCode(newChar) +
              e.target.value.substring(end);
            e.target.setSelectionRange(start + 1, start + 1);
            e.preventDefault();
          }
        }
      })
      .focus()
      .select();
    // };

    // this.destroy = function () {
    //   $input.remove();
    // };

    // this.focus = function () {
    //   $input.focus();
    // };

    // this.getValue = function () {
    //   return $input.val();
    // };

    // this.setValue = function (val) {
    //   $input.val(val);
    // };

    // this.loadValue = function (item) {
    //   defaultValue = item[args.column.field] || "";
    //   $input.val(defaultValue);
    //   $input[0].defaultValue = defaultValue;
    //   $input.select();
    // };

    // this.serializeValue = function () {
    //   return $input.val();
    // };

    // this.applyValue = function (item, state) {
    //   item[args.column.field] = state;
    // };

    // this.isValueChanged = function () {
    //   return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    // };

    // this.validate = function () {
    //   if (args.column.validator) {
    //     var validationResults = args.column.validator($input.val());
    //     if (!validationResults.valid) {
    //       return validationResults;
    //     }
    //   }

    //   return {
    //     valid: true,
    //     msg: null
    //   };
    // };
  }

  removeDuplicates(array: any[]): any[] {
    return array.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  getShapeCodeList(
    CustomerCode: string,
    ProjectCode: string,
    CouplerType: string
  ) {
    this.orderService
      .getShapeCodeList(CustomerCode, ProjectCode, CouplerType)
      .subscribe({
        next: (response) => {
          console.log('shapeCodeList', response);
          if (response) {
            this.gShapeCodeList = '';
            this.ShapeCatList = [];
            this.shapeCodeList = [];
            this.shapeCodeList_backup = [];
            for (var i = 0; i < response.length; i++) {
              this.gShapeCodeList =
                this.gShapeCodeList + ',' + response[i].shapeCode;
              this.ShapeCatList.push(response[i].shapeCategory);
              let obj = {
                value: response[i].shapeCode,
                label: response[i].shapeCode,
              };
              this.shapeCodeList.push(obj);
              this.shapeCodeList_backup.push(obj);
            }
            // gShapeCategory = gShapeCategory + "," + response[i].shapeCategory;
          }

          console.log('this.shapeCodeList', this.shapeCodeList);

          this.ShapeCatList = [...new Set(this.ShapeCatList.sort())];
          // if (this.CouplerType != 'No Coupler') {
          //   this.ShapeCatList.push(this.CouplerType);
          // }
          this.ShapeCatList.push('Most Common Shapes');

          let lCouplerType = this.CouplerType;
          if (lCouplerType == 'N-Splice') {
            this.ShapeCatList.push('N-Splice Coupler');
          }
          if (lCouplerType == 'E-Splice(N)' || lCouplerType == 'E-Splice(S)') {
            this.ShapeCatList.push('E-Splice Coupler');
          }

          this.ShapeCatList.push('All Shapes');

          this.SortShapeCodeList();

          // let temp: any[] = [];
          // response.forEach((element: { shapeCategory: any; }) => temp.push(element.shapeCategory))

          // this.ShapeCatList = temp;

          // this.shapeCodeList = response;
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }
  SortShapeCodeList() {
    this.shapeCodeList.sort((a, b) => {
      const valueA = isNaN(Number(a.value)) ? a.value : Number(a.value);
      const valueB = isNaN(Number(b.value)) ? b.value : Number(b.value);

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0;
    });

    console.log('Sorted shapeCodeList', this.shapeCodeList);
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
      if(pItem['BarTotalQty'] > 0){
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
    // if (pGridIndex > 1) {
    var lGridIndex = pGridIndex;
    if (dataViewArray.getLength() > 0) {
      var lSubCABWT = 0;
      var lSubSTDWT = 0;
      var lSubCancelledWT = 0;
      var lSubOrderWT = 0;
      var lSubTotalWT = 0;
      var lSubOrderQty = 0;
      var lSubCouplerOrderQty = 0;
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
          ) {
            lSubOrderQty = lSubOrderQty + parseFloat(lItem.BarTotalQty);
            // Condition to check if its a Coupler ShapeCode.
            if (this.isCouplerBarQty(lItem.BarShapeCode)) {
              if (this.isDoubleCoupler(lItem.BarShapeCode)) {
                lSubCouplerOrderQty =
                  lSubCouplerOrderQty + 2 * parseFloat(lItem.BarTotalQty);
              } else {
                lSubCouplerOrderQty =
                  lSubCouplerOrderQty + parseFloat(lItem.BarTotalQty);
              }
            }
          }
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
      lSubTotalWT = Math.round((lSubTotalWT - lSubCancelledWT) * 1000) / 1000;
      lSubCancelledWT = Math.round(lSubCancelledWT * 1000) / 1000;
      lSubCABWT = Math.round(lSubCABWT * 1000) / 1000;
      lSubSTDWT = Math.round(lSubSTDWT * 1000) / 1000;

      //console.log('Weight lSubOrderWT', lSubOrderWT);
      //console.log('Weight lSubCancelledWT', lSubCancelledWT);
      //console.log('Weight lSubTotalWT', lSubTotalWT);
      //console.log('Weight lSubCABWT', lSubCABWT);
      //console.log('Weight lSubSTDWT', lSubSTDWT);

      this.totalCABWeight = lSubCABWT.toFixed(3);
      this.totalSBWeight = lSubSTDWT.toFixed(3);
      this.totalCancelledWT = lSubCancelledWT.toFixed(3);
      this.totalTotalWeight = lSubTotalWT.toFixed(3);
      this.totalNoofitems = lSubOrderItem;
      this.totalTotalBarQty = lSubOrderQty;
      this.totalTotalCouplerBarQty = lSubCouplerOrderQty;
      // document.getElementById('cab_weight_' + lGridIndex)!.innerText =
      //   lSubCABWT.toString();
      // document.getElementById('sb_weight_' + lGridIndex)!.innerText =
      //   lSubSTDWT.toString();
      // document.getElementById('invalid_weight_' + lGridIndex)!.innerText =
      //   lSubCancelledWT.toString();
      // document.getElementById('total_weight_' + lGridIndex)!.innerText =
      //   lSubTotalWT.toString();
      // document.getElementById('valid_items_' + lGridIndex)!.innerText =
      //   lSubOrderItem.toString();

      // document.getElementById('valid_barqty_' + lGridIndex)!.innerText =
      //   lSubOrderQty.toString();

      // document.getElementById('bt_cab_weight_' + lGridIndex)!.innerText =
      //   lSubCABWT.toString();
      // document.getElementById('bt_sb_weight_' + lGridIndex)!.innerText =
      //   lSubSTDWT.toString();
      // document.getElementById('bt_invalid_weight_' + lGridIndex)!.innerText =
      //   lSubCancelledWT.toString();
      // document.getElementById('bt_total_weight_' + lGridIndex)!.innerText =
      //   lSubTotalWT.toString();
      // document.getElementById('bt_valid_items_' + lGridIndex)!.innerText =
      //   lSubOrderItem.toString();
      // document.getElementById('bt_valid_barqty_' + lGridIndex)!.innerText =
      //   lSubOrderQty.toString();
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
    } else {
      // If there are no items in the data entry list, all the sum total values will be Zero.
      this.totalCABWeight = (0).toFixed(3);
      this.totalSBWeight = (0).toFixed(3);
      this.totalCancelledWT = (0).toFixed(3);
      this.totalTotalWeight = (0).toFixed(3);
      this.totalNoofitems = 0;
      this.totalTotalBarQty = 0;
    }
    // }
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
      } else if (lType == 'D') {
        lDiaAR = this.gDStdDia.split(',');
        lMinLenAR = this.gDStdMinLen.split(',');
        lMinLenHkAR = this.gDStdMinLenHk.split(',');
        lMinHtHkAR = this.gDStdMinHtHk.split(',');
        lNonDiaAR = this.gDNonDia.split(',');
        lNonMinLenAR = this.gDNonMinLen.split(',');
        lNonMinLenHkAR = this.gDNonMinLenHk.split(',');
        lNonMinHtHkAR = this.gDNonMinHtHk.split(',');
        lStdFormerAR = this.gDStdFormer.split(',');
        lNonFormerAR = this.gDNonFormer.split(',');
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
                        'Do you want to change the former to non-standard ' +
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
                              'mm former. Do you want to change the former to non-standard ' +
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
                              'mm former. Do you want to change the former to non-standard ' +
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
                if (parseInt(pValue) > 3500) {
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

              let UserName = this.loginService.GetGroupName();
              if (
                UserName != null &&
                UserName.includes('@') &&
                UserName.split('@')[1].toUpperCase() == 'NATSTEEL.COM.SG'
              ) {
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
                  // if (
                  //   ((lFirst == 'H1' ||
                  //     lFirst == 'I1' ||
                  //     lFirst == 'J1' ||
                  //     lFirst == 'K1') &&
                  //     (lLast == 'H' ||
                  //       lLast == 'I' ||
                  //       lLast == 'J' ||
                  //       lLast == 'K')) ||
                  //   ((lFirst == 'C1' ||
                  //     lFirst == 'S1' ||
                  //     lFirst == 'P1' ||
                  //     lFirst == 'N1') &&
                  //     (lLast == 'C' ||
                  //       lLast == 'S' ||
                  //       lLast == 'P' ||
                  //       lLast == 'N'))
                  // ) {
                  //   var lMinValue = this.getVarMinValue(pValue);
                  //   if (pDia <= 25 && lMinValue < 550) {
                  //     lErrorMsg =
                  //       'The minimum length is 550mm for coupler bar with 2 ends. (两头都有续接器的钢筋,其最小长度为550mm)';
                  //     lReturn = false;
                  //     break;
                  //   }
                  //   if (pDia > 25 && pDia <= 32 && lMinValue < 650) {
                  //     lErrorMsg =
                  //       'The minimum length is 650mm for coupler bar with 2 ends, diameter 32mm. (两头都有续接器, 直径为32mm的钢筋,其最小长度为650mm)';
                  //     lReturn = false;
                  //     break;
                  //   }
                  //   if (pDia > 32 && lMinValue < 700) {
                  //     lErrorMsg =
                  //       'The minimum length is 700mm for coupler bar with 2 ends, diameter 40mm and 50mm. (两头都有续接器, 直径为40mm,50mm的钢筋,其最小长度为700mm)';
                  //     lReturn = false;
                  //     break;
                  //   }
                  // }
                   if (
                    (lFirst == 'H1' ||
                      lFirst == 'I1' ||
                      lFirst == 'J1' ||
                      lFirst == 'K1') &&
                    (lLast == 'H' ||
                      lLast == 'I' ||
                      lLast == 'J' ||
                      lLast == 'K')
                  ) {
                    var lMinValue = this.getVarMinValue(pValue);
                    if (pDia <= 20 && lMinValue < 550) {
                      lErrorMsg =
                        'The minimum length is 550mm for coupler bar with 2 ends. (两头都有续接器的钢筋,其最小长度为550mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 20 && pDia <= 28 && lMinValue < 530) {
                      lErrorMsg =
                        'The minimum length is 530mm for coupler bar with 2 ends, diameter 25mm, 28mm. (两头都有续接器, 直径为25mm, 28mm的钢筋,其最小长度为530mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 28 && pDia <= 32 && lMinValue < 540) {
                      lErrorMsg =
                        'The minimum length is 540mm for coupler bar with 2 ends, diameter 32mm. (两头都有续接器, 直径为32mm的钢筋,其最小长度为540mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia == 40 && lMinValue < 600) {
                      lErrorMsg =
                        'The minimum length is 600mm for coupler bar with 2 ends, diameter 40mm. (两头都有续接器, 直径为40mm的钢筋,其最小长度为600mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 40 && lMinValue < 1100) {
                      lErrorMsg =
                        'The minimum length is 1100mm for coupler bar with 2 ends, diameter 50mm. (两头都有续接器, 直径为50mm的钢筋,其最小长度为1100mm)';
                      lReturn = false;
                      break;
                    }
                  }

                  if (
                    (lFirst == 'C1' ||
                      lFirst == 'S1' ||
                      lFirst == 'P1' ||
                      lFirst == 'N1') &&
                    (lLast == 'C' ||
                      lLast == 'S' ||
                      lLast == 'P' ||
                      lLast == 'N')
                  ) {
                    var lMinValue = this.getVarMinValue(pValue);
                    if (pDia <= 25 && lMinValue < 800) {
                      lErrorMsg =
                        'The minimum length is 800mm for coupler bar with 2 ends. (两头都有续接器的钢筋,其最小长度为800mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 25 && lMinValue < 1100) {
                      lErrorMsg =
                        'The minimum length is 1100mm for coupler bar with 2 ends, diameter 28mm, 32mm, 40mm and 50mm. (两头都有续接器, 直径为28mm,32mm,40mm,50mm的钢筋,其最小长度为1100mm)';
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
              } else {
                if (
                  lShapeCode != null &&
                  lShapeCode.length >= 3 &&
                  lShapeCode != 'H1I' &&
                  lShapeCode != 'K1J' &&
                  lShapeCode != 'H1K' &&
                  lShapeCode != 'C1N' &&
                  lShapeCode != 'P1S'
                ) {
                  var lFirst = lShapeCode.substring(0, 2);
                  var lLast = lShapeCode.substring(2, 3);
                  if (
                    (lFirst == 'H1' ||
                      lFirst == 'I1' ||
                      lFirst == 'J1' ||
                      lFirst == 'K1') &&
                    (lLast == 'H' ||
                      lLast == 'I' ||
                      lLast == 'J' ||
                      lLast == 'K')
                  ) {
                    var lMinValue = this.getVarMinValue(pValue);
                    if (pDia <= 20 && lMinValue < 550) {
                      lErrorMsg =
                        'The minimum length is 550mm for coupler bar with 2 ends. (两头都有续接器的钢筋,其最小长度为550mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 20 && pDia <= 28 && lMinValue < 530) {
                      lErrorMsg =
                        'The minimum length is 530mm for coupler bar with 2 ends, diameter 25mm, 28mm. (两头都有续接器, 直径为25mm, 28mm的钢筋,其最小长度为530mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 28 && pDia <= 32 && lMinValue < 540) {
                      lErrorMsg =
                        'The minimum length is 540mm for coupler bar with 2 ends, diameter 32mm. (两头都有续接器, 直径为32mm的钢筋,其最小长度为540mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia == 40 && lMinValue < 600) {
                      lErrorMsg =
                        'The minimum length is 600mm for coupler bar with 2 ends, diameter 40mm. (两头都有续接器, 直径为40mm的钢筋,其最小长度为600mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 40 && lMinValue < 1100) {
                      lErrorMsg =
                        'The minimum length is 1100mm for coupler bar with 2 ends, diameter 50mm. (两头都有续接器, 直径为50mm的钢筋,其最小长度为1100mm)';
                      lReturn = false;
                      break;
                    }
                  }

                  if (
                    (lFirst == 'C1' ||
                      lFirst == 'S1' ||
                      lFirst == 'P1' ||
                      lFirst == 'N1') &&
                    (lLast == 'C' ||
                      lLast == 'S' ||
                      lLast == 'P' ||
                      lLast == 'N')
                  ) {
                    var lMinValue = this.getVarMinValue(pValue);
                    if (pDia <= 25 && lMinValue < 800) {
                      lErrorMsg =
                        'The minimum length is 800mm for coupler bar with 2 ends. (两头都有续接器的钢筋,其最小长度为800mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 25 && lMinValue < 1100) {
                      lErrorMsg =
                        'The minimum length is 1100mm for coupler bar with 2 ends, diameter 28mm, 32mm, 40mm and 50mm. (两头都有续接器, 直径为28mm,32mm,40mm,50mm的钢筋,其最小长度为1100mm)';
                      lReturn = false;
                      break;
                    }
                  }
                }

                if (lShapeCode != null && lShapeCode.length >= 3) {
                  if (
                    lShapeCode == 'H20' ||
                    lShapeCode == 'I20' ||
                    lShapeCode == 'J20' ||
                    lShapeCode == 'K20'
                  ) {
                    var lMinValue = this.getVarMinValue(pValue);
                    if (pDia <= 20 && lMinValue < 550) {
                      lErrorMsg =
                        'The minimum length is 550mm for coupler bar with 1 end. (两头都有续接器的钢筋,其最小长度为550mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 20 && pDia <= 28 && lMinValue < 530) {
                      lErrorMsg =
                        'The minimum length is 530mm for coupler bar with 1 end. (两头都有续接器的钢筋,其最小长度为530mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 28 && pDia <= 32 && lMinValue < 540) {
                      lErrorMsg =
                        'The minimum length is 540mm for coupler bar with 1 end, diameter 28mm, 32mm. (两头都有续接器, 直径为28mm,32mm的钢筋,其最小长度为540mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia == 40 && lMinValue < 600) {
                      lErrorMsg =
                        'The minimum length is 600mm for coupler bar with 1 end, diameter 40mm. (两头都有续接器, 直径为40mm的钢筋,其最小长度为600mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 40 && lMinValue < 1100) {
                      lErrorMsg =
                        'The minimum length is 1100mm for coupler bar with 1 end, diameter 50mm. (两头都有续接器, 直径为50mm的钢筋,其最小长度为1100mm)';
                      lReturn = false;
                      break;
                    }
                  }
                }

                if (lShapeCode != null && lShapeCode.length >= 3) {
                  if (
                    lShapeCode == 'C20' ||
                    lShapeCode == 'S20' ||
                    lShapeCode == 'P20' ||
                    lShapeCode == 'N20'
                  ) {
                    var lMinValue = this.getVarMinValue(pValue);
                    if (pDia <= 25 && lMinValue < 700) {
                      lErrorMsg =
                        'The minimum length is 700mm for coupler bar with 1 end. (两头都有续接器的钢筋,其最小长度为700mm)';
                      lReturn = false;
                      break;
                    }
                    if (pDia > 25 && lMinValue < 1000) {
                      lErrorMsg =
                        'The minimum length is 1000mm for coupler bar with 1 end, diameter 28mm, 32mm, 40mm and 50mm. (两头都有续接器, 直径为28mm, 32mm, 40mm, 50mm的钢筋,其最小长度为1000mm)';
                      lReturn = false;
                      break;
                    }
                  }
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
                                'mm former. Do you want to change the former to non-standard ' +
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
                                'mm former. Do you want to change the former to non-standard ' +
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
      } else if (lType == 'D') {
        lStdFormer = this.gDStdFormer;
        lNonFormer = this.gDNonFormer;
        lStdDia = this.gDStdDia;
        lNonDia = this.gDNonDia;
      } //Ajit
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

  ValidTransport(pArgs: any) {
    var lReturn = 0;
    // return 0 -- OK, 1 -- Low Bed, 2 -- Low Bed need police escort, 3 -- Exceed 7000mm Hiap Crane
    var lWidth = 0;
    var lLeng = 0;
    var lLowBed = 0;
    var lEscort = 0;
    var lVarNotUsed = 0;
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
      } else {
        lVarNotUsed = 1;
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

    if (lResult == 0 && lVarNotUsed == 1) {
      lResult = 9;
    }
    return lResult;
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
              var lClass =
                this.templateGrid.slickGrid.getCellCssStyles('error_highlight');
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
                    var lClass =
                      this.templateGrid.slickGrid.getCellCssStyles(
                        'error_highlight'
                      );
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
                          var lClass =
                            this.templateGrid.slickGrid.getCellCssStyles(
                              'error_highlight'
                            );
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
          if (lF.indexOf('@') >= 0)
            lF = lF.replace(new RegExp('@', 'g'), lPinSize / 2);

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

          try {
            lVarMax = math.evaluate(lF);
          } catch (error) {
            console.log('error in formula');
          }

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
          if (lF.indexOf('@') >= 0)
            lF = lF.replace(new RegExp('@', 'g'), lPinSize / 2);

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
          try {
            lVarMin = math.evaluate(lF);
          } catch (error) {
            console.log('error in formula');
          }

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
          if (lF.indexOf('@') >= 0)
            lF = lF.replace(new RegExp('@', 'g'), lPinSize / 2);

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
          if (lF.indexOf('@') >= 0)
            lF = lF.replace(new RegExp('@', 'g'), lPinSize / 2);

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

  getHeight(
    pAngle: any,
    pAngleType: any,
    pHypotenuse: any,
    pDia: any,
    pAngleOther: any
  ) {
    //pAngleType: 1--sin; 2--sin+90; 3--cos; 4--cos+90 without dia
    //pAngleType: 5--sin; 6--sin+90; 7--cos; 8--cos+90 with dia
    //pAngleType: 0--cos--Height=pHypotenuse*cos(pAngle-90+pAngleOther)
    let lReturn1: any = 0;
    let lReturn2: any = 0;
    let lReturn: any = 0;
    let lHypoMin: any = this.getVarMinValue(pHypotenuse);
    let lHypoMax: any = this.getVarMaxValue(pHypotenuse);
    let lAngleMin: any = this.getVarMinValue(pAngle);
    let lAngleMax: any = this.getVarMaxValue(pAngle);
    let lAngleOtherMin: any = this.getVarMinValue(pAngleOther);
    let lAngleOtherMax: any = this.getVarMaxValue(pAngleOther);

    pDia = parseInt(pDia);

    if (pAngleType == 0) {
      lReturn1 = Math.round(
        lHypoMin * Math.cos(((lAngleMin - 90 + lAngleOtherMin) * Math.PI) / 180)
      );
    }
    if (pAngleType == 1) {
      lReturn1 = Math.round(lHypoMin * Math.sin((lAngleMin * Math.PI) / 180));
    }
    if (pAngleType == 2) {
      lReturn1 = Math.round(
        lHypoMin * Math.sin(((lAngleMin - 90) * Math.PI) / 180)
      );
    }
    if (pAngleType == 3) {
      lReturn1 = Math.round(lHypoMin * Math.cos((lAngleMin * Math.PI) / 180));
    }
    if (pAngleType == 4) {
      lReturn1 = Math.round(
        lHypoMin * Math.cos(((lAngleMin - 90) * Math.PI) / 180)
      );
    }
    if (pAngleType == 5) {
      lReturn1 = Math.round(
        lHypoMin * Math.sin((lAngleMin * Math.PI) / 180) + pDia
      );
    }
    if (pAngleType == 6) {
      lReturn1 = Math.round(
        lHypoMin * Math.sin(((lAngleMin - 90) * Math.PI) / 180) + pDia
      );
    }
    if (pAngleType == 7) {
      lReturn1 = Math.round(
        lHypoMin * Math.cos((lAngleMin * Math.PI) / 180) + pDia
      );
    }
    if (pAngleType == 8) {
      lReturn1 = Math.round(
        lHypoMin * Math.cos(((lAngleMin - 90) * Math.PI) / 180) + pDia
      );
    }

    if (lReturn1 > lHypoMin - 1) {
      lReturn1 = lHypoMin - 1;
    }
    if (lReturn1 < 0) {
      lReturn1 = 0;
    }

    lReturn = lReturn1;

    if (
      lHypoMin != lHypoMax ||
      lAngleMin != lAngleMax ||
      lAngleOtherMin != lAngleOtherMax
    ) {
      if (pAngleType == 0) {
        lReturn2 = Math.round(
          lHypoMax *
            Math.cos(((lAngleMax - 90 + lAngleOtherMax) * Math.PI) / 180)
        );
      }
      if (pAngleType == 1) {
        lReturn2 = Math.round(lHypoMax * Math.sin((lAngleMax * Math.PI) / 180));
      }
      if (pAngleType == 2) {
        lReturn2 = Math.round(
          lHypoMax * Math.sin(((lAngleMax - 90) * Math.PI) / 180)
        );
      }
      if (pAngleType == 3) {
        lReturn2 = Math.round(lHypoMax * Math.cos((lAngleMax * Math.PI) / 180));
      }
      if (pAngleType == 4) {
        lReturn2 = Math.round(
          lHypoMax * Math.cos(((lAngleMax - 90) * Math.PI) / 180)
        );
      }
      if (pAngleType == 5) {
        lReturn2 = Math.round(
          lHypoMax * Math.sin((lAngleMax * Math.PI) / 180) + pDia
        );
      }
      if (pAngleType == 6) {
        lReturn2 = Math.round(
          lHypoMax * Math.sin(((lAngleMax - 90) * Math.PI) / 180) + pDia
        );
      }
      if (pAngleType == 7) {
        lReturn2 = Math.round(
          lHypoMax * Math.cos((lAngleMax * Math.PI) / 180) + pDia
        );
      }
      if (pAngleType == 8) {
        lReturn2 = Math.round(
          lHypoMax * Math.cos(((lAngleMax - 90) * Math.PI) / 180) + pDia
        );
      }

      if (lReturn2 > lHypoMax - 1) {
        lReturn2 = lHypoMax - 1;
      }
      if (lReturn2 < 0) {
        lReturn2 = 0;
      }

      if (lReturn1 != lReturn2) {
        lReturn = lReturn1 + '-' + lReturn2;
      }
    }
    return lReturn;
  }

  getHeightG90(pAngle: any, pAngleType: any, pHypotenuse: any, pDia: any) {
    //pAngleType: 1--sin; 2--sin+90; 3--cos; 4--cos+90 without dia
    //pAngleType: 5--sin; 6--sin+90; 7--cos; 8--cos+90 with dia
    let lReturn1: any = 0;
    let lReturn2: any = 0;
    let lReturn: any = 0;
    let lHypoMin: any = this.getVarMinValue(pHypotenuse);
    let lHypoMax: any = this.getVarMaxValue(pHypotenuse);
    let lAngleMin: any = this.getVarMinValue(pAngle);
    let lAngleMax: any = this.getVarMaxValue(pAngle);
    let lDiaAR: any = this.gDiaAll.split(',');
    let lFormerAR: any = this.gNonFormer.split(',');
    let lFormer: any = 0;

    //for (var k = 0 ; k < lDiaAR.length ; k++) {
    //    if (pDia == lDiaAR[k]) {
    //        lFormer = parseInt(lFormerAR[k])/2;
    //        break;
    //    }
    //}

    pDia = parseInt(pDia);

    lReturn1 = Math.round(
      pDia +
        lFormer +
        (pDia + lFormer) / Math.cos(((180 - lAngleMin) * Math.PI) / 180) +
        (lHypoMin -
          lFormer -
          pDia -
          (pDia + lFormer) * Math.tan(((180 - lAngleMin) * Math.PI) / 180)) *
          Math.sin(((180 - lAngleMin) * Math.PI) / 180)
    );

    if (lReturn1 > lHypoMin - 1) {
      lReturn1 = lHypoMin - 1;
    }
    lReturn = lReturn1;

    if (lHypoMin != lHypoMax || lAngleMin != lAngleMax) {
      lReturn2 = Math.round(
        pDia +
          lFormer +
          (pDia + lFormer) / Math.cos(((180 - lAngleMax) * Math.PI) / 180) +
          (lHypoMax -
            lFormer -
            pDia -
            (pDia + lFormer) * Math.tan(((180 - lAngleMax) * Math.PI) / 180)) *
            Math.sin(((180 - lAngleMax) * Math.PI) / 180)
      );

      if (lReturn2 > lHypoMax - 1) {
        lReturn2 = lHypoMax - 1;
      }
      if (lReturn1 != lReturn2) {
        lReturn = lReturn1 + '-' + lReturn2;
      }
    }
    return lReturn;
  }

  getAngleG90(pHeight: any, pAngleType: any, pHypotenuse: any, pDia: any) {
    //pAngleType: 1--sin; 2--sin+90; 3--cos; 4--cos+90 without dia
    //pAngleType: 5--sin; 6--sin+90; 7--cos; 8--cos+90 with dia
    let lReturn1: any = 0;
    let lReturn2: any = 0;
    let lReturn: any = 0;
    let lHypoMin: any = this.getVarMinValue(pHypotenuse);
    let lHypoMax: any = this.getVarMaxValue(pHypotenuse);
    let lHeightMin: any = this.getVarMinValue(pHeight);
    let lHeightMax: any = this.getVarMaxValue(pHeight);
    let lDiaAR: any = this.gDiaAll.split(',');
    let lFormerAR: any = this.gNonFormer.split(',');
    let lFormer: any = 0;

    //for (var k = 0 ; k < lDiaAR.length ; k++) {
    //    if (pDia == lDiaAR[k]) {
    //        lFormer = parseInt(lFormerAR[k])/2;
    //        break;
    //    }
    //}

    pDia = parseInt(pDia);

    var lAngle = 0;
    var lHeight = 0;
    var lHeight1 = 0;
    var lDiff = 1;

    lAngle =
      180 - Math.round((Math.asin(lHeightMin / lHypoMin) * 180) / Math.PI);
    lHeight = Math.round(
      pDia +
        lFormer +
        (pDia + lFormer) / Math.cos(((180 - lAngle) * Math.PI) / 180) +
        (lHypoMin -
          lFormer -
          pDia -
          (pDia + lFormer) * Math.tan(((180 - lAngle) * Math.PI) / 180)) *
          Math.sin(((180 - lAngle) * Math.PI) / 180)
    );
    if (lHeight == lHeightMin) {
      lReturn1 = lAngle;
    }
    if (lHeight > lHeightMin) {
      for (var i = 1; i < 20; i++) {
        lHeight1 = Math.round(
          pDia +
            lFormer +
            (pDia + lFormer) / Math.cos(((180 - lAngle - i) * Math.PI) / 180) +
            (lHypoMin -
              lFormer -
              pDia -
              (pDia + lFormer) *
                Math.tan(((180 - lAngle - i) * Math.PI) / 180)) *
              Math.sin(((180 - lAngle - i) * Math.PI) / 180)
        );
        if (lHeight1 == lHeightMin) {
          lReturn1 = lAngle + i;
          break;
        }
        if (lHeight1 < lHeightMin) {
          if (lHeightMin - lHeight1 > lHeight - lHeightMin) {
            lReturn1 = lAngle + i - 1;
          } else {
            lReturn1 = lAngle + i;
          }
          break;
        }
        lHeight = lHeight1;
      }
    }
    if (lHeight < lHeightMin) {
      for (var i = 1; i < 20; i++) {
        lHeight1 = Math.round(
          pDia +
            lFormer +
            (pDia + lFormer) / Math.cos(((180 - lAngle + i) * Math.PI) / 180) +
            (lHypoMin -
              lFormer -
              pDia -
              (pDia + lFormer) *
                Math.tan(((180 - lAngle + i) * Math.PI) / 180)) *
              Math.sin(((180 - lAngle + i) * Math.PI) / 180)
        );
        if (lHeight1 == lHeightMin) {
          lReturn1 = lAngle - i;
          break;
        }
        if (lHeight1 > lHeightMin) {
          if (lHeight1 - lHeightMin > lHeightMin - lHeight) {
            lReturn1 = lAngle - i + 1;
          } else {
            lReturn1 = lAngle - i;
          }
          break;
        }
        lHeight = lHeight1;
      }
    }

    if (lReturn1 > 179) {
      lReturn1 = 179;
    }
    if (lReturn1 < 91) {
      lReturn1 = 91;
    }
    lReturn = lReturn1;

    if (lHypoMin != lHypoMax || lHeightMin != lHeightMax) {
      lAngle =
        180 - Math.round((Math.asin(lHeightMax / lHypoMax) * 180) / Math.PI);
      lHeight = Math.round(
        pDia +
          lFormer +
          (pDia + lFormer) / Math.cos(((180 - lAngle) * Math.PI) / 180) +
          (lHypoMax -
            lFormer -
            pDia -
            (pDia + lFormer) * Math.tan(((180 - lAngle) * Math.PI) / 180)) *
            Math.sin(((180 - lAngle) * Math.PI) / 180)
      );
      if (lHeight == lHeightMax) {
        lReturn2 = lAngle;
      }
      if (lHeight > lHeightMax) {
        for (var i = 1; i < 20; i++) {
          lHeight1 = Math.round(
            pDia +
              lFormer +
              (pDia + lFormer) /
                Math.cos(((180 - lAngle - i) * Math.PI) / 180) +
              (lHypoMax -
                lFormer -
                pDia -
                (pDia + lFormer) *
                  Math.tan(((180 - lAngle - i) * Math.PI) / 180)) *
                Math.sin(((180 - lAngle - i) * Math.PI) / 180)
          );
          if (lHeight1 == lHeightMax) {
            lReturn2 = lAngle + i;
            break;
          }
          if (lHeight1 < lHeightMax) {
            if (lHeightMax - lHeight1 > lHeight - lHeightMax) {
              lReturn2 = lAngle + i - 1;
            } else {
              lReturn2 = lAngle + i;
            }
            break;
          }
          lHeight = lHeight1;
        }
      }
      if (lHeight < lHeightMax) {
        for (var i = 1; i < 20; i++) {
          lHeight1 = Math.round(
            pDia +
              lFormer +
              (pDia + lFormer) /
                Math.cos(((180 - lAngle + i) * Math.PI) / 180) +
              (lHypoMax -
                lFormer -
                pDia -
                (pDia + lFormer) *
                  Math.tan(((180 - lAngle + i) * Math.PI) / 180)) *
                Math.sin(((180 - lAngle + i) * Math.PI) / 180)
          );
          if (lHeight1 == lHeightMax) {
            lReturn2 = lAngle - i;
            break;
          }
          if (lHeight1 > lHeightMax) {
            if (lHeight1 - lHeightMax > lHeightMax - lHeight) {
              lReturn2 = lAngle - i + 1;
            } else {
              lReturn2 = lAngle - i;
            }
            break;
          }
          lHeight = lHeight1;
        }
      }

      if (lReturn2 > 179) {
        lReturn2 = 179;
      }
      if (lReturn2 < 91) {
        lReturn2 = 91;
      }
      if (lReturn1 != lReturn2) {
        lReturn = lReturn1 + '-' + lReturn2;
      }
    }
    return lReturn;
  }

  getAngle(pHeight: any, pAngleType: any, pHypotenuse: any, pDia: any) {
    //pAngleType: 1--sin;2--sin+90;3--cos;4--cos+90 without dia
    //pAngleType: 5--sin;6--sin+90;7--cos;8--cos+90 with dia
    let lReturn1: any = 0;
    let lReturn2: any = 0;
    let lReturn: any = '0';
    let lHypoMin: any = this.getVarMinValue(pHypotenuse);
    let lHypoMax: any = this.getVarMaxValue(pHypotenuse);
    let lHeightMin: any = this.getVarMinValue(pHeight);
    let lHeightMax: any = this.getVarMaxValue(pHeight);

    pDia = parseInt(pDia);

    if (
      lHypoMin > 0 &&
      ((pAngleType <= 4 && lHypoMin > lHeightMin) ||
        (pAngleType >= 5 && lHypoMin > lHeightMin - pDia))
    ) {
      if (pAngleType == 1) {
        lReturn1 = Math.round(
          (Math.asin(lHeightMin / lHypoMin) * 180) / Math.PI
        );
      }
      if (pAngleType == 2) {
        lReturn1 =
          Math.round((Math.asin(lHeightMin / lHypoMin) * 180) / Math.PI) + 90;
      }
      if (pAngleType == 3) {
        lReturn1 = Math.round(
          (Math.acos(lHeightMin / lHypoMin) * 180) / Math.PI
        );
      }
      if (pAngleType == 4) {
        lReturn1 =
          Math.round((Math.acos(lHeightMin / lHypoMin) * 180) / Math.PI) + 90;
      }
      if (pAngleType == 5) {
        lReturn1 = Math.round(
          (Math.asin((lHeightMin - pDia) / lHypoMin) * 180) / Math.PI
        );
      }
      if (pAngleType == 6) {
        lReturn1 =
          Math.round(
            (Math.asin((lHeightMin - pDia) / lHypoMin) * 180) / Math.PI
          ) + 90;
      }
      if (pAngleType == 7) {
        lReturn1 = Math.round(
          (Math.acos((lHeightMin - pDia) / lHypoMin) * 180) / Math.PI
        );
      }
      if (pAngleType == 8) {
        lReturn1 =
          Math.round(
            (Math.acos((lHeightMin - pDia) / lHypoMin) * 180) / Math.PI
          ) + 90;
      }
      lReturn = lReturn1;

      if (lHypoMin != lHypoMax || lHeightMin != lHeightMax) {
        if (pAngleType == 1) {
          lReturn2 = Math.round(
            (Math.asin(lHeightMax / lHypoMax) * 180) / Math.PI
          );
        }
        if (pAngleType == 2) {
          lReturn2 =
            Math.round((Math.asin(lHeightMax / lHypoMax) * 180) / Math.PI) + 90;
        }
        if (pAngleType == 3) {
          lReturn2 = Math.round(
            (Math.acos(lHeightMax / lHypoMax) * 180) / Math.PI
          );
        }
        if (pAngleType == 4) {
          lReturn2 =
            Math.round((Math.acos(lHeightMax / lHypoMax) * 180) / Math.PI) + 90;
        }
        if (pAngleType == 5) {
          lReturn2 = Math.round(
            (Math.asin((lHeightMax - pDia) / lHypoMax) * 180) / Math.PI
          );
        }
        if (pAngleType == 6) {
          lReturn2 =
            Math.round(
              (Math.asin((lHeightMax - pDia) / lHypoMax) * 180) / Math.PI
            ) + 90;
        }
        if (pAngleType == 7) {
          lReturn2 = Math.round(
            (Math.acos((lHeightMax - pDia) / lHypoMax) * 180) / Math.PI
          );
        }
        if (pAngleType == 8) {
          lReturn2 =
            Math.round(
              (Math.acos((lHeightMax - pDia) / lHypoMax) * 180) / Math.PI
            ) + 90;
        }
        if (lReturn1 != lReturn2) {
          lReturn = lReturn1 + '-' + lReturn2;
        }
      }
    }

    return lReturn;
  }

  getAnglePlus(
    pHeight: any,
    pAngleType: any,
    pHypotenuse: any,
    pDia: any,
    pAngleOther: any
  ) {
    //pAngleType: 0 --
    // Angle = Acos(pHeight/pHypotenuse) + 90 - pAngleOther
    let lReturn1: any = 0;
    let lReturn2: any = 0;
    let lReturn: any = '0';
    let lHypoMin: any = this.getVarMinValue(pHypotenuse);
    let lHypoMax: any = this.getVarMaxValue(pHypotenuse);
    let lHeightMin: any = this.getVarMinValue(pHeight);
    let lHeightMax: any = this.getVarMaxValue(pHeight);

    pDia = parseInt(pDia);

    if (
      lHypoMin > 0 &&
      ((pAngleType <= 4 && lHypoMin > lHeightMin) ||
        (pAngleType >= 5 && lHypoMin > lHeightMin - pDia))
    ) {
      lReturn1 =
        Math.round((Math.acos(lHeightMin / lHypoMin) * 180) / Math.PI) +
        90 -
        pAngleOther;
      lReturn = lReturn1;
      if (lHypoMin != lHypoMax || lHeightMin != lHeightMax) {
        lReturn2 =
          Math.round((Math.acos(lHeightMax / lHypoMax) * 180) / Math.PI) +
          90 -
          pAngleOther;
        if (lReturn1 != lReturn2) {
          lReturn = lReturn1 + '-' + lReturn2;
        }
      }
    }

    return lReturn;
  }

  isValidValue_bk(
    pColumnName: any,
    pParameters: any,
    pValidator: any,
    pDia: any,
    pValue: any,
    pItem: any,
    msgRef: any,
    pDataEntry: any
  ) {
    debugger;
    var lReturn = true;
    var lErrorMsg = '';
    var lGridIndex = $('#tabs .ui-tabs-active').index() + 1;
    var lType = pItem['BarType'];
    var lPinSize = pItem['PinSize'];
    if (
      lType != null &&
      lType != '' &&
      pColumnName != null &&
      pColumnName != '' &&
      pParameters != null &&
      pParameters != '' &&
      pValidator != null &&
      pValidator != '' &&
      pDia != null &&
      pDia != '' &&
      pDia != '0' &&
      pDia != 0 &&
      pValue != null &&
      pValue != '' &&
      pValue != '0' &&
      pValue != 0
    ) {
      var lValidator = 0;
      var lValidators = pValidator.split(',');
      var lParas = pParameters.split(',');
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
      } else if (lType == 'D') {
        lDiaAR = this.gDStdDia.split(',');
        lMinLenAR = this.gDStdMinLen.split(',');
        lMinLenHkAR = this.gDStdMinLenHk.split(',');
        lMinHtHkAR = this.gDStdMinHtHk.split(',');
        lNonDiaAR = this.gDNonDia.split(',');
        lNonMinLenAR = this.gDNonMinLen.split(',');
        lNonMinLenHkAR = this.gDNonMinLenHk.split(',');
        lNonMinHtHkAR = this.gDNonMinHtHk.split(',');
        lStdFormerAR = this.gDStdFormer.split(',');
        lNonFormerAR = this.gDNonFormer.split(',');
      }

      if (lValidators.length == lParas.length) {
        for (var i = 0; i < lValidators.length; i++) {
          if (pColumnName == lParas[i]) {
            var laValidators = lValidators[i].split(';');
            for (var j = 0; j < laValidators.length; j++) {
              lValidator = laValidators[j].substring(0, 1);
              if (lValidator == 1) {
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
                              'mm former. Do you want to change the former to non-standard ' +
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
                        }
                      }
                    }
                  }
                  break;
                }
              }
              if (lValidator == 2) {
                //Hook minimum length validation
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
                          'mm的最小铁钩长度为 ' +
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
                          'mm的最小铁钩长度为 ' +
                          lStdMinLen +
                          'mm. 非标准曲模' +
                          lNonFormer +
                          'mm的最小铁钩长度为 ' +
                          lNonMinLen +
                          'mm.)';
                      }
                      lReturn = false;
                    } else {
                      if (
                        parseInt(lPinSize) > parseInt(lNonFormer.toString())
                      ) {
                        var lRes = confirm(
                          'The minimum hook length is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former. Do you want to change the former to non-standard ' +
                            lNonFormer +
                            'mm former with minimum hook length ' +
                            lNonMinLen +
                            'mm? \n' +
                            '标准曲模' +
                            lStdFormer +
                            'mm的最小铁钩长度为 ' +
                            lStdMinLen +
                            'mm. 请确认是否换成非标准曲模' +
                            lNonFormer +
                            'mm, 其最小铁钩长度为 ' +
                            lNonMinLen +
                            'mm?'
                        );
                        if (lRes == true) {
                          pItem['PinSize'] = lNonFormer;
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
                            'mm former. (输入数据无效, 标准曲模' +
                            lStdFormer +
                            'mm的最小铁钩长度为 ' +
                            lStdMinLen +
                            'mm. 非标准曲模' +
                            lNonFormer +
                            'mm的最小铁钩长度为 ' +
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
              if (lValidator == 3) {
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
                        var lRes = confirm(
                          'The minimum hook height is ' +
                            lStdMinLen +
                            'mm for standard ' +
                            lStdFormer +
                            'mm former. Do you want to change the former to non-standard ' +
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
                      }
                    }
                  }
                  break;
                }
              }
              if (lValidator == 4) {
                //Height validation
                if (
                  this.getVarMinValue(pValue) <
                  parseInt(pDia) + parseInt(lDiaAR[3])
                ) {
                  // less than dia + 10 (first dia)
                  lErrorMsg =
                    'Invalid data entered. The height is measured with out-out, its minimum height is ' +
                    (parseInt(pDia) + parseInt(pDia)) +
                    '. (输入数据无效, 高度是从铁的外边度量, 其最小值为' +
                    (parseInt(pDia) + parseInt(pDia)) +
                    ')';
                  lReturn = false;
                  break;
                }
              }
              if (lValidator == 5) {
                //Angle validation 1-89
                if (parseInt(pValue) >= 90 || parseInt(pValue) <= 0) {
                  lErrorMsg =
                    'Invalid data entered. The angle value should be between 1-89. (输入数据无效, 角度的数值应该在 1-89 之间)';
                  lReturn = false;
                  break;
                }
              }
              if (lValidator == 6) {
                //Angle validation 91-179
                if (parseInt(pValue) >= 180 || parseInt(pValue) <= 90) {
                  lErrorMsg =
                    'Invalid data entered. The angle value should be between 91-179. (输入数据无效, 角度的数值应该在 91-179 之间)';
                  lReturn = false;
                  break;
                }
              }
              if (lValidator == 7) {
                //Angle validation 1-179
                if (parseInt(pValue) >= 180 || parseInt(pValue) <= 0) {
                  lErrorMsg =
                    'Invalid data entered. The angle value should be between 1-179. (输入数据无效, 角度的数值应该在 1-179 之间)';
                  lReturn = false;
                  break;
                }
              }
              if (lValidator == 8) {
                //Segment length have to less than given segment
                if (laValidators[j].length >= 2) {
                  var lAPara = laValidators[j].substring(1, 2);
                  var lAValue = pItem[lAPara];
                  if (
                    this.getVarMinValue(pValue) > this.getVarMinValue(lAValue)
                  ) {
                    lErrorMsg =
                      'Invalid data entered. The height or leg value should be less than or equal to parameter ' +
                      lAPara +
                      ' value ' +
                      this.getVarMinValue(lAValue) +
                      '. (输入数据无效, 高度值应该小于或等于参数' +
                      lAPara +
                      ' 的数值 ' +
                      this.getVarMinValue(lAValue) +
                      ')';
                    lReturn = false;
                    break;
                  } else {
                    if (
                      this.getVarMaxValue(pValue) > this.getVarMaxValue(lAValue)
                    ) {
                      lErrorMsg =
                        'Invalid data entered. The height or leg value should be less than or equal to parameter ' +
                        lAPara +
                        ' value ' +
                        this.getVarMaxValue(lAValue) +
                        '. (输入数据无效, 高度值应该小于或等于参数' +
                        lAPara +
                        ' 的数值 ' +
                        this.getVarMaxValue(lAValue) +
                        ')';
                      lReturn = false;
                      break;
                    }
                  }
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

  // async GETJobId(OrdrerNumber: any) {
  //   let response: any = await this.getJobId(OrdrerNumber);
  //   if (response == false) {
  //     alert("Connection error, please check your internet connection.");
  //   } else {
  //     if (response) {
  //       this.JobID = response.CABJobID
  //     }
  //   }
  // }

  // async getJobId(orderNumber: any): Promise<any> {
  //   try {
  //     const data = await this.orderService.getJobId(orderNumber).toPromise();
  //     return data;
  //   } catch (error) {
  //     console.error(error);
  //     return false;
  //   }
  // }

  // getJobId(orderNumber: string): any {
  //   this.orderService.getJobId(orderNumber).subscribe({
  //     next: (response: any) => {
  //       console.log('jobid', response);
  //       debugger;
  //       // this.createSharedService.selectedJobIds.StdBarsJobID = response

  //       this.JobID = response.CABJobID
  //       console.log("job id:", this.JobID);
  //       // this.getBBS(this.JobID);

  //     },
  //     error: () => { },
  //     complete: () => { },
  //   });
  // }

  async UpdateBBS(lBBSID?: any) {
    if (this.orderDetailsList) {
      if (!lBBSID) {
        lBBSID = this.BBSId;
      }
      let index = this.orderDetailsList.findIndex(
        (x: { BBSID: number }) => x.BBSID == lBBSID
      );
      if (index != -1) {
        let item: SaveBBSOrderDetails = this.orderDetailsList[index];

        item.BBSOrderCABWT = Number(this.totalCABWeight);
        item.BBSOrderSTDWT = Number(this.totalSBWeight);
        item.BBSCancelledWT = Number(this.totalCancelledWT);
        item.BBSTotalWT = Number(this.totalTotalWeight);

        await this.SaveBBS(item);
        await this.SaveJobAdvice();
        if (this.isSaveFlag) {
          this.ReloadOrderDetails();
          this.isSaveFlag = false;
        }
      }
    }
  }

  // Unfocus the input element
  private unfocusInput(cell: string) {
    if (cell === 'bbsInput') {
      let lBBSElement = document.getElementById('bbsInput');
      if (lBBSElement) {
        lBBSElement.blur(); // Unfocus the input element
      }
    }
    if (cell === 'bbsDescInput') {
      let lBBSDescInput = document.getElementById('bbsDescInput');
      if (lBBSDescInput) {
        lBBSDescInput.blur(); // Unfocus the input element
      }
    }
  }

  async SaveBBS_CAB(data: any, cell: string) {
    if (!this.BBsValidator(data.BBSNo)) {
      // Unfocus the input element
      if (cell != 'newRecord') {
        this.unfocusInput(cell);
        alert(
          'Invalid data entered. BBS No cannot include special characters, such as -#$%. (输入数据无效, 加工表号不可包含特出字母, 例如-#$%等等.)'
        );
      }
      return;
    }

    if (!this.BBsValidator(data.BBSDescription)) {
      if (cell != 'newRecord') {
        // Unfocus the input element
        this.unfocusInput(cell);
        alert(
          'Invalid data entered. BBS Description cannot include special characters, such as ~!@@#$%^+`=\\|;:\'"<>?. (输入数据无效, 加工表详细说明不可包含特出字母, 例如~!@@#$%^+`=\\|;:\'"<>?等.)'
        );
      }
      return;
    }

    for (let i = 0; i < this.orderDetailsTable.length; i++) {
      // let item: SaveBBSOrderDetails = this.orderDetailsList[0];
      let item: SaveBBSOrderDetails = this.orderDetailsList.find(
        (x: { BBSID: any }) => x.BBSID === this.orderDetailsTable[i].BBSID
      );
      // item.BBSID = this.orderDetailsTable[i].BBSID;
      if (cell == 'newRecord') {
        let item: SaveBBSOrderDetails = this.orderDetailsList[0];
        item.BBSID = this.orderDetailsTable[i].BBSID;
        item.BBSNo = this.orderDetailsTable[i].BBSNo;
        item.BBSDesc = this.orderDetailsTable[i].BBSDescription;
        item.BBSCancelledWT = this.orderDetailsTable[i].CancelledWT;
        item.BBSOrderCABWT = this.orderDetailsTable[i].CABWeight;
        item.BBSOrderSTDWT = this.orderDetailsTable[i].SBWeight;
        item.BBSTotalWT = this.orderDetailsTable[i].TotalWeight;
        await this.SaveBBS(item);
      } else {
        if (data.BBSID === item.BBSID) {
          item.BBSNo = this.orderDetailsTable[i].BBSNo;
          item.BBSDesc = this.orderDetailsTable[i].BBSDescription;
          item.BBSCancelledWT = this.orderDetailsTable[i].CancelledWT;
          item.BBSOrderCABWT = this.orderDetailsTable[i].CABWeight;
          item.BBSOrderSTDWT = this.orderDetailsTable[i].SBWeight;
          item.BBSTotalWT = this.orderDetailsTable[i].TotalWeight;
          this.updateSingleRecord = true;
          this.gCurrentBBSID = item.BBSID;
          await this.SaveBBS(item);
          break;
        }
      }
    }
    /**
     * OrderDetails values getting changed on adding new row => item.BBSOrderSTDWT = this.orderDetailsTable[i].OrderWeight;
      item.BBSOrderSTDWT = this.orderDetailsTable[i].SBWeight;
     * DATED - 2023-10-23
     */

    if (!this.navigateBBS_Flag) {
      this.editTable = false; // do not toggle edit mode when saved using keydown events.
    }
    this.navigateBBS_Flag = false;

    // this.ReloadOrderDetails();
    // let item: SaveBBSOrderDetails = this.orderDetailsList[0];
    // item.BBSID = data.SNo;
    // item.BBSNo = data.BBSNo;
    // item.BBSDesc = data.BBSDescription;
    // this.SaveBBS(item)
  }

  async SaveBBS(obj: SaveBBSOrderDetails) {
    // let obj: SaveBBSOrderDetails = item.BBS;
    // obj.BBSNo = item.BBSNumnber
    // obj.BBSDesc = item.BBSDescription

    if (this.NON_Editable) {
      // Condtion added specifically to handle orders under 'Pending Approval'.
      if (!this.OrderStatus.toLowerCase().includes('sent')) {
        return;
      }
    }

    console.log('to be saved', obj);
    obj.UpdateBy = this.loginService.GetGroupName();
    let respSaveBBS = await this.SaveBBS_OrderDetails(obj);
    if (respSaveBBS == false) {
      alert('Cannot save BBS data since server error. please try later.');
    }
    console.log('respSaveBBS', respSaveBBS);

    this.checkBBSDuplicate();
  }

  async SaveBBS_OrderDetails(obj: SaveBBSOrderDetails): Promise<any> {
    try {
      obj.BBSSOR = '';
      obj.BBSNoNDS = '';
      obj.BBSSAPSO = '';
      obj.BBSSORCoupler = '';
      obj.BBSNoNDSCoupler = '';
      const data = await this.orderService
        .SaveBBS_OrderDetails(obj)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
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
      if (lValue?.toString().indexOf('-') <= 0) {
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

    if (lValue?.toString().indexOf('.') >= 0) {
      // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    /**
     * Add new code for 'R7A' shapecode.
     */
    if (lShape == 'R7A' || lShape == 'r7a') {
      if (lValue < 0) {
        //alert("Invalid parameter value.");
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
        };
      }
    } else {
      if (lValue <= 0) {
        //alert("Invalid parameter value.");
        // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        return {
          valid: false,
          msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
        };
      }
    }
    /**ODOS Enhancement : Retrict Entry if Hypotenuse is Shorter */
    if (lShape == '2I2' || lShape == '2i2') {
      if (lItem.B && lItem.D) {
        if (Number(lItem.D) >= Number(lItem.B)) {
          return {
            valid: false,
            msg: 'Invalid parameter value. The value of "D" cannot be greater than or equals to "B"',
          };
        }
      }
    }
    if (lShape == '049' || lShape == '49') {
      if (lItem.A && lItem.D) {
        if (Number(lItem.D) >= Number(lItem.A)) {
          return {
            valid: false,
            msg: 'Invalid parameter value. The value of "D" cannot be greater than or equals to "A"',
          };
        }
        if (lItem.B && lItem.E) {
          if (Number(lItem.E) >= Number(lItem.B)) {
            return {
              valid: false,
              msg: 'Invalid parameter value. The value of "E" cannot be greater than or equals to "D"',
            };
          }
        }
      }
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

    let UserName = this.loginService.GetGroupName();
    if (
      UserName != null &&
      UserName.includes('@') &&
      UserName.split('@')[1].toUpperCase() == 'NATSTEEL.COM.SG'
    ) {
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
      //alert("Invalid parameter value.");
      // $(Grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
      return {
        valid: false,
        msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
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

  DeleteBBSData(item: any) {
    if (this.NON_Editable) {
      return;
    }

    if (this.orderDetailsTable.length <= 1) {
      alert(
        'Cannot delete last BBS or Complete the BBS Number, Structure Element for second BBS before delete first one.'
      );
      return;
    }
    // if (BBSdata.length == pRowNo + 1) {
    //   SaveBBSData(pRowNo);
    // }
    if (
      confirm(
        'It is going to delete the BBS Serial Number: ' +
          item.BBSID +
          ', BBS No: ' +
          item.BBSNo +
          '. Are you sure?\n\n' +
          '这是要删除钢筋加工表，序号: ' +
          item.BBSID +
          ', 加工表号码: ' +
          item.BBSNo +
          '. 请确认?'
      )
    ) {
      // setTimeout(this.DeleteBBSOrder, 500, pRowNo);

      let index = this.orderDetailsList.findIndex(
        (element: { BBSNo: any }) => element.BBSNo == item.BBSNo
      );
      this.OrderdetailsLoading = true;
      setTimeout(() => {
        // Code to be executed after the delay
        let CustomerCode = this.orderDetailsList[index].CustomerCode;
        let ProjectCode = this.orderDetailsList[index].ProjectCode;
        let JobID = Number(this.orderDetailsList[index].JobID);
        let BBSID = Number(this.orderDetailsList[index].BBSID);
        let BarsCount = 0;

        this.DeleteBBSOrder(CustomerCode, ProjectCode, JobID, BBSID, BarsCount);
      }, 200);
    }
  }

  DeleteBBSOrder(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    BBSID: number,
    BarsCount: number
  ): any {
    let UpdateBy = this.loginService.GetGroupName();
    this.orderService
      .DeleteBBSOrder(
        CustomerCode,
        ProjectCode,
        JobID,
        BBSID,
        BarsCount,
        UpdateBy
      )
      .subscribe({
        next: (response: any) => {
          console.log('DeleteBBSOrder', response);

          this.OrderdetailsLoading = false;
          if (response.success == true) {
            this.ReloadOrderDetails();

            var lTotalCAB = 0;
            var lTotalSTD = 0;
            var lTotalWt = 0;
            // for (let i = 0; i < grid.getDataLength(); i++) {
            //     lTotalWt = lTotalWt + parseFloat(grid.getDataItem(i).BBSOrderWT);
            //     lTotalCAB = lTotalCAB + parseFloat(grid.getDataItem(i).BBSOrderCABWT);
            //     lTotalSTD = lTotalSTD + parseFloat(grid.getDataItem(i).BBSOrderSTDWT);
            // }
            // document.getElementById("total_weight").value = lTotalWt.toFixed(3);
            // document.getElementById("cab_weight").value = lTotalCAB.toFixed(3);
            // document.getElementById("sb_weight").value = lTotalSTD.toFixed(3);

            // JobAdviceChanged();
            this.SaveJobAdvice();
          } else {
            if (response.ErrorMessage != null) {
              alert(
                'Failed to delete the selected BBS. Error Message: ' +
                  response.ErrorMessage
              );
            } else {
              alert('Failed to delete the selected BBS.');
            }
          }
        },
        error: () => {},
        complete: () => {},
      });
  }

  OnChangeCouplerType() {
    let coupler = this.CouplerType ? this.CouplerType.toString() : 'NoCoupler';
    this.getShapeCodeList(this.CustomerCode, this.ProjectCode, coupler);
    this.SaveJobAdvice();
  }

  SubTotalWeight() {
    console.log('selectd wt', this.templateGrid.slickGrid.getSelectedRows());
    let lRows = this.templateGrid.slickGrid.getSelectedRows();
    if (lRows.length < 1) {
      alert('Select a row to be Updated!');
      return;
    }
    let lMaxRowNo = 0;

    let totalWeight = 0;
    for (let i = 0; i < lRows.length; i++) {
      if (lMaxRowNo < lRows[i]) {
        lMaxRowNo = lRows[i];
      }
      if (this.templateGrid.slickGrid.getDataItem(lRows[i]) == undefined) {
        continue;
      }
      let weight = this.templateGrid.slickGrid.getDataItem(lRows[i]).BarWeight;
      if (weight) {
        totalWeight = totalWeight + Number(weight);
      }
    }

    let lItem = this.templateGrid.slickGrid.getDataItem(lMaxRowNo);
    if (lItem == undefined) {
      return;
    }
    lItem.Remarks = Math.round(totalWeight * 1000) / 1000;

    let id = this.templateGrid.slickGrid.getDataItem(lMaxRowNo).id;
    this.dataViewCAB.updateItem(id, lItem);
  }
  SubTotalQty() {
    console.log('selectd qty', this.templateGrid.slickGrid.getSelectedRows());

    let lRows = this.templateGrid.slickGrid.getSelectedRows();

    if (lRows.length < 1) {
      alert('Select a row to be Updated!');
      return;
    }

    let lMaxRowNo = 0;

    let totalQty = 0;
    for (let i = 0; i < lRows.length; i++) {
      if (lMaxRowNo < lRows[i]) {
        lMaxRowNo = lRows[i];
      }
      if (this.templateGrid.slickGrid.getDataItem(lRows[i]) == undefined) {
        continue;
      }
      let weight = this.templateGrid.slickGrid.getDataItem(
        lRows[i]
      ).BarTotalQty;
      if (weight) {
        totalQty = totalQty + Number(weight);
      }
    }

    let lItem = this.templateGrid.slickGrid.getDataItem(lMaxRowNo);
    if (lItem == undefined) {
      return;
    }
    lItem.Remarks = Math.round(totalQty * 1000) / 1000;

    let id = this.templateGrid.slickGrid.getDataItem(lMaxRowNo).id;
    this.dataViewCAB.updateItem(id, lItem);
  }

  OpenMoreInfo() {
    if (this.showVariance) {
      this.OpenBarDetails();
    } else {
      this.OpenBarInfo();
    }
  }

  OpenBarDetails() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      windowClass: 'your-custom-dialog-class',
      size: 'xl',
    };
    let data = this.VarianceData;
    localStorage.setItem('VarianceData', JSON.stringify(data));
    const modalRef = this.modalService.open(
      BarDetailsComponent,
      ngbModalOptions
    );
  }

  OpenBarInfo() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      BarDetailsInfoComponent,
      ngbModalOptions
    );
  }

  PrintBBSDetails(formatID: number) {
    let CustomerCode = this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
    let ProjectCode = this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
    let JobID = this.JobID; //735 ;//this.selectedRow[0].JobID;
    this.OrderdetailsLoading = true;
    this.orderService
      .showdirPrintOrder(CustomerCode, ProjectCode, JobID, formatID)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'CAB-' + this.orderDetailsTable[0].BBSNo + '.pdf';
          a.click();

          window.open(url, '_blank'); // Opens the PDF in a new tab

          // this.StandardBarProductOrderLoading = false;
          // this.ProcessOrderLoading = false;
          this.OrderdetailsLoading = false;
        },
        error: (e) => {
          //this.ProcessOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {},
      });
  }

  ExportToExcel() {
    debugger;
    let CustomerCode = this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
    let ProjectCode = this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
    let JobID = this.JobID; //735 ;//this.selectedRow[0].JobID;
    //this.OrderdetailsLoading = true;
    this.orderService
      .ExcelExportOrder(CustomerCode, ProjectCode, JobID)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'Order List' + '.xlsx';
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
          //this.ProcessOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {},
      });
  }

  ExportToExcelDiaSummary() {
    debugger;
    let CustomerCode = this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
    let ProjectCode = this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
    let OrderNumber = this.OrderNumber;
    let JobID = this.JobID; //735 ;//this.selectedRow[0].JobID;
    //this.OrderdetailsLoading = true;
    this.orderService
      .ExcelExportOrderDiaSummary(CustomerCode, ProjectCode, OrderNumber, JobID)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'BBS-Dia-Summary-' + this.OrderNumber + '.xlsx';
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
          //this.ProcessOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {},
      });
  }

  // ExportToExcel() {
  //   debugger;
  //   let CustomerCode = this.dropdown.getCustomerCode();//'0001101170';//this.selectedRow[0].CustomerCode;
  //   let ProjectCode = this.dropdown.getProjectCode()[0];//this.selectedRow[0].ProjectCode;
  //   let JobID = this.JobID;//735 ;//this.selectedRow[0].JobID;
  //   //this.OrderdetailsLoading = true;
  //   this.orderService.ExcelExportOrder(CustomerCode, ProjectCode, JobID).subscribe({
  //     next: (data) => {

  //       const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  });
  //       const url = window.URL.createObjectURL(blob);

  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'CAB-' + this.orderDetailsTable[0].BBSNo + '.xlsx';
  //      a.click();
  //       // a.download = 'example.xlsx';
  //       // document.body.appendChild(a);
  //       // a.click();
  //     //   document.body.removeChild(a);
  //     //   window.URL.revokeObjectURL(url);
  //     //   this.OrderdetailsLoading = false;
  //    // const dummyData: Uint8Array = new Uint8Array([data]);
  //      //const fileName = 'example.xlsx';
  //     //  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     // FileSaver.saveAs(blob, fileName);

  //     },
  //     error: (e) => {
  //       //this.ProcessOrderLoading = false;
  //       alert('Order printing failed, please check the Internet connection and try again.')
  //     },
  //     complete: () => {
  //     },
  //   });
  // }

  PrintBBSShape() {
    let CustomerCode = this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
    let ProjectCode = this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
    let JobID = this.JobID; //735 ;//this.selectedRow[0].JobID;
    this.OrderdetailsLoading = true;
    this.orderService
      .showdirBBSShape(CustomerCode, ProjectCode, JobID)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'CAB-Shape-' + this.orderDetailsTable[0].BBSNo + '.pdf';
          a.click();

          window.open(url, '_blank'); // Opens the PDF in a new tab

          // this.StandardBarProductOrderLoading = false;
          // this.ProcessOrderLoading = false;
          this.OrderdetailsLoading = false;
        },
        error: (e) => {
          //this.ProcessOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {},
      });
  }

  async SaveJobAdvice_CAB_POST(item: SaveJobAdvice_CAB): Promise<any> {
    try {
      const data = await this.orderService.SaveJobAdvice_CAB(item).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  getProjectStage() {
    this.orderService.getProjectStage().subscribe({
      next: (response) => {
        console.log(response);
        this.ProjectStageList = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  handleCellDoubleClick(event: Event) {
    console.log('handleCellDoubleClick');
  }

  CreateNewShape() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      CreateShapeComponent,
      ngbModalOptions
    );
  }

  private toastrRef: any; // Reference to the persistent Toastr notification
  DownlaodShapeList() {
    let customer = this.CustomerCode;
    let project = this.ProjectCode;
    this.OrderdetailsLoading = true;
    this.toastrRef = this.toastr.info('Downlaod Started! Please Wait.', '', {
      timeOut: 0,
      extendedTimeOut: 0,
      tapToDismiss: false,
      disableTimeOut: true,
    });
    this.orderService.printShapes(customer, project).subscribe({
      next: (response) => {
        console.log('printShapes', response);

        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Shapes_List' + '.pdf';
        a.click();
        this.OrderdetailsLoading = false;
        // Close the persistent Toastr notification
        this.toastr.clear(this.toastrRef.toastId);
        this.toastr.success('Downlaod Completed!!');
      },
      error: (e) => {
        this.OrderdetailsLoading = false;
        // Close the persistent Toastr notification
        this.toastr.clear(this.toastrRef.toastId);
        this.toastr.error('Downlaod Failed!!');
      },
      complete: () => {
        this.OrderdetailsLoading = false;
      },
    });
  }

  OnCategoryChange(ShapeCategory: any) {
    this.Shape_Category = '';
    let component: any;
    if (ShapeCategory == 'E-Splice Coupler') {
      component = ListOfShapesESpliceComponent;
    } else if (ShapeCategory == 'N-Splice Coupler') {
      component = ListOfShapesNSpliceComponent;
    } else {
      component = ListOfShapesComponent;
    }

    if (component) {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'xl',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(component, ngbModalOptions);

      modalRef.componentInstance.CustomerCode = this.CustomerCode;
      modalRef.componentInstance.ProjectCode = this.ProjectCode;
      modalRef.componentInstance.CouplerType = this.CouplerType;
      modalRef.componentInstance.ShapeCategory = ShapeCategory;

      modalRef.componentInstance.saveTrigger.subscribe((shapeCode: any) => {
        console.log('Selected ShapeCode -> ', shapeCode);
        let lRows = this.templateGrid.slickGrid.getSelectedRows();
        if (lRows.length < 1) {
          alert(
            'Please select a row of Bar Details before selecting shape code. (请钢筋加工表中选择一行, 再选图形.)'
          );
        }

        let maxRowNo = 0;
        let rowNum = this.templateGrid.slickGrid.getActiveCell().row;
        if (rowNum != undefined || rowNum != null) {
          let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
          lItem.BarShapeCode = shapeCode;

          let id = this.templateGrid.slickGrid.getDataItem(rowNum).id;

          this.dataViewCAB.updateItem(id, lItem);
        }
      });
    }
  }

  ConvertToUpper(value: any) {
    return value.toUpperCase();
  }

  CopyRows() {
    console.log('copy');
    let lRows = this.templateGrid.slickGrid.getSelectedRows();
    /**
     * While using Copy/Paste the rows are gettig mixed up
     * The getSelectedRows Function used above returns the id of selected rows in a random order.
     * So before copying the rows, "Sort" them in ascending order.
     * Dated:- 30/05/2024
     */
    if (lRows) {
      lRows.sort(function (a, b) {
        return a - b;
      });
    }

    if (lRows.length < 1) {
      alert('Please select items for copy.');
      // copyCopied = false;
      // copyDesSelected = false;
      return;
    }
    let copyItem = [];
    this.dataViewCAB.beginUpdate();
    // Reset previously copied rows.
    let lSize = this.templateGrid.slickGrid.getData().getItemCount();
    if (lSize) {
      for (let i = 0; i < lSize; i++) {
        let lItem = this.templateGrid.slickGrid.getDataItem(i);
        if (lItem.shapeCopied) {
          lItem.shapeCopied = false;
          this.dataViewCAB.updateItem(lItem.id, lItem);
        }
      }
    }
    for (let i = 0; i < lRows.length; i++) {
      let lItem = this.templateGrid.slickGrid.getDataItem(lRows[i]);
      copyItem.push(lItem);
      lItem.shapeCopied = true;
      this.dataViewCAB.updateItem(lItem.id, lItem);
    }
    this.dataViewCAB.endUpdate();
    this.CopiedBBSRows = copyItem;
    console.log('Tiem to be Copied ->', copyItem);

    // Render the grid to load colors.
    this.templateGrid.slickGrid.invalidate();
    this.templateGrid.slickGrid.render();
  }

  PasteRows() {
    console.log('paste');

    var lRowIndex = 0;
    if (this.templateGrid.slickGrid.getActiveCell() != null) {
      lRowIndex = this.templateGrid.slickGrid.getActiveCell().row;
    }
    var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
    var lProjectCode = this.ProjectCode; // document.getElementById("ProjectCode").value;
    var lJobID = this.JobID; // document.getElementById("OrderNo").value;

    var lBBS = this.BBSId; //(pGridID - 2);

    //start paste items
    //this.dataViewCAB.beginUpdate();
    //if (copyGridID != pGridID) {
    //    this.dataViewCAB.beginUpdate();
    //}

    let lBarID = this.getBarID(lRowIndex + 1, this.dataViewCAB);
    let lData = this.CopiedBBSRows;

    lData.forEach((x) => (x.shapeCopied = true));

    for (let i = lData.length - 1; i >= 0; i--) {
      let lItem = lData[i];
      if (lItem.shapeCopied == true) {
        lItem.shapeCopied = false;
        // this.dataViewCAB.updateItem(lItem.id, lItem);//TEST

        //Save changes if made before insert another item;
        this.barRowIndex[this.gridIndex] = lRowIndex;

        //SaveBarDetails(pGridID, lRowIndex); //Tab#, Row#

        // Set new item
        var lBarSortUp = 0;
        if (lRowIndex > 0) {
          lBarSortUp = this.dataViewCAB.getItem(lRowIndex - 1).BarSort;
        }

        var lBarSortDown = 0;
        if (this.dataViewCAB.getItem(lRowIndex) != null) {
          lBarSortDown = this.dataViewCAB.getItem(lRowIndex).BarSort;
        }

        if (lBarSortDown == null) {
          lBarSortDown = 0;
        }
        if (lBarSortUp == null) {
          lBarSortUp = 0;
        }

        let lBarSort = (lBarSortUp + lBarSortDown) / 2;

        if ((lBarSortDown == null || lBarSortDown == 0) && lBarSortUp > 0) {
          lBarSort = lBarSortUp + 1000;
        }
        if ((lBarSortUp == null || lBarSortUp == 0) && lBarSortDown > 0) {
          lBarSort = lBarSortDown / 2;
        }
        if (lBarSortDown == 0 && lBarSortUp == 0) {
          lBarSort = (this.dataViewCAB.getLength() + 1) * 1000;
        }

        let lItemNew = {
          CustomerCode: lCustomerCode.toString(),
          ProjectCode: lProjectCode.toString(),
          JobID: lJobID,
          BBSID: lBBS, //this.getBBSID(lBBS),
          BarID: lBarID,
          BarSort: lBarSort,
          id: lRowIndex + 1,
          Cancelled: lItem.Cancelled,
          ElementMark: lItem.ElementMark,
          BarMark: lItem.BarMark,
          BarType: lItem.BarType,
          BarSize: lItem.BarSize,
          BarCAB: lItem.BarCAB,
          BarSTD: lItem.BarSTD,
          BarMemberQty: lItem.BarMemberQty,
          BarEachQty: lItem.BarEachQty,
          BarTotalQty: lItem.BarTotalQty,
          BarShapeCode: lItem.BarShapeCode,
          A: lItem.A,
          B: lItem.B,
          C: lItem.C,
          D: lItem.D,
          E: lItem.E,
          F: lItem.F,
          G: lItem.G,
          H: lItem.H,
          I: lItem.I,
          J: lItem.J,
          K: lItem.K,
          L: lItem.L,
          M: lItem.M,
          N: lItem.N,
          O: lItem.O,
          P: lItem.P,
          Q: lItem.Q,
          R: lItem.R,
          S: lItem.S,
          T: lItem.T,
          U: lItem.U,
          V: lItem.V,
          W: lItem.W,
          X: lItem.X,
          Y: lItem.Y,
          Z: lItem.Z,
          BarLength: lItem.BarLength,
          PinSize: lItem.PinSize,
          BarWeight: lItem.BarWeight,
          Remarks: lItem.Remarks,
          shapeParameters: lItem.shapeParameters,
          shapeLengthFormula: lItem.shapeLengthFormula,
          shapeParaValidator: lItem.shapeParaValidator,
          shapeTransportValidator: lItem.shapeTransportValidator,
          shapeTransport: lItem.shapeTransport,
          shapeParaX: lItem.shapeParaX,
          shapeParaY: lItem.shapeParaY,
          shapeParType: lItem.shapeParType,
          shapeDefaultValue: lItem.shapeDefaultValue,
          shapeHeightCheck: lItem.shapeHeightCheck,
          shapeAutoCalcFormula1: lItem.shapeAutoCalcFormula1,
          shapeAutoCalcFormula2: lItem.shapeAutoCalcFormula2,
          shapeAutoCalcFormula3: lItem.shapeAutoCalcFormula3,
          shapeCopied: false,
          CreateBy: this.loginService.GetGroupName(),
          UpdateBy: this.loginService.GetGroupName(),
        };

        this.dataViewCAB.insertItem(lRowIndex, lItemNew);
        this.barChangeInd[0] = this.barChangeInd[0] + 1;

        this.SaveBarDetails(0, lRowIndex); //Tab#, Row#

        lBarID = lBarID + 1;
        if (i > lRowIndex) {
          i = i + 1;
        }
      }
    }

    lData = this.dataViewCAB.getItems();
    for (var i = lRowIndex + 1; i < lData.length; i++) {
      lData[i].id = i + 1;
    }
    this.dataViewCAB.setItems(lData);

    /**
     * Refresh the side menu after Grid Update
     */
    this.refreshInfo(this.gridIndex);

    this.templateGrid.slickGrid.invalidate();
    this.templateGrid.slickGrid.render();
    this.templateGrid.slickGrid.setSelectedRows([lRowIndex]);
    this.templateGrid.slickGrid.setActiveCell(lRowIndex, 0);
    this.barChangeInd[0] = this.barChangeInd[0] + 1;
    this.gPreCellRow = lRowIndex;
    lData = [];
  }

  async ClearRows() {
    let lRows = this.templateGrid.slickGrid.getSelectedRows();
    if (lRows.length < 1) {
      alert('Please select items to be Cleared.');
      // copyCopied = false;
      // copyDesSelected = false;
      return;
    }
    if (
      confirm(
        'It going to clear all contents for selected items: ' +
          lRows.join(',') +
          '. Are you sure?\n\n' +
          '将要清除所选行的全部内容, 其行号为：' +
          lRows.join(',') +
          '. 请确认?'
      )
    ) {
      for (let i = 0; i < lRows.length; i++) {
        let lItem: SaveBarDetailsModel =
          this.templateGrid.slickGrid.getDataItem(lRows[i]);
        lItem.Cancelled = false;
        lItem.ElementMark = '';
        lItem.BarMark = '';
        lItem.BarType = '';
        lItem.BarSize = 0;
        lItem.BarSTD = false;
        lItem.BarMemberQty = 0;
        lItem.BarEachQty = 0;
        lItem.BarTotalQty = 0;
        lItem.BarShapeCode = '';
        lItem.A = '';
        lItem.B = '';
        lItem.C = '';
        lItem.D = '';
        lItem.E = '';
        lItem.F = '';
        lItem.G = '';
        lItem.H = '';
        lItem.I = '';
        lItem.J = '';
        lItem.K = '';
        lItem.L = '';
        lItem.M = '';
        lItem.N = '';
        lItem.O = '';
        lItem.P = '';
        lItem.Q = '';
        lItem.R = '';
        lItem.S = '';
        lItem.T = '';
        lItem.U = '';
        lItem.V = '';
        lItem.W = '';
        lItem.X = '';
        lItem.Y = '';
        lItem.Z = '';
        lItem.BarLength = '';
        lItem.BarWeight = 0;
        lItem.PinSize = 0;
        lItem.Remarks = '';
        lItem.shapeParameters = '';
        lItem.shapeLengthFormula = '';
        lItem.shapeParaValidator = '';
        lItem.shapeTransportValidator = '';
        lItem.shapeTransport = 0;

        let id = this.templateGrid.slickGrid.getDataItem(lRows[i]).id;

        let response: any = await this.saveBarDetails_POST(lItem);

        console.log('Clear Response', response);
        this.dataViewCAB.updateItem(id, lItem);

        if (response == false) {
          alert('Connection error, please check your internet connection.');
        } else {
          if (response == true) {
            this.dataViewCAB.updateItem(id, lItem);
          } else {
            if (response.ErrorMessage != null) {
              alert(
                'Failed to clear the BBS data. Error Message: ' +
                  response.ErrorMessage
              );
            }
          }
        }
      }
    }
  }

  PrintDiscrepancy() {
    debugger;
    let CustomerCode = this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
    let ProjectCode = this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
    let JobID = this.JobID; //735 ;//this.selectedRow[0].JobID;
    let BBSID = this.BBSId;
    this.OrderdetailsLoading = true;
    this.orderService
      .showdirPrintDiscrepancy(CustomerCode, ProjectCode, JobID, BBSID)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'CAB-' + this.orderDetailsTable[0].BBSNo + '.pdf';
          a.click();

          window.open(url, '_blank'); // Opens the PDF in a new tab

          // this.StandardBarProductOrderLoading = false;
          // this.ProcessOrderLoading = false;
          this.OrderdetailsLoading = false;
        },
        error: (e) => {
          //this.ProcessOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {},
      });
  }

  BBsValidator(value: any) {
    var lValue = value;

    if (
      lValue.indexOf('~') >= 0 ||
      lValue.indexOf('!') >= 0 ||
      lValue.indexOf('@@') >= 0 ||
      lValue.indexOf('@') >= 0 ||
      lValue.indexOf('#') >= 0 ||
      lValue.indexOf('$') >= 0 ||
      lValue.indexOf('%') >= 0 ||
      lValue.indexOf('^') >= 0 ||
      lValue.indexOf('+') >= 0 ||
      lValue.indexOf('`') >= 0 ||
      lValue.indexOf('=') >= 0 ||
      lValue.indexOf('\\') >= 0 ||
      lValue.indexOf('|') >= 0 ||
      lValue.indexOf(';') >= 0 ||
      lValue.indexOf("'") >= 0 ||
      lValue.indexOf(':') >= 0 ||
      lValue.indexOf('"') >= 0 ||
      lValue.indexOf('<') >= 0 ||
      lValue.indexOf('>') >= 0 ||
      lValue.indexOf('?') >= 0
    ) {
      return false;
    }
    return true;
  }

  ImportOES() {
    var lWT = Number(this.TotalWeight);
    if (lWT > 0) {
      if (
        confirm(
          'You had entered order data. The order import function will delete current data and then import the order from Excel. Please confirm?\n\n' +
            '订单数据已键入, 此功能将清除原始数据然后倒入订单数据从Excel文件. 请确认?'
        ) == false
      ) {
        return;
      }
    }
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ImportOesComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.CustomerCode = this.CustomerCode;
    modalRef.componentInstance.ProjectCode = this.ProjectCode;
    modalRef.componentInstance.JobID = this.JobID;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      console.log('Updated BBS =>', x);
      this.ReloadOrderDetails();
    });
  }

  ImportIFC() {
    var lWT = Number(this.TotalWeight);
    if (lWT > 0) {
      if (
        confirm(
          'You had entered order data. The order import function will delete current data and then import the order from Excel. Please confirm?\n\n' +
            '订单数据已键入, 此功能将清除原始数据然后倒入订单数据从Excel文件. 请确认?'
        ) == false
      ) {
        return;
      }
    }
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
    };
    const modalRef = this.modalService.open(
      ImportBbsFromIfcComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.CustomerCode = this.CustomerCode;
    modalRef.componentInstance.ProjectCode = this.ProjectCode;
    modalRef.componentInstance.JobID = this.JobID;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      this.ReloadOrderDetails();
    });
  }

  setCellClass(row: number, column: number, cssClass: string) {
    const cell = this.templateGrid.slickGrid.getCellNode(row, column);
    if (cell) {
      cell.classList.add(cssClass);
    }
  }

  //To Remove a specific class
  RemoveCellClass(row: number, column: number, cssClass: string) {
    const cell = this.templateGrid.slickGrid.getCellNode(row, column);
    if (cell) {
      if (cell.classList.contains(cssClass)) {
        // Remove the specified class
        cell.classList.remove(cssClass);
      }
    }
  }

  gInvalidRowSelected: boolean = false;
  gSelectedRows: any[] = [];
  async CheckBBSDetails() {
    var lFound = 0;
    var tabCount = $('div#tabs ul li').length;

    console.log('CheckBBSDetails -> START');

    // this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit();
    // SaveBarDetails(i, barRowIndex[i]);
    let lactiveCell = this.templateGrid.slickGrid.getActiveCell();
    let lselectedRows = this.templateGrid.slickGrid.getSelectedRows();
    this.templateGrid.slickGrid.removeCellCssStyles('error_highlight');

    // BarMark && BarShapeCode cancel refresh
    if (lactiveCell) {
      console.log(
        'Here',
        this.templateGrid.slickGrid.getDataItem(lactiveCell.row)
      );
      let lEditor: any = this.templateGrid.slickGrid.getCellEditor();
      if (lEditor) {
        let lValue = lEditor.getValue();
        console.log('Here lactiveCell', lValue);
        let lColumnName =
          this.templateGrid.slickGrid.getColumns()[lactiveCell.cell].id;

        let lItem = this.templateGrid.slickGrid.getDataItem(lactiveCell.row);
        if (lItem) {
          lItem[lColumnName] = lValue;
          this.dataViewCAB.updateItem(lItem.id, lItem);
        }
      }
    }

    this.templateGrid.slickGrid.invalidate();
    this.templateGrid.slickGrid.render();

    if (lactiveCell) {
      if (lselectedRows.length > 1) {
        this.templateGrid.slickGrid.setSelectedRows(lselectedRows);
      } else {
        this.templateGrid.slickGrid.setActiveCell(
          lactiveCell.row,
          lactiveCell.cell
        );
      }
    }
    let lClass: any = {};
    var lCellClass = '';
    for (let j = 0; j < this.dataViewCAB.getLength(); j++) {
      lClass[j] = {};
      if (this.dataViewCAB.getItem(j).Cancelled != true) {
        var lShape = this.dataViewCAB.getItem(j).BarShapeCode;
        var lType = this.dataViewCAB.getItem(j).BarType;
        var lDia = this.dataViewCAB.getItem(j).BarSize;
        var lQty = this.dataViewCAB.getItem(j).BarTotalQty;

        if (
          lQty != null &&
          lQty > 0 &&
          (lShape == null || lShape.trim() == '')
        ) {
          lClass[j]['BarShapeCode'] = 'highlighted';
        }

        if (
          lShape != null &&
          lShape.trim() != '' &&
          (lType == null ||
            lType == '' ||
            lType == ' ' ||
            (lType.trim() != 'H' &&
              lType.trim() != 'X' &&
              this.gCustomerBar.indexOf(lType.trim()) < 0))
        ) {
          lClass[j]['BarType'] = 'highlighted';
        }
        if (
          lShape != null &&
          lShape.trim() != '' &&
          (lDia == null || lDia == '' || lDia == ' ')
        ) {
          lClass[j]['BarSize'] = 'highlighted';
        }

        if (
          lShape != null &&
          lShape.trim() == 'R7A' &&
          lDia != null &&
          lDia >= 16
        ) {
          lClass[j]['BarSize'] = 'highlighted';
          lClass[j]['BarShapeCode'] = 'highlighted';
        }

        //if (lType == "E" || lType == "N") {
        //    lType = "T";
        //}
        if (lType == 'C') {
          lType = 'H';
        }
        if (lShape != null && lShape.trim() != '') {
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
            lClass[j]['BarSize'] = 'highlighted';
          }
        }
        if (
          lShape != null &&
          lShape.trim() != '' &&
          (this.dataViewCAB.getItem(j).BarMemberQty == null ||
            this.dataViewCAB.getItem(j).BarMemberQty == '' ||
            this.dataViewCAB.getItem(j).BarMemberQty == '0' ||
            this.dataViewCAB.getItem(j).BarMemberQty == ' ')
        ) {
          lClass[j]['BarMemberQty'] = 'highlighted';
        }
        if (
          lShape != null &&
          lShape.trim() != '' &&
          (this.dataViewCAB.getItem(j).BarEachQty == null ||
            this.dataViewCAB.getItem(j).BarEachQty == '' ||
            this.dataViewCAB.getItem(j).BarEachQty == '0' ||
            this.dataViewCAB.getItem(j).BarEachQty == ' ')
        ) {
          lClass[j]['BarEachQty'] = 'highlighted';
        }
        var lLength = this.dataViewCAB.getItem(j).BarLength;
        var lMaxLength = this.getVarMaxValue(lLength);

        var lLenLimit = this.gMaxBarLength;
        if (lDia <= 8) {
          lLenLimit = 6000;
        } else if (lDia <= 16) {
          lLenLimit = 12000;
        }
        if (lMaxLength > lLenLimit) {
          let lTotalDed: any = await this.getCreepDedution(
            lMaxLength,
            this.dataViewCAB.getItem(j)
          );
          if (lMaxLength - lTotalDed > lLenLimit) {
            lClass[j]['BarLength'] = 'highlighted';
          }
        }

        var lMinLength = this.getVarMinValue(lLength);
        if (
          lDia >= 40 &&
          lShape != '20' &&
          lShape != '020' &&
          lMinLength < 800
        ) {
          let lTotalDed: any = await this.getCreepDedution(
            lMinLength,
            this.dataViewCAB.getItem(j)
          );
          if (lMinLength - lTotalDed < 500) {
            lClass[j]['BarLength'] = 'highlighted';
          }
        }

        // if (
        //   lShape != null &&
        //   lShape.length >= 3 &&
        //   this.getVarMinValue(this.dataViewCAB.getItem(j).BarLength) < 800
        // ) {
        //   var lFirst = lShape.substring(0, 1);
        //   var lLast = lShape.substring(2, 3);
        //   if (
        //     ((lFirst == 'H' ||
        //       lFirst == 'I' ||
        //       lFirst == 'J' ||
        //       lFirst == 'K') &&
        //       (lLast == 'H' || lLast == 'I' || lLast == 'J' || lLast == 'K')) ||
        //     ((lFirst == 'C' ||
        //       lFirst == 'S' ||
        //       lFirst == 'P' ||
        //       lFirst == 'N') &&
        //       (lLast == 'C' || lLast == 'S' || lLast == 'P' || lLast == 'N'))
        //   ) {
        //     lClass[j]['BarLength'] = 'highlighted';
        //   }
        // }

        // if (
        //   lShape != null &&
        //   lShape.length >= 3 &&
        //   this.getVarMinValue(this.dataViewCAB.getItem(j).BarLength) < 600
        // ) {
        //   var lFirst = lShape.substring(0, 1);
        //   if (
        //     lFirst == 'H' ||
        //     lFirst == 'I' ||
        //     lFirst == 'J' ||
        //     lFirst == 'K' ||
        //     lFirst == 'C' ||
        //     lFirst == 'S' ||
        //     lFirst == 'P' ||
        //     lFirst == 'N'
        //   ) {
        //     lClass[j]['BarLength'] = 'highlighted';
        //   }
        // }

        // FOR DOUBLE END COUPLER
        if (lShape != null && lShape.length >= 3) {
          let lFirst = lShape.substring(0, 1);
          let lLast = lShape.substring(2, 3);
          if (
            (lFirst == 'H' ||
              lFirst == 'I' ||
              lFirst == 'J' ||
              lFirst == 'K') &&
            (lLast == 'H' || lLast == 'I' || lLast == 'J' || lLast == 'K')
          ) {
            var lMinValue = this.getVarMinValue(
              this.dataViewCAB.getItem(j).BarLength
            );
            if (lDia <= 20 && lMinValue < 550) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 20 && lDia <= 28 && lMinValue < 530) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 28 && lDia <= 32 && lMinValue < 540) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia == 40 && lMinValue < 600) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 40 && lMinValue < 1100) {
              lClass[j]['BarLength'] = 'highlighted';
            }
          }

          if (
            (lFirst == 'C' ||
              lFirst == 'S' ||
              lFirst == 'P' ||
              lFirst == 'N') &&
            (lLast == 'C' || lLast == 'S' || lLast == 'P' || lLast == 'N')
          ) {
            var lMinValue = this.getVarMinValue(
              this.dataViewCAB.getItem(j).BarLength
            );
            if (lDia <= 25 && lMinValue < 800) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 25 && lMinValue < 1100) {
              lClass[j]['BarLength'] = 'highlighted';
            }
          }
        }

        //FOR SINGLE COUPLER
        if (lShape != null && lShape.length >= 3) {
          let lFirst = lShape.substring(0, 1);
          if (
            lFirst == 'H' ||
            lFirst == 'I' ||
            lFirst == 'J' ||
            lFirst == 'K'
          ) {
            var lMinValue = this.getVarMinValue(
              this.dataViewCAB.getItem(j).BarLength
            );
            if (lDia <= 20 && lMinValue < 550) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 20 && lDia <= 28 && lMinValue < 530) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 28 && lDia <= 32 && lMinValue < 540) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia == 40 && lMinValue < 600) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 40 && lMinValue < 1100) {
              lClass[j]['BarLength'] = 'highlighted';
            }
          }

          if (
            lFirst == 'C' ||
            lFirst == 'S' ||
            lFirst == 'P' ||
            lFirst == 'N'
          ) {
            var lMinValue = this.getVarMinValue(
              this.dataViewCAB.getItem(j).BarLength
            );
            if (lDia <= 25 && lMinValue < 700) {
              lClass[j]['BarLength'] = 'highlighted';
            }
            if (lDia > 25 && lMinValue < 1000) {
              lClass[j]['BarLength'] = 'highlighted';
            }
          }
        }

        if (lShape != null && lShape.length >= 3 && lDia < 16) {
          var lFirst = lShape.substring(0, 1);
          if (
            lFirst == 'H' ||
            lFirst == 'I' ||
            lFirst == 'J' ||
            lFirst == 'K' ||
            lFirst == 'C' ||
            lFirst == 'S' ||
            lFirst == 'P' ||
            lFirst == 'N'
          ) {
            lClass[j]['BarSize'] = 'highlighted';
          }
        }

        if (lType == 'X' && lShape != null && lShape.length >= 3 && lDia < 40) {
          var lFirst = lShape.substring(0, 1);
          if (
            lFirst == 'C' ||
            lFirst == 'S' ||
            lFirst == 'P' ||
            lFirst == 'N'
          ) {
            lClass[j]['BarSize'] = 'highlighted';
          }
        }

        var lSB = this.dataViewCAB.getItem(j).BarSTD;
        var lWT = this.dataViewCAB.getItem(j).BarWeight;

        if (
          lSB == true &&
          lLength != null &&
          lType != null &&
          lType.trim() != 'R' &&
          parseInt(lLength) == 12000 &&
          (lWT % 2000 > 0 || lWT < 2000)
        ) {
          lClass[j]['BarWeight'] = 'highlighted';
        }

        if (
          lSB == true &&
          lLength != null &&
          lType != null &&
          lType.trim() != 'R' &&
          parseInt(lLength) == 14000 &&
          lWT < 2000
        ) {
          lClass[j]['BarWeight'] = 'highlighted';
        }

        if (
          lSB == true &&
          lLength != null &&
          lType != null &&
          (parseInt(lLength) == 6000 || lType.trim() == 'R') &&
          (lWT % 1000 > 0 || lWT < 1000)
        ) {
          lClass[j]['BarWeight'] = 'highlighted';
        }

        var lParameters = this.dataViewCAB.getItem(j).shapeParameters;
        var lParaTypes = this.dataViewCAB.getItem(j).shapeParType;
        if (
          lShape != null &&
          lShape.trim() != '' &&
          lParameters != null &&
          lParameters != '' &&
          lParaTypes != null &&
          lParaTypes != ''
        ) {
          var lParaA = lParameters.split(',');
          var lParaTypeA = lParaTypes.split(',');
          for (let k = 0; k < lParaA.length; k++) {
            /**
             * lClass[j][lParaA[k]] => contains the class which changes the color of specific cells
             * (lClass[j][lParaA[k]] = '') is removing the already applied classes due to which some
             * cell colors are mismatching from DiGiOS
             */

            // lClass[j][lParaA[k]] = '';  // commented this line to avoid removing the already applied classes
            lClass[j][lParaA[k]] = lClass[j][lParaA[k]]
              ? lClass[j][lParaA[k]]
              : ''; // Updated to

            if (this.dataViewCAB.getItem(j)[lParaA[k]] == null) {
              lClass[j][lParaA[k]] = 'highlighted';
            }
            // console.log(
            //   'CHECK BBS LIST',
            //   this.dataViewCAB.getItem(j)[lParaA[k]],
            //   this.dataViewCAB.getItem(j)[lParaA[k]]
            // );
            if (
              this.dataViewCAB.getItem(j)[lParaA[k]] != null &&
              isNaN(this.dataViewCAB.getItem(j)[lParaA[k]]) == true
            ) {
              var lArrayP = this.dataViewCAB.getItem(j)[lParaA[k]].split('-');
              if (lArrayP.length != 2) {
                lClass[j][lParaA[k]] = 'highlighted';
              }
              if (isNaN(lArrayP[0]) || isNaN(lArrayP[1])) {
                lClass[j][lParaA[k]] = 'highlighted';
              }
              if (parseInt(lArrayP[0]) == parseInt(lArrayP[1])) {
                lClass[j][lParaA[k]] = 'highlighted';
              }
              if (lArrayP.length == 2) {
                var lMax = this.getVarMaxValue(
                  this.dataViewCAB.getItem(j)[lParaA[k]]
                );
                var lMin = this.getVarMinValue(
                  this.dataViewCAB.getItem(j)[lParaA[k]]
                );
                if (lMax <= 0 || lMin <= 0 || lMin == lMax) {
                  lClass[j][lParaA[k]] = 'highlighted';
                }
                var lMbrQty = this.dataViewCAB.getItem(j)['BarMemberQty'];
                if (lMbrQty <= 1) {
                  lClass[j]['BarMemberQty'] = 'highlighted';
                }
                var lEachQty = this.dataViewCAB.getItem(j)['BarEachQty'];
                if (lEachQty != null && lEachQty > 0 && lMbrQty < lEachQty) {
                  lClass[j]['BarMemberQty'] = 'highlightedYellow';
                }

                //Check Various Bar
                if (
                  this.gVarianceBarSplit == 'Y' &&
                  lEachQty * lMbrQty >= 5 &&
                  this.getNoVariousBar(this.dataViewCAB.getItems(), j) > 26
                ) {
                  lClass[j][lParaA[k]] = 'highlighted';
                }
              }
            }
            if (this.dataViewCAB.getItem(j)[lParaA[k]] <= 0) {
              lClass[j][lParaA[k]] = 'highlighted';
            }

            var msgRef = { msg: '' };
            if (
              this.isValidValue(
                lParaA[k],
                lParameters,
                lDia,
                this.dataViewCAB.getItem(j)[lParaA[k]],
                this.dataViewCAB.getItem(j),
                msgRef,
                0
              ) == false
            ) {
              lClass[j][lParaA[k]] = 'highlighted';
            }

            //Check imported value no tallings
            var lItemBK = JSON.parse(
              JSON.stringify(this.dataViewCAB.getItem(j))
            );

            var lItemBK: any = {};
            $.extend(true, lItemBK, this.dataViewCAB.getItem(j));

            // lItemBK = this.testDependValue(
            //   lParaA[k],
            //   lParameters,
            //   lDia,
            //   this.dataViewCAB.getItem(j)[lParaA[k]],
            //   lItemBK
            // );

            this.testDependValue(
              lParaA[k],
              lParameters,
              lDia,
              this.dataViewCAB.getItem(j)[lParaA[k]],
              lItemBK
            );

            // console.log(' FOR loop -> lParaA', lParaA)
            // console.log(' FOR loop -> lParaTypeA', lParaTypeA)
            for (let m = 0; m < lParaA.length; m++) {
              // console.log("Run main loop")

              if (lParaTypeA[m] != null) {
                var lMaxOld = this.getVarMaxValue(
                  this.dataViewCAB.getItem(j)[lParaA[m]]
                );
                var lMinOld = this.getVarMinValue(
                  this.dataViewCAB.getItem(j)[lParaA[m]]
                );

                var lMaxNew = this.getVarMaxValue(lItemBK[lParaA[m]]);
                var lMinNew = this.getVarMinValue(lItemBK[lParaA[m]]);

                // if (lParaA[m] == 'F') { // For testing
                //   console.log('lItemBK', lItemBK);
                //   console.log('lParaA', lParaA);
                //   console.log('Update', lParaA[m]);
                //   console.log('lMaxOld', lMaxOld);
                //   console.log('lMaxNew', lMaxNew);
                //   console.log('lMinOld', lMinOld);
                //   console.log('lMinNew', lMinNew);
                //   console.log('j', j);
                //   console.log('k', k);
                //   console.log('m', m);
                // }

                if (lParaTypeA[m] != 'V') {
                  var lMaxDiff = 20;
                  if (
                    Math.abs(lMaxOld - lMaxNew) > lMaxDiff ||
                    Math.abs(lMinOld - lMinNew) > lMaxDiff
                  ) {
                    lClass[j][lParaA[m]] = 'highlighted';
                  }
                } else {
                  var lMaxDiff = 5;
                  if (
                    Math.abs(lMaxOld - lMaxNew) > lMaxDiff ||
                    Math.abs(lMinOld - lMinNew) > lMaxDiff
                  ) {
                    lClass[j][lParaA[m]] = 'highlighted';
                  }
                }
              }
            }
          }
        }
      }
    }
    this.templateGrid.slickGrid.setCellCssStyles('error_highlight', lClass);
  }

  testDependValue(
    pColumnName: any,
    pParameters: any,
    pDia: any,
    pValue: any,
    pItem: any
  ) {
    // console.log('pItem', pColumnName, pValue, pItem);
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

      var lParas = '';
      var lFormula1AR = '';
      var lFormula2AR = '';
      var lFormula3AR = '';
      var lParamTypeAR = '';
      var lDefaultValueAR = '';

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

      for (var i = 0; i < lFormula1AR.length; i++) {
        var lFvar = lFormula1AR[i];
        if (lFvar != null && lFvar.trim() != '' && lFvar.indexOf('@@') >= 0) {
          return pItem;
        }
      }

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
              //if (lParamType != "H") {
              pItem[lParam] = lResult;
              //}

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
                    //if (lParamType != "H") {
                    pItem[lParam1] = lResult;
                    //}

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
                          //if (lParamType != "H") {
                          pItem[lParam2] = lResult;
                          //}
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
              //if (lParamType != "H") {
              pItem[lParam] = lResult;
              //}

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
                    //if (lParamType != "H") {
                    pItem[lParam1] = lResult;
                    //}

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
                          //if (lParamType != "H") {
                          pItem[lParam2] = lResult;
                          //}
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
              //if (lParamType != "H") {
              pItem[lParam] = lResult;
              //}

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
                    //if (lParamType != "H") {
                    pItem[lParam1] = lResult;
                    //}

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
                          //if (lParamType != "H") {
                          pItem[lParam2] = lResult;
                          //}
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
    return pItem;
  }

  async DoubleCapture() {
    //Check BBS Date
    // if ((document.getElementById("order_status").value != "New" &&
    //   document.getElementById("order_status").value != "Reserved" &&
    //   document.getElementById("order_status").value != "Created") &&
    //   (document.getElementById("order_status").value != "Sent" || gOrderSubmission != "Yes")) {
    //   alert("Order submitted already, you cannot using this function.");
    //   return;
    // }

    // if (this.gOrderCreation != "Yes") {
    //   alert("Access right insufficient to use this function.");
    //   return;
    // }

    // Slick.GlobalEditorLock.commitCurrentEdit();

    // var gridID = $("#tabs").tabs('option', 'active') + 1;
    // if (gridID > 1) {
    this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit();
    await this.SaveBarDetails(0, this.barRowIndex[0]);
    // }

    if (
      confirm(
        'For checking purpose, the system will backup current BBS data and allow you to enter the data again, and then you can compare the two set of data. Please confirm?\n\n' +
          '为了校对数据, 此功能将备份原始数据并且允许您再输入. 然后比较两次输入数据的结果. 请确认?'
      ) == false
    ) {
      return false;
    }

    var lCustomerCode = this.CustomerCode;
    var lProjectCode = this.ProjectCode;
    var lJobID = this.JobID;

    var lBBSID = this.BBSId; // this.getBBSID(this.BBSId);

    //setting double capture
    if (lCustomerCode != '' && lProjectCode != '' && lJobID > 0 && lBBSID > 0) {
      // startLoading();
      // setTimeout(setDoubleEntry, 500, lCustomerCode, lProjectCode, lJobID, lBBSID, gridID);

      this.setDoubleEntry();
    }

    return false;
  }

  async setDoubleEntry() {
    // alert('DOUBLE CAPTURE START')

    let lcustomer = this.CustomerCode;
    let lproject = this.ProjectCode;
    let ljobid = this.JobID;
    let lbbsid = this.BBSId;
    let response = await this.setDoubleCapture(
      lcustomer,
      lproject,
      ljobid,
      lbbsid
    );

    console.log('DoubleCapture -> ', response);

    if (response == false) {
      alert('cannot backup BBS data. Please try to logout and logon again');
    } else {
      if (response == null || response == -1) {
        alert(
          'Cannot backup original BBS data. Please check the internet connection and try again. '
        );
      } else if (response == 1) {
        alert(
          'The BBS Data backup is completed successfully. You can start to enter data again for the data checking. '
        );
        // reloadBarDetails(gridID - 2);
        this.GetTableData(lcustomer, lproject, ljobid, lbbsid);
      } else if (response == 0) {
        alert(
          'The BBS Data backup was done previously already. You can continue enter data or find their discrepancy. '
        );
      }
    }
  }

  async setDoubleCapture(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number
  ): Promise<any> {
    try {
      const data = await this.orderService
        .setDoubleCapture(CustomerCode, ProjectCode, JobID, BBSID)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async InsertItem() {
    let pGridID = 1;

    if (this.templateGrid.slickGrid.getActiveCell() != null) {
      var lRowIndex = this.templateGrid.slickGrid.getActiveCell().row;
      if (lRowIndex < this.dataViewCAB.getLength()) {
        this.barRowIndex[pGridID] = lRowIndex;
        let result = true; //await this.SaveBarDetails(pGridID, lRowIndex);
        if (result == true) {
          //Tab#, Row#
          var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
          var lProjectCode = this.ProjectCode; // document.getElementById("ProjectCode").value;
          var lJobID = this.JobID; // document.getElementById("OrderNo").value;

          // var lBBS = (pGridID - 2);

          var lBarID = this.getBarID(lRowIndex + 1, this.dataViewCAB);

          var lBarSortUp = 0;
          if (lRowIndex > 0) {
            lBarSortUp = this.dataViewCAB.getItem(lRowIndex - 1).BarSort;
          }
          var lBarSortDown = this.dataViewCAB.getItem(lRowIndex).BarSort;

          if (lBarSortDown == null) {
            lBarSortDown = 0;
          }
          if (lBarSortUp == null) {
            lBarSortUp = 0;
          }
          var lBarSort = (lBarSortUp + lBarSortDown) / 2;

          if ((lBarSortDown == null || lBarSortDown == 0) && lBarSortUp > 0) {
            lBarSort = lBarSortUp + 1000;
          }
          if ((lBarSortUp == null || lBarSortUp == 0) && lBarSortDown > 0) {
            lBarSort = lBarSortDown / 2;
          }
          if (lBarSortDown == 0 && lBarSortUp == 0) {
            lBarSort = (this.dataViewCAB.getLength() + 1) * 1000;
          }

          var lItem = {
            CustomerCode: lCustomerCode.toString(),
            ProjectCode: lProjectCode.toString(),
            JobID: lJobID,
            BBSID: this.BBSId, //getBBSID(lBBS),
            BarID: lBarID,
            BarSort: lBarSort,
            // BBSNo: this.getBBSNo(this.BBSId), //$($("#tabs li")[lBBS]).text(),
            id: lRowIndex + 1,
          };
          this.dataViewCAB.beginUpdate();
          this.dataViewCAB.insertItem(lRowIndex, lItem);

          // this.SaveBarDetails(0, lRowIndex)

          var lData = this.dataViewCAB.getItems();
          for (var i = lRowIndex + 1; i < lData.length; i++) {
            lData[i].id = i + 1;
          }
          this.dataViewCAB.setItems(lData);
          this.dataViewCAB.endUpdate();
          this.dataViewCAB.refresh();

          /**
           * Refresh the side menu after Grid Update
           */
          this.refreshInfo(this.gridIndex);

          // let rows = this.dataViewCAB.getLength();
          // for (let i = 0; i < rows.length; i++) {
          //   await this.InsertSave(1, i);
          // }

          this.templateGrid.slickGrid.invalidate();
          this.templateGrid.slickGrid.render();
          this.templateGrid.slickGrid.setSelectedRows([lRowIndex]);
          this.templateGrid.slickGrid.setActiveCell(lRowIndex, 0);
          this.barChangeInd[pGridID] = this.barChangeInd[pGridID] + 1;
          this.gPreCellRow = lRowIndex;
          lData = null;
        }
      }
    }
    return true;
  }

  getBBSNo(bbsid: any) {
    this.orderDetailsTable.forEach((x) => {
      if (x.BBSID == bbsid) {
        return x.BBSNo;
      }
    });
  }

  Delete() {
    var lRows = this.templateGrid.slickGrid.getSelectedRows();
    if (lRows.length > 0) {
      if (
        confirm(
          'It going to delete the selected items. Are you sure?\n\n将要删除您所选择的行. 请确认?'
        )
      ) {
        // startLoading();
        // setTimeout(DeleteBarDetails, 200, lGridIndex);
        this.DeleteBarDetails();
      }
    }
  }
  async DeleteBarDetails() {
    var lRows = this.templateGrid.slickGrid.getSelectedRows();
    if (lRows.length > 0) {
      lRows.sort(function (a: any, b: any) {
        return a - b;
      });
      var lRowsNo = '';
      for (var i = 0; i < lRows.length; i++) {
        if (lRowsNo.length == 0) {
          lRowsNo = (lRows[i] + 1).toString();
        } else {
          lRowsNo = lRowsNo + ', ' + (lRows[i] + 1).toString();
        }
      }
      var lCustomerCode = this.CustomerCode; // document.getElementById("CustomerCode").value;
      var lProjectCode = this.ProjectCode; // document.getElementById("ProjectCode").value;
      var lJobID = this.JobID; // document.getElementById("OrderNo").value;

      this.dataViewCAB.beginUpdate();

      // Start loading Screen
      this.OrderdetailsLoading = true;
      for (let i = lRows.length - 1; i >= 0; i--) {
        var lItem = this.templateGrid.slickGrid.getDataItem(lRows[i]);
        if (lItem != null) {
          var lSuccess = 1;
          var lBarID = lItem.BarID;
          let lbbsID = this.BBSId;

          let response: any = await this.DeleteBarDetails_CAB(
            lCustomerCode,
            lProjectCode,
            lJobID,
            lbbsID,
            lBarID
          );

          console.log('Delete Response ->', response);
          if (response == false) {
          } else {
            if (response.success == true) {
              this.dataViewCAB.deleteItem(lItem.id);
              this.barChangeInd[0] = 0;
            } else {
              lSuccess = 0;
              if (response.ErrorMessage != null) {
                alert(
                  'Failed to delete the BBS details data. Error Message: ' +
                    response.ErrorMessage
                );
              } else {
                alert('Failed to delete the BBS details data.');
              }
            }
          }

          if (lSuccess == 0) {
            break;
          }
        }
      }

      var lData = this.dataViewCAB.getItems();
      for (var i = lRows[0]; i < lData.length; i++) {
        lData[i].id = i + 1;
      }
      this.dataViewCAB.setItems(lData);
      this.dataViewCAB.endUpdate();

      /**Refresh the SideMenu data after grid update*/
      this.refreshInfo(this.gridIndex);

      this.templateGrid.slickGrid.invalidate();
      this.templateGrid.slickGrid.render();
      this.templateGrid.slickGrid.setSelectedRows([lRows[0]]);
      this.templateGrid.slickGrid.setActiveCell(lRows[0], 0);
      lData = null;

      // End loading Screen
      this.OrderdetailsLoading = false;
    }
  }

  // async setDoubleCapture(CustomerCode: string, ProjectCode: string, JobID: number, BBSID: number): Promise<any> {
  //   try {
  //     const data = await this.orderService.setDoubleCapture(CustomerCode, ProjectCode, JobID, BBSID).toPromise();
  //     return data;
  //   } catch (error) {
  //     console.error(error);
  //     return false;
  //   }
  // }
  GetMinimumBundlePcs() {
    this.orderService.GetMinimumBundlePcs().subscribe({
      next: (response) => {
        console.log('GetMinimumBundlePcs', response);
        if (response) {
          this.gMinimumBundlePcs = response;
        }
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  gMinimumBundlePcs: any[] = [];
  async CheckNConvertSTD() {
    // if ((gOrderCreation != "Yes" || (document.getElementById("order_status").value != "New" &&
    //     document.getElementById("order_status").value != "Reserved" &&
    //     document.getElementById("order_status").value != "Created")) &&
    //     (gOrderSubmission != "Yes" || document.getElementById("order_status").value != "Sent")) {
    //     return;
    // }
    if (this.NON_Editable) {
      return;
    }
    var lMeter12Type: any[] = [];
    var lMeter12WT: any[] = [];
    var lMeter12Size: any[] = [];
    var lMeter12QTY: any[] = [];
    var lMeter12 = 0;
    var lMeter12Str = '';
    // var tabCount = $("div#tabs ul li").length;
    // if (tabCount > 1) {
    // for (var i = 2; i <= tabCount; i++) {

    // for (let j = 0; j < this.dataViewCAB.getLength(); j++) {
    let lBBS: any[] = [];
    for (let i = 0; i < this.orderDetailsTable.length; i++) {
      lBBS.push(this.orderDetailsTable[i].BBSID);
    }
    for (let j = 0; j < this.gBBSTableData.length; j++) {
      let lItem = this.gBBSTableData[j];
      if (lBBS.includes(lItem.BBSID || lItem.BBSID.toString()) == false) {
        // Instead of breaking the Loop skip the BBSID which is not present.
        continue;
      }
      let lSize = 1;
      lSize = lItem.TableData ? lItem.TableData.length : 0;
      if (lItem.BBSID == this.BBSId) {
        /**
         * In case the value to be converted is the last record added to the table.
         */
        // if (this.templateGrid.slickGrid.getData().getLength() != lSize) {
        lItem.TableData = this.dataViewCAB.getItems();
        lSize = lItem.TableData.length;
        // }
      }
      for (let k = 0; k < lSize; k++) {
        // let Cancelled = this.dataViewCAB.getItem(0).Cancelled;
        // let BarSTD = this.dataViewCAB.getItem(0).BarSTD;
        // let BarShapeCode = this.dataViewCAB.getItem(0).BarShapeCode;
        // let A = this.dataViewCAB.getItem(0).A;
        // let BarType = this.dataViewCAB.getItem(0).BarType;
        // let BarSize = this.dataViewCAB.getItem(0).BarSize;
        // let BarWeight = this.dataViewCAB.getItem(0).BarWeight;

        // if (lItem.BBSID != this.BBSId) {
        let Cancelled = lItem.TableData[k].Cancelled
          ? lItem.TableData[k].Cancelled
          : null;
        let BarSTD = lItem.TableData[k].BarSTD
          ? lItem.TableData[k].BarSTD
          : null;
        let BarShapeCode = lItem.TableData[k].BarShapeCode
          ? lItem.TableData[k].BarShapeCode
          : null;
        let A = lItem.TableData[k].A ? lItem.TableData[k].A : null;
        let BarType = lItem.TableData[k].BarType
          ? lItem.TableData[k].BarType
          : null;
        let BarSize = lItem.TableData[k].BarSize
          ? lItem.TableData[k].BarSize
          : null;
        let BarWeight = lItem.TableData[k].BarWeight
          ? lItem.TableData[k].BarWeight
          : null;
        let BarTotalQty = lItem.TableData[k].BarTotalQty
          ? lItem.TableData[k].BarTotalQty
          : null;

        // }
        if (Cancelled == null || Cancelled == false) {
          if (BarSTD == null || BarSTD == false) {
            if (
              (BarShapeCode == '020' || BarShapeCode == '20') &&
              (A == 12000 || A == 14000)
            ) {
              if (lMeter12Type.length > 0) {
                var lFound = 0;
                for (let k = 0; k < lMeter12Type.length; k++) {
                  if (lMeter12Type[k] == BarType + BarSize + ' ' + A) {
                    lMeter12WT[k] = lMeter12WT[k] + BarWeight;
                    lMeter12QTY[k] = lMeter12QTY[k] + BarTotalQty;
                    lFound = 1;
                    break;
                  }
                }
                if (lFound == 0) {
                  lMeter12Type.push(BarType + BarSize + ' ' + A);
                  lMeter12WT.push(BarWeight);
                  lMeter12Size.push(BarSize);
                  lMeter12QTY.push(BarTotalQty);
                }
              } else {
                lMeter12Type.push(BarType + BarSize + ' ' + A);
                lMeter12WT.push(BarWeight);
                lMeter12Size.push(BarSize);
                lMeter12QTY.push(BarTotalQty);
              }
            }
          }
        }
      }
    }
    // }
    lMeter12Str = '';
    let lExceedMinimumBundle: boolean = false;
    if (lMeter12WT.length > 0) {
      for (let i = 0; i < lMeter12WT.length; i++) {
        let lMinBundlePcs = this.gMinimumBundlePcs.find(
          (x) =>
            x.BarType == lMeter12Type[i].substr(0, 1) &&
            x.BarSize == lMeter12Size[i].toString()
        )?.BundlePcs;
        lMinBundlePcs = lMinBundlePcs ? lMinBundlePcs : 0;

        if (lMeter12WT[i] >= 2000 || lMeter12QTY[i] >= lMinBundlePcs) {
          if (lMeter12Str.length == 0) {
            lMeter12Str =
              lMeter12Type[i] + ' (' + lMeter12WT[i].toFixed(3) + ')';
          } else {
            lMeter12Str =
              lMeter12Str +
              ',' +
              lMeter12Type[i] +
              ' (' +
              lMeter12WT[i].toFixed(3) +
              ')';
          }
        }
        if (lMeter12WT[i] > lMeter12) {
          lMeter12 = lMeter12WT[i];
        }

        if (lMeter12QTY[i] >= lMinBundlePcs) {
          lExceedMinimumBundle = true;
        }
      }
    }
    // }
    if (lMeter12 >= 2000 || lExceedMinimumBundle) {
      // if (
      //   confirm(
      //     'The total weight of 12m/14m straight bars is exceeded 2 tons, ' +
      //       lMeter12Str +
      //       '. You can convert them to Standard Bars (2 tons per bundle) and the balance still consider as cut&&bend bars. ' +
      //       'Click <OK> button to confirm the conversion.\n\n' +
      //       '在订单中包含了2吨以上的12/14米标准直铁, ' +
      //       lMeter12Str +
      //       '. 你可以把它转换成12/14米标准直铁订单(每捆2吨)，' +
      //       '剩余部分可仍然为加工铁. 点击<OK>按钮可确定这个转换.'
      //   )
      // ) {
      //   // startLoading();
      //   this.OrderdetailsLoading = true;
      //   await this.CheckNConvertSTDStart();
      //   return true;
      // }

      alert(
        'The total weight of 12m/14m straight bars is exceeded 2 tons, ' +
          lMeter12Str +
          '. You can convert them to Standard Bars (2 tons per bundle) and the balance still consider as cut&&bend bars. ' +
          'Click <OK> button to confirm the conversion.\n\n' +
          '在订单中包含了2吨以上的12/14米标准直铁, ' +
          lMeter12Str +
          '. 你可以把它转换成12/14米标准直铁订单(每捆2吨)，' +
          '剩余部分可仍然为加工铁. 点击<OK>按钮可确定这个转换.'
      );

      // startLoading();
      this.OrderdetailsLoading = true;
      await this.CheckNConvertSTDStart();
      if (this.isSaveFlag) {
        this.ReloadOrderDetails();
        this.isSaveFlag = false;
      }
      return true;
    }
    if (this.isSaveFlag) {
      this.UpdateBBS();
    }
    return false;
  }

  async CheckNConvertSTDStart() {
    var lCustomerCode = this.CustomerCode;
    var lProjectCode = this.ProjectCode;
    var lJobID = this.JobID;

    if (lCustomerCode != '' && lProjectCode != '' && lJobID > 0) {
      let response = await this.setCAB2SB(lCustomerCode, lProjectCode, lJobID);

      this.OrderdetailsLoading = false;

      if (response == false) {
        alert(
          'Error on converting Standard bar. Please check the Internet connection and try again.'
        );
      } else {
        if (response == true) {
          // reloadBBS();
          // await this.ReloadOrderDetails();

          /**
           * Call the API to get TableData
           * Using the updated tableData, refresh the values of weight in the sidemenu
           * (as it will be used for firther API calls like SaveBBS).
           */

          this.OrderdetailsLoading = true;

          let CustomerCode = this.CustomerCode;
          let ProjectCode = this.ProjectCode;
          let JobID = this.JobID;
          let BBSID = this.BBSId;
          for (let i = 0; i < this.orderDetailsTable.length; i++) {
            let lbbsId = this.orderDetailsTable[i].BBSID;
            if (lbbsId) {
              this.OrderdetailsLoading = true;
              await this.GetTableData(CustomerCode, ProjectCode, JobID, lbbsId);
              // await this.UpdateBBS();
            }
          }
          this.OrderdetailsLoading = false;
          alert('The convertion is complete successfully. 转换成功.');
        } else
          alert('Convertion error. Please try again or manually convert it.');
      }
    }
  }

  async DeleteBarDetails_CAB(
    lCustomerCode: any,
    lProjectCode: any,
    lJobID: any,
    lbbsID: any,
    lBarID: any
  ): Promise<any> {
    try {
      let UserName = this.loginService.GetGroupName();
      const data = this.orderService
        .deleteBarDetails(
          lCustomerCode,
          lProjectCode,
          lJobID,
          lbbsID,
          lBarID,
          UserName
        )
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async setCAB2SB(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any
  ): Promise<any> {
    try {
      let UserName = this.loginService.GetGroupName();
      const data = this.orderService
        .setCAB2SB(CustomerCode, ProjectCode, JobID, UserName)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
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
        } else {
          if (item.Cancelled) {
            meta.cssClasses += ' item-cancelled';
          } else {
            if (item.BarSTD && item.BarLength < 14000) {
              meta.cssClasses += ' item-barstd';
            } else if (item.BarSTD && item.BarLength >= 14000) {
              meta.cssClasses += ' item-bar14m';
            } else {
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
    };
  }

  incrementId(id: string): string {
    let lastChar: any = id[id.length - 1];

    let temp: any = id.split('');
    temp.pop();
    temp = temp.join('');

    if (isNaN(Number(lastChar))) {
      let code = lastChar.charCodeAt(0);
      let nextCode = code + 1;

      // Handle edge cases for 'z' and 'Z'
      if (lastChar === 'z' || lastChar === 'Z') {
        nextCode = nextCode - 26;
      }
      lastChar = String.fromCharCode(nextCode);
    } else {
      lastChar = Number(lastChar) + 1;
    }
    temp = temp + lastChar.toString();

    console.log('Given string', id);
    console.log('String return', temp);
    return temp;
  }

  isEditible() {
    // if (this.OrderStatus) {
    //   if (
    //     this.OrderStatus.toLowerCase().includes('created') ||
    //     this.OrderStatus.toLowerCase().includes('sent')
    //   ) {
    //     return true;
    //   }
    // }
    // return false;
    return this.NON_Editable ? false : true;
  }
  ShowImportButton(): boolean {
    return this.NON_Editable ? false : true;
    // if (this.OrderStatus) {
    //   if (this.OrderStatus.includes('Created')) {
    //     return true;
    //   }
    // }
    // return false;
  }

  UpdatePin() {
    this.orderService.GetPinMaster(this.BBSStandard).subscribe({
      next: (response) => {
        console.log('PIn', response);
        // this.ProjectStageList = response;
        this.gHStdDia = '';
        this.gHNonDia = '';
        this.gHNonMinLen = '0';
        this.gHNonMinLenHk = '0';
        this.gHNonMinHtHk = '0';
        this.gHStdMinLen = '0';
        this.gHStdMinLenHk = '0';
        this.gHStdMinHtHk = '0';
        this.gHStdFormer = '';
        this.gHNonFormer = '';

        this.gTStdDia = '';
        this.gTNonDia = '';
        this.gTNonMinLen = '0';
        this.gTNonMinLenHk = '0';
        this.gTNonMinHtHk = '0';
        this.gTStdMinLen = '0';
        this.gTStdMinLenHk = '0';
        this.gTStdMinHtHk = '0';
        this.gTStdFormer = '';
        this.gTNonFormer = '';

        this.gRStdDia = '';
        this.gRNonDia = '';
        this.gRNonMinLen = '0';
        this.gRNonMinLenHk = '0';
        this.gRNonMinHtHk = '0';
        this.gRStdMinLen = '0';
        this.gRStdMinLenHk = '0';
        this.gRStdMinHtHk = '0';
        this.gRStdFormer = '';
        this.gRNonFormer = '';

        this.gXStdDia = '';
        this.gXNonDia = '';
        this.gXNonMinLen = '0';
        this.gXNonMinLenHk = '0';
        this.gXNonMinHtHk = '0';
        this.gXStdMinLen = '0';
        this.gXStdMinLenHk = '0';
        this.gXStdMinHtHk = '0';
        this.gXStdFormer = '';
        this.gXNonFormer = '';

        this.gEStdDia = '';
        this.gENonDia = '';
        this.gENonMinLen = '0';
        this.gENonMinLenHk = '0';
        this.gENonMinHtHk = '0';
        this.gEStdMinLen = '0';
        this.gEStdMinLenHk = '0';
        this.gEStdMinHtHk = '0';
        this.gEStdFormer = '';
        this.gENonFormer = '';

        this.gDStdDia = '';
        this.gDNonDia = '';
        this.gDNonMinLen = '0';
        this.gDNonMinLenHk = '0';
        this.gDNonMinHtHk = '0';
        this.gDStdMinLen = '0';
        this.gDStdMinLenHk = '0';
        this.gDStdMinHtHk = '0';
        this.gDStdFormer = '';
        this.gDNonFormer = '';

        this.gNStdDia = '';
        this.gNNonDia = '';
        this.gNNonMinLen = '0';
        this.gNNonMinLenHk = '0';
        this.gNNonMinHtHk = '0';
        this.gNStdMinLen = '0';
        this.gNStdMinLenHk = '0';
        this.gNStdMinHtHk = '0';
        this.gNStdFormer = '';
        this.gNNonFormer = '';

        if (response.length > 0) {
          for (var i = 0; i < response.length; i++) {
            if (response[i].grade == 'H' || response[i].grade == 'C') {
              if (response[i].type == 'N') {
                this.gHNonDia = this.gHNonDia + ',' + response[i].dia;
                this.gHNonFormer = this.gHNonFormer + ',' + response[i].pin;
                this.gHNonMinLen =
                  this.gHNonMinLen + ',' + response[i].bend_len_min;
                this.gHNonMinLenHk =
                  this.gHNonMinLenHk + ',' + response[i].hook_len_min;
                this.gHNonMinHtHk =
                  this.gHNonMinHtHk + ',' + response[i].hook_height_min;
              }
              if (response[i].type == 'S') {
                this.gHStdDia = this.gHStdDia + ',' + response[i].dia;
                this.gHStdFormer = this.gHStdFormer + ',' + response[i].pin;
                this.gHStdMinLen =
                  this.gHStdMinLen + ',' + response[i].bend_len_min;
                this.gHStdMinLenHk =
                  this.gHStdMinLenHk + ',' + response[i].hook_len_min;
                this.gHStdMinHtHk =
                  this.gHStdMinHtHk + ',' + response[i].hook_height_min;
              }
            }
            if (response[i].grade == 'R') {
              if (response[i].type == 'N') {
                this.gRNonDia = this.gRNonDia + ',' + response[i].dia;
                this.gRNonFormer = this.gRNonFormer + ',' + response[i].pin;
                this.gRNonMinLen =
                  this.gRNonMinLen + ',' + response[i].bend_len_min;
                this.gRNonMinLenHk =
                  this.gRNonMinLenHk + ',' + response[i].hook_len_min;
                this.gRNonMinHtHk =
                  this.gRNonMinHtHk + ',' + response[i].hook_height_min;
              }
              if (response[i].type == 'S') {
                this.gRStdDia = this.gRStdDia + ',' + response[i].dia;
                this.gRStdFormer = this.gRStdFormer + ',' + response[i].pin;
                this.gRStdMinLen =
                  this.gRStdMinLen + ',' + response[i].bend_len_min;
                this.gRStdMinLenHk =
                  this.gRStdMinLenHk + ',' + response[i].hook_len_min;
                this.gRStdMinHtHk =
                  this.gRStdMinHtHk + ',' + response[i].hook_height_min;
              }
            }
            if (response[i].grade == 'T') {
              if (response[i].type == 'N') {
                this.gTNonDia = this.gTNonDia + ',' + response[i].dia;
                this.gTNonFormer = this.gTNonFormer + ',' + response[i].pin;
                this.gTNonMinLen =
                  this.gTNonMinLen + ',' + response[i].bend_len_min;
                this.gTNonMinLenHk =
                  this.gTNonMinLenHk + ',' + response[i].hook_len_min;
                this.gTNonMinHtHk =
                  this.gTNonMinHtHk + ',' + response[i].hook_height_min;
              }
              if (response[i].type == 'S') {
                this.gTStdDia = this.gTStdDia + ',' + response[i].dia;
                this.gTStdFormer = this.gTStdFormer + ',' + response[i].pin;
                this.gTStdMinLen =
                  this.gTStdMinLen + ',' + response[i].bend_len_min;
                this.gTStdMinLenHk =
                  this.gTStdMinLenHk + ',' + response[i].hook_len_min;
                this.gTStdMinHtHk =
                  this.gTStdMinHtHk + ',' + response[i].hook_height_min;
              }
            }
            if (response[i].grade == 'E') {
              if (response[i].type == 'N') {
                this.gENonDia = this.gENonDia + ',' + response[i].dia;
                this.gENonFormer = this.gENonFormer + ',' + response[i].pin;
                this.gENonMinLen =
                  this.gENonMinLen + ',' + response[i].bend_len_min;
                this.gENonMinLenHk =
                  this.gENonMinLenHk + ',' + response[i].hook_len_min;
                this.gENonMinHtHk =
                  this.gENonMinHtHk + ',' + response[i].hook_height_min;
              }
              if (response[i].type == 'S') {
                this.gEStdDia = this.gEStdDia + ',' + response[i].dia;
                this.gEStdFormer = this.gEStdFormer + ',' + response[i].pin;
                this.gEStdMinLen =
                  this.gEStdMinLen + ',' + response[i].bend_len_min;
                this.gEStdMinLenHk =
                  this.gEStdMinLenHk + ',' + response[i].hook_len_min;
                this.gEStdMinHtHk =
                  this.gEStdMinHtHk + ',' + response[i].hook_height_min;
              }
            }
            if (response[i].grade == 'D') {
              if (response[i].type == 'N') {
                this.gDNonDia = this.gDNonDia + ',' + response[i].dia;
                this.gDNonFormer = this.gDNonFormer + ',' + response[i].pin;
                this.gDNonMinLen =
                  this.gDNonMinLen + ',' + response[i].bend_len_min;
                this.gDNonMinLenHk =
                  this.gDNonMinLenHk + ',' + response[i].hook_len_min;
                this.gDNonMinHtHk =
                  this.gDNonMinHtHk + ',' + response[i].hook_height_min;
              }
              if (response[i].type == 'S') {
                this.gDStdDia = this.gDStdDia + ',' + response[i].dia;
                this.gDStdFormer = this.gDStdFormer + ',' + response[i].pin;
                this.gDStdMinLen =
                  this.gDStdMinLen + ',' + response[i].bend_len_min;
                this.gDStdMinLenHk =
                  this.gDStdMinLenHk + ',' + response[i].hook_len_min;
                this.gDStdMinHtHk =
                  this.gDStdMinHtHk + ',' + response[i].hook_height_min;
              }
            }
            if (response[i].grade == 'N') {
              if (response[i].type == 'N') {
                this.gNNonDia = this.gNNonDia + ',' + response[i].dia;
                this.gNNonFormer = this.gNNonFormer + ',' + response[i].pin;
                this.gNNonMinLen =
                  this.gNNonMinLen + ',' + response[i].bend_len_min;
                this.gNNonMinLenHk =
                  this.gNNonMinLenHk + ',' + response[i].hook_len_min;
                this.gNNonMinHtHk =
                  this.gNNonMinHtHk + ',' + response[i].hook_height_min;
              }
              if (response[i].type == 'S') {
                this.gNStdDia = this.gNStdDia + ',' + response[i].dia;
                this.gNStdFormer = this.gNStdFormer + ',' + response[i].pin;
                this.gNStdMinLen =
                  this.gNStdMinLen + ',' + response[i].bend_len_min;
                this.gNStdMinLenHk =
                  this.gNStdMinLenHk + ',' + response[i].hook_len_min;
                this.gNStdMinHtHk =
                  this.gNStdMinHtHk + ',' + response[i].hook_height_min;
              }
            }
            if (response[i].grade == 'X') {
              if (response[i].type == 'N') {
                this.gXNonDia = this.gXNonDia + ',' + response[i].dia;
                this.gXNonFormer = this.gXNonFormer + ',' + response[i].pin;
                this.gXNonMinLen =
                  this.gXNonMinLen + ',' + response[i].bend_len_min;
                this.gXNonMinLenHk =
                  this.gXNonMinLenHk + ',' + response[i].hook_len_min;
                this.gXNonMinHtHk =
                  this.gXNonMinHtHk + ',' + response[i].hook_height_min;
              }
              if (response[i].type == 'S') {
                this.gXStdDia = this.gXStdDia + ',' + response[i].dia;
                this.gXStdFormer = this.gXStdFormer + ',' + response[i].pin;
                this.gXStdMinLen =
                  this.gXStdMinLen + ',' + response[i].bend_len_min;
                this.gXStdMinLenHk =
                  this.gXStdMinLenHk + ',' + response[i].hook_len_min;
                this.gXStdMinHtHk =
                  this.gXStdMinHtHk + ',' + response[i].hook_height_min;
              }
            }
          }
        }
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  ConfirmCopy(data: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(AlertBoxComponent, ngbModalOptions);
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      if (x == true) {
        localStorage.setItem('CopyOrderDetails', JSON.stringify(data));
        const ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          //centered: true,
          size: 'lg',
        };
        const modalRef = this.modalService.open(
          CopyOrderDetailsComponent,
          ngbModalOptions
        );
        modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
          this.ReloadOrderDetails();
        });
      }
    });
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

  closeSideMenu() {
    this.reloadService.reloadSideMenu.emit();
  }

  async EditBBSTable(i: any) {
    this.editTable = this.isEditible() ? !this.editTable : this.editTable;
    this.EnableEditIndex = i;
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
    if (event?.ctrlKey) {
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
    } else if (event?.shiftKey) {
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

  lastButtonPresses: any = '';
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showTable == false) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
      }
      // Check if Shift + Down Arrow is pressed
      this.KeySelectOrderDetails(event);
    }
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

  selectInputText(event: MouseEvent): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  GetNewBBSNum() {
    // if (lColumnName == "BBSNo") {
    // if (grid.getCellEditor().getValue() == "" && grid.getDataLength() > 0) {
    if (this.orderDetailsTable.length > 0) {
      let lBBSNo =
        this.orderDetailsTable[this.orderDetailsTable.length - 1].BBSNo;
      if (lBBSNo == '') {
        lBBSNo =
          this.orderDetailsTable[this.orderDetailsTable.length - 2].BBSNo;
      }
      var lTypeCode = lBBSNo.substr(0, 1);
      if (
        lBBSNo != null &&
        lBBSNo != '' &&
        lBBSNo.substring(0, 1) == lTypeCode
      ) {
        lBBSNo = lBBSNo.trim();
        if (
          lBBSNo[lBBSNo.length - 1] >= 'A' &&
          lBBSNo[lBBSNo.length - 1] <= 'Y'
        ) {
          lBBSNo =
            lBBSNo.substring(0, lBBSNo.length - 1) +
            String.fromCharCode(lBBSNo.charCodeAt(lBBSNo.length - 1) + 1);
        } else {
          lBBSNo = lBBSNo + 'A';
        }
        for (let i = 0; i < this.orderDetailsTable.length; i++) {
          var lBBSNo1 = this.orderDetailsTable[i].BBSNo;
          if (lBBSNo1 == lBBSNo) {
            lBBSNo =
              lBBSNo.substring(0, lBBSNo.length - 1) +
              String.fromCharCode(lBBSNo.charCodeAt(lBBSNo.length - 1) + 1);
            i = 0;
          }
        }
        if (lBBSNo != '') {
          if (lBBSNo.length > 14) {
            this.toastr.error('Maximum length of BBS is 14 characters.');
            lBBSNo = lBBSNo.substring(0, 14);
          }
          // grid.getCellEditor().setValue(lBBSNo);
          // e.preventDefault();
          // e.stopPropagation();
          // e.stopImmediatePropagation();
          // return false;
        }
      }
      // }
      return lBBSNo;
    }
    return '';
  }

  async backToOrderSummary() {
    let lCustomerCode = this.CustomerCode;
    let lProjectCode = this.ProjectCode;
    let lJobID = this.JobID;
    let gUserType = this.loginService.GetUserType();

    if (lCustomerCode == null) {
      lCustomerCode = '';
    }
    if (lProjectCode == null) {
      lProjectCode = '';
    }
    lCustomerCode = lCustomerCode.trim();
    lProjectCode = lProjectCode.trim();

    if (lCustomerCode.length == 0) {
      alert(
        'Invalid customer code. Please start with New Order and choose a customer.'
      );
      return false;
    }

    if (lProjectCode.length == 0) {
      alert(
        'Invalid project code. Please start with New Order and choose a project.'
      );
      return false;
    }

    // document.getElementById("pCustomerCode").value = lCustomerCode;
    // document.getElementById("pProjectCode").value = lProjectCode;

    var lStatus = this.OrderStatus; // document.getElementById("order_status").value;
    if (
      (gUserType != 'PL' && gUserType != 'CU' && gUserType != 'CM') ||
      (lStatus != 'New' &&
        lStatus != 'Reserved' &&
        lStatus != 'Created' &&
        lStatus != 'Created*' &&
        (lStatus != 'Sent' || this.gOrderSubmission != 'Yes'))
    ) {
      // var lForm = document.getElementById('layout_submit') || null;
      // if (lForm) {
      //     // lForm.action = "/NewOrder/OrderSummary";
      //     // lForm.submit();
      // }
      // return;
    }

    //SaveSummary();

    var lCouplerType = this.CouplerType; // document.getElementById("coupler_type").value;
    var lNCouplerShape = 0;
    var lECouplerShape = 0;

    var lTransprt = this.TransportMode; // document.getElementById("transport_limit").value;
    if (lTransprt == 'Police Escort') {
      var r = confirm(
        'Need Low Bed with Police Escort for the material transportation, ' +
          'you have to pay addtional transportation charges. Confirm?\n\n' +
          '需要交警护送的超大件低盘拖车来运载您的钢筋, 您需要负责额外的运输费用. 请确认?'
      );
      if (r != true) {
        return false;
      }
    } else if (lTransprt == 'Low Bed') {
      var r = confirm(
        'Need Low Bed for the material transportation, ' +
          'you have to pay addtional transportation charges. Confirm?\n\n' +
          '需要超大件低盘拖车来运载您的钢筋, 您需要负责额外的运输费用. 请确认?'
      );
      if (r != true) {
        return false;
      }
    }

    //Slick.GlobalEditorLock.commitCurrentEdit();

    let grid = this.templateGrid.slickGrid;
    var lBBSLen = this.orderDetailsTable.length;
    if (lBBSLen <= 0) {
      alert(
        'Invalid BBS detail data. Please create BBS.\n\n 加工表号码无效, 请输入加工表号码.'
      );
      return false;
    } else {
      var lBBSNos = ' ';
      for (let i = 0; i < lBBSLen; i++) {
        let lItem = this.orderDetailsTable[i];
        if (lItem.BBSNo == null || lItem.BBSNo == '') {
          alert(
            'Invalid BBS Number. Please enter BBS Number and its details.\n\n 加工表号码无效, 请输入加工表号码.'
          );
          return false;
        }
        if (
          lItem.CABWeight != null &&
          lItem.CABWeight > 0 &&
          (lItem.StructureElement == null || lItem.StructureElement == '')
        ) {
          alert(
            'Invalid Structure Element. Please choose Structure Element.\n\n 无构件名称, 请选择构件名称.'
          );
          return false;
        }
        if (lItem.OrderWeight == null || isNaN(lItem.OrderWeight)) {
          alert('Invalid Order weight.');
          return false;
        }

        //if (lItem.OrderWeight > 32000 && lItem.CABWeight != null && lItem.CABWeight > 0) {
        //    alert("BBS " + lItem.BBSNo + " weight : " + lItem.OrderWeight
        //        + ", which is exceeded its 30 MT limit. Please add new BBS to split it.\n\n"
        //        + "加工表 " + lItem.BBSNo + " 的总重量为: " + lItem.OrderWeight
        //        + ", 它已超出30吨的限定数值. 请把他分拆到新的加工表.");
        //    return false;
        //}

        //if (lItem.OrderWeight > 60000 && (lItem.CABWeight == null || lItem.CABWeight == 0)) {
        //    alert("BBS " + lItem.BBSNo + " weight : " + lItem.OrderWeight
        //        + ", which is exceeded its 60 MT limit. Please add new BBS to split it.\n\n"
        //        + "加工表 " + lItem.BBSNo + " 的总重量为: " + lItem.OrderWeight
        //        + ", 它已超出60吨的限定数值. 请把他分拆到新的加工表.");
        //    return false;
        //}

        if (lBBSNos == ' ') lBBSNos = lItem.BBSNo;
        else lBBSNos = lBBSNos + ',' + lItem.BBSNo;
      }
      var lDBBSNos = await this.checkDBBBSNo(lBBSNos);
      if (lDBBSNos.length > 0) {
        if (
          confirm(
            'Duplicated BBSNo detected. Continue to back? \n\n' +
              '发现重复的加工表号码(BBS No), 继续?'
          ) != true
        ) {
          return false;
        }
      }
    }

    //var tabCount = $("div#tabs ul li").length;
    var tabCount = this.orderDetailsTable.length;
    if (tabCount > 0) {
      for (var i = 1; i <= tabCount; i++) {
        // gridArray[i].getEditorLock().commitCurrentEdit();
        this.SaveBarDetails(i, this.barRowIndex[i]);
        let dataViewArray = this.dataViewCAB;
        for (var j = 0; j < dataViewArray.getLength(); j++) {
          if (dataViewArray.getItem(0).Cancelled != true) {
            var lShape = dataViewArray.getItem(0).BarShapeCode;
            var lType = dataViewArray.getItem(0).BarType;
            var lDia = dataViewArray.getItem(0).BarSize;
            var lQty = dataViewArray.getItem(0).BarTotalQty;

            var lCouplerShapeInd = 0;
            if (
              lShape != null &&
              lShape.length > 0 &&
              (lShape.substring(0, 1) == 'H' ||
                lShape.substring(0, 1) == 'I' ||
                lShape.substring(0, 1) == 'J' ||
                lShape.substring(0, 1) == 'K')
            ) {
              lNCouplerShape = 1;
              lCouplerShapeInd = 1;
            }
            if (
              lShape != null &&
              lShape.length > 0 &&
              (lShape.substring(0, 1) == 'C' ||
                lShape.substring(0, 1) == 'N' ||
                lShape.substring(0, 1) == 'P' ||
                lShape.substring(0, 1) == 'S')
            ) {
              lECouplerShape = 1;
              lCouplerShapeInd = 1;
            }

            if (
              lQty != null &&
              lQty > 0 &&
              (lShape == null || lShape.trim() == '')
            ) {
              alert(
                'Invalid shape code. BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '\n\n' +
                  '请检擦图形码, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '.'
              );
              return false;
            }

            if (
              lShape != null &&
              lShape.trim() != '' &&
              (lType == null ||
                lType == '' ||
                lType == ' ' ||
                (lType.trim() != 'H' &&
                  lType.trim() != 'X' &&
                  this.gCustomerBar.indexOf(lType.trim()) < 0))
            ) {
              alert(
                'Invalid bar type found for shape code ' +
                  lShape +
                  ' BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '\n\n' +
                  '请检擦图形码' +
                  lShape +
                  '的型号, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '.'
              );
              return false;
            }
            if (
              lShape != null &&
              lShape.trim() != '' &&
              (lDia == null || lDia == '' || lDia == ' ')
            ) {
              alert(
                'Invalid bar diameter found for shape code ' +
                  lShape +
                  ' BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '\n\n' +
                  '请检擦图形码' +
                  lShape +
                  '的直径, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '.'
              );
              return false;
            }
            if (
              lShape != null &&
              lShape.trim() == 'R7A' &&
              lDia != null &&
              lDia >= 16
            ) {
              alert(
                'Invalid bar diameter found (Dia >= 16mm) for shape code ' +
                  lShape +
                  ' BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '\n\n' +
                  '请检擦图形码' +
                  lShape +
                  '的直径 (>= 16mm), 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '.'
              );
              return false;
            }
            if (
              lShape != null &&
              lShape.trim() != '' &&
              (lQty == null || lQty == '' || lQty == '0' || lQty == ' ')
            ) {
              alert(
                'Invalid qty found for shape code ' +
                  lShape +
                  ' BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '\n\n' +
                  '请检擦图形码' +
                  lShape +
                  '的数量, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '.'
              );
              return false;
            }

            //if (lType == "C" || lType == "E" || lType == "N") {
            if (lType == 'C') {
              lType = 'H';
            }

            if (lShape != null && lShape.trim() != '') {
              var lFound = 0;
              for (let k = 0; k < this.gSBBarType.length; k++) {
                if (lType == this.gSBBarType[k]) {
                  if (lDia == this.gSBBarSize[k]) {
                    lFound = 1;
                    break;
                  }
                }
              }
              if (lFound == 0) {
                alert(
                  'Invalid bar diameter found for shape code ' +
                    lShape +
                    ' BBS SNo ' +
                    (i - 1) +
                    ' Line ' +
                    (j + 1) +
                    '\n\n' +
                    '请检擦图形码' +
                    lShape +
                    '的数量, 位于 BBS 号码 ' +
                    (i - 1) +
                    ' 行号 ' +
                    (j + 1) +
                    '.'
                );
                return false;
              }
            }

            if (lCouplerShapeInd == 1 && lDia < 16) {
              alert(
                'For coupler, the smallest bar size is 16mm. BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '\n\n' +
                  '对有续接器的钢筋,仅允许钢筋直径大于或等于16mm, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '.'
              );
              return false;
            }

            if (lECouplerShape == 1 && lType == 'X' && lDia < 40) {
              alert(
                'For E-Splice coupler X rebar, the smallest bar size is 40mm.. BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '\n\n' +
                  'X等级E-Splice带续接器钢筋的最小直径为40mm, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '.'
              );
              return false;
            }

            //if (lShape == "79A" && lDia > 16) {
            //    alert("For shape 79A, only allow bar diameter <= 16mm. BBS SNo " + (i - 1) + " Line " + (j + 1) + "\n\n"
            //        + "对图形79A而言,仅允许钢筋直径小于或等于16mm, 位于 BBS 号码 " + (i - 1) + " 行号 " + (j + 1) + ".");
            //    return false;
            //}

            var lLength = dataViewArray.getItem(0).BarLength;
            var lMaxLength = this.getVarMaxValue(lLength);

            var lLenLimit = this.gMaxBarLength;
            if (lDia <= 8) {
              lLenLimit = 6000;
            } else if (lDia <= 16) {
              lLenLimit = 12000;
            }
            if (lMaxLength > lLenLimit) {
              var lTotalDed = await this.getCreepDedution(
                lMaxLength,
                dataViewArray.getItem(0)
              );
              if (lMaxLength - lTotalDed > lLenLimit) {
                //if (confirm("Total bar length is greater than " + gMaxBarLength + "mm for BBS SNo " + (i - 1) + " Line " + (j + 1) + ". Please confirm?\n\n"
                //    + "钢筋的长度已超过12米.  请检查, 位于 BBS 号码 " + (i - 1) + " 行号 " + (j + 1) + ". 请确认?") == false) {
                //    return false;
                //}
                alert(
                  'Total bar cut length ' +
                    (lMaxLength - lTotalDed) +
                    ', which is greater than ' +
                    lLenLimit +
                    'mm for BBS SNo ' +
                    (i - 1) +
                    ' Line ' +
                    (j + 1) +
                    '. \n\n' +
                    '钢筋的长度已超过' +
                    lLenLimit +
                    'mm.  请检查, 位于 BBS 号码 ' +
                    (i - 1) +
                    ' 行号 ' +
                    (j + 1) +
                    '.'
                );
                return false;
                //}
              }
            }

            var lMinLength = this.getVarMaxValue(lLength);
            if (
              lDia >= 40 &&
              lShape != '20' &&
              lShape != '020' &&
              lMinLength < 800
            ) {
              var lTotalDed = await this.getCreepDedution(
                lMinLength,
                dataViewArray.getItem(0)
              );
              if (lMinLength - lTotalDed < 500) {
                alert(
                  'Total bar cut length is ' +
                    (lMinLength - lTotalDed) +
                    ', which is less than minimum value 500mm for BBS SNo ' +
                    (i - 1) +
                    ' Line ' +
                    (j + 1) +
                    '. \n\n' +
                    '钢筋的长度已小于最小值500mm.  请检查, 位于 BBS 号码 ' +
                    (i - 1) +
                    ' 行号 ' +
                    (j + 1) +
                    '.'
                );
                return false;
              }
            }

            if (lShape != null && lShape.length >= 3 && lLength < 500) {
              var lFirst = lShape.substring(0, 1);
              var lLast = lShape.substring(2, 3);
              if (
                ((lFirst == 'H' ||
                  lFirst == 'I' ||
                  lFirst == 'J' ||
                  lFirst == 'K') &&
                  (lLast == 'H' ||
                    lLast == 'I' ||
                    lLast == 'J' ||
                    lLast == 'K')) ||
                ((lFirst == 'C' ||
                  lFirst == 'S' ||
                  lFirst == 'P' ||
                  lFirst == 'N') &&
                  (lLast == 'C' ||
                    lLast == 'S' ||
                    lLast == 'P' ||
                    lLast == 'N'))
              ) {
                alert(
                  'The minimum length is 500mm for coupler bar with 2 ends for BBS SNo ' +
                    (i - 1) +
                    ' Line ' +
                    (j + 1) +
                    '. \n\n' +
                    '两头都有续接器的钢筋,其最小长度为500mm.  请检查, 位于 BBS 号码 ' +
                    (i - 1) +
                    ' 行号 ' +
                    (j + 1) +
                    '.'
                );
                return false;
              }
            }

            if (lShape != null && lShape.length >= 1 && lLength < 500) {
              var lFirst = lShape.substring(0, 1);
              if (
                lFirst == 'H' ||
                lFirst == 'I' ||
                lFirst == 'J' ||
                lFirst == 'K' ||
                lFirst == 'C' ||
                lFirst == 'S' ||
                lFirst == 'P' ||
                lFirst == 'N'
              ) {
                alert(
                  'The minimum length is 500mm for coupler bar with 1 end for BBS SNo ' +
                    (i - 1) +
                    ' Line ' +
                    (j + 1) +
                    '. \n\n' +
                    '有续接器的钢筋,其最小长度为500mm. 请检查, 位于 BBS 号码 ' +
                    (i - 1) +
                    ' 行号 ' +
                    (j + 1) +
                    '.'
                );
                return false;
              }
            }

            var lSB = dataViewArray.getItem(0).BarSTD;
            var lWT = dataViewArray.getItem(0).BarWeight;

            if (
              lSB == true &&
              lLength != null &&
              (parseInt(lLength) == 12000 || parseInt(lLength) == 14000) &&
              lType != null &&
              lType.trim() != 'R' &&
              (lWT % 2000 > 0 || lWT < 2000)
            ) {
              //if (lSB == true && lLength != null && (parseInt(lLength) == 12000) && lType != null && lType.trim() != "R" && lType.trim() != "X" && ((lWT % 2000) > 0 || lWT < 2000)) {
              alert(
                'Invalid weight value entered for  BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '. 12m SB product can only order by bundles (2 tons per bundle). Please enter valid weight, such as 2000, 4000, 6000.' +
                  '(输入的重量无效, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '. 只能按捆来订购12米标准直铁产品(每捆2吨). 您可输入 2000, 4000, 6000 等等.)'
              );
              return false;
            }

            //if (lSB == true && lLength != null && lType != null && (parseInt(lLength) == 14000 || (parseInt(lLength) == 12000 && lType.trim() == "X")) && lType.trim() != "R" && (lWT < 2000)) {
            //    alert("Invalid weight value entered for  BBS SNo " + (i - 1) + " Line " + (j + 1) + ". 14m or 12m X grade SB product can only order by bundles (2+ tons per bundle). Please enter valid weight." +
            //        "(输入的重量无效, 位于 BBS 号码 " + (i - 1) + " 行号 " + (j + 1) + ". 只能按捆来订购14米标准直铁产品(每捆2吨).");
            //    return false;
            //}

            if (
              lSB == true &&
              lType != null &&
              lLength != null &&
              (parseInt(lLength) == 6000 || lType.trim() == 'R') &&
              (lWT % 1000 > 0 || lWT < 1000)
            ) {
              alert(
                'Invalid weight value entered for  BBS SNo ' +
                  (i - 1) +
                  ' Line ' +
                  (j + 1) +
                  '. 6m SB product can only order by bundles (1 tons per bundle). Please enter valid weight, such as 1000, 2000, 3000.' +
                  '(输入的重量无效, 位于 BBS 号码 ' +
                  (i - 1) +
                  ' 行号 ' +
                  (j + 1) +
                  '. 只能按捆来订购6米标准直铁产品(每捆1吨). 您可输入 1000, 2000, 3000 等等.)'
              );
              return false;
            }

            var lParameters = dataViewArray.getItem(0).shapeParameters;
            if (
              lShape != null &&
              lShape.trim() != '' &&
              lParameters != null &&
              lParameters != ''
            ) {
              var lParaA = lParameters.split(',');
              for (let k = 0; k < lParaA.length; k++) {
                if (dataViewArray.getItem(0)[lParaA[k]] == null) {
                  alert(
                    'Invalid shape parameter found for shape code ' +
                      lShape +
                      ' parameter ' +
                      lParaA[k] +
                      ' BBS SNo ' +
                      (i - 1) +
                      ' Line ' +
                      (j + 1) +
                      '\n\n' +
                      '请检擦图形码' +
                      lShape +
                      ', 参数' +
                      lParaA[k] +
                      '的数值, 位于 BBS 号码 ' +
                      (i - 1) +
                      ' 行号 ' +
                      (j + 1) +
                      '.'
                  );
                  return false;
                }
                if (
                  dataViewArray.getItem(0)[lParaA[k]] != null &&
                  dataViewArray.getItem(0)[lParaA[k]] != null &&
                  isNaN(dataViewArray.getItem(0)[lParaA[k]]) == true
                ) {
                  var lArrayP = dataViewArray.getItem(0)[lParaA[k]].split('-');
                  if (lArrayP.length != 2) {
                    alert(
                      'Invalid shape parameter found for shape code ' +
                        lShape +
                        ' parameter ' +
                        lParaA[k] +
                        ' BBS SNo ' +
                        (i - 1) +
                        ' Line ' +
                        (j + 1) +
                        '\n\n' +
                        '请检擦图形码' +
                        lShape +
                        ', 参数' +
                        lParaA[k] +
                        '的数值, 位于 BBS 号码 ' +
                        (i - 1) +
                        ' 行号 ' +
                        (j + 1) +
                        '.'
                    );
                    return false;
                  }
                  if (isNaN(lArrayP[0]) || isNaN(lArrayP[1])) {
                    alert(
                      'Invalid shape parameter found for shape code ' +
                        lShape +
                        ' parameter ' +
                        lParaA[k] +
                        ' BBS SNo ' +
                        (i - 1) +
                        ' Line ' +
                        (j + 1) +
                        '\n\n' +
                        '请检擦图形码' +
                        lShape +
                        ', 参数' +
                        lParaA[k] +
                        '的数值, 位于 BBS 号码 ' +
                        (i - 1) +
                        ' 行号 ' +
                        (j + 1) +
                        '.'
                    );
                    return false;
                  }
                  if (parseInt(lArrayP[0]) == parseInt(lArrayP[1])) {
                    alert(
                      'Invalid shape parameter found for shape code ' +
                        lShape +
                        ' variant parameter ' +
                        lArrayP[0] +
                        '-' +
                        lArrayP[1] +
                        ' BBS SNo ' +
                        (i - 1) +
                        ' Line ' +
                        (j + 1) +
                        '\n\n' +
                        '请检擦图形码' +
                        lShape +
                        '的参数数值, 位于 BBS 号码 ' +
                        (i - 1) +
                        ' 行号 ' +
                        (j + 1) +
                        '.'
                    );
                    return false;
                  }
                }
                if (dataViewArray.getItem(0)[lParaA[k]] <= 0) {
                  alert(
                    'Invalid shape parameter found for shape code ' +
                      lShape +
                      ' parameter ' +
                      lParaA[k] +
                      ' BBS SNo ' +
                      (i - 1) +
                      ' Line ' +
                      (j + 1) +
                      '\n\n' +
                      '请检擦图形码' +
                      lShape +
                      ', 参数' +
                      lParaA[k] +
                      '的数值, 位于 BBS 号码 ' +
                      (i - 1) +
                      ' 行号 ' +
                      (j + 1) +
                      '.'
                  );
                  return false;
                }
                if (this.gSkipBendCheck != 'Y') {
                  var msgRef = { msg: '' };
                  if (
                    this.isValidValue(
                      lParaA[k],
                      lParameters,
                      lDia,
                      dataViewArray.getItem(0)[lParaA[k]],
                      dataViewArray.getItem(0),
                      msgRef,
                      0
                    ) == false
                  ) {
                    alert(
                      'Invalid shape parameter found for shape code ' +
                        lShape +
                        ' parameter ' +
                        lParaA[k] +
                        ' BBS SNo ' +
                        (i - 1) +
                        ' Line ' +
                        (j + 1) +
                        '\n\n' +
                        '请检擦图形码' +
                        lShape +
                        ', 参数' +
                        lParaA[k] +
                        '的数值, 位于 BBS 号码 ' +
                        (i - 1) +
                        ' 行号 ' +
                        (j + 1) +
                        '.'
                    );
                    return false;
                  }
                }

                //if (lShape != null && lShape != "20" && lShape != "020" && lDia == 8 && dataViewArray[i].getItem(j)[lParaA[k]] > 1800) {
                //    if (lShape != null && ((lDia == 8 && (lShape == "020" || lShape == "20") && dataViewArray[i].getItem(j)[lParaA[k]] != 6000 && dataViewArray[i].getItem(j)[lParaA[k]] > 1800) ||
                //    (lDia == 8 && lShape != "020" && lShape != "20" && dataViewArray[i].getItem(j)[lParaA[k]] > 1800))) {
                //        alert("The maximum segment length is 1800mm for 8mm bar for shape code " + lShape + " parameter " + lParaA[k] + " BBS SNo " + (i - 1) + " Line " + (j + 1) + "\n\n"
                //            + "对8mm钢筋, 最大节长为1800mm. 请检擦图形码" + lShape + ", 参数" + lParaA[k] + "的数值, 位于 BBS 号码 " + (i - 1) + " 行号 " + (j + 1) + ".");
                //        return false;
                //    }
              }
              //Check various parameters range
              //if (isNaN(dataViewArray[i].getItem(j).BarLength) && dataViewArray[i].getItem(j).BarLength.indexOf("-") >= 0) {
              //    var lMax = getVarMaxValue(dataViewArray[i].getItem(j).BarLength);
              //    var lMin = getVarMinValue(dataViewArray[i].getItem(j).BarLength);

              //    var lMbrQty = dataViewArray[i].getItem(j).BarMemberQty;
              //    if (lMbrQty > 1) {
              //        var lHeight = Math.round((lMax - lMin) / (lMbrQty - 1));
              //        if (lHeight < 18) {
              //            alert("Difference of various bars is less than 18mm minimum limit. Please increase the difference of verious bar or reduce Member Qty for shape code " + lShape + " BBS SNo " + (i - 1) + " Line " + (j + 1) + "\n\n"
              //                + "可变钢筋的差值已小于18mm的最小值. 请增加差值或减少构件数. 请检擦图形码" + lShape + ", 位于 BBS 号码 " + (i - 1) + " 行号 " + (j + 1) + ".");
              //            return false;
              //        }
              //    }
              //}
            }
          }
        }

        //Check Various Bar
        if (
          this.gVarianceBarSplit == 'Y' &&
          this.getNoVariousBar(dataViewArray.getItems(), 9999) > 26
        ) {
          alert(
            'In BBS ' +
              grid.getDataItem(i - 2).BBSNo +
              ', have reached the maximum number of various bar items limit 26. Please create another order / BBS to split the BBS.\n\n' +
              '在BBS ' +
              grid.getDataItem(i - 2).BBSNo +
              '中,已达到变长钢筋的最大行数限制26。请创建另一个订单/BBS来拆分此BBS.'
          );
          return false;
        }
      }
    } else {
      alert('Invalid BBS detail data. \n\n加工表钢筋数据无效.');
      return false;
    }

    if (lNCouplerShape == 1 && lCouplerType.toUpperCase() != 'N-SPLICE') {
      alert(
        'Please choose N-Splice Coupler Type as the order includes N-Splice Coupler shape. \n\n请选择续接器类型.'
      );
      return false;
    }
    if (
      lECouplerShape == 1 &&
      lCouplerType.toUpperCase() != 'E-SPLICE(S)' &&
      lCouplerType.toUpperCase() != 'E-SPLICE(N)'
    ) {
      alert(
        'Please choose E-Splice Coupler Type as the order includes E-Splice Coupler shape. \n\n请选择续接器类型.'
      );
      return false;
    }

    //Check double capture

    let lResponseDE = await this.checkDoubleEntry(
      lCustomerCode,
      lProjectCode,
      lJobID
    );
    if (lResponseDE) {
      if (lResponseDE.success == false) {
        // stopLoading();
        alert(
          'Found double capture discrepancy. Please correct the error before back.'
        );
        return false;
      } else {
        // setTimeout(backToOrderSummaryRun, 500);
        return true;
      }
    } else {
      return false;
    }
  }

  async checkDoubleEntry(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .CheckDoubleEntry(CustomerCode, ProjectCode, JobID)
        .toPromise();
      return data;
    } catch (error) {
      alert('Error to check double entry.');
      return false;
    }
  }

  sideMenuChange(val: number) {
    this.sideMenuVisible = val;
    setTimeout(() => {
      this.templateGrid.resizerService.resizeGrid();
    }, 300);
  }

  testFunc(e: any) {
    if (e) {
      e = e.detail.eventData;
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }
  }
  lastSelectedOrder: any = undefined;
  async changeSelectionTab(order: any) {
    if (this.lastSelectedOrder) {
      this.saveSelectedRow(this.lastSelectedOrder);
    }
    this.SaveCABDetails_Local();
    // this.TotalWT_Transport();
    // await this.SaveOnTabChange();
    // await this.UpdateBBS();
    this.showTable = true;
    this.showShapeImage = false;
    this.gShapeCode = '';
    this.getData(order);
    this.closeSideMenu();
    this.removeSelectedRow();
    this.updateSelectedRows(order);

    this.lastSelectedOrder = order;
  }

  updateSelectedRows(order: any) {
    let lIndex = this.selectedRows.findIndex(
      (element) => element.bbsno == order.BBSNo
    );
    if (lIndex != -1) {
      // this.selectedRows.push(ltempObj);
      let lselectedRows = this.selectedRows[lIndex].rows;
      this.templateGrid.slickGrid.setSelectedRows(lselectedRows);
    }
  }

  removeSelectedRow() {
    this.templateGrid.slickGrid.setSelectedRows([]);
    this.templateGrid.slickGrid.resetActiveCell();
  }
  selectedRows: any[] = [];
  saveSelectedRow(order: any) {
    // Save
    if (order) {
      let ltempObj: any;
      let lselectedRows: any[] = this.templateGrid.slickGrid.getSelectedRows();
      if (lselectedRows) {
        ltempObj = {
          bbsno: order.BBSNo,
          rows: lselectedRows,
        };
      } else {
        ltempObj = {
          bbsno: order.BBSNo,
          rows: [],
        };
      }
      let lIndex = this.selectedRows.findIndex(
        (element) => element.bbsno == order.BBSNo
      );
      if (lIndex == -1) {
        this.selectedRows.push(ltempObj);
      } else {
        this.selectedRows[lIndex] = ltempObj;
      }
    }
  }

  SaveCurrentEdit(pGrid: any) {
    /**
     * Check the cell editor to if there are any input values
     * if present save them to the cell.
     */
    if (pGrid.getCellEditor()) {
      let lActiveCell = pGrid.getActiveCell();
      let lRow = pGrid.getDataItem(lActiveCell.row);
      let lColumnName = pGrid.getColumns()[lActiveCell.cell].name;

      let lEditorValue = pGrid.getCellEditor().getValue();

      if (lEditorValue) {
        lRow[lColumnName] = lEditorValue;
        this.dataViewCAB.updateItem(lRow.id, lRow);
      }
    }
  }

  SelectOrderSummary() {
    /**
     * Discrepencies found between table data and data in OrderSummary tab
     * Cause - BBS order details table is getting loaded before the updated BBS data is saved.
     */
    this.isSaveFlag = true;
    this.SaveCABDetails_Local();

    //  this.UpdateBBS();
  }

  UpdateCellStyle(args: any) {
    if (args) {
      // Get the object containg all the classes for cell highlight
      let lClass = args.grid.getCellCssStyles('error_highlight');

      let lRowStyle = lClass[args.row];
      let lColumnName = args.grid.getColumns()[args.cell].name;

      // If the cell has error highlight class, remove it
      if (lRowStyle) {
        if (lRowStyle[lColumnName]) {
          lRowStyle[lColumnName] = '';
          // Update the Style class
          args.grid.setCellCssStyles('error_highlight', lClass);

          args.grid.invalidate();
          args.grid.render();
          args.grid.focus();
          args.grid.editActiveCell();
        }
      }
    }
  }

  OnClickContextMenuCAB(lFuncs: string) {
    let lOrderStatus = this.OrderStatus;
    if (lFuncs == 'MoreInfo') {
      this.OpenMoreInfo();
    } else {
      if (
        ((lOrderStatus != 'New' &&
          lOrderStatus != 'Reserved' &&
          lOrderStatus != 'Created*' &&
          lOrderStatus != 'Created') ||
          this.gOrderCreation != 'Yes') &&
        (lOrderStatus != 'Sent' || this.gOrderSubmission != 'Yes')
      ) {
        return;
      }

      if (!this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit()) {
        return;
      }

      if (lFuncs == 'insert') {
        this.InsertItem();
      } else if (lFuncs == 'delete') {
        this.Delete();
      } else if (lFuncs == 'clear') {
        this.ClearRows();
      } else if (lFuncs == 'copy') {
        this.CopyRows();
      } else if (lFuncs == 'paste') {
        this.PasteRows();
      } else if (lFuncs == 'weight') {
        this.SubTotalWeight();
      } else if (lFuncs == 'qty') {
        this.SubTotalQty();
      }
    }
  }

  async SaveOnTabChange() {
    let rowNum = this.templateGrid.slickGrid.getActiveCell()?.row;
    if (rowNum != undefined || rowNum != null) {
      let lItem = this.templateGrid.slickGrid.getDataItem(rowNum);
      /** For Refreshing the Columns and the values of the selected row */
      let lActiveCell = this.templateGrid.slickGrid.getActiveCell();
      if (lActiveCell) {
        this.templateGrid.slickGrid.getEditorLock().commitCurrentEdit();
        this.templateGrid.slickGrid.setActiveCell(
          lActiveCell.row + 1,
          lActiveCell.cell
        );
        this.templateGrid.slickGrid.setActiveCell(
          lActiveCell.row,
          lActiveCell.cell
        );
      }
    }
    if (this.isSaveFlag) {
      this.CheckNConvertSTD();
    } else {
      this.UpdateBBS();
    }
  }

  OpenDimensionalComponent(): void {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      DimensioningRuleComponent,
      ngbModalOptions
    );
  }

  onSingleClick(args: any, index: number, item: any) {
    // Wait for the cell editor to initialize
    setTimeout(() => {
      let lEditor: any = args.grid.getCellEditor();

      if (lEditor) {
        // Set focus inside the editor (dropdown should appear when focused)
        if (lEditor && lEditor.show) {
          lEditor?.instance?.fetch('');
        }
      } else {
        console.warn('No valid editor found for autocomplete.');
      }
    }, 100);
  }

  CheckEditable(lSubmission: any, lCreation: any): void {
    let lOrderStatus = this.OrderStatus;
    // let lSubmission = this.commonService.Submission;
    // let lCreation = this.commonService.Submission;
    // if (
    //   lOrderStatus == 'New' ||
    //   lOrderStatus == 'Created' ||
    //   lOrderStatus == 'Created*' ||
    //   lOrderStatus == 'Submitted*' ||
    //   (lOrderStatus == 'Sent' && lSubmission == 'Yes')
    // ) {
    //   // return true;
    //   this.NON_Editable = false;
    // } else {
    //   // return false;
    //   this.NON_Editable = true;
    // }

    if (
      (lOrderStatus != 'New' &&
        lOrderStatus != 'Reserved' &&
        lOrderStatus != 'Sent' &&
        lOrderStatus != 'Created' &&
        lOrderStatus != 'Created*') ||
      lCreation != 'Yes' ||
      (lSubmission != 'Yes' && lOrderStatus == 'Sent')
    ) {
      this.NON_Editable = true;
    } else {
      this.NON_Editable = false;
    }

    if (this.NON_Editable) {
      if (this.templateGrid) {
        this.templateGrid.slickGrid.getOptions().editable = false;
        this.templateGrid.slickGrid.invalidateAllRows();
        this.templateGrid.slickGrid.render();
      }
    }
  }

  async TotalWT_Transport() {
    let lOrderStatus = this.OrderStatus;
    if (
      (this.gOrderCreation != 'Yes' ||
        (lOrderStatus != 'New' &&
          lOrderStatus != 'Reserved' &&
          lOrderStatus != 'Created*' &&
          lOrderStatus != 'Created')) &&
      (this.gOrderCreation != 'Yes' || lOrderStatus != 'Sent')
    ) {
      return;
    }

    var lCABWeight: any = 0;
    var lSBWeight: any = 0;
    var lTotalWeight: any = 0;
    var lSubCancelledWT: any = 0;
    var lSubOrderWT: any = 0;
    var lSubTotalWT: any = 0;
    var lSubCABWT: any = 0;
    var lSubSBWT: any = 0;
    var lLowBed: any = 0;
    var lEscort: any = 0;
    // var tabCount = $("div#tabs ul li").length;
    // let dataViewArray = this.dataViewCAB;
    // if (tabCount > 1) {
    for (let i = 0; i < this.BBSData_Local.length; i++) {
      lSubCancelledWT = 0;
      lSubOrderWT = 0;
      lSubTotalWT = 0;
      lSubCABWT = 0;
      lSubSBWT = 0;

      let lBBSData = this.BBSData_Local[i].lBBSData;

      for (let j = 0; j < lBBSData.length; j++) {
        if (lBBSData[j].Cancelled == true) {
          if (
            !isNaN(lBBSData[j].BarWeight) &&
            lBBSData[j].BarWeight != null &&
            lBBSData[j].BarWeight != ''
          )
            lSubCancelledWT =
              lSubCancelledWT + parseFloat(lBBSData[j].BarWeight);
        } else {
          if (lBBSData[j].BarSTD == true) {
            if (
              !isNaN(lBBSData[j].BarWeight) &&
              lBBSData[j].BarWeight != null &&
              lBBSData[j].BarWeight != ''
            )
              lSubSBWT = lSubSBWT + parseFloat(lBBSData[j].BarWeight);
          } else {
            if (
              !isNaN(lBBSData[j].BarWeight) &&
              lBBSData[j].BarWeight != null &&
              lBBSData[j].BarWeight != ''
            )
              lSubCABWT = lSubCABWT + parseFloat(lBBSData[j].BarWeight);
          }

          if (
            !isNaN(lBBSData[j].BarWeight) &&
            lBBSData[j].BarWeight != null &&
            lBBSData[j].BarWeight != ''
          )
            lSubOrderWT = lSubOrderWT + parseFloat(lBBSData[j].BarWeight);
          if (lBBSData[j].shapeTransport == 1) {
            lLowBed = lLowBed + 1;
          }
          if (lBBSData[j].shapeTransport == 2) {
            lEscort = lEscort + 1;
          }
        }
        if (
          !isNaN(lBBSData[j].BarWeight) &&
          lBBSData[j].BarWeight != null &&
          lBBSData[j].BarWeight != ''
        )
          lSubTotalWT = lSubTotalWT + parseFloat(lBBSData[j].BarWeight);
      }
      if (isNaN(lSubOrderWT)) lSubOrderWT = 0;
      if (isNaN(lSubCancelledWT)) lSubCancelledWT = 0;
      if (isNaN(lSubTotalWT)) lSubTotalWT = 0;
      if (isNaN(lSubCABWT)) lSubCABWT = 0;
      if (isNaN(lSubSBWT)) lSubSBWT = 0;

      lSubOrderWT = Math.round(lSubOrderWT * 1000) / 1000;
      lSubCancelledWT = Math.round(lSubCancelledWT * 1000) / 1000;
      lSubTotalWT = Math.round(lSubTotalWT * 1000) / 1000;
      lSubCABWT = Math.round(lSubCABWT * 1000) / 1000;
      lSubSBWT = Math.round(lSubSBWT * 1000) / 1000;

      // if (BBSdata[i - 2].BBSOrderWT == null || lSubOrderWT != BBSdata[i - 2].BBSOrderWT ||
      // BBSdata[i - 2].BBSCancelledWT == null || lSubCancelledWT != BBSdata[i - 2].BBSCancelledWT ||
      // BBSdata[i - 2].BBSTotalWT == null || lSubOrderWT != BBSdata[i - 2].BBSTotalWT ||
      // BBSdata[i - 2].BBSOrderCABWT == null || lSubCABWT != BBSdata[i - 2].BBSOrderCABWT ||
      // BBSdata[i - 2].BBSOrderSTDWT == null || lSubSBWT != BBSdata[i - 2].BBSOrderSTDWT) {
      //     if (BBSdata[i - 2].BBSOrderCABWT == null || lSubCABWT != BBSdata[i - 2].BBSOrderCABWT) {
      //         BBSdata[i - 2].BBSOrderCABWT = lSubCABWT;
      //         grid.updateCell(i - 2, 4);
      //     };
      //     if (BBSdata[i - 2].BBSOrderSTDWT == null || lSubSBWT != BBSdata[i - 2].BBSOrderSTDWT) {
      //         BBSdata[i - 2].BBSOrderSTDWT = lSubSBWT;
      //         grid.updateCell(i - 2, 5);
      //     };
      //     if (BBSdata[i - 2].BBSOrderWT == null || lSubOrderWT != BBSdata[i - 2].BBSOrderWT) {
      //         BBSdata[i - 2].BBSOrderWT = lSubOrderWT;
      //         grid.updateCell(i - 2, 6);
      //     };
      //     if (BBSdata[i - 2].BBSCancelledWT == null || lSubCancelledWT != BBSdata[i - 2].BBSCancelledWT) {
      //         BBSdata[i - 2].BBSCancelledWT = lSubCancelledWT;
      //         grid.updateCell(i - 2, 7);
      //     };
      //     if (BBSdata[i - 2].BBSTotalWT == null || lSubOrderWT != BBSdata[i - 2].BBSTotalWT) {
      //         BBSdata[i - 2].BBSTotalWT = lSubOrderWT;
      //         grid.updateCell(i - 2, 8);
      //     };
      //     ChangeInd = ChangeInd + 1;
      //     //SaveBBSData(i - 2);
      // }

      lTotalWeight = lTotalWeight + lSubOrderWT;
      lCABWeight = lCABWeight + lSubCABWT;
      lSBWeight = lSBWeight + lSubSBWT;
    }
    if (isNaN(lTotalWeight)) lTotalWeight = 0;
    if (isNaN(lCABWeight)) lCABWeight = 0;
    if (isNaN(lSBWeight)) lSBWeight = 0;

    lCABWeight = lCABWeight.toFixed(3);
    // if (document.getElementById("cab_weight").value == null || lCABWeight != parseFloat(document.getElementById("cab_weight").value)) {
    //     document.getElementById("cab_weight").value = lCABWeight;
    //     this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
    // }

    lSBWeight = lSBWeight.toFixed(3);
    // if (document.getElementById("sb_weight").value == null || lSBWeight != parseFloat(document.getElementById("sb_weight").value)) {
    //     document.getElementById("sb_weight").value = lSBWeight;
    //     this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
    // }

    lTotalWeight = lTotalWeight.toFixed(3);
    // if (document.getElementById("total_weight").value == null || lTotalWeight != parseFloat(document.getElementById("total_weight").value)) {
    //     document.getElementById("total_weight").value = lTotalWeight;
    //     this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
    // }

    if (lTotalWeight > 0 && lOrderStatus == 'New') {
      //lOrderStatus = "Created";
      this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
    }
    if (lEscort > 0) {
      if (this.TransportMode != 'Police Escort') {
        this.TransportMode = 'Police Escort';
        this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
      }
    } else if (lLowBed > 0) {
      if (this.TransportMode != 'Low Bed') {
        this.TransportMode = 'Low Bed';
        this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
      }
    } else {
      if (this.TransportMode != 'Normal') {
        this.TransportMode = 'Normal';
        this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
      }
    }
    
    // } else {
    //     document.getElementById("total_weight").value = 0;
    //     this.TransportMode = "";
    //     this.gJobAdviceChanged = this.gJobAdviceChanged + 1;
    // }

    this.SaveOnTabChange();
  }

  BBSData_Local: any[] = [];
  SaveCABDetails_Local() {
    // Save the table data locally.
    let lObj = {
      lBBSID: this.BBSId,
      lBBSData: this.dataViewCAB.getItems(),
    };

    if (this.closeOrderDetailsFlag == false) {
      // Update the empty list in the local variable, when the order details page is not closing.
      let lIndex = this.BBSData_Local.findIndex(
        (x) => x.lBBSID === lObj.lBBSID
      );
      if (lIndex != -1) {
        this.BBSData_Local[lIndex] = lObj;
      } else {
        this.BBSData_Local.push(lObj);
      }
    } else {
      if(lObj.lBBSData.length != 0 ){
        let lIndex = this.BBSData_Local.findIndex(
          (x) => x.lBBSID === lObj.lBBSID
        );
        if (lIndex != -1) {
          this.BBSData_Local[lIndex] = lObj;
        } else {
          this.BBSData_Local.push(lObj);
        }
      }
    }

    this.TotalWT_Transport();
  }

  SaveTableData_Local() {
    let CustomerCode = this.CustomerCode;
    let ProjectCode = this.ProjectCode;
    let JobID = this.JobID;
    this.BBSData_Local = [];

    for (let i = 0; i < this.orderDetailsTable.length; i++) {
      let BBSID = this.orderDetailsTable[i].BBSID;
      this.orderService
        .GetBarDetails(CustomerCode, ProjectCode, JobID, BBSID)
        .subscribe({
          next: (response) => {
            console.log('GetBarDetails', response);
            if (response) {
              let lObj = {
                lBBSID: response[0].BBSID,
                lBBSData: response,
              };

              let lIndex = this.BBSData_Local.findIndex(
                (x) => x.lBBSID === lObj.lBBSID
              );
              if (lIndex != -1) {
                this.BBSData_Local[lIndex] = lObj;
              } else {
                this.BBSData_Local.push(lObj);
              }
            }
          },
          error: (e) => {},
          complete: () => {},
        });
    }
  }

  navigateBBS_Flag: boolean = false;

  handleBBSKeyDown(lEvent: KeyboardEvent, index: number, id: string) {
    if (!lEvent?.key) return;

    const isArrowUp = lEvent.key === 'ArrowUp';
    const isArrowDown = lEvent.key === 'ArrowDown';

    if (isArrowUp || isArrowDown) {
      this.OrderdetailsLoading = true;

      setTimeout(() => {
        this.OrderdetailsLoading = false;
        isArrowUp
          ? this.navigateBBSUp(index, id)
          : this.navigateBBSDown(index, id);
        this.handleNavigation(index, id);
      }, 300);
    }

    let temp: any;
    this.SelectOrderDetailsTable(
      this.orderDetailsTable,
      this.orderDetailsTable[index],
      index,
      temp
    );
  }

  handleNavigation(index: number, id: string) {
    this.navigateBBS_Flag = true;
    this.SaveBBS_CAB(this.orderDetailsTable[index], id);
    // this.checkDuplicate(this.orderDetailsTable[index]);
  }

  navigateBBSUp(index: any, id: string) {
    if (index - 1 >= 0) {
      this.EnableEditIndex = index - 1;
      setTimeout(() => {
        let lInput = document.getElementById(id);
        lInput?.focus();
      }, 200);
    } else {
      this.editTable = false;
    }
  }

  navigateBBSDown(index: any, id: string) {
    if (index + 1 < this.orderDetailsTable.length) {
      this.EnableEditIndex = index + 1;
      setTimeout(() => {
        let lInput = document.getElementById(id);
        lInput?.focus();
      }, 200);
    } else {
      this.editTable = false;
    }
  }

  checkDuplicate_inList() {
    // Get all items with the same BBSNo
    let orderDetailsTable = this.orderDetailsTable;
    for (let i = 0; i < orderDetailsTable.length; i++) {
      let lItem = orderDetailsTable[i];
      const matchingItems = orderDetailsTable.filter(
        (item) => item.BBSNo === lItem.BBSNo
      );
      // If more than one exists, it's a duplicate
      if (matchingItems.length > 1) {
        // Update the flag of the first matching element.
        matchingItems[0].DuplicateBBS = true;
      } else {
        // No duplicates — reset the flag for the updated item only
        lItem.DuplicateBBS = false;
      }
    }
  }

  isCouplerBarQty(pShapeCode: string): boolean {
    if (pShapeCode) {
      let lFirst = pShapeCode.substring(0, 1);
      if (
        lFirst == 'H' ||
        lFirst == 'I' ||
        lFirst == 'J' ||
        lFirst == 'K' ||
        lFirst == 'C' ||
        lFirst == 'S' ||
        lFirst == 'P' ||
        lFirst == 'N'
      ) {
        return true;
      }
    }
    return false;
  }
  isDoubleCoupler(pShapeCode: string): boolean {
    if (pShapeCode) {
      let lLast = pShapeCode.substring(2, 3);
      if (
        lLast == 'H' ||
        lLast == 'I' ||
        lLast == 'J' ||
        lLast == 'K' ||
        lLast == 'C' ||
        lLast == 'S' ||
        lLast == 'P' ||
        lLast == 'N'
      ) {
        return true;
      }
    }
    return false;
  }

  checkDoubleCapture() {
    this.disableDoubleCapture = true;

    let UserName = this.loginService.GetGroupName();
    if (
      UserName != null &&
      UserName.includes('@') &&
      UserName.split('@')[1].toUpperCase() == 'NATSTEEL.COM.SG'
    ) {
      this.disableDoubleCapture = false;
    }
  }
  PrintBBSOrder() {
    debugger;
    // this.createSharedService.selectedOrderNumber = this.OrderSummaryTableData[0].OrderNumber
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    };
    let result: any = [];
    this.OrderSummaryTableData.forEach((element) => {
      result.push(element.OrderNumber);
    });
    const modalRef = this.modalService.open(
      PrintBBSOrderComponent,
      ngbModalOptions
    );
    modalRef.result.then((result: any) => {
      if (result == 1 || result == 2) {
        this.PrintBBSDetails(result);
      }
    });

    //modalRef.componentInstance.OrderNumber = result;
    // modalRef.componentInstance.CABJobID = 365656;
  }
}
