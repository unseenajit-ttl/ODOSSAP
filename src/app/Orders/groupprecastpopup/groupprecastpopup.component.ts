import { Component, OnInit } from '@angular/core';
import {  Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { add_wbsPostingGroupmark } from 'src/app/Model/add_wbsPostingGroupmark';
import { GroupMark } from 'src/app/Model/groupmark';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { CommonService } from 'src/app/SharedServices/CommonService';

import { EditGroupMark } from 'src/app/Model/editgroupmark'
import { NgSelectComponent } from '@ng-select/ng-select';
import { OrderService } from 'src/app/Orders/orders.service';
import { PreCastDetails } from 'src/app/Model/StandardbarOrderArray';
import { WbsService } from 'src/app/wbs/wbs.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { PdfGeneratorServiceService } from 'src/app/SharedComponent/pdf-generator-service.service';

@Component({
  selector: 'app-groupprecastpopup',
  templateUrl: './groupprecastpopup.component.html',
  styleUrls: ['./groupprecastpopup.component.css']
})
export class GroupprecastpopupComponent implements OnInit{
  wbscreateForm!: FormGroup;
    @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  
    @ViewChild('groupmarkSelect') groupmarkSelect!: NgSelectComponent;
  
  
    @Input() projectId: any;
    @Input() selectedItem: any;
    @Input() wbselementId: any;
    @Input() prodttype: any;
    @Input() structure: any;
    @Input() postHeaderId: any;
    @Input() isDisablePost: any;
    
  
    
    // @Input() wbsitemdata:any;
    userProfile: any
    formsubmit: boolean = false;
    disableSubmit: boolean = false
    isaddnew: boolean = false
    selectedItems: any = [];
    disabledropdown: boolean = false;
  
    groupmarkList: any = [];
    customerList: any = [];
    projectList: any = [];
    producttypeList: any[] = [];
    structureList: any[] = [];
    enableEditIndex: any = null;
    Groupmarkinglist: any[] = [];
    groupmarkingEditlist: EditGroupMark[] = [];
  
    isEditing: boolean = false;
    loading: boolean = true;
    prev_index: any = null;
    backup_update: GroupMark = {
      GroupMark: '',
      Rev: 0,
      Qty: 0,
      Remark: '',
  
    };
     ProjectCode: any;
   CustomerCode: string = "";
   PrecastArray: PreCastDetails[] = [];
   receivedData: any = '';
   fromWbsPosting: any = '';
   JobID:any;
   CustomerName: any;
   ProjectName: any;
   StandardBarProductOrderLoading: boolean = false;
  //  groupmarkList: any[]=[];
  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;
  showPrecast = true;
showGroupMarking = true;

     constructor(
        private toastr: ToastrService, public commonService: CommonService,
        public wbsService: WbsService, public activeModal: NgbActiveModal,
        private el: ElementRef,
        private modalService: NgbModal, 
        private formBuilder: FormBuilder, 
        private orderService: OrderService,
        //  private orderService: OrderService,
            private CustomerPRoj: CustomerProjectService,
            // private commonService: CommonService,
            private createSharedService: CreateordersharedserviceService,
            private dropdown: CustomerProjectService,
            private reloadService: ReloadService,
            private pdfGenerator: PdfGeneratorServiceService,
            public modal : NgbActiveModal,
            // private wbsService:WbsService,
            // private toastr: ToastrService,
            // private modalService: NgbModal, 
       ) {
    
      }
       PrecastDetail: any='';
  ShowPrecast : boolean =false;
  // PrecastArray:PreCastDetails[]=[];
  
  ngOnInit(): void {
     this.GetGroupMarkingList();
    this.getGroupMarkingTable(this.selectedItem);   

    
    
    //console.log(this.wbsdata)
    this.wbscreateForm = this.formBuilder.group({
      customer: [''],
      project: [''],
      projecttype: [''],
      groupmark: ['', Validators.required],
      StructureElement: [''],
      rev: ['0'],
      postqty: ['1', Validators.required],
      remark: [''],
      qty: ['1'],
      remarks: [''],
    });

    // precast
      this.CustomerCode = this.CustomerPRoj.getCustomerCode();
    this.ProjectCode = this.CustomerPRoj.getProjectCode()[0];

    this.commonService.changeTitle('StandardBar | ODOS');
    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log('receivedData', this.receivedData);

    this.fromWbsPosting = localStorage.getItem('wbspostingobject');
    this.fromWbsPosting = JSON.parse(this.fromWbsPosting)
   
    if (this.fromWbsPosting) {
      this.CustomerCode = this.fromWbsPosting.CustomerCode;
      this.ProjectCode = this.fromWbsPosting.ProjectCode;
      this.JobID = this.fromWbsPosting.PostHeaderID;

        
    }

    if (this.receivedData) {
      this.CustomerCode = this.receivedData.customer;
      this.ProjectCode = this.receivedData.project;
     
    }

   

    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
     
    } else {
      // this.dropdown.setCustomerCode(this.receivedData.customer);
      // let obj: any = [];
      // obj.push(this.receivedData.project);
      // this.dropdown.setProjectCode(obj);
      // this.reloadService.reloadCreateOrderCustomerProject.emit();
      
    }

   
    this.GetCustomerName();
    this.GetProjectName();
   
  }
  
  //  importPrecast(){
  //   let flag=0;
  //   if(this.PrecastArray.length>0){
  //    for(let i=0; i< this.PrecastArray.length; i++){
  //     for(let j=0; j< this.groupmarkList.length; j++){
  //       if(this.PrecastArray[i].ComponentMarking == this.groupmarkList[j].vchGroupMarkingName){
  //         this.addtolist(this.PrecastArray[i])
  //         flag++;
  //         break;
  //       }
  //     }
  //    }
  //    if(flag==0){
  //     this.toastr.warning("No matching data found..");
  //    }
  //   }
  //   else
  //   {
  //     this.toastr.warning("No data found..");
  //   }
     
  // }

 async addtolist(item:any,GmName:any){
    let obj={
      GroupMark:GmName,
      Rev:0,
      Qty:item.Qty,
      Remark: item.Remark,
      isaddedNew: true,
      isPrecast:true
    }
    this.Groupmarkinglist.push(obj);
  }

  // GetGroupMarkingList(): void {
  //   debugger;

  //   //FOR TRIAL :-  VALUES THAT RETURN A GROUPMARKLIST
  //   // let ProjectId = 5600, WBSElementsId = 265, StructureElementId = 1, ProductTypeId = 7
  //   let ProjectId = this.projectId, WBSElementsId = this.wbselementId, StructureElementId = this.structure, ProductTypeId = this.prodttype

  //   this.wbsService.GetGroupMarkingList(ProjectId, StructureElementId, ProductTypeId).subscribe({
  //     next: (response) => {
  //       this.groupmarkList = response;
  //     },
  //     error: (e) => {
  //     },
  //     complete: () => {
  //       this.loading = false
  //       this.importPrecast()
  //     },
  //   });
  // }


  changecustomer(event: any): void {
    this.GetProject(event);
  }
  changeproject(event: any): void {
    debugger;
    let temp_ProjectId = event
    this.groupmarkList = []
    this.wbsService.GetGroupMarkingList(temp_ProjectId, this.structure, this.prodttype).subscribe({
      next: (response) => {
        this.groupmarkList = response;
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false
      },
    });
  }

  async changegroupmark(event: any) {
    // let rev = this.groupmarkList.filter(x => x.item_id === event).

    let Validators = await this.InvalidData_Get_Wrapper(event);

    if(!Validators.length)
    {
      let obj = this.groupmarkList.filter((x: { intGroupMarkId: any; }) => x.intGroupMarkId === event);
      //console.log(obj);
      this.wbscreateForm.controls['rev'].patchValue(obj[0].TNTGROUPREVNO);
    }

   else  if(  this.CheckValidGroupMark(Validators[0]))
    {
      let obj = this.groupmarkList.filter((x: { intGroupMarkId: any; }) => x.intGroupMarkId === event);
      //console.log(obj);
      this.wbscreateForm.controls['rev'].patchValue(obj[0].TNTGROUPREVNO);
    }
    else{

      this.wbscreateForm.controls['groupmark'].patchValue(undefined);

      
    }

    setTimeout(() => {
      // Place your code here
      const inputElement = this.el.nativeElement.querySelector('#postedQuantity');
      if(inputElement)
      {
        inputElement.focus()
        inputElement.select();
        // this.Shapeparam.nativeElement.focus();

      }
    }, 200);
   
  }
  addnew() {
    this.isaddnew = !this.isaddnew;
    this.GetCustomer();
    this.GetStructElement();
    this.GetProductType();
    this.wbscreateForm.controls['projecttype'].patchValue(this.prodttype)
    this.wbscreateForm.controls['StructureElement'].patchValue(this.structure)
  }
  Savegroupmark()
   {
    this.formsubmit = true;
    debugger;

    let groupMarkingName = this.groupmarkList.find((x: { intGroupMarkId: any; }) => x.intGroupMarkId === this.wbscreateForm.value.groupmark).vchGroupMarkingName
    if (this.wbscreateForm.valid) {
      this.Groupmarkinglist.push({
        GroupMark: groupMarkingName,
        Rev: this.wbscreateForm.value.rev,
        Qty: this.wbscreateForm.value.postqty,
        Remark: this.wbscreateForm.value.remark,
        isaddedNew:true
      })
      this.formsubmit = false;
      // this.wbscreateForm.reset();
      this.wbscreateForm.controls['groupmark'].reset()
      this.wbscreateForm.controls['rev'].reset()
      this.wbscreateForm.controls.postqty.setValue('1')
      this.wbscreateForm.controls['remark'].reset()


      console.log(this.wbscreateForm.value)
      console.log(this.Groupmarkinglist)
    }
    else {

    }

    setTimeout(() => {
      // Place your code here
      // const inputElement = this.el.nativeElement.querySelector('#GmName');
      // if(inputElement)
      // {
      //   inputElement.focus()
      //   // inputElement.select();
      //   // this.Shapeparam.nativeElement.focus();

      // }
      this.groupmarkSelect.focus();

    }, 200);
  }
  async submitReview(isPost:boolean) {
    debugger
    console.log(this.selectedItem)
    if (this.Groupmarkinglist.length == 0) {
      this.toastr.error("GM not Saved");
      return;
    }
    for (let i = 0; i < this.Groupmarkinglist.length; i++) {

      if(this.Groupmarkinglist[i].isaddedNew==false)
      {
        continue;
      }

      let groupMarkid = this.groupmarkList.find((x: { vchGroupMarkingName: string | undefined; }) => x.vchGroupMarkingName === this.Groupmarkinglist[i].GroupMark).intGroupMarkId

      const WBSobj: add_wbsPostingGroupmark = {
        INTPOSTHEADERID: this.selectedItem.INTPOSTHEADERID,
        INTGROUPMARKID: Number(groupMarkid),
        VCHGROUPMARKINGNAME: this.Groupmarkinglist[i].GroupMark,
        TNTGROUPREVNO: this.Groupmarkinglist[i].Rev,
        TNTGROUPQTY: this.Groupmarkinglist[i].Qty,
        VCHREMARKS: this.Groupmarkinglist[i].Remark?this.Groupmarkinglist[i].Remark:"",
        INTCREATEDUID: 1,
        INTPROJECID: this.projectId,
        INTWBSELEMENTID: this.selectedItem.INTWBSELEMENTID,
        INTSTRUCTUREELEMENTTYPEID: this.selectedItem.StructureElementID,
        SITPRODUCTTYPEID: this.selectedItem.ProductTypeID,
        VCHBBSNO: this.selectedItem.VCHBBSNO,
        BBS_DESC: this.selectedItem.BBS_DESC
      };
      console.log(WBSobj)

      let res = await this.updateGroupMark_Wrapper(WBSobj);
      
          
      
      // this.wbsService.updateGroupMark(WBSobj).subscribe({
      //   next: (response) => {
      //     console.log(response)
      //     this.toastr.success("GM Record added successfully");
      //   },
      //   error: (e) => {
      //     this.toastr.error(e.error)
      //   },
      //   complete: () => {
      //     this.saveTrigger.emit()
      //     this.modalService.dismissAll()
      //   },
      // });
    }


          this.saveTrigger.emit(isPost)
          this.modalService.dismissAll()
  }

  deletegroupmark(item: any, index: any) {

    item.splice(index, 1);

  }

  // cancel() {
  //   this.modalService.dismissAll()
  // }

   GetCustomer(): void {
    debugger;
    this.loading = true;
    this.commonService.GetCutomerDetails().subscribe({
      next: (response) => {
        this.customerList = response;
        //console.log(this.customerList);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  GetProject(customercode: any): void {

    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response) => {
        this.projectList = response;
      },

      error: (e) => {
      },
      complete: () => {
      },

    });


  }


  onEdit(row2: any, index: any) {
    debugger;
    console.log("index", this.prev_index)
    console.log("backup", this.backup_update)
    if (this.prev_index != null) {
      this.groupmarkingEditlist[this.prev_index] = JSON.parse(JSON.stringify(this.backup_update));
    }



    this.prev_index = this.groupmarkingEditlist.findIndex(x => x.GroupMark === row2.GroupMark);
    this.backup_update = JSON.parse(JSON.stringify(row2));
    this.wbscreateForm.controls['qty'].patchValue(this.backup_update.Qty);
    this.wbscreateForm.controls['remarks'].patchValue(this.backup_update.Remark);

    console.log("after backup", this.backup_update);
    this.isEditing = true;

    this.enableEditIndex = index;

  }

  // changeQty(row2: any) {
  //   debugger;
  //   if (row2 == undefined) {
  //     this.formsubmit = false;
  //   }
  //   else {
  //     this.formsubmit = true
  //   }
  // }

  Update(row2: any, index: any) {

    debugger;
    // let PostHeaderId = this.postHeaderId
    // let groupMark=row2.GroupMark
    this.Groupmarkinglist[index].Qty = this.wbscreateForm.controls['qty'].value
    this.Groupmarkinglist[index].Remark = this.wbscreateForm.controls['remarks'].value
    // let intupdateId=1
    //   this.wbsService.updateGroupMarkDetails(PostHeaderId,groupMark,qty,remark,intupdateId)

    //     .subscribe({


    //       next: (response) => {
    //         console.log(response);

    //         this.toastr.success('Shape Surcharge Record Updated successfully')
    //         //this.saveTrigger.emit(this.ShapegroupObj);

    //       },

    //       error: (e) => {

    //         console.log(e.error);

    //       },

    //       complete: () => {
    //         this.GetGroupMarkingList()
    //         // this.LoadTagList(this.selected_station);

    //       },

    //     });

    //   // console.log(this.shapesurchargeList);
    this.isEditing = false;
    this.enableEditIndex = null;
    this.prev_index = null;


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
        },
      });
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
  CheckValidGroupMark(item:any)
  {
   let  validGroupmark=item.intProductValidator
  if (validGroupmark==1) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid  ,Detailing BOM is Missing in ${item.vchStructureMarkingName}`, 'Failed', {
        disableTimeOut: true,  // Disable automatic timeout
      });
      return false;
    }
    else if (validGroupmark==2) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid , Production BOM is Missing  in ${item.vchStructureMarkingName}`, 'Failed', {
        disableTimeOut: true,  // Disable automatic timeout
      });
      return false;

    }
    if (validGroupmark==3) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid ,Sum of MW Spacing is not equal to Invoice CWLength  in Structuremarking  ${item.vchStructureMarkingName} `, 'Failed', {
        disableTimeOut: true,  // Disable automatic timeout
      });
      return false;
    }
    else if (validGroupmark==4) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid ,Sum of CW Spacing is not equal to Invoice MWLength  in Structuremarking   ${item.vchStructureMarkingName}`, 'Failed', {
        disableTimeOut: true,  // Disable automatic timeout
      });
      return false;
    }
    if (validGroupmark==5) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid ,Sum of MW Spacing is not equal to Production CWLength  in Structuremarking ${item.vchStructureMarkingName}`, 'Failed', {
        disableTimeOut: true,  // Disable automatic timeout
      });
      return false;
    }
    else if (validGroupmark==6) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid ,Sum of CW Spacing is not equal to Production MWLength  in Structuremarking  ${item.vchStructureMarkingName} `)
      return false;
    }
    if (validGroupmark==7) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid ,Production pitch is 0  in  Structuremarking ${item.vchStructureMarkingName}`, 'Failed', {
        disableTimeOut: true,  // Disable automatic timeout
      });
      return false;
    }
    else if (validGroupmark==8) {
      this.toastr.warning(`Groupmarking ${item.VCHGROUPMARKINGNAME} is not valid ,Detailing pitch is 0 in Structuremarking  ${item.vchStructureMarkingName}`, 'Failed', {
        disableTimeOut: true,  // Disable automatic timeout
      });
      return false;
    }

    return true;
  
  }
  async InvalidData_Get_Wrapper(groupmarkingId: any,): Promise<any> {
    try {
      var a = await this.wbsService.InvalidData_Get(groupmarkingId).toPromise();
      return a;
    }
    catch (error) {
      return error;
    }
  }

  async updateGroupMark_Wrapper(WBSobj: any,): Promise<any> {
    try {
      var a = await this.wbsService.updateGroupMark(WBSobj).toPromise();
      this.toastr.success("GM Record added successfully");
      return a;
    }
    catch (error) {
      let a:any = error;
      this.toastr.error(a.error);
      return error;
    }
  }
  getGroupMarkingTable(item: any): void {
    //;
    // this.selectedGroupmarkItem = item;
    // this.groupMarkLoading = true;
    item.Groupmarkinglist = [];
    item.isExpand = !item.isExpand;

    let ProjectId, WBSElementsId, StructureElementId, ProductTypeId, BBSNo;
    // ProjectId = this.SelectedProjectID;

    // item.isExpand = false
    WBSElementsId = item.INTWBSELEMENTID;
    StructureElementId = item.StructureElementID;
    ProductTypeId = item.ProductTypeID;
    BBSNo = item.VCHBBSNO;
    this.wbsService.getGroupMarkingTable(item.INTPOSTHEADERID, WBSElementsId, StructureElementId, ProductTypeId, BBSNo).subscribe({
      next: (response) => {
        // this.Groupmarkinglist = response;
        if(response.length)
        {
          response.forEach(element => {
            this.Groupmarkinglist.push({
              GroupMark: element.vchSMGroupMarkingName,
              Rev: element.tntSMGroupRevNo,
              Qty: element.intSMProductQty,
              Remark:element.vchSMRemarks ,
              isaddedNew:false
            })
            


          });
        
        }
       
      },
      error: (e) => {
      },
      complete: () => {
        // this.groupMarkLoading = false;
        // this.wbspostingarray_backup = JSON.parse(JSON.stringify(this.wbspostingarray))
      },
    });

  }

  //   dismissModal(){
  //  this.activeModal.dismiss('User closed modal!');
  // }



  // precast
    async getPrecastDetails(id: number) {
    debugger;

    await this.orderService
      .getPrecastDetails(this.CustomerCode, this.ProjectCode, id)
      .subscribe({
        next: (response) => {
          this.PrecastArray = response ? response : [];
          // this.calculateTotalBundleWt();
          //allowGrade500M
        },
        error: (e) => { },
        complete: () => {
          this.PrecastArray.forEach(element => {
            element.InGmList = 0;
          });       
          this.StandardBarProductOrderLoading = false;
          this.importPrecast();


          // this.loading = false;
        },
      });
  }
    downloadReport() {
    const customerName = `${this.CustomerName} (${this.CustomerCode})`;
    const projectName = `${this.ProjectName} ( ${this.ProjectCode} )`;
    // const tableData = [
    //   { col1: 'Data 1', col2: 'Data 2', col3: 'Data 3' },
    //   { col1: 'Data A', col2: 'Data B', col3: 'Data C' },
    // ];
      if(this.PrecastArray.length)
    this.pdfGenerator.generateReport(customerName, projectName, this.PrecastArray);
  else
    this.toastr.warning("No data for download")
  }

    dismissModal(){
    this.modal.dismiss("User closed modal!");
  }

   GetGroupMarkingList(): void {
    debugger;

    //FOR TRIAL :-  VALUES THAT RETURN A GROUPMARKLIST
    // let ProjectId = 5600, WBSElementsId = 265, StructureElementId = 1, ProductTypeId = 7
    // let ProjectId = this.projectId, WBSElementsId = this.wbselementId, StructureElementId = this.structure, ProductTypeId = this.prodttype

    this.wbsService.GetGroupMarkingList(this.projectId, this.structure, 7).subscribe({
      next: (response) => {
        this.groupmarkList = response;
      },
      error: (e) => {
      },
      complete: () => {
          if(this.selectedItem.IsPreCast == true){
        this.ShowPrecast = false;
        this.loading= true;       
        this.getPrecastDetails(this.postHeaderId);
      }
      
      //  this.importPrecast()
      },
    });
  }
  importPrecast(){
    let flag=0;
    if(this.PrecastArray.length>0){
     for(let i=0; i< this.PrecastArray.length; i++){
     flag=0
      for(let j=0; j< this.groupmarkList.length; j++){
        if(this.groupmarkList[j].vchGroupMarkingName.toLowerCase().includes(this.PrecastArray[i].ComponentMarking.toLocaleLowerCase())){
          
          let index = this.Groupmarkinglist.findIndex((element:any)=>element.GroupMark.toLowerCase() === this.groupmarkList[j].vchGroupMarkingName.toLowerCase());
          if(index ==-1)
          {            
            this.addtolist(this.PrecastArray[i],this.groupmarkList[j].vchGroupMarkingName)
          }
          else{
            this.Groupmarkinglist[index].isPrecast = 1;
          }
          
          flag++;
       
        }
      }
       if(flag==0){
          this.PrecastArray[i].InGmList=1;
           }
     }

    // let fileredPrecastarray = this.groupmarkList.filter((item:any) =>
    //   this.PrecastArray.some(input =>
    //     item.vchGroupMarkingName.toLowerCase().includes(input.ComponentMarking.toLowerCase())
    //   )
    // );
    
    // fileredPrecastarray.forEach((item:any)=>{
    //   let index = this.Groupmarkinglist.find((element:any)=>element.GroupMark=== item.vchGroupMarkingName);
    //   let ind = this.PrecastArray.findIndex((element:any)=>element==item)
    //   this.PrecastArray[ind].InGmList=1;
    //         if(index==undefined)
    //         {             
    //           this.addtolist(item)
    //         }
    //         else{
    //           this.Groupmarkinglist[index].isPrecast = 1;
    //         }

    // })
    
    
     this.PrecastArray.sort((a, b) => {
      return b.InGmList - a.InGmList; 
    });
    }
   
     
  }
  giveRowcolor(item: any) {
    var color = '#ffffff';
    if (item.InGmList == 1) {
      // created
      color='#F08080';
    } 
    return color;
  }
  giveRowcolorNew(item: any) {
    var color = '#ffffff';
    if (item.isPrecast == true) {
      // created
      color='#94DBB9';
    } 
    return color;
  }
  async GetCustomerName() {
    console.log("now-CustomerName:", this.CustomerCode)
    this.commonService.GetCustomerName(this.CustomerCode).subscribe({
      next: (response: any) => {
        console.log('CustomerName', response);
        this.CustomerName = response.vchCustomername;
      },
      error: () => { },
      complete: () => {

      },
    })
  }

  async GetProjectName() {
    console.log("now-this.ProjectCode", this.ProjectCode);
    this.commonService.GetProjectName(this.ProjectCode).subscribe({
      next: (response: any) => {
        console.log('ProjectName', response);
        this.ProjectName = response.proj_desc1;
      },
      error: () => { },
      complete: () => {

      },
    })
  }

    public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    
  }
    cancel() {
    this.modalService.dismissAll()
  }

}
