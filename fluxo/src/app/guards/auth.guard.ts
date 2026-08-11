import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = (_route, segments) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (authService.isAuthenticated()) {
		return true;
	}

	const attemptedUrl = segments.map((segment) => segment.path).join('/');

	return router.createUrlTree(['/login'], {
		queryParams: attemptedUrl ? { redirectTo: `/${attemptedUrl}` } : undefined
	});
};
