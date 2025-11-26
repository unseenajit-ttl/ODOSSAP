import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { CMOAuthService } from '../core/oauth.service'
import { OAuthService } from 'angular-oauth2-oidc'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../core/config.service'
import { map, catchError } from 'rxjs/operators'
import { Permission } from '../permission'

@Injectable({
  providedIn: 'root',
})
export class AuthGaurdService implements CanActivate {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private authService: CMOAuthService,
    public oauthService: OAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (this.oauthService.getIdentityClaims()) {
      if (this.authService.accountActive.get('active')) {
        return this.getAccess(route)
      } else {
        return this.httpClient.get(this.configService.config.apiDomain + 'user/permission').pipe(
          map((data: any) => {
            this.authService.accountActive.set('active', data.active)
            data.permissions.forEach(element => {
              this.authService.permissionMap.set(element.id.toString(), true)
            })
            if (data.active) {
              this.authService.prospectiveUserMap.set(
                'prospectiveUser',
                data.userInfo.membershipType === null ||
                  data.userInfo.membershipType === undefined ||
                  data.userInfo.membershipType === ''
              )
            }
            if (!data.active) {
              this.authService.prospectiveUserMap.set('prospectiveUser', true)
              this.router.navigate(['/access-denied'])
              return false
            }
            return this.getAccess(route)
          }),
          catchError(err => {
            return of(false)
          })
        )
      }
    } else {
      return of(false)
    }
  }

 

 
}
