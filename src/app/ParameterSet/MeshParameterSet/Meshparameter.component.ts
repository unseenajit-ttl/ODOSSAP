import { ChangeDetectorRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { parameterSet } from 'src/app/Model/parameterSet';
import { capping } from 'src/app/Model/capping';
import { mainwirecrosswire } from 'src/app/Model/mainwirecrosswire';
import { clink } from 'src/app/Model/clink';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ParametersetService } from 'src/app/ParameterSet/Services/Parameterset/parameterset.service';
import { DDL_ParameterSet } from 'src/app/Model/ddl_parameterset';
import { CappingGridList } from 'src/app/Model/meshparameter_caping';
import { ADD_meshParameter } from 'src/app/Model/add_MeshParameter'
import { Clink } from 'src/app/Model/meshparameter_clink';
import { MeshList } from 'src/app/Model/meshparameter_meshlist';
import { ToastrService } from 'ngx-toastr';
import { ADD_meshParameterLap } from 'src/app/Model/add_meshParamLap';
import { ADD_columnParameter } from 'src/app/Model/add_columnParameter';
import { ADD_clinklineitem } from 'src/app/Model/add_ClinkLineItem';
import { ADD_cappingParameter } from 'src/app/Model/add_cappingParameter';
import { ADD_beamParameter } from 'src/app/Model/add_beamParameter';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { DeleteDialogComponent } from 'src/app/SharedComponent/Dialogs/delete-dialog/delete-dialog.component';



@Component({
  selector: 'app-Meshparameter',
  templateUrl: './Meshparameter.component.html',
  styleUrls: ['./Meshparameter.component.css']
})
export class MeshparameterComponent implements OnInit {

  MeshparameterForm!: FormGroup;
  customerList: any = [];
  parameterList: any[] = [];
  projectList: any = [];
  Diameterlist: any[] = []
  searchResult: boolean = false;
  loading: boolean = true;
  selectparameter: any = null;
  SelectedProjectID: any;

  isaddnew: boolean = false;
  isaddnewMesh: boolean = false;
  isaddnewColumn: boolean = false;
  isaddnewBeam: boolean = false;

  isupdatenew: boolean = false;
  isupdateMesh: boolean = false;
  isupdateColumn: boolean = false;
  isupdateBeam: boolean = false;



  MeshList: any[] = [];
  WallList: any[] = [];
  backup_Meshlist: any[] = [];
  backup_Walllist: any[] = [];
  isEditing: boolean = false;

  enableMeshEditIndex = null;
  enableColumnEditIndex = null;
  enableClinkEditIndex = null;
  enableBeamEditIndex = null;
  enableCappingEditIndex = null;
  is_standarddisable: boolean = false;
  ParameterSetList: DDL_ParameterSet[] = [];

  page = 1;
  pageSize = 0;
  maxSize: number = 10;
  currentPage = 1;
  itemsPerPage: number = 10;

  clink_pageSize: number = 0;
  clink_itemperPage: number = 10;
  clink_currentPage: number = 1;

  column_pageSize: number = 0;
  column_itemperPage: number = 10;
  column_currentPage: number = 1;

  beam_pageSize: number = 0;
  beam_itemperPage: number = 10;
  beam_currentPage: number = 1;

  capping_pageSize: number = 0;
  capping_itemperPage: number = 10;
  capping_currentPage: number = 1;

  wall_pageSize: number = 0;
  wall_itemperPage: number = 10;
  wall_currentPage: number = 1;


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
  ColumnList: any[] = [];
  backup_ColumnList: any[] = [];
  BeamList: any[] = [];
  backup_BeamList: any[] = [];
  CappingList: CappingGridList[] = [];
  backup_CappingList: CappingGridList[] = [];

  isshowstatus: boolean = true
  newparameter: parameterSet[] = [{ topcover: '', bottomcover: '', leftcover: '', rightcover: '', gap1: '', gap2: '' }];
  newcapping: capping[] = [{ beamdiameter: undefined, leg: undefined, hook: undefined, Caping_Product: undefined, CW_Length: undefined }];
  newmwcw: mainwirecrosswire[] = [{ productcode: null, mwlap: null, cwlap: null }];
  newclink: clink[] = [{ diameter: undefined, leg: undefined, cwlength: undefined }];
  TypeList: any[] = [];
  isaddnewWall: boolean=false;
  TransportModeList: any[]=[];
TransportModeForMesh: any;
EditMesh: boolean=false;
StartParam:boolean=true;


