import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
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

  protected readonly cashBreakdown = [
    { name: 'Alimentação', value: 3210.5, percentage: 30, color: '#3ecf8e' },
    { name: 'Transporte', value: 1802.1, percentage: 15, color: '#f7b948' },
    { name: 'Lazer', value: 1390.4, percentage: 10, color: '#60a5fa' },
    { name: 'Saúde', value: 1041.0, percentage: 12, color: '#a78bfa' },
    { name: 'Moradia', value: 2123.5, percentage: 25, color: '#2dd4bf' },
    { name: 'Educação', value: 792.3, percentage: 8, color: '#f97316' },
  ];

  protected readonly alerts = [
    {
      title: 'Contas a vencer',
      text: 'Sua taxa do cartão vence em 2 dias. Acompanhe o saldo para não ultrapassar o limite.',
    },
    {
      title: 'Caixinha',
      text: 'Você poupou 15% da sua meta este mês. Continue assim para fechar o objetivo do trimestre.',
    },
    {
      title: 'Conquistas',
      text: 'Você reduziu suas despesas fixas em 12% nos últimos 30 dias.',
    },
  ];

  protected goToTransactions(): void {
    void this.router.navigateByUrl('/transacoes');
  }
}
