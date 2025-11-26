import {
  animate,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AddToCart } from 'src/app/Model/addToCart';
import { TempOrderSummaryData } from 'src/app/Model/TenpOrderSummaryData';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { OrderService } from '../../orders.service';
import { CreateordersharedserviceService } from '../createorderSharedservice/createordersharedservice.service';
import { LoginService } from 'src/app/services/login.service';
import { ProcessSharedServiceService } from '../../process-order/SharedService/process-shared-service.service';
import { JsonPipe } from '@angular/common';
import { OrderSummarySharedServiceService } from '../../order-shared-services/order-summary-services/order-summary-shared-service.service';
import { CommonService } from 'src/app/SharedServices/CommonService';

@Component({
  selector: 'app-non-project',
  templateUrl: './non-project.component.html',
  styleUrls: ['./non-project.component.css'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate('400' + 'ms ease-in')),
      transition('true => false', animate('400' + 'ms ease-out')),
    ]),
  ],
})
export class NonProjectComponent implements OnInit {
  @Input() ProjectCode: any;
  @Input() CustomerCode: any;
  nonProjectDataList: any[] = [];
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
  // nextbuttonClicked = false;
  selectedGreenOption: string = '';
  showOrderSummary: boolean = false;
  ProductCollapse: boolean = false;

  listofOrders: AddToCart[] = [];
  currentListOrderIndex = 0;

  disableCreateOrder: boolean = false;

