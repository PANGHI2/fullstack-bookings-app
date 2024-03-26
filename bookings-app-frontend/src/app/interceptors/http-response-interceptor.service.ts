import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
    HttpStatusCode,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log(`%cHTTP request to: ${request.url}`, 'color: yellow');

        return next.handle(request).pipe(
            tap((event: HttpEvent<unknown>): void => {
                if (event instanceof HttpResponse) {
                    console.log(`%c[SUCCESS] ${request.url} response:`, 'color: green', event.body);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                console.error(`%c[ERROR] ${request.url} response:`, 'color: red', error);
                if (error.status === HttpStatusCode.Forbidden || error.status === HttpStatusCode.Unauthorized) {
                    this.authService.clearAuth();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}
