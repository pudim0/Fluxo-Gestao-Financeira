import { Component } from '@angular/core';
import { Card as DsCard } from '../../shared/components/design-system/card/card';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [DsCard],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Metas</p>
          <h2 class="page-title">Objetivos com progresso visível</h2>
          <p class="page-copy">
            O usuário acompanha metas de curto e longo prazo com barras de progresso e feedback
            claro.
          </p>
        </div>
      </header>

      <section class="page-grid page-grid--single">
        <ds-card
          eyebrow="Progresso"
          title="Metas prioritárias"
          subtitle="Base inicial para metas reais."
        >
          <div class="progress-list">
            <div class="progress-item">
              <div class="progress-top"><span>Reserva de emergência</span><span>80%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 80%"></div></div>
            </div>
            <div class="progress-item">
              <div class="progress-top"><span>Viagem Europa</span><span>30%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 30%"></div></div>
            </div>
            <div class="progress-item">
              <div class="progress-top"><span>Troca de carro</span><span>63%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 63%"></div></div>
            </div>
          </div>
        </ds-card>
      </section>
    </section>
  `,
})
export class Goals {}
