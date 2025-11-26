import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MasterDialogComponent } from '../master-dialog/master-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { CreateProjectComponent } from './Addproject/create-project.component';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { ContactListService } from 'src/app/Masters/Services/ProjectContractList/contact-list.service';
import { ProjectContractList } from 'src/app/Model/projectcontractlist';
import { WbsService } from 'src/app/wbs/wbs.service';
import { ContractList } from 'src/app/Model/ContractList';
import { CommonService } from 'src/app/SharedServices/CommonService';
import * as XLSX from 'xlsx'
import { ToastrService } from 'ngx-toastr';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.css']
})
export class ProjectlistComponent implements OnInit {
  [x: string]: any;


  transferObject: any
  projectmasterform!: FormGroup
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any;
  projectList: any = [];
  Customerlist: any = [];
  Contractlist: ContractList[] = [];
  projecttablelist: any[] = [];
  producttypeList: any = [];
  contractListData: ProjectContractList[] = [];
  backup_contractListData: ProjectContractList[] = [];
  temparray: any[] = [];
  statuslist: any[] = [];
  enableEditIndex: any = null;
  toggleFilters = false
  startdate: any = null;
  enddate: any = null;
  filteredPost: any[] = [];
  ArrayLength: any;
  name: string = '';
  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  listTodownload: any;
  searchContract: any;
  searchStatus: any;
  searchCode: any;
  searchName: any;
  searchFromDate: any;
  searchToDate: any;
  searchProjectCode: any;
  searchProjectName: any;
  searchCoordinate: any;
  searchPhysical: any;
  searchSubsegment: any;
  loading = false;
  LoadingCustomerName = true;
  customerName: any;
  projectName: any;
  contractName: any;
  searchprojectName: any;
  searchcontractName: any=null;
  backup_projectList: any[] = [];
  constructor(private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder, private modalService: NgbModal,
    private projectcontractlistService: ContactListService,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private wbsService: WbsService, public commonService: CommonService,
    private toastr: ToastrService,
  ) { }



