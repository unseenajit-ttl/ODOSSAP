import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-updating-bbs',
  templateUrl: './updating-bbs.component.html',
  styleUrls: ['./updating-bbs.component.css']
})
export class UpdatingBbsComponent implements OnInit {
  @Input() ResponseMessage: any
  
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {

  }

  Cancel() {
    this.modalService.dismissAll()
  }
}
