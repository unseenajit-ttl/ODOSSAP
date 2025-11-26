import { Injectable } from '@angular/core';
import { saveOrderDetailsModel } from 'src/app/Model/saveOrderDetailsModel';

@Injectable({
  providedIn: 'root'
})
export class CreateordersharedserviceService {

  // selectedWBS: {
  //   wbs1: '',
  //   wbs2: [],
  //   wbs3: []
  // }

  selectedrecord: any;
  selectedTab: boolean = true;
  selectedWBS: any;
  selectedStructElements: any[] = [];
  tempOrderSummaryList: any;
  tempOrderList: any[] = [];
  tempProjectOrderSummaryList: any;
  MeshPRCDataList: any;
  JobIds: any;
  JobAdviceCAB: any;
  showOrderSummary: boolean = false;

  SelectProjectTab: boolean = true;

  selectedOrderNumber: any
  // selectedJobIds: any
  saveOrderDetailsData: saveOrderDetailsModel[] = []

  PrevOrderNumbers: any

  currGreenSteelSelection: any;
  greenSteelSelection_lock: boolean = false;

  beamData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  columnData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  slabbData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  slabtData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  DwallData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  pileData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  wallData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  slabData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };
  drainData: any = {
    ProdName: [],
    ProdCode: [],
    isSelected: [],
    OrderQty: [],
    OrderWt: []
  };


  ProductValues: any;

  viewOrderSummaryList: any;
  viewData: boolean = false;

  upcomingOrderFlag: boolean = false;
  upcomingForecastDate: any = "";
  upcomingData: any;

  constructor() { }


}
