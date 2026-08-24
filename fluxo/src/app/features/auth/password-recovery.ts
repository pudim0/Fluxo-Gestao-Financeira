import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './password-recovery.html',
  styleUrl: './auth-page.css',
})
export class PasswordRecovery {
  protected readonly email = signal('');
  protected readonly sent = signal(false);
  protected submit(): void {
    if (this.email()) this.sent.set(true);
  }
}
