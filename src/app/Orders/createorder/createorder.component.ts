import { ChangeDetectorRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { OrderService } from '../orders.service';
import { ActiveOrderArray } from 'src/app/Model/activeorderarray';
import * as XLSX from 'xlsx'
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CreateordersharedserviceService } from './createorderSharedservice/createordersharedservice.service';
import { BarDetailsInfoComponent } from './orderdetails/bar-details-info/bar-details-info.component';
import { LoginService } from 'src/app/services/login.service';
import { TrackStatusComponent } from '../activeorder/track-status/track-status.component';
import { UpdatingBbsComponent } from './orderdetails/updating-bbs-remark/updating-bbs/updating-bbs.component';
import { AlertBoxComponent } from './orderdetails/alert-box/alert-box.component';
import { ListOfShapesESpliceComponent } from './orderdetails/list-of-shapes-esplice/list-of-shapes-esplice.component';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { ListOfShapesNSpliceComponent } from './orderdetails/list-of-shapes-nsplice/list-of-shapes-nsplice.component';



@Component({
  selector: 'app-createorder',
  templateUrl: './createorder.component.html',
  styleUrls: ['./createorder.component.css']
})
export class createorderComponent implements OnInit {

  createOrderForm!: FormGroup;
  ReqdateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  PlanDelidateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  POdateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  CustomerList: any = [];

  istoggel: boolean = false;
  ProjectCode: any = undefined;
  hideTable: boolean = true;
  loadingData = false;
  // activeorderarray: ActiveOrderArray[] = [];
  // activeorderarray_backup: ActiveOrderArray[] = [];
  isExpand: boolean = false;
  toggleFilters = false;
  ProjectList: any[] = [];
  iscapping: boolean = false;
  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;

  name: string = '';
  editColumn: boolean = false;

  OrderNumber: any;
  PONumber: any;
  RequiredDate: any;
  WBS1: any;
  WBS2: any;
  WBS3: any;
  ProductType: any;
  StructureElement: any;
  BBSNo: any;
  BBSDesc: any;
  PODate: any;
  Tonnage: any;
  SubmittedBy: any;
  CreatedBy: any;
  ProjectTitle: any;
  OrderStatus: any;

  StartReqDate: any = null;
  EndReqDate: any = null;

  StartPlanDate: any = null;
  EndPlanDate: any = null;

  StartPODate: any = null;
  EndPODate: any = null;

  disablewithdraw: boolean = true
  disablesubmit: boolean = true

  showSNo: boolean = true;
  showPonumber: boolean = true;
  showReqDate: boolean = true;
  showPlanDeliDate: boolean = true;
  showWBS1: boolean = true;
  showWBS2: boolean = true;
  showWBS3: boolean = true;
  showProductType: boolean = true;
  showStructureElement: boolean = true;
  showBBSNo: boolean = true;
  showBBSDesc: boolean = true;
  showPODate: boolean = false;
  showTonnage: boolean = true;
  showSubmittedBy: boolean = false;
  showCreatedBy: boolean = false;
  showProjectTitle: boolean = false;
  showOrderStatus: boolean = true;

  totalCount: number = 0;
  CABtotalWeight: string = '0';
  MESHtotalWeight: string = '0';
  COREtotalWeight: string = '0';
  PREtotalWeight: string = '0';

  projectSelect: boolean = true;
  nonprojectSelect: boolean = false;

  ActiveOrderLoading: boolean = false;

  openTabs: boolean = false;


