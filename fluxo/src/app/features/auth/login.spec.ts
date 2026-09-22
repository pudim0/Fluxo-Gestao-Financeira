import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { Login } from './login';

describe('Login', () => {
  let router: { navigateByUrl: (url: string) => Promise<boolean> };
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    router = { navigateByUrl: async () => true };
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap({ redirectTo: '/transacoes' }) },
          },
        },
      ],
    }).compileComponents();
    httpTesting = TestBed.inject(HttpTestingController);
    TestBed.inject(AuthService).logout();
  });

  it('rejeita um e-mail inválido antes de navegar', () => {
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

  it('inicia uma sessão e preserva redirectTo em um login válido', () => {
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

    httpTesting.expectOne(
      'https://dummyjson.com/users/filter?key=email&value=user%40example.com',
    ).flush({ users: [{ username: 'user', email: 'user@example.com' }] });
    httpTesting.expectOne('https://dummyjson.com/auth/login').flush({
      accessToken: 'api-token',
      email: 'user@example.com',
    });

    expect(TestBed.inject(AuthService).getCurrentUserEmail()).toBe('user@example.com');
    expect(TestBed.inject(AuthService).getToken()).toBe('api-token');
    expect(navigateSpy).toHaveBeenCalledWith('/transacoes');
  });
});
