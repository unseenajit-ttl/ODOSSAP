import { ChangeDetectorRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { PRCDetailingService } from '../../MeshDetailing/PRCDetailingService';
import { ColumnDetailingService } from '../../MeshDetailing/ColumnDetailingService';

@Component({
  selector: 'app-PRCDetailing',
  templateUrl: './PRCDetailing.component.html',
  styleUrls: ['./PRCDetailing.component.css']
})
export class PRCDetailingComponent implements OnInit {

 // DetailingGroupMarkForm!: FormGroup;

  isEdit = false

  ParameterSetNo:any;
  ParameterSet:any;
  projectId:any;
  structElement: string="";
  SlabHeading: string ="Slab";
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
  addList_flag = false;
  seDetailingID:any;
  structureElementId:any;
  addList: any[] = [];
 
  pushElement:any[]= []; 
  storedObjectData:any
  MeshData:any
  //elementDetails:any[]=[];
  Queryparameterset: any;
  elementDetails: any;

  //Added by vanita
  ParameterSetList:any[]=[];
  //Added by Vanita

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    public prcdetailingService:PRCDetailingService,
    public columndetailingService:ColumnDetailingService
  
  ) {




   

console.log(this.seDetailingID);

    
    console.log(this.structureElementId)
    //console.log(this.structElement)
    debugger;
   

    // this.parameterList = [
    //   { value: 1, text: 1 },
    //   { value: 2, text: 2 },

    // ];

    this.parameterList.push({ value: this.Queryparameterset, text: this.Queryparameterset })

    // this.DetailingGroupMarkForm = this.formBuilder.group({
    //   customer: new FormControl('', Validators.required),
    //   project: new FormControl('', Validators.required),
    //   projecttype: new FormControl('', Validators.required),
    //   StructureElement: new FormControl('', Validators.required),
    //   paramterset: new FormControl('', Validators.required),
    //   Marking: new FormControl(),
    //   Product: new FormControl(),
    //   Main: new FormControl(),
    //   Cross: new FormControl(),
    //   Shape: new FormControl(),
    //   Qty: new FormControl(),
    //   Pin_Size: new FormControl(),
    // });

  }


  showDetails(item: any) {
    this.isExpand = true
    // if (this.elementDetails != null && this.elementDetails.id == item.id){
    //   this.elementDetails = null;
    //   }
    // else this.elementDetails = item;
  }


  ngOnInit() {
    debugger;

    this.storedObjectData = localStorage.getItem('MeshData');
    this.MeshData = JSON.parse(this.storedObjectData);
    this.seDetailingID = this.MeshData.INTSEDETAILINGID
    this.structElement=this.MeshData.VCHSTRUCTUREELEMENTTYPE
    this.projectId = this.MeshData.INTPROJECTID
    this.ParameterSetNo =  this.MeshData.INTPARAMETESET
    this.structureElementId = this.MeshData.INTSTRUCTUREELEMENTTYPEID;
    if (this.structureElementId == 4 || this.structureElementId == 58 || this.structureElementId == 69 || this.structureElementId == 13) {
      this.SlabHeading = this.structElement;

      //GetSlabStructureMarkingDetails

    }
     if (this.structureElementId == 2)
    {
      //this.SlabHeading = "Column";
    }
     else {
     // this.SlabHeading = "Slab";
    }
    //this.loadParameterSetDropdown();
    this.changeDetectorRef.detectChanges();   

 

  }
  changeParameter(event:any)
  {
    console.log(event);
    if (this.structureElementId == 4 || this.structureElementId == 58 || this.structureElementId == 69 || this.structureElementId == 13) {
      this.SlabHeading = this.structElement;
     // this.detailingService.Parameter_SetService.emit(event);

    }
     else if (this.structureElementId == 2)
    {
      //this.columnDetailingService.Parameter_SetService.emit(event);
    }
     else  if (this.structureElementId == 1) {
      //this.beamDetailingService.Parameter_SetService.emit(event);
    }   
   
  }

  // convenience getter for easy access to form fields
  //get f() { return this.DetailingGroupMarkForm.controls; }
  addnew() {
    this.isaddnew = !this.isaddnew;

  }
  SaveParameter() {
    this.isaddnew = !this.isaddnew;
  }
  LoadColumnParameterSet(projectID:any)
  {
    //
    let productTypeID=7
    this.columndetailingService.ColumnParameterSetbyProjIdProdType(projectID,productTypeID).subscribe({
          next: (response) => {            
             console.log(response);
             this.ParameterSetList=response; 
             console.log("column Paramter Set");
             console.log(this.ParameterSetList)  ;  
                
          },
          error: (e) => {
            console.log("error",e);
          },
          complete: () => {
           
          
         
          },
        });
  }
  // Beamstructenrty() {
  //   const ngbModalOptions: NgbModalOptions = {
  //     backdrop: 'static',
  //     keyboard: false,
  //     // centered: true,
  //     size: 'lg',


  //   }
 



  // }

  // Columnstructenrty() {
  //   const ngbModalOptions: NgbModalOptions = {
  //     backdrop: 'static',
  //     keyboard: false,
  //     // centered: true,
  //     size: 'lg',


  //   }
 


  // }
  search() {
    this.searchResult = true;
  }
  onSubmit() {

    // // stop here if form is invalid
    // if (this.DetailingGroupMarkForm.invalid) {
    //   return;
    // }

  }

  // setImg(str: string, field: any) {




  //   this.groupmarkingBeamlist[this.i][0][str] = field;

  //   this.groupmarkingBeamlist[this.i][0].editFieldName = false;





  // }

  onReset() {
   // this.DetailingGroupMarkForm.reset();
  }


  isAllCheckBoxChecked() {
    //return this.wbspostingarray.every(p => p.checked);
  }

  checkAllCheckBox(ev: any) { // Angular 9
    console.log(ev)
    this.showChild = !this.showChild;
    //this.products.forEach(x => x.checked = ev.target.checked)
  }
  // edit(index: any) { }

  // i = 0;
  // isTrue() {
  //   this.isEdit = true;
  // }

  onEditNew(item: any, str: string) {

    item.editFieldName = str;
  }
  set(item: any, str: string, field: any) {

    item[str] = field;
    item.editFieldName = false;


  }
  setImage(item: any) {
    console.log(item)
  }
  // Changeparam(event: any) {
  //   // this.shapeParameter = event;
  //   this.i = event;
  //   this.isEdit = false;
  //   this.shapeSelected = true;
  //   this.showImage = true;

  // }
  suggestionChange() {
    alert("WBS has been assigned!")
  }

  flagTrue() {
    this.flag = true;
  }

  // loadParameterSetDropdown()
  // {
  //   debugger;
  //  this.detailingService.Get_ParameterSet_dropdown(this.projectId,7).subscribe({
  //    next: (response) => {
  //      debugger;
  //      this.parameterList = response;       
  //    },
  //    error: (e) => {
  //      console.log("error",e);
  //    },
  //    complete: () => {
  //     debugger;
  //     this.ParameterSet =this.parameterList.find(x=>x.INTPARAMETESET===this.MeshData.INTPARAMETESET);
  //     console.log("This is parameter set",this.ParameterSet);
  //    },
  //  });
   
  // }
}


