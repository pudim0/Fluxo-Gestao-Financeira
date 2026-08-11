import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

type NavigationItem = {
  label: string;
  hint: string;
  route: string;
};

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly title = signal('Fluxo');
  protected readonly theme = signal<'dark' | 'light'>('dark');
  protected readonly sidebarOpen = signal(false);

  constructor() {
    this.syncTheme();
  }

  protected readonly navigation: NavigationItem[] = [
    { label: 'Onboarding', hint: 'Primeiro acesso e configuração', route: '/onboarding' },
    { label: 'Login', hint: 'Entrar na conta', route: '/login' },
    { label: 'Dashboard', hint: 'Visão geral e KPIs', route: '/dashboard' },
    { label: 'Transações', hint: 'Entradas e saídas', route: '/transacoes' },
    { label: 'Orçamento', hint: 'Limites e categorias', route: '/orcamento' },
    { label: 'Relatórios', hint: 'Análises e gráficos', route: '/relatorios' },
    { label: 'Metas', hint: 'Objetivos financeiros', route: '/metas' },
    { label: 'Configurações', hint: 'Perfil e preferências', route: '/configuracoes' },
    { label: 'Notificações', hint: 'Alertas e pendências', route: '/notificacoes' }
  ];

  protected toggleTheme(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
    this.syncTheme();
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((current) => !current);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  private syncTheme(): void {
    this.document.documentElement.setAttribute('data-theme', this.theme());
  }
}
