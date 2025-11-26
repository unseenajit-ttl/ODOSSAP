import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Drain_Depth } from 'src/app/Model/Drain_Depth';
import { Insert_Drain_Lap } from 'src/app/Model/Insert_Drain_lap';
import { Insert_Drain_WM } from 'src/app/Model/Insert_Drain_WM';
import { add_drain_parameterset } from 'src/app/Model/add_drain_parameter';
import { InsertPRojectParameter } from 'src/app/Model/InsertProjectparameter';


@Injectable({
  providedIn: 'root'
})
export class DrainParameterSetService {

  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  // GET 
  GetProjectParamDrainDepth(tntParameterSet: any): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetProjectParamDrainDepth/${tntParameterSet}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProjectParamDrainDepth/${tntParameterSet}`);

  }
  GetProjectParamDrainLap(tntParameterSet: any): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetProjectParamDrainLap/${tntParameterSet}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProjectParamDrainLap/${tntParameterSet}`);

  }
  GetProjectParamDrainWM(tntParameterSet: any): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetProjectParamDrainWM/${tntParameterSet}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProjectParamDrainWM/${tntParameterSet}`);

  }
  GetDrainProductCode(): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainProductCode`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetDrainProductCode`);

  }

  GetLapProductCodeWM(tntParameterSet: any): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetLapProductCodeWM/${tntParameterSet}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetLapProductCodeWM/${tntParameterSet}`);

  }

  GetDrainProductTypeById(tntParameterSet: any): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainProductTypeById/${tntParameterSet}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetDrainProductTypeById/${tntParameterSet}`);

  }
  GetDrainProductType(): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainProductType`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetDrainProductType`);
  }

  GetDrainWidthWM(tntParameterSet: any): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainWidthWM/${tntParameterSet}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetDrainWidthWM/${tntParameterSet}`);

  }

  GetProjectParamDrainLayer(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetProjectParamDrainLayer`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProjectParamDrainLayer`);
  }

  GetProjectParamDrainParamDetails(intDrainWMId: any): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetProjectParamDrainParamDetails/${intDrainWMId }`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProjectParamDrainParamDetails/${intDrainWMId}`);

  }

  GetProjectParamDrainShapeforLayer(tntDrainLayerId: any): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetProjectParamDrainShapeforLayer/${tntDrainLayerId}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProjectParamDrainShapeforLayer/${tntDrainLayerId}`);

  }
  GetDrainShapeCode(intProductCodeId: any): Observable<any> {
    //return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainShapeCode/${intProductCodeId}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetDrainShapeCode/${intProductCodeId}`);

  }
  GetProjectParamDrainMaxDepth(intDrainDepthParamId: any): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetProjectParamDrainMaxDepth/${intDrainDepthParamId}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProjectParamDrainMaxDepth/${intDrainDepthParamId}`);

  }

  //Insert 

  Insert_Update_DrainDepth(Drain_Depth: Drain_Depth) {

    //return this.httpClient.post<any>(`https://localhost:5012/InsertProjectParamDrainDepth`, Drain_Depth)
    return this.httpClient.post<any[]>(this.apiUrl + `DrainService/InsertProjectParamDrainDepth`, Drain_Depth)
  }
  Insert_Update_DrainLap(Drain_Lap: Insert_Drain_Lap) {

    //return this.httpClient.post<any>(`https://localhost:5012/InsertProjectParamDrainLap`, Drain_Lap)
    return this.httpClient.post<any[]>(this.apiUrl + `DrainService/InsertProjectParamDrainLap`, Drain_Lap)
  }
  Insert_Update_DrainWM(Drain_WM: Insert_Drain_WM) {

    //return this.httpClient.post<any>(`https://localhost:5012/InsertProjectParamDrainWM`, Drain_WM)
    return this.httpClient.post<any[]>(this.apiUrl + `DrainService/InsertProjectParamDrainWM`, Drain_WM)
  }
  Add_ParameterSet(Parameter_Set: add_drain_parameterset) {

    // return this.httpClient.post<any>(`https://localhost:5012/InsertProjectParameter`, Parameter_Set)
    return this.httpClient.post<any[]>(this.apiUrl + `DrainService/InsertProjectParameter`, Parameter_Set)
  }
  //Delete
  Delete_Drain_Depth(id: number, bitConfirm: number) {
    return this.httpClient.delete<any>(this.apiUrl + `DrainService/DeleteColumnClinkItem/${id}`);
    //return this.httpClient.delete<any>(`https://localhost:5012/DeleteProductParamDrainDepth/${id}/${bitConfirm}`);
  }
  Delete_Drain_Lap(id: number, bitConfirm: boolean) {
    return this.httpClient.delete<any>(this.apiUrl + `DrainService/DeleteProductParamDrainLap/${id}/${bitConfirm}`);
    //return this.httpClient.delete<any>(`https://localhost:5012/DeleteProductParamDrainLap/${id}/${bitConfirm}`);
  }
  Delete_Drain_WM(id: number) {
    return this.httpClient.delete<any>(this.apiUrl + `DrainService/DeleteProductParamDrainWM/${id}`);
    //return this.httpClient.delete<any>(`https://localhost:5012/DeleteProductParamDrainWM/${id}`);
  }
  GetParameterSetLis_Drain(projectId: any): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetDrainParameterSetByPrjID/${projectId}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetDrainParameterSetByPrjID/${projectId}`);

  }
  GetShapeDetails_Drain(ShapeId: any): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetShapeParamDetails/${ShapeId}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetShapeParamDetails/${ShapeId}`);
  }
  Insert_DrainProjectParameterWm(obj: InsertPRojectParameter) {

    // return this.httpClient.post<any>(`https://localhost:5012/InsertProjectDrainParamDetails`, obj)
    return this.httpClient.post<any[]>(this.apiUrl + `DrainService/InsertProjectDrainParamDetails`, obj)
  }

}
