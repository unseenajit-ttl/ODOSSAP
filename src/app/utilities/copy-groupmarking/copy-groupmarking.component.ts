import { ChangeDetectorRef, Component, OnInit, Input, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, find } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ToastrService } from 'ngx-toastr';
import { ProductCodeService } from 'src/app/Masters/Services/ProductCode/product-code.service';
import { ContactListService } from 'src/app/Masters/Services/ProjectContractList/contact-list.service';
import { ParametersetService } from 'src/app/ParameterSet/Services/Parameterset/parameterset.service';
import { DDL_ParameterSet } from 'src/app/Model/ddl_parameterset';
import { UtilityService } from '../Utility.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
//import { Copy_Groupmarking } from 'src/app/Model/Copy_Groupmarking';
import { LoginService } from 'src/app/services/login.service';
import { CheckGmNameComponent } from './check-gm-name/check-gm-name.component';
@Component({
  selector: 'app-copy-groupmarking',
  templateUrl: './copy-groupmarking.component.html',
  styleUrls: ['./copy-groupmarking.component.css']
})
export class CopyGroupmarkingComponent implements OnInit {

  Customerlist:any=[];
LoadingCustomerName:boolean=true;
projectList: any;
transferObject: any;
projectName: any;
customerName:any;
productcodelist:any;
structureList: any[] = [];
Contractlist:any[]=[];
ProductCodeTypeList: any;
Source!: FormGroup;
Destination!: FormGroup;
selectparameter: any = null;
ParameterSetList: DDL_ParameterSet[] = [];
isformsubmit: boolean=false;
  ProjectID_source: any;
  projectList_source: any;
  ProjectID_destination: any;
  projectList_destination: any;
  groupmarking_Source:any;
  groupmarking_Destination:any;
  Revision_Source: any;
  GroupmarkName: any;
  SelectDetailingProductCode:any;
  Initial_Value: boolean=false;
  ParameterSet:any = false;

  Enable_StructureElement:boolean=true;

  userId:any;

  Slab_Group:any[] = [4,68,69,13]
  Slab_StrList: any[]=[];

  constructor(public router: Router, 
    private changeDetectorRef: ChangeDetectorRef, 
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private tosterService: ToastrService,
    private productcodeService: ProductCodeService,
    private projectcontractlistService: ContactListService,
    private parametersetService: ParametersetService,
    private utilityservice: UtilityService,  
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private loginService: LoginService,
    private modalService: NgbModal,
    private el: ElementRef,

 
  )
  {
  
  }
  ngOnInit() {
    this.commonService.changeTitle('CopyGroupmarking | ODOS');
    this.userId = this.loginService.GetUserId()

    this.Source = this.formBuilder.group({
      customer: new FormControl('',Validators.required ),
      project: new FormControl('',Validators.required ),
      producttype: new FormControl('', Validators.required),
      structureelement: new FormControl('',Validators.required ),
      groupmarking: new FormControl('',Validators.required ),
      revision: new FormControl('',Validators.required ),
      parameterset: new FormControl('',Validators.required ),
      remarks: new FormControl('', ),
      parametervalue: new FormControl('', ),
    
    });
    
    this.Destination = this.formBuilder.group({
      customer: new FormControl('',Validators.required ),
      project: new FormControl('',Validators.required ),
      producttype: new FormControl('', Validators.required),
      structureelement: new FormControl('',Validators.required ),
      groupmarking: new FormControl('',Validators.required ),
      revision: new FormControl('',Validators.required ),
      parameterset: new FormControl('',Validators.required ),
      remarks: new FormControl('', ),
      parametervalue: new FormControl('',),
      isParameterset:new FormControl(true,)
    
    });
  
  this.GetCustomer();
  this.Source.reset();
    this.Destination.reset();
  this.reloadService.reloadCustomer$.subscribe((data) => {
    // console.log("yes yes yes ")
    debugger;
    this.Source.reset();
    this.Destination.reset();
    this.customerName =this.dropdown.getCustomerCode();
    this.Source.controls['customer'].patchValue(this.customerName);
    this.changecustomer(this.customerName,"S");
  
  });
debugger;
  this.reloadService.reload$.subscribe((data) => {      
    if (true) {    
      this.projectName = this.dropdown.getDetailingProjectId();
      debugger;
      let projectCode = (this.projectList_source.find((x: { ProjectId: any; })=>x.ProjectId===this.projectName)).ProjectCode;
      this.Source.controls['project'].patchValue(projectCode);
      this.changeproject(projectCode,'S');
      console.log("Changed  Project id="+ this.projectName)
       

      
    }
    // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
  });
  debugger;
  
  this.customerName =this.dropdown.getCustomerCode();
  this.projectName = this.dropdown.getDetailingProjectId();
 

  

 
  this.SetCustomerProject()



  this.GetProductTypeList();


  

  
  }
  GetCustomer(): void {
  debugger;
  this.commonService.GetCutomerDetails().subscribe({
    next: (response) => {
      debugger;
      this.Customerlist = response;
      console.log("Customerlist", this.Customerlist);
    },
    error: (e) => {
    },
    complete: () => {
      debugger;
      this.LoadingCustomerName = false;
      // if(this.transferObject["CustomerId"]!=undefined)
      // {
      
      //   this.customerName = this.transferObject['CustomerId'];
      // }
     
    },
  });
  }
  
  
  GetProject(customercode: any,CopyType:any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response) => {
      if(CopyType==="S")
      {
        this.projectList_source = response;
        this.projectList_destination = response;
      }
      else{
        this.projectList_destination = response;
      }
      },
    
