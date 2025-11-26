import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, Renderer2,ViewChildren,AfterViewInit,QueryList, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BeamStructure } from 'src/app/Model/add_BeamStructure';
import { C_ProductCode } from 'src/app/Model/add_C_ProductCode';
import { environment } from 'src/environments/environment';
import { BeamDetailingService } from '../../MeshDetailing/BeamDetailingService';
import { RegenerateDialogComponent } from '../../RegenarationDialog/Regenerate-dialog.component';
import { BomData } from 'src/app/Model/BomData';
import { GroupMarkComponent } from '../../MeshDetailing/addgroupmark/addgroupmark.component';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { e } from 'mathjs';


@Component({
  selector: 'app-beam',
  templateUrl: './beam.component.html',
  styleUrls: ['./beam.component.css']
})
export class BeamComponent implements OnInit {

  
  @ViewChildren('focasable', { read: ElementRef }) inputs!: QueryList<ElementRef>;

  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;

  DetailingGroupMarkForm!: FormGroup;

  isEdit = false
  enableBeamEditIndex = null;

  selectparameter2: any;
  shapeSelected = false;

  
  @ViewChild('strucuremarkingInput')
  strucuremarkingInput!: ElementRef;

  selectparameter: any;

  groupmarkingBeamlist: any[] = [];

  shapeParameter: any = [];

  isExpand = false;

  //Added by vanita
  showImage = false
  loading: boolean = true;

  enableCapping:boolean=true;

  storedObjectData: any
  ParameterSetData: any = null;
  MeshData: any
  ParameterSetList: any[] = [];

  DetailingID: any;
  StructureElementId: any;
  ProjectId: any;
  @Input() BeamParameterSetNo: any;
  GroupMarkName: string | undefined;
  groupMarkID: any;
  beamImageList: any[] = [];

  BeamProductCodeList: any[] = [];
  BeamCabProductCode: any[] = [];
  shapeList: any[] = [];
  isaddnewRecord: boolean = false;
  isupdateRecord: boolean = false;

  intGap1: number = 0;
  intGap2: number = 0;
  intHook: number = 0;
  intTopCover: number = 0;
  intBottomCover: number = 0;
  intLeftCover: number = 0;
  intRightCover: number = 0;
  intLeg: number = 0;

  objBeamShapeCode: any;
  ShapeParamlist: any[] = [];
  Imagename: any

  selectedproductCode: C_ProductCode | undefined;
  selectedShape: any;
  selectedCapProduct: any[] = [];

  backup_BeamStructurelist: any[] = [];

  pageSize = 0;
  maxSize: number = 10;
  currentPage = 1;
  itemsPerPage: number = 10;
  enableEditIndex = null;
  prev_index: any = null;
  selected_ParameterSet: any;
  Changed_ParameterSet: any;
  strIsReadOnly: any = "NO";
  lastElementBeam: any;
  isTooltipHidden = false;
  ProductValidatorDescription: string = "";
  strQueryString: string | undefined;
  IntGroupMarkId: number | undefined;
  @Input() ParentStructureMarkId: number = 0;
  @ViewChild('input4')
  input4!: ElementRef;
  //Added by Vanita
  beam_StructureMark:any;

  pushElement: any = {
    isExpand: false,
    'StructureMarkName': '',
    'Width': '',
    'Depth': '',
    'Slope': '',
    'Stirupps': '',
    'ProductCodeName': '',
    'ShapeCodeName': '',
    'Qty': 0,
    'Span': 0,
    'IsCap': true,
    'CapProduct': '',
    'ProduceInd': false,
    'PinSize': '',

  };
  Queryparameterset: any;
  elementDetails: any;
  intRecordCount: number = 0;
  expandRow:any=0;
  exclude_Shapelist = ['C','CR','K','KR','4M1B','4MR1B','5M1B','5MR1B']

  constructor(public router: Router, public httpClient: HttpClient, private modalService: NgbModal, public beamDetailingService: BeamDetailingService, private tosterService: ToastrService, private reloadService: ReloadService,
    private el: ElementRef,
    private renderer: Renderer2,) {

      this.constructor_Data();



  }


