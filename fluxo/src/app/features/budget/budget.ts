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
          <div class="progress-list">

          @for (categoria of categorias; track categoria.nome) {

            <div class="progress-item">

              <div class="progress-top">
                <span>{{ categoria.nome }}</span>

                <span>
                  {{ progressoAtualPorcentagem(categoria) }}%
                </span>
              </div>

              <div class="budget-info">

                <span>
                  <strong>
                    {{ 'budget.limite' | translate }}:
                  </strong>

                  R$ {{ categoria.limite }}
                </span>

                <span>
                  <strong>
                    {{ 'budget.usado' | translate }}:
                  </strong>

                  R$ {{ categoria.usado }}
                </span>

              </div>

              <span>
                {{ 'budget.restante' | translate }}:
                R$ {{ valorRestante(categoria) }}
              </span>

              <div class="progress-track">

                <div
                  class="progress-fill"
                  [style.width.%]="progressoAtualPorcentagem(categoria)"
                ></div>

              </div>

            </div>

          }

        </div>
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
              <ds-button (click)="adicionarCategoria()" variant="primary">{{ 'budget.buttonAdd' | translate }}</ds-button>
              <ds-button (click)="removerCategoria()" variant="secondary">{{ 'budget.buttonRemove' | translate }}</ds-button>
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
        
      @if (popupAdicionar()) {
        <div class="ds-modal__backdrop">

          <div class="ds-modal">

            <div class="ds-modal__header">
              <div>
                <span class="ds-modal__eyebrow">
                  {{ 'budget.categorias' | translate }}
                </span>

                <h2 class="ds-modal__title">
                  Adicionar categoria
                </h2>
              </div>

              <button
                type="button"
                class="ds-modal__close"
                (click)="popupAdicionar.set(false)"
              >
                ×
              </button>
            </div>

            <div class="ds-modal__body">

              <p class="modal-copy">
                Configure o nome, limite e valor usado da categoria.
              </p>

              <label class="field">
                <span>Nome</span>

                <input
                  type="text"
                  placeholder="Ex.: Lazer"
                  [value]="novaCategoria().nome"
                  (input)="novaCategoria.update(c => ({
                    ...c,
                    nome: $any($event.target).value
                  }))"
                />
              </label>

              <label class="field">
                <span>Limite</span>

                <input
                  type="number"
                  min="0"
                  [value]="novaCategoria().limite"
                  (input)="novaCategoria.update(c => ({
                    ...c,
                    limite: +$any($event.target).value
                  }))"
                />
              </label>

              <label class="field">
                <span>Usado</span>

                <input
                  type="number"
                  min="0"
                  [value]="novaCategoria().usado"
                  (input)="novaCategoria.update(c => ({
                    ...c,
                    usado: +$any($event.target).value
                  }))"
                />
              </label>

              <div class="modal-actions">

                <ds-button
                  variant="secondary"
                  (click)="popupAdicionar.set(false)"
                >
                  Cancelar
                </ds-button>

                <ds-button
                  variant="primary"
                  (click)="confirmarAdicionar()"
                >
                  Adicionar
                </ds-button>

              </div>

            </div>

          </div>

        </div>
      }

      @if (popupRemover()) {
        <div class="ds-modal__backdrop">

          <div class="ds-modal">

            <div class="ds-modal__header">
              <div>
                <span class="ds-modal__eyebrow">
                  {{ 'budget.categorias' | translate }}
                </span>

                <h2 class="ds-modal__title">
                  Remover categoria
                </h2>
              </div>

              <button
                type="button"
                class="ds-modal__close"
                (click)="popupRemover.set(false)"
              >
                ×
              </button>
            </div>

            <div class="ds-modal__body">

              <p class="modal-copy">
                Escolha qual categoria deseja remover.
              </p>

              <div class="progress-list">

                @for (categoria of categorias; track $index) {

                  <button
                    type="button"
                    class="categoria-remover"
                    [class.categoria-remover--selecionada]="
                      categoriaSelecionadaRemover() === $index
                    "
                    (click)="categoriaSelecionadaRemover.set($index)"
                  >
                    <span>
                      {{ categoria.nome }}
                    </span>

                    <span>
                      R$ {{ categoria.limite }}
                    </span>
                  </button>

                }

              </div>

              <div class="modal-actions">

                <ds-button
                  variant="secondary"
                  (click)="popupRemover.set(false)"
                >
                  Cancelar
                </ds-button>

                <ds-button
                  variant="primary"
                  (click)="confirmarRemocao()"
                  [disabled]="categoriaSelecionadaRemover() === null"
                >
                  Remover
                </ds-button>

              </div>

            </div>

          </div>

        </div>
      }
      
      </section>
    </section>
  `,
})

export class Budget {
  private readonly document = inject(DOCUMENT);

  abaAtivaBudget = signal<'categorias' | 'limites' | 'disciplina'>('categorias');

  popupAdicionar = signal(false);

  popupRemover = signal(false);

  categoriaSelecionadaRemover = signal<number | null>(null);

  novaCategoria = signal({
    nome: '',
    limite: 0,
    usado: 0
  });

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
    if (categoria.limite <= 0) {
      return 0;
    }

    const porcentagem = (categoria.usado / categoria.limite) * 100;

    return Math.min(Number(porcentagem.toFixed(2)), 100);
  }

  valorRestante(categoria: { limite: number; usado: number }): number {
    return Math.max(categoria.limite - categoria.usado, 0);
  }

  adicionarCategoria(): void {
    this.novaCategoria.set({
      nome: '',
      limite: 0,
      usado: 0
    });

    this.popupAdicionar.set(true);
}

  confirmarAdicionar(): void {
    const categoria = this.novaCategoria();

    if (!categoria.nome.trim()) {
      return;
    }

    this.categorias.push({
      nome: categoria.nome.trim(),
      limite: categoria.limite,
      usado: categoria.usado
    });

    this.popupAdicionar.set(false);
  }

  removerCategoria(): void {
    this.categoriaSelecionadaRemover.set(null);
    this.popupRemover.set(true);
  }

  confirmarRemocao(): void {
    const indice = this.categoriaSelecionadaRemover();

    if (indice === null) {
      return;
    }

    this.categorias.splice(indice, 1);

    this.categoriaSelecionadaRemover.set(null);
    this.popupRemover.set(false);
  }
}
