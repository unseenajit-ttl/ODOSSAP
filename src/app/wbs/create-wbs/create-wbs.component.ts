import { Component, OnInit, Input, EventEmitter, Output, Renderer2, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { WbsService } from '../wbs.service';
import { WBS } from 'src/app/Model/wbs';
import { locale } from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-wbs',
  templateUrl: './create-wbs.component.html',
  styleUrls: ['./create-wbs.component.css'],
})
export class CreateWbsComponent implements OnInit {
  isDragging = false;
  initialX = 0;
  initialY = 0;
  right = 0;
  top = 0;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();
  wbscreateForm!: FormGroup;
  @Input() wbs1: any;
  @Input() wbs2: any;
  @Input() wbs3: any;
  @Input() SelectedProjectID: any;
  @Input() customercode: any;
  @Input() storyFrom:any;

  wbs3backup:any;
  wbsextension: any;
  StoreyFrom: any;
  StoreyTo: any;
  userProfile: any;
  disableSubmit: boolean = false;
  iConfirm: boolean = false;
  selectedItems: any = [];
  selectedstoreyItems: any = [];
  dropdownSettings = {};
  storeyToList: any = [];
  storeyFromList: any = [];
  structureList: any = [];
  producttypeList: any = [];
  storeyfromvalidated: boolean = false;
  storeytovalidated: boolean = false;

  StoryFrom: any;
  StoryTo: any;
  Structure: any;
  ProductType: any;
  storeyValidated: boolean = true;
  StoreyErrorMessage: any = '';
  selectedstruct: any = null;
  newwbs: WBS[] = [
    {
      Block: '',
      StoryFrom: undefined,
      StoryTo: undefined,
      Part: '',
      ProductType: '',
      Structure: '',
      WBSTypeId: 1
    },
  ];

  StructureElementArray = [
    { key: '1', value: 'Beam (梁)' },
    { key: '2', value: 'Column (柱)' },
    { key: '4', value: 'Slab' },
    // { key: 'Field3', value: 'Wall (墙)' },
    { key: '68', value: 'Slab Bottom (下板)' },
    { key: '69', value: 'Slab Top (上板)' },
    { key: '5', value: 'Drain (垄沟)' },
    { key: '6', value: 'Dwall (隔牆)' },
    // { key: 'Field3', value: 'Foundation (地基)' },
    { key: '13', value: 'Wall (墙)' },
    { key: '8', value: 'Pile (桩)' },
  ];

  lslab: boolean = false;
  lbeam: boolean = false;
  lcolumn: boolean = false;
  lslabb: boolean = false;
  lslabt: boolean = false;
  ldrain: boolean = false;
  lwall: boolean = false;
  lpile: boolean = false;
  lDwall: boolean = false;

  ProductTypeArray = [
    { key: '1', value: 'Cut To Size Mesh (加工网)' },
    { key: '2', value: 'Stirrup Mesh (梁箍)' },
    { key: '7', value: 'Column Mesh (柱箍)' },
    { key: '4', value: 'Cut & Bend (加工铁)' },
    { key: '10', value: 'Pre-Cage (铁笼)' },
    { key: '9', value: 'Bored Pile Cage (桩笼)' },
    { key: '15', value: 'Core Cage (核心笼)' },
    { key: '14', value: 'Carpet (毯铁)' },
  ];

  lctm: boolean = false;
  lsm: boolean = false;
  lcm: boolean = false;
  lcab: boolean = false;
  lprc: boolean = false;
  lbpc: boolean = false;
  lcore: boolean = false;
  lcar: boolean = false;
  maxlength: any;
  staticlen:any=12;

  constructor(
    public wbsService: WbsService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private el: ElementRef,) { }
 
