import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BPCService } from '../../../MeshDetailing/bpc.service';
import { StiffnerList } from 'src/app/Model/bore_pile_detailing_harcoded_value';

@Component({
  selector: 'app-stiffner-ring-popup',
  templateUrl: './stiffner-ring-popup.component.html',
  styleUrls: ['./stiffner-ring-popup.component.css']
})
export class StiffnerRingPopupComponent {
  @Input() Insert_BPC_Structuremarking:any;
  @Input() ParameterValues:any;
  @Input() commonPopupModel:any;
  myForm!: FormGroup;
  mainBarList!:any;
  maxPosition!:number;
  minPosition!:number;
  SIZETYPES_list!:any;

  constructor(private fb: FormBuilder,public activeModal: NgbActiveModal,private BPCService : BPCService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      spirals: this.fb.array([])
    });
    this.Load_GetBorePilePopulateMethods("SIZETYPES",0," A");
    this.loadDefaultValuesIfExists();

  }

  get spirals() {
    return this.myForm.get('spirals') as FormArray;
  }

  addSpiral() {
    this.spirals.push(this.fb.group({
      stiffsize: ['', Validators.required],
      position: ['', [Validators.required]],
      square:[false]
    }));
  }

  deleteSpiral(index: number) {
    this.spirals.removeAt(index);
  }
  addNewRecord(){
    console.log("addNewRecord=>",this.myForm)
    if(this.myForm.valid){
      this.addSpiral();
    }else{
      this.myForm.markAllAsTouched();
    }
  }
  dismissModal() {
    this.activeModal.dismiss("User closed modal!");
  }
  applyData(){
    if(this.myForm.valid){
    let obj = this.myForm.value
    console.log("apply data=>",obj)
    let ObjArray = obj.spirals;
    let stiffArray:StiffnerList[]  = [];
    let count  = 0;

    ObjArray.forEach((stiif:any)=>{
      console.log("stiif=>",stiif)
      let match:any = stiif.stiffsize.match(/^([A-Za-z]+)(\d+)$/);
      let obj1:StiffnerList = {
        stiffner_ring_part_grade_field:match[1],
        stiffner_ring_part_dia_field:match[2],
        stiffner_ring_part_position:stiif.position,
        stiffner_ring_part_stiffner:stiif.square,
      } ;
      if(stiif.square){
        count += 1;
      }
      stiffArray.push(obj1);
    })
    this.Insert_BPC_Structuremarking.tntNumOfSquareStiffner = count * 4;
    this.Insert_BPC_Structuremarking.tntNumberOfStiffnerOrCentralizer = stiffArray.length;

    console.log("applyData=>",stiffArray);
    if(this.Insert_BPC_Structuremarking?.intStructureMarkId){
      this.Insert_BPC_Structuremarking.vchTactonConfigurationState.stiffnerList = stiffArray;
    }else{
      localStorage.setItem('StiffnerList',JSON.stringify(stiffArray));
    }
    this.activeModal.close(ObjArray);
    }else{
      this.myForm.markAllAsTouched();
    }

  }
  loadDefaultValuesIfExists() {
    let mbList = [];
    if(this.Insert_BPC_Structuremarking.intSEDetailingId && this.Insert_BPC_Structuremarking.vchTactonConfigurationState !=''){
     let tactonEditData = this.Insert_BPC_Structuremarking.vchTactonConfigurationState;
     mbList = tactonEditData.stiffnerList;
     this.populateModalData(mbList);
    }else if(localStorage.getItem('StiffnerList')){
      mbList = JSON.parse(localStorage.getItem('StiffnerList')!)
      this.populateModalData(mbList);
    }else{
      this.addNewRecord();
    }
  }
  populateModalData(data:any){
    const formArray = this.myForm.get('spirals') as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    data.forEach((item:any) => {
      let dayEntryGroup = this.fb.group({
        stiffsize: [item.stiffner_ring_part_grade_field +''+ item.stiffner_ring_part_dia_field,Validators.required],
        position: [item.stiffner_ring_part_position,Validators.required],
        square: [item.stiffner_ring_part_stiffner,Validators.required],
      });
      formArray.push(dayEntryGroup);
    })
  }
  Load_GetBorePilePopulateMethods(strType:any,intProductL2Id:any,strMainBarCode :any)
  {
    this.BPCService.GetBorePilePopulateMethods(strType,intProductL2Id,strMainBarCode)
    .subscribe({
      next: (response) => {

        if(strType=="SIZETYPES")
        {
          this.SIZETYPES_list = response;
        }
      },
      error: (e) => {

      },
      complete: () => {
      },
    });
  }

}
