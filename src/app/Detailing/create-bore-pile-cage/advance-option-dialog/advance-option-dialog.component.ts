import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-advance-option-dialog',
  templateUrl: './advance-option-dialog.component.html',
  styleUrls: ['./advance-option-dialog.component.css']
})
export class AdvanceOptionDialogComponent {
  @Input() lBPCRec: any;

  lLastSRLocation = 0;
  lCouplerTopOption = [
    { label: 'No-Coupler', value: 'No-Coupler' },
    { label: 'Nsplice-Standard-Coupler', value: 'Nsplice-Standard-Coupler' },
    { label: 'Nsplice-Standard-Stud', value: 'Nsplice-Standard-Stud' },
    { label: 'Nsplice-Extended-Coupler', value: 'Nsplice-Extended-Coupler' },
    { label: 'Nsplice-Extended-Stud', value: 'Nsplice-Extended-Stud' },
    { label: 'Esplice-Standard-Coupler', value: 'Esplice-Standard-Coupler' },
    { label: 'Esplice-Standard-Stud', value: 'Esplice-Standard-Stud' },
    { label: 'Esplice-Extended-Coupler', value: 'Esplice-Extended-Coupler' },
    { label: 'Esplice-Extended-Stud', value: 'Esplice-Extended-Stud' },
  ];
  lCouplerEndOption = [
    { label: 'No-Coupler', value: 'No-Coupler' },
    { label: 'Nsplice-Standard-Coupler', value: 'Nsplice-Standard-Coupler' },
    { label: 'Nsplice-Standard-Stud', value: 'Nsplice-Standard-Stud' },
    { label: 'Nsplice-Extended-Coupler', value: 'Nsplice-Extended-Coupler' },
    { label: 'Nsplice-Extended-Stud', value: 'Nsplice-Extended-Stud' },
    { label: 'Esplice-Standard-Coupler', value: 'Esplice-Standard-Coupler' },
    { label: 'Esplice-Standard-Stud', value: 'Esplice-Standard-Stud' },
    { label: 'Esplice-Extended-Coupler', value: 'Esplice-Extended-Coupler' },
    { label: 'Esplice-Extended-Stud', value: 'Esplice-Extended-Stud' },
  ];
  lSL1DiaOption = [
    { label: '32', value: '32' },
    { label: '25', value: '25' },
    { label: '20', value: '20' },
    { label: '16', value: '16' },
    { label: '13', value: '13' },
    { label: '10', value: '10' },
    { label: '8', value: '8' },
    { label: '6', value: '6' },
  ];
  lSL2DiaOption = [
    { label: '32', value: '32' },
    { label: '25', value: '25' },
    { label: '20', value: '20' },
    { label: '16', value: '16' },
    { label: '13', value: '13' },
    { label: '10', value: '10' },
    { label: '8', value: '8' },
    { label: '6', value: '6' },
  ];
  lSL3DiaOption = [
    { label: '32', value: '32' },
    { label: '25', value: '25' },
    { label: '20', value: '20' },
    { label: '16', value: '16' },
    { label: '13', value: '13' },
    { label: '10', value: '10' },
    { label: '8', value: '8' },
    { label: '6', value: '6' },
  ];

  lSRDiaAddOption = [
    { label: '32', value: '32' },
    { label: '25', value: '25' },
    { label: '20', value: '20' },
    { label: '16', value: '16' },
    { label: '13', value: '13' },
    { label: '10', value: '10' },
  ];
  lSRDiaOption = [
    { label: '32', value: '32' },
    { label: '25', value: '25' },
    { label: '20', value: '20' },
    { label: '16', value: '16' },
    { label: '13', value: '13' },
    { label: '10', value: '10' },
  ];
  lSRGradeOption = [
    { label: 'H', value: 'H' },
    { label: 'X', value: 'X' },
    { label: 'T', value: 'T' },
  ];
  lLapLen: number = 0;
  lEndLen: number = 0;
  sl1_length:any;
  sl1_dia:any;
  sl2_length:any;
  sl2_dia:any;
  sl3_length:any;
  sl3_dia:any;
  no_of_sr:any;
  sr_grade:any;
  sr_dia:any;
  sr_dia_add:any;
  sr1_location:any;
  last_location:any;
  rings_start:any;
  rings_end:any;
  rings_addn_member:any;
  rings_addn_no:any;
  no_of_cr_top:any =0;
  cr_spacing_top:any=0;
  no_of_cr_end:any;
  cr_spacing_end:any;
  extra_support_bar_ind:any;
  extra_support_bar_dia:any;
  extra_cr_no:any;
  extra_cr_dia:any;
  extra_cr_loc:any;
  coupler_top:any;
  coupler_end:any;
  crank_height_top:any;
  crank_height_end:any;
  crank2_height_end:any;
  crank2_height_top:any;
  mainbar_length_2layer:any;
  mainbar_location_2layer:any;
  bundle_same_type:any;

