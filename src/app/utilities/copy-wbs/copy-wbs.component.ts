import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductCodeService } from 'src/app/Masters/Services/ProductCode/product-code.service';
import { ContactListService } from 'src/app/Masters/Services/ProjectContractList/contact-list.service';
import { OrderService } from 'src/app/Orders/orders.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { WbsService } from 'src/app/wbs/wbs.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { copy_wbs } from 'src/app/Model/Copy_wbs';
import { UtilityService } from '../Utility.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { LoginService } from 'src/app/services/login.service';
// import { TonnageInfoComponent } from './tonnage-info/tonnage-info.component';
@Component({
  selector: 'app-copy-wbs',
  templateUrl: './copy-wbs.component.html',
  styleUrls: ['./copy-wbs.component.css']
})
export class CopyWBSComponent {

  
Customerlist:any=[];
LoadingCustomerName:boolean=true;
projectList_source:any
projectList_destination:any;transferObject: any;
projectName: any;
customerName:any;
productcodelist:any;
structureList: any[] = [];
Contractlist:any[]=[];
ProductCodeTypeList: any;

WBS1dropList_source:any
WBS1dropList_destination:any;

Source!: FormGroup;
Destination!: FormGroup;

storeyFromList:any;
storeyToList:any;

WBS1dropList:any
flag2:any;

flag_S:boolean=true;
flag_D:boolean=true;

WBS3dropList: any = [];
  ProjectCode: any;
  WBS1: any;
  WBS2: any;
  WBS2dropList: any;
  ProjectCode_Source: any;

  WBS2dropList_Source: any;
  WBS2dropList_Destination: any;
  WBS3dropList_Source: any;
  WBS3dropList_Destination: any;
  isformsubmit: boolean=false;
  ProjectID_source: any;
  ProjectID_destination: any;
  BBS_description: any;
  Initial_Value: boolean=false;
  ProductType: any;
  StructureElement: any;
  Destination_WBS_Details: any[]=[];
  Disable_Copy:boolean = false;


