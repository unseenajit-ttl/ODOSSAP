import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { NavItem } from './nav-item';
import { dataTransferService } from 'src/app/SharedServices/dataTransferService';
import { OrderService } from 'src/app/Orders/orders.service';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor } from '@angular/common';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { LoginService } from 'src/app/services/login.service';
import { CreateordersharedserviceService } from 'src/app/Orders/createorder/createorderSharedservice/createordersharedservice.service';
import { AuthService } from 'src/app/core/oauth.service';
import { Location } from '@angular/common';
import { OrderSummarySharedServiceService } from 'src/app/Orders/order-shared-services/order-summary-services/order-summary-shared-service.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'SideMenu',
  templateUrl: 'SideMenu.html',
  styleUrls: ['SideMenu.css'],
  animations: [
    trigger('slidein', [
      transition(':enter', [
        // when ngif has true
        style({ transform: 'translateX(-100%)' }),
        animate(250, style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        // when ngIf has false
        animate(250, style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class SideMenu implements OnInit {
  @ViewChild('InputCustomerOrder')
  InputCustomerOrder!: ElementRef;
  @ViewChild('InputProjectOrder')
  InputProjectOrder!: ElementRef;
  @ViewChild('InputCustomerCreateOrder')
  InputCustomerCreateOrder!: ElementRef;
  @ViewChild('InputProjectCreateOrder')
  InputProjectCreateOrder!: ElementRef;
  @ViewChild('InputCustomerDetailling')
  InputCustomerDetailling!: ElementRef;
  @ViewChild('InputProjectDetailling')
  InputProjectDetailling!: ElementRef;

  @Output() reloadRequest = new EventEmitter<any>();
  @ViewChild('select') select: ElementRef | undefined;
  @ViewChild('orderingCustomer') orderingCustomer!: MatSelect;
  @ViewChild('orderingProject') orderingProject!: MatSelect;
  @ViewChild('OrderngAddress') OrderngAddress!: MatSelect;
  @ViewChild('createCustomer') createCustomer!: MatSelect;
  @ViewChild('createProject') createProject!: MatSelect;
  @ViewChild('createAddress') createAddress!: MatSelect;
  @ViewChild('detailingCustomer') detailingCustomer!: MatSelect;
  @ViewChild('detailingProject') detailingProject!: MatSelect;

  expanded: boolean = true;

  [x: string]: any;
  public DisplayName: any = '';
  customerList: any = [];
  addressList: any = [];
  PageName: any = '';
  projectList: any = [];
  SelectCustomerCode: any = null;
  SelectProductCode: any = null;
  currentDateTime: any;
  SelectProjectCode: any[] = [];
    SelectAddress: any[] = [];

  ProjectList: any;
  filteredOptions: any = [];
  filteredProjectOptions: any = [];
  filteredAddressOptions: any = [];
  searchcustomertext: any;
  searchprojecttext: any;
  isPanelOpen: boolean = false;

  searchAddressText: string = "";


  //Detailing
  DetailingcustomerList: any = [];
  DetailingprojectList: any = [];
  SelectDetailingCustomerCode: any = null;
  SelectDetailingProductCode: any = null;
  SelectDetailingProjectCode: any[] = [];
  DetailingCutsomerfilteredOptions: any = [];
  DetailingProjectfilteredOptions: any = [];
  searchDetailingcustomertext: any;
  searchDetailingprojecttext: any;
  //Detailing
  isOrdering: boolean = false;

  UserName: any = '';
  menu: NavItem[] = [
    {
      displayName: 'Home',
      route: '',
      children: [
        {
          displayName: 'Home',
          route: '',
        },
      ],
    },
    {
      displayName: 'Ordering',
      children: [
        {
          displayName: 'Offline BBS',
          route: 'order/OfflineBBS',
        },
        {
          displayName: 'Draft Orders',
          route: '/order/draftorder',
          tooltip: 'List of draft orders (预备订单)'
        },
        {
          displayName: 'Create New Orders',
          route: 'order/createorder',
          tooltip: 'Create a new order (建立新订单)'
        },
        {
          displayName: 'Active Orders',
          route: '/order/activeorder',
          tooltip: 'List of active orders (活跃订单)'
        },

        {
          displayName: 'Delivered Orders',
          route: '/order/deliveredorder',
          tooltip: 'List of delivered orders (已交货的订单)'
        },
        {
          displayName: 'Drawing Repository',
          route: 'order/drawingrepository',
          tooltip: 'Store, Access and View Drawings (提交, 读取, 浏览图纸)'
        },
        {
          displayName: 'Drawing Approval',
          route: 'order/customer-drawing-review',
          tooltip: 'Store, Access and View Drawings (提交, 读取, 浏览图纸)',
        },
        {
          displayName: 'Deleted Orders',
          route: '/order/deletedorder',
          tooltip: 'List of last seven days deleted orders (删除的订单)'
        },
        {
          displayName: 'Cancelled Orders',
          route: 'order/cancelledorder',
          tooltip: 'List of cancelled orders (取消的订单)'
        },
        // {
        //   displayName: 'Components',
        //   route: 'order/component',
        // },
        // {
        //   displayName: 'Assign WBS',
        //   route: 'order/assignwbs',
        // },
        {
          displayName: 'Upcoming Orders',
          route: 'order/upcomingorders',
          tooltip: 'List of upcoming orders (即将到来的订单)'
        },
        {
          displayName: 'Process Order',
          route: 'order/processorder',
          tooltip: 'Checking and receiving submitted orders'
        },
      ],
    },
    {
      displayName: 'Admin',
      children: [],
    },
    {
      displayName: 'WBS Management',

      children: [],
    },
    {
      displayName: 'Master',
      children: [],
    },
    {
      displayName: 'Detailing',
      children: [],
    },
    {
      displayName: 'Parameter Set',
      children: [],
    },
    ///
    {
      displayName: 'Utility',
      children: [],
    },

    {
      displayName: 'ESM',
      children: [
        // {
        //   displayName: 'ESM Tracker',
        //   route: '/master/esmtracker',
        // },
        // {
        //   displayName: 'ESM CAB BBS Posting',
        //   route: '/wbs/esmcabbbsposting',
        // },
        // {
        //   displayName: 'Copy BBS',
        //   route: '/wbs/copy-bbs',
        // }
      ],
    },

    {
      displayName: 'Reports',
      children: [
        {
          displayName: 'Tonnage Report',
          route: '/reports/tonnagereport',
        },

        {
          displayName: 'ESM Tonnage Report',
          route: '/reports/esmtonnagereport',
        },
        {
          displayName: 'Project Tonnage Report',
          route: '/reports/projectTonnageReport',
        },
        {
          displayName: 'BPC Order Entry Report',
          route: '/reports/bpcordereentryreport',
        },
        {
          displayName: 'Order Status Monitoring Report',
          route: '/reports/OrderStatusMonitoring',
        },
      ],
    }
  ];

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  loading = false;
  constructor(
    public activeRoute: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private transfereService: dataTransferService,
    public router: Router,
    private orderService: OrderService,
    private commonService: CommonService,
    public datepipe: DatePipe,
    private dropdown: CustomerProjectService,
    private reloadService: ReloadService,
    private loginService: LoginService,
    private createSharedService: CreateordersharedserviceService,
    private authService: AuthService,
    private location: Location,
    private ordersummarySharedService: OrderSummarySharedServiceService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    console.log(this.activeRoute);

    // if(this.activeRoute.snapshot.url[0]==undefined)
    // { this.DisplayName='Home';
    //   sessionStorage.setItem('displayscreenname', this.DisplayName);

    // }

    this.currentDateTime = this.datepipe.transform(
      new Date(),
      'dd/MMM/yyyy h:mm:ss'
    );
    this.transfereService.Pagename.subscribe((pagename) => {
      this.PageName = pagename;
    });

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        this.loading = true;
      }
      if (
        ev instanceof NavigationEnd ||
        ev instanceof NavigationCancel ||
        ev instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
    console.log(this.PageName);
    if (this.PageName != '') {
      sessionStorage.setItem('displayscreenname', this.PageName);
      console.log(this.PageName);
      this.DisplayName = sessionStorage.getItem('displayscreenname');
      // do whatever needed
    }
    this.DisplayName = sessionStorage.getItem('displayscreenname');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  Tempcustomercode: any;
  TempProjectCode: any;
  ngOnInit() {
    this.Tempcustomercode = localStorage.getItem('CustomerCode');
    this.TempProjectCode = localStorage.getItem('ProjectCode');
    if (this.Tempcustomercode != null) {
      this.dropdown.setCustomerCode(this.Tempcustomercode);
      this.SelectDetailingCustomerCode = this.Tempcustomercode;
      this.GetDetailingProject(this.SelectDetailingCustomerCode);
    }
    // if(this.TempProjectCode!=null)
    // {
    //   this.dropdown.setProjectCode(this.TempProjectCode);
    //   this.SelectDetailingProjectCode[0]=this.TempProjectCode;
    // }
    this.reloadService.reloadOrderSideMenu$.subscribe((data) => {
      this.UserName = this.loginService.GetDislayName();
      this.GetOrderCustomer();
      this.UpdateOrderingList();
      this.UpdateHomeandReports(); // Update sidemenu for external users.
      this.UpdateOrderAssignmentMenu(); // Update sidemenu for internal users.
    });
    this.reloadService.reloadDetailingSideMenu$.subscribe((data) => {
      this.UserName = this.loginService.GetDislayName();
      this.GetDetailingCustomer();
      this.UpdateDetailingList(data);
      this.UpdateHomeandReports(); // Update sidemenu for external users.
    });

    this.reloadService.reloadCreateOrderCusProj$.subscribe((data) => {
      this.SelectCustomerCode = this.dropdown.getCustomerCode();
      this.SelectProjectCode[0] = this.dropdown.getProjectCode()[0];
      if(this.dropdown.getAddressList()[0]) {
        this.SelectAddress[0] = this.dropdown.getAddressList()[0];
      }

      this.changeCustomer_Reload(this.SelectCustomerCode);

      if(this.SelectProjectCode[0]) {
        this.GetAddress(this.SelectProjectCode);
      }
      // this.changeDetectorRef.detectChanges();
    });

    this.reloadService.reloadCreateOrderAddress$.subscribe((data) => {
      // Update the selected Address when routing from 5 pages to CreateOrder.
      if(this.dropdown.getAddressList()[0]) {
        this.SelectAddress[0] = this.dropdown.getAddressList()[0];
      }
    });
    

    this.reloadService.reloadSideMenu$.subscribe((data) => {
      this.CloseSideMenu();
    });
    // this.GetOrderCustomer();

    this.GetDetailingCustomer();

    //this.UpdateOrderingList();commneted for sometime
    console.log(this.DisplayName);
    /**
     * Get the last state of Side menu from local storage
     */
    this.SetSideMenu();
  }

  onDropdownOpenedChange(isOpened: boolean, dropDown: string) {
    if (isOpened) {
      this.commonService.includeOptionalProjects = false;
      // Focus the input field when the dropdown is opened
      if (dropDown == 'InputCustomerOrder') {
        this.InputCustomerOrder.nativeElement.focus();
      } else if (dropDown == 'InputProjectOrder') {
        this.InputProjectOrder.nativeElement.focus();
      } else if (dropDown == 'InputCustomerCreateOrder') {
        this.InputCustomerCreateOrder.nativeElement.focus();
      } else if (dropDown == 'InputProjectCreateOrder') {
        this.InputProjectCreateOrder.nativeElement.focus();
      } else if (dropDown == 'InputCustomerDetailling') {
        this.InputCustomerDetailling.nativeElement.focus();
      } else if (dropDown == 'InputProjectDetailling') {
        this.InputProjectDetailling.nativeElement.focus();
      }
    }
  }

  onSearchInputKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.stopPropagation(); // Prevent the spacebar key from propagating
    }
  }

  triggerReload() {
    this.reloadService.reloadComponent.emit(this.DisplayName);
  }
  selectInput(event: MouseEvent, select: any) {
    event.stopPropagation();
    select.open();
  }

  selectedmenu(menuname: any, route: any) {
    this.showSubMenu = false;
    this.hoverSubMenuFlag = false;

    this.authService.targetURL = route;
    sessionStorage.setItem('displayscreenname', menuname);
    this.DisplayName = sessionStorage.getItem('displayscreenname');
    // console.log("DisplayName", this.DisplayName)
    if (
      this.DisplayName == 'Cancelled Orders' ||
      this.DisplayName == 'Deleted Orders' ||
      this.DisplayName == 'Components' ||
      this.DisplayName == 'Delivered Orders' ||
      this.DisplayName == 'Active Orders' ||
      this.DisplayName == 'Draft Orders'
    ) {
      this.isOrdering = true;
    } else {
      this.isOrdering = false;
    }
    //Refresh Process Order Page
    this.RefreshProcessOrder(route);

    let lFlag = false;
    if(menuname == 'Create New Orders') {
      lFlag = true;
    }
    this.dropdown.selectCreateOrder_Flag = lFlag;
  }
  updateFilteredProjectOptions(projectname: any) {
    this.filteredProjectOptions = JSON.parse(JSON.stringify(this.projectList));
    if (projectname != undefined) {
      this.filteredProjectOptions = this.projectList.filter(
        (item: any) =>
          item.ProjectTitle?.toLowerCase().includes(
            projectname.trim().toLowerCase()
          ) ||
          item.ProjectCode?.toLowerCase().includes(
            projectname.trim().toLowerCase()
          ) ||
          this.SelectProjectCode.includes(item.ProjectCode)
      );
      setTimeout(() => {
        if (this.createProject) {
          if(this.createProject.panel){
          const panel2 = this.createProject.panel
            .nativeElement as HTMLDivElement;
          if (panel2) panel2.scrollTop = 0;
          }
        }
        if (this.orderingProject) {
          if(this.orderingProject.panel){
          const panel3 = this.orderingProject.panel
            .nativeElement as HTMLDivElement;
          if (panel3) panel3.scrollTop = 0;
          }
        }
      }, 200);
    }
  }
  updateFilteredOptions(customername: any) {
    this.filteredOptions = this.customerList;
    if (customername != undefined) {
      this.filteredOptions = this.customerList.filter(
        (item: any) =>
          item.CustomerName?.toLowerCase().startsWith(
            customername.trim().toLowerCase()
          ) ||
          item.CustomerCode?.toLowerCase().includes(
            customername.trim().toLowerCase()
          )
      );
      setTimeout(() => {
        if (this.createCustomer) {
          const panel1 = this.createCustomer.panel
            .nativeElement as HTMLDivElement;
          if (panel1) panel1.scrollTop = 0;
        }
        if (this.orderingCustomer) {
          const panel12 = this.orderingCustomer.panel
            .nativeElement as HTMLDivElement;
          if (panel12) panel12.scrollTop = 0;
        }
      }, 200);
    }
  }

  isSelectAllClicked: boolean = false;
  selectAll() {
    this.isSelectAllClicked = true;
    this.SelectProjectCode = this.filteredProjectOptions.map(
      (option: { ProjectCode: any }) => option.ProjectCode
    );
    this.commonService.includeOptionalProjects = false;
    if (confirm('Include All Optional Projects (包括全部可选工程项目)?')) {
      this.commonService.includeOptionalProjects = true;
    }
  }

  clearAll() {
    this.isSelectAllClicked = true;
    this.commonService.includeOptionalProjects = false;
    this.SelectProjectCode = [];
  }

  //Order
  GetOrderCustomer(): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();
    this.orderService.GetCustomers(pGroupName, pUserType).subscribe({
      next: (response) => {
        this.customerList = response;
        this.filteredOptions = response;

        console.log('customer', response);

        // Run the following loginc incase only a single customer option is available.
        if (response.length == 1) {
          this.SelectCustomerCode = response[0].CustomerCode;
          this.changeCustomer_Reload(response[0].CustomerCode);
        }
        // If there are multiple customers, select the first one by default
        else {
          let UserName = this.loginService.GetGroupName();

          if (UserName && !UserName.includes('natsteel.com.sg')) {
            this.SelectCustomerCode = response[0].CustomerCode;
            this.changeCustomer_Reload(response[0].CustomerCode);
          }
        }
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  changeCustomer_Reload(customerCode: any) {
    //console.log(event);
    this.dropdown.setCustomerCode(this.SelectCustomerCode);
    this.GetOrderProjectsList(this.SelectCustomerCode);

    this.commonService.setLocalStorage('CustomerCode', customerCode);
    this.commonService.setLocalStorage('ProjectCode', null);

    this.searchcustomertext = '';
  }

  changecustomer(event: any) {
    console.log('event', event);
    console.log('changed', this.SelectCustomerCode);

    this.createSharedService.showOrderSummary = false;

    //console.log(event);
    this.dropdown.setCustomerCode(this.SelectCustomerCode);
    this.GetOrderProjectsList(this.SelectCustomerCode);

    this.SelectProjectCode = [];

    this.reloadService.reloadCustomerComponent.emit();
    this.commonService.setLocalStorage('CustomerCode', event.value);
    this.commonService.setLocalStorage('ProjectCode', null);
    this.searchcustomertext = '';
    this.searchprojecttext = '';

  }
  GetOrderProjectsList(pCustomerCode: any): void {
    let pGroupName = this.loginService.GetGroupName();
    let pUserType = this.loginService.GetUserType();
    if (!pGroupName) {
      var receivedData: any = localStorage.getItem('ProcessData');
      receivedData = JSON.parse(receivedData);
      this.loginService.SetGroupName(receivedData.UserName);
      this.loginService.SetUserType(receivedData.UserType);
      pGroupName = receivedData.UserName;
    }
    if (!pUserType) {
      var receivedData: any = localStorage.getItem('ProcessData');
      receivedData = JSON.parse(receivedData);
      this.loginService.SetUserType(receivedData.UserType);
      pUserType = receivedData.UserType;
    }
    this.orderService
      .GetProjects(pCustomerCode, pUserType, pGroupName)
      .subscribe({
        next: (response) => {
          this.projectList = response;
          console.log('this.projectList -> ', this.projectList);
          this.filteredProjectOptions = response;

          // Run the following logic in case there is only a single project option in the list.
          if (response.length == 1) {
            this.onSelectionChange_Wrapper(response[0]);
          }
        },
        error: (e) => { },
        complete: () => {
          // this.loading = false;
        },
      });
  }
  ///Order Part
  //Detailing Part
  GetDetailingCustomer(): void {
    this.commonService.GetCutomerDetails().subscribe({
      next: (response: any) => {
        this.DetailingcustomerList = response;
        this.DetailingCutsomerfilteredOptions = response;
      },
      error: (e: any) => { },
      complete: () => {
        this.loading = false;
      },
    });
  }
  changeDetailingcustomer(event: any): void {
    // this.selectedProject=null;
    console.log(event.value);
    console.log('event:', event);
    console.log('cust:', event);

    this.GetDetailingProject(event.value);
    this.dropdown.setCustomerCode(event.value);
    this.commonService.setLocalStorage('CustomerCode', event.value);
    // this.commonService.setLocalStorage("ProjectCode", null);
    this.searchDetailingcustomertext = '';
    this.reloadService.reloadCustomerComponent.emit();
  }
  GetDetailingProject(customercode: any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response: any) => {
        console.log(response);
        this.DetailingprojectList = response;
        this.filteredDetailingProjectOptions = response;
        console.log(this.DetailingprojectList);
      },

      error: (e: any) => { },
      complete: () => {
        console.log('this.TempProjectCode=>', this.TempProjectCode);
        // this.SelectDetailingProjectCode[0] = this.TempProjectCode.tostring();
        if (this.TempProjectCode) {
          this.dropdown.setDetailingProjectId(Number(this.TempProjectCode));
          this.SelectDetailingProductCode = Number(this.TempProjectCode);
        }

        if (this.DetailingprojectList.length > 0) {
          let index = this.DetailingprojectList.findIndex(
            (x: any) => x.ProjectId === this.SelectDetailingProductCode
          );
          if (index != -1) {
            this.commonService.setLocalStorage(
              'DetailingProjectCode',
              this.DetailingprojectList[index].ProjectCode
            );
            this.triggerReload();
          }
        }
        // this.triggerReload();
      },
    });
  }
  updateDetailingFilteredOptions(customername: any) {
    this.DetailingCutsomerfilteredOptions = this.DetailingcustomerList;
    if (customername != undefined) {
      this.DetailingCutsomerfilteredOptions = this.DetailingcustomerList.filter(
        (item: any) =>
          item.Customername?.toLowerCase().includes(
            customername.trim().toLowerCase()
          ) ||
          item.CustomerNo?.toLowerCase().includes(
            customername.trim().toLowerCase()
          )
      );
      setTimeout(() => {
        if (this.detailingCustomer) {
          const panel = this.detailingCustomer.panel
            .nativeElement as HTMLDivElement;
          panel.scrollTop = 0;
        }
      }, 200);
    }
    console.log(customername);
    console.log(this.DetailingCutsomerfilteredOptions);
  }
  onDetailingSelectionChange(event: any) {
    this.dropdown.setDetailingProjectId(this.SelectDetailingProductCode);
    this.commonService.setLocalStorage('ProjectCode', event.value);
    this.TempProjectCode = event.value;
    let index = this.DetailingprojectList.findIndex(
      (x: any) => x.ProjectId === this.SelectDetailingProductCode
    );
    this.commonService.setLocalStorage(
      'DetailingProjectCode',
      this.DetailingprojectList[index].ProjectCode
    );
    // this.triggerReload();
    this.searchDetailingprojecttext = '';
  }
  updateDetailingFilteredProjectOptions(projectname: any) {
    this.filteredDetailingProjectOptions = JSON.parse(
      JSON.stringify(this.DetailingprojectList)
    );
    if (projectname != undefined) {
      this.filteredDetailingProjectOptions = this.DetailingprojectList.filter(
        (item: any) =>
          item.Description?.toLowerCase().includes(
            projectname.trim().toLowerCase()
          ) ||
          item.ProjectCode?.toLowerCase().includes(
            projectname.trim().toLowerCase()
          )
      );
      console.log(this.filteredDetailingProjectOptions);
    }
  }
  //Detailing Part
  onSelectionChange(event: any) {
    // if (event.value.includes('selectAll')) {
    //   this.SelectProjectCode = this.projectList.map((option: { ProjectCode: any; }) => option.ProjectCode);
    // }

    console.log('PRojectEvent', event);
    this.createSharedService.showOrderSummary = false;
    // localStorage.removeItem('CreateDataProcess');
    // sessionStorage.removeItem('CreateDataProcess');
    this.ordersummarySharedService.SetOrderSummaryData(undefined);

    if (this.DisplayName == 'Create New Orders') {
      // this.SelectProjectCode = [this.SelectProjectCode]
      this.dropdown.setProjectCode(this.SelectProjectCode);
    } else {
      if (this.SelectProjectCode[0] == undefined) {
        this.SelectProjectCode = this.SelectProjectCode.splice(
          1,
          this.SelectProjectCode.length + 1
        );
      }
      this.dropdown.setProjectCode(this.SelectProjectCode);
    }

    // this.commonService.setLocalStorage("CustomerCode", this.SelectCustomerCode);
    this.commonService.setLocalStorage('ProjectCode', event.value);

    // this.triggerReload();
    // Update teh Submission & Eitable values based on Cuatomer & Project;
    this.GetAccessRight();
    //this.searchprojecttext = '';
    if (this.orderingProject) {
      this.orderingProject.close();
    }
  }

  UpdateOrderingList() {
    let userType = this.loginService.GetUserType();
    console.log('Side menu usetype- > ', userType);

    let index = this.menu.findIndex((x) => x.displayName == 'Ordering');

    let children: any[] = [
      {
        displayName: 'Drawing Repository',
        route: 'order/drawingrepository',
        tooltip: 'Store, Access and View Drawings (提交, 读取, 浏览图纸)'
      },
      {
        displayName: 'Drawing Approval',
        route: 'order/customer-drawing-review',
        tooltip: 'Store, Access and View Drawings (提交, 读取, 浏览图纸)',
      },
    ];
    if (userType != 'MJ') {
      children = [
        {
          displayName: 'Offline BBS',
          route: 'order/OfflineBBS',
        },
        {
          displayName: 'Draft Orders',
          route: '/order/draftorder',
          tooltip: 'List of draft orders (预备订单)'
        },
        {
          displayName: 'Create New Orders',
          route: 'order/createorder',
          tooltip: 'Create a new order (建立新订单)'
        },
        {
          displayName: 'Active Orders',
          route: '/order/activeorder',
          tooltip: 'List of active orders (活跃订单)'
        },

        {
          displayName: 'Delivered Orders',
          route: '/order/deliveredorder',
          tooltip: 'List of delivered orders (已交货的订单)'
        },
        {
          displayName: 'Drawing Repository',
          route: 'order/drawingrepository',
          tooltip: 'Store, Access and View Drawings (提交, 读取, 浏览图纸)'
        },
        {
          displayName: 'Drawing Approval',
          route: 'order/customer-drawing-review',
          tooltip: 'Store, Access and View Drawings (提交, 读取, 浏览图纸)',
        },
        {
          displayName: 'Deleted Orders',
          route: '/order/deletedorder',
          tooltip: 'List of last seven days deleted orders (删除的订单)'
        },
        {
          displayName: 'Cancelled Orders',
          route: 'order/cancelledorder',
          tooltip: 'List of cancelled orders (取消的订单)'
        },
        // {
        //   displayName: 'Components',
        //   route: 'order/component',
        // },
        // {
        //   displayName: 'Assign WBS',
        //   route: 'order/assignwbs',
        // },
        {
          displayName: 'Upcoming Orders',
          route: 'order/upcomingorders',
          tooltip: 'List of upcoming orders (即将到来的订单)'
        },
      ];
    }
    if (
      userType == 'PL' ||
      userType == 'AD' ||
      userType == 'PM' ||
      userType == 'PA' ||
      userType == 'P1' ||
      userType == 'P2' ||
      userType == 'P3' ||
      userType == 'PU' ||
      userType == 'TE' ||
      userType == 'MJ'
    ) {
      let item = {
        displayName: 'Process Order',
        route: 'order/processorder',
        tooltip: 'Checking and receiving submitted orders'
      };
      children.push(item);
    }

    // if (
    //   userType == 'SU1'|| userType == 'SU2'||userType == 'SU3'
    // ) {
    //   let item = {
    //     displayName: 'Upcoming Orders',
    //     route: 'order/upcomingorders',
    //   };
    //   children.push(item);
    // }
    console.log('children', children);
    this.menu[index].children = children;
    let lDataList: any[] = [];
    if (userType != 'MJ') {
      lDataList = [
        {
          displayName: 'Create New Orders',
          route: 'order/createorder',
          tooltip: 'Create a new order (建立新订单)'
        },
        {
          displayName: 'Active Orders',
          route: '/order/activeorder',
          tooltip: 'List of active orders (活跃订单)'
        },
        {
          displayName: 'Delivered Orders',
          route: '/order/deliveredorder',
          tooltip: 'List of delivered orders (已交货的订单)'
        },
        {
          displayName: 'Draft Orders',
          route: '/order/draftorder',
          tooltip: 'List of draft orders (预备订单)'
        },
        {
          displayName: 'Deleted Orders',
          route: '/order/deletedorder',
          tooltip: 'List of last seven days deleted orders (删除的订单)'
        },
        {
          displayName: 'Cancelled Orders',
          route: 'order/cancelledorder',
          tooltip: 'List of cancelled orders (取消的订单)'
        },
        {
          displayName: 'Upcoming Orders',
          route: 'order/upcomingorders',
          tooltip: 'List of upcoming orders (即将到来的订单)'
        },
      ];
    }

    if (
      userType == 'PL' ||
      userType == 'AD' ||
      userType == 'PM' ||
      userType == 'PA' ||
      userType == 'P1' ||
      userType == 'P2' ||
      userType == 'P3' ||
      userType == 'PU' ||
      userType == 'TE' ||
      userType == 'MJ'
    ) {
      let item = {
        displayName: 'Process Order',
        route: 'order/processorder',
        tooltip: 'Checking and receiving submitted orders'
      };
      // Add obj to the start of the array
      lDataList.unshift(item);
    }
    this.gVerticleSideMenu = [...lDataList, ...this.gVerticleSideMenu];
  }

  UpdateMenu(item: any) {
    let index = this.menu.findIndex((x) => x.displayName === item.ParentForm);
    let obj = {
      displayName: item.vchFormDescription,
      route: item.vchTargetURL,
    };

    if (index != -1) {
      this.menu[index].children?.push(obj);
    }
  }

  gVerticleSideMenu: any[] = [];
  UpdateDetailingList(dataList: any) {
    console.log('menu', this.menu);
    console.log('dataList', dataList);

    let lDataList: any[] = [];
    dataList.forEach((element: any) => {
      this.UpdateMenu(element);
      if (element.ParentForm) {
        let obj = {
          displayName: element.vchFormDescription,
          route: element.vchTargetURL,
        };
        lDataList.push(obj);
      }
    });
    // let obj = {
    //   displayName: 'Process Order',
    //   route: 'order/processorder',
    // };
    // lDataList.push(obj);

    // if (this.gVerticleSideMenu.length == 0) {
    //   this.gVerticleSideMenu = lDataList;
    // } else {
    // }

    let index = lDataList.findIndex((x) => x.displayName == 'WBS Maintenance');
    if (index != -1) {
      this.gVerticleSideMenu.push(lDataList[index]);
    }
    index = lDataList.findIndex((x) => x.displayName == 'WBS Posting');
    if (index != -1) {
      this.gVerticleSideMenu.push(lDataList[index]);
    }
    index = lDataList.findIndex((x) => x.displayName == 'Group Mark Listing');
    if (index != -1) {
      this.gVerticleSideMenu.push(lDataList[index]);
    }
    index = lDataList.findIndex((x) => x.displayName == 'Copy Groupmarking');
    if (index != -1) {
      this.gVerticleSideMenu.push(lDataList[index]);
    }
    index = lDataList.findIndex((x) => x.displayName == 'Copy WBS');
    if (index != -1) {
      this.gVerticleSideMenu.push(lDataList[index]);
    }
    index = lDataList.findIndex((x) => x.displayName == 'MESH Parameter Set');
    if (index != -1) {
      this.gVerticleSideMenu.push(lDataList[index]);
    }

    console.log('test12', lDataList);

    let tempList: any[] = [];
    for (let i = 0; i < this.menu.length; i++) {
      if (this.menu[i].children?.length == 0) {
        tempList.push(this.menu[i].displayName);
      }
    }

    console.log('tempList', tempList);
    tempList.forEach((element) => {
      let index = this.menu.findIndex((x) => x.displayName === element);
      this.menu.splice(index, 1);
    });
    console.log('this.menu', this.menu);

    // // For WBS
    // let index = this.menu.findIndex((x) => x.displayName === 'WBS Management');
    // let wbsChild: any[] = [];
    // dataList.forEach((element: { vchFormDescription: string }) => {
    //   if (element.vchFormDescription === 'WBS Maintenance') {
    //     let obj = {
    //       displayName: 'WBS Maintenance ',
    //       route: '/wbs/wbsmaintenace',
    //     };
    //     wbsChild.push(obj);
    //   } else if (element.vchFormDescription === 'WBS Posting') {
    //     let obj = {
    //       displayName: 'WBS Posting',
    //       route: '/wbs/wbpposting',
    //     };
    //     wbsChild.push(obj);
    //   }
    // });

    // if (wbsChild.length > 0) {
    //   this.menu[index].children = wbsChild;
    // } else {
    //   this.menu.splice(index, 1);
    // }

    // // For Parameter Set
    // index = this.menu.findIndex((x) => x.displayName === 'Parameter Set');
    // let PMSetFlag = false;
    // dataList.forEach((element: { vchFormDescription: string }) => {
    //   if (element.vchFormDescription === 'Parameter Set') {
    //     PMSetFlag = true;
    //   }
    // });
    // if (!PMSetFlag) {
    //   this.menu.splice(index, 1);
    // }

    // // For Detailing
    // index = this.menu.findIndex((x) => x.displayName === 'Detailing');
    // let DetailingFlag = false;
    // dataList.forEach((element: { vchFormDescription: string }) => {
    //   if (element.vchFormDescription === 'Group Mark List') {
    //     DetailingFlag = true;
    //   }
    // });
    // if (!DetailingFlag) {
    //   this.menu.splice(index, 1);
    // }
  }

  RefreshOrderCreation() {
    this.createSharedService.showOrderSummary = false;
    this.createSharedService.tempProjectOrderSummaryList = undefined;
    this.createSharedService.tempOrderSummaryList = undefined;
    this.createSharedService.selectedStructElements = [];
    this.createSharedService.selectedWBS = [];
    this.ordersummarySharedService.SetOrderSummaryData(undefined);
  }
  GetFirstLetter(userName: any) {
    if (userName) {
      return userName[0];
    }
    return '';
  }

  setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  OpenHome(pImageNo: any) {
    if (pImageNo == 1) {
      window.location.href = 'https://ump.natsteel.com.sg/';
    } else {
      window.open('https://ump.natsteel.com.sg/', '_blank');
      //window.location.href = 'https://ump.natsteel.com.sg/';
    }
  }

  showCreateOrderDropdown(): boolean {
    let lCurrentPath = this.location.path();
    if (this.DisplayName === 'Create New Orders') {
      return true;
    }
    if (lCurrentPath) {
      if (lCurrentPath.includes('createorder')) {
        this.DisplayName = 'Create New Orders';
        return true;
      }
    }
    return false;
  }
  @ViewChild('snav') myElement: any;
  CloseSideMenu() {
    if (
      this.DisplayName == 'Create New Orders' ||
      this.DisplayName == 'Group Mark Listing'
    ) {
      if (this.myElement) {
        if (this.myElement.opened) {
          // this.myElement.opened = false;
          this.isCollapsed = true;
          localStorage.setItem('sideMenuState', this.isCollapsed.toString());
        }
      }
    }
  }

  gChildrenList: any[] = [];
  freezSideMenu: boolean = false;
  isCollapsed = false; // State variable to track collapsed state
  visiblePopUp: boolean = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; // Toggle the sidebar state
    localStorage.setItem('sideMenuState', this.isCollapsed.toString());
    this.freezSideMenu = false;
    if (!this.isCollapsed) {
      this.freezSideMenu = true;
    }
  }

  showIcon(pName: any) {
    for (let i = 0; i < this.menu.length; i++) {
      let lItem = this.menu[i];
      if (lItem.displayName.includes(pName)) {
        return true;
      }
    }
    return false;
  }

  setActiveTab(child: any) {
    let pLink = child.route;
    this.router.navigate([pLink]);

    this.selectedmenu(child.displayName, child.route);
    this.RefreshOrderCreation();
  }

  showSubMenu: boolean = false;

  GetChildrenList(pName: any) {
    for (let i = 0; i < this.menu.length; i++) {
      let lItem: any = this.menu[i];
      if (lItem.displayName.includes(pName)) {
        this.gChildrenList = lItem.children;
      }
    }
    // return [];
  }
  hoveredIndex: any = '';
  hoverSubMenuFlag: boolean = false;
  onMouseEnter(index: any) {
    this.hoveredIndex = index;
    this.showSubMenu = true;
    this.GetChildrenList(index);
  }

  onMouseLeave() {
    this.showSubMenu = false;

    // this.hoveredIndex = undefined;
    // let lIndex = 0;
    // for (let i = 0; i < this.menu.length; i++) {
    //   let lItem: any = this.menu[i];
    //   if (lItem.displayName.includes(pName)) {
    //     lIndex = i;
    //     break;
    //   }
    // }

    // if (lIndex == 0 || lIndex == this.menu.length - 1) {
    //   // this.showSubMenu = false;
    // }
  }
  onMouseSubMenuEnter() {
    // this.hoveredIndex = undefined;
    this.hoverSubMenuFlag = true;
  }
  onMouseSubMenuLeave() {
    // this.hoveredIndex = undefined;
    this.hoverSubMenuFlag = false;
    this.showSubMenu = false;
  }

  GetSubMenuTop() {
    let lTop = 116;
    let pName = this.hoveredIndex;
    for (let i = 0; i < this.menu.length; i++) {
      let lItem: any = this.menu[i];
      if (lItem.displayName.includes(pName)) {
        lTop += 2;
        break;
      }
      lTop += 48;
    }

    let lReturn = lTop.toString() + 'px';
    return lReturn;
  }

  showOrderingMenu(item: any) {
    let lUserId = this.loginService.GetUserId();
    if (item.displayName.toLowerCase().includes('order')) {
      if (item.displayName != 'Process Order' && lUserId == 3) {
        return false;
      }
    }
    return true;
  }
  showOrderingMenuVerticle(pChild: any, itemName: any) {
    let lUserId = this.loginService.GetUserId();
    if (itemName == 'Ordering') {
      if (pChild.displayName != 'Process Order' && lUserId == 3) {
        return false;
      }
    }
    return true;
  }

  SetSideMenu() {
    let lState = localStorage.getItem('sideMenuState');
    if (lState) {
      if (lState == 'true') {
        this.isCollapsed = true;
      } else {
        this.isCollapsed = false;
      }

      this.freezSideMenu = false;
      if (!this.isCollapsed) {
        this.freezSideMenu = true;
      }
    }
  }
  RefreshProcessOrder(pTarget: string) {
    if (pTarget.toLowerCase().includes('processorder')) {
      let lCurrentPath = this.location.path();
      if (lCurrentPath.toLowerCase().includes('processorder')) {
        //refresh process order
        location.reload();
      }
    }
  }

  displayCustomer_Single(): string {
    return this.filteredOptions[0]?.CustomerName;
  }
  displayProject_Single(): string {
    return this.filteredProjectOptions[0]?.ProjectTitle;
  }
  displayAddress_Single(): string {
    return this.filteredAddressOptions[0]?.projectAddress;
  }

  ShowSingleCustomer(): boolean {
    if (this.customerList?.length == 1 && !this.searchcustomertext) {
      return true;
    }
    return false;
  }
  ShowSingleProject(): boolean {
    if (
      this.customerList?.length == 1 &&
      this.projectList?.length == 1 &&
      !this.searchprojecttext
    ) {
      return true;
    }
    return false;
  }

  ShowSingleAddress(): boolean {
    if (this.customerList?.length == 1 && this.projectList?.length == 1 && !this.searchprojecttext &&
      this.addressList?.length == 1 &&
      !this.searchaddresstext
    ) {
      return true;
    }
    return false;
  }

  onSelectionChange_Wrapper(pProject: any) {
    this.SelectProjectCode[0] = pProject.ProjectCode;
    this.changeProjectforBoth({ value: pProject.ProjectCode },"O", false, false, false, false);
  }

  ShowDetailling(): boolean {
    if (this.router.url.includes('drawingreport')) {
      return false;
    }
    let lCurrentPath = this.location.path();
    if (lCurrentPath) {
      if (
        this.DisplayName != 'Create New Orders' &&
        this.DisplayName != 'Cancelled Orders' &&
        this.DisplayName != 'Upcoming Orders' &&
        this.DisplayName != 'Deleted Orders' &&
        this.DisplayName != 'Components' &&
        this.DisplayName != 'Delivered Orders' &&
        this.DisplayName != 'Active Orders' &&
        this.DisplayName != 'Draft Orders' &&
        this.DisplayName != 'Process Order' &&
        this.DisplayName != 'ESM Tracker' &&
        this.DisplayName != 'ESM CAB BBS Posting' &&
        this.DisplayName != 'Copy BBS' &&
        this.DisplayName != 'Tonnage Report' &&
        this.DisplayName != 'ESM Tonnage Report' &&
        this.DisplayName != 'Drawing Repository' &&
        this.DisplayName != 'Project Tonnage Report' &&
        this.DisplayName != 'Drawing Approval' &&
        this.DisplayName != 'BPC Pending ENT'
      ) {
        return true;
      } else {
        return false;
      }
      // if (lCurrentPath.includes('order')) {
      //   return false;
      // } else {
      //   return true;
      // }
    } else {
      // For HomePage where the currentpath is empty
      return false;
    }
  }

  UpdateHomeandReports() {
    let UserName = this.loginService.GetGroupName();
    if (UserName && !UserName.includes('natsteel.com.sg')) {
      // Remove Reports from sidemenu.
      let lIndex = this.menu.findIndex((x) => x.displayName === 'Reports');
      if (lIndex != -1) {
        this.menu.splice(lIndex, 1);
      }
      // Remove Home from sidemenu.
      lIndex = this.menu.findIndex((x) => x.displayName === 'Home');
      if (lIndex != -1) {
        this.menu.splice(lIndex, 1);
      }
    }
    if (UserName && !UserName.includes('natsteel.com.sg')) {
      this.isPanelOpen = true;
    }
  }

  checkforUsers(pPanel: any, pFlag: boolean) {
    let lUser = this.loginService.GetGroupName();
    if (lUser) {
      if (lUser.includes('natsteel.com.sg')) { // Only allow hover property for natsteel internal users.
        if (pPanel) {
          if (pFlag) { // OPEN the panel when "mouse enters"
            pPanel.open();
          } else { // CLOSE the panel when "mouse leaves"
            pPanel.close();
          }
        }
      }
    }
  }

  GetAccessRight() {
    let lCustomerCode = this.SelectCustomerCode;
    let lProjectCode = this.SelectProjectCode[0];
    this.orderService.GetAccess_Right(lCustomerCode, lProjectCode).subscribe({
      next: (response) => {
        console.log('Access Right', response);
        if (response) {
          this.commonService.Submission = response.Submission;
          this.commonService.Editable = response.Editable;

          // Reload the values in Other Components
          this.reloadService.reloadAccessRight.emit();
        }
      },
      error: (e) => { },
      complete: () => { },
    });
  }

  //ADDED BY VIDYA
  openPdfInNewTab(language: string) {
    // Define the PDF URL based on language
    //const basePath = '\\\\NSQAAPP4\\MES_Share\\ODOS_Share\\';
    const basePath: string = 'assets/';
    let pdfUrl = '';

    if (language === 'en') {
      pdfUrl = `${basePath}ODOS_OrderingSystemUserManual_EnglishVersion.pdf`;
    } else if (language === 'ch') {
      pdfUrl = `${basePath}ODOS_OrderingSystemUserManual_ChineseVersion.pdf`;
    }

    // Open a new tab
    const newTab = window.open('', '_blank');

    if (newTab) {
      newTab.document.write(`
        <html>
        <head>
          <title>User Manual</title>
          <style>
            body { text-align: center; font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f4f4f4; }
            .download-icon {
              text-decoration: none;
              color: black;
              font-size: 30px;
              margin-right: 20px;
            }
            iframe { width: 100%; height: 90vh; border: none; }
          </style>
          <script>
            function downloadManual() {
              const a = document.createElement('a');
              a.href = '${pdfUrl}';
              a.download = '${language === 'en' ? 'ODOS_OrderingSystemUserManual_EnglishVersion' : 'ODOS_OrderingSystemUserManual_ChineseVersion.pdf'}';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          </script>
        </head>
        <body>
          <div class="header">
             <h2></h2>
            <a href="javascript:void(0)" onclick="downloadManual()" class="download-icon" title="Download Manual">
              📥
            </a>
          </div>
          <iframe src="${pdfUrl}#toolbar=0"></iframe>
        </body>
        </html>
      `);
    } else {
      alert('Popup blocked! Please allow popups for this site.');
    }
  }
  // END_ADDED BY VIDYA
  changeCustomerForBoth(event:any,type:any)
  {
    if(type=="O")
    {
      this.changecustomer(event);
      this.SelectDetailingCustomerCode = event.value;
      this.changeDetailingcustomer(event);

      // let Project = this.DetailingprojectList.find((item:any)=>item.ProjectCode==event.value[0]);
      // this.SelectDetailingProductCode = Project.ProjectId
      // event.value = Project.ProjectId
      // this.onDetailingSelectionChange(event);
    }
    else if(type=="D")
    {
      this.changeDetailingcustomer(event);
      this.SelectCustomerCode = event.value;
      this.changecustomer(event);
      // let Project = this.DetailingprojectList.find((item:any)=>item.ProjectId==event.value);
      // this.SelectProjectCode =[];
      // this.SelectProjectCode.push(Project.ProjectCode);
      // event.value = Project.ProjectCode
      // this.onSelectionChange(event);
    }
      this.updateFilteredOptions('');
      this.updateFilteredProjectOptions('');
      this.updateDetailingFilteredOptions('');
      this.updateDetailingFilteredProjectOptions('');
  }

    UpdateOrderAssignmentMenu() {
    let menuItem =
    {
      displayName: 'Order Assignment',
      children: [
        {
          displayName: 'Order Assignment',
          route: '/reports/OrderAssignment',
        },
          {
          displayName: 'Outsource Order Assignment',
          route: '/reports/OutsourceOrderAssignment',
        },
        {
          displayName: 'Outsource Batch Printing',
          route: '/reports/BatchPrinting',
        },
      ],
      
    };

    // Check if the User is a NatSteel Employee.
    const groupName = this.loginService.GetGroupName();

    if (groupName?.includes('natsteel.com.sg')) {
      console.log('Adding Order Assignment menu');
      this.menu.push(menuItem);
    }
  }

  changeProjectforBoth(event:any, type:any, isManual: boolean, pAutoSelectAddress: boolean,pAddressChanged: boolean, pAddressRemoved_Flag: boolean)
  {
    // Reset the AddressList for Ordering;
    if (isManual){
      // Project is manually updated
      this.ResetAddressList();
    }
    if(type=="O")
    {
      this.onSelectionChange(event);

      if (pAddressChanged == false && pAutoSelectAddress == false && pAddressRemoved_Flag == false) {
        setTimeout(() => {
          this.GetAddress(this.SelectProjectCode);
        }, 0.2 * 1000);
      }
      
      let Project = this.DetailingprojectList.find((item:any)=>item.ProjectCode==event.value);
      if(Project){
        this.SelectDetailingProductCode = Project.ProjectId
        event.value = Project.ProjectId
        this.onDetailingSelectionChange(event);
      }
    }
    else if(type=="D")
    {
      this.onDetailingSelectionChange(event);
      let Project = this.DetailingprojectList.find((item:any)=>item.ProjectId==event.value);
      this.SelectProjectCode =[];
      if(Project){
        this.SelectProjectCode.push(Project.ProjectCode);
        event.value = Project.ProjectCode
        this.onSelectionChange(event);
      }
    }

    this.triggerReload();

    this.updateFilteredProjectOptions('');
    this.updateDetailingFilteredProjectOptions('');
  }

  //Address
  GetAddress(pProjectCodes: any): void {
    if(this.isSelectAllforAddress){
      this.isSelectAllforAddress = false;
      return;
    }
    let AddressCode = pProjectCodes.join(',');

    if (!AddressCode) {
      this.addressList = [];
      this.filteredAddressOptions = [];
      return;
    }

    if(AddressCode){
    this.orderService.GetAddress(AddressCode).subscribe({
      next: (response) => {
        this.addressList = response;
        console.log('addressList', response);
        this.filteredAddressOptions = response;

        this.FilterAddressforCustomers();
        
        // Run the following logic in case there is only a single project option in the list.
        if (this.addressList.length == 1) {
          let tObj = { value: this.addressList[0].id };
          this.AddressChanged(tObj, true, true);
        }
      },
      error: (e) => { },
      complete: () => {
        // this.loading = false;
      },
    });
    } else {
      this.addressList = [];
      this.filteredAddressOptions = [];
    }
  }

  AddressChanged(pEvent:any, isCreateOrder: boolean, pAutoSelect: boolean) {

    let AddressRemoved_Flag = false;
    if(pEvent.value?.length == 0) {
      // all records removed;
      AddressRemoved_Flag = true;
    }
    // Update the Address list based on the Curret page.
    if (isCreateOrder) {
      this.SelectAddress = [pEvent?.value];
    }else {
      if (this.SelectAddress[0] == undefined) {
        this.SelectAddress = this.SelectAddress.splice(
          1,
          this.SelectAddress.length + 1
        );
      }
    }

    // Save the Address list in a Global Variable in a Service file.
    this.dropdown.setAddressList(this.SelectAddress);

    // Send the call to get data for Order Page.
    this.changeProjectforBoth({ value: this.SelectProjectCode[0] },"O", false, pAutoSelect, true, AddressRemoved_Flag);
  }

  FilterAddressforCustomers() {
    // Filter the Address list if the User is not NatSteel Employee.
    let lUserName = this.loginService.GetGroupName();

    if (lUserName != null && lUserName.split('@').length == 2 && lUserName.split('@')[1].toLowerCase() != 'natsteel.com.sg')
    {
      // Filter the address list.
      console.log("Filter the address list.");
      const lValidatedAddress = this.loginService.ValidatedAddress;
      // const lValidatedAddress = [{ProjectId:"200272", AddressId:"200272-01"}];
      
      let lFinalResult = [];
      for (let i=0; i< this.addressList.length; i++) {
        let lAddress = this.addressList[i];
        let lIndex = lValidatedAddress.findIndex((element: any) => element.AddressId == lAddress.id);

        if (lIndex != -1) {
          lFinalResult.push(lAddress);
        }
      }

      this.addressList = JSON.parse(JSON.stringify(lFinalResult));
      this.filteredAddressOptions = JSON.parse(JSON.stringify(lFinalResult));
    }
  }

  ResetAddressList() {
    this.SelectAddress = [];
    this.dropdown.setAddressList(this.SelectAddress);
  }


  isSelectAllforAddress: boolean = false;
  SelectAll_Address(){
    this.isSelectAllforAddress = true;
    this.SelectAddress = this.filteredAddressOptions.map(
      (option: { id: any }) => option.id
    );
  }
  ClearAll_Address(){
    this.isSelectAllforAddress = true;
    this.ResetAddressList();
  }

  filterAddressList(AddressText: any) {
  const search = this.searchAddressText.toLowerCase();

  this.filteredAddressOptions = JSON.parse(JSON.stringify(this.addressList));
    if (AddressText != undefined) {
      this.filteredAddressOptions = this.addressList.filter(
        (item: any) =>
          item.projectAddress?.toLowerCase().includes(
            AddressText.trim().toLowerCase()
          ) ||
          item.projectAddress?.toLowerCase().includes(
            AddressText.trim().toLowerCase()
          ) ||
          this.SelectAddress.includes(item.id)
      );
      setTimeout(() => {
        if (this.createAddress) {
          if(this.createAddress.panel){
          const panel2 = this.createAddress.panel
            .nativeElement as HTMLDivElement;
          if (panel2) panel2.scrollTop = 0;
          }
        }
        if (this.OrderngAddress) {
          if(this.OrderngAddress.panel){
          const panel3 = this.OrderngAddress.panel
            .nativeElement as HTMLDivElement;
          if (panel3) panel3.scrollTop = 0;
          }
        }
      }, 200);
    }
  }
}
