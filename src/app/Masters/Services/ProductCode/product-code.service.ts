import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ADD_CAB_PRODUCTCODE } from 'src/app/Model/add_cab_productcode';
import { ADD_CAR_PRODUCTCODE } from 'src/app/Model/add_car_productcode';
import { ADD_ACS_PRODUCTCODE } from 'src/app/Model/add_acs_productcode';
import { ADD_MESH_PRODUCTCODE } from 'src/app/Model/add_mesh_productcode';
import { RowMaterial_Add_ProductCode } from 'src/app/Model/add_RowMaterial_ProductCode';



@Injectable({
  providedIn: 'root'
})
export class ProductCodeService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }
  GetCAB_GradeType_List(): Observable<any> {

    // return this.httpClient.get<any[]>('https://localhost:5007/GetGradeTypeDropdown_Cab');
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetGradeTypeDropdown_Cab`);
  }

  GetFGSA_List(): Observable<any> {

    // return this.httpClient.get<any[]>('https://localhost:5007/GetFGSA_MaterialDropdown_Cab');
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetFGSA_MaterialDropdown_Cab`);

  }

  //Core Cage SAP material dropdown
  GetCoreCageSAP_Material(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetSAPMaterialDropdown_Corecage`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetSAPMaterialDropdown_Corecage`);

  }
  GetProductCode_List(): Observable<any> {
    // return this.httpClient.get<any[]>('https://localhost:5007/GetProductCodeList');
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetProductCodeList`);

  }
  GetCabProductCode_List(): Observable<any> {
    // return this.httpClient.get<any[]>('https://localhost:5007/GetCABProductCodeList');
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetCABProductCodeList`);

  }
  GetCABProductCodebyId(CabProdId: any) {
    // return this.httpClient.get<any>(`https://localhost:5007/GetCABProductCodebyIdAsync//${CabProdId}`);

    return this.httpClient.get<any>(this.apiUrl + `ProductCodeService/GetCABProductCodebyIdAsync/${CabProdId}`);
  }
  GetCoreCageProductCode_List(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetCORECAGEProductCodeList`);

    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetCORECAGEProductCodeList`);
  }
  GetCoreCageProductCodebyId(CARProdId: any) {
    // return this.httpClient.get<any>(`https://localhost:5007/GetCARProductCodebyIdAsync/${CARProdId}`);

    return this.httpClient.get<any>(this.apiUrl + `ProductCodeService/GetCARProductCodebyIdAsync/${CARProdId}`);
  }
  DeleteCabProductCodeList(id: number) {
    // return this.httpClient.delete<any>(`https://localhost:5007/deleteCABProductCode/${id}`);

    return this.httpClient.delete<any>(this.apiUrl + `ProductCodeService/deleteCABProductCode/${id}`);

  }
  SaveCABProductCode(CABProductDto: ADD_CAB_PRODUCTCODE) {
    console.log(CABProductDto);
    // return this.httpClient.post<any>(`https://localhost:5007/AddCABProductCode`, CABProductDto);

    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/AddCABProductCode`, CABProductDto);

  }
  SaveCARProductCode(CARProductDto: ADD_CAR_PRODUCTCODE) {
    console.log(CARProductDto);
    // return this.httpClient.post<any>(`https://localhost:5007/AddCARProductCode`, CARProductDto);

    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/AddCARProductCode`, CARProductDto);

  }
  UpdateCABProductCode(CABProductDto: ADD_CAB_PRODUCTCODE) {
    console.log("Update sa", CABProductDto);
    // return this.httpClient.post<any>(`https://localhost:5007/UpdateCABProduct`, CABProductDto);

    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/UpdateCABProduct`, CABProductDto);
  }

  UpdateCARProductCode(CARProductDto: ADD_CAR_PRODUCTCODE) {
    console.log("Update sa", CARProductDto);
    // return this.httpClient.post<any>(`https://localhost:5007/UpdateCARProduct`, CARProductDto);
    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/UpdateCARProduct`, CARProductDto);
  }

  DeleteCarProductCodeList(id: number) {
    // return this.httpClient.delete<any>(`https://localhost:5007/deleteCOREProductCode/${id}`);
    return this.httpClient.delete<any>(this.apiUrl + `ProductCodeService/deleteCOREProductCode/${id}`);

  }

  GetProductType_List(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetProductType_Dropdown`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetProductType_Dropdown`);
  }

  ///Start-Accessories Service 

  SaveACSProductCode(ACSProductDto: ADD_ACS_PRODUCTCODE) {
    // return this.httpClient.post<any>(`https://localhost:5007/AddACSProductCode`, ACSProductDto);
    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/AddACSProductCode`, ACSProductDto);

  }
  UpdateACSProduct(ACSProductDto: ADD_ACS_PRODUCTCODE) {
    // return this.httpClient.post<any>(`https://localhost:5007/UpdateACSProduct`, ACSProductDto);
    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/UpdateACSProduct`, ACSProductDto);

  }
  GetACS_GradeType_List(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetGradeTypeDropdown_Acs`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetGradeTypeDropdown_Acs`);
  }
  GetACSFGSA_RMSA__List(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetFGSA_MaterialDropdown_Acs`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetFGSA_MaterialDropdown_Acs`);

  }
  DeleteAcsProductCodeList(id: number) {
    // return this.httpClient.delete<any>(`https://localhost:5007/deleteACSProductCode/${id}`);
    return this.httpClient.delete<any>(this.apiUrl + `ProductCodeService/deleteACSProductCode/${id}`);

  }
  GetAcsProductCode_List(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetACSProductCodeList`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetACSProductCodeList`);

  }

  GetACSProductCodebyIdAsync(acsproductId: any) {
    return this.httpClient.get<any>(this.apiUrl + `ProductCodeService/GetACSProductCodebyIdAsync/${acsproductId}`);
    //return this.httpClient.get<any>(this.apiUrl + `https://localhost:5007/GetACSProductCodebyIdAsync/${acsproductId}`);
  }
  //

  /// End-Accessories  Service

  //Start-Row Material

  GetMaterialType_Raw_Mat() {
    return this.httpClient.get<any>(this.apiUrl + `ProductCodeService/GetMaterialType_Raw_Mat`);
  }
  GetGrade_Raw_Mat() {
    return this.httpClient.get<any>(this.apiUrl + `ProductCodeService/GetGrade_Raw_Mat`);
  }
  SaveRowMaterialProductCode(RowMaterialProductCode: RowMaterial_Add_ProductCode) {
    // return this.httpClient.post<any>(`https://localhost:5007/AddRawMaterial`, RowMaterialProductCode);
    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/AddRawMaterial`, RowMaterialProductCode);
  }
  GetRawMaterialList(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetRawMaterialList`);
  }
  GetRowMaterialProductCodebyId(rowProdId: any) {
    return this.httpClient.get<any>(this.apiUrl + `ProductCodeService/GetRawMaterialListById/${rowProdId}`);
  }
  UpdateRowMaterialProductCode(RowMaterialProductCode: RowMaterial_Add_ProductCode) {
    console.log(RowMaterialProductCode);
    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/UpdateRawMaterial`, RowMaterialProductCode);

  }
  DeleteRowMaterialProductCodeList(id: number) {
   // return this.httpClient.delete<any>(`https://localhost:5007/deleteACSProductCode/${id}`);
     return this.httpClient.delete<any>(this.apiUrl + `ProductCodeService/deleteRawMaterialProduct/${id}`);

  }
  //AddRawMaterial
  //
  //End-Row Material

  GetMeshData(SAPMaterialId: any) {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetMeshData/${SAPMaterialId}`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetMeshData/${SAPMaterialId}`);
  }
  GetMWMaterialData(MWMaterialID: any) {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetMWData/${MWMaterialID}`);
     return this.httpClient.get<any[]>(this.apiUrl +`ProductCodeService/GetMWData/${MWMaterialID}`);
  }
  GetCWMaterialData(CWMaterialID: any) {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetCWData/${CWMaterialID}`);
     return this.httpClient.get<any[]>(this.apiUrl +`ProductCodeService/GetCWData/${CWMaterialID}`);
  }
  GetMeshProductCodebyId(meshProdId: any) {
    // return this.httpClient.get<any>(`https://localhost:5007/GetMeshById/${meshProdId}`)
    return this.httpClient.get<any>(this.apiUrl + `ProductCodeService/GetMeshById/${meshProdId}`);
  }
  GetSAPMaterialDropdown_Mesh(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetSAPMaterialDropdown_Mesh`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetSAPMaterialDropdown_Mesh`);
  }
  // GetSAPMaterialDropdown_Raw(): Observable<any> {
  //   // return this.httpClient.get<any[]>(`https://localhost:5007/GetSAPMaterialDropdown_Raw`);
  //   return this.httpClient.get<any[]>(this.apiUrl +`ProductCodeService/GetSAPMaterialDropdown_Raw`) ;
  // }

  GetSAPMaterialDropdown_Raw(): Observable<any> {
   // return this.httpClient.get<any[]>(`https://localhost:5007/GetSAPMaterialDropdown_Raw`);
     return this.httpClient.get<any[]>(this.apiUrl +`ProductCodeService/GetSAPMaterialDropdown_Raw`) ;

  }
  GetStructureElement_Dropdown_Mesh(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetStructureElement_Dropdown_Mesh`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetStructureElement_Dropdown_Mesh`);
  }
  GetTwinIndicator_Dropdown_Mesh(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetTwinIndicator_Dropdown_Mesh`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetTwinIndicator_Dropdown_Mesh`);
  }
  GetWireProductList_Mesh(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetProductCodeList`);
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetMeshWireProductList`);
  }

  SaveMESHProductCode(MESHProductDto: ADD_MESH_PRODUCTCODE) {
    console.log(MESHProductDto);
    // return this.httpClient.post<any>(`https://localhost:5007/AddMeshProductCode`, MESHProductDto);
    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/AddMeshProductCode`, MESHProductDto);
  }
  UpdateMeshProductCode(MESHProductDto: ADD_MESH_PRODUCTCODE) {
    // console.log("Update sa",MESHProductDto);
    // return this.httpClient.post<any>(`https://localhost:5007/UpdateMeshProductCode`, MESHProductDto);

    return this.httpClient.post<any>(this.apiUrl + `ProductCodeService/UpdateMeshProductCode`, MESHProductDto);
  }
  DeleteMESHProductCodeList(id: number) {
    // return this.httpClient.delete<any>(`https://localhost:5007/deleteMESHProductCode/${id}`);
    return this.httpClient.delete<any>(this.apiUrl + `ProductCodeService/deleteMESHProductCode/${id}`);
  }

  GetMeshProductCode_List(): Observable<any> {
    // return this.httpClient.get<any[]>('https://localhost:5007/GetMeshGridList');
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetMeshGridList`);
  }

  //  Start-Commmon Product Code 
  GetCommonProductCodeList(producttypes: any): Observable<any> {
    debugger;
    console.log(producttypes)
    if (producttypes == '') {
      producttypes = 'null';

    }
    return this.httpClient.get<any[]>(this.apiUrl + `ProductCodeService/GetCommonProductCodeListAsync/${producttypes}`);
  }

  DeleteCommonProductCode(ProductCodeID: number, ProductTypeId: number) {

    return this.httpClient.delete<any>(this.apiUrl + `ProductCodeService/DeleteCommonProductAsync/${ProductCodeID}/${ProductTypeId}`);

  }

  GetStructureElement_Dropdown_Mesh_Get(): Observable<any> {
    // return this.httpClient.get<any[]>(`https://localhost:5007/GetStructureElement_Dropdown_Mesh_Get`);
    return this.httpClient.get<any[]>(this.apiUrl +`ProductCodeService/GetStructureElement_Dropdown_Mesh_Get`) ;
  }

  //  End-Common Product Code




}
