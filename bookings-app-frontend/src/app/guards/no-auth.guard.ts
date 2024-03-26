import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthTokenService } from '../services/auth-token.service';

export const noAuthGuard: CanActivateFn = (): boolean => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);
    const authTokenService: AuthTokenService = inject(AuthTokenService);

    if (authTokenService.getAuthTokenIfActive()) {
        authService.continueAuth();
        router.navigate(['/dashboard']);
        return false;
    }

    authService.clearAuth();
    return true;
};
