import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-update-confirmation',
  templateUrl: './update-confirmation.component.html',
  styleUrls: ['./update-confirmation.component.css']
})
export class UpdateConfirmationComponent implements OnInit {
  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  SelectedValue = {
    ReqDate: false,
    PONO: false,
    VehicleType: false,
    BookIndicator: false,
    BBSNO: false,
    BBSDesc: false,
    IntReamrks: false,
    ExternalRemarks: false,
    InvoiceRemarks: false
  }

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private orderService: OrderService,
    private renderer: Renderer2,
    private el: ElementRef,) { }
  ngOnInit(): void {
    this.dragElement(document.getElementById("mydiv"));
  }
  Update() {
    if (this.SelectedValue.ReqDate == false
      && this.SelectedValue.PONO == false
      && this.SelectedValue.VehicleType == false
      && this.SelectedValue.BookIndicator == false
      && this.SelectedValue.BBSNO == false
      && this.SelectedValue.BBSDesc == false
      && this.SelectedValue.IntReamrks == false
      && this.SelectedValue.ExternalRemarks == false
      && this.SelectedValue.InvoiceRemarks == false) {
        alert("Select atlest one item to Update");
        return;
      }
      this.saveTrigger.emit(this.SelectedValue)
    this.modalService.dismissAll()
  }

  // onMouseDown(event: MouseEvent): void {
  //   this.isDragging = true;
  //   this.initialX = event.clientX + this.right;
  //   this.initialY = event.clientY - this.top;
  //   this.renderer.addClass(this.el.nativeElement, 'grabbing');
  // }

  // onMouseMove(event: MouseEvent): void {
  //   if (this.isDragging) {
  //     this.right = this.initialX - event.clientX;
  //     this.top = event.clientY - this.initialY;
  //   }
  // }

  // onMouseUp(event: MouseEvent): void {
  //   this.isDragging = false;
  //   this.renderer.removeClass(this.el.nativeElement, 'grabbing');
  // }


  dragElement(elmnt: any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header")!.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

