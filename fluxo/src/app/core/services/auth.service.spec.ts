import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('Serviço de autenticação', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('inicia e encerra a sessão temporária de demonstração', () => {
    expect(service.isAuthenticated()).toBe(false);
    service.startDemoSession('teste@exemplo.com');
    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('não aceita um token vazio como sessão autenticada', () => {
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
  });
});
