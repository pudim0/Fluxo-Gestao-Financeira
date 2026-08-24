import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly router = inject(Router);
  protected readonly transactionsService = inject(TransactionsService);

  // Inicia todos como 'true' para carregar a página com tudo aberto
  protected readonly showAllAlerts = signal<boolean>(true);
  protected readonly showAllTransactions = signal<boolean>(true);
  protected readonly showAllInvestments = signal<boolean>(true);

  // Sinais vindos do serviço de transações
  protected readonly metrics = computed(() => this.transactionsService.metrics());
  protected readonly highlights = computed(() => this.transactionsService.highlights());
  protected readonly recentTransactions = computed(() =>
    this.transactionsService.transactions().slice(0, 3),
  );
  protected readonly latestAlerts = computed(() => {
    const transactions = this.transactionsService.transactions().slice(0, 3);
    return transactions.map((transaction) => ({
      id: transaction.id,
      label: transaction.description,
      detail: `${transaction.category} • ${transaction.amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`,
      route: '/notificacoes',
    }));
  });
  protected readonly chartData = computed(() => {
    const income = this.transactionsService.totalIncome();
    const expense = this.transactionsService.totalExpense();
    const maximum = Math.max(income, expense, 1);

    return [
      { label: 'Entradas', value: income, percentage: (income / maximum) * 100, tone: 'income' },
      { label: 'Saídas', value: expense, percentage: (expense / maximum) * 100, tone: 'expense' },
    ];
  });

  // Signal do fluxo de caixa
  protected readonly cashBreakdown = signal([
    { name: 'Alimentação', value: 3210.5, percentage: 30, color: '#3ecf8e' },
    { name: 'Transporte', value: 1802.1, percentage: 15, color: '#f7b948' },
    { name: 'Lazer', value: 1390.4, percentage: 10, color: '#60a5fa' },
    { name: 'Saúde', value: 1041.0, percentage: 12, color: '#a78bfa' },
    { name: 'Moradia', value: 2123.5, percentage: 25, color: '#2dd4bf' },
    { name: 'Educação', value: 792.3, percentage: 8, color: '#f97316' },
  ]);

  // Listas de dados
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

  protected readonly investmentCards = [
    {
      title: 'Patrimônio Total',
      highlight: '+8.4%',
      tone: 'positive' as const,
      value: 'R$ 32.450,00',
      type: 'bars' as const,
    },
    {
      title: 'Distribuição da Carteira',
      type: 'ring' as const,
      legend: ['Fundo A', 'Ações', 'Tesouro Direto'],
    },
    {
      title: 'Rentabilidade',
      type: 'list' as const,
      items: [
        { label: 'No mês', value: '+ R$ 450,00' },
        { label: 'No ano', value: '+ R$ 2.850,00' },
        { label: 'Desde o início', value: '+ R$ 6.250,00' },
      ],
    },
  ];

  // Exibe a lista inteira quando o signal for 'true' e apenas 1 item quando for 'false'
  protected readonly visibleAlerts = computed(() =>
    this.showAllAlerts() ? this.alerts : this.alerts.slice(0, 1),
  );

  protected readonly visibleTransactions = computed(() =>
    this.showAllTransactions() ? this.recentTransactions() : this.recentTransactions().slice(0, 1),
  );

  protected readonly visibleInvestments = computed(() =>
    this.showAllInvestments() ? this.investmentCards : this.investmentCards.slice(0, 1),
  );

  // Métodos para alternar os estados
  protected goToTransactions(): void {
    void this.router.navigateByUrl('/transacoes');
  }

  protected toggleAlerts(): void {
    this.showAllAlerts.update((value) => !value);
  }

  protected toggleTransactions(): void {
    this.showAllTransactions.update((value) => !value);
  }

  protected toggleInvestments(): void {
    this.showAllInvestments.update((value) => !value);
  }
}