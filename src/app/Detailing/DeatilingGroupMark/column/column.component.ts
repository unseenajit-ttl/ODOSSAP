import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewChildren,Renderer2,QueryList, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ColumnStructure } from 'src/app/Model/add_ColumnStructure';
import { C_ProductCode } from 'src/app/Model/add_C_ProductCode';
import { DetailingService } from '../../DetailingService';
import { ColumnDetailingService } from '../../MeshDetailing/ColumnDetailingService';
import { ToastrService } from 'ngx-toastr';
import { RegenerateDialogComponent } from '../../RegenarationDialog/Regenerate-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BomData } from 'src/app/Model/BomData';
import { GroupMarkComponent } from '../../MeshDetailing/addgroupmark/addgroupmark.component';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { BeamDetailingService } from '../../MeshDetailing/BeamDetailingService';


@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit {


  @ViewChildren('focasable', { read: ElementRef }) inputs!: QueryList<ElementRef>;

  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;


  DetailingID: any;
  StructureElementId: any;
  ProjectId: any;
  @Input() ColumnParameterSetNo: any;
  storedObjectData: any
  ParameterSetData: any = null;
  MeshData: any
  ParameterSetList: any[] = [];

  ColumnStructureMarklist: any[] = [];
  loading: boolean = true;

  pageSize = 0;
  maxSize: number = 10;
  currentPage = 1;
  itemsPerPage: number = 10;
  enableEditIndex = null;
  prev_index: any = null;

  ColumnProductList: any[] = [];
  ClinkProductList: any[] = [];
  Imagename: any

  DetailingGroupMarkForm!: FormGroup;

  //Start-Added by vanita
  selected_ParameterSet: any;
  Changed_ParameterSet: any;
  intHook: number = 0;
  intGap1: number = 0;
  intGap2: number = 0;
  intTopCover: number = 0;
  intBottomCover: number = 0;
  intLeftCover: number = 0;
  intRightCover: number = 0;
  intLeg: number = 0;
  selectedproductCode: C_ProductCode | undefined;
  selectedClinkProductLength: any[] = [];
  selectedClinkProductWidth: any[] = [];
  selectedShapeCode: any[] = [];
  enableColumnEditIndex = null;
  backup_ColumnStructurelist: any[] = [];
  isaddnewRecord: boolean = false;
  isTooltipHidden = false;
  rowtooltip: string = "Hello"
  ProductValidatorDescription: string = "";
  objColumnShapeCode: any;
  Structpattern = /[\\\~!@#$%^*&=<>()_+{}:|""?`;',.[\]]+/;
  ProductTypeID: number = 0;
  @Input() ParentStructureMarkId: number = 0;
  ParentStructureMarkIdObject: any
  strIsReadOnly: any = "NO";
  intRecordCount: number = 0;
  isupdateRecord: boolean = false;
  lastElementColumn: any;
  strQueryString: string | undefined;
  IntGroupMarkId: number | undefined;
  @ViewChild('input3')
  input3!: ElementRef;

  i: number = 0;
  j: number = 1;
  mainWireTotal: number = 0;
  crossWireTotal: number = 0;
  //End Added by vanita

  isEdit = false
  shapeList: any = [];
  selectparameter2: any;
  shapeSelected = false;
  imgTable: any;
  selectparameter: any;
  customerList: any[] = [];
  parameterList: any[] = [];
  projectList: any[] = [];
  WBSList: any[] = [];
  searchResult: boolean = false;
  isaddnew: boolean = false;
  groupmarkingColumnlist: any[] = [];
  groupmarkingBeamlist: any[] = [];
  StructElementlist: any[] = [];
  structureElementarray: any[] = [];
  Productmarkinglist: any[] = [];
  groupmarkingSlablist: any[] = [];
  shapeParameter: any = [];
  new_groupmarkingBeamlist: any[] = []
  showImage: boolean = false;
  startEdit = true;
  showChild: boolean = false;
  isExpand = false;
  flag = false;
  ShapeParamlist: any[] = [];
  addList_flag = false;
  addList: any[] = [];

  @ViewChild('strucuremarkingInput')
  strucuremarkingInput!: ElementRef;
  pushElement: any =
    { 'structureMarking': '', 'Width': '', 'Length': '', 'Totallinks': '', 'Product': '', 'Shape': '', 'RowatLength': '', 'ClinkProductLength': '', 'MemberQty': '', 'rowatwid': 0, 'ClinkProductWidth': '', 'qtywidth': '', 'Height': '', 'clnk': true, 'clonly': true, 'pi': true, 'bc': true, 'pinsize': '' };

  ShapeParam: any = { 'ParameterName': '', 'ParameterValue': '' }

  Queryparameterset: any;
  elementDetails: any;
  LegValues: any;
  tntParameterSetNo: any;
tableColor: any;
  expandRow:any=0;
  enableClink: boolean=true;
  enableClink_edit: boolean=true;
  Column_Structmark: any;


  constructor(public router: Router, public httpClient: HttpClient, private modalService: NgbModal, public columndetailingService: ColumnDetailingService,public beamDetailingService:BeamDetailingService, private tosterService: ToastrService, private reloadService: ReloadService,
    private el: ElementRef,
    private renderer: Renderer2,
    ) {
      this.constructor_Data();

  }

  showDetails(item: any) {
    this.isExpand = true

  }

  ngOnInit() {
    ////debugger;
    this.reloadService.ReloadDetailingGM$.subscribe((data) => {
      this.loadInitialData();
      this.constructor_Data();
    });
    this.loadInitialData();


  }
  constructor_Data()
  {
    this.ParameterSetData = null;
    this.LoadColumnParameterSet(this.ProjectId);


    this.columndetailingService.Parameter_SetService.subscribe(
      (data: string) => {
        this.ParameterSetData = data;
        //debugger;
        //console.log(this.ParameterSetData)

        if (this.ParameterSetData != null) {
          this.storedObjectData = localStorage.getItem('MeshData');
          this.MeshData = JSON.parse(this.storedObjectData);

          //console.log(this.storedObjectData)
          if (this.ParameterSetList.length > 0) {
            this.Changed_ParameterSet = this.ParameterSetList.find((x: any) => x.ParameterSetValue === this.ParameterSetData.INTPARAMETESET);
            //console.log("select parameter set ", this.Changed_ParameterSet);
            if (this.Changed_ParameterSet !== undefined) {
              this.intGap1 = this.Changed_ParameterSet.Gap1;
              this.intGap2 = this.Changed_ParameterSet.Gap2;
              this.intTopCover = this.Changed_ParameterSet.TopCover;
              this.intBottomCover = this.Changed_ParameterSet.BottomCover;
              this.intLeftCover = this.Changed_ParameterSet.LeftCover;
              this.intRightCover = this.Changed_ParameterSet.RightCover;
              this.intLeg = this.LegValues;
              this.intHook = this.Changed_ParameterSet.Hook;


              if (this.MeshData.INTGROUPMARKID == 0 || this.MeshData.INTSEDETAILINGID == 0) {
                return;
              }
              if (this.Changed_ParameterSet.ParameterSetNumber != this.selected_ParameterSet.ParameterSetNumber) {
                if (this.ColumnStructureMarklist.length > 0) {
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

                      this.columndetailingService.UpdateGroupMarking(this.MeshData.INTSEDETAILINGID, this.Changed_ParameterSet.ParameterSetNumber).subscribe({
                        next: (response) => {
                          //console.log(response);
                        },
                        error: (e) => {
                          //console.log("error", e);
                        },
                        complete: () => {
                          this.loading = true;
                          //Regeneration
                          this.columndetailingService.RegenerateValidation(this.ColumnStructureMarklist, this.intTopCover, this.intBottomCover, this.intLeftCover, this.intRightCover, this.intLeg, this.MeshData.INTSEDETAILINGID, 1, this.StructureElementId).subscribe({
                            next: (response) => {
                              //console.log(response);
                              // this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);
                              this.ColumnStructureMarklist = response;
                              this.tosterService.success("Regenrated Successfully");

                            },
                            error: (e) => {
                              //debugger;
                              this.loading = false;
                              this.ColumnStructureMarklist = e.error;

                              this.tosterService.error("Product Genration failed ,Please check parameterset")
                              //console.log("error", e);
                            },
                            complete: () => {
                              this.loading = false;
                              this.ColumnStructureMarklist.forEach(element => {
                                element.colorRow = false;
                              });

                            },
                          });
                          //

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

                      this.columndetailingService.UpdateGroupMarking(this.MeshData.INTSEDETAILINGID, this.Changed_ParameterSet.ParameterSetNumber).subscribe({
                        next: (response) => {

                        },
                        error: (e) => {

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

        }
      });
    //console.log(this.ParameterSetData);
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
    this.IntGroupMarkId = this.MeshData.INTGROUPMARKID;
    this.DetailingID = this.MeshData.INTSEDETAILINGID
    this.StructureElementId = this.MeshData.INTSTRUCTUREELEMENTTYPEID
    this.ProjectId = this.MeshData.INTPROJECTID
    this.ColumnParameterSetNo = this.MeshData.INTPARAMETESET
    this.tntParameterSetNo = this.MeshData.TNTPARAMSETNUMBER
    //debugger;
    this.ProductTypeID = this.MeshData.SITPRODUCTTYPEID
    this.loadFilterProductCode('L');
    this.loadFilterClinkProduct('L');
    if (this.MeshData.VCHPRODUCTTYPE === 'PRC') {

      if (localStorage.getItem('ParentStructureMarkId') !== null) {
        this.ParentStructureMarkId = Number(localStorage.getItem('ParentStructureMarkId'));
        //console.log("ParentStructureMarkId");
        //console.log(this.ParentStructureMarkId)
      }
    }
    this.loadColumnShape();
    // if (this.StructureElementId == 2) {
    this.LoadColumnParameterSet(this.ProjectId);
    this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);



    // }


  }
  loadColumndata(projectID: any, seDetailingID: any, structureElementId: any,) {
    ////debugger;
    //let productTypeID=7
    this.loading = true;
    this.columndetailingService.GetColumnStructureMarkingDetails(projectID, seDetailingID, structureElementId, this.ProductTypeID).subscribe({
      next: (response) => {
        //console.log(response);
        this.ColumnStructureMarklist = response;
        // this.loading = false;
        this.loadColumnShape();

      },
      error: (e) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.lastElementColumn = this.ColumnStructureMarklist[this.ColumnStructureMarklist.length - 1];
        if(this.expandRow == 0)
        {
        this.currentPage = (this.ColumnStructureMarklist.length) / this.itemsPerPage
        this.currentPage = Math.ceil(this.currentPage);
        this.pageSize = this.itemsPerPage * (this.currentPage - 1)
        console.log("this.pageSize", this.pageSize)
        console.log("this.itemsPerPage", this.itemsPerPage)
        console.log("this.currentPage", this.currentPage)
        }
        
        for (var i = 0; i < this.ColumnStructureMarklist.length; i++) {
          if(this.expandRow == this.ColumnStructureMarklist[i].StructureMarkId){
            this.ColumnStructureMarklist[i].isExpand = true;
          }else if(this.ColumnStructureMarklist.length-1 == i  && this.expandRow == 0){
            this.ColumnStructureMarklist[i].isExpand = true;
          }else{
            this.ColumnStructureMarklist[i].isExpand = false;
          }

        }
        this.initialDataRow();
      },
    });


  }
  loadColumnShape() {
    ////debugger;
    // let productTypeID=7
    this.columndetailingService.PopulateColumnShapeCode().subscribe({
      next: (response) => {
        //console.log(response);
        this.shapeList = response;

      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {

      },
    });



  }
  LoadColumnParameterSet(projectID: any) {
    //
    //let productTypeID=7
    this.columndetailingService.ColumnParameterSetbyProjIdProdType(projectID, this.ProductTypeID).subscribe({
      next: (response) => {
        console.log("Parameter Set Column ",response);
        this.ParameterSetList = response;


      },
      error: (e) => {
      },
      complete: () => {

        //debugger;
        this.selected_ParameterSet = this.ParameterSetList.find((x: any) => x.ParameterSetValue === this.ColumnParameterSetNo);
        console.log("select parameter set ", this.selected_ParameterSet);
        this.tntParameterSetNo = this.selected_ParameterSet.ParameterSetNumber;

        if (this.selected_ParameterSet !== undefined) {
          this.intTopCover = this.selected_ParameterSet.TopCover;
          this.intBottomCover = this.selected_ParameterSet.BottomCover;
          this.intLeftCover = this.selected_ParameterSet.LeftCover;
          this.intRightCover = this.selected_ParameterSet.RightCover;
          this.intLeg = this.selected_ParameterSet.Leg;        }



      },
    });
  }
  loadFilterProductCode(ColumnProduct: any) {
    ////debugger;

    //console.log(ColumnProduct)
    if (!(typeof (ColumnProduct) === 'string')) {
      ColumnProduct = ColumnProduct.value;
    }

    //let productTypeID=7
    this.columndetailingService.PopulateFilterProductCode(this.StructureElementId, this.ProjectId, ColumnProduct).subscribe({
      next: (response) => {
        //console.log(response);
        this.ColumnProductList = [];
        this.ColumnProductList = response;
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {

      },
    });


  }
  loadFilterClinkProduct(ClinkProduct: any) {
    ////debugger;
    //console.log(ClinkProduct)
    if (!(typeof (ClinkProduct) === 'string')) {
      ClinkProduct = ClinkProduct.value;
    }
    this.columndetailingService.PopulateFilterClinkProduct(ClinkProduct).subscribe({
      next: (response) => {
        //console.log(response);
        this.ClinkProductList = response;
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {

      },
    });



  }
  structureMarkChange(event: any) {
    //console.log(event);
    let strucutremark = this.ColumnStructureMarklist.find((x: any) => x.StructureMarkingName === event.target.value);
    if (strucutremark != null) {
      this.tosterService.error("Structure Mark Name already exists. Please check.");

    }

  }
  changeFilterProductCode(item: any,Mode:any) {
    //console.log(Product)
    //debugger;
if(Mode=='S')
{
  if (this.pushElement.Product != null && this.pushElement.Totallinks != "") {

    if (this.ColumnProductList.length > 0) {
      this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == this.pushElement.Product);
      let ProductCodeName = this.selectedproductCode?.ProductCodeName;
      let Clink = this.ClinkProductList.filter(item =>
        item.ProductCodeName?.toLowerCase().includes(ProductCodeName?.toLowerCase()));


      this.pushElement.ClinkProductLength= Clink[0]?.ProductCodeId
            this.pushElement.ClinkProductWidth= Clink[0]?.ProductCodeId

            if(this.pushElement.ClinkProductLength)
            {
    this.enableClink=true;
            }
            else{
              this.enableClink=false;
            }





      this.Get_Leg_values(this.tntParameterSetNo,this.selectedproductCode?.MainWireDia);



    }

    let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
    this.pushElement.Height = (this.RoundUpBy5Setp(calcValue * Number(this.pushElement.Totallinks)));

  }

}
else if(Mode=='E')
{
  

    
      this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == item.ProductCode.ProductCodeId);
      let ProductCodeName = this.selectedproductCode?.ProductCodeName;
      let Clink = this.ClinkProductList.filter(item =>
        item.ProductCodeName?.toLowerCase().includes(ProductCodeName?.toLowerCase()));


      item.ClinkProductLength.ProductCodeId= Clink[0]?.ProductCodeId
      item.ClinkProductWidth.ProductCodeId= Clink[0]?.ProductCodeId

            if(item.ClinkProductLength.ProductCodeId)
            {
    this.enableClink_edit=true;
            }
            else{
              this.enableClink_edit=false;
            }





      this.Get_Leg_values(this.tntParameterSetNo,this.selectedproductCode?.MainWireDia);



    

    let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
    this.pushElement.Height = (this.RoundUpBy5Setp(calcValue * Number(this.pushElement.Totallinks)));

  
}


    if (this.ProductTypeID == 7 && this.selectedproductCode?.MainWireSpacing == 8) {
      this.pushElement.Bc = false;
    }
    else {
      this.pushElement.Bc = true;
    }

  }
  changeFilterClinkProductCode(item: any) {

  }
  Totallinks_lostfocus(Totallinks: any) {
    if (this.pushElement.Product != null && Totallinks != "" && this.pushElement.Height !== "") {
      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == this.pushElement.Product);
      }
      //console.log(this.selectedproductCode);

      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
      this.pushElement.Height = (this.RoundUpBy5Setp(calcValue * Number(Totallinks)));
      this.pushElement.Totallinks = (Number(this.pushElement.Height) / calcValue);

    }

  }
  Heighttxt_lostfocus(columnhegightValue: any) {
    //console.log(columnhegightValue)

    if (this.pushElement.Product != null && columnhegightValue != "" && this.pushElement.Totallinks !== "") {
      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == this.pushElement.Product);
      }
      //console.log(this.selectedproductCode);


      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
      this.pushElement.Totallinks = (this.RoundUpBy5Setp(Number(columnhegightValue) / calcValue));
      this.pushElement.Height = (calcValue * Number(this.pushElement.Totallinks));
    }

  }
  EditHeighttxt_lostfocus(columnhegightValue: any, item: any, index: any) {

    //console.log(columnhegightValue)

    if (item.ProductCode != null && columnhegightValue != "" && item.TotalNoOfLinks !== "") {
      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == item.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);


      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
      item.TotalNoOfLinks = (this.RoundUpBy5Setp(Number(columnhegightValue.Text)) / calcValue);
      item.ColumnHeight = (calcValue * Number(item.TotalNoOfLinks));
    }

  }
  EditTotallinks_lostfocus(Totallinks: any, item: any, index: any) {
    if (item.ProductCode != null && Totallinks != "" && item.ColumnHeight !== "") {
      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == item.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);

      let calcValue = Number(this.selectedproductCode?.MainWireSpacing);
      item.ColumnHeight = (this.RoundUpBy5Setp(calcValue * Number(Totallinks)));
      item.TotalNoOfLinks = (Number(item.ColumnHeight) / calcValue);

    }
  }
  RoundUpBy5Setp(input: number) {
    if (input % 5 == 0)
      return input;
    else
      return input + (5 - (input % 5));

  }
  ShapeParamSubmit() {
    this.input3.nativeElement.focus();
    ////debugger;
    if(this.enableColumnEditIndex!==null)
    {
      this.Update(this.Column_Structmark,-1)
    }
    else{

      this.Submit();
    }
    //console.log(this.ShapeParamlist);

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
  ChangeShapeCode(event: any, shapeList: any) {


    this.objColumnShapeCode = this.shapeList.find((x: any) => x.ShapeID === event);
    if (this.objColumnShapeCode != null) {
      if (this.objColumnShapeCode.IsCapping == false) {
        this.pushElement.clnk = false;
      }
      else {
        this.pushElement.clnk = true;
      }
    }
    if (this.shapeList.length > 0) {

      this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === event).ShapeParam;
      console.log(this.ShapeParamlist)

//debugger;
      if(this.LegValues && this.ShapeParamlist[this.ShapeParamlist.length-1].ParameterName=="Leg")
      {
this.ShapeParamlist[this.ShapeParamlist.length-1].ParameterValue = this.LegValues;
      }

      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      this.loadMainFile(this.Imagename);
      //console.log(this.ShapeParamlist);

    }

    if (localStorage.getItem("column_top")) {
      this.top = parseInt(localStorage.getItem("column_top")!)
    }
    if (localStorage.getItem("column_right")) {
      this.right = parseInt(localStorage.getItem("column_right")!)
    }
    this.shapeSelected = true;
    // this.showImage = true;

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
  // ProductMarkingGrid_rowLoading(productMark: any) {
  //   if (productMark.BOMIndicator == "U") {
  //     //e.Row.Background = new SolidColorBrush(new Color { A = 255, R = 0, G = 191, B = 255 });
  //   }

  //   if ((productMark.ProductionMO1 <= 0) || (productMark.ProductionMO2 <= 0) || (productMark.ProductionCO1 <= 0) || (productMark.ProductionCO2 <= 0)) {
  //     this.ProductValidatorDescription = "Production Over Hang is Zero";
  //     //e.Row.Background = new SolidColorBrush(new Color { A = 255, R = 255, G = 0, B = 0 });
  //   }

  //   if ((productMark.MO1 <= 0) || (productMark.MO2 <= 0) || (productMark.CO1 <= 0) || (productMark.CO2 <= 0)) {
  //     this.ProductValidatorDescription = "Detailing Over Hang is Zero";
  //     // e.Row.Background = new SolidColorBrush(new Color { A = 255, R = 255, G = 0, B = 0 });
  //   }

  //   switch (productMark.ProductValidator) {
  //     case 1:
  //       {
  //         this.ProductValidatorDescription = "Detailing BOM is Missing";
  //         break;
  //       }
  //     case 2:
  //       {
  //         this.ProductValidatorDescription = "Production BOM is Missing";
  //         break;
  //       }
  //     case 3:
  //       {
  //         this.ProductValidatorDescription = "Sum of MW Spacing is not equal to Invoice CWLength";
  //         break;
  //       }
  //     case 4:
  //       {
  //         this.ProductValidatorDescription = "Sum of CW Spacing is not equal to Invoice MWLength";
  //         break;
  //       }
  //     case 5:
  //       {
  //         this.ProductValidatorDescription = "Sum of MW Spacing is not equal to Production CWLength";
  //         break;
  //       }
  //     case 6:
  //       {
  //         this.ProductValidatorDescription = "Sum of CW Spacing is not equal to Production MWLength";
  //         break;
  //       }
  //     case 7:
  //       {
  //         this.ProductValidatorDescription = "Production Pitch is Zero";
  //         break;
  //       }
  //     case 8:
  //       {
  //         this.ProductValidatorDescription = "Detailing Pitch is Zero";
  //         break;
  //       }
  //   }

  // }
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

  Submit() {

    ////debugger;
    this.expandRow = 0;
    this.isaddnewRecord = true;
    this.loading = true;
    this.groupmarkingBeamlist.push(this.pushElement);
    if (this.MeshData.VCHPRODUCTTYPE === 'PRC') {
      ////debugger;
      if (localStorage.getItem('ParentStructureMarkId') !== null) {
        this.ParentStructureMarkId = Number(localStorage.getItem('ParentStructureMarkId'));
        //console.log("ParentStructureMarkId");
        //console.log(this.ParentStructureMarkId)
      }
    }

    if (this.validateNewRecord() == 1) {
      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == this.pushElement.Product);
      }

      //console.log(this.selectedproductCode);
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductLength = this.ClinkProductList.find((x: any) => x.ProductCodeId = this.pushElement.ClinkProductLength);
      }
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductWidth = this.ClinkProductList.find((x: any) => x.ProductCodeId = this.pushElement.ClinkProductWidth);
      }
      if (this.shapeList.length > 0) {
        this.selectedShapeCode = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.Shape)

      }
      if (this.ShapeParamlist.length > 0 && this.selectedShapeCode.length > 0) {
        ////debugger;
        //console.log(this.selectedShapeCode);////.ShapeParam

      }
      ////debugger;
      //console.log(this.ColumnParameterSetNo);
      //add shapeparam in this selected shape code
      //debugger;
      const ColumnStructureobj: ColumnStructure = {
        StructureMarkingName: this.pushElement.structureMarking,
        ColumnWidth: this.pushElement.Width,
        ColumnLength: this.pushElement.Length,
        TotalNoOfLinks: this.pushElement.Totallinks,
        ProductCode: this.selectedproductCode,
        ShapeCode: this.selectedShapeCode,
        RowatLength: this.pushElement.RowatLength,
        ClinkProductLength: this.selectedClinkProductLength,
        MemberQty: this.pushElement.MemberQty,
        RowatWidth: this.pushElement.rowatwid,
        ClinkProductWidth: this.selectedClinkProductWidth,
        ColumnHeight: this.pushElement.Height,
        IsCLink: this.pushElement.clnk,
        CLOnly: this.pushElement.clonly,
        ProduceIndicator: this.pushElement.pi,
        BendingCheckInd: this.pushElement.bc,
        PinSize: Number(this.pushElement.pinsize),
        SEDetailingID: this.DetailingID,
        ParamSetNumber: this.ColumnParameterSetNo.ParameterSetNumber,
        StructureMarkId: 0,
        TotalQty: this.pushElement.TotalQty,
        ParentStructureMarkId: this.ParentStructureMarkId
      }
      this.columndetailingService.SaveColumnStructureMarking(ColumnStructureobj, this.intTopCover, this.intBottomCover, this.intLeftCover, this.intRightCover, this.LegValues, this.DetailingID, 1).subscribe({
        next: (response) => {
          ////debugger;
          //console.log('Get List')
          this.loading = true;
          //console.log(response)
          this.tosterService.success("Structure Marking added Successfully.");

        },
        error: (e) => {
          //console.log("error", e);
          this.loading = false;

          //debugger;
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
        },
        complete: () => {
          this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);
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
    this.isaddnew = false
    this.loading = false;

  }
  validateNewRecord() {
    if (this.pushElement.structureMarking !== "" && this.pushElement.Width !== "" && this.pushElement.Length !== "" && this.pushElement.Totallinks !== "" &&
      this.pushElement.Product !== "" && this.pushElement.Shape !== "" && this.pushElement.RowatLength !== "" && this.pushElement.ClinkProductLength !== "" && this.pushElement.MemberQty !== "" &&
      this.pushElement.rowatwid !== "" && this.pushElement.ClinkProductWidth !== "" && this.pushElement.Height !== "" && this.pushElement.pinsize !== "") {
      if (this.ShapeParamlist !== undefined) {
        let Index = this.ShapeParamlist.findIndex(x => x.EditFlag === true && x.ParameterValue == '');

        if (Index !== -1) {
          if (this.ShapeParamlist[Index].ParameterValue == 0) {
            return 3;
          }
        }
      } else { return 3; }

      return 1;
    }
    else {
      return 2;
    }

  }
  DeletestructureMark(StructureMarkId: any,StructureMarkingName:any) {
    this.loading = true;
    this.expandRow = StructureMarkId
    this.columndetailingService.DeleteColumnStructureMarking(StructureMarkId).subscribe({
      next: (response) => {
        //console.log(response);
        this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);
      },
      error: (e) => {
        //console.log("error", e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.tosterService.success(`Structure  marking  ${StructureMarkingName} deleted successfully.`);

      },
    });


  }
  onEdit(item: any, index: any) {
    // if(this.strIsReadOnly==='NO'){
    //   this.tosterService.warning("This record is already posted.");
    //   return;
    // }
    if (this.strIsReadOnly == "YES") {
      this.tosterService.error("Group Marking is already posted.You cannot Edit a Strucutre Marking.");
      return;
    }
    this.showImage = false;
    this.enableColumnEditIndex = index;
    this.Column_Structmark = item;
    //Assign Param Values to table Vanita
    // if (item.ColumnProducts !== undefined && item.ColumnProducts.length > 0) {
    //   let shapeparam = item.ColumnProducts[0].ParamValues;
    //   this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === item.ColumnProducts[0].ShapeCodeId).ShapeParam;

    //   ////debugger;
    //   if (shapeparam.indexOf('Leg') !== -1) {
    //     ////console.log(this.ShapeParamlist);
    //     let Paramvalue = shapeparam.substring(shapeparam.indexOf('Leg')).slice(4, shapeparam.substring(shapeparam.indexOf('Leg')).length)
    //     ////console.log(Paramvalue);
    //     this.ShapeParamlist[this.ShapeParamlist.length - 1].ParameterValue = Number(Paramvalue);
    //   }
    //   this.Imagename = "";
    //   this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
    //   this.loadMainFile(this.Imagename);

    // }
    ///////////////////////////////////////////
    let shapeParam = item.ColumnProducts[0].ParamValues;
    let shapeParam_arr = shapeParam.split(';');
    let count =0;
    this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === item.ColumnProducts[0].ShapeCodeId).ShapeParam;

    shapeParam_arr.forEach((element: any) => {
      let paramValue = element.split(':')
      this.ShapeParamlist[count].ParameterValue =paramValue[1].toString();
      console.log(paramValue[1])
      count++;
    });

    // shapeParam_arr.forEach((element: any) => {
    //   let paramValue = element.split(':')
    //   this.ShapeParamlist.forEach((parameter:any) => {
    //     if(parameter.ParameterName.toLowerCase()===paramValue[0].toLowerCase())
    //     {
    //       parameter.ParameterValue =paramValue[1].toString();

    //     }
    //   });
    //   console.log(paramValue[1])
    //   count++;
    // });

    this.loadFilterProductCode('L');
    this.loadFilterClinkProduct('L');
    this.backup_ColumnStructurelist = JSON.parse(JSON.stringify(this.ColumnStructureMarklist))



  }
  Update(ItemRow: any, index: any) {
    //console.log(ItemRow)
    this.isupdateRecord = true;
    this.expandRow = ItemRow.StructureMarkId;
    if (this.ValidateUpdateInput(ItemRow) == 1) {

      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == ItemRow.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductLength = this.ClinkProductList.find((x: any) => x.ProductCodeId == ItemRow.ClinkProductLength.ProductCodeId);
      }
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductWidth = this.ClinkProductList.find((x: any) => x.ProductCodeId = ItemRow.ClinkProductWidth.ProductCodeId);
      }
      if (this.shapeList.length > 0) {
        this.selectedShapeCode = this.shapeList.find((x: any) => x.ShapeID === ItemRow.Shape.ShapeID)

      }
      if (this.ShapeParamlist.length > 0 && this.selectedShapeCode.length > 0) {
        ////debugger;
        //console.log(this.selectedShapeCode);////.ShapeParam

      }
      ////debugger;
      //console.log(this.ColumnParameterSetNo);
      //add shapeparam in this selected shape code

      // let EditedElement = this.backup_ColumnStructurelist.find(x=>x.StructureMarkId===ItemRow.StructureMarkId);

      // let updateFlag = false;
      // if(ItemRow.StructureMarkingName !== EditedElement.StructureMarkingName || ItemRow.MemberQty !==EditedElement.MemberQty)
      // {
      
      // }
      const ColumnStructureobj: ColumnStructure = {
        StructureMarkId: ItemRow.StructureMarkId,
        StructureMarkingName: ItemRow.StructureMarkingName,
        ColumnWidth: ItemRow.ColumnWidth,
        ColumnLength: ItemRow.ColumnLength,
        TotalNoOfLinks: ItemRow.TotalNoOfLinks,
        ProductCode: this.selectedproductCode,
        ShapeCode: this.selectedShapeCode,
        RowatLength: ItemRow.RowatLength,
        ClinkProductLength: this.selectedClinkProductLength,
        MemberQty: ItemRow.MemberQty,
        RowatWidth: ItemRow.RowatWidth,
        ClinkProductWidth: this.selectedClinkProductWidth,
        ColumnHeight: ItemRow.ColumnHeight,
        IsCLink: ItemRow.IsCLink,
        CLOnly: ItemRow.CLOnly,
        ProduceIndicator: ItemRow.ProduceIndicator,
        BendingCheckInd: ItemRow.BendingCheckInd,
        PinSize: Number(ItemRow.PinSize),
        SEDetailingID: this.DetailingID,
        ParamSetNumber: this.ColumnParameterSetNo.ParameterSetNumber,
        TotalQty: ItemRow.TotalQty,
        ParentStructureMarkId: this.ParentStructureMarkId
      }
      this.loading = true;
      this.columndetailingService.UpdateColumnStructureMarking(ColumnStructureobj, this.intTopCover, this.intBottomCover, this.intLeftCover, this.intRightCover, this.intLeg, this.DetailingID, 1).subscribe({
        next: (response) => {
          ////debugger;
          //console.log(response)
          this.enableColumnEditIndex = null;
          this.showImage = false;


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
        },
        complete: () => {
          this.loading = false;
          this.isupdateRecord = false;
          this.tosterService.success("Structure Marking Updated Successfully.");
          this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);

        },
      });
    }
    else if (this.ValidateUpdateInput(ItemRow) == 3) {
      this.tosterService.warning('Please enter Value of Shape Parameter.')
    }
  }
  Reset(ItemRow: any, index: any) {
    this.ColumnStructureMarklist = JSON.parse(JSON.stringify(this.backup_ColumnStructurelist));
    this.enableColumnEditIndex = null;
    this.isupdateRecord = false;

  }
  ValidateUpdateInput(itemRow: any) {
    ////debugger;
    //console.log(itemRow);
    if (itemRow.StructureMarkingName !== "" && itemRow.ColumnWidth !== "" && itemRow.ColumnLength !== "" && itemRow.TotalNoOfLinks !== "" &&
      itemRow.ProductCode.ProductCodeId !== "" && itemRow.Shape.ShapeID !== "" && itemRow.RowatLength !== "" && itemRow.ClinkProductLength.ProductCodeId !== "" && itemRow.MemberQty !== "" &&
      itemRow.RowatWidth !== "" && itemRow.ClinkProductWidth.ProductCodeId !== "" && itemRow.ColumnHeight !== "" && itemRow.PinSize !== "") {
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

    item.StructureElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE;
    //debugger;
    let BomData: BomData = {
      StructureElement: 'Column',
      ProductMarkId: item.ProductMarkId,
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
    ////debugger;
    //console.log(this.lastElementColumn)
    if (this.ColumnStructureMarklist.length > 0) {
      let copiedObject = this.lastElementColumn?.StructureMarkingName;
      let lstchar = this.lastElementColumn?.StructureMarkingName.slice(-1);
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

      this.pushElement.structureMarking = copiedObject;
      this.pushElement.Width = this.lastElementColumn?.ColumnWidth;
      this.pushElement.Length = this.lastElementColumn?.ColumnLength;
      this.pushElement.Totallinks = this.lastElementColumn?.TotalNoOfLinks;
      this.pushElement.Product = this.lastElementColumn?.ProductCode.ProductCodeId;
      this.pushElement.Shape = this.lastElementColumn?.Shape.ShapeID;
      this.pushElement.RowatLength = this.lastElementColumn?.RowatLength;
      this.pushElement.ClinkProductLength = this.lastElementColumn?.ClinkProductLength.ProductCodeId;
      this.pushElement.MemberQty = this.lastElementColumn.MemberQty;
      this.pushElement.rowatwid = this.lastElementColumn.RowatWidth;
      this.pushElement.ClinkProductWidth = this.lastElementColumn.ClinkProductWidth.ProductCodeId;
      this.pushElement.Height = this.lastElementColumn?.ColumnHeight;
      this.pushElement.pinsize = this.lastElementColumn?.PinSize;
      this.pushElement.clnk = this.lastElementColumn?.IsCLink;
      this.pushElement.clonly = this.lastElementColumn?.CLOnly;
      this.pushElement.pi = this.lastElementColumn?.ProduceIndicator;
      this.pushElement.bc = this.lastElementColumn?.BendingCheckInd;
      // this.Get_Leg_values(this.tntParameterSetNo,this.lastElementColumn?.ProductCode?.MainWireDia);

      //console.log(this.pushElement);
      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == this.lastElementColumn?.ProductCode.ProductCodeId);
      }
      //console.log(this.selectedproductCode);
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductLength = this.ClinkProductList.find((x: any) => x.ProductCodeId = this.lastElementColumn?.ClinkProductLength.ProductCodeId);
      }
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductWidth = this.ClinkProductList.find((x: any) => x.ProductCodeId = this.lastElementColumn?.ClinkProductWidth.ProductCodeId);
      }
      if (this.shapeList.length > 0) {
        this.selectedShapeCode = this.shapeList.find((x: any) => x.ShapeID === this.lastElementColumn.Shape.ShapeID);
      }
      if (this.selectedShapeCode) {
        //debugger;

        this.objColumnShapeCode = this.shapeList.find((x: any) => x.ShapeID === this.lastElementColumn.Shape.ShapeID);
        if (this.objColumnShapeCode != null) {
          if (this.objColumnShapeCode.IsCapping == false) {
            this.pushElement.clnk = false;
          }
          else {
            this.pushElement.clnk = true;
          }
        }
        if (this.shapeList.length > 0) {

          this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === this.lastElementColumn.Shape.ShapeID).ShapeParam;

          this.Imagename = "";
          this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
          this.loadMainFile(this.Imagename);
          //console.log(this.ShapeParamlist);

        }
      }      // this.shapeParameter = event;

      this.shapeSelected = true;
    }
    else {


      this.pushElement.structureMarking = "1";
      this.pushElement.Width = 200;
      this.pushElement.Length = 600;
      this.pushElement.Totallinks = 20;
      this.pushElement.Product = 222;// this.lastElementColumn?.ProductCode.ProductCodeId;
      this.pushElement.Shape = 6;//this.lastElementColumn?.Shape.ShapeID;
      this.pushElement.RowatLength = 1;
      this.pushElement.ClinkProductLength = 154; //this.lastElementColumn?.ClinkProductLength.ProductCodeId;
      this.pushElement.MemberQty = 1;
      this.pushElement.rowatwid = 0;
      this.pushElement.ClinkProductWidth = 154;// this.lastElementColumn.ClinkProductWidth.ProductCodeId;
      this.pushElement.Height = 1000;
      this.pushElement.pinsize = 32;
      this.pushElement.clnk = true//this.lastElementColumn?.IsCLink;
      this.pushElement.clonly = false; this.lastElementColumn?.CLOnly;
      this.pushElement.pi = true;
      this.pushElement.bc = true;

      //console.log(this.pushElement);
      if (this.ColumnProductList.length > 0) {
        this.selectedproductCode = this.ColumnProductList.find((x: any) => x.ProductCodeId == this.pushElement.Product);
      }
      //console.log(this.selectedproductCode);
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductLength = this.ClinkProductList.find((x: any) => x.ProductCodeId = this.pushElement.ClinkProductLength);
      }
      if (this.ClinkProductList.length > 0) {
        this.selectedClinkProductWidth = this.ClinkProductList.find((x: any) => x.ProductCodeId = this.pushElement.ClinkProductWidth);
      }
      if (this.shapeList.length > 0) {
        this.selectedShapeCode = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.Shape);
      }

      this.objColumnShapeCode = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.Shape);

      console.log("Vanita Column Int");
      console.log(this.selectedShapeCode);

      if (this.objColumnShapeCode != null) {
        if (this.objColumnShapeCode.IsCapping == false) {
          this.pushElement.clnk = false;
        }
        else {
          this.pushElement.clnk = true;
        }
      }
      if (this.shapeList.length > 0) {

        this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.Shape).ShapeParam;

        this.Imagename = "";
        this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
        this.loadMainFile(this.Imagename);
        console.log(this.ShapeParamlist);
        //console.log(this.ShapeParamlist);

      }
      // this.shapeParameter = event;

      this.shapeSelected = true;


    }
    this.Get_Leg_values(this.tntParameterSetNo,this.lastElementColumn?.ProductCode?.MainWireDia);

  }

  LoadShapeParam() {
    //debugger;
    if (this.shapeList.length > 0) {
      // this.selectedShapeCode = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.Shape);
      // this.ShapeParamlist = this.shapeList.find((x: any) => x.ShapeID === this.pushElement.Shape).ShapeParam;

      if(this.LegValues && this.ShapeParamlist[this.ShapeParamlist.length-1].ParameterName=="Leg")
      {
        this.ShapeParamlist[this.ShapeParamlist.length-1].ParameterValue = this.LegValues;
      }

      this.Imagename = "";
      this.Imagename = this.ShapeParamlist[0].ShapeCodeImage.trim();
      if (localStorage.getItem("column_top")) {
        this.top = parseInt(localStorage.getItem("column_top")!)
      }
      if (localStorage.getItem("column_right")) {
        this.right = parseInt(localStorage.getItem("column_right")!)
      }
      this.loadMainFile(this.Imagename);
      console.log(this.ShapeParamlist);
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

  Report_Click() {

    if(this.ProductTypeID==4)
    {
      console.log("this.ProductTypeID",this.ProductTypeID);
    this.strQueryString = "http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fCABGroupMarkingReport&rs:Command=Render&";
    this.strQueryString = this.strQueryString + "intGroupMarkingId=" + this.IntGroupMarkId + "&sitProductTypeId="+this.ProductTypeID+"&rc:Parameters=false ";
    }
    else
    {
      console.log("this.ProductTypeID",this.ProductTypeID);
      this.strQueryString = environment.ReportUrl;
      this.strQueryString = this.strQueryString + "intGroupMarkingId=" + this.IntGroupMarkId + "&sitProductTypeId="+this.ProductTypeID+"&bitSummaryReport=" + 0 + "&rc:Parameters=false ";
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

  shapeParameterGrid_KeyDown(ShapeParamlist: any, item: any, index: any) {
    this.i = 0;
    this.j = 1;
    this.mainWireTotal = 0;
    this.crossWireTotal = 0;
    let lastIndex = 0;
    let rowIndex = 0;


  }

  Get_Leg_values(tntParameterSet:any,ProductCodeId:any)
  {
    this.loading=true;
    this.columndetailingService.Get_Leg_values(tntParameterSet,ProductCodeId).subscribe({
      next: (response) => {
        //debugger;
        console.log(response,"Leg Values");
      this.LegValues = response[0].SITLEG;

},
      error: (e) => {
        //debugger;
        this.loading=false;

        //console.log("error", e);
      },
      complete: () => {
        this.loading=false;
        // this.tosterService.success("Leg values get successfully");
        if(this.LegValues && this.ShapeParamlist[this.ShapeParamlist.length-1].ParameterName=="Leg")
        {
          console.log("Checking");
          this.ShapeParamlist[this.ShapeParamlist.length-1].ParameterValue = this.LegValues;
        }

      },
    });
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

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.initialX = event.clientX + this.right;
    this.initialY = event.clientY - this.top;
    this.renderer.addClass(this.el.nativeElement, 'grabbing');
    localStorage.setItem("column_top",this.top.toString());
    localStorage.setItem("column_right",this.right.toString());

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

  updateStructureMarking(event: any,item:any,Struct:any)
{
  debugger;

  if(this.strIsReadOnly==='YES')
  {
    this.tosterService.error("This Groupmark is Posted");
    this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);
    return ;

  }
  if(Struct)
  {

    if(event.target.textContent.trim().length>20)
    {
      this.tosterService.warning("Structure marking length exceeded");
      return ;
    }
    item.StructureMarkingName = event.target.textContent.trim();
  }

  else{
    item.MemberQty = event.target.textContent.trim();

  }

  this.columndetailingService.updateStructureMarking_Column(item.StructureMarkingName,item.StructureMarkId,item.MemberQty).subscribe({
    next: (response) => {

    },
    error: (e) => {
       console.log(e);
       let errorMessage = e.error;
      this.tosterService.error(errorMessage);
      this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);


    },
    complete: () => {
      this.tosterService.success("Marking has been updated.");
      this.loadColumndata(this.ProjectId, this.DetailingID, this.StructureElementId);
      
    },
  });

}

selectRow(item:any,event:MouseEvent)
  {

    let i  = this.ColumnStructureMarklist.findIndex(x=>x.StructureMarkId ===item.StructureMarkId);
   
    

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
    this.ColumnStructureMarklist.forEach(element => {
      if(element.colorRow)
      {
        this.DeletestructureMark(element.StructureMarkId,element.StructureMarkingName)
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

