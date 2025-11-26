import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from './oauth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) { }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot):
  //   Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return this.authService.getCurrentUser().pipe(
  //     map(user => !!user),
  //     tap(isLogged => {
  //       if (!isLogged) {
  //         this.router.navigateByUrl('/login');
  //       }
  //     })
  //   );
  // }

  canActivate(): boolean {
    console.log('HERE IN AUTH GUARD');

    // For Ordering
    let targetURL = this.authService.targetURL;
    let lCurrentPath = this.location.path();

    // Temporary solution to prevent AuthGuard block when open these Forms in new tab.
    if (lCurrentPath.includes('createorder/')||(lCurrentPath.includes('amendment'))) {
      return true;
    }
    if (lCurrentPath.includes('/DetailingGroupMark/BOM')) {
      return true;
    }

    if(lCurrentPath.includes('allshapes')){
      return true;
    }
    if (targetURL) {
      // str.toLowerCase().includes(substr)
      if (targetURL.toLowerCase().includes('order')) {
        //alert('Open Ordering');
        if (this.authService.isAuthenticatedrdering()) {
          return true;
        } else {
          //alert('Access Denied');

          this.router.navigate(['./']);
          return false;
        }
      }
    } else {
      if (lCurrentPath.toLowerCase().includes('order')) {
        //alert('Open Ordering');
        if (this.authService.isAuthenticatedrdering()) {
          return true;
        } else {
          //alert('Access Denied');

          this.router.navigate(['./']);
          return false;
        }
      }
    }

    // For Detailing
    if (this.authService.isAuthenticated()) {
      //alert('Access Granted');
      return true;
    } else {
      //alert('Access Denied');

      this.router.navigate(['./']);
      return false;
    }
  }
}
