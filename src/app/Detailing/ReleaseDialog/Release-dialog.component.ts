import { Component, OnInit, Input } from '@angular/core'
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'cm-Release-dialog',
  templateUrl: './Release-dialog.component.html',
  styleUrls: ['./Release-dialog.component.scss'],
})
export class ReleaseDialogComponent implements OnInit {

@Input() messagenumber:any;
  message:any="";
  disableSubmit: boolean = false
  iConfirm: boolean = false


  constructor(public activeModal: NgbActiveModal,   
    private modalService: NgbModal,
   
  ) {
    
  }

  ngOnInit() {  
    if(this.messagenumber=1)
    {
      this.message="The GroupMarkingId has already been released. Do you want to create a new version?";
    
    } 
    else if(this.messagenumber=2)
    {
      
    } 

  }

  submit() {
 
      this.activeModal.close({ event: 'close', isConfirm: true })
    
      this.modalService.dismissAll()
   
  }

  cancel() {   
    this.activeModal.close({ event: 'close', isConfirm: false })
    this.modalService.dismissAll()
  }

 
 
}
