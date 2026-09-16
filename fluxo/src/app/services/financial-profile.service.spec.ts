import { TestBed } from '@angular/core/testing';

import { AuthService } from '../core/services/auth.service';
import { FinancialProfile } from '../models/financial-profile.model';
import { FinancialProfileService } from './financial-profile.service';

describe('FinancialProfileService', () => {
  const profile: FinancialProfile = {
    goal: 'Investir', incomeSource: 'Salário', incomeFrequency: 'Mensalmente',
    incomeAmount: '3000', incomeType: 'Fixa', hasDebt: 'Não', debtTypes: [], debtAmount: '',
    hasEmergencyFund: 'Sim', concern: 'Começar a investir',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        FinancialProfileService,
        { provide: AuthService, useValue: { getCurrentUserEmail: () => 'user@example.com' } },
      ],
    });
  });

  it('starts with an empty profile when storage is absent', () => {
    expect(TestBed.inject(FinancialProfileService).profile()).toEqual({
      goal: '', incomeSource: '', incomeFrequency: '', incomeAmount: '', incomeType: '',
      hasDebt: '', debtTypes: [], debtAmount: '', hasEmergencyFund: '', concern: '',
    });
  });

  it('saves a copy of the profile and persists it per user', () => {
    const service = TestBed.inject(FinancialProfileService);
    service.save(profile);
    expect(service.profile()).toEqual(profile);
    expect(JSON.parse(localStorage.getItem('fluxo.profile:user@example.com')!)).toEqual(profile);

    profile.debtTypes.push('Outra');
    expect(service.profile().debtTypes).toEqual([]);
  });

  it('merges stored values with defaults and tolerates malformed storage', () => {
    localStorage.setItem('fluxo.profile:user@example.com', JSON.stringify({ goal: 'Quitar dívidas' }));
    expect(TestBed.inject(FinancialProfileService).profile()).toMatchObject({ goal: 'Quitar dívidas', debtTypes: [] });
  });
});