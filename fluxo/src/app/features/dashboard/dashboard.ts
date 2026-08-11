import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { EmptyState as DsEmptyState } from '../../shared/components/design-system/empty-state/empty-state';
import { LoadingState as DsLoadingState } from '../../shared/components/design-system/loading-state/loading-state';
import { Table as DsTable } from '../../shared/components/design-system/table/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DsCard, DsEmptyState, DsLoadingState, DsTable],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Dashboard</p>
          <h2 class="page-title">Resumo financeiro central</h2>
          <p class="page-copy">
            Esta tela concentra os indicadores principais, o histórico recente e
            as áreas que alimentam decisões rápidas.
          </p>
        </div>

        <div class="page-actions">
          <a class="secondary-button" routerLink="/transacoes">Ver transações</a>
          <a class="primary-button" routerLink="/orcamento">Ajustar orçamento</a>
        </div>
      </header>

      <section class="page-grid">
        <ds-card eyebrow="Indicadores" title="Saúde financeira" subtitle="Resumo do ciclo atual">
          <div class="tag-row">
            <span class="tag">Saldo R$ 15.430</span>
            <span class="tag">Receitas R$ 8.250</span>
            <span class="tag">Despesas R$ 4.920</span>
            <span class="tag">Meta 78%</span>
          </div>
        </ds-card>

        <ds-card eyebrow="Movimento" title="Últimas transações" subtitle="Base para a lista detalhada da área financeira">
          <ds-table
            [columns]="['Data', 'Descrição', 'Categoria', 'Valor']"
            [rows]="[
              ['11 Ago', 'Mercado Central', 'Alimentação', '- R$ 182,40'],
              ['10 Ago', 'Salário', 'Receita', '+ R$ 6.500,00'],
              ['09 Ago', 'Assinatura', 'Software', '- R$ 89,90']
            ]"
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
    </section>
  `
})
export class Dashboard {}