  constructor(
    public commonService: CommonService,
    public parametersetservice: ParametersetService,
    private tosterService: ToastrService,
    private formBuilder: FormBuilder,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private parametersetService: ParametersetService,) {

    this.MeshparameterForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      paramterset: new FormControl('', Validators.required),

    });

  }


  ngOnInit() {
    this.commonService.changeTitle('MeshParameter | ODOS');
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
          // this.selectparameter = this.ParameterSetList.slice(-1)[0].ParameterSet;
          this.changeDetectorRef.detectChanges();
        }

      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });
    this.changeDetectorRef.detectChanges();
    this.selectedCustomer = this.dropdown.getCustomerCode()
    this.SelectedProjectID = this.dropdown.getDetailingProjectId();

    this.GetTransportMode_Dropdown();

    console.log("Changed  Project id=" + this.SelectedProjectID)
    if (this.SelectedProjectID != undefined) {
      this.LoadParameterSetList(this.SelectedProjectID);
    }

    this.Diameterlist = [
      { item_id: '6', item_text: '6' },
      { item_id: '7', item_text: '7' },
      { item_id: '8', item_text: '8' },
      { item_id: '10', item_text: '10' },
      { item_id: '12', item_text: '12' },
      { item_id: '13', item_text: '13' },
      { item_id: '16', item_text: '16' },
      { item_id: '20', item_text: '20' },
      { item_id: '22', item_text: '22' },
      { item_id: '24', item_text: '24' },
      { item_id: '25', item_text: '25' },
      { item_id: '28', item_text: '28' },
      { item_id: '32', item_text: '32' },
      { item_id: '40', item_text: '40' },
      { item_id: '50', item_text: '50' },

    ];


    this.TypeList = [
      { type_id: 1, type_name: 'mesh' },
      { type_id: 2, type_name: 'beam' },
      { type_id: 3, type_name: 'column' }
    ]

  }
  ///Development with API

  // GetCustomer(): void {
  //   debugger;
  //   this.commonService.GetCutomerDetails().subscribe({

  //     next: (response) => {
  //       this.customerList = response;

  //     },
  //     error: (e) => {
  //     },
  //     complete: () => {
  //       this.loading = false;
  //     },
  //   });
  // }
  // changecustomer(event: any): void {
  //   this.selectedProject=null;

  //   this.GetProject(event);

  // }
  // GetProject(customercode: any): void {
  //   this.commonService.GetProjectDetails(customercode).subscribe({
  //     next: (response) => {
  //       this.projectList = response;
  //     },

  //     error: (e) => {
  //     },
  //     complete: () => {
  //     },

  //   });


  // }

  Changeparam(event: any) {
    debugger;
    console.log(event)
    this.selectparameter = event;
    if (this.selectedType == 'MSH') {

      this.GetMeshList();

    } else if (this.selectedType == 'column') {

      this.GetColumnList();
    }
    else if (this.selectedType == 'beam') {
      debugger;
      this.GetBeamList();
      console.log(this.newcapping[0].Caping_Product);
      this.LoadddlCappingProductList(this.newcapping[0].Caping_Product);
    }
    else if(this.selectedType == 'Wall') {
this.GetWallList()
    }


  }
  AddParameter() {
    // this.selectedType ,this.SelectedProjectID ppass to api
    debugger;
    this.isaddnew = true
    if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined) {
      //if (this.selectedType == 'MSH') {
      const meshParamter: ADD_meshParameter = {
        ProjectId: this.SelectedProjectID,
        ProductType: 'MSH',
        UserId: 1,
        ParamSetnumber: 0
      };

      this.parametersetservice.SaveCommonParamter(meshParamter)
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
            this.GetMeshList()
          },
        });
    }
    this.isaddnew = false
    // }
    // else {
    //   // this.tosterService.error('Select all Feilds')
    // }
  }

  DeleteParameter() {
    // this.selectedType ,this.SelectedProjectID ppass to api
    debugger;
    // if(this.ParameterSetList.length==1)
    // {
    //   this.tosterService.warning("U can not delete last Parameter");
    //   return ;
    // }    
    if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined) {
      //if (this.selectedType == 'MSH') {


        const ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          // centered: true,
          // size: 'lg',
        }
        this.loading = true;
        const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);
        // console.log("corecagedelete", item);
        modalRef.result.then(modalResult => {
          if (modalResult.isConfirm) {
      const meshParamter: ADD_meshParameter = {
        ProjectId: this.SelectedProjectID,
        ProductType: 'MSH',
        UserId: 1,
        ParamSetnumber: this.selectparameter
      };
      this.parametersetservice.DeleteCommonParamter(meshParamter)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);
            if(response==1)
            this.tosterService.success('Parameter Deleted successfully')
            else
                  this.tosterService.warning("You can not delete the Parameter,It is used in Groupmarking");

            // this.selectparameter = this.ParameterSetList[this.ParameterSetList.length - 1].ParameterSet + 1
          },
          error: (e) => {

          },
          complete: () => {
            this.StartParam = true;
            this.LoadParameterSetList(this.SelectedProjectID)
            this.GetMeshList()
          },
        });
      }
      });
    }
    this.isaddnew = false
    // }
    // else {
    //   // this.tosterService.error('Select all Feilds')
    // }
  }
  onEditBeam(item: any, index: any) {
    debugger;
    this.enableBeamEditIndex = index;
    this.backup_BeamList = JSON.parse(JSON.stringify(this.BeamList))
  }

  onEditColumn(item: any, index: any) {
    debugger;
    this.enableColumnEditIndex = index;
    this.backup_ColumnList = JSON.parse(JSON.stringify(this.ColumnList))
  }

  onEditMesh(item: any, index: any) {
    debugger;
    this.enableMeshEditIndex = index;
    this.backup_Meshlist = JSON.parse(JSON.stringify(this.MeshList))
    // this.MeshList.forEach((_element: any) => {
    //   _element.editFieldName = '';
    // });
    // item.editFieldName = field;
  }
  onEditCapping(item: any, index: any) {
    debugger;
    this.enableCappingEditIndex = index;
    this.backup_CappingList = JSON.parse(JSON.stringify(this.CappingList))
    //TO LOAD CAPING PRODUCT LIST
    this.CappingProductList = []
    this.parametersetService.GetCappingProductList(item.ProductCode).subscribe({
      next: (response) => {
        console.log("CappingProductList", response);
        this.CappingProductList = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  onEditClink(item: any, index: any) {
    debugger;
    this.enableClinkEditIndex = index;
    this.backup_ClinkList = JSON.parse(JSON.stringify(this.ClinkList))
    // this.ClinkList.forEach((_element: any) => {
    //   _element.editFieldName = '';
    // });
    // item.editFieldName = field;
  }

  //Mesh Insert
  AddMeshMwCw() {
    debugger;

    this.isaddnew = true
    this.isaddnewMesh = true
    if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined && this.selectparameter) {
      if (this.newmwcw[0].productcode != null && this.newmwcw[0].mwlap != null && this.newmwcw[0].cwlap != null) {

        const meshParamterLap: ADD_meshParameterLap = {
          ProjectId: this.SelectedProjectID,
          ParamSetnumber: Number(this.selectparameter),
          ProductType: 'MSH',
          ProductCodeId: this.newmwcw[0].productcode,
          Mwlap: this.newmwcw[0].mwlap,
          Cwlap: this.newmwcw[0].cwlap,
          UserId: 1,
          IntMeshLapId: 0,
          StructureElementTypeId: 0,
          TNTTRANSPORTMODEID: Number(this.TransportModeForMesh)
        };
        debugger;

        let boolExist = this.MeshList.findIndex((x: any) => x.ProductCodeId == Number(this.newmwcw[0].productcode))
        if (boolExist !== -1) {
          this.tosterService.warning("Same record already exists. Please check.");
          return;
        }

        this.parametersetservice.SaveMeshProjectParamLap(meshParamterLap)
          .subscribe({
            next: (response) => {
              debugger;
              console.log(response);

            },
            error: (e) => {

            },
            complete: () => {
              this.LoadParameterSetList(this.SelectedProjectID)
              this.GetMeshList()
              this.tosterService.success('Added successfully')
            },
          });
        // this.arrayObjMwCw.push(newitem);
        this.newmwcw = [{ productcode: null, mwlap: null, cwlap: null }];
        this.isaddnewMesh = false
      }
      else {
        alert('Can not add blank record.')
      }
      this.isaddnew = false
    }
    // console.log(this.newmwcw);
  }

  editIndex() {
    this.enableMeshEditIndex = null;
    this.enableColumnEditIndex = null;
    this.enableClinkEditIndex = null;
    this.enableBeamEditIndex = null;
    this.enableCappingEditIndex = null;
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.editIndex()
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }

  public onPageChange_Clink(pageNum: number): void {
    this.clink_pageSize = this.clink_itemperPage * (pageNum - 1);
    this.editIndex()
  }
  public OnPageSizeChange_Clink(pageSize: number): void {
    this.clink_pageSize = 0;
    this.clink_currentPage = 1;
  }

  public onPageChange_Column(pageNum: number): void {
    this.column_pageSize = this.column_itemperPage * (pageNum - 1);
    this.editIndex()
  }
  public OnPageSizeChange_Column(pageSize: number): void {
    this.column_pageSize = 0;
    this.column_currentPage = 1;
  }

  public onPageChange_Beam(pageNum: number): void {
    this.beam_pageSize = this.beam_itemperPage * (pageNum - 1);
    this.editIndex()
  }
  public OnPageSizeChange_Beam(pageSize: number): void {
    this.beam_pageSize = 0;
    this.beam_currentPage = 1;
  }

  public onPageChange_Capping(pageNum: number): void {
    this.capping_pageSize = this.capping_itemperPage * (pageNum - 1);
    this.editIndex()
  }
  public OnPageSizeChange_Capping(pageSize: number): void {
    this.capping_pageSize = 0;
    this.capping_currentPage = 1;
  }

  public onPageChange_wall(pageNum: number): void {
    this.wall_pageSize = this.wall_itemperPage * (pageNum - 1);
    this.editIndex()
  }
  public OnPageSizeChange_wall(pageSize: number): void {
    this.wall_pageSize = 0;
    this.wall_currentPage = 1;
  }


  // changeproject(event: any) {
  //   //this.temparray = []
  //   // this.ParameterSetList = [];
  //   this.selectparameter = null;
  //   console.log("project Code" + event);
  //   this.LoadParameterSetList(event)

  // }

  onTabSelect(item: any) {
    debugger;
    // this.selectedType = this.TypeList.find(x => x.type_name.toLowerCase() === item.toLowerCase()).type_id
    this.selectedType = item
    console.log(this.selectedType)
    // this.changeproject(this.selectedProject);
    this.CappingList = [];
    this.ClinkList = [];
    this.MeshList = [];
    this.ColumnList = [];
    this.BeamList = []
    this.editIndex();
    if (this.selectedType == 'MSH' && this.selectparameter != undefined) {
      this.GetMeshList()
    }
    else if (this.selectedType == 'column' && this.selectparameter != undefined) {
      this.GetColumnList()
      this.GetClinkList(this.tntParamterRefNumber)
    }
    else if (this.selectedType == 'beam' && this.selectparameter != undefined) {
      this.GetBeamList()
      this.GetCappingList(this.tntParamterRefNumber)
      this.LoadddlCappingProductList(this.newcapping[0].Caping_Product);
     // this.LoadddlCappingProductList('W');
      //newcapping
    }
    else if (this.selectedType == 'Wall' && this.selectparameter != undefined) {
      this.GetWallList();
    }


  }
  LoadParameterSetList(projectId: any) {
    debugger;
    console.log(projectId);
    if (projectId !== 0) {  //MESH
      this.parametersetService.GetParameterSetList(projectId).subscribe({
        next: (response) => {
          console.log(response);
          debugger;
          this.ParameterSetList = response;


          console.log("ParameterSetList", this.ParameterSetList);
          // this.GetMeshList();

        },
        error: (e) => {
        },
        complete: () => {

          if(this.StartParam)
          {
            this.selectparameter = this.ParameterSetList.slice(-1)[0].ParameterSet;
            this.StartParam=false;

          }
          this.GetMeshList();
          this.GetWallList();
          // this.contractListData = this.selectFilter(this.CoreCageProductListData)
          //this.backup_contractListData = JSON.parse(JSON.stringify(this.contractListData));
        },
      });
      this.LoadProductCodeList(projectId)

    }


  }



  LoadProductCodeList(projectId: any) {
    this.parametersetService.GetProductCodeList(projectId).subscribe({
      next: (response) => {
        console.log(response);
        this.ProductCodeList = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  changeCapingProduct(item: any) {
    // this.CappingProductList=[]
    let diameter = this.CappingProductList.find(x => x.INTPRODUCTCODEID === item).DECMWDIAMETER
    let length = this.CappingProductList.find(x => x.INTPRODUCTCODEID === item).DECCWLENGTH
    this.newcapping[0].beamdiameter = diameter
    this.newcapping[0].CW_Length = length
    console.log("abc", diameter)
  }

  changeCapingProductddlTable(item: any, index: any) {
    // this.CappingProductList=[]
    let diameter = this.CappingProductList.find(x => x.INTPRODUCTCODEID === item).DECMWDIAMETER
    let length = this.CappingProductList.find(x => x.INTPRODUCTCODEID === item).DECCWLENGTH
    index = this.capping_pageSize * this.capping_currentPage + index
    this.CappingList[index].Diameter = diameter
    this.CappingList[index].CWLength = length
    console.log("abc", diameter)
  }

  LoadddlCappingProductList(cappingProduct: any) {
    debugger;
    this.CappingProductList = []
    //console.log("capping", cappingProduct.value)
    let cappingproductvalue="";
    if(cappingProduct===undefined || cappingProduct===null)
    {
      cappingproductvalue='w';
    }else{
      cappingproductvalue=cappingProduct.value
    }

    this.parametersetService.GetCappingProductList(cappingproductvalue).subscribe({
      next: (response) => {
        console.log("CappingProductList", response);
        this.CappingProductList = response;

        if (this.CappingProductList.length > 0) {
          let diameter = this.CappingProductList.find(x => x.INTPRODUCTCODEID === 5182).DECMWDIAMETER;
          let length = this.CappingProductList.find(x => x.INTPRODUCTCODEID === 5182).DECCWLENGTH;
          this.newcapping[0].Caping_Product = 5182;
          this.newcapping[0].beamdiameter = diameter;
          this.newcapping[0].CW_Length = length;
          this.newcapping[0].leg = '120';
        }
      },
      error: (e) => {
      },
      complete: () => {


      },
    });
  }


  GetClinkList(tntParamterRefNumber: number) {
    debugger;
    this.parametersetService.GetClinkList(this.SelectedProjectID, tntParamterRefNumber).subscribe({
      next: (response) => {
        console.log(response);
        this.ClinkList = response;
        console.log("ClinkList", this.ClinkList);
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  ChangeStandard() {
    debugger;
    if (this.isshowstatus==true && this.CappingProductList.length > 0) {
      let diameter = this.CappingProductList.find(x => x.INTPRODUCTCODEID === 5182).DECMWDIAMETER;
      let length = this.CappingProductList.find(x => x.INTPRODUCTCODEID === 5182).DECCWLENGTH;
      this.newcapping[0].Caping_Product = 5182;
      this.newcapping[0].beamdiameter = diameter;
      this.newcapping[0].CW_Length = length;
      this.newcapping[0].leg = '120';
    }
    else{

      this.newcapping[0].Caping_Product = undefined;
      this.newcapping[0].beamdiameter = '8';
      this.newcapping[0].CW_Length = undefined;
      this.newcapping[0].leg = '120';

    }

  }
  GetCappingList(tntParamterRefNumber: number) {
    this.parametersetService.GetCappingList(this.SelectedProjectID, tntParamterRefNumber).subscribe({
      next: (response) => {
        console.log("Capping List ");
        console.log(response);
        this.CappingList = response;
        if (this.CappingList.length > 0) {
          let id = this.CappingList.findIndex(elem => elem.CHRSTANDARD.trim() === 'Y')
          debugger;
          if (id !== -1) {
            this.isshowstatus = true;
            this.is_standarddisable = true;

          }
          let idx = this.CappingList.findIndex(elem => elem.CHRSTANDARD.trim() === 'N')
          debugger;
          if (idx !== -1) {
            this.isshowstatus = false;
            this.is_standarddisable = true;

          }
        } else {
          this.is_standarddisable = false;

        }
        //Check List length to check Standard
        console.log("CappingList", this.CappingList);
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  GetBeamList() {
    this.parametersetService.GetBeamGridlist(this.SelectedProjectID, this.selectparameter).subscribe({
      next: (response) => {
        console.log(response);
        this.BeamList = response;
        this.tntParamterRefNumber = response[0].RefParamSetNumber
        console.log("BeamList", this.BeamList);
      },
      error: (e) => {
      },
      complete: () => {
        this.GetCappingList(this.tntParamterRefNumber);
      },
    });
  }
  GetColumnList() {
    debugger;
    this.parametersetService.GetColumnGridlist(this.SelectedProjectID, this.selectparameter).subscribe({
      next: (response) => {
        console.log(response);
        this.ColumnList = response;
        this.tntParamterRefNumber = response[0].RefParamSetNumber;///Assign RefParamterNumber
        console.log("ColumnList", this.ColumnList);
      },
      error: (e) => {
      },
      complete: () => {
        this.GetClinkList(this.tntParamterRefNumber);
      },
    });
  }

  GetMeshList() {
    this.parametersetService.GetMeshGridlist(this.SelectedProjectID, this.selectparameter).subscribe({
      next: (response) => {
        console.log(response);
        this.MeshList = response;
        console.log("MeshList", this.MeshList);
      },
      error: (e) => {
      },
      complete: () => {

        this.GetWallList();
        if(this.MeshList.length)
        {
          this.TransportModeForMesh=this.MeshList[0].tntTransportModeId
        }
        else{
                this.TransportModeForMesh = 6
        }
      },
    });
  }
  DeleteMeshList(id: number) {
    debugger;


    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    this.loading = true;
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);
    // console.log("corecagedelete", item);
    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {

        this.parametersetService.DeleteGridlist(id).subscribe({
          next: (response) => {
            console.log(response);
            this.MeshList = response;
            console.log("MeshList", this.MeshList);
          },
          error: (e) => {
          },
          complete: () => {
            this.GetMeshList();
            this.GetWallList();
            this.tosterService.success('Deleted successfully')
          },
        });

      }
    });

  
  }
  DeleteColumnlist(id: number) {
    console.log(id)
  }

  DeleteColumnClinklist(id: number) {
    debugger;
    this.parametersetService.DeleteClinklist(id).subscribe({
      next: (response) => {
        console.log(response);
        this.ClinkList = response;
      },
      error: () => {
      },
      complete: () => {
        this.GetClinkList(this.tntParamterRefNumber);
        this.tosterService.success('Deleted successfully')
      },
    });
  }

  DeleteBeamCappinglist(id: number) {
    debugger;
    this.parametersetService.DeleteCappinglist(id).subscribe({
      next: (response) => {
        console.log(response);
        this.CappingList = response;
      },
      error: (e) => {
      },
      complete: () => {
        this.GetCappingList(this.tntParamterRefNumber);
        this.tosterService.success('Deleted successfully')
      },
    });
  }

  resetClinkValue() {
    this.isaddnew = false
    this.isaddnewColumn = false
    this.newclink[0].diameter = undefined;
    this.newclink[0].leg = undefined;
    this.newclink[0].cwlength = undefined;
  }

  resetMeshValue() {
    this.isaddnew = false
    this.isaddnewMesh = false
    this.newmwcw = [{ productcode: null, mwlap: null, cwlap: null }];
  }

  resetCappingValue() {
    this.isaddnew = false
    this.isaddnewBeam = false
    this.newcapping = [{ beamdiameter: undefined, leg: undefined, hook: undefined, Caping_Product: undefined, CW_Length: undefined }]

    debugger;
    if (this.isshowstatus==true && this.CappingProductList.length > 0) {
      let diameter = this.CappingProductList.find(x => x.INTPRODUCTCODEID === 5182).DECMWDIAMETER;
      let length = this.CappingProductList.find(x => x.INTPRODUCTCODEID === 5182).DECCWLENGTH;
      this.newcapping[0].Caping_Product = 5182;
      this.newcapping[0].beamdiameter = diameter;
      this.newcapping[0].CW_Length = length;
      this.newcapping[0].leg = '120';
    }
    else{

      this.newcapping[0].Caping_Product = undefined;
      this.newcapping[0].beamdiameter = '8';
      this.newcapping[0].CW_Length = undefined;
      this.newcapping[0].leg = '120';

    }
  }

  //Column Add
  AddNew() {
    debugger
    this.isaddnew = true
    this.isaddnewColumn = true
    if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined && this.selectparameter != undefined) {
      if (this.newclink[0].diameter != undefined && this.newclink[0].leg != undefined && this.newclink[0].cwlength != null) {
        const clinkLneItem: ADD_clinklineitem = {
          ParamCageId: 0,
          ParameterSetNo: Number(this.tntParamterRefNumber),
          Diameter: Number(this.newclink[0].diameter),
          Leg: Number(this.newclink[0].leg),
          CWLength: Number(this.newclink[0].cwlength)
        }
        // ClinkList
        let boolExist = this.ClinkList.findIndex((x: any) => x.Diameter == Number(this.newclink[0].diameter) && x.Leg == Number(this.newclink[0].leg) && x.CWLength == Number(this.newclink[0].cwlength))
        if (boolExist !== -1) {
          this.tosterService.warning("Same record already exists. Please check.");
          return;
        }

        this.parametersetservice.SaveClinkLineItem(clinkLneItem)
          .subscribe({
            next: (response) => {
              debugger;
              console.log(response);
            },
            error: (e) => {

            },
            complete: () => {
              this.LoadParameterSetList(this.SelectedProjectID)
              this.GetClinkList(this.tntParamterRefNumber)

              this.tosterService.success('Added successfully');

            },
          });
        this.newclink = [{ diameter: undefined, leg: undefined, cwlength: undefined }];
        this.isaddnewColumn = false
      }
      else {
        // alert('Can not add blank record.')

      }
      this.isaddnew = false


    } else {

    }



  }


  //Beam Add
  AddCappingNew() {
    debugger
    this.isaddnew = true
    this.isaddnewBeam = true
    if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined && this.selectparameter != undefined) {
      if (this.isshowstatus) {
        if (this.newcapping[0].beamdiameter != undefined && this.newcapping[0].leg != undefined && this.newcapping[0].CW_Length != undefined) {
          const cappingLineItem: ADD_cappingParameter = {
            tntParamCageId: 0,
            tntParamSetNumber: Number(this.tntParamterRefNumber),
            intDiameter: Number(this.newcapping[0].beamdiameter),
            sitLeg: Number(this.newcapping[0].leg),
            Hook: 0,
            Length: Number(this.newcapping[0].CW_Length),
            CappingProductId: Number(this.newcapping[0].Caping_Product),
            chrStandard: 'Y'
          }

          debugger;

          let boolExist = this.CappingList.findIndex((x: any) => x.ProductCodeId == Number(this.newcapping[0].Caping_Product) && x.Diameter == Number(this.newcapping[0].beamdiameter) && x.Leg == Number(this.newcapping[0].leg) && x.CWLength == Number(this.newcapping[0].CW_Length))
          if (boolExist !== -1) {
            this.tosterService.warning("Same record already exists. Please check.");
            return;
          }

          this.parametersetservice.SaveCappingParamter(cappingLineItem)
            .subscribe({
              next: (response) => {
                debugger;
                console.log(response);
              },
              error: (e) => {

              },
              complete: () => {
                this.LoadParameterSetList(this.SelectedProjectID)
                this.GetCappingList(this.tntParamterRefNumber);
                this.tosterService.success('Added successfully')
              },
            });
          this.newcapping = [{ beamdiameter: undefined, leg: undefined, hook: undefined, Caping_Product: undefined, CW_Length: undefined }];
          this.isaddnewBeam = false
        }
        else {
          // alert('Can not add blank record.')
        }
      }
      else {
        debugger;
        if (this.newcapping[0].beamdiameter != undefined && this.newcapping[0].leg != undefined) {
          const cappingLineItem: ADD_cappingParameter = {
            tntParamCageId: 0,
            tntParamSetNumber: Number(this.tntParamterRefNumber),
            intDiameter: Number(this.newcapping[0].beamdiameter),
            sitLeg: Number(this.newcapping[0].leg),
            Hook: 0,
            Length: 0,
            CappingProductId: 0,
            chrStandard: 'N'
          }
          let boolExist = this.CappingList.findIndex((x: any) => x.Diameter == Number(this.newcapping[0].beamdiameter) && x.Leg == Number(this.newcapping[0].leg))
          if (boolExist !== -1) {
            this.tosterService.warning("Same record already exists. Please check.");
            return;
          }

          this.parametersetservice.SaveCappingParamter(cappingLineItem)
            .subscribe({
              next: (response) => {
                debugger;
                console.log(response);
              },
              error: (e) => {

              },
              complete: () => {
                this.LoadParameterSetList(this.SelectedProjectID)
                this.GetCappingList(this.tntParamterRefNumber);
                this.tosterService.success('Added successfully')
              },
            });
          this.newcapping = [{ beamdiameter: undefined, leg: undefined, hook: undefined, Caping_Product: undefined, CW_Length: undefined }];
          this.isaddnewBeam = false
        }
        else {
          // alert('Can not add blank record.')
        }
        this.isaddnew = false
      }
    }
  }


  Update_Mesh(item: any, index: any) {
    this.isupdateMesh = true;
    console.log("item", item)
    if (item.ProductCode != undefined && item.MwLap != undefined && item.CwLap != undefined) {
      const meshParamterLap: ADD_meshParameterLap = {
        ProjectId: this.SelectedProjectID,
        ParamSetnumber: Number(this.selectparameter),
        ProductType: 'MSH',
        ProductCodeId: item.ProductCodeId,
        Mwlap: item.MwLap,
        Cwlap: item.CwLap,
        UserId: 1,
        IntMeshLapId: item.MeshLapId,
        StructureElementTypeId: 0,
        TNTTRANSPORTMODEID: 0
      };


      let BackupMeshList = this.MeshList.slice(0, index).concat(this.MeshList.slice(index + 1));//this.MeshList.splice(index,1);
      console.log(BackupMeshList);


      let boolExist = BackupMeshList.findIndex((x: any) => x.ProductCodeId == Number(item.ProductCodeId))
      if (boolExist !== -1) {
        this.tosterService.warning("Same record already exists. Please check.");
        return;
      }

      this.parametersetservice.SaveMeshProjectParamLap(meshParamterLap)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);

          },
          error: (e) => {

          },
          complete: () => {
            this.isupdateMesh = false;
            this.LoadParameterSetList(this.SelectedProjectID)
            this.GetMeshList()
            this.tosterService.success('Updated successfully')
            this.editIndex()
          },
        });
    }
    else {
      alert('Can not add blank record.')
    }
  }
  Update_Clink(item: any, index: any) {
    debugger;
    this.isupdateColumn = true;
    if (item.Diameter != undefined && item.Leg != undefined && item.CWLength != null) {

      const clinkLneItem: ADD_clinklineitem = {
        ParamCageId: Number(item.ParamCageId),
        ParameterSetNo: Number(item.ParameterSetNo),
        Diameter: Number(item.Diameter),
        Leg: Number(item.Leg),
        CWLength: Number(item.CWLength)
      }


      let BackupClink = this.ClinkList.slice(0, index).concat(this.ClinkList.slice(index + 1));
      console.log(BackupClink);

      let boolExist = BackupClink.findIndex((x: any) => x.Diameter == Number(item.Diameter) && x.Leg == Number(item.Leg) && x.CWLength == Number(item.CWLength))
      if (boolExist !== -1) {
        this.tosterService.warning("Same record already exists. Please check.");
        return;
      }

      this.parametersetservice.SaveClinkLineItem(clinkLneItem)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);
          },
          error: (e) => {

          },
          complete: () => {
            this.LoadParameterSetList(this.SelectedProjectID)
            this.GetClinkList(this.tntParamterRefNumber)
            this.tosterService.success('Updated successfully')
            this.editIndex();
            this.isupdateColumn = false;
          },
        });
    }
    else {
      alert('Can not add blank record.')
    }
  }
  Update_Capping(item: any, index: any) {
    debugger
    this.isupdateBeam = true;
    if (this.isshowstatus) {
      if (item.Diameter != undefined && item.Leg != undefined && item.CWLength != undefined) {
        const cappingLineItem: ADD_cappingParameter = {
          tntParamCageId: item.TNTPARAMCAGEID,
          tntParamSetNumber: Number(this.selectparameter),
          intDiameter: Number(item.Diameter),
          sitLeg: Number(item.Leg),
          Hook: Number(item.Hook),
          Length: Number(item.CWLength),
          CappingProductId: Number(item.ProductCodeId),
          chrStandard: 'Y'
        }
        let BackupCappingList = this.CappingList.slice(0, index).concat(this.CappingList.slice(index + 1));
        console.log(BackupCappingList);

        let boolExist = BackupCappingList.findIndex((x: any) => x.ProductCodeId == Number(item.ProductCodeId) && x.Diameter == Number(item.Diameter) && x.Leg == Number(item.Leg) && x.CWLength == Number(item.CWLength))
        if (boolExist !== -1) {
          this.tosterService.warning("Same record already exists. Please check.");
          return;
        }

        this.parametersetservice.SaveCappingParamter(cappingLineItem)
          .subscribe({
            next: (response) => {
              debugger;
              console.log(response);
            },
            error: (e) => {

            },
            complete: () => {
              this.LoadParameterSetList(this.SelectedProjectID)
              this.GetCappingList(this.tntParamterRefNumber);
              this.resetCappingValue();
              this.tosterService.success('Updated successfully')
              this.editIndex();
              this.isupdateBeam = false;
            },
          });
      }
      else {
        alert('Can not add blank record.')
      }
    }
    else {
      if (item.Diameter != undefined && item.Leg != undefined && item.Hook != undefined) {
        const cappingLineItem: ADD_cappingParameter = {
          tntParamCageId: item.TNTPARAMCAGEID,
          tntParamSetNumber: Number(this.selectparameter),
          intDiameter: Number(item.Diameter),
          sitLeg: Number(item.Leg),
          Hook: Number(item.Hook),
          Length: Number(item.CWLength),
          CappingProductId: 0,
          chrStandard: 'N'
        }

        this.parametersetservice.SaveCappingParamter(cappingLineItem)
          .subscribe({
            next: (response) => {
              debugger;
              console.log(response);
            },
            error: (e) => {

            },
            complete: () => {
              this.LoadParameterSetList(this.SelectedProjectID)
              this.GetCappingList(this.tntParamterRefNumber);
              this.tosterService.success('Updated successfully')
              this.editIndex()
            },
          });
      }
      else {
        alert('Can not add blank record.')
      }
    }
    // if (item.Diameter != undefined && item.Leg != undefined && item.Hook != undefined && item.CWLength != undefined) {
    //   const cappingLineItem: ADD_cappingParameter = {
    //     tntParamCageId: item.TNTPARAMCAGEID,
    //     tntParamSetNumber: Number(this.selectparameter),
    //     intDiameter: Number(item.Diameter),
    //     sitLeg: Number(item.Leg),
    //     Hook: Number(item.Hook),
    //     Length: Number(item.CWLength),
    //     CappingProductId:Number(item.ProductCode)
    //   }

    //   this.parametersetservice.SaveCappingParamter(cappingLineItem)
    //     .subscribe({
    //       next: (response) => {
    //         debugger;
    //         console.log(response);
    //       },
    //       error: (e) => {

    //       },
    //       complete: () => {
    //         this.LoadParameterSetList(this.SelectedProjectID)
    //         this.GetCappingList(this.tntParamterRefNumber);
    //         this.tosterService.success('Updated successfully')
    //         this.editIndex()
    //       },
    //     });
    // }
    // else {
    //   alert('Can not add blank record.')
    // }

  }

  Update_Beam(item: any, index: any) {
    debugger
    console.log(item)
    this.isupdateBeam = true;

    if (item.TopCover != undefined && item.BottomCover != undefined && item.RightCover != undefined && item.LeftCover != undefined
      && item.Hook != undefined && item.Leg != undefined) {

      const beamParamter: ADD_beamParameter = {
        ProjectId: item.ProjectId,
        ProductType: 'MSH',
        BeamParameterSetNo: item.ParamSetNumber,
        BeamTopCover: item.TopCover,
        BeamBottonCover: item.BottomCover,
        BeamRightCover: item.RightCover,
        BeamLeftCover: item.LeftCover,
        BeamHook: item.Hook,
        BeamLeg: item.Leg,
        UserId: 1,
        TNTTRANSPORTMODEID: item.tntTransportModeId
      }

      this.parametersetservice.SaveBeamParamter(beamParamter)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);
          },
          error: (e) => {

          },
          complete: () => {
            this.LoadParameterSetList(this.SelectedProjectID);
            this.GetBeamList()
            this.tosterService.success('Parameter Updated successfully');
            this.editIndex();
            this.isupdateBeam = false;
          },
        });
    }
    else {
      alert('Can not add blank record.')
    }
  }



  Update_Column(item: any, index: any) {
    console.log(item)
    this.isupdateColumn = true;
    //Check for column parameter
    if (item.TopCover != undefined && item.BottomCover != undefined && item.LeftCover != undefined && item.RightCover != undefined) {

      const columnParamter: ADD_columnParameter = {
        ProjectId: item.ProjectId,
        ProductType: 'MSH',
        ColumnParameterSetNo: item.ParameterSetNumber,
        ColumnTopCover: item.TopCover,
        ColumnBottonCover: item.BottomCover,
        ColumnRightCover: item.RightCover,
        ColumnLeftCover: item.LeftCover,
        TNTTRANSPORTMODEID: item.TNTTRANSPORTMODEID
      }

      this.parametersetservice.SaveColumnParamter(columnParamter)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);
          },
          error: (e) => {

          },
          complete: () => {
            this.isupdateColumn = false;
            this.GetColumnList();
            this.LoadParameterSetList(this.SelectedProjectID);
            this.tosterService.success('Parameter Added successfully');
            this.editIndex()
          },
        });
    }
    else {
      alert('Can not add blank record.')
    }


  }

  Editcancel(item: any, index: any) {
    if (this.selectedType == 'MSH') {
      this.MeshList = JSON.parse(JSON.stringify(this.backup_Meshlist))

    }
    else if (this.selectedType == 'column') {
      if (this.enableColumnEditIndex != null) {
        this.ColumnList = JSON.parse(JSON.stringify(this.backup_ColumnList))
      } else {
        this.ClinkList = JSON.parse(JSON.stringify(this.backup_ClinkList))
      }
    }
    else if (this.selectedType == 'beam') {
      if (this.enableBeamEditIndex != null) {
        this.BeamList = JSON.parse(JSON.stringify(this.backup_BeamList))
      } else {
        this.CappingList = JSON.parse(JSON.stringify(this.backup_CappingList))
      }
    }
    else  if (this.selectedType == 'Wall') {
      this.WallList = JSON.parse(JSON.stringify(this.backup_Walllist))

    }
    this.editIndex()
    // var i = this.shapesurchargeList.findIndex(x => x.ID === item.ID);

    // this.isEditing = false;
    // this.formsubmit = true;
    // this.prev_index = null;
  }

 //Wall Operations
 AddWallMwCw() {
  debugger;

this.isaddnewWall=true;
  if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined && this.selectparameter) {
    if (this.newmwcw[0].productcode != null && this.newmwcw[0].mwlap != null && this.newmwcw[0].cwlap != null) {

      const meshParamterLap: ADD_meshParameterLap = {
        ProjectId: this.SelectedProjectID,
        ParamSetnumber: Number(this.selectparameter),
        ProductType: 'MSH',
        ProductCodeId: this.newmwcw[0].productcode,
        Mwlap: this.newmwcw[0].mwlap,
        Cwlap: this.newmwcw[0].cwlap,
        UserId: 1,
        IntMeshLapId: 0,
        StructureElementTypeId: 13,
        TNTTRANSPORTMODEID: 0
      };
      debugger;

      let boolExist = this.WallList.findIndex((x: any) => x.ProductCodeId == Number(this.newmwcw[0].productcode) && x.CwLap == Number(this.newmwcw[0].mwlap) && x.MwLap == Number(this.newmwcw[0].mwlap))
      if (boolExist !== -1) {
        this.tosterService.warning("Same record already exists. Please check.");
        return;
      }

      this.parametersetservice.SaveMeshProjectParamLap(meshParamterLap)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);

          },
          error: (e) => {

          },
          complete: () => {
            this.LoadParameterSetList(this.SelectedProjectID)
            this.GetWallList()
            this.tosterService.success('Added successfully')
          },
        });
      // this.arrayObjMwCw.push(newitem);
      this.newmwcw = [{ productcode: null, mwlap: null, cwlap: null }];
      this.isaddnewWall = false
    }
    else {
      alert('Can not add blank record.')
    }
    this.isaddnew = false
  }
  // console.log(this.newmwcw);
}

