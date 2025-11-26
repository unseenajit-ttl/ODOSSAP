import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transport-alert-message',
  templateUrl: './transport-alert-message.component.html',
  styleUrls: ['./transport-alert-message.component.css'],
})
export class TransportAlertMessageComponent {
  @Input() pOrder: any = '';
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}
  Cancel() {
    this.saveTrigger.emit(true);
    this.modalService.dismissAll();
  }
}
