import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { NewTransaction, Transaction } from '../models/transaction.model';
import { TransactionRepository } from './transaction.repository';

const TRANSACTIONS_STORAGE_KEY = 'fluxo.mock.transactions';

@Injectable()
export class MockTransactionRepository implements TransactionRepository {
  private readonly defaultTransactions: Transaction[] = [
    {
      id: 'tx-1',
      description: 'Mercado Central',
      amount: 182.4,
      type: 'expense',
      category: 'Alimentação',
      date: '2026-08-11',
      account: 'Conta principal',
    },
    {
      id: 'tx-2',
      description: 'Salário',
      amount: 6500,
      type: 'income',
      category: 'Receita',
      date: '2026-08-10',
      account: 'Conta principal',
    },
    {
      id: 'tx-3',
      description: 'Assinatura',
      amount: 89.9,
      type: 'expense',
      category: 'Software',
      date: '2026-08-09',
      account: 'Cartão principal',
    },
    {
      id: 'tx-4',
      description: 'Uber',
      amount: 24.9,
      type: 'expense',
      category: 'Transporte',
      date: '2026-08-10',
      account: 'Conta principal',
    },
  ];
  private transactions: Transaction[] = this.readTransactions();

  list(): Observable<Transaction[]> {
    return of(this.transactions.map((transaction) => ({ ...transaction })));
  }

  create(transaction: NewTransaction): Observable<Transaction> {
    const created = { ...transaction, id: crypto.randomUUID() };
    this.transactions = [created, ...this.transactions];
    this.persist();
    return of({ ...created });
  }

  update(id: string, transaction: NewTransaction): Observable<Transaction> {
    const updated = { ...transaction, id };
    this.transactions = this.transactions.map((current) => (current.id === id ? updated : current));
    this.persist();
    return of({ ...updated });
  }

  delete(id: string): Observable<void> {
    this.transactions = this.transactions.filter((transaction) => transaction.id !== id);
    this.persist();
    return of(void 0);
  }

  private readTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Transaction[];
      }
    } catch {
      return this.defaultTransactions.map((transaction) => ({ ...transaction }));
    }

    return this.defaultTransactions.map((transaction) => ({ ...transaction }));
  }

  private persist(): void {
    try {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(this.transactions));
    } catch {}
  }
}