      error: (e) => {
      },
      complete: () => {
        if (this.projectName !== undefined && this.Initial_Value) {
          debugger;
          let ProjectCode = this.projectList_source.find((x: any)=>x.ProjectId===this.projectName).ProjectCode;
          this.changeproject(ProjectCode,'S');
          this.Initial_Value=false;
          
          this.changeDetectorRef.detectChanges();
        }
        this.Initial_Value=false;
      },
    
    });
    
    
    }
  GetProductTypeList() {
    this.productcodeService.GetProductType_List().subscribe({
      next: (response) => {
        this.ProductCodeTypeList = response;
      },
      error: (e) => {
      },
      complete: () => { },
  
    });
  }
  
  changecustomer(event: any,CopyType:any): void {
    // console.log("customer id" + event)
    debugger;  
    if(CopyType==='S')
      {

        if( event!==undefined)
        {
      this.projectList_source = [];
      this.projectList_destination=[]
      this.Source.controls['project'].patchValue(undefined);
      this.Destination.controls['project'].patchValue(undefined);
      this.Destination.controls['customer'].patchValue(event);
      this.Source.controls['customer'].patchValue(event);
      this.GetProject(event,'S');
      this.GetProject(event,'D');
        }
        else{
          this.Source.reset();
          this.Destination.reset();
        }
    }
  

    if(CopyType==='D' ){

      if(event!==undefined)
      {
        this.projectList_destination = [];
        this.Destination.controls['project'].patchValue(undefined);
        this.GetProject(event,'D');

      }
      else{
        this.projectList_destination = [];
        this.Destination.controls['project'].patchValue(undefined);      }
  
    }
 
    }

  GetStructureElement() {
    this.productcodeService.GetStructureElement_Dropdown_Mesh().subscribe({
      next: (response) => {
        this.structureList = response;
      },
      error: (e) => {
      },
      complete: () => {
          this.Slab_Group.forEach(element => {
            this.structureList.forEach(element_1 => {
              if(element ===element_1.StructureElementTypeId)
              {
                this.Slab_StrList.push(element_1);
              }
            });
          });
          console.log("this.Slab_StrList",this.Slab_StrList)
       },
  
    });
  }
  
  LoadContractList(Project_code: any) {
    debugger;
    this.projectcontractlistService.GetContractList(Project_code).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.Contractlist = response;
      //  console.log("contrDBJdsajbkbkjbkjbkbkbkbbbb,,bkbk,badsasdactlist", this.Contractlist)
  
      },
      error: (e) => {
      },
      complete: () => {
       
      },
    });
  
  }
  reset(){
    this.Source.reset();
    this.Destination.reset();
    this.isformsubmit=false;
  }


  LoadParameterSetList(projectId: any) {
    debugger;

    // if (this.selectedType == 'MSH') {  //MESH
    this.parametersetService.GetParameterSetList(projectId).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.ParameterSetList = response;
        console.log("ParameterSetList", this.ParameterSetList)

      },
      error: (e) => {
      },
      complete: () => {
       
      },
    });
 

    //}


  }
  changeproject(event: any,CopyType:any) {
    debugger;
  if(CopyType==='S')
  {
    this.ProjectID_source = (this.projectList_source.find((x: any)=>x.ProjectCode===event)).ProjectId;
    this.ProjectID_destination = (this.projectList_destination.find((x: any)=>x.ProjectCode===event)).ProjectId;
    this.Destination.controls['project'].patchValue(event);
    this.Source.controls['project'].patchValue(event);

  
  
  
  }
  else{
    this.ProjectID_destination = (this.projectList_destination.find((x: any)=>x.ProjectCode===event)).ProjectId;
  }
    
  
  }

  changeStrElement(event:any,CopyType:any)
{
  debugger;
  this.Destination.controls['structureelement'].patchValue(event);

  if(CopyType==='S')
  {
    let projectid = this.ProjectID_source;
    let ProductTypeId  =  Number(this.Source.value.producttype);
    
    if(this.checkSlab(event))
    {
      this.Enable_StructureElement = false;
    }
    else{
      this.Enable_StructureElement = true;
    }
    this.get_GroupmarkingName(projectid,ProductTypeId,event,CopyType);
  }
  else{
    let projectid = this.ProjectID_destination;
    let ProductTypeId  =  Number(this.Destination.value.producttype);

    this.get_GroupmarkingName(projectid,ProductTypeId,event,CopyType);
  }
 
}

