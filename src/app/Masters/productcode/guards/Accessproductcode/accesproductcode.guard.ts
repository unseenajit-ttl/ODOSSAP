import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {ProductCodeService} from '../../../Services/ProductCode/product-code.service'

@Injectable({
  providedIn: 'root'
})
export class AccesproductcodeGuard   {
  constructor(private productcodeservice:ProductCodeService)
  {}
  resolve()
  {
    return this.productcodeservice.GetAcsProductCode_List();
  }
  
}
