import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { lastValueFrom } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';



@Component({
  selector: 'app-tonnagereport',
  templateUrl: './tonnagereport.component.html',
  styleUrls: ['./tonnagereport.component.css']
})
export class TonnagereportComponent {

  TonnageReportForm!: FormGroup;
  TonnageReportList: any[] = [];
  TonnageReportListCount: number = 0;
  TonnageReportList_backup: any[] = [];

  loading: boolean = false;
  UserID: any;
  From_Date: any;
  To_Date: any;
  UserList: any = [];
  ReportTypeList: any;

  LoadingUserName: boolean = true;
  strQueryString: string | undefined;

  UserName: any;
  Reporttype: any
  IntGroupMarkId: number | undefined;
  ProductTypeID: number | undefined;


  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  searchResult = true;
  maxSize: number = 10;

  dropdownSettings = {};
  constructor(public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private tosterService: ToastrService,
    private datePipe: DatePipe


  ) {
    this.TonnageReportForm = this.formBuilder.group({
      user: ['', Validators.required],
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required]
    })

    this.ReportTypeList = [
      { type: 'Released' },
      { type: 'Cancelled' }
    ]
  }

  ngOnInit(): void {
    this.commonService.changeTitle('TonnageReport | ODOS');
    this.GetUsers();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'intUserId',
      textField: 'vchUserName',
      //selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


  }

  selectChange() {

    this.UserID = this.TonnageReportForm.get("user")?.value;
  }

  GetUsers(): void {
    debugger;

    this.commonService.GetUsers().subscribe({
      next: (response) => {
        debugger;
        this.UserList = response;
        console.log("UserList", this.UserList);
      },
      error: (e) => {
      },
      complete: () => {
        debugger;
        this.LoadingUserName = false;

      },
    });

  }

  showIframe = false;

  viewReport() {
    debugger
    const startDate: Date = this.From_Date;
    const endDate: Date = this.To_Date;
    const user: string = this.UserName;
    const rptType: string = this.Reporttype;


    if (startDate && endDate && user) {
      if (startDate > endDate) {
        this.tosterService.warning("Select Valid Date Range");
        return;
      }


      else {


        // let tonnagereport = "http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fTonnageReport1&rs:Command=Render&";//paste url here
        // this.strQueryString = tonnagereport + "FromDate=" + startDate + "&ToDate=" + endDate + "&user=" + user + "&RptType=" + rptType + "&rc:Parameters=false ";

        this.getReportData();
        this.showIframe = true;



      }

    }

    else {
      this.tosterService.warning("select all required fields!")
    }
  }




  currentDate = new Date();

  checkSelectedDate(): void {
    debugger
    let selectedDate = this.From_Date;
    //const currentDate: Date = new Date();
    const selectedDateTime: Date = new Date(selectedDate);

    if (selectedDateTime > this.currentDate) {
      alert("You cannot select a Day after Today!!");
      this.TonnageReportForm.controls["FromDate"].setValue(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'));
      //set the date back to the current date   



    }
    else {
      this.TonnageReportForm.controls["FromDate"].setValue(this.From_Date);

    }
  }

  reset() {
    this.TonnageReportForm.reset();

  }

  getReportData() {


    debugger;

    const startDate: string = this.From_Date;
    const endDate: string = this.To_Date;

    this.loading = true;
    let response = [];
    this.TonnageReportList = [];
    let USerIDs = ''
    this.UserName.forEach((element: any) => {
      USerIDs = USerIDs + element.intUserId.toString() + ','
    });
    this.commonService.GetTonnageReport(startDate, endDate, USerIDs, this.Reporttype).subscribe({
      next: (response) => {
        this.TonnageReportList = response;
        this.TonnageReportListCount = this.TonnageReportList.length;
        console.log("Esm report data", this.TonnageReportList);

        if (this.TonnageReportList.length <= 0) {
          this.TonnageReportList = [];
          this.TonnageReportListCount = 0;
          alert("Record not found");
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
        this.TonnageReportList_backup = JSON.parse(JSON.stringify(this.TonnageReportList));
      },
    });






  }
  name: string = '';
  listTodownload: any;

  downloadFile() {

    this.listTodownload = this.TonnageReportList.map(item => ({
      ...item,

      PostedDate: new Date(item.PostedDate + 'T00:00:00'),// Append time as zero
      ReleasedDate: new Date(item.ReleasedDate + 'T00:00:00') // Append time as zero
      

    }));


    if (this.Reporttype === "Released") {
      this.name = 'ReleasedTonnageReport';
    } else {
      this.name = 'CancelledTonnageReport';
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listTodownload);

    // Apply proper date formatting for Excel
    Object.keys(worksheet).forEach(cell => {
      if (cell.startsWith('B') && worksheet[cell].v instanceof Date) {
        worksheet[cell].z = 'yyyy/mm/dd'; // Optional: Set display format
      }
    });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'export');
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