  gGreenSteelSelection: boolean = false;

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
  ) {}
  ngOnInit(): void {
    this.commonService.changeTitle('Non Project | ODOS');
    this.disableCreateOrder = false;
    this.CheckafterSubmit();
    debugger;
    this.reloadService.reloadCreateOrderTabNONProject$.subscribe((data) => {
      this.createSharedService.tempOrderSummaryList = undefined;
      this.resetTempOrderList();

      this.showOrderSummary = false;
      this.ProductCollapse = false;
      this.ProjectCode = this.dropdown.getProjectCode()[0];
      // this.GetWBS1Multiple();
      this.GetProductListData(this.CustomerCode, this.ProjectCode);
      this.GetProductGreenSteelValue();
    });
    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.ProjectCode = [];
      this.CustomerCode = this.dropdown.getCustomerCode();
      this.createSharedService.tempOrderSummaryList = undefined;
      this.resetTempOrderList();
      this.nonProjectDataList = [];
      this.showOrderSummary = false;
      this.ProductCollapse = false;
    });

    this.reloadService.reload$.subscribe((data) => {
      console.log('yes yes yes', data);
      if (true) {
        this.createSharedService.tempOrderSummaryList = undefined;
        this.resetTempOrderList();

        this.showOrderSummary = false;
        this.ProductCollapse = false;
        this.ProjectCode = this.dropdown.getProjectCode()[0];
        // this.GetWBS1Multiple();
        this.GetProductListData(this.CustomerCode, this.ProjectCode);
        // this.GetProductGreenSteelValue();
      }
    });

    this.reloadService.reloadCreateOrderProjectInputs$.subscribe((data) => {
      let OrderStatus = data;
      console.log(
        'this.createSharedService.tempOrderSummaryList',
        this.createSharedService.tempOrderSummaryList
      );
      if (OrderStatus.toUpperCase().includes('CREATED') == false) {
        //DISABLE ALL INPUTS
        this.disableCreateOrder = true;
      } else {
        this.disableCreateOrder = false;
      }
    });

    let lProcessItem: any =
      this.ordersummarySharedService.GetOrderSummaryData();
    // let lProcessItem: any = localStorage.getItem('CreateDataProcess');
    // lProcessItem = JSON.parse(lProcessItem);
    if (lProcessItem) {
      if (lProcessItem.pSelectedSE.includes('NONWBS' || 'nonwbs')) {
        this.createSharedService.tempOrderSummaryList = JSON.parse(
          JSON.stringify(lProcessItem)
        );
        this.createSharedService.showOrderSummary = true;

        this.changeDetectorRef.detectChanges();
      }
    }
    // 0001101431/0000700011
    this.changeDetectorRef.detectChanges();
    this.GetProductListData(this.CustomerCode, this.ProjectCode);
    this.GetProductGreenSteelValue();

    // const temp: any = sessionStorage.getItem('nonProjectDataList')
    // console.log('session stroed', JSON.parse(temp))
    if (this.createSharedService.tempOrderSummaryList) {
      this.showOrderSummary = true;
      this.ProductCollapse = true;
    }

    if (this.createSharedService.tempOrderSummaryList) {
      this.tempOrderSummaryList = JSON.parse(
        JSON.stringify(this.createSharedService.tempOrderSummaryList)
      );
      this.getData();
    }
  }

  resetTempOrderList() {
    this.nextButtonClicked = false;
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

    // reset greensteel value
    this.gGreenSteelSelection = this.createSharedService.currGreenSteelSelection;
    this.UpdateGreenSteelSelection(this.gGreenSteelSelection);
  }
  AddToTempData(structElement: string, data: any, prod_code: any) {
    console.log('structElement', structElement);
    console.log('prod_code', prod_code);
    console.log('data', data);

    if (data.isSelected) {
      // console.log("Added to temp data")
      this.tempOrderSummaryList.pSelectedSE.push(structElement.toUpperCase());
      this.tempOrderSummaryList.pSelectedProd.push(prod_code.toUpperCase());
      this.tempOrderSummaryList.pSelectedPostID.push(0);
      this.tempOrderSummaryList.pSelectedScheduled.push('N');
      this.tempOrderSummaryList.pSelectedCount =
        this.tempOrderSummaryList.pSelectedScheduled.length;

      let lFound = false;
      if (this.createSharedService.tempOrderSummaryList) {
        let lTempData = JSON.parse(
          JSON.stringify(this.createSharedService.tempOrderSummaryList)
        );
        for (let i = 0; i < lTempData.pSelectedScheduled.length; i++) {
          if (
            lTempData.pSelectedScheduled[i] == 'N' &&
            lTempData.pOrderNo[i] != 0
          ) {
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

      if (this.createSharedService.tempProjectOrderSummaryList) {
        let lTempData = JSON.parse(
          JSON.stringify(this.createSharedService.tempProjectOrderSummaryList)
        );
        for (let i = 0; i < lTempData.pSelectedScheduled.length; i++) {
          if (lTempData.pOrderNo[i] != 0) {
            // TO CHECK IF THE ORDER NUMBER IS ALREADY USED FOR A STRUCTURE/PRODUCT
            //if (lTempData.pSelectedQty[i] != 0) { }
            //else {
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
            //}
          }
        }
      }
      if (lFound == false) {
        this.tempOrderSummaryList.pOrderNo.push(0);
      }
      // console.log('this.tempOrderSummaryList', this.tempOrderSummaryList)
      // sessionStorage.setItem('nonProjectDataList', JSON.stringify(this.nonProjectDataList));
    } else {
      let index = this.tempOrderSummaryList.pSelectedProd.findIndex(
        (x: string) => x?.toLowerCase() === prod_code?.toLowerCase()
      );
      // console.log('to be removed', this.tempOrderSummaryList)
      this.tempOrderSummaryList.pSelectedPostID.splice(index, 1);
      this.tempOrderSummaryList.pSelectedProd.splice(index, 1);
      this.tempOrderSummaryList.pSelectedSE.splice(index, 1);
      this.tempOrderSummaryList.pSelectedScheduled.splice(index, 1);
      this.tempOrderSummaryList.pOrderNo.splice(index, 1);
      this.tempOrderSummaryList.pSelectedQty.splice(index, 1);
      this.tempOrderSummaryList.pSelectedWT.splice(index, 1);
    }
  }
  async gotoOrderSummary() {
    //debugger
    this.reloadService.reloadCreateOrderTabComponentProject.emit();

    console.log('gotoordersummary');
    let lTotalSelectedProducts = this.tempOrderSummaryList.pSelectedProd.length;
    if (lTotalSelectedProducts == 0) {
      this.toastr.error('Please select a Product');
    } else {
      localStorage.removeItem('ProcessData');
      sessionStorage.removeItem('ProcessData');
      localStorage.removeItem('ProcessOrderSummaryData');
      sessionStorage.removeItem('ProcessOrderSummaryData');
      // localStorage.removeItem('CreateDataProcess');
      // sessionStorage.removeItem('CreateDataProcess');

      this.ResetOrderReferenceNumber();
      console.log('SetOrderSummaryData', undefined);
      this.ordersummarySharedService.SetOrderSummaryData(undefined);
      this.processsharedserviceService.setOrderSummaryData(undefined);
      this.processsharedserviceService.ProductDetailsEditable = false;
      this.createSharedService.showOrderSummary = true;

      // let tempProductList = this.tempOrderSummaryList.pSelectedWBS2
      let tempProdctlist = this.tempOrderSummaryList.pSelectedProd;
      let RefNumList: any = [];
      for (let i = 0; i < lTotalSelectedProducts; i++) {
        let obj: AddToCart = {
          pCustomerCode: this.CustomerCode,
          pProjectCode: this.ProjectCode,
          pOrderType: 'NONWBS',
          pOrderNo: this.tempOrderSummaryList.pOrderNo[i],
          pRefNo: RefNumList ? RefNumList[i] : 0,
          pStructureElement: 'NONWBS',
          pProductType: this.tempOrderSummaryList.pSelectedProd[i],
          pWBS1: '',
          pWBS2: '',
          pWBS3: '',
          pPONo: '0',
          pScheduledProd: 'N',
          pPostID: 0,
          UpdateBy: this.loginService.GetGroupName(),
          GreenSteel: this.gGreenSteelSelection,
          AddressCode: this.dropdown.getAddressList()[0],
        };
        this.listofOrders.push(obj);

        let response = await this.AddToCart_async(obj);
        if (response == false) {
          alert('Connection error, please check your internet connection.');
        } else {
          console.log('ORDER NUMBER', response);
          this.tempOrderSummaryList.pOrderNo[i] = response.OrderNumber;

          //Update RefNumber
          let lRefNo = RefNumList;
          if (lRefNo.includes(0 || '0') || RefNumList.length == 0) {
            for (let i = 0; i < lTotalSelectedProducts; i++) {
              RefNumList.push(response.Refnumber);
            }
          }
        }
      }

      console.log('tempOrderSummaryList', this.tempOrderSummaryList);
      this.createSharedService.viewData = false;
      window.history.state.tempOrderSummaryList.pOrderNo =
        this.tempOrderSummaryList.pOrderNo.join(',');

      this.createSharedService.PrevOrderNumbers =
        this.tempOrderSummaryList.pOrderNo;

      this.createSharedService.currGreenSteelSelection = this.gGreenSteelSelection;

      this.createSharedService.tempOrderSummaryList = JSON.parse(
        JSON.stringify(this.tempOrderSummaryList)
      );

      this.currentListOrderIndex = 0;
      this.listofOrders = [];
      this.createSharedService.selectedTab = false;
      this.showOrderSummary = true;
      this.ProductCollapse = true;
      /**
       * Set the flag as true for "getDeliveryAddress" function
       */
      sessionStorage.setItem('SetDeliveryAddress_Flag', 'true');
      // If there are any previous NONWBS values remaining;
      this.createSharedService.tempProjectOrderSummaryList = undefined;
    }
  }

  getData() {
    let tempObj: any;
    tempObj = {
      pSelectedSE: this.tempOrderSummaryList.pSelectedSE.join(','),
      pSelectedProd: this.tempOrderSummaryList.pSelectedProd.join(','),
      pSelectedPostID: this.tempOrderSummaryList.pSelectedPostID.join(','),
      pSelectedScheduled:
        this.tempOrderSummaryList.pSelectedScheduled.join(','),
      pSelectedWBS1: '',
      pSelectedWBS2: '',
      pSelectedWBS3: '',
      pCustomerCode: this.CustomerCode,
      pProjectCode: this.ProjectCode,
      pWBS1: '',
      pWBS2: '',
      pWBS3: '',
      pOrderNo: this.tempOrderSummaryList.pOrderNo.join(','), //Oreder Number is set after calling AddToCart()
      pSelectedWT: this.tempOrderSummaryList.pSelectedWT.join(','),
      pSelectedQty: this.tempOrderSummaryList.pSelectedQty.join(','),
    };
    if (this.tempOrderSummaryList.pSelectedSE.includes('NONWBS' || 'nonwbs')) {
      if (this.tempOrderSummaryList.pSelectedSE.length == 1) {
        if (this.tempOrderSummaryList.pSelectedWBS1[0]) {
          tempObj.pSelectedWBS1 = this.tempOrderSummaryList.pSelectedWBS1[0];
        }
        if (this.tempOrderSummaryList.pSelectedWBS2[0]) {
          tempObj.pSelectedWBS2 = this.tempOrderSummaryList.pSelectedWBS2[0];
        }
        if (this.tempOrderSummaryList.pSelectedWBS3[0]) {
          tempObj.pSelectedWBS3 = this.tempOrderSummaryList.pSelectedWBS3[0];
        }
      }
    }

    this.createSharedService.tempOrderSummaryList = JSON.parse(
      JSON.stringify(this.tempOrderSummaryList)
    );
    window.history.state.tempOrderSummaryList = tempObj;

    // this.createSharedService.selectedTab = false;
    this.sendDataToOrderSummary();
    this.nextButtonClicked = true;
  }
  nextButtonClicked: boolean = false;

  sendDataToOrderSummary() {
    this.reloadService.reloadOrderSummaryComponent.emit();
  }

  GetProductListData(pCustomerCode: any, pProjectCode: any) {
    this.nonProjectDataList = [];
    let UserName = this.loginService.GetGroupName();
    this.orderService
      .ProductSelect(pCustomerCode, pProjectCode, UserName)
      .subscribe({
        next: (response) => {
          // this.nonProjectDataList = response
          console.log('nonProjectDataList', response);

          let nowbsIndex = response.findIndex((x) => x.SECode === 'NONWBS');

          if (nowbsIndex != -1) {
            this.nextButtonClicked = false;
            for (let i = 0; i < response[nowbsIndex].ProdName.length; i++) {
              let obj = {
                ProdName: response[nowbsIndex].ProdName[i],
                ProdCode: response[nowbsIndex].ProdCode[i],
                isSelected: false,
                lockSelection: false,
              };

              let lCreatedOrders =
                this.createSharedService.tempOrderSummaryList;
              if (lCreatedOrders) {
                if (lCreatedOrders.length != 0) {
                  for (
                    let j = 0;
                    j < lCreatedOrders.pSelectedProd.length;
                    j++
                  ) {
                    if (
                      lCreatedOrders.pSelectedProd[j].toUpperCase() ==
                      obj.ProdCode.toUpperCase()
                    ) {
                      if (
                        lCreatedOrders.pSelectedQty[j] != 0 &&
                        lCreatedOrders.pSelectedQty[j] != undefined
                      ) {
                        obj.lockSelection = true;
                      }
                      obj.isSelected = true;
                      this.AddToTempData('NONWBS', obj, obj.ProdCode);
                    }
                  }
                }
              }
              if (obj.ProdName.toUpperCase() != 'COMPONENT') {
                this.nonProjectDataList.push(obj);
              }
            }
            // let temp: any = sessionStorage.getItem('nonProjectDataList')
            // if(temp){
            //   this.nonProjectDataList = JSON.parse(temp)
            // }
            // console.log("this.nonProjectDataList", this.nonProjectDataList)
          }
        },
        error: (e) => {},
        complete: () => {
          // this.loading = false;
        },
      });
  }

  async AddToCart_async(item: AddToCart) {
    try {
      const data = await this.orderService.AddToCart(item).toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }

  CheckafterSubmit() {
    console.log('Clear All Data');
    if (
      this.createSharedService.tempOrderSummaryList == undefined &&
      this.createSharedService.tempProjectOrderSummaryList == undefined &&
      window.history.state.tempOrderSummaryList == undefined
    ) {
      // this.projectorderForm.reset();
      this.showOrderSummary = false;
      //this.structureElementCollapse = false
      // this.HideStructures();
    }
  }

  SelectonDblClick(product: any) {
    if (product.lockSelection) {
      return;
    }
    product.isSelected = !product.isSelected;
    this.AddToTempData('NONWBS', product, product.ProdCode);
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

  onNextClick() {
    if (!this.selectedGreenOption) {
      this.toastr.error('Please select a Greensteel type before proceeding.');
      return;
    }

    // this.nextbuttonClicked = true;
    this.getData();
    this.gotoOrderSummary();
  }

  GreenSteelSelection() {
    if (this.selectedGreenOption == 'Green') {
      this.gGreenSteelSelection = true;
    } else {
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

  DisableGreenSteelSelection () {
    let lValue = this.createSharedService.greenSteelSelection_lock;
    return lValue ? true : false;
  }

  greenSteelToolTip(): string {
    return 'Green-Steel';
  }

  greenSteelSelectToolTip() {
    let lValue = this.createSharedService.greenSteelSelection_lock;
    if(lValue) {
      return 'Remove all selected products to change Steel Type.'
    }
    return '';
  }
}
