import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { Card as DsCard } from '../../shared/components/design-system/card/card';

const GOALS_STORAGE_PREFIX = 'fluxo.goals:';

export interface Goal {
  id: number;
  icon: string;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  deadlineLabel: string;
  contributionHistory?: Record<string, number>;
}

export interface ChartPoint {
  month: string;
  value: string;
  rawAmount: number;
  x: number;
  y: number;
  position: number;
}

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, DsCard],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
})
export class GoalsComponent {
  private readonly authService = inject(AuthService);
  readonly goals = signal<Goal[]>(this.readGoals());

  readonly currentIndex = signal<number>(0);
  readonly activeChartPoint = signal<ChartPoint | null>(null);
  readonly assistantResponse = signal<string | null>(null);

  // --- Indicadores Calculados (Computed Signals) ---
  readonly totalTarget = computed(() => this.goals().reduce((acc, goal) => acc + goal.target, 0));

  readonly totalSaved = computed(() => this.goals().reduce((acc, goal) => acc + goal.saved, 0));

  readonly overallProgress = computed(() => {
    const target = this.totalTarget();
    return target > 0 ? Math.round((this.totalSaved() / target) * 100) : 0;
  });

  readonly monthlyTarget = computed(() =>
    this.goals().reduce((acc, goal) => acc + goal.monthly, 0),
  );

  readonly monthlyProgress = computed(() => 78);

  readonly nextGoal = computed(() => {
    const currentGoals = this.goals();
    return currentGoals.length > 0 ? currentGoals[0] : { name: 'Sem metas', deadlineLabel: '-' };
  });

  // --- Gráfico de Evolução ---
  readonly chartData = computed(() => {
    const goal = this.goals()[this.currentIndex()];
    if (!goal) return [];

    const currentDate = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5 + index, 1);
      const monthsAgo = 5 - index;
      const monthKey = this.getMonthKey(monthDate);
      const contributions = Object.entries(goal.contributionHistory ?? {});
      const recordedContributions = contributions.reduce((sum, [key, value]) => {
        return key <= monthKey ? sum + value : sum;
      }, 0);
      const totalRecorded = contributions.reduce((sum, [, value]) => sum + value, 0);
      const baselineSaved = Math.max(0, goal.saved - totalRecorded);
      const baseline = Math.max(0, baselineSaved - goal.monthly * monthsAgo);
      const amount = Math.min(goal.target, baseline + recordedContributions);

      return {
        month: monthDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        amount: Math.round(amount * 100) / 100,
      };
    });
  });

  readonly chartPoints = computed<ChartPoint[]>(() => {
    const data = this.chartData();
    if (data.length === 0) return [];

    const maxVal = Math.max(...data.map((d) => d.amount)) || 1;
    const width = 420;
    const height = 140;
    const paddingX = 30;

    return data.map((d, index) => {
      const x = paddingX + (index / Math.max(data.length - 1, 1)) * (width - paddingX * 2);
      const y = height - (d.amount / maxVal) * (height - 30) + 20;
      const position = (x / width) * 100;

      return {
        month: d.month,
        value: `R$ ${d.amount.toLocaleString('pt-BR')}`,
        rawAmount: d.amount,
        x,
        y,
        position,
      };
    });
  });

  readonly chartPolyline = computed(() =>
    this.chartPoints()
      .map((p) => `${p.x},${p.y}`)
      .join(' '),
  );

  // --- Ações do Carrossel ---
  goToPreviousGoal(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  goToNextGoal(): void {
    if (this.currentIndex() < this.goals().length - 1) {
      this.currentIndex.update((i) => i + 1);
    }
  }

  goToGoal(index: number): void {
    this.currentIndex.set(index);
  }

  // --- Ações de Gestão de Metas ---
  addGoal(name: string, target: number, monthly: number, deadline: string): void {
    if (!name || !target) return;

    const newGoal: Goal = {
      id: Date.now(),
      icon: '🎯',
      name,
      target,
      saved: 0,
      monthly: monthly || 0,
      deadlineLabel: deadline ? deadline.split('-').reverse().join('/') : 'A definir',
      contributionHistory: {},
    };

    this.goals.update((items) => [...items, newGoal]);
    this.currentIndex.set(this.goals().length - 1);
    this.persistGoals();
  }

  addContribution(goalId: number, amount: number): void {
    if (!amount || amount <= 0) return;
    this.goals.update((items) =>
      items.map((g) =>
        g.id === goalId
          ? {
              ...g,
              saved: g.saved + amount,
              contributionHistory: this.updateContributionHistory(g, amount),
            }
          : g,
      ),
    );
    this.persistGoals();
  }

  removeContribution(goalId: number, amount: number): void {
    if (!amount || amount <= 0) return;
    this.goals.update((items) =>
      items.map((g) =>
        g.id === goalId
          ? {
              ...g,
              saved: Math.max(0, g.saved - amount),
              contributionHistory: this.updateContributionHistory(g, -amount),
            }
          : g,
      ),
    );
    this.persistGoals();
  }

  removeGoal(goalId: number): void {
    const goal = this.goals().find((item) => item.id === goalId);
    if (!goal || !window.confirm(`Excluir a meta "${goal.name}"?`)) {
      return;
    }

    this.goals.update((items) => items.filter((g) => g.id !== goalId));
    if (this.currentIndex() >= this.goals().length && this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
    this.persistGoals();
  }

  // --- Interações com Gráfico e IA ---
  showChartPoint(point: ChartPoint): void {
    this.activeChartPoint.set(point);
  }

  hideChartPoint(): void {
    this.activeChartPoint.set(null);
  }

  askFinancialAssistant(question: string): void {
    if (!question.trim()) return;
    this.assistantResponse.set(
      `Analisando sua pergunta ("${question}")... Com base nos seus aportes atuais, manter o ritmo reduzirá seu prazo geral em até 2 meses.`,
    );
  }

  private readGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        return JSON.parse(stored) as Goal[];
      }
    } catch {
      return this.defaultGoals();
    }

    return this.defaultGoals();
  }

  private persistGoals(): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.goals()));
    } catch {
      // Storage may be unavailable in some test environments.
    }
  }

  private getStorageKey(): string {
    const email = this.authService.getCurrentUserEmail() ?? 'anonymous';
    return `${GOALS_STORAGE_PREFIX}${email}`;
  }

  private updateContributionHistory(goal: Goal, amount: number): Record<string, number> {
    const monthKey = this.getMonthKey(new Date());
    const history = { ...(goal.contributionHistory ?? {}) };
    const nextAmount = (history[monthKey] ?? 0) + amount;

    if (nextAmount > 0) {
      history[monthKey] = nextAmount;
    } else {
      delete history[monthKey];
    }

    return history;
  }

  private getMonthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private defaultGoals(): Goal[] {
    return [
      {
        id: 1,
        icon: '🛡️',
        name: 'Reserva de emergência',
        target: 15000,
        saved: 12000,
        monthly: 500,
        deadlineLabel: '12/2026',
      },
      {
        id: 2,
        icon: '✈️',
        name: 'Viagem Europa',
        target: 20000,
        saved: 6000,
        monthly: 800,
        deadlineLabel: '07/2027',
      },
      {
        id: 3,
        icon: '🚗',
        name: 'Troca de carro',
        target: 35000,
        saved: 22000,
        monthly: 1200,
        deadlineLabel: '11/2027',
      },
    ];
  }
}
