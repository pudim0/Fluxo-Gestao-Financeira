import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { guestGuard } from './guest.guard';

describe('Proteção de visitantes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideRouter([])],
    });
    TestBed.inject(AuthService).logout();
  });

  it('permite que usuários anônimos acessem páginas públicas de autenticação', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, []));

    expect(result).toBe(true);
  });

  it('redireciona usuários autenticados para o painel', () => {
    TestBed.inject(AuthService).startDemoSession('user@example.com');

    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, []));
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe('/dashboard');
  });
});
