import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BPCService } from '../../../MeshDetailing/bpc.service';

@Component({
  selector: 'app-machine-type',
  templateUrl: './machine-type.component.html',
  styleUrls: ['./machine-type.component.css'],
})
export class MachineTypeComponent {
  @ViewChild('canvasElement', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @Input() Insert_BPC_Structuremarking: any;
  @Input() ParameterValues: any;
  @Input() commonPopupModel: any;
  machineList: any = [];
  mainBarQty = 0;
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
  schnellArray1:any = [];
  schnellArray2:any = [];
  isVisible:boolean=false;
  schnellArray3:any = [];
  constructor(
    public activeModal: NgbActiveModal,
    private BPCService: BPCService
  ) {}
  ngOnInit() {
    // this.drawOnCanvas();
    debugger;
    this.mainBarQty = this.Insert_BPC_Structuremarking.tntNumOfMainBar;
    this.MachineTypeId = this.Insert_BPC_Structuremarking.MachineTypeId;
    this.totalNoOfMainbar =
      this.mainBarQty > 0 ? (this.mainBarQty > 10 ? this.mainBarQty : 10) : 0;
    if (
      this.MachineTypeId == 3 ||
      this.MachineTypeId == 5 ||
      this.MachineTypeId == 6
    ) {
      this.isVisible=false;
      this.generateTable();
    } else {
      this.isVisible=true;
      this.loadTemplateData();
    }
    if(localStorage.getItem('machineList')){
      this.machineList = JSON.parse(localStorage.getItem('machineList')!);
    }else if(this.Insert_BPC_Structuremarking.vchTactonConfigurationState){
      if(this.Insert_BPC_Structuremarking.vchTactonConfigurationState.hasOwnProperty('machineList')){
        this.machineList = this.Insert_BPC_Structuremarking.vchTactonConfigurationState.machineList
      }
    }
  }
  loadTemplateData() {
    this.Load_GetSchnellTemplates();
  }
  dismissModal() {
    this.activeModal.dismiss('User closed modal!');
  }
  generateTable() {
    if (this.totalNoOfMainbar > 0) {
      if (
        this.Insert_BPC_Structuremarking.intStructureMarkId &&
        this.Insert_BPC_Structuremarking.vchTactonConfigurationState != ''
      ) {
        this.mainbarlist =
          this.Insert_BPC_Structuremarking.vchTactonConfigurationState.mainbarList;
      } else {
        if (localStorage.getItem('MainBarList')) {
          this.mainbarlist = JSON.parse(localStorage.getItem('MainBarList')!);
        }
      }
      this.cover =
        Number(this.Insert_BPC_Structuremarking.numPileDia) -
        Number(2 * Number(this.Insert_BPC_Structuremarking.intCoverToLink));
      let customArray: number[] = [];

      if (360 % this.totalNoOfMainbar === 0) {
        const firstbar = 360 / this.totalNoOfMainbar;
        for (let index = 1; index <= this.totalNoOfMainbar; index++) {
          customArray.push(firstbar * index);
        }
      } else {
        const prevNumber = Math.floor(360 / this.totalNoOfMainbar);
        const nextNumber = Math.ceil(360 / this.totalNoOfMainbar);
        let rem1 = nextNumber * this.totalNoOfMainbar;
        let secondAngleNumber = 0;
        let firstAngleNumber = 0;
        let rem2 = 0;

        if (rem1 > 360) {
          for (let index = this.totalNoOfMainbar; index >= 1; index--) {
            rem2 = 360 - nextNumber * index;
            if (rem2 % prevNumber === 0) {
              secondAngleNumber = rem2 / prevNumber;
              firstAngleNumber = index;
              break;
            }
          }
        }

        for (let index = 1; index <= firstAngleNumber; index++) {
          customArray.push(nextNumber * index);
        }

        let highestFirstAngle = firstAngleNumber * nextNumber;
        for (let index = 1; index <= secondAngleNumber; index++) {
          const secondAngles = highestFirstAngle + prevNumber;
          highestFirstAngle = secondAngles;
          customArray.push(secondAngles);
        }
      }

      for (let index = 0; index < customArray.length; index++) {
        this.mainBarPositionPart = Math.round(this.level * customArray[index]);
        this.chordLength =
          ((2 * 3.14 * this.cover) / (360 * 2)) * this.mainBarPositionPart;
        let obj = {
          size: this.mainbarlist
            ? this.mainbarlist[0].main_bar_part_grade_field +
              '' +
              this.mainbarlist[0].main_bar_part_dia_field
            : 0,
          angle: this.mainBarPositionPart,
          chordLength: this.chordLength,
        };
        this.machineList.push(obj);
        this.anglesForManual.push(Number(this.mainBarPositionPart));
      }
      sessionStorage.setItem(
        'holeConfigList',
        JSON.stringify(this.mainBarPositionPart)
      );
    }
  }

  templateChange(event: any) {
    console.log('templateChange=>', event);
    // const match = event.match(/\((\d+)\)/);
    // if (match) {
    //   const number = parseInt(match[1], 10);
    //   console.log(number); // Output: 20
    // }
  }

  createHoleConfigurationImage(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Canvas context not available.');
      return;
    }

    const centerX = 200;
    const centerY = 200;
    const radius = 150;

    // Draw a black circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw hole configuration
    const holeConfigurationList: number[] = this.anglesForManual;

    if (holeConfigurationList.length > 0) {
      let intCounter = 1;

      for (
        let intCount = 0;
        intCount < holeConfigurationList.length;
        intCount++
      ) {
        // const beta = parseInt(holeConfigurationList[intCount + 3].split(';')[1], 10);
        const beta = holeConfigurationList[intCount];

        const x = centerX + radius * Math.cos((beta + 270) * (Math.PI / 180));
        const y = centerY + radius * Math.sin((beta + 270) * (Math.PI / 180));

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(400, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, 400);
        ctx.strokeStyle = 'gray';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'dimgray';
        ctx.fill();
        ctx.strokeStyle = 'red';
        ctx.stroke();

        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'blue';
        ctx.fillText(intCounter.toString(), x - 6, y - 6);

        intCounter++;
      }
    }
  }

