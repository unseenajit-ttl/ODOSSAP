export interface getDrawingListModel {
  CustomerCode: string,
  ProjectCode: string,
  WBS1: string[],
  WBS2: string[],
  WBS3: string[],
  ProductType: string[],
  StructureElement: string[],
  Category: string
}
export interface searchDrawingListModel{
  CustomerCode: string,
  ProjectCode: string,
  FileName : string,
  DrawingNo : string,
  UpdateBy  : string,
  UpdateDateFr   : string,
  UpdateDateTo   : string
}
export interface getWBSListModel{
  CustomerCode: string,
  ProjectCode: string,
  DrawingID : number,
  Revision :number
}
export interface checkIfFileExistsModel{
  CustomerCode: string,
  ProjectCode: string,
  FileName: string[]
}
export interface deleteDrawingModel{
  CustomerCode: string,
  ProjectCode: string,
  DrawingID : number,
}
export interface checkOrderModel {
  DrawingID: number,
  Revision: number
}
export interface getOrderListModel{
  DrawingID: number,
  Revision: number
}
export interface getAssignStrEleModel{
  ProjectCode: string,
}
export interface printDrawingsModel{
  CustomerCode: string,
  ProjectCode: string,
  FileName : string,
  Revision: number
}
export interface deleteDrawingOrderModel{
  OrderNuber : number,
  StructureElement : string,
  ProductType  : string,
  ScheduledProd : string,
  CustomerCode: string,
  ProjectCode: string,
  DrawingID: number,
  Revision: number
}
export interface modifyDrawingModel {
  DrawingID: number;
  DrawingNo: string;
  Remarks: string;
}
