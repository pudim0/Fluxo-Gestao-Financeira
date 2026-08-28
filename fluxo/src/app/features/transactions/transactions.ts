import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageService } from '../../core/services/language.service';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { EmptyState as DsEmptyState } from '../../shared/components/design-system/empty-state/empty-state';
import { LoadingState as DsLoadingState } from '../../shared/components/design-system/loading-state/loading-state';
import { Modal as DsModal } from '../../shared/components/design-system/modal/modal';
import { NewTransaction, Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, DsCard, DsEmptyState, DsLoadingState, DsModal, TranslatePipe],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <h2 class="page-title">{{ 'transacoes.titulo' | translate }}</h2>
          <p class="page-copy">{{ 'transacoes.descricao' | translate }}</p>
        </div>
        <button class="primary-button" type="button" (click)="startCreate()">{{ 'transacoes.novadescricao' | translate }}</button>
      </header>

      @if (feedbackMessage) {
        <section class="state-card action-feedback" role="status" aria-live="polite">
          <strong>{{ feedbackMessage | translate }}</strong>
        </section>
      }

      <section class="page-grid">
        <ds-card
          eyebrow="{{ 'transacoes.filtro' | translate }}"
          title="{{ 'transacoes.titulofiltr' | translate }}"
          subtitle="{{ 'transacoes.subtitulo' | translate }}"
        >
          <div class="transaction-filters">
            <label class="field">
              <span>{{ 'transacoes.buscar' | translate }}</span>
              <input
                type="search"
                placeholder="{{ 'transacoes.descricaoConta' | translate }}"
                [value]="search"
                (input)="search = $any($event.target).value"
              />
            </label>
            <label class="field">
              <span>{{ 'transacoes.periodo' | translate }}</span>
              <select [value]="selectedType" (change)="selectedType = $any($event.target).value">
                <option value="">{{ 'transacoes.todos' | translate }}</option>
                <option value="income">{{ 'transacoes.receitas' | translate }}</option>
                <option value="expense">{{ 'transacoes.despesas' | translate }}</option>
              </select>
            </label>
            <label class="field">
              <span>{{ 'transacoes.categoria' | translate }}</span>
              <select
                [value]="selectedCategory"
                (change)="selectedCategory = $any($event.target).value"
              >
                <option value="">{{ 'transacoes.todas' | translate }}</option>
                @for (category of transactionsService.categories(); track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>
            </label>
            <div class="date-range">
              <label class="field">
                <span>{{ 'transacoes.De' | translate }}</span>
                <input
                  type="date"
                  [value]="startDate"
                  (change)="startDate = $any($event.target).value"
                />
              </label>
              <label class="field">
                <span>{{ 'transacoes.Ate' | translate }}</span>
                <input
                  type="date"
                  [value]="endDate"
                  (change)="endDate = $any($event.target).value"
                />
              </label>
            </div>
          </div>
        </ds-card>

        <ds-card
          eyebrow="{{ 'transacoes.resumo' | translate }}"
          title="{{ 'transacoes.periodoFiltrado' | translate }}"
          subtitle="{{ 'transacoes.valores' | translate }}"
        >
          <div class="transaction-summary">
            <span
              ><small>{{ 'transacoes.resultados' | translate }}</small><strong>{{ filteredTransactions.length }}</strong></span
            >
            <span
              ><small>{{ 'transacoes.entradas' | translate }}</small
              ><strong class="income-value">{{ filteredIncome | currency: 'BRL' }}</strong></span
            >
            <span
              ><small>{{ 'transacoes.saidas' | translate }}</small
              ><strong class="expense-value">{{ filteredExpense | currency: 'BRL' }}</strong></span
            >
          </div>
        </ds-card>
      </section>

      @if (transactionsService.isLoading()) {
        <ds-loading-state
          label="{{ 'transacoes.carregando' | translate }}"
          detail="{{ 'transacoes.detalheCarregando' | translate }}"
        />
      } @else if (transactionsService.hasError()) {
        <section class="state-card" role="alert">
          <strong>{{ 'transacoes.possivel' | translate }}</strong>
          <p>{{ 'transacoes.verifique' | translate }}</p>
          <button class="secondary-button" type="button" (click)="transactionsService.load()">
            {{ 'transacoes.tentarNovamente' | translate }}
          </button>
        </section>
      } @else if (filteredTransactions.length === 0) {
        <ds-empty-state
          [title]="
            hasActiveFilters ? 'transacoes.naoEncontrado' : 'transacoes.comeceRegistrando'
          "
          [description]="
            hasActiveFilters
              ? ('transacoes.ajusteFiltros' | translate)
              : ('transacoes.adicioneRegistro' | translate)
          "
          [actionLabel]="hasActiveFilters ? ('transacoes.limparFiltros' | translate) : ('transacoes.novaTransacao' | translate)"
          (action)="hasActiveFilters ? clearFilters() : startCreate()"
        />
      } @else {
        <ds-card eyebrow="{{ 'transacoes.extrato' | translate }}" title="{{ 'transacoes.historicoMovimentacoes' | translate }}">
          <div class="transaction-table-wrap">
            <table class="ds-table">
              <thead>
                <tr>
                  <th>{{ 'transacoes.data' | translate }}</th>
                  <th>{{ 'transacoes.descricaoth' | translate }}</th>
                  <th>{{ 'transacoes.categoriath' | translate }}</th>
                  <th>{{ 'transacoes.conta' | translate }}</th>
                  <th>{{ 'transacoes.valor' | translate }}</th>
                  <th><span class="visually-hidden">{{ 'transacoes.acoes' | translate }}</span></th>
                </tr>
              </thead>
              <tbody>
                @for (transaction of filteredTransactions; track transaction.id) {
                  <tr>
                    <td>{{ transaction.date | date: 'dd/MM/yyyy' }}</td>
                    <td>{{ transaction.description }}</td>
                    <td>{{ transaction.category }}</td>
                    <td>{{ transaction.account }}</td>
                    <td
                      [class.income-value]="transaction.type === 'income'"
                      [class.expense-value]="transaction.type === 'expense'"
                    >
                      {{ transaction.type === 'income' ? '+' : '-' }}
                      {{ transaction.amount | currency: 'BRL' }}
                    </td>
                    <td class="transaction-actions">
                      <button class="ghost-button" type="button" (click)="startEdit(transaction)">
                        {{ 'transacoes.editar' | translate }}
                      </button>
                      <button
                        class="ghost-button danger-button"
                        type="button"
                        (click)="remove(transaction)"
                      >
                        {{ 'transacoes.excluir' | translate }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ds-card>
      }

      @if (formOpen) {
        <ds-modal
          [open]="formOpen"
          [eyebrow]="editingId ? ('transacoes.editar' | translate) : ('transacoes.nova' | translate)"
          title="{{ 'transacoes.detalhesMovimentacao' | translate }}"
          (close)="closeForm()"
        >
          <form class="transaction-form" (ngSubmit)="save()">
            <label class="field field--wide">
              <span>{{ 'transacoes.descricao' | translate }}</span>
              <input
                name="description"
                required
                [(ngModel)]="form.description"
                placeholder="{{ 'transacoes.exemploDescricao' | translate }}"
              />
            </label>
            <label class="field">
              <span>{{ 'transacoes.valor' | translate }}</span>
              <input
                name="amount"
                required
                type="number"
                min="0.01"
                step="0.01"
                [(ngModel)]="form.amount"
              />
            </label>
            <label class="field">
              <span>{{ 'transacoes.tipo' | translate }}</span>
              <select name="type" [(ngModel)]="form.type">
                <option value="expense">{{ 'transacoes.despesa' | translate }}</option>
                <option value="income">{{ 'transacoes.receita' | translate }}</option>
              </select>
            </label>
            <label class="field">
              <span>{{ 'transacoes.categoria' | translate }}</span>

              @if (!creatingCategory) {
                <select name="category" required [(ngModel)]="form.category">
                  <option value="">{{ 'transacoes.selecioneCategoria' | translate }}</option>

                  @if (form.category && !transactionsService.categories().includes(form.category)) {
                    <option [value]="form.category">{{ form.category }}</option>
                  }

                  @for (category of transactionsService.categories(); track category) {
                    <option [value]="category">
                      {{ category }}
                    </option>
                  }
                </select>

                <button class="secondary-button" type="button" (click)="startNewCategory()">
                  + {{ 'transacoes.criarNovaCategoria' | translate }}
                </button>
              } @else {
                <div class="category-input-row">
                  <input
                    name="category"
                    required
                    [(ngModel)]="form.category"
                    placeholder="{{ 'transacoes.exemploCategoria' | translate }}"
                  />
                  <button
                    class="icon-button category-confirm-button"
                    type="button"
                    [disabled]="!form.category.trim()"
                    (click)="confirmNewCategory()"
                    aria-label="{{ 'transacoes.confirmarCategoria' | translate }}"
                    title="{{ 'transacoes.confirmarCategoria' | translate }}"
                  >
                    →
                  </button>
                </div>

                <button class="secondary-button" type="button" (click)="cancelNewCategory()">
                  {{ 'transacoes.escolherCategoriaExistente' | translate }}
                </button>
              }
            </label>
            <label class="field">
              <span>{{ 'transacoes.data' | translate }}</span>
              <input name="date" required type="date" [(ngModel)]="form.date" />
            </label>
            <label class="field">
              <span>{{ 'transacoes.conta' | translate }}</span>
              <input
                name="account"
                required
                [(ngModel)]="form.account"
                placeholder="{{ 'transacoes.exemploContaPrincipal' | translate }}"
              />
            </label>
            <div class="button-row field--wide">
              <button class="primary-button" type="submit">
                {{ editingId ? ('transacoes.salvarAlteracoes' | translate) : ('transacoes.adicionarTransacao' | translate) }}
              </button>
              <button class="secondary-button" type="button" (click)="closeForm()">{{ 'transacoes.cancelar' | translate }}</button>
            </div>
          </form>
        </ds-modal>
      }
    </section>
  `,
})
export class Transactions implements OnDestroy {
  protected readonly transactionsService = inject(TransactionsService);
  private readonly languageService = inject(LanguageService);
  protected search = '';
  protected selectedType: TransactionType | '' = '';
  protected selectedCategory = '';
  protected startDate = '';
  protected endDate = '';
  protected formOpen = false;
  protected editingId: string | null = null;
  protected form: NewTransaction = this.emptyForm();
  protected creatingCategory = false;
  protected feedbackMessage = '';

  protected get hasActiveFilters(): boolean {
    return Boolean(
      this.search || this.selectedType || this.selectedCategory || this.startDate || this.endDate,
    );
  }

  protected clearFilters(): void {
    this.search = '';
    this.selectedType = '';
    this.selectedCategory = '';
    this.startDate = '';
    this.endDate = '';
  }

  constructor() {
    this.transactionsService.load();
  }

  ngOnDestroy(): void {
    this.clearFilters();
  }

  protected cancelNewCategory(): void {
    this.creatingCategory = false;
    this.form.category = '';
  }

  protected get filteredTransactions(): Transaction[] {
    const search = this.search.trim().toLowerCase();
    return this.transactionsService.transactions().filter((transaction) => {
      const matchesSearch =
        !search ||
        `${transaction.description} ${transaction.account}`.toLowerCase().includes(search);
      const matchesType = !this.selectedType || transaction.type === this.selectedType;
      const matchesCategory =
        !this.selectedCategory || transaction.category === this.selectedCategory;
      const matchesStart = !this.startDate || transaction.date >= this.startDate;
      const matchesEnd = !this.endDate || transaction.date <= this.endDate;
      return matchesSearch && matchesType && matchesCategory && matchesStart && matchesEnd;
    });
  }

  protected get filteredIncome(): number {
    return this.filteredTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  protected get filteredExpense(): number {
    return this.filteredTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  protected startCreate(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.creatingCategory = false;
    this.formOpen = true;
  }

  protected startEdit(transaction: Transaction): void {
    this.editingId = transaction.id;
    this.form = { ...transaction };
    this.creatingCategory = false;
    this.formOpen = true;
  }

  protected closeForm(): void {
    this.formOpen = false;
    this.editingId = null;
    this.creatingCategory = false;
  }

  protected save(): void {
    const wasEditing = Boolean(this.editingId);
    const transaction = { ...this.form, amount: Number(this.form.amount) };
    if (wasEditing && this.editingId) {
      this.transactionsService.update(this.editingId, transaction);
    } else {
      this.transactionsService.create(transaction);
    }
    this.closeForm();
    this.feedbackMessage = wasEditing
      ? 'transacoes.transacaoAtualizadaSucesso'
      : 'transacoes.transacaoCriadaSucesso';
  }

  protected remove(transaction: Transaction): void {
    if (
      window.confirm(
        this.languageService.texto(
          `Excluir a transação "${transaction.description}"?`,
          `Delete the transaction "${transaction.description}"?`,
        ),
      )
    ) {
      this.transactionsService.delete(transaction.id);
      this.feedbackMessage = 'transacoes.transacaoExcluidaSucesso';
    }
  }

  protected startNewCategory(): void {
    this.creatingCategory = true;
    this.form.category = '';
  }

  protected confirmNewCategory(): void {
    if (!this.form.category.trim()) return;

    this.form.category = this.form.category.trim();
    this.creatingCategory = false;
  }

  private emptyForm(): NewTransaction {
    return {
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      date: new Date().toISOString().slice(0, 10),
      account: this.languageService.texto('Conta principal', 'Main account'),
    };
  }
}
