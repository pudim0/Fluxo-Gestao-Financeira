import { TestBed } from '@angular/core/testing';
import { provideRouter, Route, Router, UrlSegment } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideRouter([])],
    });
    authService = TestBed.inject(AuthService);
    authService.logout();
  });

  it('allows authenticated users to continue', () => {
    authService.startDemoSession('user@example.com');

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as Route, [new UrlSegment('transacoes', {})]),
    );

    expect(result).toBe(true);
  });

  it('redirects anonymous users to login with the attempted route', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as Route, [new UrlSegment('transacoes', {})]),
    );
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe(
      '/login?redirectTo=%2Ftransacoes',
    );
  });
});