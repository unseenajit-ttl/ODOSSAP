import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostOrederSummary } from '../Model/postOrderSummary';
import { LoginService } from '../services/login.service';
import { GETWBS_Copy } from '../Model/GetWBS_Copy';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  apiUrl: any = environment.apiUrl;

  constructor(private httpClient: HttpClient,private loginService: LoginService) { }

  Copy_ProjectParam(copy_obj:any) {
    debugger;
    return this.httpClient.post<any>(this.apiUrl +`UtilityService/InsertCopyProjectParameter`, copy_obj);

    // return this.httpClient.post<any>(`https://localhost:5010/InsertCopyProjectParameter`, copy_obj);
  }

  Get_ParameterSetList(projectid:any,ProductTypeId:any,structureelement:any,Meshtype:any): Observable<any> {   
    // return this.httpClient.get<any[]>(`https://localhost:5010/CopyProjectParameterSetGet/${projectid}/${ProductTypeId}/${Meshtype}/${structureelement}`);
    return this.httpClient.get<any[]>(this.apiUrl +`UtilityService/CopyProjectParameterSetGet/${projectid}/${ProductTypeId}/${Meshtype}/${structureelement}`);
  
   }

   Get_Groupmarking(projectid:any,ProductTypeId:any,structureelement:any): Observable<any> {   



   
    // return this.httpClient.get<any[]>(`https://localhost:5010/CopyGroupmarkGetGroupmarkingName/${projectid}/${ProductTypeId}/${structureelement}`);
    return this.httpClient.get<any[]>(this.apiUrl +`UtilityService/CopyGroupmarkGetGroupmarkingName/${projectid}/${ProductTypeId}/${structureelement}`);
  
   }

   Get_BBSDescription(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,wbs3:any,WBSTypeId:any){

    const obj:GETWBS_Copy={
      ProjectId: projectid,
      structureElementId: structElement,
      productTypeId: ProductTypeId,
      WBS1: wbs1,
      WBSFrom: wbs2,
      WBSTo: '',
      WBS3: wbs3
    }
    // return this.httpClient.post<any[]>(`https://localhost:5010/GetBBSNoAndBBSDesc/${WBSTypeId}`,obj);
    return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/GetBBSNoAndBBSDesc/${WBSTypeId}`,obj);
     }
   Get_RevisionNoandParameterSet(projectid:any,ProductTypeId:any,structureelement:any,GroupmarkinName:any): Observable<any> {   
    debugger;
   

    const obj:any={
      ProjectId:projectid,
      SElement:structureelement,
      ProductTypeId:ProductTypeId,
      GroupMarkingName:GroupmarkinName,    
    }


    // return this.httpClient.post<any[]>(`https://localhost:5010/GetRevisionAndParameterValuesByGroupMarkName`,obj);
    return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/GetRevisionAndParameterValuesByGroupMarkName`,obj);
  
   }

   Copy_WBS(copy_obj:any) {
        debugger;
        let UserName = this.loginService.GetGroupName();
        const username = UserName.split('@')[0];
        copy_obj.UserName = username;

    return this.httpClient.post<any>(this.apiUrl +`UtilityService/CopyWBSDetailing`, copy_obj);
    // return this.httpClient.post<any>(`https://localhost:5010/CopyWBSDetailing`, copy_obj);
   }

  Copy_Gropumarking(copy_obj:any,ProductType:any) {
    debugger;
    return this.httpClient.post<any>(this.apiUrl +`UtilityService/CopyGroupMarking/${ProductType}`, copy_obj);
    // return this.httpClient.post<any>(`https://localhost:5010/CopyGroupMarking/${ProductType}`,copy_obj);
  }
  Get_WBS1(projectid:any,ProductTypeId:any,structElement:any,WBSTypeId:any){
 
    // return this.httpClient.get<any[]>(`https://localhost:5010/GetWBS1/${projectid}/${structElement}/${ProductTypeId}`);
    return this.httpClient.get<any[]>(this.apiUrl +`UtilityService/GetWBS1/${projectid}/${structElement}/${ProductTypeId}`);

  
   }
   Get_WBS2(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,WBSTypeId:any){

    const obj:GETWBS_Copy={
      ProjectId: 0,
      structureElementId: 0,
      productTypeId: 0,
      WBS1: wbs1,
      WBSFrom: '',
      WBSTo: '',
      WBS3: ''
    }
    // return this.httpClient.post<any[]>(`https://localhost:5010/GetWBS2/${projectid}/${structElement}/${ProductTypeId}`,obj);
    return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/GetWBS2/${projectid}/${structElement}/${ProductTypeId}`,obj);

  
   }
   Get_WBS3(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,WBSTypeId:any){
    debugger;
    const obj:GETWBS_Copy={
      ProjectId: 0,
      structureElementId: 0,
      productTypeId: 0,
      WBS1: wbs1,
      WBSFrom: wbs2,
      WBSTo: '',
      WBS3: ''
    }
    // return this.httpClient.post<any[]>(`https://localhost:5010/GetWBS3/${projectid}/${structElement}/${ProductTypeId}`,obj);
    return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/GetWBS3/${projectid}/${structElement}/${ProductTypeId}`,obj);
  
   }
   Get_CopyWBS1(projectid:any,ProductTypeId:any,structElement:any,WBSTypeId:any){
    
    // return this.httpClient.get<any[]>(`https://localhost:5010/GetCopyWBS1/${projectid}/${structElement}/${ProductTypeId}/${WBSTypeId}`);
    return this.httpClient.get<any[]>(this.apiUrl +`UtilityService/GetCopyWBS1/${projectid}/${structElement}/${ProductTypeId}/${WBSTypeId}`);

   }
   Get_CopyWBS2(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,WBSTypeId:any){
    const obj:GETWBS_Copy={
      ProjectId: projectid,
      structureElementId: structElement,
      productTypeId: ProductTypeId,
      WBS1: wbs1,
      WBSFrom: '',
      WBSTo: '',
      WBS3: ''
    }
    // return this.httpClient.post<any[]>(`https://localhost:5010/GetCopyWBS2`,obj);
    return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/GetCopyWBS2`,obj);
  
   }
   Get_CopyWBS3(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbs2:any,WBSTypeId:any){
    const obj:GETWBS_Copy={
      ProjectId: projectid,
      structureElementId: structElement,
      productTypeId: ProductTypeId,
      WBS1: wbs1,
      WBSFrom: wbs2,
      WBSTo: '',
      WBS3: ''
    }
        // return this.httpClient.post<any[]>(`https://localhost:5010/GetCopyWBS3`,obj);
        return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/GetCopyWBS3`,obj);

   }
   GetDestWBSDetails(projectid:any,ProductTypeId:any,structElement:any,wbs1:any,wbsFrom:any,wbsTo:any,wbs3:any,WBSTypeId:any){
    const obj:GETWBS_Copy={
      ProjectId: projectid,
      structureElementId: structElement,
      productTypeId: ProductTypeId,
      WBS1: wbs1,
      WBSFrom: wbsFrom,
      WBSTo: wbsTo,
      WBS3: wbs3
    }
    // return this.httpClient.post<any[]>(`https://localhost:5010/GetDestWBSDetails/${WBSTypeId}`,obj);
    return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/GetDestWBSDetails/${WBSTypeId}`,obj);
  
   }

   check_Groupmarking(projectid:any,ProductTypeId:any,structureelement:any,GmNmae:any): Observable<any> { 
    
    let obj = {
      PROJECTID:projectid,
      STRUCTUREELEMENTTYPEID:structureelement,
      PRODUCTTYPEID:ProductTypeId,
      GROUPMARKINGNAME:GmNmae
    }
    // return this.httpClient.post<any[]>(`https://localhost:5010/CheckGroupmarkExist`,obj);
    return this.httpClient.post<any[]>(this.apiUrl +`UtilityService/CheckGroupmarkExist`,obj);
  
   }

   
}