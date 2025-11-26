import { HttpClient } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, Renderer2, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { add_ProductMark_Drain } from 'src/app/Model/add_Productmark_Drain';
import { ADD_SLAB_STRUCTURE_MARKING } from 'src/app/Model/add_slabStructureMarking';
import { BomData } from 'src/app/Model/BomData';
import { GenerateOtherDrainProduct } from 'src/app/Model/GenerateOtherDrainProduct';
// import { any } from 'src/app/Model/any';
import { Insert_Main_Drain } from 'src/app/Model/Insert_Main_Drain';
import { Slab_ProductCode } from 'src/app/Model/productcode';
import { ShapeCodeParameterSet } from 'src/app/Model/ShapeCodeParameterSet';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/SharedComponent/ConfirmBox/confirm-dialog.component';
import { environment } from 'src/environments/environment';
// import { SlabStructureMarklist } from 'src/app/Model/slabstructureMarklist';
import { DetailingService } from '../../DetailingService';
import { DrainService } from '../../MeshDetailing/drain-service.service';
import { GroupMarkComponent } from '../../MeshDetailing/addgroupmark/addgroupmark.component';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { LoginService } from 'src/app/services/login.service';
import { filter } from 'rxjs';


// import {  } from '../../BOM/bom';


@Component({
  selector: 'app-drain',
  templateUrl: './drain.component.html',
  styleUrls: ['./drain.component.css']
})
export class DrainComponent {


  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;

  SelectedTab:string='ProductMark'
  DetailingID: any;
  StructureElementId: any;
  ProjectId: any;
  @Input() ParameterSetNo: any;
  loading: any;
  enableEditIndex: any

  
  @ViewChild('strucuremarkingInput')
  strucuremarkingInput!: ElementRef;

  Imagename: any;
  editprod: boolean = false;

  ShapeParamlist: any

  ParameterSetList: any;
  expandRow:any=0;


  ParameterSetData: any = null;
  Changed_ParameterSet: any;
  selected_ParameterSet: any;

  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;

  SlabImageList: any[] = []
  shapeSelected = false;
  parameterList: any[] = [];

  slabStructureMarklist: any[] = [1];
  structlist: any

  showImage: boolean = false;
  isExpand = false;
  img_link: any[] = [];
  img_index: number = 0;
  Slabproductcode_dropdown: any[] = [];
  Slabshapecode_dropdown: any[] = [];
  storedObjectData: any
  MeshData: any;
  enableEditIndexCol: number = -1;
  enableEditIndexmain: number = -1;
  lastElement: any;
  strIsReadOnly: any = "NO";
  isaddnewRecord: boolean = false;
  isupdateRecord: boolean = false;
  ProductTypeID: number = 0;
  popup_MWLength: number | undefined;
  popup_CWLength: number | undefined;
  popup_MO1: any
  popup_MO2: any
  popup_CO1: any
  popup_CO2: any

  mainWireTotal: number = 0;
  crossWireTotal: number = 0;
  noOfMainWire: number = 0;
  noOfCrossWire: number = 0;
  editShapeParam: boolean = false
  selectedproductCode: any;
  strQueryString: string | undefined;
  enableDrainEditIndex_ProductMark:any=-1;
  enableDrainEditIndex_OtherProductMark:any=-1
  userId:any;


  pushElement: any =

    [
      {
        marking:'',
        Chainage:{
          start:'',
          end:''
        },
        TopLevel:{
          start:'',
          end:''
        },
        InvertLevel:{
          start:'',
          end:''
        },
        Height:{
          start:'',
          end:''
        },
        Depth:{
          start:'',
          end:''
        },
        CrossLength:{
          Inner:'',
          Outer:'',
          Slab:'',
          Base:''
        },
        Distance:'',
        Qty:''


      }
    ];
    isTooltipHidden:any=true

    isCascade:any={
      cascadeNo:true,
      dropHeight:true,
      width:true,
      crossLen:true
    }

  elementDetails: any;
  intTopCover: any;
  intBottomCover: any;
  intLeftCover: any;
  intRightCover: any;
  intLeg: any;
  intGap1: any;
  intHook: any;
  intRecordCount: number = 0;
  objSlabShapeCode: any;
  result: any
  IntGroupMarkId: number | undefined
  selectedShapeCode: any;
  Drain_Data: any[]=[{
    intStructureMarkId: 0,
    intSEDetailingID: 0,
    tntStructureRevNo: 0,
    vchStructureMarkingName: '',
    tntParamSetNumber: 0,
    decStartChainage: 0,
    decEndChainage: 0,
    decDistance: 0,
    decStartTopLevel: 0,
    decEndTopLevel: 0,
    decStartInvertLevel: 0,
    decEndInvertLevel: 0,
    decStartHeight: 0,
    decEndHeight: 0,
    decStartDepth: 0,
    decEndDepth: 0,
    intCascadeNo: 0,
    decCascadeDropHeight: 0,
    decCascadeWidth: 0,
    decCascadeCWLength: 0,
    bitCascade: false,
    bitCoatingIndicator: false,
    bitBendingCheck: false,
    bitMachineCheck: false,
    bitTransportCheck: false,
    vchDrawingReference: '',
    chrDrawingVersion: '',
    vchDrawingRemarks: '',
    bitAssemblyIndicator: false,
    bitProduceIndicator: false,
    intArmaid: 0,
    CascadeBit: '',
    intParameterSet: 0,
    bitCrossLenInner: false,
    bitCrossLenOuter: false,
    bitCrossLenSlab: false,
    bitCrossLenBase: false,
    decCrossLenInner: 0,
    decCrossLenOuter: 0,
    decCrossLenSlab: 0,
    decCrossLenBase: 0,
    intMemberQty: 0,

  }];

  Drain_Insert_Update: Insert_Main_Drain[]=[{
    intStructureMarkId: 0,
    intSEDetailingID: 0,
    tntStructureRevNo: 0,
    intGroupMarkId: 0,
    tntGroupRevNo: 0,
    vchStructureMarkingName: '',
    intParamSetNumber: 0,
    decStartChainage: 0,
    decEndChainage: 0,
    decDistance: 0,
    decStartTopLevel: 0,
    decEndTopLevel: 0,
    decStartInvertLevel: 0,
    decEndInvertLevel: 0,
    decStartHeight: 0,
    decEndHeight: 0,
    decStartDepth: 0,
    decEndDepth: 0,
    bitCascade: false,
    intCascadeNo: 0,
    decCascadeDropHeight: 0,
    decCascadeWidth: 0,
    decCascadeCWLength: 0,
    bitCrossLenInner: false,
    decCrossLenInner: 0,
    bitCrossLenOuter: false,
    decCrossLenOuter: 0,
    bitCrossLenSlab: false,
    decCrossLenSlab: 0,
    bitCrossLenBase: false,
    decCrossLenBase: 0,
    bitCoatingIndicator: false,
    bitBendingCheck: false,
    bitMachineCheck: false,
    bitTransportCheck: false,
    intMemberQty: 1,
    tntStatusId: 0,
    vchDrawingReference: '',
    chrDrawingVersion: '',
    vchDrawingRemarks: '',
    bitAssemblyIndicator: false,
    nvchProduceIndicator: '',
    intUserID: 0,

  }]
  GenerateOtherDrainProduct:GenerateOtherDrainProduct={
    strProductMarkName: '',
    vchMeshShape: '',
    intShapeId: 9,
    strMWLen: '',
    strCWLen: '',
    strMWSpace: '',
    strCWSpace: '',
    strMWDia: '',
    strCWDia: '',
    strMO1: '',
    strMO2: '',
    strCO1: '',
    strCO2: '',
    strProductMarkId: '',
    intStructureMarkId: 0,
    strProductCodeId: '',
    blnTC: true,
    blnBC: true,
    blnMC: true,
    strShapeCode: '',
    strProductCode: '',
    intTransHeaderId: 0,
    TotMeshQty: 0,
    strSequence: '',
    strParamValues: '',
    strCriticalIndicator: '',
    intParameterSet: 0,
    tntStructureRevNo: 0,
    strUserId: '',
    strPrdInd: 'Yes',
    bitOHVal: ''
  }
  disableparamterset:boolean=false;
  ParameterSet:any;
  enableDrainEditIndex:any;
  parameterSet_values: any[]=[];
  intStructuremarkID: any;
  Shapecode_list: any[]=[];
  ProductCode_list:any[]=[]
  ProductCode_elements_Save: any;
  ShapeParamString: any;
  selectedproductCode_Edit: any;
  ProductCode_elements_Edit: any;
  ShapeParamlist_edit: any;
  Mode: any;
  objSlabShapeCode_edit: any;
  i: number=-1;
  j: number=-1;
  backup_mainDrain: any[]=[];
  Layers: any;
  page_Productmark = 1;
  currentPage_Productmark = 1;
  
