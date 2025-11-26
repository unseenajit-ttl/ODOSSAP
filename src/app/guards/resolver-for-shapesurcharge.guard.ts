import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Resolve } from '@angular/router';
import { ShapeSurchargeService } from 'src/app/Masters/Services/shape-surcharge.service';
import {} from 'src/app/Masters/Services/shape-surcharge.service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResolverForShapesurchargeGuard {
  
  constructor(private shapesurchargeservice:ShapeSurchargeService)
  {}


  resolve()
  {
    return this.shapesurchargeservice.GetShapeSurchageList();
  }
}