  constructor(private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private createSharedService: CreateordersharedserviceService,
    private loginService: LoginService,
    private ordersummarySharedService: OrderSummarySharedServiceService,private commonService: CommonService,) {

    this.createOrderForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      wbs1: new FormControl('', Validators.required),
      wbs2: new FormControl('', Validators.required),
      wbs3: new FormControl('', Validators.required),
      po: new FormControl('', Validators.required),
      podate: new FormControl('', Validators.required),
      requireddate: new FormControl('', Validators.required),
      isinclude: new FormControl('', Validators.required),

    });


  }

  ngOnInit() {

    debugger
    this.commonService.changeTitle('Create Orders | ODOS');
    this.reloadService.reloadCustomer$.subscribe((data) => {
    this.createOrderForm.controls['customer'].patchValue(this.dropdown.getCustomerCode());
    // this.GetOrderCustomer();
    this.ProjectList = [];
    this.ProjectCode = "";
    this.createOrderForm.controls['project'].patchValue(this.ProjectCode);

    // this.createSharedService.tempOrderSummaryList = []
    // this.GetOrderProjectsList(this.createOrderForm.controls['customer'].value);

    });

    this.reloadService.reloadCustomerList$.subscribe((data) => {
      // let lTitle = this.commonService.GetTitle();
      if (this.loginService.customerList_Ordering) {
        this.CustomerList = this.loginService.customerList_Ordering;
      }
    });

    this.reloadService.reloadProjectList$.subscribe((data) => {
      // let lTitle = this.commonService.GetTitle();
      if (this.loginService.projectList_Ordering) {
        this.ProjectList = this.loginService.projectList_Ordering;
      }
    });

    this.reloadService.reload$.subscribe((data) => {
      console.log("yes yes yes", data)
      if (true) {
        this.createOrderForm.controls['customer'].patchValue(this.dropdown.getCustomerCode());
        let lProjectCode = this.dropdown.getProjectCode();
        this.ProjectCode = lProjectCode[0];
        this.createOrderForm.controls['project'].patchValue(this.ProjectCode);

        // this.createSharedService.tempOrderSummaryList = []

        this.openTabs = true
        this.Loaddata();
      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectCode);
    });

    this.reloadService.reloadAddressList$.subscribe((data) => {
      if (this.loginService.addressList_Ordering) {
        this.AddressList = this.loginService.addressList_Ordering;
      }
    });

    this.reloadService.reloadAddressCodeMobile$.subscribe((data) => {
      let lAddressCode = this.dropdown.getAddressList(); // Refresh the selected Customer Code.
      this.SelectedAddressCode = lAddressCode ? lAddressCode[0] : '';
      this.createOrderForm.controls['address'].patchValue(this.SelectedAddressCode);
    });

    this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    //console.log(this.loadingData)

    if (this.loginService.customerList_Ordering) {
      this.CustomerList = this.loginService.customerList_Ordering;
    }
    if (this.loginService.projectList_Ordering) {
      this.ProjectList = this.loginService.projectList_Ordering;
    }
    if (this.loginService.addressList_Ordering) {
      this.AddressList = this.loginService.addressList_Ordering;
    }


    this.createOrderForm.controls['customer'].patchValue(this.dropdown.getCustomerCode());
    let lProjectCode = this.dropdown.getProjectCode();
    this.ProjectCode = lProjectCode[0];
    this.createOrderForm.controls['project'].patchValue(this.ProjectCode);
    let lAddressCode = this.dropdown.getAddressList();
    this.SelectedAddressCode = lAddressCode[0];
    if (this.SelectedAddressCode) {
      this.createOrderForm.controls['address'].patchValue(
        this.SelectedAddressCode
      );
    }

    this.Loaddata();
    // this.GetOrderCustomer();

  }
  Loaddata() {
    // this.GetOrderCustomer();
    // this.GetOrderProjectsList(this.createOrderForm.controls['customer'].value);
    this.GetProductListData(this.createOrderForm.controls['customer'].value, this.ProjectCode)
  }

  showDetails(item: any) {
    this.isExpand = true
  }
  public onItemSelect(item: any) {
    //console.log(item.item_text);
    // //console.log(e.target.value);
    // //console.log(this.createOrderForm)

    //  let projecttName =e.target.value  
    this.createOrderForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() { return this.createOrderForm.controls; }

  onSubmit() {
    // //console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.createOrderForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));


  }

  onReset() {
    this.submitted = false;
    this.hideTable = true
    this.createOrderForm.reset();
  }



  changecustomer(event: any) {
    //console.log(event);
    // this.GetOrderProjectsList(event)
    let lCustomerCode = event;
    this.dropdown.setCustomerCode(lCustomerCode);
    // Refresh the Value of CustomerCode in SideMenu;
    this.reloadService.reloadCustomerSideMenu.emit();
  
    this.ProjectCode = ''; // Auto clear the selected project on customer change.
    this.changeproject([]);

  }
  reloadPage() {
    window.location.reload();
  }
  changeproject(event: any) {
    if (event == undefined || event.length == 0) {
      // this.activeorderarray = [];
      this.hideTable = true;
      this.SelectedAddressCode = "";
      this.dropdown.setProjectCode([]);
      this.reloadService.reloadProjectSideMenu.emit();
      return;
    }
    console.log(event)
    this.hideTable = false
    this.dropdown.setProjectCode([this.ProjectCode]);
    this.reloadService.reloadProjectSideMenu.emit();

    // this.GetProductListData(this.createOrderForm.controls['customer'].value, event);
    // this.GetOrderGridList(this.createOrderForm.controls['customer'].value, event)
    // this.reloadPage();
  }

  getTodayDate(): string {
    let currentDate: Date
    currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = this.padNumber(currentDate.getMonth() + 1);
    const day = this.padNumber(currentDate.getDate());
    return `${year}${month}${day}`;
  }
  getTomorrowDate(): string {

    let currentDate: Date
    currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = this.padNumber(tomorrow.getMonth() + 1);
    const day = this.padNumber(tomorrow.getDate());

    return `${year}${month}${day}`;
  }
  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  getDate(date: any) {
    if (date == '') {
      return ''
    }
    date = date.split('/')
    date.unshift(date.pop())
    for (let i = 0; i < date.length; i++) {
      if (date[i] <= 9) {
        date[i] = '0' + date[i]
      }
    }
    date = date.join('')
    return date
  }


  Copy(item: any) {
    item = JSON.stringify(item, null, 2);
    console.log(item)
    this.clipboard.copy(item);
    this.toastr.success('Copied')
  }

  Submit() { }

  Withdraw() { }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }

  GetProductListData(pCustomerCode: any, pProjectCode: any) {
    if (pProjectCode != undefined) {
      let UserName = this.loginService.GetGroupName();
      this.orderService.ProductSelect(pCustomerCode, pProjectCode, UserName).subscribe({
        next: (response) => {
          if (response.length == 1 && response[0].SECode == 'NONWBS') {
            // this.nonprojectSelect = true;
            this.projectSelect = false;
            // this.router.navigateByUrl(createorderComponent, { skipLocationChange: true }).then(() => {
            //   this.router.navigate([ProjectComponent]);
            // }); 
          }
          else {
            this.projectSelect = true;
            // this.nonprojectSelect = false;
          }

          if (this.createSharedService.tempOrderSummaryList || this.createSharedService.tempProjectOrderSummaryList) {
            // if (this.createSharedService.tempOrderSummaryList.length != 0) {
            this.projectSelect = this.createSharedService.selectedTab
            // }
          }

          let lProcessItem: any = this.ordersummarySharedService.GetOrderSummaryData();
          // let lProcessItem: any = localStorage.getItem('CreateDataProcess');
          // lProcessItem = JSON.parse(lProcessItem);
          if (lProcessItem) {
            if (lProcessItem.pSelectedSE.includes('NONWBS') || lProcessItem.pSelectedSE.includes('nonwbs')) {
              this.projectSelect = false;
            }
          }
        },
        error: (e) => {
        },
        complete: () => {
          // this.loading = false;

        },
      });
    }
  }

  OpenTest() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      ListOfShapesNSpliceComponent,
      ngbModalOptions
    );
  }
  ResetOrderSummary() {
    // this.createSharedService.tempOrderSummaryList = undefined
    // this.createSharedService.tempProjectOrderSummaryList = undefined
    // window.history.state.tempOrderSummaryList = undefined
    // this.reloadService.reloadCreateOrderTabComponent.emit();
  }

  ngOnDestroy() {
    // localStorage.removeItem('CreateDataProcess');
    // sessionStorage.removeItem('CreateDataProcess');
    this.ordersummarySharedService.SetOrderSummaryData(undefined);
  }

  ngAfterViewInit() {
    const element = document.getElementById('Project-tab-link');
    console.log('this.tab1.nativeElement=>', element);
    element?.addEventListener('click', () => this.ResetOrderSummary());
    const element1 = document.getElementById('NonProject-tab-link');
    console.log('this.tab1.nativeElement=>', element1);
    element1?.addEventListener('click', () => this.ResetOrderSummary());
    // console.log("this.tab1.nativeElement=>",this.tab1.nativeElement);
    // this.tab1.nativeElement.addEventListener('click', () => this.openSearch());

  }



  //RegionStart: Tab Switch Validations.

  disableProjectTab: boolean = false;
  disableNonProjectTab:boolean=false;

  check_NonProjectOrders(): boolean {
    // Check if the currently selected order from NON-Project tab has some quantity selected.
    // If yes, then restrict the user to change tabs.
    let lCreatedOrders = this.createSharedService.tempOrderSummaryList;
    if (lCreatedOrders) {
      if (lCreatedOrders.length != 0) {
        let lSelectedQtys = lCreatedOrders.pSelectedQty;
        for (let i = 0; i < lSelectedQtys.length; i++) {
          // If any of the selected Product has quantity then disable tab switch.
          if (lSelectedQtys[i] != 0 && lSelectedQtys[i] != undefined) {
            this.disableProjectTab = true;
            return true;
          }
        }
      }
    }
    this.disableProjectTab = false;
    return false; // if all the conditions are false, then return false.
  }

  show_AlertMessage(): void {
    if (this.disableProjectTab) {
      alert('Please remove the quatity of the selected Products');
    }
  }

  //RegionEnd: Tab Switch Validations.
  check_ProjectOrders(){
    // Check if the currently selected order from NON-Project tab has some quantity selected.
    // If yes, then restrict the user to change tabs.

    let lCreatedOrders = this.createSharedService.tempProjectOrderSummaryList;

    if (lCreatedOrders) {
      if (lCreatedOrders.length != 0) {
        let lSelectedQtys = lCreatedOrders.pSelectedQty;
        let lSelectedScheduled = lCreatedOrders.pSelectedScheduled;
        for (let i = 0; i < lSelectedQtys.length; i++) {

          // If any of the selected Product has quantity then disable tab switch.
          // if (lSelectedQtys[i] != 0 && lSelectedQtys[i] != undefined && lSelectedScheduled[i] == 'N') {
            if (lSelectedQtys[i] != 0 && lSelectedQtys[i] != undefined) {
            this.disableNonProjectTab = true;
            return true;
          }
        }
      }
    }
    this.disableNonProjectTab = false;
    return false; // if all the conditions are false, then return false.
  }
  show_AlertMessage_NONProject(): void {
    if (this.disableNonProjectTab) {
      alert('Please remove the quantity of the selected Products');
    }
  }

  ShowOrderingPage() : boolean {
    let clickCreateOrder_Flag = this.dropdown.selectCreateOrder_Flag;
    if (clickCreateOrder_Flag == true || clickCreateOrder_Flag == undefined) {
      let lAddresList = this.dropdown.getAddressList();
      if (!lAddresList) {
        return false;
      }
      if (this.ProjectCode != undefined && this.ProjectCode != '' && lAddresList.length > 0) {
        return true;
      }
    }
    else{ 
      if (this.ProjectCode != undefined && this.ProjectCode != '') {
        return true;
      }
    }
    return false;
  }

  // ------------------ADDRESS CODE----------------------- //
  AddressList: any[] = [];
  SelectedAddressCode: string = "";

  changeAddress(event: any) {
    console.log('SelectedAddressCode', this.SelectedAddressCode);
    // Refresh the AddressCode in SideMenu;
    this.dropdown.setAddressList([this.SelectedAddressCode]);
    this.reloadService.reloadAddressSideMenuEmitter.emit();
  }
}