resetWallValue() {
  this.isaddnew = false
  this.isaddnewWall = false
  this.newmwcw = [{ productcode: null, mwlap: null, cwlap: null }];
}

GetWallList() {
  this.parametersetService.GetWallGridlist(this.SelectedProjectID, this.selectparameter).subscribe({
    next: (response) => {
      console.log(response);
      if(response.length>0)
      {

        this.WallList = response;
      }
      else{
        this.WallList = [];
      }
      console.log("MeshList", this.MeshList);
    },
    error: (e) => {
    },
    complete: () => {
    },
  });
}

Update_Wall(item: any, index: any) {
  this.isupdateMesh = true;
  console.log("item", item)
  if (item.ProductCode != undefined && item.MwLap != undefined && item.CwLap != undefined) {
    const meshParamterLap: ADD_meshParameterLap = {
      ProjectId: this.SelectedProjectID,
      ParamSetnumber: Number(this.selectparameter),
      ProductType: 'MSH',
      ProductCodeId: item.ProductCodeId,
      Mwlap: item.MwLap,
      Cwlap: item.CwLap,
      UserId: 1,
      IntMeshLapId: item.MeshLapId,
      StructureElementTypeId: 13,
      TNTTRANSPORTMODEID: 0
    };


    let BackupMeshList = this.MeshList.slice(0, index).concat(this.MeshList.slice(index + 1));//this.MeshList.splice(index,1);
    console.log(BackupMeshList);


    let boolExist = BackupMeshList.findIndex((x: any) => x.ProductCodeId == Number(item.ProductCodeId) && x.CwLap == Number(item.CwLap) && x.MwLap == Number(item.MwLap))
    if (boolExist !== -1) {
      this.tosterService.warning("Same record already exists. Please check.");
      return;
    }

    this.parametersetservice.SaveMeshProjectParamLap(meshParamterLap)
      .subscribe({
        next: (response) => {
          debugger;
          console.log(response);

        },
        error: (e) => {

        },
        complete: () => {
          this.isupdateMesh = false;
          this.LoadParameterSetList(this.SelectedProjectID)
          this.GetMeshList()
          this.tosterService.success('Updated successfully')
          this.editIndex()
        },
      });
  }
  else {
    alert('Can not add blank record.')
  }
}
DeleteWallList(id: number) {
  debugger;
  this.parametersetService.DeleteGridlist(id).subscribe({
    next: (response) => {
      console.log(response);
      this.MeshList = response;
      console.log("MeshList", this.MeshList);
    },
    error: (e) => {
    },
    complete: () => {
      this.GetMeshList();

      this.tosterService.success('Deleted successfully')
    },
  });
}
GetTransportMode_Dropdown()
{

  this.parametersetService.GetTransportModeList().subscribe({
    next: (response) => {
      console.log(response);
      this.TransportModeList = response;
      console.log("MeshList", this.TransportModeList);
    },
    error: (e) => {
    },
    complete: () => {

    },
  });

}

onEditMeshParameterSet()
{
  this.EditMesh = true;

}
onEditMeshParameterSetCancel()
{
  this.EditMesh = false;

}


Update_TransportMode() {
  this.isupdateMesh = true;

    const meshParamterLap: ADD_meshParameterLap = {
      ProjectId: this.SelectedProjectID,
      ParamSetnumber: Number(this.selectparameter),
      ProductType: 'MSH',
      ProductCodeId: 0,
      Mwlap: 0,
      Cwlap: 0,
      UserId: 1,
      IntMeshLapId: 0,
      StructureElementTypeId: 0,
      TNTTRANSPORTMODEID: this.TransportModeForMesh
    };






    this.parametersetservice.SaveMeshProjectParamLap(meshParamterLap)
      .subscribe({
        next: (response) => {
          debugger;
          console.log(response);

        },
        error: (e) => {

        },
        complete: () => {
          this.isupdateMesh = false;
          this.LoadParameterSetList(this.SelectedProjectID)
          this.GetMeshList()
          this.tosterService.success('Transport Mode Updated successfully')
          this.editIndex()
        },
      });


    }


}



