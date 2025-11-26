import { ChangeDetectorRef, Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { CreateWbsComponent } from '../create-wbs/create-wbs.component';
import { WBS } from 'src/app/Model/wbs';
import { ToastrService } from 'ngx-toastr';
import { WbsService } from '../wbs.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { WBSCollapseLevel } from 'src/app/Model/WBSCollapseLevel';
import { WBSElements } from 'src/app/Model/WBSElements';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ProjectListbyCustomer } from 'src/app/Model/ProjectByCustomer';
import { ActivatedRoute } from '@angular/router';
import { findIndex } from 'rxjs';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { DrainParameterSetService } from 'src/app/ParameterSet/Services/Drain/drain-parameter-set.service';
import { Location } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as XLSX from 'xlsx'
import { partition } from 'rxjs/operators';

@Component({
  selector: 'app-wbs',
  templateUrl: './wbs.component.html',
  styleUrls: ['./wbs.component.css']
})

export class WbsComponent implements OnInit {
  @ViewChild('hiddenInput') hiddenInputRef: ElementRef | undefined
  @ViewChild('nextSelectElement') nextSelectElement!: NgSelectComponent;

  wbsForm!: FormGroup;
  submitted = false;
  searchResult = false;
  shiftKeypressed = false;
  closeResult = '';
  searchText: any = '';
  customerList: any = [];

  producttype_filter:any[]=[];
  selectedFileName: string | null = null;
  isFileSelectorOpen = true;



  producttypeList: any = [];
  wbstypeList: any = [];
  projectList: any;
  productCodeList: any[] = [];
  istoggel: boolean = false;
  WbsListArray: any = [] = [];
  loadingData = false;
  toggleFilters = true
  storeyToList: any = [];
  storeyFromList: any = [];
  structureList: any = [] = [];
  filteredPost: any[] = [];
  newwbs: WBS[] = [{
    Block: '', StoryFrom: undefined, StoryTo: undefined, Part: '', ProductType: '', Structure: '',
    WBSTypeId: 0
  }];

  isEditing: boolean = false;
  enableEditIndex = null;
  isCopy: boolean = false;
  CopyIndex = null;


  selectedstruct: any = null;
  selectedproduct: any = null;
  selecttypemesh: any = "";
  customerid: any;
  WBSType:any="1";

  loading: boolean = true;

  masterSelected = false;
  copieditem = new FormControl();
  copiedstroyfrom = new FormControl();
  copiedstroyto = new FormControl();
  copiedpart = new FormControl();

  prodlist: any[] = []

  page = 1;
  pageSize = 0;
  maxSize: number = 10;
  temparray: any[] = [];
  ArrayLength: any;
  currentPage = 1;
  itemsPerPage: number = 10;
  org_itemsPerPage: number = 10;
  isformsubmit: boolean = false;
  prev_index: any = null;
  backup_item: WBS[] = [];

  //isCollablelevelExpand: boolean = false;
  selectedWBSID = null;
  selectedStoreyLevelId: any = null;
  WBSCollapseLevellist: WBSCollapseLevel[] = [];
  //isElementExpand: boolean = false;
  isStoreylevel: boolean = false;
  selectedStoreyLevelWBSId: any;
  issubElementExpand: boolean = false;
  WBSElementsList: WBSElements[] = [];
  SelectedCustomer: any;
  SelectedProjectID: any;
  selectedWBS: string = "";
  alertmessage: any = "";
  Tostorey: any;
  Fromstorey: any;

  isSubmit: boolean = false;
  backupData: any;

  searchBlock: any;
  searchStoreyfrom: any;
  searchStoreyto: any;
  searchPart: any;
  searchProducttype: any;
  searchStructure: any;

  collapse_product_code: any;
  collapse_structure: any;

  storeyfromvalidated: boolean = false;
  storeytovalidated: boolean = false;

  storeyValidated: boolean = true;
  StoreyErrorMessage: any = '';

  isAlphabet: boolean = false;
  is_new_Item: boolean = false;
  is_edit_pressed: boolean = false;
  Drain_ProductType: any;
  Drain_data:any[]=[];
  All_data:any[]=[]
  upload:boolean = true;

