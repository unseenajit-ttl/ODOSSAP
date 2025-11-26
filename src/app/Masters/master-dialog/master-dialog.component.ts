import { Component, OnInit, Input } from '@angular/core'
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'cm-master-dialog',
  templateUrl: './master-dialog.component.html',
  styleUrls: ['./master-dialog.component.scss'],
})
export class MasterDialogComponent implements OnInit {
  
  @Input() name:any;
  @Input() formname:any;
  @Input() wbsitemdata:any;
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false


  constructor(public activeModal: NgbActiveModal,   
    private modalService: NgbModal,
   
  ) {}

  ngOnInit() {
    console.log(this.wbsitemdata)
   
  }

  submitReview() {
   
  }

  cancel() {
    this.modalService.dismissAll()
  }
}
