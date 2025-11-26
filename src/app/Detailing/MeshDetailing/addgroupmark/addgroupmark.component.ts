import { Component, OnInit, Input, EventEmitter, Output, DebugElement } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { ADD_NewGroupMarkModel } from 'src/app/Model/Add_NewGroupMarkModel';
import { DDL_ParameterSet } from 'src/app/Model/ddl_parameterset';
import { GroupMarkingGridlist } from 'src/app/Model/groupmarking_gridlist';
import { parameterSetResponse } from 'src/app/Model/ParameterSetRespose';
import { BorePileService } from 'src/app/ParameterSet/Services/BPC/bore-pile.service';
import { DrainParameterSetService } from 'src/app/ParameterSet/Services/Drain/drain-parameter-set.service';
import { ParametersetService } from 'src/app/ParameterSet/Services/Parameterset/parameterset.service';
import { WbsService } from 'src/app/wbs/wbs.service';
import { DetailingService } from '../../DetailingService';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-addgroupmark',
  templateUrl: './addgroupmark.component.html',
  styleUrls: ['./addgroupmark.component.css']
})

export class GroupMarkComponent implements OnInit {
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  
  groupmarkForm!: FormGroup;
  @Input() ProjectID: any;
  @Input () CustomerID:any;
  @Input () ProjectName:any;
  @Input () CustomerName:any;
  @Input () ProjectCode:any;
  @Input () productType:any;
  @Input () structElement:any;
  @Input () tntParameterSetNumber:any;
  


  @Input() formname: any;
  @Input() groupmarkdata: any = null;
  userProfile: any
  disableSubmit: boolean = false
  isaddnew: boolean = false
  selectedItems: any = []
  groupmarkList: any = [];
  parameterList: any = [] = [];
  producttypeList: any = [];
  structureList: any = [];
  selectedproducttype: any;
  newParam: any;
  slectedStructElement: any;
  selectparameter: any;
  ParameterSetList: any[] = [];
  intGroupMarkId: number = 0;
  loading=false;
  groupmarkinglist: GroupMarkingGridlist[] = [];
  transferObject: any
  selectedGroupMark:any;
  Drain_WM_width: any;
  selectedDrainType:any;
  isBPC:boolean =false;
  userId:any;


  constructor(public activeModal: NgbActiveModal, public router: Router,
    private modalService: NgbModal, private formBuilder: FormBuilder,
    public wbsService: WbsService, public detailingService: DetailingService,
    private drainService: DrainParameterSetService,
    private tosterService: ToastrService,
    private loginService: LoginService,
    private BPCService:BorePileService) { }

