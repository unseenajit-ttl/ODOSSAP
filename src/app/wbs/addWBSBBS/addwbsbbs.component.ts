import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-addwbsbbs',
  templateUrl: './addwbsbbs.component.html',
  styleUrls: ['./addwbsbbs.component.css']
})
export class AddWbsBbsComponent implements OnInit {
  WbsBbsForm!:  FormGroup;


  @Input() name:any;
  @Input() formname:any;
 // @Input() wbsitemdata:any;
  userProfile: any
  disableSubmit: boolean = false
  isaddnew: boolean = false
  selectedItems:any = [];
  isbbsauto:boolean=false;
 
  wbs1List:any=[];
  wbs2List:any=[];
  wbs3List:any=[];
  BBSDesc3List:any=[];
  


  constructor(public activeModal: NgbActiveModal,   
    private modalService: NgbModal,private formBuilder: FormBuilder) { }
  ngOnInit(): void {

    this.wbs1List= [     
      { item_id: 1, item_text: 'FAX' },
      { item_id: 2, item_text: 'BLDG' },
      { item_id: 3, item_text: 'PAV' }      
    ]; 
    this.wbs2List= [     
      { item_id: 1, item_text: '1' },
      { item_id: 2, item_text: '2' },    
      
    ];  
    this.wbs3List= [     
      { item_id: 1, item_text: '8177' },   
      { item_id: 2, item_text: 'GL-D-B' },        
    ];  
    this.BBSDesc3List= [     
      { item_id: 1, item_text: 'Ok' },   
      { item_id: 2, item_text: 'Additional' },      
      { item_id: 2, item_text: 'Kerb' },       
      { item_id: 2, item_text: 'Water Tank' },        
    ];   

   

    //console.log(this.wbsdata)
    this.WbsBbsForm = this.formBuilder.group({
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
  BBSauto()
  {
this.isbbsauto=!this.BBSauto
  }

  cancel() {
    this.modalService.dismissAll()
  }

}
