import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/SharedServices/CommonService';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-bpcordereentryreport',
  templateUrl: './bpcordereentryreport.component.html',
  styleUrls: ['./bpcordereentryreport.component.css']
})
export class BpcordereentryreportComponent {

  loading: boolean = false;
  BPCReportForm!: FormGroup;
  BPCReportList: any[] = [];
  BPCReportListCount: number = 0;
  BPCReportList_backup: any[] = [];

  From_Date: any;
  To_Date: any;
  strQueryString: string | undefined;
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
    this.BPCReportForm = this.formBuilder.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required]
    })
  }
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

  getReportData() {

    try {
      debugger;

      const startDate: string = this.From_Date;
      const endDate: string = this.To_Date;


      this.loading = true;

      this.commonService.GetBPCOrderReport(startDate, endDate).subscribe({
        next: (response) => {
          this.BPCReportList = response;
          this.BPCReportListCount = this.BPCReportList.length;
          console.log("BPC report data", this.BPCReportList);

          if (this.BPCReportList.length <= 0) {
            this.BPCReportList = [];
            this.BPCReportListCount = 0;
            alert("Record not found");
            return;

          }
          this.showIframe = true;
          this.loading = false;


        },
        error: (e) => {

        },
        complete: () => {
          this.loading = false;
          this.BPCReportList_backup = JSON.parse(JSON.stringify(this.BPCReportList));
        },
      });

    }
    catch (err: any) {
      alert(err.error);
    }
  }
  reset() {
    this.BPCReportForm.reset();

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
  name: string = '';
  listTodownload: any;
  downloadFile(): void {
    this.listTodownload = this.BPCReportList.map(item => ({
      ...item,
      // Convert date string to a Date object
      UpdateDate: new Date(item.UpdateDate + 'T00:00:00'), // Assuming UpdateDate is in valid date format
    }));

    this.name = 'BPCOrderEntryReport';

    // Convert the data to a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listTodownload);

    // Apply proper date formatting for the UpdateDate column
    Object.keys(worksheet).forEach(cell => {
      // Assuming 'UpdateDate' is in column 'Z', adjust the logic if needed
      if (cell.startsWith('Z') && worksheet[cell].v instanceof Date) {
        // Update cell's format to display as dd/mm/yyyy
        worksheet[cell].z = 'dd/mm/yyyy'; // Set display format for Excel
      }
    });

    // Create the workbook and add the worksheet
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Generate Excel file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save the Excel file
    this.saveAsExcelFile(excelBuffer, 'export');
  }
  
  

  // Helper function to format date as dd/mm/yyyy
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
