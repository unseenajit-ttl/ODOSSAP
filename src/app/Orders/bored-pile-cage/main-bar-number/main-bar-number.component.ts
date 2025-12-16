import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BoredPileCustomMainBarModel } from 'src/app/Model/bpc_elevation_stiffener';
import { OrderService } from 'src/app/Orders/orders.service';
@Component({
  selector: 'app-main-bar-number',
  templateUrl: './main-bar-number.component.html',
  styleUrls: ['./main-bar-number.component.css'],
})
export class MainBarNumberComponent implements OnInit {
  @Output() imageUpdated = new EventEmitter<string>();

  @ViewChild('canvasElement', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @Input() Insert_BPC_Structuremarking: any;
  @Input() ParameterValues: any;
  @Input() commonPopupModel: any;
  machineList: any = [];
  innerMachineList: any = [];
  mainBarCount = 0;
  MachineTypeId = 0;
  totalNoOfMainbar!: number;
  mainbarlist: any;
  mainBarPositionPart!: number;
  level: number = 1;
  chordLength!: number;
  cover!: number;
  templateList: any = [];
  detailsCount = 0;
  anglesForManual: any = [];
  schnellArray1: any = [];
  schnellArray2: any = [];
  isVisible: boolean = false;
  schnellArray3: any = [];
  selectedGridRow: any;
  imageSrc: string = '';
  selected: boolean = true;
  datatopass: any;
  mainbarType: any;
  pileType: any;
  mainbarArrange: any;
  x: any;
  y: any;
  page = 1;
  pageSize = 0;
  maxSize: number = 10;
  currentPage = 1;
  itemsPerPage: number = 10;
  paginatedMachineList: any[] = [];
  sendData!: BoredPileCustomMainBarModel;
 selectedLayer: string = 'OuterLayer';
  layerBarCount: any;
  lDist: any;
  outerList: any = [];
  innerList: any = [];
  main_bar_ct_to_update:any;
  noOfMainBarToUpdate:any;
  selectAllChecked: boolean = false;
  allSelected = false;
  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {}
  ngOnInit() {
    debugger;
    this.pileType = this.Insert_BPC_Structuremarking.pile_type;
    this.mainbarType = this.Insert_BPC_Structuremarking.main_bar_type;
    this.mainbarArrange = this.Insert_BPC_Structuremarking.main_bar_arrange;
    this.outerList = [];
    this.innerList = [];
    this.machineList = [];

    // if(this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON != null && this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON != ""){
    //   this.machineList = JSON.parse(this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON);
    // }else{
    //   this.generatetableList();
    // }

    if (this.pileType == 'Double-Layer' || this.mainbarArrange == 'In-Out') {
      this.generatetabledoubleList();
    } else {
      if (
        this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON != null &&
        this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON != ''
      ) {
        let mainJson = JSON.parse(
          this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON
        );
        let pArrangement = this.Insert_BPC_Structuremarking.main_bar_arrange;
        let lMainBarType = this.Insert_BPC_Structuremarking.main_bar_type;

        if (
          pArrangement == mainJson.MainBarArrange &&
          mainJson.MainbarType == lMainBarType
        ) {
          this.machineList = mainJson.loop1;
        } else {
          this.generatetableList();
        }
        if(mainJson.main_bar_ct_to_update){
          this.noOfMainBarToUpdate = mainJson.main_bar_ct_to_update;
        }else{
          this.noOfMainBarToUpdate = this.Insert_BPC_Structuremarking.main_bar_ct;
        }
      } else {
        this.noOfMainBarToUpdate = this.Insert_BPC_Structuremarking.main_bar_ct;
        this.generatetableList();
      }

      // this.generatetableList();
      this.createMainBarImage();
    }
    this.onPageChange(1);
     this.updateMainToggleState();
  }

  toggleMainBar(bar: any, event: Event): void {
    const selectedBars = this.machineList.filter((mbar: any) => mbar.selected);
    bar.selected = !bar.selected;
     this.updateMainToggleState();
   if (this.pileType == 'Double-Layer' || this.Insert_BPC_Structuremarking.main_bar_arrange == 'In-Out') {
    this.createMainDoubleBarImage();
  } else {
    this.createMainBarImage();
  }
  }
  toggleMainBarLayers(bar: any, event: Event, list: any): void {
    const selectedBars = list.filter((mbar: any) => mbar.selected);
   
    bar.selected = !bar.selected;
     this.updateMainToggleState();
      if (this.pileType == 'Double-Layer' || this.Insert_BPC_Structuremarking.main_bar_arrange == 'In-Out') {
    this.createMainDoubleBarImage();
  } else {
    this.createMainBarImage();
  }
  }

  dismissModal() {
    this.activeModal.dismiss('User closed modal!');
  }
  isSelectLayerVisible(): boolean {
    return (
      this.pileType.trim().toLowerCase() === 'double-layer' ||
      this.mainbarArrange.trim().toLowerCase() === 'in-out'
    );
  }

  LayerChange() {
    debugger;
    if (this.selectedLayer == 'InnerLayer') {
    } else {
      //if(this.selectedLayer == "Outer Layer"){
    }
  }

  loop1 = [];
  loop2 = [];
  updateData() {
    debugger;
    let main_bar_ct_new = this.Insert_BPC_Structuremarking.main_bar_ct;
    if (this.pileType === 'Double-Layer' && this.mainbarArrange === 'Side-By-Side') {
      this.loop1 = this.outerList;
      this.loop2 = this.innerList;
    }else if (this.pileType === 'Double-Layer') {
      this.loop1 = this.innerList;
      this.loop2 = this.outerList;
    } else if (this.pileType === 'Single-Layer' && this.mainbarArrange === 'In-Out') {
      this.loop1 = this.innerList;
      this.loop2 = this.outerList;
    } else {
      this.loop1 = this.machineList;
      this.loop2 = [];
    }
  const loop1Selected = this.loop1.some((bar: any) => bar.selected);
  const loop2Selected = this.loop2.length > 0 ? this.loop2.some((bar: any) => bar.selected) : true;                              

  if (!loop1Selected) {
    alert("Please select at least one main bar.");
    return;
  }

  if (this.loop2.length > 0 && !loop2Selected) {
    alert("Please select at least one main bar.");
    return;
  }
    this.getMainBarCountUpdate();
    this.sendData = {
      CustomerCode: this.Insert_BPC_Structuremarking.CustomerCode,
      ProjectCode: this.Insert_BPC_Structuremarking.ProjectCode,
      Template: this.Insert_BPC_Structuremarking.Template,
      JobId: this.Insert_BPC_Structuremarking.JobID,
      CageId: this.Insert_BPC_Structuremarking.cage_id,
      main_bar_ct:this.main_bar_ct_to_update,
      CustomizeBarsJSON: JSON.stringify({
        PileType: this.Insert_BPC_Structuremarking.pile_type,
        MainBarArrange: this.Insert_BPC_Structuremarking.main_bar_arrange,
        MainbarType: this.Insert_BPC_Structuremarking.main_bar_type,
        loop1:this.loop1,
        loop2:this.loop2,
        NoOfMainBar: this.noOfMainBarToUpdate,
      }),
    };
    this.activeModal.close(this.sendData);

    // this.orderService.updateMainBar_Customization(this.sendData).subscribe({
    //   next: (response: any) => {
    //     console.log('updateStiffenerRing', response);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching posts:', error);
    //   },
    //   complete: () => {
    //     console.log('Fetching posts complete');
    //   },
    // });

    console.log('this.sendData=>', this.sendData);
  }
  generatetableList(): void {
    debugger;
    this.machineList = [];
    debugger;
    this.mainbarType = this.Insert_BPC_Structuremarking.main_bar_type;
    this.mainBarCount = parseInt(
      this.Insert_BPC_Structuremarking.main_bar_ct.toString().split(',')[0]
    ); // Get main bar count
    // if(this.Insert_BPC_Structuremarking.main_bar_ct.toString().split(',').length > 1){
    //   this.mainBarCount = this.mainBarCount + parseInt(this.Insert_BPC_Structuremarking.main_bar_ct.toString().split(',')[1]);
    // }main_bar_type
    if (this.Insert_BPC_Structuremarking.main_bar_type == 'Mixed') {
      debugger;
      if (
        // this.Insert_BPC_Structuremarking.main_bar_arrange == 'Single' ||
        this.Insert_BPC_Structuremarking.main_bar_arrange == 'Side-By-Side'
      ) {
        let lBarCTs = this.Insert_BPC_Structuremarking.main_bar_ct
          .toString()
          .split(',');
        let lTotBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]);
        let mainbarangle = 360 / this.mainBarCount;
        let actualAngle = 0;
        let j = 1;
        for (let i = 0; i < this.mainBarCount; i++) {
          this.machineList.push({
            id: j++,
            angle: Math.round(actualAngle),
            selected: this.selected,
          });
          this.machineList.push({
            id: j++,
            angle: Math.round(actualAngle + 4),
            selected: this.selected,
          });
          actualAngle += mainbarangle;
        }
        this.updatePaginatedList();
        // } else if (
        //   this.Insert_BPC_Structuremarking.main_bar_arrange == 'In-Out'
        // ) {
        //   debugger
        //   let lBarCTs = this.Insert_BPC_Structuremarking.main_bar_ct
        //     .toString()
        //     .split(',');
        //   let lTotBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]);
        //   const pairCount = Math.floor(lTotBars / 2);
        //   let mainbarangle = 360 / pairCount;
        //   let actualAngle = 0;
        //   let id = 1;
        //   for (let i = 0; i < pairCount; i++) {
        //     this.machineList.push({
        //       id: id++,
        //       angle: Math.round(actualAngle),
        //       type: 'outer',
        //       selected: this.selected,
        //       isInnerLayer: false,
        //     });
        //     this.machineList.push({
        //       id: id++,
        //       angle: Math.round(actualAngle),
        //       type: 'inner',
        //       selected: this.selected,
        //       isInnerLayer: true,
        //     });
        //     actualAngle += mainbarangle;
        //   }
        //   //this.updatePaginatedList();
      } else {
        let lBarCTs = this.Insert_BPC_Structuremarking.main_bar_ct
          .toString()
          .split(',');
        let lTotBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]);
        let mainbarangle = 360 / lTotBars;
        let actualAngle = 0;
        for (let i = 0; i < lTotBars; i++) {
          this.machineList.push({
            id: i + 1,
            angle: Math.round(actualAngle),
            selected: this.selected,
          });
          actualAngle += mainbarangle;
        }
        this.updatePaginatedList();
      }
    } else if (this.Insert_BPC_Structuremarking.main_bar_type == 'Single') {
      if (this.Insert_BPC_Structuremarking.main_bar_arrange == 'Side-By-Side') {
        let lBarCTs = this.Insert_BPC_Structuremarking.main_bar_ct
          .toString()
          .split(',');
        const pairCount = Math.floor(lBarCTs / 2);
        let mainbarangle = 360 / pairCount;
        let actualAngle = 0;
        let id = 1;
        // for (let i = 0; i < lBarCTs; i++) {
        //   this.machineList.push(
        //     { id: i+1,
        //       angle: Math.round(actualAngle),
        //       selected:this.selected
        //     });

        //   actualAngle += mainbarangle;
        // }
        for (let i = 0; i < pairCount; i++) {
          this.machineList.push({
            id: id,
            angle: Math.round(actualAngle),
            selected: this.selected,
          });
          id++;
          this.machineList.push({
            id: id,
            angle: Math.round(actualAngle + 4),
            selected: this.selected,
          });
          id++;
          actualAngle += mainbarangle;
        }
        this.updatePaginatedList();
        // } else if (
        //   this.Insert_BPC_Structuremarking.main_bar_arrange == 'In-Out'
        // ) {
        //   //2 Machinlist plan to create 2 circle
        //   let lBarCTs = this.Insert_BPC_Structuremarking.main_bar_ct
        //     .toString()
        //     .split(',');
        //   const pairCount = Math.floor(lBarCTs / 2);
        //   let mainbarangle = 360 / pairCount;
        //   let actualAngle = 0;
        //   let id = 1;
        //   for (let i = 0; i < pairCount; i++) {
        //     this.machineList.push({
        //       id: id++,
        //       angle: Math.round(actualAngle),
        //       type: 'outer',
        //       selected: this.selected,
        //       isInnerLayer: false,
        //     });
        //     this.machineList.push({
        //       id: id++,
        //       angle:  Math.round(actualAngle),
        //       type: 'inner',
        //       selected: this.selected,
        //       isInnerLayer: true,
        //     });
        //     actualAngle += mainbarangle;
        //   }
        //   this.updatePaginatedList();
      } else {
        let mainbarangle = 360 / this.mainBarCount;
        let actualAngle = 0;
        for (let i = 0; i < this.mainBarCount; i++) {
          this.machineList.push({
            id: i + 1,
            angle: Math.round(actualAngle),
            selected: this.selected,
          });
          actualAngle += mainbarangle;
        }
        this.updatePaginatedList();
      }
    }
  }
  getBarDistribution(pBar1CT: any, pBar2CT: any, pResult: any) {
    var lTotal = pBar1CT + pBar2CT;
    var lDis1 = Math.floor(lTotal / pBar2CT);
    this.lDist = [];
    var lOK = 0;
    for (let i = 0; i < lTotal; i++) {
      if ((i + 1) % lDis1 == 0 && lOK < pBar2CT) {
        lOK++;
        this.lDist.push(1);
      } else {
        this.lDist.push(0);
      }
    }
    if (pBar2CT > 0) {
      var lRem1 = lTotal % pBar2CT;
      if (lRem1 > 1) {
        this.getBarDist(lTotal - lRem1, lRem1, this.lDist);
      }
    }
  }

  getBarDist(pBar1CT: any, pBar2CT: any, pResult: any) {
    var lTotals = pBar1CT + pBar2CT;
    var lDis1 = Math.floor(lTotals / pBar2CT);

    for (let i = 0; i < pBar2CT; i++) {
      //pResult.splice((i + 1) * lDis1, 0, 0);
      this.lDist.splice(i * lDis1, 0, 0);
    }
    if (this.lDist.length > lTotals) {
      this.lDist.splice(lTotals, this.lDist.length - lTotals);
    }
    var lRem1 = lTotals % pBar2CT;
    var lHave = 0;
    for (let i = lTotals; i > lTotals - lRem1; i--) {
      if (this.lDist[i] == 1) {
        lHave = 1;
        break;
      }
    }
    if (lRem1 > 1 && lHave == 0) {
      this.getBarDist(lTotals - lRem1, lRem1, this.lDist);
    }
  }
  generatetabledoubleList(): void {
    debugger;

    this.innerList = this.innerList.length > 0 ? this.innerList :[];
    this.outerList = this.outerList.length > 0 ? this.outerList :[];
    this.mainbarType = this.Insert_BPC_Structuremarking.main_bar_type;
    const rawCT = this.Insert_BPC_Structuremarking.main_bar_ct.toString();
    const barCTs = rawCT.includes(',')
      ? rawCT.split(',').map((val: string) => parseInt(val.trim()))
      : [Math.floor(parseInt(rawCT) / 2), Math.ceil(parseInt(rawCT) / 2)];

    if (this.Insert_BPC_Structuremarking.main_bar_arrange === 'In-Out') {
      this.layerBarCount = Math.floor((barCTs[0] + barCTs[1]) / 2);
    } else {
      this.layerBarCount =
        this.selectedLayer === 'OuterLayer' ? barCTs[0] : barCTs[1];
    }

    const origX = 120;
    const origY = 120;
    const lMainBarDia = 5;
    let outerBarAngleIncrement = 360 / barCTs[0];
    let currentAngle = 0;
    // this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON = null;
    if (this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON)
    {
      const mainJson = JSON.parse(this.Insert_BPC_Structuremarking.vchCustomizeBarsJSON);
      let loop1 = mainJson.loop1;
      let loop2 = mainJson.loop2;
      if (this.pileType === 'Double-Layer' && this.mainbarArrange === 'Side-By-Side'){
        loop1 = mainJson.loop2;
        loop2 = mainJson.loop1;
      }
      let pArrangement = this.Insert_BPC_Structuremarking.main_bar_arrange;
      if (mainJson.PileType == 'Double-Layer' && pArrangement == "Side-By-Side" && loop2.length > 1 )
      {
        if(this.Insert_BPC_Structuremarking.main_bar_arrange=="Side-By-Side") //SIde-By-Side Outer List
        {
          outerBarAngleIncrement = 360 / (barCTs[0]/2);
          let j=1;
          let k=0;
          if (this.outerList.length == 0){
            for (let i = 0; i < loop2.length/2; i++)
            {
              this.outerList.push({
                id: j++,
                angle: Math.round(currentAngle),
                selected: loop2[k++].selected,
                layer: 'outer',
              });
              this.outerList.push({
                id: j++,
                angle: Math.round(currentAngle+4),
                selected: loop2[k++].selected,
                layer: 'outer',
              });
              currentAngle += outerBarAngleIncrement;
            }
          }

        }
        else{
        this.outerList = this.outerList.length > 1 ? this.outerList : loop2;
        }
      }
      else {
        if (this.outerList.length == 0) {
          for (let i = 0; i < loop2.length; i++) {
            this.outerList.push({
              id: i + 1,
              angle: Math.round(loop2[i].angle),
              selected: loop2[i].selected,
              layer: 'outer',
            });
            //currentAngle += outerBarAngleIncrement;
          }
        }
      }

      if ( mainJson.PileType == 'Double-Layer' && pArrangement == "Side-By-Side" && loop1.length > 1)
      {
        if(this.Insert_BPC_Structuremarking.main_bar_arrange=="Side-By-Side") //Side-By-Side InnerList
        {
          const innerBarAngleIncrement = 360 / (barCTs[1]/2);
          let innerCurrentAngle = 0;
          let j=1;
          let k=0;
          if (this.innerList.length == 0) {
            for (let i = 0; i< loop1.length/2;i++)
            {
              this.innerList.push({
                id: j++,
                angle: Math.round(innerCurrentAngle),
                selected: loop1[k++].selected,
                layer: 'inner',
              });
              this.innerList.push({
                id: j++,
                angle: Math.round(innerCurrentAngle+4),
                selected: loop1[k++].selected,
                layer: 'inner',
              });
              innerCurrentAngle += innerBarAngleIncrement;
            }
          }
        }
        else
        {
          this.innerList = this.innerList.length > 1 ? this.innerList : loop1;
        }
      }
      else
      {
        const innerBarAngleIncrement = 360 / barCTs[1];
        let innerCurrentAngle = 0;
        if (this.innerList.length == 0) {
          for (let i = 0; i < loop1.length; i++) {
            this.innerList.push({
              id: i + 1,
              angle: Math.round(loop1[i].angle),
              selected: loop1[i].selected,
              layer: 'inner',
            });
            //innerCurrentAngle += innerBarAngleIncrement;
          }
        }
      }
    }
    //for Double-layer Sise-By-Side
    else if(this.Insert_BPC_Structuremarking.pile_type == "Double-Layer" && this.Insert_BPC_Structuremarking.main_bar_arrange=="Side-By-Side")
    {

     outerBarAngleIncrement = 360 / (barCTs[0]/2);
      if (this.outerList.length == 0)
      {
       let j=1;
        for (let i = 0; i < barCTs[0]/2; i++) {
          this.outerList.push({
            id: j++,
            angle: Math.round(currentAngle),
            selected: this.selected,
            layer: 'outer',
          });
          this.outerList.push({
            id: j++,
            angle: Math.round(currentAngle+4),
            selected: this.selected,
            layer: 'outer',
          });
          currentAngle += outerBarAngleIncrement;
        }
      }
      const innerBarAngleIncrement = 360 / (barCTs[1]/2);
      let innerCurrentAngle = 0;
      if (this.innerList.length == 0) {
        let j=1;
        for (let i = 0; i< parseInt(this.Insert_BPC_Structuremarking.main_bar_ct.toString().split(',')[1])/2;i++)
        {
          this.innerList.push({
            id: j++,
            angle: Math.round(innerCurrentAngle),
            selected: this.selected,
            layer: 'inner',
          });

          this.innerList.push({
            id: j++,
            angle: Math.round(innerCurrentAngle+4),
            selected: this.selected,
            layer: 'inner',
          });
          innerCurrentAngle += innerBarAngleIncrement;
        }
      }
    }
    else
    {
      if (this.outerList.length == 0) {
        for (let i = 0; i < barCTs[0]; i++) {
          this.outerList.push({
            id: i + 1,
            angle: Math.round(currentAngle),
            selected: this.selected,
            layer: 'outer',
          });
          currentAngle += outerBarAngleIncrement;
        }
      }
      const innerBarAngleIncrement = 360 / barCTs[1];
      let innerCurrentAngle = 0;
      if (this.innerList.length == 0) {
        for (let i = 0; i < barCTs[1]; i++ ) {
          this.innerList.push({
            id: i + 1,
            angle: Math.round(innerCurrentAngle),
            selected: this.selected,
            layer: 'inner',
          });
          innerCurrentAngle += innerBarAngleIncrement;
        }
      }
    }



    // this.innerList = [];
    // this.outerList = [];

    // let lBarCTs = this.Insert_BPC_Structuremarking.main_bar_ct.toString().split(',');
    // let totalBars = parseInt(lBarCTs[0]) + parseInt(lBarCTs[1]); // total bars in both layers
    // let mainBarAngle = 360 / parseInt(lBarCTs[0]); // base angle for outer
    // let innerBarAngle = 360 / parseInt(lBarCTs[1]); // base angle for inner
    // let j = 1;

    // // OUTER layer side-by-side bars
    // let angle = 0;
    // for (let i = 0; i < parseInt(lBarCTs[0]); i++) {
    //   this.outerList.push({
    //     id: j++,
    //     angle: Math.round(angle),
    //     selected: this.selected,
    //     layer: 'outer',
    //   });
    //   this.outerList.push({
    //     id: j++,
    //     angle: Math.round(angle + 4),
    //     selected: this.selected,
    //     layer: 'outer',
    //   });
    //   angle += mainBarAngle;
    // }

    // // INNER layer side-by-side bars
    // angle = 0;
    // for (let i = 0; i < parseInt(lBarCTs[1]); i++) {
    //   this.innerList.push({
    //     id: j++,
    //     angle: Math.round(angle),
    //     selected: this.selected,
    //     layer: 'inner',
    //   });
    //   this.innerList.push({
    //     id: j++,
    //     angle: Math.round(angle + 4),
    //     selected: this.selected,
    //     layer: 'inner',
    //   });
    //   angle += innerBarAngle;
    // }

    //   }


    // this.paginatedMachineList = this.machineList;
    this.createMainDoubleBarImage();
  }

 onLayerChange(): void {
  this.generatetabledoubleList();
  setTimeout(() => this.updateMainToggleState(), 0);
}
  createMainBarImage(): void {
    debugger;
    const ctx = this.canvas.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Canvas context not available.');
      return;
    }

    const centerX = 200;
    const centerY = 200;
    const outerRadius = 150;
    const innerRadius = 140;

    const myBlackPen = 'black';
    const myGrayPen = 'gray';
    const myBluePen = 'blue';
    const myRedPen = 'red';
    const myGreenPen = 'green';

    // Clear previous drawings
    ctx.clearRect(0, 0, 400, 400);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = myBlackPen;
    ctx.stroke();

    // Draw main bars (Single or Mixed - In Out)
    // if (this.Insert_BPC_Structuremarking.main_bar_arrange == 'In-Out') {
    //   this.machineList.forEach((bar: any, index: number) => {
    //     const angleInRadians = (bar.angle - 90) * (Math.PI / 180);
    //     let xOuter;
    //     let yOuter;
    //     if (bar.isInnerLayer) {
    //       xOuter = centerX + innerRadius * Math.cos(angleInRadians);
    //       yOuter = centerY + innerRadius * Math.sin(angleInRadians);
    //     } else {
    //       xOuter = centerX + outerRadius * Math.cos(angleInRadians);
    //       yOuter = centerY + outerRadius * Math.sin(angleInRadians);
    //     }

    //     if (!bar.selected) {
    //       ctx.strokeStyle = myBlackPen;
    //       ctx.lineWidth = 2;
    //       ctx.beginPath();
    //       ctx.moveTo(xOuter - 5, yOuter - 5);
    //       ctx.lineTo(xOuter + 5, yOuter + 5);
    //       ctx.moveTo(xOuter + 5, yOuter - 5);
    //       ctx.lineTo(xOuter - 5, yOuter + 5);
    //       ctx.stroke();
    //     } else {
    //       // Draw regular filled circle for enabled bars
    //       ctx.beginPath();
    //       ctx.arc(xOuter, yOuter, 6, 0, 2 * Math.PI);
    //       ctx.fillStyle =
    //         this.mainbarType === 'Mixed' && bar.isInnerLayer
    //           ? myGreenPen
    //           : myRedPen;
    //       ctx.fill();
    //     }

    //     // Draw ID label
    //     ctx.font = 'bold 14px Arial';
    //     ctx.fillStyle = myBluePen;
    //     ctx.fillText(bar.id.toString(), xOuter - 6, yOuter - 6);
    //   });
    // }

    this.machineList.forEach((bar: any, index: number) => {
      const angleInRadians = (bar.angle - 90) * (Math.PI / 180);
      const xOuter = centerX + outerRadius * Math.cos(angleInRadians);
      const yOuter = centerY + outerRadius * Math.sin(angleInRadians);

      if (!bar.selected) {
        ctx.strokeStyle = myBlackPen;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xOuter - 5, yOuter - 5);
        ctx.lineTo(xOuter + 5, yOuter + 5);
        ctx.moveTo(xOuter + 5, yOuter - 5);
        ctx.lineTo(xOuter - 5, yOuter + 5);
        ctx.stroke();
      } else {
        // Draw regular filled circle for enabled bars
        ctx.beginPath();
        ctx.arc(xOuter, yOuter, 6, 0, 2 * Math.PI);

        if (this.pileType.trim().toLowerCase() === 'single-layer') {
          if (this.mainbarType === 'Mixed') {
            ctx.fillStyle =
              this.mainbarType === 'Mixed' && index % 2 === 0
                ? myRedPen
                : myGreenPen;
          } else {
            ctx.fillStyle = myRedPen;
          }
        } else if (this.pileType.trim().toLowerCase() === 'double-layer') {
          ctx.fillStyle =
            this.selectedLayer === 'OuterLayer' ? myRedPen : myGreenPen;
        } else {
          ctx.fillStyle = myRedPen;
        }

        ctx.fill();
      }

      // Draw ID label
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = myBluePen;
      ctx.fillText(bar.id.toString(), xOuter - 6, yOuter - 6);
    });

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(400, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, 400);
    ctx.strokeStyle = myBlackPen;
    ctx.stroke();

    // Convert canvas to image URL
    this.imageSrc = this.canvas.nativeElement.toDataURL('image/png');
  }

  // createMainDoubleBarImage(): void {
  //   debugger;
  //   const ctx = this.canvas.nativeElement.getContext('2d');

  //   if (!ctx) {
  //     console.error('Canvas context not available.');
  //     return;
  //   }

  //   const centerX = 200;
  //   const centerY = 200;
  //   const outerRadius = 150;
  //   const innerRadius = 130;

  //   const myBlackPen = 'black';
  //   const myGrayPen = 'gray';
  //   const myBluePen = 'blue';
  //   const myRedPen = 'red';
  //   const myGreenPen = 'green';

  //   // Clear previous drawings
  //   ctx.clearRect(0, 0, 400, 400);

  //   // Draw outer circle
  //   ctx.beginPath();
  //   ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  //   ctx.fillStyle = 'white';
  //   ctx.fill();
  //   ctx.lineWidth = 2;
  //   ctx.strokeStyle = myBlackPen;
  //   ctx.stroke();

  //   let list =
  //     this.selectedLayer === 'OuterLayer' ? this.outerList : this.innerList;
  //   // Draw main bars (Outer Layer)
  //   list.forEach((bar: any, index: number) => {
  //     debugger;
  //     const angleInRadians = (bar.angle - 90) * (Math.PI / 180);
  //     const xOuter = centerX + outerRadius * Math.cos(angleInRadians);
  //     const yOuter = centerY + outerRadius * Math.sin(angleInRadians);

  //     if (!bar.selected) {
  //       ctx.strokeStyle = myBlackPen;
  //       ctx.lineWidth = 2;
  //       ctx.beginPath();
  //       ctx.moveTo(xOuter - 5, yOuter - 5);
  //       ctx.lineTo(xOuter + 5, yOuter + 5);
  //       ctx.moveTo(xOuter + 5, yOuter - 5);
  //       ctx.lineTo(xOuter - 5, yOuter + 5);
  //       ctx.stroke();
  //     } else {
  //       // Draw regular filled circle for enabled bars
  //       ctx.beginPath();
  //       ctx.arc(xOuter, yOuter, 6, 0, 2 * Math.PI);

  //       if (this.pileType.trim().toLowerCase() === 'single-layer') {
  //         if (this.mainbarType === 'Mixed' && this.mainbarArrange != 'In-Out') {
  //           ctx.fillStyle =
  //             this.mainbarType === 'Mixed' && index % 2 === 0
  //               ? myRedPen
  //               : myGreenPen;
  //         } else if (
  //           (this.mainbarType == 'Single' || this.mainbarType === 'Mixed') &&
  //           this.mainbarArrange === 'In-Out'
  //         ) {
  //           ctx.fillStyle =
  //             this.selectedLayer === 'OuterLayer' ? myRedPen : myGreenPen;
  //         } else {
  //           ctx.fillStyle = myRedPen;
  //         }
  //       } else if (this.pileType.trim().toLowerCase() === 'double-layer') {
  //         ctx.fillStyle =
  //           this.selectedLayer === 'OuterLayer' ? myRedPen : myGreenPen;
  //       } else {
  //         ctx.fillStyle = myRedPen;
  //       }

  //       ctx.fill();
  //     }

  //     // Draw ID label
  //     ctx.font = 'bold 14px Arial';
  //     ctx.fillStyle = myBluePen;
  //     ctx.fillText(bar.id.toString(), xOuter - 6, yOuter - 6);
  //   });

  //   // Draw axes
  //   ctx.beginPath();
  //   ctx.moveTo(0, centerY);
  //   ctx.lineTo(400, centerY);
  //   ctx.moveTo(centerX, 0);
  //   ctx.lineTo(centerX, 400);
  //   ctx.strokeStyle = myBlackPen;
  //   ctx.stroke();

  //   // Convert canvas to image URL
  //   this.imageSrc = this.canvas.nativeElement.toDataURL('image/png');
  // }
  createMainDoubleBarImage(): void {
  const ctx = this.canvas.nativeElement.getContext('2d');
  if (!ctx) return;

  const centerX = 200;
  const centerY = 200;
  const outerRadius = 150;
  const innerRadius = 130;
  const myBlackPen = 'black';

  ctx.clearRect(0, 0, 400, 400);

  // Draw Outer Circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Draw Inner Circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'gray';
  ctx.stroke();

  // Draw both layers
  this.drawBars(ctx, this.outerList, outerRadius, 'OuterLayer');
  this.drawBars(ctx, this.innerList, innerRadius, 'InnerLayer');
    //   // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(400, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, 400);
    ctx.strokeStyle = myBlackPen;
    ctx.stroke();

  this.imageSrc = this.canvas.nativeElement.toDataURL('image/png');
}

