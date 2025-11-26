import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileDownloadDirService } from 'src/app/SharedServices/FileDownloadDir/file-download-dir.service';

@Component({
  selector: 'app-printpdfpopup',
  templateUrl: './printpdfpopup.component.html',
  styleUrls: ['./printpdfpopup.component.css'],
})
export class PrintpdfpopupComponent {
  @Input() anchorLink: any;
  @Input() FileName: any;
  @Input() Params:any;
  ProcessOrderLoading: boolean = false;
  url: any;
  blobUrl: any;
  inFoMessage: any;
  showMessage: boolean = false;
  constructor(public modal: NgbActiveModal, private sanitizer: DomSanitizer,private http :HttpClient,private fileDownloadDirService:FileDownloadDirService) {}
  ngOnInit() {
    // this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   this.anchorLink
    // );
    this.loadFile();
    this.checkFile(this.FileName);
    //window.open(this.anchorLink);
    this.blobUrl = 'data:text/html;base64,...';
  }
  dismissModal() {
    this.modal.dismiss('User closed modal!');
  }
  toggleFullscreen(): void {
    const iframe = document.getElementById('iframePDFViewerList') as HTMLElement;

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if ((iframe as any).mozRequestFullScreen) { // For Firefox
      (iframe as any).mozRequestFullScreen();
    } else if ((iframe as any).webkitRequestFullscreen) { // For Safari
      (iframe as any).webkitRequestFullscreen();
    } else if ((iframe as any).msRequestFullscreen) { // For IE/Edge
      (iframe as any).msRequestFullscreen();
    } else {
      console.warn('Fullscreen API is not supported by this browser.');
    }
  }

  downloadFile() {
    this.ProcessOrderLoading = true;
    //Remove the value of UserType from SessionStorage after 30 mins.
    setTimeout(() => {
      this.ProcessOrderLoading = false;
    }, 7 * 1000); // 7 sec
    let pLink = this.anchorLink;
    // Create a dynamic anchor element
    this.fileDownloadDirService.downloadFile(pLink, this.Params, this.FileName);
    
    // const anchor = document.createElement('a');
    // anchor.href = pLink;
    // anchor.download = this.FileName; // Set the desired file name

    // // Trigger a click event to initiate the download
    // anchor.click();
  }
  checkFile(pFileName: any) {
    var FilenameA = pFileName.split('.');
    this.showMessage = true;
    if (
      FilenameA.length > 1 &&
      (FilenameA[FilenameA.length - 1].toUpperCase() == 'IFC' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'XBIM' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'WEXBIM' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'IFCZIP' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'IFCXML')
    ) {
      //$('#iframePDFViewerRev').attr('src', '@Url.Content("~/Scripts/ViewerJS/Viewer3D.html")?DrawingID=' + pDrawingID + '&Revision=' + pRevision + '&FileName=' + pFileName + '&CustomerCode=' + lCustomerCode + '&ProjectCode=' + lProjectCode);
      this.inFoMessage =
        'The selected file has been downloaded. You may click the downloaded file to view it.';
      this.downloadFile();
    } else if (
      FilenameA.length > 1 &&
      (FilenameA[FilenameA.length - 1].toUpperCase() == 'JPEG' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'JPG' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'JPE' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'JIF' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'JFIF' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'JFI' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'PNG' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'GIF' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'TIFF' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'TIF' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'BMP' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'RAW' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'WEBP')
    ) {
      this.inFoMessage =
        'The selected file has been downloaded. You may click the downloaded file to view it.';
      this.downloadFile();
      //    iframePDFViewerRev.srcdoc = '<!html doctype><style>*{padding:0;margin:0}</style><img src="@Url.Action("viewDrawing", "DrawingRepository")?DrawingID=' + pDrawingID + '&Revision=' + pRevision + '&FileName=' + pFileName + '">';
    } else if (
      FilenameA.length > 1 &&
      (FilenameA[FilenameA.length - 1].toUpperCase() == 'XLSX' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'XLS' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'XLTX' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'XLSM' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'XLTM' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'XLAM' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DOC' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DOCX' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DOCM' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DOCHTML' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DOCMHTML' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'PPT' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'CSV' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'PPTX' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DWG' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DXF' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'DWF' ||
        FilenameA[FilenameA.length - 1].toUpperCase() == 'XLSB')
    ) {
      //document.getElementById("iframePDFViewerRev").onload = "document.write('<h3><center>Please wait for file downloading... </center></h3>');";
      //document.getElementById("iframePDFViewerRev").contentWindow.addEventListener('onload', FileDownloadF);
      this.inFoMessage =
        'The selected file has been downloaded. You may click the downloaded file to view it.';
      this.downloadFile();
    } else if (
      FilenameA.length > 1 &&
      FilenameA[FilenameA.length - 1].toUpperCase() == 'PDF'
      
    ) {
      this.showMessage = false;
      this.ProcessOrderLoading = true;
      setTimeout(() => {
        this.ProcessOrderLoading = false;
      }, 5 * 1000); // 7 sec
    } else {
      // iframePDFViewerRev.srcdoc = '<!html doctype><style>*{padding:0;margin:0}</style><h3><center>The file cannot be previewed on the system. Please download and use other tools to view it. </center></h3>';
      this.inFoMessage =
        'The file cannot be previewed on the system. Please download and use other tools to view it. ';
    }
  }
  loadFile(): void {
    const url = this.anchorLink; // Endpoint to fetch the PDF
    const params = this.Params;
 
    this.http.post(url, params, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const objectUrl = URL.createObjectURL(response);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      },
      (error) => {
        console.error('Failed to load PDF', error);
      }
    );
  }
}
