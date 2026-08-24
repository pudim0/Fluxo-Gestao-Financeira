import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './auth-page.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly passwordVisible = signal(false);
  protected readonly submitting = signal(false);
  protected readonly validationMessage = signal('');

  private isValidEmail(email: string): boolean {
    return email.trim().includes('@') && email.trim().length > 1;
  }

  protected submit(): void {
    const email = this.email().trim();
    const password = this.password();

    if (!this.isValidEmail(email)) {
      this.validationMessage.set('Informe um e-mail válido, como seu@email.com.');
      return;
    }

    if (password.length < 8) {
      this.validationMessage.set('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    this.validationMessage.set('');

    this.submitting.set(true);
    this.authService.startDemoSession(email);
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
    void this.router.navigateByUrl(redirectTo);
  }

  protected continueWith(provider: 'google' | 'apple'): void {
    this.authService.startDemoSession(`${provider}@demo.fluxo.local`);
    void this.router.navigateByUrl('/dashboard');
  }
}
