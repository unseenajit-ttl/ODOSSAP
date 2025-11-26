import { Component, Input, OnInit } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ProductionRoutesService } from 'src/app/SharedServices/production-routes.service';
import { LoginService } from 'src/app/services/login.service';
import { FileDownloadDirService } from 'src/app/SharedServices/FileDownloadDir/file-download-dir.service';
import { OrderService } from 'src/app/Orders/orders.service';
import { PrintWBSpdfpopupComponent } from '../wbs-pritn-pdf/wbs-pritn-pdf.component';

@Component({
  selector: 'app-documents-attached-posted',
  templateUrl: './documents-attached-posted.component.html',
  styleUrls: ['./documents-attached-posted.component.css'],
})
export class WbsDocumentsAttachedComponent implements OnInit {
  @Input() selectedRow: any;
  AttachmentList: any[] = [];
  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;
  loading: any = false;

  ProcessOrderLoading: boolean = false;

  inputCustomer: boolean=false;
  inputUser: boolean=false;

  Approve:boolean=false;

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private datePipe: DatePipe,
    private productionRoutesService: ProductionRoutesService,
    private loginService: LoginService,
    private modalService: NgbModal,
    private fileDownloadDirService: FileDownloadDirService
  ) {}
  ngOnInit(): void {
    this.getAttachedTableList();
    console.log('selectedRow', this.selectedRow);
    let approve= this.loginService.GetGroupName();
    if(approve.toString().includes("@natsteel.com"))
    {
      this.inputUser = true;
      this.inputCustomer= false;
    }
    else
    {
      this.inputUser = false;
      this.inputCustomer= true;
    }

  }

  getAttachedTableList() {
    // let OrderNumber = this.selectedRow.INTWBSELEMENTID; //1367; //this.dropdown.getCustomerCode(); //'0001101170';//this.selectedRow[0].CustomerCode;
    // let StructureElement = this.selectedRow.StructureElement; //'WALL'; //this.dropdown.getProjectCode()[0]; //this.selectedRow[0].ProjectCode;
    // let ProductType = this.selectedRow.ProductType; //'CAB'; //this.JobID; //735 ;//this.selectedRow[0].JobID;
    // let ScheduledProd = this.selectedRow.ScheduledProd; //'N'; //true;
    // this.orderService
    //   .check_Order_docs(
    //     OrderNumber,
    //     StructureElement,
    //     ProductType,
    //     ScheduledProd
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       debugger;
    //       console.log('AttachmentList', response);
    //       this.AttachmentList = response;
    //       if (this.AttachmentList) {
    //         if (this.AttachmentList.length != 0) {
    //           this.AttachmentList[0].isSelected = true;
    //           this.AttachmentListSelect(
    //             this.AttachmentList[0],
    //             this.AttachmentList[0].isSelected
    //           );
    //         }
    //       }
    //     },
    //     error: () => {},
    //     complete: () => {},
    //   });
  }

  getDownloadlink(): any {
    debugger;

    let item: any;

    this.AttachmentList.forEach((x) => {
      if (x.isSelected === true) {
        item = x;
      }
    });
    console.log('item', item);
    if (item != undefined) {
      this.ProcessOrderLoading = true;
      let ddCustomerCode = '0001101170'//this.selectedRow.CustomerCode;
      let ddProjectCode = '0000113012'// this.selectedRow.ProjectCode;
      let ddFileName = item.FileName;

      let ddRevision = item.Revision;
      let UserType = this.loginService.GetUserType();
      // const apiUrl =
      //   'http://172.25.1.224:8989/api/SharePointAPI/ShowDirDownload/'+ddCustomerCode+'/'+ddProjectCode+'/'+ddFileName+'/'+ddRevision;

      // return apiUrl;
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
      //const anchorLink = 'http://localhost:55592/api/SharePointAPI/ShowDirDownload/' + ddCustomerCode + '/' + ddProjectCode + '/' + ddFileName + '/' + ddRevision;

      // Navigate to the anchor link
      // window.open(anchorLink, '_blank');
      this.ProcessOrderLoading = false;
      window.location.href = anchorLink;
    } else {
      alert('Please select file to download');
    }
    this.ProcessOrderLoading = false;
  }

  getDownloadView(): any {
    debugger;
    this.ProcessOrderLoading = true;
    let item: any;
    this.AttachmentList.forEach((x) => {
      if (x.isSelected === true) {
        item = x;
      }
    });
    console.log('item', item);
    if (item != undefined) {
      let ddCustomerCode = this.selectedRow.CustomerCode;
      let ddProjectCode = this.selectedRow.ProjectCode;
      let ddFileName = item.FileName;

      let ddRevision = item.Revision;
      let UserType = this.loginService.GetUserType();

      const anchorLink =
        this.productionRoutesService.SharepointService +
        '/ShowDirView/' +
        ddCustomerCode +
        '/' +
        ddProjectCode +
        '/' +
        ddFileName +
        '/' +
        ddRevision +
        '/' +
        UserType;
      //const anchorLink = 'http://localhost:55592/api/SharePointAPI/ShowDirView/' + ddCustomerCode + '/' + ddProjectCode + '/' + ddFileName + '/' + ddRevision;

      // Navigate to the anchor link
      // window.open(anchorLink, '_blank');

      window.open(anchorLink, '_blank');
      this.ProcessOrderLoading = false;
    } else {
      alert('Please select file to download');
    }
  }

  Download_All() {
    debugger;
    const downloadOneByOne = (index: number) => {
      if (index < this.AttachmentList.length) {
        const element = this.AttachmentList[index];
        this.ProcessOrderLoading = true;

        let ddCustomerCode = this.selectedRow.CustomerCode;
        let ddProjectCode = this.selectedRow.ProjectCode;
        let ddFileName = element.FileName;
        let ddRevision = element.Revision;
        let UserType = this.loginService.GetUserType();

        const anchorLink =
          this.productionRoutesService.SharepointService +
          `/ShowDirDownload`
          let obj = {
            ddCustomerCode: ddCustomerCode,
            ddProjectCode: ddProjectCode,
            ddFileName: ddFileName,
            ddRevision: ddRevision,
            UserType: UserType,
          };
          this.fileDownloadDirService.downloadFile(anchorLink, obj, ddFileName);
        // Create a dynamic anchor element
        // const anchor = document.createElement('a');
        // anchor.href = anchorLink;
        // anchor.download = ddFileName; // Set the desired file name

        // // Trigger a click event to initiate the download
        // anchor.click();

        // Proceed to the next iteration after a short delay
        setTimeout(() => {
          // Remove the anchor element from the document
          // (not appended to the document, so removal is sufficient)
          // Proceed to the next iteration
          downloadOneByOne(index + 1);
        }, 5000); // You can adjust the delay (in milliseconds) as needed
      } else {

        setTimeout(() => {
          this.ProcessOrderLoading = false;
        }, 5000); // You can adjust the delay (in milliseconds) as needed
      }
    };

    // Start the download process
    downloadOneByOne(0);
  }

  Download_Selected() {
    debugger;
    // this.loading = true;
    // this.ProcessOrderLoading=true;
    const downloadOneByOneSelected = (index: number) => {
      if (index < this.AttachmentList.length) {
        this.ProcessOrderLoading = true;
        const element = this.AttachmentList[index];
        if (element.isSelected === true) {
          let ddCustomerCode = this.selectedRow.CustomerCode;
          let ddProjectCode = this.selectedRow.ProjectCode;
          let ddFileName = element.FileName;
          let ddRevision = element.Revision;
          let UserType = this.loginService.GetUserType();
          const anchorLink =
            this.productionRoutesService.SharepointService +
            `/ShowDirDownload`
          let obj = {
            ddCustomerCode: ddCustomerCode,
            ddProjectCode: ddProjectCode,
            ddFileName: ddFileName,
            ddRevision: ddRevision,
            UserType: UserType,
          };
          this.fileDownloadDirService.downloadFile(anchorLink, obj, ddFileName);
          // Create a dynamic anchor element
          // const anchor = document.createElement('a');
          // anchor.href = anchorLink;
          // anchor.download = ddFileName; // Set the desired file name

          // // Trigger a click event to initiate the download
          // anchor.click();
        }

        // Proceed to the next iteration after a short delay
        setTimeout(() => {
          // Remove the anchor element from the document
          // (not appended to the document, so removal is sufficient)
          // Proceed to the next iteration
          downloadOneByOneSelected(index + 1);
        }, 5000); // You can adjust the delay (in milliseconds) as needed
      } else {
        this.ProcessOrderLoading = false;
      }
    };

    // Start the download process
    downloadOneByOneSelected(0);
  }

  View() {}

  AttachmentListSelect(item: any, value: boolean) {
    // this.AttachmentList.forEach((x) => (x.isSelected = false));
    item.isSelected = value;
  }

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

  openPDFPopup() {
    debugger;
    this.ProcessOrderLoading = true;
    setTimeout(() => {
      this.ProcessOrderLoading = false;
    }, 10 * 1000); // 7 sec
    let item: any;
    this.AttachmentList.forEach((x) => {
      if (x.isSelected === true) {
        item = x;
      }
    });
    console.log('item', item);
    if (item != undefined) {
      let ddCustomerCode = '0001101170'//this.selectedRow.CustomerCode;
      let ddProjectCode = '0000113012'//this.selectedRow.ProjectCode;
      let ddFileName = item.FileName;

      let ddRevision = item.Revision;
      let UserType = this.loginService.GetUserType();

      const anchorLink =
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
        // centered: true,
        size: 'xl',
        windowClass: 'your-custom-dialog-class',
      };
      const modalRef = this.modalService.open(
        PrintWBSpdfpopupComponent,
        ngbModalOptions
      );

      modalRef.componentInstance.anchorLink = anchorLink;
      modalRef.componentInstance.FileName = ddFileName;
      modalRef.componentInstance.Params = obj;
      //const anchorLink = 'http://localhost:55592/api/SharePointAPI/ShowDirView/' + ddCustomerCode + '/' + ddProjectCode + '/' + ddFileName + '/' + ddRevision;

      // Navigate to the anchor link
      // window.open(anchorLink, '_blank');

      //window.open(anchorLink, '_blank');
    } else {
      alert('Please select file to download');
    }
    this.ProcessOrderLoading = false;
  }
}