  userId:any;
  tonnage_message: any[]=[];
  loading:boolean=false
  constructor(public router: Router, 
  private changeDetectorRef: ChangeDetectorRef, 
  private formBuilder: FormBuilder,
  private modalService: NgbModal,public commonService: CommonService,
  private tosterService: ToastrService,
  private productcodeService: ProductCodeService,
  private projectcontractlistService: ContactListService,
  public wbsService: WbsService,
  private orderService: OrderService,
  private utilityservice: UtilityService, 
  private reloadService: ReloadService,
  private dropdown: CustomerProjectService,
  private loginService: LoginService,
)
{

}
ngOnInit() {
  this.commonService.changeTitle('CopyWbs | ODOS');
  this.userId = this.loginService.GetUserId();

  this.Source = this.formBuilder.group({
    customer: new FormControl('',Validators.required ),
    project: new FormControl('',Validators.required ),
    producttype: new FormControl('', Validators.required),
    structureelement: new FormControl('',Validators.required ),
    wbs1: new FormControl('',Validators.required ),
    wbs2: new FormControl('',Validators.required ),
    wbs3: new FormControl('', ),

 

  
  });

  this.Destination = this.formBuilder.group({
    customer: new FormControl('',Validators.required ),
    project: new FormControl('',Validators.required ),
    producttype: new FormControl('', Validators.required),
    structureelement: new FormControl('',Validators.required ),
    wbs1: new FormControl('',Validators.required ),
    stoeryfrom: new FormControl('',Validators.required ),
    wbs3: new FormControl('', ),
    stoeryto: new FormControl('',Validators.required ),
   
  });

this.GetCustomer();
this.GetProductTypeList();

this.LoadStorey();
this.reloadService.reloadCustomer$.subscribe((data) => {
  // console.log("yes yes yes ")
  debugger;
  this.Source.reset();
  this.Destination.reset();
  this.customerName =this.dropdown.getCustomerCode();
  this.Source.controls['customer'].patchValue(this.customerName);
  this.Destination.controls['customer'].patchValue(this.customerName);
  if (this.customerName !== undefined) {
           
    this.changecustomer(this.customerName,"S"); 
  }  
  

});
this.reloadService.reload$.subscribe((data) => {      
  if (true) {    
    this.projectName = this.dropdown.getDetailingProjectId();
    debugger;
    let projectCOde = (this.projectList_source.find((x: { ProjectId: any; })=>x.ProjectId===this.projectName)).ProjectCode;
    this.Source.controls['project'].patchValue(projectCOde);
    this.changeproject(projectCOde,'S');
    console.log("Changed  Project id="+ this.projectName)
    if (this.projectName !== undefined) {
                
      this.changeDetectorRef.detectChanges();
      this.projectName = this.dropdown.getDetailingProjectId();
      this.ProjectID_source = this.projectName;
      this.ProjectID_destination = this.projectName;
      this.Source.controls['customer'].patchValue(this.customerName);
      let projectCode = (this.projectList_source.find((x: { ProjectId: any; })=>x.ProjectId===this.projectName)).ProjectCode;
      this.Source.controls['project'].patchValue(projectCode);
      this.Destination.controls['project'].patchValue(projectCode);
      
      this.changeDetectorRef.detectChanges();
    }      

    
  }
  // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
});
// this.LoadPart();
debugger;
this.customerName =this.dropdown.getCustomerCode();
 
this.SetCustomerProject();


}
  LoadPart() {
    const A=0;
    this.orderService.GetWBS3Multiple(A).subscribe({
      next: (response) => {
        this.WBS3dropList = response;
        console.log("WBS3dropList", response)
      },
      error: (e) => {
      },
      complete: () => {
        // this.loading = false;

      },
    });
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
      debugger;
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

      if(this.Initial_Value)
      {
      this.changeDetectorRef.detectChanges();
      this.projectName = this.dropdown.getDetailingProjectId();
      this.ProjectID_source = this.projectName;
      this.ProjectID_destination = this.projectName;
      this.Source.controls['customer'].patchValue(this.customerName);
      let projectCode = (this.projectList_source.find((x: { ProjectId: any; })=>x.ProjectId===this.projectName)).ProjectCode;
      this.Source.controls['project'].patchValue(projectCode);
      this.Destination.controls['project'].patchValue(projectCode);
      this.Initial_Value=false;
}
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
    this.projectList_source = [];
    this.projectList_destination=[]
    this.Source.controls['project'].patchValue(undefined);
    this.Destination.controls['project'].patchValue(undefined);
    this.Destination.controls['customer'].patchValue(event);
    this.GetProject(event,'S');
  
  }
  else{
    this.projectList_destination = [];
    this.Destination.controls['project'].patchValue(undefined);

    this.GetProject(event,'D');
  }
  }
