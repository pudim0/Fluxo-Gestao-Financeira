import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { EmptyState as DsEmptyState } from '../../shared/components/design-system/empty-state/empty-state';
import { LoadingState as DsLoadingState } from '../../shared/components/design-system/loading-state/loading-state';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, DsCard, DsEmptyState, DsLoadingState],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  private readonly router = inject(Router);
  protected readonly transactionsService = inject(TransactionsService);
  protected readonly metrics = computed(() => this.transactionsService.metrics());
  protected readonly highlights = computed(() => this.transactionsService.highlights());
  protected readonly recentTransactions = computed(() =>
    this.transactionsService.transactions().slice(0, 5),
  );

  protected goToTransactions(): void {
    void this.router.navigateByUrl('/transacoes');
  }
}
