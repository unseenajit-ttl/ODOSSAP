import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/Orders/orders.service';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tonnage-report-customer-project',
  templateUrl: './tonnage-report-customer-project.component.html',
  styleUrls: ['./tonnage-report-customer-project.component.css'],
})
export class TonnageReportCustomerProjectComponent {
  TonnageReportForm!: FormGroup;
  TonnageReportList: any[] = [];
  TonnageReportListCount: number = 0;
  TonnageReportList_backup: any[] = [];
  customerList: any[] = [];
  projectList: any[] = [];

  loading: boolean = false;
  UserID: any;
  From_Date: any;
  To_Date: any;
  UserList: any = [];
  ReportTypeList: any;

  LoadingUserName: boolean = true;
  strQueryString: string | undefined;

  UserName: any;
  Reporttype: any;
  IntGroupMarkId: number | undefined;
  ProductTypeID: number | undefined;

  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  searchResult = true;
  maxSize: number = 10;

  dropdownSettings = {};
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private tosterService: ToastrService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private orderService: OrderService
  ) {
    this.TonnageReportForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      customerCode: ['', Validators.required],
      projectCode: ['', Validators.required],
      rptType: ['', Validators.required],
    });

    this.ReportTypeList = [{ type: 'Released' }, { type: 'Cancelled' }];
  }

  ngOnInit(): void {
    this.commonService.changeTitle('TonnageReport | ODOS');
    this.GetOrderCustomer();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'intUserId',
      textField: 'vchUserName',
      //selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  selectChange() {
    this.UserID = this.TonnageReportForm.get('user')?.value;
  }
  GetOrderCustomer(): void {
    //debugger;
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.customerList = response;
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }
  GetOrderProjectsList(pCustomerCode: any): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();
    this.orderService
      .GetProjects(pCustomerCode, pUserType, pGroupName)
      .subscribe({
        next: (response) => {
          this.projectList = response;
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  GetUsers(): void {
    debugger;

    this.commonService.GetUsers().subscribe({
      next: (response) => {
        debugger;
        this.UserList = response;
        console.log('UserList', this.UserList);
      },
      error: (e) => {},
      complete: () => {
        debugger;
        this.LoadingUserName = false;
      },
    });
  }

  showIframe = false;

  viewReport() {
    debugger;
    const startDate: Date = this.From_Date;
    const endDate: Date = this.To_Date;
    const user: string = this.UserName;
    const rptType: string = this.Reporttype;

    if (startDate && endDate && this.TonnageReportForm.valid) {
      if (startDate > endDate) {
        this.tosterService.warning('Select Valid Date Range');
        return;
      } else {
        // let tonnagereport = "http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fTonnageReport1&rs:Command=Render&";//paste url here
        // this.strQueryString = tonnagereport + "FromDate=" + startDate + "&ToDate=" + endDate + "&user=" + user + "&RptType=" + rptType + "&rc:Parameters=false ";

        this.getReportData();
        this.showIframe = true;
      }
    } else {
      this.tosterService.warning('select all required fields!');
    }
  }

  currentDate = new Date();

  checkSelectedDate(): void {
    debugger;
    let selectedDate = this.From_Date;
    //const currentDate: Date = new Date();
    const selectedDateTime: Date = new Date(selectedDate);
    if (selectedDateTime > this.currentDate) {
      alert('You cannot select a Day after Today!!');
      this.TonnageReportForm.controls['FromDate'].setValue(
        this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
      );
      //set the date back to the current date
    } else {
      this.TonnageReportForm.controls['fromDate'].setValue(this.From_Date);
    }
  }

  reset() {
    this.TonnageReportForm.reset();
  }

  getReportData() {
    const startDate: string = this.From_Date;
    const endDate: string = this.To_Date;
    this.loading = true;
    this.TonnageReportList = [];
    let projCode = this.TonnageReportForm.get('projectCode')?.value;
    if (this.TonnageReportForm.valid) {
      this.commonService
        .getTonnageReportByCustomerAndProject(
          startDate,
          endDate,
          projCode,
          this.TonnageReportForm.get('rptType')?.value
        )
        .subscribe({
          next: (response) => {
            this.TonnageReportList = response;
            this.TonnageReportListCount = this.TonnageReportList.length;
            console.log('Esm report data', this.TonnageReportList);

            if (this.TonnageReportList.length <= 0) {
              this.TonnageReportList = [];
              this.TonnageReportListCount = 0;
              alert('Record not found');
              return;
            }
            this.showIframe = true;
            this.loading = false;
          },
          error: (e) => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
            this.TonnageReportList_backup = JSON.parse(
              JSON.stringify(this.TonnageReportList)
            );
          },
        });
    }
  }

  name = 'TonnageReportBasedOnProject';
  listTodownload: any;

  downloadFile() {
    const startDate: string = this.From_Date;
    const endDate: string = this.To_Date;
    this.loading = true;
    this.TonnageReportList = [];
    let projCode = this.TonnageReportForm.get('projectCode')?.value;
    if (this.TonnageReportForm.valid) {
      this.commonService
        .getTonnageReportByCustomerAndProject(
          startDate,
          endDate,
          projCode,
          this.TonnageReportForm.get('rptType')?.value
        )
        .subscribe({
          next: (response) => {
            this.TonnageReportList = response;
            this.TonnageReportListCount = this.TonnageReportList.length;
            console.log('Esm report data', this.TonnageReportList);

            if (this.TonnageReportList.length <= 0) {
              this.TonnageReportList = [];
              this.TonnageReportListCount = 0;
              alert('Record not found');
              return;
            }
            this.showIframe = true;
            this.loading = false;
          },
          error: (e) => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
            this.TonnageReportList_backup = JSON.parse(
              JSON.stringify(this.TonnageReportList)
            );
            this.listTodownload = this.TonnageReportList;
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
              this.listTodownload
            );
            const workbook: XLSX.WorkBook = {
              Sheets: { data: worksheet },
              SheetNames: ['data'],
            };
            const excelBuffer: any = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'export');
          },
        });
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.name + '.xlsx';
    link.click();
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
}
