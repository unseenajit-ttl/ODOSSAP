import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dataTransferService } from 'src/app/SharedServices/dataTransferService';
import { detailingslabbom } from 'src/app/Model/detailingslabbom';
import { DetailingService } from '../DetailingService';
import { ViewChild, ElementRef } from '@angular/core';
import { max } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UpdateProdBOM } from 'src/app/Model/UpdateProdBOM';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-bom.',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.css']
})
export class BomComponent implements OnInit {

  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ImagePath: string = '';
  ShapeParamDetails: any[] = []
  Raw_material = ''
  Image2MR1: string = ''
  Image2M12: string = ''
  SlabGroupForm!: FormGroup;
  Imagename: any;
  SlabData: any[] = [];
  ProductionData: any[] = [];
  wire_type_data: any[] = [{ 'Key': 'C' }, { 'Key': 'M' }];
  Raw_Material_data: any[] = [];
  No_MainWires: any = 0;
  No_CrossWires: any = 0;
  newSlabData: any[] = [{
    Wire_Type: 'C',
    Line_No: 0,
    No_Pitches: '',
    Wire_Space: '',
    Wire_Len: 0,
    Wire_Dia: '',
    Raw_Material: '',
    editFieldName: '',
    varRowIndex: -1,

  }]
  Canvas_height: any;
  Canvas_width: any;
  wire_type_data1: any[] = [];
  RaW_Material_list: any = {
    'M': 'RR10.0HD',
    'C': 'RR14.0HD'
  }

  hfMWSequence = 0
  hfStaggered = 0;
  varStaggeredIndicator = false;



  lblCWLengthVal: any
  varCWLength: any;
  Raw_Material_data1: any[] = [];
  selectparameter: any
  selectparameter2: any
  ProductionVisible: boolean = false
  Detailing: boolean = true
  Queryparameterset: any = null;
  storedObjectData: any;
  MeshData: any;
  BomType = "D";
  BomData: any;
  BomDetails: any[] = [];
  Paramvalues: any;
  ParamDict: any = {};
  Select_wireType: any = {
    "Main_Wire": [],
    "Cross_Wire": []
  };

  intMO1: number = 0;
  intMO2: number = 0;
  intCO1: number = 0;
  intCO2: number = 0;
  CrossWireLength: any = 0;
  MainWireLen: any = 0;
  MainWireInd = 0;
  CrossWireInd = 0;
  headerData: any;
  backup: any;
  ActualWeight: number = 0;
  Marking: any;
  TheroticalWeight: any;
  ProductCode: any;

  customerName: any;
  projectName: any;
  event: any;
  Bending_Vertical: boolean = false;

  Bending_horizontal: boolean = false
  VchBendingGrroup: any[]=[];
  legValue: boolean=false;
  userId:any;
  intRecordCount:number=0;


