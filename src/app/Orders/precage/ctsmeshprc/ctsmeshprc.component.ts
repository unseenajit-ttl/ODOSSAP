import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MAT_FAB_DEFAULT_OPTIONS } from '@angular/material/button';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BBSOrderdetailsTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
import { BBSOrdertableModel } from 'src/app/Model/BBSOrdertableModel';
import { SaveBarDetailsModel } from 'src/app/Model/saveBarDetailsModel';
import { OrderService } from 'src/app/Orders/orders.service';
// import { BindingLimitComponent } from '../createorder/orderdetails/binding-limit/binding-limit.component';
import { BeamMeshArray, ctsmesharray } from 'src/app/Model/StandardbarOrderArray';
import { BeamlinkmeshOrderTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
import { DateTimeProvider } from 'angular-oauth2-oidc';
import { Toast, ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { OrderImageModalComponent } from '../../order-image-modal/order-image-modal.component';
import { ColumnLinkMeshProductListModalComponent } from '../../column-link-mesh-product-list-modal/column-link-mesh-product-list-modal.component';
import { PrcsharedserviceService } from '../PrecageService/prcsharedservice.service';

@Component({
  selector: 'app-ctsmeshprc',
  templateUrl: './ctsmeshprc.component.html',
  styleUrls: ['./ctsmeshprc.component.css']
})
export class CtsmeshprcComponent {
  CustomerCode= this.prcSharedS.lCustomerCode;
  ProjectCode=this.prcSharedS.lProjectCode;
  OrderStatus= this.prcSharedS.lStatus;
  JobID= this.prcSharedS.lJobID;
  ScheduledProd= this.prcSharedS.lScheduledProd;
  BBSID= this.prcSharedS.lBBSID;
  POSTID= this.prcSharedS.lPostID;
  ordernumber= this.prcSharedS.lordernumber;
  ProductType: any;
StructureElement: any;
ScheduleProd: any;
  Imagename: any;
  showSideTable: boolean = false;
  bbsOrderTable: ctsmesharray[] = [];
  bbsOrderTemp:ctsmesharray[] = [];
  shapeCodeList: any[] = [];
  sizeList: any[] = [];
  Diameter: any;
  Spacing: any;
  CarrierWireDia:any;
  Mass: any;
  TotalWeight: any;
  StaticImagename: any;
  editIndex: any = null;
  showshapecode: boolean=true;
  imagesPerRow: any=5;
  images: string[] = [];

  showA:boolean=false;
  showB:boolean=false;
  showC:boolean=false;
  showD:boolean=false;
  showE:boolean=false;
  showF:boolean=false;
  showG:boolean=false;
  showH:boolean=false;
  showI:boolean=false;
  showJ:boolean=false;
  showK:boolean=false;
  showL:boolean=false;
  showM:boolean=false;
  showN:boolean=false;
  showO:boolean=false;
  showP:boolean=false;
  showQ:boolean=false;
  showR:boolean=false;
  showS:boolean=false;
  showT:boolean=false;
  showU:boolean=false;
  showV:boolean=false;
  showW:boolean=false;
  showX:boolean=false;
  showY:boolean=false;
  showZ:boolean=false;


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
    ProdMWDia:0,
    ProdMWSpacing:0,
    ProdCWDia:0,
    ProdCWSpacing:0,
    ProdMass:0,
    ProdMinFactor:0,
    ProdMaxFactor:0,
    ProdTwinInd:''

  };

 
  imageRows: string[][] = [];

  
  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public httpClient: HttpClient,
    private prcSharedS : PrcsharedserviceService
  ) {}

  ngOnInit(): void {  
    this.showshapelistimages();
    this.getShapeCodeList();
    this.getJobId(this.ordernumber);
    //console.log("checking");
    //console.log(this.imageRows);
    this.Imagename="";
    this.StaticImagename="mesh_wire.png";
    
    
    //this.getShapeCodeList('0001101154', '0000112393', 'N-Splice');

    this.sizeList = [10, 13, 16, 20, 25, 28, 32, 40, 50];
  }

  
  @Input() selectedRow: any;
  selectedRowIndex: number = -1;
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedRow && this.selectedRow) {
      // Refresh tab content based on selected row data
      // this.refreshTabContent();
      this.selectedRowIndex = -1;
      this.CustomerCode= this.prcSharedS.lCustomerCode;
       this.ProjectCode=this.prcSharedS.lProjectCode;
       this.OrderStatus= this.prcSharedS.lStatus;
       this.JobID= this.prcSharedS.lJobID;
       this.ScheduledProd= this.prcSharedS.lScheduledProd;
       this.BBSID= this.prcSharedS.lBBSID;
       this.POSTID= this.prcSharedS.lPostID;
       this.ordernumber= this.prcSharedS.lordernumber;
      // console.log("column tab", this.selectedRow)
      this.ngOnInit();
    }
  }

  getJobId(orderNumber: string): any {
    let ProdType=this.ProductType;
    let StructurEelement=this.StructureElement;
    let ScheduleProd=this.ScheduleProd;
    this.orderService.getJobId(orderNumber,ProdType,StructurEelement,ScheduleProd).subscribe({
      next: (response: any) => {
        //console.log('jobid', response);
        // //debugger;
        // this.createSharedService.selectedJobIds.StdBarsJobID = response

        this.JobID = response.MESHJobID;
        this.POSTID= response.PostID;
        //console.log("job id:", this.JobID);
        // this.getBBS(this.JobID);

      },
      error: () => { },
      complete: () => {
        this.GetTableData(this.CustomerCode, this.ProjectCode, this.POSTID,this.BBSID);
        // this.reloadMeshOthersDetails();
        //debugger;

      },
    });
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

  showshapelistimages()
  {
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

  ShowShapeList() {
    const modalRef = this.modalService.open(OrderImageModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.images = this.shapeCodeList;
    modalRef.componentInstance.StructureElement= "CTSMESH";
    modalRef.result.then((result) => {
      if (result) {
        //console.log(result);
      }
    });
  }


  byteArrayToBase64(byteArray: number[]): string {
    let binary = '';
    for (let i = 0; i < byteArray.length; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return btoa(binary);
  }

  DownloadProductList() {
    let lCategory = 'OTHERS';
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

  openBending() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
    };
    const modalRef = this.modalService.open(
      // BindingLimitComponent,
      ngbModalOptions
    );
  }

  title: any;

  tempprodlist: any;
  lColNum: number=0;

  ShowProductList() {
    let lCategory = 'OTHERS';
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
        modalRef.componentInstance.StructureElement = "CTSMESH";
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

  DownloadShapeList() {
    let lCategory = 'OTHERS';
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


 
  onSelectStandardBar() {}

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
      MeshID:0,
      MeshSort:0,
      CustomerCode:'',
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
      ProdMWDia:0,
    ProdMWSpacing:0,
    ProdCWDia:0,
    ProdCWSpacing:0,
    ProdMass:0,
    ProdMinFactor:0,
    ProdMaxFactor:0,
    ProdTwinInd:''
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
      ProdMWDia:0,
    ProdMWSpacing:0,
    ProdCWDia:0,
    ProdCWSpacing:0,
    ProdMass:0,
    ProdMinFactor:0,
    ProdMaxFactor:0,
    ProdTwinInd:''
     
    };
    this.orderService.saveMeshBeamDetails_beam(obj).subscribe({
      next: (response) => {
        //console.log('Beam Link Mesh Details', response);
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  getShapeCodeList(
  ) {
    let lcategorey = 'OTHERS';
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
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }

  imgElement: any;

  getRowData(item: any = [],index:any)
  {
    // this.Diameter=null
    // this.Spacing=null
    // this.CarrierWireDia=null
    // this.Mass=null
    // this.bbsOrderTemp=item;
    //debugger;
    this.selectedRowIndex = index;
    this.showshapecode=false;
    this.Diameter=item.ProdMWDia
    this.Spacing=item.ProdCWSpacing
    this.CarrierWireDia=item.ProdCWDia
    this.Mass=item.ProdMass
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

    if(this.ScheduledProd=="Y")
    {
      if(this.CustomerCode!="" && this.ProjectCode!= "" && this.POSTID>0 ) //&& this.JobID>0
      {
      this.orderService
      .getOthersDetailsNSH_PRC(CustomerCode, ProjectCode, PostID,BBSID)
      .subscribe({
        next: (response) => {
          //console.log('CTSMESHPRC', response);

          this.bbsOrderTable = response;
          //console.log(this.bbsOrderTable);
          this.TotalWeight=0;
          for(let i=0; i< this.bbsOrderTable.length; i++)
          {
            this.TotalWeight+= this.bbsOrderTable[i].MeshTotalWT;
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
    else
    {
      if(this.CustomerCode!="" && this.ProjectCode!= "" && this.POSTID>0){ //&& this.JobID>0
        this.orderService
      .getMeshOtherDetails_prc(CustomerCode, ProjectCode, PostID,BBSID)
      .subscribe({
        next: (response) => {
          //console.log('CTSMESHPRC', response);

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
        case 'F':
          this.showF = true;
          break;
        case 'G':
          this.showG = true;
          break;
        case 'H':
          this.showH = true;
          break;
        case 'I':
          this.showI = true;
          break;
        case 'J':
          this.showJ = true;
          break;
        case 'K':
          this.showK = true;
          break;
        case 'L':
          this.showL = true;
          break;
        case 'M':
          this.showM = true;
          break;
        case 'N':
          this.showN = true;
          break;
        case 'O':
          this.showO = true;
          break;
        case 'P':
          this.showP = true;
          break;
        case 'Q':
          this.showQ = true;
          break;
        case 'R':
          this.showR = true;
          break;
        case 'S':
          this.showS = true;
          break;
        case 'T':
          this.showT = true;
          break;
        case 'U':
          this.showU = true;
          break;
        case 'V':
          this.showV = true;
          break;
        case 'W':
          this.showW = true;
          break;
        case 'X':
          this.showX = true;
          break;
        case 'Y':
          this.showY = true;
          break;
        case 'Z':
          this.showZ = true;
          break;
      }
      return true;
    }
    else{
      return false;
    }
  }
 
}
