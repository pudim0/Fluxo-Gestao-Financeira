import { Component } from '@angular/core';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { EmptyState as DsEmptyState } from '../../shared/components/design-system/empty-state/empty-state';
import { Table as DsTable } from '../../shared/components/design-system/table/table';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [DsCard, DsEmptyState, DsTable],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Relatórios</p>
          <h2 class="page-title">Análises, tendências e leitura executiva</h2>
          <p class="page-copy">
            O módulo receberá gráficos e comparativos. Nesta etapa, a estrutura
            de cards e tabelas já está no lugar.
          </p>
        </div>
      </header>

      <section class="page-grid">
        <ds-card eyebrow="Comparativo" title="Resumo mensal" subtitle="Base para evolução do consumo e receita.">
          <ds-table
            [columns]="['Mês', 'Receitas', 'Despesas', 'Saldo']"
            [rows]="[
              ['Jun', 'R$ 7.800', 'R$ 5.140', 'R$ 2.660'],
              ['Jul', 'R$ 8.250', 'R$ 4.920', 'R$ 3.330'],
              ['Ago', 'R$ 8.600', 'R$ 4.710', 'R$ 3.890']
            ]"
          />
        </ds-card>

        <ds-empty-state
          title="Gráficos em construção"
          description="O espaço já está reservado para linhas, barras e donuts na próxima etapa."
        />
      </section>
    </section>
  `
})
export class Reports {}
