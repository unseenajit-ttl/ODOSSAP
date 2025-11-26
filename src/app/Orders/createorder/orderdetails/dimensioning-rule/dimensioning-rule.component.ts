import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dimensioning-rule',
  templateUrl: './dimensioning-rule.component.html',
  styleUrls: ['./dimensioning-rule.component.css'],
})
export class DimensioningRuleComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}
  Cancel() {
    this.modalService.dismissAll();
  }
}
