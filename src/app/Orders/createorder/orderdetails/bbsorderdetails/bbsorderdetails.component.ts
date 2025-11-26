// import {
//   Component,
//   ElementRef,
//   OnInit,
//   QueryList,
//   ViewChild,
//   ViewChildren,
// } from '@angular/core';
// import { MAT_FAB_DEFAULT_OPTIONS } from '@angular/material/button';
// import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { BBSOrderdetailsTableInput } from 'src/app/Model/BBSOrderdetailsTableInput';
// import { BBSOrdertableModel } from 'src/app/Model/BBSOrdertableModel';
// import { SaveBarDetailsModel } from 'src/app/Model/saveBarDetailsModel';
// import { OrderService } from 'src/app/Orders/orders.service';
// import { BindingLimitComponent } from '../binding-limit/binding-limit.component';

// @Component({
//   selector: 'app-bbsorderdetails',
//   templateUrl: './bbsorderdetails.component.html',
//   styleUrls: ['./bbsorderdetails.component.css'],
// })
// export class BbsorderdetailsComponent implements OnInit {
//   // @ViewChild('myCanvas', { static: true })
//   // @ViewChild('canvasElement', { static: true })
//   // canvasElement!: ElementRef<HTMLCanvasElement>;

//   // canvasRef!: ElementRef<HTMLCanvasElement>;

//   showSideTable: boolean = false;
//   bbsOrderTable: BBSOrdertableModel[] = [];
//   shapeCodeList: any[] = [];
//   sizeList: any[] = [];

//   editIndex: any = null;

//   // FOR RIGHT SIDE TABLE
//   totalCABWeight: any = 0;
//   totalSBWeight: any = 0;
//   totalCancelledWT: any = 0;
//   totalTotalWeight: any = 0;
//   totalNoofitems: any = 0;
//   totalTotalBarQty: any = 0;

//   tableInput: BBSOrderdetailsTableInput = {
//     elementmark: '',
//     Mark: '',
//     Type: '',
//     BarSize: '',
//     standardbar: false,
//     Memberqty: '',
//     Eachqty: '',
//     BarTotalQty: '',
//     Shapecode: '',
//     A:'',
//     B:'',
//     C:'',
//     D:'',
//     E:'',
//     F:'',
//     G:'', 
//     H:'',
//     I:'',
//     J:'',
//     K:'',
//     L:'', 
//     M:'',
//     N:'',
//     O:'',
//     P:'',
//     Q:'',
//     R:'',
//     S:'',
//     T:'',
//     U:'',
//     V:'',
//     W:'',
//     X:'',
//     Y:'',
//     Z:'', 
//     PinSize: '',
//     BarLength: '',
//     BarWeight: '',
//     Remarks: '',
//   };

//   @ViewChild('input1') input1: ElementRef | undefined;
//   @ViewChild('input2') input2: ElementRef | undefined;
//   @ViewChild('input3') input3: ElementRef | undefined;
//   sbList: any;

//   constructor(
//     private orderService: OrderService,
//     private modalService: NgbModal
//   ) {}

//   ngOnInit(): void {
//     debugger;
//     console.log('CAB');

//     this.GetTableData('0001101481', '0000113319', 999, 1);
//     this.getShapeCodeList('0001101154', '0000112393', 'N-Splice');
//     this.getSBDetails('0001101481', '0000113319');

//     this.sizeList = [6, 8, 10, 12, 13, 16, 20, 24, 25, 28, 32, 36, 40, 50];

//     // this.ngAfterViewInit();
//   }

//   // generateImage() {
//   //   const canvas = this.canvasElement?.nativeElement;
//   //   const context = canvas.getContext('2d');

//   //   // Here, you can draw on the canvas as needed.
//   //   // For example, drawing a red rectangle:
//   //   context!.fillStyle = 'red';
//   //   context!.fillRect(0, 0, canvas.width, canvas.height);

//   //   // Convert the canvas content to a data URL
//   //   const dataUrl = canvas.toDataURL('image/png');

//   //   // Convert the data URL to a byte array
//   //   const byteCharacters = atob(dataUrl.split(',')[1]);
//   //   const byteNumbers = new Array(byteCharacters.length);
//   //   for (let i = 0; i < byteCharacters.length; i++) {
//   //     byteNumbers[i] = byteCharacters.charCodeAt(i);
//   //   }
//   //   const byteArray = new Uint8Array(byteNumbers);

