import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { GroupMark } from 'src/app/Model/groupmark';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { capposting } from 'src/app/Model/capposting';
import { WbsService } from '../wbs.service';
import { ToastrService } from 'ngx-toastr';
import { ThisReceiver } from '@angular/compiler';
import { ParametersetService } from 'src/app/ParameterSet/Services/Parameterset/parameterset.service';
import { BomData } from 'src/app/Model/BomData';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-capposting',
  templateUrl: './capposting.component.html',
  styleUrls: ['./capposting.component.css']
})
export class CapPostingComponent implements OnInit {

  @Input() custName: any;
  @Input() postHeaderId: any;
  @Input() wbselementID: any;
  @Input() projectNum: any;
  @Input() projectDesc: any;
  @Input() block: any;
  @Input() productType: any;
  @Input() structureElement: any;
  @Input() part: any;
  @Input() storey: any;

  cappostingForm!: FormGroup;
  postingForm!: FormGroup;
  capingInfoList: any = [];
  searchText: any = '';
  searchResult = false;
  CopyIndex = null;
  selectedstruct: any = null;
  selectedproduct: any = null;
  enableEditIndex = null;
  isEditing: boolean = false;
  masterSelected = false;
  producttypeList: any[] = [];
  structureList: any = [] = [];
  temparray: any[] = [];
  toggleFilters = false
  page = 1;
  pageSize = 10;
  @Input() prodttype: any;
  @Input() structure: any;
  // @Input() wbsitemdata:any;
  userProfile: any
  formsubmit: boolean = false;
  disableSubmit: boolean = false
  isaddnew: boolean = false
  selectedItems: any = [];
  disabledropdown: boolean = false;
  storeyFromList: any = [];
  groupmarkList: any = [];
  mo1co1mo2co2List: any = [];
  customerList: any[] = [];
  projectList: any[] = [];
  structureElementarray: any[] = [];
  storeyToList: any = [];
  Groupmarkinglist: GroupMark[] = [];
  newwbs: capposting[] = [{ borc: '', morc: '', productcode: '', shapecode: '', width: '', depth: '', qty: '', crosslen: '', mainlen: '', mo1: '', mo2: '', co1: '', co2: '' }];
  headerInfo: any
  CappingProductList: any[] = [];
  Heading: string = ''
  shapeCodeList: any;
  CappingGenerated: string = 'No'
  CappingGeneratedColor: string = '#ff0000'

  loading: boolean = false

  userId:any;