  constructor(private changeDetectorRef: ChangeDetectorRef,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private loginService: LoginService,
    public httpClient: HttpClient, private location: Location, public route: ActivatedRoute, public router: Router, private formBuilder: FormBuilder,
    private transfereService: dataTransferService, private detailingService: DetailingService) {

    sessionStorage.setItem("displayscreenname", 'Bom')


    // this.SlabGroupForm = this.formBuilder.group({
    //   mesh_ref: new FormControl('2-1', Validators.required),
    //   product_code: new FormControl('WB10', Validators.required),
    //   theoritical: new FormControl('26.900', Validators.required),

    //   actual: new FormControl('29.009', Validators.required),
    // });
  }
  ngOnInit(): void {

    this.userId = this.loginService.GetUserId()
    this.intRecordCount = Number(localStorage.getItem('PostedGM'));


    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.customerName = this.dropdown.getCustomerCode()
    });
    this.reloadService.reload$.subscribe((data) => {
      if (true) {

        this.projectName = this.dropdown.getDetailingProjectId();
        console.log("Changed  Project id=" + this.projectName)


      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });


    this.customerName = this.dropdown.getCustomerCode();
    this.projectName = this.dropdown.getDetailingProjectId();




    this.storedObjectData = localStorage.getItem('BomData');
    this.BomData = JSON.parse(this.storedObjectData);
    console.log(this.BomData);
    this.intCO1 = this.BomData.CO1;
    this.intCO2 = this.BomData.CO2;
    this.intMO1 = this.BomData.MO1;
    this.intMO2 = this.BomData.MO2;

    this.BendingGroup(this.BomData.ShapeID);

    this.Paramvalues = this.BomData.ParamValues.split(';');
    console.log(this.Paramvalues);
    let splliter;
    //  for(let i=0;i<this.Paramvalues.length;i++)
    //  {
    //   splliter = this.BomData.ParamValues.split(';');
    //  }
    this.Paramvalues.forEach((element: any) => {
      ;
      splliter = element.split(':');
      this.ParamDict[splliter[0]] = Number(splliter[1]);
    });
debugger;
let Leg = "Leg"
this.legValue = false;
    console.log("Param Values", this.ParamDict);
    if(Leg in this.ParamDict)
    {
      this.legValue = true;
      }
    this.Imagename = "";
    this.Imagename = this.BomData.ShapeCodeName.trim();
    this.loadMainFile(this.Imagename);
    this.LoadBomDetails("D");
    this.LoadBomDetails("P");



    this.Queryparameterset = '2MR'// this.route.snapshot.params['shape'];


    ///Commented by Vanita

    /// // if (!localStorage.getItem('foo')) {
    /// //   localStorage.setItem('foo', 'no reload');
    /// //   location.reload();
    /// // } else {
    /// //   localStorage.removeItem('foo');
    /// // }

    ///Commented by Vanita
    this.changeDetectorRef.detectChanges();

  }
  loadMainFile(Imagename: any) {
    //;
    this.httpClient.get('/assets/images/Shapes/' + Imagename + '.png').subscribe(() => {
      this.Imagename = Imagename + '.png'
    }, (err) => {
      // HANDLE file not found
      if (err.status === 200) {
        this.Imagename = Imagename + '.png'
      }
      else if (err.status === 404) {
        this.loadSecondFile(Imagename);
      }
    });
  }

  loadSecondFile(Imagename: any) {
    this.httpClient.get('/assets/images/Shapes/' + Imagename + '.PNG').subscribe(() => {
      this.Imagename = Imagename + '.PNG'
    }, (err) => {
      // HANDLE file not found
      if (err.status === 200) {
        this.Imagename = Imagename + '.PNG'
      }
      if (err.status === 404) {

      }
    });
  }


  onSubmit() {

  }
  sortData() {
    this.SlabData[0].sort((a: { Line_No: number; }, b: { Line_No: number; }) => {
      return a.Line_No - b.Line_No;
    });
    this.SlabData[1].sort((a: { Line_No: number; }, b: { Line_No: number; }) => {
      return a.Line_No - b.Line_No;
    });
  }


  updateValueM(item: any) {
    this.SlabData[0].Line_No = item
    console.log(this.SlabData[1].editFieldName)
    this.sortData()
  }

  updateValueC(item: any) {
    this.SlabData[1].Line_No = item
    console.log(this.SlabData[1].editFieldName)
    this.sortData()
  }

  checkRepetition(item: any, wire_type: any) {
    if (wire_type == 'M') {

      for (let i = 0; i < this.SlabData[0].length; i++) {


        if (item == this.SlabData[0][i].Line_No) {
          this.checkRepetition(parseInt(item) + 1, wire_type)
          this.SlabData[0][i].Line_No = parseInt(this.SlabData[0][i].Line_No) + 1
        }
      }
    }
    else {
      for (let i = 0; i < this.SlabData[1].length; i++) {

        if (item == this.SlabData[1][i].Line_No) {
          this.checkRepetition(parseInt(item) + 1, wire_type)
          this.SlabData[1][i].Line_No = parseInt(this.SlabData[1][i].Line_No) + 1
        }
      }
    }
  }

  AddNewSlabData() {
    // condition to fill all the records
    if (this.newSlabData[0].Wire_Type != '' && this.newSlabData[0].Line_No != '' && this.newSlabData[0].No_Pitches != '' && this.newSlabData[0].Wire_Space != '') {
      // //check for repeatinh line number



      // let newLineNo = this.newSlabData[0].Line_No
      // this.checkRepetition(newLineNo, this.newSlabData[0].Wire_Type)

      // // make a new item
      // let newitem = {
      //   Wire_Type: this.newSlabData[0].Wire_Type,
      //   Line_No: this.newSlabData[0].Line_No,
      //   No_Pitches: this.newSlabData[0].No_Pitches,
      //   Wire_Space: this.newSlabData[0].Wire_Space,
      //   //Wire_Len: this.newSlabData[0].Wire_Len,
      //   Wire_Len: (Number(this.newSlabData[0].Wire_Space) * 40),
      //   Wire_Dia: '0',
      //   Raw_Material: this.Raw_material,
      // };
      // console.log(typeof this.newSlabData[0].Wire_Space)

      // // push the new item in the existing list
      // if (this.newSlabData[0].Wire_Type == 'M') {
      //   this.SlabData[0].push(newitem);
      //   // console.log(this.SlabData[0])
      // } else {
      //   this.SlabData[1].push(newitem);
      // }
      // this.sortData()

      // this.newSlabData = [{
      //   Wire_Type: 'C',
      //   Line_No: '',
      //   No_Pitches: '',
      //   Wire_Space: '',
      //   Wire_Len: '',
      //   Wire_Dia: '',
      //   Raw_Material: '',
      //   editFieldName: ''
      // }]
    }
    else {
      alert('Can not add blank record.');

    }
  }
  onEditNew(item: any, field: string) {
    
  if(this.intRecordCount==0)
  {
    
    console.log("jasbkshdm", this.backup)
    this.BomDetails.forEach((_element: any) => {
      _element.editFieldName = false;
    });


    item.editFieldName = field;
  }
  }


  onclick(event: any) {
    // setTimeout(function () {
    // }, 5000);
 
    this.Detailing = !this.Detailing; //not equal to condition
    this.ProductionVisible = !this.ProductionVisible
    if (this.ProductionVisible == true) {
      this.TheroticalWeight = this.headerData.ProductionTheoritialWeight;

      sessionStorage.setItem("displayscreenname", 'BOM')
      this.transfereService.Pagename.next('BOM');

    }
    else {
      this.TheroticalWeight = this.headerData.InvoiceTheoriticalWeight;

      sessionStorage.setItem("displayscreenname", 'BOM')
      this.transfereService.Pagename.next('BOM')

    }
    console.log(this.Detailing)
    console.log(this.ProductionVisible)
  }

  onChangeData(event: any) {
    console.log(typeof event);

    this.Raw_material = this.RaW_Material_list[event];
    console.log(this.Raw_material);

  }
  LoadBomDetails(BomType: any) {

    debugger;
    this.detailingService.Get_BomDetails(this.BomData.ProductMarkId, BomType, this.BomData.StructureElement).subscribe({
      next: (response) => {
        debugger;
        if (BomType == "D")
          this.BomDetails = response;
        else
          this.ProductionData = response;
        console.log("This is BomData", this.BomDetails);
      },
      error: (e) => {
        console.log("error", e);
      },
      complete: () => {
        this.backup = JSON.parse(JSON.stringify(this.BomDetails))
        this.MainWireLen = this.BomDetails[1].decWireLength/* Calculate total width */;
        this.CrossWireLength = this.BomDetails[this.BomDetails.length - 2].decWireLength;

        this.BomDetails.forEach(element => {
          element.editFieldName = false;
        });

        this.newSlabData[0].Raw_Material = this.BomDetails[this.BomDetails.length - 2].vchRawMaterial;
        this.newSlabData[0].Wire_Dia = this.BomDetails[this.BomDetails.length - 2].decWireDiameter;
        this.ChangeRawMaterial(this.newSlabData[0])

        this.MainWireInd = 0;
        this.CrossWireInd = this.No_MainWires;
        this.GetShapeParamDetails(this.BomData.ShapeID, BomType)
        if (BomType == "D") {
          this.No_MainWires = 0;
          this.No_CrossWires = 0;
          for (let i = 0; i < this.BomDetails.length; i++) {
            if (this.BomDetails[i].vchWireType === "M") {
              this.No_MainWires++;
            }
            else {
              this.No_CrossWires++;
            }
          }
        }
        console.log("Main Wire", this.No_MainWires);
        console.log("Cross Wire", this.No_CrossWires);


      },
    });

    this.detailingService.Get_BOMHeader(this.BomData.ProductMarkId, BomType, this.BomData.StructureElement).subscribe({
      next: (response) => {
        this.headerData = response[0];
        this.ActualWeight = this.headerData.ActualTon;
        this.Marking = this.headerData.MarkingName;
        this.ProductCode = this.headerData.vchProductCode;
        if(BomType=='D')
        {
          this.TheroticalWeight = this.headerData.InvoiceTheoriticalWeight;
        }
        if(BomType=='P')
        {
          this.TheroticalWeight = this.headerData.ProductionTheoritialWeight;

        }

        console.log("header Data ", this.headerData);
      },
      error: (e) => {
        console.log("error", e);
      },
      complete: () => {

      },
    });
  }
  InsertBom(item: any) {
    ;
    const insertBom =
    {
      "intProductMarkingId": this.BomData.ProductMarkId,
      "intDetailingBOMDetailId": 0,
      "intMO1": this.intMO1,
      "intMO2": this.intMO2,
      "intCO1": this.intCO1,
      "intCO2": this.intCO2,
      "strStructureElement": this.BomData.StructureElement,
      "BomType": "D",
      "chrWireType": item.Wire_Type,
      "strLineNo": "0",
      "strStartPos": "0",
      "strNoPths": String(item.No_Pitches),
      "strWireSpace": String(item.Wire_Space),
      "strWireLen": "0",
      "strWireDia": String(item.Wire_Dia),
      "strRawMaterial": item.Raw_Material,
      "strRepFrom": "0",
      "strRepTo": "0",
      "strRep": "0",
      "bitTwinWire": "0",
      "intUserId": this.userId.toString()
    }
    this.detailingService.SaveBOM(insertBom).subscribe({
      next: (response) => {
      },
      error: (e) => {
      },

      complete: () => {
        this.Save_PRoductionBOM();
      },
    });

  }

  UpdateBOM(item: any) {



    const insertBom =
    {
      "intProductMarkingId": this.BomData.ProductMarkId,
      "intDetailingBOMDetailId": item.intDetailingBOMDetailId,
      "intMO1": this.intMO1,
      "intMO2": this.intMO2,
      "intCO1": this.intCO1,
      "intCO2": this.intCO2,
      "strStructureElement": this.BomData.StructureElement,
      "BomType": "D",
      "chrWireType": item.vchWireType,
      "strLineNo": String(item.tntWireSequence),
      "strStartPos": "0",
      "strNoPths": String(item.tntNoOfPitch),
      "strWireSpace": String(item.intWirePitch),
      "strWireLen": String(item.decWireLength),
      "strWireDia": String(item.decWireDiameter),
      "strRawMaterial": String(item.vchRawMaterial),
      "strRepFrom": "0",
      "strRepTo": "0",
      "strRep": "0",
      "bitTwinWire": "0",
      "intUserId": this.userId.toString()
    }

    this.detailingService.SaveBOM(insertBom).subscribe({
      next: (response) => {
      },
      error: (e) => {
      },

      complete: () => {
        this.Save_PRoductionBOM();
      },
    });
  }
  GetShapeParamDetails(ShapeID: any, BomType: any) {

    this.detailingService.Get_ShapeParamDetails(ShapeID).subscribe({
      next: (response) => {
        ;
        this.ShapeParamDetails = response;
        console.log("Param Details", this.ShapeParamDetails)

      },
      error: (e) => {
        console.log("error", e);
      },

      complete: () => {
        let keyVal: any = {};
        ;
        if (BomType == 'D') {
          this.Select_wireType['Main_Wire'] = [];
          this.Select_wireType['Cross_Wire'] = [];


          this.ShapeParamDetails.forEach(element => {
            if (element.chrWireType.trim() === "M" && element.chrAngleType.trim() === "S") {
              
              this.Select_wireType['Main_Wire'].push(this.ParamDict[element.chrParamName.trim()])

            }
            if (element.chrWireType.trim() === "C" && element.chrAngleType.trim() === "S") {
              this.Select_wireType['Cross_Wire'].push(this.ParamDict[element.chrParamName.trim()])


            }

          
            console.log("Main Wire fghfj", this.Select_wireType['Main_Wire'])
            console.log("Cross Wire fghfj", this.Select_wireType['Cross_Wire'])
          
          });
debugger;
          if(this.Select_wireType['Main_Wire'].length==0 && this.legValue==true)
          {
            this.Select_wireType['Cross_Wire'].unshift(this.ParamDict['Leg'])
          }
          else  if(this.Select_wireType['Cross_Wire'].length==0 && this.legValue==true)
          {
            this.Select_wireType['Main_Wire'].unshift(this.ParamDict['Leg'])
          }

          this.ngAfterViewInit();
        }


      },
    });
  }

  ngAfterViewInit() {
    ;
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      ;
      let label = "";
      let x = 5;


/* Calculate total height */;
      const totalWidth = this.CrossWireLength / x;
      const totalHeight = this.MainWireLen / x;

      //  overHang started


      if (this.MainWireLen / x > 500 || this.CrossWireLength / x > 500) {
        x = Math.max(this.MainWireLen, this.CrossWireLength) / 500

      }
      var MWspace: number = 0;
      var CWSpace: number = 0;
      let len = 0;


      // Set canvas size to fit content
      canvas.width = totalWidth + 160;
      canvas.height = totalHeight + 160;

      let MoveFactor = 40;


      let MWoverhang = this.BomDetails[0].intWirePitch / x;

      context.strokeStyle = 'black';

      context.lineWidth = 1;

      context.beginPath();

      context.moveTo(MWoverhang + MoveFactor, 0 + MoveFactor); // Starting point (x, y)

      context.lineTo(MWoverhang + MoveFactor, (this.MainWireLen / x) + MoveFactor); // Ending point (x, y)

      context.stroke();



      // vertical lines

      len = MWoverhang;
      for (let j = 1; j <= this.No_MainWires - 2; j++) {
        ;
        MWspace = this.BomDetails[j].intWirePitch / x;

        len += MWspace;

        for (let i = 0; i < this.BomDetails[j].tntNoOfPitch; i++) {
          context.strokeStyle = 'black';
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(len + MoveFactor, 0 + MoveFactor);
          context.lineTo(len + MoveFactor, (this.MainWireLen / x) + MoveFactor);
          context.stroke();
          len += MWspace;
        }
        len -= MWspace
      }



      let CWOverhang = this.BomDetails[this.No_MainWires].intWirePitch / x;



      context.strokeStyle = 'black';

      context.lineWidth = 1;

      context.beginPath();

      context.moveTo(0 + MoveFactor, CWOverhang + MoveFactor); // Starting point (x, y)


      context.lineTo(MoveFactor + this.CrossWireLength / x, CWOverhang + MoveFactor); // Ending point (x, y)

      context.stroke();

      // Draw a horizontal line
      len = CWOverhang;
      for (let j = 1; j <= this.No_CrossWires - 2; j++) {
        CWSpace = this.BomDetails[this.No_MainWires + j].intWirePitch / x;
        len += CWSpace;
        for (let i = 0; i < this.BomDetails[this.No_MainWires + j].tntNoOfPitch; i++) {
          context.strokeStyle = 'black';
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(0 + MoveFactor, len + MoveFactor); // Starting point (x, y)
          context.lineTo(MoveFactor + this.CrossWireLength / x, len + MoveFactor); // Ending point (x, y)
          context.stroke();
          len += CWSpace;

        }
        len -= CWSpace;
      }
      len = 0;
      context.setLineDash([10, 10]);
      // Draw Bending lines

      if(this.Bending_horizontal)
      {
        for (let i = 0; i < this.Select_wireType["Main_Wire"].length - 1; i++) {
          context.strokeStyle = 'red';
  
          context.lineWidth = 2;
  
          context.beginPath();
  
          context.moveTo(MoveFactor, (this.MainWireLen / x) - ((this.Select_wireType["Main_Wire"][i] + len) / x) + MoveFactor); // Starting point (x, y)
  
          console.log("This is bending ", (this.MainWireLen) - ((this.Select_wireType["Main_Wire"][i] + len)))
  
          context.lineTo(MoveFactor + (this.CrossWireLength / x), (this.MainWireLen / x) - ((this.Select_wireType["Main_Wire"][i] + len) / x) + MoveFactor); // Ending point (x, y)
          context.stroke();
          len += this.Select_wireType["Main_Wire"][i];
        };
      }
      else {
        for (let i = 0; i < this.Select_wireType["Main_Wire"].length - 1; i++) {
          context.strokeStyle = 'red';
  
          context.lineWidth = 2;
  
          context.beginPath();
  
          context.moveTo(MoveFactor, ((this.Select_wireType["Main_Wire"][i] + len) / x) + MoveFactor); // Starting point (x, y)
  
  
          context.lineTo(MoveFactor + (this.CrossWireLength / x), ((this.Select_wireType["Main_Wire"][i] + len) / x) + MoveFactor); // Ending point (x, y)
          context.stroke();
          len += this.Select_wireType["Main_Wire"][i];
        };
      }
    


      len = 0;
      if(this.Bending_Vertical)
      {
        for (let i = 0; i < this.Select_wireType["Cross_Wire"].length - 1; i++) {
          context.strokeStyle = 'red';
  
          context.lineWidth = 2;
  
  
          context.beginPath();
  
          context.moveTo((this.CrossWireLength/x)-((this.Select_wireType["Cross_Wire"][i] + len) / x) + MoveFactor, MoveFactor); // Starting point (x, y)
  
          context.lineTo((this.CrossWireLength/x)-((this.Select_wireType["Cross_Wire"][i] + len) / x) + MoveFactor, MoveFactor + (this.MainWireLen / x)); // Ending point (x, y)
  
          context.stroke();
  
          len += this.Select_wireType["Cross_Wire"][i];
  
  
        }
      }
     else{
      for (let i = 0; i < this.Select_wireType["Cross_Wire"].length - 1; i++) {
        context.strokeStyle = 'red';

        context.lineWidth = 2;


        context.beginPath();

        context.moveTo(((this.Select_wireType["Cross_Wire"][i] + len) / x) + MoveFactor, MoveFactor); // Starting point (x, y)

        context.lineTo(((this.Select_wireType["Cross_Wire"][i] + len) / x) + MoveFactor, MoveFactor + (this.MainWireLen / x)); // Ending point (x, y)

        context.stroke();

        len += this.Select_wireType["Cross_Wire"][i];


      }
     }
      context.setLineDash([]);

      let rotationAngle = -1;
      //Label left Vertical;
      // for(let i=1;i<this.No_CrossWires)
      let TotalDistance = CWOverhang;
      for (let i = this.No_MainWires + 1; i < this.BomDetails.length - 1; i++) {
        debugger;
        console.log(-1 + MoveFactor + TotalDistance);
        console.log(MoveFactor + TotalDistance + ((this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)) / x);

        TotalDistance += ((this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)) / x;

        rotationAngle = (Math.PI / -2);
        label = label + (this.BomDetails[i].tntNoOfPitch).toString() + " x " + this.BomDetails[i].intWirePitch.toString() + " , ";


      }
      context.strokeStyle = 'Blue';

      context.lineWidth = 1;

      context.beginPath();

      context.moveTo(MoveFactor - 10, MoveFactor + CWOverhang); // Starting point (x, y)

      context.lineTo(MoveFactor - 10, MoveFactor + TotalDistance - (((this.BomDetails[this.No_MainWires].tntNoOfPitch * this.BomDetails[this.No_MainWires].intWirePitch)) / x) + (((this.BomDetails[this.BomDetails.length - 1].tntNoOfPitch * this.BomDetails[this.BomDetails.length - 1].intWirePitch)) / x)); // Ending point (x, y)

      context.stroke();
      console.log("This is Distance ", TotalDistance * x);
      context.rotate(rotationAngle); // Rotate the context

      context.fillText(label, -(TotalDistance / 2 + MoveFactor + 20), 20);
      context.rotate(-rotationAngle);

      // rotationAngle = (Math.PI / -2);
      // context.rotate(rotationAngle);
      // context.fillText("ABC",-((this.MainWireLen / x)) / 2 - MoveFactor,20);
      // context.rotate(-rotationAngle);
      //     let label_left  = (this.BomDetails[4].tntNoOfPitch).toString()+ " x " + Math.round(CWSpace*x).toString()

      // context.fillText(label_left,MoveFactor-50,((this.MainWireLen/x))/2+MoveFactor);


      // Label MO1 
      context.font = '10px Arial';
      label = (this.BomDetails[0].tntNoOfPitch).toString() + " x " + (this.BomDetails[0].intWirePitch).toString()
      context.fillText(label, MoveFactor - 30, MoveFactor - 20);

      // Label MO2
      console.log("MO 2", this.BomDetails[this.No_MainWires - 1].tntNoOfPitch)
      label = (this.BomDetails[this.No_MainWires - 1].tntNoOfPitch).toString() + " x " + (this.BomDetails[this.No_MainWires - 1].intWirePitch).toString()
      context.fillText(label, (this.CrossWireLength / x) + MoveFactor - 10, MoveFactor - 20);

      //Label CO1
      rotationAngle = (Math.PI / -2);
      context.rotate(rotationAngle); // Rotate the context
      context.fillStyle = 'black';

      label = "1 X " + this.BomDetails[this.No_MainWires].intWirePitch.toString()
      context.fillText(label, -(MoveFactor + 35), 20);
      context.rotate(-rotationAngle);

      //Label CO2

      rotationAngle = (Math.PI / -2);
      context.rotate(rotationAngle); // Rotate the context
      context.fillStyle = 'black';

      label = "1 X " + this.BomDetails[this.BomDetails.length - 1].intWirePitch.toString()
      context.fillText(label, -(this.MainWireLen / x + 50), 20);
      context.rotate(-rotationAngle);






      //Label Right Vertical;
      context.strokeStyle = 'Blue';

      context.lineWidth = 1;

      context.beginPath();

      context.moveTo(this.CrossWireLength / x + MoveFactor + 10, 0 + MoveFactor); // Starting point (x, y)

      context.lineTo(this.CrossWireLength / x + MoveFactor + 10, (this.MainWireLen / x) + MoveFactor); // Ending point (x, y)

      context.stroke();


      //context.fillText(this.BomDetails[1].decWireLength,this.CrossWireLength / x + MoveFactor +10,((this.MainWireLen / x) + MoveFactor)/2);


      rotationAngle = (Math.PI / 2);
      context.rotate(rotationAngle);
      context.fillText(this.BomDetails[1].decWireLength, ((this.MainWireLen / x)) / 2 + MoveFactor, -(this.CrossWireLength / x + MoveFactor + 15));
      context.rotate(-rotationAngle);

      // label Upper horizontal

      debugger;
      TotalDistance = MWoverhang;
      label = " "

      for (let i = 1; i < this.No_MainWires - 1; i++) {
        console.log("Size 20202")
        console.log(-1 + MoveFactor + TotalDistance);
        console.log(MoveFactor + TotalDistance + ((this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)) / x);
        context.strokeStyle = 'Blue';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(-1 + MoveFactor + TotalDistance, MoveFactor - 10);
        context.lineTo(MoveFactor + TotalDistance + ((this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)) / x, MoveFactor - 10);
        context.stroke();
        TotalDistance += ((this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)) / x;

        label = label + (this.BomDetails[i].tntNoOfPitch).toString() + " x " + this.BomDetails[i].intWirePitch.toString() + " , ";




      }
      context.fillText(label, TotalDistance / 2, MoveFactor - 15);




      // label Bottom horizontal
      context.strokeStyle = 'Blue';
      context.lineWidth = 1;
      context.beginPath();
      ;
      context.moveTo(MoveFactor, (this.MainWireLen / x) + MoveFactor + 10); // Ending point (x, y)
      context.lineTo(this.CrossWireLength / x + MoveFactor, (this.MainWireLen / x) + MoveFactor + 10);
      context.stroke();
      label = this.CrossWireLength;
      context.fillText(label, ((this.CrossWireLength / x) / 2) + MoveFactor - 15, ((this.MainWireLen / x)) + MoveFactor + 25);
      len = 0;
      //overhang Ended

    }

  }


  fnGridDDLValidation(item: any): any {
debugger;
   
    if (item.varRowIndex == -1) // for Add
    {
      var MWSequence = this.headerData.MWSequence;
      var CWSequence = this.headerData.CWSequence;
      var MWCount = this.headerData.countMW;
      var CWCount = this.headerData.countCW;
      var varStaggeredIndicator = this.headerData.bitStaggeredIndicator;
      var Wire = item?.Wire_Type;
      var Pitch = Number(item.No_Pitches)
      var Space = Number(item.Wire_Space);
      var sum = 0;
      var CO1 = 0;
      var CO2 = 0;
      item.editFieldName = '';
      var varLineNo = Number(item.Line_No)

      if (Wire == undefined) {
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        alert("Please select a Wire Type to proceed further.");
        return false;
      }


      if (Pitch== 0) {
        alert("Please enter a valid No Pitchs to proceed further.");
        return false;
      }
      // //Added by debarati for CR CHG0031612
      if (Pitch != 1) {
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        alert("No of pitchs can not be more than 1");
        return false;
      }


      if (Space == 0) {
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        alert("Please enter a valid Wire Space to proceed further.");
        return false;
      }


      //C
    } // for ADD end
    else // for EDIT
    {
      var MWSequence = this.headerData.MWSequence;
      var CWSequence = this.headerData.CWSequence;
      var MWCount = this.headerData.countMW;
      var CWCount = this.headerData.countCW;
      var varStaggeredIndicator = this.headerData.bitStaggeredIndicator;
      var Wire = item.Wire_Type;
      var Pitch = Number(item.tntNoOfPitch)
      var Space = Number(item.intWirePitch);
      var sum = 0;
      var CO1 = 0;
      var CO2 = 0;
      item.editFieldName = '';
      var varLineNo = Number(item.tntWireSequence)
      if (varLineNo == 1 && Pitch != 1) {
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        alert("Overhang pitch can not be more then 1.");
        item.editFieldName = false
        return false;
      }
      if(item.decWireDiameter==0 && Pitch != 1)
      {
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        alert("Overhang pitch can not be more then 1.");
        item.editFieldName = false;
        return false;
      }

      //End Added by debarati for CR CHG0031612 decWireDiameter
      if (Pitch == 0) {
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        alert("Please enter a valid No Pitchs to proceed further.");
        return false;
      }
      if (Space == 0) {
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        alert("Please enter a valid Wire Space to proceed further.");
        return false;
      }



    } // for EDIT end

    if (varStaggeredIndicator == false) {
      if (item.varRowIndex != -1) {
        if (!this.fnValidatePitch(item)) {
          return false;
        }
      }
      if (item.varRowIndex == -1) // NOT Staggered ADD
      {


        sum = sum + (Pitch * Space)
        if (Wire == 'M' && MWSequence > 2) {
          var varCWLength = this.headerData.decCWLength;
          for (var i = 1; i < this.No_MainWires; i++) {
            sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
          }
          var CO1 = (varCWLength - sum);
          CO1 = CO1 / this.BomDetails[0].tntNoOfPitch;
          if (CO1 <= 0) {
            this.BomDetails = JSON.parse(JSON.stringify(this.backup));
            alert('Please enter a valid Pitch and wire Space.');
            return false;
          }
          else {
            this.BomDetails[0].intWirePitch = CO1;
            this.intCO1 = CO1;
            this.intCO2 = Space;
            this.InsertBom(item);
            return true;
          }
          // (CO1 < 0)
        } // M
        else if (Wire == 'C' && CWSequence > 2) {
          var varMWLength = this.headerData.decMWLength;
          // var varMWLength = this.BomDetails[0].decWireLength;
          for (var i = Number(this.No_MainWires) + 1; i < this.BomDetails.length; i++) {
            sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
          }
          var MO1 = (varMWLength - sum);
          MO1 = MO1 / this.BomDetails[this.CrossWireInd].tntNoOfPitch;
          if (MO1 <= 0) {
            this.BomDetails = JSON.parse(JSON.stringify(this.backup));
            alert('Please enter a valid Pitch and wire Space.');
            return false;
          }
          else {
            this.BomData[this.CrossWireInd] = MO1;
            this.intMO1 = MO1;
            this.intMO2 = Space;
            this.InsertBom(item);
            return true;
          } // (MO1 < 0)
        } // C
      } // NOT Staggered ADD End
    } // if NOT staggered END
    //return false; /// to be removed 
  }


  fnValidatePitch(item: any): any {

    ;
    if (this.headerData.bitStaggeredIndicator === false) {
      var varCWLength = this.headerData.decCWLength;
      var varMWLength = this.headerData.decMWLength;
      var MWSequence = this.headerData.MWSequence;
      var CWSequence = this.headerData.CWSequence;
      var CO1 = 0;
      var CO2 = 0;
      var MO1 = 0;
      var MO2 = 0;
      var sum = 0;
      var space = Number(item.intWirePitch);
      var Nopitch = Number(item.tntNoOfPitch);
      var Wire = item.vchWireType;
      var Line = Number(item.tntWireSequence);

      

      // this.BomDetails = JSON.parse(JSON.stringify(this.backup));



      var StructureElement = this.BomData.StructureElement;
      var Remaining = 0;


      if (space == 0 || Nopitch == 0) {
        alert('Please enter a valid Pitch and wire Space.');
        this.BomDetails = JSON.parse(JSON.stringify(this.backup));
        return false;
      }
      else {
        if (Wire == 'M') {
          if (item.varRowIndex == 0 && MWSequence >= 3) {

            for (var i = 0; i < this.No_MainWires - 1; i++) {
              sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
            }
            CO2 = (varCWLength - sum);


            if (CO2 <= 0) {
              alert('Please enter a valid Pitch and wire Space.');
              this.BomDetails = JSON.parse(JSON.stringify(this.backup));
              return false;
            }
            else {
              this.intCO2 = CO2;
              this.intCO1 = space;
              // this.fnValidate();
              this.UpdateBOM(item);

              return true;
            } // (CO2 < 0)
          } // In "M' RowIndex =0 
          else if (MWSequence >= 3) {
            // sum = sum + (Nopitch * space)
            for (var i = 1; i < this.No_MainWires; i++) {
              sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
            }
            CO1 = (varCWLength - sum);

            if (CO1 <= 0) {
              alert('Please enter a valid Pitch and wire Space.');
              this.BomDetails = JSON.parse(JSON.stringify(this.backup));
              return false;
            }
            else {
              this.BomDetails[0].intWirePitch = CO1;

              this.intCO1 = CO1;
              if (MWSequence == Line) {
                this.intCO2 = space;
              }
              this.fnCalculateCO2();
              this.UpdateBOM(item);
              return true;
            }
          }
        } // M
        else if (Wire == 'C') {
          var CWIndex = (item.varRowIndex - this.No_CrossWires);
          //                if(CWIndex == 0 && CWSequence >= 3)


          //                        var count = 0;
          //                        for (var count = 0; count <= CWWireType.length - 2; count++) {
          //                            count = (count + 1);
          //                        }
          //                        alert('count ' + count);

          if (Line == 1) {

            for (i = this.No_MainWires; i < this.BomDetails.length - 1; i++) {
              sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
            }
            MO2 = (varMWLength - sum);
            if (MO2 <= 0) {
              this.BomDetails = JSON.parse(JSON.stringify(this.backup));
              alert('Please enter a valid Pitch and wire Space.');
              return false;
            }
            else {

              this.intMO2 = MO2
              this.intMO1 = space;
              this.UpdateBOM(item);
              return true;
            }
          } // In "C' RowIndex =0

          else if (CWSequence >= 3) { //Altered by Panchatapa for Beam Cage
            ;
            for (i = this.No_MainWires + 1; i <= this.BomDetails.length - 1; i++) {
              sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
            }
            MO1 = (varMWLength - sum);
            if (MO1 <= 0) {
              this.BomDetails = JSON.parse(JSON.stringify(this.backup));
              alert('Please enter a valid Pitch and wire Space.');
              return false;
            }
            else {
              this.intMO1 = MO1


              if (CWSequence == Line) {
                this.intMO2 = space;
              }
              this.UpdateBOM(item);
              return true;
            }
          }  // In "C' RowIndex above 0 

          //Added by Panchatapa for Beam Cage
          // else if ((Line != CWSequence) && (StructureElement == 'Beam')) {

          // sum = sum + (Nopitch * space);


          // for (i = this.No_MainWires.length+1; i <= this.No_CrossWires.length - 2; i++) {

          //       sum = sum + (this.BomDetails[i].tntNoOfPitch*this.BomDetails[i].intWirePitch)
          // }



          //     Remaining = (varMWLength - sum);


          //     if (Remaining % 2 == 0) {

          //          MO1 = (Remaining / 2);
          //          MO1 = MO1 / this.BomDetails[0].intWirePitch;
          //          MO2 = (Remaining / 2);
          //          MO2 = MO2 /this.BomDetails[this.No_CrossWires-1].intWirePitch;


          //          if (MO1 < 0) {
          //           this.BomDetails = JSON.parse(JSON.stringify(this.backup));
          //              alert('Please enter a valid Pitch and wire Space.');
          //              return false;
          //          }
          //          else if (MO2 < 0) {
          //           this.BomDetails = JSON.parse(JSON.stringify(this.backup));
          //              alert('Please enter a valid Pitch and wire Space.');
          //              return false;
          //          }
          //          else {

          //           this.BomDetails[0].intWirePitch = MO1;
          //           this.intMO1 = MO1
          //           this.intMO2= this.BomDetails[1].intWirePitch;
          //             //  document.getElementById(CWWireSpace[0]).innerHTML = parseInt(MO1);
          //             //  document.getElementById("<%= txtMO1.ClientID %>").value = document.getElementById(CWWireSpace[0]).innerHTML

          //             //  document.getElementById(CWWireSpace[1]).innerHTML = parseInt(MO2);
          //             //  document.getElementById("<%= txtMO2.ClientID %>").value = document.getElementById(CWWireSpace[1]).innerHTML


          //              return true;
          //          }
          //     }

          //     if (Remaining % 2 == 1) {

          //         MO1 = ((Remaining + 1) / 2);
          //         MO1 = MO1 / this.BomDetails[0].intWirePitch
          //         MO2 = ((Remaining - 1) / 2);
          //         MO2 = MO2 /this.BomDetails[this.No_CrossWires-1].intWirePitch;                     

          //         if (MO1 < 0) {
          //           this.BomDetails = JSON.parse(JSON.stringify(this.backup));
          //             alert('Please enter a valid Pitch and wire Space.');
          //             return false;
          //         }
          //         else if (MO2 < 0) {
          //           this.BomDetails = JSON.parse(JSON.stringify(this.backup));
          //             alert('Please enter a valid Pitch and wire Space.');
          //             return false;
          //         }
          //         else {
          //           this.BomDetails[0].intWirePitch = MO1;
          //             // document.getElementById(CWWireSpace[0]).innerHTML = parseInt(MO1);
          //             this.intMO1 =MO1;
          //             // document.getElementById("<%= txtMO1.ClientID %>").value = document.getElementById(CWWireSpace[0]).innerHTML
          //             this.BomDetails[1].intWirePitch = MO2; 
          //             // document.getElementById(CWWireSpace[1]).innerHTML = parseInt(MO2);
          //             return true;
          //         }
          //     }

          // }

          // else if ((Line == CWSequence) && (StructureElement == 'Beam')) {


          //     // sum = sum + (Nopitch * space)
          //     // for (var i = 1; i <= CWWireType.length - 1; i++) {
          //     //     sum = sum + (document.getElementById(CWWireSpace[i]).innerHTML * document.getElementById(CWPitch[i]).innerHTML);
          //     // }
          //     // MO1 = (varMWLength - sum);
          //     // MO1 = MO1 / document.getElementById(CWPitch[0]).innerHTML;
          //     // if (MO1 < 0) {
          //     //     alert('Please enter a valid Pitch and wire Space.');
          //     //     return false;
          //     // }
          //     // else {
          //     //     document.getElementById(CWWireSpace[0]).innerHTML = parseInt(MO1);
          //     //     //                        document.getElementById("<%= txtMO2.ClientID %>").value  = document.getElementById(CWWireSpace[0]).innerHTML
          //     //     document.getElementById("<%= txtMO1.ClientID %>").value = document.getElementById(CWWireSpace[0]).innerHTML
          //     //     if (CWSequence == Line) {
          //     //         var MO2 = document.getElementById(varSpace).value;
          //     //         document.getElementById("<%= txtMO2.ClientID %>").value = MO2;
          //     //     }
          //     //     return true;
          //     // }
          // }
          //Added by Panchatapa for Beam Cage
        } // C
      }
    } // Not Staggered End
  }

  fnCalculateCO1(): any {

    var MWSequence = this.headerData.MWSequence;
    var varStaggeredIndicator = this.headerData.bitStaggeredIndicator;

    if (varStaggeredIndicator == false) {

      if (this.intCO2 == 0) {
        alert('Please enter a valid Pitch and wire Space.');
        return false;
      }
      else {
        if (MWSequence >= 3) {

          var varCWLength = this.CrossWireLength;
          var varCO2 = this.intCO2
          var sum = 0;
          sum = sum + (this.BomDetails[this.No_MainWires - 1].tntNoOfPitch * varCO2);
          for (var i = 1; i <= this.No_MainWires - 2; i++) {
            sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
          }

          var CO1 = (varCWLength - sum);

          if (CO1 < 0) {
            alert('Please enter a valid Pitch and wire Space.');
            return false;
          }
          else {
            this.intCO1 = CO1;

            // document.getElementById("<%= txtCO1.ClientID %>").value = parseInt(CO1);
            return true;
          } // (CO1 < 0)
        }
      }
    } //not staggered
  }



  fnCalculateCO2(): any {
    var MWSequence = this.headerData.MWSequence;
    var varStaggeredIndicator = this.headerData.bitStaggeredIndicator;
    if (varStaggeredIndicator == false) {
      if (this.intCO1 == 0) {
        alert('Please enter a valid Pitch and wire Space.');
        return false;
      }
      else {
        if (MWSequence >= 3) {
          var varCWLength = this.CrossWireLength;
          var varCO1 = this.intCO1
          var sum = 0;
          sum = sum + (this.BomDetails[0].tntNoOfPitch * varCO1)
          for (var i = 1; i <= this.No_MainWires - 2; i++) {
            sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
          }
          var CO2 = (varCWLength - sum);


          if (CO2 < 0) {
            alert('Please enter a valid Pitch and wire Space.');
            return false;
          }
          else {
            // document.getElementById("<%= txtCO2.ClientID %>").value = parseInt(CO2);
            this.intCO2 = CO2;
            return true;
          } // (CO2 < 0)
        }
      }
    } //not staggered
  }

  fnCalculateMO1(): any {
    var CWSequence = this.headerData.CWSequence;
    var varStaggeredIndicator = this.headerData.bitStaggeredIndicator;
    if (varStaggeredIndicator == false) {
      if (this.intMO2 == 0) {
        alert('Please enter a valid Pitch and wire Space.');
        return false;
      }
      else {
        if (CWSequence >= 3) {
          var varMWLength = this.MainWireLen;
          var varMO2 = this.intMO2
          var sum = 0;
          sum = sum + (this.BomDetails[this.CrossWireLength - 1] * varMO2);
          for (var i = this.CrossWireInd; i <= this.CrossWireLength - 2; i++) {

            sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)

          }
          var MO1 = (varMWLength - sum);

          if (MO1 < 0) {
            alert('Please enter a valid Pitch and wire Space.');
            return false;
          }
          else {

            this.intMO1 = MO1;
            return true;
          } // (CO1 < 0)
        }
      }
    } //not staggered
  }

  fnCalculateMO2(): any {
    var CWSequence = this.headerData.CWSequence;
    var varStaggeredIndicator = this.headerData.bitStaggeredIndicator;
    if (varStaggeredIndicator == false) {
      if (this.intMO1 == 0) {
        alert('Please enter a valid Pitch and wire Space.');
        return false;
      }
      else {
        if (CWSequence >= 3) {
          var varMWLength = this.MainWireLen;
          var varMO1 = this.intMO1;
          var sum = 0;
          sum = sum + (this.BomDetails[this.CrossWireInd] * varMO1);
          for (var i = this.CrossWireInd; i <= this.CrossWireLength - 2; i++) {
            sum = sum + (this.BomDetails[i].tntNoOfPitch * this.BomDetails[i].intWirePitch)
          }
          var MO2 = (varMWLength - sum);
          if (MO2 < 0) {
            alert('Please enter a valid Pitch and wire Space.');
            return false;
          }
          else {
            this.intMO2 = MO2;

            return true;
          } // (CO2 < 0)
        }
      }
    } //not staggered
  }
  fnValidate() {

    this.fnCalculateCO1()
    this.fnCalculateCO2()
    this.fnCalculateMO1()
    this.fnCalculateMO2()
  }
  ChangeRawMaterial(item: any) {
    ;
    if (item !== undefined) {
      if (item.Wire_Type == "M") {
        item.Raw_Material = this.BomDetails[0].vchRawMaterial;
        item.Wire_Dia = this.BomDetails[0].decWireDiameter;
      }
      else {
        item.Raw_Material = this.BomDetails[this.BomDetails.length - 1].vchRawMaterial;
        item.Wire_Dia = this.BomDetails[this.BomDetails.length - 2].decWireDiameter;
      }
    }
  }

  fnValidateLineNo(varRowIndex: any, varWireType: any, varLineNo: any) {

    //   var WireT = varWireType
    //   var LineNos = varLineNo
    //   var MaxMWSequence = 
    //   var MaxCWSequence = 
    //   var firstLineNo = 1;
    //   if (parseInt(LineNos) == parseInt(0)) {
    //       alert('Cannot edit Line No. with value 0.');
    //       return false;
    //   }
    //   else if (WireT == 'M') {
    //       if (document.getElementById(varLineNo).disabled == false) {
    //           if (parseInt(LineNos) == parseInt(MaxMWSequence) || parseInt(LineNos) == parseInt(firstLineNo)) {
    //               alert('Cannot edit Line No. with value 1 and ' + MaxMWSequence + '.');
    //               return false;
    //           }
    //           else if (parseInt(LineNos) > parseInt(MaxMWSequence)) {
    //               alert('Cannot edit Line No. with value greater than ' + MaxMWSequence + '.');
    //               return false;
    //           }
    //           else {
    //               return true;
    //           }
    //       }
    //       else //document.getElementById(varLineNo).disabled == true
    //       {
    //           return true;
    //       }
    //   } //if
    //   else if (WireT == 'C') {
    //       if (document.getElementById(varLineNo).disabled == false) {
    //           if (parseInt(LineNos) == parseInt(MaxCWSequence) || parseInt(LineNos) == parseInt(firstLineNo)) {
    //               alert('Cannot edit Line No. with value 1 and ' + MaxCWSequence + '.');
    //               return false;
    //           }
    //           else if (parseInt(LineNos) > parseInt(MaxCWSequence)) {
    //               alert('Cannot edit Line No. with value greater than ' + MaxCWSequence + '.');
    //               return false;
    //           }
    //           else {
    //               return true;
    //           }
    //       }
    //       else //document.getElementById(varLineNo).disabled == true
    //       {
    //           return true;
    //       }
    //   } //else
    return true;
  }
  Delete_BOM(item: any) {
    this.detailingService.Delete_Bom(item.intDetailingBOMDetailId).subscribe({
      next: (response) => {
        ;

      },
      error: (e) => {
        console.log("error", e);
      },

      complete: () => {

        this.Save_PRoductionBOM();
      },
    });
  }
  goBack() {

    this.router.navigate(['/detailing/DetailingGroupMark']);
  }
  Save_PRoductionBOM() {
    const obj: UpdateProdBOM = {
      intProductMarkingId: this.BomData.ProductMarkId,
      strStructureElement: this.BomData.StructureElement,
      intUserId: this.userId
    }
    this.detailingService.UpdateProdBOM(obj).subscribe({
      next: (response) => {
      },
      error: (e) => {
      },

      complete: () => {
        this.LoadBomDetails("D");
        this.LoadBomDetails("P");

      },
    });

  }

