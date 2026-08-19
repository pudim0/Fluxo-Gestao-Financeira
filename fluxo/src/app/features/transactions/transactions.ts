import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { NewTransaction, Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, DsCard],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Transações</p>
          <h2 class="page-title">Movimentações recentes e recorrentes</h2>
          <p class="page-copy">Registre cada entrada e saída para manter o dashboard atualizado.</p>
        </div>
        <button class="primary-button" type="button" (click)="startCreate()">Nova transação</button>
      </header>

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
              <select [value]="selectedCategory" (change)="selectedCategory = $any($event.target).value">
                <option value="">Todas</option>
                @for (category of transactionsService.categories(); track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>
            </label>
            <label class="field">
              <span>De</span>
              <input type="date" [value]="startDate" (change)="startDate = $any($event.target).value" />
            </label>
            <label class="field">
              <span>Até</span>
              <input type="date" [value]="endDate" (change)="endDate = $any($event.target).value" />
            </label>
          </div>
        </ds-card>

        <ds-card
          eyebrow="Resumo"
          title="Período filtrado"
          subtitle="Valores calculados a partir dos resultados visíveis."
        >
          <div class="transaction-summary">
            <span><small>Resultados</small><strong>{{ filteredTransactions.length }}</strong></span>
            <span><small>Entradas</small><strong class="income-value">{{ filteredIncome | currency: 'BRL' }}</strong></span>
            <span><small>Saídas</small><strong class="expense-value">{{ filteredExpense | currency: 'BRL' }}</strong></span>
          </div>
        </ds-card>
      </section>

      @if (transactionsService.isLoading()) {
        <section class="state-card loading-state" aria-live="polite">
          <strong>Carregando transações</strong>
          <p>Buscando suas movimentações.</p>
        </section>
      } @else if (transactionsService.hasError()) {
        <section class="state-card" role="alert">
          <strong>Não foi possível carregar as transações.</strong>
          <button class="secondary-button" type="button" (click)="transactionsService.load()">Tentar novamente</button>
        </section>
      } @else if (filteredTransactions.length === 0) {
        <section class="state-card empty-state">
          <strong>Nenhuma transação encontrada</strong>
          <p>Adicione uma movimentação ou ajuste os filtros.</p>
        </section>
      } @else {
        <ds-card eyebrow="Extrato" title="Histórico de movimentações" subtitle="Edite ou remova qualquer registro do mock local.">
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
                    <td [class.income-value]="transaction.type === 'income'" [class.expense-value]="transaction.type === 'expense'">
                      {{ transaction.type === 'income' ? '+' : '-' }} {{ transaction.amount | currency: 'BRL' }}
                    </td>
                    <td class="transaction-actions">
                      <button class="ghost-button" type="button" (click)="startEdit(transaction)">Editar</button>
                      <button class="ghost-button danger-button" type="button" (click)="remove(transaction)">Excluir</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ds-card>
      }

      @if (formOpen) {
        <section class="transaction-form-panel" aria-labelledby="transaction-form-title">
          <div class="card-head">
            <div>
              <p class="page-kicker">{{ editingId ? 'Editar' : 'Nova' }} transação</p>
              <h3 id="transaction-form-title">Detalhes da movimentação</h3>
            </div>
            <button class="icon-button" type="button" aria-label="Fechar formulário" (click)="closeForm()">✕</button>
          </div>

          <form class="transaction-form" (ngSubmit)="save()">
            <label class="field field--wide">
              <span>Descrição</span>
              <input name="description" required [(ngModel)]="form.description" placeholder="Ex.: Conta de luz" />
            </label>
            <label class="field">
              <span>Valor</span>
              <input name="amount" required type="number" min="0.01" step="0.01" [(ngModel)]="form.amount" />
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
              <input name="category" required [(ngModel)]="form.category" placeholder="Ex.: Alimentação" />
            </label>
            <label class="field">
              <span>Data</span>
              <input name="date" required type="date" [(ngModel)]="form.date" />
            </label>
            <label class="field">
              <span>Conta</span>
              <input name="account" required [(ngModel)]="form.account" placeholder="Ex.: Conta principal" />
            </label>
            <div class="button-row field--wide">
              <button class="primary-button" type="submit">{{ editingId ? 'Salvar alterações' : 'Adicionar transação' }}</button>
              <button class="secondary-button" type="button" (click)="closeForm()">Cancelar</button>
            </div>
          </form>
        </section>
      }
    </section>
  `,
})
export class Transactions {
  protected readonly transactionsService = inject(TransactionsService);
  protected search = '';
  protected selectedType: TransactionType | '' = '';
  protected selectedCategory = '';
  protected startDate = '';
  protected endDate = '';
  protected formOpen = false;
  protected editingId: string | null = null;
  protected form: NewTransaction = this.emptyForm();

  protected get filteredTransactions(): Transaction[] {
    const search = this.search.trim().toLowerCase();
    return this.transactionsService.transactions().filter((transaction) => {
      const matchesSearch = !search || `${transaction.description} ${transaction.account}`.toLowerCase().includes(search);
      const matchesType = !this.selectedType || transaction.type === this.selectedType;
      const matchesCategory = !this.selectedCategory || transaction.category === this.selectedCategory;
      const matchesStart = !this.startDate || transaction.date >= this.startDate;
      const matchesEnd = !this.endDate || transaction.date <= this.endDate;
      return matchesSearch && matchesType && matchesCategory && matchesStart && matchesEnd;
    });
  }

  protected get filteredIncome(): number {
    return this.filteredTransactions.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0);
  }

  protected get filteredExpense(): number {
    return this.filteredTransactions.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0);
  }

  protected startCreate(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.formOpen = true;
  }

  protected startEdit(transaction: Transaction): void {
    this.editingId = transaction.id;
    this.form = { ...transaction };
    this.formOpen = true;
  }

  protected closeForm(): void {
    this.formOpen = false;
    this.editingId = null;
  }

  protected save(): void {
    const transaction = { ...this.form, amount: Number(this.form.amount) };
    if (this.editingId) {
      this.transactionsService.update(this.editingId, transaction);
    } else {
      this.transactionsService.create(transaction);
    }
    this.closeForm();
  }

  protected remove(transaction: Transaction): void {
    if (window.confirm(`Excluir a transação "${transaction.description}"?`)) {
      this.transactionsService.delete(transaction.id);
    }
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