  ngOnInit(): void {
    // this.GetProductType();
    // this.GetStructElement();
    // this.LoadStorey();
    this.dragElement(document.getElementById("mydiv"));
    if(this.wbs3!=''){
      this.wbs3backup=this.wbs3;
      let templength=this.wbs3backup.toString().length;
      this.maxlength=this.staticlen - templength; 
    }
    else
    {
      this.wbs3='';
      this.maxlength=this.staticlen;
    }
   
    this.StoreyFrom = this.storyFrom;
    this.StoreyFrom = this.StoreyFrom.toString();
    this.StoreyTo = this.wbs2.toString();

    debugger;

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.wbscreateForm = this.formBuilder.group({
      block: ['', Validators.required],
      storeyfrom: ['', Validators.required],
      storeyto: ['', Validators.required],
      part: ['', Validators.required],
      structure: ['', Validators.required],
      Confirm: ['', Validators.required],
      active: ['', Validators.required],
      ProductType: ['', Validators.required],
      StructureElement: ['', Validators.required],
    });
  }

  updatewbs3() {
    this.wbscreateForm.controls['block'].patchValue(this.wbs1);
    this.wbscreateForm.controls['part'].patchValue(this.wbs3);
    this.wbscreateForm.controls['storeyto'].patchValue(this.wbs2);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }

  reset() {
    this.wbscreateForm.controls['block'].reset;
    this.wbscreateForm.controls['storeyfrom'].reset;
    this.wbscreateForm.controls['storeyto'].reset;
    this.wbscreateForm.controls['part'].reset;
    this.selectedstruct = '';
    this.ProductType = '';
  }

