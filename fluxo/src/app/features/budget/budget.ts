import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { TransactionsService } from '../../services/transactions.service';
import { Card as DsCard } from '../../shared/components/design-system/card/card';

interface BudgetLimit {
  category: string;
  amount: number;
}

interface BudgetRow extends BudgetLimit {
  spent: number;
  percentage: number;
  isOverLimit: boolean;
}

const STORAGE_PREFIX = 'fluxo.budgets:';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, DsCard],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Orçamento</p>
          <h2 class="page-title">Categorias, limites e disciplina</h2>
          <p class="page-copy">Acompanhe o consumo mensal e ajuste seus limites por categoria.</p>
        </div>
        <div class="page-actions">
          <label class="field"><span>Mês</span><input type="month" [value]="selectedMonth()" (change)="selectedMonth.set($any($event.target).value)" /></label>
          <button class="primary-button" type="button" (click)="openForm()">Novo limite</button>
        </div>
      </header>

      @if (feedback()) {
        <section class="state-card action-feedback" role="status">{{ feedback() }}</section>
      }

      <section class="page-grid">
        <ds-card eyebrow="Categorias" title="Distribuição mensal" subtitle="Despesas do mês atual comparadas aos limites definidos.">
          @if (rows().length) {
            <div class="progress-list">
              @for (row of rows(); track row.category) {
                <article class="progress-item">
                  <div class="progress-top"><span>{{ row.category }}</span><strong [class.expense-value]="row.isOverLimit">{{ row.percentage }}%</strong></div>
                  <div class="progress-track" role="progressbar" [attr.aria-valuenow]="row.percentage" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-fill" [style.width.%]="Math.min(row.percentage, 100)"></div>
                  </div>
                  <div class="progress-top"><small>{{ row.spent | currency: 'BRL' }} gastos</small><small>Limite: {{ row.amount | currency: 'BRL' }}</small></div>
                  <div class="button-row">
                    <button class="ghost-button" type="button" (click)="edit(row)">Editar</button>
                    <button class="ghost-button danger-button" type="button" (click)="remove(row.category)">Remover</button>
                  </div>
                </article>
              }
            </div>
          } @else {
            <p class="page-copy">Defina seu primeiro limite para começar a acompanhar o mês.</p>
          }
        </ds-card>

        @if (alerts().length) {
          <ds-card eyebrow="Alertas" title="Atenção aos limites" subtitle="Categorias que ultrapassaram o orçamento selecionado.">
            <div class="tag-row">
              @for (alert of alerts(); track alert.category) {
                <span class="tag expense-value">{{ alert.category }}: {{ alert.percentage }}% do limite</span>
              }
            </div>
          </ds-card>
        }

        <ds-card eyebrow="Resumo" title="Visão do mês" subtitle="Totais baseados nas suas transações.">
          <div class="transaction-summary">
            <span><small>Despesas</small><strong class="expense-value">{{ monthExpense() | currency: 'BRL' }}</strong></span>
            <span><small>Limites</small><strong>{{ totalLimits() | currency: 'BRL' }}</strong></span>
            <span><small>Disponível</small><strong [class.expense-value]="remaining() < 0">{{ remaining() | currency: 'BRL' }}</strong></span>
          </div>
        </ds-card>
      </section>

      @if (formOpen()) {
        <section class="transaction-form-panel" aria-labelledby="budget-form-title">
          <div class="card-head"><div><p class="page-kicker">Planejamento</p><h3 id="budget-form-title">{{ editing() ? 'Editar limite' : 'Novo limite' }}</h3></div><button class="icon-button" type="button" aria-label="Fechar formulário" (click)="closeForm()">✕</button></div>
          <form class="transaction-form" (ngSubmit)="save()">
            <label class="field"><span>Categoria</span><input name="category" required [(ngModel)]="form.category" placeholder="Ex.: Alimentação" /></label>
            <label class="field"><span>Limite mensal</span><input name="amount" required type="number" min="0.01" step="0.01" [(ngModel)]="form.amount" /></label>
            <div class="button-row field--wide"><button class="primary-button" type="submit">Salvar limite</button><button class="secondary-button" type="button" (click)="closeForm()">Cancelar</button></div>
          </form>
        </section>
      }
    </section>
  `,
})
export class Budget {
  private readonly auth = inject(AuthService);
  private readonly transactions = inject(TransactionsService);
  private readonly limitsState = signal<BudgetLimit[]>(this.readLimits());

  protected readonly Math = Math;
  protected readonly limits = this.limitsState.asReadonly();
  protected readonly formOpen = signal(false);
  protected readonly editing = signal<string | null>(null);
  protected readonly feedback = signal('');
  protected readonly selectedMonth = signal(new Date().toISOString().slice(0, 7));
  protected form: BudgetLimit = { category: '', amount: 0 };

  protected readonly monthExpense = computed(() => {
    const month = this.selectedMonth();
    return this.transactions.transactions().filter((item) => item.type === 'expense' && item.date.startsWith(month)).reduce((sum, item) => sum + item.amount, 0);
  });

  protected readonly rows = computed<BudgetRow[]>(() => {
    const month = this.selectedMonth();
    const spent = new Map<string, number>();
    for (const item of this.transactions.transactions()) {
      if (item.type === 'expense' && item.date.startsWith(month)) spent.set(item.category, (spent.get(item.category) ?? 0) + item.amount);
    }
    return this.limits().map((limit) => {
      const value = spent.get(limit.category) ?? 0;
      return { ...limit, spent: value, percentage: limit.amount ? Math.round((value / limit.amount) * 100) : 0, isOverLimit: value > limit.amount };
    });
  });

  protected readonly totalLimits = computed(() => this.limits().reduce((sum, item) => sum + item.amount, 0));
  protected readonly remaining = computed(() => this.totalLimits() - this.monthExpense());
  protected readonly alerts = computed(() => this.rows().filter((row) => row.isOverLimit));

  constructor() { this.transactions.load(); }

  protected openForm(): void { this.editing.set(null); this.form = { category: '', amount: 0 }; this.formOpen.set(true); }
  protected edit(row: BudgetRow): void { this.editing.set(row.category); this.form = { category: row.category, amount: row.amount }; this.formOpen.set(true); }
  protected closeForm(): void { this.formOpen.set(false); this.editing.set(null); }

  protected save(): void {
    const category = this.form.category.trim();
    const amount = Number(this.form.amount);
    if (!category || !Number.isFinite(amount) || amount <= 0) return;
    const current = this.editing();
    const next = current ? this.limits().map((item) => item.category === current ? { category, amount } : item) : [...this.limits(), { category, amount }];
    this.limitsState.set(this.unique(next));
    this.persist();
    this.feedback.set(`Limite de ${category} salvo.`);
    this.closeForm();
  }

  protected remove(category: string): void {
    this.limitsState.update((items) => items.filter((item) => item.category !== category));
    this.persist();
    this.feedback.set(`Limite de ${category} removido.`);
  }

  private readLimits(): BudgetLimit[] {
    try { const raw = localStorage.getItem(this.key()); return raw ? this.unique(JSON.parse(raw) as BudgetLimit[]) : []; } catch { return []; }
  }
  private persist(): void { try { localStorage.setItem(this.key(), JSON.stringify(this.limits())); } catch { /* Storage may be unavailable. */ } }
  private key(): string { return `${STORAGE_PREFIX}${this.auth.getCurrentUserEmail() ?? 'anonymous'}`; }
  private unique(items: BudgetLimit[]): BudgetLimit[] { return [...new Map(items.filter((item) => item.category.trim() && item.amount > 0).map((item) => [item.category.trim(), { category: item.category.trim(), amount: item.amount }])).values()]; }
}
