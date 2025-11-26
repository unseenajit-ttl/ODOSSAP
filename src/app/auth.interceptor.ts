import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonService } from './SharedServices/CommonService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private commonService: CommonService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = localStorage.getItem('jwt');
    // const token = "mayurhattekar";
    const token = this.commonService.GetToken();

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If unauthorized, redirect to login page
          localStorage.removeItem('jwt');
          // this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