changeproject(event: any,CopyType:any) {
debugger;

if(CopyType==='S')
{
  this.ProjectCode_Source =  event;
  this.ProjectID_source = (this.projectList_source.find((x: any)=>x.ProjectCode===event)).ProjectId;

  // this.GetWBS1Multiple(event,CopyType)

}
if(CopyType==='D')
{
  this.ProjectCode_Source =  event;
  this.ProjectID_destination = (this.projectList_destination.find((x: any)=>x.ProjectCode===event)).ProjectId;
  if(this.Destination.value.producttype && this.Destination.value.structureelement )
  {

    this.Get_DestinationWBS1(this.ProjectID_destination,this.Destination.value.producttype,this.Destination.value.structureelement,1);
  }

  // this.GetWBS1Multiple(event,CopyType) 
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
LoadStorey(): void {

  this.wbsService.GetWbsStorey().subscribe({
    next: (response) => {
      this.storeyFromList = response;
      this.storeyToList = response;
    },

    error: (e) => {
    },

    complete: () => {
    },
  });
}
 changewbs1Source(event: any,CopyType:any) {
  this.WBS1 = event;
  this.WBS2dropList = [];
  let productType =  this.Source.value.producttype;
  let Project = this.Source.value.project;
  let structureElement = this.Source.value.structureelement;
  this.WBS3dropList_Source=[];
  this.WBS2dropList_Source=[];
  this.Source.controls['wbs2'].patchValue(undefined);
  this.Source.controls['wbs3'].patchValue(undefined);

  this.Get_SourceWBS2(Project,this.ProductType,this.StructureElement,event,10)
}

changewbs2(event: any,CopyType:any) {
  this.WBS2 = event;

  debugger
  console.log("WBS2", this.WBS2)

  this.WBS3dropList = [];
  let productType =  this.Source.value.producttype;

  let Project = this.Source.value.project;
  let structureElement = this.Source.value.structureelement
  this.WBS3dropList_Source=[];
  this.Source.controls['wbs3'].patchValue(undefined);
  this.Get_SourceWBS3(Project,this.ProductType,this.StructureElement,this.WBS1,this.WBS2,10);
}

GetWBS3Multiple(ProjectCode:any,Copytype:any) {
 debugger;
  let obj = {
    // ProjectCode: this.ProjectCode,
    ProjectCode:"0000113914",

    
    WBS1: [
      this.WBS1
    ],
    WBS2: [this.WBS2]

  }

  this.orderService.GetWBS3Multiple(obj).subscribe({
    next: (response) => {
      debugger;
      // this.WBS3dropList = response;
      // console.log("WBS3dropList", response)
      if(Copytype==='S')
      {
        this.WBS3dropList_Source = response ;

      }
      else{
        this.WBS3dropList_Destination = response ;

      }
    },
    error: (e) => {
    },
    complete: () => {
      // this.loading = false;

    },
  });
}

GetWBS2Multiple(ProjectCode:any,Copytype:any) {
 debugger;
  let obj = {
    // ProjectCode: ProjectCode,
    ProjectCode:"0000113914",

    WBS1: [
      this.WBS1
    ],
    WBS2: [
      "string"
    ]
  }

  this.orderService.GetWBS2Multiple(obj).subscribe({
    next: (response) => {
      debugger;
      if(Copytype==='S')
      {
        this.WBS2dropList_Source = response.WBS2  ;

      }
      else{
        this.WBS2dropList_Destination = response.WBS2 ;

      }
      console.log("WBS2dropList", response)
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
}
onCopy()
{
  debugger
  this.isformsubmit = true;

  // if(this.Disable_Copy)
  // {
  //   this.tosterService.warning("Please select proper WBS 1/2/3")
  //   return ;
  // }

  if(this.Source.valid && this.Destination.valid)
  {
    // let BBSElement = this.BBS_description.find((x: { BBS_DESC: any; })=>x.BBS_DESC===this.Source.value.bbsdesc);
    
    let WBS1 = this.Destination.value.wbs1;
    let stoeryFrom =  this.Destination.value.stoeryfrom;
    let stoeryto = this.Destination.value.stoeryto;

    let WBS3 = this.Destination.value.wbs3;
    let productType = this.Destination.value.producttype
    let structureElement = this.Destination.value.structureelement;


    // this.GetPostedQuantityandTonnageByWBSDetails(this.ProjectID_destination,productType,structureElement,WBS1,stoeryFrom,WBS3,0,this.BBS_description[0].INTPOSTHEADERID);

    this.GetDestinationWbsDetails(this.ProjectID_destination,productType,structureElement,WBS1,stoeryFrom,stoeryto,WBS3,1);  

  
  }

}

async changeWBS3(wbs3:any,CopyType:any)
{
  debugger;
  let WBSTypeId = 0;
 
  if(CopyType==='S')
  {
    let projectid = this.ProjectID_source;
    let ProductTypeId  =  Number(this.Source.value.producttype);
    let structElement  = this.Source.value.structureelement;
    let wbs1 =  this.Source.value.wbs1;
    let wbs2 =  this.Source.value.wbs2;
    let wbs3 =  this.Source.value.wbs3;
    
    this.BBS_description = await this.GetBBSDescription_Wrapper(projectid,ProductTypeId,structElement,wbs1,wbs2,wbs3,WBSTypeId);
    console.log("this.BBS_description",this.BBS_description);

    let tntStatId_S = 0;
    let tntStatId_D = 0;

    if(this.BBS_description.length==0)
    {
      // this.Disable_Copy = true;
      this.flag_S = true;
      this.tosterService.warning("No WBS for selected Part ")
      return ;

    }
    if((this.BBS_description[0].tntStatusId===3 || this.BBS_description[0].tntStatusId===12 ))
    {
      // this.Disable_Copy = false;
      this.flag_S=false;

    }
    else{
      this.tosterService.warning(`${wbs1}/${wbs2}/${wbs3} is not posted or released ,  please check `);
      this.flag_S=true;


    }
    // this.flag2 = this.Disable_Copy;
  
  }
  
  else{


    let projectid = this.ProjectID_destination;
    let ProductTypeId  =  Number(this.Destination.value.producttype);
    let structElement  = this.Destination.value.structureelement;
    let wbs1 =  this.Destination.value.wbs1;
    let wbs2From =  this.Destination.value.stoeryfrom;
    let wbs2To =  this.Destination.value.stoeryto;

    let wbs3 =  this.Destination.value.wbs3;

    if(wbs2From===wbs2To)
    {
          let bbsDesc = await this.GetBBSDescription_Wrapper(projectid,ProductTypeId,structElement,wbs1,wbs2From,wbs3,WBSTypeId);
          if(bbsDesc.length==0)
          {
            this.flag_D = true;
            
            this.tosterService.warning("No WBS for selected Part ")
            return ;
      
          }
          if(bbsDesc[0].tntStatusId===3 || bbsDesc[0].tntStatusId===12)
          {
            this.tosterService.warning(`${wbs1}/${wbs2From.toString()}/${wbs3} is already posted or released, please check `);
            this.flag_D = true;
      
          }
          else{
            this.flag_D = false;      
          }


    }
    else{
      // let flag=false;
      // if(this.flag2==false)
      // this.Disable_Copy = false;
      let intoIf = false;

      for(let i=Number(wbs2From);i<=Number(wbs2To);i++)
      {
        let bbsDesc = await this.GetBBSDescription_Wrapper(projectid,ProductTypeId,structElement,wbs1,i.toString(),wbs3,WBSTypeId);

        if(bbsDesc.length==0)
        {
          this.flag_D = true;
          intoIf = true;
          this.tosterService.warning("No WBS for selected Part ")
          return ;
    
        }
        if(bbsDesc[0].tntStatusId===3 || bbsDesc[0].tntStatusId===12) {

           this.tosterService.warning(`${wbs1}/${i.toString()}/${wbs3} is already posted or released,  please check`);
           this.flag_D = true;
           intoIf = true;
          // flag= true;
          // break;
        }
        // else{
        //   flag = false;
        //   // this.Disable_Copy = false;
        // }

      }
      if(intoIf==false)
      this.flag_D=false;
      // this.Disable_Copy = flag;
      
    }



  

  }

}


GetBBSDescription(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,wbs3:any,WBSTypeId:any)
{
  debugger;
  this.utilityservice.Get_BBSDescription(projectid,ProductTypeId,structElement,wbs1,wbs2,wbs3,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
      this.BBS_description = response;
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {
    
    },
  
  });
}
// GetPostedQuantityandTonnageByWBSDetails(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,wbs3:any,WBSTypeId:any,intPostheaderId:any)
// {
//   debugger;
//   this.utilityservice.Get_PostedQuantityandTonnageByWBSDetails(projectid,ProductTypeId,structElement,wbs1,wbs2,wbs3,WBSTypeId,intPostheaderId).subscribe({
//     next: (response) => {
//     debugger;
//       this.tonnage_message = response
//       // this.groupma = response;
    
    
//     },
  
//     error: (e) => {
//     },
//     complete: () => {
//     this.openPopup();
//     },
  
//   });
// }

async  GetBBSDescription_Wrapper(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,wbs3:any,WBSTypeId:any):Promise<any>
{
  try {
    var a  = await  this.utilityservice.Get_BBSDescription(projectid,ProductTypeId,structElement,wbs1,wbs2,wbs3,WBSTypeId).toPromise();
    return a;
  } catch (error) {
    return error;
  }
}


Get_SourceWBS1(projectid:any,ProductTypeId:any,structElement:any,WBSTypeId:any)
{
  debugger;
  this.utilityservice.Get_WBS1(projectid,ProductTypeId,structElement,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
    
      this.WBS1dropList_source = response;
      console.log("WBS1",this.WBS1dropList_source);
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {
    
    },
  
  });
}
Get_SourceWBS2(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,WBSTypeId:any)
{
  this.utilityservice.Get_WBS2(projectid,ProductTypeId,structElement,wbs1,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
      this.WBS2dropList_Source = response;
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {
    
    },
  
  });
}
Get_SourceWBS3(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,WBSTypeId:any)
{
  this.utilityservice.Get_WBS3(projectid,ProductTypeId,structElement,wbs1,wbs2,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
      this.WBS3dropList_Source = response;
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {

      let obj = {
        WBS3:''
      }
      this.WBS3dropList_Source.push(obj);

      this.WBS3dropList_Source[this.WBS3dropList_Source.length-1].WBS3 = ''
    },
  
  });
}
changestructureElement(event:any)
{
  debugger;
 let productType =  this.Source.value.producttype;
 this.Destination.controls['structureelement'].patchValue(event);
 let Project = this.Source.value.project;
 this.WBS1dropList_source=[];
 this.WBS1dropList_destination=[];
 this.WBS2dropList_Destination=[];
 this.WBS3dropList_Destination=[];
 this.WBS3dropList_Source=[];
 this.WBS2dropList_Source=[];
 this.WBS2dropList_Source=[];
 this.Destination.controls['wbs1'].patchValue(undefined);
 this.Destination.controls['stoeryfrom'].patchValue(undefined);
 this.Destination.controls['stoeryto'].patchValue(undefined);
 this.Destination.controls['wbs3'].patchValue(undefined);
 this.Source.controls['wbs1'].patchValue(undefined);
 this.Source.controls['wbs2'].patchValue(undefined);
 this.Source.controls['wbs3'].patchValue(undefined);


 
 this.StructureElement=this.structureList.find(x=>x.StructureElementTypeId===event).StructureElementType
this.Get_SourceWBS1(Project,this.ProductType,this.StructureElement,10);
this.Get_DestinationWBS1(this.ProjectID_destination,productType,event,1);

}
changeProd(event:any)
{
  debugger;
  this.structureList = [];
  this.Destination.controls['producttype'].patchValue(event);
  this.ProductType=this.ProductCodeTypeList.find((x: { ProductTypeID: any; })=>x.ProductTypeID===event).ProductType
if(event!=undefined)
{
  this.GetStructureElement();
}
}
changeBlock_destination(event:any)
{
  
  let productType =  this.Source.value.producttype;
  // let wbs1 = this.Source.value.wbs1;
  let structureElement = this.Source.value.structureelement;

 this.WBS2dropList_Destination=[];
 this.WBS3dropList_Destination=[];


 this.Destination.controls['stoeryfrom'].patchValue(undefined);
 this.Destination.controls['stoeryto'].patchValue(undefined);
 this.Destination.controls['wbs3'].patchValue(undefined);


 this.Get_DestinationWBS2(this.ProjectID_destination,productType,structureElement,event,1);

 

  // this.Get_DestinationWBS2(this.ProjectID_destination,productType,structureElement,event,10);
}

changeStoery_destination(event:any)
{
  debugger;
  this.WBS3dropList_Destination=[];
  this.Destination.controls['wbs3'].patchValue(undefined);
  if(this.Destination.value.stoeryfrom && this.Destination.value.stoeryto)
  {
    let productType =  this.Source.value.producttype;
  let structureElement = this.Source.value.structureelement;
  let wbs1 = this.Destination.value.wbs1;



 

  this.Get_DestinationWBS3(this.ProjectID_destination,productType,structureElement,wbs1,this.Destination.value.stoeryfrom,1);



  }
}
Get_DestinationWBS1(projectid:any,ProductTypeId:any,structElement:any,WBSTypeId:any)
{
  debugger;
  this.utilityservice.Get_CopyWBS1(projectid,ProductTypeId,structElement,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
    
      this.WBS1dropList_destination = response;
      
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {
    
    },
  
  });
}
Get_DestinationWBS2(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,WBSTypeId:any)
{
  this.utilityservice.Get_CopyWBS2(projectid,ProductTypeId,structElement,wbs1,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
      this.WBS2dropList_Destination = response;
      console.log(this.WBS2dropList_Destination)
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {
    
    },
  
  });
}
Get_DestinationWBS3(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,WBSTypeId:any)
{
  this.utilityservice.Get_CopyWBS3(projectid,ProductTypeId,structElement,wbs1,wbs2,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
      this.WBS3dropList_Destination = response;
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {

      
      // let obj = {
      //   WBS3:''
      // }
      // this.WBS3dropList_Destination.push(obj);
        // this.WBS3dropList_Destination[this.WBS3dropList_Destination.length-1].WBS3 = '' 
    },
  
  });
}