changeGroupmarking(event:any,CopyType:any)
{
  debugger;
 if(event!=undefined)
 {
  if(CopyType==='S')
  {
    let projectid = this.ProjectID_source;
    let ProductTypeId  =  Number(this.Source.value.producttype);
    let structElement  = this.Source.value.structureelement
    this.GroupmarkName = this.groupmarking_Source.find((x:any)=>x.INTGROUPMARKID === this.Source.value.groupmarking).VCHGROUPMARKINGNAME


    this.get_RevisionAndParameterSet(projectid,ProductTypeId,structElement,this.GroupmarkName,CopyType);
  }
  else{
    let projectid = this.ProjectID_destination;
    let ProductTypeId  =  Number(this.Destination.value.producttype);
    let structElement  = this.Destination.value.structureelement;

    this.get_RevisionAndParameterSet(projectid,ProductTypeId,structElement,event,CopyType);
  }
 }
 
}
get_GroupmarkingName(projectid:any,ProductTypeId:any,structElement:any,CopyType:any)
{
  debugger;
  this.utilityservice.Get_Groupmarking(projectid,ProductTypeId,structElement).subscribe({
    next: (response) => {
      debugger;
    if(CopyType==="S")
    {
      this.groupmarking_Source = response;
      // this.groupma = response;
    }
    else{
      this.groupmarking_Destination = response;
    }
    },
  
    error: (e) => {
    },
    complete: () => {
    
    },
  
  });
}
get_RevisionAndParameterSet(projectid:any,ProductTypeId:any,struElement:any,GroupmarkinName:any,CopyType:any)
{
  this.utilityservice.Get_RevisionNoandParameterSet(projectid,ProductTypeId,struElement,GroupmarkinName).subscribe({
    next: (response) => {
    if(CopyType==="S")
    {
      this.Revision_Source = response;
      this.Destination.controls['revision'].patchValue(0  );
      this.Source.controls['revision'].patchValue(this.Revision_Source[this.Revision_Source.length-1].TNTGROUPREVNO);
      this.Destination.controls['parameterset'].patchValue(this.Revision_Source[this.Revision_Source.length-1].INTPARAMETESET);
      this.Source.controls['parameterset'].patchValue(this.Revision_Source[this.Revision_Source.length-1].INTPARAMETESET);
    }
    else{
      this.groupmarking_Destination = response;
    }
    
    },
  
    error: (e) => {
    },
    complete: () => {
    
    },
  
  });
}

