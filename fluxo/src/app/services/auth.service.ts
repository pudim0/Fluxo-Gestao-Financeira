import { Injectable } from '@angular/core';

const AUTH_TOKEN_KEY = 'fluxo.auth.token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  login(token = 'demo-token'): void {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // Storage is unavailable in some test environments.
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // Storage is unavailable in some test environments.
    }
  }
}