//   //   // You now have the image data as a byte array (byteArray)
//   //   // You can use it as needed, for example, by sending it to a server or displaying it.

//   //   // For demonstration purposes, let's log the byte array to the console:
//   //   console.log(byteArray);
//   // }

//   focusNext(event: KeyboardEvent, nextInputName: string) {
//     if (event.key === 'Enter') {
//       // Prevent the default behavior of the Enter key (e.g., form submission)
//       event.preventDefault();

//       // document.querySelector('input[type="text"]').focus();

//       // Use ViewChild references to focus on the next input element

//       // switch (nextInputName) {
//       //   case 'input2':
//       //     this.input2.nativeElement.focus();
//       //     break;
//       //   case 'input3':
//       //     this.input3.nativeElement.focus();
//       //     break;
//       //   case 'input1':
//       //   default:
//       //     this.input1.nativeElement.focus();
//       //     break;
//       // }
//     }
//   }

//   getTotalWeightandQty() {
//     let totalweight = 0;
//     let cabweight = 0;
//     let cancelledweight = 0;
//     let barqty = 0;
//     for (let i = 0; i < this.bbsOrderTable.length; i++) {
//       cabweight += this.bbsOrderTable[i].BarWeight;
//       barqty += this.bbsOrderTable[i].BarTotalQty;
//       if (this.bbsOrderTable[i].Cancelled) {
//         cancelledweight += this.bbsOrderTable[i].BarWeight;
//       }
//     }
//     totalweight = cabweight - cancelledweight;

//     this.totalTotalWeight = totalweight.toFixed(3);
//     this.totalCancelledWT = cancelledweight.toFixed(3);
//     this.totalCABWeight = cabweight.toFixed(3);
//     this.totalTotalBarQty = barqty;
//     this.totalNoofitems = this.bbsOrderTable.length;
//   }

//   getBackgroundColor(item: any) {
//     if (item.Cancelled) {
//       return '#ff000075 !important';
//     } else {
//       return 'white';
//     }
//   }

//   openBending() {
//     const ngbModalOptions: NgbModalOptions = {
//       backdrop: 'static',
//       keyboard: false,
//       // centered: true,
//       size: 'xl',
//     };
//     const modalRef = this.modalService.open(
//       BindingLimitComponent,
//       ngbModalOptions
//     );
//   }

//   onSelectStandardBar() {
//     this.tableInput.Shapecode = '20';
//     this.tableInput.A = '12000';
//     this.tableInput.BarLength = '12000';
//   }

//   onQtyChange(item: any) {
//     this.tableInput.BarTotalQty = (
//       Number(this.tableInput.Memberqty) * Number(this.tableInput.Eachqty)
//     ).toString();
//     this.calWeight(item);
//   }

//   onLengthChange(item: any) {
//     item.BarLength = (
//       Number(item.A) +
//       Number(item.B) +
//       Number(item.C) +
//       Number(item.D) +
//       Number(item.E) +
//       Number(item.F) +
//       Number(item.G)
//     ).toString();
//     this.calWeight(item);
//   }