  itemsPerPage_Productmark: any=10;
  pageSize_Productmark: any=0;


  constructor(public httpClient: HttpClient,
    private modalService: NgbModal,
    public detailingService: DetailingService,
    public drainService:DrainService,
    private tosterService: ToastrService,
    public dialog: MatDialog,
    public router: Router,
    private reloadService: ReloadService,
    private el: ElementRef,
    private renderer: Renderer2,
    private loginService: LoginService
  )
  {

  }

  showDetails(item: any) {
    item.ProductGenerationStatus = !item.ProductGenerationStatus
  }


  ngOnInit() {

    this.reloadService.ReloadDetailingGM$.subscribe((data) => {
      this.loadInitialData();
    });
    debugger;
    this.loadInitialData();
  }


  loadInitialData()
  {
    this.userId = this.loginService.GetUserId()

    this.intRecordCount = Number(localStorage.getItem('PostedGM'));

    if (this.intRecordCount > 0) {
      this.strIsReadOnly = 'YES'
    }
    this.storedObjectData = localStorage.getItem('MeshData');

    this.MeshData = JSON.parse(this.storedObjectData);
    console.log("meshdata" + this.MeshData)
    this.IntGroupMarkId = this.MeshData.INTGROUPMARKID;
    this.DetailingID = this.MeshData.INTSEDETAILINGID
    this.StructureElementId = this.MeshData.INTSTRUCTUREELEMENTTYPEID
    this.ProjectId = this.MeshData.INTPROJECTID
    this.ProductTypeID = this.MeshData.SITPRODUCTTYPEID

    this.Get_Parameters_Drain();
    this.Get_SWShapeCode();
    this.Get_SWProductCode();
    this.Load_Drain_Data(this.MeshData.VCHGROUPMARKINGNAME,this.ProjectId,this.DetailingID,this.MeshData.INTGROUPMARKID);
    this.Load_DrainParamDepthValues(this.MeshData.INTGROUPMARKID,this.MeshData.TNTPARAMSETNUMBER)
    // this.Get_ShapeparamList(9,'S');

  }

  changeProductCode(Product: any,Mode:any) {
    debugger;
    if (this.ProductCode_list.length > 0) {
      this.selectedproductCode = this.ProductCode_list.find((x: any) => x.intProductCodeId == Product).vchProductCode;
      this.Get_OthProductCode(this.selectedproductCode,Mode);
    }
    else{
      this.selectedproductCode_Edit = this.ProductCode_list.find((x: any) => x.intProductCodeId == Product).vchProductCode;
      this.Get_OthProductCode(this.selectedproductCode_Edit,Mode);

    }

  }
  loadCollapsabledata(item: any) {

    debugger;

    this.detailingService.GetSlabStructureMarkingDetailsColl(item.INTSTRUCTUREMARKID).subscribe({
      next: (response) => {

        //console.log("Tanmay");
        item.SlabProduct = response;
        for (var i = 0; i < item.SlabProduct.length; i++) {
          item.SlabProduct[i].isEdit = false;
        }
        //console.log(item.SlabProduct);

      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        this.loading = false;
        this.lastElement = this.slabStructureMarklist[this.slabStructureMarklist.length - 1];
        this.initialDataInsert();

      },
    });



  }
  onCopy(item: any) {
    debugger;
    this.detailingService.Copy_ProductMarking(item, 4).subscribe({
      next: (response) => {
        debugger;


      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
      },
    });
  }
  Changeparam(event: any) {
    // this.shapeParameter = event;


    this.shapeSelected = true;
    this.showImage = true;
    this.pushElement.shape = event;
    this.img_index = event;




  }

 validateNewRecord() {
    debugger;
    if (this.pushElement.marking !== "" && this.pushElement.Product !== "" && this.pushElement.main !== ""
      && this.pushElement.cross !== "" && this.pushElement.qty !== "" && this.pushElement.shape !== "" && this.pushElement.pinsize !== "") {
      let Index = this.ShapeParamlist.findIndex((x: any) => x.EditFlag === true && x.ParameterValue == '');
      if (Index !== -1) {
        if (this.ShapeParamlist[Index].ParameterValue == 0) {
          return 3;
        }
      }
      return 1;
    }
    else {
      return 2;
    }
  }

