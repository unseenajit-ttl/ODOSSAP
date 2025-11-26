import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { MasterDialogComponent } from '../master-dialog/master-dialog.component';
import { CreateshapegroupComponent } from './createshapegroup/createshapegroup.component';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { ShapeMasterService } from '../Services/shape-master.service';
import { Shapegroup } from 'src/app/Model/shapegroup';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, withDebugTracing } from '@angular/router';
import * as XLSX from 'xlsx'
import { DeleteDialogComponent } from 'src/app/SharedComponent/Dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-shapegroup-master',
  templateUrl: './shapegroup-master.component.html',
  styleUrls: ['./shapegroup-master.component.css']
})
export class ShapegroupMasterComponent implements OnInit {
  shapegroupForm!: FormGroup;
  searchResult = true;


  filterTerm1: any;
  filterTerm2: any;

  structuretypeList: any[] = [];
  bendingtypeList: any[] = [];
  couplertypeList: any[] = [];
  dimentiontypeList: any[] = [];

  shapegroupList: Shapegroup[] = [];
  statuslist: any[] = [];
  toggleFilters = false;

  Shapegroupstring: string = "";
  strdimension: string = "";
  strstruct: string = "";
  strbending: string = "";
  strcoupler: string = "";

  isEditing: boolean = false;
  enableEditIndex = null;


  searchText: any = '';

  searchTerm: any;
  searchgroupname: any;
  searchDesc: any;
  searchDimention: any;
  searchStructure: any;
  searchBendingBar: any;
  searchCouple: any;
  searchStatus: any;


  prev_index: any = null;
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number = 0;
  maxSize: number = 10;
  TotalNumberofRecord: any;
  isformsubmit: boolean = false;
  backupData: Shapegroup[] = [];
  backup_item: Shapegroup[] = [];

