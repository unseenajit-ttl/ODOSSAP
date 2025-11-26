import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-bbs-number-list',
  templateUrl: './bbs-number-list.component.html',
  styleUrls: ['./bbs-number-list.component.css'],
})
export class BbsNumberListComponent implements OnInit {
  UsedBBSList: any[] = [];

  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() JobID: any;

  ListLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.GetUsedBBSList(this.CustomerCode, this.ProjectCode, this.JobID);
  }

  GetUsedBBSList(CustomerCode: any, ProjectCode: any, JobID: any) {
    this.ListLoading = true;
    this.orderService
      .usedBBSNoList(CustomerCode, ProjectCode, JobID)
      .subscribe({
        next: (response) => {
          console.log('UsedBBSList', response);
          this.UsedBBSList = response;
          this.ListLoading = false;

        },
        error: (e) => { },
        complete: () => { },
      });
  }
}
