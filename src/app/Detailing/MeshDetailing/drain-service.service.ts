import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnStructure } from 'src/app/Model/add_ColumnStructure';
import { Add_GroupMarkPRC } from 'src/app/Model/add_GroupMarkPRC';
import { add_ProductMark_Drain } from 'src/app/Model/add_Productmark_Drain';
import { Insert_Main_Drain } from 'src/app/Model/Insert_Main_Drain';
import { environment } from 'src/environments/environment';
import { GenerateOtherDrainProduct } from 'src/app/Model/GenerateOtherDrainProduct';
import { JobAdviceModels } from 'src/app/Model/jobadvicemodels';
import { OrderDetailsRetModels } from 'src/app/Model/orderdetailsretmodels';

@Injectable({
  providedIn: 'root'
})
export class DrainService {

  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {
    //console.log(this.apiUrl);
   };

   Get_StructMarkDetails(GroupMarkingName: any,ProjectId : any,SEDetailingId : any,GroupMarkID : any) {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainStructureMarking/${GroupMarkingName}/${ProjectId}/${SEDetailingId}/${GroupMarkID}`);
    return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetDrainStructureMarking/${GroupMarkingName}/${ProjectId}/${SEDetailingId}/${GroupMarkID}`);

  }
  SaveDrain_StructureMarking(drain_obj: Insert_Main_Drain) {
    debugger;
    return this.httpClient.post<any>( this.apiUrl + `DrainService/DrainStructureMarking_InsUpd`, drain_obj);
    // return this.httpClient.post<any>( `https://localhost:5012/DrainStructureMarking_InsUpd`, drain_obj);

 }
 Delete_StructureMarking(id: any) {
  debugger
  return this.httpClient.delete<any>(this.apiUrl + `DrainService/DrainStructureMarking_Del/${id}`);
  // return this.httpClient.delete<any>(`https://localhost:5012/DrainStructureMarking_Del/${id}`);


}

SaveDrain_ProductMark(drain_obj: add_ProductMark_Drain) {
  debugger;
  return this.httpClient.post<any>( this.apiUrl + `DrainService/DrainProductMarkingDetails_InsUpd`, drain_obj);
  // return this.httpClient.post<any>( `https://localhost:5012/DrainProductMarkingDetails_InsUpd`, drain_obj);

}

Get_ParameterSet_values(tntParameterSet:any) {
  // return this.httpClient.get<any[]>(`https://localhost:5012/DrainParamInfo_Get/${tntParameterSet}`);
  return this.httpClient.get<any[]>(this.apiUrl +`DrainService/DrainParamInfo_Get/${tntParameterSet}`);

}
Get_DrainProductMark(drainStructuremarkId:any) {
  // return this.httpClient.get<any[]>(`https://localhost:5012/DrainProductMarkingDetails_Get/${drainStructuremarkId}`);
  return this.httpClient.get<any[]>(this.apiUrl +`DrainService/DrainProductMarkingDetails_Get/${drainStructuremarkId}`);

}

Delete_DrainProductMarking(id: any) {
  debugger
  return this.httpClient.delete<any>(this.apiUrl + `DrainService/DeleteDrainProductMarking/${id}`);
  // return this.httpClient.delete<any>(`https://localhost:5012/DeleteDrainProductMarking/${id}`);



}

Update_ProductMark(drain_obj: any) {
  debugger;
  return this.httpClient.post<any>( this.apiUrl + `DrainService/DrainProductMarkingDetails_Update`, drain_obj);
  // return this.httpClient.post<any>( `https://localhost:5012/DrainProductMarkingDetails_Update`, drain_obj);

}
Get_DrainOtherProductMarkingDetails(drainStructuremarkId:any) {
  // return this.httpClient.get<any[]>(`https://localhost:5012/PopulateOtherProductMarking/${drainStructuremarkId}`);
  return this.httpClient.get<any[]>(this.apiUrl +`DrainService/PopulateOtherProductMarking/${drainStructuremarkId}`);

}
GenerateOtherDrainProduct(GenerateOtherDrainProduct:GenerateOtherDrainProduct)
{
  return this.httpClient.post<any>( this.apiUrl + `DrainService/GenerateOtherDrainProduct`, GenerateOtherDrainProduct);
  // return this.httpClient.post<any>( `https://localhost:5012/GenerateOtherDrainProduct`, GenerateOtherDrainProduct);
}
Get_SWShapeCode() {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetSWShapeCode`);
  return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetSWShapeCode`);

}
Get_SWProductCode(strProductCode:any) {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetSWProductCode/${strProductCode}`);
  return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetSWProductCode/${strProductCode}`);

}

