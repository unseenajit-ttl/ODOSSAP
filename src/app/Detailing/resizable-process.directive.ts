// import { Directive, ElementRef, HostListener, Inject, Output, Renderer2,Input } from "@angular/core";

// @Directive({
//   selector: "[resizableCol]"
// })
// export class ResizableProcessDirective {
//   @Input() columns:any;
//   private startX!: number;
//   private isResizing = false;
//   private initialWidth!: number;
//   private columnIndex!: number;
//   private table: HTMLElement | null = null; // Initialize table as null

//   constructor(private el: ElementRef, private renderer: Renderer2) {}

//   @HostListener('mousedown', ['$event'])
//   onMouseDown(event: MouseEvent) {
//     event.preventDefault();
//     this.startX = event.pageX;
//     this.isResizing = true;
//     this.initialWidth = this.el.nativeElement.offsetWidth;

//     // Find the index of the current column
//     const row = this.el.nativeElement.parentElement.closest('tr');
//     const cells = Array.from(row.children);
//     this.columnIndex = cells.indexOf(this.el.nativeElement.closest('th'));
//     this.renderer.addClass(this.el.nativeElement.closest('th'), 'resizing');
//     this.renderer.addClass(document.body, 'resizing');
//     this.table = this.findParentTable(this.el.nativeElement);

//     if (this.table) {
//       const columns = this.table.querySelectorAll('th.resize-column')as NodeListOf<HTMLElement>;

//       const onMouseMove = (moveEvent: MouseEvent) => {
//         if (this.isResizing) {
//           const deltaX = moveEvent.pageX - this.startX;
//           const newWidth = this.initialWidth + deltaX;
//           this.renderer.setStyle(this.el.nativeElement.closest('th'), 'width', newWidth + 'px');
//           columns[this.columnIndex].style.width = newWidth + 'px';
//           const rows = this.table?.querySelectorAll('tr');
//           rows?.forEach((row) => {
//             const cells = row.querySelectorAll('td');
//             if (cells[this.columnIndex]) {
//               console.log("this.columnIndex=>",this.columnIndex,cells[this.columnIndex],cells);
//               cells[this.columnIndex].style.width = newWidth + 'px';
//             }
//           });

//           // Adjust the width of the table if it has a fixed width
//           const tableWidth:any = this.table?.offsetWidth;
//           if (tableWidth > 0) {
//             this.renderer.setStyle(this.table, 'width', tableWidth + deltaX + 'px');
//           }
//         }
//       };

//       const onMouseUp = () => {
//         this.isResizing = false;
//         this.renderer.removeClass(this.el.nativeElement.closest('th'), 'resizing');
//         this.renderer.removeClass(document.body, 'resizing');
//         document.removeEventListener('mousemove', onMouseMove);
//         document.removeEventListener('mouseup', onMouseUp);
//       };

//       document.addEventListener('mousemove', onMouseMove);
//       document.addEventListener('mouseup', onMouseUp);
//     }
//   }

//   private findParentTable(element: HTMLElement): HTMLElement | null {
//     while (element) {
//       if (element.tagName === 'TABLE') {
//         return element;
//       }
//       if (element?.parentElement) element = element.parentElement;
//     }
//     return null;
//   }
// }

import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appColumnResize]'
})
export class ColumnResizeDirective {
  @Input() colName: string = '';
  @Input() colIndex:number = 0;


  @Output() widthChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() resizeStop: EventEmitter<any> = new EventEmitter();
  private startX: number = 0;
  private startWidth: number = 0;
  private totalWidth:number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.startX = event.pageX;
    this.startWidth = this.el.nativeElement.closest('th').offsetWidth;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    let width = this.startWidth + (event.pageX - this.startX);
    this.totalWidth = width;
    if(width<=0){
      width=10;
    }
    this.renderer.setStyle(this.el.nativeElement.closest('th'), 'width', width + 'px');
    let obj = {
      width:width,
      colName:this.colName,
      index:this.colIndex
    }
    this.widthChangeEvent.emit(obj);

    this.renderer.setStyle(this.el.nativeElement.closest('th'), 'width', width + 'px');
  }

  onMouseUp = () => {

    this.startX = 0;
    this.el.nativeElement.style.transform = '';
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.resizeStop.emit(false);
  }
}
