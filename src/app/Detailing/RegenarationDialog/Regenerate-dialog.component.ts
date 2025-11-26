import { Component, OnInit, Input } from '@angular/core'
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'cm-Regenerate-dialog',
  templateUrl: './Regenerate-dialog.component.html',
  styleUrls: ['./Regenerate-dialog.component.scss'],
})
export class RegenerateDialogComponent implements OnInit {

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
      this.message="Do you want to Save ParameterSet and Regenerate the Products? Please Click OK to continue.";
    
    } 
    else if(this.messagenumber=2)
    {
      this.message="Do you want to Save the ParameterSet? Please Click OK to continue.";
    
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
