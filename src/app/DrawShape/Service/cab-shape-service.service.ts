import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CabShapeServiceService {

  apiUrl = environment.apiUrl;
 private shapeCode = '';

  constructor(private httpClient: HttpClient) { }


  getShapeImage(shapeCode: string): Observable<any> {
    // return this.httpClient.get<any>(`https://localhost:5004/PreviewImage/${shapeCode}`);
    return this.httpClient.get<any>(this.apiUrl + `ShapeService/PreviewImage/${shapeCode}`);
  }

  getShapeCoordinates(shapeCode: string): Observable<any> {

    // return this.httpClient.get<any>(`https://localhost:5004/PreviewImage/${shapeCode}`);
    return this.httpClient.get<any>(this.apiUrl + `ShapeService/PreviewImage/${shapeCode}`);
  }

  PopulateShapes(): Observable<any> {
    // return this.httpClient.get<any[]>('https://localhost:5004/PopulateShapes/0');
     return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/PopulateShapes/0`);



   }

   GetShapeDetails(shapeCode: string): Observable<any> {

    // return this.httpClient.get<any>(`https://localhost:5004/GetShapeDetails/${shapeCode}`);
    return this.httpClient.get<any>(this.apiUrl + `ShapeService/GetShapeDetails/${shapeCode}`);
  }

  ImportImageToDB(imagefile: any,shapeCode: string): Observable<any> {

    // return this.httpClient.post<any>(`https://localhost:5004/ImportImageToDB/${shapeCode}`,imagefile);
    return this.httpClient.get<any>(this.apiUrl + `ShapeService/ImportImageToDB/${shapeCode}`,imagefile);
  }
  DeleteShapeCode(shapeCode: string): Observable<any> {

    // return this.httpClient.delete<any>(`https://localhost:5004/DeleteShapeCode/${shapeCode}`);
    return this.httpClient.delete<any>(this.apiUrl + `ShapeService/DeleteShapeCode/${shapeCode}`);
  }


  PreviewAllImage(): Observable<any> {
    // return this.httpClient.get<any[]>('https://localhost:5004/PreviewAllImage');
     return this.httpClient.get<any[]>(this.apiUrl + `ShapeService/PreviewAllImage`);



   }


   UpdateParameters(obj:any): Observable<any> {

    // return this.httpClient.post<any>(`https://localhost:5004/UpdateShapeParameters`,obj);
    return this.httpClient.get<any>(this.apiUrl + `ShapeService/UpdateShapeParameters`,obj);
  }
  GetShapeTableDetails(shapeCode: string): Observable<any> {

    // return this.httpClient.get<any>(`https://localhost:5004/ShapeCodeDetails_Grid/${shapeCode}`);
    return this.httpClient.get<any>(this.apiUrl + `ShapeService/ShapeCodeDetails_Grid/${shapeCode}`);
  }
  InsertShapeTableDetails(shapeDetailsTable:any[]): Observable<any> {

    // return this.httpClient.post<any>(`https://localhost:5004/InsertCabShapeDetails`,shapeDetailsTable);
    return this.httpClient.post<any>(this.apiUrl + `ShapeService/InsertCabShapeDetails`,shapeDetailsTable);
  }
  updateCabShapeStatus(shapeID:string,status:number)
  {
    return this.httpClient.get<any>(this.apiUrl +`ShapeService/CabShapeStatusChange/${shapeID}/${status}`)
    // return this.httpClient.get<any>(`https://localhost:5004/CabShapeStatusChange/${shapeID}/${status}`)

  }

getShapecode()
{
  return this.shapeCode;
}
setShapecode(shapecode:string)
{
  this.shapeCode = shapecode;
}

}