   ngOnInit(): void {


        this.userId = this.loginService.GetUserId()

    this.groupmarkForm = this.formBuilder.group({
      groupmark: ['', Validators.required],
      ProductType: ['', Validators.required],
      StructElement: ['', Validators.required],
      parameterset: ['', Validators.required],
      remark: ['']

    });
    this.GetProductType();
    this.GetStructElement();


  }
  GetProductType(): void {
    this.wbsService.GetProductType().subscribe({
      next: (response) => {
        this.producttypeList = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  GetStructElement(): void {
    this.wbsService.GetStructElement()
      .subscribe({
        next: (response) => {
          this.structureList = response;
        },
        error: (e) => {
          //console.log(e.error);
        },
        complete: () => {
          this.selectedproducttype = this.productType
          this.ChangeProductType(this.selectedproducttype);
          this.slectedStructElement = this.structElement;

          this.ChangeStruct(this.slectedStructElement);

        },
      });
  }

  ChangeProductType(event: any) {
if(event==9)
{
  this.slectedStructElement = 8
  this.isBPC=true;


    this.LoadParameterSetList_BPC(this.ProjectID);

}
else
{
  this.slectedStructElement = undefined;
  this.isBPC=false;
}
  }
  ChangeStruct(event: any) {
    if(event===5)
    {
      this.LoadParameterSetList_drain(this.ProjectID);
    }

    else{

      this.LoadParameterSetList(this.ProjectID, this.selectedproducttype, event)
    }

  }
  LoadParameterSetList(projectId: any, ProductTypeId: any, StructElement: any) {
    debugger;

    if (StructElement === 4 || StructElement === 6 || StructElement === 68 || StructElement === 69 || StructElement === 13) {

      // ParameterSetNumber--TNTPARAMSETNUMBER
      // ParameterSetValue---INTPARAMETESET
      this.detailingService.GetSlabParameterSetbyProjIdProdType(projectId, ProductTypeId).subscribe({
        next: (response) => {
          console.log(response);
          const newArray = response.map((o: { TNTPARAMSETNUMBER: any; INTPARAMETESET: any; }) => {
            return { ParameterSetNumber: o.TNTPARAMSETNUMBER, ParameterSetValue: o.INTPARAMETESET };
          });
          this.ParameterSetList = newArray;
          this.selectparameter = Number( this.ParameterSetList.slice(-1)[0].ParameterSetNumber);
          console.log( this.selectparameter)


        },
        error: (e) => {
        },
        complete: () => {

          if(this.tntParameterSetNumber)
          {
            this.selectparameter = this.tntParameterSetNumber
          }
          else{
            this.selectparameter = this.ParameterSetList[this.ParameterSetList.length-1].tntParamSetNumber
  
          }
        },
      });

    }
    else if (StructElement === 1) {
      //Beam
      this.detailingService.BeamParameterSetbyProjIdProdType(projectId, ProductTypeId).subscribe({
        next: (response) => {
          console.log(response);
          debugger;
          this.ParameterSetList = response;
          this.selectparameter =Number(  this.ParameterSetList.slice(-1)[0].ParameterSetNumber);
        //  console.log("ParameterSetList", this.ParameterSetList)
          console.log( this.selectparameter)
        },
        error: (e) => {
        },
        complete: () => {
          if(this.tntParameterSetNumber)
          {
            this.selectparameter = this.tntParameterSetNumber
          }
          else{
            this.selectparameter = this.ParameterSetList[this.ParameterSetList.length-1].tntParamSetNumber
  
          }
        },
      });

    }
    else if (StructElement === 2) {
      //Column
      this.detailingService.ColumnParameterSetbyProjIdProdType(projectId, ProductTypeId).subscribe({
        next: (response) => {
          console.log(response);
          debugger;
          this.ParameterSetList = response;
          this.selectparameter = Number( this.ParameterSetList.slice(-1)[0].ParameterSetNumber);
          //console.log("ParameterSetList", this.ParameterSetList);
          console.log( this.selectparameter)


        },
        error: (e) => {
        },
        complete: () => {
          if(this.tntParameterSetNumber)
          {
            this.selectparameter = this.tntParameterSetNumber
          }
          else{
            this.selectparameter = this.ParameterSetList[this.ParameterSetList.length-1].tntParamSetNumber
  
          }

        },
      });
    }

  }


  Changeparam(event: any) {
    if(this.slectedStructElement===5)
    {
      this.selectedDrainType=undefined;
      this.loadDrainWM_Width(event) ;
    }


  }

  Submit() {
    this.isaddnew = true;
    console.log(this.selectparameter);
    this.groupmarkForm.patchValue({
      parameterset: this.selectparameter,
    });
    console.log(this.groupmarkForm.value);
    this.groupmarkForm.controls['ProductType'].patchValue(this.selectedproducttype);
    this.groupmarkForm.controls['StructElement'].patchValue(this.slectedStructElement);
    let GroupmarkingName= ""
    if(this.slectedStructElement===5)
    {
GroupmarkingName = this.selectedDrainType + '-' + this.groupmarkForm.value.groupmark;
    }
    else{
      GroupmarkingName =this.groupmarkForm.value.groupmark;

    }


debugger;
if(this.slectedStructElement===5 && !(this.selectedDrainType))
{
  this.tosterService.warning('Can not add blank record.')

  return ;
}
    if (this.groupmarkForm.valid == true) {
      const newGroupMarkModel: ADD_NewGroupMarkModel = {
        GroupMarkId: 0,
        GroupMarkName: GroupmarkingName,
        GroupRevisionNumber: 0,
        ProjectId: this.ProjectID,
        WBSTypeId: 1,
        StructureElementTypeId: this.slectedStructElement,
        SitProductTypeId: this.selectedproducttype,
        ParameterSetNumber: this.selectparameter,
        transport: 0,
        IsCABOnly: this.selectedproducttype === 11 ? 1 : 0,
        CreatedUserId: this.userId,
        CreatedUserName: '',
        SiderForCode: '',
        Remarks: this.groupmarkForm.value.remark
      }
      this.detailingService.SaveGroupMark(newGroupMarkModel).subscribe({
        next: (response) => {
          console.log(response)
          this.intGroupMarkId = response;
          if(response)
          {
            this.tosterService.success("Group Mark added Successfully.");
            this.loadtabledata(this.ProjectID);
          }
        

        },
        error: (e) => {
          console.log("error", e);
          this.tosterService.error(e.error);

        },
        complete: () => {

          if(this.intGroupMarkId)
          {
            // this.modalService.dismissAll();
            // this.saveTrigger.emit(this.slectedStructElement);
          }
          else{
            
            this.tosterService.warning('Groupmark already exist.')

          }
        },
      });
    }
    else {
      this.tosterService.warning('Can not add blank record.')
    }



  }

  cancel() {
    this.modalService.dismissAll()
  }

  loadtabledata(projectId: any) {
    debugger;
    this.loading = true;
    this.detailingService.GetGroupMarkingList(projectId).subscribe({
      next: (response) => {
        debugger;
        this.groupmarkinglist = response;

        if (this.groupmarkinglist.length > 0) {
          this.selectedGroupMark = this.groupmarkinglist.find((x: any) => x.INTGROUPMARKID = this.intGroupMarkId);

        }
        if(this.selectedGroupMark)
        {
        this.transferObject = this.selectedGroupMark;
        this.transferObject['ProjectId'] = this.ProjectID;
        this.transferObject['CustomerId'] =this.CustomerID ;
        this.transferObject['ProjectName'] = this.ProjectName;
        this.transferObject['CustomerName'] =this.CustomerName;
        this.transferObject['ProjectCode'] = this.ProjectCode;
        this.transferObject['isEdit'] = false;

        localStorage.setItem('MeshData', JSON.stringify(this.transferObject));
        }



      },
      error: (e) => {
        console.log("error", e);
      },
      complete: () => {

        this.loading = false;
        if(this.selectedGroupMark)
        {
          console.log(this.router.url);
          this.modalService.dismissAll();
          // this.router.navigate(['/detailing/DetailingGroupMark']);
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([this.router.url]);
          // });
          this.saveTrigger.emit();

        }
        else{
          this.tosterService.error("Groupmark already exist")
        }
      },
    });



  }

  LoadParameterSetList_drain(projectId: any) {
    debugger;

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

        if(this.tntParameterSetNumber)
        {
          this.selectparameter = this.tntParameterSetNumber
        }
        else{
          this.selectparameter = this.ParameterSetList[this.ParameterSetList.length-1].tntParamSetNumber

        }
        this.loadDrainWM_Width(this.selectparameter)


      },
    });


    //}


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
  LoadParameterSetList_BPC(projectId: any) {
    debugger;

    // if (this.selectedType == 'MSH') {  //MESH
    this.BPCService.GetParameterSetLis_BorePile(projectId).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.ParameterSetList = response;
        console.log("ParameterSetList", this.ParameterSetList)

      },
      error: (e) => {
      },
      complete: () => {
        this.selectparameter = this.ParameterSetList[this.ParameterSetList.length-1].tntParamSetNumber;
      },
    });


    //}


  }
}
