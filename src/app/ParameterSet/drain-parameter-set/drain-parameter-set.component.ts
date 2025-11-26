import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { to } from 'mathjs';
import { ToastrService } from 'ngx-toastr';
import { add_drain_parameterset } from 'src/app/Model/add_drain_parameter';
import { capping } from 'src/app/Model/capping';
import { clink } from 'src/app/Model/clink';
import { DDL_ParameterSet } from 'src/app/Model/ddl_parameterset';
import { Drain_Depth } from 'src/app/Model/Drain_Depth';
import { Drain_Lap } from 'src/app/Model/Drain_Lap';
import { Drain_WM } from 'src/app/Model/Drain_WM';
import { InsertPRojectParameter } from 'src/app/Model/InsertProjectparameter';
import { Insert_Drain_depth } from 'src/app/Model/insert_depth';
import { Insert_Drain_Lap } from 'src/app/Model/Insert_Drain_lap';
import { Insert_Drain_WM } from 'src/app/Model/Insert_Drain_WM';
import { mainwirecrosswire } from 'src/app/Model/mainwirecrosswire';
import { CappingGridList } from 'src/app/Model/meshparameter_caping';
import { Clink } from 'src/app/Model/meshparameter_clink';
import { MeshList } from 'src/app/Model/meshparameter_meshlist';
import { parameterSet } from 'src/app/Model/parameterSet';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { DrainParameterSetService } from '../Services/Drain/drain-parameter-set.service';
import { ParametersetService } from '../Services/Parameterset/parameterset.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-drain-parameter-set',
  templateUrl: './drain-parameter-set.component.html',
  styleUrls: ['./drain-parameter-set.component.css']
})
export class DrainParameterSetComponent implements OnInit {

  userId:any;

  MeshparameterForm!: FormGroup;
  customerList: any = [];
  parameterList: any[] = [];
  projectList: any = [];
  Diameterlist: any[] = []
  searchResult: boolean = false;
  loading: boolean = true;
  selectparameter: any = null;
  SelectedProjectID: any;

  @ViewChild('sitMaxDepth1') sitMaxDepth1: ElementRef | undefined;
  @ViewChild('sitMaxDepth2') sitMaxDepth2: ElementRef | undefined;

  @ViewChild('sitMaxDepth3') sitMaxDepth3: ElementRef | undefined;

  @ViewChild('sitMaxDepth4') sitMaxDepth4: ElementRef | undefined;

  @ViewChild('sitMaxDepth5') sitMaxDepth5: ElementRef | undefined;


  isaddnew: boolean = false;
  isaddnewWM: boolean = false;
  isaddnewDrain: boolean = false;
  isaddnewLap: boolean = false;

  MeshList: MeshList[] = [];
  backup_Meshlist: MeshList[] = [];
  isEditing: boolean = false;

  enableMeshEditIndex = null;
  enableColumnEditIndex = null;
  enableClinkEditIndex = null;
  enableBeamEditIndex = null;
  enableCappingEditIndex = null;
  is_standarddisable: boolean = false;
  ParameterSetList: any[] = [];

  page = 1;
  pageSize = 0;
  maxSize: number = 10;
  currentPage = 1;
  itemsPerPage: number = 10;

  drain_page = 1;
  drain_pageSize = 0;
  drain_currentPage = 1;
  drain_itemsPerPage: number = 10;

  lap_page = 1;
  lap_pageSize = 0;
  lap_currentPage = 1;
  lap_itemsPerPage: number = 10;


  WM_page = 1;
  WM_pageSize = 0;
  WM_currentPage = 1;
  WM_itemsPerPage: number = 10;

  column_pageSize: number = 0;
  column_itemperPage: number = 10;
  column_currentPage: number = 1;

  beam_pageSize: number = 0;
  beam_itemperPage: number = 10;
  beam_currentPage: number = 1;

  capping_pageSize: number = 0;
  capping_itemperPage: number = 10;
  capping_currentPage: number = 1;


  selectedCustomer: any = null;
  diameter: any;
  leg: any;
  cwlength: any;
  mwlap: any;

  editMesh: boolean = false;
  tableName: any;
  tntParamterRefNumber: number = 0;
  selectedType: any = 'MSH';
  ProductCodeList: any[] = [];
  CappingProductList: any[] = [];
  ClinkList: Clink[] = [];
  backup_ClinkList: Clink[] = [];
  Top_Parameters: any[] = [
    {
      top_Cover: 40,
      bottom_Cover: 40,
      inner_Cover: 40,
      outer_Cover: 40,
    }];
  backup_ColumnList: any[] = [];
  BeamList: any[] = [];
  backup_BeamList: any[] = [];
  CappingList: CappingGridList[] = [];
  backup_CappingList: CappingGridList[] = [];
  isshowstatus: boolean = true
  newparameter: parameterSet[] = [{ topcover: '', bottomcover: '', leftcover: '', rightcover: '', gap1: '', gap2: '' }];
  newcapping: capping[] = [{ beamdiameter: undefined, leg: undefined, hook: undefined, Caping_Product: undefined, CW_Length: undefined }];
  newmwcw: mainwirecrosswire[] = [{ productcode: null, mwlap: null, cwlap: null }];
  add_drain_depth: Drain_Depth[] = [{
    intDrainDepthParamId: 0,
    tntParamSetNumber: undefined,
    vchDrainType: undefined,
    sitDrainWidth: undefined,
    sitAdjust: undefined,
    sitChannel: undefined,
    sitSlabThickness: undefined,
    sitMaxDepth1: 9999,
    sitMaxDepth2: 9999,
    sitMaxDepth3: 9999,
    sitMaxDepth4: 9999,
    sitMaxDepth5: 9999,
    bitConfirm: false,
    intUserId: 0,
    sitDrainTypeId: undefined
  }];
  newclink: any;
  TypeList: any[] = [];


