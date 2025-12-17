import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private reloadSubject = new Subject<void>();
  constructor() {}

  reloadComponent = new EventEmitter<any>();
  reload$: Observable<any> = this.reloadComponent.asObservable();

  reloadProjectSideMenu = new EventEmitter<any>();
  reloadProjectSideMenu$: Observable<any> =
    this.reloadProjectSideMenu.asObservable();

  reloadCustomerComponent = new EventEmitter<any>();
  reloadCustomer$: Observable<any> =
    this.reloadCustomerComponent.asObservable();

  reloadCustomerSideMenu = new EventEmitter<any>();
    reloadCustomerSideMenu$: Observable<any> =
      this.reloadCustomerSideMenu.asObservable();

  reloadOrderSummaryComponent = new EventEmitter<any>();
  reloadOrderSummary$: Observable<any> =
    this.reloadOrderSummaryComponent.asObservable();

  reloadOrderSideMenuComponent = new EventEmitter<any>();
  reloadOrderSideMenu$: Observable<any> =
    this.reloadOrderSideMenuComponent.asObservable();

  reloadDetailingSideMenuComponent = new EventEmitter<any>();
  reloadDetailingSideMenu$: Observable<any> =
    this.reloadDetailingSideMenuComponent.asObservable();

  reloadCreateOrderTabComponentProject = new EventEmitter<any>();
  reloadCreateOrderTabProject$: Observable<any> =
    this.reloadCreateOrderTabComponentProject.asObservable();

  reloadCreateOrderTabComponentNONProject = new EventEmitter<any>();
  reloadCreateOrderTabNONProject$: Observable<any> =
    this.reloadCreateOrderTabComponentNONProject.asObservable();

  reloadCreateOrderCustomerProject = new EventEmitter<any>();
  reloadCreateOrderCusProj$: Observable<any> =
    this.reloadCreateOrderCustomerProject.asObservable();

  reloadProjectInputs = new EventEmitter<any>();
  reloadCreateOrderProjectInputs$: Observable<any> =
    this.reloadProjectInputs.asObservable();

  reloadAddress = new EventEmitter<any>();
  reloadCreateOrderAddress$: Observable<any> =
    this.reloadAddress.asObservable();


  reloadSideMenu = new EventEmitter<any>();
  reloadSideMenu$: Observable<any> = this.reloadSideMenu.asObservable();

  /** DETAILING */
  reloadComponentDetailingGm = new EventEmitter<any>();
  ReloadDetailingGM$: Observable<any> =
    this.reloadComponentDetailingGm.asObservable();

  /** SUB-TAB */
  reloadComponentDetailingSubTab = new EventEmitter<any>();
  ReloadDetailingSubTab$: Observable<any> =
    this.reloadComponentDetailingSubTab.asObservable();

    
  reloadAccessRight = new EventEmitter<any>();
  reloadAccessRight$: Observable<any> = this.reloadAccessRight.asObservable();
  
  // For Updating Data of CustomerProject in Mobile View
  reloadCustomerList = new EventEmitter<any>();
  reloadCustomerList$: Observable<any> = this.reloadCustomerList.asObservable();
  
  reloadProjectList = new EventEmitter<any>();
  reloadProjectList$: Observable<any> = this.reloadProjectList.asObservable();

  reloadAddresslistEmitter = new EventEmitter<any>();
  reloadAddressList$: Observable<any> = this.reloadAddresslistEmitter.asObservable();

  reloadAddressSideMenuEmitter = new EventEmitter<any>();
  reloadAddressSideMenu$ : Observable<any> = this.reloadAddressSideMenuEmitter.asObservable();

  reloadCustomerCodeMobileEmitter = new EventEmitter<any>();
  reloadCustomerCodeMobile$: Observable<any> = this.reloadCustomerCodeMobileEmitter.asObservable();
  reloadProjectCodeMobileEmitter = new EventEmitter<any>();
  reloadProjectCodeMobile$: Observable<any> = this.reloadProjectCodeMobileEmitter.asObservable();
  reloadAddressCodeMobileEmitter = new EventEmitter<any>();
  reloadAddressCodeMobile$: Observable<any> = this.reloadAddressCodeMobileEmitter.asObservable();
  
}
