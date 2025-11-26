import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductionRoutesService {

 //SharepointService:string="https://odos.natsteel.com.sg:8999/api/SharePointAPI"
  SharepointService:string="https://devodos.natsteel.com.sg:8999/api/SharePointAPI"//For Dev
  //SharepointService:string="http://localhost:55592/api/SharePointAPI"
  constructor() { }
}