  cr_posn_top:any=0;
  cr_posn_end:any=0;
  cr_top_remarks:any="";
  cr_end_remarks:any="";

  constructor(public modal : NgbActiveModal) {}

  ngOnInit() {

    if (this.lBPCRec == null) {
      alert('There is no BPC record found.');
      return;
    }

    if (this.lBPCRec.no_of_sr == 1) {
      this.lLastSRLocation =
        this.lBPCRec.cage_length - this.lBPCRec.sr1_location;
    }
    if (this.lBPCRec.no_of_sr == 2) {
      this.lLastSRLocation =
        this.lBPCRec.cage_length - this.lBPCRec.sr2_location;
    }
    if (this.lBPCRec.no_of_sr == 3) {
      this.lLastSRLocation =
        this.lBPCRec.cage_length - this.lBPCRec.sr3_location;
    }
    if (this.lBPCRec.no_of_sr == 4) {
      this.lLastSRLocation =
        this.lBPCRec.cage_length - this.lBPCRec.sr4_location;
    }
    if (this.lBPCRec.no_of_sr == 5) {
      this.lLastSRLocation =
        this.lBPCRec.cage_length - this.lBPCRec.sr5_location;
    }
    this.lLapLen = parseInt(this.lBPCRec.lap_length);
    this.lEndLen = parseInt(this.lBPCRec.end_length);
    if (this.lBPCRec.main_bar_type == 'Mixed') {
      var lDia1 = 0;
      var lDia2 = 0;
      if (
        this.lBPCRec.main_bar_dia != null &&
        this.lBPCRec.main_bar_dia.split(',').length == 2
      ) {
        lDia1 = this.lBPCRec.main_bar_dia.split(',')[0];
        lDia2 = this.lBPCRec.main_bar_dia.split(',')[1];
        if (this.lBPCRec.crank2_height_top == null) {
          this.lBPCRec.crank2_height_top = 0;
          if (
            this.lBPCRec.crank_height_top != null &&
            this.lBPCRec.crank_height_top > 0
          ) {
            this.lBPCRec.crank2_height_top =
              this.lBPCRec.crank_height_top - Math.abs(lDia1 - lDia2);
          }
        }
        if (this.lBPCRec.crank2_height_end == null) {
          this.lBPCRec.crank2_height_end = 0;
          if (
            this.lBPCRec.crank_height_end != null &&
            this.lBPCRec.crank_height_end > 0
          ) {
            this.lBPCRec.crank2_height_end =
              this.lBPCRec.crank_height_end - Math.abs(lDia1 - lDia2);
          }
        }
      }
    }

    this.setDefaultValues();

  }