  Load_SlabproductCodeDropdown(event: any) {
    debugger;
    this.detailingService.Get_slabproductcode_dropdown(event).subscribe({
      next: (response) => {
        debugger;
        this.Slabproductcode_dropdown = response;
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        if (this.Slabshapecode_dropdown.length > 0) {
          this.ShapeParamlist = null;
          debugger;
          this.ShapeParamlist = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.lastElement.SlabProduct[0].shapecode.ShapeID).ShapeParam;

          this.Imagename = "";
          this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
          this.loadMainFile(this.Imagename);

        }

      },
    });
  }
  Load_slabShapecodeCodeDropdown() {
    //event=event.value;
    debugger;
    this.detailingService.Get_SlabShapecode_dropdown().subscribe({
      next: (response) => {
        debugger;
        this.Slabshapecode_dropdown = response;

      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {

      },
    });
  }

  // onSave(slabprod: any, structmark: any) {
  //   debugger;
  //   this.isupdateRecord = true;
  //   if (this.ValidateUpdateInput(slabprod) == 1) {

  //     slabprod.shapecode = this.Slabshapecode_dropdown.find(x => x.ShapeID === this.ShapeParamlist[0].ShapeId)
  //     let ind = this.structlist.findIndex((x: { INTSTRUCTUREMARKID: any; }) => x.INTSTRUCTUREMARKID === structmark.INTSTRUCTUREMARKID)
  //     structmark = this.structlist[ind];


  //     const obj = {
  //       slabprod: slabprod,
  //       structureMark: structmark,
  //       ParameterSet: this.ParameterSetNo,
  //     }

  //     this.detailingService.Update_StructureMarking(obj, this.DetailingID).subscribe({
  //       next: (response) => {
  //         debugger;
  //       },
  //       error: (e) => {
  //         //console.log("error", e);
  //         if (e.error === 'POSTED') {
  //           this.strIsReadOnly = 'YES';

  //           this.tosterService.error("The groupmarking is posted already.You cannot Edit a Strucutre Marking.")
  //         }
  //         else if (e.error === 'DUPLICATE') {
  //           this.tosterService.error("The structure marking name already exist. Please refresh.")
  //         }
  //         else {
  //           this.tosterService.error(e.error);
  //         }
  //       },
  //       complete: () => {
  //         this.tosterService.success("Slab updated Successfully.");

  //       },
  //     });
  //     this.enableEditIndexCol = -1;
  //     this.enableEditIndexmain = -1;
  //   }
  //   else if (this.ValidateUpdateInput(slabprod) == 3) {
  //     this.tosterService.warning('Please enter Value of Shape Parameter.')
  //   }
  // }
  ValidateUpdateInput(itemRow: any) {

    if (itemRow.BOMIndicator !== "" && itemRow.MWLength !== "" && itemRow.CWLength !== "" && itemRow.MemberQty !== "" &&
      itemRow.ProductionMO1 !== "" && itemRow.ProductionMO2 !== "" && itemRow.ProductionCO1 !== "" && itemRow.ProductionCO2 !== "" && itemRow.shapecode.ShapeID !== "") {
      let Index = this.ShapeParamlist.findIndex((x: any) => x.EditFlag === true && x.ParameterValue == '');

      if (Index !== -1) {
        if (this.ShapeParamlist[Index].ParameterValue == 0) {
          return 3;
        }
      }

      return 1;
    }
    else {
      return 2;
    }

  }
  onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    // this.enableEditIndex = null;
  }


  onPageChange_Productmark(pageNum: number): void {
    this.pageSize_Productmark = this.itemsPerPage_Productmark * (pageNum - 1);
  }
  OnPageSizeChange_Productmark(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    // this.enableEditIndex = null;
  }
  initialDataInsert() {
    // debugger;
    // console.log(this.lastElement)
    // let copiedObject = this.lastElement.StructureMarkingName;
    // let lstchar = this.lastElement.StructureMarkingName.slice(-1);
    // copiedObject = copiedObject?.slice(0, -1);
    // let tempChar: any;
    // if (!this.isNumber(lstchar)) {
    //   tempChar = this.nextChar(lstchar.toUpperCase());
    //   tempChar = tempChar.toUpperCase();
    // }
    // else {
    //   tempChar = Number(lstchar) + 1;
    // }
    // copiedObject = copiedObject + tempChar;
    // this.Load_SlabproductCodeDropdown(this.lastElement.ProductCode.ProductCodeName);

    // this.pushElement.marking = copiedObject//this.lastElement.StructureMarkingName;
    // this.pushElement.main = this.lastElement.MainWireLength;
    // this.pushElement.cross = this.lastElement.CrossWireLength;
    // this.pushElement.qty = this.lastElement.MemberQty;;
    // this.pushElement.Product = this.lastElement.ProductCode.ProductCodeId;

    // this.pushElement.shape = this.lastElement.SlabProduct[0].shapecode.ShapeID;
    // this.popup_MWLength = this.lastElement.MainWireLength;
    // this.popup_CWLength = this.lastElement.CrossWireLength;
    // this.selectedproductCode = this.lastElement.ProductCode;
    // this.selectedShapeCode = this.lastElement.SlabProduct[0].shapecode;


  }
  isNumber(char: any) {
    return /^\d+$/.test(char);
  }
  nextChar(c: any) {
    return String.fromCharCode(((c.charCodeAt(0) + 1 - 65) % 25) + 65);
  }
  Editcancel(item: any) {
    //console.log("this is collapsable ", item);
    this.Drain_Data = JSON.parse(JSON.stringify(this.backup_mainDrain));
    this.enableDrainEditIndex = -1;

  }

  Editcancel_ProductMark(item: any) {
    this.enableDrainEditIndex_ProductMark=-1;

  }
  Editcancel_OtherProductMark(item: any) {
    this.enableDrainEditIndex_OtherProductMark=-1;

  }

  // ChangeShapeCode(event: any, shapeList: any) {

  //   this.objSlabShapeCode = shapeList.find((x: any) => x.ShapeID === event);
  //   if (shapeList.length > 0) {
  //     this.ShapeParamlist = shapeList.find((x: any) => x.ShapeID === event).ShapeParam;
  //     this.Imagename = "";
  //     this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
  //     this.loadMainFile(this.Imagename);

  //   }

  //   this.shapeSelected = true;
  //   this.showImage = true;

  // }
  loadMainFile(Imagename: any) {
    //debugger;
    this.httpClient.get('/assets/images/Shapes/' + Imagename + '.png').subscribe(() => {
      this.Imagename = Imagename + '.png'
    }, (err) => {
      // HANDLE file not found
      if (err.status === 200) {
        this.Imagename = Imagename + '.png'
      }
      else if (err.status === 404) {
        this.loadSecondFile(Imagename);
      }
    });
  }

  loadSecondFile(Imagename: any) {
    this.httpClient.get('/assets/images/Shapes/' + Imagename + '.PNG').subscribe(() => {
      this.Imagename = Imagename + '.PNG'
    }, (err) => {
      // HANDLE file not found
      if (err.status === 200) {
        this.Imagename = Imagename + '.PNG'
      }
      if (err.status === 404) {

      }
    });
  }
  // changeShapcode(shapeId: any) {
  //   debugger;
  //   this.ShapeParamlist = this.Slabshapecode_dropdown.find(x => x.ShapeID === shapeId).ShapeParam;

  //   this.Imagename = this.ShapeParamlist[0].ShapeCodeImage + '.png';

  //   this.showImage = true;

  // }

  LoadSlabParameterSet(projectID: any) {
    //
    let productTypeID = 7
    this.detailingService.Get_ParameterSet_dropdown(projectID, productTypeID).subscribe({
      next: (response) => {
        //console.log(response);
        this.ParameterSetList = response;
        //console.log("column Paramter Set");
        //console.log(this.ParameterSetList);
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        this.loading = false;
        this.selected_ParameterSet = this.ParameterSetList.find((x: any) => x.INTPARAMETESET === this.ParameterSetNo.INTPARAMETESET);
        //console.log("select parameter set ", this.selected_ParameterSet);
        if (this.selected_ParameterSet !== undefined && this.selected_ParameterSet.length > 0) {
          this.intTopCover = this.selected_ParameterSet.TopCover;
          this.intBottomCover = this.selected_ParameterSet.BottomCover;
          this.intLeftCover = this.selected_ParameterSet.LeftCover;
          this.intRightCover = this.selected_ParameterSet.RightCover;
          this.intLeg = this.selected_ParameterSet.Leg;

        }

      },
    });
  }
  deleteSlabStructure(id: any) {

    this.detailingService.Delete_StructureMarking(id).subscribe({
      next: (response) => {
        debugger;
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        this.tosterService.success("Drain Structure Deleted Successfully.");
        this.initialDataInsert();
      },
    });
  }
  SendParameters(item: any) {
    debugger;
    item.StructureElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE;
    let BomData:BomData = {
      StructureElement: item.StructureElement,
      ProductMarkId: item.ProductMarkId,
      CO1: item.CO1,
      CO2: item.CO2,
      MO1: item.MO1,
      MO2: item.MO2,
      ParamValues: item.ParamValues,
      ShapeCodeName: item.shapecode.ShapeCodeName,
      ShapeID: item.shapecode.ShapeID
    }
    localStorage.setItem('BomData', JSON.stringify(BomData));

  }
  MainWire_lostfocus(MWLength: any) {
    this.popup_MWLength = MWLength

  }
  CrossWire_lostfocus(CWLength: any) {
    this.popup_CWLength = CWLength;
  }
  saveButton_Click() {

    this.showImage=false;

    if(this.Mode==='S')
    {
      this.GenerateOtherDrainProduct.strMO1 = this.popup_MO1.toString()
      this.GenerateOtherDrainProduct.strMO2 = this.popup_MO2.toString()
      this.GenerateOtherDrainProduct.strCO1 = this.popup_CO1.toString()
      this.GenerateOtherDrainProduct.strCO2 = this.popup_CO2.toString()
    }

    // this.mainWireTotal = 0;
    // this.crossWireTotal = 0;
    // this.noOfMainWire = 0;
    // this.noOfCrossWire = 0;
    // this.editShapeParam = true;

    // this.noOfMainWire = Number(this.popup_MWLength) / Number(this.selectedproductCode.CWSpacing);
    // this.noOfCrossWire = Number(this.popup_CWLength) / Number(this.selectedproductCode.MainWireSpacing);

    // if (this.editShapeParam == true) {
    //   if (this.popup_MWLength == null || this.popup_MWLength == undefined) {
    //     this.tosterService.error("Please enter the mw length.");
    //     //  MessageBox.Show("Please enter the mw length.", "NDS", MessageBoxButton.OK);
    //     return;
    //   }
    //   if (this.popup_CWLength == null || this.popup_CWLength == undefined) {
    //     this.tosterService.error("Please enter the cw length.");
    //     return;
    //   }
    //   if (this.popup_MO1 == null || this.popup_MO1 == undefined) {
    //     this.tosterService.error("Please enter the MO1.");
    //     return;
    //   }
    //   if (this.popup_MO2 == null || this.popup_MO2 == undefined) {
    //     this.tosterService.error("Please enter the MO2.");
    //     return;
    //   }
    //   if (this.popup_CO1 == null || this.popup_CO1 == undefined) {
    //     this.tosterService.error("Please enter the CO1.");
    //     return;
    //   }
    //   if (this.popup_CO2 == null || this.popup_CO2 == undefined) {
    //     this.tosterService.error("Please enter the CO2.");
    //     return;
    //   }
    //   console.log(this.objSlabShapeCode.ShapeParam)

    //   debugger;
    //   for (let param of this.objSlabShapeCode.ShapeParam) {
    //     console.log(param);
    //     if (param.WireType == "M" && param.AngleType == "S") {
    //       this.mainWireTotal = this.mainWireTotal + Number(param.ParameterValue);
    //     }
    //   }

    //   for (let param of this.objSlabShapeCode.ShapeParam) {
    //     if (param.WireType == "C" && param.AngleType == "S") {
    //       this.crossWireTotal = this.crossWireTotal + Number(param.ParameterValue);
    //     }
    //   }
    //   if (this.mainWireTotal != 0) {

    //     if (this.mainWireTotal != Number(this.popup_MWLength)) {
    //       const message = `Sum of parameter values not equal to MainWire length. Do you want to continue?`;

    //       const dialogData = new ConfirmDialogModel("Confirm Action", message);

    //       const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //         maxWidth: "400px",
    //         data: dialogData
    //       });

    //       dialogRef.afterClosed().subscribe(dialogResult => {
    //         this.result = dialogResult;
    //         console.log(this.result);
    //         if (!this.result) {
    //           return;
    //         }

    //       });


    //     }
    //   }
    //   if (this.crossWireTotal != 0) {
    //     if (this.crossWireTotal != Number(this.popup_CWLength)) {
    //       const message = `Sum of parameter values not equal to CrossWire length. Do you want to continue?`;
    //       const dialogData = new ConfirmDialogModel("Confirm Action", message);
    //       const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //         maxWidth: "400px",
    //         data: dialogData
    //       });

    //       dialogRef.afterClosed().subscribe(dialogResult => {
    //         this.result = dialogResult;
    //         console.log(this.result);
    //         if (!this.result) {
    //           return;
    //         }
    //       });


    //     }
    //   }
    //   console.log(this.selectedproductCode);

    //   if (((Number(this.popup_MWLength) - Number(this.popup_MO1) - Number(this.popup_MO2)) % Number(this.selectedproductCode.CrossWireSpacing)) != 0) {
    //     debugger;
    //     this.tosterService.warning("Please change MO1 or MO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
    //     return;
    //   }
    //   if (((Number(this.popup_CWLength) - Number(this.popup_CO1) - Number(this.popup_CO1)) % Number(this.selectedproductCode.MainWireSpacing)) != 0) {
    //     debugger;
    //     this.tosterService.warning("Please change CO1 or CO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
    //     return;
    //   }
    //   console.log(this.selectedproductCode);
    //   this.showImage = false

    // }



  }


  Report_Click() {
    debugger;
    let reporturl="http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fDrainProductDetails&rs:Command=Render&";

    this.strQueryString = environment.ReportUrl;
    this.strQueryString = reporturl +"INTCUSTOMERID="+ 0 +"&INTPROJECTID="+0 +"&INTCONTRACTID="+0+ "&INTGROUPMARKID=" + this.IntGroupMarkId + "&SITPRODUCTTYPEID="+this.ProductTypeID+"&ISSUMMARYREPORT=" + 0 + "&rc:Parameters=false ";
    console.log(this.strQueryString);
    window.open(this.strQueryString, "_blank");


  }
  NewGM_Click() {
    debugger;

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,      // centered: true,
      size: 'lg',

    }

    const modalRef = this.modalService.open(GroupMarkComponent, ngbModalOptions);
    modalRef.componentInstance.ProjectID = this.ProjectId;
    modalRef.componentInstance.CustomerID = this.MeshData.CustomerId;
    modalRef.componentInstance.ProjectName = this.MeshData.ProjectName;  //(this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).Description;
    modalRef.componentInstance.CustomerName = this.MeshData.CustomerName;
    modalRef.componentInstance.productType = this.MeshData.SITPRODUCTTYPEID;
    modalRef.componentInstance.structElement = this.MeshData.INTSTRUCTUREELEMENTTYPEID;
    modalRef.componentInstance.tntParameterSetNumber = this.MeshData.TNTPARAMSETNUMBER;

    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      console.log("van");
      debugger;
      let temp = localStorage.getItem('MeshData');
      let tempItem = JSON.parse(temp!.toString());

      console.log("temp", tempItem)


      // this.seDetailingID = this.MeshData.INTSEDETAILINGID
      // this.structElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE
      // localStorage.setItem('MeshData', JSON.stringify(this.transferObject));
      this.reloadService.reloadComponentDetailingGm.emit('');
      //this.router.navigate(['../DetailingGroupMark']);


    });





  }
  deleteSlabProduct(ProductMarkList: any, ProductMarkId: any) {
    if (ProductMarkList.length == 1) {
      const message = `Are you sure you want to delete the Last Product marking?.Corresponding Structure Mark will also be deleted`;
      const dialogData = new ConfirmDialogModel("Confirm Action", message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        console.log(this.result);
        if (!this.result) {
          return;
        }
        else {
          this.detailingService.Delete_SlabProductMarking(ProductMarkId, this.DetailingID).subscribe({
            next: (response) => {
              this.tosterService.success("Product Marking and Structure Mark deleted Successfully");
            },
            error: (e) => {
              console.log("error", e);
            },
            complete: () => {

            },
          });
        }
      });


    } else {
      const message = `Are you sure you want to delete the record.`;
      const dialogData = new ConfirmDialogModel("Confirm Action", message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        console.log(this.result);
        if (!this.result) {
          return;
        }
        else {
          this.detailingService.Delete_SlabProductMarking(ProductMarkId, this.DetailingID).subscribe({
            next: (response) => {
              this.tosterService.success("Product Marking deleted Successfully");
            },
            error: (e) => {
              console.log("error", e);
            },
            complete: () => {

            },
          });
        }
      });

    }


  }

  CheckShape()
  {
    console.log( this.selectedShapeCode);

    if (this.Slabshapecode_dropdown.length > 0) {
      this.ShapeParamlist = null;
      debugger;
      this.ShapeParamlist = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.selectedShapeCode.ShapeID).ShapeParam;

      if(this.ShapeParamlist[0].ShapeCodeImage=='F')
      {
        this.ShapeParamlist[0].ParameterValue=Number(this.pushElement.main);

      }
      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      this.loadMainFile(this.Imagename);

    }
  }
