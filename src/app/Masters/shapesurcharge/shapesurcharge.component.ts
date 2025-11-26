import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
//import { MasterDialogComponent } from '../master-dialog/master-dialog.component';
import { CreateShapesurchargeComponent } from './create-shapesurcharge/create-shapesurcharge.component';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { Workbook } from 'exceljs';
import { ShapeSurchargeService } from '../Services/shape-surcharge.service';
import * as XLSX from 'xlsx'
import saveAs from 'file-saver';
import { Shapesurcharge } from 'src/app/Model/shapesurcharge';
import { Shapecodeshapesurcharge } from 'src/app/Model/shapecodeshapesurcharge';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';//src/app/SharedComponent/Dialogs/delete-dialog/delete-dialog.component
import { DeleteDialogComponent } from 'src/app/SharedComponent/Dialogs/delete-dialog/delete-dialog.component';
import { CommonService } from 'src/app/SharedServices/CommonService';

@Component({
  selector: 'app-shapesurcharge',
  templateUrl: './shapesurcharge.component.html',
  styleUrls: ['./shapesurcharge.component.css']

})
export class ShapesurchargeComponent implements OnInit {
  temp_ar_for_update: Shapesurcharge[] = []
  isLoading = true;
  maxSize = 5;
  formGroup!: FormGroup
  ShapeSurchargeForm!: FormGroup;
  submitted = false;
  formsubmit: boolean = true;
  searchResult = true;
  searchText: any = '';
  closeResult = '';
  searchBarDia: any
  searchInvoice: any;
  searchSurcharge: any;
  searchDiacondi: any;
  searchUserId: any;
  searchDate: any;
  filteredData: any[] = [];
  shapesurchargeList: Shapesurcharge[] = [];
  searchShapeCode: any;
  diaconditionList: any[] = [];
  surchargeList: any[] = [];
  toggleFilters = false;
  // shapesurchargeList: any[] = [];
  statuslist: any[] = [];

