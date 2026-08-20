import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { NewTransaction, Transaction } from '../models/transaction.model';

export interface TransactionRepository {
  list(): Observable<Transaction[]>;
  create(transaction: NewTransaction): Observable<Transaction>;
  update(id: string, transaction: NewTransaction): Observable<Transaction>;
  delete(id: string): Observable<void>;
}

export const TRANSACTION_REPOSITORY = new InjectionToken<TransactionRepository>(
  'TRANSACTION_REPOSITORY',
);
