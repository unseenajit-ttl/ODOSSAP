import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ToastrService } from 'ngx-toastr';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";
import { pipe } from 'rxjs';
import { style } from '@angular/animations';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-order-status-monitoring',
  templateUrl: './order-status-monitoring.component.html',
  styleUrls: ['./order-status-monitoring.component.css']
})
export class OrderStatusMonitoringComponent {

  loading: boolean = false;
  OrderStatusReportForm!: FormGroup;
  MissingGIReportForm!: FormGroup;
  OrderStatusList: any[] = [];
  OrderStatusListCount: number = 0;
  OrderStatusList_backup: any[] = [];
  tableColumns: string[] = [];

  MissingGIList: any[] = [];
  MissingGIListCount: number = 0;
  MissingGIList_backup: any[] = [];
  tableColumnsMissingGI: string[] = [];

  selectedProductType:string=''; 
  
  ProducttypeList :any[] = [];

  selectedProductType1:string=''; 
  
  ProducttypeList1 :any[] = [];

  From_Date: any;
  To_Date: any;
  From_Date1: any;
  To_Date1: any;
  strQueryString: string | undefined;

  currentDate = new Date();
  iframeurl!: SafeResourceUrl;
  // iframeurl: SafeUrl | undefined
  showIframe = false;
  showIframeMGI = false;

  page = 1;
  pageSize = 0;
  pageSize1 = 0;
  currentPage = 1;
  currentPage1 = 1;
  itemsPerPage: number = 20;
  itemsPerPage1: number = 20;
  searchResult = true;
  maxSize: number = 20;

  constructor(public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private tosterService: ToastrService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe

  ) {
    
  }

  setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    this.OrderStatusReportForm.patchValue({
      FromDate: today,
      ToDate: today
    });
    this.MissingGIReportForm.patchValue({
      FromDate1: today,
      ToDate1: today
    });
  }

  ngOnInit(): void {
    this.OrderStatusReportForm = this.formBuilder.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required]
    })

    this.MissingGIReportForm = this.formBuilder.group({
      FromDate1: ['', Validators.required],
      ToDate1: ['', Validators.required]
    })
    this.commonService.changeTitle('OrderStatusMonitoring | ODOS')
    this.setDefaultDates();
    console.log('1425',this.OrderStatusReportForm.value);
  }

  // viewReport() {
  //   debugger
  //   const startDate: string = this.From_Date;
  //   const endDate: string = this.To_Date;


  //   if (startDate && endDate) {
  //     if (startDate > endDate) {
  //       this.tosterService.warning("Select Valid Date Range");
  //       return;
  //     }

  //     else {

  //       let esmtonnagereport = "http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fESMReleasedReport&rs:Command=Render&";//paste url here
  //       this.strQueryString = esmtonnagereport + "FromDate=" + startDate + "&ToDate=" + endDate + "&rc:Parameters=false";

  //       // this.iframeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.strQueryString)
  //       // this.showIframe = true;

  //     }

  //     console.log(this.strQueryString);
  //     window.open(this.strQueryString, "_blank");

  //   }

  //   else {
  //     this.tosterService.warning("Select Required fields!")
  //   }
  // }


  viewReport() {
    debugger
    const startDate: string = this.From_Date;
    const endDate: string = this.To_Date;


    if (startDate && endDate) {
      if (startDate > endDate) {
        this.tosterService.warning("Select Valid Date Range");
        return;
      }

      else {
        this.getReportData();
        this.showIframe = true;
      }


    }

    else {
      this.tosterService.warning("Select Required fields!")
    }
  }


  checkSelectedDate(): void {
    debugger
    let selectedDate = this.From_Date;
    //const currentDate: Date = new Date();
    const selectedDateTime: Date = new Date(selectedDate);

    if (selectedDateTime > this.currentDate) {
      alert("You cannot select a Day after Today!");
      this.OrderStatusReportForm.controls["FromDate"].setValue(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'));


    }
    else {
      this.OrderStatusReportForm.controls["FromDate"].setValue(this.From_Date);
      
    }
  }

  reset() {
    this.OrderStatusReportForm.reset();

  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    // this.enableEditIndex = null;
  }

  public onPageChange1(pageNum: number): void {
    this.pageSize1 = this.itemsPerPage1 * (pageNum - 1);
    // this.enableEditIndex = null;
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    // this.enableEditIndex = null;
  }

  OnPageSizeChange1(pageSize: number) {
    this.pageSize1 = 0;
    this.currentPage1 = 1;
    // this.enableEditIndex = null;
  }

  checkSelectedDate1(): void {
    debugger
    let selectedDate = this.From_Date1;
    //const currentDate: Date = new Date();
    const selectedDateTime: Date = new Date(selectedDate);

    if (selectedDateTime > this.currentDate) {
      alert("You cannot select a Day after Today!");
      this.MissingGIReportForm.controls["FromDate1"].setValue(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'));


    }
    else {
      this.MissingGIReportForm.controls["FromDate1"].setValue(this.From_Date1);

    }
  }


  getReportData() {

    try {
      debugger;

      const startDate: string = this.From_Date;
      const endDate: string = this.To_Date;

      this.loading = true;
      console.log('this.selectedProductType',this.selectedProductType)
      this.commonService.GetOrderStatus(startDate, endDate,this.selectedProductType).subscribe({
        next: (response) => {
          this.OrderStatusList = response;
          this.OrderStatusListCount = this.OrderStatusList.length;
          console.log("Order Status Data", this.OrderStatusList);

          if (this.OrderStatusList.length <= 0) {
            this.OrderStatusList = [];
            this.OrderStatusListCount = 0;
            alert("Record not found");
            return;

          }
          else
          {
            this.tableColumns = Object.keys(response[0]);
          }
          this.showIframe=true;
          this.loading = false;


        },
        error: (e) => {

        },
        complete: () => {
          this.loading = false;
          this.OrderStatusList_backup = JSON.parse(JSON.stringify(this.OrderStatusList));
        },
      });

    }
    catch (err: any) {
      alert(err.error);
    }
  }

  name: string = '';
  listTodownload: any;

  downloadFile(): void {
    this.getReportData();
    //this.listTodownload = this.EsmReportList;
    this.listTodownload = this.OrderStatusList.map(item => ({
      ...item,
      // Convert date string to a Date object without time
      PostedDate: new Date(item.PostedDate + 'T00:00:00'),// Append time as zero
      ReleasedDate: new Date(item.ReleasedDate + 'T00:00:00') // Append time as zero

    }));
    this.name = 'EsmReleasedTonnageReport'
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
    link.download = this.name + ".xlsx";
    link.click();
  }

  viewReport1() {
    debugger
    const startDate: string = this.From_Date1;
    const endDate: string = this.To_Date1;


    if (startDate && endDate) {
      if (startDate > endDate) {
        this.tosterService.warning("Select Valid Date Range");
        return;
      }

      else {
        this.getReportData1();
        this.showIframeMGI = true;
      }


    }

    else {
      this.tosterService.warning("Select Required fields!")
    }
  }

  getReportData1() {

    try {
      debugger;

      const startDate: string = this.From_Date1;
      const endDate: string = this.To_Date1;

      this.loading = true;
      
      this.commonService.GetMissingGIOrders(startDate, endDate,this.selectedProductType1).subscribe({
        next: (response) => {
          this.MissingGIList = response;
          this.MissingGIListCount = this.MissingGIList.length;
          console.log("Missing GI report data", this.MissingGIList);

          if (this.MissingGIList.length <= 0) {
            this.MissingGIList = [];
            this.MissingGIListCount = 0;
            alert("Record not found");
            return;

          }
          else
          {
            this.tableColumnsMissingGI = Object.keys(response[0]);
          }
          this.showIframeMGI=true;
          this.loading = false;


        },
        error: (e) => {
          this.loading = false;
          console.error('Failed to load data', e);
        },
        complete: () => {
          this.loading = false;
          this.MissingGIList_backup = JSON.parse(JSON.stringify(this.MissingGIList_backup));
        },
      });

    }
    catch (err: any) {
      alert(err.error);
    }
  }

  getProductType() {

    try {
      debugger;

      const startDate: string = this.From_Date;
      const endDate: string = this.To_Date;
      
      this.commonService.GetProductTypeOrderStatus(startDate, endDate).subscribe({
        next: (response) => {
          this.ProducttypeList = response;
        },
        error: (e) => {
          console.error('Failed to load product types', e);
        },
      });

    }
    catch (err: any) {
      alert(err.error);
    }
  }

  getProductType1() {

    try {
      debugger;

      const startDate: string = this.From_Date1;
      const endDate: string = this.To_Date1;
      
      this.commonService.GetProductTypeOrderStatus(startDate, endDate).subscribe({
        next: (response) => {
          this.ProducttypeList1 = response;
        },
        error: (e) => {
          console.error('Failed to load product types', e);
        },
      });

    }
    catch (err: any) {
      alert(err.error);
    }
  }


  
}
