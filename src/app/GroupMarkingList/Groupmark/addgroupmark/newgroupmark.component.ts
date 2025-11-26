import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-newgroupmark',
  templateUrl: './newgroupmark.component.html',
  styleUrls: ['./newgroupmark.component.css']
})
export class NewGroupMarkComponent implements OnInit {
 groupmarkForm!:  FormGroup;


  @Input() name:any;
  @Input() formname:any;
 // @Input() wbsitemdata:any;
  userProfile: any
  disableSubmit: boolean = false
  isaddnew: boolean = false
  selectedItems:any = [];
 
  groupmarkList:any=[];
  parameterList:any=[]=[];
  


  constructor(public activeModal: NgbActiveModal,   
    private modalService: NgbModal,private formBuilder: FormBuilder) { }
  ngOnInit(): void {

    this.groupmarkList= [     
      { item_id: 1, item_text: 'Group mark1' },
      { item_id: 2, item_text: 'Group mark2' },
      { item_id: 3, item_text: 'Group mark3' }
      
    ];   
    this.parameterList=[
      { value: 1, text:1 },
      { value: 2, text:2 },
    ]

   

    //console.log(this.wbsdata)
    this.groupmarkForm = this.formBuilder.group({
      groupmarking: ['', Validators.required],
      rev: ['', Validators.required],
      postqty: ['', Validators.required],
      remark: ['', Validators.required]
      
    });
 
  }

  addnew()
  {
    this.isaddnew=!this.isaddnew;

  }
  submitReview() 
  {
   
  }

  cancel() {
    this.modalService.dismissAll()
  }

}
