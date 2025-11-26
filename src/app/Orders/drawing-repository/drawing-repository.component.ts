import { Component } from '@angular/core';
import { AngularGridInstance, Column, GridOption, GridState, GridStateChange, GridStateType } from 'angular-slickgrid';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { SearchDrawRepoComponent } from './search-draw-repo/search-draw-repo.component';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileDropZoneComponent } from './file-drop-zone/file-drop-zone.component';
import {
  getDrawingListModel,
  searchDrawingListModel,
  getWBSListModel,
  deleteDrawingModel,
  checkIfFileExistsModel,
  checkOrderModel,
  getOrderListModel,
  getAssignStrEleModel,
  printDrawingsModel,
  deleteDrawingOrderModel,
  modifyDrawingModel,
} from 'src/app/Model/drawing_repo_models';
import { OrderService } from '../orders.service';
import moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ProductionRoutesService } from 'src/app/SharedServices/production-routes.service';
import { LoginService } from 'src/app/services/login.service';
import { FileDownloadDirService } from 'src/app/SharedServices/FileDownloadDir/file-download-dir.service';

@Component({
  selector: 'app-drawing-repository',
  templateUrl: './drawing-repository.component.html',
  styleUrls: ['./drawing-repository.component.css'],
})
export class DrawingRepositoryComponent {
  gridColumns: Column[] = [];
  options!: GridOption;
  drawingGrid!: AngularGridInstance;
  drawingDataView: any;
  drawingData: any[] = [];
  ordersList: any[] = [];
  wbsTableList: any[] = [];
  WBS1List: string[] = [];
  WBS2List: string[] = [];
  WBS3List: string[] = [];
  WBS1AssignList: string[] = [];
  WBS2AssignList: string[] = [];
  WBS3AssignList: string[] = [];
  structureElementList: string[] = [];
  selectedRow:any;
  isUnassignable:boolean = false;
  isWBS1Loading:boolean = false;
  isWBS2Loading:boolean = false;
  isWBS3Loading:boolean = false;
  isIframeLoading:boolean = false;
  isDrawingPreview:boolean = true;
  productList: string[] = [
    'MESH',
    'PRE-CAGE',
    'CORE-CAGE',
    'BPC',
    'CARPET',
    'CAB',
  ];
  retrieveForm: getDrawingListModel = {
    CustomerCode: '',
    ProjectCode: '',
    WBS1: [],
    WBS2: [],
    WBS3: [],
    ProductType: ['MESH'],
    StructureElement: [],
    Category: 'NSH Drawings',
  };
  assignForm = {
    WBS1: [],
    WBS2: [],
    WBS3: [],
    ProductType: ['MESH'],
    StructureElement: [],
  };

