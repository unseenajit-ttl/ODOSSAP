import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '../orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { PreCastDetails } from 'src/app/Model/StandardbarOrderArray';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { PdfGeneratorServiceService } from 'src/app/SharedComponent/pdf-generator-service.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WbsService } from 'src/app/wbs/wbs.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-precastpopup',
  templateUrl: './precastpopup.component.html',
  styleUrls: ['./precastpopup.component.css']
})
export class PrecastpopupComponent implements OnInit {
  @Input() projectId: any;
  @Input() selectedItem: any;
  @Input() wbselementId: any;
  @Input() prodttype: any;
  @Input() structure: any;
  @Input() postHeaderId: any;
  @Input() isDisablePost: any;

  ProjectCode: any;
   CustomerCode: string = "";
   PrecastArray: PreCastDetails[] = [];
   receivedData: any = '';
   fromWbsPosting: any = '';
   JobID:any;
   CustomerName: any;
   ProjectName: any;
   StandardBarProductOrderLoading: boolean = false;
   groupmarkList: any[]=[];
  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10; 

  constructor(
    private orderService: OrderService,
    private CustomerPRoj: CustomerProjectService,
    private commonService: CommonService,
    private createSharedService: CreateordersharedserviceService,
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private pdfGenerator: PdfGeneratorServiceService,
    public modal : NgbActiveModal,
    private wbsService:WbsService,
    private toastr: ToastrService,
    private modalService: NgbModal, 
  ){

  }
  ngOnInit(): void {
    debugger
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

        this.getPrecastDetails(this.fromWbsPosting.PostHeaderID);
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
          this.StandardBarProductOrderLoading = false;
          this.GetGroupMarkingList();


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
      this.importPrecast();
      },
    });
  }
  importPrecast(){
    let flag=0;
    if(this.PrecastArray.length>0){
     for(let i=0; i< this.PrecastArray.length; i++){
     flag=0
      for(let j=0; j< this.groupmarkList.length; j++){
        if(this.PrecastArray[i].ComponentMarking == this.groupmarkList[j].vchGroupMarkingName){         
          flag++;
          break;
        }
      }
       if(flag==0){
          this.PrecastArray[i].InGmList=1;   
           }
     }
    
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
