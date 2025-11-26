import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/Orders/orders.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { UtilityService } from 'src/app/utilities/Utility.service';
import { WbsService } from 'src/app/wbs/wbs.service';
import { ProductCodeService } from '../Services/ProductCode/product-code.service';
import { ContactListService } from '../Services/ProjectContractList/contact-list.service';
import { SaveEsmTracker } from 'src/app/Model/save-esm-tracker';
import { data } from 'jquery';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-esmtracker',
  templateUrl: './esmtracker.component.html',
  styleUrls: ['./esmtracker.component.css']
})
export class ESMTrackerComponent {
  Customerlist: any = [];
  LoadingCustomerName: boolean = true;
  projectList: any;
  transferObject: any;
  structureList: any[] = [];
  Contractlist: any[] = [];
  toggleFilters = false;
  trackDetailsForm!: FormGroup;
  trackDetailsForm2!: FormGroup;
  enableEditIndex = null
  isEditing: boolean = false;
  isEsm = true;
  ProductTypeList: any;
  selectedproducttype: any;

  ContractCode: any;
  selectedOrdertype: any;
  OrdertypeList: any;

  WBS1dropList: any[] = [];
  WBS2dropList: any;
  WBS3dropList: any;

  searchText: any = '';
  searchTrackerId: any;
  searchPONumber: any;
  searchWBS1: any;
  searchWBS2: any;
  searchWBS3: any;
  searchBBS: any;
  searchBBSDesc: any;
  searchReqDelivery: any;

  isformsubmit: boolean = false;
  isaddnew: boolean = false
  TrackingDetailslist: any[] = [];
  TrackingDetailslist_backup: any;
  TrackingDetailsCount: number = 0;
  textsearch: string | undefined;

  SaveEsmTrackerObj: SaveEsmTracker[] = [];

  page = 1;
  pageSize = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  Loading: boolean = false;
  searchResult = true;
  maxSize: number = 10;
  TrakingId: number = 0;
  generateLabel = "Generate"
  item: any;

