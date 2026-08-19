import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Card as DsCard } from '../../shared/components/design-system/card/card';

interface Goal {
  id: number;
  icon: string;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  deadline: string;
  deadlineLabel: string;
  priority: number;
}

interface ChartEntry {
  month: string;
  value: number;
}

interface ChartPoint {
  x: number;
  y: number;
  month: string;
  value: string;
  position: number;
}

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, DsCard],
  styleUrl: './goals.css',
  templateUrl: './goals.html',
})
export class Goals {
  private readonly storageKey = 'fluxo.goals.state';
  protected readonly monthlyIncome = 6000;
  protected readonly assistantResponse = signal('');
  readonly goals = signal<Goal[]>([
    {
      id: 1,
      icon: '✈',
      name: 'Viagem para o litoral',
      target: 6000,
      saved: 2100,
      monthly: 400,
      deadline: '2026-12',
      deadlineLabel: 'Dez 2026',
      priority: 2,
    },
    {
      id: 2,
      icon: '▣',
      name: 'Reserva de emergência',
      target: 18000,
      saved: 7200,
      monthly: 600,
      deadline: '2027-06',
      deadlineLabel: 'Jun 2027',
      priority: 1,
    },
    {
      id: 3,
      icon: '▱',
      name: 'Notebook para trabalho',
      target: 5000,
      saved: 1500,
      monthly: 250,
      deadline: '2027-02',
      deadlineLabel: 'Fev 2027',
      priority: 3,
    },
    {
      id: 4,
      icon: '◆',
      name: 'Curso profissional',
      target: 3600,
      saved: 900,
      monthly: 200,
      deadline: '2026-10',
      deadlineLabel: 'Out 2026',
      priority: 4,
    },
  ]);
  protected readonly totalTarget = computed(() =>
    this.goals().reduce((total, goal) => total + goal.target, 0),
  );
  protected readonly totalSaved = computed(() =>
    this.goals().reduce((total, goal) => total + goal.saved, 0),
  );
  protected readonly overallProgress = computed(() =>
    Math.round((this.totalSaved() / this.totalTarget()) * 1000) / 10,
  );
  protected readonly monthlyTarget = computed(() =>
    this.goals().reduce((total, goal) => total + goal.monthly, 0),
  );
  readonly monthlySaved = signal(1050);
  protected readonly monthlyProgress = computed(() =>
    Math.round((this.monthlySaved() / this.monthlyTarget()) * 100),
  );
  protected readonly nextGoal = computed(() =>
    this.goals().reduce((next, goal) => (goal.priority < next.priority ? goal : next)),
  );
  readonly chartValues = signal([7200, 8100, 9500, 8900, 10400, 11700]);
  readonly chartData = computed<ChartEntry[]>(() => {
    const currentDate = new Date();
    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
    const values = this.chartValues();

    return values.map((value, index) => {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - (values.length - index - 1),
        1,
      );

      return {
        month: monthFormatter.format(monthDate).replace('.', ''),
        value,
      };
    });
  });
  protected readonly activeChartPoint = signal<ChartPoint | null>(null);
  protected readonly chartPoints = computed(() => this.buildChartPoints(this.chartData()));
  protected readonly chartPolyline = computed(() =>
    this.chartPoints()
      .map((point) => `${point.x},${point.y}`)
      .join(' '),
  );

  constructor() {
    this.restoreState();
  }

  protected showChartPoint(point: ChartPoint): void {
    this.activeChartPoint.set(point);
  }

  protected hideChartPoint(): void {
    this.activeChartPoint.set(null);
  }

  addContribution(goalId: number, amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const goal = this.goals().find((item) => item.id === goalId);
    const appliedAmount = goal ? Math.min(amount, goal.target - goal.saved) : 0;
    if (appliedAmount <= 0) {
      return;
    }

    this.goals.update((goals) =>
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, saved: Math.min(goal.target, goal.saved + amount) } : goal,
      ),
    );
    this.monthlySaved.update((saved) => saved + appliedAmount);
    this.syncChartWithGoals();
    this.persistState();
  }

  removeContribution(goalId: number, amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const goal = this.goals().find((item) => item.id === goalId);
    const appliedAmount = goal ? Math.min(amount, goal.saved) : 0;
    if (appliedAmount <= 0) {
      return;
    }

    this.goals.update((goals) =>
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, saved: Math.max(0, goal.saved - amount) } : goal,
      ),
    );
    this.monthlySaved.update((saved) => Math.max(0, saved - appliedAmount));
    this.syncChartWithGoals();
    this.persistState();
  }

  removeGoal(goalId: number): void {
    if (this.goals().length <= 1) {
      return;
    }

    const goal = this.goals().find((item) => item.id === goalId);
    if (!goal || !window.confirm(`Excluir a meta "${goal.name}"?`)) {
      return;
    }

    this.goals.update((goals) => goals.filter((item) => item.id !== goalId));
    this.syncChartWithGoals();
    this.persistState();
  }

  addGoal(name: string, target: number, monthly: number, deadline: string, icon = '●'): void {
    const cleanName = name.trim();
    if (!cleanName || !Number.isFinite(target) || target <= 0 || !Number.isFinite(monthly) || monthly <= 0 || !deadline) {
      return;
    }

    const nextId = Math.max(0, ...this.goals().map((goal) => goal.id)) + 1;
    this.goals.update((goals) => [
      ...goals,
      {
        id: nextId,
        icon,
        name: cleanName,
        target,
        saved: 0,
        monthly,
        deadline,
        deadlineLabel: this.formatDeadline(deadline),
        priority: nextId,
      },
    ]);
    this.persistState();
  }

  askFinancialAssistant(question: string): void {
    const normalizedQuestion = question
      .trim()
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (!normalizedQuestion) {
      this.assistantResponse.set('Digite uma pergunta para eu analisar suas metas.');
      return;
    }

    const emergencyGoal = this.goals().find((goal) => goal.name.includes('emergência'))!;
    const tripGoal = this.goals().find((goal) => goal.name.includes('litoral'))!;

    if (normalizedQuestion.includes('reserva') || normalizedQuestion.includes('emergencia')) {
      this.assistantResponse.set(
        `Sua reserva está em ${this.formatCurrency(emergencyGoal.saved)} de ${this.formatCurrency(emergencyGoal.target)} (${this.goalProgress(emergencyGoal)}%). Com ${this.formatCurrency(emergencyGoal.monthly)}/mês, faltam aproximadamente ${this.formatCurrency(emergencyGoal.target - emergencyGoal.saved)} para completar.`,
      );
      return;
    }

    if (normalizedQuestion.includes('viagem') || normalizedQuestion.includes('litoral')) {
      this.assistantResponse.set(
        `A meta ${tripGoal.name} está em ${this.goalProgress(tripGoal)}%. Mantendo ${this.formatCurrency(tripGoal.monthly)}/mês, você chega a ${this.formatCurrency(tripGoal.target)} até ${tripGoal.deadlineLabel}.`,
      );
      return;
    }

    if (normalizedQuestion.includes('aporte') || normalizedQuestion.includes('mensal') || normalizedQuestion.includes('mes')) {
      const allocation = Math.round((this.monthlyTarget() / this.monthlyIncome) * 100);
      this.assistantResponse.set(
        `Hoje você planeja investir ${this.formatCurrency(this.monthlyTarget())} por mês, cerca de ${allocation}% da renda de ${this.formatCurrency(this.monthlyIncome)}. O valor é saudável, mas preserve uma margem para despesas inesperadas.`,
      );
      return;
    }

    if (normalizedQuestion.includes('salario') || normalizedQuestion.includes('renda') || normalizedQuestion.includes('organizar')) {
      this.assistantResponse.set(
        `Com uma renda de ${this.formatCurrency(this.monthlyIncome)}, suas metas consomem ${Math.round((this.monthlyTarget() / this.monthlyIncome) * 100)}% do mês. Priorize a reserva de emergência antes de aumentar metas de consumo.`,
      );
      return;
    }

    this.assistantResponse.set(
      'Posso analisar sua reserva de emergência, a viagem, o aporte mensal ou como organizar uma renda de R$ 6.000.',
    );
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private buildChartPoints(entries: ChartEntry[]): ChartPoint[] {
    if (!entries.length) {
      return [];
    }

    const chartWidth = 350;
    const chartHeight = 119;
    const chartLeft = 20;
    const chartTop = 29;
    const minimumValue = Math.min(...entries.map((entry) => entry.value));
    const maximumValue = Math.max(...entries.map((entry) => entry.value));
    const valueRange = maximumValue - minimumValue || 1;
    const lastIndex = Math.max(entries.length - 1, 1);

    return entries.map((entry, index) => {
      const position = index / lastIndex;
      const x = chartLeft + chartWidth * position;
      const y = chartTop + chartHeight - ((entry.value - minimumValue) / valueRange) * chartHeight;

      return {
        x,
        y,
        month: entry.month,
        value: this.formatCurrency(entry.value),
        position: (x / 420) * 100,
      };
    });
  }

  private goalProgress(goal: Goal): number {
    return Math.round((goal.saved / goal.target) * 100);
  }

  private syncChartWithGoals(): void {
    this.chartValues.update((values) =>
      values.length ? [...values.slice(0, -1), this.totalSaved()] : [this.totalSaved()],
    );
  }

  private persistState(): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          goals: this.goals(),
          monthlySaved: this.monthlySaved(),
          chartValues: this.chartValues(),
        }),
      );
    } catch {
    }
  }

  private restoreState(): void {
    try {
      const savedState = localStorage.getItem(this.storageKey);
      if (!savedState) {
        return;
      }

      const state = JSON.parse(savedState) as {
        goals?: Goal[];
        monthlySaved?: number;
        chartValues?: number[];
      };

      if (Array.isArray(state.goals) && state.goals.length > 0) {
        this.goals.set(state.goals);
      }
      if (typeof state.monthlySaved === 'number' && Number.isFinite(state.monthlySaved)) {
        this.monthlySaved.set(Math.max(0, state.monthlySaved));
      }
      if (Array.isArray(state.chartValues) && state.chartValues.length > 0) {
        this.chartValues.set(state.chartValues);
      }
    } catch {
    }
  }

  private formatDeadline(deadline: string): string {
    const [year, month] = deadline.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' })
      .format(new Date(year, month - 1, 1))
      .replace('.', '');
  }

}
