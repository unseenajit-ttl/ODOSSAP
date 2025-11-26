import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { StdProdDetailsModels } from 'src/app/Model/StdProdDetailsModels';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ProcessSharedServiceService } from '../../process-order/SharedService/process-shared-service.service';
import { LoginService } from 'src/app/services/login.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateordersharedserviceService } from '../../createorder/createorderSharedservice/createordersharedservice.service';
import { Result } from 'src/app/Model/Result';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { number } from 'mathjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'
import saveAs from 'file-saver';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-pile-entry',
  templateUrl: './pile-entry.component.html',
  styleUrls: ['./pile-entry.component.css']
})
export class PileEntryComponent {
  PileDataInsert!: FormGroup;
  toggleFilters = false;
  columnName = [
    'S/N', 'Pile dia (mm)', 'No of Main Bar', 'Cage Length (m)',
    'L1 (min.100)', 'Nos','Dia','Spacing', 'L2 (min.100)', 'Straight or crank',
    'Qty', 'Type of cages', 'Est. Wt (t)','Concrete Cover', 'Pile Type', 'Delivery Date (dd/mm/yyyy)', 'Remarks', 'Actions'
  ];

  customerList: any = [];

  PileDataArray: any[] = [];
  jobID:any = 0;
  newPileData:PreCastDetails[]=[{
    bpc_ID: 0,
    CustomerCode: '',
    ProjectCode: '',
    PileDia: 0,
    NoofMainBar: '',
    CageLength: 0,
    L1: 0,
    NOs: 0,
    Dia: '',
    Spacing: 0,
    L2: '',
    StraightCrank: '',
    Qty: 0,
    TypeOfCages: '',
    EstimationWt: undefined,
    Remark: '',
    JobId: 0,
    Concrete_cover: 0,
    DeliveryDate: undefined,
    PileType: ''
  }];
  pileDia_dropdown = [ 'T10','T13','T16','H10','H13','H16']
  Types_of_cage = ['T','M','E']
  cage_location = ["Straight","Crank"];

  loading: boolean = true;
  SelectedCustomer: any;
  SelectedProjectID: any;
  isSubmit: boolean = false;
  enableEditIndex: any;

