import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessoriesService {

  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {

    console.log(this.apiUrl);
   };
   GetAccessoriesList(DetailingID:any): Observable<any> {    
    debugger;
   //return this.httpClient.get<any[]>(`https://localhost:5002/GetAccessoriesMarkingDetails/${DetailingID}`);
    return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetAccessoriesMarkingDetails/${DetailingID}`);
  }

  GetSapMaterialList(Sapcode:any): Observable<any> {    
    debugger;
  //  return this.httpClient.get<any[]>(`https://localhost:5002/GetSapMaterial/${Sapcode}`);
   
    return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetSapMaterial/${Sapcode}`);
  }
  Insert_Acs(Accessory:any) {
    debugger;
    // return this.httpClient.post<any>(`https://localhost:5002/InsertAccessories`, Accessory);
    return this.httpClient.post<any>(this.apiUrl +`Detailing/InsertAccessories`,Accessory);
  }
  DeleteACS(id: any) {
    debugger
     return this.httpClient.delete<any>(this.apiUrl + `Detailing/DeleteAccessories/${id}`);  
    // return this.httpClient.delete<any>(`https://localhost:5002/DeleteAccessories/${id}`);

  }
  

}
