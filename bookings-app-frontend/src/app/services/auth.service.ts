import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    const loginUrl: string = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(loginUrl, loginRequest).pipe(
      tap((loginResponse: LoginResponse): void => {
        this.storeTokenData(loginResponse);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  storeTokenData(loginResponse: LoginResponse): void {
    sessionStorage.setItem('access_token', loginResponse.access_token);
    sessionStorage.setItem('access_token_expiration_timestamp', `${Date.now() + loginResponse.expires_in * 1000}`);
  }

  deleteTokenData(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token_expiration_timestamp');
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  isTokenExpired(): boolean {
    const accessTokenExpirationTimestamp: string | null = sessionStorage.getItem('access_token_expiration_timestamp');

    return !accessTokenExpirationTimestamp || +accessTokenExpirationTimestamp < Date.now();
  }
}
