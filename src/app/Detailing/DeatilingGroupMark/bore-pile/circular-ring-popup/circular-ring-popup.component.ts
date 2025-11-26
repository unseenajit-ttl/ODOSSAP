import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BPCService } from '../../../MeshDetailing/bpc.service';
import { CircularRingList } from 'src/app/Model/bore_pile_detailing_harcoded_value';

@Component({
  selector: 'app-circular-ring-popup',
  templateUrl: './circular-ring-popup.component.html',
  styleUrls: ['./circular-ring-popup.component.css']
})
export class CircularRingPopupComponent {
  @Input() Insert_BPC_Structuremarking:any;
  @Input() ParameterValues:any;
  @Input() commonPopupModel:any;
  myForm!: FormGroup;
  SIZETYPES_list!:any;
  constructor(private fb: FormBuilder,public activeModal: NgbActiveModal,private BPCService : BPCService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      size:['',Validators.required],
      quantity:['',[Validators.required,Validators.min(1)]]
    });
    this.Load_GetBorePilePopulateMethods("SIZETYPES",0," A");
    this.loadDefaultValuesIfExists();
  }
  dismissModal() {
    this.activeModal.dismiss("User closed modal!");
  }
  applyData(){
    if(this.myForm.valid){
    let obj = this.myForm.value
    let match:any = obj.size.match(/^([A-Za-z]+)(\d+)$/);
    let circularObj:CircularRingList ={
      circular_ring_part_grade_field:match[1],
      circular_ring_part_dia_field:match[2],
      circular_ring_part_quantity_field:obj.quantity,
    }
    this.Insert_BPC_Structuremarking.tntNumOfCircularRings = obj.quantity;
    if(this.Insert_BPC_Structuremarking?.intStructureMarkId){
      this.Insert_BPC_Structuremarking.vchTactonConfigurationState.circularRingObj = circularObj;
    }else{
      localStorage.setItem('circularRingObj',JSON.stringify(circularObj));
    }
    this.activeModal.close(obj);
    }else{
      this.myForm.markAllAsTouched();
    }

  }
  loadDefaultValuesIfExists() {
    let circularObj:any;

    if(this.Insert_BPC_Structuremarking.intSEDetailingId && this.Insert_BPC_Structuremarking.vchTactonConfigurationState !='' && this.Insert_BPC_Structuremarking.vchTactonConfigurationState?.circularRingObj){
     let tactonEditData = this.Insert_BPC_Structuremarking.vchTactonConfigurationState;
     circularObj = tactonEditData.circularRingObj;
     this.populateModalData(circularObj);
    }else if(localStorage.getItem('circularRingObj')){
      circularObj = JSON.parse(localStorage.getItem('circularRingObj')!)
      this.populateModalData(circularObj);
    }
  }
  populateModalData(data:any){
    this.myForm.get('size')?.setValue(data.circular_ring_part_grade_field +''+ data.circular_ring_part_dia_field);
    this.myForm.get('quantity')?.setValue(data.circular_ring_part_quantity_field);
  }
  resetForm(){
    this.myForm.reset(true);
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
