import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-update-technical-remarks',
  templateUrl: './update-technical-remarks.component.html',
  styleUrls: ['./update-technical-remarks.component.css'],
})
export class UpdateTechnicalRemarksComponent implements OnInit {
  @Input() OrderNumber: any;
  @Input() StructureElement: any;
  @Input() ProductType: any;
  @Input() ScheduledProd: any;
  @Input() SORNo: any;

  @Input() SelectedRows: any;

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  Techremarks: string = '';
  ExsistingRemarks: string = '';
  TechRemarks:string='';

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {

    debugger
    this.TechRemarks = this.SelectedRows.length>=1 ? this.SelectedRows[0].TECHRemarks : '';
    console.log("SelectedRows",this.SelectedRows)
    console.log("TechRemarks",this.TechRemarks)
    this.GetTECHRemarks();
  }
  GetTECHRemarks() {
    let ordernumber = [];
    let StructureElement = [];
    let ProductType = [];
    let ScheduledProd = [];
    let SORNo = [];

    for (let i = 0; i < this.SelectedRows.length; i++) {
      let lItem = this.SelectedRows[i];
      ordernumber.push(Number(lItem.JobID));
      StructureElement.push(lItem.StructureElement);
      ProductType.push(lItem.ProdType);
      ScheduledProd.push(lItem.ScheduledProd);
      SORNo.push(lItem.SORNo);
    }

    let obj = {
      OrderNumber: ordernumber,
      StructureElement: StructureElement,
      ProductType: ProductType,
      ScheduledProd: ScheduledProd,
      SORNo: SORNo,
    };
    // let obj = {
    //   OrderNumber: [
    //     Number(this.OrderNumber)
    //   ],
    //   StructureElement: [
    //     this.StructureElement
    //   ],
    //   ProductType: [
    //     this.ProductType
    //   ],
    //   ScheduledProd: [
    //     this.ScheduledProd
    //   ],
    //   SORNo: [
    //     this.SORNo
    //   ]
    // }
    this.orderService.GetTECHRemarksDB(obj).subscribe({
      next: (response: any) => {
        let temp = response;
        this.ExsistingRemarks = response.Value.message;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  UpdateTechRemarks() {
    let ordernumber = [];
    let StructureElement = [];
    let ProductType = [];
    let ScheduledProd = [];
    let SORNo = [];

    for (let i = 0; i < this.SelectedRows.length; i++) {
      let lItem = this.SelectedRows[i];
      ordernumber.push(Number(lItem.JobID));
      StructureElement.push(lItem.StructureElement);
      ProductType.push(lItem.ProdType);
      ScheduledProd.push(lItem.ScheduledProd);
      SORNo.push(lItem.SORNo);
    }
    console.log('UpdateTechRemarks',this.TechRemarks);
    let obj = {
      OrderNumber: ordernumber,
      StructureElement: StructureElement,
      ProductType: ProductType,
      ScheduledProd: ScheduledProd,
      SORNo: SORNo,
      TECHRemarks: this.TechRemarks,
    };
    // let obj = {
    //   OrderNumber: [Number(this.OrderNumber)],
    //   StructureElement: [this.StructureElement],
    //   ProductType: [this.ProductType],
    //   ScheduledProd: [this.ScheduledProd],
    //   SORNo: [this.SORNo],
    //   TECHRemarks: this.TechRemarks
    // }
    this.orderService.UpdateTECHRemarksDB(obj).subscribe({
      next: (response: any) => {
        if (response.Value.success) {
          alert('Tech Remark Updated Successfully');
          this.saveTrigger.emit();
        }
      },
      error: (e) => {},
      complete: () => {
        this.activeModal.close();
        this.saveTrigger.emit();
      },
    });
  }

  close() {
    this.activeModal.dismiss('Cross click');
  }
}
