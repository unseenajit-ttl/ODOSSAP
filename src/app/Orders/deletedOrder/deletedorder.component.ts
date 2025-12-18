import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
//import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { OrderService } from '../orders.service';
import { DeleteOrderArray } from 'src/app/Model/deleteorderarray';
import * as XLSX from 'xlsx';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CreateordersharedserviceService } from '../createorder/createorderSharedservice/createordersharedservice.service';
import { LoginService } from 'src/app/services/login.service';
import moment, { Moment } from 'moment';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ProcessSharedServiceService } from '../process-order/SharedService/process-shared-service.service';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { OrderSummarySharedServiceService } from '../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subject, from, concatMap, tap, finalize, Observable, catchError, defer, mapTo, of } from 'rxjs';

interface HeaderColumn {
  isVisible: boolean;
  controlName: string;
  displayName: string;
  chineseDisplayName: string;
  field: string;
  colName: string;
  placeholder: string;
  width: string;
  resizeWidth: any;
  left: string;
}
@Component({
  selector: 'app-deletedorder',
  templateUrl: './deletedorder.component.html',
  styleUrls: ['./deletedorder.component.css'],
})
export class DeletedorderComponent implements OnInit {
  // @Input() reloadRequest: any;
  // private reloadSubscription: Subscription;
  defaultFrom = new Date();
  defaultTo = new Date();
  deletedorderForm!: FormGroup;
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  CustomerList: any = [];
  hideTable: boolean = true;
  istoggel: boolean = false;
  isMobile = window.innerWidth;
  itemsPerPage: number = 10;
  totalCount: number = 0;
  ProjectList: any = [];
  loadingData = false;
  deleteorderarray: any[] = [];
  deleteorderarray_Backup: DeleteOrderArray[] = [];
  isExpand: boolean = false;
  toggleFilters = true;
  SelectedProjectCodes: any;
  DeleteOrderLoading: boolean = false;
  page = 1;
  pageSize = 0;
  currentPage = 1;
  editColumn: boolean = false;
  disable: boolean = true;

  Sno: any;
  WBS1: any;
  WBS2: any;
  WBS3: any;
  StructureEle: any;
  ProductType: any;
  PONo: any;
  projecttitle: any;
  DateCreated: any;
  ReqDate: any;
  Tonnage: any;
  StartUpdateDate: any = null;
  EndUpdateDate: any = null;
  StartReqDate: any = null;
  EndReqDate: any = null;
  name: string = '';

  showOrderNo: boolean = true;
  showWBS1: boolean = true;
  showWBS2: boolean = true;
  showWBS3: boolean = true;
  showProductType: boolean = true;
  showStructureElement: boolean = true;
  showPONo: boolean = true;
  showCreateDate: boolean = true;
  showPODate: boolean = true;
  showOrderWeight: boolean = true;
  showReqDate: boolean = true;
  showSelect: boolean = true;

  currRecoverIndex: any;
  isAscending: boolean = false;

  currentSortingColumn: string = '';
  searchForm: FormGroup;
  deletedColumns: HeaderColumn[] = [];
  fixedColumn: number = 0;
  deletedOrderString = 'Total Deleted Order';

  UpdatedateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  ReqdateRange = new FormGroup({
    start1: new FormControl(),
    end1: new FormControl(),
  });
  isDatePicker: boolean = false;
  minDate: any;
  maxDate: any;
  //start
  @ViewChild('dp') private datePicker!: NgbInputDatepicker;
  @ViewChild('scrollViewport', { static: false })
  public viewPort: CdkVirtualScrollViewport | undefined;
  
  from!: any;
  to!: any;
  placeholder = 'starting today';
  hoveredDate!: any;
  isOpen = false;
  right: number = 170;
  top: number = 173;
  dateInputName: string = '';
  clearInput: number = 0;
  selectedRowIndex: any;
  lastPress: string="";
  lastSelctedRow: any;
  firstSelectedRow: number=0;

