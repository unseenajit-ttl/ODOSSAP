import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UpdateParameterSet_BPC } from 'src/app/Model/UpdateParameterSet_BPC';
import { LoginService } from 'src/app/services/login.service';


@Injectable({
  providedIn: 'root'
})
export class BorePileService {

  apiUrl = environment.apiUrl;
  userId:any
  constructor(private httpClient: HttpClient,
    private loginService: LoginService,) { 
    this.userId = this.loginService.GetUserId()

  }

  GetParameterSetLis_BorePile(projectId: any): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/populateDDParamSetNumber/${projectId}`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/populateDDParamSetNumber/${projectId}`);

  }
  GetProductType_BorePile(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetProductType_Bore`);
    return this.httpClient.get<any[]>(this.apiUrl + `DrainService/GetProductType_Bore`);

  }

  InsertParameterSet_BorePile(ProjectId:any,ProductType:any) {
// 
let userId = this.userId
    // return this.httpClient.post<any>(`https://localhost:5012/InsertParameterSet_BorePile/${ProjectId}`,ProductType)
    return this.httpClient.post<any[]>(this.apiUrl + `DrainService/InsertParameterSet_BorePile/${ProjectId}/${userId}`,ProductType)
  }

  UpdateParameterSet_BorePile(obj:UpdateParameterSet_BPC) {
    // 
        // return this.httpClient.post<any>(`https://localhost:5012/UpdateParameterSet_BorePile`,obj)
        return this.httpClient.post<any[]>(this.apiUrl + `DrainService/UpdateParameterSet_BorePile`,obj)
      }

 

}
