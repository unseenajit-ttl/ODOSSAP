import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AngularGridInstance, Column, Editors, GridOption, OnActiveCellChangedEventArgs, isObjectEmpty } from 'angular-slickgrid';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import * as THREE from 'three';
import { SpiralDialogComponent } from './spiral-dialog/spiral-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AdvanceOptionDialogComponent } from './advance-option-dialog/advance-option-dialog.component';
import { CopyGridDataModalComponent } from './copy-grid-data-modal/copy-grid-data-modal.component';
import { AddBPC } from 'src/app/Model/add_bpc';
import { DatePipe } from '@angular/common';
import { OrderService } from 'src/app/Orders/orders.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { Router } from '@angular/router';
import { dataTransferService } from 'src/app/SharedServices/dataTransferService';

@Component({
  selector: 'app-create-bore-pile-cage',
  templateUrl: './create-bore-pile-cage.component.html',
  styleUrls: ['./create-bore-pile-cage.component.css'],
})
export class CreateBorePileCageComponent {
  //Canvas Elements Starts
  @ViewChild('canvasPlanView')
  canvasp!: ElementRef<HTMLCanvasElement>;

  contextp!: CanvasRenderingContext2D;

  @ViewChild('canvasElevView')
  canvasEl!: ElementRef<HTMLCanvasElement>;

  contextEl!: CanvasRenderingContext2D;

  @ViewChild('view3D')
  view3DEle!: ElementRef<HTMLElement>;

  //first grid sort elements starts here
  concreteCover: any = 75;
  miscCages: any;
  changeCage: any;
  totalWeight: any;
  underloadCt: any = 0;
  //first grid sort elements ends here
  gCanvasHeight = 210;
  gCanvasWidth = 700;
  gTopHeight = 60;
  gLeftRightMargin = 20;
  gMinTop = 700;
  gMinEnd = 500;
  gCrankHeight = 5;
  gCrankWidth = 10;
  //first table variables definition starts here
  gridColumns: Column[] = [];
  grid!: AngularGridInstance;
  options!: GridOption;
  lastStaticTableWidth = '300';
  //first table variables definition ends here

  //table variables
  templateGrid!: AngularGridInstance;
  rebarGrid!: AngularGridInstance;
  gridOptions!: GridOption;
  templateDataView: any;
  templateColumns: Column[] = [];
  dataset: any;
  gPreCellRow = -1;
  gPreCellCol = 0;

  isBPCEditable: boolean = true;
  search_pile_dia: any = null;
  search_main_bar_dia: any = null;
  search_main_bar_qty: any = null;
  columnFilters: any;
  lPreMainBar: any;
  lPrePileDia: any;
  lPreCover: any;
  lText: any;
  lSpacingReal2: any;
  lSpacingReal1: any;
  lSpacingReal3: any;
  pScene: any;
  lBarCT: any;
  customerCode: any;
  projectCode: any;
  gTempPreRowNo = -1;
  gGridClearStart = 0;
  gPreRowNo = -1;
  gLibChanged = 0;
  gBBSChanged = 0;
  gSBPileDia: any;
  gSBMainBarSizeFr: any;
  gSBMainBarSizeTo: any;
  gSBMainBarQty: any;
  gSBLinkDia: any;
  gSBDia: any;

  //width elements
  // start
  canvasPlanViewWidth = 'col-md-3';
  canvasElevViewWIdth = 'col-md-5';
  rebarWidth = 'col-md-2';
  isBomActive = false;
  // end
  // canvasPlanViewWidth = '20%'
  // canvasElevViewWIdth = '40%'
  // rebarWidth = '35%'
  //template column dropdown collection starts here
  getPileType = [
    { value: 'Single-Layer', label: 'Single-Layer' },
    { value: 'Double-Layer', label: 'Double-Layer' },
    { value: 'Micro-Pile', label: 'Micro-Pile' },
  ];
  getPileCoverBackupCollection: any = [];
  getPileTypeBackup: any = [];
  getPileDiaBackup: any = [];
  getMainBarArrangeBackup: any = [];
  getMainBarTypeBackup: any = [];
  getMainBarShapeBackup: any = [];
  getMainBarGradeBackup: any = [];
  getMainBarDiameterBackup: any = [];
  getSpiralLinkTypeBackup: any = [];
  getSpiralLinkGradeBackup: any = [];
  getSpiralLinkDiameterBackup: any = [];
  getCageLocationBackup: any = [];
  getPileCoverCollection = [
    { value: 35, label: '35' },
    { value: 40, label: '40' },
    { value: 45, label: '45' },
    { value: 50, label: '50' },
    { value: 55, label: '55' },
    { value: 60, label: '60' },
    { value: 65, label: '65' },
    { value: 70, label: '70' },
    { value: 75, label: '75' },
    { value: 80, label: '80' },
    { value: 85, label: '85' },
    { value: 90, label: '90' },
    { value: 95, label: '95' },
    { value: 100, label: '100' },
  ];
  getPileDia = [
    { value: 450, label: '450' },
    { value: 500, label: '500' },
    { value: 600, label: '600' },
    { value: 700, label: '700' },
    { value: 800, label: '800' },
    { value: 900, label: '900' },
    { value: 1000, label: '1000' },
    { value: 1100, label: '1100' },
    { value: 1200, label: '1200' },
    { value: 1300, label: '1300' },
    { value: 1400, label: '1400' },
    { value: 1500, label: '1500' },
    { value: 1600, label: '1600' },
    { value: 1700, label: '1700' },
    { value: 1800, label: '1800' },
    { value: 1900, label: '1900' },
    { value: 2000, label: '2000' },
    { value: 2100, label: '2100' },
    { value: 2200, label: '2200' },
    { value: 2300, label: '2300' },
    { value: 2400, label: '2400' },
    { value: 2500, label: '2500' },
  ];

  getMainBarArrange = [
    { value: 'Single', label: 'Single' },
    { value: 'Side-By-Side', label: 'Side-By-Side' },
    { value: 'In-Out', label: 'In-Out' },
  ];

  getMainBarShape = [
    { value: 'Straight', label: 'Straight' },
    { value: 'Crank', label: 'Crank' },
    { value: 'Crank-Both', label: 'Crank-Both' },
  ];

  getMainBarGrade = [
    { value: 'H', label: 'H' },
    { value: 'T', label: 'T' },
    { value: 'X', label: 'X' },
  ];

  getMainBarDiameter: any = [
    { value: 50, label: '50' },
    { value: 40, label: '40' },
    { value: 32, label: '32' },
    { value: 28, label: '28' },
    { value: 25, label: '25' },
    { value: 20, label: '20' },
    { value: 16, label: '16' },
    { value: 13, label: '13' },
  ];

  getSpiralLinkType = [
    { value: '1 Spacing', label: '1 Spacing' },
    { value: '2 Spacing', label: '2 Spacing' },
    { value: '3 Spacing', label: '3 Spacing' },
    { value: 'Twin 1 Spacing', label: 'Twin 1 Spacing' },
    { value: 'Twin 2 Spacing', label: 'Twin 2 Spacing' },
    { value: 'Twin 3 Spacing', label: 'Twin 3 Spacing' },
    { value: 'Single-Twin', label: 'Single-Twin' },
    { value: 'Twin-Single', label: 'Twin-Single' },
  ];

  getSpiralLinkGrade = [
    { value: 'H', label: 'H' },
    { value: 'T', label: 'T' },
    { value: 'X', label: 'X' },
    { value: 'R', label: 'R' },
  ];

  getSpiralLinkDiameter: any = [
    { value: 16, label: '16' },
    { value: 13, label: '13' },
    { value: 10, label: '10' },
  ];

  getCageLocation = [
    { value: 'Top', label: 'Top' },
    { value: 'Middle', label: 'Middle' },
    { value: 'End', label: 'End' },
    { value: 'NA', label: 'NA' },
  ];
  getMainBarType = [
    { value: 'Single', label: 'Single' },
    { value: 'Mixed', label: 'Mixed' },
  ];
  //template column dropdown collection Ends here
  //Variable Declaration
  gLoadPileDia = [
    { value: 450, label: '450' },
    { value: 500, label: '500' },
    { value: 600, label: '600' },
    { value: 700, label: '700' },
    { value: 800, label: '800' },
    { value: 900, label: '900' },
    { value: 1000, label: '1000' },
    { value: 1100, label: '1100' },
    { value: 1200, label: '1200' },
    { value: 1300, label: '1300' },
    { value: 1400, label: '1400' },
    { value: 1500, label: '1500' },
    { value: 1600, label: '1600' },
  ];
  gLoadCages = [
    { value: 25, label: '25' },
    { value: 20, label: '20' },
    { value: 12, label: '12' },
    { value: 10, label: '10' },
    { value: 7, label: '7' },
    { value: 6, label: '6' },
    { value: 5, label: '5' },
    { value: 3, label: '3' },
    { value: 1, label: '1' },
  ];
  gOrderSubmission = 'No';
  gOrderCreation = 'Yes';
  gBPCDiaBackup: any = [];
  gBPCDia = [
    { value: 450, label: '450' },
    { value: 500, label: '500' },
    { value: 600, label: '600' },
    { value: 700, label: '700' },
    { value: 800, label: '800' },
    { value: 900, label: '900' },
    { value: 1000, label: '1000' },
    { value: 1100, label: '1100' },
    { value: 1200, label: '1200' },
    { value: 1300, label: '1300' },
    { value: 1400, label: '1400' },
    { value: 1500, label: '1500' },
    { value: 1600, label: '1600' },
    { value: 1700, label: '1700' },
    { value: 1800, label: '1800' },
    { value: 1900, label: '1900' },
    { value: 2000, label: '2000' },
    { value: 2100, label: '2100' },
    { value: 2200, label: '2200' },
    { value: 2500, label: '2500' },
  ];
  gMPCDia = [
    { value: 150, label: '150' },
    { value: 200, label: '200' },
    { value: 250, label: '250' },
    { value: 300, label: '300' },
    { value: 350, label: '350' },
    { value: 400, label: '400' },
    { value: 450, label: '450' },
  ];
  gMPCCentralizer = [
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 60, label: '60' },
    { value: 70, label: '70' },
    { value: 75, label: '75' },
    { value: 90, label: '90' },
    { value: 100, label: '100' },
    { value: 114, label: '114' },
    { value: 140, label: '140' },
    { value: 165, label: '165' },
    { value: 200, label: '200' },
  ];
  gCover = [
    { value: 30, label: '30' },
    { value: 35, label: '35' },
    { value: 40, label: '40' },
    { value: 45, label: '45' },
    { value: 50, label: '50' },
    { value: 55, label: '55' },
    { value: 60, label: '60' },
    { value: 65, label: '65' },
    { value: 70, label: '70' },
    { value: 75, label: '75' },
    { value: 80, label: '80' },
    { value: 90, label: '90' },
    { value: 95, label: '95' },
  ];
  bpcMainBarDia: any = [];
  bpcMainBarDiaBackup: any = [];
  bpcMainBarDiaMixed: any = [];
  bpcMainBarArrangeBackup: any = [];
  bpcMainBarArrange = [
    { value: 'Single', label: 'Single' },
    { value: 'Side-By-Side', label: 'Side-By-Side' },
    { value: 'In-Out', label: 'In-Out' },
    { value: 'Others', label: 'Others' },
  ];

  gMainBarDia = [
    { value: 50, label: '50' },
    { value: 40, label: '40' },
    { value: 32, label: '32' },
    { value: 28, label: '28' },
    { value: 25, label: '25' },
    { value: 20, label: '20' },
    { value: 16, label: '16' },
    { value: 13, label: '13' },
  ];

  gMainBarDiaMixed = [
    { value: 50, label: '50' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 32, label: '32' },
    { value: 50, label: '50' },
    { value: 28, label: '28' },
    { value: 50, label: '50' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 16, label: '16' },
    { value: 50, label: '50' },
    { value: 13, label: '13' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 40, label: '40' },
    { value: 40, label: '40' },
    { value: 40, label: '40' },
    { value: 32, label: '32' },
    { value: 40, label: '40' },
    { value: 28, label: '28' },
    { value: 40, label: '40' },
    { value: 25, label: '25' },
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 16, label: '16' },
    { value: 40, label: '40' },
    { value: 13, label: '13' },
    { value: 32, label: '32' },
    { value: 50, label: '50' },
    { value: 32, label: '32' },
    { value: 40, label: '40' },
    { value: 32, label: '32' },
    { value: 32, label: '32' },
    { value: 32, label: '32' },
    { value: 32, label: '32' },
    { value: 28, label: '28' },
    { value: 32, label: '32' },
    { value: 25, label: '25' },
    { value: 32, label: '32' },
    { value: 20, label: '20' },
    { value: 32, label: '32' },
    { value: 16, label: '16' },
    { value: 32, label: '32' },
    { value: 13, label: '13' },
    { value: 32, label: '32' },
    { value: 28, label: '28' },
    { value: 50, label: '50' },
    { value: 28, label: '28' },
    { value: 40, label: '40' },
    { value: 28, label: '28' },
    { value: 32, label: '32' },
    { value: 28, label: '28' },
    { value: 25, label: '25' },
    { value: 28, label: '28' },
    { value: 20, label: '20' },
    { value: 28, label: '28' },
    { value: 16, label: '16' },
    { value: 28, label: '28' },
    { value: 13, label: '13' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 25, label: '25' },
    { value: 40, label: '40' },
    { value: 25, label: '25' },
    { value: 32, label: '32' },
    { value: 25, label: '25' },
    { value: 28, label: '28' },
    { value: 25, label: '25' },
    { value: 13, label: '13' },
    { value: 20, label: '20' },
    { value: 16, label: '16' },
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 20, label: '20' },
    { value: 32, label: '32' },
    { value: 20, label: '20' },
    { value: 28, label: '28' },
    { value: 20, label: '20' },
    { value: 25, label: '25' },
    { value: 25, label: '25' },
    { value: 16, label: '16' },
    { value: 13, label: '13' },
    { value: 16, label: '16' },
    { value: 50, label: '50' },
    { value: 40, label: '40' },
    { value: 13, label: '13' },
    { value: 32, label: '32' },
    { value: 13, label: '13' },
  ];
  rowIndex: any = 0;
  gJobAdviceChanged: any = 0;
  lPileDia: any;
  sObjectMaterial: any;
  controls: any;
  scene = new THREE.Scene();
  orderStatus: any;

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Create a WebGLRenderer
  renderer = new THREE.WebGLRenderer();

  // Create OrbitControls
  lReturn: any;
  rebarDataTable: any[] = [];
  rebarData: any[] = [];
  JobIDBK: any;
  OrderNo: any;
  order_status: any;
  po_number_save: any;
  proj_wbs1: any;
  proj_wbs2: any;
  proj_wbs3: any;
  pile_category: any;
  po_number: any;
  structureElement: any;
  extra_support_bar_ind: any;
  extra_support_bar_dia: any;
  isScrollable: boolean = false;
  Customerlist:any[]=[]
  projectList:any[]=[]
  constructor(
    private dropdown: CustomerProjectService,
    private orderService: OrderService,
    private reloadService: ReloadService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private commonService:CommonService,
    public router: Router,
    private tranferService:dataTransferService
  ) {
    sessionStorage.setItem('displayscreenname', 'Detailing');

    this.getPileCoverBackupCollection = JSON.parse(
      JSON.stringify(this.getPileCoverCollection)
    );
    this.getPileTypeBackup = JSON.parse(JSON.stringify(this.getPileType));
    this.getMainBarArrangeBackup = JSON.parse(
      JSON.stringify(this.getMainBarArrange)
    );
    this.getMainBarTypeBackup = JSON.parse(JSON.stringify(this.getMainBarType));
    this.getPileDiaBackup = JSON.parse(JSON.stringify(this.getPileDia));
    this.getMainBarShapeBackup = JSON.parse(
      JSON.stringify(this.getMainBarShape)
    );
    this.getMainBarGradeBackup = JSON.parse(
      JSON.stringify(this.getMainBarGrade)
    );
    this.getMainBarDiameterBackup = JSON.parse(
      JSON.stringify(this.getMainBarDiameter)
    );
    this.getSpiralLinkTypeBackup = JSON.parse(
      JSON.stringify(this.getSpiralLinkType)
    );
    this.getSpiralLinkGradeBackup = JSON.parse(
      JSON.stringify(this.getSpiralLinkGrade)
    );
    this.getSpiralLinkDiameterBackup = JSON.parse(
      JSON.stringify(this.getSpiralLinkDiameter)
    );
    this.getCageLocationBackup = JSON.parse(
      JSON.stringify(this.getCageLocation)
    );
    this.bpcMainBarDia = JSON.parse(JSON.stringify(this.gMainBarDia));
    this.bpcMainBarDiaBackup = JSON.parse(JSON.stringify(this.gMainBarDia));
    this.bpcMainBarDiaMixed = JSON.parse(JSON.stringify(this.gMainBarDiaMixed));
    this.bpcMainBarArrangeBackup = JSON.parse(
      JSON.stringify(this.bpcMainBarArrange)
    );
    this.gBPCDiaBackup = JSON.parse(JSON.stringify(this.gBPCDia));
    this.gridOptions = {
      editable: true,
      enableCellNavigation: true,
      enableColumnReorder: false,
      enableSorting: true,
      enableFiltering: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 10,
      explicitInitialization: true,
      enableRowSelection: true,
      enableAutoTooltip: true,
      enableAddRow: true,
      enableAutoResize: true,
      autoResize: {
        maxHeight: 500,
        minHeight: 250,
      },
    };
    this.templateColumns = [
      {
        id: 'lib_id',
        name: 'SNo',
        field: 'lib_id',
        toolTip: 'Serial Number (序列号码)',
        minWidth: 35,
        width: 35,
        cssClass: 'center-align',
      },
      //{ id: "lib_name", name: "Name", field: "lib_name", toolTip: "Item Name (铁笼号码)", editor: Editors.text, maxlength: 35, minWidth: 120, width: 120, sortable: true },
      {
        id: 'pile_cover',
        name: 'Cover',
        field: 'pile_cover',
        toolTip: 'Bored pile concret cover (混凝土保护层)',
        minWidth: 35,
        width: 35,
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getPileCoverCollection = this.getPileCoverBackupCollection;
              this.getPileCoverCollection = this.getPileCoverCollection.filter(
                (barsize: any) => barsize.label.startsWith(searchText)
              );
              updateCallback(this.getPileCoverCollection); // add here the array
            },
          },
        },
        sortable: true,
        filterable: true,
        cssClass: 'center-align',
      },
      {
        id: 'pile_type',
        name: 'Pile Type',
        field: 'pile_type',
        toolTip: 'Bored pile type (钻孔桩类型)',
        minWidth: 75,
        width: 75,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getPileType = this.getPileTypeBackup;
              this.getPileType = this.getPileType.filter((barsize: any) =>
                barsize.label.toLowerCase().startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getPileType); // add here the array
            },
          },
        },
        validator: this.PileTypeValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'pile_dia',
        name: 'Pile Dia(mm)',
        field: 'pile_dia',
        toolTip: 'Bored pile diameter (钻孔桩直径)(mm)',
        minWidth: 55,
        width: 55,
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getPileDia = this.getPileDiaBackup;
              this.getPileDia = this.getPileDia.filter((barsize: any) =>
                barsize.label.startsWith(searchText.toString())
              );
              updateCallback(this.getPileDia); // add here the array
            },
          },
        },
        sortable: true,
        filterable: true,
        cssClass: 'center-align',
      },
      {
        id: 'set_code',
        name: 'Set Code',
        field: 'set_code',
        toolTip: 'Set Code ',
        minWidth: 155,
        width: 155,
        editor: {
          model: Editors.text,
        },
        cssClass: 'left-align',
        filterable: true,
      },
      {
        id: 'main_bar_arrange',
        name: 'Main Bar Arrange',
        field: 'main_bar_arrange',
        toolTip: 'main bar arrangement (主筋排法)',
        minWidth: 60,
        width: 60,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getMainBarArrange = this.getMainBarArrangeBackup;
              this.getMainBarArrange = this.getMainBarArrange.filter(
                (barsize: any) =>
                  barsize.label
                    .toLowerCase()
                    .startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getMainBarArrange); // add here the array
            },
          },
        },
        validator: this.BarArrangeValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'main_bar_type',
        name: 'Main Bar Type',
        field: 'main_bar_type',
        toolTip: 'Main bar type in terms of grade and size (主筋种类)',
        minWidth: 60,
        width: 60,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getMainBarType = this.getMainBarTypeBackup;
              this.getMainBarType = this.getMainBarType.filter((barsize: any) =>
                barsize.label.toLowerCase().startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getMainBarType); // add here the array
            },
          },
        },
        validator: this.BarTypeValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'main_bar_ct',
        name: 'No of Main Bars',
        field: 'main_bar_ct',
        toolTip: 'No of main bars (主筋数量)',
        minWidth: 40,
        width: 40,
        editor: { model: Editors.text },
        cssClass: 'center-align',
        // validator: this.MainBarCTValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'main_bar_shape',
        name: 'Main Bar Shape',
        field: 'main_bar_shape',
        toolTip: 'Main bar shape (主筋图形)',
        minWidth: 60,
        width: 60,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getMainBarShape = this.getMainBarShapeBackup;
              this.getMainBarShape = this.getMainBarShape.filter(
                (barsize: any) =>
                  barsize.label
                    .toLowerCase()
                    .startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getMainBarShape); // add here the array
            },
          },
        },
        sortable: true,
        filterable: true,
      },
      {
        id: 'main_bar_grade',
        name: 'Main bar grade',
        field: 'main_bar_grade',
        toolTip: 'Main bar grade (主筋等级)',
        minWidth: 40,
        width: 40,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getMainBarGrade = this.getMainBarGradeBackup;
              this.getMainBarGrade = this.getMainBarGrade.filter(
                (barsize: any) =>
                  barsize.label
                    .toLowerCase()
                    .startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getMainBarGrade); // add here the array
            },
          },
        },
        sortable: true,
        filterable: true,
      },
      {
        id: 'main_bar_dia',
        name: 'Main bar diameter',
        field: 'main_bar_dia',
        toolTip: 'Main bar diameter (主筋直径)',
        minWidth: 40,
        width: 40,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getMainBarDiameter = this.getMainBarDiameterBackup;
              this.getMainBarDiameter = this.getMainBarDiameter.filter(
                (barsize: any) => barsize.label.startsWith(searchText)
              );
              updateCallback(this.getMainBarDiameter); // add here the array
            },
          },
        },
        sortable: true,
        filterable: true,
      },
      {
        id: 'cage_length',
        name: 'Cage length',
        field: 'cage_length',
        toolTip: 'Cage length (铁笼长)',
        minWidth: 50,
        width: 50,
        editor: { model: Editors.text },
        cssClass: 'center-align',
        validator: this.CageLengthValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'spiral_link_type',
        name: 'Spiral link Type',
        field: 'spiral_link_type',
        toolTip: 'Spiral link Type (螺旋筋类型)',
        minWidth: 60,
        width: 60,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getSpiralLinkType = this.getSpiralLinkTypeBackup;
              this.getSpiralLinkType = this.getSpiralLinkType.filter(
                (barsize: any) =>
                  barsize.label
                    .toLowerCase()
                    .startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getSpiralLinkType); // add here the array
            },
          },
        },
        validator: this.LinkTypeValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'spiral_link_grade',
        name: 'Spiral link grade',
        field: 'spiral_link_grade',
        toolTip: 'Spiral link grade (螺旋筋等级)',
        minWidth: 45,
        width: 45,
        cssClass: 'center-align',
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getSpiralLinkGrade = this.getSpiralLinkGradeBackup;
              this.getSpiralLinkGrade = this.getSpiralLinkGrade.filter(
                (barsize: any) =>
                  barsize.label
                    .toLowerCase()
                    .startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getSpiralLinkGrade); // add here the array
            },
          },
        },
        sortable: true,
        filterable: true,
      },
      {
        id: 'spiral_link_dia',
        name: 'Spiral link diameter',
        field: 'spiral_link_dia',
        toolTip: 'Spiral link diameter (螺旋筋直径)',
        minWidth: 40,
        width: 40,
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getSpiralLinkDiameter = this.getSpiralLinkDiameterBackup;
              this.getSpiralLinkDiameter = this.getSpiralLinkDiameter.filter(
                (barsize: any) =>
                  barsize.label
                    .toLowerCase()
                    .startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getSpiralLinkDiameter); // add here the array
            },
          },
        },
        cssClass: 'center-align',
        sortable: true,
        filterable: true,
      },
      {
        id: 'spiral_link_spacing',
        name: 'Spiral link spacing',
        field: 'spiral_link_spacing',
        toolTip: 'Spiral link spacing (螺旋筋间距)',
        minWidth: 60,
        width: 60,
        editor: { model: Editors.text },
        cssClass: 'center-align',
        validator: this.LinkSpacingValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'lap_length',
        name: 'Lap length',
        field: 'lap_length',
        toolTip: 'Lap length reserved (桩顶重叠预留长度)',
        minWidth: 43,
        width: 43,
        editor: { model: Editors.text },
        cssClass: 'center-align',
        validator: this.LapLengthValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'end_length',
        name: 'End length',
        field: 'end_length',
        toolTip: 'End length (桩底预留长度)',
        minWidth: 43,
        width: 43,
        editor: { model: Editors.text },
        cssClass: 'center-align',
        validator: this.LapLengthValidator,
        sortable: true,
        filterable: true,
      },
      {
        id: 'cage_location',
        name: 'Cage Location',
        field: 'cage_location',
        toolTip:
          'The location of the cage in a entire pile (此铁笼在整个桩的位置)',
        minWidth: 60,
        width: 60,
        editor: {
          model: Editors.autocompleter,
          editorOptions: {
            showOnFocus: true,
            minLength: 1,
            classes: {
              // choose a custom style layout
              // 'ui-autocomplete': 'autocomplete-custom-two-rows',
              'ui-autocomplete': 'autocomplete-custom-four-corners',
            },
            fetch: (searchText: any, updateCallback: any) => {
              this.getCageLocation = this.getCageLocationBackup;
              this.getCageLocation = this.getCageLocation.filter(
                (barsize: any) =>
                  barsize.label
                    .toLowerCase()
                    .startsWith(searchText.toLowerCase())
              );
              updateCallback(this.getCageLocation); // add here the array
            },
          },
        },
        sortable: true,
        cssClass: 'center-align',
        filterable: true,
      },
      {
        id: 'cage_weight',
        name: 'Estimated weight',
        field: 'cage_weight',
        toolTip: 'Estimated weight (估计重量)',
        minWidth: 45,
        width: 45,
        editor: { model: Editors.text },
        cssClass: 'center-align',
        sortable: true,
        filterable: true,
      },
      {
        id: 'cage_remarks',
        name: 'Remarks',
        field: 'cage_remarks',
        toolTip: 'Remarks (备注)',
        minWidth: 50,
        width: 50,
        editor: { model: Editors.text },
        cssClass: 'center-align',
        sortable: true,
        filterable: true,
      },
      {
        id: 'optionlink',
        name: 'Advance Options',
        field: 'optionlink',
        toolTip:
          'Click button to access advance options (点击按钮显示和修改高级选项)',
        headerCssClass: 'cell-head',
        formatter: this.linkFormatter,
        cssClass: 'cell-row',
        minWidth: 100,
        width: 100,
        resizable: false,
        selectable: true,
        sortable: false,
      },
      {
        id: 'deletelink',
        name: 'Delete',
        field: 'deletelink',
        toolTip:
          'Click button to remove the cage from the order (点击按钮删除此产品)',
        headerCssClass: 'cell-head',
        formatter: this.linkFormatter,
        cssClass: 'cell-row',
        minWidth: 100,
        width: 100,
        resizable: false,
        selectable: true,
        sortable: false,
      },
      // {
      //   id: 'editCabLink',
      //   name: 'CAB Edit',
      //   field: 'editCabLink',
      //   toolTip:
      //     'Click button to edit CAB data',
      //   headerCssClass: 'cell-head',
      //   formatter: this.linkFormatter,
      //   cssClass: 'cell-row',
      //   minWidth: 100,
      //   width: 100,
      //   resizable: false,
      //   selectable: true,
      //   sortable: false,
      // }
      //uncomment code when cr deploy
    ];
  }
  ngOnInit() {
    this.commonService.changeTitle('BPC | ODOS');
    this.reloadSupportBar();
    // let storedObjectData: any = localStorage.getItem('MeshData');
    // let MeshData = JSON.parse(storedObjectData);
    if(this.commonService.getLocalStorage("DetailingProjectCode")){
      this.projectCode = this.commonService.getLocalStorage("DetailingProjectCode");
    }
    // this.projectCode = this.dropdown.getProjectCode();
    this.customerCode = this.dropdown.getCustomerCode();
    if (this.customerCode && this.projectCode) {
      this.reloadTemplateBPC(null, null);

    }
    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.customerCode = this.dropdown.getCustomerCode();
    });
    this.reloadService.reload$.subscribe((data) => {
      if (data) {
        // this.customerCode = this.dropdown.getCustomerCode();
        // let storedObjectData: any = localStorage.getItem('MeshData');
        // let MeshData = JSON.parse(storedObjectData);
        // this.projectCode = this.dropdown.getProjectCode();
        this.projectCode = this.commonService.getLocalStorage("DetailingProjectCode");
        this.reloadTemplateBPC(null, null);
      }
    });
    this.camera.position.z = 5;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  // setBasicData() {
  //  let rowData = this.createOrderService.selectedrecord;
  //  console.log("setBasicData=>",rowData)
  //  let wbs = rowData.WBS !="" ? rowData.WBS.split("/") : null;
  //  this.OrderNo = rowData.OrderNumber;
  //  this.orderService.getJobId(this.OrderNo).subscribe((resp:any)=>{
  //    this.JobIDBK = resp.BPCJobID
  //  })
  //  this.order_status=rowData.OrderStatus;
  //  this.po_number_save = rowData.PONumber;
  //  if(wbs != null && wbs != ""){
  //    this.proj_wbs1 = wbs[0];
  //    this.proj_wbs2 = wbs[1];
  //    this.proj_wbs3 = wbs[2];
  //  }
  //  this.pile_category = "BPC";
  //  this.po_number = rowData.PONumber;
  //  this.structureElement = rowData.StructureElement;
  //  if(this.customerCode && this.projectCode){
  //    this.reloadTemplateBPC(null, null);
  //  }
  // }
  ngAfterViewInit() {
    console.log('template columns', this.templateColumns, this.gridColumns);
    this.contextp = this.canvasp.nativeElement.getContext('2d')!;
    this.contextEl = this.canvasEl.nativeElement.getContext('2d')!;
    this.GetCustomer();
  }

  bpc_bom_switch(){
    if(this.isBomActive){
      this.lastStaticTableWidth = '100';
    }else{
      this.lastStaticTableWidth = '300';
    }
  }
  checkIsEditable(event: any) {
    this.templateGrid.slickGrid.getOptions().editable = this.isBPCEditable;
  }
  searchData(key: string, value: any) {
    this.reloadTemplateBPC(key, value);
  }
  //Validation Starts Here
  linkFormatter(
    row: any,
    cell: any,
    value: any,
    columnDef: any,
    dataContext: any
  ) {
    return value;
  }
  parameterValidator(value: any, args: any) {
    var lValue = value;

    if (isNaN(lValue) == true) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter valid numeric range.(输入数据无效, 请输入数字范围)',
      };
    }

    if (lValue.indexOf('.') >= 0) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue <= 0) {
      //alert("Invalid parameter value.");
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }
    return { valid: true, msg: null };
  }

  CageLengthValidator(value: any, args: any) {
    var lValue = value;

    if (isNaN(lValue) == true) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter number.(输入数据无效, 请输入数字)',
      };
    }

    if (lValue.indexOf('.') >= 0) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue < 3000) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid cage length. Its minimum value is 3000 mm.(输入数据无效, 铁龙的最小长度为 3000 mm)',
      };
    }
    if (lValue > 14000) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid cage length. Its maximum value is 14000 mm.(输入数据无效, 铁龙的最大长度为 14000 mm)',
      };
    }
    return { valid: true, msg: null };
  }

  PileDiaValidator(value: any, args: any) {
    var lValue = value;

    if (isNaN(lValue) == true) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter valid numeric range.(输入数据无效, 请输入数字范围)',
      };
    }

    if (lValue.indexOf('.') >= 0) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue <= 0) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid parameter value. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }
    if (lValue < 450) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid parameter value. Bored Pile Diameter should not be less than 500mm.(输入数据无效, 铁笼的直径不应小于500毫米)',
      };
    }
    if (lValue > 2500) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid parameter value. Bored Pile Diameter should not be more than 2500mm.(输入数据无效, 铁笼的直径不应小于500毫米)',
      };
    }
    return { valid: true, msg: null };
  }

  LapLengthValidator(value: any, args: any) {
    var lValue = value;

    var lCurrRow = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lItem = args.grid.getDataItem(lCurrRow);

    var lCageLength = lItem.cage_length;

    if (isNaN(lValue) == true) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter valid number.(输入数据无效, 请输入数字)',
      };
    }

    if (lValue.indexOf('.') >= 0) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
      };
    }

    if (lValue <= 0) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Negative value is not supported.(输入数据无效, 不支持负数)',
      };
    }
    if (lValue < 100) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg: 'Invalid data entered. Should not be less than 100mm.(输入数据无效, 应不小于100毫米)',
      };
    }
    if (lValue > lCageLength - 500) {
      //args.grid.getActiveCellNode().style.color = 'red';
      return {
        valid: false,
        msg:
          'Invalid data entered. Cage length: ' +
          lCageLength +
          ', but the value already ' +
          lValue +
          '.(输入数据无效, 请检查.)',
      };
    }
    return { valid: true, msg: null };
  }
  PileCoverValidator(value: any, args: any) {
    var lValue = value;
    if (this.iskeyExists(lValue, this.getPileCoverBackupCollection) == false) {
      // alert("Please enter valid pile cover!");
      return { valid: false, msg: 'Please enter valid pile cover!' };
    }
    return { valid: true, msg: null };
  }
  PileTypeValidator(value: any, args: any) {
    var lValue = value;

    var lUserType = '@(ViewBag.UserType)';
    if (lUserType == 'CU' || lUserType == 'CA') {
      if (lValue != 'Single-Layer') {
        //$(grid.getActiveCellNode()).stop(true, true).effect("highlight", { color: "red" }, 300);
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Sorry, currently user is only allowed to choose Single Layer. You may copy from NatSteel Standard Library or contact NatSteel project manager for multiple layer cage.',
        };
      }
    }
    return { valid: true, msg: null };
  }

  BarArrangeValidator(value: any, args: any) {
    var lValue = value;

    var lUserType = '@(ViewBag.UserType)';
    if (lUserType == 'CU' || lUserType == 'CA') {
      if (lValue != 'Single') {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Sorry, currently user is only allowed to choose Single bar arrangement. You may copy from NatSteel Standard Library or contact NatSteel project manager for Side-By-Side, In-Out and Others bar arrangement cage.',
        };
      }
    }
    return { valid: true, msg: null };
  }

  BarTypeValidator(value: any, args: any) {
    var lValue = value;

    var lUserType = '@(ViewBag.UserType)';
    if (lUserType == 'CU' || lUserType == 'CA') {
      if (lValue != 'Single') {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Sorry, currently user is only allowed to choose Single bar type. For fixed bar type cage, you may copy from NatSteel Standard Library or contact NatSteel project manager for details.',
        };
      }
    }
    return { valid: true, msg: null };
  }

  LinkTypeValidator(value: any, args: any) {
    var lValue = value;

    var lUserType = '@(ViewBag.UserType)';
    if (lUserType == 'CU' || lUserType == 'CA') {
      if (lValue != '1 Spacing' && lValue != '2 Spacing') {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Sorry, currently user is only allowed to 1-2 spacing links. For other link type cage, you may copy it from NatSteel Standard Library or contact NatSteel project manager for details.',
        };
      }
    }
    return { valid: true, msg: null };
  }

  MainBarCTValidator(value: any, args: any) {
    var lValue = value;

    if (args.grid.getActiveCell() == null) {
      return;
    }
    var lCurrRow = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lItem = args.grid.getDataItem(lCurrRow);

    var lLayer = lItem.pile_type;
    var lMainBarType = lItem.main_bar_type;
    var lPileDia = lItem.pile_dia;

    if (lLayer == 'Micro-Pile') {
      if (isNaN(lValue) == true) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter valid number.(输入数据无效, 请输入数字)',
        };
      }

      if (lValue.indexOf('.') >= 0) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
        };
      }

      if (lValue <= 0) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Negative value is not supported.(输入数据无效, 不支持负数)',
        };
      }
      if (lValue < 3) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Number of main bars for Micro Pile should not be less than 3.(输入数据无效, 主筋数量应该不小于3.',
        };
      }
      if (lValue > 6) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Number of main bars for Micro Plie should not be more than 6.(输入数据无效, 主筋数量应该不大于6.)',
        };
      }
    } else if (lLayer == 'Double-Layer' || lMainBarType == 'Mixed') {
      var lValueArr = lValue.split(',');
      if (lValueArr.length != 2) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. For double layer or mixed main bar type, the format of number of main bars should be "##,##", such as 18,9.',
        };
      } else {
        for (let i = 0; i < lValueArr.length; i++) {
          var lValueInt = lValueArr[i];
          if (isNaN(lValueInt) == true) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Please enter valid number.(输入数据无效, 请输入数字)',
            };
          }

          if (lValueInt.indexOf('.') >= 0) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
            };
          }

          if (lValueInt <= 0) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Negative value is not supported.(输入数据无效, 不支持负数)',
            };
          }
          if (lValueInt < 6 && i == 0) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Number of main bars should not be less than 6.(输入数据无效, 主筋数量应该不小于6.',
            };
          }
          if (lValueInt > 100) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Number of main bars should not be more than 100.(输入数据无效, 主筋数量应该不大于100.)',
            };
          }
        }
      }
    } else {
      if (isNaN(lValue) == true) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter valid number.(输入数据无效, 请输入数字)',
        };
      }

      if (lValue.indexOf('.') >= 0) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
        };
      }

      if (lValue <= 0) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Negative value is not supported.(输入数据无效, 不支持负数)',
        };
      }
      if (lValue < 4) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Number of main bars should not be less than 4.(输入数据无效, 主筋数量应该不小于4.',
        };
      }
      if (lValue < 6 && lPileDia > 800) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Number of main bars should not be less than 6.(输入数据无效, 主筋数量应该不小于6.',
        };
      }
      if (lValue > 100) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Number of main bars should not be more than 100.(输入数据无效, 主筋数量应该不大于100.)',
        };
      }
    }

    return { valid: true, msg: null };
  }

  LinkSpacingValidator(value: any, args: any) {
    var lValue = value;

    var lCurrRow = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lItem = args.grid.getDataItem(lCurrRow);

    var lLinkType = lItem.spiral_link_type;

    if (lLinkType == '1 Spacing' || lLinkType == 'Twin 1 Spacing') {
      if (isNaN(lValue) == true) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter valid number.(输入数据无效, 请输入数字)',
        };
      }

      if (lValue.indexOf('.') >= 0) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
        };
      }

      if (lValue <= 0) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Negative value is not supported.(输入数据无效, 不支持负数)',
        };
      }
      if (lValue < 50) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Spiral Link Spacing should not be less than 50.',
        };
      }
      if (lValue > 700) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. Spiral Link Spacing should not be more than 700.',
        };
      }
    } else {
      var lValueArr = lValue.split(',');
      if (
        (lLinkType == '2 Spacing' ||
          lLinkType == 'Twin 2 Spacing' ||
          lLinkType == 'Single-Twin' ||
          lLinkType == 'Twin-Single') &&
        lValueArr.length != 2
      ) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. For 2 Spacing or Twin 2 Spacing spiral link, the format of spiral link spacing should be "###,###", such as 200,240.',
        };
      } else if (
        (lLinkType == '3 Spacing' || lLinkType == 'Twin 3 Spacing') &&
        lValueArr.length != 3
      ) {
        //args.grid.getActiveCellNode().style.color = 'red';
        return {
          valid: false,
          msg: 'Invalid data entered. For 3 Spacing or Twin 3 Spacing spiral link, the format of spiral link spacing should be "###,###,###", such as 175,200,240.',
        };
      } else {
        for (let i = 0; i < lValueArr.length; i++) {
          var lValueInt = lValueArr[i];
          if (isNaN(lValueInt) == true) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Please enter valid number.(输入数据无效, 请输入数字)',
            };
          }

          if (lValueInt.indexOf('.') >= 0) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Please enter integer number.(输入数据无效, 请输入整数)',
            };
          }

          if (lValueInt <= 0) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Negative value is not supported.(输入数据无效, 不支持负数)',
            };
          }
          if (lValueInt < 50) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Spiral Link Spacing should not be less than 50.',
            };
          }
          if (lValueInt > 700) {
            //args.grid.getActiveCellNode().style.color = 'red';
            return {
              valid: false,
              msg: 'Invalid data entered. Spiral Link Spacing should not be more than 700.',
            };
          }
        }
      }
    }

    return { valid: true, msg: null };
  }
  //Validators End Here

  angularGridReady(event: Event) {
    this.templateGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.templateDataView = this.templateGrid.dataView;
    this.columnFilters = this.templateGrid.slickGrid.getColumns();
    this.contextp = this.canvasp.nativeElement.getContext('2d')!;
    this.contextEl = this.canvasEl.nativeElement.getContext('2d')!;
    this.templateGrid.slickGrid.onValidationError.subscribe((e, args) => {
      alert(args.validationResults.msg);
    });
    this.templateGrid.slickGrid.onBeforeEditCell.subscribe((e, args) => {
      this.gridBeforeActiveCellsChanged(e, args);
    });
    this.templateGrid.slickGrid.onActiveCellChanged.subscribe((e, args) => {
      this.gridActiveCellChanged(e, args);
    });
    this.templateGrid.slickGrid.onCellChange.subscribe((e, args) => {
      this.gridCellChanged(e, args);
    });
    this.templateGrid.slickGrid.onAddNewRow.subscribe((e, args) => {
      this.gridonAddNewRow(e, args);
    });
    this.templateGrid.slickGrid.onSelectedRowsChanged.subscribe((e, args) => {
      this.gridOnSelectedRowsChanged(e, args);
    });
    this.templateGrid.slickGrid.onKeyDown.subscribe((e, args) => {
      this.gridOnKeyDown(e, args);
    });
    this.templateGrid.slickGrid.onClick.subscribe((e, args) => {
      var cell = args.cell;
      const column = this.templateColumns[args.cell];
      console.log('column=>', column, cell);

      if (
        column.id === 'deletelink' ||
        column.id === 'optionlink' ||
        column.id === 'editCabLink'
      ) {
        const target = e.target as HTMLElement;
        const button = target.closest('.slick-cell-button');
        if (button) {
          const id = button.getAttribute('data-id');
          const name = button.getAttribute('data-name');
          console.log(id, '=>name=>', name);
          if (name == 'advanceOption') {
            this.advanceOptions(id);
          }
          if (name == 'delete') {
            this.deleteLibData(id);
          }
          if(name == "editCabLink") {
            this.redirectToCabEditPage(id);
          }
          // this.handleButtonClick(id);
        }
      }
      console.log('Cell clicked=>', cell);
    });

    $(this.templateGrid.slickGrid.getHeaderRow()).on(
      'change keyup',
      ':input',
      function (e) {
        var columnId = $(this).data('columnId');
        if (columnId != null) {
          this.columnFilters[columnId] = $.trim($(this).val());
          this.templateDataView.refresh();
        }
      }
    );

    this.templateGrid.slickGrid.onHeaderRowCellRendered.subscribe((e, args) => {
      $(args.node).empty();
      $("<input type='text' style='width:100%;'>")
        .data('columnId', args.column.id)
        .val(this.columnFilters[args.column.id])
        .appendTo(args.node);
    });

    this.templateGrid.dataView.onRowCountChanged.subscribe((e, args) => {
      this.templateGrid.slickGrid.updateRowCount();
      this.templateGrid.slickGrid.render();
    });

    this.templateGrid.dataView.onRowsChanged.subscribe((e, args) => {
      this.templateGrid.slickGrid.invalidateRows(args.rows);
      this.templateGrid.slickGrid.render();
    });
  }
  redirectToCabEditPage(pItemID: any) {

    if (this.templateGrid.slickGrid.getDataLength() > 0) {
      let pBPC = this.templateGrid.slickGrid.getDataItem(pItemID)
      var lCustomerCode = this.customerCode;
      var lProjectCode = this.projectCode;
      var lJobID = pBPC.JobID ? pBPC.JobID : null;
      var lCageID = pBPC.cage_id;
      var lTemplate = pBPC.Template;
      let bpcObj = {
        CustomerCode: lCustomerCode,
        ProjectCode: lProjectCode,
        JobID: lJobID,
        CageID: lCageID,
        Template: lTemplate,
      };
      this.tranferService.sendData(bpcObj);
        this.router.navigate(['/detailing/bpcCabEdit']);
    }
  }

  //Loads template grid data
  reloadTemplateBPC(pSearchType: any, pSearchString: any) {
    //ALL - all templates
    //PILEDIA
    //BARDIA
    //BARQTY
    var lCustomerCode = this.customerCode;
    var lProjectCode = this.projectCode;
    console.log('Customer and Project code=>', lCustomerCode, lProjectCode);
    var lPileDia = this.search_pile_dia;
    var lBarDia = this.search_main_bar_dia;
    var lBarQty = this.search_main_bar_qty;
    let obj = {
      CustomerCode: lCustomerCode,
      ProjectCode: lProjectCode,
      PileDia: lPileDia,
      BarDia: lBarDia,
      BarQty: lBarQty,
    };
    console.log('obj=>', obj);
    this.orderService.getTemplateData_bpc(obj).subscribe((response: any) => {
      console.log("getTemplateData_bpc=>",response);
      let templateData: any = [];
      if (response != null && response.length > 0) {
        this.isScrollable = true;
        for (let i = 0; i < response.length; i++) {
          //Cage Type
          templateData[i] = {
            id: i + 1,
            lib_id: i + 1,
            CustomerCode: response[i].CustomerCode,
            ProjectCode: response[i].ProjectCode,
            Template: response[i].Template,
            JobID: response[i].JobID,
            lib_name: response[i].PONumber,
            pile_cover: response[i].cover_to_link.toString(),
            cage_id: response[i].cage_id,
            pile_type: response[i].pile_type,
            pile_dia: response[i].pile_dia.toString(),
            cage_dia: response[i].cage_dia,
            set_code: response[i].set_code,
            main_bar_arrange: response[i].main_bar_arrange,
            main_bar_type: response[i].main_bar_type,
            main_bar_ct: response[i].main_bar_ct,
            main_bar_shape: response[i].main_bar_shape,
            main_bar_grade: response[i].main_bar_grade,
            main_bar_dia: response[i].main_bar_dia,
            main_bar_topjoin: response[i].main_bar_topjoin,
            main_bar_endjoin: response[i].main_bar_endjoin,
            cage_length: response[i].cage_length,
            spiral_link_type: response[i].spiral_link_type,
            spiral_link_grade: response[i].spiral_link_grade,
            spiral_link_dia: response[i].spiral_link_dia,
            spiral_link_spacing: response[i].spiral_link_spacing,
            lap_length: response[i].lap_length,
            end_length: response[i].end_length,
            cage_location: response[i].cage_location,
            rings_start: response[i].rings_start,
            rings_end: response[i].rings_end,
            rings_addn_no: response[i].rings_addn_no,
            rings_addn_member: response[i].rings_addn_member,
            coupler_top: response[i].coupler_top,
            coupler_end: response[i].coupler_end,
            no_of_sr: response[i].no_of_sr,
            sr_grade: response[i].sr_grade,
            sr_dia: response[i].sr_dia,
            sr_dia_add:
              response[i].sr_dia_add == null ? 13 : response[i].sr_dia_add,
            sr1_location: response[i].sr1_location,
            sr2_location: response[i].sr2_location,
            sr3_location: response[i].sr3_location,
            sr4_location: response[i].sr4_location,
            sr5_location: response[i].sr5_location,
            crank_height_top: response[i].crank_height_top,
            crank_height_end: response[i].crank_height_end,
            crank2_height_top: response[i].crank2_height_top,
            crank2_height_end: response[i].crank2_height_end,
            sl1_length: response[i].sl1_length,
            sl2_length: response[i].sl2_length,
            sl3_length: response[i].sl3_length,
            sl1_dia: response[i].sl1_dia,
            sl2_dia: response[i].sl2_dia,
            sl3_dia: response[i].sl3_dia,
            total_sl_length: response[i].total_sl_length,
            no_of_cr_top: response[i].no_of_cr_top,
            cr_spacing_top: response[i].cr_spacing_top,
            cr_posn_top: response[i].cr_posn_top == null ? 0 : response[i].cr_posn_top,
            no_of_cr_end: response[i].no_of_cr_end,
            cr_end_remarks:
              response[i].cr_end_remarks == null
                ? ''
                : response[i].cr_end_remarks,
            extra_support_bar_ind:
              response[i].extra_support_bar_ind == null
                ? 'None'
                : response[i].extra_support_bar_ind,
            extra_support_bar_dia:
              response[i].extra_support_bar_dia == null
                ? 0
                : response[i].extra_support_bar_dia,
            extra_cr_no:
              response[i].extra_cr_no == null ? 0 : response[i].extra_cr_no,
            extra_cr_loc:
              response[i].extra_cr_loc == null ? 0 : response[i].extra_cr_loc,
            extra_cr_dia:
              response[i].extra_cr_dia == null ? 0 : response[i].extra_cr_dia,
            cr_spacing_end: response[i].cr_spacing_end,
            cr_posn_end: response[i].cr_posn_end == null ? 0 : response[i].cr_posn_end,
            cr_top_remarks: response[i].cr_top_remarks == null ? "" : response[i].cr_top_remarks,
            mainbar_length_2layer: response[i].mainbar_length_2layer,
            mainbar_location_2layer: response[i].mainbar_location_2layer,
            bundle_same_type: response[i].bundle_same_type,
            per_set: response[i].per_set,
            bbs_no: response[i].bbs_no,
            cage_qty: response[i].cage_qty,
            cage_weight: parseFloat(response[i].cage_weight).toFixed(3),
            cage_remarks: response[i].cage_remarks,
            sap_mcode: response[i].sap_mcode,
            copyfrom_project: response[i].copyfrom_project,
            copyfrom_template: response[i].copyfrom_template,
            copyfrom_jobid: response[i].copyfrom_jobid,
            copyfrom_ponumber: response[i].copyfrom_ponumber,
            UpdateBy: '',
            UpdateDate: '',
            optionlink:`<button class="btn btn-secondary btn-sm slick-cell-button mt-0 p-1" data-id="${i}" data-name="advanceOption">Advance</button>`,
            deletelink:`<button class="btn btn-danger btn-sm slick-cell-button mt-0 p-1" data-id="${i}" data-name="delete">Delete</button>`,
            editCabLink: `<button class="btn btn-success btn-sm slick-cell-button mt-0 p-1" data-id="${i}" data-name="editCabLink">Edit Cab</button>`,
          };
        }
        this.gGridClearStart = 1;
        this.dataset = templateData;
        this.gGridClearStart = 0;
        this.templateGrid.slickGrid.autosizeColumns();
        this.templateGrid.resizerService.resizeGrid(0, { height: 500});
        this.templateGrid.resizerService.resizeGrid();
      } else {
        this.isScrollable = false;
        this.gGridClearStart = 1;
        this.templateGrid.slickGrid.invalidateAllRows();
        this.templateDataView.beginUpdate();
        this.templateDataView.setItems(templateData, 'lib_id');
        this.templateDataView.endUpdate();
        this.templateDataView.refresh();
        this.templateGrid.slickGrid.render();
        this.gGridClearStart = 0;
        this.templateGrid.resizerService.resizeGrid(0, { height: 100});
        this.templateGrid.resizerService.resizeGrid();
      }
    });
    this.removeCssClassFromAllCells('repeated_highlight')
    this.removeCssClassFromAllCells('highlighted');
  }
  removeCssClassFromAllCells(className: string) {
    const grid = this.templateGrid.slickGrid;
    const rowCount = grid.getDataLength();
    const columnCount = this.templateColumns.length;

    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < columnCount; col++) {
        const $cell = $(grid.getCellNode(row, col));

        if ($cell) {
          $cell.removeClass(className); // jQuery method to remove the CSS class
        }
      }
    }
  }
  //Grid change and load code starts here
  gridBeforeActiveCellsChanged(e: any, args: any) {
    var lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];

    if (
      this.isBPCEditable != true &&
      this.customerCode != '0000000000' &&
      lColumnName != 'cage_qty' &&
      lColumnName != 'per_set' &&
      lColumnName != 'bbs_no' &&
      lColumnName != 'cage_remarks'
    ) {
      this.gPreCellRow = args.row;
      this.gPreCellCol = args.cell;
      this.templateGrid.slickGrid.navigateRight();
      return;
    }

    if (lColumnName == 'pile_dia') {
      if (args.grid.getDataItem(args.row) != null) {
        var lType = args.grid.getDataItem(args.row).pile_type;
        this.getPileDiaBackup = this.getPileDiameterBasedOnType(lType);
        this.getPileDia = JSON.parse(JSON.stringify(this.getPileDiaBackup));
        // if (lType == 'Micro-Pile') {
        //   args.grid.getColumns()[args.cell].editor.collection = [
        //     { label: '450', value: '450' },
        //     { label: '400', value: '400' },
        //     { label: '350', value: '350' },
        //     { label: '320', value: '320' },
        //     { label: '300', value: '300' },
        //     { label: '290', value: '290' },
        //     { label: '270', value: '270' },
        //     { label: '250', value: '250' },
        //     { label: '240', value: '240' },
        //     { label: '220', value: '220' },
        //     { label: '200', value: '200' },
        //   ];
        //   // args.grid.getColumns()[args.cell].editorOptions.options = "450;400;350;320;300;290;270;250;240;220;200";
        // } else {
        //   args.grid.getColumns()[args.cell].editor.collection = [
        //     { label: '450', value: '450' },
        //     { label: '500', value: '500' },
        //     { label: '600', value: '600' },
        //     { label: '700', value: '700' },
        //     { label: '800', value: '800' },
        //     { label: '900', value: '900' },
        //     { label: '1000', value: '1000' },
        //     { label: '1100', value: '1100' },
        //     { label: '1200', value: '1200' },
        //     { label: '1300', value: '1300' },
        //     { label: '1400', value: '1400' },
        //     { label: '1500', value: '1500' },
        //     { label: '1600', value: '1600' },
        //     { label: '1700', value: '1700' },
        //     { label: '1800', value: '1800' },
        //     { label: '1900', value: '1900' },
        //     { label: '2000', value: '2000' },
        //     { label: '2100', value: '2100' },
        //     { label: '2200', value: '2200' },
        //     { label: '2300', value: '2300' },
        //     { label: '2400', value: '2400' },
        //     { label: '2500', value: '2500' },
        //   ];
        //   // args.grid.getColumns()[args.cell].editorOptions.options = "450;500;600;700;800;900;1000;1100;1200;1300;1400;1500;1600;1700;1800;1900;2000;2100;2200;2300;2400;2500";
        // }
      }
    }

    if (
      lColumnName == 'main_bar_dia' &&
      args.grid.getDataItem(args.row) != null
    ) {
      console.log('args.grid.getDataItem=>', args.grid.getDataItem(args.row));
      var lPileType = args.grid.getDataItem(args.row).pile_type;
      var lBarType = args.grid.getDataItem(args.row).main_bar_type;
      if (lPileType == 'Double-Layer' || lBarType == 'Mixed') {
        this.getMainBarDiameter = JSON.parse(JSON.stringify(this.gMainBarDiaMixed));
        this.getMainBarDiameterBackup = JSON.parse(JSON.stringify(this.gMainBarDiaMixed));
      } else if (lPileType == 'Micro-Pile') {
        this.getMainBarDiameter =[
          { label: '40', value: '40' },
          { label: '32', value: '32' },
          { label: '28', value: '28' },
          { label: '25', value: '25' },
          { label: '20', value: '20' },
        ];
        this.getMainBarDiameterBackup =[
          { label: '40', value: '40' },
          { label: '32', value: '32' },
          { label: '28', value: '28' },
          { label: '25', value: '25' },
          { label: '20', value: '20' },
        ];
        // args.grid.getColumns()[args.cell].editorOptions.options = "40;32;28;25;20";
      } else {
        this.getMainBarDiameter = JSON.parse(JSON.stringify(this.gMainBarDia));
        this.getMainBarDiameterBackup = JSON.parse(JSON.stringify(this.gMainBarDia));
      }
    }

    if (
      lColumnName == 'spiral_link_dia' &&
      args.grid.getDataItem(args.row) != null
    ) {
      var lPileType = args.grid.getDataItem(args.row).pile_type;
      if (lPileType == 'Micro-Pile') {
        this.getSpiralLinkDiameterBackup = [
          { label: '13', value: '13' },
          { label: '10', value: '10' },
          { label: '8', value: '8' },
          { label: '6', value: '6' },
        ];
        this.getSpiralLinkDiameter =[
          { label: '13', value: '13' },
          { label: '10', value: '10' },
          { label: '8', value: '8' },
          { label: '6', value: '6' },
        ];

        // args.grid.getColumns()[args.cell].editorOptions.options = "13;10;8;6";
      } else {
        this.getSpiralLinkDiameterBackup  = [
          { label: '16', value: '16' },
          { label: '13', value: '13' },
          { label: '10', value: '10' },
        ];
        this.getSpiralLinkDiameter  = [
          { label: '16', value: '16' },
          { label: '13', value: '13' },
          { label: '10', value: '10' },
        ];
        // args.grid.getColumns()[args.cell].editorOptions.options = "16;13;10";
      }
    }

    if (lColumnName == 'main_bar_arrange') {
      if (args.grid.getDataItem(args.row) != null) {
        var lType = args.grid.getDataItem(args.row).pile_type;
        if (lType == 'Double-Layer') {
          this.getMainBarArrange = [
            { label: 'Single', value: 'Single' },
            { label: 'Side-By-Side', value: 'Side-By-Side' },
          ]
          this.getMainBarArrangeBackup = [
            { label: 'Single', value: 'Single' },
            { label: 'Side-By-Side', value: 'Side-By-Side' },
          ]
          // args.grid.getColumns()[5].editorOptions.options = "Single;Side-By-Side";
        } else if (lType == 'Single-Layer') {
          this.getMainBarArrange = [
            { label: 'Single', value: 'Single' },
            { label: 'Side-By-Side', value: 'Side-By-Side' },
            { label: 'In-Out', value: 'In-Out' },
          ];
          this.getMainBarArrangeBackup = [
            { label: 'Single', value: 'Single' },
            { label: 'Side-By-Side', value: 'Side-By-Side' },
            { label: 'In-Out', value: 'In-Out' },
          ];
          // args.grid.getColumns()[5].editorOptions.options = "Single;Side-By-Side;In-Out";
        } else if (lType == 'Micro-Pile') {
          this.getMainBarArrange = [{ label: 'Single', value: 'Single' }];
          this.getMainBarArrangeBackup = [{ label: 'Single', value: 'Single' }];
        }
      }
    }
  }

  gridActiveCellChanged(e: any, args: any) {
    if (args.row != null) {
      console.log(
        'args.grid.getColumns(args.row)[args.cell]=>',
        args.grid.getColumns(args.row)[args.cell]
      );
      var lColumnName = args.grid.getColumns(args.row)[args.cell].id;

      if (lColumnName == 'main_bar_arrange') {
        if (args.grid.getDataItem(args.row) != null) {
          var lType = args.grid.getDataItem(args.row).pile_type;
          if (lType == 'Micro-Pile') {
            if (args.cell < this.gPreCellCol) {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateLeft();
            } else {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateRight();
            }
            return;
          }
        }
      }

      if (lColumnName == 'main_bar_type') {
        if (args.grid.getDataItem(args.row) != null) {
          var lType = args.grid.getDataItem(args.row).pile_type;
          if (lType == 'Double-Layer' || lType == 'Micro-Pile') {
            if (args.cell < this.gPreCellCol) {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateLeft();
            } else {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateRight();
            }
            return;
          }
        }
      }

      if (lColumnName == 'spiral_link_type') {
        if (args.grid.getDataItem(args.row) != null) {
          var lType = args.grid.getDataItem(args.row).pile_type;
          if (lType == 'Micro-Pile') {
            if (args.cell < this.gPreCellCol) {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateLeft();
            } else {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateRight();
            }
            return;
          }
        }
      }

      if (lColumnName == 'main_bar_shape') {
        if (args.grid.getDataItem(args.row) != null) {
          var lType = args.grid.getDataItem(args.row).pile_type;
          if (lType == 'Micro-Pile') {
            if (args.cell < this.gPreCellCol) {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateLeft();
            } else {
              this.gPreCellRow = args.row;
              this.gPreCellCol = args.cell;
              this.templateGrid.slickGrid.navigateRight();
            }
            return;
          }
        }
      }
      args.grid.focus();
      if (this.isBPCEditable && args.grid.getOptions().editable == true) {
        args.grid.editActiveCell();
      }
    }
  }


  gridonAddNewRow(e: any, args: any) {
    // if (isObjectEmpty(this.columnFilters) != true) {
    //   alert("Please clear your filter before adding new BPC library record.");
    //   return ;
    // }

    //var rowIndex = grid.getSelectedRows()[0];
    var item = args.item;
    //rowIndex = templateGrid.getActiveCell().row;

    this.rowIndex = args.grid.getDataLength();
    var lCustomerCode = this.customerCode;
    var lProjectCode = this.projectCode;
    var lJobID = 0;

    var lPileCategory = this.pile_category;
    item.lib_id = this.rowIndex + 1;
    item.id = this.rowIndex + 1;
    item.cage_id = 1;
    item.CustomerCode = lCustomerCode;
    item.ProjectCode = lProjectCode;
    item.Template = true;
    item.JobID = lJobID;
    item.copyfrom_project = '';
    item.copyfrom_jobid = 0;
    item.copyfrom_ponumber = '';
    item.cage_qty = 1;
    item.optionlink = `<button class="btn btn-secondary btn-sm slick-cell-button mt-0 p-1" data-id="${this.rowIndex}" data-name="advanceOption">Advance</button>`;
    item.deletelink = `<button class="btn btn-danger btn-sm slick-cell-button mt-0 p-1" data-id="${this.rowIndex}" data-name="delete">Delete</button>`;
    item.editCabLink = `<button class="btn btn-danger btn-sm slick-cell-button mt-0 p-1" data-id="${this.rowIndex}" data-name="editCabLink">Delete</button>`;

    if (item.pile_type != null) {
      if (item.pile_type == 'Micro-Pile') {
        lPileCategory = 'MPC';
      }
    }

    if (lPileCategory == 'BPC') {
      var lPreCage = null;
      if (this.rowIndex > 0) {
        lPreCage = args.grid.getDataItem(this.rowIndex - 1);
      }

      if (
        this.rowIndex == 0 ||
        (this.rowIndex > 0 &&
          lPreCage != null &&
          lPreCage.pile_type == 'Micro-Pile')
      ) {
        if (item.lib_name == null) {
          item.lib_name = '';
        }
        //if (item.pile_cover == null) {
        item.pile_cover = 75;
        //}
        if (item.pile_type == null) {
          item.pile_type = 'Single-Layer';
        }
        if (item.pile_dia == null) {
          item.pile_dia = '1000';
        }

        item.cage_dia = item.pile_dia - 2 * item.pile_cover;

        if (item.main_bar_arrange == null) {
          item.main_bar_arrange = 'Single';
        }
        if (item.main_bar_type == null) {
          item.main_bar_type = 'Single';
        }
        if (item.main_bar_ct == null) {
          item.main_bar_ct = '24';
        }
        if (item.main_bar_shape == null) {
          item.main_bar_shape = 'Straight';
        }
        if (item.main_bar_grade == null) {
          item.main_bar_grade = 'H';
        }
        if (item.main_bar_dia == null) {
          item.main_bar_dia = '32';
        }
        if (item.cage_length == null) {
          item.cage_length = '12000';
        }
        if (item.spiral_link_type == null) {
          item.spiral_link_type = '1 Spacing';
        }
        if (item.spiral_link_grade == null) {
          item.spiral_link_grade = 'H';
        }
        if (item.spiral_link_dia == null) {
          item.spiral_link_dia = '10';
          item.sl1_dia = '10';
        }
        if (item.sl1_dia == null) {
          item.sl1_dia = '10';
        }
        if (item.sl2_dia == null) {
          item.sl2_dia = '10';
        }
        if (item.sl3_dia == null) {
          item.sl3_dia = '10';
        }
        if (item.spiral_link_spacing == null) {
          item.spiral_link_spacing = '200';
        }
        if (item.lap_length == null) {
          item.lap_length = '900';
        }
        if (item.end_length == null) {
          item.end_length = '100';
        }

        if (item.cage_location == null) {
          item.cage_location = 'Top';
        }

        if (item.sl1_length == null) {
          item.sl1_length = 0;
        }

        if (item.sl2_length == null) {
          item.sl2_length = 0;
        }

        if (item.sl3_length == null) {
          item.sl3_length = 0;
        }

        if (item.no_of_sr == null) {
          item.no_of_sr = 0;
        }

        if (item.sr_grade == null) {
          item.sr_grade = 'H';
        }

        if (item.sr_dia == null) {
          item.sr_dia = 0;
        }

        if (item.sr1_location == null) {
          item.sr1_location = 0;
        }

        if (item.sr2_location == null) {
          item.sr2_location = 0;
        }

        if (item.sr3_location == null) {
          item.sr3_location = 0;
        }

        if (item.sr4_location == null) {
          item.sr4_location = 0;
        }

        if (item.sr5_location == null) {
          item.sr5_location = 0;
        }

        if (item.rings_start == null) {
          item.rings_start = 3;
        }

        if (item.rings_end == null) {
          item.rings_end = 2;
        }

        if (item.rings_addn_member == null) {
          item.rings_addn_member = 0;
        }

        if (item.rings_addn_no == null) {
          item.rings_addn_no = 0;
        }

        if (item.no_of_cr_top == null) {
          item.no_of_cr_top = 0;
        }

        if (item.cr_spacing_top == null) {
          item.cr_spacing_top = 0;
        }

        if (item.no_of_cr_end == null) {
          item.no_of_cr_end = 0;
        }

        if (item.cr_end_remarks == null) {
          item.cr_end_remarks = '';
        }
        if (item.cr_posn_top == null) {
          item.cr_posn_top = 0;
        }
        if (item.cr_spacing_end == null) {
          item.cr_spacing_end = 0;
        }
        if (item.cr_posn_end == null) {
          item.cr_posn_end = 0;
        }
        if (item.cr_top_remarks == null) {
          item.cr_top_remarks = "";
        }

        if (item.extra_support_bar_ind == null) {
          item.extra_support_bar_ind = 'None';
        }

        if (item.extra_support_bar_dia == null) {
          item.extra_support_bar_dia = 0;
        }

        if (item.extra_cr_no == null) {
          item.extra_cr_no = 0;
        }

        if (item.extra_cr_loc == null) {
          item.extra_cr_loc = 0;
        }

        if (item.extra_cr_dia == null) {
          item.extra_cr_dia = 0;
        }

        if (item.cr_spacing_end == null) {
          item.cr_spacing_end = 0;
        }

        if (item.coupler_top == null) {
          item.coupler_top = 'No-Coupler';
        }
        if (item.coupler_end == null) {
          item.coupler_end = 'No-Coupler';
        }
        if (item.crank_height_top == null) {
          item.crank_height_top = 0;
        }
        if (item.crank_height_end == null) {
          item.crank_height_end = 0;
        }
        if (item.crank2_height_top == null) {
          item.crank2_height_top = 0;
        }
        if (item.crank2_height_end == null) {
          item.crank2_height_end = 0;
        }
        if (item.mainbar_length_2layer == null) {
          item.mainbar_length_2layer = 12000;
        }
        if (item.mainbar_location_2layer == null) {
          item.mainbar_location_2layer = 0;
        }
        if (item.cage_qty == null || item.cage_qty == 0) {
          if (this.isBPCEditable != true && this.customerCode != '0000000000') {
            var lPileDia = item.pile_dia;
            item.cage_qty = this.getLoadCages(lPileDia);
          } else {
            item.cage_qty = 1;
          }
        }
        item.bundle_same_type = 'N';
      } else {
        var lPreCage = args.grid.getDataItem(this.rowIndex - 1);
        if (lPreCage != null) {
          if (item.lib_name == null) {
            item.lib_name = lPreCage.lib_name;
          }
          //if (item.pile_cover == null) {
          item.pile_cover = lPreCage.pile_cover;
          //}
          if (item.pile_type == null) {
            item.pile_type = lPreCage.pile_type;
          }
          if (item.pile_dia == null) {
            item.pile_dia = lPreCage.pile_dia;
          }
          item.cage_dia = item.pile_dia - 2 * item.pile_cover;

          if (item.main_bar_arrange == null) {
            item.main_bar_arrange = lPreCage.main_bar_arrange;
          }
          if (item.main_bar_type == null) {
            item.main_bar_type = lPreCage.main_bar_type;
          }
          if (item.main_bar_ct == null) {
            item.main_bar_ct = lPreCage.main_bar_ct;
          }
          if (item.main_bar_shape == null) {
            item.main_bar_shape = lPreCage.main_bar_shape;
          }
          if (item.main_bar_grade == null) {
            item.main_bar_grade = lPreCage.main_bar_grade;
          }
          if (item.main_bar_dia == null) {
            item.main_bar_dia = lPreCage.main_bar_dia;
          }
          if (item.cage_length == null) {
            item.cage_length = lPreCage.cage_length;
          }
          if (item.spiral_link_type == null) {
            item.spiral_link_type = lPreCage.spiral_link_type;
          }
          if (item.spiral_link_grade == null) {
            item.spiral_link_grade = lPreCage.spiral_link_grade;
          }
          if (item.spiral_link_dia == null) {
            item.spiral_link_dia = lPreCage.spiral_link_dia;
          }
          if (item.spiral_link_spacing == null) {
            item.spiral_link_spacing = lPreCage.spiral_link_spacing;
          }
          if (item.lap_length == null) {
            item.lap_length = lPreCage.lap_length;
          }
          if (item.end_length == null) {
            item.end_length = lPreCage.end_length;
          }
          if (item.cage_location == null) {
            item.cage_location = lPreCage.cage_location;
          }

          if (item.sl1_length == null) {
            item.sl1_length = lPreCage.sl1_length;
          }

          if (item.sl2_length == null) {
            item.sl2_length = lPreCage.sl2_length;
          }

          if (item.sl3_length == null) {
            item.sl3_length = lPreCage.sl3_length;
          }

          if (item.sl1_dia == null) {
            item.sl1_dia = lPreCage.sl1_dia;
          }

          if (item.sl2_dia == null) {
            item.sl2_dia = lPreCage.sl2_dia;
          }

          if (item.sl3_dia == null) {
            item.sl3_dia = lPreCage.sl3_dia;
          }
          if (item.no_of_sr == null) {
            item.no_of_sr = lPreCage.no_of_sr;
          }

          if (item.sr_grade == null) {
            item.sr_grade = lPreCage.sr_grade;
          }

          if (item.sr_dia == null) {
            item.sr_dia = lPreCage.sr_dia;
          }

          if (item.sr1_location == null) {
            item.sr1_location = lPreCage.sr1_location;
          }

          if (item.sr2_location == null) {
            item.sr2_location = lPreCage.sr2_location;
          }

          if (item.sr3_location == null) {
            item.sr3_location = lPreCage.sr3_location;
          }

          if (item.sr4_location == null) {
            item.sr4_location = lPreCage.sr4_location;
          }

          if (item.sr5_location == null) {
            item.sr5_location = lPreCage.sr5_location;
          }

          if (item.rings_start == null) {
            item.rings_start = lPreCage.rings_start;
          }

          if (item.rings_end == null) {
            item.rings_end = lPreCage.rings_end;
          }

          if (item.rings_addn_member == null) {
            item.rings_addn_member = lPreCage.rings_addn_member;
          }

          if (item.rings_addn_no == null) {
            item.rings_addn_no = lPreCage.rings_addn_no;
          }

          if (item.no_of_cr_top == null) {
            item.no_of_cr_top = lPreCage.no_of_cr_top;
          }

          if (item.cr_spacing_top == null) {
            item.cr_spacing_top = lPreCage.cr_spacing_top;
          }

          if (item.no_of_cr_end == null) {
            item.no_of_cr_end = lPreCage.no_of_cr_end;
          }

          if (item.cr_end_remarks == null) {
            item.cr_end_remarks = lPreCage.cr_end_remarks;
          }

          if (item.extra_support_bar_ind == null) {
            item.extra_support_bar_ind = lPreCage.extra_support_bar_ind;
          }

          if (item.extra_support_bar_dia == null) {
            item.extra_support_bar_dia = lPreCage.extra_support_bar_dia;
          }

          if (item.extra_cr_no == null) {
            item.extra_cr_no = lPreCage.extra_cr_no;
          }

          if (item.extra_cr_loc == null) {
            item.extra_cr_loc = lPreCage.extra_cr_loc;
          }

          if (item.extra_cr_dia == null) {
            item.extra_cr_dia = lPreCage.extra_cr_dia;
          }

          if (item.cr_spacing_end == null) {
            item.cr_spacing_end = lPreCage.cr_spacing_end;
          }

          if (item.coupler_top == null) {
            item.coupler_top = lPreCage.coupler_top;
          }
          if (item.coupler_end == null) {
            item.coupler_end = lPreCage.coupler_end;
          }
          if (item.crank_height_top == null) {
            item.crank_height_top = lPreCage.crank_height_top;
          }
          if (item.crank_height_end == null) {
            item.crank_height_end = lPreCage.crank_height_end;
          }
          if (item.crank2_height_top == null) {
            item.crank2_height_top = lPreCage.crank2_height_top;
          }
          if (item.crank2_height_end == null) {
            item.crank2_height_end = lPreCage.crank2_height_end;
          }
          if (item.mainbar_length_2layer == null) {
            item.mainbar_length_2layer = lPreCage.mainbar_length_2layer;
          }
          if (item.mainbar_location_2layer == null) {
            item.mainbar_location_2layer = lPreCage.mainbar_location_2layer;
          }
          if (item.bundle_same_type == null) {
            item.bundle_same_type = lPreCage.bundle_same_type;
          }
          if (item.cage_qty == null || item.cage_qty == 0) {
            if (
              this.isBPCEditable != true &&
              this.customerCode != '0000000000'
            ) {
              var lPileDia = item.pile_dia;
              item.cage_qty = this.getLoadCages(lPileDia);
            } else {
              item.cage_qty = 1;
            }
          }
        }
        item.no_of_cr_end = args.grid.getDataItem(this.rowIndex - 1).no_of_cr_end;
      }
    } else {
      var lPreCage = null;
      if (this.rowIndex > 0) {
        lPreCage = args.grid.getDataItem(this.rowIndex - 1);
      }
      if (
        this.rowIndex == 0 ||
        (this.rowIndex > 0 &&
          lPreCage != null &&
          lPreCage.pile_type != 'Micro-Pile')
      ) {
        if (item.lib_name == null) {
          item.lib_name = '';
        }
        //if (item.pile_cover == null) {
        item.pile_cover = 75;
        //}
        if (item.pile_type == null) {
          item.pile_type = 'Single-Layer';
        }
        if (item.pile_dia == null) {
          item.pile_dia = '350';
        }

        item.cage_dia = item.pile_dia - 2 * item.pile_cover;

        if (item.main_bar_arrange == null) {
          item.main_bar_arrange = 'Single';
        }
        if (item.main_bar_type == null) {
          item.main_bar_type = 'Single';
        }
        if (item.main_bar_ct == null) {
          item.main_bar_ct = '6';
        }
        if (item.main_bar_shape == null) {
          item.main_bar_shape = 'Straight';
        }
        if (item.main_bar_grade == null) {
          item.main_bar_grade = 'H';
        }
        if (item.main_bar_dia == null) {
          item.main_bar_dia = '32';
        }
        if (item.cage_length == null) {
          item.cage_length = '12000';
        }
        if (item.spiral_link_type == null) {
          item.spiral_link_type = '1 Spacing';
        }
        if (item.spiral_link_grade == null) {
          item.spiral_link_grade = 'H';
        }
        if (item.spiral_link_dia == null) {
          item.spiral_link_dia = '10';
          item.sl1_dia = '10';
        }
        if (item.sl1_dia == null) {
          item.sl1_dia = '10';
        }
        if (item.sl2_dia == null) {
          item.sl2_dia = '10';
        }
        if (item.sl3_dia == null) {
          item.sl3_dia = '10';
        }
        if (item.spiral_link_spacing == null) {
          item.spiral_link_spacing = '200';
        }
        if (item.lap_length == null) {
          item.lap_length = '100';
        }
        if (item.end_length == null) {
          item.end_length = '100';
        }

        if (item.cage_location == null) {
          item.cage_location = 'Top';
        }

        if (item.sl1_length == null) {
          item.sl1_length = 0;
        }

        if (item.sl2_length == null) {
          item.sl2_length = 0;
        }

        if (item.sl3_length == null) {
          item.sl3_length = 0;
        }

        if (item.no_of_sr == null) {
          item.no_of_sr = 0;
        }

        if (item.sr_grade == null) {
          item.sr_grade = 'H';
        }

        if (item.sr_dia == null) {
          item.sr_dia = 0;
        }

        if (item.sr1_location == null) {
          item.sr1_location = 0;
        }

        if (item.sr2_location == null) {
          item.sr2_location = 0;
        }

        if (item.sr3_location == null) {
          item.sr3_location = 0;
        }

        if (item.sr4_location == null) {
          item.sr4_location = 0;
        }

        if (item.sr5_location == null) {
          item.sr5_location = 0;
        }

        if (item.rings_start == null) {
          item.rings_start = 3;
        }

        if (item.rings_end == null) {
          item.rings_end = 2;
        }

        if (item.rings_addn_member == null) {
          item.rings_addn_member = 0;
        }

        if (item.rings_addn_no == null) {
          item.rings_addn_no = 0;
        }

        if (item.no_of_cr_top == null) {
          item.no_of_cr_top = 0;
        }

        if (item.cr_spacing_top == null) {
          item.cr_spacing_top = 0;
        }

        if (item.no_of_cr_end == null) {
          item.no_of_cr_end = 0;
        }

        if (item.cr_end_remarks == null) {
          item.cr_end_remarks = '';
        }
        if (item.cr_posn_top == null) {
          item.cr_posn_top = 0;
        }
        if (item.cr_spacing_end == null) {
          item.cr_spacing_end = 0;
        }
        if (item.cr_posn_end == null) {
          item.cr_posn_end = 0;
        }
        if (item.cr_top_remarks == null) {
          item.cr_top_remarks = '';
        }

        if (item.extra_support_bar_ind == null) {
          item.extra_support_bar_ind = 'None';
        }

        if (item.extra_support_bar_dia == null) {
          item.extra_support_bar_dia = 0;
        }

        if (item.extra_cr_no == null) {
          item.extra_cr_no = 0;
        }

        if (item.extra_cr_loc == null) {
          item.extra_cr_loc = 0;
        }

        if (item.extra_cr_dia == null) {
          item.extra_cr_dia = 0;
        }

        if (item.cr_spacing_end == null) {
          item.cr_spacing_end = 0;
        }

        if (item.coupler_top == null) {
          item.coupler_top = 'No-Coupler';
        }
        if (item.coupler_end == null) {
          item.coupler_end = 'No-Coupler';
        }
        if (item.crank_height_top == null) {
          item.crank_height_top = 0;
        }
        if (item.crank_height_end == null) {
          item.crank_height_end = 0;
        }
        if (item.crank2_height_top == null) {
          item.crank2_height_top = 0;
        }
        if (item.crank2_height_end == null) {
          item.crank2_height_end = 0;
        }
        if (item.mainbar_length_2layer == null) {
          item.mainbar_length_2layer = 12000;
        }
        if (item.mainbar_location_2layer == null) {
          item.mainbar_location_2layer = 0;
        }
        if (item.cage_qty == null || item.cage_qty == 0) {
          if (this.isBPCEditable != true && this.customerCode != '0000000000') {
            var lPileDia = item.pile_dia;
            item.cage_qty = this.getLoadCages(lPileDia);
          } else {
            item.cage_qty = 1;
          }
        }
        item.bundle_same_type = 'N';
      } else {
        var lPreCage = args.grid.getDataItem(this.rowIndex - 1);
        if (lPreCage != null) {
          if (item.lib_name == null) {
            item.lib_name = lPreCage.lib_name;
          }
          //if (item.pile_cover == null) {
          item.pile_cover = lPreCage.pile_cover;
          //}
          if (item.pile_type == null) {
            item.pile_type = lPreCage.pile_type;
          }
          if (item.pile_dia == null) {
            item.pile_dia = lPreCage.pile_dia;
          }
          item.cage_dia = item.pile_dia - 2 * item.pile_cover;

          if (item.main_bar_arrange == null) {
            item.main_bar_arrange = lPreCage.main_bar_arrange;
          }
          if (item.main_bar_type == null) {
            item.main_bar_type = lPreCage.main_bar_type;
          }
          if (item.main_bar_ct == null) {
            item.main_bar_ct = lPreCage.main_bar_ct;
          }
          if (item.main_bar_shape == null) {
            item.main_bar_shape = lPreCage.main_bar_shape;
          }
          if (item.main_bar_grade == null) {
            item.main_bar_grade = lPreCage.main_bar_grade;
          }
          if (item.main_bar_dia == null) {
            item.main_bar_dia = lPreCage.main_bar_dia;
          }
          if (item.cage_length == null) {
            item.cage_length = lPreCage.cage_length;
          }
          if (item.spiral_link_type == null) {
            item.spiral_link_type = lPreCage.spiral_link_type;
          }
          if (item.spiral_link_grade == null) {
            item.spiral_link_grade = lPreCage.spiral_link_grade;
          }
          if (item.spiral_link_dia == null) {
            item.spiral_link_dia = lPreCage.spiral_link_dia;
          }
          if (item.spiral_link_spacing == null) {
            item.spiral_link_spacing = lPreCage.spiral_link_spacing;
          }
          if (item.lap_length == null) {
            item.lap_length = lPreCage.lap_length;
          }
          if (item.end_length == null) {
            item.end_length = lPreCage.end_length;
          }
          if (item.cage_location == null) {
            item.cage_location = lPreCage.cage_location;
          }

          if (item.sl1_length == null) {
            item.sl1_length = lPreCage.sl1_length;
          }

          if (item.sl2_length == null) {
            item.sl2_length = lPreCage.sl2_length;
          }

          if (item.sl3_length == null) {
            item.sl3_length = lPreCage.sl3_length;
          }

          if (item.sl1_dia == null) {
            item.sl1_dia = lPreCage.sl1_dia;
          }

          if (item.sl2_dia == null) {
            item.sl2_dia = lPreCage.sl2_dia;
          }

          if (item.sl3_dia == null) {
            item.sl3_dia = lPreCage.sl3_dia;
          }
          if (item.no_of_sr == null) {
            item.no_of_sr = lPreCage.no_of_sr;
          }

          if (item.sr_grade == null) {
            item.sr_grade = lPreCage.sr_grade;
          }

          if (item.sr_dia == null) {
            item.sr_dia = lPreCage.sr_dia;
          }

          if (item.sr1_location == null) {
            item.sr1_location = lPreCage.sr1_location;
          }

          if (item.sr2_location == null) {
            item.sr2_location = lPreCage.sr2_location;
          }

          if (item.sr3_location == null) {
            item.sr3_location = lPreCage.sr3_location;
          }

          if (item.sr4_location == null) {
            item.sr4_location = lPreCage.sr4_location;
          }

          if (item.sr5_location == null) {
            item.sr5_location = lPreCage.sr5_location;
          }

          if (item.rings_start == null) {
            item.rings_start = lPreCage.rings_start;
          }

          if (item.rings_end == null) {
            item.rings_end = lPreCage.rings_end;
          }

          if (item.rings_addn_member == null) {
            item.rings_addn_member = lPreCage.rings_addn_member;
          }

          if (item.rings_addn_no == null) {
            item.rings_addn_no = lPreCage.rings_addn_no;
          }

          if (item.no_of_cr_top == null) {
            item.no_of_cr_top = lPreCage.no_of_cr_top;
          }

          if (item.cr_spacing_top == null) {
            item.cr_spacing_top = lPreCage.cr_spacing_top;
          }

          if (item.cr_posn_top == null) {
            item.cr_posn_top = lPreCage.cr_posn_top;
            if (item.cr_posn_top == null) {
              item.cr_posn_top = 0;
            }
          }
          if (item.cr_spacing_end == null) {
            item.cr_spacing_end = lPreCage.cr_spacing_end;
          }
          if (item.cr_posn_end == null) {
            item.cr_posn_end = lPreCage.cr_posn_end;
          }
          if (item.cr_top_remarks == null) {
            item.cr_top_remarks = lPreCage.cr_top_remarks;
          }
          if (item.no_of_cr_end == null) {
            item.no_of_cr_end = lPreCage.no_of_cr_end;
          }

          if (item.cr_end_remarks == null) {
            item.cr_end_remarks = lPreCage.cr_end_remarks;
          }
          if (item.cr_top_remarks == null) {
            item.cr_top_remarks = lPreCage.cr_top_remarks;
          }

          if (item.extra_support_bar_ind == null) {
            item.extra_support_bar_ind = lPreCage.extra_support_bar_ind;
          }

          if (item.extra_support_bar_dia == null) {
            item.extra_support_bar_dia = lPreCage.extra_support_bar_dia;
          }

          if (item.extra_cr_no == null) {
            item.extra_cr_no = lPreCage.extra_cr_no;
          }

          if (item.extra_cr_loc == null) {
            item.extra_cr_loc = lPreCage.extra_cr_loc;
          }

          if (item.extra_cr_dia == null) {
            item.extra_cr_dia = lPreCage.extra_cr_dia;
          }

          if (item.cr_spacing_end == null) {
            item.cr_spacing_end = lPreCage.cr_spacing_end;
          }

          if (item.coupler_top == null) {
            item.coupler_top = lPreCage.coupler_top;
          }
          if (item.coupler_end == null) {
            item.coupler_end = lPreCage.coupler_end;
          }
          if (item.crank_height_top == null) {
            item.crank_height_top = lPreCage.crank_height_top;
          }
          if (item.crank_height_end == null) {
            item.crank_height_end = lPreCage.crank_height_end;
          }
          if (item.crank2_height_top == null) {
            item.crank2_height_top = lPreCage.crank2_height_top;
          }
          if (item.crank2_height_end == null) {
            item.crank2_height_end = lPreCage.crank2_height_end;
          }
          if (item.mainbar_length_2layer == null) {
            item.mainbar_length_2layer = lPreCage.mainbar_length_2layer;
          }
          if (item.mainbar_location_2layer == null) {
            item.mainbar_location_2layer = lPreCage.mainbar_location_2layer;
          }
          if (item.bundle_same_type == null) {
            item.bundle_same_type = lPreCage.bundle_same_type;
          }
          if (item.cage_qty == null || item.cage_qty == 0) {
            if (
              this.isBPCEditable != true &&
              this.customerCode != '0000000000'
            ) {
              var lPileDia = item.pile_dia;
              item.cage_qty = this.getLoadCages(lPileDia);
            } else {
              item.cage_qty = 1;
            }
          }
        }
      }
      // item.no_of_cr_end = args.grid.getDataItem(this.rowIndex - 1).no_of_cr_end;
    }
    this.drawSetStiffenerRing(item);
    this.drawSetCirlularRing(item);
    this.drawSetSLLengthValue(item);
    this.drawSetStartEndRingValue(item);
    this.drawSetCrankHeight(item);
    this.drawSet2ndLayer(item);
    this.drawSetSupportBar(item);


    var lLayer = item.pile_type;
    if (lLayer == null || lLayer == '') {
      lLayer = 'Single-Layer';
    }

    var lArrange = item.main_bar_arrange;
    if (lArrange == null || lArrange == '') {
      lArrange = 'Single';
    }

    var lMainBarType = item.main_bar_type;
    if (lMainBarType == null || lMainBarType == '') {
      lMainBarType = 'Single';
    }

    var lCT = item.main_bar_ct;
    if (lCT == '' || lCT == '0') {
      lCT = 20;
    }

    var lMainBarDia = args.item.main_bar_dia;
    if (lMainBarDia == '' || lMainBarDia == '0') {
      lMainBarDia = '32';
    }

    var lSameBarBundle = args.item.bundle_same_type;
    if (lSameBarBundle == null || lSameBarBundle == '') {
      lSameBarBundle = 'N';
    }

    this.drawPlanView(
      this.contextp,
      lCT,
      lLayer,
      lMainBarType,
      lArrange,
      lMainBarDia,
      lSameBarBundle,
      args.item.extra_support_bar_ind
    );
    this.drawPileDiameter(this.contextp);
    this.drawCover(this.contextp);
    this.drawCoverWords(this.contextp, args.item.pile_cover);
    this.drawMainBarLine(this.contextp, 0);
    this.drawLinks(this.contextp, 5, 0);

    var lGrade = args.item.main_bar_grade;
    var lDia = args.item.main_bar_dia;
    var lNumber = args.item.main_bar_ct;
    this.drawMainBarWords(this.contextp, lGrade, lDia, lNumber);

    var lDia = args.item.pile_dia;
    this.drawPileDiameterNumber(this.contextp, lDia);

    this.getBPCWeight(item);

    // this.dataset.push(item);
    // args.grid.updateRowCount();
    // args.grid.invalidate();
    // args.grid.render();
    this.templateGrid.dataView.beginUpdate();
    this.templateGrid.dataView.addItems(item);
    this.templateGrid.dataView.endUpdate();
    this.templateGrid.slickGrid.invalidate();
    this.templateGrid.slickGrid.render();
    // // args.grid.beginUpdate();
    // args.grid.dataView.addItem(item);
    // // args.grid.endUpdate();
    // args.grid.invalidate();
    // args.grid.render();

    var lCageLength = args.item.cage_length;
    var lLapLength = args.item.lap_length;
    var lEndLength = args.item.end_length;
    var lSLType = args.item.spiral_link_type;
    var lSLGrade = args.item.spiral_link_grade;
    var lSLDia = args.item.spiral_link_dia;
    var lSLSpacing = args.item.spiral_link_spacing;
    var lCouplerTop = args.item.coupler_top;
    var lCouplerEnd = args.item.coupler_end;
    var lMainBarShape = args.item.main_bar_shape;
    var lSL1Length = args.item.sl1_length;
    var lSL2Length = args.item.sl2_length;
    var lSL3Length = args.item.sl3_length;
    var lSL1Dia = args.item.sl1_dia;
    var lSL2Dia = args.item.sl2_dia;
    var lSL3Dia = args.item.sl3_dia;
    var l2LayerLen = args.item.mainbar_length_2layer;
    var l2LayerPos = args.item.mainbar_location_2layer;
    var lPileType = args.item.pile_type;

    this.drawElevView(
      this.contextEl,
      lCageLength,
      lLapLength,
      lEndLength,
      lSLType,
      lSLGrade,
      lSLDia,
      lSLSpacing,
      lCouplerTop,
      lCouplerEnd,
      lMainBarShape,
      lSL1Length,
      lSL2Length,
      lSL3Length,
      lSL1Dia,
      lSL2Dia,
      lSL3Dia,
      l2LayerLen,
      l2LayerPos,
      lPileType,
      args.item.rings_start,
      args.item.rings_end,
      args.item.no_of_cr_top, args.item.no_of_cr_end
    );

    this.drawStiffenerRing(
      this.contextEl,
      lLapLength,
      lEndLength,
      lCageLength,
      args.item.no_of_sr,
      args.item.sr_grade,
      args.item.sr_dia,
      args.item.sr1_location,
      args.item.sr2_location,
      args.item.sr3_location,
      args.item.sr4_location,
      args.item.sr5_location,
      args.item.main_bar_shape,
      lPileType,
      args.item.extra_support_bar_ind,
      args.item.extra_support_bar_dia,
      args.item.extra_cr_no
    );

    if (lPileType != 'Micro-Pile') {
      this.drawCircularRing(
        this.contextEl,
        lLapLength,
        lEndLength,
        lCageLength,
        args.item.no_of_cr_top,
        args.item.no_of_cr_end,
        args.item.cr_spacing_top,
        args.item.cr_spacing_end,
        args.item.main_bar_shape,
        args.item.spiral_link_type,
        args.item.cr_end_remarks,
        args.item.extra_cr_no,
        args.item.extra_cr_loc,
        args.item.extra_cr_dia,
        args.item.rings_start,
        args.item.rings_end,
        args.item.cr_posn_top,
        args.item.cr_posn_end,
        args.item.cr_top_remarks,
        args.item.cr_ring_type,
        args.item.cr_bundle_side
      );
    }

    this.drawAdditionalRings(
      this.contextEl,
      args.item.no_of_sr,
      lLapLength,
      lEndLength,
      lCageLength,
      args.item.rings_start,
      args.item.rings_end,
      args.item.rings_addn_member,
      args.item.rings_addn_no
    );

    this.drawCrankHeight(
      this.contextEl,
      lLapLength,
      lEndLength,
      lCageLength,
      args.item.main_bar_shape,
      args.item.crank_height_top,
      args.item.crank_height_end
    );

    this.viewBPC3D(args.grid.getDataItem(this.rowIndex));
    this.LibChanged();
    //SaveLibData(rowIndex)
    this.gTempPreRowNo = this.rowIndex;
  }

  gridCellChanged(e: any, args: any) {
    var lColumnName = args.grid.getColumns(args.row)[args.cell].id;
    var lVarArr: any;




    if (lColumnName == 'pile_type') {
      var lPileType = args.item.pile_type;
      if (lPileType == 'Double-Layer') {
        this.getMainBarArrangeBackup =[{value:'Single',label:'Single'},{value:'Side-By-Side',label:'Side-By-Side'}];
        this.getMainBarArrange =[{value:'Single',label:'Single'},{value:'Side-By-Side',label:'Side-By-Side'}];
        var lBarType = args.item.main_bar_type;
        if (lBarType != 'Single') {
          args.item.main_bar_type = 'Single';
        }
        var lBarArrange = args.item.main_bar_arrange;
        if (lBarArrange != 'Single') {
          args.item.main_bar_arrange = 'Single';
        }
        if (lBarArrange != 'Single' || lBarType != 'Single') {
          args.grid.invalidate();
        }
      } else if (lPileType == 'Micro-Pile') {
        args.item.pile_dia = '450';
        args.item.cage_dia = 450 - 2 * parseInt(args.item.pile_cover);
        args.item.main_bar_arrange = 'Single';
        args.item.main_bar_type = 'Single';
        args.item.main_bar_ct = '6';
        args.item.main_bar_shape = 'Straight';
        args.item.main_bar_dia = '32';
        args.item.spiral_link_dia = 10;
        args.item.lap_length = 100;
        args.item.end_length = 100;
        args.grid.invalidate();
      } else {
        this.getMainBarArrangeBackup =[{value:'Single',label:'Single'},{value:'Side-By-Side',label:'Side-By-Side'},{value:'In-Out',label:'In-Out'}];
        this.getMainBarArrange =[{value:'Single',label:'Single'},{value:'Side-By-Side',label:'Side-By-Side'},{value:'In-Out',label:'In-Out'}];
      }
    }
    if (lColumnName == 'main_bar_type' || lColumnName == 'pile_type') {
      var lPileType = args.item.pile_type;
      var lBarType = args.item.main_bar_type;
      var lMainBars = args.item.main_bar_ct;
      var lMainBarDia = args.item.main_bar_dia;
      if (
        lBarType == 'Single' &&
        (lPileType == 'Single-Layer' || lPileType == 'Micro-Pile')
      ) {
        if (lMainBars != null) {
          var lMainBarsArr = lMainBars.toString().split(',');
          if (lMainBarsArr.length > 1) {
            args.item.main_bar_ct = lMainBarsArr[0];
            args.grid.invalidate();
            args.grid.render();
          }
        }
        if (lMainBarDia != null) {
          var lMainBarDiaArr = lMainBarDia.toString().split(',');
          if (lMainBarDiaArr.length > 1) {
           this.getMainBarDiameterBackup = this.gMainBarDia; //"main_bar_dia"
           this.getMainBarDiameter=this.gMainBarDia
            args.item.main_bar_dia = lMainBarDiaArr[0];
            args.grid.invalidate();
            args.grid.render();
          }
        }
      } else {
        if (lMainBars != null) {
          var lMainBarsArr = lMainBars.toString().split(',');
          if (lMainBarsArr.length <= 1) {
            args.item.main_bar_ct = lMainBars.trim() + ',' + lMainBars.trim();
            args.grid.invalidate();
            args.grid.render();
          }
        }else{
          args.item.main_bar_dia = '32,50';
          args.grid.invalidate();
          args.grid.render();
        }
        if (lMainBarDia != null) {
          var lMainBarDiaArr = lMainBarDia.toString().split(',');
          if (lMainBarDiaArr.length <= 1) {
            lMainBarDia = lMainBarDia.trim();
            this.getMainBarDiameterBackup=this.gMainBarDiaMixed;
            this.getMainBarDiameter=this.gMainBarDiaMixed; //"main_bar_dia"
            var lNextMainBarDia = lMainBars.trim();
            lVarArr = this.gMainBarDia; //change
            if (lVarArr.length > 0) {
              for (let i = 0; i < lVarArr.length; i++) {
                if (lVarArr[i] == lMainBarDia) {
                  if (i < lVarArr.length - 1) {
                    lNextMainBarDia = lMainBarDia + ',' + lVarArr[i + 1];
                  } else {
                    lNextMainBarDia = lVarArr[i + 1] + ',' + lMainBarDia;
                  }
                }
              }
            }
            args.item.main_bar_dia = lNextMainBarDia;
            args.grid.invalidate();
            args.grid.render();
          }else{
            args.item.main_bar_dia = '24,24';
            args.grid.invalidate();
            args.grid.render();
          }
        }
      }
    }
    if (lColumnName == 'pile_dia' || lColumnName == 'pile_cover') {
      var lDia = args.item.pile_dia;
      if (this.isBPCEditable != true && this.customerCode != '0000000000') {
        args.item.cage_qty = this.getLoadCages(lDia);
      }
      args.item.cage_dia = parseInt(lDia) - 2 * parseInt(args.item.pile_cover);
      args.grid.invalidate();
      args.grid.render();

      this.drawPileDiameterNumber(this.contextp, lDia);
      this.drawCoverWords(this.contextp, args.item.pile_cover);

      if (args.itempile_type != 'Micro-Pile' && args.item.cage_dia < 350) {
        alert('The Cage Diameter cannot be less than 350mm');
      }
      this.drawSetSupportBar(args.item);
    }

    if (
      lColumnName == 'main_bar_grade' ||
      lColumnName == 'main_bar_dia' ||
      lColumnName == 'main_bar_ct'
    ) {
      if (
        args.item.main_bar_grade != null &&
        args.item.main_bar_dia != null &&
        args.item.main_bar_ct != null
      ) {
        var lGrade = args.item.main_bar_grade;
        var lDia = args.item.main_bar_dia;
        var lNumber = args.item.main_bar_ct;
        this.drawMainBarWords(this.contextp, lGrade, lDia, lNumber);
        this.drawSetSupportBar(args.item);
      }
    }

    if (lColumnName == 'main_bar_dia' || lColumnName == 'main_bar_shape') {
      if (args.item.main_bar_dia != null && args.item.main_bar_shape != null) {
        this.drawSetCrankHeight(args.item);
      }
    }

    if (
      lColumnName == 'pile_type' ||
      lColumnName == 'main_bar_arrange' ||
      lColumnName == 'main_bar_type' ||
      lColumnName == 'main_bar_ct' ||
      lColumnName == 'main_bar_dia'
    ) {
      var lLayer = args.item.pile_type;
      if (lLayer == null || lLayer == '') {
        lLayer = 'Single-Layer';
      }

      var lArrange = args.item.main_bar_arrange;
      if (lArrange == null || lArrange == '') {
        lArrange = 'Single';
      }

      var lMainBarType = args.item.main_bar_type;
      if (lMainBarType == null || lMainBarType == '') {
        lMainBarType = 'Single';
      }

      var lCT = args.item.main_bar_ct;
      if (lCT == '' || lCT == '0') {
        lCT = 20;
      }

      var lMainBarDia = args.item.main_bar_dia;
      if (lMainBarDia == '' || lMainBarDia == '0') {
        lMainBarDia = '32';
      }

      var lSameBarBundle = args.item.bundle_same_type;
      if (lSameBarBundle == null || lSameBarBundle == '') {
        lSameBarBundle = 'N';
      }

      this.drawPlanView(
        this.contextp,
        lCT,
        lLayer,
        lMainBarType,
        lArrange,
        lMainBarDia,
        lSameBarBundle,
        args.item.extra_support_bar_ind
      );
    }

    if (
      lColumnName == 'spiral_link_type' ||
      lColumnName == 'spiral_link_dia' ||
      lColumnName == 'spiral_link_spacing'
    ) {
      var lSLType = args.item.spiral_link_type;
      var lSLSpacing = args.item.spiral_link_spacing;
      var lSLSpacingArr = args.item.spiral_link_spacing.toString().split(',');

      if (lSLType == '1 Spacing' || lSLType == 'Twin 1 Spacing') {
        if (Array.isArray(lSLSpacingArr)) {
          args.item.spiral_link_spacing = lSLSpacingArr[0];
        }
        args.item.sl1_dia = args.item.spiral_link_dia;
        args.item.sl2_dia = 0;
        args.item.sl3_dia = 0;
      }
      if (
        lSLType == '2 Spacing' ||
        lSLType == 'Twin 2 Spacing' ||
        lSLType == 'Single-Twin' ||
        lSLType == 'Twin-Single'
      ) {
        if (lSLSpacingArr.length > 2) {
          args.item.spiral_link_spacing =
            lSLSpacingArr[0] + ',' + lSLSpacingArr[1];
        } else if (lSLSpacingArr.length == 1) {
          args.item.spiral_link_spacing =
            lSLSpacingArr[0] + ',' + (parseInt(lSLSpacingArr[0]) - 50);
        }
        args.item.sl1_dia = args.item.spiral_link_dia;
        args.item.sl2_dia = args.item.spiral_link_dia;
        args.item.sl3_dia = 0;
      }
      if (lSLType == '3 Spacing' || lSLType == 'Twin 3 Spacing') {
        if (lSLSpacingArr.length == 2) {
          args.item.spiral_link_spacing =
            lSLSpacingArr[0] + ',' + lSLSpacingArr[1] + ',' + lSLSpacingArr[0];
        } else if (lSLSpacingArr.length == 1) {
          args.item.spiral_link_spacing =
            lSLSpacingArr[0] +
            ',' +
            (parseInt(lSLSpacingArr[0]) - 50) +
            ',' +
            lSLSpacingArr[0];
        }
        args.item.sl1_dia = args.item.spiral_link_dia;
        args.item.sl2_dia = args.item.spiral_link_dia;
        args.item.sl3_dia = args.item.spiral_link_dia;
      }
      args.grid.invalidate();
      args.grid.render();

      this.drawSetSupportBar(args.item);
    }

    if (
      lColumnName == 'cage_length' ||
      lColumnName == 'pile_type' ||
      lColumnName == 'main_bar_arrange'
    ) {
      args.item.mainbar_length_2layer = args.item.cage_length;
      args.item.mainbar_location_2layer = 0;

      args.grid.invalidate();
    }

    if (
      lColumnName == 'cage_length' ||
      lColumnName == 'lap_length' ||
      lColumnName == 'end_length' ||
      lColumnName == 'spiral_link_type'
    ) {
      this.drawSetSLLengthValue(args.item);
      args.grid.invalidate();
    }

    if (
      lColumnName == 'cage_length' ||
      lColumnName == 'lap_length' ||
      lColumnName == 'end_length' ||
      lColumnName == 'spiral_link_type' ||
      lColumnName == 'spiral_link_spacing'
    ) {
      this.drawSetCirlularRing(args.item);
      args.grid.invalidate();
    }

    if (
      lColumnName == 'cage_length' ||
      lColumnName == 'lap_length' ||
      lColumnName == 'end_length' ||
      lColumnName == 'pile_type' ||
      lColumnName == 'main_bar_shape' ||
      lColumnName == 'main_bar_dia'
    ) {
      this.drawSet2ndLayer(args.item);
      args.grid.invalidate();
    }

    if (
      lColumnName == 'cage_length' ||
      lColumnName == 'lap_length' ||
      lColumnName == 'end_length' ||
      lColumnName == 'spiral_link_type' ||
      lColumnName == 'pile_dia' ||
      lColumnName == 'cage_location' ||
      lColumnName == 'main_bar_dia' ||
      lColumnName == 'spiral_link_grade' ||
      lColumnName == 'main_bar_shape'
    ) {
      this.drawSetStiffenerRing(args.item);
      args.grid.invalidate();
    }

    if (
      lColumnName == 'cage_length' ||
      lColumnName == 'lap_length' ||
      lColumnName == 'end_length' ||
      lColumnName == 'spiral_link_type' ||
      lColumnName == 'spiral_link_grade' ||
      lColumnName == 'spiral_link_dia' ||
      lColumnName == 'spiral_link_spacing' ||
      lColumnName == 'coupler_top' ||
      lColumnName == 'coupler_end' ||
      lColumnName == 'main_bar_shape' ||
      lColumnName == 'cage_location'
    ) {
      var lCageLength = args.item.cage_length;
      var lLapLength = args.item.lap_length;
      var lEndLength = args.item.end_length;
      var lSLType = args.item.spiral_link_type;
      var lSLGrade = args.item.spiral_link_grade;
      var lSLDia = args.item.spiral_link_dia;
      var lSLSpacing = args.item.spiral_link_spacing;
      var lCouplerTop = args.item.coupler_top;
      var lCouplerEnd = args.item.coupler_end;
      var lMainBarShape = args.item.main_bar_shape;
      var lSL1Length = args.item.sl1_length;
      var lSL2Length = args.item.sl2_length;
      var lSL3Length = args.item.sl3_length;
      var lSL1Dia = args.item.sl1_dia;
      var lSL2Dia = args.item.sl2_dia;
      var lSL3Dia = args.item.sl3_dia;
      var l2LayerLen = args.item.mainbar_length_2layer;
      var l2LayerPos = args.item.mainbar_location_2layer;
      var lPileType = args.item.pile_type;

      this.drawElevView(
        this.contextEl,
        lCageLength,
        lLapLength,
        lEndLength,
        lSLType,
        lSLGrade,
        lSLDia,
        lSLSpacing,
        lCouplerTop,
        lCouplerEnd,
        lMainBarShape,
        lSL1Length,
        lSL2Length,
        lSL3Length,
        lSL1Dia,
        lSL2Dia,
        lSL3Dia,
        l2LayerLen,
        l2LayerPos,
        lPileType,
        args.item.rings_start,
        args.item.rings_end,
        args.item.no_of_cr_top, args.item.no_of_cr_end
      );

      this.drawStiffenerRing(
        this.contextEl,
        lLapLength,
        lEndLength,
        lCageLength,
        args.item.no_of_sr,
        args.item.sr_grade,
        args.item.sr_dia,
        args.item.sr1_location,
        args.item.sr2_location,
        args.item.sr3_location,
        args.item.sr4_location,
        args.item.sr5_location,
        args.item.main_bar_shape,
        lPileType,
        args.item.extra_support_bar_ind,
        args.item.extra_support_bar_dia,
        args.item.extra_cr_no
      );

      if (lPileType != 'Micro-Pile') {
        this.drawCircularRing(
          this.contextEl,
          lLapLength,
          lEndLength,
          lCageLength,
          args.item.no_of_cr_top,
          args.item.no_of_cr_end,
          args.item.cr_spacing_top,
          args.item.cr_spacing_end,
          args.item.main_bar_shape,
          args.item.spiral_link_type,
          args.item.cr_end_remarks,
          args.item.extra_cr_no,
          args.item.extra_cr_loc,
          args.item.extra_cr_dia,
          args.item.rings_start,
          args.item.rings_end,
          args.item.cr_posn_top,
          args.item.cr_posn_end,
          args.item.cr_top_remarks,
          args.item.cr_ring_type,
          args.item.cr_bundle_side
        );
      }

      this.drawAdditionalRings(
        this.contextEl,
        args.item.no_of_sr,
        lLapLength,
        lEndLength,
        lCageLength,
        args.item.rings_start,
        args.item.rings_end,
        args.item.rings_addn_member,
        args.item.rings_addn_no
      );

      this.drawCrankHeight(
        this.contextEl,
        lLapLength,
        lEndLength,
        lCageLength,
        args.item.main_bar_shape,
        args.item.crank_height_top,
        args.item.crank_height_end
      );
    }

    if (lColumnName == 'cage_qty') {
      var lQty = args.item.cage_qty;
      var lUnitWT = args.item.unit_weight;
      var lTotalWt = parseFloat(lUnitWT) * parseInt(lQty);
      args.item.order_wt = lTotalWt.toFixed(3);
      args.grid.invalidate();
      args.grid.render();
    }

    if (
      lColumnName != 'per_set' &&
      lColumnName != 'bbs_no' &&
      lColumnName != 'cage_remarks' &&
      lColumnName != 'cage_weight'
    ) {
      this.getBPCWeight(args.item);
      args.grid.invalidate();
      args.grid.render();
      this.viewBPC3D(args.grid.getDataItem(args.row));
    }

    console.log(args.grid);
    this.LibChanged();
    //debugger;
  }
  iskeyExists(search:any,list:any){
    return list.some((item:any) => { return item.label == search });
  };

  gridOnSelectedRowsChanged(e: any, args: any) {
    if (this.gGridClearStart == 1) {
      return;
    }
    this.gGridClearStart = 1;
    //if (libGrid.getSelectedRows([0]).length > 0) {
    //    libGrid.getSelectionModel().setSelectedRanges([]);
    //    libGrid.resetActiveCell();
    //}

    // if (this.grid.getSelectedRows([0]).length > 0) {
    //     this.grid.getSelectionModel().setSelectedRanges([]);
    //     this.grid.resetActiveCell();
    //     this.gPreRowNo = -1;
    // }

    var lRowNo = args.grid.getSelectedRows([0])[0];

    if (lRowNo != this.gTempPreRowNo) {
      if (this.isBPCEditable == true) {
        this.SaveLibData(this.gTempPreRowNo);
      }
      this.gTempPreRowNo = lRowNo;

      var item = args.grid.getDataItem(lRowNo);
      if (item != null) {
        this.SetDrawing(item);
        this.reloadRebars(item);

      }
    }

    this.gGridClearStart = 0;
  }

  gridOnKeyDown(e: any, args: any) {
    var lCurrRow = args.grid.getActiveCell().row;
    var lCurrCell = args.grid.getActiveCell().cell;
    var lColumnName = args.grid.getColumns(lCurrRow)[lCurrCell]['id'];
    let item = args.grid.getDataItem(lCurrRow)
    if (e.which == 13) {
      e.preventDefault();
      //grid.getEditorLock().commitCurrentEdit();
      if (lColumnName == 'cage_remarks') {
        //templateGrid.getEditorLock().commitCurrentEdit();
        ////grid.navigateDown();
        //templateGrid.setActiveCell(lCurrRow + 1, 2);
      } else {
        args.grid.navigateRight();
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
    if (e.which == 9) {
      if(lColumnName == 'pile_cover'){
        if (this.iskeyExists(item.pile_cover,this.getPileCoverBackupCollection) == false) {
          alert("Please enter valid pile cover!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }else if (lColumnName =='pile_type'){
        if (this.iskeyExists(item.pile_type,this.getPileTypeBackup) == false) {
          alert("Please enter valid pile type!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='pile_dia'){
        // args.grid.getEditorLock().commitCurrentEdit();
        if (this.iskeyExists(item.pile_dia,this.getPileDiaBackup) == false) {
          alert("Please enter valid pile diameter!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='main_bar_arrange'){
        // args.grid.getEditorLock().commitCurrentEdit();
        if (this.iskeyExists(item.main_bar_arrange,this.getMainBarArrangeBackup) == false) {
          alert("Please enter valid main bar arrange!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='main_bar_type'){
        // args.grid.getEditorLock().commitCurrentEdit();
        if (this.iskeyExists(item.main_bar_type,this.getMainBarTypeBackup) == false) {
          alert("Please enter valid main bar type!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='main_bar_shape'){
        if (this.iskeyExists(item.main_bar_shape,this.getMainBarShapeBackup) == false) {
          alert("Please enter valid main bar shape!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='main_bar_grade'){
        if (this.iskeyExists(item.main_bar_grade,this.getMainBarGradeBackup) == false) {
          alert("Please enter valid main bar grade!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='main_bar_dia'){
        if (this.iskeyExists(item.main_bar_dia,this.getMainBarDiameterBackup) == false) {
          alert("Please enter valid main bar diameter!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='spiral_link_type' ){
        if (this.iskeyExists(item.spiral_link_type,this.getSpiralLinkTypeBackup) == false) {
          alert("Please enter valid spiral link type!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='spiral_link_grade'){
        if (this.iskeyExists(item.spiral_link_grade,this.getSpiralLinkGradeBackup) == false) {
          alert("Please enter valid spiral link grade!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='spiral_link_dia'){
        if (this.iskeyExists(item.spiral_link_dia,this.getSpiralLinkDiameterBackup) == false) {
          alert("Please enter valid spiral link diameter!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
      else if (lColumnName =='cage_location'){
        if (this.iskeyExists(item.cage_location,this.getCageLocationBackup) == false) {
          alert("Please enter valid cage location!");
          e.stopPropagation();
          e.stopImmediatePropagation();
          args.grid.focus();
          args.grid.editActiveCell();
          return;
        }
      }
    }
    if (e.which != 65 || !e.ctrlKey) {
      return;
    }


    var rows = [];
    for (var i = 0; i < this.templateDataView.getLength(); i++) {
      rows.push(i);
    }

    args.grid.setSelectedRows(rows);
    e.preventDefault();
  }

  gridOnSort(e: any, args: any) {
    var cols = args.sortCols;
    args.grid.getData().sort((dataRow1: any, dataRow2: any) => {
      for (var i = 0, l = cols.length; i < l; i++) {
        var field = cols[i].sortCol.field;
        var sign = cols[i].sortAsc ? 1 : -1;
        var value1 = dataRow1[field],
          value2 = dataRow2[field];
        if (!isNaN(value1) && !isNaN(value2)) {
          value1 = Number(value1);
          value2 = Number(value2);
        }
        var result = (value1 == value2 ? 0 : value1 > value2 ? 1 : -1) * sign;

        if (result != 0) return result;
      }

      return 0;
    });

    args.grid.invalidate();
    args.grid.render();
  }

  getPileDiameterBasedOnType(lType:any){
    if (lType == 'Micro-Pile') {
      return [
        { label: '450', value: '450' },
        { label: '400', value: '400' },
        { label: '350', value: '350' },
        { label: '320', value: '320' },
        { label: '300', value: '300' },
        { label: '290', value: '290' },
        { label: '270', value: '270' },
        { label: '250', value: '250' },
        { label: '240', value: '240' },
        { label: '220', value: '220' },
        { label: '200', value: '200' },
      ];
      // args.grid.getColumns()[args.cell].editorOptions.options = "450;400;350;320;300;290;270;250;240;220;200";
    } else {
      return [
        { label: '450', value: '450' },
        { label: '500', value: '500' },
        { label: '600', value: '600' },
        { label: '700', value: '700' },
        { label: '800', value: '800' },
        { label: '900', value: '900' },
        { label: '1000', value: '1000' },
        { label: '1100', value: '1100' },
        { label: '1200', value: '1200' },
        { label: '1300', value: '1300' },
        { label: '1400', value: '1400' },
        { label: '1500', value: '1500' },
        { label: '1600', value: '1600' },
        { label: '1700', value: '1700' },
        { label: '1800', value: '1800' },
        { label: '1900', value: '1900' },
        { label: '2000', value: '2000' },
        { label: '2100', value: '2100' },
        { label: '2200', value: '2200' },
        { label: '2300', value: '2300' },
        { label: '2400', value: '2400' },
        { label: '2500', value: '2500' },
      ];
      // args.grid.getColumns()[args.cell].editorOptions.options = "450;500;600;700;800;900;1000;1100;1200;1300;1400;1500;1600;1700;1800;1900;2000;2100;2200;2300;2400;2500";
    }
  }
  //Load lower table data

  LibChanged() {
    this.gLibChanged = this.gLibChanged + 1;
  }
  getLoadCages(pPileDai: any) {
    var lCages: any = 1;
    var lLoadPileDiaArr = this.gLoadPileDia;
    var lLoadCagesArr = this.gLoadCages;
    if (
      lLoadPileDiaArr.length > 0 &&
      lLoadCagesArr.length > 0 &&
      lLoadPileDiaArr.length == lLoadCagesArr.length
    ) {
      for (let i = 0; i < lLoadPileDiaArr.length; i++) {
        if (lLoadPileDiaArr[i] == pPileDai) {
          lCages = lLoadCagesArr[i];
          break;
        }
      }
    }

    return lCages;
  }
  //Canvas Drawing code starts here

  // Set Stiffener Ring
  // input: 1.cage_length 2.lap_length 3.end_length 4.spiral_link_grade 5.pile_dia, 6.cage_location, 7.main_bar_dia
  // output: 1.no_of_sr 2.sr_dia 3.sr1_location, 4.sr2_location 5.sr3_location
  drawSetStiffenerRing(pGridItem: any) {
    var lMinLocTop = 100;
    var lMinLocEnd = 100;
    var lMinTop = 700;
    var lMinEnd = 500;
    var lBPCRec = pGridItem;
    var lLapLength = 0;
    var lEndLength = 0;
    var lCageLength = 0;
    var lMainBarShape = '';
    var lMainBarDia = 0;
    var lPileType = '';

    lMinTop = this.gMinTop;
    lMinEnd = this.gMinEnd;

    if (lBPCRec.pile_type != null) {
      lPileType = lBPCRec.pile_type;
    }

    if (lPileType == 'Micro-Pile') {
      lMinTop = 400;
      lMinEnd = 400;
    }

    if (lBPCRec.lap_length != null) {
      lLapLength = parseInt(lBPCRec.lap_length);
    }

    if (lBPCRec.end_length != null) {
      lEndLength = parseInt(lBPCRec.end_length);
    }

    if (lBPCRec.cage_length != null) {
      lCageLength = parseInt(lBPCRec.cage_length);
    }

    if (lBPCRec.main_bar_shape != null) {
      lMainBarShape = lBPCRec.main_bar_shape;
    }

    if (lBPCRec.main_bar_dia != null) {
      var lVar = lBPCRec.main_bar_dia.toString().split(',');
      if (lVar.length > 0) {
        lMainBarDia = parseInt(lVar[0]);
      }
      if (lVar.length > 1) {
        if (lMainBarDia < parseInt(lVar[1])) {
          lMainBarDia = parseInt(lVar[1]);
        }
      }
    }

    if (
      lMainBarShape == 'Crank-Top' ||
      lMainBarShape == 'Crank' ||
      lMainBarShape == 'Crank-Both'
    ) {
      lMinLocTop = lMinLocTop + lMainBarDia * 10;
    }

    if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
      lMinLocEnd = lMinLocEnd + lMainBarDia * 10;
    }

    if (lLapLength > 0 && lLapLength < lMinTop) {
      lLapLength = lMinTop;
    }

    if (lEndLength > 0 && lEndLength < lMinEnd) {
      lEndLength = lMinEnd;
    }
    //Additional SR setting to 13mm
    lBPCRec.sr_dia_add = 13;

    //Stiffener Ring Setting
    var lPLLength = 0;
    if (lCageLength > 0 && lLapLength > 0 && lEndLength > 0) {
      lPLLength = lCageLength - lLapLength - lEndLength;
      //Set SR grade
      var lSLGrade: any = '';
      if (lBPCRec.spiral_link_grade != null) {
        lSLGrade = lBPCRec.spiral_link_grade;
      }
      if (lSLGrade != '') {
        lBPCRec.sr_grade = lSLGrade;
      }
      //Set SR dia
      var lPileDia = 0;
      if (lPileType != 'Micro-Pile' && lBPCRec.pile_dia != null) {
        var lPileDia = parseInt(lBPCRec.pile_dia);
        //if (lPileDia <= 800) {
        //    lBPCRec.sr_dia = 10;
        //} else if (lPileDia <= 1200) {
        //    lBPCRec.sr_dia = 16;
        //} else {
        //    lBPCRec.sr_dia = 20;
        //}
        if (lPileDia < 700) {
          lBPCRec.sr_dia = 13;
        } else if (lPileDia < 1200) {
          lBPCRec.sr_dia = 16;
        } else if (lPileDia < 2000) {
          lBPCRec.sr_dia = 20;
        } else {
          lBPCRec.sr_dia = 25;
        }
        var lSLDia = 0;
        if (lBPCRec.spiral_link_dia != null) {
          lSLDia = parseInt(lBPCRec.spiral_link_dia);
        }
        if (lSLDia > 0) {
          if (lSLDia > lBPCRec.sr_dia) {
            lBPCRec.sr_dia = lSLDia;
          }
        }
      }
      //Set no of SR
      if (lPLLength > 0) {
        if (lPLLength > 8000 && lLapLength >= 1600) {
          lBPCRec.no_of_sr = 4;
        } else if (lPLLength > 4000) {
          lBPCRec.no_of_sr = 3;
        } else if (lCageLength - lEndLength - lMinLocEnd < 1000) {
          lBPCRec.no_of_sr = 2;
        } else {
          lBPCRec.no_of_sr = 2;
        }
      }

      //Set SR position
      var lCageLocation = '';
      if (lBPCRec.cage_location != null) {
        lCageLocation = lBPCRec.cage_location;
      }
      if (lCageLocation != '') {
        if (
          lPileType == 'Micro-Pile' ||
          lCageLocation == 'End' ||
          lCageLocation == 'NA'
        ) {
          if (lBPCRec.no_of_sr == 1) {
            lBPCRec.sr1_location =
              Math.round(
                (lCageLength -
                  lEndLength -
                  lMinLocEnd +
                  lLapLength +
                  lMinLocTop) /
                  2 /
                  100
              ) * 100;
            lBPCRec.sr2_location = 0;
            lBPCRec.sr3_location = 0;
            lBPCRec.sr4_location = 0;
            lBPCRec.sr5_location = 0;
          } else if (lBPCRec.no_of_sr == 2) {
            if (lLapLength >= 1600) {
              lBPCRec.no_of_sr = lBPCRec.no_of_sr + 1;

              lBPCRec.sr1_location = 500;
              lBPCRec.sr2_location = lLapLength + lMinLocTop;
              lBPCRec.sr3_location = lCageLength - lEndLength - lMinLocEnd;
              lBPCRec.sr4_location = 0;
              lBPCRec.sr5_location = 0;
            } else {
              lBPCRec.sr1_location = lLapLength + lMinLocTop;
              lBPCRec.sr2_location = lCageLength - lEndLength - lMinLocEnd;
              lBPCRec.sr3_location = 0;
              lBPCRec.sr4_location = 0;
              lBPCRec.sr5_location = 0;
            }
          } else if (lBPCRec.no_of_sr == 3) {
            if (lLapLength >= 1600) {
              lBPCRec.no_of_sr = lBPCRec.no_of_sr + 1;

              lBPCRec.sr1_location = 500;
              lBPCRec.sr2_location = lLapLength + lMinLocTop;
              lBPCRec.sr4_location = lCageLength - lEndLength - lMinLocEnd;
              lBPCRec.sr3_location =
                lBPCRec.sr2_location +
                Math.round((lBPCRec.sr4_location - lBPCRec.sr2_location) / 2);
              lBPCRec.sr5_location = 0;
            } else {
              lBPCRec.sr1_location = lLapLength + lMinLocTop;
              lBPCRec.sr3_location = lCageLength - lEndLength - lMinLocEnd;
              lBPCRec.sr2_location =
                lBPCRec.sr1_location +
                Math.round((lBPCRec.sr3_location - lBPCRec.sr1_location) / 2);
              lBPCRec.sr4_location = 0;
              lBPCRec.sr5_location = 0;
            }
          } else if (lBPCRec.no_of_sr == 4) {
            if (lLapLength >= 1600) {
              lBPCRec.no_of_sr = lBPCRec.no_of_sr + 1;

              lBPCRec.sr1_location = 500;
              lBPCRec.sr2_location = lLapLength + lMinLocTop;
              lBPCRec.sr5_location = lCageLength - lEndLength - lMinLocEnd;
              lBPCRec.sr3_location =
                lBPCRec.sr2_location +
                Math.round((lBPCRec.sr5_location - lBPCRec.sr2_location) / 3);
              lBPCRec.sr4_location =
                lBPCRec.sr3_location +
                Math.round((lBPCRec.sr5_location - lBPCRec.sr2_location) / 3);
            } else {
              lBPCRec.sr1_location = lLapLength + lMinLocTop;
              lBPCRec.sr4_location = lCageLength - lEndLength - lMinLocEnd;
              lBPCRec.sr2_location =
                lBPCRec.sr1_location +
                Math.round((lBPCRec.sr4_location - lBPCRec.sr1_location) / 3);
              lBPCRec.sr3_location =
                lBPCRec.sr2_location +
                Math.round((lBPCRec.sr4_location - lBPCRec.sr1_location) / 3);
              lBPCRec.sr5_location = 0;
            }
          } else if (lBPCRec.no_of_sr == 5) {
            lBPCRec.sr1_location = lLapLength + lMinLocTop;
            lBPCRec.sr5_location = lCageLength - lEndLength - lMinLocEnd;
            lBPCRec.sr2_location =
              lBPCRec.sr1_location +
              Math.round((lBPCRec.sr5_location - lBPCRec.sr1_location) / 4);
            lBPCRec.sr3_location =
              lBPCRec.sr2_location +
              Math.round((lBPCRec.sr5_location - lBPCRec.sr1_location) / 4);
            lBPCRec.sr4_location =
              lBPCRec.sr3_location +
              Math.round((lBPCRec.sr5_location - lBPCRec.sr1_location) / 4);
          }
        } else {
          var lMainBarDia = 0;
          if (lBPCRec.main_bar_dia != null) {
            var lVar = lBPCRec.main_bar_dia.toString().split(',');
            if (lVar.length > 0) {
              lMainBarDia = parseInt(lVar[0]);
            }
            if (lVar.length > 1) {
              if (lMainBarDia < parseInt(lVar[1])) {
                lMainBarDia = parseInt(lVar[1]);
              }
            }
          }
          var lLappingLength: any = this.getLappingLength(lMainBarDia);
          if (lLappingLength < lEndLength + lMinLocEnd) {
            lLappingLength = lEndLength + lMinLocEnd;
          }
          if (lCageLength - lLappingLength - lLapLength - lMinLocTop > 200) {
            if (lBPCRec.no_of_sr == 1) {
              lBPCRec.sr1_location =
                Math.round(
                  (lCageLength - lLappingLength + lLapLength + lMinLocTop) /
                    2 /
                    100
                ) * 100;
              lBPCRec.sr2_location = 0;
              lBPCRec.sr3_location = 0;
              lBPCRec.sr4_location = 0;
              lBPCRec.sr5_location = 0;
            } else if (lBPCRec.no_of_sr == 2) {
              if (lLapLength >= 1600) {
                lBPCRec.no_of_sr = lBPCRec.no_of_sr + 1;

                lBPCRec.sr1_location = 500;
                lBPCRec.sr2_location = lLapLength + lMinLocTop;
                lBPCRec.sr3_location = lCageLength - lLappingLength;
                lBPCRec.sr4_location = 0;
                lBPCRec.sr5_location = 0;
              } else {
                lBPCRec.sr1_location = lLapLength + lMinLocTop;
                lBPCRec.sr2_location = lCageLength - lLappingLength;
                lBPCRec.sr3_location = 0;
                lBPCRec.sr4_location = 0;
                lBPCRec.sr5_location = 0;
              }
            } else if (lBPCRec.no_of_sr == 3) {
              if (lLapLength >= 1600) {
                lBPCRec.no_of_sr = lBPCRec.no_of_sr + 1;

                lBPCRec.sr1_location = 500;
                lBPCRec.sr2_location = lLapLength + lMinLocTop;
                lBPCRec.sr4_location = lCageLength - lLappingLength;
                lBPCRec.sr3_location =
                  lBPCRec.sr2_location +
                  Math.round((lBPCRec.sr4_location - lBPCRec.sr2_location) / 2);
                lBPCRec.sr5_location = 0;
              } else {
                lBPCRec.sr1_location = lLapLength + lMinLocTop;
                lBPCRec.sr3_location = lCageLength - lLappingLength;
                lBPCRec.sr2_location =
                  lBPCRec.sr1_location +
                  Math.round((lBPCRec.sr3_location - lBPCRec.sr1_location) / 2);
                lBPCRec.sr4_location = 0;
                lBPCRec.sr5_location = 0;
              }
            } else if (lBPCRec.no_of_sr == 4) {
              if (lLapLength >= 1600) {
                lBPCRec.no_of_sr = lBPCRec.no_of_sr + 1;

                lBPCRec.sr1_location = 500;
                lBPCRec.sr2_location = lLapLength + lMinLocTop;
                lBPCRec.sr5_location = lCageLength - lEndLength - lMinLocEnd;
                lBPCRec.sr3_location =
                  lBPCRec.sr2_location +
                  Math.round((lBPCRec.sr5_location - lBPCRec.sr2_location) / 3);
                lBPCRec.sr4_location =
                  lBPCRec.sr3_location +
                  Math.round((lBPCRec.sr5_location - lBPCRec.sr2_location) / 3);
              } else {
                lBPCRec.sr1_location = lLapLength + lMinLocTop;
                lBPCRec.sr4_location = lCageLength - lEndLength - lMinLocEnd;
                lBPCRec.sr2_location =
                  lBPCRec.sr1_location +
                  Math.round((lBPCRec.sr4_location - lBPCRec.sr1_location) / 3);
                lBPCRec.sr3_location =
                  lBPCRec.sr2_location +
                  Math.round((lBPCRec.sr4_location - lBPCRec.sr1_location) / 3);
                lBPCRec.sr5_location = 0;
              }
            } else if (lBPCRec.no_of_sr == 5) {
              lBPCRec.sr1_location = lLapLength + lMinLocTop;
              lBPCRec.sr5_location = lCageLength - lLappingLength;
              lBPCRec.sr2_location =
                lBPCRec.sr1_location +
                Math.round((lBPCRec.sr5_location - lBPCRec.sr1_location) / 4);
              lBPCRec.sr3_location =
                lBPCRec.sr2_location +
                Math.round((lBPCRec.sr5_location - lBPCRec.sr1_location) / 4);
              lBPCRec.sr4_location =
                lBPCRec.sr3_location +
                Math.round((lBPCRec.sr5_location - lBPCRec.sr1_location) / 4);
            }
          } else {
            if (lCageLength - lLappingLength - lLapLength - lMinLocTop < 1000) {
              if (lCageLength - 500 < 1000) {
                if (lLapLength >= 1600) {
                  lBPCRec.no_of_sr = 2;

                  lBPCRec.sr1_location = 500;
                  lBPCRec.sr2_location = lLapLength + lMinLocTop;
                  lBPCRec.sr3_location = 0;
                  lBPCRec.sr4_location = 0;
                  lBPCRec.sr5_location = 0;
                } else {
                  lBPCRec.no_of_sr = 1;
                  lBPCRec.sr1_location = lLapLength + lMinLocTop;
                  lBPCRec.sr2_location = 0;
                  lBPCRec.sr3_location = 0;
                  lBPCRec.sr4_location = 0;
                  lBPCRec.sr5_location = 0;
                }
              } else {
                if (lLapLength >= 1600) {
                  lBPCRec.no_of_sr = 3;

                  lBPCRec.sr1_location = 500;
                  lBPCRec.sr2_location = lLapLength + lMinLocTop;
                  lBPCRec.sr3_location = lCageLength - 500;
                  lBPCRec.sr4_location = 0;
                  lBPCRec.sr5_location = 0;
                } else {
                  lBPCRec.no_of_sr = 2;
                  lBPCRec.sr1_location = lLapLength + lMinLocTop;
                  lBPCRec.sr2_location = lCageLength - 500;
                  lBPCRec.sr3_location = 0;
                  lBPCRec.sr4_location = 0;
                  lBPCRec.sr5_location = 0;
                }
              }
            } else {
              if (lLapLength >= 1600) {
                lBPCRec.no_of_sr = 3;

                lBPCRec.sr1_location = 500;
                lBPCRec.sr2_location = lLapLength + lMinLocTop;
                lBPCRec.sr3_location = lCageLength - lLappingLength;
                lBPCRec.sr4_location = 0;
                lBPCRec.sr5_location = 0;
              } else {
                lBPCRec.no_of_sr = 2;
                lBPCRec.sr1_location = lLapLength + lMinLocTop;
                lBPCRec.sr2_location = lCageLength - lLappingLength;
                lBPCRec.sr3_location = 0;
                lBPCRec.sr4_location = 0;
                lBPCRec.sr5_location = 0;
              }
            }
          }
        }
      }
    }
  }
  getLappingLength(pMainBarDia: any) {
    var lLappingLength;
    if (pMainBarDia == 13) {
      lLappingLength = 900;
    } else if (pMainBarDia == 16) {
      lLappingLength = 1000;
    } else if (pMainBarDia == 20) {
      lLappingLength = 1200;
    } else if (pMainBarDia == 22) {
      lLappingLength = 1300;
    } else if (pMainBarDia == 25) {
      lLappingLength = 1500;
    } else if (pMainBarDia == 28) {
      lLappingLength = 1600;
    } else if (pMainBarDia == 32) {
      lLappingLength = 1800;
    } else if (pMainBarDia == 40) {
      lLappingLength = 2300;
    } else if (pMainBarDia == 50) {
      lLappingLength = 2600;
    }
    return lLappingLength;
  }

  // Set Circularr Ring
  // input: 1.cage_length 2.lap_length 3.end_length 4.spiral_link_grade 5.pile_dia, 6.cage_location, 7.main_bar_dia
  // output: 1.no_of_sr 2.sr_dia 3.sr1_location, 4.sr2_location 5.sr3_location
  drawSetCirlularRing(pGridItem: any) {
    var lBPCRec = pGridItem;
    var lLapLength = 0;
    var lEndLength = 0;
    var lCageLength = 0;
    var lSLType = '';
    var lSLGrade = '';
    var lSLDia = 0;
    var lSLSpacing = '';
    var lSpacing1 = 0;
    var lSpacing2 = 0;
    var lSpacing3 = 0;
    var lMinTop = 700;
    var lMinEnd = 500;

    lMinTop = this.gMinTop;
    lMinEnd = this.gMinEnd;

    if (lBPCRec.spiral_link_type != null) {
      lSLType = lBPCRec.spiral_link_type;
    }

    if (lBPCRec.spiral_link_grade != null) {
      lSLGrade = lBPCRec.spiral_link_grade;
    }

    if (lBPCRec.spiral_link_dia != null) {
      lSLDia = parseInt(lBPCRec.spiral_link_dia);
    }

    if (lBPCRec.spiral_link_spacing != null) {
      lSLSpacing = lBPCRec.spiral_link_spacing;
    }

    if (lBPCRec.lap_length != null) {
      lLapLength = parseInt(lBPCRec.lap_length);
    }

    if (lBPCRec.end_length != null) {
      lEndLength = parseInt(lBPCRec.end_length);
    }

    if (lBPCRec.cage_length != null) {
      lCageLength = parseInt(lBPCRec.cage_length);
    }
    if(lSLSpacing != null ){
      var lArray = lSLSpacing.toString().split(',');
      if (lArray.length > 0) {
        lSpacing1 = parseInt(lArray[0]);
      }
      if (lArray.length > 1) {
        lSpacing2 = parseInt(lArray[1]);
      }
      if (lArray.length > 2) {
        lSpacing3 = parseInt(lArray[2]);
      }
    }

    if (lLapLength > 0) {
      if (lLapLength < lMinTop) {
        var lCRSpacing = 0;
        var lCRNo = 0;
        if (lSpacing1 > 0) {
          lCRNo = Math.ceil((lMinTop - lLapLength) / lSpacing1);
          if (lCRNo > 0) {
            lCRSpacing = Math.floor((lMinTop - lLapLength) / lCRNo);
          }
        }
        lBPCRec.no_of_cr_top = lCRNo;
        lBPCRec.cr_spacing_top = lCRSpacing;
      } else {
        lBPCRec.no_of_cr_top = 0;
        lBPCRec.cr_spacing_top = 0;
      }
    }

    if (lEndLength > 0) {
      if (lEndLength < lMinEnd) {
        var lCRSpacing = 0;
        var lCRNo = 0;
        if (
          (lSLType == '1 Spacing' || lSLType == 'Twin 1 Spacing') &&
          lSpacing1 > 0
        ) {
          lCRNo = Math.ceil((lMinEnd - lEndLength) / lSpacing1);
          if (lCRNo > 0) {
            lCRSpacing = Math.floor((lMinEnd - lEndLength) / lCRNo);
          }
        }
        if (
          (lSLType == '2 Spacing' ||
            lSLType == 'Twin 2 Spacing' ||
            lSLType == 'Single-Twin' ||
            lSLType == 'Twin-Single') &&
          lSpacing2 > 0
        ) {
          lCRNo = Math.ceil((lMinEnd - lEndLength) / lSpacing2);
          if (lCRNo > 0) {
            lCRSpacing = Math.floor((lMinEnd - lEndLength) / lCRNo);
          }
        }
        if (
          (lSLType == '3 Spacing' || lSLType == 'Twin 3 Spacing') &&
          lSpacing3 > 0
        ) {
          lCRNo = Math.ceil((lMinEnd - lEndLength) / lSpacing3);
          if (lCRNo > 0) {
            lCRSpacing = Math.floor((lMinEnd - lEndLength) / lCRNo);
          }
        }

        lBPCRec.no_of_cr_end = lCRNo;
        lBPCRec.cr_spacing_end = lCRSpacing;
      } else {
        lBPCRec.no_of_cr_end = 0;
        lBPCRec.cr_spacing_end = 0;
      }
    }
  }

  // Set multiple spiral link default length
  // input: 1.cage_length 2.lap_length 3.end_length 4.spiral_link_type
  // output: 1.sl1_length 2.sl2_length 3.sl3_length
  drawSetSLLengthValue(pGridItem: any) {
    var lBPCRec = pGridItem;
    var lLapLength = 0;
    var lEndLength = 0;
    var lCageLength = 0;
    var lSLType = '';
    var lSLLength1 = 0;
    var lSLLength2 = 0;
    var lSLLength3 = 0;
    var lMinTop = 700;
    var lMinEnd = 500;

    lMinTop = this.gMinTop;
    lMinEnd = this.gMinEnd;

    if (lBPCRec.spiral_link_type != null) {
      lSLType = lBPCRec.spiral_link_type;
    }

    if (lBPCRec.lap_length != null) {
      if (lBPCRec.lap_length > 0) {
        lLapLength = parseInt(lBPCRec.lap_length);
      }
    }

    if (lBPCRec.end_length != null) {
      if (lBPCRec.end_length > 0) {
        lEndLength = parseInt(lBPCRec.end_length);
      }
    }

    if (lBPCRec.cage_length != null) {
      if (lBPCRec.cage_length > 0) {
        lCageLength = parseInt(lBPCRec.cage_length);
      }
    }

    if (lBPCRec.sl1_length != null) {
      if (lBPCRec.sl1_length > 0) {
        lSLLength1 = parseInt(lBPCRec.sl1_length);
      }
    }

    if (lBPCRec.sl2_length != null) {
      if (lBPCRec.sl2_length > 0) {
        lSLLength2 = parseInt(lBPCRec.sl2_length);
      }
    }

    if (lBPCRec.sl3_length != null) {
      if (lBPCRec.sl3_length > 0) {
        lSLLength3 = parseInt(lBPCRec.sl3_length);
      }
    }

    if (lLapLength > 0 && lLapLength < lMinTop) {
      lLapLength = lMinTop;
    }

    if (lEndLength > 0 && lEndLength < lMinEnd) {
      lEndLength = lMinEnd;
    }
    if (lSLType == '1 Spacing' || lSLType == 'Twin 1 Spacing') {
      if (
        lSLLength1 == 0 ||
        lSLLength1 != lCageLength - lLapLength - lEndLength
      ) {
        lBPCRec.sl1_length = lCageLength - lLapLength - lEndLength;
        lBPCRec.sl2_length = 0;
        lBPCRec.sl3_length = 0;
        lBPCRec.total_sl_length = lBPCRec.sl1_length;
      }
    }
    if (
      lSLType == '2 Spacing' ||
      lSLType == 'Twin 2 Spacing' ||
      lSLType == 'Single-Twin' ||
      lSLType == 'Twin-Single'
    ) {
      if (
        lSLLength1 == 0 ||
        lSLLength2 == 0 ||
        lSLLength1 + lSLLength2 != lCageLength - lLapLength - lEndLength
      ) {
        lBPCRec.sl1_length =
          10 * Math.round((lCageLength - lLapLength - lEndLength) / 20);
        lBPCRec.sl2_length =
          lCageLength - lLapLength - lEndLength - lBPCRec.sl1_length;
        lBPCRec.sl3_length = 0;
        lBPCRec.total_sl_length = lBPCRec.sl1_length + lBPCRec.sl2_length;
      }
    }
    if (lSLType == '3 Spacing' || lSLType == 'Twin 3 Spacing') {
      if (
        lSLLength1 == 0 ||
        lSLLength2 == 0 ||
        lSLLength3 == 0 ||
        lSLLength1 + lSLLength2 + lSLLength2 !=
          lCageLength - lLapLength - lEndLength
      ) {
        lBPCRec.sl1_length =
          10 * Math.round((lCageLength - lLapLength - lEndLength) / 30);
        lBPCRec.sl2_length =
          10 * Math.round((lCageLength - lLapLength - lEndLength) / 30);
        lBPCRec.sl3_length =
          lCageLength -
          lLapLength -
          lEndLength -
          lBPCRec.sl1_length -
          lBPCRec.sl2_length;
        lBPCRec.total_sl_length =
          lBPCRec.sl1_length + lBPCRec.sl2_length + lBPCRec.sl2_length;
      }
    }
  }

  // Set extra support bar
  // input: 1.Pile Dia 2.main Bar Size 3.Main Bar Qty 4.Link Size
  // output: 1.extra_support_bar_ind 2.extra_support_bar_dia
  drawSetSupportBar(pGridItem: any) {
    var lBPCRec = pGridItem;
    var lPileDia = 0;
    var lMainBarSize = 0;
    var lMainBarQty = 0;
    var lLinkDia = 0;
    var lSBDia = 0;

    if (lBPCRec.pile_type != 'Micro-Pile') {
      lPileDia = lBPCRec.pile_dia;

      if (lBPCRec.main_bar_dia != null) {
        var lVar =lBPCRec.main_bar_dia.toString().split(',');
        if (lVar.length > 0) {
          lMainBarSize = parseInt(lVar[0]);
        }
        if (lVar.length > 1) {
          if (lMainBarSize < parseInt(lVar[1])) {
            lMainBarSize = parseInt(lVar[1]);
          }
        }
      }
      if (lBPCRec.main_bar_ct != null) {
        var lVar =lBPCRec.main_bar_ct.toString().split(',');
        if (lVar.length > 0 && parseInt(lVar[0]) > 0) {
          lMainBarQty = parseInt(lVar[0]);
        }
        if (lVar.length > 1) {
          if (parseInt(lVar[1]) > 0) {
            lMainBarQty = lMainBarQty + parseInt(lVar[1]);
          }
        }
      }

      if (lBPCRec.spiral_link_dia != null) {
        var lVar = lBPCRec.spiral_link_dia.toString().split(',');
        if (lVar.length > 0) {
          lLinkDia = parseInt(lVar[0]);
        }
        if (lVar.length > 1) {
          if (lLinkDia < parseInt(lVar[1])) {
            lLinkDia = parseInt(lVar[1]);
          }
        }
      }

      if (this.gSBPileDia != null && this.gSBPileDia.length > 0) {
        for (let i = 0; i < this.gSBPileDia.length; i++) {
          if (
            lPileDia == this.gSBPileDia[i] &&
            lMainBarSize >= this.gSBMainBarSizeFr[i] &&
            lMainBarSize <= this.gSBMainBarSizeTo[i] &&
            lMainBarQty >= this.gSBMainBarQty[i] &&
            lLinkDia <= this.gSBLinkDia[i]
          ) {
            lSBDia = this.gSBDia[i];
            break;
          }
        }
      }

      if (lSBDia > 0) {
        pGridItem.extra_support_bar_ind = 'Cross';
        pGridItem.extra_support_bar_dia = lSBDia;
      }
    }
  }
  drawSetCrankHeight(pGridItem: any) {
    var lMainBarDia = 0;
    var lCrankHT = 0;
    var lMainBarShape = '';

    if (pGridItem.main_bar_shape != null) {
      lMainBarShape = pGridItem.main_bar_shape;
    }
    if (pGridItem.main_bar_dia != null) {
      var lVar = pGridItem.main_bar_dia.toString().split(',');
      if (lVar.length > 0) {
        lMainBarDia = parseInt(lVar[0]);
      }
      if (lVar.length > 1) {
        if (lMainBarDia < parseInt(lVar[1])) {
          lMainBarDia = parseInt(lVar[1]);
        }
      }
    }
    if (lMainBarDia == 13) {
      lCrankHT = 31;
    } else if (lMainBarDia == 16) {
      lCrankHT = 37;
    } else if (lMainBarDia == 20) {
      lCrankHT = 45;
    } else if (lMainBarDia == 22) {
      lCrankHT = 49;
    } else if (lMainBarDia == 25) {
      lCrankHT = 55;
    } else if (lMainBarDia == 28) {
      lCrankHT = 61;
    } else if (lMainBarDia == 32) {
      lCrankHT = 69;
    } else if (lMainBarDia == 40) {
      lCrankHT = 85;
    } else if (lMainBarDia == 50) {
      lCrankHT = 105;
    }

    if (
      lMainBarShape == 'Crank' ||
      lMainBarShape == 'Crank-Top' ||
      lMainBarShape == 'Crank-Both'
    ) {
      pGridItem.crank_height_top = lCrankHT;
    } else {
      pGridItem.crank_height_top = 0;
    }

    if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
      pGridItem.crank_height_end = lCrankHT;
    } else {
      pGridItem.crank_height_end = 0;
    }

    if (pGridItem.main_bar_type == 'Mixed') {
      lCrankHT = 0;
      lMainBarDia = 0;
      if (pGridItem.main_bar_dia != null) {
        var lVar = pGridItem.main_bar_dia.toString().split(',');
        if (lVar.length > 0) {
          lMainBarDia = parseInt(lVar[0]);
        }
        if (lVar.length > 1) {
          if (lMainBarDia > parseInt(lVar[1])) {
            lMainBarDia = parseInt(lVar[1]);
          }
        }
      }
      if (lMainBarDia == 13) {
        lCrankHT = 31;
      } else if (lMainBarDia == 16) {
        lCrankHT = 37;
      } else if (lMainBarDia == 20) {
        lCrankHT = 45;
      } else if (lMainBarDia == 22) {
        lCrankHT = 49;
      } else if (lMainBarDia == 25) {
        lCrankHT = 55;
      } else if (lMainBarDia == 28) {
        lCrankHT = 61;
      } else if (lMainBarDia == 32) {
        lCrankHT = 69;
      } else if (lMainBarDia == 40) {
        lCrankHT = 85;
      } else if (lMainBarDia == 50) {
        lCrankHT = 105;
      }

      if (
        lMainBarShape == 'Crank' ||
        lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank-Both'
      ) {
        pGridItem.crank2_height_top = lCrankHT;
      } else {
        pGridItem.crank2_height_top = 0;
      }

      if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
        pGridItem.crank2_height_end = lCrankHT;
      } else {
        pGridItem.crank2_height_end = 0;
      }
    }
  }

  drawSetStartEndRingValue(pGridItem: any) {
    var lBPCRec = pGridItem;
    if (lBPCRec.rings_start == null) {
      lBPCRec.rings_start = 3;
    }
    if (lBPCRec.rings_end == null) {
      lBPCRec.rings_end = 2;
    }

    if (lBPCRec.rings_addn_no == null) {
      lBPCRec.rings_addn_no = 0;
    }

    if (lBPCRec.rings_addn_member == null) {
      lBPCRec.rings_addn_member = 0;
    }

    if (lBPCRec.rings_start == 0) {
      lBPCRec.rings_start = 3;
    }

    if (lBPCRec.rings_end == 0) {
      lBPCRec.rings_end = 2;
    }
  }

  // Set Circularr Ring
  // input: 1.cage_length 2.lap_length 3.end_length 4.spiral_link_grade 5.pile_dia, 6.cage_location, 7.main_bar_dia
  // output: 1.no_of_sr 2.sr_dia 3.sr1_location, 4.sr2_location 5.sr3_location
  drawSet2ndLayer(pGridItem: any) {
    var lBPCRec = pGridItem;
    var lPileType = '';
    var lMainBarShape = '';
    var lMainBarDia = '';
    var lLapLength = 0;
    var lEndLength = 0;
    var lMinTop = 700;
    var lMinEnd = 500;
    var lCageLength = 0;
    lMinTop = this.gMinTop;
    lMinEnd = this.gMinEnd;

    if (lBPCRec.pile_type != null) {
      lPileType = lBPCRec.pile_type;
    }

    if (lPileType == '') {
      return;
    }

    if (lPileType != 'Double-Layer') {
      //lBPCRec.mainbar_location_2layer = 0;
      //lBPCRec.mainbar_length_2layer = 0;
      return;
    }

    if (lBPCRec.main_bar_shape != null) {
      lMainBarShape = lBPCRec.main_bar_shape;
    }

    if (lBPCRec.main_bar_dia != null) {
      lMainBarDia = lBPCRec.main_bar_dia;
    }

    if (lBPCRec.lap_length != null) {
      lLapLength = parseInt(lBPCRec.lap_length);
    }

    if (lBPCRec.end_length != null) {
      lEndLength = parseInt(lBPCRec.end_length);
    }

    if (lBPCRec.cage_length != null) {
      lCageLength = parseInt(lBPCRec.cage_length);
    }

    // if (lLapLength > 0) {
    //   if (lMainBarShape == 'Straight' || lMainBarShape == 'Crank-End') {
    //     if (lLapLength == 100) {
    //       //customer set min 100, give full length of 2nd layer
    //       //lBPCRec.mainbar_location_2layer = 0;
    //     } else {
    //       //lBPCRec.mainbar_location_2layer = lLapLength;
    //     }
    //   } else {
    //     let lMainBarDiaArr =lMainBarDia.toString().split(',');
    //     var lMainBarDia1 = parseInt(lMainBarDiaArr[0]);
    //     //lBPCRec.mainbar_location_2layer = lLapLength + 10 * lMainBarDia1;
    //   }
    // }

    // if (lEndLength > 0) {
    //   if (
    //     lMainBarShape == 'Straight' ||
    //     lMainBarShape == 'Crank-Top' ||
    //     lMainBarShape == 'Crank'
    //   ) {
    //     if (lEndLength == 100) {
    //       //customer set min 100, give full length of 2nd layer
    //       //lBPCRec.mainbar_length_2layer = lCageLength - lBPCRec.mainbar_location_2layer;
    //     } else {
    //       //lBPCRec.mainbar_length_2layer = lCageLength - lBPCRec.mainbar_location_2layer - lEndLength;
    //     }
    //   } else {
    //     let lMainBarDiaArr = lMainBarDia.toString().split(',');
    //     var lMainBarDia1 = parseInt(lMainBarDiaArr[0]);
    //     //lBPCRec.mainbar_length_2layer = lCageLength - lBPCRec.mainbar_location_2layer - lEndLength - 10 * lMainBarDia1;
    //   }
    // }
  }

  lDist:any;
  //2D drawing
  drawPlanView(
    ctx: any,
    pNumOfMainBars: any,
    pLayer: any,
    pMainBarType: any,
    pArrangement: any,
    pMainBarDia: any,
    pSameBarBundle: any,
    pExtraSupportBars: any
  ) {
    var lCover = 15;
    var lNoofMainBars = 30;
    var origX = 100;
    var origY = 100;
    var lMainBarDia = 5;
    var lMainBarDia2 = 4;

    if (pExtraSupportBars == null) {
      pExtraSupportBars = 'None';
    }
    if(pNumOfMainBars != null){

      lNoofMainBars = pNumOfMainBars.toString().split(',')[0];
    }

    var lRealMainbarDia1 = 0;
    var lRealMainbarDia2 = 0;
    if(pMainBarDia != null){
      var lVar = pMainBarDia.toString().split(',');
      if (lVar.length > 0) {
        lRealMainbarDia1 = parseInt(lVar[0]);
      }
      if (lVar.length > 1) {
        lRealMainbarDia2 = parseInt(lVar[1]);
      }
    }

    // Clear main Bar and stifener ring
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(origX, origY, origX - lCover - 2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // Pile
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#cccccc';
    ctx.arc(origX, origY, origX - 5, 0, 2 * Math.PI);
    ctx.stroke();
    // Spiral Link
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0000ff';
    ctx.arc(origX, origY, origX - 17, 0, 2 * Math.PI);
    ctx.stroke();

    if (lNoofMainBars <= 30) {
      lMainBarDia = 5;
    } else if (lNoofMainBars <= 60) {
      lMainBarDia = 3;
    } else if (lNoofMainBars <= 90) {
      lMainBarDia = 2;
    } else {
      lMainBarDia = 1;
    }

    // Main Bars
    var lRaduim = origX - 19 - lMainBarDia;
    if (pLayer == 'Single-Layer' || pLayer == 'Micro-Pile') {
      if (pMainBarType == 'Single') {
        if (pArrangement == 'Single') {
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#ff0000';
          ctx.lineWidth = 1;
          for (let i = 0; i < lNoofMainBars; i++) {
            this.drawPlanMainBar(
              ctx,
              origX + lRaduim * Math.sin((2 * Math.PI * i) / lNoofMainBars),
              origY - lRaduim * Math.cos((2 * Math.PI * i) / lNoofMainBars),
              lMainBarDia
            );
          }
        } else if (pArrangement == 'Side-By-Side') {
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#ff0000';
          ctx.lineWidth = 1;
          var lLoop = Math.floor(lNoofMainBars / 2);
          for (let i = 0; i < lLoop; i++) {
            this.drawPlanMainBar(
              ctx,
              origX +
                lRaduim *
                  Math.sin(2 * Math.PI * (i / lLoop) - lMainBarDia / lRaduim),
              origY -
                lRaduim *
                  Math.cos(2 * Math.PI * (i / lLoop) - lMainBarDia / lRaduim),
              lMainBarDia
            );
            this.drawPlanMainBar(
              ctx,
              origX +
                lRaduim *
                  Math.sin(2 * Math.PI * (i / lLoop) + lMainBarDia / lRaduim),
              origY -
                lRaduim *
                  Math.cos(2 * Math.PI * (i / lLoop) + lMainBarDia / lRaduim),
              lMainBarDia
            );
          }
        } else if (pArrangement == 'In-Out') {
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#ff0000';
          ctx.lineWidth = 1;
          var lLoop = Math.floor(lNoofMainBars / 2);
          for (let i = 0; i < lLoop; i++) {
            this.drawPlanMainBar(
              ctx,
              origX + lRaduim * Math.sin((2 * Math.PI * i) / lLoop),
              origY - lRaduim * Math.cos((2 * Math.PI * i) / lLoop),
              lMainBarDia
            );
            this.drawPlanMainBar(
              ctx,
              origX +
                (lRaduim - 2 * lMainBarDia) *
                  Math.sin((2 * Math.PI * i) / lLoop),
              origY -
                (lRaduim - 2 * lMainBarDia) *
                  Math.cos((2 * Math.PI * i) / lLoop),
              lMainBarDia
            );
          }
        } else {
          // Other arrangement
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#ff0000';
          ctx.lineWidth = 1;
          for (let i = 0; i < lNoofMainBars; i++) {
            this.drawPlanMainBar(
              ctx,
              origX + lRaduim * Math.sin((2 * Math.PI * i) / lNoofMainBars),
              origY - lRaduim * Math.cos((2 * Math.PI * i) / lNoofMainBars),
              lMainBarDia
            );
          }
        }
      } else {
        //mixed main bar
        var lBarCTs = pNumOfMainBars.toString().split(',');
        var lTotBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]);

        if (lTotBars <= 30) {
          if (lRealMainbarDia1 >= lRealMainbarDia2) {
            lMainBarDia = 5;
            lMainBarDia2 = 4;
          } else {
            lMainBarDia = 4;
            lMainBarDia2 = 5;
          }
        } else if (lTotBars <= 60) {
          if (lRealMainbarDia1 >= lRealMainbarDia2) {
            lMainBarDia = 3;
            lMainBarDia2 = 4;
          } else {
            lMainBarDia = 3;
            lMainBarDia2 = 4;
          }
        } else if (lTotBars <= 90) {
          if (lRealMainbarDia1 >= lRealMainbarDia2) {
            lMainBarDia = 3;
            lMainBarDia2 = 2;
          } else {
            lMainBarDia = 2;
            lMainBarDia2 = 3;
          }
        } else {
          if (lRealMainbarDia1 >= lRealMainbarDia2) {
            lMainBarDia = 2;
            lMainBarDia2 = 1;
          } else {
            lMainBarDia = 1;
            lMainBarDia2 = 2;
          }
        }
        if (pArrangement == 'Single') {
          var lLoop1 = parseInt(lBarCTs[0]);
          var lLoop2 = parseInt(lBarCTs[1]);
          this.lDist = [];
          this.getBarDistribution(lLoop1, lLoop2, this.lDist);

          for (let i = 0; i < lTotBars; i++) {
            if (this.lDist[i] == 1) {
              ctx.strokeStyle = '#00ff00';
              ctx.fillStyle = '#00ff00';
              ctx.lineWidth = 1;
              this.drawPlanMainBar(
                ctx,
                origX + lRaduim * Math.sin((2 * Math.PI * i) / lTotBars),
                origY - lRaduim * Math.cos((2 * Math.PI * i) / lTotBars),
                lMainBarDia2
              );
            } else {
              ctx.strokeStyle = '#ff0000';
              ctx.fillStyle = '#ff0000';
              ctx.lineWidth = 1;
              this.drawPlanMainBar(
                ctx,
                origX + lRaduim * Math.sin((2 * Math.PI * i) / lTotBars),
                origY - lRaduim * Math.cos((2 * Math.PI * i) / lTotBars),
                lMainBarDia
              );
            }
          }
        } else if (pArrangement == 'Side-By-Side') {
          if (pSameBarBundle != 'Y') {
            ctx.strokeStyle = '#ff0000';
            ctx.fillStyle = '#ff0000';
            ctx.lineWidth = 1;
            var lLoop1 = Math.floor(parseInt(lBarCTs[0]));
            var lLoop2 = Math.floor(parseInt(lBarCTs[1]));
            var lTotBars = lLoop1;
            if (lTotBars < lLoop2) {
              lTotBars = lLoop2;
              lLoop2 = lLoop1;
              lLoop1 = lTotBars;
            }
            if (lTotBars <= 30) {
              lMainBarDia = 5;
              lMainBarDia2 = 5;
            } else if (lTotBars <= 60) {
              lMainBarDia = 3;
              lMainBarDia2 = 3;
            } else if (lTotBars <= 90) {
              lMainBarDia = 2;
              lMainBarDia2 = 2;
            } else {
              lMainBarDia = 1;
              lMainBarDia2 = 1;
            }
            this.lDist = []
            this.getBarDistribution(lLoop2, lLoop1 - lLoop2, this.lDist);
            for (let i = 0; i < lTotBars; i++) {
              if (this.lDist[i] == 0) {
                ctx.strokeStyle = '#ff0000';
                ctx.fillStyle = '#ff0000';
                ctx.lineWidth = 1;
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    lRaduim *
                      Math.sin(
                        (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lRaduim
                      ),
                  origY -
                    lRaduim *
                      Math.cos(
                        (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lRaduim
                      ),
                  lMainBarDia2
                );
                ctx.strokeStyle = '#00ff00';
                ctx.fillStyle = '#00ff00';
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    lRaduim *
                      Math.sin(
                        (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lRaduim
                      ),
                  origY -
                    lRaduim *
                      Math.cos(
                        (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lRaduim
                      ),
                  lMainBarDia2
                );
              } else {
                ctx.strokeStyle = '#ff0000';
                ctx.fillStyle = '#ff0000';
                ctx.lineWidth = 1;
                this.drawPlanMainBar(
                  ctx,
                  origX + lRaduim * Math.sin((2 * Math.PI * i) / lTotBars),
                  origY - lRaduim * Math.cos((2 * Math.PI * i) / lTotBars),
                  lMainBarDia
                );
              }
            }
          } else {
            ctx.strokeStyle = '#ff0000';
            ctx.fillStyle = '#ff0000';
            ctx.lineWidth = 1;
            var lLoop1 = Math.floor(parseInt(lBarCTs[0]) / 2);
            var lLoop2 = Math.floor(parseInt(lBarCTs[1]) / 2);
            var lTotBars = lLoop1 + lLoop2;
            this.lDist = []
            this.getBarDistribution(lLoop1, lLoop2, this.lDist);
            for (let i = 0; i < lTotBars; i++) {
              if (this.lDist[i] == 1) {
                ctx.strokeStyle = '#00ff00';
                ctx.fillStyle = '#00ff00';
                ctx.lineWidth = 1;
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    lRaduim *
                      Math.sin(
                        (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lRaduim
                      ),
                  origY -
                    lRaduim *
                      Math.cos(
                        (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lRaduim
                      ),
                  lMainBarDia2
                );
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    lRaduim *
                      Math.sin(
                        (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lRaduim
                      ),
                  origY -
                    lRaduim *
                      Math.cos(
                        (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lRaduim
                      ),
                  lMainBarDia2
                );
              } else {
                ctx.strokeStyle = '#ff0000';
                ctx.fillStyle = '#ff0000';
                ctx.lineWidth = 1;
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    lRaduim *
                      Math.sin(
                        (2 * Math.PI * i) / lTotBars - lMainBarDia / lRaduim
                      ),
                  origY -
                    lRaduim *
                      Math.cos(
                        (2 * Math.PI * i) / lTotBars - lMainBarDia / lRaduim
                      ),
                  lMainBarDia
                );
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    lRaduim *
                      Math.sin(
                        (2 * Math.PI * i) / lTotBars + lMainBarDia / lRaduim
                      ),
                  origY -
                    lRaduim *
                      Math.cos(
                        (2 * Math.PI * i) / lTotBars + lMainBarDia / lRaduim
                      ),
                  lMainBarDia
                );
              }
            }
          }
        } else if (pArrangement == 'In-Out') {
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#ff0000';
          ctx.lineWidth = 1;
          var lLoop1 = Math.floor(parseInt(lBarCTs[0]));
          var lLoop2 = Math.floor(parseInt(lBarCTs[1]));

          if (pSameBarBundle != 'Y') {
            if (lLoop1 <= 30) {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 5;
                lMainBarDia2 = 4;
              } else {
                lMainBarDia = 4;
                lMainBarDia2 = 5;
              }
            } else if (lLoop1 <= 60) {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 4;
                lMainBarDia2 = 3;
              } else {
                lMainBarDia = 3;
                lMainBarDia2 = 4;
              }
            } else if (lLoop1 <= 90) {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 3;
                lMainBarDia2 = 2;
              } else {
                lMainBarDia = 2;
                lMainBarDia2 = 3;
              }
            } else {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 2;
                lMainBarDia2 = 1;
              } else {
                lMainBarDia = 1;
                lMainBarDia2 = 2;
              }
            }

            this.lDist = []
            this.getBarDistribution(lLoop1 - lLoop2, lLoop2, this.lDist);

            for (let i = 0; i < lLoop1; i++) {
              ctx.strokeStyle = '#ff0000';
              ctx.fillStyle = '#ff0000';
              ctx.lineWidth = 1;
              this.drawPlanMainBar(
                ctx,
                origX + lRaduim * Math.sin((2 * Math.PI * i) / lLoop1),
                origY - lRaduim * Math.cos((2 * Math.PI * i) / lLoop1),
                lMainBarDia
              );

              if (this.lDist[i] == 1) {
                ctx.strokeStyle = '#00ff00';
                ctx.fillStyle = '#00ff00';
                ctx.lineWidth = 1;
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    (lRaduim - 2 * lMainBarDia) *
                      Math.sin((2 * Math.PI * i) / lLoop1),
                  origY -
                    (lRaduim - 2 * lMainBarDia) *
                      Math.cos((2 * Math.PI * i) / lLoop1),
                  lMainBarDia2
                );
              }
            }
          } else {
            lLoop1 = Math.floor(parseInt(lBarCTs[0]) / 2);
            lLoop2 = Math.floor(parseInt(lBarCTs[1]) / 2);
            var lTotBars = lLoop1 + lLoop2;
            if (lTotBars <= 30) {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 5;
                lMainBarDia2 = 4;
              } else {
                lMainBarDia = 4;
                lMainBarDia2 = 5;
              }
            } else if (lTotBars <= 60) {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 4;
                lMainBarDia2 = 3;
              } else {
                lMainBarDia = 3;
                lMainBarDia2 = 4;
              }
            } else if (lTotBars <= 90) {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 3;
                lMainBarDia2 = 2;
              } else {
                lMainBarDia = 2;
                lMainBarDia2 = 3;
              }
            } else {
              if (lRealMainbarDia1 >= lRealMainbarDia2) {
                lMainBarDia = 2;
                lMainBarDia2 = 1;
              } else {
                lMainBarDia = 1;
                lMainBarDia2 = 2;
              }
            }

            this.lDist = []
            this.getBarDistribution(lLoop1, lLoop2, this.lDist);

            for (let i = 0; i < lTotBars; i++) {
              if (this.lDist[i] == 1) {
                ctx.strokeStyle = '#00ff00';
                ctx.fillStyle = '#00ff00';
                ctx.lineWidth = 1;
                this.drawPlanMainBar(
                  ctx,
                  origX + lRaduim * Math.sin((2 * Math.PI * i) / lTotBars),
                  origY - lRaduim * Math.cos((2 * Math.PI * i) / lTotBars),
                  lMainBarDia2
                );
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    (lRaduim - 2 * lMainBarDia2) *
                      Math.sin((2 * Math.PI * i) / lTotBars),
                  origY -
                    (lRaduim - 2 * lMainBarDia2) *
                      Math.cos((2 * Math.PI * i) / lTotBars),
                  lMainBarDia2
                );
              } else {
                ctx.strokeStyle = '#ff0000';
                ctx.fillStyle = '#ff0000';
                ctx.lineWidth = 1;
                this.drawPlanMainBar(
                  ctx,
                  origX + lRaduim * Math.sin((2 * Math.PI * i) / lTotBars),
                  origY - lRaduim * Math.cos((2 * Math.PI * i) / lTotBars),
                  lMainBarDia
                );
                this.drawPlanMainBar(
                  ctx,
                  origX +
                    (lRaduim - 2 * lMainBarDia) *
                      Math.sin((2 * Math.PI * i) / lTotBars),
                  origY -
                    (lRaduim - 2 * lMainBarDia) *
                      Math.cos((2 * Math.PI * i) / lTotBars),
                  lMainBarDia
                );
              }
            }
          }
        } else {
          // Other arrangement
          lLoop1 = Math.floor(parseInt(lBarCTs[0]) / 2);
          lLoop2 = Math.floor(parseInt(lBarCTs[1]) / 2);
          var lTotBars = lLoop1 + lLoop2;

          this.lDist = []
          this.getBarDistribution(lLoop1, lLoop2, this.lDist);

          for (let i = 0; i < lTotBars; i++) {
            if (this.lDist[i] == 1) {
              ctx.strokeStyle = '#00ff00';
              ctx.fillStyle = '#00ff00';
              ctx.lineWidth = 1;
              this.drawPlanMainBar(
                ctx,
                origX + lRaduim * Math.sin((2 * Math.PI * i) / lTotBars),
                origY - lRaduim * Math.cos((2 * Math.PI * i) / lTotBars),
                lMainBarDia2
              );
            } else {
              ctx.strokeStyle = '#ff0000';
              ctx.fillStyle = '#ff0000';
              ctx.lineWidth = 1;
              this.drawPlanMainBar(
                ctx,
                origX + lRaduim * Math.sin((2 * Math.PI * i) / lTotBars),
                origY - lRaduim * Math.cos((2 * Math.PI * i) / lTotBars),
                lMainBarDia
              );
            }
          }
        }
      }
    } else {
      //two layer

      var lBarCTs =
        pNumOfMainBars!.toString().indexOf(',') != -1
          ? pNumOfMainBars.toString().split(',')
          : pNumOfMainBars;
      var lTotBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]);

      ctx.strokeStyle = '#ff0000';
      ctx.fillStyle = '#ff0000';
      ctx.lineWidth = 1;
      var lLoop1 = Math.floor(parseInt(lBarCTs[0]));
      var lLoop2 = Math.floor(parseInt(lBarCTs[1]));

      var lTotBars = lLoop1 + lLoop2;

      if (lLoop1 <= 30) {
        lMainBarDia = 5;
      } else if (lLoop1 <= 60) {
        lMainBarDia = 3;
      } else if (lLoop1 <= 90) {
        lMainBarDia = 2;
      } else {
        lMainBarDia = 1;
      }

      lMainBarDia2 = lMainBarDia;
      if (lRealMainbarDia1 > lRealMainbarDia2) {
        lMainBarDia2 = lMainBarDia - 1;
        if (lMainBarDia2 == 0) {
          lMainBarDia2 = 1;
        }
      }

      if (lRealMainbarDia2 > lRealMainbarDia1) {
        lMainBarDia = lMainBarDia2 - 1;
        if (lMainBarDia == 0) {
          lMainBarDia = 1;
        }
      }

      if (pArrangement == 'Side-By-Side') {
        var lLoop1 = Math.floor(lLoop1 / 2);
        var lLoop2 = Math.floor(lLoop2 / 2);

        for (let i = 0; i < lLoop1; i++) {
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#ff0000';
          ctx.lineWidth = 1;
          this.drawPlanMainBar(
            ctx,
            origX +
              lRaduim *
                Math.sin((2 * Math.PI * i) / lLoop1 - lMainBarDia2 / lRaduim),
            origY -
              lRaduim *
                Math.cos((2 * Math.PI * i) / lLoop1 - lMainBarDia2 / lRaduim),
            lMainBarDia
          );
          this.drawPlanMainBar(
            ctx,
            origX +
              lRaduim *
                Math.sin((2 * Math.PI * i) / lLoop1 + lMainBarDia2 / lRaduim),
            origY -
              lRaduim *
                Math.cos((2 * Math.PI * i) / lLoop1 + lMainBarDia2 / lRaduim),
            lMainBarDia
          );
        }

        for (let i = 0; i < lLoop2; i++) {
          ctx.strokeStyle = '#00ff00';
          ctx.fillStyle = '#00ff00';
          ctx.lineWidth = 1;
          this.drawPlanMainBar(
            ctx,
            origX +
              (lRaduim - lMainBarDia - lMainBarDia2 - 4) *
                Math.sin((2 * Math.PI * i) / lLoop2 - lMainBarDia2 / lRaduim),
            origY -
              (lRaduim - lMainBarDia - lMainBarDia2 - 4) *
                Math.cos((2 * Math.PI * i) / lLoop2 - lMainBarDia2 / lRaduim),
            lMainBarDia2
          );
          this.drawPlanMainBar(
            ctx,
            origX +
              (lRaduim - lMainBarDia - lMainBarDia2 - 4) *
                Math.sin((2 * Math.PI * i) / lLoop2 + lMainBarDia2 / lRaduim),
            origY -
              (lRaduim - lMainBarDia - lMainBarDia2 - 4) *
                Math.cos((2 * Math.PI * i) / lLoop2 + lMainBarDia2 / lRaduim),
            lMainBarDia2
          );
        }
      } else {
        for (let i = 0; i < lLoop1; i++) {
          ctx.strokeStyle = '#ff0000';
          ctx.fillStyle = '#ff0000';
          ctx.lineWidth = 1;
          this.drawPlanMainBar(
            ctx,
            origX + lRaduim * Math.sin((2 * Math.PI * i) / lLoop1),
            origY - lRaduim * Math.cos((2 * Math.PI * i) / lLoop1),
            lMainBarDia
          );
        }

        for (let i = 0; i < lLoop2; i++) {
          ctx.strokeStyle = '#00ff00';
          ctx.fillStyle = '#00ff00';
          ctx.lineWidth = 1;
          this.drawPlanMainBar(
            ctx,
            origX +
              (lRaduim - lMainBarDia - lMainBarDia2 - 4) *
                Math.sin((2 * Math.PI * i) / lLoop2),
            origY -
              (lRaduim - lMainBarDia - lMainBarDia2 - 4) *
                Math.cos((2 * Math.PI * i) / lLoop2),
            lMainBarDia2
          );
        }
      }

      // end of 2 layers
    }

    // Stiffener ring & Extra Support bars
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0000ff';
    if (pLayer == 'Single-Layer' || pLayer == 'Micro-Pile') {
      if (pMainBarType == 'Single') {
        if (pArrangement == 'Single' || pArrangement == 'Side-By-Side') {
          ctx.arc(
            origX,
            origY,
            origX - 19 - lMainBarDia * 2 - 2,
            0,
            2 * Math.PI
          );
          if (pExtraSupportBars == 'Cross') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.moveTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
          }
          if (pExtraSupportBars == 'Square') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
          }
        } else if (pArrangement == 'In-Out') {
          ctx.arc(
            origX,
            origY,
            origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2,
            0,
            2 * Math.PI
          );
          if (pExtraSupportBars == 'Cross') {
            ctx.moveTo(
              origX,
              origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
            );
            ctx.lineTo(
              origX,
              origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
            );
            ctx.moveTo(
              origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
              origY
            );
            ctx.lineTo(
              origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
              origY
            );
          }
          if (pExtraSupportBars == 'Square') {
            ctx.moveTo(
              origX,
              origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
            );
            ctx.lineTo(
              origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
              origY
            );
            ctx.lineTo(
              origX,
              origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
            );
            ctx.lineTo(
              origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
              origY
            );
            ctx.lineTo(
              origX,
              origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
            );
          }
        } else {
          ctx.arc(
            origX,
            origY,
            origX - 19 - lMainBarDia * 2 - 2,
            0,
            2 * Math.PI
          );
          if (pExtraSupportBars == 'Cross') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.moveTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
          }
          if (pExtraSupportBars == 'Square') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
          }
        }
      } else {
        if (pArrangement == 'Single' || pArrangement == 'Side-By-Side') {
          ctx.arc(
            origX,
            origY,
            origX - 19 - lMainBarDia * 2 - 2,
            0,
            2 * Math.PI
          );
          if (pExtraSupportBars == 'Cross') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.moveTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
          }
          if (pExtraSupportBars == 'Square') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
          }
        } else if (pArrangement == 'In-Out') {
          var lBarCTs =
            pNumOfMainBars!.toString().indexOf(',') != -1
              ? pNumOfMainBars.toString().split(',')
              : pNumOfMainBars;
          var lTotBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]);
          var lLoop1 = Math.floor(parseInt(lBarCTs[0]));
          var lLoop2 = Math.floor(parseInt(lBarCTs[1]));
          if (lLoop1 == lLoop2) {
            ctx.arc(
              origX,
              origY,
              origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2,
              0,
              2 * Math.PI
            );
            if (pExtraSupportBars == 'Cross') {
              ctx.moveTo(
                origX,
                origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2)
              );
              ctx.lineTo(
                origX,
                origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2)
              );
              ctx.moveTo(
                origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2),
                origY
              );
              ctx.lineTo(
                origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2),
                origY
              );
            }
            if (pExtraSupportBars == 'Square') {
              ctx.moveTo(
                origX,
                origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2)
              );
              ctx.lineTo(
                origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2),
                origY
              );
              ctx.lineTo(
                origX,
                origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2)
              );
              ctx.lineTo(
                origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2),
                origY
              );
              ctx.lineTo(
                origX,
                origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2)
              );
            }
          } else {
            ctx.arc(
              origX,
              origY,
              origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2,
              0,
              2 * Math.PI
            );
            if (pExtraSupportBars == 'Cross') {
              ctx.moveTo(
                origX,
                origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
              );
              ctx.lineTo(
                origX,
                origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
              );
              ctx.moveTo(
                origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
                origY
              );
              ctx.lineTo(
                origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
                origY
              );
            }
            if (pExtraSupportBars == 'Square') {
              ctx.moveTo(
                origX,
                origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
              );
              ctx.lineTo(
                origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
                origY
              );
              ctx.lineTo(
                origX,
                origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
              );
              ctx.lineTo(
                origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2),
                origY
              );
              ctx.lineTo(
                origX,
                origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia * 2)
              );
            }
          }
        } else {
          ctx.arc(
            origX,
            origY,
            origX - 19 - lMainBarDia * 2 - 2,
            0,
            2 * Math.PI
          );
          if (pExtraSupportBars == 'Cross') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.moveTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
          }
          if (pExtraSupportBars == 'Square') {
            ctx.moveTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX - (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY + (origX - 19 - lMainBarDia * 2 - 2));
            ctx.lineTo(origX + (origX - 19 - lMainBarDia * 2 - 2), origY);
            ctx.lineTo(origX, origY - (origX - 19 - lMainBarDia * 2 - 2));
          }
        }
      }
    } else {
      // 2 layers
      //Stiffener Rings 1
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0000ff';
      ctx.arc(origX, origY, origX - 19 - lMainBarDia * 2 - 2, 0, 2 * Math.PI);
      ctx.stroke();

      //Stiffener Rings 2
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0000ff';
      ctx.arc(
        origX,
        origY,
        origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4,
        0,
        2 * Math.PI
      );

      if (pExtraSupportBars == 'Cross') {
        ctx.moveTo(
          origX,
          origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4)
        );
        ctx.lineTo(
          origX,
          origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4)
        );
        ctx.moveTo(
          origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4),
          origY
        );
        ctx.lineTo(
          origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4),
          origY
        );
      }
      if (pExtraSupportBars == 'Square') {
        ctx.moveTo(
          origX,
          origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4)
        );
        ctx.lineTo(
          origX - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4),
          origY
        );
        ctx.lineTo(
          origX,
          origY + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4)
        );
        ctx.lineTo(
          origX + (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4),
          origY
        );
        ctx.lineTo(
          origX,
          origY - (origX - 19 - lMainBarDia * 2 - 2 - lMainBarDia2 * 2 - 4)
        );
      }
    }
    ctx.stroke();

    //drawMainBarLine(this.contextp, 1);
    //drawLinks(this.contextp, lMainBarDia, 1);
    this.drawMainBarLine(ctx, 1);
    this.drawLinks(ctx, lMainBarDia, 1);
  }

  //2D drawing
  drawPlanViewSingle(ctx: any, pNumOfMainBars: any) {
    var lCover = 15;
    var lNoofMainBars = 30;
    var origX = 100;
    var origY = 100;
    var lMainBarDia = 5;

    lNoofMainBars = pNumOfMainBars;

    if (lNoofMainBars <= 30) {
      lMainBarDia = 5;
    } else if (lNoofMainBars <= 60) {
      lMainBarDia = 3;
    } else if (lNoofMainBars <= 90) {
      lMainBarDia = 2;
    } else {
      lMainBarDia = 1;
    }

    // Clear main Bar and stifener ring
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(origX, origY, origX - lCover - 2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // Pile
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#cccccc';
    ctx.arc(origX, origY, origX - 5, 0, 2 * Math.PI);
    ctx.stroke();
    // Spiral Link
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0000ff';
    ctx.arc(origX, origY, origX - 17, 0, 2 * Math.PI);
    ctx.stroke();

    // Main Bars
    var lRaduim = origX - 19 - lMainBarDia;
    ctx.strokeStyle = '#ff0000';
    ctx.fillStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff0000';
    ctx.fillStyle = '#ff0000';
    ctx.lineWidth = 1;
    var lLoop = Math.floor(lNoofMainBars / 2);
    for (let i = 0; i < lLoop; i++) {
      this.drawPlanMainBar(
        ctx,
        origX + lRaduim * Math.sin((2 * Math.PI * i) / lLoop),
        origY - lRaduim * Math.cos((2 * Math.PI * i) / lLoop),
        lMainBarDia
      );
      this.drawPlanMainBar(
        ctx,
        origX +
          (lRaduim - 2 * lMainBarDia) * Math.sin((2 * Math.PI * i) / lLoop),
        origY -
          (lRaduim - 2 * lMainBarDia) * Math.cos((2 * Math.PI * i) / lLoop),
        lMainBarDia
      );
    }
    //for (i = 0; i < lNoofMainBars; i++) {
    //    drawPlanMainBar(ctx,
    //        origX + (origX - 19 - lMainBarDia) * Math.sin(2 * Math.PI * i / lNoofMainBars),
    //        origY - (origY - 19 - lMainBarDia) * Math.cos(2 * Math.PI * i / lNoofMainBars),
    //        lMainBarDia);
    //}
    // Steffener ring
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0000ff';
    ctx.arc(origX, origY, origX - 19 - lMainBarDia * 2 - 2, 0, 2 * Math.PI);
    ctx.stroke();

    this.drawMainBarLine(ctx, 1);
    this.drawLinks(ctx, lMainBarDia, 1);
  }

  drawPlanMainBar(ctx: any, valX: any, valY: any, barDia: any) {
    ctx.beginPath();
    ctx.arc(valX, valY, barDia, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  drawPileDiameter(ctx: any) {
    var lCover = 75;
    var lNoofMainBars = 60;
    var origX = 100;
    var origY = 100;
    var lMainBarDia = 5;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff00ff';

    // upper line
    ctx.beginPath();
    ctx.moveTo(origX - 10, 5);
    ctx.lineTo(origX + origX + origX - 5, 5);
    ctx.stroke();
    // bottom line
    ctx.beginPath();
    ctx.moveTo(origX - 10, origY + origY - 5);
    ctx.lineTo(origX + origX + origX - 5, origY + origY - 5);
    ctx.stroke();
    // upper vertical line
    ctx.beginPath();
    ctx.moveTo(origX + origX + origX - 27, 5);
    ctx.lineTo(origX + origX + origX - 27, origY - 20);
    ctx.stroke();
    //up arrow
    ctx.beginPath();
    ctx.moveTo(origX + origX + origX - 27 - 2.5, 5 + 5);
    ctx.lineTo(origX + origX + origX - 27, 5);
    ctx.lineTo(origX + origX + origX - 27 + 2.5, 5 + 5);
    ctx.stroke();

    // bootom vertical line
    ctx.beginPath();
    ctx.moveTo(origX + origX + origX - 27, origY + origY - 5);
    ctx.lineTo(origX + origX + origX - 27, origY + 25);
    ctx.stroke();
    //down arrow
    ctx.beginPath();
    ctx.moveTo(origX + origX + origX - 27 - 2.5, origY + origY - 5 - 5);
    ctx.lineTo(origX + origX + origX - 27, origY + origY - 5);
    ctx.lineTo(origX + origX + origX - 27 + 2.5, origY + origY - 5 - 5);
    ctx.stroke();

    //draw "Pile Diameter"
    ctx.fillStyle = '#000000';
    ctx.font = '10px Verdana';
    ctx.fillText('Pile', origX + origX + origX - 37, origY - 5);
    ctx.fillText('Diameter', origX + origX + origX - 49, origY + 5);
    //ctx.fillStyle = "#0000ff";
    //ctx.fillText("2500 mm", origX + origX + origX - 47, origY + 15);
  }

  drawMainBarLine(ctx: any, pLineOnly: any) {
    var lDrawCover = 15;
    var lNoofMainBars = 60;
    var origX = 100;
    var origY = 100;
    var lMainBarDia = 5;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff00ff';

    // upper line
    ctx.beginPath();
    ctx.moveTo(origX + origX, 5 + lDrawCover + 2 + lMainBarDia / 2);
    ctx.lineTo(origX, 5 + lDrawCover + 2 + lMainBarDia / 2);
    ctx.stroke();

    //left arrow
    ctx.beginPath();
    ctx.moveTo(origX + 6, 5 + lDrawCover + 2 + lMainBarDia / 2 - 3);
    ctx.lineTo(origX, 5 + lDrawCover + 2 + lMainBarDia / 2);
    ctx.lineTo(origX + 6, 5 + lDrawCover + 2 + lMainBarDia / 2 + 3);
    ctx.stroke();

    if (pLineOnly == 0) {
      //draw "Main Bars"
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText(
        'Main Bars',
        origX + origX + 2,
        5 + lDrawCover + 2 + lMainBarDia / 2 + 3
      );
    }
  }

  drawPileDiameterNumber(ctx: any, pPileDia: any) {
    var origX = 100;
    var origY = 100;

    ctx.font = '12px Verdana';
    if (this.lPrePileDia != '') {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        this.lPrePileDia + ' mm',
        origX +
          origX +
          origX -
          45 -
          ctx.measureText(this.lPrePileDia).width / 2,
        origY + 20
      );
    }
    ctx.fillStyle = '#0000ff';
    this.lPrePileDia = pPileDia;
    ctx.fillText(
      this.lPrePileDia + ' mm',
      origX + origX + origX - 45 - ctx.measureText(this.lPrePileDia).width / 2,
      origY + 20
    );
  }

  drawCover(ctx: any) {
    var lDrawCover = 17;
    var lNoofMainBars = 60;
    var origX = 100;
    var origY = 100;
    var lMainBarDia = 5;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff00ff';

    // upper line
    ctx.beginPath();
    ctx.moveTo(origX - 10, origY + origY - lDrawCover);
    ctx.lineTo(origX + origX, origY + origY - lDrawCover);
    ctx.stroke();

    // upper vertical line
    ctx.beginPath();
    ctx.moveTo(origX + origX - 17 + 60, origY + origY - lDrawCover - 15);
    ctx.lineTo(origX + origX - 17, origY + origY - lDrawCover - 15);
    ctx.lineTo(origX + origX - 17, origY + origY - lDrawCover);
    ctx.stroke();

    //top arrow
    ctx.beginPath();
    ctx.moveTo(origX + origX - 17 - 2.5, origY + origY - lDrawCover - 5);
    ctx.lineTo(origX + origX - 17, origY + origY - lDrawCover);
    ctx.lineTo(origX + origX - 17 + 2.5, origY + origY - lDrawCover - 5);
    ctx.stroke();

    // bootom vertical line
    ctx.beginPath();
    ctx.moveTo(origX + origX - 17, origY + origY + 10);
    ctx.lineTo(origX + origX - 17, origY + origY - 5);
    ctx.stroke();

    //bottom arrow
    ctx.beginPath();
    ctx.moveTo(origX + origX - 17 - 2.5, origY + origY);
    ctx.lineTo(origX + origX - 17, origY + origY - 5);
    ctx.lineTo(origX + origX - 17 + 2.5, origY + origY);
    ctx.stroke();

    //draw "Cover"
    ctx.fillStyle = '#000000';
    ctx.font = '10px Verdana';
    ctx.fillText(
      'Cover',
      origX + origX - 17 + 40 - ctx.measureText('Cover').width / 2,
      origY + origY - lDrawCover - 32
    );
  }

  drawCoverWords(ctx: any, pCover: any) {
    var lDrawCover = 15;
    var origX = 100;
    var origY = 100;

    ctx.font = '12px Verdana';
    if (this.lPreCover != '') {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        this.lPreCover,
        origX + origX - 17 + 40 - ctx.measureText(this.lPreCover).width / 2,
        origY + origY - lDrawCover - 20
      );
    }
    ctx.fillStyle = '#0000ff';
    this.lPreCover = pCover + ' mm';
    ctx.fillText(
      this.lPreCover,
      origX + origX - 17 + 40 - ctx.measureText(this.lPreCover).width / 2,
      origY + origY - lDrawCover - 20
    );

    // let lData = this.grid.getData();
    // if (lData > 0) {
    //   for (let i = 0; i < lData.length; i++) {
    //     lData[i].cage_dia = lData[i].pile_dia - 2 * parseInt(pCover);
    //   }
    // }
  }

  drawMainBarWords(ctx: any, PGrade: any, pDia: any, pNumber: any) {
    var lDrawCover = 15;
    var origX = 100;
    var origY = 100;
    var lMainBarDia = 5;

    ctx['font'] = '12px Verdana';
    if (this.lPreMainBar != '') {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        this.lPreMainBar,
        origX + origX + 2,
        5 + lDrawCover + 2 + lMainBarDia / 2 + 3 + 12
      );
    }
    ctx.fillStyle = '#0000ff';
    this.lPreMainBar = pNumber + ' x ' + PGrade + pDia;
    ctx.fillText(
      this.lPreMainBar,
      origX + origX + 2,
      5 + lDrawCover + 2 + lMainBarDia / 2 + 3 + 12
    );
  }

  drawLinks(ctx: any, pMainBarDia: any, pLineOnly: any) {
    var lDrawCover = 15;
    var lNoofMainBars = 60;
    var origX = 100;
    var origY = 100;
    var lMainBarDia = 5;

    lMainBarDia = pMainBarDia;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff00ff';

    // Spiral Link line
    ctx.beginPath();
    ctx.moveTo(origX + origX - lDrawCover - 10, origY / 2 + 10);
    ctx.lineTo(origX + origX, origY / 2 + 10);
    ctx.stroke();

    //left arrow
    ctx.beginPath();
    ctx.moveTo(origX + origX - lDrawCover - 10 + 6, origY / 2 + 10 - 3);
    ctx.lineTo(origX + origX - lDrawCover - 10, origY / 2 + 10);
    ctx.lineTo(origX + origX - lDrawCover - 10 + 6, origY / 2 + 10 + 3);
    ctx.stroke();

    if (pLineOnly == 0) {
      //draw "Spiral Link"
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText('Spiral', origX + origX + 2, origY / 2 + 10);
      ctx.fillText('Link', origX + origX + 2, origY / 2 + 10 + 10);
    }

    // Stiffener Ring line
    ctx.beginPath();
    ctx.moveTo(origX + origX - lDrawCover - 5 - lMainBarDia * 2, origY);
    ctx.lineTo(origX + origX, origY);
    ctx.stroke();

    //left arrow
    ctx.beginPath();
    ctx.moveTo(origX + origX - lDrawCover - 5 - lMainBarDia * 2 + 6, origY - 3);
    ctx.lineTo(origX + origX - lDrawCover - 5 - lMainBarDia * 2, origY);
    ctx.lineTo(origX + origX - lDrawCover - 5 - lMainBarDia * 2 + 6, origY + 3);
    ctx.stroke();

    if (pLineOnly == 0) {
      //draw "Stiffener Ring"
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText('Stiffener', origX + origX + 2, origY);
      ctx.fillText('Ring', origX + origX + 2, origY + 10);
    }
  }
  getBarDistribution(pBar1CT: any, pBar2CT: any, pResult: any) {
    var lTotal = pBar1CT + pBar2CT;
    var lDis1 = Math.floor(lTotal / pBar2CT);
    if (this.lDist == undefined) {
      this.lDist = [];
    }
    var lOK = 0;
    for (let i = 0; i < lTotal; i++) {
      if ((i + 1) % lDis1 == 0 && lOK < pBar2CT) {
        lOK++;
        this.lDist.push(1);
      } else {
        this.lDist.push(0);
      }
    }
    if (pBar2CT > 0) {
      var lRem1 = lTotal % pBar2CT;
      if (lRem1 > 1) {
        this.getBarDist(lTotal - lRem1, lRem1, this.lDist);
      }
    }
  }

  getBarDist(pBar1CT: any, pBar2CT: any, pResult: any) {
    var lTotals = pBar1CT + pBar2CT;
    var lDis1 = Math.floor(lTotals / pBar2CT);

    for (let i = 0; i < pBar2CT; i++) {
      //pResult.splice((i + 1) * lDis1, 0, 0);
      this.lDist.splice(i * lDis1, 0, 0);
    }
    if (this.lDist.length > lTotals) {
      this.lDist.splice(lTotals, this.lDist.length - lTotals);
    }
    var lRem1 = lTotals % pBar2CT;
    var lHave = 0;
    for (let i = lTotals; i > lTotals - lRem1; i--) {
      if (this.lDist[i] == 1) {
        lHave = 1;
        break;
      }
    }
    if (lRem1 > 1 && lHave == 0) {
      this.getBarDist(lTotals - lRem1, lRem1, this.lDist);
    }
  }

  getBPCWeight(pGridItem: any) {
    var lBPCWT = 0;
    var lMainBarWT = 0;
    var lSpiralLinkWT = 0;
    var lSRWT = 0;
    var lCRWT = 0;

    //Main Bar Wt
    var lPileType = pGridItem.pile_type;
    var lCageDia = pGridItem.cage_dia;
    var lMainBarType = pGridItem.main_bar_type;
    var lMainBarCT = pGridItem.main_bar_ct;
    var lMainBarShape = pGridItem.main_bar_shape;
    var lMainBarDia = pGridItem.main_bar_dia;
    //pGridItem.main_bar_topjoin;
    //pGridItem.main_bar_endjoin;
    var lCageLength = pGridItem.cage_length;
    var lTopCrankHT = pGridItem.crank_height_top;
    var lEndCrankHT = pGridItem.crank_height_end;
    var lMainBarLenLayer2 = pGridItem.mainbar_length_2layer;

    if (lPileType == 'Micro-Pile') {
      var lMainBarLen = lCageLength;
      lMainBarLen = parseInt(lCageLength);
      lMainBarWT =
        parseInt(lMainBarCT) * this.getRebarWeight(lMainBarDia, lMainBarLen);
    } else if (lPileType == 'Single-Layer' && lMainBarType == 'Single') {
      var lMainBarLen = lCageLength;
      if (lMainBarShape == 'Crank-Top' || lMainBarShape == 'Crank') {
        lMainBarLen =
          parseInt(lMainBarLen) +
          parseInt(lMainBarDia) * 10 -
          Math.sqrt(
            Math.pow(parseInt(lMainBarDia) * 10, 2) -
              Math.pow(parseInt(lTopCrankHT), 2)
          );
      } else if (lMainBarShape == 'Crank-End') {
        lMainBarLen =
          parseInt(lMainBarLen) +
          parseInt(lMainBarDia) * 10 -
          Math.sqrt(
            Math.pow(parseInt(lMainBarDia) * 10, 2) -
              Math.pow(parseInt(lEndCrankHT), 2)
          );
      } else if (lMainBarShape == 'Crank-Both') {
        lMainBarLen =
          parseInt(lMainBarLen) +
          2 * parseInt(lMainBarDia) * 10 -
          Math.sqrt(
            Math.pow(parseInt(lMainBarDia) * 10, 2) -
              Math.pow(parseInt(lTopCrankHT), 2)
          ) -
          Math.sqrt(
            Math.pow(parseInt(lMainBarDia) * 10, 2) -
              Math.pow(parseInt(lEndCrankHT), 2)
          ); //Need to check calculations
      } else {
        lMainBarLen = parseInt(lCageLength);
      }
      lMainBarWT =
        parseInt(lMainBarCT) * this.getRebarWeight(lMainBarDia, lMainBarLen);
    } else if (lPileType == 'Single-Layer' && lMainBarType == 'Mixed') {
      var lMainbarDiaArr =
        lMainBarDia!.toString().indexOf(',') != -1
          ? lMainBarDia.toString().split(',')
          : lMainBarDia;
      var lMainbarCTArr =
        lMainBarCT!.toString().indexOf(',') != -1
          ? lMainBarCT.toString().split(',')
          : lMainBarCT;
      var lMainBarLen = lCageLength;
      if (lMainbarDiaArr.length > 0 && lMainbarCTArr.length > 0) {
        if (lMainBarShape == 'Crank-Top' || lMainBarShape == 'Crank') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            parseInt(lMainbarDiaArr[0]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-End') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            parseInt(lMainbarDiaArr[0]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-Both') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            2 * parseInt(lMainbarDiaArr[0]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            ) -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            ); //Need to check calculations
        } else {
          lMainBarLen = parseInt(lCageLength);
        }
        lMainBarWT =
          parseInt(lMainbarCTArr[0]) *
          this.getRebarWeight(lMainbarDiaArr[0], lMainBarLen);
      }

      if (lMainbarDiaArr.length > 1 && lMainbarCTArr.length > 1) {
        if (lMainBarShape == 'Crank-Top' || lMainBarShape == 'Crank') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            parseInt(lMainbarDiaArr[1]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[1]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-End') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            parseInt(lMainbarDiaArr[1]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[1]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-Both') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            2 * parseInt(lMainbarDiaArr[1]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[1]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            ) -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[1]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            ); //Need to check calculations
        } else {
          lMainBarLen = parseInt(lCageLength);
        }
        lMainBarWT =
          lMainBarWT +
          parseInt(lMainbarCTArr[1]) *
            this.getRebarWeight(lMainbarDiaArr[1], lMainBarLen);
      }
    } else if (lPileType == 'Double-Layer') {
      var lMainbarDiaArr =
        lMainBarDia!.toString().indexOf(',') != -1
          ? lMainBarDia.toString().split(',')
          : lMainBarDia;
      var lMainbarCTArr =
        lMainBarCT!.toString().indexOf(',') != -1
          ? lMainBarCT.toString().split(',')
          : lMainBarCT;
      var lMainBarLen = lCageLength;
      if (lMainbarDiaArr.length > 0 && lMainbarCTArr.length > 0) {
        if (lMainBarShape == 'Crank-Top' || lMainBarShape == 'Crank') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            parseInt(lMainbarDiaArr[0]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-End') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            parseInt(lMainbarDiaArr[0]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-Both') {
          lMainBarLen =
            parseInt(lMainBarLen) +
            2 * parseInt(lMainbarDiaArr[0]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            ) -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[0]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            ); //Need to check
        } else {
          lMainBarLen = parseInt(lCageLength);
        }
        lMainBarWT =
          parseInt(lMainbarCTArr[0]) *
          this.getRebarWeight(lMainbarDiaArr[0], lMainBarLen);
      }

      if (lMainbarDiaArr.length > 1 && lMainbarCTArr.length > 1) {
        if (lMainBarShape == 'Crank-Top' || lMainBarShape == 'Crank') {
          lMainBarLen =
            parseInt(lMainBarLenLayer2) +
            parseInt(lMainbarDiaArr[1]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[1]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-End') {
          lMainBarLen =
            parseInt(lMainBarLenLayer2) +
            parseInt(lMainbarDiaArr[1]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[1]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            );
        } else if (lMainBarShape == 'Crank-Both') {
          lMainBarLen =
            parseInt(lMainBarLenLayer2) +
            2 * parseInt(lMainbarDiaArr[1]) * 10 -
            Math.sqrt(
              Math.pow(parseInt(lMainbarDiaArr[1]) * 10, 2) -
                Math.pow(parseInt(lTopCrankHT), 2)
            ) -
            Math.sqrt(
              Math.pow(parseInt(lMainBarDia[1]) * 10, 2) -
                Math.pow(parseInt(lEndCrankHT), 2)
            ); //Need to check
        } else {
          lMainBarLen = parseInt(lMainBarLenLayer2);
        }
        lMainBarWT =
          lMainBarWT +
          parseInt(lMainbarCTArr[1]) *
            this.getRebarWeight(lMainbarDiaArr[1], lMainBarLen);
      }
    }

    //Spiral Link Weight
    var lSLType = pGridItem.spiral_link_type;
    var lSLDia = parseInt(pGridItem.spiral_link_dia);
    var lSLSpacing = pGridItem.spiral_link_spacing;
    var lLapLength = parseInt(pGridItem.lap_length);
    var lEndLength = parseInt(pGridItem.end_length);

    var lStartRings = parseInt(pGridItem.rings_start);
    var lEndRings = parseInt(pGridItem.rings_end);
    var lAddnRingNo = parseInt(pGridItem.rings_addn_no);
    var lAddnRingSet = parseInt(pGridItem.rings_addn_member);
    var lSL1Length = parseInt(pGridItem.sl1_length);
    var lSL2Length = parseInt(pGridItem.sl2_length);
    var lSL3Length = parseInt(pGridItem.sl3_length);
    var lSL1Dia = parseInt(pGridItem.sl1_dia);
    var lSL2Dia = parseInt(pGridItem.sl2_dia);
    var lSL3Dia = parseInt(pGridItem.sl3_dia);

    lSpiralLinkWT = 0;
    if (lSLType == '1 Spacing') {
      lSpiralLinkWT = this.getRebarWeight(
        lSL1Dia,
        (lSL1Length / parseInt(lSLSpacing) +
          lStartRings +
          lEndRings +
          lAddnRingNo * lAddnRingSet) *
          parseInt(lCageDia) *
          Math.PI
      );
    } else if (lSLType == '2 Spacing') {
      var lSpacingArr =
        lSLSpacing!.toString().indexOf(',') != -1
          ? lSLSpacing.toString().split(',')
          : lSLSpacing;
      if (lSpacingArr.length > 0) {
        lSpiralLinkWT = this.getRebarWeight(
          lSL1Dia,
          (lSL1Length / parseInt(lSpacingArr[0]) +
            lStartRings +
            lEndRings +
            lAddnRingNo * lAddnRingSet) *
            parseInt(lCageDia) *
            Math.PI
        );
      }
      if (lSpacingArr.length > 1) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          this.getRebarWeight(
            lSL2Dia,
            (lSL2Length / parseInt(lSpacingArr[1])) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
    } else if (lSLType == '3 Spacing') {
      var lSpacingArr =
        lSLSpacing!.toString().indexOf(',') != -1
          ? lSLSpacing.toString().split(',')
          : lSLSpacing;
      if (lSpacingArr.length > 0) {
        lSpiralLinkWT = this.getRebarWeight(
          lSLDia,
          (lSL1Length / parseInt(lSpacingArr[0]) +
            lStartRings +
            lEndRings +
            lAddnRingNo * lAddnRingSet) *
            parseInt(lCageDia) *
            Math.PI
        );
      }
      if (lSpacingArr.length > 1) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          this.getRebarWeight(
            lSL2Dia,
            (lSL2Length / parseInt(lSpacingArr[1])) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
      if (lSpacingArr.length > 2) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          this.getRebarWeight(
            lSL3Dia,
            (lSL3Length / parseInt(lSpacingArr[2])) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
    } else if (lSLType == 'Twin 1 Spacing') {
      lSpiralLinkWT =
        2 *
        this.getRebarWeight(
          lSL1Dia,
          (lSL1Length / parseInt(lSLSpacing) +
            lStartRings +
            lEndRings +
            lAddnRingNo * lAddnRingSet) *
            parseInt(lCageDia) *
            Math.PI
        );
    } else if (lSLType == 'Twin 2 Spacing') {
      var lSpacingArr =
        lSLSpacing!.toString().indexOf(',') != -1
          ? lSLSpacing.toString().split(',')
          : lSLSpacing;
      if (lSpacingArr.length > 0) {
        lSpiralLinkWT = this.getRebarWeight(
          lSL1Dia,
          (lSL1Length / parseInt(lSpacingArr[0]) +
            lStartRings +
            lEndRings +
            lAddnRingNo * lAddnRingSet) *
            parseInt(lCageDia) *
            Math.PI
        );
      }
      if (lSpacingArr.length > 1) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          this.getRebarWeight(
            lSL2Dia,
            (lSL2Length / parseInt(lSpacingArr[1])) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
      lSpiralLinkWT = 2 * lSpiralLinkWT;
    } else if (lSLType == 'Twin 3 Spacing') {
      var lSpacingArr =
        lSLSpacing!.toString().indexOf(',') != -1
          ? lSLSpacing.toString().split(',')
          : lSLSpacing;
      if (lSpacingArr.length > 0) {
        lSpiralLinkWT = this.getRebarWeight(
          lSL1Dia,
          (lSL1Length / parseInt(lSpacingArr[0]) +
            lStartRings +
            lEndRings +
            lAddnRingNo * lAddnRingSet) *
            parseInt(lCageDia) *
            Math.PI
        );
      }
      if (lSpacingArr.length > 1) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          this.getRebarWeight(
            lSL2Dia,
            (lSL2Length / parseInt(lSpacingArr[1])) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
      if (lSpacingArr.length > 2) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          this.getRebarWeight(
            lSL3Dia,
            (lSL3Length / parseInt(lSpacingArr[2])) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
      lSpiralLinkWT = 2 * lSpiralLinkWT;
    } else if (lSLType == 'Single-Twin') {
      var lSpacingArr =
        lSLSpacing!.toString().indexOf(',') != -1
          ? lSLSpacing.toString().split(',')
          : lSLSpacing;
      if (lSpacingArr.length > 0) {
        lSpiralLinkWT = this.getRebarWeight(
          lSL1Dia,
          (lSL1Length / parseInt(lSpacingArr[0]) +
            lStartRings +
            lEndRings +
            lAddnRingNo * lAddnRingSet) *
            parseInt(lCageDia) *
            Math.PI
        );
      }
      if (lSpacingArr.length > 1) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          2 *
            this.getRebarWeight(
              lSL2Dia,
              (lSL2Length / parseInt(lSpacingArr[1])) *
                parseInt(lCageDia) *
                Math.PI
            );
      }
    } else if (lSLType == 'Twin-Single') {
      var lSpacingArr =
        lSLSpacing!.toString().indexOf(',') != -1
          ? lSLSpacing.toString().split(',')
          : lSLSpacing;
      if (lSpacingArr.length > 0) {
        lSpiralLinkWT =
          2 *
          this.getRebarWeight(
            lSL1Dia,
            (lSL1Length / parseInt(lSpacingArr[0]) +
              lStartRings +
              lEndRings +
              lAddnRingNo * lAddnRingSet) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
      if (lSpacingArr.length > 1) {
        lSpiralLinkWT =
          lSpiralLinkWT +
          this.getRebarWeight(
            lSL2Dia,
            (lSL2Length / parseInt(lSpacingArr[1])) *
              parseInt(lCageDia) *
              Math.PI
          );
      }
    }

    // Stiffener Rings
    var lNoOfSR = parseInt(pGridItem.no_of_sr);
    var lSRDia = parseInt(pGridItem.sr_dia);
    if (
      (lPileType == 'Single-Layer' || lPileType == 'Micro-Pile') &&
      lMainBarType == 'Single'
    ) {
      if (pGridItem.main_bar_arrange == 'In-Out') {
        lSRWT = this.getRebarWeight(
          lSRDia,
          Math.PI * lNoOfSR * (lCageDia - 2 * lSLDia - 4 * lMainBarDia) +
            10 * lSRDia
        );
      } else {
        lSRWT = this.getRebarWeight(
          lSRDia,
          Math.PI * lNoOfSR * (lCageDia - 2 * lSLDia - 2 * lMainBarDia) +
            10 * lSRDia
        );
      }
    } else if (lPileType == 'Single-Layer' && lMainBarType == 'Mixed') {
      var lMainbarDiaArr =
        lMainBarDia!.toString().indexOf(',') != -1
          ? lMainBarDia.toString().split(',')
          : lMainBarDia;
      var lMainbarCTArr =
        lMainBarCT!.toString().indexOf(',') != -1
          ? lMainBarCT.toString().split(',')
          : lMainBarCT;

      if (lMainbarDiaArr.length > 1 && lMainbarCTArr.length > 1) {
        if (pGridItem.main_bar_arrange == 'In-Out') {
          if (lMainbarCTArr[0] == lMainbarCTArr[1]) {
            lSRWT = this.getRebarWeight(
              lSRDia,
              Math.PI *
                lNoOfSR *
                (lCageDia -
                  2 * lSLDia -
                  2 * lMainbarDiaArr[0] -
                  2 * lMainbarDiaArr[1]) +
                10 * lSRDia
            );
          } else {
            lSRWT = this.getRebarWeight(
              lSRDia,
              Math.PI *
                lNoOfSR *
                (lCageDia - 2 * lSLDia - 4 * lMainbarDiaArr[0]) +
                10 * lSRDia
            );
          }
        } else {
          lSRWT = this.getRebarWeight(
            lSRDia,
            Math.PI *
              lNoOfSR *
              (lCageDia - 2 * lSLDia - 2 * lMainbarDiaArr[0]) +
              10 * lSRDia
          );
        }
      }
    } else if (lPileType == 'Double-Layer') {
      var lMainbarDiaArr =
        lMainBarDia!.toString().indexOf(',') != -1
          ? lMainBarDia.toString().split(',')
          : lMainBarDia;
      var lMainbarCTArr =
        lMainBarCT!.toString().indexOf(',') != -1
          ? lMainBarCT.toString().split(',')
          : lMainBarCT;
      if (lMainbarDiaArr.length > 1 && lMainbarCTArr.length > 1) {
        lSRWT = this.getRebarWeight(
          lSRDia,
          Math.PI * lNoOfSR * (lCageDia - 2 * lSLDia - 2 * lMainbarDiaArr[0]) +
            10 * lSRDia
        );
        lSRWT =
          lSRWT +
          this.getRebarWeight(
            lSRDia,
            Math.PI *
              lNoOfSR *
              (lCageDia -
                2 * lSLDia -
                2 * lMainbarDiaArr[0] -
                2 * lSLDia -
                2 * lMainbarDiaArr[1]) +
              10 * lSRDia
          );
      }
    }

    // Circular Rings
    var lCRTop = parseInt(pGridItem.no_of_cr_top);
    var lCREnd = parseInt(pGridItem.no_of_cr_end);
    lCRWT =
      (lCRTop + lCREnd) *
      this.getRebarWeight(lSLDia, parseInt(lCageDia) * Math.PI + 45 * lSL1Dia);

    var lQty = parseInt(pGridItem.cage_qty);

    if (lQty > 0) {
      lBPCWT = lQty * (lMainBarWT + lSpiralLinkWT + lSRWT + lCRWT);
    } else {
      lBPCWT = 0;
    }
    // //debugger;
    pGridItem.cage_weight = Math.round(lBPCWT) / 1000;
  }

  getRebarWeight(pDia: any, pLength: any) {
    var lStdDia = [6, 8, 10, 12, 13, 16, 20, 24, 25, 28, 32, 36, 40, 50];
    var lStdUnitWT = [
      0.222, 0.395, 0.617, 0.888, 1.042, 1.579, 2.466, 3.699, 3.854, 4.834,
      6.313, 7.769, 9.864, 15.413,
    ];
    var lWeight = 0;

    var lDia = parseInt(pDia);
    var lLength = parseInt(pLength);
    var lUnitWT = 0;

    if (lDia > 0 && lLength > 0) {
      for (var i = 0; i < lStdDia.length; i++) {
        if (lDia == lStdDia[i]) {
          lUnitWT = lStdUnitWT[i];
          break;
        }
      }
    }

    if (lUnitWT > 0) {
      lWeight = (lUnitWT * pLength) / 1000;
    }

    return lWeight;
  }

  drawAdditionalRings(
    ctx: any,
    pNoOfSR: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pStartRings: any,
    pEndRings: any,
    pAdditionalRingMember: any,
    pAdditionalRingEach: any
  ) {
    //Dimensions
    //Stiffener Ring
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lSRPosY = lTopHeight - 7;

    var lCrankHeight = 5;
    var lCrankWidth = 10;

    lCrankHeight = this.gCrankHeight;
    lCrankWidth = this.gCrankWidth;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    //var lBPCRec = grid.getDataItem(pRowNo);
    var lStartRings = 0;
    var lEndRings = 0;
    var lAdditionalRingMember = 0;
    var lAdditionalRingEach = 0;

    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;

    var lNoOfSR = 0;

    if (pNoOfSR != null) {
      lNoOfSR = parseInt(pNoOfSR);
    }

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }
    if (pStartRings != null) {
      lStartRings = parseInt(pStartRings);
    }

    if (pEndRings != null) {
      lEndRings = parseInt(pEndRings);
    }
    if (pAdditionalRingMember != null) {
      lAdditionalRingMember = parseInt(pAdditionalRingMember);
    }
    if (pAdditionalRingEach != null) {
      lAdditionalRingEach = parseInt(pAdditionalRingEach);
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }

    // canvasPV = document.getElementById(pCanvas);
    // ctx = canvasPV.getContext("2d");

    if (lStartRings > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = 'Rings@Start: ' + lStartRings;
      ctx.fillText(
        this.lText,
        lLeftRightMargin +
          lTopLength -
          lCrankWidth -
          4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY
      );
    }

    if (lEndRings > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = 'Rings@End: ' + lEndRings;
      ctx.fillText(
        this.lText,
        lCanvasWidth -
          lEndLength -
          lLeftRightMargin +
          2 +
          lCrankWidth -
          ctx.measureText(this.lText).width / 2,
        lSRPosY
      );
    }

    //draw additional ring
    ctx.lineWidth = 1;
    //ctx.strokeStyle = "#804000";
    ctx.strokeStyle = '#ac5000';

    if (lAdditionalRingMember > 0 && lAdditionalRingEach > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      if (lAdditionalRingMember == 1) {
        this.lText = 'Additional Rings: ' + lAdditionalRingEach + ' at center';
      } else {
        this.lText =
          'Additional Rings: ' +
          lAdditionalRingEach +
          ' at ' +
          lAdditionalRingMember +
          ' sections';
      }
      ctx.fillText(
        this.lText,
        (lCanvasWidth + lTopLength - lEndLength) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 13
      );

      //draw additional rings
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = lAdditionalRingEach;
      for (let i = 0; i < lAdditionalRingMember; i++) {
        // Detect Collision with stiffener ring
        var lX =
          lLeftRightMargin +
          lTopLength +
          ((i + 1) *
            (lCanvasWidth - 2 * lLeftRightMargin - lTopLength - lEndLength)) /
            (lAdditionalRingMember + 1);

        if (lNoOfSR == 1) {
          if (
            lX > (lCanvasWidth + lTopLength - lEndLength) / 2 - 5 &&
            lX < (lCanvasWidth + lTopLength - lEndLength) / 2 + 5
          ) {
            lX = lX + 16;
          }
        } else if (lNoOfSR == 2) {
          //Left SR
          if (
            lX > lLeftRightMargin + lTopLength + 50 - 5 &&
            lX < lLeftRightMargin + lTopLength + 50 + 5
          ) {
            lX = lX + 16;
          }
          //Right SR
          if (
            lX > lCanvasWidth - lLeftRightMargin - lEndLength - 50 - 5 &&
            lX < lCanvasWidth - lLeftRightMargin - lEndLength - 50 + 5
          ) {
            lX = lX + 16;
          }
        } else {
          //Left SR
          if (
            lX > lLeftRightMargin + lTopLength + 50 - 5 &&
            lX < lLeftRightMargin + lTopLength + 50 + 5
          ) {
            lX = lX + 16;
          }
          //Right SR
          if (
            lX > lCanvasWidth - lLeftRightMargin - lEndLength - 50 - 5 &&
            lX < lCanvasWidth - lLeftRightMargin - lEndLength - 50 + 5
          ) {
            lX = lX + 16;
          }
          for (let j = 0; j < lNoOfSR - 2; j++) {
            if (
              lX >
                lLeftRightMargin +
                  lTopLength +
                  50 +
                  ((j + 1) *
                    (lCanvasWidth -
                      lLeftRightMargin -
                      lEndLength -
                      50 -
                      (lLeftRightMargin + lTopLength + 50))) /
                    (lNoOfSR - 1) -
                  5 &&
              lX <
                lLeftRightMargin +
                  lTopLength +
                  50 +
                  ((j + 1) *
                    (lCanvasWidth -
                      lLeftRightMargin -
                      lEndLength -
                      50 -
                      (lLeftRightMargin + lTopLength + 50))) /
                    (lNoOfSR - 1) +
                  5
            ) {
              lX = lX + 16;
            }
          }
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(lX - 1, lCanvasHeight - lTopHeight + 3);
        ctx.lineTo(lX - 1, lTopHeight - 3);

        ctx.moveTo(lX + 1, lCanvasHeight - lTopHeight + 3);
        ctx.lineTo(lX + 1, lTopHeight - 3);
        ctx.stroke();

        ctx.fillText(
          this.lText,
          lX - ctx.measureText(this.lText).width / 2,
          lTopHeight - 6
        );
      }
    }
    // end of Additional Ring
  }

  drawCrankHeight(
    ctx: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pMainBarShape: any,
    pCrankHeightTop: any,
    pCrankHeightEnd: any
  ) {
    //Dimensions
    //Stiffener Ring
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lSRPosY = lTopHeight - 7;

    var lCrankHeight = 5;
    var lCrankWidth = 10;

    lCrankHeight = this.gCrankHeight;
    lCrankWidth = this.gCrankWidth;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    //var lBPCRec = grid.getDataItem(pRowNo);
    var lMainBarShape = '';
    var lCrankHeightTop = 0;
    var lCrankHeightEnd = 0;

    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }

    if (pMainBarShape != null) {
      lMainBarShape = pMainBarShape;
    }

    if (pCrankHeightTop != null) {
      lCrankHeightTop = parseInt(pCrankHeightTop);
    }

    if (pCrankHeightEnd != null) {
      lCrankHeightEnd = parseInt(pCrankHeightEnd);
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }

    // canvasPV = document.getElementById(pCanvas);
    // ctx = canvasPV.getContext("2d");

    // Left vertical line
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff00ff';

    if (
      lMainBarShape == 'Crank-Top' ||
      lMainBarShape == 'Crank' ||
      lMainBarShape == 'Crank-Both'
    ) {
      // dimension horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 3,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 43,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight + 13
      );
      ctx.stroke();

      //up arrow
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33 - 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33 + 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      //down arrow
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33 - 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33 + 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.stroke();

      //Horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 93,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = 'Crank Height - ' + lCrankHeightTop;
      ctx.fillText(
        this.lText,
        lLeftRightMargin + lTopLength - 117,
        lCanvasHeight - lTopHeight - lCrankHeight - 17
      );
    }

    if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
      // dimension horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 3,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 43,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight + 13
      );
      ctx.stroke();

      //up arrow
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 - 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 + 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      //down arrow
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 - 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 + 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.stroke();

      //Horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 93,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = lCrankHeightEnd + ' - Crank Height';
      ctx.fillText(
        this.lText,
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 - 5,
        lCanvasHeight - lTopHeight - lCrankHeight - 17
      );
    }

    // end of draw crank height
  }

  drawCouplerStd(pCTX: any, pX: any, pY: any, pCouplerLength: any) {
    // Coupler
    pCTX.lineWidth = 7;
    pCTX.strokeStyle = '#000000';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY);
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();
  }

  drawCouplerExtN(
    pCTX: any,
    pX: any,
    pY: any,
    pCouplerLength: any,
    pTopEnd: any
  ) {
    // Clear the
    pCTX.lineWidth = 7;
    pCTX.strokeStyle = '#ffffff';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY);
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();

    if (pTopEnd == 'Top') {
      // Coupler
      pCTX.lineWidth = 7;
      pCTX.strokeStyle = '#000000';
      pCTX.beginPath();
      pCTX.moveTo(pX, pY);
      pCTX.lineTo(pX + (2 * pCouplerLength) / 3, pY);
      pCTX.stroke();

      pCTX.lineWidth = 1;
      pCTX.strokeStyle = '#0000B0';
      pCTX.beginPath();
      pCTX.moveTo(pX + (2 * pCouplerLength) / 3, pY - 2);
      pCTX.lineTo(pX + (2 * pCouplerLength) / 3, pY + 2);
      for (let i = 0; i < Math.floor(pCouplerLength / 3 / 2); i += 2) {
        pCTX.lineTo(pX + (2 * pCouplerLength) / 3 + 2 * i, pY - 2);
        pCTX.lineTo(pX + (2 * pCouplerLength) / 3 + 2 * i + 1, pY + 2);
      }
      pCTX.lineTo(pX + pCouplerLength, pY);
      pCTX.stroke();
    } else {
      // Coupler
      pCTX.lineWidth = 1;
      pCTX.strokeStyle = '#0000B0';
      pCTX.beginPath();
      pCTX.moveTo(pX, pY - 2);
      pCTX.lineTo(pX, pY + 2);
      for (let i = 0; i < Math.floor(pCouplerLength / 3 / 2); i += 2) {
        pCTX.lineTo(pX + 2 * i, pY - 2);
        pCTX.lineTo(pX + 2 * i + 1, pY + 2);
      }
      pCTX.lineTo(pX + pCouplerLength / 3, pY);
      pCTX.stroke();

      pCTX.lineWidth = 7;
      pCTX.strokeStyle = '#000000';
      pCTX.beginPath();
      pCTX.moveTo(pX + pCouplerLength / 3, pY);
      pCTX.lineTo(pX + pCouplerLength, pY);
      pCTX.stroke();
    }
  }

  drawStudStd(pCTX: any, pX: any, pY: any, pCouplerLength: any) {
    // Clear the
    pCTX.lineWidth = 7;
    pCTX.strokeStyle = '#ffffff';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY);
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();

    // draw Coupler stud standard
    pCTX.lineWidth = 1;
    pCTX.strokeStyle = '#0000B0';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY - 2);
    pCTX.lineTo(pX, pY + 2);
    for (let i = 0; i < pCouplerLength / 2; i += 2) {
      pCTX.lineTo(pX + 2 * i, pY - 2);
      pCTX.lineTo(pX + 2 * i + 1, pY + 2);
    }
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();
  }

  drawHorDim(pCTX: any, pX1: any, pX2: any, pY: any, pValue: any) {
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    pCTX.lineWidth = 1;
    pCTX.strokeStyle = '#ff00ff';
    //Horizontal line2
    pCTX.beginPath();
    pCTX.moveTo(pX1, pY);
    pCTX.lineTo(pX2, pY);
    pCTX.stroke();

    //left arrow
    pCTX.beginPath();
    pCTX.moveTo(pX1 + 5, pY - 2.5);
    pCTX.lineTo(pX1, pY);
    pCTX.lineTo(pX1 + 5, pY + 2.5);
    pCTX.stroke();

    //Right arrow
    pCTX.beginPath();
    pCTX.moveTo(pX2 - 5, pY - 2.5);
    pCTX.lineTo(pX2, pY);
    pCTX.lineTo(pX2 - 5, pY + 2.5);
    pCTX.stroke();

    pCTX.fillStyle = '#0000ff';
    pCTX.font = '12px Verdana';
    pCTX.fillText(
      pValue,
      pX1 + (pX2 - pX1) / 2 - pCTX.measureText(pValue).width / 2,
      pY - 3
    );
  }
  drawStiffenerRing(
    ctx: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pNoOfSR: any,
    pSRGrade: any,
    pSRDia: any,
    pSR1Loc: any,
    pSR2Loc: any,
    pSR3Loc: any,
    pSR4Lo: any,
    pSR5Loc: any,
    pMainBarShape: any,
    pPileType: any,
    pExtraSupport: any,
    pExtraSupportDia: any,
    pExtraCRNo: any
  ) {
    //Dimensions
    //Stiffener Ring
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lSRPosY = lTopHeight / 2 + 9;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    //var lBPCRec = grid.getDataItem(pRowNo);
    var lNoOfSR = 0;
    var lSRGrade: any = '';
    var lSRDia: any = '';
    var lSR1Loc: any = 0;
    var lSR2Loc: any = 0;
    var lSR3Loc: any = 0;
    var lSR4Loc: any = 0;
    var lSR5Loc: any = 0;
    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;
    var lSRText = 'Stiffener Ring';
    var lSRTextS = 'SR';

    if (pPileType == 'Micro-Pile') {
      lSRText = 'Centralizer';
      lSRTextS = 'CEN';
    }

    var lSBarTxtV = 15;
    if (pExtraCRNo != null && pExtraCRNo > 0) {
      lSBarTxtV = 25;
    }

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }

    if (pNoOfSR != null) {
      lNoOfSR = parseInt(pNoOfSR);
    }
    if (pSRGrade != null) {
      lSRGrade = pSRGrade;
    }
    if (pSRDia != null) {
      lSRDia = parseInt(pSRDia);
    }
    if (pSR1Loc != null) {
      lSR1Loc = parseInt(pSR1Loc);
    }
    if (pSR2Loc != null) {
      lSR2Loc = parseInt(pSR2Loc);
    }
    if (pSR3Loc != null) {
      lSR3Loc = parseInt(pSR3Loc);
    }
    if (pSR4Lo != null) {
      lSR4Loc = parseInt(pSR4Lo);
    }
    if (pSR5Loc != null) {
      lSR5Loc = parseInt(pSR5Loc);
    }

    if (pExtraSupport == null) {
      pExtraSupport = 'None';
    }

    if (pExtraSupportDia == null) {
      pExtraSupportDia = 0;
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }

    lTopLength = 100;
    lEndLength = 100;

    // canvasPV = document.getElementById(pCanvas);
    // ctx = canvasPV.getContext("2d");

    //draw stiffener ring
    ctx.lineWidth = 3;
    //ctx.strokeStyle = "#804000";
    ctx.strokeStyle = '#ac5000';

    if (lNoOfSR == 1) {
      //draw stiffener ring
      ctx.beginPath();
      ctx.moveTo(
        (lCanvasWidth + lTopLength - lEndLength) / 2,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo((lCanvasWidth + lTopLength - lEndLength) / 2, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        ctx.moveTo(
          (lCanvasWidth + lTopLength - lEndLength) / 2,
          lCanvasHeight / 2
        );
        ctx.arc(
          (lCanvasWidth + lTopLength - lEndLength) / 2,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // Right vertical line
      ctx.beginPath();
      ctx.moveTo((lCanvasWidth + lTopLength - lEndLength) / 2, lTopHeight - 5);
      ctx.lineTo((lCanvasWidth + lTopLength - lEndLength) / 2, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = lSRText;
      ctx.fillText(
        this.lText,
        (lCanvasWidth + lTopLength - lEndLength) / 2 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          (lCanvasWidth + lTopLength - lEndLength) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        (lCanvasWidth + lTopLength - lEndLength) / 2,
        lSRPosY,
        lSR1Loc
      );

      // Last line
      //Horizontal line3
      this.lText = lCageLength - lSR1Loc;
      this.drawHorDim(
        ctx,
        (lCanvasWidth + lTopLength - lEndLength) / 2,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
    } else if (lNoOfSR == 2) {
      var lSR1LocA = lLeftRightMargin + lTopLength + 50;
      if (lSR1Loc < pLapLengthReal) {
        lSR1LocA = lLeftRightMargin + lTopLength - 50;
      }

      var lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
      if (lSR2Loc > lCageLength - pEndLengthReal) {
        lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.beginPath();
      if (
        lSR2Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR2Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lSR1LocA, lTopHeight - 5);
      ctx.lineTo(lSR1LocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRText;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);

      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRText;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(ctx, lSR1LocA, lSRLastLocA, lSRPosY, this.lText);

      // Last line
      //Horizontal line3
      this.lText = lCageLength - lSR2Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
    } else if (lNoOfSR == 3) {
      var lSR1LocA =
        (lSR1Loc * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength -
        (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength +
        lTopLength;
      if (lSR1LocA < 0) {
        lSR1LocA = 50;
      }

      if (lSR1Loc < (pLapLengthReal < 500 ? 500 : pLapLengthReal)) {
        if (lSR1LocA > lLeftRightMargin + lTopLength - 50) {
          lSR1LocA = lLeftRightMargin + lTopLength - 50;
        }
      } else {
        if (lSR1LocA < lLeftRightMargin + lTopLength + 50) {
          lSR1LocA = lLeftRightMargin + lTopLength + 50;
        }
      }

      var lSRLastLocA =
        lCanvasWidth -
        2 * lLeftRightMargin -
        ((lEndLengthReal < 500 ? 500 : lEndLengthReal) *
          (lCanvasWidth - 2 * lLeftRightMargin)) /
          lCageLength +
        lEndLength;

      if (lSRLastLocA > lCanvasWidth - 2 * lLeftRightMargin) {
        lSRLastLocA = lCanvasWidth - 2 * lLeftRightMargin - 50;
      }

      if (
        lSR3Loc >
        lCageLength - (lEndLengthReal < 500 ? 500 : lEndLengthReal)
      ) {
        if (lSRLastLocA < lCanvasWidth - lLeftRightMargin - lEndLength + 50) {
          lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
        }
      } else {
        if (lSRLastLocA > lCanvasWidth - lLeftRightMargin - lEndLength - 50) {
          lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
        }
      }

      var lSRMiddleLocA =
        (lSR2Loc * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength -
        ((lLapLengthReal < 500 ? 500 : lLapLengthReal) *
          (lCanvasWidth - 2 * lLeftRightMargin)) /
          lCageLength +
        lTopLength;

      if (lSR2Loc < (lLapLengthReal < 500 ? 500 : lLapLengthReal)) {
        if (lSRMiddleLocA > lLeftRightMargin + lTopLength - 50) {
          lSRMiddleLocA = lLeftRightMargin + lTopLength - 50;
        }
      } else {
        if (lSRMiddleLocA < lLeftRightMargin + lTopLength + 50) {
          lSRMiddleLocA = lLeftRightMargin + lTopLength + 50;
        }
      }
      if (
        lSR2Loc >
        lCageLength - (lEndLengthReal < 500 ? 500 : lEndLengthReal)
      ) {
        if (lSRMiddleLocA < lCanvasWidth - lLeftRightMargin - lEndLength + 50) {
          lSRMiddleLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
        }
      } else {
        if (lSRMiddleLocA > lCanvasWidth - lLeftRightMargin - lEndLength - 50) {
          lSRMiddleLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
        }
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(lSRMiddleLocA, lCanvasHeight - lTopHeight);
      ctx.lineTo(lSRMiddleLocA, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        ctx.moveTo(lSRMiddleLocA, lCanvasHeight / 2);
        ctx.arc(lSRMiddleLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR3Loc > lCageLength - lEndLengthReal
      ) {
        ctx.moveTo(lSRMiddleLocA, lCanvasHeight / 2);
        ctx.arc(lSRMiddleLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      if (
        lSR3Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR3Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      if (lSR1Loc < pLapLengthReal) {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 10);
        ctx.lineTo(lSR1LocA, lSRPosY - 1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lSRPosY - 6);
        ctx.stroke();
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRText;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);

      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSRMiddleLocA, lTopHeight - 5);
      ctx.lineTo(lSRMiddleLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRText;
      ctx.fillText(
        this.lText,
        lSRMiddleLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRMiddleLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(ctx, lSR1LocA, lSRMiddleLocA, lSRPosY, this.lText);

      //For SR3
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '3rd ' + lSRText;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line3
      this.lText = lSR3Loc - lSR2Loc;
      this.drawHorDim(ctx, lSRMiddleLocA, lSRLastLocA, lSRPosY, this.lText);

      // Last line
      //Horizontal line4
      this.lText = lCageLength - lSR3Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
    } else if (lNoOfSR == 4) {
      var lSR1LocA = lLeftRightMargin + lTopLength + 50;
      if (lSR1Loc < pLapLengthReal) {
        lSR1LocA = lLeftRightMargin + lTopLength - 50;
      }

      var lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
      if (lSR4Loc > lCageLength - pEndLengthReal) {
        lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lCanvasHeight / 2);
        ctx.arc(
          lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR4Loc > lCageLength - lEndLengthReal
      ) {
        ctx.moveTo(
          lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
          lCanvasHeight / 2
        );
        ctx.arc(
          lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      if (
        lSR4Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR4Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      if (lSR1Loc < pLapLengthReal) {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 10);
        ctx.lineTo(lSR1LocA, lSRPosY - 1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lSRPosY - 6);
        ctx.stroke();
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);

      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (lSRLastLocA - lSR1LocA) / 3 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (lSRLastLocA - lSR1LocA) / 3 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
        lSRPosY,
        this.lText
      );

      //For SR3
      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '3rd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR4Loc > lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (2 * (lSRLastLocA - lSR1LocA)) / 3 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line3
      this.lText = lSR3Loc - lSR2Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lSRPosY,
        this.lText
      );

      //For SR4
      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '4th ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR4Loc <= lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line4
      this.lText = lSR4Loc - lSR3Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lSRLastLocA,
        lSRPosY,
        this.lText
      );

      // Last line
      //Horizontal line5
      this.lText = lCageLength - lSR4Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
    } else if (lNoOfSR == 5) {
      var lSR1LocA = lLeftRightMargin + lTopLength + 50;
      if (lSR1Loc < pLapLengthReal) {
        lSR1LocA = lLeftRightMargin + lTopLength - 50;
      }

      var lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
      if (lSR5Loc > lCageLength - pEndLengthReal) {
        lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lCanvasHeight / 2);
        ctx.arc(
          lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR5Loc > lCageLength - lEndLengthReal
      ) {
        ctx.moveTo(
          lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
          lCanvasHeight / 2
        );
        ctx.arc(
          lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      if (
        lSR5Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR5Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      if (lSR1Loc < pLapLengthReal) {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 10);
        ctx.lineTo(lSR1LocA, lSRPosY - 1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lSRPosY - 6);
        ctx.stroke();
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);

      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (lSRLastLocA - lSR1LocA) / 4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (lSRLastLocA - lSR1LocA) / 4 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
        lSRPosY,
        this.lText
      );

      //For SR3
      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '3rd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (2 * (lSRLastLocA - lSR1LocA)) / 4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      //Horizontal line3
      this.lText = lSR3Loc - lSR2Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,
        lSRPosY,
        this.lText
      );

      //For SR4
      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '4th ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (3 * (lSRLastLocA - lSR1LocA)) / 4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR5Loc > lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (3 * (lSRLastLocA - lSR1LocA)) / 4 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line4
      this.lText = lSR4Loc - lSR3Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,
        lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
        lSRPosY,
        this.lText
      );

      //For SR5
      // vertical line5
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '5th ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR5Loc <= lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line5
      this.lText = lSR5Loc - lSR4Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
        lSRLastLocA,
        lSRPosY,
        this.lText
      );

      // Last line
      //Horizontal line6
      this.lText = lCageLength - lSR5Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
    }
    // end of Stiffener Ring
  }

  //Elevation View
  drawElevView(
    ctx: any,
    pCageLength: any,
    pLapLength: any,
    pEndLength: any,
    pSLType: any,
    pSLGrade: any,
    pSLDia: any,
    pSLSpacing: any,
    pCouplerTop: any,
    pCouplerEnd: any,
    pMainBarShape: any,
    pSL1Length: any,
    pSL2Length: any,
    pSL3Length: any,
    pSL1Dia: any,
    pSL2Dia: any,
    pSL3Dia: any,
    p2LayerLength: any,
    p2LayerLoc: any,
    pPileType: any,
    pStartRings: any,
    pEndRings: any,
    pCRTopNo: any,
    pCTEndNo: any
  ) {
    console.log('drawElevView=>', pPileType);
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lMinTop = 700;
    var lMinEnd = 500;
    var lSRTop = 0;
    var lSREnd = 0;
    var lSLPosY = lCanvasHeight - 10;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;
    lMinTop = this.gMinTop;
    lMinEnd = this.gMinEnd;

    if (pPileType == 'Micro-Pile') {
      lMinTop = 100;
      lMinEnd = 100;
    }

    var lLapLengthReal = pLapLength;
    if (lLapLengthReal < lMinTop) {
      lLapLengthReal = lMinTop;
      lSRTop = Math.floor(
        (lLapLengthReal - pLapLength) /
          parseInt(pSLSpacing.toString().split(',')[0] )
      );
    }
    var lEndLengthReal = pEndLength;
    if (lEndLengthReal < lMinEnd) {
      lEndLengthReal = lMinEnd;
      lSREnd = Math.floor(
        (lEndLengthReal - pEndLength) /
          parseInt(pSLSpacing.toString().split(',')[pSLSpacing.toString().split(',').length - 1])
      );
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / pCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / pCageLength; //150;
    //if (lTopLength < 100) {
    lTopLength = 100;
    //}
    //if (lEndLength < 100) {
    lEndLength = 100;
    //}
    var lCrankHeight = 5;
    var lCrankWidth = 10;

    lCrankHeight = this.gCrankHeight;
    lCrankWidth = this.gCrankWidth;

    var lSLSpacing =
      (lCanvasWidth -
        lTopLength -
        lEndLength -
        lLeftRightMargin -
        lLeftRightMargin +
        lCrankWidth +
        lCrankWidth) /
      20;

    var lSL1Length = parseInt(pSL1Length);
    var lSL2Length = parseInt(pSL2Length);
    var lSL3Length = parseInt(pSL3Length);

    var lChangePoint1 = 0;
    var lChangePoint2 = 0;

    // Clear Elevation View
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.rect(0, 0, lCanvasWidth, lCanvasHeight);
    ctx.fill();

    //Top/End
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Verdana';
    this.lText = 'TOP';
    ctx.fillText(
      this.lText,
      -lCanvasHeight / 2 - ctx.measureText(this.lText).width / 2,
      this.gLeftRightMargin
    );

    this.lText = 'END';
    ctx.fillText(
      this.lText,
      -lCanvasHeight / 2 - ctx.measureText(this.lText).width / 2,
      lCanvasWidth - this.gLeftRightMargin + 12
    );
    ctx.restore();

    // Main Bar line
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0000B0';
    if (pMainBarShape == 'Straight') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 14);
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(ctx, lLeftRightMargin, lTopHeight, 21, 'Top');
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 21);
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21,
          'End'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21,
          'End'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      }
    } else if (pMainBarShape == 'Crank-Top' || pMainBarShape == 'Crank') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight - lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lCanvasHeight - lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 14);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 21);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21,
          'End'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21,
          'End'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      }
    } else if (pMainBarShape == 'Crank-End') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight);
      ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin, lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 14);
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(ctx, lLeftRightMargin, lTopHeight, 21, 'Top');
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21
        );
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 21);
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }
    } else if (pMainBarShape == 'Crank-Both') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lTopHeight);
      ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin, lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight - lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lCanvasHeight - lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 14);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 21);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 14);
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(ctx, lLeftRightMargin, lTopHeight, 21, 'Top');
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 21);
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21,
          'End'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21,
          'End'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      }
    }

    //Spiral Link
    if (pSLType == '1 Spacing') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing,
          lCanvasHeight - lTopHeight + 3
        );
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == '2 Spacing') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      var lChangePoint = 0;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == '3 Spacing') {
      var lCentralPoint1 =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        3;
      var lCentralPoint2 =
        (2 *
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth)) /
        3;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      this.lSpacingReal3 = parseInt(lSpaceRealArr[2]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      var lSLSpacing3 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#800080';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin 1 Spacing') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing,
          lCanvasHeight - lTopHeight + 3
        );
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //Second Spiral Link
      ctx.beginPath();
      //ctx.moveTo(lLeftRightMargin + lTopLength - lCrankWidth + 2, lTopHeight + lSLTopCrank - 3);
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );

      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing + 2,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing + 2,
          lCanvasHeight - lTopHeight + 3
        );
      }

      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin 2 Spacing') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //Second Spiral Link
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin 3 Spacing') {
      var lCentralPoint1 =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        3;
      var lCentralPoint2 =
        (2 *
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth)) /
        3;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      this.lSpacingReal3 = parseInt(lSpaceRealArr[2]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      var lSLSpacing3 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#800080';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //second spiral link
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#800080';
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );

      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              i * lSLSpacing2 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin +
            lTopLength +
            10 * lSLSpacing1 +
            15 * lSLSpacing2 +
            2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              i * lSLSpacing3 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              i * lSLSpacing2 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin +
            lTopLength +
            15 * lSLSpacing1 +
            9 * lSLSpacing2 +
            2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              i * lSLSpacing3 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //for Crank end
      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Single-Twin') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      var lChangePoint = 0;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //Second Spiral Link
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin-Single') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      var lChangePoint = 0;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }

      //Second Spiral Link
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
      }
      //ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2, lTopHeight + lSLEndCrank - 3);
      //ctx.stroke();

      //    ctx.beginPath();
      //    ctx.moveTo(lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth, lCanvasHeight - lTopHeight - lSLEndCrank + 3);
      //    ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth, lTopHeight + lSLEndCrank - 3);
      //    ctx.stroke();
      //    ctx.beginPath();
      //    ctx.moveTo(lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth, lCanvasHeight - lTopHeight - lSLEndCrank + 3);
      //    ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth, lTopHeight + lSLEndCrank - 3);
      //    ctx.stroke();
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lTopHeight + lSLTopCrank - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 2,
        lTopHeight + lSLTopCrank - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lTopHeight + lSLTopCrank - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );

      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing,
          lCanvasHeight - lTopHeight + 3
        );
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
    }

    //Dimensions
    //1.Spiral Links
    if (pSLType == '1 Spacing' || pSLType == 'Twin 1 Spacing') {
      //Dimension
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      // vertical line2
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pLapLength >= lMinTop && pCRTopNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'Lap Length';
        ctx.fillText(
          this.lText,
          lLeftRightMargin +
            (lTopLength - lCrankWidth - 4) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line1
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lSLPosY,
        lLapLengthReal
      );

      // vertical line3
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      if (pSLType.indexOf('Twin') >= 0) {
        this.lText = 'Spiral Link - 2' + pSLGrade + pSLDia + ' - ' + pSLSpacing;
      } else {
        this.lText = 'Spiral Link - ' + pSLGrade + pSLDia + ' - ' + pSLSpacing;
      }
      ctx.fillText(
        this.lText,
        (lCanvasWidth + lTopLength - lEndLength) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line2
      this.lText =
        parseInt(pCageLength) -
        parseInt(lLapLengthReal) -
        parseInt(lEndLengthReal);
      this.drawHorDim(
        ctx,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lSLPosY,
        this.lText
      );

      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pEndLength >= lMinEnd && pCTEndNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'End Length';
        ctx.fillText(
          this.lText,
          lCanvasWidth -
            lLeftRightMargin -
            (lEndLength - 2 - lCrankWidth) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line3
      this.drawHorDim(
        ctx,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasWidth - lLeftRightMargin,
        lSLPosY,
        lEndLengthReal
      );
    } else if (
      pSLType == '2 Spacing' ||
      pSLType == 'Twin 2 Spacing' ||
      pSLType == 'Single-Twin' ||
      pSLType == 'Twin-Single'
    ) {
      //Dimension
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      // vertical line2
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pLapLength >= lMinTop && pCRTopNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'Lap Length';
        ctx.fillText(
          this.lText,
          lLeftRightMargin +
            (lTopLength - lCrankWidth - 4) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line1
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lSLPosY,
        lLapLengthReal
      );

      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lChangePoint1, lCanvasHeight - 3);
      ctx.lineTo(lChangePoint1, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '1st Spiral Link - ' + pSLGrade + pSL1Dia + ' - ' + this.lSpacingReal1;
      if (pSLType == 'Twin 2 Spacing' || pSLType == 'Twin-Single') {
        this.lText =
          '1st Spiral Link - 2' +
          pSLGrade +
          pSL1Dia +
          ' - ' +
          this.lSpacingReal1;
      }
      ctx.fillText(
        this.lText,
        (lLeftRightMargin + lTopLength - lCrankWidth - 4 + lChangePoint1) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line2
      this.lText = lSL1Length;
      this.drawHorDim(
        ctx,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lChangePoint1,
        lSLPosY,
        this.lText
      );

      // vertical line4
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '2nd Spiral Link - ' + pSLGrade + pSL2Dia + ' - ' + this.lSpacingReal2;
      if (pSLType == 'Twin 2 Spacing' || pSLType == 'Single-Twin') {
        this.lText =
          '2nd Spiral Link - 2' +
          pSLGrade +
          pSL2Dia +
          ' - ' +
          this.lSpacingReal2;
      }
      ctx.fillText(
        this.lText,
        (lChangePoint1 +
          lCanvasWidth -
          lEndLength -
          lLeftRightMargin +
          2 +
          lCrankWidth) /
          2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line3
      this.lText = lSL2Length;
      this.drawHorDim(
        ctx,
        lChangePoint1,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lSLPosY,
        this.lText
      );

      // vertical line5
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pEndLength >= lMinEnd && pCTEndNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'End Length';
        ctx.fillText(
          this.lText,
          lCanvasWidth -
            lLeftRightMargin -
            (lEndLength - 2 - lCrankWidth) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line4
      this.drawHorDim(
        ctx,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasWidth - lLeftRightMargin,
        lSLPosY,
        lEndLengthReal
      );
    } else if (pSLType == '3 Spacing' || pSLType == 'Twin 3 Spacing') {
      //Dimension
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      // vertical line2
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pLapLength >= lMinTop && pCRTopNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'Lap Length';
        ctx.fillText(
          this.lText,
          lLeftRightMargin +
            (lTopLength - lCrankWidth - 4) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line1
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lSLPosY,
        lLapLengthReal
      );

      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lChangePoint1, lCanvasHeight - 3);
      ctx.lineTo(lChangePoint1, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '1st Spiral Link - ' + pSLGrade + pSL1Dia + ' - ' + this.lSpacingReal1;
      ctx.fillText(
        this.lText,
        (lLeftRightMargin + lTopLength - lCrankWidth - 4 + lChangePoint1) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line2
      this.lText = lSL1Length;
      this.drawHorDim(
        ctx,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lChangePoint1,
        lSLPosY,
        this.lText
      );

      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lChangePoint2, lCanvasHeight - 3);
      ctx.lineTo(lChangePoint2, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '2nd Spiral Link - ' + pSLGrade + pSL2Dia + ' - ' + this.lSpacingReal2;
      ctx.fillText(
        this.lText,
        lChangePoint1 +
          (lChangePoint2 - lChangePoint1) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line3
      this.lText = lSL2Length;
      this.drawHorDim(ctx, lChangePoint1, lChangePoint2, lSLPosY, this.lText);

      // vertical line5
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '3rd Spiral Link - ' + pSLGrade + pSL3Dia + ' - ' + this.lSpacingReal3;
      ctx.fillText(
        this.lText,
        (lChangePoint2 +
          lCanvasWidth -
          lEndLength -
          lLeftRightMargin +
          2 +
          lCrankWidth) /
          2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line4
      this.lText = lSL3Length;
      this.drawHorDim(
        ctx,
        lChangePoint2,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lSLPosY,
        this.lText
      );

      // vertical line6
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pEndLength >= lMinEnd && pCTEndNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'End Length';
        ctx.fillText(
          this.lText,
          lCanvasWidth -
            lLeftRightMargin -
            (lEndLength - 2 - lCrankWidth) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line5
      this.drawHorDim(
        ctx,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasWidth - lLeftRightMargin,
        lSLPosY,
        lEndLengthReal
      );
    }
    //end if Spiral Link dimension

    //Dimensions
    //2.Cage Length
    // Added p2LayerLength and p2LayerLoc in dimensions
    if (p2LayerLength != pCageLength && p2LayerLength > 0) {
      //draw second layer dimesions
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // Left vertical line
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight - 5);
      ctx.lineTo(lLeftRightMargin, 3);
      ctx.stroke();

      //left arrow
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin + 5, 10 - 2.5);
      ctx.lineTo(lLeftRightMargin, 10);
      ctx.lineTo(lLeftRightMargin + 5, 10 + 2.5);
      ctx.stroke();

      if (p2LayerLoc == 0) {
        var lMiddlePos =
          (p2LayerLength / pCageLength) * lCanvasWidth - lLeftRightMargin;

        if (pCageLength - p2LayerLength - p2LayerLoc == pEndLength) {
          lMiddlePos =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        }
        if (pCageLength - p2LayerLength - p2LayerLoc == lMinEnd) {
          lMiddlePos =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        } else if (
          (pCageLength - p2LayerLength - p2LayerLoc < pEndLength &&
            pEndLength >= lMinEnd) ||
          (pCageLength - p2LayerLength - p2LayerLoc < lMinEnd &&
            lMinEnd >= pEndLength)
        ) {
          lMiddlePos =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth + 10;
        } else {
          if (
            lMiddlePos >
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth - 50
          ) {
            lMiddlePos =
              lCanvasWidth -
              lEndLength -
              lLeftRightMargin +
              2 +
              lCrankWidth -
              50;
          }
        }

        //1st Left Hor line
        ctx.beginPath();
        ctx.moveTo(lLeftRightMargin, 10);
        ctx.lineTo(lMiddlePos / 2 - 100, 10);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        var lCLText = '2nd Layer Bar Length ';
        var lVar1 = ctx.measureText(lCLText).width;
        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l2CageLength = p2LayerLength + ' mm';
        var lVar2 = ctx.measureText(l2CageLength).width;

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        ctx.fillText(lCLText, lMiddlePos / 2 - (lVar2 + lVar1) / 2, 15);

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l2CageLength,
          lMiddlePos / 2 - (lVar1 + lVar2) / 2 + lVar1,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos, 3);
        ctx.stroke();

        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos / 2 + 100, 10);
        ctx.stroke();

        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos - 5, 10 + 2.5);
        ctx.stroke();

        // Right side
        // Last Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 - 30,
          10
        );
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos + 5, 10 + 2.5);
        ctx.stroke();

        //Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 + 30,
          10
        );
        ctx.stroke();

        //Right arrow
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
        ctx.stroke();

        // Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = pCageLength - p2LayerLength + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lMiddlePos +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 -
            lVar2 / 2,
          15
        );
      } else if (
        parseInt(p2LayerLength) + parseInt(p2LayerLoc) ==
        parseInt(pCageLength)
      ) {
        // Right alignment
        var lMiddlePos =
          (p2LayerLoc / pCageLength) * lCanvasWidth - lLeftRightMargin;
        if (pCageLength - p2LayerLength == pLapLength) {
          lMiddlePos = lLeftRightMargin + lTopLength - lCrankWidth - 4;
        } else if (pCageLength - p2LayerLength < pLapLength) {
          lMiddlePos = lLeftRightMargin + lTopLength - lCrankWidth - 4 - 10;
        } else {
          if (lMiddlePos < lLeftRightMargin + lTopLength + 100) {
            lMiddlePos = lLeftRightMargin + lTopLength + 100;
          }
        }

        //1st Left Hor line
        ctx.beginPath();
        ctx.moveTo(lLeftRightMargin, 10);
        ctx.lineTo(lLeftRightMargin + lMiddlePos / 2 - 20, 10);
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = p2LayerLoc + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lLeftRightMargin + lMiddlePos / 2 - lVar2 / 2,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos, 3);
        ctx.stroke();

        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(lLeftRightMargin + lMiddlePos / 2 + 20, 10);
        ctx.stroke();

        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos - 5, 10 + 2.5);
        ctx.stroke();

        // Right side
        // Last Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 - 100,
          10
        );
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos + 5, 10 + 2.5);
        ctx.stroke();

        //Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 + 100,
          10
        );
        ctx.stroke();

        //Right arrow
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
        ctx.stroke();

        // Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        var lCLText = '2nd Layer Bar Length ';
        var lVar1 = ctx.measureText(lCLText).width;
        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l2CageLength = p2LayerLength + ' mm';
        var lVar2 = ctx.measureText(l2CageLength).width;

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        ctx.fillText(
          lCLText,
          lMiddlePos +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 -
            (lVar2 + lVar1) / 2,
          15
        );

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l2CageLength,
          lMiddlePos +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 -
            (lVar1 + lVar2) / 2 +
            lVar1,
          15
        );
      } else {
        // Right alignment
        var lMiddlePos1 =
          (p2LayerLoc / pCageLength) * lCanvasWidth - lLeftRightMargin;
        if (p2LayerLoc == pLapLength) {
          lMiddlePos1 = lLeftRightMargin + lTopLength - lCrankWidth - 4;
        } else if (p2LayerLoc < pLapLength) {
          lMiddlePos1 = lLeftRightMargin + lTopLength - lCrankWidth - 4 - 10;
        } else {
          if (lMiddlePos1 < lLeftRightMargin + lTopLength + 100) {
            lMiddlePos1 = lLeftRightMargin + lTopLength + 100;
          }
        }

        var lMiddlePos2 =
          ((p2LayerLoc + p2LayerLength) / pCageLength) * lCanvasWidth -
          lLeftRightMargin;
        if (pCageLength - p2LayerLength - p2LayerLoc == pEndLength) {
          lMiddlePos2 =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        }
        if (pCageLength - p2LayerLength - p2LayerLoc == lMinEnd) {
          lMiddlePos2 =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        } else if (
          (pCageLength - p2LayerLength - p2LayerLoc < pEndLength &&
            pEndLength >= lMinEnd) ||
          (pCageLength - p2LayerLength - p2LayerLoc < lMinEnd &&
            lMinEnd >= pEndLength)
        ) {
          lMiddlePos2 =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth + 10;
        } else {
          if (
            lMiddlePos2 >
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth - 50
          ) {
            lMiddlePos2 =
              lCanvasWidth -
              lEndLength -
              lLeftRightMargin +
              2 +
              lCrankWidth -
              50;
          }
        }

        //1st Left Hor line
        ctx.beginPath();
        ctx.moveTo(lLeftRightMargin, 10);
        ctx.lineTo(
          lLeftRightMargin + (lMiddlePos1 - lLeftRightMargin) / 2 - 20,
          10
        );
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = p2LayerLoc + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lLeftRightMargin + (lMiddlePos1 - lLeftRightMargin) / 2 - lVar2 / 2,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos1, 3);
        ctx.stroke();

        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1, 10);
        ctx.lineTo(
          lLeftRightMargin + (lMiddlePos1 - lLeftRightMargin) / 2 + 20,
          10
        );
        ctx.stroke();

        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1 - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos1, 10);
        ctx.lineTo(lMiddlePos1 - 5, 10 + 2.5);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1, 10);
        ctx.lineTo(lMiddlePos1 + (lMiddlePos2 - lMiddlePos1) / 2 - 100, 10);
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1 + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos1, 10);
        ctx.lineTo(lMiddlePos1 + 5, 10 + 2.5);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        var lCLText = '2nd Layer Bar Length ';
        var lVar1 = ctx.measureText(lCLText).width;
        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l2CageLength = p2LayerLength + ' mm';
        var lVar2 = ctx.measureText(l2CageLength).width;

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        ctx.fillText(
          lCLText,
          lMiddlePos1 + (lMiddlePos2 - lMiddlePos1) / 2 - (lVar2 + lVar1) / 2,
          15
        );

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l2CageLength,
          lMiddlePos1 +
            (lMiddlePos2 - lMiddlePos1) / 2 -
            (lVar1 + lVar2) / 2 +
            lVar1,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos2, 3);
        ctx.stroke();

        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2, 10);
        ctx.lineTo(lMiddlePos1 + (lMiddlePos2 - lMiddlePos1) / 2 + 100, 10);
        ctx.stroke();

        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2 - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos2, 10);
        ctx.lineTo(lMiddlePos2 - 5, 10 + 2.5);
        ctx.stroke();

        // Right side
        // Last Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2, 10);
        ctx.lineTo(
          lMiddlePos2 +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos2) / 2 -
            30,
          10
        );
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2 + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos2, 10);
        ctx.lineTo(lMiddlePos2 + 5, 10 + 2.5);
        ctx.stroke();

        //Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(
          lMiddlePos2 +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos2) / 2 +
            30,
          10
        );
        ctx.stroke();

        //Right arrow
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
        ctx.stroke();

        // Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = pCageLength - p2LayerLength - p2LayerLoc + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lMiddlePos2 +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos2) / 2 -
            lVar2 / 2,
          15
        );
      }
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // Left vertical line
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight - 5);
      ctx.lineTo(lLeftRightMargin, 3);
      ctx.stroke();

      // Right vertical line
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
      ctx.stroke();

      //Left Hor line
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, 10);
      ctx.lineTo(lCanvasWidth / 2 - 100, 10);
      ctx.stroke();

      //left arrow
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin + 5, 10 - 2.5);
      ctx.lineTo(lLeftRightMargin, 10);
      ctx.lineTo(lLeftRightMargin + 5, 10 + 2.5);
      ctx.stroke();

      //Right Hor line
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
      ctx.lineTo(lCanvasWidth / 2 + 100, 10);
      ctx.stroke();

      //Right arrow
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      var lCLText = 'Cage Length ';
      var lVar1 = ctx.measureText(lCLText).width;
      ctx.fillStyle = '#0000ff';
      ctx.font = '12px Verdana';
      var lCageLength = pCageLength + ' mm';
      var lVar2 = ctx.measureText(lCageLength).width;

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText(lCLText, lCanvasWidth / 2 - (lVar2 + lVar1) / 2, 15);

      ctx.fillStyle = '#0000ff';
      ctx.font = '12px Verdana';
      ctx.fillText(
        lCageLength,
        lCanvasWidth / 2 - (lVar1 + lVar2) / 2 + lVar1,
        15
      );
    }

    //Top Coupler text
    this.lText = '';
    if (pCouplerTop == 'Nsplice-Standard-Coupler') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerTop == 'Esplice-Standard-Coupler') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerTop == 'Nsplice-Standard-Stud') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerTop == 'Esplice-Standard-Stud') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
      this.lText = 'Esplice Extended';
    } else if (pCouplerTop == 'Nsplice-Extended-Stud') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerTop == 'Esplice-Extended-Stud') {
      this.lText = 'Esplice Extended';
    }

    if (this.lText != '') {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText(this.lText, lLeftRightMargin - 6, lTopHeight + 20);
    }

    //End Coupler text
    this.lText = '';
    if (pCouplerEnd == 'Nsplice-Standard-Coupler') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerEnd == 'Esplice-Standard-Coupler') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerEnd == 'Nsplice-Standard-Stud') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerEnd == 'Esplice-Standard-Stud') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
      this.lText = 'Esplice Extended';
    } else if (pCouplerEnd == 'Nsplice-Extended-Stud') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerEnd == 'Esplice-Extended-Stud') {
      this.lText = 'Esplice Extended';
    }

    if (this.lText != '') {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText(
        this.lText,
        lCanvasWidth - lLeftRightMargin - 80,
        lTopHeight + 20
      );
    }

    //end of cage Length
    //var lRowNo = grid.getActiveCell().row;

    //drawStiffenerRing(lRowNo);

    //drawCircularRing(lRowNo);

    //drawAdditionalRings(lRowNo);

    //drawCrankHeight(lRowNo);
  }
  drawCircularRing(
    ctx: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pCRNo_Top: any,
    pCRNo_End: any,
    pCRSpacing_Top: any,
    pCRSpacing_End: any,
    pMainBarShape: any,
    pSLType: any,
    pCRRemarks: any,
    pExtraCRNo: any,
    pExtraCRLoc: any,
    pExtraCRDia: any,
    pStartRings: any,
    pEndRings: any,
    pCRPosn_Top:any,
    pCRPosn_End:any,
    pCRTopRemarks:any,
    cr_ring_type:any,
    cr_bundle_side:any
  ) {
    //Dimensions
    //Circular Ring
    var lFirstWire = 40;
    var lMinTop = 700;
    var lMinEnd = 500;
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lCrankHeight = 5;
    var lCrankWidth = 10;

    var lSRPosY = lCanvasHeight - lTopHeight / 2;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;
    lMinTop = this.gMinTop;
    lMinEnd = this.gMinEnd;
    lCrankHeight = this.gCrankHeight;
    lCrankWidth = this.gCrankWidth;

    //var lBPCRec = grid.getDataItem(pRowNo);
    var lCRNo_Top = 0;
    var lCRSpacing_Top = 0;
    var lCRNo_End = 0;
    var lCRSpacing_End = 0;
    var lMainBarShape = '';

    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;
    var lSLType = '';

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }
    if (pCRNo_Top != null) {
      lCRNo_Top = parseInt(pCRNo_Top);
    }

    if (pCRNo_End != null) {
      lCRNo_End = parseInt(pCRNo_End);
    }

    if (pCRSpacing_Top != null) {
      lCRSpacing_Top = pCRSpacing_Top;
    }
    if (pCRSpacing_End != null) {
      lCRSpacing_End = parseInt(pCRSpacing_End);
    }

    if (pMainBarShape != null) {
      lMainBarShape = pMainBarShape;
    }

    if (pSLType != null) {
      lSLType = pSLType;
    }
    if (pCRPosn_Top == null) {
      pCRPosn_Top = 0;
    }
    if (pCRPosn_End == null) {
        pCRPosn_End = 0;
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }
    if (lLapLengthReal < lMinTop || (pCRPosn_Top > 0 && lLapLengthReal > pCRPosn_Top)  && lCRNo_Top > 0) {
      //draw Circular ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#80ffff';

      var lCrank = 0;
      if (
        lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank' ||
        lMainBarShape == 'Crank-Both'
      ) {
        lCrank = lCrankHeight;
      }

      for (let i = 0; i < lCRNo_Top; i++) {
        if (cr_ring_type == 'bundle' && cr_bundle_side == 'top') {
          ctx.beginPath();
          ctx.setLineDash([
            (lTopHeight + lCrank - 3) / 8, // Dash length (1/8th of line height)
            (lTopHeight + lCrank - 3) / 8, // Gap length (1/8th of line height)
          ]);
          ctx.moveTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) /
                (lCRNo_Top * 2.5),
            lCanvasHeight - lTopHeight - lCrank + 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) /
                (lCRNo_Top * 2.5),
            lTopHeight + lCrank - 3
          );

          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          //draw Curcular ring
          ctx.beginPath();
          ctx.moveTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top,
            lCanvasHeight - lTopHeight - lCrank + 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top,
            lTopHeight + lCrank - 3
          );
          ctx.stroke();
        }

        if (lSLType.substring(0, 4) == 'Twin') {
          //Twin Circular ring
          ctx.beginPath();
          ctx.moveTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top +
              2,
            lCanvasHeight - lTopHeight - lCrank + 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top +
              2,
            lTopHeight + lCrank - 3
          );
          ctx.stroke();
        }
      }

      // Left vertical line
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin + lFirstWire, lSRPosY + 5);
      ctx.lineTo(lLeftRightMargin + lFirstWire, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();
      if (lLapLengthReal >= lMinTop && lLapLengthReal > pCRPosn_Top && pCRPosn_Top > 0) {
        //Horizontal line
        this.drawHorDim(
          ctx,
          lLeftRightMargin,
          lLeftRightMargin + lFirstWire,
          lSRPosY,
          pCRPosn_Top
        );

        //Horizontal line
        this.lText = lMinTop - pCRPosn_Top;
        this.drawHorDim(
          ctx,
          lLeftRightMargin + lFirstWire,
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lSRPosY,
          this.lText
        );
      }
      else {
          //Horizontal line
          this.drawHorDim(ctx, lLeftRightMargin, lLeftRightMargin + lFirstWire, lSRPosY, lLapLengthReal);
          //Horizontal line
          var lText = lMinTop - lLapLengthReal;
          this.drawHorDim(ctx, lLeftRightMargin + lFirstWire, lLeftRightMargin + lTopLength - lCrankWidth - 4, lSRPosY, lText);
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '';
      if (lSLType.substring(0, 4) == 'Twin') {
        this.lText = lCRNo_Top + 'x2 CR';
      } else {
        this.lText = lCRNo_Top + ' CR';
      }
      ctx.fillText(
        this.lText,
        lLeftRightMargin +
          (lFirstWire + lTopLength - lCrankWidth - 4) / 2 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 16
      );
    }

    if (lEndLengthReal < lMinEnd || (pCRPosn_End > 0 && lEndLengthReal > pCRPosn_End) && lCRNo_End > 0) {
      //draw Circular ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#80ffff';
      var lCrank = 0;
      if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
        lCrank = lCrankHeight;
      }

      for (let i = 0; i < lCRNo_End; i++) {
        //draw stiffener ring
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth -
            lLeftRightMargin -
            lFirstWire -
            (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End,
          lCanvasHeight - lTopHeight - lCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth -
            lLeftRightMargin -
            lFirstWire -
            (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End,
          lTopHeight + lCrank - 3
        );
        ctx.stroke();

        if (
          (lSLType.substring(0, 4) == 'Twin' && lSLType != 'Twin-Single') ||
          lSLType == 'Single-Twin'
        ) {
          //Twin Circular ring
          ctx.beginPath();
          ctx.moveTo(
            lCanvasWidth -
              lLeftRightMargin -
              lFirstWire -
              (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End +
              2,
            lCanvasHeight - lTopHeight - lCrank + 3
          );
          ctx.lineTo(
            lCanvasWidth -
              lLeftRightMargin -
              lFirstWire -
              (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End +
              2,
            lTopHeight + lCrank - 3
          );
          ctx.stroke();
        }
      }

      // Left vertical line
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin - lFirstWire, lSRPosY + 5);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin - lFirstWire,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();
      if (lEndLengthReal >= lMinEnd && lEndLengthReal > pCRPosn_End && pCRPosn_End > 0) {
        //Horizontal line
        this.drawHorDim(
          ctx,
          lCanvasWidth - lLeftRightMargin - lFirstWire,
          lCanvasWidth - lLeftRightMargin,
          lSRPosY,
          pCRPosn_End
        );

        //Horizontal line
        this.lText = lMinEnd - pCRPosn_End;
        this.drawHorDim(
          ctx,
          lCanvasWidth - lLeftRightMargin - lEndLength + lCrankWidth + 2,
          lCanvasWidth - lLeftRightMargin - lFirstWire,
          lSRPosY,
          this.lText
        );
      }else {
          //Horizontal line
          this.drawHorDim(ctx, lCanvasWidth - lLeftRightMargin - lFirstWire, lCanvasWidth - lLeftRightMargin, lSRPosY, lEndLengthReal);
          //Horizontal line
          var lText = lMinEnd - lEndLengthReal;
          this.drawHorDim(ctx, lCanvasWidth - lLeftRightMargin - lEndLength + lCrankWidth + 2, lCanvasWidth - lLeftRightMargin - lFirstWire, lSRPosY, lText);
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      if (
        (lSLType.substring(0, 4) == 'Twin' && lSLType != 'Twin-Single') ||
        lSLType == 'Single-Twin'
      ) {
        this.lText = lCRNo_End + 'x2 CR';
      } else {
        this.lText = lCRNo_End + ' CR';
      }
      ctx.fillText(
        this.lText,
        lCanvasWidth -
          lLeftRightMargin +
          (lCrankWidth - lEndLength + 2 - lFirstWire) / 2 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 16
      );

      //Drawing CR Remakrs
      if (pCRRemarks != null && pCRRemarks.trim().length > 0) {
        ctx.fillStyle = '#FF0000';
        ctx.font = '15px Verdana';
        this.lText = pCRRemarks;
        ctx.fillText(
          this.lText,
          lCanvasWidth +
            (lCrankWidth - lEndLength + 2 - lFirstWire) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight / 2
        );
      }
    }
    // end of Circular Ring

    //draw Extra Circular Rings
    if (pExtraCRNo > 0 && pExtraCRLoc > 0 && pExtraCRDia > 0) {
      var lCrank = 0;
      if (
        lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank' ||
        lMainBarShape == 'Crank-Both'
      ) {
        lCrank = lCrankHeight;
      }

      var lECRLoc =
        (pExtraCRLoc * (lCanvasWidth - 2 * lLeftRightMargin)) / pCageLength;
      if (
        pExtraCRLoc <= pLapLengthReal ||
        (lLapLengthReal < lMinTop && pExtraCRLoc <= lMinTop)
      ) {
        lECRLoc = 95;
      } else {
        lCrank = 0;
        if (lECRLoc < 122) {
          lECRLoc = 122;
        }
      }
      if (
        pExtraCRLoc >= pCageLength - lEndLengthReal ||
        (lLapLengthReal < lMinEnd && pExtraCRLoc >= pCageLength - lMinEnd)
      ) {
        if (
          lECRLoc <
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 10
        ) {
          lECRLoc =
            lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 10;
        }
      }

      if (lLapLengthReal < lMinTop) {
        if (pStartRings == 0 && pExtraCRLoc == lMinTop) {
          lECRLoc =
            lLeftRightMargin + 100 - lCrankWidth - (pExtraCRNo - 1) * 1.5;
        }
      } else {
        if (pStartRings == 0 && pExtraCRLoc == pLapLengthReal) {
          lECRLoc =
            lLeftRightMargin +
            lTopLength -
            lCrankWidth -
            (pExtraCRNo - 1) * 1.5;
        }
      }

      if (lEndLengthReal < lMinEnd) {
        if (pEndRings == 0 && pExtraCRLoc == pCageLength - lMinEnd) {
          lECRLoc = lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth;
        } else {
          if (
            pExtraCRLoc >= pCageLength - lMinEnd &&
            lECRLoc <= lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth + 10
          ) {
            lECRLoc = lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth + 10;
          }
          if (
            pExtraCRLoc < pCageLength - lMinEnd &&
            lECRLoc > lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth - 10
          ) {
            lECRLoc = lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth - 10;
          }
          if (
            pExtraCRLoc < pCageLength - lEndLengthReal &&
            lECRLoc > lCanvasWidth - lLeftRightMargin - lFirstWire - 12
          ) {
            lECRLoc = lCanvasWidth - lLeftRightMargin - lFirstWire - 12;
          }
        }
      } else {
        if (pEndRings == 0 && pExtraCRLoc == pCageLength - lEndLengthReal) {
          lECRLoc = lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth;
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#00b2cc';
      ctx.beginPath();
      for (let i = 0; i < pExtraCRNo; i++) {
        ctx.moveTo(lECRLoc + i * 1.5, lCanvasHeight - lTopHeight - lCrank + 3);
        ctx.lineTo(lECRLoc + i * 1.5, lTopHeight + lCrank - 3);
      }
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        'Extra CR ' + pExtraCRNo + 'H' + pExtraCRDia + '@@' + pExtraCRLoc;
      ctx.fillText(
        this.lText,
        lECRLoc - ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 14
      );

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight - 5);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight - 25);
      ctx.stroke();

      //Horizontal line
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lECRLoc,
        lCanvasHeight - lTopHeight - 18,
        pExtraCRLoc
      );
    }
  }
  //Canvas Drawing code ends here

  //3D table
  viewBPC3D(pItem: any) {
    //var container;

    var lLabel = 'BAR';
    if (lLabel?.substring(0, 3).toUpperCase() == 'BAR') {
      //scene = init();

      this.BPCGenAll(pItem); //Need to uncomment to generate bpc table
      //init(pRowNo);
      //animate();
    }
  }
  SaveLibData(pRowID: any) {
    //I can currently POST a little more than 5000 rows, anything else and I get a 500 error due
    //do the size of my JSON string.
    // this.templateGrid.slickGrid.getEditController().commitCurrentEdit();

    var lReturn = true;
    var lCustomerCode = this.customerCode;
    var lProjectCode = this.projectCode;
    var lTemplate = this.isBPCEditable;

    // if (
    //   (this.order_status != 'New' && this.order_status != 'Created') ||
    //   this.gOrderCreation != 'Yes'
    // ) {
    //   return lReturn;
    // }
    //debugger;
    if (lTemplate != true) {
      return lReturn;
    }

    if (this.gLibChanged > 0 && pRowID >= 0) {
      var lItem = this.templateGrid.slickGrid.getDataItem(pRowID);
      if (lItem != null) {
        lItem.CustomerCode = lCustomerCode;
        lItem.ProjectCode = lProjectCode;
        lItem.Template = true;

        var lJobID = lItem.JobID;
        var lLinkToCover = lItem.pile_cover;
        var lCageName = lItem.lib_name == '' ? null : lItem.lib_name;

        let tempData = lItem;
        let bpcData: AddBPC = this.getBPCDataToSend(tempData);

        console.log('Save Data=>', bpcData);
        this.orderService
          .saveLibData_bpc(
            bpcData,
            lProjectCode,
            lJobID,
            lLinkToCover,
            lCageName,
            lCustomerCode
          )
          .subscribe((response: any) => {
            if (response.response) {
              this.gLibChanged = 0;
              lItem.lib_id = pRowID + 1;
              lItem.set_code = response.set_code;
              lItem.JobID = response.JobID;
              console.log('saveLibData_bpc=>', response, lItem, pRowID);
              this.templateGrid.slickGrid.invalidateRow(pRowID);
              this.templateGrid.slickGrid.render();

              if (this.templateGrid.slickGrid.getSelectedRows().length > 0) {
                this.reloadRebars(
                  this.templateGrid.slickGrid.getDataItem(
                    this.templateGrid.slickGrid.getSelectedRows()[0]
                  )
                );
              }

              this.templateGrid.slickGrid.removeCellCssStyles(
                'repeated_highlight'
              );
              alert(response.responseText);
            } else {
              alert('Error: ' + response.responseText);
              lReturn = false;
              lItem.lib_id = pRowID + 1;
              lItem.set_code = response.set_code;
              lItem.JobID = response.jobID;

              var lClass: any = {};
              lClass[pRowID] = {};
              var cells = this.templateGrid.slickGrid.getColumns();
              for (var i = 0; i < cells.length; i++) {
                lClass[pRowID][cells[i].id] = 'highlighted';
              }

              this.templateGrid.slickGrid.setCellCssStyles(
                'repeated_highlight',
                lClass
              );

              this.templateGrid.slickGrid.invalidateRow(pRowID);
              this.templateGrid.slickGrid.render();
            }
          });
      }
    }
    return lReturn;
  }
  getBPCDataToSend(bpcData: any) {
    let bpcDataSend: AddBPC = {
      CustomerCode: '',
      ProjectCode: '',
      Template: false,
      JobID: 0,
      cage_id: 0,
      pile_type: '',
      pile_dia: 0,
      cage_dia: 0,
      main_bar_arrange: '',
      main_bar_type: '',
      main_bar_ct: '',
      main_bar_shape: '',
      main_bar_grade: '',
      main_bar_dia: '',
      main_bar_topjoin: '',
      main_bar_endjoin: '',
      cage_length: '',
      spiral_link_type: '',
      spiral_link_grade: '',
      spiral_link_dia: '',
      spiral_link_spacing: '',
      lap_length: 0,
      end_length: 0,
      per_set: 0,
      cage_location: '',
      rings_start: 0,
      rings_end: 0,
      rings_addn_no: 0,
      rings_addn_member: 0,
      coupler_top: '',
      coupler_end: '',
      no_of_sr: 0,
      sr_grade: '',
      sr_dia: 0,
      sr_dia_add: 0,
      sr1_location: 0,
      sr2_location: 0,
      sr3_location: 0,
      sr4_location: 0,
      sr5_location: 0,
      crank_height_top: 0,
      crank_height_end: 0,
      crank2_height_top: 0,
      crank2_height_end: 0,
      sl1_length: 0,
      sl2_length: 0,
      sl3_length: 0,
      sl1_dia: 0,
      sl2_dia: 0,
      sl3_dia: 0,
      total_sl_length: 0,
      no_of_cr_top: 0,
      cr_spacing_top: 0,
      no_of_cr_end: 0,
      cr_spacing_end: 0,
      extra_support_bar_ind: '',
      extra_support_bar_dia: 0,
      extra_cr_no: 0,
      extra_cr_loc: 0,
      extra_cr_dia: 0,
      mainbar_length_2layer: 0,
      mainbar_location_2layer: 0,
      bundle_same_type: '',
      bbs_no: '',
      cage_qty: 0,
      cage_weight: 0,
      cage_remarks: '',
      set_code: '',
      nds_groupmarking: '',
      nds_wbs1: '',
      nds_wbs2: '',
      nds_wbs3: '',
      sor_no: '',
      sap_mcode: '',
      copyfrom_project: '',
      copyfrom_template: false,
      copyfrom_jobid: 0,
      copyfrom_ponumber: '',
      UpdateBy: '',
      UpdateDate: '',
      cr_posn_top:0,
      cr_posn_end:0,
      cr_top_remarks:'',
      cr_end_remarks:'',
      pile_cover:this.concreteCover,
      pdf_remark:bpcData.pdf_remark,
      cr_ring_type:bpcData.cr_ring_type ? bpcData.cr_ring_type : "default",
      cr_bundle_side:bpcData.cr_bundle_side ? bpcData.cr_bundle_side : "top"
    };
     bpcDataSend.cr_posn_top = bpcData.cr_posn_top ? bpcData.cr_posn_top : 0;
    bpcDataSend.cr_posn_end = bpcData.cr_posn_end ? bpcData.cr_posn_end : 0;
    bpcDataSend.cr_top_remarks = bpcData.cr_top_remarks ? bpcData.cr_top_remarks : "";
    bpcDataSend.cr_end_remarks = bpcData.cr_end_remarks ? bpcData.cr_end_remarks : "";
    bpcDataSend.pile_cover = bpcData.pile_cover ? parseInt(bpcData.pile_cover) :this.concreteCover;
    (bpcDataSend.CustomerCode = bpcData.CustomerCode
      ? bpcData.CustomerCode.toString()
      : ''),
      (bpcDataSend.ProjectCode = bpcData.ProjectCode
        ? bpcData.ProjectCode.toString()
        : ''),
      (bpcDataSend.Template = bpcData.Template ? bpcData.Template : true),
      (bpcDataSend.JobID = bpcData.JobID ? parseInt(bpcData.JobID) : 0),
      (bpcDataSend.cage_id = bpcData.cage_id ? parseInt(bpcData.cage_id) : 0),
      (bpcDataSend.pile_type = bpcData.pile_type ? bpcData.pile_type : ''),
      (bpcDataSend.pile_dia = bpcData.pile_dia
        ? parseInt(bpcData.pile_dia)
        : 0),
      (bpcDataSend.cage_dia = bpcData.cage_dia
        ? parseInt(bpcData.cage_dia)
        : 0),
      (bpcDataSend.main_bar_arrange = bpcData.main_bar_arrange
        ? bpcData.main_bar_arrange.toString()
        : ''),
      (bpcDataSend.main_bar_type = bpcData.main_bar_type
        ? bpcData.main_bar_type.toString()
        : ''),
      (bpcDataSend.main_bar_ct = bpcData.main_bar_ct
        ? bpcData.main_bar_ct.toString()
        : ''),
      (bpcDataSend.main_bar_shape = bpcData.main_bar_shape
        ? bpcData.main_bar_shape.toString()
        : ''),
      (bpcDataSend.main_bar_grade = bpcData.main_bar_grade
        ? bpcData.main_bar_grade.toString()
        : ''),
      (bpcDataSend.main_bar_dia = bpcData.main_bar_dia
        ? bpcData.main_bar_dia.toString()
        : ''),
      (bpcDataSend.main_bar_topjoin = bpcData.main_bar_topjoin
        ? bpcData.main_bar_topjoin.toString()
        : ''),
      (bpcDataSend.main_bar_endjoin = bpcData.main_bar_endjoin
        ? bpcData.main_bar_endjoin.toString()
        : ''),
      (bpcDataSend.cage_length = bpcData.cage_length
        ? bpcData.cage_length.toString()
        : ''),
      (bpcDataSend.spiral_link_type = bpcData.spiral_link_type
        ? bpcData.spiral_link_type.toString()
        : ''),
      (bpcDataSend.spiral_link_grade = bpcData.spiral_link_grade
        ? bpcData.spiral_link_grade.toString()
        : ''),
      (bpcDataSend.spiral_link_dia = bpcData.spiral_link_dia
        ? bpcData.spiral_link_dia.toString()
        : ''),
      (bpcDataSend.spiral_link_spacing = bpcData.spiral_link_spacing
        ? bpcData.spiral_link_spacing.toString()
        : ''),
      (bpcDataSend.lap_length = bpcData.lap_length
        ? parseInt(bpcData.lap_length)
        : 0),
      (bpcDataSend.end_length = bpcData.end_length
        ? parseInt(bpcData.end_length)
        : 0),
      (bpcDataSend.per_set = bpcData.per_set ? parseInt(bpcData.per_set) : 0),
      (bpcDataSend.cage_location = bpcData.cage_location
        ? bpcData.cage_location
        : ''),
      (bpcDataSend.rings_start = bpcData.rings_start
        ? parseInt(bpcData.rings_start)
        : 0),
      (bpcDataSend.rings_end = bpcData.rings_end
        ? parseInt(bpcData.rings_end)
        : 0),
      (bpcDataSend.rings_addn_no = bpcData.rings_addn_no
        ? parseInt(bpcData.rings_addn_no)
        : 0),
      (bpcDataSend.rings_addn_member = bpcData.rings_addn_member
        ? parseInt(bpcData.rings_addn_member)
        : 0),
      (bpcDataSend.coupler_top = bpcData.coupler_top
        ? bpcData.coupler_top.toString()
        : ''),
      (bpcDataSend.coupler_end = bpcData.coupler_end
        ? bpcData.coupler_end.toString()
        : ''),
      (bpcDataSend.no_of_sr = bpcData.no_of_sr
        ? parseInt(bpcData.no_of_sr)
        : 0),
      (bpcDataSend.sr_grade = bpcData.sr_grade
        ? bpcData.sr_grade.toString()
        : ''),
      (bpcDataSend.sr_dia = bpcData.sr_dia ? parseInt(bpcData.sr_dia) : 0),
      (bpcDataSend.sr_dia_add = bpcData.sr_dia_add
        ? parseInt(bpcData.sr_dia_add)
        : 0),
      (bpcDataSend.sr1_location = bpcData.sr1_location
        ? parseInt(bpcData.sr1_location)
        : 0),
      (bpcDataSend.sr2_location = bpcData.sr2_location
        ? parseInt(bpcData.sr2_location)
        : 0),
      (bpcDataSend.sr3_location = bpcData.sr3_location
        ? parseInt(bpcData.sr3_location)
        : 0),
      (bpcDataSend.sr4_location = bpcData.sr4_location
        ? parseInt(bpcData.sr4_location)
        : 0),
      (bpcDataSend.sr5_location = bpcData.sr5_location
        ? parseInt(bpcData.sr5_location)
        : 0),
      (bpcDataSend.crank_height_top = bpcData.crank_height_top
        ? parseInt(bpcData.crank_height_top)
        : 0),
      (bpcDataSend.crank_height_end = bpcData.crank_height_end
        ? parseInt(bpcData.crank_height_end)
        : 0),
      (bpcDataSend.crank2_height_top = bpcData.crank2_height_top
        ? parseInt(bpcData.crank2_height_top)
        : 0),
      (bpcDataSend.crank2_height_end = bpcData.crank2_height_end
        ? parseInt(bpcData.crank2_height_end)
        : 0),
      (bpcDataSend.sl1_length = bpcData.sl1_length
        ? parseInt(bpcData.sl1_length)
        : 0),
      (bpcDataSend.sl2_length = bpcData.sl2_length
        ? parseInt(bpcData.sl2_length)
        : 0),
      (bpcDataSend.sl3_length = bpcData.sl3_length
        ? parseInt(bpcData.sl3_length)
        : 0),
      (bpcDataSend.sl1_dia = bpcData.sl1_dia ? parseInt(bpcData.sl1_dia) : 0),
      (bpcDataSend.sl2_dia = bpcData.sl2_dia ? parseInt(bpcData.sl2_dia) : 0),
      (bpcDataSend.sl3_dia = bpcData.sl3_dia ? parseInt(bpcData.sl3_dia) : 0),
      (bpcDataSend.total_sl_length = bpcData.total_sl_length
        ? parseInt(bpcData.total_sl_length)
        : 0),
      (bpcDataSend.no_of_cr_top = bpcData.no_of_cr_top
        ? parseInt(bpcData.no_of_cr_top)
        : 0),
      (bpcDataSend.cr_spacing_top = bpcData.cr_spacing_top
        ? parseInt(bpcData.cr_spacing_top)
        : 0),
      (bpcDataSend.no_of_cr_end = bpcData.no_of_cr_end
        ? parseInt(bpcData.no_of_cr_end)
        : 0),
      (bpcDataSend.cr_spacing_end = bpcData.cr_spacing_end
        ? parseInt(bpcData.cr_spacing_end)
        : 0),
      (bpcDataSend.cr_end_remarks = bpcData.cr_end_remarks
        ? bpcData.cr_end_remarks.toString()
        : ''),
      (bpcDataSend.extra_support_bar_ind = bpcData.extra_support_bar_ind
        ? bpcData.extra_support_bar_ind.toString()
        : ''),
      (bpcDataSend.extra_support_bar_dia = bpcData.extra_support_bar_dia
        ? parseInt(bpcData.extra_support_bar_dia)
        : 0),
      (bpcDataSend.extra_cr_no = bpcData.extra_cr_no
        ? parseInt(bpcData.extra_cr_no)
        : 0),
      (bpcDataSend.extra_cr_loc = bpcData.extra_cr_loc
        ? parseInt(bpcData.extra_cr_loc)
        : 0),
      (bpcDataSend.extra_cr_dia = bpcData.extra_cr_dia
        ? parseInt(bpcData.extra_cr_dia)
        : 0),
      (bpcDataSend.mainbar_length_2layer = bpcData.mainbar_length_2layer
        ? parseInt(bpcData.mainbar_length_2layer)
        : 0),
      (bpcDataSend.mainbar_location_2layer = bpcData.mainbar_location_2layer
        ? parseInt(bpcData.mainbar_location_2layer)
        : 0),
      (bpcDataSend.bundle_same_type = bpcData.bundle_same_type
        ? bpcData.bundle_same_type.toString()
        : ''),
      (bpcDataSend.bbs_no = bpcData.bbs_no ? bpcData.bbs_no.toString() : ''),
      (bpcDataSend.cage_qty = bpcData.cage_qty
        ? parseInt(bpcData.cage_qty)
        : 0),
      (bpcDataSend.cage_weight = bpcData.cage_weight
        ? parseInt(bpcData.cage_weight)
        : 0),
      (bpcDataSend.cage_remarks = bpcData.cage_remarks
        ? bpcData.cage_remarks
        : ''),
      (bpcDataSend.set_code = bpcData.set_code
        ? bpcData.set_code.toString()
        : ''),
      (bpcDataSend.nds_groupmarking = bpcData.nds_groupmarking
        ? bpcData.nds_groupmarking.toString()
        : ''),
      (bpcDataSend.nds_wbs1 = bpcData.nds_wbs1
        ? bpcData.nds_wbs1.toString()
        : ''),
      (bpcDataSend.nds_wbs2 = bpcData.nds_wbs2
        ? bpcData.nds_wbs2.toString()
        : ''),
      (bpcDataSend.nds_wbs3 = bpcData.nds_wbs3
        ? bpcData.nds_wbs3.toString()
        : ''),
      (bpcDataSend.sor_no = bpcData.sor_no ? bpcData.sor_no.toString() : ''),
      (bpcDataSend.sap_mcode = bpcData.sap_mcode
        ? bpcData.sap_mcode.toString()
        : ''),
      (bpcDataSend.copyfrom_project = bpcData.copyfrom_project
        ? bpcData.copyfrom_project.toString()
        : ''),
      (bpcDataSend.copyfrom_template = bpcData.copyfrom_template
        ? bpcData.copyfrom_template
        : true),
      (bpcDataSend.copyfrom_jobid = bpcData.copyfrom_jobid
        ? parseInt(bpcData.copyfrom_jobid)
        : 0),
      (bpcDataSend.copyfrom_ponumber = bpcData.copyfrom_ponumber
        ? bpcData.copyfrom_ponumber.toString()
        : ''),
      (bpcDataSend.UpdateBy = bpcData.UpdateBy
        ? bpcData.UpdateBy.toString()
        : ''),
      (bpcDataSend.UpdateDate = bpcData.UpdateDate
        ? bpcData.UpdateDate
        : '2023-12-04T07:11:45.175Z');
    return bpcDataSend;
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(
      currentDate,
      'yyyy-MM-ddTHH:mm:ss.SSSZ'
    );
    if (formattedDate !== undefined && formattedDate !== null) {
      return formattedDate;
    } else {
      // Handle the case where the formatted date is undefined
      console.error('Error formatting date');
      return ''; // or throw an error or return a default value
    }
  }
  reloadRebars(pBPC: any) {
    console.log('reloadRebars=>', pBPC);
    var lCustomerCode = this.customerCode;
    var lProjectCode = this.projectCode;
    var lJobID = pBPC.JobID ? pBPC.JobID : null;
    var lCageID = pBPC.cage_id;
    var lTemplate = pBPC.Template;
    let bpcObj = {
      CustomerCode: lCustomerCode,
      ProjectCode: lProjectCode,
      JobID: lJobID,
      CageID: lCageID,
      Template: lTemplate,
    };

    // //debugger;
    this.orderService.getRebarData_bpc(bpcObj).subscribe((response: any) => {
      this.rebarData = [];
      // this.rebarGrid.slickGrid.invalidate();
      if (response != null && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          this.rebarData[i] = {
            id: i + 1,
            BarID: response[i].BarID,
            BarType: response[i].BarType,
            BarMark: response[i].BarMark,
            BarSize: response[i].BarSize,
            BarTotalQty: response[i].BarTotalQty,
            BarShapeCode: response[i].BarShapeCode,
            A: response[i].A,
            B: response[i].B,
            C: response[i].C,
            D: response[i].D,
            E: response[i].E,
            BarLength: response[i].BarLength,
            BarWeight: response[i].BarWeight,
            Remarks: response[i].Remarks,
          };
        }
      } else {
      }
      // this.resizeRebars();
    });
  }
  resizeRebars() {}
  SetDrawing(item: any) {
    if (item != null) {
      var lLayer = item.pile_type;
      if (lLayer == null || lLayer == '') {
        lLayer = 'Single-Layer';
      }

      var lArrange = item.main_bar_arrange;
      if (lArrange == null || lArrange == '') {
        lArrange = 'Single';
      }

      var lMainBarType = item.main_bar_type;
      if (lMainBarType == null || lMainBarType == '') {
        lMainBarType = 'Single';
      }

      var lCT = item.main_bar_ct;
      if (lCT == '' || lCT == '0') {
        lCT = 24;
      }

      var lMainBarDia = item.main_bar_dia;
      if (lMainBarDia == '' || lMainBarDia == '0') {
        lMainBarDia = '32';
      }

      var lSameBarBundle = item.bundle_same_type;
      if (lSameBarBundle == null || lSameBarBundle == '') {
        lSameBarBundle = 'N';
      }

      this.drawPlanView(
        this.contextp,
        lCT,
        lLayer,
        lMainBarType,
        lArrange,
        lMainBarDia,
        lSameBarBundle,
        item.extra_support_bar_ind
      );

      var lCover = parseInt(this.concreteCover);

      if (this.templateGrid.slickGrid.getSelectedRows().length > 0) {
        lCover = this.templateGrid.slickGrid.getDataItem(
          this.templateGrid.slickGrid.getSelectedRows()[0]
        ).pile_cover;
      }

      this.drawPileDiameter(this.contextp);
      this.drawCover(this.contextp);
      this.drawCoverWords(this.contextp, lCover);
      this.drawMainBarLine(this.contextp, 0);
      this.drawLinks(this.contextp, 5, 0);

      var lGrade = item.main_bar_grade;
      var lDia = item.main_bar_dia;
      var lNumber = item.main_bar_ct;
      this.drawMainBarWords(this.contextp, lGrade, lDia, lNumber);

      var lDia = item.pile_dia;
      this.drawPileDiameterNumber(this.contextp, lDia);

      var lCageLength = item.cage_length;
      var lLapLength = item.lap_length;
      var lEndLength = item.end_length;
      var lSLType = item.spiral_link_type;
      var lSLGrade = item.spiral_link_grade;
      var lSLDia = item.spiral_link_dia;
      var lSLSpacing = item.spiral_link_spacing;
      var lCouplerTop = item.coupler_top;
      var lCouplerEnd = item.coupler_end;
      var lMainBarShape = item.main_bar_shape;
      var lSL1Length = item.sl1_length;
      var lSL2Length = item.sl2_length;
      var lSL3Length = item.sl3_length;
      var lSL1Dia = item.sl1_dia;
      var lSL2Dia = item.sl2_dia;
      var lSL3Dia = item.sl3_dia;
      var l2LayerLen = item.mainbar_length_2layer;
      var l2LayerPos = item.mainbar_location_2layer;
      var lPileType = item.pile_type;

      this.drawElevView(
        this.contextEl,
        lCageLength,
        lLapLength,
        lEndLength,
        lSLType,
        lSLGrade,
        lSLDia,
        lSLSpacing,
        lCouplerTop,
        lCouplerEnd,
        lMainBarShape,
        lSL1Length,
        lSL2Length,
        lSL3Length,
        lSL1Dia,
        lSL2Dia,
        lSL3Dia,
        l2LayerLen,
        l2LayerPos,
        lPileType,
        item.rings_start,
        item.rings_end,
        item.no_of_cr_top, item.no_of_cr_end
      );

      this.drawStiffenerRing(
        this.contextEl,
        lLapLength,
        lEndLength,
        lCageLength,
        item.no_of_sr,
        item.sr_grade,
        item.sr_dia,
        item.sr1_location,
        item.sr2_location,
        item.sr3_location,
        item.sr4_location,
        item.sr5_location,
        item.main_bar_shape,
        lPileType,
        item.extra_support_bar_ind,
        item.extra_support_bar_dia,
        item.extra_cr_no
      );

      if (lPileType != 'Micro-Pile') {
        this.drawCircularRing(
          this.contextEl,
          lLapLength,
          lEndLength,
          lCageLength,
          item.no_of_cr_top,
          item.no_of_cr_end,
          item.cr_spacing_top,
          item.cr_spacing_end,
          item.main_bar_shape,
          item.spiral_link_type,
          item.cr_end_remarks,
          item.extra_cr_no,
          item.extra_cr_loc,
          item.extra_cr_dia,
          item.rings_start,
          item.rings_end,
          item.cr_posn_top,
          item.cr_posn_end,
          item.cr_top_remarks,
          item.cr_ring_type,
          item.cr_bundle_side
        );
      }

      this.drawAdditionalRings(
        this.contextEl,
        item.no_of_sr,
        lLapLength,
        lEndLength,
        lCageLength,
        item.rings_start,
        item.rings_end,
        item.rings_addn_member,
        item.rings_addn_no
      );

      this.drawCrankHeight(
        this.contextEl,
        lLapLength,
        lEndLength,
        lCageLength,
        item.main_bar_shape,
        item.crank_height_top,
        item.crank_height_end
      );

      this.viewBPC3D(item);
    }
  }
  //Generate BPC Table
  BPCGenAll(pItem: any) {
    // this.pScene = this.loadDta();

    //Main Bar
    this.BPCSTMainBarGen(this.pScene, pItem);
    //Spiral Links
    this.BPCSpiralLinkGen(this.pScene, pItem);
    // Stiffener Ring
    this.BPCSRGen(this.pScene, pItem);
    // Circular Ring
    this.BPCCRGen(this.pScene, pItem);

    this.animate();
  }

  BPCCRGen(ScrScene: any, pItem: any) {
    //ScrScene, cageDia, cageLength, NoBars, mainDia, SRDia, SRPosition
    //draw Circular ring
    //var lBPCRev = grid.getDataItem(pRowNo);
    var lBPCRev = pItem;
    if (lBPCRev == null) {
      return;
    }

    var lCageDia = parseInt(lBPCRev.cage_dia);
    var lCageLength = parseInt(lBPCRev.cage_length);
    var lMainDia = parseInt(lBPCRev.main_bar_dia);
    var lCRNoTop = parseInt(lBPCRev.no_of_cr_top);
    var lCRSpacingTop = parseInt(lBPCRev.cr_spacing_top);
    var lCRNoEnd = parseInt(lBPCRev.no_of_cr_end);
    var lCRSpacingEnd = parseInt(lBPCRev.cr_spacing_end);
    var lCRDia = parseInt(lBPCRev.spiral_link_dia);
    var lStartLap = parseInt(lBPCRev.lap_length);
    var lEndLap = parseInt(lBPCRev.end_length);
    var lSLType = lBPCRev.spiral_link_type;

    var lTwin = 0;
    if (lSLType.substring(0, 4) == 'Twin') {
      lTwin = 1;
    }

    var lCRRingDia = lCageDia - lCRDia;

    var objectMaterial = new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 0.7,
    });
    objectMaterial.side = THREE.DoubleSide;
    objectMaterial.opacity = 1;
    //objectMaterial.transparent = true;

    var materialColor = new THREE.Color();
    materialColor.setRGB(1.5, 1.5, 1.5);

    objectMaterial.color = materialColor;

    if (lCRNoTop > 0 && lCRSpacingTop > 0) {
      var objectGeometry = new THREE.TorusGeometry(
        lCRRingDia / 20,
        lCRDia / 20,
        16,
        32
      );
      for (let i = 0; i < lCRNoTop; i++) {
        var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
        mesh.position.x = 0; //400
        mesh.position.y = 0; //50 ;
        mesh.position.z =
          (lCageLength / 2 - lStartLap - i * lCRSpacingTop) / 20;
        mesh.rotation.y = Math.PI;
        mesh.rotation.x = Math.PI;
        mesh.matrixAutoUpdate = true;
        mesh.updateMatrix();
        this.scene.add(mesh);

        if (lTwin > 0) {
          var TwinMesh = new THREE.Mesh(objectGeometry, objectMaterial);
          TwinMesh.position.x = 0; //400
          TwinMesh.position.y = 0; //50 ;
          TwinMesh.position.z =
            (lCageLength / 2 - lStartLap - i * lCRSpacingTop - lCRDia) / 20;
          TwinMesh.rotation.y = Math.PI;
          TwinMesh.rotation.x = Math.PI;
          TwinMesh.matrixAutoUpdate = true;
          TwinMesh.updateMatrix();
          this.scene.add(TwinMesh);
        }
      }
    }

    if (lCRNoEnd > 0 && lCRSpacingEnd > 0) {
      var objectGeometry = new THREE.TorusGeometry(
        lCRRingDia / 20,
        lCRDia / 20,
        16,
        32
      );
      for (let i = 0; i < lCRNoEnd; i++) {
        var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
        mesh.position.x = 0; //400
        mesh.position.y = 0; //50 ;
        mesh.position.z =
          (0 - lCageLength / 2 + lEndLap + i * lCRSpacingEnd) / 20;
        mesh.rotation.y = Math.PI;
        mesh.rotation.x = Math.PI;
        mesh.matrixAutoUpdate = true;
        mesh.updateMatrix();
        this.scene.add(mesh);

        if (lTwin > 0) {
          var lTwinMesh = new THREE.Mesh(objectGeometry, objectMaterial);
          lTwinMesh.position.x = 0; //400
          lTwinMesh.position.y = 0; //50 ;
          lTwinMesh.position.z =
            (0 - lCageLength / 2 + lEndLap + i * lCRSpacingEnd + lCRDia) / 20;
          lTwinMesh.rotation.y = Math.PI;
          lTwinMesh.rotation.x = Math.PI;
          lTwinMesh.matrixAutoUpdate = true;
          lTwinMesh.updateMatrix();
          this.scene.add(lTwinMesh);
        }
      }
    }
  }

  BPCSRGen(ScrScene: any, pItem: any) {
    //ScrScene, cageDia, cageLength, NoBars, mainDia, SRDia, SRPosition
    //draw Stiffener ring
    //var lBPCRev = grid.getDataItem(pRowNo);
    var lBPCRev = pItem;
    if (lBPCRev == null) {
      return;
    }

    var lCageDia: any = parseInt(lBPCRev.cage_dia);
    if (lCageDia == null || lCageDia == '') {
      lCageDia = 0;
    }

    var lCageLength: any = parseInt(lBPCRev.cage_length);
    if (lCageLength == null || lCageLength == '') {
      lCageLength = 0;
    }

    var lMainDiaS = lBPCRev.main_bar_dia;
    var lMainDiaArr =
      lMainDiaS!.toString().indexOf(',') != -1
        ? lMainDiaS.toString().split(',')
        : lMainDiaS;
    var lMainDia1 = 0;
    var lMainDia2 = 0;
    if (lMainDiaArr.length > 0 && lMainDiaArr[0] != null) {
      lMainDia1 = parseInt(lMainDiaArr[0]);
    }
    if (lMainDiaArr.length > 1 && lMainDiaArr[1] != null) {
      lMainDia2 = parseInt(lMainDiaArr[1]);
    }

    var lSLDia: any = parseInt(lBPCRev.spiral_link_dia);
    if (lSLDia == null || lSLDia == '') {
      lSLDia = 0;
    }

    var lSRNo: any = parseInt(lBPCRev.no_of_sr);
    if (lSRNo == null || lSRNo == '') {
      lSRNo = 0;
    }

    var lSRDia: any = parseInt(lBPCRev.sr_dia);
    if (lSRDia == null || lSRDia == '') {
      lSRDia = 0;
    }

    var lSRLoc1: any = parseInt(lBPCRev.sr1_location);
    if (lSRLoc1 == null || lSRLoc1 == '') {
      lSRLoc1 = 0;
    }

    var lSRLoc2: any = parseInt(lBPCRev.sr2_location);
    if (lSRLoc2 == null || lSRLoc2 == '') {
      lSRLoc2 = 0;
    }

    var lSRLoc3: any = parseInt(lBPCRev.sr3_location);
    if (lSRLoc3 == null || lSRLoc2 == '') {
      lSRLoc3 = 0;
    }

    var lSRLoc4: any = parseInt(lBPCRev.sr3_location);
    if (lSRLoc4 == null || lSRLoc4 == '') {
      lSRLoc4 = 0;
    }

    var lPileType = '';
    if (lBPCRev.pile_type != null) {
      lPileType = lBPCRev.pile_type;
    }

    var lLoc2Layer = 0;
    if (lBPCRev.mainbar_location_2layer != null) {
      lLoc2Layer = lBPCRev.mainbar_location_2layer;
    }

    var lLen2Layer = 0;
    if (lBPCRev.mainbar_length_2layer != null) {
      lLen2Layer = lBPCRev.mainbar_length_2layer;
    }

    var lMainBarArrange = lBPCRev.main_bar_arrange;

    var objectMaterial = new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 0.7,
    });
    objectMaterial.side = THREE.DoubleSide;
    objectMaterial.opacity = 1.5;
    //objectMaterial.transparent = true;

    var materialColor = new THREE.Color();
    materialColor.setRGB(1.5, 1.5, 1.5);

    objectMaterial.color = materialColor;

    var lSRRingDia = lCageDia - lSLDia - 2 * lMainDia1 - lSRDia;

    if (lMainBarArrange == 'In-Out') {
      if (lMainDia2 > 0) {
        lSRRingDia = lSRRingDia - 2 * lMainDia2;
      } else {
        lSRRingDia = lSRRingDia - 2 * lMainDia1;
      }
    }

    var objectGeometry = new THREE.TorusGeometry(
      lSRRingDia / 20,
      lSRDia / 20,
      16,
      32
    );

    if (lSRNo > 0 && lSRLoc1 > 0) {
      var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
      mesh.position.x = 0; //400
      mesh.position.y = 0; //50 ;
      mesh.position.z = (lCageLength / 2 - lSRLoc1) / 20;
      mesh.rotation.y = Math.PI;
      mesh.rotation.x = Math.PI;
      mesh.matrixAutoUpdate = true;
      mesh.updateMatrix();
      this.scene.add(mesh);
    }

    if (lSRNo > 1 && lSRLoc2 > 0) {
      var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
      mesh.position.x = 0; //400
      mesh.position.y = 0; //50 ;
      mesh.position.z = (lCageLength / 2 - lSRLoc2) / 20;
      mesh.rotation.y = Math.PI;
      mesh.rotation.x = Math.PI;
      mesh.matrixAutoUpdate = true;
      mesh.updateMatrix();
      this.scene.add(mesh);
    }

    if (lSRNo > 2 && lSRLoc3 > 0) {
      var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
      mesh.position.x = 0; //400
      mesh.position.y = 0; //50 ;
      mesh.position.z = (lCageLength / 2 - lSRLoc3) / 20;
      mesh.rotation.y = Math.PI;
      mesh.rotation.x = Math.PI;
      mesh.matrixAutoUpdate = true;
      mesh.updateMatrix();
      this.scene.add(mesh);
    }

    if (lSRNo > 3 && lSRLoc4 > 0) {
      var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
      mesh.position.x = 0; //400
      mesh.position.y = 0; //50 ;
      mesh.position.z = (lCageLength / 2 - lSRLoc4) / 20;
      mesh.rotation.y = Math.PI;
      mesh.rotation.x = Math.PI;
      mesh.matrixAutoUpdate = true;
      mesh.updateMatrix();
      this.scene.add(mesh);
    }

    if (lPileType == 'Double-Layer') {
      lSRRingDia =
        lCageDia - lSLDia - 2 * lMainDia1 - 2 * lSRDia - 2 * lMainDia2 - lSRDia;

      var objectGeometry = new THREE.TorusGeometry(
        lSRRingDia / 20,
        lSRDia / 20,
        16,
        32
      );

      if (lSRNo > 0 && lSRLoc1 > 0 && lLoc2Layer <= lSRLoc1 - 100) {
        var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
        mesh.position.x = 0; //400
        mesh.position.y = 0; //50 ;
        mesh.position.z = (lCageLength / 2 - lSRLoc1) / 20;
        mesh.rotation.y = Math.PI;
        mesh.rotation.x = Math.PI;
        mesh.matrixAutoUpdate = true;
        mesh.updateMatrix();
        this.scene.add(mesh);
      } else {
        var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
        mesh.position.x = 0; //400
        mesh.position.y = 0; //50 ;
        mesh.position.z = (lCageLength / 2 - lLoc2Layer - 100) / 20;
        mesh.rotation.y = Math.PI;
        mesh.rotation.x = Math.PI;
        mesh.matrixAutoUpdate = true;
        mesh.updateMatrix();
        this.scene.add(mesh);
      }

      if (lSRNo > 1 && lSRLoc2 > 0) {
        //check last SR
        if (lSRNo == 2 && lLoc2Layer + lLen2Layer < lSRLoc2 - 100) {
          var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
          mesh.position.x = 0; //400
          mesh.position.y = 0; //50 ;
          mesh.position.z =
            (lCageLength / 2 - lLoc2Layer - lLen2Layer + 100) / 20;
          mesh.rotation.y = Math.PI;
          mesh.rotation.x = Math.PI;
          mesh.matrixAutoUpdate = true;
          mesh.updateMatrix();
          this.scene.add(mesh);
        } else {
          // check if need to skip the SR
          if (
            lSRLoc2 - 2000 > lLoc2Layer &&
            lSRLoc2 + 2000 < lLoc2Layer + lLen2Layer
          ) {
            var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
            mesh.position.x = 0; //400
            mesh.position.y = 0; //50 ;
            mesh.position.z = (lCageLength / 2 - lSRLoc2) / 20;
            mesh.rotation.y = Math.PI;
            mesh.rotation.x = Math.PI;
            mesh.matrixAutoUpdate = true;
            mesh.updateMatrix();
            this.scene.add(mesh);
          }
        }
      }

      if (lSRNo > 2 && lSRLoc3 > 0) {
        if (lSRNo == 3 && lLoc2Layer + lLen2Layer < lSRLoc3 - 100) {
          var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
          mesh.position.x = 0; //400
          mesh.position.y = 0; //50 ;
          mesh.position.z =
            (lCageLength / 2 - lLoc2Layer - lLen2Layer + 100) / 20;
          mesh.rotation.y = Math.PI;
          mesh.rotation.x = Math.PI;
          mesh.matrixAutoUpdate = true;
          mesh.updateMatrix();
          this.scene.add(mesh);
        } else {
          if (
            lSRLoc3 - 2000 > lLoc2Layer &&
            lSRLoc3 + 2000 < lLoc2Layer + lLen2Layer
          ) {
            var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
            mesh.position.x = 0; //400
            mesh.position.y = 0; //50 ;
            mesh.position.z = (lCageLength / 2 - lSRLoc3) / 20;
            mesh.rotation.y = Math.PI;
            mesh.rotation.x = Math.PI;
            mesh.matrixAutoUpdate = true;
            mesh.updateMatrix();
            this.scene.add(mesh);
          }
        }
      }

      if (lSRNo > 3 && lSRLoc4 > 0) {
        if (lSRNo == 4 && lLoc2Layer + lLen2Layer < lSRLoc4 - 100) {
          var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
          mesh.position.x = 0; //400
          mesh.position.y = 0; //50 ;
          mesh.position.z =
            (lCageLength / 2 - lLoc2Layer - lLen2Layer + 100) / 20;
          mesh.rotation.y = Math.PI;
          mesh.rotation.x = Math.PI;
          mesh.matrixAutoUpdate = true;
          mesh.updateMatrix();
          this.scene.add(mesh);
        } else {
          var mesh = new THREE.Mesh(objectGeometry, objectMaterial);
          mesh.position.x = 0; //400
          mesh.position.y = 0; //50 ;
          mesh.position.z = (lCageLength / 2 - lSRLoc4) / 20;
          mesh.rotation.y = Math.PI;
          mesh.rotation.x = Math.PI;
          mesh.matrixAutoUpdate = true;
          mesh.updateMatrix();
          this.scene.add(mesh);
        }
      }
    }
  }
  BPCSpiralLinkGen(ScrScene: any, pRowNo: any) {
    //, cageDia, cageLength, NoBars, mainDia, linkDia, SpacingSL, StartLap, EndLap, StartSR, EndSR

    //var lBPCRev = grid.getDataItem(pRowNo);
    var lBPCRev = pRowNo;
    if (lBPCRev == null) {
      return;
    }

    var lCageDia: any = parseInt(lBPCRev.cage_dia);
    if (lCageDia == null || lCageDia == '') {
      lCageDia = 0;
    }

    var lCageLength: any = parseInt(lBPCRev.cage_length);
    if (lCageLength == null || lCageLength == '') {
      lCageLength = 0;
    }

    var lMainDia: any = parseInt(lBPCRev.main_bar_dia);
    if (lMainDia == null || lMainDia == '') {
      lMainDia = 0;
    }

    var lCrankHTTop = parseInt(lBPCRev.crank_height_top);
    var lCrankHTEnd = parseInt(lBPCRev.crank_height_end);

    var lStartLap = parseInt(lBPCRev.lap_length);
    var lEndLap = parseInt(lBPCRev.end_length);
    var lSLType = lBPCRev.spiral_link_type;
    var lSLGrade = lBPCRev.spiral_link_grade;
    var lSLDia = parseInt(lBPCRev.spiral_link_dia);
    var lSLSpacing = lBPCRev.spiral_link_spacing;
    var lMainBarShape = lBPCRev.main_bar_shape;
    var lSL1Length = parseInt(lBPCRev.sl1_length);
    var lSL2Length = parseInt(lBPCRev.sl2_length);
    var lSL3Length = parseInt(lBPCRev.sl3_length);

    var lStartSR = parseInt(lBPCRev.rings_start);
    var lEndSR = parseInt(lBPCRev.rings_end);
    var lAddnNo = parseInt(lBPCRev.rings_addn_no);
    var lAddnMemb = parseInt(lBPCRev.rings_addn_member);

    if (lStartLap < 700) {
      lStartLap = 700;
    }

    if (lEndLap < 500) {
      lEndLap = 500;
    }

    if (lCageDia > 0 && lCageLength > 0 && lMainDia > 0) {
      var lSpiralDia = lCageDia - lSLDia;

      var randomPoints = [];

      var lX = 0;
      var lY = 0;
      var lZ = 0;
      var lEndBarNo = 0;
      var lSteps = 0;
      var lSpiralPath: any = new THREE.CurvePath();

      var lTwin = 1;
      if (lSLType.substring(0, 4) == 'Twin') {
        lTwin = 2;
      }

      var lUsed = 0;
      var lCrankDedTop = 0;
      var lCrankDedEnd = 0;
      var lStartSRDed = lStartSR * lSLDia;
      var lEndSRDed = lEndSR * lSLDia;

      if (
        lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank' ||
        lMainBarShape == 'Crank-Both'
      ) {
        lCrankDedTop = lCrankDedTop + lMainDia * 10;
        lStartSRDed = 0;
      }

      if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
        lCrankDedEnd = lCrankDedEnd + lMainDia * 10;
        lEndSRDed = 0;
      }

      if (lEndSR > 0) {
        if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
          lSpiralPath.add(
            this.getSpiralPath(
              lSpiralDia - lCrankHTEnd,
              0 - lCageLength / 2 + lEndLap - lTwin * lSLDia * lEndSR,
              lEndSR,
              lTwin * lSLDia
            )
          );
          lSpiralPath.add(
            this.getSpiralPathVary(
              lSpiralDia - lCrankHTEnd,
              lSpiralDia,
              0 - lCageLength / 2 + lEndLap,
              1,
              lMainDia * 10
            )
          );
          lSteps = lSteps + 1;
          lUsed = lMainDia * 10;
        } else {
          lSpiralPath.add(
            this.getSpiralPath(
              lSpiralDia,
              0 - lCageLength / 2 + lEndLap,
              lEndSR,
              lTwin * lSLDia
            )
          );
          lUsed = lEndSR * lTwin * lSLDia;
        }
        lSteps = lSteps + lEndSR;
      }

      if (lSLType == '1 Spacing' || lSLType == 'Twin 1 Spacing') {
        if (lAddnNo == 0 || lAddnMemb == 0) {
          var lTotalLen =
            lCageLength -
            lStartSRDed -
            lEndSRDed -
            lStartLap -
            lEndLap -
            lUsed -
            lCrankDedTop;
          var lRound = Math.round(lTotalLen / lSLSpacing);
          if (lRound > 0) {
            var lVSpacing = lTotalLen / lRound;
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed + lUsed),
                lRound,
                lVSpacing
              )
            );
            lUsed = lUsed + lRound * lVSpacing;
            lSteps = lSteps + lRound;
          }
        } else {
          var lTotalLen =
            lCageLength -
            lStartSRDed -
            lEndSRDed -
            lStartLap -
            lEndLap -
            lUsed -
            lCrankDedTop;
          var lUsedBK = lUsed;
          for (let i = 0; i < lAddnMemb; i++) {
            var lLen = (lTotalLen - lUsed) / (lAddnMemb - i + 1);
            var lRound = Math.round(lLen / lSLSpacing);
            if (lRound > 0) {
              lSpiralPath.add(
                this.getSpiralPath(
                  lSpiralDia,
                  0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                  lRound,
                  lSLSpacing
                )
              );
              lSteps = lSteps + lRound;
              lUsed = lUsed + lRound * lSLSpacing;
            }
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lAddnNo,
                lTwin * lSLDia
              )
            );
            lUsed = lUsed + lAddnNo * lTwin * lSLDia;
          }
          var lLen = lTotalLen - lUsed + lUsedBK;
          var lRound = Math.round(lLen / lSLSpacing);
          if (lRound > 0) {
            var lVSpacing = lLen / lRound;
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lRound,
                lVSpacing
              )
            );
            lSteps = lSteps + lRound;
            lUsed = lUsed + lRound * lVSpacing;
          }
        }
      } else if (
        lSLType == '2 Spacing' ||
        lSLType == 'Twin 2 Spacing' ||
        lSLType == 'Single-Twin' ||
        lSLType == 'Twin-Single'
      ) {
        var lSpacingArr =
          lSLSpacing!.toString().indexOf(',') != -1
            ? lSLSpacing.toString().split(',')
            : lSLSpacing;
        var lSpacing1 = parseInt(lSpacingArr[0]);
        var lSpacing2 = parseInt(lSpacingArr[1]);
        var lUsedBK = lUsed;
        var lTotalLen =
          lCageLength -
          lStartSRDed -
          lEndSRDed -
          lStartLap -
          lEndLap -
          lUsed -
          lCrankDedTop;
        if (lSL2Length > lCrankDedEnd) {
          var lRound = Math.round((lSL2Length - lCrankDedEnd) / lSpacing2);
          if (lRound > 0) {
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lRound,
                lSpacing2
              )
            );
            lSteps = lSteps + lRound;
            lUsed = lUsed + lRound * lSpacing2;
          }
        }
        var lRound = Math.round((lTotalLen - lUsed + lUsedBK) / lSpacing1);
        if (lRound > 0) {
          var lVSpacing = (lTotalLen - lUsed + lUsedBK) / lRound;
          lSpiralPath.add(
            this.getSpiralPath(
              lSpiralDia,
              0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
              lRound,
              lVSpacing
            )
          );
          lSteps = lSteps + lRound;
          lUsed = lUsed + lRound * lVSpacing;
        }
      } else if (lSLType == '3 Spacing' || lSLType == 'Twin 3 Spacing') {
        var lSpacingArr =
          lSLSpacing!.toString().indexOf(',') != -1
            ? lSLSpacing.toString().split(',')
            : lSLSpacing;
        var lSpacing1 = parseInt(lSpacingArr[0]);
        var lSpacing2 = parseInt(lSpacingArr[1]);
        var lSpacing3 = parseInt(lSpacingArr[2]);
        var lUsedBK = lUsed;
        var lTotalLen =
          lCageLength -
          lStartSRDed -
          lEndSRDed -
          lStartLap -
          lEndLap -
          lUsed -
          lCrankDedTop;

        if (lSL3Length > lCrankDedEnd) {
          var lRound = Math.round((lSL3Length - lCrankDedEnd) / lSpacing3);
          if (lRound > 0) {
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lRound,
                lSpacing3
              )
            );
            lSteps = lSteps + lRound;
            lUsed = lUsed + lRound * lSpacing3;
          }
        }
        if (lSL2Length > 0) {
          var lRound = Math.round(lSL2Length / lSpacing2);
          if (lRound > 0) {
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lRound,
                lSpacing2
              )
            );
            lSteps = lSteps + lRound;
            lUsed = lUsed + lRound * lSpacing2;
          }
        }
        var lRound = Math.round((lTotalLen - lUsed + lUsedBK) / lSpacing1);
        if (lRound > 0) {
          var lVSpacing = (lTotalLen - lUsed + lUsedBK) / lRound;
          lSpiralPath.add(
            this.getSpiralPath(
              lSpiralDia,
              0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
              lRound,
              lVSpacing
            )
          );
          lSteps = lSteps + lRound;
          lUsed = lUsed + lRound * lVSpacing;
        }
      }

      if (lStartSR > 0) {
        if (
          lMainBarShape == 'Crank-Top' ||
          lMainBarShape == 'Crank' ||
          lMainBarShape == 'Crank-Both'
        ) {
          lSpiralPath.add(
            this.getSpiralPathVary(
              lSpiralDia,
              lSpiralDia - lCrankHTTop,
              0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
              1,
              lMainDia * 10
            )
          );
          lUsed = lUsed + lMainDia * 10;

          lSpiralPath.add(
            this.getSpiralPath(
              lSpiralDia - lCrankHTTop,
              0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
              lStartSR,
              lTwin * lSLDia
            )
          );
          lSteps = lSteps + lStartSR + 1;
        } else {
          lSpiralPath.add(
            this.getSpiralPath(
              lSpiralDia,
              0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
              lStartSR,
              lTwin * lSLDia
            )
          );
          lSteps = lSteps + lStartSR;
        }
      }

      var objectMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0,
        metalness: 1.0,
      });
      //var objectMaterial = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 1.0, metalness: 10.0 } );

      //var geometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);
      //var geometry = new THREE.TubeGeometry(lSpiralPath, lSteps * 50, linkDia / 20, 12);
      var geometry = new THREE.TubeGeometry(
        lSpiralPath ? lSpiralPath : 0,
        (lSteps ? lSteps : 0) * 50,
        (lSLDia ? lSLDia : 0) / 20,
        12
      );

      var mesh = new THREE.Mesh(geometry, this.sObjectMaterial);
      this.scene.add(mesh);

      // for trim
      if (lTwin > 1) {
        var lX = 0;
        var lY = 0;
        var lZ = 0;
        var lEndBarNo = 0;
        var lSteps = 0;
        var lSpiralPath: any = new THREE.CurvePath();
        var lUsed = 0;

        if (lEndSR > 0) {
          if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia - lCrankHTEnd,
                0 -
                  lCageLength / 2 +
                  lEndLap -
                  lTwin * lSLDia * lEndSR +
                  lSLDia,
                lEndSR,
                lTwin * lSLDia
              )
            );
            lSpiralPath.add(
              this.getSpiralPathVary(
                lSpiralDia - lCrankHTEnd,
                lSpiralDia,
                0 - lCageLength / 2 + lEndLap + lSLDia,
                1,
                lMainDia * 10
              )
            );
            lSteps = lSteps + 1;
            lUsed = lSLDia + lMainDia * 10;
          } else {
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + lEndLap + lSLDia,
                lEndSR,
                lTwin * lSLDia
              )
            );
            lUsed = lSLDia + lEndSR * lTwin * lSLDia;
          }
          lSteps = lSteps + lEndSR;
        }

        if (lSLType == '1 Spacing' || lSLType == 'Twin 1 Spacing') {
          if (lAddnNo == 0 || lAddnMemb == 0) {
            var lTotalLen =
              lCageLength -
              lStartSRDed -
              lEndSRDed -
              lStartLap -
              lEndLap -
              lUsed -
              lCrankDedTop +
              lSLDia;
            var lRound = Math.round(lTotalLen / lSLSpacing);
            if (lRound > 0) {
              var lVSpacing = lTotalLen / lRound;
              lSpiralPath.add(
                this.getSpiralPath(
                  lSpiralDia,
                  0 - lCageLength / 2 + (lEndLap + lEndSRDed + lUsed),
                  lRound,
                  lVSpacing
                )
              );
              lUsed = lUsed + lRound * lVSpacing;
              lSteps = lSteps + lRound;
            }
          } else {
            var lUsedBK = lUsed;
            var lTotalLen =
              lCageLength -
              lStartSRDed -
              lEndSRDed -
              lStartLap -
              lEndLap -
              lUsed -
              lCrankDedTop +
              lSLDia;
            for (let i = 0; i < lAddnMemb; i++) {
              var lLen = (lTotalLen - lUsed) / (lAddnMemb - i + 1);
              var lRound = Math.round(lLen / lSLSpacing);
              if (lRound > 0) {
                lSpiralPath.add(
                  this.getSpiralPath(
                    lSpiralDia,
                    0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                    lRound,
                    lSLSpacing
                  )
                );
                lSteps = lSteps + lRound;
                lUsed = lUsed + lRound * lSLSpacing;
              }
              lSpiralPath.add(
                this.getSpiralPath(
                  lSpiralDia,
                  0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                  lAddnNo,
                  lTwin * lSLDia
                )
              );
              lUsed = lUsed + lAddnNo * lTwin * lSLDia;
            }
            var lLen = lTotalLen - lUsed + lUsedBK;
            var lRound = Math.round(lLen / lSLSpacing);
            if (lRound > 0) {
              var lVSpacing = lLen / lRound;
              lSpiralPath.add(
                this.getSpiralPath(
                  lSpiralDia,
                  0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                  lRound,
                  lVSpacing
                )
              );
              lSteps = lSteps + lRound;
              lUsed = lUsed + lRound * lVSpacing;
            }
          }
        } else if (
          lSLType == '2 Spacing' ||
          lSLType == 'Twin 2 Spacing' ||
          lSLType == 'Single-Twin' ||
          lSLType == 'Twin-Single'
        ) {
          var lSpacingArr =
            lSLSpacing!.toString().indexOf(',') != -1
              ? lSLSpacing.toString().split(',')
              : lSLSpacing;
          var lSpacing1 = parseInt(lSpacingArr[0]);
          var lSpacing2 = parseInt(lSpacingArr[1]);
          var lUsedBK = lUsed;
          var lTotalLen =
            lCageLength -
            lStartSRDed -
            lEndSRDed -
            lStartLap -
            lEndLap -
            lUsed -
            lCrankDedTop +
            lSLDia;
          if (lSL2Length > lCrankDedEnd) {
            var lRound = Math.round((lSL2Length - lCrankDedEnd) / lSpacing2);
            if (lRound > 0) {
              lSpiralPath.add(
                this.getSpiralPath(
                  lSpiralDia,
                  0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                  lRound,
                  lSpacing2
                )
              );
              lSteps = lSteps + lRound;
              lUsed = lUsed + lRound * lSpacing2;
            }
          }
          var lRound = Math.round((lTotalLen - lUsed + lUsedBK) / lSpacing1);
          if (lRound > 0) {
            var lVSpacing = (lTotalLen - lUsed + lUsedBK) / lRound;
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lRound,
                lVSpacing
              )
            );
            lSteps = lSteps + lRound;
            lUsed = lUsed + lRound * lVSpacing;
          }
        } else if (lSLType == '3 Spacing' || lSLType == 'Twin 3 Spacing') {
          var lSpacingArr =
            lSLSpacing!.toString().indexOf(',') != -1
              ? lSLSpacing.toString().split(',')
              : lSLSpacing;
          var lSpacing1 = parseInt(lSpacingArr[0]);
          var lSpacing2 = parseInt(lSpacingArr[1]);
          var lSpacing3 = parseInt(lSpacingArr[2]);
          var lUsedBK = lUsed;
          var lTotalLen =
            lCageLength -
            lStartSRDed -
            lEndSRDed -
            lStartLap -
            lEndLap -
            lUsed -
            lCrankDedTop +
            lSLDia;

          if (lSL3Length > lCrankDedEnd) {
            var lRound = Math.round((lSL3Length - lCrankDedEnd) / lSpacing3);
            if (lRound > 0) {
              lSpiralPath.add(
                this.getSpiralPath(
                  lSpiralDia,
                  0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                  lRound,
                  lSpacing3
                )
              );
              lSteps = lSteps + lRound;
              lUsed = lUsed + lRound * lSpacing3;
            }
          }
          if (lSL2Length > 0) {
            var lRound = Math.round(lSL2Length / lSpacing2);
            if (lRound > 0) {
              lSpiralPath.add(
                this.getSpiralPath(
                  lSpiralDia,
                  0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                  lRound,
                  lSpacing2
                )
              );
              lSteps = lSteps + lRound;
              lUsed = lUsed + lRound * lSpacing2;
            }
          }
          var lRound = Math.round((lTotalLen - lUsed + lUsedBK) / lSpacing1);
          if (lRound > 0) {
            var lVSpacing = (lTotalLen - lUsed + lUsedBK) / lRound;
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lRound,
                lVSpacing
              )
            );
            lSteps = lSteps + lRound;
            lUsed = lUsed + lRound * lVSpacing;
          }
        }

        if (lStartSR > 0) {
          if (
            lMainBarShape == 'Crank-Top' ||
            lMainBarShape == 'Crank' ||
            lMainBarShape == 'Crank-Both'
          ) {
            lSpiralPath.add(
              this.getSpiralPathVary(
                lSpiralDia,
                lSpiralDia - lCrankHTTop,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                1,
                lMainDia * 10
              )
            );
            lUsed = lUsed + lMainDia * 10;

            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia - lCrankHTTop,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lStartSR,
                lTwin * lSLDia
              )
            );
            lSteps = lSteps + lStartSR + 1;
          } else {
            lSpiralPath.add(
              this.getSpiralPath(
                lSpiralDia,
                0 - lCageLength / 2 + (lEndLap + lEndSRDed) + lUsed,
                lStartSR,
                lTwin * lSLDia
              )
            );
            lSteps = lSteps + lStartSR;
          }
        }

        var lTwinGeometry = new THREE.TubeGeometry(
          lSpiralPath,
          lSteps * 50,
          lSLDia / 20,
          12
        );

        var lTwinMesh = new THREE.Mesh(lTwinGeometry, this.sObjectMaterial);
        this.scene.add(lTwinMesh);
      }
    }
  }

  BPCSTMainBarGen(ScrScene: any, pItem: any) {
    //cageDia, cageLength, NoBars, mainDia
    //var lBPCRev = grid.getDataItem(pRowNo);
    var lBPCRev = pItem;
    if (lBPCRev == null) {
      return;
    }

    var lLayer = lBPCRev.pile_type;
    if (lLayer == null || lLayer == '') {
      lLayer = 'Single-Layer';
    }

    var lArrange = lBPCRev.main_bar_arrange;
    if (lArrange == null || lArrange == '') {
      lArrange = 'Single';
    }

    var lMainBarType = lBPCRev.main_bar_type;
    if (lMainBarType == null || lMainBarType == '') {
      lMainBarType = 'Single';
    }

    var lCT = lBPCRev.main_bar_ct;

    var lMainBarDia: any = lBPCRev.main_bar_dia;

    var lcageLength: any = parseInt(lBPCRev.cage_length);
    if (lcageLength == '' || lcageLength == '0') {
      lcageLength = 12000;
    }

    var lCageDia: any = parseInt(lBPCRev.cage_dia);
    if (lCageDia == '' || lCageDia == '0') {
      lCageDia = 1000;
    }

    var lSLDia: any = parseInt(lBPCRev.spiral_link_dia);
    if (lSLDia == '' || lSLDia == '0') {
      lSLDia = 10;
    }

    var lStartX = 0;
    var lStartY = 0;
    var lStartZ = 0;
    var lEndX = 0;
    var lEndY = 0;
    var lEndZ = 0;

    var lMainBar1 = parseInt(
      lMainBarDia!.toString().indexOf(',') != -1
        ? lMainBarDia.split(',')[0]
        : lMainBarDia
    );
    var lMainBarLocDia = lCageDia - 2 * lSLDia - lMainBar1;
    if (lMainBarType == 'Single') {
      lMainBar1 = parseInt(
        lMainBarDia!.toString().indexOf(',') != -1
          ? lMainBarDia.split(',')[0]
          : lMainBarDia
      );
      this.lBarCT = parseInt(lCT);
      if (lArrange == 'Single') {
        if (this.lBarCT > 0) {
          for (let i = 0; i < this.lBarCT; i++) {
            lStartX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / this.lBarCT)) / 20;
            lStartY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / this.lBarCT)) / 20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / this.lBarCT)) / 20;
            lEndY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / this.lBarCT)) / 20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBar1,
              lBPCRev,
              1
            );
          }
        }
      } else if (lArrange == 'Side-By-Side') {
        if (this.lBarCT > 0) {
          var lLoop = Math.floor(this.lBarCT / 2);
          for (let i = 0; i < lLoop; i++) {
            lStartX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lLoop - lMainBar1 / lMainBarLocDia
                )) /
              20;
            lStartY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lLoop - lMainBar1 / lMainBarLocDia
                )) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lLoop - lMainBar1 / lMainBarLocDia
                )) /
              20;
            lEndY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lLoop - lMainBar1 / lMainBarLocDia
                )) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBar1,
              lBPCRev,
              1
            );

            lStartX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lLoop + lMainBar1 / lMainBarLocDia
                )) /
              20;
            lStartY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lLoop + lMainBar1 / lMainBarLocDia
                )) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lLoop + lMainBar1 / lMainBarLocDia
                )) /
              20;
            lEndY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lLoop + lMainBar1 / lMainBarLocDia
                )) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBar1,
              lBPCRev,
              1
            );
          }
        }
      } else if (lArrange == 'In-Out') {
        if (this.lBarCT > 0) {
          var lLoop = Math.floor(this.lBarCT / 2);
          for (let i = 0; i < lLoop; i++) {
            lStartX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lLoop)) / 20;
            lStartY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lLoop)) / 20;
            lStartZ = lcageLength / 40;
            lEndX = (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lLoop)) / 20;
            lEndY = (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lLoop)) / 20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBar1,
              lBPCRev,
              1
            );

            lStartX =
              ((lMainBarLocDia - 2 * lMainBar1) *
                Math.sin((2 * Math.PI * i) / lLoop)) /
              20;
            lStartY =
              ((lMainBarLocDia - 2 * lMainBar1) *
                Math.cos((2 * Math.PI * i) / lLoop)) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              ((lMainBarLocDia - 2 * lMainBar1) *
                Math.sin((2 * Math.PI * i) / lLoop)) /
              20;
            lEndY =
              ((lMainBarLocDia - 2 * lMainBar1) *
                Math.cos((2 * Math.PI * i) / lLoop)) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBar1,
              lBPCRev,
              1
            );
          }
        }
      }
    } else {
      //Mixed main bars
      console.log('lCT=>', lCT);
      var lBarCTs = lCT!.toString().indexOf(',') != -1 ? lCT.split(',') : lCT;
      var lTotBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]);
      var lMainBarDiaArr =
        lMainBarDia!.toString().indexOf(',') != -1
          ? lMainBarDia.split(',')
          : lMainBarDia;
      var lMainBarDia1 = parseInt(lMainBarDiaArr[0]);
      var lMainBarDia2 = parseInt(lMainBarDiaArr[1]);

      if (lArrange == 'Single') {
        var lLoop1 = parseInt(lBarCTs[0]);
        var lLoop2 = parseInt(lBarCTs[1]);
        var lTotBars = lLoop1 + lLoop2;
        this.lDist = [];
        this.getBarDistribution(lLoop1, lLoop2, this.lDist);

        for (let i = 0; i < lTotBars; i++) {
          if (this.lDist[i] == 1) {
            lStartX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
            lStartY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
            lEndY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia2,
              lBPCRev,
              1
            );
          } else {
            lStartX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
            lStartY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
            lEndY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia1,
              lBPCRev,
              1
            );
          }
        }
      } else if (lArrange == 'Side-By-Side') {
        var lLoop1 = Math.floor(parseInt(lBarCTs[0]) / 2);
        var lLoop2 = Math.floor(parseInt(lBarCTs[1]) / 2);
        var lTotBars = lLoop1 + lLoop2;

        this.lDist= [];
        this.getBarDistribution(lLoop1, lLoop2, this.lDist);

        for (let i = 0; i < lTotBars; i++) {
          if (this.lDist[i] == 1) {
            lStartX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia2,
              lBPCRev,
              1
            );

            lStartX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia2,
              lBPCRev,
              1
            );
          } else {
            lStartX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lStartY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lEndY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars - lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia1,
              lBPCRev,
              1
            );

            lStartX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lStartY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia *
                Math.sin(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lEndY =
              (lMainBarLocDia *
                Math.cos(
                  (2 * Math.PI * i) / lTotBars + lMainBarDia1 / lMainBarLocDia
                )) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia1,
              lBPCRev,
              1
            );
          }
        }
      } else if (lArrange == 'In-Out') {
        var lLoop1 = Math.floor(parseInt(lBarCTs[0]));
        var lLoop2 = Math.floor(parseInt(lBarCTs[1]));

        if (lLoop1 == lLoop2) {
          for (let i = 0; i < lLoop1; i++) {
            lStartX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lLoop1)) / 20;
            lStartY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lLoop1)) / 20;
            lStartZ = lcageLength / 40;
            lEndX =
              (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lLoop1)) / 20;
            lEndY =
              (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lLoop1)) / 20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia1,
              lBPCRev,
              1
            );

            lStartX =
              ((lMainBarLocDia - lMainBarDia1 - lMainBarDia2) *
                Math.sin((2 * Math.PI * i) / lLoop1)) /
              20;
            lStartY =
              ((lMainBarLocDia - lMainBarDia1 - lMainBarDia2) *
                Math.cos((2 * Math.PI * i) / lLoop1)) /
              20;
            lStartZ = lcageLength / 40;
            lEndX =
              ((lMainBarLocDia - lMainBarDia1 - lMainBarDia2) *
                Math.sin((2 * Math.PI * i) / lLoop1)) /
              20;
            lEndY =
              ((lMainBarLocDia - lMainBarDia1 - lMainBarDia2) *
                Math.cos((2 * Math.PI * i) / lLoop1)) /
              20;
            lEndZ = 0 - lcageLength / 40;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia2,
              lBPCRev,
              1
            );
          }
        } else {
          lLoop1 = Math.floor(parseInt(lBarCTs[0]) / 2);
          lLoop2 = Math.floor(parseInt(lBarCTs[1]) / 2);
          var lTotBars = lLoop1 + lLoop2;

          this.lDist= [];
          this.getBarDistribution(lLoop1, lLoop2, this.lDist);

          for (let i = 0; i < lTotBars; i++) {
            if (this.lDist[i] == 1) {
              lStartX =
                (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
              lStartY =
                (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
              lStartZ = lcageLength / 40;
              lEndX =
                (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
              lEndY =
                (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
              lEndZ = 0 - lcageLength / 40;

              this.BPCSTAddMainBar(
                this.scene,
                lStartX,
                lStartY,
                lStartZ,
                lEndX,
                lEndY,
                lEndZ,
                lMainBarDia2,
                lBPCRev,
                1
              );

              lStartX =
                ((lMainBarLocDia - 2 * lMainBarDia2) *
                  Math.sin((2 * Math.PI * i) / lTotBars)) /
                20;
              lStartY =
                ((lMainBarLocDia - 2 * lMainBarDia2) *
                  Math.cos((2 * Math.PI * i) / lTotBars)) /
                20;
              lStartZ = lcageLength / 40;
              lEndX =
                ((lMainBarLocDia - 2 * lMainBarDia2) *
                  Math.sin((2 * Math.PI * i) / lTotBars)) /
                20;
              lEndY =
                ((lMainBarLocDia - 2 * lMainBarDia2) *
                  Math.cos((2 * Math.PI * i) / lTotBars)) /
                20;
              lEndZ = 0 - lcageLength / 40;

              this.BPCSTAddMainBar(
                this.scene,
                lStartX,
                lStartY,
                lStartZ,
                lEndX,
                lEndY,
                lEndZ,
                lMainBarDia2,
                lBPCRev,
                1
              );
            } else {
              lStartX =
                (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
              lStartY =
                (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
              lStartZ = lcageLength / 40;
              lEndX =
                (lMainBarLocDia * Math.sin((2 * Math.PI * i) / lTotBars)) / 20;
              lEndY =
                (lMainBarLocDia * Math.cos((2 * Math.PI * i) / lTotBars)) / 20;
              lEndZ = 0 - lcageLength / 40;

              this.BPCSTAddMainBar(
                this.scene,
                lStartX,
                lStartY,
                lStartZ,
                lEndX,
                lEndY,
                lEndZ,
                lMainBarDia1,
                lBPCRev,
                1
              );

              lStartX =
                ((lMainBarLocDia - 2 * lMainBarDia1) *
                  Math.sin((2 * Math.PI * i) / lTotBars)) /
                20;
              lStartY =
                ((lMainBarLocDia - 2 * lMainBarDia1) *
                  Math.cos((2 * Math.PI * i) / lTotBars)) /
                20;
              lStartZ = lcageLength / 40;
              lEndX =
                ((lMainBarLocDia - 2 * lMainBarDia1) *
                  Math.sin((2 * Math.PI * i) / lTotBars)) /
                20;
              lEndY =
                ((lMainBarLocDia - 2 * lMainBarDia1) *
                  Math.cos((2 * Math.PI * i) / lTotBars)) /
                20;
              lEndZ = 0 - lcageLength / 40;

              this.BPCSTAddMainBar(
                this.scene,
                lStartX,
                lStartY,
                lStartZ,
                lEndX,
                lEndY,
                lEndZ,
                lMainBarDia1,
                lBPCRev,
                1
              );
            }
          }
        }
      }
    }
    // Bar Type Single, Mixed

    if (lLayer == 'Double-Layer') {
      //Double Layer
      var lSRDia = parseInt(lBPCRev.sr_dia);
      var lMainBarLocL2 = parseInt(lBPCRev.mainbar_location_2layer);
      var lMainBarLenL2 = parseInt(lBPCRev.mainbar_length_2layer);

      var lMainBarDiaArr =
        lMainBarDia!.toString().indexOf(',') != -1
          ? lMainBarDia.split(',')
          : lMainBarDia;
      var lMainBarDia1 = parseInt(lMainBarDiaArr[0]);
      var lMainBarDia2 = parseInt(lMainBarDiaArr[1]);

      var lBarCTs = lCT!.toString().indexOf(',') != -1 ? lCT.split(',') : lCT;
      var lLoop1 = parseInt(lBarCTs[0]);
      var lLoop2 = parseInt(lBarCTs[1]);

      if (lLoop2 > 0) {
        if (lArrange == 'Side-By-Side') {
          var lLoop = Math.floor(lLoop2 / 2);
          for (let i = 0; i < lLoop; i++) {
            lStartX =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.sin(
                  (2 * Math.PI * i) / lLoop - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartY =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.cos(
                  (2 * Math.PI * i) / lLoop - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartZ = (lcageLength / 2 - lMainBarLocL2) / 20;
            lEndX =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.sin(
                  (2 * Math.PI * i) / lLoop - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndY =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.cos(
                  (2 * Math.PI * i) / lLoop - lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndZ = (lcageLength / 2 - lMainBarLocL2 - lMainBarLenL2) / 20;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia2,
              lBPCRev,
              2
            );

            lStartX =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.sin(
                  (2 * Math.PI * i) / lLoop + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartY =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.cos(
                  (2 * Math.PI * i) / lLoop + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lStartZ = (lcageLength / 2 - lMainBarLocL2) / 20;
            lEndX =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.sin(
                  (2 * Math.PI * i) / lLoop + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndY =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.cos(
                  (2 * Math.PI * i) / lLoop + lMainBarDia2 / lMainBarLocDia
                )) /
              20;
            lEndZ = (lcageLength / 2 - lMainBarLocL2 - lMainBarLenL2) / 20;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia2,
              lBPCRev,
              2
            );
          }
        } else {
          for (let i = 0; i < lLoop2; i++) {
            lStartX =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.sin((2 * Math.PI * i) / lLoop2)) /
              20;
            lStartY =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.cos((2 * Math.PI * i) / lLoop2)) /
              20;
            lStartZ = (lcageLength / 2 - lMainBarLocL2) / 20;
            lEndX =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.sin((2 * Math.PI * i) / lLoop2)) /
              20;
            lEndY =
              ((lMainBarLocDia - lMainBarDia1 - lSRDia - lMainBarDia2) *
                Math.cos((2 * Math.PI * i) / lLoop2)) /
              20;
            lEndZ = (lcageLength / 2 - lMainBarLocL2 - lMainBarLenL2) / 20;

            this.BPCSTAddMainBar(
              this.scene,
              lStartX,
              lStartY,
              lStartZ,
              lEndX,
              lEndY,
              lEndZ,
              lMainBarDia2,
              lBPCRev,
              2
            );
          }
        }
      }
    }
  }

  BPCSTAddMainBar(
    ScrScene: THREE.Scene,
    startX: any,
    startY: any,
    startZ: any,
    endX: any,
    endY: any,
    endZ: any,
    mainDia: any,
    pItem: any,
    pLayer: any
  ) {
    //var lBPCRec = grid.getDataItem(pRowNo);
    var lBPCRec = pItem;
    var lMainBarShape = '';
    var lCrankHeightTop = 0;
    var lCrankHeightEnd = 0;
    var lCrank2HeightTop = 0;
    var lCrank2HeightEnd = 0;

    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;
    var lSteps = 1;
    var lSegs = 1;

    if (lBPCRec.lap_length != null) {
      lLapLengthReal = parseInt(lBPCRec.lap_length);
    }
    if (lBPCRec.end_length != null) {
      lEndLengthReal = parseInt(lBPCRec.end_length);
    }
    if (lBPCRec.cage_length != null) {
      lCageLength = parseInt(lBPCRec.cage_length);
    }

    if (lBPCRec.main_bar_shape != null) {
      lMainBarShape = lBPCRec.main_bar_shape;
    }

    if (lBPCRec.crank_height_top != null) {
      lCrankHeightTop = parseInt(lBPCRec.crank_height_top);
    }

    if (lBPCRec.crank_height_end != null) {
      lCrankHeightEnd = parseInt(lBPCRec.crank_height_end);
    }

    if (lBPCRec.crank2_height_top != null) {
      lCrank2HeightTop = parseInt(lBPCRec.crank2_height_top);
    }

    if (lBPCRec.crank2_height_end != null) {
      lCrank2HeightEnd = parseInt(lBPCRec.crank2_height_end);
    }

    var lCouplerTop = lBPCRec.coupler_top;
    var lCouplerEnd = lBPCRec.coupler_end;

    var circleRadius = mainDia / 20;
    var circleShape = new THREE.Shape();
    circleShape.moveTo(0, circleRadius);
    circleShape.quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0);
    circleShape.quadraticCurveTo(circleRadius, -circleRadius, 0, -circleRadius);
    circleShape.quadraticCurveTo(
      -circleRadius,
      -circleRadius,
      -circleRadius,
      0
    );
    circleShape.quadraticCurveTo(-circleRadius, circleRadius, 0, circleRadius);

    var randomPoints = [];

    // Set coupler
    if (
      (lMainBarShape == 'Straight' || lMainBarShape == 'Crank-End') &&
      pLayer == 1
    ) {
      if (
        lCouplerTop == 'Nsplice-Standard-Coupler' ||
        lCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        var lCP2 = new THREE.CylinderGeometry(
          mainDia / 20,
          mainDia / 20,
          4,
          32
        );

        var lScrewMaterial2 = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0,
          metalness: 1.0,
          opacity: 0,
        });
        //lScrewMaterial2.transparent = true;

        var lCPObj2 = new THREE.Mesh(lCP2, lScrewMaterial2);

        lCPObj2.translateX(startX);
        lCPObj2.translateY(startY);
        lCPObj2.translateZ(startZ);

        lCPObj2.rotateX(Math.PI / 2);
        lCPObj2.rotateY(Math.PI / 2);

        this.scene.add(lCPObj2);

        var lCP1 = new THREE.CylinderGeometry(
          (mainDia + 20) / 20,
          (mainDia + 20) / 20,
          4,
          32
        );

        //sObjectMaterial.depthWrite = false;
        var lCPObj = new THREE.Mesh(lCP1, this.sObjectMaterial);

        lCPObj.translateX(startX);
        lCPObj.translateY(startY);
        lCPObj.translateZ(startZ);

        lCPObj.rotateX(Math.PI / 2);
        lCPObj.rotateY(Math.PI / 2);

        this.scene.add(lCPObj);
      } else if (
        lCouplerTop == 'Nsplice-Standard-Stud' ||
        lCouplerTop == 'Esplice-Standard-Stud'
      ) {
        var lScrewPath: any = new THREE.CurvePath();
        //getScrewPath(pDia, pNum, pSpacing, pX, pY, pZ)
        lScrewPath.add(
          this.getScrewPath(mainDia - 1, 10, 3, startX, startY, startZ)
        );

        var lScrewMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1.0,
          metalness: 0.0,
          emissive: 0xffffff,
        });
        lScrewMaterial.transparent = true;
        //lScrewMaterial.depthWrite = false;
        var lScrewGeometry = new THREE.TubeGeometry(lScrewPath, 100, 0.4, 3);

        var lScrewMesh = new THREE.Mesh(lScrewGeometry, lScrewMaterial);
        this.scene.add(lScrewMesh);
      } else if (lCouplerTop == 'Nsplice-Extended-Coupler') {
        var lCP1 = new THREE.CylinderGeometry(
          (mainDia + 20) / 20,
          (mainDia + 20) / 20,
          6,
          32
        );

        //sObjectMaterial.depthWrite = false;
        var lCPObj = new THREE.Mesh(lCP1, this.sObjectMaterial);

        lCPObj.translateX(startX);
        lCPObj.translateY(startY);
        lCPObj.translateZ(startZ - 3.2);

        lCPObj.rotateX(Math.PI / 2);
        lCPObj.rotateY(Math.PI / 2);

        this.scene.add(lCPObj);
      } else if (lCouplerTop == 'Esplice-Extended-Coupler') {
        var lCP2 = new THREE.CylinderGeometry(
          mainDia / 20,
          mainDia / 20,
          8,
          32
        );

        var lScrewMaterial2 = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0,
          metalness: 1.0,
          opacity: 0,
        });
        //lScrewMaterial2.transparent = true;

        var lCPObj2 = new THREE.Mesh(lCP2, lScrewMaterial2);

        lCPObj2.translateX(startX);
        lCPObj2.translateY(startY);
        lCPObj2.translateZ(startZ);

        lCPObj2.rotateX(Math.PI / 2);
        lCPObj2.rotateY(Math.PI / 2);

        this.scene.add(lCPObj2);

        var lCP1 = new THREE.CylinderGeometry(
          (mainDia + 20) / 20,
          (mainDia + 20) / 20,
          8,
          32
        );

        //sObjectMaterial.depthWrite = false;
        var lCPObj = new THREE.Mesh(lCP1, this.sObjectMaterial);

        lCPObj.translateX(startX);
        lCPObj.translateY(startY);
        lCPObj.translateZ(startZ);

        lCPObj.rotateX(Math.PI / 2);
        lCPObj.rotateY(Math.PI / 2);

        this.scene.add(lCPObj);
      } else if (
        lCouplerTop == 'Nsplice-Extended-Stud' ||
        lCouplerTop == 'Esplice-Extended-Stud'
      ) {
        var lScrewPath: any = new THREE.CurvePath();
        //getScrewPath(pDia, pNum, pSpacing, pX, pY, pZ)
        lScrewPath.add(
          this.getScrewPath(mainDia - 1, 20, 3, startX, startY, startZ)
        );

        var lScrewMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1.0,
          metalness: 0.0,
          emissive: 0xffffff,
        });
        lScrewMaterial.transparent = true;
        //lScrewMaterial.depthWrite = false;
        var lScrewGeometry = new THREE.TubeGeometry(lScrewPath, 200, 0.4, 3);

        var lScrewMesh = new THREE.Mesh(lScrewGeometry, lScrewMaterial);
        this.scene.add(lScrewMesh);
      }
    }

    if (
      (lMainBarShape == 'Straight' ||
        lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank') &&
      pLayer == 1
    ) {
      if (
        lCouplerEnd == 'Nsplice-Standard-Coupler' ||
        lCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        var lCP2 = new THREE.CylinderGeometry(
          mainDia / 20,
          mainDia / 20,
          4,
          32
        );

        var lScrewMaterial2 = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0,
          metalness: 1.0,
          opacity: 0,
          emissive: 0xffffff,
        });
        //lScrewMaterial2.transparent = true;

        var lCPObj2 = new THREE.Mesh(lCP2, lScrewMaterial2);

        lCPObj2.translateX(endX);
        lCPObj2.translateY(endY);
        lCPObj2.translateZ(endZ + 2);

        lCPObj2.rotateX(Math.PI / 2);
        lCPObj2.rotateY(Math.PI / 2);

        this.scene.add(lCPObj2);

        var lCP1 = new THREE.CylinderGeometry(
          (mainDia + 20) / 20,
          (mainDia + 20) / 20,
          4,
          32
        );

        //sObjectMaterial.depthWrite = false;
        var lCPObj = new THREE.Mesh(lCP1, this.sObjectMaterial);

        lCPObj.translateX(endX);
        lCPObj.translateY(endY);
        lCPObj.translateZ(endZ + 2);

        lCPObj.rotateX(Math.PI / 2);
        lCPObj.rotateY(Math.PI / 2);

        this.scene.add(lCPObj);
      } else if (
        lCouplerEnd == 'Nsplice-Standard-Stud' ||
        lCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        var lScrewPath: any = new THREE.CurvePath();
        //getScrewPath(pDia, pNum, pSpacing, pX, pY, pZ)
        lScrewPath.add(
          this.getScrewPath(mainDia - 1, 10, 3, endX, endY, endZ + 30 / 20)
        );

        var lScrewMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1.0,
          metalness: 0.0,
          emissive: 0xffffff,
        });
        lScrewMaterial.transparent = true;
        //lScrewMaterial.depthWrite = false;
        var lScrewGeometry = new THREE.TubeGeometry(lScrewPath, 100, 0.4, 3);

        var lScrewMesh = new THREE.Mesh(lScrewGeometry, lScrewMaterial);
        this.scene.add(lScrewMesh);
      } else if (lCouplerEnd == 'Nsplice-Extended-Coupler') {
        var lCP1 = new THREE.CylinderGeometry(
          (mainDia + 20) / 20,
          (mainDia + 20) / 20,
          6,
          32
        );

        //sObjectMaterial.depthWrite = false;
        var lCPObj = new THREE.Mesh(lCP1, this.sObjectMaterial);

        lCPObj.translateX(endX);
        lCPObj.translateY(endY);
        lCPObj.translateZ(endZ + 3.2);

        lCPObj.rotateX(Math.PI / 2);
        lCPObj.rotateY(Math.PI / 2);

        this.scene.add(lCPObj);
      } else if (lCouplerEnd == 'Esplice-Extended-Coupler') {
        var lCP2 = new THREE.CylinderGeometry(
          mainDia / 20,
          mainDia / 20,
          8,
          32
        );

        var lScrewMaterial2 = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0,
          metalness: 1.0,
          opacity: 0,
          emissive: 0xffffff,
        });
        //lScrewMaterial2.transparent = true;

        var lCPObj2 = new THREE.Mesh(lCP2, lScrewMaterial2);

        lCPObj2.translateX(endX);
        lCPObj2.translateY(endY);
        lCPObj2.translateZ(endZ + 4);

        lCPObj2.rotateX(Math.PI / 2);
        lCPObj2.rotateY(Math.PI / 2);

        this.scene.add(lCPObj2);

        var lCP1 = new THREE.CylinderGeometry(
          (mainDia + 20) / 20,
          (mainDia + 20) / 20,
          8,
          32
        );

        //sObjectMaterial.depthWrite = false;
        var lCPObj = new THREE.Mesh(lCP1, this.sObjectMaterial);

        lCPObj.translateX(endX);
        lCPObj.translateY(endY);
        lCPObj.translateZ(endZ + 4);

        lCPObj.rotateX(Math.PI / 2);
        lCPObj.rotateY(Math.PI / 2);

        this.scene.add(lCPObj);
      } else if (
        lCouplerEnd == 'Nsplice-Extended-Stud' ||
        lCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        var lScrewPath: any = new THREE.CurvePath();
        //getScrewPath(pDia, pNum, pSpacing, pX, pY, pZ)
        lScrewPath.add(
          this.getScrewPath(mainDia - 1, 20, 3, endX, endY, endZ + 60 / 20)
        );

        var lScrewMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1.0,
          metalness: 0.0,
          emissive: 0xffffff,
        });
        lScrewMaterial.transparent = true;
        //lScrewMaterial.depthWrite = false;
        var lScrewGeometry = new THREE.TubeGeometry(lScrewPath, 200, 0.4, 3);

        var lScrewMesh = new THREE.Mesh(lScrewGeometry, lScrewMaterial);
        this.scene.add(lScrewMesh);
      }
    }
    if (
      (lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank' ||
        lMainBarShape == 'Crank-Both') &&
      pLayer == 1
    ) {
      var lStartX =
        startX - (lCrankHeightTop * Math.cos(Math.atan2(startY, startX))) / 20;
      var lStartY =
        startY - (lCrankHeightTop * Math.sin(Math.atan2(startY, startX))) / 20;
      var lStartZ = startZ;

      if (isNaN(lStartX)) {
        lStartX = 0;
      }
      if (isNaN(lStartY)) {
        lStartY = 0;
      }
      if (isNaN(lStartZ)) {
        lStartZ = 0;
      }

      if (isNaN(startX)) {
        startX = 0;
      }
      if (isNaN(startY)) {
        startY = 0;
      }
      if (isNaN(startZ)) {
        startZ = 0;
      }
      //First Seg
      randomPoints = [];
      console.log('randomPoints=>', lStartX, lStartY, lStartZ);
      randomPoints.push(new THREE.Vector3(lStartX, lStartY, lStartZ));
      randomPoints.push(
        new THREE.Vector3(lStartX, lStartY, lStartZ - lLapLengthReal / 20)
      );
      var randomSpline1 = new THREE.CatmullRomCurve3(
        randomPoints,
        false,
        'catmullrom',
        0.001
      );

      var extrudeSettings1 = {
        curveSegments: 12,
        steps: lSteps,
        bevelEnabled: false,
        extrudePath: randomSpline1,
        amount: 1,
      };
      console.log(
        'extrudeSettings1=>',
        circleShape,
        extrudeSettings1,
        randomSpline1
      );
      var geometry1 = new THREE.ExtrudeGeometry(circleShape, extrudeSettings1);

      var mesh1 = new THREE.Mesh(geometry1, this.sObjectMaterial);
      this.scene.add(mesh1);

      //2nd Seg
      randomPoints = [];
      randomPoints.push(
        new THREE.Vector3(lStartX, lStartY, lStartZ - lLapLengthReal / 20)
      );
      randomPoints.push(
        new THREE.Vector3(
          startX,
          startY,
          startZ - lLapLengthReal / 20 - (mainDia * 10) / 20
        )
      );
      var randomSpline2 = new THREE.CatmullRomCurve3(
        randomPoints,
        false,
        'catmullrom',
        0.001
      );

      var extrudeSettings2 = {
        curveSegments: 12,
        steps: lSteps,
        bevelEnabled: false,
        extrudePath: randomSpline2,
        amount: 1,
      };
      var geometry2 = new THREE.ExtrudeGeometry(circleShape, extrudeSettings2);

      var mesh2 = new THREE.Mesh(geometry2, this.sObjectMaterial);
      this.scene.add(mesh2);

      randomPoints = [];
      //randomPoints.push(new THREE.Vector3(lStartX, lStartY, lStartZ));
      //randomPoints.push(new THREE.Vector3(lStartX, lStartY, lStartZ - lLapLengthReal / 20 ));
      randomPoints.push(
        new THREE.Vector3(
          startX,
          startY,
          startZ - lLapLengthReal / 20 - (mainDia * 10) / 20
        )
      );
      //lSegs = lSegs + 2
    } else {
      randomPoints.push(new THREE.Vector3(startX, startY, startZ));
    }

    if (
      (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') &&
      pLayer == 1
    ) {
      var lEndX =
        endX - (lCrankHeightEnd * Math.cos(Math.atan2(endY, endX))) / 20;
      var lEndY =
        endY - (lCrankHeightEnd * Math.sin(Math.atan2(endY, endX))) / 20;
      var lEndZ = endZ;
      if (isNaN(lEndX)) {
        lEndX = 0;
      }
      if (isNaN(lEndY)) {
        lEndY = 0;
      }
      if (isNaN(lEndZ)) {
        lEndZ = 0;
      }

      if (isNaN(endX)) {
        endX = 0;
      }
      if (isNaN(endY)) {
        endY = 0;
      }
      if (isNaN(endZ)) {
        endZ = 0;
      }

      randomPoints.push(
        new THREE.Vector3(
          endX,
          endY,
          endZ + lEndLengthReal / 20 + (mainDia * 10) / 20
        )
      );
      randomPoints.push(
        new THREE.Vector3(lEndX, lEndY, lEndZ + lEndLengthReal / 20)
      );
      randomPoints.push(new THREE.Vector3(lEndX, lEndY, lEndZ));
      lSegs = lSegs + 2;
    } else {
      if (isNaN(endX)) {
        endX = 0;
      }
      if (isNaN(endY)) {
        endY = 0;
      }
      if (isNaN(endZ)) {
        endZ = 0;
      }
      randomPoints.push(new THREE.Vector3(endX, endY, endZ));
    }

    if (lSegs == 1) {
      lSteps = 1;
    } else {
      lSteps = 100;
      //lSteps = lSegs;
    }

    var randomSpline = new THREE.CatmullRomCurve3(
      randomPoints,
      false,
      'catmullrom',
      0.001
    );

    var extrudeSettings = {
      curveSegments: 12,
      steps: lSteps,
      bevelEnabled: false,
      extrudePath: randomSpline,
      amount: 1,
    };
    console.log('push=>', randomPoints);
    console.log('Bored pile cage=>', circleShape, extrudeSettings);
    var geometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);

    //sObjectMaterial.depthWrite = false;
    var mesh = new THREE.Mesh(geometry, this.sObjectMaterial);

    this.scene.add(mesh);
  }

  BPCAddMainBar(
    ScrScene: THREE.Scene,
    startX: any,
    startY: any,
    startZ: any,
    endX: any,
    endY: any,
    endZ: any,
    mainDia: any
  ) {
    var circleRadius = mainDia / 20;
    var circleShape = new THREE.Shape();
    circleShape.moveTo(0, circleRadius);
    circleShape.quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0);
    circleShape.quadraticCurveTo(circleRadius, -circleRadius, 0, -circleRadius);
    circleShape.quadraticCurveTo(
      -circleRadius,
      -circleRadius,
      -circleRadius,
      0
    );
    circleShape.quadraticCurveTo(-circleRadius, circleRadius, 0, circleRadius);

    var randomPoints = [];

    randomPoints.push(new THREE.Vector3(startX, startY, startZ));
    randomPoints.push(new THREE.Vector3(endX, endY, endZ));

    var randomSpline = new THREE.CatmullRomCurve3(
      randomPoints,
      false,
      'catmullrom',
      0.01
    );

    //

    var extrudeSettings = {
      steps: 1,
      bevelEnabled: false,
      extrudePath: randomSpline,
    };

    var geometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);

    var mesh = new THREE.Mesh(geometry, this.sObjectMaterial);

    this.scene.add(mesh);
  }

  getScrewPath(pDia: any, pNum: any, pSpacing: any, pX: any, pY: any, pZ: any) {
    var lCurvePath = new THREE.CurvePath();
    // var helix = new THREE.Curve();
    var helix = new CustomCurve();
    helix.getPoint = (t: any) => {
      var s = t * 2 * Math.PI * pNum;
      // As t ranges from 0 to 1, s ranges from -6*PI to 6*PI
      return new THREE.Vector3(
        pX + (pDia * Math.cos(s)) / 20,
        pY + (pDia * Math.sin(s)) / 20,
        pZ - (s * pSpacing) / 20 / 2 / Math.PI
      );
    };
    lCurvePath.add(helix);
    return lCurvePath;
  }
  getSpiralPath(pDia: any, pStart: any, pNum: any, pSpacing: any) {
    var lCurvePath = new THREE.CurvePath();
    // var helix = new THREE.Curve();
    var helix = new CustomCurve();
    helix.getPoint = function (t: any) {
      var s = t * 2 * Math.PI * pNum;
      // As t ranges from 0 to 1, s ranges from -6*PI to 6*PI
      return new THREE.Vector3(
        (pDia * Math.cos(s)) / 20,
        (pDia * Math.sin(s)) / 20,
        pStart / 20 + (s * pSpacing) / 20 / 2 / Math.PI
      );
    };
    lCurvePath.add(helix);
    return lCurvePath;
  }

  getSpiralPathVary(
    pDiaFrom: any,
    pDiaTo: any,
    pStart: any,
    pNum: any,
    pSpacing: any
  ) {
    var lCurvePath = new THREE.CurvePath();
    // var helix = new THREE.Curve();
    var helix = new CustomCurve();
    helix.getPoint = function (t: any) {
      var s = t * 2 * Math.PI * pNum;
      // As t ranges from 0 to 1, s ranges from -6*PI to 6*PI
      return new THREE.Vector3(
        ((pDiaFrom + (pDiaTo - pDiaFrom) * t) * Math.cos(s)) / 20,
        ((pDiaFrom + (pDiaTo - pDiaFrom) * t) * Math.sin(s)) / 20,
        pStart / 20 + (s * pSpacing) / 20 / 2 / Math.PI
      );
    };
    lCurvePath.add(helix);
    return lCurvePath;
  }

  animate() {
    // requestAnimationFrame(this.animate);
    if(this.controls){
      this.controls.update();
    }
    this.renderer.render(this.scene, this.camera);
  }

  libSave() {
    let lRowNo = this.templateGrid.slickGrid.getSelectedRows()[0];
    console.log('libsave=>', lRowNo);
    // alert(lRowNo);
    //debugger;
    if (lRowNo >= 0 && this.gLibChanged > 0) {
      if (this.isBPCEditable == true) {
        if (this.SaveLibData(lRowNo) == true) {
          // alert("The library data has been saved successfully.");
        }
      } else {
        alert(
          'Please check your data amendment right. If have, please turn on the <Edit Library> option.'
        );
      }
    } else {
      alert('No changed made.');
    }

    this.gGridClearStart = 0;
  }
  libPrint() {
    console.log('Test Data');
    let lRowNo = this.templateGrid.slickGrid.getSelectedRows()[0];

    if (lRowNo >= 0) {
      if (this.isBPCEditable == true) {
        if (this.SaveLibData(lRowNo) == false) {
          alert(
            'Cannot print the BPC library item as failed to save order detail data (因无法存储订单明细,打印订单失败).'
          );
          return;
        }
      }
      let lCustomerCode = this.customerCode;
      let lProjectCode = this.projectCode;
      let lTemplate = true;

      let lJobID = this.templateGrid.slickGrid.getDataItem(lRowNo).JobID;

      let lPONumber = lJobID;
      // this.startLoading();
      let obj = {
        CustomerCode: lCustomerCode,
        ProjectCode: lProjectCode,
        Template: lTemplate,
        JobID: lJobID,
      };
      this.orderService.printLib_bpc(obj).subscribe((response: any) => {
        // this.stopLoading();
        // var lHeight = 900;
        // if (lHeight > $(window).height() - 100) {
        //     lHeight = $(window).height() - 100;
        // }
        // var lWidth = 1200;
        // if (lWidth > $(window).width() - 30) {
        //     lWidth = $(window).width() - 30;
        // }

        // var lStyle = "<div>";
        // var lCopy = lStyle + "<div class='ibox-content'><iframe id='iframePDFViewer' type='application/pdf' title='Drawings' width='" + (lWidth - 30) + "' height='" + (lHeight - 150) + "' runat='server'></iframe></div>" +
        //       "</div>";
        // document.getElementById("iframePDFViewer").src = response.Base64;
        var filename = 'BPC_' + lPONumber + '.pdf';
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        console.log('response=>', response);
      });
    }
  }
  libCopy() {
    if (this.projectCode) {
      const modalRef = this.modalService.open(CopyGridDataModalComponent, {
        size: 'lg', // 'lg' stands for large, adjust as needed
        centered: true, // Optional: Center the modal
      });
      modalRef.result.then(
        (result: any) => {
          console.log('libCopy=>', result);
          this.copyLibStart(result);
        },
        (reason) => {
          console.log(reason);
        }
      );
    }
  }
  copyLibStart(result: any) {
    result.DesCustomerCode = this.customerCode;
    result.DesProjectCode = this.projectCode;
    this.orderService.copyBPCLibrary_bpc(result).subscribe((response: any) => {
      this.reloadTemplateBPC('ALL', '');
      alert(
        'The selected BPC Library items have been copied sucessfully. (已成功复制完毕.)'
      );
    });
  }
  libConfig() {
    if (this.customerCode) {
      const modalRef = this.modalService.open(SpiralDialogComponent);
      modalRef.componentInstance.customerCode = this.customerCode;
      modalRef.componentInstance.projectCode = this.projectCode;
      let obj = {
        CustomerCode: this.customerCode,
        ProjectCode: this.projectCode,
      };
      this.orderService.getBPCConfig_bpc(obj).subscribe((response: any) => {
        modalRef.componentInstance.isWrapping = response;
      });
    } else {
      alert('Please select customer and project.');
    }
  }
  advanceOptions(pRowNo: any) {
    const lBPCRec = this.templateGrid.slickGrid.getDataItem(pRowNo);
    console.log(
      'lBPCRec=>',
      lBPCRec,
      this.templateGrid.slickGrid.getDataItem(pRowNo),
      pRowNo
    );
    if (this.customerCode) {
      const modalRef = this.modalService.open(AdvanceOptionDialogComponent, {
        size: 'xl', // 'lg' stands for large, adjust as needed
        centered: true, // Optional: Center the modal
      });
      modalRef.componentInstance.lBPCRec = lBPCRec;
      modalRef.result.then(
        (result: any) => {
          console.log('result=>', result);
          if (result != 'Data') {
            if (lBPCRec.copyfrom_project == '0000000000') {
              alert(
                'Apply the advance change is not allowed if it is copied from Common Bored Pile Cage Library.'
              );
              return;
            }
            if (
              this.isBPCEditable != true &&
              this.customerCode != '0000000000'
            ) {
              alert('Cannot change the cage advance setting.');
              return;
            }
            if (
              confirm(
                'It is going to apply the advance options to the BPC item. Please confirm?'
              )
            ) {
              if (
                lBPCRec.spiral_link_type == '2 Spacing' ||
                lBPCRec.spiral_link_type == 'Twin 2 Spacing' ||
                lBPCRec.spiral_link_type == 'Single-Twin' ||
                lBPCRec.spiral_link_type == 'Twin-Single'
              ) {
                if (
                  isNaN(result.sl1_length) ||
                  parseInt(result.sl1_length) <= 0
                ) {
                  alert('Invalid value in first spiral length.');
                  return;
                }
                if (
                  isNaN(result.sl2_length) ||
                  parseInt(result.sl2_length) <= 0
                ) {
                  alert('Invalid value in second spiral length.');
                  return;
                }
                var lLapLen = parseInt(lBPCRec.lap_length);
                var lEndLen = parseInt(lBPCRec.end_length);
                if (lLapLen < 700) {
                  lLapLen = 700;
                }
                if (lEndLen < 500) {
                  lEndLen = 500;
                }
                if (
                  parseInt(result.sl1_length) +
                    parseInt(result.sl2_length) +
                    lLapLen +
                    lEndLen !=
                  parseInt(lBPCRec.cage_length)
                ) {
                  alert(
                    'Invalid Spiral Length, the Spiral Link 1(' +
                      result.sl1_length +
                      ') + Spiral Link2 (' +
                      result.sl2_length +
                      ') + Lap Length (' +
                      lLapLen +
                      ') + End Langth(' +
                      lEndLen +
                      ') should be equal to Cage Length(' +
                      lBPCRec.cage_length +
                      ').'
                  );
                  return;
                }
                lBPCRec.sl1_length = result.sl1_length;
                lBPCRec.sl2_length = result.sl2_length;
                lBPCRec.spiral_link_dia = result.sl1_dia;
                lBPCRec.sl1_dia = result.sl1_dia;
                lBPCRec.sl2_dia = result.sl2_dia;
              }

              if (
                lBPCRec.spiral_link_type == '3 Spacing' ||
                lBPCRec.spiral_link_type == 'Twin 3 Spacing'
              ) {
                if (
                  isNaN(result.sl1_length) ||
                  parseInt(result.sl1_length) <= 0
                ) {
                  alert('Invalid value in first spiral length.');
                  return;
                }
                if (
                  isNaN(result.sl2_length) ||
                  parseInt(result.sl2_length) <= 0
                ) {
                  alert('Invalid value in second spiral length.');
                  return;
                }
                if (
                  isNaN(result.sl3_length) ||
                  parseInt(result.sl3_length) <= 0
                ) {
                  alert('Invalid value in third spiral length.');
                  return;
                }
                var lLapLen = parseInt(lBPCRec.lap_length);
                var lEndLen = parseInt(lBPCRec.end_length);
                if (lLapLen < 700) {
                  lLapLen = 700;
                }
                if (lEndLen < 500) {
                  lEndLen = 500;
                }
                if (
                  parseInt(result.sl1_length) +
                    parseInt(result.sl2_length) +
                    parseInt(result.sl3_length) +
                    lLapLen +
                    lEndLen !=
                  parseInt(lBPCRec.cage_length)
                ) {
                  alert(
                    'Invalid Spiral Length, the Spiral Link 1(' +
                      result.sl1_length +
                      ') + Spiral Link2 (' +
                      result.sl2_length +
                      ') + Spiral Link3 (' +
                      result.sl3_length +
                      ') + Lap Length (' +
                      lLapLen +
                      ') + End Langth(' +
                      lEndLen +
                      ') should be equal to Cage Length(' +
                      lBPCRec.cage_length +
                      ').'
                  );
                  return;
                }
                lBPCRec.sl1_length = result.sl1_length;
                lBPCRec.sl2_length = result.sl2_length;
                lBPCRec.sl3_length = result.sl3_length;
                lBPCRec.spiral_link_dia = result.sl1_dia;
                lBPCRec.sl1_dia = result.sl1_dia;
                lBPCRec.sl2_dia = result.sl2_dia;
                lBPCRec.sl3_dia = result.sl3_dia;
              }

              if (
                isNaN(result.no_of_sr) ||
                parseInt(result.no_of_sr) <= 0 ||
                parseInt(result.no_of_sr) > 5
              ) {
                alert('Invalid No of Stiffener Rings');
                return;
              }

              if (
                parseInt(lBPCRec.cage_length) >= 7000 &&
                parseInt(result.no_of_sr) < 3
              ) {
                alert(
                  'Invalid No of Stiffener Rings. it should have at least 3 Stiffener Rings for 7 meter or longer cage. '
                );
                return;
              }

              if (
                parseInt(lBPCRec.cage_length) >= 4000 &&
                parseInt(result.no_of_sr) < 2
              ) {
                alert(
                  'Invalid No of Stiffener Rings. it should have at least 2 Stiffener Rings for 4 meter or longer cage. '
                );
                return;
              }

              if (
                parseInt(lBPCRec.pile_dia) >= 2500 &&
                parseInt(result.sr_dia) < 25
              ) {
                alert(
                  'Invalid Stiffener Ring Diameter. it should have at least 25mm stiffener ring for 2500mm or bigger cage. '
                );
                return;
              }

              lBPCRec.no_of_sr = result.no_of_sr;
              lBPCRec.sr_grade = result.sr_grade;
              lBPCRec.sr_dia = result.sr_dia;
              lBPCRec.sr_dia_add = result.sr_dia_add;

              if (
                isNaN(result.sr1_location) ||
                parseInt(result.sr1_location) < 100
              ) {
                alert(
                  'Invalid Location for first Stiffener Ring/Cetralizer location.'
                );
                return;
              }
              if (
                isNaN(result.last_location) ||
                parseInt(result.last_location) < 100 ||
                parseInt(result.last_location) + parseInt(result.sr1_location) >
                  parseInt(lBPCRec.cage_length)
              ) {
                alert(
                  'Invalid Location for last Stiffener/Centralizer location'
                );
                return;
              }

              lBPCRec.sr1_location = result.sr1_location;
              var lLapLen = parseInt(lBPCRec.lap_length);

              if (parseInt(result.no_of_sr) == 1) {
                lBPCRec.sr2_location = 0;
                lBPCRec.sr3_location = 0;
                lBPCRec.sr4_location = 0;
                lBPCRec.sr5_location = 0;
              }
              if (parseInt(result.no_of_sr) == 2) {
                lBPCRec.sr2_location =
                  parseInt(lBPCRec.cage_length) -
                  parseInt(result.last_location);
                lBPCRec.sr3_location = 0;
                lBPCRec.sr4_location = 0;
                lBPCRec.sr5_location = 0;
              }
              if (parseInt(result.no_of_sr) == 3) {
                if (lBPCRec.sr1_location < lLapLen) {
                  if (
                    lBPCRec.main_bar_shape == 'Crank-Top' ||
                    lBPCRec.main_bar_shape == 'Crank' ||
                    lBPCRec.main_bar_shape == 'Crank-Both'
                  ) {
                    var lMainBarDia = 0;
                    if (lBPCRec.main_bar_dia != null) {
                      var lVar = lBPCRec.main_bar_dia.toString().split(',');
                      if (lVar.length > 0) {
                        lMainBarDia = parseInt(lVar[0]);
                      }
                      if (lVar.length > 1) {
                        if (lMainBarDia < parseInt(lVar[1])) {
                          lMainBarDia = parseInt(lVar[1]);
                        }
                      }
                    }

                    lBPCRec.sr2_location = lLapLen + 100 + lMainBarDia * 10;
                  } else {
                    lBPCRec.sr2_location = lLapLen + 100;
                  }
                  lBPCRec.sr3_location =
                    parseInt(lBPCRec.cage_length) -
                    parseInt(result.last_location);
                  lBPCRec.sr4_location = 0;
                  lBPCRec.sr5_location = 0;
                } else {
                  lBPCRec.sr3_location =
                    parseInt(lBPCRec.cage_length) -
                    parseInt(result.last_location);
                  lBPCRec.sr2_location =
                    parseInt(lBPCRec.sr1_location) +
                    Math.round(
                      (parseInt(lBPCRec.sr3_location) -
                        parseInt(lBPCRec.sr1_location)) /
                        2
                    );
                  lBPCRec.sr4_location = 0;
                  lBPCRec.sr5_location = 0;
                }
              }
              if (parseInt(result.no_of_sr) == 4) {
                if (lBPCRec.sr1_location < lLapLen) {
                  if (
                    lBPCRec.main_bar_shape == 'Crank-Top' ||
                    lBPCRec.main_bar_shape == 'Crank' ||
                    lBPCRec.main_bar_shape == 'Crank-Both'
                  ) {
                    var lMainBarDia = 0;
                    if (lBPCRec.main_bar_dia != null) {
                      var lVar = lBPCRec.main_bar_dia.toString().split(',');
                      if (lVar.length > 0) {
                        lMainBarDia = parseInt(lVar[0]);
                      }
                      if (lVar.length > 1) {
                        if (lMainBarDia < parseInt(lVar[1])) {
                          lMainBarDia = parseInt(lVar[1]);
                        }
                      }
                    }

                    lBPCRec.sr2_location = lLapLen + 100 + lMainBarDia * 10;
                  } else {
                    lBPCRec.sr2_location = lLapLen + 100;
                  }

                  lBPCRec.sr4_location =
                    parseInt(lBPCRec.cage_length) -
                    parseInt(result.last_location);
                  lBPCRec.sr3_location =
                    lBPCRec.sr2_location +
                    (lBPCRec.sr4_location - lBPCRec.sr2_location) / 2;
                  lBPCRec.sr5_location = 0;
                } else {
                  lBPCRec.sr4_location =
                    parseInt(lBPCRec.cage_length) -
                    parseInt(result.last_location);
                  lBPCRec.sr2_location =
                    parseInt(lBPCRec.sr1_location) +
                    Math.round(
                      (parseInt(lBPCRec.sr3_location) -
                        parseInt(lBPCRec.sr1_location)) /
                        3
                    );
                  lBPCRec.sr3_location =
                    parseInt(lBPCRec.sr1_location) +
                    2 *
                      Math.round(
                        (parseInt(lBPCRec.sr3_location) -
                          parseInt(lBPCRec.sr1_location)) /
                          3
                      );
                  lBPCRec.sr5_location = 0;
                }
              }
              if (parseInt(result.no_of_sr) == 5) {
                if (lBPCRec.sr1_location < lLapLen) {
                  if (
                    lBPCRec.main_bar_shape == 'Crank-Top' ||
                    lBPCRec.main_bar_shape == 'Crank' ||
                    lBPCRec.main_bar_shape == 'Crank-Both'
                  ) {
                    var lMainBarDia = 0;
                    if (lBPCRec.main_bar_dia != null) {
                      var lVar = lBPCRec.main_bar_dia.toString().split(',');
                      if (lVar.length > 0) {
                        lMainBarDia = parseInt(lVar[0]);
                      }
                      if (lVar.length > 1) {
                        if (lMainBarDia < parseInt(lVar[1])) {
                          lMainBarDia = parseInt(lVar[1]);
                        }
                      }
                    }

                    lBPCRec.sr2_location = lLapLen + 100 + lMainBarDia * 10;
                  } else {
                    lBPCRec.sr2_location = lLapLen + 100;
                  }
                  lBPCRec.sr5_location =
                    parseInt(lBPCRec.cage_length) -
                    parseInt(result.last_location);
                  lBPCRec.sr3_location =
                    parseInt(lBPCRec.sr2_location) +
                    1 *
                      Math.round(
                        (parseInt(lBPCRec.sr5_location) -
                          parseInt(lBPCRec.sr2_location)) /
                          3
                      );
                  lBPCRec.sr4_location =
                    parseInt(lBPCRec.sr2_location) +
                    2 *
                      Math.round(
                        (parseInt(lBPCRec.sr5_location) -
                          parseInt(lBPCRec.sr2_location)) /
                          3
                      );
                } else {
                  lBPCRec.sr5_location =
                    parseInt(lBPCRec.cage_length) -
                    parseInt(result.last_location);
                  lBPCRec.sr2_location =
                    parseInt(lBPCRec.sr1_location) +
                    Math.round(
                      (parseInt(lBPCRec.sr5_location) -
                        parseInt(lBPCRec.sr1_location)) /
                        4
                    );
                  lBPCRec.sr3_location =
                    parseInt(lBPCRec.sr1_location) +
                    2 *
                      Math.round(
                        (parseInt(lBPCRec.sr5_location) -
                          parseInt(lBPCRec.sr1_location)) /
                          4
                      );
                  lBPCRec.sr4_location =
                    parseInt(lBPCRec.sr1_location) +
                    3 *
                      Math.round(
                        (parseInt(lBPCRec.sr5_location) -
                          parseInt(lBPCRec.sr1_location)) /
                          4
                      );
                }
              }

              if (
                isNaN(result.rings_start) ||
                parseInt(result.rings_start) < 0
              ) {
                alert('Invalid value entered. Start rings should be negative.');
                return;
              }
              if (isNaN(result.rings_end) || parseInt(result.rings_end) < 0) {
                alert('Invalid value entered. End rings should be negative.');
                return;
              }
              if (
                isNaN(result.rings_addn_member) ||
                parseInt(result.rings_addn_member) < 0
              ) {
                alert('Invalid Additional Rings Member No.');
                return;
              }
              if (
                isNaN(result.rings_addn_no) ||
                parseInt(result.rings_addn_no) < 0
              ) {
                alert('Invalid Additional Rings Each No.');
                return;
              }

              lBPCRec.rings_start = result.rings_start;
              lBPCRec.rings_end = result.rings_end;
              lBPCRec.rings_addn_member = result.rings_addn_member;
              lBPCRec.rings_addn_no = result.rings_addn_no;

              if (
                isNaN(result.no_of_cr_end) ||
                parseInt(result.no_of_cr_end) < 0
              ) {
                alert('Invalid No of End Circular Rings.');
                return;
              }
              if (
                isNaN(result.cr_spacing_end) ||
                parseInt(result.cr_spacing_end) < 0
              ) {
                alert('Invalid End Circular Rings Spacing');
                return;
              }
              if (
                result.cr_end_remarks != null &&
                result.cr_end_remarks.trim().length > 20
              ) {
                alert(
                  'Exceeded the maximum characters of Circular Rings Remarks.'
                );
                return;
              }

              if (
                result.extra_support_bar_ind != null &&
                result.extra_support_bar_ind != 'None'
              ) {
                if (
                  result.extra_support_bar_dia == null ||
                  (result.extra_support_bar_dia != '16' &&
                    result.extra_support_bar_dia != '20' &&
                    result.extra_support_bar_dia != '25')
                ) {
                  alert(
                    'Invalid Extra Support Bar Diameter, it should be 16, 20 or 25.'
                  );
                  return;
                }
              }

              if (result.extra_cr_no != null && result.extra_cr_no > 0) {
                if (
                  result.extra_cr_dia == null ||
                  result.extra_cr_dia == 0 ||
                  result.extra_cr_dia == ''
                ) {
                  alert('Invalid extra circular rings diameter');
                  return;
                }
                if (
                  result.extra_cr_loc == null ||
                  result.extra_cr_loc == 0 ||
                  result.extra_cr_loc == ''
                ) {
                  alert('Invalid extra circular rings location');
                  return;
                }
              }

              if (lLapLen < 700) {
                if (
                  isNaN(result.no_of_cr_top) ||
                  parseInt(result.no_of_cr_top) < 0
                ) {
                  alert('Invalid No of End Circular Rings.');
                  return;
                }
                if (
                  isNaN(result.cr_spacing_top) ||
                  parseInt(result.cr_spacing_top) < 0
                ) {
                  alert('Invalid End Circular Rings Spacing');
                  return;
                }

                if (
                  lLapLen >
                    parseInt(lBPCRec.spiral_link_spacing.split(',')[0]) &&
                  lLapLen < 700 &&
                  parseInt(result.no_of_cr_top) == 0
                ) {
                  alert(
                    'Since the Lap Length is less than 700, the CR may need to fulfill the ' +
                      lLapLen +
                      ' Lap Length. '
                  );
                  return;
                }

                lBPCRec.no_of_cr_top = result.no_of_cr_top;
                lBPCRec.cr_spacing_top = result.cr_spacing_top;
              }

              if (lBPCRec.lEndLen < 500 && parseInt(result.no_of_cr_end) == 0) {
                alert(
                  'Since the End Length is less than 500, the CR may need to fulfill the ' +
                    lBPCRec.lEndLen +
                    ' End Length. '
                );
                return;
              }

              lBPCRec.no_of_cr_end = result.no_of_cr_end;
              lBPCRec.cr_spacing_end = result.cr_spacing_end;
              lBPCRec.cr_end_remarks = result.cr_end_remarks;
              this.extra_support_bar_ind = result.extra_support_bar_ind;
              this.extra_support_bar_dia  = result.extra_support_bar_dia;
              if (
                this.extra_support_bar_ind != null &&
                result.extra_support_bar_ind != null
              ) {
                lBPCRec.extra_support_bar_ind = result.extra_support_bar_ind;
              }

              if (
                this.extra_support_bar_dia != null &&
                result.extra_support_bar_dia != null
              ) {
                lBPCRec.extra_support_bar_dia = result.extra_support_bar_dia;
              }

              if (
                this.extra_support_bar_ind == null ||
                result.extra_support_bar_ind == 'None'
              ) {
                lBPCRec.extra_support_bar_dia = 0;
              }

              lBPCRec.extra_cr_no =
                result.extra_cr_no == null || result.extra_cr_no == ''
                  ? 0
                  : result.extra_cr_no;

              if (lBPCRec.extra_cr_no > 0) {
                lBPCRec.extra_cr_loc = result.extra_cr_loc;
                lBPCRec.extra_cr_dia = result.extra_cr_dia;
              } else {
                lBPCRec.extra_cr_loc = 0;
                lBPCRec.extra_cr_dia = 0;
              }

              lBPCRec.coupler_top = result.coupler_top;
              lBPCRec.coupler_end = result.coupler_end;

              if (lBPCRec.main_bar_shape != 'Straight') {
                if (
                  isNaN(result.crank_height_top) ||
                  parseInt(result.crank_height_top) <= 0
                ) {
                  alert('Invalid Crank Height.');
                  return;
                }

                lBPCRec.crank_height_top = result.crank_height_top;
                lBPCRec.crank_height_end = result.crank_height_end;

                if (lBPCRec.main_bar_type == 'Mixed') {
                  if (
                    isNaN(result.crank2_height_top) ||
                    parseInt(result.crank2_height_top) <= 0
                  ) {
                    alert('Invalid 2nd Bar Crank Height.');
                    return;
                  }

                  lBPCRec.crank2_height_top = result.crank2_height_top;
                  lBPCRec.crank2_height_end = result.crank2_height_end;
                }
              }
              if (lBPCRec.main_bar_shape == 'Crank-Both') {
                if (
                  isNaN(result.crank_height_end) ||
                  parseInt(result.crank_height_end) <= 0
                ) {
                  alert('Invalid Crank Height at end.');
                  return;
                }

                lBPCRec.crank_height_end = result.crank_height_end;

                if (lBPCRec.main_bar_type == 'Mixed') {
                  if (
                    isNaN(result.crank2_height_end) ||
                    parseInt(result.crank2_height_end) <= 0
                  ) {
                    alert('Invalid 2nd Bar Crank Height at end.');
                    return;
                  }

                  lBPCRec.crank2_height_end = result.crank2_height_end;
                }
              }
              //lBPCRec.crank_height_end = result.crank_height_end;
              //lBPCRec.crank_height_end = 0;

              if (
                lBPCRec.pile_type != 'Single-Layer' ||
                lBPCRec.main_bar_arrange != 'Single'
              ) {
                if (
                  isNaN(result.mainbar_length_2layer) ||
                  parseInt(result.mainbar_length_2layer) <= 100 ||
                  parseInt(result.mainbar_length_2layer) >
                    parseInt(lBPCRec.cage_length)
                ) {
                  alert('Invalid second layer main bar length.');
                  return;
                }

                if (
                  isNaN(result.mainbar_location_2layer) ||
                  parseInt(result.mainbar_location_2layer) < 0 ||
                  parseInt(result.mainbar_location_2layer) >
                    parseInt(lBPCRec.cage_length) -
                      parseInt(result.mainbar_length_2layer)
                ) {
                  alert('Invalid second layer main bar location.');
                  return;
                }

                lBPCRec.mainbar_length_2layer = result.mainbar_length_2layer;
                lBPCRec.mainbar_location_2layer =
                  result.mainbar_location_2layer;
              }

              if (result.bundle_same_type != null) {
                lBPCRec.bundle_same_type = result.bundle_same_type;
              }

              this.getBPCWeight(lBPCRec);

              this.templateGrid.slickGrid.invalidateRow(pRowNo);
              this.templateGrid.slickGrid.render();

              let lCageLength = lBPCRec.cage_length;
              let lLapLength = lBPCRec.lap_length;
              let lEndLength = lBPCRec.end_length;
              let lSLType = lBPCRec.spiral_link_type;
              let lSLGrade = lBPCRec.spiral_link_grade;
              let lSLDia = lBPCRec.spiral_link_dia;
              let lSLSpacing = lBPCRec.spiral_link_spacing;
              let lCouplerTop = lBPCRec.coupler_top;
              let lCouplerEnd = lBPCRec.coupler_end;
              let lMainBarShape = lBPCRec.main_bar_shape;
              let lSL1Length = lBPCRec.sl1_length;
              let lSL2Length = lBPCRec.sl2_length;
              let lSL3Length = lBPCRec.sl3_length;
              let lSL1Dia = lBPCRec.sl1_dia;
              let lSL2Dia = lBPCRec.sl2_dia;
              let lSL3Dia = lBPCRec.sl3_dia;
              let l2LayerLen = lBPCRec.mainbar_length_2layer;
              let l2LayerPos = lBPCRec.mainbar_location_2layer;
              let lPileType = lBPCRec.pile_type;

              this.LibChanged();

              this.drawPlanView(
                this.contextp,
                lBPCRec.main_bar_ct,
                lBPCRec.pile_type,
                lBPCRec.main_bar_type,
                lBPCRec.main_bar_arrange,
                lBPCRec.main_bar_dia,
                lBPCRec.bundle_same_type,
                lBPCRec.extra_support_bar_ind
              );

              this.drawElevView(this.contextEl, lCageLength, lLapLength, lEndLength, lSLType, lSLGrade, lSLDia,
                lSLSpacing, lCouplerTop, lCouplerEnd, lMainBarShape,
                lSL1Length, lSL2Length, lSL3Length, lSL1Dia, lSL2Dia, lSL3Dia, l2LayerLen, l2LayerPos, lPileType,
                lBPCRec.rings_start, lBPCRec.rings_end,lBPCRec.no_of_cr_top, lBPCRec.no_of_cr_end
            );

              this.drawStiffenerRing(
                this.contextEl,
                lLapLength,
                lEndLength,
                lCageLength,
                lBPCRec.no_of_sr,
                lBPCRec.sr_grade,
                lBPCRec.sr_dia,
                lBPCRec.sr1_location,
                lBPCRec.sr2_location,
                lBPCRec.sr3_location,
                lBPCRec.sr4_location,
                lBPCRec.sr5_location,
                lMainBarShape,
                lPileType,
                lBPCRec.extra_support_bar_ind,
                lBPCRec.extra_support_bar_dia,
                lBPCRec.extra_cr_no
              );

              if (lPileType != 'Micro-Pile') {
                this.drawCircularRing(this.contextEl,
                  lLapLength,
                  lEndLength,
                  lCageLength,
                  lBPCRec.no_of_cr_top,
                  lBPCRec.no_of_cr_end,
                  lBPCRec.cr_spacing_top,
                  lBPCRec.cr_spacing_end,
                  lBPCRec.main_bar_shape,
                  lBPCRec.spiral_link_type,
                  lBPCRec.cr_end_remarks,
                  lBPCRec.extra_cr_no,
                  lBPCRec.extra_cr_loc,
                  lBPCRec.extra_cr_dia,
                  lBPCRec.rings_start,
                  lBPCRec.rings_end,
                  lBPCRec.cr_posn_top,
                  lBPCRec.cr_posn_end,
                  lBPCRec.cr_top_remarks,
                  lBPCRec.cr_ring_type,
                  lBPCRec.cr_bundle_side
              );
              }

              this.drawAdditionalRings(
                this.contextEl,
                lBPCRec.no_of_sr,
                lLapLength,
                lEndLength,
                lCageLength,
                lBPCRec.rings_start,
                lBPCRec.rings_end,
                lBPCRec.rings_addn_member,
                lBPCRec.rings_addn_no
              );

              this.drawCrankHeight(
                this.contextEl,
                lLapLength,
                lEndLength,
                lCageLength,
                lBPCRec.main_bar_shape,
                lBPCRec.crank_height_top,
                lBPCRec.crank_height_end
              );

              this.viewBPC3D(this.templateGrid.slickGrid.getDataItem(pRowNo));
            }
          }
        },
        (reason) => {
          // Handle dismissal or any other rejection
          console.log(reason);
        }
      );
    }
  }
  deleteLibData(pItemID: any) {
    var lOrderSheet = this.templateGrid.slickGrid.getData();

    if (this.isBPCEditable != true) {
      alert(
        'Please turn on Edit Library option if you have the BPC library edit right.'
      );
      return;
    }

    if (this.templateGrid.slickGrid.getDataLength() > 0) {
      if (
        confirm(
          'You are going to delete item ' +
            (Number(pItemID) + 1) +
            ' product. Please confirm?'
        )
      ) {
        console.log('lOrderSheet=>', lOrderSheet.getItem(pItemID));
        var lCustomerCode = lOrderSheet.getItem(pItemID).CustomerCode;
        var lProjectCode = lOrderSheet.getItem(pItemID).ProjectCode;
        var lJobID = lOrderSheet.getItem(pItemID).JobID;

        if (lJobID > 0) {
          let obj = {
            CustomerCode: lCustomerCode,
            ProjectCode: lProjectCode,
            JobID: lJobID,
          };
          this.orderService
            .deleteLibItem_bpc(obj)
            .subscribe((response: any) => {
              if (response) {
                this.gLibChanged = 0;
                //alert(response);
              } else {
                alert('Server error: ' + response);
                this.lReturn = false;
              }
            });
          // alert("Connection error. Please check the Internet connection.");
          //           lReturn = false;
        }

        this.reloadTemplateBPC('ALL', '');

        alert('The selected cage data has been deleted successfully.');
      }
    }
  }

  reloadSupportBar() {
    this.orderService.getSupportBarSetting_bpc().subscribe((response: any) => {
      this.gSBPileDia = [];
      this.gSBMainBarSizeFr = [];
      this.gSBMainBarSizeTo = [];
      this.gSBMainBarQty = [];
      this.gSBLinkDia = [];
      this.gSBDia = [];

      if (response != null && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          this.gSBPileDia.push(response[i].pile_dia);
          this.gSBMainBarSizeFr.push(response[i].mainbar_size_fr);
          this.gSBMainBarSizeTo.push(response[i].mainbar_size_to);
          this.gSBMainBarQty.push(response[i].mainbar_qty_fr);
          this.gSBLinkDia.push(response[i].link_dia_to);
          this.gSBDia.push(response[i].extra_supportbar_dia);
        }
      }
    });
  }
  GetCustomer(): void {
    debugger;
    this.commonService.GetCutomerDetails().subscribe({
      next: (response:any) => {
        debugger;
        this.Customerlist = response;
      },
      error: (e:any) => {
      },
      complete: () => {
        debugger;
        // if (this.transferObject["CustomerId"] != undefined) {

        //  this.customerName = this.transferObject['CustomerId'];
        this.GetProject(this.customerCode);
        // }
      },
    });
  }

  GetProject(customercode: any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response:any) => {
        this.projectList = response;
        console.log("projectlist", this.projectList)
      },

      error: (e:any) => {
      },
      complete: () => {
      },

    });


  }
}
export class CustomCurve extends THREE.Curve<THREE.Vector3> {
 constructor() {
   super();
 }

 // Implement the getPoint method
 override getPoint(t: number): THREE.Vector3 {
   console.log("getPoint=>",t)
   const x = Math.cos(2 * Math.PI * t);
   const y = Math.sin(2 * Math.PI * t);
   const z = 0;

   return new THREE.Vector3(x, y, z);
 }
}
