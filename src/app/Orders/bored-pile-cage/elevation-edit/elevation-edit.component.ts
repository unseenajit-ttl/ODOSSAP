import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoredPileElevationStiffenerModel } from 'src/app/Model/bpc_elevation_stiffener';
import { dataTransferService } from 'src/app/SharedServices/dataTransferService';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-elevation-edit',
  templateUrl: './elevation-edit.component.html',
  styleUrls: ['./elevation-edit.component.css']
})
export class ElevationEditComponent {
  @ViewChild('canvasElevView')
  canvasEl!: ElementRef<HTMLCanvasElement>;
  contextEl!: CanvasRenderingContext2D;
  @Input() selectedData: any;
  data:any;
  lText: any;
  gCanvasHeight = 210;
  gCanvasWidth = 700;
  gTopHeight = 60;
  gLeftRightMargin = 20;
  gMinTop = 700;
  gMinEnd = 500;
  gCrankHeight = 5;
  gCrankWidth = 10;
  secondMainBarLayerObj: any;
  lSpacingReal2: any;
  lSpacingReal1: any;
  lSpacingReal3: any;
  // data:any;
  tableData:any = [];
  sendData!:BoredPileElevationStiffenerModel;
  constructor(public modal : NgbActiveModal,public tranferService:dataTransferService,public orderService:OrderService) {
  }
  ngOnInit(){
    // this.tranferService.data$.subscribe((tdata:any)=>{
    //   this.data = tdata;
    //   console.log("this.data=>",this.data);
    // })
    this.data = this.selectedData;
    if (this.data.no_of_sr == 1) {
      this.data.last_location =
        this.data.cage_length - this.data.sr1_location;
    }
    if (this.data.no_of_sr == 2) {
      this.data.last_location =
        this.data.cage_length - this.data.sr2_location;
    }
    if (this.data.no_of_sr == 3) {
      this.data.last_location =
        this.data.cage_length - this.data.sr3_location;
    }
    if (this.data.no_of_sr == 4) {
      this.data.last_location =
        this.data.cage_length - this.data.sr4_location;
    }
    if (this.data.no_of_sr == 5) {
      this.data.last_location =
        this.data.cage_length - this.data.sr5_location;
    }
    this.sendData = {
      CustomerCode:this.data.CustomerCode,
      ProjectCode:this.data.ProjectCode,
      Template:this.data.Template,
      JobId:this.data.JobId,
      CageId:this.data.CageId,
      Sr1Location:this.data.Sr1Location,
      Sr2Location:this.data.Sr2Location,
      Sr3Location:this.data.Sr3Location,
      Sr4Location:this.data.Sr4Location,
      Sr5Location:this.data.Sr5Location,
      NoOfSr:this.data.NoOfSr,
      LminTop:this.data.LminTop,
      LminEnd:this.data.LminEnd,
      rings_start:this.data.rings_start,
      no_of_sr:this.data.no_of_sr,
    };

  }
  ngAfterViewInit() {
      this.contextEl = this.canvasEl.nativeElement.getContext('2d')!;
      console.log("this.data=>",this.data);
      if(this.data){
        this.data.lminTop = this.data.lminTop ? parseInt(this.data.lminTop ) : 700;
        this.data.lminEnd = this.data.lminEnd ? parseInt(this.data.lminEnd ) : 500;
        this.updateDrawings();
        parseInt(this.data.sr1_location ) ? this.tableData.push({ id: 1, name: 'SR1 Location',field:'sr1_location', val: this.data.sr1_location}):this.tableData.push({ id: 1, name: 'SR1 Location',field:'sr1_location', val: 0})
        parseInt(this.data.sr2_location ) ? this.tableData.push({ id: 2, name: 'SR2 Location',field:'sr2_location', val: this.data.sr2_location -this.data.sr1_location }):this.tableData.push({ id: 2, name: 'SR2 Location',field:'sr2_location', val: 0 })
        parseInt(this.data.sr3_location ) ? this.tableData.push({ id: 3, name: 'SR3 Location',field:'sr3_location', val: this.data.sr3_location - this.data.sr2_location}):this.tableData.push({ id: 3, name: 'SR3 Location',field:'sr3_location', val: 0})
        parseInt(this.data.sr4_location ) ? this.tableData.push({ id: 4, name: 'SR4 Location',field:'sr4_location', val: this.data.sr4_location - this.data.sr3_location}):this.tableData.push({ id: 4, name: 'SR4 Location',field:'sr4_location', val: 0})
        parseInt(this.data.sr5_location ) ? this.tableData.push({ id: 5, name: 'SR5 Location',field:'sr5_location', val: this.data.sr5_location - this.data.sr4_location}):this.tableData.push({ id: 5, name: 'SR5 Location',field:'sr5_location', val: 0})

      }
    }
  dismissModal(){
    this.modal.dismiss("User closed modal!");
  }
  updateNewFields(){
    this.selectedData.rings_start=this.data.rings_start;
    this.selectedData.no_of_sr=this.data.no_of_sr;
    this.setStiffenerRingsBasedOnEqualDevision(this.selectedData.no_of_sr,this.selectedData);
    // this.data = this.selectedData;
    this.setStiffenerRingsBasedOnEqualDevision(this.data.no_of_sr,this.data);
    // this.setValuesToZeroDepensOnSR(this.data.no_of_sr,this.tableData);
  }
  updateData(){
    this.sendData = {
      CustomerCode:this.data.CustomerCode,
      ProjectCode:this.data.ProjectCode,
      Template:this.data.Template,
      JobId:this.data.JobID,
      CageId:this.data.cage_id,
      Sr1Location:this.data.sr1_location,
      Sr2Location:this.data.sr2_location,
      Sr3Location:this.data.no_of_sr >=3 ? this.data.sr3_location : 0,
      Sr4Location:this.data.no_of_sr >=4 ? this.data.sr4_location : 0,
      Sr5Location:this.data.no_of_sr ==5 ? this.data.sr5_location : 0,
      NoOfSr:this.data.no_of_sr,
      LminTop:this.data.lminTop,
      LminEnd:this.data.lminEnd,
      rings_start:this.data.rings_start,
      no_of_sr:this.data.no_of_sr,
    };
    this.orderService.updateStiffenerRing(this.sendData).subscribe({
      next:(response: any) => {
        console.log("updateStiffenerRing",response);
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      },
      complete: () => {
        console.log('Fetching posts complete');
        this.modal.close("User closed modal!");
      }

    });
    console.log("this.sendData=>",this.sendData);
  }
  updateDrawings(){

      var lCageLength = this.data.cage_length;
      var lLapLength = this.data.lap_length;
      var lEndLength = this.data.end_length;
      var lSLType = this.data.spiral_link_type;
      var lSLGrade = this.data.spiral_link_grade;
      var lSLDia = this.data.spiral_link_dia;
      var lSLSpacing = this.data.spiral_link_spacing;
      var lCouplerTop = this.data.coupler_top;
      var lCouplerEnd = this.data.coupler_end;
      var lMainBarShape = this.data.main_bar_shape;
      var lSL1Length = this.data.sl1_length;
      var lSL2Length = this.data.sl2_length;
      var lSL3Length = this.data.sl3_length;
      var lSL1Dia = this.data.sl1_dia;
      var lSL2Dia = this.data.sl2_dia;
      var lSL3Dia = this.data.sl3_dia;
      var l2LayerLen = this.data.mainbar_length_2layer;
      var l2LayerPos = this.data.mainbar_location_2layer;
      var lPileType = this.data.pile_type;


      this.gMinTop = this.data.lminTop;
      this.gMinEnd = this.data.lminEnd;
      this.drawElevView(
        this.contextEl,
        lCageLength,
        lLapLength,
        lEndLength,
        lSLType,
        lSLGrade,
        lSLDia,
        lSLSpacing,
        lCouplerTop,
        lCouplerEnd,
        lMainBarShape,
        lSL1Length,
        lSL2Length,
        lSL3Length,
        lSL1Dia,
        lSL2Dia,
        lSL3Dia,
        l2LayerLen,
        l2LayerPos,
        lPileType,
        this.data.rings_start,
        this.data.rings_end,
        this.data.no_of_cr_top,
        this.data.no_of_cr_end,
        this.data.lminTop,
        this.data.lminEnd
      );

      this.drawStiffenerRing(
        this.contextEl,
        lLapLength,
        lEndLength,
        lCageLength,
        this.data.no_of_sr,
        this.data.sr_grade,
        this.data.sr_dia,
        this.data.sr1_location,
        this.data.sr2_location,
        this.data.sr3_location,
        this.data.sr4_location,
        this.data.sr5_location,
        this.data.main_bar_shape,
        lPileType,
        this.data.extra_support_bar_ind,
        this.data.extra_support_bar_dia,
        this.data.extra_cr_no,
        this.data.mainbar_length_2layer,
        this.data.main_bar_type,
        this.data.main_bar_arrange
      );

      if (lPileType != 'Micro-Pile') {
        this.drawCircularRing(
          this.contextEl,
          lLapLength,
          lEndLength,
          lCageLength,
          this.data.no_of_cr_top,
          this.data.no_of_cr_end,
          this.data.cr_spacing_top,
          this.data.cr_spacing_end,
          this.data.main_bar_shape,
          this.data.spiral_link_type,
          this.data.cr_end_remarks,
          this.data.extra_cr_no,
          this.data.extra_cr_loc,
          this.data.extra_cr_dia,
          this.data.rings_start,
          this.data.rings_end,
          this.data.cr_posn_top,
          this.data.cr_posn_end,
          this.data.cr_top_remarks,
          this.data.lminTop,
          this.data.lminEnd
        );
      }

      this.drawAdditionalRings(
        this.contextEl,
        this.data.no_of_sr,
        lLapLength,
        lEndLength,
        lCageLength,
        this.data.rings_start,
        this.data.rings_end,
        this.data.rings_addn_member,
        this.data.rings_addn_no
      );

      this.drawCrankHeight(
        this.contextEl,
        lLapLength,
        lEndLength,
        lCageLength,
        this.data.main_bar_shape,
        this.data.crank_height_top,
        this.data.crank_height_end
      );

  }
  getFieldObjectWithCumulativeValue(tableData: any[], targetField: string): any | null {
    let total = 0;

    for (const row of tableData) {
      total += parseInt(row.val);
      if (row.field === targetField) {
        return {
          ...row,
          cumulative: total
        };
      }
    }

    return null; // targetField not found
  }

  computeCumulativeFromTable(tableData: any[]){
    const result: any[] = [];
    const tableDataCopy = [...tableData]; // Use the passed argument, not `this.tableData`

    for (let i = 0; i < tableDataCopy.length; i++) {
      const currentRow = { ...tableDataCopy[i] }; // Create a shallow copy of the row
      if (i > 0) {
        currentRow.val += result[i - 1].val; // Accumulate with previous result
        console.log("currentRow.val=>",currentRow.val);
        console.log("tableDataCopy[i].field=>",tableDataCopy[i].field);
        this.data[tableDataCopy[i].field] = currentRow.val; // Update the data object
      }else{
        this.data[tableDataCopy[i].field] = currentRow.val;
      }

      result.push(currentRow);
    }

    this.updateDrawings();
  }


