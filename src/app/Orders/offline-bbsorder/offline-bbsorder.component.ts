import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DocumentsAttachedComponent } from '../process-order/documents-attached/documents-attached.component';
import { NewpoComponent } from './newpo/newpo.component';
import { CopybbsofflineComponent } from './copybbsoffline/copybbsoffline.component';

@Component({
  selector: 'app-offline-bbsorder',
  templateUrl: './offline-bbsorder.component.html',
  styleUrls: ['./offline-bbsorder.component.css']
})
export class OfflineBBSOrderComponent implements OnInit {
  ngOnInit(): void {
    
  }
  constructor(
    private modalService: NgbModal

  ) {
   
  }

  OpenAttachments(item: any) {
   
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      NewpoComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.selectedRow = item;
  }

  CopyBBSAttachments(item: any){
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      CopybbsofflineComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.selectedRow = item;
  }

  Alert(){
    alert('It is going to backup your Digital Ordering System offline PO data to cloud. Continue?');
  }
  DeleteAlert(){
    alert('Please select PO.');
  }
}
