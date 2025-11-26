import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-check-gm-name',
  templateUrl: './check-gm-name.component.html',
  styleUrls: ['./check-gm-name.component.css']
})
export class CheckGmNameComponent {
  @Input() GmName:any;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, )
  {

  }

  submit(value:any)
  {
    this.activeModal.close(value)

  }
}
