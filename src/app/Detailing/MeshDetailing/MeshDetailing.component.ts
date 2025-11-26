import { Directive,ChangeDetectorRef, Component, OnInit, Input, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { Router, ɵafterNextNavigation } from '@angular/router';
import { GroupMarkComponent } from './addgroupmark/addgroupmark.component';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { DetailingService } from '../DetailingService';
import { GroupMarkingGridlist } from '../../Model/groupmarking_gridlist'
import { ToastrService } from 'ngx-toastr';
import { ReleaseDialogComponent } from '../ReleaseDialog/Release-dialog.component';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { e } from 'mathjs';





@Component({
  selector: 'app-MeshDetailing',
  templateUrl: './MeshDetailing.component.html',
  styleUrls: ['./MeshDetailing.component.css']
})
export class MeshDetailingComponent implements OnInit {

  @Output() deleteKeyPressed = new EventEmitter<void>();

  MeshdetailsForm!: FormGroup;
  shiftKeypressed: boolean = false;
  parameterList: any[] = [];
  projectList: any = [];
  producttypeList: any[] = [];
  searchResult: boolean = false;
  isaddnew: boolean = false;
  groupmarkinglist: any[] = [];
  StructElementlist: any[] = [];
  structureElementarray: any[] = [];
  toggleFilters = true;
  totalrecordcount: any;
  searchText: any = '';
  customerName: any;
  LoadingCustomerName: boolean = true;
  projectName: any;
  Customerlist: any = []
  GroupMarkPostedRecord: any[] = [];
  GroupMarkReleasedRecord: any[] = [];
  ProductTypeID: number = 0;
  reGenerate_flag=false;
  temparray: any;
  backup_groupmarkinglist: GroupMarkingGridlist[] = []
  isflag = true;
  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  loading: boolean = false;

  searchGroupMarking: any = "";
  searchRevision: any = "";
  searchParameterSet: any = "";
  searchProductType: any = "";
  searchStructureElement: any = "";
  searchCreatedDate: any = "";
  lastSelectedIndex: number = -1;
  transferObject: any
  intRecordCount: number = 0;
  ReleasedGmID: any;

  constructor(public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal, public commonService: CommonService,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    public detailingService: DetailingService,
    private tosterService: ToastrService
  ) {
    this.MeshdetailsForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),


    });

  }






  ngOnInit() {

    // this.reloadService.ReloadDetailingGM$.subscribe((data) => {
    //   this.router.navigate(['/detailing/DetailingGroupMark']);

    // })

    this.commonService.changeTitle('Mesh Detailing | ODOS');
    this.GetCustomer();
    debugger;

    localStorage.removeItem('MeshData');

    this.reloadService.reloadCustomer$.subscribe((data) => {
      // console.log("yes yes yes ")
      this.customerName = this.dropdown.getCustomerCode()
    });


    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        debugger;
        this.resetDetailingsearchValue();
        this.projectName = this.dropdown.getDetailingProjectId();
        console.log("Changed  Project id=" + this.projectName)
        if (this.projectName !== undefined) {
          this.groupmarkinglist = [];

          this.GetProject(this.customerName);
          this.loadtabledata(this.projectName);
          this.changeDetectorRef.detectChanges();
        }


      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });
    this.changeDetectorRef.detectChanges();

    this.customerName = this.dropdown.getCustomerCode();
    this.projectName = this.dropdown.getDetailingProjectId();


    this.GetProject(this.customerName);

    this.groupmarkinglist = [];
    console.log(this.projectName);
    if (this.projectName !== 0) {
      this.loadtabledata(this.projectName);
    }
    
  }


  changecustomer(event: MouseEvent): void {
    // console.log("customer id" + event)
    debugger;
    this.projectList = [];
    this.projectName = undefined;
    // this.transferObject.ProjectId = undefined;
    this.groupmarkinglist = [];
    if (event !== undefined) {
      this.GetProject(event);
    }


    this.searchResult = false;

  }

  // changeproject(event: any) {
  //   if (event !== undefined) {
  //     this.loadtabledata(event);
  //     this.changeDetectorRef.detectChanges();
  //   }
  //   else {
  //     this.groupmarkinglist = [];
  //   }
  // }

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
        // if (this.transferObject["CustomerId"] != undefined) {

        //  this.customerName = this.transferObject['CustomerId'];
        this.GetProject(this.customerName);
        // }
      },
    });
  }
  GetProject(customercode: any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response) => {
        this.projectList = response;
        console.log("projectlist", this.projectList)
      },

      error: (e) => {
      },
      complete: () => {
        if (this.transferObject && this.transferObject["ProjectId"] != undefined) {

          this.projectName = Number(this.transferObject['ProjectId']);
          this.loadtabledata(this.projectName);
        }
      },

    });


  }
  loadtabledata(projectId: any) {
    debugger;
    this.loading = true;
    this.detailingService.GetGroupMarkingList(projectId).subscribe({
      next: (response) => {
        this.groupmarkinglist = response;
        console.log("MarkingList", this.groupmarkinglist);
      },
      error: (e) => {
        console.log("error", e);
      },
      complete: () => {
        this.loading = false;


        this.groupmarkinglist.forEach(element => {
          element.colorRow = false;
        });
        this.backup_groupmarkinglist = this.groupmarkinglist;
        if(this.reGenerate_flag)
        {
          let item:any;

          this.transferObject = this.groupmarkinglist.find(x=>x.INTGROUPMARKID ==this.ReleasedGmID)
          this.transferObject['ProjectId'] = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).ProjectId;
          this.transferObject['CustomerId'] = (this.Customerlist.find((x: { CustomerNo: any; }) => x.CustomerNo === this.customerName)).CustomerNo;
          this.transferObject['ProjectName'] = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).Description;
          this.transferObject['CustomerName'] = (this.Customerlist.find((x: { CustomerNo: any; }) => x.CustomerNo === this.customerName)).Customername;
          this.transferObject['ProjectCode'] = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).ProjectCode;
          this.transferObject['isEdit'] = true;
          localStorage.setItem('MeshData', JSON.stringify(this.transferObject));
          localStorage.setItem('PostedGM', JSON.stringify(0));
          this.router.navigate(['/detailing/DetailingGroupMark']);

        }
        console.log(this.loading);
       this.updateGroupMarking();
      
      },
    });



  }


  get f() { return this.MeshdetailsForm.controls; }
  addnew() {
    this.isaddnew = !this.isaddnew;

  }
  SaveParameter() {
    this.isaddnew = !this.isaddnew;
  }
  open() {
    debugger
    if(this.projectName && this.customerName)
    {


      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,      // centered: true,
        size: 'lg',

      }
      const modalRef = this.modalService.open(GroupMarkComponent, ngbModalOptions);
      modalRef.componentInstance.ProjectID = this.projectName;
      modalRef.componentInstance.CustomerID=this.customerName;
      modalRef.componentInstance.ProjectName = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).Description;
      modalRef.componentInstance.CustomerName = (this.Customerlist.find((x: { CustomerNo: any; }) => x.CustomerNo === this.customerName)).Customername;
      modalRef.componentInstance.ProjectCode =  (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).ProjectCode;
      modalRef.componentInstance.structElement = undefined
      modalRef.componentInstance.productType = undefined
      modalRef.componentInstance.tntParameterSetNumber = undefined;

      // modalRef.componentInstance.tntParametersetnumber = undefined
      






      modalRef.componentInstance.saveTrigger.subscribe((x: any) => {




        this.router.navigate(['/detailing/DetailingGroupMark']);
      })


    }
    else{
      this.tosterService.warning("Please Select Customer and Project");
    }
  }


  onReset() {
    this.MeshdetailsForm.reset();
    this.groupmarkinglist = [];
    this.GetCustomer();
    this.projectList = [];
    this.projectName = undefined;
  }


  isAllCheckBoxChecked() {
    //return this.wbspostingarray.every(p => p.checked);
  }

  checkAllCheckBox(ev: any) {
    // Angular 9

    //this.products.forEach(x => x.checked = ev.target.checked)
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    // this.enableEditIndex = null;
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    // this.enableEditIndex = null;
  }

  ResetLocalStorage(){
    localStorage.setItem('searchGroupMarking', JSON.stringify(''));
    localStorage.setItem('searchProductType', JSON.stringify(''));
    localStorage.setItem('searchStructureElement', JSON.stringify(''));
    localStorage.setItem('searchParameterSet', JSON.stringify(''));
    localStorage.setItem('searchRevision', JSON.stringify(''));
  }

  searchDetailingData() {
    localStorage.setItem('searchGroupMarking', JSON.stringify(this.searchGroupMarking));
    localStorage.setItem('searchProductType', JSON.stringify(this.searchProductType));
    localStorage.setItem('searchStructureElement', JSON.stringify(this.searchStructureElement));
    localStorage.setItem('searchParameterSet', JSON.stringify(this.searchParameterSet));
    localStorage.setItem('searchRevision', JSON.stringify(this.searchRevision));
    


    // this.GetCabProducuctCodeList();
    debugger;
    this.groupmarkinglist = JSON.parse(JSON.stringify(this.backup_groupmarkinglist));
    if (this.searchGroupMarking != undefined) {
      this.groupmarkinglist = this.groupmarkinglist.filter(item =>
        //item.VCHGROUPMARKINGNAME?.toLowerCase().includes(this.searchGroupMarking.trim().toLowerCase())
        this.checkFilterData(this.searchGroupMarking, item.VCHGROUPMARKINGNAME)
      );
    }

    if (this.searchRevision != undefined) {
      this.groupmarkinglist = this.groupmarkinglist.filter(item =>
        //item.TNTGROUPREVNO?.toString().toLowerCase().includes(this.searchRevision.trim().toLowerCase())
        this.checkFilterData(this.searchRevision, item.TNTGROUPREVNO)

      );
    }
    if (this.searchParameterSet != undefined) {
      this.groupmarkinglist = this.groupmarkinglist.filter(item =>
        //item.INTPARAMETESET?.toString().toLowerCase().includes(this.searchParameterSet.trim().toLowerCase())
        this.checkFilterData(this.searchParameterSet, item.INTPARAMETESET)

        );
    }
    if (this.searchProductType != undefined) {
      this.groupmarkinglist = this.groupmarkinglist.filter(item =>
        //item.VCHPRODUCTTYPE?.toLowerCase().includes(this.searchProductType.trim().toLowerCase())
        this.checkFilterData(this.searchProductType, item.VCHPRODUCTTYPE)

        );
    }

    if (this.searchStructureElement != undefined) {
      this.groupmarkinglist = this.groupmarkinglist.filter(item =>
        //item.VCHSTRUCTUREELEMENTTYPE?.toLowerCase().includes(this.searchStructureElement.trim().toLowerCase())
        this.checkFilterData(this.searchStructureElement, item.VCHSTRUCTUREELEMENTTYPE)

        );
    }
    if (this.searchCreatedDate != undefined) {
      this.groupmarkinglist = this.groupmarkinglist.filter(item =>
        //item.DATCREATEDDATE?.toString().toLowerCase().includes(this.searchCreatedDate.trim().toLowerCase())
        this.checkFilterData(this.searchCreatedDate, item.DATCREATEDDATE)

        );
    }


  }
  resetDetailingsearchValue() {
    this.searchGroupMarking = "";
    this.searchRevision = "";
    this.searchParameterSet = "";
    this.searchProductType = "";
    this.searchStructureElement = "";
    this.searchCreatedDate = "";
    this.loadtabledata(this.projectName);
    this.ResetLocalStorage();
  }

  onKeyDown(event: KeyboardEvent) {
    console.log("this is key pressed", event.key)
    this.shiftKeypressed = true;

    // if (event.shiftKey) {
    //   const focusedOptionIndex = this.Customerlist.findIndex((option: { id: any; }) => option.id === this.customerName[this.lastSelectedIndex].CustomerNo);
    //   console.log("Index is ",focusedOptionIndex);
    //   if (focusedOptionIndex !== -1) {
    //     const nextIndex = event.key === 'ArrowDown' ? focusedOptionIndex + 1 : focusedOptionIndex - 1;
    //     if (nextIndex >= 0 && nextIndex < this.Customerlist.length) {
    //       const nextOption = this.Customerlist[nextIndex];
    //       if (!this.customerName.some((option: { id: any; }) => option.id === nextOption.id)) {
    //         this.customerName.push(nextOption);
    //         this.lastSelectedIndex++;
    //       }
    //     }
    //   }
    // }
  }
  onKeyUp(event: KeyboardEvent) {
    debugger;
    console.log("this is key released", event.key); this.shiftKeypressed = false;

  }
  setLastSelectedIndex() {

    this.lastSelectedIndex = this.customerName.length - 1;

  }

  getSelectedOptions() {
    console.log('Selected Options:', this.customerName);
  }
  SendParameters(item: any) {
    debugger;

    console.log(item);

    this.transferObject = item;

    this.transferObject['ProjectId'] = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).ProjectId;
    this.transferObject['CustomerId'] = (this.Customerlist.find((x: { CustomerNo: any; }) => x.CustomerNo === this.customerName)).CustomerNo;
    this.transferObject['ProjectName'] = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).Description;
    this.transferObject['CustomerName'] = (this.Customerlist.find((x: { CustomerNo: any; }) => x.CustomerNo === this.customerName)).Customername;
    this.transferObject['ProjectCode'] = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).ProjectCode;
    this.transferObject['isEdit'] = true;


    localStorage.setItem('MeshData', JSON.stringify(this.transferObject));

    this.ValidateGroupMark(item);


    // if(item.VCHSTRUCTUREELEMENTTYPE.toLowerCase()==="drain")
    // {
    //   this.router.navigate(['/detailing/DetailingGroupMark/Drain']);


    // }
    // //  if(item.VCHSTRUCTUREELEMENTTYPE.toLowerCase()==="drain")
    // // {
    // //   this.router.navigate(['/detailing/DetailingGroupMark/BorePile']);


    // // }
    // else{
    // }


  }



  CheckPostedGroupMarks(INTGROUPMARKID: any): void {
    debugger;
    this.detailingService.GetPostedGroupMark(INTGROUPMARKID).subscribe({
      next: (response) => {
        debugger;

        this.GroupMarkPostedRecord = response;
        console.log("GroupMarkPostedRecord", this.GroupMarkPostedRecord);
        if (this.GroupMarkPostedRecord.length > 0) {
          //Redirections
          this.router.navigate(['/detailing/DetailingGroupMark']);


        }
      },
      error: (e) => {
      },
      complete: () => {
        debugger;

      },
    });
  }
  CheckRealsedGroupMarks(item: any) {
    this.detailingService.GetReleasedGroupMark(item.INTGROUPMARKID).subscribe({
      next: (response) => {
        debugger;
        this.GroupMarkReleasedRecord = response;
        console.log("GroupMarkReleasedRecord", this.GroupMarkReleasedRecord);
        if (this.GroupMarkReleasedRecord.length > 0) {
          const ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            centered: true,
            size: 'lg',
          }
          const modalRef = this.modalService.open(ReleaseDialogComponent, ngbModalOptions);
          modalRef.componentInstance.messagenumber = 1;
          modalRef.result.then(modalResult => {
            if (modalResult.isConfirm) {

              this.loading = true;
              //Yes operation--copy Group Mark
              this.detailingService.CopyGroupMarkDetailing(item).subscribe({
                next: (response: any) => {
                  debugger;
                  console.log(response);
                  this.ReleasedGmID = response;                                
                  this.tosterService.success("GroupMarking new version get created successfully");
                },
                error: (e: any) => {
                  console.log("error", e);
                },
                complete: () => {
      

                  this.reGenerate_flag = true;
                  
                  this.loadtabledata(this.projectName);
                  this.loading = false;
             

                  //copy
                  // this.detailingService.CopyGroupMark().subscribe({
                  //   next: (response: any) => {
                  //     console.log(response);
                  //     this.loadtabledata(this.projectName);;
                  //   },
                  //   error: (e: any) => {
                  //     console.log("error",e);
                  //   },
                  //   complete: () => {
                  //   this.loading= true;

                  //   },
                  // });
           

                },
              });

            }
            else {

              this.router.navigate(['/detailing/DetailingGroupMark']);
              // No  :opertaion redirection

            }
          })

        }
        else {
          //Redirect to Detailing
          //this.CheckPostedGroupMarks(item.INTGROUPMARKID)
          this.router.navigate(['/detailing/DetailingGroupMark']);
        }
      },
      error: (e) => {
      },
      complete: () => {
        debugger;

      },
    });
  }

  CheckProductType(intProductType: any, intGroupMarkId: any): void {
    debugger;
    this.detailingService.GetProductType(intProductType, intGroupMarkId).subscribe({
      next: (response) => {
        debugger;

        this.producttypeList = response;
        console.log("ProductType", this.producttypeList);

      },
      error: (e) => {
      },
      complete: () => {
        debugger;


      },
    });
  }


  deleteGroupMark(id: any,name:any) {
    this.loading = true;
    this.detailingService.Delete_GroupMarking(id).subscribe({
      next: (response) => {
        if (response.result === 0) {
          this.tosterService.success("GroupMarking  " + name + " deleted successfully.")
        }
        else if (response.result === 2) {
          this.tosterService.error("Cannot delete the groupmarking.It has been posted already");
        }

      },
      error: (e) => {
        console.log("error", e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.loadtabledata(this.projectName);
        //this.initialDataInsert();
      },
    });
  }
  //Validate GroupMark
  ValidateGroupMark(item: any) {
    this.detailingService.ValidatedPostedGM(item.INTGROUPMARKID).subscribe({
      next: (response) => {
        this.intRecordCount = Number(response);
        // this.transferObject = this.intRecordCount;
        debugger;
      },
      error: (e) => {
        console.log("error", e);
      },
      complete: () => {
        debugger;
        localStorage.setItem('PostedGM', JSON.stringify(this.intRecordCount));
        // this.detailingService.setBooleanValue(this.intRecordCount);
        this.CheckRealsedGroupMarks(item);
      },
    });
  }

  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue.toString().includes(',')) {
      let value = ctlValue.toString().toLowerCase().trim().split(',');
      return value.some((char: string) => item.toString().toLowerCase().includes(char))
    } else {
      return item
        .toString()
        .toLowerCase()
        .includes(
          ctlValue
            .toString()
            .toLowerCase()
            .trim()
        )
    }
  }
  closeSideMenu() {
    // this.reloadService.reloadSideMenu.emit();
  }
  giveRowcolor(item:any)
  {
    // debugger;
    if(item.colorRow==true)
    {
      return 'red'
    }
    else{
      return 'white'
    }
    
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Delete") {
      this.deleteAllselected();
    }
  }
  selectRow(item:any,event:MouseEvent,index:any)
  {

    let i  = this.groupmarkinglist.findIndex(x=>x.INTGROUPMARKID ===item.INTGROUPMARKID);
   
    

    if(event.ctrlKey)
    {
      if(item.POSTED==1)
      {
        this.tosterService.warning(`This Groupmark ${item.VCHGROUPMARKINGNAME} is Posted `);
        // return ;
      }
      else{

        item.colorRow =!item.colorRow ;
      }
    }
    i--;
    if(event.ctrlKey && event.shiftKey)
    {
      while(i>0 && this.groupmarkinglist[i].colorRow==false)
      {
        let item  = this.groupmarkinglist[i]


      if(item.POSTED==1)
      {
        this.tosterService.warning(`This Groupmark ${item.VCHGROUPMARKINGNAME} is Posted `);
        
      }
      else{
        item.colorRow =!item.colorRow ;
      }
      i--;
      
    
      }
    }
    
  }



  deleteAllselected()
  {
    this.groupmarkinglist.forEach(element => {
      if(element.colorRow)
      {
        this.deleteGroupMark(element.INTGROUPMARKID,element.VCHGROUPMARKINGNAME)
      }
    });
  }

  updateGroupMarking(){
    let lGroupMarking:any = localStorage.getItem('searchGroupMarking');
    lGroupMarking=JSON.parse(lGroupMarking);
    if(lGroupMarking){
      this.searchGroupMarking=lGroupMarking;
    }
    let lProductType:any = localStorage.getItem('searchProductType');
    lProductType=JSON.parse(lProductType);
    if(lProductType){
      this.searchProductType=lProductType;
    }
    let lStructureElement:any = localStorage.getItem('searchStructureElement');
    lStructureElement=JSON.parse(lStructureElement);
    if(lStructureElement){
      this.searchStructureElement=lStructureElement;
    }
    let lParameterSet:any = localStorage.getItem('searchParameterSet');
    lParameterSet=JSON.parse(lParameterSet);
    if(lParameterSet){
      this.searchParameterSet=lParameterSet;
    }
    let lRevision:any = localStorage.getItem('searchRevision');
    lRevision=JSON.parse(lRevision);
    if(lRevision){
      this.searchProductType=lRevision;
    }

    this.searchDetailingData()
  }



}


