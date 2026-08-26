export type DebtType =
  | 'Cartão de crédito'
  | 'Empréstimo'
  | 'Financiamento'
  | 'Cheque especial'
  | 'Outra';

export interface FinancialProfile {
  goal: string;
  incomeSource: string;
  incomeFrequency: string;
  incomeAmount: string;
  incomeType: string;
  hasDebt: 'Sim' | 'Não' | '';
  debtTypes: DebtType[];
  debtAmount: string;
  hasEmergencyFund: 'Sim' | 'Não' | '';
  concern: string;
}