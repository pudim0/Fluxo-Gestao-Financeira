import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { Login } from './login';

describe('Login', () => {
  let router: { navigateByUrl: (url: string) => Promise<boolean> };

  beforeEach(async () => {
    router = { navigateByUrl: async () => true };
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({ redirectTo: '/transacoes' }) } },
        },
      ],
    }).compileComponents();
    TestBed.inject(AuthService).logout();
  });

  it('rejects an invalid email before navigating', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance as Login & {
      email: { set: (value: string) => void };
      password: { set: (value: string) => void };
      submit: () => void;
    };
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.email.set('invalid-email');
    component.password.set('password');

    component.submit();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(false);
  });

  it('starts a session and preserves redirectTo for a valid login', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance as Login & {
      email: { set: (value: string) => void };
      password: { set: (value: string) => void };
      submit: () => void;
    };
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.email.set('user@example.com');
    component.password.set('password');

    component.submit();

    expect(TestBed.inject(AuthService).getCurrentUserEmail()).toBe('user@example.com');
    expect(navigateSpy).toHaveBeenCalledWith('/transacoes');
  });
});