BendingGroup(intShapeId:any)
{
  this.detailingService.BendingGroup_Get(intShapeId).subscribe({
    next: (response) => {
      this.VchBendingGrroup = response;

    },
    error: (e) => {

    },

    complete: () => {
debugger;
      let MWBending  = this.VchBendingGrroup[0].vchMWBendingGroup;//
      let CWBending  = this.VchBendingGrroup[0].vchCWBendingGroup;//left right
      if(MWBending)
      {
          if(MWBending.toLowerCase().includes("bc2"))
          {
            this.Bending_horizontal=true;
          }
      }

      if(CWBending)
      {
          if(CWBending.toLowerCase().includes("bc2"))
          {
            this.Bending_Vertical=true;
          }
      }
    },
  });
}
NoneEvent()
{

}

showPostingReport(){
  let productmarkid=this.BomData.ProductMarkId;
  let bomType:string='';
  if(this.ProductionVisible)
  {
    bomType = 'P'
  }
  else{
    bomType = 'D'
  }
  let report='http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2frptMeshBOMList&rs:Command=Render&intCustomerId=0&intContractId=0&intProjectId=0&intGroupMarkingId=0&intProductMarkingId='+productmarkid+'&nvchBOMType='+bomType+'&rc:Parameters=false';
  console.log("postingreport",report);
  window.open(report, '_blank');
}


}