  showDetails(item: any) {
    this.isExpand = true

  }
  ProductTypeID: any;
  ngOnInit() {
    //debugger;
    this.reloadService.ReloadDetailingGM$.subscribe((data) => {
      this.loadInitialData();
      this.constructor_Data();
    });
    this.loadInitialData();


  }
  loadInitialData()
  {
    this.loading = true;
    //console.log(localStorage.getItem('PostedGM'));
    this.intRecordCount = Number(localStorage.getItem('PostedGM'));
    //console.log(this.intRecordCount);
    if (this.intRecordCount > 0) {
      this.strIsReadOnly = 'YES'
    }
    this.storedObjectData = localStorage.getItem('MeshData');
    this.ParameterSetData = localStorage.getItem('ParameterSetData');
    this.MeshData = JSON.parse(this.storedObjectData);
    console.log("Testing ",this.ParameterSetData)
    this.DetailingID = this.MeshData.INTSEDETAILINGID;
    this.StructureElementId = this.MeshData.INTSTRUCTUREELEMENTTYPEID;
    this.ProjectId = this.MeshData.INTPROJECTID;
    this.BeamParameterSetNo = this.MeshData.INTPARAMETESET;
    this.GroupMarkName = this.MeshData.VCHGROUPMARKINGNAME;
    this.groupMarkID = this.MeshData.INTGROUPMARKID;
    this.ProductTypeID= this.MeshData.SITPRODUCTTYPEID;

    //if (this.MeshData.VCHPRODUCTTYPE !== 'PRC') {
    //if (this.StructureElementId == 1) {
    this.loadBeamdata("AA", this.ProjectId, this.DetailingID, this.StructureElementId, this.groupMarkID)
    this.LoadBeamParameterSet(this.ProjectId);
    this.loadBeamProductCode();

    this.PopulateBeamCapProductCode();
    //}

    //}
  }
  constructor_Data()
  {
    this.ParameterSetData = null;

    this.beamDetailingService.Parameter_SetService.subscribe(
      (data: string) => {
        this.ParameterSetData = data;
        //console.log(this.ParameterSetData)

        if (this.ParameterSetData != null) {
          //debugger;
          this.storedObjectData = localStorage.getItem('MeshData');
          this.MeshData = JSON.parse(this.storedObjectData);
          //console.log(this.storedObjectData)
          this.Changed_ParameterSet = this.ParameterSetList.find((x: any) => x.ParameterSetValue === this.ParameterSetData.INTPARAMETESET);
          //console.log("select parameter set ", this.Changed_ParameterSet);
          if (this.Changed_ParameterSet !== undefined) {
            //debugger;
            this.intGap1 = this.Changed_ParameterSet.Gap1;
            this.intGap2 = this.Changed_ParameterSet.Gap2;
            this.intTopCover = this.Changed_ParameterSet.TopCover;
            this.intBottomCover = this.Changed_ParameterSet.BottomCover;
            this.intLeftCover = this.Changed_ParameterSet.LeftCover;
            this.intRightCover = this.Changed_ParameterSet.RightCover;
            this.intLeg = this.Changed_ParameterSet.Leg;
            this.intHook = this.Changed_ParameterSet.Hook;




            if (this.MeshData.INTGROUPMARKID == 0 || this.MeshData.INTSEDETAILINGID == 0) {
              return;
            }
            if (this.Changed_ParameterSet.ParameterSetNumber != this.selected_ParameterSet.ParameterSetNumber) {
              if (this.groupmarkingBeamlist.length > 0) {
                const ngbModalOptions: NgbModalOptions = {
                  backdrop: 'static',
                  keyboard: false,
                  centered: true,
                  size: 'lg',

                }
                const modalRef = this.modalService.open(RegenerateDialogComponent, ngbModalOptions);
                modalRef.componentInstance.messagenumber = 1;
                modalRef.result.then(modalResult => {
                  if (modalResult.isConfirm) {

                    this.beamDetailingService.UpdateGroupMarking(this.MeshData.INTSEDETAILINGID, this.Changed_ParameterSet.ParameterSetNumber).subscribe({
                      next: (response) => {
                        //console.log(response);
                      },
                      error: (e) => {
                        //console.log("error", e);
                      },
                      complete: () => {
                        this.loading = true;                                                    // this.intGap1,this.intGap2,this.intTopCover,this.intBottomCover,this.intLeftCover,this.intRightCover,this.intHook,this.intLeg,this.DetailingID
                        this.beamDetailingService.RegenerateValidation(this.groupmarkingBeamlist, this.intGap1, this.intGap2, this.intTopCover, this.intBottomCover, this.intLeftCover, this.intRightCover, this.intHook, this.intLeg, this.MeshData.INTSEDETAILINGID, this.StructureElementId).subscribe({
                          next: (response) => {
                            //console.log(response);
                            //this.loadColumndata(this.ProjectId,this.DetailingID,this.StructureElementId);
                            this.groupmarkingBeamlist = response;
                            this.loadBeamdata("AA", this.ProjectId, this.DetailingID, this.StructureElementId, this.groupMarkID)

                          },
                          error: (e) => {
                            this.loading = false;
                            this.groupmarkingBeamlist = e.error;
                            this.tosterService.error("Product Genration failed ,Please check parameterset")
                            //console.log("error", e);
                          },
                          complete: () => {
                            this.loading = true;


                          },
                        });
                      },
                    });
                  }
                })
              }
              else {
                const ngbModalOptions: NgbModalOptions = {
                  backdrop: 'static',
                  keyboard: false,
                  centered: true,
                  size: 'lg',

                }
                const modalRef = this.modalService.open(RegenerateDialogComponent, ngbModalOptions);
                modalRef.componentInstance.messagenumber = 2;
                modalRef.result.then(modalResult => {
                  if (modalResult.isConfirm) {

                    this.beamDetailingService.UpdateGroupMarking(this.MeshData.INTSEDETAILINGID, this.Changed_ParameterSet.ParameterSetNumber).subscribe({
                      next: (response) => {
                        //console.log(response);
                      },
                      error: (e) => {
                        //console.log("error", e);
                      },
                      complete: () => {
                        this.loading = true;


                      },
                    });

                  }
                })

              }


            }
          }


        }
      });

    //console.log(this.ParameterSetData);
  }
  loadBeamdata(GroupMarkName: any, projectID: any, seDetailingID: any, structureElementId: any, groupMarkID: any) {
    //debugger;
    let productTypeID = 7
    this.loading = true;
    this.beamDetailingService.GetBeamStructureMarkingDetails(GroupMarkName, projectID, seDetailingID, structureElementId, productTypeID, groupMarkID).subscribe({
      next: (response) => {
        //console.log(response);
        this.groupmarkingBeamlist = response;
        this.loading = false;
        this.loadBeamShape();
      },
      error: (e) => {
        //console.log("error", e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.groupmarkingBeamlist.forEach(element => {
          element.ProductValidatorDescription="";
          element.colorRow = false;
        });
        this.lastElementBeam = this.groupmarkingBeamlist[this.groupmarkingBeamlist.length - 1];

        for (var i = 0; i < this.groupmarkingBeamlist.length; i++) {
          if(this.expandRow == this.groupmarkingBeamlist[i].StructureMarkId){
            this.groupmarkingBeamlist[i].isExpand = true;
          }else if(this.groupmarkingBeamlist.length-1 == i  && this.expandRow == 0){
            this.groupmarkingBeamlist[i].isExpand = true;
          }else{
            this.groupmarkingBeamlist[i].isExpand = false;
          }
        }

   if(!this.expandRow)
   {
    this.currentPage = (this.groupmarkingBeamlist.length) / this.itemsPerPage
    this.currentPage = Math.ceil(this.currentPage);

    this.pageSize = this.itemsPerPage * (this.currentPage - 1)
    console.log("this.pageSize", this.pageSize)
    console.log("this.itemsPerPage", this.itemsPerPage)
    console.log("this.currentPage", this.currentPage)

    console.log("groupmarkingBeamlist",this.groupmarkingBeamlist);
   }
   this.initialDataRow();


      },
    });



  }
  loadBeamShape() {
    //debugger;
    this.beamDetailingService.PopulateBeamShapeCode().subscribe({
      next: (response) => {
        //console.log(response);
        this.shapeList = response;

      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        this.LoadShapeParam();
      },
    });



  }
  loadBeamProductCode() {
    //debugger;
    let productTypeID = 7
    this.beamDetailingService.PopulateBeamProductCode(this.StructureElementId, productTypeID).subscribe({
      next: (response) => {
        this.BeamProductCodeList = [];
        //console.log(response);
        this.BeamProductCodeList = response;
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {

      },
    });



  }
  PopulateBeamCapProductCode() {
    //debugger;
    this.beamDetailingService.PopulateBeamCapProductCode().subscribe({
      next: (response) => {
        console.log("BeamCabProductCode",response);
        this.BeamCabProductCode = response;
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        // if(this.pushElement.CapProduct==0)
        // {
        // let Capping = this.BeamCabProductCode.filter(item =>
        //   item.ProductCodeName?.toLowerCase().includes(this.pushElement.ProductCodeName?.toLowerCase()));
        //   console.log("Capping PopulateBeamCapProductCode ",this.pushElement.ProductCodeName);
        // this.pushElement.CapProduct = Capping[0]?.ProductCodeId;
        // }
      },
    });



  }
  changeProductCode(event: any) {
    //debugger;
    if (event != null && this.pushElement.Stirupps != "") {
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == event);
        let ProductCodeName = this.selectedproductCode?.ProductCodeName;
        let Capping = this.BeamCabProductCode.filter(item =>
          item.ProductCodeName?.toLowerCase().includes(ProductCodeName?.toLowerCase()));


        this.pushElement.CapProduct= Capping[0]?.ProductCodeId;
        if(this.pushElement.CapProduct)
        {
this.enableCapping=true;
        }
        else{
          this.enableCapping=false;
        }

      }
      //console.log(this.selectedproductCode);
      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);

      this.pushElement.Span = (calcValue * Number(this.pushElement.Stirupps));
      this.pushElement.Stirupps = Math.round((Number(this.pushElement.Span) / calcValue));


    }


  }

  changeProductCode_Edit(event: any,item:any) {
    //debugger;
    if (event != null && item.Stirupps != "") {
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == event);
        let ProductCodeName = this.selectedproductCode?.ProductCodeName;
        let Capping = this.BeamCabProductCode.filter(item =>
          item.ProductCodeName?.toLowerCase().includes(ProductCodeName?.toLowerCase()));


          item.CapProduct.ProductCodeId= Capping[0]?.ProductCodeId;
        if(item.CapProduct.ProductCodeId)
        {
this.enableCapping=true;
        }
        else{
          this.enableCapping=false;
        }

      }
      //console.log(this.selectedproductCode);
      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);

      this.pushElement.Span = (calcValue * Number(this.pushElement.Stirupps));
      this.pushElement.Stirupps = Math.round((Number(this.pushElement.Span) / calcValue));


    }


  }
  ChangeShapeCode(event: any, ShapeList: any) {
    //Call when shape selected
    debugger;
    //console.log(event);
    //console.log(ShapeList)


    this.objBeamShapeCode = this.shapeList.find((x: any) => x.ShapeID === event);
      this.showImage=true



    if(this.exclude_Shapes(this.objBeamShapeCode.ShapeCodeName))
    {
      this.showImage=false;
    }else{
      this.showImage=true

    }

    if (this.shapeList.length > 0) {

      this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === event).ShapeParam;

      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      this.loadMainFile(this.Imagename);
      //console.log(this.ShapeParamlist);

      this.ShapeParamlist.forEach(element => {
        if(element.ParameterName=="Leg" && this.intLeg )
        {
          element.ParameterValue = this.intLeg;
        }
        if(this.intHook && element.ParameterName=="Hook")
        {
            element.ParameterValue = this.intHook;
        }
      });

    }

    if (localStorage.getItem("beam_top")) {
      this.top = parseInt(localStorage.getItem("beam_top")!)
    }
    if (localStorage.getItem("beam_right")) {
      this.right = parseInt(localStorage.getItem("beam_right")!)
    }
    // this.shapeParameter = event;

    this.shapeSelected = true;
    setTimeout(() => {
      // Place your code here
      // const inputElement = this.el.nativeElement.querySelector('#Shapeparam');
      const inputs = this.el.nativeElement.querySelectorAll('input.focusable');    
      for (const input of inputs) {
        if (!(input as HTMLInputElement).readOnly) {
          input.focus();
          input.select();
          break;  // Stop the loop on the first match
        }
      }
       
    }, 100);
   

  }
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
  ShapeParamSubmit() {
    debugger;
    // this.input4.nativeElement.focus();
    if(this.enableBeamEditIndex!==null)
    {
      this.Update(this.beam_StructureMark,1)
    }
    else{
      this.Submit();

    }
    //console.log(this.ShapeParamlist);

  }
  changeCABProductCode(event: any) {

  }
  Changeparam(event: any) {
    //debugger;
    this.isEdit = false;
    this.shapeSelected = true;
    this.showImage = true;
  }
  LoadBeamParameterSet(projectID: any) {
    //
    //debugger;
    let productTypeID = 7
    this.beamDetailingService.BeamParameterSetbyProjIdProdType(projectID, productTypeID).subscribe({
      next: (response) => {
        //console.log(response);
        //debugger;
        this.ParameterSetList = response;

      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
        //console.log("column Paramter Set");
        //console.log(this.ParameterSetList);
        this.selected_ParameterSet = this.ParameterSetList.find((x: any) => x.ParameterSetValue === this.BeamParameterSetNo);
        console.log("select parameter set ", this.selected_ParameterSet);
        if (this.selected_ParameterSet !== undefined) {
          this.intGap1 = this.selected_ParameterSet.Gap1;
          this.intGap2 = this.selected_ParameterSet.Gap2;
          this.intTopCover = this.selected_ParameterSet.TopCover;
          this.intBottomCover = this.selected_ParameterSet.BottomCover;
          this.intLeftCover = this.selected_ParameterSet.LeftCover;
          this.intRightCover = this.selected_ParameterSet.RightCover;
          this.intLeg = this.selected_ParameterSet.Leg;
          this.intHook = this.selected_ParameterSet.Hook;

        }

        //debugger;


      },
    });
  }
  // addSuggestion()
  // {
  //   let Last_Element =  this.groupmarkingBeamlist[this.groupmarkingBeamlist.length - 1].marking;
  //   let lstchar = Last_Element.slice(-1);
  //     Last_Element = Last_Element?.slice(0, -1);
  //     let tempChar: any;
  //     tempChar = Number(lstchar) + 1;
  //     Last_Element+=tempChar;
  //     return Last_Element
  // }
  Submit() {
    debugger;
    this.isaddnewRecord = true;
    this.expandRow = 0;
    //console.log(this.pushElement);

    if (this.MeshData.VCHPRODUCTTYPE === 'PRC') {
      ////debugger;
      if (localStorage.getItem('ParentStructureMarkId') !== null) {
        this.ParentStructureMarkId = Number(localStorage.getItem('ParentStructureMarkId'));
        //console.log("ParentStructureMarkId");
        //console.log(this.ParentStructureMarkId)
      }
    }


    if (this.validateNewRecord() == 1) {
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == this.pushElement.ProductCodeName);
      }
      //console.log(this.selectedproductCode);
      if (this.BeamCabProductCode.length > 0) {
        this.selectedCapProduct = this.BeamCabProductCode.find((x: any) => x.ProductCodeId = this.pushElement.CapProduct);
      }
      if (this.shapeList.length > 0) {
        this.selectedShape = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.ShapeCodeName)

      }
      if (this.ShapeParamlist.length > 0 && this.selectedShape.length > 0) {
          //debugger;
        //console.log(this.selectedShape);////.ShapeParam

      }
      // if(this.ShapeParamlist.length>0)
      // this.selectedShape.ShapeParam = this.ShapeParamlist
      const BeamStructureobj: BeamStructure = {
        _structureMarkId: 0,
        _structureMarkName: this.pushElement.StructureMarkName,
        _productCode: this.selectedproductCode,
        _shape: this.selectedShape,
        _depth: this.pushElement.Depth,
        _width: this.pushElement.Width,
        _slope: this.pushElement.Slope,
        _stirupps: this.pushElement.Stirupps,
        _qty: this.pushElement.Qty,
        _span: this.pushElement.Span,
        _iscap: this.pushElement.IsCap,
        _capProduct: this.selectedCapProduct,
        _produceInd: this.pushElement.ProduceInd,
        _pinSize: this.pushElement.PinSize,
        _parentStructureMarkId: this.ParentStructureMarkId,

      }
      this.loading = true;
      this.beamDetailingService.SaveBeamStructureMarking(BeamStructureobj, this.intGap1, this.intGap2, this.intTopCover, this.intBottomCover, this.intLeftCover, this.intRightCover, this.intHook, this.intLeg, this.DetailingID).subscribe({
        next: (response) => {
          //debugger;
          //console.log(response)
          this.tosterService.success("Structure Marking Saved Successfully.");

        },
        error: (e) => {
          //console.log("error", e);
          //console.log("error", e);
          if (e.error === 'POSTED') {
            this.strIsReadOnly = 'YES';

            this.tosterService.error("The groupmarking is posted already.You cannot Add a Strucutre Marking.")
          }
          else if (e.error === 'DUPLICATE') {
            this.tosterService.error("The structure marking name already exist. Please refresh.")
          }
          else {
            this.tosterService.error(e.error);
          }
          this.loading = false;
        },
        complete: () => {
          this.loadBeamdata("AA", this.ProjectId, this.DetailingID, this.StructureElementId, this.groupMarkID)
          this.loading = false;
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
    if (this.pushElement.StructureMarkName !== "" && this.pushElement.Width !== "" && this.pushElement.Depth !== "" && this.pushElement.Slope !== "" &&
      this.pushElement.Stirupps !== "" && this.pushElement.ProductCodeName !== "" && this.pushElement.ShapeCodeName !== "" && this.pushElement.Qty !== "" && this.pushElement.Span !== "" &&
      this.pushElement.CapProduct !== "" && this.pushElement.PinSize !== "") {

      if (this.ShapeParamlist !== undefined) {

        let Index = this.ShapeParamlist.findIndex(x => x.EditFlag === true && x.ParameterValue == '');

        if (Index !== -1) {
          if (this.ShapeParamlist[Index].ParameterValue == 0) {
            return 3;
          }
        }
      }
      else { return 3; }

      return 1;
    }
    else {
      return 2;
    }

  }
  structureMarkChange(event: any) {
    //console.log(event);
    let strucutremark = this.groupmarkingBeamlist.find((x: any) => x.StructureMarkName === event.target.value);
    if (strucutremark != null) {
      this.tosterService.error("Structure Mark Name already exists. Please check.");

    }

  }
  DeletestructureMark(StructureMarkId: any,StructureMarkName:any) {
    this.loading = true;
    this.expandRow = StructureMarkId
    this.beamDetailingService.DeleteBeamStructureMarking(StructureMarkId).subscribe({
      next: (response) => {
        //console.log(response);
      },
      error: (e) => {
        //console.log("error", e);
        this.loading = false
      },
      complete: () => {
        this.loading = false;
        this.loadBeamdata("AA", this.ProjectId, this.DetailingID, this.StructureElementId, this.groupMarkID)
        this.tosterService.success(`Structure marking ${StructureMarkName} deleted successfully.`);
      },
    });


  }
  onEdit(item: any, index: any) {
    if(this.strIsReadOnly!='NO'){
      this.tosterService.warning("This record is already posted.");
      return;
    }
    if (this.strIsReadOnly == "YES") {
      this.tosterService.error("Group Marking is already posted.You cannot Edit a Strucutre Marking.");
      return;
    }
this.beam_StructureMark = item;
    this.showImage = false;
    this.enableBeamEditIndex = index;
    //debugger;
    //Assign Param Values to table Vanita
    if (item.ProductMark !== undefined && item.ProductMark.length > 0) {
      let shapeparam = item.ProductMark[0].ParamValues;
      this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === item.ProductMark[0].ShapeCodeId).ShapeParam;

      //debugger;
      // if (shapeparam.indexOf('Leg') !== -1) {
      //   let hook_index = shapeparam.indexOf('Hook');
      //   let leg_index = shapeparam.indexOf('Leg');
      //   let legvalue = shapeparam.slice(leg_index, hook_index).substring(4, shapeparam.slice(leg_index, hook_index).indexOf(';'))

      //   this.ShapeParamlist[this.ShapeParamlist.length - 1].ParameterValue = Number(legvalue);

      //   let legindex = this.ShapeParamlist.findIndex(x => x.ParameterName === 'Leg');
      //   this.ShapeParamlist[legindex].ParameterValue = legvalue;

      // }

      // if (shapeparam.indexOf('Hook') !== -1) {
      //   this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === item.ProductMark[0].ShapeCodeId).ShapeParam;
      //   let hookvalue = shapeparam.substring(shapeparam.indexOf('Hook')).slice(5, shapeparam.substring(shapeparam.indexOf('Hook')).length)

      //   let hookindex = this.ShapeParamlist.findIndex(x => x.ParameterName === 'Hook');
      //   this.ShapeParamlist[hookindex].ParameterValue = hookvalue;
      //   // this.ShapeParamlist[this.ShapeParamlist.length-1].ParameterValue=Number(Paramvalue);
      // }
      let shapeParam = item.ProductMark[0].ParamValues;
      let shapeParam_arr = shapeParam.split(';');
      let count =0;
      shapeParam_arr.forEach((element: any) => {
        let paramValue = element.split(':')
        this.ShapeParamlist[count].ParameterValue =paramValue[1].toString();
        console.log(paramValue[1])
        count++;
      });
      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      this.loadMainFile(this.Imagename);
      this.showImage=true

    }


    // this.loadFilterProductCode('L');
    // this.loadFilterClinkProduct('L');
    this.backup_BeamStructurelist = JSON.parse(JSON.stringify(this.groupmarkingBeamlist))
    // this.ChangeShapeCode(item.ProductMark[0].ShapeCodeId,this.shapeList)


  }
  RoundUpBy5Setp(input: number) {

    if (input % 5 == 0)
      return input;
    else
      return input + (5 - (input % 5));

  }
  Update(ItemRow: any, index: any) {
    //debugger;
    //console.log(ItemRow)
    this.isupdateRecord = true;
    this.expandRow = ItemRow.StructureMarkId;

    if (this.validateUpdateRecord(ItemRow) == 1) {

      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == ItemRow.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);

      if (this.BeamCabProductCode.length > 0) {
        this.selectedCapProduct = this.BeamCabProductCode.find((x: any) => x.ProductCodeId = ItemRow.CapProduct.ProductCodeId);
      }

      if (this.shapeList.length > 0) {
        this.selectedShape = this.shapeList.find((x: any) => x.ShapeID === ItemRow.Shape.ShapeID)
        this.selectedShape.ShapeParam = this.ShapeParamlist
      }
      if (this.ShapeParamlist.length > 0 && this.selectedShape.length > 0) {
        //debugger;
        //console.log(this.selectedShape);////.ShapeParam

      }


      const BeamStructureobj: BeamStructure = {
        _structureMarkId: ItemRow.StructureMarkId,
        _structureMarkName: ItemRow.StructureMarkName,
        _productCode: this.selectedproductCode,
        _shape: this.selectedShape,
        _depth: ItemRow.Depth,
        _width: ItemRow.Width,
        _slope: ItemRow.Slope,
        _stirupps: ItemRow.Stirupps,
        _qty: ItemRow.Qty,
        _span: ItemRow.Span,
        _iscap: ItemRow.IsCap,
        _capProduct: this.selectedCapProduct,
        _produceInd: ItemRow.ProduceInd,
        _pinSize: ItemRow.PinSize,
        _parentStructureMarkId: 0,

      }

      if(!ItemRow.IsCap)
      {
        BeamStructureobj._capProduct=ItemRow.CapProduct

      }
      this.loading = true;
      this.beamDetailingService.UpdateBeamStructureMarking(BeamStructureobj, this.intGap1, this.intGap2, this.intTopCover, this.intBottomCover, this.intLeftCover, this.intRightCover, this.intHook, this.intLeg, this.DetailingID).subscribe({
        next: (response) => {
          //debugger;
          //console.log(response);
          this.showImage = false;
          this.enableBeamEditIndex = null;

        },
        error: (e) => {
          //console.log("error", e);
          if (e.error === 'POSTED') {
            this.strIsReadOnly = 'YES';

            this.tosterService.error("Group Marking is already posted.You cannot Edit a Strucutre Marking.")
          }
          else if (e.error === 'DUPLICATE') {
            this.tosterService.error("The structure marking name already exist. Please refresh.")
          }
          else {
            this.tosterService.error(e.error);
          }
          this.loading = false;
        },
        complete: () => {
          this.isupdateRecord = false;
          this.loading = false;
          this.tosterService.success("Structure Marking Updated Successfully.");
          this.loadBeamdata("AA", this.ProjectId, this.DetailingID, this.StructureElementId, this.groupMarkID)


        },
      });
    }

    else if (this.validateUpdateRecord(ItemRow) == 3) {
      this.tosterService.warning('Please enter Value of Shape Parameter.')
    }

  }
  Reset(ItemRow: any, index: any) {
    this.groupmarkingBeamlist = JSON.parse(JSON.stringify(this.backup_BeamStructurelist));
    this.enableBeamEditIndex = null;
    this.isupdateRecord = false;


  }
  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.enableEditIndex = null;
    if (this.prev_index != null) {

      // this.ColumnStructureMarklist[this.prev_index] = this.backup_item
      //this.isformsubmit = false
      //this.prev_index = null
    }

  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    this.enableEditIndex = null;
    if (this.prev_index != null) {
      // this.ColumnStructureMarklist[this.prev_index] = this.backup_item
      // this.isformsubmit = false
      this.prev_index = null
    }

  }
  Depth_lostfocus(Depth: any) {
    this.pushElement.Slope = Depth
  }

  Depth_lostfocus_Edit(item: any) {
      item.Slope = item.Depth
    }
  spanText_LostFocus(Span: any) {
    if (this.pushElement.ProductCodeName !== "" && Span !== "" && this.pushElement.Stirupps !== "") {
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == this.pushElement.ProductCodeName);
      }
      //console.log(this.selectedproductCode);

      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
      this.pushElement.Span = (calcValue * Number(this.pushElement.Stirupps));
      this.pushElement.Stirupps = Math.round(Number(Number(Span) / calcValue));

    }

  }
  Stirupps_lostfocus(Stirupps: any) {
    //debugger;
    if (this.pushElement.ProductCodeName !== "" && Stirupps !== "") {
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == this.pushElement.ProductCodeName);
      }
      //console.log(this.selectedproductCode);
      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);

      this.pushElement.Span = (calcValue * Number(Stirupps));
      this.pushElement.Stirupps = Math.round(Number(this.pushElement.Span) / calcValue);

    }

  }
  EditStirupps_lostfocus(Stirupps: any, item: any, index: any) {


    if (item.ProductCode.ProductCodeId !== null && Stirupps !== "" && item.Span !== "") {
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == item.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);
      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
      item.Span = (calcValue * Number(Stirupps));
      item.Stirupps = Math.round(Number(Number(item.Span) / calcValue));


    }

  }
  EditSpan_lostfocus(Span: any, item: any, index: any) {
    if (item.ProductCode.ProductCodeId !== null && Span !== "" && item.Stirupps) {
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == item.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);

      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
      item.Stirupps = Math.round(Number(Number(Span) / calcValue));
      item.Span = (calcValue * Number(item.Stirupps));

    }

  }
  validateUpdateRecord(itemRow: any) {//itemRow.StructureMarkName !== "" && itemRow.Width !== "" && itemRow.Length!=="
    if (itemRow.StructureMarkName !== "" && itemRow.Width !== "" && itemRow.Depth !== "" && itemRow.Slope !== "" &&
      itemRow.Stirupps !== "" && itemRow.ProductCode.ProductCodeId !== "" && itemRow.Shape.ShapeID !== "" && itemRow.Qty !== "" && itemRow.Span !== "" &&
      itemRow.CapProduct.ProductCodeId !== "" && itemRow.PinSize !== "") {
      let Index = this.ShapeParamlist.findIndex(x => x.EditFlag === true && x.ParameterValue == '');

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
  RouteToBom(item: any) {
    // item.StructureElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE
    // localStorage.setItem('BomData', JSON.stringify(item));
    item.StructureElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE;
    //debugger;
    let BomData: BomData = {
      StructureElement: item.StructureElement,
      ProductMarkId: item.ProductMarkID,
      CO1: item.CO1,
      CO2: item.CO2,
      MO1: item.MO1,
      MO2: item.MO2,
      ParamValues: item.ParamValues,
      ShapeCodeName: item.ShapeCode,
      ShapeID: item.ShapeCodeId
    }
    localStorage.setItem('BomData', JSON.stringify(BomData));
this.router.navigate(['/detailing/DetailingGroupMark/BOM']);
  }
  isNumber(char: any) {
    return /^\d+$/.test(char);
  }
  nextChar(c: any) {
    return String.fromCharCode(((c.charCodeAt(0) + 1 - 65) % 25) + 65);
  }

  initialDataRow() {
    //debugger;
    //console.log(this.lastElementBeam)
    if (this.groupmarkingBeamlist.length > 0) {
      let copiedObject = this.lastElementBeam?.StructureMarkName;
      let lstchar = "";
      lstchar = this.lastElementBeam?.StructureMarkName.slice(-1);
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

      this.pushElement.StructureMarkName = copiedObject;//this.lastElementBeam.StructureMarkingName;
      this.pushElement.Width = this.lastElementBeam?.Width;
      this.pushElement.Depth = this.lastElementBeam?.Depth;
      this.pushElement.Slope = this.lastElementBeam?.Slope;
      this.pushElement.Stirupps = this.lastElementBeam?.Stirupps;
      this.pushElement.ProductCodeName = this.lastElementBeam?.ProductCode.ProductCodeId;
      this.pushElement.ShapeCodeName = this.lastElementBeam?.Shape.ShapeID;
      this.pushElement.Qty = this.lastElementBeam?.Qty;
      this.pushElement.Span = this.lastElementBeam?.Span;
      // if(this.lastElementBeam?.CapProduct.ProductCodeId!=0)
      // {
      //   this.pushElement.CapProduct = this.lastElementBeam?.CapProduct.ProductCodeId;

      // }
      this.changeProductCode(this.pushElement.ProductCodeName);
      this.pushElement.PinSize = this.lastElementBeam?.PinSize;
      this.pushElement.IsCap = this.lastElementBeam?.IsCap;
      this.pushElement.ProduceInd = this.lastElementBeam?.ProduceInd;

      // if(this.pushElement.CapProduct==0)
      // {
      // let Capping = this.BeamCabProductCode.filter(item =>
      //   item.ProductCodeName?.toLowerCase().includes(this.pushElement.ProductCodeName?.toLowerCase()));
      // this.pushElement.CapProduct= Capping[0]?.ProductCodeId;
      // }


      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == this.lastElementBeam?.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);
      if (this.BeamCabProductCode.length > 0) {
        this.selectedCapProduct = this.BeamCabProductCode.find((x: any) => x.ProductCodeId == this.lastElementBeam?.CapProduct.ProductCodeId);
      }
      if (this.shapeList.length > 0) {
        this.selectedShape = this.shapeList.find((x: any) => x.ShapeID === this.lastElementBeam?.Shape.ShapeID)
        this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === this.lastElementBeam?.Shape.ShapeID).ShapeParam;

        this.Imagename = "";
        this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();

        this.ShapeParamlist.forEach(element => {
          if(element.ParameterName=="Leg" && this.intLeg)
          {

            element.ParameterValue = this.intLeg;
          }
          if(this.intHook && element.ParameterName=="Hook")
          {
              element.ParameterValue = this.intHook;
          }
        });
        this.loadMainFile(this.Imagename);
        //console.log(this.ShapeParamlist);

      }
    }
    else {

      this.pushElement.StructureMarkName = "1";//this.lastElementBeam.StructureMarkingName;
      this.pushElement.Width = 200;
      this.pushElement.Depth = 200;
      this.pushElement.Slope = 200;
      this.pushElement.Stirupps = 20;
      this.pushElement.ProductCodeName = 285;// this.lastElementBeam?.ProductCode.ProductCodeId;
      this.pushElement.ShapeCodeName = 1;//this.lastElementBeam?.Shape.ShapeID;
      this.pushElement.Qty = 1;
      this.pushElement.Span = 2000;
      this.pushElement.CapProduct = 22;//this.lastElementBeam?.CapProduct.ProductCodeId;
      this.pushElement.PinSize = 32;
      this.pushElement.IsCap = true;
      this.pushElement.ProduceInd = true;
      if (this.BeamProductCodeList.length > 0) {
        this.selectedproductCode = this.BeamProductCodeList.find((x: any) => x.ProductCodeId == this.pushElement.ProductCodeName);
      }
      //console.log(this.selectedproductCode);
      if (this.BeamCabProductCode.length > 0) {
        this.selectedCapProduct = this.BeamCabProductCode.find((x: any) => x.ProductCodeId == this.pushElement.CapProduct);
      }
      if (this.shapeList.length > 0) {
        this.selectedShape = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.ShapeCodeName)
        this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.ShapeCodeName).ShapeParam;

        this.Imagename = "";
        this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
        this.loadMainFile(this.Imagename);

        this.ShapeParamlist.forEach(element => {
          if(element.ParameterName=="Leg" && this.intLeg )
          {
            element.ParameterValue = this.intLeg;
          }
          if(this.intHook && element.ParameterName=="Hook")
          {
              element.ParameterValue = this.intHook;
          }
        });


        //console.log(this.ShapeParamlist);

      }

    }

  }

  LoadShapeParam() {
    debugger;
    if (this.shapeList.length > 0) {
      // this.selectedShape = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.ShapeCodeName)
      // this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.ShapeCodeName).ShapeParam;

      this.ShapeParamlist.forEach(element => {
        if(element.ParameterName=="Leg" && this.intLeg)
        {

          element.ParameterValue = this.intLeg;
        }
        if(this.intHook && element.ParameterName=="Hook")
        {
            element.ParameterValue = this.intHook;
        }
      });

      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      if (localStorage.getItem("beam_top")) {
        this.top = parseInt(localStorage.getItem("beam_top")!)
      }
      if (localStorage.getItem("beam_right")) {
        this.right = parseInt(localStorage.getItem("beam_right")!)
      }
      this.loadMainFile(this.Imagename);
      //console.log(this.ShapeParamlist);
      setTimeout(() => {
        // Place your code here
        // const inputElement = this.el.nativeElement.querySelector('#Shapeparam');
        const inputs = this.el.nativeElement.querySelectorAll('input.focusable');    
        for (const input of inputs) {
          if (!(input as HTMLInputElement).readOnly) {
            input.focus();
            input.select();
            break;  // Stop the loop on the first match
          }
        }
         
      }, 100);
    }
  }

  ProductMarkingGrid_rowLoading(productMark: any) {
    if (productMark.BOMIndicator == "U") {
      //e.Row.Background = new SolidColorBrush(new Color { A = 255, R = 0, G = 191, B = 255 });
    }

    if ((productMark.ProductionMO1 <= 0) || (productMark.ProductionMO2 <= 0) || (productMark.ProductionCO1 <= 0) || (productMark.ProductionCO2 <= 0)) {
      productMark.ProductValidatorDescription = "Production Over Hang is Zero";


      //e.Row.Background = new SolidColorBrush(new Color { A = 255, R = 255, G = 0, B = 0 });
    }

    if ((productMark.MO1 <= 0) || (productMark.MO2 <= 0) || (productMark.CO1 <= 0) || (productMark.CO2 <= 0)) {
      productMark.ProductValidatorDescription = "Detailing Over Hang is Zero";
      // e.Row.Background = new SolidColorBrush(new Color { A = 255, R = 255, G = 0, B = 0 });
    }

    switch (productMark.ProductValidator) {
      case 1:
        {
          productMark.ProductValidatorDescription = "Detailing BOM is Missing";
          break;
        }
      case 2:
        {
          productMark.ProductValidatorDescription = "Production BOM is Missing";
          break;
        }
      case 3:
        {
          productMark.ProductValidatorDescription = "Sum of MW Spacing is not equal to Invoice CWLength";
          break;
        }
      case 4:
        {
          productMark.ProductValidatorDescription = "Sum of CW Spacing is not equal to Invoice MWLength";
          break;
        }
      case 5:
        {
          productMark.ProductValidatorDescription = "Sum of MW Spacing is not equal to Production CWLength";
          break;
        }
      case 6:
        {
          productMark.ProductValidatorDescription = "Sum of CW Spacing is not equal to Production MWLength";
          break;
        }
      case 7:
        {
          productMark.ProductValidatorDescription = "Production Pitch is Zero";
          break;
        }
      case 8:
        {
          productMark.ProductValidatorDescription = "Detailing Pitch is Zero";
          break;
        }
    }

  }
  Report_Click() {
    //debugger;
    if(this.ProductTypeID==4)
    {
      this.strQueryString = "http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fCABGroupMarkingReport&rs:Command=Render&";
      this.strQueryString = this.strQueryString + "intGroupMarkingId=" + this.groupMarkID + "&sitProductTypeId="+this.ProductTypeID + "&rc:Parameters=false ";
    }
    else
    {
    this.strQueryString = environment.ReportUrl;
    this.strQueryString = this.strQueryString + "intGroupMarkingId=" + this.groupMarkID + "&sitProductTypeId="+this.ProductTypeID+"&bitSummaryReport=" + 0 + "&rc:Parameters=false ";
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
    modalRef.componentInstance.CustomerName = this.MeshData.CustomerName;
    modalRef.componentInstance.productType = this.MeshData.SITPRODUCTTYPEID;
    modalRef.componentInstance.structElement = this.MeshData.INTSTRUCTUREELEMENTTYPEID;
    modalRef.componentInstance.tntParameterSetNumber = this.MeshData.TNTPARAMSETNUMBER;

    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      this.reloadService.reloadComponentDetailingGm.emit('');
    })





  }

  giveRowcolor(item: any) {
    var color;

// //debugger


    if (item.ProductGenerationStatus) {
      color='white';
    }
    else{
      color = 'red'
    }
    if(item.colorRow)
    {
      color = '#880808';
    }
    return color
  }

  giveErrorcolor(item: any) {
    var color;

// //debugger


    if (item.ProductValidatorDescription=="" || item.ProductValidatorDescription==null || item.ProductValidatorDescription==undefined) {
      color='lightgreen';
    }
    else{
      color = 'red'
    }

    return color
  }
  // ChangeCapping()
  // {

  //   if(this.pushElement.CapProduct==0 || this.pushElement.CapProduct=="")
  //   {
  //   let Capping = this.BeamCabProductCode.filter(item =>
  //     item.ProductCodeId==this.pushElement.ProductCodeName);
  //   this.pushElement.CapProduct= Capping[0]?.ProductCodeId;
  //   }

  // }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.initialX = event.clientX + this.right;
    this.initialY = event.clientY - this.top;
    this.renderer.addClass(this.el.nativeElement, 'grabbing');
    localStorage.setItem("beam_top",this.top.toString());
    localStorage.setItem("beam_right",this.right.toString());

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