GetDrainProductCode(): Observable<any> {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainProductCode`);
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetDrainProductCode`);
 }
 GetDrainShapeparamDetails(ShapeId:any): Observable<any> {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetShapeParamDetails/${ShapeId}`);
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetShapeParamDetails/${ShapeId}`);
 }

 GetOthProductCode(productCode:string): Observable<any> {
  debugger;

  const obj={
    vchProductCode:productCode
  }

  // return this.httpClient.post<any[]>(`https://localhost:5012/GetOthProductCode`,obj);
   return this.httpClient.post<any[]>(this.apiUrl +`DrainService/GetOthProductCode`,obj);
 }

 Save_JobAdvice(obj: JobAdviceModels) {
  // return this.httpClient.post<any>(
  //   `https://localhost:5009/saveMeshOthersDetails_ctsmesh`,
  //   obj
  // );
  return this.httpClient.post<any[]>(this.apiUrl + `OrderService/SaveJobAdvice`, obj)
}

check_BBSNo(CustomerCode: string, ProjectCode: string, JobID: number, BBSNo: string): Observable<any> {
  // return this.httpClient.get<any[]>(
  //   this.apiUrl +
  //   `OrderService/checkBBSNo/${CustomerCode}/${ProjectCode}/${JobID}/${BBSNo}`
  // );
  return this.httpClient.get<any[]>(
    `https://localhost:5009/checkBBSNo/${CustomerCode}/${ProjectCode}/${JobID}/${BBSNo}`
  );
}

get_CreepDeduction(
  obj: OrderDetailsRetModels,
  InvLength: number,

) {
  // return this.httpClient.post<any>(
  //   `https://localhost:5009/getCreepDeduction/${RDateFrom}/${RDateTo}/${Rev_required_Conf_date_from}/${Rev_required_Conf_date_to}/${Rev_Req_Confirmed_Date_Search_Range}`,
  //   OrdersAmendment
  // );3
  return this.httpClient.post<any>(this.apiUrl + `OrderService/getCreepDeduction/${InvLength}`, obj);
}
GetDrainParamDepthValues(GroupMarkId:any,tntParameterSetNo:any): Observable<any> {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainParamDepthValues/${GroupMarkId}/${tntParameterSetNo}`);
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetDrainParamDepthValues/${GroupMarkId}/${tntParameterSetNo}`);
 }

 GetAllColumnsEsm(): Observable<any> {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetColumnName_ESM`);
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetColumnName_ESM`);
 }

 GetEsmTrackingDetails(trackingNo:any): Observable<any> {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainParamDepthValues/${GroupMarkId}/${tntParameterSetNo}`);
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetEsmTrackingDetails/${trackingNo}`);
 }

 GetCustomViews_ESM(trackingNo:any): Observable<any> {
  // return this.httpClient.get<any[]>(`https://localhost:5012/GetCustomViews_ESM/${trackingNo}`);
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetCustomViews_ESM/${trackingNo}`);
 }
 AddUpdate(obj:any)
 {
  // return this.httpClient.post<any[]>(`https://localhost:5012/AddCustomViews`,obj);
   return this.httpClient.post<any[]>(this.apiUrl +`DrainService/AddCustomViews`,obj);
  }
  DeleteEsmCustomViews(id:number)
  {
      // return this.httpClient.delete<any[]>(`https://localhost:5012/DeleteEsmCustomView/${id}`);
      return this.httpClient.delete<any[]>(this.apiUrl +`DrainService/DeleteEsmCustomView/${id}`);
  }
 


}
