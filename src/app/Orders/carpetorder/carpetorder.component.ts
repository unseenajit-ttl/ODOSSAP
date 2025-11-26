import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularGridInstance, GridOption, Column } from 'angular-slickgrid';
import { OrderService } from '../orders.service';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CarpetProductListComponent } from './carpet-product-list/carpet-product-list.component';
import { CarpetShapeListComponent } from './carpet-shape-list/carpet-shape-list.component';

@Component({
  selector: 'app-carpetorder',
  templateUrl: './carpetorder.component.html',
  styleUrls: ['./carpetorder.component.css'],
})
export class CarpetorderComponent implements OnInit {
  CustomerCode: any;
  ProjectCode: any;
  JobId: any;
  OrderNumber: any;
  ProductType: any = 'CARPET';
  ScheduleProd: any;
  PostID: any = 0;
  StructureElement: any;
  // JobID: any;

  hideShapecode: boolean = true;
  Imagename: string = '';

  RoutedFromProcess: boolean = false;

  templateGrid!: AngularGridInstance;
  dataViewCAR: any;
  gridOptions!: GridOption;
  templateColumns: any[] = [];
  bbsOrderdataset: any;

  sideMenuVisible: number = 1; // Alignment of sidemenu on load -> 1|2

  ScheduledProd: string = 'Y';
  OrderStatus: any;
  rt_MWDia: any;
  bt_MWDia: any;
  rt_MWSpacing: any;
  bt_MWSpacing: any;
  rt_CWDia: any;
  bt_CWDia: any;
  rt_CWSpacing: any;
  bt_CWSpacing: any;
  rt_mass: any;
  bt_mass: any;
  total_weight: any;
  rt_total_weight: any;
  bt_total_weight: any;

  preRightBoxWidth = 150;
  preBottomBoxHeight = 150;
  preRightBoxEnable = true;
  preRightBoxVisible = true;
  preBottomBoxEnable = false;
  preBottomBoxVisible = false;
  barChangeInd = [];
  gridIndex = 0;
  barRowIndex = [];
  //current product code
  gProdCode = '';
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
  bProdCode = [];
  bProdMWDia = [];
  bProdMWSpacing = [];
  bProdCWDia = [];
  bProdCWSpacing = [];
  bProdMass = [];
  bProdMinFactor = [];
  bProdTwinInd = [];

  //current shape code
  gShapeCode = '';
  gShapeParameters: any;
  gShapeEditParameters: any;
  gShapeImage: any;
  gShapeMaxValues: any;
  gShapeMinValues: any;
  gShapeParamTypes: any;
  gShapeWireTypes: any;
  gMeshCreepMO1: any;
  gMeshCreepCO1: any;

  // Shape Code buffer
  bShapeCode: any[] = [];
  bShapeParameters: any[] = [];
  bShapeEditParameters: any[] = [];
  bShapeImage: any[] = [];
  bShapeMaxValues: any[] = [];
  bShapeMinValues: any[] = [];
  bShapeParamTypes: any[] = [];
  bShapeWireTypes: any[] = [];
  bMeshCreepMO1: any[] = [];
  bMeshCreepCO1: any[] = [];

  gPreCellCol = 0;
  gPreCellRow = -1;

  //Shape Code List
  gShapeCodeList = '';
  gShapeCategory = '';
  gBeamShapeList = '';
  gBeamProdWTArea = '';
  gBeamProdCode = '';

  gColumnShapeList = '';
  gColumnProdWTArea = '';
  gColumnProdCode = '';

  gOthersShapeList = '';
  gOthersProdWTArea = '';
  gOthersProdCode = '';

  gAdvancedOrder = 'No';
  gOrderSubmission = 'No';
  gOrderCreation = 'No';

  copyCopied = false;
  copyGridID = 2;
  copyDesSelected = false;

  showRightShape = false;
  showBottomShape = false;

