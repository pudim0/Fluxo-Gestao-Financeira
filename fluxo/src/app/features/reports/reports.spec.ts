import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { Reports } from './reports';

describe('Relatórios', () => {
  let component: Reports;
  let transactions: any;

  beforeEach(async () => {
    transactions = { transactions: signal<Transaction[]>([]), load: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [{ provide: TransactionsService, useValue: transactions }],
    }).compileComponents();
    component = TestBed.createComponent(Reports).componentInstance;
  });

  it('cria seis linhas mensais e trata dados de despesas vazios', () => {
    const instance = component as any;
    expect(instance.monthlyData()).toHaveLength(6);
    expect(instance.monthlyRows()).toHaveLength(6);
    expect(instance.categoryRows()).toEqual([]);
    expect(instance.balanceRows()[5].accumulated).toBe(0);
  });

  it('agrupa despesas por categoria e calcula saldos mensais', () => {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    transactions.transactions.set([
      { id: '1', description: 'Salário', amount: 3000, type: 'income', category: 'Renda', date: `${month}-02`, account: 'Conta' },
      { id: '2', description: 'Casa', amount: 500, type: 'expense', category: 'Moradia', date: `${month}-03`, account: 'Conta' },
      { id: '3', description: 'Mercado', amount: 250, type: 'expense', category: 'Mercado', date: `${month}-04`, account: 'Conta' },
    ]);
    const instance = component as any;
    expect(instance.categoryRows()[0]).toEqual({ category: 'Moradia', amount: 500, percentage: 67 });
    const current = instance.monthlyData().find((row: any) => row.key === month);
    expect(current.income).toBe(3000);
    expect(current.expense).toBe(750);
    expect(current.balance).toBe(2250);
  });
});