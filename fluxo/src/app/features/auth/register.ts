import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './auth-page.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected name = '';
  protected email = '';
  protected password = '';
  protected passwordVisible = false;
  protected validationMessage = '';

  private isValidEmail(email: string): boolean {
    return email.trim().includes('@') && email.trim().length > 1;
  }

  protected submit(): void {
    if (!this.name.trim()) {
      this.validationMessage = 'Informe seu nome para continuar.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.validationMessage = 'Informe um e-mail válido, como seu@email.com.';
      return;
    }

    if (this.password.length < 8) {
      this.validationMessage = 'A senha precisa ter pelo menos 8 caracteres.';
      return;
    }

    this.validationMessage = '';
    this.authService.startDemoSession(this.email, this.name);
    void this.router.navigateByUrl('/onboarding');
  }

  protected continueWith(provider: 'google' | 'apple'): void {
    this.authService.startDemoSession(`${provider}@demo.fluxo.local`);
    void this.router.navigateByUrl('/onboarding');
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
