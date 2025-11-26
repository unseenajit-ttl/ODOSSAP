import { Component } from '@angular/core';
import { OrderService } from '../../orders.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-print-bpc-pdf-modal',
  templateUrl: './print-bpc-pdf-modal.component.html',
  styleUrls: ['./print-bpc-pdf-modal.component.css']
})
export class PrintBPCPdfModalComponent {
  url:any;
  blobUrl:any;
  constructor(public modal : NgbActiveModal,private sanitizer: DomSanitizer) { }
  ngOnInit(){
    this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    
  }
  dismissModal(){
    this.modal.dismiss("User closed modal!");
  }
}
