// import { Component, OnInit ,Input, ViewChild} from '@angular/core';
// import { Router } from '@angular/router';
// import { fabric } from "fabric";
// import { Group } from 'fabric/fabric-impl';

// @Component({
//   selector: 'app-DrawShape',
//   templateUrl: './DrawShape.component.html',
//   styleUrls: ['./DrawShape.Component.css']
// })
// export class DrawShapeComponent implements OnInit {
//   @ViewChild('canvas') myCanvas!: HTMLCanvasElement
//   canvas:any;

//   degsymbole = '\xB0';
//   Angleclick = 0;
//   lineclick = 0;
//   hlineclick = 0;
//   Arcclick = 0;
//   txtclick = 0;


//   constructor(public router:Router ) {

//   }

//   ngOnInit() {

//   }
//   ngAfterViewInit(): void {
//     this.canvas = new fabric.Canvas('fabricCanvas', {width: 900,height: 500});
//   }

//   createGroupAngle() {
//     console.log("createGroupAngle");
//     this.Angleclick += 1;
//     var line:any = new fabric.Line([100, 100, 200, 100], {
//         stroke: 'black',
//         strokeWidth: 2,
//         cornerColor: 'green',
//         cornerSize: 6,
//         hoverCursor: 'pointer',
//         selectable: true
//     });
//     var line2 = new fabric.Line([100, 200, 100, 100], {
//         stroke: 'black',
//         strokeWidth: 2,
//         cornerColor: 'green',
//         cornerSize: 6,
//         hoverCursor: 'pointer',
//         selectable: false,
//         //angle:90
//     });

//     var angle:any = new fabric.IText("90" + this.degsymbole, {
//         left: 105,
//         top: 100,
//         fontSize: 15,
//         selectable: true,
//         cornerColor: 'green',
//         cornerSize: 2,
//         transparentCorners: false,
//         hasControls: false,
//     });

//     var linetxt:any = new fabric.IText("100", {
//         left: 150,
//         top: 100,
//         fontSize: 15,
//         fill: "red",
//         selectable: true,
//         cornerColor: 'green',
//         cornerSize: 2,
//         transparentCorners: false,
//         hasControls: false
//     });

//     var linetxt2:any = new fabric.IText("100", {
//         left: 100,
//         top: 150,
//         fontSize: 15,
//         fill: "red",
//         selectable: true,
//         cornerColor: 'green',
//         cornerSize: 2,
//         transparentCorners: false,
//         hasControls: false,
//         angle: 90,
//     });

//     let group:Group = new fabric.Group([line, linetxt, angle, line2, linetxt2], {
//         subTargetCheck: true,
//         hasControls: false
//     });


//     group.on('mousedblclick', (e:any) => {
//         if (e.subTargets[0].id.search("anglelinetxt1") >= 0) {
//             let textForEditing = new fabric.IText(linetxt.text, {
//                 textAlign: linetxt.textAlign,
//                 fontSize: linetxt.fontSize,
//                 left: e.pointer.x, //group.left + (group.width / 2),
//                 top: e.pointer.y //group.top,
//             })
//             linetxt.visible = false;
//             group.addWithUpdate();
//             textForEditing.visible = true;
//             textForEditing.hasControls = false;
//             this.canvas.add(textForEditing);
//             this.canvas.setActiveObject(textForEditing);
//             textForEditing.enterEditing();
//             textForEditing.selectAll();

//             textForEditing.on('editing:exited', () => {
//                 let newVal = textForEditing.text;
//                 let oldVal = linetxt.text;
//                 if (newVal !== oldVal) {
//                     linetxt.set({
//                         text: newVal,
//                         visible: true,
//                     })
//                     line.scaleToWidth(Number(newVal));
//                     line.set('strokeUniform', true);
//                     group.addWithUpdate();
//                     textForEditing.visible = false;
//                     this.canvas.remove(textForEditing);
//                     this.canvas.setActiveObject(group);
//                 }
//             })
//             return;
//         }

//         if (e.subTargets[0].id.search("anglelinetxt2") >= 0) {
//             let textForEditing = new fabric.IText(linetxt2.text, {
//                 textAlign: linetxt2.textAlign,
//                 fontSize: linetxt2.fontSize,
//                 left: e.pointer.x,
//                 top: e.pointer.y,
//             })
//             linetxt2.visible = false;
//             group.addWithUpdate();
//             textForEditing.visible = true;
//             textForEditing.hasControls = false;
//             this.canvas.add(textForEditing);
//             this.canvas.setActiveObject(textForEditing);
//             textForEditing.enterEditing();
//             textForEditing.selectAll();

