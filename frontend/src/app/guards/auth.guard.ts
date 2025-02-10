import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = new Router();
  const token = localStorage.getItem('token');

  if(!token || !authService.isTokenValid(token)){
    router.navigate(['/login']);
    return false;
  }

  return true;
};
