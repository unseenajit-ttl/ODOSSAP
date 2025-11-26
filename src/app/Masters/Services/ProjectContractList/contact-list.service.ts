import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  
  GetProductContractList(): Observable<any> {    
    return this.httpClient.get<any[]>(this.apiUrl + `CommonService/GetProjectContractList`);

  }
  GetContractList(projectId:any): Observable<any> {   
    return this.httpClient.get<any[]>(this.apiUrl + `CommonService/GetContractListAsync/${projectId}`);

  }
  GetProjectList(customercode:any): Observable<any> {   
    return this.httpClient.get<any[]>(this.apiUrl + `CommonService/GetProjectListForcontractList/${customercode}`);

  }

  GetProductContractListWithFilter(customerCode:any,startdate:any,enddate:any,projectNo:any,contractNo:any): Observable<any> {   
    console.log(this.apiUrl + `CommonService/GetProjectContractFilter/${customerCode}/${startdate}/${enddate}/${projectNo}/${contractNo}`);
    return this.httpClient.get<any[]>(this.apiUrl + `CommonService/GetProjectContractFilter/${customerCode}/${startdate}/${enddate}/${projectNo}/${contractNo}`);

  }
  

}