  constructor(public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private modalService: NgbModal, public commonService: CommonService,
    private tosterService: ToastrService,
    private productcodeService: ProductCodeService,
    private projectcontractlistService: ContactListService,
    public wbsService: WbsService,
    private orderService: OrderService,
    private utilityservice: UtilityService,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,



  ) {

    this.OrdertypeList = [
      { OrderTypeName: 'ZMDO' },
      { OrderTypeName: 'ZMCO' },
      { OrderTypeName: 'ZMCR' },
      { OrderTypeName: 'ZMDR' },
      { OrderTypeName: 'ZMRO' },
      { OrderTypeName: 'ZREP' },
      { OrderTypeName: 'ZTPS' },
      { OrderTypeName: 'ZMFO' },
      { OrderTypeName: 'ZMEO' },

    ]


    this.trackDetailsForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      //customer: ['', [Validators.required]],
      project: new FormControl('', Validators.required),
      contract: new FormControl('', Validators.required),
      //contract: ['', [Validators.required]],
      Producttype: new FormControl('', Validators.required),
      structureelement: new FormControl('', Validators.required),

    });

    this.trackDetailsForm2 = this.formBuilder.group({
      wbs1: new FormControl('', Validators.required),
      wbs2: new FormControl('', Validators.required),
      wbs3: new FormControl(''),

      bbs: ['', [Validators.required, Validators.minLength(11)]],
      bbsdescription: new FormControl('', Validators.required),
      ponumber: new FormControl('', Validators.required),
      podate: new FormControl('', Validators.required),
      reqdate: new FormControl('', Validators.required),
      proddate: new FormControl('', Validators.required),
      ordertype: new FormControl('', Validators.required),
      location: new FormControl(''),
      overdelv: new FormControl('', Validators.required),
      underdelv: new FormControl('', Validators.required),
      estimatedweight: new FormControl(''),
      sitecontactperson: new FormControl(''),
      remark: new FormControl(''),
    });
  }

  ngOnInit() {
    this.commonService.changeTitle('ESM Tracker | ODOS');

    this.GetCustomer(this.isEsm);  
  }



  GetCustomer(isEsm: any): void {
    debugger;

    this.commonService.GetESMCutomerDetails(isEsm).subscribe({
      next: (response) => {
        debugger;
        this.Customerlist = response;
        console.log("Customerlist", this.Customerlist);
      },
      error: (e) => {
      },
      complete: () => {
        debugger;
        this.LoadingCustomerName = false;

      },
    });

  }

  ChangeCustomer(event: any) {

    debugger;
      this.trackDetailsForm.controls['project'].reset();
      this.trackDetailsForm.controls['contract'].reset();   
      this.trackDetailsForm.controls['Producttype'].reset();
      this.trackDetailsForm.controls['structureelement'].reset();
      this.trackDetailsForm2.controls['wbs1'].reset();
      this.trackDetailsForm2.controls['wbs2'].reset();
      this.trackDetailsForm2.controls['wbs3'].reset();
      this.trackDetailsForm2.controls['bbs'].reset();
      this.trackDetailsForm2.controls['bbsdescription'].reset();
      
      this.projectList=[];
      this.ProductTypeList=[];
      this.structureList=[];
      this.Contractlist=[];
      this.WBS1dropList=[];
      this.WBS2dropList=[];
      this.WBS3dropList=[];
   
      if(event){
      this.GetProject(event)
    }
      
  }

  GetProject(customercode: any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response) => {
        debugger;
        this.projectList = response;
      },

      error: (e) => {
      },
      complete: () => {


      },

    });


  }

  ChangeProject(event: any) {
    
    this.trackDetailsForm.controls['contract'].reset();   
      this.trackDetailsForm.controls['Producttype'].reset();
      this.trackDetailsForm.controls['structureelement'].reset();
      this.trackDetailsForm2.controls['wbs1'].reset();
      this.trackDetailsForm2.controls['wbs2'].reset();
      this.trackDetailsForm2.controls['wbs3'].reset();
      this.trackDetailsForm2.controls['bbs'].reset();
      this.trackDetailsForm2.controls['bbsdescription'].reset();

      this.Contractlist=[];
      this.ProductTypeList=[];
      this.structureList=[];
      this.WBS1dropList=[];
      this.WBS2dropList=[];
      this.WBS3dropList=[];

    if(event){
      this.GetContract(event);
      this.GetProductType();
    }
   
  }

  GetProductType(): void {
    this.wbsService.GetProductType().subscribe({
      next: (response) => {
        this.ProductTypeList = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  ChangeProductType(event: any) {

    debugger;
    this.trackDetailsForm.controls['structureelement'].reset();
    this.trackDetailsForm2.controls['wbs1'].reset();
    this.trackDetailsForm2.controls['wbs2'].reset();
    this.trackDetailsForm2.controls['wbs3'].reset();
    this.trackDetailsForm2.controls['bbs'].reset();
    this.trackDetailsForm2.controls['bbsdescription'].reset();

    this.structureList=[];
    this.WBS1dropList=[];
    this.WBS2dropList=[];
    this.WBS3dropList=[];
    
    if(event){   
      this.GetStructElement();
    }    
  }

  GetContract(ProjectId: any): void {
    this.commonService.GetContract(ProjectId).subscribe({
      next: (response: any) => {
        debugger;
        this.Contractlist = response;
      },

      error: (e) => {
      },
      complete: () => {


      },

    });


  }

  GetStructElement(): void {
    debugger;
    this.wbsService.GetStructElement()
      .subscribe({
        next: (response) => {
          this.structureList = response;
        },
        error: (e) => {
          //console.log(e.error);
        },
        complete: () => {
        },
      });
  }

  changeStructure(event: any) {
    debugger;

    this.trackDetailsForm2.controls['wbs1'].reset();
    this.trackDetailsForm2.controls['wbs2'].reset();
    this.trackDetailsForm2.controls['wbs3'].reset();
    this.trackDetailsForm2.controls['bbs'].reset();
    this.trackDetailsForm2.controls['bbsdescription'].reset();

    this.WBS1dropList=[];
    this.WBS2dropList=[];
    this.WBS3dropList=[];
    
    if(event){
      let ProjectCode = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectCode;
      let StructureElementType = this.structureList.find(x => x.StructureElementTypeId === this.trackDetailsForm.value.structureelement).StructureElementType;
      let productType = this.ProductTypeList.find((x: { ProductTypeID: any; }) => x.ProductTypeID === this.trackDetailsForm.value.Producttype).ProductType;

      this.GetWBS1(ProjectCode, StructureElementType, productType);
    }
   
  }


  GetWBS1(ProjectCode: any, StructureElementType: any, productType: any) {
    debugger;

    this.orderService.Get_WBS1(ProjectCode, StructureElementType, productType).subscribe({
      next: (response: any) => {
        debugger;
        this.WBS1dropList = response;
      },

      error: (e) => {
      },
      complete: () => {


      },

    });


  }

  changeWbs1(event: any) {
    debugger;

    this.trackDetailsForm2.controls['wbs2'].reset();
    this.trackDetailsForm2.controls['wbs3'].reset();
    this.trackDetailsForm2.controls['bbs'].reset();
    this.trackDetailsForm2.controls['bbsdescription'].reset();

    this.WBS2dropList=[];
    this.WBS3dropList=[];

    if(event)
    {
      this.GetWBS2();
    }
   
  }

  GetWBS2() {
    debugger;
    let ProjectCode = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectCode;
    let StructureElementType = this.structureList.find(x => x.StructureElementTypeId === this.trackDetailsForm.value.structureelement).StructureElementType;
    let productType = this.ProductTypeList.find((x: { ProductTypeID: any; }) => x.ProductTypeID === this.trackDetailsForm.value.Producttype).ProductType;
    let Wbs1 = this.trackDetailsForm2.value.wbs1;

    debugger;
    this.orderService.Get_WBS2(ProjectCode, StructureElementType, productType, Wbs1).subscribe({
      next: (response) => {
        debugger;
        this.WBS2dropList = response;
      },

      error: (e) => {
      },
      complete: () => {


      },

    });


  }

  changeWbs2(event: any) {
    debugger;

    this.trackDetailsForm2.controls['wbs3'].reset();
    this.trackDetailsForm2.controls['bbs'].reset();
    this.trackDetailsForm2.controls['bbsdescription'].reset();

    this.WBS3dropList=[];
    
    if(event){
    
      this.GetWBS3();
     
    }
   

  }

  generatebbs(){
  debugger
  
    if(this.WBS3dropList.length==0){
      if(this.WBS2dropList.length!=0){
        let BBS = this.WBS2dropList.find((x: any) => x.WBS2 === this.trackDetailsForm2.value.wbs2).VCHBBSNO;
        let BBSDESC = this.WBS2dropList.find((x: any) => x.WBS2 === this.trackDetailsForm2.value.wbs2).BBS_DESC;
  
        this.trackDetailsForm2.controls['bbs'].patchValue(BBS);
        this.trackDetailsForm2.controls['bbsdescription'].patchValue(BBSDESC);
      }

    }
    else{
      let BBS = this.WBS3dropList.find((x: any) => x.WBS3 === this.trackDetailsForm2.value.wbs3).VCHBBSNO;
      let BBSDESC = this.WBS3dropList.find((x: any) => x.WBS3 === this.trackDetailsForm2.value.wbs3).BBS_DESC;

      this.trackDetailsForm2.controls['bbs'].patchValue(BBS);
      this.trackDetailsForm2.controls['bbsdescription'].patchValue(BBSDESC);

    }

  }
 

  async getWbs3List(): Promise<any> {
    try {

      debugger;
      let ProjectCode = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectCode;
      let StructureElementType = this.structureList.find(x => x.StructureElementTypeId === this.trackDetailsForm.value.structureelement).StructureElementType;
      let productType = this.ProductTypeList.find((x: { ProductTypeID: any; }) => x.ProductTypeID === this.trackDetailsForm.value.Producttype).ProductType;
      let Wbs1 = this.trackDetailsForm2.value.wbs1;
      let Wbs2 = this.trackDetailsForm2.value.wbs2;

      const data = await this.orderService.Get_WBS3(ProjectCode, StructureElementType, productType, Wbs1,Wbs2).toPromise()
      return data;


    } catch (error) {

      return [];

    }

  }

  async getWbs2List(): Promise<any> {
    try {

      debugger;
      let ProjectCode = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectCode;
      let StructureElementType = this.structureList.find(x => x.StructureElementTypeId === this.trackDetailsForm.value.structureelement).StructureElementType;
      let productType = this.ProductTypeList.find((x: { ProductTypeID: any; }) => x.ProductTypeID === this.trackDetailsForm.value.Producttype).ProductType;
      let Wbs1 = this.trackDetailsForm2.value.wbs1;

      const data = await this.orderService.Get_WBS2(ProjectCode, StructureElementType, productType, Wbs1).toPromise()
      return data;


    } catch (error) {

      return [];

    }

  }


  GetWBS3() {
    debugger;
    let ProjectCode = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectCode;
    let StructureElementType = this.structureList.find(x => x.StructureElementTypeId === this.trackDetailsForm.value.structureelement).StructureElementType;
    let productType = this.ProductTypeList.find((x: { ProductTypeID: any; }) => x.ProductTypeID === this.trackDetailsForm.value.Producttype).ProductType;
    let Wbs1 = this.trackDetailsForm2.value.wbs1;
    let Wbs2 = this.trackDetailsForm2.value.wbs2;

    debugger;
    this.orderService.Get_WBS3(ProjectCode, StructureElementType, productType, Wbs1, Wbs2).subscribe({
      next: (response) => {
        debugger;
        this.WBS3dropList = response;
      },

      error: (e) => {
      },
      complete: () => {
        this.generatebbs();
       
      },

    });


  }

  changeWbs3(event: any) {
    debugger;
  
    this.trackDetailsForm2.controls['bbs'].reset();
    this.trackDetailsForm2.controls['bbsdescription'].reset();
  
    this.generatebbs();
 
  }

  async GetESMTrackerGrid(StructureElementTypeId: any, ProductTypeID: any, ProjectCode: any) {


    try {
      this.Loading = true;
      debugger;

      this.TrackingDetailslist = [];
      const data = await this.orderService.getESMTrackingDetails(StructureElementTypeId, ProductTypeID, ProjectCode).toPromise();
      this.TrackingDetailslist = data;
      this.Loading = false;
      if (this.TrackingDetailslist.length <= 0) {
        this.TrackingDetailslist = [];
        this.TrackingDetailsCount = 0;
        alert("Record not found");
        return;
      }

      this.TrackingDetailsCount = this.TrackingDetailslist.length;
      this.TrackingDetailslist_backup=data;

    }
    catch (err: any) {
      alert(err.error);
    }
  }

  ViewList() {

    //this.isformsubmit = true;
    if (this.trackDetailsForm.valid) {

      debugger;
      let StructureElementTypeId = this.trackDetailsForm.value.structureelement;
      let ProductTypeID = this.trackDetailsForm.value.Producttype;
      let ProjectId = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectId;

      this.trackDetailsForm2.controls['overdelv'].patchValue("10.0");
      this.trackDetailsForm2.controls['underdelv'].patchValue("2.0");
      this.trackDetailsForm2.controls['estimatedweight'].patchValue(0);
      this.trackDetailsForm2.controls['ordertype'].patchValue("ZMDO");

      this.GetESMTrackerGrid(StructureElementTypeId, ProductTypeID, ProjectId)

    }
    else {
      this.tosterService.error("Select All Fields")
    }


  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    // this.enableEditIndex = null;
  }
  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    // this.enableEditIndex = null;
  }

  searchTrackingDetailsData() {

    if (this.searchText != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        item.TrakingId.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.PONumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.WBS1.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.WBS2.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.WBS2.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.BBSNO.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.BBSSDesc.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.ReqDate.toLowerCase().includes(this.searchText.toLowerCase())

      );
    }
    this.TrackingDetailslist = this.TrackingDetailslist_backup;
    if (this.searchTrackerId != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.TrakingId?.toLowerCase().includes(this.searchTrackerId.trim().toLowerCase())
        this.checkFilterData(this.searchTrackerId, item.TrakingId)
      );
    }

    if (this.searchPONumber != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.PONumber?.toLowerCase().includes(this.searchPONumber.trim().toLowerCase())
        this.checkFilterData(this.searchPONumber,item.PONumber)
      );
    }

    if (this.searchWBS1 != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.WBS1?.toString().toLowerCase().includes(this.searchWBS1.trim().toLowerCase())
        this.checkFilterData(this.searchWBS1,item.WBS1)
      );
    }
    if (this.searchWBS2 != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.WBS2?.toString().toLowerCase().includes(this.searchWBS2.trim().toLowerCase())
        this.checkFilterData(this.searchWBS2,item.WBS2)
      );
    }
    if (this.searchWBS3 != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.WBS3?.toLowerCase().includes(this.searchWBS3.trim().toLowerCase())
        this.checkFilterData(this.searchWBS3,item.WBS3)
      );
    }

    if (this.searchBBS != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.BBSNO?.toLowerCase().includes(this.searchBBS.trim().toLowerCase())
        this.checkFilterData(this.searchBBS,item.BBSNO)
      );
    }
    if (this.searchBBSDesc != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.BBSSDesc?.toString().toLowerCase().includes(this.searchBBSDesc.trim().toLowerCase())
        this.checkFilterData(this.searchBBSDesc,item.BBSSDesc)
      );
    }

    if (this.searchReqDelivery != undefined) {
      this.TrackingDetailslist = this.TrackingDetailslist.filter(item =>
        //item.ReqDate?.toString().toLowerCase().includes(this.searchReqDelivery.trim().toLowerCase())
        this.checkFilterData(this.searchReqDelivery,item.ReqDate)
      );
    }

    console.log("data = ", this.TrackingDetailslist)

  }

  reset() {

    this.generateLabel = "Generate";
    this.trackDetailsForm2.reset();
    this.isEditing = false;
    // this.isformsubmit=false;
    //this.ViewList();
  }

  onGenerate() {
    this.isaddnew = true;
    //this.isformsubmit=true;
    debugger;

    if (this.trackDetailsForm.valid && this.trackDetailsForm2.valid) {

      this.isformsubmit=false;
      let ProjectId = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectId;
      let StructureElementTypeId = this.structureList.find(x => x.StructureElementTypeId === this.trackDetailsForm.value.structureelement).StructureElementTypeId;
      let ProductTypeID = this.ProductTypeList.find((x: any) => x.ProductTypeID === this.trackDetailsForm.value.Producttype).ProductTypeID;
      let ContractNo = this.Contractlist.find((x: any) => x.ContractNo === this.trackDetailsForm.value.contract).ContractNo;
     
      let WBSElementId:any;
      if(this.WBS3dropList.length==0)
      {
        WBSElementId = this.WBS2dropList.find((x: any) => x.WBS2 === this.trackDetailsForm2.value.wbs2).NDS_WBSELEMENT_ID;

      }
      else{
        WBSElementId = this.WBS3dropList.find((x: any) => x.WBS3 === this.trackDetailsForm2.value.wbs3).WBSELEMENTID;

      }
      
      let po = this.trackDetailsForm2.value.ponumber;
      let bbs = this.trackDetailsForm2.value.bbs;
      let bbsdesc = this.trackDetailsForm2.value.bbsdescription;
      let remark = this.trackDetailsForm2.value.remark??"";
      let Location = this.trackDetailsForm2.value.location??"";
      let OverDelTolerance = this.trackDetailsForm2.value.overdelv;//double
      let UnderDelTolerance = this.trackDetailsForm2.value.underdelv;//
      let ContactPerson = this.trackDetailsForm2.value.sitecontactperson??"";
      let EstimatedWeight = this.trackDetailsForm2.value.estimatedweight;
      let orderType = this.trackDetailsForm2.value.ordertype;

      let reqDate = this.trackDetailsForm2.value.reqdate ? this.trackDetailsForm2.value.reqdate.replaceAll('-', '') : '';
      let podate = this.trackDetailsForm2.value.podate ? this.trackDetailsForm2.value.podate.replaceAll('-', '') : '';
      let productionDate = this.trackDetailsForm2.value.proddate ? this.trackDetailsForm2.value.proddate.replaceAll('-', '') : '';

      let counter=0;
      const newEsm: SaveEsmTracker = {
        TrakingId: "",
        ProjectId: ProjectId,
        ContractNo: ContractNo,
        PONumber: po,
        WBSElementId: WBSElementId,
        StructureElementTypeId: StructureElementTypeId,
        ProductTypeId: ProductTypeID,
        BBSNO: bbs,
        BBSSDesc: bbsdesc,
        ReqDate: reqDate,
        IntRemark: remark,
        ExtRemark: '',
        OrdDate: podate,
        ProdDate: productionDate,
        OrderType: orderType.toString(),
        Location: Location,
        OverDelTolerance: OverDelTolerance,//double
        UnderDelTolerance: UnderDelTolerance,//
        ContactPerson: ContactPerson,
        EstimatedWeight: EstimatedWeight,
      }

      this.Loading = true;
      this.orderService.SaveESMTrackingDetails(newEsm).subscribe({
        next: (response) => {
          if (response[0].ErrorMessage == "") {
            if (response[0].Result == "BBSNO") {
              this.tosterService.warning("BBS No Already Exist !.");
              counter=1;


            }
            else if (response[0].Result == "UNSUCCESSFUL") {
              this.tosterService.warning("Unable to Save Tracking Id Details !");
              counter=1;


            }
            else if (response[0].Result == "SUCCESS") {
              this.tosterService.success("Tracking Details Saved successfully !.");

              counter=0;

            }

          }

          else {
            this.tosterService.error("Save Failed ! Please contact Administrator !.");
            counter=1;


          }


        },
        error: (e) => {
          console.log("error", e);
          this.tosterService.error(e.error);
          this.Loading = false;
          counter=0;
          return;

        },
        complete: () => {
          if(counter==0)
          {
            this.trackDetailsForm2.reset();
          }
          this.Loading = false;
          this.GetESMTrackerGrid(StructureElementTypeId, ProductTypeID, ProjectId);
          return;

        },
      });
    }
    else
    {
      this.isformsubmit=true;
      this.tosterService.error("Select all required filed.");
      return;
    }

    // else{
    //   // alert("Please Fill All Fields Correctly!");
    //   this.tosterService.warning('Please fill all fields correctly!');
    // }




  }


  async Update(TrackingId: any) {
    debugger;


    this.isEditing = true;
    let ProjectId = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectId;
    let StructureElementTypeId = this.structureList.find(x => x.StructureElementTypeId === this.trackDetailsForm.value.structureelement).StructureElementTypeId;
    let ProductTypeID = this.ProductTypeList.find((x: any) => x.ProductTypeID === this.trackDetailsForm.value.Producttype).ProductTypeID;
    let ContractNo = this.Contractlist.find((x: any) => x.ContractNo === this.trackDetailsForm.value.contract).ContractNo;
    let orderType = this.trackDetailsForm2.value.ordertype;
    let WBSElementId=0;
    let po = this.trackDetailsForm2.value.ponumber;
    let bbs = this.trackDetailsForm2.value.bbs;
    let bbsdesc = this.trackDetailsForm2.value.bbsdescription;
    let reqDate = this.trackDetailsForm2.value.reqdate ? this.trackDetailsForm2.value.reqdate.replaceAll('-', '') : '';
    let remark = this.trackDetailsForm2.value.remark;
    let podate = this.trackDetailsForm2.value.podate ? this.trackDetailsForm2.value.podate.replaceAll('-', '') : '';
    let productionDate = this.trackDetailsForm2.value.proddate ? this.trackDetailsForm2.value.proddate.replaceAll('-', '') : '';
    let Location = this.trackDetailsForm2.value.location;
    let OverDelTolerance = this.trackDetailsForm2.value.overdelv;//double
    let UnderDelTolerance = this.trackDetailsForm2.value.underdelv;//
    let ContactPerson = this.trackDetailsForm2.value.sitecontactperson;
    let EstimatedWeight = this.trackDetailsForm2.value.estimatedweight;

    if (TrackingId == "") {
      this.tosterService.warning("Select Record to update !");
      this.Loading = false;
      return;

    }

    const newEsm: SaveEsmTracker = {

      TrakingId: TrackingId,
      ProjectId: ProjectId,
      ContractNo: ContractNo,
      PONumber: po,
      WBSElementId: WBSElementId,
      StructureElementTypeId: StructureElementTypeId,
      ProductTypeId: ProductTypeID,
      BBSNO: bbs,
      BBSSDesc: bbsdesc,
      ReqDate: reqDate,
      IntRemark: remark,
      ExtRemark: '',
      OrdDate: podate,
      ProdDate: productionDate,
      OrderType: orderType.toString(),
      Location: Location,
      OverDelTolerance: OverDelTolerance,//double
      UnderDelTolerance: UnderDelTolerance,//
      ContactPerson: ContactPerson,
      EstimatedWeight: EstimatedWeight,


    }
    this.Loading = true;
    this.orderService.UpdateESMTrackingDetails(newEsm)
      .subscribe({
        next: (response) => {
          debugger;
          if (response[0].ErrorMessage == "") {
            if (response[0].Result == "BBSNO") {
              this.tosterService.warning("BBS No Already Exist !.");
              this.Loading = false;
              return;

            }
            else if (response[0].Result == "UNSUCCESSFUL") {
              this.tosterService.warning("Unable to Save Tracking Id Details !");
              this.Loading = false;
              return;
            }
            else if (response[0].Result == "SUCCESS") {
              this.tosterService.success("Tracking Details Updated successfully !.");
              this.Loading = false;
              return;


            }

          }

          else {
            this.tosterService.error("Update Failed ! Please contact Administrator !.");
            this.Loading = false;
            return;


          }
        },
        error: (e) => {
          this.Loading = false;
          console.log("error", e);

        },
        complete: () => {
          // completed  
          this.Loading = false;
          this.ViewList();
          this.isEditing = false;
          // this.tosterService.success('ESM Details Updated successfully');
          this.trackDetailsForm2.reset();
          this.generateLabel="Generate";
        },


      });


  }

  trackingId = "";


  async Edit(item: any) {

    debugger
    this.isEditing = true;
    //this.generateLabel = "Update";


    let response = await this.GetESMTrackeringDetailsById(item.TrakingId);

    if (response) {
      if (response[0].ReleasedStatus =="R") {
        this.tosterService.error("Selected Tracking Number has been Released from ODOS, Can't Edit Released Tracking Number Details !");
   
      }
      else {
        item = response[0];

        this.trackingId = item.TrakingId;
        this.trackDetailsForm2.controls['bbs'].patchValue(item.BBSNO);
        this.trackDetailsForm2.controls['bbsdescription'].patchValue(item.BBSSDesc);
        this.trackDetailsForm2.controls['wbs1'].patchValue(item.WBS1);
        this.trackDetailsForm2.controls['wbs2'].patchValue(item.WBS2);
        this.trackDetailsForm2.controls['wbs3'].patchValue(item.WBS3);
        this.trackDetailsForm2.controls['ponumber'].patchValue(item.PONumber);
        this.trackDetailsForm2.controls['podate'].patchValue(this.datepipe.transform(this.UpdateDateFormat(item.OrdDate), 'yyyy-MM-dd'));
        this.trackDetailsForm2.controls['proddate'].patchValue(this.datepipe.transform(this.UpdateDateFormat(item.ProdDate), 'yyyy-MM-dd'));
        this.trackDetailsForm2.controls['reqdate'].patchValue(this.datepipe.transform(this.UpdateDateFormat(item.ReqDate), 'yyyy-MM-dd'));


        this.trackDetailsForm2.controls['sitecontactperson'].patchValue(item.ContactPerson);
        this.trackDetailsForm2.controls['estimatedweight'].patchValue(item.EstimatedWeight);
        this.trackDetailsForm2.controls['remark'].patchValue(item.IntRemark);
        this.trackDetailsForm2.controls['location'].patchValue(item.Location);
        this.trackDetailsForm2.controls['ordertype'].patchValue(item.OrderType);
        this.trackDetailsForm2.controls['overdelv'].patchValue(item.OverDelTolerance);
        this.trackDetailsForm2.controls['underdelv'].patchValue(item.UnderDelTolerance);

        this.generateLabel = "Update";
      }
    }
  }

  TrackingDetailslistById: any[] = [];
  async GetESMTrackeringDetailsById(TrakingId: any) {
    try {
      debugger;
      //this.TrackingDetailslist= [];
      let data = await this.orderService.getESMTrackingDetailsById(TrakingId).toPromise();
      this.TrackingDetailslist = data;
      console.log("TrackingDetailslistById", this.TrackingDetailslist)
      return data;
    }
    catch (err: any) {
      alert(err.error);
    }
  }


  UpdateDateFormat(date: string) {
    let dateArr = date.split('/');
    let temp =  dateArr[0];
    dateArr[0] = dateArr[1];
    dateArr[1] = temp;

    date = dateArr.join('/')
    return date;
  }

  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue.toString().includes(',')) {
      let value = ctlValue.toString().toLowerCase().trim().split(',');
      return value.some((char: string) => item.toString().toLowerCase().includes(char))
    } else {
      return item
        .toString()
        .toLowerCase()
        .includes(
          ctlValue
            .toString()
            .toLowerCase()
            .trim()
        )
    }
  }

}