Load_Drain_Data(GroupMarkingName: any,ProjectId : any,SEDetailingId : any,GroupMarkID : any)
{
  this.loading = true;
  this.drainService.Get_StructMarkDetails(GroupMarkingName,ProjectId,SEDetailingId,GroupMarkID).subscribe({
    next: (response) => {
      this.Drain_Data = response;
      this.Drain_Data.forEach(element => {
        element.DrainProductMark=[];
        element.DrainOtherProductMark=[];
        element.isExpand = false;
        element.colorRow = false;
      });
      console.log("Drain Data",this.Drain_Data);

    },
    error: (e) => {
      this.loading = false;
    },
    complete: () => {
      this.loading = false;

      debugger;
      for (var i = 0; i < this.Drain_Data.length; i++) {
        if(this.expandRow == this.Drain_Data[i].intStructureMarkId){
          this.Drain_Data[i].isExpand = true;
          this.Get_ProductMark(this.Drain_Data[i]);
          this.Get_OtherProductMark(this.Drain_Data[i])
        }else if(this.Drain_Data.length-1 == i  && this.expandRow == 0){
          this.Drain_Data[i].isExpand = true;
          this.Get_ProductMark(this.Drain_Data[i]);
          this.Get_OtherProductMark(this.Drain_Data[i])
        }else{
          this.Drain_Data[i].isExpand = false;
        }

      }
      this.backup_mainDrain = JSON.parse(JSON.stringify(this.Drain_Data));

      this.initialDataInsert_Maindrain()

    },
  });
}
onChangeChainage(item:any)
{

  debugger;
  item.decDistance =  Number(item.decEndChainage) - (item.decStartChainage);
  item.decDistance  = this.roundToTwoDecimalPlaces(item.decDistance);

  
}
onSubmit(item:any)
{
  debugger;
  delete item.age;
  this.loading = true;

  if(item.vchStructureMarkingName.trim()=="")
  {
    this.loading = false;
    this.tosterService.warning("Please enter structuremarking name");
    return ;
  }

  if(item.intMemberQty==0)
  {
    this.loading = false;
    this.tosterService.warning("Please enter Quantity");
    return ;
  }

  item.intSEDetailingID= this.DetailingID;
  item.tntStructureRevNo= this.MeshData.TNTGROUPREVNO;
  item.intGroupMarkId= this.MeshData.INTGROUPMARKID;
  item.tntGroupRevNo= this.MeshData.TNTGROUPREVNO;
  item.intParamSetNumber=this.MeshData.TNTPARAMSETNUMBER;

  item.tntStatusId =1;
  item.intUserID = this.userId;


  this.drainService.SaveDrain_StructureMarking(item).subscribe({
    next: (response) => {
        this.intStructuremarkID=response;

    },
    error: (e) => {
      this.loading = false;
    },
    complete: () => {
      debugger;
      this.tosterService.success("Structure mark Inserted Successfully")
      const Insert_ProductMark:add_ProductMark_Drain={
        drainOuterCrossWire: item.decCrossLenOuter,
        drainInnerCrossWire: item.decCrossLenInner,
        drainSlabCrossWire: item.decCrossLenSlab,
        drainBaseCrossWire: item.decCrossLenBase,
        IsCascade: item.bitCascade,
        intCascadeNo: item.intCascadeNo,
        flCsCrossLength: item.decCascadeCWLength,
        flCsDropHeight: item.decCascadeDropHeight,
        flCsWidth: item.decCascadeWidth,
        startChainage: item.decStartChainage,
        endChainage: item.decEndChainage,
        startTopLevel: item.decStartTopLevel,
        endTopLevel: item.decEndTopLevel,
        startInvertLevel: item.decStartInvertLevel,
        endInvertLevel: item.decEndInvertLevel,
        structMarkingName: item.vchStructureMarkingName,
        txtMemQty: item.intMemberQty.toString(),
        startDepth: item.decStartDepth,
        endDepth: item.decEndDepth,
        tntStructureRevNo: 0,
        vchGroupMarkName: this.MeshData.VCHGROUPMARKINGNAME,
        intDrainStructureMarkId: this.intStructuremarkID,
        intParameterSet: this.MeshData.TNTPARAMSETNUMBER,
        bitTransportChk: false,
        bitBendingChk: false,
        bitProduceIndicator: false,
        bitMachineChk: false,
        intUserID: this.userId,
        drainTopCover: this.parameterSet_values[0].sitTopCover,
        drainBottomCover:this.parameterSet_values[0].sitBottomCover,
        drainOuterCover: this.parameterSet_values[0].sitOuterCover,
        drainInnerCover: this.parameterSet_values[0].sitInnerCover
      }
      this.drainService.SaveDrain_ProductMark(Insert_ProductMark).subscribe({
        next: (response) => {
        },
        error: (e) => {
          this.loading = false;
          this.tosterService.error(e.error);
        },
        complete: () => {
          this.loading = false;
          this.Load_Drain_Data(this.MeshData.VCHGROUPMARKINGNAME,this.ProjectId,this.DetailingID,this.MeshData.INTGROUPMARKID);
          this.tosterService.success("ProductMark mark updated Successfully")
          this.strucuremarkingInput.nativeElement.focus();


        },
      });

    },
  });



}
Delete_StructureMark(id:any)
{
  this.loading = true;
  this.expandRow=id;
  this.drainService.Delete_StructureMarking(id).subscribe({
    next: (response) => {

    },
    error: (e) => {
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
      this.Load_Drain_Data(this.MeshData.VCHGROUPMARKINGNAME,this.ProjectId,this.DetailingID,this.MeshData.INTGROUPMARKID);
      this.tosterService.success("Deleted Successfullly");


    },
  });
}
fnHeight(item:any,strMode:any) {
  debugger
  if (strMode == 'S') {
      var startHt = 0;
      // startHt = parseFloat(document.getElementById(intStartTopLevel).value) - parseFloat(document.getElementById(intStartInvertLevel).value);
      startHt = item.decStartTopLevel - item.decStartInvertLevel;


      if (startHt < 0) {
        startHt =   item.decStartInvertLevel - item.decStartTopLevel;
      }
      startHt = this.roundToTwoDecimalPlaces(startHt);

     item.decStartHeight = startHt;



      // var startDep = item.decStartHeight + parseFloat(parseFloat(document.getElementById('<%=hdnThickness.ClientID %>').value) / 1000) + parseFloat(parseFloat(document.getElementById('<%=hdnAdjust.ClientID %>').value) / 1000);
      var startDep = item.decStartHeight

      item.decStartDepth = startDep;
  }
  else if (strMode == 'E') {
      var endHt = 0;
      // endHt = parseFloat(document.getElementById(intEndTopLevel).value) - parseFloat(document.getElementById(intEndInvertLevel).value);
      endHt = item.decEndTopLevel - item.decEndInvertLevel;

      if (endHt < 0) {

          // endHt = parseFloat(document.getElementById(intEndInvertLevel).value) - parseFloat(document.getElementById(intEndTopLevel).value);
          endHt = item.decEndInvertLevel - item.decEndTopLevel;

        }
      // document.getElementById(intEndHeight).value = roundNumber(endHt, 3);
      endHt = this.roundToTwoDecimalPlaces(endHt);

      item.decEndHeight = endHt;
      // var endDep = parseFloat(document.getElementById(intEndHeight).value) + parseFloat(parseFloat(document.getElementById('<%=hdnThickness.ClientID %>').value) / 1000) + parseFloat(parseFloat(document.getElementById('<%=hdnAdjust.ClientID %>').value) / 1000);
      item.decEndDepth = item.decEndHeight

  }
}
onEdit(item: any, index: any) {
  debugger
  this.enableDrainEditIndex = index;



}
onEdit_Productmark(item:any,index:any)
{
  debugger;
  this.enableDrainEditIndex_ProductMark=index;
}
onEdit_OtherProductmark(item:any,index:any)
{
  debugger;
  this.enableDrainEditIndex_OtherProductMark=index;
  this.Get_OthProductCode(item.vchProductCode,'E');
}
Update(item:any,index:any)
{
  this.expandRow = item.intStructureMarkId;
this.loading = true;
  if(item.vchStructureMarkingName.trim()=="")
  {
    this.loading = false;
    this.tosterService.warning("Please enter structuremarking name");
    return ;
  }

  if(item.intMemberQty==0)
  {
    this.loading = false;
    this.tosterService.warning("Please enter Quantity");
    return ;
  }
const update_Obj:Insert_Main_Drain={
  intStructureMarkId: item.intStructureMarkId,
  intSEDetailingID: item.intSEDetailingID,
  tntStructureRevNo: 1,//item.tntStructureRevNo,
  intGroupMarkId: this.MeshData.INTGROUPMARKID,
  tntGroupRevNo: this.MeshData.TNTGROUPREVNO,
  vchStructureMarkingName:item.vchStructureMarkingName,
  intParamSetNumber: item.tntParamSetNumber,
  decStartChainage: item.decStartChainage,
  decEndChainage: item.decEndChainage,
  decDistance: item.decDistance,
  decStartTopLevel: item.decStartTopLevel,
  decEndTopLevel: item.decEndTopLevel,
  decStartInvertLevel: item.decStartInvertLevel,
  decEndInvertLevel: item.decEndInvertLevel,
  decStartHeight: item.decStartHeight,
  decEndHeight: item.decEndHeight,
  decStartDepth: item.decStartDepth,
  decEndDepth: item.decEndDepth,
  bitCascade: item.bitCascade,
  intCascadeNo: item.intCascadeNo,
  decCascadeDropHeight: item.decCascadeDropHeight,
  decCascadeWidth: item.decCascadeWidth,
  decCascadeCWLength: item.decCascadeCWLength,
  bitCrossLenInner: item.bitCrossLenInner,
  decCrossLenInner: item.decCrossLenInner,
  bitCrossLenOuter: item.bitCrossLenOuter,
  decCrossLenOuter: item.decCrossLenOuter,
  bitCrossLenSlab: item.bitCrossLenSlab,
  decCrossLenSlab: item.decCrossLenSlab,
  bitCrossLenBase: item.bitCrossLenBase,
  decCrossLenBase: item.decCrossLenBase,
  bitCoatingIndicator: item.bitCoatingIndicator,
  bitBendingCheck: item.bitBendingCheck,
  bitMachineCheck: item.bitMachineCheck,
  bitTransportCheck: item.bitTransportCheck,
  intMemberQty: item.intMemberQty,
  tntStatusId: 1,
  vchDrawingReference:item.vchDrawingReference,
  chrDrawingVersion: item.chrDrawingVersion,
  vchDrawingRemarks: item.vchDrawingRemarks,
  bitAssemblyIndicator: item.bitAssemblyIndicator,
  nvchProduceIndicator: "",
  intUserID:this.userId,

}
this.drainService.SaveDrain_StructureMarking(update_Obj).subscribe({
  next: (response) => {


  },
  error: (e) => {
    this.tosterService.error("error ouucured")
    this.loading = false;
  },
  complete: () => {

    this.tosterService.success("Structure mark updated successfully")
    const Insert_ProductMark:add_ProductMark_Drain={
      drainOuterCrossWire: item.decCrossLenOuter,
      drainInnerCrossWire: item.decCrossLenInner,
      drainSlabCrossWire: item.decCrossLenSlab,
      drainBaseCrossWire: item.decCrossLenBase,
      IsCascade: false,
      intCascadeNo: 0,
      flCsCrossLength: 0,
      flCsDropHeight: 0,
      flCsWidth: 0,
      startChainage: item.decStartChainage,
      endChainage: item.decEndChainage,
      startTopLevel: item.decStartTopLevel,
      endTopLevel: item.decEndTopLevel,
      startInvertLevel: item.decStartInvertLevel,
      endInvertLevel: item.decEndInvertLevel,
      structMarkingName: item.vchStructureMarkingName,
      txtMemQty: item.intMemberQty.toString(),
      startDepth: item.decStartDepth,
      endDepth: item.decEndDepth,
      tntStructureRevNo: 1,
      vchGroupMarkName: this.MeshData.VCHGROUPMARKINGNAME,
      intDrainStructureMarkId: item.intStructureMarkId,
      intParameterSet: this.MeshData.TNTPARAMSETNUMBER,
      bitTransportChk: false,
      bitBendingChk: false,
      bitProduceIndicator: false,
      bitMachineChk: false,
      intUserID: this.userId,
      drainTopCover: this.parameterSet_values[0].sitTopCover,
      drainBottomCover:this.parameterSet_values[0].sitBottomCover,
      drainOuterCover: this.parameterSet_values[0].sitOuterCover,
      drainInnerCover: this.parameterSet_values[0].sitInnerCover
    }
    this.drainService.SaveDrain_ProductMark(Insert_ProductMark).subscribe({
      next: (response) => {
      },
      error: (e) => {
        this.tosterService.error("error ouucured")
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.tosterService.success("ProductMark mark updated successfully")
        this.Load_Drain_Data(this.MeshData.VCHGROUPMARKINGNAME,this.ProjectId,this.DetailingID,this.MeshData.INTGROUPMARKID);

      },
    });



  },
});
this.enableDrainEditIndex = -1;

}