  constructor(
    private location: Location,
    private router: Router,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal,
    private createSharedService: CreateordersharedserviceService,
    private processsharedserviceService: ProcessSharedServiceService,
    private ordersummarySharedService: OrderSummarySharedServiceService
  ) {
    this.gridOptions = {
      editable: false,
      enableAutoResize: true,
      enableCellNavigation: true,
      autoFitColumnsOnFirstLoad: false, // ❌ stops auto-fit from overriding your widths
      forceFitColumns: false, // ❌ prevents SlickGrid from squeezing columns
      // enableColumnResizer: true, // ✅ allow manual resizing
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
      enableAddRow: false,
      enableContextMenu: false,
    };
    this.templateColumns = [
      {
        id: 'id',
        name: 'ID\n序号',
        field: 'id',
        toolTip: 'Serial Number (序列号)',
        minWidth: 30,
        width: 30,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshMark',
        name: 'Mark\n编码',
        field: 'MeshMark',
        toolTip: 'Mark (编码)',
        minWidth: 50,
        width: 50,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshProduct',
        name: 'Product\n产品型号',
        field: 'MeshProduct',
        toolTip: 'Product Code (产品型号)',
        minWidth: 60,
        width: 60,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshMainLen',
        name: 'Main Length\n主筋长(mm)',
        field: 'MeshMainLen',
        toolTip: 'Main wire length (主筋长)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshCrossLen',
        name: 'Cross Length\n副筋长(mm)',
        field: 'MeshCrossLen',
        toolTip: 'Cross wire length (副筋长)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshMemberQty',
        name: 'Carpet Qty\n件数',
        field: 'MeshMemberQty',
        toolTip: 'Pieces (件数)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshShapeCode',
        name: 'Shape\n图形码',
        field: 'MeshShapeCode',
        toolTip: 'Shape Code (图形代码)',
        minWidth: 60,
        width: 60,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'A',
        name: 'A',
        field: 'A',
        toolTip: 'Bending Parameter A (参数 A)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'B',
        name: 'B',
        field: 'B',
        toolTip: 'Bending Parameter B (参数 B)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'C',
        name: 'C',
        field: 'C',
        toolTip: 'Bending Parameter C (参数 C)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshMO1',
        name: 'MO1\n主筋边1(mm)',
        field: 'MeshMO1',
        toolTip: 'Main wire overhang 1 (主筋边1)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshMO2',
        name: 'MO2\n主筋边2(mm)',
        field: 'MeshMO2',
        toolTip: 'Main wire overhang 2 (主筋边2)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshCO1',
        name: 'CO1\n副筋边1(mm)',
        field: 'MeshCO1',
        toolTip: 'Cross wire overhang 1 (副筋边1)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshCO2',
        name: 'CO2\n副筋边2(mm)',
        field: 'MeshCO2',
        toolTip: 'Cross wire overhang 2 (副筋边2)',
        minWidth: 40,
        width: 40,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'MeshTotalWT',
        name: 'Weight\n重量(kg)',
        field: 'MeshTotalWT',
        toolTip: 'Total Weight (总重量)',
        minWidth: 60,
        width: 60,
        cssClass: 'right-align grid-text-size',
      },
      {
        id: 'Remarks',
        name: 'Remarks\n备注',
        field: 'Remarks',
        toolTip: 'Remarks (备注)',
        minWidth: 60,
        width: 60,
        cssClass: 'right-align grid-text-size',
      },
    ];
  }
  ngOnInit(): void {
    setTimeout(() => {
      // Code to be executed after the delay
      this.LoadPage();
      console.log('Timeout executed after 2000 milliseconds');
    }, 1000);
  }

