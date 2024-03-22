import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpRestAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let accessToken: string | null = null;
    if (!request.url.endsWith('/api/auth/login')) {
      accessToken = this.authService.getToken();
    }

    const requestWithHeaders: HttpRequest<unknown> = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(!!accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return next.handle(requestWithHeaders);
  }
}
