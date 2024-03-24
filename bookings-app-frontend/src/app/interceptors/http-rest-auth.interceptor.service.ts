import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { API_ENDPOINTS, HTTP_JSON_HEADERS } from '../utils/constants';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable()
export class HttpRestAuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private authService: AuthService,
        private authTokenService: AuthTokenService
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const endpointRequiresAuthToken: boolean = !request.url.endsWith(API_ENDPOINTS.auth_login);
        let authToken: string | null = null;
        console.log('interceptor called');
        if (endpointRequiresAuthToken) {
            if (!(authToken = this.authTokenService.getAuthTokenIfActive())) {
                console.log('but found no token, so clearing auth');
                this.authService.clearAuth();
                this.router.navigate(['/login']);
                return EMPTY;
            }
        }
        console.log('interceptor: attaching token and GO');
        const requestWithHeaders: HttpRequest<unknown> = request.clone({
            setHeaders: {
                ...HTTP_JSON_HEADERS,
                /* conditionally adding Authorization header, if calling an endpoint other than /login and having an active auth token*/
                ...(endpointRequiresAuthToken && authToken && { Authorization: `Bearer ${authToken}` }),
            },
        });
        return next.handle(requestWithHeaders);
    }
}