//   updateData(item: BBSOrdertableModel) {
//     let obj: SaveBarDetailsModel = {
//       CustomerCode: '0001101481',
//       ProjectCode: '0000113319',
//       JobID: item.JobID,
//       BBSID: item.BBSID,
//       BarID: item.BarID,
//       BarSort: item.BarSort,
//       Cancelled: item.Cancelled,
//       BarCAB: item.BarCAB,
//       BarSTD: item.BarSTD,
//       ElementMark: item.ElementMark,
//       BarMark: item.BarMark,
//       BarType: item.BarType, //type must be less than 10
//       BarSize: Number(item.BarSize),
//       BarMemberQty: item.BarMemberQty,
//       BarEachQty: item.BarEachQty,
//       BarTotalQty: item.BarTotalQty,
//       BarShapeCode: item.BarShapeCode,
//       A: item.A,
//       B: item.B,
//       C: item.C,
//       D: item.D,
//       E: item.E,
//       F: item.F,
//       G: item.G,
//       H: item.H,
//       I: item.I,
//       J: item.J,
//       K: item.K,
//       L: item.L,
//       M: item.M,
//       N: item.N,
//       O: item.O,
//       P: item.P,
//       Q: item.Q,
//       R: item.R,
//       S: item.S,
//       T: item.T,
//       U: item.U,
//       V: item.V,
//       W: item.W,
//       X: item.X,
//       Y: item.Y,
//       Z: item.Z,
//       BarLength: item.BarLength,
//       BarWeight: item.BarWeight,
//       Remarks: item.Remarks,
//       shapeParameters: item.shapeParameters,
//       shapeLengthFormula: item.shapeLengthFormula,
//       shapeParaValidator: item.shapeParaValidator,
//       shapeTransportValidator: item.shapeTransportValidator,
//       shapeParType: item.shapeParType,
//       shapeDefaultValue: item.shapeDefaultValue,
//       shapeHeightCheck: item.shapeHeightCheck,
//       shapeAutoCalcFormula1: item.shapeAutoCalcFormula1,
//       shapeAutoCalcFormula2: item.shapeAutoCalcFormula2,
//       shapeAutoCalcFormula3: item.shapeAutoCalcFormula3,
//       shapeTransport: item.shapeTransport,
//       PinSize: Number(item.PinSize),
//       TeklaGUID: item.TeklaGUID,
//       PartGUID: item.PartGUID,
//       UpdateDate: item.UpdateDate,
//     };
//     this.orderService.SaveBarDetails(obj).subscribe({
//       next: (response) => {
//         console.log('BBSORDERDETAILS', response);
//         this.getTotalWeightandQty();
//       },
//       error: (e) => {},
//       complete: () => {
//         // this.loading = false;
//       },
//     });
//     this.editIndex = null;
//   }

//   resetInput() {
//     this.tableInput = {
//       elementmark: '',
//       Mark: '',
//       Type: '',
//       BarSize: '',
//       standardbar: false,
//       Memberqty: '',
//       Eachqty: '',
//       BarTotalQty: '',
//       Shapecode: '',
//       A: '',
//       B: '',
//       C: '',
//       D: '',
//       E: '',
//       F: '',
//       G: '',
//       PinSize: '',
//       BarLength: '',
//       BarWeight: '',
//       Remarks: '',
//     };
//   }

//   saveData() {
//     this.SaveTableData();

//     console.log(this.tableInput);
//     let tempobj: BBSOrdertableModel = {
//       A: this.tableInput.A,
//       B: this.tableInput.B,
//       BBSID: 1,
//       BarCAB: false,
//       BarEachQty: Number(this.tableInput.Eachqty),
//       // BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length,
//       BarID: 99,
//       BarLength: this.tableInput.BarLength,
//       BarMark: this.tableInput.Mark,
//       BarMemberQty: Number(this.tableInput.Memberqty),
//       BarSTD: false,
//       BarShapeCode: this.tableInput.Shapecode,
//       BarSize: this.tableInput.BarSize,
//       BarSort: 36000,
//       BarTotalQty: Number(this.tableInput.BarTotalQty),
//       BarType: this.tableInput.Type,
//       BarWeight: Number(this.tableInput.BarWeight),
//       C: this.tableInput.C,
//       Cancelled: false,
//       CustomerCode: '0001101481',
//       D: this.tableInput.D,
//       E: this.tableInput.E,
//       ElementMark: this.tableInput.elementmark,
//       F: this.tableInput.F,
//       G: this.tableInput.G,
//       H: '',
//       I: '',
//       J: '',
//       JobID: 999,
//       K: '',
//       L: '',
//       M: '',
//       N: '',
//       O: '',
//       P: '',
//       PartGUID: '',
//       PinSize: this.tableInput.PinSize,
//       ProjectCode: '0000113319',
//       Q: '',
//       R: '',
//       Remarks: this.tableInput.Remarks,
//       S: '',
//       T: '',
//       TeklaGUID: '',
//       U: '',
//       UpdateDate: '',
//       V: '',
//       W: '',
//       X: '',
//       Y: '',
//       Z: '',
//       shapeAutoCalcFormula1: '',
//       shapeAutoCalcFormula2: '',
//       shapeAutoCalcFormula3: '',
//       shapeDefaultValue: '',
//       shapeHeightCheck: '',
//       shapeLengthFormula: '',
//       shapeParType: '',
//       shapeParaValidator: '',
//       shapeParameters: '',
//       shapeTransport: 0,
//       shapeTransportValidator: '',
//     };
//     // let tempobj = {
//     //   sno: this.bbsOrderTable.length + 1,
//     //   cancel: false,
//     //   elementmark: this.tableInput.elementmark,
//     //   Mark: this.tableInput.Mark,
//     //   Type: this.tableInput.Type,
//     //   BarSize: this.tableInput.BarSize,
//     //   standardbar: this.tableInput.standardbar,
//     //   Memberqty: this.tableInput.Memberqty,
//     //   Eachqty: this.tableInput.Eachqty,
//     //   Totalqty: this.tableInput.Totalqty,
//     //   Shapecode: this.tableInput.Shapecode,
//     //   A: this.tableInput.A,
//     //   B: this.tableInput.B,
//     //   C: this.tableInput.C,
//     //   D: this.tableInput.D,
//     //   E: this.tableInput.E,
//     //   F: this.tableInput.F,
//     //   G: this.tableInput.G,
//     //   PinSize: this.tableInput.PinSize,
//     //   Length: this.tableInput.Length,
//     //   BarWeight: this.tableInput.BarWeight,
//     //   Remarks: this.tableInput.Remarks,
//     //   BarID: this.bbsOrderTable[0].BarID + this.bbsOrderTable.length
//     // }

