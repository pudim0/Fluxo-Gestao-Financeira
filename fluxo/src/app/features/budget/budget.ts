import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { TranslatePipe } from '@ngx-translate/core';
import { Button as DsButton } from '../../shared/components/design-system/button/button';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    DsCard,
    DsButton,
    TranslatePipe,
    DecimalPipe
  ],
  template: `
    <section class="page-shell">

      <header class="page-header">

        <div>
          <p class="page-copy">
            {{ 'budget.descricao' | translate }}
          </p>
        </div>

        <!-- ATALHOS -->
        <div class="button-budget">

          <ds-button
            (click)="irParaSecao('categorias')"
          >
            {{ 'budget.categorias' | translate }}
          </ds-button>

          <ds-button
            (click)="irParaSecao('limites')"
          >
            {{ 'budget.limites' | translate }}
          </ds-button>

          <ds-button
            (click)="irParaSecao('usos')"
          >
            {{ 'budget.usos' | translate }}
          </ds-button>

          <ds-button
            (click)="irParaSecao('disciplina')"
          >
            {{ 'budget.disciplina' | translate }}
          </ds-button>

        </div>

      </header>


      <!-- ================================================= -->
      <!-- CATEGORIAS -->
      <!-- ================================================= -->

      <section
        id="categorias"
        class="budget-section"
      >

        <ds-card
          eyebrow="{{ 'budget.categorias' | translate }}"
          title="{{ 'budget.msgCategorias' | translate }}"
          subtitle="{{ 'budget.msgDescricaoCategorias' | translate }}"
        >

          <div class="progress-list">

            @for (
              categoria of categorias();
              track categoria.nome
            ) {

              <div class="progress-item">

                <div class="progress-top">

                  <span>
                    {{ categoria.nome }}
                  </span>

                  <span>
                    {{
                      progressoAtualPorcentagem(categoria)
                      | number:'1.0-0'
                    }}%
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
                      {{ 'budget.usos' | translate }}:
                    </strong>

                    R$ {{ categoria.usado }}
                  </span>

                </div>


                <span>

                  {{ 'budget.restante' | translate }}:

                  R$
                  {{ valorRestante(categoria) }}

                </span>


                <div class="progress-track">

                  <div
                    class="progress-fill"
                    [style.width.%]="
                      progressoAtualPorcentagem(categoria)
                    "
                  ></div>

                </div>

              </div>

            }

          </div>

        </ds-card>

      </section>



      <!-- ================================================= -->
      <!-- LIMITES -->
      <!-- ================================================= -->

      <section
        id="limites"
        class="budget-section"
      >

        <ds-card
          eyebrow="{{ 'budget.limites' | translate }}"
          title="{{ 'budget.msgLimites' | translate }}"
          subtitle="{{ 'budget.msgDescricaoLimites' | translate }}"
        >

          <div class="progress-list">

            @for (
              categoria of categorias();
              track categoria.nome
            ) {

              <div class="progress-item">

                <div class="progress-top">

                  <span>
                    {{ categoria.nome }}
                  </span>

                  <span>
                    R$ {{ categoria.limite }}
                  </span>

                </div>


                <div class="button-budget">

                  <ds-button
                    variant="primary"
                    (click)="abrirPopupLimite(categoria)"
                  >
                    Alterar limite
                  </ds-button>

                </div>

              </div>

            }

          </div>

        </ds-card>

      </section>



      <!-- ================================================= -->
      <!-- USOS -->
      <!-- ================================================= -->

      <section
        id="usos"
        class="budget-section"
      >

        <ds-card
          eyebrow="{{ 'budget.usos' | translate }}"
          title="{{ 'budget.usos' | translate }}"
          subtitle="Controle quanto já foi utilizado em cada categoria."
        >

          <div class="progress-list">

            @for (
              categoria of categorias();
              track categoria.nome
            ) {

              <div class="progress-item">

                <div class="progress-top">

                  <span>
                    {{ categoria.nome }}
                  </span>

                  <span>
                    R$ {{ categoria.usado }}
                  </span>

                </div>


                <div class="button-budget">

                  <ds-button
                    variant="primary"
                    (click)="abrirPopupUso(categoria)"
                  >
                    Adicionar uso
                  </ds-button>

                </div>

              </div>

            }

          </div>

        </ds-card>

      </section>



      <!-- ================================================= -->
      <!-- DISCIPLINA -->
      <!-- ================================================= -->

      <section
        id="disciplina"
        class="budget-section"
      >

        <ds-card
          eyebrow="{{ 'budget.disciplina' | translate }}"
          title="{{ 'budget.msgDisciplina' | translate }}"
          subtitle="{{ 'budget.msgDescricaoDisciplina' | translate }}"
        >

          <div class="button-budget">

            <ds-button
              (click)="adicionarCategoria()"
              variant="primary"
            >
              {{ 'budget.buttonAdd' | translate }}
            </ds-button>


            <ds-button
              (click)="removerCategoria()"
              variant="secondary"
            >
              {{ 'budget.buttonRemove' | translate }}
            </ds-button>

          </div>

        </ds-card>

      </section>



      <!-- ================================================= -->
      <!-- AÇÕES -->
      <!-- ================================================= -->

      <ds-card
        eyebrow="{{ 'budget.acoes' | translate }}"
        title="{{ 'budget.msgAcoes' | translate }}"
        subtitle="{{ 'budget.msgDescricaoAcoes' | translate }}"
      >

        <div class="tag-row">

          <span class="tag">
            {{ 'budget.rebalancear' | translate }}
          </span>

          <span class="tag">
            {{ 'budget.copiarMesAnterior' | translate }}
          </span>

          <span class="tag">
            {{ 'budget.receberAlerta' | translate }}
          </span>

        </div>

      </ds-card>



      <!-- ================================================= -->
      <!-- POPUP ADICIONAR -->
      <!-- ================================================= -->

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

                <span>
                  Nome
                </span>

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

                <span>
                  Limite
                </span>

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

                <span>
                  Usado
                </span>

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



      <!-- ================================================= -->
      <!-- POPUP REMOVER -->
      <!-- ================================================= -->

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

                @for (
                  categoria of categorias();
                  track $index
                ) {

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
                  [disabled]="
                    categoriaSelecionadaRemover() === null
                  "
                >
                  Remover
                </ds-button>

              </div>

            </div>

          </div>

        </div>

      }



      <!-- ================================================= -->
      <!-- POPUP LIMITE -->
      <!-- ================================================= -->

      @if (popupLimite()) {

        <div class="ds-modal__backdrop">

          <div class="ds-modal">

            <div class="ds-modal__header">

              <div>

                <span class="ds-modal__eyebrow">
                  {{ 'budget.limites' | translate }}
                </span>

                <h2 class="ds-modal__title">
                  Alterar limite
                </h2>

              </div>


              <button
                type="button"
                class="ds-modal__close"
                (click)="fecharPopupLimite()"
              >
                ×
              </button>

            </div>


            <div class="ds-modal__body">

              @if (categoriaSelecionada(); as categoria) {

                <p class="modal-copy">

                  Alterando o limite de

                  <strong>
                    {{ categoria.nome }}
                  </strong>.

                </p>


                <label class="field">

                  <span>
                    Limite atual
                  </span>

                  <input
                    type="text"
                    [value]="'R$ ' + categoria.limite"
                    disabled
                  />

                </label>


                <label class="field">

                  <span>
                    Novo limite
                  </span>

                  <input
                    type="number"
                    min="0"
                    [value]="novoLimite()"
                    (input)="
                      novoLimite.set(
                        +$any($event.target).value
                      )
                    "
                  />

                </label>


                <div class="modal-actions">

                  <ds-button
                    variant="secondary"
                    (click)="fecharPopupLimite()"
                  >
                    Cancelar
                  </ds-button>


                  <ds-button
                    variant="primary"
                    (click)="confirmarNovoLimite()"
                  >
                    Salvar
                  </ds-button>

                </div>

              }

            </div>

          </div>

        </div>

      }



      <!-- ================================================= -->
      <!-- POPUP USO -->
      <!-- ================================================= -->

      @if (popupUso()) {

        <div class="ds-modal__backdrop">

          <div class="ds-modal">

            <div class="ds-modal__header">

              <div>

                <span class="ds-modal__eyebrow">
                  {{ 'budget.usos' | translate }}
                </span>

                <h2 class="ds-modal__title">
                  Adicionar uso
                </h2>

              </div>


              <button
                type="button"
                class="ds-modal__close"
                (click)="fecharPopupUso()"
              >
                ×
              </button>

            </div>


            <div class="ds-modal__body">

              @if (categoriaSelecionada(); as categoria) {

                <p class="modal-copy">

                  Adicionando um novo uso em

                  <strong>
                    {{ categoria.nome }}
                  </strong>.

                </p>


                <label class="field">

                  <span>
                    Total usado atualmente
                  </span>

                  <input
                    type="text"
                    [value]="'R$ ' + categoria.usado"
                    disabled
                  />

                </label>


                <label class="field">

                  <span>
                    Quanto foi usado?
                  </span>

                  <input
                    type="number"
                    min="0"
                    [value]="valorUso()"
                    (input)="
                      valorUso.set(
                        +$any($event.target).value
                      )
                    "
                  />

                </label>


                <div class="modal-actions">

                  <ds-button
                    variant="secondary"
                    (click)="fecharPopupUso()"
                  >
                    Cancelar
                  </ds-button>


                  <ds-button
                    variant="primary"
                    (click)="confirmarUso()"
                  >
                    Adicionar
                  </ds-button>

                </div>

              }

            </div>

          </div>

        </div>

      }

    </section>
  `,
})
export class Budget {

