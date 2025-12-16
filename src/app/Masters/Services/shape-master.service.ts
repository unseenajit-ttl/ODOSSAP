import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddMeshShapeParam } from 'src/app/Model/add-mesh-shape-param';
import { Shapegroup } from 'src/app/Model/shapegroup';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';
import { attribute } from '../shapemaster/AddValidation/addValidation.component';
import { AddFormula } from '../shapemaster/AddFormula/addFormula.component';
import { AddNewShape, createpath } from '../shapemaster/createshapemaster/createshapemaster.component';
import { UpdateShape } from '../shapemaster/shapemaster.component';
@Injectable({

  providedIn: 'root'

})

export class ShapeMasterService {

  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient,private loginService: LoginService) { }

  GetShapeGroupList(): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(this.apiUrl +`ShapeService/GetShapegroupList`)
    //  return this.httpClient.get<any[]>(`https://localhost:5004/GetShapegroupList`);

  }

  SaveShapeGroup(shapegroupobj: Shapegroup) {
    return this.httpClient.post<any>(this.apiUrl + `ShapeService/AddShapegroup`, shapegroupobj)
    //return this.httpClient.post<any>(`https://localhost:5004/AddShapegroup`, shapegroupobj);

  }

  DeleteShapeGroup(id: number) {
    return this.httpClient.delete<any>(this.apiUrl + `ShapeService/deleteShapegroup/${id}`);
    //return this.httpClient.delete<any>(`https://localhost:5004/deleteShapegroup/${id}`);

  }


//Shape code Master : BY Vidhya 

GetShapeCodeList(): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/PopulateShapeCode`)
    //return this.httpClient.get<any[]>(`https://localhost:5004/PopulateShapeCode`);

}
PreviewAllImage_MSH(): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/PreviewAllImage_MSH`)
    //return this.httpClient.get<any[]>(`https://localhost:5004/PreviewAllImage_MSH`);

}
GetShapeCodeDetails(shapeid:number): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetShapeCodeDetails/${shapeid}`)
  //return this.httpClient.get<any[]>(`https://localhost:5004/GetShapeCodeDetails/${shapeid}`);

}

GetStatusDetails(): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetStatusDetails`)
   //return this.httpClient.get<any[]>(`https://localhost:5004/GetStatusDetails`);

}
GetShapeParamDetails(shapeid:number): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/PopulateShapeParamDetails/${shapeid}`)
    //return this.httpClient.get<any[]>(`https://localhost:5004/PopulateShapeParamDetails/${shapeid}`);

}

InsUpdShapeParamDetails(object: AddMeshShapeParam) {
  
  let UserID = this.loginService.GetUserId();
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/InsUpdShapeParamDetails/${UserID}`, object);
  //return this.httpClient.post<any>(`https://localhost:5004/InsUpdShapeParamDetails/${UserID}`, object);
  
}


DeleteShapeParamDetails(ShapeDetailsId:number): Observable<any> {
  debugger;
  return this.httpClient.delete<any[]>(this.apiUrl + `ShapeService/DeleteShapeParamDetails/${ShapeDetailsId}`)
   // return this.httpClient.delete<any[]>(`https://localhost:5004/DeleteShapeParamDetails/${ShapeDetailsId}`);

}

GetAttributes(shapeid:number): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetAttributes/${shapeid}`)
  //  return this.httpClient.get<any[]>(`https://localhost:5004/GetAttributes/${shapeid}`);

}

GetValidationConstraintList(shapeid:number): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetValidationConstraintList/${shapeid}`)
  //  return this.httpClient.get<any[]>(`https://localhost:5004/GetValidationConstraintList/${shapeid}`);

}

InsertIpOpValidationConstraints(object: attribute) {
  
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/InsertIpOpValidationConstraints`, object);
  //return this.httpClient.post<any>(`https://localhost:5004/InsertIpOpValidationConstraints`, object);
  
}

UpdateIpOpValidationConstraints(object: attribute) {
  
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/UpdateIpOpValidationConstraints`, object);
  //return this.httpClient.post<any>(`https://localhost:5004/UpdateIpOpValidationConstraints`, object);
  
}

DeleteIpOpValidationConstraints(Id:number): Observable<any> {
  debugger;
  return this.httpClient.delete<any[]>(this.apiUrl + `ShapeService/DeleteIpOpValidationConstraints/${Id}`)
  //return this.httpClient.delete<any[]>(`https://localhost:5004/DeleteIpOpValidationConstraints/${Id}`);

}

GetFormulaList(shapeid:number): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetFormulaList/${shapeid}`)
  //  return this.httpClient.get<any[]>(`https://localhost:5004/GetFormulaList/${shapeid}`);

}

InsertProductMArkingFormula(object: AddFormula) {
  
  let UserID = this.loginService.GetUserId();
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/InsertProductMArkingFormula`, object);
  //return this.httpClient.post<any>(`https://localhost:5004/InsertProductMArkingFormula`, object);
  
}

UpdateProductMArkingFormula(object: AddFormula) {
  
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/UpdateProductMArkingFormula`, object);
  //return this.httpClient.post<any>(`https://localhost:5004/UpdateProductMArkingFormula`, object);
  
}

GetLibraryId(structele:any,FormulaName:any): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetLibraryId/${structele}/${FormulaName}`)
  //  return this.httpClient.get<any[]>(`https://localhost:5004/GetLibraryId/${structele}/${FormulaName}`);

}

GetProductMArkingFormulasById(structele:any): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/GetProductMArkingFormulasById/${structele}`)
  //  return this.httpClient.get<any[]>(`https://localhost:5004/GetProductMArkingFormulasById/${structele}`);

}
CheckShapeExists(ShapeCode:string): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/CheckShapeExists/${ShapeCode}`)
  //  return this.httpClient.get<any[]>(`https://localhost:5004/CheckShapeExists/${ShapeCode}`);

}

CheckMeshShapeGroupExists(meshShapeGroup:string): Observable<any> {
  debugger;
  return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/CheckMeshShapeGroupExists/${meshShapeGroup}`)
  //  return this.httpClient.get<any[]>(`https://localhost:5004/CheckMeshShapeGroupExists/${meshShapeGroup}`);

}

CheckandCreateDirectory(obj:createpath) {
  
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/CheckandCreateDirectory`,obj);
  //return this.httpClient.post<any>(`https://localhost:5004/CheckandCreateDirectory`,obj);
  
}

movefiletoBackup(obj:createpath) {
  
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/CheckfileExist`,obj);
  //return this.httpClient.post<any>(`https://localhost:5004/CheckfileExist`,obj);
  
}
 
InsUpdShapeHeaderDetails(object:AddNewShape) {
  
  let UserID = this.loginService.GetUserId();
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/InsUpdShapeHeaderDetails/${UserID}`, object);
  //return this.httpClient.post<any>(`https://localhost:5004/InsUpdShapeHeaderDetails/${UserID}`, object);
  
}


UpdateShapeHeaderDetails(object:UpdateShape) {
  
  let UserID = this.loginService.GetUserId();
  return this.httpClient.post<any>(this.apiUrl + `ShapeService/UpdateShapeHeaderDetails/${UserID}`, object);
  //return this.httpClient.post<any>(`https://localhost:5004/UpdateShapeHeaderDetails/${UserID}`, object);
  
}
ShapeCodeFormulaDelete(id: number): Observable<any> {
  return this.httpClient.delete<any>( `${this.apiUrl}ShapeService/ShapeCodeFormulaDelete/${id}`,

  );
}

}