//     this.bbsOrderTable.push(tempobj);

//     this.resetInput();
//   }

//   SaveTableData() {
//     let obj: SaveBarDetailsModel = {
//       CustomerCode: '0001101481',
//       ProjectCode: '0000113319',
//       JobID: 999,
//       BBSID: 1,
//       BarID:
//         this.bbsOrderTable.length == 0
//           ? 100
//           : this.bbsOrderTable[this.bbsOrderTable.length - 1].BarID + 1,
//       // BarID: 99,
//       BarSort: 36000,
//       Cancelled: false,
//       BarCAB: true,
//       BarSTD: true,
//       ElementMark: this.tableInput.elementmark.toString(),
//       BarMark: this.tableInput.Mark.toString(),
//       BarType: this.tableInput.Type, //type must be less than 10
//       BarSize: Number(this.tableInput.BarSize),
//       BarMemberQty: Number(this.tableInput.Memberqty),
//       BarEachQty: Number(this.tableInput.Eachqty),
//       BarTotalQty: Number(this.tableInput.BarTotalQty),
//       BarShapeCode: this.tableInput.Shapecode,
//       A: this.tableInput.A.toString(),
//       B: this.tableInput.B.toString(),
//       C: this.tableInput.C.toString(),
//       D: this.tableInput.D.toString(),
//       E: this.tableInput.E.toString(),
//       F: this.tableInput.F.toString(),
//       G: this.tableInput.G.toString(),
//       H: '',
//       I: '',
//       J: '',
//       K: '',
//       L: '',
//       M: '',
//       N: '',
//       O: '',
//       P: '',
//       Q: '',
//       R: '',
//       S: '',
//       T: '',
//       U: '',
//       V: '',
//       W: '',
//       X: '',
//       Y: '',
//       Z: '',
//       BarLength: this.tableInput.BarLength.toString(),
//       BarWeight: Number(this.tableInput.BarWeight),
//       Remarks: this.tableInput.Remarks,
//       shapeParameters: '',
//       shapeLengthFormula: '',
//       shapeParaValidator: '',
//       shapeTransportValidator: '',
//       shapeParType: '',
//       shapeDefaultValue: '',
//       shapeHeightCheck: '',
//       shapeAutoCalcFormula1: '',
//       shapeAutoCalcFormula2: '',
//       shapeAutoCalcFormula3: '',
//       shapeTransport: 1,
//       PinSize: Number(this.tableInput.PinSize),
//       TeklaGUID: '',
//       PartGUID: '',
//       UpdateDate: '2023-09-06',
//     };
//     this.orderService.SaveBarDetails(obj).subscribe({
//       next: (response) => {
//         console.log('BBSORDERDETAILS', response);
//         this.getTotalWeightandQty();
//       },
//       error: (e) => {},
//       complete: () => {
//         // this.loading = false;
//       },
//     });
//   }

