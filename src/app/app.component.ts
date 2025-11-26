import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonService } from './SharedServices/CommonService';
import { OrderService } from './Orders/orders.service';
import { LoginService } from './services/login.service';
import { ReloadService } from './SharedServices/reload.service';
import { DetailingService } from './Detailing/DetailingService';
import { AuthService } from './core/oauth.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InvalidTokenPopupComponent } from './SharedComponent/invalid-token-popup/invalid-token-popup.component';
import {SelectServer} from '../environments/SelectServer'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  server: string ="";
  //  server: string = 'PRD';

  maintitle = 'Digios';

  Token: any = ' ';
  formData = new FormData();
  username: any = '';

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    private orderService: OrderService,
    private detailingService: DetailingService,
    private loginService: LoginService,
    private reloadService: ReloadService,
    private authService: AuthService,
    private title: Title,
    private location: Location,
    private modalService: NgbModal,
  ) {}
  public ngOnInit(): void {    
    // this.server=SelectServer.server;
    const currentHost = window.location.hostname;

    if (currentHost === 'localhost') {
      this.server = "DEV"
    } else {
    this.server = "PRD";
    }
    
    this.commonService.currentTitle.subscribe((title) => {
      this.title.setTitle(title);
    }); // this.route.queryParams.subscribe((params) => {

    // this.Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsIk5hbWUiOiJBaml0IEthbWJsZSAoVFRMKSIsIkxvZ2luSWQiOiJBaml0S19UVExAbmF0c3RlZWwuY29tLnNnIiwiVXNlckdyb3VwIjoiIiwiRGVwYXJ0bWVudCI6IlRUTF9TdXBwb3J0X0lUIiwiRmluQWNjZXNzIjoiMCIsIkNvbnRhY3ROdW1iZXIiOiIiLCJDdXN0b21lckRhdGEiOiIiLCJqdGkiOiIzMDFjMjIxNC0xNmQ2LTQzNGYtODk0MS01MThiZTk4ZjUwNDgiLCJleHAiOjE3MDkyMzA5OTUsImlzcyI6InVtcC5uYXRzdGVlbC5jb20uc2ciLCJhdWQiOiJPRE9TLk5hdHN0ZWVsLmNvbS5zZyJ9.ddqES2XnbluMKCE9D3VhQsGgDvEXDzG3-7daxDJpq4A";
    //  this.formData.append('token', this.Token);

    if (this.server == 'DEV') {
      this.Token = 'test';
      //  UseName => RoliId
      //  'JagdishH_TTL@natsteel.com.sg' => 10
      //  'leepc@natsteel.com.sg' => 19
      //  'LHC@natsteel.com.sg' => 3

      // let lUserName = 'KunalA_ttl@natsteel.com.sg';
      let lUserName = 'JagdishH_ttl@natsteel.com.sg';
      // let lUserName = 'bao_jiangang@163.com';
      // let lUserName = 'zhenglouyang@visionec.com.sg';
      // let lUserName = 'pengfei@chinaconstruction.com.sg';
      // let lUserName = 'shijianhua1967@126.com';
      // let lUserName = 'pengqinghua666@gmail.com';
      // let lUserName = 'Kunal.ayer@tatatechnologies.com';
      // let lUserName = "dicksonwong@kimly.com.sg";
      // let lUserName =  "pc.admin3@hwaseng.com.sg";
      // let lUserName =  "Ajit.Kamble@tatatechnologies.com";

      // SetDisplayName
      this.loginService.SetDisplayName(lUserName.split('@')[0]);

      this.GetTokenDEV(); //FOR DEVELOPMENT ONLY
      // this.commonService.UserGroup = 'PMD'; //for testing purposes
      this.OrderIndex(lUserName); //FOR DEVELOPMENT ONLY
      this.GetDetailingForm(lUserName);

    } else {
      this.GetToken();
    }
  }
  GetTokenDEV() {
    this.commonService.getToken().subscribe({
      next: (response) => {
        if (response.token) {
          this.Token = response.token;
          this.commonService.SetToken(this.Token);
          // this.IndexUMP();
        } else {
          this.Token = '';
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }

  GetToken() {
    this.commonService.getToken().subscribe({
      next: (response) => {
        if (response.token) {
          this.Token = response.token;
          this.commonService.SetToken(this.Token);
          this.formData.append('token', this.Token);
          this.IndexUMP();
        } else {
          this.Token = '';
          let lRoute = '/Invalid'
          this.authService.targetURL = lRoute;
          this.router.navigate([lRoute]);
        }
      },
      error: (err) => {
        console.error(err);
        let lRoute = '/Invalid'
        this.authService.targetURL = lRoute;
        this.router.navigate([lRoute]);
      },
      complete: () => {},
    });
  }

  IndexUMP() {
    this.commonService.SendToken(this.formData).subscribe({
      next: (response) => {
        // {
        //   "UserType": "AD",
        //   "UserName": "JagdishH_TTL@natsteel.com.sg",
        //   "Submission": "Yes",
        //   "Editable": "Yes",
        //   "LeadTimeProdType": "BPC,CAB,COLUMN-LINK-MESH,CORE-CAGE,CUT-TO-SIZE-MESH,PRE-CAGE,STIRRUP-LINK-MESH",
        //   "LeadTime": "5,5,7,7,7,7,7",
        //   "Holidays": "2022-10-24,2022-12-26,2023-01-02,2023-01-23,2023-01-24,2023-04-07,2023-04-22,2023-05-01,2023-06-02,2023-06-29,2023-08-09,2023-09-01,2023-11-13,2023-12-25,2024-01-01,2024-02-10,2024-02-12,2024-03-29,2024-04-10,2024-05-01,2024-05-23,2024-06-17,2024-08-09,2024-10-31,2024-12-25,2025-01-01"
        // }
        if (response) {
          let DisplayName = response.payload.Name;
          this.loginService.SetDisplayName(DisplayName);

          let lUserName = response.payload.email? response.payload.email: response.payload.LoginId;

          this.OrderIndex(lUserName);
          this.GetDetailingForm(lUserName);

          this.ValidateAddress(response.payload);

          console.log('username', lUserName);

          // Set the USerGroup name in CommonService
          // this.commonService.UserGroup = response.payload.UserGroup;
        }
        console.log(response);
      },
      error: (e) => {
        console.log("show error");
        this.ShowErrorPopUp();
      },
      complete: () => {},
    });
  }

  ShowErrorPopUp(): void {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      InvalidTokenPopupComponent,
      ngbModalOptions
    );
  }
  OrderIndex(userName: any) {
    // userName = userName.split('@')[0];
    if (userName == undefined) {
      return;
    }
    this.orderService.Order_Index(userName).subscribe({
      next: (response) => {
        console.log('OrderIndex', response);

        if (response.UserName) {
          this.loginService.SetGroupName(response.UserName);
          localStorage.setItem('ODOSUserName', response.UserName);
          this.GetUserId(response.UserName);
        }
        if (response.UserType) {
          // Set USertype to a Service so it can be used in any component of the application
          this.loginService.SetUserType(response.UserType);

          // Saving he UserType in SessionStorage to tackle error from Dulicating the Tab
          localStorage.setItem('UserType', response.UserType);

          // Remove the value of UserType from SessionStorage after 30 mins.
          setTimeout(() => {
            localStorage.removeItem('UserType');
          }, 30 * 60 * 1000); // 30 min

          // this.loginService.SetUserType('AD');
        } else {
          localStorage.removeItem('UserType');
        }
        if (response.Holidays) {
          let lHolidays = response.Holidays.split(','); //Array list of holiday dates
          let Holidays: any[] = [];
          lHolidays.forEach((x: string) => {
            let lDate = new Date(x.toString()).toLocaleDateString();
            Holidays.push(lDate);
          });

          console.log('Hoidays', Holidays);
          this.loginService.SetHoliday(Holidays);
        }


        if(response.Submission){
          this.commonService.Submission = response.Submission;
        }
        if(response.Editable){
          this.commonService.Editable = response.Editable;
        }

        if(response.isEsmUser) {
          this.commonService.isEsmUser = response.isEsmUser;
        }


        // Route the starting page based upon the UserType
        this.RouteToStartingPage(response.UserName,response.UserType);


        this.reloadService.reloadOrderSideMenuComponent.emit();
      },
      error: (e) => {},
      complete: () => {
        debugger;
      },
    });
  }

  GetDetailingForm(userName: any) {
    userName = userName.split('@')[0];

    this.detailingService.GetDetailingForm(userName).subscribe({
      next: (response) => {
        console.log('GetDetailingForm', response);
        this.authService.setDetailingForm(response);

        // if (response.UserName) {
        //   this.loginService.SetGroupName(response.UserName)
        // }
        // if (response.UserType) {
        //   this.loginService.SetUserType(response.UserType)
        // }

        this.reloadService.reloadDetailingSideMenuComponent.emit(response);
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  GetUserId(userName: any) {
    userName = userName.split('@')[0];

    this.commonService.GetUserId(userName).subscribe({
      next: (response) => {
        console.log('Get UserID', response);
        if (response) {
          this.loginService.SetUserId(response);
        }
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  async GetUserGroup(pUserName: string, pUserType: string) {
    //  Check if the logged in User is Internal User or External User (if username contains "natsteel.com.sg")
    if (pUserName.includes('natsteel.com.sg')) {
      //  Internal Users
      //  Incase of Internal users , call the service to get their RoleId.
      //  1) For Internal Users = If RoleId = (19,10) -- then process order Incoming tab
      //  2) For Internal Users = If RoleId = (3) -- then WBS posting page
      let response = await this.GetRoleId(pUserName);
      if (response != 'error') {
        if (response == 19 || response == 10) {
          if (
            pUserType == 'PL' ||
            pUserType == 'AD' ||
            pUserType == 'PM' ||
            pUserType == 'PA' ||
            pUserType == 'P1' ||
            pUserType == 'P2' ||
            pUserType == 'P3' ||
            pUserType == 'PU' ||
            pUserType == 'TE' ||
            pUserType == 'MJ'
          ) {
            let lRoute = 'order/processorder'
            this.authService.targetURL = lRoute;
            this.router.navigate([lRoute]);
          }
        } else if (response == 3) {
          let lRoute = 'wbs/wbpposting'
          this.authService.targetURL = lRoute;
          this.router.navigate([lRoute]);
        }
      }
    } else {
      //  External Users
      //  Incase of External users , call the service to check their Access in database.
      //  3) For External Users =  If access returned from service is false route to Create Order Page.

      // let response = await this.GetData(pUserName);
      // if (response != 'error') {
      //   if (response == false) {
      //     this.router.navigate(['order/createorder']);
      //   }
      // }

      // Date: 18/02/2025 : Condition to be updated
      // All the external user have Create Order as their landing page.

      let lRoute = 'order/createorder'
      this.authService.targetURL = lRoute;
      this.router.navigate([lRoute]);
    }
  }

  async GetRoleId(pEmail: any): Promise<any> {
    try {
      const data = this.orderService.GetRoleIdBy_EmailId(pEmail).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }
  async GetData(pEmail: any): Promise<any> {
    try {
      const data = this.orderService.GetDataBy_EmailID(pEmail).toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  // RouteToStartingPage() {
  //   const hasRunBefore = sessionStorage.getItem('functionHasRun');
  //   // If the Projext is loaded for the first time.
  //   if (!hasRunBefore) {
  //     //check if the user has routed from Process order: View Details
  //     let hasRouted = localStorage.getItem('functionHasRouted');

  //     // If the user is not routed from process order
  //     if (!hasRouted) {
  //       // Run your function
  //       this.GetUserGroup('JagdishH_TTL@natsteel.com.sg'); //for testing purposes
  //     }
  //     // Remove the flag for Process from the localStorage
  //     localStorage.removeItem('functionHasRouted');

  //     // Set a flag in sessionStorage
  //     sessionStorage.setItem('functionHasRun', 'true');
  //   }
  // }

  RouteToStartingPage(pUserName: string, pUserType: string) {
    // Check if the user has routed from Process order: View Details
    let hasRouted = localStorage.getItem('functionHasRouted');

    // If the user is not routed from process order
    if (!hasRouted) {
      // Navigate to a different starting page when the user is on the Home page.
      let lCurrentPath = this.location.path();
      if (lCurrentPath == '/' || lCurrentPath == '' ) {
        // Run your function
        this.GetUserGroup(pUserName, pUserType);
      }
    }
    // Remove the flag for Process from the localStorage
    localStorage.removeItem('functionHasRouted');
  }

  ngOnDestroy(): void {
    //Remove locally saved UserType from system when application is closed.
    localStorage.removeItem('UserType');
    localStorage.removeItem('ODOSUserName');
  }

  ValidateAddress(pItem: any) {
    let lAddress = pItem?.ProjectAddress;

    if (lAddress) {
      const parsedAddressArray = JSON.parse(lAddress);
      this.loginService.ValidatedAddress = parsedAddressArray;
    }
  }
}