Get_Parameters_Drain()
{


  this.drainService.Get_ParameterSet_values(this.MeshData.TNTPARAMSETNUMBER).subscribe({
    next: (response) => {
      debugger;
      this.parameterSet_values = response;
      console.log("Parameter set values",this.parameterSet_values);
    },
    error: (e) => {
    },
    complete: () => {


    },
  });
}
Get_ProductMark(item:any)
{
  this.drainService.Get_DrainProductMark(item.intStructureMarkId).subscribe({
    next: (response) => {

      item.DrainProductMark = response;

      console.log(this.Drain_Data);

    },
    error: (e) => {
    },
    complete: () => {


      item.DrainProductMark.forEach((element: { colorRow: boolean; }) => {
        element.colorRow = false
      });
      

    },
  });

}
RouteToBom(item: any) {
debugger;
  item.StructureElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE;
  debugger;
  let BomData: BomData = {
    StructureElement: item.StructureElement,
    ProductMarkId: item.intProductMarkId,
    CO1: item.MhCo1,
    CO2: item.MhCo2,
    MO1: item.MhMo1,
    MO2: item.MhMo2,
    ParamValues: item.ParamValues,
    ShapeCodeName: item.Shape,
    ShapeID: item.intShapeId
  }

  localStorage.setItem('BomData', JSON.stringify(BomData));
this.router.navigate(['/detailing/DetailingGroupMark/BOM']);


}
Delete_ProductMark(id:any,item:any,selectedTab:string)
{
debugger;

  this.loading = true;
  this.drainService.Delete_DrainProductMarking(id).subscribe({
    next: (response) => {

    },
    error: (e) => {
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
      this.SelectedTab = selectedTab

  

      this.Get_ProductMark(item);
      this.Get_OtherProductMark(item)
      this.tosterService.success("Product Mark deleted successfully")


    },
  });

}
Update_ProductMark(item:any,structureMark_item:any)
{
console.log(item);
this.enableDrainEditIndex_ProductMark=-1;

  console.log("This is Shape Param ",this.objSlabShapeCode);

  this.drainService.Update_ProductMark(item).subscribe({
    next: (response) => {

    },
    error: (e) => {
      this.tosterService.error(e);
    },
    complete: () => {
      this.SelectedTab = "ProductMark"
    this.Get_ProductMark(structureMark_item);
    this.tosterService.success("Updated Successfully")
    },
  });

}
Update_OtherProductMark(item:any,structureMark_item:any){
debugger;
  let shapparamString = ''
let charSeq = ''
let strCriticalIndicator=''
let shapeObj = this.Shapecode_list.find(x=>x.intShapeId===item.intShapeId)

let ProductCodeObj=this.ProductCode_list.find(x=>x.intProductCodeId===Number(item.intProductCodeId));

if(this.objSlabShapeCode_edit!=undefined)
{
  this.objSlabShapeCode_edit.forEach((element: any) => {
    shapparamString+= element.chrParamName.toString().trim() + ':' + element.ParameterValue.toString().trim() + 'i' ;
    strCriticalIndicator+= '0' + 'i';
    charSeq+= element.intParamSeq.toString().trim()  + 'i' ;
  });
}
else{
  shapparamString=item.ParamValues;
}

  const obj:GenerateOtherDrainProduct={
    strProductMarkName: item.vchProductMarkingName,
    vchMeshShape:shapeObj.vchMeshShape,
    intShapeId: item.intShapeId,
    strMWLen: item.MhMwLength.toString(),
    strCWLen: item.MhCwLength.toString(),
    strMWSpace: this.ProductCode_elements_Edit[0].intMWSpace.toString(),
    strCWSpace: this.ProductCode_elements_Edit[0].intCWSpace.toString(),
    strMWDia: this.ProductCode_elements_Edit[0].decMWDiameter.toString(),
    strCWDia: this.ProductCode_elements_Edit[0].decCWDiameter.toString(),
    strMO1: item.MhMo1.toString(),
    strMO2: item.MhMo2.toString(),
    strCO1: item.MhCo1.toString(),
    strCO2: item.MhCo2.toString(),
    strProductMarkId: item.intProductMarkId.toString(),
    intStructureMarkId: item.intDrainStructureMarkId,
    strProductCodeId: item.intProductCodeId.toString(),
    blnTC: false,
    blnBC: false,
    blnMC: false,
    strShapeCode: shapeObj.vchShapeCode,
    strProductCode: ProductCodeObj.vchProductCode,
    intTransHeaderId: 0,
    TotMeshQty:item.TotalQty,
    strSequence: charSeq,
    strParamValues: shapparamString,
    strCriticalIndicator: strCriticalIndicator,
    intParameterSet: this.MeshData.TNTPARAMSETNUMBER,
    tntStructureRevNo: item.tntStructureMarkRevNo,
    strUserId: '',
    strPrdInd: item.ProduceIndicator,
    bitOHVal: item.bitOHDtls
  }
  this.Editcancel_OtherProductMark(-1);
  this.InsertOtherProductMark(obj,structureMark_item);
}
Get_OtherProductMark(item:any)
{
  this.loading = true;
  this.drainService.Get_DrainOtherProductMarkingDetails(item.intStructureMarkId).subscribe({
    next: (response) => {

      item.DrainOtherProductMark = response;

      console.log("Other Product Mark", item.DrainOtherProductMark );

    },
    error: (e) => {
      this.loading = false;
    },
    complete: () => {
      this.loading = false;



    },
  });

}
Get_SWShapeCode() {
  this.drainService.Get_SWShapeCode().subscribe({
    next: (response) => {
      this.Shapecode_list=response;
    },
    error: (e) => {
    },
    complete: () => {

    },
  });
}

