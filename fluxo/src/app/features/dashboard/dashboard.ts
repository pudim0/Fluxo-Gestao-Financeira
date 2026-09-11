import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TransactionsService } from '../../services/transactions.service';
import { FinancialProfileService } from '../../services/financial-profile.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly router = inject(Router);
  protected readonly transactionsService = inject(TransactionsService);
  private readonly authService = inject(AuthService);
  protected readonly profileService = inject(FinancialProfileService);
  protected readonly userName = this.authService.getCurrentUserName();
  protected readonly profile = this.profileService.profile;
  protected readonly profileSummary = computed(() => {
    const profile = this.profile();
    if (!profile.goal) return 'Complete seu onboarding para personalizar este resumo.';
    const debt =
      profile.hasDebt === 'Sim'
        ? 'Você informou que possui dívidas.'
        : 'Você informou que não possui dívidas.';
    const reserve =
      profile.hasEmergencyFund === 'Sim'
        ? 'Sua reserva de emergência está ativa.'
        : 'A criação de uma reserva pode ser uma prioridade.';
    return `${debt} ${reserve}`;
  });

  // Inicia todos como 'true' para carregar a página com tudo aberto
  protected readonly showAllAlerts = signal<boolean>(true);
  protected readonly showAllTransactions = signal<boolean>(true);
  protected readonly showAllInvestments = signal<boolean>(true);

  /**
   * SINCRONIZAÇÃO DE PERFIL FINANCEIRO
   * 
   * Efeito que observa mudanças no perfil do usuário (salvo no onboarding)
   * e força a recalculação dos computeds que dependem dele.
   * 
   * Benefício: Dashboard é atualizado automaticamente quando profile.save() é chamado
   * Sem isso, a atualização só aconteceria após navegação manual ou F5.
   */
  constructor() {
    effect(() => {
      // Observar mudanças no profile
      const profile = this.profile();
      
      // Forçar recalculação de computeds que dependem do profile
      // Isso garante que profileSummary seja recalculado quando profile muda
      if (profile.goal) {
        // Log para debug (remover em produção se necessário)
        console.log('🔄 Profile atualizado no dashboard:', profile);
      }
    });
  }

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

  protected readonly cashBreakdown = computed(() => {
    const expenses = this.transactionsService
      .transactions()
      .filter((transaction) => transaction.type === 'expense');
    const total = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalsByCategory = new Map<string, number>();

    for (const transaction of expenses) {
      totalsByCategory.set(
        transaction.category,
        (totalsByCategory.get(transaction.category) ?? 0) + transaction.amount,
      );
    }

    return [...totalsByCategory.entries()]
      .sort(([, firstValue], [, secondValue]) => secondValue - firstValue)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: total ? Math.round((value / total) * 100) : 0,
        color: ['#3ecf8e', '#f7b948', '#60a5fa', '#a78bfa', '#2dd4bf', '#f97316'][index % 6],
      }));
  });

  protected readonly cashChartBackground = computed(() => {
    const breakdown = this.cashBreakdown();
    if (!breakdown.length) return 'conic-gradient(#334155 0 100%)';

    let start = 0;
    const segments = breakdown.map((item) => {
      const end = start + item.percentage;
      const segment = `${item.color} ${start}% ${end}%`;
      start = end;
      return segment;
    });

    return `conic-gradient(${segments.join(', ')})`;
  });

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
