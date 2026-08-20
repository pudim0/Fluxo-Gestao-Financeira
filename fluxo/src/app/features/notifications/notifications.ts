import { Component } from '@angular/core';

interface NotificationSummary {
  label: string;
  count: number;
  tone: 'danger' | 'warning' | 'success' | 'info';
}

interface NotificationItem {
  id: number;
  icon: string;
  tone: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  category: string;
  message: string;
  elapsed: string;
  amount: string;
  amountTone: 'positive' | 'negative';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  protected readonly activeSummary = 'Alertas';

  protected readonly summaries: NotificationSummary[] = [
    { label: 'Alertas', count: 4, tone: 'danger' },
    { label: 'Lembretes', count: 2, tone: 'warning' },
    { label: 'Transações', count: 4, tone: 'success' },
    { label: 'Metas', count: 2, tone: 'info' },
  ];

  protected readonly notifications: NotificationItem[] = [
    {
      id: 1,
      icon: '⚠',
      tone: 'danger',
      title: 'Limite de gasto atingido',
      category: 'Alerta',
      message: 'Você atingiu 90% do seu limite mensal em Alimentação. Meta: R$ 1.100,00',
      elapsed: '12 min',
      amount: 'R$ 980,00',
      amountTone: 'negative',
    },
    {
      id: 2,
      icon: '↧',
      tone: 'success',
      title: 'Compra detectada',
      category: 'Transação',
      message: 'iFood — pagamento aprovado no cartão Nubank',
      elapsed: '45 min',
      amount: '-R$ 47,90',
      amountTone: 'negative',
    },
    {
      id: 3,
      icon: '★',
      tone: 'success',
      title: 'Meta em economia atingida',
      category: 'Meta',
      message: 'Você atingiu 72% da sua meta de economia para Viagem Europa 2027. Continue assim!',
      elapsed: '2 h',
      amount: 'R$ 540,00',
      amountTone: 'positive',
    },
    {
      id: 4,
      icon: '◔',
      tone: 'warning',
      title: 'Fatura vencendo em breve',
      category: 'Lembrete',
      message: 'Fatura Nubank de R$ 1.230,00 vence em 8 dias. Evite juros pagando agora.',
      elapsed: '4 h',
      amount: 'R$ 1.230,00',
      amountTone: 'positive',
    },
  ];
}
