import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';

import { NewTransaction, Transaction, TransactionType } from '../models/transaction.model';
import { TRANSACTION_REPOSITORY } from '../repositories/transaction.repository';

import { normalizeText } from '../utils/normalize-text';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly repository = inject(TRANSACTION_REPOSITORY);
  private readonly transactionState = signal<Transaction[]>([]);
  private readonly loadingState = signal(true);
  private readonly errorState = signal(false);

  readonly transactions = this.transactionState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly hasError = this.errorState.asReadonly();
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.hasError() && this.transactions().length === 0,
  );
  readonly categories = computed(() =>
    [...new Set(this.transactions().map((transaction) => transaction.category))].sort(),
  );
  readonly totalIncome = computed(() => this.sumByType('income'));
  readonly totalExpense = computed(() => this.sumByType('expense'));
  readonly balance = computed(() => this.totalIncome() - this.totalExpense());
  readonly metrics = computed(() => [
    {
      label: 'Saldo atual',
      value: currency.format(this.balance()),
      detail:
        this.balance() >= 0 ? 'Resultado acumulado no período' : 'Atenção ao resultado acumulado',
      tone: this.balance() >= 0 ? 'positive' : 'negative',
    },
    {
      label: 'Receitas',
      value: currency.format(this.totalIncome()),
      detail: 'Total de entradas registradas',
      tone: 'neutral',
    },
    {
      label: 'Despesas',
      value: currency.format(this.totalExpense()),
      detail: 'Total de saídas registradas',
      tone: 'warning',
    },
    {
      label: 'Transações',
      value: String(this.transactions().length),
      detail: 'Movimentações no histórico',
      tone: 'neutral',
    }
  ]);
  readonly highlights = computed(() => [
    `${this.transactions().length} movimentações`,
    `Entradas ${currency.format(this.totalIncome())}`,
    `Saídas ${currency.format(this.totalExpense())}`,
  ]);

  constructor() {
    this.load();
  }

  load(): void {
    this.loadingState.set(true);
    this.errorState.set(false);
    this.repository
      .list()
      .pipe(
        catchError(() => {
          this.errorState.set(true);
          return of([] as Transaction[]);
        }),
        finalize(() => this.loadingState.set(false)),
      )
      .subscribe((transactions) => {
        if (!this.hasError()) {
          this.transactionState.set(this.sortByDate(transactions));
        }
      });
  }

  create(transaction: NewTransaction): void {
    const normalizedCategory = transaction.category.trim();

    const existingCategory = this.findExistingCategory(normalizedCategory);

    const transactionToCreate: NewTransaction = {
      ...transaction,
      category: existingCategory ?? normalizedCategory,
    };

    this.repository.create(transactionToCreate).subscribe((created) => {
      this.transactionState.update((current) => this.sortByDate([created, ...current]));
    });
  }

  update(id: string, transaction: NewTransaction): void {
    const normalizedCategory = transaction.category.trim();

    const existingCategory = this.findExistingCategory(normalizedCategory);

    const transactionToUpdate: NewTransaction = {
      ...transaction,
      category: existingCategory ?? normalizedCategory,
    };

    this.repository.update(id, transactionToUpdate).subscribe((updated) => {
      this.transactionState.update((current) =>
        this.sortByDate(current.map((item) => (item.id === id ? updated : item))),
      );
    });
  }

  delete(id: string): void {
    this.repository.delete(id).subscribe(() => {
      this.transactionState.update((current) => current.filter((item) => item.id !== id));
    });
  }

  private sumByType(type: TransactionType): number {
    return this.transactions()
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  private sortByDate(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((first, second) => second.date.localeCompare(first.date));
  }

  private findExistingCategory(category: string): string | null {
    const normalizedCategory = normalizeText(category);

    const existingCategory = this.categories().find(
      (existing) => normalizeText(existing) === normalizedCategory,
    );

    return existingCategory ?? null;
  }
}