Get_SWProductCode() {
  this.drainService.GetDrainProductCode().subscribe({
    next: (response) => {
      this.ProductCode_list=response;
    },
    error: (e) => {
    },
    complete: () => {

    },
  });
}

SaveOtherProductMark(item:any,StructureMark:any)
{
debugger;
  console.log("This is Shape param",this.objSlabShapeCode)


let shapparamString = ''
let charSeq = ''
let strCriticalIndicator=''

if(!this.objSlabShapeCode)
{
  shapparamString = 'A:' + this.GenerateOtherDrainProduct.strMWLen.toString() + 'i' ;
  
  strCriticalIndicator= `Ni` ;
  charSeq= '1i' ;

}
else{

  this.objSlabShapeCode.forEach((element: any) => {
    shapparamString+= element.chrParamName.toString().trim() + ':' + element.ParameterValue.toString().trim() + 'i' ;

    strCriticalIndicator+= element.chrCriticalInd.toString().trim() + 'i' ;
    charSeq+= element.intParamSeq.toString().trim()  + 'i' ;
  });
}
strCriticalIndicator = this.convertString(strCriticalIndicator);

  console.log(shapparamString,"This is jabsfkb,A")
  console.log(strCriticalIndicator,"This is jabsfkb,A")
  console.log(charSeq,"This is jabsfkb,A")
  this.GenerateOtherDrainProduct.strSequence = charSeq;
  this.GenerateOtherDrainProduct.strParamValues = shapparamString
  this.GenerateOtherDrainProduct.strCriticalIndicator=strCriticalIndicator;
  console.log("Save Productmark",this.GenerateOtherDrainProduct);
  this.GenerateOtherDrainProduct.intStructureMarkId = item.intStructureMarkId
  this.GenerateOtherDrainProduct.intParameterSet = item.tntParamSetNumber
  this.GenerateOtherDrainProduct.tntStructureRevNo = item.tntStructureRevNo
  this.GenerateOtherDrainProduct.strShapeCode
  let shapeObj = this.Shapecode_list.find(x=>x.intShapeId===this.GenerateOtherDrainProduct.intShapeId)
  this.GenerateOtherDrainProduct.strShapeCode = shapeObj.vchShapeCode
  this.GenerateOtherDrainProduct.vchMeshShape = shapeObj.vchMeshShape
  this.GenerateOtherDrainProduct.strProductCode=this.ProductCode_list.find(x=>x.intProductCodeId===Number(this.GenerateOtherDrainProduct.strProductCodeId)).vchProductCode;
  this.GenerateOtherDrainProduct.strProductCodeId =this.GenerateOtherDrainProduct.strProductCodeId.toString();
  this.GenerateOtherDrainProduct.strMWDia = this.ProductCode_elements_Save[0].decMWDiameter.toString();
  this.GenerateOtherDrainProduct.strCWDia = this.ProductCode_elements_Save[0].decCWDiameter.toString();

  this.GenerateOtherDrainProduct.strCWSpace = this.ProductCode_elements_Save[0].intCWSpace.toString();

  this.GenerateOtherDrainProduct.strMWSpace = this.ProductCode_elements_Save[0].intMWSpace.toString();
  this.GenerateOtherDrainProduct.bitOHVal = '0@0'
  this.GenerateOtherDrainProduct.strProductMarkId='0';
  // this.GenerateOtherDrainProduct.strUserId = this.userId.toString();

  this.InsertOtherProductMark(this.GenerateOtherDrainProduct,StructureMark)


}