  canavsPreivew() {
    if (
      this.MachineTypeId == 3 ||
      this.MachineTypeId == 5 ||
      this.MachineTypeId == 6
    ) {
      this.createHoleConfigurationImage();
      // this.Insert_BPC_Structuremarking.intShenellTemplateId = null;
      // this.Insert_BPC_Structuremarking.vchShenellAlternateTemplates = null;
    } else {
       this.createSchnellMachineImage();
    }
  }

  Load_GetSchnellTemplates() {
    this.BPCService.GetSchnellTemplates().subscribe({
      next: (response) => {
        debugger;
        this.templateList = response;
      },
      error: (e) => {},
      complete: () => {
        if(this.Insert_BPC_Structuremarking.intShenellTemplateId == ""){
          this.Insert_BPC_Structuremarking.intShenellTemplateId =
            this.templateList[0].intTemplateID;
        }
      },
    });
  }
  getAllDetails(){
    if(!this.Insert_BPC_Structuremarking.intShenellTemplateId){
      alert("Please select template!");
    }else if(!this.Insert_BPC_Structuremarking.intShenellTemplateId){
      alert("Please enter template text!")
    }else if( this.detailsCount == 0){
      alert("Please enter details value!")
    }else{
      this.getSchnellTemplateData();
    }
  }

  getSchnellTemplateData() {
    let findedData = this.templateList.find((i:any) => i.intTemplateID === this.Insert_BPC_Structuremarking.intShenellTemplateId);

    this.BPCService.getScnellTableData(Number(this.detailsCount),findedData.vchTemplateCode).subscribe({
      next: (response) => {
        this.schnellArray1 = response[0];
        this.schnellArray2 =  response[1];
        this.schnellArray3 =  response[2];
      },
      error: (e) => {},
      complete: () => {
        this.createSchnellBpcTable();
      },
    });
  }

  createSchnellBpcTable(){
    this.machineList = [];
    if (
      this.Insert_BPC_Structuremarking.intStructureMarkId &&
      this.Insert_BPC_Structuremarking.vchTactonConfigurationState != ''
    ) {
      this.mainbarlist =
        this.Insert_BPC_Structuremarking.vchTactonConfigurationState.mainbarList;
    } else {
      if (localStorage.getItem('MainBarList')) {
        this.mainbarlist = JSON.parse(localStorage.getItem('MainBarList')!);
      }
    }
    if(this.schnellArray1.length > 0){
      this.schnellArray1.forEach((element:any) => {
        let obj = {
          size: this.mainbarlist
            ? this.mainbarlist[0].main_bar_part_grade_field +
              '' +
              this.mainbarlist[0].main_bar_part_dia_field
            : 0,
          angle: element.intHolePosition,
          chordLength: this.chordLength,
        };
        this.machineList.push(obj);
      });
      localStorage.setItem("machineList",JSON.stringify(this.machineList));
    }
  }

   createSchnellMachineImage(): void {

    const ctx = this.canvas.nativeElement.getContext('2d');


    if (!ctx) {
      console.error("Canvas context not available.");
      return;
    }

    let holesPositions: number[] = [/* Add your hole positions data here */];
    let alBarPositions: string[] = [/* Add your bar positions data here */];

    this.schnellArray3.forEach((element: any) => {
      holesPositions.push(Number(element.intHolePosition))

    });

    this.schnellArray1.forEach((element: any) => {
      alBarPositions.push(element.intHolePosition.toString())

    });
    const templateName = this.schnellArray2[0].vchTemplateName; // Replace with your actual template name
    const imgId = "YourImageId"; // Replace with your actual image ID

    const myBlackPen = 'black';
    const myGrayPen = 'gray';
    const myBluePen = 'blue';
    const myTwinPen = 'dimgray';
    const myRedPen = 'red';

    // Your drawing logic here
    const centerX = 200;
    const centerY = 200;
    const radius = 150;

    // Draw a black circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = myBlackPen;
    ctx.stroke();

    // Draw hole positions
    holesPositions.forEach((beta: number, index: number) => {
      const x = centerX + radius * Math.cos((beta + 270) * (Math.PI / 180));
      const y = centerY + radius * Math.sin((beta + 270) * (Math.PI / 180));

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = myRedPen;
      ctx.fill();

      if (alBarPositions.includes(beta.toString())) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = myTwinPen;
        ctx.fill();
      }

      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = myBluePen;
      ctx.fillText((index + 1).toString(), x - 6, y - 6);
    });

    // Draw axes and template name
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(400, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, 400);
    ctx.strokeStyle = myGrayPen;
    ctx.stroke();

    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(templateName, centerX - 40, centerY - 20);

    // Save the image (you might need to handle this differently in Angular)
    // const strImagePath = `images/SchnellMachineImages/${imgId}.gif`;
    // const img = new Image();
    // img.src = canvas.toDataURL("image/gif");
    // document.body.appendChild(img); // Display the image (for testing)
  }
}