drawBars(ctx: CanvasRenderingContext2D, list: any[], radius: number, layer: string) {
  const centerX = 200;
  const centerY = 200;

  list.forEach((bar, index) => {
    const angle = (bar.angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Draw enabled/disabled
    ctx.beginPath();
    if (!bar.selected) {
      ctx.moveTo(x - 5, y - 5);
      ctx.lineTo(x + 5, y + 5);
      ctx.moveTo(x + 5, y - 5);
      ctx.lineTo(x - 5, y + 5);
      ctx.strokeStyle = 'black';
      ctx.stroke();
    } else {
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = layer === 'OuterLayer' ? 'red' : 'green';
      ctx.fill();
    }

    // Bar ID
    ctx.fillStyle = 'blue';
    ctx.fillText(bar.id, x - 6, y - 6);
  });
}
  templateChange(event: any) {
    console.log('templateChange=>', event);
  }

  onPageChange(pageNum: number): void {
    this.currentPage = pageNum;
    this.updatePaginatedList();
  }

  OnPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Reset to first page when changing page size
    this.updatePaginatedList();
  }

  updatePaginatedList(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMachineList = this.machineList.slice(startIndex, endIndex);
  }
  getMainBarCountUpdate(){
    let count1:any = '';
    let count_no:any = '';
    let count2 :any="";
    if(this.loop2 && this.loop2.length > 0){
      count2 = this.loop2.filter((bar: any) => bar.selected).length.toString();

      count_no = count_no + ',' + this.loop2.length.toString();
      if(this.Insert_BPC_Structuremarking.main_bar_type == 'Single' && this.Insert_BPC_Structuremarking.pile_type == "Single-Layer"){
        count1 = (parseInt(count1.split(',')[0]) + parseInt(count1.split(',')[1])).toString();
        count_no = (parseInt(count_no.split(',')[0]) + parseInt(count_no.split(',')[1])).toString();
      }
    }
    if(this.loop1 && this.loop1.length > 0){
      count1 = this.loop1.filter((bar: any) => bar.selected).length.toString();
      count_no = this.loop1.length.toString();
      if(count2 != ""){
        count1 = count1 + ',' + count2;
        if(this.Insert_BPC_Structuremarking.main_bar_arrange == "In-Out" && this.Insert_BPC_Structuremarking.main_bar_type == 'Single' && this.Insert_BPC_Structuremarking.pile_type == "Single-Layer"){
          count1 = (parseInt(count1.split(',')[0]) + parseInt(count1.split(',')[1])).toString();
          count_no = this.loop1.length + this.loop2.length;
        }
      }
      if(this.Insert_BPC_Structuremarking.main_bar_type == 'Mixed'){
        if(this.Insert_BPC_Structuremarking.main_bar_arrange != "In-Out"){
          count1 = Math.floor(count1/2).toString() + ',' + Math.ceil(count1/2).toString();
          count_no = Math.floor(this.loop1.length/2).toString() + ',' + Math.ceil(this.loop1.length/2).toString();
        }else{
          count_no = (this.loop2.length).toString() + ',' + (this.loop1.length).toString();
        }
      }
    }

    if(this.Insert_BPC_Structuremarking.pile_type == "Double-Layer" && this.Insert_BPC_Structuremarking.main_bar_arrange == "Single"){
      count_no = this.loop1.length.toString() + ',' + this.loop2.length.toString();
    }
    if(this.Insert_BPC_Structuremarking.main_bar_arrange == "Side-By-Side"){
      if(this.Insert_BPC_Structuremarking.pile_type == "Double-Layer"){
        let c1 = this.loop1.filter((bar: any) => bar.selected).length;
        let c2 = this.loop2.filter((bar: any) => bar.selected).length;
        let c3 = this.loop2.length - c2
        let c4 = this.loop1.length-c1;
        count1 = c2.toString() + ',' + c1.toString();
        count_no = (this.loop2.length).toString() + ',' + (this.loop1.length).toString();
      }else if(this.Insert_BPC_Structuremarking.pile_type == "Single-Layer" && this.Insert_BPC_Structuremarking.main_bar_type == "Mixed"){
        let c1 = this.machineList.filter((bar: any) => bar.selected).length;
        // let c2 = this.machineList.length - c1;
        count1 = Math.floor(c1/2).toString() + ',' + Math.ceil(c1/2).toString();
        count_no = Math.floor(this.machineList.length/2).toString() + ',' + Math.ceil(this.machineList.length/2).toString();
      }else{
        let c1 = this.machineList.filter((bar: any) => bar.selected).length;
        let c2 = this.machineList.length;
        count1 = c1.toString();
        count_no = c2.toString();
      }

    }
    this.main_bar_ct_to_update = count1;
    this.noOfMainBarToUpdate = count_no;

    console.log('this.main_bar_ct_to_update=>', this.main_bar_ct_to_update);
    console.log('this.noOfMainBarToUpdate=>', this.noOfMainBarToUpdate);
  }

toggleAll(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  this.allSelected = checked;
  if (this.pileType !== 'Double-Layer' && this.Insert_BPC_Structuremarking.main_bar_arrange !== 'In-Out') {
    this.machineList.forEach((bar:any) => (bar.selected = checked));
  } else if (this.selectedLayer === 'OuterLayer') {
    this.outerList.forEach((bar:any) => (bar.selected = checked));
  } else {
    this.innerList.forEach((bar:any) => (bar.selected = checked));
  }
  if (this.pileType == 'Double-Layer' || this.Insert_BPC_Structuremarking.main_bar_arrange == 'In-Out') {
    this.createMainDoubleBarImage();
  } else {
    this.createMainBarImage();
  }

}

updateMainToggleState(): void {
  let activeList: any[] = [];
  if (this.pileType !== 'Double-Layer' && this.Insert_BPC_Structuremarking.main_bar_arrange !== 'In-Out') {
    activeList = this.machineList;
  } else if (this.selectedLayer === 'OuterLayer') {
    activeList = this.outerList;
  } else {
    activeList = this.innerList;
  }
  this.allSelected = activeList.some(bar => bar.selected);
}
}