  selectedFileName: string | null = null;
  isFileSelectorOpen = true;
  StraightCranklist:any;

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    public orderservice: OrderService,
    public commonService: CommonService,
    private toastr: ToastrService,
    public router: Router,
    private dropdown: CustomerProjectService
  ) {

      this.StraightCranklist = [
        { value: 'Straight' },
        { value: 'Crank' }
      ];
    }

  ngOnInit(): void {
    debugger


    this.PileDataInsert = this.fb.group({
      pileDia: ['', Validators.required],
      mainBar: ['', Validators.required],
      cageLength: ['', Validators.required],
      L1: ['', [Validators.required, Validators.min(100)]],
      Nos: ['', Validators.required],
      Dia: ['', Validators.required],
      Spacing: ['', Validators.required],
      L2: [''],
      straightOrCrank: [''],
      qty: ['', Validators.required],
      typeOfCages: [''],
      estWt: ['', Validators.required],
      remarks: [''],
      concrete_cover:[''],
      pileType:[''],
      deliveryDate:['']
    });
    this.SelectedProjectID =this.dropdown.getProjectCode();
    this.SelectedCustomer = this.dropdown.getCustomerCode();
    this.jobID = localStorage.getItem('PileEntryData');

    this.LoadPileData(this.SelectedCustomer,this.SelectedProjectID[0],this.jobID);
    console.log(this.SelectedProjectID,this.SelectedCustomer,"avscjavschsavckasc");

  }


  LoadPileData(customerCode: any,ProjectCode: any,JobID:number) {
    debugger

    this.loading = true;

    this.orderservice.GetBPCJobAdviceDetails(customerCode,ProjectCode,JobID).subscribe({
      next: (response: any[]) => {
        console.log("Pile Data=>",response);

        this.PileDataArray = response;

        this.backup_PileDataArray = JSON.parse(JSON.stringify(this.PileDataArray));



      },
      error: (e) => {
        this.toastr.error(e.error);
        this.loading = false;

      },
      complete: () => {

        this.loading = false;


      },
    });



  }


  insertPileData() {
    debugger;
    this.loading = true;

    if(this.SelectedCustomer==''||this.SelectedProjectID==''){
      this.toastr.warning("Please select Customer and Project!")
    }
    else if (!this.PileDataInsert.valid) {
      this.toastr.warning('Please fill in all the required fields!');
      return;
    }
    else{

     let InsertObj:PreCastDetails =
     {

      bpc_ID: 0,
      CustomerCode: this.SelectedCustomer,
      ProjectCode:this.SelectedProjectID.toString(),
      PileDia: this.PileDataInsert.value.pileDia,
      NoofMainBar: this.PileDataInsert.value.mainBar,
      CageLength: this.PileDataInsert.value.cageLength,
      L1 :this.PileDataInsert.value.L1,
      NOs: this.PileDataInsert.value.Nos,
      Dia: this.PileDataInsert.value.Dia,
      Spacing: this.PileDataInsert.value.Spacing,
      L2:this.PileDataInsert.value.L2,
      StraightCrank: this.PileDataInsert.value.straightOrCrank,
      Qty: this.PileDataInsert.value.qty,
      TypeOfCages: this.PileDataInsert.value.typeOfCages,
      EstimationWt: this.PileDataInsert.value.estWt,
      Remark: this.PileDataInsert.value.remarks,
      JobId:this.jobID,
      Concrete_cover:this.PileDataInsert.value.concrete_cover,
      PileType: this.PileDataInsert.value.pileType,
      DeliveryDate: this.PileDataInsert.value.deliveryDate,
     };


      this.orderservice.InsertBPCJobAdviceDetails(InsertObj).subscribe({

      next: (response: number) => {
        if (response) {
          this.toastr.success("Saved Successfully.");
          this.AddReset();
        }

        else {
          this.toastr.warning("Error in Saving Data.");
        }

      },
      error: (e: any) => {
      console.log(e);
      this.loading = false;

      },
      complete: () => {
        debugger;
        this.loading = false;
        this.AddReset();
        this.LoadPileData(this.SelectedCustomer,this.SelectedProjectID[0],this.jobID);
      },
      });

    }



  }

  AddReset() {
    this.isSubmit = false
    // this.newPileData = [{
    //   bpc_ID: 0,
    //   CustomerCode: this.SelectedCustomer,
    //   ProjectCode:this.SelectedProjectID,
    //   PileDia: 0,
    //   NoofMainBar: '',
    //   CageLength: 0,
    //   L1: 0,
    //   NOs: 0,
    //   Dia: '',
    //   Spacing: 0,
    //   L2:'',
    //   StraightCrank: '',
    //   Qty: 0,
    //   TypeOfCages: '',
    //   EstimationWt: undefined,
    //   Remark: '',
    //   JobId:this.jobID
    // }];
  }
  EditData(item: any, index: any) {
    debugger;
    //this.pagesList = JSON.parse(JSON.stringify(this.backup_pagesList));
    this.enableEditIndex = index;
  }

  backup_PileDataArray: any;

  EditCancle() {
    debugger;
    this.enableEditIndex = -1;
    this.PileDataArray = JSON.parse(JSON.stringify(this.backup_PileDataArray));
  }

  UpdatePile(item: any) {

    debugger;
    this.loading = true;

    if(this.SelectedCustomer==''||this.SelectedProjectID==''){
      this.toastr.warning("Please select Customer and Project!")
    }

    else{

      let InsertObj:PreCastDetails =
      {
        bpc_ID: item.bpc_ID,
        CustomerCode: this.SelectedCustomer,
        ProjectCode: this.SelectedProjectID.toString(),
        PileDia: item.PileDia,
        NoofMainBar: item.NoofMainBar,
        CageLength: item.CageLength,
        L1: item.L1,
        NOs: item.NOs,
        Dia: item.Dia,
        Spacing: item.Spacing,
        //L2: item.L2,
        L2: item.L2 != null ? item.L2 : '',
        StraightCrank: item.StraightCrank,
        Qty: item.Qty,
        TypeOfCages: item.TypeOfCages,
        EstimationWt: item.EstimationWt,
        Remark: item.Remark,
        JobId: this.jobID,
        Concrete_cover: Number(item.Concrete_cover),
        DeliveryDate: item.DeliveryDate,
        PileType: item.PileType
      };

      this.orderservice.UpdateBPCJobAdviceDetails(InsertObj).subscribe({

        next: (response: number) => {
          if (response) {
            this.toastr.success("Updated Successfully.");
          }

          else {
            this.toastr.warning("Error in Saving Data.");
          }

        },
        error: (e: any) => {
        console.log(e);
        this.loading = false;

        },
        complete: () => {
          debugger;
          this.loading = false;
          this.enableEditIndex = -1;
          this.LoadPileData(this.SelectedCustomer,this.SelectedProjectID[0],this.jobID);
        },
      });

    }


  }

  Delete_Pile(pileId: any): void {
    debugger
    //this.PileDataArray = this.PileDataArray.filter(item => item.bpc_ID !== pileId);

    this.orderservice.DeleteBPCJobAdviceDetails(pileId).subscribe({
      next: (response) => {
        this.loading=true
        if (response) {
          this.toastr.success("Record deleted successfully.");

        }
        else{
          this.toastr.error("Error in deleting Data.");

        }

      },
      error: (e) => {
        this.toastr.error(e.error)
      },
      complete: () => {
        this.LoadPileData(this.SelectedCustomer,this.SelectedProjectID[0],this.jobID);
        this.loading=false;
      },
    });

  }

  generatePDF() {
    const doc = new jsPDF('landscape'); // Set landscape orientation

    // Add a title to the PDF
    doc.setFontSize(16);
    doc.text('JOB ADVICE (BORED PILE)', 14, 15);

    const headers = [
      'S/N',
      'Pile Dia (mm)',
      'No of Main Bar',
      'Cage Length (m)',
      'L1 (min.100)',
      'Nos',
      'Dia',
      'Spacing',
      'L2 (min.100)',
      'Straight or Crank',
      'Qty',
      'Type of Cages',
      'Est. Wt (t)',
      'PileType',
      'DeliveryDate',
      'Remarks'
    ];

    // Define the rows dynamically from PileDataArray
    const rows = this.PileDataArray.map((item: any, index: number) => [
      index + 1, // Serial Number
      item.PileDia || '', // Pile dia (mm)
      item.NoofMainBar || '', // No of Main Bar
      item.CageLength || '', // Cage Length (m)
      item.L1 || '', // L1 (min.100)
      item.NOs || '', // Links
      item.Dia || '',
      item.Spacing || '',
      item.L2 || '', // L2 (min.100)
      item.StraightCrank || '', // Straight or crank
      item.Qty || '', // Qty
      item.TypeOfCages || '', // Type of cages
      item.EstimationWt || '', // Est. Wt (t)
      item.PileType || '', 
      item.DeliveryDate || '', 
      item.Remark || '', // Remarks
    ]);

    // Define column widths to ensure headers fit in one line
    const columnStyles = {
      0: { cellWidth: 20, halign: 'center' }, // Serial Number
      1: { cellWidth: 30, halign: 'center' }, // Pile Dia
      2: { cellWidth: 35, halign: 'center' }, // No of Main Bar
      3: { cellWidth: 40, halign: 'center' }, // Cage Length
      4: { cellWidth: 30, halign: 'center' }, // L1
      5: { cellWidth: 30, halign: 'center' }, // Links
      6: { cellWidth: 30, halign: 'center' }, // Dia
      7: { cellWidth: 30, halign: 'center' }, // Spacing
      8: { cellWidth: 30, halign: 'center' }, // L2
      9: { cellWidth: 40, halign: 'center' }, // Straight or Crank
      10: { cellWidth: 30, halign: 'center' }, // Qty
      11: { cellWidth: 40, halign: 'center' }, // Type of Cages
      12: { cellWidth: 40, halign: 'center' }, // Est. Wt
      13: { cellWidth: 50, halign: 'center' }, // Remarks
    };

    // Add the table to the PDF
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 25, // Start position below the title
      theme: 'grid',
      headStyles: {
        //fillColor: [221, 221, 221], // Light gray background for headers
        fontSize: 10, // Font size for headers
        halign: 'center', // Center align header text
      },
      bodyStyles: {
        fontSize: 9, // Font size for body cells
      },
      columnStyles:{

        styles: {
          overflow: 'linebreak', // Allow content to break into new lines if necessary
          cellPadding: 3, // Add padding inside cells
        },
      } // Apply column styles

    });

    // Save the PDF
    doc.save('PileDataReport.pdf');
  }

  SaveJobAdvice(isAllSaved: boolean): void {
    console.log('Saving Pile Data');
  }


  downloadExcelTemplate() {
    // Define the header row
    const headerRow = [

      'Pile_Dia',
      'No_of_MainBar',
      'CageLength',
      'L1',
      'Nos',
      'Dia',
      'Spacing',
      'L2',
      'StraightOrCrank',
      'Qty',
      'TypeofCages',
      'EstimationWt',
      'concrete_cover',
      'PileType',
      'DeliveryDate (dd/mm/yyyy)',
      'Remarks'
    ];
    // Create an empty template row with placeholders
    const templateRow = headerRow.map(() => "");

    // Combine the header and template row
    const data = [headerRow, templateRow];

    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pile Data Template");

    // Generate and save the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Template.xlsx");
  }


  data: any = [];
  columns: { [key: string]: any[] } = {};  // To store columns as arrays

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isFileSelectorOpen = true;
    // Ensure the user uploaded a file
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const input = evt.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      const reader: FileReader = new FileReader();

      // Read the file as binary string
      reader.onload = (e: any) => {
        const binaryString: string = e.target.result;

        // Parse the workbook
        const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

        // Get the first sheet
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON format with the first row as headers
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("Raw JSON Data:", jsonData);

        // Transform rows into columns, using the first row as headers

        this.columns = this.transformToColumns(jsonData);

        console.log("Columns===>",this.columns);  // Now the columns object has column headers as keys and data as arrays

      };

      reader.readAsBinaryString(target.files[0]);
    } else {
      this.selectedFileName = null; // No file selected
    }
  }

  transformToColumns(rows: any[][]): { [key: string]: any[] } {
    debugger;
    const columns: { [key: string]: any[] } = {};

    // Ensure there are rows and the first row has headers
    if (rows.length === 0) return columns;

    const headers = rows[0]; // First row as column headers

    // Initialize columns based on headers, replacing spaces with underscores
    headers.forEach((header: string, index: number) => {
      const sanitizedHeader = header.replace(/\s+/g, '_');  // Replace spaces with underscores
      columns[sanitizedHeader] = [];
    });

    // Fill the columns with data (starting from the second row)
    for (let i = 1; i < rows.length; i++) {
      headers.forEach((header: string, index: number) => {
        const sanitizedHeader = header.replace(/\s+/g, '_');
        columns[sanitizedHeader].push(rows[i][index]);
      });
    }

    return columns;
  }

  openFileSelector() {
    this.isFileSelectorOpen = false;
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.click();
  }

  clearFile(): void {
    this.selectedFileName = null;
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.value = ''; // Reset the file input value
  }


  submitThroughExcel(){
    debugger
    let PileDiaArray = this.columns.Pile_Dia;
    console.log('Array==>',PileDiaArray)
    let NoofMainBarArray = this.columns.No_of_MainBar;
    let CageLengthArray = this.columns.CageLength;
    let L1Array=this.columns.L1;
    let NOsArray= this.columns.Nos;
    let DiaArray= this.columns.Dia;
    let SpacingArray=this.columns.Spacing;
    let L2Array=this.columns.L2!=null?(this.columns.L2).toString():'';

    let StraightCrankArray=this.columns.StraightOrCrank;
    let QtyArray=this.columns.Qty;
    let TypeOfCagesArray=this.columns.TypeofCages;
    let EstimationWtArray= this.columns.EstimationWt;
    let RemarksArray=this.columns.Remarks;
    let coverArray=this.columns.concrete_cover;
    let PileTypeArray=this.columns.PileType;
    let DelvDateArray=this.columns.DeliveryDate;


    for (let i = 0; i < PileDiaArray.length; i++) {
      const BPCObj:PreCastDetails= {
        bpc_ID: 0,
        CustomerCode: this.SelectedCustomer,
        ProjectCode: this.SelectedProjectID.toString(),
        PileDia: PileDiaArray[i],
        NoofMainBar: NoofMainBarArray[i].toUpperCase(),
        CageLength: CageLengthArray[i],
        L1: L1Array[i],
        NOs: NOsArray[i],
        Dia: DiaArray[i].toUpperCase(),
        Spacing: SpacingArray[i].toString(),
        L2: L2Array[i] != null ? (L2Array[i]).toString() : '',
        StraightCrank: StraightCrankArray[i],
        Qty: QtyArray[i],
        TypeOfCages: TypeOfCagesArray[i],
        EstimationWt: EstimationWtArray[i],
        Remark: RemarksArray[i].toString(),
        JobId: Number(this.jobID),
        Concrete_cover: Number(coverArray[i]),
        DeliveryDate:DelvDateArray[i] ,
        PileType: PileTypeArray[i]
      };
      console.log("Object",BPCObj)
      if (this.SelectedCustomer!='' && this.SelectedProjectID!='') {
        this.orderservice.InsertBPCJobAdviceDetails(BPCObj).subscribe({
          next: (response) => {
            if (response) {
              this.toastr.success(`Saved Successfully for record ${i + 1}`);
              this.AddReset();
            }
            else
            {
              this.toastr.error(`Error in Uploading Data ${i + 1}`)
            }


          },
          error: (e) => {
            console.log(e);
            this.loading = false;

          },
          complete: () => {
            debugger;
            this.loading = false;

            this.LoadPileData(this.SelectedCustomer,this.SelectedProjectID,this.jobID);
            this.clearFile();
          },
        });

      }
      else {
        this.toastr.warning(`Please select Customer and Project`)
      }
    }
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
  goBack()
  {
    this.router.navigate(['/order/createorder/bpc']);

  }

}
export interface PreCastDetails {
  bpc_ID: number;
  CustomerCode: string;
  ProjectCode: string;
  PileDia:number;
  NoofMainBar:string;
  CageLength:number;
  L1:number;
  NOs:number;
  Dia:string;
  Spacing :number;
  L2:string;
  StraightCrank: string ;
  Qty :number;
  TypeOfCages:string;
  EstimationWt:any;
  Remark:string,
  JobId:number,
  Concrete_cover:any,
  DeliveryDate:any,
  PileType:string
}

