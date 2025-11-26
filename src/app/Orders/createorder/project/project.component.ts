import { ChangeDetectorRef, Component, Input, ViewChild  } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbCarouselConfig,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { CreateWbsComponent } from 'src/app/wbs/create-wbs/create-wbs.component';
import {
  AUTO_STYLE,
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { OrderService } from '../../orders.service';
import { ScheduledData } from 'src/app/Model/scheduledData';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { CreateordersharedserviceService } from '../createorderSharedservice/createordersharedservice.service';
import { ToastrService } from 'ngx-toastr';
import { AddToCart } from 'src/app/Model/addToCart';
import { ProductSelectModel } from 'src/app/Model/ProductSelectModel';
import { MeshPRCDataListModel } from 'src/app/Model/MeshPRCDataListModel';
import { LoginService } from 'src/app/services/login.service';
import { ProcessSharedServiceService } from '../../process-order/SharedService/process-shared-service.service';
import { OrderSummarySharedServiceService } from '../../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { StructureDataModel } from 'src/app/Model/structureDataModel';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [NgbCarouselConfig],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate('400' + 'ms ease-in')),
      transition('true => false', animate('400' + 'ms ease-out')),
    ]),
  ],
})
export class ProjectComponent {
  @Input('ProjectCode') ProjectCode: any;
  @Input('CustomerCode') CustomerCode: any;

  @ViewChild('dataEntrySelect') dataEntrySelect!: NgSelectComponent;

  projectorderForm!: FormGroup;
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  customerList: any = [];
  isSelectAllScheduled: boolean = false;
  WBS1dropList: any = [];
  WBS2dropList: any = [];
  WBS3dropList: any = [];

  createorderarray: any[] = [];

  istoggel: boolean = false;
  iscapping: boolean = false;
  projectList: any = [];
  loadingData = false;
  activeorderarray: any = [];
  isExpand: boolean = false;
  toggleFilters = false;

  meshShow: boolean = false;
  beamShow: boolean = false;
  columnShow: boolean = false;
  slabbShow: boolean = false;
  slabtShow: boolean = false;
  DwallShow: boolean = false;
  pileShow: boolean = false;
  wallShow: boolean = false;
  slabShow: boolean = false;
  prcShow: boolean = false;

  meshCollapse: boolean = true;
  beamCollapse: boolean = true;
  columnCollapse: boolean = true;
  slabbCollapse: boolean = true;
  slabtCollapse: boolean = true;
  DwallCollapse: boolean = true;
  pileCollapse: boolean = true;
  wallCollapse: boolean = true;
  slabCollapse: boolean = true;
  prcCollapse: boolean = true;
  DATAENTRY: any;
  NATSTEELDATAENTRY: any;
  collapsed: boolean = true;
  // addToCart: boolean = false;
  selectedGreenOption: string = '';
  nextbuttonClicked = false;
  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;