GetDestinationWbsDetails(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbsFrom:any,wbsTo:any,wbs3:any,WBSTypeId:any)
{
  debugger;
  this.utilityservice.GetDestWBSDetails(projectid,ProductTypeId,structElement,wbs1,wbsFrom,wbsTo,wbs3,WBSTypeId).subscribe({
    next: (response) => {
    debugger;
      this.Destination_WBS_Details=response;
      console.log("Destination WBS",this.Destination_WBS_Details);
      // this.groupma = response;
    
    
    },
  
    error: (e) => {
    },
    complete: () => {
    this.CopyWBSDetailing();
    },
  
  });
}

CopyWBSDetailing()
{
this.loading =true;
  let BBSElement=this.BBS_description[0];

  let WBSElementsIds=''
  let BBSNos=''
  let BBSDesc = ''


  this.Destination_WBS_Details.forEach(element => {
    WBSElementsIds+=element.INTWBSELEMENTID + ',';	
    BBSNos+='AUTOBBS' +','
    BBSDesc+='AUTOBBS' +','
  });
  const wbs_copy:copy_wbs={
    DESTPROJECTID: this.ProjectID_destination,
    STRUCTUREELEMENTTYPEID: Number(this.Source.value.structureelement) ,
    PRODUCTTYPEID: Number(this.Source.value.producttype),
    WBSTYPEID: 0,
    SOURCEPOSTHEADERID: BBSElement.INTPOSTHEADERID,
    DESTWBSELEMENTIDS: WBSElementsIds,
    BBSNOS: BBSNos,  
    BBSDESCS: BBSDesc,
    USERID:this.userId
  }
  this.utilityservice.Copy_WBS(wbs_copy).subscribe({
    next: (response) => {
  
    },
    error: (e) => {
 console.log(e);
 this.loading =false;

 
    },
    complete: () => {
      this.isformsubmit = false;
      this.loading =false;

    //  this.reset();
    this.Source.controls['wbs3'].patchValue(undefined);
    this.Destination.controls['wbs3'].patchValue(undefined);
    

    //  this.SetCustomerProject();
     this.tosterService.success("WBS Copied Successfully");
    },
  
  });
}

SetCustomerProject()
{
  if (this.customerName !== undefined) {
                
    this.changecustomer(this.customerName,"S");
    this.changecustomer(this.customerName,"D");
    this.Initial_Value=true; 
  
  }    
}
// openPopup() {
//   const modalRef = this.modalService.open(TonnageInfoComponent);
//   modalRef.componentInstance.title = 'Tonnage Information';
//   modalRef.componentInstance.tonnage_message = this.tonnage_message;

//   modalRef.result.then(
//     (result) => {
  
//       // Handle the returned data here
//     },
//     (reason) => {
//       console.log(`Modal dismissed with reason: ${reason}`);
//     }
//   );

// }   
}
