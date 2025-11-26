import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADD_beamParameter } from 'src/app/Model/add_beamParameter';
import { ADD_cappingParameter } from 'src/app/Model/add_cappingParameter';
import { ADD_clinklineitem } from 'src/app/Model/add_ClinkLineItem';
import { ADD_columnParameter } from 'src/app/Model/add_columnParameter';
import { ADD_meshParameter } from 'src/app/Model/add_MeshParameter';
import { ADD_meshParameterLap} from 'src/app/Model/add_meshParamLap'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametersetService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  GetParameterSetList(projectId:any): Observable<any> {   
   // return this.httpClient.get<any[]>(`https://localhost:5008/GetCommonParameterSet_Dropdown/${projectId}`);
   return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetCommonParameterSet_Dropdown/${projectId}`);

  }

  SaveCommonParamter(add_meshParameter:ADD_meshParameter){
    // return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/CommonParamterInsert`, add_meshParameter)
    return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/CommonParamterInsert`, add_meshParameter)
  }

  DeleteCommonParamter(add_meshParameter:ADD_meshParameter){
    // return this.httpClient.post<any[]>(`https://localhost:5008/DeleteCommonParamter`, add_meshParameter)
    return this.httpClient.post<any>(this.apiUrl +`ParameterSetService/DeleteCommonParamter`, add_meshParameter)
  }

  
  //MESH
 
  GetMeshGridlist(projectId: any, parameternumber: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetMeshList/${projectId}/${parameternumber}`);
  }

  GetWallGridlist(projectId: any, parameternumber: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetWallList/${projectId}/${parameternumber}`);
  }
  GetProductCodeList(projectId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetMeshProductCode_Dropdown/${projectId}`);
  }
  DeleteGridlist(id: number) {
    return this.httpClient.delete<any>(this.apiUrl +`ParameterSetService/DeleteMesh/${id}`);
  }
 
  SaveMeshProjectParamLap(add_meshParamLap:ADD_meshParameterLap){
    // return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/AddMeshProjectParamLap`, add_meshParamLap)
    return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/AddMeshProjectParamLap`, add_meshParamLap)
  }
 
  
  //COLUMN
  GetParameterSetListForColumn(projectId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetColumnParameterSet_Dropdown/${projectId}`);
  }
  GetColumnGridlist(projectId: any, parameternumber: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetColumnList/${projectId}/${parameternumber}`);
  }
  GetClinkList(projectId: any, parameternumber: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetClinkLineItem/${projectId}/${parameternumber}`);
  }
  DeleteClinklist(id: number) {
    return this.httpClient.delete<any>(this.apiUrl +`ParameterSetService/DeleteColumnClinkItem/${id}`);
  }
  SaveColumnParamter(add_columnParameter:ADD_columnParameter){
    return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/SaveColumnParameterSet`, add_columnParameter)
  }
  SaveClinkLineItem(add_clinkLineitem:ADD_clinklineitem){
    return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/SaveClinkLineItem`, add_clinkLineitem)
  }

  //BEAM
  GetParameterSetListForBeam(projectId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetBeamParameterSet_Dropdown/${projectId}`);
  }
  GetBeamGridlist(projectId: any, parameternumber: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetBeamList/${projectId}/${parameternumber}`);
  }
  GetCappingList(projectId: any, parameternumber: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetCappingLineItem/${projectId}/${parameternumber}`);
  }
  DeleteCappinglist(id: number) {
    return this.httpClient.delete<any>(this.apiUrl +`ParameterSetService/DeleteCappingItem/${id}`);
  }
  SaveCappingParamter(add_cappingParameter:ADD_cappingParameter){
    return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/SaveCappingItem`, add_cappingParameter)
  }
  SaveBeamParamter(add_beamParameter:ADD_beamParameter){
    return this.httpClient.post<any[]>(this.apiUrl +`ParameterSetService/SaveBeamParameterSet`, add_beamParameter)
  }

  GetCappingProductList(cappingProduct: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/GetCappingProductList/${cappingProduct}`);
  }

  GetTransportModeList(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5008/Get_TransportMode`);
  return this.httpClient.get<any[]>(this.apiUrl +`ParameterSetService/Get_TransportMode`);
}
}