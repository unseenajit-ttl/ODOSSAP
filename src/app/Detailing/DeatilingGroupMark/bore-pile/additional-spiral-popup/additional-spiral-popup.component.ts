import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-additional-spiral-popup',
  templateUrl: './additional-spiral-popup.component.html',
  styleUrls: ['./additional-spiral-popup.component.css']
})
export class AdditionalSpiralPopupComponent {
  myForm!: FormGroup;
  @Input() Insert_BPC_Structuremarking:any;
  @Input() ParameterValues:any
  @Input() commonPopupModel:any;
  maxPosition!:number;
  minPosition!:number;

  constructor(private fb: FormBuilder,public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      spirals: this.fb.array([])
    });
    // this.maxPosition=Number(this.Insert_BPC_Structuremarking.numCageLength)+Number(this.Insert_BPC_Structuremarking.intLapLength);
    this.maxPosition=11500;

    this.minPosition=Number(this.Insert_BPC_Structuremarking.intLapLength);
    this.loadDefaultValuesIfExists();
  }

  get spirals() {
    return this.myForm.get('spirals') as FormArray;
  }

  addSpiral() {
    this.spirals.push(this.fb.group({
      spiralQty: ['', Validators.required],
      spiralPos: ['', Validators.required]
    }));
  }

  deleteSpiral(index: number) {
    this.spirals.removeAt(index);
  }
  addNewRecord(){
    console.log("addNewRecord=>",this.myForm)
    if(this.myForm.valid){
      // if (Number(this.Insert_BPC_Structuremarking.tntAdditionalSpiral)<=0)
      // {
      //       alert('Please select link dia and pitch by clicking the V link under elevation pattern.')
      //       return;
      // }
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
      // if (Number(this.Insert_BPC_Structuremarking.tntAdditionalSpiral)<=0)
      // {
      //       alert('Please select link dia and pitch by clicking the V link under elevation pattern.')
      //       return;
      // }
    let obj = this.myForm.value
    console.log("apply data=>",obj)
    let ObjArray = obj.spirals;
    let tntAdditionalSpiral = 0;
    if(ObjArray.length > 0){
      ObjArray.forEach((dta:any)=>{
        tntAdditionalSpiral += parseInt(dta.spiralQty);
      })
      this.Insert_BPC_Structuremarking.tntAdditionalSpiral = tntAdditionalSpiral;
      if(this.Insert_BPC_Structuremarking?.intStructureMarkId){
        this.Insert_BPC_Structuremarking.vchTactonConfigurationState.additionalSpiralList = ObjArray;
      }else{
        localStorage.setItem('additionalSpiralList',JSON.stringify(ObjArray));
      }
      this.activeModal.close(ObjArray);
    }
    }else{
      this.myForm.markAllAsTouched();
    }

  }
  loadDefaultValuesIfExists() {
    let mbList = [];
    if(this.Insert_BPC_Structuremarking.intSEDetailingId && this.Insert_BPC_Structuremarking.vchTactonConfigurationState !='' && this.Insert_BPC_Structuremarking.vchTactonConfigurationState?.additionalSpiralList){
     let tactonEditData = this.Insert_BPC_Structuremarking.vchTactonConfigurationState;
     mbList = tactonEditData.additionalSpiralList;
    this.populateModalData(mbList);
    }else if(localStorage.getItem('additionalSpiralList')){
      mbList = JSON.parse(localStorage.getItem('additionalSpiralList')!)
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
        spiralQty: [item.spiralQty,Validators.required],
        spiralPos: [item.spiralPos,Validators.required],
      });
      formArray.push(dayEntryGroup);
    })
  }
}
