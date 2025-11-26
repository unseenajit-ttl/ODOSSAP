import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADD_SLAB_STRUCTURE_MARKING } from 'src/app/Model/add_slabStructureMarking';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarpetService {

  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {

    console.log(this.apiUrl);
   };
   PopulateProductCode_carpet(): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl + `Detailing/PopulateProductCode_carpet`);
    // return this.httpClient.get<any[]>(`https://localhost:5002/PopulateProductCode_carpet}`);
  }

  PopulateShapeCode_carpet(): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>(this.apiUrl + `Detailing/PopulateShapeCode_carpet`);
    // return this.httpClient.get<any[]>(`https://localhost:5002/PopulateShapeCode_carpet}`);
  }
  

  Get_Carpetproductcode_dropdown(enterd_text: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/FilterProductCode_carpet/${enterd_text}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5002/FilterProductCode_carpet/${enterd_text}`);
  }
  FilterShapeCode_carpet(enterd_text: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/FilterShapeCode_carpet/${enterd_text}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5002/FilterShapeCode_carpet/${enterd_text}`);
  }
  CarpetParameterSetbyProjIdProdType(ProjectId:number,ProducttypeId:number): Observable<any> {    
    debugger;
   return this.httpClient.get<any[]>( this.apiUrl +
        `Detailing/CarpetParameterSetbyProjIdProdType/${ProjectId}/${ProducttypeId}`);
    // return this.httpClient.get<any[]>(this.apiUrl +`Detailing/CarpetParameterSetbyProjIdProdType/${ProjectId}/${ProducttypeId}`);
  }
  SaveSlab_StructureMarking(
    slab_obj: ADD_SLAB_STRUCTURE_MARKING,
    structureElementId: any,
    projectTypeId: any,
    projectId: any,
    productTypeId: any,
    userId: any
  ) {
    debugger;
    console.log(slab_obj);
    return this.httpClient.post<any>(
      this.apiUrl +
        `Detailing/InsertCarpetStructureMarking/${structureElementId}/${projectTypeId}/${projectId}/${productTypeId}/${userId}`,
      slab_obj
    );
    // return this.httpClient.post<any>(
    //   `https://localhost:5002/InsertCarpetStructureMarking/${structureElementId}/${projectTypeId}/${projectId}/${productTypeId}/${userId}`,
    //   slab_obj
    // );
  }

  GetCarpetStructureMarkingDetails(
    DetailingID: any,
    StructureElementId: any
  ): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetStructureMarkingDetails_carpet/${DetailingID}/${StructureElementId}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5002/GetStructureMarkingDetails_carpet/${DetailingID}/${StructureElementId}`);
  }

  Delete_StructureMarking(id: any) {
    debugger;
      return this.httpClient.delete<any>(
        this.apiUrl + `Detailing/DeleteStructureMarking_carpet/${id}`
      );
    // return this.httpClient.delete<any>(`https://localhost:5002/DeleteStructureMarking_carpet/${id}`);
  }

  Delete_SlabProductMarking(ProductMarkId: any, seDetailingId: any) {
    debugger;
    return this.httpClient.delete<any>(
      this.apiUrl +
        `Detailing/DeleteProductMarking_carpet/${ProductMarkId}/${seDetailingId}`
    );

    // return this.httpClient.delete<any>(`https://localhost:5002/DeleteProductMarking_carpet/${ProductMarkId}/${seDetailingId}`);

  }

  Copy_ProductMarking(carpetprod: any, structureElementId: number) {
    debugger;
    carpetprod.CWPitch = "";
    carpetprod.MWPitch = "";
    carpetprod.BOMDrawingPath = "";  
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/InsertCarpetProductMarking/${structureElementId}`,
      carpetprod
    );
  
    // return this.httpClient.post<any>(`https://localhost:5002/InsertCarpetProductMarking/${structureElementId}`, carpetprod);
  }

  Update_StructureMarking(structandProd: any, detailingid: number) {
    debugger;
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/UpdateCarpetProductMarking/${detailingid}`,
      structandProd
    );
    // return this.httpClient.post<any>(`https://localhost:5002/UpdateCarpetProductMarking/${detailingid}`, structandProd);
  }
  
}
