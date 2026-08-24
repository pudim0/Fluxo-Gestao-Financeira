import { Component, computed, inject, signal } from '@angular/core';

import { NotificationCenterService } from '../../services/notification-center.service';

export interface NotificationSummary {
  label: string;
  count: number;
  tone: 'danger' | 'warning' | 'success' | 'info';
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
  private readonly notificationCenter = inject(NotificationCenterService);
  // --- Estado Reativo (Signals) ---
  readonly activeCategory = signal<string>('Todas');
  readonly notifications = this.notificationCenter.notifications;

  // --- Indicadores Calculados (Computed) ---
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  readonly unreadNotifications = computed(() =>
    this.notifications().filter((notification) => !notification.read),
  );

  readonly summaries = computed<NotificationSummary[]>(() => {
    const list = this.unreadNotifications();
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
    const list = this.unreadNotifications();
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
    this.notificationCenter.markAllAsRead();
  }

  markAsRead(id: number): void {
    this.notificationCenter.markAsRead(id);
  }
}
