import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { TranslatePipe } from '@ngx-translate/core';
import { Button as DsButton } from '../../shared/components/design-system/button/button';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [DsCard, DsButton, TranslatePipe],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
        </div>
        <div class="button-budget">
              <ds-button (click)="mostrarAbaBudget('categorias')" [class.selecionado]="abaAtivaBudget() === 'categorias'">
                {{ 'budget.categorias' | translate }}
              </ds-button>
              <ds-button (click)="mostrarAbaBudget('limites')" [class.selecionado]="abaAtivaBudget() === 'limites'">
                {{ 'budget.limites' | translate }}
              </ds-button>
              <ds-button (click)="mostrarAbaBudget('disciplina')" [class.selecionado]="abaAtivaBudget() === 'disciplina'">
                {{ 'budget.disciplina' | translate }}
              </ds-button>
          </div>
          <p class="page-copy">
            {{ 'budget.descricao' | translate }}
          </p>
      </header>

      <section class="page-grid">

        @if (abaAtivaBudget() === 'categorias') {
          <ds-card
            eyebrow="{{ 'budget.categorias' | translate }}"
            title="{{ 'budget.msgCategorias' | translate }}"
            subtitle="{{ 'budget.msgDescricaoCategorias' | translate }}"
          >
            <div class="progress-list">
              <div class="progress-item">
                <div class="progress-top"><span>Alimentação</span><span>72%</span></div>
                <div class="budget-info"><span><strong>Limite:</strong> R$ 1.200,00</span><span><strong>Usado:</strong> R$ 864,00</span></div>
                <div class="progress-track"><div class="progress-fill" style="width: 72%"></div>              
              </div>
              </div>
              <div class="progress-item">
                <div class="progress-top"><span>Transporte</span><span>44%</span></div>
                <div class="budget-info"><span><strong>Limite:</strong> R$ 500,00</span><span><strong>Usado:</strong> R$ 220,00</span></div>
                <div class="progress-track"><div class="progress-fill" style="width: 44%"></div></div>
              </div>
              <div class="progress-item">
                <div class="progress-top"><span>Assinaturas</span><span>81%</span></div>
                <div class="budget-info"><span><strong>Limite:</strong> R$ 300,00</span><span><strong>Usado:</strong> R$ 243,00</span></div>
                <div class="progress-track"><div class="progress-fill" style="width: 81%"></div></div>
              </div>
            </div>
          </ds-card>
        }

        @if (abaAtivaBudget() === 'limites') {
          <ds-card
            eyebrow="{{ 'budget.limites' | translate }}"
            title="{{ 'budget.msgLimites' | translate }}"
            subtitle="{{ 'budget.msgDescricaoLimites' | translate }}"
          >
          </ds-card>
        }

        @if (abaAtivaBudget() === 'disciplina') {
          <ds-card
          eyebrow="{{ 'budget.disciplina' | translate }}"
            title="{{ 'budget.msgDisciplina' | translate }}"
            subtitle="{{ 'budget.msgDescricaoDisciplina' | translate }}"
          >
          </ds-card>
          <ds-card class=button-budget>
            <ds-button variant="primary">Adicionar</ds-button>
            <ds-button variant="secondary">Remover</ds-button>
          </ds-card>
        }

        <ds-card
          eyebrow="Ações"
          title="Ajustes rápidos"
          subtitle="Atalhos para recalibrar o planejamento do mês."
        >
          <div class="tag-row">
            <span class="tag">Rebalancear</span>
            <span class="tag">Copiar do mês anterior</span>
            <span class="tag">Receber alerta</span>
          </div>
        </ds-card>
        

      </section>
    </section>
  `,
})
export class Budget {
  private readonly document = inject(DOCUMENT);

  abaAtivaBudget = signal<'categorias' | 'limites' | 'disciplina'>('categorias');

  mostrarAbaBudget(aba: 'categorias' | 'limites' | 'disciplina'): void {
      this.abaAtivaBudget.set(aba);
    }
}