  constructor(
    private toastr: ToastrService,
    public parametersetService: ParametersetService,
    public activeModal: NgbActiveModal,
    public wbsService: WbsService,
    private modalService: NgbModal,
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userId = this.loginService.GetUserId();
    this.GetStructElement()
    this.GetProductType()
    this.GetPostingInfoList()
    if (this.structureElement == 'Beam') {
      this.Heading = 'Capping'
      this.GetCapingHeaderInfo()
    } else if (this.structureElement == 'Column') {
      this.Heading = 'C-Link'
      this.GetClinkHeaderInfo()
    }

    // this.customerList = [
    //   { item_id: 1, item_text: 'ASIAGLOBE TRADE CONSORTIUM PTE LTD' },
    //   { item_id: 2, item_text: 'ASL SHIPYARD PTE LTD' },
    //   { item_id: 3, item_text: 'ASSET RECOVERY PTE LTD' }

    // ];
    // this.projectList = [
    //   { item_id: 1, item_text: 'AC060648 - HDB-BLDG WKS @ PUNGGOL WE' },
    //   { item_id: 2, item_text: 'C060649 - HDB BLDG WORKS AT QUEENST' },
    //   { item_id: 3, item_text: 'INDUSTRIAL DEVELOPMENT BKT _ BATOK' }

    // ];
    // this.producttypeList = [
    //   { item_id: 1, item_text: 'MSH' },
    //   { item_id: 2, item_text: 'PRC' },
    //   { item_id: 3, item_text: 'BPC' }

    // ];
    // this.storeyToList = [
    //   { item_id: 1, item_text: '1' },
    //   { item_id: 2, item_text: '2' },
    //   { item_id: 3, item_text: '3' },
    //   { item_id: 4, item_text: '4' },
    //   { item_id: 4, item_text: '5' },
    //   { item_id: 30, item_text: '30' }

    // ];
    // this.structureElementarray = [
    //   { item_id: 'Beam', item_text: 'Beam' },
    //   { item_id: 'Column', item_text: 'Column' },
    //   { item_id: 'Drain', item_text: 'Drain' },
    //   { item_id: 'Dwall', item_text: 'Dwall' },
    //   { item_id: 'Slab', item_text: 'Slab' },
    //   { item_id: 'FDN1', item_text: 'FDN1' },
    //   { item_id: 'MISC', item_text: 'MISC' },
    //   { item_id: 'Pile', item_text: 'Pile' },
    //   { item_id: 'Scab1', item_text: 'Scab1' },
    //   { item_id: 'Wall', item_text: 'Wall' },

    // ];

    // this.groupmarkList = [
    //   { item_id: 'BARMARKTEST', item_text: 'BARMARKTEST', 'item_rev': 0 },
    //   { item_id: 'VARIOUSBAR-T', item_text: 'VARIOUSBAR-T', 'item_rev': 1 },
    //   { item_id: 'VARIOUSBAR-T-A', item_text: 'VARIOUSBAR-T-A', 'item_rev': 0 },
    //   { item_id: 'VARIOUSBAR-T-C', item_text: 'VARIOUSBAR-T-C', 'item_rev': 1 },
    //   { item_id: 'VARIOUSBAR-T-D', item_text: 'VARIOUSBAR-T-D', 'item_rev': 2 },
    //   { item_id: 'VARIOUSBAR-T-E', item_text: 'VARIOUSBAR-T-E', 'item_rev': 0 }

    // ];

    // this.NewproducttypeList = [
    //   { item_id: 'MSH', item_text: 'MSH' },
    //   { item_id: 'PRC', item_text: 'PRC' },
    //   { item_id: 'BPC', item_text: 'BPC' },
    //   { item_id: 'CAB', item_text: 'CAB' },



    // ];
    // this.storeyFromList = [
    //   { item_id: 1, item_text: '1' },
    //   { item_id: 2, item_text: '2' },
    //   { item_id: 3, item_text: '3' },
    //   { item_id: 4, item_text: '4' },
    //   { item_id: 4, item_text: '5' },
    //   { item_id: 30, item_text: '30' }



    // ];
    // this.structureList = [
    //   { item_id: 'Beam', item_text: 'Beam' },
    //   { item_id: 'Column', item_text: 'Column' },
    //   { item_id: 'Drain', item_text: 'Drain' },
    //   { item_id: 'Dwall', item_text: 'Dwall' },
    //   { item_id: 'Pile', item_text: 'Pile' },
    //   { item_id: 'Slab', item_text: 'Slab' },
    // ];

    //console.log(this.wbsdata)
    this.postingForm = this.formBuilder.group({
      borc: [''],
      morc: [''],
      productcode: [''],
      shapecode: [''],
      width: [''],
      depth: [''],
      qty: [''],
      crosslen: [''],
      mainlen: [''],
      mo1: [''],
      mo2: [''],
      co1: [''],
      co2: ['']
    });
    this.cappostingForm = this.formBuilder.group({
      customer: [''],
      project: [''],
      projecttype: [''],
      groupmark: ['', Validators.required],
      StructureElement: [''],
      rev: ['0'],
      postqty: ['', Validators.required],
      remark: ['']

    });

  }
  onCopy(item: any, index: any) {
    //Copy of item  
    console.log(index);
    console.log(this.capingInfoList.length);

    this.CopyIndex = index + 1;

    this.capingInfoList.splice(this.CopyIndex, 0, item);
    this.capingInfoList.join();

    console.log(this.capingInfoList.length);


  }


  AddReset() {
    // this.newwbs = [{ block: '', storeyfrom: '', storeyto: '', part: '', prodttype: '', structure: '' }];
  }

