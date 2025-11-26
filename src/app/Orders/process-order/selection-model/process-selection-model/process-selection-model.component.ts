import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-process-selection-model',
  templateUrl: './process-selection-model.component.html',
  styleUrls: ['./process-selection-model.component.css']
})
export class ProcessSelectionModelComponent implements OnInit {
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  @Input() currentSelection: any;

  selectedValue: any;

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    if (this.currentSelection) {
      this.selectedValue = '2';
    } else {
      this.selectedValue = '1';
    }
  }

  Update() {
    if (this.selectedValue === '2') {
      localStorage.setItem("CellSelectionMode", 'true');
      this.saveTrigger.emit(true);
    } else if (this.selectedValue === '1') {
      localStorage.setItem("CellSelectionMode", 'false');
      this.saveTrigger.emit(false);
    }
    this.activeModal.dismiss('Cross click')
  }
  Close() {
    this.saveTrigger.emit(false);
    this.activeModal.dismiss('Cross click')
  }
}
