import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, of, switchMap, throwError } from 'rxjs';

const AUTH_TOKEN_KEY = 'fluxo.auth.token';
const AUTH_EMAIL_KEY = 'fluxo.auth.email';
const AUTH_NAME_KEY = 'fluxo.auth.name';
const LOCAL_ACCOUNTS_KEY = 'fluxo.auth.accounts';
const API_URL = 'https://dummyjson.com';

interface ApiUser {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface UsersResponse {
  users: ApiUser[];
}

interface LoginResponse {
  accessToken?: string;
  token?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface LocalAccount {
  email: string;
  name: string;
  passwordHash: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private currentEmail: string | null | undefined;

  isAuthenticated(): boolean {
    return this.getCurrentUserEmail() !== null;
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const localAccount = this.readAccounts().find((account) => account.email === normalizedEmail);

    if (localAccount) {
      return from(this.hashPassword(password)).pipe(
        switchMap((passwordHash) => {
          if (passwordHash !== localAccount.passwordHash) {
            return throwError(() => new Error('Credenciais inválidas.'));
          }

          this.persistSession('local-token', localAccount.email, localAccount.name);
          return of(void 0);
        }),
      );
    }

    return this.http
      .get<UsersResponse>(`${API_URL}/users/filter?key=email&value=${encodeURIComponent(normalizedEmail)}`)
      .pipe(
        switchMap(({ users }) => {
          const user = users[0];
          if (!user) {
            return throwError(() => new Error('Credenciais inválidas.'));
          }

          return this.http.post<LoginResponse>(`${API_URL}/auth/login`, {
            username: user.username,
            password,
            expiresInMins: 30,
          });
        }),
        switchMap((response) => {
          const token = response.accessToken ?? response.token;
          if (!token) {
            return throwError(() => new Error('A API não retornou um token de sessão.'));
          }

          this.persistSession(
            token,
            response.email ?? normalizedEmail,
            [response.firstName, response.lastName].filter(Boolean).join(' '),
          );
          return new Observable<void>((subscriber) => {
            subscriber.next();
            subscriber.complete();
          });
        }),
      );
  }

  register(email: string, password: string, name: string): Observable<void> {
    const normalizedEmail = email.trim().toLowerCase();

    return from(this.hashPassword(password)).pipe(
      switchMap((passwordHash) => {
        const accounts = this.readAccounts();
        const account: LocalAccount = { email: normalizedEmail, name: name.trim(), passwordHash };
        const existingIndex = accounts.findIndex((item) => item.email === normalizedEmail);

        if (existingIndex >= 0) {
          accounts[existingIndex] = account;
        } else {
          accounts.push(account);
        }

        this.writeAccounts(accounts);
        this.persistSession('local-token', normalizedEmail, account.name);
        return of(void 0);
      }),
    );
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
    
    // Bug #18 Fix: Validar formato de email
    if (!this.isValidEmail(normalizedEmail)) {
      console.error('Email inválido. Use um formato válido: exemplo@email.com');
      return;
    }
    
    this.currentEmail = normalizedEmail || null;

    if (!this.currentEmail) {
      return;
    }

    this.persistSession('demo-token', this.currentEmail, name);
  }

  private persistSession(token: string, email: string, name?: string): void {
    this.currentEmail = email;

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_EMAIL_KEY, email);
      if (name?.trim()) {
        localStorage.setItem(AUTH_NAME_KEY, name.trim());
      }
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private readAccounts(): LocalAccount[] {
    try {
      const stored = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      return stored ? (JSON.parse(stored) as LocalAccount[]) : [];
    } catch {
      return [];
    }
  }

  private writeAccounts(accounts: LocalAccount[]): void {
    try {
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {
      // Storage may be unavailable in restricted environments.
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
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