//             textForEditing.on('editing:exited', () => {
//                 let newVal = textForEditing.text;
//                 let oldVal = linetxt2.text;
//                 if (newVal !== oldVal) {
//                     linetxt2.set({
//                         text: newVal,
//                         visible: true,
//                     })
//                     //console.log(line2.aCoords)
//                     line2.scaleToHeight(Number(newVal));
//                     line2.set('strokeUniform', true);
//                     group.addWithUpdate();
//                     textForEditing.visible = false;
//                     this.canvas.remove(textForEditing);
//                     this.canvas.setActiveObject(group);
//                     // console.log(line2.aCoords)
//                 }
//             })
//             return;
//         }

//         if (e.subTargets[0].id.search("angle") >= 0) {
//             let textForEditing = new fabric.IText(angle.text, {
//                 textAlign: angle.textAlign,
//                 fontSize: angle.fontSize,
//                 left: e.pointer.x, // group.left,
//                 top: e.pointer.y // group.top,
//             })
//             angle.visible = false;
//             group.addWithUpdate();
//             textForEditing.visible = true;
//             textForEditing.hasControls = false;
//             this.canvas.add(textForEditing);
//             this.canvas.setActiveObject(textForEditing);
//             textForEditing.enterEditing();
//             textForEditing.selectAll();

//             textForEditing.on('editing:exited', (e) => {
//                 let newVal = Number(textForEditing.text) - 90;
//                 let oldVal = Number(angle.text);
//                 let newvalues;
//                 if (newVal !== oldVal) {

//                     angle.set({
//                         text: textForEditing.text + this.degsymbole,
//                         visible: true,
//                     })
//                     line2.set({
//                         angle: Number(newVal),
//                     })
//                     linetxt2.set({
//                         left: line2.left,
//                         top: line2.top,
//                         angle: Number(textForEditing.text),
//                     })
//                     group.addWithUpdate();
//                     textForEditing.visible = false;
//                     this.canvas.remove(textForEditing);
//                     this.canvas.setActiveObject(group);
//                 }
//             })
//             return;
//         }
//     })

//     this.canvas.add(group);

//   }

//   createGroupLine() {
//     this.lineclick += 1;
//     var line:any = new fabric.Line([100, 100, 200, 100], {
//         id: 'line_' + this.lineclick,
//         stroke: 'black',
//         strokeWidth: 2,
//         cornerColor: 'green',
//         cornerSize: 6,
//         hoverCursor: 'pointer',
//         selectable: true
//     });

//     var linetxt:any = new fabric.IText("100", {
//         id: 'linetxt_' + this.lineclick,
//         left: 150,
//         top: 100,
//         fontSize: 15,
//         fill: "red",
//         selectable: true,
//         cornerColor: 'green',
//         cornerSize: 2,
//         transparentCorners: false,
//         hasControls: false
//     });


//     let group = new fabric.Group([line, linetxt], {
//         subTargetCheck: true,
//         hasControls: false
//     });


//     group.on('mousedblclick', (e:any) => {
//         if (e.subTargets[0].id.search("linetxt") >= 0) {
//             let textForEditing = new fabric.IText(linetxt.text, {
//                 textAlign: linetxt.textAlign,
//                 fontSize: linetxt.fontSize,
//                 left: e.pointer.x, //group.left + (group.width / 2),
//                 top: e.pointer.y //group.top,
//             })
//             linetxt.visible = false;
//             group.addWithUpdate();
//             textForEditing.visible = true;
//             textForEditing.hasControls = false;
//             this.canvas.add(textForEditing);
//             this.canvas.setActiveObject(textForEditing);
//             textForEditing.enterEditing();
//             textForEditing.selectAll();

//             textForEditing.on('editing:exited', () => {
//                 let newVal = textForEditing.text;
//                 let oldVal = linetxt.text;
//                 if (newVal !== oldVal) {
//                     linetxt.set({
//                         text: newVal,
//                         visible: true,
//                     })
//                     line.scaleToWidth(Number(newVal));
//                     line.set('strokeUniform', true);
//                     group.addWithUpdate();
//                     textForEditing.visible = false;
//                     this.canvas.remove(textForEditing);
//                     this.canvas.setActiveObject(group);
//                 }
//             })
//             return;
//         }


//     })

//     this.canvas.add(group);

//   }

//   createGroupHLine() {
//     this.hlineclick += 1;
//     var hline:any = new fabric.Line([100, 200, 100, 100], {
//         id: 'hline_' + this.hlineclick,
//         stroke: 'black',
//         strokeWidth: 2,
//         cornerColor: 'green',
//         cornerSize: 6,
//         hoverCursor: 'pointer',
//         selectable: false,
//         hasControls: false
//     });

//     var hlinetxt:any = new fabric.IText("100", {
//         id: 'hlinetxt_' + this.hlineclick,
//         left: 102,
//         top: 100,
//         fontSize: 15,
//         fill: "red",
//         selectable: false,
//         cornerColor: 'green',
//         cornerSize: 2,
//         transparentCorners: false,
//         hasControls: false
//     });


//     let group = new fabric.Group([hline, hlinetxt], {
//         subTargetCheck: true,
//         hasControls: false
//     });