  constructor(public wbsService: WbsService,
    public commonService: CommonService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private drainService: DrainParameterSetService,
    private route: ActivatedRoute,
  private location:Location) {

    this.wbsForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      producttype: new FormControl('', Validators.required),

    });
  }

  ngOnInit() {
    this.commonService.changeTitle('WBS Maintenance | ODOS');
    this.GetProductType();
    this.GetStructElement();
    this.loadDrainType();
      debugger;
    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.SelectedCustomer = this.dropdown.getCustomerCode()
    });

    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        this.resetAllFilters();
        this.SelectedProjectID = this.dropdown.getDetailingProjectId();
        console.log('Changed  Project id=' + this.SelectedProjectID);
        let lCurrentPath = this.location.path();
        if (lCurrentPath.includes('WBS') || lCurrentPath.includes('wbs')) {
          if (this.SelectedProjectID !== undefined) {
            this.LoadWBSList(this.SelectedProjectID);
            this.LoadStorey();
            this.changeDetectorRef.detectChanges();
          }
        }
      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });
    this.changeDetectorRef.detectChanges();
    this.SelectedCustomer = this.dropdown.getCustomerCode()
    this.SelectedProjectID = this.dropdown.getDetailingProjectId();
    if (this.SelectedProjectID !== undefined) {
      this.LoadWBSList(this.SelectedProjectID);
    }
    this.LoadStorey();



  }


  GetWBSCollapseLevel(wbsid: any) {
    //this.isCollablelevelExpand = true;

    this.wbsService.GetWBSCollapseLevel(wbsid).subscribe({
      next: (response) => {
        //console.log(response);
        this.WBSCollapseLevellist = response;
        //Add code for expand

      },
      error: (e) => {
      },
      complete: () => {
        this.GetWBSElementList(wbsid);

      },
    });
    //console.log("collapse", this.WBSCollapseLevellist)

  }
  GetWBSElementList(wbsid: any) {

    this.wbsService.GetWBSElementsList(wbsid).subscribe({
      next: (response) => {
        //console.log(response);
        this.WBSElementsList = response;

      },
      error: (e) => {
      },
      complete: () => {
        //WBSElementsList

        //WBSElements

      },
    });
  }

  GetCustomer(): void {
    this.commonService.GetCutomerDetails().subscribe({
      next: (response) => {
        this.customerList = response;

        //console.log(this.customerList);
      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
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

  changecustomer(event: any): void {
    debugger;
    this.wbsForm.controls['project'].reset();
    this.GetProject(event);
    this.searchResult = false;

  }

  WBSCollapseLevelClicked(StoreyLevelWBSId: any) {
    this.selectedStoreyLevelWBSId = StoreyLevelWBSId;
    this.isStoreylevel = !this.isStoreylevel;
  }
  GetProject(customercode: any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response) => {
        this.projectList = response;
      },

      error: (e) => {
      },
      complete: () => {
      },

    });


  }


  Search() {
    //debugger

    //USING BACKUP BECAUSE LOADING DATA WITHOUT RESOLVER BREAKS THE CODE
    this.WbsListArray = JSON.parse(JSON.stringify(this.backupData));
    if (this.producttype_filter.length) {
      // //console.log("wbsForm.value", this.wbsForm.value);
      this.temparray = [];
      for (var i = 0; i < this.producttype_filter.length; i++) {

        let prod_type = this.producttype_filter[i];
        for (var index = 0; index < this.WbsListArray.length; index++) {


          this.WbsListArray[index].ProductType.forEach((element: any) => {
            if (element== prod_type) {
              this.temparray.push(this.WbsListArray[index])
            }
          });


        }
        // //console.log(this.WbsListArray);
      }
      this.WbsListArray = JSON.parse(JSON.stringify(this.temparray));

    }
    this.searchData();
    if (this.WbsListArray.length == 0) {
      this.toastr.error("No Data Found")
    }
  }

  onReset() {
    // this.searchResult = false;
    // this.submitted = false;
    this.producttype_filter = [];
    this.Search();
  }

  onEdit(item: any, index: any) {
    debugger
    this.isEditing = true;
    if (this.prev_index != null) {
      if (!this.is_new_Item) {
        // WHEN PRESS EDIT AFTER EDIT
        if (this.WbsListArray.length == this.backupData.length) {
          this.WbsListArray[this.prev_index] = this.backup_item
        }
      } else {
        if (this.is_edit_pressed) {
          if (this.WbsListArray.length != this.backupData.length) {
            this.WbsListArray = JSON.parse(JSON.stringify(this.backupData));
            if ((this.prev_index % this.org_itemsPerPage) < index) {
              index = index - 1
            }
          }
          // this.WbsListArray.splice(this.prev_index, 1);
          this.is_new_Item = false

          this.is_edit_pressed = false
        }
      }
      this.prev_index = null
    }

    let ind = this.WbsListArray.findIndex((x: { intWBSMTNCId: any; }) => x.intWBSMTNCId === item.intWBSMTNCId)
    let arr_product_type = []
    for (let obj of this.WbsListArray[ind].ProductType) {
      let i = this.producttypeList.findIndex((user: { ProductTypeID: number; }) => user.ProductTypeID === Number(obj));
      // //console.log("ye", this.producttypeList[i])
      arr_product_type.push(this.producttypeList[i].ProductTypeID)
    }
    // //console.log(arr_product_type)
    this.WbsListArray[ind].ProductType = arr_product_type

    let arr_structure = []
    for (let obj of this.WbsListArray[ind].Structure) {
      let i = this.structureList.findIndex((user: { StructureElementTypeId: number; }) => user.StructureElementTypeId === Number(obj));
      // //console.log("ye", this.structureList[i])
      arr_structure.push(this.structureList[i].StructureElementTypeId)
    }
    // //console.log(arr_product_type)
    this.WbsListArray[ind].Structure = arr_structure



    this.enableEditIndex = index;
    if (!this.is_new_Item) {
      this.backup_item = JSON.parse(JSON.stringify(item));
    }
    index = this.WbsListArray.findIndex((x: { intWBSMTNCId: any; }) => x.intWBSMTNCId == item.intWBSMTNCId)
    this.prev_index = index
    this.is_edit_pressed = false
  }
  ChangeStruct(event: any, item: any, CopyIndex: any) {
    this.selectedstruct = event;
  }
  ChangeProduct(event: any, item: any, CopyIndex: any) {
    this.selectedproduct = event
  }

  on_copy(item: any, index: any) {
    debugger
    this.WbsListArray = JSON.parse(JSON.stringify(this.backupData));
    this.isEditing = false;
    this.enableEditIndex = null;
    // if (this.is_new_Item) {
    //   this.WbsListArray.splice(this.prev_index + 1, 1);
    //   this.is_new_Item = false
    // }
    this.is_new_Item = true
    let copiedObject = { ...item }
    copiedObject.intWBSMTNCId = 0

    //INCREMENTING THE LAST CHAR OF BLOCK
    let lstchar = item.Block.slice(-1);
    copiedObject.Block = copiedObject.Block?.slice(0, -1);
    let tempChar: any;
    if (!this.isNumber(lstchar)) {
      tempChar = this.nextChar(lstchar.toUpperCase());
      tempChar = tempChar.toUpperCase();
    }
    else {
      tempChar = Number(lstchar) + 1;
    }
    copiedObject.Block= item.Block;
    //Commented  by Tanmay
    // copiedObject.Block = copiedObject.Block + tempChar;
    let i = this.WbsListArray.findIndex((x: { intWBSMTNCId: any; }) => x.intWBSMTNCId == item.intWBSMTNCId)
    console.log("enter")
    this.WbsListArray.splice(i + 1, 0, copiedObject);
    console.log(this.WbsListArray)
    this.org_itemsPerPage = this.itemsPerPage

    if (this.itemsPerPage == 10) {
      if (i % 10 == 9) {
        this.itemsPerPage = this.itemsPerPage + 1
        this.onEdit(copiedObject, (i % 10 + 1))
      } else {
        this.onEdit(copiedObject, (i + 1) % 10)
      }
    }
    else if (this.itemsPerPage == 5) {
      if (i % 5 == 4) {
        this.itemsPerPage = this.itemsPerPage + 1
        this.onEdit(copiedObject, (i % 5 + 1))
      } else {
        this.onEdit(copiedObject, (i + 1) % 5)
      }
    }
    else if (this.itemsPerPage == 20) {
      if (i % 20 == 19) {
        this.itemsPerPage = this.itemsPerPage + 1
        this.onEdit(copiedObject, (i % 20 + 1))
      } else {
        this.onEdit(copiedObject, (i + 1) % 20)
      }
    }
  }


  Savecopy(item: any, index: any) {
    console.log("Save Copy Called");
    //console.log(this.copieditem.value);

    let count: number = 0;
    let blockname = '';

    let newitem = Object.assign({}, item);

    newitem.block = this.copieditem.value;

    let lstchar = '';
    let tempChar: any;

    if (this.selectedproduct !== null) {
      newitem.prodttype = this.selectedproduct;
    }
    if (this.selectedstruct !== null) {

      newitem.structure = this.selectedstruct;
    }
    this.temparray.push(newitem)

    for (var k = 0; k < this.temparray.length; k++) {
      this.WbsListArray[index + k] = this.temparray[k];
    }


    this.selectedstruct = null;
    this.selectedproduct = null;

    this.CopyIndex = null;

  }
  nextChar(c: any) {
    return String.fromCharCode(((c.charCodeAt(0) + 1 - 65) % 25) + 65);
  }
  Copycancel(index: number) {
    this.selectedstruct = null;
    this.selectedproduct = null;
    this.WbsListArray.splice(index, 1);
    this.CopyIndex = null;
  }

  changeStructure(items: any, index: any) {
    //console.log("struct", this.structureList)
    //console.log("list", this.WbsListArray)
    let structure = ''
    for (let i in items) {
      let temp = this.structureList[items[i] - 1].StructureElementType
      if (structure == '') {
        structure = temp
      } else {
        structure = structure + ',' + temp
      }
      // //console.log(this.structureList[items[i]-1].StructureElementType)
    }
    // //console.log(structure)
    this.WbsListArray[index].Structure = structure
    // //console.log(this.WbsListArray[index].Structure)
    //console.log("list", this.WbsListArray)
  }

  changeProductType(items: any, index: any) {
    //console.log("pro", this.producttypeList)
    let producttype = ''
    for (let i in items) {
      let temp = this.producttypeList[items[i] - 1].ProductType
      if (producttype == '') {
        producttype = temp
      } else {
        producttype = producttype + ',' + temp
      }
    }
    this.WbsListArray[index].ProductType = producttype
  }

  Update(item: WBS, index: any) {
    debugger
    if (!this.storeyValidated) {
      this.toastr.error(this.StoreyErrorMessage);
      return;
    }

    if (this.is_new_Item) {
      console.log(item);

      const WBSobj: WBS = {
        intWBSMTNCId: 0,
        intWBSId: 1,
        Block: item.Block?.trim(),
        StoryFrom: item.StoryFrom,
        StoryTo: item.StoryTo,
        Part: item.Part?.trim(),
        ProductType: item.ProductType.toString(),
        Structure: item.Structure.toString(),
        WBSTypeId: Number(item.WBSTypeId)
      };
      this.loading = true;

      this.wbsService.SaveWBS(WBSobj, this.SelectedProjectID).subscribe({
        next: (response) => {
          if (response == 1) {
            this.is_new_Item = false;
            this.toastr.success("WBS Saved Successfully.");
            this.AddReset();
            this.isEditing = false;
            this.enableEditIndex = null;
            this.prev_index = null;
            this.LoadWBSList(this.SelectedProjectID);
          }
          else if (response == 2) {
            this.toastr.warning("WBS Allready Exists.");
          }
          else if (response == 3) {
            this.toastr.warning("Product Type & Structure Element Combination Could Not Save.");
          }
        },
        error: (e) => {

          this.toastr.error('Can not add blank record.');
          this.loading = false;

        },
        complete: () => {
          this.loading = false;

          // this.LoadWBSList(this.SelectedProjectID);
        },
      });

      if ((index == 10 || index == 5 || index == 20) && (index + 1) == this.itemsPerPage) {
        this.itemsPerPage = this.itemsPerPage - 1;
      }
    }
    else {
      if (item.Block == '' ||
        item.ProductType == '' ||
        item.Structure == '' ||
        item.StoryFrom == undefined ||
        item.StoryTo == undefined) {
        this.toastr.error('Can not add blank record.')
      }
      else {

        const WBSobj: WBS = {
          intWBSMTNCId: item.intWBSMTNCId,
          intWBSId: item.intWBSId,
          Block: item.Block?.trim(),
          StoryFrom: item.StoryFrom,
          StoryTo: item.StoryTo,
          Part: item.Part?.trim(),
          ProductType: item.ProductType.toString(),
          Structure: item.Structure.toString(),
          WBSTypeId: Number(item.WBSTypeId)
        };
        this.loading = true;

        this.wbsService.updatewbslist(WBSobj).subscribe({
          next: (response) => {
            if (response == 1) {
              this.toastr.success("WBS updated Successfully.");
              this.AddReset();
              this.isEditing = false;
              this.enableEditIndex = null;
              this.prev_index = null;
              this.LoadWBSList(this.SelectedProjectID);
            }
            else if (response == 3) {
              this.toastr.error("SOR is Generated ,Cannot update record");
            }
          },
          error: (e) => {

            this.toastr.error(e.error)
            this.loading = false;

          },
          complete: () => {
            this.loading = false;

            //we have to call this here if needed
          },
        });
      }
    }



  }

  Editcancel(item: any) {
    debugger;
    this.isEditing = false;
    this.enableEditIndex = null;
    this.prev_index = null;

    if (this.is_new_Item) {
      let index = this.WbsListArray.findIndex((x: { intWBSMTNCId: any; }) => x.intWBSMTNCId == item.intWBSMTNCId)
      this.WbsListArray.splice(index, 1);
      this.is_new_Item = false
      if (this.org_itemsPerPage != this.itemsPerPage) {
        this.itemsPerPage = this.itemsPerPage - 1
      }
    } else {
      this.WbsListArray[this.prev_index] = JSON.parse(JSON.stringify(this.backup_item));
    }
    this.prev_index = null
    this.isEditing = false;
    this.enableEditIndex = null;


  }
  AddReset() {
    this.isSubmit = false
    this.newwbs = [{
      Block: '', StoryFrom: undefined, StoryTo: undefined, Part: '', ProductType: '', Structure: '',
      WBSTypeId: 0
    }];
  }
  AddNew() {
    debugger;
    this.loading = true;

    if (!this.storeyValidated) {
      this.toastr.error(this.StoreyErrorMessage);
      this.loading = false;
      return;
    }
    if ( this.newwbs[0].Block != '' &&
      this.newwbs[0].StoryFrom != '' &&
      this.newwbs[0].StoryTo != '' &&
      this.newwbs[0].ProductType != '' &&
      this.newwbs[0].Structure != '') {
      const WBSobj: WBS = {
        intWBSMTNCId: 0,
        intWBSId: 1,
        Block: this.newwbs[0].Block?.trim().toUpperCase(),
        StoryFrom: this.newwbs[0].StoryFrom,
        StoryTo: this.newwbs[0].StoryTo,
        Part: this.newwbs[0].Part?.trim(),
        ProductType: this.newwbs[0].ProductType.toString(),
        Structure: this.newwbs[0].Structure.toString(),
        WBSTypeId: Number(this.WBSType)
      };
      //console.log(WBSobj);


this.ADDWBS_Service(WBSobj);




      // for (var i = 0; i < this.newwbs[0].prodttype.length; i++) {
      //   for (var j = 0; j < this.newwbs[0].structure.length; j++) {
      //     count = count + 1;
      //     if (count == 1) {
      //       this.newwbs[0].block = this.newwbs[0].block;
      //     }
      //     else {

      //       let lstchar:any = '';
      //       let tempChar: any;

      //       if (count == 2) {
      //         blockname = this.newwbs[0].block?.toString();
      //         lstchar = this.newwbs[0].block?.slice(-1);
      //         if (!this.isNumber(lstchar)) {
      //           tempChar = this.nextChar(lstchar);
      //         }
      //         else {
      //           tempChar = Number(lstchar) + 1;
      //         }
      //       } else {
      //         lstchar = blockname.slice(-1);
      //         // tempChar = this.nextChar(lstchar);
      //         if (!this.isNumber(lstchar)) {
      //           tempChar = this.nextChar(lstchar);
      //         }
      //         else {
      //           tempChar = Number(lstchar) + 1;
      //         }
      //       }

      //       blockname = blockname.slice(0, -1)
      //       blockname = blockname + tempChar;

      //       //console.log(blockname);
      //       this.newwbs[0].block = blockname;
      //     }



      // let newitem = { block: this.newwbs[0].block, storeyfrom: this.newwbs[0].storeyfrom, storeyto: this.newwbs[0].storeyto, part: this.newwbs[0].part, prodttype: '', structure: '' };
      // newitem.prodttype = this.newwbs[0].prodttype;
      // newitem.structure = this.newwbs[0].structure;
      // //console.log(newitem)
      // this.WbsListArray.push(newitem);
      // }
      // }
      //  this.newwbs = [{ block: '', storeyfrom: '', storeyto: '', part: '', prodttype: '', structure: '' }];




    }
    else {
      this.toastr.error('Can not add blank record.');
      this.loading = false;
    }
  }

  isNumber(char: any) {
    return /^\d+$/.test(char);
  }
  searchData() {
    //debugger

    // this.LoadWBSList(this.SelectedProjectID)
    //USING BACKUP BECAUSE LOADING DATA WITHOUT RESOLVER BREAKS THE CODE
    // this.WbsListArray = JSON.parse(JSON.stringify(this.backupData));


    // searchText = searchText.value.toLowerCase();
    if (this.searchText != "" && this.searchText != undefined) {
      this.filteredPost = this.WbsListArray.filter((x: { Block: string; StoryFrom: { toString: () => string | any[]; }; StoryTo: { toString: () => string | any[]; }; Part: string; ProductTypeName: string; StructureTypeName: string; }) =>
        x.Block.toLowerCase().includes(this.searchBlock.toLowerCase()) ||
        x.Block.toLowerCase().includes(this.searchBlock.toLowerCase()) ||
        x.StoryFrom.toString().includes(this.searchStoreyfrom.toLowerCase()) ||
        x.StoryTo.toString().includes(this.searchStoreyto.toLowerCase()) ||
        x.Part.toLowerCase().includes(this.searchPart.toLowerCase()) ||
        x.ProductTypeName.toLowerCase().includes(this.searchProducttype.toLowerCase()) ||
        x.StructureTypeName.toLowerCase().includes(this.searchStructure.toLowerCase()))
      this.WbsListArray = this.filteredPost;
    }

    if (this.searchBlock != "" && this.searchBlock != undefined) {
      this.filteredPost = this.WbsListArray.filter((x: { Block: string; }) => x.Block.toLowerCase().includes(this.searchBlock.toLowerCase()))
      this.WbsListArray = this.filteredPost;
    }
    if (this.searchStoreyfrom != "" && this.searchStoreyfrom != undefined) {
      this.filteredPost = this.WbsListArray.filter((x: { StoryFrom: string; }) => x.StoryFrom.toString().toLowerCase().includes(this.searchStoreyfrom.toLowerCase()))
      this.WbsListArray = this.filteredPost;
    }
    if (this.searchStoreyto != "" && this.searchStoreyto != undefined) {
      this.filteredPost = this.WbsListArray.filter((x: { StoryTo: string; }) => x.StoryTo.toString().toLowerCase().includes(this.searchStoreyto.toLowerCase()))
      this.WbsListArray = this.filteredPost;
    }
    if (this.searchPart != "" && this.searchPart != undefined) {
      this.filteredPost = this.WbsListArray.filter((x: { Part: string; }) => x.Part.toLowerCase().includes(this.searchPart.toLowerCase()))
      this.WbsListArray = this.filteredPost;
    }
    if (this.searchProducttype != "" && this.searchProducttype != undefined) {
      this.filteredPost = this.WbsListArray.filter((x: { ProductTypeName: string; }) => x.ProductTypeName.toLowerCase().includes(this.searchProducttype.toLowerCase()))
      this.WbsListArray = this.filteredPost;
    }
    if (this.searchStructure != "" && this.searchStructure != undefined) {
      this.filteredPost = this.WbsListArray.filter((x: { StructureTypeName: string; }) => x.StructureTypeName.toLowerCase().includes(this.searchStructure.toLowerCase()))
      this.WbsListArray = this.filteredPost;
    }
  }

  deleteCollapseLevel(item: any, row2item: any) {

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    const modalRef = this.modalService.open(ConfirmDialogComponent, ngbModalOptions);
    modalRef.componentInstance.innertable = false;


    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {


        this.wbsService.DeleteCollapseLevel(row2item.StoreyLevelWBSId).subscribe({
          next: (response) => {

            if(response.WBSAtCollapseLevel==1)
            {
              this.toastr.success("WBS storey deleted successfully.");

            }
            else if(response.WBSAtCollapseLevel==2)
            {
              this.toastr.error("WBS storey can not be deleted,because SOR is generated ");

            }          },
          error: (e) => {
            this.toastr.error(e.error)
          },
          complete: () => {
            this.LoadWBSList(this.SelectedProjectID);
            this.GetWBSElementList(item.WBSMTNID);
            //we have to call this here if needed
          },
        });


      }

    });




  }

  delete(index: any, storeylength: any, item: WBS) {

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }
    const modalRef = this.modalService.open(ConfirmDialogComponent, ngbModalOptions);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.formname = ''
    modalRef.componentInstance.groupmarkexist = storeylength == null ? 0 : storeylength;
    modalRef.componentInstance.innertable = false;

    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {
        //console.log(modalResult.isConfirm);
        this.WbsListArray.slice(index, 1);
        //console.log(this.WbsListArray);
        this.changeDetectorRef.detectChanges();

        this.wbsService.DeleteWbs(item.intWBSMTNCId).subscribe({
          next: (response) => {
            this.selectedWBS = response;
            if(response.WBSMaintainence==1)
            {
              this.toastr.success("WBS deleted Successfully.");

            }
            else if(response.WBSMaintainence==2)
            {
              this.toastr.error("WBS can not be deleted because SOR is generated ");

            }

          },
          error: (e) => {
            this.toastr.error(e.error)
          },
          complete: () => {
            this.LoadWBSList(this.SelectedProjectID);
          },
        });
        //this.WbsListArray[index].delete();
      }
    });


  }

  deletestorey(mainitem: any, item: any) {
    debugger;
    console.log(item.WBS2 + " to " + mainitem.StoryTo)
    let str = item.WBS2 + " to " + mainitem.StoryTo
    if (item.WBS2 == mainitem.StoryTo) {
      str = item.WBS2
    }

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    }


    let IsSet = null;
    const modalRef = this.modalService.open(ConfirmDialogComponent, ngbModalOptions);
    modalRef.componentInstance.innertable = true;
    modalRef.componentInstance.stroreynumber = str

    modalRef.result.then(modalResult => {
      if (modalResult.isConfirm) {

        IsSet = modalResult.isSet;

        const StoreyOj: WBSElements = {
          ElementId: item.ElementId,
          StoreyLevelWBSId: item.StoreyLevelWBSId,
          WBSId: item.WBSId,
          WBS1: item.WBS1,
          WBS2: item.WBS2,
          WBS3: item.WBS3,
          WBS4: item.WBS4,
          WBS5: item.WBS5,
          StatusId: item.StatusId,
          WBSMTNID: item.WBSMTNID
        };

        this.wbsService.DeleteSelectedStorey(StoreyOj, IsSet).subscribe({
          next: (response) => {
            if(response==1)
            {
              this.toastr.success("WBS storey deleted successfully.");

            }
            else if(response==2)
            {
              this.toastr.error("WBS storey can not be deleted,because SOR is generated ");

            }
          },
          error: (e) => {
            this.toastr.error(e.error)
          },
          complete: () => {
            //this.GetWBSElementList(item.WBSMTNID);
            this.LoadWBSList(this.SelectedProjectID); //we have to call this here if needed
          },
        });


      }

    });




  }


  StoreyValidate(storeyFrom: any, storeyTo: any) {
    debugger;
    if (storeyFrom != null && storeyTo != null) {

      if(storeyFrom.includes("M"))
      {
        if(storeyFrom!=storeyTo)
        {
          this.toastr.error("StoreyTo and StoreyFrom should be same");
          this.storeyValidated = false;

        }
        else{
          this.storeyValidated = true;

        }
        return ;
      }

      if ((/[a-zA-Z]/g.test(storeyFrom))) {
        if ((/[a-zA-Z]/g.test(storeyTo))) {
          if (storeyFrom === storeyTo) {
            //PASS
            this.storeyValidated = true;
          } else if (this.isNumber(storeyFrom[0]) &&  this.isNumber(storeyTo[0])) {
            //FAIL
            // this.storeyValidated = false;
            // this.StoreyErrorMessage = "StoreyTo and StoreyFrom should be same"
            // this.toastr.error("StoreyTo and StoreyFrom should be same");
            let strFrom = storeyFrom;

            let strTo = storeyTo;

            if (Number(strFrom[0]) > Number(strTo[0])) {
              this.storeyValidated = false;
              this.toastr.error("StoreyFrom should be less than StoreyTo");

            }
            else {
              this.storeyValidated = true;
            }


          }
          else {
            this.storeyValidated = false;
            this.StoreyErrorMessage = "StoreyTo and StoreyFrom should be same"
            this.toastr.error("StoreyTo and StoreyFrom should be same");
          }
        } else {
          //FAIL
          this.storeyValidated = false;
          this.StoreyErrorMessage = "StoreyTo and StoreyFrom should be same"
          this.toastr.error("StoreyTo and StoreyFrom should be same");
        }
      }
      else {
        if ((/[a-zA-Z]/g.test(storeyTo))) {
          //FAIL
          this.storeyValidated = false;
          if (!(/[a-zA-Z]/g.test(storeyFrom))) {
            this.toastr.error("StoreyTo Should be numberic");
          } else {

            this.StoreyErrorMessage = "StoreyTo and StoreyFrom should be same"
            this.toastr.error("StoreyTo and StoreyFrom should be same");
          }
        }
        else {

          if (Number(storeyFrom) > Number(storeyTo)) {
            //FAIL
            this.storeyValidated = false;
            this.StoreyErrorMessage = "StoreyFrom should be less than StoreyTo"
            this.toastr.error("StoreyFrom should be less than StoreyTo");
          } else {
            //PASS
            this.storeyValidated = true;
          }
        }
      }
    }
    else {
      if (storeyFrom != null && storeyTo == null) {
        this.StoreyErrorMessage = "StoreyTo should not be empty"
        //this.toastr.error(this.StoreyErrorMessage)
      } else if (storeyFrom == null && storeyTo != null) {
        this.StoreyErrorMessage = "StoreyFrom should not be empty"
        this.toastr.error(this.StoreyErrorMessage)
      } else {
        this.StoreyErrorMessage = "StoreyTo, StoreyFrom should not be empty"
        this.toastr.error(this.StoreyErrorMessage)
      }
      this.storeyValidated = false;
    }


  }

  // ValidateStorey(e: any) {
  //   this.isAlphabet = false;
  //   this.Tostorey = e;
  //   this.storeytovalidated = false;
  //   if (this.Fromstorey == "" || this.Fromstorey == undefined) {
  //     this.toastr.error("Please select storeyfrom before storeyto");
  //     return;
  //   }
  //   if (this.Tostorey > 70) {
  //     this.toastr.error("StoreyTo must be smaller than or equal to 70.");
  //     return;
  //   }

  //   if ((/[a-zA-Z]/g.test(this.Fromstorey) && /[a-zA-Z]/g.test(this.Tostorey)) || (/[0-9]/g.test(this.Fromstorey) && /[0-9]/g.test(this.Tostorey))) {

  //   }
  //   else {
  //     this.toastr.error("Please select appropriate Storeyfrom and Storeyto from dropdown");
  //     return;
  //   }

  //   if (/[a-zA-Z]/g.test(this.Tostorey)) {
  //     if (this.Fromstorey != this.Tostorey) {
  //       this.toastr.error("StoreyFrom and StoreyTo value must be same");
  //       return;
  //     }
  //   }
  //   else if (this.Fromstorey > this.Tostorey) {
  //     this.toastr.error("StoreyFrom should not be greater than StoreyTo");
  //     return;
  //   }
  //   this.storeytovalidated = true;
  // }

  // //fromstorey: any
  // FromStorey(e: any) {
  //   this.Fromstorey = e;
  //   this.storeyfromvalidated = false;
  //   if (this.Tostorey != "" && this.Tostorey != undefined) {
  //     if (/[a-zA-Z]/g.test(this.Tostorey)) {
  //       if (this.Fromstorey != this.Tostorey) {
  //         this.toastr.error("StoreyFrom and StoreyTo value must be same");
  //         return;
  //       }
  //     }
  //     else if (!(/[a-zA-Z]/g.test(this.Fromstorey))) {
  //       if (this.Fromstorey > this.Tostorey) {
  //         this.toastr.error("StoreyFrom should not be greater than StoreyTo");
  //         return;
  //       }
  //     }
  //     else {
  //       this.toastr.error("Please select appropriate value.");
  //       return;
  //     }


  //   }
  //   this.storeyfromvalidated = true;
  // }

  getPageData() {

    //console.log(this.pageSize)

    this.WbsListArray = this.WbsListArray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }

  // changeproject(event: any) {
  //   debugger;
  //   this.searchResult = true;
  //   this.LoadWBSList(event);
  //   this.LoadStorey();

  // }

  LoadStorey(): void {

    this.wbsService.GetWbsStorey().subscribe({
      next: (response) => {
        this.storeyFromList = response;
        this.storeyToList = response;


      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }

  LoadWBSList(ProjectId: any) {
    debugger
    this.searchResult=true;
    let temparray = [];
    this.loading = true;


    this.wbsService.GetWbsMaintainanceList(ProjectId).subscribe({
      next: (response) => {
        console.log(response);
        temparray = [];
        temparray = response;
        console.log(temparray);
        console.log("length", temparray.length)
        var ProductTypes;
        var structure;
        let strobject = '';
        response.forEach((element: any) => {
          if(element.ProductType==null)
          {
            console.log(element);
          }
        });
        // ProductTypeName  StructureTypeName
        for (var i = 0; i < temparray.length; i++) {

          if (temparray[i].ProductType.length > 1 && temparray[i].ProductType.indexOf(',') != -1) {
            strobject = '';
            ProductTypes = temparray[i].ProductType.split(',');
            //Product Type
            if (ProductTypes != undefined && ProductTypes.length > 0) {
              //debugger;
              for (let obj of ProductTypes) {
                //debugger;

                let item1 = this.producttypeList.find((x: { ProductTypeID: any }) =>

                  x.ProductTypeID === Number(obj)

                );
                strobject = strobject + ',' + item1['ProductType'];
                //console.log('strobj', strobject)
                //console.log(item1)
                temparray[i].ProductTypeName = strobject.slice(1);
                //console.log('1', temparray[i].ProductType)
              }

            }
            temparray[i].ProductType = temparray[i].ProductType.split(',');
            //console.log('2', temparray[i].ProductType)
          }
          else {
            //debugger;
            ///Product Type
            temparray[i].ProductType = [temparray[i].ProductType];
            if (temparray[i].ProductType.length == 1) {
              let currentprotye = temparray[i].ProductType;
              let item1 = this.producttypeList.find((x: { ProductTypeID: any }) =>
                x.ProductTypeID === Number(currentprotye));
              //console.log(item1)
              try{

                temparray[i].ProductTypeName = item1['ProductType'];
              }
              catch{
                console.log(`Tanny ${i} ,${item1}`);
              }
            }
          }

          //structure
          if (temparray[i].Structure.length > 1 && temparray[i].Structure.indexOf(',') != -1) {
            strobject = '';
            structure = temparray[i].Structure.split(',');

            if (structure != undefined && structure.length > 0) {
              //debugger;
              for (let obj of structure) {
                let item1 = this.structureList.find((x: { StructureElementTypeId: any }) =>
                  x.StructureElementTypeId === Number(obj));
                strobject = strobject + ',' + item1['StructureElementType'];
                //console.log(item1)
                temparray[i].StructureTypeName = strobject.slice(1);
              }

            }
            temparray[i].Structure = temparray[i].Structure.split(',');

          }
          else {
            //debugger;
            //  Structure type
            temparray[i].Structure = [temparray[i].Structure]
            if(!temparray[i].Structure)
            {
              console.log(temparray[i]);
            }
            if (temparray[i].Structure.length == 1) {
              let currentstruct = temparray[i].Structure;
              let item2 = this.structureList.find((x: { StructureElementTypeId: any }) =>
                x.StructureElementTypeId === Number(currentstruct));
              //console.log(item2)
              temparray[i].StructureTypeName = item2['StructureElementType'];

              //console.log(temparray)
            }

          }

        }


        this.WbsListArray = temparray;
        this.ArrayLength = this.WbsListArray.length;
        ////console.log(response);
        //console.log(this.producttypeList);
        //console.log(this.structureList);

        //  this.WbsListArray = response;
        // Push Newly added record to WBSlist after word.
        //  this.toastr.success("WBS Saved Successfully.");
        if (this.WbsListArray.length == undefined) {
          setTimeout(() => {
            // Your code here
            console.log("continue")
          }, 2000);
        }
        for (let index in this.WbsListArray) {
          let arr_product_type = []

          for (let obj of this.WbsListArray[index].ProductType) {
            let i = this.producttypeList.findIndex((user: { ProductTypeID: number; }) => user.ProductTypeID === Number(obj));
            // //console.log("ye", this.producttypeList[i])
            arr_product_type.push(this.producttypeList[i].ProductTypeID)
          }
          // //console.log(arr_product_type)
          this.WbsListArray[index].ProductType = arr_product_type

          let arr_structure = []
          for (let obj of this.WbsListArray[index].Structure) {
            let i = this.structureList.findIndex((user: { StructureElementTypeId: number; }) => user.StructureElementTypeId === Number(obj));
            // //console.log("ye", this.structureList[i])
            arr_structure.push(this.structureList[i].StructureElementTypeId)
          }
          // //console.log(arr_product_type)
          this.WbsListArray[index].Structure = arr_structure
        }

      },
      error: (e) => {
        this.toastr.error(e.error);
        this.loading = false;

      },
      complete: () => {

        this.loading = false;

        this.Drain_data= [];
        this.All_data = [];
        this.WbsListArray.forEach((element: WBS) => {
          if(element.WBSTypeId===5)
          {
            this.Drain_data.push(element);
          }
          else{
            this.All_data.push(element);

          }

        });
        this.ChangeWBSType()
      },
    });



  }


  checkUncheckAll() {
    for (var i = 0; i < this.WbsListArray.length; i++) {
      this.WbsListArray[i].isSelected = this.masterSelected;
    }
    //this.GetselectedWBS();
  }



  isAllSelected(e: any, item: any) {
    //WbsId: any = [];
    // if(e.target.checked)
    // {
    //    //console.log(item.intWBSMTNCId);
    //    this.WbsId=this.WbsId+ item.intWBSMTNCId +',';
    //    //console.log(this.WbsId);
    // }
    // else
    // {
    //   this.WbsId=this.WbsId.replace(item.intWBSMTNCId +',','');
    //   //console.log(this.WbsId);
    // }

    this.GetselectedWBS();

  }

  GetselectedWBS() {
    this.selectedWBS = "";
    var inputElements = document.getElementsByTagName("input");
    for (var i = 0; i < inputElements.length; i++) {
      if (inputElements[i].type === "checkbox" && inputElements[i].checked === true) {
        if (inputElements[i].value != "on") {
          this.selectedWBS += inputElements[i].value.trim() + ",";
        }
      }

    }
    if (this.selectedWBS.length == 0) {
      alert("You haven't selected any WBS.");
      return;
    }
    if (this.selectedWBS != "") {
      this.selectedWBS = this.selectedWBS.substring(0, this.selectedWBS.length - 1);
    }
    //console.log(this.selectedWBS);
  }

  DeleteSelected() {

    //console.log(this.masterSelected);
    let storeylength = 0;
    let wbsname = "";
    //this.masterSelected = false;
    let checkselectedcount = 0

    this.GetselectedWBS();
    //deletstring=detelestring.tostring()
    if (this.selectedWBS.length == 0) {
      alert("You haven't selected any WBS.");
      return;
    }
    else {

      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
      }
      if (wbsname != "") {
        storeylength = 1;
      }
      const modalRef = this.modalService.open(ConfirmDialogComponent, ngbModalOptions);
      modalRef.componentInstance.name = 'World';
      modalRef.componentInstance.formname = wbsname.slice(1);
      modalRef.componentInstance.groupmarkexist = storeylength == null ? 0 : storeylength;
      modalRef.componentInstance.innertable = false;

      modalRef.result.then(modalResult => {
        if (modalResult.isConfirm) {
          this.wbsService.DeleteSelectedWbs(this.selectedWBS).subscribe({
            next: (response) => {
              this.WbsListArray = response;
              // Push Newly added record to WBSlist after word.
              //  this.toastr.success("WBS Saved Successfully.");
              //   this.AddReset();

            },
            error: (e) => {
              this.toastr.error(e.error)
            },
            complete: () => {
              this.LoadWBSList(this.SelectedProjectID);
            },
          });
          //console.log(modalResult.isConfirm);

          this.changeDetectorRef.detectChanges();
        }
      });

    }

  }
  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.enableEditIndex = null;
    if (this.prev_index != null) {
      //console.log("hello")
      this.WbsListArray[this.prev_index] = this.backup_item
      this.isformsubmit = false
      this.prev_index = null
    }
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    this.enableEditIndex = null;
    if (this.prev_index != null) {
      this.WbsListArray[this.prev_index] = this.backup_item
      this.isformsubmit = false
      this.prev_index = null
    }

  }

  getCollapse_product_code(item: any) {
    this.collapse_product_code = this.producttypeList.find((x: { ProductTypeID: number; }) => x.ProductTypeID === Number(item)).ProductType
  }
  getCollapse_structure(item: any) {
    this.collapse_structure = this.structureList.find((x: { StructureElementTypeId: number; }) => x.StructureElementTypeId === Number(item)).StructureElementType
  }

  onSelectClick() {
    // Focus the hidden input to capture the Enter key press
    this.hiddenInputRef?.nativeElement.focus();
  }

  ReturnUpper(val: any) {
    return val.toUpperCase();
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

  ChangeWBSType()
  {
    console.log("this.WBSType",this.WBSType);
    if(this.WBSType==5)
    {
      this.newwbs[0].ProductType=[7,]
      this.newwbs[0].Structure= [5,]
      this.WbsListArray=JSON.parse(JSON.stringify(this.Drain_data));
    }
    else{
      this.newwbs[0].ProductType=[]
      this.newwbs[0].Structure= []
      this.WbsListArray=JSON.parse(JSON.stringify(this.All_data));
    }
    this.backupData = JSON.parse(JSON.stringify(this.WbsListArray));
    this.Search();

  }

  loadDrainType() {
    this.drainService.GetDrainProductType().subscribe({
      next: (response) => {
        this.Drain_ProductType = response;
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }
  resetAllFilters(){
    this.searchBlock = null;
    this.searchStoreyfrom = null;
    this.searchStoreyto = null;
    this.searchPart = null;
    this.searchProducttype = null;
    this.searchStructure = null;
  }
  onSelectedTab(no:number,event:any){
    if(no == 1 && (event !=undefined || event !='')) {
      const parentElement:any = document.getElementById('wbsChild1');
      parentElement?.focus();
      this.changeDetectorRef.detectChanges();
      console.log("evt=>",parentElement);
    }
    if(no == 3 && (event !=undefined || event !='')) {
      const parentElement = document.getElementById('wbsChild3');
      parentElement?.focus();
      console.log("evt=>",parentElement);
    }
    if(no == 2 && (event !=undefined || event !='')) {
      const parentElement = document.getElementById('wbsChild2');
      parentElement?.focus();
      console.log("evt=>",parentElement);
    }
  }
//   onKeyDown(event: KeyboardEvent) {
//     if (event.key === 'Tab') {
//         // Allow the default tab behavior to move to the next input
//         return;
//     }
//     // Handle other key events if needed
// }

onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
      event.preventDefault();
      const activeOption = document.querySelector('ng-select.ng-option-marked') as HTMLElement;
      if (activeOption) {
          activeOption.click();
      }
  } else if (event.key === 'Tab') {
      // Allow the default tab behavior to move to the next input
      return;
  }
}

focusNextSelect
(nextSelect: NgSelectComponent) {
setTimeout
(
() =>
nextSelect.
focus
(), 0);
// Use setTimeout to ensure focus is set after the current event loop
}
// download(): void {



//   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.shapesurchargeList);

//   const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

//   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

//   this.saveAsExcelFile(excelBuffer, 'export');

// }




// private saveAsExcelFile(buffer: any, fileName: string): void {

//   const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });

//   const url = window.URL.createObjectURL(data);

//   const link = document.createElement('a');

//   link.href = url;

//   link.download = "shapesurcharge.xlsx";

//   link.click();

// }
storeyOptions: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

downloadTemplate() {
  const exportData = [
    {
      Block: '',
      'Storey From': '',
      'Storey To': '',
      Part: '',
      'Product Type': '',
      Structure: '',
    },
    // Add more rows if you want to pre-fill more rows in the template
  ];

  // Create a new workbook
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: ['Block', 'Storey From', 'Storey To', 'Part', 'Product Type', 'Structure'] });

  // Create a workbook and add data validation for Storey columns
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  // Add data validation to 'Storey From' and 'Storey To' columns
  const storeyValidation = {
    type: 'list',
    formula1: `"${this.storeyOptions.join(',')}"`,
    showDropDown: true,
  };

  // Set the validation for 'Storey From' and 'Storey To' columns (e.g., column 2 and column 3 in Excel)
  ws['!dataValidation'] = [
    {
      ref: 'B2:B1000',  // Apply to Storey From column (B)
      type: storeyValidation.type,
      formula1: storeyValidation.formula1,
      showDropDown: storeyValidation.showDropDown,
    },
    {
      ref: 'C2:C1000',  // Apply to Storey To column (C)
      type: storeyValidation.type,
      formula1: storeyValidation.formula1,
      showDropDown: storeyValidation.showDropDown,
    },
  ];

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Block Storey Template');

  // Write the file to download
  XLSX.writeFile(wb, 'block-storey-template.xlsx');
}

data: any = [];

columns: { [key: string]: any[] } = {};  // To store columns as arrays

openFileSelector() {
  this.isFileSelectorOpen = false;
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
  fileInput.click();
}
// Event handler for file input change
onFileChange(evt: any) {
  const target: DataTransfer = <DataTransfer>(evt.target);
  this.isFileSelectorOpen = true;
  // Ensure the user uploaded a file
  if (target.files.length !== 1) {
    throw new Error('Cannot use multiple files');
  }
  const input = evt.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFileName = input.files[0].name;
    const reader: FileReader = new FileReader();

    // Read the file as binary string
    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;

      // Parse the workbook
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

      // Get the first sheet
      const sheetName: string = workbook.SheetNames[0];
      const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON format with the first row as headers
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Transform rows into columns, using the first row as headers

      this.columns = this.transformToColumns(jsonData);

      console.log(this.columns);  // Now the columns object has column headers as keys and data as arrays

    };

    reader.readAsBinaryString(target.files[0]);
  } else {
    this.selectedFileName = null; // No file selected
  }
}
// Clears the selected file
clearFile(): void {
  this.selectedFileName = null;
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
  fileInput.value = ''; // Reset the file input value
}