  applyData(){
    let obj = {
            sl1_length:this.sl1_length,
            sl1_dia:this.sl1_dia,
            sl2_length:this.sl2_length,
            sl2_dia:this.sl2_dia,
            sl3_length:this.sl3_length,
            sl3_dia:this.sl3_dia,
            no_of_sr:this.no_of_sr,
            sr_grade:this.sr_grade,
            sr_dia:this.sr_dia,
            sr_dia_add:this.sr_dia_add,
            sr1_location:this.sr1_location,
            last_location:this.last_location,
            rings_start:this.rings_start,
            rings_end:this.rings_end,
            rings_addn_member:this.rings_addn_member,
            rings_addn_no:this.rings_addn_no,
            no_of_cr_top:this.no_of_cr_top,
            cr_spacing_top:this.cr_spacing_top,
            no_of_cr_end:this.no_of_cr_end,
            cr_spacing_end:this.cr_spacing_end,
            extra_support_bar_ind:this.extra_support_bar_ind,
            extra_support_bar_dia:this.extra_support_bar_dia,
            extra_cr_no:this.extra_cr_no,
            extra_cr_dia:this.extra_cr_dia,
            extra_cr_loc:this.extra_cr_loc,
            coupler_top:this.coupler_top,
            coupler_end:this.coupler_end,
            crank_height_top:this.crank_height_top,
            crank_height_end:this.crank_height_end,
            crank2_height_end:this.crank2_height_end,
            crank2_height_top:this.crank2_height_top,
            mainbar_length_2layer:this.mainbar_length_2layer,
            mainbar_location_2layer:this.mainbar_location_2layer ?? 0,
            bundle_same_type:this.bundle_same_type,
            cr_posn_top:this.cr_posn_top,
            cr_posn_end:this.cr_posn_end,
            cr_top_remarks:this.cr_top_remarks,
            cr_end_remarks:this.cr_end_remarks,
          }
        this.modal.close(obj)


  }
  dismissModal(){
    this.modal.dismiss("User closed modal!");
  }

