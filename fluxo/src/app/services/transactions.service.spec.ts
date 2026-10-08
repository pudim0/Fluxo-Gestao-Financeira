import { TestBed } from '@angular/core/testing';

import { NewTransaction } from '../models/transaction.model';
import { MockTransactionRepository } from '../repositories/mock-transaction.repository';
import { TRANSACTION_REPOSITORY } from '../repositories/transaction.repository';
import { TransactionsService } from './transactions.service';

const seededTransactions = [
  { id: 'tx-1', description: 'Mercado Central', amount: 182.4, type: 'expense', category: 'Alimentação', date: '2026-08-11', account: 'Conta principal' },
  { id: 'tx-2', description: 'Salário', amount: 6500, type: 'income', category: 'Receita', date: '2026-08-10', account: 'Conta principal' },
  { id: 'tx-3', description: 'Assinatura', amount: 89.9, type: 'expense', category: 'Software', date: '2026-08-09', account: 'Cartão principal' },
  { id: 'tx-4', description: 'Uber', amount: 24.9, type: 'expense', category: 'Transporte', date: '2026-08-10', account: 'Conta principal' },
];

describe('Serviço de transações', () => {
  let service: TransactionsService;

  beforeEach(() => {
    localStorage.setItem('fluxo.mock.transactions:anonymous', JSON.stringify(seededTransactions));
    TestBed.configureTestingModule({
      providers: [
        TransactionsService,
        { provide: TRANSACTION_REPOSITORY, useClass: MockTransactionRepository },
      ],
    });
    service = TestBed.inject(TransactionsService);
  });

  it('calcula métricas financeiras a partir das transações do repositório', () => {
    expect(service.transactions()).toHaveLength(4);
    expect(service.totalIncome()).toBe(6500);
    expect(service.totalExpense()).toBeCloseTo(297.2);
    expect(service.balance()).toBeCloseTo(6202.8);
    expect(service.isLoading()).toBe(false);
    expect(service.hasError()).toBe(false);
  });

  it('cria, atualiza e exclui transações no estado compartilhado', () => {
    const transaction: NewTransaction = {
      description: 'Freelance',
      amount: 1000,
      type: 'income',
      category: 'Receita extra',
      date: '2026-08-12',
      account: 'Conta principal',
    };

    service.create(transaction);
    expect(service.totalIncome()).toBe(7500);
    expect(service.transactions()[0].description).toBe('Freelance');

    const created = service.transactions()[0];
    service.update(created.id, { ...transaction, description: 'Freelance atualizado' });
    expect(service.transactions()[0].description).toBe('Freelance atualizado');

    service.delete(created.id);
    expect(service.transactions()).toHaveLength(4);
    expect(service.totalIncome()).toBe(6500);
  });

  it('reutiliza uma categoria existente quando só mudam maiúsculas, acentos ou espaços', () => {
    const duplicatedCategoryTransaction: NewTransaction = {
      description: 'Mercado bairro',
      amount: 152.3,
      type: 'expense',
      category: '  alimentacao  ',
      date: '2026-08-14',
      account: 'Conta principal',
    };

    service.create(duplicatedCategoryTransaction);

    const created = service.transactions().find((item) => item.description === 'Mercado bairro');
    expect(created).toBeTruthy();
    expect(created?.category).toBe('Alimentação');

    const normalizedCategories = service.categories().map((category) => category.toLowerCase());
    expect(normalizedCategories.filter((category) => category === 'alimentação')).toHaveLength(1);
  });
});
