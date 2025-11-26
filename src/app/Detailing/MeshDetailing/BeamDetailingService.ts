import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeamStructure } from 'src/app/Model/add_BeamStructure';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeamDetailingService {

  public Parameter_SetService = new EventEmitter<any>();


  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {
    //console.log(this.apiUrl);
   }; 

   GetBeamStructureMarkingDetails(groupMarkName:any,projectID:any,seDetailingID:any,StructureElementId:any,productTypeID:any,groupMarkID:any): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetBeamStructureMarkingDetails/${groupMarkName}/${projectID}/${seDetailingID}/${StructureElementId}/${productTypeID}/${groupMarkID}`);
  }

  PopulateBeamProductCode(structureElementTypeID:any,productTypeID:any): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/PopulateBeamProductCode/${structureElementTypeID}/${productTypeID}`);
  }

  PopulateBeamShapeCode(): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/PopulateBeamShapeCode`);
  }
  PopulateBeamCapProductCode(): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`Detailing/PopulateBeamCapProductCode`);
  }
  BeamParameterSetbyProjIdProdType(projectId:any,productTypeId:any){
    return this.httpClient.get<any[]>(this.apiUrl +`Detailing/BeamParameterSetbyProjIdProdType/${projectId}/${productTypeId}`);

 }

 SaveBeamStructureMarking(BeamStructureObj: BeamStructure,gap1:number,  gap2:number,  topCover :number,  bottomCover:number,  leftCover:number,  rightCover:number,  hook:number,  leg:number,  seDetailingID:number) {
  debugger;
  //console.log(BeamStructureObj);
  return this.httpClient.post<any>(this.apiUrl +`Detailing/InsertBeamStructureMarking/${gap1}/${gap2}/${topCover}/${bottomCover}/${leftCover}/${rightCover}/${hook}/${leg}/${seDetailingID}`, BeamStructureObj);
 
}

UpdateBeamStructureMarking(BeamStructureObj: BeamStructure, gap1:number,  gap2:number,  topCover :number,  bottomCover:number,  leftCover:number,  rightCover:number,  hook:number,  leg:number,  seDetailingID:number) {
  debugger;
  //console.log(BeamStructureObj);
  return this.httpClient.post<any>(this.apiUrl +`Detailing/UpdateBeamStructureMarking/${gap1}/${gap2}/${topCover}/${bottomCover}/${leftCover}/${rightCover}/${hook}/${leg}/${seDetailingID}`, BeamStructureObj);
 
}

DeleteBeamStructureMarking(StructureMarkId: number) {
  return this.httpClient.delete<any>(this.apiUrl +`Detailing/DeleteBeamStructureMarking/${StructureMarkId}`);
}
UpdateGroupMarking(SeDetailId:any,ParamSetNumber :any) : Observable<any> { 
  return this.httpClient.get<any>(this.apiUrl +`Detailing/UpdateBeamGroupMarking/${SeDetailId}/${ParamSetNumber}`);
 
}
RegenerateValidation(BeamStructureObj: BeamStructure[],gap1:number,  gap2:number,  topCover :number,  bottomCover:number,  leftCover:number,  rightCover:number,  hook:number,  leg:number,  seDetailingID:number,structureElementId:number) {
  debugger;
  //console.log(BeamStructureObj);
  return this.httpClient.post<any>(this.apiUrl +`Detailing/RegenerateBeamValidation/${gap1}/${gap2}/${topCover}/${bottomCover}/${leftCover}/${rightCover}/${hook}/${leg}/${seDetailingID}/${structureElementId}`, BeamStructureObj); 
}
updateStructureMarking_Beam(structuremarking:any,StructureMarkId:any,qty:any)
{
  return this.httpClient.get<any[]>(
    this.apiUrl + `Detailing/updateStructureMarking_beam/${structuremarking}/${StructureMarkId}/${qty}`
  );
 
  // return this.httpClient.get<any[]>(`https://localhost:5002/updateStructureMarking_beam/${structuremarking}/${StructureMarkId}/${qty}` );
}

}