  AddNew() {
    let newObj;
    let temp_productCodeId = this.postingForm.controls['productcode'].value
    let temp_productCode = this.CappingProductList.find(x => x.INTPRODUCTCODEID === temp_productCodeId).VCHPRODUCTCODE

    newObj = {
      borc: this.postingForm.controls['borc'].value,
      morc: this.postingForm.controls['morc'].value,
      SHAPECODE: this.postingForm.controls['shapecode'].value,
      WIDTH: this.postingForm.controls['width'].value,
      DEPTH: this.postingForm.controls['depth'].value,
      COUNT: this.postingForm.controls['qty'].value,
      LENGTH: this.postingForm.controls['crosslen'].value,
      MWLENGTH: this.postingForm.controls['mainlen'].value,
      MO1: this.postingForm.controls['mo1'].value,
      MO2: this.postingForm.controls['mo2'].value,
      CO1: this.postingForm.controls['co1'].value,
      CO2: this.postingForm.controls['co2'].value,
      isNew: true,
      CAPPRODUCT: temp_productCode,
      CLINKPRODUCT: temp_productCode
    }
    console.log('before', this.capingInfoList)
    this.capingInfoList.push(newObj)
    this.postingForm.reset()
    console.log('after', this.capingInfoList)
  }

  // Loaddata() {
  //   // this.capingInfoList = [
  //   //   {
  //   //     borc: true, morc: true, productcode: '', shapecode: '', width: '1', depth: '1', qty: '1', crosslen: '1', mainlen: '2', mo1: '2', mo2: '1', co1: '1', co2: '2', active: true, Confirm: true, isEdit: false, isSelected: false,

  //   //   },
  //   //   // {
  //   //   //   borc: '', morc: '', productcode: '', shapecode: '', width: '2', depth: '4',qty:'3',crosslen:'1',mainlen:'2',mo1:'2',mo2:'3',co1:'4',co2:'3', active: true, Confirm: true, isEdit: false, isSelected: false,

  //   //   // },
  //   //   // {
  //   //   //   borc: '', morc: '', productcode: '', shapecode: '', width: '5', depth: '1',qty:'2',crosslen:'4',mainlen:'8',mo1:'9',mo2:'1',co1:'3',co2:'4', active: true, Confirm: true, isEdit: false, isSelected: false,

  //   //   // },
  //   //   // { borc: '', morc: '', productcode: '', shapecode: '', width: '12', depth: '2',qty:'3',crosslen:'3',mainlen:'7',mo1:'0',mo2:'0',co1:'0',co2:'0', active: true, Confirm: true, isEdit: false, isSelected: false,isExpand: false,'Storey': [] },

  //   // ]

  // }

  changegroupmark(event: any) {
    // let rev = this.groupmarkList.filter(x => x.item_id === event).
    let obj = this.groupmarkList.filter((x: { item_id: any; }) => x.item_id === event);
    //console.log(obj);
    // console.log(obj[0].item_rev);
    this.cappostingForm.controls['rev'].patchValue(obj[0].item_rev);
  }
  // addnew() {
  //   this.isaddnew = !this.isaddnew;