//   getShapeCodeList(
//     CustomerCode: string,
//     ProjectCode: string,
//     CouplerType: string
//   ) {
//     this.orderService
//       .getShapeCodeList(CustomerCode, ProjectCode, CouplerType)
//       .subscribe({
//         next: (response) => {
//           console.log('shapeCodeList', response);
//           this.shapeCodeList = response;
//         },
//         error: (e) => {},
//         complete: () => {
//           // this.loading = false;
//         },
//       });
//   }

//   GetTableData(
//     CustomerCode: string,
//     ProjectCode: string,
//     JobID: number,
//     BBSID: number
//   ) {
//     this.orderService
//       .GetBarDetails(CustomerCode, ProjectCode, JobID, BBSID)
//       .subscribe({
//         next: (response) => {
//           console.log('BBSORDERDETAILS', response);
//           this.bbsOrderTable = response;
//           this.getTotalWeightandQty();
//         },
//         error: (e) => {},
//         complete: () => {
//           // this.loading = false;
//         },
//       });
//   }

//   // CANVAS CODE STARTED
//   // ngAfterViewInit() {
//   //   const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
//   //   const context = canvas.getContext('2d');
//   //   if (context) {
//   //     let label;

//   //     const totalWidth = 500;
//   //     const totalHeight = 500;

//   //     // Set canvas size to fit content
//   //     canvas.width = totalWidth + 160;
//   //     canvas.height = totalHeight + 160;

//   //     let center_y = totalHeight / 2;
//   //     let center_x = totalWidth / 2;
//   //     context.strokeStyle = 'black';
//   //     context.lineWidth = 1;
//   //     context.beginPath();
//   //     context.moveTo(center_x, center_y); // Starting point (x, y)

//   //     context.lineTo(-100, 100); // Ending point (x, y)
//   //     context.stroke();

//   //     context.fillText('CENTER', center_x, center_y);
//   //   }
//   // }

//   getCalculatedValues(pItem: BBSOrderdetailsTableInput) {
//     this.calQty(pItem);
//     this.calWeight(pItem);
//   }

//   calQty(pItem: BBSOrderdetailsTableInput) {
//     var lDia = [6, 8, 10, 12, 13, 16, 20, 24, 25, 28, 32, 36, 40, 50];
//     var lUnitWT = [
//       0.222, 0.395, 0.617, 0.888, 1.042, 1.579, 2.466, 3.699, 3.854, 4.834,
//       6.313, 7.769, 9.864, 15.413,
//     ];
//     var lWeight = 0;
//     // var pItem.Memberqty = "";
//     // var pItem.Eachqty = "";
//     // var pItem.BarTotalQty = "";
//     // var lBarLength = pItem["BarLength"];
//     var lPcsFr = 0;
//     var lPCs = 0;

//     if (
//       pItem.BarWeight != undefined &&
//       pItem.Type != undefined &&
//       pItem.BarSize != undefined
//     ) {
//       for (var i = 0; i < this.sbList.length; i++) {
//         if (
//           pItem.Type == this.sbList[i].BarType &&
//           pItem.BarSize == this.sbList[i].BarSize
//         ) {
//           lPcsFr = this.sbList[i].BundlePcs_fr;
//           lPCs = this.sbList[i].BundlePcs;
//           break;
//         }
//       }
//       if (lPCs > 0) {
//         if (pItem.BarLength == '12000' || pItem.BarLength == '14000') {
//           if (pItem.BarWeight >= '2000') {
//             pItem.Memberqty = Math.round(
//               Number(pItem.BarWeight) / 2000
//             ).toString();
//           } else {
//             pItem.Memberqty = '1';
//           }
//         } else {
//           if (pItem.BarWeight >= '1000') {
//             pItem.Memberqty = Math.round(
//               Number(pItem.BarWeight) / 1000
//             ).toString();
//           } else {
//             pItem.Memberqty = '1';
//           }
//         }
//         if (lPcsFr != lPCs) {
//           pItem.Eachqty = lPcsFr + '-' + lPCs;
//           pItem.BarTotalQty =
//             lPcsFr * Number(pItem.Memberqty) +
//             '-' +
//             lPCs * Number(pItem.Memberqty);
//         } else {
//           pItem.Eachqty = lPCs.toString();
//           pItem.BarTotalQty = (lPCs * Number(pItem.Memberqty)).toString();
//         }
//         // pItem["BarMemberQty"] = pItem.Memberqty;
//         // pItem["BarEachQty"] = pItem.Eachqty;
//         // pItem["BarTotalQty"] = pItem.BarTotalQty;
//       }
//     }
//   }