  updateValue(event: any, index: number, field: string, inputEl: HTMLInputElement): void {
    const newValue = parseInt(event.target.value);
    const originalValue = this.tableData[index]['val'];
    const cageLength = parseInt(this.selectedData.cage_length);

    if (isNaN(newValue)) {
      inputEl.value = originalValue;
      return;
    }

    // Clamp individual cell value to cage length
    if (newValue > cageLength) {
      alert("Value should be less than cage length");
      this.tableData[index]['val'] = cageLength;
      inputEl.value = cageLength.toString();
      return;
    }

    this.tableData[index]['val'] = newValue;

    const total = this.tableData.reduce((sum:any, row:any) => sum + parseInt(row.val || 0), 0);

    // If total exceeds cageLength, revert this update
    if (total > cageLength) {
      alert("Total value should not exceed cage length");
      this.tableData[index]['val'] = originalValue;
      inputEl.value = originalValue.toString();
      setTimeout(() => inputEl.focus(), 0);
      return;
    }

    const updatedValue = this.tableData[index]['val'];
    const changedValue = originalValue - updatedValue;

    // Field mapping for logic application
    const relevantFields = ['sr1_location', 'sr2_location', 'sr3_location', 'sr4_location'];

    if (relevantFields.includes(field)) {
      const hasNext = index + 1 < this.tableData.length;

      // Refresh selectedData reference
      this.data = { ...this.selectedData };

      // Decide whether to propagate the change to the next row
      let shouldPropagate = false;

      switch (field) {
        case 'sr1_location':
        case 'sr2_location':
          shouldPropagate = true;
          break;
        case 'sr3_location':
          shouldPropagate = this.data.sr4_location !== 0;
          break;
        case 'sr4_location':
          shouldPropagate = this.data.sr5_location !== 0;
          break;
      }

      if (shouldPropagate && hasNext) {
        this.tableData[index + 1]['val'] += changedValue;
      }
    }

    // Final update after changes
    this.computeCumulativeFromTable(this.tableData);
  }

