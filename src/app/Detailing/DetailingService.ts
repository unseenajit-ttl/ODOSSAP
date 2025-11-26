import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ADD_CABModel } from '../Model/Add_CABModel';
import { ADD_NewGroupMarkModel } from '../Model/Add_NewGroupMarkModel';
import { ADD_SLAB_STRUCTURE_MARKING } from '../Model/add_slabStructureMarking';
import { ReleaseGroupMarkDto } from '../Model/ReleaseGroupMark';
import { UpdateProdBOM } from '../Model/UpdateProdBOM';
import { SaveBarDetailsModel } from '../Model/saveBarDetailsModel';

@Injectable({
  providedIn: 'root',
})
export class DetailingService {
  apiUrl = environment.apiUrl;
  constructor(public httpClient: HttpClient) {
    //console.log(this.apiUrl);
  }

  public Parameter_SetService = new EventEmitter<any>();

  GetGroupMarkingList(Projectid: any): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/GetMeshDetailingList/${Projectid}`
    );
    // return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetMeshDetailingList/${Projectid}`);
  }
  GetSlabStructureMarkingDetails(
    DetailingID: any,
    StructureElementId: any
  ): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetStructureMarkingDetails/${DetailingID}/${StructureElementId}`
    );
    // return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetStructureMarkingDetails/${DetailingID}/${StructureElementId}`);
  }
  UpdateGroupMarking(SeDetailId: any, ParamSetNumber: any): Observable<any> {
    // return this.httpClient.get<any>(this.apiUrl +`Detailing/UpdateGroupMarking/${SeDetailId}/${ParamSetNumber}`);
    return this.httpClient.get<any>(
      this.apiUrl +
        `Detailing/UpdateGroupMarking/${SeDetailId}/${ParamSetNumber}`
    );
  }

  Get_slabproductcode_dropdown(enterd_text: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/FilterProductCode/${enterd_text}`
    );
    // return this.httpClient.get<any[]>(this.apiUrl +`Detailing/FilterProductCode/${enterd_text}`);
  }
  Get_ACSProductCode_dropDown(enterd_text: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/ACSFilterProductCode/${enterd_text}`
    );
  }

  Get_ParameterSet_dropdown(ProjectId: any, ProductypeId: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetSlabParameterSetbyProjIdProdType/${ProjectId}/${ProductypeId}`
    );
    // return this.httpClient.get<any[]>(this.apiUrl +`Detailing/GetSlabParameterSetbyProjIdProdType/${ProjectId}/${ProductypeId}`);
  }

  Get_SlabShapecode_dropdown() {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/PopulateSlabShapeCode`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5002/PopulateSlabShapeCode`);
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
        `Detailing/InsertSlabStructureMarking/${structureElementId}/${projectTypeId}/${projectId}/${productTypeId}/${userId}`,
      slab_obj
    );
  }
  Update_StructureMarking(structandProd: any, detailingid: number) {
    debugger;
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/UpdateProductMark/${detailingid}`,
      structandProd
    );
    // return this.httpClient.post<any>(`https://localhost:5002/UpdateProductMark/${detailingid}`, structandProd);
  }
  Copy_ProductMarking(slabprod: any, structureElementId: number) {
    debugger;
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/CopySlabproductmark/${structureElementId}`,
      slabprod
    );
    // return this.httpClient.post<any>(`https://localhost:5002/CopySlabproductmark/${structureElementId}`, slabprod);
  }
  GetSlabStructureMarkingDetailsColl(StructureMarkId: any): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetStructureMarkingDetailsCollap/${StructureMarkId}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5002/GetStructureMarkingDetailsCollap/${StructureMarkId}`);
  }
  RegenerateValidation(
    regenerate: any,
    structureElementId: any,
    projectTypeId: any,
    projectId: any,
    productTypeId: any,
    seDetailingID: any
  ) {
    debugger;
    // //console.log(slabStructureMarklist);
    return this.httpClient.post<any>(
      this.apiUrl +
        `Detailing/RegenerateValidationSlab/${structureElementId}/${projectTypeId}/${projectId}/${productTypeId}/${seDetailingID}`,
      regenerate
    );
    // return this.httpClient.post<any>(`https://localhost:5002/RegenerateValidationSlab/${structureElementId}/${projectTypeId}/${projectId}/${productTypeId}/${seDetailingID}`, regenerate);
  }
  Delete_StructureMarking(id: any) {
    debugger;
    return this.httpClient.delete<any>(
      this.apiUrl + `Detailing/DeleteStructureMarking/${id}`
    );
    // return this.httpClient.delete<any>(`https://localhost:5002/DeleteStructureMarking/${id}`);
  }
  // BOM Started
  Get_BomDetails(ProductMarkId: any, BomType: any, StructElement: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetBomDetails/${ProductMarkId}/${BomType}/${StructElement}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5002/GetBomDetails/${ProductMarkId}/${BomType}/${StructElement}`);
  }

  Delete_GroupMarking(id: any) {
    debugger;
    return this.httpClient.delete<any>(
      this.apiUrl + `Detailing/DeleteGroupMark/${id}`
    );
    // return this.httpClient.delete<any>(`https://localhost:5002/DeleteGroupMark/${id}`);
  }
  GetPostedGroupMark(intGroupMarkid: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/GetPostedGroupMark/${intGroupMarkid}`
    );
  }
  GetReleasedGroupMark(intGroupMarkid: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/GetReleasedGroupMark/${intGroupMarkid}`
    );
  }

  GetProductType(intProductType: any, intGroupMarkId: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetProductType/${intProductType}/${intGroupMarkId}`
    );
  }

  CopyGroupMarkDetailing(item: ReleaseGroupMarkDto) {
    //console.log(item)
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/UpdategroupMark`,
      item
    );
  }
  Delete_SlabProductMarking(ProductMarkId: any, seDetailingId: any) {
    debugger;
    return this.httpClient.delete<any>(
      this.apiUrl +
        `Detailing/DeleteSlabProductMarking/${ProductMarkId}/${seDetailingId}`
    );
  }

  ValidatedPostedGM(intGroupMarkid: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/ValidatedPostedGM/${intGroupMarkid}`
    );
  }

  Get_ShapeParamDetails(ShapeId: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/Get_ShapeParamDetails/${ShapeId}`
    );

    // return this.httpClient.get<any[]>(`https://localhost:5002/Get_ShapeParamDetails/${ShapeId}`);
  }

  Get_BOMHeader(ProductMarkId: any, BomType: any, StructElement: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetBOMHeader/${ProductMarkId}/${BomType}/${StructElement}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5002/GetBOMHeader/${ProductMarkId}/${BomType}/${StructElement}`);
  }

  SaveBOM(InsertBOM: any) {
    debugger;
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/InsertBOM`,
      InsertBOM
    );
    // return this.httpClient.post<any>(`https://localhost:5002/InsertBOM`, InsertBOM);
  }

  //Get Parameter Set by Structure Type
  GetSlabParameterSetbyProjIdProdType(ProjectId: any, ProductypeId: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/GetSlabParameterSetbyProjIdProdType/${ProjectId}/${ProductypeId}`
    );
  }
  ColumnParameterSetbyProjIdProdType(projectId: any, productTypeId: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/ColumnParameterSetbyProjIdProdType/${projectId}/${productTypeId}`
    );
  }
  BeamParameterSetbyProjIdProdType(projectId: any, productTypeId: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
        `Detailing/BeamParameterSetbyProjIdProdType/${projectId}/${productTypeId}`
    );
  }

  SaveGroupMark(NeGroupMarkObj: ADD_NewGroupMarkModel) {
    debugger;
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/SaveGroupMark`,
      NeGroupMarkObj
    );
  }
  Delete_Bom(id: any) {
    debugger;
    return this.httpClient.delete<any>(
      this.apiUrl + `Detailing/DeleteBOM/${id}`
    );
    // return this.httpClient.delete<any>(`https://localhost:5002/DeleteBOM/${id}`);
  }

  UpdateProdBOM(obj: UpdateProdBOM) {
    debugger;
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/UpdateProductBom`,
      obj
    );
    // return this.httpClient.post<any>(`https://localhost:5002/UpdateProductBom`, obj);
  }
  InsertCABRecords(CABObject: ADD_CABModel, SEDetailingID: any) {
    debugger;
    console.log(CABObject);
    console.log(SEDetailingID);
    return this.httpClient.post<any>(
      this.apiUrl + `Detailing/InsertProductMark/${SEDetailingID}`,
      CABObject
    );
  }

  CabShapeParameterByShapeCode(enteredText: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/FilterShapeCode_cab/${enteredText}`
    );
  }

  GetCABProductMarkingDetailsByID(SEDetailingID: any) {
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5002/GetCABProductMarkingDetailsByID/${SEDetailingID}`
    // );
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/GetCABProductMarkingDetailsByID/${SEDetailingID}`
    );
  }

  BendingGroup_Get(intShapeId: any) {
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5002/BendingGroup_Get/${intShapeId}`
    // );
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/BendingGroup_Get/${intShapeId}`
    );
  }
  UpdateCabProductMark(CABObject: any, SEDetailingID: any) {
    debugger;
    console.log(CABObject);
    console.log(SEDetailingID);
    // return this.httpClient.post<any>(
    //   `https://localhost:5002/InsertProductMark/${SEDetailingID}`,
    //   CABObject
    // );
    return this.httpClient.post<any>(
      `https://localhost:5002/UpdateCabProductMark/${SEDetailingID}`,
      CABObject
    );
  }

  DeleteCabProductmarking(
    SEDetailingID: any,
    CABProductMarkName: any,
    CABProductMarkID: any
    
    
  ) {
    debugger;
    return this.httpClient.delete<any>(this.apiUrl +`Detailing/DeleteCABProductMarkingDetailsByID/${SEDetailingID}/${CABProductMarkName}/${CABProductMarkID}`);

    // return this.httpClient.delete<any>(
    //   `https://localhost:5002/DeleteCABProductMarkingDetailsByID/${SEDetailingID}/${CABProductMarkName}/${CABProductMarkID}`
    // );
  }

  Insert_BarMark(
    obj: SaveBarDetailsModel,
    SEDetailingID: any,
    intGroupMarkID: any
  ) {
    // return this.httpClient.post<any[]>(
    //   this.apiUrl + `OrderService/saveBarDetails`,
    //   obj
    // );
    // return this.httpClient.post<any[]>(
    //   `https://localhost:5002/InsertBarMark/${SEDetailingID}/${intGroupMarkID}`,
    //   obj
    // );
    return this.httpClient.post<any[]>(
      this.apiUrl + `Detailing/InsertBarMark/${SEDetailingID}/${intGroupMarkID}`,obj
    );
  }

  GetDetailingForm(UserName: string) {
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5002/GetDetailingForm/${UserName}`
    // );
    return this.httpClient.get<any[]>(
      this.apiUrl + `Detailing/GetDetailingForm/${UserName}`
    );
  }

  updateStructureMarking(structuremarking:any,StructureMarkId:any)
  {
    return this.httpClient.get<any[]>(
      this.apiUrl + `DrainService/updateStructureMarking/${structuremarking}/${StructureMarkId}`
    );
  }
  UpdateSlab_StructureMarking(
    slab_obj: any,
    structureElementId: any,
    projectTypeId: any,
    projectId: any,
    productTypeId: any,
    userId: any,
    updateFlag:any
  ) {
    debugger;
    console.log(slab_obj);
    return this.httpClient.post<any>(
      this.apiUrl +
        `Detailing/UpdateSlabStructureMarking/${structureElementId}/${projectTypeId}/${projectId}/${productTypeId}/${userId}/${updateFlag}`,
      slab_obj
    );
        // return this.httpClient.post<any[]>(`https://localhost:5002/UpdateSlabStructureMarking/${structureElementId}/${projectTypeId}/${projectId}/${productTypeId}/${userId}/${updateFlag}`, slab_obj);

  }
  GroupMarkID_insert_Dwall(intGroupMarkID: any) {

      // return this.httpClient.get<any[]>(`https://localhost:5002/GroupMarkID_insert/${intGroupMarkID}`);
    
    return this.httpClient.get<any[]>(this.apiUrl + `Detailing/GroupMarkID_insert/${intGroupMarkID}`);
}
}

