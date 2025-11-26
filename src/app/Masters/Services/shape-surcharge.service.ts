import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shapesurcharge } from 'src/app/Model/shapesurcharge';

@Injectable({

  providedIn: 'root'

})

export class ShapeSurchargeService {

  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }
  GetShapeSurchageList(): Observable<any> {
   // return this.httpClient.get<any[]>('https://localhost:5004/GetShapeSurchageList');
    return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetShapeSurchageList`);
  }
  GetShapeCodes(): Observable<any> {
 //   return this.httpClient.get<any[]>(`https://localhost:5004/GetShapeCodesDropdown`);
    return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetShapeCodesDropdown`);
  }
  GetSurchargesDropdownList(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetSurchargesDropdown`);
    //return this.httpClient.get<any[]>(`https://localhost:5004/GetSurchargesDropdown`);
  }
  DeleteShapeSurchargeGroup(id: number) {
    return this.httpClient.delete<any>(this.apiUrl + `ShapeService/deleteShapeSurchage/${id}`);
    //return this.httpClient.delete<any>(`https://localhost:5004/deleteShapeSurchage/${id}`);
  }
  SaveShapeSurcharge(shapegroupobj: Shapesurcharge[]) {
    console.log("In services ", shapegroupobj);
    return this.httpClient.post<any>(this.apiUrl + `ShapeService/AddShapeSurchage`, shapegroupobj)
   //return this.httpClient.post<any>(`https://localhost:5004/AddShapeSurchage`, shapegroupobj);
  }
  UpdateShapeSurchage(shapegroupobj: Shapesurcharge) {
     return this.httpClient.post<any>(this.apiUrl + `ShapeService/UpdateShapeSurchage`, shapegroupobj);
    //return this.httpClient.post<any>(`https://localhost:5004/UpdateShapeSurchage`, shapegroupobj);
  }
}