exclude_Shapes(shape:any)
{
  let a:boolean=false
  this.exclude_Shapelist.forEach(element => {
    if(element===shape)
    {
      a= true;

    }
  });
return a;
}

updateStructureMarking(event: any,item:any,Struct:any)
{
  debugger;

  
  if(this.strIsReadOnly==='YES')
  {
    this.loadBeamdata("AA", this.ProjectId, this.DetailingID, this.StructureElementId, this.groupMarkID)
    this.tosterService.error("This Groupmark is Posted");
    return ;

  }
  if(Struct)
  {

    if(event.target.textContent.trim().length>20)
    {
      this.tosterService.warning("Structure marking length exceeded");
      return ;
    }
    item.StructureMarkName = event.target.textContent.trim();
  }
  else{
    item.Qty = event.target.textContent.trim();

  }

  this.beamDetailingService.updateStructureMarking_Beam(item.StructureMarkName,item.StructureMarkId,item.Qty).subscribe({
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

selectRow(item:any,event:MouseEvent)
  {

    let i  = this.groupmarkingBeamlist.findIndex(x=>x.StructureMarkId ===item.StructureMarkId);
   
    

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
    this.groupmarkingBeamlist.forEach(element => {
      if(element.colorRow)
      {
        this.DeletestructureMark(element.StructureMarkId,element.StructureMarkName)
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
}
