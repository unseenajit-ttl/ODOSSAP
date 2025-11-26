import { Component, OnInit, Input } from '@angular/core'
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'cm-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {

  @Input() name:any;
  @Input() formname:any='';
  @Input() wbsitemdata:any;
  @Input()groupmarkexist:any;
  @Input() innertable:boolean=false;
  @Input() stroreynumber:any;
  message:any=""
  counter:number=0;

  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false


  constructor(public activeModal: NgbActiveModal,   
    private modalService: NgbModal,
   
  ) {
    
  }

  ngOnInit() {
    console.log("nogoninit = ", this.innertable)
  if(this.innertable)
  {
    this.message='Storey '+this.stroreynumber +' will get deleted '
    }
  else{
    this.message="Do you really want to delete this record? This process can not be undone.";
 

  }
   
  }

  submit() {
    console.log('ok')
    console.log("groupmarklist",this.groupmarkexist);
    if(this.groupmarkexist>0 && this.counter==0)
    {
      this.counter=  this.counter+1;
      if(this.formname!=='')
      {
        this.message= this.formname +""+" WBS can not be deleted as it is attached to SOR.";
      }
      else{
      this.message="WBS can not be deleted as it is attached to SOR.";
      }

    }
    else if(this.groupmarkexist>0 && this.counter>0 && this.formname!=='')
    {
      this.activeModal.close({ event: 'close', isConfirm: true })
    }
    else if(this.groupmarkexist>0 && this.counter>0  && this.formname=='')
    {
      this.activeModal.close({ event: 'close', isConfirm: false })
    }
    else{
      this.activeModal.close({ event: 'close', isConfirm: true })
    }
 
   
  }

  cancel() {
    this.counter=0;
    console.log('cancel')
    this.activeModal.close({ event: 'close', isConfirm: false })
    this.modalService.dismissAll()
  }

  innertablesubmit()
  {
    this.activeModal.close({ event: 'close', isConfirm: true })
  }
  innertablecancel()
  {
    this.activeModal.close({ event: 'close', isConfirm: false })
  }
}
