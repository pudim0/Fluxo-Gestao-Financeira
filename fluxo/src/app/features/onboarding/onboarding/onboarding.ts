import {CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

type DebtType = 
'credit-card' | 'loan' | 'financing' | 'other';

interface FinancialProfile {
  goal: string;
  incomeSource: string;
  incomeFrequency: string;
  incomeTypes: string[];
  hasDebt: boolean;
  debtType: DebtType[]
  debtAmount: number;
  hasEmergencyFund: boolean;
  concern: string;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class Onboarding {
  started = false;
  currentStep = 0;
  showSummary = false;

  profile: FinancialProfile = {
    goal: '',
    incomeSource: '',
    incomeFrequency: '',
    incomeTypes: [],
    hasDebt: false,
    debtType: [],
    debtAmount: 0,
    hasEmergencyFund: false,
    concern: ''
  };

  goals = [
    'Organizar minhas finanças',
    'Economizar dinheiro',
    'Sair das dívidas',
    'Criar uma reserva',
    'Começar a investir',
    'Entender para onde meu dinheiro está indo',
  ];

  incomeSources = [
    'Salário',
    'Trabalho autônomo/Freelance',
    'Bolsa ou auxílio',
    'Renda de investimentos',
    'Outro',
    'Ainda não tenho renda'
  ];

  incomeFrequencies = [
    'Diária',
    'Semanal',
    'Quinzenal',
    'Mensal',
    'Não tenho renda fixa'
  ];

  incomeTypes = ['Fixa', 'Variável', 'Uma combinação de fixa e variável'];
  
  hasDebtOptions = ['Sim', 'Não'] as const;

  debtTypes: DebtType[] = ['credit-card', 'loan', 'financing', 'other'];

emergencyFundOptions = ['Sim', 'Não'] as const;

  concerns = [
    'Não consigo economizar dinheiro',
    'Tenho dificuldade em controlar meus gastos',
    'Não sei como investir meu dinheiro',
    'Tenho dívidas e não sei como sair delas',
    'Não tenho uma reserva de emergência',
    'Quero melhorar minha educação financeira'
  ];

  constructor(private router: Router) {}

  get steps(): string[] {
    const baseSteps = [
      'Objetivo',
      'Renda',
      'Dívidas',
      'Reserva de Emergência',
      'Preocupações'
    ];
  if (this.profile.hasDebt === true) {
    baseSteps.push('Tipo de Dívida', 'Valor da Dívida');
  }

  baseSteps.push('hasEmergencyFund', 'concern');
  return baseSteps;
  }

  get currentQuestion(): string {
    return this.steps[this.currentStep];
  }

  get progress(): number {
    return (this.currentStep + 1) / this.steps.length * 100;
  }

  start() : void {
    this.started = true;
  }

  selectAnswer(field: keyof FinancialProfile, value: any): void {
    if (field === 'hasDebt' && value === false) {
      this.profile.debtType = [];
      this.profile.debtAmount = 0;
    }
    this.profile[field] = value as never;
  }
  toggleDebtType(debtType: DebtType): void {
    const selected = this.profile.debtType;
  
  if (selected.includes(type)) {
    this.profile.debtTypes = selected.filter((item) => item !== type);
    return
  }
  this.profile.debtType = [...selected, type];
  }
  isSelected(field:keyof FinancialProfile, value: string): boolean {
    return this.profile[field] === value;
  }

  canContinue(): boolean {
    switch (this.currentQuestion) {
      case 'Objetivo':
        return this.profile.goal !== '';
      case 'Renda':
        return this.profile.incomeSource !== '' && this.profile.incomeFrequency !== '';
      case 'Dívidas':
        return this.profile.hasDebt !== undefined;
      case 'Tipo de Dívida':
        return this.profile.debtType.length > 0;
      case 'Valor da Dívida':
        return this.profile.debtAmount > 0;
      case 'Reserva de Emergência':
        return this.profile.hasEmergencyFund !== undefined;
      case 'Preocupações':
        return this.profile.concern !== '';
      default:
        return true;
    }
  }
  
  next(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.showSummary = true;
    }
  }

previous(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  finish(): void {
    localStorage.setItem('financialProfile', JSON.stringify(this.profile));
    this.router.navigate(['/dashboard']);
  }

  get recommendation(): string {
    if (this.profile.goal === 'Sair das dívidas' || this.profile.hasDebt === true) {
      return 'organização das dívidas, vencimentos e criação de um plano de pagamento';
    }

    if (this.profile.goal === 'Criar uma reserva') {
      return 'controle de gastos e construção da sua reserva de emergência';
    }

    if (this.profile.goal === 'Começar a investir') {
      return 'organização financeira e preparação para os seus primeiros investimentos';
    }

    return 'controle de gastos e construção de hábitos financeiros saudáveis';
  }
}