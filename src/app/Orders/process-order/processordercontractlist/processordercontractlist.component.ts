import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-processordercontractlist',
  templateUrl: './processordercontractlist.component.html',
  styleUrls: ['./processordercontractlist.component.css']
})
export class ProcessordercontractlistComponent implements OnInit {
  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;

  @Input() CustomerCode:any;
  @Input() ProjectCode:any;
  @Input() ProdType:any;
  
  AllContractNoList: any[] = []

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private renderer: Renderer2,
    private el: ElementRef,) { }

  ngOnInit(): void {
   // this.dragElement(document.getElementById("mydiv"));
   this.GetAllContractNos(this.ProjectCode)
  }

  parseDateString(str: string): Date | null {
    if (!str) return null;
    
    const [datePart, timePart, modifier] = str.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    let hour = hours;
    if (modifier.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (modifier.toLowerCase() === 'am' && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minutes, seconds || 0);
  }

  GetAllContractNos(ProjectCode: string): void {
    debugger;
    this.orderService.getAllContractNos(ProjectCode).subscribe({
      next: (response) => {
        console.log('contract', response);
         this.AllContractNoList = response;
        // this.AllContractNoList = response.map(item => {
        //   return {
        //     ...item,
        //     // CON_START_DATE: this.parseDateString(item.CON_START_DATE),
        //     // CON_END_DATE:this.parseDateString(item.CON_END_DATE)
        //   };
        // });

        //this.ProcessOrderLoading = false;
      },
      error: (e) => { },
      complete: () => { },
    });
  }

  dragElement(elmnt:any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header")!.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e:any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e:any) {
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