//     group.on('mousedblclick', (e:any) => {
//         if (e.subTargets[0].id.search("hlinetxt") >= 0) {
//             let textForEditing = new fabric.IText(hlinetxt.text, {
//                 textAlign: hlinetxt.textAlign,
//                 fontSize: hlinetxt.fontSize,
//                 left: e.pointer.x, //group.left + (group.width / 2),
//                 top: e.pointer.y //group.top,
//             })
//             hlinetxt.visible = false;
//             group.addWithUpdate();
//             textForEditing.visible = true;
//             textForEditing.hasControls = false;
//             this.canvas.add(textForEditing);
//             this.canvas.setActiveObject(textForEditing);
//             textForEditing.enterEditing();
//             textForEditing.selectAll();

//             textForEditing.on('editing:exited', () => {
//                 let newVal = textForEditing.text;
//                 let oldVal = hlinetxt.text;
//                 if (newVal !== oldVal) {
//                     hlinetxt.set({
//                         text: newVal,
//                         visible: true,
//                     })
//                     hline.scaleToHeight(Number(newVal));
//                     hline.set('strokeUniform', true);
//                     group.addWithUpdate();
//                     textForEditing.visible = false;
//                     this.canvas.remove(textForEditing);
//                     this.canvas.setActiveObject(group);
//                 }
//             })
//             return;
//         }
//     })

//     this.canvas.add(group);
//   }

//   createGroupAre() {
//     this.Arcclick += 1;
//     var circle:any = new fabric.Circle({
//         id: "arc_" + this.Arcclick,
//         left: 150,
//         top: 100,
//         radius: 50,
//         fill: "",
//         stroke: "black",
//         strokeWidth: 2,
//         //angle: 45,
//         startAngle: 90,
//         endAngle: 270,
//     });

//     var linetxt:any = new fabric.IText("50", {
//         id: 'arclinetxt_' + this.Arcclick,
//         left: 160,
//         top: 140,
//         fontSize: 15,
//         fill: "red",
//         selectable: true,
//         cornerColor: 'green',
//         cornerSize: 2,
//         transparentCorners: false,
//         hasControls: false
//     });


//     let group = new fabric.Group([circle, linetxt], {
//         subTargetCheck: true,
//         hasControls: true
//     });


//     group.on('mousedblclick', (e:any) => {
//         if (e.subTargets[0].id.search("arclinetxt") >= 0) {
//             let textForEditing = new fabric.IText(linetxt.text, {
//                 textAlign: linetxt.textAlign,
//                 fontSize: linetxt.fontSize,
//                 left: e.pointer.x, //group.left + (group.width / 2),
//                 top: e.pointer.y //group.top,
//             })
//             linetxt.visible = false;
//             group.addWithUpdate();
//             textForEditing.visible = true;
//             textForEditing.hasControls = false;
//             this.canvas.add(textForEditing);
//             this.canvas.setActiveObject(textForEditing);
//             textForEditing.enterEditing();
//             textForEditing.selectAll();

//             textForEditing.on('editing:exited', () => {
//                 let newVal = textForEditing.text;
//                 let oldVal = linetxt.text;
//                 if (newVal !== oldVal) {
//                     circle.set({
//                         radius: Number(newVal)
//                     })
//                     //console.log(circle);
//                     linetxt.set({
//                         text: newVal,
//                         visible: true,
//                         // top:  circle.oCoords.mb.y - circle.oCoords.mb.x , //- circle.oCoords.mt.y, //+ (group.width / 2),
//                         // left: circle.oCoords.mt.y - circle.oCoords.mb.y,//- circle.oCoords.mb.y,
//                     })

//                     group.addWithUpdate();
//                     textForEditing.visible = false;
//                     this.canvas.remove(textForEditing);
//                     this.canvas.setActiveObject(group);
//                 }
//             })
//             return;
//         }
//     })

//     this.canvas.add(group);

//   }

//   createGroupText() {
//     this.txtclick += 1;

//     var txt = new fabric.IText("100", {
//         id: 'txt_' + this.txtclick,
//         left: 100,
//         top: 100,
//         fontSize: 15,
//         fill: "red",
//         selectable: true,
//         cornerColor: 'green',
//         cornerSize: 2,
//         transparentCorners: false,
//         hasControls: false
//     });

//     this.canvas.add(txt);

//   }

//   DeleteGroup() {
//     var activeObject = this.canvas.getActiveObject();
//     if (activeObject) {
//         //if (confirm('Are you sure?')) {
//         this.canvas.remove(activeObject);
//         //}
//     }
//   }
//   clearall() {
//     this.canvas.clear();
//   }
//   save_filename() {
//     var link = document.createElement("a");
//     var rr =  prompt("Enter Name for Save.");

//     link.download = rr+'.png';
//     link.href = this.canvas.toDataURL({format:"png"});

//     document.body.appendChild(link);
//     link.click();

//   }
// }
