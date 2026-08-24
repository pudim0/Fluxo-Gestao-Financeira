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
          <p class="page-copy">
            {{ 'budget.descricao' | translate }}
          </p>
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
                <div class="progress-top"><span>{{ 'budget.alimentacao' | translate }}</span><span>{{ progressoAtualPorcentagem(categorias[0]) }}%</span></div>
                <div class="budget-info"><span><strong>{{ 'budget.limite' | translate }}:</strong> R$ {{ categorias[0].limite }}</span><span><strong>{{ 'budget.usado' | translate }}:</strong> R$ {{ categorias[0].usado }}</span></div>
                <span>
                  {{ 'budget.restante' | translate }}: R$ {{ valorRestante(categorias[0]) }}
                </span>
                <div class="progress-track"><div class="progress-fill" [style.width.%]="progressoAtualPorcentagem(categorias[0])"></div>           
              </div>
              </div>
              <div class="progress-item">
                <div class="progress-top"><span>{{ 'budget.transporte' | translate }}</span><span>{{ progressoAtualPorcentagem(categorias[1]) }}%</span></div>
                <div class="budget-info"><span><strong>{{ 'budget.limite' | translate }}:</strong> R$ {{ categorias[1].limite }}</span><span><strong>{{ 'budget.usado' | translate }}:</strong> R$ {{ categorias[1].usado }}</span></div>
                <span>
                  {{ 'budget.restante' | translate }}: R$ {{ valorRestante(categorias[1]) }}
                </span>
                <div class="progress-track"><div class="progress-fill" [style.width.%]="progressoAtualPorcentagem(categorias[1])"></div></div>
              </div>
              <div class="progress-item">
                <div class="progress-top"><span>{{ 'budget.assinaturas' | translate }}</span><span>{{ progressoAtualPorcentagem(categorias[2]) }}%</span></div>
                <div class="budget-info"><span><strong>{{ 'budget.limite' | translate }}:</strong> R$ {{ categorias[2].limite }}</span><span><strong>{{ 'budget.usado' | translate }}:</strong> R$ {{ categorias[2].usado }}</span></div>
                <span>
                  {{ 'budget.restante' | translate }}: R$ {{ valorRestante(categorias[2]) }}
                </span>
                <div class="progress-track"><div class="progress-fill" [style.width.%]="progressoAtualPorcentagem(categorias[2])"></div></div>
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
            <div class="button-budget">
              <ds-button variant="primary">{{ 'budget.buttonAdd' | translate }}</ds-button>
              <ds-button variant="secondary">{{ 'budget.buttonRemove' | translate }}</ds-button>
            </div>
          </ds-card>
        }

        <ds-card
          eyebrow="{{ 'budget.acoes' | translate }}"
          title="{{ 'budget.msgAcoes' | translate }}"
          subtitle="{{ 'budget.msgDescricaoAcoes' | translate }}"
        >
          <div class="tag-row">
            <span class="tag">{{ 'budget.rebalancear' | translate }}</span>
            <span class="tag">{{ 'budget.copiarMesAnterior' | translate }}</span>
            <span class="tag">{{ 'budget.receberAlerta' | translate }}</span>
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

  categorias = [
  {
    nome: 'Alimentação',
    limite: 1200,
    usado: 864
  },
  {
    nome: 'Transporte',
    limite: 500,
    usado: 220
  },
  {
    nome: 'Assinaturas',
    limite: 300,
    usado: 243
  }
  ];

  progressoAtualPorcentagem(categoria: { limite: number; usado: number }): number {
    return Math.min((categoria.usado / categoria.limite) * 100, 100);
  }

  valorRestante(categoria: { limite: number; usado: number }): number {
    return Math.max(categoria.limite - categoria.usado, 0);
  }
}