  activeTab = 0;
  customerCode: any;
  projectCode: any;
  blobUrl: SafeResourceUrl | undefined;
  isLoding:boolean=false;
  constructor(
    private reloadService: ReloadService,
    private modalService: NgbModal,
    private dropdown: CustomerProjectService,
    private orderService: OrderService,
    private sanitizer: DomSanitizer,
    private toastr:ToastrService,
    private productionRoutesService: ProductionRoutesService,
    private loginService:LoginService,
    private fileDownloadDirService: FileDownloadDirService
  ) {
    sessionStorage.setItem('displayscreenname', 'Drawing Repository');
    this.prepareGrid();
  }
  rowHighlightFormatter(row: any, cell: any, value: any, columnDef: any, dataContext: any) {
    // Apply the CSS class conditionally
    if (dataContext.name === 'John') {
      return { 'row-highlight': true };
    }
    return {};
  }
  prepareGrid(){
    this.options = {
      editable: false,
      enableCellNavigation: true,
      enableSorting: true,
      enableFiltering: true,
      showHeaderRow: false,
      explicitInitialization: true,
      enableRowSelection: true,
      enableAutoTooltip: true,
      enableAddRow: false,
      enableAutoResize: true,
      enableColumnReorder: false,
      enableHeaderMenu: false,

    };
    this.gridColumns = [
      {
        id: 'DrawingID',
        name: 'S/No<br>序号',
        field: 'DrawingID',
        toolTip: 'Drawing Serial Number.(图纸序列号码)',
        minWidth: 20,
        width: 20,
        sortable: true,
        cssClass: 'left-align',
      },
      {
        id: 'FileName',
        name: 'File Name<br>文件名',
        field: 'FileName',
        toolTip: 'Drawing file name (图纸文件名)',
        minWidth: 20,
        width: 70,
        sortable: true,
        cssClass: 'left-align grid-text-size',
      },
      {
        id: 'Revision',
        name: 'Revision<br>版号',
        field: 'Revision',
        toolTip: 'drawing change Revision (图纸修改版号)',
        minWidth: 10,
        width: 10,
        sortable: true,
        cssClass: 'center-align grid-text-size',
      },
      {
        id: 'UpdatedBy',
        name: 'Updated By<br>修改者',
        field: 'UpdatedBy',
        toolTip: 'Updated By (修改者)',
        minWidth: 5,
        width: 40,
        sortable: true,
        cssClass: 'center-align grid-text-size',
      },
      {
        id: 'UpdatedDate',
        name: 'Updated Date<br>修改日期',
        field: 'UpdatedDate',
        toolTip: 'Updated Date (修改日期)',
        minWidth: 5,
        width: 40,
        sortable: true,
        cssClass: 'center-align grid-text-size',
      },
    ];
    this.loadGridState();
  }
  ngOnInit() {
    if (this.dropdown.getCustomerCode()) {
      this.customerCode = this.dropdown.getCustomerCode();
      this.retrieveForm.CustomerCode = this.dropdown.getCustomerCode();
    }
    if (this.dropdown.getProjectCode()[0]) {
      this.projectCode = this.dropdown.getProjectCode()[0];
      this.retrieveForm.ProjectCode = this.dropdown.getProjectCode()[0];
      this.getAssignStrEle({ ProjectCode: this.projectCode });
      this.getDrawingList(this.retrieveForm);
    }
    this.reloadService.reloadCustomer$.subscribe((data) => {
      console.log('reloadCustomer=>', data);
      this.customerCode = this.dropdown.getCustomerCode();
      this.retrieveForm.CustomerCode = this.dropdown.getCustomerCode();
    });

    this.reloadService.reload$.subscribe((data) => {
      console.log('reloadService=>', data);
      if (data) {
        this.customerCode = this.dropdown.getCustomerCode();
        this.projectCode = this.dropdown.getProjectCode()[0];
        this.retrieveForm.CustomerCode = this.dropdown.getCustomerCode();
        this.retrieveForm.ProjectCode = this.dropdown.getProjectCode()[0];
        this.getAssignStrEle({ ProjectCode: this.projectCode });
        this.getDrawingList(this.retrieveForm);
        console.log('this.projectCode=>', this.projectCode);
      }
    });

    ($('.modal-dialog') as any).draggable({
      handle: '.modal-header',
    });
  }
  angularGridReady(event: Event) {
    this.drawingGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.drawingDataView = this.drawingDataView;
    this.drawingGrid.resizerService.resizeGrid();
    this.drawingGrid.slickGrid.onClick.subscribe((e, args) => {
      this.onRowClick(args.row);
    });

    const dataView = this.drawingGrid.dataView;

    // This function is called for each row and allows customization
    dataView.getItemMetadata = (rowIndex: number) => {
      const item = dataView.getItem(rowIndex);
      console.log("item=>",item)
      if (item && item.NoAssign !== 0) {
        return {
          cssClasses: 'row-highlight'
        };
      }
      return {};
    };

  }
  onRowClick(row: number) {
    const rows = document.querySelectorAll('.slick-row');
    rows.forEach((rowElement) => rowElement.classList.remove('highlight-row'));
    const clickedRow: any = this.drawingGrid.slickGrid.getCellNode(
      row,
      0
    )?.parentElement;
    clickedRow.classList.add('highlight-row');
    let item = this.drawingGrid.dataView.getItem(row);
    if (this.selectedRow) {
      if(item.DrawingID !==  this.selectedRow.DrawingID){
        this.selectedRow = item;
        this.getOrderList({ DrawingID: item.DrawingID, Revision: item.Revision });
        this.getWBSList({
          CustomerCode: this.customerCode,
          ProjectCode: this.projectCode,
          DrawingID: item.DrawingID,
          Revision: item.Revision,
        });
        this.viewDrawing();
      }
    }else{
        this.selectedRow = item;
        this.getOrderList({ DrawingID: item.DrawingID, Revision: item.Revision });
        this.getWBSList({
          CustomerCode: this.customerCode,
          ProjectCode: this.projectCode,
          DrawingID: item.DrawingID,
          Revision: item.Revision,
        });
        this.viewDrawing();
    }
  }
  saveCurrentGridState(grid:any) {
    const gridState: GridState = this.drawingGrid.gridStateService.getCurrentGridState();
    localStorage.setItem('slickgrid-column-state-drawing', JSON.stringify(gridState?.columns));
    console.log('Leaving page with current grid state', gridState);
  }