  // }
  Savegroupmark() {
    this.formsubmit = true;
    if (this.cappostingForm.valid) {
      this.Groupmarkinglist.push({
        GroupMark: this.cappostingForm.value.groupmark,
        Rev: this.cappostingForm.value.rev,
        Qty: this.cappostingForm.value.postqty,
        Remark: this.cappostingForm.value.remark
      })
      this.formsubmit = false;
      this.cappostingForm.reset();
      console.log(this.cappostingForm.value)
      console.log(this.Groupmarkinglist)
    }
    else {

    }
  }
  async submitReview() {
    debugger
    // this.loading = true
    console.log(this.structureElement)
    console.log(this.productType)
    for (let i = 0; i < this.capingInfoList.length; i++) {

   
        // this.loading = true
        let temp_productCode:any;
  
        if (this.structureElement == 'Beam') {
           temp_productCode = this.capingInfoList[i].CAPPRODUCT;
           this.CappingProductList = await this.GetCapProductList_Wrapper(temp_productCode);
          

        }
        else{
           temp_productCode = this.capingInfoList[i].CLINKPRODUCT;
           this.CappingProductList = await this.GetClinkProductList_Wrapper(temp_productCode);

        }
        
        let temp_productCodeId = this.CappingProductList.find(x => x.VCHPRODUCTCODE === temp_productCode).INTPRODUCTCODEID;

        let structureElementId = this.structureList.find((x: { StructureElementType: any; }) => x.StructureElementType === this.structureElement).StructureElementTypeId
        let productTypeId = this.producttypeList.find(x => x.ProductType === this.productType).ProductTypeID
        let WBSobj = {
          WBSElementID: Number(this.wbselementID),
          ProductCodeID: Number(temp_productCodeId),
          Width: Number(this.capingInfoList[i].WIDTH),
          Depth: Number(this.capingInfoList[i].DEPTH),
          MWLength: Number(this.capingInfoList[i].MWLENGTH),
          CWLength: Number(this.capingInfoList[i].LENGTH),
          Qty: Number(this.capingInfoList[i].COUNT),
          RevNo: 0,
          AddFlag: 's',
          ShapeId: String(this.capingInfoList[i].SHAPECODE),
          MO1: Number(this.capingInfoList[i].MO1),
          MO2: Number(this.capingInfoList[i].MO2),
          CO1: Number(this.capingInfoList[i].CO1),
          CO2: Number(this.capingInfoList[i].CO2),
          StructElementID: structureElementId,
          ProductTypeL1Id: productTypeId,
          UserId: this.userId,
          PostHeaderID: Number(this.postHeaderId)
        }
        if (this.structureElement == 'Beam') {

          var a = await this.AddPostingCCLMarkDetails_Wrapper(WBSobj);
          //Add code for expand  
          this.toastr.success("Record added successfully");
          this.CappingGenerated = 'YES'
          this.CappingGeneratedColor = 'green'
          // this.wbsService.AddPostingCCLMarkDetails(WBSobj).subscribe({
          //   next: (response) => {
           
             
          //   },
          //   error: (e) => {
          //     this.toastr.error(e.error);
          //   },
          //   complete: () => {
          //     this.GetPostingInfoList()

          //   },
          // });
        } else if (this.structureElement == 'Column') {

          var a = await this.AddPostingCLinkCCLMarkDetails_Wrapper(WBSobj);
          //Add code for expand  
          this.toastr.success("Record added successfully");
          this.CappingGenerated = 'YES'
          this.CappingGeneratedColor = 'green'
          // this.wbsService.AddPostingCLinkCCLMarkDetails(WBSobj).subscribe({
          //   next: (response) => {
          //     console.log(response);
          //     //Add code for expand    

          //     this.toastr.success("Record added successfully");

          //     this.CappingGenerated = 'YES'
          //     this.CappingGeneratedColor = 'green'
          
          //   },
          //   error: (e) => {
          //     this.toastr.error(e.error);
          //   },
          //   complete: () => {
          //     this.GetPostingInfoList()
          //   },
          // });
        }
     

    }
    this.GetPostingInfoList()
    // this.loading = false
  }

  isAllSelected() {
    this.masterSelected = this.capingInfoList.every(function (item: any) {
      return item.isSelected == true;
    })

  }

  cancel() {
    this.CappingGenerated = 'NO'
    this.CappingGeneratedColor = '#ff0000'
    this.activeModal.close({ event: 'close', isConfirm: true })
  }


  GetPostingInfoList() {
    if (this.structureElement == 'Beam') {
      //CAPING
      this.GetPostCappingInfoList()
    } else if (this.structureElement == 'Column') {
      //CLINK
      this.GetPostClinkInfoList()
    }
  }

  GetPostClinkInfoList() {
    debugger;
    this.capingInfoList = []
    let postHeaderId = this.postHeaderId
    this.wbsService.GetPostClinkInfoList(postHeaderId).subscribe({
      next: (response) => {
        console.log(response);
        this.capingInfoList = response;
        console.log("list", this.capingInfoList)
        //Add code for expand    
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false

        this.capingInfoList.forEach((element: any) => {
          element.editFieldName = ""
        });
        console.log(this.capingInfoList);
      },
    });
  }

