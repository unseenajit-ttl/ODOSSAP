import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ShapeMasterService } from './Services/shape-master.service'

@Injectable({
  providedIn: 'root'
})
export class ResolveGuard {
  constructor(private apiService: ShapeMasterService) {
  }
  resolve() {
    return this.apiService.GetShapeGroupList();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