  //end
  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private processsharedserviceService: ProcessSharedServiceService,
    private createSharedService: CreateordersharedserviceService,
    private loginService: LoginService,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private commonService: CommonService
  ) {
    this.minDate = moment('01/01/2001').utc();
    this.maxDate = moment();
    this.deletedorderForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      wbs1: new FormControl('', Validators.required),
      wbs2: new FormControl('', Validators.required),
      wbs3: new FormControl('', Validators.required),
      po: new FormControl('', Validators.required),
      podate: new FormControl('', Validators.required),
      deliverydate: new FormControl('', Validators.required),
      requireddate: new FormControl('', Validators.required),
      isinclude: new FormControl('', Validators.required),
    });
    this.searchForm = this.formBuilder.group({
      OrderNo: [''],
      PONo: [''],
      WBS1: [''],
      WBS2: [''],
      WBS3: [''],
      ProdType: [''],
      StructureElement: [''],
      dateRangeCreated: [''],
      dateRangeRequired: [''],
      OrderWeight: [''],
      ProjectTitle: [''],
    });

    this.deleteOrderQueue$
    .pipe(concatMap(req => this.executeDeleteGridList(req.customer, req.projects)))
    .subscribe();
  }

  ngOnInit() {
    //debugger;
    this.commonService.changeTitle('Delete Orders | ODOS');

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


    // For refreshing the value of Customer Code.
    this.reloadService.reloadCustomer$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      
      // this.CustomerCode = lCustomerCode;
      this.deletedorderForm.controls['customer'].patchValue(lCustomerCode );
      this.ProjectList = []; // When the Customer Code changes, auto clear the project list.
      this.SelectedProjectCodes = []; // When the Customer Code changes, auto clear the selected projectcodes.
      this.deletedorderForm.controls['project'].patchValue(this.SelectedProjectCodes); // SelectedProjectCodes value updated in the form.
      this.deleteorderarray = []; // Table data is also cleared on customer change.
    });

    this.reloadService.reload$.subscribe((data) => {
      let lCustomerCode = this.dropdown.getCustomerCode(); // Refresh the selected Customer Code.
      // this.CustomerCode = lCustomerCode;
      this.deletedorderForm.controls['customer'].patchValue(lCustomerCode );

      let lProjectCodes = this.dropdown.getProjectCode();  // Refresh the selected Project Codes.
      this.SelectedProjectCodes = lProjectCodes;
      this.deletedorderForm.controls['project'].patchValue(lProjectCodes);

      if (data === 'Deleted Orders') {
        this.Loaddata(); // Refresh the Table Data based on the selected Customer & Project Codes.
      }
    });

    this.reloadService.reloadAddressList$.subscribe((data) => {
      if (this.loginService.addressList_Ordering) {
        this.AddressList = this.loginService.addressList_Ordering;
      }
    });

    this.reloadService.reloadAddressCodeMobile$.subscribe((data) => {
      let lAddressCode = this.dropdown.getAddressList(); // Refresh the selected Customer Code.
      this.SelectedAddressCode = lAddressCode;
      this.deletedorderForm.controls['address'].patchValue(lAddressCode);
    });

    if (localStorage.getItem('deleteFixedColumns')) {
      this.fixedColumn = JSON.parse(
        localStorage.getItem('deleteFixedColumns')!
      );
    }
    if (localStorage.getItem('deletedColumns')) {
      this.deletedColumns = JSON.parse(localStorage.getItem('deletedColumns')!);
      for(let i=0;i<this.deletedColumns.length;i++){
        if(this.deletedColumns[i].resizeWidth=='0'){
        this.deletedColumns[i].resizeWidth='100';
        }
      }
    } else {
      this.deletedColumns = [
        {
          controlName: 'OrderNo',
          displayName: ' SNo.',
          chineseDisplayName: '序号',
          field: 'SSNO',
          colName: 'OrderNo',
          placeholder: 'Search OrderNumber',
          isVisible: true,
          width: '10%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'WBS1',
          displayName: 'WBS 1',
          chineseDisplayName: '楼座',
          colName: 'WBS1',
          field: 'WBS1',
          placeholder: 'Search WBS1',
          isVisible: true,
          width: '7%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'WBS2',
          displayName: 'WBS 2',
          chineseDisplayName: '楼层',
          colName: 'WBS2',
          field: 'WBS2',
          placeholder: 'Search WBS2',
          isVisible: true,
          width: '7%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'WBS3',
          displayName: 'WBS 3',
          chineseDisplayName: '分部',
          colName: 'WBS3',
          field: 'WBS3',
          placeholder: 'Search WBS3',
          isVisible: true,
          width: '7%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'StructureElement',
          displayName: 'Structure Element',
          chineseDisplayName: '建筑构件',
          colName: 'StructureElement',
          field: 'StructureElement',
          placeholder: 'Search StructureElement',
          isVisible: true,
          width: '10%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'ProdType',
          displayName: 'Product Type',
          chineseDisplayName: '产品类型',
          colName: 'ProdType',
          field: 'ProductType',
          placeholder: 'Search ProductType',
          isVisible: true,
          width: '10%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'PONo',
          displayName: 'PO NO',
          chineseDisplayName: '订单号码',
          colName: 'PONo',
          field: 'PONo',
          placeholder: 'Search PONumber',
          isVisible: true,
          width: '7%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'dateRangeCreated',
          displayName: 'Date Created',
          chineseDisplayName: '创建日期',
          colName: 'UpdateDate',
          field: 'DateCreated',
          placeholder: 'Search here',
          isVisible: true,
          width: '12%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'dateRangeRequired',
          displayName: 'Required Date',
          chineseDisplayName: '交货日期',
          colName: 'RequiredDate',
          field: 'RequiredDate',
          placeholder: 'Search here',
          isVisible: true,
          width: '12%',
          resizeWidth: '50',
          left: '0',
        },

        {
          controlName: 'ProjectTitle',
          displayName: 'Project Title',
          chineseDisplayName: '工程项目',
          colName: 'ProjectTitle',
          field: 'ProjectTitle',
          placeholder: 'Search here',
          isVisible: true,
          width: '12%',
          resizeWidth: '50',
          left: '0',
        },
        {
          controlName: 'OrderWeight',
          displayName: 'Tonnage',
          chineseDisplayName: '重量(吨)',
          colName: 'OrderWeight',
          field: 'Tonnage',
          placeholder: 'Search Tonnage',
          isVisible: true,
          width: '11%',
          resizeWidth: '50',
          left: '0',
        },
      ];
    }
    this.searchForm.valueChanges.subscribe((newValue) => {
      if (
        newValue.dateRangeRequired.includes('Invalid') ||
        newValue.dateRangeCreated.includes('Invalid')
      ) {
        //this.loading = true;
        //this.filterAllData();
        this.SetDelayForLoader();
        //this.loading = false;
      } else {
        this.filterAllData();
      }
    });
    this.changeDetectorRef.detectChanges();
    this.loadingData = true;

    if (this.loginService.customerList_Ordering) {
      this.CustomerList = this.loginService.customerList_Ordering;
    }
    if (this.loginService.projectList_Ordering) {
      this.ProjectList = this.loginService.projectList_Ordering;
    }

    // LOADING VALUES
    this.deletedorderForm.controls['customer'].patchValue(
      this.dropdown.getCustomerCode()
    );
    this.SelectedProjectCodes = this.dropdown.getProjectCode();
    this.deletedorderForm.controls['project'].patchValue(this.SelectedProjectCodes);

    // LOADING LIST AND TABLE DATA
    this.Loaddata();
  }
  Loaddata() {
    // this.GetOrderCustomer();
    // this.GetOrderProjectsList(this.deletedorderForm.controls['customer'].value);
    this.GetDeleteGridList(
      this.deletedorderForm.controls['customer'].value,
      this.SelectedProjectCodes
    );
  }

  // reload() {
  //   // Perform your reload logic here
  //   console.log('ComponentA reloaded!');
  // }
  showDetails() {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {
    console.log(item.item_text);
    // console.log(e.target.value);
    // console.log(this.deletedorderForm)

    //  let projecttName =e.target.value
    this.deletedorderForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.deletedorderForm.controls;
  }

  onSubmit() {
    // console.log("submit clicked");
    this.submitted = true;

    // stop here if form is invalid
    if (this.deletedorderForm.invalid) {
      return;
    }

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.wbsForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.hideTable = true;
    //this.CustomerList=[];
    // this.ProjectList=[];
    this.clearInput++;
    this.deletedorderForm.reset();
  }

  Copy(item: any) {
    item = JSON.stringify(item, null, 2);
    console.log(item);
    this.clipboard.copy(item);
    this.toastr.success('Copied');
  }

  open() {
    //const modalRef = this.modalService.open(AddGroupMarkComponent, ngbModalOptions);
    //modalRef.componentInstance.prodttype = prodttype;
    //modalRef.componentInstance.structure = structure;
  }

  getPageData() {
    //this.Loaddata();

    this.deleteorderarray = this.deleteorderarray.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  private deleteOrderQueue$ = new Subject<{ customer: any; projects: any[] }>();
  GetDeleteGridList(customerCode: any, projectCodes: any): void {
    if (!customerCode || !projectCodes || projectCodes.length === 0) return;
    this.deleteOrderQueue$.next({ customer: customerCode, projects: projectCodes });
  }
  private executeDeleteGridList(customerCode: any, projectCodes: any): Observable<void> {
    return defer(() => {
      this.deleteorderarray = [];
      this.hideTable = false;
      this.DeleteOrderLoading = true;
      this.totalCount = 0;

      const allProjects = this.commonService.includeOptionalProjects;

      if (!allProjects) {
        // Fetch one project at a time sequentially
        return from(projectCodes).pipe(
          concatMap((code) =>
            this.orderService.GetDeleteOrderGridList(customerCode, code, false).pipe(
              tap((response) => {
                const formatted = response.map((r: any) => ({
                  ...r,
                  rowSelected: false,
                }));

                this.deleteorderarray = this.deleteorderarray.concat(formatted);
                this.totalCount = this.deleteorderarray.length;

                this.deletedOrderString =
                  this.deleteorderarray.length > 1
                    ? 'Total Deleted Orders'
                    : 'Total Deleted Order';

                console.log(`Fetched ${formatted.length} deleted orders for project ${code}`);
              }),
              catchError((err) => {
                console.error(`Error fetching deleted orders for project ${code}`, err);
                return of([]); // continue even if one call fails
              })
            )
          ),
          finalize(() => {
            this.DeleteOrderLoading = false;
            this.deleteorderarray_Backup = JSON.parse(
              JSON.stringify(this.deleteorderarray)
            );
            this.ReloadLastSearch();
            console.log('Completed DeleteGridList run for all projects.');
          }),
          mapTo(void 0)
        );
      } else {
        // Fetch all projects in one call
        return this.orderService
          .GetDeleteOrderGridList(customerCode, projectCodes[0], true)
          .pipe(
            tap((response) => {
              const formatted = response.map((r: any) => ({
                ...r,
                rowSelected: false,
              }));

              this.deleteorderarray = formatted;
              this.totalCount = formatted.length;

              this.deletedOrderString =
                this.deleteorderarray.length > 1
                  ? 'Total Deleted Orders'
                  : 'Total Deleted Order';

              console.log(`Fetched ${formatted.length} deleted orders (AllProjects mode)`);
            }),
            finalize(() => {
              this.DeleteOrderLoading = false;
              this.deleteorderarray_Backup = JSON.parse(
                JSON.stringify(this.deleteorderarray)
              );
              this.ReloadLastSearch();
            }),
            mapTo(void 0)
          );
      }
    });
  }

  // GetDeleteGridList(customerCode: any, projectCodes: any): void {
  //   //debugger;
  //   this.deleteorderarray = [];
  //   if (customerCode != undefined && projectCodes.length > 0) {
  //     this.hideTable = false;
  //     this.DeleteOrderLoading = true;

  //     this.totalCount = 0;

  //     let AllProjects = this.commonService.includeOptionalProjects;
  //     if (!AllProjects) {
  //       for (let i = 0; i < projectCodes.length; i++) {
  //         this.orderService
  //           .GetDeleteOrderGridList(customerCode, projectCodes[i], false)
  //           .subscribe({
  //             next: (response) => {
  //               //debugger;
  //               let temp = response;

  //               for (let i = 0; i < response.length; i++) {
  //                 temp[i].rowSelected = false;
  //               }
  //               this.deleteorderarray = this.deleteorderarray.concat(temp);
  //               this.DeleteOrderLoading = false;

  //               this.totalCount = this.deleteorderarray.length;
  //               if (this.deleteorderarray.length > 1) {
  //                 this.deletedOrderString = 'Total Deleted Orders';
  //               } else {
  //                 this.deletedOrderString = 'Total Deleted Order';
  //               }
  //             },
  //             error: () => {},
  //             complete: () => {
  //               this.deleteorderarray_Backup = JSON.parse(
  //                 JSON.stringify(this.deleteorderarray)
  //               );
  //               this.ReloadLastSearch();
  //             },
  //           });
  //       }
  //     } else {
  //       this.orderService
  //         .GetDeleteOrderGridList(customerCode, projectCodes[0], true)
  //         .subscribe({
  //           next: (response) => {
  //             //debugger;
  //             let temp = response;

  //             for (let i = 0; i < response.length; i++) {
  //               temp[i].rowSelected = false;
  //             }
  //             this.deleteorderarray = this.deleteorderarray.concat(temp);
  //             this.DeleteOrderLoading = false;

  //             this.totalCount = this.deleteorderarray.length;
  //             if (this.deleteorderarray.length > 1) {
  //               this.deletedOrderString = 'Total Deleted Orders';
  //             } else {
  //               this.deletedOrderString = 'Total Deleted Order';
  //             }
  //           },
  //           error: () => {},
  //           complete: () => {
  //             this.deleteorderarray_Backup = JSON.parse(
  //               JSON.stringify(this.deleteorderarray)
  //             );
  //             this.ReloadLastSearch();
  //           },
  //         });
  //     }
  //   }
  // }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
  }

  LoadProject(customerid: any) {
    if (customerid == 1) {
      this.ProjectList = [
        {
          item_id: 1,
          item_text: '0000100258-ECAGING FOR MARINA(0000102094:2990)-CAR',
        },
        {
          item_id: 2,
          item_text: '0000100805-PRECAGING FOR MARINA(0000102094:2990)-CAR',
        },
        {
          item_id: 3,
          item_text: '0000102416-PRECAGING FOR MARINA(0000102094:2990)-CAR',
        },
      ];
    } else if (customerid == 2) {
      this.ProjectList = [
        {
          item_id: 4,
          item_text: '0000102444-PRECAGING FOR MARINA(0000102094:2990)-CAR',
        },
        {
          item_id: 5,
          item_text:
            '0000100326-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31(0000102256:3305)-ACS/BPC/CAB/CAR/MSH/PRC',
        },
        {
          item_id: 6,
          item_text:
            '0000100258-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31 (816 DU)(0000102259:3310)-ACS/BPC/CAB/CAR/MSH/PRC',
        },
      ];
    } else if (customerid == 3) {
      this.ProjectList = [
        {
          item_id: 7,
          item_text:
            '0000100326-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31 (816 DU)(0000102259:3310)-ACS/BPC/CAB/CAR/MSH/PRC',
        },
        {
          item_id: 8,
          item_text:
            '0000100001-REBAR TERM CONTRACT FOR 2009(0000100001:4553)-ACS/BPC/CAB/CAR/MSH/PRC',
        },
        {
          item_id: 9,
          item_text:
            '0000100705-REBAR TERM CONTRACT FOR 2009(0000100001:4553)-ACS/BPC/CAB/CAR/MSH/PRC',
        },
      ];
    } else if (customerid == 4) {
      this.ProjectList = [
        {
          item_id: 1,
          item_text: '0000100258-ECAGING FOR MARINA(0000102094:2990)-CAR',
        },
        {
          item_id: 2,
          item_text: '0000100805-PRECAGING FOR MARINA(0000102094:2990)-CAR',
        },
        {
          item_id: 3,
          item_text: '0000102416-PRECAGING FOR MARINA(0000102094:2990)-CAR',
        },
      ];
    } else if (customerid == 5) {
      this.ProjectList = [
        {
          item_id: 4,
          item_text: '0000102444-PRECAGING FOR MARINA(0000102094:2990)-CAR',
        },
        {
          item_id: 5,
          item_text:
            '0000100326-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31(0000102256:3305)-ACS/BPC/CAB/CAR/MSH/PRC',
        },
        {
          item_id: 6,
          item_text:
            '0000100258-HDB BUILDING WORKS AT KALLANG WHAMP OA RC 31 (816 DU)(0000102259:3310)-ACS/BPC/CAB/CAR/MSH/PRC',
        },
      ];
    }
  }

  // changestatus(iscreated:any,isdetailing:any,isposted:any,isreleased:any)
  // {
  //   this.Loaddata();
  //  this.iscreated=iscreated;
  //  this.isdetailing=isdetailing;
  //  this.isposted=isposted;
  //  this.isreleased=isreleased;

  // }

  download() {
    // let fileName='ActiveOrders';
    //  const blob =   new Blob(this.deleteorderarray, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    //   saveAs(blob, fileName + '.xlsx');
  }

  giveRowcolor(item: any) {
    var color = 'inhert';

    if (item.rowSelected) {
      color = 'red';
    } else {
      color = 'white';
    }

    return color;
  }

  GetOrderCustomer(): void {
    //debugger;
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.CustomerList = response;
        console.log('customer', response);
      },
      error: () => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }
  GetOrderProjectsList(customerCode: any): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();

    this.orderService
      .GetProjects(customerCode, pUserType, pGroupName)
      .subscribe({
        next: (response) => {
          this.ProjectList = response;
        },
        error: () => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  dateChange(date: any) {
    console.log(date.value);
    if (date.value == '') {
      this.deleteorderarray = JSON.parse(
        JSON.stringify(this.deleteorderarray_Backup)
      );
    }
  }
  getDate(date: any) {
    if (date == '') {
      return '';
    }
    date = date.split('/');
    date.unshift(date.pop());
    for (let i = 0; i < date.length; i++) {
      if (date[i] <= 9) {
        date[i] = '0' + date[i];
      }
    }
    date = date.join('');
    return date;
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
  dateCHange(event: any) {
    console.log(event);
  }
  updatedateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    this.StartUpdateDate = '';
    this.StartUpdateDate = '';
    //StartUpdateDate
    this.StartUpdateDate = dateRangeStart.value;
    this.StartUpdateDate = this.getDate(this.StartUpdateDate);
    //EndUpdateDate
    this.EndUpdateDate = dateRangeEnd.value;
    this.EndUpdateDate = this.getDate(this.EndUpdateDate);
    this.changeDetectorRef.detectChanges();

    console.log(this.StartUpdateDate);
    console.log(this.EndUpdateDate);
    if (this.StartUpdateDate != '' && this.EndUpdateDate != '') {
      this.searchData();
    }
    // this.filterData();
  }

  reqdateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    //debugger;
    this.StartReqDate = '';
    this.StartReqDate = '';
    console.log('ReqdateRange', this.ReqdateRange.controls['start1'].value);
    console.log('ReqdateRange', this.ReqdateRange.controls['end1'].value);
    let reqstartDt = this.ReqdateRange.controls['start1'].value;
    let reqendDt = this.ReqdateRange.controls['end1'].value;
    const year = reqstartDt.getFullYear();
    const month = this.padNumber(reqstartDt.getMonth() + 1);
    const day = this.padNumber(reqstartDt.getDate());
    reqstartDt = `${year}${month}${day}`;
    console.log('reqstartDt', reqstartDt);
    this.StartReqDate = reqstartDt;

    //StartReqDate
    // this.StartReqDate = dateRangeStart.value
    // this.StartReqDate = this.getDate(this.StartReqDate)
    //EndReqDate

    const year1 = reqendDt.getFullYear();
    const month1 = this.padNumber(reqendDt.getMonth() + 1);
    const day1 = this.padNumber(reqendDt.getDate());
    reqendDt = `${year1}${month1}${day1}`;
    console.log('reqstartDt', reqendDt);
    this.EndReqDate = reqendDt;
    // this.EndReqDate = dateRangeEnd.value
    // this.EndReqDate = this.getDate(this.EndReqDate)
    this.changeDetectorRef.detectChanges();

    console.log(this.StartReqDate);
    console.log(this.EndReqDate);
    if (this.StartReqDate != '' && this.EndReqDate != '') {
      this.searchData();
    }
    // this.filterData();
  }
  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue && ctlValue != '') {
      if (ctlValue.toString().includes(',')) {
        let value = ctlValue.toString().toLowerCase().trim().split(',');
        return value.some((char: string) =>
          item.toString().toLowerCase().includes(char)
        );
      } else {
        return item
          .toString()
          .toLowerCase()
          .includes(ctlValue.toString().toLowerCase().trim());
      }
    } else {
      return true;
    }
  }
  searchData() {
    //debugger;
    this.deleteorderarray = JSON.parse(
      JSON.stringify(this.deleteorderarray_Backup)
    );

    if (this.Sno != undefined && this.Sno != '') {
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.SSNNo?.toString().includes(this.Sno)
        this.checkFilterData(this.Sno, item.OrderNo)
      );
    }
    if (this.WBS1 != undefined && this.WBS1 != '') {
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.WBS1?.toLowerCase().includes(this.WBS1.trim().toLowerCase())
        this.checkFilterData(this.WBS1, item.WBS1)
      );
    }
    if (this.WBS2 != undefined && this.WBS2 != '') {
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.WBS2?.toLowerCase().includes(this.WBS2.trim().toLowerCase())
        this.checkFilterData(this.WBS2, item.WBS2)
      );
    }

    if (this.WBS3 != undefined && this.WBS3 != '') {
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.WBS3?.toLowerCase().includes(this.WBS3.trim().toLowerCase())
        this.checkFilterData(this.WBS3, item.WBS3)
      );
    }
    if (this.StructureEle != undefined && this.StructureEle != '') {
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.StructureElement?.toLowerCase().includes(
        //   this.StructureEle.trim().toLowerCase()
        // )
        this.checkFilterData(this.StructureEle, item.StructureElement)
      );
    }
    if (this.ProductType != undefined && this.ProductType != '') {
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.ProdType?.toLowerCase().includes(
        //   this.ProductType.trim().toLowerCase()
        // )
        this.checkFilterData(this.ProductType, item.ProdType)
      );
    }
    if (this.Tonnage != undefined && this.Tonnage != '') {
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.OrderWeight?.toString().includes(this.Tonnage.trim().toLowerCase())
        this.checkFilterData(this.Tonnage, item.OrderWeight)
      );
    }
    if (this.PONo != undefined && this.PONo != '') {
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.PONo?.toLowerCase().includes(this.PONo.trim().toLowerCase())
        this.checkFilterData(this.PONo, item.PONo)
      );
    }
    if (this.projecttitle != undefined && this.projecttitle != '') {
      this.deleteorderarray = this.deleteorderarray.filter((item) =>
        // item.PONo?.toLowerCase().includes(this.PONo.trim().toLowerCase())
        this.checkFilterData(this.projecttitle, item.ProjectTitle)
      );
    }
    if (
      this.StartUpdateDate != '' &&
      this.StartUpdateDate != null &&
      this.EndUpdateDate != '' &&
      this.EndUpdateDate != null
    ) {
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.deleteorderarray = this.deleteorderarray.filter(
        (item) =>
          item.UpdateDate.replace(/-/g, '') <= this.EndUpdateDate &&
          item.UpdateDate.replace(/-/g, '') >= this.StartUpdateDate
      );
    }
    if (
      this.StartReqDate != '' &&
      this.StartReqDate != null &&
      this.EndReqDate != '' &&
      this.EndReqDate != null
    ) {
      // console.log(this.activeorderarray[0].RequiredDate.replace(/-/g, ''))
      this.deleteorderarray = this.deleteorderarray.filter(
        (item) =>
          item.RequiredDate.replace(/-/g, '') <= this.EndReqDate &&
          item.RequiredDate.replace(/-/g, '') >= this.StartReqDate
      );
    }
    // if (this.StructureElement != undefined && this.StructureElement != "") {
    //   this.activeorderarray = this.activeorderarray.filter(item =>
    //     item.StructureElement?.toLowerCase().includes(this.StructureElement.trim().toLowerCase())
    //   );
    // };
    // if (this.BBSNo != undefined && this.BBSNo != "") {
    //   this.activeorderarray = this.activeorderarray.filter(item =>
    //     item.BBSNo?.toLowerCase().includes(this.BBSNo.trim().toLowerCase())
    //   );
    // };
    // if (this.OrderStatus != undefined && this.OrderStatus != "") {
    //   this.activeorderarray = this.activeorderarray.filter(item =>
    //     item.OrderStatus?.toLowerCase().includes(this.OrderStatus.trim().toLowerCase())
    //   );
    // };
  }
  dropCol(event: any) {
    if (this.fixedColumn != 0) {
      if (
        event.previousIndex < this.fixedColumn &&
        event.currentIndex > this.fixedColumn
      ) {
        this.toastr.warning("Fixed columns can't be moved to normal columns!");
        // moveItemInArray(this.deletedColumns, event.previousIndex, event.previousIndex);
      } else if (
        event.previousIndex > this.fixedColumn &&
        event.currentIndex < this.fixedColumn
      ) {
        // moveItemInArray(this.deletedColumns, event.previousIndex, event.previousIndex);
        this.toastr.warning("Columns can't be moved to fixed columns!");
      } else {
        let lcurrentIndex = this.CheckHiddenColumn(
          event.currentIndex,
          this.deletedColumns
        );
        let lpreviousIndex = this.CheckHiddenColumn(
          event.previousIndex,
          this.deletedColumns
        );
        moveItemInArray(this.deletedColumns, lpreviousIndex, lcurrentIndex);
      }
    } else {
      let lcurrentIndex = this.CheckHiddenColumn(
        event.currentIndex,
        this.deletedColumns
      );
      let lpreviousIndex = this.CheckHiddenColumn(
        event.previousIndex,
        this.deletedColumns
      );
      moveItemInArray(this.deletedColumns, lpreviousIndex, lcurrentIndex);
    }
    localStorage.setItem('deletedColumns', JSON.stringify(this.deletedColumns));
  }
  drpName(dateName: string, event: MouseEvent) {
    console.log('Event=>', event);
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    // Calculate the top and left positions relative to the element
    this.top = rect.top - 50;
    this.right = rect.left - 15;
    this.dateInputName = dateName;
    if (dateName == 'dateRangeRequired') {
      let setdate1 = this.searchForm.get('dateRangeRequired')?.value
        ? this.searchForm.get('dateRangeRequired')?.value.split('-')
        : null;
      if (setdate1) {
        this.defaultFrom = this.parseDate(setdate1[0]);
        this.defaultTo = this.parseDate(setdate1[1]);
      }
    }
    if (dateName == 'dateRangeCreated') {
      let setdate = this.searchForm.get('dateRangeCreated')?.value
        ? this.searchForm.get('dateRangeCreated')?.value.split('-')
        : null;
      if (setdate) {
        this.defaultFrom = this.parseDate(setdate[0]);
        this.defaultTo = this.parseDate(setdate[1]);
      }
    }
    this.isOpen = !this.isOpen;
  }
  parseDate(dateString: any) {
    // Split the date string into parts
    const parts = dateString.split('/');
    // Rearrange the parts into a format JavaScript recognizes
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    // Create a new Date object
    return new Date(formattedDate);
  }
  filterAllData() {
    this.deleteorderarray = JSON.parse(
      JSON.stringify(this.deleteorderarray_Backup)
    );
    this.deleteorderarray = this.deleteorderarray.filter(
      (item) =>
        this.checkFilterData(
          this.searchForm.controls.OrderNo.value,
          item.SSNNo
        ) &&
        this.checkFilterData(this.searchForm.controls.PONo.value, item.PONo) &&
        this.checkFilterData(this.searchForm.controls.WBS1.value, item.WBS1) &&
        this.checkFilterData(this.searchForm.controls.WBS2.value, item.WBS2) &&
        this.checkFilterData(this.searchForm.controls.WBS3.value, item.WBS3) &&
        this.checkFilterData(
          this.searchForm.controls.ProdType.value,
          item.ProdType
        ) &&
        this.checkFilterData(
          this.searchForm.controls.StructureElement.value,
          item.StructureElement
        ) &&
        this.checkFilterData(
          this.searchForm.controls.OrderWeight.value,
          item.OrderWeight
        ) &&
        this.getDateCompare(
          this.searchForm.controls.dateRangeCreated.value,
          item.UpdateDate
        ) &&
        this.getDateCompare(
          this.searchForm.controls.dateRangeRequired.value,
          item.RequiredDate
        ) &&
        this.checkFilterData(
          this.searchForm.controls.ProjectTitle.value,
          item.ProjectTitle
        )
    );
  }
  public onDateRangeSelection(range: { from: Date; to: Date }) {
    console.log(`Selected range: ${range.from} - ${range.to}`);
    this.isOpen = false;
    let date =
      moment(range.from).format('DD/MM/YYYY') +
      '-' +
      moment(range.to).format('DD/MM/YYYY');
    if (this.dateInputName && this.dateInputName == 'dateRangeRequired') {
      this.searchForm.get('dateRangeRequired')?.setValue(date);
    }
    if (this.dateInputName && this.dateInputName == 'dateRangeCreated') {
      this.searchForm.get('dateRangeCreated')?.setValue(date);
    }
  }

  parseDateRange(dateRangeString: string) {
    console.log('dateRangeString=>', dateRangeString);
    const dates = dateRangeString.trim().split('-');
    const startDate = moment(this.parseDate(dates[0]));
    const endDate = moment(this.parseDate(dates[1]));
    return { startDate, endDate };
  }
  // getDateCompare(dateToCompare: any, actualDate: any) {
  //   if (dateToCompare && dateToCompare != '' && actualDate) {
  //     const { startDate, endDate } = this.parseDateRange(dateToCompare);
  //     const dateObj = moment(new Date(actualDate));
  //     console.log("dateRangeString=>",startDate, endDate,dateObj,dateObj.isBetween(startDate, endDate, null, '[]'));
  //     return dateObj.isBetween(startDate, endDate, null, '[]');
  //   }else{
  //     return true;
  //   }
  // }
  getDateCompare(dateToCompare: any, actualDate: any) {
    // let lReturn = false;
    console.log('getDateCompare=>', dateToCompare, actualDate);
    if (dateToCompare && dateToCompare != '' &&
      !dateToCompare.includes('Invalid')) {
      if (actualDate) {
        let actualDateList = actualDate.split(',');
        for (let i = 0; i < actualDateList.length; i++) {
          const { startDate, endDate } = this.parseDateRange(dateToCompare);
          const dateObj = moment(new Date(actualDateList[i]));
          console.log(
            'dateRangeString=>',
            startDate,
            endDate,
            dateObj,
            dateObj.isBetween(startDate, endDate, null, '[]')
          );
          if (dateObj.isBetween(startDate, endDate, null, '[]')) {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    } else {
      return true;
    }
  }

  downloadFile() {
    let listTodownload = [];
    for (let i = 0; i < this.deleteorderarray.length; i++) {
      let obj = {
        Sno: this.deleteorderarray[i].SSNNo,
        WBS1: this.deleteorderarray[i].WBS1,
        WBS2: this.deleteorderarray[i].WBS2,
        WBS3: this.deleteorderarray[i].WBS3,
        StructureEle: this.deleteorderarray[i].StructureElement,
        ProductType: this.deleteorderarray[i].ProdType,
        PONo: this.deleteorderarray[i].PONo,
        DateCreated: this.deleteorderarray[i].UpdateDate,
        ReqDate: this.deleteorderarray[i].RequiredDate,
        Tonnage: this.deleteorderarray[i].OrderWeight,
        ProjectTitle: this.deleteorderarray[i].ProjectTitle,
      };
      listTodownload.push(obj);
    }
    // listTodownload = this.activeorderarray;
    this.name = 'DeleteOrderList';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listTodownload);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'export');
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.name + '.xlsx';
    link.click();
  }

  Reset_Filter() {
    this.searchForm.reset();
    this.defaultFrom = new Date();
    this.defaultTo = new Date();
    this.searchData();
  }

  recordSelected(k: number) {
    this.deleteorderarray[k].isSelected = !this.deleteorderarray[k].isSelected;
    //debugger;
    for (let i = 0; i < this.deleteorderarray.length; i++) {
      if (this.deleteorderarray[i].isSelected) {
        this.disable = false;

        return;
      }
    }
    this.disable = true;
  }

  Recover() {
    if (
      confirm('Are you sure you want to recover the select orders?') != true
    ) {
      return;
    }
    let CustomerCode: any[] = [];
    let ProjectCode: any[] = [];
    let OrderNo: any[] = [];

    for (let i = 0; i < this.deleteorderarray.length; i++) {
      if (this.deleteorderarray[i].isSelected == true) {
        CustomerCode.push(this.deleteorderarray[i].CustomerCode);
        ProjectCode.push(this.deleteorderarray[i].ProjectCode);
        OrderNo.push(this.deleteorderarray[i].OrderNo);
      }
    }

    let obj = {
      pCustomerCode: CustomerCode,
      pProjectCode: ProjectCode,
      pOrderNo: OrderNo,
      pOrderStatus: 'Recover',
    };

    console.log('obj', obj);

    this.DeleteOrderLoading = true;

    this.orderService.BatchChangeStatus(obj).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response != null) {
          if (response.success == false) {
            alert('Error during orders recover : ' + response.responseText);
          }
        } else {
          alert(
            'The selected orders have been recovered successfully. you can find them from Draft Orders'
          );
        }

        this.GetDeleteGridList(
          this.deletedorderForm.controls['customer'].value,
          this.SelectedProjectCodes
        );
      },
      error: () => {
        alert('recover orders error. The Internet network or server error.');
      },
      complete: () => {
        this.DeleteOrderLoading = false;
      },
    });
  }

  toggleSortingOrder(columnname: string, actualColName: any) {
    this.currentSortingColumn = columnname;
    this.isAscending = !this.isAscending;
    if (this.isAscending) {
      if (columnname == 'SSNO' || columnname == 'Tonnage') {
        this.deleteorderarray.sort(
          (a, b) => Number(a[actualColName]) - Number(b[actualColName])
        );
      } else if (columnname == 'RequiredDate' || columnname == 'DateCreated') {
        this.deleteorderarray.sort(
          (a, b) =>
            new Date(a[actualColName]).getTime() -
            new Date(b[actualColName]).getTime()
        );
      } else {
        this.deleteorderarray.sort((a, b) =>
          a[actualColName].localeCompare(b[actualColName])
        );
      }
    } else {
      if (columnname == 'SSNO' || columnname == 'Tonnage') {
        this.deleteorderarray.sort(
          (a, b) => Number(b[actualColName]) - Number(a[actualColName])
        );
      } else if (columnname == 'RequiredDate' || columnname == 'DateCreated') {
        this.deleteorderarray.sort(
          (a, b) =>
            new Date(b[actualColName]).getTime() -
            new Date(a[actualColName]).getTime()
        );
      } else {
        this.deleteorderarray.sort((a, b) =>
          b[actualColName].localeCompare(a[actualColName])
        );
      }
    }
    // this.sortItems(columnname);
  }

  convertToAscii(inputString: string) {
    let asciiValues = '';
    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      asciiValues = asciiValues + charCode;
    }
    return Number(asciiValues);
  }
  async ViewOrderDetails(row: any) {
    // CLEAR DATA FROM PROCESS ORDER SAVED IN LOCAL STORAGE
    localStorage.removeItem('ProcessData');
    sessionStorage.removeItem('ProcessData');
    localStorage.removeItem('ProcessOrderSummaryData');
    sessionStorage.removeItem('ProcessOrderSummaryData');
    // localStorage.removeItem('CreateDataProcess');
    // sessionStorage.removeItem('CreateDataProcess');
    this.ordersummarySharedService.SetOrderSummaryData(undefined);
    this.processsharedserviceService.setOrderSummaryData(undefined);
    this.processsharedserviceService.ProductDetailsEditable = false;
    this.createSharedService.showOrderSummary = true;

    console.log('row selected', row);

    localStorage.setItem('lastRow_Deleted', JSON.stringify(row));
    localStorage.setItem(
      'lastSearch_Deleted',
      JSON.stringify(this.searchForm.value)
    );
    // let obj = {
    //   pCustomerCode: row.CustomerCode,
    //   pProjectCode: row.ProjectCode,
    //   pSelectedCount: 0,
    //   pSelectedSE: '',
    //   pSelectedProd: '',
    //   pSelectedWT: '',
    //   pSelectedQty: '',
    //   pSelectedPostID: '',
    //   pSelectedScheduled: '',
    //   pSelectedWBS1: '',
    //   pSelectedWBS2: '',
    //   pSelectedWBS3: '',
    //   pWBS1: '',
    //   pWBS2: '',
    //   pWBS3: '',
    //   pOrderNo: row.OrderNo.toString(),
    // };

    // this.createSharedService.viewOrderSummaryList = obj;
    // this.createSharedService.viewData = true;

    let response: any = await this.GetOrderSet(row.OrderNo, false);

    let lStructureElement: any[] = [];
    let lProductType: any[] = [];
    let lTotalWeight: any[] = [];
    let lTotalQty: any[] = [];
    let lSelectedPostId: any[] = [];
    let lScheduledProd: any[] = [];
    let lWBS1: any[] = [];
    let lWBS2: any[] = [];
    let lWBS3: any[] = [];
    let lOrderNo: any[] = [];
    let lStrutureProd: any[] = [];

    if (response == false) {
      alert('Connection error, please check your internet connection.');

      return;
    } else {
      for (let i = 0; i < response.length; i++) {
        if (row.OrderNo == response[i].OrderNo) {
          lStructureElement.push(response[i].StructureElement);
          lProductType.push(response[i].ProductType);
          lTotalWeight.push(1);
          lTotalQty.push(response[i].TotalPCs);
          lSelectedPostId.push(response[i].PostHeaderId);
          lScheduledProd.push(response[i].ScheduledProd);
          lWBS1.push(response[i].WBS1);
          lWBS2.push(response[i].WBS2);
          lWBS3.push(response[i].WBS3);
          lOrderNo.push(response[i].OrderNo);

          let lStructPrd =
            response[i].StructureElement + '/' + response[i].ProductType;
          if (response[i].PostHeaderId) {
            lStructPrd = lStructPrd + response[i].PostHeaderId;
          }
          lStrutureProd.push(lStructPrd);
        }
      }
    }

    this.createSharedService.selectedTab = true;
    if (lStructureElement.includes('NONWBS') || lStructureElement.includes('nonwbs'))  {
      this.createSharedService.selectedTab = false;
    }
    let tempOrderSummaryList: TempOrderSummaryData = {
      pCustomerCode: '',
      pProjectCode: '',
      pSelectedCount: 0,
      pSelectedSE: lStructureElement,
      pSelectedProd: lProductType,
      pSelectedWT: lTotalWeight,
      pSelectedQty: lTotalQty,
      pSelectedPostID: lSelectedPostId,
      pSelectedScheduled: lScheduledProd,
      pSelectedWBS1: lWBS1,
      pSelectedWBS2: lWBS2,
      pSelectedWBS3: lWBS3,
      pWBS1: '',
      pWBS2: '',
      pWBS3: '',
      pOrderNo: lOrderNo,
      StructProd: lStrutureProd,
    };
    // localStorage.setItem(
    //   'CreateDataProcess',
    //   JSON.stringify(tempOrderSummaryList)
    // );
    this.UpdateAddressCode(row.OrderNo); // Udpates the AddressCode in the Dropdown of the selected Order.

    this.ordersummarySharedService.SetOrderSummaryData(tempOrderSummaryList);
    let UpdatedProjects = this.dropdown.UpdateProjectCodeSequence(row.ProjectCode);
    this.router.navigate(['../order/createorder']);
  }

  async GetOrderSet(OrderNumber: any, routeFlag: boolean) {
    // CALL API TO RETURN ALL ORDERS WITH SIMILAR REF NUMBER TO GIVEN ORDER NUMBER
    try {
      const data = await this.orderService
        .GetOrderSet(OrderNumber, routeFlag)
        .toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }
  headHeight: any = 0;
  getMinHeightIncoming(id: string) {
    const divElement: HTMLElement | null = document.getElementById(id);
    if (divElement) {
      // Get the height of the div using clientHeight property
      console.log('Heading Height', divElement.clientHeight);
      this.headHeight = divElement.clientHeight;
      return divElement.clientHeight;
    }
    this.headHeight = 50;
    return 50;
  }
  onGetDateSelected(range: any) {
    this.searchForm
      .get(range.controlName)
      ?.setValue(
        moment(range.from).format('DD/MM/yyyy') +
          '-' +
          moment(range.to).format('DD/MM/yyyy')
      );
  }
  changeColor(num: number) {
    this.selectedRowIndex = num;
  }
  onWidthChange(obj: any) {
    this.deletedColumns[obj.index].resizeWidth = obj.width;
    this.deletedColumns[obj.index].width = obj.width;
    this.SaveColumnsSetting();
  }
  getRightWidthTest(element: HTMLElement, j: number) {
    let width = this.getAllPreviousSiblings(element);
    console.log('previousSibling=>', width);

    this.setLeftOfTabble(j, width);
    // this.changeDetectorRef.detectChanges();
    return width + 'px';
  }
  getAllPreviousSiblings(element: HTMLElement) {
    let currentSibling = element.previousElementSibling;
    let totalWidth = 0;

    while (currentSibling) {
      const width = window.getComputedStyle(currentSibling).width;
      totalWidth += parseFloat(width);
      currentSibling = currentSibling.previousElementSibling;
    }

    return totalWidth;
  }
  setLeftOfTabble(index: number, width: any) {
    this.deletedColumns[index].left = width;
  }
  getLeftOfTable(index: number) {
    console.log('get called?', this.deletedColumns[index].left);
    return this.deletedColumns[index].left;
  }
  splitArray(num: number, array: any[]): HeaderColumn[] {
    const midpoint = Math.ceil(array.length / 2);
    if (num == 1) {
      return array.slice(0, midpoint);
    } else {
      return array.slice(midpoint);
    }

    // array.slice(midpoint)];
  }

  CheckCurrentIndex(index: any, dataList: any) {
    if (dataList[index].isVisible) {
      return index;
    } else {
      for (let i = index; i < dataList.Length; i++) {
        if (dataList[i].isVisible) {
          return i - 1;
        }
      }
    }
  }

  CheckHiddenColumn(index: any, dataList: any) {
    let lInVisibleColumns = 0;
    for (let i = 0; i <= index; i++) {
      if (dataList[i].isVisible != true) {
        lInVisibleColumns = lInVisibleColumns + 1;
      }
    }

    return index + lInVisibleColumns;
  }
  SaveColumnsSetting() {
    localStorage.setItem('deletedColumns', JSON.stringify(this.deletedColumns));
  }

  UpdateFixedColumns(pVal: any) {
    pVal = JSON.stringify(pVal);
    localStorage.setItem('deleteFixedColumns', pVal);
  }

  ExportDeletedOrdersToExcel() {
    let customerCode = this.dropdown.getCustomerCode();
    let projectCodes: any = this.dropdown.getProjectCode();

    projectCodes = projectCodes.join(',');
    this.orderService
      .ExportDeletedOrdersToExcel(customerCode, projectCodes)
      .subscribe({
        next: (response) => {
          console.log('Success');

          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'Deleted Orders List-' + '.xlsx';
          a.click();
        },
        error: () => {},
        complete: () => {},
      });
  }

  HoverSetting: boolean= false;
  @HostListener('document:click', ['$event'])
  handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      if (this.HoverSetting == false) {
        this.editColumn = false;
      }
    }
  }

  selectRow(row: any, dataList: any[], event: MouseEvent) {
    // this.myTable.nativeElement.tabIndex = 0;
    debugger;
    console.log('here', row);
    // this.setButtonDisplay(row.OrderStatus);
    dataList.forEach(element => {
      element.rowSelected = false;
      
    });
    row.rowSelected = true ;

    // this.Collapse = false;
 if (event.shiftKey) {
      // Handle multiselect with Shift key.
      if(this.lastPress.length)
      {
        let max = this.findMax(this.lastSelctedRow,this.firstSelectedRow);
        let min = this.findMin(this.lastSelctedRow,this.firstSelectedRow);

        this.lastSelctedRow = max;
        this.firstSelectedRow = min;
      }
   
        console.log('Multi Select Started');
        let lIndex = 0;

        // Get the index of the last selected row in the list.
        // for (let i = 0; i < dataList.length; i++) {
        //   lIndex = this.lastSelctedRow.rowSelected == true ? i : lIndex;
        // }
        lIndex = this.firstSelectedRow;
        // The index of the currently selected row in the list.
        let nIndex = dataList.findIndex((x) => x == row);

        if (nIndex > lIndex) {
          // Add all the rows between the two indexes.
          for (let i = lIndex; i < nIndex + 1; i++) {
            dataList[i].rowSelected = true;
            // this.selectedRow.push(dataList[i]);
          }
          this.lastSelctedRow = nIndex;
        }

        } 


        
  else{
    let lIndex = dataList.findIndex((x) => x == row);
    // The index of the currently selected row in the
    this.lastSelctedRow = lIndex;
    this.firstSelectedRow = lIndex;

  }



}

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
      if (event.shiftKey) {
          // Shift + ArrowDown
          if (event.key === 'ArrowDown') {

            if(this.lastPress=="up")
            {
              this.deleteorderarray[this.lastSelctedRow].rowSelected =!this.deleteorderarray[this.lastSelctedRow].rowSelected ;
            }
            else if(this.lastSelctedRow<this.deleteorderarray.length)
            {
              this.lastSelctedRow += 1;
              this.deleteorderarray[this.lastSelctedRow].rowSelected =!this.deleteorderarray[this.lastSelctedRow].rowSelected ;
            }
            this.lastPress="down"

          }
  
          // Shift + ArrowUp
          if (event.key === 'ArrowUp') {
              // Case 1: If shrinking upwards, deselect the last selected row
           
              // Case 2: If expanding upwards, select rows above firstSelectedRow

              if(this.lastPress=="down")
                {
                  this.deleteorderarray[this.lastSelctedRow].rowSelected =!this.deleteorderarray[this.lastSelctedRow].rowSelected ;
                }
             else if (this.lastSelctedRow > 0) {
                  this.lastSelctedRow -= 1;
                  this.deleteorderarray[this.lastSelctedRow].rowSelected = !this.deleteorderarray[this.lastSelctedRow].rowSelected;
              }
              this.lastPress="up"
          }

          this.scrollToSelectedRow(this.deleteorderarray);
      }
  }


   findMax(a: number, b: number): number {
    return a > b ? a : b;
}
 findMin(a: number, b: number): number {
  return a < b ? a : b;
}
// SelectAllChecked(item:any)
// {
// this.deleteorderarray.forEach(element=>{
//   if(element.rowSelected && item!==element)
//   {
//     element.isSelected = true;
//   }

