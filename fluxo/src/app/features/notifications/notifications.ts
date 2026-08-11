import { Component } from '@angular/core';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { EmptyState as DsEmptyState } from '../../shared/components/design-system/empty-state/empty-state';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [DsCard, DsEmptyState],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Notificações</p>
          <h2 class="page-title">Alertas, pendências e eventos importantes</h2>
          <p class="page-copy">
            Aqui entram lembretes de fatura, metas, limites de orçamento e
            alertas de segurança.
          </p>
        </div>
      </header>

      <section class="page-grid">
        <ds-card eyebrow="Recentes" title="Últimos avisos" subtitle="Modelo de feed para notificações futuras.">
          <div class="progress-list">
            <div class="progress-item">
              <div class="progress-top"><span>Fatura vence em 8 dias</span><span>Agora</span></div>
              <p class="page-copy">Sua fatura atual está próxima do vencimento.</p>
            </div>
            <div class="progress-item">
              <div class="progress-top"><span>Meta batida</span><span>Hoje</span></div>
              <p class="page-copy">A reserva de emergência atingiu 80% do objetivo.</p>
            </div>
          </div>
        </ds-card>

        <ds-empty-state
          title="Sem alertas críticos"
          description="Se nada exigir atenção, esta área mostra apenas o resumo dos avisos recentes."
        />
      </section>
    </section>
  `
})
export class Notifications {}