ChangeShapeCode(item:any,event: any, shapeList: any,Mode:any) {
  debugger;
  this.objSlabShapeCode = shapeList.find((x: any) => x.intShapeId  === event);
  this.Imagename = "";
  this.Imagename = this.objSlabShapeCode.vchShapeCode.trim() + '.png';


  this.Get_ShapeparamList(event,Mode);

  if(Mode=='E')
  {
    this.popup_CO1 = item.MhMo1
    this.popup_CO2 = item.MhMo2
    this.popup_MO1 = item.MhCo1
    this.popup_MO2 = item.MhCo2
    this.popup_MWLength = item.MhMwLength
    this.popup_CWLength = item.MhCwLength

  }
  if(Mode=='S')
  {
    this.popup_CO1 = 100
    this.popup_CO2 = 100
    this.popup_MO1 = 100
    this.popup_MO2 = 100
    this.popup_MWLength = item.strMWLen
    this.popup_CWLength = item.strCWLen
  }


  // if (shapeList.length > 0) {
  //   this.ShapeParamlist = shapeList.find((x: any) => x.ShapeID === event).ShapeParam;
  //   this.Imagename = "";
  //   this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
  //   this.loadMainFile(this.Imagename);
  // }

  this.shapeSelected = true;
  this.showImage = true;

}

Get_ShapeparamList(intShapeid:any,Mode:any) {

  this.drainService.GetDrainShapeparamDetails(intShapeid).subscribe({
    next: (response) => {
      debugger;

      this.Mode=Mode;
    if(Mode==='S')
    {
      this.ShapeParamlist=response;
      this.objSlabShapeCode = this.ShapeParamlist;
    }
    if(Mode==='E')
    {
      this.ShapeParamlist_edit=response;
      this.objSlabShapeCode_edit=response
    }



    },
    error: (e) => {
    },
    complete: () => {

    },
  });
}

Get_OthProductCode(productCode:any,Mode:any) {

  this.drainService.GetOthProductCode(productCode).subscribe({
    next: (response) => {
      debugger;

   if(Mode==='S')
   {
    this.ProductCode_elements_Save = response;
   }
   if(Mode==='E')
   {
    this.ProductCode_elements_Edit = response;
   }
    },
    error: (e) => {
    },
    complete: () => {
console.log("this.ProductCode_elements_Save" ,this.ProductCode_elements_Save)

    },
  });
}
InsertOtherProductMark(obj:GenerateOtherDrainProduct,item:any)
{
  obj.strUserId = this.userId.toString();
  this.drainService.GenerateOtherDrainProduct(obj).subscribe({
    next: (response) => {
      debugger;

    },
    error: (e) => {
    },
    complete: () => {
      this.SelectedTab = "OtherProductMark";
      this.Load_Drain_Data(this.MeshData.VCHGROUPMARKINGNAME,this.ProjectId,this.DetailingID,this.MeshData.INTGROUPMARKID);

      // if(item!=-1)
      // {


      // }
    },
  });
}
ConvertToUpperCase(item:any)
{
  debugger
  item.vchStructureMarkingName=item.vchStructureMarkingName.toUpperCase();
}
ConvertToUpperCase_ProductMark(item:any)
{
  debugger
  item.vchProductMarkingName=item.vchProductMarkingName.toUpperCase();
}
shapeParameterGrid_KeyDown(ShapeParamlist: any, item: any, index: any) {
  debugger;
  this.i = 0;
  this.j = 1;
  this.mainWireTotal = 0;
  this.crossWireTotal = 0;
  let lastIndex = 0;
  let rowIndex = index;

  if (rowIndex == (ShapeParamlist.Length - 1))
  {
        if (this.popup_MO1.toString() != "")
        {
          this.popup_MO1=0;
        }

  }


    debugger;
    for (let i=0;i<=rowIndex;i++) {
      if (ShapeParamlist[i].chrWireType.trim() == "M" && ShapeParamlist[i].chrAngleType.trim() == "S") {
    this.mainWireTotal = this.mainWireTotal + (ShapeParamlist[i].ParameterValue
          != "" ? Number(ShapeParamlist[i].ParameterValue) : 0);

      }
      if (ShapeParamlist[i].chrWireType.trim() == "C" && ShapeParamlist[i].chrAngleType.trim() == "S") {
       this.crossWireTotal = this.crossWireTotal + (ShapeParamlist[i].ParameterValue != "" ? Number(ShapeParamlist[i].ParameterValue) : 0);
      }

    }
    if (ShapeParamlist[rowIndex].chrWireType.trim() == "M" && ShapeParamlist[rowIndex].chrAngleType.trim() == "S") {

      ShapeParamlist[rowIndex+1].ParameterValue = Number(this.popup_MWLength)-this.mainWireTotal;
      if(ShapeParamlist[rowIndex+1].ParameterValue<0)
      {
        ShapeParamlist[rowIndex+1].ParameterValue=0;
        ShapeParamlist[rowIndex].ParameterValue=Number(this.popup_MWLength);
      }


     }
     if (ShapeParamlist[rowIndex].chrWireType.trim() == "C" && ShapeParamlist[rowIndex].chrAngleType.trim() == "S") {

      ShapeParamlist[rowIndex+1].ParameterValue = (Number(this.popup_CWLength)-this.crossWireTotal) ;
      if(ShapeParamlist[rowIndex+1].ParameterValue<0)
      {
        ShapeParamlist[rowIndex+1].ParameterValue=0;
        ShapeParamlist[rowIndex].ParameterValue=Number(this.popup_CWLength);
      }

     }

    console.log(this.crossWireTotal);
    console.log(item)



    // for (let param of ShapeParamlist) {

    //   if (param.WireType == "M" && param.AngleType == "S") {

    //     if (param.ShapeCodeImage == "3M8" || param.ShapeCodeImage == "3MR8") {
    //       if (param.ParameterName != "E") {
    //         param.ParameterValue = Math.round(Number(this.popup_MWLength) - (this.mainWireTotal - (param.ParameterValue != "" ? Number(param.ParameterValue) : 0)));

    //       }
    //     }
    //     else {
    //       param.ParameterValue = Math.round(Number(this.popup_MWLength) - (this.mainWireTotal - (param.ParameterValue != "" ? Number(param.ParameterValue) : 0)));
    //     }

    //   }
    //   if (param.WireType == "C" && param.AngleType == "S") {
    //     param.ParameterValue = Math.round((Number(this.popup_CWLength) - (this.crossWireTotal - (param.ParameterValue != "" ? Number(param.ParameterValue) : 0))));
    //     param.ParameterValue.Focus();
    //   }
    //   // if (param.ParameterValue != "") {
    //   //   param.ParameterValue.Select(0, param.ParameterValue.Length);
    //   // }
    //   // param.ParameterValue.Focus();
    // }

    // while (this.j != ShapeParamlist.length)
    // {
    //     if (ShapeParamlist[ShapeParamlist.length - this.j].EditFlag == true && ShapeParamlist[ShapeParamlist.length - this.j].VisibleFlag == true)
    //     {
    //         lastIndex = ShapeParamlist.length - 1;
    //         break;
    //     }
    //     this.j += 1;
    // }






}

ChangeLen(item:any,flag:any,Key:any){
  debugger;
if(!flag)
{
  item[Key]=2400;
}
else{
  item[Key]=0;
}
}

