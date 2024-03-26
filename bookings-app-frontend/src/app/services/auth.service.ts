import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, Observable, switchMap, take, tap } from 'rxjs';
import { GetAuthUserResponse } from '../models/api/auth/get-auth-user-response.model';
import { LoginRequest } from '../models/api/auth/login-request.model';
import { LoginResponse, RefreshResponse } from '../models/api/auth/login-refresh-response.model';
import { MessageResponse } from '../models/api/message-response.model';
import { AuthTokenService } from './auth-token.service';
import { API_ENDPOINTS } from '../utils/constants.utils';

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

    public login(loginRequest: LoginRequest): Observable<LoginResponse> {
        const loginUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_login}`;

        return this.http.post<LoginResponse>(loginUrl, loginRequest).pipe(
            take(1),
            tap(({ access_token, expires_in }: LoginResponse): void => {
                this.refreshAuth(access_token, (expires_in - 30) * 1000);
                this.router.navigate(['/dashboard']);
            })
        );
    }

    public refresh(): Observable<RefreshResponse> {
        const refreshUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_refresh}`;

        return this.http.post<RefreshResponse>(refreshUrl, {}).pipe(
            take(1),
            tap({
                next: ({ access_token, expires_in }: RefreshResponse): void => {
                    this.refreshAuth(access_token, (expires_in - 30) * 1000);
                },
                error: (): void => {
                    this.clearAuth();
                    this.router.navigate(['/login']);
                },
            })
        );
    }

    public logout(): Observable<MessageResponse> {
        const logoutUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_logout}`;

        return this.http.post<MessageResponse>(logoutUrl, {}).pipe(
            take(1),
            finalize((): void => {
                this.clearAuth();
                this.router.navigate(['/login']);
            })
        );
    }

    public getAuthUser(): Observable<GetAuthUserResponse> {
        const authUserInfoUrl: string = `${environment.apiUrl}${API_ENDPOINTS.auth_user}`;

        return this.http.get<GetAuthUserResponse>(authUserInfoUrl);
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

    public continueAuth(): void {
        this.authTokenService.continueAuthExpirationTimer();
    }
}
