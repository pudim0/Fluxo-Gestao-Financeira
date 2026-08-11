import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export type DashboardMetricTone = 'positive' | 'warning' | 'neutral';

export interface DashboardMetric {
	label: string;
	value: string;
	detail: string;
	tone?: DashboardMetricTone;
}

export interface DashboardSummary {
	title: string;
	copy: string;
	highlights: string[];
	metrics: DashboardMetric[];
	transactions: string[][];
}

const DEFAULT_DASHBOARD_SUMMARY: DashboardSummary = {
	title: 'Resumo financeiro central',
	copy: 'Dados estruturados para alimentar o dashboard quando a API real entrar.',
	highlights: ['Saldo estável', 'Orçamento 78%', 'Alertas em dia'],
	metrics: [
		{ label: 'Saldo atual', value: 'R$ 15.430', detail: 'Acima da meta do mês', tone: 'positive' },
		{ label: 'Receitas', value: 'R$ 8.250', detail: 'Entradas consolidadas', tone: 'neutral' },
		{ label: 'Despesas', value: 'R$ 4.920', detail: 'Gastos sob controle', tone: 'warning' },
		{ label: 'Meta concluída', value: '78%', detail: 'Reserva de emergência', tone: 'positive' }
	],
	transactions: [
		['11 Ago', 'Mercado Central', 'Alimentação', '- R$ 182,40'],
		['10 Ago', 'Salário', 'Receita', '+ R$ 6.500,00'],
		['09 Ago', 'Assinatura', 'Software', '- R$ 89,90']
	]
};

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private readonly http = inject(HttpClient);
	private readonly apiBasePath = '/api';

	getDashboardSummary(): Observable<DashboardSummary> {
		return this.http.get<DashboardSummary>(`${this.apiBasePath}/dashboard-summary.json`).pipe(
			catchError(() => of(DEFAULT_DASHBOARD_SUMMARY))
		);
	}
}
