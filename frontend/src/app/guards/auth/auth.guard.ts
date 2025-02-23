import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  if(!token) return false;

  return authService.isLoggedIn(token);
};
