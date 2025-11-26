import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { Shapegroup } from 'src/app/Model/shapegroup';
import { ToastrService } from 'ngx-toastr';
import { ShapeMasterService } from '../../Services/shape-master.service';

@Component({
  selector: 'app-createshapegroup',
  templateUrl: './createshapegroup.component.html',
  styleUrls: ['./createshapegroup.component.css']
})
export class CreateshapegroupComponent implements OnInit {
  createshapegroupForm!: FormGroup;
  @Input() name: any;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  Shapegroupstring: string = "";
  strdimension: string = "";
  strstruct: string = "";
  strbending: string = "";
  strcoupler: string = "";
  ShapegroupObj: Shapegroup[] = [];
  isformsubmit: boolean = false;




  structuretypeList: any = [];
  bendingtypeList: any = [];
  couplertypeList: any = [];
  dimentiontypeList: any = [];
  shapecodelist: any[] = [];
  statuslist: any[] = [];


  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private shapemasterservice: ShapeMasterService,
    private tosterService: ToastrService

  ) { }

  ngOnInit(): void {

    this.createshapegroupForm = this.formBuilder.group({
      
      shapegroup: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dimention: new FormControl('', Validators.required),
      bendingtype: new FormControl('', Validators.required),
      structuretype: new FormControl('', Validators.required),
      couplertype: new FormControl('', Validators.required),
      archivedstatus: new FormControl(true, Validators.required),

    });
    this.LoadDropDowns();
  }
  LoadDropDowns() {
    this.statuslist = [
      { item_id: 0, item_text: 'Active' },
      { item_id: 1, item_text: 'Inactive' }];

    this.bendingtypeList = [
      { item_id: 'B', item_text: 'B' },
      { item_id: 'N', item_text: 'N' }
    ];
    this.structuretypeList = [
      { item_id: 'S', item_text: 'S' },
      { item_id: 'C', item_text: 'C' },
      { item_id: 'N', item_text: 'N' }

    ];
    this.couplertypeList = [
      { item_id: 'A', item_text: 'A' },
      { item_id: 'D', item_text: 'D' },
      { item_id: 'E', item_text: 'E' },
      { item_id: 'N', item_text: 'N' }
    ];
    this.dimentiontypeList = [
      { item_id: '2', item_text: '2' },
      { item_id: '3', item_text: '3' },
      { item_id: 'P', item_text: 'P' }
    ]

  }

  submit() {
    debugger;
    this.isformsubmit = true;
    

    if (this.createshapegroupForm.valid) {

      console.log(this.createshapegroupForm.value);
      const Shapegroupobj: Shapegroup = {
        ShapeGroupName: this.createshapegroupForm.value.shapegroup.trim(),
        ShapeGroupDesc: this.createshapegroupForm.value.description.trim(),
        DimentionType: this.createshapegroupForm.value.dimention.trim(),
        StructureType: this.createshapegroupForm.value.structuretype.trim(),
        BendingBarType: this.createshapegroupForm.value.bendingtype.trim(),
        CouplerType: this.createshapegroupForm.value.couplertype.trim(),
        IsArchived: !(this.createshapegroupForm.value.archivedstatus),
      };
      this.shapemasterservice.SaveShapeGroup(Shapegroupobj)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.ShapegroupObj.push(response);
            this.saveTrigger.emit(this.ShapegroupObj);
            this.tosterService.success('Shape Group Added successfully')
          },
          error: (e) => {

            console.log(e.error);
            this.tosterService.error(e.error)
          },
          complete: () => {
            this.modalService.dismissAll();


          },
        });

    }
    else {
      this.tosterService.error('Please fill the required fields');

    }

  }

  cancel() {
    this.isformsubmit = false;
    this.createshapegroupForm.reset();
    this.modalService.dismissAll()
  }

  Changecoupler(event: any) {
    this.strcoupler = event;
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;
  }
  Changebending(event: any) {
    this.strbending = event;
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;
  }
  Changestruct(event: any) {
    this.strstruct = event
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;
  }
  ChangeDimention(event: any) {
    this.strdimension = event
    this.Shapegroupstring = this.strdimension + this.strstruct + this.strbending + this.strcoupler;
  }


}