  GroupDesc: any

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private shapemasterservice: ShapeMasterService,
    private tosterService: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.LoadShapeGroupList();
    this.LoadDropDowns();
    this.shapegroupForm = this.formBuilder.group({
      shapegroup: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      bendingtype: new FormControl('', Validators.required),
      structuretype: new FormControl('', Validators.required),
      couplertype: new FormControl('', Validators.required),
    });
  }

  LoadDropDowns() {
    this.statuslist = [
      { item_id: false, item_text: 'Active' },
      { item_id: true, item_text: 'Inactive' }];

    this.bendingtypeList = [
      { item_id: 'B', item_text: 'B' },
      { item_id: 'N', item_text: 'N' }
    ];
    this.structuretypeList = [
      { item_id: 'S', item_text: 'S' },
      { item_id: 'C', item_text: 'C' },
      { item_id: 'N', item_text: 'N' }

    ];
    this.couplertypeList = [
      { item_id: 'A', item_text: 'A' },
      { item_id: 'D', item_text: 'D' },
      { item_id: 'E', item_text: 'E' },
      { item_id: 'N', item_text: 'N' }
    ];
    this.dimentiontypeList = [
      { item_id: '2', item_text: '2' },
      { item_id: '3', item_text: '3' },
      { item_id: 'P', item_text: 'P' }
    ]

  }


  LoadShapeGroupList(): void {
    // USING RESOLVE GUARD
    this.shapegroupList = this.route.snapshot.data['data']
    debugger;
    console.log(this.shapegroupList)
    for (let i = 0; i < this.shapegroupList.length; i++) {
      this.shapegroupList[i].ShapeGroupDesc = this.shapegroupList[i].ShapeGroupDesc.trim()
      console.log(this.shapegroupList[i].ShapeGroupDesc)
    }


    // WITHOUT USING RESOLVE GUARD
    // this.shapemasterservice.GetShapeGroupList().subscribe({
    //   next: (response) => {
    //     this.shapegroupList = response;
    //     console.log(this.shapegroupList)
    //     this.TotalNumberofRecord = this.shapegroupList.length;
    //   },
    //   error: (e) => {
    //   },
    //   complete: () => {
    //   },
    // });


    // this.backupData = JSON.parse(JSON.stringify(this.shapegroupList));

  }


  Createshapegrp() {

    console.log("before adding", this.shapegroupList)
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',

    }
    const modalRef = this.modalService.open(CreateshapegroupComponent, ngbModalOptions);
    modalRef.componentInstance.saveTrigger.subscribe((NewAddedShapegrp: any) => {
      // console.log("NewAddedShapegrp = ", NewAddedShapegrp)
      this.shapegroupList.unshift(NewAddedShapegrp[0]);
      this.LoadShapeGroupList()

      //     this.TotalNumberofRecord = this.shapegroupList.length;
      // if (NewAddedShapegrp.length > 0) {
      //   for (var i = 0; i < NewAddedShapegrp.length; i++) {
      //     this.shapegroupList.push(NewAddedShapegrp[i]);
      //     this.TotalNumberofRecord = this.shapegroupList.length;
      //   }
      // }
    });
    this.LoadShapeGroupList()
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
        //console.log(modalResult.isConfirm);
        //DeleteShapeGroup
        this.shapemasterservice.DeleteShapeGroup(shapegroupid).subscribe({
          next: (response) => {
            console.log("deleted value", response)
          },
          error: (e) => {
          },
          complete: () => {
            this.LoadShapeGroupList();
            this.tosterService.success('Shape Group deleted successfully')
            index = Number(this.itemsPerPage)*(Number(this.currentPage)-1) + Number(index)
            this.shapegroupList.splice(index, 1);

          },
          // this.shapegroupList.splice(index, 1);
          // this.LoadShapeGroupList();

          // this.tosterService.success('Shape Group deleted successfully')
        })

      }
    });
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.enableEditIndex = null;
    if (this.prev_index != null) {
      console.log("hello")
      this.shapegroupList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_item[0]));
      this.isformsubmit = false
      this.prev_index = null
    }

    //this.LoadShapeGroupList();
  }
  OnPageSizeChange(itemsPerPage: number) {
    // console.log(itemsPerPage);
    // console.log("pageSize", this.pageSize)
    this.pageSize = 0;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.enableEditIndex = null;
    if (this.prev_index != null) {
      console.log("hello")
      this.shapegroupList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_item[0]));
      this.isformsubmit = false
      this.prev_index = null
    }


  }



  Update(item: Shapegroup, index: any) {
    // console.log('structtypr=', item.StructureType)
    this.isformsubmit = false
    if (
      item.ShapeGroupDesc == '' ||
      item.DimentionType == undefined ||
      item.StructureType == undefined ||
      item.BendingBarType == undefined ||
      item.CouplerType == undefined ||
      item.IsArchived == undefined) {
      this.isformsubmit = true
      this.tosterService.error('Please fill the required fields');
    }
    // console.log(item);
    //item.Id
    if (!this.isformsubmit) {
      item.ShapeGroupName = item.DimentionType.trim() + item.StructureType.trim() + item.BendingBarType.trim() + item.CouplerType.trim();

      // console.log(this.shapegroupList[index]);
      this.shapegroupList[index] = item;

      this.shapemasterservice.SaveShapeGroup(item)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.tosterService.success('Shape Group Record Updated successfully')
            //this.saveTrigger.emit(this.ShapegroupObj);
          },
          error: (e) => {
            console.log(e.error);
          },
          complete: () => {
            // this.LoadTagList(this.selected_station);
          },
        });

      console.log(this.shapegroupList);
      this.isEditing = false;
      this.enableEditIndex = null;
      this.prev_index = null;
      this.backupData = JSON.parse(JSON.stringify(this.shapegroupList));
    }
  }

  onEdit(item: Shapegroup, index: any) {
    debugger
    console.log("enabledit", this.prev_index)
    console.log("backup", this.backup_item[0])
    if (this.prev_index != null) {
      console.log("hello")
      this.shapegroupList[this.prev_index] = JSON.parse(JSON.stringify(this.backup_item[0]));
    }
    this.prev_index = this.shapegroupList.findIndex(x => x === item)
    this.backup_item[0] = JSON.parse(JSON.stringify(item));
    // console.log("backup_item = ", this.backup_item)

    // if (this.isformsubmit == true) {
    //   this.tosterService.error('Please fill the required fields');
    // }
    // if (this.isformsubmit == false) {
    this.isEditing = true;
    // console.log(item)
    this.enableEditIndex = index;
    // }
  }

  Editcancel(item: Shapegroup) {
    let index = this.shapegroupList.findIndex(x => x === item)

    if (item.DimentionType == undefined) {
      this.shapegroupList[index].DimentionType = this.backup_item[0].DimentionType
    }
    if (item.BendingBarType == undefined) {
      this.shapegroupList[index].BendingBarType = this.backup_item[0].BendingBarType
    }
    if (item.CouplerType == undefined) {
      this.shapegroupList[index].CouplerType = this.backup_item[0].CouplerType
    }
    if (item.IsArchived == undefined) {
      this.shapegroupList[index].IsArchived = this.backup_item[0].IsArchived
    }
    if (item.ShapeGroupDesc == "") {
      this.shapegroupList[index].ShapeGroupDesc = this.backup_item[0].ShapeGroupDesc
    }
    if (item.StructureType == undefined) {
      console.log("enter struc")
      this.shapegroupList[index].StructureType = this.backup_item[0].StructureType
    }

    this.isformsubmit = false

    if (this.isformsubmit == false) {
      this.isEditing = false;
      this.enableEditIndex = null;
    }
    this.prev_index = null
    // this.backup_item = [];
  }

  Changedesc(event: any) {
    console.log("Changedesc enter")
    console.log("Changedesc event = ", event)
    if (event == '') {
      this.isformsubmit = true
    } else {
      this.isformsubmit = false
    }

  }
  Changecoupler(event: any) {
    // console.log("Changecoupler event = ", event)
    if (event == undefined) {
      this.isformsubmit = true
    } else {
      this.isformsubmit = false
    }

    this.strcoupler = event;
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;

  }
  Changebending(event: any) {
    if (event == undefined) {
      this.isformsubmit = true
    } else {
      this.isformsubmit = false
    }
    this.strbending = event;
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;
  }
  Changestruct(event: any) {
    if (event == undefined) {
      this.isformsubmit = true
    } else {
      this.isformsubmit = false
    }
    this.strstruct = event
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;
  }
  ChangeDimention(event: any) {
    if (event == undefined) {
      this.isformsubmit = true
    } else {
      this.isformsubmit = false
    }
    this.strdimension = event
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;
  }
  changeStatus(event: any) {
    if (event == undefined) {
      this.isformsubmit = true
    } else {
      this.isformsubmit = false
    }
  }

  download(): void {
    // console.log(this.shapegroupList)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.shapegroupList);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'export');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = "ShareGroupsheet.xlsx";
    link.click();
  }
  changePageSize() {
    this.itemsPerPage = this.shapegroupList.length
    // this.LoadShapeGroupList
  }
  resetPageSize() {
    // debugger
    console.log("enter resetPageSize")
    this.searchText = ''
    this.itemsPerPage = 10
    console.log("1", this.shapegroupList)
    this.filterData()
    console.log("2", this.shapegroupList)
  }
  resetsearchValue() {
    this.searchgroupname = undefined
    this.searchDesc = undefined
    this.searchDimention = undefined
    this.searchStructure = undefined
    this.searchBendingBar = undefined
    this.searchCouple = undefined
    this.searchStatus = undefined

    this.itemsPerPage = 10
    this.filterData()

  }

  filterData() {
    // console.log("enter description filter")
    // console.log("searchterm = ", this.searchDesc)

    // this.toggleFilters = !this.toggleFilters
    this.enableEditIndex = null
    this.LoadShapeGroupList()

    // console.log("here")
    // console.log(this.searchDesc)
    // console.log(this.searchStructure)

    if (this.searchText != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.ShapeGroupDesc.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.DimentionType.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.StructureType.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.ShapeGroupName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.BendingBarType.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.CouplerType.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.searchDesc != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.ShapeGroupDesc.toLowerCase().includes(this.searchDesc.toLowerCase())
      );
    }
    if (this.searchDimention != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.DimentionType.toLowerCase().includes(this.searchDimention.toLowerCase())
      );
    }
    if (this.searchStructure != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.StructureType.toLowerCase().includes(this.searchStructure.toLowerCase())
      );
    }
    if (this.searchgroupname != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.ShapeGroupName.toLowerCase().includes(this.searchgroupname.toLowerCase())
      );
    }
    if (this.searchBendingBar != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.BendingBarType.toLowerCase().includes(this.searchBendingBar.toLowerCase())
      );
    }
    if (this.searchCouple != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.CouplerType.toLowerCase().includes(this.searchCouple.toLowerCase())
      );
    }
    if (this.searchStatus != undefined) {
      this.shapegroupList = this.shapegroupList.filter(item =>
        item.IsArchived.toString().toLowerCase().includes(this.searchStatus.toString().toLowerCase())
      );
    }
    console.log("data = ", this.shapegroupList)
  }

  // downloadFile(data: any) {
  //   let fileName = 'shapegroupData';

  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('surchargedata');
  //     // Generate Excel File with given name
  //     workbook.xlsx.writeBuffer().then((data: any) => {
  //       const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       saveAs(blob, 'SocialShare.xlsx');

  //   const blob = new Blob(this.shapegroupList, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  //   saveAs(blob, fileName + '.xlsx');

  // }

}
