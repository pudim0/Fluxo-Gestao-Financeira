import { Component, inject, signal } from '@angular/core';
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
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly passwordVisible = signal(false);

  protected submit(): void {
    if (!this.name() || !this.email() || this.password().length < 8) return;
    // Temporary demo session; account creation must be handled by a real API.
    this.authService.startDemoSession();
    void this.router.navigateByUrl('/onboarding');
  }
}
