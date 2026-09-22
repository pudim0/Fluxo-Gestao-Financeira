import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { UserAccount } from './user-account';

describe('UserAccount', () => {
  let component: UserAccount;
  let fixture: ComponentFixture<UserAccount>;
  let httpTesting: HttpTestingController;
  let router: { navigate: (commands: string[]) => Promise<boolean> };

  const usuario = {
    firstName: 'Emily',
    lastName: 'Johnson',
    maidenName: 'Smith',
    age: 28,
    gender: 'female',
    email: 'emily.johnson@example.com',
    phone: '1-555-555-5555',
    username: 'emilyjohnson',
    birthDate: '1996-03-12',
    image: 'https://dummyjson.com/icon/emilys/128',
    bloodGroup: 'O+',
    height: 168,
    weight: 60,
    eyeColor: 'Green',
    hair: { color: 'Brown', type: 'Straight' },
    address: {
      address: 'Rua Principal, 100',
      city: 'Rio de Janeiro',
      state: 'RJ',
      postalCode: '20000-000',
      country: 'Brasil',
    },
    bank: {
      cardNumber: '5300123456789012',
      cardExpire: '09/28',
      cardType: 'Visa',
      currency: 'BRL',
      iban: 'BR123456789',
    },
    company: { name: 'Fluxo', title: 'Analista', department: 'Financeiro' },
  };

  beforeEach(async () => {
    router = { navigate: vi.fn(async () => true) };
    await TestBed.configureTestingModule({
      imports: [UserAccount],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccount);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('https://dummyjson.com/users/1').flush(usuario);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve criar o componente e exibir os dados recebidos da API', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Emily Johnson');
    expect(fixture.nativeElement.textContent).toContain('PicPay');
    expect(fixture.nativeElement.textContent).toContain('Mercado Pago');
  });

  it('deve alternar entre dados pessoais e segurança', () => {
    const account = component as any;

    expect(account.activeProfileTab()).toBe('personal');
    account.setProfileTab('security');
    fixture.detectChanges();

    expect(account.activeProfileTab()).toBe('security');
    expect(fixture.nativeElement.textContent).toContain('Senha antiga');
    expect(fixture.nativeElement.textContent).toContain('mínimo 8 caracteres');
  });

  it('deve exigir senha antiga e senha nova com pelo menos oito caracteres', () => {
    const account = component as any;

    account.editedEmail.set('novo@example.com');
    account.newPassword.set('1234567');
    account.confirmPassword.set('1234567');
    account.saveSecurity();
    expect(account.securityError()).toContain('senha antiga');

    account.oldPassword.set('senha-atual');
    account.saveSecurity();
    expect(account.securityError()).toContain('8 caracteres');

    account.newPassword.set('12345678');
    account.confirmPassword.set('87654321');
    account.saveSecurity();
    expect(account.securityError()).toContain('não confere');
  });

  it('deve salvar o novo e-mail quando os dados de segurança forem válidos', () => {
    const account = component as any;

    account.editedEmail.set('novo@example.com');
    account.oldPassword.set('senha-atual');
    account.newPassword.set('senha-segura');
    account.confirmPassword.set('senha-segura');
    account.saveSecurity();

    expect(account.user().email).toBe('novo@example.com');
    expect(account.securityError()).toBe('');
  });

  it('deve abrir o modal e salvar alterações dos dados pessoais', () => {
    const account = component as any;

    account.openEditProfile(account.user());
    expect(account.editProfileOpen()).toBe(true);

    account.personalName.set('Ana Souza');
    account.personalEmail.set('ana@example.com');
    account.personalPhone.set('+55 (21) 99985-2931');
    account.savePersonalData();

    expect(account.editProfileOpen()).toBe(false);
    expect(account.fullName(account.user())).toBe('Ana Souza');
    expect(account.user().email).toBe('ana@example.com');
  });

  it('deve abrir a confirmação e redirecionar para o login ao confirmar a saída', async () => {
    const account = component as any;
    const authService = TestBed.inject(AuthService);
    authService.startDemoSession('emily@example.com');

    account.openLogoutConfirmation();
    expect(account.logoutOpen()).toBe(true);

    account.confirmLogout();
    await Promise.resolve();

    expect(account.logoutOpen()).toBe(false);
    expect(authService.isAuthenticated()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve aceitar uma imagem e atualizar a pré-visualização do avatar', () => {
    const account = component as any;
    let loadCallback: (() => void) | undefined;

    vi.stubGlobal(
      'FileReader',
      class MockFileReader {
        result = 'data:image/png;base64,imagem';
        addEventListener(_event: string, callback: () => void): void {
          loadCallback = callback;
        }
        readAsDataURL(): void {
          loadCallback?.();
        }
      },
    );

    const file = new File(['imagem'], 'perfil.png', { type: 'image/png' });
    account.selectProfilePhoto({ target: { files: [file], value: 'perfil.png' } } as unknown as Event);

    expect(account.profilePhoto()).toBe('data:image/png;base64,imagem');
    vi.unstubAllGlobals();
  });
});
