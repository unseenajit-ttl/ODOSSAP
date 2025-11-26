import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-update-detailling-incharge',
  templateUrl: './update-detailling-incharge.component.html',
  styleUrls: ['./update-detailling-incharge.component.css'],
})
export class UpdateDetaillingInchargeComponent implements OnInit {
  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() DetailingIncharge: any;

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  DetaillingIncharge: any[] = [];

  DetaillingInchargeList: any[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    this.GetDetailingIncharge();
  }

  // GetDetailingIncharge() {
  //   this.orderService.getDetailingIncharge().subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       this.DetaillingInchargeList = response;
  //     },
  //     error: (e) => { },
  //     complete: () => {
  //     },
  //   });
  // }
  GetDetailingIncharge() {
    this.orderService.getDetailingIncharge().subscribe({
      next: (response) => {
        this.DetaillingInchargeList = response;

        // Ensure selected values exist in the list
        const selectedArray = this.DetailingIncharge
          ? Array.isArray(this.DetailingIncharge)
            ? this.DetailingIncharge
            : [this.DetailingIncharge]
          : [];

        selectedArray.forEach((val) => {
          if (
            !this.DetaillingInchargeList.some(
              (item) => item.DetailingIncharge === val
            )
          ) {
            this.DetaillingInchargeList.push({ DetailingIncharge: val });
          }
        });

        // Now bind model value
        this.DetaillingIncharge = selectedArray;
      },
      error: (e) => {},
      complete: () => {
        this.activeModal.close()
      },
    });
  }
  UpdateIncharge() {
    let obj = {
      CustomerCode: [this.CustomerCode],
      ProjectCode: [this.ProjectCode],
      DetIncharge: this.DetaillingIncharge.join(','),
    };
    this.orderService.UpdateDetInchargeDB(obj).subscribe({
      next: (response) => {
        if (response.Value.success) {
          alert('Detailling In-Charge Updated Successfully');
          this.saveTrigger.emit();
        }
      },
      error: (e) => {},
      complete: () => {
        this.activeModal.close()
      },
    });
  }

  close() {
    this.activeModal.dismiss('Cross click');
  }
}
