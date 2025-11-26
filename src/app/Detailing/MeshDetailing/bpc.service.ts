import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeamStructure } from 'src/app/Model/add_BeamStructure';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BPCService {

  public Parameter_SetService = new EventEmitter<any>();


  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {
    //console.log(this.apiUrl);
   }; 

   GetBorePilePopulateMethods(strType:any,intProductL2Id:any,strMainBarCode :any): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetBorePilePopulateMethods/${strType}/${intProductL2Id}/${strMainBarCode}`);
  //  return this.httpClient.get<any[]>(`https://localhost:5012/GetBorePilePopulateMethods/${strType}/${intProductL2Id}/${strMainBarCode}`);

  }

  PopulateCageNotes(): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/PopulateCageNotes`);
  //  return this.httpClient.get<any[]>(`https://localhost:5012/PopulateCageNotes`);
  }


  PopulateStructGrid(GroupMarkingName:any, intProjectId :any,SELevelDetailsID:any){
    return this.httpClient.get<any[]>(this.apiUrl +`DrainService/PopulateStructGrid/${GroupMarkingName}/${intProjectId }/${SELevelDetailsID}`);
    // return this.httpClient.get<any[]>(`https://localhost:5012/PopulateStructGrid/${GroupMarkingName}/${intProjectId }/${SELevelDetailsID}`);

  }
  // GetCABDetails/{SEDetailingId}/{intStructureMarkId}
  GetCABDetails(SELevelDetailsID:any,intStructureMarkId :any){
    return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetCABDetails/${SELevelDetailsID}/${intStructureMarkId }`);
    // return this.httpClient.get<any[]>(`https://localhost:5012/GetCABDetails/${SELevelDetailsID}/${intStructureMarkId }`);

  }

InsertBPCStructureMarkingDetails(item:any) {
         
    // return this.httpClient.post<any>(`https://localhost:5012/InsertBPCStructureMarkingDetails`,item)
    return this.httpClient.post<any>(this.apiUrl + `DrainService/InsertBPCStructureMarkingDetails`,item)
  }

getBPCMaterialCodeIDForStrucMarking(vchMainBarPattern:any,vchElevationPattern:any,numSmallerMainBarLength:any,numPileDia:any,bitCoat:any,sitProductTypeL2Id:any): Observable<any> {
// return this.httpClient.get<any[]>(`https://localhost:5012/getBPCMaterialCodeIDForStrucMarking/${vchMainBarPattern}/${vchElevationPattern}/${numSmallerMainBarLength}/${numPileDia}/${bitCoat}/${sitProductTypeL2Id}`);
return this.httpClient.get<any[]>(this.apiUrl + `DrainService/getBPCMaterialCodeIDForStrucMarking/${vchMainBarPattern}/${vchElevationPattern}/${numSmallerMainBarLength}/${numPileDia}/${bitCoat}/${sitProductTypeL2Id}`);


}


UpdateBPCStructureMarkingDetails(item:any) {
 
// return this.httpClient.post<any>(`https://localhost:5012/UpdateBPCStructureMarkingDetails`,item)
return this.httpClient.post<any>(this.apiUrl + `DrainService/UpdateBPCStructureMarkingDetails`,item)
}


getCoverCodeForStrucMarking(intCoverLink:any): Observable<any> {
  // return this.httpClient.get<any>(`https://localhost:5012/getCoverCodeForStrucMarking/${intCoverLink}`);
  return this.httpClient.get<any>(this.apiUrl + `DrainService/getCoverCodeForStrucMarking/${intCoverLink}`);
  // getCoverCodeForStrucMarking/{intCoverLink}
  
  }

  Delete_StructureMarking(StructureMarkId: any,CageSeqNo: any,GroupMarkId: any) {
    debugger;
    return this.httpClient.delete<any>(this.apiUrl + `DrainService/DeleteBPCStructureMarking/${StructureMarkId}/${CageSeqNo}/${GroupMarkId}`
    );
    // return this.httpClient.delete<any>(`https://localhost:5012/DeleteBPCStructureMarking/${StructureMarkId}/${CageSeqNo}/${GroupMarkId}`);
  }
  GetSchnellTemplates(): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetSchnellTemplates`);
  //  return this.httpClient.get<any[]>(`https://localhost:5012/GetSchnellTemplates`);
  }

getScnellTableData(length:any,tempCode:any): Observable<any> {    
   return this.httpClient.get<any[]>(this.apiUrl +`DrainService/GetSchnellConfiguration/${length}/${tempCode}`);
  //  return this.httpClient.get<any[]>(`https://localhost:5012/GetSchnellConfiguration/${length}/${tempCode}`);

 
  }
  // DeleteBPCStructureMarking/{StructureMarkId}/{CageSeqNo}/{GroupMarkId}

}
