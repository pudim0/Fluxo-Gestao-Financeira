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
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Dashboard</p>
          <h2 class="page-title">Resumo financeiro central</h2>
          <p class="page-copy">
            Acompanhe o que entrou, saiu e precisa da sua atenção neste ciclo financeiro.
          </p>
        </div>

        <div class="page-actions">
          <a class="secondary-button" routerLink="/transacoes">Ver transações</a>
          <a class="primary-button" routerLink="/orcamento">Ajustar orçamento</a>
        </div>
      </header>

      @if (transactionsService.isLoading()) {
        <ds-loading-state
          label="Carregando indicadores"
          detail="Calculando o resumo a partir das suas transações."
        />
      } @else if (transactionsService.hasError()) {
        <section class="state-card" role="alert">
          <strong>Não foi possível carregar os indicadores.</strong>
          <p>Verifique os dados e tente novamente.</p>
          <button class="secondary-button" type="button" (click)="transactionsService.load()">
            Tentar novamente
          </button>
        </section>
      } @else if (transactionsService.isEmpty()) {
        <ds-empty-state
          title="Comece registrando uma transação"
          description="Quando você adicionar receitas e despesas, o resumo financeiro aparecerá aqui."
          actionLabel="Adicionar transação"
          (action)="goToTransactions()"
        />
      } @else {
        <section class="metrics-grid">
          @for (metric of metrics(); track metric.label) {
            <article
              class="metric-card"
              [class.positive]="metric.tone === 'positive'"
              [class.warning]="metric.tone === 'warning'"
            >
              <span class="metric-label">{{ metric.label }}</span>
              <span class="metric-value">{{ metric.value }}</span>
              <span class="metric-detail">{{ metric.detail }}</span>
            </article>
          }
        </section>

        <section class="page-grid">
          <ds-card eyebrow="Indicadores" title="Saúde financeira" subtitle="Resumo calculado do histórico">
            <div class="tag-row">
              @for (highlight of highlights(); track highlight) {
                <span class="tag">{{ highlight }}</span>
              }
            </div>
          </ds-card>

          <ds-card eyebrow="Movimento" title="Últimas transações" subtitle="As cinco movimentações mais recentes">
            <div class="transaction-preview">
              @for (transaction of recentTransactions(); track transaction.id) {
                <div class="transaction-preview__row">
                  <span>
                    <strong>{{ transaction.description }}</strong>
                    <small>{{ transaction.category }} · {{ transaction.date | date: 'dd/MM' }}</small>
                  </span>
                  <strong
                    [class.income-value]="transaction.type === 'income'"
                    [class.expense-value]="transaction.type === 'expense'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}
                    {{ transaction.amount | currency: 'BRL' }}
                  </strong>
                </div>
              }
            </div>
          </ds-card>
        </section>

        <section class="page-grid">
          <ds-empty-state
            title="Relatórios em preparação"
            description="Em breve você poderá comparar períodos e entender a evolução do seu dinheiro."
          />
        </section>
      }
    </section>
  `,
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