  ngOnInit() {
    this.commonService.changeTitle('ProjectList | ODOS');
    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.selectedCustomer = this.dropdown.getCustomerCode()
    });


    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        this.SelectedProjectID = this.dropdown.getDetailingProjectId();
        console.log("Changed  Project id=" + this.SelectedProjectID)
        if (this.SelectedProjectID == 0) {
          this.searchResult = true;
          this.GetProjectContractList();

        }
        else {
          this.searchResult = true;
          this.LoadContractList(this.SelectedProjectID);
          this.LoadContractListFilter(this.selectedCustomer,this.startdate,this.enddate)
        }



      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });

    this.changeDetectorRef.detectChanges();
    this.selectedCustomer = this.dropdown.getCustomerCode()
    this.SelectedProjectID = this.dropdown.getDetailingProjectId();
  console.log("customer id "+this.selectedCustomer);
  console.log("project id "+this.SelectedProjectID);

    this.searchResult = true;
    if (this.SelectedProjectID == 0) {
      this.GetProjectContractList();

    }
    else {
      this.LoadContractList(this.SelectedProjectID);
      this.LoadContractListFilter(this.selectedCustomer,this.startdate,this.enddate)
    }


    // this.transferObject = localStorage.getItem('ContractList');
    // this.transferObject = JSON.parse(this.transferObject);
    // this.GetCustomer();
    this.GetProductType();


    this.statuslist = [
      { item_id: 1, item_text: 'Active' },
      { item_id: 0, item_text: 'Inactive' }];

    this.ArrayLength = this.projecttablelist.length;
    console.log(this.ArrayLength);

    this.projectmasterform = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      contract: new FormControl('', Validators.required),
      startdate: new FormControl(''),
      enddate: new FormControl(''),

    });


  }


  getDate(date: any) {
    if (date == '') {
      return ''
    }
    date = date.split('/')
    date.unshift(date.pop())
    for (let i = 0; i < date.length; i++) {
      if (date[i] <= 9) {
        date[i] = '0' + date[i]
      }
    }
    date = date.join('')
    return date
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (this.selectedCustomer != undefined) {
      debugger;
      this.startdate = "";
      this.startdate = "";
      //STARTDATE
      this.startdate = dateRangeStart.value
      this.startdate = this.getDate(this.startdate)
      //ENDDATE
      this.enddate = dateRangeEnd.value
      this.enddate = this.getDate(this.enddate)
      this.changeDetectorRef.detectChanges();

      console.log(this.startdate);
      console.log(this.enddate)
      if (this.startdate != "" && this.enddate != "") {
        this.LoadContractListFilter(this.selectedCustomer, this.startdate, this.enddate)
      }
      // this.filterData();
    }
    else {
      this.toastr.error("Please select customer first to filter data.")
      this.projectmasterform.controls['startdate'].reset();
      this.projectmasterform.controls['enddate'].reset();
    }

  }


  LoadContractList(Project_code: any) {
    debugger;
    this.loading=true;
    this.projectcontractlistService.GetContractList(Project_code).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.Contractlist = response;
     },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

      },
    });

  }
  LoadContractListFilter(customerid: any, startdate: any, enddate: any) {
     debugger;
     this.loading=true;
    this.projectcontractlistService.GetProductContractListWithFilter(customerid, startdate, enddate, this.SelectedProjectID,  this.searchcontractName).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.contractListData = response;
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

      },
    });

  }
  changeproject(event: any) {
    console.log("PRoject ", event);
    debugger;
    this.Contractlist = [];
    this.filterData();
    this.LoadContractList(event);




  }
  onReset() {
    debugger;
    //this.loaddata();
    this.loading = true;
    this.projectmasterform.reset();
    this.projectList = [];
    this.Contractlist = [];
    this.searchcontractName=null;
    this.startdate = null;
    this.startdate = null;
   
   
    if(this.SelectedProjectID !== 0 && this.selectedCustomer!==0) 
    {
      this.LoadContractList(this.SelectedProjectID);
      this.LoadContractListFilter(this.selectedCustomer,this.startdate,this.enddate)
    }
    else
    {
    this.GetProjectContractList();
    
    }
  }
  getPageData() {
    this.GetProjectContractList();
    this.projecttablelist = this.projecttablelist
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }


  GetProjectContractList() {
    debugger;
    this.loading=true;
    this.projectcontractlistService.GetProductContractList().subscribe({
      next: (response) => {
        this.contractListData = response;
        this.ArrayLength = this.contractListData.length;
        console.log("this is ContractList ", this.contractListData);

      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
        // this.contractListData = this.selectFilter(this.CoreCageProductListData)
        this.backup_contractListData = JSON.parse(JSON.stringify(this.contractListData));
      },
    });
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.name + ".xlsx";
    link.click();
  }

  GetCustomer(): void {
    this.commonService.GetCutomerDetails().subscribe({
      next: (response) => {
        this.Customerlist = response;
        console.log("Customerlist", this.Customerlist);
      },
      error: (e) => {
      },
      complete: () => {
        this.LoadingCustomerName = false;
        if (this.transferObject["Customer"] != undefined) {

          this.selectedCustomer = this.transferObject['Customer'];
          
        }

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

  // GetProject(customercode: any): void {
  //   this.projectcontractlistService.GetProjectList(customercode).subscribe({
  //     next: (response) => {
  //       this.projectList = response;
  //       console.log("projectlist", this.projectList)
  //     },

  //     error: (e) => {
  //     },
  //     complete: () => {
  //       if (this.transferObject["Project"] != undefined) {
  //         this.projectName = this.transferObject['Project'];


  //       }
  //     },

  //   });


  // }
  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.enableEditIndex = null;
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    this.enableEditIndex = null;
  }

  downloadFile() {

    this.GetProjectContractList();
    this.listTodownload = this.contractListData;
    this.name = 'contractList'
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listTodownload);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'export');

  }

  searchContractListData() {
    // this.GetCabProducuctCodeList();
    debugger;
    this.contractListData = JSON.parse(JSON.stringify(this.backup_contractListData));
    if (this.searchContract != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.vchContractCode?.toLowerCase().includes(this.searchContract.trim().toLowerCase())
      );
    }

    if (this.searchStatus != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.Status?.toLowerCase() === this.searchStatus.trim().toLowerCase()
      );
    }

    if (this.searchCode != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.intCustomerCode?.toString().toLowerCase().includes(this.searchCode.trim().toLowerCase())
      );
    }
    if (this.searchName != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.vchCustomername?.toString().toLowerCase().includes(this.searchName.trim().toLowerCase())
      );
    }
    if (this.searchFromDate != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.START_DATE?.toLowerCase().includes(this.searchFromDate.trim().toLowerCase())
      );
    }

    if (this.searchToDate != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.END_DATE?.toLowerCase().includes(this.searchToDate.trim().toLowerCase())
      );
    }
    if (this.searchProjectCode != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.vchprojectcode?.toString().toLowerCase().includes(this.searchProjectCode.trim().toLowerCase())
      );
    }

    if (this.searchProjectName != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.proj_desc1?.toString().toLowerCase().includes(this.searchProjectName.toString().toLowerCase())
      );
    }

    if (this.searchCoordinate != undefined) {
      this.contractListData = this.contractListData.filter(item =>
        item.PROJ_COORD_NAME?.toString().toLowerCase().includes(this.searchCoordinate.toString().toLowerCase())
      );
    }
    if (this.searchPhysical != undefined && this.searchPhysical != '') {
      this.contractListData = this.contractListData.filter(item =>
        item.Physical?.toString().toLowerCase().includes(this.searchPhysical.toString().toLowerCase())
      );
    }



  }

  ChangeContract(event:any)
  {
    debugger
    console.log(event)
    if(event ===undefined)
    {
    this.searchcontractName=null;
    }
    else{
      this.searchcontractName=event
    }
    this.filterData();
  }
  filterData() {
    
    debugger
   // this.contractListData = JSON.parse(JSON.stringify(this.backup_contractListData))
    debugger;
    if (this.selectedCustomer != undefined) {
      this.LoadContractListFilter(this.selectedCustomer, this.startdate, this.enddate); 

    }
     else {
      this.contractListData = [];
      this.onReset();
    }
    console.log(this.contractListData)

  }
  wildcardSearch() {

    debugger;
    this.contractListData = JSON.parse(JSON.stringify(this.backup_contractListData))

    if (this.searchText !== undefined) {
      debugger;

      this.contractListData = this.contractListData.filter(item =>
        item.vchContractCode?.toLowerCase().includes(this.searchText.toLowerCase())
        || item.intCustomerCode?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.END_DATE?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.START_DATE?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.vchprojectcode?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.proj_desc1?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.PROJ_COORD_NAME?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.Physical?.toString().toLowerCase().includes(this.searchText.toLowerCase())




      );
    }
  }
}