// })
// }

SelectAllChecked(item: any) {
  // Select all the highlighted items
  let tempArray: any = JSON.parse(JSON.stringify(this.deleteorderarray));
  let lCount = 0;

  item.isSelected = !item.isSelected;
  tempArray.forEach((element: any) => {
    if (element.rowSelected) {
      element.isSelected = true;
      if (JSON.stringify(item) !== JSON.stringify(element)) {
        element.rowSelected = false;
      }
      lCount++;
    }
  });

  if (lCount > 1) {
    // Function is not required if only a single item is getting selected
    this.deleteorderarray = tempArray;
  }else{
    // In case a single item is selected, remove highlighting from others
    this.deleteorderarray.forEach(element => (element.rowSelected = false));
  }

  // Revert it back to original state as it will be updated again in the functions => recordSelected
  item.isSelected = !item.isSelected;

  // Highlight the clicked row in all cases;
  item.rowSelected = true;
}

itemSize = 30;
scrollToRow(viewport:CdkVirtualScrollViewport,nextIndex: number,itemSize:number): void {
if (viewport) {
  // const currentScrollOffset = viewport.measureScrollOffset();
  // if(currentScrollOffset > 250){
  //   const newOffset = currentScrollOffset + 29.2; // Move down one item size
  //   viewport.scrollToOffset(newOffset, 'smooth');
  // }
  // const range = viewport.getRenderedRange();
  // const startIndex = (range.end - range.start) /2;
  // if(startIndex > 14){
  //   // viewport.scrollToIndex(nextIndex, 'smooth');
  //   const currentScrollOffset = viewport.measureScrollOffset();
  // // if(currentScrollOffset > 250){
  //   const newOffset = currentScrollOffset + 29; // Move down one item size
  //   viewport.scrollToOffset(newOffset, 'smooth');
  // }
  const scrollOffset = viewport.measureScrollOffset();
  const viewportSize = viewport.getViewportSize();

  // Calculate the index at the viewport's end
  const endIndex = Math.floor(((scrollOffset + viewportSize) / this.itemSize)-3);
  if(nextIndex >= endIndex){
    let offset = (scrollOffset) + 30;
    viewport.scrollToOffset(offset, 'smooth');
  }

  // console.log('Item index at viewport end:', endIndex);


  // Scroll to the offset of the item at the end index
}
}
scrollToSelectedRow(ldataList: any) {
const selectedRowIndex = this.lastSelctedRow;
// const selectedZeroRowIndex = ldataList.findIndex(
//   (row: any) => row === this.selectedRow[0]
// );
this.scrollToRow(this.viewPort!,selectedRowIndex+1 , ldataList.length);


}
SetDelayForLoader() {
  let lClearFlag = this.commonService.clearDateRangeLoader;
  if (lClearFlag == true) {
    this.DeleteOrderLoading = true;
  }
  setTimeout(() => {
    this.filterAllData();
    if (lClearFlag == true) {
      this.commonService.clearDateRangeLoader = false;
      this.DeleteOrderLoading = false;
    }
  }, 1 * 1000);
}
changecustomer(event: any) {
  let lCustomerCode = event;
  this.dropdown.setCustomerCode(lCustomerCode);
  // Refresh the Value of CustomerCode in SideMenu;
  this.reloadService.reloadCustomerSideMenu.emit();

  this.SelectedProjectCodes = []; // Auto clear the selected project on customer change.
  this.changeproject(this.SelectedProjectCodes);
}

