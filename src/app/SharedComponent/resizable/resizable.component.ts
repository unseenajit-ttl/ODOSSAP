import { Component,HostBinding } from '@angular/core';

@Component({
  selector: 'th[resizable]',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.css']
})
export class ResizableComponent {
  @HostBinding("style.width.px")
  width!: any;

  onResize(width: any) {
    debugger
    this.width = width;
  }
}
