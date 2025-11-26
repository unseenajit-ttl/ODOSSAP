import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-update-project-management',
  templateUrl: './update-project-management.component.html',
  styleUrls: ['./update-project-management.component.css']
})
export class UpdateProjectManagementComponent implements OnInit {
  // @Input() OrderNumber: any;
  // @Input() StructureElement: any;
  // @Input() ProductType: any;
  // @Input() ScheduledProd: any;
  // @Input() SORNo: any;

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  @Input() SelectedRows: any;




  Remarks: any = "";

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService) { }
  ngOnInit(): void {
    debugger;
    console.log("SelectedRows.PMDRemarks",this.SelectedRows.PMDRemarks)
    this.Remarks = this.SelectedRows.length>=1 ? this.SelectedRows[0].PMDRemarks : '';
    throw new Error('Method not implemented.');
  }

 async UpdatePMRemarks() {
  let ordernumber=[];
  let StructureElement=[];
  let ProductType=[];
  let ScheduledProd=[];
  let SORNo=[];


  for(let i=0;i<this.SelectedRows.length;i++){
   let lItem=this.SelectedRows[i];
    ordernumber.push(Number(lItem.JobID))
    StructureElement.push(lItem.StructureElement)
    ProductType.push(lItem.ProdType)
    ScheduledProd.push(lItem.ScheduledProd)
    SORNo.push(lItem.SORNo)
  }

  let obj = {
      OrderNumber: ordernumber,
      StructureElement: StructureElement,
      ProductType: ProductType,
      ScheduledProd: ScheduledProd,
      SORNo: SORNo,
      PMRemarks: this.Remarks
    }

    this.orderService.UpdatePMRemarksDB(obj).subscribe({
      next: (response: any) => {
        if (response.Value.success) {
          // alert('PM Remark Updated Successfully')
          // this.saveTrigger.emit();
          document.body.classList.add('dim-background');
          setTimeout(() => {
            alert('PM Remark Updated Successfully');
            document.body.classList.remove('dim-background');
          }, 0);
        }
      },
      error: (e) => { },
      complete: () => {
        this.activeModal.close();
        this.saveTrigger.emit();
       },
    });


  }

  close() {
    this.activeModal.dismiss('Cross click')
  }
}
