import { Injectable, inject, signal } from '@angular/core';

import { AuthService } from '../core/services/auth.service';

const NOTIFICATION_STORAGE_PREFIX = 'fluxo.notifications:';

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

@Injectable({ providedIn: 'root' })
export class NotificationCenterService {
  private readonly authService = inject(AuthService);
  private readonly notificationState = signal<NotificationItem[]>(this.readNotifications());

  readonly notifications = this.notificationState.asReadonly();

  markAsRead(id: number): void {
    this.notificationState.update((items) => {
      const updated = items.map((item) => (item.id === id ? { ...item, read: true } : item));
      this.persist(updated);
      return updated;
    });
  }

  markAllAsRead(): void {
    this.notificationState.update((items) => {
      const updated = items.map((item) => ({ ...item, read: true }));
      this.persist(updated);
      return updated;
    });
  }

  private readNotifications(): NotificationItem[] {
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (raw) {
        return JSON.parse(raw) as NotificationItem[];
      }
    } catch {
      // Ignore storage parsing failures and use defaults.
    }

    return this.defaultNotifications();
  }

  private persist(notifications: NotificationItem[]): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(notifications));
    } catch {
      // Ignore persistence issues in restricted environments.
    }
  }

  private getStorageKey(): string {
    const email = this.authService.getCurrentUserEmail() ?? 'anonymous';
    return `${NOTIFICATION_STORAGE_PREFIX}${email}`;
  }

  private defaultNotifications(): NotificationItem[] {
    return [
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
    ];
  }
}
