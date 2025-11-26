import { HttpClient } from '@angular/common/http';
import { IfStmt, LiteralMap } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ADD_SLAB_STRUCTURE_MARKING } from 'src/app/Model/add_slabStructureMarking';
import { BomData } from 'src/app/Model/BomData';
import { Slab_ProductCode } from 'src/app/Model/productcode';
import { ShapeCodeParameterSet } from 'src/app/Model/ShapeCodeParameterSet';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/SharedComponent/ConfirmBox/confirm-dialog.component';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { environment } from 'src/environments/environment';
// import { SlabStructureMarklist } from 'src/app/Model/slabstructureMarklist';
import { DetailingService } from '../../DetailingService';
import { GroupMarkComponent } from '../../MeshDetailing/addgroupmark/addgroupmark.component';
import { CarpetService } from '../../MeshDetailing/carpet.service';
// import {  } from '../../BOM/bom';
import { RegenerateDialogComponent } from '../../RegenarationDialog/Regenerate-dialog.component';

@Component({
  selector: 'app-carpet',
  templateUrl: './carpet.component.html',
  styleUrls: ['./carpet.component.css']
})
export class CarpetComponent implements OnInit {


  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;


  DetailingID: any;
  StructureElementId: any;
  ProjectId: any;
  @Input() ParameterSetNo: any;
  loading: any;
  enableEditIndex: any
  Imagename: any;
  editprod: boolean = false;
  isExpanded = 0;
  ShapeParamlist: any

  ParameterSetList: any;

  @ViewChild('input2')
  input2!: ElementRef;
  @ViewChild('input3')
  input3!: ElementRef;

  @ViewChild('Shapeparam')
  Shapeparam!: ElementRef;
  
  @ViewChild('strucuremarkingInput')
  strucuremarkingInput!: ElementRef;

  @Input() ParentStructureMarkId: number = 0;
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

  carpetStructureMarklist: any[] = [];
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
  popup_MO1: number = 100;
  popup_MO2: number = 100;
  popup_CO1: number = 100;
  popup_CO2: number = 100;

  mainWireTotal: number = 0;
  crossWireTotal: number = 0;
  noOfMainWire: number = 0;
  noOfCrossWire: number = 0;
  editShapeParam: boolean = false
  selectedproductCode: any;
  strQueryString: string | undefined;
  ShowMOCO:boolean=false;



  i: number = 0;
  j: number = 1;



  @ViewChild('MO1text')
  MO1text!: ElementRef;

  pushElement: any =
    { 'marking': '', 'Product': '', 'main': '', 'cross': '', 'qty': '', 'shape': '', 'split_up': true, 'prodind': true, 'pinsize': '32','MO1':'100','MO2':'100','CO1':'100','CO2':'100' };

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
  error: boolean=false;
  ShapeCode_Edit: any;
  intGap2: number=0;
  Slab_Product: any;
  Slab_Structure: any;
  Mode: string="S";
  lastElementColumn: any;
  expandRow = 0;


  constructor(public httpClient: HttpClient,
    private modalService: NgbModal,
    public detailingService: DetailingService,
    private tosterService: ToastrService,
    public dialog: MatDialog,
    public router: Router,
    private reloadService: ReloadService,
    private el: ElementRef,
    private CarpetService:CarpetService,
    private renderer: Renderer2,

    ) {
    console.log('Vanita'+this.ParameterSetNo);

    this.detailingService.Parameter_SetService.subscribe(
      (data: string) => {
        //debugger;
          this.ParameterSetData = data;

           if (this.ParameterSetData != null)
          {
            this.storedObjectData = localStorage.getItem('MeshData');
            this.MeshData = JSON.parse(this.storedObjectData);

            this.Changed_ParameterSet = this.ParameterSetData;



            if(this.MeshData.INTGROUPMARKID==0 ||this.MeshData.INTSEDETAILINGID==0)
              {
                return;
              }
              if(this.Changed_ParameterSet.INTPARAMETESET!=this.ParameterSetNo.INTPARAMETESET)
              {
                   if(this.carpetStructureMarklist.length>0)
                   {
                    const ngbModalOptions: NgbModalOptions = {
                      backdrop: 'static',
                      keyboard: false,
                      centered: true,
                      size: 'lg',

                    }
                    const modalRef = this.modalService.open(RegenerateDialogComponent, ngbModalOptions);
                    modalRef.componentInstance.messagenumber=1;
                     modalRef.result.then(modalResult => {
                      if (modalResult.isConfirm) {
//debugger;
                        this.detailingService.UpdateGroupMarking(this.MeshData.INTSEDETAILINGID,this.Changed_ParameterSet.TNTPARAMSETNUMBER).subscribe({
                          next: (response) => {
                             console.log(response);
                          },
                          error: (e) => {
                            //console.log("error",e);
                          },
                          complete: () => {
                           //this.loading= true;
                              //Regeneration

                              this.detailingService.RegenerateValidation(this.Changed_ParameterSet,4,1,this.ProjectId,7,this.DetailingID).subscribe({
                                next: (response) => {
                                  //console.log(response);
                                },
                                error: (e) => {
                                   console.log(e);
                                   let errorMessage = e.error.split(':')
                                  this.tosterService.error(errorMessage[0] + errorMessage[1] )

                                },
                                complete: () => {
                                this.tosterService.success("Regenrated Successfully")

                                },
                              });
                              //

                          },
                        });

                       }
                       })
                      }
                      else
                      {
                        const ngbModalOptions: NgbModalOptions = {
                          backdrop: 'static',
                          keyboard: false,
                          centered: true,
                          size: 'lg',

                        }
                        const modalRef = this.modalService.open(RegenerateDialogComponent, ngbModalOptions);
                        modalRef.componentInstance.messagenumber=2;
                         modalRef.result.then(modalResult => {
                          if (modalResult.isConfirm) {

                            // this.detailingService.UpdateGroupMarking(this.MeshData.INTSEDETAILINGID,this.Changed_ParameterSet.ParameterSetNumber).subscribe({
                            //   next: (response) => {
                            //      //console.log(response);
                            //   },
                            //   error: (e) => {
                            //     //console.log("error",e);
                            //   },
                            //   complete: () => {
                            //    //this.loading= true;


                            //   },
                            // });

                           }
                           })

                      }


              }



            }
    });
  }


  ngOnInit() {
    //debugger;
    //this.loading = true;
    //console.log(localStorage.getItem('PostedGM'));
    this.intRecordCount = Number(localStorage.getItem('PostedGM'));
    //console.log(this.intRecordCount);
    if (this.intRecordCount > 0) {
      this.strIsReadOnly = 'YES'
    }
    this.storedObjectData = localStorage.getItem('MeshData');

    this.MeshData = JSON.parse(this.storedObjectData);
    console.log("meshdata" + this.MeshData);
    this.IntGroupMarkId = this.MeshData.INTGROUPMARKID;
    this.DetailingID = this.MeshData.INTSEDETAILINGID
    this.StructureElementId = this.MeshData.INTSTRUCTUREELEMENTTYPEID
    this.ProjectId = this.MeshData.INTPROJECTID
    this.ProductTypeID = this.MeshData.SITPRODUCTTYPEID
    this.Load_CarpetproductCodeDropdown("1");
    this.Load_CarpetShapecodeCodeDropdown();

    //console.log("Mesh data Object", this.MeshData);
    // if (this.MeshData.VCHPRODUCTTYPE !== 'PRC') {
    // if (this.StructureElementId == 4 || this.StructureElementId == 58 || this.StructureElementId == 69 || this.StructureElementId == 13) {

    this.LoadCarpetParameterSet(this.ProjectId);
    this.loadCarpetdata(this.DetailingID, this.StructureElementId);
    //}



    // }
  }

