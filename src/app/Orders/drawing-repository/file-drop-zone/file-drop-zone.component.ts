import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';
import { data } from 'jquery';
import { forEach, resolve } from 'mathjs';
import { ViewPdfModalComponent } from '../view-pdf-modal/view-pdf-modal.component';
import { ProductionRoutesService } from 'src/app/SharedServices/production-routes.service';
import { LoginService } from 'src/app/services/login.service';
import { FileDownloadDirService } from 'src/app/SharedServices/FileDownloadDir/file-download-dir.service';

@Component({
  selector: 'app-file-drop-zone',
  templateUrl: './file-drop-zone.component.html',
  styleUrls: ['./file-drop-zone.component.css']
})
export class FileDropZoneComponent {
  multiple: boolean = true;
  fileType = "application/pdf,.ifc,image/*,.dwg,.xlms,.docx,.xlsx,.pptx,.zip, .ifczip";
  dragDropEnabled = true;
  customerCode:any;
  projectCode:any;
  uploadedFileName = '';
  uploadType = 'R'
  docList:any;
  uploadFiles:any;
  selectedDoc:any = null;
  isLoding:boolean = false;
  @Output() filesChanged!: EventEmitter<FileList>;

  @ViewChild('fileInput') inputRef!: ElementRef<HTMLInputElement>;

  constructor(
    public modal : NgbActiveModal,
    private orderService:OrderService,
    private modalService: NgbModal,
    private productionRoutesService: ProductionRoutesService,
    private loginService:LoginService,
    private fileDownloadDirService: FileDownloadDirService
    ) {
    this.filesChanged = new EventEmitter();
  }
  dismissModal(){
    this.modal.dismiss("User closed modal!");
  }
  viewData(){
    if(this.selectedDoc != null){
      const modalRef = this.modalService.open(ViewPdfModalComponent, {
        size: 'xl', // 'lg' stands for large, adjust as needed
        centered: true, // Optional: Center the modal
        windowClass: 'your-custom-dialog-class'
      });
      modalRef.componentInstance.customerCode = this.customerCode;
      modalRef.componentInstance.projectCode = this.projectCode;
      modalRef.componentInstance.FileName = this.selectedDoc.FileName;
      modalRef.componentInstance.Revision = this.selectedDoc.Revision;
      modalRef.result.then(
        (result: any) => {
          // this.getDrawingList(this.retrieveForm);
        },
        (reason: any) => {
          // Handle dismissal or any other rejection
          // this.getDrawingList(this.retrieveForm);
          // console.log(reason);
        }
      );
    }else{
      alert('Please select record.')
    }
  }

