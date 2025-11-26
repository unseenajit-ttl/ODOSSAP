import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { Shapesurcharge } from 'src/app/Model/shapesurcharge';
import { formatDate } from '@angular/common';
import { ShapeSurchargeService } from '../../Services/shape-surcharge.service';
import { Shapecodeshapesurcharge } from 'src/app/Model/shapecodeshapesurcharge';
import { Surcharge } from 'src/app/Model/surcharge';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-create-shapesurcharge',
  templateUrl: './create-shapesurcharge.component.html',
  styleUrls: ['./create-shapesurcharge.component.css']
})
export class CreateShapesurchargeComponent implements OnInit {

  createshapesurchargeForm!: FormGroup;

  @Input() name: any;
  @Input() formname: any;
  @Input() wbsitemdata: any;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter()
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false
  diaconditionList: any[] = [];
  // surchargeList: any[] = [];
  // surChargeList:any[]=[];

  bardialist: any[] = [];
  newitem: Shapesurcharge[] = [];
  temparray: any[] = [];
  ShapecodeList: Shapecodeshapesurcharge[] = [];
  SurchargeList: Surcharge[] = [];
  isformsubmit: boolean = false;
  ShapesurchargeObj: Shapesurcharge[] = [];
  shapesurchargeList: Shapesurcharge[] = [];
  TotalNumberofRecord: any;
  userId: any;

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal, private formBuilder: FormBuilder,
    private shapesurchargeservice: ShapeSurchargeService,
    private tosterService: ToastrService,
    public datepipe: DatePipe,
    private loginService: LoginService,) { }
  
  ngOnInit(): void {

    this.userId = this.loginService.GetUserId();

    this.getShapeCodeList();
    this.getSurchargeDropdownList();
    this.createshapesurchargeForm = this.formBuilder.group({
      shapecode: new FormControl('', Validators.required),
      bardia: new FormControl('', Validators.required),
      invoicelength: new FormControl('', Validators.required),
      surcharge: new FormControl('', Validators.required),
      conditionid: new FormControl(''),
      diacondition: new FormControl('', Validators.required),
      status: new FormControl('')
      //updateddate: new FormControl('', Validators.required),
      //userid:new FormControl('', Validators.required)
    });



    this.diaconditionList = [
      { item_id: '<=BARDIA', item_text: '<=BARDIA' },
      { item_id: '==BARDIA', item_text: '==BARDIA' },
      { item_id: '>=BARDIA', item_text: '>=BARDIA' },

    ];
    this.bardialist = [

      { item_id: 6, item_text: '6' },
      { item_id: 7, item_text: '7' },
      { item_id: 8, item_text: '8' },
      { item_id: 10, item_text: '10' },
      { item_id: 12, item_text: '12' },
      { item_id: 12, item_text: '13' },
      { item_id: 16, item_text: '16' },
      { item_id: 20, item_text: '20' },
      { item_id: 22, item_text: '22' },
      { item_id: 24, item_text: '24' },
      { item_id: 25, item_text: '25' },
      { item_id: 28, item_text: '28' },
      { item_id: 32, item_text: '32' },
      { item_id: 40, item_text: '40' },
      { item_id: 50, item_text: '50' }

    ];



  }




  getShapeCodeList() {
    this.shapesurchargeservice.GetShapeCodes().subscribe({
      next: (response) => {
        this.ShapecodeList = response;
        console.log(this.ShapecodeList);

      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }

  getSurchargeDropdownList() {
    this.shapesurchargeservice.GetSurchargesDropdownList().subscribe({
      next: (response) => {
        this.SurchargeList = response;
        console.log(this.SurchargeList);
      },
      error: (e) => {

      },
      complete: () => {

      },

    });

  }

  
  submit() {

    let UserName = this.loginService.GetGroupName();
    const username = UserName.split('@')[0];
    this.isformsubmit = true;
    console.log(this.createshapesurchargeForm.value);
    if (this.createshapesurchargeForm.valid) {

      console.log(this.createshapesurchargeForm.value);


      for (var i = 0; i < this.createshapesurchargeForm.value.shapecode.length; i++) {
        for (var j = 0; j < this.createshapesurchargeForm.value.bardia.length; j++) {
          let  date=new Date();
          let latest_date =this.datepipe.transform(date, 'dd-MM-yyyy');
          let shapeCodeId = this.ShapecodeList.find(x=>x.ShapeCode === this.createshapesurchargeForm.value.shapecode[i].toString())?.Shape_Id
          const Shapegroupobj: Shapesurcharge = {
            ID: 0,
            ShapeCode_Id: shapeCodeId,
            ShapeCode: this.createshapesurchargeForm.value.shapecode[i].toString(),
            Bar_Dia: this.createshapesurchargeForm.value.bardia[j],
            Invoice_Length: this.createshapesurchargeForm.value.invoicelength,
            Surcharge: this.createshapesurchargeForm.value.surcharge,
            Surchage_Code: 0,
            Condition_Id: 0,
            Dia_Condition: this.createshapesurchargeForm.value.diacondition,
            User_Id: username,
            Updated_Date: latest_date


          };
          this.ShapesurchargeObj.push(Shapegroupobj);
        }
      }

      this.shapesurchargeservice.SaveShapeSurcharge(this.ShapesurchargeObj)
        .subscribe({
          next: (response) => {
            debugger;
            console.log(response);
            this.ShapesurchargeObj.push(response);
            this.saveTrigger.emit(this.ShapesurchargeObj);
            this.tosterService.success('Shape Surcharge Added successfully')
          },
          error: (e) => {
            var a = e.error.split(":");
            if(a[0]=="")
            {
              this.tosterService.error(a[1]+" Shapecode already exist");
            }
            else{
              this.tosterService.success('Shape Surcharge '+a[1] + ' Added successfully');
              this.tosterService.error(a[0]+" Shapecode already exist");
            }
            this.modalService.dismissAll();

          },
          complete: () => {
            this.modalService.dismissAll();

          },
        });

    }
    else {
      //this.tosterService.error('Please fill the required fields');

    }

  }


  cancel() {
    this.modalService.dismissAll()
  }
}





