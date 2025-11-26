import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';
import { number } from 'mathjs';

@Component({
  selector: 'app-delivered-order-document',
  templateUrl: './delivered-order-document.component.html',
  styleUrls: ['./delivered-order-document.component.css'],
})
export class DeliveredOrderDocumentComponent implements OnInit {
  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() DONo: any;
  @Input() DODate: any;

  DOdata: any[] = [];
  DOTableList: any[] = [];

  DOLoading: boolean = true;

  TotalWeight: any = 0;
  TotalQty: any = 0;
  TotalM2Qty: any = 0;

  documentIndex: string = '';
  fileName: string = '';
  fileType: string = '';
  antiForgeryToken: string = '';
  DeliveredOrderLoading: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService
  ) { }
  ngOnInit() {
    //this.dragElement(document.getElementById('mydiv'));
    this.GetDocTabledata();
  }

  async GetDocTabledata() {
    this.DOLoading = true;
    let response = await this.GetDOMaterial(
      this.CustomerCode,
      this.ProjectCode,
      this.DONo,
      this.DODate
    );
    console.log('Table Data', response);
    this.DOLoading = false;

    // if (response == false) {
    //   alert('Error getting Table Data!');
    // }
    if (response != false) {
      this.DOdata = response;
    } else {
      this.DOdata = [{
        DONumber: this.DONo,
        Product: "",
        TotalPCs: 0,
        TotalTonnage: 0,
        TotalM2: 0,
        SignedDO: 0,
        DODetails: 0,
        MillCert: 0
      }]
    }
    this.FilterDOdata();
  }

  FilterDOdata() {
    let DOList: any[] = [];

    for (let i = 0; i < this.DOdata.length; i++) {
      if (DOList.length == 0) {
        DOList.push(this.DOdata[i].DONumber);
      } else {
        let index = DOList.findIndex((x) => x === this.DOdata[i].DONumber);
        if (index < 0) {
          DOList.push(this.DOdata[i].DONumber);
        }
      }
    }
    console.log('DOList', DOList);
    // alert('list completed');
    let result: any[] = [];
    for (let i = 0; i < DOList.length; i++) {
      let obj: any[] = [];
      for (let j = 0; j < this.DOdata.length; j++) {
        if (this.DOdata[j].DONumber == DOList[i]) {
          obj.push(this.DOdata[j]);
        }
      }
      let tempObj = {
        DONumber: DOList[i],
        Data: obj,
      };
      result.push(tempObj);
    }

    console.group('result', result);
    // alert('result completed');
    this.DOTableList = result;
    if (result) {
      this.SetTotalWeightQty();
    }
  }
  SetTotalWeightQty() {
    let lTotalWeight = 0;
    let lTotalQty = 0;
    let lTotalm2Qty = 0;
    let lSize = this.DOTableList.length;
    if (lSize == 0) {
      return;
    }
    for (let i = 0; i < lSize; i++) {
      let lData = this.DOTableList[i].Data;
      let lWeight = 0;
      let lQty = 0;
      let lm2Qty = 0;
      if (lData) {
        for (let j = 0; j < lData.length; j++) {
          lWeight += lData[j].TotalTonnage;
          lQty += lData[j].TotalPCs;
          lm2Qty += lData[j].TotalM2 ? Number(lData[j].TotalM2) : 0;
        }
      }

      lTotalWeight += lWeight;
      lTotalQty += lQty;
      lTotalm2Qty += lm2Qty;
      lData[0].subTotalWt = Number(lWeight).toFixed(3);
      lData[0].subTotalQty = Number(lQty).toFixed(3);
      lData[0].subTotalm2Qty = Number(lm2Qty).toFixed(3);
    }

    this.TotalWeight = Number(lTotalWeight).toFixed(3);
    this.TotalQty = Number(lTotalQty).toFixed(3);
    this.TotalM2Qty = Number(lTotalm2Qty).toFixed(3);
  }
  async GetDOMaterial(
    CustomerCode: any,
    ProjectCode: any,
    DONumbers: any,
    DODate: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .getDOMaterial_Delivered(CustomerCode, ProjectCode, DONumbers, DODate)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async DownloadDocument(DONumber: any, docType: any) {
    // this.CustomerCode = '0001101170';
    // this.ProjectCode = '0000113012';
    // this.DONo = DONumber;
    this.DeliveredOrderLoading = true;
    let response = await this.GetDocumentIndex(
      this.CustomerCode,
      this.ProjectCode,
      DONumber,
      docType,
      this.DODate
    );

    console.log('Download Document ->', response);
  }

  lFileName: string = '';

  async GetDocumentIndex(
    customerCode: any,
    projectCode: any,
    dono: any,
    docType: any,
    doDate: any
  ) {
    try {
      const data = await this.orderService
        .GetDocumentIndex(customerCode, projectCode, dono, docType, doDate)
        .toPromise();
      console.log('DATA', data);
      if (data.success == true) {
        console.log(data.message[0]);

        let lItem = data.message[0];
        if (!lItem) {
          return;
        }
        // lItem.DocumentName;
        // lItem.DocumentIndex;
        // lItem.Extension;
        let DocumentIndex = lItem.DocumentIndex;
        let FileName = lItem.DocumentName + '.' + lItem.Extension;
        let FileType = lItem.Extension;

        this.lFileName = FileName;

        // ${DocumentIndex}/${FileName}/${FileType}
        // let "https://localhost:5009/getDocumentIndex/" + DocumentIndex +"/"+ FileName+"/"+FileType;
        // window.location.href = anchorLink;

        //LOADING START
        //this.ProcessOrderLoading = true;

        // let ProjectCode=this.selectedRow[0].ProjectCode;
        // let JobID=this.selectedRow[0].JobID;
        this.orderService
          .DownloadDocFile(DocumentIndex, FileName, FileType)
          .subscribe({
            next: (data) => {
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = this.lFileName;
              a.click();
              this.DeliveredOrderLoading = false;
              // window.open(url, '_blank'); // Opens the PDF in a new tab
            },
            error: (e) => {
              //this.ProcessOrderLoading = false;
              alert(
                'Order printing failed, please check the Internet connection and try again.'
              );
            },
            complete: () => { },
          });
      }
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  DownloadUrl = 'https://devappui.natsteel.com.sg:8080/project-document/v1/documents/document/download/'
  DownloadDeliveredDocs(pDONumber: any, pFileName: string) {
    /**
     * Updated Download function for delivered documents
     * using latest API provided by NatSteel
     * Inputs - FileName, CustomerCode, ProjectCode, DONumber
     * Output - List of Objects containing the Filenames and their Download Links.
     * Date: 21-06-2024
     */

    // let pFileName = 'Signed DO';
    let lCustomerCode = this.CustomerCode; //"0001104807";
    let lProjectCode = this.ProjectCode; // "0000114329"
    // let pDONumber = "1041717144";

    this.DeliveredOrderLoading = true;
    this.orderService
      .downloadDOMaterial_Delivered(lCustomerCode, lProjectCode, pDONumber, '2025-11-18')
      .subscribe({
        next: (data) => {
          console.log('Delivered Docs', data);
          if (data) {
            let lDocDownloaded = false;

            const downloadNext = (index: number) => {
              if (index >= data.length) {
                if (!lDocDownloaded) {
                  alert(
                    'Order printing failed, please check the Internet connection and try again.'
                  );
                }
                return;
              }

              const lItem = data[index];
              // if (lItem.fileName && lItem.fileName.includes(pFileName)) {
              //   const a = document.createElement('a');
              //   a.href = lItem.downloadUrl;
              //   a.download = lItem.fileName;
              //   document.body.appendChild(a);
              //   a.click();
              //   document.body.removeChild(a);
              //   lDocDownloaded = true;
              // }

              if (lItem.documentType && lItem.documentType.includes(pFileName)) {

                const lUrl = this.DownloadUrl + lItem.imageIndex + '?newStoragePortal=true';

                fetch(lUrl)
                  .then(res => res.blob())
                  .then(blob => {
                    const a = document.createElement('a');
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = lItem.documentName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  });

                lDocDownloaded = true;
              }

              // Proceed to next item after a short delay
              setTimeout(() => downloadNext(index + 1), 1000); // 1 second delay
            };

            // Start the recursive download loop
            downloadNext(0);
          }
        },
        error: (e) => {
          this.DeliveredOrderLoading = false;
          alert(
            'Order printing failed, please check the Internet connection and try again.'
          );
        },
        complete: () => {
          this.DeliveredOrderLoading = false;
        },
      });
  }


  /**
   * New Enhancement added as CR
   * Fucntionality: Add a download all button which downloads all the available document types at once.
   */
  async DownloadAll() {
    console.log('Downlaod All');
    // Start loading
    this.DeliveredOrderLoading = true;

    for (let i = 0; i < this.DOTableList.length; i++) {
      let lItem = this.DOTableList[i];
      // Download the Signed DO Document, if available.
      if (lItem.Data[0].SignedDO != 0) {
        await this.DownloadDeliveredDocsMulti(lItem.DONumber, 'Signed DO');
      }

      // Download the DO Detail Document, if available.
      if (lItem.Data[0].DODetails != 0) {
        await this.DownloadDeliveredDocsMulti(lItem.DONumber, 'DO Detail');
      }

      // Download the MillCert Document, if available.
      if (lItem.Data[0].MillCert != 0) {
        await this.DownloadDeliveredDocsMulti(lItem.DONumber, 'MillCert');
      }
    }
    // End Loading
    this.DeliveredOrderLoading = false;

  }

  async DownloadDeliveredDocsMulti(pDONumber: any, pFileName: string) {
    // Function recreated as Async to avoid Download conflict on Download All.

    let lCustomerCode = this.CustomerCode; //"0001104807";
    let lProjectCode = this.ProjectCode; // "0000114329" 

    let response = await this.DownloadDeliveredDocumentsMulti(lCustomerCode, lProjectCode, pDONumber);
    if (response != 'error') {
      if (response) {
        let lDocDownloaded = false;
        for (let i = 0; i < response.length; i++) {
          let lItem = response[i];
          // if (lItem.fileName) {
          //   if (lItem.fileName.includes(pFileName)) {
          //     const a = document.createElement('a');
          //     a.href = lItem.downloadUrl;
          //     a.download = lItem.fileName;
          //     a.click();
          //     lDocDownloaded = true;
          //     break;
          //   }
          // }
            if (lItem.documentType && lItem.documentType.includes(pFileName)) {
              const lUrl =
                this.DownloadUrl + lItem.imageIndex + '?newStoragePortal=true';

               fetch(lUrl)
          .then(res => res.blob())
          .then(blob => {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);

            a.href = url;
            a.download = lItem.documentName || 'Document.pdf'; // fallback if missing
            a.click();

            window.URL.revokeObjectURL(url);
          })
          .catch(() => {
            alert('Download failed. Please try again.');
          });
              lDocDownloaded = true;
              break;
            }
        }
        if (!lDocDownloaded) {
          alert(
            pFileName + ' printing failed.'
          );
        }
      }
    } else {
      alert(
        pFileName + ' printing failed, please check the Internet connection and try again.'
      );
    }
  }

  async DownloadDeliveredDocumentsMulti(lCustomerCode: any, lProjectCode: any, pDONumber: any): Promise<any> {
    try {
      const data = await this.orderService.downloadDOMaterial_Delivered(lCustomerCode, lProjectCode, pDONumber,'2025-10-11').toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

}