// Transform rows to columns using the first row as headers
transformToColumns(rows: any[][]): { [key: string]: any[] } {
  const columns: { [key: string]: any[] } = {};

  // Ensure there are rows and the first row has headers
  if (rows.length === 0) return columns;

  const headers = rows[0]; // First row as column headers

  // Initialize columns based on headers, replacing spaces with underscores
  headers.forEach((header: string, index: number) => {
    const sanitizedHeader = header.replace(/\s+/g, '_');  // Replace spaces with underscores
    columns[sanitizedHeader] = [];
  });

  // Fill the columns with data (starting from the second row)
  for (let i = 1; i < rows.length; i++) {
    headers.forEach((header: string, index: number) => {
      const sanitizedHeader = header.replace(/\s+/g, '_');
      columns[sanitizedHeader].push(rows[i][index]);
    });
  }

  return columns;
}
submitThroughExcel()
{
 let BlockArray =this.columns.Block;

let PartArray =  this.columns.Part;

let ProductTypeArray   = this.columns.Product_Type;

if(BlockArray.length==0 || BlockArray.toString()=='')
{
  this.toastr.warning(`Please fill record properly `);
  return ;
}
let ProcuctArraNew:any=[];
let StructureArrayNew:any=[];


if(ProductTypeArray.length > 0){
  ProductTypeArray.forEach(element => {
    let prodArr = element.split(',');
    let str = ""
    prodArr.forEach((elementd: any,Index:number) => {

      let proid = this.producttypeList.find((item:any)=>item.ProductType.toString().toLowerCase()==elementd.trim().toLowerCase());
      if(!proid)
      {
        this.toastr.warning(`Product type ${elementd} does not Exists for record ${Index+1},please enter correct Product type`);
      }
      str+=proid.ProductTypeID.toString() + ','
    });
    str = str.replace(/,\s*$/, '');
    ProcuctArraNew.push(str);
  });
}

let StoreyFromArray  = this.columns.Storey_From;

let StoreyToArray  = this.columns.Storey_To;

let StructureArray  = this.columns.Structure;


StructureArray.forEach(element => {

  let StructArr = element.split(',');
  let str = ""
  StructArr.forEach((elementd: any,Index:number) => {

    let strid = this.structureList.find((item:any)=>item.StructureElementType.toString().toLowerCase()==elementd.trim().toLowerCase());
    if(!strid)
      {
        this.toastr.warning(`Structure Element ${elementd} does not Exists for record ${Index+1},please enter correct Structure Element`);
      }
    str+=strid.StructureElementTypeId.toString() + ','
  });
  str = str.replace(/,\s*$/, '');
  StructureArrayNew.push(str);

});

for(let i=0;i<BlockArray.length;i++)
{
  let storyFrom  = this.storeyFromList.findIndex((element:any)=>element.StoreyName.toUpperCase()===StoreyFromArray[i].toString().toUpperCase())
  let storyTo  = this.storeyFromList.findIndex((element:any)=>element.StoreyName.toUpperCase()===StoreyToArray[i].toString().toUpperCase())

  if(storyFrom==-1 || storyTo==-1)
  {
    this.toastr.warning(`storey does not Exists for record ${i+1}`);
    continue;
  }

  const WBSobj: WBS = {
    intWBSMTNCId: 0,
    intWBSId: 1,
    Block: BlockArray[i].trim().toUpperCase(),
    StoryFrom: StoreyFromArray[i].toString().toUpperCase(),
    StoryTo: StoreyToArray[i].toString().toUpperCase(),
    Part: PartArray[i].toString().trim().toUpperCase(),
    ProductType: ProcuctArraNew[i].toString(),
    Structure: StructureArrayNew[i].toString(),
    WBSTypeId: Number(this.WBSType)
  };
  this.storeyValidated =true;
  this.StoreyValidate(StoreyFromArray[i].toString(),StoreyToArray[i].toString())
  if(this.storeyValidated)
  {
    this.wbsService.SaveWBS(WBSobj, this.SelectedProjectID).subscribe({
      next: (response) => {
        if (response == 1) {
          this.toastr.success(`WBS Saved Successfully for record ${i+1}`);
          this.AddReset();
        }
        else if (response == 2) {
          this.toastr.warning(`WBS Allready Exists for record ${i+1}`);
        }
        else if (response == 3) {
          this.toastr.warning(`Product Type & Structure Element Combination Could Not Save for record ${i+1}`);
        }

      },
      error: (e) => {
        console.log(e);
        this.loading = false;

      },
      complete: () => {
        debugger;
        this.loading = false;

        this.LoadWBSList(this.SelectedProjectID);
        this.clearFile();
      },
    });

  }
  else{
    this.toastr.warning(`Please edit record number ${i+1}`)
  }
}

}
ADDWBS_Service(WBSobj:any)
{
  this.wbsService.SaveWBS(WBSobj, this.SelectedProjectID).subscribe({
    next: (response) => {
      if (response == 1) {
        this.toastr.success("WBS Saved Successfully.");
        this.AddReset();
      }
      else if (response == 2) {
        this.toastr.warning("WBS Allready Exists.");
      }
      else if (response == 3) {
        this.toastr.warning("Product Type & Structure Element Combination Could Not Save.");
      }

    },
    error: (e) => {
      console.log(e);
      this.loading = false;

    },
    complete: () => {
      debugger;
      this.loading = false;

      this.LoadWBSList(this.SelectedProjectID);
    },
  });
}
blockComma(event: KeyboardEvent) {
  if (event.key === ',') {
    event.preventDefault();
  }
}

}


