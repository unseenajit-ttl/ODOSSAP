import { Component, Input, OnInit } from '@angular/core';
import { MAT_FAB_DEFAULT_OPTIONS } from '@angular/material/button';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BBSOrderdetailsTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
import { BBSOrdertableModel } from 'src/app/Model/BBSOrdertableModel';
import { SaveBarDetailsModel } from 'src/app/Model/saveBarDetailsModel';
import { OrderService } from 'src/app/Orders/orders.service';
import { BindingLimitComponent } from '../createorder/orderdetails/binding-limit/binding-limit.component';
import { BeamMeshArray } from 'src/app/Model/StandardbarOrderArray';
import { BeamlinkmeshOrderTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
import { DateTimeProvider } from 'angular-oauth2-oidc';
import { Toast, ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { OrderImageModalComponent } from '../order-image-modal/order-image-modal.component';
import { ColumnLinkMeshProductListModalComponent } from '../column-link-mesh-product-list-modal/column-link-mesh-product-list-modal.component';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { PrcsharedserviceService } from '../precage/PrecageService/prcsharedservice.service';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { CommonService } from 'src/app/SharedServices/CommonService';

@Component({
  selector: 'app-beamlinkmeshorder',
  templateUrl: './beamlinkmeshorder.component.html',
  styleUrls: ['./beamlinkmeshorder.component.css']
})
export class BeamlinkmeshorderComponent {
  // this.createSharedService.selectedrecord

  CustomerCode: any = this.dropdown.getCustomerCode();
  ProjectCode: any = this.dropdown.getProjectCode()[0];
  OrderStatus: any;
  JobID: any;
  ScheduledProd: any;
  // BBSID= this.prcSharedS.lBBSID;
  POSTID: any;
  OrderNumber: any;
  // JobID: any = 14;
  BBSID: any;
  CouplerType: any;
  ProductType: any;
  ScheduleProd: any;
  Imagename: any;
  showSideTable: boolean = false;
  bbsOrderTable: BeamMeshArray[] = [];
  bbsOrderTemp: BeamMeshArray[] = [];
  shapeCodeList: any[] = [];
  sizeList: any[] = [];
  Diameter: any;
  Spacing: any;
  CarrierWireDia: any;
  Mass: any;
  TotalWeight: any;
  StaticImagename: any;
  editIndex: any = null;
  showshapecode: boolean = true;
  imagesPerRow: any = 5;
  images: string[] = [];
  tableInput: BeamlinkmeshOrderTableInput = {
    MeshMark: '',
    MeshProduct: '',
    MeshWidth: 0,
    MeshDepth: 0,
    MeshSlope: 0,
    MeshTotalLinks: 0,
    MeshSpan: 0,
    MeshMemberQty: 0,
    MeshCapping: false,
    MeshCPProduct: '',
    MeshShapeCode: '',
    A: 0,
    B: 0,
    C: 0,
    HOOK: 0,
    LEG: 0,
    MeshTotalWT: 0,
    MWLength: 0,
    MWBOM: '',
    CWBOM: '',
    Remarks: '',
    MeshID: 0,
    MeshSort: 0,
    CustomerCode: '',
    ProjectCode: '',
    JobID: 0,
    BBSID: 0,
    D: 0,
    E: 0,
    P: 0,
    Q: 0,
    I: 0,
    J: 0,
    SplitNotes: '',
    UpdateDate: new Date(),
    UpdateBy: '',
    ProdMWDia: 0,
    ProdMWSpacing: 0,
    ProdCWDia: 0,
    ProdCWSpacing: 0,
    ProdMass: 0,
    ProdMinFactor: 0,
    ProdMaxFactor: 0,
    ProdTwinInd: ''

  };


  imageRows: string[][] = [];
  StructureElement: any;
  MemberQty: any;
  RoutedFromProcess: boolean = false;
  selectedRowIndex: number | null = null;
  receivedData: any;

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
    private dropdown: CustomerProjectService,
    private toastr: ToastrService,
    private processsharedserviceService: ProcessSharedServiceService,
    private createSharedService: CreateordersharedserviceService,
    public httpClient: HttpClient,
    private reloadService: ReloadService,
    private location: Location,
    private router: Router,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.commonService.changeTitle('BeamMesh | ODOS');
    this.receivedData = localStorage.getItem('ProcessData');
    this.receivedData = JSON.parse(this.receivedData);
    console.log('receivedData', this.receivedData)

    if (this.receivedData) {
      this.OrderStatus = this.receivedData.orderstatus;
      this.ScheduledProd = this.receivedData.ScheduledProd;
      this.OrderNumber = this.receivedData.ordernumber;;
      this.POSTID = this.receivedData.jobIds.PostHeaderID;
      this.RoutedFromProcess = true;
      this.StructureElement=this.receivedData.StructureElement;
      this.ScheduleProd=this.receivedData.ScheduledProd;
      this.ProductType=this.receivedData.ProductType;
    }

    // this.StaticImagename="beam_cage.png";
    if (this.createSharedService.selectedrecord) {
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.OrderStatus = this.createSharedService.selectedrecord.OrderStatus;
      this.ScheduledProd = this.createSharedService.selectedrecord.ScheduledProd;
      this.OrderNumber = this.createSharedService.selectedrecord.OrderNumber;;
      this.POSTID = this.createSharedService.selectedrecord.PostID;
      this.BBSID = this.createSharedService.selectedrecord.BBSID;
      this.StructureElement=this.createSharedService.selectedrecord.StructureElement;
      this.ScheduleProd=this.createSharedService.selectedrecord.ScheduledProd;
      this.ProductType=this.createSharedService.selectedrecord.Product;

    } else {
      this.dropdown.setCustomerCode(this.receivedData.customer);
      let obj: any = [];
      obj.push(this.receivedData.project);
      this.dropdown.setProjectCode(obj);
      let lAddressCodes: any = [];
      if (this.receivedData.AddressCode) {
        lAddressCodes.push(this.receivedData.AddressCode);
      }
      this.dropdown.setAddressList(lAddressCodes);
      
      this.reloadService.reloadCreateOrderCustomerProject.emit();
      this.SetCreateDatainLocal(this.OrderNumber);
    }

    // Set OderSummaryList Data from local Storage and remove item from local Storage.
    let lData: any = localStorage.getItem('ProcessOrderSummaryData');
    lData = JSON.parse(lData);
    if (lData) {
      this.RoutedFromProcess = true;
    }
    this.processsharedserviceService.setOrderSummaryData(lData);


    this.getJobId(this.OrderNumber)
    this.showshapelistimages();
    this.getShapeCodeList(this.CustomerCode, this.ProjectCode, this.CouplerType);
    //console.log("checking");
    //console.log(this.imageRows);
    this.Imagename = "";
    this.StaticImagename = "beam_cage.png";

    this.columnVisibility['A'] = true;
    this.columnVisibility['B'] = true;
    this.columnVisibility['C'] = true;



    //this.getShapeCodeList('0001101154', '0000112393', 'N-Splice');

    this.sizeList = [10, 13, 16, 20, 25, 28, 32, 40, 50];
  }
  maxImagesInARow = 3;
  chunkArray(arr: string[], chunkSize: number): string[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }
  // get numRows(): number {
  //   return Math.ceil(this.images.length / this.imagesPerRow);
  // }

  // get rowArray(): any[] {
  //   return Array.from({ length: this.numRows });
  // }

  columnVisibility: { [key: string]: boolean } = {};
  columnheader: any = 'A,B,C';

  visibleparameters() {
    //debugger;
    const columnNames = this.columnheader.split(',');
    columnNames.forEach(
      (column: string) => (this.columnVisibility[column] = true)
    );
  }
  tempprodlist: any;
  lColNum: number = 0;
  ShowProductList() {
    let lCategory = 'BEAM';
    this.orderService.getProductList_beam(lCategory).subscribe({
      next: (response) => {
        let productList;
        //console.log('getProductList_BEAM', response);
        this.tempprodlist = response;
        //console.log('final ProductList', productList);
      },
      error: (e) => {
        alert(
          'Error on extraction data, please check the Internet connection.'
        );
      },
      complete: () => {
        const modalRef = this.modalService.open(
          ColumnLinkMeshProductListModalComponent,
          { size: 'lg' }
        );
        modalRef.componentInstance.products = this.tempprodlist;
        modalRef.componentInstance.StructureElement = "BEAM";
        // {'sno':1,'pcode':1234,'diameter':6,'spacing':75,'wireDia':7,'kg':3.84},
        //   {'sno':2,'pcode':1234,'diameter':6,'spacing':100,'wireDia':7,'kg':2.84},
        //   {'sno':3,'pcode':1234,'diameter':6,'spacing':75,'wireDia':7,'kg':4.84}
        modalRef.result.then((result) => {
          if (result) {
            //console.log(result);
          }
        });
        // this.loading = false;
      },
    });
  }


  DownloadProductList() {
    let lCategory = 'BEAM';
    this.orderService.PrintProduct(lCategory).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ProductCodeList.pdf';
      a.click();

      // window.open(url, '_blank'); // Opens the PDF in a new tab

      // this.StandardBarProductOrderLoading = false;
      // this.StandardMeshProductOrderLoading=false;
    });
  }
  DownloadShapeList() {
    let lCategory = 'BEAM';
    this.orderService.PrintShapes(lCategory).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Shapecodelist.pdf';
      a.click();

      // window.open(url, '_blank'); // Opens the PDF in a new tab

      // this.StandardBarProductOrderLoading = false;
      // this.StandardMeshProductOrderLoading=false;
    });
  }


  showshapelistimages() {
    // this.orderService.getShapeImagesByCat_beam('BEAM', { responseType: 'arraybuffer' })
    //   .subscribe((responseData: ArrayBuffer[]) => {
    //     responseData.forEach((data, index) => {
    //       const blob = new Blob([data], { type: 'image/png' });
    //       this.imageUrls[index] = URL.createObjectURL(blob);
    //     });
    //   });
    this.orderService.getShapeImagesByCat_beam("BEAM").subscribe((imageData: any) => {
      //debugger;
      for (const imageBytes of imageData) {
        const imageBase64 = this.byteArrayToBase64(imageBytes.shapeImage);
        //console.log(imageBase64);
        this.images.push(imageBytes.shapeCode);
        //`data:image/png;base64,${imageBase64}`
      }
      this.imageRows = this.chunkArray(this.images, 5);
    });
  }

  byteArrayToBase64(byteArray: number[]): string {
    let binary = '';
    for (let i = 0; i < byteArray.length; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return btoa(binary);
  }

  openBending() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
    };
    const modalRef = this.modalService.open(
      BindingLimitComponent,
      ngbModalOptions
    );
  }

  title: any;

  ShowShapeList() {
    const modalRef = this.modalService.open(OrderImageModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.images = this.shapeCodeList;
    modalRef.componentInstance.StructureElement = "BEAM";
    modalRef.result.then((result) => {
      if (result) {
        //console.log(result);
      }
    });
  }


  // ShowShapeList()
  // {
  //   let lCategory = "BEAM";

  //   this.orderService.ShowShapeList().subscribe({
  //     next: (response) => {
  //       const blob = new Blob([response], { type: 'application/pdf' });
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       // a.download = 'STDMESH-' + this.ProjectCode + this.JobID + '.pdf';
  //       // a.click();

  //       window.open(url, '_blank');
  //     },
  //     error: (e) => {
  //       alert("Error on extraction data, please check the Internet connection.");
  //     },
  //     complete: () => {
  //       this.title = "List of MESH Shapes (网片图形列表)";
  //       if (lCategory == "BEAM") {
  //         var lTitle = "List of Beam Stirrup Cage Shapes (梁箍铁图形列表)";
  //     }

  //       // this.loading = false;
  //     },
  //   });
  // }

  // DownloadShapeList()
  // {
  //   let lCategory = "BEAM";
  //   this.orderService.ShowShapeList().subscribe({
  //     next: (response) => {
  //       const blob = new Blob([response], { type: 'application/pdf' });
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'ShapeList.pdf';
  //       a.click();

  //       // window.open(url, '_blank');
  //     },
  //     error: (e) => {
  //       alert("Error on extraction data, please check the Internet connection.");
  //     },
  //     complete: () => {
  //       this.title = "List of MESH Shapes (网片图形列表)";
  //       if (lCategory == "BEAM") {
  //         var lTitle = "List of Beam Stirrup Cage Shapes (梁箍铁图形列表)";
  //     }

  //       // this.loading = false;
  //     },
  //   });
  // }

  // lColNum: number=0;



  loadMainFile(Imagename: any) {
    ////debugger;
    this.httpClient.get('/assets/images/Shapes/' + Imagename + '.png').subscribe(() => {
      this.Imagename = Imagename + '.png'
    }, (err) => {
      // HANDLE file not found
      if (err.status === 200) {
        this.Imagename = Imagename + '.png'
      }
      else if (err.status === 404) {
        this.loadSecondFile(Imagename);
      }
    });
  }

  loadSecondFile(Imagename: any) {
    this.httpClient.get('/assets/images/Shapes/' + Imagename + '.PNG').subscribe(() => {
      this.Imagename = Imagename + '.PNG'
    }, (err) => {
      // HANDLE file not found
      if (err.status === 200) {
        this.Imagename = Imagename + '.PNG'
      }
      if (err.status === 404) {
      }
    });
  }

  // ShowProductList()
  // {
  //   let lCategory = "BEAM";
  //   this.orderService.getProductList_beam(lCategory).subscribe({
  //     next: (response) => {
  //       //console.log('getProductList_beam', response);
  //     },
  //     error: (e) => {
  //       alert("Error on extraction data, please check the Internet connection.");
  //     },
  //     complete: () => {
  //       this.title = "List of MESH Shapes (网片图形列表)";
  //       this.lColNum=8;
  //       if (lCategory == "BEAM") {
  //         this.title = "Beam Stirrup Cage Products List(梁箍筋产品列表)";
  //         this.lColNum = 6;
  //     }
  //       // this.loading = false;
  //     },
  //   });
  // }

  // DownloadProductList()
  // {
  //   let lCategory = "BEAM";
  //   this.orderService.printProduct_beam(lCategory).subscribe({
  //     next: (response) => {
  //       //console.log('printProduct_beam', response);
  //     },
  //     error: (e) => {
  //       alert("Error on extraction data, please check the Internet connection.");
  //     },
  //     complete: () => {
  //       const pdfUrl = "../../../../assets/Products_List.pdf";
  //       window.open(pdfUrl, '_blank');  
  //       // this.loading = false;
  //     },
  //   });
  // }

  onSelectStandardBar() { }

  // onQtyChange() {
  //   this.tableInput.   = (
  //     Number(this.tableInput.Memberqty) * Number(this.tableInput.Eachqty)
  //   ).toString();
  // }

  // onLengthChange() {
  //   this.tableInput.Length = (
  //     Number(this.tableInput.A) +
  //     Number(this.tableInput.B) +
  //     Number(this.tableInput.C) +
  //     Number(this.tableInput.D) +
  //     Number(this.tableInput.E) +
  //     Number(this.tableInput.F) +
  //     Number(this.tableInput.G)
  //   ).toString();
  // }

  updateData() {
    this.editIndex = null;
  }

  resetInput() {
    this.tableInput = {
      MeshMark: '',
      MeshProduct: '',
      MeshWidth: 0,
      MeshDepth: 0,
      MeshSlope: 0,
      MeshTotalLinks: 0,
      MeshSpan: 0,
      MeshMemberQty: 0,
      MeshCapping: false,
      MeshCPProduct: '',
      MeshShapeCode: '',
      A: 0,
      B: 0,
      C: 0,
      HOOK: 0,
      LEG: 0,
      MeshTotalWT: 0,
      MWLength: 0,
      MWBOM: '',
      CWBOM: '',
      Remarks: '',
      MeshID: 0,
      MeshSort: 0,
      CustomerCode: '',
      ProjectCode: '',
      JobID: 0,
      BBSID: 0,
      D: 0,
      E: 0,
      P: 0,
      Q: 0,
      I: 0,
      J: 0,
      SplitNotes: '',
      UpdateDate: new Date(),
      UpdateBy: '',
      ProdMWDia: 0,
      ProdMWSpacing: 0,
      ProdCWDia: 0,
      ProdCWSpacing: 0,
      ProdMass: 0,
      ProdMinFactor: 0,
      ProdMaxFactor: 0,
      ProdTwinInd: ''
    };
  }

  // saveData() {
  //   this.SaveTableData();

  //   //console.log(this.tableInput);
  //   let tempobj: BeamlinkmeshOrderTableInput = {
  //     CustomerCode: this.CustomerCode,
  //     ProjectCode: this.ProjectCode,
  //     JobID: this.JobID,
  //     BBSID: 0,

  //     // BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length,
  //     MeshID: 0,
  //     MeshSort: this.tableInput.MeshSort,
  //     MeshMark: this.tableInput.MeshMark,
  //     MeshWidth: this.tableInput.MeshWidth,
  //     MeshDepth: this.tableInput.MeshDepth,
  //     MeshSlope: this.tableInput.MeshSlope,
  //     MeshProduct: this.tableInput.MeshProduct,
  //     MeshShapeCode: this.tableInput.MeshShapeCode,
  //     MeshTotalLinks: this.tableInput.MeshTotalLinks,
  //     MeshSpan: this.tableInput.MeshSpan,
  //     MeshMemberQty: this.tableInput.MeshMemberQty,
  //     MeshCapping: this.tableInput.MeshCapping,
  //     MeshCPProduct: this.tableInput.MeshCPProduct,
  //     A: this.tableInput.A,
  //     B: this.tableInput.B,
  //     C: this.tableInput.C,
  //     D: 0,
  //     E: 0,
  //     P: 0,
  //     Q: 0,
  //     I: 0,
  //     J: 0,
  //     HOOK: this.tableInput.HOOK,
  //     LEG: this.tableInput.LEG,
  //     MeshTotalWT: this.tableInput.MeshTotalWT,
  //     Remarks: this.tableInput.Remarks,
  //     MWLength: this.tableInput.MWLength,
  //     MWBOM: this.tableInput.MWBOM,
  //     CWBOM: this.tableInput.CWBOM,
  //     SplitNotes: '',
  //     UpdateDate: new Date(),
  //     UpdateBy: 'Vishal',
  //     ProdMWDia:0,
  //   ProdMWSpacing:0,
  //   ProdCWDia:0,
  //   ProdCWSpacing:0,
  //   ProdMass:0,
  //   ProdMinFactor:0,
  //   ProdMaxFactor:0,
  //   ProdTwinInd:''

  //   };
  //   // let tempobj = {
  //   //   sno: this.bbsOrderTable.length + 1,
  //   //   cancel: false,
  //   //   elementmark: this.tableInput.elementmark,
  //   //   Mark: this.tableInput.Mark,
  //   //   Type: this.tableInput.Type,
  //   //   Size: this.tableInput.Size,
  //   //   standardbar: this.tableInput.standardbar,
  //   //   Memberqty: this.tableInput.Memberqty,
  //   //   Eachqty: this.tableInput.Eachqty,
  //   //   Totalqty: this.tableInput.Totalqty,
  //   //   Shapecode: this.tableInput.Shapecode,
  //   //   A: this.tableInput.A,
  //   //   B: this.tableInput.B,
  //   //   C: this.tableInput.C,
  //   //   D: this.tableInput.D,
  //   //   E: this.tableInput.E,
  //   //   F: this.tableInput.F,
  //   //   G: this.tableInput.G,
  //   //   PinSize: this.tableInput.PinSize,
  //   //   Length: this.tableInput.Length,
  //   //   Weight: this.tableInput.Weight,
  //   //   Remarks: this.tableInput.Remarks,
  //   //   BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length
  //   // }

  //   this.bbsOrderTable.push(tempobj);

  //   this.resetInput();
  // }

  SaveTableData() {
    let obj: BeamlinkmeshOrderTableInput = {
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,
      JobID: this.JobID,
      BBSID: 0,

      // BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length,
      MeshID: 0,
      MeshSort: this.tableInput.MeshSort,
      MeshMark: this.tableInput.MeshMark,
      MeshWidth: this.tableInput.MeshWidth,
      MeshDepth: this.tableInput.MeshDepth,
      MeshSlope: this.tableInput.MeshSlope,
      MeshProduct: this.tableInput.MeshProduct,
      MeshShapeCode: this.tableInput.MeshShapeCode,
      MeshTotalLinks: this.tableInput.MeshTotalLinks,
      MeshSpan: this.tableInput.MeshSpan,
      MeshMemberQty: this.tableInput.MeshMemberQty,
      MeshCapping: this.tableInput.MeshCapping,
      MeshCPProduct: this.tableInput.MeshCPProduct,
      A: this.tableInput.A,
      B: this.tableInput.B,
      C: this.tableInput.C,
      D: 0,
      E: 0,
      P: 0,
      Q: 0,
      I: 0,
      J: 0,
      HOOK: this.tableInput.HOOK,
      LEG: this.tableInput.LEG,
      MeshTotalWT: this.tableInput.MeshTotalWT,
      Remarks: this.tableInput.Remarks,
      MWLength: this.tableInput.MWLength,
      MWBOM: this.tableInput.MWBOM,
      CWBOM: this.tableInput.CWBOM,
      SplitNotes: '',
      UpdateDate: new Date(),
      UpdateBy: 'Vishal',
      ProdMWDia: 0,
      ProdMWSpacing: 0,
      ProdCWDia: 0,
      ProdCWSpacing: 0,
      ProdMass: 0,
      ProdMinFactor: 0,
      ProdMaxFactor: 0,
      ProdTwinInd: ''

    };
    this.orderService.saveMeshBeamDetails_beam(obj).subscribe({
      next: (response) => {
        //console.log('Beam Link Mesh Details', response);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getShapeCodeList(
    CustomerCode: string,
    ProjectCode: string,
    CouplerType: string
  ) {
    let lcategorey = 'BEAM';
    this.orderService.getShapeImagesByCat(lcategorey).subscribe({
      next: (response) => {
        let allshapes;
        //console.log('shapeCodeList', response);
        this.shapeCodeList = response;
        // this.shapeCodeList=[];
        // for(let i=0 ; i< allshapes.length; i++){
        //   this.shapeCodeList.push(allshapes[i].shapeCode.toString());
        // if(this.shapeCodeList=="")
        // {
        //   this.shapeCodeList = `"${allshapes[i].shapeCode.toString()}",`;
        // }
        // else
        // {
        //   this.shapeCodeList += `"${allshapes[i].shapeCode.toString()}",`;
        // }
        // }
        // this.shapeCodeList=this.shapeCodeList.slice(0, -1);
        //console.log('final shapecodelist', this.shapeCodeList);
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  // getShapeCodeList(
  //   CustomerCode: string,
  //   ProjectCode: string,
  //   CouplerType: string
  // ) {
  //   this.orderService
  //     .getShapeCodeList(CustomerCode, ProjectCode, CouplerType)
  //     .subscribe({
  //       next: (response) => {
  //         //console.log('shapeCodeList', response);
  //         this.shapeCodeList = response;
  //       },
  //       error: (e) => {},
  //       complete: () => {
  //         // this.loading = false;
  //       },
  //     });
  // }
  imgElement: any;
  selectedBackgroundColor: string = '#ffe8c8';
  getRowData(item: any = [], index:any) {
    // this.Diameter=null
    // this.Spacing=null
    // this.CarrierWireDia=null
    // this.Mass=null
    // this.bbsOrderTemp=item;
    //debugger;

    if (item.SplitNotes != null && item.SplitNotes != "") {
      // meta.cssClasses += ' item-split';
      this.selectedBackgroundColor = '#ebc8ff';
  }else if (item.ProdMinFactor != null && item.MeshTotalLinks != null && item.ProdMinFactor > item.MeshTotalLinks) {
      // meta.cssClasses += ' item-combine';
      this.selectedBackgroundColor = '#ffe8c8';
  }
  else
  {
    this.selectedBackgroundColor = 'lightyellow'; 
  }

    this.selectedRowIndex = index;
    this.showshapecode = false;
    this.Diameter = item.ProdMWDia
    this.Spacing = item.ProdMWSpacing
    this.CarrierWireDia = item.ProdCWDia
    this.Mass = item.ProdMass
    this.loadMainFile(item.MeshShapeCode);
    //  this.imgElement = document.getElementById("myImage");
    //  this.imgElement.src = "../../../assets/images/Shapes/C.png";

  }
  GetTableData(
    CustomerCode: string,
    ProjectCode: string,
    PostID: number,
    BBSID: number
  ) {

    if (this.ScheduledProd == "Y") {
      if (this.CustomerCode != "" && this.ProjectCode != "" && this.POSTID > 0) {
        this.columnVisibility['A'] = true;
        this.columnVisibility['B'] = true;
        this.columnVisibility['C'] = true;
        this.columnVisibility['D'] = true;
        this.columnVisibility['E'] = false;
        this.columnVisibility['P'] = true;
        this.columnVisibility['Q'] = true;

        this.orderService
          .getBeamDetailsNSH_beam(CustomerCode, ProjectCode, PostID)
          .subscribe({
            next: (response) => {
              //console.log('BEAMLINKMESH', response);

              this.bbsOrderTable = response;
              //console.log(this.bbsOrderTable);
              this.TotalWeight = 0;
              for (let i = 0; i < this.bbsOrderTable.length; i++) {
                this.TotalWeight += this.bbsOrderTable[i].MeshTotalWT;
              }

            },
            error: (e) => {
              this.toastr.error("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..");
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {

              // this.loading = false;
            },
          });
      }
    }
    else {
      if (this.CustomerCode != "" && this.ProjectCode != "" && this.POSTID > 0) {

        this.columnVisibility['A'] = true;
        this.columnVisibility['B'] = true;
        this.columnVisibility['C'] = true;
        this.columnVisibility['D'] = true;
        this.columnVisibility['E'] = true;
        this.columnVisibility['P'] = true;
        this.columnVisibility['Q'] = true;
        this.orderService
          .getMeshBeamDetails_beam(CustomerCode, ProjectCode, PostID, BBSID)
          .subscribe({
            next: (response) => {
              //console.log('BEAMLINKMESH', response);

              this.bbsOrderTable = response;
            },
            error: (e) => {
              this.toastr.error("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection..");
              // alert("Cannot reload Beam Stirrup Cage detail infomation. Please check the Internet connection.");
            },
            complete: () => {
              // this.loading = false;
            },
          });
      }
    }

  }
  getJobId(orderNumber: string): any {
    let ProdType=this.ProductType;
    let StructurEelement=this.StructureElement;
    let ScheduleProd=this.ScheduleProd;
    this.orderService.getJobId(orderNumber,ProdType,StructurEelement,ScheduleProd).subscribe({
      next: (response: any) => {
        //console.log('jobid', response);
        // this.createSharedService.selectedJobIds.StdBarsJobID = response

        this.JobID = response.MESHJobID;
        this.POSTID = response.PostHeaderID;
        //console.log("job id:", this.JobID);
        // this.getBBS(this.JobID);

      },
      error: () => { },
      complete: () => {
        this.GetTableData(this.CustomerCode, this.ProjectCode, this.POSTID, this.BBSID);

        // this.reloadMeshOthersDetails();
        //debugger;

      },
    });
  }

  // goBack(): string {
  //   if (!this.RoutedFromProcess) {
  //     return '/order/createorder';
  //   } else {
  //     return '../order/createorder';
  //   }
  // }


  showA:boolean=false;
  showB:boolean=false;
  showC:boolean=false;
  showD:boolean=false;
  showE:boolean=false;
  showP:boolean=false;
  showQ:boolean=false;

  checkheader(item:any, column:any)
  {
    if(item!=null)
    {
      switch (column) {
        case 'A':
          this.showA = true;
          break;
        case 'B':
          this.showB = true;
          break;
        case 'C':
          this.showC = true;
          break;
        case 'D':
          this.showD = true;
          break;
        case 'E':
          this.showE = true;
          break;
        case 'P':
          this.showP = true;
          break;
        case 'Q':
          this.showQ = true;
          break;
      }
      return true;
    }
    else{
      return false;
    }
  }

  goBack(): void {
    if (!this.RoutedFromProcess) {
      this.location.back();
    } else {
      this.router.navigate(['../order/createorder']);
    }
  }

  async GetOrderSet(OrderNumber: any, RouteFlag: boolean) {
    // CALL API TO RETURN ALL ORDERS WITH SIMILAR REF NUMBER TO GIVEN ORDER NUMBER
    try {
      const data = await this.orderService
        .GetOrderSet(OrderNumber, RouteFlag)
        .toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }
  async SetCreateDatainLocal(OrderNumber: any) {
    // NOTE: GET ALL ORDERS WITH SIMILAR REF NUMBER
    let response: any = await this.GetOrderSet(OrderNumber, false);

    let lStructureElement: any[] = [];
    let lProductType: any[] = [];
    let lTotalWeight: any[] = [];
    let lTotalQty: any[] = [];
    let lSelectedPostId: any[] = [];
    let lScheduledProd: any[] = [];
    let lWBS1: any[] = [];
    let lWBS2: any[] = [];
    let lWBS3: any[] = [];
    let lOrderNo: any[] = [];
    let lStrutureProd: any[] = [];

    if (response == false) {
      alert('Connection error, please check your internet connection.');
      return;
    } else {
      for (let i = 0; i < response.length; i++) {
        lStructureElement.push(response[i].StructureElement);
        lProductType.push(response[i].ProductType);
        lTotalWeight.push(1);
        lTotalQty.push(response[i].TotalPCs);
        lSelectedPostId.push(response[i].PostHeaderId);
        lScheduledProd.push(response[i].ScheduledProd);
        lWBS1.push(response[i].WBS1);
        lWBS2.push(response[i].WBS2);
        lWBS3.push(response[i].WBS3);
        lOrderNo.push(response[i].OrderNo);

        let lStructPrd =
          response[i].StructureElement + '/' + response[i].ProductType;
        if (response[i].PostHeaderId) {
          lStructPrd = lStructPrd + response[i].PostHeaderId;
        }
        lStrutureProd.push(lStructPrd);
      }
    }

    this.createSharedService.selectedTab = true;
    if (lStructureElement.includes('NONWBS' || 'nonwbs')) {
      this.createSharedService.selectedTab = false;
    }
    let tempOrderSummaryList: TempOrderSummaryData = {
      pCustomerCode: '',
      pProjectCode: '',
      pSelectedCount: 0,
      pSelectedSE: lStructureElement,
      pSelectedProd: lProductType,
      pSelectedWT: lTotalWeight,
      pSelectedQty: lTotalQty,
      pSelectedPostID: lSelectedPostId,
      pSelectedScheduled: lScheduledProd,
      pSelectedWBS1: lWBS1,
      pSelectedWBS2: lWBS2,
      pSelectedWBS3: lWBS3,
      pWBS1: '',
      pWBS2: '',
      pWBS3: '',
      pOrderNo: lOrderNo,
      StructProd: lStrutureProd,
    };

    this.createSharedService.tempOrderSummaryList = undefined;
    this.createSharedService.tempProjectOrderSummaryList = undefined;
    // localStorage.setItem(
    //   'CreateDataProcess',
    //   JSON.stringify(tempOrderSummaryList)
    // );
    setTimeout(() => {
      console.log('SetOrderSummaryData', tempOrderSummaryList);
      this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
        // You can set a specific message to display after the timeout
      }, 1000);
    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    // this.router.navigate(['../order/createorder']);
  }
}
