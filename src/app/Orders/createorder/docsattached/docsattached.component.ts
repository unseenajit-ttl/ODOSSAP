import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { Route, Router } from '@angular/router';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { OrderService } from '../../orders.service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { LoginService } from 'src/app/services/login.service';
import { ProductionRoutesService } from 'src/app/SharedServices/production-routes.service';
import { PrintpdfpopupComponent } from '../../process-order/printpdfpopup/printpdfpopup.component';
import { FileDownloadDirService } from 'src/app/SharedServices/FileDownloadDir/file-download-dir.service';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD', //YYYY-MM-DD
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-docsattached',
  templateUrl: './docsattached.component.html',
  styleUrls: ['./docsattached.component.css'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DocsattachedComponent {
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;
  @Input() SelectedRecord: any;
  ProcessOrderLoading: boolean = false;
  CustomerCode: any = '';
  ProjectCode: any = '';

  OrderNumber: any;
  StructureElement: any;
  ProductType: any;
  ScheduledProd: any;
  WBS1: any;
  WBS2: any;
  WBS3: any;
  selectedFile: any;
  ListofDocuments: any[] = [];
  DocumentNo: string = '';
  Remarks: string = '';

  DocumentLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private renderer: Renderer2,
    private el: ElementRef,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private productionRoutesService: ProductionRoutesService,
    private modalService: NgbModal,
    private fileDownloadDirService: FileDownloadDirService
  ) {}
  async ngOnInit() {
    console.log('SelectedRecord', this.SelectedRecord);

    this.CustomerCode = this.dropdown.getCustomerCode()
      ? this.dropdown.getCustomerCode()
      : this.SelectedRecord.CustomerCode;

    if (this.dropdown.getProjectCode().length > 1) {
      this.ProjectCode = this.dropdown.getProjectCode()[0];
    } else {
      this.ProjectCode = this.SelectedRecord.ProjectCode;
    }

    this.OrderNumber = this.SelectedRecord.OrderNumber;
    this.StructureElement = this.SelectedRecord.StructureElement;
    this.ProductType = this.SelectedRecord.Product;
    this.ScheduledProd = this.SelectedRecord.ScheduledProd;

    this.WBS1 = this.SelectedRecord.WBS.split('/')[0];
    this.WBS2 = this.SelectedRecord.WBS.split('/')[1];
    this.WBS3 = this.SelectedRecord.WBS.split('/')[2];

    this.getAttachedTableList();
    this.GetAccess();
  }

  GetDOwnloadFile() {
    const anchorLink =
      this.productionRoutesService.SharepointService +
      '/ShowDirDownload/0001101200/0000113013/OrderDetail-SAMPLE%2012-01-20242024-01-24T18_30_00%20(1).pdf/2';
    // Navigate to the anchor link
    window.open(anchorLink);
  }

  Download() {
    this.ListofDocuments.forEach((element) => {
      console.log('ListofDocuments', element);

      if (element.isSelected === true) {
        let ddCustomerCode = this.CustomerCode; //string;
        let ddProjectCode = this.ProjectCode; //string;
        let ddFileName = element.FileName; //string;
        let ddRevision = element.Revision; //number;
        let UserType = this.loginService.GetUserType();
        //const anchorLink = 'http://localhost:55592/api/SharePointAPI/ShowDirDownload/' + ddCustomerCode + '/' + ddProjectCode + '/' + ddFileName + '/' + ddRevision;
        const anchorLink =
          this.productionRoutesService.SharepointService +
          '/ShowDirDownload/' +
          ddCustomerCode +
          '/' +
          ddProjectCode +
          '/' +
          ddFileName +
          '/' +
          ddRevision +
          '/' +
          UserType;

        // Navigate to the anchor link
        // window.open(anchorLink, '_blank');

        window.location.href = anchorLink;
      }
    });
  }

  Download_Selected() {
    debugger;
    this.DocumentLoading = true;
    const downloadOneByOneSelected = (index: number) => {
      if (index < this.ListofDocuments.length) {
        const element = this.ListofDocuments[index];
        if (element.isSelected === true) {
          let ddCustomerCode = this.CustomerCode; //string;
          let ddProjectCode = this.ProjectCode; //string;
          let ddFileName = element.FileName; //string;
          let ddRevision = element.Revision; //number;
          let UserType = this.loginService.GetUserType();
          //const anchorLink = 'http://localhost:55592/api/SharePointAPI/ShowDirDownload/' + ddCustomerCode + '/' + ddProjectCode + '/' + ddFileName + '/' + ddRevision;
          const anchorLink =
            this.productionRoutesService.SharepointService +
            '/ShowDirDownload'

            let obj = {
              ddCustomerCode: ddCustomerCode,
              ddProjectCode: ddProjectCode,
              ddFileName: ddFileName,
              ddRevision: ddRevision,
              UserType: UserType,
            };
            this.fileDownloadDirService.downloadFile(anchorLink, obj, ddFileName);
          // Navigate to the anchor link
          // window.open(anchorLink, '_blank');

          //window.location.href = anchorLink;
        }

        // Proceed to the next iteration after a short delay
        setTimeout(() => {
          // Remove the anchor element from the document
          // (not appended to the document, so removal is sufficient)
          // Proceed to the next iteration
          downloadOneByOneSelected(index + 1);
        }, 5000); // You can adjust the delay (in milliseconds) as needed
      } else {
       // this.DocumentLoading = false;
       setTimeout(() => {
        this.DocumentLoading = false;
      }, 5000); // You can adjust the delay (in milliseconds) as needed
      }
    };

    // Start the download process
    downloadOneByOneSelected(0);
  }

  View(): any {
    debugger;
    this.ProcessOrderLoading=true;
    setTimeout(() => {
      this.ProcessOrderLoading = false;
    }, 15 * 1000); // 7 sec
    let item: any;
    this.ListofDocuments.forEach((x) => {
      if (x.isSelected === true) {
        item = x;
      }
    });
    console.log('item', item);
    if (item != undefined) {
      this.ProcessOrderLoading=true;
      let ddCustomerCode = this.CustomerCode; //string;
      let ddProjectCode = this.ProjectCode; //string;
      let ddFileName = item.FileName;

      let ddRevision = item.Revision;
      let UserType = this.loginService.GetUserType();
      //const apiUrl = 'http://localhost:55592/api/SharePointAPI/ShowDirView/' + ddCustomerCode + '/' + ddProjectCode + '/' + ddFileName + '/' + ddRevision;
      const apiUrl =
        this.productionRoutesService.SharepointService +
        '/ShowDirView'
           let obj = {
          ddCustomerCode: ddCustomerCode,
          ddProjectCode: ddProjectCode,
          ddFileName: ddFileName,
          ddRevision: ddRevision,
          UserType: UserType,
        };
        //this.fileDownloadDirService.downloadFile(anchorLink, obj, ddFileName);

        const ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          // centered: true,
          size: 'xl',
          windowClass: 'your-custom-dialog-class',
        };
        const modalRef = this.modalService.open(
          PrintpdfpopupComponent,
          ngbModalOptions
        );

        modalRef.componentInstance.anchorLink = apiUrl;
        modalRef.componentInstance.FileName = ddFileName;
        modalRef.componentInstance.Params = obj;
        this.ProcessOrderLoading=false;
     // window.open(apiUrl, '_blank');
    }
  }

  async ModifyItem(DrawingID: any, DrawingNo: any, Remarks: any) {
    try {
      let obj = {
        DrawingID: DrawingID,
        DrawingNo: DrawingNo,
        Remarks: Remarks,
      };
      const data = await this.orderService.Modify(obj).toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async Modify_button() {
    debugger;
    //let DrawingID: number = 0; //this.CustomerCode; //'0001101170';//this.selectedRow[0].CustomerCode;
    let DrawingNo = this.DocumentNo; //this.ProjectCode; //this.selectedRow[0].ProjectCode;
    let Remarks = this.Remarks; //this.OrderNumber;

    this.ListofDocuments.forEach((x) => {});
    let itemModify = false;
    for (let i = 0; i < this.ListofDocuments.length; i++) {
      let DrawingId = 0;
      if (this.ListofDocuments[i].isSelected == true) {
             if(this.ListofDocuments[i].UpdatedBy !==this.loginService.GetGroupName())
     {
       alert(
         `You can not Modify  this file ${this.ListofDocuments[i].FileName} because the file is uploaded by ${this.ListofDocuments[i].UpdatedBy}`
       );
       continue ;
     }
        itemModify = true;
        DrawingId = this.ListofDocuments[i].DrawingID;
        if (DrawingId == 0) {
          alert(
            'Please select a drawing file for modification.\n\n请选择需修改的文档.'
          );
          return;
        }

        let obj = {
          DrawingID: DrawingId,
          DrawingNo: DrawingNo,
          Remarks: Remarks,
        };
        this.DocumentLoading = true;
        let response = await this.ModifyItem(DrawingId, DrawingNo, Remarks);
      }
    }
    // this.orderService.Modify(obj).subscribe({
    //   next: (response) => {
    //     console.log('Modify -> ', response);
    //     if (response) {
    //       alert(
    //         'The document has been modified sucessfully.\n\n此文档已成功修改.'
    //       );
    //     }
    //   },
    //   error: (e) => {
    //     alert(
    //       'Update fails. Please check the Internet connection and try again.'
    //     );
    //   },
    //   complete: () => {
    //     this.DocumentLoading = false;
    //     this.getAttachedTableList();
    //   },
    // });
    this.DocumentLoading = false;
    if (itemModify == true) {
      this.getAttachedTableList();
    }
  }

  // Remove_button() {
  //   debugger;
  //   let OrderNuber=308428;
  //   let StructureElement=this.StructureElement;
  //   let ProductType=this.ProductType;
  //   let ScheduledProd=this.ScheduledProd;
  //   let CustomerCode='0001101170';
  //   let ProjectCode='0000113012';
  //   let DrawingID=1016;
  //   let Revision=1

  //   this.orderService.Remove(OrderNuber, StructureElement, ProductType,ScheduledProd,CustomerCode,ProjectCode,DrawingID,Revision).subscribe({
  //     next: (response) => {
  //       var lReturn1 = response.success;
  //       if (lReturn1 == -1) {
  //         //Error
  //     }
  //     else if (lReturn1 == 0) {
  //         //0 - Not found
  //         alert("The selected drawing not found from server.");
  //     }
  //     else if (lReturn1 == 1) {
  //       // //1 - Have other Order using the drawing, no delete
  //       // var lTablRef = document.getElementById('OrderDrawingTable').getElementsByTagName('tbody')[0];
  //       // var lRowNo = lTablRef.rows.length;
  //       // for (var i = 0; i < lTablRef.rows.length; i++) {
  //       //     var lRadioB = lTablRef.rows[i].cells[0].childNodes[0];
  //       //     if (lRadioB.checked) {
  //       //         lTablRef.deleteRow(i);
  //       //     }
  //       // }

  //       // lTablRef = document.getElementById('OrderDrawingTable').getElementsByTagName('tbody')[0];
  //       // setDocBK(pSNo + 1, lTablRef.rows.length);
  //       alert("The document is deleted sucessfully.\n\n此订单文件已成功删除.");

  //     }

  //   else{
  //   this.orderService.Remove_Drawing(CustomerCode, ProjectCode, DrawingID).subscribe({
  //     next: (response) => {

  //     },
  //     error: (e) => {
  //       alert('Update fails. Please check the Internet connection and try again.')
  //      },
  //     complete: () => {
  //       alert(
  //         'The document has been modified sucessfully.\n\n此文档已成功修改.'
  //       );
  //     },

  //   });
  // });
  // }

  async RemoveItem(CustomeCode: any, ProjectCode: any, DrawingId: any) {
    try {
      const data = await this.orderService
        .deleteDrawing(CustomeCode, ProjectCode, DrawingId)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async Remove_button() {
    let CustomeCode = this.CustomerCode;
    let ProjectCode = this.ProjectCode;

    this.ListofDocuments.forEach((x) => {});

    let itemRemoved = false;
    for (let i = 0; i < this.ListofDocuments.length; i++) {
      let DrawingId = 0;

      if (this.ListofDocuments[i].isSelected == true) {
               if(this.ListofDocuments[i].UpdatedBy !==this.loginService.GetGroupName())
     {
       alert(
         `You can not Delete  this file ${this.ListofDocuments[i].FileName} because the file is uploaded by ${this.ListofDocuments[i].UpdatedBy} `
       );
       continue ;
     }

        itemRemoved = true;
        DrawingId = this.ListofDocuments[i].DrawingID;
        if (DrawingId == 0) {
          alert(
            'Please select a drawing file for modification.\n\n请选择需修改的文档.'
          );
          return;
        }

        this.DocumentLoading = true;
        let response = await this.RemoveItem(
          CustomeCode,
          ProjectCode,
          DrawingId
        );
        // this.orderService
        //   .deleteDrawing(CustomeCode, ProjectCode, DrawingId)
        //   .subscribe({
        //     next(response) {
        //       console.log('Delete -> ', response);
        //     },
        //     error(err) {
        //       console.error(err);
        //     },
        //     complete: () => {
        //       this.DocumentLoading = false;
        //       this.getAttachedTableList();
        //     },
        //   });
      }
    }
    this.DocumentLoading = false;
    if (itemRemoved == true) {
      this.getAttachedTableList();
    }
  }

  async Upload() {
    let lPdfFile: any = document.getElementById('pdfData');
    if (!lPdfFile) {
      alert(
        'Please select a PDF drawing file for uploading.\n\n请选择一个PDF图纸文件上传.'
      );
      return;
    } else if (!lPdfFile.files) {
      alert(
        "This browser doesn't seem to support the property of file inputs.\n\n您所使用的浏览器不支持PDF文件的输入."
      );
      return;
    } else if (!lPdfFile.files[0]) {
      alert(
        'Please select a drawing PDF Document file for uploading.\n\n请选择一个PDF图纸文件上传.'
      );
      return;
    } else {
      const file = lPdfFile.files[0];
      if (file.size > 50000000) {
        alert("The PDF document file size is more than 50MB, Please reduce the file size.\n\n文档已超过50MB, 不能上载. 请减少文件的字节数.");
        return;
      }
    }
    // this.selectedFile = lPdfFile.files[0];
    this.selectedFile = lPdfFile.files[0];
    console.log('length -> ', lPdfFile.files.length);

    this.DocumentLoading = true;

    for (let i = 0; i < lPdfFile.files.length; i++) {
      // this.uploadFile(lPdfFile.files[i])
      if (lPdfFile.files[i]) {
        await this.uploadFileasync(lPdfFile.files[i]);
      }
    }
    const fileInput = document.getElementById('pdfData') as HTMLInputElement;
    // Resetting the file input by clearing its value
    if (fileInput) {
      fileInput.value = '';
    }
    this.DocumentLoading = false;
    //this.clearSelectedFiles();
    this.getAttachedTableList();
  }

  async uploadFileasync(file: any): Promise<any> {
    try {
      let customer = this.CustomerCode;
      let project = this.ProjectCode;
      let OrderNumber = this.OrderNumber;
      let DrawingNo = this.DocumentNo;
      let Remarks = this.Remarks;
      let WBS1 = this.WBS1;
      let WBS2 = this.WBS2;
      let WBS3 = this.WBS3;
      let ProdType = this.ProductType;
      let StructureElement = this.StructureElement;
      let UploadType = 'R';
      let ScheduledProd = this.ScheduledProd;
      let Revision = 0;
      const data = await this.orderService
        .uploadFile(
          file,
          customer,
          project,
          OrderNumber,
          DrawingNo,
          Remarks,
          WBS1,
          WBS2,
          WBS3,
          ProdType,
          StructureElement,
          UploadType,
          ScheduledProd,
          Revision
        )
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  uploadFile(file: any): void {
    if (file) {
      let customer = this.CustomerCode;
      let project = this.ProjectCode;
      let OrderNumber = this.OrderNumber;
      let DrawingNo = this.DocumentNo;
      let Remarks = this.Remarks;
      let WBS1 = this.WBS1;
      let WBS2 = this.WBS2;
      let WBS3 = this.WBS3;
      let ProdType = this.ProductType;
      let StructureElement = this.StructureElement;
      let UploadType = 'R';
      let ScheduledProd = this.ScheduledProd;
      let Revision = 0;

      this.DocumentLoading = true;
      this.orderService
        .uploadFile(
          file,
          customer,
          project,
          OrderNumber,
          DrawingNo,
          Remarks,
          WBS1,
          WBS2,
          WBS3,
          ProdType,
          StructureElement,
          UploadType,
          ScheduledProd,
          Revision
        )
        .subscribe({
          next: (response) => {
            console.log('uploadFile', response);
          },
          error: (e) => {},
          complete: () => {
            // this.loading = false;
            this.DocumentLoading = false;
            this.getAttachedTableList();
          },
        });
    }
  }

  getAttachedTableList() {
    let OrderNumber = this.OrderNumber; // 311629; //this.CustomerCode; //'0001101170';//this.selectedRow[0].CustomerCode;
    let StructureElement = this.StructureElement; // 'BEAM'; //this.ProjectCode; //this.selectedRow[0].ProjectCode;
    let ProductType = this.ProductType; // 'CAB'; //this.JobID; //735 ;//this.selectedRow[0].JobID;
    let ScheduledProd = this.ScheduledProd; // 'N'; //true;

    this.DocumentLoading = true;
    this.orderService
      .check_OrderDocs(
        OrderNumber,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response) => {
          console.log('ListofDocuments', response);
          this.ListofDocuments = response;
          // if (this.ListofDocuments.length > 1) {
          //   this.ListofDocuments[0].isSelected = true;
          // }
        },
        error: (e) => {},
        complete: () => {
          this.DocumentLoading = false;
        },
      });
  }

  SelectDocument(item: any) {
    //this.ListofDocuments.forEach((x) => (x.isSelected = false));
    //item.isSelected = true;

    this.DocumentNo = '';
    this.Remarks = '';
    console.log('item.isSelected', item.isSelected);
    this.DocumentNo = item.DrawingNo;
    this.Remarks = item.Remarks;
  }
  Close() {
    this.saveTrigger.emit(this.ListofDocuments.length);
    this.activeModal.dismiss('Cross click');
  }

  DocInput() {
    const inputElement = document.getElementById('Doc');
    if (inputElement) {
      inputElement.focus();
    }
  }

  RemarkInput() {
    const inputElement = document.getElementById('Remark');
    if (inputElement) {
      inputElement.focus();
    }
  }

  // FormatDateTime(OrgDate:any){
  // if(OrgDate){
  //  let tempobj= (new Date(OrgDate).toLocaleString().split(','))
  //  //tempobj[0]=this.datePipe.transform(tempobj[0], 'YYYY/MM/dd')?this.datePipe.transform(tempobj[0], 'YYYY/MM/dd'):tempobj[0];
  // }
  // else{
  //   return '';
  // }
  //}

  disableUpload() {
    let lOrderStatus = this.SelectedRecord.OrderStatus;
    let lUserID = this.loginService.GetGroupName();
    let lEditable = this.editable;
    if (
      lOrderStatus != 'New' &&
      lOrderStatus != 'Created' &&
      lOrderStatus != 'Sent' &&
      (lUserID == null ||
        lUserID.split('@').length != 2 ||
        lUserID.split('@')[1].toLowerCase() != 'natsteel.com.sg')
    ) {
      // alert("Cannot upload document for submitted and processed orders.\n\n"
      //     + "对已经提交和审核的订单, 上传文档功能无效.");
      return true;
    }
    if (
      lOrderStatus != 'New' &&
      lOrderStatus != 'Created' &&
      lOrderStatus != 'Sent' &&
      lOrderStatus != 'Created*' &&
      lOrderStatus != 'Submitted*' &&
      lOrderStatus != 'Submitted' &&
      lOrderStatus != 'Reviewed' &&
      lUserID != null &&
      lUserID.split('@').length == 2 &&
      lUserID.split('@')[1].toLowerCase() == 'natsteel.com.sg'
    ) {
      // alert("Cannot upload document for in production and delivered orders.\n\n"
      //     + "对已经生产和交货的订单, 上传文档功能无效.");
      return true;
    }
    if (lEditable != true) {
      // alert("Document uploading function is not available for read only permission.\n\n"
      //     + "上传文档功能无效.");
      return true;
    }

    return false;
  }

  disableSubmit() {
    let lOrderStatus = this.SelectedRecord.OrderStatus;
    let lUserID = this.loginService.GetGroupName();
    let lEditable = this.editable;
    if (
      lOrderStatus != 'New' &&
      lOrderStatus != 'Created' &&
      lOrderStatus != 'Sent' &&
      lOrderStatus != 'Created*'
    ) {
      // alert("Cannot modify document for submitted and processed orders.\n\n"
      //     + "对已经提交和审核的订单, 修改文档功能无效.");
      return true;
    }
    if (lEditable != true) {
      // alert("Document modification function is not available for read only permission.\n\n"
      //     + "修改文档功能无效.");
      return true;
    }

    return this.ListofDocuments.length == 0 ? true : false;
  }

  disabledownload() {
    return this.ListofDocuments.length == 0 ? true : false;
  }
  // clearSelectedFiles() {
  //   // Reset the value of the input element to clear the selected filesconst
  //   let selectedFilesInput = document.getElementById(
  //     'pdfData'
  //   ) as HTMLInputElement;
  //   if (selectedFilesInput) {
  //     selectedFilesInput.value = '';
  //   }
  // }
  UpdateDateFormat(date: any) {
    if (date) {
      date = new Date(date).toLocaleString('en-US');
      //Format- YYYY/MM/DD, H/M
      let tempArr = date.split(',');
      tempArr[0] = this.datePipe.transform(tempArr[0], 'YYYY/MM/dd');
      date = tempArr.join(',');
    }

    return date;
  }
  editable: any = true;
  GetAccess() {
    let pCustomerCode = this.CustomerCode; // 311629; //this.CustomerCode; //'0001101170';//this.selectedRow[0].CustomerCode;
    let pProjectCode = this.ProjectCode; // 'BEAM'; //this.ProjectCode; //this.selectedRow[0].ProjectCode;
    this.DocumentLoading = true;

    this.orderService.GetAccess_Right(pCustomerCode, pProjectCode).subscribe({
      next: (response) => {
        console.log('ListofDocuments', response);
        if (response) {
          if (response.Editable == 'Yes') {
            this.editable = true;
          } else {
            this.editable = false;
          }
        }
      },
      error: (e) => {},
      complete: () => {
        this.DocumentLoading = false;
      },
    });
  }
  postAndRedirect(url: string, data: any): void {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
  }

  postAndRedirect_View(url: string, data: any): void {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = '_blank';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
  }
}
