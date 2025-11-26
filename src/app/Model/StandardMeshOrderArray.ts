import { DateTimeProvider } from 'angular-oauth2-oidc';

export interface StandardMeshOrderArray {
  std_sheet_id: number;
  s_no: number;
  std_type: string;
  mesh_series: string;
  ss561_name: string;
  ss32_name: string;
  mw_length: number;
  mw_size: number;
  mw_spacing: number;
  mo1: number;
  mo2: number;
  cw_length: number;
  cw_size: number;
  cw_spacing: number;
  co1: number;
  co2: number;
  unit_weight: any;
  sap_mcode: string;
  oes_order: number;
  order_pcs: any;
  order_wt: any;
}

export interface StdSheetDetailsModels {
  CustomerCode: string;
  ProjectCode: string;
  JobID: number;
  SheetID: number;
  SheetSort: number;
  std_type: string;
  mesh_series: string;
  sheet_name: string;
  mw_length: number;
  mw_size: number;
  mw_spacing: number;
  mo1: number;
  mo2: number;
  cw_length: number;
  cw_size: number;
  cw_spacing: number;
  co1: number;
  co2: number;
  unit_weight: number;
  order_pcs: number;
  order_wt: number;
  sap_mcode: string;
  UpdateBy: string;
  UpdateDate: DateTimeProvider;
}