  loadGridState() {
    // Retrieve the stored grid state from local storage
    const storedGridState = localStorage.getItem('slickgrid-column-state-drawing');
    if (storedGridState) {
      const columns = JSON.parse(storedGridState);
      if (columns && this.gridColumns) {
        // Restore the columns state
        this.gridColumns = this.gridColumns.map((col:any,index:number) => {
          col.width = columns[index] .width;
          return col;
        });
      }
    }
  }

  //open search popup
  drawingSearch() {
    if (this.customerCode && this.projectCode) {
      const modalRef = this.modalService.open(SearchDrawRepoComponent, {
        size: 'lg', // 'lg' stands for large, adjust as needed
        centered: true, // Optional: Center the modal
        windowClass: 'your-custom-dialog-class'
      });
      modalRef.componentInstance.customerCode = this.customerCode;
      modalRef.componentInstance.projectCode = this.projectCode;
      modalRef.result.then(
        (result: any) => {
          console.log('drawing search result=>', result);
          this.searchDrawingList(result);
        },
        (reason: any) => {
          // Handle dismissal or any other rejection
          console.log(reason);
        }
      );
    } else {
      alert('Please select customer and project!');
    }
  }
  //Documents upload
  attachDocs() {
    if (this.customerCode && this.projectCode) {
      const modalRef = this.modalService.open(FileDropZoneComponent, {
        size: 'xl', // 'lg' stands for large, adjust as needed
        centered: true, // Optional: Center the modal
        windowClass: 'your-custom-dialog-class'
      });
      modalRef.componentInstance.customerCode = this.customerCode;
      modalRef.componentInstance.projectCode = this.projectCode;
      modalRef.result.then(
        (result: any) => {
          this.getDrawingList(this.retrieveForm);
        },
        (reason: any) => {
          // Handle dismissal or any other rejection
          this.getDrawingList(this.retrieveForm);
          console.log(reason);
        }
      );
    }
  }
  //Function for un-assignments button visibility
  unAssignDocsChecks(){
    let assignmentArray = this.wbsTableList.filter((item)=>item.isSelected == true);
    if(assignmentArray.length > 0){

      this.isUnassignable = true;
    }else{
      this.isUnassignable = false;
    }
  }
  // {"DrawingID":5025,"Revision":1,"WBS1":["AJTEST"],"WBS2":["1"],"WBS3":["TEST"],"ProductType":["CAB"],"StructureElement":["Beam"]}
  //Unassign wbs to perticular record
  unAssignDocs(){
    let assignmentArray = this.wbsTableList.filter((item)=>item.isSelected == true);
    if(assignmentArray.length > 0){
      let obj:any = {
        DrawingID:[],
        Revision:[],
        WBS1:[],
        WBS2:[],
        WBS3:[],
        ProductType:[],
        StructureElement:[]
      }
      assignmentArray.forEach((item)=>{
        obj.DrawingID.push(item.DrawingID);
        obj.Revision.push(item.Revision);
        obj.WBS1.push(item.WBS1);
        obj.WBS2.push(item.WBS2);
        obj.WBS3.push(item.WBS3);
        obj.ProductType.push(item.ProductType);
        obj.StructureElement.push(item.StructureElement);
        console.log(obj);
      });
      this.isLoding = true;
      this.orderService.unAssignDrawing(obj).subscribe({
        next:(data)=>{
          console.log("data=>",data);
          this.getWBSList({CustomerCode: this.customerCode,ProjectCode: this.projectCode,DrawingID: this.selectedRow.DrawingID,Revision: this.selectedRow.Revision});
          this.isUnassignable = false;
          this.isLoding = false;
        },
        error:(error) => {
          console.error('Error unAssignDrawing:', error);
          this.isLoding = false;
        },
        complete:() => {
          console.log("unAssignDrawing Completed");
          this.isLoding = false;
          this.getDrawingList(this.retrieveForm);
        }
      });
      // this.getDrawingList(this.retrieveForm);
      // this.wbsTableList = [];
      // this.ordersList = [];
    }
    console.log("assignmentArray=>",assignmentArray);
  }
  //Assignment of wbs table to perticular drawing number

