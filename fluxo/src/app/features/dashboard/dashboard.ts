import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { EmptyState as DsEmptyState } from '../../shared/components/design-system/empty-state/empty-state';
import { LoadingState as DsLoadingState } from '../../shared/components/design-system/loading-state/loading-state';
import { Table as DsTable } from '../../shared/components/design-system/table/table';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, RouterLink, DsCard, DsEmptyState, DsLoadingState, DsTable],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Dashboard</p>
          <h2 class="page-title">{{ (summary$ | async)?.title ?? 'Resumo financeiro central' }}</h2>
          <p class="page-copy">
            {{
              (summary$ | async)?.copy ??
                'Esta tela concentra os indicadores principais, o histórico recente e as áreas que alimentam decisões rápidas.'
            }}
          </p>
        </div>

        <div class="page-actions">
          <a class="secondary-button" routerLink="/transacoes">Ver transações</a>
          <a class="primary-button" routerLink="/orcamento">Ajustar orçamento</a>
        </div>
      </header>

      @if (summary$ | async; as summary) {
        <section class="metrics-grid">
          @for (metric of summary.metrics; track metric.label) {
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
          <ds-card eyebrow="Indicadores" title="Saúde financeira" subtitle="Resumo do ciclo atual">
            <div class="tag-row">
              @for (highlight of summary.highlights; track highlight) {
                <span class="tag">{{ highlight }}</span>
              }
            </div>
          </ds-card>

          <ds-card
            eyebrow="Movimento"
            title="Últimas transações"
            subtitle="Base para a lista detalhada da área financeira"
          >
            <ds-table
              [columns]="['Data', 'Descrição', 'Categoria', 'Valor']"
              [rows]="summary.transactions"
            />
          </ds-card>
        </section>

        <section class="page-grid">
          <ds-empty-state
            title="Nenhum relatório conectado"
            description="Os gráficos e análises avançadas entram nas próximas etapas do roadmap."
          />

          <ds-loading-state
            label="Carregando indicadores"
            detail="A estrutura já está pronta para integrar dados reais quando a API entrar."
          />
        </section>
      } @else {
        <ds-loading-state
          label="Carregando dados do dashboard"
          detail="Buscando o resumo financeiro publicado em /api/dashboard-summary.json."
        />
      }
    </section>
  `,
})
export class Dashboard {
  private readonly apiService = inject(ApiService);

  protected readonly summary$ = this.apiService.getDashboardSummary();
}
