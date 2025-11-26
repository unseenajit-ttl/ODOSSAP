import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-addparameter',
  templateUrl: './addparameter.component.html',
  styleUrls: ['./addparameter.component.css']
})
export class AddparameterComponent implements OnInit {

addparameterForm!: FormGroup;
@Input() name:any;
@Input() formname:any;
@Input() wbsitemdata:any;
userProfile: any
disableSubmit: boolean = false
iConfirm: boolean = false


constructor(public activeModal: NgbActiveModal,private modalService: NgbModal,private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.addparameterForm=this.formBuilder.group({
      parametername:new FormControl ('', Validators.required),
      parametersequence:new FormControl ('', Validators.required),
      mwshape:new FormControl ('', Validators.required),
      cwshape:new FormControl ('', Validators.required),
      wiretype:new FormControl ('', Validators.required),
      angletype:new FormControl ('', Validators.required),
      angledir:new FormControl ('', Validators.required),
      bendseq1:new FormControl ('', Validators.required),
      bendseq2:new FormControl ('', Validators.required),
      criticalindicator:new FormControl ('', Validators.required),
      minlength:new FormControl ('', Validators.required),
      maxlength:new FormControl ('', Validators.required),
      constantvalue:new FormControl ('', Validators.required)




    })

  }
  submitReview() {
    alert("Details Submitted Successfully!")
   
  }

  cancel() {
    this.modalService.dismissAll()
  }
  

}