//   calWeight(pItem: any) {
//     debugger;
//     if (
//       pItem.BarLength != undefined &&
//       pItem.BarSize != undefined &&
//       pItem.BarTotalQty != undefined
//     ) {
//       //var lDia = [6, 8, 10, 12, 13, 16, 20, 24, 25, 28, 32, 36, 40, 50];
//       var lUnitWT = [
//         0.222, 0.395, 0.617, 0.888, 1.042, 1.579, 2.466, 3.699, 3.854, 4.834,
//         6.313, 7.769, 9.864, 15.413,
//       ];
//       var lWeight = 0;
//       var lKGM = 0;
//       var lBarLength = pItem.BarLength;

//       if (!isNaN(pItem.BarTotalQty) && !isNaN(pItem.BarSize)) {
//         for (var i = 0; i < this.sizeList.length; i++) {
//           if (pItem.BarSize == this.sizeList[i]) {
//             lKGM = lUnitWT[i];
//             break;
//           }
//         }
//         if (lKGM > 0) {
//           if (isNaN(lBarLength)) {
//             if (lBarLength != null) {
//               lWeight =
//                 Math.round(
//                   (lKGM *
//                     pItem.BarTotalQty *
//                     (this.getVarMinValue(lBarLength) +
//                       this.getVarMaxValue(lBarLength))) /
//                     2
//                 ) / 1000;
//             }
//           } else {
//             lWeight = Math.round(lKGM * pItem.BarTotalQty * lBarLength) / 1000;
//           }
//         }
//       }
//       pItem.BarWeight = lWeight.toString();
//       //return lWeight;
//     }
//   }

//   getVarMinValue(pValue: any) {
//     var rValue = 0;
//     if (pValue != null) {
//       if (isNaN(pValue)) {
//         var lVarLen = pValue.split('-');
//         if (lVarLen.length == 2) {
//           var lVar1 = 0;
//           var lVar2 = 0;
//           if (isNaN(lVarLen[0]) == false) {
//             lVar1 = parseInt(lVarLen[0]);
//           }
//           if (isNaN(lVarLen[1]) == false) {
//             lVar2 = parseInt(lVarLen[1]);
//           }
//           if (lVar1 > lVar2) {
//             rValue = lVar2;
//           } else {
//             rValue = lVar1;
//           }
//         } else {
//           rValue = 0;
//         }
//       } else {
//         rValue = parseInt(pValue);
//       }
//     }

//     return rValue;
//   }

//   getVarMaxValue(pValue: any) {
//     var rValue = 0;
//     if (pValue != null) {
//       if (isNaN(pValue)) {
//         var lVarLen = pValue.split('-');
//         if (lVarLen.length == 2) {
//           var lVar1 = 0;
//           var lVar2 = 0;
//           if (isNaN(lVarLen[0]) == false) {
//             lVar1 = parseInt(lVarLen[0]);
//           }
//           if (isNaN(lVarLen[1]) == false) {
//             lVar2 = parseInt(lVarLen[1]);
//           }
//           if (lVar1 > lVar2) {
//             rValue = lVar1;
//           } else {
//             rValue = lVar2;
//           }
//         } else {
//           rValue = 0;
//         }
//       } else {
//         rValue = parseInt(pValue);
//       }
//     }
//     return rValue;
//   }

//   onSBselect() {}

//   getSBDetails(CustomerCode: string, ProjectCode: string) {
//     this.orderService.getSBDetails(CustomerCode, ProjectCode).subscribe({
//       next: (response) => {
//         console.log('sbList', response);
//         this.sbList = response;
//       },
//       error: (e) => {},
//       complete: () => {
//         // this.loading = false;
//       },
//     });
//   }
// }
