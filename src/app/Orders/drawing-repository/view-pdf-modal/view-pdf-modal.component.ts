import { Component } from '@angular/core';
import { OrderService } from '../../orders.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-pdf-modal',
  templateUrl: './view-pdf-modal.component.html',
  styleUrls: ['./view-pdf-modal.component.css']
})
export class ViewPdfModalComponent {
  customerCode:any;
  projectCode:any;
  FileName:any;
  Revision:any;
  blobUrl:any;
  constructor(public modal : NgbActiveModal,private orderService:OrderService,private sanitizer: DomSanitizer) { }
  ngOnInit(){
    this.orderService.viewDrawing(this.customerCode,this.projectCode,this.FileName,this.Revision).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });  // Replace with the appropriate MIME type
      const url = window.URL.createObjectURL(blob);
      this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    },
    (error) => {
      console.error('Error fetching blob:', error);
    })
  }
  dismissModal(){
    this.modal.dismiss("User closed modal!");
  }
}
