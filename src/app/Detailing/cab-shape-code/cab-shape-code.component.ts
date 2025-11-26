import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { Group } from 'fabric/fabric-impl';
import { CabShapeServiceService } from 'src/app/DrawShape/Service/cab-shape-service.service';
import { addCabShapeDims } from 'src/app/Model/addCabShapeDims';
import { cabShapeInsert } from 'src/app/Model/cabShapeInsert';

@Component({
  selector: 'app-cab-shape-code',
  templateUrl: './cab-shape-code.component.html',
  styleUrls: ['./cab-shape-code.component.css'],
})
export class CabShapeCodeComponent {
  canvas: any;
  ShapeDetails: any[] = [];
  shapeId: string = '037';
  degsymbole = '\xB0';
  Angleclick = 0;
  lineclick = 0;
  hlineclick = 0;
  Arcclick = 0;
  txtclick = 0;
  Alphabet_count: number = 0;
  alphabet: any[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  selectedShapecode='020';
  cabShapeInsert: cabShapeInsert[] = [];

  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  lengthTable: { length: number; angle: number }[] = [];
  previousEndpoint: { x: number; y: number } = { x: 200, y: 200 }; // Initial starting point

  prevAngle: boolean = false;
  shapeData: addCabShapeDims[] = [];
  shapeData_temp: addCabShapeDims[] = [];
  AngleFactor: any = -1;
  AngleBack = 0;
  AngleTotal = 0;
  enableEditIndex: any = -1;
  

  toLabel: boolean = false;
  rotation: any = [
    {
      rotate: 'Clockwise',
      value: 1,
    },
    {
      rotate: 'Anti-Clockwise',
      value: -1,
    },
  ];
  shapeList: any;


  // search = (text$: Observable<string>) =>
  //   text$
  //     .debounceTime(200)
  //     .distinctUntilChanged()
  //     .map(term => term.length < 2 ? []
  //       : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  constructor(
    public router: Router,
    private cabShapeService: CabShapeServiceService,
  ) {}