  submitReview() {
    debugger;
    this.disableSubmit=true;
    if(this.wbsextension!=undefined && this.wbsextension!="" && this.wbsextension!=null)
    {
    this.wbsextension=this.wbsextension.toUpperCase();
    }
    else
    {
       this.wbsextension="";
      // if(this.wbs3==null || this.wbs3=="" || this.wbs3==undefined)
      // {
      //   this.toastr.error("enter wbs3 extension");
      //   return;
      // }

    }
    console.log("ProductType",this.ProductType)
    if (this.ProductType==undefined || this.ProductType==null) {
      this.toastr.error('Please choose Product Type. (请选产品类型)');
      this.disableSubmit=false;
      this.spinner.hide();
      return;
    }
    else if(this.ProductType.length==0)
    {
      this.toastr.error('Please choose Product Type. (请选产品类型)');
      this.disableSubmit=false;
      this.spinner.hide();
      return;
    }

    if (this.Structure ==null || this.Structure==undefined) {
      this.toastr.error('Please choose Structure Element. (请选结构)');
      this.disableSubmit=false;
      this.spinner.hide();
      return;
    } 
    else if(this.Structure.length==0){
      this.toastr.error('Please choose Structure Element. (请选结构)');
      this.disableSubmit=false;
      this.spinner.hide();
      return;
    }

    this.spinner.show();
    console.log('ProductType', this.ProductType);
    console.log('Structure', this.Structure);
    // if(this.wbs3==""|| this.wbs3==null || this.wbs3==undefined)
    // {
    //   this.wbs3="";
    //   this.wbs3=this.wbsextension;
    // }
    // else
    // {
    //   if(this.wbsextension!="")
    //   this.wbs3=this.wbs3+"-"+this.wbsextension;
    // }
    // if (this.wbs3.length >= 12) {
    //   this.toastr.error('WBS3 Length should be less than or equal to 12');
    //   this.disableSubmit=false;
    //   this.wbs3=this.wbs3backup;
    //   this.spinner.hide();
    //   return;
    // }

    if (!this.storeyValidated) {
      this.toastr.error(this.StoreyErrorMessage);
      this.disableSubmit=false;
      this.spinner.hide();
      return;
    }

   
    this.lbeam = false;
    this.lcolumn = false;
    this.lwall = false;
    this.lslabb = false;
    this.lslabt = false;
    this.ldrain = false;
    this.lDwall = false;
    this.lpile = false;
    this.lslab = false;
    let tempstruct: string = this.Structure.toString();

    for (let i = 0; i < this.Structure.length; i++) {
      if (this.Structure[i] == '1') {
        this.lbeam = true;
      }
      if (this.Structure[i] == '2') {
        this.lcolumn = true;
      }
      if (this.Structure[i] == '13') {
        this.lwall = true;
      }
      if (this.Structure[i] == '68') {
        this.lslabb = true;
      }
      if (this.Structure[i] == '69') {
        this.lslabt = true;
      }
      if (this.Structure[i] == '5') {
        this.ldrain = true;
      }
      if (this.Structure[i] == '6') {
        this.lDwall = true;
      }
      if (this.Structure[i] == '8') {
        this.lpile = true;
      }
      if (this.Structure[i] == '4') {
        this.lslab = true;
      }
    }

    this.lctm = false;
    this.lsm = false;
    this.lcm = false;
    this.lcab = false;
    this.lprc = false;
    this.lbpc = false;
    this.lcore = false;
    this.lcar = false;

    for (let i = 0; i < this.ProductType.length; i++) {
      if (this.ProductType[i] == '1') {
        this.lctm = true;
      }
      if (this.ProductType[i] == '2') {
        this.lsm = true;
      }
      if (this.ProductType[i] == '7') {
        this.lcm = true;
      }
      if (this.ProductType[i] == '4') {
        this.lcab = true;
      }
      if (this.ProductType[i] == '10') {
        this.lprc = true;
      }
      if (this.ProductType[i] == '9') {
        this.lbpc = true;
      }
      if (this.ProductType[i] == '15') {
        this.lcore = true;
      }
      if (this.ProductType[i] == '14') {
        this.lcar = true;
      }
    }

    if (
      this.lctm == true &&
      this.lwall == false &&
      this.lslab == false &&
      this.lslabb == false &&
      this.lslabt == false &&
      this.ldrain == false &&
      this.lpile == false
    ) {
      this.toastr.error(
        'Please choose correct structure element if you choose Cut To Size Mesh. \n(如果选了加工网, 也请选正确的结构)'
      );
      this.disableSubmit=false;
      return;
    }

    if (this.lsm == true && this.lbeam == false) {
      this.toastr.error(
        'Should choose Beam structure element if you choose Stirrup Link Mesh. \n(如果选了梁箍链, 也请选梁结构)'
      );
      this.disableSubmit=false;
      return;
    }

    if (this.lcm == true && this.lcolumn == false) {
      this.toastr.error(
        'Should choose Column structure element if you choose Column Link Mesh. \n(如果选了柱箍链, 也请选柱结构)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lprc == true &&
      this.lcolumn == false &&
      this.lbeam == false &&
      this.lwall == false &&
      this.lslab == false &&
      this.lDwall == false
    ) {
      this.toastr.error(
        'Should choose a structure element if you choose Pre-Cage product. \n(如果选了柱箍链, 也请选柱结构)'
      );
      this.disableSubmit=false;
      return;
    }

    if (this.lbpc == true && this.lpile == false) {
      this.toastr.error(
        'Should choose Pile structure element if you choose BPC product type. \n(如果选了桩笼, 也请选桩结构)'
      );
      this.disableSubmit=false;
      return;
    }
    if (this.lcore == true && this.lcolumn == false) {
      this.toastr.error(
        'Should choose Column structure element if you choose Core Cage. \n(如果选了核心笼, 也请选柱结构)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lcar == true &&
      this.lwall == false &&
      this.lslab == false &&
      this.lslabb == false &&
      this.lslabt == false
    ) {
      this.toastr.error(
        'Should choose Slab or Wall structure element if you choose Carpet product type. \n(如果选了毯铁, 也请选板或墙结构)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lbeam == true &&
      this.lsm == false &&
      this.lcab == false &&
      this.lprc == false
    ) {
      this.toastr.error(
        'Should choose CAB, Pre-Cage or Stirrup Link Mesh product type if you choose Beam structure element. \n(如果选了梁结构, 也请选加工铁,铁笼或梁箍链)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lcolumn == true &&
      this.lcm == false &&
      this.lcab == false &&
      this.lprc == false &&
      this.lcore == false
    ) {
      this.toastr.error(
        'Should choose CAB, Pre-Cage， Column Link Mesh or Core Cage product type if you choose Beam structure element. \n(如果选了柱结构, 也请选加工铁,铁笼或柱箍链)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lwall == true &&
      this.lctm == false &&
      this.lcab == false &&
      this.lprc == false &&
      this.lcar == false
    ) {
      this.toastr.error(
        'Should choose CAB, Pre-Cage, Cut-To-Size Mesh or Carpet product type if you choose Wall structure element. \n(如果选了墙结构, 也请选加工铁,铁笼,加工网或毯铁)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lslab == true &&
      this.lctm == false &&
      this.lcab == false &&
      this.lprc == false &&
      this.lcar == false
    ) {
      this.toastr.error(
        'Should choose CAB, Cut-To-Size Mesh or Carpet product type if you choose Slab structure element. \n(如果选了板结构, 也请选加工铁,加工网或毯铁)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lslabb == true &&
      this.lctm == false &&
      this.lcab == false &&
      this.lcar == false
    ) {
      this.toastr.error(
        'Should choose CAB, Cut-To-Size Mesh or Carpet product type if you choose Slab Bottom structure element. \n(如果选了下板结构, 也请选加工铁,加工网或毯铁)'
      );
      this.disableSubmit=false;
      return;
    }

    if (
      this.lslabt == true &&
      this.lctm == false &&
      this.lcab == false &&
      this.lcar == false
    ) {
      this.toastr.error(
        'Should choose CAB, Cut-To-Size Mesh or Carpet product type if you choose Slab Top structure element. \n(如果选了上板结构, 也请选加工铁,加工网或毯铁)'
      );
      this.disableSubmit=false;
      return;
    }

    //if (lSE_Drain == 1 && this.lctm==false && this.lcab==false && this.lcar==false) {
    //    this.toastr.error("Should choose CAB, Cut-To-Size Mesh or Carpet product type if you choose Drain structure element. \n(如果选了垄沟结构, 也请选加工铁,加工网或毯铁)");
    //    return false;
    //}

    if (this.ldrain == true && (this.lctm == true || this.lcar == true)) {
      this.toastr.error(
        'Should choose Slab structure element if you select Cut-To-Size Mesh or Carpet product type.. \n(请选板结构, 如果选了加工网或毯铁)'
      );
      this.disableSubmit=false;
      return;
    }

    if (this.ldrain == true && this.lcab == false && this.lcar == false) {
      this.toastr.error(
        'Should choose CAB type if you choose Drain structure element. \n(如果选了垄沟结构, 也请选加工铁)'
      );
      this.disableSubmit=false;
      return;
    }

    if (this.lDwall == true && this.lcab == false && this.lprc == false) {
      this.toastr.error(
        'Should choose CAB product type if you choose Dwall structure element. \n(如果选了隔牆结构, 也请选加工铁)'
      );
      this.disableSubmit=false;
      return;
    }

    // if (lSE_Fdn == 1 && this.lcab==false && this.lctm==false) {
    //   this.toastr.error("Should choose CAB or Cut-To-Size product type if you choose Foundation structure element. \n(如果选了地基结构, 也请选加工铁或加工网)");
    //   return false;
    // } commented by me

    if (
      this.lpile == true &&
      this.lbpc == false &&
      this.lcab == false &&
      this.lctm == false
    ) {
      this.toastr.error(
        'Should choose BPC / MESH / CAB product type if you choose Pile structure element. \n(如果选了桩结构, 也请选桩笼)'
      );
      this.disableSubmit=false;
      return;
    }


    //added temp

    if(this.wbs3==""|| this.wbs3==null || this.wbs3==undefined)
    {
      this.wbs3="";
      this.wbs3=this.wbsextension;
    }
    else
    {
      if(this.wbsextension!="")
      this.wbs3=this.wbs3+"-"+this.wbsextension;
    }

    if (this.wbs3.length >= 12) {
      this.toastr.error('WBS3 Length should be less than or equal to 12');
      this.disableSubmit=false;
      this.wbs3=this.wbs3backup;
      this.spinner.hide();
      return;
    }

    //added temp

    let array=this.ProductType;

    array = array.map((item: string) => {
      if (item.trim() === "1") {
        return "7";
      } else if (item.trim() === "2") {
        return "7";
      }
      return item;
    });

    let tempProductype: string;

    // tempProductype = this.replaceCharacter(
    //   this.ProductType.toString(),
    //   '1',
    //   '7'
    // );
    // tempProductype = this.replaceCharacter(tempProductype, '2', '7');
    
    let modifiedArrayAsString = array.join(',');
    tempProductype=modifiedArrayAsString;
    let tempprodtype=modifiedArrayAsString;
    tempprodtype=this.removeDuplicates(tempprodtype);
  
    //getcontractnumber
    this.wbsService
      .getContractNo(this.customercode, this.SelectedProjectID, tempprodtype)
      .subscribe({
        next: (response) => {
          if (response!=22222222222) {
            if (
              this.wbs1 != '' &&
              this.wbs2 != '' &&
              // this.wbs3 != '' &&
              this.StoreyFrom != '' &&
              this.StoreyTo != '' &&  
              this.Structure != '' &&
              this.ProductType != ''
            ) {
              const WBSobj: WBS = {
                intWBSMTNCId: 0,
                intWBSId: 1,
                Block: this.wbs1,
                StoryFrom: this.StoreyFrom,
                StoryTo: this.StoreyTo,
                Part: this.wbs3.toString(),
                ProductType: tempProductype,
                Structure: this.Structure.toString(),
                WBSTypeId: 1
              };
              console.log(WBSobj);

              this.wbsService
                .SaveWBS_Extension(WBSobj, this.SelectedProjectID.toString())
                .subscribe({
                  next: (response) => {
                    if (response == 1) {
                      this.toastr.success('WBS Saved Successfully.');
                      this.saveTrigger.emit(this.wbs3);
                      this.modalService.dismissAll();
                      this.reset();
                    } else if (response == 2) {
                      this.toastr.warning('WBS Allready Exists.');
                      this.saveTrigger.emit();
                      this.modalService.dismissAll();
                    } else if (response == 3) {
                      this.saveTrigger.emit();
                      this.modalService.dismissAll();
                      this.toastr.warning(
                        'Product Type & Structure Element Combination Could Not Save.'
                      );
                    }
                  },
                  error: (e) => {
                    console.log(e);
                    this.disableSubmit=false;
                    this.spinner.hide();
                  },
                  complete: () => {
                    debugger;
                    this.spinner.hide();
                    //this.LoadWBSList(this.SelectedProjectID);
                  },
                });
            } else {
              this.toastr.error('Can not add blank record.');
              this.disableSubmit=false;
              this.spinner.hide();
            }
          } else {
            this.toastr.error(
              'Failed to create WBS for the product as contract is not available for the product. Please check whether you select a correct project or contact the project coordinator.'
            );
            this.disableSubmit=false;
            return;
          }
        },
        error: (e) => {
          this.toastr.error(e);
          this.disableSubmit=false;
          return;
        },
        complete: () => {
          //this.LoadWBSList(this.SelectedProjectID);
        },
      });

    return;
  }

 
  removeDuplicates(original: string): string {
    // Split the string into an array using commas as the separator
    const valuesArray: string[] = original.split(',');

    // Use a Set to store unique values
    const uniqueValuesSet: Set<string> = new Set(valuesArray);

    // Convert the Set back to an array
    const uniqueValuesArray: string[] = Array.from(uniqueValuesSet);

    // Join the array back into a string using commas as the separator
    return uniqueValuesArray.join(',');
  }

  replaceCharacter(
    original: any,
    charToReplace: string,
    replacementChar: string
  ): string {
    if (typeof original !== 'string') {
      this.toastr.error('The input is not a string.');
      return original;
    }

    // Using the replace() method to replace characters
    return original.replace(new RegExp(charToReplace, 'g'), replacementChar);
  }

  cancel() {
    this.modalService.dismissAll();
  }

  ChangeStruct(event: any) {
    this.selectedstruct = event;
  }
  StoreyValidate(storeyFrom: any, storeyTo: any) {
    debugger;
    if (storeyFrom != null && storeyTo != null) {
      if (/[a-zA-Z]/g.test(storeyFrom)) {
        if (/[a-zA-Z]/g.test(storeyTo)) {
          if (storeyFrom === storeyTo) {
            //PASS
            this.storeyValidated = true;
          } else if (
            (this.isNumber(storeyFrom[0]) && this, this.isNumber(storeyTo[0]))
          ) {
            //FAIL
            // this.storeyValidated = false;
            // this.StoreyErrorMessage = "StoreyTo and StoreyFrom should be same"
            // this.toastr.error("StoreyTo and StoreyFrom should be same");
            let strFrom = storeyFrom;

            let strTo = storeyTo;

            if (Number(strFrom[0]) > Number(strTo[0])) {
              this.storeyValidated = false;
              this.toastr.error('StoreyFrom should be less than StoreyTo');
            } else {
              this.storeyValidated = true;
            }
          } else {
            this.storeyValidated = false;
            this.StoreyErrorMessage = 'StoreyTo and StoreyFrom should be same';
            this.toastr.error('StoreyTo and StoreyFrom should be same');
          }
        } else {
          //FAIL
          this.storeyValidated = false;
          this.StoreyErrorMessage = 'StoreyTo and StoreyFrom should be same';
          this.toastr.error('StoreyTo and StoreyFrom should be same');
        }
      } else {
        if (/[a-zA-Z]/g.test(storeyTo)) {
          //FAIL
          this.storeyValidated = false;
          if (!/[a-zA-Z]/g.test(storeyFrom)) {
            this.toastr.error('StoreyTo Should be numberic');
          } else {
            this.StoreyErrorMessage = 'StoreyTo and StoreyFrom should be same';
            this.toastr.error('StoreyTo and StoreyFrom should be same');
          }
        } else {
          if (Number(storeyFrom) > Number(storeyTo)) {
            //FAIL
            this.storeyValidated = false;
            this.StoreyErrorMessage = 'StoreyFrom should be less than StoreyTo';
            this.toastr.error('StoreyFrom should be less than StoreyTo');
          } else {
            //PASS
            this.storeyValidated = true;
          }
        }
      }
    } else {
      if (storeyFrom != null && storeyTo == null) {
        this.StoreyErrorMessage = 'StoreyTo should not be empty';
        //this.toastr.error(this.StoreyErrorMessage)
      } else if (storeyFrom == null && storeyTo != null) {
        this.StoreyErrorMessage = 'StoreyFrom should not be empty';
        this.toastr.error(this.StoreyErrorMessage);
      } else {
        this.StoreyErrorMessage = 'StoreyTo, StoreyFrom should not be empty';
        this.toastr.error(this.StoreyErrorMessage);
      }
      this.storeyValidated = false;
    }
  }

  isNumber(char: any) {
    return /^\d+$/.test(char);
  }

  LoadStorey(): void {
    this.wbsService.GetWbsStorey().subscribe({
      next: (response) => {
        this.storeyFromList = response;
        this.storeyToList = response;
        console.log(this.storeyFromList);
        console.log(this.storeyToList);
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetStructElement(): void {
    this.wbsService.GetStructElement().subscribe({
      next: (response) => {
        this.structureList = response;
        console.log(this.structureList);
      },
      error: (e) => {
        //console.log(e.error);
      },
      complete: () => {},
    });
  }

  GetProductType(): void {
    this.wbsService.GetProductType().subscribe({
      next: (response) => {
        this.producttypeList = response;
        console.log(this.producttypeList);
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  dragElement(elmnt:any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header")!.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e:any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e:any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  WBS3Input(){
    const inputElement = document.getElementById('WBS3');    
     if (inputElement) {inputElement.focus();     }
  }
  blockComma(event: KeyboardEvent) {
    if (event.key === ',') {
      event.preventDefault();
    }
  }
}
