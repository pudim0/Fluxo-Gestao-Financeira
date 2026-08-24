import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { EmptyState as DsEmptyState } from '../../shared/components/design-system/empty-state/empty-state';
import { LoadingState as DsLoadingState } from '../../shared/components/design-system/loading-state/loading-state';
import { Modal as DsModal } from '../../shared/components/design-system/modal/modal';
import { NewTransaction, Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, DsCard, DsEmptyState, DsLoadingState, DsModal],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <h2 class="page-title">Movimentações recentes e recorrentes</h2>
          <p class="page-copy">Registre cada entrada e saída para manter o painel atualizado.</p>
        </div>
        <button class="primary-button" type="button" (click)="startCreate()">Nova transação</button>
      </header>

      @if (feedbackMessage) {
        <section class="state-card action-feedback" role="status" aria-live="polite">
          <strong>{{ feedbackMessage }}</strong>
        </section>
      }

      <section class="page-grid">
        <ds-card
          eyebrow="Filtros"
          title="Encontre uma movimentação"
          subtitle="Combine período, categoria, tipo ou descrição."
        >
          <div class="transaction-filters">
            <label class="field">
              <span>Buscar</span>
              <input
                type="search"
                placeholder="Descrição ou conta"
                [value]="search"
                (input)="search = $any($event.target).value"
              />
            </label>
            <label class="field">
              <span>Tipo</span>
              <select [value]="selectedType" (change)="selectedType = $any($event.target).value">
                <option value="">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
            </label>
            <label class="field">
              <span>Categoria</span>
              <select
                [value]="selectedCategory"
                (change)="selectedCategory = $any($event.target).value"
              >
                <option value="">Todas</option>
                @for (category of transactionsService.categories(); track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>
            </label>
            <div class="date-range">
              <label class="field">
                <span>De</span>
                <input
                  type="date"
                  [value]="startDate"
                  (change)="startDate = $any($event.target).value"
                />
              </label>
              <label class="field">
                <span>Até</span>
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
          eyebrow="Resumo"
          title="Período filtrado"
          subtitle="Valores calculados a partir dos resultados visíveis."
        >
          <div class="transaction-summary">
            <span
              ><small>Resultados</small><strong>{{ filteredTransactions.length }}</strong></span
            >
            <span
              ><small>Entradas</small
              ><strong class="income-value">{{ filteredIncome | currency: 'BRL' }}</strong></span
            >
            <span
              ><small>Saídas</small
              ><strong class="expense-value">{{ filteredExpense | currency: 'BRL' }}</strong></span
            >
          </div>
        </ds-card>
      </section>

      @if (transactionsService.isLoading()) {
        <ds-loading-state label="Carregando transações" detail="Buscando suas movimentações." />
      } @else if (transactionsService.hasError()) {
        <section class="state-card" role="alert">
          <strong>Não foi possível carregar as transações.</strong>
          <p>Verifique a conexão e tente novamente.</p>
          <button class="secondary-button" type="button" (click)="transactionsService.load()">
            Tentar novamente
          </button>
        </section>
      } @else if (filteredTransactions.length === 0) {
        <ds-empty-state
          [title]="
            hasActiveFilters ? 'Nenhuma transação encontrada' : 'Comece registrando uma transação'
          "
          [description]="
            hasActiveFilters
              ? 'Ajuste os filtros para encontrar outras movimentações.'
              : 'Adicione uma receita ou despesa para acompanhar seu fluxo financeiro.'
          "
          [actionLabel]="hasActiveFilters ? 'Limpar filtros' : 'Nova transação'"
          (action)="hasActiveFilters ? clearFilters() : startCreate()"
        />
      } @else {
        <ds-card eyebrow="Extrato" title="Histórico de movimentações">
          <div class="transaction-table-wrap">
            <table class="ds-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Conta</th>
                  <th>Valor</th>
                  <th><span class="visually-hidden">Ações</span></th>
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
                        Editar
                      </button>
                      <button
                        class="ghost-button danger-button"
                        type="button"
                        (click)="remove(transaction)"
                      >
                        Excluir
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
          [eyebrow]="editingId ? 'Editar' : 'Nova'"
          title="Detalhes da movimentação"
          (close)="closeForm()"
        >
          <form class="transaction-form" (ngSubmit)="save()">
            <label class="field field--wide">
              <span>Descrição</span>
              <input
                name="description"
                required
                [(ngModel)]="form.description"
                placeholder="Ex.: Conta de luz"
              />
            </label>
            <label class="field">
              <span>Valor</span>
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
              <span>Tipo</span>
              <select name="type" [(ngModel)]="form.type">
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </label>
            <label class="field">
              <span>Categoria</span>

              @if (!creatingCategory) {
                <select name="category" required [(ngModel)]="form.category">
                  <option value="">Selecione uma categoria</option>

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
                  + Criar nova categoria
                </button>
              } @else {
                <div class="category-input-row">
                  <input
                    name="category"
                    required
                    [(ngModel)]="form.category"
                    placeholder="Ex.: Alimentação"
                  />
                  <button
                    class="icon-button category-confirm-button"
                    type="button"
                    [disabled]="!form.category.trim()"
                    (click)="confirmNewCategory()"
                    aria-label="Confirmar categoria"
                    title="Confirmar categoria"
                  >
                    →
                  </button>
                </div>

                <button class="secondary-button" type="button" (click)="cancelNewCategory()">
                  Escolher categoria existente
                </button>
              }
            </label>
            <label class="field">
              <span>Data</span>
              <input name="date" required type="date" [(ngModel)]="form.date" />
            </label>
            <label class="field">
              <span>Conta</span>
              <input
                name="account"
                required
                [(ngModel)]="form.account"
                placeholder="Ex.: Conta principal"
              />
            </label>
            <div class="button-row field--wide">
              <button class="primary-button" type="submit">
                {{ editingId ? 'Salvar alterações' : 'Adicionar transação' }}
              </button>
              <button class="secondary-button" type="button" (click)="closeForm()">Cancelar</button>
            </div>
          </form>
        </ds-modal>
      }
    </section>
  `,
})
export class Transactions implements OnDestroy {
  protected readonly transactionsService = inject(TransactionsService);
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
      ? 'Transação atualizada com sucesso.'
      : 'Transação criada com sucesso.';
  }

  protected remove(transaction: Transaction): void {
    if (window.confirm(`Excluir a transação "${transaction.description}"?`)) {
      this.transactionsService.delete(transaction.id);
      this.feedbackMessage = 'Transação excluída com sucesso.';
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
      account: 'Conta principal',
    };
  }
}
