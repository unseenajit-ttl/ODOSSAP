import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
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
import { FileDownloadDirService } from 'src/app/SharedServices/FileDownloadDir/file-download-dir.service';
import { OrderService } from 'src/app/Orders/orders.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
//import { Drawing_Data_Insert } from 'src/app/Model/Drawing_data_insert';
import { ToastrService } from 'ngx-toastr';
import { WbsService } from 'src/app/wbs/wbs.service';
import { EmailnotificationComponent } from 'src/app/wbs/wbsposting/emailnotification/emailnotification.component';
import { PrintpdfpopupComponent } from 'src/app/Orders/process-order/printpdfpopup/printpdfpopup.component';
//import { ODDrawingsUploadDetails } from 'src/app/Model/ODDrawingsUploadDetails';


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
  selector: 'app-document-attach',
  templateUrl: './document-attach.component.html',
  styleUrls: ['./document-attach.component.css'],
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
export class DocumentAttachForCustomerComponent {

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
  wbsElementId: number = 0

  DocumentLoading: boolean = false;
  BBSDescription: any;
  new_drawing_list: any;
  sentEmail: any;
  user_list: any;
  user_list_new: any;
  isSubmitted: boolean = false;
  IsApproved_disabled: any = false;
  disableModify: any = true


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
    private fileDownloadDirService: FileDownloadDirService,
    private wbsService: WbsService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private loginServic: LoginService,

  ) { }
  async ngOnInit() {
    console.log('SelectedRecord', this.SelectedRecord);

    // this.CustomerCode = '0001101170'//this.SelectedRecord.CustomerCode;
    // this.ProjectCode = '0000113012'//this.SelectedRecord.ProjectCode;
    
    this.CustomerCode = this.dropdown.getCustomerCode();
    this.ProjectCode = this.dropdown.getProjectCode()[0];
    this.wbsElementId = this.SelectedRecord.INTWBSELEMENTID

    this.OrderNumber = this.SelectedRecord.INTWBSELEMENTID;
    this.StructureElement = this.SelectedRecord.StructureElement;
    this.ProductType = this.SelectedRecord.ProductType;
    this.ScheduledProd = "";

    this.WBS1 = this.SelectedRecord.VCHWBS1;
    this.WBS2 = this.SelectedRecord.VCHWBS2;
    this.WBS3 = this.SelectedRecord.VCHWBS3;
    this.BBSDescription = this.SelectedRecord.VCHBBSNO;

    // this.Get_submission();
    this.getAttachedTableList();
    // this.GetAccess();
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
    this.ProcessOrderLoading = true;
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
      this.ProcessOrderLoading = true;
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
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
        windowClass: 'your-custom-dialog-class',
      };

      const modalRef = this.modalService.open(PrintpdfpopupComponent, ngbModalOptions);
      modalRef.componentInstance.anchorLink = apiUrl;
      modalRef.componentInstance.FileName = ddFileName;
      modalRef.componentInstance.Params = obj;
      this.DocumentLoading = false;
      //this.fileDownloadDirService.downloadFile(anchorLink, obj, ddFileName);

      // const ngbModalOptions: NgbModalOptions = {
      //   backdrop: 'static',
      //   keyboard: false,
      //   // centered: true,
      //   size: 'xl',
      //   windowClass: 'your-custom-dialog-class',
      // };
      // const modalRef = this.modalService.open(
      //   PrintpdfpopupComponent,
      //   ngbModalOptions
      // );

      // modalRef.componentInstance.anchorLink = apiUrl;
      // modalRef.componentInstance.FileName = ddFileName;
      // modalRef.componentInstance.Params = obj;
      // this.ProcessOrderLoading=false;
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
      const data = await this.wbsService.Modify(obj).toPromise();
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

    this.ListofDocuments.forEach((x) => { });
    let itemModify = false;
    for (let i = 0; i < this.ListofDocuments.length; i++) {
      let DrawingId = 0;
      if (this.ListofDocuments[i].isSelected == true) {
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
      const data = await this.wbsService
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

    this.ListofDocuments.forEach((x) => { });

    let itemRemoved = false;
    for (let i = 0; i < this.ListofDocuments.length; i++) {
      let DrawingId = 0;

      if (this.ListofDocuments[i].isSelected == true) {
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
    this.editable = false;
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
      // if ($('#pdfData')[0].files[0].size > 50000000) {
      //   alert("The PDF document file size is more than 50MB, Please reduce the file size.\n\n文档已超过50MB, 不能上载. 请减少文件的字节数.");
      //   return;
      // }
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
    this.toastr.success("File Uploaded successfully ")

    debugger;
  }

  async uploadFileasync(file: any): Promise<any> {
    try {
      let IsDuplicate = this.GetSubmissionStatus(file.name);
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
      const data = await this.wbsService
        .uploadFile_Posting(
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
          Revision,
          this.wbsElementId,
          "",
          IsDuplicate,
          "Customer"
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
      let IsDuplicate = this.GetSubmissionStatus(file.name);
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
      this.wbsService
        .uploadFile_Posting(
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
          Revision,
          this.wbsElementId,
          "",
          IsDuplicate,
          "Customer"
        )
        .subscribe({
          next: (response: any) => {
            console.log('uploadFile', response);
          },
          error: (e: any) => { },
          complete: () => {
            this.DocumentLoading = false;
            this.getAttachedTableList();
            // this.Get_submission();
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
    this.wbsService
      .check_Order_docs(
        OrderNumber,
        StructureElement,
        ProductType,
        ScheduledProd
      )
      .subscribe({
        next: (response: any[]) => {
          console.log('ListofDocuments', response);
          this.ListofDocuments = response;
          this.ListofDocuments.forEach(element => {
            element.UpdatedDate = this.formatDate(element.UpdatedDate)
          });
        },
        error: (e: any) => { },
        complete: () => {
          this.DocumentLoading = false;
        },
      });
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
    let lOrderStatus = 'Tanmay';
    // this.SelectedRecord.OrderStatus;
    let lUserID = this.loginService.GetGroupName();
    let lEditable = true;
    // this.editable;
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
      date = new Date(date).toLocaleString();
      //Format- YYYY/MM/DD, H/M
      let tempArr = date.split(',');
      tempArr[0] = this.datePipe.transform(tempArr[0], 'YYYY/MM/dd');
      date = tempArr.join(',');
    }

    return date;
  }
  editable: any = false;
  // GetAccess() {
  //   let pCustomerCode = this.CustomerCode; // 311629; //this.CustomerCode; //'0001101170';//this.selectedRow[0].CustomerCode;
  //   let pProjectCode = this.ProjectCode; // 'BEAM'; //this.ProjectCode; //this.selectedRow[0].ProjectCode;
  //   this.DocumentLoading = true;

  //   this.orderService.GetAccess_Right(pCustomerCode, pProjectCode).subscribe({
  //     next: (response) => {
  //       console.log('ListofDocuments', response);
  //       if (response) {
  //         if (response.Editable == 'Yes') {
  //           this.editable = true;
  //         } else {
  //           this.editable = false;
  //         }
  //       }
  //     },
  //     error: (e) => {},
  //     complete: () => {
  //       this.DocumentLoading = false;
  //     },
  //   });
  // }
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
  // openNotification() {
  //   debugger
  //   let lSelectedOrder: any[] = [];
  //   let lSuggestionMail: any[] = [];
  //   let lWBS1: any[] = [];


  //   for (let i = 0; i < this.ListofDocuments.length; i++) {
  //     //let lItem = this.postingArray[i]; -->by vidya
  //     let lItem = this.SelectedRecord;
  //     let SelectedRow = this.ListofDocuments[i];

  //     if (SelectedRow.isSelected) {
  //       lSelectedOrder.push(lItem);
  //       // FOR LIST OF SELECTED WBS1
  //       lWBS1.push(lItem.VCHWBS1);
  //       lWBS1 = [...new Set(lWBS1)];
  //     }
  //     let lMail = lItem.NotifiedEmailId
  //       ? lItem.NotifiedEmailId.split(';')
  //       : undefined;
  //     if (lMail) {
  //       if (lSuggestionMail.length == 0) {
  //         lSuggestionMail = lMail;
  //       } else {
  //         lSuggestionMail = [...lSuggestionMail, ...lMail];
  //       }
  //     }
  //   }
  //   lSuggestionMail = [...new Set(lSuggestionMail)];

  //   if (lSelectedOrder.length != 0) {
  //     const ngbModalOptions: NgbModalOptions = {
  //       backdrop: 'static',
  //       keyboard: false,
  //       // centered: true,
  //       size: 'xl',
  //       windowClass: 'your-custom-dialog-class',
  //     };
  //     const modalRef = this.modalService.open(
  //       EmailNotificationComponent,
  //       ngbModalOptions
  //     );
  //     modalRef.componentInstance.gOrderList = lSelectedOrder;
  //     modalRef.componentInstance.gSuggestionMail = lSuggestionMail;
  //     modalRef.componentInstance.gWBS1 = lWBS1;
  //     modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
  //       console.log('Notification sent to', lSelectedOrder);

  //       let lEmailSentTo = x;
  //       for (let i = 0; i < lSelectedOrder.length; i++) {
  //         let lIndex = this.ListofDocuments.findIndex(
  //           (x) => x.OrderNo == lSelectedOrder[i].OrderNo
  //         );

  //         if (lIndex != -1) {
  //           this.ListofDocuments[lIndex].NotifiedEmailId = lEmailSentTo;
  //           this.ListofDocuments[lIndex].NotifiedEmailDate =
  //             new Date().toLocaleDateString();
  //           this.ListofDocuments[lIndex].NotifiedByEmail =
  //             this.loginService.GetGroupName();
  //         }
  //       }
  //     });
  //     // modalRef.componentInstance.ProjectCode = this.selectedRow[0].ProjectCode;
  //     // modalRef.componentInstance.ProdType = this.selectedRow[0].ProdType;
  //   } else {
  //     alert('Please select an order.');
  //   }
  // }

  ApproveDrawing() {

    let content = this.user_list_new[0].IsApproved === null ? this.getTableHTML() : this.getTableHTML_AfterRejection()
    const obj = {
      "EmailTo": this.sentEmail,
      "EmailCc": "",
      "Subject": "Testing ",
      "Content": content
    }
    this.wbsService.SendEmail(obj).subscribe({

      next: (response: any) => {
        this.toastr.success("Email send Successfully")

      },
      error: (error: any) => {
        this.toastr.error("Failed to send email")
      },
      complete: () => {
      }
    })
  }

  getTableHTML(): string {
    // this.selectedprojectName = this.dropdown.getProjectCode();
    return `
    <div style="display: flex;justify-content: center;margin-top: 20px; margin-bottom: 20px;">
    <span><strong>DRAWING SUBMITTED FOR APPROVAL  (图纸已提交审批)</strong></span>
  </div>
      <table style="width:100.0%"; margin-top: 20px;" cellpadding="0" border="1" class="x_MsoNormalTable">
        <tbody>
          <tr>
            <td style="width:20.0%; padding:.75pt .75pt .75pt .75pt" width="20%">
              <p class="x_MsoNormal">Customer (<span lang="ZH-CN">客户名称</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal">${this.CustomerCode}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Project (<span lang="ZH-CN">工程项目</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal">${this.ProjectCode}</p>
            </td>
          </tr>
          <!-- Block, Storey, and Part in one row -->
          <tr>
            <td style="width:20.0%; padding:.75pt .75pt .75pt .75pt" width="20%">
              <p class="x_MsoNormal">Block (WBS1) <br>(<span lang="ZH-CN">座号</span>/<span lang="ZH-CN">大牌</span>)</p>
            </td>
            <td style="width:15.0%; padding:.75pt .75pt .75pt .75pt" width="15%">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${this.WBS1}</span></strong></p>
            </td>
            <td style="width:17.0%; padding:.75pt .75pt .75pt .75pt" width="17%">
              <p class="x_MsoNormal">Storey (WBS2) <br>(<span lang="ZH-CN">楼层</span>)</p>
            </td>
            <td style="width:14.0%; padding:.75pt .75pt .75pt .75pt" width="14%">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${this.WBS2}</span></strong></p>
            </td>
            <td style="width:16.0%; padding:.75pt .75pt .75pt .75pt" width="16%">
              <p class="x_MsoNormal">Part (WBS3) <br>(<span lang="ZH-CN">分部</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${this.WBS3}</span></strong></p>
            </td>
          </tr>
          <!-- Additional Rows -->
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Structure Element (构件)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.StructureElement}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Product Type (产品类型)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.ProductType}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">PO Number (订单号码)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5"></td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Required Date (到场日期)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${''}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">BBS Number (BBS加工表号)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.BBSDescription}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">BBS Description (BBS说明)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.BBSDescription}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Detailer Remarks (详细说明)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5"></td>
          </tr>
        </tbody>
      </table>

       <div style="display: flex;justify-content: center;margin-top: 20px; margin-bottom: 20px;">
      <span><strong> DRAWING DETAILS </strong></span>
    </div>
    <table style="width:100%; margin-top: 20px;" cellpadding="0" border="1" class="x_MsoNormalTable">
      <thead>
        <tr>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Document Name</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Drawing No</th>
          <th style="width:10%; padding:.75pt .75pt .75pt .75pt">Revision</th>
          <th style="width:30%; padding:.75pt .75pt .75pt .75pt">Detailer Remarks</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Date of Submission</th>
        </tr>
      </thead>
      <tbody>
        ${this.ListofDocuments.map((drawing: any) => `
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.DrawingNo}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.FileName}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.Revision}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.Remarks}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.UpdatedDate}</p></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    `;
  }

  getTableHTML_AfterRejection(): string {
    // this.selectedprojectName = this.dropdown.getProjectCode();
    return `
    <div style="display: flex;justify-content: center;margin-top: 20px; margin-bottom: 20px;">
    <span><strong>DRAWING SUBMITTED FOR APPROVAL  (图纸已提交审批)</strong></span>
  </div>
      <table style="width:100.0%"; margin-top: 20px;" cellpadding="0" border="1" class="x_MsoNormalTable">
        <tbody>
          <tr>
            <td style="width:20.0%; padding:.75pt .75pt .75pt .75pt" width="20%">
              <p class="x_MsoNormal">Customer (<span lang="ZH-CN">客户名称</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal">${this.CustomerCode}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Project (<span lang="ZH-CN">工程项目</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal">${this.ProjectCode}</p>
            </td>
          </tr>
          <!-- Block, Storey, and Part in one row -->
          <tr>
            <td style="width:20.0%; padding:.75pt .75pt .75pt .75pt" width="20%">
              <p class="x_MsoNormal">Block (WBS1) <br>(<span lang="ZH-CN">座号</span>/<span lang="ZH-CN">大牌</span>)</p>
            </td>
            <td style="width:15.0%; padding:.75pt .75pt .75pt .75pt" width="15%">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${this.WBS1}</span></strong></p>
            </td>
            <td style="width:17.0%; padding:.75pt .75pt .75pt .75pt" width="17%">
              <p class="x_MsoNormal">Storey (WBS2) <br>(<span lang="ZH-CN">楼层</span>)</p>
            </td>
            <td style="width:14.0%; padding:.75pt .75pt .75pt .75pt" width="14%">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${this.WBS2}</span></strong></p>
            </td>
            <td style="width:16.0%; padding:.75pt .75pt .75pt .75pt" width="16%">
              <p class="x_MsoNormal">Part (WBS3) <br>(<span lang="ZH-CN">分部</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${this.WBS3}</span></strong></p>
            </td>
          </tr>
          <!-- Additional Rows -->
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Structure Element (构件)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.StructureElement}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Product Type (产品类型)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.ProductType}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">PO Number (订单号码)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5"></td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Required Date (到场日期)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${''}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">BBS Number (BBS加工表号)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.BBSDescription}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">BBS Description (BBS说明)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${this.BBSDescription}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Detailer Remarks (详细说明)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5"></td>
          </tr>
        </tbody>
      </table>

       <div style="display: flex;justify-content: center;margin-top: 20px; margin-bottom: 20px;">
      <span><strong>ADDITIONAL DRAWING DETAILS</strong></span>
    </div>
    <table style="width:100%; margin-top: 20px;" cellpadding="0" border="1" class="x_MsoNormalTable">
      <thead>
        <tr>
        <th style="width:5%; padding:.75pt .75pt .75pt .75pt">Drawing No</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Document Name</th>
          <th style="width:5%; padding:.75pt .75pt .75pt .75pt">Revision</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Detailer Remarks</th>
          <th style="width:10%; padding:.75pt .75pt .75pt .75pt">Date of Submission</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Customer Remark</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Date of Approval</th>
                    <th style="width:5%; padding:.75pt .75pt .75pt .75pt">Status</th>

        </tr>
      </thead>
      <tbody>
        ${this.ListofDocuments.map((drawing: any) => `
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.DrawingNo}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.FileName}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.Revision}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.Remarks}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.UpdatedDate}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${this.user_list_new[0].vchCustomer_Remark || ''}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${this.user_list_new[0].DateOfApproval || ''}</p></td>

                        <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${this.user_list_new[0].IsApproved ? 'Approved' : 'Rejected'}</p></td>

          </tr>
        `).join('')}
      </tbody>
    </table>
    `;
  }
  // drawings = [
  //   { DocumentName: '1', DrawingName: 'Draw1', Revision: '1',CustomerRemark:'Length Problem', status:'Rejected',DetailerRemarks: 'Remark1', DateOfSubmission: '2025-03-10',DateOfApproval: '2025-03-10' },
  //   { DocumentName: '2', DrawingName: 'Draw2', Revision: '2',CustomerRemark:'Dimension Problem', DetailerRemarks: 'Remark2', status:'Rejected', DateOfSubmission: '2025-03-11',DateOfApproval: '2025-03-10' },
  //   // Add more objects as needed
  // ];

  // selectCustomerProjectName(CustomerCode:any,ProjectCode:any)
  // {
  //   this.commonService.GetCustomerName(CustomerCode).subscribe({
  //     next:(response)=>{
  //       this.customerName = response;

  //     },
  //     error:(err) =>{

  //     },
  //     complete:()=>{

  //     }
  //   })
  //   this.commonService.GetProjectName(ProjectCode).subscribe({
  //     next:(response)=>{
  //       this.ProjectName = response;

  //     },
  //     error:(err) =>{

  //     },
  //     complete:()=>{

  //     }
  //   })
  // }
  openNotification() {
    debugger
    let lSelectedOrder: any[] = [];
    let lSuggestionMail: any[] = [];
    let lWBS1: any[] = [];
    for (let i = 0; i < this.ListofDocuments.length; i++) {
      let lItem = this.SelectedRecord;

      lSelectedOrder.push(lItem);
      // FOR LIST OF SELECTED WBS1
      lWBS1.push(lItem.VCHWBS1);
      lWBS1 = [...new Set(lWBS1)];
      let lMail = lItem.NotifiedEmailId
        ? lItem.NotifiedEmailId.split(';')
        : undefined;
      if (lMail) {
        if (lSuggestionMail.length == 0) {
          lSuggestionMail = lMail;
        } else {
          lSuggestionMail = [...lSuggestionMail, ...lMail];
        }
      }
    }
    lSuggestionMail = [...new Set(lSuggestionMail)];


    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      EmailnotificationComponent, 
      ngbModalOptions
    );
    modalRef.componentInstance.gOrderList = lSelectedOrder;
    modalRef.componentInstance.gSuggestionMail = lSuggestionMail;
    modalRef.componentInstance.gWBS1 = lWBS1;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      debugger;
      console.log('Notification sent to', x);

      // let lEmailSentTo = x;
      // for (let i = 0; i < lSelectedOrder.length; i++) {
      //   let lIndex = this.ListofDocuments.findIndex(
      //     (x) => x.OrderNo == lSelectedOrder[i].OrderNo
      //   );

      //   if (lIndex != -1) {
      //     this.ListofDocuments[lIndex].NotifiedEmailId = lEmailSentTo;
      //     this.ListofDocuments[lIndex].NotifiedEmailDate =
      //       new Date().toLocaleDateString();
      //     this.ListofDocuments[lIndex].NotifiedByEmail =
      //       this.loginService.GetGroupName();
      //   }
      // }
    });
    modalRef.result.then(modalResult => {
      if (modalResult) {
        console.log("Send Notification ", modalResult);
        this.sentEmail = modalResult.EmailId;
        this.ApproveDrawing();
        this.Close()

        // this.get_user_DrawingList(this.OrderNumber);
      }
    }
    );

  }

  Upload_file_new() {
    debugger;
    // this.new_drawing_list = this.ListofDocuments.map((element:any)=>{
    //   const obj:any={
    //     DrawingId: element.DrawingID,
    //     DrawingNo: element.DrawingNo,
    //     CustomerCode: this.CustomerCode,
    //     ProjectCode: this.ProjectCode,
    //     FileName: element.FileName,
    //     Revision: element.Revision,
    //     DetailerRemark: element.Remarks,
    //     CustomerRemark: '',
    //     WBSElementID: this.OrderNumber,
    //     SubmitDate: element.UpdatedDate,
    //     SubmitBy: element.UpdatedBy,
    //     // ApprovedBy: '',
    //     ApprovedDate: '',
    //     // IsApproved: false,
    //     IsSubmitted: true,
    //     IsSubmitMail: false,
    //     IsApprovedMail: false,
    //     IsDeleted: false
    //   }
    //   return obj;
    // })
    // const result ={
    //   drawingSubmissions:this.new_drawing_list
    // }

    // this.new_drawing_list.forEach((element:any) => {

    // });

    const drawingDetails: any = {
      DrawingId: 0,                // Example value for nullable number
      DrawingNo: "",             // Example value for string
      CustomerCode: this.CustomerCode,        // Example value for string
      ProjectCode: this.ProjectCode,         // Example value for string
      FileName: '',    // Example value for string
      Revision: 2,                    // Example value for number
      DetailerRemark: '',     // Example value for string
      CustomerRemark: "",     // Example value for string
      WBSElementID: this.OrderNumber,             // Example value for number
      SubmitDate: (new Date()).toString(),       // Example value for date as string
      SubmitBy: this.loginServic.GetDislayName(),
      ApprovedBy: "",
      ApprovedDate: "",
      // IsApproved: false,        
      IsSubmitted: false,
      IsSubmitMail: false,
      // IsApprovedMail: false,           
      IsDeleted: false,
      WBS1: this.WBS1,
      WBS2: this.WBS2,
      WBS3: this.WBS3,
      StructureElement: this.StructureElement,
      ProductType: this.ProductType,
    };

    this.wbsService.Submit_drawing_details_New(drawingDetails).subscribe({
      next: (response: any) => {

      },
      error: (error: any) => {

      },
      complete: () => {
        this.isSubmitted = true;
        this.toastr.success("WBS Submited successfully for Approval ")
        // this.Get_submission();
      }
    })

    // this.wbsService.Submit_drawing_details(this.new_drawing_list).subscribe({
    //   next:(response)=>{

    //   },
    //   error:(error)=>{

    //   },
    //   complete:()=>{

    //   }
    // })
  }
  // get_user_DrawingList(wbsid:string)
  // {
  //   this.wbsService.Get_Drawing_Data_new(wbsid).subscribe({
  //     next:(response)=>{
  //       if(response)
  //       {
  //         debugger;
  //         this.user_list = response;
  //         // this.user_list.forEach((element: any) => {
  //         //   element.isExpand = false;
  //         // });
  //         // this.backup_user_list = JSON.parse(JSON.stringify(this.user_list));
  //       }
  //     },
  //     error:(error)=>{

  //     },
  //     complete:()=>{


  //     }
  //   })
  // }
  // Get_submission() {


  //   this.wbsService.Get_submission_status(this.OrderNumber).subscribe({
  //     next: (response: any) => {
  //       if (response) {
  //         this.user_list_new = response;
  //         if (this.user_list_new.length) {
  //           this.isSubmitted = true;
  //           if (this.user_list_new[0].IsApproved) {
  //             this.IsApproved_disabled = true;
  //           }
  //         }


  //       }
  //     },
  //     error: (error: any) => {

  //     },
  //     complete: () => {

  //     }
  //   })
  // }
  formatDate(isoDate: string): string | null {
    return this.datePipe.transform(isoDate, 'yyyy-MM-dd hh:mm a');
  }
  toggle_modify(item:any) {
    this.editable = true;

    this.DocumentNo = '';
    this.Remarks = '';
    console.log('item.isSelected', item.isSelected);
    this.DocumentNo = item.DrawingNo;
    this.Remarks = item.Remarks;
    
    for (const element of this.ListofDocuments) {

      if (element.isSelected) {
        this.disableModify = false;
        return;
      }
    }
    // this.ListofDocuments.for(element => {
    //   if (element.isSelected) {
    //     this.disableModify = false;
    //     return;
    //   }


    // });
    this.disableModify = true;
  }
  GetSubmissionStatus(name:string)
  {
    let isDuplicate=0;
    let item = this.ListofDocuments.find((element:any)=>element.FileName===name);
    if(item)
    {
      isDuplicate=1
    }
    return isDuplicate;
  }
}


