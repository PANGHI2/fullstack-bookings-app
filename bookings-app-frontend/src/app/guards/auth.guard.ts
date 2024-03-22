import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isTokenMissing: boolean = !authService.getToken();
  const isTokenExpired: boolean = authService.isTokenExpired();

  if (isTokenMissing || isTokenExpired) {
    authService.deleteTokenData();
    router.navigate(['/login']);
    return false;
  }
  return true;
};