  //Drain Started
  Drain_Depth: Drain_Depth[] = [];
  Drain_Lap: Drain_Lap[] = [];
  Drain_WM: Drain_WM[] = [];
  ProductCode: any;
  Drain_WM_width: any;
  enableWMIndex: any;
  Drain_layer: any;
  Drain_ProductType: any;
  Drain_WM_Productcode: any;
  enableDepthIndex: any;
  backup_Drain_Depth: any;
  backup_Drain_Lap: any;
  enableLapIndex: any;
  Drain_WM_Draintype: any;
  add_Drain_Lap: Insert_Drain_Lap[] = [
    {
      intDrainLapId: undefined,
      bitConfirm: false,
      tntParamSetNumber: undefined,
      intProductCodeId: undefined,
      sitLap: undefined,
      intUserId: undefined
    }
  ]
  add_Drain_WM: Insert_Drain_WM[] = [{
    intDrainWMId: 0,
    tntParamSetNumber: undefined,
    sitDrainTypeId: undefined,
    tntDrainLayerId: undefined,
    sitDrainWidth: undefined,
    sitMaxDepth: undefined,
    intDrainDepthParamId: undefined,
    intProductCodeId: undefined,
    intShapeId: undefined,
    intParamA: 0,
    numLeftWallThickness: undefined,
    numLeftWallFactor: undefined,
    numRightWallThickness: undefined,
    numRightWallFactor: undefined,
    numBaseThickness: undefined,
    intQty: undefined,
    bitDetail: false,
    intUserId: 0
  },];
  Drain_WM_MaxDepth: any;
  Drain_WM_Shape: any;
  backup_Drain_WM: any;
  tntParameterSet: any;
  showImage: any = false;
  PreDefiend: boolean = false;

  enableParam: boolean = false;
  enableParam_foot: boolean = false;
  ShapeParamlist: any;
  popup_MO1: any
  popup_MO2: any;
  popup_MWLength: any
  popup_CWLength: any;
  enableParameterEditIndex: boolean = true;
  Insert_WM: any = false;
  DrainLayerId: any;
  layerID: number=0;
  InsertWM: boolean=false;
  Save_DrainWMId: any;
  Imagename: any;
  ProjectParamDrain_ParamDetails: any;
  Selected_ProductCode: any;

