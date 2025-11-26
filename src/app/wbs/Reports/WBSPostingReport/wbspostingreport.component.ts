
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AfterViewInit, Component, HostListener, VERSION,OnInit } from '@angular/core';

@Component({
  selector: 'app-wbspostingreport',
  templateUrl: './wbspostingreport.component.html',
  styleUrls: ['./wbspostingreport.component.css']
})
export class wbspostingreportComponent implements OnInit {
   _canvas !: HTMLCanvasElement ;
   _context!: CanvasRenderingContext2D;
   paint: boolean=false;

  pdfpath: string;

  
  private clickX: number[] = [];
  private clickY: number[] = [];
  private clickDrag: boolean[] = [];

  @HostListener('document:mousedown', ['$event'])
  pressMouseEventHandler(event: MouseEvent) {
    this.pressEventHandler(event);
  }

  @HostListener('document:touchstart', ['$event'])
  pressTouchEventHandler(event: TouchEvent) {
    this.pressEventHandler(event);
  }

  @HostListener('document:mousemove', ['$event'])
  mouseDragEventHandler(event: MouseEvent) {
    this.dragEventHandler(event);
  }

  @HostListener('document:touchmove', ['$event'])
  touchDragEventHandler(event: TouchEvent) {
    this.dragEventHandler(event);
  }

  @HostListener('document:mouseup', ['$event'])
  mouseReleaseEventHandler(event: MouseEvent) {
    this.releaseEventHandler();
  }

  @HostListener('document:touchend', ['$event'])
  touchReleaseEventHandler(event: TouchEvent) {
    this.releaseEventHandler();
  }

  @HostListener('document:mouseout', ['$event'])
  cancelMouseEventHandler() {
    this.cancelEventHandler();
  }

  @HostListener('document:touchcancel', ['$event'])
  cancelTouchEventHandler() {
    this.cancelEventHandler();
  }

  ngAfterViewInit() {
    let _canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let context = _canvas.getContext('2d') as  CanvasRenderingContext2D ;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    this._canvas = _canvas;
    this._context = context;

    
      const ctx = context;
      this.drawLine(ctx, [100, 100], [100, 300], 'green', 5);
  

    this.redraw();

    this.createUserEvents();
  }

  
  constructor( ) {

       //pdf location
   this.pdfpath = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf'
     }

  ngOnInit(): void {
  }

  
  clear()
  {
    let _canvas = this._canvas;
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
  }
  private createUserEvents() {
    let _canvas = this._canvas;

    // document
    //   .getElementById('clear')
    //   .addEventListener('click', this.clearEventHandler);
  }

  private redraw() {
    let clickX = this.clickX;
    let context = this._context;
    let clickDrag = this.clickDrag;
    let clickY = this.clickY;
    for (let i = 0; i < clickX.length; ++i) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
      }

      context.lineTo(clickX[i], clickY[i]);
      context.stroke();
    }
    context.closePath();
  }

  private addClick(x: number, y: number, dragging: boolean) {
    this.clickX.push(x);
    this.clickY.push(y);
    this.clickDrag.push(dragging);
  }

  private clearCanvas() {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
  }

  private clearEventHandler = () => {
    this.clearCanvas();
  };

  private releaseEventHandler = () => {
    this.paint = false;
    this.redraw();
  };

  private cancelEventHandler = () => {
    this.paint = false;
  };

  private pressEventHandler(e: MouseEvent | TouchEvent) {
    let mouseX = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageX
      : (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageY
      : (e as MouseEvent).pageY;
    mouseX -= this._canvas.offsetLeft;
    mouseY -= this._canvas.offsetTop;

    this.paint = true;
    this.addClick(mouseX, mouseY, false);
    this.redraw();
  }

  private dragEventHandler(e: MouseEvent | TouchEvent) {
    let mouseX = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageX
      : (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageY
      : (e as MouseEvent).pageY;
    mouseX -= this._canvas.offsetLeft;
    mouseY -= this._canvas.offsetTop;

    if (this.paint) {
      this.addClick(mouseX, mouseY, true);
      this.redraw();
    }

    e.preventDefault();
  }

  private drawLine(ctx:any, begin:any, end:any, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(20, 100);
    ctx.lineTo(70, 100);
    ctx.stroke();
}


drawRectable() {
  let _canvas = document.getElementById('canvas') as HTMLCanvasElement;
  let context = _canvas.getContext('2d') as  CanvasRenderingContext2D ;

 
  if (_canvas.getContext) {
    //let ctx = _canvas.getContext('2d');
    let ctx = _canvas.getContext('2d') as  CanvasRenderingContext2D ;

    //ctx.fillStyle = "#D74022";
    //ctx.fillRect(25, 25, 150, 150);

    //ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.clearRect(60, 60, 120, 120);
    ctx.strokeRect(90, 90, 80, 80);
  }

}

//Save image  
// save() {
//     this.img = this.sigPadElement.toDataURL("image/png");
//     console.log(this.img);
//   }

}
