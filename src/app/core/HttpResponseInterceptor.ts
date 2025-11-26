import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { merge, Observable, of } from 'rxjs'
import { catchError, filter, map, mergeMap, take, tap, timeout } from 'rxjs/operators'

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                next: (event) => {
                    if (event instanceof HttpResponse) {
                        if (event.status == 401) {
                            alert('Unauthorized access!')
                        }
                    }
                    return event;
                },
                error: (error) => {
                    if (error.status === 401) {
                        alert('Unauthorized access!')
                    }
                    else if (error.status === 404) {
                        alert('Page Not Found!')
                    }
                }
            }));
    }
}