  GetPostCappingInfoList() {
    debugger;
    let postHeaderId = this.postHeaderId
    this.wbsService.GetPostCappingInfoList(postHeaderId).subscribe({
      next: (response) => {
        console.log(response);
        this.capingInfoList = response;
        console.log("list", this.capingInfoList)
        //Add code for expand    
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false
      },
    });
  }

  GetCapingHeaderInfo() {
    debugger
    let WBSElementsId = this.wbselementID
    let ParentId = 0
    this.wbsService.GetPostingCappingHeaderInfo(WBSElementsId, ParentId).subscribe({
      next: (response) => {
        console.log(response);
        this.headerInfo = response;
        console.log("headerInfo", this.headerInfo)
        //Add code for expand    
      },
      error: (e) => {
      },
      complete: () => {

      },
    });
  }
  GetClinkHeaderInfo() {
    let WBSElementsId = this.wbselementID
    let ParentId = 0
    this.wbsService.GetPostingCLinkHeaderInfo(WBSElementsId, ParentId).subscribe({
      next: (response) => {
        console.log(response);
        this.headerInfo = response;
        console.log("headerInfo", this.headerInfo)
        //Add code for expand    
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  LoadddlCappingProductList(cappingProduct: any) {
    this.CappingProductList = []
    console.log("capping", cappingProduct.value)
    if (this.structureElement == 'Beam') {
      this.wbsService.GetCapProductList(cappingProduct.value).subscribe({
        next: (response) => {
          console.log("CappingProductList", response);
          this.CappingProductList = response;
        },
        error: (e) => {
        },
        complete: () => {
        },
      });
    } else if (this.structureElement == 'Column') {
      this.wbsService.GetClinkProductList(cappingProduct.value).subscribe({
        next: (response) => {
          console.log("CappingProductList", response);
          this.CappingProductList = response;
        },
        error: (e) => {
        },
        complete: () => {
        },
      });
    }
  }

  DeletePostingInfo(item: any) {
    debugger;
    if (item.isNew) {
      let index = this.capingInfoList.findIndex((x: any) => x === item)
      this.capingInfoList.splice(index, 1)
      this.toastr.success("Record deleted successfully");
    }
    else {
      let index = this.capingInfoList.findIndex((x: any) => x === item)
      if (this.structureElement == 'Beam') {
        this.DeletePostingCap(item.CAPPRODUCT, item.WIDTH, item.SHAPECODE, item.SMID, index)
      } else if (this.structureElement == 'Column') {
        debugger;
        this.DeletePostingCLink(item.CLINKPRODUCT, item.WIDTH, item.SHAPECODE, item.SMID, index)
      }
    }
  }

  DeletePostingCap(vchProductCode: any, Width: any, ShapeCode: any, StructMarkId: any, index: any) {
    let PostHeaderId = this.postHeaderId
    this.wbsService.DeletePostingCapStructure(PostHeaderId, vchProductCode, Width, ShapeCode, StructMarkId).subscribe({
      next: (response) => {
        console.log(response);
        this.toastr.success("Record deleted successfully");
        this.capingInfoList.splice(index, 1)

        // this.GetPostCappingInfoList()
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  DeletePostingCLink(vchProductCode: any, Width: any, ShapeCode: any, StructMarkId: any, index: any) {

    let PostHeaderId = this.postHeaderId
    this.wbsService.DeletePostingCLinkStructure(PostHeaderId, vchProductCode, Width, ShapeCode, StructMarkId).subscribe({
      next: (response) => {
        console.log(response);
        this.toastr.success("Record deleted successfully");
        this.capingInfoList.splice(index, 1)
        // this.GetPostClinkInfoList()

      },
      error: (e) => {
      },
      complete: () => {
      },

    });
  }
  GetStructElement(): void {
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
  GetProductType(): void {
    this.wbsService.GetProductType().subscribe({
      next: (response) => {
        this.producttypeList = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  GetShapeCodeList(ENTEREDTEXT: any) {
    this.shapeCodeList = []
    if (this.structureElement == 'Beam') {
      this.GetCapShapeCodeList(ENTEREDTEXT.value)
    } else if (this.structureElement == 'Column') {
      this.GetClinkShapeCodeList(ENTEREDTEXT.value)
    }
  }
  GetCapShapeCodeList(ENTEREDTEXT: any): void {
    this.wbsService.GetCapShapeCodeList(ENTEREDTEXT).subscribe({
      next: (response) => {
        this.shapeCodeList = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  GetClinkShapeCodeList(ENTEREDTEXT: any): void {
    this.wbsService.GetClinkShapeCodeList(ENTEREDTEXT).subscribe({
      next: (response) => {
        this.shapeCodeList = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  LoaddMO1MO2CO1CO2List(): void {
    debugger;
    let PostHeaderId = this.postHeaderId
    let productcode = this.postingForm.controls['productcode'].value
    let temp_productCode = this.CappingProductList.find(x => x.INTPRODUCTCODEID === productcode).VCHPRODUCTCODE
    let crosslen = this.postingForm.controls['crosslen'].value
    let mainlen = this.postingForm.controls['mainlen'].value
    this.wbsService.GetMO1CO1MO2CO2List(PostHeaderId, temp_productCode, crosslen, mainlen).subscribe({
      next: (response) => {
        debugger;
        this.mo1co1mo2co2List = response;
        this.postingForm.controls['mo1'].patchValue(this.mo1co1mo2co2List[0].MO1);
        this.postingForm.controls['mo2'].patchValue(this.mo1co1mo2co2List[0].MO2);
        this.postingForm.controls['co1'].patchValue(this.mo1co1mo2co2List[0].CO1);
        this.postingForm.controls['co2'].patchValue(this.mo1co1mo2co2List[0].CO2);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false
      },
    });
  }

  async  GetCapProductList_Wrapper(VchText:any):Promise<any>
{
  try {
 
    var a  = await  this.wbsService.GetCapProductList(VchText).toPromise();      
    return a;
  } 
  catch (error) {
    return error;
  }
}

async  GetClinkProductList_Wrapper(VchText:any):Promise<any>
{
  try {
 
    var a  = await  this.wbsService.GetClinkProductList(VchText).toPromise();      
    return a;
  } 
  catch (error) {
    return error;
  }
}
async  AddPostingCCLMarkDetails_Wrapper(wbsObj:any):Promise<any>
{
  try {
 
    var a  = await  this.wbsService.AddPostingCCLMarkDetails(wbsObj).toPromise();      
    return a;
  } 
  catch (error) {
    return error;
  }
}

async  AddPostingCLinkCCLMarkDetails_Wrapper(wbsObj:any):Promise<any>
{
  try {
 
    var a  = await  this.wbsService.AddPostingCLinkCCLMarkDetails(wbsObj).toPromise();      
    return a;
  } 
  catch (error) {
    return error;
  }
}

onEditNew(item:any,Value:any)
{
  this.capingInfoList.forEach((_element: any) => {
    _element.editFieldName = false;
  });


  item.editFieldName = Value;
}

RouteToBom(item: any) {

  debugger;
  let shapeCode:number;

  if(item.STRUCTUREELEMENT.toLowerCase()=='beam')
  {
    shapeCode=7;
  }
  else{
    shapeCode=8;
  }
  let BomData: BomData = {
    StructureElement: item.STRUCTUREELEMENT,
    ProductMarkId: item.PMID,
    CO1: item.CO1,
    CO2: item.CO2,
    MO1: item.MO1,
    MO2: item.MO2,
    ParamValues: item.ParamValues,
    ShapeCodeName: item.SHAPECODE,
    ShapeID: shapeCode
  }

  localStorage.setItem('BomData', JSON.stringify(BomData));

  let route = '#/detailing/DetailingGroupMark/BOM'

  const newWindow: any = window.open(route, 'Product Details');

  // this.openInNewTab();



}
openInNewTab() {

  const url = ['#/detailing/DetailingGroupMark/BOM'];
  
  // Create a temporary anchor element
  const anchor = document.createElement('a');
  anchor.href = this.router.serializeUrl(this.router.createUrlTree(url));
  anchor.target = '_blank';

  // Append the anchor to the body and trigger a click
  document.body.appendChild(anchor);
  anchor.click();

  // Remove the anchor from the body
  document.body.removeChild(anchor);
}
}
