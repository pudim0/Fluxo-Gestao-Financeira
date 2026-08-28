import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthService } from '../core/services/auth.service';
import { NewTransaction, Transaction } from '../models/transaction.model';
import { FinancialProfile } from '../models/financial-profile.model';
import { TransactionRepository } from './transaction.repository';

const TRANSACTIONS_STORAGE_PREFIX = 'fluxo.mock.transactions:';

@Injectable()
export class MockTransactionRepository implements TransactionRepository {
  private readonly authService = inject(AuthService);
  private readonly transactionsByUser = new Map<string, Transaction[]>();
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
  list(): Observable<Transaction[]> {
    return of(this.getTransactions().map((transaction) => ({ ...transaction })));
  }

  create(transaction: NewTransaction): Observable<Transaction> {
    const created = { ...transaction, id: crypto.randomUUID() };
    this.transactionsByUser.set(this.getUserKey(), [created, ...this.getTransactions()]);
    this.persist();
    return of({ ...created });
  }

  update(id: string, transaction: NewTransaction): Observable<Transaction> {
    const updated = { ...transaction, id };
    this.transactionsByUser.set(
      this.getUserKey(),
      this.getTransactions().map((current) => (current.id === id ? updated : current)),
    );
    this.persist();
    return of({ ...updated });
  }

  delete(id: string): Observable<void> {
    this.transactionsByUser.set(
      this.getUserKey(),
      this.getTransactions().filter((transaction) => transaction.id !== id),
    );
    this.persist();
    return of(void 0);
  }

  private getTransactions(): Transaction[] {
    const stored = this.transactionsByUser.get(this.getUserKey());
    if (stored) {
      return stored;
    }

    const initialTransactions = this.readPersistedTransactions();
    this.transactionsByUser.set(this.getUserKey(), initialTransactions);
    return initialTransactions;
  }

  private readPersistedTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        return JSON.parse(stored) as Transaction[];
      }
    } catch {
      return this.defaultTransactions.map((transaction) => ({ ...transaction }));
    }

    return this.defaultTransactions.map((transaction) => ({
      ...transaction,
      ...(transaction.type === 'income' ? { amount: this.getInitialIncome() } : {}),
    }));
  }

  private persist(): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.getTransactions()));
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }

  private getStorageKey(): string {
    return `${TRANSACTIONS_STORAGE_PREFIX}${this.getUserKey()}`;
  }

  private getInitialIncome(): number {
    try {
      const storedProfile = localStorage.getItem(`fluxo.profile:${this.getUserKey()}`);
      const profile = storedProfile ? (JSON.parse(storedProfile) as FinancialProfile) : null;
      const amount = this.parseAmount(profile?.incomeAmount ?? '');

      if (!amount) return 6500;

      const multiplier =
        {
          Diariamente: 30,
          Semanalmente: 52 / 12,
          Quinzenalmente: 26 / 12,
          Mensalmente: 1,
          Eventualmente: 1,
        }[profile?.incomeFrequency ?? 'Mensalmente'] ?? 1;

      return Math.round(amount * multiplier * 100) / 100;
    } catch {
      return 6500;
    }
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

  private getUserKey(): string {
    return this.authService.getCurrentUserEmail() ?? 'anonymous';
  }
}