  private readonly document = inject(DOCUMENT);


  categorias = signal([
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
  ]);


  popupAdicionar = signal(false);

  popupRemover = signal(false);

  popupLimite = signal(false);

  popupUso = signal(false);


  categoriaSelecionadaRemover =
    signal<number | null>(null);


  categoriaSelecionada =
    signal<{
      nome: string;
      limite: number;
      usado: number;
    } | null>(null);


  novoLimite = signal(0);

  valorUso = signal(0);


  novaCategoria = signal({
    nome: '',
    limite: 0,
    usado: 0
  });



  // ======================================================
  // SCROLL DOS ATALHOS
  // ======================================================

  irParaSecao(secao: string): void {

    const elemento =
      this.document.getElementById(secao);

    if (!elemento) {
      return;
    }

    elemento.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }



  // ======================================================
  // PROGRESSO
  // ======================================================

  progressoAtualPorcentagem(
    categoria: {
      limite: number;
      usado: number;
    }
  ): number {

    if (categoria.limite <= 0) {
      return 0;
    }

    const porcentagem =
      (categoria.usado / categoria.limite) * 100;

    return Math.min(
      Number(porcentagem.toFixed(2)),
      100
    );

  }



  valorRestante(
    categoria: {
      limite: number;
      usado: number;
    }
  ): number {

    return Math.max(
      categoria.limite - categoria.usado,
      0
    );

  }



