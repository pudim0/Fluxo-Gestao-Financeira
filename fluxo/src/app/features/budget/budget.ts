import { Component } from '@angular/core';
import { Card as DsCard } from '../../shared/components/design-system/card/card';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [DsCard],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Orçamento</p>
          <h2 class="page-title">Categorias, limites e disciplina</h2>
          <p class="page-copy">
            Esta página será o ponto de controle dos tetos de gasto e da
            distribuição por categoria.
          </p>
        </div>
      </header>

      <section class="page-grid">
        <ds-card eyebrow="Categorias" title="Distribuição mensal" subtitle="Visão inicial dos limites por grupo.">
          <div class="progress-list">
            <div class="progress-item">
              <div class="progress-top"><span>Alimentação</span><span>72%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 72%"></div></div>
            </div>
            <div class="progress-item">
              <div class="progress-top"><span>Transporte</span><span>44%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 44%"></div></div>
            </div>
            <div class="progress-item">
              <div class="progress-top"><span>Assinaturas</span><span>81%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 81%"></div></div>
            </div>
          </div>
        </ds-card>

        <ds-card eyebrow="Ações" title="Ajustes rápidos" subtitle="Base para editar categoria, teto e recorrência.">
          <div class="tag-row">
            <span class="tag">Rebalancear</span>
            <span class="tag">Copiar do mês anterior</span>
            <span class="tag">Receber alerta</span>
          </div>
        </ds-card>
      </section>
    </section>
  `
})
export class Budget {}