changeRevision(event:any)
{
  this.Destination.controls['revision'].patchValue(event);

}
changeProdType(event:any)
{
  this.Destination.controls['producttype'].patchValue(event);
  if(event!=undefined)
  {
    this.GetStructureElement()
  }

}
onCopy()
{
  debugger
  this.isformsubmit = true;

  let productType  = this.ProductCodeTypeList.find((x: any)=>x.ProductTypeID ===this.Source.value.producttype).ProductType 
  let parameterSetNo = this.Revision_Source
  if(this.Source.valid && this.Destination.valid)
  {

    let SelectedRvisionitem = this.Revision_Source.find((x: any)=>x.TNTGROUPREVNO===this.Source.value.revision);

    const CopyGroupmark:any={
      STRUCTUREELEMENTTYPEID: this.Destination.value.structureelement,
      PRODUCTTYPEID: this.Source.value.producttype,
      WBSTYPEID: 0,
      SOURCEPROJECTID: this.ProjectID_source,
      DESTPROJECTID: this.ProjectID_destination,
      SOURCEPARAMETERSETID: SelectedRvisionitem.TNTPARAMSETNUMBER,
      DESTPARAMETERSETID: this.Source.value.parameterset,
      SOURCEGROUPMARKID: SelectedRvisionitem.INTGROUPMARKID,
      DESTGROUPMARKNAME: this.Destination.value.groupmarking,
      COPYFROM: this.GroupmarkName,
      WBSELEMENTIDS: '',
      ISGROUPMARKREVISION: this.Source.value.revision,
      USERID: this.userId,
      IsParameterSetCreationRequired:this.ParameterSet
    }
      
    this.utilityservice.Copy_Gropumarking(CopyGroupmark,productType).subscribe({
      next: (response) => {
    
      },
      error: (e) => {
   
        this.tosterService.error(e.error)
      },
      complete: () => {
      //  this.reset();
      // this.Destination.value.groupmarking = ""
      this.Destination.controls['groupmarking'].patchValue("");

       this.isformsubmit= false;
       this.tosterService.success("Group Marking Copied Successfully ");
      //  this.SetCustomerProject();
      },
    
    });
  }

}


SetCustomerProject()
{
  if (this.customerName !== undefined) {
                
    this.changecustomer(this.customerName,"S");
    this.Initial_Value=true; 
  
  }    
}

checkSlab(strElementId:any)
{
let result=false;
this.Slab_Group.forEach(element => {
  if(element===strElementId)
  {
    result = true;
  }
});

return result;
}
CheckGmName()
{
  let strElementId = this.Destination.value.structureelement;
 let ProductTypeID =  this.Source.value.producttype;
 let projectid = this.ProjectID_destination
 let GMname  = this.Destination.value.groupmarking
  this.utilityservice.check_Groupmarking(projectid,ProductTypeID,strElementId,GMname).subscribe({
    next: (response) => {
      if(response==1)
      {
        debugger;
this.openPopup(GMname);
      }
      if(response==0)
      {
        this.onCopy();
      }
    },
    error: (e) => {
 
      this.tosterService.error(e.error)
    },
    complete: () => {
          
    },
  
  });
}

openPopup(Gmname:any) {
  const modalRef = this.modalService.open(CheckGmNameComponent);
  modalRef.componentInstance.GmName = Gmname;

  modalRef.result.then(
    (result) => {
        if(result)
        {
          debugger;
          this.onCopy();
          // this.tosterService.success("Gm regenrated successfully ")

        }
        else{
          debugger;
          setTimeout(() => {
            // Place your code here
            const inputElement = this.el.nativeElement.querySelector('#GmName');
            if(inputElement)
            {
              inputElement.focus()
              inputElement.select();
              // this.Shapeparam.nativeElement.focus();
        
            }
          }, 100);
          this.tosterService.warning("PLease Edit the Groupmarking Name")
        }
      // Handle the returned data here
    },
    (reason) => {
      console.log(`Modal dismissed with reason: ${reason}`);
    }
  );

}   
}
