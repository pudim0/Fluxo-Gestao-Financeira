import { Injectable } from '@angular/core';

const AUTH_TOKEN_KEY = 'fluxo.auth.token';
const AUTH_EMAIL_KEY = 'fluxo.auth.email';
const AUTH_NAME_KEY = 'fluxo.auth.name';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentEmail: string | null | undefined;

  isAuthenticated(): boolean {
    return this.getCurrentUserEmail() !== null;
  }

  getToken(): string | null {
    return this.isAuthenticated() ? 'demo-token' : null;
  }

  getCurrentUserEmail(): string | null {
    if (this.currentEmail !== undefined) {
      return this.currentEmail;
    }

    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const email = localStorage.getItem(AUTH_EMAIL_KEY)?.trim().toLowerCase();
      this.currentEmail = token && email ? email : null;
    } catch {
      this.currentEmail = null;
    }

    return this.currentEmail;
  }

  getCurrentUserName(): string | null {
    try {
      return localStorage.getItem(AUTH_NAME_KEY)?.trim() || null;
    } catch {
      return null;
    }
  }

  startDemoSession(email: string, name?: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    this.currentEmail = normalizedEmail || null;

    if (!this.currentEmail) {
      return;
    }

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token');
      localStorage.setItem(AUTH_EMAIL_KEY, this.currentEmail);
      if (name?.trim()) {
        localStorage.setItem(AUTH_NAME_KEY, name.trim());
      }
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }

  logout(): void {
    this.currentEmail = null;

    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_EMAIL_KEY);
      localStorage.removeItem(AUTH_NAME_KEY);
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }
}
