import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FinancialProfile } from '../../../models/financial-profile.model';
import { FinancialProfileService } from '../../../services/financial-profile.service';

type Question =
  | 'goal'
  | 'incomeSource'
  | 'incomeFrequency'
  | 'incomeAmount'
  | 'incomeType'
  | 'hasDebt'
  | 'debtTypes'
  | 'debtAmount'
  | 'hasEmergencyFund'
  | 'concern';

import { DebtType } from '../../../models/financial-profile.model';

type AnswerField = Exclude<keyof FinancialProfile, 'debtTypes' | 'debtAmount'>;

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding {
  private readonly profileService = inject(FinancialProfileService);
  started = false;
  currentStep = 0;
  showSummary = false;

  profile: FinancialProfile = this.readProfile();

  readonly goals = ['Organizar minhas finanças', 'Quitar dívidas', 'Criar uma reserva', 'Investir'];

  readonly incomeSources = ['Salário', 'Autônomo', 'Empreendedor', 'Aposentadoria', 'Outra'];

  readonly incomeFrequencies = [
    'Diariamente',
    'Semanalmente',
    'Quinzenalmente',
    'Mensalmente',
    'Eventualmente',
  ];

  readonly incomeTypes = ['Fixa', 'Variável', 'Fixa e variável'];

  readonly debtAnswers: Array<'Sim' | 'Não'> = ['Sim', 'Não'];

  readonly debtTypes: DebtType[] = [
    'Cartão de crédito',
    'Empréstimo',
    'Financiamento',
    'Cheque especial',
    'Outra',
  ];

  readonly emergencyFundAnswers: Array<'Sim' | 'Não'> = ['Sim', 'Não'];

  readonly concerns = [
    'Controlar gastos',
    'Quitar dívidas',
    'Aumentar minha renda',
    'Começar a investir',
  ];

  constructor(private readonly router: Router) {}

  get steps(): Question[] {
    const baseSteps: Question[] = [
      'goal',
      'incomeSource',
      'incomeFrequency',
      'incomeAmount',
      'incomeType',
      'hasDebt',
    ];

    if (this.profile.hasDebt === 'Sim') {
      baseSteps.push('debtTypes', 'debtAmount');
    }

    baseSteps.push('hasEmergencyFund', 'concern');

    return baseSteps;
  }

  get currentQuestion(): Question {
    return this.steps[this.currentStep];
  }

  get progress(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  get recommendation(): string {
    if (this.profile.hasDebt === 'Sim') {
      return 'a organização das dívidas e a criação de um plano de pagamento';
    }

    if (this.profile.goal === 'Criar uma reserva') {
      return 'a criação da sua reserva de emergência';
    }

    if (this.profile.goal === 'Investir') {
      return 'a organização financeira antes dos seus primeiros investimentos';
    }

    return 'o controle dos seus gastos e hábitos financeiros';
  }

  start(): void {
    this.started = true;
  }

  selectAnswer(field: AnswerField, value: string): void {
    if (field === 'hasDebt') {
      this.profile.hasDebt = value as 'Sim' | 'Não';

      if (value === 'Não') {
        this.profile.debtTypes = [];
        this.profile.debtAmount = '';
      }

      return;
    }

    if (field === 'hasEmergencyFund') {
      this.profile.hasEmergencyFund = value as 'Sim' | 'Não';
      return;
    }

    this.profile[field] = value;
  }

  toggleDebtType(type: DebtType): void {
    if (this.profile.debtTypes.includes(type)) {
      this.profile.debtTypes = this.profile.debtTypes.filter((debt) => debt !== type);
      return;
    }

    this.profile.debtTypes = [...this.profile.debtTypes, type];
  }

  updateDebtAmount(event: Event): void {
    this.profile.debtAmount = (event.target as HTMLInputElement).value;
  }

  isSelected(field: AnswerField, value: string): boolean {
    return this.profile[field] === value;
  }

  canContinue(): boolean {
    switch (this.currentQuestion) {
      case 'goal':
        return !!this.profile.goal;

      case 'incomeSource':
        return !!this.profile.incomeSource;

      case 'incomeFrequency':
        return !!this.profile.incomeFrequency;

      case 'incomeAmount':
        return this.parseAmount(this.profile.incomeAmount) > 0;

      case 'incomeType':
        return !!this.profile.incomeType;

      case 'hasDebt':
        return !!this.profile.hasDebt;

      case 'debtTypes':
        return this.profile.debtTypes.length > 0;

      case 'debtAmount':
        return !!this.profile.debtAmount.trim();

      case 'hasEmergencyFund':
        return !!this.profile.hasEmergencyFund;

      case 'concern':
        return !!this.profile.concern;
    }
  }

  next(): void {
    if (!this.canContinue()) return;

    if (this.currentStep === this.steps.length - 1) {
      this.showSummary = true;
      return;
    }

    this.currentStep++;
  }

  previous(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  finish(): void {
    // ✅ Salva profile no serviço (atualiza signal)
    // ✅ Dashboard é notificado via effect() e recalcula profileSummary
    // ✅ localStorage é atualizado automaticamente
    // Fluxo: Onboarding.finish() → ProfileService.save() → effect() no Dashboard → Sincronização completa
    this.profileService.save(this.profile);
    this.router.navigate(['/dashboard']);
  }

  private readProfile(): FinancialProfile {
    return {
      ...this.profileService.profile(),
      debtTypes: [...this.profileService.profile().debtTypes],
    };
  }

  private parseAmount(value: string): number {
    return (
      Number(
        value
          .replace(/\./g, '')
          .replace(',', '.')
          .replace(/[^\d.-]/g, ''),
      ) || 0
    );
  }
}
