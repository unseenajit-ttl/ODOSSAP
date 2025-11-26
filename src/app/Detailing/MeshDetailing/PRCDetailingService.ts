import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnStructure } from 'src/app/Model/add_ColumnStructure';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PRCDetailingService {

  public Parameter_SetService = new EventEmitter<any>();


  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {
    console.log(this.apiUrl);
   };  
 
//PRC Start
//PRCDetailingService

GetSAPMaterialforPRC(intStructureElementId:number): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetSAPMaterialByStructureElementId/${intStructureElementId}`);

  }
//PRC End
  
  
  
}
