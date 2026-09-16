import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { Budget } from './budget';

describe('Budget', () => {
  let component: Budget;
  let transactions: any;
  const expense: Transaction = {
    id: '1', description: 'Aluguel', amount: 1200, type: 'expense',
    category: 'Moradia', date: '2026-09-05', account: 'Conta principal',
  };

  beforeEach(async () => {
    localStorage.clear();
    transactions = { transactions: signal<Transaction[]>([expense]), load: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Budget],
      providers: [
        { provide: AuthService, useValue: { getCurrentUserEmail: () => 'user@example.com' } },
        { provide: TransactionsService, useValue: transactions },
      ],
    }).compileComponents();
    component = TestBed.createComponent(Budget).componentInstance;
  });

  it('derives categories, monthly expenses and remaining budget', () => {
    const instance = component as any;
    instance.selectedMonth.set('2026-09');
    expect(instance.categories()).toEqual(['Moradia']);
    expect(instance.monthExpense()).toBe(1200);
    expect(instance.remaining()).toBe(-1200);
    expect(instance.rows()).toEqual([]);
  });

  it('handles empty transaction lists and saves a new valid limit', () => {
    const instance = component as any;
    transactions.transactions.set([]);
    expect(instance.categories()).toEqual([]);
    instance.openForm();
    instance.form = { category: 'Moradia', amount: 1500 };
    instance.save();
    expect(instance.feedback()).toContain('informe uma categoria');
    transactions.transactions.set([expense]);
    instance.save();
    expect(instance.feedback()).toContain('Moradia salvo');
    expect(instance.limits()).toEqual([{ category: 'Moradia', amount: 1500 }]);
    expect(JSON.parse(localStorage.getItem('fluxo.budgets:user@example.com')!)).toHaveLength(1);
  });

  it('rejects invalid limits, edits existing ones and removes them', () => {
    const instance = component as any;
    instance.openForm();
    instance.save();
    expect(instance.feedback()).toContain('informe uma categoria');
    instance.form = { category: 'Moradia', amount: -1 };
    instance.save();
    expect(instance.feedback()).toContain('maior que zero');

    instance.form = { category: 'Moradia', amount: 1000 };
    instance.save();
    instance.edit(instance.rows()[0]);
    instance.form.amount = 1300;
    instance.save();
    expect(instance.limits()[0].amount).toBe(1300);

    instance.remove('Moradia');
    expect(instance.limits()).toEqual([]);
    instance.remove('Inexistente');
    expect(instance.feedback()).toContain('Nenhum limite');
  });

  it('marks over-limit categories as alerts', () => {
    const instance = component as any;
    instance.limitsState.set([{ category: 'Moradia', amount: 500 }]);
    expect(instance.rows()[0].isOverLimit).toBe(true);
    expect(instance.alerts()).toHaveLength(1);
  });
});