  addFiles(fileInput: any){
    if(fileInput){
      this.checkFileCompatibilityToUpload(fileInput.files).then((result)=>{
        this.uploadDocuments(result);
      })
    }
  }
  addFilesDropped(files: any){
    this.checkFileCompatibilityToUpload(files).then((result)=>{
      this.uploadDocuments(result);
    })
  }
  checkFileCompatibilityToUpload(files: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Convert files to an array if it's not already
      let filesArray = Array.isArray(files) ? files : Array.from(files);

      if (filesArray.length > 0) {
        let arrayToSend: any[] = [];
        this.uploadedFileName = '';

        // Map over the filesArray instead of files
        let promises = filesArray.map((file: any) => {
          this.uploadedFileName += file.name + ', ';
          return this.checkIfFileExists(file).then(result => {
            if (result) {
              arrayToSend.push(file);
            }
          });
        });

        // Wait for all promises to complete
        Promise.all(promises)
          .then(() => {
            resolve(arrayToSend);
          })
          .catch(error => {
            reject(error); // Handle any potential errors
          });

      } else {
        resolve([]); // No files provided, resolve with an empty array
      }
    });
  }

  handleFileDrop(event: DragEvent) {
    if (event?.dataTransfer?.files?.length) {
      const files = event.dataTransfer.files;
      this.inputRef.nativeElement.files = files;
      this.addFilesDropped(files);
    }
  }
  viewDoc(){

  }
  downloadDoc(){
    // let downloadElements = this.docList.filter((item:any)=>item.isSelected == true);
    if(this.selectedDoc != null){
      let UserType = this.loginService.GetUserType();
      const anchorLink:any = this.productionRoutesService.SharepointService + `/ShowDirDownload`;
      let obj = {
        ddCustomerCode: this.customerCode,
        ddProjectCode: this.projectCode,
        ddFileName: this.selectedDoc.FileName,
        ddRevision: this.selectedDoc.Revision,
        UserType: UserType,
      };
      this.fileDownloadDirService.downloadFile(anchorLink, obj, this.selectedDoc.FileName);
    }else{
      alert('Please select record.')
    }
  }
  removeDoc(){
    if(this.selectedDoc != null){
        this.isLoding = true;
        this.orderService.Remove_Drawing(this.customerCode,this.projectCode,this.selectedDoc.DrawingID).subscribe({
          next: (response) => {
            this.isLoding = false;
            this.docList = this.docList.filter((item:any)=>item.DrawingID != this.selectedDoc.DrawingID)
            console.log("RemoveDoc=>",this.docList,this.inputRef);
            let fName = this.selectedDoc.FileName;
            this.removeFileByName(fName);
            this.selectedDoc = null;
          },
          error: (e) => {
            this.isLoding = false;
            alert('Update fails. Please check the Internet connection and try again.')
            },
          complete: () => {
            this.isLoding = false;
            alert(
              'The document has been modified successfully.\n\n此文档已成功修改.'
            );
          }
        });
    }else{
      alert('Please select record.')
    }
  }
  removeFileByName(fileName: string): void {
    const inputElement = this.inputRef.nativeElement;

    // Get the FileList object from the input element
    const files = Array.from(inputElement.files || []);

    // Filter out the file with the matching name
    const filteredFiles = files.filter(file => file.name !== fileName);

    // Create a new DataTransfer object
    const dataTransfer = new DataTransfer();

    // Add the filtered files to the DataTransfer object
    filteredFiles.forEach(file => dataTransfer.items.add(file));

    // Set the input element's files to the filtered files
    inputElement.files = dataTransfer.files;
  }
  async uploadDocuments(array: any) {
    console.log("array=>",array);
    if(array.length > 0){
      // for(let i=0; i<array.length;i++){
      //   await this.orderService.uploadFile(array[i],this.customerCode,this.projectCode,"","","","","","","","",this.uploadType,"","").subscribe((data)=>{
      //           console.log("Data");
      //         });
      // }
      this.isLoding = true;
      this.orderService.uploadDrawingFile(array,this.customerCode,this.projectCode,"","","","","","","","",this.uploadType,"","").subscribe((data)=>{
        if(data.length > 1){
          const flattenedArray = data.flat();
          this.docList = flattenedArray;
          this.docList.forEach((item:any)=>item['isSelected'] = false);
        }else{
          this.docList = data[0];
          this.docList.forEach((item:any)=>item['isSelected'] = false);
        }
        this.isLoding = false;
      })
    }
    // this.orderService.uploadDrawingRepoFile(formData).subscribe((data: any) => {
    //   console.log(data);
    //
    // });
  }

  checkIfFileExists(file: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let obj: any = {
        CustomerCode: this.customerCode,
        ProjectCode: this.projectCode,
        FileName: [file.name]
      };
      console.log("this.uploadType=>", this.uploadType);

      this.orderService.chkFileExist(obj).subscribe({
        next: (response: any) => {
          if (response > 0) {
            let lPMsg = "There is a same file " + file.name + " already in the system, ";
            if (this.uploadType == "O") {
              lPMsg = lPMsg + "overwrite it? ";
            } else {
              lPMsg = lPMsg + "create a new revision? ";
            }
            lPMsg = lPMsg + "Please confirm.";

            resolve(confirm(lPMsg));
          } else {
            resolve(true);
          }
        },
        error: (response: any) => {
          console.log("error=>", response);
          resolve(false); // handle error by resolving with false
        }
      });
    });
  }

}
// https://172.26.254.134:8089/Drawingrepository/uploadDrawingFiles
// Form Data to send
// CustomerCode: 0001101170
// ProjectCode: 0000113012
// WBS1:
// WBS2:
// WBS3:
// Prodtype:
// StructureElement:
// UploadType: R
// DrawingNo:
// Remarks:
// file[0]: (binary)

// https://172.26.254.134:8089/DrawingRepository/deleteDrawing
//post
// {"CustomerCode":"0001101170","ProjectCode":"0000113012","DrawingID":"5080"}