  constructor(
    public commonService: CommonService,
    public parametersetservice: ParametersetService,
    private tosterService: ToastrService,
    private formBuilder: FormBuilder,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private parametersetService: ParametersetService,
    private loginService: LoginService,

    private drainService: DrainParameterSetService) {

    this.MeshparameterForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      paramterset: new FormControl('', Validators.required),

    });

  }


  ngOnInit() {
    this.commonService.changeTitle('Drain | ODOS');
    this.userId = this.loginService.GetUserId();

    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.selectedCustomer = this.dropdown.getCustomerCode()
    });


    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        this.SelectedProjectID = this.dropdown.getDetailingProjectId();
        console.log("Changed  Project id=" + this.SelectedProjectID)
        if (this.SelectedProjectID !== undefined) {
          this.searchResult = true;
          this.selectparameter = null;

          this.LoadParameterSetList(this.SelectedProjectID);
          this.changeDetectorRef.detectChanges();
        }

      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });
    debugger;

    this.selectedCustomer = this.dropdown.getCustomerCode()
    this.SelectedProjectID = this.dropdown.getDetailingProjectId();


    if (this.SelectedProjectID != undefined && this.SelectedProjectID != 0) {
      this.LoadParameterSetList(this.SelectedProjectID);
    }






  }

  onChangeParameterList() {
    debugger;
    this.enableParameterEditIndex = false;
    let item = this.ParameterSetList.find(x => x.tntParamSetNumber === this.tntParameterSet);
    console.log("Item ", item)
    this.Top_Parameters[0].top_Cover = item.sitTopCover
    this.Top_Parameters[0].bottom_Cover = item.sitBottomCover
    this.Top_Parameters[0].inner_Cover = item.sitInnerCover
    this.Top_Parameters[0].outer_Cover = item.sitOuterCover




    this.isaddnewWM = false;
    this.isaddnewDrain = false;
    this.isaddnewLap = false;
    if (this.tntParameterSet != undefined) {
      this.loadDrainDepth(this.tntParameterSet);
      this.loadDrainLapping(this.tntParameterSet);
      this.loadDrainProductCode()
      this.loadDrainWM_Width(this.tntParameterSet);
      this.loadDrainProductCode();
      this.loadDrainType();
      this.loadDrainWM_PRoductCode(this.tntParameterSet);
      this.loadDrainLayer();
      this.loadDrainWM_Draintype(this.tntParameterSet);
      this.loadDrainWM(this.tntParameterSet);
    }
  }
  LoadParameterSetList(projectId: any) {
    debugger;

    // if (this.selectedType == 'MSH') {  //MESH
    this.drainService.GetParameterSetLis_Drain(projectId).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.ParameterSetList = response;
        console.log("ParameterSetList", this.ParameterSetList)

      },
      error: (e) => {
      },
      complete: () => {
        
        this.tntParameterSet = this.ParameterSetList[this.ParameterSetList.length-1].tntParamSetNumber; 
        this.onChangeParameterList();
        // this.contractListData = this.selectFilter(this.CoreCageProductListData)
        //this.backup_contractListData = JSON.parse(JSON.stringify(this.contractListData));
      },
    });


    //}


  }



  onEditDepth(item: any, index: any) {
    debugger;
    this.Drain_Depth = JSON.parse(JSON.stringify(this.backup_Drain_Depth));
    this.enableDepthIndex = index;
  }
  onEditLapping(item: any, index: any) {
    debugger;
    this.Drain_Lap = JSON.parse(JSON.stringify(this.backup_Drain_Lap));
    this.enableLapIndex = index;
  }
  onEditWM(item: any, index: any) {
    debugger;
    this.Drain_WM = JSON.parse(JSON.stringify(this.backup_Drain_WM));
    this.enableWMIndex = index;
    this.loadDrainWM_Shape(item.tntDrainLayerId);
    this.ChangeShape(item.intShapeId, item.intParamA, 'E');
    this.loadDrainWM_MaxDepth(item.sitDrainWidth);
  }


  loadDrainDepth(tntParameterSet: any) {

    this.drainService.GetProjectParamDrainDepth(tntParameterSet).subscribe({
      next: (response) => {
        this.Drain_Depth = response;
      },
      error: (e) => {
      },
      complete: () => {
        this.backup_Drain_Depth = JSON.parse(JSON.stringify(this.Drain_Depth));

      },
    });
    this.drainService.GetProjectParamDrainDepth(tntParameterSet).subscribe(

    )
  }
  loadDrainLapping(tntParameterSet: any) {

    this.drainService.GetProjectParamDrainLap(tntParameterSet).subscribe({
      next: (response) => {
        this.Drain_Lap = response;
      },
      error: (e) => {
      },
      complete: () => {
        this.backup_Drain_Lap = JSON.parse(JSON.stringify(this.Drain_Lap));

      },
    });

  }


  loadDrainWM(tntParameterSet: any) {

    this.drainService.GetProjectParamDrainWM(tntParameterSet).subscribe({
      next: (response) => {
        this.Drain_WM = response;
        console.log("Data of Drain WM ", this.Drain_WM)
      },
      error: (e) => {
      },
      complete: () => {
        this.backup_Drain_WM = JSON.parse(JSON.stringify(this.Drain_WM));
        if (this.Insert_WM) {

        }



      },
    });

  }

  loadDrainWM_Width(tntParameterSet: any) {

    this.drainService.GetDrainWidthWM(tntParameterSet).subscribe({
      next: (response) => {
        this.Drain_WM_width = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });

  }
  loadDrainProductCode() {
    this.drainService.GetDrainProductCode().subscribe({
      next: (response) => {
        this.ProductCode = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  loadDrainLayer() {
    this.drainService.GetProjectParamDrainLayer().subscribe({
      next: (response) => {
        this.Drain_layer = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  loadDrainType() {
    this.drainService.GetDrainProductType().subscribe({
      next: (response) => {
        this.Drain_ProductType = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  loadDrainWM_PRoductCode(tntParameterSet: any) {

    this.drainService.GetLapProductCodeWM(tntParameterSet).subscribe({
      next: (response) => {
        this.Drain_WM_Productcode = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });

  }
  loadDrainWM_MaxDepth(intDrainDepthParamId: any) {
    debugger;
    this.drainService.GetProjectParamDrainMaxDepth(intDrainDepthParamId).subscribe({
      next: (response) => {
        debugger;
        this.Drain_WM_MaxDepth = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });

  }

  loadDrainWM_Shape(tntDrainLayerId: any) {
    debugger;
    this.drainService.GetProjectParamDrainShapeforLayer(tntDrainLayerId).subscribe({
      next: (response) => {
        debugger;

        this.Drain_WM_Shape = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });

  }
  loadDrainWM_Draintype(tntParameterSet: any) {

    this.drainService.GetDrainProductTypeById(tntParameterSet).subscribe({
      next: (response) => {
        this.Drain_WM_Draintype = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });

  }
  Editcancel_Depth() {
    debugger;
    this.enableDepthIndex = -1;
    this.Drain_Depth = JSON.parse(JSON.stringify(this.backup_Drain_Depth));
  }
  Editcancel_Lap() {
    debugger;
    this.enableLapIndex = -1;
    this.Drain_Lap = JSON.parse(JSON.stringify(this.backup_Drain_Lap));
  }
  Editcancel_WM() {
    debugger;
    this.enableWMIndex = -1;
    this.Drain_WM = JSON.parse(JSON.stringify(this.backup_Drain_WM));
  }
  // Save 
  onSave_Depth(item: Drain_Depth,Type:any) {
    debugger;

    if (item.sitDrainWidth !== undefined || item.sitDrainTypeId !== undefined || item.sitAdjust !== undefined || item.sitChannel !== undefined || item.sitSlabThickness !== undefined || item.sitMaxDepth1 !== undefined || item.sitMaxDepth2 !== undefined || item.sitMaxDepth3 !== undefined || item.sitMaxDepth4 !== undefined || item.sitMaxDepth5 !== undefined) {
      item.tntParamSetNumber = this.tntParameterSet;
      item.vchDrainType = this.Drain_ProductType.find((x: any) => x.sitDrainTypeId === item.sitDrainTypeId).vchDrainType;

      //  let a = this.Drain_ProductType.find((x: any)=>x.sitDrainTypeId===item.sitDrainTypeId);


      this.drainService.Insert_Update_DrainDepth(item).subscribe({
        next: (response) => {

        },
        error: (e) => {
          this.tosterService.error('Error ',e.error);
     
        },
        complete: () => {
          if(Type=='S')
          {

            this.tosterService.success('Drain depth added successfully');
          }
          else if(Type=='E')
          {
            this.tosterService.success('Drain depth updated successfully');
 
          }
          this.onChangeParameterList();
          this.isaddnewDrain = false
        },
      });
      this.enableDepthIndex = -1
    }

  }

  onSave_Lap(item: Insert_Drain_Lap) {
    debugger;
    this.isaddnewLap = true
    if (item.intProductCodeId !== undefined || item.sitLap !== undefined) {

      item.tntParamSetNumber = this.tntParameterSet;

      this.drainService.Insert_Update_DrainLap(item).subscribe({
        next: (response) => {

        },
        error: (e) => {
        },
        complete: () => {
          this.onChangeParameterList();
        },
      });
      this.enableDepthIndex = -1
    }


  }
  onUpdate_Lap(item: Drain_Lap) {
    const obj: Insert_Drain_Lap = {
      intDrainLapId: item.intDrainLapId,
      bitConfirm: item.bitConfirm,
      tntParamSetNumber: this.tntParameterSet,
      intProductCodeId: item.intProductCodeId,
      sitLap: item.sitLap,
      intUserId: this.userId
    }

    this.drainService.Insert_Update_DrainLap(obj).subscribe({
      next: (response) => {

      },
      error: (e) => {
      },
      complete: () => {
        this.onChangeParameterList();
      },
    });
    this.enableLapIndex = -1;
  }
  onSave_WM(item: Insert_Drain_WM) {
    debugger;
    this.isaddnewWM = true;

    let width = this.Drain_WM_width.find((x: { intDrainDepthParamId: any; }) => x.intDrainDepthParamId == item.intDrainDepthParamId).sitDrainWidth;

    let Shape = this.Drain_WM_Shape.find((x: any)=>x.intShapeId==item.intShapeId).chrShapeCode

    let arr = width.split("-");
    item.sitDrainWidth = Number(arr[0]);

    if (item.sitDrainWidth !== undefined || item.sitDrainTypeId !== undefined || item.sitMaxDepth !== undefined || item.tntDrainLayerId !== undefined || item.intProductCodeId !== undefined || item.intShapeId !== undefined || item.bitDetail !== undefined || item.intQty !== undefined || item.numLeftWallThickness !== undefined || item.numLeftWallFactor !== undefined || item.numRightWallThickness !== undefined || item.numRightWallFactor !== undefined || item.numBaseThickness !== undefined) {
      item.tntParamSetNumber = this.tntParameterSet;
      item.bitDetail = this.PreDefiend;
      this.drainService.Insert_Update_DrainWM(item).subscribe({
        next: (response) => {
          this.Save_DrainWMId = response;
          console.log(this.Save_DrainWMId,"This is Save intDrainWMId");
        },
        error: (e) => {
        },
        complete: () => {
          this.Insert_WM = true;
          this.Reset_WM();
          this.onChangeParameterList();
          this.tosterService.success("Record added successfully")
          if(item.tntDrainLayerId==5 || item.tntDrainLayerId==4)
          {
            this.Selected_ProductCode = this.Drain_WM_Productcode.find((x: any)=>x.intProductCodeId==item.intProductCodeId)
           this.showImage = true;
           this.InsertWM=true;
           this.Imagename=Shape.trim() + '.png'
           this.LoadShapeParamValues(item.intShapeId);
          }     
        },
      });
      this.enableLapIndex = -1;
    }



  }
  on_updateWM(item: Drain_WM) {
    debugger;
    item.tntParamSetNumber = this.tntParameterSet;
    let width = this.Drain_WM_width.find((x: { intDrainDepthParamId: any; }) => x.intDrainDepthParamId == item.intDrainDepthParamId).sitDrainWidth;

    let arr = width.split("-");
    item.sitDrainWidth = Number(arr[0]);
    const obj: Insert_Drain_WM = {
      intDrainWMId: item.intDrainWMId,
      tntParamSetNumber: item.tntParamSetNumber,
      sitDrainTypeId: item.sitDrainTypeId,
      tntDrainLayerId: item.tntDrainLayerId,
      sitDrainWidth: item.sitDrainWidth,
      sitMaxDepth: item.sitMaxDepth,
      intDrainDepthParamId: item.intDrainDepthParamId,
      intProductCodeId: item.intProductCodeId,
      intShapeId: item.intShapeId,
      intParamA: item.intParamA,
      numLeftWallThickness: item.numLeftWallThickness,
      numLeftWallFactor: item.numLeftWallFactor,
      numRightWallThickness: item.numRightWallThickness,
      numRightWallFactor: item.numRightWallFactor,
      numBaseThickness: item.numBaseThickness,
      intQty: item.intQty,
      bitDetail: item.bitPreDefined,
      intUserId: this.userId

     

    }
    this.drainService.Insert_Update_DrainWM(obj).subscribe({
      next: (response) => {

     this.Save_DrainWMId = response;
      },
      error: (e) => {
      },
      complete: () => {
        this.onChangeParameterList();
        this.tosterService.success("Record Updated successfully")

        this.enableWMIndex = -1;
        if(item.tntDrainLayerId==5 || item.tntDrainLayerId==4)
        {
          this.Selected_ProductCode = this.Drain_WM_Productcode.find((x: any)=>x.intProductCodeId==item.intProductCodeId)

         this.showImage = true;
         this.InsertWM=true;
         this.Imagename=item.chrShapeCode.trim() + '.png'
         this.LoadShapeParamValues(item.intShapeId);
        } 
      },
    });
  }
  Delete_Depth(item: Drain_Depth) {
    debugger;
    this.drainService.Delete_Drain_Depth(item.intDrainDepthParamId, 1).subscribe({
      next: (response) => {

      },
      error: (e) => {
      },
      complete: () => {

        this.tosterService.success("Record deleted successfully")
        this.onChangeParameterList();
      },
    });
  }
  Delete_Lap(item: Drain_Lap) {
    debugger;
    this.drainService.Delete_Drain_Lap(item.intDrainLapId, item.bitConfirm).subscribe({
      next: (response) => {
        debugger;
      },
      error: (e) => {
      },
      complete: () => {
        this.tosterService.success("Record deleted successfully")
        this.onChangeParameterList();
      },
    });
  }
  Delete_WM(item: Drain_WM) {
    this.drainService.Delete_Drain_WM(item.intDrainWMId).subscribe({
      next: (response) => {

      },
      error: (e) => {
      },
      complete: () => {
        this.tosterService.success("Record deleted successfully")
        this.onChangeParameterList();
      },
    });
  }
  onPageChange_drain(pageNum: number): void {
    this.drain_pageSize = this.drain_itemsPerPage * (pageNum - 1);
    // this.enableEditIndex = null;
  }
  OnPageSizeChange_drain(pageSize: number) {
    this.drain_pageSize = 0;
    this.drain_currentPage = 1;
    // this.enableEditIndex = null;
  }
  onPageChange_lap(pageNum: number): void {
    this.lap_pageSize = this.lap_itemsPerPage * (pageNum - 1);
    // this.enableEditIndex = null;
  }
  OnPageSizeChange_lap(pageSize: number) {
    this.lap_pageSize = 0;
    this.lap_currentPage = 1;
    // this.enableEditIndex = null;
  }

  onPageChange_WM(pageNum: number): void {
    this.WM_pageSize = this.WM_itemsPerPage * (pageNum - 1);
  }
  OnPageSizeChange_WM(pageSize: number) {
    this.WM_pageSize = 0;
    this.WM_currentPage = 1;
    // this.enableEditIndex = null;
  }
 
 
  onChangeLayer(layer: any, PreDefiend: any) {
    debugger;
    this.layerID =layer;
    if (layer == 5 || layer == 4) {
      this.PreDefiend = true;
    
    }
    else {
      this.PreDefiend = false;
    
    }
  }

  onChangeLayer_Edit(layer: any, item: any) {
    debugger;
    if (layer == 5 || layer == 4) {
      item.bitPreDefined = true;
    }
    else {
      item.bitPreDefined = false;
    }
  }
  ChangeShape(ShapeID: any, Param: any, type: any) {
    if(type=='S')
    {
      if(ShapeID==10 || ShapeID==11)
      {
       this.enableParam_foot=true
      }
      else{
       this.enableParam_foot=false
      }
    }
    else{
      if(ShapeID==10 || ShapeID==11)
      {
       this.enableParam=true
      }
      else{
       this.enableParam=false
      }
    }
  
 
  }
  Reset_WM() {
    debugger;
    this.add_Drain_WM[0] = {
      intDrainWMId: 0,
      tntParamSetNumber: undefined,
      sitDrainTypeId: undefined,
      tntDrainLayerId: undefined,
      sitDrainWidth: undefined,
      sitMaxDepth: undefined,
      intDrainDepthParamId: undefined,
      intProductCodeId: undefined,
      intShapeId: undefined,
      intParamA: 0,
      numLeftWallThickness: undefined,
      numLeftWallFactor: undefined,
      numRightWallThickness: undefined,
      numRightWallFactor: undefined,
      numBaseThickness: undefined,
      intQty: undefined,
      bitDetail: false,
      intUserId: 0
    };
    this.enableParam_foot = false;
  }
  OnSave(item: any) {
    debugger;
    this.enableParameterEditIndex = false;
    let ParameterSet = this.ParameterSetList.find(x => x.tntParamSetNumber === this.tntParameterSet).intParameterSet;


    const add_parameter: add_drain_parameterset = {
      tntParamSetNumber: this.tntParameterSet,
      intProjectId: this.SelectedProjectID,
      sitProductTypeL2Id: 17,
      vchProductType: '',
      tntTransportModeId: 0,
      sitTopCover: item.top_Cover,
      sitBottomCover: item.bottom_Cover,
      sitLeftCover: 0,
      sitRightCover: 0,
      sitInnerCover: item.inner_Cover,
      sitOuterCover: item.outer_Cover,
      sitGap1: 0,
      sitGap2: 0,
      chrStandardCP: '',
      vchTransportMode: '',
      tntStatusId: 1,
      intParameterSet: ParameterSet,
      intMo1: 0,
      intMo2: 0,
      intCo1: 0,
      intCo2: 0,
      chrStandarCL: '',
      chrCLMaterialType: '',
      vchParameterType: 'Drain',
      bitStructureMarkingLevel: false,
      sitHook: 0,
      sitLeg: 0,
      tntRefParamSetNumber: 0,
      sitMWLap: 0,
      sitCWLap: 0,
      sitProductTypeId: 0,
      intUserId: this.userId,
      vchDescription: ''
    }
    this.drainService.Add_ParameterSet(add_parameter)
      .subscribe({
        next: (response) => {
          debugger;
          console.log(response);
          this.tosterService.success('Parameter Added successfully')
          this.selectparameter = this.ParameterSetList[this.ParameterSetList.length - 1].ParameterSet + 1
        },
        error: (e) => {

        },
        complete: () => {
          this.LoadParameterSetList(this.SelectedProjectID)

        },
      });

  }
  ShowImage(item: any) {
    debugger;
    this.showImage = true;
    this.drainService.GetShapeDetails_Drain(item.intDrainWMId).subscribe({


      next: (response) => {
        debugger;
        this.ShapeParamlist = response;

      },
      error: (e) => {

      },
      complete: () => {

      }

    })
    this.drainService.Delete_Drain_Lap(item.intDrainLapId, true).subscribe({
      next: (response) => {

      },
      error: (e) => {
      },
      complete: () => {
        this.onChangeParameterList();
      },
    });

  }
  AddNewParameter() {
    if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined) {

      let ParameterSet;
      if(this.ParameterSetList.length>0)
      {
        ParameterSet=this.ParameterSetList[this.ParameterSetList.length - 1].intParameterSet + 1;

      }
      else{
        ParameterSet=1;
      }
      const add_parameter: add_drain_parameterset = {
        tntParamSetNumber: 0,
        intProjectId: this.SelectedProjectID,
        sitProductTypeL2Id: 17,
        vchProductType: '',
        tntTransportModeId: 0,
        sitTopCover: 40,
        sitBottomCover: 40,
        sitLeftCover: 0,
        sitRightCover: 0,
        sitInnerCover: 40,
        sitOuterCover: 40,
        sitGap1: 0,
        sitGap2: 0,
        chrStandardCP: '',
        vchTransportMode: '',
        tntStatusId: 1,
        intParameterSet: ParameterSet,
        intMo1: 0,
        intMo2: 0,
        intCo1: 0,
        intCo2: 0,
        chrStandarCL: '',
        chrCLMaterialType: '',
        vchParameterType: 'Drain',
        bitStructureMarkingLevel: false,
        sitHook: 0,
        sitLeg: 0,
        tntRefParamSetNumber: 0,
        sitMWLap: 0,
        sitCWLap: 0,
        sitProductTypeId: 0,
        intUserId: this.userId,
        vchDescription: ''
      }
      this.drainService.Add_ParameterSet(add_parameter)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);
            this.tosterService.success('Parameter Added successfully')
            this.selectparameter = this.ParameterSetList[this.ParameterSetList.length - 1].ParameterSet + 1
          },
          error: (e) => {

          },
          complete: () => {
            this.LoadParameterSetList(this.SelectedProjectID)

          },
        });
    }
    else{
      this.tosterService.warning("Please select Customer and Project");
    }
  }
  OnEditParam() {
    this.enableParameterEditIndex = true;
  }
  saveButton() {
    debugger
let shapeParameters= ''
let criticalIndicator = ''
let chrSeq = ''

let mwLength = 0


this.ShapeParamlist.forEach((element: any) => {
  if(element.intSegmentValue==0)
  {
    alert ('Please Enter Param Values');
    return ;
  }
  shapeParameters+=element.chrParamName.trim() +':' + element.intSegmentValue.toString().trim() + 'ì'
  criticalIndicator+='Nì'
  chrSeq+=element.intParamSeq.toString().trim() + 'ì';
  mwLength+=Number(element.intSegmentValue)
  
});
const obj:InsertPRojectParameter={
  intDrainWMId: this.Save_DrainWMId,
  nvchParamValues: shapeParameters,
  intMo1: this.popup_MO1,
  intMo2: this.popup_MO2,
  vchCriticalIndicator: criticalIndicator,
  vchSequence: chrSeq
}

let CWSpacing = this.Selected_ProductCode.intCWSpace;
if(((mwLength-this.popup_MO1-this.popup_MO2)%CWSpacing))

{

    alert ('Please change MO1 or MO2 to proceed further.');


    return ;



}

this.InsertPRojectParameter(obj);

}
  LoadShapeParamValues(shapeId: any) {
    this.drainService.GetShapeDetails_Drain(shapeId).subscribe({
      next: (response) => {
        debugger;
        this.ShapeParamlist = response;
        console.log("This is Shape parameter List Tanny ",this.ShapeParamlist)
      },
      error: (e) => {
      },
      complete: () => {
console.log("ackas" ,this.ProjectParamDrain_ParamDetails);
      }
    });
  }
  Get_DrainParamDetails() {
  }
  InsertPRojectParameter(item:InsertPRojectParameter)
  {
   
    this.drainService.Insert_DrainProjectParameterWm(item).subscribe({
      next: (response) => {
        debugger;
    
      },
      error: (e) => {
      },
      complete: () => {

        this.tosterService.success("Parameter values saved successfully")
          this.showImage=false;
          
      }
    });
  }
  GetProjectParamDrain_ParamDetails(item:any)
  {
  }
  async  preDefined(item:any)
  {
      debugger;
  if(item.bitPreDefined)
  {
    this.Save_DrainWMId = item.intDrainWMId;
    this.ProjectParamDrain_ParamDetails= await  this.GetProjectParamDrain_ParamDetails_wrapper(item);
    this.ShapeParamlist = await this.LoadShapeParamValues_wrapper(item.intShapeId);
    for(let i=0;i<this.ProjectParamDrain_ParamDetails.length;i++)
    {
      this.ShapeParamlist[i].intSegmentValue=this.ProjectParamDrain_ParamDetails[i].intSegmentValue;

    }
    this.showImage = true;
this.Imagename=item.chrShapeCode.trim() + '.png';
this.popup_MO1 = this.ProjectParamDrain_ParamDetails[0].intMo1
this.popup_MO2 = this.ProjectParamDrain_ParamDetails[0].intMo2




}
else{
  this.showImage=false;
}
  }
  async GetProjectParamDrain_ParamDetails_wrapper(item:any):Promise<any>
  {
    try {
      var a  = await  this.drainService.GetProjectParamDrainParamDetails(item.intDrainWMId).toPromise();
      return a;
    } catch (error) {
    console.log(error);
    return error
  }

  }

  async LoadShapeParamValues_wrapper(item:any):Promise<any>
  {
    try {
      var a  = await  this.drainService.GetShapeDetails_Drain(item).toPromise();
      return a;
    } catch (error) {
    console.log(error);
    return error
  }

  }

fn_addDrainDepth(item:any,Type:any)
{
  debugger;
  if(item.sitMaxDepth1=="" || item.sitMaxDepth1==0)
  {   
    // this.sitMaxDepth1?.nativeElement.focus();             
     alert("Please enter Max Depth 1 to proceed further.");  
    //  Inputs[n].focus();         
             
  }   
  else if(item.sitMaxDepth2=="" || item.sitMaxDepth2==0)
  {                
     alert("Please enter Max Depth 2 to proceed further.");  
     // this.sitMaxDepth2?.nativeElement.focus(); 
    //  Inputs[n].focus();         
             
  } 
  else if(item.sitMaxDepth3=="" || item.sitMaxDepth3==0)
  {                
     alert("Please enter Max Depth 3 to proceed further.");  
    //  this.sitMaxDepth3?.nativeElement.focus(); 
    //  Inputs[n].focus();         
             
  } 
  else if(item.sitMaxDepth4=="" || item.sitMaxDepth4==0)
  {                
     alert("Please enter Max Depth 4 to proceed further.");  
    //  this.sitMaxDepth4?.nativeElement.focus(); 
    //  Inputs[n].focus();         
             
  } 
  else if(item.sitMaxDepth5=="" || item.sitMaxDepth5==0)
  {                
     alert("Please enter Max Depth 5 to proceed further.");  
    //  this.sitMaxDepth5?.nativeElement.focus(); 
    //  Inputs[n].focus();         
             
  } 

  else if(item.sitMaxDepth1<100)
  {                
     alert("Please enter Max Depth 1 greater than 99 to proceed further.");  
     // this.sitMaxDepth1?.nativeElement.focus();    
         //            
  }  
  else if(item.sitMaxDepth2<100)
  {                
     alert("Please enter Max Depth 2 greater than 99 to proceed further.");  
     // this.sitMaxDepth2?.nativeElement.focus();    
    //            
  } 
  else if(item.sitMaxDepth3<100)
  {                
     alert("Please enter Max Depth 3 greater than 99 to proceed further.");  
    //  this.sitMaxDepth3?.nativeElement.focus();    
    //            
  } 
  else if(item.sitMaxDepth4<100)
  {                
     alert("Please enter Max Depth 4 greater than 99 to proceed further.");  
    //  this.sitMaxDepth4?.nativeElement.focus();    
    //            
  } 
  else if(item.sitMaxDepth5<100)
  {                
     alert("Please enter Max Depth 5 greater than 99 to proceed further.");  
    //  this.sitMaxDepth5?.nativeElement.focus();    
    
  } 

      
 else if (item.sitMaxDepth1 == 9999 && Number(item.sitMaxDepth2 < 9999))
  {                  
      alert('Please Enter Max Depth 1 to proceed further.');   
               
  } 
  
 else if (Number(item.sitMaxDepth1) !=9999 && Number(item.sitMaxDepth2) !=9999 && Number(item.sitMaxDepth1) > Number(item.sitMaxDepth2))
  {
      alert ('Max Depth 1 should be less than or equal to Max Depth 2. Kindly change to proceed.')
      
  }
  
else  if (Number(item.sitMaxDepth1) == 9999 && Number(item.sitMaxDepth2) == 9999 && Number(item.sitMaxDepth3) < 9999)
  {                  
      alert('Please Enter Max Depth 1 to proceed further.');   
                   
             
  } 
 else  if (Number(item.sitMaxDepth1)!= 9999 && Number(item.sitMaxDepth2) == 9999 && Number(item.sitMaxDepth3) < 9999)
  {                  
      alert('Please Enter Max Depth 2 to proceed further.');   
                   
             
  } 
  
  else if (Number(item.sitMaxDepth1) !=9999 && Number(item.sitMaxDepth2) !=9999 && Number(item.sitMaxDepth3) !=9999 && Number(item.sitMaxDepth2) > Number(item.sitMaxDepth3))
  {
      alert ('Max Depth 2 should be less than or equal to Max Depth 3. Kindly change to proceed.')
    
      
  }
    
  else if (Number(item.sitMaxDepth1) == 9999 && Number(item.sitMaxDepth2) == 9999 && Number(item.sitMaxDepth3) == 9999 && Number(item.sitMaxDepth4) < 9999)
  {                  
      alert('Please Enter Max Depth 1 to proceed further.');   
                   
             
  } 
 else  if (Number(item.sitMaxDepth1)!= 9999 && Number(item.sitMaxDepth2) == 9999 && Number(item.sitMaxDepth3) == 9999 && Number(item.sitMaxDepth4) < 9999)
  {                  
      alert('Please Enter Max Depth 2 to proceed further.');   
                   
             
  }   
 else  if (Number(item.sitMaxDepth1)!= 9999 && Number(item.sitMaxDepth2) != 9999 && Number(item.sitMaxDepth3) == 9999 && Number(item.sitMaxDepth4) < 9999)
  {                  
      alert('Please Enter Max Depth 3 to proceed further.');   
                   
             
  }   
  
  else   if (Number(item.sitMaxDepth1) !=9999 && Number(item.sitMaxDepth2) !=9999 && Number(item.sitMaxDepth3) !=9999 && Number(item.sitMaxDepth4) !=9999 && Number(item.sitMaxDepth3) > Number(item.sitMaxDepth4))
  {
      alert ('Max Depth 3 should be less than or equal to Max Depth 4. Kindly change to proceed.')
    
      
  }
  
  else if (Number(item.sitMaxDepth1) == 9999 && Number(item.sitMaxDepth2) == 9999 && Number(item.sitMaxDepth3) == 9999 &&  Number(item.sitMaxDepth4)== 9999 &&  Number(item.sitMaxDepth5) < 9999)
  {                  
      alert('Please Enter MaxDepth1 to proceed further.');   
                   
             
  } 
  else if (Number(item.sitMaxDepth1)!= 9999 &&  Number(item.sitMaxDepth2) == 9999 &&  Number(item.sitMaxDepth3) == 9999 &&  Number(item.sitMaxDepth4) == 9999 &&  Number(item.sitMaxDepth5)< 9999)
  {                  
      alert('Please Enter Max Depth 2 to proceed further.');   
                   
             
  }   
  else if (Number(item.sitMaxDepth1)!= 9999 &&  Number(item.sitMaxDepth2) != 9999 &&  Number(item.sitMaxDepth3) == 9999 &&  Number(item.sitMaxDepth4) == 9999  &&  Number(item.sitMaxDepth5) < 9999)
  {                  
      alert('Please Enter Max Depth 3 to proceed further.');   
                   
             
  }   
  else if (Number(item.sitMaxDepth1)!= 9999 &&  Number(item.sitMaxDepth2) != 9999 &&  Number(item.sitMaxDepth3) != 9999 &&  Number(item.sitMaxDepth4) == 9999  &&  Number(item.sitMaxDepth5) < 9999)
  {                  
      alert('Please Enter Max Depth 4 to proceed further.');   
                   
             
  }         
  
  else if ( Number(item.sitMaxDepth1) !=9999 &&  Number(item.sitMaxDepth2) !=9999 &&  Number(item.sitMaxDepth3) !=9999 &&  Number(item.sitMaxDepth4) !=9999 &&  Number(item.sitMaxDepth5) !=9999 &&  Number(item.sitMaxDepth4) >  Number(item.sitMaxDepth5))
  {
      alert ('Max Depth 4 should be less than or equal to Max Depth 5. Kindly change to proceed.')
    
      
  }  
  else{


    this.onSave_Depth(item,Type);
  }
}

}