  ngOnInit() {
    this.getCabShapelist();
    this.selectedShapecode = this.cabShapeService.getShapecode();
    debugger;
    this.loadCabShape(this.selectedShapecode);  

  }
  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('fabricCanvas', {
      width: 900,
      height: 500,
    });
  }

  createGroupAngle() {
    console.log('createGroupAngle');
    this.Angleclick += 1;
    var line: any = new fabric.Line([100, 100, 200, 100], {
      id:1,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
      selectable: true,
    });
    var line2 = new fabric.Line([100, 200, 100, 100], {
      id:1,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
      selectable: false,
      //angle:90
    });

    var angle: any = new fabric.IText('90' + this.degsymbole, {
      id:1,
      left: 105,
      top: 100,
      fontSize: 15,
      selectable: true,
      cornerColor: 'green',
      cornerSize: 2,
      transparentCorners: false,
      hasControls: false,
    });

    var linetxt: any = new fabric.IText('100', {
      id:1,
      left: 150,
      top: 100,
      fontSize: 15,
      fill: 'red',
      selectable: true,
      cornerColor: 'green',
      cornerSize: 2,
      transparentCorners: false,
      hasControls: false,
    });

    var linetxt2: any = new fabric.IText('100', {
      id:1,
      left: 100,
      top: 150,
      fontSize: 15,
      fill: 'red',
      selectable: true,
      cornerColor: 'green',
      cornerSize: 2,
      transparentCorners: false,
      hasControls: false,
      angle: 90,
    });

    let group: Group = new fabric.Group(
      [line, linetxt, angle, line2, linetxt2],
      {
        subTargetCheck: true,
        hasControls: false,
      }
    );

    group.on('mousedblclick', (e: any) => {
      if (e.subTargets[0].id.search('anglelinetxt1') >= 0) {
        let textForEditing = new fabric.IText(linetxt.text, {
          id:1,
          textAlign: linetxt.textAlign,
          fontSize: linetxt.fontSize,
          left: e.pointer.x, //group.left + (group.width / 2),
          top: e.pointer.y, //group.top,
        });
        linetxt.visible = false;
        group.addWithUpdate();
        textForEditing.visible = true;
        textForEditing.hasControls = false;
        this.canvas.add(textForEditing);
        this.canvas.setActiveObject(textForEditing);
        textForEditing.enterEditing();
        textForEditing.selectAll();

        textForEditing.on('editing:exited', () => {
          let newVal = textForEditing.text;
          let oldVal = linetxt.text;
          if (newVal !== oldVal) {
            linetxt.set({
              text: newVal,
              visible: true,
            });
            line.scaleToWidth(Number(newVal));
            line.set('strokeUniform', true);
            group.addWithUpdate();
            textForEditing.visible = false;
            this.canvas.remove(textForEditing);
            this.canvas.setActiveObject(group);
          }
        });
        return;
      }

      if (e.subTargets[0].id.search('anglelinetxt2') >= 0) {
        let textForEditing = new fabric.IText(linetxt2.text, {
          id:1,
          textAlign: linetxt2.textAlign,
          fontSize: linetxt2.fontSize,
          left: e.pointer.x,
          top: e.pointer.y,
        });
        linetxt2.visible = false;
        group.addWithUpdate();
        textForEditing.visible = true;
        textForEditing.hasControls = false;
        this.canvas.add(textForEditing);
        this.canvas.setActiveObject(textForEditing);
        textForEditing.enterEditing();
        textForEditing.selectAll();

        textForEditing.on('editing:exited', () => {
          let newVal = textForEditing.text;
          let oldVal = linetxt2.text;
          if (newVal !== oldVal) {
            linetxt2.set({
              text: newVal,
              visible: true,
            });
            //console.log(line2.aCoords)
            line2.scaleToHeight(Number(newVal));
            line2.set('strokeUniform', true);
            group.addWithUpdate();
            textForEditing.visible = false;
            this.canvas.remove(textForEditing);
            this.canvas.setActiveObject(group);
            // console.log(line2.aCoords)
          }
        });
        return;
      }

      if (e.subTargets[0].id.search('angle') >= 0) {
        let textForEditing = new fabric.IText(angle.text, {
          id:1,
          textAlign: angle.textAlign,
          fontSize: angle.fontSize,
          left: e.pointer.x, // group.left,
          top: e.pointer.y, // group.top,
        });
        angle.visible = false;
        group.addWithUpdate();
        textForEditing.visible = true;
        textForEditing.hasControls = false;
        this.canvas.add(textForEditing);
        this.canvas.setActiveObject(textForEditing);
        textForEditing.enterEditing();
        textForEditing.selectAll();

        textForEditing.on('editing:exited', (e) => {
          let newVal = Number(textForEditing.text) - 90;
          let oldVal = Number(angle.text);
          let newvalues;
          if (newVal !== oldVal) {
            angle.set({
              text: textForEditing.text + this.degsymbole,
              visible: true,
            });
            line2.set({
              angle: Number(newVal),
            });
            linetxt2.set({
              left: line2.left,
              top: line2.top,
              angle: Number(textForEditing.text),
            });
            group.addWithUpdate();
            textForEditing.visible = false;
            this.canvas.remove(textForEditing);
            this.canvas.setActiveObject(group);
          }
        });
        return;
      }
    });

    this.canvas.add(group);
  }

  drawSegment_Fabric(
    startPoint: { x: number; y: number },
    length: number,
    angle: number,
    AngleToSet: number,
    text_X: number,
    text_y: number
  ): void {
    debugger;
    this.lineclick += 1;
    length /= 10;
    const endX = startPoint.x + length * Math.cos((angle * Math.PI) / 180);
    const endY = startPoint.y + length * Math.sin((angle * Math.PI) / 180);
    var line: any = new fabric.Line([startPoint.x, startPoint.y, endX, endY], {
      id: this.shapeData[this.shapeData.length - 1].toString(),
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
      selectable: false,
    });

    let label;
    if (!this.toLabel) {
      if (length == 0.1) {
        label = AngleToSet.toString() + this.degsymbole;
      } else {
        label = (length * 10).toString();
      }
    } else {
      if (this.shapeData[this.shapeData.length - 1].Visible === 'visible')
        label = this.alphabet[this.Alphabet_count - 1].toString();
      else {
        label = '';
      }
    }

    let X_Cord: number = (startPoint.x + endX) / 2;
    let Y_Cord: number = (startPoint.y + endY) / 2;
    // if (text_X) {
    //   X_Cord = text_X;
    // }
    // if (text_y) {
    //   Y_Cord = text_y;
    // }

    var linetxt: any = new fabric.IText(label, {
      id: 'linetxt_' + (this.shapeData.length - 1).toString(),
      // left: (startPoint.x + endX) / 2,
      // top: (startPoint.y + endY) / 2,
      left: X_Cord,
      top: Y_Cord,
      fontSize: 15,
      fill: 'red',
      selectable: true,
      cornerColor: 'green',
      cornerSize: 2,
      transparentCorners: false,
      hasControls: true,
    });

    let group = new fabric.Group([linetxt], {
      subTargetCheck: true,
      hasControls: false,
    });
    this.canvas.add(line);

    if (!this.toLabel) {
      group.on('mousedblclick', (e: any) => {
        if (e.subTargets[0].id.search('linetxt') >= 0) {
          let boundingRect = linetxt.getBoundingRect();
          let labelCoordinates = {
            left: boundingRect.left,
            top: boundingRect.top,
            width: boundingRect.width,
            height: boundingRect.height,
          };

          console.log('Label Coordinates:', labelCoordinates);
          let textForEditing = new fabric.IText(linetxt.text, {
            id:1,
            textAlign: linetxt.textAlign,
            fontSize: linetxt.fontSize,
            left: e.pointer.x, //group.left + (group.width / 2),
            top: e.pointer.y, //group.top,
          });
          debugger;
          linetxt.visible = false;
          group.addWithUpdate();
          textForEditing.visible = true;
          textForEditing.hasControls = false;
          this.canvas.add(textForEditing);
          this.canvas.setActiveObject(textForEditing);
          textForEditing.enterEditing();
          textForEditing.selectAll();

          textForEditing.on('editing:exited', () => {
            let newVal = textForEditing.text;
            let oldVal = linetxt.text;
            const parts: string[] = linetxt.id.split('_');
            let index = Number(parts[1]);

            if (this.shapeData[index].isAngle == true) {
              this.shapeData[index].Angle = Number(newVal);
            } else {
              this.shapeData[index].Length = Number(newVal);
            }
            let newPosition = {
              left: e.pointer?.x || 0,
              top: e.pointer?.y || 0,
            };
            this.shapeData[index].X_cord = newPosition.left;
            this.shapeData[index].y_cord = newPosition.top;
            this.changeData();
          });

          // Add event listener for dragging

          return;
        }
      });

      group.on('moving', (e: fabric.IEvent) => {
        // if (e.subTargets[0].id.search("linetxt") >= 0) {

        // }
        let movingObject = e.pointer?.x;
        // console.log("Label Coordinates:", labelCoordinates);

        const parts: string[] = linetxt.id.split('_');
        let index = Number(parts[1]);

        //  if(this.shapeData[index].isAngle==true)
        //  {
        //    this.shapeData[index].Angle =  Number(newVal);

        //  }
        //  else{
        //    this.shapeData[index].Length =  Number(newVal);
        //  }
        let newPosition = {
          left: e.pointer?.x || 0,
          top: e.pointer?.y || 0,
        };

        this.shapeData[index].X_cord = newPosition.left;
        this.shapeData[index].y_cord = newPosition.top;

        console.log('Group is being moved to:', newPosition);
      });
    }
    this.canvas.add(group);
    this.previousEndpoint = { x: endX, y: endY };
  }

  createGroupHLine() {
    this.hlineclick += 1;
    var hline: any = new fabric.Line([200, 300, 100, 100], {
      id: 'hline_' + this.hlineclick,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
      selectable: false,
      hasControls: false,
      
    });

    var hlinetxt: any = new fabric.IText('100', {
      id: 'hlinetxt_' + this.hlineclick,
      left: 102,
      top: 100,
      fontSize: 15,
      fill: 'red',
      selectable: false,
      cornerColor: 'green',
      cornerSize: 2,
      transparentCorners: false,
      hasControls: false,
    });

    let group = new fabric.Group([hline, hlinetxt], {
      subTargetCheck: true,
      hasControls: false,
    });

    group.on('mousedblclick', (e: any) => {
      if (e.subTargets[0].id.search('hlinetxt') >= 0) {
        let textForEditing = new fabric.IText(hlinetxt.text, {
          id:1,
          textAlign: hlinetxt.textAlign,
          fontSize: hlinetxt.fontSize,
          left: e.pointer.x, //group.left + (group.width / 2),
          top: e.pointer.y, //group.top,
        });
        hlinetxt.visible = false;
        group.addWithUpdate();
        textForEditing.visible = true;
        textForEditing.hasControls = false;
        this.canvas.add(textForEditing);
        this.canvas.setActiveObject(textForEditing);
        textForEditing.enterEditing();
        textForEditing.selectAll();

        textForEditing.on('editing:exited', () => {
          let newVal = textForEditing.text;
          let oldVal = hlinetxt.text;
          if (newVal !== oldVal) {
            hlinetxt.set({
              text: newVal,
              visible: true,
            });
            hline.scaleToHeight(Number(newVal));
            hline.set('strokeUniform', true);
            group.addWithUpdate();
            textForEditing.visible = false;
            this.canvas.remove(textForEditing);
            this.canvas.setActiveObject(group);
          }
        });
        return;
      }
    });

    this.canvas.add(group);
  }

  createGroupAre() {
    this.Arcclick += 1;
    var circle: any = new fabric.Circle({
      id: 'arc_' + this.Arcclick,
      left: 200,
      top: 0,
      radius: 50,
      fill: '',
      stroke: 'black',
      strokeWidth: 2,
      //angle: 45,
      startAngle: 0,
      endAngle: 180,
    });

    // var linetxt:any = new fabric.IText("50", {
    //     id: 'arclinetxt_' + this.Arcclick,
    //     left: 160,
    //     top: 140,
    //     fontSize: 15,
    //     fill: "red",
    //     selectable: true,
    //     cornerColor: 'green',
    //     cornerSize: 2,
    //     transparentCorners: false,
    //     hasControls: false
    // });

    // let group = new fabric.Group([circle, linetxt], {
    //     subTargetCheck: true,
    //     hasControls: true
    // });
    this.canvas.add(circle);

    // group.on('mousedblclick', (e:any) => {
    //     if (e.subTargets[0].id.search("arclinetxt") >= 0) {
    //         let textForEditing = new fabric.IText(linetxt.text, {
    //             textAlign: linetxt.textAlign,
    //             fontSize: linetxt.fontSize,
    //             left: e.pointer.x, //group.left + (group.width / 2),
    //             top: e.pointer.y //group.top,
    //         })
    //         linetxt.visible = false;
    //         group.addWithUpdate();
    //         textForEditing.visible = true;
    //         textForEditing.hasControls = false;
    //         this.canvas.add(textForEditing);
    //         this.canvas.setActiveObject(textForEditing);
    //         textForEditing.enterEditing();
    //         textForEditing.selectAll();

    //         textForEditing.on('editing:exited', () => {
    //             let newVal = textForEditing.text;
    //             let oldVal = linetxt.text;
    //             if (newVal !== oldVal) {
    //                 circle.set({
    //                     radius: Number(newVal)
    //                 })
    //                 //console.log(circle);
    //                 linetxt.set({
    //                     text: newVal,
    //                     visible: true,
    //                     // top:  circle.oCoords.mb.y - circle.oCoords.mb.x , //- circle.oCoords.mt.y, //+ (group.width / 2),
    //                     // left: circle.oCoords.mt.y - circle.oCoords.mb.y,//- circle.oCoords.mb.y,
    //                 })

    //                 group.addWithUpdate();
    //                 textForEditing.visible = false;
    //                 this.canvas.remove(textForEditing);
    //                 this.canvas.setActiveObject(group);
    //             }
    //         })
    //         return;
    //     }
    // })

    // this.canvas.add(group);
  }

  createGroupText() {
    this.txtclick += 1;

    var txt = new fabric.IText('100', {
      id: 'txt_' + this.txtclick,
      left: 100,
      top: 100,
      fontSize: 15,
      fill: 'red',
      selectable: true,
      cornerColor: 'green',
      cornerSize: 2,
      transparentCorners: false,
      hasControls: false,
    });

    this.canvas.add(txt);
  }

  DeleteGroup() {
    var activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      //if (confirm('Are you sure?')) {
      this.canvas.remove(activeObject);
      //}
    }
  }
  clearall() {
    if(this.canvas)
    this.canvas.clear();
  }
  saveFilename() {
    var link = document.createElement('a');
    var rr = prompt('Enter Name for Save.');

    link.download = rr + '.png';
    link.href = this.canvas.toDataURL({ format: 'png' });

    document.body.appendChild(link);
    link.click();
  }

  addLengthSegment(
    length: number,
    Type: any,
    Visible: any,
    text_x: number,
    text_y: number
  ): void {
    const obj: addCabShapeDims = {
      SNo: this.shapeData.length + 1,
      Match: this.alphabet[this.Alphabet_count],
      Geometry: 'length',
      Length: length,
      Angle: 0,
      Type: 'Actual',
      Length2: 0,
      Visible: Visible,
      X_cord: 0,
      y_cord: 0,
      isAngle: false,
    };
    debugger;
    this.shapeData.push(obj);
    this.Alphabet_count++;
    this.drawSegment_Fabric(
      this.previousEndpoint,
      obj.Length,
      this.AngleTotal,
      0,
      text_x,
      text_y
    ); // Draw the new segment
  }
  drawSegment(
    startPoint: { x: number; y: number },
    length: number,
    angle: number
  ): void {
    const ctx = this.canvas?.nativeElement.getContext('2d'); // Add null check here

    length = length / 10;
    if (ctx) {
      const endX = startPoint.x + length * Math.cos((angle * Math.PI) / 180);
      const endY = startPoint.y + length * Math.sin((angle * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.fillText(
        `A${this.shapeData.length}`,
        (startPoint.x + endX) / 2,
        (startPoint.y + endY) / 2
      );

      this.previousEndpoint = { x: endX, y: endY };
    }
  }

  addAngle(angle: number, type: any, text_X: number, text_y: number): void {
    const newSegmentLength = 100; // Example length
    const newSegmentAngle = 90; // Example angle

    const obj: addCabShapeDims = {
      SNo: this.shapeData.length + 1,
      Match: this.alphabet[this.Alphabet_count],
      Geometry: 'Angle',
      Length: 1,
      Angle: angle,
      Type: type,
      Length2: 0,
      Visible: 'Invisible',
      X_cord: 0,
      y_cord: 0,
      isAngle: true,
    };

    this.Alphabet_count++;

    if (type.toString().toLowerCase() == 'clockwise') {
      this.AngleTotal += angle;
    } else {
      this.AngleTotal -= angle;
    }
    this.shapeData.push(obj);
    this.lengthTable.push({ length: newSegmentLength, angle: newSegmentAngle });
    this.drawSegment_Fabric(
      this.previousEndpoint,
      obj.Length,
      this.AngleTotal,
      angle,
      text_X,
      text_y
    );
    this.prevAngle = true; // Draw the new segment
  }

  addPerpendicularLine(): void {
    // Ensure there is at least one segment
    if (this.lengthTable.length === 0) {
      return;
    }

    const lastSegment = this.lengthTable[this.lengthTable.length - 1];
    const perpendicularAngle = lastSegment.angle + 90; // Calculate perpendicular angle (assuming 90 degrees)

    const newSegmentLength = 500; // Example length for perpendicular line
    const newSegmentAngle = perpendicularAngle; // Use perpendicular angle

    // Calculate the endpoint of the perpendicular line based on the endpoint of the last segment
    const startPoint = this.calculateEndpoint(
      this.previousEndpoint,
      lastSegment.length,
      lastSegment.angle
    );
    const perpendicularLineEndpoint = this.calculateEndpoint(
      startPoint,
      newSegmentLength,
      newSegmentAngle
    );

    const obj: addCabShapeDims = {
      SNo: this.shapeData.length + 1,
      Match: 'A',
      Geometry: 'length',
      Length: 1000,
      Angle: 0,
      Type: 'Actual',
      Length2: 0,
      Visible: 'visible',
      X_cord: 0,
      y_cord: 0,
      isAngle: true,
    };
    this.shapeData.push(obj);

    // Add the new segment with the provided length and angle
    this.lengthTable.push({ length: newSegmentLength, angle: newSegmentAngle });

    // Draw the new segment
    this.drawSegment(
      startPoint,
      perpendicularLineEndpoint.x,
      perpendicularLineEndpoint.y
    );
  }
  addChangeAngle(): void {
    const newSegmentLength = 100; // Example length
    const newSegmentAngle = 90; // Example angle

    const obj: addCabShapeDims = {
      SNo: this.shapeData.length + 1,
      Match: 'A',
      Geometry: 'length',
      Length: 10,
      Angle: 90,
      Type: 'Actual',
      Length2: 0,
      Visible: 'Invisible',
      X_cord: 0,
      y_cord: 0,
      isAngle: false,
    };
    this.shapeData.push(obj);
    this.lengthTable.push({ length: newSegmentLength, angle: newSegmentAngle });
    this.drawSegment(this.previousEndpoint, obj.Length, 90);
    this.prevAngle = true; // Draw the new segment
  }

  calculateEndpoint(
    startPoint: { x: number; y: number },
    length: number,
    angle: number
  ): { x: number; y: number } {
    // Calculate the endpoint based on the given length and angle
    const endX = startPoint.x + length * Math.cos((angle * Math.PI) / 180);
    const endY = startPoint.y + length * Math.sin((angle * Math.PI) / 180);

    return { x: endX, y: endY };
  }
  changeData() {
    debugger;

    this.shapeData_temp = JSON.parse(JSON.stringify(this.shapeData));
    this.shapeData = [];
    this.AngleTotal = 0;

    this.clearall();
    this.previousEndpoint = { x: 200, y: 200 };
    this.Alphabet_count = 0;
    this.shapeData_temp.forEach((element) => {
      if (element.Visible.toLowerCase() === 'visible') {
        this.addLengthSegment(
          element.Length,
          element.Type,
          element.Visible,
          element.X_cord,
          element.y_cord
        );
      } else {
        this.addAngle(
          element.Angle,
          element.Type,
          element.X_cord,
          element.y_cord
        );
      }
    });
    this.enableEditIndex = -2;
  }

  degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  clearCanvas(): void {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    if (context) context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
  }
  onEdit(index: number) {
    this.enableEditIndex = index;
    this.shapeData_temp = JSON.parse(JSON.stringify(this.shapeData));
  }
  EditCancel() {
    this.shapeData = JSON.parse(JSON.stringify(this.shapeData_temp));
    this.enableEditIndex = -2;
  }

  UndoOperation() {
    this.shapeData.pop();

    this.changeData();
  }
  DrawArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) {
    this.Arcclick += 1;
    debugger;
    radius /= 10;
    let centerX = x - radius * Math.cos((startAngle * Math.PI) / 180);
    let centerY = y - 2 * (radius * Math.cos((startAngle * Math.PI) / 180));
    const endX = x + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = y + radius * Math.sin((endAngle * Math.PI) / 180);

    // const endX = startPoint.x + length * Math.cos(angle * Math.PI / 180);
    // const endY = startPoint.y + length * Math.sin(angle * Math.PI / 180);

    let newX =
      (x - radius) * Math.cos((this.AngleTotal * Math.PI) / 180) -
      (y - 2 * radius) * Math.sin((this.AngleTotal * Math.PI) / 180);
    let newY =
      (y - 2 * radius) * Math.cos((this.AngleTotal * Math.PI) / 180) +
      (x - radius) * Math.sin((this.AngleTotal * Math.PI) / 180);
    this.previousEndpoint = { x: endX, y: endY };
    var circle: any = new fabric.Circle({
      id: 'arc_' + this.Arcclick,
      left: x - radius,
      top: y - 2 * radius,
      radius: radius,
      fill: '',
      stroke: 'black',
      strokeWidth: 2,
      //angle: 45,
      startAngle: -90 + this.AngleTotal,
      endAngle: -270 + this.AngleTotal,
    });

    this.canvas.add(circle);

    // var linetxt:any = new fabric.IText("50", {
    //     id: 'arclinetxt_' + this.Arcclick,
    //     left: x,
    //     top: y,
    //     fontSize: 15,
    //     fill: "red",
    //     selectable: true,
    //     cornerColor: 'green',
    //     cornerSize: 2,
    //     transparentCorners: false,
    //     hasControls: false
    // });

    // let group = new fabric.Group([circle, linetxt], {
    //     subTargetCheck: true,
    //     hasControls: true
    // });

    // group.on('mousedblclick', (e:any) => {
    //     if (e.subTargets[0].id.search("arclinetxt") >= 0) {
    //         let textForEditing = new fabric.IText(linetxt.text, {
    //             textAlign: linetxt.textAlign,
    //             fontSize: linetxt.fontSize,
    //             left: e.pointer.x, //group.left + (group.width / 2),
    //             top: e.pointer.y //group.top,
    //         })
    //         linetxt.visible = false;
    //         group.addWithUpdate();
    //         textForEditing.visible = true;
    //         textForEditing.hasControls = false;
    //         this.canvas.add(textForEditing);
    //         this.canvas.setActiveObject(textForEditing);
    //         textForEditing.enterEditing();
    //         textForEditing.selectAll();

    //         textForEditing.on('editing:exited', () => {
    //             let newVal = textForEditing.text;
    //             let oldVal = linetxt.text;
    //             if (newVal !== oldVal) {
    //                 circle.set({
    //                     radius: Number(newVal)
    //                 })
    //                 //console.log(circle);
    //                 linetxt.set({
    //                     text: newVal,
    //                     visible: true,
    //                     // top:  circle.oCoords.mb.y - circle.oCoords.mb.x , //- circle.oCoords.mt.y, //+ (group.width / 2),
    //                     // left: circle.oCoords.mt.y - circle.oCoords.mb.y,//- circle.oCoords.mb.y,
    //                 })

    //                 group.addWithUpdate();
    //                 textForEditing.visible = false;
    //                 this.canvas.remove(textForEditing);
    //                 this.canvas.setActiveObject(group);
    //             }
    //         })
    //         return;
    //     }
    // })

    // this.canvas.add(group);
  }

  addArc(angle: number, type: any, length: number): void {
    debugger;
    const newSegmentLength = 100; // Example length
    const newSegmentAngle = 90; // Example angle
    let CenterX = this.previousEndpoint.x;
    let CenterY = this.previousEndpoint.y;
    // this.addAngle(90,'AntiClockwise');
    // this.addLengthSegment(1000);

    // this.UndoOperation();
    // this.UndoOperation();

    const obj: addCabShapeDims = {
      SNo: this.shapeData.length + 1,
      Match: 'A',
      Geometry: 'Arc',
      Length: length,
      Angle: angle,
      Type: type,
      Length2: 0,
      Visible: 'Invisible',
      X_cord: 0,
      y_cord: 0,
      isAngle: true,
    };

    let startAngle = this.AngleTotal;
    this.AngleTotal += angle;

    // if(type.toString().toLowerCase()=='clockwise')
    // {
    //   this.AngleTotal+=angle;

    // }
    // else{
    //   this.AngleTotal-=angle;

    // }
    this.shapeData.push(obj);
    this.lengthTable.push({ length: newSegmentLength, angle: newSegmentAngle });
    // this.drawSegment_Fabric(this.previousEndpoint, obj.Length, this.AngleTotal,angle);
    this.DrawArc(
      CenterX,
      CenterY,
      length,
      270 + this.AngleTotal,
      90 + +this.AngleTotal
    );
    this.prevAngle = true; // Draw the new segment
  }

  // DrawCoupler(): void {
  //   debugger;
  //     this.lineclick += 1;
  //     ;
  //     let angleDir = 1;
  //     if(this.AngleTotal>0)
  //     angleDir=-1;

  //     let Angle = this.AngleTotal - 90*angleDir;
  //     let X_Upside = this.previousEndpoint.x +  25 * Math.sin(Angle * Math.PI / 180);
  //     let Y_Upside = this.previousEndpoint.y +  25 * Math.sin(Angle * Math.PI / 180);
  //     var line:any = new fabric.Line([this.previousEndpoint.x, this.previousEndpoint.y, X_Upside, Y_Upside], {
  //       id: (this.shapeData[this.shapeData.length-1]).toString(),
  //       stroke: 'black',
  //       strokeWidth: 2,
  //       cornerColor: 'green',
  //       cornerSize: 6,
  //       hoverCursor: 'pointer',
  //       selectable: false,

  //   });
  //   this.canvas.add(line);
  //     Angle+=180*angleDir;
  //     let Y_Downside = this.previousEndpoint.y +  25 * Math.sin(Angle * Math.PI / 180);
  //     let X_Downside = this.previousEndpoint.x +  25 * Math.sin(Angle * Math.PI / 180);

  //     let length = this.previousEndpoint.x
  //     let endX=this.previousEndpoint.x
  //     // const canvas: HTMLCanvasElement = this.canvas.nativeElement;
  //     // const ctx = canvas.getContext('2d');
  //     //     if (ctx)
  //     //      {
  //                   // Add null check here

  //                 var line:any = new fabric.Line([this.previousEndpoint.x, this.previousEndpoint.y, X_Downside, Y_Downside], {
  //                   id: (this.shapeData[this.shapeData.length-1]).toString(),
  //                   stroke: 'black',
  //                   strokeWidth: 2,
  //                   cornerColor: 'green',
  //                   cornerSize: 6,
  //                   hoverCursor: 'pointer',
  //                   selectable: false,

  //               });
  //               this.canvas.add(line);

  //     let PreviousX = this.previousEndpoint.x;
  //     let PreviousY_Upside = this.previousEndpoint.y;
  //     let PreviousY_Downside = this.previousEndpoint.y;

  //     for(let i=0;i<4;i++)
  //     {
  //         Angle = this.AngleTotal - 90*angleDir;
  //         Y_Upside = PreviousY_Upside +  25 * Math.sin(Angle * Math.PI / 180);
  //         endX = length + 25 * Math.cos(this.AngleTotal * Math.PI / 180);
  //         var line:any = new fabric.Line([endX, PreviousY_Upside, endX, Y_Upside], {
  //           id: (this.shapeData[this.shapeData.length-1]).toString(),
  //           stroke: 'black',
  //           strokeWidth: 2,
  //           cornerColor: 'green',
  //           cornerSize: 6,
  //           hoverCursor: 'pointer',
  //           selectable: false,

  //       });
  //       this.canvas.add(line);
  //       PreviousY_Upside = Y_Upside
  //       Angle+=180*angleDir;
  //       endX = length + 25 * Math.cos(this.AngleTotal * Math.PI / 180);
  //       Y_Downside = PreviousY_Downside +  25 * Math.sin(Angle * Math.PI / 180);
  //       var line:any = new fabric.Line([endX, PreviousY_Downside, endX, Y_Downside], {
  //         id: (this.shapeData[this.shapeData.length-1]).toString(),
  //         stroke: 'black',
  //         strokeWidth: 2,
  //         cornerColor: 'green',
  //         cornerSize: 6,
  //         hoverCursor: 'pointer',
  //         selectable: false,

  //     });
  //     this.canvas.add(line);
  //     PreviousY_Downside = Y_Downside;
  //     // PreviousX = endX
  //         // ctx.fillText(`A${this.shapeData.length}`, (startPoint.x + endX) / 2, (startPoint.y + endY) / 2);
  //         length+=25;

  //     }

  //     this.addLengthSegment(1000)
  //   }

  createNsplice() {
    this.lineclick += 1;
    var line = new fabric.Line([100, 100, 200, 100], {
      id: 'line_' + this.lineclick,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
    });

    var vline1 = new fabric.Line([100, 120, 100, 80], {
      id: 'hline_' + this.lineclick,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
    });

    var vline2 = new fabric.Line([125, 120, 125, 80], {
      id: 'hline_' + this.lineclick,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
    });

    var vline3 = new fabric.Line([150, 120, 150, 80], {
      id: 'hline_' + this.lineclick,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
    });

    var vline4 = new fabric.Line([175, 120, 175, 80], {
      id: 'hline_' + this.lineclick,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
    });

    var vline5 = new fabric.Line([200, 120, 200, 80], {
      id: 'hline_' + this.lineclick,
      stroke: 'black',
      strokeWidth: 2,
      cornerColor: 'green',
      cornerSize: 6,
      hoverCursor: 'pointer',
    });

    let group = new fabric.Group(
      [line, vline1, vline2, vline3, vline4, vline5],
      {
        subTargetCheck: true,
        hasControls: true,
        angle: this.AngleTotal,
        top: this.previousEndpoint.y,
        left: this.previousEndpoint.x,
      }
    );

    this.canvas.add(group);
  }
  // DrawNSplice()
  // {

  //   this.addAngle(90,'AnitiClockwise');
  //   this.addLengthSegment(200);
  //   let x = this.previousEndpoint.x
  //   let y = this.previousEndpoint.y;
  //   this.UndoOperation();
  //   this.UndoOperation();
  //   this.createNsplice();

  // }
  SwitchToParamNames() {
    this.toLabel = !this.toLabel;
    this.changeData();
  }

  loadCabShape(Shapecode: string) {
    debugger;
    this.shapeData_temp = JSON.parse(JSON.stringify(this.shapeData));
    this.shapeData = [];
    this.AngleTotal = 0;

    this.clearall();
    this.previousEndpoint = { x: 200, y: 200 };
    this.Alphabet_count = 0;
    this.cabShapeService.GetShapeTableDetails(Shapecode).subscribe({
      next: (response:any) => {
        //console.log(response);
        this.ShapeDetails = response;
      },
      error: (e:any) => {
        //console.log("error", e);
      },
      complete: () => {
        debugger;
        this.ShapeDetails.forEach((element) => {
          if (element.GeometryType.toLowerCase() == 'length') {
            this.addLengthSegment(
              element.Length,
              element.Type,
              element.Visible,
              element.CSD_TXT_X,
              element.CSD_TXT_Y
            );
          } else if (element.GeometryType.toLowerCase() == 'angle') {
            this.addAngle(
              element.Angle,
              element.Type,
              element.CSD_TXT_X,
              element.CSD_TXT_Y
            );
          }
        });
      },
    });
  }
  onSave() {
    this.cabShapeInsert = [];
    this.shapeData.forEach((element) => {
      var obj: cabShapeInsert = {
        SeqNo: element.SNo,
        ShapeId: this.selectedShapecode,
        GeometryType: element.Geometry,
        CSD_PAR1_CAP: '',
        CSD_PAR2_CAP: '',
        CSD_PAR3_CAP: '',
        CSD_END_POINT_X: 0,
        CSD_END_POINT_Y: 0,
        CSD_TXT_X: element.X_cord,
        CSD_TXT_Y: element.y_cord,
        Name: 0,
        Type: element.Type,
        Length: element.Length,
        Angle: element.Angle,
        Length2: 0,
        Match: element.Match,
        CSD_MATCH_PAR2: '',
        CSD_MATCH_PAR3: '',
        CSD_ARC_DIR: '',
        CSD_CRT_BY: '',
        CSD_CRT_ON: '',
        CSD_UPD_BY: '',
        CSD_UPD_ON: '',
        CSD_HEIGHT_DIST: '',
        CSD_VIEW: '',
        Visible: element.Visible,
        CSD_ProdLength: '',
      };
      this.cabShapeInsert.push(obj);
    });

    this.cabShapeService
      .InsertShapeTableDetails(this.cabShapeInsert)
      .subscribe({
        next: (response:any) => {
          //console.log(response);
        },
        error: (e:any) => {
          //console.log("error", e);
        },
        complete: () => {
          this.loadCabShape(this.selectedShapecode);
        },
      });
  }

  getCabShapelist() {
    //debugger;
    this.cabShapeService.PopulateShapes().subscribe({
      next: (response) => {
        //console.log(response);
        this.shapeList = response;
  
      },
      error: (e) => {
        //console.log("error", e);
      },
      complete: () => {
  
      },
    });
  
  
  
  }
}
