import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EsmPopUpDragDropComponent } from '../esm-pop-up-drag-drop/esm-pop-up-drag-drop.component';
import { DrainService } from 'src/app/Detailing/MeshDetailing/drain-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';


interface TableRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  editable?: boolean;
}

@Component({
  selector: 'app-esm-custom-views',
  templateUrl: './esm-custom-views.component.html',
  styleUrls: ['./esm-custom-views.component.css'],
})
export class EsmCustomViewsComponent implements OnInit {
  isLoding: boolean = false;
  trackNo : string=""
  selectedViewIndex : number = -1;
  // rows: TableRow[] = [
  //   { col1: 'A1', col2: 'B1', col3: 'C1', col4: 'D1', editable: false },
  //   { col1: 'A2', col2: 'B2', col3: 'C2', col4: 'D2', editable: false },
  // ];
  CustomViewData:any[]=[];
  id:any;
  colname:any;
  trackingNo:any;
  availableColumns:any[] = [];
  rows: any[] = [];
  selectedColumns:any[]=[];
  tableData:any[]=[];
  selectedColumns_new: any[]=[];
  loading:boolean=false;

  constructor(private modalService: NgbModal,private drainService:DrainService,private router:Router, private activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    this.trackingNo = this.activatedRoute.snapshot.queryParamMap.get('sorNo');
    if(this.trackingNo){
      this.getCustomViewData(this.trackingNo);
    }
  }
  trackByRow(index: number, item: any) {
    // each row is stable by index here; if rows have id use that
    return index;
  }

  trackByCol(index: number, col: string) {
    return col;
  }

  addRow() {
    this.rows.push({
      col1: '',
      col2: '',
      col3: 'C',
      col4: 'D',
      editable: true,
    });
  }

  editRow(index: number) {
    const row = this.rows[index];
    if (row.editable) {
      row.editable = false; // Save mode
    } else {
      row.editable = true; // Edit mode
    }
  }

  deleteRow(index: number) {
    this.drainService.DeleteEsmCustomViews(index).subscribe({
      next(value) {

      },
      error:(error)=>{

      },
      complete:()=>{


      }

    })
  }

 addRowAbove(item:any,index:number) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      EsmPopUpDragDropComponent,
      ngbModalOptions
    );
    let obj ={};
    if(item==0)
      {
        obj = {
          ID:0,
          TRACKINGNO:this.trackingNo,
          VIEWNAME:"",
          VIEWDESCRIPTION:"",
          CREATEDBY:"Tanmay",
          COLUMNIDS:"",

        }
      }
      else{
        obj = {
          ID:item.ID,
          TRACKINGNO:this.trackingNo,
          VIEWNAME:item.VIEWNAME,
          VIEWDESCRIPTION:item.VIEWDESCRIPTION,
          CREATEDBY:"Tanmay",
          COLUMNIDS:item.COLUMNIDS,

        }
      }

    modalRef.componentInstance.selectedRow =obj;
    modalRef.componentInstance.Method = this.rows.length  > 0 ?"Edit" : "update";
     modalRef.result.then((result: any) => {
        console.log("result=>",result);
        if(result){
          this.getCustomViewData(this.trackingNo);
        }
     });
  }

  onClose() {

  }
  getCustomViewData(trackingNo:string)
  {
    this.loading = true;
    this.drainService.GetCustomViews_ESM(trackingNo).subscribe({
      next:(response)=>{
        debugger
        this.CustomViewData = response.Data;
        console.log("CustomViewData",this.CustomViewData)
      },
      error:(error)=>{
        console.log(error);
        this.loading = false;
      },
      complete:()=>{
        this.getAvailableColumns();
        this.loading = false;
      }
    })
  }

  getAvailableColumns(){
    debugger
    this.drainService.GetAllColumnsEsm().subscribe({
      next: (response) => {
        debugger
        console.log(response);
        if(response && response.Data.length > 0){
          this.availableColumns = response.Data

        }
      },
      error: (e) => {},
      complete: () => {

        this.getEsmTrackingDetails();
      },
    });
  }
  getEsmTrackingDetails(){
    this.isLoding = true;
    this.drainService.GetEsmTrackingDetails(this.trackingNo).subscribe({
      next: (response) => {
        if(response && response.Data.length > 0){
          this.rows = response.Data;
          console.log("getEsmTrackingDetails",this.rows);
        }
      },
      error: (e) => {},
      complete: () => {
        this.isLoding = false;
        if(localStorage.getItem("selectedViewIndex")){
          this.selectedViewIndex = parseInt(localStorage.getItem("selectedViewIndex") || '-1');
          this.sortColumnOrder(this.CustomViewData[this.selectedViewIndex],this.selectedViewIndex);
        }
      },
    });
  }
  // sortColumnOrder(item:any)
  // {
  //   let splited_col = item.COLUMNIDS.split(";");
  //   this.clearRows();
  //   splited_col.forEach((element:any)=>{
  //       let obj = this.availableColumns.find(id=>id.ID.toString()==element);
  //       if(obj!=-1)
  //       {
  //         obj.Isselected = true;
  //       }
  //   })
  // }
  sortColumnOrder(item: any,index:number) {
    this.selectedViewIndex = index;
    localStorage.setItem("selectedViewIndex",index.toString());
    let splited_col = item.COLUMNIDS.split(';');
    this.clearRows();
    this.setTableData(splited_col);
  }
  clearRows()
  {
    this.tableData = [];
    this.selectedColumns = [];
  }

  backToDataset(){
    this.router.navigate(['/order/esm-new'], {
      queryParams: { sorNo: this.trackingNo},
    });
  }
  // exportToExcel(): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { Sheet1: worksheet },
  //     SheetNames: ['Sheet1'],
  //   };

  //   const excelBuffer: any = XLSX.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array',
  //   });
  //   const data: Blob = new Blob([excelBuffer], {
  //     type: 'application/octet-stream',
  //   });
  //   saveAs(data, 'custom_view.xlsx');
  // }
  exportToExcel(): void {
    const orderedKeys = this.selectedColumns.map(c => c.ColumnName);
    const customHeaders = this.selectedColumns.map(c => c.DisplayName);
  
    const dataRows = this.tableData.map(row =>
      orderedKeys.map(key => row[key] ?? '')
    );
  
    const worksheet = XLSX.utils.aoa_to_sheet([customHeaders, ...dataRows]);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'custom_view.xlsx');
  }
  
  setTableData(splited_col:any){
    this.selectedColumns = [];
    this.tableData = [];
    // Find matching rows in availableColumns based on splited_col IDs
    this.selectedColumns = splited_col
      .map((colId: string) =>
        this.availableColumns.find((obj) => obj.ID.toString() === colId || obj.ColumnName.toString() === colId)
      )
      .filter((obj: any) => obj !== undefined); // remove null/undefined if no match
      // this.selectedColumns_new = JSON.parse(JSON.stringify(this.selectedColumns));
    // this.selectedColumns = matchedRows.map((col:any) => col.DisplayName );

    this.tableData = this.rows.map((row) => {
      let newRow: any = {};
      // keep only matched columns, in the same order
      this.selectedColumns.forEach((col: any) => {
        if (row.hasOwnProperty(col.ColumnName)) {
          newRow[col.ColumnName] = row[col.ColumnName];
        }
      });

      return newRow;
    });
  }
}
