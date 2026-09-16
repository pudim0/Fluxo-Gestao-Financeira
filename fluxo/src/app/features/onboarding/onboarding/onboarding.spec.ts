import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { FinancialProfile } from '../../../models/financial-profile.model';
import { FinancialProfileService } from '../../../services/financial-profile.service';
import { Onboarding } from './onboarding';

describe('Onboarding', () => {
  let component: Onboarding;
  let fixture: ComponentFixture<Onboarding>;
  let profileService: { profile: ReturnType<typeof signal<FinancialProfile>>; save: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const emptyProfile = (): FinancialProfile => ({
    goal: '', incomeSource: '', incomeFrequency: '', incomeAmount: '', incomeType: '',
    hasDebt: '', debtTypes: [], debtAmount: '', hasEmergencyFund: '', concern: '',
  });

  beforeEach(async () => {
    profileService = { profile: signal(emptyProfile()), save: vi.fn() };
    router = { navigate: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Onboarding],
      providers: [
        { provide: FinancialProfileService, useValue: profileService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Onboarding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the welcome state and starts the questionnaire', () => {
    expect(fixture.nativeElement.textContent).toContain('Vamos organizar sua vida financeira');
    fixture.nativeElement.querySelector('.primary-button').click();
    fixture.detectChanges();
    expect(component.started).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Qual é seu principal objetivo financeiro?');
  });

  it('keeps invalid answers from advancing and accepts a formatted income amount', () => {
    component.start();
    expect(component.canContinue()).toBe(false);
    component.next();
    expect(component.currentStep).toBe(0);
    component.selectAnswer('goal', 'Criar uma reserva');
    component.next();
    component.selectAnswer('incomeSource', 'Salário');
    component.next();
    component.selectAnswer('incomeFrequency', 'Mensalmente');
    component.next();
    component.profile.incomeAmount = 'R$ 2.500,00';
    expect(component.canContinue()).toBe(true);
    component.next();
    expect(component.currentQuestion).toBe('incomeType');
  });

  it('removes debt answers when the user changes to no debt', () => {
    component.selectAnswer('hasDebt', 'Sim');
    component.toggleDebtType('Cartão de crédito');
    component.updateDebtAmount({ target: { value: 'R$ 1.000' } } as unknown as Event);
    expect(component.steps).toContain('debtTypes');
    component.selectAnswer('hasDebt', 'Não');
    expect(component.profile.debtTypes).toEqual([]);
    expect(component.profile.debtAmount).toBe('');
    expect(component.steps).not.toContain('debtTypes');
  });

  it('supports selecting and deselecting debt types', () => {
    component.toggleDebtType('Empréstimo');
    expect(component.profile.debtTypes).toEqual(['Empréstimo']);
    component.toggleDebtType('Empréstimo');
    expect(component.profile.debtTypes).toEqual([]);
  });

  it('finishes a valid no-debt flow and navigates to the dashboard', () => {
    component.profile = {
      ...emptyProfile(), goal: 'Criar uma reserva', incomeSource: 'Salário',
      incomeFrequency: 'Mensalmente', incomeAmount: '2500', incomeType: 'Fixa',
      hasDebt: 'Não', hasEmergencyFund: 'Não', concern: 'Controlar gastos',
    };
    component.currentStep = component.steps.length - 1;
    component.next();
    component.finish();
    expect(component.showSummary).toBe(true);
    expect(profileService.save).toHaveBeenCalledWith(component.profile);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

});