// RefreshProject: any[] = [];
changeproject(event: any) {
  this.SelectedProjectCodes = event;
  console.log('SelectedProjectCodes', this.SelectedProjectCodes);
  // Refresh the ProjectCode in SideMenu;
  this.dropdown.setProjectCode(this.SelectedProjectCodes);

  if (this.SelectedProjectCodes.length == 0) {
    this.deleteorderarray = [];
    this.hideTable = true;
  }else{
    this.hideTable = false;
  }
  this.reloadService.reloadProjectSideMenu.emit();
}

selectAllProject() {
  this.SelectedProjectCodes = this.ProjectList.map(
    (option: { ProjectCode: any }) => option.ProjectCode
  );
  this.deletedorderForm.controls['project'].patchValue(this.SelectedProjectCodes);
  this.changeproject(this.SelectedProjectCodes);
}

  clearAllProject() {
    this.hideTable = true;
    this.SelectedProjectCodes = [];
    this.deleteorderarray = [];
    this.changeproject(this.SelectedProjectCodes);
  }

  pSearchRefreshFlag: boolean = false;
  ReloadLastSearch() {
    let lItem: any = localStorage.getItem('lastRow_Deleted');
    let lData: any = localStorage.getItem('lastSearch_Deleted');
    if (lItem) {
      lItem = JSON.parse(lItem);
      lData = JSON.parse(lData);

      this.pSearchRefreshFlag = true;
      this.populateFormFromJson(lData);
      this.filterAllData();

      setTimeout(() => {
        this.deleteorderarray.forEach((x) => {
          if (x.OrderNo === lItem.OrderNo) {
            x.rowSelected = true;
          }
        });
      }, 1 * 500);
    }

    localStorage.removeItem('lastRow_Deleted');
    localStorage.removeItem('lastSearch_Deleted');
  }

  // New function to populate form from JSON
  populateFormFromJson(jsonData: any): void {
    try {
      // Ensure jsonData is an object
      if (!jsonData || typeof jsonData !== 'object') {
        console.error('Invalid JSON data provided');
        return;
      }

      // Use patchValue to update form controls (partial updates are allowed)
      this.searchForm.patchValue({
        OrderNo: jsonData.OrderNo || '',
        PONo: jsonData.PONo || '',
        WBS1: jsonData.WBS1 || '',
        WBS2: jsonData.WBS2 || '',
        WBS3: jsonData.WBS3 || '',
        ProdType: jsonData.ProdType || '',
        StructureElement: jsonData.StructureElement || '',
        dateRangeCreated: jsonData.dateRangeCreated || '',
        dateRangeRequired: jsonData.dateRangeRequired || '',
        OrderWeight:
          jsonData.OrderWeight !== undefined ? jsonData.OrderWeight : null,
        ProjectTitle: jsonData.ProjectTitle || '',
      });

      console.log('Form populated with JSON data:', this.searchForm.value);
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }

  async UpdateAddressCode(pOrderNumber: any) {
    // Get the selected AddressCode
    const addresResponse = await this.GetAddCodeforOrder(pOrderNumber);

    // Update the AddressCode
    if (addresResponse) {
      let lAddressCodes: any = [];
      if (addresResponse.AddressCode) {
        lAddressCodes.push(addresResponse.AddressCode);
        this.dropdown.setAddressList(lAddressCodes);
        this.reloadService.reloadAddress.emit();
      }
    }
  }
  async GetAddCodeforOrder(lOrderNumber: any): Promise<any> {
    try {
      const data = await this.orderService
        .GetAddCodeforOrder(lOrderNumber)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // ------------------ADDRESS CODE----------------------- //
  AddressList: any[] = [];
  SelectedAddressCode: any[] = [];

  changeAddress(event: any) {
    console.log('SelectedAddressCode', this.SelectedAddressCode);
    // Refresh the AddressCode in SideMenu;
    this.dropdown.setAddressList(this.SelectedAddressCode);
    this.reloadService.reloadAddressSideMenuEmitter.emit();
  }

  selectAll_Address() {
    this.SelectedAddressCode = this.ProjectList.map(
      (option: { ProjectCode: any }) => option.ProjectCode
    );
    this.deletedorderForm.controls['address'].patchValue(
      this.SelectedAddressCode
    );
    this.changeAddress(this.SelectedAddressCode);
  }

  ClearAll_Address() {
    this.hideTable = true;
    this.SelectedAddressCode = [];
    this.deleteorderarray = [];
    this.changeAddress(this.SelectedAddressCode);
  }
}
