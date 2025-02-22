import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guardsGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = !!auth.currentUser;
  if (isLoggedIn) {
    return true;
  }
  // Если не залогинен, редиректим на /login
  return router.parseUrl('/login');
};
