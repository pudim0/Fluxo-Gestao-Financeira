import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';

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
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly title = signal('Fluxo');
  protected readonly theme = signal<'dark' | 'light'>(this.resolveInitialTheme());
  protected readonly sidebarOpen = signal(false);

  constructor() {
    this.applyTheme(this.theme());
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
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    this.persistTheme(nextTheme);
    this.applyTheme(nextTheme);
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((current) => !current);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  @HostListener('window:keydown.escape')
  protected closeSidebarOnEscape(): void {
    this.closeSidebar();
  }

  private resolveInitialTheme(): 'dark' | 'light' {
    const storedTheme = this.readStoredTheme();

    if (storedTheme) {
      return storedTheme;
    }

    return this.document.defaultView?.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  private readStoredTheme(): 'dark' | 'light' | null {
    try {
      const storedTheme = localStorage.getItem('fluxo.theme');

      return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
    } catch {
      return null;
    }
  }

  private persistTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem('fluxo.theme', theme);
    } catch {
      // Local storage may be unavailable in some test environments.
    }
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
