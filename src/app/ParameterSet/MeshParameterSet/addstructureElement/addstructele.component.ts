import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-addstructele',
  templateUrl: './addstructele.component.html',
  styleUrls: ['./addstructele.component.css']
})
export class AddstructeleComponent implements OnInit {
  structeleform!:  FormGroup;
  
  @Input() name:any;
  @Input() formname:any;
 // @Input() wbsitemdata:any;
  userProfile: any
  disableSubmit: boolean = false
  isaddnew: boolean = false
  selectedItems:any = []; 
  groupmarkList:any=[];
  parameterList: any[]=[];
  


  constructor(public activeModal: NgbActiveModal,   
    private modalService: NgbModal,private formBuilder: FormBuilder) { }
  ngOnInit(): void {

    this.parameterList=[
      { value: 1, text:1 },
      { value: 2, text:2 },
    ]  

   

    //console.log(this.wbsdata)
    this.structeleform = this.formBuilder.group({
      groupmarking: ['', Validators.required],
      rev: ['', Validators.required],
      postqty: ['', Validators.required],
      remark: ['', Validators.required]
      
    });
 
  }

  addnew()
  {
    // this.isaddnew=!this.isaddnew;
    this.parameterList.push({ value: 3, text:3})
  


  }
  submitReview() 
  {
   
  }

  Reset() {
    this.modalService.dismissAll()
  }

}
