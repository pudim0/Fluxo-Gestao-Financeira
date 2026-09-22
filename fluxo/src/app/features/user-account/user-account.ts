import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

interface DummyUser {
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: { color: string; type: string };
  address: { address: string; city: string; state: string; postalCode: string; country: string };
  bank: { cardNumber: string; cardExpire: string; cardType: string; currency: string; iban: string };
  company: { name: string; title: string; department: string };
}

interface BrazilianAccount {
  cardNumber: string;
  cardExpire: string;
  cardType: string;
  currency: string;
  accountNumber: string;
  pixKey: string;
}

@Component({
  selector: 'app-user-account',
  imports: [],
  templateUrl: './user-account.html',
  styleUrl: './user-account.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccount {
  private readonly http = inject(HttpClient, { optional: true });
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly user = signal<DummyUser | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly activeProfileTab = signal<'personal' | 'security'>('personal');
  protected readonly editProfileOpen = signal(false);
  protected readonly logoutOpen = signal(false);
  protected readonly profilePhoto = signal<string | null>(null);
  protected readonly showCardNumber = signal(false);
  protected readonly showBankNumber = signal(false);
  protected readonly editedEmail = signal('');
  protected readonly oldPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly securityError = signal('');
  protected readonly personalName = signal('');
  protected readonly personalEmail = signal('');
  protected readonly personalPhone = signal('+55 (21) 99985-2931');
  protected readonly personalBirthDate = signal('12/03/1994');
  protected readonly personalLocation = signal('Rio de Janeiro, RJ');
  protected readonly brazilianAccount: BrazilianAccount = {
    cardNumber: '5300 1234 5678 9012',
    cardExpire: '09/28',
    cardType: 'Visa Platinum',
    currency: 'BRL',
    accountNumber: '12345678-9',
    pixKey: '21999852931',
  };

  protected openLogoutConfirmation(): void {
    this.logoutOpen.set(true);
  }

  protected closeLogoutConfirmation(): void {
    this.logoutOpen.set(false);
  }

  protected confirmLogout(): void {
    this.authService.logout();
    this.logoutOpen.set(false);
    void this.router.navigate(['/login']);
  }

  protected selectProfilePhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') this.profilePhoto.set(reader.result);
    });
    reader.readAsDataURL(file);
    input.value = '';
  }

  constructor() {
    this.loadUser();
  }

  protected fullName(user: DummyUser): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  protected initials(user: DummyUser): string {
    return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
  }

  protected maskedCard(cardNumber: string): string {
    return `••••  ••••  ••••  ${cardNumber.slice(-4)}`;
  }

  protected maskedIban(iban: string): string {
    return `${iban.slice(0, 4)} •••• •••• ${iban.slice(-4)}`;
  }

  protected setProfileTab(tab: 'personal' | 'security'): void {
    this.activeProfileTab.set(tab);
  }

  protected openEditProfile(user: DummyUser): void {
    this.personalName.set(this.fullName(user));
    this.personalEmail.set(user.email);
    this.editProfileOpen.set(true);
  }

  protected closeEditProfile(): void {
    this.editProfileOpen.set(false);
  }

  protected updatePersonalField(field: 'name' | 'email' | 'phone' | 'birthDate' | 'location', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const fields = {
      name: this.personalName,
      email: this.personalEmail,
      phone: this.personalPhone,
      birthDate: this.personalBirthDate,
      location: this.personalLocation,
    };
    fields[field].set(value);
  }

  protected savePersonalData(): void {
    const user = this.user();
    const [firstName, ...lastNameParts] = this.personalName().trim().split(' ');
    if (!user || !firstName || !lastNameParts.length || !this.personalEmail().trim()) return;

    this.user.set({
      ...user,
      firstName,
      lastName: lastNameParts.join(' '),
      email: this.personalEmail().trim(),
      phone: this.personalPhone(),
      birthDate: this.personalBirthDate(),
      address: { ...user.address, city: this.personalLocation() },
    });
    this.closeEditProfile();
  }

  protected updateEmail(event: Event): void {
    this.editedEmail.set((event.target as HTMLInputElement).value);
  }

  protected updateOldPassword(event: Event): void {
    this.oldPassword.set((event.target as HTMLInputElement).value);
  }

  protected updatePassword(event: Event): void {
    this.newPassword.set((event.target as HTMLInputElement).value);
  }

  protected updateConfirmPassword(event: Event): void {
    this.confirmPassword.set((event.target as HTMLInputElement).value);
  }

  protected saveSecurity(): void {
    if (!this.oldPassword()) {
      this.securityError.set('Informe sua senha antiga para continuar.');
      return;
    }
    if (this.newPassword().length < 8) {
      this.securityError.set('A nova senha deve possuir no mínimo 8 caracteres.');
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.securityError.set('A confirmação da nova senha não confere.');
      return;
    }

    this.securityError.set('');
    const user = this.user();
    if (user && this.editedEmail().trim()) {
      this.user.set({ ...user, email: this.editedEmail().trim() });
    }
    this.oldPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
  }

  private loadUser(): void {
    if (!this.http) {
      this.loading.set(false);
      return;
    }

    this.http
      .get<DummyUser>('https://dummyjson.com/users/1')
      .pipe(catchError(() => of(null)))
      .subscribe((user) => {
        this.user.set(user);
        if (user) {
          this.editedEmail.set(user.email);
          this.personalName.set(this.fullName(user));
          this.personalEmail.set(user.email);
        }
        this.error.set(!user);
        this.loading.set(false);
      });
  }
}
