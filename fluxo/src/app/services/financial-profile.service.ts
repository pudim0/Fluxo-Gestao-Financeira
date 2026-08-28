import { inject, Injectable, signal } from '@angular/core';

import { AuthService } from '../core/services/auth.service';
import { FinancialProfile } from '../models/financial-profile.model';

const PROFILE_STORAGE_PREFIX = 'fluxo.profile:';

const emptyProfile = (): FinancialProfile => ({
  goal: '',
  incomeSource: '',
  incomeFrequency: '',
  incomeAmount: '',
  incomeType: '',
  hasDebt: '',
  debtTypes: [],
  debtAmount: '',
  hasEmergencyFund: '',
  concern: '',
});

@Injectable({ providedIn: 'root' })
export class FinancialProfileService {
  private readonly authService = inject(AuthService);
  private readonly profileState = signal<FinancialProfile>(this.read());

  readonly profile = this.profileState.asReadonly();

  save(profile: FinancialProfile): void {
    const copy = { ...profile, debtTypes: [...profile.debtTypes] };
    this.profileState.set(copy);

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(copy));
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }

  private read(): FinancialProfile {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        return { ...emptyProfile(), ...(JSON.parse(stored) as FinancialProfile) };
      }
    } catch {
      // Ignore malformed or unavailable storage and use an empty profile.
    }

    return emptyProfile();
  }

  private getStorageKey(): string {
    const email = this.authService.getCurrentUserEmail() ?? 'anonymous';
    return `${PROFILE_STORAGE_PREFIX}${email}`;
  }
}
