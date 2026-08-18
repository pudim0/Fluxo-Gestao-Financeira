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

  protected submit(): void {
    if (!this.email() || !this.password()) return;

    this.submitting.set(true);
    // Temporary adapter only: real credential verification belongs to the future API.
    this.authService.startDemoSession();
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
    void this.router.navigateByUrl(redirectTo);
  }
}
