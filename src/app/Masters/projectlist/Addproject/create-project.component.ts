import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-create-project.',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  projectForm!:  FormGroup;

  dropdownList1 :any=[];
  dropdownList2 :any=[];
  SAPMaterialList:any=[];
  selectedItems = [];
  dropdownSettings = {};

  @Input() name:any;
  @Input() formname:any;
  @Input() wbsitemdata:any;
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false
  Customerlist: any[]=[];
  sapprojectlist:any[]=[];
  transportmode:any[]=[];



  constructor(public activeModal: NgbActiveModal,private modalService: NgbModal,private formBuilder: FormBuilder) {}


  ngOnInit(): void {
    this.Customerlist = [
      { item_id: 1, item_text: 'ASIAGLOBE TRADE CONSORTIUM PTE LTD' },
      { item_id: 2, item_text: 'ASL SHIPYARD PTE LTD' },
      { item_id: 3, item_text: 'ASSET RECOVERY PTE LTD' }

    ];
    this.sapprojectlist = [
      { item_id: 1, item_text: '0000113029' },
      { item_id: 2, item_text: '0000100002' },
      { item_id: 2, item_text: '0000100003' },
      { item_id: 2, item_text: '0000100005' },
      { item_id: 2, item_text: '0000100007' },

    ];
    this.transportmode=[
      { item_id: 1, item_text: 'HC' },
      { item_id: 2, item_text: 'HC1' },
      { item_id: 2, item_text: 'HC6' },
      { item_id: 2, item_text: 'LB30' },

    ]


    this.projectForm = this.formBuilder.group({
      productcode:new FormControl ('', Validators.required),
      projectname:new FormControl ('',Validators.required),
      projdescription:new FormControl ('', Validators.required),
      customer:new FormControl ('', Validators.required),
      address1:new FormControl ('', Validators.required),
      address2:new FormControl ('', Validators.required),
      address3:new FormControl ('', Validators.required),

      saleincharge1:new FormControl ('', Validators.required),
      saleincharge2:new FormControl ('', Validators.required),
      saleincharge3:new FormControl ('', Validators.required),

      projectincharge1:new FormControl ('', Validators.required),
      projectincharge2:new FormControl ('', Validators.required),
      projectincharge3:new FormControl ('', Validators.required),

      deliverydate:new FormControl ('', Validators.required),
      startdate:new FormControl ('', Validators.required),
      Expirydate:new FormControl ('', Validators.required),
      sapprojcode:new FormControl ('', Validators.required),
      transportmode:new FormControl ('', Validators.required),   

  });
  }
  get f() { return this.projectForm.controls; }
 
  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

 /* public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }
*/

  submitReview() {
   
  }

  cancel() {
    this.modalService.dismissAll()
  }
}
