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
});
