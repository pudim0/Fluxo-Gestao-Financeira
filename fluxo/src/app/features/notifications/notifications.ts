import { Component, computed, signal } from '@angular/core';

export interface NotificationSummary {
  label: string;
  count: number;
  tone: 'danger' | 'warning' | 'success' | 'info';
}

export interface NotificationItem {
  id: number;
  icon: string;
  tone: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  category: string;
  message: string;
  elapsed: string;
  amount?: string;
  amountTone?: 'positive' | 'negative';
  read: boolean;
}

export interface FeedTab {
  label: string;
  count: number;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  // --- Estado Reativo (Signals) ---
  readonly activeCategory = signal<string>('Todas');

  readonly notifications = signal<NotificationItem[]>([
    {
      id: 1,
      icon: '⚠',
      tone: 'danger',
      title: 'Limite de gasto atingido',
      category: 'Alertas',
      message: 'Você atingiu 90% do seu limite mensal em Alimentação. Meta: R$ 1.100,00',
      elapsed: '12 min',
      amount: 'R$ 980,00',
      amountTone: 'negative',
      read: false,
    },
    {
      id: 2,
      icon: '↧',
      tone: 'success',
      title: 'Compra detectada',
      category: 'Transações',
      message: 'iFood — pagamento aprovado no cartão Nubank',
      elapsed: '45 min',
      amount: '-R$ 47,90',
      amountTone: 'negative',
      read: false,
    },
    {
      id: 3,
      icon: '★',
      tone: 'success',
      title: 'Meta em economia atingida',
      category: 'Metas',
      message: 'Você atingiu 72% da sua meta de economia para Viagem Europa 2027.',
      elapsed: '2 h',
      amount: 'R$ 540,00',
      amountTone: 'positive',
      read: false,
    },
    {
      id: 4,
      icon: '◔',
      tone: 'warning',
      title: 'Fatura vencendo em breve',
      category: 'Lembretes',
      message: 'Fatura Nubank de R$ 1.230,00 vence em 8 dias.',
      elapsed: '4 h',
      amount: 'R$ 1.230,00',
      amountTone: 'positive',
      read: false,
    },
  ]);

  // --- Indicadores Calculados (Computed) ---
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  readonly summaries = computed<NotificationSummary[]>(() => {
    const list = this.notifications();
    return [
      {
        label: 'Alertas',
        count: list.filter((n) => n.category === 'Alertas').length,
        tone: 'danger',
      },
      {
        label: 'Lembretes',
        count: list.filter((n) => n.category === 'Lembretes').length,
        tone: 'warning',
      },
      {
        label: 'Transações',
        count: list.filter((n) => n.category === 'Transações').length,
        tone: 'success',
      },
      {
        label: 'Metas',
        count: list.filter((n) => n.category === 'Metas').length,
        tone: 'info',
      },
    ];
  });

  readonly tabs = computed<FeedTab[]>(() => {
    const list = this.notifications();
    return [
      { label: 'Todas', count: list.length },
      { label: 'Alertas', count: list.filter((n) => n.category === 'Alertas').length },
      { label: 'Lembretes', count: list.filter((n) => n.category === 'Lembretes').length },
      { label: 'Transações', count: list.filter((n) => n.category === 'Transações').length },
      { label: 'Metas', count: list.filter((n) => n.category === 'Metas').length },
    ];
  });

  readonly filteredNotifications = computed(() => {
    const category = this.activeCategory();
    if (category === 'Todas') {
      return this.notifications();
    }
    return this.notifications().filter((n) => n.category === category);
  });

  // --- Ações ---
  selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  markAsRead(notificationId: number): void {
    this.notifications.update((items) =>
      items.map((item) =>
        item.id === notificationId && !item.read
          ? { ...item, read: true }
          : item,
      ),
    );
  }

  markAllAsRead(): void {
    this.notifications.update((items) => items.map((item) => ({ ...item, read: true })));
  }
}
