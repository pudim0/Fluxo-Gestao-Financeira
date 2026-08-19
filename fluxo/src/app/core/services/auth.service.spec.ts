import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('starts and clears the temporary demo session', () => {
    expect(service.isAuthenticated()).toBe(false);
    service.startDemoSession();
    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('does not accept an empty token as an authenticated session', () => {
    localStorage.setItem('fluxo.auth.token', '');

    expect(service.isAuthenticated()).toBe(false);
  });
});
