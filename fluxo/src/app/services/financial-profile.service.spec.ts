import { TestBed } from '@angular/core/testing';

import { AuthService } from '../core/services/auth.service';
import { FinancialProfile } from '../models/financial-profile.model';
import { FinancialProfileService } from './financial-profile.service';

describe('Serviço de perfil financeiro', () => {
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

  it('inicia com um perfil vazio quando não há dados armazenados', () => {
    expect(TestBed.inject(FinancialProfileService).profile()).toEqual({
      goal: '', incomeSource: '', incomeFrequency: '', incomeAmount: '', incomeType: '',
      hasDebt: '', debtTypes: [], debtAmount: '', hasEmergencyFund: '', concern: '',
    });
  });

  it('salva uma cópia do perfil e o persiste por usuário', () => {
    const service = TestBed.inject(FinancialProfileService);
    service.save(profile);
    expect(service.profile()).toEqual(profile);
    expect(JSON.parse(localStorage.getItem('fluxo.profile:user@example.com')!)).toEqual(profile);

    profile.debtTypes.push('Outra');
    expect(service.profile().debtTypes).toEqual([]);
  });

  it('combina valores armazenados com padrões e tolera armazenamento malformado', () => {
    localStorage.setItem('fluxo.profile:user@example.com', JSON.stringify({ goal: 'Quitar dívidas' }));
    expect(TestBed.inject(FinancialProfileService).profile()).toMatchObject({ goal: 'Quitar dívidas', debtTypes: [] });
  });
});