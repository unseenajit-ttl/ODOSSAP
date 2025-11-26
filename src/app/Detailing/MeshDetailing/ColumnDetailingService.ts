import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnStructure } from 'src/app/Model/add_ColumnStructure';
import { Add_GroupMarkPRC } from 'src/app/Model/add_GroupMarkPRC';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColumnDetailingService {

  public Parameter_SetService = new EventEmitter<any>();


  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {
    //console.log(this.apiUrl);
   };  
 
  //Column Start
  GetColumnStructureMarkingDetails(projectID:any,seDetailingID:any,StructureElementId:any,productTypeID:any): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetColumnStructureMarkingDetails/${projectID}/${seDetailingID}/${StructureElementId}/${productTypeID}`);

  }
  PopulateColumnShapeCode(): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/PopulateColumnShapeCode`);

  }
  PopulateColumnProductCode(structureElementTypeID:any,productTypeID:any): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/PopulateColumnProductCode/${structureElementTypeID}/${productTypeID}`);

  }
  PopulateFilterProductCode(structureElementTypeID:any,productTypeID:any,enteredText:string): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/PopulateFilterProductCode/${structureElementTypeID}/${productTypeID}/${enteredText}`);

  }
  PopulateFilterClinkProduct(enteredText:string): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/PopulateFilterClinkProduct/${enteredText}`);

  }
  ColumnParameterSetbyProjIdProdType(projectId:any,productTypeId:any){
    return this.httpClient.get<any[]>(this.apiUrl +`Detailing/ColumnParameterSetbyProjIdProdType/${projectId}/${productTypeId}`);

  }
  SaveColumnStructureMarking(ColumnStructureObj: ColumnStructure,topCover:any,bottomCover:any,leftCover:any,rightCover:any,leg:any, seDetailingID:any,userId :any) {
    debugger;
    //console.log(ColumnStructureObj);
    return this.httpClient.post<any>(this.apiUrl +`Detailing/InsertColumnStructureMarking/${topCover}/${bottomCover}/${leftCover}/${rightCover}/${leg}/${seDetailingID}/${userId}`, ColumnStructureObj);
   
  }
  
  DeleteColumnStructureMarking(StructureMarkId: number) {
    return this.httpClient.delete<any>(this.apiUrl +`Detailing/DeleteColumnStructureMarking/${StructureMarkId}`);
  }
 
  UpdateColumnStructureMarking(ColumnStructureObj: ColumnStructure,topCover:any,bottomCover:any,leftCover:any,rightCover:any,leg:any, seDetailingID:any,userId :any) {
    debugger;
    //console.log(ColumnStructureObj);
    return this.httpClient.post<any>(this.apiUrl +`Detailing/UpdateColumnStructureMarking/${topCover}/${bottomCover}/${leftCover}/${rightCover}/${leg}/${seDetailingID}/${userId}`, ColumnStructureObj);
   
  }
  
  UpdateGroupMarking(SeDetailId:any,ParamSetNumber :any) : Observable<any> { 
    return this.httpClient.get<any>(this.apiUrl +`Detailing/UpdateGroupMarking/${SeDetailId}/${ParamSetNumber}`);
   
  }

  RegenerateValidation(ColumnStructureObj: ColumnStructure[],topCover:any,bottomCover:any,leftCover:any,rightCover:any,leg:any, seDetailingID:any,userId :any,structureElementId:any) {
    debugger;
    //console.log(ColumnStructureObj);
    return this.httpClient.post<any>(this.apiUrl +`Detailing/RegenerateValidation/${topCover}/${bottomCover}/${leftCover}/${rightCover}/${leg}/${seDetailingID}/${userId}/${structureElementId}`, ColumnStructureObj);
   
  }
  //Column End
  
  //PRC Start
  GetSAPMaterialforPRC(intStructureElementId:number): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetSAPMaterialByStructureElementId/${intStructureElementId}`);

  }
  //SavePRC_GroupMarkDetails

  SavePRC_GroupMarkDetails(PRCGroupMarkObj: Add_GroupMarkPRC,SeDetailId:any) {
    debugger;
   // return this.httpClient.post<any>(`https://localhost:5002/SavePRCGroupMarkDetails/${SeDetailId}`, PRCGroupMarkObj);
     return this.httpClient.post<any>(this.apiUrl +`Detailing/SavePRCGroupMarkDetails/${SeDetailId}`, PRCGroupMarkObj);
   
  }
  //

  GetPRCSAPHeaderValuesByGroupMarkId(GroupMarkId:any) : Observable<any> { 
    return this.httpClient.get<any>(this.apiUrl +`Detailing/GetPRCSAPHeaderValuesByGroupMarkId/${GroupMarkId}`);
   
  }
  //PRC End

//Core Cage API
  PopulateCoreCageProductCode() {
    return this.httpClient.get<any[]>(this.apiUrl + `Detailing/PopulateCoreCageProductCode`);  
  }
  CoreCageSelectdProductCode(GroupMarkId:any)
  {
    return this.httpClient.get<any[]>(this.apiUrl + `Detailing/CoreCageSelectdProductCode/${GroupMarkId}`);
  } 
  
  Get_Leg_values(tntParameterSet:any,ProductCodeId:any) {
    //return this.httpClient.get<any[]>(`https://localhost:5002/GetColumnLeg/${tntParameterSet}/${ProductCodeId}`);
    return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetColumnLeg/${tntParameterSet}/${ProductCodeId}`);
 
 
  }

  updateStructureMarking_Column(structuremarking:any,StructureMarkId:any,qty:any)
  {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/updateStructureMarking_column/${structuremarking}/${StructureMarkId}/${qty}`
    );
  }
  
  
}