  isEditing: boolean = false;
  enableEditIndex: any = null;
  backup_update: Shapesurcharge = {
    ID: 0,
    ShapeCode_Id: 0,
    ShapeCode: '',
    Bar_Dia: 0,
    Invoice_Length: 0,
    Surcharge: '',
    Surchage_Code: 0,
    Condition_Id: 0,
    Dia_Condition: '',
    User_Id: '',
    Updated_Date: ''

  };
  ShapecodeList: Shapecodeshapesurcharge[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number = 0;
  TotalNumberofRecord: any;

  prev_index: any = null;
  // page = 1;
  // pageSize = 10;
  bardialist: any[] = [];
  arraylength: any;
  page: number = 1;


  constructor(private datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private shapesurchargeservice: ShapeSurchargeService,
    private tosterService: ToastrService,
    private route: ActivatedRoute, private commonService: CommonService) {

  }


  ngOnInit() {
    this.commonService.changeTitle('ShapeSurcharge | ODOS');
    this.LoadShapeSurchargeList();
    this.getShapeCodeList();
    this.getSurchargeDropdownList()
    // this.shapesurchargeList = this.shapesurchargeList
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

    // this.arraylength = this.shapesurchargeList.length;


    this.statuslist = [
      { item_id: true, item_text: 'Active' },
      { item_id: false, item_text: 'Inactive' }];


    this.bardialist = [
      { item_id: 8, item_text: '8' },
      { item_id: 10, item_text: '10' },
      { item_id: 12, item_text: '12' },
      { item_id: 13, item_text: '13' },
      { item_id: 16, item_text: '16' },
      { item_id: 20, item_text: '20' },

      { item_id: 22, item_text: '22' },
      { item_id: 25, item_text: '25' },
      { item_id: 32, item_text: '32' },
      { item_id: 40, item_text: '40' },
      { item_id: 50, item_text: '50' },

    ];
    this.diaconditionList = [
      { item_id: '<=BARDIA', item_text: '<=BARDIA' },
      { item_id: '==BARDIA', item_text: '==BARDIA' },
      { item_id: '>=BARDIA', item_text: '>=BARDIA' },

    ];
    // this.surchargeList = [
    //   { item_id: 'LINKS/STIRUPS', item_text: 'LINKS/STIRUPS' },
    //   { item_id: 'BARCHAIR', item_text: 'BARCHAIR' },
    //   { item_id: '3DSHAPE', item_text: '3DSHAPE' },
    //   { item_id: 'RADIALBEND', item_text: 'RADIALBEND' },

    // ];


    this.ShapeSurchargeForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      projectname: new FormControl('', Validators.required),
      projecttype: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),

    });

  }
  // convenience getter for easy access to form fields
  get f() { return this.ShapeSurchargeForm.controls; }

  getShapeCodeList() {
    this.shapesurchargeservice.GetShapeCodes().subscribe({
      next: (response) => {
        this.ShapecodeList = response;
        console.log(this.ShapecodeList);
      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }

  LoadShapeSurchargeList(): void {
    debugger;
    
    this.shapesurchargeList = this.route.snapshot.data['data'];
    // this.shapesurchargeservice.GetShapeSurchageList().subscribe({
    //   next: (response) => {
    //     this.ShapecodeList = response;
    //     console.log(this.ShapecodeList);
    //   },
    //   error: (e) => {

    //   },
    //   complete: () => {

    //   },

    // });

    this.isLoading = false;
    this.TotalNumberofRecord = this.shapesurchargeList.length;
    // for(let i=0;i<this.TotalNumberofRecord;i++)
    // {
    //   if(this.shapesurchargeList[i].User_Id=="")
    //   {
    //     this.shapesurchargeList[i].User_Id="string";
    //   }
    // }

  }

  delete(shapegroupid: any, index: any) {
    debugger;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    const modalRef = this.modalService.open(DeleteDialogComponent, ngbModalOptions);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.formname = 'wbs';

    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        debugger
        //console.log(modalResult.isConfirm);
        //DeleteShapeGroup
        this.shapesurchargeservice.DeleteShapeSurchargeGroup(shapegroupid).subscribe(response => {
          this.shapesurchargeList.splice(index, 1);
          
          this.LoadShapeSurchargeList();

          this.tosterService.success('Shape Surcharge deleted successfully')
        })

      }
    });


  }

  onSubmit() {
    console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.ShapeSurchargeForm.invalid) {
      return;
    }

  }

  onReset() {
    this.submitted = false;
    this.ShapeSurchargeForm.reset();
  }
  public onPageChange(pageNum: number): void {
    if (this.prev_index != null) {

      this.shapesurchargeList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_update));
    }
    this.enableEditIndex = null;
    this.prev_index = null;
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadshapesurchargeList();
  }
  OnPageSizeChange(itemsPerPage: number) {
    if (this.prev_index != null) {

      this.shapesurchargeList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_update));
    }
    this.pageSize = 0;
    this.enableEditIndex = null;
    console.log(itemsPerPage);
    this.itemsPerPage = itemsPerPage
    this.currentPage = 1;
    this.formsubmit = true;

    //this.LoadshapesurchargeList();
  }

  Createshapesurcharge() {

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',

    }
    const modalRef = this.modalService.open(CreateShapesurchargeComponent, ngbModalOptions);
    modalRef.componentInstance.saveTrigger.subscribe((NewAddedShapegrp: any) => {
      debugger;
      console.log("adshvasdd");
      this.shapesurchargeList.unshift(NewAddedShapegrp[0]);
      console.log(this.shapesurchargeList)
      console.log(NewAddedShapegrp);


      this.LoadShapeSurchargeList();
      // if (NewAddedShapegrp.length > 0) {
      //   for (var i = 0; i < NewAddedShapegrp.length; i++) {
      //     this.shapesurchargeList.push(NewAddedShapegrp[i]);
      //     this.TotalNumberofRecord = this.shapesurchargeList.length;
      //   }
      // }
    });
    this.LoadShapeSurchargeList();
  }


  changeProject(e: any) {
    console.log(e.target.value);
    console.log(this.ShapeSurchargeForm)

    let projecttName = e.target.value
    this.ShapeSurchargeForm.patchValue({ projectname: projecttName });

  }




  getPageData() {
    this.LoadShapeSurchargeList();
    this.shapesurchargeList = this.shapesurchargeList
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }
  onEdit(item: any, index: any) {
    console.log("index", this.prev_index)
    console.log("backup", this.backup_update)
    if (this.prev_index != null) {
      this.shapesurchargeList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_update));
    }

    
    
    this.prev_index = this.shapesurchargeList.findIndex(x => x.ID === item.ID);
    this.backup_update = JSON.parse(JSON.stringify(item));
    console.log("after backup", this.backup_update);
    this.isEditing = true;

    this.enableEditIndex = index;

  }

  Update(item: Shapesurcharge, index: number) {



    this.shapesurchargeList[index] = item;
    console.log(this.shapesurchargeList[index]);
    debugger;
    if (item.Invoice_Length !== null && item.ShapeCode != undefined && item.Bar_Dia != undefined && item.Surcharge != undefined &&
      item.Dia_Condition != undefined) {

      this.shapesurchargeservice.UpdateShapeSurchage(item)

        .subscribe({


          next: (response) => {

            debugger;
            console.log(response);

            this.tosterService.success('Shape Surcharge Record Updated successfully')

            //this.saveTrigger.emit(this.ShapegroupObj);

          },

          error: (e) => {

            console.log(e.error);

          },

          complete: () => {

            // this.LoadTagList(this.selected_station);

          },

        });

      // console.log(this.shapesurchargeList);
      this.isEditing = false;
      this.enableEditIndex = null;
      this.prev_index = null;

    }
    else {
      this.tosterService.error('Please fill the required fields');
    }

  }

  Editcancel(item: any, index: any) {
    var i = this.shapesurchargeList.findIndex(x => x.ID === item.ID);
    this.shapesurchargeList[i] = JSON.parse(JSON.stringify(this.backup_update));

    this.isEditing = false;
    this.enableEditIndex = null;
    console.log(item);
    this.formsubmit = true;
    this.prev_index = null;

  }

  download(): void {

    this.LoadShapeSurchargeList();
    
    console.log('list = ', this.shapesurchargeList);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.shapesurchargeList);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'export');

  }




  private saveAsExcelFile(buffer: any, fileName: string): void {

    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });

    const url = window.URL.createObjectURL(data);

    const link = document.createElement('a');

    link.href = url;

    link.download = "shapesurcharge.xlsx";

    link.click();

  }
  onPagesizeChangeForCol() {
    if (this.prev_index != null) {

      this.shapesurchargeList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_update));
    }
    this.formsubmit = true;
    this.itemsPerPage = 20;
    console.log(this.currentPage);
    this.onPageChange(1);
    



  }
  Reset_search() {
    this.searchText = "";
    this.itemsPerPage = 10;
    this.filterData2();
  }
  Reset_col() {
    this.searchBarDia = ""
    this.searchInvoice = ""
    this.searchSurcharge = ""
    this.searchDiacondi = ""
    this.searchUserId = ""
    this.searchDate = ""
    this.searchShapeCode = ""
    this.filterData();

  }
  filterData() {
    debugger;
    console.log("started");
    this.LoadShapeSurchargeList();

    if (this.searchShapeCode != undefined) {
      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.ShapeCode.toLowerCase().includes(this.searchShapeCode.trim().toLowerCase())
      );
    }
    if (this.searchBarDia != undefined) {
      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.Bar_Dia.toString().toLowerCase().includes(this.searchBarDia.toString().toLowerCase())
      );
    }
    if (this.searchInvoice != undefined) {
      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.Invoice_Length.toString().toLowerCase().includes(this.searchInvoice.toLowerCase())
      );
    }
    if (this.searchSurcharge != undefined) {
      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.Surcharge.toLowerCase().includes(this.searchSurcharge.toLowerCase())
      );
    }
    if (this.searchDiacondi != undefined) {
      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.Dia_Condition.toLowerCase().includes(this.searchDiacondi.toLowerCase())
      );
    }
    if (this.searchDate != undefined) {
      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.Updated_Date.toLowerCase().includes(this.searchDate.toLowerCase())
      );
    }

    if (this.searchUserId != null) {
      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.User_Id.toString().toLowerCase().includes(this.searchUserId.toLowerCase())
      );
    }

    this.TotalNumberofRecord = this.shapesurchargeList.length;
  }


  filterData2() {
    this.LoadShapeSurchargeList();
    debugger;
    if (this.searchText !== undefined) {
      debugger;

      this.shapesurchargeList = this.shapesurchargeList.filter(item =>
        item.ShapeCode.toLowerCase().includes(this.searchText.toLowerCase())
        || item.Bar_Dia.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.Invoice_Length.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.Dia_Condition.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.Surcharge.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.Updated_Date.toString().toLowerCase().includes(this.searchText.toLowerCase())
        || item.User_Id?.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.TotalNumberofRecord = this.shapesurchargeList.length;
      console.log(this.TotalNumberofRecord);
    }
  }

  searchForcolumn() {
    this.toggleFilters = !this.toggleFilters;
    this.isEditing = false;
    this.enableEditIndex = -1;
    console.log(typeof this.shapesurchargeList[0].Updated_Date);
  }
  changeShapecode(item: any) {
    if (item == undefined) {
      this.formsubmit = false;
    }
    else {
      this.formsubmit = true
    }
  }
  changeInvoiceLen(item: any) {
    if (item == undefined) {
      this.formsubmit = false;
    }
    else {
      this.formsubmit = true
    }
  }
  changeBardia(item: any) {
    if (item == undefined) {
      this.formsubmit = false;
    }
    else {
      this.formsubmit = true
    }
  }
  changeSurcharge(item: any) {
    if (item == undefined) {
      this.formsubmit = false;
    }
    else {
      this.formsubmit = true
    }
  }
  changeDiacondition(item: any) {
    if (item == undefined) {
      this.formsubmit = false;
    }
    else {
      this.formsubmit = true
    }
  }

  getSurchargeDropdownList() {
    this.shapesurchargeservice.GetSurchargesDropdownList().subscribe({
      next: (response) => {
        this.surchargeList = response;
        console.log("this.surchargeList",this.surchargeList);
      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }
}