  setDefaultValues(){
    if(
            this.lBPCRec.spiral_link_type == '2 Spacing' ||
            this.lBPCRec.spiral_link_type == '3 Spacing' ||
            this.lBPCRec.spiral_link_type == 'Twin 2 Spacing' ||
            this.lBPCRec.spiral_link_type == 'Twin 3 Spacing' ||
            this.lBPCRec.spiral_link_type == 'Single-Twin' ||
            this.lBPCRec.spiral_link_type == 'Twin-Single'
      ){
        if(this.lBPCRec.sl1_length){
          this.sl1_length = this.lBPCRec.sl1_length
        }
        if(this.lBPCRec.sl1_dia){
          this.sl1_dia = this.lBPCRec.sl1_dia
        }
        if(this.lBPCRec.sl2_length){
          this.sl2_length = this.lBPCRec.sl2_length
        }
        if(this.lBPCRec.sl2_dia){
          this.sl2_dia = this.lBPCRec.sl2_dia
        }

        if(this.lBPCRec.spiral_link_type == '3 Spacing' || this.lBPCRec.spiral_link_type == 'Twin 3 Spacing'){
          if(this.lBPCRec.sl3_length){
            this.sl3_length = this.lBPCRec.sl3_length
          }
          if(this.lBPCRec.sl3_dia){
            this.sl3_dia = this.lBPCRec.sl3_dia
          }
        }
      }

      if(this.lBPCRec.no_of_sr){
        this.no_of_sr = this.lBPCRec.no_of_sr
      }
      if(this.lBPCRec.sr_grade){
        this.sr_grade = this.lBPCRec.sr_grade
      }

      if(this.lBPCRec.sr_dia){
        this.sr_dia = this.lBPCRec.sr_dia
      }
      if(this.lBPCRec.sr_dia_add){
        this.sr_dia_add = this.lBPCRec.sr_dia_add
      }

      if(this.lBPCRec.sr1_location){
        this.sr1_location = this.lBPCRec.sr1_location
      }
      if(this.lLastSRLocation){
        this.last_location = this.lLastSRLocation
      }

      if(this.lBPCRec.rings_start){
        this.rings_start = this.lBPCRec.rings_start
      }
      if(this.lBPCRec.rings_end){
        this.rings_end = this.lBPCRec.rings_end
      }

      this.rings_addn_member = this.lBPCRec.rings_addn_member ? this.lBPCRec.rings_addn_member : 0;

      this.rings_addn_no = this.lBPCRec.rings_addn_no ? this.lBPCRec.rings_addn_no : 0

      if(this.lLapLen < 700){
        if(this.lBPCRec.no_of_cr_top){
          this.no_of_cr_top = this.lBPCRec.no_of_cr_top
        }
        if(this.lBPCRec.cr_spacing_top){
          this.cr_spacing_top = this.lBPCRec.cr_spacing_top
        }
      }
      if(this.lBPCRec.cr_posn_top ){
        this.cr_posn_top  = this.lBPCRec.cr_posn_top
      }
      if(this.lBPCRec.no_of_cr_end){
        this.no_of_cr_end = this.lBPCRec.no_of_cr_end
      }
      if(this.lBPCRec.cr_spacing_end){
        this.cr_spacing_end = this.lBPCRec.cr_spacing_end
      }

      if(this.lBPCRec.extra_support_bar_ind){
        this.extra_support_bar_ind = this.lBPCRec.extra_support_bar_ind
      }else{
        this.extra_support_bar_ind = 'None';
      }
      if(this.lBPCRec.extra_support_bar_dia == null || this.lBPCRec.extra_support_bar_dia == 0){
        this.extra_support_bar_dia = 20;
      }else{
        this.extra_support_bar_dia = this.lBPCRec.extra_support_bar_dia;
      }

      if(this.lBPCRec.cr_end_remarks){
        this.cr_end_remarks = this.lBPCRec.cr_end_remarks
      }
      if(this.lBPCRec.cr_posn_end ){
        this.cr_posn_end  = this.lBPCRec.cr_posn_end
      }
      if(this.lBPCRec.cr_top_remarks ){
        this.cr_top_remarks  = this.lBPCRec.cr_top_remarks
      }

      if(this.lBPCRec.extra_cr_no == null || this.lBPCRec.extra_cr_no == 0){
        this.extra_cr_no = 0;
      }else{
        this.extra_cr_no = this.lBPCRec.extra_cr_no;
      }

      if(this.lBPCRec.extra_cr_dia == null || this.lBPCRec.extra_cr_dia == 0){
        this.extra_cr_dia = 0;
      }else{
        this.extra_cr_dia = this.lBPCRec.extra_cr_dia;
      }

      if(this.lBPCRec.extra_cr_loc == null || this.lBPCRec.extra_cr_loc == 0){
        this.extra_cr_loc = 0;
      }else{
        this.extra_cr_loc = this.lBPCRec.extra_cr_loc;
      }


      if(this.lBPCRec.coupler_top){
        this.coupler_top = this.lBPCRec.coupler_top
      }
      if(this.lBPCRec.coupler_end){
        this.coupler_end = this.lBPCRec.coupler_end
      }

      if(this.lBPCRec.main_bar_shape != 'Straight'){
        this.crank_height_top = this.lBPCRec.crank_height_top ? this.lBPCRec.crank_height_top : 0
        this.crank_height_end = this.lBPCRec.crank_height_end ? this.lBPCRec.crank_height_end : 0
      }

      if(this.lBPCRec.main_bar_type == 'Mixed'){
        if(this.lBPCRec.crank2_height_top){
          this.crank2_height_top = this.lBPCRec.crank2_height_top
        }
        if(this.lBPCRec.crank2_height_end){
          this.crank2_height_end = this.lBPCRec.crank2_height_end
        }
      }

      if(this.lBPCRec.pile_type != 'Single-Layer' || this.lBPCRec.main_bar_arrange != 'Single'){
        if(this.lBPCRec.mainbar_length_2layer){
          this.mainbar_length_2layer = this.lBPCRec.mainbar_length_2layer
        }
        if(this.lBPCRec.mainbar_location_2layer){
          this.mainbar_location_2layer = this.lBPCRec.mainbar_location_2layer
        }else{
          this.mainbar_location_2layer =0;
        }
      }
      if(this.lBPCRec.main_bar_arrange == 'Side-By-Side' || this.lBPCRec.main_bar_arrange == 'In-Out'){
        if(this.lBPCRec.bundle_same_type == 'Y'){
          this.bundle_same_type = 'Y';
        }else{
          this.bundle_same_type = 'N';
        }
      }
  }


}
