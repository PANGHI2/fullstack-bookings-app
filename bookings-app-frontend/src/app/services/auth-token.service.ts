import { Injectable } from '@angular/core';
import { Subject, Subscription, take, tap, timer } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

@Injectable({
    providedIn: 'root',
})
export class AuthTokenService {
    public authTokenExpirationSubject: Subject<void> = new Subject<void>();

    private authTokenExpirationTimerSubscription: Subscription | null = null;

    constructor() {}

    /* Auth Token Storage Utils*/
    public saveAuthTokenData(authToken: string, expiresInMillis: number): void {
        localStorage.setItem(LOCAL_STORAGE_KEYS.auth_token, authToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.auth_token_expiration_timestamp, `${Date.now() + expiresInMillis}`);
    }

    public deleteAuthTokenData(): void {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.auth_token);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.auth_token_expiration_timestamp);
    }

    public getAuthTokenIfActive(): string | null {
        return this.authTokenExpirationTimerSubscription && this.getAuthToken();
    }

    private getAuthToken(): string | null {
        return localStorage.getItem(LOCAL_STORAGE_KEYS.auth_token);
    }

    private getAuthTokenExpirationTimestamp(): string | null {
        return localStorage.getItem(LOCAL_STORAGE_KEYS.auth_token_expiration_timestamp);
    }
    /**/

    /* Auth Token Expiration Timer */
    public startAuthTokenExpirationTimer(expiresInMillis: number): void {
        console.log('timer set for millis: ', expiresInMillis);
        this.authTokenExpirationTimerSubscription = timer(expiresInMillis)
            .pipe(
                take(1),
                tap((): void => {
                    this.authTokenExpirationSubject.next();
                })
            )
            .subscribe();
    }

    public clearAuthTokenExpirationTimer(): void {
        this.authTokenExpirationTimerSubscription?.unsubscribe();
        this.authTokenExpirationTimerSubscription = null;
    }
    /**/
}
