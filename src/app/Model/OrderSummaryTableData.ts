import { SaveBBSOrderDetails } from "./SaveBBSOrderDetails"

export interface OrderSummaryTableData {
  SNo: number
  SeperateDelivery: boolean
  WBS: string
  WBS1: string,
  WBS2: string,
  WBS3: string,
  StructureElement: string
  Product: string
  OrderTonnage: string
  OrderQty: string
  showDetails: boolean
  RequiredDate: string
  Transport: string
  BBSNumnber: string
  BBSDescription: string
  PONumber: string
  OrderNumber: string
  OrderStatus: string
  CouplerType: string
  SpecialRemarks: string
  SiteContact: string
  Handphone: string
  GoodsReceiver: string
  GoodsReceiverHandphone: string
  ScheduledProd: string
  PostId: number
  BBS?: SaveBBSOrderDetails,
  NoofAttachedDoc?: number,
  AdditionalRemark: string
  testDate?:any
  IsPrecast : boolean,
  precastQty: any,
  pageNo: any
}
