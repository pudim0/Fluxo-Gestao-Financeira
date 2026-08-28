import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { TransactionsService } from '../../services/transactions.service';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { Table as DsTable } from '../../shared/components/design-system/table/table';

interface MonthlySummary {
  key: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CurrencyPipe, DsCard, DsTable],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Relatórios</p>
          <h2 class="page-title">Análises, tendências e leitura executiva</h2>
          <p class="page-copy">Compare receitas, despesas, categorias e evolução do saldo.</p>
        </div>
      </header>

      <section class="page-grid">
        <ds-card
          eyebrow="Comparativo"
          title="Resumo mensal"
          subtitle="Dados calculados a partir das suas transações."
        >
          <ds-table [columns]="['Mês', 'Receitas', 'Despesas', 'Saldo']" [rows]="monthlyRows()" />
        </ds-card>

        <ds-card
          eyebrow="Categorias"
          title="Distribuição das despesas"
          subtitle="Categorias com maior impacto no período."
        >
          @if (categoryRows().length) {
            <div class="progress-list">
              @for (row of categoryRows(); track row.category) {
                <div class="progress-item">
                  <div class="progress-top">
                    <span>{{ row.category }}</span
                    ><strong>{{ row.percentage }}%</strong>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" [style.width.%]="row.percentage"></div>
                  </div>
                  <small>{{ row.amount | currency: 'BRL' }}</small>
                </div>
              }
            </div>
          } @else {
            <p class="page-copy">Ainda não há despesas registradas.</p>
          }
        </ds-card>
      </section>

      <ds-card
        eyebrow="Evolução"
        title="Saldo acumulado"
        subtitle="Resultado mensal e saldo acumulado ao longo dos últimos seis meses."
      >
        <div class="progress-list">
          @for (month of balanceRows(); track month.key) {
            <div class="progress-item">
              <div class="progress-top">
                <span>{{ month.label }}</span
                ><strong [class.expense-value]="month.balance < 0">{{
                  month.balance | currency: 'BRL'
                }}</strong>
              </div>
              <small>Acumulado: {{ month.accumulated | currency: 'BRL' }}</small>
            </div>
          }
        </div>
      </ds-card>
    </section>
  `,
})
export class Reports {
  private readonly transactionsService = inject(TransactionsService);

  protected readonly monthlyData = computed<MonthlySummary[]>(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1));
      const key = date.toISOString().slice(0, 7);
      const items = this.transactionsService
        .transactions()
        .filter((item) => item.date.startsWith(key));
      const income = items
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
      const expense = items
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
      return {
        key,
        label: date
          .toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' })
          .replace('.', ''),
        income,
        expense,
        balance: income - expense,
      };
    });
  });

  protected readonly monthlyRows = computed(() =>
    this.monthlyData().map((month) => [
      month.label,
      this.format(month.income),
      this.format(month.expense),
      this.format(month.balance),
    ]),
  );

  protected readonly categoryRows = computed(() => {
    const totals = new Map<string, number>();
    for (const item of this.transactionsService.transactions()) {
      if (item.type === 'expense')
        totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    }
    const total = [...totals.values()].reduce((sum, value) => sum + value, 0);
    return [...totals.entries()]
      .sort(([, first], [, second]) => second - first)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total ? Math.round((amount / total) * 100) : 0,
      }));
  });

  protected readonly balanceRows = computed(() => {
    let accumulated = 0;
    return this.monthlyData().map((month) => {
      accumulated += month.balance;
      return { ...month, accumulated };
    });
  });

  constructor() {
    this.transactionsService.load();
  }

  private format(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
