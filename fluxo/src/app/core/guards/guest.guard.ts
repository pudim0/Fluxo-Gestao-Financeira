import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/** Keeps authenticated users out of public authentication screens. */
export const guestGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() ? inject(Router).createUrlTree(['/dashboard']) : true;
};