  // ======================================================
  // LIMITE
  // ======================================================

  abrirPopupLimite(
    categoria: {
      nome: string;
      limite: number;
      usado: number;
    }
  ): void {

    this.categoriaSelecionada.set(categoria);

    this.novoLimite.set(categoria.limite);

    this.popupLimite.set(true);

  }


  fecharPopupLimite(): void {

    this.popupLimite.set(false);

    this.categoriaSelecionada.set(null);

  }


  confirmarNovoLimite(): void {

    const categoria =
      this.categoriaSelecionada();

    if (!categoria) {
      return;
    }

    const novoLimite =
      this.novoLimite();

    if (novoLimite < 0) {
      return;
    }

    this.categorias.update(
      categorias =>
        categorias.map(item =>
          item.nome === categoria.nome
            ? {
                ...item,
                limite: novoLimite
              }
            : item
        )
    );

    this.fecharPopupLimite();

  }



  // ======================================================
  // USO
  // ======================================================

  abrirPopupUso(
    categoria: {
      nome: string;
      limite: number;
      usado: number;
    }
  ): void {

    this.categoriaSelecionada.set(categoria);

    this.valorUso.set(0);

    this.popupUso.set(true);

  }


  fecharPopupUso(): void {

    this.popupUso.set(false);

    this.categoriaSelecionada.set(null);

    this.valorUso.set(0);

  }


  confirmarUso(): void {

    const categoria =
      this.categoriaSelecionada();

    if (!categoria) {
      return;
    }

    const valor =
      this.valorUso();

    if (valor <= 0) {
      return;
    }

    this.categorias.update(
      categorias =>
        categorias.map(item =>
          item.nome === categoria.nome
            ? {
                ...item,
                usado: item.usado + valor
              }
            : item
        )
    );

    this.fecharPopupUso();

  }



  // ======================================================
  // ADICIONAR CATEGORIA
  // ======================================================

  adicionarCategoria(): void {

    this.novaCategoria.set({
      nome: '',
      limite: 0,
      usado: 0
    });

    this.popupAdicionar.set(true);

  }


  confirmarAdicionar(): void {

    const categoria =
      this.novaCategoria();

    if (!categoria.nome.trim()) {
      return;
    }

    this.categorias.update(
      categorias => [
        ...categorias,
        {
          nome: categoria.nome.trim(),
          limite: categoria.limite,
          usado: categoria.usado
        }
      ]
    );

    this.popupAdicionar.set(false);

  }



  // ======================================================
  // REMOVER CATEGORIA
  // ======================================================

  removerCategoria(): void {

    this.categoriaSelecionadaRemover.set(null);

    this.popupRemover.set(true);

  }


  confirmarRemocao(): void {

    const indice =
      this.categoriaSelecionadaRemover();

    if (indice === null) {
      return;
    }

    this.categorias.update(
      categorias => {

        const novasCategorias =
          [...categorias];

        novasCategorias.splice(
          indice,
          1
        );

        return novasCategorias;

      }
    );

    this.categoriaSelecionadaRemover.set(null);

    this.popupRemover.set(false);

  }

}