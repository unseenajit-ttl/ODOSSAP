import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core'; import { Observable } from 'rxjs';


@Injectable()
export class OAuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const auth = req.clone({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Auth-Token': 'jwtToken'
            })
        });
        return next.handle(auth);
    }
}