import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancel-cab-orders',
  templateUrl: './cancel-cab-orders.component.html',
  styleUrls: ['./cancel-cab-orders.component.css']
})
export class CancelCabOrdersComponent {
  @Input() cabOrders!: any[];

  @Input() TotalBBS: any;
  @Input() BBSSOR: any;
  @Input() CouplerSOR: any;
  @Input() STDBarSO: any;

  cBBSSOR: boolean = false;
  cCouplerSOR: boolean = false;
  cSTDBarSO: boolean = false;

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();


  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,) { }

  applyData() {
    // this.modal.close(this.cabOrders);


    var lBBSSOR = this.BBSSOR
    if (this.cBBSSOR != true) {
      lBBSSOR = "";
    }
    var lCouplerSOR = this.CouplerSOR
    if (this.cCouplerSOR != true) {
      lCouplerSOR = "";
    }
    var lSTDBarSO = this.STDBarSO;
    if (this.cSTDBarSO != true) {
      lSTDBarSO = "";
    }

    let obj = {
      lBBSSOR: lBBSSOR,
      lCouplerSOR: lCouplerSOR,
      lSTDBarSO: lSTDBarSO,
      cBBSSOR: this.cBBSSOR,
      cCouplerSOR: this.cCouplerSOR,
      cSTDBarSO: this.cSTDBarSO,
      TotalBBS: this.TotalBBS
    }
    this.saveTrigger.emit(obj);
    this.modalService.dismissAll();
   
  }
  dismissModal() {
    this.modal.dismiss("User closed modal!");
  }
}
