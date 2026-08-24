import { TestBed } from '@angular/core/testing';

import { NewTransaction } from '../models/transaction.model';
import { MockTransactionRepository } from '../repositories/mock-transaction.repository';
import { TRANSACTION_REPOSITORY } from '../repositories/transaction.repository';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    localStorage.removeItem('fluxo.mock.transactions:anonymous');
    TestBed.configureTestingModule({
      providers: [
        TransactionsService,
        { provide: TRANSACTION_REPOSITORY, useClass: MockTransactionRepository },
      ],
    });
    service = TestBed.inject(TransactionsService);
  });

  it('derives financial metrics from the repository transactions', () => {
    expect(service.transactions()).toHaveLength(4);
    expect(service.totalIncome()).toBe(6500);
    expect(service.totalExpense()).toBeCloseTo(297.2);
    expect(service.balance()).toBeCloseTo(6202.8);
    expect(service.isLoading()).toBe(false);
    expect(service.hasError()).toBe(false);
  });

  it('creates, updates and deletes transactions in shared state', () => {
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

  it('reuses existing category when only casing, accents or spaces differ', () => {
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
