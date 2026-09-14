import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideRouter([])],
    });
    TestBed.inject(AuthService).logout();
  });

  it('allows anonymous users to access public auth pages', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, []));

    expect(result).toBe(true);
  });

  it('redirects authenticated users to the dashboard', () => {
    TestBed.inject(AuthService).startDemoSession('user@example.com');

    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, []));
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe('/dashboard');
  });
});
