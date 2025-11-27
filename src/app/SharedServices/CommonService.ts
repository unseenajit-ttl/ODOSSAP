import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiUrl = environment.apiUrl;
  ODOSTitle = 'ODOS';
  private titleSource = new BehaviorSubject<string>('Home | ODOS');
  currentTitle = this.titleSource.asObservable();
  includeOptionalProjects:boolean=false;
  clearDateRangeLoader:boolean=false;

  Submission: string = '';
  Editable: string = '';
  isEsmUser: boolean = false;

  private jwtToken: string = '';

  constructor(private httpClient: HttpClient) {}
  GetToken() {
    return this.jwtToken;
  }
  SetToken(Token: any) {
    this.jwtToken = Token;
  }
  changeTitle(title: string) {
    this.titleSource.next(title);
  }
  GetTitle() {
    return this.ODOSTitle;
  }
  SetTitle(Title: any) {
    this.ODOSTitle = Title;
  }
  GetCutomerDetails(): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl + 'CommonService/GetCustomers'
    );
    //return this.httpClient.get<any[]>("https://localhost:5005/GetCustomers");
  }

  GetESMCutomerDetails(IsEsm: boolean): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl + `CommonService/GetESMCustomers/${IsEsm}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5005/GetESMCustomers/${IsEsm}`);
  }

  GetUsers(): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(this.apiUrl + `CommonService/GetUsers`);
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetUsers`);
  }

  GetProjectDetails(customercode: any): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `CommonService/GetProject/${customercode}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5005/GetProject/${customercode}`);
  }
  GetProductType(): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + 'CommonService/GetProductType'
    );
    // return this.httpClient.get<any[]>(`https://localhost:5005/GetProductType`);
  }

  getToken() {
    //return this.httpClient.get<any>(`https://devodos.natsteel.com.sg/ODOS_Auth/Home/gettoken`);
    return this.httpClient.get<any>(
      `https://devodos.natsteel.com.sg/ODOS_Auth/Home/gettoken`
    );
  }

  GetContract(projectId: any) {
    return this.httpClient.get<any>(
      this.apiUrl + `CommonService/GetContractListAsync/${projectId}`
    );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5005/GetContractListAsync/${projectId}`
    // );
  }
  SendToken(formData: FormData): Observable<any> {
    debugger;

    //return this.httpClient.post<any>(`https://localhost:7297/IndexUMP`, formData)
    return this.httpClient.post<any>(`https://odossap.natsteel.com.sg/TokenHandler/IndexUMP`, formData) // For SAP 
    // return this.httpClient.post<any>(`https://devodos.natsteel.com.sg:71/IndexUMP`, formData)
    //return this.httpClient.post<any>(`https://odos.natsteel.com.sg:71/IndexUMP`, formData)
    // return this.httpClient.post<any>(
    //   `https://odos.natsteel.com.sg:71/IndexUMP`,
    //   formData
    // );
    // return this.httpClient.post<any>(
    //   `https://odos.natsteel.com.sg/TokenHandler/IndexUMP`,
    //   formData
    // );
  }

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, value);
  }
  getLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  GetUserId(Username: string): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `CommonService/GetUserId/${Username}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5005/GetUserId/${Username}`);
  }

  GetEsmTonnageReport(FromDate: any, ToDate: any): Observable<any> {
    debugger;
      return this.httpClient.get<any[]>(
        this.apiUrl + `CommonService/GetEsmTonnageReport/${FromDate}/${ToDate}`
      );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetEsmTonnageReport/${FromDate}/${ToDate}`);
  }
  GetTonnageReport(
    FromDate: any,
    ToDate: any,
    user: any,
    rptType: any
  ): Observable<any> {
    debugger;
     return this.httpClient.get<any[]>(
       this.apiUrl +
         `CommonService/GetTonnageReport/${FromDate}/${ToDate}/${user}/${rptType}`
     );
   //return this.httpClient.get<any[]>(`https://localhost:5005/GetTonnageReport/${FromDate}/${ToDate}/${user}/${rptType}`);
  }
  getTonnageReportByCustomerAndProject(
    FromDate: any,
    ToDate: any,
    projectCode: any,
    rptType: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `CommonService/GetTonnageReportByCustomerAndProject/${FromDate}/${ToDate}/${projectCode}/${rptType}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5005/GetTonnageReportByCustomerAndProject/${FromDate}/${ToDate}/${projectCode}/${rptType}`);
  }

  GetBPCOrderReport(FromDate: any, ToDate: any): Observable<any> {
    debugger;
      return this.httpClient.get<any[]>(
        this.apiUrl + `CommonService/GetBPCOrderReport/${FromDate}/${ToDate}`
      );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetBPCOrderReport/${FromDate}/${ToDate}`);
  }

  GetCustomerName(CustomerCode: any): Observable<any> {
    debugger;
      return this.httpClient.get<any[]>(
        this.apiUrl + `CommonService/GetCustomerName/${CustomerCode}`
      );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetCustomerName/${CustomerCode}`);
  }

  GetProjectName(ProjectCode: any): Observable<any> {
    debugger;
      return this.httpClient.get<any[]>(
        this.apiUrl + `CommonService/GetProjectName/${ProjectCode}`
      );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetProjectName/${ProjectCode}`);
  }

  GetOrderStatus(FromDate: any, ToDate: any,ProductType:any): Observable<any> {
    debugger;

    let url = `/GetOrderStatus/${FromDate}/${ToDate}`;

    // Append optional product type as query string if provided
    if (ProductType) {
      url += `?ProductType=${encodeURIComponent(ProductType)}`;
    }

    return this.httpClient.get<any[]>(
        this.apiUrl + `CommonService`+url
      );
    // console.log(`https://localhost:5005`+url)
    // return this.httpClient.get<any[]>(`https://localhost:5005`+url);
      
    
  }

  GetMissingGIOrders(FromDate: any, ToDate: any,ProductType:any): Observable<any> {
    debugger;
    debugger;

    let url = `/GetMissingGIOrders/${FromDate}/${ToDate}`;

    // Append optional product type as query string if provided
    if (ProductType) {
      url += `?ProductType=${encodeURIComponent(ProductType)}`;
    }

    return this.httpClient.get<any[]>(
        this.apiUrl + `CommonService`+url
      );
    // console.log(`https://localhost:5005`+url)
    // return this.httpClient.get<any[]>(`https://localhost:5005`+url);
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetMissingGIOrders/${FromDate}/${ToDate}/${ProductType}`);
  }

  GetProductTypeOrderStatus(FromDate: any, ToDate: any): Observable<any> {
    debugger;
      return this.httpClient.get<any[]>(
        this.apiUrl + `CommonService/GetProductType/${FromDate}/${ToDate}`
      );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetProductType/${FromDate}/${ToDate}`);
  }
}
