export interface ExportUpcomingModel {
  pColumnsID: string[];
  pColumnName: string[];
  pColumnSize: number[];
  UserName: string;
  CustomerCode: string;
  ProjectCode: string[];
  OrderNumber: string;
  StrucutrueElement: string;
  WBS1: string;
  WBS2: string;
  WBS3: string;
  ProductType: string;
  ForeCastDate: Date | null;//'2024-12-10T09:55:05.738Z';
  LowerPONumber:string,
  LowerFloorBBSNo: string;
  LowerFloorBBSDesc: string;
  FloorTonnage: number;
  ConvertOrderDate: Date | null;//'2024-12-10T09:55:05.738Z';
  ConvertedOrderBy: string;
  ESTTonnage:number;
  PlannedDelDate: Date | null;//'2024-12-10T09:55
}
