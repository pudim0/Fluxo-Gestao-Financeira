import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('Serviço de autenticação', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
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

  it('persists only the token returned by the API after valid credentials', () => {
    service.login('user@example.com', 'password').subscribe();

    httpTesting.expectOne(
      'https://dummyjson.com/users/filter?key=email&value=user%40example.com',
    ).flush({ users: [{ username: 'user', email: 'user@example.com' }] });
    httpTesting.expectOne('https://dummyjson.com/auth/login').flush({
      accessToken: 'api-token',
      email: 'user@example.com',
    });

    expect(service.getToken()).toBe('api-token');
    expect(service.isAuthenticated()).toBe(true);
  });
});
