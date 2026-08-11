import { Component } from '@angular/core';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { Table as DsTable } from '../../shared/components/design-system/table/table';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [DsCard, DsTable],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Transações</p>
          <h2 class="page-title">Movimentações recentes e recorrentes</h2>
          <p class="page-copy">
            A próxima etapa conecta esta visão com filtros, paginação e dados
            reais vindos da API.
          </p>
        </div>
      </header>

      <section class="page-grid">
        <ds-card eyebrow="Tabela" title="Extrato recente" subtitle="Estrutura pronta para consumo dinâmico.">
          <ds-table
            [columns]="['Data', 'Descrição', 'Categoria', 'Valor']"
            [rows]="[
              ['11 Ago', 'Mercado Central', 'Alimentação', '- R$ 182,40'],
              ['10 Ago', 'Uber', 'Transporte', '- R$ 24,90'],
              ['10 Ago', 'Salário', 'Receita', '+ R$ 6.500,00'],
              ['09 Ago', 'Assinatura', 'Software', '- R$ 89,90']
            ]"
          />
        </ds-card>

        <ds-card eyebrow="Filtros" title="Leituras rápidas" subtitle="Card pronto para busca e segmentação.">
          <div class="tag-row">
            <span class="tag">Entrada</span>
            <span class="tag">Saída</span>
            <span class="tag">Cartão</span>
            <span class="tag">Pix</span>
          </div>
        </ds-card>
      </section>
    </section>
  `
})
export class Transactions {}
