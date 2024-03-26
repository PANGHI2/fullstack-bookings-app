import { Injectable } from '@angular/core';
import { Subject, Subscription, take, tap, timer } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from '../utils/constants.utils';

@Injectable({
    providedIn: 'root',
})
export class AuthTokenService {
    public authTokenExpirationSubject: Subject<void> = new Subject<void>();

    private authTokenExpirationTimerSubscription: Subscription | null = null;

    /* Auth Token Storage Utils*/
    public saveAuthTokenData(authToken: string, expiresInMillis: number): void {
        localStorage.setItem(LOCAL_STORAGE_KEYS.auth_token, authToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.auth_token_expiration_timestamp, String(Date.now() + expiresInMillis));
    }

    public deleteAuthTokenData(): void {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.auth_token);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.auth_token_expiration_timestamp);
    }

    public getAuthTokenIfActive(): string | null {
        const authTokenExpirationTimestamp: string | null = this.getAuthTokenExpirationTimestamp();

        return (
            ((this.isAuthExpirationTimerActive() ||
                (authTokenExpirationTimestamp && Date.now() < +authTokenExpirationTimestamp)) &&
                this.getAuthToken()) ||
            null
        );
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
        this.authTokenExpirationTimerSubscription = timer(expiresInMillis)
            .pipe(
                take(1),
                tap((): void => {
                    this.authTokenExpirationSubject.next();
                })
            )
            .subscribe();
    }

    public continueAuthExpirationTimer(): void {
        if (!this.isAuthExpirationTimerActive()) {
            const authToken: string | null = this.getAuthTokenIfActive();
            const authTokenExpirationTimestamp: string | null = this.getAuthTokenExpirationTimestamp();
            if (authToken && authTokenExpirationTimestamp) {
                const remainingMillis: number = +authTokenExpirationTimestamp - Date.now();
                this.startAuthTokenExpirationTimer(remainingMillis);
            }
        }
    }

    public clearAuthTokenExpirationTimer(): void {
        this.authTokenExpirationTimerSubscription?.unsubscribe();
        this.authTokenExpirationTimerSubscription = null;
    }
    /**/

    private isAuthExpirationTimerActive(): boolean {
        return !!this.authTokenExpirationTimerSubscription;
    }
}
