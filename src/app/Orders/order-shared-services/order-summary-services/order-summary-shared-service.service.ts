import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderSummarySharedServiceService {

  OrderSummaryData: any;

  constructor() { }

  GetOrderSummaryData() {
    return this.OrderSummaryData;
  }

  SetOrderSummaryData(data: any) {
    this.OrderSummaryData = data;
  }

}
