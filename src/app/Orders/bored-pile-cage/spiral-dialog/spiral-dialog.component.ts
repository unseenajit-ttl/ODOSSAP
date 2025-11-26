import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-spiral-dialog',
  templateUrl: './spiral-dialog.component.html',
  styleUrls: ['./spiral-dialog.component.css']
})
export class SpiralDialogComponent {
  @Input() customerCode:any;
  @Input() projectCode:any;
  @Input() isWrapping:boolean= false;

  spiralLinkWrapping=false;;
  constructor(public activeModal: NgbActiveModal,private orderService:OrderService) {

  }

  ngOnInit(){
    this.spiralLinkWrapping = this.isWrapping;
  }

  save(){
    let obj = {
                CustomerCode: this.customerCode,
                ProjectCode: this.projectCode,
                SLLapping: this.spiralLinkWrapping
              }
    this.orderService.SaveBPCConfig_bpc(obj).subscribe((response:any)=>{
      if (response) {
          alert("Change has been saved successfully.");
      } else {
          alert("Error on data saving: " + response.responseText);
      }
    });
    this.activeModal.dismiss('Modal closed');
  }
}
