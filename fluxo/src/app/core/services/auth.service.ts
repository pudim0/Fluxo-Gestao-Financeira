import { Injectable } from '@angular/core';

const AUTH_TOKEN_KEY = 'fluxo.auth.token';
const AUTH_EMAIL_KEY = 'fluxo.auth.email';

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

  startDemoSession(email: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    this.currentEmail = normalizedEmail || null;

    if (!this.currentEmail) {
      return;
    }

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token');
      localStorage.setItem(AUTH_EMAIL_KEY, this.currentEmail);
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }

  logout(): void {
    this.currentEmail = null;

    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_EMAIL_KEY);
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }
}