  changeProductCode(Product: any) {
    //debugger;
    //this.selectedproductCode = Product;
    if (this.Slabproductcode_dropdown.length > 0) {
      this.selectedproductCode = this.Slabproductcode_dropdown.find((x: any) => x.ProductCodeId == Product);

    }


  }
  loadCarpetdata(seDetailingID: any, structureElementId: any) {
    //debugger;
    this.loading = true;
    if(this.MeshData.VCHPRODUCTTYPE === 'CORE')
    {
    this.StructureElementId=4;
    }
    this.CarpetService.GetCarpetStructureMarkingDetails(seDetailingID, this.StructureElementId).subscribe({
      next: (response) => {

        console.log(response);
        this.carpetStructureMarklist = response;
         this.structlist = JSON.parse(JSON.stringify(this.carpetStructureMarklist))
        for (var i = 0; i < this.carpetStructureMarklist.length; i++) {
          if(this.expandRow == this.carpetStructureMarklist[i].StructureMarkId){
            this.carpetStructureMarklist[i].isExpand = true;
          }else if(this.carpetStructureMarklist.length-1 == i  && this.expandRow == 0){
            this.carpetStructureMarklist[i].isExpand = true;
          }else{
            this.carpetStructureMarklist[i].isExpand = false;
          }

        }
        this.expandRow = 0;
        //debugger;
      },
      error: (e) => {
                this.loading = false;

        //console.log("error", e);
      },
      complete: () => {
        this.loading = false;
        this.lastElement = this.carpetStructureMarklist[this.carpetStructureMarklist.length - 1];
       if(!this.error)
       {
        this.currentPage = (this.carpetStructureMarklist.length) / this.itemsPerPage
        this.currentPage = Math.ceil(this.currentPage);

        this.pageSize = this.itemsPerPage * (this.currentPage - 1)
        console.log("this.pageSize", this.pageSize)
        console.log("this.itemsPerPage", this.itemsPerPage)
        console.log("this.currentPage", this.currentPage)
        this.initialDataInsert();
       }
      },
    });
  }

  startsWithSearchFn(term:string,item:any) {
    return item.ShapeCodeName.toLocaleLowerCase().startsWith(term.toLocaleLowerCase());
  }
  startsWithSearchFn1(term:string,item:any) {
    return item.ProductCodeName.toLocaleLowerCase().startsWith(term.toLocaleLowerCase());
  }
  //abd
  // loadCollapsabledata(item: any) {

  //   //debugger;

  //   this.detailingService.GetSlabStructureMarkingDetailsColl(item.INTSTRUCTUREMARKID).subscribe({
  //     next: (response) => {

  //       //console.log("Tanmay");
  //       item.CarpetProduct = response;
  //       for (var i = 0; i < item.CarpetProduct.length; i++) {
  //         item.CarpetProduct[i].isEdit = false;
  //       }
  //       //console.log(item.CarpetProduct);

  //     },
  //     error: (e) => {
  //       //console.log("error", e);
  //     },
  //     complete: () => {
  //       //this.loading = false;
  //       this.lastElement = this.carpetStructureMarklist[this.carpetStructureMarklist.length - 1];
  //       this.initialDataInsert();

  //     },
  //   });



  // }
  onCopy(item: any,structmark:any) {
    //debugger;
    this.expandRow = structmark.StructureMarkId;
    this.CarpetService.Copy_ProductMarking(item,this.StructureElementId).subscribe({
      next: (response) => {
        //debugger;


      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        this.loadCarpetdata(this.DetailingID, this.StructureElementId);
      },
    });
  }

GetOverHang(parameterSetNumber :any,projectId:any,structureElementId :any,productTypeId :any,mwLength :any,cwLength :any,mwSpace :any,cwSpace :any)
{
  // this.detailingService.Get_OverHang().subscribe({
  //   next: (response) => {
  //     //debugger;


  //   },
  //   error: (e) => {
  //     //console.log("error", e);
  //   },
  //   complete: () => {
  //     this.loadCarpetdata(this.DetailingID, this.StructureElementId);
  //   },
  // });
}
  Changeparam(event: any) {
    // this.shapeParameter = event;


    this.shapeSelected = true;
    this.showImage = true;
    this.pushElement.shape = event;
    this.img_index = event;




  }

  structureMarkChange(event: any) {
    //console.log(event);
    let strucutremark = this.carpetStructureMarklist.find((x: any) => x.StructureMarkingName === event.target.value);
    if (strucutremark != null) {
      this.tosterService.error("Structure Mark Name already exists. Please check.");

    }

  }

