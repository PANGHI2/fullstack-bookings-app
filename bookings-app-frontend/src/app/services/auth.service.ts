import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { GetAuthUserResponse } from '../models/api/auth/get-auth-user-response';
import { LoginRequest } from '../models/api/auth/login-request';
import { LoginResponse } from '../models/api/auth/login-response';
import { MessageResponse } from '../models/api/message-response';
import { AuthTokenService } from './auth-token.service';
import { API_ENDPOINTS } from '../utils/constants';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private authTokenService: AuthTokenService
    ) {
        this.authTokenService.authTokenExpirationSubject.pipe(switchMap(() => this.refresh())).subscribe();
    }

    public login(loginRequest: LoginRequest): Observable<LoginResponse | null> {
        const loginUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_login}`;

        return this.http.post<LoginResponse>(loginUrl, loginRequest).pipe(
            take(1),
            tap((loginResponse: LoginResponse): void => {
                this.refreshAuth(loginResponse.access_token, (loginResponse.expires_in - 30) * 1000);
                this.router.navigate(['/dashboard']);
            }),
            catchError((error: MessageResponse): Observable<never> => {
                console.log(`${loginUrl} request error: `, error);
                return throwError(() => error);
            })
        );
    }

    public refresh(): Observable<LoginResponse | null> {
        const refreshUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_refresh}`;
        console.log('trying to call refresh ep');
        return this.http.post<LoginResponse>(refreshUrl, {}).pipe(
            take(1),
            tap((loginResponse: LoginResponse): void => {
                this.refreshAuth(loginResponse.access_token, (loginResponse.expires_in - 30) * 1000);
            }),
            catchError((error: MessageResponse): Observable<never> => {
                this.clearAuth();
                this.router.navigate(['/login']);

                console.log(`${refreshUrl} request error: `, error);
                return throwError(() => error);
            })
        );
    }

    public logout(): Observable<MessageResponse> {
        const logoutUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_logout}`;

        return this.http.post<MessageResponse>(logoutUrl, {}).pipe(
            take(1),
            catchError((error: MessageResponse): Observable<never> => {
                console.log(`${logoutUrl} request error: `, error);
                return throwError(() => error);
            }),
            finalize((): void => {
                this.clearAuth();
                this.router.navigate(['/login']);
            })
        );
    }

    public getAuthUser(): Observable<GetAuthUserResponse> {
        const authUserInfoUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_user}`;

        return this.http.get<GetAuthUserResponse>(authUserInfoUrl).pipe(
            tap((authUserInfoResponse: GetAuthUserResponse): void => {
                console.log(`${authUserInfoUrl} response:`, authUserInfoResponse);
            }),
            catchError((error: MessageResponse): Observable<never> => {
                console.log(`${authUserInfoUrl} request error: `, error);
                return throwError(() => error);
            })
        );
    }

    public clearAuth(): void {
        this.authTokenService.clearAuthTokenExpirationTimer();
        this.authTokenService.deleteAuthTokenData();
    }

    public refreshAuth(authToken: string, expiresInMillis: number): void {
        this.clearAuth();
        this.authTokenService.saveAuthTokenData(authToken, expiresInMillis);
        this.authTokenService.startAuthTokenExpirationTimer(expiresInMillis);
    }
}