  assignWbsToDoc(){
    if(this.selectedRow){
      let obj:any = this.assignForm;
      obj["DrawingID"]=this.selectedRow.DrawingID;
      obj["Revision"]=this.selectedRow.Revision;
      console.log(obj);
      this.isLoding = true;
      this.orderService.assignDrawing(obj).subscribe({
        next:(data)=>{
          console.log("data=>",data);
          this.getWBSList({CustomerCode: this.customerCode,ProjectCode: this.projectCode,DrawingID: this.selectedRow.DrawingID,Revision: this.selectedRow.Revision});

          this.wbsTableList = [];
          this.ordersList = [];
          this.isLoding = false;
        },
        error:(error) => {
          console.error('Error assignDrawing:', error);
          this.isLoding = false;
        },
        complete:() => {
          console.log("assignDrawing Completed");
          this.isLoding = false;
          this.assignForm = {
            WBS1: [],
            WBS2: [],
            WBS3: [],
            ProductType: ['MESH'],
            StructureElement: [],
          };
          this.getDrawingList(this.retrieveForm);
        }
      });
    }
  }
  // retrieves data and initially load file table data
  getDrawingList(obj: getDrawingListModel) {
    debugger;
    this.isLoding = true;
    this.orderService.getDrawingList(obj).subscribe({

      next:(data: any) => {
        if (data.length > 0) {
          data.forEach((item: any, i: number) => {
            item.id = i + 1;
            item.UpdatedDate = moment(item.UpdatedDate).format('yyyy-MM-DD');
          });
          this.drawingData = data;
          this.drawingGrid.slickGrid.invalidateAllRows();
          this.drawingGrid.dataView.beginUpdate();
          this.drawingGrid.dataView.setItems(this.drawingData, 'id');
          this.drawingGrid.dataView.endUpdate();
          this.drawingGrid.dataView.refresh();
          this.drawingGrid.slickGrid.render();
          const dataView = this.drawingGrid.dataView;

            // This function is called for each row and allows customization
            dataView.getItemMetadata = (rowIndex: number) => {
              const item = dataView.getItem(rowIndex);
              if (item && item.NoAssign !== 0) {
                return {
                  cssClasses: 'row-highlight'
                };
              }
              return {};
            };
          this.wbsTableList = [];
          this.ordersList = [];
          this.blobUrl = "";

        } else {
          this.selectedRow = null;
          this.drawingData = [];
          this.drawingGrid.slickGrid.invalidateAllRows();
          this.drawingGrid.dataView.beginUpdate();
          this.drawingGrid.dataView.setItems(this.drawingData);
          this.drawingGrid.dataView.endUpdate();
          this.drawingGrid.dataView.refresh();
          this.drawingGrid.slickGrid.render();
          this.wbsTableList = [];
          this.ordersList = [];
          this.blobUrl = "";
        }
        this.isLoding = false;
      },
      error:(error) => {
        console.error('Error getDrawingList:', error);
        this.isLoding = false;
      },
      complete:() => {
        console.log("getDrawingList Completed");
        this.isLoding = false;
      }
    });
  }
  //search based on popup values
  searchDrawingList(obj: searchDrawingListModel) {
    this.isLoding = true;
    this.orderService.searchDrawingList(obj).subscribe({

      next:(data: any) => {
        if (data.length > 0) {
          data.forEach((item: any, i: number) => {
            item.id = i + 1;
            item.UpdatedDate = moment(item.UpdatedDate).format('yyyy-MM-DD');
          });
          this.drawingData = data;
          this.drawingGrid.slickGrid.invalidateAllRows();
          this.drawingGrid.dataView.beginUpdate();
          this.drawingGrid.dataView.setItems(this.drawingData, 'id');
          this.drawingGrid.dataView.endUpdate();
          this.drawingGrid.dataView.refresh();
          this.drawingGrid.slickGrid.render();
          this.wbsTableList = [];
          this.ordersList = [];
          this.blobUrl = "";
        } else {
          this.selectedRow = null;
          this.drawingData = [];
          this.drawingGrid.slickGrid.invalidateAllRows();
          this.drawingGrid.dataView.beginUpdate();
          this.drawingGrid.dataView.setItems(this.drawingData);
          this.drawingGrid.dataView.endUpdate();
          this.drawingGrid.dataView.refresh();
          this.drawingGrid.slickGrid.render();
          this.wbsTableList = [];
          this.ordersList = [];
          this.blobUrl = "";
        }
        this.isLoding = false;
      },
      error:(error) => {
        console.error('Error searchDrawingList:', error);
        this.isLoding = false;
      },
      complete:() => {
        console.log("searchDrawingList Completed");
        this.isLoding = false;
      }
    });
  }
  //get wbs table list
  getWBSList(obj: getWBSListModel) {
    this.isLoding = true;
    this.orderService.getWBSList(obj).subscribe({

      next:(data: any) => {
        if (data.length > 0) {
          this.wbsTableList = data;
          this.wbsTableList.forEach((item: any, i: number) => {
            item['isSelected']=false;
          });
        } else {
          this.wbsTableList = [];
        }
        this.isLoding = false;
      },
      error:(error) => {
        console.error('Error getWBSList:', error);
        this.isLoding = false;
      },
      complete:() => {
        console.log("getWBSList Completed");
        this.isLoding = false;
      }
    });
  }
  //check if order exists
  checkOrder() {
    if(this.selectedRow && this.selectedRow.Status == "Released"){
      alert("The drawing (with ID:" + this.selectedRow.Revision + ") has been assigned to released WBS already. You cannot delete it.");
    }else{
      this.isLoding = true;
      let obj:checkOrderModel = {DrawingID:this.selectedRow.DrawingID,Revision:this.selectedRow.Revision}
      this.orderService.checkOrder(obj).subscribe({

        next:(data: any) => {
          this.isLoding = false;
          if(data>0){
            alert("The drawing (with ID: " + this.selectedRow.DrawingID + ") has been assigned to Orders already. You cannot delete it.");
          }else{
            if (confirm("It going to delete the selected drawing(s). Are you sure?\n\n"
                  + "将要删除所选择的图纸文档, 请确认?")) {
                    this.removeDrawing(this.customerCode,this.projectCode,this.selectedRow.DrawingID);
                }
          }
        },
        error:(error) => {
          console.error('Error checkOrder:', error);
          this.isLoding = false;
        },
        complete:() => {
          console.log("checkOrder Completed");
          this.isLoding = false;
        }
      });
    }
  }
  //get order table list
  getOrderList(obj: getOrderListModel) {
    this.isLoding = true;
    this.orderService.getOrderList(obj).subscribe({

      next:(data: any) => {
        if (data.length > 0) {
          this.ordersList = data;
        } else {
          this.ordersList = [];
        }
        this.isLoding = false;
      },
      error:(error) => {
        console.error('Error getOrderList:', error);
        this.isLoding = false;
      },
      complete:() => {
        console.log("getOrderList Completed");
        this.isLoding = false;
      }
    });
  }
  //Get Structure dropdowns
  getAssignStrEle(obj: getAssignStrEleModel) {
    this.orderService.getAssignStrEle(obj).subscribe({
      next:(data: any) => {
        this.structureElementList = data;
      },
      error:(error) => {
        console.error('Error getAssignStrEle:', error);
      },
      complete:() => {
        console.log("getAssignStrEle Completed");
      }
    });
  }
  printDrawings(obj: printDrawingsModel) {
    this.orderService.printDrawings(obj).subscribe((data: any) => {});
  }
  removeDrawing(customer:any,project:any,drawingId:any) {
    this.isLoding = true;
    this.orderService.Remove_Drawing(customer,project,drawingId).subscribe({

      next:(data: any) => {
        this.isLoding = false;
        this.toastr.success(`The selected drawings ( ${drawingId} ) have been deleted successfully.`);
        this.getDrawingList(this.retrieveForm);
      },
      error:(error) => {
        console.error('Error Remove_Drawing:', error);
        this.isLoding = false;
      },
      complete:() => {
        console.log("Remove_Drawing Completed");
        this.isLoding = false;
      }
    });
  }
  modifyDrawing(obj: modifyDrawingModel) {
    this.orderService.modifyDrawing(obj).subscribe((data: any) => {});
  }
  getAssignWBS1(obj: any, type: string) {
    this.isWBS1Loading = true;
    this.orderService.getAssignWBS1(obj).subscribe({
      next:(data: any) => {
        if (type == 'assign') {
          this.WBS1AssignList = data;
        } else {
          this.WBS1List = data;
        }
      },
      error:(error) => {
        console.error('Error Remove_Drawing:', error);
        this.isWBS1Loading = false;
      },
      complete:() => {
        console.log("Remove_Drawing Completed");
        this.isWBS1Loading = false;
      }
    });
  }
  getAssignWBS2(obj: any, type: string) {
    this.isWBS2Loading = true;
    this.orderService.getAssignWBS2(obj).subscribe({
      next:(data: any) => {
        if (type == 'assign') {
          this.WBS2AssignList = data;
        } else {
          this.WBS2List = data;
        }
      },error:(error) => {
        console.error('Error Remove_Drawing:', error);
        this.isWBS2Loading = false;
      },
      complete:() => {
        console.log("Remove_Drawing Completed");
        this.isWBS2Loading = false;
      }
    });
  }
  getAssignWBS3(obj: any, type: string) {
    this.isWBS3Loading = true;
    this.orderService.getAssignWBS3(obj).subscribe({
      next:(data: any) => {
        if (type == 'assign') {
          this.WBS3AssignList = data;
        } else {
          this.WBS3List = data;
        }
      },error:(error) => {
        console.error('Error Remove_Drawing:', error);
        this.isWBS3Loading = false;
      },
      complete:() => {
        console.log("Remove_Drawing Completed");
        this.isWBS3Loading = false;
      }
    });
  }
  //On select change calls
  onStrucureChange(event:any,type: string) {
    if(event && event!=""){
      let obj = {
        ProjectCode: this.retrieveForm.ProjectCode,
        ProductType: this.retrieveForm.ProductType,
        StructureElement: this.retrieveForm.StructureElement,
      };
      if (type == 'assign') {
        obj = {
          ProjectCode: this.projectCode,
          ProductType: this.assignForm.ProductType,
          StructureElement: this.assignForm.StructureElement,
        };
        this.assignForm.WBS1 = [];
        this.assignForm.WBS2 = [];
        this.assignForm.WBS3 = [];
      }else{
        this.retrieveForm.WBS1 = [];
        this.retrieveForm.WBS2 = [];
        this.retrieveForm.WBS3 = [];
      }
      this.getAssignWBS1(obj, type);
    }else{
      if (type == 'assign') {
        this.assignForm.WBS1 = [];
        this.assignForm.WBS2 = [];
        this.assignForm.WBS3 = [];
      }else{
        this.retrieveForm.WBS1 = [];
        this.retrieveForm.WBS2 = [];
        this.retrieveForm.WBS3 = [];
      }

    }
  }
  onWBS1Change(event:any,type: string) {
    if(event && event!=""){
      let obj = {
        ProjectCode: this.retrieveForm.ProjectCode,
        ProductType: this.retrieveForm.ProductType,
        StructureElement: this.retrieveForm.StructureElement,
        WBS1: this.retrieveForm.WBS1,
      };
      if (type == 'assign') {
        obj = {
          ProjectCode: this.retrieveForm.ProjectCode,
          ProductType: this.assignForm.ProductType,
          StructureElement: this.assignForm.StructureElement,
          WBS1: this.assignForm.WBS1,
        };
        this.assignForm.WBS2 = [];
        this.assignForm.WBS3 = [];
      }else{
        this.retrieveForm.WBS2 = [];
        this.retrieveForm.WBS3 = [];
      }
      this.getAssignWBS2(obj, type);
    }else{
      if (type == 'assign') {
        this.assignForm.WBS2 = [];
        this.assignForm.WBS3 = [];
      }else{
        this.retrieveForm.WBS2 = [];
        this.retrieveForm.WBS3 = [];
      }

    }
  }
  onWBS2Change(event:any,type: string) {
    if(event && event!=""){

      let obj = {
        ProjectCode: this.retrieveForm.ProjectCode,
        ProductType: this.retrieveForm.ProductType,
        StructureElement: this.retrieveForm.StructureElement,
        WBS1: this.retrieveForm.WBS1,
        WBS2: this.retrieveForm.WBS2,
      };
      if (type == 'assign') {
        obj = {
          ProjectCode: this.retrieveForm.ProjectCode,
          ProductType: this.assignForm.ProductType,
          StructureElement: this.assignForm.StructureElement,
          WBS1: this.assignForm.WBS1,
          WBS2: this.assignForm.WBS2,
        };
        this.assignForm.WBS3 = [];
      }else{
        this.retrieveForm.WBS3 = [];
      }
      this.getAssignWBS3(obj, type);
    }else{
      if (type == 'assign') {
        this.assignForm.WBS3 = [];
      }else{
        this.retrieveForm.WBS3 = [];
      }

    }
  }
  viewDrawing(){
    this.isIframeLoading = this.isDrawingPreview;
    this.orderService.viewDrawing(this.customerCode,this.projectCode,this.selectedRow.FileName,this.selectedRow.Revision).subscribe({
      next:(response:any) => {
        const blob = new Blob([response], { type: 'application/pdf' });  // Replace with the appropriate MIME type
        const url = window.URL.createObjectURL(blob);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error:(error) => {
        console.error('Error fetching blob:', error);
        this.isIframeLoading = false;
      },
      complete:() => {
        console.log("Download Completed");
        this.isLoding = false;
      }
    });
  }
  drawingDownload(){
    if(this.selectedRow){
      let UserType = this.loginService.GetUserType();
      const anchorLink:any = this.productionRoutesService.SharepointService + `/ShowDirDownload`;
      let obj = {
        ddCustomerCode: this.customerCode,
        ddProjectCode: this.projectCode,
        ddFileName: this.selectedRow.FileName,
        ddRevision: this.selectedRow.Revision,
        UserType: UserType,
      };
      this.fileDownloadDirService.downloadFile(anchorLink, obj, this.selectedRow.FileName);
    }else{
      alert('Please select record.')
    }
  }
  onIframeLoad(){
    this.isIframeLoading = false;
  }
}
// https://172.26.254.134:8089/DrawingRepository/searchDrawingList
// {"CustomerCode":"0001101170","ProjectCode":"0000113012","FileName":"","DrawingNo":"","UpdateBy":"","UpdateDateFr":"2024-01-01","UpdateDateTo":""}/

// https://172.26.254.134:8089/DrawingRepository/getDrawingList
// {"CustomerCode":"0001101170","ProjectCode":"0000113012","WBS1":[],"WBS2":[],"WBS3":[],"ProductType":["MESH"],"StructureElement":[],"Category":"NSH Drawings"}

// https://172.26.254.134:8089/DrawingRepository/getWBSList
// {"CustomerCode":"0001101170","ProjectCode":"0000113012","DrawingID":0,"Revision":0}

// https://172.26.254.134:8089/DrawingRepository/getOrderList
// {"DrawingID":5113,"Revision":0}

//https://172.26.254.134:8089/DrawingRepository/PrintDrawings
//{"CustomerCode":"0001101170","ProjectCode":"0000113012","FileName":"BP-SP-JS1-060.xlsx","Revision":0}
