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
  selector: 'app-esmtonnagereport',
  templateUrl: './esmtonnagereport.component.html',
  styleUrls: ['./esmtonnagereport.component.css'],
  providers: [DatePipe]

})
export class EsmtonnagereportComponent {

  loading: boolean = false;
  ESMTonnageReportForm!: FormGroup;
  EsmReportList: any[] = [];
  EsmReportListCount: number = 0;
  EsmReportList_backup: any[] = [];

  From_Date: any;
  To_Date: any;
  strQueryString: string | undefined;

  currentDate = new Date();
  iframeurl!: SafeResourceUrl;
  // iframeurl: SafeUrl | undefined
  showIframe = false;

  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  searchResult = true;
  maxSize: number = 10;

  constructor(public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private tosterService: ToastrService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe

  ) {
    this.ESMTonnageReportForm = this.formBuilder.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.commonService.changeTitle('ESMTonnage | ODOS');



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
      this.ESMTonnageReportForm.controls["FromDate"].setValue(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'));


    }
    else {
      this.ESMTonnageReportForm.controls["FromDate"].setValue(this.From_Date);

    }
  }

  reset() {
    this.ESMTonnageReportForm.reset();

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

  getReportData() {

    try {
      debugger;

      const startDate: string = this.From_Date;
      const endDate: string = this.To_Date;


      this.loading = true;
      
      this.commonService.GetEsmTonnageReport(startDate, endDate).subscribe({
        next: (response) => {
          this.EsmReportList = response;
          this.EsmReportListCount = this.EsmReportList.length;
          console.log("Esm report data", this.EsmReportList);

          if (this.EsmReportList.length <= 0) {
            this.EsmReportList = [];
            this.EsmReportListCount = 0;
            alert("Record not found");
            return;

          }
          this.showIframe=true;
          this.loading = false;


        },
        error: (e) => {

        },
        complete: () => {
          this.loading = false;
          this.EsmReportList_backup = JSON.parse(JSON.stringify(this.EsmReportList));
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
    this.listTodownload = this.EsmReportList.map(item => ({
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
}
