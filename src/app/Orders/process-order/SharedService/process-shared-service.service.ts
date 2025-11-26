import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProcessSharedServiceService {

  SBContract: any;
  ProductDetailsEditable : boolean = true;
  ProcessCustomer: any;
  ProcessProject: any;
  ProcessAddress: any;
  OrderSummaryData: any;

  constructor() { }

  setSBContract(item: any) {
    this.SBContract = item;
  }
  getSBContract() {
    return this.SBContract;
  }

  setProductDetailsEditable(item: boolean) {
    this.ProductDetailsEditable = item;
  }
  getProductDetailsEditable() {
    return this.ProductDetailsEditable;
  }

  setOrderSummaryData(item: any) {
    this.OrderSummaryData = item;
  }
  getOrderSummaryData() {
    return this.OrderSummaryData;
  }



}
