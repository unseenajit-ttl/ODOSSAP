import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-confirm-excess-mail',
  templateUrl: './confirm-excess-mail.component.html',
  styleUrls: ['./confirm-excess-mail.component.css'],
})
export class ConfirmExcessMailComponent implements OnInit {
  @Input() pExecess: string = 'test';
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private modalService: NgbModal,
    
  ) {}
  ngOnInit(): void {}

  dismissModal(userChoice: boolean) {
    this.saveTrigger.emit(userChoice);
    this.modalService.dismissAll()
  }
}
