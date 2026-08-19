import { Injectable } from '@angular/core';

const AUTH_TOKEN_KEY = 'fluxo.auth.token';

/**
 * Session adapter used while the product has no authentication API. Replace its
 * methods with API calls without changing the screens or route guards.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  startDemoSession(): void {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token');
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }
}