Load_DrainParamDepthValues(GroupMarkID:any,TntParameterSetNo:any)
{
  this.drainService.GetDrainParamDepthValues(GroupMarkID,TntParameterSetNo).subscribe({
    next: (response) => {
      debugger;
      this.Layers =   response[0] ;
      console.log("Drain Layers",this.Layers)


    },
    error: (e) => {
    },
    complete: () => {
      console.log("Drain Layers",this.Layers.vchDrainLayer)
      this.checkLayer();
     

    },
  });
}
checkLayer()
{
  if(this.Layers.vchDrainLayer.length)
  {
  this.Layers.vchDrainLayer.forEach((element: any) => {
    console.log("Selected Layer",element);
    if(element=="SL")
    {
      this.Drain_Insert_Update[0].bitCrossLenSlab = true;
      this.ChangeLen(this.Drain_Insert_Update[0],false,'decCrossLenSlab')
         }
    else  if(element=="BL")
    {
      this.Drain_Insert_Update[0].bitCrossLenBase = true;
      this.ChangeLen(this.Drain_Insert_Update[0],false,'decCrossLenBase')

    }
    else  if(element=="IL")
    {
      this.Drain_Insert_Update[0].bitCrossLenInner = true;
      this.ChangeLen(this.Drain_Insert_Update[0],false,'decCrossLenInner')

    }
    else  if(element=="OU")
    {
      this.Drain_Insert_Update[0].bitCrossLenOuter = true;
      this.ChangeLen(this.Drain_Insert_Update[0],false,'decCrossLenOuter')

    }

  });
}
}
// changeMOCO(row2:any,MhMo1:any)
// {
//   debugger;
//   this.popup_MO1=row2[MhMo1]
// }
onMouseDown(event: MouseEvent): void {
  this.isDragging = true;
  this.initialX = event.clientX + this.right;
  this.initialY = event.clientY - this.top;
  this.renderer.addClass(this.el.nativeElement, 'grabbing');

  console.log("this.initialX ,event.clientX, this.initialY ,event.clientY",this.initialX,"    ",event.clientX,"    ",this.initialY,"    ",event.clientY)
}

onMouseMove(event: MouseEvent): void {
  if (this.isDragging) {
    this.right = this.initialX - event.clientX;
    this.top = event.clientY - this.initialY;
  }
}

onMouseUp(event: MouseEvent): void {
  this.isDragging = false;
  this.renderer.removeClass(this.el.nativeElement, 'grabbing');
}

initialDataInsert_Maindrain()
{
  let len = this.Drain_Data.length;
  if(len)
  {
    let lastElement  = this.Drain_Data[len-1];
    this.Drain_Insert_Update[0]={
      intStructureMarkId: 0,
      intSEDetailingID: 0,
      tntStructureRevNo: 0,
      intGroupMarkId: 0,
      tntGroupRevNo: 0,
      vchStructureMarkingName: lastElement.vchStructureMarkingName,
      intParamSetNumber: 0,
      decStartChainage: lastElement.decStartChainage,
      decEndChainage: lastElement.decEndChainage,
      decDistance: lastElement.decDistance,
      decStartTopLevel: lastElement.decStartTopLevel,
      decEndTopLevel: lastElement.decEndTopLevel,
      decStartInvertLevel: lastElement.decStartInvertLevel,
      decEndInvertLevel: lastElement.decEndInvertLevel,
      decStartHeight: lastElement.decStartHeight,
      decEndHeight: lastElement.decEndHeight,
      decStartDepth: lastElement.decStartDepth,
      decEndDepth: lastElement.decEndDepth,
      bitCascade: false,
      intCascadeNo: 0,
      decCascadeDropHeight: 0,
      decCascadeWidth: 0,
      decCascadeCWLength: 0,
      bitCrossLenInner: false,
      decCrossLenInner: 0,
      bitCrossLenOuter: false,
      decCrossLenOuter: 0,
      bitCrossLenSlab: false,
      decCrossLenSlab: 0,
      bitCrossLenBase: false,
      decCrossLenBase: 0,
      bitCoatingIndicator: false,
      bitBendingCheck: false,
      bitMachineCheck: false,
      bitTransportCheck: false,
      intMemberQty: 1,
      tntStatusId: 0,
      vchDrawingReference: '',
      chrDrawingVersion: '',
      vchDrawingRemarks: '',
      bitAssemblyIndicator: false,
      nvchProduceIndicator: '',
      intUserID: 0,

    }


  }
  else{

  }
  this.Load_DrainParamDepthValues(this.MeshData.INTGROUPMARKID,this.MeshData.TNTPARAMSETNUMBER)


}

convertString(input: string): string {
  let result = '';
  for (let i = 0; i < input.length; i++) {
      if (input[i] === 'N') {
          result += '0';
      } else {
          result += input[i];
      }
  }
  return result;
}
changeTab(selectedTab:any)
{
  console.log("selectedTab",selectedTab)
}
roundToTwoDecimalPlaces(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
 fnCascadeCheck(item:any) {

  if (item.bitCascade==false) {
      // document.getElementById(intCascadeNo).value = '0';
      // document.getElementById(intWidth).value = '0';
      // document.getElementById(intDropHeight).value = '0';
      // document.getElementById(intCrossLen).value = '0';
      // document.getElementById(intCascadeNo).disabled = true;
      // document.getElementById(intWidth).disabled = true;
      // document.getElementById(intDropHeight).disabled = true;
      // document.getElementById(intCrossLen).value = '0'
      // document.getElementById(intCrossLen).disabled = true;
      item.intCascadeNo = 0
      item.intWidth = 0
      item.intDropHeight = 0
      item.intCrossLen = 0
      this.isCascade.cascadeNo=true;
      this.isCascade.width=true;
      this.isCascade.dropHeight=true;
      this.isCascade.crossLen=true;
      this.checkLayer();
  }
  else {
      // document.getElementById(intCascadeNo).disabled = false;
      // document.getElementById(intWidth).disabled = false;
      // document.getElementById(intDropHeight).disabled = false;
      // document.getElementById(intCrossLen).disabled = false;
      // document.getElementById(intCrossLen).value = '2400';
      // document.getElementById(intCascadeNo).select();

      // document.getElementById(chkInnerCross).checked = false
      // document.getElementById(chkOuterCross).checked = false
      // document.getElementById(chkSlabCross).checked = false
      // document.getElementById(chkBaseCross).checked = false
      // document.getElementById(txtInnerCrossLen).value = '0';
      // document.getElementById(txtInnerCrossLen).disabled = true;
      // document.getElementById(txtOuterCrossLen).value = '0';
      // document.getElementById(txtOuterCrossLen).disabled = true;
      // document.getElementById(txtSlabCrossLen).value = '0';
      // document.getElementById(txtSlabCrossLen).disabled = true;
      // document.getElementById(txtBaseCrossLen).value = '0';
      // document.getElementById(txtBaseCrossLen).disabled = true;
      this.checkLayer();
      item.intCascadeNo = 0
      item.intWidth = 0
      item.intDropHeight = 0
      item.intCrossLen = 0
      this.isCascade.cascadeNo=false;
      this.isCascade.width=false;
      this.isCascade.dropHeight=false;
      this.isCascade.crossLen=false;
      item.bitCrossLenSlab = false;
      item.bitCrossLenBase = false;
      item.bitCrossLenInner = false;
      item.bitCrossLenOuter = false;
      this.ChangeLen(item,true,'decCrossLenSlab')
      this.ChangeLen(item,true,'decCrossLenBase')
      this.ChangeLen(item,true,'decCrossLenInner')
      this.ChangeLen(item,true,'decCrossLenOuter')
  }
}

selectRow(item:any,event:MouseEvent)
  {

    let i  = this.Drain_Data.findIndex(x=>x.intStructureMarkId ===item.intStructureMarkId);
   
    

    if(event.ctrlKey)
    {

      item.colorRow =!item.colorRow ;

  
    }
    // i--;
    // if(event.ctrlKey && event.shiftKey)
    // {
    //   while(i>0 && this.ColumnStructureMarklist[i].colorRow==false)
    //   {
    //     let item  = this.ColumnStructureMarklist[i]


    //   if(item.POSTED==1)
    //   {
    //     this.tosterService.warning(`This Groupmark ${item.VCHGROUPMARKINGNAME} is Posted `);
        
    //   }
    //   else{
    //     item.colorRow =!item.colorRow ;
    //   }
    //   i--;
      
    
    //   }
    // }
    
  }
  deleteAllselected()
  {
    this.Drain_Data.forEach(element => {
      if(element.colorRow)
      {
        this.Delete_StructureMark(element.intStructureMarkId)
        // this.deleteGroupMark(element.INTGROUPMARKID,element.VCHGROUPMARKINGNAME)
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Delete") {
      this.deleteAllselected();
    }
  }


  giveRowcolor(item: any) {
    var color;

// //debugger


 
    if(item.colorRow)
    {
      color = '#880808';
    }
    return color
  }

  goBack()
  {
    this.router.navigate(['/detailing/MeshDetailing']);

  }
}