  beamData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  columnData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  slabbData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  slabtData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  DwallData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  pileData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  wallData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  slabData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  drainData: StructureDataModel = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: [],
  };
  prcSelectAll: boolean = false;
  meshSelectAll: boolean = false;

  WBS1: string = '';
  WBS2: string[] = [];
  WBS3: string[] = [];
  // MeshPRCDataList: MeshPRCDataListModel[] = [];
  MeshPRCDataList: any[] = [];

  showScheduledData: boolean = false;

  ProductListData: ProductSelectModel[] = [];
  structureElementCollapse: boolean = false;
  disableCreateOrder: boolean = false;
  listofOrders: AddToCart[] = [];
  currentListOrderIndex = 0;

  tempOrderSummaryList: TempOrderSummaryData = {
    pCustomerCode: '',
    pProjectCode: '',
    pSelectedCount: 0,
    pSelectedSE: [],
    pSelectedProd: [],
    pSelectedWT: [],
    pSelectedQty: [],
    pSelectedPostID: [],
    pSelectedScheduled: [],
    pSelectedWBS1: [],
    pSelectedWBS2: [],
    pSelectedWBS3: [],
    pWBS1: '',
    pWBS2: '',
    pWBS3: '',
    pOrderNo: [],
    StructProd: [],
  };

  MeshData: ScheduledData[] = [];
  prcData: ScheduledData[] = [];
  JSON: any;

  showOrderSummary: boolean = false;

  selectedStructureElement: any[] = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private config: NgbCarouselConfig,
    private orderService: OrderService,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private createSharedService: CreateordersharedserviceService,
    private toastr: ToastrService,
    private loginService: LoginService,
    private processsharedserviceService: ProcessSharedServiceService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService
  ) {
    this.projectorderForm = this.formBuilder.group({
      wbs1: new FormControl('', Validators.required),
      wbs2: new FormControl('', Validators.required),
      wbs3: new FormControl('', Validators.required),
      DataEntry: new FormControl([], Validators.required),
      NatsteelDataEntry: new FormControl([], Validators.required), //NOT USING CURRENTLY
      // requireddate: new FormControl('', Validators.required),
      // isinclude: new FormControl('', Validators.required),
    });

    this.DATAENTRY = [
      { statusId: 3, status: 'Beam', displayName: 'BEAM (梁)' },
      { statusId: 6, status: 'Column', displayName: 'COLUMN (柱)' },
      { statusId: 12, status: 'Slab', displayName: 'SLAB (板)' },
      { statusId: 13, status: 'Slab-B', displayName: 'SLAB-B (下板)' },
      { statusId: 14, status: 'Slab-T', displayName: 'SLAB-T (上板)' },
      { statusId: 15, status: 'Dwall', displayName: 'DWALL (连续墙)' },
      { statusId: 16, status: 'Pile', displayName: 'PILE (桩)' },
      { statusId: 17, status: 'Wall', displayName: 'WALL (墙)' },
    ];

    this.NATSTEELDATAENTRY = [
      { statusId: 3, status: 'Mesh' },
      { statusId: 6, status: 'PRC' },
    ];
  }

  async ngOnInit() {
    this.commonService.changeTitle('Project| ODOS');
    this.projectorderForm.controls.wbs1.enable();
    this.projectorderForm.controls.wbs2.enable();
    this.projectorderForm.controls.wbs3.enable();
    this.projectorderForm.controls.DataEntry.enable();
    this.disableCreateOrder = false;

    this.CheckafterSubmit();
    this.reloadService.reloadCreateOrderTabProject$.subscribe((data) => {
      this.CheckafterSubmit();
      this.createSharedService.tempProjectOrderSummaryList = undefined;
      this.createSharedService.selectedStructElements = [];
      this.createSharedService.selectedWBS = [];
      this.resetTempOrderList();
      this.showOrderSummary = false;
      this.showScheduledData = false;
      this.collapsed = false;
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      this.GetWBS1Multiple();
      this.GetProductListData(this.CustomerCode, this.ProjectCode);
    });

    debugger;
    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.ProjectCode = [];
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.createSharedService.tempProjectOrderSummaryList = undefined;
      this.resetTempOrderList();
      this.showOrderSummary = false;
      this.showScheduledData = false;
      this.collapsed = false;
      this.GetWBS1Multiple();
      this.resetStructureElements();
      // this.createOrderForm.controls['customer'].patchValue(this.dropdown.getCustomerCode());
      // this.GetOrderCustomer();
      // this.projectList = [];
      // this.ProjectList = [];
      // this.createOrderForm.controls['project'].patchValue(this.ProjectList);
      // this.GetOrderProjectsList(this.createOrderForm.controls['customer'].value);
    });

    this.reloadService.reload$.subscribe((data) => {
      console.log('Project Component Reloaded => ', data);
      if (true) {
        this.CheckafterSubmit();

        this.createSharedService.tempProjectOrderSummaryList = undefined;
        this.createSharedService.selectedStructElements = [];
        this.createSharedService.selectedWBS = [];
        this.resetTempOrderList();
        this.showOrderSummary = false;
        this.showScheduledData = false;
        this.collapsed = false;
        this.ProjectCode = this.dropdown.getProjectCode()[0];
        this.GetWBS1Multiple();
        this.GetProductListData(this.CustomerCode, this.ProjectCode);

        this.GetProductGreenSteelValue();
        // this.createOrderForm.controls['customer'].patchValue(this.dropdown.getCustomerCode());
        // this.ProjectList = this.dropdown.getProjectCode();
        // this.ProjectList = this.ProjectList[0]
        // this.createOrderForm.controls['project'].patchValue(this.ProjectList);

        // this.openTabs = true
        // this.Loaddata();
      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });

    this.reloadService.reloadCreateOrderProjectInputs$.subscribe((data) => {
      let OrderStatus = data;
      console.log(
        'this.createSharedService.tempProjectOrderSummaryList',
        this.createSharedService.tempProjectOrderSummaryList
      );
      if (OrderStatus.toUpperCase().includes('CREATED') == false) {
        //DISABLE ALL INPUTS
        this.projectorderForm.controls.wbs1.disable();
        this.projectorderForm.controls.wbs2.disable();
        this.projectorderForm.controls.wbs3.disable();
        this.projectorderForm.controls.DataEntry.disable();
        this.disableCreateOrder = true;

        this.changeDetectorRef.detectChanges();
      } else {
        this.projectorderForm.controls.wbs1.enable();
        this.projectorderForm.controls.wbs2.enable();
        this.projectorderForm.controls.wbs3.enable();
        this.projectorderForm.controls.DataEntry.enable();
        this.disableCreateOrder = false;

        this.changeDetectorRef.detectChanges();
      }
    });

    this.changeDetectorRef.detectChanges();
    this.showOrderSummary = false; //TO CLOSE THE ORDER SUMMARY WINDOW ON LOADING CREATE ORDER PAGE
    this.GetWBS1Multiple(); //TO LOAD THE LIST FOR WBS1
    this.GetProductListData(this.CustomerCode, this.ProjectCode); //TO GET THE PRODUCT TYPE DATA FOR THE SELECTED STRUCTURE ELEMENTS
    this.GetProductGreenSteelValue();

    let lProcessItem: any =
      this.ordersummarySharedService.GetOrderSummaryData();
    // let lProcessItem: any = localStorage.getItem('CreateDataProcess');
    // lProcessItem = JSON.parse(lProcessItem);
    if (lProcessItem) {
      if (lProcessItem.pSelectedSE.includes('NONWBS') || lProcessItem.pSelectedSE.includes('nonwbs')) {
      } else {
        this.createSharedService.tempProjectOrderSummaryList = JSON.parse(
          JSON.stringify(lProcessItem)
        );
        this.createSharedService.showOrderSummary = true;
        this.createSharedService.selectedWBS = {
          wbs1: lProcessItem.pSelectedWBS1[0],
          wbs2: [...new Set(lProcessItem.pSelectedWBS2)],
          wbs3: [...new Set(lProcessItem.pSelectedWBS3)],
        };

        await this.GetMeshPRCData();

        // UDPATE SELECTED STRUCTURE ELEMENTS
        let lSelectedStruct = [];
        for (let i = 0; i < lProcessItem.pSelectedSE.length; i++) {
          let index = this.DATAENTRY.findIndex(
            (x: any) =>
              x.status.toUpperCase() ===
              lProcessItem.pSelectedSE[i].toUpperCase()
          );
          if (index != -1) {
            lSelectedStruct.push(this.DATAENTRY[index].statusId);
          }
        }
        // let index = this.DATAENTRY.findIndex((x: any) => x.status.toUpperCase() === lProcessItem.pSelectedSE[0].toUpperCase());
        this.createSharedService.selectedStructElements = lSelectedStruct;
        this.selectedStructureElement = lSelectedStruct;
        this.projectorderForm.controls.DataEntry.patchValue(lSelectedStruct);

        // for (let i = 0; i < this.DATAENTRY.length; i++) {
        //   this.DATAENTRY[i].disabled = false;
        // }
        // if (lProcessItem.pSelectedQty[0] != 0) {
        //   this.DATAENTRY[index].disabled = true;
        // }
        this.changeDetectorRef.detectChanges();
      }
    }

    if (this.createSharedService.selectedWBS) {
      // WHEN RETURNING TO ORDER CREATION PAGE FROM ORDER SUMMARY WITHOUT SUBMITINH THE ORDER
      this.GetWBS1Multiple();
      this.WBS1 = this.createSharedService.selectedWBS.wbs1;
      this.projectorderForm.controls['wbs1'].patchValue(
        this.createSharedService.selectedWBS.wbs1
      );

      this.WBS2 = this.createSharedService.selectedWBS.wbs2;
      this.GetWBS2Multiple();
      this.projectorderForm.controls['wbs2'].patchValue(
        this.createSharedService.selectedWBS.wbs2
      );

      this.WBS3 = this.createSharedService.selectedWBS.wbs3;
      this.pInitialFlag = true;
      this.GetWBS3Multiple();
      this.projectorderForm.controls['wbs3'].patchValue(
        this.createSharedService.selectedWBS.wbs3
      );
    }
    // Pass this condition if the selected order has WBS present.
    /** OR this component opens the order summary page while navigating to OrderSummary, even when the OrderType is NONWBS */
    /**
     * In case of WBS order => this.createSharedService.selectedWBS = {wbs1:'',wbs2:'',wbs3:''}, .length returns -> undefined
     * In case of NONWBS order => this.createSharedService.selectedWBS = [], .length returns -> 0
     */
    if (
      this.createSharedService.showOrderSummary &&
      this.createSharedService.selectedWBS.length != 0
    ) {
      // WHEN RETURNING TO ORDER CREATION PAGE FROM ORDER SUMMARY WITHOUT SUBMITINH THE ORDER

      // CHOOSING THE SELECTED STRUCTURE ELEMENTS FROM THE DROPDOWN
      this.projectorderForm.controls['DataEntry'].patchValue(
        this.createSharedService.selectedStructElements
      );
      if (this.createSharedService.upcomingOrderFlag == false) {
        this.showOrderSummary = true;
        this.structureElementCollapse = true;
      }
      this.changeDataEntry(); //TO "UN-HIDE" THE DATA FOR THE SELECTED STRUCTURE ELEMENTS

      // this.reloadService.reloadOrderSummaryComponent.emit();
    }

    if (this.createSharedService.tempProjectOrderSummaryList) {
      this.tempOrderSummaryList = JSON.parse(
        JSON.stringify(this.createSharedService.tempProjectOrderSummaryList)
      );

      this.getData();
    }
  }

  ngOnDestroy() {
    console.log('lakhpati');
    // this.createSharedService.tempProjectOrderSummaryList = undefined;
    // this.createSharedService.selectedStructElements = [];
    // this.createSharedService.selectedWBS = [];
    // this.projectorderForm.reset();
    // this.showOrderSummary = false;
    // this.structureElementCollapse = false
    // this.HideStructures();
  }

  showDetails(item: any) {
    this.isExpand = true;
  }
  // getLink(): string {
  //   return `/createorder/orderdetails?state=${btoa(JSON.stringify(this.tempOrderSummaryList))}`;
  // }

  // convenience getter for easy access to form fields
  get f() {
    return this.projectorderForm.controls;
  }

  navigateWithObject() {
    const myObject = {
      key1: 'value1',
      key2: 'value2',
    };

    // Replace 'other-page' with the actual route path of the page you want to navigate to
    this.router.navigate(['createorder/orderdetails'], {
      state: { data: myObject },
    });
  }
  onSubmit() {
    // console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.projectorderForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.projectorderForm.reset();
  }
  selectAll(isSelected: boolean, list: any) {
    //debugger;
    if (isSelected) {
      for (let i = 0; i < list.length; i++) {
        list[i].isSelected = true;
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        list[i].isSelected = false;
      }
    }
  }

  sortArray: any[] = [];
  updatedWBS3Extension: any[] = [];
  open() {
    this.sortArray = [];
    if (this.WBS1.length == 0) {
      this.toastr.error(
        'Invalid WBS1 selected. Please select a WBS1 so that you can continue to extand WBS3 under the selected Block. <br> 请选择一个座号/大牌, 以便在此座号/大牌之下来扩展分部.'
      );
      return;
    }
    if (this.WBS2.length == 0) {
      this.toastr.error(
        'Invalid WBS2 selected. Please select a WBS2 so that you can continue to extand Part under the selected WBS2. <br> 请选择一个楼层, 以便在此楼层之下来扩展分部.'
      );
      return;
    }
    // if (this.WBS3.length == 0) {
    //   this.toastr.error(
    //     'Invalid WBS3 selected. Please select a WBS3 so that you can continue to extend the selected WBS3. <br>  请选择一个分部, 以便在此分部之下来扩展分部.'
    //   );
    //   return;
    // }

    // Convert the array of strings to an array of numbers

    // this.WBS2.sort((a, b) => {
    //   // Extract numeric part if present and compare
    //   const numA = parseInt(a);
    //   const numB = parseInt(b);
    //   const isNaN_A = isNaN(numA);
    //   const isNaN_B = isNaN(numB);

    //   if (!isNaN_A && !isNaN_B) {
    //     return numA - numB; // Compare as numbers
    //   } else if (!isNaN_A || !isNaN_B) {
    //     return isNaN_A ? 1 : -1; // Numbers come before strings
    //   } else {
    //     return a.localeCompare(b); // Compare as strings
    //   }
    // });

    const customSort = (a: string, b: string) => {
      // Compare alphabetically first
      const compareAlphabetically = a.localeCompare(b);
      if (compareAlphabetically !== 0) {
        return compareAlphabetically;
      }
      // If alphabetically equal, sort by length
      return a.length - b.length;
    };

    this.WBS2.sort(customSort);
    // Find maximum and minimum values
    const max = this.WBS2[this.WBS2.length - 1];
    const min = max;

    // const min = this.WBS2[0];

    // console.log('Sorted Array:', this.WBS2);
    // console.log('Max Value:', max);

    // // this.sortArray=this.WBS2dropList;
    // // this.sortArray = Object.entries(this.WBS2dropList);
    // let min;

    // const numericValues = this.WBS2.filter(item => {
    //   const parsedValue = parseInt(item);
    //    return !isNaN(parsedValue) && parsedValue.toString() === item;
    //   });

    //   if (numericValues.length > 0) {
    //     for (let i = 0; i < this.WBS2dropList.WBS2.length; i++) {
    //       this.sortArray[i] = this.WBS2dropList.WBS2[i];
    //     }

    //     const numericValues = this.sortArray.filter(item => {
    //       const parsedValue = parseInt(item);
    //        return !isNaN(parsedValue) && parsedValue.toString() === item;
    //       });

    //     if (numericValues.length > 0) {
    //       min = Math.min(...numericValues.map(parseFloat));
    //     }
    //     else
    //     {
    //       min=max;
    //     }

    //   }
    //   else
    //   {
    //     min=max;
    //   }

    // const numericValues = this.sortArray.filter(item => !isNaN(parseFloat(item)));
    // Filter out only numeric strings
    // const numericValues = this.sortArray.filter(item => {
    // const parsedValue = parseInt(item);
    //  return !isNaN(parsedValue) && parsedValue.toString() === item;
    // });

    // this.sortArray.sort((a, b) => {
    //   // Extract numeric part if present and compare
    //   const numA = parseInt(a);
    //   const numB = parseInt(b);

    //   // Extract numeric part
    //   const numericPartA = isNaN(numA) ? parseInt(a) : numA;
    //   const numericPartB = isNaN(numB) ? parseInt(b) : numB;

    //   // Compare numeric parts first
    //   if (numericPartA !== numericPartB) {
    //     return numericPartA - numericPartB;
    //   }

    //   // If numeric parts are equal, compare alphabetic parts
    //   return a.localeCompare(b);
    // });

    // // Find maximum and minimum values
    // // const max = this.WBS2[this.WBS2.length - 1];
    // const min = this.sortArray[0];

    // console.log("checking array", this.sortArray);
    // console.log('Min Value:', min);

    // const numbersArray: number[] = this.WBS2.map(Number);

    // // Find the maximum number in the array
    // const maxNumber = Math.max(...numbersArray);

    // // Assign the maximum number to a variable
    // const maxNumberVariable = maxNumber;

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      CreateWbsComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.wbs1 = this.WBS1;
    modalRef.componentInstance.wbs2 = max;
    modalRef.componentInstance.wbs3 = this.WBS3.toString();
    modalRef.componentInstance.SelectedProjectID = this.ProjectCode;
    modalRef.componentInstance.customercode = this.CustomerCode;
    modalRef.componentInstance.storyFrom = min;
    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      this.GetWBS3Multiple();
      debugger;
      if (x != undefined || x != '') {
        this.updatedWBS3Extension.push(x);
        this.projectorderForm.controls['wbs3'].patchValue(
          this.updatedWBS3Extension
        );
      }
      // this.ReloadOrderDetails()
    });
  }

  changeNatsteelDataEntry() {
    let selectStructure =
      this.projectorderForm.controls['NatsteelDataEntry'].value;
    this.meshShow = false;
    this.prcShow = false;
    for (let i = 0; i < selectStructure.length; i++) {
      if (selectStructure[i] == 3) {
        this.meshShow = true;
      } else if (selectStructure[i] == 6) {
        this.prcShow = true;
      }
    }
  }

  // AddToCart(item: AddToCart) {
  //   console.log('ADDED TO CART', item);
  //   this.orderService.AddToCart(item).subscribe({
  //     next: (response: any) => {
  //       console.log('ORDER NUMBER', response);
  //       this.createSharedService.tempOrderList.push(response);
  //       // this.tempOrderSummaryList.pOrderNo[this.currentListOrderIndex] =
  //       //   response;

  //       this.tempOrderSummaryList.pOrderNo.forEach((x: any) => {
  //         x = response;
  //       });

  //       this.currentListOrderIndex = this.currentListOrderIndex + 1;

  //       if (this.currentListOrderIndex < this.listofOrders.length) {

  //         // FOR GENERATING ORDER NUMBER
  //         this.AddToCart(this.listofOrders[this.currentListOrderIndex]);
  //       } else {
  //         this.createSharedService.viewData = false;

  //         window.history.state.tempOrderSummaryList.pOrderNo =
  //           this.tempOrderSummaryList.pOrderNo.join(',');
  //         this.createSharedService.selectedTab = true;
  //         this.showOrderSummary = true;
  //         this.structureElementCollapse = true;

  //         this.SaveProductValues();

  //         this.currentListOrderIndex = 0;
  //         this.listofOrders = [];
  //       }
  //     },
  //     error: () => {},
  //     complete: () => {},
  //   });
  // }

  async AddToCart_async(item: AddToCart) {
    try {
      const data = await this.orderService.AddToCart(item).toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }

  GetInfoCardData(postHeaderID: any, title: string) {
    let temp: any = this.MeshPRCDataList.find(
      (x) => x.PostHeaderID === Number(postHeaderID)
    );
    if (title == 'BBS DESC') {
      return temp.BBSDesc;
    } else if (title == 'STRUCTURE ELEMENT') {
      return temp.StructEle;
    } else if (title == 'PRODUCT TYPE') {
      return temp.ProductType;
    } else if (title == 'TOTAL PEICES') {
      return temp.TotalPCs;
    } else if (title == 'TOTAL WEIGHT') {
      return temp.TotalWeight;
    } else if (title == 'POSTED BY') {
      return temp.PostedBy;
    } else if (title == 'POSTED DATE') {
      return temp.PostedDate;
    } else if (title == 'WBS') {
      return temp.WBS1 + '/' + temp.WBS2 + '/' + temp.WBS3;
    } else if (title == 'STATUS') {
      return temp.Status;
    }
  }

  // ---------------------OPTIMISED--------------------------

  // FUNCTIONS CALLED ON PAGE LOAD ------------------- START-------------------------------------------------

  GetWBS1Multiple() {
    debugger;
    // GET DROPDOWN LIST FOR WBS1
    let obj = {
      ProjectCode: this.ProjectCode,
      WBS1: ['string'],
      WBS2: ['string'],
      UserName: this.loginService.GetGroupName(),
    };
    this.loading = true;
    this.orderService.GetWBS1Multiple(obj).subscribe({
      next: (response) => {
        this.WBS1dropList = response;
        console.log('WBS1dropList', response);
      },
      error: (e) => {},
      complete: () => {
        this.loading = false;
      },
    });

    this.changeDetectorRef.detectChanges();
  }
  GetWBS2Multiple() {
    // GET DROPDOWN LIST FOR WBS2
    let obj = {
      ProjectCode: this.ProjectCode,
      WBS1: [this.WBS1],
      WBS2: ['string'],
      UserName: this.loginService.GetGroupName(),
    };
    this.loading = true;
    this.orderService.GetWBS2Multiple(obj).subscribe({
      next: (response) => {
        this.WBS2dropList = response;
        console.log('WBS2dropList', response);
      },
      error: (e) => {},
      complete: () => {
        this.loading = false;
      },
    });
  }
  GetWBS3Multiple() {
    // GET DROPDOWN LIST FOR WBS3
    if (this.WBS1 != '') {
      let obj = {
        ProjectCode: this.ProjectCode,
        WBS1: [this.WBS1],
        WBS2: this.WBS2,
        UserName: this.loginService.GetGroupName(),
      };
      this.loading = true;
      this.orderService.GetWBS3Multiple(obj).subscribe({
        next: (response) => {
          this.WBS3dropList = response;
          if (response.length == 1) {
            if (response[0] == '') {
              this.projectorderForm.controls.wbs3.patchValue(response);
              if (this.showOrderSummary == false) {
                this.changewbs3(response);
                // Auto Open Structure elements list
                this.openDropdownStructureElement();
              }
            }
          }
          console.log('WBS3dropList', response);
        },
        error: (e) => {},
        complete: () => {
          debugger;
          console.log('WBS3dropList', this.WBS3dropList);
          console.log('this.updatedWBS3Extension', this.updatedWBS3Extension);
          //  this.projectorderForm.controls['wbs3'].setValue(this.updatedWBS3Extension);
          const wbs3Control = this.projectorderForm.get('wbs3');
          if (wbs3Control) {
            if (this.updatedWBS3Extension) {
              if (this.updatedWBS3Extension.length > 1) {
                wbs3Control.setValue(this.updatedWBS3Extension);
              }
            }
          }
          let x = this.projectorderForm.controls['wbs3'].value;
          this.changeDetectorRef.detectChanges();
          console.log('X', x);
          //
          if (this.showOrderSummary == false) {
            if (this.updatedWBS3Extension) {
              if (this.updatedWBS3Extension.length >= 1) {
                this.changewbs3(this.updatedWBS3Extension);
              }
            }
          }
          this.loading = false;
          this.updatedWBS3Extension = [];
        },
      });
    }
  }

  changewbs1(event: any) {
    this.WBS1 = event;

    //RESET VALUES FOR WBS2, WBS3 AND MESHPRC DATA ON CHANGE
    this.projectorderForm.controls['wbs2'].reset();
    this.projectorderForm.controls['wbs3'].reset();
    this.WBS2 = [];
    this.WBS3 = [];
    this.WBS2dropList = [];
    this.WBS3dropList = [];

    this.resetTempOrderList();
    this.RemoveMeshPrcData();

    this.GetWBS2Multiple(); //CALL TO GET WBS2 DROPDOWN LIST

    this.showScheduledData = false;
    this.showOrderSummary = false;
    this.projectorderForm.controls['DataEntry'].reset();
    this.structureElementCollapse = false;
    this.HideStructures();
  }
  changewbs2(event: any, wbs2Change: any) {
    this.WBS2 = event;
    this.WBS2 = this.sortList(this.WBS2); // Sort the WBS list
    this.projectorderForm.controls['wbs2'].patchValue(this.WBS2); // Update teh list to reflect in UI

    //RESET VALUES FOR WBS3 AND MESHPRC DATA ON CHANGE
    this.projectorderForm.controls['wbs3'].reset();
    this.WBS3 = [];

    this.WBS3dropList = [];
    this.resetTempOrderList();
    this.RemoveMeshPrcData();

    this.GetWBS3Multiple(); //CALL TO GET WBS3 DROPDOWN LIST

    this.showScheduledData = false;
    this.showOrderSummary = false;
    this.projectorderForm.controls['DataEntry'].reset();
    this.HideStructures();
    this.structureElementCollapse = false;
    setTimeout(() => {
      wbs2Change.element.querySelector('input').value = '';
    });
  }
  async changewbs3(event: any) {
    this.WBS3 = event;
    this.WBS3 = this.sortList(this.WBS3); // Sort the WBS list
    this.projectorderForm.controls['wbs3'].patchValue(this.WBS3); // Update teh list to reflect in UI

    //RESET VALUES FOR MESHPRC DATA ON CHANGE
    this.resetTempOrderList();
    this.RemoveMeshPrcData();

    // this.showScheduledData = false;
    this.showOrderSummary = false;
    this.structureElementCollapse = false;
    this.HideStructures();
    this.projectorderForm.controls['DataEntry'].reset();

    await this.GetMeshPRCData(); //CALL TO GET WBS3 DROPDOWN LIST

    // this.GetProductListData(this.CustomerCode, this.ProjectCode);
    if (this.pInitialFlag && this.WBS3.length > 0) {
      this.UpdateForDetailedOrders();
      this.pInitialFlag = false;
    }
  }

  sortList(list: any) {
    // const list = ['11', '13', '7', '4', 'WR', 'FDN'];

    const sortedList = list.sort((a: any, b: any) => {
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));

      if (isANumber && isBNumber) {
        // Both are numbers, sort numerically
        return Number(a) - Number(b);
      } else if (!isANumber && !isBNumber) {
        // Both are strings, sort alphabetically
        return a.localeCompare(b);
      } else {
        // Numbers come before strings
        return isANumber ? -1 : 1;
      }
    });

    console.log(sortedList); // Output: ['4', '7', '11', '13', 'FDN', 'WR']
    return sortedList;
  }

  pInitialFlag: boolean = true;
  UpdateForDetailedOrders() {
    if (this.createSharedService.tempProjectOrderSummaryList) {
      let TempSummaryData = JSON.parse(
        JSON.stringify(this.createSharedService.tempProjectOrderSummaryList)
      );
      let lStruct = [];
      let lUpdatedOrder: any[] = [];
      for (let i = 0; i < TempSummaryData.pOrderNo.length; i++) {
        if (
          TempSummaryData.pOrderNo[i] != 0 &&
          TempSummaryData.pSelectedScheduled[i] != 'Y'
        ) {
          // UDPATE SELECTED STRUCTURE ELEMENTS
          let index = this.DATAENTRY.findIndex(
            (x: any) =>
              x.status.toUpperCase() ===
              TempSummaryData.pSelectedSE[i].toUpperCase()
          );
          lStruct.push(this.DATAENTRY[index].statusId);

          let lStructProd = (
            TempSummaryData.pSelectedSE[i] +
            '/' +
            TempSummaryData.pSelectedProd[i] +
            '/' +
            TempSummaryData.pSelectedPostID[i]
          ).toLowerCase();
          if (lUpdatedOrder.includes(lStructProd) == false) {
            if (this.WBS1 && this.WBS2 && this.WBS3) {
              // if (
              //   this.WBS1 == TempSummaryData.pSelectedWBS1[i] &&
              //   this.WBS2.includes(TempSummaryData.pSelectedWBS2[i]) &&
              //   this.WBS3.includes(TempSummaryData.pSelectedWBS3[i])
              // ) {
              if (TempSummaryData.pSelectedPostID[i] == 0) {
                this.UpdateSelectedProd(
                  TempSummaryData.pSelectedSE[i],
                  TempSummaryData.pSelectedProd[i],
                  TempSummaryData.pSelectedWT[i],
                  TempSummaryData.pSelectedQty[i]
                );
              } else {
                let lProdType =
                  TempSummaryData.pSelectedProd[i] +
                  '/' +
                  TempSummaryData.pSelectedPostID[i];
                this.UpdateSelectedProd(
                  TempSummaryData.pSelectedSE[i],
                  lProdType,
                  TempSummaryData.pSelectedWT[i],
                  TempSummaryData.pSelectedQty[i]
                );
              }
              // }
            }
            lUpdatedOrder.push(lStructProd);
          }
        }
      }
      if (lStruct.length > 0) {
        this.createSharedService.selectedStructElements = lStruct;
        this.selectedStructureElement = lStruct;
        this.projectorderForm.controls.DataEntry.patchValue(lStruct);

        this.changeDataEntry();
      }
    }
  }

  UpdateSelectedProd(
    pStructEle: any,
    pProdType: any,
    pOrderWt: any,
    pOrderQty: any
  ) {
    let lDataList: any = this.GetStructDataList(pStructEle);
    // if (lDataList.ProdCode.includes(pProdType.toLowerCase())) {
    // }
    let lIndex = lDataList.ProdCode.findIndex(
      (x: any) => x === pProdType.toLowerCase()
    );

    if (lIndex != -1) {
      console.log('Product Present!!');
      lDataList.isSelected[lIndex] = true;
      lDataList.OrderQty[lIndex] = pOrderQty;
      lDataList.OrderWt[lIndex] = pOrderWt;

      this.AddToTempData(
        pStructEle.toUpperCase(),
        lDataList,
        lDataList.ProdCode[lIndex],
        lIndex,
        lDataList.isSelected[lIndex]
      );
    }
  }

  GetStructDataList(pStructEle: any) {
    if (pStructEle.toUpperCase() == 'BEAM') {
      return this.beamData;
    } else if (pStructEle.toUpperCase() == 'COLUMN') {
      return this.columnData;
    } else if (pStructEle.toUpperCase() == 'SLAB-B') {
      return this.slabbData;
    } else if (pStructEle.toUpperCase() == 'SLAB-T') {
      return this.slabtData;
    } else if (pStructEle.toUpperCase() == 'DWALL') {
      return this.DwallData;
    } else if (pStructEle.toUpperCase() == 'PILE') {
      return this.pileData;
    } else if (pStructEle.toUpperCase() == 'WALL') {
      return this.wallData;
    } else if (pStructEle.toUpperCase() == 'SLAB') {
      return this.slabData;
    } else if (pStructEle.toUpperCase() == 'DRAIN') {
      return this.drainData;
    } else {
      return undefined;
    }
  }

  RemoveMeshPrcData() {
    this.showScheduledData = false;
    //ASSINGS THE ORIGINAL VALUE OBTAINED FROM 'PRODUCTSELECT'
    this.beamData = JSON.parse(
      JSON.stringify(this.createSharedService.beamData)
    );
    this.columnData = JSON.parse(
      JSON.stringify(this.createSharedService.columnData)
    );
    this.slabData = JSON.parse(
      JSON.stringify(this.createSharedService.slabData)
    );
    this.slabbData = JSON.parse(
      JSON.stringify(this.createSharedService.slabbData)
    );
    this.slabtData = JSON.parse(
      JSON.stringify(this.createSharedService.slabtData)
    );
    this.DwallData = JSON.parse(
      JSON.stringify(this.createSharedService.DwallData)
    );
    this.pileData = JSON.parse(
      JSON.stringify(this.createSharedService.pileData)
    );
    this.wallData = JSON.parse(
      JSON.stringify(this.createSharedService.wallData)
    );
    this.drainData = JSON.parse(
      JSON.stringify(this.createSharedService.drainData)
    );
  }

  async GetMeshPRCData() {
    let obj = {
      ProjectCode: this.ProjectCode,
      WBS1: [this.WBS1],
      WBS2: this.WBS2,
      WBS3: this.WBS3,
      CustomerCode: this.CustomerCode,
    };

    try {
      const response: any = await this.orderService
        .GetMeshPRCData(obj)
        .toPromise();
      this.MeshPRCDataList = response;
      this.showScheduledData = false;

      if (response.length > 0) {
        this.showScheduledData = true;
      }
      console.log('MeshPRCDataList', this.MeshPRCDataList);

      this.createSharedService.MeshPRCDataList = this.MeshPRCDataList;
      this.MeshData = [];
      this.filterMeshData();
    } catch (error) {
      console.log(error);
    }
  }

  filterMeshData() {
    for (let i = 0; i < this.MeshPRCDataList.length; i++) {
      let element = this.MeshPRCDataList[i];
      let struct = element.StructEle;
      let dataList: any = this.GetStructDataList(struct);

      let lProdPresent: boolean = false;
      for (let j = 0; j < dataList.ProdCode.length; j++) {
        if (dataList.ProdCode.includes(element.PostHeaderID)) {
          lProdPresent = true;
        }
      }
      if (lProdPresent == false) {
        dataList.ProdCode.push(
          element.ProductType.toLowerCase() + '/' + element.PostHeaderID
        );
        dataList.ProdName.push(element.ProductType);
        dataList.isSelected.push(false);
        dataList.OrderQty.push(0);
        dataList.OrderWt.push(0);
      }
    }
    console.log('this.beamData', this.beamData);
    console.log('this.columnData', this.columnData);
    console.log('this.slabbData', this.slabbData);
    console.log('this.slabtData', this.slabtData);
    console.log('this.DwallData', this.DwallData);
    console.log('this.pileData', this.pileData);
    console.log('this.wallData', this.wallData);
    console.log('this.slabData', this.slabData);
    console.log('this.drainData', this.drainData);

    //CALL THE FUNCTION TO UPDATE THE SELECTED COLUMN
  }

  UpdateStructElementsData(StructEleData: any, StructEle: string): any {
    let Index = this.ProductListData.findIndex((x) => x.SECode === StructEle);
    if (Index != -1) {
      //RESPONSE HAVE PRODUCT FOR THE SELECTED STRUCTURE ELEMENT
      StructEleData = {
        ProdName: this.ProductListData[Index].ProdName,
        ProdCode: this.ProductListData[Index].ProdCode,
        isSelected: [],
        OrderQty: [],
        OrderWt: [],
      };
      // StructEleData.ProdName.forEach((item: any) => {
      //   // ASSIGNING SELECTED VALUE AS FALSE FOR ALL THE PRODUCT TYPE
      //   StructEleData.isSelected[
      //     StructEleData.ProdName.findIndex((x: any) => x === item)
      //   ] = false;
      // });

      for (let i = 0; i < StructEleData.ProdName.length; i++) {
        StructEleData.isSelected[i] = false;
        StructEleData.OrderQty[i] = 0;
        StructEleData.OrderWt[i] = 0;
      }
    }

    return StructEleData;
  }

  UpdateMeshPrcData(StructEleData: any, StructEle: string): StructureDataModel {
    this.MeshPRCDataList = this.createSharedService.MeshPRCDataList;
    if (this.MeshPRCDataList) {
      if (this.MeshPRCDataList.length != 0) {
        for (let i = 0; i < this.MeshPRCDataList.length; i++) {
          if (this.MeshPRCDataList[i].StructEle === StructEle) {
            StructEleData.ProdName.push(this.MeshPRCDataList[i].ProductType);
            StructEleData.ProdCode.push(
              this.MeshPRCDataList[i].ProductType.toLowerCase() +
                '/' +
                this.MeshPRCDataList[i].PostHeaderID
            );
            StructEleData.isSelected.push(false);
            StructEleData.OrderWt.push(this.MeshPRCDataList[i].TotalWeight);
            StructEleData.OrderQty.push(this.MeshPRCDataList[i].TotalPCs);
          }
        }
      }
    }
    return StructEleData;
  }

  GetProductListData(pCustomerCode: any, pProjectCode: any) {
    this.loadingData = true; //FOR THE LOADING ANIMATION

    //EMPTYING THE LIST BEFORE ASSIGNING NEW VALUES
    this.ProductListData = [];
    this.resetStructureElements();
    let UserName = this.loginService.GetGroupName();

    this.orderService
      .ProductSelect(pCustomerCode, pProjectCode, UserName)
      .subscribe({
        next: (response) => {
          this.ProductListData = response;
          console.log('ProductListData', response);

          if (response.length > 1) {
            //MEANING THE SELECTED PROJECT HAVE WBS ASSIGNED TO IT

            // FOR BEAM
            this.beamData = this.UpdateStructElementsData(
              this.beamData,
              'BEAM'
            );
            //if (this.beamData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.beamData = this.UpdateMeshPrcData(this.beamData, 'BEAM');
              this.getUpdatedData('BEAM', this.beamData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.beamData = JSON.parse(
              JSON.stringify(this.beamData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            //}
            //FOR COLUMN
            this.columnData = this.UpdateStructElementsData(
              this.columnData,
              'COLUMN'
            );

            //if (this.columnData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.columnData = this.UpdateMeshPrcData(
                this.columnData,
                'COLUMN'
              );
              this.getUpdatedData('COLUMN', this.columnData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.columnData = JSON.parse(
              JSON.stringify(this.columnData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            // }

            // FOR SLAB-B
            this.slabbData = this.UpdateStructElementsData(
              this.slabbData,
              'SLAB-B'
            );

            //if (this.slabbData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.slabbData = this.UpdateMeshPrcData(this.slabbData, 'SLAB-B');
              this.getUpdatedData('SLAB-B', this.slabbData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.slabbData = JSON.parse(
              JSON.stringify(this.slabbData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            // }

            //FOR SLAB-T
            this.slabtData = this.UpdateStructElementsData(
              this.slabtData,
              'SLAB-T'
            );

            // if (this.slabtData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.slabtData = this.UpdateMeshPrcData(this.slabtData, 'SLAB-T');
              this.getUpdatedData('SLAB-T', this.slabtData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.slabtData = JSON.parse(
              JSON.stringify(this.slabtData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            //}

            //FOR D-WALL
            this.DwallData = this.UpdateStructElementsData(
              this.DwallData,
              'DWALL'
            );

            //if (this.DwallData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.DwallData = this.UpdateMeshPrcData(this.DwallData, 'DWALL');
              this.getUpdatedData('DWALL', this.DwallData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.DwallData = JSON.parse(
              JSON.stringify(this.DwallData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            // }

            //FOR PILE
            this.pileData = this.UpdateStructElementsData(
              this.pileData,
              'PILE'
            );

            //if (this.pileData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.pileData = this.UpdateMeshPrcData(this.pileData, 'PILE');
              this.getUpdatedData('PILE', this.pileData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.pileData = JSON.parse(
              JSON.stringify(this.pileData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            // }

            //FOR WALL
            this.wallData = this.UpdateStructElementsData(
              this.wallData,
              'WALL'
            );

            //if (this.wallData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.wallData = this.UpdateMeshPrcData(this.wallData, 'WALL');
              this.getUpdatedData('WALL', this.wallData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.wallData = JSON.parse(
              JSON.stringify(this.wallData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            //}

            //FOR SLAB
            this.slabData = this.UpdateStructElementsData(
              this.slabData,
              'SLAB'
            );
            // if (this.slabData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.slabData = this.UpdateMeshPrcData(this.slabData, 'SLAB');
              // WHEN YOU COME BACK TO ORDER SELECTION FROM ORDER SUMMARY TO ADD, REMOVE OR MAKE ANY CHANGES
              this.getUpdatedData('SLAB', this.slabData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.slabData = JSON.parse(
              JSON.stringify(this.slabData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            // }

            //FOR DRAIN
            this.drainData = this.UpdateStructElementsData(
              this.drainData,
              'DRAIN'
            );
            //if (this.drainData.ProdCode.length > 0) {
            if (this.createSharedService.tempProjectOrderSummaryList) {
              this.drainData = this.UpdateMeshPrcData(this.drainData, 'DRAIN');
              // WHEN YOU COME BACK TO ORDER SELECTION FROM ORDER SUMMARY TO ADD, REMOVE OR MAKE ANY CHANGES
              this.getUpdatedData('DRAIN', this.drainData); //GET UPDATED VALUE FOR SELCTED COULUMN
            }
            this.createSharedService.drainData = JSON.parse(
              JSON.stringify(this.drainData)
            ); //STORE UPDATED VALUE AS DEEP COPY IN A SHARED SERVICE
            //}
          }
        },
        error: (e) => {},
        complete: () => {
          this.loadingData = false; //END THE LOADING ANIMATION WHEN DATA IS COMPLETELTY
        },
      });
  }

  resetStructureElements() {
    this.beamData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.columnData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.slabbData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.slabtData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.DwallData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.pileData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.wallData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.slabData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
    this.drainData = {
      ProdName: [],
      ProdCode: [],
      isSelected: [],
      OrderQty: [],
      OrderWt: [],
    };
  }

  resetTempOrderList() {
    this.nextbuttonClicked = false;
    this.isSelectAllScheduled = false;
    // this.tempOrderSummaryList.pOrderNo
    this.tempOrderSummaryList = {
      pCustomerCode: '',
      pProjectCode: '',
      pSelectedCount: 0,
      pSelectedSE: [],
      pSelectedProd: [],
      pSelectedWT: [],
      pSelectedQty: [],
      pSelectedPostID: [],
      pSelectedScheduled: [],
      pSelectedWBS1: [],
      pSelectedWBS2: [],
      pSelectedWBS3: [],
      pWBS1: '',
      pWBS2: '',
      pWBS3: '',
      pOrderNo: [],
      StructProd: [],
    };
  }

  getUpdatedData(structElement: string, data: any) {
    if (this.createSharedService.tempProjectOrderSummaryList.pSelectedSE) {
      let index =
        this.createSharedService.tempProjectOrderSummaryList.pSelectedSE.findIndex(
          (x: string) => x === structElement
        );

      let prodList: any[] = [];
      if (index != -1) {
        //MEANS THAT THE SELECTED STRUCTURE ELEMENT WAS PREVIOUSLY SELECTED/ADDED TO CART
        let lLength =
          this.createSharedService.tempProjectOrderSummaryList.pSelectedSE
            .length;
        for (let i = 0; i < lLength; i++) {
          let lSelectedStructEle =
            this.createSharedService.tempProjectOrderSummaryList.pSelectedSE[i];
          let lSelectedProd =
            this.createSharedService.tempProjectOrderSummaryList.pSelectedProd[
              i
            ];
          let lOrderQty =
            this.createSharedService.tempProjectOrderSummaryList.pSelectedQty[
              i
            ];
          let lOrderWt =
            this.createSharedService.tempProjectOrderSummaryList.pSelectedWT[i];
          let lPostId =
            this.createSharedService.tempProjectOrderSummaryList
              .pSelectedPostID[i];

          if (lSelectedStructEle == structElement) {
            //FOR EVERY PRODUCT OF THE SELECT STRUCTURE ELEMENT, IF PRESENT, CHECK IN THE GIVEN DATA LIST

            // prodList.push(this.createSharedService.tempProjectOrderSummaryList.pSelectedProd[i]);
            if (lPostId != 0 && lPostId != undefined) {
              let tempindex = data.ProdCode.findIndex(
                // IF PRODUCT CODE MATCHES, SET SELECTED VALUE AS TRUE
                (x: any) => x.includes(lPostId)
              );
              if (tempindex != -1) {
                data.isSelected[tempindex] = true;
                data.OrderQty[tempindex] = lOrderQty;
                data.OrderWt[tempindex] = lOrderWt;

                // Update the scheduled table to auto select the record // -- 07-05-2024 --
                this.UpdateScheduledDataList(
                  structElement,
                  data.ProdCode[tempindex],
                  data.isSelected[tempindex]
                );
              }
            } else {
              let tempindex = data.ProdCode.findIndex(
                // IF PRODUCT CODE MATCHES, SET SELECTED VALUE AS TRUE
                (x: any) => x.toUpperCase() === lSelectedProd.toUpperCase()
              );
              if (tempindex != -1) {
                data.isSelected[tempindex] = true;
                data.OrderQty[tempindex] = lOrderQty;
                data.OrderWt[tempindex] = lOrderWt;
              }
            }
          }
        }
        // for (let i = 0; i < prodList.length; i++) {
        //   let tempindex = data.ProdCode.findIndex(
        //     (x: any) => x === prodList[i]
        //   );
        //   data.isSelected[tempindex] = true;
        // }
      }
    }

    console.log('Updated Data', structElement, data);
  }

  changeDataEntry() {
    let selectStructure = this.projectorderForm.controls['DataEntry'].value;
    this.nextbuttonClicked = false;
    this.beamShow = false;
    this.columnShow = false;
    this.slabShow = false;
    this.slabbShow = false;
    this.slabtShow = false;
    this.DwallShow = false;
    this.pileShow = false;
    this.wallShow = false;
    for (let i = 0; i < selectStructure.length; i++) {
      if (selectStructure[i] == 3) {
        this.beamShow = true;
      } else if (selectStructure[i] == 6) {
        this.columnShow = true;
      } else if (selectStructure[i] == 12) {
        this.slabShow = true;
      } else if (selectStructure[i] == 13) {
        this.slabbShow = true;
      } else if (selectStructure[i] == 14) {
        this.slabtShow = true;
      } else if (selectStructure[i] == 15) {
        this.DwallShow = true;
      } else if (selectStructure[i] == 16) {
        this.pileShow = true;
      } else if (selectStructure[i] == 17) {
        this.wallShow = true;
      }
    }
    this.UpdateTempList(selectStructure);
  }

  UpdateTempList(selectStructure: any) {
    console.log('selectStructure', selectStructure);
    console.log('dataentry', this.DATAENTRY);
    console.log('tempList', this.tempOrderSummaryList);

    let tobeRemoved: any[] = [];

    for (let i = 0; i < this.tempOrderSummaryList.pSelectedSE.length; i++) {
      let lstatusid = this.DATAENTRY.find(
        (element: { status: string }) =>
          element.status.toUpperCase() ==
          this.tempOrderSummaryList.pSelectedSE[i].toUpperCase()
      ).statusId;
      if (!selectStructure.includes(lstatusid)) {
        tobeRemoved.push(this.tempOrderSummaryList.pSelectedSE[i]);
      }
    }

    console.log('tobeRemoved', tobeRemoved);

    for (let i = 0; i < tobeRemoved.length; i++) {
      let index = this.tempOrderSummaryList.pSelectedSE.findIndex(
        (element: string) =>
          element.toUpperCase() == tobeRemoved[i].toUpperCase()
      );

      if (this.tempOrderSummaryList.pSelectedScheduled[index] == 'Y') {
        continue;
      }

      this.tempOrderSummaryList.StructProd.splice(index, 1);
      this.tempOrderSummaryList.pOrderNo.splice(index, 1);
      this.tempOrderSummaryList.pSelectedPostID.splice(index, 1);
      this.tempOrderSummaryList.pSelectedProd.splice(index, 1);
      this.tempOrderSummaryList.pSelectedSE.splice(index, 1);
      this.tempOrderSummaryList.pSelectedScheduled.splice(index, 1);
      this.tempOrderSummaryList.pSelectedWBS1.splice(index, 1);
      this.tempOrderSummaryList.pSelectedWBS2.splice(index, 1);
      this.tempOrderSummaryList.pSelectedWBS3.splice(index, 1);
      this.tempOrderSummaryList.pSelectedWT.splice(index, 1);
      this.tempOrderSummaryList.pSelectedQty.splice(index, 1);

      if (tobeRemoved[i].toUpperCase() == 'BEAM') {
        this.beamData = this.UnSelectValues(this.beamData);
      } else if (tobeRemoved[i].toUpperCase() == 'COLUMN') {
        this.columnData = this.UnSelectValues(this.columnData);
      } else if (tobeRemoved[i].toUpperCase() == 'SLAB-B') {
        this.slabbData = this.UnSelectValues(this.slabbData);
      } else if (tobeRemoved[i].toUpperCase() == 'SLAB-T') {
        this.slabtData = this.UnSelectValues(this.slabtData);
      } else if (tobeRemoved[i].toUpperCase() == 'DWALL') {
        this.DwallData = this.UnSelectValues(this.DwallData);
      } else if (tobeRemoved[i].toUpperCase() == 'PILE') {
        this.pileData = this.UnSelectValues(this.pileData);
      } else if (tobeRemoved[i].toUpperCase() == 'WALL') {
        this.wallData = this.UnSelectValues(this.wallData);
      } else if (tobeRemoved[i].toUpperCase() == 'SLAB') {
        this.slabData = this.UnSelectValues(this.slabData);
      } else if (tobeRemoved[i].toUpperCase() == 'DRAIN') {
        this.drainData = this.UnSelectValues(this.drainData);
      }
    }
  }

  UnSelectValues(data: any) {
    // console.log('selected data -> ', data);
    for (let i = 0; i < data.isSelected.length; i++) {
      data.isSelected[i] = false;
    }
    // console.log('Unselected data -> ', data);
    return data;
  }

  // FUNCTIONS CALLED ON PAGE LOAD ---------------- END ------------------------------------------------

  //FUNCTIONS CALLED FROM USER ACTIONS------------ START -----------------------------------------------

  AddToTempData(
    structElement: string,
    data: any,
    prod_code: any,
    index: any,
    condition: boolean
  ) {
    if (data.isSelected[index]) {
      // IF TRUE, THEN ADD THE PRODUCT TO THE "tempOrderSummaryList"
      let item = this.MeshPRCDataList.find(
        (x) => x.PostHeaderID == prod_code.split('/')[1]
      );

      if (item) {
        this.tempOrderSummaryList.pSelectedSE.push(structElement);
        this.tempOrderSummaryList.pSelectedProd.push(prod_code.split('/')[0]);
        this.tempOrderSummaryList.pSelectedPostID.push(
          prod_code.split('/')[1] ? Number(prod_code.split('/')[1]) : 0
        );
        this.tempOrderSummaryList.pSelectedScheduled.push('Y');

        this.tempOrderSummaryList.pSelectedWBS1.push(item.WBS1);
        this.tempOrderSummaryList.pSelectedWBS2.push(item.WBS2);
        this.tempOrderSummaryList.pSelectedWBS3.push(item.WBS3);
        this.tempOrderSummaryList.StructProd.push(
          structElement + '/' + prod_code
        );

        let lFound = false;
        if (this.createSharedService.tempProjectOrderSummaryList) {
          let lTempData = JSON.parse(
            JSON.stringify(this.createSharedService.tempProjectOrderSummaryList)
          );
          for (let i = 0; i < lTempData.pSelectedScheduled.length; i++) {
            if (lTempData.pOrderNo[i] != 0) {
              // TO CHECK IF THE ORDER NUMBER IS ALREADY USED FOR A STRUCTURE/PRODUCT
              if (
                this.tempOrderSummaryList.pOrderNo.includes(
                  lTempData.pOrderNo[i] || Number(lTempData.pOrderNo[i])
                )
              ) {
              } else {
                this.tempOrderSummaryList.pOrderNo.push(lTempData.pOrderNo[i]);
                lFound = true;
                break;
              }
            }
          }
        }
        if (this.createSharedService.tempOrderSummaryList) {
          let lTempData = JSON.parse(
            JSON.stringify(this.createSharedService.tempOrderSummaryList)
          );
          for (let i = 0; i < lTempData.pSelectedScheduled.length; i++) {
            if (lTempData.pOrderNo[i] != 0) {
              // TO CHECK IF THE ORDER NUMBER IS ALREADY USED FOR A STRUCTURE/PRODUCT
              if (
                this.tempOrderSummaryList.pOrderNo.includes(
                  lTempData.pOrderNo[i] || Number(lTempData.pOrderNo[i])
                )
              ) {
              } else {
                this.tempOrderSummaryList.pOrderNo.push(lTempData.pOrderNo[i]);
                lFound = true;
                break;
              }
            }
          }
        }
        if (lFound == false) {
          this.tempOrderSummaryList.pOrderNo.push(0);
        }
      } else {
        if (this.WBS1 == undefined) {
          this.toastr.error(
            'Invalid WBS1 selected. Please select a WBS1 so that you can continue to extand WBS3 under the selected Block. <br> 请选择一个座号/大牌, 以便在此座号/大牌之下来扩展分部.'
          );
          return;
        }
        if (this.WBS2.length == 0) {
          this.toastr.error(
            'Invalid WBS2 selected. Please select a WBS2 so that you can continue to extand Part under the selected WBS2. <br> 请选择一个楼层, 以便在此楼层之下来扩展分部.'
          );
          return;
        }
        if (this.WBS3.length == 0) {
          if (this.WBS3dropList.includes('')) {
            this.WBS3 = [];
            this.WBS3.push('');
            this.projectorderForm.controls.wbs3.patchValue(this.WBS3);
          } else {
          }
        }
        for (let i = 0; i < this.WBS2.length; i++) {
          for (let j = 0; j < this.WBS3.length; j++) {
            this.tempOrderSummaryList.pSelectedSE.push(structElement);
            this.tempOrderSummaryList.pSelectedProd.push(
              prod_code.split('/')[0]
            );
            this.tempOrderSummaryList.pSelectedPostID.push(
              prod_code.split('/')[1] ? Number(prod_code.split('/')[1]) : 0
            );
            this.tempOrderSummaryList.pSelectedScheduled.push('N');

            this.tempOrderSummaryList.pSelectedWBS1.push(
              this.projectorderForm.controls['wbs1'].value
            );
            this.tempOrderSummaryList.pSelectedWBS2.push(this.WBS2[i]);
            this.tempOrderSummaryList.pSelectedWBS3.push(this.WBS3[j]);
            this.tempOrderSummaryList.StructProd.push(
              structElement + '/' + prod_code
            );

            let lFound = false;
            if (this.createSharedService.tempProjectOrderSummaryList) {
              let lTempData = JSON.parse(
                JSON.stringify(
                  this.createSharedService.tempProjectOrderSummaryList
                )
              );
              for (let i = 0; i < lTempData.pSelectedScheduled.length; i++) {
                if (lTempData.pOrderNo[i] != 0) {
                  if (lTempData.pSelectedQty[i] != 0) {
                    // Implies that Details are already filled agains the Order, so same Struct/Prod pair is required
                    if (
                      lTempData.pSelectedSE[i].toLowerCase() ==
                        structElement.toLowerCase() &&
                      lTempData.pSelectedProd[i].toLowerCase() ==
                        prod_code.toLowerCase()
                    ) {
                      if (
                        this.tempOrderSummaryList.pOrderNo.includes(
                          lTempData.pOrderNo[i] || Number(lTempData.pOrderNo[i])
                        )
                      ) {
                      } else {
                        this.tempOrderSummaryList.pOrderNo.push(
                          lTempData.pOrderNo[i]
                        );
                        lFound = true;
                        break;
                      }
                    }
                  } else {
                    // TO CHECK IF THE ORDER NUMBER IS ALREADY USED FOR A STRUCTURE/PRODUCT
                    if (
                      this.tempOrderSummaryList.pOrderNo.includes(
                        lTempData.pOrderNo[i] || Number(lTempData.pOrderNo[i])
                      )
                    ) {
                    } else {
                      this.tempOrderSummaryList.pOrderNo.push(
                        lTempData.pOrderNo[i]
                      );
                      lFound = true;
                      break;
                    }
                  }
                }
              }
            }
            if (this.createSharedService.tempOrderSummaryList) {
              let lTempData = JSON.parse(
                JSON.stringify(this.createSharedService.tempOrderSummaryList)
              );
              for (let i = 0; i < lTempData.pSelectedScheduled.length; i++) {
                if (lTempData.pOrderNo[i] != 0) {
                  if (lTempData.pSelectedQty[i] != 0) {
                    // Implies that Details are already filled agains the Order, so same Struct/Prod pair is required
                    // if (
                    //   lTempData.pSelectedProd[i].toLowerCase() ==
                    //     prod_code.toLowerCase()
                    // ) {
                    //   if (
                    //     this.tempOrderSummaryList.pOrderNo.includes(
                    //       lTempData.pOrderNo[i] || Number(lTempData.pOrderNo[i])
                    //     )
                    //   ) {
                    //   } else {
                    //     this.tempOrderSummaryList.pOrderNo.push(
                    //       lTempData.pOrderNo[i]
                    //     );
                    //     lFound = true;
                    //     break;
                    //   }
                    // }
                  } else {
                    // TO CHECK IF THE ORDER NUMBER IS ALREADY USED FOR A STRUCTURE/PRODUCT
                    if (
                      this.tempOrderSummaryList.pOrderNo.includes(
                        lTempData.pOrderNo[i] || Number(lTempData.pOrderNo[i])
                      )
                    ) {
                    } else {
                      this.tempOrderSummaryList.pOrderNo.push(
                        lTempData.pOrderNo[i]
                      );
                      lFound = true;
                      break;
                    }
                  }
                }
              }
            }
            if (lFound == false) {
              this.tempOrderSummaryList.pOrderNo.push(0);
            }
          }
        }
      }
    } else {
      // TO REMOVE DATA FROM "tempOrderSummaryList"

      let index = this.tempOrderSummaryList.StructProd.findIndex(
        (x: string) => x === structElement + '/' + prod_code
      );
      while (index != -1) {
        this.tempOrderSummaryList.pSelectedSE.splice(index, 1);
        this.tempOrderSummaryList.pSelectedProd.splice(index, 1);
        this.tempOrderSummaryList.pSelectedPostID.splice(index, 1);
        this.tempOrderSummaryList.pSelectedScheduled.splice(index, 1);
        this.tempOrderSummaryList.pSelectedWBS1.splice(index, 1);
        this.tempOrderSummaryList.pSelectedWBS2.splice(index, 1);
        this.tempOrderSummaryList.pSelectedWBS3.splice(index, 1);
        this.tempOrderSummaryList.StructProd.splice(index, 1);
        this.tempOrderSummaryList.pOrderNo.splice(index, 1);
        this.tempOrderSummaryList.pSelectedQty.splice(index, 1);
        this.tempOrderSummaryList.pSelectedWT.splice(index, 1);

        index = this.tempOrderSummaryList.StructProd.findIndex(
          (x: string) => x === structElement + '/' + prod_code
        );
      }
    }

    console.log('this.tempOrderSummaryList', this.tempOrderSummaryList);
    this.UpdateScheduledDataList(
      structElement,
      data.ProdCode[index],
      condition
    );
  }
  getData() {
    //CREATE A TEMPORARY OBJECT INCLUDING ALL THE VALUES REQUIRED FOR CALLING "ADDTOCART"

    console.log('DATAENTRY', this.DATAENTRY);
    console.log(this.projectorderForm.controls.DataEntry.value);

    // let lvalue = this.projectorderForm.controls.DataEntry.value;
    // for (let i = 0; i < lvalue.length; i++) {
    //   // let lStruct = this.DATAENTRY.find((x: { statusId: any; }) => x.statusId == lvalue[i]).status;

    //   this.DATAENTRY.forEach((element: any) => {
    //     if (lvalue.includes(element.statusId) == false) {
    //       let lStruct = element.status
    //       while (this.tempOrderSummaryList.pSelectedSE.includes(lStruct) || this.tempOrderSummaryList.pSelectedSE.includes(lStruct.toUpperCase())) {
    //         let index = this.tempOrderSummaryList.pSelectedSE.findIndex((x: string) => x.toUpperCase() == lStruct.toUpperCase())

    //         this.tempOrderSummaryList.StructProd.splice(index, 1);
    //         this.tempOrderSummaryList.pOrderNo.splice(index, 1);
    //         this.tempOrderSummaryList.pSelectedPostID.splice(index, 1);
    //         this.tempOrderSummaryList.pSelectedSE.splice(index, 1);
    //         this.tempOrderSummaryList.pSelectedScheduled.splice(index, 1);
    //         this.tempOrderSummaryList.pSelectedWBS1.splice(index, 1);
    //         this.tempOrderSummaryList.pSelectedWBS2.splice(index, 1);
    //         this.tempOrderSummaryList.pSelectedWBS3.splice(index, 1);
    //       }
    //     }
    //   })

    // }

    if (this.tempOrderSummaryList.pSelectedProd.length == 0) {
      //THROWS AN ERROR IF NO PRODUCT IS SELECTED
      return;
    }

    this.tempOrderSummaryList.pSelectedProd.length;
    let tRefNo: any = [];
    this.tempOrderSummaryList.pSelectedSE.forEach((x: any) => {
      tRefNo.push(0);
    });
    console.log('tempOrderSummaryList', this.tempOrderSummaryList);
    let tempObj = {
      pSelectedSE: this.tempOrderSummaryList.pSelectedSE.join(','),
      pSelectedProd: this.tempOrderSummaryList.pSelectedProd
        .join(',')
        .toUpperCase(),
      pSelectedPostID: this.tempOrderSummaryList.pSelectedPostID.join(','),
      pSelectedScheduled:
        this.tempOrderSummaryList.pSelectedScheduled.join(','),
      pSelectedWBS1: this.tempOrderSummaryList.pSelectedWBS1.join(','),
      pSelectedWBS2: this.tempOrderSummaryList.pSelectedWBS2.join(','),
      pSelectedWBS3: this.tempOrderSummaryList.pSelectedWBS3.join(','),
      pCustomerCode: this.CustomerCode,
      pProjectCode: this.ProjectCode,
      pWBS1: this.WBS1,
      pWBS2: this.WBS2.join(','),
      pWBS3: this.WBS3.join(','),
      pOrderNo: this.tempOrderSummaryList.pOrderNo.join(','), //Oreder Number is set after calling AddToCart()
      pRefNo: tRefNo.join(','),
      pSelectedWT: this.tempOrderSummaryList.pSelectedWT.join(','),
      pSelectedQty: this.tempOrderSummaryList.pSelectedQty.join(','),
    };

    // let temppSelectedSE: any[] = [];
    // let temppSelectedProd: any[] = [];
    // let temppSelectedPostID: any[] = [];
    // let temppSelectedScheduled: any[] = [];
    // let temppWBS1: any[] = [];
    // let temppWBS2: any[] = [];
    // let temppWBS3: any[] = [];
    // let temppOrderNo: any[] = [];

    // for (let i = 0; i < this.WBS2.length; i++) {
    //   for (let j = 0; j < this.WBS3.length; j++) {
    //     for (let k = 0; k < this.tempOrderSummaryList.pSelectedSE.length; k++) {
    //       temppSelectedSE.push(this.tempOrderSummaryList.pSelectedSE[k]);
    //       temppSelectedProd.push(this.tempOrderSummaryList.pSelectedProd[k]);
    //       temppWBS1.push(this.tempOrderSummaryList.pSelectedWBS1[0]);
    //       temppWBS2.push(this.WBS2[i]);
    //       temppWBS3.push(this.WBS3[j]);
    //       temppSelectedScheduled.push('N');
    //       temppSelectedPostID.push(
    //         this.tempOrderSummaryList.pSelectedPostID[k]
    //       );
    //       temppOrderNo.push(0);
    //     }
    //   }
    // }

    // tempObj.pSelectedSE = temppSelectedSE.join(',');
    // tempObj.pSelectedProd = temppSelectedProd.join(',');
    // tempObj.pSelectedPostID = temppSelectedPostID.join(',');
    // tempObj.pSelectedScheduled = temppSelectedScheduled.join(',');
    // tempObj.pCustomerCode = this.CustomerCode;
    // tempObj.pProjectCode = this.ProjectCode;
    // tempObj.pWBS1 = this.WBS1;
    // tempObj.pWBS2 = this.WBS2.join(',');
    // tempObj.pWBS3 = this.WBS3.join(',');
    // tempObj.pOrderNo = this.createSharedService.tempOrderList.join(',') ? this.createSharedService.tempOrderList.join(',') : temppOrderNo.join(',');
    // tempObj.pSelectedWBS1 = temppWBS1.join(',');
    // tempObj.pSelectedWBS2 = temppWBS2.join(',');
    // tempObj.pSelectedWBS3 = temppWBS3.join(',');

    // STRORE THE VALUES FOR THE SELECTED WBS AND STRUCTURE ELEMENTS IN A SHARED SERVICE
    let selectedWBS = {
      wbs1: this.projectorderForm.controls['wbs1'].value,
      wbs2: this.projectorderForm.controls['wbs2'].value,
      wbs3: this.projectorderForm.controls['wbs3'].value,
    };
    this.createSharedService.selectedWBS = selectedWBS;
    this.createSharedService.selectedStructElements = this.projectorderForm
      .controls['DataEntry'].value
      ? this.projectorderForm.controls['DataEntry'].value
      : [];

    //STORE THE "tempOrderSummaryList" IN A SHARED SERVICE
    if (this.tempOrderSummaryList) {
      let lDeletedOrders = [];
      let lPreviousOrders =
        this.createSharedService?.tempProjectOrderSummaryList?.pOrderNo;
      if (lPreviousOrders) {
        for (let i = 0; i < lPreviousOrders.length; i++) {
          // If the order number from previously selected orders in not present in the current order,
          // add the order to deleted order list
          if (
            !this.tempOrderSummaryList.pOrderNo.includes(lPreviousOrders[i])
          ) {
            lDeletedOrders.push(lPreviousOrders[i]);
          }
        }
      }
      console.log('lDeletedOrders', lDeletedOrders);
      if (lDeletedOrders) {
        this.DeletedUnselectedOrders(lDeletedOrders);
      }
      this.createSharedService.tempProjectOrderSummaryList = JSON.parse(
        JSON.stringify(this.tempOrderSummaryList)
      );
    }

    //STORE THE NEWLY CREATED OBJECT WITH ALL THE STRUCTURE ELEMENTS AND PRODUCTS WITH CORRECT WBS COMBINATIONS
    window.history.state.tempOrderSummaryList = tempObj;

    if (this.createSharedService.upcomingOrderFlag) {
      this.gotoOrderSummary();
    } else {
      this.sendDataToOrderSummary();
    }

    this.nextbuttonClicked = true;
  }


  sendDataToOrderSummary() {
    // TO RELOAD THE VALUES FOR ORDERSUMMARY PAGE
    this.reloadService.reloadOrderSummaryComponent.emit();
  }

  async gotoOrderSummary() {
    //TRY TO UTILIZE TEMPOBJ
    if (this.tempOrderSummaryList.pSelectedProd.length == 0) {
      //THROWS AN ERROR IF NO PRODUCT IS SELECTED
      this.toastr.error('Please select a Product');
      this.nextbuttonClicked = false;
    } else {
      this.reloadService.reloadCreateOrderTabComponentNONProject.emit();

      localStorage.removeItem('ProcessData');
      sessionStorage.removeItem('ProcessData');
      localStorage.removeItem('ProcessOrderSummaryData');
      sessionStorage.removeItem('ProcessOrderSummaryData');
      // localStorage.removeItem('CreateDataProcess');
      // sessionStorage.removeItem('CreateDataProcess');

      this.ResetOrderReferenceNumber();
      this.ordersummarySharedService.SetOrderSummaryData(undefined);
      this.processsharedserviceService.setOrderSummaryData(undefined);
      this.processsharedserviceService.ProductDetailsEditable = false;
      this.createSharedService.showOrderSummary = true;

      let templist = window.history.state.tempOrderSummaryList;

      let refNo = 0;
      for (let i = 0; i < templist.pSelectedProd.split(',').length; i++) {
        let obj: AddToCart = {
          pCustomerCode: templist.pCustomerCode,
          pProjectCode: templist.pProjectCode,
          pOrderType: 'WBS',
          pOrderNo: templist.pOrderNo.split(',')[i],
          pRefNo: templist.pRefNo.split(',')[i],
          pStructureElement: templist.pSelectedSE.split(',')[i].toUpperCase(),
          pProductType: templist.pSelectedProd.split(',')[i].toUpperCase(),
          pWBS1: templist.pSelectedWBS1.split(',')[i].toUpperCase(),
          pWBS2: templist.pSelectedWBS2.split(',')[i].toUpperCase(),
          pWBS3: templist.pSelectedWBS3.split(',')[i].toUpperCase(),
          pPONo: '0',
          pScheduledProd: templist.pSelectedScheduled
            .split(',')
            [i].toUpperCase(),
          pPostID: Number(templist.pSelectedPostID.split(',')[i].toUpperCase()),
          UpdateBy: this.loginService.GetGroupName(),
          GreenSteel: this.gGreenSteelSelection,
          AddressCode: this.dropdown.getAddressList()[0]
        };

        this.listofOrders.push(obj);
        // this.AddToCart(this.listofOrders[this.currentListOrderIndex]);
        let response = await this.AddToCart_async(obj);

        if (response == false) {
          alert('Connection error, please check your internet connection.');
        } else {
          console.log('ORDER NUMBER', response);
          this.createSharedService.tempOrderList.push(response.OrderNumber);
          this.tempOrderSummaryList.pOrderNo[i] = response.OrderNumber;

          //Update RefNumber
          let lRefNo = templist.pRefNo.split(',');
          if (lRefNo.includes(0 || '0')) {
            for (let i = 0; i < lRefNo.length; i++) {
              lRefNo[i] = response.Refnumber;
            }
            templist.pRefNo = lRefNo.join(',');
          }
        }
      }
      this.createSharedService.viewData = false;

      window.history.state.tempOrderSummaryList.pOrderNo =
        this.tempOrderSummaryList.pOrderNo.join(',');
      this.createSharedService.selectedTab = true;

      this.createSharedService.PrevOrderNumbers =
        this.tempOrderSummaryList.pOrderNo;

      this.createSharedService.currGreenSteelSelection = this.gGreenSteelSelection;

      this.showOrderSummary = true;
      this.structureElementCollapse = true;

      this.SaveProductValues();

      this.currentListOrderIndex = 0;
      this.listofOrders = [];

      /**
       * Set the flag as true for "getDeliveryAddress" function
       */
      sessionStorage.setItem('SetDeliveryAddress_Flag', 'true');
      // If there are any previous NONWBS values remaining;
      this.createSharedService.tempOrderSummaryList = undefined;

      this.pInitialFlag = true;
    }
  }

  async ReloadData() {
    console.log('Old Create Re-opened');
    this.nextbuttonClicked = false;
    if (this.createSharedService.tempProjectOrderSummaryList) {
      this.tempOrderSummaryList = JSON.parse(
        JSON.stringify(this.createSharedService.tempProjectOrderSummaryList)
      );
    }

    await this.GetMeshPRCData();
    this.GetProductListData(this.CustomerCode, this.ProjectCode);


    // reset greensteel value
    this.gGreenSteelSelection =  this.createSharedService.currGreenSteelSelection;
    this.UpdateGreenSteelSelection(this.gGreenSteelSelection);

    // let response = await this.GetProductListData_(this.CustomerCode, this.ProjectCode);
    // console.log('responseProdList', response);

    // if (response.length > 1) {
    //   //MEANING THE SELECTED PROJECT HAVE WBS ASSIGNED TO IT
    // }

    // let obj = this.createSharedService.ProductValues;
    // this.beamData = obj.beamData;
    // this.columnData = obj.columnData;
    // this.slabbData = obj.slabbData;
    // this.slabtData = obj.slabtData;
    // this.DwallData = obj.DwallData;
    // this.pileData = obj.pileData;
    // this.wallData = obj.wallData;
    // this.slabData = obj.slabData;
    // this.drainData = obj.drainData;
  }

  async GetProductListData_(CustomerCode: any, ProjectCode: any): Promise<any> {
    try {
      let UserName = this.loginService.GetGroupName();
      const data = await this.orderService
        .ProductSelect(CustomerCode, ProjectCode, UserName)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  SaveProductValues() {
    let obj = {
      beamData: this.beamData,
      columnData: this.columnData,
      slabbData: this.slabbData,
      slabtData: this.slabtData,
      DwallData: this.DwallData,
      pileData: this.pileData,
      wallData: this.wallData,
      slabData: this.slabData,
      drainData: this.drainData,
    };

    this.createSharedService.ProductValues = obj;
  }

  selectScheduledData(item: any, SelectedVal: any) {
    console.log('ScheduledData', item);

    let selectedStrct = item.StructEle;
    let selectedProdcode =
      item.ProductType.toLowerCase() + '/' + item.PostHeaderID;

    if (selectedStrct == 'BEAM') {
      let index = this.beamData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.beamData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'BEAM',
        this.beamData,
        this.beamData.ProdCode[index],
        index,
        this.beamData.isSelected[index]
      );
    } else if (selectedStrct == 'COLUMN') {
      let index = this.columnData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.columnData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'COLUMN',
        this.columnData,
        this.columnData.ProdCode[index],
        index,
        this.columnData.isSelected[index]
      );
    } else if (selectedStrct == 'SLAB') {
      let index = this.slabData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.slabData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'SLAB',
        this.slabData,
        this.slabData.ProdCode[index],
        index,
        this.slabData.isSelected[index]
      );
    } else if (selectedStrct == 'SLAB-B') {
      let index = this.slabbData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.slabbData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'SLAB-B',
        this.slabbData,
        this.slabbData.ProdCode[index],
        index,
        this.slabbData.isSelected[index]
      );
    } else if (selectedStrct == 'SLAB-T') {
      let index = this.slabtData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.slabtData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'SLAB-T',
        this.slabtData,
        this.slabtData.ProdCode[index],
        index,
        this.slabtData.isSelected[index]
      );
    } else if (selectedStrct == 'WALL') {
      let index = this.wallData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.wallData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'WALL',
        this.wallData,
        this.wallData.ProdCode[index],
        index,
        this.wallData.isSelected[index]
      );
    } else if (selectedStrct == 'DWALL') {
      let index = this.DwallData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.DwallData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'DWALL',
        this.DwallData,
        this.DwallData.ProdCode[index],
        index,
        this.DwallData.isSelected[index]
      );
    } else if (selectedStrct == 'PILE') {
      let index = this.pileData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.pileData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'PILE',
        this.pileData,
        this.pileData.ProdCode[index],
        index,
        this.pileData.isSelected[index]
      );
    } else if (selectedStrct == 'DRAIN') {
      let index = this.drainData.ProdCode.findIndex(
        (x: any) => x == selectedProdcode
      );
      this.drainData.isSelected[index] = SelectedVal;
      this.AddToTempData(
        'DRAIN',
        this.drainData,
        this.drainData.ProdCode[index],
        index,
        this.drainData.isSelected[index]
      );
    }
  }

  UpdateScheduledDataList(structure: any, productcode: any, selected: boolean) {
    let postheadedid = productcode.split('/')[1];
    let index = this.MeshPRCDataList.findIndex(
      (x) => x.PostHeaderID == postheadedid
    );
    if (index != -1) {
      this.MeshPRCDataList[index].isSelected = selected;
    }

    /**Keep track of the select All Flag */
    this.updateSelectAllFlag(this.MeshPRCDataList);
  }

  updateSelectAllFlag(lDataList: any) {
    /** Function updates the Select ALl flag for Scheduled Data list based on the selected number of items. */
    let lReturn = true;
    for (let i = 0; i < lDataList.length; i++) {
      let lItem = lDataList[i];
      if (!lItem.isSelected) {
        lReturn = false;
        break;
      }
    }
    this.isSelectAllScheduled = lReturn ? true : false;
  }

  HideStructures() {
    // let lSelectStruct = this.projectorderForm.controls.DataEntry.value;
    // if (lSelectStruct != undefined && lSelectStruct.length > 0) {
    this.beamShow = false;
    this.columnShow = false;
    this.slabShow = false;
    this.slabbShow = false;
    this.slabtShow = false;
    this.DwallShow = false;
    this.pileShow = false;
    this.wallShow = false;
    // }
  }

  CheckafterSubmit() {
    if (
      this.createSharedService.tempOrderSummaryList == undefined &&
      this.createSharedService.tempProjectOrderSummaryList == undefined &&
      window.history.state.tempOrderSummaryList == undefined
    ) {
      console.log('Clear All Data');

      this.projectorderForm.reset();
      this.showOrderSummary = false;
      this.structureElementCollapse = false;
      this.HideStructures();
    }
  }

  showProduct(product: any) {
    if (product.includes('/')) {
      return false;
    }
    return true;
  }

  // UpdateData() {
  //   this.tempOrderSummaryList =
  //     this.createSharedService.tempProjectOrderSummaryList;
  // }

  checkInputDisable(StructEleData: any, index: any) {
    let lOrderQty: any[] = StructEleData.OrderQty;
    let lOrderWt: any[] = StructEleData.OrderWt;

    let lReturn: boolean = false;

    if (lOrderQty != undefined && lOrderWt != undefined) {
      if (lOrderQty[index] != 0) {
        lReturn = true;
      }
    }

    return lReturn;
  }

  selectAllScheduledData(pValue: boolean) {
    for (let i = 0; i < this.MeshPRCDataList.length; i++) {
      let sItem = this.MeshPRCDataList[i];
      if (sItem.isSelected) {
        if (pValue == false) {
          sItem.isSelected = pValue;
          this.selectScheduledData(sItem, sItem.isSelected);
        }
      } else {
        if (pValue == true) {
          sItem.isSelected = pValue;
          this.selectScheduledData(sItem, sItem.isSelected);
        }
      }
    }
  }
  unselectScheduledData(pValue: boolean) {
    if (pValue == false) {
      this.isSelectAllScheduled = false;
    }
  }

  UpdateDataEntry() {
    setTimeout(() => {
      console.log('Change event triggered');
      if (this.initiateStructureRemoval) {
        this.changeDataEntry();
      }

      this.initiateStructureRemoval = true;
    }, 0); // Ensure this executes after remove
  }

  initiateStructureRemoval: boolean = true;
  RemoveStructure(pEvent: any) {
    console.log('Structure Element removed!!', pEvent);
    // If a structure is to be removed, check if the structure to eb removed has any product selected with details filled.
    // If yes, then do not remove the structure, instead show a confirmation message to the user.

    // Every Structure can be removed, unless the user has explicitly selected not to.
    this.initiateStructureRemoval = true;

    // Check if structurt has any product selected with details filled.
    if (this.CheckStrutureForDetailiedProduct(pEvent.label, pEvent.value)) {
      // if (!confirm('Are you sure you want to remove the selected structure?')) {
      this.initiateStructureRemoval = false;
      alert(
        'The currently selected structure has product(s) selected with details filled, so remove the details before removing the structure'
      );
      // Add the structure that was selected to be removed from the list.
      let lStructControl = this.projectorderForm.controls['DataEntry'];
      lStructControl.setValue([...lStructControl.value, pEvent.value]);
      // } else {
      //   // Remove the data, clear the selection restriction of the Product.
      //   this.RemoveDataofStructure(pEvent.label);
      // }
    }
  }

  // RemoveDataofStructure(pStructureName: string) {
  //   // Remove spaces and convert to Uppercase string
  //   pStructureName = pStructureName?.toUpperCase().trim();

  //   let lStructEleData = this.GetStructDataList(pStructureName);
  //   let lOrderQty: any = lStructEleData?.OrderQty;
  //   let lOrderWt: any = lStructEleData?.OrderWt;

  //   for (let i = 0; i < lOrderQty.length; i++) {
  //     lOrderQty[i] = 0;
  //     lOrderWt[i] = 0;
  //   }
  // }

  CheckStrutureForDetailiedProduct(pStructureName: string, pStatusId: any) {
    // Remove spaces and convert to Uppercase string
    pStructureName = pStructureName?.toUpperCase().trim();

    // Get the values of the selected structure, and their associated weight and Quantity.
    let lSelectedStructElement = this.tempOrderSummaryList.pSelectedSE;
    let lSelectedQty = this.tempOrderSummaryList.pSelectedQty;
    let lSelectedWT = this.tempOrderSummaryList.pSelectedWT;

    for (let i = 0; i < lSelectedStructElement.length; i++) {
      if (lSelectedStructElement[i] == pStructureName) {
        if (
          (lSelectedQty[i] != 0 &&
            lSelectedQty[i] != undefined &&
            lSelectedQty[i] != null) ||
          (lSelectedWT[i] != 0 &&
            lSelectedWT[i] != undefined &&
            lSelectedWT[i] != null)
        ) {
          // The current structure has Products with details associated with it.
          return true;
        }
      }
    }
    return false;
  }

  openDropdownStructureElement() {
    if (this.dataEntrySelect) {
      this.dataEntrySelect.open();
    }
  }

  DeletedUnselectedOrders(pOrderNos: any) {
    // Call the API to remove unselected orders.
    // DELETING RECORD FROM DB
    for (let i = 0; i < pOrderNos.length; i++) {
      let customer = this.CustomerCode;
      let project = this.ProjectCode;
      let order = pOrderNos[i];
      let UpdateBy = this.loginService.GetGroupName();
      this.orderService
        .ChangeStatus(customer, project, order, 'Delete', UpdateBy)
        .subscribe({
          next: (response) => {
            // this.toastr.error('Order Deleted Succesfully');
          },
          error: (e) => {},
          complete: () => {},
        });
    }
  }

  /**
   * New Enhancement to set unused ordernumber's refence as NULL
   */
  ResetOrderReferenceNumber() {
    let lPrevOrders = this.createSharedService.PrevOrderNumbers;
    let lTempList = this.tempOrderSummaryList?.pOrderNo;

    if (lPrevOrders) {
      let difference = lPrevOrders.filter((x: any) => !lTempList.includes(x));
      this.ResetRefNo(difference);
    }
  }

  ResetRefNo(pOrderList: any) {
    this.orderService.ResetOrderRefNo(pOrderList).subscribe({
      next: (response) => {
        // this.toastr.error('Order Deleted Succesfully');
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  /**
   * New Enhancement for Green-Steel
   */
  gGreenSteelSelection: boolean = false;
  UpdateGreenSteel() {}
  disableGreenSteelToggle(): boolean {
    try {
      // Check if the data has any value
      if(this.DisableGreenSteelSelection()){
        return true;
      }
      if (
        Number(this.GreenSteelCarbonValue == 0) ||
        Number(this.GreenSteelCarbonValue == 100)
      ) {
        return true;
      }
      return this.disableCreateOrder;
    } catch (error) {
      return this.disableCreateOrder;
    }
  }
  greenSteelToolTip(): string {
    return 'Green-Steel';
  }

  GreenSteelCarbonValue: any = 0;
  async GetProductGreenSteelValue() {
    let lObj = {
      CustomerCode: this.CustomerCode,
      ProjectCode: this.ProjectCode,
      Product: '',
    };
    const data = await this.orderService
      .GetProductGreenSteelValue(lObj)
      .toPromise();
    if (data) {
      if (data?.LowCarbonRate) {
        this.GreenSteelCarbonValue = data.LowCarbonRate;

        // Update Default selection of Green type
        if (Number(data.LowCarbonRate) == 0) {
          this.gGreenSteelSelection = false;
          this.selectedGreenOption = 'Non-Green';
        }
        if (Number(data.LowCarbonRate) == 100) {
          this.gGreenSteelSelection = true;
          this.selectedGreenOption = 'Green';
        }
      }
    }
  }

  onNextClick() {
    this.nextbuttonClicked = true;


    //  Step 1: Now call your functions
    this.getData();
    //  Step 2: Check dropdown selection first
    if (!this.selectedGreenOption) {
      this.toastr.error('Please select a Greensteel type before proceeding.');
      this.nextbuttonClicked = false; // re-enable button for correction
      return; // stop execution here
    }
    this.gotoOrderSummary();

    // Optional success toast
  // this.toastr.success('Greensteel type selected successfully.');
  }

  GreenSteelSelection(){
    if(this.selectedGreenOption=="Green"){
      this.gGreenSteelSelection = true;
    }
    else{
      this.gGreenSteelSelection = false;
    }
  }

  UpdateGreenSteelSelection(pValue: boolean) {
    if (pValue) {
      this.selectedGreenOption = 'Green';
    } else{
      this.selectedGreenOption = 'Non-Green';
    }
  }

  DisableGreenSteelSelection () {
    let lValue = this.createSharedService.greenSteelSelection_lock;
    return lValue ? true : false;
  }

  greenSteelSelectToolTip() {
    let lValue = this.createSharedService.greenSteelSelection_lock;
    if(lValue) {
      return 'Remove all selected products to change Steel Type.'
    }
    return '';
  }
}