  onSubmit() {

    //debugger;
    this.isaddnewRecord = true;

    this.error= false;
    //console.log(this.pushElement.Product);
    if (this.MeshData.VCHPRODUCTTYPE === 'PRC' || this.MeshData.VCHPRODUCTTYPE === 'CORE') {
      ////debugger;
      if (localStorage.getItem('ParentStructureMarkId') !== null) {
        this.ParentStructureMarkId = Number(localStorage.getItem('ParentStructureMarkId'));

      }
      if(this.MeshData.VCHPRODUCTTYPE === 'CORE')
      {
      this.StructureElementId=4;
      }
    }
    let prod_obj = this.pushElement.Product;

   let Mainwire = Number(this.pushElement.main);
   let Crosswire = Number(this.pushElement.cross) ;



   if(Mainwire<250 )
   {
    this.tosterService.warning("Main Wire should be greater than 250");
    return ;
   }
  //  else if( this.pushElement.shape==9 &&  Mainwire>7000)
  //  {

  //   this.tosterService.warning("Main Wire should be less than 7000");
  //   return ;
  //  }
  //  else if(this.pushElement.shape!=9 &&  Mainwire>6000)
  //  {

  //   this.tosterService.warning("Main Wire should be less than 6000");
  //   return ;
  //  }

  //  else if(Crosswire<600 )
  //  {
  //   this.tosterService.warning("Cross Wire should be greater than 600");
  //   return ;
  //  }
  //  else if(Crosswire>9000)
  //  {
  //   this.tosterService.warning("Cross Wire should be less than 9000");
  //   return ;
  //  }

    if (this.pushElement.main)

    if (this.validateNewRecord() == 1) {


      const SlabParamSet: ShapeCodeParameterSet = {
        TNTPARAMSETNUMBER: this.ParameterSetNo.ParameterSetNumber,
        INTPARAMETESET: this.ParameterSetNo.ParameterSetValue,
        VCHDESCRIPTION: "",
        TNTTRANSPORTMODEID: this.ParameterSetNo.TransportModeId,
        MaxMWLength: this.ParameterSetNo.MaxMWLength,
        MaxCWLength: this.ParameterSetNo.MaxCWLength,
        MACHINEMAXMWLENGTH: this.ParameterSetNo.MachineMaxMWLength,
        MACHINEMAXCWLENGTH: this.ParameterSetNo.MachineMaxCWLength,
        MINMWLENGTH: 0,//this.ParameterSetNo.MINMWLENGTH,// value is not there
        MINCWLENGTH: 0,//this.ParameterSetNo.MINCWLENGTH,// value is not there
        MINMO1: this.ParameterSetNo.MinMo1,
        MINMO2: this.ParameterSetNo.MinMo2,
        MINCO1: this.ParameterSetNo.MinCo1,
        MINCO2: this.ParameterSetNo.MinCo2,
        TransportMaxWeight: this.ParameterSetNo.TransportMaxWeight,
        TransportMaxHeight: this.ParameterSetNo.TransportMaxHeight,
        TransportMaxWidth: this.ParameterSetNo.TransportMaxWidth,
        TransportMaxLength: this.ParameterSetNo.TransportMaxLength
      }

      if (this.Slabproductcode_dropdown.length > 0) {
        this.selectedproductCode = this.Slabproductcode_dropdown.find((x: any) => x.ProductCodeId == this.pushElement.Product);
      }

      if (this.Slabshapecode_dropdown.length > 0) {

        this.selectedShapeCode = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.pushElement.shape)

      }
      if(this.selectedShapeCode.ShapeCodeName=='F')
      {
        this.selectedShapeCode.ShapeParam[0].ParameterValue = Number(this.pushElement.main);
        if (((Number(this.popup_MWLength) - Number(this.popup_MO1) - Number(this.popup_MO2)) % Number(this.selectedproductCode.CrossWireSpacing)) != 0) {
          //debugger;
          this.tosterService.warning("Please change MO1 or MO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
          return;
        }
        else if (((Number(this.popup_CWLength) - Number(this.popup_CO1) - Number(this.popup_CO2)) % Number(this.selectedproductCode.MainWireSpacing)) != 0) {
          //debugger;
          this.tosterService.warning("Please change CO1 or CO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
          return;
        }
      }

      console.log(SlabParamSet);
      this.selectedproductCode.SAPMaterialCode = ""

      const obj: ADD_SLAB_STRUCTURE_MARKING = {
        SEDetailingID: Number(this.DetailingID),
        StructureMarkId: 0,
        ParentStructureMarkId: this.ParentStructureMarkId,
        StructureMarkingName: this.pushElement.marking,
        ParamSetNumber: 0,
        MainWireLength: Number(this.pushElement.main),
        CrossWireLength: Number(this.pushElement.cross),
        BendingCheck: true,
        MachineCheck: false,
        TransportCheck: true,
        ProductCode: this.selectedproductCode,
        MultiMesh: false,
        ProduceIndicator: this.pushElement.prodind,
        PinSize: Number(this.pushElement.pinsize),
        ProductGenerationStatus: false,
        ParameterSet: SlabParamSet,
        SideForCode: '',
        ProductSplitUp: this.pushElement.split_up,
        MemberQty: Number(this.pushElement.qty),
        Shapecode: this.selectedShapeCode,
        MWLength: Number(this.popup_MWLength),
        CWLength: Number(this.popup_CWLength),
        MO1: Number(this.popup_MO1),
        MO2: Number(this.popup_MO2),
        CO1: Number(this.popup_CO1),
        CO2: Number(this.popup_CO2)

      }


      let structureID = Number(this.StructureElementId);
      console.log(obj);

      this.CarpetService.SaveSlab_StructureMarking(obj, this.StructureElementId, 1, this.ProjectId, this.ProductTypeID, 1).subscribe({
        next: (response) => {
          //debugger;
        },
        error: (e) => {
          //debugger;
          this.error=true;

          this.loadCarpetdata(this.DetailingID, this.StructureElementId);

          if (e.error === 'POSTED') {
            this.strIsReadOnly = 'YES';

            this.tosterService.error("The groupmarking is posted already.You cannot Add a Strucutre Marking.")
          }
          else if (e.error === 'DUPLICATE') {
            this.tosterService.error("The structure marking name already exist. Please refresh.")
          }
          else {
            let errorMessage = e.error.split(':')
            this.tosterService.error(errorMessage[0] + errorMessage[1] )
          }



        },
        complete: () => {

          this.tosterService.success("Slab Inserted Successfully.");

          this.loadCarpetdata(this.DetailingID, this.StructureElementId);
          this.error=false;
          this.strucuremarkingInput.nativeElement.focus();




        },
      });

    }
    else if (this.validateNewRecord() == 2) {
      this.tosterService.warning('Can not add blank record.')
    }
    else if (this.validateNewRecord() == 3) {
      this.tosterService.warning('Please enter Value of Shape Parameter.')
    }

  }

  validateNewRecord() {
    //debugger;
    if (this.pushElement.marking !== "" && this.pushElement.Product !== "" && this.pushElement.main !== ""
      && this.pushElement.cross !== "" && this.pushElement.qty !== "" && this.pushElement.shape !== "" && this.pushElement.pinsize !== "") {

      if (this.ShapeParamlist !== undefined) {

        let Index = this.ShapeParamlist.findIndex((x: any) => x.EditFlag === true && x.ParameterValue == '');
        if (Index !== -1) {
          if (this.ShapeParamlist[Index].ParameterValue == 0) {
            return 3;
          }
        }
      }
      else {
        return 3;
      }

      return 1;
    }
    else {
      return 2;
    }
  }

  Load_CarpetproductCodeDropdown(event: any) {
    // event = event;
    //debugger;
    this.CarpetService.PopulateProductCode_carpet().subscribe({
      next: (response) => {
        //debugger;
        this.Slabproductcode_dropdown = response;
        console.log("this.Slabproductcode_dropdown  ",this.Slabproductcode_dropdown)
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        if (this.Slabshapecode_dropdown.length > 0) {
          this.ShapeParamlist = null;
          //debugger;
          this.ShapeParamlist = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.lastElement.CarpetProduct[0].shapecode.ShapeID).ShapeParam;

          this.Imagename = "";
          this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
          this.loadMainFile(this.Imagename);

        }

      },
    });
  }
  Load_CarpetShapecodeCodeDropdown() {
    //event=event.value;
    //debugger;
    this.CarpetService.PopulateShapeCode_carpet().subscribe({
      next: (response) => {
        //debugger;

        this.Slabshapecode_dropdown = response;
        console.log("Slabe shape code ",this.Slabshapecode_dropdown);


      },
      error: (e) => {

      },
      complete: () => {

      },
    });
  }
  onEdit(main_ind: number, colp_ind: number, item: any,SlabStructure:any) {


    // //console.log("index", this.prev_index)
    // //console.log("backup", this.backup_update)
    // if (this.prev_index != null) {
    //   this.shapesurchargeList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_update));
    // }
this.Slab_Product = item;
this.Slab_Structure =SlabStructure;


    // this.prev_index = this.shapesurchargeList.findIndex(x => x.ID === item.ID);
    // this.backup_update = JSON.parse(JSON.stringify(item));
    // //console.log("after backup", this.backup_update);
    // this.isEditing = true;

    this.enableEditIndexCol = colp_ind;
    this.enableEditIndexmain = main_ind;
    console.log(item);

    this.objSlabShapeCode = item.shapecode
    let shapeParam = item.ParamValues;
    let shapeParam_arr = shapeParam.split(';');
    let count =0;
    shapeParam_arr.forEach((element: any) => {
      let paramValue = element.split(':')
      this.objSlabShapeCode.ShapeParam[count].ParameterValue =paramValue[1].toString();
      console.log(paramValue[1])
      count++;
    });
    //debugger;
    this.popup_MO1 = item.MO1
    this.popup_MO2 = item.MO2
    this.popup_CO1 = item.CO1
    this.popup_CO2 = item.CO2
    this.popup_CWLength = item.CWLength
    this.popup_MWLength  = item.MWLength;
this.ShapeParamlist = this.objSlabShapeCode.ShapeParam;
this.showImage=true;
this.Mode = 'E'

  }
  onSave(slabprod: any, structmark: any) {
    //debugger;
    this.expandRow = structmark.StructureMarkId;
    this.isupdateRecord = true;
    slabprod.MO1 = this.popup_MO1
    slabprod.MO2 = this.popup_MO2
    slabprod.CO1 = this.popup_CO1
    slabprod.CO2 = this.popup_CO2




   let Mainwire = Number(slabprod.MWLength);
   let Crosswire = Number(slabprod.CWLength) ;



   if(Mainwire<250 )
   {
    this.tosterService.warning("Main Wire should be greater than 250");
    return ;
   }
   else if( slabprod.shapecode.ShapeID==9 &&  Mainwire>7000)
   {

    this.tosterService.warning("Main Wire should be less than 7000");
    return ;
   }
   else if(slabprod.shapecode.ShapeID!=9 &&  Mainwire>6000)
   {

    this.tosterService.warning("Main Wire should be less than 6000");
    return ;
   }

   else if(Crosswire<600 )
   {
    this.tosterService.warning("Cross Wire should be greater than 600");
    return ;
   }
   else if(Crosswire>9000)
   {
    this.tosterService.warning("Cross Wire should be less than 9000");
    return ;
   }





    if (this.ValidateUpdateInput(slabprod) == 1) {




      const obj = {
        carpetprod: slabprod,
        structureMark: structmark,
        ParameterSet: this.ParameterSetNo,
      }

      this.CarpetService.Update_StructureMarking(obj, this.StructureElementId).subscribe({
        next: (response) => {
          this.expandRow = response.StructureMarkId;
          //debugger;
        },
        error: (e) => {
          if (e.error === 'POSTED') {
            this.strIsReadOnly = 'YES';

            this.tosterService.error("The groupmarking is posted already.You cannot Edit a Strucutre Marking.")
          }
          else if (e.error === 'DUPLICATE') {
            this.tosterService.error("The structure marking name already exist. Please refresh.")
          }
          else {
            this.tosterService.error(e.error);
          }
        },
        complete: () => {
          this.tosterService.success("Slab updated Successfully.");



          this.loadCarpetdata(this.DetailingID, this.StructureElementId);
                 },
      });
      this.Mode = 'S'
      this.enableEditIndexCol = -1;
      this.enableEditIndexmain = -1;
    }
    else if (this.ValidateUpdateInput(slabprod) == 3) {
      this.tosterService.warning('Please enter Value of Shape Parameter.')
    }
  }
  ValidateUpdateInput(itemRow: any) {
    ////debugger;
    //console.log(itemRow);
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
    // this.enableEditIndex = null;
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }
  async initialDataInsert() {
    //debugger;
    console.log(this.lastElement)

    if (this.carpetStructureMarklist.length > 0) {
      let copiedObject = this.lastElement.StructureMarkingName;
      let lstchar = this.lastElement.StructureMarkingName.slice(-1);
      copiedObject = copiedObject?.slice(0, -1);
      let tempChar: any;
      if (!this.isNumber(lstchar)) {
        tempChar = this.nextChar(lstchar.toUpperCase());
        tempChar = tempChar.toUpperCase();
      }
      else {
        tempChar = Number(lstchar) + 1;
      }
      copiedObject = copiedObject + tempChar;
      this.Load_CarpetproductCodeDropdown(this.lastElement.ProductCode.ProductCodeName);

      this.pushElement.marking = copiedObject//this.lastElement.StructureMarkingName;
      this.pushElement.main = this.lastElement.MainWireLength;
      this.pushElement.cross = this.lastElement.CrossWireLength;
      this.pushElement.qty = this.lastElement.MemberQty;;
      this.pushElement.Product = this.lastElement.ProductCode.ProductCodeId;

      this.pushElement.shape = this.lastElement.CarpetProduct[0].shapecode.ShapeID;
      this.popup_MWLength = this.lastElement.MainWireLength;
      this.popup_CWLength = this.lastElement.CrossWireLength;
      this.selectedproductCode = this.lastElement.ProductCode;
      this.selectedShapeCode = this.lastElement.CarpetProduct[0].shapecode;
      //debugger;

      this.Slabshapecode_dropdown = await this.Load_carpetShapecodeCodeDropdown_Wrapper();




      // this.popup_MO1=100;
      // this.popup_MO2=100;
      // this.popup_CO1=100;
      // this.popup_CO2=100;
      this.objSlabShapeCode =  this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.pushElement.shape)
      this.ShapeParamlist = this.objSlabShapeCode.ShapeParam;
      console.log("This is ShapeParamList",this.ShapeParamlist);




      let shapeParam = this.lastElement.CarpetProduct[0].ParamValues;
      let shapeParam_arr = shapeParam.split(';');
      let count =0;
      shapeParam_arr.forEach((element: any) => {
        let paramValue = element.split(':')
        this.ShapeParamlist[count].ParameterValue =Number(paramValue[1]);
        count++;
      });
      //debugger;
      this.popup_MO1 = this.lastElement.CarpetProduct[0].MO1
      this.popup_MO2 = this.lastElement.CarpetProduct[0].MO2
      this.popup_CO1 = this.lastElement.CarpetProduct[0].CO1
      this.popup_CO2 = this.lastElement.CarpetProduct[0].CO2
      // this.showImage = true;



      // if(this.ShapeParamlist[0].WireType==='C')
      // {
      //   console.log("This is ShapeParamList",this.ShapeParamlist);

      //   this.ShapeParamlist[0].ParameterValue= this.popup_CWLength
      // }
      // else{
      //   console.log("This is ShapeParamList",this.ShapeParamlist);

      //   this.ShapeParamlist[0].ParameterValue= this.popup_MWLength

      // }



    }
    else {

      this.pushElement.marking = "1";//this.lastElement.StructureMarkingName;
      this.pushElement.main = 2000;
      this.pushElement.cross = 2400;
      this.pushElement.qty = 1;
      this.pushElement.Product = 3813;
      if (this.Slabproductcode_dropdown.length > 0) {
        this.pushElement.Product = this.Slabproductcode_dropdown.find((x: any) => x.ProductCodeId == 3813).ProductCodeId;
        this.selectedproductCode = this.Slabproductcode_dropdown.find((x: any) => x.ProductCodeId == this.pushElement.Product);

      }
      this.pushElement.shape = 9;
      this.popup_MWLength = 2000;
      this.popup_CWLength = 2400;
      this.popup_MO1=100;
      this.popup_MO2=100;
      this.popup_CO1=100;
      this.popup_CO2=100;

//debugger;

this.Slabshapecode_dropdown = await this.Load_carpetShapecodeCodeDropdown_Wrapper();
      if (this.Slabshapecode_dropdown.length > 0) {
        this.ShapeParamlist = null;
        //debugger;
        this.ShapeParamlist = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.pushElement.shape).ShapeParam;

        console.log("This is ShapeParamList",this.ShapeParamlist);

        if (this.ShapeParamlist[0].ShapeCodeImage == 'F') {
          this.ShapeParamlist[0].ParameterValue = Number(this.pushElement.main);

        }
        this.Imagename = "";
        this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
        this.loadMainFile(this.Imagename);

      }


    }

    if(this.pushElement.shape===9)
    {
      this.ShowMOCO=true;
    }


  }
  LoadShapeParam() {
    //debugger;

    if (this.Slabshapecode_dropdown.length > 0) {
      // this.ShapeParamlist = null;
      //debugger;


      // this.selectedShapeCode = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.pushElement.shape)



      // this.ShapeParamlist = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.pushElement.shape).ShapeParam;

      if (this.ShapeParamlist[0].ShapeCodeImage == 'F') {
        this.ShapeParamlist[0].ParameterValue = Number(this.pushElement.main);

      }
      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      if (localStorage.getItem("carpet_top")) {
        this.top = parseInt(localStorage.getItem("carpet_top")!)
      }
      if (localStorage.getItem("carpet_right")) {
        this.right = parseInt(localStorage.getItem("carpet_right")!)
      }
      this.loadMainFile(this.Imagename);

    }
  }
  isNumber(char: any) {
    return /^\d+$/.test(char);
  }
  nextChar(c: any) {
    return String.fromCharCode(((c.charCodeAt(0) + 1 - 65) % 25) + 65);
  }
  Editcancel(item: any) {
    //console.log("this is collapsable ", item);
    this.enableEditIndexCol = -1;
    this.enableEditIndexmain = -1;
  }
  // SetShapeparam() {
  //   this.ShapeParamlist = this.pushElement.shape.ShapeParam;
  //   this.Imagename = this.ShapeParamlist[0].ShapeCodeImage + '.png'
  //   this.showImage = true;

  //   //console.log("Vidhya", this.ShapeParamlist);
  // }
  ChangeShapeCode(CarpetProduct :any,event: any, shapeList: any,Mode:any) {

    //debugger;

    this.Mode = Mode;



    if(event===9)
    {
      this.ShowMOCO=true;
    }
    else{
      this.ShowMOCO=false
    }
    this.objSlabShapeCode = shapeList.find((x: any) => x.ShapeID === event);
    // if(Mode=='E')
    // {
    //   this.ShapeCode_Edit=shapeList.find((x: any) => x.ShapeID === event);
    // }

    CarpetProduct.shapecode=this.objSlabShapeCode; //Adde by vanita



    if (shapeList.length > 0) {
      this.ShapeParamlist = shapeList.find((x: any) => x.ShapeID === event).ShapeParam;


      if(this.ShapeParamlist[0].WireType==='C')
      {

        this.ShapeParamlist[0].ParameterValue= this.popup_CWLength
      }
      else{

        this.ShapeParamlist[0].ParameterValue= this.popup_MWLength

      }
      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      this.loadMainFile(this.Imagename);
    }
    if (localStorage.getItem("carpet_top")) {
      this.top = parseInt(localStorage.getItem("carpet_top")!)
    }
    if (localStorage.getItem("carpet_right")) {
      this.right = parseInt(localStorage.getItem("carpet_right")!)
    }

    this.shapeSelected = true;
    this.showImage = true;
    console.log("this.initialX",this.initialX,"this.initialY",this.initialY)




    if (CarpetProduct.shapecode.ShapeParam[0].OHIndicator ==  true) {
      //debugger;
      this.OHAdjustmentForShapeCode(CarpetProduct,this.objSlabShapeCode)
    }else{

// this.GetOverHang()
    this.popup_MO1=100;
    this.popup_MO2=100;
    this.popup_CO1=100;
    this.popup_CO2=100;

    }

    //End: Vanita
    const inputElement = this.el.nativeElement.querySelector('#Shapeparam');
    if(inputElement)
    {
      inputElement.focus();
      // this.Shapeparam.nativeElement.focus();

    }


  }



  OHAdjustmentForShapeCode(slabProduct:any,objSlabShapeCode: any) {
    //debugger;
    let ExtraOHMW = 0;
    let OHAdjustmentMW = 0;
    //debugger;
    if ((slabProduct.MWLength - slabProduct.shapecode.ShapeParam[0].EvenMo1 - slabProduct.shapecode.ShapeParam[0].EvenMo2) % slabProduct.CWSpacing > 0)
    {
        ExtraOHMW = Number.parseFloat((slabProduct.MWLength - slabProduct.shapecode.ShapeParam[0].OddMo1 - slabProduct.shapecode.ShapeParam[0].OddMo2).toString()) / Number.parseFloat(slabProduct.CWSpacing);
        let fractionMW = ExtraOHMW - Math.floor(ExtraOHMW);
        if (fractionMW > 0)
        {
            OHAdjustmentMW = Number(Math.round(fractionMW * slabProduct.CWSpacing));
            if (slabProduct.shapecode.ShapeParam[0].OddMo1 > slabProduct.shapecode.ShapeParam[0].OddMo2)
            {
                this.popup_MO1 = slabProduct.shapecode.ShapeParam[0].OddMo1;
                this.popup_MO2 = (slabProduct.shapecode.ShapeParam[0].OddMo2 + OHAdjustmentMW);
            }
            else if (slabProduct.shapecode.ShapeParam[0].OddMo1 < slabProduct.shapecode.ShapeParam[0].OddMo2)
            {
                this.popup_MO1 = (slabProduct.shapecode.ShapeParam[0].OddMo1 + OHAdjustmentMW);
                this.popup_MO2 = (slabProduct.shapecode.ShapeParam[0].OddMo2);
            }
            else if (slabProduct.shapecode.ShapeParam[0].OddMo1 == slabProduct.shapecode.ShapeParam[0].OddMo2)
            {
                let ohvalueMW = OHAdjustmentMW / 2;
                if (OHAdjustmentMW % 2 > 0)
                {
                    this.popup_MO1 = (slabProduct.shapecode.ShapeParam[0].OddMo1 + ohvalueMW + 1);
                    this.popup_MO2 = (slabProduct.shapecode.ShapeParam[0].OddMo2 + ohvalueMW);
                }
                else
                {
                    this.popup_MO1 = (slabProduct.shapecode.ShapeParam[0].OddMo1 + ohvalueMW);
                    this.popup_MO2 = (slabProduct.shapecode.ShapeParam[0].OddMo2 + ohvalueMW);
                }
            }
        }
        else
        {
          //debugger;
            this.popup_MO1 = slabProduct.shapecode.ShapeParam[0].OddMo1;
            this.popup_MO2 = slabProduct.shapecode.ShapeParam[0].OddMo2;
        }
    }
    else
    {
        this.popup_MO1 = slabProduct.shapecode.ShapeParam[0].EvenMo1;
        this.popup_MO2 = slabProduct.shapecode.ShapeParam[0].EvenMo2;
    }
    if ((slabProduct.CWLength - slabProduct.shapecode.ShapeParam[0].EvenCo1 - slabProduct.shapecode.ShapeParam[0].EvenCo2) % slabProduct.MWSpacing > 0)
    {
      //debugger;
        let ExtraOHCW = 0;
        let OHAdjustmentCW = 0;
        if ((slabProduct.CWLength - slabProduct.shapecode.ShapeParam[0].EvenCo1 - slabProduct.shapecode.ShapeParam[0].EvenCo2) % slabProduct.MWSpacing > 0)
        {
            ExtraOHCW = Number.parseFloat((slabProduct.CWLength - slabProduct.shapecode.ShapeParam[0].OddCo1 - slabProduct.shapecode.ShapeParam[0].OddCo2).toString()) / Number.parseFloat(slabProduct.CWSpacing);
            let fractionCW = ExtraOHCW - Math.floor(ExtraOHCW);
            if (fractionCW > 0)
            {
                OHAdjustmentCW = Number(Math.round(fractionCW * slabProduct.MWSpacing));
                if (slabProduct.shapecode.ShapeParam[0].OddCo1 > slabProduct.shapecode.ShapeParam[0].OddCo2)
                {
                    this.popup_CO1 = slabProduct.shapecode.ShapeParam[0].OddCo1;
                    this.popup_CO2 = (slabProduct.shapecode.ShapeParam[0].OddCo2 + OHAdjustmentCW);
                }
                else if (slabProduct.shapecode.ShapeParam[0].OddCo1 < slabProduct.shapecode.ShapeParam[0].OddCo2)
                {
                    this.popup_CO1 = (slabProduct.shapecode.ShapeParam[0].OddCo1 + OHAdjustmentCW);
                    this.popup_CO2 = (slabProduct.shapecode.ShapeParam[0].OddCo2);
                }
                else if (slabProduct.shapecode.ShapeParam[0].OddCo1 == slabProduct.shapecode.ShapeParam[0].OddCo2)
                {
                    let ohvalueCW = OHAdjustmentCW / 2;
                    if (OHAdjustmentCW % 2 > 0)
                    {
                        this.popup_CO1 = (slabProduct.shapecode.ShapeParam[0].OddCo1 + ohvalueCW + 1);
                        this.popup_CO2 = (slabProduct.shapecode.ShapeParam[0].OddCo2 + ohvalueCW);
                    }
                    else
                    {
                        this.popup_CO1 = (slabProduct.shapecode.ShapeParam[0].OddCo1 + ohvalueCW);
                        this.popup_CO2 = (slabProduct.shapecode.ShapeParam[0].OddCo2 + ohvalueCW);
                    }
                }
            }
            else
            {
              //debugger;
                this.popup_CO1 = slabProduct.shapecode.ShapeParam[0].OddCo1;
                this.popup_CO2 = slabProduct.shapecode.ShapeParam[0].OddCo2;
            }
        }
    }
    else
    {
      //debugger;
        this.popup_CO1 = slabProduct.shapecode.ShapeParam[0].EvenCo1;
        this.popup_CO2 = slabProduct.shapecode.ShapeParam[0].EvenCo2;
    }
    // if ((Number(slabProduct.MWLength) - slabProduct.shapecode.ShapeParam[0].EvenMo1 - objSlabShapeCode.ShapeParam[0].EvenMo2) % Number(this.selectedproductCode.CrossWireSpacing) > 0) {
    //   ExtraOHMW = Number((Number(this.popup_MWLength) - objSlabShapeCode.ShapeParam[0].OddMo1 - objSlabShapeCode.ShapeParam[0].OddMo2)) / Number.parseFloat(this.selectedproductCode.CrossWireSpacing);
    //   //debugger;
    //   let fractionMW = ExtraOHMW - Math.floor(ExtraOHMW);
    //   if (fractionMW > 0) {
    //     OHAdjustmentMW = Number(Math.round(fractionMW * this.selectedproductCode.CrossWireSpacing));
    //     if (objSlabShapeCode.ShapeParam[0].OddMo1 > objSlabShapeCode.ShapeParam[0].OddMo2) {
    //       this.popup_MO1 = objSlabShapeCode.ShapeParam[0].OddMo1;
    //       this.popup_MO2 = (objSlabShapeCode.ShapeParam[0].OddMo2 + OHAdjustmentMW);
    //     }
    //     else if (objSlabShapeCode.ShapeParam[0].OddMo1 < objSlabShapeCode.ShapeParam[0].OddMo2) {
    //       this.popup_MO1 = (objSlabShapeCode.ShapeParam[0].OddMo1 + OHAdjustmentMW);
    //       this.popup_MO2 = (objSlabShapeCode.ShapeParam[0].OddMo2);
    //     }
    //     else if (objSlabShapeCode.ShapeParam[0].OddMo1 == objSlabShapeCode.ShapeParam[0].OddMo2) {
    //       let ohvalueMW = OHAdjustmentMW / 2;
    //       if (OHAdjustmentMW % 2 > 0) {
    //         this.popup_MO1 = (objSlabShapeCode.ShapeParam[0].OddMo1 + ohvalueMW + 1);
    //         this.popup_MO2 = (objSlabShapeCode.ShapeParam[0].OddMo2 + ohvalueMW);
    //       }
    //       else {
    //         this.popup_MO1 = (objSlabShapeCode.ShapeParam[0].OddMo1 + ohvalueMW);
    //         this.popup_MO2 = (objSlabShapeCode.ShapeParam[0].OddMo2 + ohvalueMW);
    //       }
    //     }
    //   }
    //   else {
    //     this.popup_MO1 = objSlabShapeCode.ShapeParam[0].OddMo1;
    //     this.popup_MO2 = objSlabShapeCode.ShapeParam[0].OddMo2;
    //   }
    // }
    // else {
    //   this.popup_MO1 = objSlabShapeCode.ShapeParam[0].EvenMo1;
    //   this.popup_MO2 = objSlabShapeCode.ShapeParam[0].EvenMo2;
    // }
    // if ((Number(this.popup_CWLength) - objSlabShapeCode.ShapeParam[0].EvenCo1 - objSlabShapeCode.ShapeParam[0].EvenCo2) % Number(this.selectedproductCode.MainWireSpacing) > 0) {
    //   let ExtraOHCW = 0;
    //   let OHAdjustmentCW = 0;
    //   if ((Number(this.popup_CWLength) - objSlabShapeCode.ShapeParam[0].EvenCo1 - objSlabShapeCode.ShapeParam[0].EvenCo2) % Number(this.selectedproductCode.MainWireSpacing) > 0) {
    //     ExtraOHCW = Number((Number(this.popup_CWLength) - objSlabShapeCode.ShapeParam[0].OddCo1 - objSlabShapeCode.ShapeParam[0].OddCo2)) / Number.parseFloat(this.selectedproductCode.CrossWireSpacing);
    //     //debugger;
    //     let fractionCW = ExtraOHCW - Math.floor(ExtraOHCW);
    //     if (fractionCW > 0) {
    //       OHAdjustmentCW = Number(Math.round(fractionCW * this.selectedproductCode.MainWireSpacing));
    //       if (objSlabShapeCode.ShapeParam[0].OddCo1 > objSlabShapeCode.ShapeParam[0].OddCo2) {
    //         this.popup_CO1 = objSlabShapeCode.ShapeParam[0].OddCo1;
    //         this.popup_CO2 = (objSlabShapeCode.ShapeParam[0].OddCo2 + OHAdjustmentCW);
    //       }
    //       else if (objSlabShapeCode.ShapeParam[0].OddCo1 < objSlabShapeCode.ShapeParam[0].OddCo2) {
    //         this.popup_CO1 = (objSlabShapeCode.ShapeParam[0].OddCo1 + OHAdjustmentCW);
    //         this.popup_CO2 = (objSlabShapeCode.ShapeParam[0].OddCo2);
    //       }
    //       else if (objSlabShapeCode.ShapeParam[0].OddCo1 == objSlabShapeCode.ShapeParam[0].OddCo2) {
    //         let ohvalueCW = OHAdjustmentCW / 2;
    //         if (OHAdjustmentCW % 2 > 0) {
    //           this.popup_CO1 = (objSlabShapeCode.ShapeParam[0].OddCo1 + ohvalueCW + 1);
    //           this.popup_CO2 = (objSlabShapeCode.ShapeParam[0].OddCo2 + ohvalueCW);
    //         }
    //         else {
    //           this.popup_CO1 = (objSlabShapeCode.ShapeParam[0].OddCo1 + ohvalueCW);
    //           this.popup_CO2 = (objSlabShapeCode.ShapeParam[0].OddCo2 + ohvalueCW);
    //         }
    //       }
    //     }
    //     else {
    //       this.popup_CO1 = objSlabShapeCode.ShapeParam[0].OddCo1;
    //       this.popup_CO2 = objSlabShapeCode.ShapeParam[0].OddCo2;
    //     }
    //   }
    // }
    // else {
    //   this.popup_CO1 = objSlabShapeCode.ShapeParam[0].EvenCo1;
    //   this.popup_CO2 = objSlabShapeCode.ShapeParam[0].EvenCo2;
    // }



  }

  loadMainFile(Imagename: any) {
    ////debugger;
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
  //   //debugger;
  //   this.ShapeParamlist = this.Slabshapecode_dropdown.find(x => x.ShapeID === shapeId).ShapeParam;

  //   this.Imagename = this.ShapeParamlist[0].ShapeCodeImage + '.png';

  //   this.showImage = true;

  // }

  LoadCarpetParameterSet(projectID: any) {
    //
    let productTypeID = 7
    this.CarpetService.CarpetParameterSetbyProjIdProdType(projectID, productTypeID).subscribe({
      next: (response) => {

        this.ParameterSetList = response;
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        //this.loading = false;
        this.ParameterSetNo = this.ParameterSetList.find((x: any) => x.ParameterSetValue === this.MeshData.INTPARAMETESET);
        this.selected_ParameterSet = this.ParameterSetList.find((x: any) => x.INTPARAMETESET === this.ParameterSetNo.INTPARAMETESET);

        //console.log("select parameter set ", this.selected_ParameterSet);
        // if (this.selected_ParameterSet !== undefined && this.selected_ParameterSet.length > 0) {
        //   this.intTopCover = this.selected_ParameterSet.TopCover;
        //   this.intBottomCover = this.selected_ParameterSet.BottomCover;
        //   this.intLeftCover = this.selected_ParameterSet.LeftCover;
        //   this.intRightCover = this.selected_ParameterSet.RightCover;
        //   this.intLeg = this.selected_ParameterSet.Leg;

        // }

      },
    });
  }
  deleteSlabStructure(id: any) {
    this.loading = true;
    this.CarpetService.Delete_StructureMarking(id).subscribe({
      next: (response) => {
        this.loadCarpetdata(this.DetailingID, this.StructureElementId);
        this.initialDataInsert();
      },
      error: (e) => {
        //console.log("error", e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.tosterService.success("Slab Structure Deleted Successfully.");

      },
    });
  }
  SendParameters(item: any) {
    //debugger;
    item.StructureElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE;
    let BomData: BomData = {
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
    // this.openInNewTab()
this.router.navigate(['/detailing/DetailingGroupMark/BOM']);
  }
  MainWire_lostfocus(MWLength: any) {
    this.popup_MWLength = MWLength

  }
  CrossWire_lostfocus(CWLength: any) {
    this.popup_CWLength = CWLength;
  }
  saveButton_Click() {
//debugger;
// if(this.Mode=='E')
// {
//   this.showImage=false;
//   this.onSave(this.Slab_Product,this.Slab_Structure)
//   return ;
// }


    this.mainWireTotal = 0;
    this.crossWireTotal = 0;
    this.noOfMainWire = 0;
    this.noOfCrossWire = 0;
    this.editShapeParam = true;

    this.noOfMainWire = Number(this.popup_MWLength) / Number(this.selectedproductCode.CrossWireSpacing);
    this.noOfCrossWire = Number(this.popup_CWLength) / Number(this.selectedproductCode.MainWireSpacing);

    if (this.editShapeParam == true) {
      if (this.popup_MWLength == null || this.popup_MWLength == undefined ) {
        this.tosterService.error("Please enter the mw length.");
        //  MessageBox.Show("Please enter the mw length.", "NDS", MessageBoxButton.OK);
        return;
      }
      if (this.popup_CWLength == null || this.popup_CWLength == undefined) {
        this.tosterService.error("Please enter the cw length.");
        return;
      }
      if (this.popup_MO1 == null || this.popup_MO1 == undefined) {
        this.tosterService.error("Please enter the MO1.");
        return;
      }
      if (this.popup_MO2 == null || this.popup_MO2 == undefined) {
        this.tosterService.error("Please enter the MO2.");
        return;
      }
      if (this.popup_CO1 == null || this.popup_CO1 == undefined) {
        this.tosterService.error("Please enter the CO1.");
        return;
      }
      if (this.popup_CO2 == null || this.popup_CO2 == undefined) {
        this.tosterService.error("Please enter the CO2.");
        return;
      }
      if(this.Mode=='S')
      {
        this.objSlabShapeCode = this.Slabshapecode_dropdown.find((x: any) => x.ShapeID === this.pushElement.shape);
      }

      console.log(this.objSlabShapeCode.ShapeParam)

      //debugger;
      for (let param of this.objSlabShapeCode.ShapeParam) {
        console.log(param);
        if (param.WireType == "M" && param.AngleType == "S") {
          this.mainWireTotal = this.mainWireTotal + Number(param.ParameterValue);
        }
      }

      for (let param of this.objSlabShapeCode.ShapeParam) {
        if (param.WireType == "C" && param.AngleType == "S") {
          this.crossWireTotal = this.crossWireTotal + Number(param.ParameterValue);
        }
      }
      if (this.mainWireTotal != 0) {

        if (this.mainWireTotal != Number(this.popup_MWLength)) {
          const message = `Sum of parameter values not equal to MainWire length. Do you want to continue?`;

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
            } else {
              if(this.Mode=='S')
              {
                this.onSubmit()
              }
              else if(this.Mode=='E'){
                      this.onSave(this.Slab_Product,this.Slab_Structure)
              }
              this.showImage = !this.showImage;
              this.input2.nativeElement.focus();
            }

          });


        }
        else
        {
          if (((Number(this.popup_MWLength) - Number(this.popup_MO1) - Number(this.popup_MO2)) % Number(this.selectedproductCode.CrossWireSpacing)) != 0) {
            //debugger;
            this.tosterService.warning("Please change MO1 or MO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
            return;
          }
          else if (((Number(this.popup_CWLength) - Number(this.popup_CO1) - Number(this.popup_CO2)) % Number(this.selectedproductCode.MainWireSpacing)) != 0) {
            //debugger;
            this.tosterService.warning("Please change CO1 or CO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
            return;
          }
          else{
          if(this.Mode=='S')
          {
            this.onSubmit()
          }
          else if(this.Mode=='E'){
                  this.onSave(this.Slab_Product,this.Slab_Structure)
          }
        }
        }
      }
      else if (this.crossWireTotal != 0) {
        if (this.crossWireTotal != Number(this.popup_CWLength)) {
          const message = `Sum of parameter values not equal to CrossWire length. Do you want to continue?`;
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

              if(this.Mode=='S')
              {
                this.onSubmit()
              }
              else if(this.Mode=='E'){
                      this.onSave(this.Slab_Product,this.Slab_Structure)
              }
              this.showImage = !this.showImage;
              this.input2.nativeElement.focus();
            }
          });


        }
        else {

          if (((Number(this.popup_MWLength) - Number(this.popup_MO1) - Number(this.popup_MO2)) % Number(this.selectedproductCode.CrossWireSpacing)) != 0) {
            //debugger;
            this.tosterService.warning("Please change MO1 or MO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
            return;
          }
          else if (((Number(this.popup_CWLength) - Number(this.popup_CO1) - Number(this.popup_CO2)) % Number(this.selectedproductCode.MainWireSpacing)) != 0) {
            //debugger;
            this.tosterService.warning("Please change CO1 or CO2 to proceed further. Spacing = " + this.selectedproductCode.CrossWireSpacing);
            return;
          }
          else{
          if(this.Mode=='S')
          {
            this.onSubmit()
          }
          else if(this.Mode=='E'){
                  this.onSave(this.Slab_Product,this.Slab_Structure)
          }
        }
        }

      }
      console.log(this.selectedproductCode);


      console.log(this.selectedproductCode);


    }
    this.input2.nativeElement.focus();
    this.showImage = false;




  }


  Report_Click() {

    //debugger;
    if(this.ProductTypeID==7)
    {
    this.strQueryString = environment.ReportUrl;
    this.strQueryString = this.strQueryString + "intGroupMarkingId=" + this.IntGroupMarkId + "&sitProductTypeId="+this.ProductTypeID+"&bitSummaryReport=" + 0 + "&rc:Parameters=false ";
    }
    else if((this.ProductTypeID==15 || this.ProductTypeID==14) && this.StructureElementId==4)
    {
      //corecage
      let corecagereport="http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fGroupMarkingReport_ODOS&rs:Command=Render&";
      // this.strQueryString = environment.ReportUrl;
      this.strQueryString = corecagereport + "intGroupMarkingId=" + this.IntGroupMarkId + "&sitProductTypeId="+this.ProductTypeID+"&bitSummaryReport=" + 0 + "&rc:Parameters=false ";

    }
    else if((this.ProductTypeID==15 || this.ProductTypeID==14) && this.StructureElementId==2)
    {
      let corecagereport="http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fGroupMarkingReport_CoreCage&rs:Command=Render&";
      // this.strQueryString = environment.ReportUrl;
      this.strQueryString = corecagereport + "intGroupMarkingId=" + this.IntGroupMarkId + "&sitProductTypeId="+this.ProductTypeID+"&bitSummaryReport=" + 0 + "&rc:Parameters=false ";

    }
    else if(this.ProductTypeID==4)
    {
      //cab
      let cabgroupmarkingreport="http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fCABGroupMarkingReport&rs:Command=Render&";
      this.strQueryString = cabgroupmarkingreport + "intGroupMarkingId=" + this.IntGroupMarkId + "&sitProductTypeId="+this.ProductTypeID;

    }

    console.log(this.strQueryString);
    window.open(this.strQueryString, "_blank");


  }
  NewGM_Click() {
    //debugger;

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,      // centered: true,
      size: 'lg',

    }
    const modalRef = this.modalService.open(GroupMarkComponent, ngbModalOptions);
    modalRef.componentInstance.ProjectID = this.ProjectId;
    modalRef.componentInstance.CustomerID = this.MeshData.CustomerId;
    modalRef.componentInstance.ProjectName = this.MeshData.ProjectName;  //(this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).Description;
    modalRef.componentInstance.CustomerName = this.MeshData.CustomerName
    modalRef.componentInstance.productType = this.MeshData.SITPRODUCTTYPEID;
    modalRef.componentInstance.structElement = this.MeshData.INTSTRUCTUREELEMENTTYPEID;
    modalRef.componentInstance.tntParameterSetNumber = this.MeshData.TNTPARAMSETNUMBER;

    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      console.log("van");
      //debugger;
      let temp = localStorage.getItem('MeshData');
      let tempItem = JSON.parse(temp!.toString());

      console.log("temp", tempItem)


      // this.seDetailingID = this.MeshData.INTSEDETAILINGID
      // this.structElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE
      // localStorage.setItem('MeshData', JSON.stringify(this.transferObject));
      this.reloadService.reloadComponent.emit('');
      //this.router.navigate(['../DetailingGroupMark']);


    });





  }
  deleteCarpetProduct(ProductMarkList: any, ProductMarkId: any) {
    //debugger;

    // if (this.mainWireTotal != Number(this.popup_MWLength)) {
    //   const message = `Sum of parameter values not equal to MainWire length. Do you want to continue?`;

    //   const dialogData = new ConfirmDialogModel("Confirm Action", message);

    //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //     maxWidth: "400px",
    //     data: dialogData
    //   });

    //   dialogRef.afterClosed().subscribe(dialogResult => {
    //     this.result = dialogResult;
    //     console.log(this.result);
    //     if (!this.result) {
    //       return;
    //     }

    //   });


    // }


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
          this.loading = true;
          this.detailingService.Delete_SlabProductMarking(ProductMarkId, this.DetailingID).subscribe({
            next: (response) => {
              this.tosterService.success("Product Marking and Structure Mark deleted Successfully");
            },
            error: (e) => {
              this.loading = false;
              console.log("error", e);
            },
            complete: () => {
              this.loading = false;
              this.loadCarpetdata(this.DetailingID, this.StructureElementId);

            },
          });
        }
      });


    } else {

      const message = `Are you sure you want to delete the record.?`;
      const dialogData = new ConfirmDialogModel("Confirm Action", message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
      // const message = `Are you sure you want to delete the record.`;
      // const dialogData = new ConfirmDialogModel("Confirm Action", message);
      // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      //   maxWidth: "400px",
      //   data: dialogData
      // });

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        console.log(this.result);
        if (!this.result) {
          return;
        }
        else {
          this.loading = true;
          this.detailingService.Delete_SlabProductMarking(ProductMarkId, this.DetailingID).subscribe({
            next: (response) => {
              this.tosterService.success("Product Marking deleted Successfully");
            },
            error: (e) => {
              this.loading = false;
              console.log("error", e);
            },
            complete: () => {
              this.loading = false;
              this.loadCarpetdata(this.DetailingID, this.StructureElementId);

            },
          });
        }
      });

    }


  }

  shapeParameterGrid_KeyDown(ShapeParamlist: any, item: any, index: any) {
    //debugger;
    this.i = 0;
    this.j = 1;
    this.mainWireTotal = 0;
    this.crossWireTotal = 0;
    let lastIndex = 0;
    let rowIndex = index;

    if (rowIndex == (ShapeParamlist.length - 1))
    {

      this.MO1text.nativeElement.focus();




    }


      //debugger;
      for (let i=0;i<=rowIndex;i++) {
        if (ShapeParamlist[i].WireType == "M" && ShapeParamlist[i].AngleType == "S") {
      this.mainWireTotal = this.mainWireTotal + (ShapeParamlist[i].ParameterValue
            != "" ? Number(ShapeParamlist[i].ParameterValue) : 0);

        }
        if (ShapeParamlist[i].WireType == "C" && ShapeParamlist[i].AngleType == "S") {
         this.crossWireTotal = this.crossWireTotal + (ShapeParamlist[i].ParameterValue != "" ? Number(ShapeParamlist[i].ParameterValue) : 0);
        }

      }
      if (ShapeParamlist[rowIndex].WireType == "M" && ShapeParamlist[rowIndex].AngleType == "S") {

        if(ShapeParamlist[rowIndex+1].WireType=="C")
        {
          ShapeParamlist[rowIndex+1].ParameterValue =  Number(this.popup_CWLength);

        }
        else{
        ShapeParamlist[rowIndex+1].ParameterValue = Number(this.popup_MWLength)-this.mainWireTotal;
        if(ShapeParamlist[rowIndex+1].ParameterValue<0)
        {
          ShapeParamlist[rowIndex+1].ParameterValue=0;
          ShapeParamlist[rowIndex].ParameterValue=Number(this.popup_MWLength);
        }
      }

       }
       if (ShapeParamlist[rowIndex].WireType == "C" && ShapeParamlist[rowIndex].AngleType == "S") {

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
  async  Load_carpetShapecodeCodeDropdown_Wrapper():Promise<any>
  {
    try {
      var a  = await  this.CarpetService.PopulateShapeCode_carpet().toPromise();
      return a;
    } catch (error) {
      return error;
    }
  }
  giveRowcolor(item: any) {
    var color;
    //debugger

    console.log("ascbakcbaiscbaiskbaskb",item)
    if (item.ProductValidator== 0) {
      color='#FFFFFF';
    }
    else{
      color = '#ff0000'
    }
    // else if (item.TNTSTATUSID == 11) {
    //   color = '#8debfb';
    // }
    // else if (item.TNTSTATUSID == 3) {
    //   // color = '#ADEDAD';
    //   color = '#fffd88';
    //   // color = ' #8FBAAD'
    // }
    // else if (item.TNTSTATUSID == 12) {
    //   // color = '#00A589'
    //   color = '#ADEDAD';
    //   // color = '#F5C4CD';
    // }
    return color
  }
updateStructureMarking(event: any,item:any)
{

 item.StructureMarkingName = event.target.textContent.trim();

  this.detailingService.updateStructureMarking(item.StructureMarkingName,item.StructureMarkId).subscribe({
    next: (response) => {

    },
    error: (e) => {
       console.log(e);
       let errorMessage = e.error;
      this.tosterService.error(errorMessage)

    },
    complete: () => {
      this.tosterService.success("Marking has been updated.");
    },
  });

}

// openInNewTab() {

//   const url = ['#/detailing/BOM'];

//   // Create a temporary anchor element
//   const anchor = document.createElement('a');
//   anchor.href = this.router.serializeUrl(this.router.createUrlTree(url));
//   anchor.target = '_blank';

//   // Append the anchor to the body and trigger a click
//   document.body.appendChild(anchor);
//   anchor.click();

//   // Remove the anchor from the body
//   document.body.removeChild(anchor);
// }
// GetParameterSet(intProjectId:any,ProducttypeId:any)
// {

//   this.CarpetService.CarpetParameterSetbyProjIdProdType(intProjectId,ProducttypeId).subscribe({
//     next: (response) => {
//         this.ParameterSetList
//     },
//     error: (e) => {
//        console.log(e);
//        let errorMessage = e.error;
//       this.tosterService.error(errorMessage)

//     },
//     complete: () => {

//     },
//   });

// }
onMouseDown(event: MouseEvent): void {
  this.isDragging = true;
  this.initialX = event.clientX + this.right;
  this.initialY = event.clientY - this.top;
  this.renderer.addClass(this.el.nativeElement, 'grabbing');
  localStorage.setItem("carpet_top",this.top.toString());
  localStorage.setItem("carpet_right",this.right.toString());

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
goBack()
{
  this.router.navigate(['/detailing/MeshDetailing']);

}
}