  updateValueStartEnd(event: any,val:string) {
    if(val == 'start'){
      this.data.lminTop = parseInt(event.value);
    }else{
      this.data.lminEnd = parseInt(event.value);
    }
    // this.updateDrawings();
  }
  drawElevView(
    ctx: any,
    pCageLength: any,
    pLapLength: any,
    pEndLength: any,
    pSLType: any,
    pSLGrade: any,
    pSLDia: any,
    pSLSpacing: any,
    pCouplerTop: any,
    pCouplerEnd: any,
    pMainBarShape: any,
    pSL1Length: any,
    pSL2Length: any,
    pSL3Length: any,
    pSL1Dia: any,
    pSL2Dia: any,
    pSL3Dia: any,
    p2LayerLength: any,
    p2LayerLoc: any,
    pPileType: any,
    pStartRings: any,
    pEndRings: any,
    pCRTopNo: any,
    pCTEndNo: any,
    pMinTop:any,
    pMinEnd:any,
  ) {
    console.log('drawElevView=>', pPileType);
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lMinTop = pMinTop;
    var lMinEnd = pMinEnd;
    var lSRTop = 0;
    var lSREnd = 0;
    var lSLPosY = lCanvasHeight - 10;

    if (pPileType == 'Micro-Pile') {
      lMinTop = 100;
      lMinEnd = 100;
    }

    var lLapLengthReal = pLapLength;
    if (lLapLengthReal < lMinTop) {
      lLapLengthReal = lMinTop;
      lSRTop = Math.floor(
        (lLapLengthReal - pLapLength) /
          parseInt(pSLSpacing.toString().split(',')[0])
      );
    }
    var lEndLengthReal = pEndLength;
    if (lEndLengthReal < lMinEnd) {
      lEndLengthReal = lMinEnd;
      lSREnd = Math.floor(
        (lEndLengthReal - pEndLength) /
          parseInt(
            pSLSpacing.toString().split(',')[
              pSLSpacing.toString().split(',').length - 1
            ]
          )
      );
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / pCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / pCageLength; //150;
    //if (lTopLength < 100) {
    lTopLength = 100;
    //}
    //if (lEndLength < 100) {
    lEndLength = 100;
    //}
    var lCrankHeight = 5;
    var lCrankWidth = 10;



    var lSLSpacing =
      (lCanvasWidth -
        lTopLength -
        lEndLength -
        lLeftRightMargin -
        lLeftRightMargin +
        lCrankWidth +
        lCrankWidth) /
      20;

    var lSL1Length = parseInt(pSL1Length);
    var lSL2Length = parseInt(pSL2Length);
    var lSL3Length = parseInt(pSL3Length);

    var lChangePoint1 = 0;
    var lChangePoint2 = 0;

    // Clear Elevation View
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.rect(0, 0, lCanvasWidth, lCanvasHeight);
    ctx.fill();

    //Top/End
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Verdana';
    this.lText = 'TOP';
    ctx.fillText(
      this.lText,
      -lCanvasHeight / 2 - ctx.measureText(this.lText).width / 2,
      this.gLeftRightMargin
    );

    this.lText = 'END';
    ctx.fillText(
      this.lText,
      -lCanvasHeight / 2 - ctx.measureText(this.lText).width / 2,
      lCanvasWidth - this.gLeftRightMargin + 12
    );
    ctx.restore();

    // Main Bar line
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0000B0';
    // this.data.main_bar_type == 'Mixed' && (this.data.pile_type != 'Single-Layer' || this.data.main_bar_arrange != 'Single')
    if (pMainBarShape == 'Straight') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 14);
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(ctx, lLeftRightMargin, lTopHeight, 21, 'Top');
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 21);
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21,
          'End'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21,
          'End'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      }
    } else if (pMainBarShape == 'Crank-Top' || pMainBarShape == 'Crank') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight - lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lCanvasHeight - lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 14);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 21);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21,
          'End'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21,
          'End'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      }
    } else if (pMainBarShape == 'Crank-End') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight);
      ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin, lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 14);
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(ctx, lLeftRightMargin, lTopHeight, 21, 'Top');
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21
        );
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 21);
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }
    } else if (pMainBarShape == 'Crank-Both') {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lTopHeight);
      ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin, lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lCrankHeight
      );
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight + lCrankHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight - lCrankHeight);
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(lLeftRightMargin + lTopLength, lCanvasHeight - lTopHeight);
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight - lCrankHeight
      );
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 14);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight + lCrankHeight, 21);
        // Coupler
        this.drawStudStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight + lCrankHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight - lCrankHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21,
          'Top'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21,
          'Top'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight + lCrankHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight - lCrankHeight,
          21
        );
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - lTopHeight);
      ctx.stroke();

      if (
        pCouplerTop == 'Nsplice-Standard-Coupler' ||
        pCouplerTop == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerTop == 'Nsplice-Standard-Stud' ||
        pCouplerTop == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 14);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 14);
      } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(ctx, lLeftRightMargin, lTopHeight, 21, 'Top');
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21,
          'Top'
        );
      } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawCouplerStd(
          ctx,
          lLeftRightMargin,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerTop == 'Nsplice-Extended-Stud' ||
        pCouplerTop == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lTopHeight, 21);
        // Coupler
        this.drawStudStd(ctx, lLeftRightMargin, lCanvasHeight - lTopHeight, 21);
      }

      if (
        pCouplerEnd == 'Nsplice-Standard-Coupler' ||
        pCouplerEnd == 'Esplice-Standard-Coupler'
      ) {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (
        pCouplerEnd == 'Nsplice-Standard-Stud' ||
        pCouplerEnd == 'Esplice-Standard-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lTopHeight,
          14
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 14,
          lCanvasHeight - lTopHeight,
          14
        );
      } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21,
          'End'
        );
        // Coupler
        this.drawCouplerExtN(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21,
          'End'
        );
      } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawCouplerStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
        // Main Bar
      } else if (
        pCouplerEnd == 'Nsplice-Extended-Stud' ||
        pCouplerEnd == 'Esplice-Extended-Stud'
      ) {
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lTopHeight,
          21
        );
        // Coupler
        this.drawStudStd(
          ctx,
          lCanvasWidth - lLeftRightMargin - 21,
          lCanvasHeight - lTopHeight,
          21
        );
      }
    }

    //Spiral Link
    if (pSLType == '1 Spacing') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing,
          lCanvasHeight - lTopHeight + 3
        );
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == '2 Spacing') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      var lChangePoint = 0;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == '3 Spacing') {
      var lCentralPoint1 =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        3;
      var lCentralPoint2 =
        (2 *
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth)) /
        3;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      this.lSpacingReal3 = parseInt(lSpaceRealArr[2]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      var lSLSpacing3 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#800080';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin 1 Spacing') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing,
          lCanvasHeight - lTopHeight + 3
        );
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //Second Spiral Link
      ctx.beginPath();
      //ctx.moveTo(lLeftRightMargin + lTopLength - lCrankWidth + 2, lTopHeight + lSLTopCrank - 3);
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );

      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing + 2,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing + 2,
          lCanvasHeight - lTopHeight + 3
        );
      }

      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin 2 Spacing') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //Second Spiral Link
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin 3 Spacing') {
      var lCentralPoint1 =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        3;
      var lCentralPoint2 =
        (2 *
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth)) /
        3;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      this.lSpacingReal3 = parseInt(lSpaceRealArr[2]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      var lSLSpacing3 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          10;
        lSLSpacing3 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          3 /
          16;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#800080';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 10 * lSLSpacing1 + 15 * lSLSpacing2;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint1 + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint2 =
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 9 * lSLSpacing2;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint2 + i * lSLSpacing3,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //second spiral link
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#800080';
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );

      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              i * lSLSpacing2 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin +
            lTopLength +
            10 * lSLSpacing1 +
            15 * lSLSpacing2 +
            2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              i * lSLSpacing3 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#008040';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              i * lSLSpacing2 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint1 +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff8080';
        ctx.moveTo(
          lLeftRightMargin +
            lTopLength +
            15 * lSLSpacing1 +
            9 * lSLSpacing2 +
            2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              i * lSLSpacing3 +
              2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint2 +
              (i + 1) * lSLSpacing3 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //for Crank end
      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Single-Twin') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      var lChangePoint = 0;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      //Second Spiral Link
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1 + 2,
          lCanvasHeight - lTopHeight + 3
        );
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2 +
              2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
    } else if (pSLType == 'Twin-Single') {
      var lCentralPoint =
        (lCanvasWidth -
          lTopLength -
          lEndLength -
          lLeftRightMargin -
          lLeftRightMargin +
          lCrankWidth +
          lCrankWidth) /
        2;
      var lSpaceRealArr = pSLSpacing.toString().split(',');
      this.lSpacingReal1 = parseInt(lSpaceRealArr[0]);
      this.lSpacingReal2 = parseInt(lSpaceRealArr[1]);
      var lSLSpacing1 = 0;
      var lSLSpacing2 = 0;
      if (this.lSpacingReal1 > this.lSpacingReal2) {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
      } else {
        lSLSpacing1 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          16;
        lSLSpacing2 =
          (lCanvasWidth -
            lTopLength -
            lEndLength -
            lLeftRightMargin -
            lLeftRightMargin +
            lCrankWidth +
            lCrankWidth) /
          2 /
          10;
      }

      var lChangePoint = 0;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      if (pStartRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 8,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 6,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth - 2,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }
      if (pStartRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lTopHeight + lSLTopCrank - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength - lCrankWidth,
          lCanvasHeight - lTopHeight - lSLTopCrank + 3
        );
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 9 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 9 * lSLSpacing1;

        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#800080';
        ctx.moveTo(
          lLeftRightMargin + lTopLength + 15 * lSLSpacing1,
          lCanvasHeight - lTopHeight + 3
        );

        lChangePoint1 = lLeftRightMargin + lTopLength + 15 * lSLSpacing1;

        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + lCentralPoint + i * lSLSpacing2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lTopLength +
              lCentralPoint +
              (i + 1) * lSLSpacing2,
            lCanvasHeight - lTopHeight + 3
          );
        }
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();

      if (pEndRings >= 1) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 2) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 3) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 4 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 4) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 6 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }
      if (pEndRings >= 5) {
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lCanvasHeight - lTopHeight - lSLEndCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth - lEndLength - lLeftRightMargin + 8 + lCrankWidth,
          lTopHeight + lSLEndCrank - 3
        );
        ctx.stroke();
      }

      //Second Spiral Link
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth + 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      if (lSLSpacing1 > lSLSpacing2) {
        for (let i = 0; i < 10; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
      } else {
        for (let i = 0; i < 16; i += 2) {
          ctx.lineTo(
            lLeftRightMargin + lTopLength + i * lSLSpacing1 + 2,
            lTopHeight - 3
          );
          ctx.lineTo(
            lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing1 + 2,
            lCanvasHeight - lTopHeight + 3
          );
        }
        ctx.stroke();
      }
      //ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 2, lTopHeight + lSLEndCrank - 3);
      //ctx.stroke();

      //    ctx.beginPath();
      //    ctx.moveTo(lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth, lCanvasHeight - lTopHeight - lSLEndCrank + 3);
      //    ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth, lTopHeight + lSLEndCrank - 3);
      //    ctx.stroke();
      //    ctx.beginPath();
      //    ctx.moveTo(lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth, lCanvasHeight - lTopHeight - lSLEndCrank + 3);
      //    ctx.lineTo(lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth, lTopHeight + lSLEndCrank - 3);
      //    ctx.stroke();
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#008040';
      var lSLTopCrank = 0;
      var lSLEndCrank = 0;
      if (
        pMainBarShape == 'Crank-Top' ||
        pMainBarShape == 'Crank' ||
        pMainBarShape == 'Crank-Both'
      ) {
        lSLTopCrank = lCrankHeight;
      }
      if (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both') {
        lSLEndCrank = lCrankHeight;
      }

      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lTopHeight + lSLTopCrank - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 2,
        lTopHeight + lSLTopCrank - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 2,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lTopHeight + lSLTopCrank - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth,
        lCanvasHeight - lTopHeight - lSLTopCrank + 3
      );

      for (let i = 0; i < 20; i += 2) {
        ctx.lineTo(
          lLeftRightMargin + lTopLength + i * lSLSpacing,
          lTopHeight - 3
        );
        ctx.lineTo(
          lLeftRightMargin + lTopLength + (i + 1) * lSLSpacing,
          lCanvasHeight - lTopHeight + 3
        );
      }
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight - lSLEndCrank + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lTopHeight + lSLEndCrank - 3
      );
      ctx.stroke();
    }

    //Dimensions
    //1.Spiral Links
    if (pSLType == '1 Spacing' || pSLType == 'Twin 1 Spacing') {
      //Dimension
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      // vertical line2
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pLapLength >= lMinTop && pCRTopNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'Lap Length';
        ctx.fillText(
          this.lText,
          lLeftRightMargin +
            (lTopLength - lCrankWidth - 4) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line1
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lSLPosY,
        lLapLengthReal
      );

      // vertical line3
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      if (pSLType.indexOf('Twin') >= 0) {
        this.lText = 'Spiral Link - 2' + pSLGrade + pSLDia + ' - ' + pSLSpacing;
      } else {
        this.lText = 'Spiral Link - ' + pSLGrade + pSLDia + ' - ' + pSLSpacing;
      }
      ctx.fillText(
        this.lText,
        (lCanvasWidth + lTopLength - lEndLength) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line2
      this.lText =
        parseInt(pCageLength) -
        parseInt(lLapLengthReal) -
        parseInt(lEndLengthReal);
      this.drawHorDim(
        ctx,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lSLPosY,
        this.lText
      );

      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pEndLength >= lMinEnd && pCTEndNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'End Length';
        ctx.fillText(
          this.lText,
          lCanvasWidth -
            lLeftRightMargin -
            (lEndLength - 2 - lCrankWidth) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line3
      this.drawHorDim(
        ctx,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasWidth - lLeftRightMargin,
        lSLPosY,
        lEndLengthReal
      );
    } else if (
      pSLType == '2 Spacing' ||
      pSLType == 'Twin 2 Spacing' ||
      pSLType == 'Single-Twin' ||
      pSLType == 'Twin-Single'
    ) {
      //Dimension
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      // vertical line2
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pLapLength >= lMinTop && pCRTopNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'Lap Length';
        ctx.fillText(
          this.lText,
          lLeftRightMargin +
            (lTopLength - lCrankWidth - 4) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line1
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lSLPosY,
        lLapLengthReal
      );

      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lChangePoint1, lCanvasHeight - 3);
      ctx.lineTo(lChangePoint1, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '1st Spiral Link - ' + pSLGrade + pSL1Dia + ' - ' + this.lSpacingReal1;
      if (pSLType == 'Twin 2 Spacing' || pSLType == 'Twin-Single') {
        this.lText =
          '1st Spiral Link - 2' +
          pSLGrade +
          pSL1Dia +
          ' - ' +
          this.lSpacingReal1;
      }
      ctx.fillText(
        this.lText,
        (lLeftRightMargin + lTopLength - lCrankWidth - 4 + lChangePoint1) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line2
      this.lText = lSL1Length;
      this.drawHorDim(
        ctx,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lChangePoint1,
        lSLPosY,
        this.lText
      );

      // vertical line4
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '2nd Spiral Link - ' + pSLGrade + pSL2Dia + ' - ' + this.lSpacingReal2;
      if (pSLType == 'Twin 2 Spacing' || pSLType == 'Single-Twin') {
        this.lText =
          '2nd Spiral Link - 2' +
          pSLGrade +
          pSL2Dia +
          ' - ' +
          this.lSpacingReal2;
      }
      ctx.fillText(
        this.lText,
        (lChangePoint1 +
          lCanvasWidth -
          lEndLength -
          lLeftRightMargin +
          2 +
          lCrankWidth) /
          2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line3
      this.lText = lSL2Length;
      this.drawHorDim(
        ctx,
        lChangePoint1,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lSLPosY,
        this.lText
      );

      // vertical line5
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pEndLength >= lMinEnd && pCTEndNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'End Length';
        ctx.fillText(
          this.lText,
          lCanvasWidth -
            lLeftRightMargin -
            (lEndLength - 2 - lCrankWidth) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line4
      this.drawHorDim(
        ctx,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasWidth - lLeftRightMargin,
        lSLPosY,
        lEndLengthReal
      );
    } else if (pSLType == '3 Spacing' || pSLType == 'Twin 3 Spacing') {
      //Dimension
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      // vertical line2
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pLapLength >= lMinTop && pCRTopNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'Lap Length';
        ctx.fillText(
          this.lText,
          lLeftRightMargin +
            (lTopLength - lCrankWidth - 4) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line1
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lSLPosY,
        lLapLengthReal
      );

      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lChangePoint1, lCanvasHeight - 3);
      ctx.lineTo(lChangePoint1, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '1st Spiral Link - ' + pSLGrade + pSL1Dia + ' - ' + this.lSpacingReal1;
      ctx.fillText(
        this.lText,
        (lLeftRightMargin + lTopLength - lCrankWidth - 4 + lChangePoint1) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line2
      this.lText = lSL1Length;
      this.drawHorDim(
        ctx,
        lLeftRightMargin + lTopLength - lCrankWidth - 4,
        lChangePoint1,
        lSLPosY,
        this.lText
      );

      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lChangePoint2, lCanvasHeight - 3);
      ctx.lineTo(lChangePoint2, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '2nd Spiral Link - ' + pSLGrade + pSL2Dia + ' - ' + this.lSpacingReal2;
      ctx.fillText(
        this.lText,
        lChangePoint1 +
          (lChangePoint2 - lChangePoint1) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line3
      this.lText = lSL2Length;
      this.drawHorDim(ctx, lChangePoint1, lChangePoint2, lSLPosY, this.lText);

      // vertical line5
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        '3rd Spiral Link - ' + pSLGrade + pSL3Dia + ' - ' + this.lSpacingReal3;
      ctx.fillText(
        this.lText,
        (lChangePoint2 +
          lCanvasWidth -
          lEndLength -
          lLeftRightMargin +
          2 +
          lCrankWidth) /
          2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 27
      );

      //Horizontal line4
      this.lText = lSL3Length;
      this.drawHorDim(
        ctx,
        lChangePoint2,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lSLPosY,
        this.lText
      );

      // vertical line6
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lCanvasHeight - 3);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();

      if (pEndLength >= lMinEnd && pCTEndNo == 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        this.lText = 'End Length';
        ctx.fillText(
          this.lText,
          lCanvasWidth -
            lLeftRightMargin -
            (lEndLength - 2 - lCrankWidth) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + 27
        );
      }

      //Horizontal line5
      this.drawHorDim(
        ctx,
        lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth,
        lCanvasWidth - lLeftRightMargin,
        lSLPosY,
        lEndLengthReal
      );
    }
    //end if Spiral Link dimension

    //Dimensions
    //2.Cage Length
    // Added p2LayerLength and p2LayerLoc in dimensions

    this.secondMainBarLayerObj = null;
    if (p2LayerLength != pCageLength && p2LayerLength > 0) {
      //draw second layer dimesions
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // Left vertical line
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight - 5);
      ctx.lineTo(lLeftRightMargin, 3);
      ctx.stroke();

      //left arrow
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin + 5, 10 - 2.5);
      ctx.lineTo(lLeftRightMargin, 10);
      ctx.lineTo(lLeftRightMargin + 5, 10 + 2.5);
      ctx.stroke();

      if (p2LayerLoc == 0) {
        var lMiddlePos =
          (p2LayerLength / pCageLength) * lCanvasWidth - lLeftRightMargin;

        if (pCageLength - p2LayerLength - p2LayerLoc == pEndLength) {
          lMiddlePos =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        }
        if (pCageLength - p2LayerLength - p2LayerLoc == lMinEnd) {
          lMiddlePos =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        } else if (
          (pCageLength - p2LayerLength - p2LayerLoc < pEndLength &&
            pEndLength >= lMinEnd) ||
          (pCageLength - p2LayerLength - p2LayerLoc < lMinEnd &&
            lMinEnd >= pEndLength)
        ) {
          lMiddlePos =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth + 10;
        } else {
          if (
            lMiddlePos >
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth - 50
          ) {
            lMiddlePos =
              lCanvasWidth -
              lEndLength -
              lLeftRightMargin +
              2 +
              lCrankWidth -
              50;
          }
        }

        //1st Left Hor line
        ctx.beginPath();
        ctx.moveTo(lLeftRightMargin, 10);
        ctx.lineTo(lMiddlePos / 2 - 100, 10);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        var lCLText = '2nd Layer Bar Length ';
        var lVar1 = ctx.measureText(lCLText).width;
        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l2CageLength = p2LayerLength + ' mm';
        var lVar2 = ctx.measureText(l2CageLength).width;

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        ctx.fillText(lCLText, lMiddlePos / 2 - (lVar2 + lVar1) / 2, 15);

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l2CageLength,
          lMiddlePos / 2 - (lVar1 + lVar2) / 2 + lVar1,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos, 3);
        ctx.stroke();

        this.createNewLine(ctx,lLeftRightMargin,lMiddlePos,60)

        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos / 2 + 100, 10);
        ctx.stroke();

        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos - 5, 10 + 2.5);
        ctx.stroke();

        // Right side
        // Last Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 - 30,
          10
        );
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos + 5, 10 + 2.5);
        ctx.stroke();

        //Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 + 30,
          10
        );
        ctx.stroke();

        //Right arrow
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
        ctx.stroke();

        // Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = pCageLength - p2LayerLength + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lMiddlePos +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 -
            lVar2 / 2,
          15
        );
      } else if (
        parseInt(p2LayerLength) + parseInt(p2LayerLoc) ==
        parseInt(pCageLength)
      ) {
        // Right alignment
        var lMiddlePos =
          (p2LayerLoc / pCageLength) * lCanvasWidth - lLeftRightMargin;
        if (pCageLength - p2LayerLength == pLapLength) {
          lMiddlePos = lLeftRightMargin + lTopLength - lCrankWidth - 4;
        } else if (pCageLength - p2LayerLength < pLapLength) {
          lMiddlePos = lLeftRightMargin + lTopLength - lCrankWidth - 4 - 10;
        } else {
          if (lMiddlePos < lLeftRightMargin + lTopLength + 100) {
            lMiddlePos = lLeftRightMargin + lTopLength + 100;
          }
        }

        //1st Left Hor line
        ctx.beginPath();
        ctx.moveTo(lLeftRightMargin, 10);
        ctx.lineTo(lLeftRightMargin + lMiddlePos / 2 - 20, 10);
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = p2LayerLoc + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lLeftRightMargin + lMiddlePos / 2 - lVar2 / 2,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos, 3);
        ctx.stroke();



        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(lLeftRightMargin + lMiddlePos / 2 + 20, 10);
        ctx.stroke();

        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos - 5, 10 + 2.5);
        ctx.stroke();

        // Right side
        // Last Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 - 100,
          10
        );
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos, 10);
        ctx.lineTo(lMiddlePos + 5, 10 + 2.5);
        ctx.stroke();

        //Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(
          lMiddlePos + (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 + 100,
          10
        );
        ctx.stroke();
        this.createNewLine(ctx,lMiddlePos,lCanvasWidth - lLeftRightMargin,60)
        //Right arrow
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
        ctx.stroke();

        // Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        var lCLText = '2nd Layer Bar Length ';
        var lVar1 = ctx.measureText(lCLText).width;
        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l2CageLength = p2LayerLength + ' mm';
        var lVar2 = ctx.measureText(l2CageLength).width;

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        ctx.fillText(
          lCLText,
          lMiddlePos +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 -
            (lVar2 + lVar1) / 2,
          15
        );

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l2CageLength,
          lMiddlePos +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos) / 2 -
            (lVar1 + lVar2) / 2 +
            lVar1,
          15
        );
      } else {
        // Right alignment
        var lMiddlePos1 =
          (p2LayerLoc / pCageLength) * lCanvasWidth - lLeftRightMargin;
        if (p2LayerLoc == pLapLength) {
          lMiddlePos1 = lLeftRightMargin + lTopLength - lCrankWidth - 4;
        } else if (p2LayerLoc < pLapLength) {
          lMiddlePos1 = lLeftRightMargin + lTopLength - lCrankWidth - 4 - 10;
        } else {
          if (lMiddlePos1 < lLeftRightMargin + lTopLength + 100) {
            lMiddlePos1 = lLeftRightMargin + lTopLength + 100;
          }
        }

        var lMiddlePos2 =
          ((p2LayerLoc + p2LayerLength) / pCageLength) * lCanvasWidth -
          lLeftRightMargin;
        if (pCageLength - p2LayerLength - p2LayerLoc == pEndLength) {
          lMiddlePos2 =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        }
        if (pCageLength - p2LayerLength - p2LayerLoc == lMinEnd) {
          lMiddlePos2 =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth;
        } else if (
          (pCageLength - p2LayerLength - p2LayerLoc < pEndLength &&
            pEndLength >= lMinEnd) ||
          (pCageLength - p2LayerLength - p2LayerLoc < lMinEnd &&
            lMinEnd >= pEndLength)
        ) {
          lMiddlePos2 =
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth + 10;
        } else {
          if (
            lMiddlePos2 >
            lCanvasWidth - lEndLength - lLeftRightMargin + 2 + lCrankWidth - 50
          ) {
            lMiddlePos2 =
              lCanvasWidth -
              lEndLength -
              lLeftRightMargin +
              2 +
              lCrankWidth -
              50;
          }
        }

        //1st Left Hor line
        ctx.beginPath();
        ctx.moveTo(lLeftRightMargin, 10);
        ctx.lineTo(
          lLeftRightMargin + (lMiddlePos1 - lLeftRightMargin) / 2 - 20,
          10
        );
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = p2LayerLoc + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lLeftRightMargin + (lMiddlePos1 - lLeftRightMargin) / 2 - lVar2 / 2,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos1, 3);
        ctx.stroke();

        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1, 10);
        ctx.lineTo(
          lLeftRightMargin + (lMiddlePos1 - lLeftRightMargin) / 2 + 20,
          10
        );
        ctx.stroke();

        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1 - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos1, 10);
        ctx.lineTo(lMiddlePos1 - 5, 10 + 2.5);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1, 10);
        ctx.lineTo(lMiddlePos1 + (lMiddlePos2 - lMiddlePos1) / 2 - 100, 10);
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos1 + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos1, 10);
        ctx.lineTo(lMiddlePos1 + 5, 10 + 2.5);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        var lCLText = '2nd Layer Bar Length ';
        var lVar1 = ctx.measureText(lCLText).width;
        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l2CageLength = p2LayerLength + ' mm';
        var lVar2 = ctx.measureText(l2CageLength).width;

        ctx.fillStyle = '#000000';
        ctx.font = '10px Verdana';
        ctx.fillText(
          lCLText,
          lMiddlePos1 + (lMiddlePos2 - lMiddlePos1) / 2 - (lVar2 + lVar1) / 2,
          15
        );

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l2CageLength,
          lMiddlePos1 +
            (lMiddlePos2 - lMiddlePos1) / 2 -
            (lVar1 + lVar2) / 2 +
            lVar1,
          15
        );

        // 2nd Middle vertical line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2, (lTopHeight - 5) / 3);
        ctx.lineTo(lMiddlePos2, 3);
        ctx.stroke();

        //2nd Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2, 10);
        ctx.lineTo(lMiddlePos1 + (lMiddlePos2 - lMiddlePos1) / 2 + 100, 10);
        ctx.stroke();
        this.createNewLine(ctx,lMiddlePos1,lMiddlePos2,60);
        //Middle Right arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2 - 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos2, 10);
        ctx.lineTo(lMiddlePos2 - 5, 10 + 2.5);
        ctx.stroke();

        // Right side
        // Last Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        //3rd Left Hor line
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2, 10);
        ctx.lineTo(
          lMiddlePos2 +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos2) / 2 -
            30,
          10
        );
        ctx.stroke();

        //Middle left arrow
        ctx.beginPath();
        ctx.moveTo(lMiddlePos2 + 5, 10 - 2.5);
        ctx.lineTo(lMiddlePos2, 10);
        ctx.lineTo(lMiddlePos2 + 5, 10 + 2.5);
        ctx.stroke();

        //Middle Right Hor line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(
          lMiddlePos2 +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos2) / 2 +
            30,
          10
        );
        ctx.stroke();

        //Right arrow
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
        ctx.stroke();

        // Right vertical line
        ctx.beginPath();
        ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
        ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
        ctx.stroke();

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        var l3CageLength = pCageLength - p2LayerLength - p2LayerLoc + '';
        var lVar2 = ctx.measureText(l3CageLength).width;

        ctx.fillStyle = '#0000ff';
        ctx.font = '12px Verdana';
        ctx.fillText(
          l3CageLength,
          lMiddlePos2 +
            (lCanvasWidth - lLeftRightMargin - lMiddlePos2) / 2 -
            lVar2 / 2,
          15
        );
      }
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // Left vertical line
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lTopHeight - 5);
      ctx.lineTo(lLeftRightMargin, 3);
      ctx.stroke();

      // Right vertical line
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, lTopHeight - 5);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, 3);
      ctx.stroke();

      //Left Hor line
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, 10);
      ctx.lineTo(lCanvasWidth / 2 - 100, 10);
      ctx.stroke();

      //left arrow
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin + 5, 10 - 2.5);
      ctx.lineTo(lLeftRightMargin, 10);
      ctx.lineTo(lLeftRightMargin + 5, 10 + 2.5);
      ctx.stroke();

      //Right Hor line
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin, 10);
      ctx.lineTo(lCanvasWidth / 2 + 100, 10);
      ctx.stroke();

      //Right arrow
      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin - 5, 10 - 2.5);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin, 10);
      ctx.lineTo(lCanvasWidth - lLeftRightMargin - 5, 10 + 2.5);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      var lCLText = 'Cage Length ';
      var lVar1 = ctx.measureText(lCLText).width;
      ctx.fillStyle = '#0000ff';
      ctx.font = '12px Verdana';
      var lCageLength = pCageLength + ' mm';
      var lVar2 = ctx.measureText(lCageLength).width;

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText(lCLText, lCanvasWidth / 2 - (lVar2 + lVar1) / 2, 15);

      ctx.fillStyle = '#0000ff';
      ctx.font = '12px Verdana';
      ctx.fillText(
        lCageLength,
        lCanvasWidth / 2 - (lVar1 + lVar2) / 2 + lVar1,
        15
      );
    }
    // this.drawSecondLayerMainBarLoc(ctx,this.secondMainBarLayerObj);
    //Top Coupler text
    this.lText = '';
    if (pCouplerTop == 'Nsplice-Standard-Coupler') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerTop == 'Esplice-Standard-Coupler') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerTop == 'Nsplice-Standard-Stud') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerTop == 'Esplice-Standard-Stud') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerTop == 'Nsplice-Extended-Coupler') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerTop == 'Esplice-Extended-Coupler') {
      this.lText = 'Esplice Extended';
    } else if (pCouplerTop == 'Nsplice-Extended-Stud') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerTop == 'Esplice-Extended-Stud') {
      this.lText = 'Esplice Extended';
    }

    if (this.lText != '') {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText(this.lText, lLeftRightMargin - 6, lTopHeight + 20);
    }

    //End Coupler text
    this.lText = '';
    if (pCouplerEnd == 'Nsplice-Standard-Coupler') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerEnd == 'Esplice-Standard-Coupler') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerEnd == 'Nsplice-Standard-Stud') {
      this.lText = 'Nsplice Standard';
    } else if (pCouplerEnd == 'Esplice-Standard-Stud') {
      this.lText = 'Esplice Standard';
    } else if (pCouplerEnd == 'Nsplice-Extended-Coupler') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerEnd == 'Esplice-Extended-Coupler') {
      this.lText = 'Esplice Extended';
    } else if (pCouplerEnd == 'Nsplice-Extended-Stud') {
      this.lText = 'Nsplice Extended';
    } else if (pCouplerEnd == 'Esplice-Extended-Stud') {
      this.lText = 'Esplice Extended';
    }

    if (this.lText != '') {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      ctx.fillText(
        this.lText,
        lCanvasWidth - lLeftRightMargin - 80,
        lTopHeight + 20
      );
    }

    //end of cage Length
    //var lRowNo = grid.getActiveCell().row;

    //drawStiffenerRing(lRowNo);

    //drawCircularRing(lRowNo);

    //drawAdditionalRings(lRowNo);

    //drawCrankHeight(lRowNo);
  }
  drawCouplerStd(pCTX: any, pX: any, pY: any, pCouplerLength: any) {
    // Coupler
    pCTX.lineWidth = 7;
    pCTX.strokeStyle = '#000000';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY);
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();
  }
  createNewLine(ctx:any,x1:any,x2:any,y:any){

    this.secondMainBarLayerObj = {
      x1:x1,
      x2:x2,
      y:y,
      color:'#fbff00'
    }
  }

  drawCouplerExtN(
    pCTX: any,
    pX: any,
    pY: any,
    pCouplerLength: any,
    pTopEnd: any
  ) {
    // Clear the
    pCTX.lineWidth = 7;
    pCTX.strokeStyle = '#ffffff';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY);
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();

    if (pTopEnd == 'Top') {
      // Coupler
      pCTX.lineWidth = 7;
      pCTX.strokeStyle = '#000000';
      pCTX.beginPath();
      pCTX.moveTo(pX, pY);
      pCTX.lineTo(pX + (2 * pCouplerLength) / 3, pY);
      pCTX.stroke();

      pCTX.lineWidth = 1;
      pCTX.strokeStyle = '#0000B0';
      pCTX.beginPath();
      pCTX.moveTo(pX + (2 * pCouplerLength) / 3, pY - 2);
      pCTX.lineTo(pX + (2 * pCouplerLength) / 3, pY + 2);
      for (let i = 0; i < Math.floor(pCouplerLength / 3 / 2); i += 2) {
        pCTX.lineTo(pX + (2 * pCouplerLength) / 3 + 2 * i, pY - 2);
        pCTX.lineTo(pX + (2 * pCouplerLength) / 3 + 2 * i + 1, pY + 2);
      }
      pCTX.lineTo(pX + pCouplerLength, pY);
      pCTX.stroke();
    } else {
      // Coupler
      pCTX.lineWidth = 1;
      pCTX.strokeStyle = '#0000B0';
      pCTX.beginPath();
      pCTX.moveTo(pX, pY - 2);
      pCTX.lineTo(pX, pY + 2);
      for (let i = 0; i < Math.floor(pCouplerLength / 3 / 2); i += 2) {
        pCTX.lineTo(pX + 2 * i, pY - 2);
        pCTX.lineTo(pX + 2 * i + 1, pY + 2);
      }
      pCTX.lineTo(pX + pCouplerLength / 3, pY);
      pCTX.stroke();

      pCTX.lineWidth = 7;
      pCTX.strokeStyle = '#000000';
      pCTX.beginPath();
      pCTX.moveTo(pX + pCouplerLength / 3, pY);
      pCTX.lineTo(pX + pCouplerLength, pY);
      pCTX.stroke();
    }
  }

  drawStudStd(pCTX: any, pX: any, pY: any, pCouplerLength: any) {
    // Clear the
    pCTX.lineWidth = 7;
    pCTX.strokeStyle = '#ffffff';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY);
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();

    // draw Coupler stud standard
    pCTX.lineWidth = 1;
    pCTX.strokeStyle = '#0000B0';
    pCTX.beginPath();
    pCTX.moveTo(pX, pY - 2);
    pCTX.lineTo(pX, pY + 2);
    for (let i = 0; i < pCouplerLength / 2; i += 2) {
      pCTX.lineTo(pX + 2 * i, pY - 2);
      pCTX.lineTo(pX + 2 * i + 1, pY + 2);
    }
    pCTX.lineTo(pX + pCouplerLength, pY);
    pCTX.stroke();
  }

  drawHorDim(pCTX: any, pX1: any, pX2: any, pY: any, pValue: any) {
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    pCTX.lineWidth = 1;
    pCTX.strokeStyle = '#ff00ff';
    //Horizontal line2
    pCTX.beginPath();
    pCTX.moveTo(pX1, pY);
    pCTX.lineTo(pX2, pY);
    pCTX.stroke();

    //left arrow
    pCTX.beginPath();
    pCTX.moveTo(pX1 + 5, pY - 2.5);
    pCTX.lineTo(pX1, pY);
    pCTX.lineTo(pX1 + 5, pY + 2.5);
    pCTX.stroke();

    //Right arrow
    pCTX.beginPath();
    pCTX.moveTo(pX2 - 5, pY - 2.5);
    pCTX.lineTo(pX2, pY);
    pCTX.lineTo(pX2 - 5, pY + 2.5);
    pCTX.stroke();

    pCTX.fillStyle = '#0000ff';
    pCTX.font = '12px Verdana';
    pCTX.fillText(
      pValue,
      pX1 + (pX2 - pX1) / 2 - pCTX.measureText(pValue).width / 2,
      pY - 3
    );
  }

  drawStiffenerRing(
    ctx: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pNoOfSR: any,
    pSRGrade: any,
    pSRDia: any,
    pSR1Loc: any,
    pSR2Loc: any,
    pSR3Loc: any,
    pSR4Lo: any,
    pSR5Loc: any,
    pMainBarShape: any,
    pPileType: any,
    pExtraSupport: any,
    pExtraSupportDia: any,
    pExtraCRNo: any,
    mainbar_length_2layer:any,
    main_bar_arrange:any,
    main_bar_type:any
  ) {

    //Dimensions
    //Stiffener Ring
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lSRPosY = lTopHeight / 2 + 9;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    //var data = grid.getDataItem(pRowNo);
    var lNoOfSR = 0;
    var lSRGrade: any = '';
    var lSRDia: any = '';
    var lSR1Loc: any = 0;
    var lSR2Loc: any = 0;
    var lSR3Loc: any = 0;
    var lSR4Loc: any = 0;
    var lSR5Loc: any = 0;
    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;
    var lSRText = 'SR';
    var lSRTextS = 'SR';

    if (pPileType == 'Micro-Pile') {
      lSRText = 'Centralizer';
      lSRTextS = 'CEN';
    }

    var lSBarTxtV = 15;
    if (pExtraCRNo != null && pExtraCRNo > 0) {
      lSBarTxtV = 25;
    }

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }

    if (pNoOfSR != null) {
      lNoOfSR = parseInt(pNoOfSR);
    }
    if (pSRGrade != null) {
      lSRGrade = pSRGrade;
    }
    if (pSRDia != null) {
      lSRDia = parseInt(pSRDia);
    }
    if (pSR1Loc != null) {
      lSR1Loc = parseInt(pSR1Loc);
    }
    if (pSR2Loc != null) {
      lSR2Loc = parseInt(pSR2Loc);
    }
    if (pSR3Loc != null) {
      lSR3Loc = parseInt(pSR3Loc);
    }
    if (pSR4Lo != null) {
      lSR4Loc = parseInt(pSR4Lo);
    }
    if (pSR5Loc != null) {
      lSR5Loc = parseInt(pSR5Loc);
    }

    if (pExtraSupport == null) {
      pExtraSupport = 'None';
    }

    if (pExtraSupportDia == null) {
      pExtraSupportDia = 0;
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }

    lTopLength = 100;
    lEndLength = 100;

    // canvasPV = document.getElementById(pCanvas);
    // ctx = canvasPV.getContext("2d");

    //draw stiffener ring
    ctx.lineWidth = 3;
    //ctx.strokeStyle = "#804000";
    ctx.strokeStyle = '#ac5000';
    // this.mainBarEleArray = [];
    if (lNoOfSR == 1) {
      //draw stiffener ring
      ctx.beginPath();
      ctx.moveTo(
        (lCanvasWidth + lTopLength - lEndLength) / 2,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo((lCanvasWidth + lTopLength - lEndLength) / 2, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        ctx.moveTo(
          (lCanvasWidth + lTopLength - lEndLength) / 2,
          lCanvasHeight / 2
        );
        ctx.arc(
          (lCanvasWidth + lTopLength - lEndLength) / 2,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // Right vertical line
      ctx.beginPath();
      ctx.moveTo((lCanvasWidth + lTopLength - lEndLength) / 2, lTopHeight - 5);
      ctx.lineTo((lCanvasWidth + lTopLength - lEndLength) / 2, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = lSRText;
      ctx.fillText(
        this.lText,
        (lCanvasWidth + lTopLength - lEndLength) / 2 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          (lCanvasWidth + lTopLength - lEndLength) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        (lCanvasWidth + lTopLength - lEndLength) / 2,
        lSRPosY,
        lSR1Loc
      );
      // this.addMainBarArrayElements(lSR1Loc, lLeftRightMargin, (lCanvasWidth + lTopLength - lEndLength) / 2, lSRPosY, '#fbff00');
      // Last line
      //Horizontal line3
      this.lText = lCageLength - lSR1Loc;
      this.drawHorDim(
        ctx,
        (lCanvasWidth + lTopLength - lEndLength) / 2,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText, (lCanvasWidth + lTopLength - lEndLength) / 2, lCanvasWidth - lLeftRightMargin,lSRPosY, '#fbff00');
    } else if (lNoOfSR == 2) {
      var lSR1LocA = lLeftRightMargin + lTopLength + 50;
      if (lSR1Loc < pLapLengthReal) {
        lSR1LocA = lLeftRightMargin + lTopLength - 50;
      }

      var lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
      if (lSR2Loc > lCageLength - pEndLengthReal) {
        lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.beginPath();
      if (
        lSR2Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR2Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lSR1LocA, lTopHeight - 5);
      ctx.lineTo(lSR1LocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRText;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);
      // this.addMainBarArrayElements(lSR1Loc, lLeftRightMargin, lSR1LocA,lSRPosY, '#fbff00');
      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRText;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(ctx, lSR1LocA, lSRLastLocA, lSRPosY, this.lText);
      // this.addMainBarArrayElements(this.lText, lSR1LocA,lSRLastLocA ,lSRPosY, '#fbff00');
      // Last line
      //Horizontal line3
      this.lText = lCageLength - lSR2Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText, lSRLastLocA,lCanvasWidth - lLeftRightMargin ,lSRPosY, '#fbff00');
    } else if (lNoOfSR == 3) {
      var lSR1LocA =
        (lSR1Loc * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength -
        (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength +
        lTopLength;
      if (lSR1LocA < 0) {
        lSR1LocA = 50;
      }

      if (lSR1Loc < (pLapLengthReal < 500 ? 500 : pLapLengthReal)) {
        if (lSR1LocA > lLeftRightMargin + lTopLength - 50) {
          lSR1LocA = lLeftRightMargin + lTopLength - 50;
        }
      } else {
        if (lSR1LocA < lLeftRightMargin + lTopLength + 50) {
          lSR1LocA = lLeftRightMargin + lTopLength + 50;
        }
      }

      var lSRLastLocA =
        lCanvasWidth -
        2 * lLeftRightMargin -
        ((lEndLengthReal < 500 ? 500 : lEndLengthReal) *
          (lCanvasWidth - 2 * lLeftRightMargin)) /
          lCageLength +
        lEndLength;

      if (lSRLastLocA > lCanvasWidth - 2 * lLeftRightMargin) {
        lSRLastLocA = lCanvasWidth - 2 * lLeftRightMargin - 50;
      }

      if (
        lSR3Loc >
        lCageLength - (lEndLengthReal < 500 ? 500 : lEndLengthReal)
      ) {
        if (lSRLastLocA < lCanvasWidth - lLeftRightMargin - lEndLength + 50) {
          lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
        }
      } else {
        if (lSRLastLocA > lCanvasWidth - lLeftRightMargin - lEndLength - 50) {
          lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
        }
      }

      var lSRMiddleLocA =
        (lSR2Loc * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength -
        ((lLapLengthReal < 500 ? 500 : lLapLengthReal) *
          (lCanvasWidth - 2 * lLeftRightMargin)) /
          lCageLength +
        lTopLength;

      if (lSR2Loc < (lLapLengthReal < 500 ? 500 : lLapLengthReal)) {
        if (lSRMiddleLocA > lLeftRightMargin + lTopLength - 50) {
          lSRMiddleLocA = lLeftRightMargin + lTopLength - 50;
        }
      } else {
        if (lSRMiddleLocA < lLeftRightMargin + lTopLength + 50) {
          lSRMiddleLocA = lLeftRightMargin + lTopLength + 50;
        }
      }
      if (
        lSR2Loc >
        lCageLength - (lEndLengthReal < 500 ? 500 : lEndLengthReal)
      ) {
        if (lSRMiddleLocA < lCanvasWidth - lLeftRightMargin - lEndLength + 50) {
          lSRMiddleLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
        }
      } else {
        if (lSRMiddleLocA > lCanvasWidth - lLeftRightMargin - lEndLength - 50) {
          lSRMiddleLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
        }
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(lSRMiddleLocA, lCanvasHeight - lTopHeight);
      ctx.lineTo(lSRMiddleLocA, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        ctx.moveTo(lSRMiddleLocA, lCanvasHeight / 2);
        ctx.arc(lSRMiddleLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR3Loc > lCageLength - lEndLengthReal
      ) {
        ctx.moveTo(lSRMiddleLocA, lCanvasHeight / 2);
        ctx.arc(lSRMiddleLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      if (
        lSR3Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR3Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      if (lSR1Loc < pLapLengthReal) {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 10);
        ctx.lineTo(lSR1LocA, lSRPosY - 1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lSRPosY - 6);
        ctx.stroke();
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRText;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);

      // this.addMainBarArrayElements(lSR1Loc, lLeftRightMargin, lSR1LocA, lSRPosY, '#fbff00');

      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSRMiddleLocA, lTopHeight - 5);
      ctx.lineTo(lSRMiddleLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRText;
      ctx.fillText(
        this.lText,
        lSRMiddleLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRMiddleLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(ctx, lSR1LocA, lSRMiddleLocA, lSRPosY, this.lText);
      // this.addMainBarArrayElements(this.lText, lSR1LocA, lSRMiddleLocA, lSRPosY, '#fbff00');
      //For SR3
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '3rd ' + lSRText;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line3
      this.lText =  lSR3Loc - lSR2Loc;
      this.drawHorDim(ctx, lSRMiddleLocA, lSRLastLocA, lSRPosY, this.lText);
      // this.addMainBarArrayElements(this.lText, lSRMiddleLocA, lSRLastLocA, lSRPosY, '#fbff00');
      // Last line
      //Horizontal line4
      this.lText = lCageLength - lSR3Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText, lSRLastLocA, lCanvasWidth - lLeftRightMargin,lSRPosY, '#fbff00');
    } else if (lNoOfSR == 4) {
      var lSR1LocA = lLeftRightMargin + lTopLength + 50;
      if (lSR1Loc < pLapLengthReal) {
        lSR1LocA = lLeftRightMargin + lTopLength - 50;
      }

      var lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
      if (lSR4Loc > lCageLength - pEndLengthReal) {
        lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lCanvasHeight / 2);
        ctx.arc(
          lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR4Loc > lCageLength - lEndLengthReal
      ) {
        ctx.moveTo(
          lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
          lCanvasHeight / 2
        );
        ctx.arc(
          lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      if (
        lSR4Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR4Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      if (lSR1Loc < pLapLengthReal) {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 10);
        ctx.lineTo(lSR1LocA, lSRPosY - 1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lSRPosY - 6);
        ctx.stroke();
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);

      // this.addMainBarArrayElements(lSR1Loc, lLeftRightMargin, lSR1LocA, lSRPosY, '#fbff00');

      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 3, lSRPosY - 6);
      ctx.stroke();


      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (lSRLastLocA - lSR1LocA) / 3 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (lSRLastLocA - lSR1LocA) / 3 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText, lSR1LocA,lSR1LocA + (lSRLastLocA - lSR1LocA) / 3 ,lSRPosY, '#fbff00');
      //For SR3
      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '3rd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR4Loc > lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (2 * (lSRLastLocA - lSR1LocA)) / 3 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line3
      this.lText = lSR3Loc - lSR2Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSR1LocA + (lSRLastLocA - lSR1LocA) / 3,lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,lSRPosY, '#fbff00');
      //For SR4
      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '4th ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR4Loc <= lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line4
      this.lText = lSR4Loc - lSR3Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,
        lSRLastLocA,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 3,lSRLastLocA,lSRPosY, '#fbff00');
      // Last line
      //Horizontal line5
      this.lText = lCageLength - lSR4Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSRLastLocA,lCanvasWidth - lLeftRightMargin,lSRPosY, '#fbff00');
    } else if (lNoOfSR == 5) {
      var lSR1LocA = lLeftRightMargin + lTopLength + 50;
      if (lSR1Loc < pLapLengthReal) {
        lSR1LocA = lLeftRightMargin + lTopLength - 50;
      }

      var lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength - 50;
      if (lSR5Loc > lCageLength - pEndLengthReal) {
        lSRLastLocA = lCanvasWidth - lLeftRightMargin - lEndLength + 50;
      }

      ctx.beginPath();
      if (
        lSR1Loc < pLapLengthReal &&
        (pMainBarShape == 'Crank-Top' ||
          pMainBarShape == 'Crank' ||
          pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSR1LocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSR1LocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR1Loc >= pLapLengthReal
        ) {
          ctx.moveTo(lSR1LocA, lCanvasHeight / 2);
          ctx.arc(lSR1LocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lCanvasHeight / 2);
        ctx.arc(
          lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
        lCanvasHeight - lTopHeight
      );
      ctx.lineTo(lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight);

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR5Loc > lCageLength - lEndLengthReal
      ) {
        ctx.moveTo(
          lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
          lCanvasHeight / 2
        );
        ctx.arc(
          lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
          lCanvasHeight / 2,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      ctx.stroke();

      ctx.beginPath();
      if (
        lSR5Loc > lCageLength - lEndLengthReal &&
        (pMainBarShape == 'Crank-End' || pMainBarShape == 'Crank-Both')
      ) {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight - 5);
        ctx.lineTo(lSRLastLocA, lTopHeight + 5);
        ctx.stroke();
      } else {
        ctx.moveTo(lSRLastLocA, lCanvasHeight - lTopHeight);
        ctx.lineTo(lSRLastLocA, lTopHeight);

        if (
          (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
          pExtraSupportDia > 0 &&
          lSR5Loc <= lCageLength - lEndLengthReal
        ) {
          ctx.moveTo(lSRLastLocA, lCanvasHeight / 2);
          ctx.arc(lSRLastLocA, lCanvasHeight / 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      if (lSR1Loc < pLapLengthReal) {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 10);
        ctx.lineTo(lSR1LocA, lSRPosY - 1);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(lSR1LocA, lTopHeight - 5);
        ctx.lineTo(lSR1LocA, lSRPosY - 6);
        ctx.stroke();
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '1st ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc >= pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line1
      this.drawHorDim(ctx, lLeftRightMargin, lSR1LocA, lSRPosY, lSR1Loc);
      // this.addMainBarArrayElements(lSR1Loc,lLeftRightMargin, lSR1LocA, lSRPosY, '#fbff00');
      //For SR2
      // vertical line2
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (lSRLastLocA - lSR1LocA) / 4, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '2nd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (lSRLastLocA - lSR1LocA) / 4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR1Loc < pLapLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (lSRLastLocA - lSR1LocA) / 4 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line2
      this.lText = lSR2Loc - lSR1Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSR1LocA,lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,lSRPosY, '#fbff00');
      //For SR3
      // vertical line3
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '3rd ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (2 * (lSRLastLocA - lSR1LocA)) / 4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      //Horizontal line3
      this.lText = lSR3Loc - lSR2Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSR1LocA + (lSRLastLocA - lSR1LocA) / 4,lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,lSRPosY, '#fbff00');
      //For SR4
      // vertical line4
      ctx.beginPath();
      ctx.moveTo(lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4, lTopHeight - 5);
      ctx.lineTo(lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '4th ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSR1LocA +
          (3 * (lSRLastLocA - lSR1LocA)) / 4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR5Loc > lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSR1LocA +
            (3 * (lSRLastLocA - lSR1LocA)) / 4 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line4
      this.lText = lSR4Loc - lSR3Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,
        lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSR1LocA + (2 * (lSRLastLocA - lSR1LocA)) / 4,lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,lSRPosY, '#fbff00');
      //For SR5
      // vertical line5
      ctx.beginPath();
      ctx.moveTo(lSRLastLocA, lTopHeight - 5);
      ctx.lineTo(lSRLastLocA, lSRPosY - 6);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '5th ' + lSRTextS;
      ctx.fillText(
        this.lText,
        lSRLastLocA - ctx.measureText(this.lText).width / 2,
        lSRPosY - 8
      );

      if (
        (pExtraSupport == 'Cross' || pExtraSupport == 'Square') &&
        pExtraSupportDia > 0 &&
        lSR5Loc <= lCageLength - lEndLengthReal
      ) {
        this.lText = 'Support Bars: 2H' + pExtraSupportDia;
        if (pExtraSupport == 'Square') {
          this.lText = 'Support Bars: 4H' + pExtraSupportDia;
        }
        ctx.fillText(
          this.lText,
          lSRLastLocA - ctx.measureText(this.lText).width / 2,
          lCanvasHeight - lTopHeight + lSBarTxtV
        );
      }

      //Horizontal line5
      this.lText = lSR5Loc - lSR4Loc;
      this.drawHorDim(
        ctx,
        lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,
        lSRLastLocA,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSR1LocA + (3 * (lSRLastLocA - lSR1LocA)) / 4,lSRLastLocA,lSRPosY, '#fbff00');
      // Last line
      //Horizontal line6
      this.lText = lCageLength - lSR5Loc;
      this.drawHorDim(
        ctx,
        lSRLastLocA,
        lCanvasWidth - lLeftRightMargin,
        lSRPosY,
        this.lText
      );
      // this.addMainBarArrayElements(this.lText,lSRLastLocA, lCanvasWidth - lLeftRightMargin,lSRPosY, '#fbff00');
    }
    // end of Stiffener Ring
    // if(mainbar_length_2layer && main_bar_type == 'Mixed' && (pPileType != 'Single-Layer' || main_bar_arrange != 'Single')){
    //   this.drawHorDimMainBr(ctx,mainbar_length_2layer);
    // }
  }

  drawAdditionalRings(
    ctx: any,
    pNoOfSR: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pStartRings: any,
    pEndRings: any,
    pAdditionalRingMember: any,
    pAdditionalRingEach: any
  ) {
    //Dimensions
    //Stiffener Ring
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lSRPosY = lTopHeight - 7;

    var lCrankHeight = 5;
    var lCrankWidth = 10;

    lCrankHeight = this.gCrankHeight;
    lCrankWidth = this.gCrankWidth;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    //var data = grid.getDataItem(pRowNo);
    var lStartRings = 0;
    var lEndRings = 0;
    var lAdditionalRingMember = 0;
    var lAdditionalRingEach = 0;

    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;

    var lNoOfSR = 0;

    if (pNoOfSR != null) {
      lNoOfSR = parseInt(pNoOfSR);
    }

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }
    if (pStartRings != null) {
      lStartRings = parseInt(pStartRings);
    }

    if (pEndRings != null) {
      lEndRings = parseInt(pEndRings);
    }
    if (pAdditionalRingMember != null) {
      lAdditionalRingMember = parseInt(pAdditionalRingMember);
    }
    if (pAdditionalRingEach != null) {
      lAdditionalRingEach = parseInt(pAdditionalRingEach);
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }

    // canvasPV = document.getElementById(pCanvas);
    // ctx = canvasPV.getContext("2d");

    if (lStartRings > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = 'Rings@Start: ' + lStartRings;
      ctx.fillText(
        this.lText,
        lLeftRightMargin +
          lTopLength -
          lCrankWidth -
          4 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY
      );
    }

    if (lEndRings > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = 'Rings@End: ' + lEndRings;
      ctx.fillText(
        this.lText,
        lCanvasWidth -
          lEndLength -
          lLeftRightMargin +
          2 +
          lCrankWidth -
          ctx.measureText(this.lText).width / 2,
        lSRPosY
      );
    }

    //draw additional ring
    ctx.lineWidth = 1;
    //ctx.strokeStyle = "#804000";
    ctx.strokeStyle = '#ac5000';

    if (lAdditionalRingMember > 0 && lAdditionalRingEach > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      if (lAdditionalRingMember == 1) {
        this.lText = 'Additional Rings: ' + lAdditionalRingEach + ' at center';
      } else {
        this.lText =
          'Additional Rings: ' +
          lAdditionalRingEach +
          ' at ' +
          lAdditionalRingMember +
          ' sections';
      }
      ctx.fillText(
        this.lText,
        (lCanvasWidth + lTopLength - lEndLength) / 2 -
          ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 13
      );

      //draw additional rings
      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = lAdditionalRingEach;
      for (let i = 0; i < lAdditionalRingMember; i++) {
        // Detect Collision with stiffener ring
        var lX =
          lLeftRightMargin +
          lTopLength +
          ((i + 1) *
            (lCanvasWidth - 2 * lLeftRightMargin - lTopLength - lEndLength)) /
            (lAdditionalRingMember + 1);

        if (lNoOfSR == 1) {
          if (
            lX > (lCanvasWidth + lTopLength - lEndLength) / 2 - 5 &&
            lX < (lCanvasWidth + lTopLength - lEndLength) / 2 + 5
          ) {
            lX = lX + 16;
          }
        } else if (lNoOfSR == 2) {
          //Left SR
          if (
            lX > lLeftRightMargin + lTopLength + 50 - 5 &&
            lX < lLeftRightMargin + lTopLength + 50 + 5
          ) {
            lX = lX + 16;
          }
          //Right SR
          if (
            lX > lCanvasWidth - lLeftRightMargin - lEndLength - 50 - 5 &&
            lX < lCanvasWidth - lLeftRightMargin - lEndLength - 50 + 5
          ) {
            lX = lX + 16;
          }
        } else {
          //Left SR
          if (
            lX > lLeftRightMargin + lTopLength + 50 - 5 &&
            lX < lLeftRightMargin + lTopLength + 50 + 5
          ) {
            lX = lX + 16;
          }
          //Right SR
          if (
            lX > lCanvasWidth - lLeftRightMargin - lEndLength - 50 - 5 &&
            lX < lCanvasWidth - lLeftRightMargin - lEndLength - 50 + 5
          ) {
            lX = lX + 16;
          }
          for (let j = 0; j < lNoOfSR - 2; j++) {
            if (
              lX >
                lLeftRightMargin +
                  lTopLength +
                  50 +
                  ((j + 1) *
                    (lCanvasWidth -
                      lLeftRightMargin -
                      lEndLength -
                      50 -
                      (lLeftRightMargin + lTopLength + 50))) /
                    (lNoOfSR - 1) -
                  5 &&
              lX <
                lLeftRightMargin +
                  lTopLength +
                  50 +
                  ((j + 1) *
                    (lCanvasWidth -
                      lLeftRightMargin -
                      lEndLength -
                      50 -
                      (lLeftRightMargin + lTopLength + 50))) /
                    (lNoOfSR - 1) +
                  5
            ) {
              lX = lX + 16;
            }
          }
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(lX - 1, lCanvasHeight - lTopHeight + 3);
        ctx.lineTo(lX - 1, lTopHeight - 3);

        ctx.moveTo(lX + 1, lCanvasHeight - lTopHeight + 3);
        ctx.lineTo(lX + 1, lTopHeight - 3);
        ctx.stroke();

        ctx.fillText(
          this.lText,
          lX - ctx.measureText(this.lText).width / 2,
          lTopHeight - 6
        );
      }
    }
    // end of Additional Ring
  }

  drawCrankHeight(
    ctx: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pMainBarShape: any,
    pCrankHeightTop: any,
    pCrankHeightEnd: any
  ) {
    //Dimensions
    //Stiffener Ring
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lSRPosY = lTopHeight - 7;

    var lCrankHeight = 5;
    var lCrankWidth = 10;

    lCrankHeight = this.gCrankHeight;
    lCrankWidth = this.gCrankWidth;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;

    //var data = grid.getDataItem(pRowNo);
    var lMainBarShape = '';
    var lCrankHeightTop = 0;
    var lCrankHeightEnd = 0;

    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }

    if (pMainBarShape != null) {
      lMainBarShape = pMainBarShape;
    }

    if (pCrankHeightTop != null) {
      lCrankHeightTop = parseInt(pCrankHeightTop);
    }

    if (pCrankHeightEnd != null) {
      lCrankHeightEnd = parseInt(pCrankHeightEnd);
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }

    // canvasPV = document.getElementById(pCanvas);
    // ctx = canvasPV.getContext("2d");

    // Left vertical line
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff00ff';

    if (
      lMainBarShape == 'Crank-Top' ||
      lMainBarShape == 'Crank' ||
      lMainBarShape == 'Crank-Both'
    ) {
      // dimension horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 3,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 43,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight + 13
      );
      ctx.stroke();

      //up arrow
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33 - 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33 + 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      //down arrow
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33 - 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 33 + 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.stroke();

      //Horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lLeftRightMargin + lTopLength - 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.lineTo(
        lLeftRightMargin + lTopLength - 93,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = 'Crank Height - ' + lCrankHeightTop;
      ctx.fillText(
        this.lText,
        lLeftRightMargin + lTopLength - 117,
        lCanvasHeight - lTopHeight - lCrankHeight - 17
      );
    }

    if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
      // dimension horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 3,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 43,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight + 13
      );
      ctx.stroke();

      //up arrow
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 - 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight + 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 + 2.5,
        lCanvasHeight - lTopHeight + 3 + 5
      );
      ctx.stroke();

      // central vertical line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      //down arrow
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 - 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 3
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 + 2.5,
        lCanvasHeight - lTopHeight - lCrankHeight - 3 - 5
      );
      ctx.stroke();

      //Horizontal line
      ctx.beginPath();
      ctx.moveTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 33,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.lineTo(
        lCanvasWidth - lEndLength - lLeftRightMargin + 93,
        lCanvasHeight - lTopHeight - lCrankHeight - 13
      );
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = lCrankHeightEnd + ' - Crank Height';
      ctx.fillText(
        this.lText,
        lCanvasWidth - lEndLength - lLeftRightMargin + 33 - 5,
        lCanvasHeight - lTopHeight - lCrankHeight - 17
      );
    }

    // end of draw crank height
  }
  drawCircularRing(
    ctx: any,
    pLapLengthReal: any,
    pEndLengthReal: any,
    pCageLength: any,
    pCRNo_Top: any,
    pCRNo_End: any,
    pCRSpacing_Top: any,
    pCRSpacing_End: any,
    pMainBarShape: any,
    pSLType: any,
    pCRRemarks: any,
    pExtraCRNo: any,
    pExtraCRLoc: any,
    pExtraCRDia: any,
    pStartRings: any,
    pEndRings: any,
    pCRPosn_Top: any,
    pCRPosn_End: any,
    pCRTopRemarks: any,
    pMinTop:any,
    pMinEnd:any
  ) {
    //Dimensions
    //Circular Ring
    var lFirstWire = 40;
    var lMinTop = pMinTop;
    var lMinEnd = pMinEnd;
    var lCanvasHeight = 210;
    var lCanvasWidth = 700;
    var lTopHeight = 60;
    var lLeftRightMargin = 20;
    var lCrankHeight = 5;
    var lCrankWidth = 10;

    var lSRPosY = lCanvasHeight - lTopHeight / 2;

    lCanvasHeight = this.gCanvasHeight;
    lCanvasWidth = this.gCanvasWidth;
    lTopHeight = this.gTopHeight;
    lLeftRightMargin = this.gLeftRightMargin;
    lMinTop = this.gMinTop;
    lMinEnd = this.gMinEnd;
    lCrankHeight = this.gCrankHeight;
    lCrankWidth = this.gCrankWidth;

    //var data = grid.getDataItem(pRowNo);
    var lCRNo_Top = 0;
    var lCRSpacing_Top = 0;
    var lCRNo_End = 0;
    var lCRSpacing_End = 0;
    var lMainBarShape = '';

    var lLapLengthReal = 0;
    var lEndLengthReal = 0;
    var lCageLength = 0;
    var lSLType = '';

    if (pLapLengthReal != null) {
      lLapLengthReal = parseInt(pLapLengthReal);
    }
    if (pEndLengthReal != null) {
      lEndLengthReal = parseInt(pEndLengthReal);
    }
    if (pCageLength != null) {
      lCageLength = parseInt(pCageLength);
    }
    if (pCRNo_Top != null) {
      lCRNo_Top = parseInt(pCRNo_Top);
    }

    if (pCRNo_End != null) {
      lCRNo_End = parseInt(pCRNo_End);
    }

    if (pCRSpacing_Top != null) {
      lCRSpacing_Top = pCRSpacing_Top;
    }
    if (pCRSpacing_End != null) {
      lCRSpacing_End = parseInt(pCRSpacing_End);
    }

    if (pMainBarShape != null) {
      lMainBarShape = pMainBarShape;
    }

    if (pSLType != null) {
      lSLType = pSLType;
    }
    if (pCRPosn_Top == null) {
      pCRPosn_Top = 0;
    }
    if (pCRPosn_End == null) {
      pCRPosn_End = 0;
    }

    var lTopLength =
      (lLapLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    var lEndLength =
      (lEndLengthReal * (lCanvasWidth - 2 * lLeftRightMargin)) / lCageLength; //150;
    if (lTopLength < 100) {
      lTopLength = 100;
    }
    if (lEndLength < 100) {
      lEndLength = 100;
    }
    if (
      lLapLengthReal < lMinTop ||
      (pCRPosn_Top > 0 && lLapLengthReal > pCRPosn_Top && lCRNo_Top > 0)
    ) {
      //draw Circular ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#80ffff';

      var lCrank = 0;
      if (
        lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank' ||
        lMainBarShape == 'Crank-Both'
      ) {
        lCrank = lCrankHeight;
      }

      for (let i = 0; i < lCRNo_Top; i++) {
        //draw Curcular ring
        ctx.beginPath();
        ctx.moveTo(
          lLeftRightMargin +
            lFirstWire +
            (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top,
          lCanvasHeight - lTopHeight - lCrank + 3
        );
        ctx.lineTo(
          lLeftRightMargin +
            lFirstWire +
            (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top,
          lTopHeight + lCrank - 3
        );
        ctx.stroke();

        if (lSLType.substring(0, 4) == 'Twin') {
          //Twin Circular ring
          ctx.beginPath();
          ctx.moveTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top +
              2,
            lCanvasHeight - lTopHeight - lCrank + 3
          );
          ctx.lineTo(
            lLeftRightMargin +
              lFirstWire +
              (i * (lTopLength - lCrankWidth - 4 - lFirstWire)) / lCRNo_Top +
              2,
            lTopHeight + lCrank - 3
          );
          ctx.stroke();
        }
      }

      // Left vertical line
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin + lFirstWire, lSRPosY + 5);
      ctx.lineTo(lLeftRightMargin + lFirstWire, lCanvasHeight - lTopHeight + 5);
      ctx.stroke();
      if (
        lLapLengthReal >= lMinTop &&
        lLapLengthReal > pCRPosn_Top &&
        pCRPosn_Top > 0
      ) {
        //Horizontal line
        this.drawHorDim(
          ctx,
          lLeftRightMargin,
          lLeftRightMargin + lFirstWire,
          lSRPosY,
          pCRPosn_Top
        );

        //Horizontal line
        this.lText = lMinTop - pCRPosn_Top;
        this.drawHorDim(
          ctx,
          lLeftRightMargin + lFirstWire,
          lLeftRightMargin + lTopLength - lCrankWidth - 4,
          lSRPosY,
          this.lText
        );
      } else {
        //Horizontal line
        this.drawHorDim(
          ctx,
          lLeftRightMargin,
          lLeftRightMargin + lFirstWire,
          lSRPosY,
          lLapLengthReal
        );
        //Horizontal line
        var lText = lMinTop - lLapLengthReal;
        this.drawHorDim(
          ctx,
          lLeftRightMargin + lFirstWire,
          lLeftRightMargin + lFirstWire + lFirstWire+6,
          lSRPosY,
          lText
        );
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText = '';
      if (lSLType.substring(0, 4) == 'Twin') {
        this.lText = lCRNo_Top + 'x2 CR';
      } else {
        this.lText = lCRNo_Top + ' CR';
      }
      ctx.fillText(
        this.lText,
        lLeftRightMargin +
          (lFirstWire + lTopLength - lCrankWidth - 4) / 2 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 16
      );
    }

    if (
      lEndLengthReal < lMinEnd ||
      (pCRPosn_End > 0 && lEndLengthReal > pCRPosn_End && lCRNo_End > 0)
    ) {
      //draw Circular ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#80ffff';
      var lCrank = 0;
      if (lMainBarShape == 'Crank-End' || lMainBarShape == 'Crank-Both') {
        lCrank = lCrankHeight;
      }

      for (let i = 0; i < lCRNo_End; i++) {
        //draw stiffener ring
        ctx.beginPath();
        ctx.moveTo(
          lCanvasWidth -
            lLeftRightMargin -
            lFirstWire -
            (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End,
          lCanvasHeight - lTopHeight - lCrank + 3
        );
        ctx.lineTo(
          lCanvasWidth -
            lLeftRightMargin -
            lFirstWire -
            (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End,
          lTopHeight + lCrank - 3
        );
        ctx.stroke();

        if (
          (lSLType.substring(0, 4) == 'Twin' && lSLType != 'Twin-Single') ||
          lSLType == 'Single-Twin'
        ) {
          //Twin Circular ring
          ctx.beginPath();
          ctx.moveTo(
            lCanvasWidth -
              lLeftRightMargin -
              lFirstWire -
              (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End +
              2,
            lCanvasHeight - lTopHeight - lCrank + 3
          );
          ctx.lineTo(
            lCanvasWidth -
              lLeftRightMargin -
              lFirstWire -
              (i * (lEndLength - lCrankWidth - 2 - lFirstWire)) / lCRNo_End +
              2,
            lTopHeight + lCrank - 3
          );
          ctx.stroke();
        }
      }

      // Left vertical line
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      ctx.beginPath();
      ctx.moveTo(lCanvasWidth - lLeftRightMargin - lFirstWire, lSRPosY + 5);
      ctx.lineTo(
        lCanvasWidth - lLeftRightMargin - lFirstWire,
        lCanvasHeight - lTopHeight + 5
      );
      ctx.stroke();
      if (
        lEndLengthReal >= lMinEnd &&
        lEndLengthReal > pCRPosn_End &&
        pCRPosn_End > 0
      ) {
        //Horizontal line
        this.drawHorDim(
          ctx,
          lCanvasWidth - lLeftRightMargin - lFirstWire,
          lCanvasWidth - lLeftRightMargin,
          lSRPosY,
          pCRPosn_End
        );

        //Horizontal line
        this.lText = lMinEnd - pCRPosn_End;
        this.drawHorDim(
          ctx,
          lCanvasWidth - lLeftRightMargin - lEndLength + lCrankWidth + 2,
          lCanvasWidth - lLeftRightMargin - lFirstWire,
          lSRPosY,
          this.lText
        );
      } else {
        //Horizontal line
        this.drawHorDim(
          ctx,
          lCanvasWidth - lLeftRightMargin - lFirstWire,
          lCanvasWidth - lLeftRightMargin,
          lSRPosY,
          lEndLengthReal
        );
        //Horizontal line
        var lText = lMinEnd - lEndLengthReal;
        this.drawHorDim(
          ctx,
          lCanvasWidth - lLeftRightMargin - lEndLength + lCrankWidth + 2,
          lCanvasWidth - lLeftRightMargin - lFirstWire,
          lSRPosY,
          lText
        );
      }

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      if (
        (lSLType.substring(0, 4) == 'Twin' && lSLType != 'Twin-Single') ||
        lSLType == 'Single-Twin'
      ) {
        this.lText = lCRNo_End + 'x2 CR';
      } else {
        this.lText = lCRNo_End + ' CR';
      }
      ctx.fillText(
        this.lText,
        lCanvasWidth -
          lLeftRightMargin +
          (lCrankWidth - lEndLength + 2 - lFirstWire) / 2 -
          ctx.measureText(this.lText).width / 2,
        lSRPosY - 16
      );

      //Drawing CR Remakrs
      if (pCRRemarks != null && pCRRemarks.trim().length > 0) {
        ctx.fillStyle = '#FF0000';
        ctx.font = '15px Verdana';
        this.lText = pCRRemarks;
        ctx.fillText(
          this.lText,
          lCanvasWidth +
            (lCrankWidth - lEndLength + 2 - lFirstWire) / 2 -
            ctx.measureText(this.lText).width / 2,
          lCanvasHeight / 2
        );
      }
    }
    // end of Circular Ring

    //draw Extra Circular Rings
    if (pExtraCRNo > 0 && pExtraCRLoc > 0 && pExtraCRDia > 0) {
      var lCrank = 0;
      if (
        lMainBarShape == 'Crank-Top' ||
        lMainBarShape == 'Crank' ||
        lMainBarShape == 'Crank-Both'
      ) {
        lCrank = lCrankHeight;
      }

      var lECRLoc =
        (pExtraCRLoc * (lCanvasWidth - 2 * lLeftRightMargin)) / pCageLength;
      if (
        pExtraCRLoc <= pLapLengthReal ||
        (lLapLengthReal < lMinTop && pExtraCRLoc <= lMinTop)
      ) {
        lECRLoc = 95;
      } else {
        lCrank = 0;
        if (lECRLoc < 122) {
          lECRLoc = 122;
        }
      }
      if (
        pExtraCRLoc >= pCageLength - lEndLengthReal ||
        (lLapLengthReal < lMinEnd && pExtraCRLoc >= pCageLength - lMinEnd)
      ) {
        if (
          lECRLoc <
          lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 10
        ) {
          lECRLoc =
            lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth + 10;
        }
      }

      if (lLapLengthReal < lMinTop) {
        if (pStartRings == 0 && pExtraCRLoc == lMinTop) {
          lECRLoc =
            lLeftRightMargin + 100 - lCrankWidth - (pExtraCRNo - 1) * 1.5;
        }
      } else {
        if (pStartRings == 0 && pExtraCRLoc == pLapLengthReal) {
          lECRLoc =
            lLeftRightMargin +
            lTopLength -
            lCrankWidth -
            (pExtraCRNo - 1) * 1.5;
        }
      }

      if (lEndLengthReal < lMinEnd) {
        if (pEndRings == 0 && pExtraCRLoc == pCageLength - lMinEnd) {
          lECRLoc = lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth;
        } else {
          if (
            pExtraCRLoc >= pCageLength - lMinEnd &&
            lECRLoc <= lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth + 10
          ) {
            lECRLoc = lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth + 10;
          }
          if (
            pExtraCRLoc < pCageLength - lMinEnd &&
            lECRLoc > lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth - 10
          ) {
            lECRLoc = lCanvasWidth - 100 - lLeftRightMargin + lCrankWidth - 10;
          }
          if (
            pExtraCRLoc < pCageLength - lEndLengthReal &&
            lECRLoc > lCanvasWidth - lLeftRightMargin - lFirstWire - 12
          ) {
            lECRLoc = lCanvasWidth - lLeftRightMargin - lFirstWire - 12;
          }
        }
      } else {
        if (pEndRings == 0 && pExtraCRLoc == pCageLength - lEndLengthReal) {
          lECRLoc = lCanvasWidth - lEndLength - lLeftRightMargin + lCrankWidth;
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#00b2cc';
      ctx.beginPath();
      for (let i = 0; i < pExtraCRNo; i++) {
        ctx.moveTo(lECRLoc + i * 1.5, lCanvasHeight - lTopHeight - lCrank + 3);
        ctx.lineTo(lECRLoc + i * 1.5, lTopHeight + lCrank - 3);
      }
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '10px Verdana';
      this.lText =
        'Extra CR ' + pExtraCRNo + 'H' + pExtraCRDia + '@@' + pExtraCRLoc;
      ctx.fillText(
        this.lText,
        lECRLoc - ctx.measureText(this.lText).width / 2,
        lCanvasHeight - lTopHeight + 14
      );

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff00ff';

      // vertical line1
      ctx.beginPath();
      ctx.moveTo(lLeftRightMargin, lCanvasHeight - lTopHeight - 5);
      ctx.lineTo(lLeftRightMargin, lCanvasHeight - lTopHeight - 25);
      ctx.stroke();

      //Horizontal line
      this.drawHorDim(
        ctx,
        lLeftRightMargin,
        lECRLoc,
        lCanvasHeight - lTopHeight - 18,
        pExtraCRLoc
      );
    }
  }
  setStiffenerRingsBasedOnEqualDevision(no_of_sr: any, item: any)
  {
    let reminder = 0;
    reminder = item.sr1_location % 100;
    item.sr1_location = Math.floor(item.sr1_location/100)*100;
    let last_location = item.last_location ? parseInt(item.last_location) :  parseInt(item[`sr${no_of_sr}_location`]) ? parseInt(item.cage_length)-parseInt(item[`sr${no_of_sr}_location`]):0;
    let len = parseInt(item.cage_length)-parseInt(item.sr1_location)-last_location;
    let each_len = len/(no_of_sr-1);
    let each_remainder = each_len % 100;
    let each_len_100 = Math.floor(each_len/100)*100;

    for (let i = 1; i < 5; i++) {
      if(i < no_of_sr){
        item[`sr${i + 1}_location`] = parseInt(item[`sr${i}_location`]) + each_len_100;
        reminder += each_remainder;
        if( i == 1){
          this.tableData[i-1].val = item[`sr${i}_location`];
          this.tableData[i].val = item[`sr${i+1}_location`] - item[`sr${i}_location`];
        }else{
          this.tableData[i].val = item[`sr${i+1}_location`] - item[`sr${i}_location`];
        }
      }else{
        item[`sr${i + 1}_location`] = 0;
        this.tableData[i].val = 0;
      }

    }
    // this.tableData[5].val = item[`sr5_location`];
    item.last_location += reminder;
    item.last_location = parseInt(item.last_location) > 0 ? parseInt(item.last_location) : 0;

    console.log("setStiffenerRingsBasedOnEqualDevision=>",item,this.tableData);
  }

  setValuesToZeroDepensOnSR(no_of_sr: any, item: any){
    for (let i = 0; i < 5; i++) {
      if(i >= no_of_sr){
        this.tableData[i].val = 0;
      }
    }
  }
}