  receivedData: any;
  async LoadPage() {
    var orderStatus = this.OrderStatus;
    var lScheduledProd = this.ScheduledProd;
    let gridCTSMesh = this.templateGrid.slickGrid;

    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log('this.receivedData', this.receivedData);
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
      this.ScheduledProd = this.receivedData.ScheduledProd; //ADDED
      this.OrderStatus = this.receivedData.orderstatus;
      this.OrderNumber = this.receivedData.ordernumber;

      this.PostID = this.receivedData.jobIds.PostHeaderID;
      this.RoutedFromProcess = true;
      this.RoutedFromProcess = true;
      this.StructureElement = this.receivedData.StructureElement;
      this.ScheduleProd = this.receivedData.ScheduledProd;
      this.ProductType = this.receivedData.ProductType;
      await this.SetCreateDatainLocal(this.OrderNumber);
      // this.lTransportMode = this.receivedData.Transport;
    }

    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.ScheduledProd =
        this.createSharedService.selectedrecord.ScheduledProd;
      this.StructureElement =
        this.createSharedService.selectedrecord.StructureElement;
      this.OrderNumber = this.createSharedService.selectedrecord.OrderNumber;
      this.PostID = this.createSharedService.selectedrecord.PostID;
      // this.MemberQty = this.createSharedService.selectedrecord.OrderQty;
      this.StructureElement =
        this.createSharedService.selectedrecord.StructureElement;
      this.ScheduleProd = this.createSharedService.selectedrecord.ScheduledProd;
      this.ProductType = this.createSharedService.selectedrecord.Product;
    }

    // if (
    //   (((orderStatus == 'New' || orderStatus == 'Created') &&
    //     this.gOrderCreation == 'Yes') ||
    //     (orderStatus == 'Sent' && this.gOrderSubmission == 'Yes')) &&
    //   lScheduledProd != 'Y'
    // ) {
    //   gridCTSMesh.getOptions().editable = true;
    //   gridCTSMesh.invalidateAllRows();
    //   gridCTSMesh.render();
    // } else {
    //   gridCTSMesh.getOptions().editable = false;
    //   gridCTSMesh.invalidateAllRows();
    //   gridCTSMesh.render();
    // }

    this.reloadProjectDetails();
    this.getJobId(this.OrderNumber);
    // this.getTableData();
  }

  goBack(): void {
    if (!this.RoutedFromProcess) {
      this.location.back();
    } else {
      this.router.navigate(['../order/createorder']);
    }
  }

  angularGridReady(event: Event) {
    console.log('event', event);
    this.templateGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.dataViewCAR = this.templateGrid.slickGrid.getData();

    this.templateGrid.slickGrid.onValidationError.subscribe((e, args) => {
      alert(args.validationResults.msg);
    });

    this.templateGrid.slickGrid.onActiveCellChanged.subscribe(
      async (e, args) => {
        await this.grid_onActiveCellChanged(e, args);
      }
    );

    // this.templateGrid.slickGrid.onBeforeEditCell.subscribe(async (e, args) => {
    //   await this.grid_onBeforeEditCell(e, args);
    // });

    this.templateGrid.slickGrid.onSelectedRowsChanged.subscribe(
      async (e, args) => {
        await this.grid_onSelectedRowsChanged(e, args);
      }
    );

    // this.templateGrid.slickGrid.onClick.subscribe((e, args) => {
    //   this.grid_onClick(e, args);
    // });

    // this.templateGrid.slickGrid.onKeyDown.subscribe(async (e, args) => {
    //   await this.grid_onKeyDown(e, args);
    // });
    this.templateGrid.slickGrid.onContextMenu.subscribe((e, args) => {
      this.grid_onContextMenu(e, args);
    });
    // this.templateGrid.slickGrid.onSort.subscribe((e, args) => {
    //   this.grid_onSort(e, args);
    // });

    this.dataViewCAR.getItemMetadata = this.metadata(
      this.dataViewCAR.getItemMetadata
    );
  }

  metadata(old_metadata: any) {
    return (row: any) => {
      // let item: any = this.getItem(row);
      let item: any = this.templateGrid.slickGrid.getDataItem(row);
      let meta: any = old_metadata(row) || {};

      if (item) {
        // Make sure the "cssClasses" property exists
        meta.cssClasses = meta.cssClasses || '';

        if (item.shapeCopied) {
          meta.cssClasses += ' item-copied';
        }

        if (item.rowClass) {
          var myClass = ' ' + item.rowClass;
          meta.cssClasses += myClass;
        }
      }

      return meta;
    };
  }

  grid_onContextMenu(e: any, args: any) {
    const gridCTSMesh = this.templateGrid.slickGrid;

    e.preventDefault();
    let cell = gridCTSMesh.getCellFromEvent(e);
    if (cell) {
      $('#contextMenu')
        .data('row', cell.row)
        .css('top', e.pageY)
        .css('left', e.pageX)
        .show();

      $('body').one('click', function () {
        $('#contextMenu').hide();
      });
    }
  }

  async grid_onActiveCellChanged(e: any, args: any) {
    const gridCTSMesh = this.templateGrid.slickGrid;
    const item = gridCTSMesh.getDataItem(args.row);

    if (item) {
      const lProductCode = item.MeshProduct;

      if (lProductCode) {
        this.rt_MWDia = item.ProdMWDia;
        this.bt_MWDia = item.ProdMWDia;

        if (item.ProdTwinInd === 'M') {
          this.rt_MWSpacing = item.ProdMWSpacing + ' (Twin)';
          this.bt_MWSpacing = item.ProdMWSpacing + ' (Twin)';
        } else {
          this.rt_MWSpacing = item.ProdMWSpacing;
          this.bt_MWSpacing = item.ProdMWSpacing;
        }

        this.rt_CWDia = item.ProdCWDia;
        this.bt_CWDia = item.ProdCWDia;

        this.rt_CWSpacing = item.ProdCWSpacing;
        this.bt_CWSpacing = item.ProdCWSpacing;

        this.rt_mass = item.ProdMass;
        this.bt_mass = item.ProdMass;

        // if you have a method to refresh totals, call it
        this.refreshInfo();
      } else {
        this.clearValues();
      }

      const lShapeCode = item.MeshShapeCode;
      if (lShapeCode) {
        if (lShapeCode !== this.gShapeCode) {
          this.loadShapeInfo(lShapeCode, args.row);
        } else {
          this.CheckParameters(this.gShapeParameters, gridCTSMesh);
          this.showRightShape = true;
          this.showBottomShape = true;
        }
      } else {
        this.showRightShape = false;
        this.showBottomShape = false;
      }

      // --- your navigation logic can stay here ---
      const lPara = item.MeshEditParameters;
      const lColumnName = args.grid.getColumns(args.row)[args.cell]['id'];
      if (
        lColumnName.length === 1 &&
        lColumnName >= 'A' &&
        lColumnName <= 'Z'
      ) {
        if (
          lShapeCode === 'F' ||
          this.isInvalidParameterCell(lShapeCode, lColumnName, lPara)
        ) {
          if (args.cell < this.gPreCellCol) {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            gridCTSMesh.navigateLeft();
          } else {
            this.gPreCellRow = args.row;
            this.gPreCellCol = args.cell;
            gridCTSMesh.navigateRight();
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
      this.showRightShape = false;
      this.showBottomShape = false;
      this.clearValues();
    }

    args.grid.focus();
    if (args.grid.getOptions().editable === true) {
      args.grid.editActiveCell();
    }
    return true;
  }

  private clearValues() {
    this.rt_MWDia =
      this.bt_MWDia =
      this.rt_MWSpacing =
      this.bt_MWSpacing =
      this.rt_CWDia =
      this.bt_CWDia =
      this.rt_CWSpacing =
      this.bt_CWSpacing =
      this.rt_mass =
      this.bt_mass =
      this.rt_total_weight =
      this.bt_total_weight =
        '';
  }

  async grid_onSelectedRowsChanged(e: any, args: any) {
    if (args.rows.length > 0) {
      args.grid.focus();
      if (args.grid.getOptions().editable == true) {
        args.grid.editActiveCell();
      }
    }
    //commented
    //if (copyDesSelected != 0) {
    //    BarsClearCopy(gridIndex);
    //}
  }

  async getTableData() {
    await this.reloadMeshOthersDetails();
    // this.setSampleData();
    this.refreshInfo();
  }

  async reloadMeshOthersDetails() {
    let lCustomerCode = this.CustomerCode;
    let lProjectCode = this.ProjectCode;
    let lPostID = this.PostID;
    let lStatus = this.OrderStatus;
    let lScheduledProd = this.ScheduledProd;

    var lHook = 0;
    var lBBSID = 1;

    if (lPostID) {
      lPostID = Number(lPostID);
      let response = await this.GetCarpetDetailsNSH(
        lCustomerCode,
        lProjectCode,
        lPostID
      );

      if (response == 'error') {
        alert(
          'Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection and try again later'
        );
      } else {
        let dataViewCTS = this.dataViewCAR;
        let gridCTSMesh = this.templateGrid.slickGrid;
        let data: any[] = [];
        if (response.length > 0) {
          for (var i = 0; i < response.length; i++) {
            this.CheckParameters(response[i].MeshShapeParameters, gridCTSMesh);
            var lWT: any = 0;
            if (response[i].MeshTotalWT == null) {
              lWT = '';
            } else {
              lWT = response[i].MeshTotalWT.toFixed(3);
            }
            data[i] = {
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
              MWBOM: '',
              CWBOM: '',
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
              shapeCopied: false,
            };
            if (response[i].HOOK != null) {
              if (response[i].HOOK > 0) {
                lHook = lHook + 1;
              }
            }
          }
          dataViewCTS.beginUpdate();
          dataViewCTS.setItems(data);
          dataViewCTS.endUpdate();
          gridCTSMesh.render();
        } else {
          dataViewCTS.beginUpdate();
          dataViewCTS.setItems(data);
          dataViewCTS.endUpdate();
        }
      }
    }
  }

  setSampleData() {
    const sampleData = [
      {
        id: 1,
        MeshMark: 'M-101',
        MeshProduct: 'PRD-001',
        MeshMainLen: 1200,
        MeshCrossLen: 800,
        MeshMemberQty: 10,
        MeshShapeCode: 'S01',
        A: 50,
        B: 40,
        C: 30,
        MeshMO1: 100,
        MeshMO2: 120,
        MeshCO1: 80,
        MeshCO2: 90,
        MeshTotalWT: 250.5,
        Remarks: 'First sample mesh',
      },
      {
        id: 2,
        MeshMark: 'M-102',
        MeshProduct: 'PRD-002',
        MeshMainLen: 1500,
        MeshCrossLen: 1000,
        MeshMemberQty: 8,
        MeshShapeCode: 'S02',
        A: 60,
        B: 50,
        C: 35,
        MeshMO1: 110,
        MeshMO2: 115,
        MeshCO1: 85,
        MeshCO2: 95,
        MeshTotalWT: 310.2,
        Remarks: 'Second mesh entry',
      },
      {
        id: 3,
        MeshMark: 'M-103',
        MeshProduct: 'PRD-003',
        MeshMainLen: 1800,
        MeshCrossLen: 1200,
        MeshMemberQty: 12,
        MeshShapeCode: 'S03',
        A: 70,
        B: 55,
        C: 40,
        MeshMO1: 120,
        MeshMO2: 125,
        MeshCO1: 90,
        MeshCO2: 100,
        MeshTotalWT: 400.75,
        Remarks: 'Heavy duty mesh',
      },
    ];

    // -----------------UPDATE DATA------------------
    this.dataViewCAR.beginUpdate();
    this.dataViewCAR.setItems(sampleData);
    this.dataViewCAR.endUpdate();

    //----------------RENDER SLICKGRID-----------------
    this.templateGrid.slickGrid.invalidateAllRows();
    this.templateGrid.slickGrid.render();
    this.templateGrid.slickGrid.setColumns(this.templateColumns);
    // this.templateGrid.slickGrid.resizeCanvas();
    this.templateGrid.resizerService.resizeGrid();
  }
  showShapeList() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      CarpetShapeListComponent,
      ngbModalOptions
    );
  }
  showProductList() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      CarpetProductListComponent,
      ngbModalOptions
    );
  }
  downloadShapeList() {
    this.orderService.printShapesCarpet().subscribe({
      next: (response: Blob) => {
        const filename = 'Shapes_List.pdf';

        // Create a blob URL
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // Trigger download
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(link.href);
      },
      error: (err) => {
        console.error('Download failed', err);
      },
    });
  }
  downloadProductList() {
    this.orderService.printProductCarpet().subscribe({
      next: (response: Blob) => {
        const filename = 'Products_List.pdf';

        // Create a blob URL
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // Trigger download
        link.click();

        window.URL.revokeObjectURL(link.href);
      },
      error: (err) => {
        console.error('Download failed', err);
      },
    });
  }

  sideMenuChange(val: number) {
    this.sideMenuVisible = val;
    setTimeout(() => {
      this.templateGrid.resizerService.resizeGrid();
    }, 300);
  }

  refreshInfo() {
    let dataViewCTS = this.dataViewCAR;
    let gridCTSMesh = this.templateGrid.slickGrid;
    if (dataViewCTS.getLength() > 0) {
      var lSubTotalWT = 0;
      var lSubOrderQty = 0;
      var lSubOrderItem = 0;
      var lTotWeight = 0;
      for (var i = 0; i < dataViewCTS.getLength(); i++) {
        var lItem = gridCTSMesh.getDataItem(i);
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

      if (lSubTotalWT > 30000 && lScheduledProd != 'Y') {
        alert(
          'The total order weight is ' +
            lSubTotalWT +
            'kg, which is exceeded its maximum transport weight 30000kg. You may split the order if you deliver it with one lorry.'
        );
      }
      this.total_weight = lTotWeight.toFixed(3);
      this.bt_total_weight = lTotWeight.toFixed(3);
    }
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

  CheckParameters(pParameters: any, gridCTSMesh: any) {
    if (pParameters != null && pParameters != '') {
      var lParaArray = pParameters.split(',');
      if (lParaArray.length > 0) {
        for (var i = 0; i < lParaArray.length; i++) {
          if (
            lParaArray[i] != 'LEG' &&
            lParaArray[i].charCodeAt(0) > 'C'.charCodeAt(0)
          ) {
            this.InsertColumn(lParaArray[i], gridCTSMesh);
          }
        }
      }
    }
  }

  InsertColumn(pPara: any, gridCTSMesh: any) {
    var columns = gridCTSMesh.getColumns();
    var lStartCol = 10;
    var lEndCol = columns.length - 4;
    if (pPara == 'HOOK') {
      var lPos = columns.length - 3;
      if (columns.length > 0) {
        for (var i = lStartCol; i < columns.length; i++) {
          if (columns[i].id == 'HOOK') {
            return;
          }
          if (columns[i].id == 'LEG' || columns[i].id == 'MeshTotalWT') {
            lPos = i;
          }
        }
      }
      var columnDefinition: Column = {
        id: pPara,
        name: 'Hook\n勾宽',
        field: pPara,
        toolTip: 'Hook length (勾宽)',
        minWidth: 40,
        width: 40,
        // editor: Slick.Editors.Text,
        // validator: parameterValidator,
        cssClass: 'left-align',
      };
    } else {
      if (columns.length > 0) {
        for (var i = 0; i < columns.length; i++) {
          if (
            columns[i].id == 'HOOK' ||
            columns[i].id == 'LEG' ||
            columns[i].id == 'MeshTotalWT'
          ) {
            lEndCol = i;
            break;
          }
        }
      }
      if (columns.length > 0) {
        for (var i = 0; i < columns.length; i++) {
          if (columns[i].id == 'C') {
            lStartCol = i;
            break;
          }
        }
      }
      var lWidth = columns[lStartCol].width;
      var lMinWidth = columns[lStartCol].minWidth;
      var columnDefinition: Column = {
        id: pPara,
        name: pPara,
        field: pPara,
        toolTip: 'Bending Parameter ' + pPara + ' (参数 ' + pPara + ')',
        minWidth: lMinWidth,
        width: lWidth,
        // editor: Slick.Editors.Text,
        // validator: parameterValidator,
        cssClass: 'left-align',
      };
      var lPos = lEndCol;
      var lAcs = pPara.charCodeAt(0);
      if (lStartCol < lEndCol) {
        for (var i = lStartCol; i < lEndCol - 1; i++) {
          if (columns[i].id == pPara || columns[i + 1].id == pPara) {
            return;
          } else {
            if (
              columns[i].id.charCodeAt(0) < lAcs &&
              (columns[i + 1].id.charCodeAt(0) > lAcs ||
                columns[i + 1].id.length > 1)
            ) {
              lPos = i + 1;
              break;
            }
          }
        }
      }
    }
    columns.splice(lPos, 0, columnDefinition);
    gridCTSMesh.setColumns(columns);
    gridCTSMesh.autosizeColumns();
  }

  async loadShapeInfo(pShapeCode: any, pRowNo: any) {
    let dataViewCTS = this.dataViewCAR;
    let gridCTSMesh = this.templateGrid.slickGrid;
    if (pShapeCode != null && pShapeCode.trim() != '') {
      var lFoundShape = 0;
      if (this.bShapeCode.length > 0) {
        for (var i = 0; i < this.bShapeCode.length; i++) {
          if (
            this.bShapeCode[i] != null &&
            pShapeCode == this.bShapeCode[i].trim()
          ) {
            this.gShapeParameters = this.bShapeParameters[i];
            this.gShapeEditParameters = this.bShapeEditParameters[i];
            this.gShapeMaxValues = this.bShapeMaxValues[i];
            this.gShapeMinValues = this.bShapeMinValues[i];
            this.gShapeParamTypes = this.bShapeParamTypes[i];
            this.gShapeWireTypes = this.bShapeWireTypes[i];
            this.gMeshCreepMO1 = this.bMeshCreepMO1[i];
            this.gMeshCreepCO1 = this.bMeshCreepCO1[i];
            this.gShapeImage = this.bShapeImage[i];

            this.Imagename = pShapeCode;
            this.Imagename = this.Imagename + '.png';
            this.hideShapecode = false;
            // document.getElementById('rightShapeImage').src = this.gShapeImage;
            // document.getElementById('btmShapeImage').src = this.gShapeImage;
            $('#rightShapeImage').show();
            $('#btmShapeImage').show();
            if (pRowNo >= 0) {
              var lItem = dataViewCTS.getItem(pRowNo);
              if (this.gShapeCode != lItem.BarShapeCode) {
                lItem.MeshShapeParameters = this.gShapeParameters;
                lItem.MeshEditParameters = this.gShapeEditParameters;
                lItem.MeshShapeMaxValues = this.gShapeMaxValues;
                lItem.MeshShapeMinValues = this.gShapeMinValues;
                lItem.MeshShapeParamTypes = this.gShapeParamTypes;
                lItem.MeshShapeWireTypes = this.gShapeWireTypes;
                lItem.MeshCreepMO1 = this.gMeshCreepMO1;
                lItem.MeshCreepCO1 = this.gMeshCreepCO1;
                this.CheckParameters(this.gShapeParameters, gridCTSMesh);
                dataViewCTS.beginUpdate();
                dataViewCTS.updateItem(lItem.id, lItem);
                dataViewCTS.endUpdate();
              }
            }
            this.gShapeCode = this.bShapeCode[i];
            lFoundShape = 1;
            break;
          }
        }
      }

      if (lFoundShape == 0) {
        var lCustomerCode = this.CustomerCode;
        var lProjectCode = this.ProjectCode;
        var lOrder = this.OrderNumber;
        var lJobID = parseInt(lOrder);

        let response = await this.GetShapeInfo(
          lCustomerCode,
          lProjectCode,
          lJobID,
          pShapeCode
        );
        if (response == 'error') {
          alert('Get Shape information: Retrieve Database Error.');
        } else {
          this.CheckParameters(response.MeshShapeParameters, gridCTSMesh);
          this.gShapeParameters = response.MeshShapeParameters;
          this.gShapeEditParameters = response.MeshEditParameters;
          this.gShapeMaxValues = response.MeshShapeMaxValues;
          this.gShapeMinValues = response.MeshShapeMinValues;
          this.gShapeParamTypes = response.MeshShapeParamTypes;
          this.gShapeWireTypes = response.MeshShapeWireTypes;
          this.gMeshCreepMO1 = response.MeshCreepMO1;
          this.gMeshCreepCO1 = response.MeshCreepCO1;
          this.gShapeImage = this.convImg(response.MeshShapeImage);

          this.Imagename = pShapeCode;
          this.Imagename = this.Imagename + '.png';

          this.hideShapecode = false;
          // document.getElementById("rightShapeImage").src = gShapeImage;
          // document.getElementById("btmShapeImage").src = gShapeImage;
          $('#rightShapeImage').show();
          $('#btmShapeImage').show();

          if (pRowNo >= 0) {
            var lItem = dataViewCTS.getItem(pRowNo);
            if (this.gShapeCode != lItem.MeshShapeCode) {
              lItem.MeshShapeParameters = this.gShapeParameters;
              lItem.MeshEditParameters = this.gShapeEditParameters;
              lItem.MeshShapeMaxValues = this.gShapeMaxValues;
              lItem.MeshShapeMinValues = this.gShapeMinValues;
              lItem.MeshShapeParamTypes = this.gShapeParamTypes;
              lItem.MeshShapeWireTypes = this.gShapeWireTypes;
              lItem.MeshCreepMO1 = this.gMeshCreepMO1;
              lItem.MeshCreepCO1 = this.gMeshCreepCO1;

              dataViewCTS.beginUpdate();
              dataViewCTS.updateItem(lItem.id, lItem);
              dataViewCTS.endUpdate();
            }
          }
          this.gShapeCode = response.MeshShapeCode;

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
        }
      }
    } else {
      this.hideShapecode = true;
      $('#rightShapeImage-').hide();
      $('#btmShapeImage').hide();
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

  async GetShapeInfo(
    lCustomerCode: any,
    lProjectCode: any,
    lJobID: number,
    pShapeCode: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .GetShapeInfo(lCustomerCode, lProjectCode, lJobID, pShapeCode)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }
  reloadProjectDetails() {
    let lCustomerCode = this.CustomerCode;
    let lProjectCode = this.ProjectCode;
    this.orderService.GetProjectDetails(lCustomerCode, lProjectCode).subscribe({
      next: (response) => {
        console.log(response);
        this.gOrderSubmission = response.OrderSubmission;
        this.gOrderCreation = response.OrderCreation;

        let orderStatus = this.OrderStatus;
        let lScheduledProd = this.ScheduledProd;
        let gridCTSMesh = this.templateGrid.slickGrid;

        if (
          (((orderStatus == 'New' || orderStatus == 'Created') &&
            this.gOrderCreation == 'Yes') ||
            (orderStatus == 'Sent' && this.gOrderSubmission == 'Yes')) &&
          lScheduledProd != 'Y'
        ) {
          // gridCTSMesh.setOptions({
          //     editable: true,
          //     autoEdit: true
          // });
        } else {
          // gridCTSMesh.setOptions({
          //     editable: false,
          //     autoEdit: false
          // });
        }
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  async GetCarpetDetailsNSH(
    CustomerCode: any,
    ProjectCode: any,
    PostID: number
  ): Promise<any> {
    try {
      const data = await this.orderService
        .GetCarpetDetailsNSH(CustomerCode, ProjectCode, PostID)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

  getJobId(orderNumber: string): any {
    // Call the function to get the PostHeaderId
    let ProdType = this.ProductType;
    let StructurEelement = this.StructureElement;
    let ScheduleProd = this.ScheduleProd;
    this.orderService
      .getJobId(orderNumber, ProdType, StructurEelement, ScheduleProd)
      .subscribe({
        next: (response: any) => {
          // this.JobID = response.MESHJobID;
          this.PostID = response.PostHeaderID;
        },
        error: () => {},
        complete: () => {
          this.getTableData();
        },
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

  GetShapeImage() {
    if (this.Imagename) {
      return 'assets/images/Shapes/' + this.Imagename;
      // return '../../../assets/images/Shapes/F.PNG';
      // return '../../../assets/images/Shapes/N.PNG';
    }
    return '';
  }

  ClickContextMenu(lFuncs: string) {
    let dataViewCTS = this.dataViewCAR;
    let gridCTSMesh = this.templateGrid.slickGrid;
    if (lFuncs == 'insert') {
      // InsertItem();
    } else if (lFuncs == 'delete') {
      // DeleteMeshDetails();
    } else if (lFuncs == 'clear') {
      // ClearMeshDetails()
    } else if (lFuncs == 'copy') {
      // MeshCopy();
    } else if (lFuncs == 'paste') {
      // MeshPaste();
    } else if (lFuncs == 'weight') {
      var lRows = gridCTSMesh.getSelectedRows();
      var lMaxRowNo = 0;
      var lWeight = 0;
      if (lRows.length > 0) {
        for (var i = 0; i < lRows.length; i++) {
          if (lMaxRowNo < lRows[i]) {
            lMaxRowNo = lRows[i];
          }
          var lItem = gridCTSMesh.getDataItem(lRows[i]);
          if (lItem.MeshTotalWT != null) {
            if (lItem.MeshTotalWT > 0) {
              lWeight = lWeight + parseFloat(lItem.MeshTotalWT);
            }
          }
        }
        var lItem = gridCTSMesh.getDataItem(lMaxRowNo);
        lItem.Remarks = (Math.round(lWeight * 1000) / 1000).toFixed(3);
        dataViewCTS.updateItem(lItem.id, lItem);

        gridCTSMesh.invalidateRow(lMaxRowNo);
        gridCTSMesh.render();
      }
    } else if (lFuncs == 'qty') {
      var lRows = gridCTSMesh.getSelectedRows();
      var lMaxRowNo = 0;
      var lQty = 0;
      if (lRows.length > 0) {
        for (var i = 0; i < lRows.length; i++) {
          if (lMaxRowNo < lRows[i]) {
            lMaxRowNo = lRows[i];
          }
          var lItem = gridCTSMesh.getDataItem(lRows[i]);
          if (lItem.MeshMemberQty != null) {
            if (lItem.MeshMemberQty > 0) {
              lQty = lQty + lItem.MeshMemberQty;
            }
          }
        }
        var lItem = gridCTSMesh.getDataItem(lMaxRowNo);
        lItem.Remarks = lQty;
        dataViewCTS.updateItem(lItem.id, lItem);

        gridCTSMesh.invalidateRow(lMaxRowNo);
        gridCTSMesh.render();
      }
    }
  }
}
